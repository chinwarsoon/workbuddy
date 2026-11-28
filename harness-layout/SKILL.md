# SKILL: harness-layout

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.41 | 2026-11-28 | CodeBuddy (AI) | `harness.mjs` rev 1.51 — crosshair probe closure: computed `color()` alpha, computed 2px inset order, row-head scope limited to the active row, and pinned strong-tier check. Validated on MDL: 366 passed / 2 failed (Tier 1 baseline) / 2 advisory / 31 skipped. |
| 1.39 | 2026-11-28 | CodeBuddy (AI) | `harness.mjs` rev 1.50 — Tier 5 checks ArrowRight cell movement and pinned-cell tint; Tier 8 cycles `<body>` theme as well as `<html>`. Spec rev 1.116. |
| 1.38 | 2026-11-28 | CodeBuddy (AI) | `harness.mjs` rev 1.48 — header probe reads `--thead-fg` from the live theme; assertion 54 checks the delivered welcome theme picker in source. `checks/mdl.mjs` rev 1.5 uses `--thead-bg` / `--thead-fg`. Validated on MDL: harness 343 / 2 baseline. |
| 1.39 | 2026-11-28 | AWS Quick (AI) | Spec re-synced to rev 1.115 — crosshair corrected to a true 3-tier, genuinely translucent design (`--crosshair-faint`/`-medium`/`-strong`, light/dark-differentiated %); §8.2 assertion 22 rewritten; Appendix A.2 item 17 updated. Bundled copy byte-identical with the root copy (SHA256 `26EE142AB1D7F323ECAE7737E00370EC7C6CDDD56296535E1DA650417CD63B58`, 344,815 bytes). The harness's own `lintTableCrosshair()` (Tier 5) does not yet assert the new `.rowhead-hover` class, the 3-tier opacity ladder, or AA contrast — flagged, not yet extended. |
| 1.40 | 2026-11-28 | AWS Quick (AI) | `harness.mjs` rev 1.49 — `lintTableCrosshair()` extended (generic `.ds-table` scope only): 2px ring (not 1px), bold column header, `.rowhead-hover` found and bold, and the intersection background-color has alpha < 1 (catches an opaque-fill regression that passed every prior structural check). Not yet run. |
| 1.36 | 2026-11-28 | AWS Quick (AI) | Spec re-synced to rev 1.114 — six-theme chrome-family token set (--chrome-*, --thead-*, --nav-fg-active, --btn-bg/--on-fill, --link, --chart-1…6, --welcome-* guide-panel tokens); §8.2 assertion 54 (AA contrast per theme; welcome top-bar picker). Bundled copy byte-identical with the root copy (SHA256 `2E700CF87ED68FFA20286CAE9D493DF763D42CDFF4E20283100C9A07F43D4C80`, 340,382 bytes). Tier 8 theme sweep follows in a later harness revision. |
| 1.37 | 2026-11-28 | AWS Quick (AI) | `harness.mjs` rev 1.47 — new Tier 8 `lintThemes()`: config-gated by `cfg.themes` (absent config = SKIP, same pattern as Tier 7). Cycles the six themes via `data-theme`, re-measures the 10 AA pairs from assertion 54, and checks the welcome top bar exposes `.cw-theme-btn` when `cfg.welcome` is set. Not yet run. |
| 1.35 | 2026-11-27 | AWS Quick (AI) | `harness.mjs` rev 1.44 — Tier 7 follows spec §3.7 rev 1.111 (two-column card): 44 Help in the top bar, three guide-panel steps with one `aria-current`, footer inside the task panel; 45 column split 1 : 1.618 (replaces the drop-box ratio); 47 Choose primary while a file is not ready (replaces the confirm stepper and centred-help checks); 53 `checks[]` ≤ 5. Not yet run. |
| 1.34 | 2026-11-27 | AWS Quick (AI) | Spec re-synced to rev 1.111 — two-column welcome card (top bar with Help, guide panel, task panel, 1 : 1.618; fixed column row; file list below the drop box; Choose / Open primary rule); §6 welcome tokens replaced; §8.2 assertions 44, 45, 47, 52, 53 updated. Bundled copy byte-identical with the root copy (SHA256 `2764BA0E89E4D92ACF76E47662F836F29BCE22905595B0B2B92634E95E977D81`, 336,982 bytes). Tier 7 follows in harness rev 1.44. |
| 1.33 | 2026-11-27 | AWS Quick (AI) | `harness.mjs` rev 1.43 — Tier 7 follows spec §3.7 rev 1.110: 45 adds the Choose border and the fixed drop box; 47 the centred help link in `auto` mode; 48 an optional extra-file pick (`welcome.extraFile`); 49 the success hold (ready status, focused `Open now`); new 52 (card height constant through the pick, load and hold) and 53 (1–6 files, two columns for 4–6). Not yet run. No existing assertion was weakened. |
| 1.32 | 2026-11-27 | AWS Quick (AI) | Spec re-synced to rev 1.110 — fixed-height welcome (one box for the drop area and the load stage), file list at the bottom of the drop area, 1–6 files, ignored-file summary, gap tokens, success hold; §8.2 assertions 45, 47, 48, 49 updated, 52 and 53 added. Bundled copy byte-identical with the root copy (SHA256 `0E518CFE89EBBB243172DBDFDA1EBBE8DB8370DCAFBFD95C48C3CDFEF1E0DBE9`, 334,900 bytes). The Tier 7 checks follow in harness rev 1.43. |
| 1.31 | 2026-11-26 | CodeBuddy (AI) | C-03 — spec re-synced to rev 1.109: the shared welcome drop area is a named `role="group"` and is not focusable; the native `Choose file(s)` button is the keyboard path. `harness.mjs` rev 1.42 updates assertion 45. Bundled copy byte-identical with the root copy (SHA256 `E26EEAE61F5EEB0F0BF4AB3E612C68B5E05FE6725284E7E3AB78CFF906D6E279`, 329,546 bytes). No other assertion changed. |
| 1.30 | 2026-11-26 | AWS Quick (AI) | WP-WELCOME-001 W2 — `harness.mjs` rev 1.41 adds **Tier 7** `lintWelcome()` for spec §3.7 rev 1.107 (assertions 43–50) and a Tier 1 `common-version` check for §3.9 rev 1.108 (assertion 51). Both are gated by a `welcome` block in `checks/<name>.mjs`; no config carries it yet, so every dashboard gets two new SKIP lines and the PASS / FAIL baselines are unchanged. The block is added by each dashboard's own welcome phase (MDL W3, PPP W4, Sub W5). Not yet run: Node.js and Playwright are not installed on the authoring machine. No existing assertion was changed or weakened. |
| 1.29 | 2026-11-26 | AWS Quick (AI) | Spec re-synced to rev 1.108 — §3.9 shared-sources bullet (code from `common/` is inlined at build time; the delivered HTML carries `<meta name="common-version">` and no reference to `common/`); §8.2 assertion 51. Bundled copy byte-identical with the root copy (SHA256 `5965808159713D66EDB235504E062D18C64398B91DAF678E79BA97D7974629A3`, 329,118 bytes). No check changed: the version check (51) is planned in WP-WELCOME-001 W2, gated per dashboard. The existing check that the HTML does not depend on `common/universal_ui_design.*` stays valid. |
| 1.28 | 2026-11-26 | AWS Quick (AI) | Spec re-synced to rev 1.107 — §3.7 rewritten as one configuration-driven welcome page (§3.7.1–§3.7.9); five welcome tokens in §6; §8.2 assertions 43–50. Bundled copy byte-identical with the root copy (SHA256 `1BF42934EAECFB69C4A26F08F1B95F7D1B1ED9FA7A06F24AC808B3EC8E941763`, 327,909 bytes). No check changed: the welcome check for assertions 43–50 is planned in WP-WELCOME-001 phase W2 (`sub/workplan/Welcome-Page-Workplan.md`) and will be gated per dashboard. No harness run was needed, because no check or dashboard changed. |
| 1.27 | 2026-11-25 | CodeBuddy (AI) | Spec re-synced to rev 1.106 — every attached-table chart column center MUST match the matching table header center within 2 px; MDL is in scope for geometry even though rev 1.74 excludes it from two-way sync state; assertion 42 added. Bundled copy byte-identical with the root copy (SHA256 `48DE0BE7D04E5DFCD88AADB9EFE270E3407964C4F6057EEB4417423080B9ECDB`). `boardTable` Tier 5 now hovers each month header, transforms the band center with `getScreenCTM()`, and checks the center delta against `centerTolerance`. MDL config adds `centerBandSelector` and `centerTolerance:2`. MDL harness 219 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to the HEAD baseline; all eight board-contract checks pass. No existing assertion was weakened. |
| 1.26 | 2026-11-24 | CodeBuddy (AI) | Spec re-synced to rev 1.105 — every table type (bounded, keyed, semantic, chart-attached) uses `--navy` header fill with white text; the rev 1.103 light attached-table variant is superseded and assertion 40 is rewritten. Bundled copy byte-identical with the root copy (SHA256 `FBBEF9EE5FB513EB12CC5B70FDF77DF7A235B2264E394AF3891FC2AC4BD16646`). `checks/mdl.mjs` now expects `--navy` and `rgb(255, 255, 255)` in the `boardTable` tier; a stale outer-scope variable in the header assertion was corrected. MDL harness 218 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to the HEAD baseline; all seven attached-table checks pass. No existing assertion was weakened. |
| 1.25 | 2026-11-24 | CodeBuddy (AI) | Spec re-synced to rev 1.104 — Y-axis caption vertically centred near the axis, bottom-to-top, with bold `--text2` caption and tick labels; assertion 41 restates the §4 rev 1.88 / 1.91 attached-table CSV obligation. Bundled copy byte-identical with the root copy (SHA256 `10B2618DA63ABC43F4B763E657F6B88731DA176895B14F0E6E9C261B2F0E5945`). The `boardTable` Tier 5 tier now also checks that the attached table offers a visible `⤓ CSV` before image actions. MDL harness 218 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to the HEAD baseline. No check weakened. |
| 1.24 | 2026-11-24 | CodeBuddy (AI) | Spec re-synced to rev 1.103 — `--c1-plot-table-gap:10px`, board fit with `min-width:0` and vertical headers for >13 columns, and themed attached-table header fill are general requirements (assertions 39 / 40). Bundled copy byte-identical with the root copy (SHA256 `8EF6A9CE7BE04E74F657437F6FD59436769A38497C69B4FE21B42D326A27926F`). Added a config-gated general `boardTable` Tier 5 tier (`harness.mjs` + `checks/mdl.mjs`) that checks the gap, board fit, rotation, themed fill and rounded non-shared corners independently of `cfg.c1`; six new checks pass on MDL. MDL harness 217 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to the HEAD baseline. No existing assertion was weakened; the old square-corner check was updated for the new separated-zone rule. |
| 1.23 | 2026-11-24 | CodeBuddy (AI) | Spec re-synced to rev 1.102 — the two-row chart head (right-aligned tool row above, full-width time bar row below, 10 px / 2 px gaps), chip-before-text order and no-explanatory-caption rule are GENERAL requirements for every dashboard; Sub's one-row composition is superseded and no deviation stands. The bundled `spec/Dashboard-UI-Design-Spec.md` is byte-identical with the root copy (SHA256 `4F924B04BEC922B190D90CEF1EB12027C840526054C42B0502BE07ACF82008E5`). MDL harness re-run after `I-146`: 211 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to the HEAD-build baseline. No check changed; no existing assertion was weakened. |
| 1.22 | 2026-11-23 | CodeBuddy (AI) | Spec re-synced to rev 1.101 — the Sub dashboard is the normative reference implementation; the C1 time bar geometry is pinned in §4.2 and the segmented standard in §7.5 B2.1. The bundled `spec/Dashboard-UI-Design-Spec.md` is byte-identical with the root copy (SHA256 `85F43B63AE83CF504EDCA6E40EEB45D197CE7099E6B7F42B4CCC4FDFB59EFF16`). MDL harness re-run after MDL `I-144` (time bar aligned with the Sub reference): 211 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to the HEAD-build baseline. No check changed; no existing assertion was weakened. |
| 1.21 | 2026-11-23 | CodeBuddy (AI) | `I006`: `lintTableCrosshair()` now treats a config-gated `chartLinkedClass` as the C1 chart-linked family in the hover probe. `checks/mdl.mjs` declares `chartLinkedClass: 'curve-c1-table'` for MDL's Issue Progress C1 attached table, which MDL I-142 migrated onto the shared binder (spec §7.2.16: chart-linked tables keep `.col-active` and add NO competing `.col-hover`). The inventory C1 cell-count check stays scoped to `.c1-table` because MDL's table keeps gutter / row-label / spacer cells without `data-c1col`. Verified: MDL harness 211 passed / 10 failed / 2 advisory / 22 skipped, with the failure set identical to the HEAD-build baseline (201 passed / 10 failed before the MDL panel fix; the panel fix itself turned 9 previously failing checks into passes). No existing assertion was weakened. |
| 1.20 | 2026-11-14 | CodeBuddy (AI) | `I133` / UI spec rev 1.76 harness alignment is live. The bundled `spec/Dashboard-UI-Design-Spec.md` is re-synced to rev 1.76, byte-identical with the root copy (SHA256 `75F6122DBBCCC161C80EF56583960FC3C0B4B0C9A02AFFF46E464677EB115C73`). `harness.mjs` rev 1.32 moves `lintC3NativeTable()` and `lintC3ColumnSync()` to the new `Breakdown` page (C3 left Overview), and `checks/sub.mjs` rev 1.21 adds `Breakdown` between `Overview` and `Submittals` in `buttonHeights.pages` and `c1.tableCrosshair.pages`. The new page holds three independent C3 panels (`Submissions`, `Approval Status`, `Breakdown Summary`); per-panel isolation is covered by the sub render tests. The stale `lintC3()` `.c3-board` selector stays unchanged as the known separate defect. No existing assertion was weakened. |
| 1.19 | 2026-11-14 | CodeBuddy (AI) | UI spec rev 1.75 harness coverage is now live. The bundled `spec/Dashboard-UI-Design-Spec.md` is re-synced to rev 1.75, byte-identical with the root copy. `harness.mjs` rev 1.31 extends Tier 5 `lintC3ColumnSync()` and `checks/sub.mjs` rev 1.20 adds `c3.columnSync.gridSelector` / `bandSelector` / `centreLineSelector`. The new checks measure ONE hidden `.c3-col-band` and ONE hidden `.c3-col-snap` per C3 Bar card, DOM paint order behind / above the bars, hidden-until-hover, ONE shared active `grid-column-start` track, measured band alignment and centre position within 2 px, no computed border / outline / inset ring on the active bar, table-side movement and hide-on-leave. Tier 5 measured **175 passed / 0 failed / 0 advisory / 2 skipped**. C1 checks and the stale `lintC3()` `.c3-board` selector stay unchanged. No existing assertion was weakened. |
| 1.18 | 2026-11-14 | CodeBuddy (AI) | `I131` / UI spec rev 1.74 harness coverage is now live. `harness.mjs` rev 1.30 adds config-gated Tier 5 `lintC3ColumnSync()` and `checks/sub.mjs` rev 1.19 adds `c3.columnSync`. The check measures bar → table, table → bar, ONE shared `.col-active` id per `.c3-card`, card independence, floating-window gating, no competing `.col-hover` and clear-on-leave. `lintC3NativeTable()` now measures `.col-active` instead of `.col-hover` on C3 tables, and `lintTableCrosshair()` treats C3 as chart-linked. The bundled `spec/Dashboard-UI-Design-Spec.md` is re-synced to rev 1.74, byte-identical with the root copy. C1 checks and the stale `lintC3()` `.c3-board` selector stay unchanged. No existing assertion was weakened. |
| 1.17 | 2026-11-13 | CodeBuddy (AI) | `I130` C3 native-table harness coverage is now live. `harness.mjs` rev 1.29 adds config-gated Tier 5 `lintC3NativeTable()` and `checks/sub.mjs` rev 1.18 adds `c3.nativeTable`. The check verifies two Bar cards, one native `table.c3-table[data-table-crosshair]` per card, caption, colgroup, thead, tbody, scope, shared `data-col-id`, `role="group"`, bar / header column-centre alignment within 2 px and the §7.2.16 crosshair. `lintTableCrosshair()` recognises `.c3-table` as an explicit scope. The stale `lintC3()` `.c3-board` selector is a separate defect and stays unchanged. No existing assertion was weakened. |
| 1.16 | 2026-11-13 | CodeBuddy (AI) | `I129` harness coverage is now live. `harness.mjs` rev 1.28 adds config-gated Tier 5 `lintTableCrosshair()` and `checks/sub.mjs` rev 1.17 adds `c1.tableCrosshair`. The check visits five pages, validates every visible `table[data-table-crosshair]` and its stable `data-col-id` cells, pairs split headers / bodies, hovers a data cell and measures `.row-hover`, `.col-hover`, `.cell-hover`, C1 `.col-active` preservation, column rules, `position:relative` / sticky pinned cells, the intersection ring and clear-on-leave. Analytical is skipped because it has no table; C3 remains the existing data-dependent skip. Tier 5 measured **143 passed / 0 failed / 0 advisory / 2 skipped**. No existing assertion was weakened. |
| 1.15 | 2026-11-13 | CodeBuddy (AI) | Re-synced the bundled UI spec to **rev 1.72** (`I129`). The root and `harness-layout/spec/Dashboard-UI-Design-Spec.md` copies are byte-identical at 223,908 bytes, SHA256 `1393FA6A4DE40067BA1732664451F43E8916276BF7FA740747BDE2F0903FF3C6`. New normative **§7.2.16 Table Hover Crosshair Standard** and **§8.2 assertion 22** define one global `.ds-table` row / column / intersection hover contract, rendered-position column pairing, C1 `.col-active` preservation, column-rule / `position:relative` compatibility and PNG / Copy / print suppression. No `harness.mjs`, `checks/sub.mjs` or assertion change is made: `I129` is `APPROVED`, implementation and harness coverage are pending. |
| 1.14 | 2026-11-12 | CodeBuddy (AI) | Re-synced the cross-references to UI spec **rev 1.71** (issue `I128`). `harness.mjs` rev 1.27 adds `lintButtonHeights()`, a config-gated Tier 5 check driven by `checks/sub.mjs` rev 1.16 `c1.buttonHeights`. It visits Overview, Submittals, Validation, Forward and Overdue and Analytical, dedupes overlapping selectors by node, and asserts every visible text-bearing button at the shared **32 px** height and every visible icon-only button at **26 px square**. The retired `seg-compact` variant is removed from the segmented-control config and the segmented pass now requires every `.seg` group at the ONE standard height. No existing assertion was weakened. |
| 1.13 | 2026-11-12 | CodeBuddy (AI) | Re-synced the C1 cross-references to UI spec **rev 1.70** (issue `I127`). `harness.mjs` rev 1.26 measures the universal bordered chart composition in Tier 5: the `.c1-grid` is borderless; `.c1-yaxis`, `.c1-plot` and `.c1-table` each render a `1px solid` border with one shared colour; the Y-axis / plot / table shared edges touch; the outer corners stay 10 px while shared corners are square (`10px 0 0 0`, `0 10px 0 0`, `0 0 10px 10px`); and the table renders `border-collapse:separate` with zero spacing. Four checks are added, all config-gated through the existing `c1` block. No `checks/sub.mjs` change was needed, and the rev 1.67 / 1.69 segmented-control, one-row, Y-axis, export and interaction checks are unchanged. |
| 1.12 | 2026-11-11 | CodeBuddy (AI) | Re-synced the cross-references to UI spec **rev 1.69**, which makes **§7.5 B2.1 the authoritative segmented-control standard** (issue `I125`, `I123` resolved). The common standard owns ONE set of `--seg-*` CSS custom properties, two variants (`standard` 32 px / 12 px and the C1 `seg-compact` exception at ≈ 26 px / 11 px / `5px 8px`), six states (default, active, hover, focus-visible, pressed, disabled), `--navy` active fill, `--surface2` inactive hover, `--surface3` pressed, a white focus ring on active buttons, and common markup (`type="button"`, dynamic `aria-pressed`, `role="group"`, accessible name) for ALL seven Sub generators. `checks/sub.mjs` rev 1.15 adds the config-gated `c1.segmented` block; `harness.mjs` rev 1.25 reads shared tokens from the live stylesheet and adds `lintSegmentedControls()`, which visits Overview, Forward and Overdue and Analytical to assert markup, ARIA, heights and the active fill on every group, then restores Overview. The rev 1.67 single-select, one-row, windowed Y-axis, export and interaction checks are unchanged. A precedence rule records approved panel overrides; MDL / PPP deviations are recorded, NOT changed. No 44 × 44 px touch rule is added. A measured regression showed that the shared `line-height:1.2` shrank the compact chips to 23.19 px; a dedicated `--seg-compact-lh:1.45` token restores the approved ≈ 25.94 px, and `c1.segmented` now checks both 25 px and 27 px bounds. Both spec copies remain byte-identical; historical rows 1.60–1.68 are preserved verbatim. |
| 1.11 | 2026-11-09 | CodeBuddy (AI) | Re-synced the C1 cross-references to UI spec **rev 1.68** (issue `I124`). All Sub `.seg-btn` buttons now share ONE base hover rule `.seg-btn:not(.active):hover{background:var(--surface2);color:var(--blue)}` and ONE base focus rule `.seg-btn:focus-visible{outline:2px solid var(--blue);outline-offset:-2px}`; the scoped `.c1-ts-chips .seg-btn:focus-visible` rule is removed. `.c1-ts-chips .seg-btn{padding:5px 8px;font-size:11px}` stays as an EXPLICIT layout-ONLY exception for the 1280 px one-row cluster and carries no hover or focus rule. `checks/sub.mjs` rev 1.14 adds `grainSelector`; `harness.mjs` rev 1.24 reads the shared base hover / focus rules from the live stylesheets, measures the grain group's `type="button"` and dynamic `aria-pressed`, and compares computed colour and focus tokens with the preset group. The rev 1.67 single-select, one-row, windowed Y-axis and export checks are unchanged. Owner decision: soft `--surface2` hover, NOT §7.5 B2's literal `--blue` hover; `I123` (`.on` / `--navy` versus `.active` / `--blue`) stays `DEFERRED_STUDY`, so this revision does NOT claim literal B2 compliance. Both spec copies byte-identical; historical rows 1.60, 1.28, 1.64, 1.65, 1.66 and 1.67 preserved. |
| 1.10 | 2026-11-07 | CodeBuddy (AI) | Re-synced the C1 cross-references to UI spec **rev 1.67** (issue `I122`). The five preset chips are now ONE joined `.seg` group of `.seg-btn` buttons with a STORED single selection in `state.c1Preset` (`All` at load, `null` after a manual handle `input` / `change`). `lintC1TimeBar()` rev 1.23 asserts exactly one `aria-pressed="true"` at a time, no active chip after a manual handle change, the `.seg` markup, and ONE visual control row at the 1280 px minimum desktop width (`flex-wrap:nowrap` on `.c1-ts`, wrap only below 1280 px per §3.4.1). `checks/sub.mjs` rev 1.13 carries `oneRowWidth: 1280` and the segmented selectors. The B2 token gap (`.on` / `--navy` in §7.5 B2 versus the Sub `.active` / `--blue`) is a separate deferred item, `I123`. `state.c1Period`, the windowed `pts`, the rev 1.65 shared Y axis and all export paths are unchanged. Both spec copies byte-identical; historical rows 1.60, 1.28, 1.64, 1.65 and 1.66 preserved. |
| 1.9 | 2026-11-07 | CodeBuddy (AI) | Re-synced the C1 cross-references to UI spec **rev 1.66** (issue `I121`). The C1 period control is now ONE dual-handle track: two overlaid native `step="1"` range inputs on one shared track, one tick per active reporting month, and the `6M` / `12M` / `24M` / `YTD` / `All` preset chips. `checks/sub.mjs` rev 1.12 carries the time-bar selectors, `expectedPresets` and `periodStep: 1`. `harness.mjs` rev 1.22 adds `lintC1TimeBar()`: one track, two handles, whole-month snapping, tick count vs `<thead>` columns, one-month keyboard step, preset ranges and `aria-pressed`, `aria-valuetext`, live-drag decoupling and print-hidden CSS. The former From / To inputs are gone; `data-c1period`, `state.c1Period`, the windowed `pts`, the rev 1.65 shared Y axis and all export paths are unchanged. Both spec copies byte-identical; historical rows 1.60, 1.28, 1.64 and 1.65 preserved. |
| 1.8 | 2026-11-07 | CodeBuddy (AI) | Re-synced the C1 cross-references to UI spec **rev 1.65** (issue `I119`). The shared Y-axis maximum is now computed **over the selected period window** from the windowed `data-points` payload, filtered by enabled series and the Bars toggle, and recomputed on every repaint; cumulative values stay absolute. `harness.mjs` rev 1.21 shares the four rev 1.64 tick assertions through `assertC1Axis()` and re-runs them after a period change. `c1PickAxisProbe()` derives the probe window from the data (bounds, grain, peak drop and expected-axis change all checked) and **skips** instead of failing when no meaningful shorter window exists. `checks/sub.mjs` rev 1.11 adds `axisWindowProbeFraction: 0.33`, `axisPeakDropRatio: 0.9`, `minAxisProbePoints: 3`, `axisPeakTolerance: 1` and `axisMinFill: 0.75` as **harness quality criteria only**, not UI requirements. New checks: axis recomputed from the window, absolute cumulative values unchanged across the period change, and chart / grid / labels / hover-refit metadata / PNG-Copy share one scale. Separate bar scaling remains an outstanding documented requirement, recorded as `I120` (`DEFERRED_STUDY`). Both spec copies byte-identical; historical rows 1.60, 1.28 and 1.64 preserved. |
| 1.7 | 2026-11-07 | CodeBuddy (AI) | Re-synced the C1 cross-references to UI spec **rev 1.64** (issue `I118`). The fixed-five-tick count of rev 1.60 is superseded by the **C1 dynamic Y tick standard**: at most 7 intervals / 8 labels over the 300-unit plot, at least ~40 px between major ticks, steps from `{1, 2, 2.5, 5} × 10^k` (step >= 1), and every tick consumer driven by the one `data-c1meta.yMax` / `yStep` / `yIntervals` payload. `harness.mjs` rev 1.20 and `checks/sub.mjs` rev 1.10 assert metadata/label/grid agreement instead of `yTicks === 5`. Both spec copies were re-synced byte-identical from the root copy (the bundle had drifted by four clauses); historical rev 1.60 and 1.28 rows are preserved. Owner decision 2026-11-07. |
| 1.6 | 2026-11-06 | CodeBuddy (AI) | **I-96 check corrected — supersedes the "not fixed" note in 1.5.** Root cause was a harness fault: Sub I-112 replaced windowing with pagination on large tables, but the probe used `#vCnt` (16,393 rows) as its trigger and fell back to a header fragment with no `<tbody>`. `harness.mjs` rev 1.19 now requires a real windowed table with `tr.win-pad` rows and skips with an explicit reason when none exists. The 4 assertions are unchanged. **Verified:** Sub full harness **2082 passed / 0 failed / 0 advisory / 29 skipped**; MDL Tier 4 I-96 4/4 PASS (5 pre-existing I-95 failures); PPP Tier 4 78/0/0/45. |
| 1.5 | 2026-11-06 | CodeBuddy (AI) | Re-synced the C1 cross-references to UI spec **rev 1.63**: the reviewed Option B attached-table interaction is now in the production build. Tier 5 gained the config-gated `lintC1Interaction` (four tokenised gradients and `.sc-area` fills, one hidden `.sc-hover-band` at `W / N`, `data-c1col` coverage, two-way chart / table column sync, chart-only `.chart-tip`, cleared state on pointer-leave). Tier 6 gained the config-gated §4.6 hidden-window ARIA assertions: a hidden window is `aria-hidden` and empty of text. C2, C3, C4 and MDL stay unchanged. Verified: Tier 5 **44 passed / 0 failed / 0 advisory / 1 skipped**; full harness **2083 passed / 3 failed / 0 advisory / 28 skipped** (3 I-96 windowing failures recorded in `sub/log/test_log.md` 1.25, not fixed). |
| 1.4 | 2026-11-06 | CodeBuddy (AI) | Re-synced the C1 cross-references to UI spec **rev 1.62**: the conditional Legend Placement & Table Attachment Rule puts the in-SVG legend ABOVE the plot for `.c1-grid` attached-table panels so the plot bottom touches the table `<thead>`. Tier 5 now asserts `legendAbovePlot` and measures `headTopDelta` against the last grid line (the plot X axis) instead of the SVG box bottom; the expectation is config-driven via `c1.legendAbovePlot`. Owner decision 1 of 2026-11-06 is formally superseded for attached-table panels; C2, C3, C4, MDL and PNG/Copy export fidelity are out of scope. |
| 1.3 | 2026-11-06 | CodeBuddy (AI) | Re-synced the §4.2 cross-references to UI spec **rev 1.60**: the Y axis contract, the Fallback / reflow / no-scroll fitting model and the extended §8.2 assertion 21 are now normative in both byte-identical spec copies. Corrected the stale "clause still to be added" note and updated the Tier 5 row. Verified by Tier 5 **34 passed / 0 failed / 1 skipped** with `scale:1, inset:0`. |
| 1.2 | 2026-11-06 | CodeBuddy (AI) | Added the Tier 5 C1 attached-table geometry checks and mapped them to §4.2 rev 1.59 / §8.2 assertion 21. Owner decisions 2026-11-06: legend stays in-SVG at the bottom, the as-of subtitle is omitted, and the curve fits the card with no horizontal scroll. |
| 1.1 | 2026-10-24 | Codex | Updated shell checks and project-local asset rules. |

