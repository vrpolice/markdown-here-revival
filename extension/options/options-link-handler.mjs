export function findClickedLink(target) {
  return target?.closest?.("a") || null
}

export function getOptionsLinkAction(link) {
  if (!link) {
    return null
  }
  const href = link.getAttribute("href") || ""
  if (href.startsWith("#")) {
    return "fragment"
  }
  if (link.protocol === "moz-extension:") {
    return "extension"
  }
  if (link.protocol === "https:" || link.protocol === "http:") {
    return "external"
  }
  return null
}
