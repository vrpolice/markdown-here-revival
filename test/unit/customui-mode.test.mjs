import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const parentSource = await readFile(
  new URL("../../extension/experiments/customui/parent.js", import.meta.url),
  "utf8",
)
const backgroundSource = await readFile(
  new URL("../../extension/backgroundscript.js", import.meta.url),
  "utf8",
)
const api = JSON.parse(
  await readFile(
    new URL("../../extension/experiments/customui/api.json", import.meta.url),
    "utf8",
  ),
)

test("CustomUI updates registration defaults for future compose windows", () => {
  const functions = api[0].functions.map((entry) => entry.name)
  assert.ok(functions.includes("update"))
  assert.match(parentSource, /handler\.onUpdate = function\(url, options\)/)
  assert.match(parentSource, /this\.registered\.set\(url, \{/)
  assert.match(
    backgroundSource,
    /updatePreviewRegistration\(\{ mode: "classic"/,
  )
  assert.match(backgroundSource, /mode: "modern",\s+width:/)
})

test("CustomUI applies layout using the newly selected mode", () => {
  assert.match(parentSource, /let mode = frame\.getAttribute\("data-mode"\)/)
  assert.match(parentSource, /mode = lOptions\.mode;/)
  assert.match(
    parentSource,
    /mode === "modern"[\s\S]*editorCol\.style\.width = "";/,
  )
})
