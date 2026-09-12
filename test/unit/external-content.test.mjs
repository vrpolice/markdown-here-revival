import assert from "node:assert/strict"
import test from "node:test"

import {
  EXTERNAL_CONTENT_SELECTOR,
  findExternalContentRoots,
} from "../../extension/external-content.mjs"

function element(name, externalParent = null) {
  return {
    name,
    parentElement: {
      closest(selector) {
        assert.equal(selector, EXTERNAL_CONTENT_SELECTOR)
        return externalParent
      },
    },
  }
}

test("findExternalContentRoots includes nested compose containers", () => {
  const forwarded = element("forwarded")
  const signature = element("signature")
  const doc = {
    body: {
      querySelectorAll(selector) {
        assert.equal(selector, EXTERNAL_CONTENT_SELECTOR)
        return [forwarded, signature]
      },
    },
  }

  assert.deepEqual(findExternalContentRoots(doc), [forwarded, signature])
})

test("findExternalContentRoots keeps only the outermost quoted block", () => {
  const forwarded = element("forwarded")
  const nestedQuote = element("nested quote", forwarded)
  const nestedSignature = element("nested signature", forwarded)
  const doc = {
    body: {
      querySelectorAll() {
        return [forwarded, nestedQuote, nestedSignature]
      },
    },
  }

  assert.deepEqual(findExternalContentRoots(doc), [forwarded])
})
