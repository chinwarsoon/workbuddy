# Submittal Dashboard — Approved Developer Workplan

| Revision | Date | Author | Summary |
|---|---|---|---|
| 2.27 | 2026-10-26 | CodeBuddy (AI) | Implemented T15.3 and T15.6 (D38). T15.3 splits the C3 Breakdown into two side-by-side vertical-bar charts (Submissions: First Submission, Resubmission, Under Review; Approval Status: APP/AWC/NAP/REJ/INF), both vertical; the former bar/ring toggle is replaced by the two-chart layout. T15.6 implements the D38 Under Review rule: `c3UnderReviewD38` counts every `SUR` row up to and including the as-of month, then deducts First Submission and Resubmission rows in the as-of month. Resolves `issue_log.md` I049 and I052; pipeline and render suites pass 34/34 (TEST-018). |
| 2.28 | 2026-10-26 | CodeBuddy (AI) | Refined the All-months C3 summary (D36/D38/Wave 4.2) per owner confirmation. All-months Submissions use Option A (First Submission = documents with no resubmission; Resubmission = documents with ≥1 resubmission, each document once); Approval Status uses the first approval per document; Under Review for All months is currently open documents (D34) shown as SUR in the Approval ring, so it is never double-counted with Submissions; blank Document No. rows are excluded. D38 now applies to a specific month only. These rules also drive T15.4 (Pie/Ring full-set: two concentric rings, both totalling the distinct-document count). T15.3's All-months view is refined by the same rules; T15.4 is in progress. |
| 2.29 | 2026-10-26 | CodeBuddy (AI) | Completed T15.4 (Pie/Ring full-set view). `c3PieSVG` draws two concentric rings that ignore the Break-down-by toggle and use the discipline set for all disciplines: outer = Submissions (First Submission + Resubmission; for a specific month adds Under Review as a third segment), inner = Approval Status (APP/AWC/NAP/REJ/INF + SUR for All months). Both All-months rings total the distinct-document count (equal-total rings). All-months shows percentages in the legend; a single month shows counts only. Verified by the corrected T15.4 test; pipeline and render suites pass 34/34 (TEST-018). Resolves I050. |
| 2.30 | 2026-10-26 | CodeBuddy (AI) | Completed T15.5 (C3 table below the charts, full width). `.c3-body` is now a vertical flex stack: the chart board (`c3-board`) on top and the summary table (`c3-summary`) below at full panel width, replacing the former side-by-side grid. The `breakdown` comment is updated. A new T15.5 render test asserts the table sits below the chart board and is the single full-set table. Pipeline and render suites pass 35/35 (TEST-018). Resolves I051. |
| 2.35 | 2026-10-27 | CodeBuddy (AI) | Resolved I056 (C3 controls / pie redesign):
| 2.36 | 2026-10-27 | CodeBuddy (AI) | Resolved I057 (C3 full MDL discipline set + per-card attached table):
| 2.37 | 2026-10-27 | CodeBuddy (AI) | Resolved I058 (regression):
| 2.38 | 2026-10-27 | CodeBuddy (AI) | Resolved I059: the shared C3 Breakdown summary table gained a Download button exporting it as CSV (`data-c3export` → `exportC3TableCsv`, reads the rendered `.c3-summary` rows from the DOM, skips `.ds-gut`, BOM for Excel). Render and pipeline suites pass 37/37 (TEST-018); standalone HTML rebuilt. C3 Bar card PNG/Copy buttons did nothing after the I057 div-grid redesign (export serialized a non-existent `<svg>`). Added `c3CardToSvg(btn)` (native-SVG reconstruction of the card: bars + vertical axis labels + attached table + legend) and routed `serializeC3Svg` / `exportC3Png` through it; `exportC3Png` sizes from `naturalWidth`/`naturalHeight`. PNG/Copy now work for Bar and Pie. Render and pipeline suites pass 37/37 (TEST-018); standalone HTML rebuilt. the C3 Submissions and Approval Status cards now list every MDL discipline (and every known submitter) even when a month has zero, so empty disciplines still appear; each card draws its bars inside one aligned CSS grid (bars + vertical axis labels + an attached data table) so every column lines up. Submissions table = Total Plan / First Submission / Resubmission / Under Review; Approval table = the codes. The shared summary table (c3Table) is kept (Q8). Render and pipeline suites pass 37/37 (TEST-018); standalone HTML rebuilt. the C3 panel now uses one shared control cluster (Month + Break-down-by, hidden in Pie view) beside the charts; the Pie view renders the two cards (Submissions, Approval Status) as their own donuts instead of a consolidated two-ring card. The constant-bar-width bars are unchanged. Render and pipeline suites pass 37/37 (TEST-018); standalone HTML rebuilt. |
| 2.40 | 2026-10-28 | CodeBuddy (AI) | Enhanced the C3 Breakdown spec (§4.2, revision 1.34) with y-axis grid lines + numbers matching C1/C2, and re-synced the harness bundled spec from the root. Decision logged as I060; UI implementation tracked as T16.8. See spec revision 1.34.
| 2.43 | 2026-10-28 | CodeBuddy (AI) | Resolved I061: the C3 All-months `Total Plan` now sums planned 1st issues only for months ≤ `model.meta.asOfDate` (matching `view.c1.asOf`), excludes blank-month (unscheduled) plans, and returns 0 when as-of is empty; a specific month still counts only its own planned 1st issue. `render.js` `planCount` (one fix point covers the bar card and summary table). Render suite rewrote the Total Plan assertion; 37/37 pass (TEST-018); standalone HTML rebuilt.
| 2.43 | 2026-10-28 | CodeBuddy (AI) | Fixed I064 and refined the C2 Funnel (D40) per owner review of the first live render. I064: the funnel had never rendered — `c2Funnel`'s stage key `underReview` did not match `c2.funnel`'s `inReview`, so `widthOf(undefined)` produced `NaN` coordinates and every band had no geometry; the stage key is now `inReview`. Refinement (I065): stage names + values moved to a left label gutter (right-aligned, theme-aware) so long names never clip; the separate legend row is removed; Approved is a solid 92 px square block (owner request) instead of a sliver-wide 3D cube; funnel column widened to 350 px; the per-discipline table sizes to its content (`width:auto`). UI spec §4.2 rev 1.36; issue log 0.60; standalone HTML rebuilt; suites pass. |
| 2.42 | 2026-10-28 | CodeBuddy (AI) | Recorded the C3 All-months `Total Plan` business rule (I061) in §3.3.2: a specific month counts only its own planned 1st issue; All months is cumulative up to `view.c1.asOf` (excludes blank/unscheduled plans and returns 0 when as-of is empty, since the Submittal-Log evaluation only reaches the current month and a full-project denominator would hide ahead/late detail). Task T16.9 tracks the engine fix.
| 2.41 | 2026-10-28 | CodeBuddy (AI) | Resolved I060: the C3 Breakdown bar cards now draw a y-axis with 5 horizontal grid lines at a nice max and right-aligned tick numbers in the metric-label column (matching C1/C2); bars scaled to the nice max. `render.js` `c3StackedCard` + `dashboard.css`; render suite adds the assertion; 37/37 pass (TEST-018); standalone HTML rebuilt.
| 2.34 | 2026-10-27 | CodeBuddy (AI) | Resolved I055 (panel grid follows browser zoom): the panel grid (`.panel-grid`) now reflows on zoom like the KPI `auto-fit` grid. `.panel` is `min-width:0`; tracks are `minmax(0,1fr)`; `@media` breakpoints drop columns (3→2→1 for `three`, 2→1 for `two`) as the width shrinks, with `data-layout` as the maximum count. The shell, KPI cards, charts and the split-header table (I054) already followed the screen; the C3 stacked-bar chart stays fixed-width by requirement (spec §3.4.1). Pipeline and render suites pass 36/36 (TEST-018); standalone HTML rebuilt. |
| 2.33 | 2026-10-27 | CodeBuddy (AI) | Resolved I054 (table follows browser zoom): the shared split-header table (§7.2.15) now also follows browser zoom (Control + mouse scroll). The I053 fix used only `ResizeObserver`; a `window` / `visualViewport` resize listener re-runs every table's `syncWidth`, rescaling the cached column widths to the new screen scale so the table fills the panel like the KPI reference. The shell, panel grid, KPI cards and charts already followed the screen; the C3 stacked-bar chart stays fixed-width by requirement (spec §3.4.1). Pipeline and render suites pass 36/36 (TEST-018); standalone HTML rebuilt. |
| 2.39 | 2026-10-27 | CodeBuddy (AI) | Redesigned the C2 Submission Flow & Delay panel (D40). The Stacked view is now a time-river stacked area (Variant 1 of `sub/ref/C2-TimeFlow-Sample.html`): one band per status over a month (time) x-axis, row-level per-month counts, planned-sourced NFS, non-cumulative. Added the Delay (monthly average `Review Delay Days`) and Funnel (Submitted → In Review → Returned → Approved) views behind a Stacked/Delay/Funnel toggle, an Include NFS toggle, in-SVG legend, Start/Today markers, hover snap line + floating window, and PNG/Copy. Engine: `deriveView` builds the `c2` object (monthly status split + planned-not-submitted NFS by planned first-issue month + funnel); `render.js` adds `c2StackedSVG` / `c2DelaySVG` / `c2Funnel` / `submissionFlow`; `dashboard.js` wires `c2View` / `c2Nfs` state and handlers. Counting rule confirmed against the engine: band height = submission-record (row) count per month, not distinct `Document No.`, not cumulative. NFS is computed from the plan, not read from the log's cached NFS array-formula column (issue I029). |
| 2.40 | 2026-10-28 | CodeBuddy (AI) | Refined the C2 Funnel view (D40) per owner rules and the `sub/ref` funnel sample. The funnel is now a four-stage document pipeline: Planned Deliverables (MDL planned rows, D11 — each row one planned document, repeated numbers separate, dated or not) → Submitted for Review (distinct `Document No.` with ≥1 submission row, D34) → In Review (latest `SUR` and no `Actual Return Date`, D34 guard kept) → Approved (first approval per document, `APP`/`AWC`, the C3 All-months rule, distinct from KPI 4 any-row). A per-Discipline table with a Total row repeats the four measures. `deriveView` `c2.funnel` now returns `planned`/`submitted`/`inReview`/`approved` plus `byDisc`; `c2Funnel` renders the four bars, a legend, and the table. Workplan D40 updated; standalone HTML rebuilt. |
| 2.41 | 2026-10-28 | CodeBuddy (AI) | Revised the C2 Funnel view (D40) per owner review of the `sub/ref` funnel sample. The funnel is now a vertical shape to the right of a per-discipline table: its top aligns with the first discipline row and its bottom — a cube for Approved — aligns with the last discipline row. Five stages: Planned Deliverables → Submitted for Review → Under Review → AWC → Approved, with AWC separated from Approved by the document's first-approval code (APP vs AWC). "In Review" relabelled "Under Review" in the funnel stage and table header. Band widths use square-root compression to avoid slim segments on large value ratios. `deriveView` `c2.funnel` now returns `planned`/`submitted`/`inReview`/`awc`/`approved` plus `byDisc`; `c2Funnel` renders the two-column layout, trapezoid funnel body and cube, and `renderDashboard` aligns the funnel to the discipline rows after insertion. UI spec §4.2 (rev 1.35) updated for the layout; standalone HTML rebuilt. |
| 2.32 | 2026-10-27 | CodeBuddy (AI) | Resolved I053 (panel width follows the screen). The shared split-header table (§7.2.15) kept its first-render pixel width and did not follow a screen-scale / window-width change; `wireSplitHeaders` `syncWidth` now scales the cached column widths to the new container width on resize, keeping manual drag ratios and the pinned-column offset aligned. The shell, panel grid, KPI cards and most charts already followed the screen; the C3 stacked-bar chart stays fixed-width by the constant-bar-width requirement. Pipeline and render suites pass 36/36 (TEST-018); standalone HTML rebuilt. |
| 2.31 | 2026-10-27 | CodeBuddy (AI) | Applied the C3 card split (Option 2, matching the MDL interactive-chart pattern). The Bar view now renders two bordered cards — Submissions and Approval Status — each owning its controls (month, Break-down-by, PNG, Copy) and drawing a STACKED vertical-bar chart with a constant 28 px bar width and inclined (rotated) x-axis labels (fixes the overlapped category titles). A panel-level Bar/Pie toggle keeps the T15.4 full-set pie available as a single card. Removed the former grouped-bar helpers (`c3VBar`/`c3BarSVG`) and the shared `c3-board` wrapper. Dashboard wiring scopes PNG/Copy to the clicked card. Pipeline and render suites pass 36/36 (TEST-018). |
| 2.26 | 2026-10-26 | CodeBuddy (AI) | Planned Wave 4.2 — C3 Breakdown panel revision (D38). Split the panel into two side-by-side vertical-bar charts (Submissions: First Submission, Resubmission, Under Review; Approval Status: APP/AWC/NAP/REJ/INF), make the Pie/Ring view summarise all disciplines, and move the data table below the two charts at full width. Under Review deducts First Submission + Resubmission in the same month. Logged I049–I052; tasks T15.3–T15.6 planned. Awaits owner review and approval before implementation. |
| 2.25 | 2026-10-26 | CodeBuddy (AI) | Implemented the D37 discipline correction (T15.1 + T15.2). T15.1 derives each submission's discipline from the MDL join on `Document No.` and drops the section-header rule; orphan rows get `Unknown` and raise V-29. T15.2 adds `Unknown` to the Discipline filter list, default set and `deriveView` fallback so unlinked rows stay counted. Resolves `issue_log.md` I047 and I048; pipeline and render suites pass 33/33 (TEST-017). |
| 2.24 | 2026-10-25 | CodeBuddy (AI) | Recorded decision D37: a submission takes its discipline from the Master Document List join on `Document No.`, and the Submittal Log section markers are layout only. Updated §3.2, §3.3, §3.3.2, §4.1 and §5. See `issue_log.md` I047 and I048 for the engine and filter changes. |
| 2.23 | 2026-10-25 | CodeBuddy (AI) | Added the C3 Breakdown summary table (§3.3.2) below the chart: one row per dimension value plus a Total footer, in the shared `.ds-table` style (`table()` gained an optional `footer` argument). See `issue_log.md` I046 for the Submitter-view Total Plan limit. |
| 2.23 | 2026-10-25 | CodeBuddy (AI) | Added the C3 Breakdown summary table (§3.3.2) below the chart: one row per dimension value plus a Total footer, in the shared `.ds-table` style (`table()` gained an optional `footer` argument). See `issue_log.md` I046 for the Submitter-view Total Plan limit. |
| 2.22 | 2026-10-25 | CodeBuddy (AI) | Implemented the C3 Breakdown chart in the engine (D36): `deriveView` returns `c3`; `renderDashboard` draws two series per dimension value as bars or rings; added C3 state, handlers, export helpers and tokens. Build proof is in the Wave report. |
| 2.21 | 2026-10-25 | CodeBuddy (AI) | Recorded the C3 Breakdown approval-mix counting rules (D36, §3.3.2): two series per dimension value, never one stacked bar; New = first submission per `Document No.`, Resubmission = later rows. Demonstrated in `sub/archive/C3-Breakdown-Sample.html`. |
| 2.20 | 2026-10-25 | CodeBuddy (AI) | Updated the C1 four-series model to include the Forecast bar (`fNew`); decision D35 now reads (`pNew`, `fNew`, `aFNew`, `aRNew`). Clarified that Actual First / Actual Resubmission cumulative lines stop at the as-of bucket. |
| 2.19 | 2026-10-25 | CodeBuddy (AI) | Recorded the per-row delay business rule (§3.3.1, KPI 5 and 6): On-Time Return Rate and Avg Review Delay count each Submittal Log row, not grouped by `Document No.`, contrasting with KPI 3 and 4 (D34). |
| 2.18 | 2026-10-25 | CodeBuddy (AI) | Implemented D34 and V-32: Under Review and Approved KPI cards count distinct `Document No.`; a SUR row with an Actual Return Date is excluded and raises V-32. Resolves `issue_log.md` I022. |
| 2.17 | 2026-10-25 | CodeBuddy (AI) | Logged validation code V-32 (SUR with Actual Return Date). KPI cards Under Review and Approved will count per unique `Document No.`; engine changes are deferred to the next approved step. |
| 2.16 | 2026-10-24 | CodeBuddy (AI) | Documented KPI cards 1 and 2 business logic as §3.3.1; added the MDL 124 vs sub 116 reconciliation. §4.3 KPI table references §3.3.1. |
| 2.15 | 2026-10-24 | CodeBuddy (AI) | Added decision D33 (MDL owns blank-field validation; sub counts a row whose `Stage` is blank). Plan total moved to 7631; Stage filter lists `(blank)`, `Deleted`, `Void`, `Superseded`. See `issue_log.md` I023 to I030. |
| 2.1 | 2026-10-24 | CodeBuddy (AI) | Rebuilt the UI shell to the spec §18.2 layout with the MDL navy family; added the logo from `./asset/logo.jpg` and an MDL-style welcome card. Archived the prior non-compliant UI to `sub/archive/`. Data engine unchanged. |
| 2.14 | 2026-10-24 | CodeBuddy (AI) | Updated §4 so chart panels meet the spec (titles, Help, Collapse, sequential panel numbers). Added decision D31. |
| 2.13 | 2026-10-24 | CodeBuddy (AI) | Updated the title-bar page label to 16 px / 600 plain text. Added decision D30. |
| 2.12 | 2026-10-24 | CodeBuddy (AI) | Removed the content toolbar; the active page shows at the right of the title bar. Added decision D29. |
| 2.11 | 2026-10-24 | CodeBuddy (AI) | Sized the left panel to its menu titles (160 px). Added decision D28. |
| 2.10 | 2026-10-24 | CodeBuddy (AI) | Made the left panel hold menus only; Settings and Help pinned to the bottom. Added decision D27. |
| 2.9 | 2026-10-24 | CodeBuddy (AI) | Compacted the sidebar toggle to 27 px. Added decision D26. |
| 2.8 | 2026-10-24 | CodeBuddy (AI) | Aligned the title bar and menu bar with MDL (logo 36 px, spacing, padding). Added decision D25. |
| 2.7 | 2026-10-24 | CodeBuddy (AI) | Aligned the title bar and menu bar spacing with MDL. Added decision D24. |
| 2.6 | 2026-10-24 | CodeBuddy (AI) | Aligned the menu bar typography and alignment with MDL. Added decision D23. |
| 2.5 | 2026-10-24 | CodeBuddy (AI) | Brought the filter chrome to full MDL parity; moved Help to the left panel. Added decisions D19 to D22. |
| 2.4 | 2026-10-24 | CodeBuddy (AI) | Menu bar rebuilt for MDL parity: it is now one non-wrapping row, the filter triggers sit in a flex row and each carries a border and a caret, Load Workbook is the highlighted primary action, the Search popover follows MDL's `.tf-panel.search-panel` design, Settings moved to the left side panel as its own menu, and the side panel's workbook-loading section was removed in favour of the menu-bar Load Workbook button. The theme button is removed and the theme design deferred. Added decisions D17 and D18. |
| 2.3 | 2026-10-24 | CodeBuddy (AI) | Rebuilt global filters to the spec design (five multi-select triggers with count badges). Added decisions D15 and D16; corrected §4.1. Data engine unchanged apart from the multi-select filter state. |
| 2.2 | 2026-10-24 | CodeBuddy (AI) | Option B rebuild: adopted the MDL two-row header (navy title bar + white menu bar) + navy left navigation sidebar; removed the 48 px icon bar and the right sidebar; default theme is light. Updated `AGENTS.md` §18.2 and `Dashboard-UI-Design-Spec.md` §3.1/§3.2/§3.6 to the MDL shell so the dashboard is fully spec-conformant. Data engine unchanged. |
| 2.3 | 2026-10-24 | CodeBuddy (AI) | Hardened the welcome: spec `Dashboard-UI-Design-Spec.md` §3.7 now requires the MDL full-screen welcome overlay (hides chrome until load), the golden ratio (1 : 1.618) for fixed-proportion welcome surfaces, load buttons inside the file drop area, and no hardcoded project title (title renders from the loaded model). `AGENTS.md` §18.2 cross-references §3.7. Sub welcome rebuilt to match. Data engine unchanged. |
| 2.0 | 2026-10-24 | Codex | Completed Wave 4 dashboard UI, file loading, and browser layout checks. |
| 1.9 | 2026-10-24 | Codex | Reconciled Wave 3 records with the final 12-test run. |
| 1.8 | 2026-10-24 | Codex | Completed Wave 3 pipeline, validation, and calculated-field checks. |
| 1.7 | 2026-10-24 | Codex | Completed the universal knowledge graph schema and Wave 2 validation. |
| 1.6 | 2026-10-24 | Codex | Added the approved universal graph knowledge schema task for dashboard projects. |
| 1.5 | 2026-10-24 | Codex | Made `ui/`, `data/`, and `output/` optional; placed planned modules in `engine/` and help data in `config/`. |
| 1.4 | 2026-10-24 | Codex | Aligned the UI compliance gate with project-local assets. |
| 1.3 | 2026-10-24 | Codex | Recorded Wave 2 scaffold results and the missing shared schema blocker. |
| 1.2 | 2026-10-24 | Codex | Closed the stack reference and corrected the Wave 1 test-log summary. |
| 1.1 | 2026-10-24 | Codex | Completed Wave 1 records, including the not-applicable test-log entry. |
| 1.0 | 2026-10-24 | Codex | Approved Wave 1; selected the dashboard, server, and test stack. |
| 0.9 | 2026-10-24 | Codex | Clarified project-local tokens, shell markers, and layout harness coverage; recorded validation limits. |
| 0.8 | 2026-10-24 | Codex | Removed the dashboard common-assets dependency and aligned shell markers and harness checks. |
| 0.7 | 2026-10-24 | Codex | Aligned the dashboard shell and file flow with repository UI rules. Recorded the missing shared CSS/JS as a release dependency. |

