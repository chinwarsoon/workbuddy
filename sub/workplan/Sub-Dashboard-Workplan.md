# Submittal Dashboard — Developer Workplan (for Review)

> **Project**: TWRP C3B2 — Document Submittal Log Interactive Dashboard
> **Version**: 0.5 (error-code catalog `V-xx`; V-29 mandatory, V-30/V-31 new)
> **Date**: 2026-10-23
> **Status**: Proposal — no functional code written. A static sample page is in
> `sub/Arch/Document-Submittal-Dashboard-Sample.html`. The page is a review-only mockup. It is not
> wired to Excel.
> **Uses**: the MDL Dashboard architecture (`MDL/MDL-Dashboard-Workplan.md` +
> `MDL/src/{xlsx-reader,pipeline,render}.mjs`) and the shared `Dashboard-UI-Design-Spec.md`.
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

A left side panel gives the primary navigation between views. The dashboard uses a two-row header: a
navy title bar and a white menu bar. The global filters live in the menu bar.

The dashboard follows `Dashboard-UI-Design-Spec.md` as the single source of truth for layout and
style. It reuses the proven MDL ES-module pattern. The pattern is offline and dependency-free. It
reads data with a file-drop step.

---

## 2. Guiding Principles

- **Spec-conformant**: header (§3.1), side panel (§3.2), KPI Overview (§5), warning bar (§3.5),
  status bar (§3.6), and responsive grid (§3.4) follow the shared spec.
- **One `active` set**: global dimensions make a single shared working set with S4 Derive (§7.2.7).
- **Side panel is navigation only**: it does not offer a global filter dimension again (§7.2.7 pt 5–6).
- **Offline and dependency-free**: a single HTML file; data reads from the two workbooks when the dashboard opens.
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

Sheet `SubmittalLog`. Discipline arrives as a group-header row. The S.No is blank. The Subject is in
the known discipline set.

Columns:

| Col | Field |
|---|---|
| A (0) | S.No |
| B (1) | Prolog No. |
| D (3) | Subject (discipline group header) |
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

- Join Submittal Log to MDL on `Document No.` to add stage, system, title, prefix, and vendor.
- The submittal-log discipline (group header) is the authority. The MDL `Document No.` is heavily
  duplicated, so it must not set the discipline.
- Add a `Record Type = "Planned"` shadow row for each MDL document with no matching submission. Use
  it for coverage (planned but not submitted).
- Derived in `ref/build_dataset.py`: `Timeliness` (Delayed if Delay > 0, else On Time),
  `Flag Approved` (APP/AWC = 1), `Flag On Time`, `Flag Delayed`, `Flag Resubmission`, and `Month`
  (first-of-month of Submission Date).
- Normalize Excel serial dates and formula-error tokens (`#VALUE!` and others) in spec §3.8.1. A cell
  with a formula-error token is set to absent and counted per column; one fatal strip per affected column
  shows in `#errBanner` (formula normalization, §3.8.4 — not a `V-xx` code).

### 3.4 Pipeline architecture (spec §3.8) and MDL reference

The sub dashboard reads two `.xlsx` workbooks, so spec §3.8 (mandatory) applies in full. The reference
implementation is MDL: `MDL/src/{xlsx-reader,pipeline,render}.mjs` + `build.mjs`. Use that modular
pattern (spec §3.8.0). Do not hard-code the column tables in §3.1–§3.2 into application code — they are
the documented **contract view**; the pipeline discovers them at runtime (see §3.8.3).

**Stages (spec §3.8.1)**
- S0/S1 `xlsx-reader.mjs` (MDL `xlsx-reader.mjs`): acquire bytes and parse the container. Copy from MDL
  unchanged.
- S2/S3 `pipeline.mjs` (MDL `pipeline.mjs`, `buildModel` l.236): normalize rows to typed `records`;
  validate once; produce `issues[]` and `warnings[]`. No KPI or chart math here (MDL comment l.493–494).
  Discard the raw `workbook` after S2; keep only `records` + `contract` + `meta`.
- S4 `render.mjs` `deriveView` (MDL `render.mjs` l.651): the sole source of KPI, chart, and overdue
  math. It applies the global menu-bar filters to `records` to build the single `active` set, then
  aggregates.
- S5 `render.mjs`: paint the DOM. Write-only — does not read the DOM to decide (spec §3.8.2 rule 6).
- S6 `render.mjs`: on a filter change, re-run `deriveView` only; does not re-read the file (spec §3.8.2 rule 5).

