# MDL Dashboard — Developer Workplan (for Review)

> **Project**: TWRP C3B2 — Master Document List (MDL) Interactive Dashboard
> **Version**: 0.1 (proposal, awaiting approval)
> **Date**: 2026-09-29
> **Status**: Proposal — **NO CODE WRITTEN YET**. Mirrors the PPP Dashboard architecture
> (`PPP/PPP-Dashboard-Workplan.md` + `PPP/arch/PPP_Dashboard.html`).

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
| **Contract-driven** | Code sheet (column map rows 9–33 + lookup lists) drives all parsing |
| **Fail-soft** | Validation never blocks rendering; dashboard always shows, issues listed in a panel |
| **Extensible disciplines** | Discipline tabs auto-discovered from Code!H; missing ones shown as "no list yet" |
| **Authoritative discipline = col C** | Aggregations by discipline use the per-row UESH Discipline, not the tab name |
| **Layered (target)** | 5 layers — tokens → primitives → data → logic → view; dependency flows downward only |

---

## 3. Excel Data Structure & Contract

### 3.1 Code sheet = the contract source
- **Rows 1–8**: project metadata + per-block group headers.
- **Rows 9–33 (cols A:C)**: the **column map** for the document list — `Field | ColumnLetter | DataType`.
- **Column-block lookup lists** (validation domains), each a two-column block on row 1 with values starting row 2.

### 3.2 Document-list column map + lookup ranges (Code!A:C, rows 9–33 → 25 columns A–Y)

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
| W | Prolog Submission Status | Text | `Code!AC2:AD4` (Prolog Submission) |
| X | Latest Approval Date | Date | — |
| Y | Latest Approval Status | Text | `Code!AF2:AG5` (Approval Code) |

> **Notes on lookup ranges**
> - Ranges above are the *code/description blocks* on the Code sheet; the parser should read the **left (code) column** of each block as the allowed value set and the **right (description) column** as its label.
> - `Code!AI2:AJ` (**Error Code / Error Description**, §3.6) is currently **empty** in the workbook → validation uses a warning-only fallback (mirrors PPP V-21) until the owner populates it.
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
| Prolog Submission Status | AC2:AD4 | SUR, RTR, NTS (+ descriptions) |
| Approval Code / Status | AF2:AG5 | REJ, NAP, APP, AWC / Rejected, Not Approved, Approved w/o Comments, Approved with Comments |
| Error Code / Description | AI2:AJ | **rule-wording source** — now populated by the owner; each validation rule references an Error Code here for its message + severity (see §4.4/§5) |

> **Contract-driven — NO hard-coded values (reviewer directive):** every allowed-value set above (stages, disciplines, authorities, doc types, approval codes, prolog statuses, BQ/WBS/prefix codes) is **read at runtime** from its Code-sheet block range into `model.lookups` and consumed by validation, charts and filters. The HTML **hard-codes none** of these lists — adding/removing a value in the Code sheet (e.g. inserting `VOID` into the Approval Code block) takes effect with **no code change**. The Error Code/Description block (Code!AI:AJ) supplies every rule's message and severity; a rule with no matching row falls back to a generic message + Warning (mirrors PPP V-21).

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

### 4.1 KPI overview + per-discipline summary (counts use §3.7)

**Metric definitions (status funnel)** — every count derives from the §3.8 consolidated table and applies `isActiveDoc` unless noted:
- **Total Planned** = active documents (the planned document register; denominator of the funnel).
- **Submitted** = active documents whose `Actual 1st Issue Date` (col U) is **not blank** (a document is submitted once it is first issued). *[Confirmed per reviewer Q4.]*
- **Approved (APP)** = active documents with `Latest Approval Status` (col Y) = `APP`.
- **AWC** = Y = `AWC` (approved with comments).
- **REJ** = Y = `REJ` (rejected).
- **Approved total** = APP + AWC. (`NAP` = Not Approved shown as a 4th outcome where present.)

**Global KPI bar:** Total Planned · Submitted · Approved(APP+AWC) · AWC · REJ · As-Built=YES · Vendor Data=YES · active disciplines / 20 · **Data completeness %** (valid records passing all business rules V-17–V-27).