> **Project**: TWRP C3B2 — Document Submittal Log Interactive Dashboard
> **Document ID**: SUB-WP-001
> **Version**: 2.3 (Option B shell + hardened welcome: MDL full-screen welcome overlay, golden-ratio drop area, load buttons inside drop, no hardcoded project title; spec §3.7 / AGENTS.md §18.2 updated; data engine unchanged)
> **Date**: 2026-10-24
> **Status**: Approved — Waves 1, 2, 2.1, 3, 4, 7, 8, and 9 (spec update + Option B rebuild + hardened welcome) complete; Wave 4.2 C3 panel revision complete (T15.3, T15.4, T15.5, and T15.6 complete and refined 2026-10-26); Wave 5 regression and Wave 6 owner review remain; Wave 4.1 discipline correction is complete. The dashboard uses the MDL two-row header + navy left navigation sidebar (spec `AGENTS.md` §18.2 / `Dashboard-UI-Design-Spec.md` §3.1, updated 2026-10-24): no icon bar, no right sidebar, light default, logo from `./asset/logo.jpg`. The welcome is a full-screen MDL overlay (no dashboard parts until load) with a golden-ratio drop area holding the load buttons and no hardcoded project title (spec §3.7). The earlier non-compliant UI is archived in `sub/archive/`. A static sample page is in
> `sub/archive/Document-Submittal-Dashboard-Sample.html`. The page is a review-only mockup. It is not
> wired to Excel.
> **Reference**: use the MDL Dashboard for data-pipeline logic where it applies. Follow `AGENTS.md`
> §18 and `Dashboard-UI-Design-Spec.md` for the UI shell and behavior.
> **Writing standard**: this document follows ASD-STE100 Issue 9 for its prose.

---

## 0. Contents

| § | Section |
|---|---------|
| 1 | Summary and Purpose |
| 2 | Guiding Principles |
| 3 | Excel Data Structure and Contract |
| 4 | Dashboard Modules |
| 5 | Validation Rules |
| 6 | Technical Architecture |
| 7 | Workplan (Waves) |
| 8 | Decisions Captured from Review |
| 9 | Open Questions and Assumptions |
| 10 | Future Enhancements |

---

## 1. Summary and Purpose

The dashboard gives a standalone summary of document submittals. It uses two workbooks.

1. **Master Document List (MDL)** — the full scope of documents to submit (forward plan).
2. **Document Submittal Log** — the submission history and status of each lodged document.

The dashboard shows submission counts, status mix, review turnaround, review delay, approval
outcome, and on-time performance. It also shows a coverage view. The coverage view shows how many
planned documents have a submission. It also shows the documents that are pending.

The dashboard will use the shell defined in `AGENTS.md` §18.2. It will use the icon bar, left and right
sidebars, content toolbar, scrollable content area, and full-width status bar. The left sidebar will
show navigation and file controls. The content toolbar will hold the page title and actions. A shared filter area in the content body will hold global filters.

The dashboard follows `AGENTS.md` §18.2 for shell geometry and behavior. It follows
`Dashboard-UI-Design-Spec.md` for project-local UI assets, panels, tables, and filter behavior.
Dashboard pages do not use `common/`. The pipeline uses native browser modules without a bundler. The local server uses Python standard-library modules, and Node.js runs tests. The user selects both workbooks for each load.

---

## 2. Guiding Principles

- **Spec-conformant**: the shell follows `AGENTS.md` §18. The dashboard panels, warning area, status values, and grids follow the shared dashboard spec.
- **One `active` set**: global dimensions make a single shared working set with S4 Derive (§7.2.7).
- **Side panel is navigation only**: it does not offer a global filter dimension again (§7.2.7 pt 5–6).
- **Local runtime**: the root HTML page loads local JavaScript modules and project-local UI assets. The user selects both workbooks for each load.
- **Archive before delete**: the existing `sub/ref/` Monthly Submissions prototype is kept. This is a
  new artifact, not an overwrite.

---

## 3. Excel Data Structure and Contract

Two source workbooks are in `sub/`:

- `TWRP C3B2 - Master Document List.xlsx`
- `TWRP C3B2 - Document Submittal Log.xlsx`

### 3.1 Master Document List (scope)

The workbook has 11 discipline sheets: `Project`, `Construction`, `QAQC`, `ICA`, `Process`, `BS`,
`Mech`, `Piping`, `Electrical`, `CSA`, and `BIM`. The sheet name is the discipline authority.
Column C is blank in most rows.

Columns (0-indexed, in `sub/ref/build_dataset.py`):

| Col | Field |
|---|---|
| A (0) | S.No |
| B (1) | Stage |
| C (2) | Discipline (blank; sheet name wins) |
| F (5) | System |
| H (7) | Project Prefix |
| I (8) | Doc Type |
| M (12) | Document No. |
| N (13) | Document Title |
| R (17) | Vendor |
| S (18) | Planned 1st Issue Date |
| T (19) | Forecast 1st Issue Date |
| U (20) | Actual 1st Issue Date |
| W (22) | Submission Status |
| Y (24) | Latest Approval Status |

### 3.2 Document Submittal Log (history)

Sheet `SubmittalLog`. The sheet carries four section-marker rows, found at rows 2, 84, 96 and 217:
`ICA`, `Electrical`, `Mechanical` and `Building Services`. A section-marker row has a blank `S.No` and a
blank `Document No.`, so it is not a record. The parser skips it and ignores its text. The discipline of
a submission comes from the Master Document List join (§3.3, D37), never from this column.

Columns:

| Col | Field |
|---|---|
| A (0) | S.No |
| B (1) | Prolog No. |
| D (3) | Subject (section-marker text — not used as data) |
| E (4) | Document No. |
| F (5) | Revision |
| G (6) | Submitted By |
| H (7) | Submission Date |
| I (8) | Review Period Days |
| J (9) | Target Return Date |
| K (10) | Actual Return Date |
| L (11) | Review Turnaround Days |
| M (12) | Review Delay Days |
| N (13) | Submission Status (SUR / RTR / NTS / NFS) |
| O (14) | Approval Status (APP / AWC / NAP / REJ / INF) |
| P (15) | Resubmission Required (YES / NO) |

Status code glossary (reused from `sub/ref/build_dataset.py`):
- Submission: `SUR` in SO review · `RTR` returned for resubmission · `NTS` no resubmission required
  · `NFS` not submitted (MDL only).
- Approval: `APP` approved · `AWC` approved with comments · `NAP` not approved · `REJ` rejected ·
  `INF` for information.

### 3.3 Join and derived fields

- Treat each MDL data row as one planned document record. Do not merge rows or remove repeated
  `Document No.` values.
- Treat each Submittal Log data row as one submission record. Keep all rows in the detail view and
  count each row in submission-record measures, except the `Documents Logged` KPI card, which counts
  each `Document No.` once (D32).
- Join on `Document No.` only when one MDL row has that value. If multiple MDL rows have the value,
  keep each planned row, report `V-26`, and mark the link as ambiguous. Do not assign the log row to
  any one of those MDL rows.
- A log row is an orphan (`V-29`) only when no MDL row has its `Document No.`.
- A row that serves as a section marker is not a record. It has a blank `S.No` and a blank
  `Document No.`, so the parser skips it. Its `Prolog Subject` text is never read as data.
- `Document No.`, trimmed and upper-cased, is the only key that relates a submission to its plan row
  and to every other row for that document. A detail lookup by `Document No.` returns the plan row and
  all of its submission rows, so one document shows one set of details on every surface.
- **The discipline of a submission (D37).** The discipline is a property of the MDL row, so a
  submission takes it from the join on `Document No.`:
  - one MDL row → the submission takes that row's discipline;
  - several MDL rows → the link is ambiguous, each plan row is kept and `V-26` reports the duplicate
    `Document No.`. The submission takes the discipline when every candidate carries the same one.
    When the candidates disagree, it takes `Unknown`;
  - no MDL row → the row is an orphan (`V-29`) and takes `Unknown`.
- `Unknown` is a **display label only**. It is not a `V-xx` rule and it adds no issue. The two
  data-quality flags stay `V-26` (duplicate `Document No.` in the MDL) and `V-29` (log row outside the
  MDL scope). `Unknown` is a normal dimension value: it appears in the Discipline filter, it is ticked
  by default, and its rows count in every measure. The dashboard never drops an `Unknown` row.
- For coverage, count each MDL row in the plan total. Count a row as submitted only when it has one
  unambiguous MDL match and a matching log row has a submission date or a submitted status. Do not
  count `NFS` as a submission. Report ambiguous rows as a separate coverage result.

### 3.3.1 KPI card business logic — cards 1 and 2

Both cards are produced by `render.js` `deriveView` and must **not** be recomputed in the DOM
(spec §3.8.2 rule 6). Each card counts **documents, not submission rows**: a document with several
resubmissions is one. The two cards use different document universes, which is why their values
differ and why card 1 can exceed the card 2 numerator.

**KPI 1 — Documents Logged — current workbook: 133**

- Source: the **filtered Submittal Log** rows (subject to the global filters).
- Unit: **distinct** `Document No.`, each normalized by trimming and upper-casing (D32).
- Counts documents, so the 16 log rows whose `Document No.` has no MDL plan row (`V-29` orphans)
  are **included**. That is why card 1 (133) can be larger than the card 2 numerator (116): card 1
  counts every logged document, card 2 counts only logged documents that also have a plan row.
