# PPP Dashboard — Developer Workplan

> **Project**: Procurement Package Plan (PPP) Interactive Dashboard  
> **Version**: 1.22  
> **Date**: 2026-10-15  
> **Status**: Maintenance — **Waves 0–3 and Rev 1.17 harness (63 passed, 0 failed) remain the baseline** (see §15.16 §E). **`codecheck.md` retired** — all original audit items live in **§14**; **§15.17** logs the 2026-10-02 independent review (**I-55…I-59**). Parked backlog: **I-10, I-41, I-54, I-75, I-76, I-77** + parser rail **P-3** (P-4 / P-5 closed). **I-54** (validation CSV `desc` column) and **I-76** (pipeline modularisation) still need a product decision. Workbook noise (**V-08** ×119, **V-20** ×1) is data/template, not code defects (§15.11 §D).

> ⚠ **There are two workplan files.** This is the current one. The earlier Chinese workplan (`WORKPLAN.md`, Rev v2, 2026-09-15) was moved to **`arch/WORKPLAN.md`** and is kept for history only — do not edit it.

> **Rev 1.13 = dead-code cleanup (§15.12).** A sweep for unreachable / dead code found that **I-25 was not really "a dead helper" but "a rule that could never fire"**: V-12's engineer-variant detector added a raw string to a Set **keyed by that same raw string**, so every Set had size 1 and `s.size > 1` was unreachable by construction.
>
> **Rev 1.14 = I-26 re-scoped (§15.13)** — pie cap is `CHART.pie.topN` with `otherLabels` tooltip; bar-mode export refuted (I-44). **Superseded by Rev 1.17 harness verification.**

---

## 0. Contents — quick navigation

