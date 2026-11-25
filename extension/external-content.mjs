export const EXTERNAL_CONTENT_SELECTOR =
  "blockquote[type='cite'], .moz-signature, .alimail-signature, div.moz-forward-container, div.mdhr-html-table"

export function findExternalContentRoots(
  doc,
  selector = EXTERNAL_CONTENT_SELECTOR,
) {
  const candidates = [...doc.body.querySelectorAll(selector)]
  return candidates.filter(
    (element) => !element.parentElement?.closest(selector),
  )
}