- Current document-number universe (baseline, 2026-10-24): 510 distinct numbers in MDL, 133 in the
  log, 117 in both, 393 MDL-only (the unsubmitted part of the plan), 16 log-only (orphans). The
  7,631 MDL rows collapse to 510 distinct numbers because 232 numbers repeat (7,353 rows) — the
  `V-26` duplicate condition — so "MDL only" shows 393 distinct numbers, not thousands.

**KPI 2 — Documents Submitted / In Plan — current workbook: 116 / 7631**

- Denominator (`In Plan`): every MDL planned row that **carries a `Document No.`**, with `Deleted`,
  `Void` and `Superseded` stages excluded but a **blank `Stage` counted** (D33). Rows without a
  `Document No.` are not planned documents and are excluded — MDL reports them as `V-01`. This makes
  the denominator equal to MDL's Planned total: **7,631**.
- Numerator (`Submitted`): a planned document is submitted when at least one linked log row has a
  **submission date** or a **submission status that is not a "not submitted" code**. It is the count
  of documents, not of log rows.
- The numerator is always drawn from the denominator, so it can never exceed it; the ratio cannot
  pass 100%.
- Both numbers follow the global filters (Discipline, Stage, Search, Submission/Approval status,
  Submitted By). Change a filter and both change together.
- Join caveat: documents are linked on `Document No.` only. The 16 log submissions that match no
  plan row are excluded from the numerator (counted by `V-29`), and the one document number that
  matches two MDL rows is ambiguous (`V-26`) and excluded. The numerator is therefore a **floor**,
  not a certainty: 116 is the count of clean, unambiguous, plan-backed submissions.

**KPI 3 — Under Review (SUR) — counted per unique Document No. (D34)**

- Source: the **filtered Submittal Log** rows (subject to the global filters).
- Unit: **distinct** `Document No.` (normalized by trimming and upper-casing, same as KPI 1). A
  document with several log rows (revisions) counts once.
- Method (D34): group the filtered rows by `Document No.`; order each group by `Submission Date`
  ascending. The document is Under Review when its **latest** row has `Submission Status` = `SUR`
  and has **no** `Actual Return Date`. A document that was approved and later resubmitted for review
  is counted here separately from KPI 4, because a `Document No.` can be approved and then re-enter
  review.
- A `SUR` row that carries an `Actual Return Date` is contradictory (an open review cannot have a
  return date). It is **excluded** from this card and raises **V-32** (Warning, Group `Cross-field`).
  The owner enters V-32 in the workbook `Code` sheet (confirmed present, 2026-10-25).

**KPI 4 — Approved (APP + AWC) — counted per unique Document No. (D34)**

- Source: the **filtered Submittal Log** rows (subject to the global filters).
- Unit: **distinct** `Document No.` (normalized by trimming and upper-casing). A document with
  several log rows counts once.
- Method (D34): group the filtered rows by `Document No.`; order each group by `Submission Date`
  ascending. The document is Approved when any row in its group carries an approved `Approval
  Status` (`APP` or `AWC` = `Flag Approved` = 1). The "first approval status" is the earliest such
  row by `Submission Date`; if that status is approved, the document counts.
- KPI 3 and KPI 4 are **independent**: a document can appear in both (approved, then resubmitted and
  now under review). Neither card subtracts the other.

**KPI 5 and 6 — delay measures count each submission row (per-row rule)**

- Source: the **filtered Submittal Log** rows (subject to the global filters).
- Unit: **each log row** (submission record). Unlike KPI 3 and KPI 4 (D34), these two measures do
  **not** group by `Document No.` — a `Document No.` that appears in several rows contributes one
  value per row. Duplicate document numbers are not merged for delay measures.
- Method: `On-Time Return Rate` = average of `Flag On Time` over every filtered row that has a target
  return date (`delayDays` ≠ null). `Avg Review Delay` = mean of the recalculated `Review Delay Days`
  over the same rows (open rows before target add 0; early returns keep the negative value).
