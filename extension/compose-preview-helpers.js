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

    function debounced(...args) {
      clearTimeout(timer)
      timer = setTimeout(() => callback.apply(this, args), wait)
    }
    debounced.cancel = () => {
      clearTimeout(timer)
      timer = null
    }
    return debounced
  }

  function looksLikeMarkdownText(value) {
    const text = String(value || "")
      .slice(0, 10000)
      .replaceAll("\r\n", "\n")
      .replaceAll("\u00a0", " ")

    if (/^\s{0,3}(?:```|~~~)/m.test(text)) return true
    if (/^\s{0,3}#{1,6}[\t ]+\S/m.test(text)) return true
    if (/^\s*[-=]{5,}\s*$/m.test(text)) return true
    if (/^\s{0,3}>[\t ]+\S/m.test(text)) return true
    if (/^\s{0,3}[-+*][\t ]+\[[ xX]\][\t ]+\S/m.test(text)) return true
    if (/!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\]\[/m.test(text)) {
      return true
    }
    if (/`|\$([^ \t\n$]([^$]*[^ \t\n$])?)\$/m.test(text)) return true
    if (/__([\s\S]+?)__(?!_)|\*\*([\s\S]+?)\*\*(?!\*)/.test(text)) {
      return true
    }

    const bulletItems = text.match(/^\s{0,3}[-+*][\t ]+\S/gm) || []
    if (bulletItems.length > 1) return true
    const numberedItems = text.match(/^\s{0,3}\d+[.)][\t ]+\S/gm) || []
    return numberedItems.length > 1
  }

  return {
    createLatestTaskRunner,
    debounceTrailing,
    looksLikeMarkdownText,
  }
})()
