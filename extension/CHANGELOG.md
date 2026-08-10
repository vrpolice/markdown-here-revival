# Changelog

## [4.0.24]

### Fixed

- Render the Theme settings preview inside the same
  `.markdown-here-wrapper` used by actual messages, so the primary CSS from
  v4.0.15 and user customizations correctly apply to fonts, text color, line
  height, headings, quotes, tables, lists, and code blocks.
- Use a stable light message canvas in the Theme preview while continuing to
  apply every selectable syntax-highlighting theme to code content.

### Changed

- Replace the outdated Simplified and Traditional Chinese preview samples with
  localized examples covering headings, quotes, lists, links, tables, code,
  math, and horizontal rules.
- Add regression coverage for the Theme preview structure and CSS target.

Thanks to @mirenradia for reporting the Theme preview mismatch in
https://github.com/vrpolice/markdown-here-revival/issues/2.

### 中文

- 主题设置页的预览现在使用与实际邮件相同的 `.markdown-here-wrapper`
  结构，使 v4.0.15 的主要 CSS 及用户自定义样式能够正确作用于字体、文字
  颜色、行高、标题、引用、表格、列表和代码块。
- 主题预览使用稳定的浅色邮件画布，同时所有可选的语法高亮主题仍会正确
  应用于代码内容。
- 将过时的简体中文和繁体中文预览示例替换为本地化内容，覆盖标题、引用、
  列表、链接、表格、代码、数学公式和分隔线。
- 增加主题预览结构和 CSS 作用目标的回归测试。

感谢 @mirenradia 在 https://github.com/vrpolice/markdown-here-revival/issues/2
中反馈主题预览与实际邮件样式不一致的问题。

## [4.0.23]

### Fixed

- Restore the intended mode-specific toolbar behavior: modern mode toggles the
  live preview pane, while classic mode renders Markdown directly in the
  compose editor and restores the original Markdown on the next click.
- Reimplement classic rendering with an in-editor wrapper instead of repeatedly
  replacing the complete compose body through the Compose API, preventing
  Thunderbird from hanging when a message is rendered, restored, rendered
  again, and then closed.
- Apply classic and modern mode changes to existing and future compose windows
  in the same Thunderbird session, and clear classic full-width layout state
  when returning to modern mode.
- Keep the modern toolbar icon and preview visibility synchronized without
  overwriting the user's default for newly opened compose windows.
- Make the forgot-to-render warning recognize common Markdown including level-1
  headings, fenced code, block quotes, task lists, numbered lists, links, and
  Thunderbird's non-breaking spaces and compose-editor line structure.
- Stop pending preview work when a compose editor closes and avoid mutating the
  live preview document when preparing rendered message content.

### Changed

- Rewrite the Simplified and Traditional Chinese translations, restore missing
  strings, and validate locale keys and placeholders against English.
- Clarify the live-preview default option for new compose windows.

Thanks to @capac for reporting the classic-mode problem in
https://github.com/vrpolice/markdown-here-revival/issues/3.

### 中文

- 恢复两种模式原本的工具栏行为：现代模式点击按钮显示或隐藏实时预览；经典
  模式点击按钮直接在撰写区渲染 Markdown，再次点击则恢复 Markdown 原文。
- 经典模式改为通过编辑器内的 wrapper 渲染，不再使用 Compose API 反复替换
  整封邮件，修复“渲染、还原、再次渲染后关闭窗口”可能导致 Thunderbird
  卡死的问题。
- 模式切换现在会同时应用于当前和后续新建的撰写窗口；从经典模式返回现代
  模式时会清理残留的全宽布局状态。
- 同步现代模式按钮图标与预览可见状态，同时不再覆盖新建撰写窗口的默认设置。
- 增强“忘记渲染”检查，可识别一级标题、围栏代码、引用、任务列表、编号列表、
  Markdown 链接，以及 Thunderbird 编辑器产生的不换行空格和段落结构。
- 关闭撰写窗口时取消待执行的预览任务；生成邮件内容时不再修改实时预览文档。
- 重写简体中文和繁体中文翻译，补齐缺失词条，并增加键名及占位符一致性测试。
- 明确“新建撰写窗口时显示实时预览”选项的含义。

感谢 @capac 在 https://github.com/vrpolice/markdown-here-revival/issues/3
中反馈经典模式问题。

## [4.0.22]

### Fixed

- Coalesce live-preview updates so only one render runs at a time and remove
  the duplicate leading render from the preview debounce
- Transfer embedded image data to the preview once per image instead of
  copying every Base64 source again after each editor change