**Location**: `harness-layout/` (this folder; self-contained — copy it to any project)
**Purpose**: Universal, **spec-driven** layout evaluation harness — reusable for any future project.
**Spec reference**: the design spec is resolved at run time via `--spec`, defaulting to the bundled `spec/Dashboard-UI-Design-Spec.md` copy. Generic shell checks follow Dashboard UI Design Spec §3.1. Dashboard-specific data and pipeline checks belong in each dashboard check module or project test suite.

---

## What this harness does

It runs three tiers of automated checks against a compiled dashboard HTML file:

| Tier | Name | Needs browser? | Needs workbook? | What it checks |
|------|------|---------------|----------------|----------------|
| 1 | Universal structure | No | No | Project-local assets, stable shell markers, semantic tokens, viewport behavior, action semantics |
| 2 | Browser shell | Yes (Playwright) | No | Shell zone presence and geometry, content-zone order, warning-area bounds, sidebar controls |
| 3 | Data + filter | Yes (Playwright) | Yes (.xlsx) | Pipeline ground-truth KPIs vs rendered DOM values; filter round-trip; W-FORMULA banner |
| 4 | Layout geometry | Yes (Playwright) | Yes (.xlsx) | **Rendered** table metrics: row height, header height, `table-layout:fixed`, `<colgroup>` vs rendered columns, cell truncation, one row metric across all tables (I-90); plus the I-89 executable sample |
| 4b | L3 capabilities | Yes (Playwright) | Yes (.xlsx) | Pinned columns, column chooser, column resize (I-95) and windowing invariants (I-96), driven through the UI |
| 4c | Table chrome | Yes (Playwright) | Best-effort | **Compulsory**: table-title colour consistency and sticky table headers |
| 5 | C1 S-curve geometry | Yes (Playwright) | Yes (.xlsx) | C1 structure, Bars toggle and series popup; **rendered** alignment of bars, dots and `data-points.cx` against native-table month columns (repeated after the dual-handle period track moves), grid tracks vs `<colgroup>`, in-SVG legend above the plot, vertical Y-axis line, rotated Y caption, header adjacency against the plot X axis, no separate SVG X labels and no horizontal scroll, plus 10 attached-table interaction checks (§4.2 rev 1.63 / §8.2 assertion 21) |
| 6 | §4.6 hover window | Yes (Playwright) | Best-effort | General side-bar loop: every `[data-page]` visited; every `[aria-describedby]`→`role="tooltip"` host checked (C1–C4, KPI on any page); in-page switches (`.seg`, tabs, toggles) clicked and re-scanned; cursor affordance, `.chart-snap`, reveal/hide, and C2 `.ct-l` grouping guarded; a hidden window is `aria-hidden` and empty of text (§4.6 rev 1.63) |

