# <img src="extension/images/md_fucsia.svg" alt="MDHR Logo" height="24" width="24" align="bottom"> Markdown Here Revival — Thunderbird 151+ Edition

> :us: [English Version](README.md)

在 Thunderbird 中编写 Markdown 邮件，发送前渲染为漂亮的 HTML。

支持 GFM 表格、代码语法高亮、LaTeX 数学公式、emoji 快捷输入，以及实时预览。

---

> **维护者的话：** 我一直在寻找一种优雅规整地撰写邮件的方式，尝试过很多邮件客户端。目前 Thunderbird 上的 Markdown Here Revival 插件是我最满意的解决方案。很遗憾，原开发者已不再更新这个插件。为了能在新版本的 Thunderbird 中继续使用，我借助 AI 对插件做了微小的兼容性修改。这个 fork 只是一个权宜之计——我非常期待有同样需求的开发者能够更专业地维护和更新这个项目。如果你正是那个人，欢迎联系我，或者直接 fork 这个项目。

---

## 项目来龙去脉

这个项目的代码血统跨越了十余年，历经三代维护者：

### 第一代：[Markdown Here](https://markdown-here.com/)（Adam Pritchard，约 2012–2019）

Adam Pritchard 创建了最初的 Markdown Here，一个同时支持 Chrome、Firefox 和 Thunderbird 的跨浏览器扩展。它将 Markdown 在浏览器/邮件客户端中实时渲染为 HTML，广受欢迎。但作者在大约 2019 年后停止了维护，社区多次尝试联系未果。

### 第二代：[Markdown Here Revival](https://gitlab.com/jfx2006/markdown-here-revival)（Rob Lemley / JFX，2021–2025）

Rob Lemley（GitLab 用户名 JFX）fork 了原始项目，专注于 Thunderbird 邮件客户端。他移除了浏览器支持以降低维护负担，重写了 Thunderbird 集成（从 XUL/XPCOM 迁移到 MailExtensions API），并新增了：
- 基于 `ex_customui` 实验 API 的**实时预览分栏面板**
- **通知栏**更新提醒
- **13 种语言**国际化
- 现代化的依赖和构建系统

Markdown Here Revival 从 4.0.0 到 4.0.12 版本一直支持 Thunderbird 128–150。

### 第三代：本项目（2026–）

Thunderbird 151 于 2026 年 5 月发布，是一次新的 ESR 大版本升级（基于 Firefox 151）。第二代项目将 `strict_max_version` 限制在了 `150.*`，导致无法在 Thunderbird 151 及以上版本安装。

本项目（4.0.13 起）**更新了版本兼容性以支持 Thunderbird 151 ESR 及更高版本**，让有需要的用户能够继续使用。

---

## 兼容性

| 扩展版本 | Thunderbird 版本 |
|----------|-----------------|
| 4.0.13+ | **151.0+** |
| 4.0.0 – 4.0.12 | 128.0 – 150.* |

*本项目仅针对 Thunderbird 邮件客户端。不支持 Gmail、Outlook 等网页邮箱。*

---

## 安装

### 从 XPI 文件安装

1. 从 [Releases](../../releases) 页面下载 `markdown-here-revival.xpi`
2. 打开 Thunderbird → 菜单 → **Add-ons and Themes**
3. 点击齿轮图标 → **Install Add-on From File...**
4. 选择下载的 `.xpi` 文件

### 重要前置设置

确保 Thunderbird 使用 HTML 格式撰写邮件：

> **Account Settings** → **Composition & Addressing** → 取消勾选 **"Compose messages in HTML format"** 旁边的纯文本选项

---

## 使用

1. 用 Markdown 撰写邮件，例如：

   ```
   **Hello** `world`.

   ```javascript
   alert('Hello syntax highlighting.');
   ```

   也可以在这里写 $E=mc^2$ 数学公式。
   ```

2. 点击格式工具栏上的 MDHR 图标（或按 `Ctrl+Alt+M`）
3. Markdown 会实时渲染为带样式的 HTML
4. 点击发送 — 收件人看到的和你预览的一样

### 回复邮件

正常的回复和转发：引用内容（`blockquote`）会自动保留，不会被 Markdown 渲染器处理。

### 返回到 Markdown

渲染后，再次点击工具栏按钮即可回到原始 Markdown（注意：在 HTML 模式下做的修改会丢失）。

---

## 功能

- **实时预览分栏**（Modern 模式）：在编辑器旁边实时预览渲染效果
- **经典模式**：在编辑器中直接切换 Markdown / HTML
- **GFM 表格**
- **代码语法高亮**（highlight.js，支持 100+ 语言）
- **LaTeX 数学公式**（TeXZilla 或 CodeCogs）
- **Emoji 自动补全**（`:smile:` → 😄）
- **智能排版替换**（引号、破折号、省略号等）
- **Bug/Issue 号自动链接**（`#123` → 可点击链接）
- **13 种界面语言**

---

## 构建

```bash
git clone <this-repo>
cd markdown-here-revival
npm install
make vendored    # 复制/打包 vendor 依赖
npx web-ext build -s extension -n markdown-here-revival.xpi
```

构建好的 XPI 位于 `web-ext-artifacts/markdown-here-revival.xpi`。

前提条件：Node.js 22+、make、python3。

---

## 许可证与版权

本项目包含来自多个来源的代码，各部分使用不同许可证：

### 代码 — MIT License

```
Copyright (c) 2012–2019 Adam Pritchard
Copyright (c) 2021–2025 Rob Lemley
```

所有源代码（`extension/` 目录，图标除外）使用 **MIT License**。完整文本见 [LICENSE](LICENSE)。

MIT License 允许自由使用、修改、分发、再授权（包括用于专有软件），但必须保留以上版权声明和许可证文本。

### 图标 — Mozilla Public License v2

```
Copyright (c) Gregory K.
```

`extension/images/` 目录下的图标文件使用 **Mozilla Public License v2**。完整文本见 [LICENSE.images](LICENSE.images)。

MPL-2.0 是一种文件级别的 copyleft 许可证：修改 MPL 许可的源文件需要以 MPL 发布修改后的文件；新增的文件可以使用其他许可证。

### 第三方依赖

`extension/vendor/` 和 `extension/highlightjs/` 目录包含第三方库（marked、turndown、DOMPurify、highlight.js 等），它们使用各自的许可证。运行 `make vendored` 时会将它们从 `node_modules/` 复制进来。

---

**为何选择 MIT License？** Markdown Here Revival 的作者（Rob Lemley）在 CONTRIBUTING.md 中表示他希望保持 MIT 兼容，让版权管理尽可能简单。这段原话很好地概括了这个开源项目的精神：

> *"All contributions must be somehow MIT compatible for now; I intend to look at relicensing so that we don't need to maintain who has the copyright on what where. It's open source, that sort of thing is silly."*

---

## 致谢

- **Adam Pritchard** — 创建了 [Markdown Here](https://markdown-here.com/)
- **Rob Lemley (JFX)** — 创建了 [Markdown Here Revival](https://gitlab.com/jfx2006/markdown-here-revival)，使其在现代 Thunderbird 上运行
- **Gregory K.** — 4.0 版本的新图标
- **Cliff Brake** — 修复了 4.0.12 版本中 Thunderbird 148+ 的兼容性问题
- 所有翻译者和社区贡献者

---

*这不是原始 Markdown Here Revival 项目的官方仓库。官方项目托管在 [GitLab](https://gitlab.com/jfx2006/markdown-here-revival)。*
