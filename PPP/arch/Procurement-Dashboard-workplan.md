# Procurement Dashboard — Workplan

Single-file offline dashboard (`Procurement-Dashboard.html`). No network, no CDN — the workbook is parsed in-browser and every view is drawn from two in-memory structures: `STATE.model.packages` (one row object per package) and `STATE.model.lookups` (the Code-sheet dropdown lists).

All line references below point at `Procurement-Dashboard.html` and were traced from the source on **2026-09-22**.

---

## 1. Data model — the Code-sheet contract

The workbook has two key sheets:

- **PPP** — the package register (one row per procurement package).
- **Code** — the "contract" sheet (L450–469). Row 1 holds block headers; column **A** = field label, **B** = value (`Column-X` for the PPP column map, or a literal for project metadata), **C** = Data Type (Date / Text / Number).

### 1.1 Field → column mapping

`CODE_SHEET_KEYS` (L459–469) defines which Code-sheet label maps to which `pkg` property. `buildFieldToCol` (L511) reads the `Column-X` written next to each label and converts it to a 0-based PPP-sheet column index. So every `pkg.<key>` below is filled from the PPP column whose letter is recorded in the Code sheet.

| Code-sheet label (A) | `pkg` key | Type | Consumed by |
|---|---|---|---|
| Package Title | `title` | Text | Look-Ahead, Delays, all tables |
| Package Status | `status` | Text | Chart 1, KPIs, Delays, DQ, Validation |
| Discipline | `discipline` | Text | Chart 2, Look-Ahead, Delays, DQ, Validation |
| Design Engineer | `engineer` | Text | Chart 3, KPIs, DQ, Validation |
| Criticality | `criticality` | Text | Chart 4, DQ, Validation |
| Estimate Lead Time | `leadTime` | Number | Chart 5, KPIs, DQ, Validation |
| Item Category | `itemCategory` | Text | **Category filter** (`filteredPackages`) |
| Package No. | `packageNo` | Text | Duplicate detection (V-11), row id |
| PO Plan Date | `poPlan` | Date | Chart 6, 7, 8, 9, DQ |
| PO Actual Date | `poActual` | Date | Chart 6, 7, DQ |
| MR Plan / Actual Date | `mrPlan` / `mrActual` | Date | Chart 6, DQ |
| VD Approval Plan / Actual | `vdPlan` / `vdActual` | Date | Chart 6, DQ |
| FAT Plan / Actual | `fatPlan` / `fatActual` | Date | Chart 6, DQ |
| ROS Plan / Actual | `rosPlan` / `rosActual` | Date | Chart 6, DQ |
| Quantity | `quantity` | Number | Validation (V-04) |
| Area / Equipment Tags / Package Notes / Supplier / Buyer / Project Engineer | `area` / `equipmentTags` / `packageNotes` / `supplier` / `buyer` / `pe` | Text | not charted (reserved) |

> MR / PO / VD / FAT / ROS each also have a `…Forecast` date column that is parsed but **not used by any chart** (only Plan/Actual drive the views).

### 1.2 Lookup lists

`parseCodeSheet` (L498) also reads the dropdown lists from the Code sheet into `STATE.model.lookups`: `status`, `statusCode`, `discipline`, `disciplineCode`, `criticality`, `criticalityCode`, `category`, `categoryCode`. These lists **order and relabel** the slices in charts 1, 2 and 4, and they power the membership checks in the validation banner.

### 1.3 The shared pipeline

`render()` (L685) is the single entry point. It computes `pkgs = filteredPackages()` **once** and passes the same array to every view:

```
file → parseXlsx/parseCSV → buildModel → STATE.model.{packages,lookups}
                                           │
                              filteredPackages()  ← Category filter (itemCategory)
                                           │  pkgs
                ┌──────────────┬──────────────┬──────────────┬──────────────┐
           5 categorical    Stage cov.     PO by month    date-window     KPI / DQ
              charts        (svgStage)   (renderPOMonthly)  tables       / Validation
```

Nothing is cached in the DOM — change the Category filter and `render()` re-derives all 12 data views.

---

## 2. Chart data sources & calculation logic

For each view: the **source column(s)** (Code label → `pkg` key + type), the **calculation**, the **provider function (line)**, and **notes**.

