import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("English and Chinese landing pages share the bilingual site contract", async () => {
  const [english, chinese, css] = await Promise.all([
    read("docs/index.html"),
    read("docs/zh/index.html"),
    read("docs/site.css"),
  ])

  assert.match(english, /<html lang="en">/)
  assert.match(chinese, /<html lang="zh-CN">/)
  assert.match(english, /href="zh\/"[^>]*>中文</)
  assert.match(chinese, /href="\.\.\/"[^>]*>English</)
  assert.match(english, /hreflang="zh-CN" href="zh\/"/)
  assert.match(chinese, /hreflang="en" href="\.\.\/"/)
  assert.match(english, /src="demo\/demo\.png"/)
  assert.match(chinese, /src="\.\.\/demo\/demo\.png"/)
  assert.match(english, /alt="Markdown Here Revival live preview in Thunderbird"/)
  assert.match(chinese, /alt="Markdown Here Revival 在 Thunderbird 中的实时预览"/)
  assert.match(english, /href="site\.css"/)
  assert.match(chinese, /href="\.\.\/site\.css"/)
  assert.match(css, /prefers-reduced-motion/)
  assert.doesNotMatch(css, /linear-gradient\([^)]*#d946ef/)
})
