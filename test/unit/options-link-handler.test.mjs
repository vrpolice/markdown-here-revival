import assert from "node:assert/strict"
import test from "node:test"

import {
  findClickedLink,
  getOptionsLinkAction,
} from "../../extension/options/options-link-handler.mjs"

function link(href, protocol) {
  return {
    href,
    protocol,
    getAttribute(name) {
      return name === "href" ? href : null
    },
  }
}

test("options section links stay in the current settings tab", () => {
  assert.equal(
    getOptionsLinkAction(link("#theme", "moz-extension:")),
    "fragment",
  )
})

test("extension and web links retain their intended destinations", () => {
  assert.equal(
    getOptionsLinkAction(
      link("moz-extension://example/test/index.html", "moz-extension:"),
    ),
    "extension",
  )
  assert.equal(
    getOptionsLinkAction(link("https://github.com/example", "https:")),
    "external",
  )
})

test("clicking nested link text resolves to its anchor", () => {
  const anchor = link("https://example.com", "https:")
  const text = { closest: (selector) => (selector === "a" ? anchor : null) }

  assert.equal(findClickedLink(text), anchor)
  assert.equal(findClickedLink({}), null)
})
