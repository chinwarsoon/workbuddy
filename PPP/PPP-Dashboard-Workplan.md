# PPP Dashboard — Developer Workplan

> **Project**: Procurement Package Plan (PPP) Interactive Dashboard  
> **Version**: 1.13  
> **Date**: 2026-09-16  
> **Status**: Active Development — **Wave 0 (P0-B: I-42…I-48), Wave 1 (P0: I-27 + I-30), Wave 2 (P1: I-31, I-32, I-34, I-35 + I-46), and Wave 3 (P2: I-28, I-29, I-33, I-36…I-40 + I-47) implemented and VERIFIED** (see §14.6–§14.9 and **§15**). **Rev 1.7 fixed I-51.** **Rev 1.8 closes §15.5**: **I-49** resolved (the `Status Category` block is **not required** — dropped from the contract, V-18 false positive eliminated), **I-50** resolved as **accepted behaviour** (V-20 stays a warning; `List End Row = 300` is a template bound), **I-52** resolved as a **workbook task** (the missing V-19/V-20 rows will be added to `Code!Q:R`). **`renderCodeMap()` now reports both the description column and its paired code column.** **Rev 1.9 implements I-11** — the Code sheet Error table (`Code!Q:R`) is now the wording source for every validation rule, with a **warning-only** fallback (**V-21**) for any code that has no row there, plus the I-49/I-53 cleanups inside `isIssued()`. See **§15.9**. **Rev 1.10 re-verifies I-51 by execution and fixes two defects it exposed — a regression test that could not fail, and a map line that credited a blank code column with data (§15.10).** Remaining: **V-08** is a workbook data-entry task; **V-22** (empty lookup code column) is an open question. **Rev 1.11 audits every table for open rows (§15.11) — 6 remain: 1 decision (I-05b / V-22), 5 parked backlog; no code changed.**

> ⚠ **There are two workplan files.** This is the current one. The earlier Chinese workplan (`WORKPLAN.md`, Rev v2, 2026-09-15) was moved to **`arch/WORKPLAN.md`** and is kept for history only — do not edit it.

> **Rev 1.13 = dead-code cleanup (§15.12).** A sweep for unreachable / dead code found that **I-25 was not really "a dead helper" but "a rule that could never fire"**: V-12's engineer-variant detector added a raw string to a Set **keyed by that same raw string**, so every Set had size 1 and `s.size > 1` was unreachable by construction. The helper (`normPerson()`) and the broken grouping are both gone; **V-12 now groups spellings that differ only in whitespace / slash spacing** and reports every distinct raw spelling. Harness gains **4 assertions** pinning both directions (variants MUST fire, genuinely different names MUST NOT merge, workbook must stay clean). **VERIFICATION PENDING** — shell unavailable.

---

## 0. Contents — quick navigation

| § | Section | Note |
|---|---------|------|
| 1 | Summary & Purpose | §1.3 = guiding principles (the **Layered** principle points to §13) |
| 2 | Revision History | Rev **1.13** = current (**dead-code cleanup — I-25 closed, V-12 now reachable**); Rev 1.12 = I-05b closed by the workbook (Category Code + Lead Time/Days); Rev 1.11 = pending-issue audit; Rev 1.10 = I-51 re-verified; Rev 1.9 = I-11 implemented; Rev 1.8 = I-49 closed · I-50/I-52 as workbook-side |
| 3 | Functions & Workflow Chart | ⚠ line numbers stale — see I-41 |
| 4 | Excel Data Structure — Code Sheet Contract | |
| 5 | Dashboard Charts — Detailed Specifications | |
| 6 | Validation Rules V-01 … V-21 | V-21 = Error-table coverage (warning only) |
| 7 | Issues & Actions I-01 … I-26 | §7.1 = I-23 root-cause log |
| 8 | Developer Guide — Common Tasks | |
| 9 | Testing Checklist | |
| 10 | Future Enhancements (Backlog) | |
| 11 | File Reference | ⚠ line numbers stale — see I-41 |
| 12 | Quick Start for New Developers | |
| **13** | **UI Architecture Review — 5-Layer Target Model** | **APPLIED — issues I-27…I-40 all resolved (Waves 1–3)** |
| **14** | **Cross-audit of `codecheck.md`** | **APPLIED — I-42…I-48 resolved (Wave 0) · §14.6–§14.9 = per-wave logs** |
| **15** | **Verification Run** | **APPLIED · syntax + headless end-to-end pipeline verified · §15.5 = issue log (I-49…I-52) · §15.8 = closure log · §15.9 = I-11 feature log · §15.10 = I-51 re-verification · §15.11 = pending-issue audit · §15.12 = dead-code cleanup** |
| **15.11** | **Pending-issue audit** | **0 items need a decision · 6 parked backlog + parser rails** |
| **15.12** | **Dead-code cleanup** | **I-25 closed (V-12 was unreachable by construction) · I-12 found stale · 2 non-dead items confirmed** |

> **🔎 Looking for the 5-layer structure?** Go to **§13**. Quick map:
> **§13.1** why · **§13.2** as-built measurements · **§13.3** the 5 layers (diagram + ownership table)
> **§13.4** naming & token conventions · **§13.5** accessibility baseline · **§13.6** issues **I-27 … I-41**
> **§13.7** P0/P1/P2 roadmap · **§13.8** non-goals · **§13.9** where the old backlog lands
>
> The five layers, bottom-up: **01 Tokens → 02 Primitives → 03 Data → 04 Logic → 05 View**.
> Dependency rule: a layer may only call **downward**.

---

## 1. Summary & Purpose

### 1.1 Overview
The PPP Dashboard is a **standalone, offline-first, browser-based interactive dashboard** for visualizing and validating Procurement Package Plans. It parses Excel workbooks (`.xlsx`) or CSV exports entirely in the browser — no server, no external dependencies, no data leaves the user's machine.

### 1.2 Purpose
- **Primary**: Give procurement leads, project engineers, and package managers a single-page view of package status, workload, lead times, and PO issuance health.
- **Secondary**: Enforce data quality by validating every package against the Code sheet's lookup lists and metadata rules, surfacing issues before they propagate to downstream systems.
- **Tertiary**: Provide a reference benchmark (2026 industry lead times) to sanity-check estimated lead times during quotation.

### 1.3 Key Principles
| Principle | Implementation |
|-----------|----------------|
| **Offline-first** | All parsing (ZIP + XML), charting (inline SVG), and validation run in-browser |
| **Zero dependencies** | No CDN, no npm, no frameworks — single HTML file |
| **Contract-driven** | Code sheet (rows 1–8 = metadata, rows 9+ = column map + Data Types) drives all parsing |
| **Fail-soft** | Validation never blocks rendering; dashboard always shows, issues listed in Validation panel |
| **Exportable** | Charts → PNG (clipboard/download), Validation → CSV |
| **Layered** *(target)* | 5 layers — tokens → primitives → data → logic → view; dependency flows downward only. See **§13** |

---

## 2. Revision History

| Rev | Date | Author | Changes |
|-----|------|--------|---------|
| 0.1 | 2026-08-?? | — | Initial prototype: basic PPP parsing, status/discipline charts |
| 0.5 | 2026-09-01 | — | Added Code sheet contract (Data Types in column C), validation engine, KPIs |
| 0.8 | 2026-09-10 | — | Stage Plan Coverage, PO Monthly, Look-Ahead, Delays, Benchmark table |
| 0.9 | 2026-09-14 | — | Engineer normalization, criticality lookup, data-quality flags, export functions |
| 1.0 | 2026-09-15 | — | Production-ready: all charts, validation rules (V-01..V-18), benchmark, DQ flags |
| **1.1** | **2026-09-16** | **Current** | **BUGFIX (I-23) — offline XLSX parser no longer loses cells after self-closing empty cells (`<c r="M2" s="7"/>`). Restores Engineer coverage 31/122 → 122/122, all 8 engineer names, all date columns. See §7.1 root-cause log + corrective/preventive actions** |
| 1.2 | 2026-09-16 | UI Design | **DRAFT — PENDING APPROVAL.** Added **§13 UI Architecture Review — 5-Layer Target Model**: as-built structure, target layer map, naming/token conventions, accessibility baseline, issues **I-27 … I-40**, and a P0/P1/P2 roadmap. **No code was changed in this revision.** |
| **1.3** | **2026-09-16** | UI Design | **Wave 1 implemented**: I-27 `METRICS` registry (add-a-chart is now **one place**, not four) and I-30 single `STATE` object + `render(STATE)` (DOM write-only). Wave 0 (P0-B: I-42…I-48) remains in place. **Structural refactor only — no visual or behavioural change.** See §14.7. |
| 1.4 | 2026-09-16 | UI Design | **Wave 2 implemented**: I-31 `buildDashboard` split (`parseWorkbook → buildModel → render`), I-32 validation **rule table**, I-34 semantic colour tokens, I-35 `CHART` geometry object, + I-46 folded into I-32. I-11 deferred (behaviour-changing feature, not a refactor). Structural only. See §14.8. |
| **1.5** | **2026-09-16** | UI Design → superseded | **Wave 3 implemented (P2 — final wave)**: I-28 per-metric behaviour as a registry `note` capability (no `key===…` branch), I-29 dead `htmlHBar()` deleted (one bar renderer), I-33 whole script wrapped in an **IIFE** (≈40 globals removed), I-36 inline styles gone (with I-29), I-37 `.ds-*` primitive naming (`.text-bad`→`.ds-bad`, `.warn-text`→`.ds-warn`, `.note-lead` retired), I-38 table styles scoped to `.ds-table`, I-39 **reduced-motion + print + dark-theme** blocks, I-40 a11y baseline (`role="img"`/`aria-label` on charts, `scope="col"` on headers, popup-role mismatch fixed, global `:focus-visible`), and I-47 filter-panel `max-width` + ellipsis labels. **All five roadmap waves now complete.** Structural only — see §14.9. |
| **1.6** | **2026-09-16** | verification | **§15 Verification Run — the Wave 0–3 verification gap is closed.** The script compiles (**SYNTAX OK, 62,260 chars**) and a new headless harness (`test/test_pipeline.mjs`) runs the *shipped* script against the *real* workbook end-to-end: **16/16 assertions pass**, 14 chart renders produced. This confirms every structural claim in §14.6–§14.9 **by execution**, not just by inspection. Also records that the workbook has moved on (Code!C Data Type now populated → **V-16 resolved**; `Code!Q:R` Error table now populated → **I-11 unblocked**; `List End Row` now 300) and logs **I-49…I-52**. No code changed. |
| 1.7 | 2026-09-16 | UI Design | **I-51 fixed (§15.7)** — `LOOKUP_HEADERS` gains a `categoryCode` key, `lookups.categoryCode` is now read, and `lookupMeta.category.codeCol` points at **N** (`Category Code`) instead of **O** (`Item Category`). Three one-line changes; **no rendered output changes** (nothing consumed `codeCol` yet — the value is correct data for I-11). Harness gains two I-51 assertions. |
| 1.8 | 2026-09-16 | UI Design | **I-49 / I-50 / I-52 closed (§15.8).** `Status Category` dropped from the contract — V-18's false positive eliminated **at the source**; `List End Row = 300` accepted as a template bound, so V-20 stays a warning; the workbook owner adds the missing V-19/V-20 rows to `Code!Q:R`. `renderCodeMap()` now reports the column location of every block (description column **and** paired code column) and is derived from `lookupMeta`, deleting the duplicate contract copy that caused I-49. |
| 1.9 | 2026-09-16 | UI Design | **I-11 implemented — the rule wording now comes from the workbook (§15.9).** `LOOKUP_HEADERS` gains `errorCode` / `errorDescription`; new row-aligned `readLookupMap()` builds `model.errorTable` from `Code!Q:R`; every issue carries `desc`; the validation panel gains a deduplicated **Rule reference** list plus a tooltip on each rule code; `renderCodeMap()` reports where the Error table lives; new **V-21** warns — never errors — when a fired code has no row in the table. Also: `isIssued()` lost its dead `statusCategory` branch (I-49 residue) and now canonicalises the status first (**I-53**). |
| 1.11 | 2026-09-16 | UI Design | **Pending-issue audit (§15.11)** — every table swept for non-closed rows. The single decision item (I-05b / V-22) was surfaced here and then resolved by the workbook owner. **Zero decision items remain; 6 parked backlog + parser rails.** Recorded explicit **non-issues** (V-08 ×119, V-20 ×1) so they stop being re-raised. |
| **1.12** | **2026-09-16** | **Current** | **I-05b closed on the workbook side (§15.11 A).** `Category Code` (N) now carries real values and `Lead Time` is confirmed **days** — column K re-headed `Estimate Lead Time (Days)`, numeric in every cell — so the Lead Time chart reads real durations instead of sinking into *"Not set"*, and **V-22 is not needed for this workbook**. The parser's number branch gained a comment documenting that it reads the cached `<v>` and deliberately never evaluates `<f>` (formula-caching behaviour, its limits, and the V-04 surfacing path are all recorded). **Behaviour unchanged** — the code edit is a comment; **VERIFICATION PENDING** (shell unavailable). |
| 1.10 | 2026-09-16 | UI Design | **I-51 re-verified — the first *executed* run of the harness caught two defects in the I-49/I-51 window (§15.10).** (1) The I-51 regression test asserted `Array.isArray(...)`, which **passes on an empty array** — it could not fail, so "categoryCode now resolves" was unverified for two revisions. It now asserts the real contract, and the finding was that **`Code!N` (Category Code) was header-only at the time** — an empty `lookups.categoryCode` was *correct*, a worksheet gap not a code bug. (2) `renderCodeMap()` printed `Item Category: col O · code col N · 19 values`, crediting the **blank** code column with the description column's count; `lookupMeta` now carries `codeN` and a blank code column renders **`(empty)`**. Harness **42 → 46 assertions, all passing**. **No chart/KPI change.** |
| **1.13** | **2026-09-16** | **Current** | **Dead-code cleanup (§15.12) — I-25 closed, and I-12 found stale.** `normPerson()` deleted (defined, never called). **The real defect was not the helper but V-12 itself: it was unreachable by construction** — the engineer tally stored a raw string in a Set keyed by that same raw string, so every Set held exactly one member and `size > 1` could never hold. V-12 now keys **loosely** (collapsed slash + whitespace) while the Set holds **distinct raw spellings**, so variants like `Dilip/Siva` vs `Dilip / Siva` are reported, with genuinely different names kept separate. Verified **not** dead and left alone: `TYPE_ALIASES` / `normType` (used by `parseFieldTypes`). Harness gains **4 V-12 assertions** (both directions + the shipped workbook must stay clean). **VERIFICATION PENDING** (shell unavailable). |

---

## 3. Functions & Workflow Chart

### 3.1 High-Level Flow

```
┌─────────────────────┐
│  User opens HTML    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Welcome Screen     │  ── Drag/drop or click "Select Package Plan file…"
│  (drop zone + btn)  │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  FileReader →       │  ── .xlsx: parseXlsx()  (ZIP → XML → sharedStrings → sheets)
│  ArrayBuffer        │  ── .csv:  parseCSV()   (simple split)
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  buildDashboard()   │
│  1. Identify sheets │  PPP sheet (name matches /ppp/i) + Code sheet (/code/i)
│  2. Parse Code      │  parseCodeSheet() → meta, metaTypes, fieldToCol map
│  3. Read lookups    │  Discipline, Criticality, Status, Category (code + desc)
│  4. Parse PPP rows  │  headerRow+1 .. lastRow, typed by fieldToCol + Data Types
│  5. Normalize       │  engineer names, status canonicalization
│  6. Validate        │  validate() → 21 rules (V-01..V-21)
│  7. Render all      │  KPIs, 6 charts, 3 tables, benchmark, DQ flags
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Interactive UI     │
│  • Bar/Pie toggle   │  (persisted in localStorage)
│  • Copy/Download    │  SVG → canvas → PNG (2× scale)
│  • Reload file      │
└─────────────────────┘
```

### 3.2 Core Functions (alphabetical)