| # | View (card / SVG id) | Source column(s) → `pkg` key | Calculation logic | Code ref |
|---|---|---|---|---|
| 1 | **Package Status** (`svg-status`, `statusChart`) | Package Status → `status` (Text) | `tally(pkgs,'status')` counts per raw value; slices are then **re-ordered and re-labelled by `lookups.status` + `statusCanon`** (code → description). Unmatched/blank → "Not Specified (blank)" (grey). | `statusItems` L1241; `METRICS` L1088 |
| 2 | **Discipline** (`svg-disc`, `discipline`) | Discipline → `discipline` (Text) | `tally(pkgs,'discipline')` → count per discipline, **sorted descending**. Blanks render as the raw value (no blank bucket here). | `tallyItems` L1128 (called L1091); `tally` L1114 |
| 3 | **Engineer Workload** (`svg-eng`, `engineer`) | Design Engineer → `engineer` (Text) | `tally(pkgs,'engineer')` → count per engineer, sorted; blanks shown as "Unassigned (blank)". Note V-12: spellings differing only in `/` or space are counted as separate people (shown as a warning, data untouched). | `tallyItems` L1128 (called L1093) |
| 4 | **Criticality (Inspection Level)** (`svg-crit`, `criticality`) | Criticality → `criticality` (Text) | Ordered by `lookups.criticalityCode` (fallback `0–4` with built-in descriptions). Counts packages whose value equals each code. Values **not in the list** → orange "… (not in Code list)"; blank → grey "Not Specified (blank)". Sub/note text from `lookups`. | `critItems` L1261; `decorate` L1096 |
| 5 | **Lead Time Estimate** (`svg-lead`, `leadtime`) | Estimate Lead Time → `leadTime` (Number) | `leadStats` collects numeric `leadTime` → **average** (days & weeks). Buckets: **≤90 / 91–180 / 181–270 / >270** days. Bar mode adds "Estimated vs Not estimated" coverage rows; Pie mode = buckets only. Note shows the average. | `leadItems` L1283; `leadStats` L1278; `note` L1106 |
| 6 | **Stage Plan Coverage** (`svg-stage`, `stage`) | MR/PO/VD/FAT/ROS Plan + Actual → `mrPlan…rosActual` (Date) | For each stage, count packages **with a Plan date** vs **with an Actual date** → grouped bars (Planned `#0066CC` / Actual `#34C759`). | `svgStage` L1316 |
| 7 | **PO Plan vs Actual — by Month** (`svg-po`, `poChart`) | PO Plan Date + PO Actual Date → `poPlan`, `poActual` (Date) | Build month axis from earliest `poPlan` to latest plan/actual; count plans & actuals per month; overlay **cumulative** Plan/Actual dashed lines. If `poPlan` is not a real Excel date (plain number like `60`) → empty-state message, chart suppressed. | `renderPOMonthly` L1344 |
| 8 | **3-Month PO Look-Ahead** (`lookahead`) | PO Plan Date → `poPlan` (Date) + Code "AsOf Date" | Filter `poPlan ∈ [asOf, asOf+90d]`, sorted; shows Package / Discipline / PO Plan / Status. | `renderLookAhead` L1368 |
| 9 | **PO Issuance Delays** (`delays`) | PO Plan Date → `poPlan` (Date) + Package Status → `status` + AsOf | Filter `poPlan < asOf` **and** status not "issued" (`isIssued()` wording match: *po issued / delivered / receive inspection / fabrication / fat completed / vendor data approval*). Overdue days = `(asOf − poPlan) / 86400000`. | `renderDelays` L1375; `isIssued` L1116 |
| 10 | **KPIs** (`kpis`) | `status`, `leadTime`, `engineer` (+ count) | Total = rows; Started % = 100 − (Not Start + blank) by canonical status; Delivered/RI % = status contains "delivered"/"receive inspection"; Not Started = notStart+blank; Lead-time coverage = `leadTime` filled; Engineer coverage = `engineer` filled. | `renderKPIs` L1324 |
| 11 | **Data Quality** (`dq`) | Actual stage cols (`poActual,mrActual,vdActual,fatActual,rosActual`), `criticality`, `leadTime`, `engineer`, `mrPlan`, `poPlan` | Flags: no Actual dates anywhere; all Criticality blank; >50% lead-time missing; engineer unassigned; plan-date inconsistency (MR Plan <30% but PO Plan >50%). | `renderDQ` L1386 |
| 12 | **Validation banner** (`vcard` / `vtable`) | many: `status`, `discipline`, `criticality`, `quantity`, `leadTime`, all date fields, `packageNo`, engineer spelling | Not a chart — runs `validate()` rules V-01…V-22; membership checked against the Code-sheet lookup lists. Never blocks the dashboard. | `renderValidation` L1046; `RULES` L865–923 |
| 13 | **Lead Time Benchmark** (`benchmark`) | **none — static hardcoded table** | Pure reference values (e.g. Power transformer 36–78 weeks). No column data is read. | `renderBenchmark` L1382 |

### 2.1 The two non-chart detail tables (date windows)

- **Look-Ahead (#8)** and **Delays (#9)** are tables, not SVG charts, but they derive from the same `pkgs` array and the same `poPlan` / `asOf` inputs.
- **Benchmark (#13)** is the only view with **no data dependency** — it is a fixed reference list.

### 2.2 Things that load-bear the math

- **Dates must be real Excel dates.** Charts 6–9 and the KPI "Delivered" / DQ "execution progress" depend on Plan/Actual columns being stored as Excel dates. If a column holds a plain number (`60`/`90`), `toDate()` returns `null`, so that package is **silently excluded** from the date-based charts (flagged by V-02 / V-03).
- **The Category filter is `itemCategory`.** Change the top-right filter and every data view above (#1–#12) recomputes; Benchmark (#13) is unaffected.
- **`bar`/`pie` toggle** (per metric, persisted in `localStorage` via `getPref`/`setPref`) renders from the *same* provider output through `svgHBar` (L1135) / `svgPie` (L1174) — the data is identical, only the geometry differs.
- **`safeCall` isolation.** Each `render()` branch is wrapped so one failing view cannot break the others (L685–696 region).

---

## 3. Revision history

| Ver | Date | Change |
|---|---|---|
| v1 | 2026-09-22 | Created workplan. Documented the Code-sheet field→column contract (§1) and the per-view source-column + calculation-logic map (§2), traced from `Procurement-Dashboard.html` L450–1469. |

## 4. Open items

- PPP issue register not yet started (no ISS numbers tracked for this project yet).
- Consider a one-page visual reference of §2 for field users.