- This is the per-row submission-record rule already stated in §3.3 ("count each row in
  submission-record measures"). D34 made only KPI 3 and KPI 4 per-document; KPI 5 and KPI 6 stay
  per-row by design.

**Cross-dashboard reconciliation — MDL 124 vs sub 116**

MDL's "submitted" is any MDL row with an `Actual 1st Issue Date` typed in the MDL workbook; sub's
"submitted" is any plan-backed document linked to a log row. sub's 116 is a strict subset of MDL's
124, so the two dashboards already agree on 116 rows. The remaining **8** MDL-only submissions are
explained by the MDL→sub link failing, not by a counting error:

| Reason the MDL→sub link fails | Rows | Example |
|---|---|---|
| `Document No.` duplicated in MDL, so the log row cannot be assigned (ambiguous) | 2 | `131236-WIL23-CL-M-0001` (Process 100, 116) |
| `Document No.` truncated (one part missing), so it cannot match the log | 4 | `131236-WIL22-VI-M`, `131236-WIL21-QA-M` (Mech 34, 255, 256, 258) |
| Submittal Log holds no row for the document | 2 | Mech 9 `131236-WSW46-VI-M-0002`, CSA 3 `131236-WIL21-VI-S-xxxx` |

Neither dashboard is wrong — they answer different questions (MDL trusts the date in the MDL
workbook; sub trusts a match in the log). The true submitted count lies between 116 and 124 and
cannot be closed from data alone; it needs the broken numbers completed, the duplicated number
resolved, and the two missing/extra log rows reconciled (see I027, I028, I030).

- Use the first valid submission date for each unambiguous MDL row in schedule-performance views. Use
  all log rows for submission, review, and approval measures. Label the measure unit in each view.
- Read the source formulas for calculated fields before coding. In the current log, `Review Turnaround
  Days` uses actual return minus submission date when returned, and the local as-of date minus
  submission date when open. `Review Delay Days` usually equals turnaround minus review period. This
  gives negative values for early returns. Keep those values for returned records. A formula audit on
  2026-10-24 found 182 delay formulas with this rule and one formula that clamps negative values to 0.
  The workbook has 66 negative cached values across its 183 dated rows. Cached `TODAY()` results can be
  stale, so the pipeline recalculates open rows from the target date.
- Current workbook baseline: 7,717 MDL row candidates, including 86 rows with a blank document number;
  7,631 rows have a document number. The log has 183 dated submissions, 129 returned and 54 open.
  The current source has 232 repeated MDL document numbers (7,353 affected rows), 17 orphan log rows,
  one ambiguous link, and one V-30 timeline issue. These findings remain row-level validation results.
- For an open log row, calculate delay as `max(as-of date - Target Return Date, 0)`. Show 0 before
  the target date and positive days after it. Use the viewer's local date as the as-of date. Compare
  the result with the workbook formula and record any difference. Do not rely on stale cached formula
  values.
- Derived flags include `Flag Approved` (APP/AWC = 1), `Flag On Time` (delay ≤ 0), `Flag Delayed`,
  `Flag Resubmission`, and `Month` (first day of the submission month).
- Normalize Excel serial dates and formula-error tokens (`#VALUE!` and others) in spec §3.8.1. Set
  each formula-error value to absent and count it by column. Show one fatal strip per affected column
  in `#errBanner` (formula normalization, §3.8.4, not a `V-xx` code).

### 3.3.2 C3 Breakdown business logic — new vs resubmission (D36)

The C3 Breakdown chart splits a dimension (Discipline or Submitter) into two stacked series per
value. It reads the Submittal Log only (the summary table adds the plan total from the Master
Document List). The two series are:

- **Submissions** — the submission volume, split into **New** and **Resubmission**.
- **Approval Status** — the returned approval mix, split into `APP` / `AWC` / `NAP` / `REJ` / `INF`.

The approval codes are **not** sub-split by New vs Resub. The two come from different log columns and
may overlap, so they are drawn as two separate bars (bar view) or two concentric rings (pie view),
never as one stacked bar. The centre total shows the submitted count; percentages show only when
**All months** is selected.

**New vs Resubmission** (owner rule, 2026-10-25):

- Sort each `Document No.`'s log rows by `Submission Date` ascending. The **earliest** row is that
  document's **first submission**. A document can have only one first submission.
- **New** counts the first submission of each `Document No.` (one per document).
- **Resubmission** counts every later row for that document, **per record, ignoring `Document No.`**.
  A document can be resubmitted twice in one month, so Resubmission is a row count, not a document
  count.

**Per-month vs All-months** (owner rule, 2026-10-25):

- **A specific month is row-level.** Every log row in that month counts. A document approved in an
  earlier month and resubmitted and approved again in the selected month counts an approval in both
  months.
- **All months is per `Document No.`.** New = distinct documents; Resubmission = total rows minus
  distinct documents; the approval mix counts each document once, using its **first approval**
  (earliest row that carries an approval status). A document approved in two months counts as one
  approval, not two.
- Under Review (All months) uses the latest row per document: the document is under review when its
  latest row is `SUR` with no `Actual Return Date` (D34 / V-32).

**Discipline dimension (D37).** The Discipline axis reads `submission.discipline`, which comes from the
MDL join (§3.3), not from a Submittal Log section name. The axis holds `ICA`, `Process`, `Unknown`,
`Electrical`, `Mech`, `BS` and `Piping`. `Unknown` is a value like any other: the chart draws it, the
filter lists it and every measure counts it. Total Plan for `Unknown` reads 0, because no plan row
carries that label. The discipline correction (engine and filter) is tracked in `issue_log.md` I047
and I048; the Submitter-view Total Plan limit is tracked in I046.

**Total Plan — All months vs a specific month** (owner rule, 2026-10-28; issue I061):

- **A specific month counts only its own planned 1st issue.** For a selected month the plan total is
  the Master Document List rows whose `Planned 1st Issue Date` falls in that month (one month, not
  cumulative). This is unchanged.
- **All months is cumulative only up to the as-of month.** The All-months plan total is the sum of
  planned 1st issues for every month from the start of the schedule through `view.c1.asOf` (the
  dashboard as-of month). The SUR dashboard evaluates the Submittal Log, which only holds rows up to
  the current month, so comparing "submitted so far" against "plan for the whole project" would hide
  whether submissions are ahead of or late against the plan. Bounding the plan to the as-of month
  exposes that detail.
- **Blank-month plans are excluded.** Rows whose `Planned 1st Issue Date` is blank are unscheduled
  (like C2 NFS). They have no month ≤ as-of, so they are not counted in the All-months total.
- **No as-of → 0.** If `view.c1.asOf` is empty, the All-months plan total is `0`, not the full project
  count. Without an as-of boundary the All-months comparison is meaningless, so the dashboard shows 0
  and the user must set an as-of month to see a plan ratio.

**Implementation.** The engine returns `c3` from `deriveView` and `renderDashboard` draws the two
series per dimension value as bars or rings, with Month, Breakdown-by, View, PNG and Copy controls.
The build proof (tests, harness, sample) is in the Wave report, not this plan.

### 3.3.3 C3 Breakdown panel revision — Wave 4.2 (D38)

Wave 4.2 revises the C3 Breakdown panel (D36) into two bordered cards (each a stacked vertical-bar chart) with a full-width table below. The card split was applied 2026-10-27 (Option 2, matching the MDL interactive-chart pattern).

**Layout (owner rule, 2026-10-26; refined 2026-10-26; card split 2026-10-27).**

- The panel shows **two bordered cards** (Submissions, Approval Status), not one component with two series; each card **owns its controls** (month, Break-down-by, PNG, Copy) and draws a **stacked vertical-bar chart** with a **constant bar width** and **inclined (rotated) x-axis labels** so long discipline / submitter names do not overlap. A panel-level **Bar/Pie toggle** keeps the full-set pie available. The former grouped-bar / concentric-ring toggle is replaced by the two-card layout.
- **Left chart — Submissions.** Per dimension value: **First Submission** (documents with no resubmission) and **Resubmission** (documents with ≥1 resubmission), each document counted once (Option A). For a **specific month** a third bar, **Under Review**, is added (D38) — see below.
- **Right chart — Approval Status.** Per dimension value for `APP` / `AWC` / `NAP` / `REJ` / `INF`, using the **first approval** per document. For **All months** a sixth bar, **SUR** (currently open review documents, D34), is added — Under Review is shown here, not in the Submissions chart, so it is never double-counted.

**Pie / ring view (owner rule, 2026-10-26; refined 2026-10-26).**

- The Pie / Ring view shows **two concentric rings that summarise the full set** (all disciplines and all submitters; it ignores the Break-down-by toggle). The per-dimension split lives in the two bar charts above. Outer ring = Submissions (First Submission + Resubmission; per document for All months, row-level for a month); inner ring = Approval Status (the five codes, plus **SUR** for All months). Both rings total the distinct-document count for All months, so the summary is not double-counted.

**Table (owner rule, 2026-10-26).**

- The C3 Breakdown summary table moves **below the two charts** and spans the **full panel width**. For All months the columns follow Option A (First Submission = no-resub documents, Resubmission = has-resub documents, Total Submitted = distinct documents, Total Under Review = open documents); for a specific month they are row-level with Under Review = D38.

**Under Review (decision D38; refined 2026-10-26).**

- **A specific month (D38):** the scope is every month up to and including the as-of month; the base count is every `SUR` row up to the as-of month, then deduct the First Submission and Resubmission rows that fall **in** the as-of month, so a new submission that is also a `SUR` row is attributed to First Submission / Resubmission, not to Under Review. The three series stay additive without overlap.
- **All months:** Under Review is the set of **currently open review documents** (latest row `SUR` with no Actual Return Date, D34), shown as **SUR** in the Approval Status chart/ring — not as a Submissions bar. This avoids double-counting a document's history.

### 3.4 Pipeline architecture (spec §3.8) and MDL reference

The sub dashboard reads two `.xlsx` workbooks, so spec §3.8 applies. Reuse suitable MDL parsing logic,
but load the sub dashboard modules natively in the browser. Do not bundle the page. The column tables
in this workplan document the source contract; the pipeline resolves positions at runtime
(see spec §3.8.3).

**Stages (spec §3.8.1)**
- S0/S1 `xlsx-reader.js` (adapt the MDL parser logic): acquire bytes and parse the container. Check
  module imports and browser support before reuse.
- S2/S3 `pipeline.js` (MDL `pipeline.mjs`, `buildModel` l.236): normalize rows to typed `records`;
  validate once; produce `issues[]` and `warnings[]`. No KPI or chart math here (MDL comment l.493–494).
  Discard the raw `workbook` after S2; keep only `records` + `contract` + `meta`.
- S4 `render.js` `deriveView` (MDL `render.mjs` l.651): the sole source of KPI, chart, and overdue
  math. It applies the global filters to `records` to build the single `active` set, then
  aggregates.
- S5 `render.js`: paint the DOM. Write-only — does not read the DOM to decide (spec §3.8.2 rule 6).
- S6 `render.js`: on a filter change, re-run `deriveView` only; does not re-read the file (spec §3.8.2 rule 5).

**Mandatory pipeline rules (spec §3.8.2)** — satisfy each; the Tier-1 harness checks several: 1. One
aggregation engine (S4 only). 2. Discard the raw parse after S2. 3. Validate once at load. 4. Derive on
demand, with no I/O. 5. No re-parse on a filter change. 6. Render is write-only. 7. Single `STATE` object
(`render.js` `STATE`, MDL `render.mjs` l.809) — no state in DOM attributes. 8. Per-stage `try/catch`
(for each stage transition wrapped; MDL `pipeline.mjs` / `render.mjs`). 9. As-of = the viewer local date,
built from local date parts, does not use `toISOString()` (MDL `pipeline.mjs` l.242–243); project-start is the
S-curve origin only. 10. Blank and formula-error are the same absent state (§3.8.4).

**Contract-driven parsing (spec §3.8.3)** — the MDL `Code` sheet supplies the MDL field map, lookup
domains, and rule wording. Discover its tables at runtime. For the Submittal Log, discover fields from
its row 1 headers after trimming spaces and ignoring letter case. Treat the headers as the workbook-owned
field map. Read status domains and rule text from the log workbook `Code` sheet. Do not hard-code column
letters, row numbers, or allowed-value lists. A missing or repeated required header is a structural
error. Stop the affected views and show the error in `#errBanner`.

**Value normalization (spec §3.8.4)** — treat a blank or a formula-error token as absent (`undefined`).
Use a shared `isExcelError(v)` predicate (MDL `pipeline.mjs` l.52, `EXCEL_ERROR_TOKENS` l.48). Accumulate
a per-column error count and show one fatal strip per affected column in `#errBanner` (MDL `pipeline.mjs`
l.381). This is a parse step, not a `V-xx` code, and is not pushed to `model.issues`.

**Testability (spec §3.8.5)** — ship `test/pipeline.test.mjs` that imports `engine/pipeline.js` and tests
representative workbook data. Assert record counts, known KPI values, lookup values, and validation
counts. Check rule wording and severity against the workbook when it defines them. Run the tests with
the approved test runner before release. The layout harness may compare pipeline values with the page.

---

## 4. Dashboard Modules

### 4.0 App shell and layout

The dashboard uses the shell defined in `AGENTS.md` §18.2 (MDL two-row header + left navigation
sidebar), updated 2026-10-24. It implements that shell in project-local CSS in the project-root
page and JavaScript modules under `engine/`. The shell has a navy title bar (~56 px) and a white
menu bar (~48 px), a resizable 240 px navy left sidebar, a flexible content area, and a ~30 px
full-width navy status bar. There is no 48 px icon bar and no right sidebar. Project-local UI
assets implement the dimensions and behavior from the dashboard UI spec.

- The title bar holds the logo (white chip) and the title stack (project title + meta line).
- The menu bar holds actions (Load Data, Export), the global filter group, Search, Warnings, Settings, and Help.
- The left sidebar holds the page links (navigation) and the file-loading panel. It is collapsible and resizable.
- The content toolbar holds the page title and actions (layout button). The shared filter area holds the search panel and the warning area.
- The content area owns the dashboard panels. The layout button selects one, two, or three columns. Panel widths must fit the available content width.
- The warning area stays inside the content area. The label stays `Warnings` when the area is open or collapsed.
- Settings and Help open modal dialogs (they are no longer a right sidebar).
- The status bar shows MDL file name, Submittal Log file name, and load state on the left. It shows the dashboard version on the right.
- Default theme is light (spec §18.4, updated). Five themes remain available.
- Print hides warning notices as the dashboard spec requires.

**UI assets:** Dashboard pages do not use repository `common/` files. They implement the shell and
tokens in project-local assets whose paths this workplan defines. Stable shell markers follow spec §3.1
(`titlebar`, `menubar`, `left-sidebar`, `content`, `statusbar`) and allow harness checks independent of CSS class names.

### 4.1 Global controls

The menu-bar filter group contains the five global dimensions: Discipline, Stage, Submission Status,
Approval Status, and Submitted By. Each is a **multi-select** trigger — `.tf-btn` with a count badge
opening a `.tf-panel` of `.chips` toggles led by an `All <dimension>` master (spec §7.1 B1 + B3). The
group also holds the Search button with its panel and the Warnings toggle, as MDL does. §7.2.7 point 5
records the dimension list; see D15 for the cardinality decision. The Discipline dimension lists every
discipline in the plan **and** `Unknown` when a submission carries it; `Unknown` is ticked by default, so
no row is dropped (D37). Load Data and Export use the button rules in the dashboard UI spec and accessible labels. File selection
uses the file panel behavior defined by the dashboard UI spec; the user selects both workbooks for each load. The workplan records this
project-specific choice under §8. D13.

### 4.2 Navigation and sidebars

The left sidebar uses the collapse, resize, and accordion behavior defined by the dashboard UI spec. It switches pages and holds the
file-loading panel. It does not repeat any global filter. The menu bar holds actions, the global filter group, Search, Warnings, Settings, and Help. There is no right sidebar and no icon bar; Settings and Help are modal dialogs.

### 4.3 Overview page (KPI Overview and charts)

KPI Overview (§5): first panel, title `KPI OVERVIEW`, inline `?` (help, left) and `−` (collapse,
right). Six KPI cards in the shared auto-fit grid:

| KPI | Source |
|---|---|
| Documents Logged | distinct `Document No.` in the filtered Submittal Log, trimmed and upper-cased (D32); includes the 16 `V-29` orphans; counts documents, not rows (see §3.3.1) |
| Documents Submitted divided by In Plan | numerator = plan-backed documents with a linked log submission (date or non-"not-submitted" status); denominator = planned rows with a `Document No.` excluding `Deleted`/`Void`/`Superseded` but counting a blank `Stage` (D33); duplicate-ID rows stay in the denominator but ambiguous links drop from the numerator (see §3.3.1) |
| Under Review (SUR) | distinct `Document No.` whose latest filtered row is `SUR` with no `Actual Return Date` (D34); a `SUR` row with a return date raises V-32 and is excluded |
| Approved (APP+AWC) | distinct `Document No.` with any row whose `Approval Status` is `APP`/`AWC` (D34); the first (earliest) approval status decides |
| On-Time Return Rate | `Flag On Time` average over every filtered row with a target return date; each log row is one case, **not** grouped by `Document No.` |
| Avg Review Delay | mean of recalculated `Review Delay Days` over the same rows; each log row is one case, **not** grouped by `Document No.`; open rows before target date contribute 0; early returned rows keep the workbook negative value |

Overview charts — three **combined interactive charts** (SVG, dependency-free, adapted from the MDL chart
kit). Each chart carries its own control cluster (§4.1 / spec §4.2) and re-renders `deriveView` on the
single `active` set (S4); no DOM recompute. The global Discipline filter still applies across each chart.

- **C1 Schedule Performance (S-Curve) — full width** (`.card.full`, spec §4.2): reconciles plan vs
  actual vs forecast submissions. Four series (workplan D35): **Plan** = MDL planned first-issue rows
  (`Document No.` + planned first-issue date); **Actual** is split because `Document No.` + `Submission
  Date` repeats for a document's re-issues — **Actual First Submission** counts each `Document No.` once
  on its earliest `Submission Date` (unique documents issued), and **Actual Resubmissions** counts every
  Submittal Log record that is not that document's first submission, **per record, ignoring `Document
  No.`**; **Forecast** reads MDL's forecast series first and falls back to `Plan × 1.04` when MDL has
  none. Monthly **bars** show the period quantity (`pNew`, `fNew`, `aFNew`, `aRNew`); **cumulative lines** show
  the absolute running totals (`pCum`, `fCum`, `aFCum`, `aRCum`), anchored at the earliest data date and
  never rebased by the window. Cumulative Actual (both) runs flat to Today. Repeated `Document No.` stay
  as separate rows and raise `V-26`; blank `Document No.` records count in Resubmissions (they cannot be
  deduped). **Controls**: Month / Quarter / Year **grain toggle**, **Bars** toggle, **period brush**
  selection (scopes the x-range), **series multi-filter** (Plan / Forecast / Actual First /
  Actual Resubmission), `⤓ PNG`, `⧉ Copy` — period + range text left, filters then exports right (spec
  §4.2 rev 1.27). In-SVG bottom legend, Start (red dashed) + Today (grey dashed) lines, +1 month tail,
  shared `Docs` scale, hover snap line + floating window. This chart spans the selected content width.
- **C2 Submission Flow & Delay** (shared layout grid): the monthly submission flow. **Controls**: view toggle
  *Stacked* (per-month status split: SUR/RTR/NTS/NFS, with an *Include NFS* toggle and a total) ↔
  *Delay* (monthly average `Review Delay Days`, not-yet-returned and not-due = `0`) ↔ *Funnel* (the
  former Status Funnel: Submitted → In Review → Returned → Approved drop-off).
- **C3 Breakdown** (shared layout grid): a single split-by-dimension panel. **Controls**: dimension toggle
  *Discipline* ↔ *Submitter*; metric toggle *Count* / *Plan vs Actual* / *Delay* / *Rework* /
  *Approval Mix* (the former Approval Mix donut is now a metric option, with its total in the centre);
  a Month selector and a Bar / Pie toggle. In the Approval Mix metric each dimension value draws two
  series — **Submissions** (New + Resubmission) and **Approval Status** (`APP`/`AWC`/`NAP`/`REJ`/`INF`)
  — as two bars or two concentric rings, never one stacked bar. New = first submission per `Document
  No.`; Resubmission = every later row per record; a specific month is row-level while All months
  counts per `Document No.` using the first approval (§3.3.2, D36). Overdue / lag cells are flagged.

**Regrouping note**: the earlier seven Overview charts plus the analytical panels are consolidated into
six interactive charts (C1–C6). Folded here: *Approval Mix* → C3 "Approval Mix" metric; *S-Curve
Variance* → C1 "Per Discipline" view; the standalone *Coverage* panel → C5 "Coverage" view (§4.9). Net
14 separate visuals → 6 charts. Each chart uses the active shared layout; C6 is on the Staffing page.

### 4.4 Submittals page (review and filter all details)

This page holds the full submission record set. The user reviews and filters all submittal details
here, including delays.

- **Document Detail table (`.ds-table`)**: all submission rows with columns Document No., Title,
  Discipline, Submitted By, Submission Date, Submission Status, Approval Status, Review Period, Target
  Return, Actual Return, Turnaround, Delay, and Resubmission Required.
- **Panel-local controls** (§7.1 B7 — no filter chrome, §7.2.7 pt 6): sort, a column show or hide
  chooser, and a single-row quick filter (for example a status or discipline select). These resolve in
  S5. They change only this table, not the global `active` set.
- **Delay review**: a clear Delay column and a delayed-rows badge, so the user can list each late
  return and its delay days.
- **CSV export** of the current table view.

### 4.5 Validation page (all validation details)

This page shows every validation detail in full. It is the full list that the warning bar summarizes.
Validation has three classes, kept distinct:

- **Structural (fatal, `#errBanner`)**: the workbook is unreadable, or a required sheet or column is
  missing. This blocks dependent panels. It is not a `V-xx` code.
- **Formula normalization (§3.8.4, `#errBanner`)**: a cell holds a formula-error token (`#VALUE!`,
  `#REF!`, `#DIV/0!`, `#N/A`, …). The value is set to absent; the pipeline counts affected cells per
  column and shows one fatal strip per affected column. This is a parse step, not a `V-xx` code, and is
  not pushed to `model.issues`.
- **`V-xx` business-rule validation**: data-quality and consistency rules. Each rule's code, message,
  and severity are defined in the workbook `Code` sheet and read at runtime (spec §3.8.3). The sub
  dashboard reuses the MDL `Code` sheet, so all codes are identical to MDL.

**Error-code catalog (`V-xx`)** — the MDL `Code` sheet defines `V-01`…`V-28` (frozen; do not change
code, Group, Rule, or Severity). The sub dashboard appends `V-29`…`V-32` for rules new to the
two-workbook link. Both the MDL `Code` sheet and the Submittal Log `Code` sheet carry the **identical**
full list.

**Code-sheet schema (MDL)** — the workbook `Code` sheet holds the validation block with four columns,
discovered **by label** (not by position) in MDL `pipeline.mjs` (field aliases at l.140–143; block read
at l.303–314):

| Column | MDL alias | Meaning |
|---|---|---|
| `Error Code` | `errorCode` | The `V-xx` key |
| `Rule` | `errorRule` | Rule text / trigger wording (message source) |
| `Severity` | `errorSeverity` | Error / Warning / Info (defaults to Warning if blank) |
| `Group` | `errorGroup` | Category: Domain / Cross-field / Workflow / Timeline / Referential / Completeness / Uniqueness |

The frozen `V-01`…`V-28` rows below already exist in the MDL `Code` sheet with their Group, Rule, and
Severity. The sub dashboard only appends the new rows in the second table, keeping the same four columns.

| Error Code | Trigger (Rule, per Code sheet) | Severity (per Code sheet) | Sub use |
|---|---|---|---|
| V-01 | Populated row with blank `Document No.` | per Code sheet | Reuse |
| V-02 | `Stage` not in domain | per Code sheet | If sub has Stage |
| V-03 | `UESH Discipline` not in domain | per Code sheet | MDL-only |
| V-04 | `Discipline Code` not in domain | per Code sheet | Reuse |
| V-05 | `Doc Type` not in domain | per Code sheet | MDL-only |
| V-06 | `Authority` not in domain | per Code sheet | MDL-only |
| V-07 | `Submission Status` not in domain | per Code sheet | Reuse |
| V-08 | `Latest Approval Status` not in domain | per Code sheet | Reuse |
| V-09 | 1st-issue date order wrong | per Code sheet | Reuse on sub dates |
| V-10 | `As-Built` = YES but `Actual 1st Issue Date` blank | per Code sheet | MDL-only |
| V-11 | Approval Status = APP but approval date blank | per Code sheet | Reuse if return = approval date |
| V-12 | `Stage` is a non-active stage | per Code sheet | MDL-only |
| V-13 | Code-sheet lookup block has a label but empty code | per Code sheet | Contract check |
| V-14 | `Project Code` / `Project Prefix` not in domain | per Code sheet | MDL-only |
| V-15 | `Document No.` contains `xxxx` | per Code sheet | Reuse |
| V-16 | `Submission Status` = RTR but Approval Status missing / VOID | per Code sheet | Reuse |
| V-17 | `Document No.` ≠ composed `G-H-I-J-K` | per Code sheet | MDL-only |
| V-18 | Issue date present but `Prolog No` / `Submission Status` missing | per Code sheet | Reuse (return date ⇒ status) |
| V-19 | `Submission Status` ⇔ `Prolog Number` both present | per Code sheet | MDL-only |
| V-20 | Approval Status in {APP,AWC,REJ,NAP} but issue / approval date missing | per Code sheet | Reuse (status ⇒ dates) |
| V-21 | Approval date present but status missing, or date before issue date | per Code sheet | Reuse |
| V-22 | Issue date present but `Planned` / `Forecast` missing | per Code sheet | Reuse (return present, submission date missing) |
| V-23 | Any date is in the future | per Code sheet | Reuse |
| V-24 | `BQ Number` present but not in BQ sheet | per Code sheet | MDL-only |
| V-25 | Required fields missing | per Code sheet | Reuse |
| V-26 | Repeated `Document No.` in MDL planned rows or Submittal Log records | Error per Code sheet | Preserve all rows and report the duplicate |
| V-27 | `As-Built` / `Vendor Data` not in {YES,NO} | per Code sheet | MDL-only |
| V-28 | 1st-issue date precedes declared project start | per Code sheet | Reuse if sub has project start |
| **V-29** | **Orphan**: Submittal Log `Document No.` not present in MDL scope | Warning | **New — mandatory** |
| **V-30** | `Actual Return` or `Target Return` earlier than `Submission Date` | Warning | **New** |
| **V-31** | Status conflict: `Approval Status` present while `Submission Status` = NFS; or `Resubmission Required` = Yes while `Submission Status` ∉ {RTR,REJ} | Warning | **New** |
| **V-32** | `Submission Status` = SUR but `Actual Return Date` present — an open review cannot have a return date | Warning | **New** |

**New sub codes (append to the same four columns)** — define `Group`, `Rule`, and `Severity` explicitly;
these are new rows, not changes to existing `V-01`…`V-28` values:

| Error Code | Group | Rule | Severity | Note |
|---|---|---|---|---|
| **V-29** | Referential | Submittal Log `Document No.` must exist in MDL scope; otherwise the row is an orphan | Warning | **New — mandatory** |
| **V-30** | Timeline | `Actual Return` / `Target Return` must not precede `Submission Date` | Warning | **New** |
| **V-31** | Cross-field | `Approval Status` present while `Submission Status` = NFS; or `Resubmission Required` = Yes while `Submission Status` ∉ {RTR,REJ} | Warning | **New** |
| **V-32** | Cross-field | `Submission Status` = SUR (Submitted Under Review) but `Actual Return Date` is present — an open review cannot carry a return date | Warning | **New** |

**Excel edit guide (how to add V-29…V-32)** — open each workbook, go to the `Code` sheet, and append
four rows after the last `V-xx` row. The error block starts at row 1 with the headers `Error Code`,
`Group`, `Rule`, `Severity` (discovered by label, so the column letters below are only to help you find
them). Do **not** change the headers or any existing `V-01`…`V-27` row — appending rows is safe for MDL.

| Workbook | `Error Code` | `Group` | `Rule` | `Severity` | Rows to add |
|---|---|---|---|---|---|
| Master Document List | AI | AJ | AK | AL | 29, 30, 31, 32 |
| Document Submittal Log | K | L | M | N | 29, 30, 31, 32 |

Enter, per row, the four values (`Error Code` · `Group` · `Rule` · `Severity`):
- `V-29` · `Referential` · `Submittal Log Document No. not found in MDL scope — orphan (submitted but not in the plan)` · `Warning` — mandatory
- `V-30` · `Timeline` · `Actual Return or Target Return earlier than Submission Date` · `Warning`
- `V-31` · `Cross-field` · `Approval Status present while Submission Status = NFS; or Resubmission Required = Yes while Submission Status ∉ {RTR,REJ}` · `Warning`
- `V-32` · `Cross-field` · `Submission Status = SUR (Submitted Under Review) but Actual Return Date present — an open review cannot carry a return date` · `Warning`

Both the `MDL/` and `sub/` copies carry the same workbooks; the sub dashboard reads the `sub/` copies, so
update the `Code` sheet in **both** folders for each workbook. Run the dashboard's `harness-layout`
Tier-1/3 after the edit to confirm the codes are picked up.

**Status**: updated manually on 2026-10-23 and verified — all four `Code` sheets (`MDL/` and `sub/`,
Master Document List and Submittal Log) contain `V-01`…`V-32` with the labels `Error Code` / `Group` /
`Rule` / `Severity`; the existing `V-01`…`V-27` rows are unchanged. The 2026-10-24 formula review
found 183 log records with submission dates, 129 returned records, and 54 open records. The formula
cache includes negative delay values for early returns and can lag the current date.

**Notes**
- Repeated MDL `Document No.` values remain as separate planned rows and raise `V-26` Error.
  Do not merge or remove these rows. A log match to repeated MDL values is ambiguous and is not assigned
  to either planned row.
- The MDL workbook and the Submittal Log link by `Document No.`. A Submittal Log row whose `Document No.`
  is absent from MDL scope is an **orphan** and is reported by **V-29** (mandatory).
- MDL `Document No.` not in the Submittal Log is **NFS** (not submitted) — an expected coverage gap, not
  an error.
- `V-18` + `V-20` cover the rule "a review return date is present but the review or approval status is
  missing", applied to the sub dashboard's `Actual Return` / `Target Return` / `Submission Status` /
  `Approval Status`. No dedicated code is needed for that case.

**MDL impact of Code-sheet edits** (why we only append rows, never change columns):
- **Keep the four columns** (`Error Code`, `Rule`, `Severity`, `Group`) and their labels exactly. MDL
  discovers them by label; changing the labels or order, or omitting a column, makes MDL's `errorBlock`
  empty, so the MDL Validation page and `#errBanner` lose every message — a breaking change for MDL.
- **Adding `V-29`…`V-31` rows** with the same columns is safe: MDL's parser only gains inert entries;
  MDL never triggers them (no sub-specific fields in MDL data), so MDL behavior and the completeness %
  (a code constant, MDL `pipeline.mjs` l.495) are unchanged. Performance impact is negligible.
- **Do not change the `Group` / `Rule` / `Severity` of `V-01`…`V-28`** — that alters MDL's messages and
  severity and violates the MDL workplan rule "no silent wording change" (MDL workplan §6.4).

### 4.6 Settings page

Dashboard preferences the user can change and save in `localStorage`:
- Theme (light or dark).
- Warning-bar visibility (show or hide).
- Default column set for the Document Detail table.
- Remember selected workbook file names. Ask the user to select both workbooks for each load.
- Optional persistent file access may use the File System Access API when the browser supports it and the user grants access.

### 4.7 Help page

- How to use the dashboard: load the two workbooks, use the global filters, and switch pages.
- Glossary of status codes: SUR, RTR, NTS, NFS and APP, AWC, NAP, REJ, INF.
- Data sources and version.
- Contact or issue link.

### 4.8 Coverage — now a view inside the Forward Plan (C5)

Coverage (MDL scope minus submitted documents: pending and not-submitted count and list) is **no longer a
standalone Overview panel**. It is offered as the **Coverage** view inside the Analytical **Forward Plan**
chart (C5, §4.9), alongside the Look-Ahead list. This keeps the forward/coverage story on one screen and
removes a redundant Overview panel.

---

### 4.9 Analytical page (bottlenecks, delays, projected delays)

The Analytical page answers *where is it stuck* and *what is coming*. It carries a bottleneck KPI strip
and two combined interactive charts that follow the shared content layout.

**Bottleneck KPI strip (6 cards)**: Overdue (past Target Return, still open) · Open SUR older than 60 d ·
Rework Rate (RTR / resubmission) · Avg Cycle (return→approval) · Look-ahead (docs due in next 4 wks) ·
Required Review FTE (Dec) — the last is the staffing hand-off to §4.10 (deferred — see §9.9).

- **C4 Turnaround & Aging** (shared content grid): process-time analysis. **Controls**: *Scatter* (turnaround days on
  x, review-delay days on y, one point per submission) ↔ *Age buckets* (open SUR split <30 / 30–60 /
  60–90 / >90 d; overdue = past Target Return still open). Surfaces the bottleneck stage and where time
  is lost.
- **C5 Forward Plan** (shared content grid): the forward/coverage view. **Controls**: *Look-ahead* (documents due by
  Target Return within the next 4–8 weeks, with status pills and a total) ↔ *Coverage* (NFS: MDL scope
  with no matching Submittal Log Document No., the former Coverage panel §4.8). Enables projected-delay
  spotting before the queue builds.

### 4.10 Staffing page (manhour / capacity analysis) — **DEFERRED**

> **Status: DEFERRED.** The Staffing page (and its C6 estimator) is specified but **not scheduled for
> build** until the user provides manhour benchmarks (discipline-weighted `review-hours/document` and any
> current-FTE basis). The menu item (§4.2) and the chart spec below are retained so build can start
> immediately when benchmarks arrive. See Open Question §9.9.

A separate side-menu page (§4.2) for the staffing question. It carries a staffing KPI strip and one
combined estimator panel.

**Staffing KPI strip (4 cards)**: Required Review FTE (Dec) · Current Throughput FTE (implied from
historical volume ÷ productive hours/reviewer) · Capacity Gap (+1.1 reviewers) · Review hours / doc
(discipline-weighted).

- **C6 Staffing Estimator** (full width): a **parametric** model —

  `Required review-FTE = projected volume × review-hours/document ÷ productive-hours/reviewer`

  where `projected volume` comes from §4.3 Plan/Forecast/Actual + Log trend (S4), `review-hours/document`
  is a **planner input** (discipline-weighted; e.g. simple 1.5 h, complex 3.0 h, portfolio weighted
  ≈ 2.2 h), and `productive-hours/reviewer` is a settings input (default 140 h/month). The panel compares
  the result with historical throughput to show the capacity gap, and declares the scope explicitly:
  *review/approval effort only — not drafting or coordination*.

**Feasibility boundary (important)**: the data gives **volume and throughput**, not **effort per
document**, so the manhour figure cannot be computed from the workbooks alone — it needs the
`review-hours/document` assumption. Treat the output as a *load / throughput* estimate, not an absolute
manhour number. **Open**: confirm the discipline-weight table for `review-hours/document` and whether a
current-FTE input is wanted (Settings, §4.6).

---

## 5. Validation Rules

- Excel structure contract (§3): required sheets and columns; missing column makes a fatal
  `#errBanner` notice.
- Formula-error cells are normalized to absent and counted per column; one fatal strip per affected
  column shows in `#errBanner` (§3.8.4 — not a `V-xx` code).
- S4 Derive is the sole source of KPI numbers; panels do not recompute from the DOM.
- `Unknown` is not a validation rule. It is the display label for a submission that has no MDL
  discipline (D37). The data-quality flags stay `V-26` (duplicate `Document No.` in the MDL) and `V-29`
  (log row outside the MDL scope).
- No duplicate global filter dimensions (§7.2.7): the sidebar holds navigation, and the shared filter area holds filters.
- Conformance record (spec §8): fill the §8 record in this workplan after build.

---

## 6. Technical Architecture

### 6.1 Stack decision (approved in Wave 1)

The dashboard UI uses native JavaScript modules in the browser, with no bundler or npm runtime
dependency. The project HTML file stays in the `sub/` root. A Python standard-library server serves the
page and project-local assets. Node.js is the approved test runner. No separate data-preparation helper
is required. Keep the dashboard page in the project root, its JavaScript modules in `sub/engine/`, and its UI help data in `sub/config/`. Do not create `sub/ui/`, `sub/data/`, or `sub/output/` solely to meet a folder convention.

### 6.2 Project file layout

```
sub/
  archive/  config/  docs/  engine/  log/  test/  workplan/
  knowledge.json
  TWRP C3B2 - Document Submittal Dashboard.html   (dashboard entry page)
  engine/xlsx-reader.js
  engine/pipeline.js
  engine/render.js
  config/ui_help.json
  serve.py
  test/pipeline.test.mjs
  test/render.test.mjs
```

The dashboard HTML stays in the project root. The browser holds loaded and derived data in memory;
CSV exports download through the browser. `ui/`, `data/`, and `output/` are not required. Create the
other required project folders and `knowledge.json` before source work.

### 6.3 Build

There is no HTML build step. Run the project `serve.py` from the repository root and open the
project-root dashboard page. Use Node.js to run JavaScript pipeline and render tests. Use the Python standard library for the local
server, as required by `AGENTS.md` §18.12.

---

## 7. Workplan (Waves)

### Waves

| Wave | Target / owner | Work and deliverable | Main risk and action | Pass condition | Status |
|---|---|---|---|---|---|
| 1 | 2026-10-24 / project owner and Codex | Approve this workplan. Select native browser modules, Python standard-library server, Node.js tests, and no optional data helper. | Open stack choice / record the approved stack before implementation. | Approval and stack choice are recorded; Wave 1 report is filed. | ✅ COMPLETE |
| 2 | 2026-10-24 00:34 UTC–01:17 UTC / developer | Create `knowledge.json` and the required dashboard project folders. Do not create `ui/`, `data/`, or `output/`. Keep existing `log/` and `workplan/reports/`. Wave 2.1 closes the schema gate. | The shared schema was absent at scaffold time; I002 was logged and resolved in Wave 2.1. | Required folders exist with `ui/`, `data/`, and `output/` excluded; JSON parses; no test files exist outside `test/`; schema tests pass for EKS, sub, and a graph example. File report and logs. | ✅ COMPLETE |
| 2.1 | 2026-10-24 01:13 UTC–01:17 UTC / Codex | Create and validate the shared knowledge graph schema for dashboard projects. Base the common content on the EKS sample and support typed page, component, definition, behavior, function, workflow, data, schema, issue, and update nodes with evidence-backed edges. | Existing EKS and sub knowledge files use different shapes; preserve both as compatible inputs while defining the graph extension. JSON Schema cannot check that edge endpoints exist; record this limit for a later graph integrity check. | Shared schema validates; the EKS sample and current sub knowledge file validate; a graph example validates; invalid structure fails; report and logs are filed. | ✅ COMPLETE |
| 3 | 2026-10-24 01:18 UTC–01:38 UTC / developer | Build and test S0–S3 data handling. Read both workbooks; normalize source rows; validate fields and rules; link submissions only to unique MDL rows; recalculate row delay and turnaround. | Changed workbook contracts / fail clearly and name the source; stale formula caches / compare returned values and recalculate open delays. | Twelve pipeline tests pass for both workbooks, source rules, validation, joins, calculations, and known totals; report and logs are filed. | ✅ COMPLETE |
| 4 | 2026-10-24 / developer | Build dashboard views and the file-load flow. Keep dashboard HTML in the project root. Run shell and layout harness checks in Chromium. | File pairing or layout errors / check both files and the dashboard UI spec. Chromium launch is available in the supported environment. | Both files load, views use the same model, Wave 4 UI and integration checks pass, and the report and logs are filed. | ✅ COMPLETE |
| 5 | After Wave 4 / developer | Run full regression tests. Check missing or swapped files, missing or repeated headers, formula errors, duplicate MDL IDs, orphan rows, multiple submissions per document, and filters against known totals. Compare calculated fields with workbook formulas and approved delay rules. | Stale formula caches or changing source data / use fixed dates and known workbook cases. | All required cases pass; conformance record is complete; report and logs are filed. | 🔷 PLANNED |
| 6 | After Wave 5 / project owner and reviewer | Review the two-file load flow by hand. | Load flow may hide file errors / check missing, swapped, and invalid files. | Review record lists results and remaining issues; project owner accepts the release. | 🔷 PLANNED |
| 7 | 2026-10-24 / CodeBuddy (AI) | Rebuild the non-compliant Wave 4 UI to the spec §18.2 shell with the MDL/PPP visual family: **light default**, **navy left sidebar**, MDL-rounded white panels/KPIs, and an MDL-style welcome card (logo from `./asset/logo.jpg`, expect box, drop zone, privacy note). Keep the verified data engine (xlsx-reader.js, pipeline.js, render.js). Archive the prior UI. | The prior UI was dark-themed and used a custom palette, so it did not look like the MDL/PPP/sample family; it also kept a white sidebar instead of MDL's navy sidebar. | Shell markers present; logo from `./asset/logo.jpg`; navy chrome + navy left sidebar; light default; MDL-rounded panels/KPIs; MDL welcome card; five themes; §8.2 gate items checked. **Note:** superseded by Wave 8, which updated `AGENTS.md` §18.2 / spec §3.1 to the MDL shell so this dashboard is fully spec-conformant. | ✅ COMPLETE |
| 8 | 2026-10-24 / CodeBuddy (AI) | Adopt the MDL shell as the project standard: update `AGENTS.md` §18.2 (two-row header + left nav sidebar; no icon bar/right sidebar; light default) and `Dashboard-UI-Design-Spec.md` §3.1/§3.2/§3.6. Rebuild the sub dashboard to Option B (MDL two-row header + navy left navigation sidebar, menu-bar filters, Settings/Help modals, MDL welcome card). Keep the verified data engine. Add a full-screen welcome overlay: the `#welcome-screen` shows with no dashboard parts (header, menu bar, left sidebar, status bar all hidden) until the workbooks load; `body.loaded` reveals the `.app` shell. Load failures show on the welcome screen. | The user did not request the 48 px icon bar or the right sidebar; they conflict with the MDL layout. The spec must match MDL rather than carry a deviation. The welcome must show alone, like MDL. | Shell updated and rebuilt; new markers `titlebar`/`menubar`/`left-sidebar`/`content`/`statusbar`; no `iconbar`/`right-sidebar`; light default; full-screen welcome (no dashboard parts) implemented and verified; data-engine tests still pass (16/16). Zero deviations from the updated spec. | ✅ COMPLETE |
| 9 | 2026-10-24 / CodeBuddy (AI) | Harden the welcome per the user's instruction and MDL: use the MDL ratio (full viewport, fluid) and the golden ratio (1 : 1.618) for fixed-proportion welcome surfaces; place the load buttons (Choose / Load) inside the file drop area; and remove the hardcoded project title from the welcome (the project/dashboard title renders from the loaded model after load). Update `Dashboard-UI-Design-Spec.md` §3.7 and `AGENTS.md` §18.2 to make these normative. | Before load the project title is unknown, so the welcome must not bake it in; MDL shows a generic tool name and renders the real title from the model. The drop area is the natural home for the load controls. | Welcome overlay implemented: golden-ratio drop (`aspect-ratio:1.618`) containing Choose + Load buttons; welcome shows no hardcoded project title (generic app label only); drag-and-drop extended to the welcome; shell title rendered from `model.meta.dashboardTitle` after load; spec §3.7 + AGENTS §18.2 hardened. Data-engine tests still pass (16/16). | ✅ COMPLETE |
| 4.1 | After Wave 4 / developer | Correct the discipline dimension (D37): derive `discipline` from the MDL join on `Document No.` and add `Unknown` to the Discipline filter and default set. | Wrong section-based discipline misclassified 94 rows (I047); `Unknown` rows dropped by the default filter (I048). | Pipeline and UI changes pass; the C3 Discipline view matches the MDL join; see `issue_log.md` I047 and I048. | ✅ COMPLETE |
| 4.2 | After Wave 4.1 / developer | Revise the C3 Breakdown panel (D38): split it into two side-by-side vertical-bar charts (Submissions: First Submission, Resubmission, Under Review; Approval Status: APP/AWC/NAP/REJ/INF), make the Pie/Ring view summarise all disciplines, and move the data table below the two charts at full width. Under Review deducts First Submission + Resubmission in the same month. | Wrong overlap of Under Review with First Submission/Resubmission (I052); layout regression in the panel grid (I049/I051). | Both charts render with vertical bars from the MDL join; Under Review no longer double-counts; table spans full width below the charts; pipeline and render tests pass (new C3 tests). T15.3, T15.4, T15.5, and T15.6 complete (refined 2026-10-26: All-months Under Review → SUR in Approval ring, Resubmission per document, approval = first, blank excluded; pie = two equal-total rings; table below at full width; C3 card split (Option 2) applied 2026-10-27). | ✅ COMPLETE |

### Tasks by wave

| Wave | Task | Category | Status | Work | Issues |
|---|---|---|---|---|---|
| 1 | T0.1 | [Docs] | ✅ COMPLETE | Align the workplan, shared spec, and harness with project-local dashboard UI assets and the shell contract. | — |
| 2 | T2.1 | [Scaffold] | ✅ COMPLETE | Validate `knowledge.json` against the shared schema; see report SUB-REPORT-W2.1-001. | — |
| 2.1 | T2.2 | [Schema] | ✅ COMPLETE | Create the repository-level knowledge graph schema; schema tests pass. | — |
| 3 | T3.1 | [Pipeline] | ✅ COMPLETE | Add the project-local XLSX reader and source-contract pipeline with validation. | I003 (resolved) |
| 4 | T4.1 | [UI and integration] | ✅ COMPLETE | Build dashboard views and the file-load flow; Tier 1–4 harness checks pass. | I003 (resolved) |
| 4.1 | T15.1 | [Pipeline] | ✅ COMPLETE | Derive discipline from the MDL join on `Document No.`; remove the section-header rule (D37). See TEST-017. | I047 |
| 4.1 | T15.2 | [UI] | ✅ COMPLETE | Add `Unknown` to the Discipline filter list and default set so unlinked rows stay counted (D37). See TEST-017. | I048 |
| 4.2 | T15.3 | [UI] | ✅ COMPLETE | Split the C3 Breakdown into two side-by-side vertical-bar charts: left = First Submission, Resubmission, Under Review; right = Approval Status (APP/AWC/NAP/REJ/INF). Both vertical bars. See TEST-018. (Refined 2026-10-26: All-months left chart = First Submission + Resubmission only; Under Review moves to the Approval ring as SUR; Resubmission per document; approval = first; blank Document No. excluded. Card split 2026-10-27: two stacked-bar cards, each with own controls; constant bar width; inclined labels.) | I049 |
| 4.2 | T15.4 | [UI] | ✅ COMPLETE | Pie/Ring view = full-set All-months summary. It ignores the Break-down-by (Discipline/Submitter) toggle and always shows the whole dataset (all disciplines + all submitters) for the selected month/scope. It draws two concentric rings that both total the distinct-document count: outer = Submissions (First Submission = documents with no resubmission; Resubmission = documents with ≥1 resubmission); inner = Approval Status (APP/AWC/NAP/REJ/INF + SUR, where SUR = currently open review documents). Under Review is shown in the Approval Status ring (as SUR), not the Submissions ring, so it is not double-counted. Approval Status uses the first approval status per document (the design is approved and downstream work proceeds; the latest approval would delay that signal). Rows with a blank Document No. are excluded, so each ring totals the distinct-document count. The two side-by-side bar charts (T15.3) carry the per-dimension split. See TEST-018. (Refined 2026-10-26: All-months outer ring = First Submission + Resubmission, inner ring adds SUR; a specific month adds Under Review as a third outer segment and shows counts only, no percentages; both rings equal the distinct-document count.) | I050 |
| 4.2 | T15.5 | [Layout] | ✅ COMPLETE | Move the C3 data table below the two charts, full width. The `.c3-body` is now a vertical flex stack: the chart cards (`c3-cards`) on top, the summary table (`c3-summary`) below at full panel width, so the exact numbers are never hidden beside the chart. See TEST-018. | I051 |
| 4.2 | T15.6 | [Pipeline] | ✅ COMPLETE | Under Review deducts First Submission + Resubmission in the same month (D38). See TEST-018. (Refined 2026-10-26: D38 applies to a specific month; All-months Under Review = currently open documents, D34, shown as SUR in the Approval ring.) | I052 |
| 16 | T16.1 | [Layout] | ✅ COMPLETE | Split-header table (`.ds-table`, §7.2.15) follows the screen / window width: `wireSplitHeaders` `syncWidth` scales the cached column widths to the new container width on resize, keeping drag ratios and the pinned-column offset aligned. The shell, panel grid, KPI cards and most charts already followed the screen; the C3 stacked-bar chart stays fixed-width by the constant-bar-width requirement. See TEST-018. | I053 |
| 16 | T16.2 | [Layout] | ✅ COMPLETE | Split-header table (`.ds-table`, §7.2.15) also follows browser zoom (Control + mouse scroll): `bindSplitResize` adds a `window` / `visualViewport` resize listener that re-runs every registered `syncWidth`, rescaling the cached column widths to the new screen scale so the table fills the panel like the KPI reference. `ResizeObserver` alone missed zoom. The C3 stacked-bar chart stays fixed-width by the constant-bar-width requirement (spec §3.4.1). See TEST-018. | I054 |
| 16 | T16.3 | [Layout] | ✅ COMPLETE | Panel grid (`.panel-grid`) follows browser zoom like the KPI `auto-fit` grid: `.panel` is `min-width:0; min-height:0`; tracks use `minmax(0,1fr)`; `@media` breakpoints drop columns (3→2→1 for `three`, 2→1 for `two`) as the width shrinks, with `data-layout` as the maximum count. `.c3-cards` uses `minmax(0,1fr)`. No panel keeps a fixed first-render column count on zoom. The C3 stacked-bar chart stays fixed-width by requirement (spec §3.4.1). See TEST-018. | I055 |
| 16 | T16.4 | [Layout] | ✅ COMPLETE | C3 panel controls / pie redesign:
| 16 | T16.5 | [Layout] | ✅ COMPLETE | C3 breakdown shows all MDL disciplines
| 16 | T16.6 | [Layout] | ✅ COMPLETE | Fixed the C3 Bar card PNG/Copy regression from I057: the per-card PNG/Copy buttons serialized a missing `<svg>` (the bars became a CSS grid). Added `c3CardToSvg(btn)` (native-SVG rebuild of the card) and routed `serializeC3Svg` / `exportC3Png` through it. See TEST-018. | I058
| 16 | T16.7 | [Layout] | ✅ COMPLETE | Added a Download button to the shared C3 Breakdown summary table (`c3Table` header with `data-c3export` → `exportC3TableCsv`, which reads the rendered `.c3-summary` rows from the DOM, skips `.ds-gut`, and saves `breakdown-table.csv` with a UTF-8 BOM). See TEST-018. | I059 (and all submitters) even at zero; each card draws bars inside one aligned CSS grid (bars + vertical axis labels + attached table): Submissions = Total Plan / First / Resub / Under Review; Approval = the codes. Shared summary table kept (Q8). See TEST-018. | I057 one shared `.c3-controls` cluster (Month + Break-down-by, hidden in Pie view) sits beside the charts and drives both cards; PNG/Copy stay per card. The Pie view renders the two cards (Submissions, Approval Status) as their own donuts (`c3PieCard(kind)` + `c3SingleDonut`), replacing the consolidated `c3PieSVG` two-ring card. The constant-bar-width bars are unchanged. See TEST-018. | I056 |

| 16 | T16.8 | [Layout] | ✅ COMPLETE | Add the C3 Breakdown bar y-axis grid lines + numbers (I060): scale the bars to a nice max (niceCeil of the largest category total), draw 5 horizontal grid lines at 0/25/50/75/100% of that max, and right-align the numeric tick labels in the metric-label column flush against the bars (no gap, aligned with the table below). Zero-discipline categories still show the grid; Pie cards exempt. Spec §4.2 (revision 1.34) and the harness bundled spec are already updated; see `sub/ref/sample-c3-grid-lines.html`. | I060
| 17 | T16.9 | [Logic] | ✅ COMPLETE | Bound the C3 All-months `Total Plan` to the as-of month (I061): `planCount` sums planned 1st issues only for months ≤ `model.meta.asOfDate` (matching `view.c1.asOf`), excludes blank-month (unscheduled) plans, and returns 0 when as-of is empty; a specific month still counts only its own planned 1st issue. Rule recorded in §3.3.2. | I061

Record start and end timestamps for each wave. At each wave end, file a report in `workplan/reports/`
and update `issue_log.md`, `update_log.md`, and `test_log.md`. Record “not applicable” in the test
report and test log when a wave runs no tests. Do not mark a wave complete until its pass conditions
succeed. Wave 2 and Wave 2.1 are complete; I002 is resolved. Waves 3 and 4 include tests; Wave 5
runs full regression; Wave 6 is a manual owner review and release decision; Wave 4.1 corrects the
discipline dimension. Open issues I046, I047 and I048 are tracked in `issue_log.md`.

---

## 8. Decisions Captured from Review

- **D1 — Side panel is navigation only** (§4.2). The left sidebar switches pages and holds file controls. The global filter group lives in the menu bar (spec §3.1, updated 2026-10-24); the left sidebar does not repeat any global filter. No page name equals a global filter dimension. Rationale: spec §7.2.7 forbids offering a global dimension again.
- **D2 — Two workbooks read when loaded** (§6.1). MDL = scope, Submittal Log = history; joined on
  Document No. with submittal-log discipline as authority.
- **D3 — Existing `sub/ref/` prototype preserved** (§2). New artifact, no overwrite.
- **D4 — Shared shell and global controls** (§4.0–4.2). The dashboard uses the shell in `AGENTS.md` §18.2. Global filters live in the shared filter area below the content toolbar; actions stay in the toolbar. The sidebars use the shared shell behavior. This decision replaces the former two-row header proposal.
- **D5 — Source-contract parsing (spec §3.8.3)** (§3.4). Resolve source positions and lookup values from each workbook contract at runtime. The MDL `Code` sheet provides its field map. The Submittal Log uses its row-1 field headers and `Code` sheet where present. Missing or repeated required fields are validation errors.

- **D6 — Six combined interactive charts (C1–C6) replace 14 separate visuals** (§4.3, §4.9, §4.10).
  The Overview's seven charts and the Analytical's seven panels are regrouped by shared question:
  C1 Schedule Performance (S-curve) · C2 Submission Flow & Delay · C3 Breakdown (incl. Approval Mix) ·
  C4 Turnaround & Aging · C5 Forward Plan (Look-ahead + Coverage) · C6 Staffing Estimator. Each chart has a control cluster (toggle/view) and re-renders `deriveView` on `active`
  (S4 only — no DOM recompute), reusing MDL's SVG chart kit. Net 14 → 6.
- **D7 — Staffing is its own side-menu page** (§4.2, §4.10). The manhour/staffing analysis (C6) is a
  separate **Staffing** nav item, not folded into Analytical, so the capacity question is reviewed on
  its own with its own KPI strip. The menu label **Analytical** is retained. **Deferred**: scheduled
  only after the user supplies manhour benchmarks (§9.9); the menu item and C6 spec are retained.
- **D8 — Shared layout behavior** (§4.0): the status bar and sidebars follow `AGENTS.md` §18.2. The layout button selects one, two, or three content columns. The S-curve (C1) may span the content width. Panel grids must fit each selected layout.
- **D9 — Redundancy folded, not lost** (§4.3, §4.9): *Approval Mix* → C3 "Approval Mix" metric;
  *S-Curve Variance* → C1 "Per Discipline" view; standalone *Coverage* panel → C5 "Coverage" view. The
  Status Funnel is **kept** as the C2 "Funnel" view (distinct stage drop-off). No chart is dropped
  outright — each original question remains reachable.
- **D40 — C2 Stacked view is a time-river stacked area** (§4.2, owner review 2026-10-27): the C2 Stacked
  view draws one band per submission status over a month (time) x-axis. **Counting rule**: band height =
  the count of **submission records (rows)** in that month, grouped by status — **per month only** (not
  cumulative) and **not** distinct `Document No.` (distinct-document counting is the KPI cards' job,
  D32/D34). The **NFS** band is the only MDL-sourced band: it counts planned documents not yet submitted,
  attributed to their **planned first-issue month**, and is computed from the plan — **not** read from the
  log's cached NFS array-formula column (issue I029). Design sample: `sub/ref/C2-TimeFlow-Sample.html`
  (Variant 1 = stacked area chosen over Variant 2 = centered streamgraph, because the streamgraph hides
  the absolute total). The Delay and Funnel views sit behind the Stacked/Delay/Funnel toggle.
  The **Funnel** view (owner rules 2026-10-28, reference `sub/ref` funnel sample) is a document
  pipeline drawn as a **vertical funnel to the right of a per-Discipline table** (table left, funnel
  right). The funnel's **top aligns with the first discipline row** and its **bottom — a cube block for
  Approved — aligns with the last discipline row** (the table header and Total row are outside the funnel
  span). Five stages, top → bottom: **Planned Deliverables** → **Submitted for Review** → **Under Review**
  → **AWC** → **Approved**. Counting: Planned Deliverables = MDL planned rows (D11 — each row is one
  planned document, repeated numbers stay separate, dated or not; row-level, consistent with C3 Total
  Plan). Submitted for Review = distinct `Document No.` with ≥1 submission row (D34). Under Review =
  latest submission `SUR` and no `Actual Return Date` (D34 guard kept). **AWC** and **Approved** are split
  by the document's **first approval** (earliest row that carries an approval code): AWC when that code is
  `AWC`, Approved when it is `APP` — disjoint, and distinct from KPI 4 (any-row `APP`/`AWC`). Band widths
  use **square-root compression** so a large ratio (e.g. planned 1000 vs submitted 100) does not make a
  stage a razor-thin sliver; a 14px floor keeps labels readable. The per-Discipline table repeats the five
  measures with a Total row. The Funnel is document-level for Submitted/Under Review/AWC/Approved (distinct
  `Document No.`), unlike the Stacked/Delay views, which are row-level per month.
- **D10 — Warning display rules** (§4.0, §4.1): the visible toggle label stays `Warnings` in both states.
  The count stays in the badge. The warning area stays inside the content area and never covers either sidebar.
- **D11 — Row counts and duplicate IDs** (§3.3, §4.3): each MDL row is one planned record, and each log
  row is one submission record. Repeated MDL document numbers raise `V-26` and stay as separate rows.
  Links to repeated numbers are ambiguous. Coverage counts all MDL rows in plan and reports ambiguous
  links separately.
- **D12 — Calculated delay** (§3.3, §4.3): inspect workbook formulas before implementation and compare
  dashboard results with their logic. Keep negative delay for returned early records. For open records,
  show zero through the target date and positive overdue days after it, based on the viewer local date.
- **D13 — File selection and checks** (§4.6, §7): ask the user to select both workbooks for each load.
  This user-approved rule overrides the default-path button in `AGENTS.md` §18.7. Keep local picker,
  drag-and-drop, loaded-file list, and active-file status. Remember file names only. Test file pairing,
  headers, formula errors, duplicate IDs, orphan rows, multiple submissions, and known totals.
- **D14 — Repository UI standard takes priority** (§4.0–4.2): use `AGENTS.md` §18 for the shell,
  project-local assets, five themes, file panel, and layout behavior. The prior two-row header and single left
  sidebar proposal is withdrawn. Dashboard pages use project-local CSS and JavaScript; `common/` does not apply. Stable shell markers are
  defined in spec §3.1 and checked by `harness-layout`.
- **D15 — Global filters are multi-select** (§4.1, §7.1). Resolves I008. The five global dimensions
  are multi-select: each renders as a `.tf-btn` trigger with a `.tf-cnt` count badge that opens a
  `.tf-panel` of `.chips` checkboxes led by an `All <dimension>` master toggle. The filter state holds
  a `Set` per dimension, and an empty `Set` means no narrowing. Rationale: spec §7.1 B grammar ties
  chrome to cardinality, and §7.1 (rev 1.15) now requires a global dimension to accept several values
  at once because it re-derives the shared `active` set for every panel. The previous single-value
  native `<select>` controls and the local `.filter-control` class are removed.
- **D16 — Shared typography** (§6, §7.1). The dashboard uses the shared `--font-ui` stack and the
  normative type scale in spec §6 (body 13 px / 1.45, KPI value 22 px, KPI label 10 px uppercase,
  chart-card `h3` 13 px / 700, icon button 13 px / 600, filter trigger 12 px / 600, chip 11 px,
  severity chip 11 px / 700, system banner 12 px). MDL is the reference implementation.
- **D17 — Menu bar composition** (§3.1, §3.2). Resolves I009. The menu bar is one row and MUST NOT
  wrap; the five filter triggers sit in a flex row (`.tf-filters`) and the filter group scrolls
  horizontally when they do not fit. Its contents are: the actions group — **Load Workbook** as the
  highlighted `.btn-primary` control plus Export — then the filter group (the triggers, Search with
  its popover, Warnings), then Help. Settings moved out of the menu bar into the left side panel as
  its own menu. The theme button is removed and the theme design deferred. The left side panel no
  longer holds workbook-loading controls: the "Workbook files" section (Choose Workbooks, drop zone,
  file names, Load Data) is gone, and choosing workbooks is the menu-bar Load Workbook button, which
  loads when both are already selected and opens the picker otherwise.
- **D18 — Search popover follows MDL** (§3.1). Resolves I009. The popover is `.tf-panel.search-panel`
  at `width:min(92vw,640px)`, containing a `.search-row` (nowrap) with a `.search` group — a
  `select.inter-sel.is-attached` column picker joined to an `input.search-input` — plus Find
  (primary) and Reset. The visible "In" label is dropped in favour of `aria-label`, and the popover
  closes on an outside click.
- **D19 — Filter chrome follows MDL** (§7.1 B1, B3). Resolves I010. The trigger is text plus a count
  badge, with **no caret glyph**, and it is **borderless in the menu bar** — the base control keeps
  its 1 px `--border` and the menu-bar chrome strips it. The panel holds MDL's structure: a `.tf-all`
  `All <dimension>` master, a hint, a divider, then a `.tf-list` of `.tf-item` rows at 12 px. Spec
  1.17 revises B1 (no caret, borderless in the menu bar) and B3 (from `.chips label` pills to
  `tf-all` / `tf-item`), and fixes the type scale: menu row 12 px, count badge 10 px / 700.
- **D20 — The filter group is not a scroll container** (§3.1). `overflow` on `.filter-group` clips the
  floating panels that hang below the menu bar and makes their toggles unreachable — Playwright could
  not click them at all. The group is now `flex-shrink:0` with no `overflow`, as MDL has it. Spec 1.17
  replaces the earlier "scrolls horizontally" allowance with this rule.
- **D21 — Master toggle semantics stay the sub's** (§7.1 B3). MDL treats an empty selection as *no
  rows*; the sub treats it as *no narrowing*, so all rows show. MDL's model is not adopted. The master
  instead reflects an explicit "every value ticked", so unticking it clears the ticks without snapping
  back to checked. The panel hint says "Tick one or more values to narrow every panel", because the
  sub applies changes immediately while MDL defers them to panel close.
- **D22 — Help in the side panel** (§3.2). Resolves I010. Help sits next to Settings in one
  "Settings & Help" menu in the left side panel. The menu-bar right group is removed.
- **D23 — Menu-bar typography and alignment** (§3.1, §6). Resolves I011. Every control in the menu
  bar is bold: `.app-menu .btn` is 12 px / 600, matching MDL — it was 13 px / 400. The filter
  triggers were already 12 px / 600 and the Warnings count badge is 11 px / 700. Alignment follows
  MDL's split: the left-panel toggle, the load action and Export are left-aligned, and the filter
  group (triggers, Search, Warnings) is pushed to the right by `margin-left:auto` on `.filter-group`.
  `.app-menu` itself keeps no `justify-content`, because it has three children — toggle, actions,
  filter group — and `space-between` would strand the actions group in the middle. Spec 1.18 makes
  both rules normative and adds the 12 px / 600 row to the §6 type scale.
- **D24 — Title-bar and menu-bar spacing** (§3.1, §6). Resolves I012. Font sizes were already correct
  in both bars; the spacing was not. The title-bar rows gained MDL's `gap:2px` on `.ttl-stack` and
  lost the sub's `line-height:1.25`, and `.ttl` gained MDL's `line-height:1.2`. That moved the title
  bar from 70 px to 77.72 px, which is exactly MDL's height. The menu-bar gap went from 10 px to
  12 px, and `.app-menu .warn-toggle` gained MDL's `margin-left:6px`, so Search to Warnings is 14 px
  as MDL's is. The menu bar stays 1 px taller than MDL's 48 px because the sub keeps a 1 px
  `border-bottom` and MDL has none; that border is left in place deliberately. Spec 1.19 makes the
  spacing normative and adds the title-bar type-scale rows (17 px / 600 and 12 px / 500).
- **D25 — Title-bar logo and menu-bar control metrics** (§3.1). Resolves I013. Found by physically
  measuring both bars in Chromium: font sizes already matched, seven other properties did not. The
  logo is now 36 px with `flex-shrink:0` (it was 34 px and could shrink), the brand gap is 12 px
  (was 10), `.ttl-stack` has `min-width:0`, `.app-top` is `justify-content:space-between`, and
  `.app-menu .btn` carries MDL's `padding:7px 14px`, `min-height:32px` and `line-height:1.2` — it
  had 12 px padding, no min-height (so it rendered 31 px) and the inherited 1.45 line height.
  `.tf-btn` gained `line-height:normal`. The sub's global `.btn` is left alone, because it is used
  far beyond the menu bar and 13 px there is out of scope.
- **D26 — The sidebar toggle is compact** (§3.1). Resolves I014. The toggle inherited the menu-bar
  control's `padding:7px 14px`, so it rendered 39 px wide around an 11 px glyph, and it carried the
  bar's full 12 px gap after it. It is now `padding:7px 8px;margin-right:-4px` — 27 px wide, with an
  8 px trailing gap matching the 8 px inside the actions group. MDL gives no reference here: its menu
  bar has no sidebar toggle at all. Two things were kept: the 32 px height and 12 px / 600 type of a
  menu-bar control, and the 20 px at the left edge, which is the bar's padding, aligns the toggle with
  the title-bar logo, and matches MDL's content edge. Spec 1.21 makes the compact toggle normative.
- **D27 — The left panel holds menus only** (§3.2). Resolves I015. The sidebar is now three children:
  `nav.sb-menu.page-links` with the five page links, `nav.sb-bottom` with Settings and Help pinned by
  `margin-top:auto`, and the `div.resize-handle`. Removed the in-panel collapse toggle — it duplicated
  the menu bar's `data-shell-toggle="left-sidebar"` control — along with both section titles, the
  `.sb-section-body` wrappers and the `border-bottom` dividers. Six CSS rules collapsed into two. The
  **resizer is kept**: the spec requires `data-shell-resize="left-sidebar"` and the panel stays
  resizable, and it is not a menu item so much as a panel affordance. The panel's own 1 px right
  border is kept too, because it is the panel edge, not a divider. MDL offers no reference — it has
  no sidebar at all — so the spec defines the shape.
- **D28 — The left panel is sized to its menu titles** (§3.2). Resolves I016. The panel was 240 px for
  135 px of content, so 105 px was empty — a leftover of the old panel, which also carried a
  full-width collapse toggle and two section titles, all removed by I015. `--sidebar-w` is now
  **160 px**: the widest title, "Forward Plan", is 91 px at 14 px / 400, which with the button's 12 px
  horizontal padding and the panel's 10 px padding needs 135 px, plus 25 px of slack. The clamp in
  `updateSidebarWidth` had to move too: it was `min = 180`, and it runs on load whenever a width is
  saved in local storage, so a narrower default would have been forced back to 180 px. It is now
  **140**, the width at which the widest title still fits. The 25 px of slack is deliberate — it keeps
  the row clear of the 5 px resize handle and leaves room if a title grows.
- **D29 — No content toolbar; page name and layout toggle in the shell** (§3.1, §3.3). Resolves I017.
  The content zone no longer opens with a `.toolbar`. All three things it held duplicated the shell:
  the `#content-title` heading repeated the left-panel selection, the subtitle repeated the title
  bar's `.ttl`, and the `#layout-button` had no reason to live in the content. The page name is now
  a `.page-title` at the right of the title bar — the bar is `justify-content:space-between` and
  previously held only `.brand`, so the right half was empty — at 12 px / 600 with `aria-live="polite"`
  and updated from `paint()` instead of the removed `#content-title`. The layout toggle is a menu-bar
  control at the right end, after the filter group, with `margin-left:auto` so it is flush right
  before data loads and follows the group once the group is shown; it keeps the compact 8 px icon
  padding. Removing the zone dropped 68 px of chrome above the panels. Three harness checks asserted
  a `toolbar` zone, so `harness.mjs` revision 1.7 now asserts `filter-area` and `body` only.
- **D30 — The page label is large, plain text** (§3.1). Resolves I018. D29 put the active page at the
  menu-bar control scale — 12 px / 600 — inside a translucent pill. That read as a badge rather than
  as the page name, and it made the label the smallest text in the title bar, below the 17 px project
  title it sits beside. It is now **16 px / 600 at `line-height:1.2`**, one step below the project
  title so the two do not compete, with **no background, padding, border or radius**. Dropping the
  padding also put it back on the bar's 20 px edge, matching the brand group's left edge. The title
  bar stays 78 px tall because the label at 19.2 px is still shorter than the 57.75 px `.ttl-stack`.
- **D31 — Chart panels conform to §4 chrome** (§4). Resolves I019. The panel stylesheet diverged from
  the markup: it styled `.panel h3` while the renderer emits `<h2>`, so panel titles rendered at the
  browser default 19.5 px with no uppercase, no tracking and the body colour, and `.panel-head` had
  no rule at all — so the row was `display:block` and the Help control wrapped to the left instead of
  being pinned right. The Collapse toggle and the corner numbers did not exist. The panel now has a
  real `.panel-head` flex row, a `.panel-actions` cluster (Help first, Collapse last), `.panel[data-panel]::after`
  numbering, and the §4 surface metrics. **Numbering is assigned after insertion, in DOM order**, not
  from call order: Analytical built a panel before the point where it was placed, which produced
  `1, 2, 4, 3`. Only top-level panels are numbered — the nested sub-panel on Analytical inherits its
  parent's number and shows no badge, so the `::after` rule is gated on `[data-panel]`. Collapsed
  state lives in `state.collapsedPanels` rather than on the element, so `paint()` restores it. The menu bar stays 1 px taller than MDL
  because of its `border-bottom`, which MDL's menu bar does not have.
- **D32 — A repeated `Document No.` counts once in the KPI row** (§5). Project-owner business rule:
  one Submittal Log row is one submission **record**, and one document may be submitted and logged
  more than once, so a repeated `Document No.` is the same document. `Total Submissions` therefore
  overstated the document count. The card is renamed **`Documents Logged`** and computes the distinct
  `Document No.` over the filtered submission rows, trimmed and upper-cased, because one document
  appears in the workbook as both `131236-WSW46-CL-M-0002` and `131236-WSw46-CL-M-0002`. The count
  moves from 183 rows to **133 documents**; the Submittals table still shows all 183 rows. The Master
  Document List has the opposite rule: one row is one document, so a repeated `Document No.` is a data
  **error** (`V-26`) and the rows stay separate. The same normalisation was applied to the
  submission-to-plan join, which removed one false `V-29` orphan: the orphan count is now 16. Only
  card 1 is consolidated in this wave — `Under Review` (54 rows), `Approved` (92 rows, 62 documents)
  and the delay measures stay record-level, because a per-document value needs a tie-break rule for a
  document with up to 3 rows. I022 records that open question; D34 (2026-10-25) later resolves it —
  `Under Review` and `Approved` now also count per unique `Document No.` with the ordered-group
  tie-break, and a `SUR` row with a return date raises V-32.

- **D33 — MDL owns blank-field validation; sub counts the rows** (§5, §7). Project-owner decision. A
  planned row with no `Document No.` is not a planned document, so it is excluded from every plan
  measure — the rule MDL already applies. A planned row with a `Document No.` and no `Stage` **is** a
  planned document: a blank `Stage` is missing data, not an excluded stage, so the row is counted and
  the Stage filter lists it as `(blank)`. The Stage filter also lists `Deleted`, `Void` and
  `Superseded`; those three stay unticked by default, so they are not counted until the user ticks
  them. Blank-field validation stays with the MDL dashboard: sub adds no `V-02` for a blank `Stage`,
  and a blank `Document No.` is the MDL `V-01` defect. The plan total moves from 7513 to 7631, equal
  to MDL; `Documents Submitted / In Plan` reads 116 / 7631. Open follow-ups: I026 (sub still emits
  `V-01` for a blank `Document No.`) and I027 to I030.

- **D34 — Under Review and Approved count documents, not rows** (§5, §3.3.1). Project-owner rule
  (2026-10-25): the Submittal Log is a submission history, so one `Document No.` can appear in
  several rows (revisions). `Under Review (SUR)` and `Approved (APP+AWC)` now count distinct
  `Document No.` over the filtered submissions. Each document's rows are grouped and ordered by
  `Submission Date`: Under Review uses the **latest** row (it must be `SUR` with no `Actual Return
  Date`); Approved uses the **first** (earliest) approval status, and if that is `APP`/`AWC` the
  document counts. The two cards are independent — an approved document later resubmitted for review
  can appear in both. A `SUR` row that carries an `Actual Return Date` is contradictory; it is
  excluded from Under Review and raises **V-32** (Warning, Group `Cross-field`). D34 resolves I022.

- **D35 — C1 Schedule Performance shows four series (Plan, Forecast, Actual First, Actual Resubmission)** (§4.3, §3.3). The S-curve reconciles plan vs actual vs forecast submissions. **Plan** = MDL planned first-issue rows (`Document No.` + planned first-issue date). **Actual** is split because `Document No.` + `Submission Date` repeats for a document's re-issues: **Actual First Submission** counts each `Document No.` once on its earliest `Submission Date` (unique documents issued); **Actual Resubmissions** counts every Submittal Log record that is not that document's first submission, **per record, ignoring `Document No.`** (rework / re-issue volume). **Forecast** reads MDL's forecast series first; when MDL supplies none it falls back to `Plan × 1.04` (per bucket and cumulative), mirroring MDL I-85's sparse-forecast fallback. Bars show the period quantity (`pNew`, `fNew`, `aFNew`, `aRNew`); lines show the absolute cumulative totals (`pCum`, `fCum`, `aFCum`, `aRCum`), anchored at the earliest data date and never rebased by the window. Cumulative Actual (both) runs flat to Today. Edge cases: a blank `Document No.` cannot be deduped, so blank-doc records count in Resubmissions; duplicate `Document No.` follow the earliest-date rule and still raise `V-26`. The series multi-filter lists all four series; the grain toggle (Month / Quarter / Year) rebuckets all four; the period brush scopes the x-range only.

- **D36 — C3 Breakdown approval mix (§3.3.2, §4.3; refined D38 / Wave 4.2, 2026-10-26).** The metric draws two separate series per dimension value because the submission and approval columns are different log columns and can overlap. **Submissions** = First Submission + Resubmission; **Approval Status** = `APP`/`AWC`/`NAP`/`REJ`/`INF` + `SUR` (open review). **A specific month is row-level and ignores history:** First Submission = every `isNew` row in that month, Resubmission = every `!isNew` row, Approval Status = approvals in that month, and Under Review = D38 (SUR rows up to the as-of month minus that month's First/Resubmission). **All months is per `Document No.` (each document counted once):** First Submission = documents with no resubmission, Resubmission = documents with ≥1 resubmission (Option A — a document's history is one document, not 1 + N rows); Approval Status uses the **first approval** (earliest row with an approval status) so a document approved earlier counts once and downstream work proceeds; **SUR** = currently open documents (latest row `SUR` with no Actual Return Date, D34), shown in the Approval ring so it is not double-counted with Submissions. Both All-months rings total the distinct-document count. **Rows with a blank `Document No.` are excluded everywhere** (they are not documents).

- **D37 — A submission takes its discipline from the MDL join, not from the log section name** (§3.2, §3.3, §3.3.2, §4.1, §5). Project-owner rule (2026-10-25). The Submittal Log section rows (`ICA`, `Electrical`, `Mechanical`, `Building Services`) are **layout only**. A row whose `S.No` and `Document No.` are both blank is skipped, and `Prolog Subject` is never read as data. `Document No.`, trimmed and upper-cased, is the only key that relates a submission to its plan row and to every other row for that document, so the discipline comes from the plan row. The old rule read the section text as the discipline and was wrong for 94 rows: the `Mechanical` section holds 62 `Process` documents, 15 documents outside the MDL, 8 `Mech` and 1 `Piping`; the `Building Services` section holds 7 `BS` and 1 outside the MDL. Those rows carried `Electrical`, because an unmatched header was skipped in silence and the previous value persisted. The new rule has three outcomes: one MDL row → its discipline; several MDL rows → the shared discipline, else `Unknown`; no MDL row → `Unknown`. `Unknown` is a display label only, and it is a normal filter value that stays ticked, so its rows count. The current workbook resolves to `ICA` 80, `Process` 62, `Unknown` 16, `Electrical` 9, `Mech` 8, `BS` 7 and `Piping` 1. A duplicate `Document No.` in the MDL stays an MDL data-quality error (`V-26`, 7 353 rows today across 232 distinct numbers), and a log row outside the MDL scope stays `V-29` (16 rows).

- **D38 — Under Review starts from `SUR` rows and deducts First Submission and Resubmission in the same month (C3, Wave 4.2)** (§3.3.3). Project-owner rule (2026-10-26; refined 2026-10-26). **D38 applies to a specific month only.** The scope is every month up to and including the as-of month; the base count is every `SUR` row up to the as-of month, then deduct the First Submission and Resubmission rows that fall **in** the as-of month, so a new submission that is also a `SUR` row is not double-counted. First Submission and Resubmission keep their D36 definitions. The three series are additive without overlap. **All months does not use D38:** Under Review for the All-months summary is the set of currently open review documents (D34), shown as **SUR** in the Approval Status chart/ring.

### 8.1 Spec §3.8 conformance record

| Spec clause | Where satisfied | Status |
|---|---|---|
| §3.8.0 native browser modules, no bundler | `engine/xlsx-reader.js`, `engine/pipeline.js`, `engine/dashboard.js` | Complete — S0–S6 present after Wave 7 UI rebuild |
| §3.8.1 stages S0–S6 | §3.4, Wave 3–7 | Complete — S0–S6 present |
| §3.8.1 S4 sole KPI source | §3.4, §5, `engine/render.js` | Complete — `renderDashboard`/`deriveView` only |
| §3.8.2 rules 1–10 | §3.4, `engine/render.js`, `engine/dashboard.js` | Complete — Wave 7 UI conforms to the shell and side-panel rules |
| §3.8.3 source-contract parsing | `engine/pipeline.js`; each workbook Code/header tables | Complete for Wave 3 |
| §3.8.4 formula normalization + `V-xx` validation | `engine/pipeline.js`; workbook Code tables | Complete for Wave 3 data rules |
| §3.8.5 test harness | Wave 6; project-approved runner + `harness-layout` | Planned |

Update this record at the end of each implementation wave. Wave 1 approval and stack evidence are in `workplan/reports/Wave-1-Approval-and-Stack-Decision.md`. Wave 2 evidence is in `workplan/reports/Wave-2-Scaffold-and-Knowledge.md` and `workplan/reports/Wave-2.1-Knowledge-Graph-Schema.md`. Wave 3 evidence is in `workplan/reports/Wave-3-Data-Pipeline.md`.

Chart panels follow spec §4.2 (combined chart panels; C1 is `.card.full`; each chart's control cluster
is owned by the chart card per §4.1). The panel grid and KPI grid follow the shared layout selection in `AGENTS.md` §18.8 and §18.10.

### 8.2 Spec-compliance gate (mandatory before build sign-off)

The **sample HTML is a static review mockup only** — it is not the build source of truth. When the real
submittal dashboard is built, verify every UI detail against `Dashboard-UI-Design-Spec.md` before sign-off.
Use the checklist below; cite the spec clause for each item.

| # | Item to verify | Spec clause |
|---|---|---|
| 1 | Shell geometry (MDL two-row header + navy left navigation sidebar), project-local assets, five themes, file panel, and layout button | `AGENTS.md` §18.2; spec §1, §3.1, §3.7 |
| 2 | The left sidebar uses the resize, collapse, and accordion behavior from the standards; assets stay project-local. The shell is the MDL two-row header + left navigation sidebar; there is no icon bar and no right sidebar (spec §3.1, updated 2026-10-24) | `AGENTS.md` §18.2, §18.5; spec §1, §3.1, §3.2 |
| 3 | Status bar follows the standard height and behavior; left and right values are listed in this workplan | `AGENTS.md` §18.2; spec §3.6 |
| 4 | Warning area stays inside the content area and does not cover either sidebar | §3.5 |
| 5 | Panels fit the active one-, two-, or three-column shell layout | `AGENTS.md` §18.8; spec §3.4 |
| 6 | Chart panels and cards fit the selected shell layout; C1 may use the full content width | §4.2; `AGENTS.md` §18.8 |
| 7 | Global filters appear once below the content toolbar; chart controls remain with their chart; derive from `active` without DOM calculations | §4.1, §4.3, §7.2.7 |
| 8 | KPI labels and glossary terms match the §2 glossary exactly | §2, §4.0 |
| 9 | Validation rules (incl. V-29/30/31) wired via MDL `pipeline.mjs` resolver | §3.8, §4.5 |
| 10 | STE prose lint (`harness-writing/ste-lint.mjs`) on docs + dashboard visible text passes the advisory threshold | `harness-writing` |

**Gate rule**: no Wave-4 release is signed off until each row above is checked against the spec and the
clause is cited. The sample HTML's shortcuts (static toggles, read-only inputs, placeholder data, any
layout drift) are accepted in the mockup but **must not** carry into the project-root dashboard page.

