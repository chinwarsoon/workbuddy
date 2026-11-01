# PPP Dashboard — Developer Workplan

> **Project**: Procurement Package Plan (PPP) Interactive Dashboard
> **Document ID**: PPP-WP-001
> **Version**: 1.58
> **Date**: 2026-11-01
> **Owner**: PPP developer (dashboard) / Procurement (data)
> **Status**: Maintenance. P8-P8.6 complete: chart and KPI detail, four-page routing, full validation list, snap line, notice area below the menu bar, 14 px panel separation, responsive reflow, spec-compliant filter and search controls with a column picker, hard contrast. 292 assertions; harness Tiers 1-4 pass.
> **Supersedes**: `archive/PPP-Dashboard-Workplan_v1.48_2026-11-01.md` (verbatim copy of Rev 1.48).
> **General UI rules**: `Dashboard-UI-Design-Spec.md` is the single home for general UI design. This workplan records only PPP-specific design, decisions and evidence.

---

## 0. Contents

| Section | Content |
|---|---|
| 1 | Summary and purpose |
| 2 | Revision history |
| 3 | Functions and workflow |
| 4 | Data contract (Code sheet) |
| 5 | Dashboard design (PPP-specific): KPIs, charts, tables, pages, interaction, preferences |
| 6 | Validation rules |
| 7 | Issues — pointer to the canonical issue log |
| 8 | Conformance record (PPP-specific) |
| 9 | Scope summary |
| 10 | File and artefact reference |
| 11 | Decision register |
| A | Historical status narrative (verbatim, pre-1.49) |
| B | Contents entries for sections removed before Rev 1.49 (verbatim) |
| C | General-rule material moved out of this workplan (archive index) |

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
| **Layered** *(target)* | 5 layers — tokens → primitives → data → logic → view; dependency flows downward only. See **archived workplan §13** |

---
## 2. Revision History

