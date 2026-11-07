# Submittal Dashboard — Approved Developer Workplan

| Revision | Date | Author | Summary |
|---|---|---|---|
| 2.97 | 2026-11-07 | CodeBuddy (AI) | **`I122` — §4.2 rev 1.67: C1 presets became a single-select segmented control and the tools keep ONE row at desktop widths.** Owner report after a read-only study: `12M` and `24M` showed as selected together, the presets should be `seg-btn` style with no two chips active at once, and the tools below the panel title used two rows. Read-only probes measured `6M=false 12M=true 24M=true YTD=true All=false` after a `to = 10` / `12M` click, and 59 px of tools at 1280 px versus 32 px at 1440 px. Root causes: rev 1.66 derived each `aria-pressed` from `[from, to]` equality (clipped ranges collide), and `.c1-ts{flex-wrap:wrap}` dropped the chips to a second line at 1280 px. The owner approved Option 3 (Both) plus guardrails and four decisions: 1280 px minimum single-line width, `All` active at load, `c1Preset: null` on manual drag, and the B2 token gap as a separate deferred item (`I123`, `DEFERRED_STUDY`). **Files:** both spec copies to rev 1.67 (rows 1.60 / 1.28 / 1.64 / 1.65 / 1.66 preserved verbatim), SHA256 `3166A7498EF8D3BDEAA032150F7DBA2C40A2A38ECEC8740E049A533E506129F0`, 203,768 bytes, byte-identical; §4.2 single-select and one-row clauses; §8.2 assertion 21 extended; `harness-layout/SKILL.md` rev 1.10; `harness-layout/checks/sub.mjs` rev 1.13; `harness-layout/harness.mjs` rev 1.23 (+4 Tier 5 checks); `sub/engine/render.js` rev 0.15 (ONE `.seg.c1-ts-chips` group of five `.seg-btn` buttons, selection read from `st.c1Preset`); `sub/engine/dashboard.js` rev 2.7 (`state.c1Preset` stored, set on a chip click, cleared on a handle `input` / `change`, `c1SyncTimeBar()` reads it and toggles `.active`); `sub/engine/dashboard.css` rev 2.10 (Sub `.seg-btn.active` / `--blue` token, `flex-wrap:nowrap` on `.c1-ts`, `flex-shrink:0` on label / text / chips, 190 px basis + 120 px min-width on `.c1-ts-body`, `@media(max-width:1279px)` wrap per §3.4.1, print hides `.c1-ts-chips.seg`); `sub/test/render.test.mjs` rev 0.16 (+1 mutual-exclusion test); `sub/sample-c1-table.html` rev 0.6 review sample; `sub/sample-c1-table-option-a.html` unchanged; standalone HTML rebuilt → **374,509 bytes** on disk (build prints 373,669 UTF-16 code units). `c1PresetRange()` keeps computing the period; `state.c1Period`, windowed `pts`, absolute cumulative values, `niceAxisTicks()`, the rev 1.65 shared Y axis, hover / refit, PNG/Copy and all other controls are unchanged. **Measured:** pipeline 24/0, render 47/0 (+1 test), Tier 5 **73 passed / 0 failed / 0 advisory / 1 skipped** (+4 checks), full Sub harness **2731 / 0 / 0 / 29** (+4), `node --check` clean on five JS files, linter 0 diagnostics, both sample inline scripts parse, two rebuilds identical, spec copies SHA256-identical. Browser proof: a manual drag leaves all five chips `false`; clicking `12M` leaves only `12M` `true`; at 1440 / 1366 / 1280 px the controls are 32 px high with `flex-wrap:nowrap`. One Tier 5 run failed once because earlier C1 lint steps leave a custom range; the lint now selects `All` first for a known baseline, with NO assertion weakened. See issue log 1.17, update log 1.36 / U033, test log 1.31 / TEST-028. |
| 2.96 | 2026-11-07 | CodeBuddy (AI) | **`I121` — §4.2 rev 1.66: C1 period time bar redesigned as ONE dual-handle month-snapped track.** Owner decision 2026-11-07, 10 confirmed decisions. The two separate From / To inputs are replaced by two overlaid native `<input type="range" step="1">` handles on one shared visual track; `data-c1period="from" / "to"` stay, so `state.c1Period`, the windowed `pts`, the rev 1.65 shared Y axis and PNG/Copy are unchanged. Hard magnetic snap comes from `step="1"` (fractional month indices unreachable). One subtle tick per active reporting month (`data-c1month`, `pointer-events:none`), with January year labels and active / near states. Five preset chips `6M`, `12M`, `24M`, `YTD`, `All` with `aria-pressed`; the three month presets anchor to the current `to` index, `YTD` spans January of the as-of year through the as-of month, and `All` spans `[0, N-1]`. An `input` event updates only the track visuals; the existing `change` event performs the ONE full repaint with no animation or debounce. Both handles keep `aria-label` / `aria-valuetext`, a `:focus-visible` outline and a one-month keyboard step. Print hides the interactive track and chips but keeps the period text. **Files:** both spec copies to rev 1.66 (rows 1.60 / 1.28 / 1.64 / 1.65 preserved verbatim), SHA256 `3272B8B0E7E1B49A73AA1888FE44F8D78750760D61853938DD889716D41F518A`, 199,769 bytes, byte-identical; §8.2 assertion 21 extended; `harness-layout/SKILL.md` rev 1.9; `harness-layout/checks/sub.mjs` rev 1.12; `harness-layout/harness.mjs` rev 1.22 (`lintC1TimeBar()`, 14 new Tier 5 checks); `sub/engine/render.js` rev 0.14 (exports `C1_PRESETS` / `c1PresetRange`, rewrites `c1Controls`); `sub/engine/dashboard.css` rev 2.9; `sub/engine/dashboard.js` rev 2.6 (`c1SyncTimeBar`, light `input` listener, chip branch); `sub/test/render.test.mjs` rev 0.15 (+2 tests); `sub/sample-c1-table.html` rev 0.5 review sample generated first; `sub/sample-c1-table-option-a.html` historical note only; standalone HTML rebuilt → **371,888 bytes** on disk (build prints 371,076 UTF-16 code units). **Measured:** pipeline 24/0, render 46/0 (+2 tests), Tier 5 **69 passed / 0 failed / 0 advisory / 1 skipped** (was 55/0/0/1, +14), full Sub harness **2727 / 0 / 0 / 29**, `node --check` clean on six JS files, linter 0 diagnostics, both sample inline scripts parse, spec copies SHA256-identical. See issue log 1.16, update log 1.35 / U032, test log 1.30 / TEST-027. |
| 2.95 | 2026-11-07 | CodeBuddy (AI) | **`I119` — §4.2 rev 1.65: C1 shared Y axis follows the selected period window.** Owner decision: `M` is the maximum of the windowed `data-points` payload (`pts`), filtered by enabled series and the Bars toggle, recomputed immediately on every repaint (period / series / Bars / grain) with no animation or debounce. `niceAxisTicks()`, the 300-unit plot height and all rev 1.64 limits stay unchanged; cumulative values remain ABSOLUTE and are never rebased; NO second Y-axis or separate bar scale is introduced. Real workbooks: 2026-01..2026-10 now yields axis 300 / step 50 / 7 labels / 94.7% fill instead of 6,000 / 4.7% fill. After a period change, chart, `line.sc-grid`, HTML labels, hover / refit metadata and PNG/Copy MUST all represent the same Y-axis scale. Both spec copies updated to rev 1.65 with historical rows 1.60 / 1.28 / 1.64 preserved verbatim; SHA256 `8A7D486443B9A9104CA7CF9B6DD1F86569F87A1B80BA913A4D087F175F8DE6FE`, 194,799 bytes, byte-identical. §8.2 gate row 11 updated. `render.js` rev 0.13; `render.test.mjs` rev 0.14 (+1 test); no `dashboard.js` change. `harness.mjs` rev 1.21 (shared `assertC1Axis()`, data-driven `c1PickAxisProbe()` with SKIP-not-FAIL on unsuitable data, `windowPeak` / `cumByLabel` / `gridScaleMaxDelta`); `checks/sub.mjs` rev 1.11 (five harness-only quality criteria, `axisMinFill: 0.75` is NOT a UI requirement); `SKILL.md` rev 1.8. Option B sample rev 0.4 documentation only (already window-based); Option A sample header note only, preserved as a pre-rev-1.65 historical baseline. Standalone HTML rebuilt → **360,819 bytes**. **`I120`** opened as `DEFERRED_STUDY` for separate bar scaling: the §4.2 scale-mode guardrail is a documented requirement that remains OUTSTANDING and unimplemented; `DEFERRED_STUDY` means postponed pending technical investigation and a decision, distinct from `DEFERRED_REVIEW`. **Measured:** pipeline 24/0, render 44/0, Tier 5 55/0/0/1, full Sub harness 2093/0/0/29, `node --check` clean, linter 0, spec copies SHA256-identical. See issue log 1.15, update log 1.34 / U031, test log 1.29 / TEST-026. |
| 2.94 | 2026-11-07 | CodeBuddy (AI) | **`I118` — §4.2 rev 1.64 C1 dynamic Y tick standard.** Owner decision: the Y-axis maximum MUST be adjusted to the values shown, the 300-unit chart area height MUST stay fixed, and curve / bars / areas / dots MUST re-scale from that one maximum. Formal rule: at most **seven intervals** (min ~40 px spacing over 300 units) and at most **eight labels**, steps from the standard nice-number sequence `{1, 2, 2.5, 5} × 10^k` with step >= 1, and **dynamic ticks generated from the same `data-c1meta` payload** as the chart. Pick the smallest step with `ceil(M / s) <= 7`; `yMax = ceil(M / s) × s`; `M` = visible-series maximum. Real workbooks: 5,955 → 6,000 → 7 labels / 50 px / 99.25% fill (was 8,000 / 5 labels / 74.4%). Governance: rev 1.60's fixed-five-tick count is superseded by a NEW spec revision 1.64 appended to both copies; historical rev 1.60 and 1.28 rows are preserved verbatim; the 2026-10-25 body clause forbidding any rounded-up y-max is also superseded while its full-height intent stays normative. Both spec copies were re-synced byte-identical from the root copy (four drifted clauses restored), SHA256 `D984C5A51CAACC29100A20A9BAFC7A5C7B4A2D1B97C39481ED3733BE7C2C8F29`. **§8.2 gate row 11 updated** to the dynamic rule. Files: both spec copies; `harness-layout/harness.mjs` 1.20; `harness-layout/checks/sub.mjs` 1.10; `harness-layout/SKILL.md` 1.7; `engine/render.js` 0.12; `engine/dashboard.js` 2.5; `test/render.test.mjs` 0.13; `sample-c1-table.html` 0.3; three logs; standalone HTML rebuilt → **359,787 bytes**. **Verified:** pipeline 24/0, render 43/0, Tier 5 **47 passed / 0 failed / 0 advisory / 1 skipped**, full Sub harness **2085 / 0 / 0 / 29**. See issue log 1.14, update log 1.33 / U030, test log 1.28 / TEST-025. |
| 2.93 | 2026-11-06 | CodeBuddy (AI) | **I117 — four owner-reported C1 Schedule Performance fixes.** (1) The side unit caption reads `Documents` (spec §4.2 rev 1.60 allows the equivalent measure name — no spec revision needed). (2) New exported `niceAxisMax()` rounds the Y-axis maximum UP to a nice step (quarter step = smallest of 1 / 2 / 2.5 / 5 × 10^k covering `max / 4`); the real workbooks (raw maximum 5,955) now give axis 8,000 and ticks 0 / 2000 / 4000 / 6000 / 8000 instead of 1533 / 3067 / 4600 / 6134. (3) The rotated bar value uses `text-anchor="start"` + `dominant-baseline="central"` anchored 4 px above the bar top, so the whole value sits above the bar. (4) Each month centres its VISIBLE (non-zero) bars on the band centre — owner decision: centring over fixed slots, because future months lack actuals; series order and colour classes are unchanged so colours stay stable. `render.js` rev 0.11, `render.test.mjs` rev 0.12 (caption assertion updated + one I117 test), standalone HTML rebuilt → **356,153 bytes** on disk. **Verified:** pipeline 24/0, render 42/0. See issue log 1.13, update log 1.32 / U029, test log 1.27 / TEST-024. |
| 2.92 | 2026-11-06 | CodeBuddy (AI) | **I-96 windowing check fixed — supersedes the "3 failures, not fixed" note in 2.91.** Root cause is a shared-harness fault, not a dashboard defect. Since I-112 made pagination take precedence on large tables, the probe's `#vCnt` trigger (16,393 rows) had no windowed table to measure and fell back to a header fragment with no `<tbody>`. `harness-layout/harness.mjs` rev 1.19 now requires a real windowed table with spacer rows and skips with a clear reason. No engine file changed, so no rebuild was needed. **Verified:** full harness **2082 passed / 0 failed / 0 advisory / 29 skipped**; pipeline 24/0, render 41/0, Tier 5 44/0/0/1; MDL Tier 4 I-96 4/4 PASS; `node --check` clean. See test log 1.26 / TEST-023, update log U028. |
| 2.91 | 2026-11-06 | CodeBuddy (AI) | **§4.2 rev 1.63 — Option B attached-table interaction promoted into the production build.** Both byte-identical UI spec copies gained the normative §4.2 *Attached-table interaction (C1 only)* clause (four tokenised `<linearGradient>` defs and `<path class="sc-area">` fills, one hidden `.sc-hover-band` at `W / N`, `data-c1col` on every month `<th>` and `<td>`, two-way chart / table column sync, chart-only `.chart-tip`, token-resolved PNG / Copy with transient hover state stripped) and the §4.6 hidden-window ARIA and touch clauses. `render.js` rev 0.10, `dashboard.css` rev 2.8 and `dashboard.js` rev 2.4 implement it; `render.test.mjs` rev 0.11, `checks/sub.mjs` rev 1.9 and `harness.mjs` rev 1.18 assert it. `build/standalone.mjs` line 53 now strips trailing whitespace from the pre-block slice, so repeated rebuilds are identical (two runs both report 352,969 characters; the marker indent is 2 spaces instead of 254). Both review samples relabelled: `sample-c1-table.html` is Option B adopted, `sample-c1-table-option-a.html` is the Option A pre-rev-1.63 baseline. **Verified:** pipeline 24/0, render 41/0, Tier 5 44 passed / 0 failed / 0 advisory / 1 skipped, full harness 2083 passed / 3 failed / 0 advisory / 28 skipped (3 I-96 windowing failures, not fixed), `node --check` clean on 7 files, both spec copies SHA256-identical, standalone HTML 352,969 characters / 353,702 bytes. Wave 19 gains **T19.2** and §8.2 gate row 11 cites rev 1.63. |
| 2.66 | 2026-11-02 | CodeBuddy (AI) | Ran the shared layout harness (Tiers 3, 4b, 5, 6) against the Sub dashboard and resolved all 6 flagged gaps (**I093–I098**, issue log 0.81 / 0.82). **I093** (§3.5) — the warnings shell had no `id="errBanner"`, so the harness could not find the banner although it rendered correctly; the id was added to the standalone HTML, outside the STANDALONE block so rebuilds keep it. **I095 / I096** (real defect) — `syncWidth()` in `engine/dashboard.js` re-fitted every column to the container whenever the column sum differed from the available width, so a resize drag was scaled straight back down and did not stick (~10 px per drag); the fit pass is now gated on a CONTAINER width change (`lastAvail`), with the first pass still fitting on load. **I094** (harness fault, not a product defect) — the filter round-trip deselected every discipline, selected one, and never restored "all", so the status-bar check read the FILTERED total against the unfiltered 7631; it now restores "all disciplines", matching the select branch. **I097 / I098** (harness fault) — the C2 charts (Submission Flow, Delay) also emit `.sc-ref-start` / `.sc-ref-today`, so the unscoped selector counted 2 where 1 was expected; the selectors are now scoped to the C1 panel (`.scurve .sc-ref-start` / `.scurve .sc-ref-today`); not a regression of I036. `node build/standalone.mjs` re-run → 288,145 bytes. Harness result: **222 passed, 0 failed, 0 advisory warnings, 27 skipped** (was 216 passed / 6 failed). |
| 2.74 | 2026-11-03 | CodeBuddy (AI) | Fixed **I105** — owner request: add Start/Today labels to the C2 Stacked and Delay charts. Both `c2StackedSVG` and `c2DelaySVG` now push rotated `.sc-ref-lbl-start` / `.sc-ref-lbl-today` text (`Start · <month>` / `Today · <month>`), mirroring the C1 S-curve; the CSS classes already existed and reuse the line colours (`--danger` / `--slate`), so no CSS change was needed. Guarded by a new render test asserting both SVGs expose the two labels with the month. Render 26/0, pipeline 24/0, standalone HTML rebuilt → 312,826 bytes. |
| 2.75 | 2026-11-03 | CodeBuddy (AI) | Fixed **I106** — owner: list all past months in the C3 filter even when submissions are zero, and fix the C3 hover windows. `c3.months` now spans project start → as-of, so empty months are selectable (and their Total Plan visible). Both C3 cards' hover windows are now §4.6-compliant (tokenised `c3-*` swatch rows + `Total` footer), and the C3 harness board is `ctL`-guarded. The summary stacked bar got the same treatment. One render test hardened to pick a data-bearing month. Render 28/0, pipeline 24/0, Tier 6 1452/0/0, HTML rebuilt → 314,597 bytes. |
| 2.76 | 2026-11-03 | CodeBuddy (AI) | Fixed **I107** — owner: separate the Submittals submission-history fields into columns, dynamically, and add a month filter. The CSV export now uses six base columns plus N dynamic five-column groups per submission (N = max submissions per document), only in the export; the dashboard toggle design is unchanged. A month `<select>` filters the panel to documents with a submission in that month and limits the expanded history; a cumulative "Total as-of {month}" summary counts submissions from project start through the month. `buildSubmittalsCsv` added and unit-tested. Render 31/0, pipeline 24/0, Tier 6 1452/0/0, HTML rebuilt → 318,209 bytes. |
| 2.77 | 2026-11-03 | CodeBuddy (AI) | Fixed **I108** — owner: the Submittals panel summary must sit below the title with the controls below it, and the spec must allow an optional subtitle. The spec §4 "No explanatory subtitles" is now "Optional panel summary (subtitle)": a panel may show a compact data summary (counts / totals) directly under the title, on its own line above the control row; long explanation stays in the Help modal. The Submittals panel now emits the summary inside a `.panel-summary` block before `.table-tools`; `.panel-summary` + `.panel-summary .summary` styles added. One render test added. Render 32/0, pipeline 24/0, Tier 6 1452/0/0, HTML rebuilt → 318,547 bytes. |
| 2.78 | 2026-11-03 | CodeBuddy (AI) | Fixed **I109** — owner: the Submittals subtitle must match the Forward/Overdue panel's gap and edge alignment. The spec §4 "Optional panel summary (subtitle)" now defines the normative layout: the summary sits in `.panel-body` before the `.c-card`, aligned to the content edge (no extra indent), using the `.note` style (`margin:6px 0`, `font-size:13px`, `line-height:1.5`, `color:var(--text2)`), ≈16 px below the title. The Submittals panel now emits `.panel-summary` before the `.c-card`; `.panel-summary` CSS matches `.note`. One render test added. Render 33/0, pipeline 24/0, Tier 6 1452/0/0, HTML rebuilt → 318,697 bytes. |
| 2.79 | 2026-11-03 | CodeBuddy (AI) | Fixed **I110** — owner: the Validation summary text must sit below the title (above the vchips) and token names must be standardized. The panel now emits the summary as a `.note` subtitle under the title, before the v-summary row (matches I108/I109). The vchips use the project-local semantic tokens; three tokens the UI spec did not define (`--danger-bg`, `--warning-bg`, `--warning-ink`) were added to `:root` and all four themes, info background reuses `--tag-bg`, and `.status-bar` text reuses `--surface3`. One render test added. Render 34/0, pipeline 24/0, Tier 6 1452/0/0, HTML rebuilt → 319,239 bytes. |
| 2.80 | 2026-11-04 | CodeBuddy (AI) | Fixed **I111** — owner: the Submittals month filter stopped at the latest submission month and never offered the as-of month. The filter now spans project start → as-of (like C3 I106), so the as-of month and any zero-submission months are selectable; an empty month shows "No documents match". One render test added. Render 35/0, pipeline 24/0, Tier 6 1452/0/0, HTML rebuilt → 319,959 bytes. |
| 2.81 | 2026-11-04 | CodeBuddy (AI) | Fixed **I112** — owner: Validation Issues table. Moved the meta to a panel-level `.note` under the page title; gave the Issues card a top tool cluster (page controls left, error-code filter + CSV + Columns right); added a panel-local error-code filter (Issues only) and 200-row pagination at the top (only the current page is materialised); CSV exports the full filtered set via `buildIssueCsv`. `table()` gained `subtitle`/`filter`/`pageSize`/`page`; both UI spec copies updated (§4.3 200/page pagination at top; panel-level subtitle + top tool cluster). Two render tests added/updated. Render 37/0, pipeline 24/0, Tier 6 1452/0/0, HTML rebuilt → 325,674 bytes. |
| 2.82 | 2026-11-04 | CodeBuddy (AI) | **I112 follow-up (sample review)** — confirmed final layout: panel-level meta note, left-aligned "Issues" title, top page controls, right-aligned code filter + CSV + Columns. Updated `render.js` (top pager group), `dashboard.css` (`.pg-left`/`.pg-right` groups), both UI spec copies, and the render tests; removed the bottom pager. Rebuilt. |
| 2.83 | 2026-11-04 | CodeBuddy (AI) | **I112 alignment fix (browser review)** — real build centred the "Issues" title and tool cluster. Root cause: `.table-head` declared after `.table-head--stack` (equal specificity) won with `align-items:center`. Changed to the compound selector `.table-head.table-head--stack` (`align-items:stretch; justify-content:flex-start`), so the title is left aligned and `.pg-right` (`margin-left:auto`) pushes the code filter + CSV + Columns to the right edge. Rebuilt → 325,674 bytes. |
| 2.84 | 2026-11-05 | CodeBuddy (AI) | **I113 / I114 / I115 first fix (Validation page)** — I113: the Issues ⤓ CSV button never downloaded (module-scoped `buildIssueCsv` referenced out-of-scope `lastIssueExport`/`state` and threw); hoisted `lastIssueExport` to module scope and captured the column set at render time. I114/I115: **incorrectly** attributed to scroll reset and filter visibility; corrected in 2.85. Render 37/0, pipeline 24/0, Tier 6 1452/0/0, rebuilt → 325,993 bytes. |
| 2.85 | 2026-11-05 | CodeBuddy (AI) | **I114 / I115 corrected after the owner reported the same failures again** — real causes: pager buttons carried `data-page="prev"\|"next"` (the sidebar nav attribute), so the delegated click handler set `state.page='prev'` and `render.js` fell back to Overview; and the bare `data-vcode` attribute made `dataset.vcode === ""`, leaving the filter `change` branch dead. Fixes: pager attribute renamed to `data-pg`, nav handler whitelists real page names via `NAV_PAGES`, and the filter branch uses `hasAttribute('data-vcode')`. Also added an I112 regression assertion that pager buttons must not use `data-page`, and aligned the review sample's selectors. **Verified in a real browser (Playwright)**: Next/Prev stay on `Validation` (page 1→2→1), V-26 → 7,357 issues, V-29 → 20 rows, ALL → 16,393, CSV downloads `issue-table.csv`, no page errors. Render 37/0, pipeline 24/0, Tier 6 1452/0/0, rebuilt → 326,167 bytes. |
| 2.86 | 2026-11-05 | CodeBuddy (AI) | **Close-out reconciliation of the I112–I115 thread** — docs only. Both UI spec copies gained the missing revision rows **1.57** (I112: §4.3 200/page pagination at the top, §4.5 Validation stacked layout) and **1.58** (I113/I114/I115: §4.3 *Pagination control behaviour*, §4.5 *Tool-cluster controls are local*), plus the corresponding normative body rules so the revision summaries are backed by text. Recorded the approved rewrite of `sub/sample-issues-layout.html` (spec-faithful split header, panel-level meta, top tool cluster) and the earlier git commit/push of the I112 work (`351a67b`). Issue-log Status Summary recounted to 115 rows / 113 `RESOLVED` / 2 `WONT_IMPLEMENT`. Final build 326,167 bytes; render 37/0, pipeline 24/0, Tier 6 1452/0/0. |
| 2.87 | 2026-11-05 | CodeBuddy (AI) | **C1 S-curve attached table — plan recorded, docs only.** UI spec §4.2 rev 1.59 added the normative, universal **S-curve attached table** clause (§0 vocabulary, §8.2 assertion 21); both UI spec copies are byte-identical. This workplan records the C1 work in §4.3, Wave 19, task **T19.1** (🔷 PLANNED) and §8.2 gate row 11. Contract: one `.c1-grid` CSS grid with `--c1-gutter:104px` / `--c1-cols:N` tracks and `column-gap:0`; one `<svg role="img">` in `.c1-plot` spanning columns 2..-1, `xc(i)=(i+0.5)*W/N`, and a `ResizeObserver` on `.c1-plot` (§3.4.1); one native `<table>` (Option B) in one spanning grid item with `<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, `scope` and `table-layout:fixed`; ARIA table roles and `display:contents` forbidden. Metric rows come from data; no row set is fixed. Static and script-rebuilt cells share one structure. Borders are the panel edge plus one `.sc-board`; no third wrapper (§4.1, I068). Labels use `MMM YYYY`, `Reporting Month` sits in the corner cell, rules are 1 px light, Start and Today lines stay, and the as-of subtitle is omitted. A wide period scrolls inside the board; print shows the full grid. PNG/Copy rebuild the table as native SVG `<rect>` / `<text>` following C3 `c3CardToSvg`, with no `<foreignObject>`; `aria-describedby` links to `.chart-tip` only (§4.6). The attached table is not a `.ds-table`, so §4.3 and §7.2.15 do not apply. **CSV decision:** no `⤓ CSV` for this attached table, because §4 scopes CSV to `.ds-table`. Logged as **I116** (`APPROVED`, Wave 19, T19.1) in `sub/log/issue_log.md` rev 1.07. No engine, build, spec, sample or harness file changed in this step. |
| 2.88 | 2026-11-06 | CodeBuddy (AI) | **I116 / T19.1 built — C1 S-curve now carries one native attached table.** `render.js`: added the exported `c1PlotSvg()` so one curve renderer serves the static HTML and the width refit; rewrote `schedulePerformance()` to emit one `.scurve.sc-board` with the controls, one `.c1-grid`, a `.c1-plot` SVG, one native `<table>` (`<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, `scope`) and `.chart-tip`. Metric rows come from the visible series and the point keys, not a fixed row set. The hover window re-reads `data-points` / `data-geo` after a refit, and control clicks no longer open it. `dashboard.css`: the grid, native table, rotated month heads and print rules. `dashboard.js`: `c1Refit()` plus a `ResizeObserver` on `.c1-plot` (window / `visualViewport` fallback) rewrites `data-geo.W`, every `data-points[].cx`, `--c1-cols` and `<colgroup>`; `c1BoardToSvg()` rebuilds the board as one native SVG including the table, with no `<foreignObject>`, so PNG and Copy include it. C1 Y ticks use the new `.c1-ytick` class so the C3 tick count stays at 10. **Owner decision 2026-11-06:** the whole S-curve must stay visible inside the card, so the curve scales through its `viewBox` with no `min-width` and no horizontal scroll. This departs from the §3.4.1 / §4.2 rev 1.59 phrase "A wide period scrolls inside the board"; the UI spec text was not changed in this step and needs its own revision (new item). Two render tests added (native table structure; refit X alignment). **Verified:** render **39/0**, pipeline **24/0**, standalone HTML rebuilt → **341,107 bytes**. Still open: §8.2 assertion 21 needs the layout-harness and real-browser check; no harness, spec or sample file changed in this step. |
| 2.90 | 2026-11-06 | CodeBuddy (AI) | **§4.2 rev 1.62 — conditional Legend Placement & Table Attachment Rule, atomic change.** Owner decision 1 of 2026-11-06 (in-SVG bottom legend) is formally superseded **for attached-table panels only**: where a `.c1-grid` renders a native `<table>` whose `<thead>` month cells are the shared X labels, the in-SVG legend MUST sit above the plot and the plot bottom MUST touch the `<thead>` with zero intervening elements; other §4.2 charts keep the bottom legend (`SHOULD`). Trigger is C1-only — C2, C3, C4 and MDL are explicitly out of scope; HTML/toolbar legends remain excluded so PNG/Copy fidelity holds. Both byte-identical spec copies gained rev **1.62** (rev 1.61's four-series / `floor(W / 132)` wrapped-row detail retained for both branches; the inclined-X-label bottom-padding clause scoped to the bottom-legend branch; §4.2 grid contract and §8.2 assertion 21 extended). `render.js` rev 0.9: `c1PlotSvg()` now sets `yTop = legendH`, `yBot = yTop + plotH`, `H = yBot` and places legend rows at `14 + row*18`; all Y coordinates, `data-geo`, static Y ticks and `.chart-snap` follow. `dashboard.js` `c1Refit()` refreshes the reused `.chart-snap` node's `y1`/`y2` because `yTop` is now legend-row dependent. `render.test.mjs` rev 0.10 asserts `yTop > 0`, `H === yBot`, a legend row above `yTop` and `y2 - y1 === 300`. `checks/sub.mjs` rev 1.8 adds `c1.legendAbovePlot`; `harness.mjs` rev 1.17 measures `legendAbovePlot` and compares `headTopDelta` to the last grid line (the plot X axis) rather than the SVG box bottom. `SKILL.md` rev 1.4, gate row 11 and the §4.3 live design statement re-synced. Standalone HTML rebuilt; `npm test` and a fresh Tier 5 run recorded in `test_log.md`. |
| 2.89 | 2026-11-06 | CodeBuddy (AI) | **I116 / T19.1 closed out — §4.2 rev 1.60 and the layout-harness Tier 5 gate passed.** Both UI spec copies (root + `harness-layout/spec/`) gained a normative §4.2 **Y axis contract** (one vertical `sc-yaxis-line` at `x=0`, five Y ticks and a rotated side unit caption `Cumulative documents`) and a rewritten **Fallback, reflow and print** clause that resolves the former "A wide period MUST scroll inside the chart board" text: the whole curve stays visible in the board at every width, with no `min-width` and no horizontal scrollbar, and the `ResizeObserver` keeps `width`/`height`, `viewBox`, `data-geo.W`, every `data-points[].cx`, `--c1-cols` and `<colgroup>` in sync so `preserveAspectRatio="xMidYMid meet"` cannot letterbox the plot. §8.2 assertion 21 and gate row 11 now cover the Y axis, `<thead>` adjacency, no separate SVG X labels, no-scroll fitting and alignment after a period-window change. Both spec copies are byte-identical. Owner decision 2026-11-06 kept the legend in-SVG at the bottom. Engine fixes: `render.js` emits the Y-axis line, drops `.sc-asof` and uses the `Cumulative documents` caption; `dashboard.css` rotates `.c1-ycap`, adds the 1 px axis rule and visually hides the required `<caption>`; `dashboard.js` synchronises `width`/`height` with the `viewBox` in `c1Refit()`, exports the rotated caption and no longer emits the hidden caption as a stray `<text>`. Root cause: a stale static `1426 x 324` attribute pair against a refitted `928 x 342` `viewBox` forced `scale:0.6165` and a `177.9 px` letterbox inset; the fix yields `scale:1, inset:0`. **Verified:** Tier 5 **34 passed / 0 failed / 0 warnings / 1 skipped**; `npm test` pipeline **24/0** and render **40/0**; standalone HTML rebuilt → **342,492 bytes**. The I116 closure item for §8.2 assertion 21 / gate row 11 is ticked and the no-scroll spec deviation is resolved. |
| 2.73 | 2026-11-03 | CodeBuddy (AI) | Fixed **I103** and **I104** — owner report: the C2 Delay hover window "is not shown up". A Playwright probe proved the window opened only on the ≈7.7 px dots (element mode; §4.6 forbids dead zones) with pre-§4.6 content and a hard-coded hex. The Delay view is now nearest-datum (`data-points`/`data-geo` + snap line, tokenised `--color-c2delay`, exported `c2DelayTipHtml` with a swatch row and a "Docs in mean" footer). Harness blind spots fixed: the in-page switch sweep re-queries stable CSS paths per click (the old handle collection detached on the first repaint, so only the first switch per page was ever tested), every state is tested in isolation and restored, coverage runs per state, and `nearest` asserts payload + empty-area reveal (`elementViews` exempts the funnel). The working sweep exposed **I104** — the Funnel board returned no `.chart-tip` (`I100` class) and stuck — fixed with per-stage `data-tip` windows; the C4 Age-buckets bars also gained `data-tip` rows. Negative test: 10 FAIL on the unfixed build. Render 25/0, pipeline 24/0, Tier 6 1426/0/0, full harness 1562/0/0 with 27 skipped, HTML rebuilt → 311,494 bytes. |
| 2.72 | 2026-11-03 | CodeBuddy (AI) | Fixed **I102** — the C1 hover window now follows §4.6, after the owner approved the real-data sample (`sub/sample-c1-hover.html`). Body rows are `swatch · label · value` with tokenised swatches; the forecast per-period count is shown (it was computed and drawn as a bar but never put into `data-points`); the footer carries the owner's A+B summary (`Actual Σ N` / `% of plan · N ahead/behind`). Hidden series drop their rows via `data-c1meta`; a projected forecast (no MDL forecast dates) is labelled and shows an em dash. Actual Resub got `--color-actualresub:#c026d3` — bar, line and dot follow it, so the on-chart series changed too. Harness: `ctL: true` on the C1 entry, assertion label made series-generic. Render 24/0, pipeline 24/0, Tier 6 323/0, HTML rebuilt → 306,808 bytes. |
| 2.71 | 2026-11-02 | CodeBuddy (AI) | Fixed **I101** — the Tier 6 §4.6 hover guard could not detect a host that never binds. `lintHoverWindow` discovers hosts by `[aria-describedby]`, and `bindChartHover` sets that attribute only after it finds the window, so the unbound KPI cards were never checked at all (I100). New coverage pass in `harness-layout/harness.mjs`: per configured `hover.boards` / `hover.kpi` selector on every view, count the hosts present and require every one to be bound ("N of M"); plus a final assertion that each configured selector appeared on at least one view. Negative test proves the check works: with the KPI `.chart-tip` stripped from the built HTML, Tier 6 reports 2 FAIL (KPI card 0 of 6 Overview, 0 of 8 Analytical); restored, 321/0. The harness needs a local server at 127.0.0.1:8765 over `sub/` (config `pageUrl`). |
| 2.70 | 2026-11-02 | CodeBuddy (AI) | Fixed **I100** — the KPI card hover window never opened; only the cursor changed (owner report). The cards carried `data-tip` but no `.chart-tip` element, and `bindChartHover` returns early when a root has no `.chart-tip`, so nothing was ever bound; `.kpi-card{cursor:help}` still applied. Added the window element to `card()` and to the hand-written "Documents Submitted / In Plan" card, and gave the focus branch a fallback to the root (a KPI card carries `data-tip` on itself, not on a descendant). New render test guards every KPI card. Render 23/0, pipeline 24/0; HTML rebuilt → 302,665 bytes. Harness gap: Tier 6 discovers hosts by `aria-describedby`, so a card that never binds is invisible to it — an expected-host-count assertion is still needed. |
| 2.69 | 2026-11-02 | CodeBuddy (AI) | Verified after the owner added the `V-34` / `V-35` rows to both `Code` sheets. Pipeline **24/0**, render **22/0**. Live workbooks: 14 codes raised, none undefined, `W-CODE-MISSING` silent; `V-35` fires on 2 documents; both C3 donuts total 190. HTML rebuilt → 302,125 bytes. Owner follow-up: the `V-34` Group cell still reads `Referential`, not `Data quality`. |
| 2.68 | 2026-11-02 | CodeBuddy (AI) | **I099 fixed** on the owner's decision ("add no outcome, and raise errors — this is a data quality issue"). Two halves. **Donut:** the All-months Approval donut gained a **"No Outcome"** segment (grey, `.c3-no`), so a document that is neither open under review nor carrying an approval code is visible instead of vanishing; `c3Metrics` returns `noOutcome`, `c3Totals` sums it, and both rings now total the same distinct-document count. A single month is unchanged — it shows that month's activity, and a row with no approval is not an approval event. **Error:** new code **`V-35`** (Group `Data quality`, Severity `Error`), raised once per document on its latest submission row when the document carries no approval code and is not open under review; the outcome codes come from the Submittal Log `Code` sheet. Today it fires on 2 documents (`131236-WIL21-CL-M-0007` log row 113, `131236-WNS03-DR-P-6050` log row 205). Files: `engine/render.js`, `engine/pipeline.js`, `engine/dashboard.css`, both test files. **Add the `V-35` row to the Submittal Log `Code` sheet (columns K–N).** |
| 2.67 | 2026-11-02 | CodeBuddy (AI) | Owner instruction: tests read the actual files, never a remembered number. `test/pipeline.test.mjs` gained `rawPlannedRows()`, `rawSubmissionRows()` and `rawOrphanCount()`, which scan the raw sheet cells; every workbook row-total assertion now compares the model against the file. `test/render.test.mjs` derives the submissions KPI and the active-set count, and gained `globalThis.window` / `globalThis.document` stubs (approved) that unmasked 10 tests failing since revision 0.62. Owner instruction: report every code the Code sheets do not define — new **`W-CODE-MISSING`** warning names each code with no row (or an empty Rule cell) and says to add it to BOTH workbooks. **`V-34`** re-grouped to **`Data quality`**. **I099** logged and unfixed: the C3 Pie view Submissions donut totals 190 against the Approval donut's 188 (two documents carry `TO Check` and a blank Approval Status, so they land in no approval segment). Results: pipeline 23/0, render 20/1. HTML rebuilt → 298,592 bytes. |
| 2.66 | 2026-11-02 | CodeBuddy (AI) | Closed eight pending issues from owner review. **I026** — the pipeline no longer raises `V-01` on a Master Document List row (decision D33 gives a blank MDL `Document No.` to MDL); the Submittal Log keeps its own `V-01`, and the Validation meta line states the rule. **I027 / I028** — new **`V-34`** (Referential, Warning): a planned row carries an `Actual 1st Issue Date` while the Submittal Log holds no row for that `Document No.`, plus the aggregated banner warning **`W-MDL-LOG-MISMATCH`** and detail rows in the Validation list; `Actual 1st Issue Date` is now an *optional* MDL field (`mdl.optionalFields`), so a workbook without the column still loads. **I029** — `xlsx-reader.js` records every formula cell, `codeIssue` marks a cached value, and `W-CACHED-VALUE` reports one warning per source and field. **I030** — confirmed already covered: an approval code in `Submission Status` is outside the Code-sheet domain and raises `V-07` (a regression test now guards it). **I045** — confirmed already fixed in both the engine and the standalone HTML (`document` click listener closes every floating panel before the button guard). **I046** — the C3 Breakdown drops the `Total Plan` column and metric row in the submitter view and shows a note; the discipline view keeps it. **I020** — each dark theme now sets `--line` and `--soft`. Files: `engine/pipeline.js`, `engine/render.js`, `engine/xlsx-reader.js`, `engine/dashboard.css`, `config/pipeline_contract.json`, `test/pipeline.test.mjs`, `test/render.test.mjs`. Built HTML outputs must be regenerated. |
| 2.65 | 2026-11-01 | CodeBuddy (AI) | Added a §4.6 hover-window regression guard to the shared layout harness: new **Tier 6** in `harness-layout/harness.mjs` (`lintHoverWindow` + dispatch) and a `hover` config block in `harness-layout/checks/sub.mjs`. It asserts, per chart board (C1–C4) and KPI card, the focusable host + `aria-describedby` → `role="tooltip"` window, the `cursor:crosshair`/`help` affordance, the `.chart-snap` line on nearest charts, and that a hover/tap reveals the window (which hides on pointer-leave); the C2 `.ct-l` swatch+label grouping is guarded where configured. Closes harness issue I002 and prevents the I092 C2 defect from silently regressing. |
| 2.64 | 2026-11-01 | CodeBuddy (AI) | Follow-up fix **I092** (issue log 0.80) — C2 hover window not per spec §4.6. Added `.ct-l` label-group class + `align-items:center` on `.chart-tip-row` and wrapped the C2 swatch + label in `.ct-l` so swatch and label stay grouped (value on the right); set `role="tooltip"` on the window in the shared `bindChartHover` (benefits every chart and KPI card). The C2 swatch still uses a hard-coded hex from `c2Color()`; full tokenization of C2 status colours is a separate, larger task. |
| 2.63 | 2026-11-01 | CodeBuddy (AI) | Completed **T-D3 / T-D4 / T-D5** of the hover floating-window work. T-D3 replaced every native `<title>` (C3 bar segments, C3 donut arcs, C4 scatter, C2 Delay) with the shared `.chart-tip` driven by per-element `data-tip` (**I090 resolved**). T-D4 gave every KPI card a below-card `.chart-tip` with Purpose / Data source / Calculation from `KPI_META` (**I091 resolved**). T-D5 added `cursor:crosshair` affordance (**I080**), focusable boards + `aria-describedby` + show-on-focus (**I081**), a touch tap-to-show variant (**I082**), an opacity-only transition with the update-on-change guard (**I085 / I086**), a unified `.chart-tip-foot` (**I084**), and `overflow:visible` on chart hosts / ancestors (**I088**). The delegated `bindChartHover` now supports nearest-datum and element modes plus below-card placement. All hover-window issues I080–I091 are resolved. |
| 2.62 | 2026-11-01 | CodeBuddy (AI) | Completed **T-D1** — extracted the delegated `bindChartHover` binder, renamed `.scurve-tip` / `.c2-tip` → `.chart-tip`, unified `.chart-snap`, and renamed inner classes. C2 dark tip removed (**I089 resolved**); I086 update-on-change guard added (opacity transition pending T-D5). The old duplicated C1 / C2 hover blocks were removed. |
| 2.61 | 2026-11-01 | CodeBuddy (AI) | Resolved I083 — removed three duplicate series colour hues in `sub/engine/dashboard.css` (app=actual green, awc=plan blue, nap=forecast amber); reassigned app→lime `#65a30d`, awc→cyan `#0891b2`, nap→pink `#db2777`; aligned `sub/sample-hover.html` to the same palette. Built HTML outputs to be regenerated. |
| 2.60 | 2026-11-01 | CodeBuddy (AI) | Recorded review decisions on hover-window issues: I082 touch variant REQUIRED (no desktop-only fallback); I090 C3 / C4 confirmed to adopt the floating window (native `<title>` not accepted — removed the open decision from §4.11); I083 action assigned — verify the live token set and remove duplicate hues. Docs only; no dashboard code changed. |
| 2.59 | 2026-11-01 | CodeBuddy (AI) | Drafted the **Chart hover floating window** standard. UI spec §4.6 (rev 1.50) replaces the per-chart RECOMMENDED hover note with one normative component contract (`.chart-tip` / `.chart-snap`) covering all chart boards (C1–C4) and KPI cards: tokenized visual contract, header/body/footer layout with unique series tokens, 4-edge clamping, below-card KPI variant, `cursor:crosshair` affordance, required touch variant, optional snap line, `data-points`/`data-geo` plumbing, opacity-only motion with update-on-change, accessibility (focusable board + `aria-describedby`), `overflow:visible` containers, and a single delegated binder. Both spec copies re-synced. Workplan §4.11 records the implementation plan and current divergence (C2 dark tip, C3/C4 native `<title>`, KPI no window). Issues I080–I091 logged. Review sample `sub/sample-hover.html`. For review. |
| 2.58 | 2026-10-31 | CodeBuddy (AI) | Removed the **C5 Forward and Overdue** panel from the Analytical page (engine `render.js` `analytics()`) because it duplicated the dedicated **Forward and Overdue** side-menu page (§4.8). The `forwardAndOverdue` view is retained and is now reached only via the side menu. The Analytical page now carries a single combined chart (C4 Turnaround & Aging) in the shared content grid plus the Bottleneck KPI strip. §4.8/§4.9 and the D6/D9 regrouping notes updated; standalone HTML rebuilt. |
| 2.57 | 2026-10-30 | CodeBuddy (AI) | Refined the Analytical page Bottleneck KPI strip per owner review (issue I079). Dropped *Overdue* and *Look-ahead* from the strip because the C5 card on the same page already covers them (no duplication). Five live cards are now distinct bottleneck lenses, each sourced from the Submission Log against `asOf`: **Long-due (aging SUR)** buckets <30 / 30–60 / 60–90 / >90 days **past each record's target return date** (replacing the earlier `asOf − submissionDate` age basis); **Rework Rate** = resubmitted ÷ total submissions (%); **Avg Review Cycle** = mean(actualReturnDate − submissionDate) per record where both dates exist; **Avg Approval Cycle** = mean(firstApprovalDate − firstSubmissionDate) per document (firstApprovalDate derived from first AWC/APC status, firstSubmissionDate = earliest submissionDate per document); **Avg Review Delay** = mean(delayDays), already implemented (view.kpis.averageDelay). Required Review FTE remains deferred with §4.10. Data-source / calculation table added to workplan §4.9; issue log 0.74. |
| 2.56 | 2026-10-30 | CodeBuddy (AI) | Corrected the I077 table-border fix per owner review: the table's own `.ds-split` border must be the single external border, not the card's. Replaced `.c-card .ds-split{border:0}` with `.c-card:has(.ds-split){border:0}` (engine + standalone CSS); now every table keeps its border and any card wrapping a table drops its own border (no double border). All eight data tables show one clear external border. Issue log 0.73; spec §4 gained a normative note (revision 1.49). |
| 2.55 | 2026-10-30 | CodeBuddy (AI) | Fixed table external-border inconsistency (I077): Submittals and the C3 Breakdown summary rendered a bare `.ds-split` border instead of living in a `.c-card` (the §4 card contract says every table + its controls share one card, which supplies the single border). Wrapped both in `.c-card` (engine `render.js` + standalone HTML); `.c-card .ds-split{border:0}` now removes the redundant table border so all eight data tables share one border model. Issue log 0.72. |
| 2.54 | 2026-10-30 | CodeBuddy (AI) | Fixed table-corner non-compliance (I076): six `.ds-split` tables inside `.c-card` (C2 per-discipline, Validation Rules + Issues, Forward and Overdue ×3) rendered square corners because `.c-card .ds-split{border-radius:0}` flattened the base 10 px radius. Removed `border-radius:0` so card tables keep rounded corners while the card still supplies the only border. Audit: Submittals and C3 per-card tables were already compliant. UI spec §4 gained a normative note (root + harness, revision 1.48); issue log 0.71. Standalone HTML updated. |
| 2.53 | 2026-10-30 | CodeBuddy (AI) | Fixed a panel-chrome regression on the Forward and Overdue page (I075): `forwardAndOverdue` returned a bare `.c-card`, so the page lost the §4 edge border and title (the page renderer does not wrap views; only `activePanel()` emits them). Wrapped the view in `activePanel('Forward and Overdue', …)`, matching the old `coverage` nesting under C5. UI spec §4 gained a normative rule that every view wraps its own output in `activePanel()` (root + harness, revision 1.47); issue log 0.70. Standalone HTML updated. |
| 2.52 | 2026-10-30 | CodeBuddy (AI) | Refined the Forward and Overdue page (I074, owner review of I073). The Horizon control is now a segmented toggle (1/2/3/4 wks) matching the Lane filter button style; the Look-Ahead view shows a window subtitle ("Next N weeks (+7 to +N×7 days): M documents due"). All three tables show Document No. and Title together, with widths that show the full Document No. (150 px, pinned) and Title (300 px). UI spec §4 gained a normative rule (Document No. + Title, full-width columns) — revision 1.46; harness spec re-synced; issue log 0.69; standalone HTML updated. |
| 2.51 | 2026-10-30 | CodeBuddy (AI) | Redesigned the Forward and Overdue page (renamed from "Forward Plan"; I073). The side-menu page and the Analytical C5 card now carry three views — Look-Ahead (forward-only, 1–4 week horizon starting +7 days, three lanes: first submit / resubmit / return), Overdue (the same three categories past due), and Coverage (NFS) — inside one `.c-card` that groups the view toggle, view-specific controls and table. Every table offers a `⤓ CSV` of the on-screen rows. Spec §4 gained two normative rules: a data table and its controls share one `.c-card` (extending the chart-card contract to tables), and every on-screen `.ds-table` MUST offer a `⤓ CSV`. UI spec revision 1.45; issue log 0.68; workplan §4.8, §4.9, §4.3 module table and the sidebar-width note updated; decisions D44 and D45 captured. Engine implementation (render.js / dashboard.css) is the next task. |
| 2.50 | 2026-10-29 | CodeBuddy (AI) | Resolved I071 and I072 (Wave 18, T18.8–T18.9). **I071**: the Validation panel wrapped its Rules + Issues tables in a native `<details>/<summary>` disclosure toggle, redundant with the left-sidebar page navigation; removed it so the tables show directly, and added a `⤓ CSV` export to the Issues table tools (right-aligned beside `Columns`), with `exportKeyedTableCsv(key)` in `dashboard.js`. Spec §4 gained a normative no-in-panel-disclosure rule (revision 1.43). **I072**: reorganized the Validation panel to the §4.5 layout standard (revision 1.44) — one `.v-summary` flex row (count + severity chips + meta line), each table in its own `.c-card` (inner `.ds-split` border removed), a `.table-head` row aligning each card title with its tool cluster, a clearer `Showing X of Y rows` count, and default column widths that give the Rules Description (≈420 px) and Issues Message (≈360 px) / Value (≈130 px) the most room. The shared `table()` helper gained an optional `opts` (`widths`, `title`). Files: `render.js`, `dashboard.css`, both spec copies, standalone bundle. The 4 pre-existing V-33 data-count test failures remain. |
| 2.49 | 2026-10-29 | CodeBuddy (AI) | Added validation code **V-33** to the MDL plan-row pass (`sub/engine/pipeline.js` `parseMdl`): a registered `Document No.` with a blank `Planned 1st Issue Date` raises `V-33` (Error, Group `Data quality`; message "Planned 1st Issue Date is blank. Every registered document needs a first-issue plan date."). The 16:40 workbook `Code` sheet already carries the V-33 row (confirmed present). Measured on the 2026-10-29 (16:40) baseline: `V-33` = 1676 (matches `blankPlanDate`), `asOf` = 2026-10-29, `workbookRows` = 7729, `withDocumentNo` = 7631. Catalog, the new-sub-codes table and the Excel edit guide updated to `V-29`…`V-33`. |
| 2.48 | 2026-10-29 | CodeBuddy (AI) | Resolved I069 and I070 (Wave 18, T18.6–T18.7). **I069**: the Submittals drill cell painted a clipped ellipsis (two dots) after the chevron, because `.drill-cell` (0,1,0) lost the cascade to `.ds-table th, .ds-table td` (0,1,1); the rule is now `.ds-table .drill-cell` with `overflow:hidden;text-overflow:clip`, and the spec's 4 px padding applies for the first time (spec §4.4, revisions 1.40 and 1.41). **I070**: the column-visibility chooser was rebuilt to §7.1 B7 — one shared `columnChooser` builder (master → note → divider → item list → footer), pinned identity columns listed ticked and disabled, tri-state master, `N hidden` + `Reset to defaults`, 380 px panel, `.cc-btn` + `aria-expanded`, stays open across a tick, closes on an outside click or Escape. The global filters now start from the data: all five dimensions fully ticked (Stage 9 of 12, master indeterminate), blank values listed as `(blank)`, and an empty tick set filters every row out (D42, spec §7.1 revision 1.42). Files: `render.js`, `dashboard.js`, `dashboard.css`, standalone bundle (259,121 B). Pipeline 18/18 and render 20/20 pass; Chromium evidence recorded in I069 and I070. Wave 18 report filed: `workplan/reports/Wave-18-Submittals-and-Chooser.md`; `update_log.md` 1.25 and `test_log.md` 1.18 filed. |
| 2.47 | 2026-10-29 | CodeBuddy (AI) | Resolved I068: the Submittals panel drill-down now follows the standardized spec §4.4 / §7.1 B4 model. `.expandable` owner row + real `<button class="drill-btn">` (`aria-expanded` + `aria-controls`), `.drill-cell` / `.drill-chev` rotated 90° when expanded, `.sub` / `.sub-inner` detail, accordion (one open), keyboard Enter/Space, delegated listener, and `--line`/`--soft`/`--muted`/`--navy`/`--blue` tokens. `render.js`, `dashboard.js`, `dashboard.css` and the standalone HTML updated; the D41 render test updated. Pipeline and render suites pass 38/38 (owner-confirmed). Wave 18 and T18.1–T18.5 complete. |
| 2.46 | 2026-10-28 | CodeBuddy (AI) | Captured Submittals panel business requirements from owner review (D41) and added implementation tasks (T18.1–T18.5): one row per document with a consolidated, toggleable submission history; Current Submission Status and Current Approval Status shown in the main table; per-submission Prolog / Transmittal No. in the expanded history; Document Title read from MDL with prolog-subject fallback; CSV button right-aligned; column-visibility control follows spec §7.1 B7; single summary line. |
| 2.27 | 2026-10-26 | CodeBuddy (AI) | Implemented T15.3 and T15.6 (D38). T15.3 splits the C3 Breakdown into two side-by-side vertical-bar charts (Submissions: First Submission, Resubmission, Under Review; Approval Status: APP/AWC/NAP/REJ/INF), both vertical; the former bar/ring toggle is replaced by the two-chart layout. T15.6 implements the D38 Under Review rule: `c3UnderReviewD38` counts every `SUR` row up to and including the as-of month, then deducts First Submission and Resubmission rows in the as-of month. Resolves `issue_log.md` I049 and I052; pipeline and render suites pass 34/34 (TEST-018). |
| 2.28 | 2026-10-26 | CodeBuddy (AI) | Refined the All-months C3 summary (D36/D38/Wave 4.2) per owner confirmation. All-months Submissions use Option A (First Submission = documents with no resubmission; Resubmission = documents with ≥1 resubmission, each document once); Approval Status uses the first approval per document; Under Review for All months is currently open documents (D34) shown as SUR in the Approval ring, so it is never double-counted with Submissions; blank Document No. rows are excluded. D38 now applies to a specific month only. These rules also drive T15.4 (Pie/Ring full-set: two concentric rings, both totalling the distinct-document count). T15.3's All-months view is refined by the same rules; T15.4 is in progress. |
| 2.29 | 2026-10-26 | CodeBuddy (AI) | Completed T15.4 (Pie/Ring full-set view). `c3PieSVG` draws two concentric rings that ignore the Break-down-by toggle and use the discipline set for all disciplines: outer = Submissions (First Submission + Resubmission; for a specific month adds Under Review as a third segment), inner = Approval Status (APP/AWC/NAP/REJ/INF + SUR for All months). Both All-months rings total the distinct-document count (equal-total rings). All-months shows percentages in the legend; a single month shows counts only. Verified by the corrected T15.4 test; pipeline and render suites pass 34/34 (TEST-018). Resolves I050. |
| 2.30 | 2026-10-26 | CodeBuddy (AI) | Completed T15.5 (C3 table below the charts, full width). `.c3-body` is now a vertical flex stack: the chart board (`c3-board`) on top and the summary table (`c3-summary`) below at full panel width, replacing the former side-by-side grid. The `breakdown` comment is updated. A new T15.5 render test asserts the table sits below the chart board and is the single full-set table. Pipeline and render suites pass 35/35 (TEST-018). Resolves I051. |
| 2.35 | 2026-10-27 | CodeBuddy (AI) | Resolved I056 (C3 controls / pie redesign):
| 2.36 | 2026-10-27 | CodeBuddy (AI) | Resolved I057 (C3 full MDL discipline set + per-card attached table):
| 2.37 | 2026-10-27 | CodeBuddy (AI) | Resolved I058 (regression):
| 2.38 | 2026-10-27 | CodeBuddy (AI) | Resolved I059: the shared C3 Breakdown summary table gained a Download button exporting it as CSV (`data-c3export` → `exportC3TableCsv`, reads the rendered `.c3-summary` rows from the DOM, skips `.ds-gut`, BOM for Excel). Render and pipeline suites pass 37/37 (TEST-018); standalone HTML rebuilt. C3 Bar card PNG/Copy buttons did nothing after the I057 div-grid redesign (export serialized a non-existent `<svg>`). Added `c3CardToSvg(btn)` (native-SVG reconstruction of the card: bars + vertical axis labels + attached table + legend) and routed `serializeC3Svg` / `exportC3Png` through it; `exportC3Png` sizes from `naturalWidth`/`naturalHeight`. PNG/Copy now work for Bar and Pie. Render and pipeline suites pass 37/37 (TEST-018); standalone HTML rebuilt. the C3 Submissions and Approval Status cards now list every MDL discipline (and every known submitter) even when a month has zero, so empty disciplines still appear; each card draws its bars inside one aligned CSS grid (bars + vertical axis labels + an attached data table) so every column lines up. Submissions table = Total Plan / First Submission / Resubmission / Under Review; Approval table = the codes. The shared summary table (c3Table) is kept (Q8). Render and pipeline suites pass 37/37 (TEST-018); standalone HTML rebuilt. the C3 panel now uses one shared control cluster (Month + Break-down-by, hidden in Pie view) beside the charts; the Pie view renders the two cards (Submissions, Approval Status) as their own donuts instead of a consolidated two-ring card. The constant-bar-width bars are unchanged. Render and pipeline suites pass 37/37 (TEST-018); standalone HTML rebuilt. |
| 2.40 | 2026-10-28 | CodeBuddy (AI) | Enhanced the C3 Breakdown spec (§4.2, revision 1.34) with y-axis grid lines + numbers matching C1/C2, and re-synced the harness bundled spec from the root. Decision logged as I060; UI implementation tracked as T16.8. See spec revision 1.34.
| 2.46 | 2026-10-29 | CodeBuddy (AI) | Refined the I067 panel/card model: removed the redundant inner `.c-card` border around the C1 S-curve (single-graph panel — the panel edge already frames it; `schedulePerformance` now emits controls + chart directly inside the panel). C2 keeps its single `.c-card` and C3 keeps its two `.c3-card`s. Spec §4.1 clarified that an inner card border is required only for multi-graph panels (to separate graphs) or to group a graph with its own controls (C2); single-graph panels rely on the panel edge alone. Issue log I068; spec rev 1.39; standalone HTML rebuilt; suites pass. |
| 2.45 | 2026-10-28 | CodeBuddy (AI) | Resolved I067: reverted the I066/1.37 borderless-panel deviation. `.panel` now carries the edge (background + border, header inside); each graph is wrapped in a bordered `.c-card` (C1/C2 added; C3 already `.c3-card`) so graphs are visually separated within the panel. The C2 panel uses a single `.c-card` (view toggle + chart + table) per owner confirmation. Spec §4 corrected (rev 1.38); issue log 0.62; standalone HTML rebuilt; suites pass. |
| 2.43 | 2026-10-28 | CodeBuddy (AI) | Resolved I061: the C3 All-months `Total Plan` now sums planned 1st issues only for months ≤ `model.meta.asOfDate` (matching `view.c1.asOf`), excludes blank-month (unscheduled) plans, and returns 0 when as-of is empty; a specific month still counts only its own planned 1st issue. `render.js` `planCount` (one fix point covers the bar card and summary table). Render suite rewrote the Total Plan assertion; 37/37 pass (TEST-018); standalone HTML rebuilt.
| 2.43 | 2026-10-28 | CodeBuddy (AI) | Fixed I064 and refined the C2 Funnel (D40) per owner review of the first live render. I064: the funnel had never rendered — `c2Funnel`'s stage key `underReview` did not match `c2.funnel`'s `inReview`, so `widthOf(undefined)` produced `NaN` coordinates and every band had no geometry; the stage key is now `inReview`. Refinement (I065): stage names + values moved to a left label gutter (right-aligned, theme-aware) so long names never clip; the separate legend row is removed; Approved is a solid 92 px square block (owner request) instead of a sliver-wide 3D cube; funnel column widened to 350 px; the per-discipline table sizes to its content (`width:auto`). UI spec §4.2 rev 1.36; issue log 0.60; standalone HTML rebuilt; suites pass. |
| 2.44 | 2026-10-28 | CodeBuddy (AI) | Resolved I066 (C2 panel border / bottom gap): per owner review, the panel border now wraps only the content (table, charts, filters, buttons) inside a new bordered `.panel-body`, while the title row — with Help `?` and the Collapse `−` toggle — sits **outside** the border (previously the whole `.panel`, including those controls, was enclosed). The corner `Panel N` number moved onto `.panel-body` (inside the border). Also removed `min-height:420px` from `.c2-funnel-wrap`, which had left a large dead band below the Funnel chart when the discipline table was shorter than 420 px; the funnel now sizes exactly to its aligned height. §4 panel diagram / surface / CSS updated (rev 1.37); UI spec re-synced; issue log 0.61; standalone HTML rebuilt; suites pass. |
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
  §4.2 rev 1.27). In-SVG legend above the plot (§4.2 rev 1.62, attached-table rule), Start (red dashed) + Today (grey dashed) lines, +1 month tail,
  shared `Docs` scale, hover snap line + floating window. This chart spans the selected content width.
  **Attached table (normative, spec §4.2 rev 1.59; §8.2 assertion 21).** The C1 chart board MUST
  carry an **attached table** below the curve, inside the same `.sc-board`. The rule is universal:
  metric rows come from this dashboard's data and workplan; no row is fixed by the spec. One
  `.c1-grid` CSS grid is the alignment container. Set `--c1-gutter:104px` and `--c1-cols:N` once,
  then use `grid-template-columns:var(--c1-gutter) repeat(var(--c1-cols),minmax(0,1fr))` and
  `column-gap:0`. Column 1 holds the Y ticks, the Y caption and the metric labels. Columns 2..N+1
  hold one period each. One `<svg role="img">` draws the curve in `.c1-plot`, which spans columns
  2..-1 of row 1; use `xc(i)=(i+0.5)*W/N`, where W is the measured width of that cell. A
  `ResizeObserver` on `.c1-plot` MUST recompute W and redraw on every width change (§3.4.1); a
  `window` resize listener alone is not sufficient. One native `<table>` (Option B) sits in one
  grid item spanning all columns. It MUST carry a short `<caption>`, a `<colgroup>` driven by the
  same CSS variables, `table-layout:fixed`, `<th scope="col">` month cells and `<th scope="row">`
  metric labels. The `<colgroup>` widths MUST match the `.c1-grid` tracks, so the SVG, the headers
  and the values share one horizontal boundary per period. ARIA table roles MUST NOT be used;
  `display:contents` MUST NOT be applied to table elements (§0, accessibility tree). Static HTML
  cells MUST show the table without scripts; the script MUST rebuild the same cells. A wide period
  MUST scroll inside the board, never the page (§3.4.1); print MUST show the full grid. Use
  `MMM YYYY`, put `Reporting Month` in the corner cell left aligned above the X labels, use 1 px
  light rules only, keep the Start and Today reference lines and omit the as-of subtitle. The panel
  edge plus one `.sc-board` are the only borders; add no third bordered wrapper (§4.1, I068).
  `⤓ PNG` and `⧉ Copy` MUST include the table. Rebuild it as a self-contained native SVG of
  `<rect>` and `<text>` following C3 `c3CardToSvg` (§4.1, rev 1.33); do not serialize only the
  curve and use no `<foreignObject>`. Keep `role="img"` on the SVG, keep every `scope`, link
  `aria-describedby` to `.chart-tip` only (§4.6) and keep every cell in the DOM when the grid
  scrolls. This table is not a bounded `.ds-table`; §4.3 and §7.2.15 do not apply. **CSV decision:**
  this attached table does not offer `⤓ CSV`, because §4 scopes CSV to `.ds-table`. Implementation
  is Wave 19 / T19.1 (✅ COMPLETE). The §4.2 rev 1.63 attached-table interaction is **T19.2**
  (✅ COMPLETE), logged as `I116`. See workplan revisions 2.91 and 2.92. Both review samples
  were relabelled: Option B adopted, Option A the pre-rev-1.63 baseline.
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
interactive charts. Folded here: *Approval Mix* → C3 "Approval Mix" metric; *S-Curve
Variance* → C1 "Per Discipline" view; the standalone *Coverage* panel → **Coverage** view on the Forward
and Overdue page (§4.8; C5 was removed from Analytical to avoid duplicating that page). Net
14 separate visuals → 6 charts. Each chart uses the active shared layout; C6 is on the Staffing page.