- Avoid copying complete image data to the background process when generating
  Markdown rendering placeholders
- Store references to rendered inline images in the hidden Markdown source
  instead of embedding a second Base64 copy, while preserving Edit as New with
  Markdown and compatibility with messages sent by earlier versions
- Restore inline images when using Edit as New with Markdown. Thunderbird
  converts embedded image sources into MIME references during sending, so the
  extension resolves their content IDs and MIME parts back to image data before
  opening the compose window.

### 中文

- 合并实时预览更新，确保同一时间只有一个渲染任务，并移除防抖过程中重复的
  首次渲染
- 每张内嵌图片只向预览端传输一次，避免编辑器每次变化都重复复制 Base64 图片
- 生成 Markdown 渲染占位符时不再将完整图片数据复制到后台进程
- 隐藏的 Markdown 原文改为引用已渲染的内联图片，不再保存第二份 Base64
  图片；同时保留“以 Markdown 形式重新编辑”及旧版本邮件兼容性
- 修复使用“以 Markdown 形式重新编辑”时内联图片不显示的问题。Thunderbird
  发送时会将内嵌图片转换为 MIME 引用，扩展会解析对应的 Content-ID 和
  MIME part，并在打开写信窗口前恢复图片数据。

## [4.0.21]

### Changed

- Update Thunderbird compatibility metadata to allow installation on
  Thunderbird 153 (`strict_max_version: 153.*`)
- Update README and project website compatibility text for Thunderbird 128–153
- Redesign the options page to match Thunderbird's current visual language,
  with adaptive light and dark colors, native system typography, responsive
  navigation, clearer setting groups, and no remote font dependency

### 中文

- 更新 Thunderbird 兼容性元数据，允许在 Thunderbird 153 上安装
  （`strict_max_version: 153.*`）
- 同步 README 和项目网页中的兼容范围说明到 Thunderbird 128–153
- 重新设计选项页面，使其更贴近当前 Thunderbird 的视觉风格，包括自适应
  明暗配色、系统字体、响应式导航、更清晰的设置分组，并移除远程字体依赖

## [4.0.20]

### Fixed

- Fix unreadable live preview text when Thunderbird is using a dark theme by
  forcing the preview iframe to use a light message canvas with dark text.
  Thanks to @mirenradia for reporting this in
  https://github.com/vrpolice/markdown-here-revival/issues/1.

### 中文

- 修复 Thunderbird 深色主题下实时预览文字不可读的问题：预览 iframe 现在
  固定使用浅色邮件画布与深色文字。感谢 @mirenradia 在
  https://github.com/vrpolice/markdown-here-revival/issues/1 中反馈。

## [4.0.19]

### Changed

- Update Thunderbird compatibility metadata to allow installation on
  Thunderbird 152 (`strict_max_version: 152.*`)
- Update README and project website compatibility text for Thunderbird 128–152

### 中文

- 更新 Thunderbird 兼容性元数据，允许在 Thunderbird 152 上安装
  （`strict_max_version: 152.*`）
- 同步 README 和项目网页中的兼容范围说明到 Thunderbird 128–152

## [4.0.18]

### English

#### Fixed

- Cancel sending and show a retry notification when Markdown rendering times
  out, fails, or returns empty content, preventing accidental delivery of raw
  Markdown
- Pass numeric compose window IDs when switching between classic and modern
  modes
- Normalize legacy string booleans and current boolean settings consistently
- Match notification responses by both window and notification ID, with
  complete listener cleanup
- Restore legacy option migration and preserve existing user customizations
- Remove CustomUI resize and splitter listeners when preview panels close

#### Changed

- Reduce the privileged CustomUI experiment to the compose-preview features
  used by this extension
- Add portable unit tests, lint configuration, and GitHub Actions CI
- Remove the unused `accountsRead` permission
- Redesign the project website with a real Thunderbird preview screenshot and
  complete English and Chinese pages

### 中文

#### 修复

- Markdown 渲染超时、异常或返回空内容时取消发送并显示重试通知，避免误发
  未渲染的 Markdown 原文
- 切换经典/现代模式时传递正确的数字写信窗口 ID
- 统一处理旧版字符串布尔值与当前布尔设置
- 同时按窗口 ID 和通知 ID 匹配通知响应，并完整清理事件监听器
- 恢复旧设置迁移，同时保留用户已有的自定义配置
- 关闭预览面板时移除 CustomUI 的窗口缩放与分隔条监听器

#### 改进

