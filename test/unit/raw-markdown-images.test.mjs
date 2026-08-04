import assert from "node:assert/strict"
import test from "node:test"

import {
  RAW_IMAGE_ID_ATTRIBUTE,
  deduplicateRawMarkdownImages,
  restoreRawMarkdownImages,
} from "../../extension/raw-markdown-images.mjs"

class FakeImage {
  constructor(attributes = {}) {
    this.attributes = new Map(Object.entries(attributes))
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }

  removeAttribute(name) {
    this.attributes.delete(name)
  }

  setAttribute(name, value) {
    this.attributes.set(name, value)
  }
}

function createDocument(images) {
  return {
    body: {
      querySelectorAll(selector) {
        if (selector === "img") {
          return images
        }
        if (selector === `img[${RAW_IMAGE_ID_ATTRIBUTE}]`) {
          return images.filter(
            (image) => image.getAttribute(RAW_IMAGE_ID_ATTRIBUTE) !== null,
          )
        }
        throw new Error(`Unexpected selector: ${selector}`)
      },
    },
  }
}

test("raw Markdown stores references instead of duplicate embedded images", () => {
  const rawEmbedded = new FakeImage({
    src: "data:image/jpeg;base64,large-data",
  })
  const rawRemote = new FakeImage({ src: "https://example.com/logo.png" })
  const renderedEmbedded = new FakeImage({
    src: "data:image/jpeg;base64,large-data",
  })
  const renderedRemote = new FakeImage({ src: "https://example.com/logo.png" })

  const count = deduplicateRawMarkdownImages(
    createDocument([rawEmbedded, rawRemote]),
    createDocument([renderedEmbedded, renderedRemote]),
  )

  assert.equal(count, 1)
  assert.equal(rawEmbedded.getAttribute("src"), null)
  assert.equal(rawEmbedded.getAttribute(RAW_IMAGE_ID_ATTRIBUTE), "0")
  assert.equal(renderedEmbedded.getAttribute(RAW_IMAGE_ID_ATTRIBUTE), "0")
  assert.equal(rawRemote.getAttribute("src"), "https://example.com/logo.png")
})

test("editing a sent message restores image references into raw Markdown", async () => {
  const rawImage = new FakeImage({ [RAW_IMAGE_ID_ATTRIBUTE]: "0" })
  const renderedImage = new FakeImage({
    [RAW_IMAGE_ID_ATTRIBUTE]: "0",
    src: "cid:part1@example.invalid",
  })

  const count = await restoreRawMarkdownImages(
    createDocument([rawImage]),
    createDocument([renderedImage]),
  )

  assert.equal(count, 1)
  assert.equal(rawImage.getAttribute("src"), "cid:part1@example.invalid")
})

test("image resolver can restore a source when visible markers were stripped", async () => {
  const rawImage = new FakeImage({ [RAW_IMAGE_ID_ATTRIBUTE]: "0" })

  const count = await restoreRawMarkdownImages(
    createDocument([rawImage]),
    createDocument([]),
    async (source, context) => {
      assert.equal(source, undefined)
      assert.equal(context.position, 0)
      return "data:image/jpeg;base64,restored"
    },
  )

  assert.equal(count, 1)
  assert.equal(rawImage.getAttribute("src"), "data:image/jpeg;base64,restored")
})
