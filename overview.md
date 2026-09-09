# Overview — Attachment popover "Card C" layout (ISS-78)

**Date:** 2026-09-08
**Task:** Implement the agent's recommended **Card C** hybrid layout for the ActionTracker
Attachments popover (`#aeAttachPop`). User instruction: *"use your recommendation C."*

## What changed

### `action-log/js/render.js` — `openAttachPop()` body markup
Rebuilt the popover body as **two clearly separated cards**, each with a header that carries
the section title (left) and a single primary action (right):
- **Pictures** card → header action **"+ Add pictures"** (multi image picker embedded).
- **File links** card → header action **"Browse files"**; below it a paste-URL input + **"Add link"**
  button, then an honest tip, then the link chips.
- Only the **Done** button remains in the modal footer (matches GitLab / Primer / macOS modal
  conventions and avoids the "all buttons at the bottom" anti-pattern flagged in review:
  >3 actions would break the footer; contextual add-controls belong with their content).

### `action-log/css/styles.css` — `.ae-attach*` block
Rewritten as **card styling**: `.ae-attach-card` (rounded, bordered, subtle fill, 10px radius),
`.ae-attach-card-h` (flex space-between header), `.ae-attach-card-t` (title), `.ae-attach-tip`
(honest helper text), and consistent right-aligned card action buttons. Empty chip rows still
auto-collapse (`:empty`); cards stay visible when empty so the user can always add.

### Tip-text bug fixes (from the 2026-09-08 review)
1. `C:\folder\file.pdf` was written inside a JS template literal → the `\f` became a **form-feed
   escape**. Now correctly escaped as `C:\\folder\\file.pdf`.
2. The tip falsely promised a `file://` link "opens". Now honest: a `file://` link opens **only**
   when the app runs as a local file; on a server, use a relative path like `files/report.pdf`.

`renderChips()` is **unchanged** — it still toggles `has-items`/`has-any` on the retained
`.ae-attach-group` class, which is now a second class on each card (so `groups[0]`=Pictures,
`groups[1]`=File links order is preserved).

## Workplan
- `action-log/project_action_log_workplan.md` updated in place: **§16.4 ISS-78** added + **§11**
  2026-09-08 dated entry. (§2 v43 row not bumped — the v42 row is >2000 chars and was truncated
  by the reader, so an exact edit was unsafe; add it manually if desired.)

## Verification status
- Bash shell was unavailable this session (`Connection lost`), so `node --check` could **not** be
  run by the agent. The edited markup was verified by inspection (balanced tags, IDs preserved).
- **You to run locally:**
  ```
  node --check action-log/js/render.js
  ```
  then a browser smoke test: open an action → click the paperclip count chip → confirm two cards,
  right-aligned header actions, Done only in footer, empty cards visible, tip text correct.
- After that: `git add -A && git commit`.