- 精简 CustomUI 特权代码，仅保留扩展实际使用的写信预览功能
- 增加可移植单元测试、代码检查配置和 GitHub Actions CI
- 移除未使用的 `accountsRead` 权限
- 重做项目网页，加入真实 Thunderbird 预览截图，并提供完整中英文页面

## [4.0.17]

### Fixed

- Preview pane now maintains its width ratio when the compose window is resized
- Signature content no longer flickers when dragging the splitter left
  (MutationObserver was treating the record array as a single object, so
  attribute-change filtering never worked)

### Changed

- Extension ID changed to `markdown-here-revival@vrpolice.github.io` to
  avoid conflict with the upstream ATN listing
- Options page branding updated: footer credits, bug report link, license
  summary all point to this fork
- Author displays as plain text (no hyperlink) in Add-ons Manager

## [4.0.16]

### Fixed

- Options page "Basic CSS" was empty due to missing CHANGELOG.md in extension
  bundle causing a NetworkError that aborted page initialization
- Added error handling to changelog loader so a fetch failure does not block
  the rest of the options page

### Changed

- Updated authorship and homepage URL to this fork
- LICENSE now includes all three generations of copyright holders

## [4.0.15]

### Changed

- Overhaul default email CSS for a clean, professional business style:
  refined typography with system font stack, lighter heading borders,
  GitHub-style code blocks, subtle zebra-striped tables with header
  background, and softer blockquote styling

## [4.0.14]

### Fixed

- Splitter divider line between Markdown editor and preview pane was invisible
  in Thunderbird 151 ESR due to missing `--splitter-color` CSS variable
- Default preview panel width is now centered (50% of window) instead of
  fixed 650px, calculated fresh per compose window
- "Reset Preview" now correctly resets splitter to centered position

## [4.0.13]

### Changed

- Update `strict_max_version` to `151.*` to support Thunderbird 151 ESR

## [4.0.12]

### Fixed

- MDHR was not working with Thunderbird 148.0 and up. Thank you Cliff Brake for
  tracking down the problems and providing fixes.
- Dependency updates

## [4.0.11] (unreleased)

## [4.0.10] (unreleased)

## [4.0.9.1]

### New

- Add option to use Body Text format in composer. Body Text is the preferred
  format to ensure all features work properly. Tables and code blocks do
  not render correctly with Paragraph mode.

### [4.0.9] (unreleased)

### Fixed

- Math rendering was always enabled (Thanks Sarke!)
- Disable preview update prior to sending to prevent flash of double-rendered
  content in the preview pane
- Remove `mdhr-raw` elements from quoted or forwarded content. This will keep
  the overall message size down in long threads and improve performance.
- Improve markdown rendering when composing in "paragraph mode" to reduce
  empty vertical space

### Changed

- Refactored dynamic imports out of the composescript.
- Remove fuse.js dependency

## [4.0.8]

### New

- Add support for CodeCogs math rendering (real replacement for GChart Image API)
  Based on Adam P's work in the original Markdown Here extension
- Match issue numbers with dashes as used in Jira (thanks @koug44)

### Fixed

