/*
 * Copyright Charles He 2026
 * MIT License
 */

export const RAW_IMAGE_ID_ATTRIBUTE = "data-mdhr-raw-image-id"

function hasEmbeddedSource(image) {
  return image.getAttribute("src")?.toLowerCase().startsWith("data:") ?? false
}

export function deduplicateRawMarkdownImages(sourceDocument, renderedDocument) {
  const sourceImages = [...sourceDocument.body.querySelectorAll("img")]
  const renderedImages = [...renderedDocument.body.querySelectorAll("img")]

  sourceImages.forEach((image) => image.removeAttribute(RAW_IMAGE_ID_ATTRIBUTE))
  renderedImages.forEach((image) =>
    image.removeAttribute(RAW_IMAGE_ID_ATTRIBUTE),
  )

  let deduplicated = 0
  sourceImages.forEach((sourceImage, index) => {
    const renderedImage = renderedImages[index]
    if (!renderedImage || !hasEmbeddedSource(sourceImage)) {
      return
    }

    const imageId = String(index)
    sourceImage.removeAttribute("src")
    sourceImage.setAttribute(RAW_IMAGE_ID_ATTRIBUTE, imageId)
    renderedImage.setAttribute(RAW_IMAGE_ID_ATTRIBUTE, imageId)
    deduplicated++
  })

  return deduplicated
}

export async function restoreRawMarkdownImages(
  rawDocument,
  renderedDocument,
  resolveSource = async (source) => source,
) {
  const renderedImages = new Map()
  for (const image of renderedDocument.body.querySelectorAll(
    `img[${RAW_IMAGE_ID_ATTRIBUTE}]`,
  )) {
    renderedImages.set(image.getAttribute(RAW_IMAGE_ID_ATTRIBUTE), image)
  }

  let restored = 0
  const rawImages = rawDocument.body.querySelectorAll(
    `img[${RAW_IMAGE_ID_ATTRIBUTE}]`,
  )
  for (let position = 0; position < rawImages.length; position++) {
    const rawImage = rawImages[position]
    const renderedImage = renderedImages.get(
      rawImage.getAttribute(RAW_IMAGE_ID_ATTRIBUTE),
    )
    const source = await resolveSource(renderedImage?.getAttribute("src"), {
      imageId: rawImage.getAttribute(RAW_IMAGE_ID_ATTRIBUTE),
      position,
    })
    if (!source) {
      continue
    }
    rawImage.setAttribute("src", source)
    restored++
  }

  return restored
}