### 4.4 Submittals page (review and filter all details)

This page shows the Submittal Log as **one row per document** (D41), with the full submission history
consolidated into a toggleable detail under each row.

- **Document table (`.ds-table`, key `subdoc`)**: one row per `Document No.` (grouped from the filtered
  Submittal Log, ordered by `Submission Date`). Columns: a History toggle (▸/▾, default collapsed),
  `Document No.`, `Document Title`, `Discipline`, `Submissions` (revision count), `Current Submission
  Status` (latest row) and `Current Approval Status` (latest row). `Document Title` reads from the MDL
  planned row (`linkedPlannedId` → `planned.title`); it falls back to the submission's prolog subject
  (`fields['Document Title']`) when MDL has none (D41). `Discipline` likewise comes from MDL, falling
  back to the submission. One summary line (`N documents`) sits under the panel title.
- **Submission history (expanded)**: when the row toggle is open, a nested table lists every submission
  for the document, ordered by `Submission Date`: `#`, `Prolog / Transmittal No.` (per submission — a
  document may carry several distinct Prolog numbers, so this is shown per row, not consolidated),
  `Submission Date`, `Return Date` (`Actual Return Date`, blank if not returned), `Submission Status`
  and `Approval Status`.
- **Panel-local controls** (§7.1 B7 — no filter chrome, §7.2.7 pt 6): the column-visibility control uses
  its own `.cc-btn` class (no filter badge, no active-filter emphasis) and the floating `.column-chooser`
  panel; plus sort and a single-row quick filter. These resolve in S5 and change only this table.
