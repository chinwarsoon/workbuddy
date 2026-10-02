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
| **Contract-driven** | Code sheet (column map rows 12–36 + lookup lists) drives all parsing |
| **Fail-soft** | Validation never blocks rendering; dashboard always shows, issues listed in a panel |
| **Extensible disciplines** | Discipline tabs auto-discovered from Code!H; missing ones shown as "no list yet" |
| **Authoritative discipline = col C** | Aggregations by discipline use the per-row UESH Discipline, not the tab name |
| **Layered (target)** | 5 layers — tokens → primitives → data → logic → view; dependency flows downward only |
| **Layout parity (PPP)** | Mirror the PPP dashboard single-page layout (welcome/file-load → KPIs → charts → validation → detail); left-nav panel deferred; PPP tokens reused |

---

## 3. Excel Data Structure & Contract

### 3.1 Code sheet = the contract source
- **Rows 1–11**: project metadata + per-block group headers, and review durations.
- **Rows 12–36 (cols A:C)**: the **column map** for the document list — `Field | ColumnLetter | DataType`.
- **Column-block lookup lists** (validation domains), each a two-column block on row 1 with values starting row 2.

### 3.2 Document-list column map + lookup ranges (Code!A:C, rows 12–36 → 25 columns A–Y)

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
> - Ranges above are the *code/description blocks* on the Code sheet; the parser should read the **left (code) column** of each block as the allowed value set and the **right (description) column** as its label.
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

> **Contract-driven — NO hard-coded values (reviewer directive):** every allowed-value set above (stages, disciplines, authorities, doc types, approval codes, prolog statuses, BQ/WBS/prefix codes) is **read at runtime** from its Code-sheet block range into `model.lookups` and consumed by validation, charts and filters. The HTML **hard-codes none** of these lists — adding/removing a value in the Code sheet (e.g. inserting `VOID` into the Approval Code block) takes effect with **no code change**. The Error Code block (Code!AI:AL) supplies every rule's **message (AK) and severity (AL)**; a rule with no matching row falls back to a generic message + **Warning** (mirrors PPP V-21) — note this fallback would downgrade an intended *Error* severity, so all §5 rules should have a row here.

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

**Per-discipline summary matrix (primary view)** — one row per selected discipline (§3.3/§3.4), columns:
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
- Every selection re-renders — from the §3.8 consolidated table — the KPI bar, the per-discipline matrix (with per-stage expansion), all charts, and the detail table.

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
| V-23 | D | Any date (S/T/U/X) later than **current system date** ⇒ data lag / future date | Warning |
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
- **Wave 1 (P0 model + KPIs):** `buildModel` builds the §3.8 consolidated table first (union of all discipline tabs), with `isActiveDoc` (§3.7) and per-row discipline (col C); per-discipline summary matrix + per-stage expansion (§4.1), KPI bar, and initial schedule/review derived fields; `STATE`+`render`.
- **Wave 2 (P1 charts + filters + validation + action control):** charts and filters; validation layer (V-17–V-27); BQ referential check; Schedule & Review Engine; action-required lists; upcoming submissions; resubmission control; client-review aging; SLA KPIs; Error-table wording from Code!AI:AL; colour tokens.
- **Wave 3 (P2 UX polish):** IIFE wrap, `.ds-*` primitives, a11y (`role=img`/`aria-label`, `scope=col`, `:focus-visible`), dark/print/reduced-motion, export PNG/CSV, document lifecycle detail view, end-to-end test harness.
- **Wave 4 (performance + regression hardening):** performance targets, indexed filtering, reconciliation tests, working-day/SLA edge-case tests, large-workbook tests, and regression coverage for configuration-driven review rules.

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


---

## 9. Open Questions / Assumptions

- **All open questions (Q1–Q8) are RESOLVED — see §8 rows 1–32.** The workplan is ready for approval (code-writing still pending approval per decision 4). Two items are intentionally **deferred (non-blocking)**: the left-nav panel (decision 22) and the full SLA / unified "Current Status" pipeline (decision 28) — both parked in §10.
- **Assumption:** `BQ` and `Notes` are not document lists and are excluded; `Dashboard` tab is left as-is.
- **Assumption:** "Superseded" spelled as in Code!E (`Superseded`); exclusion list uses that exact spelling.
- **Assumption:** `Total Planned` = all active documents (denominator of the funnel); not restricted to rows with a `Planned 1st Issue Date` (S) set (Q4 only fixed *Submitted*).
- **Assumption (no-hard-code):** all validation value lists and all error wording/severity are loaded from the Code sheet at runtime. To accept a new code (e.g. `VOID` in Approval Status), the owner adds it to the relevant Code block (already done for the updated error/approval codes) — **no code change** required.

---

## 10. Future Enhancements (Backlog)

- **Left-navigation panel** (UI Design Spec §3/§4, 18-item nav) — deferred per decision 22; can be added as in-page section switching later.
- **Full Schedule & Review / SLA engine** — unified "Current Status" pipeline + SLA statuses (Due Soon / Due Today / Resubmit) deferred per decision 28; revisit when generating SLA charts. Only **Overdue** (3 flavours) is in scope now.
- **Contractor Reviews** page — dropped per decision 26 (no contractor-review data in the workbook).
- **Excel (.xlsx) export** — dropped per decision 24 to honour zero-dependency; reconsider only if a bundled writer is accepted.
- Drill-down: click a discipline bar → filtered detail table.
- Detailed Review History table keyed by Document No. + Review Cycle for full historical SLA analysis.
- Cross-tab coverage report: which (discipline × doc-type) cells are empty.
- Bulk CSV import / re-export of corrected lists back to the workbook.
- Multi-workbook roll-up (several TWRP packages).

- **Time-series S-curves + reporting-period filter** *(review 2026-09-30 — parked until required).* One consolidated future item covering two related features, with the decisions/risks agreed in review:
  - **Project-start anchor (`Code!B6`):** `B6` is the **value** column holding the project start date (Excel serial / ISO / text); `A6` holds the *label* "Project Start Date". `B6` is designated the **project start date** and shall be used **only as the x-axis origin / baseline anchor for date-related curves** (e.g., cumulative Planned/Forecast/Actual issue S-curves). It is **not** a reporting "as-of" and must **never** feed Overdue / V-23 / Schedule-variance look-ahead — those stay on the **system current date**. `buildModel` now reads `B6` into `meta.projectStartDate`. **Open discrepancy (2026-10-02):** in the live workbook `B6 = 46096` → **2026-03-15**, but the earliest issue date in the data is **2023-06** — i.e. documents exist ~2.75 years *before* the declared project start. Anchoring curves/dropdown on `B6` would drop that entire history, so the start-vs-data conflict must be resolved (see I-07).
  - **Reporting-period filter (open decision — resolve before build):** a dashboard filter lets the user pick a reporting period. Must define **scope**: does the period drive **only the date-curve / throughput panels** (x-axis window), or **all panels**? Because as-of is fixed at today, a global period filter would contradict the as-of-now Overdue / Approval panels unless those are explicitly excluded or annotated. **Recommendation:** period scopes the curves only; show a dual label `Reporting period: … · As-of: {system date}` so reviewers never conflate them. Consolidate with the existing Filter Panel 15 date-range control (single source, not a duplicate).
  - **Scope gap:** no date-axis curve exists yet (current charts 1–9 are counts / bars / pies). This is **net-new**: a `timeSeries` derivation in `pipeline.mjs` (bucket records from project start → now, cumulative Planned/Forecast/Actual) + a line/area renderer in `render.mjs` anchored at project start. Decide whether to **add new panels** or **upgrade Panel 2 (Issue Progress) / Panel 7 (Schedule Variance)** into curve views.
  - **Implementation touchpoints (when built):** `buildModel` reads `B6` → `meta.projectStartDate` (tolerant parse of serial / `Date` / text, since it is outside the column map); new `deriveTimeSeries(records, projectStart)`; new line/area chart type; Filter Panel 15 reporting-period control; recompute curves on change.
  - **Edge cases to handle:** documents dated before project start (clamp to origin or flag via V-rules — do not distort the curve); reporting period extending into the future (actual/issued line stops at system date, planned/forecast lines extend); `B6` value type handling (serial `46096` → `2026-03-15` confirmed in live workbook).

