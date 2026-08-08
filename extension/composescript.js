/*
 * Copyright JFX 2021-2023
 * Copyright Adam Pritchard 2013-2016
 * MIT License
 */

"use strict"
// global autoEmoji, MdhrPreviewHelpers

const PREVIEW_IMAGE_ID_ATTRIBUTE = "data-mdhr-preview-image-id"
const RAW_IMAGE_ID_ATTRIBUTE = "data-mdhr-raw-image-id"
const MDHR_RAW_PREFIX = "MDH:"
const imageStateByElement = new WeakMap()
const imageStateById = new Map()
let nextImageId = 0
let previewSessionId = null

let previewHidden = null

function requestHandler(request, sender, sendResponse) {
  if (request.action === "request-preview") {
    return requestPreviewRender()
  } else if (request.action === "classic-state") {
    return Promise.resolve(getClassicWrapper() ? "rendered" : "unrendered")
  } else if (request.action === "classic-render") {
    replaceEditorContents(request.html)
    return Promise.resolve("rendered")
  } else if (request.action === "classic-restore") {
    const originalHTML = getClassicOriginalHTML()
    if (originalHTML === undefined) {
      return Promise.resolve("unrendered")
    }
    replaceEditorContents(originalHTML)
    return Promise.resolve("unrendered")
  } else if (request.action === "md-preview-toggle") {
    previewHidden = request.value
    if (!previewHidden) {
      const scrolled = window.document.scrollingElement
      composeScroll(scrolled).then(() => {})
      loadEmojiCompleter().then(() => {})
    } else {
      if (emojiDestroy) {
        emojiDestroy()
        emojiDestroy = null
      }
    }
  } else if (request.action === "check-forgot-render") {
    return Promise.resolve(looksLikeMarkdown(window.document))
  } else if (request.action === "get-raw-html") {
    return Promise.resolve(window.document.documentElement.outerHTML)
  } else if (request.action === "disable-mutation-listener") {
    MsgMutationObserver.disconnect()
  }
  return Promise.resolve("okay")
}
messenger.runtime.onMessage.addListener(requestHandler)

function getClassicWrapper(doc = window.document) {
  const wrapper = doc.body.querySelector(":scope > div.markdown-here-wrapper")
  if (!wrapper?.querySelector(":scope > div.mdhr-raw")) {
    return null
  }
  return wrapper
}

function decodeBase64UTF8(base64) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.codePointAt(0))
  return new TextDecoder().decode(bytes)
}

function getClassicOriginalHTML() {
  const wrapper = getClassicWrapper()
  const rawHolder = wrapper?.querySelector(":scope > div.mdhr-raw")
  if (!rawHolder?.title.startsWith(MDHR_RAW_PREFIX)) {
    return undefined
  }
  const originalHTML = decodeBase64UTF8(
    rawHolder.title.slice(MDHR_RAW_PREFIX.length).replace(/\s/g, ""),
  )
  const originalDocument = new DOMParser().parseFromString(
    originalHTML,
    "text/html",
  )
  const renderedImages = new Map()
  for (const image of wrapper.querySelectorAll(
    `img[${RAW_IMAGE_ID_ATTRIBUTE}]`,
  )) {
    renderedImages.set(
      image.getAttribute(RAW_IMAGE_ID_ATTRIBUTE),
      image.getAttribute("src"),
    )
  }
  for (const image of originalDocument.body.querySelectorAll(
    `img[${RAW_IMAGE_ID_ATTRIBUTE}]`,
  )) {
    const source = renderedImages.get(
      image.getAttribute(RAW_IMAGE_ID_ATTRIBUTE),
    )
    if (source) {
      image.setAttribute("src", source)
    }
  }
  return originalDocument.body.innerHTML
}

function replaceEditorContents(html) {
  const body = window.document.body
  const range = window.document.createRange()
  const selection = window.getSelection()
  range.selectNodeContents(body)
  selection.removeAllRanges()
  selection.addRange(range)

  if (!window.document.execCommand("insertHTML", false, html)) {
    range.deleteContents()
    range.insertNode(range.createContextualFragment(html))
  }
  selection.removeAllRanges()
  const caret = window.document.createRange()
  caret.selectNodeContents(body)
  caret.collapse(false)
  selection.addRange(caret)
}

messenger.runtime.sendMessage({ action: "compose-data" }).then((response) => {
  if (response.reply_position === "bottom") {
    let mailBody = window.document.body
    let firstChild = mailBody.firstElementChild
    if (
      firstChild.nodeName === "DIV" &&
      firstChild.classList.contains("moz-cite-prefix")
    ) {
      let insertElem
      if (response.use_paragraph) {
        insertElem = window.document.createElement("p")
        insertElem.appendChild(window.document.createElement("br"))
      } else {
        insertElem = window.document.createElement("br")
      }
      mailBody.insertAdjacentElement("afterbegin", insertElem)
    }
  }
  return requestPreviewRender().then()
})

async function looksLikeMarkdown(msgDocument) {
  if (getClassicWrapper(msgDocument)) {
    return false
  }
  const content = msgDocument.body.cloneNode(true)
  for (const external of content.querySelectorAll(
    ":scope > blockquote[type='cite'], :scope > .moz-signature, :scope > div.moz-forward-container, div.mdhr-raw",
  )) {
    external.remove()
  }
  return MdhrPreviewHelpers.looksLikeMarkdownText(getDetectionText(content))
}

function getDetectionText(content) {
  for (const lineBreak of content.querySelectorAll("br")) {
    lineBreak.replaceWith("\n")
  }
  for (const block of content.querySelectorAll(
    "address, article, aside, blockquote, div, dl, fieldset, figure, footer, h1, h2, h3, h4, h5, h6, header, hr, li, main, nav, ol, p, pre, section, table, ul",
  )) {
    block.insertAdjacentText("beforebegin", "\n")
    block.insertAdjacentText("afterend", "\n")
  }
  return content.textContent
}