- **CSV export** of the current table view (one row per document; Prolog / Transmittal No. exported as a
  flattened history column). The `⤓ CSV` button is right-aligned in the panel's `.table-tools` cluster.

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
code, Group, Rule, or Severity). The sub dashboard appends `V-29`…`V-33` for rules new to the
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
| **V-33** | Registered `Document No.` has a blank `Planned 1st Issue Date` | per Code sheet | **New — MDL plan-row** |
| **V-34** | Registered `Document No.` carries an `Actual 1st Issue Date` but the Submittal Log holds no row for it — the two files disagree (I027 / I028) | Data quality | **New — MDL plan-row** |
| **V-35** | A submission carries no `Approval Status` and is not open under review — no recorded outcome (I099) | Data quality | **New — Submittal Log record** |

**New sub codes (append to the same four columns)** — define `Group`, `Rule`, and `Severity` explicitly;
these are new rows, not changes to existing `V-01`…`V-28` values:

| Error Code | Group | Rule | Severity | Note |
|---|---|---|---|---|
| **V-29** | Referential | Submittal Log `Document No.` must exist in MDL scope; otherwise the row is an orphan | Warning | **New — mandatory** |
| **V-30** | Timeline | `Actual Return` / `Target Return` must not precede `Submission Date` | Warning | **New** |
| **V-31** | Cross-field | `Approval Status` present while `Submission Status` = NFS; or `Resubmission Required` = Yes while `Submission Status` ∉ {RTR,REJ} | Warning | **New** |
| **V-32** | Cross-field | `Submission Status` = SUR (Submitted Under Review) but `Actual Return Date` is present — an open review cannot carry a return date | Warning | **New** |
| **V-33** | Data quality | Registered `Document No.` must carry a `Planned 1st Issue Date`; a blank date is a data-quality error (the row still counts in MDL totals, but no date-axis series can plot it) | Error | **New — MDL plan-row** |
| **V-34** | Data quality | The Master Document List shows the document as issued (`Actual 1st Issue Date` present) but the Submittal Log holds no row for that `Document No.` — the two files disagree; name the authoritative file | Warning | **New — I027 / I028** |
| **V-35** | Data quality | The submission carries no `Approval Status` and is not open under review — the document has no recorded outcome, so it cannot be counted in the Approval breakdown | Error | **New — I099** |