**Mandatory pipeline rules (spec §3.8.2)** — satisfy each; the Tier-1 harness checks several: 1. One
aggregation engine (S4 only). 2. Discard the raw parse after S2. 3. Validate once at load. 4. Derive on
demand, with no I/O. 5. No re-parse on a filter change. 6. Render is write-only. 7. Single `STATE` object
(`render.mjs` `STATE`, MDL `render.mjs` l.809) — no state in DOM attributes. 8. Per-stage `try/catch`
(for each stage transition wrapped; MDL `pipeline.mjs` / `render.mjs`). 9. As-of = the viewer local date,
built from local date parts, does not use `toISOString()` (MDL `pipeline.mjs` l.242–243); project-start is the
S-curve origin only. 10. Blank and formula-error are the same absent state (§3.8.4).

**Contract-driven parsing (spec §3.8.3)** — the workbook's contract sheet is the single source of truth
for field positions, lookup domains, and rule wording. Discover them at runtime; does not hard-code column
letters, row numbers, or allowed-value lists. Use MDL's `Code` sheet (read by `parseCodeSheet`,
`buildFieldToCol`, `findLookupColumns` in MDL `pipeline.mjs` l.151 / l.166 / l.193) for the MDL-scope
fields. The Submittal Log needs its own field discovery, resolved in the same way. The §3.1–§3.2 column
tables are the documented contract, not constants in code.

**Value normalization (spec §3.8.4)** — treat a blank or a formula-error token as absent (`undefined`).
Use a shared `isExcelError(v)` predicate (MDL `pipeline.mjs` l.52, `EXCEL_ERROR_TOKENS` l.48). Accumulate
a per-column error count and show one fatal strip per affected column in `#errBanner` (MDL `pipeline.mjs`
l.381). This is a parse step, not a `V-xx` code, and is not pushed to `model.issues`.

**Testability (spec §3.8.5)** — ship `test/test_pipeline.mjs` that imports `pipeline.mjs` directly and
asserts, against the real workbooks: record count, KPI values, lookup-table contents (proving no
hard-coded lists), validation issue counts, and that each rule's message and severity come from the
workbook. It must pass before release. `harness-layout` imports `pipeline.mjs` for Tier-3 ground truth
and compares it with the rendered DOM.

---

## 4. Dashboard Modules

### 4.0 App shell and layout

- **Two-row header (§3.1)**: the dashboard ships the two-row header. Row 1 is the **title bar**; Row 2
  is the **menu bar**. The two rows scroll and stay as one unit (sticky, `top:0`, `z-index:31`). The app
  bar sits above the warning bar (`z-index:30`, §3.5).
- **Sidebar (§3.2)**: a left column **below** the two-row header (its `top` equals the rendered header
  height). It is navigation only (Decision D1). A 1 px lighter-navy vertical divider makes its right
  edge; this divider separates the side panel from the content area. The header's bottom edge (navy
  title bar to white menu bar) is the horizontal divider from the menu bar. The side-panel toggle is not
  in the sidebar — it lives in the menu bar (see §4.1).
