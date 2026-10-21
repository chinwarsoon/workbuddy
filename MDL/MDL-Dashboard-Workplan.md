# MDL Dashboard — Developer Workplan (for Review)

> **Project**: TWRP C3B2 — Master Document List (MDL) Interactive Dashboard
> **Version**: 0.1 (proposal, awaiting approval)
> **Date**: 2026-09-29
> **Status**: Proposal — **NO CODE WRITTEN YET**. Mirrors the PPP Dashboard architecture
> (`PPP/PPP-Dashboard-Workplan.md` + `PPP/arch/PPP_Dashboard.html`).
> **Last revised**: 2026-10-20 — I-115 **aligned**: the shared floating-panel ordering contract (master → note → divider → item list → footer; master scoped to the non-pinned set and tri-state) is now normative in `Dashboard-UI-Design-Spec.md` §7.1 (B. Selection controls) and recorded here as §4.0.1 item 7 + acceptance. **Citation correction:** references to "§7.10" in this document and in `mdl-issues.md` are dangling — no §7.10 exists; the B-family (B1/B3/B5/B6/B7) lives in §7.1. PPP was deliberately NOT updated. I-114 **implemented (RESOLVED)**: (a) the Overdue Type dropdown now reads its labels from the **`Code!AN:AO`** block (workbook source of truth, in-code list kept only as a fallback) and shows the canonical §4A.6 wording; (b) the **column chooser got its own class** (`.cc-wrap` / `.cc-btn` / `.cc-panel`) per shared spec §7.10 **B7** — no count badge, no active-filter emphasis — so the `.tf-btn` filter look now belongs exclusively to the global Discipline/Stage chips; (c) the Validation / Issues panel gained the **panel-local rule-code filter** (spec §7.10 **B6** + §7.2.7 pt 6) — a single-select inside the panel, resolved in **S5**, affecting only that panel's tables (`N of M issues`; severity chips, note and Rule Reference still describe the whole run; CSV exports the same filtered rows). `test_render.mjs` += 12 assertions; rebuilt `MDL-Dashboard.html`; full run **159/165** (the 6 failures are the pre-existing top-bar chip/Stage tests). Prior (2026-10-20) — Filter vocabulary + panel-local filters **logged (I-114)**: shared spec §7.10's selection-control table now separates **multi-select** (B1 filter trigger + B3 chips) from **single-select** (B5 native select), and adds **B6 panel-local filter** plus **B7 column-visibility control**; shared spec §7.2.7 gains point 6 (a panel-local filter resolves in S5 and MUST NOT touch KPIs, charts, the matrix or any other panel). Workplan §4A.6 records the Overdue Type flavours as workbook source of truth in **`Code!AN:AO`** (the in-code list stays only as a fallback), and §4.0.1 gains the chooser-chrome rule plus the Validation / Issues **rule-code filter** specification (control inside the panel, local to it, S5-only, tables only). No dashboard code changed yet. Prior (2026-10-19) — Overdue List filter de-duplication **implemented (I-113)**, then the three panel-owned per-column filters were also removed (user direction 2026-10-19): the Overdue panel now keeps only the **Overdue Type dropdown** as its sole in-panel filter — no bundled popover and no per-column buttons (Delay / Source Tab / Planned date all removed). On 2026-10-20 the in-panel column filters were also removed from the **Validation Issues** and **Document Detail** panels, and the entire filter machinery (`attachColFilters`, `cfColRow`, `applyFilters`, `facetCounts`, `highlightText`, `debounce`, `restoreFlt`) deleted (only `cfToggle`/`cfBindDoc` remain, reused by the column chooser). `test_render.mjs` updated and now passes 147/153 (the 6 failures are pre-existing top-bar Stage-chip tests). Prior (2026-10-19): Filter de-duplication requirement documented (MDL-specific): per shared spec §7.2.7 (no duplicate filter dimensions), the Overdue List panel's bundled 'Filters' popover is to be removed — its UESH Discipline duplicates the global Discipline chip and Overdue Type is duplicated by the panel's own dropdown; keep the Overdue Type dropdown + per-column Delay/Source Tab/Planned-date filters. Document Detail popover to drop UESH Discipline + Stage (global duplicates). Validation panel clean. Added workplan §4.0.1. Prior (2026-10-19): Overdue List blank "Overdue Type" / "Delay (days)" columns fixed (I-112): the I-111
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
   which rows are returned. The chooser MUST be given its own class (shared spec §7.10 **B7**) so it
   cannot be mistaken for a filter, and it MUST NOT inherit the filter trigger's active/open emphasis.
   Conversely the Overdue Type control is a single-select filter and correctly uses §7.10 **B5**.
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
control using the shared spec §7.10 **B5** chrome. It narrows that panel's table only; it does not
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
| 22 | **UI layout = PPP first** (reviewer 1): follow the PPP dashboard single-page layout (welcome/file-load → KPIs → charts → validation → detail); the UI Design Spec's 18-item left-nav panel is **deferred to future development** |
| 23 | **No Originator/Reviewer** (reviewer 2): excluded from the dashboard; the spec's "Review Code" column maps to **Approval Status (col Y / Code!AF)** |
| 24 | **Export = CSV + PDF (print)** (reviewer 3): charts→PNG via Copy/Download; PDF via browser print (landscape/B&W); Excel export dropped to honour zero-dependency |
| 25 | **Disciplines from Code!H** (reviewer 4): all discipline names & the universe read from the UESH list (Code!H), never the spec's sample names |
| 26 | **No Contractor Reviews** (reviewer 5a): client-review only (Submission Status W / Approval Status Y); contractor-review page dropped |
| 27 | **No server; single load** (reviewer 5b): the `.xlsx` is loaded once at start via the welcome-screen file input; no backend, no live refresh; preferences via `localStorage` only |
| 28 | **Status dimensions separated** (reviewer 5c): Approval Status (Y/Code!AF) and Submission Status (W/Code!AC — renamed from "Prolog Submission Status") are distinct; the unified per-row "Current Status" pipeline is **NOT implemented now**; SLA statuses (Due Soon/Due Today/Overdue/Resubmit) deferred to chart-generation discussion; Validation Error reflects the Error Code block |
| 29 | **KPI set** (reviewer 5d): Total Planned · Submitted · Approved(=APP) · Approved w/ Comments(=AWC) · Rejected(=REJ) · Not Approved(=NAP); **Overdue** computed for 1st submission, subsequent submission, and client-review-return-late |
| 30 | **Charts mirror PPP** (reviewer 5e): user-selectable bar ⇄ pie toggle (localStorage) + Copy/Download PNG |
| 31 | **Tokens = PPP first; aging/buckets follow PPP** (reviewer 5f/5g): UI Design Spec §15 palette deferred |
| 32 | **Global search** (reviewer 5h) over the §3.8 consolidated table only (Document No. / Title / Discipline substring) |
| 33 | **Adopt `Dashboard-UI-Design-Spec.md` v1.1 as governing UI standard** (2026-10-15): the spec (v1.1, 2026-10-15) is now the **single source of truth** for layout / tokens / components across all internal dashboards incl. MDL. It **supersedes** the older "UI Design Spec §15" referenced in Decisions 22 & 31. MDL is audited at ~55–60% aligned (spec §13.2.9); the gap program is tracked by I-31…I-46 (Wave 5). |
| 34 | **Re-review Decision 22 (left-nav deferred)** (2026-10-08): spec v1.0 §3.2 names the **left sidebar** (OVERVIEW / REVIEWS / DOCUMENTS / QUALITY / SETTINGS) as the MDL navigation pattern — directly conflicting with the 2026-09-29 deferral. Resolution (2026-10-08, second review): user chose to **HOLD** the left-nav for a future phase; Decision 22 deferral stands and the spec v1.0 §3.2 mandate is **NOT adopted** for MDL at this time. I-35 moved to Deferred. |
| 35 | **Re-review Decision 31 (tokens deferred)** (2026-10-08): spec v1.0 §6 mandates the full ~33-token `:root` copied verbatim (MDL currently ships only 11, rest hard-coded). Conflicts with the 2026-09-29 deferral of the §15 palette. **Proposed resolution: adopt the full token set** (override Decision 31). Accepted 2026-10-08 — overrides decision 31 per spec v1.0. |


