import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const previewFrame = await readFile(
  new URL(
    "../../extension/compose_preview/preview_iframe.html",
    import.meta.url,
  ),
  "utf8",
)

test("preview iframe forces a light message canvas for dark Thunderbird themes", () => {
  assert.match(previewFrame, /background-color:\s*#fff/i)
  assert.match(previewFrame, /color:\s*#24292f/i)
  assert.match(previewFrame, /color-scheme:\s*light/i)
})
