# P6.1 — Shared Shell Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-30 | opencode (AI) | P6.1 (T8.8.18): spec shell adopted; Tier 1 8/1, Tier 2 23/0; 212 assertions green |

**Document ID**: PPP-RPT-P6.1-001
**Status**: COMPLETE (P6 overall IN PROGRESS)
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.44 §8.8 (P6.1)
**Related issue**: I-83 (UI conformance; P6.2–P6.4 open)

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. What changed
5. Decisions implemented
6. Test results
7. Screenshots
8. What remains (P6.2–P6.4)
9. Recommendations

## 2. Objective and scope

Adopt the shared application shell of spec §3.1–§3.3 without changing panel content or data:
two-row header (title bar + menu bar), 160 px left navigation sidebar, scrollable content area with a
filter strip and body, a full-width status bar, and the warning area inside the content zone.
Out of scope: panels §4–§5 (P6.2), KPI/tokens/components §5–§7 (P6.3), the §8 record (P6.4).

## 3. Method and environment

| Item | Value |
|---|---|
| Build | `node build.mjs` from `PPP/` |
| Suites | five files, 212 assertions |
| Browser | Playwright Chromium, `file://`, repository workbook, 1440×900 and 1280×800 |
| Harness | `node harness.mjs --dashboard ppp --tier 1|2|3` |

## 4. What changed

- **Title bar** — navy, 78 px, three rows (`project`, `dashboard`, `start · as-of`) and the active page
  name right-aligned at 16 px/600 with `aria-live="polite"`.
- **Menu bar** — white, one row, 49 px. Left: sidebar toggle (compact), primary **Load Workbook**,
  **Export** menu. Right: the category filter, **Search** popover, **Warnings** toggle with count, and
  the KPI-density icon at the right end. All controls are 600 weight and 32 px tall.
- **Left sidebar** — 160 px navy; page links only; **Settings** and **Help** pinned to the bottom;
  resizer at the right edge; collapse toggle lives in the menu bar. The benchmark label was shortened
  to **Benchmark** so the widest title does not clip (D1 allows the shorter label).
- **Content** — a `filter-area` strip (active category/search chips) above the scrollable body;
  warning area inside the body with a stable marker; no toolbar; the page itself does not scroll.
- **Status bar** — 30 px, full width, at the viewport bottom.
- **Welcome** — remains the pre-load overlay; a load failure (S1/S2) now shows on the welcome card,
  because the dashboard warning area is not visible yet.

## 5. Decisions implemented

| ID | Decision | Implementation |
|---|---|---|
| D12 | Search filters the package set | Text matches title, package number, discipline and status; combines with the category filter; every panel re-derives |
| D13 | Export offers both CSVs | Menu with Validation CSV and PO look-ahead CSV, using the tested row builders |
| D14 | Layout toggle cycles KPI density | 6 → 3 → 2 columns, persisted; panels stay full width |

## 6. Test results

| Check | Result |
|---|---|
| Unit / pipeline / edges / build / panels | 37 + 71 + 22 + 19 + 63 = **212 passed, 0 failed** |
| Browser shell geometry | title bar 78 px at y=0; menu bar 49 px; sidebar 160×743; status bar 30 px at the bottom; content scrolls |
| Search | "Mechanical" → 25 packages and a filter chip; cleared → 129 |
| Warnings | count 1; toggle hides and shows the banner |
| Layout | click 1 → 2, click 2 → 3 |
| Settings | opens; Dark applies; Light restores |
| Navigation | page name updates; content scrolls to the panel |
| Console | 0 errors |
| Harness Tier 1 | **8 passed, 1 failed** — only the module-script marker |
| Harness Tier 2 | **23 passed, 0 failed** |
| Harness Tier 3 | **3 passed, 0 failed** |

The Tier 1 failure is the module-script marker: it wants an inline `type="module"` or a linked module,
while D8 requires one inlined classic script for `file://`. It is a decision for P6.4, not a P6.1
regression.

## 7. Screenshots

`workplan/reports/screenshots/`:

- `p6_1_1440.png` — light theme, 1440×900
- `p6_1_1280.png` — light theme, 1280×800, scrolled to Data Validation
- `p6_1_1440_dark.png` — dark theme, 1440×900

## 8. What remains (P6.2–P6.4)

- **P6.2 panels §4–§5**: panel head/action cluster, chart control ownership, combined chart, bounded
  tables, drill-down, validation panel. The content still repeats the active page name as a panel
  heading (the KPI panel), which §3.3 forbids.
- **P6.3 KPI/tokens/components §5–§7**: KPI cards are currently taller than 72 px and carry a
  sub-label line; §5 allows only value + label and a 3 px strip. Component and token sweep remains.
- **P6.4 conformance §8**: record the result, add §8.2 assertions, update the §8.3 table, decide the
  module-script marker against D8.

## 9. Recommendations

- Keep `data-shell` markers stable; Tier 1/2 depend on them.
- Keep the filter strip inside the content zone; it is the required `filter-area` marker.
- Do not put Settings/Help back in the menu bar. §3.2 requires them at the bottom of the sidebar.
- The `.hidden` utility must not be overridden by the `.app` display rule; use `.app.hidden` with
  `!important` (this cost one debugging cycle).