function createPreviewSnapshot() {
  const clonedDocument = window.document.documentElement.cloneNode(true)
  const sourceImages = [...window.document.querySelectorAll("img")]
  const clonedImages = [...clonedDocument.querySelectorAll("img")]
  const activeImageIds = new Set()
  const imageSources = {}

  sourceImages.forEach((sourceImage, index) => {
    const source = sourceImage.getAttribute("src")
    if (!source?.startsWith("data:")) {
      return
    }

    let imageState = imageStateByElement.get(sourceImage)
    if (!imageState || imageState.source !== source) {
      if (imageState) {
        imageStateById.delete(imageState.id)
      }
      imageState = {
        id: `compose-image-${nextImageId++}`,
        source,
        sentSessionId: undefined,
      }
      imageStateByElement.set(sourceImage, imageState)
      imageStateById.set(imageState.id, imageState)
    }

    activeImageIds.add(imageState.id)
    const clonedImage = clonedImages[index]
    if (clonedImage) {
      clonedImage.removeAttribute("src")
      clonedImage.setAttribute(PREVIEW_IMAGE_ID_ATTRIBUTE, imageState.id)
    }

    if (imageState.sentSessionId !== previewSessionId) {
      imageSources[imageState.id] = source
    }
  })

  for (const imageId of imageStateById.keys()) {
    if (!activeImageIds.has(imageId)) {
      imageStateById.delete(imageId)
    }
  }

  return {
    docHTML: clonedDocument.outerHTML,
    imageIds: [...activeImageIds],
    imageSources,
  }
}

async function sendPreviewSnapshot() {
  const snapshot = createPreviewSnapshot()
  const response = await messenger.runtime.sendMessage({
    action: "cp.render-preview",
    doc_html: snapshot.docHTML,
    image_ids: snapshot.imageIds,
    image_sources: snapshot.imageSources,
  })

  if (!response?.imageSessionId) {
    return
  }

  previewSessionId = response.imageSessionId
  for (const imageId of Object.keys(snapshot.imageSources)) {
    const imageState = imageStateById.get(imageId)
    if (imageState) {
      imageState.sentSessionId = previewSessionId
    }
  }

  for (const imageId of response.missingImageIds || []) {
    const imageState = imageStateById.get(imageId)
    if (imageState) {
      imageState.sentSessionId = undefined
    }
  }
  if (response.missingImageIds?.length > 0) {
    requestPreviewRender()
  }
}

const requestPreviewRender =
  MdhrPreviewHelpers.createLatestTaskRunner(sendPreviewSnapshot)
const debouncedRenderPreview = MdhrPreviewHelpers.debounceTrailing(
  requestPreviewRender,
  500,
)

let currentlyScrolling = null

function calculateScrollPercentage(elem) {
  const scrolledAvbSpace = elem.scrollHeight - elem.clientHeight
  const scrolledAmount =
    elem.scrollTop * (1 + elem.clientHeight / scrolledAvbSpace)
  return scrolledAmount / elem.scrollHeight
}

const clearCurrentlyScrolling = MdhrPreviewHelpers.debounceTrailing(() => {
  currentlyScrolling = null
}, 1000)

async function composeScroll(scrolled) {
  const percentage = calculateScrollPercentage(scrolled)
  if (currentlyScrolling && currentlyScrolling !== scrolled) {
    return
  }
  currentlyScrolling = scrolled
  await messenger.runtime.sendMessage({
    action: "cp.scroll-to",
    payload: { percentage: percentage },
  })
  clearCurrentlyScrolling()
}

window.addEventListener(
  "scroll",
  async function (e) {
    if (previewHidden) {
      return
    }
    const scrolled = e.target.scrollingElement
    await composeScroll(scrolled)
  },
  { capture: true, passive: true },
)

let MsgMutationObserver
async function editorMutationCb(mutationList, observer) {
  if (previewHidden) {
    return
  }
  // mutationList is an array of MutationRecord; skip pure-attribute
  // mutations (e.g. style recalc during window/splitter resize) unless
  // they are on IMG elements.
  const hasContentChange = mutationList.some((record) => {
    if (record.type === "characterData") return true
    if (
      record.type === "childList" &&
      (record.addedNodes.length > 0 || record.removedNodes.length > 0)
    ) {
      return true
    }
    if (record.type === "attributes" && record.target.nodeName === "IMG") {
      return true
    }
    return false
  })
  if (!hasContentChange) {
    return
  }
  return debouncedRenderPreview()
}

let emojiDestroy = null
async function loadEmojiCompleter() {
  if (!previewHidden) {
    const emojiCompleterEnabled = await messenger.runtime.sendMessage({
      action: "get-option",
      key: "emoji-autocomplete-enabled",
    })
    if (emojiCompleterEnabled === "true" || emojiCompleterEnabled === true) {
      if (!emojiDestroy) {
        emojiDestroy = autoEmoji.init()
      }
    }
  }
}

;(async () => {
  const mutation_config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  }
  MsgMutationObserver = new MutationObserver(editorMutationCb)
  MsgMutationObserver.observe(window.document.body, mutation_config)
  await loadEmojiCompleter()
})()

window.addEventListener(
  "pagehide",
  () => {
    previewHidden = true
    MsgMutationObserver?.disconnect()
    debouncedRenderPreview.cancel()
    clearCurrentlyScrolling.cancel()
    emojiDestroy?.()
    emojiDestroy = null
  },
  { once: true },
)