| § | Section | Note |
|---|---------|------|
| 1 | Summary & Purpose | §1.3 = guiding principles (the **Layered** principle points to §13) |
| 2 | Revision History | Rev **1.23** = current (**I-77 `3m` chip contrast filed**); Rev 1.22 = I-76 pipeline modularisation filed; Rev 1.21 = spec v1.1 cleanup; Rev 1.20 = shared-design standardisation — PPP canonical for §7.5 filters + §3.5 warning bar; Rev 1.19 = I-55…I-59 bug repairs; Rev 1.18 = §15.17 review, `codecheck.md` retired; Rev 1.17 = harness green (63/63) |
| 3 | Functions & Workflow Chart | ⚠ line numbers stale — see I-41 |
| 4 | Excel Data Structure — Code Sheet Contract | |
| 5 | Dashboard Charts — Detailed Specifications | |
| 6 | Validation Rules V-01 … V-25 | V-21 = Error-table coverage (warning only) |
| 7 | Issues & Actions I-01 … I-26 | §7.1 = I-23 root-cause log |
| 8 | Developer Guide — Common Tasks | |
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
| **1.1** | **2026-09-16** | UI Design | **BUGFIX (I-23) — offline XLSX parser no longer loses cells after self-closing empty cells (`<c r="M2" s="7"/>`). Restores Engineer coverage 31/122 → 122/122, all 8 engineer names, all date columns. See §7.1 root-cause log + corrective/preventive actions** |
| 1.2 | 2026-09-16 | UI Design | **DRAFT — PENDING APPROVAL.** Added **§13 UI Architecture Review — 5-Layer Target Model**: as-built structure, target layer map, naming/token conventions, accessibility baseline, issues **I-27 … I-40**, and a P0/P1/P2 roadmap. **No code was changed in this revision.** |
| **1.3** | **2026-09-16** | UI Design | **Wave 1 implemented**: I-27 `METRICS` registry (add-a-chart is now **one place**, not four) and I-30 single `STATE` object + `render(STATE)` (DOM write-only). Wave 0 (P0-B: I-42…I-48) remains in place. **Structural refactor only — no visual or behavioural change.** See §14.7. |
| 1.4 | 2026-09-16 | UI Design | **Wave 2 implemented**: I-31 `buildDashboard` split (`parseWorkbook → buildModel → render`), I-32 validation **rule table**, I-34 semantic colour tokens, I-35 `CHART` geometry object, + I-46 folded into I-32. I-11 deferred (behaviour-changing feature, not a refactor). Structural only. See §14.8. |
| **1.5** | **2026-09-16** | UI Design → superseded | **Wave 3 implemented (P2 — final wave)**: I-28 per-metric behaviour as a registry `note` capability (no `key===…` branch), I-29 dead `htmlHBar()` deleted (one bar renderer), I-33 whole script wrapped in an **IIFE** (≈40 globals removed), I-36 inline styles gone (with I-29), I-37 `.ds-*` primitive naming (`.text-bad`→`.ds-bad`, `.warn-text`→`.ds-warn`, `.note-lead` retired), I-38 table styles scoped to `.ds-table`, I-39 **reduced-motion + print + dark-theme** blocks, I-40 a11y baseline (`role="img"`/`aria-label` on charts, `scope="col"` on headers, popup-role mismatch fixed, global `:focus-visible`), and I-47 filter-panel `max-width` + ellipsis labels. **All five roadmap waves now complete.** Structural only — see §14.9. |
| **1.6** | **2026-09-16** | verification | **§15 Verification Run — the Wave 0–3 verification gap is closed.** The script compiles (**SYNTAX OK, 62,260 chars**) and a new headless harness (`test/test_pipeline.mjs`) runs the *shipped* script against the *real* workbook end-to-end: **16/16 assertions pass**, 14 chart renders produced. This confirms every structural claim in §14.6–§14.9 **by execution**, not just by inspection. Also records that the workbook has moved on (Code!C Data Type now populated → **V-16 resolved**; `Code!Q:R` Error table now populated → **I-11 unblocked**; `List End Row` now 300) and logs **I-49…I-52**. No code changed. |
| 1.7 | 2026-09-16 | UI Design | **I-51 fixed (§15.7)** — `LOOKUP_HEADERS` gains a `categoryCode` key, `lookups.categoryCode` is now read, and `lookupMeta.category.codeCol` points at **N** (`Category Code`) instead of **O** (`Item Category`). Three one-line changes; **no rendered output changes** (nothing consumed `codeCol` yet — the value is correct data for I-11). Harness gains two I-51 assertions. |
| 1.8 | 2026-09-16 | UI Design | **I-49 / I-50 / I-52 closed (§15.8).** `Status Category` dropped from the contract — V-18's false positive eliminated **at the source**; `List End Row = 300` accepted as a template bound, so V-20 stays a warning; the workbook owner adds the missing V-19/V-20 rows to `Code!Q:R`. `renderCodeMap()` now reports the column location of every block (description column **and** paired code column) and is derived from `lookupMeta`, deleting the duplicate contract copy that caused I-49. |
| 1.9 | 2026-09-16 | UI Design | **I-11 implemented — the rule wording now comes from the workbook (§15.9).** `LOOKUP_HEADERS` gains `errorCode` / `errorDescription`; new row-aligned `readLookupMap()` builds `model.errorTable` from `Code!Q:R`; every issue carries `desc`; the validation panel gains a deduplicated **Rule reference** list plus a tooltip on each rule code; `renderCodeMap()` reports where the Error table lives; new **V-21** warns — never errors — when a fired code has no row in the table. Also: `isIssued()` lost its dead `statusCategory` branch (I-49 residue) and now canonicalises the status first (**I-53**). |
| 1.10 | 2026-09-16 | UI Design | **I-51 re-verified — the first *executed* run of the harness caught two defects in the I-49/I-51 window (§15.10).** (1) The I-51 regression test asserted `Array.isArray(...)`, which **passes on an empty array** — it could not fail, so "categoryCode now resolves" was unverified for two revisions. It now asserts the real contract, and the finding was that **`Code!N` (Category Code) was header-only at the time** — an empty `lookups.categoryCode` was *correct*, a worksheet gap not a code bug. (2) `renderCodeMap()` printed `Item Category: col O · code col N · 19 values`, crediting the **blank** code column with the description column's count; `lookupMeta` now carries `codeN` and a blank code column renders **`(empty)`**. Harness **42 → 46 assertions, all passing**. **No chart/KPI change.** |
| 1.11 | 2026-09-16 | UI Design | **Pending-issue audit (§15.11)** — every table swept for non-closed rows. The single decision item (I-05b / V-22) was surfaced here and then resolved by the workbook owner. **Zero decision items remain; 6 parked backlog + parser rails.** Recorded explicit **non-issues** (V-08 ×119, V-20 ×1) so they stop being re-raised. |
| **1.12** | **2026-09-16** | UI Design | **I-05b closed on the workbook side (§15.11 A).** `Category Code` (N) now carries real values and `Lead Time` is confirmed **days** — column K re-headed `Estimate Lead Time (Days)`, numeric in every cell — so the Lead Time chart reads real durations instead of sinking into *"Not set"*, and **V-22 is not needed for this workbook**. The parser's number branch gained a comment documenting that it reads the cached `<v>` and deliberately never evaluates `<f>` (formula-caching behaviour, its limits, and the V-04 surfacing path are all recorded). **Behaviour unchanged** — the code edit is a comment; **VERIFICATION PENDING** (shell unavailable). |
| **1.13** | **2026-09-16** | UI Design | **Dead-code cleanup (§15.12) — I-25 closed, and I-12 found stale.** `normPerson()` deleted (defined, never called). **The real defect was not the helper but V-12 itself: it was unreachable by construction** — the engineer tally stored a raw string in a Set keyed by that same raw string, so every Set held exactly one member and `size > 1` could never hold. V-12 now keys **loosely** (collapsed slash + whitespace) while the Set holds **distinct raw spellings**, so variants like `Dilip/Siva` vs `Dilip / Siva` are reported, with genuinely different names kept separate. Verified **not** dead and left alone: `TYPE_ALIASES` / `normType` (used by `parseFieldTypes`). Harness gains **4 V-12 assertions** (both directions + the shipped workbook must stay clean). **VERIFICATION PENDING** (shell unavailable). |
| **1.14** | **2026-09-17** | UI Design | **I-26 re-scoped; half (a) closed, half (b) refuted (§15.13).** The row bundled two claims. **(b) "bar-mode Copy/Download target `svg-eng` does not exist" is FALSE** — `renderCat()` passes `svgId:meta.svg` to **both** renderers and `svgHBar()` honours it, so the bar-mode SVG exists; the five button `data-svg` values match `METRICS[].svg` one-for-one and the buttons sit **outside** the container that `innerHTML=` replaces. It described **pre-Rev-1.1** code, already fixed by Wave 0 (I-44). **(a)** the pie cap `8` is now the token **`CHART.pie.topN`**, and the merged slice carries **`otherLabels`** so a tooltip lists the names it swallowed — **visible label text deliberately unchanged**. Also removed a trailing `.filter(i=>i.value>0)` that was a provable no-op (dead decoration that read like a guarantee). Harness gains **7 assertions**. **VERIFICATION PENDING** (shell unavailable). |
| **1.15** | **2026-09-17** | UI Design | **Regression harness corrected (§15.14) — no dashboard code changed.** The first *executed* run of the Rev 1.13/1.14 harness (user-run: **55 passed, 4 failed of 59**) showed all 4 failures were **stale test assumptions, not code defects**. The workbook's `Category Code` (N) is now populated (19 values), so three assertions that had encoded "Category Code is blank" (`category.codeN === 0`, `code col N (empty)`, "no `code col N (\d+)`") were wrong; and the V-12 assertion wrongly expected `Dilip/Siva`, `Dilip / Siva` **and** `Siva /Dilip` in one report line, but a reversed name is a separate loose key and a singleton, correctly left un-flagged. `renderCodeMap()` / `lookupMeta` re-read to confirm the rendered `code col N (19)` is N's *own* count. Four assertions corrected; the `(empty)` guard stays in the dashboard code for any future empty column. Re-run → **all 59 pass, 0 failed**. |
| **1.16** | **2026-09-17** | UI Design | **V-22 implemented (§15.16) — the last validation gap (empty lookup code column fires a warning).** `validate()` now emits **V-22** (warning, app-only) when a lookup block's code column is located but empty while its description column carries values. Three harness assertions added (**63 total**). Dashboard code verified on disk (rule present immediately after the V-18 loop); end-to-end run **pending** (shell unavailable) — expected **63 passed, 0 failed**. |
| 1.17 | 2026-09-24 | verification | **End-to-end harness executed and green — closes the test items (see §15.16 §E / §15.11 §D).** `node test/test_pipeline.mjs` runs the *shipped* script against the *real* workbook: **63 passed, 0 failed**, 14 chart renders, zero uncaught throws. Closes **I-24** (the regression harness now exists and runs), **P-4** (self-closing-cell fixture exercised by the real workbook's 1818 empty styled cells), **P-5** (the harness is the openpyxl-equivalent golden cross-check). **P-3 remains open** — the cell-count invariant needs a code change in `parseSheet()`, not covered by the harness. All prior "VERIFICATION PENDING" flags are superseded. |
| **1.18** | **2026-10-02** | docs · review | **§15.17 independent review logged; `codecheck.md` retired (stub only).** All original codecheck findings remain in §14 (I-42…I-48). New backlog: **I-55** (criticality chart buckets by code while PPP may store descriptions), **I-56** (CSV load without Code sheet), **I-57** (category filter "none selected" → empty dashboard), **I-58** (`esc()` omits `"` in HTML attributes), **I-59** (welcome copy missing space after `</b>`). **No dashboard code changed.** |
| **1.19** | **2026-10-03** | UI Design | **Bug repairs — I-55…I-59 closed.** I-55 / I-57 / I-58 / I-59 were resolved in commit `8f929a6` and are now reflected in §7 (dual-match criticality via `critItems()`, empty category filter → "all", `esc()` escapes `"`, welcome space added). **I-56 fixed this revision** in `Procurement-Dashboard.html`: `handleFile()` now rejects `.csv` up front with a clear message ("CSV export cannot be re-imported — it contains only the Package Plan, not the Code sheet… load the original .xlsx workbook"); the file input `accept` is limited to `.xlsx` and the welcome copy no longer advertises CSV. No chart / KPI / validation logic changed; the `parseCSV()` helper is retained for a possible future Code+PPP pair import. |
| **1.20** | **2026-10-10** | UI Design · docs | **Shared-design standardisation (spec rev 2026-10-10) — PPP is now the canonical reference for two shared designs.** **(a) §7.5 Top-bar filters:** PPP's design is the standard — master "All [dimension]" checkbox (no Clear button), badge `All [dimension]` / `N of M selected` / `None selected`, `.is-filtered` accent, a single one-line dismiss hint, re-render deferred until the dropdown closes, excluded values not offered, empty selection = zero rows, AND-combined atomic pass. MDL was rebuilt to match (**MDL I-61/I-60**). PPP's *own* remaining deltas are re-filed in **I-75**: deferred re-render, dismiss hint, `.active` → `.is-filtered`, and **reversing I-57 so empty = zero rows** (the All/Clear-button variant described by the old I-75 is retired). **(b) §3.5 System / Config warning bar:** PPP's unified fixed `#errBanner` (three severity tiers, unified with load failures, `role="alert"`, `body.banner-open` + `--banner-h` clearance) is the standard; **PPP already conforms — no PPP code change required**; MDL was rebuilt to match (**MDL I-62**). Spec updated in the same pass: §3.5 and §7.5 rewritten to single canonical variants (rev 2026-10-10), §7.10 errBanner note, §12.1 governance (standardisation rule + cross-document update rule), and the stale §13.3 "System banner" / "Filters" rows + the "unused `.sys-banner-item.warn`" cleanup bullet corrected. **No PPP dashboard code changed in this revision.** |
| **1.22** | **2026-10-15** | docs | **I-76 filed — pipeline modularisation backlog.** PPP remains a monolithic single-file HTML; `buildModel` / `validate` / `render` stages exist logically but are not importable as Node modules. This blocks full Tier 3 data verification in the `harness-layout` tool and prevents independent pipeline unit testing equivalent to MDL's `test/test_pipeline.mjs`. Logged as **I-76** in §7. No code changed. | — `Dashboard-UI-Design-Spec.md` updated to v1.1.** All project-specific content (MDL variant blockquotes, PPP function names, MDL issue cross-references, dashboard-specific panel numbers, PPP-specific horizon options, MDL sub-tier KPI field references, stale B4 non-compliant note, `mdl_hideWarnings` key, PPP dark-theme reference) removed or generalised. Zero contradictions with this workplan — all PPP-specific content remains correctly documented here. **No PPP dashboard code changed.** |
| **1.23** | **2026-10-18** | docs · harness | **I-77 filed — PPP `3m` horizon chip below the contrast floor.** The selected chip of the Look-ahead horizon selector (`1m / 2m / 3m / 4m / 6m`, default `3m`, class `on`) renders `rgb(98, 118, 142)` text on `rgb(172, 182, 195)` — measured **2.27 : 1** by `harness-layout` Tier 4d `lintControlContrast`, under the 3:1 UI-text floor (spec §7.1). It surfaces as an **advisory** because PPP runs `chrome.controlContrast: 'advisory'`; PPP currently reports 87 passed / 19 failed / 1 advisory. Logged as **I-77** in §7 (Backlog). **No PPP dashboard code changed.** |
| **1.24** | **2026-10-21** | docs | **I-78 filed — PPP text-action classes are now non-conforming against shared spec §7.1 A3.** The spec was made normative on 2026-10-20 (MDL I-71): `.btn-secondary` is the canonical A3 class for every text action. PPP still ships `.dlBtn` / `.copyBtn`, now recorded as **legacy, non-conforming aliases** with a required migration and a bar on any new control using them. The styles currently resolve identically, so there is **no visible defect** — the risk is latent drift, because the class name is the only link between a rendered control and its governing spec rule. Logged in §7 as **Backlog — deferred 2026-10-21**, to be processed later. MDL I-71 remains `OPEN` pending this. **No PPP dashboard code changed.** |
| **1.26** | **2026-10-22** | docs · UI Design | **Shared spec generalised (v1.2 → v1.3) — PPP-specific content moved here.** `Dashboard-UI-Design-Spec.md` is now project-neutral; it gained §0 **Definitions**, §8 **Conformance & Testing** (two-layer check model, 14 required assertions, enforcement posture, conformance record, definition of done) and §9 **Adopting this spec**. Everything belonging to PPP alone now lives in **§8 Shared-Spec Conformance Record**: PPP's dashboard-specific choices (§8.1 — `.card`, inline nav, its own status vocabulary, advisory enforcement posture), its role as the origin of two shared rules (§8.2 — A4 icon geometry and the A3 migration, I-78), its migration state (§8.3 — conforming on A3, **non-conforming on §7.2.15 split header**, one advisory contrast finding I-77), its chart specifics (§8.4) and its evidence (§8.5). |
| **1.25** | **2026-10-21** | dev · docs | **I-78 closed — PPP migrated to the canonical A3 class.** `.dlBtn` / `.copyBtn` renamed to `.btn-secondary` in `Procurement-Dashboard.html` (markup L402, L1557–1558; delegated handler L2104) and the old names deleted. Two points beyond a plain rename: (a) the delegated handler now keys on `data-act="copy"` / `data-act="dl"` instead of the class, because one shared class cannot discriminate the two actions — behaviour belongs on a data attribute, presentation on the class; (b) `.btn-secondary` was joined to PPP's existing A3 rule (L141 + `:hover` L146) so the shared class actually governs styling rather than sitting decorative. Declared values were already identical, so **no visual change**. Shared spec §7.1 A3 updated: the legacy-alias row is gone and a "Migration — completed 2026-10-21" note records both consequences. Verified `MDL/test/test_grid.mjs` **43/43** and `harness-layout --dashboard ppp` **87 / 19 / 1 / 11** = baseline. Note the PPP harness is mildly flaky run-to-run on the I-77 contrast advisory (1 of 9 runs reported 88 passed / 0 advisory); measured 6/6 stable at baseline afterwards, so it is pre-existing raciness, not this change. **MDL I-71 closed as a result.** |
| **1.27** | **2026-10-29** | docs · UI Design | **I-79 filed — PPP expandable / drill-down design must be updated to the standardized spec §4.4 / §7.1 B4 model.** Spec rev 1.39 (2026-10-29) makes the drill-down normative: `.expandable` owner row; real `<button class="drill-btn">` (an `.icon-btn` variant) carrying `aria-expanded` + `aria-controls`; `.drill-chev` rotated 90° when expanded (no glyph swap); sibling `.sub` detail with `.sub-inner`; accordion (one open at a time); keyboard Enter/Space; delegated listener; and `--line` / `--soft` / `--muted` / `--navy` / `--blue` tokens. PPP's current `Overdue by Stage` drill-down uses `<td class="ovl-chev">` with `aria-expanded` on the `<tr>` (now forbidden by §7.1 B4), and hard-coded `#f3f7fc` / `#fafbfc` colours. Migration: replace the `td` chevron with `.drill-btn` / `.drill-chev`, move `aria-expanded` onto the button, rename `.ovl-detail` → `.sub` / `.sub-inner`, and swap colours to tokens. Logged as **I-79** in §7 (Backlog). **No PPP dashboard code changed.** |

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
| `svgStage(pkgs)` | — | **Removed** — Stage Plan Coverage retired (consolidated into interactive panel, §16.7-F) |
| `renderPOMonthly(pkgs)` | L918 | Monthly grouped bar: PO Plan vs Actual |
| `renderLookAhead(pkgs, from)` | L1546 | Table: POs planned in next 90 days (from = today) |
| `renderDelays(pkgs, asOf)` | — | **Removed** — PO Issuance Delays retired (§16.7-A); one canonical overdue source remains |
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
| 6 | Project Start Date | `2026-09-14` | **Date** | **Required** — project start date (Excel serial 46280). The dashboard's operational reference date (as-of) is always **today**, not this cell. Legacy label "AsOf Date" still accepted by the parser. |
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

> These five charts are now rendered inside the single **Interactive Chart Panel** (§16.7-F), which sits above the S-curve (§5.4). The per-card bar↔pie toggle (persisted) and the data providers are unchanged — only the container changed.

| Chart | Key | Data Source | Ordering | Special Handling |
|-------|-----|-------------|----------|------------------|
| Package Status | `status` | `tally(pkgs, 'status')` → canonicalized via Code sheet status list | Code sheet order (NS, MR, VI, PO, VDA, FAB, FAT, DEL, RI) | Blanks → "Not Specified (blank)" grey |
| Discipline | `discipline` | `tally(pkgs, 'discipline')` | Descending count | — |
| Engineer Workload | `engineer` | `tally(pkgs, 'engineer')` | Descending count | Normalized names; blanks → "Unassigned (blank)" |
| Criticality | `criticality` | Code sheet codes 0–4 + descriptions | Code order (0,1,2,3,4) | Extras (not in Code) → 🟡 warning color; blanks → grey |
| Lead Time | `leadtime` | **Bar**: Coverage (Estimated/Not) + 4 buckets (≤90, 91–180, 181–270, >270) | Fixed bucket order | **Pie**: buckets only (excludes coverage rows) |

**Bar Chart SVG** (`svgHBar`): 760×dynamic, left label column (240px), horizontal bars, value labels right-aligned.
**Pie Chart SVG** (`svgPie`): 760×dynamic, donut (R=100, r=58), center total, legend right, top-8 + "Other".

### 5.3 Stage Plan Coverage (Grouped Bar) — **RETIRED**

> Removed in the 2026-10-04 consolidation (§16.7-F). The Stage Plan Coverage card was retired and replaced by the interactive panel's **Stage Overdue** and **Schedule Health** breakdowns, both built on the shared `stageIsOverdue`/`stageDue` helpers. The spec below is retained for history.

| Stage | Plan Field | Actual Field |
|-------|------------|--------------|
| MR | `mrPlan` | `mrActual` |
| PO | `poPlan` | `poActual` |
| VD | `vdPlan` | `vdActual` |
| FAT | `fatPlan` | `fatActual` |
| ROS | `rosPlan` | `rosActual` |

**SVG** (`svgGrouped`): 5 categories × 2 series (Planned=#0066CC, Actual=#34C759), Y-axis 0–max, legend bottom.

### 5.4 PO Plan-vs-Actual S-Curve Panel (two side-by-side charts)

- **Chart 1 — Cumulative S-curve** (`svgLine`): Plan / Forecast / Actual cumulative PO counts across months. Forecast blanks fall back to the plan date.
- **Chart 2 — Monthly grouped bars** (`svgGrouped`): PO Plan vs Actual counts per month.
- **Period window** (MDL-style dual-range): From/To month + Reset + range message. Start = project start; end = last PO date **+ 3 months** (earlier PO dates still shown).
- **Markers**: **red dashed** = project start (Code sheet `Project Start Date`); **grey** = today (the operational as-of).
- **Empty state**: If no `poPlan` dates are real Excel dates → guidance message.

### 5.5 PO Look-Ahead (Table) — horizon 1 / 2 / 3 / 4 / 6 months

> Updated 2026-10-04: the window is no longer a hard-coded 3 months (§16.7-H). The panel is now a
> bounded data table with a user-selectable horizon.

- **Horizon**: user-selectable **1, 2, 3, 4 or 6 calendar months** from today — a segmented
  control (`1m / 2m / 3m / 4m / 6m`) in the panel's control row. Default **3**, persisted via
  `getPref('look')`. Measured in **calendar months** (`new Date(y, m + n, d)`), never a fixed day
  count: the former `+90 days` drifted against the calendar and did not mean "3 months".
- **Filter**: `poPlan >= today` AND `poPlan <= today + horizon` (as-of is always the current
  date), **and no PO Actual** — a package whose PO is already issued is no longer upcoming.
- **Columns**: Package, Discipline, PO Plan, **In (days)**, Status
- **Sort**: PO Plan ascending (soonest first)
- **Rendering (UI spec §4.3)**: bounded, scrollable data table (`.tableScroll`,
  `max-height:340px`, sticky header) so a long package list never stretches the page. The row
  count is reported next to the horizon control. The panel is full width (`.card.full`) — it
  previously sat alone in the 2-column grid and therefore rendered at half width.
- **Title**: `PO Look-Ahead` — the title must not hard-code the selected horizon (§4.3).

### 5.6 PO Issuance Delays (Table) — **RETIRED**

> Removed in the 2026-10-04 consolidation (§16.7-A). The PO Issuance Delays table has been retired; overdue now has a single canonical date-based source (`renderOverdueList` + shared `stageIsOverdue`). The spec below is retained for history.

- **Filter**: `poPlan < today` AND `status` not in issued set
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

## 6. Validation Rules (V-01 through V-25)

> Copy-ready reference for the Code sheet **Error table** (cols `Q`–`T`). Each row's **Description** is the text to paste into the worksheet; **Severity** and **Group** are the properties to add alongside it (see issue **I-65**). `Kind` shows the current routing — `system` = top warning banner, `data` = Data Validation table — and is informational only; do not change it without a code change.

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
| I-18 | ~~Look-ahead window hardcoded (90 days)~~ | ~~Fixed 3-month window; some projects need 60/120 days~~ | **DONE (2026-10-04)** — the horizon is now a **user control**, so no Code-sheet metadata row is needed: a segmented `1m / 2m / 3m / 4m / 6m` selector (default `3m`) in the panel's control row, persisted via `getPref('look')`, computed in **calendar months** (`new Date(y, m + n, d)`) rather than `+90 days`. | Dev | **Closed** |
| I-19 | Stage order for Stage Plan Coverage hardcoded (MR, PO, VD, FAT, ROS) | Adding/removing stages requires code change | Derive from field mappings: detect all `*Plan`/`*Actual` field pairs in `CODE_SHEET_KEYS` | Dev | v1.2 |
| I-20 | `TYPE_ALIASES` hardcoded (Date/Number/Text synonyms) | New type aliases require code change | Add Type Alias lookup table to Code sheet (Code / Alias / Canonical Type) | Dev | v1.3 |
| I-21 | `LOOKUP_HEADERS` fuzzy matching hardcoded | Header naming discipline required; synonyms fixed in code | Standardize Code sheet row 1 headers to exact names; remove fuzzy matching | Dev | v1.3 |
| I-22 | Chart dimensions/colors hardcoded in SVG functions | UI tweaks require code change | Move to CSS custom properties (already partially done) or add Chart Config metadata to Code sheet | Dev | v1.3 |
| **I-23** | ~~Offline XLSX parser (`parseSheet()`) dropped cells that followed a self-closing empty cell (`<c r="M2" s="7"/>`); the old regex `<c\b([^>]*)>([\s\S]*?)</c>` treated `/>` as part of the attribute string and lazily matched to the **next** `</c>`, swallowing it. 1818 such cells in the sample workbook.~~ | ~~91/122 packages lost their Engineer (only 4 of 8 names plotted); Engineer column N worst hit; all date columns (MR/PO Plan etc.) landed in wrong columns → PO Monthly, Look-Ahead, Delays charts also wrong; Buyer column silently filled with shifted values~~ | **DONE (Rev 1.1)** — cell & row regexes now accept self-closing form `(?:\/>|>...<\/c>)`; row index read from the attribute group. Verified against openpyxl (see §7.1) | Dev | **Closed** |
| I-24 | No regression test / invariant guard for the XLSX parser — the I-23 corruption was **silent** (no validation rule fires when values shift one column left) | Column misalignment can recur unnoticed after any parser change or after the workbook is re-saved by another tool | Add (a) unit fixture with self-closing cells, (b) cell-count invariant `<c` occurrences vs parsed cells with a fail-loud error, (c) golden-file cross-check vs Python `openpyxl`. See preventive actions P-1..P-4 in §7.1 | Dev | v1.1 |
| **I-25** | ✅ **CLOSED (Rev 1.13 — §15.12).** `normPerson()` was dead code (defined, never called), but the **real defect was V-12 itself**: the engineer tally wrote the raw trimmed string into a Set **keyed by that same raw string**, so every Set held exactly one member and `s.size > 1` was **unreachable by construction**. V-12 could never fire, and `"Dilip/Siva"` / `"Dilip / Siva"` / `"Siva /Dilip"` were counted as separate people on the Engineer chart and in KPI coverage. | ~~V-12 never fires~~ → **Now fires** on spellings differing only in whitespace / slash spacing | **DONE** — `normPerson()` deleted; V-12 now keys **loosely** (slash spacing + runs of whitespace collapsed) while the Set holds the **distinct raw spellings**, so the report line shows every variant as written and the worksheet stays the place to fix them. Genuinely different names (`Kenny` vs `Kenny/Franklin`) are deliberately **not** merged. Harness gains 4 assertions (Rev 1.13) | Dev | **Closed** |
| **I-26** | **RE-SCOPED (Rev 1.14 — §15.13).** Two halves were filed together; **the second half is stale and has been struck out.** **(a) Pie collapse — OPEN, latent.** `svgPie()` calls `topN(items.filter(i=>i.value>0), 8)`, so with >8 distinct values the smallest are summed into one grey `Other (N categories)` slice and **their names disappear from the chart and legend**. Latent only: today Engineer has exactly 8 names, so `topN` returns early and nothing is lost. **(b) ~~Bar-mode Copy/Download target `svg-eng` does not exist~~ → REFUTED, already fixed by Wave 0 (I-44).** Verified by reading the shipped code: `renderCat()` passes `svgId:meta.svg` to **both** renderers, and `svgHBar()` honours it (`const id=opts.svgId||('svg-'+random)`), so `<svg id="svg-eng">` **is** produced in bar mode. The button `data-svg` values (`svg-status`/`svg-disc`/`svg-eng`/`svg-crit`/`svg-lead`) match `METRICS[].svg` one-for-one, and the buttons live **outside** the `meta.el` container, so `innerHTML=` cannot destroy them. Both handlers also have a `toast('Nothing to export')` fallback (added by I-44). **The row described pre-Rev-1.1 code.** | ~~Copy/Download silently broken in bar mode~~ → **not broken**. The pie collapse remains | **(a) DONE in Rev 1.14:** the cap is now `CHART.pie.topN` (token, not a literal), and the merged slice carries `otherLabels` so a tooltip lists the names it swallowed. **Label text deliberately unchanged.** **(b) none — no code needed.** | Dev | **(a) Closed (Rev 1.14) · (b) Refuted** |
| **I-53** | ✅ **FIXED (Rev 1.9 — §15.9).** `isIssued()` matched the **raw** status while every other view canonicalises it through `statusCanon`, so a status stored as a short code (`DEL`, `RI`, `PO`) was never recognised as *issued* — such packages would wrongly be listed in **PO Issuance Delays**. The dead `statusCategory` branch left behind by I-49 was removed in the same edit. | Overdue table over-reports once statuses are entered as codes; a key removed from the contract was still referenced | Canonicalise before matching: `canon(p.status).trim().toLowerCase()`. **No effect on the current workbook** — statuses are stored as full text, where `statusCanon` is the identity function | Dev | **Closed** |
| **I-76** | **PPP is a monolithic single-file HTML — pipeline stages are not importable as Node modules.** `parseXlsx`, `parseCodeSheet`, `buildModel`, `validate`, and all render functions exist logically inside `Procurement-Dashboard.html` but cannot be imported in Node. This means: (a) no independent pipeline unit test harness equivalent to MDL's `test/test_pipeline.mjs`; (b) the `harness-layout` tool cannot compute ground-truth KPI/filter values to compare against the rendered page — Tier 3 data verification falls back to file-drop simulation with no independent ground truth. **Action**: extract `src/xlsx-reader.mjs`, `src/pipeline.mjs`, and `src/render.mjs` from the monolith, mirroring the MDL structure; add `build.mjs` to bundle them back into the single offline HTML. The pipeline logic is already correctly structured inside the file — this is a file-split refactor, not a logic change. Prerequisite for full harness Tier 3 support and for any future pipeline unit tests. | Harness Tier 3 limited to file-drop simulation; no pipeline unit tests possible | Modularise: extract `src/` modules + `build.mjs`, mirror MDL structure | Dev | Backlog | the same rule wording once per row (e.g. 119 × V-08), so a per-row definition line would be pure noise — hence the deduplicated Rule reference. The **CSV export** still carries only `severity, rule, package, field, value, message` and does **not** include the new `desc`. | A CSV consumer cannot see the Code-sheet wording; adding a column changes the export's shape, which downstream scripts may rely on | Decide whether to append a `Rule description` column to the CSV, or leave the export contract frozen | Dev | Backlog |
| **I-55** | ~~`critItems()` counts packages where `String(criticality).trim() === code` only; PPP often stores **descriptions** while V-05 accepts code **or** description~~ | ~~Criticality chart shows "(not in Code list)" slices while validation is quiet~~ | **DONE (commit `8f929a6`)** — `critItems()` now dual-matches **code and description** via the `criticality` / `criticalityCode` lookups (same pattern as `statusItems()`); descriptions no longer fall into "(not in Code list)" | Dev | **Closed** |
| **I-56** | ~~UI accepts `.csv` but `handleFile()` builds `{ PPP: parseCSV(...) }` only → **`No Code sheet found`**~~ | ~~A `.csv` export implies a working re-import path that cannot succeed~~ | **DONE (Rev 1.19, 2026-10-03)** — `handleFile()` rejects `.csv` up front with a clear message ("CSV export cannot be re-imported — it contains only the Package Plan, not the Code sheet… load the .xlsx"); file input `accept` limited to `.xlsx` and the welcome copy no longer advertises CSV | Dev / UX | **Closed** |
| **I-57** | ~~Unchecking every category sets `STATE.filter.cats` to an empty `Set` → **zero packages** in all views~~ | ~~Empty filter silently blanks the whole dashboard~~ | **DONE (commit `8f929a6`)** — `filteredPackages()` treats an empty/null `Set` as "all", so charts always render; the filter button still shows "None selected" as a visible signal | Dev | **Closed** |
| **I-58** | ~~`esc()` does not escape `"` in `title="…"` / `data-cat="…"`~~ | ~~Broken attributes / injection if a field value contains a double quote~~ | **DONE (commit `8f929a6`)** — `esc()` now also replaces `"` with `&quot;`; all attribute writes (`title=`, `data-cat=`) already pass through `esc()` | Dev | **Closed** |
| **I-59** | ~~Welcome `.expect` line missing space after `</b>` ("Plankeep…")~~ | ~~Cosmetic~~ | **DONE (commit `8f929a6`)** — space added after `</b>` in the welcome `.expect` block | Dev | **Closed** |
| **I-60** | ~~Orphaned data-quality checks (3) lost when `dqPanel`/`renderDQ` removed: Exec progress=0, Engineer unassigned, Plan-date inconsistency — emitted nowhere~~ | ~~Silent loss of three checks~~ | **DONE (2026-10-07)** — re-implemented as `validate()` rules with `kind:'data'`: **V-23** (execution progress = 0, aggregate, fires when `anyActual===0`), **V-24** (engineer unassigned / blank, per-package, closes the V-12 blind spot for blank engineers), **V-25** (plan-date inconsistency `mrPlanCount < T*0.3 && poPlanCount > T*0.5`, aggregate). All three now render in the Data Validation table (Panel 7) + CSV, closing the gap. Thresholds mirror the original `renderDQ` heuristic (configurable per I-17). | Dev | **Closed** |
| **I-61** | ~~V-05 / V-14 aggregate issues not in the Overdue-by-Stage package drill-down (invisible at per-package level)~~ | ~~Aggregate data signals only at panel level~~ | **DONE (2026-10-07)** — `pkgDetailHTML` now echoes all project-wide data issues (`pkg:'—' && kind:'data'`: V-05, V-14, V-23, V-25) into a new **"Validation — project-wide"** block inside the Overdue by Stage row-expand, so a reviewer always sees them even when drilling into a single (overdue) package. Per-package issues remain in "Validation — this package". Note: non-overdue packages still have no drill-down (by design — Overdue panel lists only overdue packages); their issues remain findable via Panel 7's Package column. | Dev | **Closed** |
| **I-62** | ~~V-12 (engineer spelling variants) routed to the banner, not the table~~ | ~~Data-quality issue in system banner~~ | **DONE (2026-10-07)** — V-12 `add()` now passes `kind:'data'`, so engineer-variant findings route to the **Data Validation table** (Panel 7) and the drill-down's "Validation — project-wide" block, not the top banner. Aggregate data issues (V-05, V-14, V-12, V-23, V-25) are now consistently table-bound; the banner is reserved for system/config notices. | Dev | **Closed** |
| **I-63** | ~~Banner render: dead `i.level` branch + no info style (info looked like warning)~~ | ~~Cosmetic~~ | **DONE (2026-10-07)** — `renderValidation` now branches on `i.sev` (removed dead `i.level==='fatal'`) and routes `info` notices to a new `.sys-banner-item.info` neutral style (`#e8eef5`/`#33526b`), giving a true three-tier banner: fatal=red, warning=amber, info=neutral. Spec §3.5 updated from two tiers to three tiers to match. | Dev | **Closed** |
| **I-64** | **`validate()` not wrapped in its own try/catch.** `STATE.report = validate(...)` (L967) relied on the outer load `try/catch` (~L2030) → `showError` → fatal banner. On a thrown validation error the dashboard was unhidden first (L957) then hidden. | Robustness/fragility only; no functional loss today. | **DONE (2026-10-07, Option B)** — `buildDashboard` now: (1) wraps `validate()` in its own `try/catch` that routes to `showError('Validation failed: …')` (correct label, not "Load failed"); (2) moves the dashboard **reveal** (`welcome` hide / `#dash` un-hide / `projTitle` / `metaLine`) to *after* validation succeeds, eliminating the empty-dashboard flash; (3) makes validation-crash handling self-contained so it no longer depends on the outer load `try`. Happy-path behavior unchanged. | Dev | **Closed** |
| **I-65** | **Workplan §6 Validation Rules table should list every error proper
| **I-77** | **Look-ahead horizon chip `3m` is below the 3:1 contrast floor (measured 2.27:1).** The selected chip of the segmented horizon selector (`1m / 2m / 3m / 4m / 6m`, default `3m`, class `on`) renders `color: rgb(98, 118, 142)` on `background: rgb(172, 182, 195)`. Measured by `harness-layout` Tier 4d `lintControlContrast` (WCAG relative-luminance ratio) at **2.27 : 1**, below the mandated 3:1 floor for UI text (spec §7.1). PPP runs `chrome.controlContrast: 'advisory'`, so it surfaces as an **advisory warning** instead of a hard failure — PPP currently reports 87 passed / 19 failed / **1 advisory**. The same chip is listed twice in the advisory payload because the check runs two passes (default and forced pressed warning-toggle state); it is a single distinct control. | Low-contrast label on the default (selected) horizon control — hard to read and a WCAG AA failure for UI text. No functional break: the charts still render and the selector still works. | **Logged only — no code changed (2026-10-18).** Raise the `on` chip pair to **≥ 3:1** (darken the label or lighten the fill); once fixed, flip PPP `chrome.controlContrast` from `'advisory'` to `true` so Tier 4d enforces hard, matching MDL. | Dev / UX | Backlog |
| **I-78** | ✅ **CLOSED 2026-10-21 — PPP text-action buttons renamed to the canonical A3 class.** Filed 2026-10-21 from MDL I-71. The shared spec §7.1 (A. Action buttons) was made normative on 2026-10-20 (MDL I-71): **`.btn-secondary` is the canonical A3 class** and MUST be used for every text action (export / copy / CSV / reset). PPP still ships `.dlBtn` (L400, L1555, L2100) and `.copyBtn` (L400, L1556, L2100) in `Procurement-Dashboard.html`, which §7.1 A3 now records as **legacy, non-conforming aliases** — tolerated only pending a required migration, and MUST appear on no **new** control. The rendered styles already agree: PPP's `.ctool button` rule (L139–144) and MDL's `.btn` + `.btn-secondary` (MDL L124, L129–130) resolve identically once token aliases are expanded (`--line` = `--border` = `#D9E1E8`; `--accent` = `--blue` = `#1E88E5`; `--navy` = `--ink` = `#0F2D52`) — same 12 px / 600, 1.2 line-height, 32 px min-height, 7 px 14 px padding, 6 px radius, 6 px gap, white on navy, blue hover fill. So this is **latent, not visible**: the class name is the only link between a rendered control and the spec rule governing it, so a *future* A3 style change will silently miss one dashboard because no shared selector exists for a test to assert against. `.reset` is gone — PPP no longer ships a class of that name. | **Latent only** — the buttons look identical today. PPP is now formally non-conforming against §7.1 A3 until renamed; without a shared selector, a future A3 change hits one dashboard and misses the other. | **DONE 2026-10-21.** Renamed `.dlBtn` / `.copyBtn` → `.btn-secondary` (markup L402 and L1557–1558; delegated handler L2104) and deleted the old names. Because one shared class no longer discriminates the two actions, the handler moved from `.copyBtn` / `.dlBtn` to `data-act="copy"` / `data-act="dl"` — behaviour hangs off a data attribute, the class carries presentation only. `.btn-secondary` was also joined to the rule that already implements A3 here (`.ctool button, .head-actions button, .btn.ghost, .btn-secondary`, L141 + `:hover` L146), so the shared class is **governing** rather than decorative; the declared values were already identical, so nothing moved visually. Verified: `MDL/test/test_grid.mjs` **43/43**; `harness-layout --dashboard ppp` **87 passed / 19 failed / 1 advisory / 11 skipped**, identical to baseline (that advisory is I-77's contrast issue, pre-existing and unrelated). | Dev | **Closed 2026-10-21** |

---

## 8. Shared-Spec Conformance Record (PPP-specific)

The shared `Dashboard-UI-Design-Spec.md` is **project-neutral**: it states what *any* dashboard must
do. Everything that belongs to PPP alone — the concrete instantiation of a permitted choice, PPP's
migration state, its enforcement posture and its issue history — lives here. Each entry cites the
spec clause it satisfies (spec §1, §8.4).

**On 2026-10-22 the spec was generalised** (v1.2 → v1.3) and the PPP-specific content below was moved
out of it. Nothing changed in PPP's behaviour — the rules are identical, only their location moved.

### 8.1 Dashboard-specific choices (the spec permits; PPP decides)

| Spec clause | PPP's choice |
|---|---|
| §4 — panel class name is free | **`.card`** |
| §3.2 — navigation: sidebar **or** inline | **Inline in the header** — no left sidebar |
| §1 — status vocabulary is per-dashboard | PPP defines its own status text/symbols; MDL's are never copied |
| §3.1 / §7.2.7 — which dimensions are **global** | PPP's category filter (top-bar chip); the dimension list is PPP's own |
| §7.1 — enforcement posture (hard / advisory) | **Advisory** — see I-77; the intent is to flip to hard once I-77 is fixed |

### 8.2 PPP as the origin of two shared rules

Two rules now in the spec were first established here. The **rule** is shared and lives in the spec;
the **history** is PPP's and lives here.

- **A4 icon / mini button geometry (spec §7.1 A4)** — PPP's implementation (26 px square, 13 px /
  600, `--soft` hover) is the geometry the spec now mandates for every dashboard.
- **A3 canonical class migration (spec §7.1 A3)** — completed **2026-10-21** under **I-78**:
  `.dlBtn` / `.copyBtn` were renamed to `.btn-secondary` and the old names deleted.
  - Because one shared class can no longer discriminate the two actions, the delegated handler moved
    from the class to `data-act="copy"` / `data-act="dl"` — behaviour hangs off a data attribute.
  - `.btn-secondary` was joined to the rule that already implements A3 in PPP
    (`.ctool button, .head-actions button, .btn.ghost`), so the shared class is **governing**, not
    decorative. The declared values were already identical, so nothing moved visually.

### 8.3 Conformance / migration state

| Spec clause | PPP status |
|---|---|
| §7.1 A3 — `.btn-secondary` is the canonical text-action class | **Conforming since 2026-10-21** (I-78). Legacy `.dlBtn` / `.copyBtn` are **gone**; `.reset` had already disappeared |
| §7.2.15 — every bounded table uses the split header; sticky `<thead>` inside a `.tableScroll` is retired | **Non-conforming — not yet migrated.** PPP ships a sticky `<thead>` in every `.tableScroll` / `.vtableWrap`. Migration is **open** (same status pattern as §7.1 A3) |
| §7.1 — control contrast ≥ 3:1 for UI text | **Advisory — 1 open finding**: the look-ahead horizon chip `3m` measures **2.27:1** (I-77). PPP reports 87 passed / 19 failed / **1 advisory** |

### 8.4 Chart specifics (spec §4.2)

- PPP's combo chart is **SVG-based** (`svgPoCombo`); bar value labels print at **12 px** above every
  non-zero bar — the spec now states the 12 px figure generically.
- Cumulative S-curve points are **solid dots** (`r=3`, filled with the series colour), never hollow
  rings — the form the spec now mandates for every S-curve.

### 8.5 Evidence (spec §8.4)

- Shared harness: `harness-layout --dashboard ppp`, with PPP's check module
  (`harness-layout/checks/ppp.mjs`); PPP runs `chrome.controlContrast: 'advisory'`.
- MDL's shared A3 tripwire lives in `MDL/test/test_grid.mjs` (4 checks) and covers both dashboards.
- Per-clause evidence pointers are recorded in the issue table of §7 above.
