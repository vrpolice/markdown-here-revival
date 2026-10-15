import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import vm from "node:vm"
import test from "node:test"

const scope = {}
vm.runInNewContext(
  await readFile(
    new URL(
      "../../extension/experiments/customui/send-compatibility.js",
      import.meta.url,
    ),
    "utf8",
  ),
  scope,
)
const { canFinishWithoutFiltering } = scope.MdhrSendCompatibility

test("privileged initialization loads from the physical root and installs a working reversible hook", async () => {
  const source = await readFile(
    new URL("../../extension/experiments/customui/parent.js", import.meta.url),
    "utf8",
  )
  const helper = await readFile(
    new URL(
      "../../extension/experiments/customui/send-compatibility.js",
      import.meta.url,
    ),
    "utf8",
  )
  class MessageSend {}
  const original = function () {
    throw new Error("invalid header")
  }
  MessageSend.prototype._filterSentMessage = original
  MessageSend.prototype.onStopOperation = function (status) {
    this.finished = status
  }
  const cleanup = []
  const errors = []
  const sandbox = {
    ExtensionCommon: { ExtensionAPI: class {} },
    ChromeUtils: {
      importESModule: (url) =>
        url.includes("MessageSend")
          ? { MessageSend }
          : url.includes("MailUtils")
            ? { MailUtils: { getExistingFolder: () => input().folder } }
            : {},
    },
    Services: {
      scriptloader: {
        loadSubScript: (url, target) => {
          assert.match(url, /^jar:file:/)
          vm.runInNewContext(helper, target)
        },
      },
    },
    Components: { isSuccessCode: (status) => status === 0 },
    Ci: {
      nsMsgFilterType: { PostOutgoing: 4 },
      nsIMsgSendReport: { process_Filter: 5 },
    },
    Cr: { NS_OK: 0 },
    console: {
      info() {},
      warn: (...args) => errors.push(args),
      error: (...args) => errors.push(args),
    },
  }
  vm.runInNewContext(
    source.split("// Window monitoring helper")[0] + "return {}; } };",
    sandbox,
  )
  new sandbox.ex_customui().getAPI({
    extension: {
      baseURI: {
        resolve: () => {
          throw new Error("Untrusted public URI")
        },
      },
      rootURI: { resolve: (path) => "jar:file:///extension.xpi!/" + path },
    },
    callOnClose: (handler) => cleanup.push(handler),
  })
  assert.notEqual(MessageSend.prototype._filterSentMessage, original)
  const send = new MessageSend()
  send._messageKey = 0
  send._parentWindow = { document: { getElementById: () => ({}) } }
  send.sendReport = {}
  send._filterSentMessage()
  assert.equal(send.finished, 0)
  assert.deepEqual(errors, [])
  cleanup.forEach((handler) => handler.close())
  assert.equal(MessageSend.prototype._filterSentMessage, original)
})
function input(rules = [], messageKey = 0, type = "imap") {
  return {
    messageKey,
    postOutgoingType: 4,
    folder: {
      server: { type },
      getFilterList: () => ({
        filterCount: rules.length,
        getFilterAt: (index) => rules[index],
      }),
    },
  }
}
test("IMAP UID 0 with no outgoing work completes without fetching an invalid header", () => {
  assert.equal(canFinishWithoutFiltering(input()), true)
  assert.equal(
    canFinishWithoutFiltering(input([{ enabled: true, filterType: 1 }])),
    true,
  )
  assert.equal(
    canFinishWithoutFiltering(input([{ enabled: false, filterType: 4 }])),
    true,
  )
})
test("real outgoing rules, valid UIDs and local key zero retain normal filtering", () => {
  assert.equal(
    canFinishWithoutFiltering(input([{ enabled: true, filterType: 5 }])),
    false,
  )
  assert.equal(canFinishWithoutFiltering(input([], 100)), false)
  assert.equal(canFinishWithoutFiltering(input([], 0, "none")), false)
})
test("unreadable filter lists are not silently treated as empty", () => {
  const value = input()
  value.folder.getFilterList = () => {
    throw new Error("unavailable")
  }
  assert.equal(canFinishWithoutFiltering(value), false)
})