**Excel edit guide (how to add V-29…V-34)** — open each workbook, go to the `Code` sheet, and append
the `V-29`…`V-34` rows after the last `V-xx` row. The error block starts at row 1 with the headers `Error Code`,
`Group`, `Rule`, `Severity` (discovered by label, so the column letters below are only to help you find
them). Do **not** change the headers or any existing `V-01`…`V-27` row — appending rows is safe for MDL.

| Workbook | `Error Code` | `Group` | `Rule` | `Severity` | Rows to add |
|---|---|---|---|---|---|
| Master Document List | AI | AJ | AK | AL | 29, 30, 31, 32, 33, 34 |
| Document Submittal Log | K | L | M | N | 29, 30, 31, 32, 33, 35 |

Enter, per row, the four values (`Error Code` · `Group` · `Rule` · `Severity`):
- `V-29` · `Referential` · `Submittal Log Document No. not found in MDL scope — orphan (submitted but not in the plan)` · `Warning` — mandatory
- `V-30` · `Timeline` · `Actual Return or Target Return earlier than Submission Date` · `Warning`
- `V-31` · `Cross-field` · `Approval Status present while Submission Status = NFS; or Resubmission Required = Yes while Submission Status ∉ {RTR,REJ}` · `Warning`
- `V-32` · `Cross-field` · `Submission Status = SUR (Submitted Under Review) but Actual Return Date present — an open review cannot carry a return date` · `Warning`
- `V-33` · `Data quality` · `Planned 1st Issue Date is blank. Every registered document needs a first-issue plan date.` · `Error` — new, MDL plan-row
- `V-34` · `Data quality` · `Actual 1st Issue Date is present but the Submittal Log has no row for this Document No. The two files disagree — name the authoritative file.` · `Warning` — new, I027 / I028
- `V-35` · `Data quality` · `No Approval Status and not open under review. Every submission needs an outcome: APP, AWC, NAP, REJ or INF, or SUR while it is under review.` · `Error` — new, I099

