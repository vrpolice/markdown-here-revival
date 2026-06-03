# <img src="extension/images/md_fucsia.svg" alt="MDHR Logo" height="24" width="24" align="bottom"> Markdown Here Revival — Thunderbird 151+ Edition

> :cn: [中文版本 (Chinese)](README.zh-CN.md)

Write email in Markdown, render it as styled HTML before sending.

GFM tables, syntax highlighting, LaTeX math, emoji autocomplete, and a live preview pane — all inside Thunderbird.

---

> **A note from the maintainer:** I've long sought an elegant way to write well-formatted emails. I've tried many email clients over the years, and the Markdown Here Revival plugin for Thunderbird is by far the most satisfying solution I've found. Unfortunately, the original developer is no longer maintaining it. To keep it working on newer Thunderbird versions, I made minimal compatibility fixes with the help of AI. This is a stopgap — I very much hope that a developer with similar needs will pick this up and maintain it more professionally. If that's you, please reach out or just fork the project.
>
> **Disclaimer:** This is an independent fork, maintained separately from the upstream project. Bug reports and feature requests should be directed to this fork's [issue tracker](../../issues), not to the original authors. The upstream maintainers are not responsible for any changes or issues introduced here. If the original authors have concerns, they are welcome to [reach out](../../issues).

---

## Project History

This codebase spans over a decade and three generations of maintainers.

### 1st Gen: [Markdown Here](https://markdown-here.com/) by Adam Pritchard (~2012–2019)

Adam Pritchard created the original Markdown Here, a cross-browser extension for Chrome, Firefox, and Thunderbird that rendered Markdown to HTML on the fly. It was widely used, but maintenance ceased around 2019 and attempts to reach the author were unsuccessful.

### 2nd Gen: [Markdown Here Revival](https://gitlab.com/jfx2006/markdown-here-revival) by Rob Lemley / JFX (2021–2025)

Rob Lemley forked the project to focus on Thunderbird exclusively. He removed browser support to reduce maintenance, rewrote the Thunderbird integration (from XUL/XPCOM to MailExtensions APIs), and introduced:

- A **live preview split pane** via the `ex_customui` experiment API
- **Notification bar** integration for update alerts
- **13 language** translations
- Modern build tooling and dependency management

Versions 4.0.0 through 4.0.12 supported Thunderbird 128–150.

### 3rd Gen: This Project (2026–)

Thunderbird 151 shipped in May 2026 as a new ESR release (rebased on Firefox 151). The upstream project's `strict_max_version` was capped at `150.*`, preventing installation on Thunderbird 151 and newer.

This fork updates the extension compatibility for **Thunderbird 151 ESR and above**, keeping the tool alive for those who depend on it.

---

## Compatibility

| Extension version | Thunderbird version |
|-------------------|---------------------|
| 4.0.13+ | **151.0+** |
| 4.0.0 – 4.0.12 | 128.0 – 150.* |

*Thunderbird only. Browser-based email (Gmail, Outlook, Yahoo Mail) is not supported.*

---

## Installation

### Install from XPI

1. Download `markdown-here-revival.xpi` from the [Releases](../../releases) page
2. Open Thunderbird → Menu → **Add-ons and Themes**
3. Click the gear icon → **Install Add-on From File...**
4. Select the `.xpi` file

### Prerequisite

Make sure Thunderbird is set to compose in HTML:

> **Account Settings** → **Composition & Addressing** → uncheck the plain-text option

---

## Usage

1. Compose an email in Markdown. For example:

   ```
   **Hello** `world`.

   ```javascript
   alert('Hello syntax highlighting.');
   ```

   You can write $E=mc^2$ math here too.
   ```

2. Click the MDHR icon in the format toolbar (or press `Ctrl+Alt+M`)
3. Your Markdown renders into styled HTML in real time
4. Send — your recipients see exactly what you previewed

### Replying & Forwarding

Reply as normal. Quoted content (`<blockquote>`) is automatically excluded from Markdown rendering.

### Revert to Markdown

Click the toolbar button again to toggle back to raw Markdown. Note: edits made in the rendered HTML view will be lost.

---

## Features

- **Live preview split pane** (Modern mode) — preview updates as you type
- **Classic mode** — toggle Markdown/HTML directly in the editor
- **GFM tables**
- **Syntax highlighting** (highlight.js, 100+ languages)
- **LaTeX math** (TeXZilla or CodeCogs)
- **Emoji autocomplete** (`:smile:` → 😄)
- **Smart typography** (curly quotes, em-dashes, ellipses)
- **Bug/issue auto-linking** (`#123` → clickable link)
- **13 UI languages**

---

## Building

```bash
git clone https://github.com/<your-username>/markdown-here-revival.git
cd markdown-here-revival
npm install
make vendored     # bundle vendor dependencies
npx web-ext build -s extension -n markdown-here-revival.xpi
```

The built XPI is at `web-ext-artifacts/markdown-here-revival.xpi`.

Prerequisites: Node.js 22+, make, python3.

---

## License & Copyright

This project incorporates code from multiple sources. Each component is licensed separately:

### Code — MIT License

```
Copyright (c) 2012–2019 Adam Pritchard
Copyright (c) 2021–2025 Rob Lemley
```

All source code in `extension/` (excluding icons) is licensed under the **MIT License**. See [LICENSE](LICENSE) for the full text.

The MIT License permits unrestricted use, modification, distribution, and sublicensing (including in proprietary software), provided the above copyright notice and license text are retained.

### Icons — Mozilla Public License v2

```
Copyright (c) Gregory K.
```

Icon files in `extension/images/` are licensed under the **Mozilla Public License v2**. See [LICENSE.images](LICENSE.images) for the full text.

MPL-2.0 is a file-level copyleft license: modifications to MPL-licensed source files must be shared under MPL; new files may use other licenses.

### Third-party Dependencies

`extension/vendor/` and `extension/highlightjs/` contain bundled third-party libraries (marked, turndown, DOMPurify, highlight.js, etc.), each under its own license. They are copied from `node_modules/` when running `make vendored`.

---

## Acknowledgements

- **Adam Pritchard** — creator of [Markdown Here](https://markdown-here.com/)
- **Rob Lemley (JFX)** — creator of [Markdown Here Revival](https://gitlab.com/jfx2006/markdown-here-revival), bringing it to modern Thunderbird
- **Gregory K.** — new icons for MDHR 4.0
- **Cliff Brake** — compatibility fixes for Thunderbird 148+ in v4.0.12
- All translators and community contributors

---

*This is not the official Markdown Here Revival repository. The official project is hosted on [GitLab](https://gitlab.com/jfx2006/markdown-here-revival).*
