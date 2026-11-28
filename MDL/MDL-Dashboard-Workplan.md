# MDL Dashboard — Developer Workplan (for Review)

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-09-29 | chinwarsoon | Initial proposal. Mirrors the PPP dashboard architecture. |
| 1.1 | 2026-10-18 | chinwarsoon | §4.0 top bar and menu bar model. Bug fixes I-105…I-109. |
| 1.2 | 2026-10-20 | chinwarsoon | I-114 implemented: `Code!AN:AO` Overdue Type, column chooser class, Validation rule-code filter. |
| 1.3 | 2026-10-21 | chinwarsoon | I-115 aligned: floating-panel ordering contract made normative. |
| 1.4 | 2026-10-23 | chinwarsoon | Shared spec generalised; MDL content moved to §11; citations corrected. |
| 1.5 | 2026-10-25 | chinwarsoon | Evidence pointer corrected to `MDL/log/issue_log.md`. No behaviour change. |
| 1.6 | 2026-11-21 | chinwarsoon | I-135 collapsed sidebar fix and the I-130…I-134 fixes. |
| 1.7 | 2026-11-25 | chinwarsoon | I-146…I-150 chart and table conformance. Column centers match attached tables. |
| 1.8 | 2026-11-26 | AWS Quick (AI), CodeBuddy (AI) | I-164 W3 welcome adoption. Common 1.0.2 inlined. Working tree, not committed. |
| 1.9 | 2026-11-27 | AWS Quick (AI), CodeBuddy (AI) | I-165 W3.1 welcome 1.2.1 two-column card, common C-07, and dashboard version 1.9 for the welcome footer and status bar. Welcome 1.3.0 holds 10 seconds and shows `Rev 1.9 · © 2026 UESH`; dashboard version stays 1.9. Welcome Help is `What file do I need?` and opens welcome-specific help. Welcome 1.3.1 holds the done step for 3000 ms after the 10-second hold. Working tree, not committed. |
| 1.10 | 2026-11-28 | CodeBuddy (AI) | I-166 closed — theme rework: six themes from `common/tokens`, chrome tokens, welcome theme picker, and themed S-curve table header and export. Validation: tokens 160 / 0, welcome 73 / 0, grid 45 / 45, shell 125 / 0, render 190 / 13 pre-existing, harness 343 / 2 baseline. Dashboard version stays 1.9. |
| 1.12 | 2026-11-28 | CodeBuddy (AI) | I-167 validated — CSS specificity fixes, test-probe closure, rebuild at 436,311 bytes, and a full suite rerun. Crosshair assertions pass; only known baseline failures remain. Dashboard version stays 1.9. |
| 1.11 | 2026-11-28 | CodeBuddy (AI) | I-167 closed — crosshair contract completed for spec rev 1.116: arrow-key navigation, pinned-cell tint, strong 14% / 22%, token test resolver, and harness checks. Validated in rev 1.12. Dashboard version stays 1.9. |

> **Project**: TWRP C3B2 — Master Document List (MDL) Interactive Dashboard
> **Version**: 1.9
> **Date**: 2026-09-29
> **Status**: Proposal — **NO CODE WRITTEN YET**. Mirrors the PPP Dashboard architecture
> (`PPP/PPP-Dashboard-Workplan.md` + `PPP/arch/PPP_Dashboard.html`).
> **Last revised**: 2026-11-28 — **I-167 validated — crosshair contract complete for spec rev 1.116: arrow keys, pinned-cell tint, strong 14% / 22%, token resolver and harness checks. Rebuilt at 436,311 bytes. Shell 127 / 0; harness 366 / 2 baseline; no crosshair failure. Dashboard version stays 1.9.** Prior — **I-166 closed — six-theme chrome tokens, welcome theme picker, and themed S-curve header and export.** Prior — **Welcome 1.3.1 holds the painted done step for 3000 ms after the 10-second hold, then opens the dashboard.** Prior — **Welcome Help is `What file do I need?` and opens welcome-specific help. Dashboard Help is unchanged.** Prior — **Welcome 1.3.0: 10-second hold and `Rev 1.9 · © 2026 UESH` footer.** Prior — **§11.36 DONE — welcome 1.2.0 two-column card adopted (I-165 RESOLVED).** Common 70 / 0; shell 125 / 0; render 190 / 13; harness 281 / 2 (baseline); Tier 7 43–53 and 51 pass. Prior — **§11.36 re-scoped to welcome 1.2.0, two-column card (I-165, IN PROGRESS).** Prior — **§11.36 welcome layout 1.1.0 (I-165, IN PROGRESS).** Opener handler, config and test edits written; rebuild and test run pending. Prior — 2026-11-26 — **§11.35 is now the full MDL welcome implementation plan; the shared plan moved to `common/workplan/Welcome-Page-Workplan.md` (I-164, OPEN).** Not started. Prior — 2026-11-26 — **Welcome page to spec §3.7 rev 1.107 planned (I-164, OPEN).** See §11.35. Prior — 2026-11-25 — **Validation Rules resize alignment and header-label minima fixed (I-163).** See §11.34. Column minima are content-aware, fit grows to fill the display area, persisted widths are honoured, and the rules empty state uses one cell per visible column. Shell suite 125 passed / 0 failed; full render 184 / 197; layout harness 241 passed / 2 failed / 2 advisory / 24 skipped. Prior — **Harness ground truth and L3 table discovery fixed (I-162).** See §11.33. Added `--ds-zebra` with five theme values, applied it to every table body and pinned even cells, removed the overdue row fill and aligned matrix export colors. Shell suite 125 passed / 0 failed; full render 183 / 196; layout harness 226 passed / 12 failed / 2 advisory / 20 skipped. Prior — **Validation page redesigned as two panels (I-160).** See §11.31. The page follows the SUB design and spec assertion 36: `Validation Rules` and `Validation Issues` are top-level, numbered and full width, with one chip row each, card tool rows, rule CSV / Columns, 200-row issue pagination and a unique `data-validation-count` hook. Shell suite 119 passed / 0 failed; full render 182 / 195; layout harness 225 passed / 12 failed / 2 advisory / 20 skipped. Prior — **Overdue List layout aligned with the UI spec (I-151 … I-159).** See §11.30. The tool row now follows the card and left/right split rules. Pagination, hidden empty CSV, document columns, alignment, token gaps and help text are fixed. Shell suite 117 passed / 0 failed; layout harness 219 passed / 10 failed / 2 advisory / 22 skipped with the baseline failure set. Prior — **Chart column centers match attached-table column centers per spec rev 1.106 (I-150).** See §11.29. `curveDraw()` and PNG / Copy export now use the real plot width, so the SVG scale is 1 and every chart column center is within 2 px of its table header. Harness board-contract center check passes; shell suite 111 passed / 0 failed. Prior — **ONE table-header design for every table type per spec rev 1.105 (I-149).** See §11.28. Chart-attached tables now use the independent-table `--navy` header with white text in both render and PNG/Copy export. Harness board-contract header check passes; shell suite 110 passed / 0 failed. Prior — **Attached-table CSV and Y-axis caption typography per spec rev 1.104 (I-148).** See §11.27. The curve tool row now has `⤓ CSV` before PNG with a full-window, BOM-prefixed download; "Documents" is centred near the axis, reads bottom-to-top, and caption and ticks are bold in `--text2`. Shell suite 110 passed / 0 failed. Prior — **Attached-table gap, board fit and themed header fill per spec rev 1.103 (I-147).** See §11.26. A 10 px named gap separates plot and table, the board no longer scrolls, wide month headers rotate to an 88 px vertical band and the header fill follows `--surface2`. Harness board-contract tier added (6 new checks); shell suite 106 passed / 0 failed. Prior — **General two-row chart head per spec rev 1.102 (I-146).** See §11.25. The tool row sits above the full-width time bar row, right-aligned with 10 px / 2 px gaps; the date range text follows the chips and the project-start caption is gone. Spec rule is general for all dashboards, not a deviation. Shell suite 101 passed / 0 failed. Prior — **Time-bar fill aligned with the thumbs (I-145).** See §11.24. The fill was nested inside the 4 px track element; it is now a zone sibling and live-browser measurement confirms sub-pixel alignment with both thumbs. Shell suite 95 passed / 0 failed. Prior — **Time bar aligned with the Sub reference design per spec rev 1.101.** See §11.23. The segmented control uses the shared tokens, the full B2.1 state set and the navy active fill; the time bar uses the pinned Sub geometry, window tick semantics, January year labels, thumb-compensated positioning and the current-`to` preset anchor. `MDL-Dashboard.html` rebuilt at 300,479 B; shell suite 94 passed / 0 failed. Prior — **I-137 … I-143 fixed: Issue Progress S-curve aligned with spec rev 1.100.** See §11.22. The panel uses a reserved reference-label band, named legend insets, gutter Y ticks, one unit caption, the table thead X axis, the full time-bar contract, the shared binder, tokenised area fills and chart tap-to-show. `MDL-Dashboard.html` rebuilt at 298,581 B; shell suite 84 passed / 0 failed. Prior — **design review logged.** Shared spec rev 1.100 is in force in both byte-identical copies. The seven findings were mapped in §11.22.**I-135 fixed: collapsed sidebar keeps the content usable.** See §11.20. `body.sidebar-collapsed .shell-main` now uses `grid-template-columns:minmax(0,1fr)`. The harness Tier 2 sidebar check clicks the toggle and verifies the sidebar hides, content width, panel widths, and toggle label. Bundled at 275,103 B; shell suite 60/60 passed; Tier 2: 52 passed / 0 failed; Tier 6: 27 passed / 0 failed. Prior — **I-134 fixed: matrix table has its own rounded border.** See §11.19. The tool row now sits before the table card. `.matrixcard` has `1px solid var(--border)` and `border-radius:10px`. Panel border stays. Bundled at 275,105 B; shell suite 59/59 passed; Tier 4 border and corner checks pass. Prior — **I-133 corrected: panel border kept, matrix card border removed.** See §11.18. Spec rev 1.99 stays universal. MDL keeps `--tool-pad` and `--tool-gap`, uses 12 px / 10 px token gaps, pads the matrix tool row, and keeps the panel edge as the only visible border. Bundled at 275,082 B; shell suite 59/59 passed; browser probe confirms panel `1px solid`, matrix card `0px none`; Tier 6: 27/0. Prior — **I-132 fixed: matrix tool row aligned to §4.** See §11.17. The tool row now sits inside the table card. Month is in the left filter group. Actions are in the right group. `MDL-Dashboard.html` rebuilt; shell suite 54/54 passed; Tier 6: 27/0. Prior — **I-131 fixed: fixed tooltip label column.** See §11.16. Both tooltip grids now use a 76 px label column. `MDL-Dashboard.html` rebuilt; shell suite 50/50 passed; Tier 6: 27 passed / 0 failed. Prior — **I-130 fixed: general hover-window value alignment added.** See §11.15. Both spec copies updated to rev 1.98. MDL tooltip rows now use a fixed label column. Text aligns left and numbers align right. `MDL-Dashboard.html` rebuilt; shell suite 50/50 passed. Prior — **I-129 fixed: KPI hover windows added.** See §11.14. All 16 KPI hosts bind one shared `.chart-tip`. `MDL-Dashboard.html` rebuilt; shell suite 47/47 passed. Full harness before the Tier 6 selector fix: 160 passed / 10 failed / 2 advisory / 24 skipped; Tier 6 was skipped because it waited for `.page-link`. The harness selector is now generic. Harness revisions 1.35 and 1.36 added load progress and removed the body state marker from Tier 6 page discovery. Standalone Tier 6 now completes: 27 passed / 0 failed / 0 advisory / 0 skipped. Prior — **I-128 fixed: footer metadata moved into the status bar.** See §11.13. Status bar now shows `MDL Dashboard v0.1 · Updated 20 Nov 2026 · © UESH 2026` on the right. The page footer is removed. `MDL-Dashboard.html` rebuilt; shell suite 41/41 passed; full harness: 159 passed / 11 failed / 2 advisory / 24 skipped. Prior — **I-127 fixed: bottom status bar aligned with the UI spec.** See §11.12. Named fields at that step: left `File: <workbook name>` plus optional render-issue count; right `MDL Dashboard v1.0`. I-128 superseded the version and right-side metadata. `MDL-Dashboard.html` rebuilt; shell suite 40/40 passed; full harness: 159 passed / 11 failed / 2 advisory / 24 skipped. Prior — **I-126 fixed: crosshair colours aligned with spec rev 1.97.** See §11.11. `MDL-Dashboard.html` rebuilt; shell suite 37/37 passed; full harness: 158 passed / 12 failed / 2 advisory / 24 skipped. The 12 failures included the old status-bar total check. Prior — **I-124 and I-125 fixed: matrix fit, table border, and shared crosshair.** See §11.10. `MDL-Dashboard.html` rebuilt; shell suite 33/33 passed; full harness: 158 passed / 12 failed / 2 advisory / 24 skipped. The 12 failures are the pre-existing shell, KPI, filter, status, and I-95 sample-check failures. Prior — **I-123 fixed: matrix panel full width and no inner scrollbars.** See §11.9. `MDL-Dashboard.html` rebuilt; shell suite 31/31 passed; Tier 2: 53 passed / 0 failed. Prior — **I-122 fixed: content body vertical scrolling.** See §11.8. Spec §3.1 requires a scrollable content area; §3.5 keeps notices outside the scrolling body. MDL source rebuilt; shell suite 23/23 passed; harness added 25 page-scroll checks, all passed. Three Tier 2 geometry checks failed during I-122 verification. U003 fixed them. Final shell suite: 28 passed / 0 failed. Tier 2: 53 passed / 0 failed. Prior — **Rev 1.96 shell increment implemented.** See §11.7. Owner approved the spec left nav, removal of Print / Save PDF, the XLSX Export control, and the MDL Breakdown hold. `src/render.mjs` rebuilt; `MDL-Dashboard.html` rebuilt; `test/test_shell.mjs` added and passes 20/20; pipeline and grid results unchanged; logs created in `MDL/log/`. Prior (2026-10-22) — **Shared spec generalised (v1.2 → v1.3): the MDL-specific content moved here.** `Dashboard-UI-Design-Spec.md` is now project-neutral; it gained §0 **Definitions**, §8 **Conformance & Testing** (two-layer check model, 14 required assertions, enforcement posture, conformance record, definition of done) and §9 **Adopting this spec**. Everything belonging to MDL alone now lives in **§11 Shared-Spec Conformance Record**: the two-row menu-bar instantiation (§11.2), the Search popover layout + hard Tier 4f posture (§11.3), MDL's dashboard-specific choices (§11.1), its migration state (§11.4) and its regression history (§11.5). Citations corrected: the B-family of selection controls lives in spec **§7.1**, not §7.10. Prior (2026-10-20) — I-115 **aligned**: the shared floating-panel ordering contract (master → note → divider → item list → footer; master scoped to the non-pinned set and tri-state) is now normative in `Dashboard-UI-Design-Spec.md` §7.1 (B. Selection controls) and recorded here as §4.0.1 item 7 + acceptance. **Citation correction:** references to "§7.10" in this document and in `issue_log.md` are dangling — no §7.10 exists; the B-family (B1/B3/B5/B6/B7) lives in §7.1. PPP was deliberately NOT updated. I-114 **implemented (RESOLVED)**: (a) the Overdue Type dropdown now reads its labels from the **`Code!AN:AO`** block (workbook source of truth, in-code list kept only as a fallback) and shows the canonical §4A.6 wording; (b) the **column chooser got its own class** (`.cc-wrap` / `.cc-btn` / `.cc-panel`) per shared spec §7.1 **B7** — no count badge, no active-filter emphasis — so the `.tf-btn` filter look now belongs exclusively to the global Discipline/Stage chips; (c) the Validation / Issues panel gained the **panel-local rule-code filter** (spec §7.1 **B6** + §7.2.7 pt 6) — a single-select inside the panel, resolved in **S5**, affecting only that panel's tables (`N of M issues`; severity chips, note and Rule Reference still describe the whole run; CSV exports the same filtered rows). `test_render.mjs` += 12 assertions; rebuilt `MDL-Dashboard.html`; full run **159/165** (the 6 failures are the pre-existing top-bar chip/Stage tests). Prior (2026-10-20) — Filter vocabulary + panel-local filters **logged (I-114)**: shared spec §7.10's selection-control table now separates **multi-select** (B1 filter trigger + B3 chips) from **single-select** (B5 native select), and adds **B6 panel-local filter** plus **B7 column-visibility control**; shared spec §7.2.7 gains point 6 (a panel-local filter resolves in S5 and MUST NOT touch KPIs, charts, the matrix or any other panel). Workplan §4A.6 records the Overdue Type flavours as workbook source of truth in **`Code!AN:AO`** (the in-code list stays only as a fallback), and §4.0.1 gains the chooser-chrome rule plus the Validation / Issues **rule-code filter** specification (control inside the panel, local to it, S5-only, tables only). No dashboard code changed yet. Prior (2026-10-19) — Overdue List filter de-duplication **implemented (I-113)**, then the three panel-owned per-column filters were also removed (user direction 2026-10-19): the Overdue panel now keeps only the **Overdue Type dropdown** as its sole in-panel filter — no bundled popover and no per-column buttons (Delay / Source Tab / Planned date all removed). On 2026-10-20 the in-panel column filters were also removed from the **Validation Issues** and **Document Detail** panels, and the entire filter machinery (`attachColFilters`, `cfColRow`, `applyFilters`, `facetCounts`, `highlightText`, `debounce`, `restoreFlt`) deleted (only `cfToggle`/`cfBindDoc` remain, reused by the column chooser). `test_render.mjs` updated and now passes 147/153 (the 6 failures are pre-existing top-bar Stage-chip tests). Prior (2026-10-19): Filter de-duplication requirement documented (MDL-specific): per shared spec §7.2.7 (no duplicate filter dimensions), the Overdue List panel's bundled 'Filters' popover is to be removed — its UESH Discipline duplicates the global Discipline chip and Overdue Type is duplicated by the panel's own dropdown; keep the Overdue Type dropdown + per-column Delay/Source Tab/Planned-date filters. Document Detail popover to drop UESH Discipline + Stage (global duplicates). Validation panel clean. Added workplan §4.0.1. Prior (2026-10-19): Overdue List blank "Overdue Type" / "Delay (days)" columns fixed (I-112): the I-111
> port onto the L3 grid kit dropped the header label `h` from the grid column objects, so `colVal`/`textQ` no longer
> matched the two label-special-cased columns and both rendered blank (the S4 Derive values were always correct;
> CSV export was unaffected). Fix: added `h: c.h` to the `overdueCols` map in `render.mjs` `renderOverdue`;
> rebuilt `MDL-Dashboard.html`. Prior (2026-10-19): Overdue List column-width adjustment added (I-111): `render.mjs` `renderOverdue`
> ported onto the L3 grid kit (`makeGrid`, I-95) — drag-to-resize grips on every header, double-click auto-fit,
> per-column widths persisted in `localStorage` (`mdl_overdue_widths`), plus the column show/hide chooser;
> sorting and the Overdue-Type / CSV / filter controls unchanged. Earlier (2026-10-19): Discipline Summary Matrix
> column sorting removed (I-110) — `renderMatrix` now renders static headers; TOTAL row pinned in `<tfoot>`;
> `MDL/test/test_render.mjs` matrix assertions updated; `MDL-Dashboard.html` rebuilt.
> Earlier (2026-10-18): top bar + menu bar model finalised (§4.0): two-row sticky header as one unit,
> left-actions / right-filter-group menu bar holding all six controls, global Discipline/Stage filters, Warnings
> toggle per shared spec §3.5; §4.7 location wording reconciled.

