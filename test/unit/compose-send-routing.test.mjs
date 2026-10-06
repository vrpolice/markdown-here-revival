import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import vm from "node:vm"

const read = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8")

test("preview rendering is routed to and acknowledged by the compose window", async () => {
  const [composeScript, previewScript, backgroundScript] = await Promise.all([
    read("extension/composescript.js"),
    read("extension/compose_preview/compose_preview.js"),
    read("extension/backgroundscript.js"),
  ])

  assert.match(composeScript, /windowId,\s*doc_html: snapshot\.docHTML/)
  assert.match(previewScript, /request\.windowId !== context\.windowId/)
  assert.match(backgroundScript, /Preview did not confirm rendering/)
  assert.match(backgroundScript, /windowId: composeTab\.windowId/)
})

test("preview initialization waits for the iframe load event", async () => {
  const script = await read("extension/compose_preview/compose_preview.js")
  const start = script.indexOf("async function loadIFrame()")
  const end = script.indexOf("const previewReady =", start)
  let onLoad
  let assigned = false
  const frame = {
    addEventListener(event, handler, options) {
      assert.equal(event, "load")
      assert.equal(options.once, true)
      onLoad = handler
    },
    set srcdoc(value) {
      assert.equal(typeof onLoad, "function")
      assert.ok(value.startsWith("<!DOCTYPE html>"))
      assigned = true
    },
  }
  const context = vm.createContext({
    p_iframe: frame,
    getMainCSS: async () => "",
    getSyntaxCSS: async () => "",
    fetchExtFile: async () => "<html><body></body></html>",
    parseHTMLFromString: (html) => ({ documentElement: { outerHTML: html } }),
  })
  vm.runInContext(script.slice(start, end), context)
  let completed = false
  const initialization = context.loadIFrame().then(() => {
    completed = true
  })
  await new Promise((resolve) => setImmediate(resolve))
  assert.equal(assigned, true)
  assert.equal(completed, false)
  onLoad()
  await initialization
  assert.equal(completed, true)
})

test("another compose window cannot claim the preview response", async () => {
  const script = await read("extension/compose_preview/compose_preview.js")
  const listenerSource = script.slice(
    script.lastIndexOf("messenger.runtime.onMessage.addListener("),
  )
  const makeListener = (windowId) => {
    let listener
    const context = vm.createContext({
      previewContext: { windowId, windowType: "messageCompose" },
      document: { getElementById: () => null },
      messenger: {
        runtime: {
          onMessage: {
            addListener(fn) {
              listener = fn
            },
          },
        },
      },
      renderMDEmail: async (html) => ({ imageSessionId: "session", html }),
    })
    vm.runInContext(listenerSource, context)
    return listener
  }
  const request = {
    action: "cp.render-preview",
    windowId: 2,
    doc_html: "Thanks",
  }
  const sender = { tab: { id: 10, windowId: 2 } }
  assert.equal(makeListener(1)(request, sender), false)
  const response = await makeListener(2)(request, sender)
  assert.equal(response.html, "Thanks")
  assert.equal(response.imageSessionId, "session")
})

test("reply preference failure does not stop preview initialization", async () => {
  const script = await read("extension/composescript.js")
  const start = script.indexOf("const composeWindowPromise =")
  const end = script.indexOf("async function looksLikeMarkdown", start)
  let renderCount = 0
  const errors = []
  const context = vm.createContext({
    composeWindowId: null,
    console: { error: (...args) => errors.push(args) },
    messenger: {
      runtime: {
        sendMessage: ({ action }) =>
          action === "compose-window"
            ? Promise.resolve({ windowId: 7 })
            : Promise.reject(new Error("Reply preferences unavailable")),
      },
    },
    requestPreviewRender: async () => {
      renderCount++
    },
  })
  vm.runInContext(script.slice(start, end), context)
  await new Promise((resolve) => setImmediate(resolve))
  assert.equal(renderCount, 1)
  assert.equal(await context.getComposeWindowId(), 7)
  assert.equal(errors.length, 1)
})
