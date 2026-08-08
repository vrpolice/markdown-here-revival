import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import vm from "node:vm"

const helperSource = await readFile(
  new URL("../../extension/compose-preview-helpers.js", import.meta.url),
  "utf8",
)
const context = vm.createContext({ clearTimeout, setTimeout })
vm.runInContext(helperSource, context)
const { createLatestTaskRunner, debounceTrailing, looksLikeMarkdownText } =
  context.MdhrPreviewHelpers

test("latest task runner coalesces updates while rendering", async () => {
  let callCount = 0
  let releaseFirstRun
  const runner = createLatestTaskRunner(async () => {
    callCount++
    if (callCount === 1) {
      await new Promise((resolve) => {
        releaseFirstRun = resolve
      })
    }
  })

  const firstRun = runner()
  await Promise.resolve()
  const secondRun = runner()
  const thirdRun = runner()
  releaseFirstRun()
  await Promise.all([firstRun, secondRun, thirdRun])

  assert.equal(callCount, 2)
})

test("trailing debounce renders only the latest update", async () => {
  const calls = []
  const debounced = debounceTrailing((value) => calls.push(value), 10)

  debounced("first")
  debounced("second")
  debounced("latest")
  await new Promise((resolve) => setTimeout(resolve, 30))

  assert.deepEqual(calls, ["latest"])
})

test("forgot-to-render detection recognizes common Markdown", () => {
  const markdownSamples = [
    "# Heading",
    "```js\nconst value = true\n```",
    "> Quoted text",
    "- [x] Completed task",
    "1. First\n2. Second",
    "1.\u00a0First\n2.\u00a0Second",
    "[Markdown Here](https://example.com)",
    "This is **important**",
  ]
  for (const sample of markdownSamples) {
    assert.equal(looksLikeMarkdownText(sample), true, sample)
  }
})

test("forgot-to-render detection avoids ordinary email text", () => {
  assert.equal(looksLikeMarkdownText("Hello Charles,\n\nThank you."), false)
  assert.equal(
    looksLikeMarkdownText("Meeting moved to 10:30 - confirmed."),
    false,
  )
  assert.equal(looksLikeMarkdownText("- One short note"), false)
})