---

## 11. Implementation Build Log (2026-09-29)

**Status:** Implemented and tested. Workplan approved → code generated. All in-scope panels (15) built; deferred items (left-nav, full SLA engine, unified Current Status) parked per §10/decision 22/28.

### 11.1 Deliverables (files)
| File | Purpose |
|---|---|
| `MDL/MDL-Dashboard.html` | **Single-file, offline, zero-dependency dashboard.** Opens in a browser; loads the `.xlsx` via the welcome-screen file input; renders all 15 panels. Regenerated by `build.mjs`. |
| `MDL/src/xlsx-reader.mjs` | Dependency-free `.xlsx` reader (ZIP central-directory parse + `DecompressionStream('deflate-raw')` + minimal XML). Runs in both Node and browser. |
| `MDL/src/pipeline.mjs` | `buildModel()` — reads the Code contract, auto-discovers discipline tabs, consolidates, validates V-01…V-28, computes KPIs/charts/derived schedule. Pure logic, no DOM. |
| `MDL/src/render.mjs` | DOM rendering: welcome/file-load, KPIs, per-discipline matrix (+ stage expansion), 9 charts (bar⇄pie + PNG/Copy), filters, validation table, detail table, overdue lists, CSV/Print export. |
| `MDL/build.mjs` | Packages the 3 modules into `MDL-Dashboard.html` (inlines, strips `import`/`export`). |
| `MDL/test/test_pipeline.mjs` | Node test harness — **36 assertions, all PASS** (see 11.3). |

- **Branding:** the project logo (`MDL/asset/logo.jpg`) is embedded as a base64 data-URI into `MDL-Dashboard.html` at build time (no external file) and shown on both the welcome screen and the dashboard header. The welcome screen uses the same navy `header.app` bar as the dashboard, matching the PPP/mockup style.

### 11.2 How to run / regenerate
- Generate the HTML: `cd MDL && node build.mjs`
- Run tests: `cd MDL && node test/test_pipeline.mjs`
- Use: open `MDL-Dashboard.html` → choose the workbook → dashboard builds entirely client-side (no network, no data leaves the machine).

### 11.3 Test results
- **36 / 36 PASS.** Covers: 25-field column map (A–Y), all 28 error rules present with valid severities (7 Error / **19** Warning / 1 Info — see 11.4 re V-27), all lookup blocks read at runtime with exact sizes (stage 19, UESH 20, doc-type 63, discipline-code 19, authority 6, submission-status 3, approval 4), review durations from `Code!A9:C11`, 8 discipline tabs discovered + 12 "no list yet", and that **every validation severity & message is sourced from `Code!AI:AL` (proves zero hard-coding)**. Interactive filtering (`deriveView`) also tested (discipline/stage/include-excluded/search/rule filters).

### 11.4 Data-quality issues discovered in the workbook (surfaced, not defects of the tool)
These are characteristics of the current sample data; the dashboard correctly reports them:
1. **`V-27` severity still mistyped `Warnin`** in `Code!AI:AL` (owner note from earlier review). The parser **fails soft** and normalises any non-`{Error,Warning,Info}` value to `Warning`, so it renders correctly — but the owner should fix the cell to `Warning`.
2. **`V-26` duplicate count is high (sample ≈ 318 issues)** because many on-hold rows share the same placeholder `Document No.` (e.g. `…-xxxx`). This is faithful to the rule, but the owner may wish to exclude `xxxx`-placeholder numbers from the duplicate check (not changed — would be a rule edit in `pipeline.mjs`).
3. **Literal `"Calculated"` in Approval Status (Y) and Submission Status (W)** for many rows → flagged by V-08 / V-07. Implication: most sample rows have **no real approval outcome yet**, so `Approved`/`AWC` KPIs reflect that (not a bug).
4. **Discipline naming inconsistency:** both `Mech` (valid) and `Mechanical` (not in the UESH list) appear in the discipline column → `Mechanical` is flagged by V-03. Recommend standardising source data to the Code!H vocabulary.
5. **Inactive rows excluded by stage:** 147 rows carry `Stage ∈ {Deleted, Void, Superseded}` (surfaced by V-12 and excluded from active KPIs per decision 3).

### 11.5 Assumptions baked into the implementation
- **Dates** are stored as Excel serials with **no date style**; the parser converts numeric cells in `Date`-typed columns (per the column map §3.2) via the 1899-12-30 epoch. No `styles.xml` parsing needed.
- **Working-day calendar** for SLA/overdue = **Mon–Fri, no holidays** (per decision 18; configurable in code, not hard-coded in display).
- **Overdue (3 flavours) interpretation** (full SLA engine deferred per decision 28):
  - *1st-submission overdue* = active & `Forecast` (T) ≤ today & `Actual` (U) blank.
  - *Subsequent-submission overdue* = active & `Actual` (U) set & `Approval Status` ∈ {REJ, RTR} & (today − `Latest Approval Date` X) > `Resubmission Duration` (14 WD).
  - *Client-review-return overdue* = active & `Submission Status` = SUR & (today − `Actual` U) > `First Client Review` (20 WD).
- **Export policy** per decision 24: charts → PNG (Copy/Download), documents/issues → CSV, PDF → browser print (landscape). No Excel export.
- **Compatibility:** XLSX reader requires a modern browser or Node 18+ (`DecompressionStream` + `Response` globals).

---

## 12. Issue Register & Review Change Log

Tracks review outcomes, agreed changes, and known items carried for future improvement. Status legend: **Implemented 2026-09-30** = decision made in review, not yet coded; **Logged** = parked in §10 backlog. No dashboard code is modified during review — updates are recorded here for the next build pass.