- **z-index order**: app bar `31`; warning bar `30`; sidebar `20`; status bar `40`. The warning bar
  spans the content area (from the sidebar's right edge to the right edge), so it does not overlap the
  side panel. The app bar stays above the warning bar, so the menu-bar toggle and filter dropdowns clear
  the banner.
- **Sidebar is bounded by the header and the status bar**: `top:var(--appbar-h)` (below the two-row
  header) and `bottom:var(--statusbar-h)` (above the status bar). It therefore never runs behind the
  full-width status bar (§3.6), and the two fixed elements do not overlap.
- **Status bar `.status-bar` (§3.6)**: mandatory, reused from MDL. It is **full width** (`left:0;
  right:0`), spanning the entire viewport including beneath the sidebar — the spec §3.6 default,
  confirmed in review. Content reserves clearance via the content wrapper `padding-bottom` (§3.3).
- **Warning bar `#errBanner` (§3.5)**: mandatory, reused from MDL (`applyBannerState` resolver,
  dismissible, `localStorage` key `<dashboard>_hideWarnings`). The warning bar adapts the spec §3.5
  full-width rule to the side-panel layout: it sits just below the menu bar and spans the content area,
  not across the sidebar. This removes the overlap with the side panel and is documented here as a
  deviation from the strict full-width rule (Open Question §9.6).
- **Content area (§3.3)**: to the right of the sidebar; centered `max-width:1320px`; KPI Overview
  first; the disclaimer footer is the last child inside the content wrapper.
- **Two-column panel grid collapses to one column under 880 px** (spec §3.4): the Overview KPI strip and
  the C1–C6 chart panels use a 2-column `grid-2` that falls back to a single column on narrow screens,
  so every page stays usable without forcing one-screen fit at all widths.
- **S-curve is full width**: the Schedule Performance chart (C1, §4.3) is the one full-width panel —
  `grid-2` is bypassed for it, mirroring the spec §4.2 combined-chart `.card.full` rule. All other
  chart panels are 2-column.

### 4.1 Header — Title bar and Menu bar (two-row) — DECISION CAPTURED

**Decision (D4)**: ship the two-row header (spec §3.1 two-row variant). The dashboard records this
deviation here, as §3.1 requires. Rationale: the title block and the five global dimensions require the
space; a single row is overcrowded.

**Row 1 — Title bar (§3.1)**: navy (`--navy`), white text. Logo + title block `.ttl` (17 px / 600; can
break to two lines) + meta line (`workbook · as-of · refresh`, 11 px, opacity .85). It carries **no
action buttons** (normative).

**Row 2 — Menu bar (§3.1)**: white background (`#fff`), text `--text`. It has two parts — a left
actions cluster and a right filter group:
- **Left actions cluster**: the A1 Primary CTA = **Load Data** (opens the two-workbook dropzone) plus
  a secondary **Export** action.
- **Right filter group**: the global-dimension chips (Discipline, Stage, Submission Status, Approval
  Status, Submitted By), a **Search** trigger (popover, single row), and a **Warnings** toggle.
- **Side-panel toggle**: a borderless `☰` toggle at the left of the menu bar. It collapses or expands
  the left navigation. It lives in the header, so it is always visible above the warning bar; no separate
  reopen button is needed.

**Menu-bar chrome (normative, §3.1)**: controls are borderless, icon-free, text-only. The side-panel
toggle follows the same chrome. A count shows as
a parenthetical on a chip; the warning count shows as a badge. Controls highlight on hover with a soft
tint. The **only filled element is the Primary CTA** (`--blue`); a pressed or `aria-pressed` state
keeps its fill.

**Global dimensions (§7.2.7)**: the chips are the dashboard's global dimensions. One selection
re-derives the single `active` set for each panel (S4 Derive, the first gate). They live only here —
not in the sidebar (D1) or a panel.

**Search (§3.1)**: a trigger, not an inline box. Its popover lays out in one row — a column selector,
an elongated field (≥ 200 px), and Find / Reset (popover up to ~640 px). Tier 4f `lintSearchPanel`
enforces this.

**Warnings toggle (§3.5)**: a `<button>` in the header, immediately after the Search control. It
renders only when one or more notices are present. It shows a count badge (`⚠ N`) and a text label
(`Warnings` when open, `Show warnings` when collapsed). It exposes `aria-pressed` and a dynamic
`aria-label` (no count restated). A click flips the persisted `<dashboard>_hideWarnings` pref and
re-runs `applyBannerState`. (Note: §3.1 line 122–126 says the label must not change with state, but
§3.5 line 217 says it becomes `Show warnings` when collapsed; this workplan follows §3.5. See Open
Question §9.5.)

**Sticky as one unit**: the two rows stay together at `top:0`. The app bar (`z-index:31`) stays above
the warning bar (`z-index:30`), so a filter dropdown clears the banner when it opens.

### 4.2 Side Panel (navigation) — DECISION CAPTURED

**Decision (D1)**: the dashboard ships a left sidebar (spec §3.2 permits it; MDL deferred it — this
dashboard builds it to satisfy your requirement). The sidebar is navigation only. It switches pages.
It does not host a row filter. It sits below the two-row header.

**No repeat of global filters**: the global filter dimensions (Discipline, Stage, Submission Status,
Approval Status, Submitted By, and Search) live ONLY in the menu bar (Row 2). The sidebar does not name
a page after a filter dimension. It does not offer a filter control. This respects §7.2.7: a panel or
the sidebar must not offer a global dimension again. The earlier draft named pages "Submission Status",
"By Discipline", and "Approval and Timeliness". Those overlapped the global filters, so they are
removed.

Sidebar contents:
- Brand or project label at top.
- Nav items (page switcher), in order: **Overview** → **Submittals** → **Validation** → **Analytical**
  → **Staffing** *(deferred — §4.10)* → (spacer) → **Settings** → **Help**. Each item opens one page
  (§4.3 Overview, §4.4 Submittals, §4.5 Validation, §4.9 Analytical, §4.10 Staffing, §4.6 Settings,
  §4.7 Help). No item equals a global filter name. (**Staffing** is specified but deferred pending
  manhour benchmarks; it is not scheduled for build yet.)
- **Settings and Help are pinned to the bottom of the sidebar** (`margin-top:auto` on the Settings item,
  so both sit flush to the bottom edge above the status bar, with the five content pages grouped above).
- The sidebar collapses to icon-only or hides below 880 px (§3.4). The menu-bar toggle (§4.1) opens or
  closes it. No toggle lives in the sidebar.
- Active item highlighted; selection sets the page that renders in the content area.
- z-index `20`; the sidebar is below the app bar and above the status bar (§4.0).

### 4.3 Overview page (KPI Overview and charts)

KPI Overview (§5): first panel, title `KPI OVERVIEW`, inline `?` (help, left) and `−` (collapse,
right). Six KPIs (6-col grid ≥ 1100 px, 3-col 880–1099 px, 2-col < 880 px):

| KPI | Source |
|---|---|
| Total Submissions | count of Submittal Log rows |
| Documents Submitted divided by In Plan | submitted divided by MDL scope (coverage %); MDL scope counted by Document No., duplicates ignored |
| Under Review (SUR) | count where Submission Status = SUR |
| Approved (APP+AWC) | count where Approval Status in {APP, AWC} |
| On-Time Return Rate | `Flag On Time` average |
| Avg Review Delay | `Review Delay Days` average (0 when not yet returned and not due) |

Overview charts — three **combined interactive charts** (SVG, dependency-free, MDL `render.mjs` chart
kit). Each chart carries its own control cluster (§4.1 / spec §4.2) and re-renders `deriveView` on the
single `active` set (S4); no DOM recompute. The global Discipline filter still applies across each chart.

- **C1 Schedule Performance (S-Curve) — full width** (`.card.full`, spec §4.2): the MDL planned
  first-issue curve and a forecast curve compared with the actual cumulative submissions; monthly bars
  show plan and actual per month. Counts use the MDL discipline-sheet **Document No.** column; duplicate
  document numbers are ignored; MDL ↔ Log link by Document No. **Controls**: *Cumulative* ↔ *Per
  Discipline* toggle (Per Discipline = the former S-Curve Variance view) and *Plan* / *Forecast* /
  *Actual* series checkboxes. This is the one full-width panel on the page.
- **C2 Submission Flow & Delay** (2-col): the monthly submission flow. **Controls**: view toggle
  *Stacked* (per-month status split: SUR/RTR/NTS/NFS, with an *Include NFS* toggle and a total) ↔
  *Delay* (monthly average `Review Delay Days`, not-yet-returned and not-due = `0`) ↔ *Funnel* (the
  former Status Funnel: Submitted → In Review → Returned → Approved drop-off).
- **C3 Breakdown** (2-col): a single split-by-dimension panel. **Controls**: dimension toggle
  *Discipline* ↔ *Submitter*; metric toggle *Count* / *Plan vs Actual* / *Delay* / *Rework* /
  *Approval Mix* (the former Approval Mix donut is now a metric option, with its total in the centre).
  Overdue / lag cells are flagged.

**Regrouping note**: the earlier seven Overview charts plus the analytical panels are consolidated into
six interactive charts (C1–C6). Folded here: *Approval Mix* → C3 "Approval Mix" metric; *S-Curve
Variance* → C1 "Per Discipline" view; the standalone *Coverage* panel → C5 "Coverage" view (§4.9). Net
14 separate visuals → 6 charts (C1 full width, C2–C5 in 2-col grids, C6 on the Staffing page).

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
code, Group, Rule, or Severity). The sub dashboard appends `V-29`…`V-31` for rules new to the
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
| V-26 | Duplicate `Document No.` within active records | per Code sheet | Reuse |
| V-27 | `As-Built` / `Vendor Data` not in {YES,NO} | per Code sheet | MDL-only |
| V-28 | 1st-issue date precedes declared project start | per Code sheet | Reuse if sub has project start |
| **V-29** | **Orphan**: Submittal Log `Document No.` not present in MDL scope | Warning | **New — mandatory** |
| **V-30** | `Actual Return` or `Target Return` earlier than `Submission Date` | Warning | **New** |
| **V-31** | Status conflict: `Approval Status` present while `Submission Status` = NFS; or `Resubmission Required` = Yes while `Submission Status` ∉ {RTR,REJ} | Warning | **New** |