`V-34` needs the `Actual 1st Issue Date` column. It is read as an **optional** MDL field
(`config/pipeline_contract.json` → `mdl.optionalFields`), so a workbook whose `Code` sheet does not map
it still loads; `V-34` then stays silent. Add the row to the Master Document List `Code` sheet only
(the Submittal Log never raises `V-34`).

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

### 4.8 Forward and Overdue — the forward / coverage page

The side-menu page is **Forward and Overdue** (renamed from "Forward Plan"). It presents three views, all
rendered inside one `.c-card` (spec §4) that wraps the view toggle, the view-specific controls and the
table together:

- **Look-Ahead** (forward-only): documents becoming due in the next **1–4 weeks** (Horizon toggle (segmented), default
  4 weeks; the window starts at **+7 days**, so the current week is skipped — D44). It answers *what is
  coming* with three lanes — **to be first submitted** (MDL scope not yet lodged, by Planned / Forecast 1st
  Issue Date), **to be resubmitted** (latest submission `RTR` / `NTS`, not yet resubmitted, by
  `(actualReturnDate || targetReturnDate) + resubmitLead` — D45), and **to be returned** (open `SUR`, by
  `targetReturnDate`). Sorted ascending by due date; each row carries a status pill (`NFS` / `RTR` / `NTS` /
  `SUR`) and an `In (days)` numeric column. Per spec §4.3 the look-ahead is **forward-only** and must **not**
  overlap the Overdue list — overdue is the separate backward view below.
