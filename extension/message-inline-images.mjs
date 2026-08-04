/*
 * Copyright Charles He 2026
 * MIT License
 */

function normalizeContentId(value) {
  if (!value) {
    return null
  }
  let normalized = value.replace(/^cid:/i, "")
  try {
    normalized = decodeURIComponent(normalized)
  } catch {
    // Keep malformed content IDs usable for an exact string match.
  }
  return normalized.replace(/^<|>$/g, "")
}

function getPartName(source) {
  return source?.match(/[?&]part=([^&#]+)/i)?.[1] || null
}

export function createInlineImageResolver({
  attachments,
  getAttachmentFile,
  fileToDataURL,
}) {
  const imageAttachments = attachments.filter((attachment) =>
    attachment.contentType?.toLowerCase().startsWith("image/"),
  )
  const attachmentByContentId = new Map()
  const attachmentByPartName = new Map()
  const sourceCache = new Map()

  for (const attachment of imageAttachments) {
    const contentId = normalizeContentId(attachment.contentId)
    if (contentId) {
      attachmentByContentId.set(contentId, attachment)
    }
    attachmentByPartName.set(attachment.partName, attachment)
  }

  return async function resolveInlineImage(source, { position }) {
    if (source?.toLowerCase().startsWith("data:")) {
      return source
    }

    const contentId = normalizeContentId(source)
    const partName = getPartName(source)
    const attachment =
      attachmentByContentId.get(contentId) ||
      attachmentByPartName.get(partName) ||
      imageAttachments.filter((item) => item.contentId)[position]

    if (!attachment) {
      return source
    }
    if (!sourceCache.has(attachment.partName)) {
      sourceCache.set(
        attachment.partName,
        getAttachmentFile(attachment.partName).then(fileToDataURL),
      )
    }
    return await sourceCache.get(attachment.partName)
  }
}