---

## File structure

```
harness-layout/
├── harness.mjs          ← main runner (all tiers; auto-discovers dashboards from checks/)
├── package.json         ← Playwright only
├── SKILL.md             ← this file
├── spec/                ← bundled design-spec copy (self-contained default; override with --spec)
└── checks/
    ├── mdl.mjs          ← MDL dashboard config (Tier 3 fully supported)
    ├── ppp.mjs          ← PPP dashboard config (Tier 3 limited — I-76)
    └── <name>.mjs       ← add your own to support a new project
```

---

## How to run

```bash
cd harness-layout
npm install
npx playwright install chromium   # first time only

# All dashboards, all tiers (Tier 3 uses defaultWorkbook from each config)
node harness.mjs

# Single dashboard
node harness.mjs --dashboard mdl

# Single tier
node harness.mjs --dashboard mdl --tier 1

# Tier 3 with explicit workbook path
node harness.mjs --dashboard mdl --tier 3 --workbook "../MDL/TWRP C3B2 - Master Document List.xlsx"
```

Exit code 0 = all checks passed. Exit code 1 = one or more failures. Tier 1 runs without Chromium. Browser tiers fail when Chromium cannot launch.

---

## Tier 1 checks (universal structure — `runTier1`)

- Viewport metadata and root shell markers are present.
- Dashboard does not load `common/universal_ui_design.css` or `.js`.
- Content markers exist.
- External assets use local/root-relative paths. A project-local UI stylesheet and script must be linked. Actions do not use `div` or `td` as buttons.
- Pipeline checks run only when a dashboard config provides `srcDir`.