**New sub codes (append to the same four columns)** — define `Group`, `Rule`, and `Severity` explicitly;
these are new rows, not changes to existing `V-01`…`V-28` values:

| Error Code | Group | Rule | Severity | Note |
|---|---|---|---|---|
| **V-29** | Referential | Submittal Log `Document No.` must exist in MDL scope; otherwise the row is an orphan | Warning | **New — mandatory** |
| **V-30** | Timeline | `Actual Return` / `Target Return` must not precede `Submission Date` | Warning | **New** |
| **V-31** | Cross-field | `Approval Status` present while `Submission Status` = NFS; or `Resubmission Required` = Yes while `Submission Status` ∉ {RTR,REJ} | Warning | **New** |

**Excel edit guide (how to add V-29…V-31)** — open each workbook, go to the `Code` sheet, and append
three rows after the last `V-xx` row. The error block starts at row 1 with the headers `Error Code`,
`Group`, `Rule`, `Severity` (discovered by label, so the column letters below are only to help you find
them). Do **not** change the headers or any existing `V-01`…`V-27` row — appending rows is safe for MDL.

| Workbook | `Error Code` | `Group` | `Rule` | `Severity` | Rows to add |
|---|---|---|---|---|---|
| Master Document List | AI | AJ | AK | AL | 29, 30, 31 |
| Document Submittal Log | K | L | M | N | 29, 30, 31 |