---

## 0. Contents

| § | Section |
|---|---------|
| 1 | Summary & Purpose |
| 2 | Guiding Principles |
| 3 | Excel Data Structure & Contract |
| 4 | Dashboard Modules |
| 5 | Validation Rules |
| 6 | Technical Architecture |
| 7 | Workplan (Waves) |
| 8 | Decisions Captured from Review |
| 9 | Open Questions / Assumptions |
| 10 | Future Enhancements |

---

## 1. Summary & Purpose

### 1.1 Overview
A **standalone, offline-first, browser-based interactive dashboard** for the *Master Document List* workbook (`MDL/TWRP C3B2 - Master Document List.xlsx`). It parses the workbook (`.xlsx` or `.csv`) entirely in the browser — no server, no framework, no external dependencies, no data leaves the machine.

### 1.2 Purpose
- **Primary**: Give document controllers / discipline leads a single-page view of document counts, issue & approval health, authority submissions, and schedule variance across all disciplines.
- **Secondary**: Enforce data quality by validating every document against the Code sheet's lookup lists and metadata rules, surfacing issues before they propagate.
- **Tertiary**: Be ready for disciplines to be added later — the discipline set is driven by the workbook, not hard-coded.

### 1.3 Key Decisions Captured (from reviewer, 2026-09-29)
1. **Discipline universe** = the **UESH Discipline list in Code sheet column H** (20 codes). Not every discipline has a document list yet; more can be added later.
2. **Only show available worksheets.** A worksheet is treated as a discipline document list **iff its tab name matches a UESH Discipline code in Code!H**. Others (present or future) are auto-included when their tab appears. NOTE: the **UE SH Discipline column (col C) inside a document list can contain disciplines other than the tab name** — so a document's authoritative discipline is read from **col C**, not from the tab.
3. **Document count** = rows where **Document No. (col M)** is non-blank **AND Stage (col B) is NOT in {Deleted, Void, Superseded}**.
4. No code is to be written before this workplan is approved.

---

## 2. Guiding Principles

| Principle | Implementation |
|-----------|----------------|
| **Offline-first** | All parsing (ZIP+XML), charting (inline SVG), validation run in-browser |
| **Zero dependencies** | No CDN, no npm, no frameworks — single HTML file |
| **Contract-driven** | Code sheet drives all parsing via **header/label discovery** — no hardcoded row/column ranges (see §3.1.1); mirrors the proven PPP dashboard |
| **Fail-soft** | Validation never blocks rendering; dashboard always shows, issues listed in a panel |
| **Extensible disciplines** | Discipline tabs auto-discovered from Code!H; missing ones shown as "no list yet" |
| **Authoritative discipline = col C** | Aggregations by discipline use the per-row UESH Discipline, not the tab name |
| **Layered (target)** | 5 layers — tokens → primitives → data → logic → view; dependency flows downward only |
| **Layout parity (PPP)** | Mirror the PPP dashboard single-page layout (welcome/file-load → KPIs → charts → validation → detail); left-nav panel deferred; PPP tokens reused |

---

## 3. Excel Data Structure & Contract

### 3.1 Code sheet = the contract source

The Code sheet is the single source of truth ("the contract"). It is organised as a set of
**tables**, not as a fixed grid of hardcoded rows/columns:

- **Metadata table** — columns A/B (label/value), with an optional Data Type in C (e.g.
  `Project Title`, `Project Start Date`, `Header Row`, `List End Row`, `Dashboard Title`).
  Read **by label**, never by a fixed row number.
- **Column map table** — `Field (A) | ColumnLetter (B) | DataType (C)`. Read by **scanning
  every row of the Code sheet and matching the `Field` label**, then resolving the
  `ColumnLetter` (e.g. `Column-Y`) to a column index. There is **no fixed 12–36 row range**;
  a field may live on any row.
- **Lookup-block tables** — each validation domain is a two-column block
  (`Code | Description`) whose **header sits in row 1**, with values starting at row 2. Blocks
  are **separated from one another by a blank column**. The parser locates each block **by its
  row-1 header text**, never by a fixed column letter (e.g. it finds "Approval Code" wherever it
  is — not because it was hard-coded to column `AF`).

This is the **same table-discovery contract already implemented and proven in the PPP dashboard**
(`Procurement-Dashboard.html`: `findLookupColumns()`, `parseCodeSheet()`, `readLookupCol()`).
MDL MUST follow it, so that inserting/reordering columns or moving a block never silently breaks
parsing, and a missing block is *warned*, not dropped.

#### 3.1.1 Standardized table-discovery rule (shared with PPP)

1. **Scan the whole Code sheet** — never assume a fixed range such as rows 1–11 or 12–36.
2. **Header in row 1** — every lookup block advertises its name in row 1. Discovery matches
   header text **case-insensitively**; an exact match wins, a prefix match is the fallback.
3. **Blank column = table separator** — blocks are discovered independently by header text, so
   intervening blank columns are naturally skipped (no need to count them).
4. **Label-driven column map** — the column map is built by matching each expected field's
   *label* (a code-owned vocabulary) to the `ColumnLetter` stored in the sheet; the field's
   *position* is always resolved at runtime.
5. **Dynamic value read** — a lookup block is read from row 2 downward until **3 consecutive
   blank rows** (a safety cap, e.g. +300 rows, is permitted). No fixed end row.
6. **Warn, don't drop** — if an expected block header is not found in row 1, raise a validation
   warning (PPP `V-18`) instead of silently returning an empty/incorrect set.
7. **Contract = vocabulary, not layout** — the only code-owned constants are the *expected
   label/header names*; the *positions* (which row, which column) are entirely workbook-owned.
8. **Identical function names across dashboards** — the table-reading helpers MUST use the **same
   names in MDL and PPP** so the contract is reflected in code, not just prose. Canonical set
   (proven in `PPP/Procurement-Dashboard.html`):

   | Canonical name | Purpose |
   |---|---|
   | `colLetter(i)` | 0-based column index → letter (e.g. `31 → "AF"`) |
   | `colRefToIndex(ref)` | `"Column-AE"` → 0-based index |
   | `parseCodeSheet(codeGrid)` | scan whole Code sheet → `meta{ label:{col,type} }` |
   | `buildFieldToCol(meta)` | field label → column index for the document list |
   | `parseFieldTypes(codeGrid)` | field → DataType map (from Code!C) |
   | `findLookupColumns(codeGrid)` | scan row-1 headers → column index per lookup block |
   | `readLookupCol(grid, c, start)` | read a column's values from `start` (stops at 3 blanks) |
   | `readLookupMap(grid, codeCol, descCol, start)` | code → description map for a block |

   MDL currently uses `readBlock` / `readErrorBlock`; these are **renamed** to `readLookupCol` /
   `readLookupMap` respectively. MDL's `lookups[key] = {items, codes}` shape is preserved by
   assembling it from the standardized primitives — the names are identical, only the assembly
   differs. `colToNum`/`numToCol` in `xlsx-reader.mjs` are exposed as `colLetter`/`colRefToIndex`
   to match. A missing expected block raises a `V-18`-style warning (PPP behaviour), never silent.

### 3.2 Document-list column map + lookup ranges (read dynamically from Code!A:C; reference layout 25 columns A–Y)

The **Lookup range (Code)** column gives the *exact* Code-sheet cell range of the dropdown list each field is validated against (computed from the real workbook). `—` = free text / numeric / date / boolean (no lookup). Full value lists are in §3.6.

| Col | Field | Type | Lookup range (Code sheet) |
|---|---|---|---|
| A | SNo. | Int | — |
| B | Stage | Text | `Code!E2:F20` (Stage) |
| C | **UESH Discipline** | Text | `Code!H2:I21` (UESH Discipline) |
| D | P6 Activity ID | Text | — |
| E | BQ Number | Text | — |
| F | System | Text | — |
| G | Project Code | Text | `Code!K2:L2` (WBS Contract Code) |
| H | Project Prefix | Text | `Code!N2:O7` (PROJECT PREFIX) |
| I | Doc Type | Text | `Code!Q2:R64` (Doc Code) |
| J | Discipline (Code) | Text | `Code!T2:U20` (Discipline Code) |
| K | Number | Text | — |
| L | Rev | Text | — |
| M | Document No. | Text | — |
| N | Document Title | Text | — |
| O | Notes | Text | — |
| P | As-Built | Boolean | — |
| Q | Authority | Text | `Code!Z2:AA7` (Authority) |
| R | Vendor Data | Boolean | — |
| S | Planned 1st Issue Date | Date | — |
| T | Forecast 1st Issue Date | Date | — |
| U | Actual 1st Issue Date | Date | — |
| V | Prolog Number | Text | — |
| W | Submission Status | Text | `Code!AC2:AD4` (Submission Status) |
| X | Latest Approval Date | Date | — |
| Y | Latest Approval Status | Text | `Code!AF2:AG5` (Approval Code) |

> **Notes on lookup ranges**
> - Ranges above are the *code/description blocks* on the Code sheet **as currently positioned**; they are a **reference**, not a parser constant. The parser locates each block **by its row-1 header text** (§3.1.1) and reads the **left (code) column** as the allowed value set and the **right (description) column** as its label — so moving/reordering a block never requires a code change.
> - `Code!AI2:AL` is the **Error Code block** — 4 columns: `Error Code` (AI), `Group` (AJ), `Rule` (AK, message text), `Severity` (AL). It is **now fully populated** by the owner with **all 28 §5 rules** (V-01…V-28); severity distribution is 7×Error, 18×Warning, 1×Info — all valid, **no normalization code required**.
> - `Code!W2:X11` (Series) exists on the Code sheet but is **not** a column in the 25-col document list, so it is not a validated field here. (`Code!K2:L2` WBS Contract Code **is** now used by **Project Code, col G**.)

> **Two distinct "discipline" concepts — do not confuse:**
> - **UESH Discipline** = col **C** (doc list) ↔ Code!**H** (20 codes: General, Project, Procurement, Contracting, Construction, HSE, TnC, OnM, QAQC, PC, DC, QS, BIM, Process, Mech, Piping, BS, CSA, ICA, Electrical). ← **this is the dashboard's discipline dimension**. Range `Code!H2:I21`.
> - **Discipline Code** = col **J** (doc list) ↔ Code!**T** (19 codes: A, B, C, D, E, G, HS, I, IM, K, M, PI, PR, PC, PM, Q, S, W, Z). ← a separate engineering-discipline lookup, validated independently. Range `Code!T2:U20`.

### 3.3 UESH Discipline universe (canonical set) — Code!H
`General, Project, Procurement, Contracting, Construction, HSE, TnC, OnM, QAQC, PC, DC, QS, BIM, Process, Mech, Piping, BS, CSA, ICA, Electrical` (20).

### 3.4 Discipline document-list worksheets (auto-discovered)
A tab is a **discipline document list** iff `tabName ∈ Code!H UESH Discipline list` **and** it carries the A–Y column layout.
- **Currently available (8):** `Project, QAQC, Process, Mech, BS, CSA, ICA, Electrical`.
- **Not yet available (12):** `General, Procurement, Contracting, Construction, HSE, TnC, OnM, PC, DC, QS, BIM, Piping` → shown as "— no list yet", ready to appear automatically when a tab is added.
- **Explicitly excluded (not document lists):** `BQ` (Bill of Quantities — layout BQ No./BQ Item/Description) and `Notes` (empty). `Dashboard` (empty) left untouched by the standalone HTML.

### 3.5 Per-row discipline vs tab name (Reviewer point 2)
Each document's **authoritative discipline = col C (UESH Discipline)**, which may differ from its container tab (e.g. a row in the `Project` tab may carry `UESH Discipline = Electrical`). Therefore:
- The **"Documents by Discipline"** aggregation reads **col C**.
- The **source worksheet** is tracked separately for traceability and offered as a secondary breakdown.

### 3.6 Lookup lists (validation domains) — Code sheet blocks

| Domain | Block (cols) | Values (sample) |
|---|---|---|
| Stage | E2:F20 | Deleted, Hold, Void, Superseded, Combined, Internal, M1–M3, NA, Permitting, Stage 1–7, ASB (19) |
| WBS Contract Code | K2:L2 | 131236 (Industrial LM2) |
| UESH Discipline | H2:I21 | 20 codes (see §3.3) |
| PROJECT PREFIX | N2:O7 | WIL21, WIL22, WIL23, WSW46 (+ facility descriptions) |
| Doc Code | Q2:R64 | AD, AF, AG, AU, BQ, CB, … MI (30+) |
| Discipline Code | T2:U20 | A, B, C, D, E, G, HS, I, IM, K, M, PI, PR, PC, PM, Q, S, W, Z |
| Series | W2:X11 | 0000-0999 … 9000-9999 |
| Authority | Z2:AA7 | BCA, FSSD, NEA, NPK, LTA, URA |
| Submission Status | AC2:AD4 | SUR, RTR, NTS (+ descriptions) |
| Approval Code / Status | AF2:AG5 | REJ, NAP, APP, AWC / Rejected, Not Approved, Approved w/o Comments, Approved with Comments |
| Error Code / Group / Rule / Severity | AI2:AL | **rule-wording + severity source** — 4 cols: Error Code (AI), Group (AJ), Rule (AK), Severity (AL). All 28 §5 rules (V-01…V-28) now present; severities valid (7×Error, 18×Warning, 1×Info) |

> **Contract-driven — NO hard-coded values (reviewer directive):** every allowed-value set above (stages, disciplines, authorities, doc types, approval codes, prolog statuses, BQ/WBS/prefix codes) is **read at runtime** from its Code-sheet row-1 header (§3.1.1) into `model.lookups` and consumed by validation, charts and filters. The HTML **hard-codes none** of these lists — adding/removing a value in the Code sheet (e.g. inserting `VOID` into the Approval Code block) takes effect with **no code change**. The Error Code block (Code!AI:AL) supplies every rule's **message (AK) and severity (AL)**; a rule with no matching row falls back to a generic message + **Warning** (mirrors PPP V-21) — note this fallback would downgrade an intended *Error* severity, so all §5 rules should have a row here.

### 3.7 Document-count rule (Reviewer point 3)
```
isActiveDoc(row) = ( row.M != blank )  AND  ( row.B(Stage) NOT IN {Deleted, Void, Superseded} )
```
Rows without a Document No. are already removed at the §3.8 valid-record gate, so every row reaching this rule already has M populated; `isActiveDoc` then only gates on the Stage exclusion. Non-active rows are still listed in the detail table but flagged/excluded from counts.

> The exclusion set `{Deleted, Void, Superseded}` is the only business constant that names Code-sheet values. To make it fully contract-driven, the owner is recommended to add a **Lifecycle/Exclude flag column** to the Stage block (Code!E:F) that the dashboard reads; until present, the documented constant is used.

### 3.8 Consolidated document table — built first, single source of truth (reviewer requirement)
All discipline document lists share the **identical A–Y header layout** (§3.2), so the dashboard must **first read every discovered discipline tab and union them into ONE consolidated document table** before any aggregation. This table — not the individual tabs — is the single model that every summary, chart, filter and validation reads from.

- **Mandatory build order:**
  1. Read Code contract (§3.2 column map + §3.6 lookups).
  2. Auto-discover discipline tabs (§3.4).
  3. For each tab: **row 1 = header** (validated/aligned against the §3.2 `Field | Column` map; warn if a column header mismatches). **Rows 2+ = candidate data rows.**
  4. **Valid-record gate — keep a row only if its `Document No.` (col M) is present and valid.** Blank rows and any row without a Document No. are **removed** from the consolidated table (this also drops calc/header-marker rows that carry no Document No.).
  5. **Append the surviving rows to one array**, tagging each with `sourceTab` and the authoritative `discipline` (col C, §3.5).
- **Valid-record vs inactive (two tiers):**
  - *Removed entirely*: rows with blank / missing `Document No.` (col M). These never enter the consolidated table.
  - *Kept but `isActive = false`*: rows that have a Document No. but whose `Stage` (col B) ∈ {Deleted, Void, Superseded} — retained for traceability but excluded from all counts (§3.7).
- **Consolidated record shape:** `{ sourceTab, rownum, fields{A..Y}, discipline(colC), stage(colB), isActive(§3.7), issued(U), approval(Y) }`.
- The 12 "no list yet" disciplines (§3.4) contribute **zero rows** and are **not** drawn as ghost/zero bars. Instead, a user-facing **info message** is rendered beneath the discipline-related charts (e.g. "Documents by Discipline") listing which UESH disciplines have no document list yet — so structure is communicated without empty bars.

### 3.9 Business-logic & referential-integrity layer (runs on the consolidated table)
After §3.8 produces the single consolidated table, a second layer of **cross-field / state-machine / referential** checks runs in the Logic layer (layer 04), catching the real document-control risks that single-field domain checks miss. Inputs:
- the **current system date** as the future-date baseline (reviewer Q6);
- the **`BQ` sheet** (read once) to validate `BQ Number` (col E) references (reviewer Q7).
Rules V-17…V-27 are defined in §5; the dashboard also adds a **data-completeness %** KPI and two data-quality charts (§4.1 / §4.2).

---

## 4. Dashboard Modules

### 4.0 Top bar + menu bar (sticky app bar)
The dashboard header is a single **sticky** bar at the top of the page, laid out as **two rows that scroll-stick together as one unit** (`position:sticky; top:0; z-index:31`, above the fixed `#errBanner` at `z-index:30`). It is built in `renderDashboard` and never scrolls away.

