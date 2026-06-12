# Bilingual Landing Page Design

## Goal

Refresh the project website with a Thunderbird-inspired visual direction, add the real product screenshot, and provide a complete Chinese version while keeping English as the default.

## Structure

- `docs/index.html` remains the English default page.
- `docs/zh/index.html` provides the Chinese page.
- English navigation links to `zh/`; Chinese navigation links to `../`.
- Both pages use `docs/demo/demo.png` and `docs/images/md_fucsia.svg`.
- Add `hreflang`, canonical language alternates, descriptive image `alt` text, and responsive image sizing.

## Visual Direction

- Replace the purple-gradient template look with Thunderbird blue, warm white, cool gray, and dark ink.
- Use an editorial hero with stronger typography and a clearer product statement.
- Make the real Thunderbird screenshot the central proof of the live-preview workflow.
- Crop the screenshot visually with a responsive frame while retaining the original file.
- Reduce repetitive feature cards and use a more varied editorial layout.
- Keep motion subtle and honor `prefers-reduced-motion`.

## Content

English screenshot caption:

> Live Markdown preview in Thunderbird
>
> Write in Markdown and see the rendered email beside your draft, with bilingual text, links, quotes, lists, and highlighted code.

Chinese screenshot caption:

> Thunderbird 中的 Markdown 实时预览
>
> 编写 Markdown 时即可在草稿旁查看渲染后的邮件，支持中英文内容、链接、引用、列表与代码高亮。

The Chinese page translates the complete navigation, hero, features, workflow, installation, history, and footer content rather than mixing languages on one page.

## Constraints

- Static HTML and CSS only.
- No new runtime dependency or build step.
- English remains the root/default URL.
- Existing GitHub, release, issue, license, and upstream links remain unchanged.
- The screenshot must not expose the original sender address.

## Verification

- Validate all local links and image references.
- Check English and Chinese pages at desktop and mobile widths.
- Confirm language switching works in both directions.
- Confirm the screenshot loads, has useful alt text, and does not overflow.
- Confirm keyboard focus, heading order, color contrast, and reduced-motion behavior.