- **Overdue** (backward-looking): the same three categories as the forward lanes, but for items already past
  their date — **overdue to first submit**, **overdue to resubmit**, **overdue to return** — sorted descending
  by days overdue. This is the spec's separate backward list (§4.3 mirror rule), surfaced in the same page so
  forward and overdue share one screen.
- **Coverage**: the former standalone Coverage panel — MDL scope minus submitted documents (NFS), the
  planned-vs-forecast 1st-issue list (§3.3).

Every view's table offers a **`⤓ CSV`** export (right-aligned in the control row) that downloads exactly the
on-screen rows (UTF-8 BOM). The view toggle (`Look-Ahead` / `Overdue` / `Coverage`) is left-aligned in the
control row; the view-specific controls (Horizon, Lane, `⤓ CSV`) are right-aligned. The page is reached from
the side menu.

Every table shows **Document No.** and **Document Title** in adjacent columns, with column widths that show the full Document No. (150 px, pinned) and the full Title (300 px); the table scrolls horizontally on narrow viewports. The Horizon control is a **segmented toggle** (1/2/3/4 wks) that matches the Lane filter button style; the active choice is highlighted, and the Look-Ahead view shows a subtitle that states the window — "Next N weeks (+7 to +N×7 days): M documents due".

---

### 4.9 Analytical page (bottlenecks, delays, projected delays)

The Analytical page answers *where is it stuck* and *what is coming*. It carries a bottleneck KPI strip
and one combined interactive chart (C4 Turnaround & Aging) that follows the shared content layout.

**Bottleneck KPI strip — 5 live cards + 1 deferred (owner review, 2026-10-30).** The strip deliberately
omits *Overdue* and *Look-ahead*, which are covered by the dedicated **Forward and Overdue** side-menu page (§4.8), to
avoid duplication. The five live cards are distinct bottleneck lenses, each sourced from the **Submission
Log** (`view.active`) against `asOf = model.meta.asOfDate`; the Master Document List is not used by these
cards. Data source and calculation per card:

| Card | Data source | How calculated |
|---|---|---|
| **Long-due (aging SUR)** | Submission Log → `SUR` & `!actualReturnDate` (open, under review) | For each open SUR, `daysPastTarget = asOf − targetReturnDate`; distribute into **<30 / 30–60 / 60–90 / >90 days** past target return date (records without a target return date are excluded). Replaces the earlier `asOf − submissionDate` age basis. |
| **Rework Rate** | Submission Log → `flagResubmission` | `resubmitted ÷ total submissions`, shown as a % (denominator = total submission records). |
| **Avg Review Cycle** | Submission Log → `submissionDate` & `actualReturnDate` | Mean of `(actualReturnDate − submissionDate)` over records where **both** dates exist (per-record review duration). |
| **Avg Approval Cycle** | Submission Log → `firstSubmissionDate` & `firstApprovalDate` | Mean of `(firstApprovalDate − firstSubmissionDate)` per document; `firstApprovalDate` = first `AWC` / `APC` status date (derived), `firstSubmissionDate` = earliest `submissionDate` per document. |
| **Avg Review Delay** | Submission Log → `delayDays` | Mean of `delayDays` (negative = ahead of plan); already computed as `view.kpis.averageDelay`, reused from the Overview strip. |
| *(deferred)* **Required Review FTE** | — | `projected volume × review-hours/document ÷ productive-hours/reviewer`; deferred with the Staffing page (§4.10) until manhour benchmarks exist (Open Question §9.9). |

**Implementation status**: all six cards are implemented — Avg Review Delay (reused from
`view.kpis.averageDelay`) plus Long-due buckets, Rework Rate, Avg Review Cycle and Avg Approval Cycle, all
derived in `deriveView` (§11.3). Required Review FTE remains deferred with §4.10. See issue I079.

- **C4 Turnaround & Aging** (shared content grid): process-time analysis. **Controls**: *Scatter* (turnaround days on
  x, review-delay days on y, one point per submission) ↔ *Age buckets* (open SUR split <30 / 30–60 /
  60–90 / >90 d; overdue = past Target Return still open). Surfaces the bottleneck stage and where time
  is lost.
- **C5 Forward and Overdue** — *removed from the Analytical page* (2026-10-31). It duplicated the dedicated
  **Forward and Overdue** side-menu page (§4.8), which is unchanged and reached only via the side menu. The
  `forwardAndOverdue` derivation is retained; the Analytical page now carries only C4 in the shared content grid.

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