## Tier 2 checks (shell geometry — `runTier2`)

Checks the shell before data load. The six `data-shell` zones must exist and be visible. It checks the
36 px title bar, 48 px icon bar, full-width 22 px status bar, 260 px initial left sidebar, side-by-side sidebar/content order, a
positive flexible content width, full-viewport locked scrolling, ordered content zones, warning bounds,
and both sidebar toggle and resize controls. It does not require a separate onboarding page or hide the shell before load.

## Tier 3 checks (data + filter — `runTier3`)

**Requires**: `pipelinePath` set in the dashboard config (MDL only until I-76 resolved).

### Ground-truth computation (Node, no browser)
Imports `xlsx-reader.mjs`, `pipeline.mjs`, `render.mjs` directly.
Runs `readXlsx → buildModel → deriveView` with the default filter state (all disciplines,
all non-excluded stages). Captures `view.kpis` as ground truth.

### Browser-side verification
Injects the workbook bytes into the page via `window._loadFile(file)` (if exposed) or
a synthetic `DragEvent` on `.drop`. Waits for `.status-bar:not([hidden])` to confirm render.

**KPI comparisons** (selectors from `cfg.kpiSelectors`):
- `totalPlanned`: DOM value must equal `gt.totalPlanned`.
- `submitted`: DOM value must equal `gt.submitted` (if selector configured).
- `overdueFirst`: DOM value must equal `gt.overdueFirst` (if selector configured).