---

## 9. Open Questions and Assumptions

- **9.1 Data preparation stack — RESOLVED in Wave 1**: use native browser modules, Python standard-library server, and Node.js test runner. No optional data-preparation helper is required.
- **9.2 Load flow**: the user selects both workbooks for each load. The shared panel keeps drag-and-drop,
  the loaded-file list, and active-file status. The default-path button is omitted under D13. Remember
  file names only. Do not store persistent file handles.
- **9.3 Dashboard path**: `sub/TWRP C3B2 - Document Submittal Dashboard.html` in the project root. Keep loaded and derived data in memory. Browser CSV downloads do not require an `output/` folder.
- **9.4 Sample page**: `sub/archive/Document-Submittal-Dashboard-Sample.html` is a static review mockup
  only; it is not wired to Excel. Create the project-root dashboard page as a separate artifact. It is **known to contain
  spec-non-conformant spots** (found in user review) and is **not** the build source of truth — the real
  build must conform to `Dashboard-UI-Design-Spec.md` per the §8.2 gate.
- **9.5 Warning-toggle label — RESOLVED**: show `Warnings` in both states. The count stays in the
  badge. See shared spec §3.1 and §3.5.
- **9.6 Warning-area width — RESOLVED**: the warning area stays inside the content area and never covers either sidebar. See shared spec §3.5.
- **9.7 Submittal Log field map — RESOLVED**: discover required fields from row 1 headers. Read status
  domains and rule text from the workbook `Code` sheet. A missing or repeated required header is fatal
  to the affected views.