### 4.11 Chart hover floating window — spec & implementation (rev 2026-11-01)

**Design contract.** The hover floating window is standardized in the UI spec **§4.6** (rev 1.50). This section records the dashboard's implementation plan and current divergence; it does not restate the visual / behaviour contract.

**Component.** One `.chart-tip` window + one optional `.chart-snap` line, delivered by a **single delegated binder** (`bindChartHover(host)`) attached to each chart host. Point / geometry travels in `data-points` (`{cx, optional cy, html}`) and `data-geo` (`{W, H}`); the per-point `html` is authored by each chart's workplan § (C1 §4.2, C2 / C3 / C4 their §, KPI §4.9).

**Placement.** Chart boards: cursor-relative at `(+14, +14) px`, clamped on all four edges. KPI cards: below the card, centred / left-clamped, never covering the card.

**Current state / divergence.** Issues I080–I091 are resolved. Follow-up review **I092** corrected the C2 series-row layout and the missing `role="tooltip"`.
- **C1 S-curve** — implemented with the shared `.chart-tip` + snap line; the delegated binder was extracted in T-D1 and gained the opacity-only transition in T-D5 (**I086 resolved**).
- **C2 Submission Flow** — migrated to the tokenized `.chart-tip` in T-D1; the hard-coded dark style is removed (**I089 resolved**).
- **C3 Breakdown** and **C4 Turnaround & Aging** — migrated to the floating window in T-D3; native `<title>` replaced with per-element `data-tip` (bar segments, donut arcs, scatter points) — **I090 resolved**.
- **KPI cards** — gained the below-card floating window in T-D4, showing Purpose / Data source / Calculation per KPI — **I091 resolved**.
- **Cross-cutting (all resolved)** — `cursor:crosshair` affordance added to chart boards (I080); boards are focusable with `aria-describedby` and show the window on focus (I081); a touch tap-to-show variant is implemented (I082); series colour tokens are unique (I083); footer uses one unified `.chart-tip-foot` style (I084); the window updates only on datum change and fades via an opacity-only transition (I085 / I086); chart hosts and ancestors are `overflow:visible` (I088).
- **I092 (follow-up, resolved)** — C2 hover series row put the swatch, label and value as three separate flex children under `justify-content:space-between`, detaching the swatch from its label; the window also lacked `role="tooltip"`. Fixed: added `.ct-l` label group + `align-items:center` on `.chart-tip-row`, wrapped the C2 swatch + label in `.ct-l`, and set `role="tooltip"` on the window in `bindChartHover` (benefits every chart and KPI card). C2 swatch still uses a hard-coded hex (`c2Color()`); full tokenization of C2 status colours is a separate, larger task.

**Development tasks (proposed).**
- **T-D1** — **DONE (2026-11-01)**: extracted the delegated `bindChartHover` binder, renamed `.scurve-tip` / `.c2-tip` → `.chart-tip`, unified `.scurve-snap` → `.chart-snap`, and renamed the inner `.c2-tip-row` / `.c2-swatch` → `.chart-tip-row` / `.chart-swatch`.
- **T-D2** — **DONE** via T-D1 (the dark `.c2-tip` style was removed; C2 now uses the shared `.chart-tip`).
- **T-D3** — **DONE (2026-11-01)**: replaced every native `<title>` (C3 bar segments, C3 donut arcs, C4 scatter, C2 Delay) with the shared `.chart-tip` via per-element `data-tip`; native `<title>` is gone (**I090 resolved**).
- **T-D4** — **DONE (2026-11-01)**: every KPI card carries a below-card `.chart-tip` with Purpose / Data source / Calculation from `KPI_META` (**I091 resolved**).
- **T-D5** — **DONE (2026-11-01)**: added `cursor:crosshair` affordance, focusable boards + `aria-describedby` + show-on-focus (keyboard / screen-reader parity), a touch tap-to-show variant, the update-on-change guard with an opacity-only transition, and `overflow:visible` on chart hosts / ancestors (**I080 / I081 / I082 / I085 / I086 / I088 resolved**).

