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
const optionsSource = await readFile(
  new URL("../../extension/options/options.js", import.meta.url),
  "utf8",
)
const composePreviewSource = await readFile(
  new URL(
    "../../extension/compose_preview/compose_preview.js",
    import.meta.url,
  ),
  "utf8",
)
const composeScriptSource = await readFile(
  new URL("../../extension/composescript.js", import.meta.url),
  "utf8",
)
const previewHelpersSource = await readFile(
  new URL("../../extension/compose-preview-helpers.js", import.meta.url),
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

test("compose preview toggles do not overwrite the new-window default", () => {
  const contextHandler = composePreviewSource.match(
    /const onContextChange[\s\S]*?messenger\.ex_customui\.onEvent/,
  )?.[0]
  assert.ok(contextHandler)
  assert.doesNotMatch(contextHandler, /enable-markdown-mode/)
  assert.match(contextHandler, /"preview-width"/)
})

test("options synchronize the new-window preview default without forcing it", () => {
  assert.match(optionsSource, /handleMarkdownModeDefault/)
  assert.match(optionsSource, /action: "mdhr-preview-default-set"/)
  assert.match(
    optionsSource,
    /if \(force\) \{\s+updateModeControls\(new_value\)/,
  )
  assert.doesNotMatch(
    optionsSource,
    /if \(old_value !== new_value \|\| force\)/,
  )
})

test("modern mode icon follows preview visibility", () => {
  assert.match(
    backgroundSource,
    /path: modernHidden \? ICON_INACTIVE : ICON_RENDERED/,
  )
})

test("classic mode renders into and restores the compose editor", () => {
  assert.match(backgroundSource, /action: "classic-state"/)
  assert.match(
    backgroundSource,
    /action: "classic-render",\s+html: renderedDocument\.body\.innerHTML/,
  )
  assert.match(backgroundSource, /action: "classic-restore"/)
  const classicRenderer = backgroundSource.match(
    /async function doClassicRender[\s\S]*?\n}/,
  )?.[0]
  assert.ok(classicRenderer)
  assert.doesNotMatch(classicRenderer, /compose\.setComposeDetails/)
  assert.match(composeScriptSource, /function replaceEditorContents\(html\)/)
  assert.match(composeScriptSource, /document\.execCommand\("insertHTML"/)
  assert.doesNotMatch(backgroundSource, /action: "cp\.toggle-classic-preview"/)
})

test("classic mode disables continuous preview rendering", () => {
  assert.match(
    composePreviewSource,
    /async function setClassicMode\(\)[\s\S]*sendPreviewStateToCompose\(tabId, true\)/,
  )
  assert.doesNotMatch(composePreviewSource, /toggleClassicPreview/)
  assert.match(
    backgroundSource,
    /savedState\["mdhr-mode"\] === "modern" &&\s+normalizeBoolean/,
  )
})

test("compose preview work is cancelled when the editor closes", () => {
  assert.match(previewHelpersSource, /debounced\.cancel = \(\) =>/)
  assert.match(composeScriptSource, /"pagehide"/)
  assert.match(composeScriptSource, /MsgMutationObserver\?\.disconnect\(\)/)
  assert.match(composeScriptSource, /debouncedRenderPreview\.cancel\(\)/)
})