| Rev | Date | Author | Changes |
|-----|------|--------|---------|
| 0.1 | 2026-08-?? | — | Initial prototype: basic PPP parsing, status/discipline charts |
| 0.5 | 2026-09-01 | — | Added Code sheet contract (Data Types in column C), validation engine, KPIs |
| 0.8 | 2026-09-10 | — | Stage Plan Coverage, PO Monthly, Look-Ahead, Delays, Benchmark table |
| 0.9 | 2026-09-14 | — | Engineer normalization, criticality lookup, data-quality flags, export functions |
| 1.0 | 2026-09-15 | — | Production-ready: all charts, validation rules (V-01..V-18), benchmark, DQ flags |
| **1.1** | **2026-09-16** | UI Design | **BUGFIX (I-23) — offline XLSX parser no longer loses cells after self-closing empty cells (`<c r="M2" s="7"/>`). Restores Engineer coverage 31/122 → 122/122, all 8 engineer names, all date columns. See §7.1 root-cause log + corrective/preventive actions** |
| 1.2 | 2026-09-16 | UI Design | **DRAFT — PENDING APPROVAL.** Added **archived workplan §13 UI Architecture Review — 5-Layer Target Model**: as-built structure, target layer map, naming/token conventions, accessibility baseline, issues **I-27 … I-40**, and a P0/P1/P2 roadmap. **No code was changed in this revision.** |
| **1.3** | **2026-09-16** | UI Design | **Wave 1 implemented**: I-27 `METRICS` registry (add-a-chart is now **one place**, not four) and I-30 single `STATE` object + `render(STATE)` (DOM write-only). Wave 0 (P0-B: I-42…I-48) remains in place. **Structural refactor only — no visual or behavioural change.** See archived workplan §14.7. |
| 1.4 | 2026-09-16 | UI Design | **Wave 2 implemented**: I-31 `buildDashboard` split (`parseWorkbook → buildModel → render`), I-32 validation **rule table**, I-34 semantic colour tokens, I-35 `CHART` geometry object, + I-46 folded into I-32. I-11 deferred (behaviour-changing feature, not a refactor). Structural only. See archived workplan §14.8. |
| **1.5** | **2026-09-16** | UI Design → superseded | **Wave 3 implemented (P2 — final wave)**: I-28 per-metric behaviour as a registry `note` capability (no `key===…` branch), I-29 dead `htmlHBar()` deleted (one bar renderer), I-33 whole script wrapped in an **IIFE** (≈40 globals removed), I-36 inline styles gone (with I-29), I-37 `.ds-*` primitive naming (`.text-bad`→`.ds-bad`, `.warn-text`→`.ds-warn`, `.note-lead` retired), I-38 table styles scoped to `.ds-table`, I-39 **reduced-motion + print + dark-theme** blocks, I-40 a11y baseline (`role="img"`/`aria-label` on charts, `scope="col"` on headers, popup-role mismatch fixed, global `:focus-visible`), and I-47 filter-panel `max-width` + ellipsis labels. **All five roadmap waves now complete.** Structural only — see archived workplan §14.9. |
| **1.6** | **2026-09-16** | verification | **archived workplan §15 Verification Run — the Wave 0–3 verification gap is closed.** The script compiles (**SYNTAX OK, 62,260 chars**) and a new headless harness (`test/test_pipeline.mjs`) runs the *shipped* script against the *real* workbook end-to-end: **16/16 assertions pass**, 14 chart renders produced. This confirms every structural claim in archived workplan §14.6–archived workplan §14.9 **by execution**, not just by inspection. Also records that the workbook has moved on (Code!C Data Type now populated → **V-16 resolved**; `Code!Q:R` Error table now populated → **I-11 unblocked**; `List End Row` now 300) and logs **I-49…I-52**. No code changed. |
| 1.7 | 2026-09-16 | UI Design | **I-51 fixed (archived workplan §15.7)** — `LOOKUP_HEADERS` gains a `categoryCode` key, `lookups.categoryCode` is now read, and `lookupMeta.category.codeCol` points at **N** (`Category Code`) instead of **O** (`Item Category`). Three one-line changes; **no rendered output changes** (nothing consumed `codeCol` yet — the value is correct data for I-11). Harness gains two I-51 assertions. |
| 1.8 | 2026-09-16 | UI Design | **I-49 / I-50 / I-52 closed (archived workplan §15.8).** `Status Category` dropped from the contract — V-18's false positive eliminated **at the source**; `List End Row = 300` accepted as a template bound, so V-20 stays a warning; the workbook owner adds the missing V-19/V-20 rows to `Code!Q:R`. `renderCodeMap()` now reports the column location of every block (description column **and** paired code column) and is derived from `lookupMeta`, deleting the duplicate contract copy that caused I-49. |
| 1.9 | 2026-09-16 | UI Design | **I-11 implemented — the rule wording now comes from the workbook (archived workplan §15.9).** `LOOKUP_HEADERS` gains `errorCode` / `errorDescription`; new row-aligned `readLookupMap()` builds `model.errorTable` from `Code!Q:R`; every issue carries `desc`; the validation panel gains a deduplicated **Rule reference** list plus a tooltip on each rule code; `renderCodeMap()` reports where the Error table lives; new **V-21** warns — never errors — when a fired code has no row in the table. Also: `isIssued()` lost its dead `statusCategory` branch (I-49 residue) and now canonicalises the status first (**I-53**). |
| 1.10 | 2026-09-16 | UI Design | **I-51 re-verified — the first *executed* run of the harness caught two defects in the I-49/I-51 window (archived workplan §15.10).** (1) The I-51 regression test asserted `Array.isArray(...)`, which **passes on an empty array** — it could not fail, so "categoryCode now resolves" was unverified for two revisions. It now asserts the real contract, and the finding was that **`Code!N` (Category Code) was header-only at the time** — an empty `lookups.categoryCode` was *correct*, a worksheet gap not a code bug. (2) `renderCodeMap()` printed `Item Category: col O · code col N · 19 values`, crediting the **blank** code column with the description column's count; `lookupMeta` now carries `codeN` and a blank code column renders **`(empty)`**. Harness **42 → 46 assertions, all passing**. **No chart/KPI change.** |
| 1.11 | 2026-09-16 | UI Design | **Pending-issue audit (archived workplan §15.11)** — every table swept for non-closed rows. The single decision item (I-05b / V-22) was surfaced here and then resolved by the workbook owner. **Zero decision items remain; 6 parked backlog + parser rails.** Recorded explicit **non-issues** (V-08 ×119, V-20 ×1) so they stop being re-raised. |
| **1.12** | **2026-09-16** | UI Design | **I-05b closed on the workbook side (archived workplan §15.11 A).** `Category Code` (N) now carries real values and `Lead Time` is confirmed **days** — column K re-headed `Estimate Lead Time (Days)`, numeric in every cell — so the Lead Time chart reads real durations instead of sinking into *"Not set"*, and **V-22 is not needed for this workbook**. The parser's number branch gained a comment documenting that it reads the cached `<v>` and deliberately never evaluates `<f>` (formula-caching behaviour, its limits, and the V-04 surfacing path are all recorded). **Behaviour unchanged** — the code edit is a comment; **VERIFICATION PENDING** (shell unavailable). |
| **1.13** | **2026-09-16** | UI Design | **Dead-code cleanup (archived workplan §15.12) — I-25 closed, and I-12 found stale.** `normPerson()` deleted (defined, never called). **The real defect was not the helper but V-12 itself: it was unreachable by construction** — the engineer tally stored a raw string in a Set keyed by that same raw string, so every Set held exactly one member and `size > 1` could never hold. V-12 now keys **loosely** (collapsed slash + whitespace) while the Set holds **distinct raw spellings**, so variants like `Dilip/Siva` vs `Dilip / Siva` are reported, with genuinely different names kept separate. Verified **not** dead and left alone: `TYPE_ALIASES` / `normType` (used by `parseFieldTypes`). Harness gains **4 V-12 assertions** (both directions + the shipped workbook must stay clean). **VERIFICATION PENDING** (shell unavailable). |
| **1.14** | **2026-09-17** | UI Design | **I-26 re-scoped; half (a) closed, half (b) refuted (archived workplan §15.13).** The row bundled two claims. **(b) "bar-mode Copy/Download target `svg-eng` does not exist" is FALSE** — `renderCat()` passes `svgId:meta.svg` to **both** renderers and `svgHBar()` honours it, so the bar-mode SVG exists; the five button `data-svg` values match `METRICS[].svg` one-for-one and the buttons sit **outside** the container that `innerHTML=` replaces. It described **pre-Rev-1.1** code, already fixed by Wave 0 (I-44). **(a)** the pie cap `8` is now the token **`CHART.pie.topN`**, and the merged slice carries **`otherLabels`** so a tooltip lists the names it swallowed — **visible label text deliberately unchanged**. Also removed a trailing `.filter(i=>i.value>0)` that was a provable no-op (dead decoration that read like a guarantee). Harness gains **7 assertions**. **VERIFICATION PENDING** (shell unavailable). |
| **1.15** | **2026-09-17** | UI Design | **Regression harness corrected (archived workplan §15.14) — no dashboard code changed.** The first *executed* run of the Rev 1.13/1.14 harness (user-run: **55 passed, 4 failed of 59**) showed all 4 failures were **stale test assumptions, not code defects**. The workbook's `Category Code` (N) is now populated (19 values), so three assertions that had encoded "Category Code is blank" (`category.codeN === 0`, `code col N (empty)`, "no `code col N (\d+)`") were wrong; and the V-12 assertion wrongly expected `Dilip/Siva`, `Dilip / Siva` **and** `Siva /Dilip` in one report line, but a reversed name is a separate loose key and a singleton, correctly left un-flagged. `renderCodeMap()` / `lookupMeta` re-read to confirm the rendered `code col N (19)` is N's *own* count. Four assertions corrected; the `(empty)` guard stays in the dashboard code for any future empty column. Re-run → **all 59 pass, 0 failed**. |
| **1.16** | **2026-09-17** | UI Design | **V-22 implemented (archived workplan §15.16) — the last validation gap (empty lookup code column fires a warning).** `validate()` now emits **V-22** (warning, app-only) when a lookup block's code column is located but empty while its description column carries values. Three harness assertions added (**63 total**). Dashboard code verified on disk (rule present immediately after the V-18 loop); end-to-end run **pending** (shell unavailable) — expected **63 passed, 0 failed**. |
| 1.17 | 2026-09-24 | verification | **End-to-end harness executed and green — closes the test items (see archived workplan §15.16 §E / archived workplan §15.11 §D).** `node test/test_pipeline.mjs` runs the *shipped* script against the *real* workbook: **63 passed, 0 failed**, 14 chart renders, zero uncaught throws. Closes **I-24** (the regression harness now exists and runs), **P-4** (self-closing-cell fixture exercised by the real workbook's 1818 empty styled cells), **P-5** (the harness is the openpyxl-equivalent golden cross-check). **P-3 remains open** — the cell-count invariant needs a code change in `parseSheet()`, not covered by the harness. All prior "VERIFICATION PENDING" flags are superseded. |
| **1.18** | **2026-10-02** | docs · review | **archived workplan §15.17 independent review logged; `codecheck.md` retired (stub only).** All original codecheck findings remain in archived workplan §14 (I-42…I-48). New backlog: **I-55** (criticality chart buckets by code while PPP may store descriptions), **I-56** (CSV load without Code sheet), **I-57** (category filter "none selected" → empty dashboard), **I-58** (`esc()` omits `"` in HTML attributes), **I-59** (welcome copy missing space after `</b>`). **No dashboard code changed.** |
| **1.19** | **2026-10-03** | UI Design | **Bug repairs — I-55…I-59 closed.** I-55 / I-57 / I-58 / I-59 were resolved in commit `8f929a6` and are now reflected in §7 (dual-match criticality via `critItems()`, empty category filter → "all", `esc()` escapes `"`, welcome space added). **I-56 fixed this revision** in `Procurement-Dashboard.html`: `handleFile()` now rejects `.csv` up front with a clear message ("CSV export cannot be re-imported — it contains only the Package Plan, not the Code sheet… load the original .xlsx workbook"); the file input `accept` is limited to `.xlsx` and the welcome copy no longer advertises CSV. No chart / KPI / validation logic changed; the `parseCSV()` helper is retained for a possible future Code+PPP pair import. |
| **1.20** | **2026-10-10** | UI Design · docs | **Shared-design standardisation (spec rev 2026-10-10) — PPP is now the canonical reference for two shared designs.** **(a) §7.5 Top-bar filters:** PPP's design is the standard — master "All [dimension]" checkbox (no Clear button), badge `All [dimension]` / `N of M selected` / `None selected`, `.is-filtered` accent, a single one-line dismiss hint, re-render deferred until the dropdown closes, excluded values not offered, empty selection = zero rows, AND-combined atomic pass. MDL was rebuilt to match (**MDL I-61/I-60**). PPP's *own* remaining deltas are re-filed in **I-75**: deferred re-render, dismiss hint, `.active` → `.is-filtered`, and **reversing I-57 so empty = zero rows** (the All/Clear-button variant described by the old I-75 is retired). **(b) §3.5 System / Config warning bar:** PPP's unified fixed `#errBanner` (three severity tiers, unified with load failures, `role="alert"`, `body.banner-open` + `--banner-h` clearance) is the standard; **PPP already conforms — no PPP code change required**; MDL was rebuilt to match (**MDL I-62**). Spec updated in the same pass: §3.5 and §7.5 rewritten to single canonical variants (rev 2026-10-10), §7.10 errBanner note, archived workplan §12.1 governance (standardisation rule + cross-document update rule), and the stale archived workplan §13.3 "System banner" / "Filters" rows + the "unused `.sys-banner-item.warn`" cleanup bullet corrected. **No PPP dashboard code changed in this revision.** |
| **1.22** | **2026-10-15** | docs | **I-76 filed — pipeline modularisation backlog.** PPP remains a monolithic single-file HTML; `buildModel` / `validate` / `render` stages exist logically but are not importable as Node modules. This blocks full Tier 3 data verification in the `harness-layout` tool and prevents independent pipeline unit testing equivalent to MDL's `test/test_pipeline.mjs`. Logged as **I-76** in §7. No code changed. | — `Dashboard-UI-Design-Spec.md` updated to v1.1.** All project-specific content (MDL variant blockquotes, PPP function names, MDL issue cross-references, dashboard-specific panel numbers, PPP-specific horizon options, MDL sub-tier KPI field references, stale B4 non-compliant note, `mdl_hideWarnings` key, PPP dark-theme reference) removed or generalised. Zero contradictions with this workplan — all PPP-specific content remains correctly documented here. **No PPP dashboard code changed.** |
  (`harness-layout/checks/ppp.mjs`); PPP runs `chrome.controlContrast: true` (hard) since P8.
| **1.24** | **2026-10-21** | docs | **I-78 filed — PPP text-action classes are now non-conforming against shared spec §7.1 A3.** The spec was made normative on 2026-10-20 (MDL I-71): `.btn-secondary` is the canonical A3 class for every text action. PPP still ships `.dlBtn` / `.copyBtn`, now recorded as **legacy, non-conforming aliases** with a required migration and a bar on any new control using them. The styles currently resolve identically, so there is **no visible defect** — the risk is latent drift, because the class name is the only link between a rendered control and its governing spec rule. Logged in §7 as **Backlog — deferred 2026-10-21**, to be processed later. MDL I-71 remains `OPEN` pending this. **No PPP dashboard code changed.** |
| **1.26** | **2026-10-22** | docs · UI Design | **Shared spec generalised (v1.2 → v1.3) — PPP-specific content moved here.** `Dashboard-UI-Design-Spec.md` is now project-neutral; it gained §0 **Definitions**, §8 **Conformance & Testing** (two-layer check model, 14 required assertions, enforcement posture, conformance record, definition of done) and archived workplan §9 **Adopting this spec**. Everything belonging to PPP alone now lives in **§8 Shared-Spec Conformance Record**: PPP's dashboard-specific choices (§8.1 — `.card`, inline nav, its own status vocabulary, advisory enforcement posture), its role as the origin of two shared rules (§8.2 — A4 icon geometry and the A3 migration, I-78), its migration state (§8.3 — conforming on A3, **non-conforming on §7.2.15 split header**, one advisory contrast finding I-77), its chart specifics (§8.4) and its evidence (§8.5). |
| **1.25** | **2026-10-21** | dev · docs | **I-78 closed — PPP migrated to the canonical A3 class.** `.dlBtn` / `.copyBtn` renamed to `.btn-secondary` in `Procurement-Dashboard.html` (markup L402, L1557–1558; delegated handler L2104) and the old names deleted. Two points beyond a plain rename: (a) the delegated handler now keys on `data-act="copy"` / `data-act="dl"` instead of the class, because one shared class cannot discriminate the two actions — behaviour belongs on a data attribute, presentation on the class; (b) `.btn-secondary` was joined to PPP's existing A3 rule (L141 + `:hover` L146) so the shared class actually governs styling rather than sitting decorative. Declared values were already identical, so **no visual change**. Shared spec §7.1 A3 updated: the legacy-alias row is gone and a "Migration — completed 2026-10-21" note records both consequences. Verified `MDL/test/test_grid.mjs` **43/43** and `harness-layout --dashboard ppp` **87 / 19 / 1 / 11** = baseline. Note the PPP harness is mildly flaky run-to-run on the I-77 contrast advisory (1 of 9 runs reported 88 passed / 0 advisory); measured 6/6 stable at baseline afterwards, so it is pre-existing raciness, not this change. **MDL I-71 closed as a result.** |
| **1.27** | **2026-10-29** | docs · UI Design | **I-79 filed — PPP expandable / drill-down design must be updated to the standardized spec §4.4 / §7.1 B4 model.** Spec rev 1.39 (2026-10-29) makes the drill-down normative: `.expandable` owner row; real `<button class="drill-btn">` (an `.icon-btn` variant) carrying `aria-expanded` + `aria-controls`; `.drill-chev` rotated 90° when expanded (no glyph swap); sibling `.sub` detail with `.sub-inner`; accordion (one open at a time); keyboard Enter/Space; delegated listener; and `--line` / `--soft` / `--muted` / `--navy` / `--blue` tokens. PPP's current `Overdue by Stage` drill-down uses `<td class="ovl-chev">` with `aria-expanded` on the `<tr>` (now forbidden by §7.1 B4), and hard-coded `#f3f7fc` / `#fafbfc` colours. Migration: replace the `td` chevron with `.drill-btn` / `.drill-chev`, move `aria-expanded` onto the button, rename `.ovl-detail` → `.sub` / `.sub-inner`, and swap colours to tokens. Logged as **I-79** in §7 (Backlog). **No PPP dashboard code changed.** |
| **1.28** | **2026-10-30** | dev · docs | **"PO Number" registered as a contract field.** The workbook gained `PO Number` = `Column-M` (`Text`) in the Code sheet at **row 22**; every later Group-1 row shifted one row down (Supplier now row 23 / `Column-N`, ROS Actual Date now row 41 / `Column-AF`). Because the parser is label-driven, the column shift needs no code change — but a new label is inert until `CODE_SHEET_KEYS` names it. `poNo:'PO Number'` was therefore added to `CODE_SHEET_KEYS` in `Procurement-Dashboard.html` (Rev 1.28 header comment added). Kept as `Text` so leading zeros survive; not added to any view, export, KPI or validation rule (deferred as **I-81**). §4.1.1 regenerated from the workbook, which also corrected two stale cells (`Dashboard Title` row 6 was missing; Project Start Date is `2026-03-19` / serial 46100). Harness gains one assertion: **64 passed, 4 failed** — the 4 failures are the pre-existing `MR-M-0021` date defect (**I-80**). |
| **1.29** | **2026-10-30** | dev · docs | **I-80 resolved — workbook data fixed; harness green.** The data owner corrected `PPP!AD22` (ROS Plan Date) from `1900-01-15` to `2027-01-15` and `PPP!AA22` (FAT Plan Date) from `1899-12-15` to `2026-12-16` on `MR-M-0021`. Only these 2 cells differ from the previous workbook. The updated master is now synced into the repository. `node test/test_pipeline.mjs` gives **68 passed, 0 failed** with `errors=0`; the four assertions that failed at Rev 1.28 now pass. No code changed. §7 I-80 closed; TL002 and U006 record the evidence. |
| **1.30** | **2026-10-30** | docs | **I-81 approved — V-26 added to §6 (workplan only).** Business rule confirmed by the owner: a **PO Actual date** is the only evidence that a package has a PO issued, and an issued package must carry a **PO Number**. PO Number therefore has no role in the look-ahead or overdue tables, because those list packages without a PO issued; no table column, CSV column or KPI change is planned. New rule **V-26** (warning, data): PO Actual is set and PO Number is blank. **Rollout order is mandatory:** the owner adds the Code sheet row (`Q27:V27`) first, then the `validate()` rule follows — an implemented rule with no Error-table row raises V-21. First run is expected to report **19 warnings** (19 of 129 packages have a PO Actual date; column M is empty). Severity stays warning until the column is filled. §6 heading, §0 index and the status line updated. **No dashboard code changed.** |
| **1.31** | **2026-10-30** | dev · docs | **I-81 implemented — V-26 is live.** Added `V-26` to `validate()` as a per-package rule: `poActual` is a valid Date and `poNo` is blank → warning "PO Actual date is set but PO Number is blank". The Code sheet row `Q27:V27` is present, so V-21 does not fire. Harness gains 3 assertions (count matches the issued-and-blank set; warning only; no false positive when a PO Number exists) and passes **71/71**. Current result: **19 V-26 warnings, 0 errors**. No table, CSV or KPI change; PO Number stays out of the look-ahead and overdue tables by design. §6 note, §7 I-81 and the status line updated. |
| **1.32** | **2026-10-30** | docs · UI Design | **Shell sample study for review — no PPP code change.** The root spec shell (§3.1 title bar, §3.2 menu bar + left sidebar, §3.3 content) was studied and rendered as a review-only sample: `harness-layout/samples/dashboard-shell-sample.html` Rev 1.1. Measured: title bar 77.7 px, menu bar 49 px, sidebar 190 px, status bar 30 px, KPI card 72 px, no content toolbar, no horizontal overflow at 1440 and 1280. Harness `_shellreview`: Tier 1 **8 passed / 0 failed / 1 skipped**, Tier 2 **23 passed / 0 failed**. Findings: the spec sidebar 160 px wraps the real label "Forward and Overdue" (needs about 179 px), so the sample uses 190 px; six clauses disagree with `AGENTS.md` §18 (Settings/Help, file loading, content toolbar, layout toggle, theme picker, panel-title weight); the spec itself gives panel titles as 700 in §4 and 600 in §6. **PPP impact:** adopting this shell retires PPP's inline navigation (the §8.1 choice) and adds a left sidebar and a menu bar. Decisions D1–D7 are open; see **§8.6**. |
| **1.33** | **2026-10-30** | docs · UI Design | **Data pipeline status confirmed for review — no code change.** Checked PPP against the mandatory pipeline in spec §3.8. Result: the spec pipeline is **not created**. PPP is one inline script; there is no `src/`, no `pipeline.js` / `xlsx-reader.js` / `render.js`, and no build script, so `harness-layout/checks/ppp.mjs` keeps all module paths `null` (I-76) and Tier 3 stays at file-drop simulation. Stage logic exists only inside the HTML. The §3.8.2 rules mostly hold (single `STATE`, validate once, no re-parse on filter, as-of from local date parts, label-driven contract), but **§3.8.4 blank / formula-error normalization is absent** (no `isExcelError`, no `W-FORMULA` notice), the §3.8.1 S4/S5 split is missing, and the §3.8.5 test imports nothing (it runs the inline script in a VM). New **§8.7** records the clause-by-clause status. I-76 needs a decision before implementation. **No PPP dashboard code changed.** |
| **1.34** | **2026-10-30** | docs · UI Design | **Pipeline build plan for review — no code change.** The owner approved the build in principle. New **§8.8** defines the target structure (`src/xlsx-reader.mjs`, `src/pipeline.mjs`, `src/render.mjs`, `build.mjs`, `test/test_build.mjs`), maps every current function to its module and stage, and gives five phases with 16 tasks: P1 extraction (behaviour-preserving), P2 `deriveView` + stage error boundaries, P3 `isExcelError` + `W-FORMULA`, P4 import-based tests + harness module paths, P5 documentation. Acceptance criteria, risks and decisions D8–D11 are recorded. I-76 becomes `APPROVED` when this plan is approved. **No PPP dashboard code changed.** |
| **1.58** | **2026-11-01** | code | **P8.6 complete - search column picker (I-100).** The search panel is one row with an attached B5 picker (All columns, Title, Package no., Discipline, Item category, Status), a flexible input and the A5 submit; the query is scoped to the chosen column, the choice persists (`ppp-search-field`) and the chip names the column. Spec §7.1 gained the normative composition rule (revision 1.55) and §8.2 assertion 20. Verified **292 assertions, 0 failed**; "mechanical" gives 25 / 23 / 2 / 0 across All / Discipline / Title / Status; 0 console errors; Tiers 2-4 pass; screenshot `p8_6_search_column.png`. Report: `workplan/reports/P8_6_search_column_report.md`. |
| **1.57** | **2026-11-01** | code | **P8.5 complete - category filter and search compliance (I-99).** Trigger: text + count badge, 12 px / 600, borderless, no caret, `is-filtered`; panel: master, note, divider, scrollable list, footer with count and Reset. Search: affixed 36 px accent submit, white glyph, right-rounded, Enter applies. Help copy follows the new label. Verified **286 assertions, 0 failed** (six new control assertions); Tier 2 23/0, Tier 3 3/0, Tier 4 78/0; screenshots `p8_5_filter_panel.png`, `p8_5_filter_search.png`. Report: `workplan/reports/P8_5_filter_search_report.md`. |
| **1.56** | **2026-11-01** | code | **P8.4 complete - responsive reflow (I-97, I-98).** Panels gained `min-width:0`; the PO chart is drawn at its host width and redrawn by a `ResizeObserver`; the validation table uses percentage columns; control-row text truncates; below 820 px the sidebar collapses instead of being hidden, and the menu-bar toggle opens it. Spec §3.4.1 gained the screen-change/resize clause (spec rev 1.54). Verified **280 assertions, 0 failed**; 24 page x width combinations with zero overflow and zero split-header delta; Tier 2 23/0, Tier 4 78/0; screenshot `p8_4_narrow.png`. Report: `workplan/reports/P8_4_responsive_report.md`. |
| **1.55** | **2026-11-01** | docs | **Spec §4.7 dedicated panel-spacing section; no code change.** The shared UI spec now states the panel gap as its own normative section (§4.7): 14 px between top-level panels on both axes, container `gap` or the panel margin but never both, never 0, hidden panels add nothing, print keeps it, and card spacing inside a panel stays separate (16 px charts, 12 px validation). §8.2 assertion 19 cites §4.7. The P8.3 implementation already meets it (measured 14 px on three pages).
| **1.54** | **2026-11-01** | code | **P8.3 complete - panel separation (I-96).** The content column became a single-column grid with a **14 px** gap (the spec panel margin), so two panels on one page never touch; hidden pages add no gap. Card spacing inside panels was confirmed (16 px between chart cards, 12 px between validation cards). Spec §4 made the separation normative and §8.2 gained assertion 19. Verified **275 assertions, 0 failed**; measured 14 px on Overview, PO Schedule and Data Quality; Tier 2 23/0, Tier 4 79/0; screenshot `p8_3_panel_gaps.png`. Report: `workplan/reports/P8_3_panel_gaps_report.md`. |
| **1.53** | **2026-11-01** | code | **P8.2 complete - notice area pinned below the menu bar (I-95).** The system notice area moved out of the scrolling body into the content column as its first block: directly below the menu bar, above the filter strip and above the page body, so panel scrolling never moves it. Fixed/sticky rules and welcome offsets removed. Spec §3.5 made the placement normative and §8.2 gained assertion 18. Verified **272 assertions, 0 failed**; Tier 2 23/0 (warning area inside content width), Tier 4 79/0; screenshot `p8_2_warning_bar.png`. Report: `workplan/reports/P8_2_warning_sticky_report.md`. |
| **1.52** | **2026-11-01** | code | **P8.1 complete - chart hover corrections (I-93, I-94).** The PO chart host no longer shadows the per-point payload: one full-height band per month carries the month payload and a snap position, and the bar charts gained a full-row band. A dashed `.chart-snap` line now appears in the hovered chart and follows the month, hidden on leave, blur and scroll. Verified **269 assertions, 0 failed**; Chromium confirms the window changes across three months and the line moves; screenshot `p8_1_po_snap.png`. Report: `workplan/reports/P8_1_hover_fix_report.md`. |
| **1.51** | **2026-11-01** | code | **P8 complete - UI conformance follow-up.** Four-page routing (Overview, PO Schedule, Overdue, Data Quality), one floating detail window for chart points and KPI cards (mouse, keyboard, touch; native SVG titles retired), the full validation list with fixed-size severity icons, a column control with its own class and visible state, the 26 px expander and the horizon/menu contrast fix with control contrast now enforced hard. Verified **263 assertions, 0 failed**; Tier 1 9/0, Tier 2 23/0, Tier 3 3/0, Tier 4 **79/0 with 0 advisories** (three pages measured); 0 console errors; seven screenshots. D22-D26 confirmed; I-84 to I-90 and I-92 aligned, I-91 not adopted. Report: `workplan/reports/P8_ui_followup_report.md`. |
| **1.50** | **2026-11-01** | docs | **P8 planned (§8.9) — no code change.** New phase for the 2026-11-01 UI review: nine tasks (T8.8.25–T8.8.33) covering chart and KPI hover detail with keyboard and touch, page routing with a smaller menu, the full validation list, fixed-size severity marks, component polish, the horizon contrast fix, and conditional frozen columns. Each task lists issues, size, dependency and deliverable; milestones M1–M5, risks, acceptance criteria and references are recorded. Progress table and scope summary point at P8. Decision register gains D22–D26 as pending confirmations. |
| **1.49** | **2026-11-01** | docs | **Workplan restructured; issues moved to the canonical log; design brought up to date.** Document ID added; contents corrected; scope summary (§9), file reference (§10) and decision register (§11) added. KPI cards, chart inventory, PO combined chart, look-ahead rendering, overdue and validation panels corrected to the shipped UI; retired cards labelled. Issues I-01–I-81 moved to `log/issue_log.md` (verbatim) and §7 reduced to a pointer. General-rule subsections §8.2 and §8.6 removed (normative text in the spec; verbatim in the archive). The pre-1.49 status narrative and the dead contents entries are preserved in Appendix A and B. No code, test or harness change. |
| **1.48** | **2026-11-01** | code | **P7 complete — split-header contract.** `src/render.mjs`: `splitTable()` emits `.ds-split.splitcard` → `.vheadwrap` + fragment + `.tableScroll` body, with a trailing `<col class="ds-gut">` and `<th class="ds-gut">`; new `syncSplitTable()` / `syncAllSplits()` pin the fragment width to `body + scrollbar`, copy the body column widths, hand the remainder to the gutter, keep `--ds-sbw` current with a `ResizeObserver` and follow the body scroll; called from `render()`. Header cells gain the 1 px `::after` column rule and `position:relative`; the overdue drill header is centred like its cells. `checks/ppp.mjs` declares `headerFragmentSelector`, `splitHeader`, `inlineClassicScript` and `minGridTables: 0`. `harness.mjs` accepts a declared inline classic script, scopes sticky to `.tableScroll`, exempts split bodies from the header-height rule, and compares fragment width to body + `--ds-sbw`. Verified: **236 assertions, 0 failed**; **Tier 1 9/0, Tier 2 23/0, Tier 3 3/0, Tier 4 85/0** (1 advisory); split headers measured 0 px gap, 0 px alignment delta, no overflow. Report: `workplan/reports/P7_split_header_report.md`. |
| **1.47** | **2026-11-01** | code | **P6.4 complete — conformance record and five themes.** `Procurement-Dashboard.html` gained `sky`, `ocean` and `presentation` token blocks; the dark block now remaps `--surface`, `--border`, `--text`, `--row-stripe`; twelve `color:var(--navy)` component rules became `var(--ink)`; `--border` is used by the KPI card. `src/render.mjs`: `THEMES` (five values), `applyTheme()` validates and applies any theme, the Settings modal offers five options, and boot restores the saved theme. §8.9 is the conformance record: generic checks and posture, the 17 §8.2 assertions, and four deviations with end states (sticky-`thead` check vs split header; I-95 grips; module-script marker vs D8; split-header pairing unverified). P6 is complete; P7 is planned for the deviations. Verified **236 assertions, 0 failed**; five-theme screenshots at 1440 (and 1280 presentation); 0 console errors; Tier 2 23/0, Tier 4 70/9. Report: `workplan/reports/P6_4_conformance_report.md`. |
| **1.46** | **2026-11-01** | code | **P6.3 complete — KPI §5, tokens §6, components §7.** `render.mjs` KPI data now carries a status class (`ok`/`amb`/`warn`) and no sub-line; `renderKPIs()` writes `<div class="kpi ok">` with exactly `.v` and `.l`, no inline colour. CSS: `.kpis` is `repeat(auto-fit,minmax(210px,1fr))`, `.kpi` is 72 px box-sizing with a 3 px status strip and 8 px radius, `.v` is 22 px/700, `.l` is 10 px/400 uppercase with no line-height override, `.muted`/`.err` strips added, panel `h2` is 600. Colour literals in component rules became tokens (`--on-navy`, `--on-navy-soft`, `--navy-dark`, `--text2`, `--row-stripe`, `--err`); `--font-ui` holds the shared font stack. `.csv-btn` is retired: all four CSV buttons are `.btn-secondary` with `data-act="csv"`. Verified **232 assertions, 0 failed**; KPI cards measured 72 px, two children, 0 `.s`; icon buttons 26x26; 1440 light and dark screenshots; 0 console errors; Tier 2 23/0 and Tier 4 unchanged at 70/9. Report: `workplan/reports/P6_3_kpi_report.md`. |
| **1.45** | **2026-11-01** | code | **P6.2 complete — panels §4–§5.** All seven panels are direct children of `#dashBody`, each with a title row (Help `?`, Collapse `−`) and a DOM-order panel number; the collapse state persists across filter, search and reload. Charts sit in `.c-card` surfaces with their controls above the plot; the benchmark table is rendered by `renderBenchmark()` from `BENCH_ROWS` instead of static markup. Look-ahead, overdue, validation and benchmark use `splitTable()` — a fixed header plus a 340 px scroller — with row counts and CSV buttons (`overdueCsvRows`, `benchCsvRows`; both exported and tested). Overdue drill-down is a real button with `aria-expanded`/`aria-controls`, a rotating chevron and one open row; the detail row is a sibling `.sub` > `.sub-inner`. Validation: no `<details>`, `.v-summary` (`#vcount` + chips + code map), a Rules table (Sev/Code/Group/Description/Count), an issue card with `#vCols` (6 → 4 → 6 columns) and the `#vsub` row count. Table CSS now uses `table-layout: fixed`, 40 px rows, and ellipsis truncation. Verified: **37 + 71 + 22 + 19 + 76 = 225 assertions, 0 failed**; Chromium at 1440 (light and dark) — 0 console errors, panels numbered 1–7, one drill row open, split header pinned while the body scrolls; Tier 1 **8/1**, Tier 2 **23/0**, Tier 3 **3/0**. Tier 4 table chrome (not in the P6 baseline) improved from **23 fails at HEAD to 9**; the 9 remaining are the split-header-versus-sticky-header conflict and the I-95 resize grips — carried to P6.4. Report: `workplan/reports/P6_2_panels_report.md`. |
| **1.44** | **2026-10-30** | code | **P6.1 complete — shared shell.** Replaced the single-row header with the spec shell: three-row title bar (project, dashboard, dates, active page right), one-row menu bar (Load primary, Export menu, category filter, Search popover, Warnings toggle, KPI density toggle), 160 px navy sidebar (page links; Settings and Help pinned to the bottom; resizer; toggle in the menu bar) and a full-width status bar. The warning area moved inside the content zone and gained a stable marker. Search is a real S4 filter (D12); Export offers validation and look-ahead CSV (D13); the layout toggle cycles KPI density 6/3/2 (D14). S1/S2 load errors now show on the welcome card. Verified: 212 assertions, 0 failed; Chromium screenshots at 1440 and 1280; Tier 1 **8/1** (module-script marker only, conflicts with D8) and Tier 2 **23/0**; Tier 3 **3/0**. Remaining P6 work: panels §4–§5 (P6.2), KPI/tokens/components §5–§7 (P6.3) and the §8 conformance record (P6.4). Report: `workplan/reports/P6_1_shell_report.md`. |
| **1.43** | **2026-10-30** | docs | **P6 opened — decisions and sub-phases (no code change).** Owner decisions: **D12** Search filters the package set (title, package number, discipline, status, combines with the category filter); **D13** Export offers both existing CSVs (validation, look-ahead); **D14** the layout toggle cycles KPI density 6 → 3 → 2 and persists. P6 is now four sub-phases: P6.1 shell (T8.8.18), P6.2 panels (T8.8.19), P6.3 tokens/components (T8.8.20), P6.4 conformance/screenshots (T8.8.21). P6 is `IN_PROGRESS`; P6.1 is next. The shell change is large and visual, so each sub-phase is verified before the next starts. |
| **1.42** | **2026-10-30** | docs | **P5 complete — close-out.** §8.7 now records **CONFORMING to §3.8** with the evidence: modules and generated standalone page, single `deriveView`, paint-only S5, one `STATE`, per-stage boundaries, §3.8.4 normalization, 212 assertions and Tier 3 ground truth. Acceptance criteria 1–4 are ticked; criterion 5 stays open because it includes harness Tiers 1–2, which are the P6 shell work. `knowledge.json` is raised to 1.14.0; the issue, test and update logs are aligned; the close-out report is added. **No code change.** |
| **1.41** | **2026-10-30** | code | **P4 complete — five-layer test suite.** New `test/test_units.mjs` (37), `test/test_edges.mjs` (22), `test/test_build.mjs` (19) and `test/test_panels.mjs` (63). `test/test_pipeline.mjs` now imports `src/` instead of extracting the built script; the 71 assertions are unchanged. `dev`/`render` export what the tests need; `lookCsvRows` / `validationCsvRows` / `rowsToCsv` are pure helpers so the CSV content is testable. The KPI row no longer prints NaN when a filter matches nothing (I-82). `harness-layout/checks/ppp.mjs` sets the four module paths and supplies a `groundTruth` adapter; `harness.mjs` supports such an adapter without changing the MDL path. Results: **37 + 71 + 22 + 19 + 63 = 212 assertions, 0 failed**; Tier 3 for PPP **3 passed, 0 failed** (KPI 129, filter 5, status bar). Tier 1 (6/3) and Tier 2 (1/10) still fail on the shell zones, sidebar and module-script marker — P6 scope; the module-script check conflicts with D8’s single inlined file. Report: `workplan/reports/P4_test_suite_report.md`. |
| **1.40** | **2026-10-30** | code | **P3 complete — value normalization (§3.8.4).** Added `isExcelError()` with the ten tokens (case-insensitive) and `isAbsent()`. S2 now writes `undefined` for a missing, blank-after-trim or formula-error cell in every column; the raw cell stays in `_raw`. Error-token cells are counted per field (`model.formulaErrors`) with the field label and the resolved column letter. S3 emits one fatal `W-FORMULA` per affected column into `report.warnings` and `model.warnings` — never into `issues`; the banner shows it as a fatal strip and the load continues. Tallies skip absent values. Verified: **71 passed, 0 failed**; 10-token unit checks pass; a corrupted workbook gives two W-FORMULA notices, both fields `undefined`, the banner strip present and `#dash` visible. Visible change: Started is now 69% (88 of 128 packages with a status; one blank status is excluded) and the empty Criticality bar is gone. Report: `workplan/reports/P3_normalization_report.md`. |
| **1.39** | **2026-10-30** | code | **P2 complete — stage separation and error boundaries.** `deriveView(model, STATE)` is the single S4 step and returns `{active, catList, status, kpis, issues, panels:{interactive, po, look, overdue}}`. Every count, percentage, average, chart item, table row and validation tally is computed there; `render()` repaints from that view only and the per-panel calculations are deleted. `STATE` gained `view` and `poWin`, and absorbed the last module-level values (`PO_SHOW_BARS`, `LOOK_LAST`, `OVL_STAGE`, `pppScurveWin`, `pppScurveProgress`). `STAGES`, `todayMidnight`, `stageDue`, `stageIsOverdue` moved to `pipeline.mjs`, which they used as implicit globals. S3 failure now keeps `#dash` visible; S4 and S5 have their own boundaries. Verified: **71 passed, 0 failed**; unchanged KPIs (129 / 68% / 19 PO / 0% delivered), 101 data warnings plus the V-20 system notice, look-ahead 64 rows, overdue MR 73; filters, saved prefs, drill-down, chart breakdowns, bars toggle and the PO window behave as before; no console error. Report: `workplan/reports/P2_derive_report.md`. **No visual change.** |
| **1.38** | **2026-10-30** | code | **P1 complete — pipeline extraction, no behaviour change.** Added `src/xlsx-reader.mjs` (S0/S1), `src/pipeline.mjs` (contract, S2, S3) and `src/render.mjs` (S4–S6, `boot`) plus `build.mjs`, which strips imports/exports, parses-checks the bundle with `vm.Script`, and replaces the inline script in `Procurement-Dashboard.html`. The three modules import cleanly in Node; `render.mjs` has no top-level DOM side effect because all wiring moved into `boot()`. Verified: **71 passed, 0 failed**; 96 of 96 functions preserved (plus `boot`); page loads from `file://` with no console error and no network; KPI values (129 packages, 68% started, 19 PO issued) and the 19 V-26 warnings are unchanged. Build is idempotent. Report: `workplan/reports/P1_pipeline_extraction_report.md`. **No visual change.** |
| **1.37** | **2026-10-30** | docs | **D9 and UI scope confirmed — no code change.** D9: the complete test must **cover all panels** — a fifth layer (T8.8.15) compares Panels 1–7 and every filter with `deriveView` ground truth, including the CSV export; harness moves to T8.8.16. UI: the root `Dashboard-UI-Design-Spec.md` is **authoritative for every dashboard**. D1–D7 therefore resolve to the spec (§8.6): 160 px sidebar, Settings/Help at the sidebar bottom, Load in the menu bar, no content toolbar, layout toggle at the menu-bar right end, theme in Settings, panel title 600 (§4's 700 noted as a spec typo). New **P6** (T8.8.18–T8.8.21) brings the shell (§3.1–§3.7), panels (§4), KPI strip (§5), tokens (§6) and components (§7) to the spec; the `AGENTS.md` §18 reconciliation is a separate documentation change. I-76 now carries tasks T8.8.1–T8.8.21. **No PPP dashboard code changed.** |
| **1.36** | **2026-10-30** | docs | **Owner decisions D8–D11 recorded — no code change.** D8: the page is standalone (no HTTP server, no external reference); `build.mjs` is a dev-time packager only. D9: the test must be complete — four layers in T8.8.12–T8.8.15 (unit, integration, built artifact from `file://`, harness Tiers 1–3). D10: the duplicate aggregation engine is removed; every count is computed once in S4, and the old per-panel paths are deleted. D11: an error token is never text — it is absent data, excluded from every count, and reported by `W-FORMULA` in `#errBanner` without blocking the load. A **UI design constraint** note is added: the refactor changes no visual element, and shell adoption (D1–D7) stays separate. **I-76 moves to APPROVED** with tasks T8.8.1–T8.8.16. **No PPP dashboard code changed.** |
| **1.35** | **2026-10-30** | docs | **Pipeline decision rationale added — no code change.** §8.8 gained a "Reasoning" subsection for D8–D11: the exact clause conflict and the consequence of each option. D8 explains §3.8.0 versus §3.9 (module imports versus one inlined file) and why a stdlib-only `build.mjs` is not the bundler the clause forbids; D9 explains why the regex/VM test must be replaced instead of kept; D10 explains why a thin adapter still fails the single-aggregation rule; D11 explains why an error token is a fatal banner, not a validation warning, and that it must not hide the dashboard. **No PPP dashboard code changed.** |

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
| `svgStage(pkgs)` | — | **Removed** — Stage Plan Coverage retired (consolidated into interactive panel, archived workplan §16.7-F) |
| `renderPOMonthly(pkgs)` | L918 | Monthly grouped bar: PO Plan vs Actual |
| `renderLookAhead(pkgs, from)` | L1546 | Table: POs planned in next 90 days (from = today) |
| `renderDelays(pkgs, asOf)` | — | **Removed** — PO Issuance Delays retired (archived workplan §16.7-A); one canonical overdue source remains |
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
> **Note**: Group 6 (Error table) is **read by the dashboard as of Rev 1.9** (**I-11**) — it is the wording source for every validation rule. Like groups 2–5 it is located by row-1 header text (`Error Code` / `Error Description`), never by a fixed letter. A code with **no** row here falls back to the dashboard's built-in message and raises **V-21** as a *warning only*. See **archived workplan §15.9**.
>
> **Note**: there is **no `Status Category` block** and none is required — see **I-49** (archived workplan §15.8). The app's contract is exactly the four blocks in groups 2–5.

---

### 4.1.1 Group 1 — Metadata & Field Mappings (Columns A–C)

| Row | Col A: Title | Col B: Value | Col C: Data Type | Notes |
|-----|--------------|--------------|------------------|-------|
| 1 | **Project Metadata Title** | **Values** | **Data Type** | Header row |
| 2 | Project Title | `TWRP C3B2` | Text | Project display name |
| 3 | Project Code | `C3B2` | Text | Short project code |
| 4 | Client | `PUB` | Text | Client name |
| 5 | Consultant | `Jacobs` | Text | Consultant name |
| 6 | Dashboard Title | `Procurement Package Plan` | Text | Title rendered in the dashboard header (was missing from this table before Rev 1.28) |
| 7 | Project Start Date | `2026-03-19` | **Date** | **Required** — project start date (Excel serial 46100). The dashboard's operational reference date (as-of) is always **today**, not this cell. Legacy label "AsOf Date" still accepted by the parser. |
| 8 | Header Row | `1` | **Int** | 1-indexed row of PPP column headers |
| 9 | List End Row | `300` | **Int** | 1-indexed last PPP data row (inclusive). **A template bound** — only 129 rows hold data, so V-20 warns on every load **by design** (see **I-50**, archived workplan §15.8) |
| 10 | S No. | `Column-A` | Int | → PPP Column A |
| 11 | Discipline | `Column-B` | Text | → PPP Column B |
| 12 | Package Title | `Column-C` | Text | → PPP Column C **(required)** |
| 13 | Package No. | `Column-D` | Text | → PPP Column D |
| 14 | Item Category | `Column-E` | Text | → PPP Column E |
| 15 | Area | `Column-F` | Text | → PPP Column F |
| 16 | Equipment Tags | `Column-G` | Text | → PPP Column G |
| 17 | Package Notes | `Column-H` | Text | → PPP Column H |
| 18 | Criticality | `Column-I` | Text | → PPP Column I |
| 19 | Quantity | `Column-J` | **Number** | → PPP Column J |
| 20 | Estimate Lead Time | `Column-K` | **Int** | → PPP Column K (days) |
| 21 | Package Status | `Column-L` | Text | → PPP Column L |
| 22 | PO Number | `Column-M` | Text | → PPP Column M. **Added Rev 1.28.** Text type keeps leading zeros. Registered in `CODE_SHEET_KEYS` as `poNo`; consumed only by **V-26** (warning). No table, CSV or KPI use (**I-81 closed**) |
| 23 | Supplier | `Column-N` | Text | → PPP Column N |
| 24 | Design Engineer | `Column-O` | Text | → PPP Column O |
| 25 | Buyer | `Column-P` | Text | → PPP Column P |
| 26 | Project Engineer | `Column-Q` | Text | → PPP Column Q |
| 27 | MR Plan Date | `Column-R` | **Date** | → PPP Column R |
| 28 | MR Forecast Date | `Column-S` | **Date** | → PPP Column S |
| 29 | MR Actual Date | `Column-T` | **Date** | → PPP Column T |
| 30 | PO Plan Date | `Column-U` | **Date** | → PPP Column U |
| 31 | PO Forecast Date | `Column-V` | **Date** | → PPP Column V |
| 32 | PO Actual Date | `Column-W` | **Date** | → PPP Column W |
| 33 | VD Approval Plan Date | `Column-X` | **Date** | → PPP Column X |
| 34 | VD Approval Forecast Date | `Column-Y` | **Date** | → PPP Column Y |
| 35 | VD Approval Actual Date | `Column-Z` | **Date** | → PPP Column Z |
| 36 | FAT Plan Date | `Column-AA` | **Date** | → PPP Column AA |
| 37 | FAT Forecast Date | `Column-AB` | **Date** | → PPP Column AB |
| 38 | FAT Actual Date | `Column-AC` | **Date** | → PPP Column AC |
| 39 | ROS Plan Date | `Column-AD` | **Date** | → PPP Column AD |
| 40 | ROS Forecast Date | `Column-AE` | **Date** | → PPP Column AE |
| 41 | ROS Actual Date | `Column-AF` | **Date** | → PPP Column AF |

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
| 11 | V-10 | Actual date is later than the as-of date (today) |
| 12 | V-11 | Duplicate Package No. appears multiple times |
| 13 | V-12 | Same engineer written different ways (normalized together) |
| 14 | V-13 | PPP rows with Package Title exist beyond List End Row |
| 15 | V-14 | Lead time missing on >50% of packages |
| 16 | V-15 | Code sheet config missing/invalid: Header Row, List End Row, **Project Start Date** (Code sheet "Project Start Date" cell; legacy "AsOf Date" still accepted); and Data Type mismatch in column C |
| 17 | V-16 | Code sheet Column C (Data Type) empty — using built-in fallback |
| 18 | V-17 | Item Category not found in Code sheet lookup |
| 19 | V-18 | Lookup block (Discipline/Criticality/Status/Category) not found in row 1 |
| 20 | V-19 | PPP Header Row cell at title column is blank — Code sheet Header Row may have drifted |
| 21 | V-20 | Expected data rows (lastRow − headerRow) exceeds actual parsed rows (packages + skipped) — completely blank rows silently ignored |

> **Status (Rev 1.9)** — the dashboard **now reads this table**. `LOOKUP_HEADERS.errorCode` / `.errorDescription` locate the pair by row-1 header text (not by a fixed letter), `readLookupMap()` builds `model.errorTable` (`{code → wording}`), and every issue carries that wording as `desc` (**I-11**, archived workplan §15.9). The `V-19` / `V-20` rows were added to the sheet by the workbook owner on 2026-09-16, closing **I-52**.
>
> **V-21 is app-side and deliberately *not* listed above.** The dashboard emits it itself when a rule code present in the report has **no row** in this table; severity is always **warning**, never error. Adding a `V-21` row is harmless but changes nothing — the rule does not audit its own documentation.
>
> **Recommendation** — keep this table in step with `validate()` whenever a rule is added. Column P is still free, so the block stays at Q–R.

---

### 4.2 Critical Rules for Developers

1. **Column C (Data Type) is authoritative** when present. If empty for any mapped field, the dashboard falls back to `LEGACY_DATE_FIELDS` (all date columns) + Text for others. **Always populate column C.**
2. **Header Row / List End Row** (rows 7–8) are 1-indexed. PPP data starts at `headerRow+1` (0-indexed in code).
3. **Lookup blocks** (E–O) are located by **row-1 header text**, not fixed columns. `findLookupColumns()` scans row 1 for known header names (case-insensitive, prefix match).
4. **Status canonicalization**: Dashboard accepts either the **code** (NS, MR, VI, PO, VDA, FAB, FAT, DEL, RI) or the **full description**. Both map to the description for display.
5. **Criticality codes**: 0–4 with descriptions. If blank for all packages, the Criticality chart shows a note and stays empty.
6. **Engineer normalization**: `"Dilip/Siva"` and `"Dilip / Siva"` → `"Dilip / Siva"`. Variants tracked in validation (V-12).

---
## 5. Dashboard design (PPP-specific)

### 5.1 KPI cards (six cards, top of the page)

| # | Card | Calculation | Status strip |
|---|---|---|---|
| 1 | Total Packages | `pkgs.length` of the active (filtered) set | none (blue) |
| 2 | Started % | `(T - NotStart - blank) / T × 100`; blank status is excluded from numerator and denominator | `ok` at ≥60%, `amb` at ≥40%, `warn` below 40% |
| 3 | PO Issued | count of packages with a PO Actual date | `ok` at ≥50%, `warn` below 50% |
| 4 | Delivered / RI % | `count(status in {Delivered, Receive Inspection}) / T × 100` | `ok` when >0, `warn` at 0 |
| 5 | Lead-time estimated | `count(leadTime not null) / T`, shown as `n/T` | `ok` at ≥50%, `warn` below 50% |
| 6 | Engineer assigned | `count(engineer not blank) / T`, shown as `n/T` | `ok` |

Each card is 72 px high with exactly two lines (value and label) and a 3 px status strip; there is no
sub-status line. "Not Started" is no longer a card; its count is implied by card 2. An empty filter
set shows 0 and 0% (never NaN).

### 5.2 Interactive chart panel (bar / pie per card, persisted)

Two cards share the panel: **Packages** and **Data Quality**. Each card owns its dimension picker,
bar/pie toggle and export; the view is persisted per card. Every Packages dimension is a tally over
the active (filtered) set; the Data Quality card tallies fired rule codes.

| Card | Dimension | Source key | Notes |
|---|---|---|---|
| Packages | Status | `status` (canonical) | ordered by the Code sheet status list |
| Packages | Discipline | `discipline` | count per value, highest first |
| Packages | Item Category | `itemCategory` | count per value |
| Packages | Criticality | `criticality` | code order; values outside the Code sheet are flagged |
| Packages | Engineer | `engineer` (normalized) | blanks read "Unassigned (blank)" |
| Packages | Lead Time | estimated vs not, plus four buckets (≤90, 91–180, 181–270, >270 days) | fixed bucket order; pie mode groups the buckets |
| Packages | Supplier / Buyer / PE | `supplierBuyerPE` | count per value |
| Packages | Stage Overdue | `stageOverdue` | count per value |
| Packages | Schedule Health | `scheduleHealth` | count per value |
| Data Quality | Validation rule | fired rule code | count per rule, de-duplicated |

Chart rendering constants: the horizontal bar chart is 760 px wide and grows in height with the
number of rows, with a 240 px label column, horizontal bars and right-aligned value labels; the donut
chart is 760 px wide with inner radius 58 px, outer radius 100 px, a centre total and a right-hand
legend showing the top eight values plus "Other".

### 5.3 PO plan vs actual (one combined chart)

One card combines both views: monthly bars for Planned, Forecast and Actual, plus a cumulative curve
for the same series over the selected period.

- **Period window**: From / To month controls plus Reset and a range message; the default start is the
  project start and the default end is the last PO date plus three months.
- **Markers**: a red dashed line marks the project start (Code sheet `Project Start Date`); a grey line
  marks today (the operational as-of).
- **Empty state**: when no PO date is a real Excel date, the panel shows guidance instead of a chart.
- **Series**: the cumulative curve plots running Plan / Forecast / Actual counts across months; the
  monthly bars show Plan against Actual per month. Forecast blanks fall back to the last known value.
- **Bar labels**: non-zero bar values print above the bar.

Period values, markers and counts are computed in the single derivation step; the renderer only
paints them.

### 5.4 PO look-ahead (bounded table)

- **Horizon**: segmented control `1m / 2m / 3m / 4m / 6m`, default 3, persisted. The window is
  measured in calendar months from today, never a fixed day count.
- **Filter**: `poPlan >= today` and `poPlan <= today + horizon`, and no PO Actual — a package whose
  PO is already issued is not upcoming.
- **Columns**: Package, Discipline, PO Plan, In (days), Status. The distance is numeric and
  right-aligned.
- **Sort**: PO Plan ascending (soonest first).
- **Rendering**: bounded table with a split header and a 340 px scroller; the row count sits in the
  control row with the CSV button. The panel title names the view, never the selected horizon.
- **CSV**: exports exactly the rows on screen; an empty list shows "Nothing to export", never an
  empty file.
- **Width**: the panel spans the full content width.

### 5.5 Overdue by stage (bounded table with drill-down)

- **Stage selector**: segmented control over the five stages; the default is the stage with the most
  overdue packages.
- **Rows**: Package, Discipline, Overdue Stage, Plan, Forecast, Overdue (days), Status; a narrow
  leading cell holds the expand button.
- **Drill-down**: one row open at a time; the detail shows the package record, the five-stage
  Plan / Forecast / Actual grid and that package's validation issues.
- **Rendering**: split header, 340 px scroller, row count and CSV in the control row. A row whose
  overdue days exceed the lane is highlighted.

### 5.6 Validation panel (chips, rules and issues)

- **Summary row**: total issue count, severity chips (error / warning / info, or "No issues"), and the
  Code sheet map.
- **Rules card**: one row per fired rule (severity, code, group, description, count), de-duplicated.
- **Issues card**: title row with the count, a Columns control and CSV; the table shows Severity, Rule,
  Package, Field, Value and Message (Value and Message can be hidden). Up to 80 rows render today;
  the spec requires every row (open issue I-85).
- **Rule wording** comes from the workbook Error table; a rule missing there falls back to the
  dashboard wording, marked visibly.
- **System notices** (for example a formula-error token) appear in the warning area above the panels,
  never as validation issues.

### 5.7 Lead time benchmark (renderer-owned table)

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

The rows are held as a dashboard constant and rendered through the same split-header table as every
other bounded table, so the benchmark can be exported like the other lists.

### 5.8 Stage fields (used by the stage views)

The Stage Plan Coverage card was retired, but these fields still drive the overdue, look-ahead and
detail views.

| Stage | Plan Field | Actual Field |
|-------|------------|--------------|
| MR | `mrPlan` | `mrActual` |
| PO | `poPlan` | `poActual` |
| VD | `vdPlan` | `vdActual` |
| FAT | `fatPlan` | `fatActual` |
| ROS | `rosPlan` | `rosActual` |
### 5.9 Issued status rule

The PO Issuance Delays table was retired, but the same issued rule is used by the look-ahead to
exclude packages whose PO is already issued.

- **Filter**: `poPlan < today` AND `status` not in issued set
- **Issued statuses** (case-insensitive): contains "po issued", "delivered", "receive inspection", "fabrication", "fat completed", "vendor data approval"
- **Columns**: Package, Discipline, PO Plan, Overdue (days), Status
- **Highlight**: `.over` row class → `#FFF6E5` background
### 5.10 Pages and navigation (current)

Seven menu links: KPI Overview, Interactive Chart, PO Plan vs Actual, PO Look-Ahead, Overdue by Stage,
Benchmark and Data Validation. Each link scrolls to its panel on one page; all panels are always
present. Settings and Help are pinned to the bottom of the sidebar. A reduced, page-based navigation
(each page showing only its own panels) is open issue I-88.

### 5.11 Interaction and accessibility (current)

Chart points expose their values through the browser's native tooltip only; there is no custom detail
window and no keyboard or touch path. The pointer does not signal hoverability, and the chart host
clips overflow. The required hover detail for charts and KPI cards is open issue I-84 and I-87 (the
content is agreed: label, values, total and percentage).

### 5.12 Persisted preferences

| Preference | Scope |
|---|---|
| Theme (five values) | whole dashboard |
| Panel collapse state | per panel |
| KPI density (6 / 3 / 2) | whole dashboard |
| Breakdown dimension and bar/pie type | per chart card |
| Look-ahead horizon | panel |
| Overdue stage | panel |
| PO period window | panel |

### 5.13 Status bar values

Left: total packages, packages shown after filters, started count with percentage. Right: the as-of
date and the dashboard version.

### 5.14 Retired UI record (verbatim; section references point to the archived workplan)

Grouped-bar constants from the retired Stage Plan Coverage card: 5 stage categories × 2 series
(Planned `#0066CC`, Actual `#34C759`), Y axis 0 to max, legend at the bottom.

> Removed in the 2026-10-04 consolidation (archived workplan §16.7-F). The Stage Plan Coverage card was retired and replaced by the interactive panel's **Stage Overdue** and **Schedule Health** breakdowns, both built on the shared `stageIsOverdue`/`stageDue` helpers. The spec below is retained for history.

> Removed in the 2026-10-04 consolidation (archived workplan §16.7-A). The PO Issuance Delays table has been retired; overdue now has a single canonical date-based source (`renderOverdueList` + shared `stageIsOverdue`). The spec below is retained for history.

| Flag | Condition |
|------|-----------|
| Execution progress = 0 | No Actual dates in any stage column |
| Criticality empty | All packages lack Criticality |
| Lead time sparse | >50% packages missing lead time |
| Engineer unassigned | Any package without engineer |
| Plan-date inconsistency | MR Plan <30% but PO Plan >50% (suggests back-filling) |

---

## 6. Validation Rules (V-01 through V-26)

> Copy-ready reference for the Code sheet **Error table** (cols `Q`–`V`). Each row's **Description** is the text to paste into the worksheet; **Severity**, **Group**, **Kind** and **Trigger Check** are the properties to add alongside it (see issue **I-65**). `Kind` shows the current routing — `system` = top warning banner, `data` = Data Validation table — and is informational only; do not change it without a code change.

| Code | Group | Severity | Kind | Trigger / Check | Description (paste into Code sheet) |
|------|-------|----------|------|-----------------|-------------------------------------|
| V-01 | Structure / Rows | info | system | Row in range has no Package Title | Rows inside the data range with a blank Package Title are skipped |
| V-02 | Dates | error | data | Date field is a number but not in the Excel date range (40000–70000) | Value is a number but not a real Excel date |
| V-03 | Dates | error | data | Date field is text that cannot be parsed | Text value cannot be read as a date |
| V-04 | Values / Numeric | error | data | Quantity or Lead Time is non-numeric | Value is not numeric |
| V-05 | Criticality | error / warning | data | Criticality not in the Code sheet (code or description); aggregate blank count | Criticality must be one of the listed values; empty count is reported separately |
| V-06 | Discipline | warning | data | Discipline not in the Code sheet list | Discipline not found in the Code sheet list |
| V-07 | Status | error | data | Status not in the Code sheet list (code or description) | Status not found in the Code sheet list |
| V-08 | Dates / Stages | warning | data | Stage plan out of sequence (e.g., MR Plan > PO Plan) | Stage plan dates are out of sequence |
| V-09 | Dates / Stages | warning | data | Actual date present but the matching Plan is empty | Actual date entered but the Plan is empty |
| V-10 | Dates / Stages | warning | data | Actual date later than today (the as-of date) | Actual date is later than today |
| V-11 | Identity | warning | data | Duplicate Package No. | Duplicate Package No. — appears N times |
| V-12 | Engineer | warning | data | Same engineer written differently (whitespace / slash-spacing variants) | Same engineer written different ways — counted as N separate people |
| V-13 | Structure / Rows | warning | system | PPP rows with a Title beyond List End Row | Rows after List End Row contain a Package Title but are excluded |
| V-14 | Lead time | warning | data | Lead time missing on more than 50% of packages | Lead time missing on N packages (X%) |
| V-15 | Config / Code sheet | error / warning | system | Code-sheet config / Data-Type mismatch (Header / List End / Start / Type) | Header Row, List End Row, Project Start Date or Data Type issue |
| V-16 | Config / Code sheet | warning | system | Code sheet column C empty (no Data Types) | Column C has no Data Type values — fell back to built-in |
| V-17 | Category | info | data | Item Category not in the Code sheet list | Item Category not found in the Code sheet list (reference only) |
| V-18 | Config / Lookup | warning | system | A lookup block absent from Code row 1, or its code column empty | Lookup block not found in row 1 |
| V-19 | Config / Code sheet | warning | system | PPP Header Row cell at the title column is blank | Header Row has no value in the Package Title column |
| V-20 | Structure / Rows | warning | system | Expected data rows exceed actual parsed rows | Expected N data rows but only M had content |
| V-21 | Config / Workbook | warning | system | A rule code has no row in the Code!Q:R Error table | Rule code has no row in the Code sheet Error table |
| V-22 | Config / Lookup | warning | system | A lookup block's CODE column is empty while its description column has values | Lookup code column is empty — values cannot be cross-checked |
| V-23 | Progress / Execution | warning | data | Execution progress = 0 (no Actual dates in any stage, any package) | No Actual dates entered in any stage for any package |
| V-24 | Engineer | warning | data | Engineer unassigned / blank | Package has no Design Engineer |
| V-25 | Dates / Stages | warning | data | Plan-date inconsistency (MR Plan sparse vs PO Plan present) | MR Plan entered for few packages while PO Plan present for many |
| V-26 | PO / Procurement | warning | data | PO Actual date is set but PO Number is blank | PO Actual date is set but the PO Number is blank |

> **V-26 — IMPLEMENTED (Rev 1.31).** Decision 2026-10-30: a PO Actual date is the **only** evidence that a package has a PO issued, and an issued package must carry a PO Number. PO Number is **not** shown in the look-ahead or overdue tables, because those tables list packages that have no PO issued yet; a value there would be meaningless. No CSV or KPI change.
>
> **Rollout complete.** (1) The Code sheet row `Q27:V27` is present (`V-26` / `PO Actual date is set but the PO Number is blank` / `warning` / `PO / Procurement` / `data`). (2) The rule is in `validate()` as a per-package entry. (3) The harness asserts the count, the severity and the no-false-positive case.
>
> **First run:** **19 warnings** — 19 of 129 packages have a PO Actual date and column M is empty. That list is the data-entry work list, not a code fault. Severity stays `warning`; change it to `error` only after column M is filled and the count reaches 0.

**Severity order**: Error (0) > Warning (1) > Info (2). Validation panel shows chips + expandable table (max 80 rows, export CSV for full).

---
## 7. Issues

All PPP issues are recorded in `log/issue_log.md`: canonical nine-field records from I-80 onward, and
the migrated history I-01–I-81 appended verbatim. This workplan no longer holds issue records.

- Active queue and counts: `log/issue_log.md` status summary.
- Historical records I-01–I-81: the same file, migrated-history appendix.
- The horizon-chip contrast finding (I-77) is part of that migrated set and remains open.

---

## 8. Conformance record (PPP-specific)

### 8.1 Dashboard-specific choices (the spec permits; PPP decides)

| Spec clause | PPP's choice |
|---|---|
| §4 — panel class name is free | **`.card`** |
| §3.2 — navigation: sidebar **or** inline | **Left sidebar (160 px)**; navigation moved from the header in P6.1 |
| §1 — status vocabulary is per-dashboard | PPP defines its own status text/symbols; MDL's are never copied |
| §3.4 - responsive layout (panels fit, reflow on any width change, controls and navigation reachable) | **CONFORMING (P8.4, 2026-11-01).** No horizontal scroll at 1600, 1440, 1280, 1024, 900 or 800 px; the PO chart follows its host and redraws on resize; split headers re-sync; validation columns scale; the sidebar collapses (not hides) below 820 px and the toggle opens it. 280 assertions |
| §3.1 / §7.2.7 — which dimensions are **global** | PPP's category filter (top-bar chip); the dimension list is PPP's own |
| §7.1 - enforcement posture (hard / advisory) | **Hard** (P8, 2026-11-01); the former I-77 finding no longer reproduces |
### 8.2 Conformance / migration state

| Spec clause | PPP status |
|---|---|
| §7.1 A3 — `.btn-secondary` is the canonical text-action class | **Conforming since 2026-10-21** (I-78). Legacy `.dlBtn` / `.copyBtn` are **gone**; `.reset` had already disappeared |
| §7.1 B1 / A5 - filter trigger and search submit | **CONFORMING (P8.5, 2026-11-01).** Trigger: text + count badge, 12 px / 600, borderless, no caret, `is-filtered` state; panel order master, note, divider, list, footer with count and Reset. Search: affixed 36 px submit, accent fill, white glyph, right-rounded; one-row panel. Browser assertions cover each point |
| §7.1 B5 / A5 - search panel composition | **CONFORMING (P8.6, 2026-11-01).** One row: attached `.inter-sel.is-attached` picker (All columns plus five columns), flexible input, affixed submit. The picker re-applies the query, never clears it, is persisted and named in the chip. Spec revision 1.55, assertion 20 |
| §7.2.15 — every bounded table uses the split header; sticky `<thead>` inside a `.tableScroll` is retired | **CONFORMING (P7, 2026-11-01).** One `syncSplitTable()` helper; `.splitcard` + `.vheadwrap`, `--ds-sbw` gutter, width pin, `ResizeObserver` lock-step, 1 px column rule. Harness Tier 4c split-header checks pass (gap 0, alignment 0 px, no overflow) |
| §7.1 - control contrast >= 3:1 for UI text | **CONFORMING (P8, 2026-11-01).** The active menu item and the horizon chip meet 3:1; Tier 4d runs hard with 0 findings |
| §3.1–§3.3 — title bar, one-row menu bar, left sidebar menu, content without a toolbar | **CONFORMING (P6.1, 2026-10-30).** Three-row title bar, one-row menu bar, 160 px nav sidebar with Settings/Help at the bottom, filter-area + body inside the content zone, warning area inside content, no content toolbar. Tier 1 8/1 (module-script marker only); Tier 2 23/0 |
| §4–§4.5 — panel standard, control ownership, combined chart, bounded tables, drill-down, validation panel | **CONFORMING (P6.2, 2026-11-01).** Panels 1–7 are direct children of `#dashBody` with a title row (Help `?`, Collapse `−`) and a DOM-order number; charts sit in `.c-card` with their controls above the plot; bounded tables use the split header with a row count and CSV; overdue uses a `drill-btn` (`aria-expanded`/`aria-controls`, rotating chevron, one open row) with `.sub` / `.sub-inner`; validation has no `<details>` and shows a count strip, a Rules table and an issue card with a Columns toggle. 225 assertions green; Chromium 1440 light/dark; 0 console errors |
| §5 — KPI overview panel (72 px card, 22 px/700 value, 10 px/400 label, 3 px status strip, two lines, auto-fit) | **CONFORMING (P6.3, 2026-11-01).** All six cards measure 72 px, carry exactly `.v` + `.l`, show no sub-status line, and take the strip colour from `ok`/`amb`/`warn`/`muted`/`err`. Grid is `repeat(auto-fit,minmax(210px,1fr))`; panel title is 13 px/600 |
| §6 — tokens (shared font stack, semantic colour tokens, five themes) | **CONFORMING (P6.4, 2026-11-01).** Colour literals in component rules are tokens; `--font-ui` holds the shared stack. Five themes exist (`light`, `dark`, `sky`, `ocean`, `presentation`), each a pure token remap with a Settings picker and persistence; `--surface`, `--border`, `--text` and `--row-stripe` flip in every non-light theme, and component text uses `--ink`. KPI value contrast measured 13.4–18.6:1 in all five themes |
| §7.1 — one canonical A3 text action (`.btn-secondary`), no parallel class | **CONFORMING (P6.3, 2026-11-01).** All four CSV buttons are `.btn-secondary` with `data-act="csv"`; `.csv-btn` is removed; no `[role="button"]` on `div`/`td` |
### 8.3 Chart specifics (spec §4.2)

- PPP's combo chart is **SVG-based** (`svgPoCombo`); bar value labels print at **12 px** above every
  non-zero bar — the spec now states the 12 px figure generically.
- Cumulative S-curve points are **solid dots** (`r=3`, filled with the series colour), never hollow
  rings — the form the spec now mandates for every S-curve.
### 8.4 Evidence (spec §4.2 / §8.4)

- Shared harness: `harness-layout --dashboard ppp`, with PPP's check module
  (`harness-layout/checks/ppp.mjs`); PPP runs `chrome.controlContrast: 'advisory'`.
- MDL's shared A3 tripwire lives in `MDL/test/test_grid.mjs` (4 checks) and covers both dashboards.
- Per-clause evidence pointers are recorded in the issue table of §7 above.
### 8.5 General-rule material moved

Two P6-era subsections were general UI design rather than PPP design: the derivation of two shared
rules (icon-button geometry) and the shell sample study. They were removed so general UI design lives
only in `Dashboard-UI-Design-Spec.md`; the verbatim text is preserved in
`archive/PPP-Dashboard-Workplan_v1.48_2026-11-01.md` §8.2 and §8.6.

### 8.6 Data pipeline status (spec §3.8) — **CONFORMING**, confirmed 2026-10-30, Rev 1.42

Spec §3.8 is **mandatory** for any dashboard that ingests a workbook. PPP was checked against it for
this review. **Result: the spec pipeline has not been created.** PPP ships one inline script. The
stages exist only as functions inside that script, so nothing can be imported or tested in
isolation.

| Spec clause | Requirement | PPP status | Evidence |
|---|---|---|---|
| §3.8.0 | Importable modules: `xlsx-reader`, `pipeline`, `render`; sources modular, delivered HTML inlined | **MET (P1, 2026-10-30)** | `src/xlsx-reader.mjs`, `src/pipeline.mjs`, `src/render.mjs` and `build.mjs` exist. The delivered HTML is generated from them: one inline IIFE, no import, no server, no external reference. Node imports the three modules cleanly. `checks/ppp.mjs` module paths are still `null` until T8.8.16 |
| §3.8.1 S0–S6 | Separate stages, including one derive step (S4) and a write-only render (S5) | **MET (P2, 2026-10-30)** | `parseXlsx` (S0/S1), `buildModel` (S2), `validate` (S3), `deriveView` (S4) and paint-only renderers (S5). S6 is `boot()` |
| §3.8.2 rule 1 | One source of truth for every aggregation | **MET (P2, 2026-10-30)** | `deriveView()` computes every count, percentage, average, list and chart item once per render. The renderers only paint; the old per-panel calculations are deleted |
| §3.8.2 rule 2 | Discard the raw parse after S2 | **MET** | Only `STATE.model` is retained |
| §3.8.2 rule 3 | Validate once, at load | **MET** | `validate()` runs once inside `buildDashboard` |
| §3.8.2 rule 4 | Derive on demand, no I/O | **MET** | `render()` reads `STATE.model`; no file read |
| §3.8.2 rule 5 | No re-parse on filter change | **MET** | Filter handlers mutate `STATE` and call `render()` |
| §3.8.2 rule 6 | Render is write-only | **MET** | `STATE` is the only source of truth |
| §3.8.2 rule 7 | Single `STATE` object | **MET (P2, 2026-10-30)** | One `STATE` object. P2 moved the last module-level values into it: the PO window (`STATE.poWin`), the bars toggle, the overdue stage and the look-ahead horizon (in `STATE.prefs`). No module-level mutable state remains |
| §3.8.2 rule 8 | One error boundary per stage | **MET (P2, 2026-10-30)** | S1/S2 load failure is fatal (welcome stays). S3 failure now writes a `VALIDATE` system notice to `#errBanner` and **keeps `#dash` visible**. S4 has its own boundary that reports and returns. S5 keeps one `safeCall` per panel |
| §3.8.2 rule 9 | As-of from local date parts; project start not used in overdue math | **MET** | `todayMidnight()` uses `setHours(0,0,0,0)`; no `toISOString()` |
| §3.8.2 rule 10 / §3.8.4 | Blank and formula-error are the same absent state; `W-FORMULA` notice | **MET (P3, 2026-10-30)** | `isExcelError()` covers the ten tokens, case-insensitive. S2 writes `undefined` for blank or token cells in every column and counts tokens per field. S3 emits one fatal `W-FORMULA` per column into `model.warnings`; it is not an issue, it routes to `#errBanner`, and the load continues |
| §3.8.3 | Contract read from the source at runtime; labels, not fixed positions | **MET** | The Code sheet is read by label; V-26 resolves from `Q27:V27` |
| §3.8.5 | Harness imports the pipeline module and asserts records, KPIs and counts | **MET (P4, 2026-10-30)** | `test/test_pipeline.mjs` imports `xlsx-reader.mjs` and `pipeline.mjs` (and `render.mjs` for the DOM checks); no `<script>` extraction and no `vm`. The 71 assertions are unchanged. `test_units`, `test_edges`, `test_build` and `test_panels` add 141 more |
| §3.8.5 / Tier 3 | Harness computes ground truth from `pipeline.js` | **MET (P4, 2026-10-30)** | `checks/ppp.mjs` sets `srcDir`, `xlsxReaderPath`, `pipelinePath` and `renderPath`, and supplies a `groundTruth` adapter for the PPP model shape. `node harness.mjs --dashboard ppp --tier 3` gives **3 passed, 0 failed** (KPI 129, category filter 5, status bar). Tier 1/2 shell checks remain P6 |

**Scope to comply (I-76).** P1–P4 are **done**: the modules, `build.mjs`, the single S4 step, the
boundaries, the §3.8.4 normalization and the five test layers are in place, and the harness
computes Tier 3 ground truth from the modules. P5 records the result; P6 adopts the UI spec.

**Risk and baseline.** 71/71 is the regression baseline and it stayed green after P1. P1 preserved
every function (96 original, 96 plus `boot`), the rendered KPI values and the 19 V-26 warnings.

**Verdict (P5).** PPP is **CONFORMING to §3.8**. Every pipeline clause is met: §3.8.0 modules
(P1), §3.8.1 S0–S6 and §3.8.2 rules (P2), §3.8.3 contract parsing, §3.8.4 value normalization (P3) and §3.8.5 testability (P4: 212 assertions, Tier 3 ground truth). Evidence is in
reports P1–P5 and logs TL004–TL009. No pipeline clause is open. The shared shell conformance
(§3.1–§3.7, §4–§8) is separate work in P6; it does not affect this verdict.
### 8.7 Pipeline build plan (spec §3.8) — APPROVED, Rev 1.37

The owner approved the build in principle on 2026-10-30, and approved D8–D11 on 2026-10-30
(decisions below). **P1–P5 are complete (2026-10-30); P6.1 is complete and P6.2 is next.** I-76 is `IN_PROGRESS`
with tasks T8.8.1–T8.8.21.

**Progress**

| Phase | Status | Evidence |
|---|---|---|
| P1 | ✅ COMPLETE 2026-10-30 | `src/xlsx-reader.mjs`, `src/pipeline.mjs`, `src/render.mjs`, `build.mjs`; **71/71**; 96 of 96 functions preserved (plus `boot`); page loads from `file://` with no error; KPI values and 19 V-26 warnings unchanged. Report: `workplan/reports/P1_pipeline_extraction_report.md` |
| P2 | ✅ COMPLETE 2026-10-30 | `deriveView` in `src/render.mjs`; paint-only renderers; `STATE` holds the view and the window; S3/S4/S5 boundaries; `STAGES` and the stage helpers moved to `pipeline.mjs`. **71/71**; KPI, warning, look-ahead and overdue values unchanged; saved prefs and all interactions verified in Chromium. Report: `workplan/reports/P2_derive_report.md` |
| P3 | ✅ COMPLETE 2026-10-30 | `isExcelError` + `isAbsent` in `src/pipeline.mjs`; S2 writes `undefined` for blank and token cells; per-field token counts; one fatal `W-FORMULA` per column in `model.warnings`, shown in `#errBanner`; tallies skip absent values. **71/71**; synthetic-token checks pass. Report: `workplan/reports/P3_normalization_report.md` |
| P4 | ✅ COMPLETE 2026-10-30 | Five layers: `test_units` 37, `test_pipeline` 71 (imports `src/`), `test_edges` 22, `test_build` 19 (static + vm + `file://` KPI), `test_panels` 63 (all panels, filters, CSV). Harness Tier 3 adapter: **3/0**. Report: `workplan/reports/P4_test_suite_report.md` |
| P5 | ✅ COMPLETE 2026-10-30 | §8.6 CONFORMING; acceptance 1–4 ticked; knowledge 1.14.0; logs TL009 / U029. Report: `workplan/reports/P5_closeout_report.md` |
| P6 | ✅ COMPLETE | **P6.1 shell ✅** (Tier 2 23/0), **P6.2 panels ✅** (225 assertions), **P6.3 KPI/tokens/components ✅** (232 assertions), **P6.4 conformance ✅** (236 assertions, five themes, §8.8 record). P6 closed 2026-11-01. Four deviations recorded and carried to **P7**. Reports: `P6_1_shell_report.md`, `P6_2_panels_report.md`, `P6_3_kpi_report.md`, `P6_4_conformance_report.md` |
| P7 | ✅ COMPLETE | **P7.1 split-header contract (T8.8.22)** — `.splitcard` container, `.vheadwrap`, `--ds-sbw` gutter, width pin, `ResizeObserver` lock-step; pairing checks enabled. **P7.2 harness acceptance (T8.8.24)** — inline classic script, sticky scoped to `.tableScroll`, split bodies exempt, gutter-aware width check, `minGridTables: 0`. **T8.8.23 (grips)** closed as N/A (D16). Tier 1 9/0, Tier 2 23/0, Tier 3 3/0, Tier 4 85/0 (1 advisory). Report: `P7_split_header_report.md` |
| P8 | ✅ COMPLETE 2026-11-01 | UI conformance follow-up: chart and KPI hover detail (keyboard, touch), four-page routing, complete validation list with fixed-size severity icons, component polish and contrast. **263 assertions**; Tier 1 9/0, Tier 2 23/0, Tier 3 3/0, Tier 4 79/0 (0 advisories). Report: `workplan/reports/P8_ui_followup_report.md` |
| P8.1 | ✅ COMPLETE 2026-11-01 | Chart hover corrections (I-93, I-94): per-month bands fix the stale window; one dashed snap line follows the hovered month. **269 assertions**; Tier 1-4 unchanged. Report: `workplan/reports/P8_1_hover_fix_report.md` |
| P8.2 | ✅ COMPLETE 2026-11-01 | Warning area pinned below the menu bar, above the filter strip and outside the scroller (I-95); spec §3.5 and assertion 18 added. **272 assertions**; Tier 2 23/0, Tier 4 79/0. Report: `workplan/reports/P8_2_warning_sticky_report.md` |
| P8.3 | ✅ COMPLETE 2026-11-01 | Panels separated by a 14 px content-column gap (I-96); card gaps verified (16 px charts, 12 px validation); spec §4 and assertion 19 added. **275 assertions**; Tier 2 23/0, Tier 4 79/0. Report: `workplan/reports/P8_3_panel_gaps_report.md` |
| P8.4 | ✅ COMPLETE 2026-11-01 | Responsive reflow (I-97, I-98): panels shrink, PO chart follows its host and redraws on resize, validation columns scale, control text truncates, sidebar collapses instead of disappearing at 820 px. **280 assertions**; measured 24 page x width combinations with zero overflow. Report: `workplan/reports/P8_4_responsive_report.md` |
| P8.5 | ✅ COMPLETE 2026-11-01 | Category filter and search brought to spec §7.1 B1/A5 (I-99): text + count badge, no caret, borderless; panel master/note/divider/list/footer; affixed search submit. **286 assertions**; Tiers 2–4 pass. Report: `workplan/reports/P8_5_filter_search_report.md` |
| P8.6 | ✅ COMPLETE 2026-11-01 | Search column picker (I-100): attached B5 picker with six options, field-scoped query, persistence and a column-aware chip; spec revision 1.55 and assertion 20. **292 assertions**; measured 25/23/2/0 across All/Discipline/Title/Status. Report: `workplan/reports/P8_6_search_column_report.md` |

**UI design constraint (owner, 2026-10-30).** `Dashboard-UI-Design-Spec.md` in the repository root
is authoritative for every dashboard. P1–P5 are data-only and change no visual element; **P6** then
brings PPP to the spec shell (§3.1–§3.7), the panel standard (§4), the KPI strip (§5), the tokens
(§6) and the component library (§7). D1–D7 resolve to the spec (§3 and §7); their detail is in the archived workplan §8.6. The delivered page stays one
standalone HTML that runs from `file://` with no server and no external reference.

**Target structure** (mirrors MDL, the spec §3.9 reference implementation)

```
PPP/
  Procurement-Dashboard.html    delivered bundle (generated; one file, no imports)
  build.mjs                     dev-time packager: inlines src/ into the HTML
  src/xlsx-reader.mjs           S0 Acquire / S1 Parse
  src/pipeline.mjs              contract + S2 Normalize + S3 Validate
  src/render.mjs                STATE + S4 Derive + S5 Render + S6 React
  test/test_pipeline.mjs        imports the modules (no VM extraction)
  test/test_units.mjs           pure-helper unit tests (new)
  test/test_build.mjs           built-HTML artifact test (new)
  test/test_panels.mjs          Panels 1–7 and filter coverage (new)
```

**Where the current code goes**

| Current code (in the inline script) | Target | Stage |
|---|---|---|
| `colToIndex`, `unescXml`, `parseSharedStrings`, `parseWorkbookSheets`, `parseSheet`, `inflateRaw`, `parseXlsx`, `parseCSV` | `src/xlsx-reader.mjs` | S0 / S1 |
| `CODE_SHEET_KEYS`, `DATE_FIELDS`, `LOOKUP_HEADERS`, `colLetter`, `colRefToIndex`, `parseCodeSheet`, `buildFieldToCol`, `normType`, `parseFieldTypes`, `findLookupColumns`, `readLookupCol`, `readLookupMap`, `toDate`, `fmt`, `parseWorkbook`, `buildModel` | `src/pipeline.mjs` | S2 |
| `validate` and its helpers, new `isExcelError`, new `W-FORMULA` | `src/pipeline.mjs` | S3 |
| `filteredPackages`, tallies, KPI / chart / overdue derivations, new `deriveView` | `src/render.mjs` | S4 |
| `render`, `render*`, chart SVG helpers, `esc`, `trunc`, `safeCall` | `src/render.mjs` | S5 |
| `STATE`, prefs, `buildTypeFilter`, `buildOverdueFilter`, theme, help, file input | `src/render.mjs` (`boot`) | S6 |

**P1 — Module extraction, behaviour-preserving**

| Task | Work | Size |
|---|---|---|
| T8.8.1 | Create `PPP/src/`. Move S0/S1 to `xlsx-reader.mjs`; export `parseXlsx`, `parseCSV`. `DecompressionStream` is global in the browser and in Node 20, so the same code runs in both | S |
| T8.8.2 | Move the contract and S2/S3 to `pipeline.mjs`; export `buildModel`, `validate` and the contract helpers. `fmt` moves here because `validate` uses it in messages | M |
| T8.8.3 | Move S4/S5/S6 to `render.mjs`; export `boot`. Keep `esc` here (HTML only) | M |
| T8.8.4 | Add `build.mjs`: read the three modules, strip `import` lines and `export`, concatenate, run a `vm.Script` parse check, write the delivered HTML from the current shell | M |
| T8.8.5 | Rebuild and verify: same KPI and warning counts, 71/71, the page opens from `file://` with no network | S |

**P2 — Stage separation and error boundaries**

| Task | Work | Size |
|---|---|---|
| T8.8.6 | Add `deriveView(model, STATE)` and return one `view` object (`active`, `kpis`, `issues`, `panels`). Move every aggregation there and **delete** the per-panel computations; no adapter and no second path. `render(view)` paints only. The current numbers are the contract | L |
| T8.8.7 | Move the remaining UI state (`pppScurveWin`, `PO_SHOW_BARS`, `LOOK_LAST`, `OVL_STAGE`, prefs) into `STATE` (§3.8.2 rule 7) | M |
| T8.8.8 | One error boundary per stage: S1/S2 fatal load; S3 banner that **keeps `#dash` visible** (today `showError` hides it); S4 panel-level; S5 `safeCall` | S |

**P3 — Value normalization (§3.8.4)**

| Task | Work | Size |
|---|---|---|
| T8.8.9 | Add `isExcelError(v)` with the ten tokens (`#NULL! #DIV/0! #VALUE! #REF! #NAME? #N/A #NUM! #GETTING_DATA #SPILL! #CALC!`), case-insensitive | S |
| T8.8.10 | S2 maps a blank or error cell to `undefined`, so every later stage treats it as **absent**: excluded from counts, averages and charts, not counted as a status. Count error tokens per field | S |
| T8.8.11 | S3 emits one `W-FORMULA` entry per affected column (field label, column letter, N of total, recovery) as `level:'fatal'` in `model.warnings`; route it to `#errBanner`; keep it out of `model.issues`. The banner does **not** block the load | M |

**P4 — Complete test suite (five layers, D9 — "cover all panels")**

| Task | Work | Size |
|---|---|---|
| T8.8.12 | Layer 1 — unit: `test/test_units.mjs` for the pure helpers (`isExcelError`, `toDate`, `colRefToIndex`, `fmt`, contract parsing). Layer 2 — integration: rewrite `test/test_pipeline.mjs` to import `xlsx-reader.mjs` and `pipeline.mjs`; keep the 71 assertions unchanged | M |
| T8.8.13 | Edge cases: blank vs error token; token count per column; error-token rows excluded from counts; a contract rename fixture proves labels are read, not hard-coded; validation counts | M |
| T8.8.14 | Layer 3 — built artifact: `test/test_build.mjs` asserts the HTML parses, has one script block, no local `src` / `href`, no external `http(s)` / CDN / font reference, no `import` and no `fetch`; then open it from `file://` and compare rendered KPIs with the pipeline ground truth | M |
| T8.8.15 | Layer 4 — **all panels**: for Panels 1–7 compare the rendered DOM with `deriveView` ground truth — KPI values; interactive chart categories and counts; PO bars and S-curve points; look-ahead rows, fields and order; overdue rows per stage; validation counts per severity and rule plus `W-FORMULA`; benchmark values. Exercise every filter (type, stage, window, search) and the empty / error states; assert CSV export headers and rows | L |
| T8.8.16 | Layer 5 — harness: set `srcDir`, `xlsxReaderPath`, `pipelinePath` and `renderPath` in `checks/ppp.mjs`; enable Tier 3 ground truth; run Tiers 1–3 | M |

**P5 — Documentation**

| Task | Work | Size |
|---|---|---|
| T8.8.17 | §8.6 status to **CONFORMING**; `knowledge.json`; update / test logs; phase report in `workplan/reports/` | S |

**P6 — UI spec conformance (root spec is authoritative)**

**Decisions (owner, 2026-10-30).** **D12** Search opens a popover whose text filters the package set by title, package number, discipline and status; it combines with the category filter and re-derives every panel. **D13** Export opens a menu with **Validation CSV** and **PO look-ahead CSV**, both using the tested row builders. **D14** the layout toggle cycles the KPI grid 6 → 3 → 2 columns and persists the choice; panels stay full width.

**Sub-phases.** P6.1 → T8.8.18; P6.2 → T8.8.19; P6.3 → T8.8.20; P6.4 → T8.8.21. P6.1 is verified (tests + Tiers 1–2 + screenshots) before P6.2 starts.

| Task | Work | Size |
|---|---|---|
| T8.8.18 | Shell §3.1–§3.7: two-row header, menu bar (Load, Export, filters, Search, Warnings, layout toggle), left nav sidebar at 160 px with Settings / Help at the bottom, status bar, welcome overlay. Retire the inline header navigation | L |
| T8.8.19 | Panels §4: panel head and action cluster, chart control ownership §4.1, combined chart §4.2, bounded tables §4.3, drill-down accordion §4.4, validation panel §4.5 | L |
| T8.8.20 | KPI §5 (72 px card, 22 / 700 value, 10 px label, 3 px strip), tokens §6, components §7 (buttons, tables, icon buttons). No hardcoded colour values | M |
| T8.8.21 | Conformance §8: add the §8.2 assertions to the harness, record the result (§8.4), update the §8.2 table to CONFORMING, capture 1440 and 1280 screenshots. Note the `AGENTS.md` §18 reconciliation as a separate documentation change | M |

**Acceptance criteria**

- [x] `src/xlsx-reader.mjs`, `src/pipeline.mjs` and `src/render.mjs` exist; `build.mjs` writes the
      delivered HTML; the page opens from `file://` with **no server, no import, no `fetch`, no
      external reference**.
- [x] `deriveView(model, STATE)` is the only place that computes KPIs and chart counts; the old
      per-panel computations are deleted.
- [x] `isExcelError` exists; an error token is stored as absent data, is excluded from every count,
      and `W-FORMULA` fires on a fixture workbook that contains a token.
- [x] A validation failure keeps the dashboard visible.
- [x] The complete suite passes: unit + integration + built artifact from `file://` + **all seven panels and every filter** + harness Tiers 1–3. **MET (P6, 2026-11-01): 236 assertions; Tier 1 8/1 (module-script deviation D17), Tier 2 23/0, Tier 3 3/0.**
- [x] P6: the shell matches §3.1–§3.7, Panels 1–7 match §4–§5, no hardcoded colour values, and the §8.2 conformance assertions pass or are recorded as deviations. **MET (P6.4, 2026-11-01); see §8.8.**
### 8.8 Conformance record (spec §8.4)

Recorded 2026-11-01 at P6 close. Posture: every generic check below is **hard** except control
Posture: every generic check below is **hard**.

**Generic checks**

| Check | Tier | Posture | Result |
|---|---|---|---|
| Shell structure and tokens | 1 | hard | 9 passed, 0 failed |
| Shell behaviour and geometry | 2 | hard | 23 passed, 0 failed |
| Pipeline ground truth | 3 | hard | 3 passed, 0 failed (5 skipped by design) |
| Table chrome and split header | 4c | hard | 79 passed, 0 failed - split-header pairing, alignment, width + gutter and lock-step all pass on the three table pages |
| Column sizing / resize grips (I-95) | 4b | **not offered** | Pass — the dashboard declares `minGridTables: 0`; no resizable grid table exists (D16) |
| Control contrast | 4d | **hard** | Pass - 0 findings |
| Warning-button label stability | 4e | hard | Pass |
| Search panel and floating-panel layout | 4f | hard | Pass |

**Spec §8.2 assertions**

| # | Clause | Status | Evidence |
|---|---|---|---|
| 1 | §1, §3.1, §6 — local assets, shell tokens, five themes | **PASS** | `test_build.mjs` theme block: 5 options, 5 distinct background tokens, contrast 13.4–18.6:1; screenshots `p6_4_1440_*.png` |
| 2 | §7.1 A3 — text-action dimensions and behaviour | **PASS** | `test_build.mjs` `.btn-secondary[data-act=csv]` = 4, legacy 0; `.btn-secondary` rule is governing |
| 3 | §7.1 — every action is a real `<button>` | **PASS** | Tier 1 "actions do not use div or td role=button" |
| 4 | §7.1 - control label contrast >= 3:1 | **PASS** | Tier 4d hard, 0 findings (P8) |
| 5 | §7.1 — every control has an accessible name | **PASS** | Tier 4d and Tier 2 |
| 6 | §7.1 B1/B7 — filter trigger only for row filters | **PASS** | The only `.tf-btn` is the category filter; the column control is `.btn-secondary` |
| 7 | §7.1 B — floating-panel order and master re-sync | **PASS** | Tier 4f; the filter panel is master → note → divider → list |
| 8 | §7.2.7 pt 6 / B6 — panel-local filter isolation | **N/A** | PPP has no panel-local filter |
| 9 | §7.2.7 pt 5 — no duplicate dimension | **PASS** | One category dimension, global only |
| 10 | §7.2.15 — split header, no sticky `thead` in a scroller | **PASS** | `splitTable()` builds every bounded table; `grep` finds no `thead` inside `.tableScroll` |
| 11 | §7.2.15 — split-header invariants (gutter, lock-step, one implementation) | **PASS** | One `syncSplitTable()` helper; `--ds-sbw` gutter, width pin and `ResizeObserver` lock-step; Tier 4c split-header checks pass |
| 12 | §7.2.15 — pairing by rendered position | **PASS** | Tier 4c pairs header and body cells by rendered position; `maxDelta` 0 px on all four tables |
| 13 | §3.8 / §3.8.5 — S1–S5 separation, stage-testable | **PASS** | `src/xlsx-reader.mjs`, `src/pipeline.mjs`, `src/render.mjs`; 5 suite layers; Tier 3 |
| 14 | §3.8.3 — no hard-coded source positions | **PASS** | Contract read from the Code sheet; `test_pipeline.mjs` |
| 15 | §3.9 — standalone `file://` delivery | **PASS** | `test_build.mjs` static checks; Chromium `file://` load |
| 16 | §5 — KPI card geometry and content | **PASS** | `test_build.mjs`: 72 px, 2 children, no `.s`, status strip |
| 17 | §7.1 — filter selection semantics | **PASS** | `test_panels.mjs` filter round-trip; Tier 3 |

**Deviations**

| ID | Clause | Deviation | Reason | End state |
|---|---|---|---|---|
| D15 | §7.2.15 | **RESOLVED (P7).** The harness now scopes sticky to `.tableScroll`, exempts the declared fragment, and compares the fragment width to body + scrollbar | Split header is mandatory; the check now measures the contract it describes | Closed |
| D16 | §7.2.13, §7.2.14 | **CLOSED AS N/A (P7).** PPP offers no column sizing; `minGridTables: 0` declares that | Fixed-width bounded tables; sizing is a feature, not a correction | Reopen only if sizing is requested |
| D17 | §3.9 (vs harness Tier 1) | **RESOLVED (P7).** `inlineClassicScript: true` is declared and the harness accepts a single inline classic IIFE | §3.9 requires a standalone page, not module syntax | Closed |
| D18 | §7.2.15 | **RESOLVED (P7).** Gutter, width pin and lock-step implemented; `chrome.splitHeader` enabled and passing | A split header needs these invariants to stay aligned | Closed |

**Risks and mitigation**

| Risk | Mitigation |
|---|---|
| Behaviour drift during the split | 71/71 after every phase; per-panel screenshots before and after P1 |
| Cross-module globals and load-order errors | Export every constant from its owning module; no top-level DOM reads in `pipeline.mjs` |
| `build.mjs` concatenation breaks a template literal (MDL precedent) | The MDL backtick guard plus a `vm.Script` parse check before a write |
| `DecompressionStream` missing in Node | Present in Node 20; the test asserts it at start |
| Tier 3 ground truth needs the module to accept a workbook path | `readXlsx(buffer)` already takes an `ArrayBuffer`; the test reads with `fs` |
| Long P2 (deriveView) | Land it panel group by panel group, each with 71/71 |

**Decisions — owner-decided 2026-10-30**

| ID | Question | Owner decision |
|---|---|---|
| D8 | Build script vs §3.8.0 "no build step" | The dashboard is a **standalone page**: no HTTP server and no external reference. Keep `build.mjs` as a dev-time packager only; the delivered HTML is one inlined file |
| D9 | Test strategy | The test must be **complete** and **cover all panels** (five layers, T8.8.12–T8.8.16) |
| D10 | `deriveView` scope | **Remove the duplicate engine.** Every count is computed once, in the spec §3.8 workflow (S4), and `render` paints only |
| D11 | `W-FORMULA` severity | An error token is **never text**. It is data-quality loss: treat it as **absent data**, so it is excluded from every count, and `W-FORMULA` reports it. It does **not** affect the render |

The reasoning below explains the basis of each recommendation; the owner decision column is
authoritative. D9 and the UI scope were confirmed on 2026-10-30 (all panels; the root spec is
authoritative), so no question blocks P1.

**Options and reasoning (for reference)**

| ID | Options | Recommendation |
|---|---|---|
| D8 | Skip the build and ship modules; or keep a dev-time packager | Keep `build.mjs`: it has no runtime dependency and matches §3.9 and MDL. Clarify the wording in the spec |
| D9 | Keep the VM test and add an import test; or replace the VM test | Imports, plus unit, built artifact, all-panel and harness layers |
| D10 | Full `view` object; or a thin adapter over the current renders | Full view object (§3.8.2 rule 1) |
| D11 | Fatal banner (spec §3.8.4); or warning | Fatal, as the spec states |

**Reasoning**

**D8 — Keep a dev-time build script, or ship the modules directly?** The two delivery clauses
disagree on the surface. §3.8.0 says "Load modules with native browser imports. Do not add a
bundler, build step, or npm runtime dependency." §3.9 says the delivered page is one file, the
`file:` origin blocks a local module `import`, the sources stay modular, and "a build script SHOULD
regenerate the delivered HTML from those sources". A page cannot load native local imports under
`file:` and also be one inlined file.

- Option A, ship `src/` and load with native imports: it follows the letter of §3.8.0, but it needs
  a web server. §3.9 forbids that, and the dashboard must open from disk.
- Option B, modular sources plus `build.mjs`: it follows §3.9 and the MDL reference, which the spec
  itself names as the model. It conflicts only with the literal words "build step" in §3.8.0.
- Option C, modules plus a hand-copied HTML: no build, but two copies of the same logic drift.
  That breaks the single-source rule (archived workplan §13, §29) and the reason the pipeline was split.

Recommendation: **B**. The sentence in §3.8.0 guards against a runtime dependency — an `npm`
package, a bundler, a server — not against a short Node script that only concatenates files. It
uses `fs` and `vm` from the Node standard library and ships nothing to the browser. Consequence:
the generated HTML becomes read-only (edit `src/`, then rebuild), and the spec wording should be
corrected to say "no bundler or runtime dependency; a dev-time packaging script is permitted", so
the two clauses stop contradicting each other.

**D9 — Replace the VM test, or keep both?** The current test reads the HTML, extracts the inline
script with a regex, injects a `__H` hook before the IIFE closes, and runs the result in a `vm` with
a DOM stub. It proves the shipped artifact works, but it does not test the module boundary, it
depends on the exact inline shape (the `})();` tail), and it cannot supply Tier 3 ground truth.

- Option A, keep the VM test and add an import test: the widest coverage, but two suites assert the
  same logic and both must be maintained through every future change.
- Option B, import test plus a built-HTML smoke test: §3.8.5 is met directly; the smoke test covers
  what the import test cannot — that the bundle parses, has one script block, and has no local
  reference.

Recommendation: **B**, and port the 71 existing assertions unchanged so the baseline is comparable.
Consequence: the 71 assertions now exercise `src/`, not the HTML; the HTML is covered by the smoke
test and Tier 3. Keep the old VM test in `archive/` for one release, so a rollback is possible.

**D10 — Full `view` object, or a thin adapter?** §3.8.2 rule 1 requires exactly one source for
every aggregation, and §3.8.1 puts that work in S4. Today the numbers are spread across render
functions: KPIs in `renderKPIs`, chart counts in `renderInteractive`, look-ahead rows in
`renderLookAhead`, overdue rows in `renderOverdueList`. Each one filters `STATE.model.packages`
again.

- Option A, a thin `deriveView` that returns only the filtered `active` set: a small change, but the
  duplicate aggregation engines stay, so rule 1 and conformance item 13 still fail.
- Option B, a full `view` object: all aggregation moves to `deriveView`, and `render` only paints.
  This is the large change, and it touches every panel.

Recommendation: **B**, delivered one panel group at a time, with 71/71 and value snapshots after
each group. Consequence: P2 is the longest phase, and the dashboard should not take other feature
work until it lands, so a mixed state is never released.

**D11 — Fatal banner, or warning?** A spreadsheet error token is not a value. If `#N/A` is read as
text, it becomes a package status, a chart category, or a validation value, and every count that
includes it is wrong. §3.8.4 therefore requires one aggregated notice per affected column, at
`level:'fatal'`, routed to `#errBanner`, and explicitly kept out of the row-keyed `model.issues`.

- Option A, a warning in the validation panel: quieter, but it sits among 81 V-08 warnings and is
  easy to miss, and it does not follow the clause.
- Option B, a fatal strip: it is visible at load and names the field, the column letter, and the
  number of error cells. It must **not** hide the dashboard — unlike a parse failure, the data is
  still usable with the affected field treated as absent.

Recommendation: **B**. Consequence: a workbook that contains error tokens will show a fatal strip.
The current workbook has none, so the 19 V-26 warnings and the 71/71 baseline do not change.
### 8.9 Phase P8 — UI conformance follow-up (COMPLETE, 2026-11-01)

**Purpose.** Close the nine UI issues opened by the 2026-11-01 conformance review (I-84 to I-92) and
the long-standing contrast finding (I-77). The data pipeline and the shell are complete; this phase
changes only how the existing information is presented and reached.

**Status: complete (2026-11-01).** Eight tasks are delivered; T8.8.33 is not adopted (D26). Decisions
D22–D26 were confirmed by the owner on 2026-11-01; verification is recorded below.

**Scope.** Chart point detail and KPI card detail on hover (with keyboard and touch), page-based
navigation with a smaller menu, complete validation lists with fixed-size severity marks, and the
small component mismatches. No pipeline, contract or validation-rule change.

**Order and dependencies.** T8.8.31 and T8.8.32 first (small, no test churn), then T8.8.29 and
T8.8.30, then T8.8.27, then T8.8.25 and T8.8.26, then T8.8.28. T8.8.33 is conditional on D26.
T8.8.28 must not start before D22, D23 and D25 are confirmed.

| Task | Work | Issues | Size | Depends on | Deliverable |
|---|---|---|---|---|---|
| T8.8.25 | One shared chart detail window: title, one row per series with swatch and value, footer with total and percentage; cursor-relative with edge flipping | I-84 | M | — | Code; panel tests extended |
| T8.8.26 | Chart detail reachability: keyboard focus shows the same content, tap-to-show on touch, crosshair cursor, no chart clipping, native tooltip retired as the only path | I-84 | M | T8.8.25 | Code; interaction tests |
| T8.8.27 | KPI card detail: card name, exact value, denominator with noun, percentage, one-line definition; placed below the card so it never covers it; help cursor | I-87 | S–M | — | Code; KPI tests |
| T8.8.28 | Page routing: four menu items; each page shows only its own panels; page title follows the page; last page restored; print = current page; the older scroll-navigation test is replaced | I-88 | M | D22, D23, D25 | Code; page tests; one screenshot per page |
| T8.8.29 | Validation list: remove the 80-row cap, render every issue in the scroller, report the true total, keep export parity | I-85 | S | — | Code; count tests |
| T8.8.30 | Severity marks: one fixed-size inline icon per tier (red circle-cross, amber triangle, blue circle-i) with a text alternative, identical in the rules and issue tables | I-86 | S–M | — | Code; markup tests |
| T8.8.31 | Component polish: expander matched to the 26 px icon-button size, column control with its own class and a visible pressed state, two normative names aligned | I-89, I-90, I-92 | S | — | Code; style assertions |
| T8.8.32 | Horizon selector contrast raised to at least 3:1; control-contrast enforcement moved from advisory to hard | I-77 | S | — | Code; harness Tier 4d hard |
| T8.8.33 | Frozen Severity and Rule columns for the validation table — only if sideways scrolling is introduced (D26) | I-91 | S | D26 | Code or recorded N/A |

**Milestones.**

| Milestone | Content | Exit criterion |
|---|---|---|
| M1 | T8.8.31, T8.8.32 | Small fixes verified; Tier 4d is hard and passes | **DONE**
| M2 | T8.8.29, T8.8.30 | Full validation list with standard severity marks | **DONE**
| M3 | T8.8.27, T8.8.25, T8.8.26 | KPI and chart detail work with mouse, keyboard and touch | **DONE**
| M4 | T8.8.28 | Four pages, each carrying only its own panels | **DONE**
| M5 | T8.8.33 or its N/A record | Decision recorded | **DONE**

**Timeline.** One task group at a time, each verified before the next starts; no calendar dates are
committed. Each group follows the P6 pattern: build, five suites, Chromium check, harness tiers,
report.

**What will be created or updated.** `src/render.mjs` (detail window binder, KPI detail content, page
state, validation rendering, severity markup), `Procurement-Dashboard.html` (styles, page markup,
menu), `test/test_panels.mjs` and `test/test_build.mjs` (detail, page and count assertions),
`harness-layout/checks/ppp.mjs` (contrast posture), plus reports and screenshots.

**Risks and mitigation.**

| Risk | Mitigation |
|---|---|
| The chart tests read the browser tooltip today | T8.8.25 changes the test to read the detail payload in the same edit; the old assertion is replaced, not weakened |
| Page routing invalidates the older scroll-navigation assertion and the print layout | T8.8.28 updates the assertion and defines print output in the same task |
| Hover detail is hard to verify in a headless browser | Assert the payload content and the visibility after a synthetic pointer event, and keep one screenshot per page |
| Detail windows clipped by panels | Remove chart clipping in T8.8.26 and assert edge flipping explicitly |
| Scope creep into pipeline changes | Every task keeps the 236-assertion baseline green; no contract or rule edit is allowed in P8 |

**Acceptance criteria.**

1. Every chart point and every KPI card shows detail on hover, on keyboard focus and on tap; the
   content is the agreed label, values, total, percentage and definition.
2. No native browser tooltip remains as the only way to read a value; the chart cursor and the KPI
   cursor signal the affordance.
3. Four menu items; each page shows only its own panels; the last page is restored on reload.
4. The validation panel renders every issue and reports the true total; severity marks are identical
   in size across both tables; the column control shows its state.
5. The horizon selector meets the 3:1 floor and control contrast is enforced hard.
6. All suites pass at or above 236 assertions; harness Tiers 1–4 pass; screenshots exist per page;

**Verification (2026-11-01).**

| Item | Result |
|---|---|
| Suites | 37 + 71 + 22 + 40 + 93 = **263 assertions, 0 failed** |
| Harness | Tier 1 **9/0**, Tier 2 **23/0**, Tier 3 **3/0**, Tier 4 **79/0** (0 advisories, three pages measured) |
| Hover detail | KPI card: name, value, denominator, share, definition below the card; chart point: label, series values, total and share; keyboard focus shows the same window; 0 native SVG titles remain |
| Pages | four menu items; Overview 2 panels, PO Schedule 2, Overdue 1, Data Quality 2; last page restored |
| Validation | 101 of 101 issue rows render; count reads "101 rows"; 101 fixed-size severity icons |
| Contrast | Active menu item and horizon chip meet 3:1; Tier 4d enforced hard |
| Screenshots | `p8_overview_kpi_tip.png`, `p8_overview_chart_tip.png`, `p8_schedule.png`, `p8_overdue.png`, `p8_quality.png`, `p8_overview_dark.png`, `p8_quality_dark.png` |
   workplan, logs and knowledge are updated.

**Decisions (confirmed by the owner, 2026-11-01).**

- D22 the benchmark and validation panels form a fourth page, **Data Quality**
- D23 print output is the **current page**
- D24 the chart percentage base is the **chart total** (the filtered package set for a
  single-series chart, the sum of the plotted series for the PO chart)
- D25 the last page **is** remembered on reload
- D26 frozen validation columns are **not** adopted; the item stays available if sideways
  scrolling is introduced

**References.** Issues I-84 to I-92 and I-77 (`log/issue_log.md`); root spec chart detail, panel,
button and table clauses; `workplan/reports/P6_2_panels_report.md` and `P7_split_header_report.md`
for the patterns this phase follows.

---

### 8.10 Phase P8.1 - chart hover corrections (COMPLETE, 2026-11-01)

**Why.** On the PO plan vs actual chart the floating window kept the first month's payload while the
pointer moved, and no position line appeared. Both were reported after P8 and are logged as I-93 and
I-94.

**Cause.** The chart host itself carried a payload, so any gap between marks (and the axis area) showed
that static payload instead of the hovered month; the binder also had no snap line at all.

**Tasks.**

| Task | Work | Issue | Size | Result |
|---|---|---|---|---|
| T8.8.34 | Separate the host's focus payload from the pointer payload; add one full-height band per month carrying the month payload and a snap position; add a full-row band on the bar charts | I-93 | S | Complete |
| T8.8.35 | Add one `.chart-snap` line per hovering chart, move it to the band centre, hide it on leave, blur and scroll; token-only styling | I-94 | S | Complete |

**Acceptance.** Moving across the PO plot changes the window month by month with no stale content;
the dashed position line appears and follows the hovered month; keyboard focus still shows the host's
first-point payload; bar rows answer anywhere in the row; no native title returns.

**Verification.** 269 assertions, 0 failed (built-artifact and panels layers gained six assertions);
Chromium confirms the window text changes across three months and the snap line moves with it;
screenshot `p8_1_po_snap.png`.

---


### 8.11 Phase P8.2 - warning area pinned below the menu bar (COMPLETE, 2026-11-01)

**Why.** The system notice area scrolled away with the panels; the owner asked for it to stay attached
to the bottom of the menu bar. Logged as I-95 and made normative in spec §3.5 (assertion 18).

**Change.** The notice element moved out of the scrolling body into the content column as its first
block: directly below the menu bar, above the filter strip and above the page body. It is a normal
block in a non-scrolling column, so panel scrolling never moves it; it spans the content width and
covers no sidebar. The former fixed/sticky rules and the welcome offsets were removed.

**Task.**

| Task | Work | Issue | Size | Result |
|---|---|---|---|---|
| T8.8.36 | Move the notice area out of the scroller; pin it as the first block of the content column; drop the fixed/sticky rules; add spec text and assertion 18; add browser assertions for placement and stability | I-95 | S | Complete |

**Acceptance.** A notice is visible directly below the menu bar and above the filter strip; scrolling
the panels does not move it; it spans the content width and covers no sidebar; hidden when empty;
hidden in print; the Warnings toggle still hides and shows it.

**Verification.** 272 assertions, 0 failed (three new browser assertions: outside the scroller,
directly below the menu bar, stable while the panels scroll 240 px); harness Tier 2 keeps the
"warning area stays inside content width" check and passes; Tier 4 unchanged. Screenshot
`p8_2_warning_bar.png`.

---


### 8.12 Phase P8.3 - panel separation (COMPLETE, 2026-11-01)

**Why.** With page routing, two panels share a page, but the content column had no gap and the panel
margin was 0, so two panel borders touched (Overview, PO Schedule and Data Quality). Logged as I-96
and made normative in spec §4.7 (assertion 19).

**Change.** The content column is now a single-column grid with a **14 px** gap, matching the panel
margin the spec defines. Hidden panels take no space and add no gap. Card spacing inside a panel was
checked and kept: 16 px between the two chart cards, 12 px between the validation cards.

**Task.**

| Task | Work | Issue | Size | Result |
|---|---|---|---|---|
| T8.8.37 | Give the content column a 14 px gap; confirm card gaps inside panels; add spec §4.7 and assertion 19; add browser assertions for panel and card gaps | I-96 | S | Complete |

**Acceptance.** On every page with more than one panel the border-to-border distance is 14 px (never
0); the two chart cards keep 16 px and the validation cards 12 px; hidden pages add no gap; print
keeps the separation.

**Verification.** 275 assertions, 0 failed (three new: stacked panels on Overview, PO Schedule and
Data Quality; validation cards 12 px; chart cards 16 px); measured 14 px on all three pages;
harness Tier 2 and Tier 4 unchanged. Screenshot `p8_3_panel_gaps.png`.

---


### 8.13 Phase P8.4 - responsive reflow (COMPLETE, 2026-11-01)

**Why.** Moving the window to a narrower display (or resizing it) left the content at its first-render
width: the content column gained a horizontal scrollbar, the PO chart stayed wide and the split tables
did not shrink. Below 820 px the sidebar was removed from the page entirely, so page navigation was
unreachable. Logged as I-97 and I-98; spec §3.4.1 now states the rule normatively.

**Change.**

- Panels are grid items with `min-width:0`, so a page column can shrink below its content.
- The PO chart is drawn at its host width and redrawn by a `ResizeObserver` on every width change
  (320 px floor); it no longer carries a first-render width.
- The validation table uses percentage column widths (6/12/24/14/12%) with Message taking the rest, so
  it shrinks with its card; the split header re-syncs through the existing observer.
- The control-row message truncates instead of pushing the CSV button out of the panel.
- At 820 px and below the sidebar starts collapsed instead of being hidden; the menu-bar toggle opens
  it, so navigation stays reachable and content keeps the full width.

**Tasks.**

| Task | Work | Issue | Size | Result |
|---|---|---|---|---|
| T8.8.38 | Reflow on any width change: panel `min-width:0`, host-width PO chart with `ResizeObserver`, percentage validation columns, shrinkable control-row text | I-97 | M | Complete |
| T8.8.39 | Keep navigation reachable below 820 px: collapse the sidebar instead of hiding it; the toggle opens it | I-98 | S | Complete |

**Acceptance.** At 1600, 1440, 1280, 1024, 900 and 800 px there is no horizontal page or content
scrolling; the PO chart equals its host width; split headers match their bodies after a live resize;
navigation is reachable at 800 px; moving between widths needs no reload.

**Verification.** 280 assertions, 0 failed (five new resize assertions); 24 page x width combinations
measured with zero overflow and zero split-header delta; 800 px: sidebar collapsed (0 px), toggle opens
160 px with zero overflow; harness Tier 2 23/0, Tier 4 78/0, 0 advisories. Screenshot
`p8_4_narrow.png`.

---


### 8.14 Phase P8.5 - category filter and search compliance (COMPLETE, 2026-11-01)

**Why.** The menu-bar category filter and the search control did not match spec §7.1 B1 and A5: the
trigger carried a funnel icon and a caret, used 11 px uppercase text with a visible border, and showed
its state by rewriting its label instead of a count badge; the floating panel had no note and no
footer; the search field had no affixed submit button. Logged as I-99.

**Change.**

- The trigger is text plus a count badge, 12 px / 600, borderless and transparent in the menu bar,
  with a `.is-filtered` state; the label stays "Categories" and the badge shows the selected count.
- The floating panel follows the normative order: master (All Categories), note, 1 px divider,
  scrollable item list, footer with the count and a Reset action.
- The search panel keeps one row and gains the affixed `.search-btn` submit (36 px, accent fill, white
  glyph, right-rounded), applying the current text; Enter applies it too.
- Help copy follows the new trigger label.

**Tasks.**

| Task | Work | Issue | Size | Result |
|---|---|---|---|---|
| T8.8.40 | Filter trigger (text + badge, no icons, borderless, `is-filtered`) and panel order (master, note, divider, list, footer with count and Reset) | I-99 | M | Complete |
| T8.8.41 | Search submit affixed to the input per A5; Enter applies; one-row panel preserved | I-99 | S | Complete |

**Acceptance.** The trigger has no icon or caret, is 12 px / 600, borderless, and shows a count badge
only when filtered; the panel renders master, note, divider, list, footer in that order; Reset restores
all categories; the search submit is affixed, accent-filled and right-rounded, and applies the text.

**Verification.** 286 assertions, 0 failed (six new control assertions); measured trigger 12 px / 600,
transparent border, 0 icons; badge "15" with "15 of 16 selected" and reset to all; search button 36 px,
accent fill, 6 px right radius; harness Tier 2 23/0, Tier 3 3/0, Tier 4 78/0. Screenshots
`p8_5_filter_panel.png` and `p8_5_filter_search.png`.

---


### 8.15 Phase P8.6 - search column picker (COMPLETE, 2026-11-01)

**Why.** Search applied the query to every searchable field at once, with no way to choose the column.
Spec §7.1 B5 names the attached `.inter-sel.is-attached` as the search-column picker; the panel now
follows the new normative "Search panel composition" rule (spec revision 1.55, assertion 20). Logged
as I-100.

**Change.**

- One row: an attached column picker, the flexible input and the A5 submit. The picker offers
  **All columns** (default) plus Title, Package no., Discipline, Item category and Status; it is
  12 px / 600, left-rounded, with no right border (the input's edge is the divider).
- The chosen column is remembered (`ppp-search-field`) and shown in the control.
- Changing the column re-applies the current query immediately and never clears it; the query applies
  only to that column. The filter chip names the column.
- The placeholder now says "Search the selected column".

**Task.**

| Task | Work | Issue | Size | Result |
|---|---|---|---|---|
| T8.8.42 | Attached search-column picker, field-scoped query, persistence, chip label, one-row layout, spec rule and assertion 20, browser and derivation tests | I-100 | M | Complete |

**Acceptance.** The panel is one row with picker, input and submit aligned; six options with All
columns first; the picker is attached (left-rounded, no right border); a query is scoped to the chosen
column; the column persists; the chip names it.

**Verification.** 292 assertions, 0 failed (three derivation tests and four browser tests); measured
one row (tops 133/133/133), picker 114 px attached; "mechanical" gives 25 with All columns, 23 with
Discipline, 2 with Title and 0 with Status; persistence confirmed; 0 console errors. Harness Tier 2,
Tier 3 and Tier 4 pass. Screenshot `p8_6_search_column.png`.

---


## 9. Scope summary

| ID | Area | Details | Category | Status | Related phase |
|---|---|---|---|---|---|
| S1 | Workbook intake | XLSX reading (Zip/EOCX, sheet XML), Code sheet contract | Pipeline | Delivered | P1 |
| S2 | Model | Contract parsing, blank and token handling, per-field token counts | Pipeline | Delivered | P1–P3 |
| S3 | Validation | V-01 to V-26, severity, Error-table wording | Pipeline | Delivered | P1–P3 |
| S4 | Derivation | One step computes KPIs, charts, look-ahead, overdue and issues | Pipeline | Delivered | P2 |
| S5 | Rendering | Paint-only renderers, panels, tables, CSV | UI | Delivered | P1–P7 |
| U1 | Shell | Title bar, menu bar, sidebar, content, status bar, welcome | UI | Delivered | P6.1 |
| U2 | Panels | Panel head, chart control ownership, split header, drill-down, validation panel | UI | Delivered | P6.2, P7 |
| U3 | KPI, tokens, components | 72 px cards, five themes, canonical text action | UI | Delivered | P6.3–P6.4 |
| U4 | Chart and KPI hover detail | Floating detail window, keyboard and touch | UI | Open (I-84, I-87) | P8 (§8.9) |
| U5 | Validation completeness | Remove the 80-row cap, fixed-size severity icons | UI | Open (I-85, I-86) | P8 (§8.9) |
| U6 | Page structure | Fewer menu items; each page shows only its own panels | UI | Open (I-88) | P8 (§8.9) |
| U7 | Component polish | Expander size, column control, frozen validation columns, names | UI | Open (I-89 to I-92) | P8 (§8.9) |
| U8 | Chart hover corrections | Per-month bands, stale-window fix and the snap line | UI | Delivered (P8.1) | P8.1 |
| U9 | Notice placement | Warning area pinned below the menu bar and outside the scroller | UI | Delivered (P8.2) | P8.2 |
| U10 | Panel separation | 14 px gap between stacked panels; card gaps verified | UI | Delivered (P8.3) | P8.3 |
| U11 | Responsive reflow | Reflow on every width change; navigation reachable at 800 px | UI | Delivered (P8.4) | P8.4 |
| U12 | Filter and search controls | Filter trigger and panel per B1; search submit per A5 | UI | Delivered (P8.5) | P8.5 |
| U13 | Search column picker | Attached column picker; query scoped to the chosen column | UI | Delivered (P8.6) | P8.6 |
| D1 | Data entry | Fill the PO Number column for the 19 issued packages | Data | Open (V-26) | Procurement |

---

## 10. File and artefact reference

| Path | Role |
|---|---|
| `Procurement-Dashboard.html` | Delivered single-file dashboard; the script block is generated |
| `build.mjs` | Inlines `src/` into the delivered page; verifies backtick parity and parses the bundle |
| `src/xlsx-reader.mjs` | Workbook reader (Zip/EOCX, sheet XML) |
| `src/pipeline.mjs` | Code-sheet contract, model build, validation, stage helpers |
| `src/render.mjs` | Derivation (S4), paint-only renderers (S5), CSV builders, shell wiring, boot |
| `test/test_units.mjs` | Unit layer |
| `test/test_pipeline.mjs` | Import-based pipeline layer |
| `test/test_edges.mjs` | Edge-case layer |
| `test/test_build.mjs` | Built-artifact and browser layer |
| `test/test_panels.mjs` | Panels, filters and CSV layer |
| `workplan/reports/` | Phase reports (P1–P5, P6.1–P6.4, P7) |
| `workplan/reports/screenshots/` | Phase screenshots |
| `knowledge.json` | Machine-readable project knowledge base |
| `log/issue_log.md` | The canonical issue log (all issues) |
| `log/update_log.md`, `log/test_log.md` | Revision and test logs |
| `archive/` | Archived workplan copies |

---

## 11. Decision register

| ID | Decision | Recorded in |
|---|---|---|
| D1–D7 | Shell layout: 160 px sidebar, Settings and Help at the bottom, Load in the menu bar, no content toolbar, layout toggle at the right end, theme in Settings, panel title weight 600 | Archived §8.6; spec §3 and §7 |
| D8 | Standalone single-file delivery, no server and no external reference | §8.6, §8.7 |
| D9 | Complete test that covers all panels and every filter | §8.7 |
| D10 | One aggregation step; renderers only paint | §8.7 |
| D11 | Error tokens are absent data; a formula notice never blocks the render | §8.7 |
| D12 | Search filters the package set by title, package number, discipline and status | §8.7 |
| D13 | Export offers the validation CSV and the look-ahead CSV | §8.7 |
| D14 | Layout toggle cycles KPI density 6 / 3 / 2 and persists | §8.7 |
| D15 | Keep the split header; the sticky-header harness rule does not apply inside a scroller | §8.7 |
| D16 | No column sizing or resize grips; declared as not offered | §8.7 |
| D17 | A declared inline classic script satisfies the standalone delivery rule | §8.7 |
| D18 | Implement the split-header gutter and lock-step, then enable the pairing checks | §8.7 |
| D19 | KPI cards show detail on hover (name, value, denominator, percentage, definition) | Issue log I-87 |
| D20 | Chart hover shows label, series values, total and percentage | Issue log I-84 |
| D21 | Fewer menu items; each page shows only its own panels (page map pending) | Issue log I-88 |
| D22 | Benchmark and validation form a fourth page, Data Quality (confirmed 2026-11-01) | §8.9 |
| D23 | Print output is the current page (confirmed 2026-11-01) | §8.9 |
| D24 | Chart percentage base is the chart total (confirmed 2026-11-01) | §8.9 |
| D25 | The last page is remembered on reload (confirmed 2026-11-01) | §8.9 |
| D26 | Frozen validation columns are not adopted; reopen only if sideways scrolling is added (confirmed 2026-11-01) | §8.9 |

---

## Appendix A — Historical status narrative (verbatim, pre-1.49)

The Rev 1.48 status line and its two header paragraphs are kept verbatim so no release detail is
lost. Future status belongs in the header and the revision table only. References to §7 inside the
following text and inside old revision rows mean the issue log after the Rev 1.49 migration.

> **Status**: Maintenance — **Rev 1.31 harness: 71 passed, 0 failed.** **I-80 resolved.** **I-81 implemented:** **V-26** (PO Actual set, PO Number blank — warning) is live and reports **19 warnings** on the current workbook. **Rev 1.32 = shell sample study for review** — no PPP code change; shell adoption decisions **D1–D7** are open (§8.6). **Rev 1.33 = data pipeline status confirmed** — spec §3.8 pipeline **not created**; I-76 open (§8.7). **Rev 1.34 = pipeline build plan** — five phases, 16 tasks, D8–D11 (§8.8). **Rev 1.35 = decision rationale added.** **Rev 1.36 = D8–D11 owner-decided; I-76 approved** — standalone page, complete four-layer test, one aggregation engine, error tokens as absent data. **Rev 1.37 = D9 and UI scope confirmed** — the test covers Panels 1–7, and the root `Dashboard-UI-Design-Spec.md` is authoritative for every dashboard; **P6** (UI conformance) added. **Rev 1.38 = P1 pipeline extraction complete** — `src/xlsx-reader.mjs`, `src/pipeline.mjs`, `src/render.mjs` and `build.mjs`; delivered HTML is generated; **71/71**, no page error, KPI and warning values unchanged. **Rev 1.39 = P2 stage separation** — one `deriveView()` step computes every number; the renderers only paint; per-stage error boundaries; module-level state moved into `STATE`. **Rev 1.40 = P3 value normalization** — `isExcelError()`, blank and error token both absent, per-column `W-FORMULA` fatal notice. **71/71**. **Rev 1.41 = P4 five-layer test suite** — units, import-based pipeline, edge cases, built artifact, all panels, plus the harness Tier 3 adapter. **212 assertions green**; Tier 3 passes (KPI 129, filter 5). Tier 1/2 shell checks stay open for P6. **Rev 1.42 = P5 close-out** — §8.7 is **CONFORMING to §3.8**; acceptance criteria, knowledge base and logs are aligned. P6 (shell and panel conformance) remains. **Rev 1.43 = P6 opened** — the three undefined menu controls are decided (D12–D14) and P6 is split into P6.1 shell, P6.2 panels, P6.3 tokens/components and P6.4 conformance. **Rev 1.44 = P6.1 shell complete** — two-row header, menu bar (Load / Export / Search / Warnings / layout), 160 px nav sidebar with Settings and Help at the bottom, warning area inside the content zone. **Tier 1 8/1** (only the module-script marker, D8 conflict) and **Tier 2 23/0**; 212 assertions still green. **Rev 1.45 = P6.2 panels complete** — every panel has a `.panel-head` title row with Help and Collapse, a DOM-order panel number, and a collapsible state that survives every re-render (localStorage `ppp-pc-<id>`); single charts sit in a bordered `.c-card` with their controls above the plot; the look-ahead, overdue, validation and benchmark lists are bounded tables with a split header (header outside the 340 px scroller), a row count in the control row and a CSV button; overdue rows use a real drill button (`aria-expanded` / `aria-controls`, rotating chevron, one row open at a time) with `.sub` / `.sub-inner` detail rows; the validation panel drops the `<details>` disclosure and shows a `.v-summary` count strip, a de-duplicated Rules table (one row per code, with a count) and an issue card with a Columns toggle (6 → 4 → 6). **Rev 1.46 = P6.3 KPI, tokens and components complete** — the KPI cards follow spec §5 (72 px, two lines only, 22 px/700 value, 10 px/400 uppercase label, status class sets the 3 px strip, `auto-fit minmax(210px,1fr)`); the sub-status line and the inline strip colour are gone. Panel titles are 13 px/600. Colour literals in component rules are replaced by tokens (`--on-navy`, `--on-navy-soft`, `--navy-dark`, `--text2`, `--row-stripe`, `--err`) and `--font-ui` now holds the shared stack. The four CSV buttons moved from the parallel `.csv-btn` class to the canonical `.btn-secondary` with a `data-act="csv"` hook; no legacy class remains. **232 assertions** (37 + 71 + 22 + 24 + 78); Chromium 1440 light/dark; 0 console errors; Tier 1 8/1, Tier 2 23/0, Tier 3 3/0, Tier 4 70/9 (unchanged). Known gap recorded in §8.3: only light and dark themes exist; the five-theme token set and the dark surface remap are open for P6.4. **Rev 1.47 = P6.4 conformance record complete — P6 closed.** The five spec themes now exist (`light`, `dark`, `sky`, `ocean`, `presentation`) as pure token remaps with a Settings picker, persistence and readable text in every theme; the dark block also remaps `--surface`, `--border`, `--text` and `--row-stripe`, and component text uses `--ink`. §8.9 records the generic checks, the §8.2 assertions 1–17 and every deviation with its end state. **236 assertions** (37 + 71 + 22 + 28 + 78); Tier 1 8/1, Tier 2 23/0, Tier 3 3/0, Tier 4 70/9. Four deviations are recorded: the harness sticky-`thead` check versus the mandated split header; the I-95 column-sizing grips; the Tier 1 module-script marker versus D8; and the unverified split-header pairing invariants (a scrollbar gutter and lock-step are not yet implemented). They are carried to a follow-up **P7**. **Rev 1.48 = P7 complete — split-header contract and harness acceptance.** Every bounded table now ships the §7.2.15 contract through one helper: a `.splitcard` container, a clipped `.vheadwrap` header port, a trailing `--ds-sbw` gutter column, data-column widths pinned to the body, `ResizeObserver` re-sync and horizontal lock-step. Harness results are now **Tier 1 9/0, Tier 2 23/0, Tier 3 3/0, Tier 4 85/0 (1 advisory: I-77)**. The harness accepts a declared inline classic script (D17), exempts the body half of a split pair from the sticky and header-height rules, scopes sticky to tables inside a `.tableScroll`, and compares the fragment width to body + scrollbar (D15). I-95 grips are closed as N/A for this dashboard (D16). The four P6.4 deviations are resolved. **`codecheck.md` retired** — all original audit items live in **§14**; **§15.17** logs the 2026-10-02 independent review (**I-55…I-59**). Parked backlog: **I-10, I-41, I-54, I-75, I-77, I-79** + parser rail **P-3** (P-4 / P-5 closed). **I-54** (validation CSV `desc` column) still needs a product decision. Workbook noise (**V-08** ×81, **V-20** ×1) is data/template, not code defects (§15.11 §D).

> ⚠ **There are two workplan files.** This is the current one. The earlier Chinese workplan (`WORKPLAN.md`, Rev v2, 2026-09-15) was moved to **`arch/WORKPLAN.md`** and is kept for history only — do not edit it.
> **Rev 1.13 = dead-code cleanup (§15.12).** A sweep for unreachable / dead code found that **I-25 was not really "a dead helper" but "a rule that could never fire"**: V-12's engineer-variant detector added a raw string to a Set **keyed by that same raw string**, so every Set had size 1 and `s.size > 1` was unreachable by construction.
>
> **Rev 1.14 = I-26 re-scoped (§15.13)** — pie cap is `CHART.pie.topN` with `otherLabels` tooltip; bar-mode export refuted (I-44). **Superseded by Rev 1.17 harness verification.**

---

## Appendix B — Contents entries for sections removed before Rev 1.49 (verbatim)

The Rev 1.48 contents table listed sections 9–16. Those sections do not exist in the document; the
rows are kept here so the claims are not lost.

| 9 | Testing Checklist | |
| 10 | Future Enhancements (Backlog) | |
| 11 | File Reference | ⚠ line numbers stale — see I-41 |
| 12 | Quick Start for New Developers | |
| **13** | **UI Architecture Review — 5-Layer Target Model** | **APPLIED — issues I-27…I-40 all resolved (Waves 1–3)** |
| **14** | **Cross-audit of `codecheck.md` (archived)** | **APPLIED — I-42…I-48 resolved (Wave 0) · permanent audit record · source file **retired Rev 1.18** |
| **15** | **Verification Run** | **APPLIED · syntax + headless end-to-end pipeline verified · §15.5 = issue log (I-49…I-52) · §15.8 = closure log · §15.9 = I-11 feature log · §15.10 = I-51 re-verification · §15.11 = pending-issue audit · §15.12 = dead-code cleanup · §15.13 = I-26 re-scope · §15.14 = regression harness correction · §15.16 = V-22** |
| **15.11** | **Pending-issue audit** | **0 items need a decision · 6 parked backlog + parser rails** |
| **15.12** | **Dead-code cleanup** | **I-25 closed (V-12 was unreachable by construction) · I-12 found stale · 2 non-dead items confirmed** |
| **15.13** | **I-26 re-scope** | **Half (b) refuted — already fixed by I-44 · half (a) closed — cap is a token, Other lists what it merged** |
| **15.17** | **Independent review (2026-10-02)** | **I-55…I-59 backlog · do not re-file §14/codecheck items** |
| **16** | **MDL Parity — P1–P10 Reconciliation & Issues** | **authoritative parity log; supersedes arch/WORKPLAN.md §0d/§0e** |

---

## Appendix C — General-rule material moved out (archive index)

| Old location | What it held | Where it lives now |
|---|---|---|
| §8.2 | How PPP originated two shared rules (icon-button geometry, warning bar) | Spec §7.1 A4 and §3.5; verbatim in archived workplan §8.2 |
| §8.6 | Shell sample study, measurements, D1–D7 rationale | Spec §3; verbatim in archived workplan §8.6 |
| §7 | Issue records I-01 to I-81 | Verbatim in `log/issue_log.md`, migrated-history appendix |

This workplan records only PPP-specific design, decisions, evidence and phases. Anything a dashboard
would do the same way is the spec's business.

---