- **9.8 Chart regrouping — RESOLVED** (D6/D9): the 14 visuals are consolidated into 6 interactive
  charts (C1–C6); Approval Mix folded into C3, S-Curve Variance into C1, Coverage into C5, Status Funnel
  kept as C2 view. Confirmed in review 2026-10-23.
- **9.9 Staffing model parameter — DEFERRED (awaiting manhour benchmarks)**: the C6 estimator needs a
  `review-hours/document` (discipline-weighted) planner input and optionally a current-FTE input (§4.6).
  The user will provide manhour benchmarks; defer the Staffing page (§4.10) and C6 build until then.
- **9.10 Dashboard UI assets — RESOLVED**: dashboards use project-local CSS and JavaScript. `common/` is not applicable. The harness checks the shell through spec §3.1 markers.

---

## 10. Future Enhancements

- Drill-down from KPI or chart to the detail table (filtered `active`).
- Print-optimized view. Define print behavior in a later approved phase.
- Saved filter presets in `localStorage`.
- Coverage forecast trend (planned first-issue each month compared with actual).

## 11. Data flow by surface (high level)

### 11.1 Pipeline spine (S0–S6)

| Stage | Sub dashboard module | MDL reference | Action |
|---|---|---|---|
| S0/S1 Extract | `engine/xlsx-reader.js` | `xlsx-reader.mjs` | Read both `.xlsx`; parse sheets; no data decision. |
| S2/S3 Process | `engine/pipeline.js` | `pipeline.mjs` `buildModel` | Normalize → `records`; validate once → `issues[]`/`warnings[]`; discard raw; keep `records` + `contract` + `meta`. |
| S4 Calculate | `engine/render.js` | `render.mjs` `deriveView` | Sole aggregation; global filters → single `active`; KPIs, chart series, overdue. |
| S5 Display | `engine/render.js` | `render.mjs` | Write DOM only (§3.8.2 r6). |
| S6 Re-filter | `engine/render.js` | `render.mjs` | Re-run `deriveView` on filter change; no re-parse (§3.8.2 r5). |

