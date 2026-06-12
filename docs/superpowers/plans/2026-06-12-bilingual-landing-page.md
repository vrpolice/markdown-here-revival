# Bilingual Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Thunderbird-inspired English landing page with a complete linked Chinese version and a real product screenshot.

**Architecture:** Keep the site dependency-free and static. English remains at `docs/index.html`; Chinese lives at `docs/zh/index.html`; both pages share `docs/site.css` and existing image assets.

**Tech Stack:** HTML5, CSS3, Node.js built-in test runner

---

### Task 1: Lock the bilingual page contract

**Files:**
- Create: `test/docs-pages.test.mjs`

- [ ] Assert that both language pages, reciprocal language links, alternate-language metadata, screenshot references, and accessible text exist.
- [ ] Run `node --test test/docs-pages.test.mjs` and confirm it fails because the Chinese page and shared stylesheet are missing.

### Task 2: Implement the shared visual system

**Files:**
- Create: `docs/site.css`
- Modify: `docs/index.html`
- Create: `docs/zh/index.html`

- [ ] Build the shared Thunderbird-inspired type, color, layout, screenshot, feature, workflow, installation, and footer styles.
- [ ] Replace the English page with the new editorial structure and real screenshot.
- [ ] Add the fully translated Chinese page with corrected relative asset paths.
- [ ] Run `node --test test/docs-pages.test.mjs` and confirm it passes.

### Task 3: Verify the final pages

**Files:**
- Verify: `docs/index.html`
- Verify: `docs/zh/index.html`
- Verify: `docs/site.css`

- [ ] Run the project test suite and HTML structure test.
- [ ] Serve `docs/` locally and inspect both pages at desktop and mobile widths.
- [ ] Verify language switching, image loading, overflow, focus visibility, reduced motion, and browser console output.