**Filter round-trip**:
1. Clicks the filter trigger (`.tf-btn`).
2. Deselects all, then selects only the first discipline.
3. Closes the panel (Escape).
4. Reads the `totalPlanned` KPI again.
5. Asserts it equals `deriveView(model, { disciplines: new Set([firstDisc]), … }).kpis.totalPlanned`.

**Validation issue count** (if `validationCountSelector` configured):
DOM count must equal `view.issues.length`.

**W-FORMULA banner** (if model has formula-error warnings):
- `#errBanner` must be visible.
- Number of `.sys-banner-item.fatal` strips must be ≥ number of W-FORMULA warnings.

**Status bar content**: must contain the string representation of `gt.totalPlanned`.

---

## Tier 4 checks (layout geometry — `runTier4`)

**Requires**: Playwright. The live pass also needs `pipelinePath` and a workbook; the sample pass needs
`samplePath`.

Tier 4 measures what a string search cannot: the geometry the browser actually renders.

1. **I-89 sample** — opens `cfg.samplePath` (static, no data needed) and measures every visible
   `table.ds-table`. Findings here are **advisory (WARN)**: the sample is an archived review artefact that
   predates the I-90 rollout, so it is reported but never fails the run.
2. **I-90 live** — loads the real workbook into `cfg.htmlPath`, then measures every visible table **strictly**.

Per table:
- `table-layout` computes to `fixed` (I-90 RC-1).
- `<colgroup>` column count equals the rendered column count. A fragment table pairs a `thead`-only table with a
  body-only table, so either count satisfies the check; the non-applicable assertions are skipped.
- Header row height equals `expectedHeadH` (default 40 px).
- Data-row heights are uniform (spread ≤ `tolerance`) **and** each equals `expectedRowH` (default 40 px).
  Rows measuring 0 px are collapsed/not rendered — excluded and reported as `n collapsed`.
- Body cells truncate (`text-overflow: ellipsis` or `overflow: hidden`).

Across all tables: **one** row metric (max − min ≤ `tolerance`) — this is the core I-90 requirement.

Windowed tables (I-96) carry two `tr.win-pad` spacer rows whose whole job is to hold the scroll height.
They are reported as `padRows` and are **never** measured as data rows; the harness asserts there are
exactly two and that each height is an exact multiple of the row height.

### Tier 4b — L3 capabilities (`lintL3`)

Driven through the real UI in Chromium with the workbook loaded. Because the fixed status bar and the
error banner overlay the panel headers, interactions are dispatched **in-page** (`element.click()` and
synthetic `PointerEvent`s) rather than through Playwright's mouse.

1. **Pinned columns (I-95 / D38)** — the first two columns of every grid-wired table compute to
   `position: sticky`, carry an opaque background, and sit at `left: 0` / `left: <first column width>`.
2. **Column chooser (I-95)** — opens, offers one selectable checkbox per non-pinned column, and hiding
   one column shrinks the `<colgroup>`, the header and the body cells **together**; the choice is written
   to `localStorage` (`mdl_<key>_cols`). Done for both `detail` and `issue`.
3. **Column resize (I-95)** — a synthetic pointer drag on a `.ds-resize` grip widens the column by the
   dragged distance and the new width is persisted (`mdl_<key>_widths`).
4. **Windowing (I-96)** — the windowed table draws far fewer rows than it has, keeps exactly two spacer
   rows, its scroll height is a multiple of the full list, and the control row still reports the **full**
   count (§4.3 contract).

## Tier 4c checks (table chrome — `lintTableChrome`, **compulsory**)

These two rules are **blocking**: any violation fails the run (never WARN, never SKIP when there is
something to check). They run whenever a page is loaded; without a pipeline module the workbook is still
handed over by file drop so the panels render and the rules are enforced.