| ID | Date | Issue / Change | Decision | Status | Notes |
|---|---|---|---|---|---|
| I-01 | 2026-09-30 | **Overdue KPI split** — replace the single union "Overdue" card with three separate cards: ① 1st Submission, ② Resubmission, ③ Client Review. | Three separate primary cards; **no** combined total card. | Implemented 2026-09-30 | Mirrors Panel 13 lists; union still used internally for Panel 7 roll-up (see I-05). |
| I-02 | 2026-09-30 | **As-Built KPI semantics** — `As-Built` (P) is a requirement flag only, not a submission-status field. | Card = count of active where P = `YES` (as-built required / to be submitted). `U` is **not** the submission signal; do not subtract submitted. Relabel "As-Built Required". | Implemented 2026-09-30 | True outstanding (required & not done) can't be derived without a dedicated as-built submission-date column. |
| I-03 | 2026-09-30 | **Vendor Data KPI semantics** — `Vendor Data` (R) is a by-vendor flag only, not a submission-status field. | Card = count of active where R = `YES` (docs produced by vendor). `U` **not** used. Relabel "Vendor Data (by vendor)". | Implemented 2026-09-30 | Same outstanding caveat as I-02. |
| I-04 | 2026-09-30 | **Forecast → Planned fallback** for 1st-submission overdue. | Due date = `Forecast` (T), fall back to `Planned` (S) when T blank. Applies to Overdue–1st-submission **and** Panel 7 "At risk". | Implemented 2026-09-30 | Prevents planned-only docs dropping out of Overdue/At-risk. |
| I-05 | 2026-09-30 | **Panel 7 (Schedule Variance / Look-Ahead) split** — its "Overdue" bucket to be split into the 3 flavours (consistent with KPI cards) and adopt the T‖S fallback. | Split Panel 7 Overdue into ①/②/③; adopt T‖S fallback in both Overdue and At-risk. | Implemented 2026-09-30 | Panel 7 = the On-track / At-risk / Overdue bar chart (§4.2 #7). |
| I-06 | 2026-09-30 | **No Overdue total subtotal card** — reviewer confirmed not needed. | Omit the union total card; show only the three. | Implemented 2026-09-30 | — |
| I-07 | 2026-09-30 | **As-of date & project-start anchor** — `Code!B6` = project start date, used only as the x-axis anchor for future date-curves; as-of = system current date; a reporting-period filter may be added later. | **Partially wired 2026-10-01:** `buildModel` now reads `Code!B6` into `meta.projectStartDate` (tolerant of Excel serial / ISO / text). It is the single project-start anchor and is now consumed by (a) the Matrix month selector (I-24) — dropdown start month, and (b) the S-curve / Issue Progress x-axis origin (Panel 05, `render.mjs` `projStart`), with fallback to the earliest data month only when B6 is blank. As-of stays `new Date()`; reporting-period filter scope TBD. Still to fix: UTC off-by-one in `todayISO` when fully wiring date-curves. **Open discrepancy (2026-10-02):** live workbook `B6 = 46096 → 2026-03-15`, but the earliest issue date in the data is **2023-06** — documents exist ~2.75 yrs before the declared project start. **Resolved by I-27:** the Issue-Progress S-curve / monthly bar now use option **(B)** — the timeline starts at `min(B6, earliest-data)` so pre-start history is **never dropped** (previously month index `-1` clipped it), and `B6` is drawn as a red dashed **“PS”** baseline marker with a caption. A new validation rule **V-28** flags any document whose Planned/Forecast/Actual 1st-issue date precedes `B6` (surfaced in Panel 12, not dropped). The Matrix month dropdown (I-24) still anchors its start at `B6` by design; whether to extend it to `min(B6, earliest-data)` is deferred. Investigate whether the 2023-06 dates or `B6` are mis-configured — V-28 now makes that visible. | Logged (§10) / partially implemented (A6 read + matrix anchor) | See §10 "Time-series S-curves + reporting-period filter" backlog item. |
| I-08 | 2026-09-30 | **Filter panel standardization + chip-bug fix** — all four categorical filters (Discipline, Stage, Authority, Approval) use standardized chip groups so users immediately see what is selected; multi-select; explicit all-selected at page load; per-group Select All / Clear + count badge. | Chip groups for all four; `STATE` initialized to full set at load (fixes the broken "can't deselect from default-all" chip bug — empty-set sentinel `delete` was a no-op at `render.mjs:303`); `deriveView` uses a tolerant `passSel(set,v)` so blank values pass when the set is "all" and are excluded when narrowed; Reset stays in the filter panel. | Implemented 2026-09-30 | Search/Include-excluded now update only data panels (not the filter panel) to fix the input focus-loss on each keystroke. |
| I-09 | 2026-09-30 | **Top action bar + relevant labels** — Export/Print actions moved out of the filter panel to a global bar directly below the title bar; buttons relabelled for clarity. | New global action bar under header with **Export Issue List (CSV)**, **Export Document List (CSV)**, **Print / Save PDF**; exports the **current filtered view** (reuses `issuesCSV`/`docsCSV`); Reset remains in filter panel (per earlier agreement). Print CSS already hides the bar. | Implemented 2026-09-30 | — |
| I-10 | 2026-09-30 | **Filter panel visual layout polish** — split the panel into two clear zones (Categorical Filters vs Utilities), add an "active filter" highlight so users see what is narrowing the data, show a helper line, and fix the chip-toggle focus/scroll-loss regression introduced in I-08. | Two zones (`.filters-cats` grid + `.filters-utils` row); `Categorical Filters` / `Utilities` section labels; helper line "All filters active by default…"; a group gets `.active` (amber border + inset accent + amber badge) and a "● filtered — N hidden" note when `count < total`; chip toggle and All/Clear now update only the affected group's badge + re-render data (`refreshData`) **without rebuilding the panel**, preserving scroll position and checkbox focus; Reset still does a full rebuild. | Implemented 2026-09-30 | Mockup: `filter_panel_mockup.svg`. |
| I-11 | 2026-09-30 | **Button design standardization + height increase** — unify all `<button>` elements under one `.btn` system with a consistent look and a proper touch-target height; also remove the redundant bordered boxes around the Filter Utilities controls (Search / Include-excluded / Reset). | Introduce `.btn` base + `.btn-primary` / `.btn-secondary` / `.btn-active` / `.btn-mini`; retarget header "Load workbook", top action bar (Export Issue List, Export Document List, Print / Save PDF), chart Bar/Pie/PNG/Copy, filter All/Clear, and Reset to `.btn*` (Reset was previously an unstyled UA-default button); min-height 32px for normal buttons, 26px for `.btn-mini` (was 14–24px); remove per-item `.grp` box border on `.filters-utils .grp.util` (search input keeps its own field border for usability). | Implemented 2026-09-30 | Welcome "Choose workbook" (`.filebtn`) already matched the primary style; orphan `button.big` rule removed. |
| I-12 | 2026-09-30 | **Panel 10 matrix — expand stages with overdue columns + working toggle** — fix the broken stage expansion and meet the 4 requirements (per-discipline 3-overdue summary columns; per-stage rows inserted under their discipline; every stage shows counts for all columns; reliable on/off toggle). | `buildMatrix` now aggregates per discipline **and** per stage including the 3 overdue flavours (reusing the same `firstOverdue`/`subOverdue`/`cliOverdue` predicates via record-key sets). Header gains `Overdue 1st / Overdue Resub / Overdue Client`; discipline rows show the 3 overdue sums; expanding a discipline inserts one sub-row per stage with **all 10 columns**. Toggle fixed: clicking a discipline now **collapses any other open one (accordion)** and removes **all** its sub-rows (old bug only removed the first); disciplines with no stages show a `—` placeholder instead of a broken toggle. Per the agreed design: **only one discipline open at a time** and **expansion collapses on any filter change** (expansion is DOM-only, so re-renders wipe it). Table wrapped in a horizontal-scroll container with proper `.matrix` styling + sub-row styling. | Implemented 2026-09-30 | — |
| I-13 | 2026-09-30 | **Panel 10 — matrix expand-all + export fully-expanded report as PNG / picture copy (study / review only)** — add a button in the Discipline Summary Matrix to (a) expand/collapse **all** disciplines at once for on-screen review, and (b) export a snapshot of the **fully expanded** report (all disciplines + all stage sub-rows, incl. the 3 overdue columns) as a PNG download and as a copyable image, for offline review/study. | Toolbar above the matrix now has `▾ Expand all`, `▸ Collapse all`, `⤓ PNG (full)`, `⧉ Copy`. Refactored the toggle into shared `collapseAll()` + `openOne(td)` helpers; single discipline click still uses accordion (opening one collapses the rest), while **Expand all** opens every stage-bearing discipline simultaneously and **Collapse all** closes them. Export renders the report via `matrixReportHTML` (full table, all stages, no expand column) wrapped in an SVG `<foreignObject>` with inline styles, reusing the existing `attachExport`/`svgToBlob` canvas pipeline used by the charts. All on-screen expansion is DOM-only, so it still **collapses on any filter change** (per I-12). Export reflects the **current filtered view** (`v.matrix`). | Implemented 2026-09-30 | Review-only snapshot; PNG export via `foreignObject` requires a Chromium/Firefox-class browser and a same-origin/secure context for clipboard copy; Expand/Collapse all are on-screen conveniences only. |
| I-14 | 2026-09-30 | **Button standardization sweep + matrix header layout (review finding fix)** — a review found the chart toolbar and the Panel 10 matrix toolbar used only the `.btn-secondary` / `.btn-active` **modifier** classes, omitting the required base `.btn`, so they rendered smaller/squarer than the standardized header/action/filter buttons (which correctly use `btn btn-secondary`). Also the matrix actions sat on a separate row *below* the title rather than inline with it. | Added the base `.btn` class to all four chart toolbar buttons (`Bar`/`Pie`/`PNG`/`Copy`) and all four matrix toolbar buttons (`Expand all`/`Collapse all`/`PNG (full)`/`Copy`) so they now share the unified 32px box (height/padding/radius/font). Restructured Panel 10 into a `.panel-head` flex row (`display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap`) with the `<h2>` title on the left and the action `.toolbar` right-aligned — saving a chrome row and grouping title with its controls (standard card-header pattern). `.panel-head .toolbar{margin-bottom:0}` and print already hides `.toolbar` (line 113). **Observed but not changed:** the per-row `▸ stages` toggle is a table-cell text affordance (intentional inline row control, not a `.btn`); the welcome `.filebtn` predates the system (visually close to primary, separate class) — both noted as optional future unification. | Implemented 2026-09-30 | Root cause: I-11's modifiers assumed the base `.btn` is also present; header/action/filter buttons were correct, but the pre-existing chart toolbar and the later-added matrix toolbar missed it. |
| I-15 | 2026-09-30 | **Filter header actions + per-panel collapse toggle** — (a) move the **Include excluded** checkbox and **Reset filters** button from the Filter Panel body up inline with the panel title (matching the Panel 10 header pattern), keeping **Search** in the body as a key function component; (b) add a show/hide (collapse) toggle to the **KPI**, **Filter**, and **Discipline Summary (Matrix)** panels. | Filter Panel header (`renderFilters`) is now a `.panel-head` with the title left and a `.head-actions` group on the right holding the `Include excluded` checkbox (`#fInc`) + `Reset filters` (`#fReset`) + a collapse chevron; `#fInc`/`#fReset` ids and handlers preserved, re-attached each render. KPI (`renderKPIs`), Filter (`renderFilters`), and Matrix (`renderMatrix`) each wrap their content in `.panel-body` and expose a `▾/▸` collapse button (`btn btn-mini`) in the header. A module-level `collapsed` Set (keyed by panel id) persists collapse state across re-renders; clicking toggles the set + a `.collapsed` class (no data re-render) and the chevron flips; each render re-applies state via `wireCollapse(panel)`. `collapsed.clear()` on `boot`/`renderDashboard` resets to fully expanded on reload. CSS: `.panel.collapsed .panel-body{display:none}`; `@media print` overrides it so collapsed panels still print fully. Charts/Overdue/Validation/Detail left unchanged (deferred — talk later). | Implemented 2026-09-30 | Search kept in body per user decision; other panels' collapse deferred to a later discussion. |
| I-16 | 2026-09-30 | **Charts — two separate panels: (1) Charts panel = interactive Documents & Issues breakdowns side by side; (2) Issue-Progress panel below = S-curve & monthly bar side by side** — split the old single charts panel into two sibling panels in the main stack. | `deriveView` computes `monthlyProgress`: timeline = earliest date among the document-list date fields (`Planned 1st Issue Date` / `Forecast 1st Issue Date` / `Actual 1st Issue Date`) → latest such date **+ 1 month buffer**; a missing forecast date falls back to the plan date. From the filtered `active` set it builds cumulative `pCum` / `fCum` / `aCum` and per-month `pNew` / `fNew` / `aNew`; two new SVG builders `lineSVG` (S-curve) and `barProgressSVG` (monthly bars). **Charts panel** (`#chartsPanel`): a 2-column `.charts` grid with two `renderInteractive` cards — Documents group (default Discipline) on the left, Issues group (default DQ by Discipline) on the right — each with its own dropdown, Bar/Pie toggle and PNG/Copy, and independent selections in `chartView.doc` / `chartView.iss`. **Issue-Progress panel** (`#curvePanel`, below): a shared **period-window** slider (From / To + Reset, view-only zoom held in `scurveWin`, resetting on reload) above a 2-column `.curve-grid` with the S-curve card (left) and monthly-bar card (right); each curve card has its own PNG/Copy export (`MDL_SCurve` / `MDL_MonthlyBar`). The timeline axis is computed from the **full** dataset so it stays stable as filters change, while all charts reflect the global Filter Panel (chips / search / include-excluded) — **no new filter control added**, per the review decision. | Implemented 2026-09-30 | Timeline start uses the earliest date in the date fields (no explicit project-start field exists; the I-07 anchor remains deferred) — effectively the earliest planned date. Test coverage added in `test_pipeline.mjs` (section 11: monthlyProgress present, months non-empty, cumulative-planned monotonic, actual ≤ planned, monthly sums to cumulative). |
| I-17 | 2026-09-30 | **Charts — consolidate 9 chart cards into one interactive chart** — replace the 9 individual chart cards (3-column grid) with a single interactive chart driven by a dropdown base selector, Bar/Pie toggle, and PNG/Copy export, defaulting to the per-discipline summary. | Removed `chartCard` plus the `.charts{grid-template-columns:repeat(3,1fr)}` layout; `renderCharts` now builds one `.chart` card with a `<select class="base sel">` (grouped `<optgroup>` Documents / Issues) listing the 8 categorical breakdowns, default `docsByDiscipline`. A module-level `chartView={base,type}` persists the selection across filter re-renders (dropdown change / Bar-Pie toggle only repaint the chart host). Bar/Pie respects `statusColor` for Approval / As-Built / Schedule and the `PALETTE` cycle for the rest; a cardinality cap forces Bar (and notes it) when a series has > 12 categories (e.g. Doc Type, DQ by Rule). Export reuses the shared `attachExport`/`svgToBlob` pipeline with a dynamic filename. `issueProgress` is intentionally excluded here (carved to I-16). | Implemented 2026-09-30 | Charts Panel header tag updated to "interactive · pick a base"; the dropdown is a runtime-built `<select>` so it is not static HTML. |
| I-18 | 2026-09-30 | **Overdue List — single consolidated table per UESH Discipline + CSV** — replace the three separate "flavour" overdue blocks (① 1st-submission / ② Resubmission / ③ Client-review) with one consolidated Overdue List, dropping the three-list / Combine-toggle option; columns = Prolog #, Document Number, Document, Title, UESH Discipline (repeated per row) + Overdue Type; an Overdue Type `<select>` filter; discipline filtering stays on the global Filter Panel (no extra discipline control); a ⤓ CSV button downloads `MDL_Overdue.csv`. | `renderOverdue` rewritten (`616:…:src/render.mjs`): merges `v.firstOverdue` / `v.subOverdue` / `v.cliOverdue` (full doc-list records from `deriveView`, `295:…:src/pipeline.mjs`) into one list tagged by type, sorted by `UESH Discipline` → Overdue Type → Document No.; columns map to the Code-sheet field keys `Prolog Number` (V), `Document No.` (M), `Number` (K → "Document"), `Document Title` (N → "Title"), `UESH Discipline` (C). Local Overdue Type filter narrows rows; CSV built via the existing `csvCell` / `downloadCSV` (`651:…:src/render.mjs`) with the same 6 columns. **No pipeline change** — reuses the already-filtered `active` set, so the global Filter Panel already scopes it. CSS: removed the 3-col `.ovd` grid; added `.ovt` (scrollable single table, `max-height:520px`, `th{cursor:default}`). Panel header tag updated to "Panel 13 · consolidated". | Implemented 2026-09-30 | `Number` (col K) is mapped to the user's "Document" column because the workbook has no separate "Document" field — flagged for confirmation; if a different short-code field is intended, swap the `f:'Number'` key in `OVERDUE_COLS`. |
| I-19 | 2026-10-01 | **Overdue List — related dates + total delay days** — extend the consolidated Overdue List (I-18) with the document's related dates and a computed total delay, using the workbook's exact Excel column names throughout. | Columns expanded from 6 to 13: `Prolog Number` (V), `Document No.` (M), `Number` (K), `Document Title` (N), `UESH Discipline` (C), `Overdue Type` (derived), `Planned 1st Issue Date` (S), `Forecast 1st Issue Date` (T), `Actual 1st Issue Date` (U), `Latest Approval Date` (X), `Latest Approval Status` (Y), `Submission Status` (W), `Delay (days)` (derived). All Excel-sourced headers use the literal Code-sheet field names. `Delay (days)` is computed in `deriveView` (Option A): **1st-submission** = calendar days `today − (forecast‖planned)`; **Resubmission** = `wdBetween(Latest Approval Date, today) − reviewRules.resubmissionDuration` (working days); **Client-review** = `wdBetween(Actual 1st Issue Date, today) − reviewRules.firstClientReview` (working days — client has not replied within the window since the latest submission). A new `overdueDelay(type,r)` helper attaches `.delay` to each overdue record; `renderOverdue` displays it via a unified `colVal` (handles the two derived columns) and the CSV exports all 13 headers. **No pipeline change**; `renderOverdue` still reuses the filtered `active` set. | Implemented 2026-10-01 | The `Number` (K) header was reverted from the earlier "Document" label to the exact Excel name per user directive; `Overdue Type` and `Delay (days)` have no Excel equivalent so they keep descriptive labels. |
| I-20 | 2026-10-01 | **Collapse toggle on all panels** — apply the `▾/▸` panel-collapse toggle to every dashboard panel, not just KPI / Filter / Discipline Summary. | Added `ensureCollapse(panel)` in `render.mjs`: for each of the 8 panels (`kpiPanel`, `filterPanel`, `matrixPanel`, `chartsPanel`, `curvePanel`, `overduePanel`, `validationPanel`, `detailPanel`) it ensures a `.panel-head` (wrapping a bare `<h2>` where one exists, e.g. Charts / Issue Progress), a top-right `.head-actions` collapse button (`btn btn-mini`, `▾`/`▸`), and a `.panel-body` wrapper around the panel's content (move all children after the head into `.panel-body`); then calls the existing `wireCollapse` (which toggles the module-level `collapsed` Set keyed by panel id and adds `.panel.collapsed`, hiding `.panel-body` via the existing CSS `.panel.collapsed .panel-body{display:none}`; print overrides so collapsed panels still print). The function is idempotent — panels that already provide their own `.panel-head`/`.panel-body`/collapse button (KPI, Filter, Matrix) are detected and skipped, so no duplicate wrappers or buttons. `ensureCollapse` is invoked for all 8 panels at the end of `renderData`, so the toggle is applied on every full render/re-render (re-renders route through `renderAll` → `renderData`). **No pipeline change**; no new data logic. | Implemented 2026-10-01 | Charts (no panel number) and Issue Progress (no panel number) previously had no `.panel-head` — `ensureCollapse` now creates one, giving them the same inline header + collapse behaviour as the numbered panels. |
| I-21 | 2026-10-01 | **Panel help buttons + remove header tags** — replace the small descriptive header "tags" (e.g. "consolidated", "from Code!AI:AL") with a `?` help button on every panel that opens a modal explaining how that panel, its charts, and its lists are generated (source data, calculations, consolidation method, definitions of terms such as "active"). | Removed all six `.tag` spans (Charts "Documents / Issues", Issue Progress "S-Curve & Monthly", Filter "drives all views", Overdue "consolidated", Validation "from Code!AI:AL", Detail "N rows · A–Y + source") and the now-unused `.panel h2 .tag` CSS. Added a `?` help button (`btn btn-mini`, title "Panel help") to the left of the collapse toggle on every panel via `ensureCollapse` (inserted before an existing `.collapse` button, else appended); each button calls `openHelp(panel.id)`. Added a single shared help modal (`.help-modal`, `hidden` overlay, fixed, centred `.box` with header + scrollable `.body`; closes on ✕, backdrop click, or Esc) created lazily by `ensureHelpModal` and populated by `openHelp` from a new `HELP` map keyed by panel id (`kpiPanel`, `filterPanel`, `matrixPanel`, `chartsPanel`, `curvePanel`, `overduePanel`, `validationPanel`, `detailPanel`). Each `HELP` entry gives, in plain language (no programming terms), the panel's purpose, the exact Code-sheet source columns / lookup tables / Error Code block (AI:AL) it draws from, how the figures are worked out, how rows are grouped/filtered, and definitions of new terms (Active document = Stage not Deleted/Void/Superseded; Working days = Mon–Fri; etc.). The modal title includes the panel number where one exists. **No pipeline change.** | Implemented 2026-10-01 | The two unnumbered panels (Charts, Issue Progress) keep their titles only (no corner badge), consistent with I-20; the `?` glyph still applies to them. |
| I-22 | 2026-10-01 | **Bottom status bar (PPP dashboard)** — add a fixed bottom status bar, styled like the title bar (navy), mirroring the action-log `#statusbar` pattern, showing high-level summary chips. | Added a fixed `.status-bar` (`position:fixed; bottom:0; background:var(--navy); font-size:12px; flex chips`) appended to the root in `renderDashboard` (`statusBarEl`) with `padding-bottom:52px` added to `.wrap` so content clears it, and `@media print` hides it. New `renderStatusBar(v)` (called at the end of `renderData`, refreshing on every filter/render) builds bordered chips: **File** (green loaded dot + truncated workbook name, full name + Generated timestamp in tooltip, from `MODEL.meta.workbookName`/`generatedAt`), **Planned** (`kpis.totalPlanned`), **Submitted** (`kpis.submitted`), **1st-sub** progress % with a mini bar (`round(submitted/planned×100)`), **Valid** (`v.active.length` / `MODEL.records.length` — active set, excluded stages removed), **Overdue** (`kpis.overdueFirst`), **Completeness** (`kpis.completeness`%), **Disciplines** (`kpis.activeDisciplines`), **As-of** (`MODEL.meta.today`, the reporting date used for overdue), and **Filter** (summary from `filterSummary()` reading `STATE` + `getFilterDefs`, e.g. `Discipline: 5/20 · Stage: All · … · Excl off · Search: ""`, or `All documents (no filter applied)`). Each chip carries a `title` tooltip with the exact definition; the bar uses `overflow:hidden` so extra chips clip on narrow screens. **No pipeline change.** | Implemented 2026-10-01 | "Valid records" = active document set (excluded stages Deleted/Void/Superseded removed), per the user's choice; the As-of chip is the reporting date (`meta.today`). |
| I-23 | 2026-10-01 | **Matrix: "this month" submission columns + rename Submitted** — in the Per-Discipline Summary Matrix (Panel 10), rename the `Submitted` column to `Total Submitted` and add three "this month" submission columns after it: `Plan (This Mth)`, `Forecast (This Mth)`, `Actual (This Mth)`. | In `buildMatrix` (render.mjs) added a `curMonth` parameter = `(model.meta.today||'').slice(0,7)` (the as-of / reporting month — confirmed in `pipeline.mjs:62` `today = options.today ? isoToDate(options.today) : new Date()`, surfaced as `meta.today`), plus `PlanMo` / `FcastMo` / `ActualMo` counters on every discipline object and stage object, bumped via three predicates: `PlanMo` = *Planned 1st Issue Date* (S) month == curMonth (Planned only, matching the S-curve Planned series); `FcastMo` = *Forecast 1st Issue Date* (T) month == curMonth, or *Planned* (S) if T is blank (forecast→plan fallback, matching the S-curve Forecast series); `ActualMo` = *Actual 1st Issue Date* (U) month == curMonth (Actual only, no fallback). `renderMatrix` and `matrixReportHTML` (the PNG/Copy/SVG export) both gained the three new header cells + cells in the discipline row and each stage sub-row, placed after the renamed `Total Submitted` column; the matrix now has 13 data columns (+ expand control). Panel 10 help text updated (source columns now list S/T/U; column list documents the three This-Mth columns and that "this month" = the as-of month). **No pipeline change.** | Implemented 2026-10-01 | `Plan (This Mth)` and `Forecast (This Mth)` deliberately differ: Plan uses Planned only, Forecast uses Forecast-or-Planned fallback (so a doc with only a Planned date this month counts in both, while a doc forecast this month but planned earlier counts only in Forecast) — mirroring the existing S-curve Planned/Forecast/Actual semantics. |
| I-24 | 2026-10-01 | **Matrix month selector** — add an inline "Month" dropdown to the Per-Discipline Summary Matrix (Panel 10) header (left-aligned, beside the title, before the Expand/Collapse/PNG/Copy toolbar and the collapse toggle) that chooses which month the three "this month" submission columns count. | Added module var `matrixMonthSel` (default `''` = as-of month) and helpers `monthLabel(ym)` (e.g. "Oct 2026") and `monthOptions(records, asof, projectStart)` — a <em>continuous</em> (gap-free) range whose start is the <em>earlier</em> of the project start (`Code!B6`, `model.meta.projectStartDate`) and the earliest planned/forecast/actual first-issue date in the data (so pre-start months are reachable, matching the Issue-Progress whole-range rule), through the as-of month, extended to the latest data month if it lies beyond as-of, so every month in the project's life is listed even with no submissions. In `deriveView` (render.mjs) `curMonth` is now `matrixMonthSel || asofMonth` (the as-of month from `model.meta.today`), and the candidate months are returned as `matrixMonths` (each `{value, label, asof}`, the as-of option labelled "(as-of)"). `renderMatrix(panel, matrix, months, curMonth)` builds a `<label class="lbl month-sel">Month: <select class="month-select">…</select></label>` inserted leftmost into `.head-actions`; the three column headers are now dynamic — `Plan (Oct 2026)` / `Forecast (Oct 2026)` / `Actual (Oct 2026)` via `monthLabel(curMonth)`. On change, `matrixMonthSel = sel.value; renderAll(WRAP);` re-renders (recomputing `buildMatrix` with the new month); `WRAP` is now captured in `renderAll`. **Only the three month-scoped columns change** — `Planned`, `Total Submitted`, the APP/AWC/REJ/NAP split, and the three overdue counts remain all-time / as-of-today totals (overdue uses the as-of *day* in `pipeline.mjs`, not the month; Issue Progress, Charts Schedule Variance, and the status bar are unaffected). The selection persists across global-filter re-renders (like `chartView`). Panel 10 help text updated to describe the selector. The dropdown's start month now anchors on the **project start date (Code!B6)**, read into `meta.projectStartDate` by `buildModel` (`pipeline.mjs`) — tolerant of Excel serial / ISO / text — and passed to `monthOptions` (falling back to the earliest data month when A6 is blank). The as-of day, Overdue, Schedule Variance, and status bar are unaffected. **Pipeline change: reads Code!B6.** | Implemented 2026-10-01 | Default = as-of month, so behaviour is identical to I-23 until the user picks another month; selecting a past month reviews that month's planned/forecast/actual activity while total/approval/overdue columns stay as full cumulative / as-of-today summaries. |
| I-25 | 2026-10-01 | **Matrix presentation overhaul (P1+P2+P3)** — improve the Per-Discipline Summary Matrix (Panel 10) readability: two-tier grouped header, light-yellow-shaded selected-month columns, a bold TOTAL row, rename `Planned` → `Total Planned`, fold the submission % into the `Total Submitted` cell as "count (percent)", and centre-align all numeric columns. | In `render.mjs`: `renderMatrix` now builds a two-row `<thead>` (group band `Total Submission` / `Submission — {month} (selected month)` / `Approval` / `Overdue`, plus detail) with the 3 month columns carrying `class="tint"` (light yellow); computes `totalPlanned = Σ m.Planned` and a `subFmt` helper rendering `v + ' (' + round(v/totalPlanned*100) + '%)'` for the `Total Submitted` cell (discipline rows + TOTAL; stage sub-rows keep the plain count), and appends a `<tfoot>` `TOTAL` row summing each numeric field from the discipline-level objects (expanded stage rows are not double-counted). `matrixReportHTML` (PNG/Copy/SVG export) mirrors the grouped header, amber tint, combined `Total Submitted`, and TOTAL row; `matrixSVG` height now accounts for the extra group + TOTAL rows. CSS: `.matrix` numbers `text-align:center` (Discipline/subname stay left), added `.matrix thead tr.group th`, `.matrix th.tint`/`.matrix td.col-tint` (light yellow `#FFF9C4`), `.matrix tfoot td` (bold, 2px top border). Matrix help text updated (Total Planned, "count (percent)" definition, grouped bands, shaded month columns, TOTAL row). **No pipeline change.** | Implemented 2026-10-01 | The % denominator is the project's Total Planned (all disciplines), per user instruction — the TOTAL row therefore reads as overall submission completion vs total planned (e.g. 225 (73%)). |
| I-26 | 2026-10-02 | **System warnings: List End Row + top banner** — enforce a no-drop rule at the advisory List End Row (`Code!B8`) and surface system/processing warnings (and fatal errors) in a dedicated top banner, keeping data-quality details in the Validation panel (Panel 12). | In `buildModel` (pipeline.mjs) added `parseListEndRow` (tolerant numeric, default 4000) reading `Code!B8` into `meta.listEndRow`; the per-discipline reader loops to each tab's actual `sheet.maxRow` (never truncated), and after each tab compares the highest data row (`tabMaxDataRow`) against `listEndRow` — if exceeded, pushes a `warnings` entry `{level:'warn', code:'W-ENDROW', tab, actual, limit, message}` (message states all rows are included, none dropped, and to raise `Code!B8` if expected). `warnings` is returned alongside `records`/`issues`. In `render.mjs` added `sysBannerHTML(warnings)` and a `#sysBanner` element mounted directly under the header in `renderDashboard`: warning items render amber (`var(--amber)` #F9A825 — deliberately distinct from the matrix light-yellow `#FFF9C4`), fatal items render red (`var(--red)`); the banner is empty/hidden when there are no warnings. Validation help text now states the routing split (data issues → Panel 12; system/fatal → top banner). Routing is clean because data validation (`model.issues`) and system warnings (`model.warnings`) are separate model structures. **Pipeline change: reads Code!B8; surfaces W-ENDROW.** | Implemented 2026-10-02 | List End Row is advisory only — exceeding it never drops rows; it only raises a banner warning. The banner is the single home for system/fatal messages; the existing bottom status bar (I-22) remains for high-level counts and is unaffected. |
| I-27 | 2026-10-02 | **Issue Progress: whole-range timeline + project-start marker + V-28 + header alignment** — the S-curve / monthly bar must always show the full month range (no clipping), mark the project start date (`Code!B6`) on the charts, add a validation rule for documents dated before the project start, and align the panel's controls (Period window, PNG/Copy) inline with the panel title per the dashboard's common `.panel-head` rule. | In `deriveView` (render.mjs) the timeline now starts at `min(Code!B6, earliest-document-date)` and runs to the latest date (+1 month), so documents dated before `B6` are **never dropped** (previously month index `-1` clipped them); `projStartIdx` is carried on `monthlyProgress` and `lineSVG`/`barProgressSVG` draw a red dashed **“PS”** line + caption at `B6`. `buildModel` (pipeline.mjs) adds **V-28** — a document whose Planned/Forecast/Actual 1st-issue date is earlier than `Code!B6` (only when `B6` is set) — surfaced in Panel 12 (data detail), with safe defaults if the Error Code block row is absent. The Issue Progress panel now uses a `.panel-head` (`#curveActions`) and the Period-window sliders + reset are rendered **inline in the header** (duplicates guarded on re-render); each chart card uses an inline `.panel-head` so its PNG/Copy buttons align with its title. Panel + validation help updated. **Pipeline change: adds V-28.** | Implemented 2026-10-02 | The Matrix month dropdown (I-24) now also starts at `min(B6, earliest-data)` (previously anchored only at `B6`), so it matches the Issue-Progress whole-range rule and pre-start months are reachable. The user must add the **V-28** row to the Code-sheet Error Code block (`Code!AI2:AL`: AI=`V-28`, AJ=`Date / Schedule`, AK=`Document 1st-issue date precedes project start date (Code!B6)`, AL=`Warning`) — until then V-28 falls back to "Rule V-28 (generic message)" at `Warning` severity. |
| I-28 | 2026-10-02 | **Discipline Summary Matrix: Download CSV** — add a CSV download to the Panel 10 toolbar exporting the full matrix (disciplines + stages + TOTAL) for the currently selected month. | Added `matrixCSV(matrix, curMonth)` (columns aligned with the on-screen table: Discipline, Total Planned, Total Submitted, Submitted %, Plan/Forecast/Actual for the selected month, APP/AWC/REJ/NAP, Overdue 1st/Resub/Client; stage sub-rows indented, TOTAL row summed) and a `⤓ CSV` button in the matrix toolbar (`.head-actions`); the existing `downloadCSV` helper (now with a UTF-8 BOM) is reused, writing `MDL_Discipline_Matrix_<month>.csv`. Pure client-side, consistent with the Overdue-list CSV export. | Implemented 2026-10-02 | Mirrors the on-screen Matrix exactly (incl. the selected-month Plan/Forecast/Actual counts); respects the current filter/selection. |
| I-29 | 2026-10-02 | **Issue Progress: PS month always in range + vertical-line-only marker + period-window reset** — the project-start month must always be part of the chart range (so the marker can always be drawn), the marker should render as a vertical line only (no “PS” text tag), and the Issue-Progress period-window selection must reset when a new workbook is loaded. | In `deriveView` the timeline end is now extended to the project-start month when `Code!B6` lies beyond every document date (`if(psDate){ const psMon=…; if(psMon>maxD) maxD=psMon; }`), so `projStartIdx` is never `-1` while B6 is set and the marker always has a month slot (verified: B6=2030-01 with data ending 2026-06 yields a 2026-05→2030-01 range, `projStartIdx`=44; previously -1 and no marker). In `lineSVG` and `barProgressSVG` the `<text>PS</text>` tag was removed, leaving a red dashed **vertical line only**. The panel caption now reads “marked by the red dashed vertical line on the charts” and the panel help matches. Review item **#4**: `scurveWin=null` is reset alongside `collapsed.clear()` in `renderDashboard`, so loading a workbook always starts on the full period window instead of inheriting the previous file’s clamped range. | Implemented 2026-10-02 | Intended consequence: if B6 is later than all document dates the timeline is extended to that month, so the charts show an empty tail after the last data month. With the current workbook (B6=2026-03-15, data 2023-06→2026-06) PS sits mid-range at index 33; `projStartIdx` remains `-1` only when B6 is blank (no marker — correct). |
| I-30 | 2026-10-02 | **Standardize CSV download buttons** — all four CSV export buttons in the dashboard should share one label/title pattern so they are visually and semantically consistent. | Standardised to a single pattern: label `⤓ CSV`, `title` tooltip template `Download <content> as CSV`, and a shared `csv` class alongside `btn btn-secondary`. Applied to: **Per-Discipline Summary Matrix** (title `Download discipline summary matrix (disciplines + stages) as CSV`), **Overdue List** (`Download consolidated overdue list as CSV` — previously had no title), **Validation Issues** (`Download validation issue list as CSV` — label was `Export Issue List (CSV)`), and **Document Detail Table** (`Download document list as CSV` — label was `Export Document List (CSV)`). The descriptive text now lives in the tooltip, keeping every button compact and uniform, consistent with the existing `⤓ PNG (full)` / `⧉ Copy` convention. Handlers were untouched (they select by id: `#ovCsv`, `#vCsv`, `#dCsv`; the matrix uses `toolbar.querySelector('.csv')`), and all four verified wired after a real-workbook render. **Documentation bug also fixed:** the Validation help claimed the file was `MDL_Issues.csv` (actual `MDL_issue_list.csv`) and the Detail help claimed `MDL_Documents.csv` (actual `MDL_document_list.csv`) — both corrected to the real filenames. | Implemented 2026-10-02 | Filenames were deliberately **not** renamed, so users’ existing download names are unchanged (`MDL_Overdue.csv`, `MDL_issue_list.csv`, `MDL_document_list.csv`, `MDL_Discipline_Matrix_<month>.csv`). Note the naming is still mixed Pascal/snake — offer to unify it if desired. Line endings differ too: the matrix CSV uses CRLF, the other three use LF (both open correctly with the UTF-8 BOM). |

**Implementation status:** I-01…I-06 implemented 2026-09-30; I-08/I-09/I-10/I-11/I-12/I-13/I-14/I-15/I-16/I-17 implemented 2026-09-30 in `pipeline.mjs` / `render.mjs` — Filter Panel 15 now uses chip groups for all four categorical filters (Discipline/Stage/Authority/Approval) with all-selected-at-load + Select All/Clear + count badges (fixes the chip deselect bug); `deriveView` filter logic generalized to Sets via `passSel`; global action bar added below the title bar with relabelled Export Issue List / Export Document List / Print-Save PDF (export the filtered view); panel split into two zones with an active-filter amber highlight + "● filtered" note + helper line, and chip/All/Clear toggles now update only the affected group (no panel rebuild) to preserve scroll + focus; **all buttons standardized** under a unified `.btn` system (`.btn-primary` / `.btn-secondary` / `.btn-active` / `.btn-mini`) with min-height 32px (mini 26px, up from 14–24px) — I-14 closed the gap where the **chart** and **Panel 10 matrix** toolbars used only the modifier classes and missed the base `.btn` (now added), and moved the matrix actions **inline into a `.panel-head` flex row** with the title (space-between, wrap-capable) instead of a separate row below it; **Panel 10 matrix** now has per-discipline + per-stage 3-overdue summary columns and a working accordion stage-expand (all 10 columns per stage, toggle collapses all sub-rows, no-stage disciplines show `—`), plus a header with `▾ Expand all` / `▸ Collapse all` / `⤓ PNG (full)` / `⧉ Copy` — Expand/Collapse all open or close every discipline on screen (still DOM-only, so they collapse on any filter change), and PNG/Copy export a **fully-expanded** snapshot of the current filtered view (via `matrixReportHTML` → SVG `foreignObject` → the shared `attachExport`/`svgToBlob` canvas pipeline used by the charts). **I-15** moved the Filter Panel's **Include excluded** checkbox and **Reset filters** button up inline into a `.panel-head` (title left, `.head-actions` right) — consistent with the Panel 10 header pattern — while keeping **Search** in the body as a key function component; and added a `▾/▸` collapse toggle (in the header, `btn btn-mini`) to the **KPI**, **Filter**, and **Discipline Summary** panels, wrapping each in `.panel-body` and hiding it via `.panel.collapsed .panel-body{display:none}` (print overrides so collapsed panels still print). Collapse state is held in a module-level `collapsed` Set keyed by panel id so it survives re-renders, toggled without a data re-render, and reset on reload. Tests pass 47/47; `MDL-Dashboard.html` rebuilt (75,716 bytes). I-07 (A6 anchor) is now partially wired — `Code!B6` is read into `meta.projectStartDate` and used as the Matrix month-selector start and the S-curve x-axis origin; the as-of date and reporting-period filter remain deferred per §10. **I-17** consolidated the Charts panel: the 9 separate chart cards (3-column grid) are replaced by a single interactive chart driven by a `<select>` dropdown (grouped Documents/Issues, 8 categorical breakdowns, default = Discipline) with a Bar/Pie toggle (cardinality cap > 12 → Bar) and PNG/Copy export; a module-level `chartView` persists the selection across filter re-renders, and `issueProgress` is intentionally excluded (carved out to I-16). **I-16** implemented 2026-09-30 — the old single Charts panel is split into two sibling panels: a **Charts** panel with the Documents breakdown and Issues breakdown shown as two interactive charts side by side (independent dropdowns / Bar-Pie / PNG-Copy, defaults Discipline and DQ by Discipline), and an **Issue-Progress** panel below with a shared period-window slider and the cumulative **S-curve** (Planned / Forecast / Actual) and **monthly grouped bar** side by side, each with its own PNG/Copy export. Both derive from `monthlyProgress` (timeline = earliest date → latest date + 1 month buffer, forecast→plan fallback) and inherit the global Filter Panel (no new filter). Tests pass 52/52; `MDL-Dashboard.html` rebuilt (87,206 bytes). **I-18** consolidated the Overdue List (Panel 13): the three per-flavour blocks are replaced by one consolidated table with an Overdue Type filter and a ⤓ CSV (`MDL_Overdue.csv`) export; discipline filtering remains on the global Filter Panel. **I-19** extended that list to 13 columns using the workbook's exact Excel names — adding `Planned`/`Forecast`/`Actual 1st Issue Date`, `Latest Approval Date`/`Latest Approval Status`, `Submission Status`, and a computed `Delay (days)` (calendar for 1st-submission, working days for Resubmission/Client-review, computed in `deriveView`). I-07 (A6 anchor) is now partially wired — `Code!B6` is read into `meta.projectStartDate` and used as the Matrix month-selector start and the S-curve x-axis origin; the as-of date and reporting-period filter remain deferred per §10. **I-20** applied the `▾/▸` collapse toggle to all 8 panels (previously only KPI / Filter / Discipline Summary had it). **I-21** removed the small descriptive header tags and added a `?` help button to every panel (left of the collapse toggle) that opens a modal explaining each panel's source data (Code-sheet columns / lookup tables / Error Code block AI:AL), calculations, consolidation method, and term definitions (e.g. "active"); `MDL-Dashboard.html` rebuilt (101,607 bytes). **I-22** added a fixed bottom status bar (navy, matches the title bar) with high-level summary chips — File (loaded dot), Planned, Submitted, 1st-sub progress % (mini bar), Valid (active set), Overdue, Completeness, Disciplines, As-of (reporting date), and a current Filter summary — refreshing on every filter/render. **I-23** renamed the Matrix `Submitted` column to `Total Submitted` and added three "this month" submission columns — `Plan (This Mth)`, `Forecast (This Mth)`, `Actual (This Mth)` — after it (both in the on-screen table and the PNG/Copy/SVG export), counting documents whose Planned / Forecast-or-Planned / Actual 1st-issue month equals the as-of month; `MDL-Dashboard.html` rebuilt (107,023 bytes). **I-24** added an inline **Month selector** to the Matrix header (Panel 10) that chooses which month the three "this month" columns count; it defaults to the as-of month and lists a continuous range from the **project start (Code!B6)** through the as-of month — including months with no submissions (and `buildModel` now reads `Code!B6` into `meta.projectStartDate`, tolerant of Excel serial / ISO / text); only those three columns change — `Planned`/`Total Planned`, `Total Submitted`, the approval split, and the three overdue counts stay all-time / as-of-today totals; `MDL-Dashboard.html` rebuilt (115,664 bytes). **I-25** overhauled the Matrix presentation: a two-tier grouped header (Total Submission / Submission(month) / Approval / Overdue), the three selected-month columns shaded light yellow, a bold **TOTAL** row summing every column, `Planned` renamed to **Total Planned**, the submission percent folded into `Total Submitted` as count (percent) (percent = divide by Total Planned, all disciplines), and all numeric columns centre-aligned; `MDL-Dashboard.html` rebuilt (115,664 bytes). **I-26** added a no-drop **List End Row** (`Code!B8`) rule — the per-discipline reader always reads to each tab's actual last row, and if a tab exceeds the advisory limit it raises a `W-ENDROW` warning (amber) in a new **top banner** (system/fatal messages home), while data-quality details stay in the Validation panel (Panel 12); the banner is hidden when there are no warnings; `MDL-Dashboard.html` rebuilt (118,021 bytes). **I-27** fixed the Issue Progress panel: the S-curve / monthly bar now span the full month range (`min(Code!B6, earliest-document-date)` → latest) so pre-start documents are never dropped, and `B6` is marked with a red dashed **PS** line + caption; added validation rule **V-28** (document date before `Code!B6`, shown in Panel 12); the Period-window sliders and each chart's PNG/Copy buttons are now inline with their panel/card title per the common `.panel-head` rule; `MDL-Dashboard.html` rebuilt (**121,943 bytes**). **Bug fix (post-I-27):** the Issue Progress panel passed a legend HTML string to appendChild (which requires a Node), throwing and aborting renderCurvePanel — so the S-curve and every panel after it (Overdue/Validation/Detail) failed to display. Fixed to insertAdjacentHTML; all panels now render. **I-28** added a Download CSV button to the Discipline Summary Matrix (Panel 10) toolbar — exports the full matrix (per-discipline rows + per-stage sub-rows + TOTAL) as `MDL_Discipline_Matrix_<month>.csv` with a UTF-8 BOM for Excel, using a new `matrixCSV` helper and the reused `downloadCSV`; `MDL-Dashboard.html` rebuilt (123,880 bytes). **I-29** guarantees the project-start month is always inside the Issue-Progress range (so the PS marker always draws), reduced that marker to a **vertical line only** (removed the “PS” text tag), and reset the period-window (`scurveWin`) on every workbook load (review item **#4**). Review outcomes also recorded: item **#1** (Matrix PNG/Copy via `foreignObject`) was **verified working** in the user’s browser — no change made; item **#2** (**V-28**) is present in the Code sheet at `Code!AI29:AL29` (group `D`, severity `Warning`) and is resolved correctly — its **354** findings are expected because `Code!B6 = 2026-03-15` while the document list is mock-up data inherited from a previous project; `MDL-Dashboard.html` rebuilt (124,081 bytes). **I-30** standardised all four CSV download buttons to one pattern — label `⤓ CSV` with a `Download <content> as CSV` tooltip (Matrix, Overdue, Validation, Detail) — and corrected two help texts that named filenames that did not match what those buttons actually write (`MDL_Issues.csv`→`MDL_issue_list.csv`, `MDL_Documents.csv`→`MDL_document_list.csv`). `MDL-Dashboard.html` rebuilt (123,956 bytes).