Enter, per row, the four values (`Error Code` · `Group` · `Rule` · `Severity`):
- `V-29` · `Referential` · `Submittal Log Document No. not found in MDL scope — orphan (submitted but not in the plan)` · `Warning` — mandatory
- `V-30` · `Timeline` · `Actual Return or Target Return earlier than Submission Date` · `Warning`
- `V-31` · `Cross-field` · `Approval Status present while Submission Status = NFS; or Resubmission Required = Yes while Submission Status ∉ {RTR,REJ}` · `Warning`

Both the `MDL/` and `sub/` copies carry the same workbooks; the sub dashboard reads the `sub/` copies, so
update the `Code` sheet in **both** folders for each workbook. Run the dashboard's `harness-layout`
Tier-1/3 after the edit to confirm the codes are picked up.

**Status**: updated manually on 2026-10-23 and verified — all four `Code` sheets (`MDL/` and `sub/`,
Master Document List and Submittal Log) contain `V-01`…`V-31` with the labels `Error Code` / `Group` /
`Rule` / `Severity`; the existing `V-01`…`V-27` rows are unchanged.

**Notes**
- MDL duplicate `Document No.` is **ignored for counting** (silent deduplicate); `V-26` applies to the
  Submittal Log.
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
- Default workbook paths (MDL and Submittal Log) for faster load.

### 4.7 Help page

- How to use the dashboard: load the two workbooks, use the menu-bar filters, and switch pages.
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
and two combined interactive charts (2-col grid).

**Bottleneck KPI strip (6 cards)**: Overdue (past Target Return, still open) · Open SUR older than 60 d ·
Rework Rate (RTR / resubmission) · Avg Cycle (return→approval) · Look-ahead (docs due in next 4 wks) ·
Required Review FTE (Dec) — the last is the staffing hand-off to §4.10 (deferred — see §9.9).

- **C4 Turnaround & Aging** (2-col): process-time analysis. **Controls**: *Scatter* (turnaround days on
  x, review-delay days on y, one point per submission) ↔ *Age buckets* (open SUR split <30 / 30–60 /
  60–90 / >90 d; overdue = past Target Return still open). Surfaces the bottleneck stage and where time
  is lost.