**Per-discipline summary matrix (primary view)** — one row per selected discipline (§3.3/§3.4), columns:
`Discipline | Planned | Submitted | Approved | AWC | REJ | (NAP)`.
Each cell is the §3.7-active count. A **per-stage expansion** breaks every numeric cell down by `Stage` (col B):
- Active stages = every Stage value **present in the data** that is **not** in the §3.7 exclusion set. The stage universe itself is read from Code!E (no hard-coding); only the three lifecycle-excluded statuses are flagged (see §3.7).
- `Deleted / Void / Superseded` are reported as a separate **"Excluded"** line and never mixed into active counts (§3.7).

### 4.2 Charts (inline SVG, reusing PPP renderers)
> All chart categories (disciplines, stages, authorities, approval outcomes, doc types, etc.) are derived from `model.lookups` (read from the Code sheet at runtime) — **none are hard-coded**.
1. **Documents by Discipline** (horizontal bar, by col C — only disciplines present in the consolidated table). A user message beneath the chart lists the UESH disciplines that have no document list yet (per §3.4).
2. **Issue progress**: Planned / Forecast / Actual 1st-issue-date presence (issued vs outstanding), optionally time-bucketed.
3. **Approval status distribution** (pie: APP / AWC / REJ / NAP / Not-available(VOID or blank); `CHART.pie.topN` cap with `Other` + tooltip).
4. **As-Built status** (YES / NO).
5. **By Authority** (BCA/FSSD/NEA/NPK/LTA/URA).
6. **By Doc Type / Stage** distribution.
7. **Schedule variance / Look-Ahead**: rows where `Forecast ≤ today` but `Actual` still blank → "overdue / at-risk" list.
8. **Data quality — issues by discipline** (bar: validation-issue count per UESH discipline, col C).
9. **Data quality — issues by rule** (bar/pie: distribution across V-01…V-27; rare rules capped under `CHART.pie.topN` into `Other`).

### 4.3 Filter panel — multi-select disciplines & stages (drives all views)
- **Discipline multi-select** (UESH Discipline, col C — the **sole** authoritative dimension per §3.5 / reviewer Q2, read from the consolidated table): pick one or many; only disciplines present in the data are listed.
- **Stage multi-select** (col B): pick one or many active stages; an "include Excluded (Deleted/Void/Superseded)" toggle controls whether the §3.7-excluded rows are shown in the matrix.
- Additional filters: Authority, Approval Status, date range (issue/approval dates). *(Source worksheet is tracked for traceability only — shown in the detail table — and is not a filter dimension, per Q2.)*
- Every selection re-renders — from the §3.8 consolidated table — the KPI bar, the per-discipline matrix (with per-stage expansion), all charts, and the detail table.

### 4.4 Validation engine + Error table
- Validate each row against the §3.6 lookup domains (**all read from the Code sheet — no hard-coded value lists**). Each rule emits an **Error Code**; its message text **and** severity are rendered from the **Code!AI:AJ (Error Code / Description)** block — **now populated by the owner** — so **no error wording or severity is hard-coded** in the HTML. A rule whose Error Code has no row in the block falls back to a generic message + Warning (mirrors PPP V-21).
- Panel: deduplicated **Rule reference** list + per-issue tooltip; respects `isActiveDoc` (inactive rows still reported but tagged).

### 4.5 Document detail table
- Sortable table in Code!A:C column order; respects filters; shows source tab, col C discipline, active/inactive flag.

### 4.6 Export
- Charts → PNG (clipboard/download); Validation issues + document extract → CSV.

---

## 5. Validation Rules (V-01…V-27)

Grouped: **A. Domain/format** (single-field) · **B. Cross-field consistency** · **C. Transmission & state machine** · **D. Timeline** · **E. Referential integrity** · **F. Metadata completeness** · **G. Uniqueness & enum**.