- Table rows with fewer columns than head did not insert empty cells
  [#137](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/137)
- Remove support for Markdown directives
  [#138](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/138)

## [4.0.7]

### Fixed

- Some sent messages had overlapping text blocks
  [#129](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/129)
  [#132](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/132)
- CSS and display element from Emoji autocomplete feature was included in
  sent messages with MDHR Live Preview disabled
  [#125](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/125)
  [#130](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/130)
  [#131](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/131)
- CHANGELOG panel in MDHR Options did not scroll, cutting off content
- Build and stability fixes contributed by Luc Bennett

## [4.0.6]

### Fixed

- Thunderbird's dark mode interfered with MDHR CSS-inlining causing unreadable
  text in the sent message

### Unresolved

- "textcomplete.css" appears as a linked stylesheet in messages sent with
  Markdown rendering disabled [#125](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/125)

## [4.0.5] (not released on ATN)

### Fixed

- Fix problems with options not saving in the last couple versions.
  [#120](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/120)
  [#119](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/119)
- Support up to Thunderbird 140.
  [#116](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/116)
  [#117](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/117)
- Improve performance of the preview rendering.
  [#121](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/121)

## [4.0.4]

- Emoji autocomplete background in dark mode was white

## [4.0.3.3]

### Changed

- Syntax for Bug/Issue links changed to `#bugno` to align with what Github/Gitlab
  use
- Generic directive syntax `:span[text]{.classname attr="foo"}` enabled

### Fixed

- Vertical lines left adjacent to block quotes not present (default css fix)
  [#104](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/104)
- Update popup could open in compose window
  [#101](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/101)
- Emojis did not render due to conflicting Marked extension
  [#107](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/107)
- Debounce live preview rendering and enable async rendering.
  [#102](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/102)
- textcomplete.css was included in sent messages.
  [#112](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/112)

## [4.0.2]

### New

- Issue or Bug linking directive. :issue[34] or :bug[123445]. The URL and link
  text are configurable in Options.

### Fixed

- Disable excessive logging of options changes
- Fix locale-maker save data issue

## [4.0.1]

- Unreleased

## [4.0]

### New

- Restore ability to edit the markdown of a sent email via "Edit as New Message"
  [#73](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/73)

### Fixed

- Exclude signature from Markdown CSS. [#95](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/95)

## [4.0 beta 20]

### Fixed

- Update default CSS to handle GFM tasklists like Github does (no bullets) #87
- Show error message when using GChart Image API for Math Rendering
  [#91](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/91)
- Updated translations
- Fixed issue with spaces in emoji picker
  [#93](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/93)

### [4.0 beta 19]

## Fixed

- Preview toggle issues

## [4.0 beta 18]

## New

- Emoji autocomplete popup thingy

## [4.0 beta 17]

### Changed

- Update Marked to 12.0.2, update Marked extensions, Turndown, Highlightjs

### Fixed

- Disable MDHR for plain text messages. Fixes #84.

## [4.0 beta 16]

### Fixed

- Replying to plain text or "body text" formatted emails lost inline reply content #85.
- Suppress quirks mode warnings in console log

## [4.0 beta 15]

### Fixed

- Fix up modern mode after using classic mode. #77
- Add a "Reset Preview" item to the compose action context menu.
- Automate release workflow as much as possible.

## [4.0 beta 14]

### Fixed

- Fix handling of multiple images. #76.
- Custom CSS styles did not apply to emails. #83.

### Changed

- Live preview: Move external (reply quotes and forwards) content into a shadow
  root'd div to prevent CSS style collision. The shadow root is removed after
  markdown CSS is inlined prior to sending.
- CSS Inliner now operates off a blank document when setting up the default
  styles.
- The CSP `<meta>` element used in the preview pane was previously left in-tact
  when the message was finally sent. It is now removed prior to sending. The
  CSP is intentionally restrictive; among other things it prevents loading
  remote images and CSS. I may create a way to loosen this up a bit for users
  who want remote images and such. In any case, the CSP really does not need to
  be applied in the recipient's email client. I'm not even sure it would be in
  most cases anyway.
- Removed some other miscellaneous stylesheets applied to the preview pane that
  are not needed when the recipient reads an email.
- Live preview iframe now loads from a srcdoc: string. This allows setting the
  default markdown and highlighter CSS as `<style>` elements right away. This
  should reduce cases of unstyled or unrendered messages in the preview.

## [4.0 beta 13]

### Fixed

- Fixed saving boolean (checkbox) options
- Fixed restoring preview width
- Resized images are resized in output as well
- Remove "save markdown source as attachment" option
- Force options preview to rerender when options change

## [4.0 beta 12]

### Fixed

- "Classic" mode now works (I hope)
- Compose Action icon is now purple when in preview (Classic) or if
  markdown mode is active (modern)
- QuickText workaround that may or may not work
- Save markdown source as attachment text/markdown

## [4.0 beta 11]

### Fixed

- Fix Settings page opening multiple tabs
- Save open compose windows as drafts when installing or switching UI modes
  to prevent lost messages - upgrades while messages are being composed may
  continue to be a problem

## [4.0 beta 10]

### Fixed

- Preview width was not saved [#67](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/67)

- Test code fixes

### Known Issues

- The new "classic" mode (pre 4.0) is not completely implemented [#69](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/69)
- Settings tab can open multiple times [#68](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/68)
- Conflict with QuickText extension [#70](https://gitlab.com/jfx2006/markdown-here-revival/-/issues/70)

## [4.0]

- Live Preview (aka "modern") mode is the default
- "Classic" mode is a work in progress to restore the old behavior of the
  render button
- Many refactorings to bring dependencies up to date and use ESM syntax
- "Translate" page borrowed from FireMonkey to help with submitting translations

[HEAD]: https://gitlab.com/jfx2006/markdown-here-revival/-/tags/vHEAD
[//]: # "C3-2-DKAC:GGL:Rjfx2006/markdown-here-revival:Tv{t}"

# About changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
