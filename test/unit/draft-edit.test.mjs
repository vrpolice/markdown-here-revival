import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import vm from "node:vm"

const background = await readFile(
  new URL("../../extension/backgroundscript.js", import.meta.url),
  "utf8",
)

test("the Markdown menu opens drafts without reconstructing the signature or creating a new message", async () => {
  const start = background.lastIndexOf(
    "messenger.menus.onClicked.addListener",
    background.indexOf("async function resetModernMode"),
  )
  let click
  const ids = []
  vm.runInNewContext(
    background.slice(
      start,
      background.indexOf("async function resetModernMode"),
    ),
    {
      menu_edit_markdown_id: "edit",
      messenger: {
        menus: { onClicked: { addListener: (fn) => (click = fn) } },
        ex_customui: { editDraft: async (id) => ids.push(id) > 0 },
      },
    },
  )
  await click({
    menuItemId: "edit",
    selectedMessages: { messages: [{ id: 8 }] },
  })
  assert.deepEqual(ids, [8])
})

test("a failed second save restores the first closed editor as the original draft", async () => {
  const closed = []
  const reopened = []
  const context = vm.createContext({
    OptionsStore: { get: async () => ({ "mdhr-mode": "classic" }) },
    getOpenComposeWindows: async () => [
      { id: 1, tabs: [{ id: 10 }] },
      { id: 2, tabs: [{ id: 20 }] },
    ],
    messenger: {
      compose: {
        saveMessage: async (id) => {
          if (id === 20) throw new Error("save failed")
          return { messages: [{ id: 99 }] }
        },
      },
      windows: { remove: async (id) => closed.push(id) },
      ex_customui: { editDraft: async (id) => reopened.push(id) > 0 },
    },
  })
  vm.runInContext(
    background.slice(
      background.indexOf("async function injectMDPreview"),
      background.indexOf("function getPreviewURL"),
    ),
    context,
  )
  await assert.rejects(context.injectMDPreview(), /save failed/)
  assert.deepEqual(closed, [1])
  assert.deepEqual(reopened, [99])
})
