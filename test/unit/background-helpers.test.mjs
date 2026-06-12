import assert from "node:assert/strict"
import test from "node:test"

import {
  normalizeBoolean,
  prepareBeforeSend,
  sendModeToComposeWindows,
  waitForNotificationResponse,
} from "../../extension/background-helpers.mjs"

test("normalizeBoolean accepts stored booleans and legacy string booleans", () => {
  assert.equal(normalizeBoolean(true), true)
  assert.equal(normalizeBoolean(false), false)
  assert.equal(normalizeBoolean("true"), true)
  assert.equal(normalizeBoolean("false"), false)
})

test("prepareBeforeSend leaves plain text messages unchanged", async () => {
  const result = await prepareBeforeSend({
    details: { isPlainText: true },
  })

  assert.deepEqual(result, {})
})

test("prepareBeforeSend cancels when loading options fails", async () => {
  let reportedError
  const result = await prepareBeforeSend({
    details: { isPlainText: false },
    loadOptions: async () => {
      throw new Error("storage unavailable")
    },
    reportRenderFailure: async (error) => {
      reportedError = error
    },
  })

  assert.deepEqual(result, { cancel: true })
  assert.match(reportedError.message, /storage unavailable/)
})

test("prepareBeforeSend leaves disabled markdown unchanged when warning is disabled", async () => {
  const result = await prepareBeforeSend({
    details: { isPlainText: false },
    markdownEnabled: false,
    forgotToRenderCheckEnabled: false,
  })

  assert.deepEqual(result, {})
})

test("prepareBeforeSend cancels when the unrendered-markdown check fails", async () => {
  let reportedError
  const result = await prepareBeforeSend({
    details: { isPlainText: false },
    markdownEnabled: false,
    forgotToRenderCheckEnabled: true,
    checkForMarkdown: async () => {
      throw new Error("compose script unavailable")
    },
    reportRenderFailure: async (error) => {
      reportedError = error
    },
  })

  assert.deepEqual(result, { cancel: true })
  assert.match(reportedError.message, /unavailable/)
})

test("prepareBeforeSend cancels when rendered content is empty", async () => {
  let reportedError
  const result = await prepareBeforeSend({
    details: { isPlainText: false },
    markdownEnabled: true,
    getRenderedContent: async () => "",
    reportRenderFailure: async (error) => {
      reportedError = error
    },
  })

  assert.deepEqual(result, { cancel: true })
  assert.match(reportedError.message, /empty/i)
})

test("prepareBeforeSend cancels when rendering throws", async () => {
  const result = await prepareBeforeSend({
    details: { isPlainText: false },
    markdownEnabled: true,
    getRenderedContent: async () => {
      throw new Error("preview timed out")
    },
    reportRenderFailure: async () => {},
  })

  assert.deepEqual(result, { cancel: true })
})

test("prepareBeforeSend still cancels when reporting the render failure throws", async () => {
  const result = await prepareBeforeSend({
    details: { isPlainText: false },
    markdownEnabled: true,
    getRenderedContent: async () => {
      throw new Error("preview timed out")
    },
    reportRenderFailure: async () => {
      throw new Error("notification unavailable")
    },
  })

  assert.deepEqual(result, { cancel: true })
})

test("prepareBeforeSend returns rendered body and disables mutations", async () => {
  let disabled = false
  const result = await prepareBeforeSend({
    details: { isPlainText: false },
    markdownEnabled: true,
    getRenderedContent: async () => "<p>Rendered</p>",
    disableMutationListener: async () => {
      disabled = true
    },
  })

  assert.equal(disabled, true)
  assert.deepEqual(result, {
    cancel: false,
    details: { body: "<p>Rendered</p>" },
  })
})

test("sendModeToComposeWindows sends numeric window IDs", async () => {
  const messages = []
  await sendModeToComposeWindows(
    [{ id: 41, tabs: [{ id: 101 }] }],
    "cp.set-modern-mode",
    async (message) => messages.push(message),
  )

  assert.deepEqual(messages, [{ action: "cp.set-modern-mode", windowId: 41 }])
})

function createEvent() {
  const listeners = new Set()
  return {
    addListener(listener) {
      listeners.add(listener)
    },
    removeListener(listener) {
      listeners.delete(listener)
    },
    emit(...args) {
      for (const listener of [...listeners]) {
        listener(...args)
      }
    },
    listenerCount() {
      return listeners.size
    },
  }
}

test("waitForNotificationResponse ignores events for other notifications and cleans up", async () => {
  const onButtonClicked = createEvent()
  const onClosed = createEvent()
  const onDismissed = createEvent()
  const responsePromise = waitForNotificationResponse({
    windowId: 7,
    notificationId: 12,
    onButtonClicked,
    onClosed,
    onDismissed,
  })

  onButtonClicked.emit(7, 11, "btn-ok")
  onButtonClicked.emit(8, 12, "btn-ok")
  onButtonClicked.emit(7, 12, "btn-ok")

  assert.equal(await responsePromise, "ok")
  assert.equal(onButtonClicked.listenerCount(), 0)
  assert.equal(onClosed.listenerCount(), 0)
  assert.equal(onDismissed.listenerCount(), 0)
})
