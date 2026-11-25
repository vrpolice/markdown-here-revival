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

async function identifyRasterImage(file) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const startsWith = (...prefix) => prefix.every((b, i) => bytes[i] === b)
  const ascii = String.fromCharCode(...bytes)
  let type
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10)) type = "image/png"
  else if (startsWith(0xff, 0xd8, 0xff)) type = "image/jpeg"
  else if (/^GIF8[79]a/.test(ascii)) type = "image/gif"
  else if (
    ascii.startsWith("RIFF") &&
    ascii.endsWith("WEBP") &&
    bytes.length === 12
  )
    type = "image/webp"
  return type ? file.slice(0, file.size, type) : null
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

  for (const attachment of attachments) {
    if (
      !attachment.contentType?.toLowerCase().startsWith("image/") &&
      attachment.contentType?.toLowerCase() !== "application/octet-stream"
    )
      continue
    const contentId = normalizeContentId(attachment.contentId)
    if (contentId) {
      attachmentByContentId.set(contentId, attachment)
    }
    attachmentByPartName.set(attachment.partName, attachment)
  }

  return async function resolveInlineImage(
    source,
    { position, exact = false },
  ) {
    if (source?.toLowerCase().startsWith("data:")) {
      return source
    }

    const contentId = normalizeContentId(source)
    const partName = getPartName(source)
    const attachment =
      attachmentByContentId.get(contentId) ||
      attachmentByPartName.get(partName) ||
      (!exact && imageAttachments.filter((item) => item.contentId)[position])

    if (!attachment) {
      return source
    }
    if (!sourceCache.has(attachment.partName)) {
      sourceCache.set(
        attachment.partName,
        getAttachmentFile(attachment.partName).then(async (file) => {
          const image =
            attachment.contentType.toLowerCase() === "application/octet-stream"
              ? await identifyRasterImage(file)
              : file
          return image ? fileToDataURL(image) : null
        }),
      )
    }
    return (await sourceCache.get(attachment.partName)) ?? source
  }
}
