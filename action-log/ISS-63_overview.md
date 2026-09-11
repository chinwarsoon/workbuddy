# ISS-63 — Export minutes (v56) — Completion overview

## What was delivered
- **Goal:** a one-click Word "minutes" export of the open action's dated detail log, reusing the existing `msoDownload` Word pipeline.
- **Approved decisions (user, 4 points):** (1) button in `#edTop`; (2) Word only; (3) export the current ISS-62 filter/sort view; (4) do ISS-63 before ISS-64.

## Files changed
- `js/render.js`
  - `exportOrderedDetailLog(a)` (≈L990–1016): reads the **live** `#aeLogBody` rows (skips `display:none` filtered rows, follows DOM/view order, captures unsaved inline edits). View-only — never mutates `a.detailLog` (complies with ISS-61 "DOM order = data order").
  - `#aeExportMinutes` button appended idempotently to `#edTop` inside `bindActionEditor` (≈L704–722) and wired to `exportMinutes`. Survives re-renders (re-wires `onclick` each time).
- `js/report.js`
  - `exportMinutes(a, rows)` / `minutesLogRows(rows)` / `minutesImgsHtml(r)` (≈L87–125): Word `.doc` named `Minutes - <title>.doc`; title + metadata block (reused from `exportWord`) + 6-column log table (**Date / Type / Action by / Due / Status / Detail**); attachments/images render as hyperlinks.
- `project_action_log_workplan.md`: §2 (v55 + v56 rows), §11 living log, §16.4 ISS-63 → **Implemented (2026-09-11, v56)**.
- `USER_MANUAL.md`: new "Exporting minutes (ISS-63)" section.

## Deferred
- `@ref` (`@<id>` / `@img:<name>`) resolution at export → **ISS-64** (`expandRefs` on this same path).

## Pending — run locally (sandbox shells down)
1. Syntax check: `node --check js/render.js` and `node --check js/report.js`
2. Browser smoke test: hard-refresh (Ctrl+Shift+R) → open an action → set a filter/sort → click **Export minutes** → confirm Word downloads with the 6-col table reflecting the current view, and that no data changed.
3. Commit.
   (Also still outstanding from earlier: v38→v55 `node --check` + commit, and Phase C archive move of `v37_apply.md` / `v38_apply.md` / `apply_v38.js` / `OVERVIEW.md` → `arch/`.)
