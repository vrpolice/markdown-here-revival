/*
 * Copyright Charles He 2026
 * MIT License
 */

"use strict"

globalThis.MdhrPreviewHelpers = (() => {
  function createLatestTaskRunner(task) {
    let activeTask = null
    let rerunRequested = false

    return async function runLatest() {
      if (activeTask) {
        rerunRequested = true
        return activeTask
      }

      activeTask = (async () => {
        do {
          rerunRequested = false
          await task()
        } while (rerunRequested)
      })()

      try {
        return await activeTask
      } finally {
        activeTask = null
      }
    }
  }

  function debounceTrailing(callback, wait = 500) {
    let timer = null

    return function debounced(...args) {
      clearTimeout(timer)
      timer = setTimeout(() => callback.apply(this, args), wait)
    }
  }

  return {
    createLatestTaskRunner,
    debounceTrailing,
  }
})()
