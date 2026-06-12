import assert from "node:assert/strict"
import test from "node:test"

import { collectLegacyOptionChanges } from "../../extension/options/options-migration-helpers.mjs"

const defaults = {
  "gfm-line-breaks-enabled": true,
  "main-css": "default",
  "math-enabled": false,
  "math-value": "default math",
}

test("collectLegacyOptionChanges converts legacy string booleans", () => {
  const result = collectLegacyOptionChanges(defaults, defaults, {
    "gfm-line-breaks-enabled": "false",
  })

  assert.deepEqual(result, { "gfm-line-breaks-enabled": false })
})

test("collectLegacyOptionChanges ignores missing legacy values", () => {
  const result = collectLegacyOptionChanges(defaults, defaults, {})

  assert.equal(result, null)
})

test("collectLegacyOptionChanges preserves current customized values", () => {
  const current = { ...defaults, "main-css": "custom" }
  const result = collectLegacyOptionChanges(current, defaults, {
    "main-css": "legacy",
    "math-value": "legacy math",
  })

  assert.deepEqual(result, { "math-value": "legacy math" })
})
