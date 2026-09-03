export function normalizeBoolean(value) {
  if (value === "true") {
    return true
  }
  if (value === "false") {
    return false
  }
  return Boolean(value)
}

export async function getRenderedContentWhenReady({
  requestRender,
  getRenderedContent,
  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  attempts = 5,
  retryDelay = 250,
}) {
  let lastError
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      // The preview iframe is injected asynchronously for newly opened compose
      // windows. Request a fresh render before reading it so a quick Send does
      // not capture the initial, empty preview document.
      await requestRender()
      const body = await getRenderedContent()
      if (body) {
        return body
      }
      lastError = new Error("Rendered Markdown content was empty")
    } catch (error) {
      lastError = error
    }
    if (attempt + 1 < attempts) {
      await wait(retryDelay)
    }
  }
  throw lastError || new Error("Unable to retrieve rendered Markdown content")
}

export async function prepareBeforeSend({
  details,
  loadOptions,
  markdownEnabled,
  forgotToRenderCheckEnabled,
  checkForMarkdown,
  confirmUnrenderedSend,
  getRenderedContent,
  disableMutationListener,
  reportRenderFailure,
}) {
  if (details.isPlainText) {
    return {}
  }

  try {
    const options = loadOptions ? await loadOptions() : {}
    const isMarkdownEnabled = normalizeBoolean(
      options.markdownEnabled ?? markdownEnabled,
    )
    const shouldCheckForMarkdown = normalizeBoolean(
      options.forgotToRenderCheckEnabled ?? forgotToRenderCheckEnabled,
    )
    if (!isMarkdownEnabled) {
      if (!shouldCheckForMarkdown) {
        return {}
      }
      const looksLikeMarkdown = await checkForMarkdown()
      if (!looksLikeMarkdown) {
        return {}
      }
      const shouldSend = await confirmUnrenderedSend()
      return shouldSend ? {} : { cancel: true }
    }

    const body = await getRenderedContent()
    if (!body) {
      throw new Error("Rendered Markdown content was empty")
    }
    if (disableMutationListener) {
      try {
        await disableMutationListener()
      } catch {
        // The message body is already captured, so observer cleanup is non-critical.
      }
    }
    return {
      cancel: false,
      details: { body },
    }
  } catch (error) {
    if (reportRenderFailure) {
      try {
        await reportRenderFailure(error)
      } catch {
        // Failure reporting must never turn a cancelled send into an uncaught error.
      }
    }
    return { cancel: true }
  }
}

export async function sendModeToComposeWindows(windows, action, sendMessage) {
  for (const win of windows) {
    await sendMessage({
      action,
      windowId: win.id,
    })
  }
}

export function waitForNotificationResponse({
  windowId,
  notificationId,
  onButtonClicked,
  onClosed,
  onDismissed,
}) {
  return new Promise((resolve) => {
    let settled = false

    const cleanup = () => {
      onButtonClicked.removeListener(onButtonClickedListener)
      onClosed.removeListener(onClosedListener)
      onDismissed.removeListener(onDismissedListener)
    }

    const finish = (response) => {
      if (settled) {
        return
      }
      settled = true
      cleanup()
      resolve(response)
    }

    const matches = (eventWindowId, eventNotificationId) =>
      eventWindowId === windowId && eventNotificationId === notificationId

    const onButtonClickedListener = (
      eventWindowId,
      eventNotificationId,
      buttonId,
    ) => {
      if (matches(eventWindowId, eventNotificationId)) {
        finish(buttonId === "btn-ok" ? "ok" : "cancel")
      }
    }
    const onClosedListener = (eventWindowId, eventNotificationId) => {
      if (matches(eventWindowId, eventNotificationId)) {
        finish("cancel")
      }
    }
    const onDismissedListener = (eventWindowId, eventNotificationId) => {
      if (matches(eventWindowId, eventNotificationId)) {
        finish("cancel")
      }
    }

    onButtonClicked.addListener(onButtonClickedListener)
    onClosed.addListener(onClosedListener)
    onDismissed.addListener(onDismissedListener)
  })
}
