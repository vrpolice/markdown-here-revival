export const EXTERNAL_CONTENT_SELECTOR =
  "blockquote[type='cite'], .moz-signature, div.moz-forward-container"

export function findExternalContentRoots(doc) {
  const candidates = [...doc.body.querySelectorAll(EXTERNAL_CONTENT_SELECTOR)]
  return candidates.filter(
    (element) => !element.parentElement?.closest(EXTERNAL_CONTENT_SELECTOR),
  )
}