- **Row 1 — title bar.** Left cluster: the UESH logo + the **title block** (below). No action buttons here.
- **Row 2 — menu bar.** Two clusters, **separated per cluster** (decision 2026-10-18):
  - **Left cluster (actions):** the **Load Workbook** button (the **single Primary CTA**, shared spec §A1) and the **Print / Save PDF** button (secondary — triggers browser print, landscape B&W, zero-dependency, §4.6).
  - **Right cluster (filter group, right-aligned as one group):** the **Discipline** filter chip, the **Stage** filter chip, the **Search** box (§4.7), then the **Warnings** toggle button (shared spec §3.5 — opens/closes the `#errBanner` warning bar; label `Warnings` / `Show warnings`, badge carries the count, button hidden when the count is 0).

**Title block (3 lines, left cluster of row 1)** — all values read from the Code-sheet metadata *by label* (§3.1), so they are workbook-driven, not hard-coded:
1. **Project title** — `Project Title` metadata (falls back to the workbook file name when blank).
2. **Dashboard title** — `Dashboard Title` metadata (renders "Dashboard" when blank).
3. **Project start + as-of date** — `Project Start Date` metadata (ISO `YYYY-MM-DD`, or `—` when unset) followed by `· as of <today>`, where `<today>` is the derived run date.

> **Scope of the filters (decision 2026-10-18):** the Discipline and Stage chips are **global** — one
> selection re-derives the single filtered `active` set once in `deriveView`, and **every** panel reflects it
> identically: KPI bar, Discipline Summary Matrix (per-stage expansion), all charts, Overdue, Validation and
> Document Detail. Each chip states its scope (tooltip / subtitle "Applies to all panels") so it is
> unambiguous against any table-scope filter (I-94). No per-panel filter code.
>
> **Design note (2026-10-18 reconciliation):** the previous MDL variant placed Load/Print on row 1 and the
> filter chips + search on row 2 as two separate clusters; the implementation further split them (filters in
> row 1, search + Warnings in row 2). The 2026-10-18 decision **consolidates all six controls into the
> single row-2 menu bar** with a clean left-actions / right-filter-group split, and makes the two rows one
> sticky unit. This is the documented MDL variant, intentionally deviating from UI spec §3.1's single-bar
> illustration (spec §3.1 sanctions the two-row form). Decisions: #1/#10 left-nav deferred; #4/#5/#6 title
> bar + menu bar follow this MDL design (spec §3.1 + §3.2 updated to match; detail in Dashboard-UI-Design-Spec.md §3.1 / §7.1).

#### 4.0.1 Filter de-duplication — MDL-specific (overall rule in shared spec §7.2.7)

Per the shared `Dashboard-UI-Design-Spec.md` §7.2.7 (overall requirement, applies to every dashboard),
**a filter dimension may exist in exactly one place**. The global dimensions — **Discipline**, **Stage** and
**Search** — live only in the top-bar menu (§4.0); a panel must never re-offer a global dimension, and
must never offer the same dimension twice. The MDL build currently violates this in two spots:

- **Overdue List panel.** Its bundled **"Filters" popover** (the multi-filters button) used to expose five
  column filters — *UESH Discipline*, *Overdue Type*, *Delay (days)*, *Source Tab*, *Planned 1st Issue
  Date* — where *UESH Discipline* duplicated the global Discipline chip and *Overdue Type* was offered
  twice. Both the bundled popover and the three panel-owned per-column filters
  (*Delay (days)*, *Source Tab*, *Planned 1st Issue Date*) were removed (2026-10-19); the panel now keeps
  only the **Overdue Type dropdown** as its sole in-panel filter.
- **Document Detail table.** Its "Filters" popover includes **UESH Discipline** and **Stage**, both of
  which duplicate the global Discipline / Stage chips.
- **Validation / Issues panel.** Clean — its popover (Severity, Rule, Doc No, Source Tab, Row) offers no
  global dimension, so no change is required there.

**Required MDL changes (specific):**

1. **Overdue List panel** — remove the bundled "Filters" popover (the multi-filters button) **and** the
   three panel-owned per-column filters (*Delay (days)*, *Source Tab*, *Planned 1st Issue Date*), per the
   2026-10-19 user direction. Keep only the dedicated **Overdue Type dropdown** as the sole in-panel
   filter. Do **not** re-add UESH Discipline (global) or a second Overdue Type, and do **not** add
   per-column filters back.
2. **Document Detail table** — remove **UESH Discipline** and **Stage** from its column-filter popover
   (they are global). Retain its panel-owned filters (Document No., Latest Approval Status, Submission
   Status, Authority, Active, Source Tab, and *Discipline (Code)* only if it is a distinct column).
3. **Validation / Issues panel** — no change to its global dimensions, but it now GAINS one panel-owned
   filter: the **rule-code filter** (see item 6).
4. **Top bar unchanged** — Discipline, Stage, Search remain the sole global scope controls; switching any
   of them still re-derives every panel identically (§4.0 scope rule preserved).
5. **Filter chrome must not be shared with a layout control** (added 2026-10-20, I-114). The flag-chip
   look — a labelled trigger that opens a floating tick-box menu and carries an active count — means
   "**this narrows your rows**". The **column show/hide chooser** (`Columns (n) ▾`) uses exactly that
   look today even though it is a *layout* control: it changes which columns are painted and never
   which rows are returned. The chooser MUST be given its own class (shared spec §7.1 **B7**) so it
   cannot be mistaken for a filter, and it MUST NOT inherit the filter trigger's active/open emphasis.
   Conversely the Overdue Type control is a single-select filter and correctly uses §7.1 **B5**.
6. **Issue rule-code filter — panel-local only** (added 2026-10-20, I-114). The Validation / Issues panel
   shall offer a **single-select Rule** drop-down listing every rule code that actually fired, with its
   occurrence count and short rule text. Decisions:
   - the control lives **inside the Validation / Issues panel** (not the top bar);
   - it is **local to that panel** and affects **only the tables inside that panel**;
   - it MUST be applied in **S5 Render** to the rows already handed to the panel — never through a
     state field that S4 Derive consults, which would silently convert a panel filter into a
     cross-panel one (shared spec §7.2.7 pt 6);
   - the severity summary chips, the explanatory note and the rule reference table keep describing the
     **whole run**; only the issue table and its count reflect the selection, using `N of M issues`;
   - the CSV export reads the same filtered array the table paints.
   Rule code is neither a global dimension nor severity, so it breaks no duplicate-dimension rule.
7. **Floating-panel internal ordering** (added 2026-10-20, I-115). Every floating multi-select panel —
   the **B1** filter popover and the **B7** column-visibility chooser — lays its contents out in the same
   order: **master `All <dimension>` → note → divider → item list → footer**. The note sits directly under the
   master, never after the item list, because both panels are `overflow:auto` with a `max-height` (320 px /
   380 px) and a trailing note is unreachable until the list is scrolled to the end. The master ranges over the
   **selectable** set only and is **tri-state**: in the chooser the pinned identity columns are permanently
   checked and disabled, so the master is scoped to the non-pinned columns — checked when all are shown,
   indeterminate when some are hidden, unchecked when none are. `Reset to defaults` stays in the footer: it is
   an action, not a note. Class namespaces stay separate (`.tf-*` vs `.cc-*`) per shared spec §7.1 **B7**.
   Recorded normatively in the shared spec §7.1 (B. Selection controls).

**Acceptance:** after the change, no panel offers Discipline or Stage; Overdue Type exists only in the
dropdown; the Overdue panel has no per-column filter buttons; no layout control (the chooser) wears the
filter chrome; the rule-code filter narrows only the Validation / Issues tables and leaves KPIs, charts
and every other panel untouched; every floating multi-select panel leads with an `All <dimension>` master
and places its note directly beneath that master; and the global filter remains the only cross-panel
scope control.

### 4.1 KPI overview + per-discipline summary (counts use §3.7)