| ID | Group | Rule | Severity |
|---|---|---|---|
| V-01 | A | Document No. (M) blank on an otherwise populated row | Warning |
| V-02 | A | Stage (B) not in Code!E list | Error |
| V-03 | A | UESH Discipline (C) not in Code!H list | Error |
| V-04 | A | Discipline Code (J) not in Code!T list (client discipline code) | Warning |
| V-05 | A | Doc Type (I) not in Code!Q list | Warning |
| V-06 | A | Authority (Q) not in Code!Z list | Warning |
| V-07 | A | Prolog Submission Status (W) not in Code!AC list | Warning |
| V-08 | A | Latest Approval Status (Y) not in the Approval Code block (Code!AF, read at runtime) and not blank | Error |
| V-10 | A | As-Built (P) = YES but Actual 1st Issue Date (U) blank | Warning |
| V-12 | A | Stage = Deleted/Void/Superseded but still counted as active (should be excluded) | Info |
| V-13 | A | Empty lookup code column while description column has values (mirrors PPP V-22) | Warning |
| V-14 | A | Project Code (G) not in Code!K list (WBS Contract Code) | Warning |
| V-15 | A | Document No. (M) contains a placeholder/`xxxx` (**on-hold number**) — the row record is still valid; **Warning only** (applies to active rows, §3.7; does not fail V-17 since composition uses the actual K value) | Warning |
| V-17 | B | Document No. (M) must equal `ProjectCode-Prefix-DocType-DisciplineCode-Number` = `G-H-I-J-K` joined by `-` (universal project rule; the **Discipline segment is the client Discipline Code = col J**, validated against Code!T — **not** UESH Discipline col C) | Error |
| V-19 | B | Prolog Submission Status (W) non-blank ⇔ Prolog Number (V) non-blank (two-way) | Warning |
| V-18 | C | `Actual 1st Issue Date` (U = 1st submission date) non-blank ⇒ `Prolog Number` (V) **and** `Prolog Submission Status` (W) must be non-blank (submitted ⇒ transmittal session exists) | Error |
| V-11 | C | Approval Status = APP but Latest Approval Date (X) blank | Warning |
| V-16 | C | Prolog Submission Status (W) = `RTR` but Latest Approval Status (Y) blank/`VOID` (approval expected) | Warning |
| V-20 | C | Approval Status (Y) has a conclusion (APP/AWC/REJ/NAP) ⇒ `Actual` (U) non-blank **and** `Latest Approval Date` (X) non-blank | Error |
| V-21 | C | Latest Approval Date (X) non-blank ⇒ Y non-blank and X ≥ U | Warning |
| V-09 | D | Date order: Planned (S) ≤ Forecast (T) ≤ Actual (U) | Warning |
| V-22 | D | Actual (U) non-blank ⇒ Planned (S) & Forecast (T) non-blank | Warning |
| V-23 | D | Any date (S/T/U/X) later than **current system date** ⇒ data lag / future date | Warning |
| V-24 | E | BQ Number (E) non-blank ⇒ must exist in `BQ` sheet `BQ No.` column (blank E is allowed) | Warning |
| V-25 | F | Valid record (M non-blank) missing any required field: Document Title(N)/UESH Discipline(C)/Stage(B)/Doc Type(I)/Discipline Code(J)/Project Code(G)/Project Prefix(H)/Number(K) | Warning |
| V-26 | G | Document No. (M) duplicated within the consolidated table | Error |
| V-27 | G | As-Built (P) / Vendor Data (R) must be YES/NO/blank; other values | Warning |

> **Approval / transmission handling (reviewer Q3, Q5, no-hard-code directive):** the set of valid approval outcomes is the **Approval Code block (Code!AF), read at runtime — never hard-coded**; blank is always allowed (means not-available). The Q3 intent — that `VOID` (or any "not-available" code) be accepted — is realized **contract-driven**: the owner adds the code to Code!AF (already done in the updated error/approval codes), and the dashboard accepts it with **no code change**. The state machine (V-18→V-21) enforces the document-control lifecycle: a document cannot be approved (Y conclusion) before it is issued (U), and issuing requires a Prolog transmittal (V+W). `Actual 1st Issue Date` (U) is the authoritative "1st submission date" (Q5). Future-date checks (V-23) use the **current system date** (Q6). `BQ Number` may be blank on a document; V-24 fires only when E is non-blank (Q7).

