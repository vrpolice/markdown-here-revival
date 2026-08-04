import assert from "node:assert/strict"
import test from "node:test"

import { createInlineImageResolver } from "../../extension/message-inline-images.mjs"

function createResolver(attachments) {
  const requestedParts = []
  const resolver = createInlineImageResolver({
    attachments,
    getAttachmentFile: async (partName) => {
      requestedParts.push(partName)
      return { partName }
    },
    fileToDataURL: async (file) =>
      `data:image/jpeg;base64,content-of-${file.partName}`,
  })
  return { requestedParts, resolver }
}

const inlineAttachments = [
  {
    contentId: "<first@example.invalid>",
    contentType: "image/jpeg",
    partName: "1.2",
  },
  {
    contentId: "second@example.invalid",
    contentType: "image/png",
    partName: "1.3",
  },
]

test("inline image resolver retrieves a CID attachment only once", async () => {
  const { requestedParts, resolver } = createResolver(inlineAttachments)

  const first = await resolver("cid:first%40example.invalid", { position: 0 })
  const second = await resolver("cid:first%40example.invalid", { position: 0 })

  assert.equal(first, "data:image/jpeg;base64,content-of-1.2")
  assert.equal(second, first)
  assert.deepEqual(requestedParts, ["1.2"])
})

test("inline image resolver matches Thunderbird MIME part URLs", async () => {
  const { resolver } = createResolver(inlineAttachments)

  const source = await resolver("mailbox:///Sent?number=4&part=1.3", {
    position: 1,
  })

  assert.equal(source, "data:image/jpeg;base64,content-of-1.3")
})

test("inline image resolver falls back to MIME image order", async () => {
  const { resolver } = createResolver(inlineAttachments)

  const source = await resolver(undefined, { position: 1 })

  assert.equal(source, "data:image/jpeg;base64,content-of-1.3")
})

test("inline image resolver keeps existing data URLs", async () => {
  const { requestedParts, resolver } = createResolver(inlineAttachments)

  const source = await resolver("data:image/jpeg;base64,already-present", {
    position: 0,
  })

  assert.equal(source, "data:image/jpeg;base64,already-present")
  assert.deepEqual(requestedParts, [])
})
