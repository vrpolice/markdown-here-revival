/*
 * Copyright JFX 2021-2023
 * Copyright Adam Pritchard 2013-2016
 * MIT License
 */

"use strict"
// global autoEmoji, MdhrPreviewHelpers

const PREVIEW_IMAGE_ID_ATTRIBUTE = "data-mdhr-preview-image-id"
const imageStateByElement = new WeakMap()
const imageStateById = new Map()
let nextImageId = 0
let previewSessionId = null

let previewHidden = null

function requestHandler(request, sender, sendResponse) {
  if (request.action === "request-preview") {
    return requestPreviewRender()
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
  let mdMaybe = msgDocument.body.innerText
  // Ensure that we're not checking on enormous amounts of text.
  if (mdMaybe.length > 10000) {
    mdMaybe = mdMaybe.slice(0, 10000)
  }
  // At least two bullet points
  const bulletList = mdMaybe.match(/^[*+-] /gm)
  if (bulletList && bulletList.length > 1) {
    return true
  }

  // Backticks == code. Does anyone use backticks for anything else?
  const backticks = mdMaybe.match(/`/)
  if (backticks) {
    return true
  }

  // Math
  const math = mdMaybe.match(/\$([^ \t\n$]([^$]*[^ \t\n$])?)\$/)
  if (math) {
    return true
  }

  // We're going to look for strong emphasis (e.g., double asterisk), but not
  // light emphasis (e.g., single asterisk). Rationale: people use surrounding
  // single asterisks pretty often in ordinary, non-MD text, and we don't want
  // to be annoying.
  // TODO: If we ever get really fancy with MD detection, the presence of light
  // emphasis should still contribute towards the determination.
  const emphasis = mdMaybe.match(/__([\s\S]+?)__(?!_)|\*\*([\s\S]+?)\*\*(?!\*)/)
  if (emphasis) {
    return true
  }

  // Headers. (But not hash-mark-H1, since that seems more likely to false-positive, and
  // less likely to be used. And underlines of at least length 5.)
  const header = mdMaybe.match(/(^\s{0,3}#{2,6}[^#])|(^\s*[-=]{5,}\s*$)/m)
  if (header) {
    return true
  }

  // Links
  // I'm worried about incorrectly catching square brackets in rendered code
  // blocks, so we're only going to look for '](' and '][' (which still aren't
  // immune to the problem, but a little better). This means we won't match
  // reference links (where the text in the square brackes is used elsewhere for
  // for the link).
  const link = mdMaybe.match(/\]\(|\]\[/)
  if (link) {
    return true
  }

  return false
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