1. **Table title colour consistency** — every visible title matching `chrome.titleSelector` must resolve
   to the *same* computed colour, that colour must be opaque, and all titles must share one font size and
   weight. Distinct colours are reported side by side (e.g. `rgb(15, 45, 82) | rgb(255, 0, 0)`).
2. **Sticky table headers** — for every rendered `table.ds-table` with a header:
   - **every** header row computes to `position: sticky`;
   - **single-row** headers anchor at `top: 0`; **grouped (multi-row)** headers *stack* — row 0 at `top: 0`,
     row *n* at `top: (sum of the heights of the rows above it)`, so the bands stay visible together with no
     overlap and no gap. A `top: 0` on a second band is a **failure** (it would pile on the band above);
   - the background is opaque (rows must not show through);
   - **scroll proof**: scrolling the container by `scrollProbe` px must leave **every** header row where
     sticky pinned it (moved ≤ `tolerance`, stacking order preserved). Computed style alone is not accepted.
3. **Header-band colour consistency** — within one header row every **non-pinned** cell resolves to the
   *same* background; the group band and the leaf band must use the *same palette*. A per-column emphasis
   (e.g. the selected-month tint) is allowed only if it runs the full column height, not if it splits a band.
   Pinned identity columns intentionally carry an opaque white background and are exempt from this rule.
4. **Scrollbar gutter** — a **grouped** header that lives inside a scroll container must use the split-header
   pattern (`.vheadtab` + `--ds-sbw` gutter, header rendered *outside* the scroller) so the vertical scrollbar
   sits **under** the header, not beside it. Single-row headers are exempt (the I-90 sticky rule covers them).
5. **Layout rules (gated by `chrome.layout`)** — when the dashboard's spec owns column/alignment rules (MDL
   sets `layout: true`), these run in addition:
   - **Header vertical alignment** is `middle` (not `top`); a wrapped header label stays centred.
   - **Header/body alignment match** — the header of a column uses the *same* `text-align` as its body cells
     (a right-aligned numeric column must not have a left-aligned header).
   - **Sort affordance at the trailing edge** — every sortable header's indicator (▲/▼/⇅) sits at the header's
     right edge (`margin-left:auto`), not mid-cell beside the label.
   - **Column minimum** — every column width ≥ `chrome.colMinWidth` (default 60 px); per-type minima are a spec
     concern beyond the hard floor.
   - **Truncation** — non-pinned body cells carry `overflow:hidden; text-overflow:ellipsis` (the table does not
     let long content grow the row height).
   - **Fit policy** — when the column-sum fits the display area the table fills it (proportional to declared
     widths); when it exceeds it a horizontal scrollbar is present and no column is clipped.