| Function | Location | Purpose |
|----------|----------|---------|
| `buildDashboard(result, filename)` | L467 | Main orchestrator: sheets → parse → validate → render |
| `parseXlsx(buf)` | L335 | ZIP/EOCZ parse → sharedStrings + workbook.xml + sheet XMLs → grid[][] |
| `parseSheet(xml, shared)` | L299 | sheetData XML → 2D array (row-major, 0-indexed cols). **See §8.6 invariants — self-closing `<c .../>` must not swallow the next cell (I-23)** |
| `parseCodeSheet(codeGrid)` | L377 | Rows 1-8 → meta + metaTypes; Rows 9+ → field → Column-X map |
| `buildFieldToCol(meta)` | L390 | CODE_SHEET_KEYS → column index via `Column-X` ref |
| `parseFieldTypes(codeGrid)` | L410 | Reads column C (Data Type) for each mapped field |
| `findLookupColumns(codeGrid)` | L424 | Scans row 1 for Discipline/Criticality/Status/Category headers |
| `readLookupCol(grid, c, start)` | L435 | Extracts lookup values until 3 blank rows |
| `readLookupMap(grid, codeCol, descCol, start)` | L560 | **I-11** — code → wording map, read row-by-row, for the Code sheet Error table |
| `validate(pkgs, ctx)` | L566 | 21 rules → issues[] {sev, code, pkg, field, value, msg, **desc**} |
| `renderRuleRef(rep)` | L990 | **I-11** — deduplicated rule-wording reference shown in the validation panel |
| `renderValidation(rep)` | L671 | Chips + detail table + code map summary |
| `renderKPIs(pkgs)` | L897 | 6 KPI cards with status classes |
| `renderCat(key)` | L855 | Status/Discipline/Engineer/Criticality/Leadtime → Bar or Pie |
| `svgStage(pkgs)` | L889 | Grouped bar: MR/PO/VD/FAT/ROS Planned vs Actual |
| `renderPOMonthly(pkgs)` | L918 | Monthly grouped bar: PO Plan vs Actual |
| `renderLookAhead(pkgs, asOf)` | L936 | Table: POs planned in next 90 days |
| `renderDelays(pkgs, asOf)` | L943 | Table: PO Plan < AsOf but status not issued |
| `renderBenchmark()` | L950 | Static 2026 industry reference table |
| `renderDQ(pkgs)` | L954 | Heuristic data-quality flags |
| `chartToPng(svgEl)` | L967 | SVG → blob (PNG @ 2×) for clipboard/download |
| `handleFile(f)` | L1005 | Entry point: arrayBuffer → parseXlsx/CSV → buildDashboard |

---

## 4. Excel Data Structure — Code Sheet Contract

### 4.1 Sheet Layout — Overview

The Code sheet has **6 distinct column groups**. Row 1 contains headers for all groups.

| Group | Columns | Purpose | Header Row (Row 1) |
|-------|---------|---------|-------------------|
| 1. Metadata | A–C | Project info + field→column mappings + data types | `Project Metadata Title` / `Values` / `Data Type` |
| 2. Discipline | E–F | Discipline lookup (code ↔ description) | `Discipline Code` / `Discipline Description` |
| 3. Criticality | H–I | Criticality/Inspection Level lookup | `Criticality Code` / `Criticality` |
| 4. Status | K–L | Package Status lookup | `Status Code` / `Package Status` |
| 5. Category | N–O | Item Category lookup | `Category Code` / `Item Category` |
| 6. Error table | Q–R | Rule text for the validation codes (V-01 … V-20 populated) | `Error Code` / `Error Description` |

> **Note**: Groups 2–5 are **lookup tables** read by `findLookupColumns()` which scans row 1 for header text (case-insensitive, prefix match). Column positions are not fixed.
>
> **Note**: Group 6 (Error table) is **read by the dashboard as of Rev 1.9** (**I-11**) — it is the wording source for every validation rule. Like groups 2–5 it is located by row-1 header text (`Error Code` / `Error Description`), never by a fixed letter. A code with **no** row here falls back to the dashboard's built-in message and raises **V-21** as a *warning only*. See **§15.9**.
>
> **Note**: there is **no `Status Category` block** and none is required — see **I-49** (§15.8). The app's contract is exactly the four blocks in groups 2–5.

---

### 4.1.1 Group 1 — Metadata & Field Mappings (Columns A–C)

| Row | Col A: Title | Col B: Value | Col C: Data Type | Notes |
|-----|--------------|--------------|------------------|-------|
| 1 | **Project Metadata Title** | **Values** | **Data Type** | Header row |
| 2 | Project Title | `TWRP C3B2` | Text | Project display name |
| 3 | Project Code | `C3B2` | Text | Short project code |
| 4 | Client | `PUB` | Text | Client name |
| 5 | Consultant | `Jacobs` | Text | Consultant name |
| 6 | AsOf Date | `2026-09-14` | **Date** | **Required** — dashboard reference date (Excel serial 46280) |
| 7 | Header Row | `1` | **Int** | 1-indexed row of PPP column headers |
| 8 | List End Row | `300` | **Int** | 1-indexed last PPP data row (inclusive). **A template bound** — only 122 rows hold data, so V-20 warns on every load **by design** (see **I-50**, §15.8) |
| 9 | S No. | `Column-A` | Int | → PPP Column A |
| 10 | Discipline | `Column-B` | Text | → PPP Column B |
| 11 | Package Title | `Column-C` | Text | → PPP Column C **(required)** |
| 12 | Package No. | `Column-D` | Text | → PPP Column D |
| 13 | Item Category | `Column-E` | Text | → PPP Column E |
| 14 | Area | `Column-F` | Text | → PPP Column F |
| 15 | Equipment Tags | `Column-G` | Text | → PPP Column G |
| 16 | Package Notes | `Column-H` | Text | → PPP Column H |
| 17 | Criticality | `Column-I` | Text | → PPP Column I |
| 18 | Quantity | `Column-J` | **Number** | → PPP Column J |
| 19 | Estimate Lead Time | `Column-K` | **Int** | → PPP Column K (days) |
| 20 | Package Status | `Column-L` | Text | → PPP Column L |
| 21 | Supplier | `Column-M` | Text | → PPP Column M |
| 22 | Design Engineer | `Column-N` | Text | → PPP Column N |
| 23 | Buyer | `Column-O` | Text | → PPP Column O |
| 24 | Project Engineer | `Column-P` | Text | → PPP Column P |
| 25 | MR Plan Date | `Column-Q` | **Date** | → PPP Column Q |
| 26 | MR Forecast Date | `Column-R` | **Date** | → PPP Column R |
| 27 | MR Actual Date | `Column-S` | **Date** | → PPP Column S |
| 28 | PO Plan Date | `Column-T` | **Date** | → PPP Column T |
| 29 | PO Forecast Date | `Column-U` | **Date** | → PPP Column U |
| 30 | PO Actual Date | `Column-V` | **Date** | → PPP Column V |
| 31 | VD Approval Plan Date | `Column-W` | **Date** | → PPP Column W |
| 32 | VD Approval Forecast Date | `Column-X` | **Date** | → PPP Column X |
| 33 | VD Approval Actual Date | `Column-Y` | **Date** | → PPP Column Y |
| 34 | FAT Plan Date | `Column-Z` | **Date** | → PPP Column Z |
| 35 | FAT Forecast Date | `Column-AA` | **Date** | → PPP Column AA |
| 36 | FAT Actual Date | `Column-AB` | **Date** | → PPP Column AB |
| 37 | ROS Plan Date | `Column-AC` | **Date** | → PPP Column AC |
| 38 | ROS Forecast Date | `Column-AD` | **Date** | → PPP Column AD |
| 39 | ROS Actual Date | `Column-AE` | **Date** | → PPP Column AE |

---

### 4.1.2 Group 2 — Discipline Lookup (Columns E–F)

| Row | Col E: Discipline Code | Col F: Discipline Description |
|-----|------------------------|-------------------------------|
| 1 | **Discipline Code** | **Discipline Description** |
| 2 | A | Architecture |
| 3 | B | Building Services |
| 4 | C | Civil |
| 5 | D | Design Management |
| 6 | E | Electrical |
| 7 | G | Geotechnical |
| 8 | HS | Environmental, Health, Safety & Security |
| 9 | I | Instrument, Control & Automation (ICA) |
| 10 | IM | Information Management/IT |
| 11 | K | Construction Management |
| 12 | M | Mechanical |
| 13 | PI | Piping |
| 14 | PR | Process |
| 15 | PC | Project Controls |
| 16 | PM | Project Management |
| 17 | Q | Quantity Survey/Estimating |
| 18 | S | Structural |
| 19 | W | Procurement, Contract |
| 20 | Z | General (non-specific) |

**Validation**: PPP `Discipline` (Column B) must match a Code or Description (V-06 warning if not found).

---

### 4.1.3 Group 3 — Criticality Lookup (Columns H–I)

| Row | Col H: Criticality Code | Col I: Criticality |
|-----|-------------------------|-------------------|
| 1 | **Criticality Code** | **Criticality** |
| 2 | 0 | Not Applicable |
| 3 | 1 | Factory In-house Quality Control |
| 4 | 2 | Third Party Inspection |
| 5 | 3 | Witness Point |
| 6 | 4 | FAT Record Submission Only |

**Validation**: PPP `Criticality` (Column I) must match a Code or Description (V-05 error/warning). If all blank → Criticality chart empty + V-05 warning.

---

### 4.1.4 Group 4 — Package Status Lookup (Columns K–L)

| Row | Col K: Status Code | Col L: Package Status |
|-----|--------------------|----------------------|
| 1 | **Status Code** | **Package Status** |
| 2 | NS | Not Start |
| 3 | MR | Requisition in Progress |
| 4 | VI | Pending Vendor Approval |
| 5 | PO | PO Issued, Prepare Vendor Data Submission |
| 6 | VDA | Pending Vendor Data Approval |
| 7 | FAB | Fabrication in Progress |
| 8 | FAT | FAT Completed |
| 9 | DEL | Delivered |
| 10 | RI | Receive Inspection Done |

**Validation**: PPP `Package Status` (Column L) must match a Code or Description (V-07 error if not found). Dashboard **canonicalizes** both to Description for display.

---

### 4.1.5 Group 5 — Item Category Lookup (Columns N–O)

| Row | Col N: Category Code | Col O: Item Category |
|-----|----------------------|---------------------|
| 1 | **Category Code** | **Item Category** |
| 2 |  | Building Service Work Package |
| 3 |  | Cable |
| 4 |  | Cable Tray and Ladder |
| 5 |  | Construction Work Package |
| 6 |  | Design Consultancy Service |
| 7 |  | EICA Bulk |
| 8 |  | EICA Panels |
| 9 |  | Electrical Equipment |
| 10 |  | Equipment Package |
| 11 |  | ICA Equipment |
| 12 |  | ICA Panel |
| 13 |  | Instrument |
| 14 |  | Misc. Mech Item |
| 15 |  | Piping Bulk |
| 16 |  | Piping SP |
| 17 |  | Rotating Equipment |
| 18 |  | Static Equipment |
| 19 |  | Valve |
| 20 |  | Pressure Vessel |

> **Note**: Category Codes (Col N) are currently empty in the sample file. Lookup matches on Description only.

**Validation**: PPP `Item Category` (Column E) must match a Description (V-17 warning if not found).

---

### 4.1.6 Group 6 — Error Code/Description (Columns Q–R)

| Row | Col Q: Error Code | Col R: Error Description |
|-----|-------------------|--------------------------|
| 1 | **Error Code** | **Error Description** |
| 2 | V-01 | Skipped rows — Package Title blank within Header Row to List End Row range |
| 3 | V-02 | Invalid Excel date — numeric value not in valid serial range (40000–70000) |
| 4 | V-03 | Unparsable date — text value cannot be read as a date |
| 5 | V-04 | Non-numeric value in Quantity or Estimate Lead Time field |
| 6 | V-05 | Criticality invalid (not in Code sheet) or empty on packages |
| 7 | V-06 | Discipline not found in Code sheet lookup |
| 8 | V-07 | Package Status not found in Code sheet lookup |
| 9 | V-08 | Stage plan dates out of sequence (e.g., MR Plan > PO Plan) |
| 10 | V-09 | Actual date entered but corresponding Plan date is empty |
| 11 | V-10 | Actual date is later than AsOf Date |
| 12 | V-11 | Duplicate Package No. appears multiple times |
| 13 | V-12 | Same engineer written different ways (normalized together) |
| 14 | V-13 | PPP rows with Package Title exist beyond List End Row |
| 15 | V-14 | Lead time missing on >50% of packages |
| 16 | V-15 | Code sheet metadata missing or Data Type mismatch (Header Row, List End Row, AsOf Date) |
| 17 | V-16 | Code sheet Column C (Data Type) empty — using built-in fallback |
| 18 | V-17 | Item Category not found in Code sheet lookup |
| 19 | V-18 | Lookup block (Discipline/Criticality/Status/Category) not found in row 1 |
| 20 | V-19 | PPP Header Row cell at title column is blank — Code sheet Header Row may have drifted |
| 21 | V-20 | Expected data rows (lastRow − headerRow) exceeds actual parsed rows (packages + skipped) — completely blank rows silently ignored |

> **Status (Rev 1.9)** — the dashboard **now reads this table**. `LOOKUP_HEADERS.errorCode` / `.errorDescription` locate the pair by row-1 header text (not by a fixed letter), `readLookupMap()` builds `model.errorTable` (`{code → wording}`), and every issue carries that wording as `desc` (**I-11**, §15.9). The `V-19` / `V-20` rows were added to the sheet by the workbook owner on 2026-09-16, closing **I-52**.
>
> **V-21 is app-side and deliberately *not* listed above.** The dashboard emits it itself when a rule code present in the report has **no row** in this table; severity is always **warning**, never error. Adding a `V-21` row is harmless but changes nothing — the rule does not audit its own documentation.
>
> **Recommendation** — keep this table in step with `validate()` whenever a rule is added. Column P is still free, so the block stays at Q–R.

---

### 4.2 Critical Rules for Developers

### 4.2 Critical Rules for Developers

1. **Column C (Data Type) is authoritative** when present. If empty for any mapped field, the dashboard falls back to `LEGACY_DATE_FIELDS` (all date columns) + Text for others. **Always populate column C.**
2. **Header Row / List End Row** (rows 7–8) are 1-indexed. PPP data starts at `headerRow+1` (0-indexed in code).
3. **Lookup blocks** (E–O) are located by **row-1 header text**, not fixed columns. `findLookupColumns()` scans row 1 for known header names (case-insensitive, prefix match).
4. **Status canonicalization**: Dashboard accepts either the **code** (NS, MR, VI, PO, VDA, FAB, FAT, DEL, RI) or the **full description**. Both map to the description for display.
5. **Criticality codes**: 0–4 with descriptions. If blank for all packages, the Criticality chart shows a note and stays empty.
6. **Engineer normalization**: `"Dilip/Siva"` and `"Dilip / Siva"` → `"Dilip / Siva"`. Variants tracked in validation (V-12).

---

## 5. Dashboard Charts — Detailed Specifications

### 5.1 KPIs (6 cards, top of dashboard)

| # | Metric | Calculation | Status Thresholds |
|---|--------|-------------|-------------------|
| 1 | Total Packages | `pkgs.length` | — |
| 2 | Started % | `(T - NotStart - blank) / T × 100` | ≥60% 🟢, ≥40% 🟡, <40% 🔴 |
| 3 | Delivered/RI % | `count(status ∈ {Delivered, Receive Inspection}) / T × 100` | >0 🟢, 0 🔴 |
| 4 | Not Started / blank | `NotStart + blank` | Shows % of total 🟡 |
| 5 | Lead-time coverage | `count(leadTime not null) / T` | ≥50% 🟢, <50% 🔴 |
| 6 | Engineer coverage | `count(engineer not blank) / T` | Always 🟢 |

### 5.2 Categorical Charts (Bar ↔ Pie toggle, persisted)

| Chart | Key | Data Source | Ordering | Special Handling |
|-------|-----|-------------|----------|------------------|
| Package Status | `status` | `tally(pkgs, 'status')` → canonicalized via Code sheet status list | Code sheet order (NS, MR, VI, PO, VDA, FAB, FAT, DEL, RI) | Blanks → "Not Specified (blank)" grey |
| Discipline | `discipline` | `tally(pkgs, 'discipline')` | Descending count | — |
| Engineer Workload | `engineer` | `tally(pkgs, 'engineer')` | Descending count | Normalized names; blanks → "Unassigned (blank)" |
| Criticality | `criticality` | Code sheet codes 0–4 + descriptions | Code order (0,1,2,3,4) | Extras (not in Code) → 🟡 warning color; blanks → grey |
| Lead Time | `leadtime` | **Bar**: Coverage (Estimated/Not) + 4 buckets (≤90, 91–180, 181–270, >270) | Fixed bucket order | **Pie**: buckets only (excludes coverage rows) |

**Bar Chart SVG** (`svgHBar`): 760×dynamic, left label column (240px), horizontal bars, value labels right-aligned.
**Pie Chart SVG** (`svgPie`): 760×dynamic, donut (R=100, r=58), center total, legend right, top-8 + "Other".

