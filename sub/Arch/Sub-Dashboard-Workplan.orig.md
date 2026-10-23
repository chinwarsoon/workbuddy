# Submittal Dashboard — Developer Workplan (for Review)

> **Project**: TWRP C3B2 — Document Submittal Log Interactive Dashboard
> **Version**: 0.1 (proposal, awaiting approval)
> **Date**: 2026-10-22
> **Status**: Proposal — **NO functional code written yet.** A static sample page lives in
> `sub/Arch/Document-Submittal-Dashboard-Sample.html` (review-only mockup, not wired to Excel).
> **Mirrors**: the MDL Dashboard architecture (`MDL/MDL-Dashboard-Workplan.md` +
> `MDL/src/{xlsx-reader,pipeline,render}.mjs`) and the shared `Dashboard-UI-Design-Spec.md`.

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

The dashboard gives a **standalone, interactive summary of document submittals** drawn from two
workbooks:

1. **Master Document List (MDL)** — the full scope of documents to be submitted (forward plan).
2. **Document Submittal Log** — the actual submission history and status of each lodged document.

The dashboard shows submission counts, status mix, review turnaround and delay, approval outcome,
on-time performance, and a coverage view (how many planned documents have a submission versus those
still pending). A **left side panel** provides primary navigation between views.

The dashboard follows `Dashboard-UI-Design-Spec.md` as the single source of truth for layout and
style, and reuses the proven MDL ES-module pattern (offline, dependency-free, file-drop load).

---

## 2. Guiding Principles

- **Spec-conformant**: header (§3.1), side panel (§3.2), KPI Overview (§5), warning bar (§3.5),
  status bar (§3.6), responsive grid (§3.4) all follow the shared spec.
- **One `active` set**: global dimensions produce a single shared working set via S4 Derive (§7.2.7).
- **Side panel = navigation only**: it never re-offers a global filter dimension (§7.2.7 pt 5–6).
- **Offline & dependency-free**: single HTML file; data loads from the two workbooks at runtime.
- **Archive-before-delete**: the existing `sub/ref/` Monthly Submissions prototype is preserved;
  this is a new artifact, not an overwrite.

---

## 3. Excel Data Structure & Contract

Two source workbooks live in `sub/`:

- `TWRP C3B2 - Master Document List.xlsx`
- `TWRP C3B2 - Document Submittal Log.xlsx`

### 3.1 Master Document List (scope)

11 discipline sheets: `Project`, `Construction`, `QAQC`, `ICA`, `Process`, `BS`, `Mech`, `Piping`,
`Electrical`, `CSA`, `BIM`. The **sheet name is the discipline authority**; column C is often blank.
Columns (0-indexed, per `sub/ref/build_dataset.py`):

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

Sheet `SubmittalLog`. Discipline arrives as a **group-header row** (S.No blank, Subject in the known
discipline set). Columns:

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
- Submission: `SUR` under SO review · `RTR` returned for resubmission · `NTS` no resubmission required
  · `NFS` not yet submitted (MDL only).
- Approval: `APP` approved · `AWC` approved with comments · `NAP` not approved · `REJ` rejected ·
  `INF` for information.

### 3.3 Join & derived fields

- Join Submittal Log → MDL on `Document No.` to enrich stage / system / title / prefix / vendor.
  The submittal-log discipline (group header) is authoritative; MDL `Document No.` is heavily
  duplicated, so it must not drive discipline assignment.
- Add a `Record Type = "Planned"` shadow row for each MDL document with **no** matching submission,
  for coverage (planned-but-not-submitted).
- Derived per `ref/build_dataset.py`: `Timeliness` (Delayed if Delay > 0 else On Time),
  `Flag Approved` (APP/AWC = 1), `Flag On Time`, `Flag Delayed`, `Flag Resubmission`, `Month`
  (first-of-month of Submission Date).
- Normalize Excel serial dates and formula-error tokens (`#VALUE!` etc.) per spec §3.8.1; raise a
  fatal `W-FORMULA` notice per affected column in `#errBanner`.

---

## 4. Dashboard Modules

### 4.0 App shell

- **Header (§3.1)**: sticky navy bar. Brand block (logo + title `Document Submittal Dashboard` +
  meta line: workbook · as-of · refresh). Right cluster: global filter chips (Discipline, Stage,
  Submission Status, Approval Status, Submitted By), Search trigger (popover, single row per §3.1),
  Warnings toggle.
- **Content area (§3.3)**: centered `max-width:1320px`, vertical stack of panels; KPI Overview first.
- **Footer (§3.3)**: disclaimer footer as last child of the content wrapper.
- **Warning bar `#errBanner` (§3.5)** and **status bar `.status-bar` (§3.6)**: mandatory, reused
  from MDL (`applyBannerState` resolver, dismissible, `localStorage` pref).

### 4.1 Side Panel (navigation) — DECISION CAPTURED

**Decision**: the dashboard ships a **left sidebar** (spec §3.2 permits it; MDL deferred it — this
dashboard implements it per your requirement). The sidebar is **navigation only**:
it switches the main content between views and never hosts a row filter. This respects §7.2.7
(a panel or the sidebar must not re-offer a global dimension; global filters stay in the top bar).

Sidebar contents:
- Brand / project label at top.
- Nav items (view switcher): **Overview** · **Submission Status** · **By Discipline** ·
  **Approval & Timeliness** · **Document Detail**.
- Collapse control; sidebar collapses to icon-only (or hides) under 880 px (§3.4), content margin
  follows `--sidebar-w`.