---

## 9. Open Questions / Assumptions

- **All open questions (Q1–Q8) are RESOLVED — see §8 rows 1–35.** The workplan is ready for approval (code-writing still pending approval per decision 4). Two items were intentionally **deferred (non-blocking)**: the left-nav panel (decision 22) and the full SLA / unified "Current Status" pipeline (decision 28) — both parked in §10. **Note (2026-10-08):** decision 22 (left-nav) is under re-review (Decision 34 / I-35) because `Dashboard-UI-Design-Spec.md` v1.0 §3.2 now **mandates** the left sidebar for MDL, conflicting with the 2026-09-29 deferral; decision 31 (tokens) is likewise under re-review (Decision 35 / I-31).
- **Assumption:** `BQ` and `Notes` are not document lists and are excluded; `Dashboard` tab is left as-is.
- **Assumption:** "Superseded" spelled as in Code!E (`Superseded`); exclusion list uses that exact spelling.
- **Assumption:** `Total Planned` = all active documents (denominator of the funnel); not restricted to rows with a `Planned 1st Issue Date` (S) set (Q4 only fixed *Submitted*).
- **Assumption (no-hard-code):** all validation value lists and all error wording/severity are loaded from the Code sheet at runtime. To accept a new code (e.g. `VOID` in Approval Status), the owner adds it to the relevant Code block (already done for the updated error/approval codes) — **no code change** required.

---

## 10. Future Enhancements (Backlog)

- **Left-navigation panel** (UI Design Spec §3/§4, 18-item nav) — **Deferred (2026-10-08, second review):** user chose to HOLD the left sidebar for a future phase. Decision 22 stands (deferred); Decision 34 override NOT adopted; I-35 moved to Deferred. Previously: deferred per decision 22; could be added as in-page section switching later.
- **Design-Standard Alignment (spec v1.0 §13)** — compliance program tracked by I-31…I-46 (Wave 5): tokens, status-bar `[hidden]`, `.ds-table`, `.seg`/`.tf-btn`, left-nav, footer, responsive cascade, panel numbering, Issue-Progress one-axis, glyph semantics, banner, app-bar, font/icon/focus, scroller/accordion, export filenames/help a11y, and spec-doc governance. **Implemented (2026-10-08/09):** Phases 1–3 delivered — I-31…I-50 (full token set, `.ds-table`, `.seg`/`.tf-btn`, panel numbering, footer, responsive cascade, combined Issue-Progress chart, glyph semantics, banner `.note`, app-bar, font/icon/focus, scroller/accordion, export filenames, help a11y) plus spec-doc governance (I-46). Only **I-35 (left-nav) remains deferred** per Decision 34; see §12.
- **Full Schedule & Review / SLA engine** — unified "Current Status" pipeline + SLA statuses (Due Soon / Due Today / Resubmit) deferred per decision 28; revisit when generating SLA charts. Only **Overdue** (3 flavours) is in scope now.
- **Contractor Reviews** page — dropped per decision 26 (no contractor-review data in the workbook).
- **Excel (.xlsx) export** — dropped per decision 24 to honour zero-dependency; reconsider only if a bundled writer is accepted.
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