### 11.2 Surface summary

| Surface | Reads from | Global filters? | Calculate | Render |
|---|---|---|---|---|
| Side panel | Static page list | No | None (`STATE` only) | Nav + active highlight |
| KPIs (6) | `active` | Yes (re-derived) | S4 | KPI cards (§5) |
| Charts C1–C5 (C6 deferred) | `active` | Yes | S4 | SVG (grid follows shared layout; C1 may span the content width; C6 Staffing estimator deferred — §4.10) |
| Submittals table | `active` + panel-local filter | Yes + local | S4 + local | HTML table + CSV |
| Validation page | `issues[]`/`warnings[]` | No | S2/S3 | List + counts |
| Warning bar | structural fatal + formula strips + `V-xx` issues | No | S2/S3 | `#errBanner` |

### 11.3 Charts — extract / normalise / calculate / display

| Chart | Extract (S0–S2) | Normalise + validate (S2–S3) | Calculate (S4) | Display (S5) |
|---|---|---|---|---|
| **C1 Schedule Performance** (full width) | MDL planned rows and dates + SubmittalLog `Submission Date` | Keep every planned row. Report repeated MDL IDs as `V-26`. Link first valid submission only when the MDL ID is not repeated. | Cumulative planned and forecast rows plus first submissions for unambiguous MDL rows; monthly bars use the same row unit. | SVG curves + bars (`.card.full`) |
| **C2 Submission Flow & Delay** | `Submission Status` + `Review Delay Days` per row | Normalise status via Code sheet; add NFS only for MDL rows without a valid submitted log match | *Stacked*: per-month counts by status + total (optional NFS); *Delay*: monthly avg, not-returned & not-due = 0; *Funnel*: submitted→review→returned→approved | SVG stacked bar / line / funnel |
| **C3 Breakdown** (incl. Approval Mix) | `Discipline` / `Submitted By` + `Approval Status` + `Review Delay Days` + `Resubmission Required` | Normalise status/approval via Code sheet; join submitted↔planned for *Plan vs Actual* | *Count* / *Plan vs Actual* / *Delay* / *Rework* per dimension; *Approval Mix* = APP/AWC/NAP/REJ/INF counts + total | SVG h-bar / donut |
| **C4 Turnaround & Aging** | `Turnaround`, `Review Delay Days`, `Target Return`, `Actual Return` | Pair per submission; flag overdue (Target Return passed, still open) | *Scatter*: turnaround × delay; *Age buckets*: open SUR <30/30–60/60–90/>90 d | SVG scatter / bars |
| **C5 Forward Plan** (Look-ahead + Coverage) | MDL planned/forecast first-issue + Log trend; MDL scope minus Log matches | Normalise dates; compute NFS set | *Look-ahead*: docs due in next 4–8 wks; *Coverage*: NFS count + list | Table + list |
| **C6 Staffing Estimator** — *deferred* | Projected volume (§4.3 + Log trend); `review-hours/document` (Settings input); `productive-hours/reviewer` (Settings) | Planner inputs only — no workbook field | `volume × hrs/doc ÷ hrs/reviewer`; compare with historical throughput | Form + read-only derived FTE |