- Active item highlighted; selection drives which panel set renders in the content area.

### 4.2 KPI Overview (§5)

First panel, title `KPI OVERVIEW`, inline `?` (help, left) and `−` (collapse, right). Six KPIs
(6-col grid ≥ 1100 px, 3-col 880–1099 px, 2-col < 880 px):

| KPI | Source |
|---|---|
| Total Submissions | count of Submittal Log rows |
| Documents Submitted / In Plan | submitted ÷ MDL scope (coverage %) |
| Under Review (SUR) | count where Submission Status = SUR |
| Approved (APP+AWC) | count where Approval Status in {APP, AWC} |
| On-Time Return Rate | `Flag On Time` average |
| Avg Review Delay | `Review Delay Days` average |

### 4.3 Panels (charts)

Overview view panels (SVG, dependency-free, per MDL `render.mjs` chart kit):
- **Plan vs Actual** (line): MDL planned first-issue vs actual submissions by month.
- **Monthly Outcome** (stacked bar): submissions by Submission Status per month.
- **Avg Review Delay** (line): delay trend by month.
- **Approval Mix** (donut): APP / AWC / NAP / REJ / INF counts.
- **By Discipline** (horizontal bar): submitted vs planned per discipline.
- **By Submitter** (horizontal bar): submissions per Submitted By.
- **Turnaround vs Delay** (scatter): one point per submission.

### 4.4 Coverage panel

Shows MDL scope minus submitted documents: pending / not-yet-submitted count and list, so the user
sees the forward plan that has not reached the log.

### 4.5 Document Detail table (`.ds-table`)

Full submission detail with panel-local sort, column show/hide chooser (§7.1 B7 — no filter chrome),
and CSV export. Panel-local filters (e.g. a single status select) resolve in S5 and affect only this
table (§7.2.7 pt 6).

---

## 5. Validation Rules

- Excel structure contract (§3): required sheets and columns; missing column → fatal `#errBanner`
  notice.
- Formula-error columns → fatal `W-FORMULA` (§3.5, §3.8.1).
- S4 Derive is the sole source of KPI numbers; panels never recompute from the DOM.
- No duplicate global filter dimensions (§7.2.7): sidebar is navigation, top bar holds filters.
- Conformance record (spec §8): fill the §8 record in this workplan after build.

---

## 6. Technical Architecture

### 6.1 Stack decision (recommended)

**Adopted (recommended)**: port the MDL Node ES-module pattern — `xlsx-reader.mjs` + `pipeline.mjs`
+ `render.mjs` bundled by `build.mjs` into one offline HTML; the two workbooks load at runtime via a
dropzone (single dropzone accepting both files, or two labeled pickers). This matches your
"refer to MDL" direction and is the only fully spec-conformant implementation.

**Tension**: `AGENTS.md` §1.1 lists `sub/` as "Python build, HTML output" (the existing
`sub/ref/build_dataset.py` + `build_dashboard.py` generator). If you prefer the Python generator
path, the data model in §3 still applies; only §6.2–§6.3 change. Recorded as Open Question §9.1.

### 6.2 File structure (Node path)

```
sub/
  src/xlsx-reader.mjs      (copy from MDL, unchanged)
  src/pipeline.mjs          (Submittal-specific model + S4 derive)
  src/render.mjs            (header, side panel, KPI, charts, table, bars)
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
| 3 | Write `pipeline.mjs` (column maps, join, derived fields, S4 derive, `W-FORMULA`) | `sub/src/pipeline.mjs` |
| 4 | Write `render.mjs` (header, side panel nav, KPI, charts, coverage, detail table, bars) | `sub/src/render.mjs` |
| 5 | Write `build.mjs`; build the HTML | `sub/TWRP C3B2 - Document Submittal Dashboard.html` |
| 6 | Add `test_pipeline.mjs` / `test_render.mjs`; run `harness-layout` lint; fill §8 conformance | tests + record |
| 7 | Manual review of two-workbook load UX; adjust | final HTML |

---

## 8. Decisions Captured from Review

- **D1 — Side panel is navigation only** (§4.1). Left sidebar switches views; global filters stay in
  the top bar. Rationale: spec §7.2.7 forbids re-offering a global dimension outside the top bar.
- **D2 — Two workbooks load at runtime** (§6.1). MDL = scope, Submittal Log = history; joined on
  Document No. with submittal-log discipline authoritative.
- **D3 — Existing `sub/ref/` prototype preserved** (§2). New artifact, no overwrite.

---

## 9. Open Questions / Assumptions

- **9.1 Stack**: Node runtime (recommended, §6.1) vs the declared "Python build" stack
  (`AGENTS.md` §1.1). Confirm before Wave 2.
- **9.2 Load UX**: single dropzone accepting both files vs two labeled pickers. Recommend single
  dropzone that detects each workbook by sheet signature.
- **9.3 Output filename/location**: `sub/TWRP C3B2 - Document Submittal Dashboard.html` (new file).
- **9.4 Sample page**: `sub/Arch/Document-Submittal-Dashboard-Sample.html` is a static review mockup
  only; it is not wired to Excel and will be superseded by the built dashboard.

---

## 10. Future Enhancements

- Drill-down from KPI / chart to the detail table (filtered `active`).
- Print-optimized view (bars/side panel hidden on print per §3.5 / §3.6).
- Saved filter presets in `localStorage`.
- Coverage forecast trend (planned first-issue by month vs actual).