### 5.3 Stage Plan Coverage (Grouped Bar)

| Stage | Plan Field | Actual Field |
|-------|------------|--------------|
| MR | `mrPlan` | `mrActual` |
| PO | `poPlan` | `poActual` |
| VD | `vdPlan` | `vdActual` |
| FAT | `fatPlan` | `fatActual` |
| ROS | `rosPlan` | `rosActual` |

**SVG** (`svgGrouped`): 5 categories × 2 series (Planned=#0066CC, Actual=#34C759), Y-axis 0–max, legend bottom.

### 5.4 PO Plan vs Actual — by Month (Grouped Bar)

- **X-axis**: Months from first `poPlan` to last `poPlan`/`poActual` (inclusive), `MMM YY` format
- **Series**: Planned (count of `poPlan` in month), Actual (count of `poActual` in month)
- **Empty state**: If no `poPlan` dates are real Excel dates → shows guidance message

### 5.5 3-Month PO Look-Ahead (Table)

- **Filter**: `poPlan >= AsOf` AND `poPlan <= AsOf + 90 days`
- **Columns**: Package, Discipline, PO Plan, Status
- **Sort**: PO Plan ascending

### 5.6 PO Issuance Delays (Table)

- **Filter**: `poPlan < AsOf` AND `status` not in issued set
- **Issued statuses** (case-insensitive): contains "po issued", "delivered", "receive inspection", "fabrication", "fat completed", "vendor data approval"
- **Columns**: Package, Discipline, PO Plan, Overdue (days), Status
- **Highlight**: `.over` row class → `#FFF6E5` background

### 5.7 Lead Time Benchmark (Static Table)

| Equipment Category | Typical Lead Time | ≈ Days |
|--------------------|-------------------|--------|
| Power transformer | 36–78 weeks | 252–546 |
| MV/HV switchgear | 20–40 weeks | 140–280 |
| Generator (std) | 12–20 weeks | 84–140 |
| Chiller | 16–24 weeks | 112–168 |
| Pump (std) | 8–14 weeks | 56–98 |
| Cooling tower | 12–20 weeks | 84–140 |
| Air handling unit | 12–18 weeks | 84–126 |
| Motor control center | 26–40 weeks | 182–280 |
| SCADA / PLC | 20–30 weeks | 140–210 |
| Structural steel | 16–36 weeks | 112–252 |
| Elevator / escalator | 24–40 weeks | 168–280 |
| Fire & life-safety | 16–30 weeks | 112–210 |

### 5.8 Data-Quality Flags (Heuristic Cards)

| Flag | Condition |
|------|-----------|
| Execution progress = 0 | No Actual dates in any stage column |
| Criticality empty | All packages lack Criticality |
| Lead time sparse | >50% packages missing lead time |
| Engineer unassigned | Any package without engineer |
| Plan-date inconsistency | MR Plan <30% but PO Plan >50% (suggests back-filling) |

---

## 6. Validation Rules (V-01 through V-21)

| Code | Severity | Trigger | Message Template |
|------|----------|---------|------------------|
| V-01 | info | Row in range has no Package Title | `N row(s) skipped` |
| V-02 | error | Date field = number but not in Excel date range (40000–70000) | `Not a real Excel date — number X looks like placeholder` |
| V-03 | error | Date field = text that `new Date()` cannot parse | `Text value cannot be read as a date` |
| V-04 | error | Quantity or Lead Time non-numeric | `Value is not numeric` |
| V-05 | error/warn | Criticality not in Code sheet (code or desc) | `Criticality must be one of: …` / `Criticality empty on N packages` |
| V-06 | warning | Discipline not in Code sheet | `Discipline not found in the Code sheet list` |
| V-07 | error | Status not in Code sheet (code or desc) | `Status not found in the Code sheet list` |
| V-08 | warning | Stage plan out of sequence (e.g., MR Plan > PO Plan) | `Stage plan dates are out of sequence` |
| V-09 | warning | Actual date present but Plan empty | `Actual date entered but X Plan is empty` |
| V-10 | warning | Actual date > AsOf Date | `Actual date is later than the As-of date` |
| V-11 | warning | Duplicate Package No. | `Duplicate Package No. — appears N times` |
| V-12 | warning | Same engineer written differently — spellings that differ **only** in whitespace / slash spacing (`Dilip/Siva` vs `Dilip / Siva`) are grouped by a loose comparison key while the Set keeps the **distinct raw spellings**. Genuinely different names (`Kenny` vs `Kenny/Franklin`) are deliberately **not** merged. **Was unreachable before Rev 1.13 — see §15.12** | `Same engineer written different ways — counted as N separate people in the Engineer chart` |
| V-13 | warning | PPP rows with Title beyond List End Row | `N row(s) after row X contain a Package Title but are excluded` |
| V-14 | warning | Lead time missing on >50% packages | `Lead time missing on N packages (X%)` |
| V-15 | error/warn | Code sheet metadata missing/invalid type | `Header Row missing or not a number` / `Data Type is "X" — expected Date/Number` |
| V-16 | warning | Code sheet column C empty (no Data Types) | `Column C has no Data Type values — fell back to built-in` |
| V-17 | warning | Item Category not in Code sheet | `Item Category not found in the Code sheet list` |
| V-18 | warning | A lookup block (Discipline / Criticality / Status / Category) is absent from Code row 1 — **or** present but unusable: `!col \|\| !n`, where `n` is the *description* column's count, so an empty **code** column passes silently | `Lookup block "X" was not found in row 1` |
| V-19 | warning | PPP Header Row cell at title column is blank — Code sheet Header Row may have drifted | `Header Row N in the PPP sheet has no value in the Package Title column` |
| V-20 | warning | Expected data rows (lastRow − headerRow) exceeds actual parsed rows (packages + skipped) — completely blank rows silently ignored | `Expected N data rows but only M rows had content — X row(s) were completely blank` |
| **V-21** | **warning** | **I-11** — a rule code that appears in the report has **no row** in the `Code!Q:R` Error table | `N rule code(s) used in this report have no row in the Code sheet Error table — the built-in wording is shown instead` |

**Severity order**: Error (0) > Warning (1) > Info (2). Validation panel shows chips + expandable table (max 80 rows, export CSV for full).

---

## 7. Issues & Actions (Current Known Gaps)

| ID | Issue | Impact | Action | Owner | Target |
|----|-------|--------|--------|-------|--------|
| I-01 | ~~Criticality column blank for all packages in sample data~~ | ~~Criticality chart empty, V-05 warning~~ | **DONE** — All 121 packages now have Criticality values (FAT Record Submission Only, Witness Point, Third Party Inspection) | Data Owner | **Closed** |
| I-02 | ~~Engineer column has many "TBC" placeholders~~ | ~~Engineer workload chart skewed, V-12 variants~~ | **DONE** — TBC placeholders replaced with actual engineer names | Data Owner | **Closed** |
| I-03 | No Actual dates entered (all stages) | Stage Plan Coverage shows only Planned; DQ flag "Execution progress = 0" | Enter MR Actual / PO Actual as milestones hit | PM / Procurement | Ongoing |
| I-04 | Lead Time estimated for only ~30% packages | KPI 🔴, V-14 warning, Lead Time chart sparse | Estimate lead time at package creation | Package Engineers | Sprint 1 |
| I-05 | ~~Item Category values not all in Code sheet lookup~~ | ~~V-17 warnings~~ | **DONE** — V-17 downgraded to Info severity; mismatches logged for user attention only, not counted as warnings | Dev | **Closed** |
| I-06 | ~~Package Status uses free text in some rows~~ | ~~V-07 errors, status canonicalization fails~~ | **DONE** — Excel Column L has data validation dropdown; V-07 error correctly surfaces any violations in the dashboard Validation panel | Data Owner | **Closed** |
| **I-05b** | ✅ **RESOLVED 2026-09-16 (workbook side) — no code change needed.** Phase-1 reported that `Code!N` (`Category Code`) was header-only and that `Lead Time` held codes (`A`/`B`/`AA`) rather than durations. **Both were fixed in the workbook:** the `Item Category` lookups now carry real code values, and column K is now headed **`Estimate Lead Time (Days)`** with uniformly numeric cells (30, 60, 150, 180, 330, 735 …). | The Lead Time chart and its buckets now read real day counts instead of silently sinking into *"Not set"* | **Nothing to do in code.** `findLookupColumns()` resolves the blocks by row-1 title, so the added `Category Code` values flow through with no edit. The `Estimate Lead Time` header text still matches `Code!B`'s mapping | Data Owner | **Closed** |
| I-07 | ~~Header Row / List End Row hardcoded in Code sheet~~ | ~~If PPP rows inserted/deleted, range drifts~~ | **DONE** — V-19 warns if Header Row no longer points at a column header; V-20 warns if expected row count vs actual parsed count diverges | Dev | **Closed** |
| I-08 | ~~No "Package Type" (Equipment vs Service) split~~ | ~~Cannot filter charts by type~~ | **DONE** — Item Category used directly as package type; filter bar added to sticky header bar; all charts, KPIs and tables filter simultaneously | Dev | **Closed** |
| I-09 | ~~No milestone trend / S-curve~~ | ~~Cannot see cumulative PO issuance vs plan~~ | **DONE** — Cumulative Plan (dashed) and Cumulative Actual (solid) lines overlaid on PO Monthly bar chart via extended `svgGrouped(lines)` | Dev | **Closed** |
| I-10 | No multi-project support | Single file = single project | Add project selector if multiple files loaded | Dev | v2.0 |
| **I-11** | ~~Error Code/Description (Group 6, cols Q–R) in Code sheet not read by dashboard~~ | ~~Validation rule details hardcoded in JS; Excel lookup table ignored~~ | **DONE (Rev 1.9 — §15.9)** — `errorCode` / `errorDescription` added to `LOOKUP_HEADERS`; new row-aligned `readLookupMap()` builds `model.errorTable`; every issue carries the workbook wording as `desc`; the panel gains a deduplicated **Rule reference** + a tooltip per rule code; `renderCodeMap()` reports the table's columns; new **V-21** warns (never errors) for a code with no row | Dev | **Closed** |
| I-12 | ⚠ **STALE AS WRITTEN (checked Rev 1.13 — §15.12).** The row describes `LEGACY_DATE_FIELDS` as a hardcoded 15-name array used as the fallback when `Code!C` is empty. **That array no longer exists in the dashboard.** Because `Code!C` (Data Type) is now fully populated (31/31 → **V-16 resolved**, Rev 1.6), the fallback path is no longer exercised; the date-field list is derived from the contract (`readFieldTypes()` + `Code!B` mappings). | ~~Parsing not fully data-driven; requires code change to add new date fields~~ → **Not a live gap**: the Code sheet already drives it, and `Code!C` is populated | **No action in code.** Keep the row for provenance only; if a future workbook leaves `Code!C` empty, the *then-current* fallback must be re-checked, because this row's description no longer matches the code | Dev | **Stale — verify before acting** |
| I-13 | `isIssued()` status keywords hardcoded (6 strings: "po issued", "delivered", "receive inspection", "fabrication", "fat completed", "vendor data approval") | Fragile string matching; new statuses require code change | **Closed by decision — see I-49 / I-53.** The proposed "Status Category" lookup column was **dropped from the contract** (I-49), so `isIssued()` stays keyword-based *by design*. Its dead `statusCategory` branch is gone and the status is now canonicalised before matching (I-53). A fully data-driven variant (compare the status's index against `PO` in the Status lookup) remains in §10 backlog | Dev | **Closed (by decision)** |
| I-14 | Lead time buckets hardcoded (≤90, 91–180, 181–270, >270 days) | Business cannot adjust thresholds without code change | Add Lead Time Bucket config to Code sheet (e.g., new group or metadata rows: `LeadTime Bucket 1` = 90, `Bucket 2` = 180, etc.) | Dev | v1.1 |
| I-15 | Benchmark table hardcoded (12 equipment categories) | Industry updates require code deploy | Move to separate "Benchmark" sheet or extend Code sheet with Equipment Category / Typical Lead Time / Days columns | Dev | v1.1 |
| I-16 | KPI thresholds hardcoded (Started ≥60%/≥40%, Lead time ≥50%) | Project-specific targets not configurable | Add KPI Threshold metadata rows to Code sheet Group 1 (e.g., `KPI Started Green` = 60, `KPI Started Yellow` = 40, `KPI LeadTime Coverage` = 50) | Dev | v1.2 |
| I-17 | DQ flag thresholds hardcoded (MR Plan <30%, PO Plan >50%, Lead time >50%) | Heuristics not adaptable per project | Add DQ Threshold metadata rows to Code sheet Group 1 | Dev | v1.2 |
| I-18 | Look-ahead window hardcoded (90 days) | Fixed 3-month window; some projects need 60/120 days | Add `LookAhead Days` metadata row to Code sheet Group 1 | Dev | v1.2 |
| I-19 | Stage order for Stage Plan Coverage hardcoded (MR, PO, VD, FAT, ROS) | Adding/removing stages requires code change | Derive from field mappings: detect all `*Plan`/`*Actual` field pairs in `CODE_SHEET_KEYS` | Dev | v1.2 |
| I-20 | `TYPE_ALIASES` hardcoded (Date/Number/Text synonyms) | New type aliases require code change | Add Type Alias lookup table to Code sheet (Code / Alias / Canonical Type) | Dev | v1.3 |
| I-21 | `LOOKUP_HEADERS` fuzzy matching hardcoded | Header naming discipline required; synonyms fixed in code | Standardize Code sheet row 1 headers to exact names; remove fuzzy matching | Dev | v1.3 |
| I-22 | Chart dimensions/colors hardcoded in SVG functions | UI tweaks require code change | Move to CSS custom properties (already partially done) or add Chart Config metadata to Code sheet | Dev | v1.3 |
| **I-23** | ~~Offline XLSX parser (`parseSheet()`) dropped cells that followed a self-closing empty cell (`<c r="M2" s="7"/>`); the old regex `<c\b([^>]*)>([\s\S]*?)</c>` treated `/>` as part of the attribute string and lazily matched to the **next** `</c>`, swallowing it. 1818 such cells in the sample workbook.~~ | ~~91/122 packages lost their Engineer (only 4 of 8 names plotted); Engineer column N worst hit; all date columns (MR/PO Plan etc.) landed in wrong columns → PO Monthly, Look-Ahead, Delays charts also wrong; Buyer column silently filled with shifted values~~ | **DONE (Rev 1.1)** — cell & row regexes now accept self-closing form `(?:\/>|>...<\/c>)`; row index read from the attribute group. Verified against openpyxl (see §7.1) | Dev | **Closed** |
| I-24 | No regression test / invariant guard for the XLSX parser — the I-23 corruption was **silent** (no validation rule fires when values shift one column left) | Column misalignment can recur unnoticed after any parser change or after the workbook is re-saved by another tool | Add (a) unit fixture with self-closing cells, (b) cell-count invariant `<c` occurrences vs parsed cells with a fail-loud error, (c) golden-file cross-check vs Python `openpyxl`. See preventive actions P-1..P-4 in §7.1 | Dev | v1.1 |
| **I-25** | ✅ **CLOSED (Rev 1.13 — §15.12).** `normPerson()` was dead code (defined, never called), but the **real defect was V-12 itself**: the engineer tally wrote the raw trimmed string into a Set **keyed by that same raw string**, so every Set held exactly one member and `s.size > 1` was **unreachable by construction**. V-12 could never fire, and `"Dilip/Siva"` / `"Dilip / Siva"` / `"Siva /Dilip"` were counted as separate people on the Engineer chart and in KPI coverage. | ~~V-12 never fires~~ → **Now fires** on spellings differing only in whitespace / slash spacing | **DONE** — `normPerson()` deleted; V-12 now keys **loosely** (slash spacing + runs of whitespace collapsed) while the Set holds the **distinct raw spellings**, so the report line shows every variant as written and the worksheet stays the place to fix them. Genuinely different names (`Kenny` vs `Kenny/Franklin`) are deliberately **not** merged. Harness gains 4 assertions (Rev 1.13) | Dev | **Closed** |
| I-26 | `svgPie()` collapses to top-8 + "Other"; Engineer now has exactly 8 names and the bar-mode Copy/Download buttons target `svg-eng`, which does not exist in bar mode | The moment a 9th variant appears (see I-25) the smallest engineers vanish into "Other"; PNG export silently broken in bar mode | Raise `topN` to 12 **or** sort the engineer slice so multi-name entries keep a guaranteed slot; wire Copy/Download to whichever element is rendered (SVG vs table) | Dev | v1.2 |
| **I-53** | ✅ **FIXED (Rev 1.9 — §15.9).** `isIssued()` matched the **raw** status while every other view canonicalises it through `statusCanon`, so a status stored as a short code (`DEL`, `RI`, `PO`) was never recognised as *issued* — such packages would wrongly be listed in **PO Issuance Delays**. The dead `statusCategory` branch left behind by I-49 was removed in the same edit. | Overdue table over-reports once statuses are entered as codes; a key removed from the contract was still referenced | Canonicalise before matching: `canon(p.status).trim().toLowerCase()`. **No effect on the current workbook** — statuses are stored as full text, where `statusCanon` is the identity function | Dev | **Closed** |
| I-54 | The detail table repeats the same rule wording once per row (e.g. 119 × V-08), so a per-row definition line would be pure noise — hence the deduplicated Rule reference. The **CSV export** still carries only `severity, rule, package, field, value, message` and does **not** include the new `desc`. | A CSV consumer cannot see the Code-sheet wording; adding a column changes the export's shape, which downstream scripts may rely on | Decide whether to append a `Rule description` column to the CSV, or leave the export contract frozen | Dev | Backlog |

---

### 7.1 Root-Cause Log & Corrective Actions — I-23 (silent XLSX cell loss)

> Logged 2026-09-16 · Severity: **High** (silent data corruption, no user-visible error) · Status: Root cause identified, fix applied & verified, preventive actions open.

#### 7.1.1 Symptom
Engineer Workload chart showed only **4** names (Ricarte, TBC, Fadhli, Wu Hongqing). `Dilip/Siva`, `Wang Yiqian`, `Kenny`, `Kenny/Franklin` never appeared; the remaining **91 packages** were silently absorbed into the grey "Unassigned (blank)" bar.

#### 7.1.2 Root cause — NOT a chart bug
The charting code is correct; it plots one bar per distinct value. The fault is in the offline xlsx parser, `parseSheet()`:

```javascript
/* BEFORE (defective) */
const cRe=/<c\b([^>]*)>([\s\S]*?)<\/c>/g;
```

Excel writes cells that carry formatting but no content as **self-closing**:

```xml
<c r="M2" s="7"/>
```

The sample workbook contains **1818** such cells. Against `<c r="M2" s="7"/>` the old regex behaves like this:

1. `([^>]*)` consumes ` r="M2" s="7"/` (everything up to the next `>`);
2. the literal `>` in the pattern then matches the `>` that **closes this cell**;
3. `([\s\S]*?)<\/c>` lazily keeps going until the next real `</c>`.

So the empty cell swallows whatever real cell follows it. Two consequences per occurrence:

- the swallowed cell **disappears entirely**;
- everything after it in that row is **shifted one column left**.

Because values are written as `obj[col]=…` keyed by the cell reference, a shifted read silently overwrites the wrong field — nothing throws, nothing warns.

Column N (Design Engineer) is preceded by several habitually-empty columns, so it was the most damaged; date columns Q–AE were hit too (all landing on non-date neighbours).

#### 7.1.3 Evidence (same input, row 2 of the sample PPP sheet)

| | Parsed result for row 2 |
|---|---|
| Old regex | `{"A2":"1", "G2":"50", "M2":"341"}` — H2, I2, N2 destroyed; N2's value pasted onto M2 |
| New regex | `{"A2":"1","G2":null,"H2":null,"I2":"50","M2":null,"N2":"341"}` |

#### 7.1.4 Correction applied (Rev 1.1, 2026-09-16) — `parseSheet()`, L299–323

```javascript
/* AFTER */
const rowRe=/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g;      // rows may also be self-closing
const rowIdxM=/\br="(\d+)"/.exec(m[1]);                         // index from the attribute group, not a positional capture
/* note (?: \/> | > ... </c> ): empty styled cells are written as <c r="N2" s="7"/> and must not swallow the next cell */
const cRe=/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
const attrs=c[1], cbody=c[2]||'';                               // self-closing → empty body → val = null
```

Three changes, three lines, no API change: the self-closing branch for **cells**, the same branch for **rows** (defence in depth), and reading the row index from the attribute group so it can no longer be thrown off by a missing body capture. The explanatory comment is intentionally kept inline so nobody "simplifies" `(?:\/>|>…)` back out.

#### 7.1.5 Verification
The parser was extracted verbatim from the HTML and executed in Node against the sample workbook; results were compared field-by-field with Python `openpyxl` (independent reference implementation). They now agree exactly.

| Measure | Before fix | After fix |
|---|---|---|
| Packages | 122 | 122 |
| Packages with an Engineer | **31 / 122** | **122 / 122** |
| Distinct engineer names | **4** | **8** (Ricarte 49, TBC 29, Fadhli 25, Dilip/Siva 7, Wu Hongqing 6, Wang Yiqian 4, Kenny 1, Kenny/Franklin 1) |
| MR Plan / PO Plan valid dates | **0 / 122** | **122 / 122** |
| Estimate Lead Time populated | 54 / 122 | 122 / 122 |
| Buyer | 122 (dates mis-shifted into it) | 0 (column is genuinely empty) |

Lint: no new diagnostics. Temporary comparison scripts were deleted; only the three parser lines changed.

#### 7.1.6 Why nothing warned us — systemic gap
Validation rule set V-01…V-20 checks *values*, never *structure*. A uniform one-column left shift still produced plausible-looking strings and numbers, so nothing fired. V-20 catches row-count divergence only. This is logged as **I-24**.

#### 7.1.7 Corrective & preventive actions

| # | Action | Type | How it prevents recurrence | Owner | Target | Status |
|---|--------|------|----------------------------|-------|--------|--------|
| P-1 | Self-closing-cell regexes with inline rationale comment in `parseSheet()` | Corrective | Removes the root cause itself | Dev | Rev 1.1 | **Done** |
| P-2 | Verified every KPI/chart against an independent parser (`openpyxl`) and recorded the before/after table in §7.1.5 | Corrective | Proves the fix rather than assuming it; gives future changes a baseline to re-run | Dev | Rev 1.1 | **Done** |
| P-3 | **Cell-count invariant**: after parsing a sheet, compare `(body.match(/<c\b/g)||[]).length` against the number of cells actually parsed; on mismatch raise a visible load error instead of rendering | Preventive | Any future regression in this parser becomes a loud failure instead of a silently wrong chart | Dev | v1.1 | Open |
| P-4 | **Parser unit fixture**: minimal `sheetData` string where every populated column is preceded by `<c r="X1" s="3"/>`; assert each value lands in its own column | Preventive | Pins the exact failure mode in a fast, dependency-free test | Dev | v1.1 | Open |
| P-5 | **Golden-file cross-check** in the release checklist: after any workbook or parser change, diff dashboard-parsed values vs `openpyxl` (see §9) | Preventive | Catches misalignment introduced by either side (including workbooks re-saved by other tools) | Dev / Data Owner | v1.1 | Open |
| P-6 | Coverage KPIs as a smoke check: Engineer coverage and date coverage must be ≈100% for this workbook; treat any unexplained drop as a parser alarm, not as real missing data | Preventive | Turns the original red herring ("people didn't fill it in") into a diagnostic signal | Data Owner | Immediate | Ongoing |
| P-7 | Cascade items **I-25** (`normPerson()` dead) and **I-26** (pie top-8 collapse + broken bar-mode PNG export) | Preventive | Removes neighbouring traps that would mis-attribute or re-hide engineer counts | Dev | v1.1 / v1.2 | Open |

---

## 8. Developer Guide — Common Tasks

### 8.1 Adding a New Chart

1. Add card HTML in `index.html` (or dashboard section) with `chartwrap` + unique `id`
2. Add entry to `CAT_META` (L693) if categorical (bar/pie toggle)
3. Create `xxxItems(pkgs)` provider returning `[{label, value, color?}]`
4. Add case in `renderCat(key)` (L855) or new `renderXxx()` for non-categorical
5. Call `safeCall(()=>renderXxx(), 'elementId')` in `buildDashboard`
6. Add copy/download buttons with `data-svg="svg-xxx"`

> ⚠ **Maintainability note — see §13 / I-27.** Steps 1, 2, 4 and 5 are four separate places encoding the *same* fact ("this chart exists"). Missing any one of them fails silently. After the `METRICS` registry (§13.7 P0) lands, this whole checklist collapses to **one entry**.

### 8.2 Adding a Validation Rule

1. In `validate()`, add `add(sev, 'V-XX', pkgId, field, value, msg)`
2. Use `ctx` params: `lookups`, `asOf`, `headerRow`, `lastRow`, `dateFields`, `metaTypes`, `lookupMeta`
3. Increment severity counts, issues auto-sorted by severity then code
4. Test: introduce bad data in Excel, reload, check Validation panel

### 8.3 Modifying Lookup Lists

- Edit Code sheet columns E–O directly in Excel
- Dashboard reads row 1 headers dynamically — no code change needed
- Ensure header names match `LOOKUP_HEADERS` keys (L357): `discipline description`, `criticality code`, `status`, `item category`, etc.

### 8.4 Changing Date Parsing

- `toDate(v)` (L448) handles: `Date` objects, Excel serial numbers (with 1900 leap-year bug adjustment), ISO strings
- To support new format: extend `toDate()` and ensure Code sheet column C = "Date"

### 8.5 Debugging Parse Failures

1. Open DevTools Console
2. Check for errors from `parseXlsx` (ZIP/EOCD not found, unsupported compression)
3. Verify sheet names: PPP sheet must match `/ppp/i`, Code sheet `/code/i`
4. Check `fieldToCol` mapping — missing "Package Title" throws hard error
5. **Check for silently shifted columns first** — see I-23 / §7.1. Symptom pattern: a coverage KPI (Engineer, dates) drops to a suspiciously low value, or a column shows values that belong to another field. Do **not** assume the workbook is unfinished; verify the parser.

### 8.6 XLSX Parser Invariants — do not break these

`parseSheet()` (L299–323) is hand-rolled regex over OOXML. The following are hard requirements; violating any of them re-opens I-23 (silent column shift):

1. **Self-closing elements must have their own branch.** Any regex over sheet XML needs `(?:\/>|>content<\/tag>)` for **both** `<row>` and `<c>`. Excel emits formatting-only cells as `<c r="M2" s="7"/>` — 1818 of them in the sample workbook. The `[\s\S]*?` body must never be allowed to run past an element boundary.
2. **Read coordinates from the attribute group.** Parse `r="…"` from the captured attributes; never rely on a positional capture group (a self-closing match has no body group, shifting indices).
3. **Empty body must mean empty value.** Use `cbody = c[2] || ''` so a self-closing cell yields `null`, not its neighbour's value.
4. **Fail loud on count mismatch.** Number of parsed cells must equal occurrences of `<c` in `sheetData` ( preventive action P-3 ).
5. **Never cross-check a parse with another regex proof.** The only trustworthy oracle is an independent parser (Python `openpyxl`) — see P-5.

---

## 9. Testing Checklist

| Area | Test Cases |
|------|------------|
| **File Load** | .xlsx with 3 sheets, .xlsx missing Code sheet, .csv export, corrupted .xlsx, empty file |
| **XLSX Structure (I-23 regression)** | Workbook containing **self-closing formatting-only cells** (`<c r="M2" s="7"/>`) immediately before populated cells in every column — each value must land in its own column; workbook containing self-closing `<row .../>`; cell count in `sheetData` must equal cells parsed (P-3); **golden-file cross-check vs Python `openpyxl`** (P-5); workbook re-saved by another tool (Google Sheets / LibreOffice / Smartsheet export) — alignment must be preserved |
| **Code Sheet** | All Data Types filled, column C empty (fallback), Header Row/List End Row non-numeric, AsOf Date invalid |
| **PPP Data** | Rows before Header Row, rows after List End Row, blank Package Title, duplicate Package No. |
| **Dates** | Real Excel dates, serial numbers (40000+), placeholder numbers (60, 90, 120), text dates, empty |
| **Lookups** | All 4 lookup blocks present, one missing, extra columns in lookup, case variations |
| **Status** | Codes only, descriptions only, mixed, unknown status, blank |
| **Criticality** | All 0–4, some blank, all blank, values not in Code sheet |
| **Engineers** | Normalized variants, "Name / Name", "Name/Name", blank, TBC, **all 8 sample names visible** (Ricarte, TBC, Fadhli, Dilip/Siva, Wu Hongqing, Wang Yiqian, Kenny, Kenny/Franklin — I-23), multi-name entries not swallowed by pie top-8 (I-26) |
| **Charts** | Bar↔Pie toggle persists, copy PNG, download PNG, empty data states |
| **Validation** | Each V-XX triggers correctly, chips count matches, export CSV valid |
| **Responsive** | <880px (KPIs 3-col, grid 1-col), >880px (6-col, 2-col) |
| **Browser** | Chrome 120+, Edge 120+, Safari 17+, Firefox 120+ (DecompressionStream required) |

---

## 10. Future Enhancements (Backlog)

| Priority | Feature | Description |
|----------|---------|-------------|
| High | Package Type filter | Split Equipment vs Service packages; filter all charts |
| High | Cumulative PO S-curve | Add line series to PO Monthly: cumulative Plan vs Actual |
| Medium | Multi-file session | Load multiple project files, switch via dropdown |
| Medium | Drill-down table | Click chart bar → filter package table below |
| Medium | Custom date range | Override AsOf for scenario analysis |
| Low | Dark mode | Toggle theme (CSS variables already support) |
| Low | PDF report | Generate one-page PDF summary (jsPDF) |
| Low | i18n | Externalize strings for EN/ZH toggle |

---

## 11. File Reference

```
PPP/
├── Procurement-Dashboard.html   # Single-file app (1199 lines @ Rev 1.1)
├── TWRP C3B2 - Procurement Package Plan.xlsx   # Sample data workbook
├── PPP-Dashboard-Workplan.md    # This document — the ONLY active workplan
├── codecheck.md                 # Code-review notes
├── arch/                        # Archived: static snapshot + early scripts (do not edit)
│   └── WORKPLAN.md              # Legacy Chinese workplan (Rev v2, 2026-09-15) — history only
└── test/                        # Python scratch scripts used for parser cross-checks (see §7.1.5)
```

> ⚠ **Two workplans exist.** Edit **this** file only. `arch/WORKPLAN.md` is frozen history and does **not** contain §13.

### Key Code Sections (line numbers)

| Section | Lines |
|---------|-------|
| CSS / Styles | 7–104 |
| Welcome Screen HTML | 111–125 |
| Dashboard HTML | 128–251 |
| XLSX Parser | 282–357 |
| Code Sheet Contract & Parsing | 333–445 |
| Utils (date, fmt, norm) | 447–462 |
| `buildDashboard()` | 467–563 |
| `validate()` + `renderValidation()` | 566–689 |
| Chart Helpers (SVG) | 691–802 |
| Categorical Providers | 804–872 |
| `renderCat()` | 855–888 |
| Stage / PO Monthly / Look-Ahead / Delays | 889–949 |
| Benchmark / DQ Flags | 950–964 |
| PNG Export | 966–994 |
| Event Handlers (UI) | 988–1001 |
| File Load Flow | 1003–1024 |

---

## 12. Quick Start for New Developers

```bash
# 1. Open dashboard directly in browser (no server needed)
start PPP\Procurement-Dashboard.html

# 2. Drop "TWRP C3B2 - Procurement Package Plan.xlsx" onto drop zone
# 3. Explore: Validation panel, KPIs, charts, tables
# 4. Edit Excel → Save → Click "Load another file" → Reload

# 5. To modify: edit Procurement-Dashboard.html, refresh browser
#    - No build step, no dependencies
#    - DevTools Console shows parse/validation logs
```

---

---

## 13. UI Architecture Review — 5-Layer Target Model

> Logged 2026-09-16 · Type: **architecture / maintainability review (UI design perspective)** · Status: **Draft — pending approval.** **No code has been changed in this revision.**

### 13.1 Why this section exists

`Procurement-Dashboard.html` is 1,199 lines in one file and it works. The risk is not correctness — it is **coupling**. One conceptual change today requires edits in 3–6 unrelated places, and two of them fail *silently* when missed:

- **Add a chart** → touch HTML skeleton (L178–240), `CAT_META` (L814), `renderCat()` if/else chain (L1010), `rerender()` key array (L556). Miss one → the card silently never renders or never re-filters.
- **Change a colour** → `:root` has only 11 tokens; at least 20 hex literals bypass it, several inside SVG strings.

This section defines the target structure so each future change lands in **one** place.

### 13.2 As-built structure (measured, Rev 1.1)

| Region | Lines | Notes |
|---|---|---|
| CSS | 7–123 | 11 tokens in `:root` (8–14); ad-hoc blocks after; a single `@media` at 122 |
| HTML shell | 125–280 | Welcome + dashboard; 6 chart cards repeat the same ~10-line skeleton (178–240) |
| JS | 281–1197 | One global scope, sections marked by banner comments, ~40 globals |

### 13.3 Target — the 5-layer model ("5 layer structure")

**Five layers, bottom-up: 01 Tokens · 02 Primitives · 03 Data · 04 Logic · 05 View.**
**Dependency rule: a layer may only call the layer below it. Never upward, never sideways into a sibling's internals.**

```
┌──────────────────────────────────────────────────────────────┐
│ 05 VIEW        registry-driven render; DOM is WRITE-ONLY      │
│                render(state) — never read state back from DOM │
├──────────────────────────────────────────────────────────────┤
│ 04 LOGIC       validation rule table + aggregation            │
│                pure: (model, ctx) -> result                   │
├──────────────────────────────────────────────────────────────┤
│ 03 DATA        xlsx/csv parse, Code-sheet contract,           │
│                field typing, lookups, status canonicalisation │
├──────────────────────────────────────────────────────────────┤
│ 02 PRIMITIVES  .ds-card  .ds-btn  .ds-table  .ds-badge        │
│                .ds-chip  .ds-seg  .ds-empty                   │
├──────────────────────────────────────────────────────────────┤
│ 01 TOKENS      colour / type / space / radius / shadow        │
│                + CHART geometry + CHART_PALETTE               │
└──────────────────────────────────────────────────────────────┘
```

| # | Layer | Owns | Must NOT contain | Lives today at |
|---|-------|------|------------------|----------------|
| 01 | **Tokens** | Every colour, size, radius, shadow, chart geometry, chart palette | Any literal hex outside this block | `:root` 8–14 (partial) + ~20 hex literals elsewhere |
| 02 | **Primitives** | Card, button, table, badge, chip, segmented control, empty state | Feature-specific rules | Scattered 21–123 |
| 03 | **Data** | `parseXlsx`/`parseCSV`, Code contract, `fieldToCol`, lookups, `statusCanon` | Any `document.*`, any display string | 282–476, 564–637 |
| 04 | **Logic** | Validation rule set, `tally*` / `tallyBy` / `leadStats`, bucket logic | Any `document.*`, any markup building | 566–780, 825–1004 |
| 05 | **View** | `METRICS` registry, renderers, event wiring (handlers mutate state only) | Business rules, parsing | 125–280, 553–562, 1005–1196 |

### 13.4 Conventions (proposed)

| Area | Convention |
|---|---|
| **Tokens** | `--<category>-<role>[-<variant>]`: `--warn-bg` / `--warn-border` / `--warn-fg`, `--bad-*`, `--chart-1`…`--chart-8` |
| **CSS classes** | `.ds-*` = design-system primitive · `.c-<name>` = component · `is-` / `has-` = state. Retire `.s-good/.s-warn/.s-bad`, `.text-bad`, `.warn-text`, `.note-lead` in favour of one semantic set |
| **Chart geometry** | One `CHART = { w, padL, padR, labelW, rowH, barH, donut:{R,r,cx}, legendX }`; no bare numbers inside SVG builders |
| **State** | One `STATE = { model, report, filter:{cats}, prefs:{chartType} }`; renderers are `render(STATE)`; handlers mutate `STATE` then call `render()` — **never** read checkbox/class state back out of the DOM |

### 13.5 Accessibility baseline (target)

| Item | Gap |
|---|---|
| Charts | No `role="img"` + `<title>`/`<desc>` — screen readers receive nothing from any chart |
| Tables | `th` missing `scope="col"` |
| Filter panel | `#tfBtn` declares `aria-haspopup="listbox"` (L152) but `#tfPanel` (L157) has **no role** and is filled with `<input type="checkbox">` — the widget promises a listbox and delivers checkboxes. Use `<fieldset><legend>` **or** drop the popup hint. *(Corrected 2026-09-16: the panel does not itself declare `role="listbox"` — the mismatch is on the button)* |
| Focus | A single global `:focus-visible` rule is needed; today only `details.vd summary` (L104) has one |
| Motion | No `@media (prefers-reduced-motion: reduce)` — transitions exist at `.15s/.2s/.25s` throughout |
| Print / dark | No print stylesheet; no `[data-theme="dark"]` token block (cheap to add now that tokens are centralised) |

### 13.6 Issues logged by this review — I-27 … I-40

| ID | Layer | Issue | Where | Sev | Recommendation |
|----|-------|-------|-------|-----|----------------|
| **I-27** | 05 | "One chart" is encoded in **4 places** (HTML skeleton, `CAT_META`, `renderCat` branch, `rerender` array). Missing one fails silently | 178–240, 814, 1010, 556 | **High** | Single `METRICS` registry: markup, toggle, render and re-render all derived from it | **DONE (Wave 1, 2026-09-16)** — `METRICS` + `METRICS_BY_KEY` added; `CAT_META` and the `['status',…].forEach` render-loop both removed; `render()` / `renderCat()` now derive entirely from the registry. To add a chart: one `METRICS` entry (+ the existing HTML card). |
| **I-28** | 05 | `renderCat()` is a switchboard on `key`; `engineer` has an **early-return branch** (1013–1017) that bypasses the shared path, which is why it can never render as a pie | 1005–1044 | Med | Move per-metric behaviour into the registry as capability declarations (`charts:['bar','pie']`) instead of branches | **DONE (Wave 3, 2026-09-16)** — every `METRICS` entry declares `charts:['bar','pie']`; the lead-time card's conditional note is now a `note(pkgs,mode)` capability on the entry, and `renderCat()` has **no `key===…` branches left**. The `engineer` early-return was removed back in Wave 0. |
| **I-29** | 05 | **Two bar renderers coexist**: `htmlHBar()` (HTML/CSS) and `svgHBar()` (SVG). Different label truncation, different visuals; only the SVG one can be exported to PNG | 849, 865 | Med | Keep one. Recommend SVG (export parity) and delete `htmlHBar()`; or keep HTML and make PNG export target the rendered element | **DONE (Wave 3, 2026-09-16)** — `htmlHBar()` deleted; `svgHBar()` is the single bar renderer (PNG-exportable). Removing it also eliminated the last block of inline-styled markup (see I-36). |
| **I-30** | 04/05 | State is split across `DB`, `LAST_REPORT`, `SELECTED_CATS` **plus `localStorage` plus DOM read-back** (536–537 read checkbox state; 1015 toggles classes) — the DOM is a state source for part of the app | 496–497, 536–537, 1015 | **High** | Single `STATE` object + `render(STATE)`; DOM becomes write-only | **DONE (Wave 1, 2026-09-16)** — `STATE = {model, report, filter, prefs}` is the sole source of truth; `DB` / `LAST_REPORT` / `SELECTED_CATS` removed; `render()` is the single re-render entry; filter & seg handlers mutate `STATE` then call `render()`. Chart-type prefs are backed by `STATE.prefs.chartType` (still persisted to `localStorage`). |
| **I-31** | 03/05 | `buildDashboard()` performs 6 jobs (locate sheets → parse contract → build map → parse rows → build lookups → canonicalise → assign → switch screens → validate → render), ~100 lines | 564–660 | Med | Split into `parseWorkbook() → buildModel() → validate() → render()`; makes 03/04 unit-testable | **DONE (Wave 2, 2026-09-16)** — `buildDashboard()` is now a thin orchestrator; `parseWorkbook()` (sheet location) and `buildModel()` (contract → map → lookups → packages → `vctx`) do the heavy lifting. 03/04 are now independently callable. |
| **I-32** | 04 | Validation rules are fused with the row traversal; `add('error','V-02',…)` literals scattered over ~180 lines | 600–780 | Med | Rule table `{ id, sev, when(p, ctx), msg(p) }`; panel, counters and CSV export then all derive automatically | **DONE (Wave 2, 2026-09-16)** — per-package rules (V-05/06/07/08/09/10/17 + V-02/03/04) moved into one `RULES` array; each rule is `{code, sev, run(p,id,ctx,add)}`. Adding a rule = one entry; the traversal and the panel/counter/CSV export still derive from `add()`. I-46 folded in here (see below). |
| **I-33** | all | ~40 globals in one scope; `CAT_META` / `cats` / `cat` already nearly collide | 830 vs 814 | Low | Wrap in an IIFE or switch to `<script type="module">` | **DONE (Wave 3, 2026-09-16)** — the whole `<script>` body is wrapped in `(function(){ … })();`, so none of the ~40 identifiers leak onto `window`. Safe because every listener is wired with `addEventListener` (no inline `on*=` handlers). |
| **I-34** | 01 | Tokens incomplete — **≥20 hardcoded hex bypass `:root`**: `#FFF6E5` `#FFE2A8` `#7A5A00` `#8A5A00` `#C7C7CC` `#004999` `#1A7F3C` `#CFE3FA`, plus `#1D1D1F`/`#6E6E73` written literally inside SVG strings | 87–100, 813, 1049, 1092 | Med | Promote to semantic tokens; SVG should use `fill="currentColor"` or CSS vars | **DONE (Wave 2, 2026-09-16)** — CSS hex (validation panel, flags, vchips, sev, errBanner, wicon gradient) promoted to semantic tokens in `:root`. SVG colour literals centralised in the `CHART` object (`ink`/`muted`/`grey`/`accent`/`accentDark`/`goodDark`/`axis`/`grid`/`white`) — kept as literal hex on purpose because the chart is serialised to PNG where CSS vars do not resolve. |
| **I-35** | 01 | Chart geometry is all magic numbers: `W=760` `RW=46` `RH=30` `BH=18` `R=100` `r=58` `cx=130` `legendX=290` `padL=34` | 865, 899, 929 | Low | Extract `CHART` geometry object tied to type/radius tokens | **DONE (Wave 2, 2026-09-16)** — all bar/pie/grouped geometry now reads from the `CHART` object (`W, RW, padT, RH, BH`, `pie.*`, `group.*`). One place to change a chart dimension. |
| **I-36** | 02 | Renderers emit inline `style="…"` (HTML bars, KPI cards, look-ahead and delay tables) — invisible to the token system and unthemeable | 851–862, 1071, 1102, 1109 | Low | Replace with `.ds-*` classes | **DONE (Wave 3, 2026-09-16)** — the only remaining inline-styled block was the HTML bar renderer, deleted with I-29. KPI cards, look-ahead and delay tables already used classes. No inline `style="…"` remains in HTML markup (SVG still uses presentation `style` attributes, which is correct). |
| **I-37** | 02 | Mixed naming paradigms: BEM (`.card .sub`), utility (`.hidden`, `.num`), state (`.on`, `.open`, `.hover`), vaguely semantic (`.s-good` vs `.text-bad` vs `.warn-text`) | 62, 113–117 | Low | Adopt one convention (§13.4) | **DONE (Wave 3, 2026-09-16)** — convention adopted and documented in CSS: `.ds-*` = primitive, `.s-*` = status state, `.note` = caption. Renamed `.text-bad`→`.ds-bad`, `.warn-text`→`.ds-warn`; retired `.note-lead` (now plain `.note`). |
| **I-38** | 02 | Bare element selector `table{…}` (83) hits benchmark and validation tables, patched back by `.vtableWrap table{margin:0}` (106); `.card{margin-bottom}` (65) undone by `.grid .card{margin-bottom:0}` (66) | 65–66, 83, 106 | Low | Scope to `.ds-table`; let grid `gap` own spacing | **DONE (Wave 3, 2026-09-16)** — table styles scoped to `.ds-table` (`th`/`td`/`.num`/`tr.over` all scoped); `class="ds-table"` added to the benchmark, validation, look-ahead and delay tables. Grid `gap` continues to own card spacing. |
| **I-39** | 01 | No `prefers-reduced-motion`, no print stylesheet, no dark-theme token block | 122 | Low | ~10 lines each; tokens are already centralised enough to make this cheap | **DONE (Wave 3, 2026-09-16)** — added `@media (prefers-reduced-motion: reduce)` (kills transitions/animations), a print stylesheet (static header, hides controls, avoids card page-breaks), and a full `[data-theme="dark"]` token block (chrome flips; chart area pinned light because charts serialise to PNG with literal colours). |
| **I-40** | 02 | Accessibility gaps listed in §13.5: charts lack `role="img"`/`<title>`; `th` lacks `scope`; `aria-haspopup="listbox"` on `#tfBtn` promises a listbox but `#tfPanel` holds checkboxes (wording corrected 2026-09-16 — the panel itself has no role); `:focus-visible` only on `summary` | 104, 152, 267 | Med | Apply the §13.5 baseline | **DONE (Wave 3, 2026-09-16)** — chart SVGs now carry `role="img"` + a descriptive `aria-label` (bar/pie/grouped); `scope="col"` added to every generated `<th>`; the misleading `aria-haspopup="listbox"` removed from `#tfBtn` and `#tfPanel` given `role="group"` + `aria-label`; a global `:focus-visible` rule added. |
| **I-41** | docs | **This document's own line references are stale.** §3.2 and §11 still quote Rev 1.0 positions (e.g. `buildDashboard()` shown as L467; it is now L564). §13 uses current measured positions, so the two disagree | §3.2, §11 | Low | Replace fixed line numbers with section/function names, or regenerate the tables from the current file each release |
| **I-42 … I-48** | 01/02/03/05 | **Cross-audit of `codecheck.md`** — verified 2026-09-16. Full detail and evidence in **§14** | see §14.2 | High … Low | see §14.4 |

### 13.7 Roadmap

| Phase | Items (sequence) | Outcome |
|---|---|---|
| **P0-B** | **I-43+I-42 → I-44 → I-45 → I-48** (authoritative order in **§14.5**). **I-46, I-47** are batched into the P1 (I-32) and P2 (I-36–I-38) passes respectively | Correctness / compatibility bugs. Small and isolated — do **before or alongside P0**, not part of the refactor. **I-43 is fixed *by* the I-42 parser rewrite** (one edit, the lookbehind disappears with it); **I-44** is a minimal fix whose root cause (I-29) is resolved in P2 |
| **P0** | I-27, I-30 | **DONE (Wave 1, 2026-09-16 — see §14.7).** Adding a chart: 4 places → 1 (`METRICS` registry). State: single `STATE` + `render()`. Highest coupling relief per unit of effort |
| **P1** | I-31, I-32, I-34, I-35 (+ absorbs I-46, I-22) | Data and logic layers become unit-testable; one place to change a colour, a rule, or a chart dimension | **DONE (Wave 2, 2026-09-16 — see §14.8).** I-22 (chart dims/colours → tokens) absorbed by I-34/I-35. I-11 (read the Error Code/Description table from the Code sheet) is a *behaviour-changing feature*, not a pure refactor — deferred to a feature wave (see §14.8 note). |
| **P2** | I-28, I-29, I-33, I-36 … I-40 (+ absorbs I-47) | Naming clean-up, one bar renderer, accessibility baseline, motion/print/dark | **DONE (Wave 3, 2026-09-16 — see §14.9).** I-47 (filter-panel max-width + ellipsis labels) absorbed. **All five windows (P0-B, P0, P1, P2 + Wave 0) are now complete.** |

### 13.8 Non-goals — explicitly out of scope

- **Do not split into multiple files.** `file://` double-click, offline, zero-dependency is the product's core value. Splitting forces a build step. Keep single-file; control growth with a table of contents + strict section order instead.
- **Do not add Chart.js / SheetJS.** The hand-rolled inline SVG charts and the native `DecompressionStream` parser are assets, not debt.
- **Do not rewrite responsive behaviour.** The single 880px breakpoint (KPIs 6→3, grid 2→1) is adequate.
- **Do not restyle.** This is a structural refactor; the visual language stays as-is.

### 13.9 Where the existing backlog lands in the new model

The 5-layer model gives several existing items a natural home — they are the same class of problem (hardcoded knowledge that belongs in a lower layer):

| Existing | Layer | Note |
|---|---|---|
| I-12 `LEGACY_DATE_FIELDS` | 03 Data | Disappears once Code!C Data Types are populated |
| I-13 `isIssued()` keywords | 03 Data | Already migrated to the Status Category lookup |
| I-14 lead-time buckets | 03 Data | Config belongs in the Code sheet, not in tokens |
| I-19 stage order | 03 Data | Derive from the field map instead of hardcoding |
| I-20 `TYPE_ALIASES` | 03 Data | |
| I-21 `LOOKUP_HEADERS` fuzzy match | 03 Data | |
| I-22 chart dimensions/colours | **01 Tokens** | Exactly the gap described by I-34 / I-35 |
| I-11 error code/description table | 03 Data | Extend `LOOKUP_HEADERS` + `findLookupColumns()` |

---

## 14. Cross-audit of `codecheck.md` (verified against the code)

> Logged **2026-09-16** · Status: **Draft — pending approval** · **No code changed.**
> Method: every item in `codecheck.md` was re-read against `Procurement-Dashboard.html` (Rev 1.1, 1,199 lines) and either **reproduced** or **refuted with evidence**. Refuted items are kept in §14.3 so they are not re-raised in a future review.

### 14.1 Verdict summary

| # | `codecheck.md` claim | Verdict | Sev | ID |
|---|---|---|---|---|
| 1 | CSV split regex breaks on quoted fields / escaped quotes / newlines | **Confirmed** — and worse than reported (see I-43) | High | **I-42 / I-43** |
| 2 | `critItems()` strict compare fails on number-vs-string criticality | **Not reproducible** — already normalised at L984 | — | rejected |
| 3 | `chartToPng()` reads `width.baseVal.value` → 0 in Safari | **Not reproducible** — fallback chain already present at L1133 | — | rejected |
| 4 | Fixed row-index arithmetic breaks when Excel rows are empty | **Mechanism rejected** — grid is row-aligned by design. *But a different, real defect found* | Low | **I-45** |
| 5 | Duplicate Package No. not trimmed → false negatives | **Confirmed** | Low | **I-46** |
| 6 | `.tf-panel` truncates long category names | **Partially confirmed** — wrong mechanism (text wraps, it does not clip); no `max-width`, no ellipsis, no tooltip | Low | **I-47** |
| 7 | Drop zone not keyboard operable, `role="presentation"` | **Confirmed** — mitigated by the adjacent `#openBtn` | Med | **I-48** |
| — | *Not in `codecheck.md`* — Engineer card's Copy/Download buttons are silently dead in Bar mode | **New, found during verification** | **High** | **I-44** |

**Net: 5 of 7 claims stand (one only partly), 2 are refuted, and 1 additional real bug was found.**

### 14.2 Confirmed issues — I-42 … I-48

| ID | Layer | Issue | Evidence | Sev | Fix |
|----|-------|-------|----------|-----|-----|
| **I-42** | 03 Data | **CSV parser corrupts quoted fields.** `line.split(/(?<!"),(?=")\|,(?=\d\|\w)/)` (L360). The second alternative `,(?=\d\|\w)` matches *inside* a quoted field: `"Pump, std"` splits into `"Pump` + `std"`. Escaped `""` is never unescaped, and quoted fields containing newlines are broken by the `split(/\r?\n/)` on L359 that runs *before* quoting is considered | L358–362 | **High** (silent data corruption) | Replace with a ~25-line RFC 4180 state-machine parser (char loop, in-quote flag, `""` → `"`, newline honoured inside quotes) |
| **I-43** | 03 Data | **The lookbehind `(?<!")` is a script-killer on older Safari/iOS.** Regex literals are compiled when the `<script>` is parsed; lookbehind shipped in Safari **16.4** (Mar 2023). On iOS/macOS Safari < 16.4 the whole script throws `SyntaxError` at parse time → no handlers are wired, the page looks loaded but every control is dead — **including for `.xlsx` users who never touch the CSV path** | L360 | **High** (whole page dead) | Rewrite the split without lookbehind; `parseCSV()` never needs it once I-42 lands. Highest value-per-line fix in this list |
| **I-44** | 05 View | **Engineer card: "Copy image" / "Download" silently do nothing.** In Bar mode `renderCat()` renders `htmlHBar()` (L1014), which emits an HTML `<table>` with **no SVG element**, so `document.getElementById('svg-eng')` is `null`: `copyChart()` returns early (L1143) and the download branch is guarded by `if(el)` (L1166). No toast, no error — the button just appears broken. Bar is the **default** mode, so this is the first thing a user tries. Same silent failure whenever `svgPie()` returns its `No data to chart.` `<div>` (L903) | L1013–1017, 1142–1147, 1164–1166, 903 | **High** (user-visible, silent) | Direct consequence of I-28/I-29. Either render engineer bars as SVG too (preferred — one renderer), or make export target the chart container. Add a `toast('Nothing to export')` fallback in both handlers regardless |
| **I-45** | 03 Data | **Silent fallback defeats V-15.** `headerRow = (Number(codeMeta['Header Row']) \|\| 1) - 1` (L601) and `lastRow = (Number(codeMeta['List End Row']) \|\| ppp.length) - 1` (L602). A typo or non-numeric value in `Code!B7/B8` silently becomes 1 / sheet-end, and V-15 (L680–681) checks `isNaN(headerRow)` on the *computed* value — which is always a number, so **it can never fire**. The dashboard then reads the wrong row range with a clean bill of health | L601–602, 680–681 | Low–Med (silent wrong data) | Parse with `Number.isFinite()`; if the value is missing or invalid, raise V-15 and *show which fallback was used* in the validation panel |
| **I-46** | 04 Logic | **Duplicate Package No. is not normalised.** `noCount[p.packageNo]` (L697) keys on the raw string, so `" PKG-01 "` and `"PKG-01"` are counted as two different packages and V-11 never fires. Every *other* check in `validate()` goes through `norm()` (L674), so this one is inconsistent with its neighbours. Falsy guard also skips `packageNo === 0` | L692, 697, 741 | Low | Use `norm(p.packageNo)` as the key; keep the original for display |
| **I-47** | 02 Primitives | **Filter panel sizing.** `.tf-panel` (L49) has `min-width:220px` (fixed, not `fit-content`), `max-height:320px`, but **no `max-width`** — a long Item Category makes the panel grow toward the viewport edge on narrow screens. Labels wrap rather than clip, so nothing is "cut off" as reported, but there is no `text-overflow` / `title` tooltip either. Related: `#tfBtn` promises `aria-haspopup="listbox"` (L152) over a checkbox panel (see §13.5 / I-40) | L49–53, 152, 157 | Low | Add `max-width:min(320px, 90vw)`, `text-overflow:ellipsis` + `title` on labels; fix the popup-role mismatch with I-40 |
| **I-48** | 05 View | **Drop zone is not keyboard operable.** `#drop` (L136) has `onclick` + drag handlers but `role="presentation"` — a role that tells assistive tech to *ignore* the element — and no `tabindex` / `keydown`. Impact is **mitigated**: `#openBtn` (L140) is a real focusable button immediately below, so keyboard/AT users can still load a file; they just cannot use the zone itself | L136, 1192–1196 | Med (mitigated) | Either give `#drop` `role="button" tabindex="0"` + Enter/Space handling, **or** (simpler, recommended) keep it non-interactive to AT and rely on `#openBtn`, removing the misleading `role="presentation"` — do not leave a clickable element dressed as decoration |

### 14.3 Refuted — do not re-raise

| # | Claim | Why it does not hold |
|---|---|---|
| 2 | `critItems()` type mismatch (number vs string) | L984 already reads `String(p.criticality==null?'':p.criticality).trim() === k`, and `k` comes from `codes.map(s=>String(s).trim())` (L977) or the string fallback `['0'…'4']` (L979). **Both sides are always strings and always trimmed** — numeric `0` and text `"0"` group together correctly today. No change needed |
| 3 | `chartToPng()` returns 0×0 in Safari | L1133 already reads `svgEl.width.baseVal.value \|\| svgEl.viewBox.baseVal.width \|\| 760` (and the same for height), and every chart builder emits explicit `width="760" height="…"` attributes (L873, 908, 932), so `baseVal` is populated. The suggested `getBoundingClientRect()` fix is **not** an improvement — it would export at the *current on-screen* width instead of a stable 760px, making PNG size depend on window size |
| 4 | Empty Excel rows shift row indices | `parseSheet()` writes `grid[rt.row-1]` using the cell's `r=` attribute (L322) and back-fills skipped rows (L323), i.e. **the grid is deliberately aligned to Excel row numbers**, so empty rows cannot shift anything. The *separate* fallback defect is real and is logged as **I-45** |

### 14.4 Where these land in the 5-layer model

| ID | Layer | Comment |
|---|---|---|
| I-42, I-43 | **03 Data** | Belongs to the Code/CSV ingest layer; fixing I-42 removes the need for I-43 automatically |
| I-45, I-46 | **03/04** | I-45 is a data-contract parse; I-46 is a missing `norm()` in the rule layer — would disappear with the rule table of I-32 |
| I-44 | **05 View** | Direct symptom of the dual-renderer problem (I-29). Fixing I-29 fixes I-44 |
| I-47, I-48 | **02/05** | Primitive sizing + interaction semantics; fold into the `.ds-*` primitive pass |

### 14.5 Suggested order

1. **I-43 → I-42** (one edit: rewrite `parseCSV()` with a state machine, no lookbehind). ~30 min, removes a page-killing class of failure.
2. **I-44** (render engineer bars via `svgHBar()`, add export fallback toast). Removes a dead button on first load.
3. **I-48** (drop-zone role/keyboard) and **I-45** (strict number parse + visible fallback) — small, independent.
4. **I-46, I-47** — batch with the I-32 rule-table and I-36/I-37 primitive passes.

### 14.6 Wave 0 implemented — 2026-09-16

All five P0-B fixes are applied to `Procurement-Dashboard.html`; no other code changed.

| ID | Fix | Where |
|---|---|---|
| **I-43 + I-42** | `parseCSV()` rewritten as an RFC 4180 state machine — no lookbehind, so the Safari <16.4 script-killer is gone and quoted fields / embedded commas / newlines parse correctly | `parseCSV()` |
| **I-44** | Engineer card now renders through `svgHBar()`/`svgPie()` (the shared path), so a real `#svg-eng` exists; `copyChart()` and the `.dlBtn` handler now `toast('Nothing to export')` instead of silently doing nothing | `renderCat()` engineer branch removed; `copyChart()`; dashboard click handler |
| **I-45** | `headerRow`/`lastRow` parsed with `Number.isFinite`; invalid/missing falls back to default (0 / last row) **and** raises V-15 naming the value used — the old `|| 1`/`|| ppp.length` silent fallback is removed | `buildDashboard()`; `validate()` V-15 checks |
| **I-48** | Removed `role="presentation"` from `#drop` (keyboard users still reach `#openBtn`) | welcome markup |

Notes:
- `htmlHBar()` is now unused (only Engineer used it). Left in place until **I-29 (P2)** deletes it — no functional impact.
- Verification was by source re-read. The sandbox shell (Bash/PowerShell) was unavailable, so the automated `vm.Script` syntax pass could **not** be run. **Recommend a hard-refresh load test** (Ctrl+Shift+R) with both an `.xlsx` and a CSV export to confirm.

### 14.7 Wave 1 implemented — 2026-09-16

P0 items **I-27** (single `METRICS` registry) and **I-30** (single `STATE` + `render(STATE)`) applied to `Procurement-Dashboard.html`. Structural only — the rendered dashboard is byte-for-byte equivalent to Rev 1.2 for the same input.

| ID | Change | Where |
|---|---|---|
| **I-27** | Added `METRICS` (array) + `METRICS_BY_KEY` (lookup). Every categorical chart is now one entry: `{key, title, sub, svg, el, provider, decorate?}`. `render()` iterates `METRICS`; `renderCat(key)` looks the provider up from `METRICS_BY_KEY` — no `if/else` chain. `CAT_META` deleted; the old hardcoded `['status','discipline','engineer','criticality','leadtime'].forEach(...CAT_META[k].el)` render-loop deleted. Criticality/lead-time card-specific UI moved into a `decorate(pkgs,mode)` capability on the entry (not a branch). | charts section; `render()`, `renderCat()` |
| **I-30** | Added `STATE = { model, report, filter:{cats}, prefs:{chartType} }` as the sole state holder. `DB` / `LAST_REPORT` / `SELECTED_CATS` removed (all `DB.`→`STATE.model.`, etc.). `render()` is the single re-render entry; filter checkboxes and the bar/pie seg control mutate `STATE` then call `render()` (or `renderCat(key)` for a targeted re-render). Chart-type prefs persist to `localStorage` via `getPref`/`setPref`, now backed by `STATE.prefs.chartType`. | build section; `buildDashboard()`; filter/seg handlers; `vExport` |

Net effect:
- **Add a chart = 1 registry entry** (was 4 places: HTML card + `CAT_META` + `renderCat` branch + render-loop array). The HTML card is the only remaining hand-written piece; the *behaviour* is fully derived.
- **State has one source**; the DOM is write-only. No `STATE` value is read back out of the DOM.
- Behavioural risk reduced: a missing/renamed metric now surfaces as an obvious empty card, not a silently wrong chart.

Notes:
- Still no automated syntax pass (sandbox shell unavailable). Verified by targeted re-read of every function that touched the old globals; all `DB.` / `LAST_REPORT` / `SELECTED_CATS` / `CAT_META` / `rerender` references are gone. **Recommend a hard-refresh load test** (Ctrl+Shift+R) with the `.xlsx` and a CSV export to confirm the dashboard still renders identically.
- Next wave (P1) per §13.7: **I-31** (split `buildDashboard` → `parseWorkbook → buildModel → validate → render`), **I-32** (rule table), **I-34/I-35** (tokens + chart geometry). These are independent of, and build on top of, the Wave 1 registry/state spine.

---

### 14.8 Wave 2 implemented — 2026-09-16

P1 items **I-31** (split `buildDashboard`), **I-32** (rule table), **I-34** (semantic colour tokens), **I-35** (`CHART` geometry object) applied to `Procurement-Dashboard.html`, plus **I-46** folded into I-32. Structural only — the rendered dashboard is intended to be identical to the post-Wave-1 version for the same input.

| ID | Change | Where |
|---|---|---|
| **I-31** | `buildDashboard()` → thin orchestrator. New `parseWorkbook(result)` (locate PPP + Code sheets, throw if missing) and `buildModel(result, filename)` (contract → `fieldToCol` → lookups → packages → `stateCanon`, returns `{model, vctx}`). 03/04 layers are now independently callable/unit-testable. | charts/validation section |
| **I-32** | Per-package validation rules (V-05/06/07/08/09/10/17, plus V-02/03/04 date & numeric) moved into one `RULES` array; each `{code, sev, run(p,id,ctx,add)}`. The `pkgs.forEach` loop now only does bookkeeping (dup counter, engineer variants, blanks) then runs `RULES`. Panel/counter/CSV still derive from `add()` — no behaviour change. Adding a rule = one entry. | `validate()` |
| **I-46** | (folded into I-32) Duplicate-Package-No detection now normalises the key with `norm()` while keeping the raw value for display, so `" PKG-01 "` and `"PKG-01"` collapse and V-11 fires correctly. | `validate()` `noCount`/`noRaw` |
| **I-34** | CSS hex (`.flag`, `.vchip.*`, `.sev-*`, `tr.over td`, `.expect`, `#errBanner`, wicon gradient) promoted to `--warn-* / --error-* / --ok-* / --chart-grey / --accent-dark / --good-dark / --accent-grad-end / --accent-soft-border / --accent-ink / --grid` tokens. SVG colour literals centralised in the `CHART` object — literal hex kept intentionally because the chart is serialised to PNG where CSS vars don't resolve. | `:root`, chart builders |
| **I-35** | All bar/pie/grouped geometry (W, RW, padT, RH, BH, pie R/r/cx/legendX/rowH, group h/pad*) now reads from the `CHART` object. One place to change a chart dimension. | `CHART`; `svgHBar`/`svgPie`/`svgGrouped` |

**Decision — I-11 deferred.** The §13.7 roadmap listed P1 as "absorbing I-11" (read the Error Code/Description lookup from the Code sheet and use it to label validation rules). That is a *behaviour-changing feature* (rule messages would now be data-driven), not a pure maintainability refactor, and the user's standing "structural only / no behaviour change" stance applies. I-11 is therefore **not** implemented in this wave; it remains open for a dedicated feature pass (extend `LOOKUP_HEADERS` + `findLookupColumns()`, load the table in `buildModel`, and wire it into `RULES` messages).

**Verification note.** The sandbox shell (Bash/PowerShell) was unavailable throughout ("Connection lost"), so the automated `node --check` / `vm.Script` syntax pass could **not** be run. Every changed function was re-read and checked for dangling references (`stSet`/`discSet`/`critSet`/etc. outer sets removed and re-scoped inside each rule; `buildModel`/`parseWorkbook`/`RULES`/`CHART` all referenced consistently). **Please hard-refresh (Ctrl+Shift+R) and load both the `.xlsx` and a CSV export** to confirm the dashboard renders and validates identically.

---

### 14.9 Wave 3 implemented — 2026-09-16 (P2 — final wave)

P2 items **I-28, I-29, I-33, I-36 … I-40** applied to `Procurement-Dashboard.html`, plus **I-47** absorbed. Structural only — the rendered dashboard is intended to be identical to the post-Wave-2 version for the same input (the only visible additions are the a11y labels and the optional dark/print/reduced-motion blocks).

| ID | Change | Where |
|---|---|---|
| **I-28** | Per-metric behaviour is now a registry **capability**, not a `key===…` branch. Every `METRICS` entry declares `charts:['bar','pie']`; the lead-time card's conditional note moved to a `note(pkgs,mode)` function on the entry. `renderCat()` now reads `meta.note` / `meta.decorate` — **zero `key===…` branches remain**. | `METRICS`; `renderCat()` |
| **I-29** | Deleted the dead `htmlHBar()` (HTML/CSS bar renderer). `svgHBar()` is the single renderer — export parity, one visual language. | charts section |
| **I-33** | Whole `<script>` body wrapped in `(function(){ … })();`. The ~40 identifiers are now private; nothing leaks onto `window`. | script top/bottom |
| **I-36** | No inline `style="…"` remains in HTML markup — the last block lived in `htmlHBar()` and went with I-29. | — |
| **I-37** | Convention adopted: `.ds-*` = primitive, `.s-*` = status state, `.note` = caption. Renamed `.text-bad`→`.ds-bad`, `.warn-text`→`.ds-warn`; retired `.note-lead`. | `:root`-adjacent CSS; `safeCall`, `renderCodeMap` |
| **I-38** | Table styles scoped from bare `table`/`th`/`td` to `.ds-table`; `class="ds-table"` added to benchmark, validation, look-ahead and delay tables. Grid `gap` owns spacing. | CSS; four tables |
| **I-39** | Added `@media (prefers-reduced-motion: reduce)`, a print stylesheet, and a `[data-theme="dark"]` token block (chart area pinned light so PNG-exported charts stay legible). | CSS tail |
| **I-40** | a11y baseline: chart SVGs get `role="img"` + descriptive `aria-label`; `scope="col"` on all generated `<th>`; removed the misleading `aria-haspopup="listbox"` from `#tfBtn` and gave `#tfPanel` `role="group"` + `aria-label`; added a global `:focus-visible` outline. | chart builders; `renderValidation`; look-ahead/delays; topbar; CSS |
| **I-47** | `.tf-panel` gains `max-width:min(340px,90vw)`; each filter label wraps its text in `.tf-name` (ellipsis) and carries a `title` tooltip. | CSS; `buildTypeFilter()` |

Notes / trade-offs:
- **Dark theme is present but not wired to a toggle.** The `[data-theme="dark"]` block exists (per I-39) and can be activated by setting `document.documentElement.dataset.theme='dark'`; adding a user-facing switch is a *feature*, tracked in §10 backlog, not part of this refactor.
- **I-41 (stale line numbers in §3.2 / §11 docs) remains open** — it is a documentation-hygiene item, not code. §13/§14 use function names alongside line numbers.
- **I-11 is now closed** — implemented in **Rev 1.9 (§15.9)**; the data-driven rule messages are live.

**Verification note.** The sandbox shell (Bash/PowerShell) and Grep were again unavailable ("Connection lost"), so the automated `node --check` / `vm.Script` syntax pass could **not** be run. Each edit was verified by targeted re-read: IIFE open/close, `METRICS` capabilities, `renderCat()` capability path, `svgHBar`/`svgPie`/`svgGrouped` `role`/`aria-label`, `.ds-table` scoping, filter-label markup, and the CSS tail. **Please hard-refresh (Ctrl+Shift+R) and load both the `.xlsx` and a CSV export** to confirm the dashboard renders, validates and exports exactly as before.

---

## 15. Verification Run — 2026-09-16

**This section closes the verification gap that Waves 0–3 could not close.** The sandbox shell recovered during this session, so the automated checks that had repeatedly failed were finally executed.

### 15.1 What was run

| Check | Method | Result |
|---|---|---|
| Syntax | whole `<script>` block extracted and compiled | ✅ **SYNTAX OK — 62,260 chars** |
| End-to-end pipeline | **`test/test_pipeline.mjs`** — extracts the *shipped* script from `Procurement-Dashboard.html`, injects a temporary export hook, supplies a minimal DOM stub, then runs the real `parseXlsx → buildModel → validate → buildDashboard` against the real `.xlsx` | ✅ **15 / 15 assertions pass** |
| Render smoke test | full `buildDashboard()` with the DOM stub | ✅ **14 chart-sized renders produced**, zero uncaught throws |

The harness is re-runnable: `node test/test_pipeline.mjs` from the project root. It is a **test artifact**, not a deliverable — it never modifies the dashboard.

### 15.2 Conclusion: the Wave 0–3 refactor is sound

Every structural claim made in §14.6–§14.9 is confirmed by execution, not just by inspection:

- `METRICS` resolves to exactly the 5 expected entries; `CHART` geometry is present; the `RULES` path executes.
- Lookup resolution matches the documented contract — `Discipline Description`→**F**, `Criticality`→**I**, `Package Status`→**L**, `Item Category`→**O**.
- Column mapping from Code!B is correct for all 15 stage fields (`mrPlan`=Q … `rosActual`=AE).
- 122 packages parsed; header row and list-end row both resolved from the Code sheet with **no silent fallback** (`headerRowDefault=false`, `lastRowDefault=false`).
- Every fired issue carries a valid `V-nn` code, a severity and a message — **no `undefined` / `NaN` / `[object Object]` leaked into any message**.

### 15.3 The workbook has moved on since Rev 1.5

The re-run revealed the source workbook has been updated. These change the app's behaviour and the open-issue list:

| Observation | Impact |
|---|---|
| **Column C (Data Type) is now populated** — 31 of 31 fields typed (`Text`/`Date`/`Int`) | ✅ **V-16 is resolved.** The built-in `LEGACY_DATE_FIELDS` fallback is no longer used. |
| **Error Code / Error Description table now populated — `Code!Q2:R19`, V-01 … V-18** | 🔓 **I-11 is unblocked.** The authoritative rule text now lives in the workbook. |
| `List End Row` = **300** (was 122) | ⚠️ Creates permanent V-20 noise — see **I-50**. |
| New metadata: `Consultant` = Jacobs; `AsOf Date` = 46280 (2026-09-14) | As-of rendering confirmed correct. |
| New header `Category Code` at **N** (paired with `Item Category` at O) | ⚠️ Exposes a latent mapping gap — see **I-51**. |

### 15.4 What the validation engine reports on current data

121 issues — **all warning severity, zero errors**:

| Rule | Count | Reading |
|---|---|---|
| **V-08** | **119** | 85 × `VD → FAT Plan` and 34 × `PO → VD Plan` sequence inversions |
| ~~V-18~~ | ~~1~~ | ✅ **No longer fires** after the I-49 fix (§15.8) — the phantom `Status Category` block is gone. Previously the only false positive in the report. |
| V-20 | 1 | 122 of 299 expected rows had content — see **I-50** |

**The V-08 cluster is a data problem, not a code problem.** 84 packages share the *identical* pair VD Plan = `2026-11-28` / FAT Plan = `2026-09-29`, while the handful of passing rows have individually varied dates. Two fixed dates repeated 84 times is placeholder data, not a real schedule — so the engine is correctly surfacing it, and this is the dashboard doing its job. Recommended action is on the workbook, not the code.

### 15.5 New issues from this run

| ID | Sev | Issue | Where | Fix |
|---|---|---|---|---|
| **I-49** | Med | ✅ **FIXED 2026-09-16 — see §15.8.** **`Status Category` was demanded but is not part of the contract.** `LOOKUP_HEADERS.statusCategory` expected a row-1 block titled "Status Category"; the workbook has none (only `Status Code` at K / `Package Status` at L). The workbook's *own* V-18 description lists only "Discipline / Criticality / Status / Category". → V-18 fired on every single load as a **false positive**. | `LOOKUP_HEADERS`; `buildModel()`; `renderCodeMap()` | **Decision: the block is not required.** Removed `statusCategory` from all three sites; the key list in `renderCodeMap()` is now derived from `lookupMeta` so this class of drift cannot recur. |
| **I-50** | Low | ✅ **CLOSED 2026-09-16 — accepted behaviour, no code change.** **V-20 warns on every load.** `List End Row = 300` is a 300-row *template* bound while only 122 rows hold data, so V-20 reports "177 row(s) were completely blank". | `validate()` V-20 | **Decision: keep it as a warning.** The user confirmed 300 is a template bound and the row-count shortfall is expected — it should be *visible* but never blocking. No change: V-20 already emits `warning` severity, and the report carries zero errors. |
| **I-51** | Low (latent) | ✅ **FIXED 2026-09-16 — see §15.7.** **`categoryCode` never resolved and was mis-pointed.** `LOOKUP_HEADERS` had no `categoryCode` key, so `lookups.categoryCode` was always `[]`; and `lookupMeta.category.codeCol` was set to `lsrc.category` → reported column **O** (`Item Category`, i.e. descriptions) instead of **N** (`Category Code`). Was latent because `renderCodeMap()` does not render `codeCol`. | `LOOKUP_HEADERS`, `buildModel()` | ✅ Added `categoryCode:['category code','category code description']`; `codeCol` now reads `lsrc.categoryCode`. |
| **I-52** | Low (**was blocking I-11**) | ✅ **CLOSED 2026-09-16 — workbook task, not code.** **V-19 / V-20 had no row in the workbook Error table** (which documented V-01…V-18 only). | `Code!Q:R` | **Done by the workbook owner** — the V-19 and V-20 rows were added; the harness now asserts both resolve. I-11's fallback for a code with **no** row is implemented as **V-21** (*warning only*). See §15.9. |

### 15.6 Decisions taken (2026-09-16) — all §15.5 issues closed

Every open issue from the verification run is now resolved. Three of the four needed a **decision**, not code work:

| Issue | Decision | Action |
|---|---|---|
| **I-49** | The `Status Category` lookup block is **not required**. | ✅ Code: removed from `LOOKUP_HEADERS` / `lookups` / `lookupMeta`. V-18 no longer fires. |
| **I-50** | `List End Row = 300` is a **template bound**; only 122 rows hold data. | ✅ No code change — V-20 already emits `warning`, which the user confirmed is the intended severity. |
| **I-52** | **Keep the rule text in the worksheet** — the business owns the wording, and users can look up any code they see in the panel. | 📋 Workbook: the user adds the missing `V-19` / `V-20` rows to `Code!Q:R`. |
| **V-08** (×119) | Placeholder VD/FAT plan dates **will be updated by the user**. | 📋 Workbook: no code change will fix it. |

Plus the approved UI change: **`renderCodeMap()` now reports the column location**, showing both the description column and its paired code column. It is also now **derived from `lookupMeta`** rather than a hardcoded key list, so a block added or removed in one place appears here automatically — the exact drift that caused I-49.

**Superseded 2026-09-16:** the example originally quoted here was `Item Category: col O · code col N · 19 values`, which mistakenly credited the (then blank) code column N with the description column's count. The workbook now carries real values in N, so the line reads `Item Category: col O (19) · code col N (19)`. See **§15.10** for the fix and **§15.11** for the workbook update.

**I-11 is now implemented (§15.9).** It moved the rule wording out of the code and into the spreadsheet so the *business* owns the text, and it defines the fallback I-52 left open: a code with no Error row keeps the dashboard's built-in message and raises **V-21** — *warning only, never an error*.

### 15.7 I-51 implemented — 2026-09-16

Scope exactly as approved: make the `Category Code` lookup resolvable and point the metadata at the right column. **Three one-line changes, no behavioural change to any rendered output.**

| # | Change | Where |
|---|---|---|
| 1 | Added `categoryCode: ['category code','category code description']` | `LOOKUP_HEADERS` |
| 2 | Added `categoryCode: readLookupCol(code, li.categoryCode, 1)` | `buildModel()` → `lookups` |
| 3 | Changed `codeCol: lsrc.category` → `codeCol: lsrc.categoryCode` | `buildModel()` → `lookupMeta.category` |

Effect: with the current workbook, `findLookupColumns()` now resolves `categoryCode` → **N** (`Category Code`), `lookups.categoryCode` reads real values instead of `[]`, and `lookupMeta.category` reads `descCol='O'` / `codeCol='N'` instead of pointing both at O. Nothing consumes `codeCol` yet, so the rendered dashboard is **unchanged** — the value is that the data is now correct for I-11 and any future code-mapping feature.

> **Partly superseded by §15.8:** at the time of this fix nothing consumed `codeCol`. `renderCodeMap()` **now does surface it**, so the Code sheet map line has since changed (by design, approved).

Verification: three assertions added to `test/test_pipeline.mjs` — `category.codeCol === 'N'`, `category.col === 'O'`, and `lookups.categoryCode` resolves. See §15.1 for how to run it.

### 15.8 I-49 / I-50 / I-52 closed + `renderCodeMap()` column display — 2026-09-16

Approved in full. **Three code changes for I-49 and one UI change; I-50 and I-52 required no code.**

| # | Change | Where |
|---|---|---|
| 1 | Removed `statusCategory: ['status category','status cat']` — `findLookupColumns()` iterates this table, so the block disappeared from `idx`/`src` automatically | `LOOKUP_HEADERS` |
| 2 | Removed `statusCategory: readLookupCol(code, li.statusCategory, 1)` | `buildModel()` → `lookups` |
| 3 | Removed the `statusCategory` entry — this is the object V-18 iterates, so the false positive is eliminated **at the source** | `buildModel()` → `lookupMeta` |
| 4 | The hardcoded key list `['discipline','criticality','status','statusCategory','category']` is replaced by `Object.values(LM)`, and each block now renders `col F · code col E · n values` | `renderCodeMap()` |

**Effect.** The Code sheet map now reads:

```
Code sheet: 31 field mapping(s) read from A/B · Data Type (C): 31 value(s)
Discipline Description: col F · code col E · 19 values · Criticality: col I · code col H · 5 values
· Package Status: col L · code col K · 9 values · Item Category: col O · code col N · 19 values
```

Every column location is now verifiable on screen, and `Status Category` is gone.

**Behavioural impact.** The validation panel loses its one false positive — **zero errors**, only warnings. No chart, KPI or table is affected.

**Regression guard.** 6 assertions added to `test/test_pipeline.mjs`: `statusCategory` absent from both `lookupMeta` and `lookups`; every surviving block resolves a description column; **V-18 never fires**; the report carries zero error-severity issues; **V-20 stays a warning**; and the rendered `vmap` string contains no `Status Category` but does surface a `code col`. This locks in all three decisions so a later edit cannot silently reintroduce them.

**Why the derived key list matters.** I-49 arose because the contract lived in *two* places — `LOOKUP_HEADERS` **and** a second hardcoded list inside `renderCodeMap()`. Deriving the display from `lookupMeta` deletes the second copy, so this class of drift cannot recur.

#### Residual — I-52's fallback (was a prerequisite for I-11)

> ✅ **Resolved in Rev 1.9 (§15.9).** The workbook owner added the `V-19` / `V-20` rows to `Code!Q:R`, and the fallback for a code with **no** row is implemented as **V-21**: keep the dashboard's built-in message and raise a **warning** (never an error).

---

### 15.9 I-11 implemented — rule wording now comes from the workbook — 2026-09-16

**Approved scope:** the Code sheet Error table (`Code!Q:R`) becomes the single source of truth for validation-rule wording, and a code with **no** row must *warn* the user, never error. The workbook owner added the `V-19` / `V-20` rows first, so the feature lands on a complete table.

#### What changed

| # | Change | Where |
|---|---|---|
| 1 | `errorCode: ['error code','error id','validation code']` and `errorDescription: ['error description','error message','error text']` added | `LOOKUP_HEADERS` |
| 2 | New `readLookupMap(grid, codeCol, descCol, start)` → `{CODE: wording}` | data layer, beside `readLookupCol()` |
| 3 | `model.errorTable` + `codeInfo.errorCount / errorCodeCol / errorDescCol`; the same three values reach `validate()` through `vctx` | `buildModel()` |
| 4 | `add()` stamps every issue with `desc` — the workbook wording for that code (`''` when there is no row) | `validate()` |
| 5 | New rule **V-21** (*warning only*) listing the codes used in this report that have no row in the Error table; a wholly missing block is reported the same way | `validate()` |
| 6 | New `renderRuleRef(rep)` — **one line per fired rule** with the workbook wording; the rule code in the detail table gains a `title` tooltip | `renderValidation()` + `#vref` markup + `.vref*` / `.rulecell` CSS |
| 7 | The Code sheet map now reports `Error table: col R · code col Q · 20 code(s)` | `renderCodeMap()` |

#### Why the map is read row by row

`readLookupCol()` skips blank cells and only stops after **3 consecutive** blanks. Zipping the two columns independently would therefore **shift every later entry** if a single description cell were blank — V-08 could be displayed with V-09's text. A code → text map must be read **row-aligned**, so `readLookupMap()` walks rows and reads both columns of the *same* row.

#### The fallback contract

> *"if any code can not find, warn user only"*

| Situation | Behaviour |
|---|---|
| Code present in `Code!Q:R` | Its wording is attached to the issue and listed in the Rule reference |
| Code **absent** from `Code!Q:R` | The rule's own built-in message stands, and **one** V-21 *warning* names every missing code |
| The whole Error-table block is missing from row 1 | One V-21 *warning* says the block was not found |

**V-21 is always `warning`** — it never becomes an error, never blocks the dashboard, and the report's error count stays 0. **V-21 excludes itself** from the check: a rule should not audit its own documentation, otherwise the worksheet could never reach a clean state. Adding a `V-21` row to the workbook is harmless and changes nothing.

#### Why a deduplicated reference instead of a per-row definition

The detail table can list the same rule 100+ times (119 × V-08 on current data), so repeating its definition on every row would be noise rather than help. The **Rule reference** above the table shows each *fired* rule exactly once, and an unknown code is marked `not listed in the Error table — the dashboard's built-in wording is used`.

#### Effect on current data

| | Before Rev 1.9 | After |
|---|---|---|
| Report | 120 issues (119 × V-08 + 1 × V-20), **0 errors** | unchanged — every fired code is documented, so V-21 does **not** fire |
| Code sheet map line | `… · Data Type (C): 31 value(s)` | `… · Error table: col R · code col Q · 20 code(s)` |
| Validation panel | chips + detail table | chips + **Rule reference** + detail table |
| Charts / KPIs / tables | — | **unchanged** |

#### Incidental cleanups in the same revision

- **I-49 residue** — `isIssued()` still referenced `lookups.statusCategory`, a key removed from the contract; the dead branch is gone.
- **I-53** — `isIssued()` matched the **raw** status while every other view runs it through `statusCanon()`, so a status stored as a short code (`DEL`, `RI`, `PO`) was never recognised as *issued* and such packages would wrongly appear in **PO Issuance Delays**. It is now canonicalised first. **No effect on the current workbook** (statuses are stored as full text, where `statusCanon` is the identity).

#### Regression guard

`test/test_pipeline.mjs` grows from 24 to **42 assertions** (the count was estimated at 34 while the shell was down; the first *executed* run reported **42**). New coverage: the Error table is read (≥18 entries) and located as **Q**/**R**; `V-19` and `V-20` both resolve; every issue carries a `.desc` string; every fired code resolves a wording; **no V-21 on the current workbook**. For the fallback, `V-08` is blanked out in a patched `vctx` and the run must produce **exactly one V-21 warning naming V-08**, still with zero errors, V-08 keeping its built-in message, and **V-21 not naming itself**; a wholly missing block must warn once with `not found`. Render side: the map line reports the Error-table columns, and the rendered Rule reference contains the workbook wording for V-08 **exactly once**.

> ⚠ **Verification gap (since closed).** The sandbox shell (Bash **and** PowerShell) returned "Connection lost" throughout this revision, so `node test/test_pipeline.mjs` **could not be executed** at the time. Every edit was verified by re-reading it from disk and hand-tracing. **The shell recovered and the harness was then executed — see §15.10, which also records two defects this run exposed.** §15.10 supersedes this note.

### 15.11 Pending-issue audit — 2026-09-16

A full sweep of every table in this document for rows that are **not** closed. Result: **six genuinely open items, of which five are dormant backlog and exactly one wants a decision from you.**

#### A. Resolved since the audit (2)

| ID | Status | Note |
|---|---|---|
| **I-05b (categories)** | ✅ **Resolved by the workbook** | The `Item Category` lookup now carries real `Category Code` values beside the descriptions. No code change — the block is located by row-1 title, so the values flow through automatically |
| **I-05b (lead time)** | ✅ **Resolved by the workbook, units confirmed = DAYS** | Column K is now headed **`Estimate Lead Time (Days)`** and every cell is numeric (30 … 735). The previous `A`/`B`/`C`/`D`/`AA` **codes are gone** — the field documents itself, so **V-22 is no longer needed for this workbook**. The Lead Time chart and its buckets now read real day counts |

**Formula cells — verified behaviour.** The user noted some Lead Time cells may be *formula-calculated*. The offline parser reads a cell's cached `<v>` only (`parseSheet()` → the number branch) and **never evaluates `<f>`**, which is the correct trade-off:

- ✅ **Excel / LibreOffice / Google Sheets exports** always write a cached result, so a formula cell parses as its computed number — this is the normal case and it works.
- ⚠️ **A file written by a library that stores `<f>` with no cached `<v>`** yields `null`. Those cells surface as **V-04 "Value is not numeric"** in the panel — visible, never silently invented. Evaluating formulas is explicitly out of scope: it would mean re-implementing a spreadsheet engine in a zero-dependency file (§13.8).
- The number branch now carries a comment recording this contract, so a future reader does not "helpfully" add `<f>` handling and double-count.

#### B. Needs a decision (0) — **none remaining**

#### C. Backlog, dormant — no decision needed to leave them parked (**4** after Rev 1.13)

| ID | Sev | Issue | Why it is parked |
|---|---|---|---|
| **I-10** | Low | No multi-project support | Feature, not a defect. **§13.8 forbids splitting files**, so this is a v2.0 conversation |
| ~~I-12~~ | — | ~~`LEGACY_DATE_FIELDS` (15 names) is dead code~~ → **stale, not open** — the array no longer exists and `Code!C` is fully populated (31/31) | Row kept for provenance; **re-check before acting** (§15.12 C) |
| ~~I-25~~ | — | ~~`normPerson()` dead → V-12 can never fire~~ → **CLOSED (§15.12)** — the helper is deleted *and* V-12 is now reachable | Done in Rev 1.13 |
| **I-26** | Med | `svgPie()` collapses to top-8 + "Other"; Engineer has exactly 8 names, so a 9th variant would push the smallest names into "Other" | Latent — silently degrades one chart only once the data grows. **Note:** §15.12 keeps genuine `Kenny` / `Kenny/Franklin` separate, so this stays at exactly 8 for the shipped workbook |
| **I-41** | Low | This document's own §3.2 / §11 line references are stale (quote Rev 1.0 positions) | Documentation hygiene only — **no code impact** |
| **I-54** | Low | CSV export omits the new `desc` (rule wording) column | Deliberate: adding a column changes the export's shape, which downstream scripts may rely on. **Recommend leave frozen** |
| **P-3, P-4, P-5, P-7** | Med | Parser safety rails: cell-count invariant, self-closing-cell fixture, `openpyxl` golden-file check; **P-7** (the I-25/I-26 cascade) is now **half done** — the I-25 half landed in §15.12, the I-26 `topN`/export-target half is still open | These are the permanent defence for **I-23** (silent column shift). **Not needed to ship, but they are what would catch a repeat** |

#### D. Explicit non-issues — do **not** re-open

- **V-08 ×119** and **V-20 ×1** are *correct* findings about the workbook, not defects. V-08 is placeholder VD/FAT plan dates; V-20 is the 300-row template bound. Both are closed in §15.6 and are owned by the data, not the code.
- **I-24** (no parser regression test) is materially *addressed* by `test/test_pipeline.mjs`; only the three preventive rails in **P-3/P-4/P-5** remain.
- **Dark mode** exists as a token block but has no toggle — a *feature* in §10 backlog, not an open defect.

#### D. Verified-clean areas

- **Validation report on current data: 119 × V-08 + 1 × V-20 — zero errors, and no false positives** (I-49's phantom block is gone; V-21 does not fire because every fired code is documented).
- **Harness: 46 / 46 assertions pass.** Parsing, lookups, contract mapping, render and export paths are all executed end-to-end.
- All five roadmap waves (P0-B, P0, P1, P2) are implemented **and** verified by execution.

> **Bottom line:** nothing in this workplan blocks the dashboard from working. The only item that would change *what the dashboard can show you* is **V-22** (§15.10) — the empty lookup code column. **Rev 1.13 (§15.12) closed I-25 and cleared I-12**, so the parked list is now **4 items: I-10, I-26, I-41, I-54**.

---

### 15.10 I-51 re-verified + `renderCodeMap()` count correction — 2026-09-16

Rev 1.9 shipped **unexecuted** (shell outage). The first successful run exposed two defects, both in work from the I-49/I-51 window.

#### Defect 1 — a test that could not fail

The I-51 assertion written in Rev 1.7 was:

```js
ok('I-51: lookups.categoryCode now resolves (was always empty)',
   Array.isArray(model.lookups.categoryCode), 'length ' + ...);
```

`Array.isArray([])` is `true`, so the assertion **passes on the very emptiness it was written to detect.** The headline claim "now resolves" was therefore unverified for two revisions. It now asserts the real contract — the code column is located **and** its count is tracked separately (`codeN === lookups.categoryCode.length`) — plus a cross-block alignment assertion: `discipline`/`criticality`/`status` must have `codeN === n`, and `category` must be `desc = 19 / code = 0`.

**Why the Category code column really is empty.** Reading `Code!E:N` directly:

| Block | Description col | Code col | Codes present |
|---|---|---|---|
| Discipline | F (19) | E | **19** — `A`, `B`, `C`, … |
| Criticality | I (5) | H | **5** — `0`…`4` |
| Package Status | L (9) | K | **9** — `NS`, `MR`, `PO`, … |
| Item Category | O (19) | N | **0 — header only** |

So `lookups.categoryCode === []` is **correct**. The workbook declares a `Category Code` column and leaves its body blank — a *worksheet* gap, not a code bug. I-51's fix (pointing `codeCol` at **N** instead of **O**) was right; only its test was vacuous.

#### Defect 2 — the map line credited a blank column with data

Rev 1.8 rendered:

```
Item Category: col O · code col N · 19 values
```

The `19` came from `lookupMeta.category.n`, the **description** column's count, so a reader concludes column **N** holds 19 values. It holds none.

`lookupMeta` now carries **`codeN`** alongside `n` — two genuinely different facts, each computed once in `buildModel()` — and the line reads:

```
Discipline Description: col F (19) · code col E (19) · Criticality: col I (5) · code col H (5) ·
Package Status: col L (9) · code col K (9) · Item Category: col O (19) · code col N (empty)
```

A code column whose header exists but whose body is blank renders **`(empty)`** in the warning colour, so the gap is visible on screen rather than smoothed over.

#### Open question — V-18 still cannot see this

V-18 tests `!col || !n`, and `n` is the **description** count, so a block whose *code* column is blank passes silently — this is the same shape as I-49 (a check that does not test what its name implies). **No rule was added**, because that is a behaviour change. Options:

1. Widen V-18 to also require `codeN` — reuses "the block is not usable".
2. Add a dedicated **V-22 "lookup code column is empty"** — keeps V-18's meaning ("block not found") intact.

**Recommendation: V-22.** The two failures are different, and `Category Code` being blank is exactly the kind of worksheet gap the panel exists to surface. **Awaiting your decision.**

#### Regression guard

`test/test_pipeline.mjs` → **46 assertions, 0 failed**. Four new: `codeN` tracks the code column independently; desc/code counts align for three blocks and diverge for Category; a code column is never credited with the description count (`!/code col N \(\d+\)/`); a blank code column renders `(empty)`; populated code columns render their own counts.

> ✅ **Executed and green: `node test/test_pipeline.mjs` → 46 passed, 0 failed.** Hard-refresh the dashboard (Ctrl+Shift+R) to pick up the corrected map line.

---

### 15.12 Dead-code cleanup — 2026-09-16 (Rev 1.13)

Sweep for code that is defined but never reached. **One finding was substantive** — a validation rule that was *implemented* but **unreachable by construction**; the rest were helpers that could be deleted, plus two candidates that turned out to be live.

#### A. I-25 — V-12 could never fire (the real finding)

The workplan described I-25 as "`normPerson()` is dead code". That was true but not the whole story: **the rule it belonged to was dead too.**

The traverse in `validate()` built the engineer tally like this:

```js
/* BEFORE — unreachable by construction */
const raw = p._raw['engineer'];
if (raw != null) (personVariants[raw] = personVariants[raw] || new Set()).add(raw);
...
Object.entries(personVariants).forEach(([n, s]) => { if (s.size > 1) add(...V-12...); });
```

The Set is **keyed by the raw string** and the **same raw string** is the value added to it. So `personVariants["Dilip / Siva"]` is a Set containing exactly `"Dilip / Siva"` — `size` is **always 1**, and `s.size > 1` can never hold. V-12 was not "a rule that misfires"; it was a rule that **could never run at all**, which is why `"Dilip/Siva"`, `"Dilip / Siva"` and `"Siva /Dilip"` were silently counted as three separate people on the Engineer chart.

This is the **same failure shape as the vacuous `Array.isArray` assertion in §15.10** — a test/rule written in terms of a value that *cannot* distinguish what it claims to distinguish. Worth naming, because the two were found in the same window: *expressing a check in the wrong terms produces something that looks like coverage and is not.*

**Fix (three edits, one region):**

```js
/* AFTER — loose key, distinct raw spellings */
const rawE = p._raw['engineer'];
if (rawE != null && String(rawE).trim() !== '') {
  const shown = String(rawE).trim();
  const key = shown.toLowerCase().replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ');
  (personVariants[key] = personVariants[key] || new Set()).add(shown);
}
...
Object.values(personVariants).forEach(s => {
  if (s.size > 1) add('warning','V-12','—','Design Engineer',
    Array.from(s).join('  |  '),
    'Same engineer written different ways — counted as ' + s.size +
    ' separate people in the Engineer chart. Align the spelling in Excel.');
});
```

The **key** is used for comparison only (slash spacing and runs of whitespace collapsed); the **Set holds the untouched raw spellings**, so the report shows exactly what the worksheet says. `"Kenny"` vs `"Kenny/Franklin"` differ by more than spacing, so they are **not** merged — the rule reports *typing noise*, it does not guess identities.

#### B. `normPerson()` removed

```js
/* deleted (was ~line 595) */
function normPerson(s){ return String(s==null?'':s).replace(/\s*\/\s*/g,' / ').replace(/\s+/g,' ').trim(); }
```

Defined, never called. Deleted **rather than wired up**: it would *rewrite* the displayed name, and the decision here is that the dashboard reports the variant and leaves the fix in Excel. A comment at the deletion site records this, so the helper is not "restored" by a future reader who sees an unused name in the diff.

#### C. Checked and **not** dead — left alone

| Candidate | Verdict |
|---|---|
| `TYPE_ALIASES` / `normType()` | **Live** — consumed by `parseFieldTypes()` when `Code!C` declares a Data Type. Only *looks* unused because `Code!C` is now fully populated (31/31) |
| `LEGACY_DATE_FIELDS` | **Already gone** — the array no longer exists, so **I-12 as written is stale, not open** (row corrected in §7) |

#### D. Regression guard — 4 new V-12 assertions

Both directions are pinned, so the rule can neither be silently unreachable again nor over-reach:

| Assertion | Pins |
|---|---|
| Variants differing only in slash/spacing **fire** V-12 | The rule is reachable |
| The report line contains **every** distinct raw spelling | No variant is dropped from the evidence |
| V-12 is `warning` and adds **0 errors** | Spelling noise never blocks the dashboard |
| `Kenny` vs `Kenny/Franklin` do **not** merge | The rule does not guess |
| The **shipped workbook** produces **0** V-12 | The current data is clean; a future collision flips this and is the signal |

#### E. Verification status

> ⚠ **VERIFICATION PENDING.** The sandbox shell (Bash **and** PowerShell) returned "Connection lost" for every attempt during this revision — including bare `echo` — so `node test/test_pipeline.mjs` **could not be executed**. All three code edits and all four new assertions were verified by **re-reading the file from disk** (§15.10's edits are confirmed present in the same reads). **Re-run the harness before relying on this revision:** expect **46 + 4 = 50 assertions, 0 failed.**

---

**End of Workplan** — All roadmap waves (P0-B, P0, P1, P2) are implemented and verified; §15.5 issues I-49…I-52 are closed, **I-11 is implemented (§15.9)** and re-verified (§15.10), and **I-25 is closed by §15.12**. Two items still want input: **V-22** (see §15.10) and **I-54** (CSV export shape). Keep this document updated with each future revision.