**Declared exception — header fragments.** A thead-only table (MDL's `.vheadtab`) has no scroller of its
own; it is aligned in lock-step with the body table beside it, so `sticky` is meaningless there. The
exception is *verified*, not assumed: a non-sticky header is accepted only when it matches
`chrome.headerFragmentSelector`, has no `.tableScroll` parent **and** has a paired scrolling body table.
Anything else is a failure. (The fragment is also excluded from the layout rules, since its gutter column is
intentionally narrower than `colMinWidth`.)

6. **Split-header pairing (gated by `chrome.splitHeader`)** — when a dashboard uses `.vheadtab` fragments
   (MDL sets `splitHeader: true`), the exemption above is paid for with these invariants, one per defect
   that shipped in MDL I-103:
   - **Gap** — the fragment's bottom is flush with the scroller's top (≤ 1 px).
   - **One container** — the wrapper has a border radius while the inner scroller has none, no border and
     no top margin.
   - **Column rule in place** — the fragment's cell is a **containing block** (`position` ≠ `static`) *and*
     the `::after` resolves to a 1 px absolutely-positioned rule. Checking only the pseudo-element can
     never fail: it keeps its own `position:absolute` even when the cell goes static.
   - **Header/data alignment** — each header cell's `text-align` equals that of its data column, paired by
     **rendered left edge**, not by index (a grouped header's `rowspan` offsets child indices).
   - **Column boundaries** — header and body columns coincide (≤ 2 px). The trailing `.ds-gut` spacer is
     excluded: it is not a column and has no body counterpart.
   - **Width equality** — fragment width == scroller width == body width.
   - **Fit** — no horizontal overflow; **lock-step** — if the body scrolls sideways, the header moves with
     it (skipped as N/A when the body does not scroll).

---

## Tier 7 checks (§3.7 welcome page — `lintWelcome`)

Runs only when the dashboard config provides a `welcome` block
(`{ mode, files, forbiddenText, loadCheck, pin }`); dashboards without one are skipped. It opens the
dashboard with no workbook and checks the pre-load welcome rendered by `common/welcome` (`.cw-*`):

1. **43** — one `.cw-slot` per configured file; no `forbiddenText` on the welcome.
2. **44** — one `.cw-title` and one `.cw-instr`; no `What this does` lead-in; `.cw-foot` outside the card with the current year; `.cw-help` present.
3. **45** — native `button.cw-choose` inside `.cw-drop`; drop area `role="group"` and `aria-label`, with no `tabindex`; drop ratio 1.618 ± 2 %; card `aspect-ratio` is `auto`.
4. **46** — `.cw-screen` `position:fixed` and `overflow-y:auto`; no page scroll; a synthetic `dragenter` on `body` shows `.cw-overlay.is-on`.
5. **47** — `auto`: no `.cw-load`; `confirm`: one disabled `.cw-load` reading `(0 of N)` and one `.cw-stepper`; at most one `.btn-primary`.
6. **48** — `.cw-alert[role="alert"]` and `.cw-slots[aria-live="polite"]`.
7. **49** — a `prefers-reduced-motion` rule; with `loadCheck`, `.cw-phases[aria-busy="true"]` appears during load and every non-help button is disabled.
8. **50** — the inlined `common/welcome/welcome.css` block holds no hex / rgb / hsl literal and no `min-height`; a `_loadFile` hook does not classify by file name.

8b. **48 (rev 1.110)** — with `welcome.extraFile` (a non-required `.xlsx`), picking it changes no slot (auto: the one slot may show rejected) and the card height does not change.
9. **52** — the card height is the same (±1 px) on the empty welcome, after a failed pick, and through the load phases and the success hold.
10. **53** — the configured file count is 1–6, and `.cw-slots.is-cols` is used exactly for 4–6 files. 45 also checks the Choose border and `overflow:hidden` on the drop box; 47 the centred help link in `auto` mode; 49 the `role="status"` ready message and a focused, enabled `Open now`.

Tier 1 adds **51** under the same gate: `<meta name="common-version">` exists and equals `common/manifest.json` `version` (or `pin`), and the HTML holds no `href` / `src` / `import` / `fetch` to `common/`.

---

## Tier 6 checks (§4.6 hover window — `lintHoverWindow`)

Runs only when the dashboard config provides a `hover` block; dashboards without one are skipped. It
loads the workbook, then runs a **general side-bar exploration** (`discoverPages` / `visitPage`):

1. It finds every side-bar menu item (`[data-page]`) and visits each one — Overview, Submittals,
   Validation, Forward and Overdue, Analytical, Help, Settings — so no page is skipped because of the
   default landing page.
2. On each page it discovers **every** hover-window host by scanning `[aria-describedby]` whose
   referenced tip carries `role="tooltip"`. This finds C1 (`.scurve`), C2 (`.c2-stack`), C3
   (`.c3-card`), C4 (`.c4-chart`) and KPI (`.kpi-card`) on every page — not just a hard-coded list.
3. It also clicks **in-page button switches** (`.seg button`, `[role="tab"]`, `button[aria-pressed]`,
   `[data-view]` — action buttons such as export/print are skipped) and re-scans, so views revealed
   only by a switch (for example the C3 dimension selector) are explored too.

For each host it asserts, via synthetic `pointermove` / `pointerdown` / `pointerleave` events:

1. The host carries `aria-describedby` and the referenced element exists with `role="tooltip"`.
2. The host is focusable (`tabindex`).
3. A cursor affordance is present (charts: `crosshair`; KPI cards: `help`).
4. Nearest charts (C1, C2) expose a `.chart-snap` line inside their SVG.
5. A hover (or tap) reveals the window (`class="show"`) and the window is non-empty.
6. The window hides on `pointerleave`.
7. Where the host is inside `.c2-stack`, the revealed window contains the `.ct-l` swatch+label group
   — the direct regression guard for sub issue I092.

The same `discoverPages` / `visitPage` utilities are reusable by other tiers (charts, tables) when they
need to explore every page and in-page switch rather than a single hard-coded view.
Run: `node harness.mjs --dashboard sub --tier 6`.

---

## Dashboard config schema (`checks/*.mjs`)

```js
export default {
  // Required
  htmlPath: '/absolute/path/to/Dashboard.html',

  // Tier 1 — set to null if not modularised (PPP I-76)
  srcDir:          '/absolute/path/to/src',
  xlsxReaderPath:  '/absolute/path/to/src/xlsx-reader.mjs',
  pipelinePath:    '/absolute/path/to/src/pipeline.mjs',
  renderPath:      '/absolute/path/to/src/render.mjs',

  // Tier 3 — default workbook (overridden by --workbook CLI arg)
  defaultWorkbook: '/absolute/path/to/workbook.xlsx',

  // Tier 3 — CSS selectors for KPI .v elements
  kpiSelectors: {
    totalPlanned: '.kpi:nth-child(1) .v',
    submitted:    '.kpi:nth-child(2) .v',   // null = skip
    overdueFirst: '[data-kpi="overdueFirst"] .v',  // null = skip
  },

  // Tier 3 — filter trigger button selector
  filterTriggerSelector: '.tf-btn',

  // Tier 3 — validation panel issue count element selector (null = skip)
  validationCountSelector: null,

  // Tier 4 — layout geometry
  samplePath: '/absolute/path/to/Arch/sample-data-tables.html',
  geometry: {
    tableSelector:  'table.ds-table',
    expectedRowH:   40,   // --ds-row-h
    expectedHeadH:  40,   // --ds-head-h
    sampleRowLimit: 12,   // rows measured per table
    tolerance:      0.5,  // px
  },

  // Tier 4c — table chrome (compulsory)
  chrome: {
    titleSelector:          '.panel-head h2',
    headerFragmentSelector: '.vheadtab',  // null if the dashboard has no thead-only fragment
    multiRow:               true,   // enforce grouped-header stacking + scrollbar-gutter (MDL matrix); false for dashboards without that spec rule
    layout:                 true,   // enforce alignment / sort-affordance / column-sizing rules (I-102); false elsewhere
    splitHeader:            true,   // enforce split-header pairing rules (spec §7.2.15); false elsewhere
    colMinWidth:            60,     // hard floor for every column (spec §18: replace with per-type minima)
    scrollProbe:            240,          // px scrolled to prove the header sticks
    tolerance:              2,            // px
  },
};
```

---

## Adding a new dashboard

1. Create `checks/<name>.mjs` following the schema above. The harness **auto-discovers** it — no core edit needed.
2. (Obsolete) The `DASHBOARDS` array is gone; dashboards are read from `checks/` at run time.
3. If the dashboard has a modular `src/` pipeline, set all four path fields.
4. If the dashboard is monolithic, set `pipelinePath: null` and log a workplan issue for modularisation.
5. Point at your design spec with `--spec <path>` (defaults to the bundled `spec/Dashboard-UI-Design-Spec.md` copy). The encoded checks correspond to the Dashboard UI Design Spec; adapt the ruleset in `harness.mjs` for a different spec.

---

## Relationship to `MDL/test/test_pipeline.mjs`

`test_pipeline.mjs` is the **unit test** for the pipeline logic (§3.8.5): it runs in Node,
imports `pipeline.mjs` directly, and asserts record counts, KPI values, lookup table contents,
and validation rule sourcing. It does not use a browser.

`harness-layout/harness.mjs` is the **integration test**: it verifies that the compiled,
bundled HTML renders the same numbers that the pipeline computes, and that the UI controls
(filters, warning bar, status bar) behave correctly. It uses Playwright.

Both must pass before a release. `test_pipeline.mjs` is faster and runs first; `harness.mjs`
is the final gate.

---

## Known limitations / open items

| Item | Detail |
|------|--------|
| PPP Tier 3 | Blocked by I-76 (monolithic pipeline). Once `src/` modules are extracted, set `pipelinePath` in `checks/ppp.mjs`. |
| `_loadFile` hook | MDL `render.mjs` exposes `window._loadFile = loadFile` at the end of `boot` (line 2167). Tier 3 injection uses this directly. PPP does not expose it (I-76); the harness falls back to a synthetic `DragEvent` on `.drop`. |
| KPI selectors | `kpiSelectors` in each config must be kept in sync with the dashboard's rendered HTML. If a KPI card is reordered, update the selector. |
| Validation count selector | `validationCountSelector` is `[data-validation-count]` in the SUB and MDL configs. PPP remains `null` until its validation panel exposes a stable count element. |

---

## Spec cross-references

| Spec section | What the harness checks |
|---|---|
| §3.5 | errBanner z-index, hidden state, applyBannerState, banner-open, W-FORMULA strips |
| §3.6 | status-bar z-index, hidden before load, padding-bottom:52px |
| §3.7 | Onboarding screen, logo embedded, headline, dropzone, privacy, copyright, expect |
| §3.8.0 | src/ modules exist |
| §3.8.2 | STATE object, write-only render, per-stage try/catch, local date for as-of |
| §3.8.3 | parseCodeSheet, findLookupColumns, buildFieldToCol present |
| §3.8.4 | isExcelError, W-FORMULA present |
| §3.8.5 | This harness IS the §3.8.5 layout harness |
| §4 | panel data-panel, padding 14px 14px 26px |
| §4.2 | scurveAxisMode, rotate(-90 bar labels, cumulative absolute |
| §4.3 | max-height:340px, print release |
| §4.5 | .vchip, .vdetails |
| §5 | .kpi, .subkpi |
| §6 | All canonical :root tokens |
| §6.1 | data-theme / dark |
| §7.1 | min-height:32px, min-height:26px |
| §7.2 | .ds-table, .tableScroll, --ds-row-h, .sev-svg |
| §7.9 | .help-modal hidden initially |
| §4.2 | C3 bar y-axis grid lines + numbers (I060): 5 horizontal grid lines at 0/25/50/75/100% of a nice max, bars scaled to that max, tick labels right-aligned flush in the metric-label column (no gap, aligned with the table below); Pie cards exempt. Advisory until a dedicated check is added. |
| §4.2 rev 1.75 / §8.2 assertion 23 | Tier 5 `lintC3ColumnSync` also enforces the C1 visual contract on C3 Bar cards. Each card carries ONE hidden `.c3-col-band` emitted before the bars and ONE hidden `.c3-col-snap` dashed centre line emitted after them. Both stay hidden until hover, move to ONE shared active grid track from BOTH hover directions, and hide on pointer leave. The check measures band alignment and centre position within 2 px, and asserts the active bar has no computed border, outline or inset ring. Opt-in through `c3.columnSync.bandSelector` / `centreLineSelector`. C1 keeps `.sc-hover-band` and `.chart-snap` unchanged. |
| §4.2 rev 1.74 / §8.2 assertion 23 / I131 | Tier 5 `lintC3ColumnSync`: the general chart ↔ attached-table column sync applies to C1 and C3 Bar. On C3, a bar hover and a table-cell hover each set ONE shared `.col-active` id on the matching `.g-bar`, dimension header and value cells inside ONE `.c3-card`. The second card stays clear. The `.chart-tip` window stays closed over the attached table, `.col-hover` is never added, and pointer leave clears every `.col-active` node. Opt-in through `c3.columnSync`. `lintC3NativeTable` measures `.col-active` on C3 tables; `lintTableCrosshair` treats C3 as chart-linked. |
| §4.2 rev 1.73 / I130 | Tier 5 `lintC3NativeTable`: two C3 Bar cards each render one native `table.c3-table[data-table-crosshair]` with caption, colgroup, thead, tbody, `scope`, shared `data-col-id` and `role="group"` on the card. Bar / header column centres align within `c3.nativeTable.alignTolerance: 2` px. Hover highlights one row, one logical column, one intersection cell and the header column, then clears on pointer leave. Opt-in through `c3.nativeTable`; the stale `lintC3()` `.c3-board` selector is a separate defect. |
| §4.2 rev 1.60 / §8.2 assertion 21 | Tier 5 C1 alignment: one `.c1-grid` with `--c1-gutter` / `--c1-cols` and one native `<table>`; `data-points` count = `th.g-axis` count = period `<col>` count; computed grid track widths = rendered header cell widths; every `<rect class="sc-bar-*">` lies wholly inside its month column; every `circle.sc-dot` snaps to a month-column centre; each `data-points[].cx` maps to a month-column centre through the SVG `viewBox` scale and `xMid` offset. Tolerance 2 px. |
| §4.2 rev 1.60 / §8.2 assertion 21 | Tier 5 C1 reflow: the From and To range inputs are moved to a different period window and the four alignment assertions above are repeated. A repaint must rebuild the curve payload, `<thead>`, `<colgroup>` and grid tracks from the same `N`. The original period is restored afterwards. Rev 1.60's **Fallback, reflow and print** clause makes the `ResizeObserver` / `width`-`height`-`viewBox` sync normative. |
| §4.2 rev 1.62 (supersedes decision 1) | Tier 5 C1 legend: `<g class="sc-legend">` is a child of the SVG, sits **above** the first horizontal `.sc-grid` line in its reserved top band, stays inside the SVG box, and has no HTML `.c1-legend` duplicate. In-SVG placement keeps PNG/Copy serialization intact. The bottom-legend branch (`SHOULD`) remains for §4.2 charts with no attached table, e.g. C2. |
| §4.2 rev 1.67 — C1 single-select presets and one-row control cluster (owner decision 2026-11-07) | Tier 5 C1 time bar: the five presets form ONE `.seg.c1-ts-chips` group of five `.seg-btn` buttons. Exactly one chip has `aria-pressed="true"` at a time, and exactly one has `.active`. The selection comes from stored `state.c1Preset`, NOT from `[from, to]` range equality, so clipped ranges do not light two chips. After a manual handle `input` / `change` every chip is `aria-pressed="false"`. At `oneRowWidth: 1280` all `.c1-ts` children and all `.c1-controls` children share ONE visual row and `getComputedStyle('.c1-ts').flexWrap === 'nowrap'`; below 1280 px wrapping is allowed by §3.4.1. Print CSS hides `.c1-ts-body` and `.c1-ts-chips.seg`. |
| §4.2 rev 1.66 — C1 dual-handle period time bar (owner decision 2026-11-07) | Tier 5 C1 time bar: exactly one `.c1-ts-track` holds two native `<input type="range" step="1">` handles with `data-c1period="from" / "to"`, `min="0"`, `max="N-1"` and identical bounds. Every computed value is a whole month index. `.c1-ts-tick[data-c1month]` count equals the active reporting-month count and the attached `<thead>` month-column count, and ticks take no pointer events. One keyboard step moves exactly one month. The five `data-c1preset` chips match `expectedPresets`; clicking each selects the specified window anchored to the current `to` index (`YTD` = January of the as-of year through the as-of month, `All` = `[0, N-1]`) and updates `aria-pressed`. An `input` event changes only the track visuals; a `change` event performs the one full repaint. `aria-label` / `aria-valuetext` and `:focus-visible` are present, and print CSS hides `.c1-ts-body` and `.c1-ts-chips`. |
| §4.2 rev 1.65 — window-based shared Y axis (owner decision 2026-11-07) | Tier 5 re-runs the four rev 1.64 axis assertions after a period change. `c1PickAxisProbe()` scans the windowed `data-points` for a shorter prefix with a materially lower peak AND a different nice-number axis; bounds, month grain, minimum window size and peak drop are checked, and an unsuitable dataset is **skipped**, not failed. New checks: `yMax` is recomputed from the window peak and matches the expected nice-number axis, the cumulative values of overlapping months are unchanged (no rebase), and the fill stays above `axisMinFill` — a **harness-only quality criterion**, not a UI requirement. Chart, `line.sc-grid`, HTML labels, `data-c1meta`, refit, hover and PNG/Copy all read the same scale. No second Y-axis or separate bar scale is introduced; that guardrail remains outstanding as `I120` (`DEFERRED_STUDY`). |
| §4.2 rev 1.64 — C1 dynamic Y tick standard (supersedes the rev 1.60 five-tick count; owner decision 2026-11-07) | Tier 5 C1 Y axis: one `<line class="sc-yaxis-line">` at the plot's left edge, vertical and spanning the plot height; a `.c1-ycap` unit caption rotated along the axis; and **dynamic** `.c1-ytick` labels. The harness reads `data-c1meta.yMax` / `yStep` / `yIntervals` and asserts: labels = `yIntervals + 1` = `line.sc-grid` count, `yIntervals <= 7` and `labels <= 8`, major-tick spacing >= ~40 SVG units, and ascending labels = `i × yStep` with the top label = `yMax`. The plot height stays 300 units; bars, curve, areas and dots all scale from the same `yMax`. Historical rev 1.60 row is preserved in both spec copies. |
| §4.2 rev 1.60 — Y axis contract (owner decision 2026-11-06, historical) | Tier 5 C1 Y axis: one `<line class="sc-yaxis-line">` at the plot's left edge, vertical and spanning the plot height; five `.c1-ytick` labels in grid column 1; and a `.c1-ycap` unit caption rotated along the axis (`writing-mode:vertical-*` or a rotate transform). The clause is now normative in both byte-identical spec copies (root + `harness-layout/spec/`); Tier 5 passes **34 / 0**. The five-tick COUNT is superseded by rev 1.64 above; the axis line, rotated caption and no-scroll reflow rules remain in force. |
| §4.2 rev 1.62 / §8.2 assertion 21 | Tier 5 C1 attachment: the `<thead>` top is flush with the plot's X axis / last `.sc-grid` line (2 px), which is also the SVG bottom, the SVG draws no separate `.sc-x` labels, the grid has `row-gap:0` / `column-gap:0`, and there is no horizontal scroll (owner decision 2026-11-06, now codified in rev 1.60). The chart and the table share one X label: the month header row. |
| §4.2 rev 1.63 — Attached-table interaction (C1 only) | Tier 5 `lintC1Interaction`: four tokenised `<linearGradient>` defs and `<path class="sc-area">` fills, gradient stops using on-chart series classes, one hidden pointer-transparent `.sc-hover-band` at `W / N`, `data-c1col` on every month `<th>` and value `<td>`, two-way chart → table `.col-active` sync and table → chart snap / band sync, chart-only `.chart-tip`, and cleared state on pointer-leave. Opt-in through `c1.interaction`; C2, C3, C4, KPI cards and MDL are out of scope. |
| §4.6 rev 1.63 — Hidden-window ARIA state | Tier 6 config-gated `hover.ariaHidden`: a hidden window carries `aria-hidden="true"` and no text; a shown window removes the attribute. Applies to C1–C4 and KPI cards on every view. |
| §4.2 rev 1.59 | Tier 5 C1 omits the as-of subtitle: `.sc-asof` count is zero. The old "As-of caption present" assertion was inverted on 2026-11-06. |
| §4.6 | Hover floating window: focusable host + aria-describedby → role="tooltip"; cursor:crosshair (charts)/help (KPI); nearest charts expose .chart-snap; window reveals on hover/tap and hides on leave; C2 .ct-l grouping guarded (Tier 6) |
