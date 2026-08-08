import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

async function readLocale(name) {
  return JSON.parse(
    await readFile(
      new URL(
        `../../extension/_locales/${name}/messages.json`,
        import.meta.url,
      ),
      "utf8",
    ),
  )
}

const english = await readLocale("en")

for (const localeName of ["zh_CN", "zh_TW"]) {
  const locale = await readLocale(localeName)

  test(`${localeName} matches the English locale contract`, () => {
    assert.deepEqual(Object.keys(locale).sort(), Object.keys(english).sort())

    for (const key of Object.keys(english)) {
      assert.deepEqual(
        Object.keys(locale[key].placeholders || {}).sort(),
        Object.keys(english[key].placeholders || {}).sort(),
        `${key} has different placeholders`,
      )
      const sourceTokens = english[key].message.match(/\$[A-Z_]+\$/g) || []
      const translatedTokens = locale[key].message.match(/\$[A-Z_]+\$/g) || []
      assert.deepEqual(
        translatedTokens.sort(),
        sourceTokens.sort(),
        `${key} has different placeholder tokens`,
      )
    }
  })

  test(`${localeName} uses the correct locale identifier and link labels`, () => {
    assert.equal(locale.__WET_LOCALE__.message, localeName)
    assert.doesNotMatch(
      locale.options_page__resources_cheatsheet_link.message,
      /<a\b/i,
    )
  })
}