> **V-15 (on-hold placeholder):** a Document No. containing `xxxx` denotes an **on-hold number**; the row record is still valid, so V-15 is **Warning only**. Because V-17 composes M from the actual `K` value, a `xxxx` number still satisfies the `G-H-I-J-K` rule — the two rules do not conflict.

---

## 6. Technical Architecture

- **Single file:** `MDL/MDL-Dashboard.html` (offline, zero-dep), ported from `PPP/arch/PPP_Dashboard.html` with the MDL contract.
- **5 layers (target):** `01 Tokens → 02 Primitives → 03 Data → 04 Logic → 05 View`. Logic may only call downward.
- **Parser:** `parseXlsx()` (ZIP→XML→sharedStrings→sheets) + `parseCSV()`; reads Code contract (col map + lookups) before any discipline sheet, and also reads the `BQ` sheet once for the V-24 referential check. Baseline for future-date checks is the **current system date** (Q6).
- **Model:** `buildModel()` **first consolidates all discovered discipline tabs into ONE document table** (§3.8) — union of A–Y rows tagged with `sourceTab` + `discipline(colC)` + `isActive` — then derives every summary, chart series and validation issue from that single table.
- **Render:** single `STATE` object + `render(STATE)` (DOM write-only).
- **Test harness:** `MDL/test/test_pipeline.mjs` (Node), runs the shipped script against the real workbook end-to-end; mirrors PPP's green-run approach. Assertions include that `model.lookups` equals the Code-sheet block values (proving **no hard-coded lists**) and that every validation message/severity is sourced from Code!AI:AJ.

---

## 7. Workplan (Waves)

- **Wave 0 (P0-B parser + contract):** offline XLSX/CSV parser; read Code!A:C column map (§3.2) and all lookup blocks (§3.6); auto-discover discipline tabs via Code!H (§3.4); exclude BQ/Notes.
- **Wave 1 (P0 model + KPIs):** `buildModel` builds the §3.8 consolidated table first (union of all discipline tabs), with `isActiveDoc` (§3.7) and per-row discipline (col C); per-discipline summary matrix + per-stage expansion (§4.1) and KPI bar; `STATE`+`render`.
- **Wave 2 (P1 charts + filters + validation):** 9 SVG charts incl. 2 data-quality charts (§4.2); filter panel (§4.3); the §3.9 business-logic/referential layer (V-17–V-27) + `BQ`-sheet read; validation rule table (§5) + Error-table wording from Code!35:36; colour tokens.
- **Wave 3 (P2 polish):** IIFE wrap, `.ds-*` primitives, a11y (`role=img`/`aria-label`, `scope=col`, `:focus-visible`), dark/print/reduced-motion, export PNG/CSV, end-to-end test harness.

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
| 14 | Reviewer directive: **no hard-coding** of error codes/descriptions/severity or any Code-sheet value list — all read at runtime (errors from Code!AI:AJ, lookups from block ranges); the updated Error Code block is now the sole wording source |
| 15 | V-15 refined: Document No. `xxxx` = on-hold number on an active row; record remains valid → **Warning only**; does not conflict with V-17 (composition uses actual K) |

---

## 9. Open Questions / Assumptions

- **All open questions (Q1–Q8) are RESOLVED — see §8 rows 1–12. There are no further questions; the workplan is ready for approval.**
- **Assumption:** `BQ` and `Notes` are not document lists and are excluded; `Dashboard` tab is left as-is.
- **Assumption:** "Superseded" spelled as in Code!E (`Superseded`); exclusion list uses that exact spelling.
- **Assumption:** `Total Planned` = all active documents (denominator of the funnel); not restricted to rows with a `Planned 1st Issue Date` (S) set (Q4 only fixed *Submitted*).
- **Assumption (no-hard-code):** all validation value lists and all error wording/severity are loaded from the Code sheet at runtime. To accept a new code (e.g. `VOID` in Approval Status), the owner adds it to the relevant Code block (already done for the updated error/approval codes) — **no code change** required.

---

## 10. Future Enhancements (Backlog)

- Drill-down: click a discipline bar → filtered detail table.
- Cross-tab coverage report: which (discipline × doc-type) cells are empty.
- Bulk CSV import / re-export of corrected lists back to the workbook.
- Multi-workbook roll-up (several TWRP packages).
