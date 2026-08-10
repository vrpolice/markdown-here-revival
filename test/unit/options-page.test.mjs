import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const read = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8")

test("options page follows the Thunderbird-style visual contract", async () => {
  const [html, css, vendorCss, previewHtml, optionsScript] = await Promise.all([
    read("extension/options/options.html"),
    read("extension/options/options.css"),
    read("extension/vendor/bootswatch.css"),
    read("extension/options/preview.html"),
    read("extension/options/options.js"),
  ])

  assert.match(html, /class="settings-page"/)
  assert.match(html, /role="tablist"/)
  assert.match(html, /class="settings-heading"/)
  assert.doesNotMatch(html, /text-uppercase/)
  assert.doesNotMatch(vendorCss, /fonts\.googleapis\.com/)

  assert.match(css, /color-scheme:\s*light dark/)
  assert.match(css, /@media \(prefers-color-scheme:\s*dark\)/)
  assert.match(css, /:focus-visible/)
  assert.match(css, /@media \(max-width:\s*767\.98px\)/)
  assert.match(css, /--mdhr-sidebar-width:\s*224px/)
  assert.match(previewHtml, /class="markdown-here-wrapper"/)
  assert.match(previewHtml, /color-scheme:\s*light/)
  assert.match(optionsScript, /previewWrapper\.innerHTML/)
  assert.doesNotMatch(optionsScript, /contentDocument\.body\.innerHTML/)
})