**Review sample.** `sub/sample-hover.html` demonstrates the unified window across S-curve, grouped bars, pie and KPI cards (below-card placement, totals / percentages); it is the reference for the §4.6 implementation.

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
| 18 | 2026-10-28 / developer | Submittals panel redo per owner review (D41): one row per document, consolidated toggleable submission history, Current Submission Status + Current Approval Status in the main row, per-submission Prolog / Transmittal No. in the expanded detail, MDL Document Title with prolog-subject fallback, right-aligned CSV, B7 column-visibility control, single summary line. Drill-down standardized per I068 (`.expandable` + real `.drill-btn`, accordion, CSS-rotated `.drill-chev`, `.sub` / `.sub-inner`). Added 2026-10-29: I069 (drill-cell ellipsis) and I070 (B7 chooser + filter selection semantics, D42). | Cross-panel regression — additive change: exposes `view.documents`; KPI Overview, C1–C3, Analytics, Validation, Forward Plan read their own structures and are unaffected. | Pipeline and render suites pass 38/38 (owner-confirmed); standalone HTML rebuilt (259,121 B after I070); Chromium checks recorded in I069 and I070; harness run recorded in `test_log.md` 1.19–1.20 (Tier 1 9/9, Tier 2 pass, 131 passed / 5 failed after the I-95 selector fix; open items: planned count 7,631 vs 7,513 under owner discussion, table #0 resize restore 171→162px, C1 Start/Today reference lines absent). | ✅ COMPLETE |
| 19 | 2026-11-05 / CodeBuddy (AI) | Add the C1 S-curve **attached table** per spec §4.2 rev 1.59 and §8.2 assertion 21 (I116, T19.1). One `.c1-grid` alignment container with `--c1-gutter` / `--c1-cols` tracks; one `<svg role="img">` whose host carries a `ResizeObserver`; one native `<table>` (Option B) in one spanning grid item with `<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, `scope` and `table-layout:fixed`; metric rows from data; static and rebuilt cells with the same structure; one `.sc-board` border and no third wrapper; PNG/Copy rebuilt as native `<rect>` / `<text>` following C3; no ARIA table roles. Review mock: `sub/sample-c1-table.html`. | Column drift between the SVG X points and the table columns after a reflow; a duplicate bordered wrapper; an export that omits the table. Guard with one shared set of CSS variables, a `ResizeObserver` redraw, §8.2 assertion 21 and gate row 11. | §8.2 gate row 11 checked; assertion 21 passes in the harness and the dashboard suite; static cells show without scripts; rebuilt cells keep the same structure; PNG/Copy include the table; render and pipeline suites pass; standalone HTML rebuilt. **T19.2 (✅ COMPLETE):** UI spec §4.2 rev 1.63 promoted the reviewed Option B attached-table interaction into the production build (four tokenised gradients, one hidden month band, `data-c1col`, two-way chart / table column sync, chart-only `.chart-tip`); both review samples relabelled; `build/standalone.mjs` rev 0.2 made the rebuild idempotent; `harness-layout/harness.mjs` rev 1.19 fixed the I-96 windowing trigger. Full harness 2082 passed / 0 failed / 0 advisory / 29 skipped. See revisions 2.91 and 2.92. | ✅ COMPLETE |

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
| 18 | T18.1 | [UI] | ✅ COMPLETE | Rewrite the Submittals panel (`render.js` `submissions()`) to one row per document from `view.documents`; columns Document No., Document Title (MDL → prolog subject), Discipline, Submissions count, Current Submission Status, Current Approval Status, plus a history toggle. Single summary line (`N documents`). Resolved as I068. | — |
| 18 | T18.2 | [UI] | ✅ COMPLETE | Render the expanded submission history per document as a nested table: #, Prolog / Transmittal No., Submission Date, Return Date, Submission Status, Approval Status, ordered by submission date. Per I068 the toggle is the standardized `.expandable` row + real `.drill-btn` (`aria-expanded`/`aria-controls`), accordion, CSS-rotated `.drill-chev`, `.sub` / `.sub-inner` detail. | — |
| 18 | T18.3 | [UI/CSS] | ✅ COMPLETE | Right-align the CSV button (`.table-tools` flex, `.csv-btn` margin-left:auto) and restyle the column-visibility control to spec §7.1 B7 (`.cc-btn`, floating `.column-chooser`, no filter badge). | — |
| 18 | T18.4 | [Logic] | ✅ COMPLETE | Read `Document Title` from the MDL planned row (`linkedPlannedId` → `planned.title`); fall back to the submission's prolog subject (`fields['Document Title']`) when MDL has none. Discipline likewise from MDL, fallback to submission. | — |
| 18 | T18.5 | [Export] | ✅ COMPLETE | Update the Submittals CSV export (`dashboard.js`) to one row per document with the new columns; include a flattened Prolog / Transmittal No. (history) column. Render tests updated (38/38 pass). | — |
| 18 | T18.6 | [CSS] | ✅ COMPLETE | Remove the two dots after the Submittals drill chevron (I069). `.drill-cell` (0,1,0) lost the cascade to `.ds-table th, .ds-table td` (0,1,1), so the 24 px `.drill-btn` overflowed the cell and the browser painted a clipped ellipsis. The selector is now `.ds-table .drill-cell` with `overflow:hidden;text-overflow:clip`, so the button fits and the spec's 4 px padding applies for the first time. Spec §4.4 revisions 1.40–1.41; Chromium check `textOverflow:"clip"`, `clientWidth:32`, `scrollWidth:32`. | I069 |
| 18 | T18.7 | [UI/Logic] | ✅ COMPLETE | Rebuild the column-visibility chooser to §7.1 B7 and align the global filters with the data (I070). One shared `columnChooser` builder (master → note → divider → item list → footer), pinned identity columns ticked + disabled, tri-state master, `N hidden` + `Reset to defaults`, 380 px panel, `.cc-btn` + `aria-expanded`, stays open across a tick, outside click and Escape close it. Filters: `applyDefaultFilters()` ticks all five dimensions on load, blank values read `(blank)`, an empty tick set filters every row out. Spec §7.1 revision 1.42; pipeline 18/18 and render 20/20 pass; Chromium evidence in I070. | I070 |
| 18 | T18.8 | [UI] | ✅ COMPLETE | Remove the redundant in-panel `<details>` disclosure toggle from the Validation panel (`render.js` `validation()`) so the Rules and Issues tables show directly; add a `⤓ CSV` export to the Issues table tools, right-aligned beside `Columns`, with `exportKeyedTableCsv(key)` in `dashboard.js`. Spec §4 no-in-panel-disclosure rule (revision 1.43). | I071 |
| 18 | T18.9 | [UI/CSS] | ✅ COMPLETE | Reorganize the Validation panel to the spec §4.5 layout standard (revision 1.44): one `.v-summary` flex row (count + severity chips + meta line); each table in its own `.c-card`; a `.table-head` row aligning each card title with its tool cluster; clearer `Showing X of Y rows` count; default column widths giving Rules Description (≈420 px) and Issues Message (≈360 px) / Value (≈130 px) the most room. `table()` gained an optional `opts` (`widths`, `title`). | I072 |
| 19 | T19.1 | [UI] | ✅ COMPLETE | Built the C1 Schedule Performance **attached table** below the S-curve per spec §4.2 rev 1.59 and §8.2 assertion 21. One `.c1-grid` CSS grid with `--c1-gutter:104px` / `--c1-cols:N` tracks and `column-gap:0`; one `<svg role="img">` in `.c1-plot` spanning columns 2..-1, `xc(i)=(i+0.5)*W/N`, and a `ResizeObserver` on `.c1-plot` (§3.4.1); one native `<table>` in one spanning grid item with `<caption>`, `<colgroup>` driven by the same variables, `table-layout:fixed`, `<th scope="col">` month cells and `<th scope="row">` metric labels; no ARIA table roles and no `display:contents`. Metric rows come from data; no fixed row set. Static HTML cells show the table without scripts; the script rebuilds the same cells. `MMM YYYY` labels, `Reporting Month` corner cell, 1 px light rules, Start and Today lines, no as-of subtitle. Panel edge plus one `.sc-board` border; no third wrapper (§4.1, I068). The whole curve scales into the card through its `viewBox`, with no `min-width` and no horizontal scroll (owner decision 2026-11-06, see revision 2.88); print shows the full grid. PNG/Copy rebuild the table as native `<rect>` / `<text>` following C3 `c3CardToSvg`; `aria-describedby` links to `.chart-tip` only (§4.6). No `⤓ CSV` (§4 scopes CSV to `.ds-table`). Implemented 2026-11-06 in `render.js`, `dashboard.css`, `dashboard.js` and `test/render.test.mjs`; standalone HTML rebuilt. The whole curve scales into the card per the owner's 2026-11-06 decision (no horizontal scroll). See revision 2.88. | I116 |
| 19 | T19.2 | [UI] | ✅ COMPLETE | Promoted the reviewed Option B attached-table interaction into the production build per UI spec §4.2 rev 1.63: four tokenised `<linearGradient>` defs and `<path class="sc-area">` fills, one hidden pointer-transparent `.sc-hover-band` at `W / N`, `data-c1col` on every month `<th>` and `<td>`, two-way chart / table column sync, a chart-only `.chart-tip`, and §4.6 hidden-window ARIA state. `render.js` rev 0.10, `dashboard.css` rev 2.8, `dashboard.js` rev 2.4; `render.test.mjs` rev 0.11, `checks/sub.mjs` rev 1.9, `harness.mjs` rev 1.18. Tier 5 44 passed / 0 failed / 0 advisory / 1 skipped; full harness 2083 passed / 3 failed / 0 advisory / 28 skipped (3 I-96 windowing failures recorded, not fixed). Both review samples relabelled: Option B adopted, Option A the pre-rev-1.63 baseline. See revision 2.91. | I116 (rev 1.63) |

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

- **D6 — Combined interactive charts replace 14 separate visuals** (§4.3, §4.9, §4.10). The Overview's
  seven charts and the Analytical panels are regrouped by shared question: C1 Schedule Performance
  (S-curve) · C2 Submission Flow & Delay · C3 Breakdown (incl. Approval Mix) · C4 Turnaround & Aging are on
  the Analytical page; **C5 Forward and Overdue was removed from Analytical** (2026-10-31) because it
  duplicated the dedicated Forward and Overdue side-menu page (§4.8); C6 Staffing Estimator is its own
  side-menu page (§4.10). Each chart has a control cluster (toggle/view) and re-renders `deriveView` on
  `active` (S4 only — no DOM recompute), reusing MDL's SVG chart kit.
- **D7 — Staffing is its own side-menu page** (§4.2, §4.10). The manhour/staffing analysis (C6) is a
  separate **Staffing** nav item, not folded into Analytical, so the capacity question is reviewed on
  its own with its own KPI strip. The menu label **Analytical** is retained. **Deferred**: scheduled
  only after the user supplies manhour benchmarks (§9.9); the menu item and C6 spec are retained.
- **D8 — Shared layout behavior** (§4.0): the status bar and sidebars follow `AGENTS.md` §18.2. The layout button selects one, two, or three content columns. The S-curve (C1) may span the content width. Panel grids must fit each selected layout.
- **D9 — Redundancy folded, not lost** (§4.3, §4.9): *Approval Mix* → C3 "Approval Mix" metric;
  *S-Curve Variance* → C1 "Per Discipline" view; standalone *Coverage* panel → **Coverage** view on the
  Forward and Overdue page (§4.8; C5 was removed from Analytical to avoid duplicating that page). The
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
- **D44 — Look-ahead horizon starts at +7 days** (§4.8 / §4.9, owner 2026-10-30). The Look-Ahead window is the next **1–4 weeks**, selectable, default 4 weeks. The lower bound is **as-of + 7 days** (the current week is skipped) and the upper bound is **as-of + horizon×7 days** (so 4 weeks = +7…+28 days). Bands are Week 1 (+7–13 d), Week 2 (+14–20 d), Week 3 (+21–27 d), Week 4 (+28–34 d). Overdue is excluded from the forward view (it has its own backward view, §4.3).
- **D45 — Resubmission target basis** (§4.8 / §4.9, owner 2026-10-30). The "to be resubmitted" target date = `(actualReturnDate || targetReturnDate) + resubmitLead`. A returned document (latest row `RTR` / `NTS`, no later resubmission) uses its **Actual Return Date**; a still-open review projects from its **Target Return Date**. `resubmitLead` (duration to resubmit) is a project config value (sample default 14 days). The Submittal Log `Review Period Days` (20 first / 14 subsequent) is read per row and is **not** hardcoded in the render layer.
- **D41 — Submittals panel: one row per document with consolidated, toggleable history** (§4.4, owner review 2026-10-28). The Submittals page groups the filtered Submittal Log by `Document No.` and shows **one row per document**. The main row carries the History toggle (▸/▾, default collapsed), `Document No.`, `Document Title`, `Discipline`, `Submissions` (revision count), `Current Submission Status` (latest row) and `Current Approval Status` (latest row). `Document Title` reads from the MDL planned row via `linkedPlannedId` → `planned.title` and falls back to the submission's prolog subject (`fields['Document Title']`) when MDL has none; `Discipline` likewise comes from MDL, falling back to the submission. The expanded detail lists every submission for the document, ordered by `Submission Date`: `#`, `Prolog / Transmittal No.` (per submission — a document may have several distinct Prolog numbers, so it is shown per row, not consolidated), `Submission Date`, `Return Date`, `Submission Status`, `Approval Status`. The CSV button is right-aligned and the column-visibility control follows spec §7.1 B7 (`.cc-btn`, floating `.column-chooser`, no filter badge). One summary line (`N documents`) sits under the panel title. The change is additive: it exposes `view.documents` (the existing `documentGroups`) and leaves `view.active` and every other panel's data intact.

- **D42 — Filter selection semantics** (§7.1, owner review 2026-10-29). Every global dimension starts
  with its full value set ticked; Stage keeps its three documented exclusions unticked, so its master
  starts indeterminate (9 of 12). A blank cell is a selectable value shown as `(blank)`. An empty tick
  set filters every row out — only an absent set means "no filter" — so the panel can never show
  "nothing ticked" while the dashboard shows every row. A tick applies at once and keeps the floating
  panel open; an outside click or `Escape` closes it. The B7 column chooser follows the same rules over
  its non-pinned rows. Recorded in spec §7.1 revision 1.42 and compliance checklist row 17.
- **D43 — Plan-row first-issue date is mandatory (V-33)** (§3.3.1, §3.3.2, owner 2026-10-29). A registered `Document No.` in an MDL planned row MUST carry a `Planned 1st Issue Date`. A blank date is a data-quality error (`V-33`, Error, Group `Data quality`), not an "unscheduled" state: the row still counts in MDL totals and the plan denominator, but no date-axis series (C1 plan, C3 Total Plan, Forward Plan) can plot it. Implemented in `sub/engine/pipeline.js` `parseMdl`; the 16:40 workbook `Code` sheet carries the `V-33` row (confirmed present; measured `V-33` = 1676 on the 2026-10-29 baseline). See workplan 2.49 and `issue_log.md` 0.65.
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
  **160 px**: the widest title, "Forward and Overdue" (renamed from "Forward Plan"), is ≈135 px at 14 px / 400,
  which with the button's 12 px horizontal padding and the panel's 10 px padding needs ≈175 px — the 160 px
  default no longer clears it; raise `updateSidebarWidth` min to ~190 px (the clamp runs on load whenever a width is The clamp in
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

Update this record at the end of each implementation wave. Wave 1 approval and stack evidence are in `workplan/reports/Wave-1-Approval-and-Stack-Decision.md`. Wave 2 evidence is in `workplan/reports/Wave-2-Scaffold-and-Knowledge.md` and `workplan/reports/Wave-2.1-Knowledge-Graph-Schema.md`. Wave 3 evidence is in `workplan/reports/Wave-3-Data-Pipeline.md`. Wave 4 and Wave 4.1 evidence is in `workplan/reports/Wave-4-Dashboard-UI.md` and `workplan/reports/Wave-4.1-Discipline-Correction.md`. Wave 18 evidence is in `workplan/reports/Wave-18-Submittals-and-Chooser.md`.

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
| 11 | The C1 S-curve carries an attached table below the curve per spec §4.2 rev 1.63: one `.c1-grid` with explicit `--c1-gutter` / `--c1-cols` tracks and `column-gap:0`, one `<svg role="img">` whose host carries a `ResizeObserver`, one native `<table>` with `<caption>` / `<colgroup>` / `<thead>` / `<tbody>` / `scope`, data-driven metric rows, static and rebuilt cells, no third bordered wrapper, and PNG/Copy that include the table; one vertical `sc-yaxis-line`, **dynamic Y ticks per §4.2 rev 1.64** (max 7 intervals / 8 labels, >= ~40 px spacing, nice-number steps, one `line.sc-grid` per label, all from the same `data-c1meta.yMax` / `yStep` / `yIntervals` payload, plot height fixed at 300 units), the maximum recomputed from the selected period window on every repaint with absolute cumulative values unchanged (§4.2 rev 1.65), chart / grid / labels / hover-refit metadata / PNG-Copy sharing that one scale, and a rotated side unit caption; an in-SVG legend above the plot; the `<thead>` row flush with the plot X axis (which is also the SVG bottom) with no separate SVG X labels; the whole curve visible with no horizontal scroll and bar / dot / `data-points.cx` alignment holding after a period-window change; `aria-describedby` points at `.chart-tip` only; four tokenised gradients and `<path class="sc-area">` fills, one hidden `.sc-hover-band` at `W / N`, `data-c1col` on every month `<th>` and `<td>`, two-way chart / table column sync and a chart-only `.chart-tip` (§4.2 rev 1.63); hidden windows are `aria-hidden` and empty of text (§4.6 rev 1.63) | §4.2 rev 1.63 / 1.64 / 1.65; §4.6 rev 1.63; §8.2 assertion 21; §3.4.1 |
| 12 | The C1 period control is ONE dual-handle track per §4.2 rev 1.66: two native `step="1"` range inputs on one shared visual track with `data-c1period="from" / "to"` and bounds `0..N-1`, whole-month magnetic snap, one visual-only tick per active reporting month with sequential `data-c1month` indices, five `6M` / `12M` / `24M` / `YTD` / `All` chips with `aria-pressed` anchored to the current `to` index, `aria-label` / `aria-valuetext` / `:focus-visible` on both handles and one-month keyboard steps; an `input` event changes only the track visuals while `change` performs the one full repaint; print hides `.c1-ts-body` and `.c1-ts-chips` but keeps the period text. `state.c1Period`, windowed `pts`, absolute cumulative values, `niceAxisTicks()`, the rev 1.65 shared Y axis and every export path stay unchanged; no second Y-axis or separate bar scale | §4.2 rev 1.66; §8.2 assertion 21; `harness-layout/harness.mjs` rev 1.22; `harness-layout/checks/sub.mjs` rev 1.12 |
| 13 | The five C1 presets form ONE joined `.seg.c1-ts-chips` group of five `.seg-btn` buttons per §4.2 rev 1.67, using the Sub `.seg-btn.active` / `--blue` token. The active preset is STORED as one name in `state.c1Preset`: `undefined` gives `All` at load, `null` gives a manual custom range with NO active chip, and any preset name gives exactly ONE `aria-pressed="true"` and ONE `.active`. Do NOT derive `aria-pressed` from `[from, to]` range equality, because clipped ranges collide. A handle `input` / `change` MUST set `state.c1Preset = null`; `c1SyncTimeBar()` MUST read the stored value. The tools below the panel title MUST form ONE visual row at the 1280 px minimum desktop viewport width: `flex-wrap:nowrap` on `.c1-ts`, `flex-shrink:0` on the label / period text / chip group, and only `.c1-ts-body` shrinking (basis 190 px, min-width 120 px). Below 1280 px §3.4.1 allows `flex-wrap:wrap`. Print hides `.c1-ts-body` and `.c1-ts-chips.seg`. `state.c1Period`, `c1PresetRange()`, windowed `pts`, absolute cumulative values, `niceAxisTicks()`, the rev 1.65 shared Y axis and every export path stay unchanged; the §7.5 B2 token gap is a separate deferred item (`I123`, `DEFERRED_STUDY`), NOT implemented | §4.2 rev 1.67; §8.2 assertion 21; §3.4.1; `harness-layout/harness.mjs` rev 1.23; `harness-layout/checks/sub.mjs` rev 1.13 |

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
  charts (C1–C6); Approval Mix folded into C3, S-Curve Variance into C1, Coverage into the Forward and Overdue page (formerly C5), Status Funnel
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
| Charts C1–C4 on Analytical (C5 removed → Forward and Overdue side-menu page; C6 deferred) | `active` | Yes | S4 | SVG (grid follows shared layout; C1 may span the content width; C6 Staffing estimator deferred — §4.10) |
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
| **Forward and Overdue page** (Look-ahead + Overdue + Coverage; was Analytical C5) | MDL planned/forecast first-issue + Log trend; MDL scope minus Log matches | Normalise dates; compute NFS set | *Look-ahead*: docs due in next 1–4 wks (first submit / resubmit / return); *Overdue*: same 3 categories past due; *Coverage*: NFS count + list | Table + list |
| **C6 Staffing Estimator** — *deferred* | Projected volume (§4.3 + Log trend); `review-hours/document` (Settings input); `productive-hours/reviewer` (Settings) | Planner inputs only — no workbook field | `volume × hrs/doc ÷ hrs/reviewer`; compare with historical throughput | Form + read-only derived FTE |