- **C5 Forward Plan** (2-col): the forward/coverage view. **Controls**: *Look-ahead* (documents due by
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
- No duplicate global filter dimensions (§7.2.7): sidebar is navigation, menu bar holds filters.
- Conformance record (spec §8): fill the §8 record in this workplan after build.

---

## 6. Technical Architecture

### 6.1 Stack decision (recommended)

**Adopted (recommended)**: port the MDL Node ES-module pattern — `xlsx-reader.mjs` + `pipeline.mjs`
+ `render.mjs` bundled by `build.mjs` into one offline HTML. The two workbooks read when loaded with
a dropzone (single dropzone that accepts the two files, or two labeled pickers). This matches your
"refer to MDL" direction. It is the only fully spec-conformant build.

**Note**: `AGENTS.md` §1.1 lists `sub/` as "Python build, HTML output" (the existing
`sub/ref/build_dataset.py` + `build_dashboard.py` generator). If you use the Python generator
path, the data model in §3 applies. Only §6.2–§6.3 change. Recorded as Open Question §9.1.

### 6.2 File structure (Node path)

```
sub/
  src/xlsx-reader.mjs      (copy from MDL, unchanged)
  src/pipeline.mjs          (Submittal-specific model + S4 derive)
  src/render.mjs            (two-row header — title bar + menu bar, side panel nav, KPI, charts, coverage, detail table, bars)
  build.mjs                 (bundle -> standalone HTML)
  TWRP C3B2 - Document Submittal Dashboard.html   (output)
  workplan/Sub-Dashboard-Workplan.md
  test/test_pipeline.mjs, test_render.mjs
```

### 6.3 Build

`node build.mjs` concatenates the three modules (strips `import`/`export`), inlines into one
`<script type="module">`, embeds the logo as base64, and writes the standalone HTML. Build fails if
the bundle does not parse (mirrors MDL `build.mjs`).

---

## 7. Workplan (Waves)

| Wave | Task | Output |
|---|---|---|
| 1 | Write this workplan; get approval | `sub/workplan/Sub-Dashboard-Workplan.md` |
| 2 | Copy `xlsx-reader.mjs` into `sub/src/` | `sub/src/xlsx-reader.mjs` |
| 3 | Write `pipeline.mjs` (column maps, join on `Document No.`, derived fields, S4 derive, formula normalization §3.8.4, and validation: reuse the Code-sheet `V-01`…`V-28` catalog and implement the new `V-29` orphan-linkage, `V-30` return-before-submission, `V-31` status-conflict checks — read each rule's message and severity from the `Code` sheet, never hard-coded) | `sub/src/pipeline.mjs` |
| 4 | Write `render.mjs` (two-row header — title bar + menu bar, side panel nav with Settings/Help pinned bottom (Staffing item deferred — §4.10), KPI Overview, combined charts **C1–C5** on Overview + Analytical — C1 full width, C2–C5 in 2-col grids; the Staffing page and **C6** estimator are deferred pending manhour benchmarks; detail table, validation list, bars) — render each chart's control cluster and re-run `deriveView` on toggle/filter | `sub/src/render.mjs` |
| 5 | Write `build.mjs`; build the HTML | `sub/TWRP C3B2 - Document Submittal Dashboard.html` |
| 6 | Add `test/test_pipeline.mjs` (assert record count, KPI values, lookup-table contents — proving no
  hard-coded lists — validation issue counts, and that each rule's message and severity come from the
  workbook) and `test/test_render.mjs`; run `harness-layout` (Tier 1 structural, Tier 3 data + filter
  ground truth); confirm `V-29`/`V-30`/`V-31` appear in `issues[]` and render in the Validation page and
  `#errBanner`; fill §8.1 conformance | tests + record |
| 7 | Manual review of two-workbook load UX; adjust | final HTML |

---

## 8. Decisions Captured from Review

- **D1 — Side panel is navigation only** (§4.1). Left sidebar switches pages; global filters stay in
  the top bar. No page name equals a global filter dimension. The earlier overlap (pages named
  Submission Status, By Discipline, Approval and Timeliness) is removed. Rationale: spec §7.2.7
  forbids offering a global dimension again.
- **D2 — Two workbooks read when loaded** (§6.1). MDL = scope, Submittal Log = history; joined on
  Document No. with submittal-log discipline as authority.
- **D3 — Existing `sub/ref/` prototype preserved** (§2). New artifact, no overwrite.
- **D4 — Two-row header (title bar + menu bar)** (§4.1). The dashboard ships the spec §3.1 two-row
  variant; the deviation is recorded here as §3.1 requires. Row 1 is the navy title bar (no action
  buttons). Row 2 is the white menu bar: left actions cluster (Load Data CTA + Export) and right filter
  group (five global-dimension chips + Search + Warnings). The side panel is navigation only and sits
  below the two-row header (D1). The global filters live only in the menu bar. The side-panel toggle lives in the menu bar (Row 2), not
in the sidebar, to avoid overlap with the warning bar.
- **D5 — Contract-driven parsing (spec §3.8.3)** (§3.4). Field positions, lookup domains, and rule
  wording come from the workbook's contract sheet at runtime, not from hard-coded column letters in
  application code. Use MDL's `Code` sheet for the MDL-scope fields; discover the Submittal Log fields
  the same way. The §3.1–§3.2 tables are the documented contract, not constants. This removes the §3.8.3
  conflict in the earlier draft.

- **D6 — Six combined interactive charts (C1–C6) replace 14 separate visuals** (§4.3, §4.9, §4.10).
  The Overview's seven charts and the Analytical's seven panels are regrouped by shared question:
  C1 Schedule Performance (full-width S-curve) · C2 Submission Flow & Delay · C3 Breakdown (incl.
  Approval Mix) · C4 Turnaround & Aging · C5 Forward Plan (Look-ahead + Coverage) · C6 Staffing
  Estimator. Each chart has a control cluster (toggle/view) and re-renders `deriveView` on `active`
  (S4 only — no DOM recompute), reusing MDL's SVG chart kit. Net 14 → 6.
- **D7 — Staffing is its own side-menu page** (§4.2, §4.10). The manhour/staffing analysis (C6) is a
  separate **Staffing** nav item, not folded into Analytical, so the capacity question is reviewed on
  its own with its own KPI strip. The menu label **Analytical** is retained. **Deferred**: scheduled
  only after the user supplies manhour benchmarks (§9.9); the menu item and C6 spec are retained.
- **D8 — Layout settled** (§4.0): the status bar is **full width** (spec §3.6 default); the sidebar is
  bounded **between** the header (`top:var(--appbar-h)`) and the status bar (`bottom:var(--statusbar-h)`)
  so the two fixed elements never overlap; the S-curve (C1) is the one full-width panel; the 2-col panel
  grid collapses to 1 col under 880 px (spec §3.4). Settings/Help are pinned to the sidebar bottom.
- **D9 — Redundancy folded, not lost** (§4.3, §4.9): *Approval Mix* → C3 "Approval Mix" metric;
  *S-Curve Variance* → C1 "Per Discipline" view; standalone *Coverage* panel → C5 "Coverage" view. The
  Status Funnel is **kept** as the C2 "Funnel" view (distinct stage drop-off). No chart is dropped
  outright — each original question remains reachable.

### 8.1 Spec §3.8 conformance record

| Spec clause | Where satisfied | Status |
|---|---|---|
| §3.8.0 modular `src/` + `build.mjs` | §6.1–6.3, file structure | Planned (Wave 2–5) |
| §3.8.1 stages S0–S6 | §3.4, Wave 2–5 | Planned |
| §3.8.1 S4 sole KPI source | §3.4, §5 | Planned |
| §3.8.2 rules 1–10 | §3.4 (rules 5, 6,7,8,9 cited to MDL) | Planned |
| §3.8.3 contract-driven parsing | §3.4; reuse MDL `Code` sheet | Planned — removes hard-code risk in §3.1–§3.2 |
| §3.8.4 formula normalization (`isExcelError`) + `V-xx` validation | §3.4, §4.5; MDL `pipeline.mjs` l.52 / l.381 | Planned |
| §3.8.5 test harness | Wave 6; `test/test_pipeline.mjs` + `harness-layout` | Planned |

Filled after build (Wave 6).

Chart panels follow spec §4.2 (combined chart panels; C1 is `.card.full`; each chart's control cluster
is owned by the chart card per §4.1). The 2-col panel grid uses spec §3.4 responsive collapse.

### 8.2 Spec-compliance gate (mandatory before build sign-off)

The **sample HTML is a static review mockup only** — the user found spec-non-conformant spots in it during
review. It is **not** the build source of truth. When the real submittal dashboard is built (`render.mjs`,
Waves 3–4 and 6), **every UI detail must be verified against `Dashboard-UI-Design-Spec.md` before sign-off**.
Use the checklist below; cite the spec clause for each item.

| # | Item to verify | Spec clause |
|---|---|---|
| 1 | App bar: two-row, full width, `z-index:31`, above the warning bar | §3.1 |
| 2 | Sidebar bounded between header and status bar (`top:var(--appbar-h)`, `bottom:var(--statusbar-h)`); `z-index:20`; collapses <880 px | §3.2, §3.4 |
| 3 | Status bar full width (`left:0;right:0`), `z-index:40` | §3.6 |
| 4 | Warning bar full width per spec — **our content-width is a documented deviation (§9.6); call it out at sign-off** | §3.5, §9.6 |
| 5 | 2-col panel grid collapses to 1 col <880 px; KPI strip collapses <560 px | §3.4 |
| 6 | S-curve (C1) is the only full-width panel (`.card.full`); other chart panels are 2-col | §4.2, §4.1 |
| 7 | Filter chips / chart control clusters owned by the card; re-render `deriveView` on `active` only (no DOM recompute) | §4.1, §4.3 |
| 8 | KPI labels and glossary terms match the §2 glossary exactly | §2, §4.0 |
| 9 | Validation rules (incl. V-29/30/31) wired via MDL `pipeline.mjs` resolver | §3.8, §4.5 |
| 10 | STE prose lint (`harness-writing/ste-lint.mjs`) on docs + dashboard visible text passes the advisory threshold | `harness-writing` |

**Gate rule**: no Wave-4 build is signed off until each row above is checked against the spec and the
clause is cited. The sample HTML's shortcuts (static toggles, read-only inputs, placeholder data, any
layout drift) are accepted in the mockup but **must not** carry into the real build.

---

## 9. Open Questions and Assumptions

- **9.1 Stack**: Node (recommended, §6.1) compared with the declared "Python build" stack
  (`AGENTS.md` §1.1). Approve before Wave 2.
- **9.2 Load UX**: single dropzone that accepts the two files compared with two labeled pickers.
  Recommend a single dropzone that detects each workbook by sheet signature.
- **9.3 Output filename/location**: `sub/TWRP C3B2 - Document Submittal Dashboard.html` (new file).
- **9.4 Sample page**: `sub/Arch/Document-Submittal-Dashboard-Sample.html` is a static review mockup
  only; it is not wired to Excel and will be replaced by the built dashboard. It is **known to contain
  spec-non-conformant spots** (found in user review) and is **not** the build source of truth — the real
  build must conform to `Dashboard-UI-Design-Spec.md` per the §8.2 gate.
- **9.5 Warning-toggle label**: spec §3.1 (line 122–126) says the toggle label must not change with
  state, but §3.5 (line 217) says it becomes `Show warnings` when collapsed. This workplan follows
  §3.5 for the toggle label. Resolve the conflict in the spec, then confirm the build.
- **9.6 Warning-bar width with side panel**: spec §3.5 says the warning bar is full width. With a side
  panel, the bar spans the content area (right of the sidebar) to avoid overlap. This is a documented
  adaptation of §3.5; check it against the spec or raise a spec change.
- **9.7 Submittal Log contract sheet**: §3.8.3 needs a contract sheet as the source of truth. MDL already
  ships a `Code` sheet (used for MDL-scope fields). Check whether the Submittal Log gets its own
  contract rows on the MDL `Code` sheet, or a new sheet.

- **9.8 Chart regrouping — RESOLVED** (D6/D9): the 14 visuals are consolidated into 6 interactive
  charts (C1–C6); Approval Mix folded into C3, S-Curve Variance into C1, Coverage into C5, Status Funnel
  kept as C2 view. Confirmed in review 2026-10-23.
- **9.9 Staffing model parameter — DEFERRED (awaiting manhour benchmarks)**: the C6 estimator needs a
  `review-hours/document` (discipline-weighted) planner input and optionally a current-FTE input (§4.6).
  The user will provide manhour benchmarks; defer the Staffing page (§4.10) and C6 build until then.
- **9.10 Status-bar / sidebar overlap — RESOLVED** (D8): status bar is full width (spec §3.6); the
  sidebar is bounded between header and status bar, so no overlap. (Distinct from §9.6, the warning-bar
  content-width deviation, which stands.)

---

## 10. Future Enhancements

- Drill-down from KPI or chart to the detail table (filtered `active`).
- Print-optimized view (bars and side panel hidden on print in §3.5 and §3.6).
- Saved filter presets in `localStorage`.
- Coverage forecast trend (planned first-issue each month compared with actual).

## 11. Data flow by surface (high level)

### 11.1 Pipeline spine (S0–S6)

| Stage | Module (MDL ref) | Action |
|---|---|---|
| S0/S1 Extract | `xlsx-reader.mjs` | Read both `.xlsx`; parse sheets; no data decision. |
| S2/S3 Process | `pipeline.mjs` `buildModel` (l.236) | Normalise → `records`; validate once → `issues[]`/`warnings[]`; discard raw; keep `records` + `contract` + `meta`. |
| S4 Calculate | `render.mjs` `deriveView` (l.651) | Sole aggregation; global filters → single `active`; KPIs, chart series, overdue. |
| S5 Display | `render.mjs` | Write DOM only (§3.8.2 r6). |
| S6 Re-filter | `render.mjs` | Re-run `deriveView` on filter change; no re-parse (§3.8.2 r5). |

### 11.2 Surface summary

| Surface | Reads from | Global filters? | Calculate | Render |
|---|---|---|---|---|
| Side panel | Static page list | No | None (`STATE` only) | Nav + active highlight |
| KPIs (6) | `active` | Yes (re-derived) | S4 | KPI cards (§5) |
| Charts C1–C5 (C6 deferred) | `active` | Yes | S4 | SVG (C1 full width; C2–C5 in 2-col grids; C6 Staffing estimator deferred — §4.10) |
| Submittals table | `active` + panel-local filter | Yes + local | S4 + local | HTML table + CSV |
| Validation page | `issues[]`/`warnings[]` | No | S2/S3 | List + counts |
| Warning bar | structural fatal + formula strips + `V-xx` issues | No | S2/S3 | `#errBanner` |

### 11.3 Charts — extract / normalise / calculate / display

| Chart | Extract (S0–S2) | Normalise + validate (S2–S3) | Calculate (S4) | Display (S5) |
|---|---|---|---|---|
| **C1 Schedule Performance** (full width) | MDL discipline sheets (Document No., planned dates) + SubmittalLog `Submission Date` | Normalise dates to months; count by Document No.; ignore MDL duplicates; link MDL↔Log by Document No. | Cumulative curves (plan, forecast, actual) + monthly bars; *Per Discipline* view re-slices the same series | SVG curves + bars (`.card.full`) |
| **C2 Submission Flow & Delay** | `Submission Status` + `Review Delay Days` per row | Normalise status via Code sheet; add NFS from MDL scope lacking a Log match | *Stacked*: per-month counts by status + total (optional NFS); *Delay*: monthly avg, not-returned & not-due = 0; *Funnel*: submitted→review→returned→approved | SVG stacked bar / line / funnel |
| **C3 Breakdown** (incl. Approval Mix) | `Discipline` / `Submitted By` + `Approval Status` + `Review Delay Days` + `Resubmission Required` | Normalise status/approval via Code sheet; join submitted↔planned for *Plan vs Actual* | *Count* / *Plan vs Actual* / *Delay* / *Rework* per dimension; *Approval Mix* = APP/AWC/NAP/REJ/INF counts + total | SVG h-bar / donut |
| **C4 Turnaround & Aging** | `Turnaround`, `Review Delay Days`, `Target Return`, `Actual Return` | Pair per submission; flag overdue (Target Return passed, still open) | *Scatter*: turnaround × delay; *Age buckets*: open SUR <30/30–60/60–90/>90 d | SVG scatter / bars |
| **C5 Forward Plan** (Look-ahead + Coverage) | MDL planned/forecast first-issue + Log trend; MDL scope minus Log matches | Normalise dates; compute NFS set | *Look-ahead*: docs due in next 4–8 wks; *Coverage*: NFS count + list | Table + list |
| **C6 Staffing Estimator** — *deferred* | Projected volume (§4.3 + Log trend); `review-hours/document` (Settings input); `productive-hours/reviewer` (Settings) | Planner inputs only — no workbook field | `volume × hrs/doc ÷ hrs/reviewer`; compare with historical throughput | Form + read-only derived FTE |