**Metric definitions (status funnel)** — every count derives from the §3.8 consolidated table and applies `isActiveDoc` unless noted (reviewer 5d):
- **Total Planned** = active documents (the planned document register; denominator of the funnel).
- **Submitted** = active documents whose `Actual 1st Issue Date` (col U) is **not blank** (a document is submitted once it is first issued). *[Confirmed per reviewer Q4.]*
- **Approved (APP)** = active documents with `Latest Approval Status` (col Y) = `APP`.
- **Approved with Comments (AWC)** = Y = `AWC` (tracked **separately** from Approved, per reviewer 5d).
- **Rejected (REJ)** = Y = `REJ`.
- **Not Approved (NAP)** = Y = `NAP`.
- **Overdue** is shown as **three separate KPI cards** (no combined total card — review 2026-09-30, §12 I-01): **① Overdue – 1st Submission**, **② Overdue – Resubmission**, **③ Overdue – Client Review**. ① due date = `Forecast` (T), falling back to `Planned` (S) when T is blank (§12 I-04); overdue when due ≤ today and `Actual` (U) blank. ② = active, U present, `Latest Approval Status` (Y) ∈ {REJ,RTR}, `Latest Approval Date` (X) present, working days (X→today) > 14. ③ = active, `Submission Status` (W)=`SUR`, U present, working days (U→today) > 20. (Mirrors Panel 13's three overdue lists; Panel 7 also splits its Overdue bucket, §12 I-05.)

> **Approval vs Submission are separate dimensions** (reviewer 5c): Approval Status (col Y, Code!AF) and Submission Status (col W, Code!AC — renamed from "Prolog Submission Status") are tracked independently; there is **no unified single "Current Status" column** at this stage.
>
> **Business rules — the two dimensions must stay independent in the engine, not only on paper (I-120).** The statement above is a *business rule*; the current code violates it:
> 1. **Submission Status governs Under Review.** A document with `Submission Status` (W) = `SUR` is **Under Review regardless of `Latest Approval Status` (Y)** — a present approval status must not override `SUR`. An approved document that is later resubmitted for review is therefore counted in **both** Under Review and Approved.
> 2. **Approval Status governs approval, independently.** `Latest Approval Status` (Y) = `APP`/`AWC`/`REJ`/`NAP` is counted **as-is, regardless of `Submission Status`**; the approval KPIs never read column W, and `SUR` never converts an approval code.
> Today `approvalCategory` (`src/pipeline.mjs:73-93`) collapses the two dimensions into one category and lets Y win, so a `SUR` row whose Y is present is reported as the approval code (not "Submitted – Pending Review"). This is the root cause of the MDL↔sub Under Review discrepancy (MDL `pendingReview` = 38 vs sub Under Review = 53 on the TWRP C3B2 data). The classifier must stop unifying them, or an Under Review flag must be derived from W alone.

**KPI card details** (active scope = `Document No.` present AND `Stage` ∉ {Deleted, Void, Superseded}; "today" = system current date; working days = Mon–Fri, no holidays — decision 18):

| KPI Card | Type | Definition | Data source (field · col) | Processing | Notes |
|---|---|---|---|---|---|
| Total Planned | Primary | All active documents (funnel denominator) | `Document No.` (M) + `Stage` (B) | Count active records | — |
| Submitted | Primary | Docs first-issued | `Actual 1st Issue Date` (U) | Count active where U non-blank | — |
| Approved (APP) | Primary | Approved docs | `Latest Approval Status` (Y) | Count active where Y = `APP` | validated vs Code!AF (V-08) |
| Approved w/ Comments (AWC) | Primary | Approved-with-comments docs | `Latest Approval Status` (Y) | Count active where Y = `AWC` | tracked separately from APP |
| Rejected (REJ) | Primary | Rejected docs | `Latest Approval Status` (Y) | Count active where Y = `REJ` | — |
| Not Approved (NAP) | Primary | Not-approved docs | `Latest Approval Status` (Y) | Count active where Y = `NAP` | — |
| Overdue – 1st Submission | Primary | Late first issue | `Forecast` (T)→`Planned` (S), `Actual` (U) | active, due=T‖S present, U blank, due ≤ today | T‖S fallback (§12 I-04) |
| Overdue – Resubmission | Primary | Late resubmission after REJ/RTR | `Latest Approval Status` (Y), `Latest Approval Date` (X), `Actual` (U) | active, U present, Y∈{REJ,RTR}, X present, WD(X→today) > 14 | — |
| Overdue – Client Review | Primary | Late client-review return | `Submission Status` (W), `Actual` (U) | active, W=`SUR`, U present, WD(U→today) > 20 | — |
| As-Built Required | Secondary | Docs requiring as-built submission | `As-Built` (P) | Count active where P = `YES` | P = requirement flag only; U **not** the submission signal (§12 I-02) |
| Vendor Data (by vendor) | Secondary | Docs to be produced by vendor | `Vendor Data` (R) | Count active where R = `YES` | R = by-vendor flag only; U **not** used (§12 I-03) |
| Data Completeness % | Secondary | Data-quality health of active rows | Issues V-17…V-27 | 100 × (active rows with no issue in V-17…V-27) ÷ active count, 1 dp | — |
| Active Disciplines | Secondary | Discipline spread | `UESH Discipline` (C) | Count distinct non-blank C among active | max = 20 (Code!H) |

**Primary KPI cards (9):** Total Planned · Submitted · APP · AWC · REJ · NAP · Overdue–1st · Overdue–Resubmission · Overdue–Client Review.
**Secondary tiles (4):** As-Built Required · Vendor Data (by vendor) · Data Completeness % · Active Disciplines.

**Discipline summary matrix (primary view)** — one row per selected discipline (§3.3/§3.4), columns:
`Discipline | Planned | Submitted | Approved | AWC | REJ | (NAP)`.
Each cell is the §3.7-active count. A **per-stage expansion** breaks every numeric cell down by `Stage` (col B):
- Active stages = every Stage value **present in the data** that is **not** in the §3.7 exclusion set. The stage universe itself is read from Code!E (no hard-coding); only the three lifecycle-excluded statuses are flagged (see §3.7).
- `Deleted / Void / Superseded` are reported as a separate **"Excluded"** line and never mixed into active counts (§3.7).

### 4.2 Charts (inline SVG, reusing PPP renderers)
> All chart categories (disciplines, stages, authorities, approval outcomes, doc types, etc.) are derived from `model.lookups` (read from the Code sheet at runtime) — **none are hard-coded**. Every chart offers a **bar ⇄ pie toggle** (persisted in `localStorage`, mirroring PPP) and a **Copy/Download-to-PNG** button (SVG → canvas @2×) — reviewer 5e.
1. **Documents by Discipline** (horizontal bar, by col C — only disciplines present in the consolidated table). A user message beneath the chart lists the UESH disciplines that have no document list yet (per §3.4).
2. **Issue progress**: Planned / Forecast / Actual 1st-issue-date presence (issued vs outstanding), optionally time-bucketed.
3. **Approval status distribution** (pie: APP / AWC / REJ / NAP / Not-available(VOID or blank); `CHART.pie.topN` cap with `Other` + tooltip).
4. **As-Built status** (YES / NO).
5. **By Authority** (BCA/FSSD/NEA/NPK/LTA/URA).
6. **By Doc Type / Stage** distribution.
7. **Schedule variance / Look-Ahead**: rows where `Forecast ≤ today` but `Actual` still blank → "overdue / at-risk" list.
8. **Data quality — issues by discipline** (bar: validation-issue count per UESH discipline, col C).
9. **Data quality — issues by rule** (bar/pie: distribution across V-01…V-28; rare rules capped under `CHART.pie.topN` into `Other`).

### 4.3 Filter panel — multi-select disciplines & stages (drives all views)
- **Discipline multi-select** (UESH Discipline, col C — the **sole** authoritative dimension per §3.5 / reviewer Q2, read from the consolidated table): pick one or many; only disciplines present in the data are listed.
- **Stage multi-select** (col B): pick one or many active stages; an "include Excluded (Deleted/Void/Superseded)" toggle controls whether the §3.7-excluded rows are shown in the matrix.
- Additional filters: Authority, Approval Status, date range (issue/approval dates). *(Source worksheet is tracked for traceability only — shown in the detail table — and is not a filter dimension, per Q2.)*
- **Global search** (reviewer 5h): a single search box filters the consolidated table by **Document No. / Title / Discipline** (substring); applies to the detail table and charts.
- Every selection re-renders — from the §3.8 consolidated table — the KPI bar, the discipline matrix (with per-stage expansion), all charts, and the detail table.

### 4.4 Validation engine + Error table
- Validate each row against the §3.6 lookup domains (**all read from the Code sheet — no hard-coded value lists**). Each rule emits an **Error Code**; its **message text (AK) and severity (AL)** are rendered from the **Code!AI:AL** block (columns: Error Code AI, Group AJ, Rule AK, Severity AL) — **now populated by the owner** — so **no error wording or severity is hard-coded** in the HTML. A rule whose Error Code has no row in the block falls back to a generic message + Warning (mirrors PPP V-21).
- **Error-block coverage (verified):** all 28 §5 rules (V-01…V-28) now have a row in Code!AI:AL — **no fallback downgrade** occurs. Severity distribution: 7×Error, 18×Warning, 1×Info (V-27 confirmed `Warning` in the workbook, 2026-09-29).
- Panel: deduplicated **Rule reference** list + per-issue tooltip; respects `isActiveDoc` (inactive rows still reported but tagged).

### 4.5 Document detail table
- Sortable table showing the §3.2 contract columns (A–Y) in order; respects filters; shows source tab, col C discipline, active/inactive flag. Per UI-spec alignment (reviewer 2): the register's **"Review Code" column = Approval Status (col Y)**; **Originator / Reviewer are excluded** (no such columns exist in the contract). Global search (§4.3) applies here.

### 4.6 Export
- Charts → PNG via **Copy/Download** button (SVG→canvas @2×), with the **bar ⇄ pie toggle** (§4.2) — reviewer 5e.
- Validation issues + document extract → **CSV**.
- **PDF export** via browser print (landscape, black-and-white) using the print stylesheet — no library, zero-dependency (reviewer 3). Excel export is **dropped** to honour the zero-dependency principle.

### 4.7 Search control (standardized)
- **Scope — one column at a time.** The user selects exactly one column from a dropdown listing every mapped field (`model.contract.fieldOrder`, the §3.2 columns A–Y). The query matches a **single substring within that one column only** (case-insensitive). Multi-column search is intentionally not offered: matching across columns returns confusing, cross-column false hits (e.g. a token present in both *Document No.* and *Number*). Default column = **`Document No.`** (the most precise identifier).
- **Discovery-driven (not hardcoded).** The dropdown is populated at runtime from `model.contract.fieldOrder` — the fields the workbook's Code-sheet column map actually defines (§3.1.1). It is never a literal list embedded in code; only the *vocabulary* of possible field names (`MDL_FIELD_KEYS` in `pipeline.mjs`) is code-owned. Reordering / inserting columns, or adding a newly mapped field, therefore updates the dropdown automatically with no code change.
- **Match semantics.** The typed term is matched as one whole substring — the control does **not** tokenize / split the query — so results stay unambiguous. (An exact/contains toggle is out of scope for v1.)
- **Commit model — Enter only.** The filtered view is re-derived **only** when the user presses `Enter` (or clicks the search button). Typing alone does **not** re-render — this avoids mid-word partial results and input-focus churn. `Esc` / a `×` clear affordance empties the box and re-commits on Enter.
- **Location — the menu bar (row 2), right-aligned as one group with the Discipline / Stage filter chips (see §4.0).** The search box lives in the **menu bar (row 2)** alongside the filter chips and the Warnings toggle, right-aligned as one group; the Load workbook / Print buttons are the left cluster of that same menu bar. The search box is compact (not full-width) and **not** inside a scrolling panel.
- **No Reset-filters button.** Each filter list keeps its own All/Clear (§7.5); the search clears by emptying the box + Enter. The standalone Reset button is removed.
- **Design tokens — reuse existing `:root` tokens, introduce no new colours.** The control sits in the second row below the buttons, right-aligned, at a compact fixed width (not full-width) and is shortened:

| Part | Token usage |
|---|---|
| Control shell | `display:flex; flex:1 1 auto; gap:0; padding:0; background:var(--surface); border:1px solid var(--border); border-radius:6px; min-height:28px;` (fills the row, reduced height, flush edges) |
| Column `<select>` (prefix) | `border:0; border-right:1px solid var(--border); background:var(--bg); color:var(--navy); font-weight:600; border-radius:6px 0 0 6px; height:26px; padding:0 8px;` |
| Text `<input>` | `border:0; background:transparent; color:var(--text); font:inherit; font-size:12px; flex:1 1 220px; min-width:0; height:26px; outline:none;` + `::placeholder{color:var(--muted);}` |
| Search `<button>` (magnifier) | `background:var(--accent); color:#fff; border-radius:0 6px 6px 0; min-height:28px;` (hover `filter:brightness(.97)`, per `.btn:hover`) |
| Clear `×` | `color:var(--muted);` (shown when text present) |
| Focus `:focus-within` | `border-color:var(--accent); box-shadow:0 0 0 2px var(--soft);` (mirrors `:focus-visible{outline:2px solid var(--blue)}` + `.tf-btn[aria-expanded]` active state) |
| Typography | `font:var(--font); font-size:12px;` (matches `.btn` / `.tf-btn`) |
| Spacing | `gap:0; padding:0;` (prefix / input / button sit flush, filling the shell) |

- **Accessibility.** The input carries an associated `<label>` (visually hidden if needed) and `aria-label`; the column `<select>` is keyboard-operable; `Enter` commits, `Esc`/`×` clears; the visible focus ring above is always shown and the control participates in the global `:focus-visible` rule.
- **Consumed everywhere.** The search is merely another entry in the single filtered `active` set computed once in `deriveView`, so every panel (KPI, Matrix, Charts, Issue Progress, Overdue, Validation, Detail) reflects it identically — no per-panel search code.

---


## 4A. Document Schedule, Review & SLA Control

The dashboard shall include an action-oriented **Document Schedule, Review & SLA Control** layer in addition to management KPIs and charts. Its purpose is to identify documents requiring action today and to monitor submission, resubmission, client review and approval turnaround against configurable working-day rules.

> **STATUS — 2026-09-29 review (deferral):** The full Schedule & Review Engine is **deferred**. Per reviewer direction (5c/5d): (a) **Approval Status** (col Y, Code!AF) and **Submission Status** (col W, Code!AC — renamed from "Prolog Submission Status") are tracked as *separate* dimensions; (b) the unified per-row **"Current Status"** pipeline is **NOT implemented** at this stage; (c) SLA-derived statuses (Due Soon / Due Today / Overdue / Resubmit) are **deferred to chart-generation discussion**; (d) **Validation Error** continues to reflect the Error Code block (§4.4). The only in-scope schedule metric now is **Overdue**, computed in three flavours (§4.1 / §4A.12): *1st-submission overdue*, *subsequent-submission overdue*, *client-review-return overdue*. The working-day calendar and review durations are still read from Code!A9:C11 (§4A.2) for that calculation.

### 4A.1 Control Objectives

The dashboard shall distinguish at least these operational clocks:

1. **Submission clock** — whether an active document has been submitted by its planned/forecast date.
2. **Resubmission clock** — whether a document requiring resubmission has been resubmitted within the required timeframe.
3. **Client review clock** — whether the client response is within the configured review allowance.
4. **Approval/response clock** — whether the expected review outcome has been received.
5. **Working-day aging clock** — number of working days remaining or overdue.

These clocks must not be collapsed into a single generic overdue count.

### 4A.2 Configurable Review Rules

Review durations shall be configuration-driven and shall not be hard-coded in the dashboard JavaScript.

Initial project rule:

| Review Cycle | Review Type | Allowed Duration | Unit |
|---|---|---:|---|
| 1 | First Client Review | 20 | Working Days |
| 2 | Subsequent Client Review | 14 | Working Days |
| 3 | Subsequent Client Review | 14 | Working Days |
| 4+ | Subsequent Client Review | 14 | Working Days |

**Workbook source of truth (no hard-coding):** these durations now live in the Code sheet at **`Code!A9:C11`** — `A` = review-type name, `B` = allowed working-day duration (Int), `C` = unit type: row 9 `First Client Review` = 20 WD (cycle 1), row 10 `Subsequent Client Review` = 14 WD (cycle 2+), row 11 `Resubmission Duration` = 14 WD (time allowed to resubmit after a REJ/RTR outcome; drives §4A.8). The dashboard parser reads this block at runtime; an embedded JSON default is only a fallback if the block is absent. Project-specific SLA changes are made in the workbook, never in source code.

```json
{
  "review_rules": {
    "first_client_review_working_days": 20,
    "subsequent_client_review_working_days": 14,
    "resubmission_duration_working_days": 14
  }
}
```

### 4A.3 Project Working Calendar

Working-day calculations require an explicit project calendar.

The configuration shall support:

- normal working days;
- weekends/non-working days;
- project-specific holidays;
- project shutdown/non-working periods, if applicable.

Example:

```json
{
  "working_calendar": {
    "working_days": ["MON", "TUE", "WED", "THU", "FRI"],
    "holidays": []
  }
}
```

The dashboard shall never assume that a calendar-day difference is equivalent to a working-day review duration.

### 4A.4 Review Clock Calculation

For a document entering client review:

```text
Actual 1st Issue / Submission Date
        ↓
Review Cycle
        ↓
Allowed Working Days
        ↓
Expected Client Response Date
        ↓
Today
        ↓
Within SLA / Due Soon / Due Today / Overdue
```

For review cycle 1, use 20 working days.

For subsequent review cycles, use 14 working days.

The calculation shall use the project working calendar and exclude configured non-working dates.

### 4A.5 Required Derived Schedule Fields

The consolidated/derived document model should support, where applicable:

| Field | Purpose |
|---|---|
| `reviewCycle` | Current client review/resubmission cycle |
| `reviewStartDate` | Date from which the current review clock starts |
| `reviewAllowedWorkingDays` | SLA duration for the current cycle |
| `reviewDueDate` | Calculated expected client response date |
| `reviewWorkingDaysElapsed` | Working days elapsed |
| `reviewWorkingDaysRemaining` | Working days remaining; negative when overdue |
| `reviewSlaStatus` | Within SLA / Due Soon / Due Today / Overdue / Completed |
| `submissionStatus` | Planned / Due Soon / Overdue / Submitted |
| `resubmissionRequired` | Whether the current result requires resubmission |
| `resubmissionStatus` | Not Required / Required / Submitted / Overdue |
| `daysVarianceWorking` | Working-day variance against the relevant planned/forecast date |
| `actionRequired` | Primary operational action |

Where the source workbook does not contain enough information to derive a field reliably, the dashboard shall show the field as unavailable rather than infer business events.

### 4A.6 Action-Oriented Dashboard Panels

Add a prominent **Documents Requiring Action** panel near the top of the dashboard.

Minimum action categories:

- Overdue — Submission
- Overdue — Resubmission
- Overdue — Client Review
- Due Soon — Submission
- Due Soon — Resubmission
- Due Soon — Client Review
- Awaiting Client Response
- Awaiting Internal Action

Recommended detail columns:

| Priority | Document | Discipline | Current Status | Due Date | Working Days | Action |
|---|---|---|---|---|---:|---|

The panel shall be filterable and shall link to the relevant document detail record.

**Overdue Type filter (recorded 2026-10-20, I-114).** The three in-scope Overdue categories above
reach the user as one **Overdue Type** drop-down in the Overdue List panel head — a **single-select**
control using the shared spec §7.1 **B5** chrome. It narrows that panel's table only; it does not
re-derive KPIs, charts or the matrix.

**Workbook source of truth (no hard-coding).** The three flavours' codes and their display labels
live in the Code sheet, following the same row-1-header + adjacent code/label column convention as
every other lookup block (`Stage Code` / `Description`, `Error Code` / `Rule`, …):

| Range | Header | Purpose |
|---|---|---|
| `Code!AN` | `Overdue Type Code` | the three structural codes — `first`, `sub`, `cli` |
| `Code!AO` | `Overdue Type` | the user-facing label for each code |

| Overdue Type Code | Overdue Type |
|---|---|
| `first` | Overdue — Submission |
| `sub` | Overdue — Resubmission |
| `cli` | Overdue — Client Review |

The parser reads this block at runtime; a hard-coded list is retained **only** as a fallback for
workbooks that predate the block — exactly as §4A.2 already does for the review durations
(`Code!A9:C11`). An absent block raises the standard "lookup block not found" notice, the same
behaviour as any other missing lookup block.

**Naming — canonical.** The labels above are now canonical and replace the earlier variants
(`1st-submission` / `Resubmission` / `Client-review` in the UI; *1st-submission /
subsequent-submission / client-review-return overdue* in the earlier status note; *Overdue – 1st /
Resub / Client* in the KPI cards and chart legend). Aligning those stragglers is a follow-up.

**Scope note.** Only the **labels and their order** are data-driven. The three **codes** remain
fixed in application code because they are structural: they select the delay formula (§4A.4),
the month-matrix colour bands, and the KPI / chart rows. Adding a fourth Overdue flavour is a code
change, not a workbook edit.

### 4A.7 Upcoming Submission Control

Provide an **Upcoming Submissions** view with configurable horizons:

- Next 7 working days
- Next 14 working days
- Next 30 working days

Recommended columns:

| Due | Document | Discipline | Planned | Forecast | Variance | Status |
|---|---|---|---|---|---:|---|

The dashboard shall distinguish planned-date slippage from actual submission status.

### 4A.8 Resubmission Control

Provide a dedicated **Resubmission Required** list.

At minimum, the dashboard shall identify documents whose current approval/review outcome requires another submission based on the project configuration.

The mapping between approval/review outcomes and resubmission requirement shall be configuration-driven. For example, if the project rules specify that `REJ` requires resubmission, that rule should be represented as data/configuration rather than embedded in application code.

### 4A.9 Client Review Monitoring

Provide a **Client Review Monitoring** panel with at least:

- Currently under review
- Within SLA
- Due Soon
- Due Today
- Overdue
- Completed Within SLA
- Completed Late

Recommended aging view:

| Aging Category | Meaning |
|---|---|
| Within SLA | Review remains within allowed working days |
| Due Soon | Configurable threshold before due date |
| Due Today | Expected response date is today |
| Overdue 1–10 WD | 1–10 working days late |
| Overdue 11–20 WD | 11–20 working days late |
| Overdue >20 WD | More than 20 working days late |

The exact "Due Soon" threshold shall be configurable.

### 4A.10 Review SLA KPIs

Add operational KPIs such as:

- Documents currently under client review
- Within SLA
- Due within configured threshold
- Overdue
- SLA compliance %
- Average completed review duration
- Average first-review duration
- Average subsequent-review duration
- Longest current review
- Longest completed review

Percentages must always identify their denominator. If no applicable records exist, display `N/A` rather than `0%`.

### 4A.11 Document Lifecycle / Review Timeline

The document detail view should provide a lifecycle/timeline representation where the available data supports it:

```text
Planned
  ↓
First Submission
  ↓
Client Review #1 — 20 WD
  ↓
Review Outcome
  ↓
Resubmission
  ↓
Client Review #2 — 14 WD
  ↓
Review Outcome
  ↓
APP / Final Outcome
```

The timeline must use actual source dates where available and must not fabricate missing events.

### 4A.12 Schedule & Review Engine

The technical processing architecture shall include a dedicated schedule/review layer:

```text
Excel / CSV
    ↓
Workbook Parser
    ↓
Workbook Structure Validation
    ↓
Code Contract
    ↓
Raw Records
    ↓
Normalization
    ↓
Consolidated Document Model
    ↓
Validation
    ↓
Schedule & Review Engine
    ├── Submission Due
    ├── Submission Overdue
    ├── Review Cycle
    ├── Review Due
    ├── Review Overdue
    ├── Resubmission Due
    ├── Working-Day Aging
    └── SLA Status
    ↓
Derived View Model
    ↓
KPI / Charts / Action Lists / Detail
```

The Schedule & Review Engine shall be calculated once from the normalized model and reused by filters and views. Filtering must not cause the workbook to be reparsed or the complete validation/review calculation to be repeated.

### 4A.13 Important Data-Model Limitation

The current A:Y document list does not explicitly provide a complete review-history table. A single `Actual 1st Issue Date`, `Latest Approval Date`, and `Latest Approval Status` are sufficient for some current-state calculations but may not be sufficient to reconstruct every historical review cycle.

Therefore:

- first-review calculations may use the authoritative first submission date where applicable;
- subsequent-review calculations require reliable identification of the current resubmission/review start date and cycle;
- historical cycle analysis shall only be enabled when the source contains sufficient lifecycle data;
- the dashboard shall not infer missing review-cycle dates from unrelated fields.

If detailed historical review-cycle tracking becomes a requirement, consider a future **Review History** table keyed by Document No. and Review Cycle.


## 5. Validation Rules (V-01…V-28)

Grouped: **A. Domain/format** (single-field) · **B. Cross-field consistency** · **C. Transmission & state machine** · **D. Timeline** · **E. Referential integrity** · **F. Metadata completeness** · **G. Uniqueness & enum**.

| ID | Group | Rule | Severity |
|---|---|---|---|
| V-01 | A | Document No. (M) blank on an otherwise populated row | Warning |
| V-02 | A | Stage (B) not in Code!E list | Error |
| V-03 | A | UESH Discipline (C) not in Code!H list | Error |
| V-04 | A | Discipline Code (J) not in Code!T list (client discipline code) | Warning |
| V-05 | A | Doc Type (I) not in Code!Q list | Warning |
| V-06 | A | Authority (Q) not in Code!Z list | Warning |
| V-07 | A | Submission Status (W) not in Code!AC list | Warning |
| V-08 | A | Latest Approval Status (Y) not in the Approval Code block (Code!AF, read at runtime) and not blank | Error |
| V-10 | A | As-Built (P) = YES but Actual 1st Issue Date (U) blank | Warning |
| V-12 | A | Stage = Deleted/Void/Superseded but still counted as active (should be excluded) | Info |
| V-13 | A | Empty lookup code column while description column has values (mirrors PPP V-22) | Warning |
| V-14 | A | Project Code (G) not in Code!K list (WBS Contract Code) | Warning |
| V-15 | A | Document No. (M) contains a placeholder/`xxxx` (**on-hold number**) — the row record is still valid; **Warning only** (applies to active rows, §3.7; does not fail V-17 since composition uses the actual K value) | Warning |
| V-17 | B | Document No. (M) must equal `ProjectCode-Prefix-DocType-DisciplineCode-Number` = `G-H-I-J-K` joined by `-` (universal project rule; the **Discipline segment is the client Discipline Code = col J**, validated against Code!T — **not** UESH Discipline col C) | Error |
| V-19 | B | Submission Status (W) non-blank ⇔ Prolog Number (V) non-blank (two-way) | Warning |
| V-18 | C | `Actual 1st Issue Date` (U = 1st submission date) non-blank ⇒ `Prolog Number` (V) **and** `Submission Status` (W) must be non-blank (submitted ⇒ transmittal session exists) | Error |
| V-11 | C | Approval Status = APP but Latest Approval Date (X) blank | Warning |
| V-16 | C | Submission Status (W) = `RTR` but Latest Approval Status (Y) blank/`VOID` (approval expected) | Warning |
| V-20 | C | Approval Status (Y) has a conclusion (APP/AWC/REJ/NAP) ⇒ `Actual` (U) non-blank **and** `Latest Approval Date` (X) non-blank | Error |
| V-21 | C | Latest Approval Date (X) non-blank ⇒ Y non-blank and X ≥ U | Warning |
| V-09 | D | Date order: Planned (S) ≤ Forecast (T) ≤ Actual (U) | Warning |
| V-22 | D | Actual (U) non-blank ⇒ Planned (S) & Forecast (T) non-blank | Warning |
| V-23 | D | Future-date check — only **Actual 1st Issue Date (U)** and **Latest Approval Date (X)** must **not** be later than the **current system date** (a document's actual submission / approval must already have occurred — data lag / impossible future actual). Planned (S) and Forecast (T) are forward-looking and MAY legitimately be later than today — they are **NOT** flagged. | Warning |
| V-24 | E | BQ Number (E) non-blank ⇒ must exist in `BQ` sheet `BQ No.` column (blank E is allowed) | Warning |
| V-25 | F | Valid record (M non-blank) missing any required field: Document Title(N)/UESH Discipline(C)/Stage(B)/Doc Type(I)/Discipline Code(J)/Project Code(G)/Project Prefix(H)/Number(K) | Warning |
| V-26 | G | Document No. (M) duplicated within the consolidated table | Error |
| V-27 | G | As-Built (P) / Vendor Data (R) must be YES/NO/blank; other values | Warning |
| V-28 | D | Any Planned/Forecast/Actual 1st-issue date (S/T/U) earlier than the project start date (Code!B6) — document still counted/plotted on the Issue-Progress curve; flag for review | Warning |

> **Approval / transmission handling (reviewer Q3, Q5, no-hard-code directive):** the set of valid approval outcomes is the **Approval Code block (Code!AF), read at runtime — never hard-coded**; blank is always allowed (means not-available). The Q3 intent — that `VOID` (or any "not-available" code) be accepted — is realized **contract-driven**: the owner adds the code to Code!AF (already done in the updated error/approval codes), and the dashboard accepts it with **no code change**. The state machine (V-18→V-21) enforces the document-control lifecycle: a document cannot be approved (Y conclusion) before it is issued (U), and issuing requires a Prolog transmittal (V+W). `Actual 1st Issue Date` (U) is the authoritative "1st submission date" (Q5). Future-date checks (V-23) use the **current system date** (Q6). `BQ Number` may be blank on a document; V-24 fires only when E is non-blank (Q7).

> **V-15 (on-hold placeholder):** a Document No. containing `xxxx` denotes an **on-hold number**; the row record is still valid, so V-15 is **Warning only**. Because V-17 composes M from the actual `K` value, a `xxxx` number still satisfies the `G-H-I-J-K` rule — the two rules do not conflict.

---

## 6. Technical Architecture

- **Single file:** `MDL/MDL-Dashboard.html` (offline, zero-dep), ported from `PPP/arch/PPP_Dashboard.html` with the MDL contract.
- **5 layers (target):** `01 Tokens → 02 Primitives → 03 Data → 04 Logic → 05 View`. Logic may only call downward.
- **Parser:** `parseXlsx()` (ZIP→XML→sharedStrings→sheets) + `parseCSV()`; reads Code contract (col map + lookups) before any discipline sheet, and also reads the `BQ` sheet once for the V-24 referential check. Baseline for future-date checks is the **current system date** (Q6).
- **Model:** `buildModel()` **first consolidates all discovered discipline tabs into ONE document table** (§3.8) — union of A–Y rows tagged with `sourceTab` + `discipline(colC)` + `isActive` — then derives every summary, chart series and validation issue from that single table.
- **Schedule & Review Engine:** derives submission, resubmission and client-review clocks from the consolidated model using configurable working-day rules and the project working calendar; produces SLA status and action-required fields.
- **Render:** single `STATE` object + `render(STATE)` (DOM write-only).
- **Tokens & layout:** colour/typography tokens and the overall single-page layout are **reused from the PPP dashboard** (`PPP/arch/PPP_Dashboard.html`, §13.4) as the first choice — MDL mirrors PPP's welcome/file-load → KPIs → charts → validation → detail flow, with the left-nav panel **deferred** (reviewer 1). The UI Design Spec §15 palette is a future option. Charts inherit PPP's bar⇄pie toggle, `CHART.pie.topN` cap, `.ds-*` primitives, IIFE wrap, and a11y/print/reduced-motion blocks (reviewer 5f/5g).
- **Test harness:** `MDL/test/test_pipeline.mjs` (Node), runs the shipped script against the real workbook end-to-end; mirrors PPP's green-run approach. Assertions include that `model.lookups` equals the Code-sheet block values (proving **no hard-coded lists**) and that every validation message/severity is sourced from Code!AI:AL.

---

## 7. Workplan (Waves)

- **Wave 0 (P0-B parser + contract):** offline XLSX/CSV parser; read Code!A:C column map (§3.2) and all lookup blocks (§3.6); auto-discover discipline tabs via Code!H (§3.4); establish working-calendar and review-rule configuration; exclude BQ/Notes.
- **Wave 1 (P0 model + KPIs):** `buildModel` builds the §3.8 consolidated table first (union of all discipline tabs), with `isActiveDoc` (§3.7) and per-row discipline (col C); discipline summary matrix + per-stage expansion (§4.1), KPI bar, and initial schedule/review derived fields; `STATE`+`render`.
- **Wave 2 (P1 charts + filters + validation + action control):** charts and filters; validation layer (V-17–V-27); BQ referential check; Schedule & Review Engine; action-required lists; upcoming submissions; resubmission control; client-review aging; SLA KPIs; Error-table wording from Code!AI:AL; colour tokens.
- **Wave 3 (P2 UX polish):** IIFE wrap, `.ds-*` primitives, a11y (`role=img`/`aria-label`, `scope=col`, `:focus-visible`), dark/print/reduced-motion, export PNG/CSV, document lifecycle detail view, end-to-end test harness.
- **Wave 4 (performance + regression hardening):** performance targets, indexed filtering, reconciliation tests, working-day/SLA edge-case tests, large-workbook tests, and regression coverage for configuration-driven review rules.
- **Wave 5 (Design-Standard Alignment — spec v1.0 §13):** bring MDL into compliance with `Dashboard-UI-Design-Spec.md` v1.0. **Status (2026-10-11): ~90%+ aligned per spec §12 — all gaps resolved except left-nav (I-35, deferred to a future phase per Decision 34).** Tracked by I-31…I-46. Resolves the §13.3 P0–P3 gaps: tokens (I-31), status-bar `[hidden]` (I-32), `.ds-table` (I-33), `.seg`/`.tf-btn` (I-34), left-nav (I-35), footer (I-36), responsive cascade (I-37), panel numbering (I-38), Issue-Progress one-axis (I-39), glyph semantics (I-40), banner (I-41), app-bar (I-42), font/icon/focus (I-43), scroller/accordion (I-44), export/help a11y (I-45), spec-doc governance (I-46). Revisit Decisions 22 & 31 before coding (see Decisions 34 & 35). **Cross-reference:** spec §12/§13 internal refs "MDL I-63 (duplicate KPI)" and "MDL I-67 (buildModel S2/S3)" map to workplan **I-16** (sole `deriveView` S4 source) and the **Wave 5 pipeline refactor** respectively.

---

## 8. Decisions Captured (from Review — 2026-09-29)

| # | Decision |
|---|----------|
| 1 | Discipline universe = Code!H UESH Discipline list (20); tabs added later auto-appear |
| 2 | Only existing discipline tabs shown; authoritative discipline = col C (may differ from tab) |
| 3 | Document count = col M non-blank AND Stage ∉ {Deleted, Void, Superseded} |
| 4 | No code before approval of this workplan |
| 5 | Q1 resolved: no ghost/zero bars for "no list yet" disciplines; show a user message under related charts instead |
| 6 | Q2 resolved: UESH Discipline (col C) from the consolidated table is the sole discipline dimension; source worksheet is traceability-only, not a filter |
| 7 | Q3 resolved: `VOID`/any "not-available" approval code is accepted **only if present in the Approval Code block (Code!AF)** — contract-driven, no hard-coding; for `RTR` an approval status must be present (→ V-16) |
| 8 | Q4 resolved: **Submitted** = `Actual 1st Issue Date` (col U) not blank |
| 9 | Q5 resolved: `Actual 1st Issue Date` (U) = the authoritative "1st submission date" (maps to V-18) |
| 10 | Q6 resolved: future-date checks (V-23) use the **current system date**, not the Code!AsOf date |
| 11 | Q7 resolved: `BQ Number` referential check (V-24) is **Warning only**; a blank BQ Number is allowed |
| 12 | Q8 resolved: `Document No.` composition rule (`G-H-I-J-K`) is **universal** for the project; the discipline segment uses the **client Discipline Code = col J** (Code!T), **not** UESH Discipline (col C) |
| 13 | **No further open questions** — all reviewer decisions (§8 rows 1–12) are captured; proceed to implementation upon workplan approval |
| 14 | Reviewer directive: **no hard-coding** of error codes/descriptions/severity or any Code-sheet value list — all read at runtime (errors from Code!AI:AL, lookups from block ranges); the 4-col Error block (Code/Group/Rule/Severity) is now the sole wording + severity source |
| 15 | V-15 refined: Document No. `xxxx` = on-hold number on an active row; record remains valid → **Warning only**; does not conflict with V-17 (composition uses actual K) |
| 16 | Add a configuration-driven **Schedule & Review Engine** for submission, resubmission and client-review monitoring |
| 17 | Initial client review allowance = **20 working days**; subsequent client reviews = **14 working days** |
| 18 | Review durations are working-day rules and require an explicit project working calendar; they must not be hard-coded in application logic |
| 19 | Dashboard shall provide action-oriented lists for overdue/due-soon submissions, resubmissions and client reviews |
| 20 | Historical review-cycle calculations shall only be performed where the source contains sufficient lifecycle information; missing history must not be inferred |
| 21 | Code-sheet structure confirmed: column map at **rows 12–36** (rows 9–11 = Review Duration block `Code!A9:C11`); Error block is **4-col `Code!AI:AL`** (Code/Group/Rule/Severity), **all 27 §5 rules present & verified** (7×Error, 18×Warning, 1×Info; V-27 confirmed `Warning`) |
| 22 | **UI layout = PPP first** (reviewer 1): follow the PPP dashboard single-page layout (welcome/file-load → KPIs → charts → validation → detail); the UI Design Spec's 18-item left-nav panel is **deferred to future development**. **Superseded for the shell 2026-11-20 — see §11.7 and Decision 34.** |
| 23 | **No Originator/Reviewer** (reviewer 2): excluded from the dashboard; the spec's "Review Code" column maps to **Approval Status (col Y / Code!AF)** |
| 24 | **Export = CSV + PDF (print)** (reviewer 3): charts→PNG via Copy/Download; PDF via browser print (landscape/B&W); Excel export dropped to honour zero-dependency. **Changed 2026-11-20 — add spec XLSX export with an inlined writer; remove the Print / Save PDF menu button. See §11.7.** |
| 25 | **Disciplines from Code!H** (reviewer 4): all discipline names & the universe read from the UESH list (Code!H), never the spec's sample names |
| 26 | **No Contractor Reviews** (reviewer 5a): client-review only (Submission Status W / Approval Status Y); contractor-review page dropped |
| 27 | **No server; single load** (reviewer 5b): the `.xlsx` is loaded once at start via the welcome-screen file input; no backend, no live refresh; preferences via `localStorage` only |
| 28 | **Status dimensions separated** (reviewer 5c): Approval Status (Y/Code!AF) and Submission Status (W/Code!AC — renamed from "Prolog Submission Status") are distinct; the unified per-row "Current Status" pipeline is **NOT implemented now**; SLA statuses (Due Soon/Due Today/Overdue/Resubmit) deferred to chart-generation discussion; Validation Error reflects the Error Code block |
| 29 | **KPI set** (reviewer 5d): Total Planned · Submitted · Approved(=APP) · Approved w/ Comments(=AWC) · Rejected(=REJ) · Not Approved(=NAP); **Overdue** computed for 1st submission, subsequent submission, and client-review-return-late |
| 30 | **Charts mirror PPP** (reviewer 5e): user-selectable bar ⇄ pie toggle (localStorage) + Copy/Download PNG |
| 31 | **Tokens = PPP first; aging/buckets follow PPP** (reviewer 5f/5g): UI Design Spec §15 palette deferred |
| 32 | **Global search** (reviewer 5h) over the §3.8 consolidated table only (Document No. / Title / Discipline substring) |
| 33 | **Adopt `Dashboard-UI-Design-Spec.md` v1.1 as governing UI standard** (2026-10-15): the spec (v1.1, 2026-10-15) is now the **single source of truth** for layout / tokens / components across all internal dashboards incl. MDL. It **supersedes** the older "UI Design Spec §15" referenced in Decisions 22 & 31. MDL is audited at ~55–60% aligned (spec §13.2.9); the gap program is tracked by I-31…I-46 (Wave 5). |
| 34 | **Re-review Decision 22 (left-nav deferred)** (2026-10-08): spec v1.0 §3.2 names the **left sidebar** (OVERVIEW / REVIEWS / DOCUMENTS / QUALITY / SETTINGS) as the MDL navigation pattern — directly conflicting with the 2026-09-29 deferral. Resolution (2026-10-08, second review): user chose to **HOLD** the left-nav for a future phase; Decision 22 deferral stands and the spec v1.0 §3.2 mandate is **NOT adopted** for MDL at this time. I-35 moved to Deferred. **Reversed for the shell 2026-11-20; owner approved the rev 1.96 sidebar and I-35 is resolved. See §11.7.** |
| 35 | **Re-review Decision 31 (tokens deferred)** (2026-10-08): spec v1.0 §6 mandates the full ~33-token `:root` copied verbatim (MDL currently ships only 11, rest hard-coded). Conflicts with the 2026-09-29 deferral of the §15 palette. **Proposed resolution: adopt the full token set** (override Decision 31). Accepted 2026-10-08 — overrides decision 31 per spec v1.0. |


---

## 9. Open Questions / Assumptions

- **All open questions (Q1–Q8) are RESOLVED — see §8 rows 1–35.** The left-nav deferral ended on 2026-11-20 (§11.7); I-35 is RESOLVED. The full SLA / unified "Current Status" pipeline stays deferred per Decision 28 and is parked in §10. Decision 31 (tokens) was resolved by Decision 35; the full rev 1.96 token inventory remains open under I-121.
- **Assumption:** `BQ` and `Notes` are not document lists and are excluded; `Dashboard` tab is left as-is.
- **Assumption:** "Superseded" spelled as in Code!E (`Superseded`); exclusion list uses that exact spelling.
- **Assumption:** `Total Planned` = all active documents (denominator of the funnel); not restricted to rows with a `Planned 1st Issue Date` (S) set (Q4 only fixed *Submitted*).
- **Assumption (no-hard-code):** all validation value lists and all error wording/severity are loaded from the Code sheet at runtime. To accept a new code (e.g. `VOID` in Approval Status), the owner adds it to the relevant Code block (already done for the updated error/approval codes) — **no code change** required.

---

## 10. Future Enhancements (Backlog)

- **Left-navigation panel** — **Implemented 2026-11-20** under §11.7. I-35 RESOLVED. The MDL page set is Overview / Progress / Overdue / Validation / Documents. Breakdown stays held by owner direction.
- **Design-Standard Alignment (spec v1.0 §13 and rev 1.96)** — compliance program tracked by I-31…I-46 and I-121. **Implemented (2026-10-08/09):** Phases 1–3 delivered — I-31…I-50. **Implemented (2026-11-20):** rev 1.96 shell increment in §11.7. **Remaining under I-121:** two-panel Validation, pagination above 200 rows for tables other than Overdue, chart hover windows, table crosshair hover states, and the full token inventory.
- **Full Schedule & Review / SLA engine** — unified "Current Status" pipeline + SLA statuses (Due Soon / Due Today / Resubmit) deferred per decision 28; revisit when generating SLA charts. Only **Overdue** (3 flavours) is in scope now.
- **Contractor Reviews** page — dropped per decision 26 (no contractor-review data in the workbook).
- **Excel (.xlsx) export** — **Implemented 2026-11-20** with an inlined writer under §11.7. No package dependency added.
- **KPI content contract (spec §5)** — §5 defines KPI panel/card styling only, not the metric set, so MDL (document approval/overdue/completeness/disciplines) and PPP (package progress/PO/delivery/lead-time/engineer) expose entirely different KPI sets with no canonical contract. Add a KPI content spec (cross-dashboard common metrics vs domain-specific) — proposal from the 2026-10-10 KPI review (see also PPP §10).
- **Data-processing pipeline standard (spec §3)** — **DONE**. Spec §3.8 defines the layered workflow (S0 Acquire → S1 Parse → S2 Ingest/Normalize → S3 Validate → S4 Derive/deferred → S5 Render → S6 React-to-filter). MDL `buildModel` refactored to S2+S3 only (`kpis`/`charts`/`overdueLists` removed; `deriveView` is the sole S4 source) — closes **I-67**/**I-63**. PPP conforms — used as the reference.
- Drill-down: click a discipline bar → filtered detail table.
- Detailed Review History table keyed by Document No. + Review Cycle for full historical SLA analysis.
- Cross-tab coverage report: which (discipline × doc-type) cells are empty.
- Bulk CSV import / re-export of corrected lists back to the workbook.
- Multi-workbook roll-up (several TWRP packages).

- **Time-series S-curves + reporting-period filter** *(review 2026-09-30 — parked until required).* One consolidated future item covering two related features, with the decisions/risks agreed in review:
  - **Project-start anchor (`Code!B6`):** `B6` is the **value** column holding the project start date (Excel serial / ISO / text); `A6` holds the *label* "Project Start Date". `B6` is designated the **project start date** and shall be used **only as the x-axis origin / baseline anchor for date-related curves** (e.g., cumulative Planned/Forecast/Actual issue S-curves). It is **not** a reporting "as-of" and must **never** feed Overdue / V-23 / Schedule-variance look-ahead — those stay on the **system current date** (viewer's LOCAL date, not UTC — `todayISO` off-by-one fixed 2026-10-10, see I-07). `buildModel` now reads `B6` into `meta.projectStartDate`. **Resolved (2026-10-11):** in the live workbook `B6 = 46096` → **2026-03-15**, but the earliest issue date in the data is **2023-06** — i.e. documents exist ~2.75 years *before* the declared project start. Anchoring curves/dropdown on `B6` would drop that entire history, resolved via I-07/I-27 — pre-start history is reflected (curves anchored at min(B6, earliest-data)) and B6 is drawn as the red-dashed baseline; V-28 surfaces the mismatch as a warning in Panel 12 (no data dropped).
  - **Reporting-period filter (decided 2026-10-10):** the period scopes the **date-curve / throughput panels only** (S-curve + monthly bar; the window now scopes the S-curve data (cumulative shown within the selected window)); it does **not** drive the Overdue / Approval / KPI panels, which stay on as-of = system date. The panel shows a **dual label** `Reporting period: … · As-of: {system date}` so reviewers never conflate them. Consolidate with the existing Filter Panel 15 date-range control (single source, not a duplicate). Mirrors spec §7.9 and §3.8 rule 6.
  - **Scope gap:** no date-axis curve exists yet (current charts 1–9 are counts / bars / pies). This is **net-new**:

---

## 11. Shared-Spec Conformance Record (MDL-specific)

The shared `Dashboard-UI-Design-Spec.md` is **project-neutral**: it states what *any* dashboard must
do. Everything that belongs to MDL alone — the concrete instantiation of a permitted choice, MDL's
migration state, its enforcement posture and its issue history — lives here. Each entry cites the
spec clause it satisfies (spec §1, §8.4).

**On 2026-10-22 the spec was generalised** (v1.2 → v1.3) and the MDL-specific content below was moved
out of it. Nothing changed in MDL's behaviour — the rules are identical, only their location moved.

### 11.1 Dashboard-specific choices (the spec permits; MDL decides)

| Spec clause | MDL's choice |
|---|---|
| §4 — panel class name is free | `.panel` |
| §3.2 — navigation: sidebar **or** inline | **Left sidebar** — deferred to a future phase (I-35) |
| §1 — status vocabulary is per-dashboard | MDL defines its own status text/symbols; PPP's are never copied |
| §3.1 / §7.2.7 — which dimensions are **global** | **`Discipline`** and **`Stage`** — the two top-bar chips; both are the first gate (S4 → `active`) |
| §7.1 — enforcement posture (hard / advisory) | **Hard** — the contrast check blocks release |

### 11.2 Two-row menu-bar instantiation (spec §3.1)

The spec permits a two-row top bar and states what each row must carry; this is MDL's concrete form:

- The two rows scroll-stick as **one unit**.
- **Row 1 — title bar**: logo + 3-line title block (project title / dashboard title / project-start +
  as-of). **No action buttons.**
- **Row 2 — menu bar**:
  - **Left actions cluster** — `Load Workbook` as the single **A1 Primary CTA**, `Print / Save PDF`
    as secondary.
  - **Right filter group** — global `Discipline` and `Stage` multi-select chips, a `Search` button
    that reveals a popover panel, and the `Warnings` toggle (spec §3.5).
- Menu-bar controls are **borderless and icon-free** — text-only labels; counts show as a
  parenthetical on the chip, the badge carries the warning count; controls highlight on hover with a
  soft tint; **the only filled element is the Primary CTA**.
- `Warnings` always reads **`Warnings`** with the count in its badge (e.g. `[4] Warnings`) — the label
  never inverts to Show/Hide warnings (I-107).
- `Search` is a button that opens the popover, not an inline text field.

### 11.3 Search popover layout (spec §3.1 / §8)

Single row: column selector → **elongated** search field → `Find` / `Reset`. Search field ≥ 200 px
when open; the popover may grow to ~640 px. Enforced by the layout harness **Tier 4f
`lintSearchPanel`**, which MDL runs **hard** (with the contrast setting).

### 11.4 Conformance / migration state

| Spec clause | MDL status |
|---|---|
| §7.1 A3 — `.btn-secondary` is the canonical text-action class | **Conforming** — MDL has always used `.btn-secondary`; no legacy alias (8 hits in `src/render.mjs`) |
| §7.2.15 — every bounded table uses the split header; sticky `<thead>` inside a `.tableScroll` is retired | **Migrating (I-116)** — remaining sticky tables to convert: **Overdue List**, **Validation / Issues**, **Document Detail** |
| §7.1 B7 — column-visibility control has its own class, not filter chrome | **Conforming (I-114, 2026-10-20)** — `.cc-wrap` / `.cc-btn` / `.cc-panel`; no count badge, no active-filter emphasis |
| §7.2.7 pt 6 / §7.1 B6 — a panel-local filter affects only its own tables | **Conforming (I-114, 2026-10-20)** — the Validation / Issues **rule-code** filter, resolved in S5 |
| §7.1 B — floating-panel ordering (master → note → divider → list → footer) | **Conforming (I-115)** |
| §4 table-card contract, tool-row split and token gaps | **Conforming (I-151, I-152, I-157, I-160)** — Overdue and Validation controls sit in card tool rows; filters left, actions right; `--tool-pad` and `--tool-gap` used |
| §4 rev 1.88 — CSV hidden for an empty table | **Conforming (I-153)** — Overdue hides its CSV when the filtered set is empty |
| §4.3 — pagination above 200 rows | **Conforming for Overdue and Validation (I-154, I-160)** — 200-row pages and panel-local `data-*` page buttons; other bounded tables remain under I-121 |
| §4.5 / assertion 36 — two Validation panels | **Conforming (I-160)** — `Validation Rules` and `Validation Issues` are top-level, full width and carry one chip row each; unique `data-validation-count` hook added |
| §4 Forward and Overdue document-name rule | **Conforming (I-155)** — `Document No.` and `Document Title` are adjacent with wider defaults and per-column minimums |
| §18 type alignment and column minimums | **Conforming (I-156, I-159)** — dates and numbers use `.num`, statuses use `.enum`, and `makeGrid()` uses `c.min` |
| §18 minimal zebra striping | **Conforming (I-161)** — one `--ds-zebra` token for every table body, with five theme values; Document Detail is the reference design |

### 11.5 Regressions behind the shared rules (MDL issue history)

Kept here, not in the spec, so the standard stays project-neutral.

- **I-103** — split-header / fragment-pairing contract (spec §7.2.15 added).
- **I-105, I-106** — control contrast and accessible-name failures (spec §7.1 contrast mandate).
- **I-107** — a toggle label that inverted its verb with state (`Show warnings` / `Hide warnings`).
- **I-108** — matrix header column rules (spec §7.2.15 matrix exception, harness Tier 4g).
- **I-115** — floating-panel internal ordering (spec §7.1 B).
- **I-116** — vertical-scrollbar / split-header standardisation (spec §7.2.15).
- **I-71** — A3 canonical class name (spec §7.1 A3). PPP's counterpart is PPP I-78.
- **I-113, I-114** — filter de-duplication and filter-control vocabulary (spec §7.2.7, §7.1 B).

### 11.6 Evidence (spec §8.4)

- MDL suite: `MDL/test/test_render.mjs`, `MDL/test/test_grid.mjs`.
- Shared harness: `harness-layout` with MDL's check module; MDL runs `chrome.controlContrast` **hard**.
- Per-clause evidence pointers are recorded in `MDL/log/issue_log.md`.

### 11.7 Rev 1.96 shell alignment — owner decisions (2026-11-20)

Owner instruction: follow the spec for the left nav panel design. Do not add the Breakdown menu item
to MDL. Drop the Print / Save PDF menu button because the spec does not require it. Keep the spec
Export control and use the `.xlsx` workbook contract. The approved review sample is
`MDL/Arch/MDL-Shell-Sample.html`.

| Decision | Effect on MDL |
|---|---|
| Reverse Decision 22 and Decision 34 for the shell only. Reopen I-35. | Add a left sidebar with Overview, Progress, Overdue, Validation and Documents. Add Settings and Help pinned to the bottom. |
| Spec §3.1 / §3.2 shell markers. | Add `data-shell` markers, `data-shell-toggle`, `data-shell-resize`, warning area inside content, active page label in title bar. |
| Spec §3.1 rev 1.86 layout control. | Put Theme and Layout selects in Settings. Persist `layout`. Apply `body.dataset.layout` on load and repaint. KPI card density stays outside this control. |
| Drop Print / Save PDF menu control. | Remove the menu button. Keep browser print and print styles. |
| Spec §4 rev 1.90 workbook export. | Add top-menu `Export`. Use an inlined XLSX writer. One worksheet per table across all rendered pages. |
| Hold Breakdown for MDL. | Do not add the Breakdown page link or the C3 Breakdown panels. Record the gap in the conformance table. |

**Implementation scope for this increment:** shell, navigation, title bar, menu bar, Settings,
theme/layout state, workbook export, focused tests, build, and logs. Other rev 1.96 gaps remain
open: two-panel Validation, pagination above 200 rows, chart hover windows, table crosshair,
panel count chips, and the full token inventory.

**Rollback:** rebuild from the previous `src/render.mjs`; restore this workplan from revision history.
No shared harness or shared spec file is changed by this increment.

### 11.8 I-122 — content body vertical scrolling (2026-11-20)

Spec §3.1 requires a scrollable content area. Spec §3.5 requires the warning area to stay outside
the scrolling body. The shell increment set `#app` to `height:100vh` with `overflow:hidden`, but it
did not give `[data-shell="body"]` a vertical scroll rule. A page taller than one screen therefore
clipped its lower panels.

Owner-approved fix:

- Make `.shell-main` fill the remaining viewport height.
- Make `[data-shell="content"]` a flex column with `min-height:0`.
- Make `[data-shell="body"]` use `overflow-y:auto` with `min-height:0`.
- Keep warning and filter strips outside the scrolling body.
- Add a shared `harness-layout` check that probes every page with a temporary tall element and
  verifies that the content body scrolls.
- Enable the check for MDL through `checks/mdl.mjs`.

No spec change is needed. The spec already states the requirement. I-122 records the defect and its
fix.

### 11.9 I-123 — matrix full width and no inner scrollbars (2026-11-20)

The Discipline Summary Matrix sat in one grid column and its body used a 340 px maximum height.
The panel therefore showed horizontal or vertical scrollbars even when the content area had space.
The user requested a full-screen matrix with no inner scrollbars.

Owner-approved fix:

- Make `#matrixPanel` span all panel columns for `one`, `two`, and `three` layouts.
- Remove only the height cap with `#matrixPanel .tableScroll{max-height:none}`.
- Keep `#matrixPanel .matrixcard{overflow:hidden}` for the rounded container.
- Keep the split header, drill rows, and table actions unchanged.
- Keep the content body as the page scroll surface.

I-123 opened. I-124 corrected the matrix fit and border details. §11.10 records the final state.

### 11.10 I-124 and I-125 — matrix fit, outer border, and shared crosshair (2026-11-20)

A harness-layout review found three table issues:

- The matrix columns still overflowed the display area by 66 px.
- I-123 had set the matrix card to `overflow:visible`. This broke spec §7.2.15 invariant 1.
- MDL had no `data-table-crosshair`, so spec §7.2.16 was not met.

Owner-approved fix:

- Restore `overflow:hidden` on the matrix card and keep only `max-height:none` on its scroller.
- Add a resize-aware fit pass for matrix columns with a 60 px minimum.
- Add stable `data-col-id` values to matrix cells and other live table cells.
- Add one delegated crosshair binder for `.row-hover`, `.col-hover`, and `.cell-hover`.
- Suppress crosshair classes in print output.
- Enable the shared crosshair check in `harness-layout/checks/mdl.mjs`.

I-124 records the matrix fit and border defect. I-125 records the missing crosshair. No spec change is needed.

### 11.11 I-126 — crosshair colours aligned with spec rev 1.97 (2026-11-20)

Spec rev 1.97 added five normative crosshair tokens. It required translucent row and column tracks,
a stronger intersection cell, and non-destructive header highlighting. MDL still used `--warn-bg`
and `--accent-soft-border` with opaque fills.

Owner-approved fix:

- Add `--crosshair-track`, `--crosshair-intersection`, `--crosshair-ring`,
  `--header-crosshair-overlay`, and `--header-crosshair-accent` to all five themes.
- Paint row and column tracks with layered `background-image` gradients. Keep zebra and tint fills.
- Paint `.cell-hover` with `--crosshair-intersection` and inset `--crosshair-ring`.
- Paint active `<th>` cells with `--header-crosshair-overlay` and `--header-crosshair-accent`.
- Guard pointer hover with `(hover: hover) and (pointer: fine)`. Add `focusin` and `focusout` parity.
- Make matrix rows and matrix header cells keyboard focusable.
- Remove the new overlay images from print output.

I-126 records the defect and its fix. The shared spec was updated in rev 1.97 before this work.

### 11.12 I-127 — bottom status bar aligned with the UI spec (2026-11-20)

`Dashboard-UI-Design-Spec.md` §3.1 and §3.6 require one full-width navy status bar. §3.6 says
the dashboard must name its left and right values in this workplan. `AGENTS.md` §18.2 gives the
shared fields: current state or selected file on the left, version string on the right.

The MDL status bar had ten `.sb-panel` chips. Most values duplicated KPI cards, matrix totals,
the title-bar `as-of` text, or global filter chips. The chip chrome was not requested by the spec.

Owner-approved status-bar fields:

- Left: state dot and `File: <workbook name>`.
- Left, only when needed: `Render issues: <count>`.
- Right: `MDL Dashboard v1.0`.
- No domain counts in the status bar. KPI, matrix, validation, and filter surfaces stay the single
  source for their values.
- The status bar keeps the full-width navy strip in normal layout flow.

I-127 records the defect and its fix. Harness Tier 3 now checks the selected file and version string
instead of a domain total. No shared spec file changed. I-128 later supersedes the right-side text
with the workplan version and the moved footer metadata.

### 11.13 I-128 — footer metadata moved into the status bar (2026-11-21)

The page still showed this footer inside the scrolling content body:

> Standalone Dashboard. Updated on 20 Nov 2026. Copyright UESH 2026.

The status bar showed `MDL Dashboard v1.0`, but this workplan declares version `0.1`.

Owner-approved fix:

- Remove the `<footer class="disclaimer">` element and its CSS.
- Set `APP_VERSION` to `0.1`.
- Show `MDL Dashboard v0.1 · Updated <generated date> · © UESH 2026` on the right.
- Format the update date from `MODEL.meta.generatedAt`.
- Remove the unused `.sb-dot-err` rule.

I-128 records the defect and its fix. The status-bar fields in §11.12 stay valid, with the right-side
text updated by this section. No shared spec or harness file changed.

### 11.14 I-129 — KPI hover windows (2026-11-21)

Spec §4.6 requires one shared hover window for chart boards and KPI cards. MDL had no `.kpi-card`
host, no `aria-describedby`, no `.chart-tip`, and no hover config in the harness.

Owner-approved fix:

- Add `kpi-card`, `data-kpi`, `data-tip`, `tabindex="0"`, and `aria-describedby="kpiTip"` to all
  12 primary KPI cards and 4 secondary tiles.
- Add one shared `#kpiTip` node with `role="tooltip"` and `aria-hidden="true"`.
- Build tooltip content from the KPI definitions in §3.8. Each window has a header, Purpose,
  Source, Calculation rows, and an Active scope footer.
- Add one delegated binder for pointer hover, touch tap, keyboard focus, Escape, click-away,
  and print. Hidden windows carry `aria-hidden="true"` and no text.
- Place the window below the card, centred and clamped. Use an opacity-only 100 ms transition.
- Add MDL Tier 6 hover config. Change the harness wait selector from `.page-link` to `[data-page]`
  so Tier 6 works for both MDL and Sub.

I-129 records the defect and its fix. No shared spec file changed. Harness revisions 1.35 and 1.36
add load progress and exclude the body state marker from Tier 6 page discovery. Standalone Tier 6
now completes: 27 passed / 0 failed / 0 advisory / 0 skipped.

### 11.15 I-130 — General hover-window value alignment (2026-11-21)

Spec §4.6 rev 1.97 used one space-between flex row for every body row. The value sat at the right
edge. That rule suits numbers. Long text then started at different x positions and wrapped in a
narrow area.

Owner decision 2026-11-21: numbers stay right-aligned; text starts after its label and aligns left.
Both byte-identical spec copies now carry rev 1.98 with a general two-column rule. It applies to
body rows and footers in every hover window.

MDL fix:

- Use `display:grid` with `grid-template-columns:76px minmax(0,1fr)` for `.chart-tip-row` and
  `.chart-tip-foot`.
- Align the value column left by default. Add `.tip-num` for numeric values and align it right.
- Rebuild `MDL-Dashboard.html`. Add three shell assertions for the grid rule, the text alignment,
  and the numeric class.

I-130 records the defect and its fix. `node test/test_shell.mjs` reports 50 passed / 0 failed. Both
spec copies have the same SHA-256 hash. Harness revision 1.38 skips repeat checks of one shared tip.
Standalone Tier 6 now reports 27 passed / 0 failed / 0 advisory / 0 skipped.

### 11.16 I-131 — Fixed tooltip label column (2026-11-21)

I-130 set `text-align:left` on each value, but it used `grid-template-columns:auto minmax(0,1fr)` on
each row. Each row sized its own label column. The value column started at a different x for
`Purpose`, `Source`, and `Calculation`. This did not meet the §4.6 rev 1.98 fixed-label-column rule.

Owner-approved fix: use `grid-template-columns:76px minmax(0,1fr)` for both `.chart-tip-row` and
`.chart-tip-foot`. Rebuild `MDL-Dashboard.html`. Update the three shell assertions to expect the
fixed column. No spec file changed.

I-131 records the defect and its fix. Chromium measurement gives a 76 px label and a value start at
x=92 for all four labels. `node test/test_shell.mjs` reports 50 passed / 0 failed. Standalone Tier 6
reports 27 passed / 0 failed / 0 advisory / 0 skipped.

### 11.17 I-132 — Matrix tool row alignment (2026-11-21)

Spec §4 requires the panel title row to hold only the title, Help, and Collapse. Table controls sit
with the table in one card. The tool row splits filters left and actions right with `margin-left:auto`.
Rev 1.91 states that the Month select is a filter.

MDL matrix put Month, Expand all, Collapse all, PNG, Copy, and CSV in `.panel-head`. The card held
only the table. This merged the tool row into the title row and failed §4.

Owner-approved fix:

- Add `.toolbar.matrix-tools` inside `.matrixcard`, before the split header.
- Put the Month select in `.tool-filters`. Put the five action buttons in `.tool-actions` with
  `margin-left:auto`.
- Leave only Help and Collapse in `.head-actions`. Update the help text.
- Add four shell assertions for card placement, right alignment, filter grouping, and title-row
  exclusion.

I-132 records the defect and its fix. `MDL-Dashboard.html` is 275,012 B. `node test/test_shell.mjs`
reports 54 passed / 0 failed. Standalone Tier 6 reports 27 passed / 0 failed / 0 advisory / 0 skipped.

### 11.18 I-133 — Tool-row gaps and matrix double border (2026-11-21)

Owner instruction: make the tool-row gap rule general for all panels. Both byte-identical spec copies
now carry rev 1.99. §4 requires every tool row to use `--tool-pad` for equal padding on four sides and
`--tool-gap` between control groups. §6 adds both tokens. The C3 tokens are now aliases.

Owner also reported a second border around the matrix tool row and table. Visual check confirms two
nested edges: the `.panel` border and the `.matrixcard` border.

Owner-approved fix: add `--tool-pad:12px` and `--tool-gap:10px` to `:root`. Change `.toolbar` and both
control groups to use `var(--tool-gap)`. Give `.matrixcard>.toolbar` `padding:var(--tool-pad)`.

First attempt was wrong. It added `panel-flat` to `renderMatrix()`, which removed the panel border and
kept the matrix card border. Owner rejected that result. Corrected fix: remove the `panel-flat` call
and set `.matrixcard` to `border:0`. The panel edge stays; the matrix card and scroller add no second
border. Shell assertions now check the panel border, the border-free card, token gaps, and tool padding.

I-133 records the defect and its fix. `MDL-Dashboard.html` is 275,082 B. `node test/test_shell.mjs`
reports 59 passed / 0 failed. A Chromium probe reports `#matrixPanel` `1px solid` and `.matrixcard`
`0px none`. Standalone Tier 6 reports 27 passed / 0 failed / 0 advisory / 0 skipped. Harness rev 1.39
now adds Tier 4c assertions for one visible table outer border and rounded outer corners; MDL Tier 4
fails the new border assertion, which confirms the earlier harness gap is closed.

### 11.19 I-134 — Matrix table outer border and corners (2026-11-21)

Harness rev 1.39 exposed two defects that I-133 missed. The matrix table had no own outer border.
The tool row occupied the clipped top of `.matrixcard`, so the table header top corners looked square.
Spec §7.2 requires one visible `1px solid var(--border)` outer border with `border-radius:10px`.
Rev 1.81 permits right-angle corners only where bordered zones overlap. No such overlap exists here.

Owner-approved fix:

- Move the tool row before `.matrixcard` in the panel body.
- Restore `.matrixcard{border:1px solid var(--border);border-radius:10px;overflow:hidden}`.
- Change the tool-row padding selector to `.toolbar.matrix-tools`.
- Update four shell assertions for row order, card border, panel border, and token padding.

I-134 records the defect and its fix. `MDL-Dashboard.html` is 275,105 B. `node test/test_shell.mjs`
reports 59 passed / 0 failed. MDL Tier 4 reports 71 passed / 6 failed; the six failures are the
pre-existing I-95 resize-grip checks. Both new Tier 4c border and corner assertions pass.

### 11.20 I-135 — Sidebar toggle page layout (2026-11-21)

Owner reported that hiding the left sidebar did not show the page properly. A Chromium probe confirmed
the defect: content width fell from 1120 px to 40 px and panels fell from 1080 px to 30 px. The cause
was `body.sidebar-collapsed .shell-main{grid-template-columns:0 minmax(0,1fr)}` combined with
`display:none` on the sidebar. The hidden sidebar left the grid, so the content moved into the first
zero-width column.

Harness gap: Tier 2 checked only that the toggle and resize handle existed. It did not click the
toggle or measure the page after collapse.

Owner-approved fix:

- Change `body.sidebar-collapsed .shell-main` to `grid-template-columns:minmax(0,1fr)`.
- Add `sidebarToggle: true` to the MDL harness config.
- Add a Tier 2 behavior check that clicks the toggle, measures sidebar display, content width,
  visible panel widths, and toggle label, then restores the sidebar.
- Add a shell assertion for the corrected collapsed grid.

I-135 records the defect and its fix. Chromium probe results are: before `160px 1120px`, after
`1280px`, restored `160px 1120px`; toggle labels are `Collapse left sidebar` and
`Expand left sidebar`. `MDL-Dashboard.html` is 275,103 B. `node test/test_shell.mjs` reports
60 passed / 0 failed. MDL Tier 2 reports 52 passed / 0 failed. Standalone Tier 6 reports
27 passed / 0 failed / 0 advisory / 0 skipped. Tier 3 still reports the pre-existing I-95
sample-check failures.

### 11.22 Issue Progress S-curve design review — spec rev 1.100 and I-137…I-143 (2026-11-23)

Owner reviewed the Issue Progress S-curve panel and reported seven design findings. The review
covered the reference-line labels, the legend band, the Y caption, the X labels, the period time
bar, the attached-table background and the chart crosshair. Findings are recorded as seven
separate issues, one per finding. Spec rev 1.100 was approved by chinwarsoon on 2026-11-23 and
applied to both byte-identical spec copies. No dashboard source code changed in this step.

**Spec decisions now in force**

| Rule | Spec clause | Check |
|---|---|---|
| Reference-line labels do not share the legend band and stay in the plot | §4.2 rev 1.100 | §8.2 assertion 37 |
| Legend band uses named insets, top pad and row pitch | §4.2 rev 1.100 | §8.2 assertion 37 |
| One unit caption per axis, no in-SVG caption when the gutter carries it | §4.2 rev 1.100 | §8.2 assertion 37 |
| No SVG X labels when the attached table provides them | §4.2 rev 1.100 | §8.2 assertion 37 |
| Time handles carry `data-c1period`; print keeps the range text | §4.2 revs 1.66, 1.67, 1.100 | §8.2 assertion 37 |
| Tokenised area fill per visible cumulative series | §4.2 rev 1.100 | §8.2 assertion 38 |
| Chart-area tap-to-show and `aria-describedby` link | §4.6 rev 1.100 | §8.2 assertion 38 |

**Issue map**

| Issue | Finding | Target rule |
|---|---|---|
| I-137 | Start and Today labels overlap the legend | §4.2 rev 1.100 reference labels |
| I-138 | Legend band gaps are not designed | §4.2 rev 1.100 band padding |
| I-139 | Y axis repeats `Docs` and `Documents` | §4.2 rev 1.100 one caption |
| I-140 | SVG X labels overlap the table head | §4.2 rev 1.100 no SVG X labels |
| I-141 | Time bar contract deviations | §4.2 revs 1.66, 1.67, 1.100 |
| I-142 | Table background and crosshair scope | §4.2 rev 1.81, §7.2.16 |
| I-143 | Chart crosshair and hover gaps | §4.2 rev 1.100, §4.6 rev 1.100 |

**Fix phases. Applied 2026-11-23.** Owner approved P1, P2 and P3 in one decision on 2026-11-23.

| Task | Issue | Phase | Status | Tests | Work |
|---|---|---|---|---|---|
| T11.22.1 | I-137 | P2 | DONE | TL022 / TL023 | Reference labels moved into an 18-unit band; lines span the band and labels clamp. |
| T11.22.2 | I-138 | P2 | DONE | TL022 / TL023 | Legend insets and row pitch applied; Y ticks render in the gutter. |
| T11.22.3 | I-139 | P1 | DONE | TL022 / TL023 | In-SVG `Docs` caption removed; the right-axis `per mo` caption stays in dual mode; gutter `Documents` is the single left caption. |
| T11.22.4 | I-140 | P1 | DONE | TL022 / TL023 | Bottom SVG month labels removed; the table thead owns the X axis. |
| T11.22.5 | I-141 | P3 | DONE | TL022 / TL023 | Preset default `All`, handle attributes, index ticks, blue active chip, wide nowrap and scoped print rule. |
| T11.22.6 | I-142 | P3 | DONE | TL022 / TL023 | Plot zone uses `--surface`; table moved onto the shared binder with chart-linked `col-active` state. |
| T11.22.7 | I-143 | P3 | DONE | TL022 / TL023 | Plot tap-to-show and tap-away, `aria-describedby`, tokenised gradients and `.sc-area` paths. |

**Decisions applied.** The preset default is `All` per spec rev 1.67. The attached table now uses
the one delegated binder under §7.2.16, with chart-linked state kept on `col-active`; no C1
reference exception is recorded. The active preset chip was set to `--blue` on 2026-11-23; that
decision is SUPERSEDED by spec rev 1.101, which pins the navy active fill of §7.5 B2.1 for every
dashboard and retires the MDL / PPP deviation row. See §11.23.

**Evidence.** Spec revision row 1.100 in both copies. Issue entries I-137…I-143 in
`MDL/log/issue_log.md` revision 1.20. `node build.mjs` rebuilt `MDL-Dashboard.html` at 298,581 bytes.
`test_shell.mjs` 84 passed / 0 failed, including the panel runtime smoke test and a generic-table
crosshair regression check. `test_pipeline.mjs` 96 passed / 7 failed and `test_grid.mjs` 42 passed /
1 failed, both unchanged from baseline. The full `harness-layout` run confirms the fixes: HEAD-build
baseline 201 passed / 10 failed / 2 advisory / 22 skipped (matches TL021); the new build reaches
211 passed / 10 failed after a config-gated harness fix that teaches `lintTableCrosshair()` the
chart-linked `curve-c1-table` class per §7.2.16 (harness `I006` / `U008`); the 10 remaining
failures are byte-for-byte the baseline set. See `U021`, `U022`, `TL022` and `TL023`.

### 11.23 — Time bar aligned with the Sub reference design (spec rev 1.101, I-144)

**Owner instruction (2026-11-23).** MDL and every future dashboard MUST produce the same design
result as the Sub dashboard, and the details MUST be general requirements in the UI spec. Spec
rev 1.101 makes Sub the normative reference implementation and pins the C1 time bar geometry in
§4.2 and the segmented standard in §7.5 B2.1; the former MDL / PPP deviation row is retired and
the 2026-11-23 `--blue` chip decision is superseded by the navy active fill.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.23.1 | I-144 | DONE | TL024 | Shared `--seg-*` tokens with the full B2.1 state set and the navy active fill; 4 px `--border` track; solid blue thumbs with ring, grab cursor and active scale; window-interior tick semantics with January year labels; thumb-compensated fill and tick positioning; explicit `step="1"`; presets anchored at the current `to` index; Sub cluster composition; `Month – Month` period text; dead `wide` toggle removed; missing `--surface2` / `--surface3` / `--text2` tokens defined. |

**Evidence.** Spec revision row 1.101 in both byte-identical copies (SHA-256
`85F43B63AE83CF504EDCA6E40EEB45D197CE7099E6B7F42B4CCC4FDFB59EFF16`). Issue `I-144` in
`MDL/log/issue_log.md` revision 1.21. `node build.mjs` rebuilt `MDL-Dashboard.html` at
300,479 bytes. `test_shell.mjs` **94 passed / 0 failed**, including ten new rev 1.101
alignment checks. `test_pipeline.mjs` 96 passed / 7 failed and `test_grid.mjs` 42 passed /
1 failed, both at baseline. The full MDL harness: 211 passed / 10 failed / 2 advisory /
22 skipped, failure set identical to the HEAD-build baseline. See `U023` and `TL024`.

### 11.24 — Time-bar fill aligned with the thumbs (I-145)

**Owner report (2026-11-23).** The highlighted period rendered below the track instead of in line
with the two thumbs. Confirmed non-compliant with §4.2 rev 1.101, which pins the thumb-compensated
fill positioning. No spec change was needed; the I-144 markup had nested the fill inside the 4 px
track element.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.24.1 | I-145 | DONE | TL025 | Moved `.c1-fill` out of `.c1-track` to a zone sibling inside the 26 px time bar, matching the Sub reference DOM. Added a sibling-order regression check to `test_shell.mjs`. |

**Evidence.** Live-browser Playwright measurement of the built dashboard with the real workbook:
`All` window — fill top 302.5 px equals track top, height 4 px, computed left 7 px / width 206 px
per the pinned formula; `12M` window (19..30 of 31) — fill left 1023.42 px vs expected 1023.44 px,
right edge 1098.95 px vs 1098.97 px. Screenshots `harness-layout/run-mdl-i145-fix.png` and
`harness-layout/run-mdl-i145-fix-12m.png`. Shell suite 95 passed / 0 failed; pipeline 96 / 7 and
grid 42 / 1 at baseline. Issue `I-145` in `MDL/log/issue_log.md` revision 1.22. See `U024` and
`TL025`.

### 11.25 — General two-row chart head (spec rev 1.102, I-146)

**Owner instruction (2026-11-24).** Make the reviewed chart-head changes GENERAL requirements for
every dashboard in the UI spec, not deviations; update the workplan and issue log for the work to
be done; then implement, test and log the details. Spec rev 1.102 supersedes rev 1.67's one-row
cluster rule and rev 1.101's chip-before-text order. Sub's time-bar geometry, tokens and states
stay the visual reference; its one-row composition is superseded.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.25.1 | I-146 | DONE | TL026 | Spec rev 1.102 in both byte-identical copies: general two-row chart head, chip-before-text order, no explanatory caption, print rules. |
| T11.25.2 | I-146 | DONE | TL026 | MDL markup and CSS: tool row above (right-aligned, `--tool-gap`), time bar row below at full card width, 10 px / 2 px row gaps, print hides the tool row. |
| T11.25.3 | I-146 | DONE | TL026 | Move the date range text after the preset chips; remove the project-start explanation note; align the Help text with the rendered reference lines. |
| T11.25.4 | I-146 | DONE | TL026 | Extend `test_shell.mjs`, rebuild, run shell / pipeline / grid / full MDL harness, and complete the logs. |

**Evidence.** Spec revision row 1.102 in both byte-identical copies (SHA-256
`4F924B04BEC922B190D90CEF1EB12027C840526054C42B0502BE07ACF82008E5`). Issue `I-146` in
`MDL/log/issue_log.md` revision 1.23. `node build.mjs` rebuilt `MDL-Dashboard.html` at
300,395 bytes. Live browser: tool row above and right-aligned, 10 px to the time bar row,
2 px to the chart top border, text after the chips, no project-start caption, print hides the
tool row and keeps the period text. Screenshot `harness-layout/run-mdl-i146-two-row.png`.
`test_shell.mjs` 101 passed / 0 failed with six new I-146 checks; `test_pipeline.mjs` 96 / 7 and
`test_grid.mjs` 42 / 1 at baseline; full harness 211 passed / 10 failed / 2 advisory / 22 skipped,
failure set identical to the HEAD baseline. See `U025` and `TL026`.

### 11.26 — Attached-table gap, board fit and themed header fill (spec rev 1.103, I-147)

**Owner review (2026-11-24).** Keep a visible chart-to-table gap as a general requirement; allow
vertical month headers so the board does not scroll when the table fits; pin the header fill to
the theme; make the harness check all three. Historical state: gap 0 px, board scrollWidth 2140 px
against clientWidth 477 px at 1280 px, horizontal headers, `--surface2` header fill.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.26.1 | I-147 | DONE | TL027 | Spec rev 1.103 in both copies: `--c1-plot-table-gap:10px`, board fit / vertical headers, themed header fill, assertions 39 / 40. |
| T11.26.2 | I-147 | DONE | TL027 | MDL: gap token and rounded non-shared corners, `min-width:0` grid, >13-column vertical headers, themed header fill in render and export. |
| T11.26.3 | I-147 | DONE | TL027 | Config-gated harness checks for the gap, board fit, header rotation and header fill. |
| T11.26.4 | I-147 | DONE | TL027 | Extend shell checks, rebuild, run suites / harness, live verification and records. |

**Evidence.** Spec revision row 1.103 in both byte-identical copies (SHA-256
`8EF6A9CE7BE04E74F657437F6FD59436769A38497C69B4FE21B42D326A27926F`) with general gap, fit,
header-fill rules and assertions 39 / 40. Issue `I-147` in `MDL/log/issue_log.md` revision 1.24.
`node build.mjs` rebuilt `MDL-Dashboard.html` at 301,109 B. Live at 1280 px: gap 10 px, host
`clientWidth = scrollWidth = 477 px`, grid `min-width:0`, `c1-many` with 88 px vertical month
headers, header fill `rgb(241,245,249)` = `--surface2`. Screenshots `harness-layout/run-mdl-i147-board.png`
and `run-mdl-i147-header-zoom.png`. `test_shell.mjs` 106 passed / 0 failed; pipeline 96 / 7 and
grid 42 / 1 at baseline; harness 217 passed / 10 failed / 2 advisory / 22 skipped with the 10
failures identical to the HEAD baseline and all six new board-contract checks passing. See `U026`
and `TL027`.

### 11.27 — Attached-table CSV and Y-axis caption typography (spec rev 1.104, I-148)

**Owner review (2026-11-24).** Add the spec-required `⤓ CSV` action to the chart tool row, and
centre the "Documents" caption near the axis with bold caption and tick typography. Historical
state: no CSV action on the curve panel; caption 11.5 px above gutter centre, regular 11 px
`--muted`, reading downward; Sub centres rotates and bolds both caption and ticks.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.27.1 | I-148 | DONE | TL028 | Spec rev 1.104 in both copies with centred near-axis caption, bottom-to-top reading, bold `--text2` caption and ticks, assertion 41. |
| T11.27.2 | I-148 | DONE | TL028 | MDL: `⤓ CSV` in the right action group before PNG, full-window six-row serializer with BOM and compliant filename; hidden when no table rows. |
| T11.27.3 | I-148 | DONE | TL028 | MDL: centre and rotate the caption, switch caption + ticks to bold `--text2`. |
| T11.27.4 | I-148 | DONE | TL028 | Harness and shell checks, rebuild, suites, live verification and records. |

**Evidence.** Spec revision row 1.104 in both byte-identical copies (SHA-256
`10B2618DA63ABC43F4B763E657F6B88731DA176895B14F0E6E9C261B2F0E5945`) with centred near-axis
caption, bottom-to-top reading, bold `--text2` caption and ticks, assertion 41. Issue `I-148` in
`MDL/log/issue_log.md` revision 1.25. `node build.mjs` rebuilt `MDL-Dashboard.html` at 302,241 B.
Live: caption offset 0 px from gutter centre, 3 px inset, `font-weight:700` caption and ticks,
180° rotation; downloaded `TWRP-C3B2_Issue-Progress-Table_2026-11-24.csv` with BOM and 7 lines.
Screenshot `harness-layout/run-mdl-i148-ycap.png`. `test_shell.mjs` 110 passed / 0 failed;
pipeline 96 / 7 and grid 42 / 1 at baseline; harness 218 passed / 10 failed / 2 advisory / 22
skipped with the 10 failures identical to HEAD baseline and the new CSV-order check passing.
See `U027` and `TL028`.

### 11.28 — ONE table-header design for every table type (spec rev 1.105, I-149)

**Owner review (2026-11-24).** Chart-attached tables must follow the independent table design.
The header is now `--navy` with white text for every table type. Chart-specific alignment, the
10 px plot-to-table gap, board fit, vertical month headers, column sync and per-table CSV are
unchanged. Historical state: attached header `rgb(241,245,249)` / `--text2` vs independent
`rgb(15,45,82)` / white.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.28.1 | I-149 | DONE | TL029 | Spec rev 1.105: shared header design for all table types, rev 1.103 light variant superseded, assertion 40 rewritten. |
| T11.28.2 | I-149 | DONE | TL029 | MDL scoped header CSS and PNG/Copy export use resolved navy fill with white text. |
| T11.28.3 | I-149 | DONE | TL029 | Harness boardTable expected fill / text and shell checks updated. |
| T11.28.4 | I-149 | DONE | TL029 | Rebuild, suites, live verification and records complete. |

**Evidence.** Spec revision row 1.105 in both byte-identical copies (SHA-256
`FBBEF9EE5FB513EB12CC5B70FDF77DF7A235B2264E394AF3891FC2AC4BD16646`). Issue `I-149` in
`MDL/log/issue_log.md` is RESOLVED. Scoped CSS sets `--navy` fill and white text on
`.curve-c1-table thead th`; PNG / Copy export resolves the same token and writes white header text.
Harness `boardTable` config expects `--navy` and `rgb(255, 255, 255)`.
Build: 302,295 B. Syntax PASS. Shell 110 passed / 0 failed; pipeline 96 / 7 and grid 42 / 1 at
baseline. Harness 218 passed / 10 failed / 2 advisory / 22 skipped; the 10 failures are identical
to the I-148 baseline. All seven attached-table board checks pass. Live browser measurement:
attached `rgb(15, 45, 82)` / white; independent `rgb(15, 45, 82)` / white; token `--navy` resolves
to `rgb(15, 45, 82)`. Recorded in `U028` and `TL029`.

### 11.29 — Chart column centers match attached-table column centers (spec rev 1.106, I-150)

**Owner review (2026-11-25).** Enhance the spec and harness check, log the issue and fix it.
An attached-table chart column MUST be centered on the matching table header. The tolerance is
2 px. MDL is in scope for geometry; rev 1.74 still excludes MDL from two-way sync state.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.29.1 | I-150 | DONE | TL030 | Spec rev 1.106 in both copies: general center rule, MDL geometry clarification, assertion 42. |
| T11.29.2 | I-150 | DONE | TL030 | MDL render and export use the real plot width so the SVG does not scale below the table tracks. |
| T11.29.3 | I-150 | DONE | TL030 | Harness `boardTable` center check and config; shell checks updated. |
| T11.29.4 | I-150 | DONE | TL030 | Rebuild, suites, live verification and records complete. |

**Evidence.** Spec revision row 1.106 in both byte-identical copies (SHA-256
`48DE0BE7D04E5DFCD88AADB9EFE270E3407964C4F6057EEB4417423080B9ECDB`). Issue `I-150` in
`MDL/log/issue_log.md` is RESOLVED. `curveChart()` uses the supplied width; `curvePlotWidth()`
passes `st.plot.clientWidth` in both `curveDraw()` and `curveExportMarkup()`. Board config adds
`centerBandSelector` and `centerTolerance:2`. Build: 302,450 B. Syntax PASS. Shell 111 passed /
0 failed; pipeline 96 / 7 and grid 42 / 1 at baseline. Harness 219 passed / 10 failed / 2 advisory
/ 22 skipped; the 10 failures match the baseline. All eight board-contract checks pass.
Live at 1440 px, 31 months: `viewBox` 451, SVG width 451, scale 1; center deltas `+0.02`, `+0.23`,
`+0.16 px` at columns 0, 15 and 30. PNG download `TWRP-C3B2_Issue-Progress_2026-11-25.png`.
Recorded in `U029` and `TL030`.

### 11.30 — Overdue List layout conformance (I-151 … I-159)

**Owner approval (2026-11-25).** "approved. log and fix the issues. make sure run harness layour check."
The review found nine differences in the Overdue List panel. The panel title row held table controls.
Filters and actions shared one group. CSV stayed visible for an empty result. The table had no
pagination above 200 rows. Document identity columns were not adjacent and could shorten. Date and
status columns aligned left. The control gap was hard-coded. Help text did not match the live panel.
The grid used one global 60 px minimum.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.30.1 | I-151 | DONE | TL031 | Put the table and its controls in one `.overdue-card` with a `.toolbar.overdue-tools`. Keep only Help and Collapse in the panel head. |
| T11.30.2 | I-152 | DONE | TL031 | Split filters left and actions right with `.tool-filters` and `.tool-actions`. |
| T11.30.3 | I-153 | DONE | TL031 | Hide `⤓ CSV` when the filtered row count is zero. Keep full filtered export. |
| T11.30.4 | I-154 | DONE | TL031 | Add 200-row pages with Previous / Next using `data-ov-page`, not `data-page`. |
| T11.30.5 | I-155 | DONE | TL031 | Move `Document Title` next to `Document No.`. Set wider defaults and per-column minimums. |
| T11.30.6 | I-156 | DONE | TL031 | Add one alignment helper. Dates and numbers use `.num`; statuses use `.enum`. |
| T11.30.7 | I-157 | DONE | TL031 | Use `--tool-pad` and `--tool-gap`. Keep the matrix selector exact. |
| T11.30.8 | I-158 | DONE | TL031 | Update help text for sort, pagination and full filtered CSV export. |
| T11.30.9 | I-159 | DONE | TL031 | Let `makeGrid()` read `c.min` before the grid minimum. |

**Evidence.** Build: 302,980 B. Shell 117 passed / 0 failed. Grid 42 passed / 1 pre-existing
I-71 spec-text failure. Pipeline 96 passed / 7 pre-existing workbook-data failures. Layout harness
219 passed / 10 failed / 2 advisory / 22 skipped. The 10 failures match `harness-layout/run-mdl-i149.txt`
exactly. The passed count rises from 218 to 219 because later revisions added one board-contract check.
The full jsdom render suite reached the Node heap limit at 4 GB and again at 8 GB and produced no result.
This is the known full-workbook jsdom limit, not a dashboard render error. Recorded in `U030` and `TL031`.
I-121 stays open for pagination on other bounded tables.

### 11.31 — Validation page redesign (I-160)

**Owner approval (2026-11-25).** "1. new issue / 2 to 5. approved." The review compared the SUB
Validation page, shared spec §4.5 and assertion 36 with the MDL Validation page. SUB already used two
independent panels. MDL still used one panel with a collapsed rules drawer and no chip subtitles.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.31.1 | I-160 | DONE | TL032 | Add `validationRulesPanel` and `validationIssuesPanel` as top-level Validation panels. Number them 6 and 7. |
| T11.31.2 | I-160 | DONE | TL032 | Add pchip tokens for five themes and one chip subtitle row per panel. Put `data-validation-count` on `Shown issues`. |
| T11.31.3 | I-160 | DONE | TL032 | Convert Rule Reference to a five-column grid table with CSV and Columns in a card tool row. |
| T11.31.4 | I-160 | DONE | TL032 | Move issue controls into a card tool row. Filters and pager left, CSV and Columns right. |
| T11.31.5 | I-160 | DONE | TL032 | Replace issue windowing with 200-row pages, Previous / Next and page jump. Export all filtered rows. |
| T11.31.6 | I-160 | DONE | TL032 | Remove the validation `<details>` and panel note. Move long explanation, D33 and export scope to Help. |
| T11.31.7 | I-160 | DONE | TL032 | Pin Severity and Rule. Set Message width to 360 px. Enable the harness validation count hook. |

**Evidence.** Build: 306,026 B. Shell 119 passed / 0 failed. Grid 42 passed / 1 baseline I-71
failure. Pipeline 96 passed / 7 baseline workbook-data failures. Full render 182 passed / 195, with
13 stale or outside-scope failures. Layout harness 225 passed / 12 failed / 2 advisory / 20 skipped.
The baseline 10 failures remain. The new validation count check reports DOM 16641 against ground
truth 15888. This is the same harness state mismatch that drives the KPI 7631 / 7445 failure.
It does not show a Validation defect. Recorded in `U031` and `TL032`. A separate harness
ground-truth issue is proposed. I-121 stays open for pagination on other bounded tables.

### 11.32 — One zebra token for every table (I-161)

**Owner approval (2026-11-25).** "approved." The owner decided that all MDL tables must use the same
zebra token, with the color adjusted per theme. The Document Detail row background is the reference
design and already matches the UI spec.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.32.1 | I-161 | DONE | TL033 | Add `--ds-zebra` with five theme values. Default uses the Document Detail `#F9FBFD` value. |
| T11.32.2 | I-161 | DONE | TL033 | Apply the token to generic rows, `.ds-table`, matrix rows, C1 attached table cells and pinned even cells. |
| T11.32.3 | I-161 | DONE | TL033 | Set pinned odd cells to `--surface`. Remove `.ds-table .over` and the `over` row class. |
| T11.32.4 | I-161 | DONE | TL033 | Keep matrix subrows, TOTAL and current-month tint as semantic exceptions. Align export colors with live theme tokens. |
| T11.32.5 | I-161 | DONE | TL033 | Add shell and browser checks for token values and effective row backgrounds across all five pages. |

**Evidence.** Build: 306,700 B. Shell 125 passed / 0 failed. Grid 42 passed / 1 baseline I-71
failure. Pipeline 96 passed / 7 baseline workbook-data failures. Full render 183 passed / 196, with
13 stale or outside-scope failures. Layout harness 226 passed / 12 failed / 2 advisory / 20 skipped.
The new browser check `I-161: every body table uses the shared --ds-zebra colour` passes. Recorded in
`U032` and `TL033`. I-121 stays open for pagination on other bounded tables.

### 11.33 — Harness ground truth and L3 table discovery (I-162)

**Owner approval (2026-11-25).** "approved." The harness dropped 186 records with a blank discipline.
It selected the wrong filter chip because a case-insensitive substring matched `Electrical` for `ICA`.
It measured L3 tables only on the active page, so it missed four MDL grid tables.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.33.1 | I-162 | DONE | TL034 | Keep blank discipline in `fullDisc`. Add `filterDisc` for named UI chips. |
| T11.33.2 | I-162 | DONE | TL034 | Select filter chips by exact label text. |
| T11.33.3 | I-162 | DONE | TL034 | Sweep all MDL pages before L3 checks and restore the active page. |
| T11.33.4 | I-162 | DONE | TL034 | Use global table indexes and grid keys. Add `pinnedGridKeys` for MDL. |
| T11.33.5 | I-162 | DONE | TL034 | Measure rendered cells during resize and restore original DOM and storage values. |

**Evidence.** Layout harness 236 passed / 2 failed / 2 advisory / 24 skipped. The two failures are
the pre-existing Tier 1 shell-zone string checks. Validation count, KPI total, filter ICA, pinned
grid tables, resize grips and all four drag / persist checks pass. Fixed-layout width-restore
measurement is skipped because table-layout:fixed redistributes widths. Recorded in `U033` and
`TL034`. No dashboard build change. I-121 stays open for pagination on other bounded tables.

### 11.34 — Validation Rules resize alignment and header-label minima (I-163)

**Owner approval (2026-11-25).** "approved." Validation Rules could desynchronise its split header
during resize, and the old global 60 px floor did not guarantee that every header label stayed visible.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.34.1 | I-163 | DONE | TL035 | Add content-aware minima from type floor + rendered header-label width + glyph allowance. |
| T11.34.2 | I-163 | DONE | TL035 | Make the persisted-width flag live and reset-aware. |
| T11.34.3 | I-163 | DONE | TL035 | Add grow-to-fill and keep shrink-to-fit; fit only on a container change. |
| T11.34.4 | I-163 | DONE | TL035 | Write the clamped width to both colgroups during resize. |
| T11.34.5 | I-163 | DONE | TL035 | Use one cell per visible column in the rules empty state. |
| T11.34.6 | I-163 | DONE | TL035 | Add harness checks for header/body alignment after resize and header-label visibility. |

**Evidence.** Build 309,831 B. Shell 125 passed / 0 failed. Grid 44 passed / 1 baseline I-71 failure.
Full render 184 passed / 13 stale failures. Layout harness 241 passed / 2 failed / 2 advisory /
24 skipped. The two harness failures remain the pre-existing Tier 1 shell-zone string checks.
Recorded in `U034` and `TL035`. I-121 stays open for pagination on other bounded tables.

### 11.35 — Welcome page to spec §3.7 rev 1.107 (I-164)

**Status: DONE 2026-11-26.** Owner instruction (2026-11-26): update the UI spec first, then implement the
welcome page for MDL, PPP and Sub in sequence. MDL is first. Shared design plan:
`common/workplan/Welcome-Page-Workplan.md` (WP-WELCOME-001), phase W3. This section is the MDL implementation plan. Mode: `auto` — one file (Master
Document List), the load starts after the Code-sheet check, no Load button.

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.35.1 | I-164 | DONE | TL036 | Added the welcome config in `MDL/config/ui_help.json`: title, instruction, `files[1]`, mode `auto`, phases, help text. |
| T11.35.2 | I-164 | DONE | TL036 | `boot()` calls `CommonWelcome.render()`: one heading, one instruction, one file slot, `Choose file` in the drop area, footer, help link. |
| T11.35.3 | I-164 | DONE | TL036 | `inspect()` reads the Code sheet and checks `Dashboard Title` before the full read (R3). |
| T11.35.4 | I-164 | DONE | TL036 | Three load phases render with `aria-busy` and reduced-motion support (R4). |
| T11.35.5 | I-164 | DONE | TL036 | Common CSS is token-only. `.cw-screen` is fixed with `overflow:auto`. |
| T11.35.6 | I-164 | DONE | TL036 | Tests updated; Tier 7 and check 51 enabled; standalone HTML rebuilt. |

| T11.35.7 | I-164 | DONE | TL036 | `build.mjs` calls `inlineCommon({ modules: ['welcome'] })`; common CSS and JS precede MDL code; `common-version` meta written. |
| T11.35.8 | I-164 | DONE | TL036 | Old `.welcome*` CSS and `boot()` markup archived in `MDL/archive/`, then removed. |
| T11.35.9 | I-164 | DONE | TL036 | Added the `welcome` block to `harness-layout/checks/mdl.mjs` (`mode: 'auto'`, `files: 1`). Created `MDL/knowledge.json` and recorded CommonWelcome 1.0.1. |
| T11.35.10 | I-164 | DONE | TL036 | Closed I-164; updated MDL logs, workplan and shared status row. |

**Before start.** Checked `src/render.mjs` for open changes from I-146…I-150. Those items are closed.
**Result.** Common test 32 passed / 0 failed with welcome 1.0.2 (C-03). MDL shell 125 passed / 0 failed. MDL render 186 passed / 13 pre-existing failures. MDL harness 269 passed / 2 failed / 2 advisory / 24 skipped. Tier 7 assertions 43–50 and check 51 all pass. See `U037`, `U038`, `TL036` and `TL037`.
**Success.** Met. No new test failures. The two harness FAIL lines are the Tier 1 shell-zone baseline.

### 11.36 — Welcome 1.2.0, two-column card (I-165)

**Status: DONE (2026-11-27).** Owner approval 2026-11-27. Shared plan: `common/workplan/Welcome-Page-Workplan.md`
phase W3.1 (decisions D14, D16–D18). Spec §3.7 rev 1.111; common welcome 1.2.0 (common `C-04`, `C-06`; `C-05` superseded). Re-scoped 2026-11-27 from 1.1.0 to 1.2.0 (owner reference picture).

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.36.1 | I-165 | DONE | — | `src/render.mjs` rev 1.2: the welcome `load` handler returns `() => renderDashboard(root, model)` so the module shows the success hold first. |
| T11.36.2 | I-165 | DONE | — | `config/ui_help.json` 1.1: `successHoldMs: 1500`; instruction "Load the project workbook to start."; help "What file do I need?". |
| T11.36.3 | I-165 | DONE | — | `test/test_render.mjs` rev 1.3: drop-area and slot-list patterns follow the 1.1.0 markup (`cw-box cw-drop`, slot-list modifier). `harness-layout/checks/mdl.mjs`: `welcome.extraFile` = the Submittal Log workbook. |
| T11.36.6 | I-165 | DONE | — | `config/ui_help.json` 1.2: `description`; `checks[]` = the two checks the inspect handler runs (readable workbook; Code-sheet Dashboard Title); instruction; Help text. No brand text. |
| T11.36.7 | I-165 | DONE | — | `test/test_render.mjs` rev 1.4: Choose may carry `btn-primary`; footer inside the task panel; Help in the top bar; three steps with one current; check list; Choose primary before any file. |
| T11.36.4 | I-165 | DONE | TL038 | Run `node common/test/welcome.test.mjs` (expect 70 / 0), `node MDL/build.mjs`, the MDL suites and `node harness-layout/harness.mjs --dashboard mdl`. |
| T11.36.5 | I-165 | DONE | TL038 | Close-out: MDL issue, update and test logs; `knowledge.json` common 1.2.0; this section; W3.1 row; close common `C-04`, `C-05` (superseded) and `C-06`. |

**Success.** Met (TL038): common 70 / 0, render 190 / 13 (baseline), shell 125 / 0, harness 281 / 2 (baseline). Target was: common tests 70 / 0; MDL render, shell, pipeline and grid at their baselines; harness Tier 7 (43–53)
and check 51 pass, with only the two Tier 1 shell-zone baseline failures.

### 11.37 — Theme system rework: chrome tokens, six themes, welcome theme picker (I-166)

**Status: IN_PROGRESS.** Owner approval 2026-11-28. Shared plan: `common/workplan/Theme-Rework-Workplan.md`
(WP-THEME-001) W3. Spec §6 / §8.2 assertion 54 rev 1.114; `AGENTS.md` §18.4 rev 2026-11-28; common `tokens`
1.0.0 (new module) and common welcome 1.4.0 (common `C-08`).

| Task | Issue | Status | Tests | Work |
|---|---|---|---|---|
| T11.37.1 | I-166 | DONE | — | `src/render.mjs` rev 1.5: `boot()` calls `applyShellPrefs()` before `CommonWelcome.render()` (T1). Theme keys renamed `navy`/`sepia` -> `sky`/`ocean`/`presentation`; `#themeSel` options updated; unrecognized saved values fall back to `light`. |
| T11.37.2 | I-166 | DONE | — | `src/render.mjs`: local `:root` reduced to the ~37 MDL-only tokens; the shared ~45-token set, 12 `body[data-theme=...]` blocks, `--pchip-*` and `--ds-zebra` removed in favor of the inlined `common/tokens/tokens.css` (T2–T4). |
| T11.37.3 | I-166 | DONE | — | `src/render.mjs`: all 80 in-scope hard-coded hex literals in component rules repointed to tokens (2 left by design: a code comment, an intentional `@media print` rule). |
| T11.37.4 | I-166 | DONE | — | `common/tokens/tokens.css` 1.2.0: added 6 new status-family tokens (`--accent-purple`, `--badge-bg`, `--status-amber2-*`, `--status-neutral-*`, `--status-neutral2-*`, `--status-purple-*`) and the migrated `--pchip-*` / `--ds-zebra` set, all 36 new fg/bg pairs verified >= 4.5:1 (>= 3:1 border-only) before writing. `tokens.schema.json` 1.2.0. |
| T11.37.5 | I-166 | DONE | — | `src/render.mjs`: `COLORS`/`PALETTE` kept as fallback tables only; new `CHART()`/`CHART_SERIES()` helpers resolve colors from the live theme via `getComputedStyle` at paint time (T5), same pattern as the existing `curveExportMarkup()`. |
| T11.37.6 | I-166 | DONE | — | `build.mjs` rev 1.2: `inlineCommon({modules:['tokens','welcome']})`. `common/manifest.json` 1.4.1: `welcome` -> 1.4.0. `harness-layout/checks/mdl.mjs` rev 1.4: `themes: {}` block un-SKIPs Tier 8. |
| T11.37.7 | I-166 | OPEN | — | Run `node common/test/tokens.test.mjs`, the full common suite, `node MDL/build.mjs`, and `node harness-layout/harness.mjs --dashboard mdl`; confirm Tier 8 (54) passes and no regression beyond the existing baseline. |
| T11.37.8 | I-166 | OPEN | — | Close-out once T11.37.7 passes: MDL issue/update/test logs; `knowledge.json`; this section; close common `C-08`. |

**Target.** common `tokens.test.mjs` all pairs AA pass; common suite at or above its current baseline; MDL
render/shell/pipeline/grid at their baselines; harness Tier 8 (assertion 54) passes for all six themes with
no new FAIL beyond the existing Tier 1 shell-zone baseline.

