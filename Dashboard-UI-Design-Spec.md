# Dashboard UI Design Standard

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.99 | 2026-11-21 | CodeBuddy (AI) | **§4 / §4.2 / §6 — tool-row gaps become universal (owner instruction).** Every panel tool row MUST sit inside its owning card with equal padding on all four sides from `--tool-pad`. Gaps between control groups MUST use `--tool-gap`. C3 keeps `--c3-tool-pad` and `--c3-tool-gap` as aliases. Both byte-identical spec copies updated. |
| 1.98 | 2026-11-21 | CodeBuddy (AI) | **§4.6 — general value alignment in hover windows (I130).** Owner decision: numeric values stay right-aligned; text values start after a fixed label column and align left. §4.6 replaces the space-between row rule with a two-column rule for body rows and footers. Both byte-identical spec copies updated. |
| 1.97 | 2026-11-20 | CodeBuddy (AI) | **§6 / §7.2.16 / §4.2 / §8.2 / Appendix A.2 — general crosshair colour standard.** Owner instruction: make the crosshair design general. §6 adds five normative crosshair tokens (`--crosshair-track`, `--crosshair-intersection`, `--crosshair-ring`, `--header-crosshair-overlay`, `--header-crosshair-accent`) for all five themes. §7.2.16 defines translucent row and column tracks, a stronger intersection cell, non-destructive header and sticky-axis overlays, `@media (hover: hover) and (pointer: fine)` scope and keyboard focus parity. §4.2 reconciles the header overlay with C1 and C3 attached tables while active column body cells stay border-free. §8.2 assertion 22 and Appendix A.2 items 17 and 20 are aligned. Both byte-identical spec copies updated. |
| 1.96 | 2026-11-19 | CodeBuddy (AI) | **§4.6 — one header swatch for one-datum hover windows (`I153`).** Owner instruction: remove the repeated point color dot from C4 Scatter body rows and show one dot beside the document number. §4.6 now permits one header swatch instead of body-row swatches when every body row describes one datum with one series color. The token rule and footer rule stay unchanged. C4 Age buckets, C1, C2, C3 and KPI windows stay unchanged. |
| 1.95 | 2026-11-18 | CodeBuddy (AI) | **§4.5 / §8.2 — Validation becomes two independent panels (`I151`).** Owner instruction: separate the rule table and the issue table into two panels, give each table a chip subtitle in its own panel, and keep code selection working. §4.5 now requires `Validation Rules` and `Validation Issues` as top-level panels in document order, one `.pchip-row` per panel before its `.c-card`, with `Loaded rules` / `Fired rules` in Panel 1 and `All issues` / `Shown issues` plus the three severity chips in one row in Panel 2. The `data-validation-count` hook moves to the `Shown issues` count. The former meta note, the card titles, the separate severity row and the Rules row-count label are removed. The error-code filter still narrows the Issues panel only. §8.2 gains assertion 36. Review sample: `sub/ref/sample-validation-two-panels.html`. Both byte-identical spec copies updated. |
| 1.94 | 2026-11-18 | CodeBuddy (AI) | **§4.4 / §8.2 — drill column is conditional (`I150`).** Owner report: switching the Submittals panel to a month showed a white column before Document No. Browser measurement confirmed a 40px pinned `.drill-cell` (`background:rgb(255,255,255)`) with identical header / body widths in All months and month views; the cause is structural — the column is rendered unconditionally although 7 of 9 month views have no document with more than one submission. §4.4 now requires the drill column (with its `.expandable` row class, `.sub` detail rows, row shortcut and locked "Row" chooser item) to be omitted whenever no row in the current view is expandable; multi-record and All-months views keep the standardized drill-down. §8.2 gains assertion 35. Both byte-identical spec copies updated. |
| 1.93 | 2026-11-18 | CodeBuddy (AI) | **§4 / §8.2 — panel chip semantics refined (`I149`).** Owner review of the four Submittals chips: all four MUST describe the same globally filtered dataset; violet uses month-filtered document groups (not the unfiltered aggregate), green counts distinct cumulative documents (not submission rows), and neutral is the displayed record count. Labels carry temporal scope ("in / for" the selected month vs "till" the month; all-months forms when no window is selected). The single funnel glyph marks every displayed chip when the in-panel time filter or an actually-narrowing global filter is active; selecting every available value or a blank search does not mark, and the funnel never distinguishes filter types. §4 gains the temporal-label bullet and rewrites the colour-family, visibility and filter-indication bullets; assertion 34 is updated. Tokens, anatomy, reserved colours and component isolation from rev 1.92 are unchanged. Both byte-identical spec copies updated. |
| 1.92 | 2026-11-18 | CodeBuddy (AI) | **§4 / §6 / §8.2 — panel subtitle counts become colour chips (general requirement).** Owner instruction: update the UI spec as general requirements for panel subtitle chip design, replacing the current plain-text panel subtitle design, with the chip design optional per panel. §4 is rewritten: the summary row stays optional and data-only, but counts render as dedicated `.pchip` colour chips — title inside the chip, height-equal to the severity chip (11px/1.4 label, `2px 10px` padding compensating the 1px border, radius 6px, 13px/700 tabular count). §6 gains the four `--pchip-*` colour families (blue monthly · violet total-month · green accumulated · neutral filtered) in the normative token inventory for all five themes, plus two type-scale rows; red/amber severity colours stay reserved for `.vchip`; zero counts display `0`; filter-scoped chips carry the funnel glyph after the count (Style A, rule R1). Review samples: `sub/ref/sample-submittals-chips.html`, `sub/ref/sample-pchip-filter-indication.html`. §8.2 gains assertion 34. Per-panel migration starts with Submittals (follow-up implementation). Both byte-identical spec copies updated. |
| 1.91 | 2026-11-18 | CodeBuddy (AI) | **§4 / §8.2 — tool rows split filters LEFT and actions RIGHT (`I148`).** Owner instruction: "study submittals panel, csv button should be aligned to the right, filters will be aligned to the left. this is UI spec requirements." §4 gains the universal normative rule (keyed tables, Submittals, Forward and Overdue); the FO lane / horizon segments move to the left group beside the view toggle, leaving only `⤓ CSV` right-aligned; §8.2 gains assertion 33. Both byte-identical spec copies updated. |
| 1.90 | 2026-11-17 | CodeBuddy (AI) | **§4 / §8.2 — the top-menu workbook covers every table (`I146`).** Owner instruction: "export does not export all tables to different worksheet. log the issue and fix it." The export registry was cleared on every render and filled only by the active page, so the workbook held one page's tables; the three Forward and Overdue tables never registered at all. §4 now states the workbook carries one worksheet per table across all data pages, each page in its current view state. Assertion 31 wording updated. Both byte-identical spec copies updated. |
| 1.89 | 2026-11-17 | CodeBuddy (AI) | **§4 / §8.2 — download-name source corrected (`I145` amendment).** Owner decisions: the name prefix uses the **Project Title** (not the Project Code); the fallback is the **Project Code**; the **MDL `Code` sheet** is authoritative. The §4 name rule now reads the metadata from the MDL workbook `Code` sheet (`Project Title` slugified, `Project Code` fallback); the earlier "project code from `knowledge.json`" wording is withdrawn — `knowledge.json` is a repository artifact the standalone dashboard cannot read at runtime. Assertion 32 wording updated. Both byte-identical spec copies updated. |
| 1.88 | 2026-11-17 | CodeBuddy (AI) | **§4 / §8.2 — universal table export contract (`I145`).** Every on-screen table MUST have its own `⤓ CSV` control in the same tool row as the table, before image actions. The control MUST be hidden when the table has no rows or no table renders in the current view. Export MUST include all columns and all rows that match the applied filters; it MUST NOT limit output to the current page, viewport or column chooser. The top menu `Export` MUST download one `.xlsx` workbook with one worksheet per table. A bare boolean attribute MUST be detected with `hasAttribute`, because its `dataset` value is `""`. Download names MUST follow `PROJECT_purpose_YYYY-MM-DD.ext` with the current local date. §8.2 gains assertions 29 to 32. Both byte-identical spec copies updated. |
| 1.87 | 2026-11-17 | CodeBuddy (AI) | **§3.1 / §5 / §8.2 — the KPI panel is always first and full width; KPI cards use a 6 / 3 / 2 responsive grid as a general requirement (`I143`).** Owner decision 2026-11-17: the Settings layout control changes the panel grid only; it does not change KPI card density. The KPI panel stays first on every dashboard and is outside the panel grid, so `one` / `two` / `three` leaves it full width. §5 replaces the `auto-fit` 6 / 5 / 4 / 3 / 2 / 1 behaviour with a normative 6 / 3 / 2 grid: 6 columns at wide widths, 3 at 1100 px or less, 2 at 880 px or less. A KPI density control, where offered, MUST use these three states only. §3.1 gains the separation clause; §8.2 gains assertion 28. Both byte-identical spec copies updated. |
| 1.86 | 2026-11-17 | CodeBuddy (AI) | **§3.1 / §8.2 — a panel-layout control belongs in Settings, not in the menu bar; general requirement (`I142`).** A dashboard that offers a panel-column layout control MUST place it in the Settings panel as a labelled `<select data-setting="layout">`, with the values `one`, `two` and `three` and the visible labels `One`, `Two` and `Three`. The chosen value MUST be stored in `localStorage` and applied to `document.body.dataset.layout` on load and on every repaint. The menu bar MUST NOT contain a layout toggle, and the content area MUST NOT contain a layout control (§3.3). §8.2 assertion 27 enforces the rule. This supersedes the rev 1.24 menu-bar icon clause. Both byte-identical spec copies updated. |
| 1.85 | 2026-11-16 | CodeBuddy (AI) | **§3.2 / §6 — left-menu state tokens (owner decision 2026-11-16, `I141`).** The left-panel page link now takes its three fills and its text colour from four semantic tokens — `--nav-bg`, `--nav-bg-hover`, `--nav-bg-active` and `--nav-fg` — so no component rule holds a literal colour (§6 inventory gains the four rows). The hover is one translucent white veil, `rgba(255,255,255,.1)`, painted over the default fill, so it follows `--navy` in every theme. The active fill is `#354F6E`, a lighter step of the navy family, and MUST NOT be `--blue`: the accent colour stays reserved for actions, and the selected item must not look like a primary button. Selection keeps `font-weight:600`, because the active fill sits only 1.22:1 above the hover fill. Both dashboards and the shell sample are updated; the Sub active text contrast rises from 4.6:1 to 7.1:1. Both byte-identical spec copies updated. |
| 1.84 | 2026-11-16 | CodeBuddy (AI) | **§4.2 — C3 legend left inset (owner instruction 2026-11-16, `I140`).** Owner instruction: "leave more space before legend, it is too close to y axis. log the issue and fix it. also enhance spec." The legend rows MUST start after a LEFT INSET from the plot-zone left edge — the edge shared with the y-axis zone — so the first swatch never touches the y-axis side. The inset is `12` SVG user units in both views (the Bar legend strip and the Pie donut legend), matching the 12 px `--c3-card-pad` token; the legend wrap width shrinks by the same inset. Engine `render.js` rev 0.29; tests rev 0.29; both byte-identical spec copies updated. |
| 1.83 | 2026-11-16 | CodeBuddy (AI) | **§4.1 / §4.2 — C3 legend INSIDE the plot border (C1 model), Breakdown panel heights and the Pie size (owner instruction 2026-11-16, `I139`).** Owner review: "legend is not above plot svg, refer to c1 panel for reference. keep submission and approval status panel same height. adjust pie size to avoid changing panel height." (1) The C3 in-SVG legend MUST sit INSIDE the bordered plot area, above the plot content — the bordered y-axis and plot zones span the legend band and the plot band so the border encloses the legend rows — exactly the C1 model; this supersedes the rev 1.82 above-the-border wording. (2) The two Breakdown chart panels MUST share one height in every view (grid stretch, not start alignment; the card fills its panel). (3) The Pie / donut height MUST come from the `--c3-pie-h` token so toggling views does not change the panel height. Engine `render.js` rev 0.28 / `dashboard.css` rev 2.23 / `dashboard.js` rev 2.15; both byte-identical spec copies updated. |
| 1.82 | 2026-11-16 | CodeBuddy (AI) | **§4.1 / §4.2 — C3 legend above the plot area and the rotated y-axis unit caption (owner decisions 2026-11-16, `I135` review).** (1) The C3 in-SVG legend MUST sit ABOVE the plot area — inside the top of the SVG canvas with `yTop` sized for the legend rows, the plot-zone border starting BELOW the legend — never inside the bordered plot zone; this holds for the Bar and the Pie / donut view. The production engine now renders the legend as ONE `<svg class="c3-legend-svg">` holding the legend `<g>` (Bar: first child of `.c3-card-body`, before `.c3-grid`; Pie: directly above the bordered donut `<svg>`), and the HTML `.c3-legend` element type is retired from the production engine; PNG / Copy serialize the legend with the plot (the Pie export stacks the legend and the bordered donut in one wrapper SVG). (2) Every C3 Bar y-axis MUST carry the rotated side unit caption "Documents", exactly the C1 Y-axis contract (rev 1.60 / I117). The review sample's plot-zone border moved below the legend rows. Engine `render.js` rev 0.27 / `dashboard.css` rev 2.22 / `dashboard.js` rev 2.14; both byte-identical spec copies updated. |
| 1.81 | 2026-11-16 | CodeBuddy (AI) | **§4.1 / §4.2 / §7.2 / §8.2 — bordered chart zones and the table outer border become universal MUSTs (owner decisions 2026-11-16, `I135` review).** (1) The §4.2 bordered chart composition (rev 1.70) is no longer conditional: EVERY chart board on EVERY dashboard MUST render bordered axis, plot and attached-table zones, each `1px solid var(--border)`; the Pie / donut view MUST carry the bordered plot zone (part 6) even though it renders no y-axis zone and no attached table. (2) Right-angle corners are required ONLY where bordered zones overlap — the y-axis zone (part 5) and the plot zone (part 6) share an edge, so their shared corners use `border-radius:0`; where a named-token gap separates two zones (the `--c3-plot-table-gap` between the bar plot and the attached table, rev 1.80), their borders do not overlap, the right-angle rule does not apply, and those corners keep the general §4 rounding. (3) Every data table MUST show exactly ONE visible outer border `1px solid var(--border)` with the §4 rounding, from its own `.ds-split` wrapper, its owning `.c-card`, or the table element itself; the single-border rule is unchanged. §4.1 gains the C3 bordered-zones clause; §7.2 gains the general table outer-border rule; §8.2 gains assertion 26. Both byte-identical spec copies are updated. Engine, sample, harness, tests and workplan are unchanged. |
| 1.80 | 2026-11-15 | CodeBuddy (AI) | **§0 / §4.2 / §6 / §8.2 — C3 Breakdown gaps become universal named-token requirements; tool-row placement and padding normalized; plot-to-table gap minimized.** Every gap in the three Breakdown panels MUST be a named token; no rule hard-codes a gap value. The Breakdown tool row (part 3) MUST sit inside its owning card — chart card 2 or summary table card 9 — with equal padding on all four sides from `--c3-tool-pad`, identical in all three panels; in chart cards a scoped negative margin equal to `--c3-card-pad` cancels the outer card padding so the token alone sets the distance to the border. The bar-plot-to-attached-table gap MUST be the derived token `--c3-plot-table-gap` = x-axis label height ÷ 3 (6 px at the default label height), minimized while keeping the plot baseline and the `0` tick label clear. This supersedes the rev 1.79 wording that required a gap of at least the x-axis label height. §6 gains the seven Breakdown gap tokens; §8.2 assertion 25 enforces them. Both byte-identical spec copies are updated. |
| 1.79 | 2026-11-15 | CodeBuddy (AI) | **§4.2 C3 attached table — vertical gap mandated between bar plot and attached table.** The attached native table MUST be separated from the bar plot by a vertical gap. The gap MUST scale with the x-axis label height (for example a `margin-top` equal to the axis-label line-height) so the axis labels never touch the plot baseline. Both byte-identical spec copies are updated. |
| 1.78 | 2026-11-15 | CodeBuddy (AI) | **§4.2 legend element type unified to in-SVG; §6 token inventory added; §3.9 governance note; Appendix A added (non-normative matrix register).** The chart legend is now ONE element type for every panel: an in-SVG `<g>` above the chart (C1 and C3). The C3 HTML `.c3-legend` element type (rev 1.76) is retired; C3 now renders its legend inside an SVG group above the chart. This is the single-option standard from the UI Comparison and Standardisation Matrix. §6 gains an explicit token inventory (`--btn-h`, `--seg-h`, `--panel-gap`, `--c1-gutter`, `--c3-gutter`, `--sidebar-w`, `--ds-grip-w`, `--ds-sbw`, and the full semantic colour set). §3.9 gains the governance note that the root spec and the `harness-layout/spec` copy are byte-identical and serve as mutual rollback. Appendix A carries the archived matrix as a non-normative register; the deviation from matrix rev 1.76 is recorded as a conformance item (§8.4). Both byte-identical spec copies are updated. |
| 1.77 | 2026-11-14 | CodeBuddy (AI) | **§4.2 rev 1.77 / `I134` — ONE tool row per Breakdown chart panel.** Owner decision 2026-11-14: all tool controls of the `Submissions` and `Approval Status` chart panels MUST sit in ONE row — the Month select, the Break-down-by group and the Bar / Pie toggle on the LEFT, and `⤓ PNG` + `⧉ Copy` on the RIGHT — with no second head row above them. The visible `Month` text is removed from the Month select; the select keeps its accessible name through `aria-label`. The `Breakdown Summary` panel keeps Month, Break-down-by and `⤓ Download` and is unchanged. The legacy per-card head (title + PNG / Copy) stays available for sample pages that show a card title. §8.2 assertion 24 enforces the row order and the no-`Month`-text rule. Both byte-identical spec copies are updated. Historical rows 1.60–1.76 are preserved verbatim. |
| 1.76 | 2026-11-14 | CodeBuddy (AI) | **I133 — the C3 Breakdown becomes a `Breakdown` page with THREE independent panels.** Owner decisions D1–D7 and 4 notes, 2026-11-14. The sidebar gains `Breakdown` directly below `Overview`; `Overview` keeps KPI, C1 and C2. §0 gains `Others` (a Document Submittal Log row whose `Document No.` is not registered in the MDL workbook, `V-29` orphan) and the `Breakdown page` definition. §3.2 fixes the new item's position and keeps `--sidebar-w:160px`; §3.3 still bars a content-toolbar heading. §4 retires the "panel holds two C3 cards" example; §4.1 replaces the ONE shared control cluster exception with THREE panel-owned clusters. Each panel owns `c3Month`, `c3Dim` and, for charts, `c3View`; the two chart panels switch to donuts independently; the summary panel owns Month, Break-down-by and `⤓ Download`. §4.2 makes the C3 HTML legend sit ABOVE the chart in BOTH Bar and Pie views (rev 1.62 stays C1-only and in-SVG) and makes the summary table its own full-width panel. §4.7 / §8.2 assertion 19 apply the 14 px gap to the new page; a page-scoped 2+1 grid keeps the global `body[data-layout]` behaviour unchanged. The summary table uses compact row tokens and `max-height:none` so it has NO inner vertical scroll bar. §8.2 assertions 21 / 22 / 23 cite the new page; assertion 24 enforces page order, panel independence, legend order, compact table and `Others`. Border rules of §4, §4.1, §4.2 rev 1.70 and §4.2 rev 1.73 are unchanged and MUST apply to all three panels. Both byte-identical spec copies are updated. Historical rows 1.60–1.75 are preserved verbatim. |
| 1.75 | 2026-11-14 | CodeBuddy (AI) | **§4.2 rev 1.75 — chart ↔ attached-table column highlighting adopts the C1 visual design.** Owner decision 2026-11-14: the active-column border and the hidden centre line MUST follow the C1 panel style. §0 and the §4.2 general rule gain the normative visual contract: ONE hidden column band spanning the full plot height and one column width, ONE hidden dashed `.chart-snap` centre line, NO border or inset ring on active column cells, and both elements driven in BOTH hover directions and excluded from PNG / Copy / print. §4.1 cites rev 1.75 for C3; §4.2 marks the C1 reference implementation as the visual reference and replaces the C3 per-bar inset-ring model with the band + centre line model; §4.6 makes the snap line REQUIRED for charts with an X-aligned native attached table and keeps it optional elsewhere; §7.2.16 requirements 5 and 8 gain the band and centre line; §8.2 assertions 21 / 22 cite rev 1.75 and assertion 23 enforces the visual contract. C1 keeps `data-c1col` / `.sc-hover-band` / `.chart-snap` / `.col-active`. C3 Pie, `.c3-summary`, `breakdown-table.csv`, C2 Funnel, C4, MDL, KPI and bounded `.ds-table`s stay out of scope. The structural 1 px board border of §4.2 rev 1.70 is not affected. Both byte-identical spec copies are updated. Historical rows 1.60–1.74 are preserved verbatim. |
| 1.74 | 2026-11-14 | CodeBuddy (AI) | **§4.2 rev 1.74 / `I131` — simultaneous chart ↔ attached-table column highlighting becomes a general rule.** Owner decision 2026-11-14: where a chart renders a native attached table in the same chart board whose columns share the chart's X positions, hovering a chart column MUST highlight the same logical column in BOTH chart and table, and hovering an attached-table column MUST highlight the same logical column in BOTH table and chart. The state is transient, scoped to the owning chart card, cleared on pointer leave / blur / Escape / repaint / print, and stripped from PNG / Copy / print. §0 gains the normative general rule; §4.1 cites it for C3; §4.2 replaces the former C1-only interaction scope with a general clause plus a C1 reference implementation and a C3 implementation contract; §4.6 generalises the attached-table touch / hover-window wording; §7.2.16 gains the C1 + C3 chart-linked `.col-active` carve-out; §8.2 assertions 21 / 22 cite rev 1.74 and assertion 23 enforces the general two-way sync. C1 keeps `data-c1col` / `.sc-hover-band` / snap line; C3 Bar cards use shared `data-col-id` and `.col-active` on `.g-bar`, dimension headers and value cells. C3 Pie, `.c3-summary`, `breakdown-table.csv`, C2 Funnel, C4, MDL, KPI and bounded `.ds-table`s stay out of scope. Both byte-identical spec copies are updated. Historical rows 1.60–1.73 are preserved verbatim. |
| 1.73 | 2026-11-13 | CodeBuddy (AI) | **§4.2 rev 1.73 / `I130` — C3 Bar attached tables become native HTML tables (Option A).** The owner approved Option A to follow the current C1 panel design and the UI spec. §0 now states that an **Attached table** is a **Semantic table**. §4.1 replaces the C3 div-grid table with one bar-plot CSS grid plus one native attached table per card. §4.2 makes the C3 native attached-table model normative: one borderless `.c3-grid` with `--c3-gutter:104px`, `--c3-cols:N` and `column-gap:0`; one `<table class="c3-table" data-table-crosshair>` spanning row 2 with `<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, `scope` and `data-col-id`; `table-layout:fixed`, `border-collapse:separate`, `border-spacing:0`, shared column geometry, scoped C3 cell rules, `role="group"` on `.c3-card`, and PNG / Copy that include table rules with transient hover classes stripped. §7.2.16 gains C3 attached-table compatibility; §8.2 assertions 21 and 22 cite rev 1.73. The Pie view, the full-width `.c3-summary` table and `breakdown-table.csv` stay unchanged. Both byte-identical spec copies are updated. Historical rows 1.60–1.72 are preserved verbatim. |
| 1.72 | 2026-11-13 | CodeBuddy (AI) | **§7.2.16 gained a normative global Table Hover Crosshair Standard** (owner recommendation of 2026-11-13; `I129`). One shared `.ds-table` interaction contract now governs every tabular view: the hovered data row is highlighted, the hovered logical column is highlighted including its header, and the intersection cell receives stronger emphasis; split-header cells pair by rendered column position or an explicit column identifier, never raw `cellIndex`; the C1 attached table keeps its chart-linked `.col-active` / `data-c1col` behaviour; column rules and `position:relative` stay intact; and transient hover state is excluded from PNG, Copy and print. §8.2 gains assertion 22. Both byte-identical spec copies are updated. Engine, harness, tests, sample and standalone build stay unchanged; `I129` remains `APPROVED`, not implemented. Historical rows 1.60–1.71 are preserved verbatim. |
| 1.71 | 2026-11-12 | CodeBuddy (AI) | **§7.1 gained a universal button-height standard** (owner decisions of 2026-11-12; `I128`). Every text-bearing button — primary, secondary and text actions, filter triggers, segmented buttons, column-visibility controls, pagination buttons and other visible text buttons — MUST share ONE `min-height:32px` token. Icon-only buttons, including the B4 drill control, stay 26 px square; the drill cell keeps its 32 px width by moving to 3 px side padding. §7.5 B2.1 now has ONE segmented variant; the former Sub C1 `compact` preset deviation is retired, and `--seg-h` derives from the universal `--btn-h` token. Historical rows 1.60–1.70 are preserved verbatim. |
| 1.70 | 2026-11-12 | CodeBuddy (AI) | §4.2 gained a universal **bordered chart composition** clause. A chart board MAY be subdivided into axis, plot and attached-table zones. The alignment grid stays borderless. Adjacent zones share edges; shared corners use `border-radius:0`; non-shared corners use `border-radius:10px`. No additional wrapper surrounds the whole composition. Class names are implementation-specific. §8.2 assertion 21 and both byte-identical spec copies are updated. The sample page, engine, standalone dashboard, tests, harness, workplan and logs stay unchanged. Historical rows 1.60–1.69 are preserved verbatim. |
| 1.69 | 2026-11-11 | CodeBuddy (AI) | **§7.5 B2.1 is now the authoritative segmented-control standard** (owner decisions Q01–Q10 of 2026-11-09 / 2026-11-11; `I123` resolved, `I125`). §7.5 B2.1 defines ONE common set of CSS custom-property tokens, two approved variants (`standard` 32 px / 12 px and the C1 `compact` exception at ≈ 26 px / 11 px with `padding:5px 8px`), six interaction states (default, active, hover, focus-visible, pressed, disabled), common HTML / ARIA (`type="button"`, a dynamic `aria-pressed`, `role="group"` and an accessible name on EVERY group), equal height within one group with centre alignment between groups, and a precedence rule: an explicitly approved panel-specific requirement overrides a common B2.1 default. B2 now mandates `--navy` as the active fill and `--surface2` as the inactive hover fill for every segmented control, so the former `--blue` hover / `.on` / `--navy` conflict between §7.5 B2 and §4.2 rev 1.68 is REMOVED. The active-state focus ring uses a high-contrast light colour, because `--blue` on `--navy` measures only 2.89:1, below the 3:1 non-text contrast target. No 44 × 44 px touch rule is added: the dashboards stay desktop-first at the 1280 px minimum and a separate `@media (pointer: coarse)` variant is deferred. ALL seven `.seg-btn` generators in the Sub dashboard now emit the common markup: the two C1 groups, the C2 / C3 / C4 groups and the three Forward and Overdue groups. Every `data-*` attribute, handler, state key and repaint path is unchanged. §4.2 rev 1.68's clause is reduced to the two C1-specific rules and points at §7.5 B2.1 for all common tokens. §8.2 assertion 21, both byte-identical spec copies, `SKILL.md`, `checks/sub.mjs`, `harness.mjs`, the render suite, the review sample, the workplan, `knowledge.json` and the three logs are updated. MDL / PPP hover and markup deviations are RECORDED, not changed, in the §7.5 B2.1 deviations list. A measured browser regression found that the shared `line-height:1.2` shrank the compact chips from 25.94 px to 23.19 px; a dedicated `--seg-compact-lh:1.45` token now restores the approved height. Historical rows 1.60–1.68 are preserved verbatim. |
| 1.68 | 2026-11-09 | CodeBuddy (AI) | §4.2 gained a normative **shared segmented base-token** clause (rev 1.68, owner decision 2026-11-09, issue `I124`). A read-only token audit found that the C1 preset group and the Month / Quarter / Year grain group shared the `.seg` / `.seg-btn.active` / `--blue` colour tokens, but not the size, hover, focus or ARIA tokens: the presets had a scoped `.c1-ts-chips .seg-btn` override with `5px 8px` / `11px` plus its own `:focus-visible` rule, while the grain buttons had no `type="button"`, no `aria-pressed` and no focus rule; no `.seg-btn:hover` rule existed anywhere. **Fixes.** ALL `.seg-btn` buttons in the Sub dashboard MUST now share ONE base hover rule `.seg-btn:not(.active):hover{background:var(--surface2);color:var(--blue)}` and ONE base focus rule `.seg-btn:focus-visible{outline:2px solid var(--blue);outline-offset:-2px}`. The `-2px` offset is required because `.seg` has `overflow:hidden`. The scoped `.c1-ts-chips .seg-btn:focus-visible` rule MUST be removed. `.c1-ts-chips .seg-btn{padding:5px 8px;font-size:11px}` MAY remain as an **explicit layout exception** so five presets fit ONE row at the 1280 px minimum; it MUST NOT carry a hover or focus rule. Owner decision: soft `--surface2` hover, **NOT** §7.5 B2's literal `--blue` hover, because Sub uses `--blue` for the active state and `I123` (B2 `.on` / `--navy` alignment) stays `DEFERRED_STUDY`. **This revision does NOT claim literal B2 compliance.** The C1 grain group MUST emit `type="button"` and a dynamic `aria-pressed` that mirrors `.active`. Scope is grain ONLY: the five other `.seg-btn` generators (C2 / C3 / C4 / Validation) keep their markup, but inherit the base hover and focus rules. §8.2 assertion 21, `harness-layout/SKILL.md` rev 1.11, `checks/sub.mjs` rev 1.14, `harness.mjs` rev 1.24, the render suite rev 0.17, the workplan gate, the review sample rev 0.7 and the logs now cite rev 1.68. `state.c1Period`, `c1PresetRange()`, windowed `pts`, absolute cumulative values, `niceAxisTicks()`, the rev 1.65 shared Y axis, PNG/Copy and every event handler are unchanged. Historical rows 1.60, 1.28, 1.64, 1.65, 1.66 and 1.67 are preserved verbatim. Both copies re-synced byte-identical. |
| 1.67 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.66's **C1 preset chips** clause and **control-cluster row** clause are now normative (rev 1.67, C1 only, owner decision 2026-11-07, issue `I122`). Owner-reported defect: `12M` and `24M` showed as selected together, because rev 1.66 derived each chip's `aria-pressed` by comparing the current `[from, to]` with every preset's computed range; clipped ranges collide (with 31 months, anchors 0–11 produce 2 or 3 matches). Owner-reported defect: the tools below the panel title used two rows at 1280 px, because `.c1-ts{flex-wrap:wrap}` dropped the chips to a second line. **Fixes.** The five presets MUST now form ONE joined `.seg` group of `.seg-btn` buttons, using the existing Sub `.seg-btn.active` / `--blue` token for consistency. The selection MUST be stored as ONE preset name in view state, not derived from range equality. `undefined` gives the default `All` selection; `null` gives a manual custom range with NO active chip; any preset name gives exactly that ONE active chip. A handle `input` or `change` MUST set the selection to `null`. Clipped ranges MUST NOT light two chips. The `.seg` group keeps `data-c1preset`, `aria-pressed` and `aria-label`; `c1PresetRange()` keeps computing the period. `.c1-ts` MUST use `flex-wrap:nowrap` down to the 1280 px minimum desktop viewport width, with `flex-shrink:0` on the label, period text and chip group and only `.c1-ts-body` shrinking (basis 190 px, min-width 120 px). Below 1280 px the §3.4.1 wrap rule re-enables `flex-wrap:wrap`. Print MUST hide `.c1-ts-body` and `.c1-ts-chips.seg`. §8.2 assertion 21, `harness-layout/SKILL.md` rev 1.10, `checks/sub.mjs` rev 1.13, `harness.mjs` rev 1.23, the workplan gate, the render suite rev 0.16 and the review sample rev 0.6 now cite rev 1.67. The B2 token gap (§7.5 B2 says `.on` with `--navy`; Sub uses `.active` with `--blue`) is recorded as a SEPARATE deferred item (`I123`); this revision does NOT change other Sub segmented controls. `state.c1Period`, windowed `pts`, absolute cumulative values, `niceAxisTicks()`, the rev 1.65 shared Y axis, PNG/Copy and every other control are unchanged. Historical rows 1.60, 1.28, 1.64, 1.65 and 1.66 are preserved verbatim. Both copies re-synced byte-identical. |
| 1.66 | 2026-11-07 | CodeBuddy (AI) | §4.2 gained a normative **C1 period time bar** clause (rev 1.66, C1 only, owner decision 2026-11-07, issue `I121`). The C1 period window MUST now be ONE dual-handle range track, not two separate From / To inputs: two overlaid native `<input type="range" step="1">` elements on one shared visual track, with `min="0"`, `max="N-1"` and the existing `data-c1period="from" / "to"` attributes. `step="1"` gives hard magnetic snapping to whole reporting-month indices, so fractional months are unreachable and the chart, the attached `<thead>` columns and `data-points` always rebuild from the same `N`. One subtle tick MUST be drawn per active reporting month (`data-c1month`), with pointer events disabled; January ticks MAY carry a year label, and active / near states MUST follow the selected window. Five preset chips `6M`, `12M`, `24M`, `YTD`, `All` MUST sit beside the track with `aria-pressed`; the three month presets anchor to the current `to` index, `YTD` spans January of the as-of year through the as-of month, and `All` spans the full range. A preset MUST set the same period state and use the same single full-repaint path as a handle change. An `input` event MUST update only the track visuals (fill, ticks, period text, `aria-valuetext`, chip state); the `change` event MUST perform the ONE full repaint, with no chart rebuild while dragging and no animation or debounce. Both inputs MUST keep `aria-label` and `aria-valuetext` and a visible focus outline, and one keyboard step MUST move one month. Print MUST hide the interactive track and chips but keep the period text. `state.c1Period`, the windowed `pts` payload, absolute cumulative values, the attached table, `niceAxisTicks()`, the rev 1.65 shared Y axis, PNG/Copy and every other control are unchanged; no second Y-axis or separate bar scale is introduced. §8.2 assertion 21, the harness C1 checks and the workplan gate now cite rev 1.66. Historical rows 1.60, 1.28, 1.64 and 1.65 are preserved verbatim. Both copies re-synced byte-identical. |
| 1.65 | 2026-11-07 | CodeBuddy (AI) | §4.2 now states explicitly that the shared C1 Y-axis maximum is computed **over the selected period window** — from the windowed `data-points` payload (`pts`), filtered by the enabled series and the Bars toggle — and is recalculated on every relevant repaint (period, series, Bars, grain), immediately and with no animation or debounce. This makes explicit the visible-window requirement already present in the §4.2 shared-scale rule of 2026-10-13 and the VISIBLE wording of rev 1.64; it does not change `niceAxisTicks()`, the 300-unit plot height, the seven-interval / eight-label / ~40 px limits, or the one `data-c1meta` payload. Cumulative values MUST remain **absolute** and MUST NOT be rebased to the window; only the scale adapts, and chart, `line.sc-grid`, HTML axis labels, hover / refit metadata and PNG/Copy MUST all represent the same Y-axis scale after a period change. No second Y-axis or separate bar scale is introduced: the §4.2 scale-mode guardrail (`r = maxCum / maxBar > 10` → separate scales) remains a **documented requirement that is outstanding**, recorded as `I120` (`DEFERRED_STUDY`) for a future technical investigation. §8.2 assertion 21 and the Tier 5 gate now cite rev 1.65. Historical rows 1.60, 1.28 and 1.64 are preserved verbatim. Both copies re-synced byte-identical. Owner decision 2026-11-07; issue `I119`. |
| 1.64 | 2026-11-07 | CodeBuddy (AI) | §4.2 gained a normative **C1 dynamic Y tick standard** that SUPERSEDES the fixed-five-tick count of rev 1.60 (the rev 1.60 and rev 1.28 revision rows are preserved verbatim as history). For a C1 plot of `H = 300` SVG units: major ticks MUST be at least ~40 units apart, so at most `min(7, floor(H / 40)) = 7` intervals and at most **eight labels** (intervals + 1, including zero); steps MUST come from the standard nice-number sequence `{1, 2, 2.5, 5} × 10^k` with `step >= 1` for integer document counts; choose the SMALLEST step `s` with `ceil(M / s) <= 7` where `M` is the maximum of the VISIBLE series, set `yMax = ceil(M / s) × s` and `intervals = yMax / s`; tick labels, `.sc-grid` lines, the static HTML ticks, the `ResizeObserver` refit and PNG/Copy MUST all derive from the SAME C1 metadata payload (`data-c1meta.yMax` / `yStep` / `yIntervals`) — no fixed `[4,3,2,1,0]` loop. The plot height MUST stay 300 units; only the scale changes, and every mark scales from that one `yMax` (real workbooks: `M = 5955` → step 1000 → axis 6000 → 6 intervals / 7 labels / 50 px spacing / 99.25% fill). This revision also SUPERSEDES the 2026-10-25 §4.2 body sentence that prohibited ANY rounded-up step: a FINE nice step that keeps the curve at full plot height preserves that rule's intent while giving round tick numbers. §8.2 assertion 21, the Tier 5 geometry gate, `harness-layout/checks/sub.mjs`, `harness-layout/SKILL.md` and the workplan gate row 11 now cite rev 1.64. Both copies re-synced byte-identical from the root copy (the bundled copy had drifted by four clauses: §4.2 font-family, table cell fonts, tabular-nums and one §4.6 wording). Owner decision 2026-11-07; issue `I118`. |
| 1.63 | 2026-11-06 | CodeBuddy (AI) | §4.2 gained a normative **Attached-table interaction (C1 only)** clause promoting the reviewed Option B prototype into the production build: four tokenised `<linearGradient>` defs and `<path class="sc-area">` area fills beneath the cumulative lines; one hidden `.sc-hover-band` (`width = W / N`) behind all marks; `data-c1col` on every month `<th>` and value `<td>`; two-way month-column sync (chart → `.col-active` table cells, table → snap line and band); and a `.chart-tip` window that opens **only** while the cursor is inside the SVG chart area. Gradient stops MUST use the on-chart series tokens, never hard-coded hex (§4.6); PNG/Copy MUST serialize the gradients with resolved token colours and strip the band and `.col-active` so no transient hover state is captured. `data-c1col` is distinct from `data-col`, which is reserved for `.ds-table` column choosers and resize grips. §4.6 gained two normative clauses: (1) a hidden window MUST be `aria-hidden="true"` **and** empty of text, with the attribute removed before show — an element directly referenced by `aria-describedby` can still be exposed by assistive tech despite `aria-hidden`, so clearing text is REQUIRED; (2) the §4.6 touch tap-to-show requirement applies to the SVG chart area; a tap on a table cell MUST still activate the snap line, column band and column highlight, but need not open the floating window because the cell value and its `<th>` headers are already in the native table accessibility tree (I082). §8.2 assertion 21 extended. The C1-only trigger is explicit — C2, C3, C4, KPI cards and the MDL dashboard are out of scope — and rev 1.62 geometry, the legend rule and all historical revision rows are unchanged. Re-synced to the harness bundled spec. |
| 1.62 | 2026-11-06 | CodeBuddy (AI) | §4.2 gained a normative **Legend Placement & Table Attachment Rule** that supersedes owner decision 1 of 2026-11-06 for attached-table panels: where a `.c1-grid` panel renders a native `<table>` whose `<thead>` month cells are the shared X labels, the in-SVG legend MUST sit **above** the plotting area and the plot bottom MUST touch the `<thead>` with zero intermediate layout elements; every other §4.2 combined chart keeps the bottom legend (`SHOULD`). The C1-only trigger is explicit — C2, C3, C4 and the MDL dashboard are out of scope — and HTML / toolbar legends remain excluded so PNG/Copy fidelity is preserved. The four-series / `floor(W / 132)` wrapped-row description from rev 1.61 is retained for both branches, the inclined-X-label bottom-padding clause is scoped to the bottom-legend branch, and the §4.2 grid contract plus §8.2 assertion 21 now require the `<thead>` to be flush with the plot bottom. Verified by layout-harness Tier 5 after the engine refactor. Re-synced to the harness bundled spec. |
| 1.61 | 2026-11-06 | CodeBuddy (AI) | §4.2's combined-chart legend clause updated so its descriptive wording matches the built, Tier 5-verified C1 design: one bar swatch and one `Cum. …` line sample per visible series (four series → eight entries), wrapped into rows of `floor(W / 132)` items at plot width `W`, with every row inside the SVG `viewBox`. The core rule — in-SVG at the bottom, no HTML legend — is unchanged from rev 1.27 and keeps its `SHOULD` strength; the old "Planned / Actual" + "three `Cum. …` line samples in one row" text described a superseded 2/3-series model. Scope is limited to this one C1 clause; no new MUST obligation, and C2, C3, C4 and all engine / harness files are untouched. Re-synced to the harness bundled spec. |
| 1.60 | 2026-11-06 | CodeBuddy (AI) | §4.2 gained a normative **Y axis contract**: one vertical `sc-yaxis-line` at `x = 0` spanning the plot height, five right-aligned Y ticks in grid column 1, and the unit caption (`Cumulative documents` or equivalent) rotated along the side of the axis with `writing-mode:vertical-rl` or an equivalent rotate transform. §4.2's **Fallback, reflow and print** clause replaced "A wide period MUST scroll inside the chart board": the whole curve MUST stay visible inside the board at every container width, with no `min-width` and no horizontal scrollbar; the `ResizeObserver` pass MUST keep the `width` / `height` attributes, `viewBox`, `data-geo.W`, every `data-points[].cx`, `--c1-cols` and `<colgroup>` in sync so `preserveAspectRatio="xMidYMid meet"` cannot letterbox the plot; a period-window change MUST rebuild the curve payload and the table columns from the same `N`. §8.2 assertion 21 extended to cover the Y axis, `<thead>` adjacency, no separate SVG X labels, no-scroll fitting and post-reflow alignment. Owner decisions 2026-11-06; verified by layout-harness Tier 5 (34 passed / 0 failed / 1 skipped) and the sub render suite (40/0). Re-synced to the harness bundled spec. |
| 1.59 | 2026-11-05 | CodeBuddy (AI) | §0 Definitions gained the universal UI-spec vocabulary (app shell, CSS grid tracks, flow container, gutter / spacing scale, attached table, semantic table, native vs ARIA structures, scoping & hierarchy, reflow, `ResizeObserver`, scroll boundary, axis scaling & coordinates, export & serialization, accessibility tree, normative rule, traceability). §4.2 gained a normative **S-curve attached table** clause: it is universal across dashboards, metric rows are data-driven and the clause names no row; one `.c1-grid` CSS grid with explicit `--c1-gutter` / `--c1-cols` tracks is the alignment container; one `<svg>` curve carries a `ResizeObserver` on its host; one native `<table>` (Option B) sits in one spanning grid item with `<caption>`, `<colgroup>`, `<thead>`, `<tbody>` and `scope`; static and rebuilt cells share one structure; the panel edge plus one `.sc-board` border are the only borders; PNG/Copy rebuild the table as native SVG following the C3 method; `role="img"` stays on the SVG and ARIA table roles are not used. §4.2 also records the §4.3 / §7.2.15 exemptions, the CSV scope, and the C3 traceability citations. §8.2 gained assertion 21. Re-synced to the harness bundled spec. |
| 1.58 | 2026-11-05 | CodeBuddy (AI) | §4.3 gained a normative **Pagination control behaviour** rule and §4.5 gained a **Tool-cluster controls are local** rule, driven by sub issues I113 / I114 / I115 (owner browser review). A pager control MUST change only its own table's page and MUST NOT change the active view (it MUST NOT reuse the sidebar navigation attribute, whose unknown values fall through to the default Overview view); a panel-local filter MUST repaint its table, count and page-jump total immediately on change and reset to page 1 (a bare boolean attribute MUST be detected with `hasAttribute`, since `dataset` yields `""`); `⤓ CSV` MUST download the full filtered set. Re-synced to the harness bundled spec. |
| 1.57 | 2026-11-04 | CodeBuddy (AI) | §4.3 rewritten: bounded tables with more than 200 rows MUST paginate at 200/page with the navigation at the **top** of the card in the tool cluster, only the current page materialised, the full row count always communicated, and CSV covering the **entire filtered set** (pagination takes precedence over windowing). §4.5 Validation panel rewritten to the approved layout: panel-level `.note` meta under the page title, left-aligned `Issues` title on its own line, a stacked `.table-tools` row with page controls left (`.pg-left`) and error-code filter + `⤓ CSV` + `Columns` right (`.pg-right`, `margin-left:auto`), no bottom pager, and a panel-local error-code filter affecting only the Issues table. Driven by sub issue I112. Re-synced to the harness bundled spec. |
| 1.56 | 2026-11-02 | CodeBuddy (AI) | §7.2.15 invariant 5 **clarified — fit on a container change, never on a column change**: the fit pass MUST run when the container width moves (window resize, sidebar toggle, zoom, another display) and MUST NOT run because the sum of the columns changed; a column resize changes that sum, and re-fitting on that path scales the width the operator just dragged straight back down, so the drag does not stick and a drag by +d then −d does not land where it started. Implementations MUST cache the container width and re-fit only when it moves, still fitting once on first render; a drag wider than the display area is permitted, because this invariant governs the SHIPPED DEFAULTS and not a width the user chose. §3.5 gained a normative **addressability** rule: the warning area MUST carry the stable id `errBanner` so conformance checks and assistive tooling can locate it. Driven by the Sub dashboard run that went from 216 passed / 6 failed to 222 passed / 0 failed (sub issues I093, I095, I096). |
| 1.55 | 2026-11-01 | opencode (AI) | §7.1 gained a normative **search panel composition** rule: one row with an attached B5 column picker (All columns plus each searchable column), a flexible input and the A5 submit; the picker re-applies the query without clearing it and the query applies only to the chosen column. §8.2 gained assertion 20. |
| 1.54 | 2026-11-01 | opencode (AI) | §3.4.1 gained a normative **screen change / window resize** clause: reflow on any viewport width change (another display, resize, sidebar toggle, zoom) without reload or horizontal scrolling, using a `ResizeObserver` and not only a window listener; fixed-width inner content must re-fit or scroll inside its own card, split headers re-sync, and computed-width charts redraw; controls stay reachable and navigation remains available at every width. The truncated re-sync sentence was completed. |
| 1.53 | 2026-11-01 | opencode (AI) | §4 gained a dedicated normative **§4.7 Panel spacing**: 14 px between top-level panels (rows and columns), container `gap` or the panel margin but never both, never 0, hidden panels add nothing, print keeps it, and card spacing inside a panel stays separate (16 px charts / 12 px validation). §8.2 assertion 19 now cites §4.7. |
| 1.52 | 2026-11-01 | opencode (AI) | §4 gained a normative rule: stacked top-level panels are separated by the same **14 px** the panel margin defines (container gap or margin), never 0; hidden panels add no gap. |
| 1.51 | 2026-11-01 | opencode (AI) | §3.5 **placement made normative**: the notice area is pinned below the menu bar, above the filter strip and outside the scrolling body, so panel scrolling never moves it; §8.2 gains assertion 18. |
| 1.50 | 2026-11-01 | CodeBuddy (AI) | §4 gained a normative **§4.6 Chart hover floating window — standard**, replacing the per-chart RECOMMENDED hover note in §4.2. One `.chart-tip` / `.chart-snap` component now covers every chart board (C1–C4) and the KPI cards: tokenized visual contract (removes the C2 hard-coded dark `.c2-tip`), header/body/footer layout with unique series colour tokens and a unified footer, cursor-relative 4-edge clamping, a below-card KPI variant, `cursor:crosshair` affordance, a required touch tap-to-show variant, optional snap line, `data-points`/`data-geo` plumbing, opacity-only motion with update-on-change, accessibility (focusable board + `aria-describedby` + show on focus), `overflow:visible` containers, and a single delegated binder. §4.2's hover note now points to §4.6 and is normative. Re-synced to the harness bundled spec; issues I080–I091 logged. |
| 1.49 | 2026-10-30 | CodeBuddy (AI) | §4 gained a normative note correcting the table-border model: inside a `.c-card`, the table's own `.ds-split` border is the single external border and the card must not add a second (`.c-card:has(.ds-split){border:0}`). This fixes the I077 regression where `.c-card .ds-split{border:0}` deleted the table's border and left only the card border. Engine + standalone CSS updated; issue I078. Re-synced to the harness bundled spec. |
| 1.48 | 2026-10-30 | CodeBuddy (AI) | §4 gained a normative note: a `.ds-split` table inside a `.c-card` keeps the §4 rounding (remove only the redundant border, never `border-radius:0`), fixing the square-corner regression on card tables (C2 per-discipline, Validation, Forward and Overdue) — issue I076. Re-synced to the harness bundled spec. |
| 1.47 | 2026-10-30 | CodeBuddy (AI) | §4 gained a normative rule: every view MUST wrap its top-level output in `activePanel()` because the page renderer adds no panel wrapper; a bare `.c-card` silently loses the §4 edge border, title and Panel N number. Root cause of the recurring panel-chrome regressions (I019 / I066 / I067); fixes the forwardAndOverdue regression (issue I075). Re-synced to the harness bundled spec. |
| 1.46 | 2026-10-30 | CodeBuddy (AI) | §4 gained a normative rule for the Forward and Overdue tables (I074): every such table shows Document No. and Title together, with column widths that show the full values without truncation (horizontal scroll when narrow). The Horizon control is a segmented toggle (1–4 weeks) that matches the lane-filter button style; the Look-Ahead view shows a subtitle with the active window. Re-synced to the harness bundled spec. |
| 1.45 | 2026-10-30 | CodeBuddy (AI) | §4 gained two normative layout rules, driven by the Forward and Overdue page (I073): (1) a data table and its controls share one `.c-card` — the inner border wraps the table plus its control cluster, extending the chart-card contract (§4) to tables; (2) every on-screen `.ds-table` MUST offer a right-aligned `⤓ CSV` that exports exactly the visible rows (UTF-8 BOM). Re-synced to the harness bundled spec. |
| 1.44 | 2026-10-29 | CodeBuddy (AI) | §4.5 (Validation panel) rewritten to a normative layout standard, driven by I072 (SUB Validation panel). The panel organises as: one `.v-summary` flex row (count + severity chips + lighter meta line), each of the two tables in its own `.c-card` (inner `.ds-split` border removed, `.c-card .ds-split{border:0}`), a `.table-head` row aligning each card title with its tool cluster, a clear `Showing X of Y rows` count, and default column widths that give the Rules Description (≈420 px) and Issues Message (≈360 px) / Value (≈130 px) the most room. The panel-level CSV was removed (the per-issue table carries `⤓ CSV`); the stale `<details>` collapsible and `#vmap`/`#vref` references were deleted. `table()` gained an optional `opts` (`widths`, `title`). |
| 1.43 | 2026-10-29 | CodeBuddy (AI) | §4 gained a normative rule: a panel reached via the left-sidebar page links MUST show its content directly and MUST NOT wrap its content in an in-panel disclosure toggle (for example a native `<details>` / `<summary>` element), because the sidebar already controls which panel is visible. When a panel must collapse, use the panel-level Collapse `−`/`+` toggle (§4), not a content disclosure. Driven by I071 (SUB Validation panel). |
| 1.42 | 2026-10-29 | CodeBuddy (AI) | §7.1 gained **selection semantics** (normative), because the chrome rules were not enough. A dimension MUST open with every value ticked except documented exclusions. A blank cell is a selectable value shown as `(blank)`. An **empty tick set filters every row out** — an absent set is the only "no filter" state. A tick applies at once and MUST NOT close the panel; an outside click or `Escape` MUST close it. Found while fixing I070: three of the five dimensions started with an empty set, so the panel showed nothing ticked while the dashboard filtered nothing, and un-ticking every value changed no row. Compliance checklist gained row 17. |
| 1.41 | 2026-10-29 | CodeBuddy (AI) | §4.4 `.drill-cell` selector raised to `.ds-table .drill-cell`. The base rule `.ds-table th, .ds-table td` (specificity 0,1,1) sets `overflow:hidden` and `text-overflow:ellipsis`; a bare `.drill-cell` (0,1,0) loses the cascade, so the revision 1.40 `text-overflow:clip` never applied and the 4 px padding was dropped too — the cell kept 10 px padding and the 24 px button overflowed a 12 px content box. Measured in Chromium before the fix: `textOverflow:"ellipsis"`, `clientWidth:32`, `scrollWidth:53`. The block now uses the higher-specificity selector, which beats 0,1,1. A normative sentence records the requirement. |
| 1.40 | 2026-10-29 | CodeBuddy (AI) | §4.4 `.drill-cell` MUST NOT paint a truncation mark. The cell is 32 px with 4 px padding on each side, so its 24 px content box fits the 24 px `.drill-btn` exactly. `.ds-table` cells inherit `overflow:hidden` + `text-overflow:ellipsis`, so the sub-pixel remainder drew a clipped ellipsis (two dots) after the chevron in every Submittals row. The normative block now carries `overflow:hidden;text-overflow:clip`, and a normative bullet records that the drill cell truncates no text and therefore shows no ellipsis. Found in the SUB Submittals panel (owner screenshot). |
| 1.39 | 2026-10-29 | CodeBuddy (AI) | §4.4 drill-down standardized and reconciled with §7.1 B4. An expandable row is `.expandable`; the expand control is a real `<button class="drill-btn">` (an `.icon-btn` variant) carrying `aria-expanded` + `aria-controls` and a `.drill-chev` glyph rotated 90° when expanded (no glyph swap). The sibling detail row is `.sub` with a `.sub-inner` wrapper (§7.2.0). The whole row is a pointer shortcut; the button is the accessible control. Accordion (one open), keyboard Enter/Space, delegated listener. Tokens standardized: `--line` (hairline), `--soft` (detail background + hover), `--muted` (chevron), `--navy` (chevron hover), `--blue` (focus ring); no hard-coded colours. Normative classes added to §7.2.0. |
| 1.8 | 2026-10-24 | Codex | Made `ui/`, `data/`, and `output/` optional and made module paths project-defined; aligned the harness contract. |
| 1.9 | 2026-10-24 | CodeBuddy (AI) | Adopted the MDL shell model: §3.1/§3.2/§3.6 now define a two-row header (navy title bar + white menu bar) + navy left navigation sidebar; dropped the 48 px icon bar and the right sidebar; moved Settings/Help to the menu bar / modal; use the updated `AGENTS.md` §18.2 shell markers (`titlebar`, `menubar`, `left-sidebar`, `content`, `statusbar`). Default theme is light. |
| 1.30 | 2026-10-27 | CodeBuddy (AI) | §4.2 card-control rule reconciled with the C3 Breakdown panel:
| 1.31 | 2026-10-27 | CodeBuddy (AI) | §4.2 C3 Breakdown further refined:
| 1.32 | 2026-10-27 | CodeBuddy (AI) | §4.2 C3 Breakdown PNG/Copy restored for the Bar cards:
| 1.33 | 2026-10-27 | CodeBuddy (AI) | §4.2 C3 Breakdown summary table gained a Download button: the shared `.c3-summary` table (below the two cards) renders a header with a `⤓ Download` control that exports the current Month / Break-down-by rows as `breakdown-table.csv` (UTF-8 BOM, `.ds-gut` scrollbar spacer skipped). This complements the per-card PNG/Copy (I058). after the I057 div-grid redesign the per-card PNG/Copy buttons serialized a non-existent `<svg>`; they now rebuild the card (bars + vertical axis labels + attached table + legend) as a self-contained native SVG (rects + text) so the existing raster/copy path works for both Bar and Pie views. each card lists the full MDL discipline set (and all submitters) even when a month is zero, and draws its bars inside one aligned CSS grid whose columns also carry the vertical axis labels and an attached per-card data table (Submissions = Total Plan / First Submission / Resubmission / Under Review; Approval Status = the codes). The shared summary table is kept. This extends revision 1.30's shared-control exception. Month + Break-down-by are one shared cluster above the two cards (panel-owned), only PNG/Copy per card; the Pie view shows two donut cards (Submissions, Approval Status), not a consolidated two-ring card. This is the documented exception to "every card owns its controls" for that panel. |
| 1.34 | 2026-10-28 | CodeBuddy (AI) | §4.2 C3 Breakdown bars now carry a y-axis with grid lines + numbers, matching the C1 S-curve and C2 stacked-area panels: each card draws 5 horizontal grid lines at 0 / 25% / 50% / 75% / 100% of a nice maximum (niceCeil of the largest category total), the bars are scaled to that same max, and the numeric tick labels are right-aligned in the metric-label column and flush against the bars (no gap; aligned with the table below). Zero-discipline categories still show the empty grid. The Pie cards are exempt. Decision recorded as I060; review sample `sub/ref/sample-c3-grid-lines.html`. The harness bundled spec (`harness-layout/spec/Dashboard-UI-Design-Spec.md`) was re-synced from this file. |
| 1.35 | 2026-10-28 | CodeBuddy (AI) | §4.2 C2 Submission Flow Funnel layout: the funnel is a **vertical shape to the right of a per-Discipline table** (table left, funnel right). Its **top aligns with the first discipline row** and its **bottom — a cube block for Approved — aligns with the last discipline row** (the table header and Total row are outside the funnel span). Five stages top→bottom: Planned Deliverables → Submitted for Review → Under Review → AWC → Approved. Band widths use **square-root compression** so a large ratio between stages does not make a small stage a razor-thin sliver. Stage label is "Under Review" (not "In Review"); AWC is its own stage, separate from Approved. See `sub/ref/C2-Funnel-Sample.html`. |
| 1.36 | 2026-10-28 | CodeBuddy (AI) | §4.2 C2 Funnel refined per owner review of the first live render: stage names and values moved to a **left label gutter** (right-aligned beside the bands, theme-aware text color) so long names like "Submitted for Review" never clip against a narrow band; the separate legend row was removed (every stage is labeled beside its band); the Approved base is now a **solid square block** (92 px, owner request) instead of a sliver-wide 3D cube whose label overflowed. Funnel column widened to 350 px. Fixed I064 first: the funnel had never rendered because the stage key `underReview` did not match `c2.funnel`'s `inReview`, so every path coordinate was `NaN`. Logged I065; workplan changelog 2.43. |
| 1.37 | 2026-10-28 | CodeBuddy (AI) | §4 Panel border now wraps **only the content** (charts / tables / filters / buttons) inside a new bordered `.panel-body`; the title row — with Help `?` and the Collapse `−` toggle — sits **outside** the border (owner review 2026-10-28). The corner `Panel N` number moved onto `.panel-body` (inside the border). The §4 diagram, Surface bullet and CSS block were updated; `.panel` is now a borderless section. Driven by I066; workplan changelog 2.44. |
| 1.38 | 2026-10-28 | CodeBuddy (AI) | §4 Panel model corrected per owner review (supersedes 1.37). The panel edge (same `--surface` background + 1px `--border` + radius + shadow + padding) is restored on `.panel`, and the title row — title, Help `?`, Collapse `−` — sits **inside** that edge (MDL panel model: every panel shares the same background and edge). Each individual graph now sits in its own bordered `.c-card` (or C3's `.c3-card`) **inside** the panel, so multiple graphs are visually separated; the inner border wraps only a graph plus its own controls, while the panel-level Help/toggle stay in the header. Removed the I066/1.37 borderless-`.panel` model. Engine: `render.js` keeps the header inside `.panel`, `schedulePerformance` and `submissionFlow` wrap their graph in `.c-card`, and the `Panel N` number moved back to `.panel`. Logged I067; workplan changelog 2.45. |
| 1.39 | 2026-10-29 | CodeBuddy (AI) | §4.1 clarified the chart-card rule: an inner `.c-card` / `.c3-card` border is required only when a panel holds **more than one graph** (to separate them) or to group a graph with its own controls (C2's single `.c-card`); a **single-graph** panel (C1 S-curve) uses the panel edge alone, so its redundant inner border was removed (I068). No change to the panel-edge rule (rev 1.38). Driven by I068; workplan changelog 2.46. |
| 1.29 | 2026-10-27 | CodeBuddy (AI) | §3.4 Responsive layout enhanced with §3.4.1 Panel size fits the screen. Panels MUST follow the content width at every screen scale (including Control + scroll zoom) and MUST NOT keep a first-render pixel width; the KPI panel (auto-fit grid, no fixed widths) is the reference. Scope is panel size only; inner cards may keep a fixed width by requirement (for example, a constant bar width). |
| 1.28 | 2026-10-25 | CodeBuddy (AI) | §4.2 S-curve clarified from the Submittal C1 re-review: the chart-card board is a 1 px border around the whole chart component (control cluster + plot), not an in-plot rectangle, so the one-board / one-card-border rule is unambiguous; the y-max MUST use the raw visible maximum with a small headroom pad (~3%) and MUST NOT be rounded up to a power-of-ten step, so the curves fill the chart height like the MDL reference. Workplan D35 / §7 now include the Forecast bar (`fNew`). |
| 1.27 | 2026-10-25 | CodeBuddy (AI) | §4.2 S-curve hardened from the Submittal C1 review: a Month / Quarter / Year time-grain toggle MAY be offered (rebuckets labels, bars and the cumulative curve); the period window MAY be a bar / brush selection that wraps below when narrow; the control cluster is right-aligned by default and the period selection MAY be left-aligned with the filters (grain, Bars, series multi-select) preceding the exports (PNG, Copy) on the right; the combined-chart legend SHOULD be in-SVG at the bottom (not an HTML `.legend`); dense x-axis labels MAY be inclined (rotated ~40°) hugging the axis with the legend kept clear; and a hover snap line with a floating window is RECOMMENDED. The PNG / Copy, one-board / one-card-border, absolute-cumulative, Start / Today and shared-scale rules were already normative. |
| 1.26 | 2026-10-24 | CodeBuddy (AI) | §4 panel chrome made enforceable. The title row now has its own element — the 10 px gap belongs to the row and the `h2` is `margin:0` — because the sketch previously put the flex on the `h2`, which only works when the buttons sit inside the heading. Four rules added: **numbers follow DOM order, assigned after render** (numbering from construction order produced `1, 2, 4, 3`), with the `::after` badge gated on `[data-panel]` so an unnumbered sub-panel does not render a bare `Panel`; **nested sub-panels inherit the parent's number and show no badge**; **the panel margin yields to a grid gap** (`0` inside a grid that sets `gap`, or the spacing doubles); and **the collapse state outlives the element** — it MUST be persisted in view state, keyed by panel name, and re-applied on render, or a filter change silently re-opens the panel. The sketch CSS is updated to match. |
| 1.25 | 2026-10-24 | CodeBuddy (AI) | The title-bar page label is larger and unstyled. §3.1 revises the active-page rule: the label is now **16 px / 600 at `line-height:1.2`**, one step below the 17 px project title, and is **plain text with no background, padding, border or radius** — a page indicator rather than a badge or pill. Version 1.24 had put it at the menu-bar control scale (12 px / 600) inside a translucent pill. |
| 1.24 | 2026-10-24 | CodeBuddy (AI) | The content toolbar is removed, and the page name and layout toggle move into the shell. §3.3 adds a normative rule: there is no content toolbar — a dashboard MUST NOT render a strip above its panels holding a page heading, subtitle or layout control — and the content zone begins with the optional filter area and then the body. §3.1 adds two rules: **the active page is shown in the title bar** — right-aligned on the bar's 20 px padding, at 12 px / 600, updated on every selection change, announced with `aria-live="polite"`, and not repeated as a heading in the content area — and **the layout toggle lives in the menu bar** — an icon control at the right end after the filter group, never in the content area, using the compact 8 px padding. §3.1's shell markers no longer require a `toolbar` zone. |
| 1.23 | 2026-10-24 | CodeBuddy (AI) | The left-panel width is sized to its menu titles. §3.2 adds a normative rule: `--sidebar-w` is 160 px, derived from the widest title — "Forward Plan" measures 91 px at 14 px / 400, which with the button's 12 px horizontal padding and the panel's 10 px padding needs 135 px, plus 25 px of slack. A dashboard whose menu titles differ MUST derive the width the same way and MUST NOT let a title wrap or clip; resizing MUST clamp at the width where the widest title still fits, 140 px here. |
| 1.22 | 2026-10-24 | CodeBuddy (AI) | The left panel holds menus only. §3.2 adds a normative rule: the left sidebar MUST contain only menu items — the page links, then Settings and Help pinned to the bottom with `margin-top:auto` — and MUST NOT contain a collapse toggle (which belongs in the menu bar), section titles, or divider rules; its resizer MUST remain. §3.1 now records that the `data-shell-toggle="left-sidebar"` control sits in the menu bar rather than in the sidebar, and §3.2 no longer lists Help among the menu-bar contents. |
| 1.21 | 2026-10-24 | CodeBuddy (AI) | The sidebar toggle is compact. §3.1 adds a normative rule: the left-panel toggle is one glyph, so it MUST NOT carry the 14 px horizontal padding of a text control — it uses 8 px horizontally, the gap after it is 8 px rather than the menu bar's 12 px, and it keeps the menu-bar control's 32 px height and 12 px / 600 type, with its left edge on the bar's 20 px padding aligned with the title-bar logo. |
| 1.20 | 2026-10-24 | CodeBuddy (AI) | Title-bar logo and menu-bar control metrics, measured against MDL. §3.1 adds two normative rules: **title-bar logo** — the logo is 36 px tall, MUST NOT shrink (`flex-shrink:0`), and the brand group uses a 12 px gap — and **menu-bar control metrics** — a menu-bar button is 12 px / 600 at `line-height:1.2` with `min-height:32px` and `padding:7px 14px`, while a filter trigger is 12 px / 600 at `line-height:normal` with `min-height:32px` and `padding:7px 12px`; both render 32 px tall. |
| 1.19 | 2026-10-24 | CodeBuddy (AI) | Title-bar and menu-bar spacing. §3.1 adds two normative rules: **title-bar spacing** — the rows stack in a `.ttl-stack` column with a 2 px gap, the project title is 17 px / 600 at `line-height:1.2`, and a dashboard MUST NOT substitute its own line height for the stack — and **menu-bar gap** — 12 px between groups, 8 px inside each group, plus a 6 px left margin on the Warnings toggle. §6 type scale gains two normative rows: title-bar project title 17 px / 600 and title-bar dashboard title 12 px / 500. |
| 1.18 | 2026-10-24 | CodeBuddy (AI) | Menu-bar typography and alignment. §3.1 adds two normative rules: **menu-bar alignment** — the left-panel toggle, the load action and Export are left-aligned, and everything else (filter triggers, Search with its popover, Warnings) is right-aligned, mirroring MDL's `justify-content:space-between` — and **menu-bar type is bold** — every control in the menu bar MUST be 600, never the default body weight. §6 type scale gains a normative row fixing the menu-bar control at 12 px / 600. |
| 1.17 | 2026-10-24 | CodeBuddy (AI) | MDL parity for the filter chrome. §7.1 **B1** no longer requires a caret glyph or a visible border: the trigger is text plus a count badge, and it is **borderless in the menu bar** (the base control keeps 1 px `--border`, which the menu-bar chrome strips). §7.1 **B3** replaces the `.chips label` pill with MDL's structure — an `.tf-all` `All <dimension>` master, a hint, a divider and `.tf-item` value rows — and the grammar table, the global-dimension paragraph and the normative class list now name `tf-all` / `tf-item` instead of `chips`. §6 type scale: the filter menu row is 12 px (was 11 px) and a new normative row fixes the count badge at 10 px / 700. |
| 1.16 | 2026-10-24 | CodeBuddy (AI) | Corrected the shell composition for MDL parity: §3.1 now states the menu bar holds the actions group (the highlighted load primary plus Export), the global filter group (triggers, Search with its popover, Warnings) and Help, that Settings is NOT in the menu bar but a menu in the left side panel, that the menu bar MUST NOT wrap to a second row (the filter group scrolls horizontally instead), and that the load control MUST be the one highlighted `.btn-primary` control. §3.2 now states the left side panel holds page links and Settings and MUST NOT hold workbook-loading controls. |
| 1.15 | 2026-10-24 | CodeBuddy (AI) | Added §6 Typography (normative): one shared `--font-ui` stack and one shared type scale (body 13/1.45, panel h2 13 uppercase, chart-card h3 13/700, KPI value 22/700, KPI label 10 uppercase, icon button 13/600, filter trigger 12/600, filter chip 11, single-select 12/600, title-bar meta 11, system banner 12, severity chip 11/700). Added §7.1: global dimensions MUST be multi-select and MUST use B1 `.tf-btn` + B3 `.chips label` with a count badge and an `All <dimension>` master toggle; B5 is reserved for non-row-filter pickers and the B6 panel-local filter; the menu-bar filter group MUST contain the triggers, Search and Warnings; and the classes `tf-btn` / `chips` / `tf-panel` are normative. |
| 1.14 | 2026-10-24 | CodeBuddy (AI) | Added §3.1 title bar rows (mandatory): the title bar MUST show three rows rendered from model metadata — project title, dashboard title(s) joined with ` · ` when the two workbooks differ, and project start plus as-of date. Added §3.7: workbooks MUST be identified by the `Dashboard Title` in their Code sheet, matched against the contract, never by file name; a selection MUST be inspected in full and committed only when every check passes, rejecting the whole selection (non-readable file, no Code sheet, no dashboard title, unmatched title, same type twice, or differing `Project Title`) with the reason shown and no partial update; the check SHOULD read the Code sheet only. |
| 1.13 | 2026-10-24 | CodeBuddy (AI) | Added §3.9 standalone delivery (mandatory): a dashboard is one self-contained HTML that MUST run from `file://` with no web server — no `fetch` of local files, no cross-file ES-module `import`, stylesheet / config / engine / images inlined, no local `href` or `src` references; source modules stay separate for the test harness. Added conformance assertion 15 in §8.2. |
| 1.12 | 2026-10-24 | CodeBuddy (AI) | Broadened the §7.1 casing rule to **control label casing**. It now names the applicable cases (button labels; a `<label>` rendered as a button; form-control labels for checkbox, radio and select; navigation and menu items) and the excluded cases (prose, sentences, hints, status messages, placeholders, data values, `title` / `aria-label` wording). |
| 1.11 | 2026-10-24 | CodeBuddy (AI) | Added §7.1 button label casing (mandatory): every visible button label MUST use title case, capitalising the first letter of every word. Added §3.7: the welcome instruction card MUST NOT carry a label prefix such as `What this does —`; show only the instruction text. |
| 1.10 | 2026-10-24 | CodeBuddy (AI) | Hardened §3.7 (initial / file-loading state): the welcome is an MDL-style full-screen overlay that hides dashboard chrome until load; fixed-proportion welcome surfaces (file drop area, welcome card) SHOULD use the golden ratio (1 : 1.618); the load buttons MUST live inside the file drop area; and the welcome MUST NOT hardcode a project title (the project/dashboard title renders from the loaded model after load). |
| 1.7 | 2026-10-24 | Codex | Defined stable shell markers and aligned the harness with project-local dashboard assets. |
| 1.6 | 2026-10-24 | Codex | Made dashboard UI assets project-local and aligned the harness contract with the shell spec. |

**Version**: 1.27
**Date**: 2026-10-25
**Last revised**: 2026-10-25 — Dashboard assets are project-local; `common/` does not apply. A dashboard does not require `ui/`, `data/`, or `output/` folders. Each dashboard workplan defines module and configuration paths. The shell geometry and behavior follow `AGENTS.md` §18.2. The warning area stays inside the content area. Prior (2026-10-22) — **generalised**: the spec is now a project-neutral standard. Every
dashboard-specific detail — the two-row header instantiation, the per-dashboard migration state, the
enforcement posture, the legacy class aliases and their migration dates, the regression/issue history —
moved to the owning dashboard's workplan, with a pointer back to the clause it satisfies. Added §0
**Definitions** and §8 **Conformance & Testing** (two-layer check model, 14 required assertions,
enforcement posture, conformance record, definition of done) plus §9 **Adopting this spec**. Prior
(2026-10-21) — §7.2.15 **standardised**: the split header is now required for **every** bounded data table (`.tableScroll`), single-row headers included, and a sticky `<thead>` inside a table scroller is retired; §4.3's container rule aligned to match. Driven by the vertical-scrollbar standardisation review. Later the same day: §7.2.15 invariant 5
clarified — "unavoidable" horizontal scrolling is now defined objectively (Σ minimum column widths >
available width), so the fit requirement is testable. Prior (2026-10-19): §7.2.7 extended with the no-duplicate-filter-dimensions rule (overall requirement; each dashboard records its own dimension list in its workplan, §1). Prior (2026-10-19): §7.2.7 added (Filter population rule: two-tier global-first → panel cascade); S4 Derive row and the two-row header variant hardened to state the cascade. Driven by the filter-behaviour review.
2026-10-18 — §7.2.15 added (split-header / fragment-pairing contract, six normative
clauses) and `.vheadtab` + `.ds-gut` added to the normative class table. Driven by the split-header review.
**Owner**: UI Design
**Applies to**: every internal control-center dashboard — present and future

> This document is the shared source for dashboard layout, components, and behavior. Dashboard pages
> use project-local CSS and JavaScript. `AGENTS.md` §18.2 defines the shell geometry and behavior.
>
> **It is a general standard, not a project log.** This spec states *what any dashboard must do*.
> Anything that belongs to one dashboard — its status vocabulary, its dimension list, its migration
> state, its issue history — lives in **that dashboard's own workplan**. A reference to a specific
> dashboard in this document is either an illustration of a general rule or a pointer to the
> workplan; it is never a rule that applies to one dashboard only.

---

## 0. Definitions

These terms are used normatively throughout this spec.

| Term | Meaning |
|---|---|
| **Dashboard** | One internal control-center application (its own page, pipeline and workplan). |
| **Workplan** | The dashboard's own document: its data contract, module specs, decisions and its **spec-conformance record** (which spec clauses it satisfies, how, and any deviation). Cited from §1. |
| **Panel** | The atomic page unit (§4). The CSS class name is free. |
| **Bounded data table** | A long list rendered inside a scroller with a fixed max-height — never an open-ended list (§4.3). |
| **Split header** | A `<thead>` rendered outside the scroll container as a thead-only fragment, so the vertical scrollbar starts below the header (§7.2.15). |
| **Global dimension** | A filter dimension exposed in the global filter area whose selection re-derives the shared set for **every** panel (§7.2.7). Which dimensions are global is a per-dashboard decision. |
| **`active`** | The single reduced working set produced by S4 Derive after the global dimensions are applied. Every panel derives from it (§3.8, §7.2.7). |
| **Panel filter** | A control that narrows one panel's rows, applied in S5 on top of `active`. It can only narrow further (§7.2.7 pt 2). |
| **Panel-local filter** | A panel filter that affects **only the tables inside its own panel** — never KPIs, charts, the matrix or another panel (§7.2.7 pt 6, §7.1 B6). |
| **Layout control** | A control that changes *how* something is presented (which columns are shown, which sort applies) and never which rows are returned. It must not use filter chrome (§7.1 B7). |
| **Chrome** | The visual treatment of a control — its shape, badge and emphasis. Chrome must let the reader tell a row filter from a layout control (§7.1 B). |
| **Conformance check** | An automated assertion that a rendered dashboard satisfies a normative clause (§8). |
| **App shell / Layout shell** | The root container of the application. It holds the title bar, menu bar, left sidebar, content zone and status bar (§3.1). |
| **CSS grid tracks** | The columns and rows of a CSS grid. They are set by `grid-template-columns`, `minmax()` and `fr` (§3.4.1, §4.2, §4.7). |
| **Flow container** | A one-dimensional flex container. It aligns toolbars, header rows and control clusters (§3.1, §4.1). |
| **Gutter / Spacing scale** | The fixed whitespace between grid tracks and panels: 14 px between top-level panels, 16 px between chart cards (§4.1, §4.7). Every gap is a named token from §6; no rule hard-codes a gap value (§6, §4.2 rev 1.80). On the `Breakdown` page these are `--panel-gap`, `--panel-pad`, `--panel-title-gap`, `--c3-card-pad`, `--c3-tool-pad`, `--c3-tool-gap` and the derived `--c3-plot-table-gap` (§4.2 rev 1.80). |
| **Attached table** | A data table drawn inside the same chart board as its chart. Its columns share the chart's X positions (§4.1, §4.2). It is a **Semantic table** and is not a **Bounded data table**. When such a table is present, hovering a chart column or an attached-table column MUST highlight the same logical column in BOTH the chart and the table at the same time (§4.2 rev 1.74). The shared chart-column state MUST include ONE hidden column band and ONE hidden dashed centre line, and MUST NOT draw a border or inset ring on active column cells (§4.2 rev 1.75). |
| **Breakdown page (rev 1.76)** | A dashboard page reached from the `Breakdown` sidebar item, directly below `Overview`. It holds exactly THREE independent top-level panels: `Submissions`, `Approval Status` and `Breakdown Summary`. Each panel owns its own `c3Month`, `c3Dim` and control cluster; each chart panel also owns `c3View`. The two chart panels sit side by side in row 1 and the summary panel spans row 2 (§4.1, §4.7). |
| **Others (rev 1.76)** | The discipline label of a Document Submittal Log row whose `Document No.` has no MDL plan row (`V-29` orphan). It is a normal dimension value: it appears in the Discipline filter, in the C3 Breakdown dimension list and in the Breakdown Summary table, and its rows count in every measure. It MUST NOT be read as a data-quality rule. A missing `Submitted By` value keeps the separate `Unknown` fallback. |
| **Semantic table** | A native `<table>` with `<caption>`, `<colgroup>`, `<thead>`, `<tbody>` and `scope` on its header cells (§4.2). |
| **Native vs ARIA structures** | Tabular data MUST use a native `<table>`. ARIA roles and attributes are allowed only on non-tabular graphics: `role="img"`, `aria-label`, `aria-describedby` (§4.2, §4.6, §7.2.4). ARIA table roles MUST NOT be used. |
| **Scoping & hierarchy** | The `scope="col"` and `scope="row"` bindings that link a header cell to its column or row (§4.2). |
| **Reflow / Responsive breakpoint** | The rearrangement of panels and cards when the viewport or container width changes (§3.4, §3.4.1). |
| **ResizeObserver** | The mechanism that observes a container width change and triggers a chart redraw or a layout recalculation (§3.4.1, §4.2). |
| **Scroll boundary / Overflow** | The rule that wide inner content scrolls inside its own card, not the page (§3.4.1, §4.2). |
| **Axis scaling & coordinates** | The mapping from data values to SVG positions: Y-axis ticks, X-axis intervals (`xc(i) = (i + 0.5) * W / N`) and `viewBox` boundaries (§4.2). |
| **Export & serialization** | The rebuild of a chart card as a self-contained native SVG of `<rect>` and `<text>` for PNG / Copy, with no `<foreignObject>` (§4.1, §4.2). |
| **Accessibility tree** | The browser representation that assistive technology reads. `display:contents` can remove table elements from it (§4.2). |
| **Normative rule / Assertion** | A MUST or MUST NOT clause, and the automated check that enforces it (§8, §8.2). |
| **Traceability & citations** | The § references, revision rows and workplan citations that link an implementation to its rule (§1, §4.2, §8.2). |

---

## 1. Scope & Governance

- **Shell rules.** Every dashboard follows the shell geometry and behavior in `AGENTS.md` §18.2.
  Dashboard pages are an exception to §18.1's `common/` asset dependency: each project owns its CSS
  and JavaScript. The dashboard project layout in this spec and its workplan also overrides the generic
  folder list in `AGENTS.md` §6 for `ui/`, `data/`, and `output/`; those folders are optional. The dashboard
  spec and harness define the common contract.
- **Project-local UI source.** Each dashboard implements this spec's tokens and shell behavior in its
  project-local assets. The workplan defines their paths. A `ui/` folder is optional. Keep token values,
  shell dimensions, and component behavior aligned with this standard. Do not add a repository-level
  `common/` dependency for dashboards. Test every UI theme.
- **Layout and component rules are mandatory** (§3–§5, §7), subject to the priority rule above.
- **Status vocabularies are per-dashboard.** Each dashboard defines its own status text and
  symbols and records them in its own workplan. What is *shared* is only the **principle**:
  every status carries **Icon + Text + Colour**. Do not copy another dashboard's status labels.
- **Dashboard-specific content belongs in the workplan.** Whenever this spec says a dashboard
  *may* choose, or names a dimension, a label, a migration step or an enforcement posture,
  the choice is recorded in that dashboard's workplan — not here. The workplan then cites the
  spec clause it satisfies, so the two documents stay traceable to each other.
- **Applicability is explicit.** Domain examples (such as package counts, project-start dates, or a Code sheet) apply only when the dashboard has that data. The workplan marks each inapplicable rule as N/A and names the source contract.
- **Philosophy is fixed** (§2). Divergence requires a documented design decision.

---

## 2. Design Philosophy

> Professional Document Control System **first**, Dashboard **second**.

**Style**: Clean Industrial · Swiss Modernist · Enterprise Application

**Influences**: Microsoft Project · Primavera P6 · SharePoint Modern · Engineering
Document-Control Systems · Enterprise Project-Management Platforms

**Design goals** — these guide design; they are not release gates unless a workplan defines a review.
- High information density. Aim to make overdue items and exceptions easy to find.
- Readable during a full work day.
- Accessible controls: use icon + text + colour and meet AA contrast.

**Explicitly avoided**
- Glassmorphism / heavy translucency / blur
- Excessive animation
- Consumer-app styling
- Large decorative charts
- Neon colour themes
- **Apple "Bento" soft-tile aesthetic** (large radii, shadow-only separation, airy
  whitespace) — inappropriate for dense data tools.

---

## 3. App Shell & Layout Architecture

### 3.1 Shared application shell
Every dashboard MUST use the shell in `AGENTS.md` §18.2 (MDL two-row header + left navigation
sidebar): a navy title bar, a white menu bar, a collapsible/resizable navy left sidebar, a
scrollable content area, and a full-width navy status bar. There is no 48 px icon bar and no
right sidebar; primary navigation lives in the left sidebar, and Settings / Help / Detail live
in the menu bar or modal dialogs. Implement the shell in project-local UI assets.

For repeatable automated checks, shell zones MUST carry these stable attributes:
`data-shell="titlebar"`, `menubar`, `left-sidebar`, `content`, and `statusbar`. The `content`
zone MUST contain `data-shell="filter-area"` (optional) and `body` in that order, and MUST NOT
contain a `toolbar` zone (§3.3).
These attributes identify structure; they do not prescribe CSS class names. The left sidebar
control MUST use `data-shell-toggle="left-sidebar"` — that control sits in the **menu bar**, not in
the sidebar itself (§3.2) — and its resizer MUST use `data-shell-resize="left-sidebar"`. If a warning area is present, it MUST use
`data-shell="warnings"` and remain a descendant of the content zone.

- **Title bar rows (mandatory).** The title bar MUST show three rows in this order, rendered from the
  loaded model's metadata and never from static text:
  1. the **project title**;
  2. the **dashboard title(s)** of the loaded workbooks — when the workbooks carry different titles,
     show both, joined with ` · `; omit this row when no dashboard title is available;
  3. the **project start date** and the **as-of date**.

  This mirrors MDL's `.ttl` / `.sub` / `.meta` block.
- **Title-bar spacing (normative).** The three rows stack in a `.ttl-stack` column with a **2 px**
  gap, as MDL's does. The project title is 17 px / 600 with `line-height:1.2`; the dashboard-title
  row is 12 px / 500 and the date row is 11 px / 400, both at the body line height. A dashboard MUST
  NOT substitute its own line height for the stack — setting 1.25 there made the title bar 70 px
  against MDL's 78 px.
- **Title-bar logo (normative).** The logo is **36 px** tall and MUST NOT shrink (`flex-shrink:0`),
  and the brand group holding it uses a **12 px** gap, as MDL does.
- **The active page is shown in the title bar (normative).** The title bar MUST show the currently
  selected left-panel page, **right-aligned** — the bar is `justify-content:space-between` with the
  brand group on the left and this label on the right, sitting on the bar's 20 px padding. The label
  MUST be **16 px / 600 at `line-height:1.2`** — one step below the 17 px project title, so the two do
  not compete — and MUST be **plain text, with no background, padding, border or radius**. It is a
  page indicator, not a badge or a pill. The label MUST update whenever the selection changes and MUST
  announce the change with `aria-live="polite"`. Because the page name lives here, the content area
  MUST NOT repeat it as a heading (§3.3).
The menu bar holds, **on a single row**: the actions group (the highlighted load primary plus
Export) and the global filter group (the filter triggers, Search with its popover, and the Warnings
toggle). **Neither Settings nor Help is in the menu bar** — both are menus in the left side panel
(§3.2). The active page name lives in the title bar, not in the content area (§3.3). Search opens a
search panel; it is not an inline text field. Use the button, sidebar, layout, and help behavior
defined by this spec.
- **The menu bar is one row (normative).** The menu bar MUST NOT wrap to a second row.
- **The filter group MUST NOT be a scroll container.** Setting `overflow` on it clips the floating
  filter panels that hang below the menu bar, which makes their toggles unreachable.
- **The load action is the primary.** The control that chooses or reloads the workbooks MUST be the
  one highlighted (`.btn-primary`) control in the menu bar, as MDL's "Load Workbook" is.
- **Menu-bar alignment (normative).** The left-panel toggle, the load action and Export are
  **left-aligned**. Everything else — the filter triggers, Search with its popover, and the Warnings
  toggle — is **right-aligned**. This mirrors MDL, whose menu bar is `justify-content:space-between`
  with the actions group on the left and the filter group on the right. A dashboard MUST NOT render
  the filter group immediately after the actions group with no gap.
- **Menu-bar type is bold (normative).** Every control in the menu bar MUST be **bold (600)**, as
  MDL's are. A dashboard MUST NOT render a menu-bar control at the default body weight.
- **Menu-bar gap (normative).** The menu bar uses a **12 px** gap between its groups and **8 px**
  inside each group, as MDL does, and the Warnings toggle carries a further **6 px** left margin.
- **Menu-bar control metrics (normative).** A menu-bar button is 12 px / 600 at `line-height:1.2`
  with `min-height:32px` and `padding:7px 14px`. A filter trigger is 12 px / 600 at
  `line-height:normal` with `min-height:32px` and `padding:7px 12px`. Both render 32 px tall.
- **The panel-layout control lives in Settings (normative).** Where a dashboard offers a
  panel-column layout control, it MUST be a labelled `<select data-setting="layout">` in the
  Settings panel, beside the Theme control. It MUST offer the values `one`, `two` and `three` with
  the visible labels `One`, `Two` and `Three`. The chosen value MUST be saved in `localStorage` and
  applied to `document.body.dataset.layout` on load and on every repaint. The menu bar MUST NOT hold
  a layout toggle, and the content area MUST NOT hold a layout control (§3.3). This rule supersedes
  rev 1.24, which placed an icon toggle at the right end of the menu bar.
- **Panel layout does not control KPI density (normative).** The `one` / `two` / `three` value from
  Settings changes the panel grid only. It MUST NOT change the KPI panel or the KPI card grid. The KPI
  panel is always the first panel and stays full width at every layout value (§5 rev 1.87). A KPI
  density control, where a dashboard offers one, is separate from the Settings panel-layout control
  and MUST use the 6 / 3 / 2 states in §5.
- **The sidebar toggle is compact (normative).** The left-panel toggle is a single glyph, so it MUST
  NOT carry the 14 px horizontal padding of a text control. It uses **8 px** horizontally, and the gap
  after it is **8 px**, not the menu bar's 12 px. It keeps the menu-bar control's 32 px height and its
  12 px / 600 type, and its left edge stays on the bar's 20 px padding, aligned with the title-bar
  logo. A dashboard MUST NOT render it as a full-width text control.

### 3.2 Navigation
Use the left sidebar and menu bar described in `AGENTS.md` §18.2. The left sidebar holds primary
navigation (page links), with Settings and Help pinned to its bottom; it MUST NOT hold
workbook-loading controls — those belong in the menu bar (§3.1). The menu bar holds the actions group
and the global filter group with Search and Warnings. A project may change sidebar or menu content,
but it MUST keep the shell controls and behavior defined by this spec (left-sidebar toggle/resize,
menu-bar filter group, warning area inside content).
- **The left panel holds menus only (normative).** The left sidebar MUST contain **only menu items**:
  the page links, then Settings and Help pinned to the bottom (`margin-top:auto`). It MUST NOT contain
  a collapse toggle — that control belongs in the menu bar (§3.1) — and it MUST NOT contain section
  titles or divider rules between its groups. Its resizer MUST remain, carrying
  `data-shell-resize="left-sidebar"`, because the panel stays resizable.
- **Left-panel width (normative).** The left panel MUST be sized to its menu titles, not to an
  arbitrary fixed width. `--sidebar-w` is **160 px**, derived from the widest title: "Forward Plan"
  measures 91 px at 14 px / 400, which with the button's 12 px horizontal padding and the panel's
  10 px padding needs **135 px**, and 25 px of slack is left on top. A dashboard whose menu titles
  differ MUST derive its width the same way — widest title, plus the item's horizontal padding, plus
  the panel's padding — and MUST NOT let a menu title wrap or clip. Resizing MUST clamp at the width
  where the widest title still fits, which is 140 px here.
- **Left-menu item states (normative, rev 1.85).** A page link in the left panel MUST use four tokens:
  `--nav-bg`, `--nav-bg-hover`, `--nav-bg-active` and `--nav-fg`. No component rule holds a literal
  colour. `--nav-bg` resolves `var(--navy)` and paints the default fill. `--nav-bg-hover` is one
  translucent white veil, `rgba(255,255,255,.1)`, painted over the default fill, so it follows
  `--navy` in every theme. `--nav-bg-active` is the fixed value `#354F6E`, a lighter step of the navy
  family. The active fill MUST NOT be `--blue`: the accent colour stays reserved for actions, so the
  selected item does not look like a primary button. The active state MUST also carry
  `font-weight:600`, because its fill sits only 1.22:1 above the hover fill. `--nav-fg` is `#E8EDF3`
  and paints the item text in every state. Text contrast MUST stay at or above 4.5:1.
- **Breakdown page position (normative, rev 1.76).** The `Breakdown` page link MUST sit directly
  below `Overview` and before `Submittals`. It is a page link, so it MUST use `data-page` and it MUST
  appear in the page whitelist and in the view map. `Overview` MUST keep KPI, C1 and C2 only. The
  title bar shows the page name (§3.3); the content area MUST NOT add a second page heading. The
  `Breakdown` title is shorter than `Forward and Overdue`, so `--sidebar-w:160px` and the resize
  clamp stay unchanged.

### 3.3 Content area
The content area owns a scrollable body and **has no toolbar**. Render panels (§4), dashboard metrics
(§5), and any disclaimer in this body. Keep page-level scrolling disabled as required by `AGENTS.md`
§18.2. Panel grids may change with the available content width. Do not set a fixed page width that
reduces the shell's flexible content area.
- **There is no content toolbar (normative).** A dashboard MUST NOT render a horizontal strip above
  its panels holding a page heading, a subtitle, or a layout control. The content zone begins with
  the optional filter area (the warning surface) and then the body. The page name belongs in the
  title bar (§3.1) and the layout toggle in the menu bar (§3.1), so nothing is lost by dropping it.

### 3.4 Responsive layout
The shell rules define sidebar resizing and collapse behavior. Panel and KPI grids MUST fit the
remaining content width without horizontal page scrolling. Each workplan records its grid breakpoints
and the minimum usable width for its controls. Do not change shell breakpoints or sidebar rules.

#### 3.4.1 Panel size fits the screen (screen scale / zoom)
Panels are the outermost content containers: the `.panel` surface, the `.kpi-grid` and the panel-grid
cells. Their size MUST follow the available content width at every screen scale, including browser
zoom set with Control + mouse scroll. A panel MUST NOT keep a first-render pixel width when the
viewport or the zoom changes. It MUST reflow so it always fills the column it occupies.

The KPI panel is the reference pattern. Its cards use an auto-fit grid
(`repeat(auto-fit, minmax(210px, 1fr))`) with no fixed pixel widths, so the cards fill the width and
reflow as the column narrows or widens. Every other panel MUST reach the same result: a fluid grid or
flex container whose columns are `1fr` (or `auto-fit`), never a hard-coded pixel width that freezes
the panel at its first render.

This rule covers panel size only. It does NOT govern the cards, charts or tables inside a panel. An
inner card MAY keep a fixed pixel width where a requirement demands it (for example, a constant bar
width so values compare across months). Such inner fixed widths are out of scope for §3.4.1; the
panel around them MUST still fit the screen. A panel that contains fixed-pixel inner content (for
example, a split-header table or a fixed-width chart) MUST re-fit that content to the panel width:
either re-render it at the new width or let it scroll inside its own card. The page and the content
column MUST NOT gain a horizontal scrollbar.

**Screen change and window resize (normative, rev 2026-11-01).** The rule applies to every viewport
width change, including dragging the window to a display with a different width or pixel density,
resizing it, collapsing or expanding the sidebar, and browser zoom. The layout MUST reflow without a
reload, MUST NOT keep a first-render pixel width, and MUST NOT gain horizontal page or content
scrolling. Changes that a browser reports only through layout (not a `resize` event) MUST still be
handled: use a `ResizeObserver` on the affected container, not only a `window` resize listener.
Split-header pairs MUST re-sync their column widths after every such change; a chart with a
computed width MUST be redrawn at the new width or scale to its host.

**Minimum usable width.** Below the width where its controls still fit, a dashboard MUST keep every
control reachable: allow the control row to truncate its secondary text or wrap to a second line
rather than overflow the panel. Navigation MUST stay reachable at every width.

This requirement was confirmed in the Submittal dashboard review (panel-fit-to-screen, 2026-10-27):
the KPI panel is the reference, and inner cards with a fixed bar width are explicitly out of scope.

### 3.5 System and configuration notices
Show notices in one warning area inside the content area. The area spans the content area's width and
MUST NOT cover either sidebar. Do not use a viewport-wide fixed bar.

**Placement (normative, rev 2026-11-01).** The warning area is pinned to the top of the content
column, immediately below the menu bar, and **above the filter strip and the scrolling body**. It
MUST NOT sit inside the scrolling body: scrolling the panels MUST NOT move, hide or shrink it. It is
therefore always visible while a notice is present. When the content column has other fixed strips
(filter area, page toolbar), the warning area is the first of them. The area MUST use `role="alert"`
and `aria-live="assertive"`; hide it when empty. Show fatal, warning, and info notices in that order,
with icon, bold code, and message. Use semantic tokens defined in the dashboard project's UI stylesheet.

The area may collapse, but its button keeps the visible label `Warnings` in both states. A count may
appear in a badge. Keep notices and the count while collapsed. Persist the choice with a project-
prefixed local-storage key. Hide the warning area in print. A parse failure appears as a fatal notice.
Formula-error tokens that can corrupt counts appear as one fatal notice per affected column; see
§3.8.4. Row-level data issues belong in the Validation panel (§4.5).

**Addressability (normative, rev 2026-11-02).** The warning area MUST carry the stable id `errBanner`
so that conformance checks and assistive tooling can locate it without guessing at the markup. A notice
area that renders and reads correctly but has no stable hook is invisible to the shared layout harness,
so a missing or hidden banner cannot be detected. The id is part of the contract, not an implementation
detail; the collapse control and the count badge keep their own semantics (see above).

### 3.6 Status information
Use the full-width status bar from `AGENTS.md` §18.2 (~30 px, navy). Its left and right values are
dashboard-specific and MUST be named in the workplan. Do not prescribe package counts, percent
started, or other domain metrics here. The shared status bar owns its height and position. Keep
scrollable content clear of it through the shell layout; do not add a second fixed bar.

### 3.7 Initial and file-loading state (MDL welcome pattern)
A dashboard shows a welcome / first-run screen before the workbooks load. Follow the MDL pattern:

- **Welcome overlay.** The welcome is a full-screen, centred overlay. It MAY hide the dashboard
  chrome (header, menu bar, sidebars, status bar) until the first successful load — MDL builds the
  shell only after load. Do not show dashboard panels or navigation before load. (This supersedes the
  older "keep the shell visible" guidance; the MDL welcome is the reference behaviour.)
- **Ratio.** The welcome fills the viewport (the MDL ratio: width and height are 100% of the
  viewport, fluid, no fixed aspect ratio, no page scroll) per `AGENTS.md` §18.2. Fixed-proportion
  surfaces on the welcome — the file drop area and the welcome card — SHOULD use the golden ratio
  (1 : 1.618) for their width : height.
- **Load controls live inside the drop area.** The file-drop zone MUST contain its action buttons
  (Choose / Load). The drop zone is both the click target and the drag-and-drop target.
- **The instruction card has no label prefix.** The welcome instruction card MUST NOT carry a lead-in
  label such as `What this does —`. Show only the instruction text; bold the file names inside it.
- **Workbooks are identified by content, not by file name.** A dashboard MUST decide which workbook
  is the Master Document List and which is the Submittal Log by reading the `Dashboard Title` entry
  in that workbook's Code sheet and matching it against the expected values in the source contract
  (§3.8.3). File names vary between projects and MUST NOT be used to classify a workbook.
- **A selection is validated before it is applied.** When workbooks are chosen or dropped, the
  dashboard MUST inspect all of them first and commit the new selection only when every check
  passes. It MUST reject the whole selection and change nothing when: a file is not a readable
  workbook; a file has no Code sheet; the Code sheet carries no `Dashboard Title`; the title matches
  no expected value; two files resolve to the same workbook type; or the two `Project Title` values
  differ. A rejection MUST show the reason on the welcome and MUST leave the previous selection
  intact. No partial update is permitted.
- **Inspection reads only what it needs.** The selection check SHOULD read the Code sheet only, not
  the whole workbook, so checking does not pay the cost of a full parse.
- **No hardcoded project title.** The welcome MUST NOT display a project-specific title, because the
  project title is unknown until the workbooks load. Show at most a generic application label. Render
  the real project / dashboard title from the loaded model in the shell title bar after load, never from
  static HTML.
- **File-loading behaviour.** Use the file-loading panel in `AGENTS.md` §18.7: default-path load where
  the project has a default file, local file picker, drag-and-drop, loaded-file list, and active-file
  status. A dashboard may require related files; its workplan must list each required file, selection
  order, and validation behaviour. Put project-specific instructions in the file panel or `ui_help.json`.

### 3.8 Data-Processing Pipeline (mandatory)

Any dashboard that ingests a workbook (`.xlsx`, `.csv`, or similar) MUST follow this single,
predictable pipeline. **Objective: parse once → normalise once → validate once → derive on demand**,
so filter changes are fast (no re-parse) and every aggregation lives in exactly one place (no
duplicate KPI engine).

#### 3.8.0 Module structure requirement

The dashboard UI MUST use separate, importable JavaScript modules. Do not put the whole pipeline in
one HTML file. Load modules with native browser imports. Do not add a bundler, build step, or npm
runtime dependency. A dashboard workplan defines the module paths. A suitable layout is:

```
<project-root>/<dashboard>.html
<project-root>/<workplan-defined-path>/xlsx-reader.js
<project-root>/<workplan-defined-path>/pipeline.js
<project-root>/<workplan-defined-path>/render.js
```

The HTML file is the project entry page in the project root. A dashboard does not require `data/`
or `output/` folders. Use project-local assets and root-relative paths. Serve the
page with the project `serve.py` required by §18.12. Separate modules make each stage testable and make stage boundaries clear. Any
project-specific data-preparation engine may use its declared stack. The HTML layer still follows
`AGENTS.md` §18.1.

#### 3.8.1 Stages

| # | Stage | Module | Responsibility | Input → Output | Runs |
|---|---|---|---|---|---|
| S0 | Acquire | `xlsx-reader.js` | Read raw bytes from the file input; no parsing. | `File` → `ArrayBuffer` | On file open only |
| S1 | Parse | `xlsx-reader.js` | Parse the container into an in-memory workbook (sheets / rows / cells). | `ArrayBuffer` → `workbook` | On file open only. The raw `workbook` is **discarded after S2** — only the normalised model is retained. |
| S2 | Ingest / Normalize | `pipeline.js` | Turn raw rows into a normalised **record table**: typed fields (Date/Bool coercion), `isActive`, and domain-specific fields; build contract/lookup tables and `meta` (project info, today). **No aggregation or KPI math.** Normalization treats a cell as **absent (`undefined`)** when it is blank (empty after `trim`) **or** a spreadsheet formula-error token — see §3.8.4. | `workbook` → `model{ records[], contract, meta }` | On file open only; held in memory for the session. |
| S3 | Validate | `pipeline.js` | Run row-level, **filter-independent** validation rules once. Emits `issues[]` (per-row data problems) and `warnings[]` (system/config notices). | `records` + validation context → `issues[]`, `warnings[]`, `completenessGroup` | On file open only. |
| S4 | Derive / Aggregate | `render.js` | **On demand**, given the current filter/UI state: apply the **global** filters (`Discipline`, `Stage`, `Search`) to `records` to produce the single shared `active` working set (the first gate), then compute **all** aggregations — KPIs, overdue lists, charts, matrix, completeness% — from `active`. Panel-level filters are applied later, in S5 Render, on top of `active` (see §7.2.7). This is the **sole** source of KPI numbers. | `model` + `STATE` → `view{ active, kpis, issues, charts, panels, … }` | On every filter change / render. |
| S5 | Render | `render.js` | Paint DOM panels from `view`. Write-only: never reads from the DOM to make decisions. | `view` → DOM | On every render. Keep the deferred-render rule: repaint once when the filter dropdown closes, not on every in-dropdown toggle. |
| S6 | React-to-filter | `render.js` | Refresh loop. | user action → `deriveView(model, state)` → `render(view)` | On filter change. **Never re-runs S0–S3; the file is never re-parsed.** |

#### 3.8.2 Mandatory pipeline rules

1. **One source of truth for aggregations.** KPI / chart / overdue math lives in **exactly one**
   place (S4 in `render.js`). A pipeline stage (S2/S3) MUST NOT also compute KPIs that S4
   recomputes — that creates a duplicate engine and a silent drift risk where the two engines
   diverge without any error being raised.
2. **Discard the raw parse.** After S2 retain only the normalised `records` + `contract` + `meta`.
   Do not keep the full parsed `workbook` object — it is larger and never re-read.
3. **Validate once, at load.** Row-level validation (S3) is filter-independent; compute it once
   and reuse the result. Filter-dependent derivations belong in S4, not S3.
4. **Derive on demand — no I/O.** S4 recomputes only from the in-memory `records` — fast because
   there is no file read. *Scale-driven, optional*: memoize S4 by a filter key, and/or pre-build
   row indexes (`Map<dimension, indices>`) so filtering is a lookup rather than a full scan.
5. **No re-parse on filter change.** S6 reuses the in-memory model. Re-reading the file on each
   filter toggle is prohibited.
6. **Render is write-only.** S5 writes to the DOM; it never reads from the DOM to make a
   decision. All state lives in the `model` and `state` objects, not in DOM attributes.
7. **Single STATE object.** All UI state (active filters, preferences, open panels, sort order)
   lives in one `STATE` object. No state is stored in DOM attributes and read back by logic.
   `render(view)` is the only entry point for DOM updates. `deriveView(model, STATE)` returns the view.
8. **Error handling at every stage boundary.** Each stage transition MUST be wrapped in its own
   `try/catch`. A failure in S1 (parse) shows a fatal load error; a failure in S3 (validate)
   shows a validation-failed error but does not hide the dashboard; a failure in S4 (derive)
   shows a render error for the affected panel only. Stages MUST NOT share a single outer
   `try/catch` — that collapses distinct failure modes into one undifferentiated error message.
9. **As-of and project-start are distinct anchors.** `meta.today` (as-of) is the **viewer's
   local system date** — built from local date components, **never** `toISOString()` (UTC), which
   introduces a 1-day off-by-one near local midnight. As-of drives every Overdue / Approval /
   look-ahead / completeness calculation. A project-start date, when the data source provides one is an **x-axis origin for date-curve panels only** (S-curve / throughput); it
   MUST NEVER feed Overdue, approval, or schedule-variance math. On the S-curve the x-axis is
   **anchored at the earliest data date** and carries two reference lines: **Start** (the
   project-start date, red dashed) and **Today** (as-of, using the shared text color).
10. **Blank and formula-error are the same "absent" state.** See §3.8.4.

#### 3.8.3 Source-contract parsing (mandatory)

The input source defines the data contract. The pipeline MUST read field positions, lookup domains,
and validation wording from that contract at runtime. It MUST NOT hard-code source positions or
allowed-value lists. For an Excel workbook with a `Code` sheet, use that sheet as the contract. For
a source without a contract sheet, the dashboard workplan must name the approved schema or header map.

1. **Scan the full contract source** — for a `Code` sheet, do not assume a fixed row range.
2. **Discover by labels** — for a `Code` sheet, match block labels without case sensitivity.
3. **Resolve positions at runtime** — use the source header or field map. Do not hard-code column
   letters, row numbers, or fixed source ranges.
4. **Read values to the end of each block** — use the block rules in the source contract.
5. **Report missing contract fields** — a missing required field is a validation error. A missing
   optional lookup block is a warning. Never replace a missing source value with an empty set silently.
6. **Keep rule text in its contract** — use source rule wording and severity when the source defines
   them. If it does not, use the dashboard workplan rule and report that source in the validation view.

#### 3.8.4 Value normalization — blank and formula-error are equivalent "absent"

During **S2**, every raw cell value written into a normalised `fields` entry is treated as
**absent (`undefined`)** when it is either:

- **blank** — the cell is missing/empty, or its text is empty after `trim()`; or
- **a spreadsheet formula-error token** — the cached cell value equals one of `#NULL! #DIV/0!
  #VALUE! #REF! #NAME? #N/A #NUM! #GETTING_DATA #SPILL! #CALC!` (matched case-insensitively).

This is a **single, uniform standard applied to every data column** — it is **not** a per-column
opt-in. Blank and error are deliberately treated the same way: an error token is not a valid
value, and counting it as present silently corrupts KPIs, filters, charts, and validation.

*Implementation:* a shared `isExcelError(v)` predicate lives in the pipeline; S2 coerces any
blank/error to `undefined` and accumulates a per-field error-token count. Downstream consumers
(S3/S4, render) simply see a missing field — no special-case token matching anywhere.

*Fatal data-quality notice:* because an error token corrupts count correctness, S3 emits one
aggregated entry per affected column — a fatal `model.warnings` item
`{ level:'fatal', code:'W-FORMULA', tab:<field>, message }` carrying the field label, column
letter, `N of total` error cells, and a recovery instruction. These notices route to `#errBanner`
as fatal strips (§3.5) and are **not** pushed to `model.issues` (those are row-keyed and filtered
by `activeSet`).

#### 3.8.5 Testability requirement

Because the pipeline is implemented as importable modules (§3.8.0), it MUST be independently
testable without the full page or DOM:

- A test harness MUST exist in the project test folder and use the approved project test runner.
- It MUST import the pipeline module directly and run it against representative source data.
- It MUST assert record counts, KPI values, lookup values, and validation counts from known cases.
  Check rule messages and severity against the source contract when it defines them; otherwise check
  them against the dashboard workplan.
- It MUST pass with zero failures before any release. A failing harness blocks release.
- The layout harness (`harness-layout/`) imports `pipeline.js` to compute ground-truth values
  and compares them against what the rendered page shows — this is only possible because the
  pipeline is a separate module (§3.8.0).

### 3.9 Standalone delivery (no web server) — rev 2026-10-24

A dashboard is delivered as **one self-contained HTML file** that MUST run when it is opened directly
from disk, over the `file://` protocol. It MUST NOT require a web server, and it MUST NOT need
network access at runtime.

- **No server.** Opening the file from the file system MUST fully work. Do not document or require a
  local web server (for example `python -m http.server`) in order to use the dashboard.
- **No blocked fetches.** The `file:` origin blocks `fetch` and `XMLHttpRequest` against local files,
  and it blocks an ES-module `import` of one local file from another. A dashboard therefore MUST NOT
  load its configuration, help text, or any other local resource with `fetch`, and MUST NOT rely on
  importing one local script file from another.
- **Inline everything.** The stylesheet, every configuration file, the whole engine, and images MUST
  be inlined in the delivered HTML. Images use a `data:` URI. Configuration is inlined as
  `<script type="application/json">` blocks and read from the DOM.
- **No external references.** The delivered HTML MUST contain no `href` or `src` that points at a
  local file. An inline script may still be `type="module"` — an inline module needs no fetch — but
  it MUST NOT import another file.
- **Sources stay modular.** Inlining applies to the delivered file only. The engine SHOULD remain
  importable modules for the Node test harness (§3.8.5), and a build script SHOULD regenerate the
  delivered HTML from those sources so the two cannot drift.
- **Reference implementation.** MDL is the model: one HTML file, one inline script, no imports and
  no `fetch`.
- **Spec copies stay in sync (governance).** The root spec (`Dashboard-UI-Design-Spec.md`) and the
  bundled copy (`harness-layout/spec/Dashboard-UI-Design-Spec.md`) are byte-identical. Update both in
  the same change. Each copy is the rollback for the other: if an edit to one is wrong, restore from
  the other's pre-edit state. The single-option principle applies throughout — where C1 and C3 once
  diverged, the spec states ONE standard (for example, the chart legend is one in-SVG element type for
  every panel, §4.2).
---

## 4. Panel / Card Standard

A **Panel** is the atomic page unit. **The class name is free** — a dashboard may call it `.panel`,
`.card` or anything else; only the tokens, spacing and behaviour below are fixed. Record the name
a dashboard uses in its own workplan.

```
┌───────────────────────────────────────────────┐   ← .panel edge (SAME background + border for every panel)
│ KPI OVERVIEW                    ( ? ) ( − )     │   ← title row INSIDE the edge: title left, Help ? + Collapse − right
│                                                  │
│   ┌──────────────────────────────────────────┐  │   ← .c-card: one graph + its own controls
│   │ …chart / table / controls…               │  │
│   └──────────────────────────────────────────┘  │
│                                Panel 14          │   ← corner panel number, bottom-right (inside the edge)
└───────────────────────────────────────────────┘
```

- **Panel surface**: the bordered surface is `.panel` — white (`--surface`); 1px solid `--border`;
  radius 10 px; subtle shadow; `position:relative`. It carries the **same background and edge for every
  panel** (MDL panel model). The title row — title, **Help `?`**, and the **Collapse `−`** toggle, which
  all apply to the whole panel — sits **inside** this edge.
- **Chart cards**: each individual graph (with its own control filters and buttons) sits in its own
  bordered surface — `.c-card` (`1px solid --border`; radius 10 px; `padding:12px`; `--surface`). This is
  a card **inside** the panel and visually separates multiple graphs. A panel may hold one or several
  `.c-card`s. The C3 Breakdown content is now THREE independent single-content panels on its own page
  (rev 1.76); each chart panel holds ONE `.c3-card`, which follows the
  same contract. A single-graph panel (e.g. C1) needs no inner card — the panel edge alone frames it
  (I068). The panel edge (above) is the **outer** border; the `.c-card` border is the **inner**
  border around a single graph.
- **Tables follow the same card contract (normative).** A data table (`.ds-table`, §7.2) and its own controls — view toggle, filters, lane / horizon selectors, export — sit together in one `.c-card`, exactly like a graph: the inner border wraps the table **plus its control cluster** (the owner rule for the Forward and Overdue page). A panel that shows several tables gives each its own `.c-card`.
- **Table tool rows split filters LEFT and actions RIGHT (normative, rev 1.91).** In every table tool row — keyed tables, the Submittals panel and the Forward and Overdue controls — every **filter** (Month select, per-table filter selects, lane and horizon segments) sits in the **left** group, and every **action** (`⤓ CSV`, `Columns`, image actions) sits in the **right** group, right-aligned (`margin-left:auto`). Filters MUST NOT sit in the right group and actions MUST NOT sit in the left group.
- **Tool-row gaps are universal (normative, rev 1.99).** Every panel tool row MUST sit inside its owning card with equal padding on all four sides from `--tool-pad`. Gaps between control groups MUST use `--tool-gap`. No rule hard-codes these gaps. `--c3-tool-pad` and `--c3-tool-gap` stay as C3 aliases of these tokens.
- **A table inside a `.c-card` carries its own border; the card must not double-border it (normative).** When a `.c-card` wraps a table, the table's `.ds-split` border is the **single** external border; the card's own border is removed (`.c-card:has(.ds-split){border:0}`) so exactly one visible border remains — on the table, not the card. This corrects the I077 regression where `.c-card .ds-split{border:0}` deleted the table's border and left only the (too-subtle) card border. Chart cards (no `.ds-split`) keep their card border.
- **Every on-screen table offers CSV (normative, rev 1.88).** Each table has its own `⤓ CSV` control in that table's tool row, before any image action. This applies to every table on every dashboard, including chart-attached tables and keyed tables. The control MUST be hidden when the table has no rows to export or when the current view renders no table. The export MUST contain all columns and all rows that match the applied filters. It MUST NOT be limited to the current page, the visible viewport or the column chooser selection. Use a UTF-8 BOM. This supersedes the earlier "currently visible rows" wording.
- **The top menu exports one workbook (normative, rev 1.90).** The top menu `Export` control downloads a single `.xlsx` file with one worksheet per table **across all data pages** — not only the page on screen. Each harvested page renders in its current view state (global filters, per-page view toggles and month selections), so a table that is hidden or empty in that state contributes no worksheet. Each worksheet follows the same all-columns and full-filtered-set rule as the per-table CSV. A bare boolean attribute MUST be detected with `hasAttribute`: its `dataset` value is `""` and tests false.
- **Download names are uniform (normative, rev 1.89).** Every download file name MUST follow `PROJECT_purpose_YYYY-MM-DD.ext`. `PROJECT` is the slugified **Project Title** metadata value from the MDL workbook's `Code` sheet (for example `TWRP C3B2` becomes `TWRP-C3B2`); when that title is blank it falls back to the **Project Code** metadata value from the same sheet. The MDL `Code` sheet is authoritative when the two workbooks disagree. `purpose` is a short slug of the table or `All-Tables` for the workbook, and the date is the current local date at download time. Use `.csv` for table exports and `.xlsx` for the workbook.
- **Forward and Overdue tables name the document (normative).** Every Forward and Overdue table shows the **Document No.** and the **Document Title** in adjacent columns, and the column widths show the full Document No. and the full Title without truncation (the table scrolls horizontally when the viewport is narrow).
- **Every view wraps its own output in `activePanel` (normative).** The page renderer inserts each view's returned markup verbatim and adds NO panel wrapper, so every view function MUST wrap its top-level output in `activePanel(name, content)`. That helper is the only source of the §4 edge border (`.panel`), the title row (Help `?` + Collapse `−`) and the corner `Panel N` number. A view that returns raw markup (for example a bare `.c-card`) silently loses the border and title — the recurring failure class of I019 / I066 / I067 (see issue I075).
- **A table inside a `.c-card` keeps the §4 rounding (normative).** When a `.ds-split` table sits inside a `.c-card`, remove only its redundant outer border (the card already provides the edge) — never flatten its corners. The base `.ds-split` carries `border-radius:10px; overflow:hidden`; the card rule MUST NOT set `border-radius:0`. This prevents the square-corner regression (issue I076).
- **Position**: `relative` on `.panel` (so the panel number can anchor inside the edge).
- **Padding**: `14px 14px 26px` on `.panel`. The 26 px bottom gap reserves clearance for the corner
  panel number (`bottom:8px`) so it **never overlaps** the last card / content line. Dynamic chart
  containers get the same `padding-bottom:26px`.
- **Title**: 13 px, weight 700, **uppercase**, colour `--navy`, letter-spacing .04 em,
  margin 0 0 10 px.
- **Title row**: `display:flex; justify-content:space-between; align-items:center`.
  Panel title left; an **action cluster pinned to the far right** containing Help `?` and the
  Collapse `−` toggle. **Order within the cluster: Help `?` is LEFT of Collapse `−`** — the
  toggle is always the rightmost control. Inject the `?` as the first child of `.panel-actions`
  so this holds even when a toggle is already present. The title row is rendered **inside** the panel
  edge (the panel border wraps the whole panel, header included); Help `?` and Collapse `−` are therefore
  inside the edge, while each graph's own controls live inside its `.c-card` border.
- **The flex row is the title row, not the heading (normative).** The row is the element that
  wraps the title and the action cluster (`.panel-head` below); the 10 px gap belongs to that row
  (`margin:0 0 10px`) and the `h2` itself is `margin:0`. Putting the flex on the `h2` — as the
  sketch below once did — only works when the buttons are nested *inside* the heading, which puts
  interactive elements inside a heading and leaves the cluster mispositioned the moment a wrapper
  is used instead. A dashboard MUST give the row its own element.
- **Corner panel number**: absolutely positioned bottom-right, `Panel N`, 10 px, muted,
  letter-spacing .04 em, `pointer-events:none`.
- **Optional panel summary (subtitle) — panel count chips (normative, rev 1.93).** A panel MAY show
  a short, compact summary row directly under the title. The summary is **data only** — counts and
  totals, never prose; long explanatory text stays in the **Help modal** (§7.9) and MUST NOT be
  duplicated in the panel body. This chip design **replaces** the earlier plain-text summary line:
  when a panel shows a subtitle carrying counts, every count MUST render as a panel count chip
  (`.pchip`) per the requirements below; whether the subtitle exists at all stays **optional per
  panel** — a panel without a subtitle is compliant. (Review samples:
  `sub/ref/sample-submittals-chips.html`, `sub/ref/sample-pchip-filter-indication.html`.)
  - **Row layout (normative).** The chip row sits on its own line in the panel body **before** the
    `.c-card`, aligned to the panel content edge (no extra indent), `display:flex`, `gap:8px`,
    `flex-wrap:wrap`, `margin:6px 0` below the 10 px title row, left-aligned. The control row
    (filters, CSV, Columns) stays inside the `.c-card`, below the summary.
  - **Chip anatomy (normative).** Each chip is one element carrying its title **inside** — the label
    first, then the count; there is no chip title element outside the chip. Size is height-equal to
    the severity chip (`.vchip`): font-size 11px, `line-height:1.4`, `font-weight:700`,
    `padding:2px 10px` (vertical 1px less than the severity chip, compensating the border),
    `border-radius:6px`, a 1px solid family border, inline-flex with a 7px internal gap. The count
    is 13px / 700, `font-variant-numeric:tabular-nums`, `line-height:1`, in the family ink. The
    design is fully dedicated: `.pchip` classes and `--pchip-*` tokens only — no selector, value or
    token is shared with the severity chip.
  - **Standardized colour families (normative).** Chip colour carries meaning — one family per count
    case, tokens `--pchip-{family}-{bg,border,ink}` defined in **all five themes** (§6): **blue** =
    submissions within the selected time window; **violet** = document groups within that window;
    **green** = distinct documents with a record in the cumulative window up to the window end;
    **neutral** = records currently displayed after all filters. All four chips MUST describe the
    **same globally filtered dataset** — global filters narrow every chip count; the unfiltered set
    MUST NOT feed any chip count. Blue counts submission records; violet / green / neutral count
    document groups, so a filter that removes one of several submissions of a document does not
    change those three groups' counts.
  - **Reserved colours (normative).** The red / amber severity families and every `.vchip` colour are
    reserved for validation and severity indicators and MUST NOT be used by panel count chips, so
    chip colour can never read as severity.
  - **Temporal labels (normative).** Labels MUST state the time scope inside the chip: "in" / "for"
    the selected month for window figures (for example `Submissions in Aug 2026`, `Documents in
    Aug 2026`, `Shown for Aug 2026`) and "till" the selected month for cumulative figures (`Accumulated
    till Aug 2026`). With no time window selected the labels use their all-months forms (`All-month
    documents`, `Accumulated to date`, `Shown records`). The month selector is an in-panel **time**
    filter, not a global dimension filter; its state MUST be readable from the labels.
  - **Visibility and zero (normative).** A chip renders whenever its case applies in the current
    state, regardless of its value — a zero count displays `0` and MUST NOT hide the chip. A chip
    whose case does not apply MUST NOT render: the blue submission chip is hidden when no single
    month is selected (e.g. under All months), while violet, green and neutral remain with their
    all-months counts.
  - **Filter indication (normative, Style A / rule R1).** The filter mark is ONE glyph — a small funnel
    (inline SVG, 11px, `currentColor`) after the count in the family ink. Every displayed chip MUST
    carry it when the in-panel time filter is active or when a global filter **actually narrows** the
    dataset; no displayed chip carries it when neither is true. A global filter is active for this
    rule only when it removes rows from the dataset — a selection containing every available value,
    or a blank / whitespace-only search, MUST NOT trigger the mark. The funnel says only that the
    displayed count is affected by filtering (it need not be smaller); it MUST NOT be used to
    distinguish filter types — the temporal labels carry that meaning.
  - **Data only (normative).** Chips MUST NOT carry prose — labels and counts only.
- **Numbering rule**: *every* top-level panel is numbered sequentially in document order
  (`Panel 1`, `Panel 2`, …). The number is static — authored once per panel via the
  `.panel-no` span (or `.panel[data-panel]::after`). Dynamically generated sub-panels
  inside a panel are **not** individually numbered; they inherit the parent panel's number and
  MUST NOT render a badge of their own.
- **Numbers follow DOM order, assigned after render (normative).** A dashboard MUST NOT number
  panels from the order the markup was *built*. A page can construct a panel's HTML before the
  point where it is placed, which silently produces out-of-order numbers — the sub numbered
  `1, 2, 4, 3` before this was fixed. Assign `data-panel` by walking the rendered top-level
  panels in document order. Because nested sub-panels inherit the parent's number, the `::after`
  rule MUST be gated on the attribute's presence (`.panel[data-panel]::after`), or an unnumbered
  sub-panel renders a bare `Panel`.
- **The panel margin yields to a grid gap.** Panels are often children of a grid that already sets
  `gap`; the panel's own `margin:14px 0` then stacks on top of the gap and doubles the spacing.
  Inside such a container the panel margin MUST be `0`.
- **Stacked panels are always separated.** The gap is normative in §4.7.
- **The collapse state outlives the element (normative).** A re-render replaces the panel element,
  so the collapsed state MUST be persisted outside it — in the dashboard's view state, keyed by
  panel name — and re-applied on render. Keeping it only on the element silently re-opens the
  panel on the next filter change or page switch.
- **No in-panel disclosure toggle when the sidebar provides navigation (normative).** A panel reached
  through the left-sidebar page links MUST show its primary content directly. A secondary in-panel
  toggle — for example a native `<details>` / `<summary>` disclosure — that hides the panel's own
  content is not required, because the sidebar already controls which panel is visible. When a panel
  must collapse, use the panel-level Collapse `−`/`+` toggle (above), not a content disclosure.

```css
.panel{margin:14px 0;background:var(--surface);border:1px solid var(--border);border-radius:10px;
  box-shadow:var(--shadow);padding:14px 14px 26px;position:relative;min-width:0}
.panel-body{min-width:0}                                       /* content wrapper; no border */
.panel-head{display:flex;justify-content:space-between;align-items:center;
  gap:8px;margin:0 0 10px}
.panel h2{font-size:13px;margin:0;color:var(--navy);text-transform:uppercase;
  letter-spacing:.04em;line-height:1.4}
.panel-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}
.panel[data-panel]::after{content:"Panel " attr(data-panel);position:absolute;right:10px;
  bottom:8px;font-size:10px;letter-spacing:.04em;color:var(--muted);pointer-events:none}
.c-card{border:1px solid var(--border);border-radius:10px;padding:12px;background:var(--surface);
  position:relative;min-width:0;margin:0 0 12px}
.c-card:last-child{margin-bottom:0}
.panel-grid>.panel{margin:0}
.panel.collapsed>*:not(.panel-head){display:none}             /* hides the bordered content */
```

### 4.1 Panels containing charts (control ownership)
Some panels hold several **chart cards** in a grid. The panel shell still carries §4 chrome — bordered surface, own title row, corner `Panel N`. **Each chart card is a bordered surface** (`.c-card`, or `.c3-card` for C3) that contains its own chart and its own controls; the border visually separates the graphs (§4 chart-card rule). A panel may hold one or several cards. **Single-graph panels need no inner card border** — the inner `.c-card` / `.c3-card` border is used only to separate **multiple** graphs in one panel (e.g. C3's two cards) or to group a graph with its own controls (e.g. C2's single `.c-card`); a panel that shows only one graph (e.g. C1, the S-curve) uses the **panel edge** alone (its inner border was removed in I068 as redundant). Controls split strictly by scope:

| Control | Owner | Notes |
|---|---|---|
| Help `?` | **the panel** | one per panel, in the title-row cluster; opens the modal (§7.9) |
| Collapse `−`/`+` | **the panel** | collapses the whole grid of chart cards; state lives on the panel element so it survives re-render |
| Chart type (Bar/Pie `.seg`) | **each chart card** | **independent per chart** — keyed by card id (e.g. `inter-<cardId>`), so switching one chart must never flip the others (seg contract: §7.5) |
| Breakdown / dimension select | **each chart card** | each card groups by its own dimension |
| Period window (From / To / range text) | **each chart card** | scopes only the chart it belongs to (§7.9) |
| **Bars** toggle | **each chart card** | shows / hides that card's per-period bars |
| `⤓ PNG` / `⧉ Copy` | **each chart card** | exports that single chart only |

- **Related controls belong to the card they act on — never to the panel area (mandatory).** Any
  control that affects **one card's** content must sit **on that card's board**, in that card's own
  **right-aligned** control cluster above its plot. It must **not** float in the panel's general
  area — the panel head, the panel body, or a free-standing row between cards. Only controls that
  act on the **whole panel** — Help `?` and Collapse `−`/`+` — live on the panel's own title-row
  cluster. Rationale: a control sitting in the panel area reads as scoping the *whole panel*, which
  misleads as soon as the panel holds several cards, and it leaves the card with no board of its own
  once cards are bordered. This applies to **every** card type (breakdown charts, combined charts,
  tables): **every card owns its controls; the panel owns only its own chrome.** Cluster order is
  fixed — period window → **Bars** → range text → `⤓ PNG` → `⧉ Copy` (§4.2). There is **no Reset**
  control (§7.9).
- **C3 Breakdown page — three independent panels (normative, rev 1.76).** The former ONE shared
  control cluster is retired. The `Breakdown` page holds exactly THREE independent top-level panels:
  `Submissions`, `Approval Status` and `Breakdown Summary`. Each panel MUST own ONE control cluster
  with its own Month select and Break-down-by group. Each chart panel MUST also own its Bar / Pie
  toggle. The summary panel MUST own `⤓ Download` instead of a view toggle. Each panel MUST keep its
  own `c3Month`, `c3Dim` and (for charts) `c3View` value. A control MUST change only its OWN panel;
  the other two panels MUST keep their data and view. `data-c3panel` identifies the owner. Each chart
  panel MUST switch to a donut independently. `⤓ PNG` / `⧉ Copy` stay per chart card. CSV export MUST
  start from the summary panel, not from a global `.c3-summary` lookup.
  Each chart card still shows the full MDL discipline set (and all submitters) even at zero. Its bars,
  Y ticks and grid lines share ONE CSS grid. A native attached table below the bars carries the
  dimension headers and metric rows and is subject to the general chart ↔ attached-table column sync
  rule and its C1 visual contract (§4.2 rev 1.73 / 1.74 / 1.75). The C3 legend MUST sit ABOVE the
  chart in BOTH Bar and Pie views and MUST be rendered in-SVG (§4.2 rev 1.78). There is no consolidated two-ring card.
- **C3 chart panel ONE tool row (normative, rev 1.77).** Each chart panel of the `Breakdown` page
  MUST show all tool controls in ONE row: the Month select, the Break-down-by group and the Bar /
  Pie toggle on the LEFT, and `⤓ PNG` + `⧉ Copy` on the RIGHT. A second head row above the tool row
  is FORBIDDEN. The Month select MUST NOT show a visible `Month` text label; its accessible name
  comes from `aria-label`. The `Breakdown Summary` panel keeps Month, Break-down-by and `⤓ Download`
  (rev 1.76) and is unchanged.
- **C3 Breakdown gaps and tool-row placement (normative, rev 1.80).** Every gap in the three Breakdown
  panels MUST be a named token from §6; no rule hard-codes a gap value. This is the C3 case of the universal tool-row gap rule in §4 (rev 1.99). The tool row (part 3) MUST sit
  inside its owning card — the chart card (part 2) in the two chart panels, the summary table card
  (part 9) in the Breakdown Summary panel — and MUST have equal padding on all four sides from
  `--c3-tool-pad`. That padding MUST be identical in all three panels. In the two chart cards a scoped
  negative margin equal to `--c3-card-pad` cancels the outer card padding, so `--c3-tool-pad` alone sets
  the distance to the card border; the card border stays and the chart and table keep their
  `--c3-card-pad` inset. The summary card has no extra padding, so the base rule applies directly.
- **C3 bordered chart zones (normative, rev 1.81).** Every C3 chart card MUST use the universal
  bordered chart composition (§4.2 rev 1.81). The Bar view renders THREE bordered zones: the y-axis
  zone (part 5), the plot zone (part 6) and the attached-table zone (part 7), each `1px solid
  var(--border)`. The Pie / donut view renders the bordered plot zone (part 6) around the donut —
  it renders no y-axis zone and no attached table, and the plot border is still REQUIRED. The
  y-axis and plot zones overlap, so their shared corners are right angles (`border-radius:0`); the
  attached-table zone is separated from the plot by the `--c3-plot-table-gap` (rev 1.80), so its
  borders do not overlap the plot, no right angle is required there, and its corners carry the
  general §4 rounding. The in-SVG legend sits INSIDE the plot-zone border, above the plot content —
  the bordered zones span the legend band and the plot band, so the border encloses the legend rows —
  exactly the C1 model (rev 1.83, superseding the rev 1.82 above-the-border wording). The legend rows
  MUST start after a left inset of `12` SVG user units from the plot-zone left edge — the edge shared
  with the y-axis zone — so the first swatch never touches the y-axis side; the inset matches the
  12 px `--c3-card-pad` token and applies to the Bar legend strip and the Pie donut legend alike
  (rev 1.84 / I140).
- **C3 Breakdown page layout (normative, rev 1.76 / rev 1.83).** Row 1 holds the two chart panels side by side.
  Row 2 holds the `Breakdown Summary` panel spanning both columns. The grid MUST be page-scoped and
  MUST NOT change the `body[data-layout]` behaviour of other pages. Top-level panels MUST use the
  §4.7 14 px gap. At the 879 px breakpoint the three panels MUST stack in one column. The two chart
  panels MUST share one height in every view (default grid stretch, never start alignment; the card
  fills its panel through a flex chain, rev 1.83 / I139).
- **C3 Pie height token (normative, rev 1.83 / I139).** The donut `svg.c3-svg` height MUST come from
  the `--c3-pie-h` token (measured against the Bar cards' geometry), so toggling between the Bar and
  the Pie view does not change the panel height. The Pie legend `<g>` lives INSIDE the bordered donut
  svg, above the ring, exactly the C1 model (rev 1.83).
- **C3 Breakdown Summary compact table (normative, rev 1.76).** The summary table MUST use compact
  row tokens and MUST NOT show an inner vertical scroll bar. `max-height:none` and `overflow:visible`
  on that panel's `.tableScroll` are REQUIRED. The page-level content body stays scrollable (§3.2).
  The table keeps its `.ds-split` border, radius 10 px and split-header alignment (§4, §7.2.15).
- **C3 bar y-axis grid lines + numbers.** To match the C1 S-curve and C2 stacked-area panels, each C3 card
  draws a y-axis on the left of its bar plot. There are **5 horizontal grid lines** (light `.sc-grid`-style rules)
  at 0 / 25% / 50% / 75% / 100% of a **"nice" maximum** — the axis top is `niceCeil` of the largest category
  total (the same rounding C1/C2 use), *not* the raw max — and the bars are scaled to that same nice maximum, so
  the top grid line is a round number and the plot fills its height. The numeric **tick labels (the document
  count)** are right-aligned in the metric-label column and flush against the bars, so there is **no gap** between
  a tick label and the grid line it sits on, and the labels align with the attached data table below. A
  zero-discipline category still renders its empty bar against the full grid. The axis carries the rotated
  side unit caption "Documents" along the left of the tick column, exactly the C1 Y-axis contract (rev 1.60
  / I117; rev 1.82). The Pie cards are exempt (they are
  donuts, not bars). Decision recorded as I060; review sample `sub/ref/sample-c3-grid-lines.html`.
- **C2 Submission Flow Funnel (per-Discipline table left, funnel right).** The C2 Funnel view draws a
  **vertical funnel to the right of a per-Discipline table**: the table (Discipline rows + a Total row) is on
  the left, the funnel on the right. The funnel's **top aligns with the first discipline row** and its **bottom
  aligns with the last discipline row** — the table header and Total row sit outside the funnel's vertical span.
  Five stages run top→bottom: **Planned Deliverables → Submitted for Review → Under Review → AWC → Approved**.
  Stage names and values sit in a **left label gutter** (right-aligned beside the bands), so long stage names
  never clip against a narrow band; there is no separate legend row. **Band widths
  use square-root compression** (widest stage = max width; a 14 px floor) so a large ratio between stages (e.g.
  Planned 1000 vs Submitted 100) does not make a small stage a razor-thin sliver. The bottom stage (Approved) is
  drawn as a **solid square block** (owner request 2026-10-28, replacing the cube) so the funnel ends on a solid
  base. The stage label reads
  **Under Review** (not "In Review"); **AWC** is shown as its own stage, separate from Approved. The
  per-Discipline table repeats the five measures with a Total row. Counting rules: Planned Deliverables = MDL
  planned rows (D11); Submitted for Review = distinct `Document No.` with ≥1 submission row (D34); Under Review
  = latest `SUR` with no `Actual Return Date` (D34); AWC and Approved split by the document's first approval code
  (APP vs AWC, C3 All-months rule). See `sub/ref/C2-Funnel-Sample.html`.
- Chart cards do **not** get their own Help/Collapse and are **not** individually numbered —
  they inherit the parent panel's number (see numbering rule above). Only the panel shows one.
- **Chart-card titles** follow §8: `h3` (`.panel-head h3`), 13 px / 700 `--navy`, **not**
  uppercase — they are nested sub-panels, unlike the panel's own uppercase `h2`.
- **A chart-card title names the *view*, not the *selection* (mandatory).** The card heading
  carries its own **stable group name** and must **not** track the breakdown currently picked in
  that card's `<select>`. A user-changeable value in a heading either goes stale or merely restates
  its control. The per-card `<select>` already indicates what is applied, so echoing it in the
  heading is redundant. (The chart's *own* plot caption is a plot label, not this heading, and is
  unaffected.)
- **Interactive chart panel title.** The panel's `h2` MUST read **`Interactive Chart`** — rendered
  uppercase by the §4 `text-transform:uppercase` rule — and **not** `Charts`. This is the canonical
  name for a panel holding user-switchable interactive charts; the matching Help-modal entry uses
  the same title.
- **Panel board + chart-card grid alignment, border & plot height (mandatory).** **Every
  panel has one board**: its shell draws a bordered surface per §4 chrome (own title row, corner
  `Panel N`). This applies to panels that hold chart cards too, so `.panel.panel-flat` (`border:0;
  background:transparent; box-shadow:none`) is **not** permitted there. Inside the panel board each
  **chart card is exactly one bordered surface** (`.chart`: 1px solid `--border`, `border-radius:10px`);
  a card must **never** be wrapped in a second `.chart` element, since card-in-card draws a *double*
  border and is **forbidden**. A panel therefore draws **one** border and each of its chart cards draws
  **one** border — two distinct, non-nested surfaces. **This also applies to a panel that holds a
  single chart** (§4.2 combined chart panels): the plot is wrapped in **one chart card** drawing its
  own board **inside** the panel board, even though such a panel has no card grid and no card title.
  Cards sit in a 2-up grid (`.charts`) with
  `align-items:stretch` so the cards are **always equal in height** and their borders align on both top
  and bottom even when one chart has far more categories than the other. Each card's border is its only
  frame. The chart
  drawing area (`.chart-host`) flexes (`flex:1`) with a **shared `min-height` of 300 px**, and **both
  chart types MUST render at the same 300 px plot height** — the bar renderer distributes its rows over
  300 px (`rowH` derived from the row count, clamped, with short blocks centred) and the pie renderer
  uses `H=300`. A pie and a horizontal bar chart must therefore occupy the **same vertical extent**, so
  the two chart areas are aligned in height (do not let one chart's canvas be shorter than the other's).
- **Collapse must survive re-render**: when a panel's contents are rebuilt via `innerHTML`, keep
  the collapsed flag as a class on the **panel element itself** (which is not replaced) and
  re-derive the toggle button's glyph/`aria-expanded` from it on each render.

---

### 4.2 Combined chart panels (bars + cumulative curve)
When a chart needs to show **both per-period detail and a running total**, use **one** chart with
a single shared time axis instead of two stacked charts:

- **Shared y-scale by default; a separate bar scale is a documented exception (rev 2026-10-13).**
  Monthly bars (per-period counts) and cumulative lines (running totals) are normally plotted
  against the **same** scale and the **same** single value axis (left, captioned with the unit,
  e.g. `pkgs` / `docs`). Rationale: with separate bar/cumulative axes the *same number* renders
  at two different heights — a bar of `5` sits far taller than a cumulative point of `5`, which
  reads as a bug ("the cumulative curve is lower than the bar"). A single scale keeps the two
  representations directly comparable, and the **Bars** toggle (below) is the way to inspect the
  curve on its own. **Shared is the default mode; the guardrail below is the one exception.**
  - In **shared** mode the scale is `max(1, …visible bar values, …visible line values)` — computed
    over the **visible window**, so it rescales as the period window moves. Bars and lines share
    **one** `y(v)` function; no second `y` function may exist for the same plot.
  - In **shared** mode there is no right axis, so the right-side axis padding is minimal
    (`padR ≈ 18`, not the ~52 px a second axis needs). Only **one** set of tick labels is drawn,
    on the left, plus a single unit caption above the axis. Do not label the axis `/mo` and
    `cum.` separately — there is only one scale.
  - **Scale-mode guardrail (default).** Each workplan MUST confirm these cutoffs against its data and plot size. Let `r = maxCum / maxBar` over the
    visible window, where `maxCum` is the largest cumulative value and `maxBar` the largest
    monthly bar value.
    - `maxBar == 0`, or the **Bars** toggle is off → **shared** (a separate scale is meaningless).
    - `r > 10` → engage **separate scales automatically**. Justification: above this ratio the
      tallest bar occupies under ~1/10 of the plot height (< ~30 px in a 300 px plot), too small
      for its printed value label — it reads as a sliver. Because cumulative totals can be one to
      two orders of magnitude larger than any single month, this is where the shared scale stops
      being usable.
    - `r < 6` → revert to **shared**. Between 6 and 10 the active mode is **retained** (hysteresis),
      so dragging the From / To sliders cannot flicker the axis on and off.
    - A **Shared / Separate** control may be offered so a reader can override the automatic
      decision; it defaults to **Shared** and is a state toggle (carries `aria-pressed`, persisted).
      Whichever mode is active, each axis always **auto-fits** its own family: a user is **never**
      allowed a free-form bar-height multiplier, because that would let one month be drawn taller
      than the running total (a false reading) and would make exported PNGs non-reproducible.
  - **Whenever separate scales are active** these mitigations are mandatory, because the original
    "two heights for one number" hazard is then live: both axes captioned (left `… cumulative`,
    right `… per month`); the right axis line **and its ticks** coloured to the bar family; the
    legend states which axis each family uses (bars → right, `Cum. …` lines → left); and a note
    states *"Monthly bars use the right-hand scale; Cum. lines use the left cumulative scale."*
    `padR` widens to ~52 px while separate. Cross-family height comparison is **never** valid.
- **The y-max follows the dynamic Y tick standard (rev 1.64; supersedes the 2026-10-25 rule).** Compute `yMax` from the maximum `M` of the VISIBLE cumulative and bar values with the **Dynamic Y tick standard** in §4.2 below: the smallest nice-number step `s` with `ceil(M / s) <= min(7, floor(H / 40))`, then `yMax = ceil(M / s) × s`. The plot height stays 300 units and every mark scales from that one `yMax`. The superseded 2026-10-25 rule read: "Compute `yMax = max(1, …visible bar values, …visible line values) × ~1.03`; do **not** round the maximum up to a power-of-ten (or other coarse) step". Its INTENT — curves fill the chart height, with no large empty band above the peak — remains normative; its prohibition on every step-based maximum is superseded, because a fine nice step keeps the fill at ~99% on the current workbooks while giving round tick numbers. **Rev 1.65 — window scope.** `M` is the maximum **within the selected period window**, computed from the windowed `data-points` payload (`pts`) and filtered by the enabled series and the Bars toggle. It MUST be recomputed on every relevant repaint (period, series visibility, Bars, grain), immediately and without animation or debounce. Cumulative values MUST remain **absolute** — `pts` carries `c1.*Cum[lastIdx]` — and MUST NOT be rebased to the window; only the scale adapts. After any period change the curve, bars, `line.sc-grid`, HTML axis labels, hover / refit metadata and PNG/Copy MUST all represent the same Y-axis scale. The historical revision-table row 1.28 is unchanged.
- **Cumulative values are ABSOLUTE — never rebased to the window (rev 2026-10-13).** A cumulative
  point always shows the true running total from the start of the series, so the value read off
  the chart is the real total-to-date and it does **not** change when the period window moves. Do
  **not** subtract the pre-window cumulative (no "anchoring at the window start"): that turns the
  numbers into deltas that silently change as the reader drags the window, and it forced a
  "cumulative within period" caption to explain them. The window selects **which months are
  shown**; it never re-zeroes the curve.
- Every series is drawn **twice**: once as bars, once as a cumulative line. Lines are
  distinguished from their bar counterpart by dash pattern (e.g. Plan `6,3`, Forecast `2,2`,
  Actual solid) and are named `Cum. <series>` in the legend.
- **The combined-chart legend MUST be rendered INSIDE the SVG (in-SVG).** It travels with the
  exported PNG, so an HTML `.legend` div or a toolbar legend is not permitted — a legend outside the
  SVG is lost on export. It holds one bar swatch and one `Cum. …` line sample per visible series
  (four series → eight entries). The entries wrap into rows of `floor(W / 132)` items at plot width
  `W`, and every row MUST stay inside the SVG `viewBox`, so a narrow panel neither clips the legend
  nor needs a horizontal scrollbar.
    - **With an attached table (C1 and C3).** Where a `.c1-grid` or `.c3-grid` panel renders a native
      `<table>` whose `<thead>` month cells are the chart's shared X labels, the legend MUST sit
      **above** the plotting area, inside the top of the SVG canvas. `yTop` MUST be sized for the
      legend rows, `yBot` MUST be the bottom edge of the SVG `viewBox`, and the plot's bottom edge
      MUST touch the `<thead>` with zero intermediate layout elements. C2, C4 and the MDL dashboard
      are out of scope for this SVG-legend-placement branch. This branch governs legend placement only;
      the general chart ↔ attached-table column sync rule and its visual contract apply separately
      (§4.2 rev 1.74 / 1.75).
    - **Without an attached table.** For every other §4.2 combined chart (C2 stacked and delay),
      the legend SHOULD stay at the bottom, beneath the plot area.
    - **C3 legend (normative).** The C3 legend uses the SAME element type as every other panel: it is
      rendered INSIDE an SVG `<g>` ABOVE the chart (in-SVG), never as a separate HTML `.c3-legend`
      element. A C3 Bar / Pie card emits an SVG legend group above `.c3-grid` (Bar) or above the donut
      `<svg>` (Pie), inside `.c3-card`. PNG / Copy MUST serialize this in-SVG legend so the exported
      image keeps it at the top. This retires the HTML `.c3-legend` element type from matrix rev 1.76;
      record the deviation in the dashboard workplan (§8.4).
- **Months are labelled with the `MMM YYYY` template (e.g. `Mar 2026`).** Every month shown in the
  S-curve — the x-axis ticks, the period-window range message, and the `<title>` tooltips — is
  formatted through the shared month-label helper. A raw `YYYY-MM` key, or any `slice()` of it
  (`26-03`), is never rendered: it is not a readable month and it differs from every other date in
  the dashboard. Both dashboards use the same template.
- **A Month / Quarter / Year time-grain toggle MAY be offered on an S-curve.** When present it
  rebuckets the data: the x-axis labels, the bar aggregation and the cumulative curve all follow the
  selected grain — `MMM YYYY` for Month, `Qn YYYY` (e.g. `Q1 2026`) for Quarter, `YYYY` for Year. At
  Quarter / Year the cumulative line plots at each bucket boundary (the cumulative at the bucket end),
  and the `MMM YYYY` template is replaced by the grain template through an extended shared label
  helper (never a raw key).
- **Bar values are printed VERTICALLY — rotated 90°, reading bottom-to-top.** A horizontal count
  above a bar collides with its neighbour as soon as the bars get close together, and the collision
  worsens the more digits the count has. Rotating the label gives it a fixed ~12 px horizontal
  footprint regardless of magnitude, so values never overlap. The label is anchored just above the
  bar top and rotated about that anchor (`text-anchor="start"` + `transform="rotate(-90 x y)"`).
- **Dense x-axis labels MAY be inclined** (rotated ~40°, `text-anchor="start"`) so they hug the axis
  with a **minimised gap** and save horizontal space; wherever inclined, the legend MUST sit **clear
  of the labels** (no overlap) — the bottom padding is sized for the rotated text plus the legend, not
  for the labels alone. This bottom-padding rule applies only to the no-attached-table branch, where
  the legend sits beneath the plot; an attached-table panel places the legend above the plot and keeps
  its X labels in the table `<thead>`.
- **Every plotted point on a cumulative line is a SOLID dot — `r=3`, filled with the series
  colour.** Nodes are never hollow rings (`fill="var(--surface)"` with a coloured stroke): a solid dot stays
  legible where series cross — the standard form for every S-curve.
- **Forecast is always drawn** — it is never hidden merely because the Forecast column is sparse.
  The fallback is applied **per item**: a package with no Forecast date contributes to the
  Forecast series using its **Plan** date (mirrors *due = Forecast ∥ Plan*). When the whole
  column is blank the Forecast series legitimately mirrors Plan instead of disappearing.
- **Bars are the INDIVIDUAL period quantity, never cumulative.** Keep the two representations as
  two separate arrays: per-period counts feed the bars, the running total feeds the lines. Never
  accumulate the per-period array in place and then alias it to the cumulative series — that
  silently turns the bars into cumulative values.
- **Every series stops at its last real date — Actual runs to TODAY.** Plan and Forecast (bars
  and curves) end at the last period holding that kind of date, so no curve is drawn as a
  misleading flat tail; if there is no such date the series is drawn as nothing (never a flat
  zero line). Cumulative **Actual** is the exception: it runs through **today** (not merely the
  last actual month) so achieved progress stays readable up to the reporting date. Actual *bars*
  still stop at the last month with an actual PO.
- **Every non-zero bar shows its value** printed above it (12 px, matching the bar-combo chart). Zero
  bars are skipped so the plot stays readable.
- The time range extends **exactly one extra month** beyond the last data month (not three or
  four) so the last bar is not flush against the plot edge.
- A **Bars** toggle hides the per-period bars so the cumulative curve can be read alone. It lives in
  the **chart card's** control cluster (§4.1 ownership) — **not** in the chart, and **not** in the
  panel area. Bars are **visible by default**. The button is a state toggle, not a momentary action:
  it carries `aria-pressed` and is dimmed (`opacity:.55`) when bars are hidden, so its state is
  visible without re-reading the chart.
- The card's controls form **one cluster on the card's own board**, directly above the plot
  (**§4.1** ownership). The cluster is **right-aligned by default**; the **period selection** (window
  or brush) MAY instead be **left-aligned** with `margin-right:auto`, pushing the remaining controls
  to the right. Internal order is fixed: **grain toggle (when present) → Bars → series multi-select
  (when present) → date-range text → `⤓ PNG` → `⧉ Copy`** — filters before exports, PNG before Copy.
  `align-items:center`. The cluster prefers a single line and may wrap only when the card is too
  narrow. The **period window MAY be realised as a bar / brush selection** — a single track with two
  drag handles selecting a contiguous range — instead of two separate From / To inputs; when the card
  is too narrow the brush wraps below the cluster row.
- **C1 period time bar (rev 1.66; C1 only, normative).** In a C1 S-curve attached-table panel
  the period window MUST be **one dual-handle range track**. Two native
  `<input type="range" step="1">` elements sit over one shared visual track, carry
  `min="0"` / `max="N-1"` and keep `data-c1period="from"` and `data-c1period="to"`.
  `step="1"` makes fractional month indices unreachable: each handle snaps to a whole
  reporting month, so the curve, the attached `<thead>` columns and the windowed
  `data-points` payload always come from the same `N`. Two separate From / To inputs MUST NOT
  be used for C1.
  - **Month ticks.** Draw exactly one subtle tick per active reporting month, with
    `data-c1month` equal to that month's index and `pointer-events:none`. January ticks MAY
    carry the year label. The active and near states MUST follow the selected window. Ticks
    MUST NOT take pointer events or change `N`.
  - **Preset chips (rev 1.67; single-select, normative).** The five presets `6M`, `12M`,
    `24M`, `YTD`, `All` MUST form ONE joined `.seg` group of `.seg-btn` buttons beside the
    track, with `aria-label` on the group and `aria-pressed` on each button. Use the existing
    Sub `.seg-btn.active` / `--blue` token. `6M`, `12M` and `24M` select 6, 12 and 24 whole
    months ending at the current `to` index and clamp at the first month. `YTD` runs from
    January of the as-of year through the as-of month; when the as-of month is absent from the
    data, use the last month at or before it. `All` selects `[0, N-1]`. A preset MUST write the
    same period state and MUST use the same single full-repaint path as a handle change.
    - **Stored selection.** The active preset MUST be stored as ONE preset name in view
      state. Do NOT derive `aria-pressed` by comparing `[from, to]` with each preset's
      computed range: clipped ranges collide, so two or more chips would light together.
      `undefined` gives the default `All` selection. `null` gives a manual custom range with
      NO active chip. Any preset name gives exactly that ONE active chip. A handle `input`
      or `change` MUST set the selection to `null`. The visual sync MUST read the stored
      value and MUST also toggle the `.active` class of that ONE button.
  - **One-row control cluster (rev 1.67; normative).** The tools below the panel title MUST
    form ONE visual row at the 1280 px minimum desktop viewport width. `.c1-ts` MUST use
    `flex-wrap:nowrap` at that width and above. Set `flex-shrink:0` on the period label,
    the period text and the segmented chip group. Let only `.c1-ts-body` shrink, with a
    190 px flex basis and a 120 px minimum width. Below 1280 px the §3.4.1 minimum-width
    rule re-enables `flex-wrap:wrap` so every control stays reachable. Print MUST hide
    `.c1-ts-body` and `.c1-ts-chips.seg` and MUST keep the period text.
  - **Drag and repaint.** An `input` event MUST update only the track visuals: the fill, the
    tick states, the period text, both `aria-valuetext` values and the chip `aria-pressed`
    states. The `change` event MUST perform the ONE full repaint. Do not rebuild the curve,
    grid, table or Y axis while a handle moves. A crossing handle MUST push the other handle,
    never invert the range. Repaint remains immediate, with no animation or debounce.
  - **Accessibility and print.** Both inputs MUST keep an `aria-label`, an `aria-valuetext`
    with the formatted month, a visible `:focus-visible` outline and a one-month keyboard
    step. Print MUST hide the interactive track and the chips and MUST keep the period text.
  - **Unchanged.** `state.c1Period`, the windowed `pts`, absolute cumulative values, the
    attached table, `niceAxisTicks()`, the rev 1.65 shared Y axis, hover / refit metadata,
    PNG/Copy, the grain toggle, Bars and series multi-select are unchanged. No second Y-axis
    or separate bar scale is introduced.
- **C1 segmented control and layout (rev 1.71; normative).** Both C1 groups — the five period
  presets and the Month / Quarter / Year grain group — MUST follow the common **§7.5 B2.1**
  segmented-control standard for tokens, states, markup and accessibility. Only two
  C1-specific rules remain here. (1) The five preset chips use the ONE standard variant: the
  shared **32 px** text-button height and **12 px / 600** typography from §7.1 rev 1.71. The
  former `compact` variant is retired and MUST NOT be used. (2) The stored single selection, the
  dual-handle track, the one-row `flex-wrap:nowrap` cluster and the print rules from revs 1.66
  and 1.67 are unchanged. An explicitly approved panel-specific requirement overrides a common
  B2.1 default for that panel only; each such override MUST be recorded in the §7.5 B2.1
  deviations list. This clause supersedes the token and markup-scope text of rev 1.68, whose
  historical row is preserved verbatim. Rev 1.68's grain-only markup scope is RETIRED: all seven
  generators now use the common markup.
- These panels stay **full width** (`.card.full`) — one wide chart, not a 2-column grid.
- **No nested chart title** when a panel holds a single chart: the panel's own `h2` is enough, so
  do not add an `h3` sub-title. The chart component nevertheless draws **its own chart-card board**
  (§4.1) — a 1 px border around the **whole chart component** (control cluster + plot), **not** a
  rectangle drawn inside the plot area — and the control cluster above renders **inside** that board.
- **CSS contract (mandatory, so the rule is testable).**
  `.chart-actions{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:6px}`
  — the cluster right-aligns **to the card**; a cluster that merely carries the class while sitting
  left-aligned in the panel body still violates this rule. And
  `.sc-win .msg{font-size:12px;color:var(--muted);margin-left:auto;white-space:nowrap}` — the range
  text is muted body copy at §8 sizes, never a small green success-coloured label.

- **Hover floating window — normative (§4.6).** Moving the cursor (or focusing) a chart board draws the optional snap line and shows the `.chart-tip` window near the cursor, listing that bucket's per-period counts and cumulative totals; the window is an HTML overlay with `pointer-events:none` (never inside the SVG). The full contract — tokenized visual style, 4-edge clamping, a below-card KPI variant, `cursor:crosshair` affordance, required touch variant, accessibility and the single delegated binder — is defined in **§4.6**.

- **S-curve attached table (normative, rev 2026-11-05).** This rule applies to **every** dashboard
  that draws an S-curve with an **Attached table** (§0). It is universal: the metric rows come from
  the dashboard's own data and workplan (§1), and this clause names no row. The C3 Bar cards now
  follow the same native attached-table model (§4.2 rev 1.73, revisions 1.33 / 1.34).
  - **Page and panel structure.** The page panel container is a CSS grid (§3.4, §4.7). The
    **Panel** is the atomic page unit (§4), and `activePanel()` supplies the edge, title row and
    Panel N number. A single-graph C1 panel has **no inner `.c-card`** (§4.1, I068). One
    `.sc-board` carries the chart board border around the control cluster and the chart body.
    No additional wrapper surrounds the whole composition.
  - **Bordered chart composition (universal MUST, rev 1.81; strengthens rev 1.70).** EVERY chart board
    on EVERY dashboard MUST use the bordered composition: one borderless alignment grid plus bordered
    axis, plot and attached-table zones. Each zone uses `1px solid var(--border)`. Every view of the
    chart MUST carry the bordered plot zone — the Pie / donut view renders no y-axis zone and no
    attached table, but its plot-zone border (part 6) is REQUIRED. Overlapping borders meet at right
    angles: where two bordered zones share an edge or corner — for example the y-axis zone (part 5)
    and the plot zone (part 6) — the shared corners use `border-radius:0`. Where a named-token gap
    separates two zones — for example the `--c3-plot-table-gap` between the bar plot and the attached
    table (rev 1.80) — their borders do not overlap, the right-angle rule does not apply, and those
    corners keep the general §4 rounding (`border-radius:10px`). Non-shared outer corners always keep
    `border-radius:10px`. No additional wrapper surrounds the whole composition. Class names are
    implementation-specific; review colors are not part of the production standard.
  - **Grid contract.** One `.c1-grid` CSS grid is the alignment container. Define `--c1-gutter`
    (`104px`) and `--c1-cols` (`N`) once, and set
    `grid-template-columns:var(--c1-gutter) repeat(var(--c1-cols),minmax(0,1fr))`. Set
    `column-gap:0`. Column 1 holds the Y ticks, the Y caption and the metric labels. Columns
    2..N+1 hold one period each. Row 1 holds the curve. Row 2 holds the X labels, which are also
    the table column headers. Rows 3+ hold the metric rows. The SVG `viewBox` bottom MUST equal the
    plot bottom, so the `<thead>` row touches the curve's X axis with no intervening legend band
    (§4.2 legend rule).
  - **SVG contract.** One `<svg>` with `role="img"` and an `aria-label` draws the curve inside
    `.c1-plot`, which spans columns 2..-1 of row 1. Use `xc(i) = (i + 0.5) * W / N`, where `W` is
    the measured width of that spanning cell. A **`ResizeObserver` on `.c1-plot` MUST** recompute
    `W` and redraw the curve on every container width change (§3.4.1). A `window` resize listener
    alone is not sufficient.
  - **Y axis contract.** The curve SVG MUST draw one vertical `sc-yaxis-line` at `x = 0`,
    spanning the full plot height (`yTop` to `yBot`) as a 1 px light rule. Grid column 1 MUST
    carry the right-aligned Y tick labels generated by the **Dynamic Y tick standard** below,
    flush with the plot's left edge, plus the unit caption (`Documents` or the equivalent measure
    name) rotated to read along the side of the axis — `writing-mode:vertical-rl` or an
    equivalent rotate transform. A horizontal unit caption above the axis does not satisfy this
    rule. All text elements within this panel — SVG annotations, Y-axis tick labels, and attached table cells — inherit `font-family: var(--font-ui)` from `.c1-grid` (normative, §6). Do not override with per-element font-family declarations unless a domain-specific requirement exists — such overrides must be documented in the dashboard workplan.
  - **Dynamic Y tick standard (rev 1.64; supersedes the fixed-five-tick count of rev 1.60).**
    All measurements are in SVG units for the C1 plot of height `H = 300`. (a) Major ticks MUST
    be at least ~40 units apart; therefore `intervals <= min(7, floor(H / 40)) = 7` and the
    number of labels MUST NOT exceed **eight** (`intervals + 1`, including the zero label).
    (b) Steps MUST come from the standard nice-number sequence `{1, 2, 2.5, 5} × 10^k`;
    `step >= 1` MUST hold because the measure is an integer document count. (c) Choose the
    SMALLEST step `s` with `ceil(M / s) <= 7`, where `M >= 1` is the maximum of the VISIBLE
    cumulative and bar values **within the selected period window**, taken from the windowed
    `data-points` payload (`pts`) and filtered by the enabled series and the Bars toggle; set
    `yMax = ceil(M / s) × s` and `intervals = yMax / s`. `M` MUST be recomputed on every
    repaint (rev 1.65); cumulative values stay absolute and MUST NOT be rebased. The top
    grid line then carries a round number and the peak sits close to it (`M / yMax`).
    (d) `yMax`, `yStep` and `yIntervals` MUST be stored in the ONE C1 chart metadata payload
    (`data-c1meta`) that drives `c1PlotSvg`, the static HTML Y ticks, the `ResizeObserver`
    refit, the hover payload and PNG/Copy. Every consumer MUST generate its ticks from that
    metadata; a fixed tick list such as `[4, 3, 2, 1, 0]` MUST NOT be used. The SVG MUST draw
    exactly one `line.sc-grid` per label at `yOf(label)`, and the HTML Y-axis column MUST
    contain exactly `intervals + 1` `.c1-ytick` labels. (e) The plot height MUST remain 300
    units. Only the scale changes: cumulative lines, area fills, bars, dots, reference lines,
    the Start / Today annotations, the hover payload and the exported SVG MUST all scale from
    that same `yMax`. Worked examples: `M = 5955` → `s = 1000`, `yMax = 6000`, 6 intervals /
    7 labels / 50 px / 99.25% fill; `M = 6100` → `s = 1000`, `yMax = 7000`, 7 intervals /
    8 labels / 42.86 px; `M = 8100` → `s = 2000`, `yMax = 10000`, 5 intervals / 6 labels /
    60 px. The remaining headroom in the third case is the defined cost of a nice step plus
    the seven-interval cap. Only the rev 1.60 **count** requirement is superseded; its axis
    line, rotated caption, no-scroll reflow and alignment rules stay in force.
  - **Table contract (Option B).** One native `<table>` sits in one grid item that spans all
    columns. It MUST carry a short `<caption>`, a `<colgroup>` driven by `--c1-gutter` and
    `--c1-cols`, `table-layout:fixed`, a `<thead>` with `<th scope="col">` month cells, and a
    `<tbody>` with `<th scope="row">` labels and one `<td>` per month. ARIA table roles MUST NOT
    be used, and `display:contents` MUST NOT be applied to the table elements (§0,
    **Accessibility tree**). The     `<colgroup>` widths MUST match the `.c1-grid` tracks, so the SVG,
    the headers and the values share one horizontal boundary for every period column. Table cell fonts inherit `font-family: var(--font-ui)` from `.c1-grid` (normative, §6). Table column headers (`.c1-table th[scope="col"]`) typically render at 11–12 px weight 600 in var(--muted). Table row headers (`.c1-table th[scope="row"]`) at 12 px weight 600 left-aligned. Data cells (`.c1-table td`) at 12 px weight 400 with `font-variant-numeric: tabular-nums` right-aligned. These sizes support clean numerical scanning across 20+ month timelines.
  - **Attached-table column sync (general, rev 1.74 / 1.75).** Where a chart renders a native attached
    table in the same chart board whose columns share the chart's X positions, hovering a chart
    column MUST highlight the same logical column in BOTH the chart and the attached table, and
    hovering a header or value cell MUST highlight the same logical column in BOTH the attached
    table and the chart. The state MUST be transient, scoped to the owning chart card, cleared on
    pointer leave / blur / Escape / repaint / print, and stripped from PNG / Copy / print. A
    chart-linked attached table MUST use ONE shared chart-column state and MUST NOT also receive a
    competing generic `.col-hover` column state; the generic crosshair MAY still add `.row-hover`
    and `.cell-hover`. The floating `.chart-tip` window MUST stay closed while the cursor is in the
    attached table, while the column highlight remains active (§4.6). This rule applies to C1 and
    C3 Bar cards. C3 Pie, `.c3-summary`, `breakdown-table.csv`, C2 Funnel, C4, KPI cards, the MDL
    dashboard and bounded `.ds-table`s are out of scope.

    **Visual contract (normative, rev 1.75).** The shared chart-column state MUST use the C1
    visual design in every qualifying chart:

    - **Column band.** The chart MUST draw ONE hidden band behind all marks. The band MUST span
      the full plot height and exactly one column width (`W / N`). It MUST use a tokenised fill at
      `0.08` opacity, MUST carry `pointer-events:none`, and MUST stay hidden until the column is
      active. C1 implements it as `<rect class="sc-hover-band">` with `fill:var(--blue)` and
      `fill-opacity:.08`. A CSS-grid chart MUST implement it as ONE overlay element inside the
      chart grid, aligned to the same tracks as the attached table.
    - **Centre line.** The chart MUST draw ONE hidden centre line at the active column's centre.
      It MUST render as a 1 px dashed line (`3 3`) in `var(--text3)`, MUST span only the plot
      area, and MUST stay hidden until hover. C1 names it `.chart-snap` and uses the §4.6 stroke
      tokens. A CSS-grid chart MAY render it as a DOM overlay with the same class and the same
      visual values. §4.6 makes this line REQUIRED for charts with an X-aligned native attached
      table.
    - **No active-column border.** An active chart column or an active attached-table cell MUST
      NOT receive a border, outline or inset ring. It MUST use a tokenised background and font
      weight only. The intersection `.cell-hover` MAY keep its inset ring (§7.2.16). The
      structural 1 px board border of §4.2 rev 1.70 is not affected.
    - **Header overlay.** An active attached-table `<th>` header, including a sticky row header,
      MUST use the non-destructive `--header-crosshair-overlay` and `--header-crosshair-accent`
      treatment from §7.2.16 rev 1.97. The overlay MUST be a `background-image` over the existing
      header fill. It MUST NOT overwrite `background-color`, change header height, create a
      stacking context or break split-header width pinning or sticky positioning. Active body
      `<td>` cells stay border-free under the preceding rule.
    - **Two-way and transient.** Hovering a chart column or a table column MUST move BOTH the
      band and the centre line to the same logical column. Both elements MUST be hidden on
      pointer leave / blur / Escape / repaint / print and MUST be stripped from PNG / Copy.
      `@media print` MUST neutralise them.

    The C1 reference implementation below is the visual reference. C3 Bar cards MUST follow it
    without adding a second, panel-specific hover interaction (§7.2.16).
  - **C1 reference implementation (rev 1.63; visual reference for rev 1.75).** C1 keeps all of
    the following. The hidden `.sc-hover-band`, the `.chart-snap` centre line and the border-free
    `.col-active` cells are the visual reference for the general rule above:
    - **Soft area gradients.** The SVG MUST define one `<linearGradient>` per visible series in
      `<defs>` and one `<path class="sc-area">` beneath each cumulative line, drawn behind the grid
      lines, bars and curves. Gradient stops MUST use the on-chart series **tokens** (`--color-*`),
      never a hard-coded hex (§4.6). Area paths MUST carry `pointer-events:none` so they cannot
      steal the nearest-datum hover.
    - **Month-column highlight band.** One `<rect class="sc-hover-band">` MUST be a direct child of
      the SVG, hidden until activation, spanning `yTop`..`yBot`, with `width = W / N` and
      `pointer-events:none`. It MUST be drawn behind all marks.
    - **Band and centre line tokens.** `.sc-hover-band` MUST use `fill:var(--blue)` with
      `fill-opacity:.08`. `.chart-snap` MUST use the §4.6 tokens. Neither element MAY add a
      border, outline or inset ring to an active column cell (§4.2 rev 1.75).
    - **Two-way month-column sync.** Every month `<th scope="col">` and every value `<td>` MUST
      carry `data-c1col="${i}"`. `data-c1col` is distinct from `data-col`, which `.ds-table` column
      choosers and resize grips already use. Hovering a month column in the SVG MUST activate the
      band, the snap line and the `.col-active` class on that column's cells; hovering a header or
      value cell MUST activate the same band and snap line.
    - **ResizeObserver refit.** A `ResizeObserver` refit MUST rebuild the band from the new
      `W / N`, and the binder MUST query the band fresh rather than cache the node across
      `innerHTML` replacement.
    - **Chart-only hover window.** The `.chart-tip` window MUST open **only** while the cursor is
      inside the SVG chart area. When the cursor is in the attached table the window MUST stay
      closed, while the band, snap line and `.col-active` highlight remain active (§4.6). This
      gating is opt-in on the shared `bindChartHover()` binder and MUST NOT alter non-participating
      boards.
    - **Export fidelity.** PNG/Copy MUST serialize the gradient `<defs>` and area paths with
      resolved token colours, and MUST strip the C1 hover band and `.col-active` classes so no
      transient hover state is captured. C3 MUST strip its own chart-linked `.col-active` state
      and MUST hide its column band and centre line (§4.2 rev 1.75).
  - **Labels and rules.** Use the `MMM YYYY` month template (§4.2). Put `Reporting Month` in the
    corner cell, left aligned above the X labels. Use 1 px light rules only. Keep the Start and
    Today reference lines. Omit the as-of subtitle.
  - **Fallback, reflow and print.** Static HTML cells MUST show the table when scripts do not run.
    The script MUST rebuild the same cells. The **whole curve MUST stay visible inside the chart
    board at every container width**: the SVG MUST NOT gain `min-width` and the board MUST NOT
    gain a horizontal scrollbar (§3.4.1). The `ResizeObserver` pass MUST keep the `width` /
    `height` attributes, the `viewBox`, `data-geo.W`, every `data-points[].cx`, `--c1-cols` and
    `<colgroup>` in sync, so one SVG unit stays one CSS pixel and
    `preserveAspectRatio="xMidYMid meet"` cannot letterbox the plot. Changing the period window
    MUST rebuild the curve payload and the table columns from the same `N`. Print MUST show the
    full grid.
  - **Export.** `⤓ PNG` and `⧉ Copy` MUST include the attached table. Rebuild the table text and
    rules as a self-contained native SVG of `<rect>` and `<text>` (§0, **Export &
    serialization**), following the C3 `c3CardToSvg` method (§4.1, revision 1.33). Do not
    serialize only the curve `<svg>`, and do not use `<foreignObject>`.
  - **Accessibility.** Keep `role="img"` on the SVG so its inner `<text>` is not read twice. Keep
    the short `<caption>` and every `scope` attribute. Link `aria-describedby` to `.chart-tip`
    only (§4.6); do not point it at the table. Keep every cell in the DOM when the grid scrolls.
    A skip link is not required for one static table.
  - **Exemptions and CSV.** The attached table is not a **Bounded data table** and not a
    `.ds-table`. §4.3 and §7.2.15 do not apply. The §4 CSV rule is scoped to `.ds-table`; each
    dashboard MUST record in its workplan whether its attached table also offers `⤓ CSV` (§1).
  - **C3 attached tables (normative, rev 1.73 / 1.74 / 1.75).** Each C3 Bar card MUST render one native
      `<table class="c3-table" data-table-crosshair>` below its bar plot, inside the same card body. The
    vertical gap between the bar plot and the attached table MUST be the derived token
    `--c3-plot-table-gap` = `--c3-axis-label-h / 3` (6 px at the default 18 px label height). The gap MUST
    be minimized without the table overlapping the plot baseline or the `0` tick label, and MUST still
    scale with the x-axis label height. This supersedes the rev 1.79 wording that required a gap of at
    least the label height (§4.2 rev 1.80).
    The bar plot stays one borderless CSS grid with `--c3-gutter:104px`, `--c3-cols:N`,
    `column-gap:0` and row 1 for bars, Y ticks and grid lines. The table spans all grid columns in
    row 2 and MUST carry a visually hidden `<caption>`, a `<colgroup>` driven by the same geometry,
    `<thead>` with one corner `<th scope="col">` and N dimension `<th scope="col" data-col-id="i">`
    cells, and `<tbody>` with metric `<tr>` rows using `<th scope="row">` and `<td data-col-id="i">`.
    Every `.g-bar` MUST carry the matching `data-col-id="${i}"`. Use `table-layout:fixed`,
    `width:100%`, `border-collapse:separate` and `border-spacing:0`. Scope C3 cell rules under
    `.c3-table` / `.c3-grid`. Set `role="group"` on `.c3-card` so the chart host does not flatten
    the native table in the accessibility tree. Per the general §4.2 rev 1.74 rule, hovering a
    `.g-bar` column or a table column MUST apply ONE shared `.col-active` state to every matching
    `.g-bar`, dimension header and value cell inside that same `.c3-card`; the two cards MUST stay
    independent. Per §4.2 rev 1.75, C3 MUST follow the C1 visual contract. The `.c3-grid` MUST
    carry ONE hidden column band element and ONE hidden `.chart-snap` centre line element. Both
    MUST be children of the grid, MUST use the same `--c3-gutter` / `--c3-cols` tracks as the
    table, MUST sit behind the bars and MUST move with the active `data-col-id` in BOTH hover
    directions. An active `.g-bar` or table cell MUST NOT receive a border, outline or inset ring;
    it MUST use a tokenised background and font weight only. The C3 attached table uses
    `.row-hover` / `.cell-hover` from §7.2.16 and MUST NOT also receive a competing `.col-hover`
    column state. The `.chart-tip` window stays closed while the cursor is in the attached table,
    while the `.col-active` column highlight, the band and the centre line remain active.
    PNG / Copy MUST include bars, axis labels, table rules, values and legend, and MUST strip
    transient chart / table hover classes and hide the band and centre line before they read
    computed styles. Print MUST neutralise them. The Pie view and `breakdown-table.csv` stay
    unchanged. Per §4.2 rev 1.76, the `.c3-summary` table is now the content of its OWN full-width
    `Breakdown Summary` panel; "full-width" means the full width of that panel, not a section of a
    shared C3 panel. It keeps the `.ds-split` border, radius 10 px, split-header alignment, compact
    row tokens and NO inner vertical scroll bar (§4.1 rev 1.76). The Submissions table shows Total
    Plan / First Submission / Resubmission / Under Review; the Approval Status table shows the codes.
    C3 code and the review samples in `sub/ref/` MUST cite §4.1, §4.2, §3.4.1 and revisions 1.33 /
    1.34 / 1.73 / 1.74 / 1.75 / 1.76 in comments or notes.

### 4.3 Long lists → bounded data table (never an open-ended list)
Any panel whose content is a **list of records that can grow** (look-ahead, overdue packages,
validation issues) must render as a **data table inside a fixed-height scroller** — never as an
open-ended list that stretches the page.

- Container: `.tableScroll` (`max-height:340px; overflow:auto; margin-top:8px;
  border:1px solid --line; border-radius:10px`). The header is rendered as a **split header**
  (§7.2.15): `<thead>` lives outside the scroller, so the panel keeps a stable height no matter how
  many rows match, only the body scrolls, and the **vertical scrollbar starts below the header row**.
  (A sticky in-scroller `thead` was the pre-2026-10-21 pattern and is retired — see §7.2.15.)
- The **row count is shown in the control row** (e.g. `PO Plan from … to … (N packages)`), so the
  full size is still communicated even though the list is clipped.
- Row content: one record per row, no duplicated paragraph text; numeric columns right-aligned
  with `.num` + tabular figures.
- **Windowing (L3, §7.2.8).** Because the list is never truncated, a table whose *columns × rows*
  product makes full DOM materialisation expensive MUST render only the visible window. The
  control row still reports the **full** count.
- **Pagination (all bounded tables).** When a bounded table holds **more than 200 rows**, it MUST
  paginate at **200 rows per page**. Only the current page is materialised into the DOM; the page
  navigation buttons (**Previous / Next**) are required and MUST stay reachable, optionally with a
  page-jump selector showing `Page n / total`. The navigation sits at the **top** of the card, in the
  same tool cluster as the filter and export controls. The tool cluster reports the position
  (e.g. `Page 2 / 5 · 1,024 rows`); the **full row count is always communicated**. CSV / export
  MUST cover the **entire filtered set**, not only the visible page (§7.1). Pagination takes
  precedence over Windowing (§7.2.8) for large tables: a paginated table does not also window.
- **Pagination control behaviour (normative).** Previous / Next and the page-jump selector MUST
  change only the current page of their own table. They MUST NOT change the active view and MUST NOT
  reuse the sidebar navigation attribute (`data-page`): a non-page value such as `prev` falls through
  a `views[page] || overview` dispatcher and silently lands on the default Overview view. The pager
  MUST use a distinct attribute, and the navigation handler MUST accept only real page names. A
  filter change MUST repaint the table, its row count and the page total at once and reset to page 1;
  a bare boolean attribute used as a filter hook MUST be detected with `hasAttribute`, because its
  `dataset` value is `""` (falsy). `⤓ CSV` MUST download the **full filtered set**, not only the
  visible page (§7.1).
- **Print (§7.2.11).** `.tableScroll` MUST be released inside `@media print`, otherwise the 340 px
  cap clips every long table in the exported PDF.
- **Panel title must not hard-code the filter value.** Name the panel after the *view*
  (`PO Look-Ahead`), not after the current selection (`3-Month PO Look-Ahead`) — the horizon is
  a user control, so the title describing it goes stale the moment the user changes it.

#### Horizon / range filters
When a list is scoped by a time window, expose the window as a **segmented control** (§7.5) in
the panel's control row, not as a hard-coded constant:

- Typical options: `1m / 2m / 3m / 4m / 6m`, default `3m`, persisted via a dashboard preference key.
- The horizon is measured in **calendar months** (`new Date(y, m + n, d)`), never a fixed day
  count such as `+90 days` — a day count drifts against the calendar and does not mean what the
  label says.
- Changing the horizon **re-renders only that panel**; the last data set is cached by the
  renderer so the control can redraw without a full dashboard reload.
- The control sits in **one row** with its label and the count text (same rule as §4.2's period
  window): `flex-wrap:nowrap; align-items:center`, count text `margin-left:auto`.

#### Look-ahead lists — general requirement
A **look-ahead** is any panel answering *"what is coming up in the next N periods"*. Every
look-ahead list must satisfy all of the following, on every dashboard:

1. **It is a data table** in a bounded scroller (§4.3 above) — not a prose list, and not a chart
   of the same rows. Rows are one record each; no duplicated paragraph text.
2. **Forward-looking only.** The window starts at **today / the operational as-of** — never at the
   project start. Anything already **completed is excluded**: if the tracked milestone has an
   *Actual* date, the item is done and must not appear in a forward-looking list (this is the same
   canonical done-rule as Overdue — *Actual present ⇒ stage complete*).
3. **Sorted ascending by the due date**, so the soonest item is always the first row.
4. **Shows the distance to the due date** as a numeric, right-aligned column (`.num`, tabular
   figures) — e.g. `In (days)` — so urgency is readable without mental arithmetic.
5. **Carries the current status** column so the reader can see at a glance whether the item is
   still open.
6. **The window is a control, not a constant** — exposed as the horizon filter above. Never
   hard-code `90 days` or any other span, and never require a metadata/config row just to widen
   the window.
7. **The panel title names the view, not the selection** (`PO Look-Ahead`, never
   `3-Month PO Look-Ahead`) — the horizon is user-changeable, so a title carrying it goes stale.
8. **The row count is reported in the control row** (`… (N packages)`), because the list is
   clipped by the scroller and the reader cannot count rows to get the total.
9. **It offers a `⤓ CSV` download** (§7.8) in the same control row as the horizon filter. The
   exported rows must be **exactly the rows on screen** — same filter, same sort, same horizon —
   so the renderer caches the resolved list and the exporter serialises that cache rather than
   re-deriving it (re-deriving risks a silent mismatch). Empty list ⇒ `Nothing to export` toast,
   never an empty file.

- A look-ahead is the mirror image of an **overdue / delay** list: overdue is backward-looking
  (`due < as-of`), look-ahead is forward-looking (`as-of ≤ due ≤ as-of + horizon`), and the two
  must never overlap because of rule 2.

### 4.4 Drill-down (row detail) — accordion, one open at a time

Expandable detail inside a table row (metadata + stage grid + that row's issues). The class names and
tokens below are **normative** (§7.2.0); a dashboard MUST use them verbatim and MUST NOT substitute
its own.

**Standard class names (normative).**

| Class | On | Role |
|---|---|---|
| `.expandable` | the owner `<tr>` | marks a row that owns a `.sub` detail; adds the pointer cursor and row hover |
| `.drill-cell` | the owner row's first `<td>` / `<th>` | narrow, centred cell that holds the drill button |
| `.drill-btn` | a real `<button>` in `.drill-cell` | the expand control (§7.1 B4); an `.icon-btn` variant carrying `aria-expanded` + `aria-controls` |
| `.drill-chev` | the `<span>` inside `.drill-btn` | the `▸` glyph; rotated 90° when the button is expanded |
| `.sub` | the sibling `<tr>` detail | the drill-down child row (§7.2.0) |
| `.sub-inner` | the `<div>` inside `.sub > td` | padded content wrapper |

**Behaviour (normative).**

- **Only one detail may be open at a time.** Opening a row closes any other open row before it opens.
  A stack of expanded details turns a bounded list back into an unbounded wall of nested content,
  which defeats §4.3.
- **The drill column is conditional (normative, rev 1.94 / I150).** A table renders its `.drill-cell`
  column only when at least one row in the current view is expandable (its detail holds more than one
  record). When every row has a single record — for example a month view where each document has one
  submission — the column, the `.expandable` row class and row shortcut, the `.sub` detail rows and
  the locked "Row" item in the Columns chooser MUST be omitted, so the first visible column is the
  primary data column. Otherwise a redundant pinned white column appears before it. All-months and
  multi-record views keep the standardized drill-down unchanged.
- **The control is a real `<button>`** (`.drill-btn`) — never a `<td>` or a `<div>` with
  `role="button"` (§7.1 B4). It carries `aria-expanded` and `aria-controls` pointing at the `.sub`
  detail.
- **The whole row is a pointer shortcut.** A click anywhere on the `.expandable` row toggles the same
  detail. The button stays the accessible control; the row click MUST NOT replace it.
- The `.sub` detail is a sibling `<tr>` with `hidden` toggled; the `.drill-btn` and the detail are
  updated together, including when the accordion closes the row *programmatically*.
- Rows are operable by **pointer and keyboard**: the button is natively focusable (Enter / Space); a
  delegated listener on the table container also handles Enter / Space on `.expandable` rows.
- The expand affordance is the chevron `▸` (`.drill-chev`) **rotated 90°** when the button is
  expanded — by CSS, not by swapping the glyph. `▾` is never used as a separate glyph.
- **The drill cell shows no truncation mark.** `.drill-cell` holds one button and truncates no text,
  so it MUST NOT paint an ellipsis. `.ds-table` cells inherit `text-overflow:ellipsis`, which draws a
  clipped ellipsis at the cell edge when the content box is not wider than the button. `.drill-cell`
  therefore sets `overflow:hidden` and `text-overflow:clip`. The rule MUST out-specify the base cell
  rule (`.ds-table th, .ds-table td`, specificity 0,1,1). Written as a bare `.drill-cell` (0,1,0) it
  loses the cascade, and both the 4 px padding and the clip are dropped.
- Re-rendering the table (e.g. after a filter change) collapses everything — detail state is not
  preserved across a rebuild, which is acceptable because the row set has changed.

**CSS (normative tokens).**

```css
.expandable{cursor:pointer}
.expandable:hover{background:var(--soft)}
.ds-table .drill-cell{width:32px;text-align:center;padding:0 3px;overflow:hidden;text-overflow:clip}
.drill-btn{appearance:none;border:0;background:transparent;color:var(--muted);
  width:26px;height:26px;min-height:26px;line-height:1;cursor:pointer;border-radius:4px}
.drill-btn:hover{background:var(--soft);color:var(--navy)}
.drill-btn:focus-visible{outline:2px solid var(--blue);outline-offset:1px}
.drill-chev{display:inline-block;transition:transform .12s;font-size:11px}
.drill-btn[aria-expanded="true"] .drill-chev{transform:rotate(90deg)}
.sub > td{padding:0;border-top:1px dashed var(--line);background:var(--soft)}
.sub-inner{padding:12px 16px 14px}
```

**Token rules.** Use `--line` for the hairline (the `dashed` `.sub` top edge), `--soft` for the detail
background and hover, `--muted` for the chevron, `--navy` for its hover, and `--blue` for the focus
ring. Do not hard-code colours (no `#fafbfc` / `#f3f7fc`).

---

### 4.5 Validation panels (per-package data issues) — rev 2026-11-18

Shows the **row-level validation results produced by S3** (filter-independent, run once at
load). It is **distinct from** the §3.5 system/config warning bar: that bar carries only
*system/config* notices (missing columns, row-count mismatches) plus the fatal `W-FORMULA`
exception; the Validation panel carries the *per-package data* issues. Both can be present at
once.

**Components, in this order (two independent top-level panels, rev 1.95 / I151):**

1. **Panel 1 — `Validation Rules`.** One chip subtitle row, then the rule reference table. The panel
   carries no meta note and no card title. The table shows `severity · code · group · description ·
   count`, **one row per fired rule code** (de-duplicated). **Never individual per-rule cards.**
   Wording priority: the Error table on the Code sheet is the source of truth; if a code is absent
   there, the dashboard supplies the description (flagged as such). Its tool row carries `⤓ CSV` and
   `Columns` only. No row count is shown in that tool row.
2. **Panel 2 — `Validation Issues`.** One chip subtitle row, then the per-issue table. The panel
   carries no meta note and no card title. The tool cluster sits at the **top** — **page controls on
   the left** (`‹ Prev · Page n / total (jump) · Next › · N rows`) and the **error-code panel-local
   filter + `⤓ CSV` + `Columns` on the right** — then the issue list, an instance of `.tableScroll` /
   `.ds-table` (§4.3 & §7.2).

**Chip subtitle (normative).** Each panel has exactly one `.pchip-row[data-panel-subtitle]`
directly under its title and before its `.c-card`. The row holds counts only, in one line. Panel 1
shows `Loaded rules` (violet) = the rule catalogue size and `Fired rules` (neutral) = the number of
distinct fired codes. Panel 2 shows `All issues` (green) = the globally filtered issue count,
`Shown issues` (neutral) = the count after the code filter, and the three severity chips
(`.vchip.e / .w / .i`) **in the same row**. The `data-validation-count` hook sits on the
`Shown issues` count and MUST be unique in the page. No funnel glyph applies to these chips. The
`Shown issues` count follows the code filter; the severity chips and Panel 1 do not. The former
plain-text meta line (loaded fields · log headers · rule text source · D33) is removed from the panel
body and lives in Help (§7.9).

**Layout rules (normative).**
- **Independent panels.** The two panels are top-level and stack in document order. The Settings
  layout control does not change them. `data-panel` numbers them 1 and 2.
- **One chip row per panel.** The chip row sits on its own line before the `.c-card`, aligned to the
  panel content edge. The `.v-chip-row` modifier adds a 12 px bottom gap. All chips stay in one row;
  no second summary row is rendered.
- **No meta note and no card titles.** The former panel-level `.note` is removed. Neither table
  renders an `h3.tt` card title. Long explanation stays in Help (§7.9).
- **Tool rows.** Each keyed table keeps one `.table-tools` row with filters on the left and actions
  on the right (§4 rev 1.91). The rule table omits its row-count label. The issue table keeps its
  top pager, page-jump total and row total.
- **Tool-cluster controls are local.** The page controls, error-code filter, `⤓ CSV` and `Columns`
  act **only** on the Issues table and MUST leave the active sidebar page unchanged. Selecting a code
  MUST immediately repaint the table, the `Shown issues` count and the page-jump total, and reset to
  page 1. `⤓ CSV` MUST download the full filtered set. These are the I114 / I115 invariants.
- **Wide detail columns.** Default column widths give the focus columns the most room: rule
  reference **Description** (≈420 px) and per-issue **Message** (≈360 px) and **Value** (≈130 px).
  Severity and Rule stay pinned on the left when the table scrolls.

**Per-issue table columns:** severity **first**, then `Rule · Doc No · Field · Value · Message`
(+ `Source Tab` / `Row` where the dashboard tracks them). Severity renders as a **bare `.sev`
glyph** — a **fixed-size inline SVG** (14×14, `role="img"` + `aria-label`, §7.2.4), one shape
per tier (red circle-cross / amber triangle / blue circle-i), *not* the colour-emoji `⛔ ⚠️ ℹ️`
whose per-glyph font metrics inflate the row and differ between severities. **The `.sev` glyph
must be flat: no filled circular / pill background, no `border-radius`, no padding** — it sits
inline inside the cell without overlapping cell borders. The glyph lives on an **inner `<span>`**
that carries `.sev-error` / `.sev-warning` / `.sev-info`; that class MUST NOT be applied to the
`<td>` (§7.2.4). This applies to **both** the per-issue table *(c)* and the Rule Reference table
*(b)* (`#vref`), which share those classes. (Distinct from the §4.5.2 `.vchip` summary chips,
which keep their 6 px shape with colour fill and are not in a table, so the emoji is
allowable there.)

- **Field** = the column the *business rule* (Code-sheet Error block) checks — a real source
  column name (e.g. `Actual 1st Issue Date`, `Latest Approval Date`, `Rev`, `CUESH Discipline`).
- **Value** = the *validation result* — the specific offending cell value the pipeline found,
  **never** a pass/fail flag.

**Pagination, not truncation.** The Issues table paginates at 200 rows per page (§4.3); page
navigation buttons (**Previous / Next**, plus a page-jump selector) are required whenever there is
more than one page. The full filtered count is reported in the tool cluster and in the
`Shown issues` chip. A panel-local **error-code filter** narrows the list further (it affects only
the Issues panel, never the Rule Reference panel, per §7.2.7 pt 6); CSV / export covers the **full
filtered set**. Empty state: zero issues → `.empty` caption in the table.

**Help.** The Help modal (§7.9) carries the longer explanation, including the rule text source and
the D33 statement. The panel bodies keep counts only.

*Cross-refs:* table base §7.2 · scroller §4.3 · severity symbols §3.5 · panel count chips §4 rev
1.93 · panel action cluster §4.1.

---

### 4.6 Chart hover floating window — standard (rev 2026-11-01)

A **hover floating window** is the single reusable component that shows per-point / per-card detail on pointer hover or keyboard focus over any chart board or KPI card. It is distinct from the §7.1 *click-triggered* floating panels (filter / column choosers). This section standardizes the **window shell only**; the **content** (which fields, units and series rows appear) is defined per chart in the workplan § and is out of scope here.

**Scope (normative).** The standard applies to every chart board — C1 S-curve, C2 Submission Flow, C3 Breakdown, C4 Turnaround & Aging — and to the Bottleneck KPI cards. A chart that shows point detail MUST use this component; native SVG `<title>` tooltips are NOT an accepted substitute (issues I090 / I082).

**Component & classes.** One window class `.chart-tip` and one snap-line class `.chart-snap`. The snap line is REQUIRED for charts with an X-aligned native attached table and optional elsewhere (§4.2 rev 1.75). These replace the divergent `.scurve-tip` (C1) and `.c2-tip` (C2).

**Visual contract (tokenized, normative).** The window uses only design tokens — `background:var(--surface)`, `border:1px solid var(--border)`, `border-radius:8px`, `box-shadow:var(--shadow)`, `padding:8px 10px`, `font-size:11px`, `font-variant-numeric: tabular-nums`, `line-height:1.45`, `color:var(--text)`, `max-width:230px`, `z-index:30`, and `pointer-events:none`. It MUST follow the active theme (light/dark) automatically — no hard-coded surface or text colour (this removes the C2 dark `.c2-tip`, which is non-compliant).

**Content layout.** Three zones: (1) a bold **header** carrying the hovered identity (month, dimension value, or KPI name); (2) **body rows**, each `swatch · label · value` in a two-column row with a fixed label column; (3) a **footer** separated by a single top border, carrying any totals / percentages. **Value alignment (normative, rev 1.98).** A text value MUST align left in the value column, immediately after its label. A numeric value MUST align right in the value column. This rule applies to body rows and footers in every hover window. One unified footer style MUST be used across every chart (no per-chart bold/normal divergence — I084). The series swatch MUST use the on-chart series **token**, never a hard-coded hex. **Series colour tokens MUST be unique per semantic** — two distinct series MUST NOT share a hue (e.g. Actual and AWC, or Forecast and Resubmission, MUST NOT be the same colour — I083). Units are explicit: durations show `d` (one decimal), counts are plain integers (label "docs" only if ambiguous), and zero is shown as `0`, never blank.

**One-datum swatch placement (rev 1.96 / I153).** When all body rows describe one datum with one series color, the window MAY show that series swatch once in the header instead of on each body row. This exception applies only when the header swatch uses the same on-chart series token. The body rows then use `label · value` with the same two-column value alignment. Multi-series windows and aggregate windows keep one swatch on each body row.

**Trigger & dismissal (normative).** `pointermove` / `mousemove` opens the window; `mouseleave` (and `blur`) closes it. Hovering empty chart area MUST snap to the nearest datum (no dead zone). A **touch / no-hover variant is REQUIRED**: on touch devices the window shows on tap (tap-to-show, tap-away to dismiss); the dashboard MUST NOT silently leave point detail unreachable on touch (I082).

**Hidden-window ARIA state (normative, rev 1.63).** When the window is hidden — on `mouseleave`, `blur`, `Escape`, an outside click, a period reflow, or a cursor move into an attached table — it MUST carry `aria-hidden="true"` **and** contain no text. Before it is shown again the attribute MUST be removed and the current datum's content written. The board's persistent `aria-describedby` link stays intact. An element **directly referenced** by `aria-describedby` can still be exposed by assistive technology despite `aria-hidden`, so clearing the text is REQUIRED: the ARIA attribute alone does not prevent a screen reader from announcing a stale month over an unrelated cell.

**Attached-table touch variant (rev 1.74 / 1.75).** For any chart with a native attached table whose columns share the chart's X positions (§4.2 rev 1.74 / 1.75), the §4.6 touch tap-to-show requirement applies to the **chart area**. A tap on a table cell MUST still activate the shared chart ↔ table column highlight, the column band and the centre line (§4.2 rev 1.75), but need not open the floating window: the cell value and its row / column `<th>` headers are already exposed by the native table accessibility tree, so point detail is not unreachable (I082). A dedicated table-cell tap affordance is a workplan follow-up, not a blocker for the pointer implementation.

**Positioning & edge handling (normative).** For chart boards the window is **cursor-relative** at a `(+14, +14)` px offset and MUST clamp on **all four edges** — flip left when it would overflow the right edge, flip up when it would overflow the bottom edge, and clamp left/top to `≥4 px` — so it never escapes the chart host. For **KPI cards** the window is placed **below the card**, centred and left-clamped, so it never covers the card; placement MAY vary by host, but a card's own window MUST NOT obscure the card.

**Affordance (normative).** An interactive chart board MUST signal hoverability with `cursor:crosshair` (or an equivalent hover affordance); KPI cards carry `cursor:help`. Without this, users cannot discover the window (I080).

**Snap line (REQUIRED for attached-table charts, rev 1.75).** `.chart-snap` is `stroke:var(--text3)`, `stroke-width:1`, `stroke-dasharray:3 3`; it spans only the plot area, is hidden until hover, and snaps to the nearest datum (`min |cx − ux|`; 2-D nearest for radial charts). Every chart with a native attached table whose columns share the chart's X positions MUST carry ONE `.chart-snap` line and MUST place it at the active column's centre from BOTH hover directions (§4.2 rev 1.75). For every other chart the line stays optional. It is omitted on radial charts (e.g. the C3 pie) where a vertical line is meaningless.

**Data plumbing.** The board carries `data-points` (each `{cx, optional cy, html}`) and `data-geo` (`{W, H}`). The per-point `html` is authored by the chart's workplan §; the binder only presents it. Geometry is required for positioning and nearest-datum selection.

**Motion (normative).** A short **opacity-only** transition (≤120 ms) MAY be used on show/hide; the window position MUST NOT transition (no trailing/lag). The binder MUST update the window only when the active datum changes — it MUST NOT re-render content on every `mousemove` (I085 / I086).

**Accessibility (normative).** The window carries `role="tooltip"`. The chart board MUST be focusable (`tabindex="0"`) and the window MUST also show on `focus` (keyboard / screen-reader parity); link it with `aria-describedby`. Secondary text contrast MUST be ≥4.5:1. Colour is never the sole series cue — every series row carries a textual label.

**Containers (normative).** The chart host and its ancestors MUST be `overflow:visible` so the window (and any flipped / below-card placement) is never clipped (I088).

**Lifecycle (normative).** The behaviour is delivered by **one delegated binder** attached to the chart host — not re-bound on every render and not duplicated per chart.

---

### 4.7 Panel spacing (normative, rev 2026-11-01)

Two or more top-level panels on one page MUST be separated by **14 px** — the same spacing the panel
margin defines. The separation applies **between rows and between columns** when a page lays panels
out in more than one column.

**Mechanism.** The page's panel container SHOULD be a grid that sets `gap:14px`; inside such a
container the panel margin MUST be `0` (see §4). Where the panels are not in a grid, the panel's own
`margin:14px 0` supplies the same 14 px. The two mechanisms MUST NOT be combined (that doubles the
spacing).

**Invariants.**

- The separation MUST NOT be `0`: two panel borders must never touch.
- Panels hidden by page routing take no space and contribute no gap of their own.
- Print keeps the same separation; panels are never merged or overlapped to save space.
- The spacing between **panels** is independent of the spacing between **cards inside a panel**:
  16 px between chart cards (§4.1) and 12 px between the validation cards (§4.5).

**Enforcement.** Harness Tier 2 and the per-dashboard browser suite measure border-to-border distance
between visible panels on each page (spec §8.2 assertion 19).

---


## 5. KPI Overview Panel

- First panel on every dashboard, outside the panel grid. Title `KPI OVERVIEW`, inline `?` (help,
  **left**) and `−` (collapse, **right**) buttons in the right-aligned action cluster, corner panel
  number. The KPI panel stays full width at every `Panel Columns` value; that control changes the
  panel grid only (§3.1 rev 1.87).
- **KPI cards use a 6 / 3 / 2 responsive grid (normative).** The grid holds six columns at wide
  widths, three columns at 1100 px or less, and two columns at 880 px or less. Use
  `grid-template-columns:repeat(6,minmax(0,1fr))` with a 10 px gap (§18.10) and two media queries at
  `max-width:1100px` and `max-width:880px`. Do not use `auto-fit` here: it can yield five or four
  columns, which the 6 / 3 / 2 contract forbids. A KPI density control, where offered, MUST have
  these three states only and MUST NOT introduce other column counts.
- The KPI panel carries **no subtitle** — the per-panel explanation lives in the Help modal
  (§7.9). Do not duplicate explanatory copy in the panel body.

### KPI card
- **Size (normative)**: height **72 px**, width **210 px or more**, `box-sizing: border-box`.
  The height is 4 px of border + 20 px of padding + 48 px of content. It does not change with
  the number of digits. Do not clamp, truncate or scroll the card content.
- White surface, 1px `--border`, **3 px coloured top strip**, radius 8 px, padding 10 px.
- **No box shadow.** A KPI card is flat. `--shadow` (§6) does not apply to it.
- **Number** (`.v`): 22 px, weight 700, colour `--navy`. 28 px is for a single hero KPI only.
- **Label** (`.l`): 10 px, uppercase, `--muted`, `margin-top: 2px`.
- **Do not set `line-height` on `.v` or `.l`.** The inherited 1.45 from the page body is what
  makes the card 72 px high. An override changes the height.
- **Exactly two lines.** A card contains one `.v` element and one `.l` element and nothing else.
  It has no sub-status line, no icon, no gauge, no third line and no nested card.
- **Status strip — five states.** The top strip carries the status. Use one class at a time.

  | Class | Meaning | Token |
  |---|---|---|
  | *(none)* | no status | `--blue` |
  | `.ok` | ok | `--green` |
  | `.amb` | attention | `--amber` |
  | `.warn` | bad | `--red` |
  | `.muted` | not applicable, inactive | `--slate` |
  | `.err` | data error | `#8E24AA` |

  The class name states the colour, not the English word. `.warn` is red and `.amb` is amber.
  Never describe `.warn` as "amber", and never put `.amb` and `.warn` on one card.

### KPI card CSS (normative example)
```css
.kpis{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}
@media(max-width:1100px){.kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:880px){.kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
.kpi{box-sizing:border-box;height:72px;padding:10px;background:var(--surface);
  border:1px solid var(--border);border-top:3px solid var(--blue);border-radius:8px;
  box-shadow:none}
.kpi .v{font-size:22px;font-weight:700;color:var(--navy)}
.kpi .l{font-size:10px;color:var(--muted);text-transform:uppercase;margin-top:2px}
.kpi.ok{border-top-color:var(--green)} .kpi.amb{border-top-color:var(--amber)}
.kpi.warn{border-top-color:var(--red)} .kpi.muted{border-top-color:var(--slate)}
.kpi.err{border-top-color:#8E24AA}
```

> Note: **22 px is standardised** for compact KPI strips. Use 28 px only for a single hero KPI.
> A hero card is exempt from the 72 px height. Record that exemption as a deviation (§8.4).

---

## 6. Project-local design tokens

Each dashboard defines the design tokens in its project-local UI stylesheet. Do not load dashboard
styles from `/common/`. Use the semantic names in the examples below and keep their meaning and values
consistent across dashboards. Define token values for all five themes in `AGENTS.md` §18.4. Use system
font stacks from `AGENTS.md` §18.1; do not require a CDN font.

The shell layout, typography, spacing, and semantic color tokens are part of this shared dashboard
spec. A project may add tokens for its domain, but it MUST NOT change the shared token meanings or
shell geometry. The harness checks shell geometry; theme and contrast checks belong to the applicable
harness tier and dashboard test suite.

### Spacing scale
`4 · 8 · 12 · 16 · 24 · 32 · 48` px. (8 pt-based; use consistently.)

### Radius
- Panel: **10 px** · Card / KPI: **8 px** · Button: **6 px** · Input/select: **8 px**.

### Typography (normative)
- **One shared font stack.** Every dashboard MUST define `--font-ui` with this same stack, so text
  renders identically across dashboards:
  `'Segoe UI', system-ui, -apple-system, 'Inter', 'Source Sans Pro', Roboto, Helvetica, Arial, sans-serif`.
  These are system fonts; no CDN font is loaded (`AGENTS.md` §18.1).
- **One shared type scale.** The sizes below are normative for the elements named. A dashboard MUST
  NOT substitute its own size for them, and MUST NOT introduce a per-dashboard variation.

  | Element | Size | Weight |
  |---|---|---|
  | Body copy | 13 px / 1.45 | 400 |
  | Panel title `h2` | 13 px, uppercase | 600 |
  | Chart-card title `h3` | 13 px | 700 |
  | KPI value (compact strip) | 22 px | 700 |
  | KPI label | 10 px, uppercase | 400 |
  | Icon button (A4) | 13 px | 600 |
  | Menu-bar control (§3.1) | 12 px | 600 |
  | Filter trigger (B1) | 12 px | 600 |
  | Filter menu row (B3) | 12 px | 400 |
  | Filter count badge | 10 px | 700 |
  | Native single-select (B5) | 12 px | 600 |
  | Title-bar project title | 17 px | 600 |
  | Title-bar dashboard title | 12 px | 500 |
  | Title-bar meta line | 11 px | 400 |
  | Status / system banner | 12 px | 400 |
  | Severity chip `.vchip` | 11 px | 700 |
  | Panel count chip label (`.pchip`) | 11 px | 700 |
  | Panel count chip count (`.pchip b`) | 13 px | 700 |

- **Reference.** MDL is the reference implementation of this scale. A dashboard that drifts from it
  renders the same content at a different size, which is the drift this clause prevents.

- **Recommendation.** When rendering tabular numerical data within `.ds-table` cells, use `font-variant-numeric: tabular-nums` to ensure digits align in vertical columns. This applies to all tables containing numeric values and is consistent with the spec's SSOT principle (§10) for global parameters that outlive a single function.

### Shadow
- Subtle only: `var(--shadow)`. No large/decorative shadows.

### Semantic & tint tokens
Components MUST use the semantic tokens defined in the project-local UI stylesheet for status and tint surfaces. The stylesheet must define all tokens that component rules use. Every dashboard uses the five themes from `AGENTS.md` §18.4;
a dashboard MUST NOT add a separate theme system or a local dark-theme override.

### Token inventory (normative)
The project-local UI stylesheet MUST define every token below. Components reference these names only; no rule hard-codes a value.

| Token | Value | Use |
|---|---|---|
| `--btn-h` | `32px` | Min height of every text-bearing button (§7.1 rev 1.71) |
| `--seg-h` | derives from `--btn-h` | Segmented-control height (§7.5 B2.1) |
| `--panel-gap` | `14px` | Gap between top-level panels (§4.7) |
| `--panel-pad` | `14px` | Panel border → content (§4.2 rev 1.80) |
| `--panel-title-gap` | `10px` | Panel title → card (§4.2 rev 1.80) |
| `--c3-card-pad` | `12px` | Chart / table inset inside the card border (§4.2 rev 1.80) |
| `--tool-pad` | `12px` | Equal padding on all four sides of every panel tool row (§4 rev 1.99) |
| `--tool-gap` | `10px` | Gap between control groups in every panel tool row (§4 rev 1.99) |
| `--c3-tool-pad` | `var(--tool-pad)` | C3 alias of the universal tool-row padding (§4 rev 1.99) |
| `--c3-tool-gap` | `var(--tool-gap)` | C3 alias of the universal tool-row group gap (§4 rev 1.99) |
| `--c3-axis-label-h` | `18px` | X-axis label height (§4.2 rev 1.79) |
| `--c3-plot-table-gap` | `calc(var(--c3-axis-label-h) / 3)` = `6px` | Minimized bar-plot → attached-table gap; scales with label height and clears the `0` tick (§4.2 rev 1.80) |
| `--c1-gutter` | `104px` | C1 attached-table gutter (§4.2) |
| `--c3-gutter` | `104px` | C3 attached-table gutter (§4.2) |
| `--sidebar-w` | `160px` | Left navigation sidebar width (§3.2) |
| `--nav-bg` | `var(--navy)` | Left-menu item default fill (§3.2 rev 1.85) |
| `--nav-bg-hover` | `rgba(255,255,255,.1)` | Left-menu item hover fill — a white veil over `--nav-bg`, so it follows `--navy` (§3.2 rev 1.85) |
| `--nav-bg-active` | `#354F6E` | Left-menu item active fill — a lighter step of the `--navy` family, never `--blue` (§3.2 rev 1.85) |
| `--nav-fg` | `#E8EDF3` | Left-menu item text in every state (§3.2 rev 1.85) |
| `--ds-grip-w` | (project value) | Table column-resize grip width (§7.2.13) |
| `--ds-sbw` | (project value) | Table scrollbar width (§7.2.15) |
| `--surface` | theme | App / panel background |
| `--surface2` | theme | Hover / inactive surface |
| `--surface3` | theme | Pressed surface |
| `--navy` | theme | Panel title, segmented active fill, primary ink |
| `--blue` | theme | Action colour, focus ring |
| `--border` | theme | 1 px panel / card border |
| `--line` | theme | Hairline dividers, icon-button border |
| `--muted` | theme | Icon-button glyph, secondary text |
| `--text` | theme | Body text |
| `--text2` | theme | Secondary text |
| `--text3` | theme | Tertiary / meta text |
| `--accent` | theme | Search submit, accents |
| `--green` / `--amber` / `--red` | theme | Status / severity tints |
| `--slate` | theme | Neutral tint |
| `--soft` | theme | Hover background for icon buttons |
| `--ink` | theme | High-emphasis text |
| `--white` | theme | Contrast text on filled buttons |
| `--shadow` | theme | Subtle panel / tooltip shadow |
| `--crosshair-track` | theme | Translucent row / column track tint for `.row-hover` and `.col-hover` (§7.2.16 rev 1.97) |
| `--crosshair-intersection` | theme | Stronger translucent tint for `.cell-hover` (§7.2.16 rev 1.97) |
| `--crosshair-ring` | theme | Inset emphasis ring for `.cell-hover` (§7.2.16 rev 1.97) |
| `--header-crosshair-overlay` | theme | Luminance-adapted translucent overlay for active `<th>` headers, including sticky row headers (§7.2.16 rev 1.97) |
| `--header-crosshair-accent` | theme | Edge indicator accent for active column and sticky row headers (§7.2.16 rev 1.97) |
| `--pchip-blue-bg` / `-border` / `-ink` | theme | Panel count chip, monthly count family (§4 rev 1.92) |
| `--pchip-violet-bg` / `-border` / `-ink` | theme | Panel count chip, total month count family (§4 rev 1.92) |
| `--pchip-green-bg` / `-border` / `-ink` | theme | Panel count chip, accumulated count family (§4 rev 1.92) |
| `--pchip-neutral-bg` / `-border` / `-ink` | theme | Panel count chip, filtered count family (§4 rev 1.92) |

The five crosshair tokens MUST have a value in each of the five themes. Each translucent token MUST
keep the underlying zebra fill visible. No component rule MAY replace these tokens with a literal
colour or a CSS `filter`.

---

## 7. Component Library

### 7.1 Buttons

**Single standard — no per-dashboard button variations.** Every dashboard uses the *same* classes, sizes, colours and hover behaviour, and every action is a real `<button>` element (never a `<td>`/`<div>` with `role="button"`). Buttons fall into three families:

**One text-button height (normative, rev 1.71).** Every text-bearing button MUST share ONE
`min-height:32px` token. This covers A1 / A2 / A3 / A5, the B1 filter trigger, the B2 segmented
button, the B7 column-visibility control, pagination buttons, and any other visible `<button>`
that carries text. A dashboard MUST NOT introduce a shorter text-button variant. Icon-only
buttons are the only smaller controls: A4 and B4 MUST be **26 px square**. A panel MAY change
horizontal padding, font size or emphasis; it MUST NOT change the shared height.

#### A. Action buttons
| Type | Class | Use | Style |
|---|---|---|---|
| A1 Primary | `.btn` / `.btn-primary` | one main action per view highest-emphasis CTA — *Open / Load workbook* only; Print / Save / Export are **not** primary | `--blue` solid, white text, radius 6 px, min-height 32 px |
| A2 Secondary / Ghost | `.btn.ghost` / `.btn-secondary` | low-emphasis alternative / cancel / dismiss; "Load another file" | white, 1px `--border`, **navy** text; **32 px min-height**; hover → `--blue` fill, white text |
| A3 Text action | `.btn-secondary` (glyph + label) | tool / footer-row actions: export, copy, CSV (e.g. `⤓ PNG`, `⧉ Copy`, `⤓ CSV`) | white, **navy** text, glyph + space + label; **32 px min-height**; hover → `--blue` fill, white text |
| A4 Icon / Mini | `.icon-btn` | icon-only: Help `?`, Collapse `−`, Theme, modal close `✕` | `width:26px;height:26px;min-height:26px` — 26 px **square**; radius 6 px; 1px `--line`; `background:var(--surface)`; `color:var(--muted)`; `font:inherit`; **13 px** / 600; `line-height:1`; inline-flex centred. Hover → `--soft` background + `--navy` text. **Must carry `aria-label` + tooltip** |
| A5 Search | `.search-btn` | search submit, affixed to the search input (right edge, single-side radius) | `--accent` fill, white glyph, radius `0 6px 6px 0`, attached to input |

**A3 — one canonical class name (normative).** `.btn-secondary` is the **canonical** A3 class. Every
text action (export / copy / CSV / reset) MUST use it. A dashboard MUST NOT introduce a parallel class
for the same logical control.

**Why the class name is normative, not cosmetic.** The class name is the only link between a rendered
control and the spec rule that governs it. When two dashboards name the same logical control
differently, a style change made to satisfy A3 on one silently misses the other, and no shared
selector exists for a test to assert against. That drift stays invisible until two dashboards are
compared side by side — the precise failure the shared spec exists to prevent. A legacy alias is
therefore **tolerated, never endorsed**: it is written down **in the dashboard's own workplan** so the
divergence is visible and has a defined end state — migration to the canonical name.

**Two consequences of a single shared name (normative).**

- **A text action's class MUST NOT be used as a behaviour hook.** One shared class can no longer
  discriminate two different actions (export vs copy), so behaviour belongs on a **data attribute**
  (for example `data-act="dl"` / `data-act="copy"`) — never on the class.
- **The shared class must be governing, not decorative.** A dashboard MUST wire `.btn-secondary` into
  the rule that actually implements A3 in its stylesheet, so a change to the shared class reaches it.
  A shared class that is declared but not governing is drift waiting to happen.

**Assertion (required).** A conformance check MUST assert that every dashboard carries
`.btn-secondary`, that none introduces a parallel class, and that all declare the same A3 geometry —
the tripwire that stops dashboards drifting apart again (§8).

**Migration status is per-dashboard.** Whether a dashboard already conforms, which legacy names it
shipped, and when it migrated are recorded in its own workplan — never here (§1).

#### B. Selection controls
| Type | Class | Use | Style |
|---|---|---|---|
| B1 Filter trigger | `.tf-btn` | **MULTI-SELECT row filter** — opens a filter menu (Discipline / Stage / Category), distinct from the rows *inside* the menu. **Reserved for controls that narrow rows**; a show/hide-columns control MUST NOT use it (see B7) | text + count badge, radius 6 px, **borderless in the menu bar** — the base control carries 1 px `--border` and the menu-bar chrome strips it; **no caret glyph**; hover → `--soft`; selected → `.is-filtered`, whose visible cue is the count badge |
| B2 Segmented | `.seg button` | single-select among 2–6 inline options (Bar/Pie, month horizon 1m–6m, overdue cases); active `.on` / `.active` = **`--navy`** fill (a *selection* state, not an action). **§7.5 B2.1 is the authoritative standard** | joined group, 1px `--border`, radius 6 px, overflow hidden; **32 px** standard visual height with 12 px / 600 text; inactive hover → `--surface2`; see §7.5 B2.1 for all other states and tokens |
| B3 Filter rows | `.tf-all` + `.tf-item` | multi-select toggles *inside* the B1 filter menu — an `All <dimension>` master, then a hint, a divider, and the value rows | master 12 px / 700; rows 12 px; row hover → `--soft` |
| B4 Drill / Expand | `.drill-btn` (an `.icon-btn` variant) | row drill-down / expand (`.expandable` row → `.sub` detail; `▸ stages`); the button carries `aria-expanded` + `aria-controls` | **must be a real `<button>`** — never a `<td>` or `<div>` with `role="button"`; **26 px square** icon-only geometry (rev 1.71); may be icon or text + icon; the owning `.expandable` row is a pointer shortcut, not the control (§4.4) |
| B5 Native single-select | `.inter-sel` | **SINGLE-SELECT picker** — breakdown dimension, month, type (chart group / matrix Month / Overdue Type); distinct from the multi-select `.tf-btn` filter (B1) and from the `.seg` segmented control (B2) | 12 px / 600, 1px `--border`, radius 8–9 px, white surface, `--ink` text; `:focus-visible` 2 px `--blue` ring; `max-width:260 px`; attached variant `.inter-sel.is-attached` (search-column picker: no own border, left-rounded, right divider) |
| B6 Panel-local filter | `.inter-sel` in the panel's control cluster | a single-value filter that narrows **only the tables inside one panel** (e.g. the issue rule-code filter in the Validation / Issues panel). Resolved in **S5 Render**; it MUST NOT change KPIs, charts, the matrix or any other panel (§7.2.7 pt 6) | as B5 |
| B7 Column-visibility control | own class (`.cc-btn`) | **show/hide columns — a *layout* control, not a filter.** It changes which columns are painted, never which rows are returned. MUST NOT reuse the B1 filter look, filter badge, or `[aria-expanded]` active-filter emphasis | own styling; **32 px min-height** (rev 1.71); MAY reuse the floating-panel shape, but without a count badge or active-filter emphasis |

**Multi-select vs single-select — the grammar (normative).** A filter's chrome is chosen by how many values the user may select at once, not by where the control sits:

| | Multi-select | Single-select |
|---|---|---|
| Control | **B1** `.tf-btn` filter trigger + floating menu | **B5** `.inter-sel` labelled native select |
| Toggles inside the menu | **B3** `.tf-all` master + `.tf-item` rows | not applicable |
| Values at once | many (a checkbox list, plus an "All <dimension>" master) | one (an explicit "All / <dimension>" neutral option) |
| Active-state cue | count badge on the trigger + `is-filtered` emphasis | the chosen value is visible in the control itself |

A user must be able to tell, from the chrome alone, both (a) how many values the control accepts and (b) whether it filters **rows**. B7 exists so a layout control can never be mistaken for a row filter.

#### B2.1 Segmented control standard (rev 1.71; normative)

This subsection is the **authoritative** standard for every segmented control. A panel clause MAY
override a value here only when the owner explicitly approves the override and records it in the
deviations list at the end of this subsection. There is **no `compact` variant** at rev 1.71; the
former Sub C1 preset exception was retired by the owner in favour of the universal §7.1 height.

**Shared tokens (normative).** Define each size, typography and colour value ONCE as a CSS custom
property in `:root`. Every colour value MUST reference a theme token, so all five themes resolve
it at use time. Do not put a hard-coded hex value in a `.seg` rule. Required token groups:
height, padding, font size, font weight, line height, active background / foreground, inactive
hover background / foreground, pressed background, focus outline and disabled opacity. A generator
MUST NOT declare its own dimensions. The segmented `--seg-h` token MUST derive from the universal
`--btn-h` text-button token (§7.1 rev 1.71), so one owner change reaches every button family.

**Variants (normative).** One variant is approved:

| Variant | Group class | Visual height | Typography | Padding |
|---|---|---|---|---|
| `standard` | none | 32 px from `min-height` | 12 px / 600, `line-height:1.2` | the shared base padding token |

No shorter segmented variant is approved. A panel MAY adjust horizontal padding only when the
owner records it here, and it MUST NOT reduce the shared height or the 12 px / 600 typography.

**Colour and states (normative).** The active fill is **`--navy`** with white text. The inactive
hover fill is **`--surface2`** with `--blue` text. An active button MUST NOT change colour on
hover, so the selection state stays stable. A pressed inactive button uses `--surface3`. Every
button carries a `:focus-visible` outline of 2 px `--blue` with `outline-offset:-2px`, because
`.seg` has `overflow:hidden`. On an active button the outline MUST use a high-contrast light
colour: `--blue` on `--navy` measures 2.89:1, below the 3:1 non-text contrast target, while
white on `--navy` measures 13.26:1. A disabled button carries the `disabled` attribute, keeps
its `aria-pressed` value, receives no hover or pressed feedback, and is not focusable. Hover and
pressed selectors MUST exclude `:disabled`.

**Markup and accessibility (normative).** Every group MUST be a `.seg` element with
`role="group"` and an `aria-label` or equivalent accessible name that describes the choice. Every
button MUST be a real `<button type="button">` with a dynamic `aria-pressed` that mirrors its
active class. B2's `.on` is the canonical active class name. The Sub dashboard's `.seg-btn.active`
is an approved alias at rev 1.69, retained so no event handler or state key changes. All `data-*`
attributes, handlers, state keys and repaint paths stay unchanged.

**Dimensions and alignment (normative).** All buttons in ONE group MUST have equal height. Every
group MUST use the shared 32 px height (§7.1 rev 1.71). Groups on one row MAY be centre-aligned by
the row's `align-items:center`, but they MUST NOT differ in height. Visual size and interactive hit
area are distinct: the button box is the hit area. No 44 × 44 px touch rule applies at rev 1.71,
because the dashboards are desktop-first at a 1280 px minimum. If touch support is required later,
add a `@media (pointer: coarse)` variant in a SEPARATE revision.

**Precedence and deviations (normative).** An explicitly approved panel-specific requirement in
§4.2 overrides a common B2.1 default for that panel only. Each override MUST be recorded here
with its panel, requirement, owner decision and revision. Recorded deviations at rev 1.71:

| Panel / dashboard | Deviation | Status |
|---|---|---|
| Sub C1 control row | ONE visual row at 1280 px (`flex-wrap:nowrap`) | Approved, §4.2 rev 1.67 |
| MDL / PPP | Inactive hover `--blue` / `--accent`; no `type="button"` or `aria-pressed` | Recorded, NOT changed in rev 1.69. A cross-dashboard migration is a SEPARATE task. |

The former Sub C1 `compact` preset deviation is **retired** at rev 1.71. Its chips use the shared
32 px height and 12 px / 600 typography; the `seg-compact` class and `--seg-compact-*` tokens are
no longer part of the standard.

**Search panel composition (normative, rev 2026-11-01).** A dashboard whose menu bar offers Search
MUST render its panel as **one row**: an attached column picker (**B5** `.inter-sel.is-attached`) on the
left, the search input in the middle (flexible), and the **A5** submit on the right. The picker MUST
offer an **All columns** option (the default) plus each searchable column, MUST be labelled, and MUST
keep the chosen column visible. Changing the picker re-applies the current query immediately to the new
column and MUST NOT clear it. A query MUST apply only to the selected column; **All columns** searches
the dashboard's defined searchable fields. The row is the panel's only content row.

**Global dimensions are multi-select (normative).** A dimension exposed in the shared global filter
area (§3.1, §3.2) MUST accept **several values at once**, and MUST therefore use **B1** `.tf-btn` with
**B3** `.tf-all` master plus `.tf-item` toggles inside a floating panel and a count badge on the
trigger. A global
filter re-derives the shared `active` set for every panel (§7.2.7 pt 1), so the reader must be able to
select more than one value. A dashboard MUST NOT render a global dimension as a native single-select;
**B5** `.inter-sel` is reserved for single-value pickers that are not row filters (breakdown
dimension, month, type) and for the **B6** panel-local filter. The floating panel MUST open with an
`All <dimension>` master toggle at the top, per the ordering rule below.

**Filter group contents (normative).** The menu-bar filter group MUST contain the global filter
triggers, the Search button with its panel, and the Warnings toggle. Placing Search or Warnings
outside the group breaks the shared grouping and MUST NOT be done.

**Filter class names are normative.** A global filter trigger MUST carry class `tf-btn`, its master
toggle `tf-all`, its value rows `tf-item`, and its panel `tf-panel`. A dashboard MUST NOT invent a
parallel class for the same control.
The reason is the same as for A3 above: the class name is the only link between a rendered control and
the spec rule that governs it, so a parallel name hides the control from every shared selector.

**Floating-panel internal ordering (normative).** Every floating
multi-select panel — the **B1** filter popover and the **B7** column-visibility chooser alike —
MUST lay its contents out in this order:

| # | Region | Rule |
|---|---|---|
| 1 | **Master** | an `All <dimension>` checkbox (`All Disciplines`, `All columns`, …) at the **top**, acting on the panel's whole selectable set |
| 2 | **Note** | the panel's explanatory line, directly beneath the master and above the divider |
| 3 | **Divider** | a 1 px rule separating the header block from the scrollable list |
| 4 | **Item list** | one checkbox row per value — the only region that scrolls |
| 5 | **Footer** | actions and counts only (`Reset to defaults`, `N hidden`) |

The note MUST NOT be placed after the item list. Both panels are `overflow:auto` with a `max-height`
(320 px filter / 380 px chooser), so a trailing note sits below a scrolling list and stays invisible
until the reader scrolls to the very end — while it is precisely the text a first-time reader needs.
The two panels' notes say different things (deferred apply vs immediate apply) and MUST keep their own
wording; only their position is shared.

**Master scope and tri-state (normative).** The master ranges over the **selectable** set only. Where
a panel locks some rows — the chooser's **pinned identity columns are permanently checked and disabled**
— the master MUST be scoped to the remaining (non-pinned) rows and MUST be tri-state: checked when every
non-pinned row is on, **indeterminate** when only some are on, unchecked when none are. A master that
also spans locked rows can never read as checked and would be permanently stuck.
Every item toggle and any reset action MUST re-sync the master (and any footer count), so the header can
never contradict the list below it.

**Selection semantics (normative).** The chrome rules above are not sufficient. The *state* behind the
panel MUST also agree with the rows the dashboard paints.

- **Initial state.** A dimension opens with **every** value ticked, except documented exclusions: the
  chooser's pinned identity columns, and any value the project deliberately excludes. A master that
  starts blank while the dashboard filters nothing is a defect.
- **Blank is a value.** An empty cell is selectable and reads `(blank)`, so the full tick set covers
  every row and no row disappears unseen.
- **Empty means none.** An empty tick set MUST filter every row out. An **absent** set is the only
  "no filter" state. A filter control MUST NOT mean "no filter" while it shows nothing ticked.
- **Immediate apply, panel stays open.** A tick applies at once and MUST NOT close the panel. An
  outside click or `Escape` MUST close it.

#### C. Indicator (not a button)
| Type | Class | Use | Style |
|---|---|---|---|
| C1 Status pill | `.pill` | status / count badge — **not an action** | 10 px / 600, radius 999, semantic colour variant |

- **Font:** 12–14 px / 600 (A4 icon buttons **13 px**). The §7.5 B2.1 `compact` variant is the
  only approved 11 px exception.
- **Hover (A2 / A3):** `--blue` fill, white text — *not* a `--soft` tint.
- **A1 Primary** keeps `--blue` (the *action* colour); the **B2 segmented active state** is `--navy` (a *selection* state) — different semantics, intentionally different colours.
- **Modal is a container, not a button type:** its close `✕` = A4; its footer actions = A1 / A2 / A3.
- **A4 is used ALONE, and must stay 26 px square.** `.icon-btn` is never combined with `.btn`
  If an element has to carry both, `.icon-btn` **must declare its own
  `min-height:26px`**: CSS resolves `min-height` *over* `height`, so a bare `height:26px` still
  renders **32 px** tall — A1/A2/A3 carry `min-height:32px` — while the source still reads
  "26 px square" and passes a text-only check.
- Inline panel actions sit in the title row, **right-aligned** as a cluster (see §4); within the cluster Help `?` is left of Collapse `−`.
- **Text contrast is mandatory (WCAG AA).** Every control's label must meet AA contrast against its *own*
  effective background — ≥ 4.5:1 for normal text, ≥ 3:1 for large/bold or UI text. A borderless/ghost rule
  must **never** leave white text on a white or transparent background: the Primary CTA (A1) keeps its solid
  `--blue` fill + white text, and pinned/sticky header buttons keep the header fill.
  **Toggle/pressed states must also keep their fill** — e.g. the Warnings button when the bar is collapsed
  carries `aria-pressed="true"` (white text); a `background:transparent` ghost rule must not override that
  pressed fill and drop the label onto the page background. Enforced by the layout harness **Tier 4d
  `controlContrast`** check, which forces the Search panel, each filter-chip dropdown, and the pressed
  warning-toggle open and fails any control below 3:1 contrast or with no accessible name (§8).
  **Each dashboard records its enforcement posture** — *hard* (a failure blocks release) or *advisory*
  (reported, not blocking) — **in its own workplan**, together with the regressions that produced the
  rule. The posture is a project decision; the contrast requirement itself is not.
- **A control's label/title is stable and must not invert its verb with state.** A toggle button's
  accessible name describes the control, not the result of the next click: the `Warnings` toggle therefore
  always reads **`Warnings`** with the count in its badge (`[N] Warnings`), and never flips to `Show warnings`
  / `Hide warnings` when collapsed/expanded. A label that changes verb with state is both confusing and a
  contrast risk (it can force a different colour pair).
- **Control label casing (mandatory).** Every visible label of an interactive control MUST use
  **title case**: capitalize the first letter of every word (`Choose Workbooks`, `Show Warnings`,
  `Remember File Names`). Do not use sentence case (`Choose workbooks`, `Show warnings`).
  *Applicable cases* are: button labels — action, toggle, and icon buttons with visible text
  (`☰ Navigation`); a `<label>` rendered as a button, such as a file-picker label; the label of a
  form control — checkbox, radio, or select (`Show Warnings`, `Remember File Names`, `Theme`); and
  navigation and menu items. *Excluded cases* are: prose and body text, sentences, hints, status
  messages, placeholders, data values, and `title` / `aria-label` attribute wording.

### 7.2 Tables (`.ds-table`) — rev 2026-10-15

> **Why this revision exists.** The pre-2026-10-15 §7.2 specified *appearance and semantics
> only*. Because none of it was enforceable, both shipped dashboards produced tables that are
> semantically correct (`<table>` + `<th scope>`) yet visually ragged and interaction-free — most
> visibly a severity column whose row height and baseline differ from every other column in the
> same row. §7.2.1–§7.2.12 below add the **normative interaction and typography contract**.
> Every **MUST** is a testable acceptance criterion.

One common table style for **every** tabular view. Data tables (benchmark, look-ahead,
overdue) and issue tables (validation) all use `.ds-table`; issue tables add severity + optional
row drill-down on top of the same base — never a second, divergent table style.

**Every data table has ONE outer border (normative, rev 1.81).** Every `.ds-table` MUST show a
visible outer border — `1px solid var(--border)` with the §4 rounding (`border-radius:10px`) — on
every dashboard, in every panel. The border MAY come from the table's own `.ds-split` wrapper
(§7.2.15), from its owning `.c-card` (§4), or from the table element itself; exactly ONE visible
outer border remains, so the §4 single-border rule (a `.c-card:has(.ds-split)` drops its own
border) still applies. A table MUST NOT render without an outer border.

#### 7.2.0 Normative class names
These class names are **normative** and MUST be used verbatim. A dashboard MAY add its own
classes alongside them but MUST NOT substitute them; panel / container class names remain free
(§4).

| Class | Role |
|---|---|
| `.ds-table` | the one table style (`.ds-table.compact` = dense numeric variant, §7.2.3) |
| `.tableScroll` | bounded scroller (§4.3); `.vtableWrap` is its validation instance |
| `.num` | right-aligned numeric cell with tabular figures |
| `.empty` | empty-state cell |
| `.over` | overflow-highlighted row |
| `.sub` | drill-down child row (§4.4) |
| `.sub-inner` | padded content wrapper inside `.sub > td` (§4.4) |
| `.expandable` | the owner `<tr>` of a `.sub` drill-down detail (§4.4) |
| `.drill-cell` | the narrow, centred cell holding `.drill-btn` (§4.4) |
| `.drill-btn` | the real `<button>` expand control (`.icon-btn` variant, §4.4) |
| `.drill-chev` | the `▸` glyph inside `.drill-btn`, rotated when expanded (§4.4) |
| `.matrix` | cross-tab variant (§7.2.9) |
| `.th-wrap` / `.lb` | flex wrapper inside `<th>`, and the header label span inside it |
| `.ds-sort` | the real `<button>` inside a sortable `<th>` (§7.2.6) |
| `.ds-pinned` | a pinned (frozen) cell — a property of the column, not the position (§7.2.13) |
| `.ds-pinned-edge` | the **last** pinned cell; carries the freeze rule and the elevation (§7.2.14) |
| `.ds-resize` | the `--ds-grip-w` resize hit area on a header's right edge (§7.2.13) |
| `.ds-spacer` | a windowing spacer row (§7.2.8) |
| `.sev-error` / `.sev-warning` / `.sev-info` | severity state, on an **inner span** (§7.2.4) |
| `.sev-chip` / `.sev-svg` | that inner chip span, and the fixed-size status SVG inside it |
| `.vheadtab` | thead-only **header fragment** of a split header, rendered outside the scroller (§7.2.15) |
| `.ds-gut` | trailing gutter cell / column reserving the scrollbar width in that fragment (§7.2.15) |

**State classes** (added and removed by script, never hard-coded in markup):

| Class | On | Meaning |
|---|---|---|
| `.ds-dragging` | the `<th>` | its column is current
---

#### 7.2.7 Filter population rule (global-first → panel cascade) — added 2026-10-19

A dashboard's filters form a **two-tier cascade**. It is applied in this order and never the
reverse; the structure (not just convention) enforces it.

1. **Tier 1 — Global filters run first, in S4 Derive.** The dashboard-defined global filters are combined (AND) into a single pass over the
   master record set and produce one shared, reduced working set (`active`). **Every panel**
   (KPIs, charts, overdue lists, matrix, validation/issue list, document detail) derives from
   this same `active` set, so a global selection re-derives the whole dashboard at once. The
   **matrix month-selector** is the one panel control still resolved inside S4 Derive *on top of*
   the global `active`, because changing the month re-derives the whole cross-tab. A control that
   must not ripple outwards — the **issue rule-code filter** being the canonical case — is NOT
   resolved here; it belongs to point 6.
2. **Tier 2 — Panel filters run in S5 Render, on top of `active`.** A panel may expose **one or
   more single-purpose controls** that narrow only that panel's rows — rows that are already a
   subset of `active`. A panel filter can therefore **only narrow further** — it can never
   re-include a record a global filter excluded, because the panel never receives those records.
   Each such control uses the chrome its cardinality dictates (§7.1 B): **B1 + B3** when several
   values must be selectable at once, **B5 / B6** when the dimension is single-valued. A panel
   control MUST NOT be a generic multi-dimension popover that re-offers a global dimension — see
   point 5.
3. **All filters combine by AND.** Logically the order is associative; the cascade is enforced
   structurally because panels operate on `active`-derived data, not the raw records.
4. **Facet / count populations read the CURRENT data, never a master list.** Filter-popover
   option counts, badge counts and column-distinct lists MUST be computed from the rows currently
   in scope (the already-filtered set), so they always reflect what the user can actually see and
   select — never from the unfiltered master. (Where applicable this is enforced by the
   layout/behaviour harness.)

5. **No duplicate filter dimensions (overall requirement).** A filter dimension appears in exactly
   one place. The dashboard-defined global dimensions live
   **only** in the shared global filter area; a panel MUST NOT re-offer a global dimension, and MUST NOT offer the same dimension
   twice (e.g. a panel that already has a dedicated control for a dimension must not also bundle that
   dimension inside a generic column-filter popover). Panels may filter only on dimensions they own.
   This keeps the global filter the single source of truth for cross-panel scope and prevents two
   controls from issuing contradictory selections.

6. **A panel-local filter stays inside its panel (S5 only).** Some panel filters must narrow the
   panel's *tables* without re-deriving anything else — the canonical case is the **issue
   rule-code filter** on the Validation / Issues panel (§7.1 B6). Such a filter MUST be applied
   in **S5 Render** to the rows already handed to the panel, and MUST NOT feed back into S4
   Derive. It therefore changes **only the tables inside that panel** — never KPIs, never charts,
   never the matrix, never another panel, and never the global `active` set.
   - The panel's own summary blocks (issue/severity summary chips, explanatory note, rule
     reference table) continue to describe the **whole** run, not the filtered subset.
   - Only the filtered table and its row count reflect the selection, using the **`N of M`**
     form whenever `N < M`.
   - Any export reads the **same filtered array the table paints**, so screen and file always
     agree.
   Implementing it by feeding a global state field that S4 already consults is explicitly wrong:
   that silently converts a panel filter into a cross-panel one.

Rationale: a single global `active` guarantees cross-panel consistency (every panel tells the same
story for the same discipline/stage selection) and makes the global filter a hard first gate; panel
filters refine the view locally without re-introducing excluded records. The no-duplicate rule (point 5)
keeps each dimension in exactly one control, so two filters can never issue contradictory selections.

#### 7.2.15 Split header (fragment pairing) — added 2026-10-18

A **split header** moves `<thead>` out of the scroll container into a thead-only fragment
(`.vheadtab`), so the vertical scrollbar starts **below** the header instead of beside it.

**Standardised 2026-10-21 — every bounded data table (`.tableScroll`) uses the split
header, grouped or single-row.** The vertical scrollbar is confined to the body: it scrolls rows only,
the header never moves, and the header band runs the full card width with the trailing `.ds-gut` gutter
reserving the scrollbar width. A sticky `<thead>` inside a table scroller is **retired** — sticky
remains correct for page shell chrome (§3.1) but MUST NOT be used inside a `.tableScroll`.

Why this is standardised rather than left as a choice:

- **A scrollbar is a spatial proxy for the scrollable set.** A full-height track running beside a
  header it never scrolls misstates what it controls, and offsets the track's top edge from row 0.
- **The scrollbar strip breaks the header band.** Inside a scroller the content box excludes the
  scrollbar, so the navy header stops short of the card edge and a scrollbar-coloured seam cuts it at
  the top-right corner — precisely the defect `.ds-gut` exists to prevent ("so the navy is continuous
  across the full card width").
- **It removes an arbitrary split.** The Rule Reference is single-row and split; three other
  single-row tables were sticky. Same header shape, two treatments, no structural reason.

**Migration is per-dashboard.** A dashboard that still ships a sticky `<thead>` inside a
`.tableScroll` is **non-conforming until it migrates**. Which tables it must convert, and when, is
recorded in its own workplan — the same status pattern used for §7.1 A3.

Splitting the header is now the **rule**, not an exception — and a rule that moves the header outside
the scroller MUST be paid for with equivalent invariants. Splitting creates a failure mode sticky
headers do not have: header and body are now two
independent tables that can drift apart, and a drift is invisible to every per-table check (a shipped
matrix once carried six visible defects while the harness reported zero failures). Every one of the
following MUST hold. Omitting any single one produces a visible defect, so the set is normative, not
advisory.

1. **One container** — header and body MUST be wrapped in a single bordered, rounded box with
   `overflow:hidden`, and the inner scroller's own `border`, `border-radius` and `margin-top` MUST be
   neutralised, so the pair reads as one table with continuous corners. Left at its defaults,
   `.tableScroll` gives an 8 px gap under the header and a square header sitting on a rounded box.
2. **Containing block** — the fragment's cells MUST stay `position:relative` (never `static`): they are
   the containing block for the absolutely-positioned column-rule pseudo-element (§7.2.2). Setting
   `static` removes every column rule, while the pseudo-element itself still reports
   `position:absolute` — so a check that inspects only the pseudo-element can never detect it.
3. **Width pin + gutter** — script MUST pin the fragment's width to the body table's rendered width
   **plus** the scrollbar, and keep `--ds-sbw` in sync via a `ResizeObserver` (not a window resize
   listener: a scrollbar can appear or vanish with no resize event). Sizing to `clientWidth` leaves a
   white notch over the scrollbar; sizing to the *scroller* leaves the header narrower than an
   overflowing body.
4. **One column grid** — both fragments use `table-layout:fixed` and the same data-column widths; only
   the header adds the trailing `.ds-gut` gutter column.
5. **Fit, then lock-step** — column widths are content-derived and the pair fits the display area.
   Horizontal scrolling is **unavoidable**, and therefore permitted, **only** when the sum of the
   columns' **minimum** widths exceeds the available width. In every other case the table MUST fit: a
   default wider than the display area is a non-conformant width choice, not an unavoidable constraint.
   Where horizontal scrolling *is* unavoidable, the header MUST follow the body's `scrollLeft`. A header
   that is wider than the body, or that stays put while the body scrolls, is non-conformant.
   (Clarified 2026-10-21: the minimum-sum test makes "unavoidable" verifiable — 13 columns at
   a 60 px floor need 780 px and so must fit a 1216 px panel, while 27 columns need 1620 px and cannot.)
   (Clarified 2026-11-02 — **fit on a container change, never on a column change.** The fit pass MUST
   run when the container width moves: window resize, sidebar toggle, zoom, or a move to a display of
   another width. It MUST NOT run because the sum of the columns changed. A column resize — a user
   drag — changes that sum, and re-fitting on that path scales the width the operator just dragged
   straight back down, so the drag does not stick. Cache the container width and re-fit only when it
   moves; fitting once on first render is still required. A drag that makes the table wider than the
   display area is permitted and MUST be honoured: this invariant governs the SHIPPED DEFAULTS, not a
   width the user chose.)
6. **One implementation** — the pairing is wired by a single shared helper used by every split-header
   table. A table MUST NOT hand-roll a partial copy of this contract.

**Alignment across a split header MUST be driven by the column, never by DOM position.** A grouped
header with `rowspan` cells gives the header row different child indices from the body row it labels, so
`nth-child` selectors address different logical columns in each half. Verification MUST therefore pair
header and body cells by their rendered position, not by index.

**Verification** — these are enforced by `harness-layout` Tier 4c under `chrome.splitHeader`: header/body
gap, one rounded container, column rule in place, header-vs-data alignment, column-boundary alignment,
width equality, fit (no horizontal overflow), and horizontal lock-step.

**Matrix exception (grouped matrix header).** A matrix keeps a column rule on **every** header cell —
the grouped (first) row *and* the final data column included — rather than suppressing them; the gutter
stays exempt. The default `ds-table` suppression of `colspan`/last-column rules is therefore overridden
for `.matrix`. This is enforced by harness **Tier 4g** `lintMatrixHeaderRules`, which fails if any
non-gutter header cell lacks its painted `::after` rule (covering all header rows, not just the first
data cell).

#### 7.2.16 Table Hover Crosshair Standard — added 2026-11-13; general attached-table sync added 2026-11-14; C1 visual contract added 2026-11-14; crosshair colour standard added 2026-11-20

**One global interaction contract (normative).** Every tabular view MUST use ONE shared
row/column crosshair. `.ds-table` is the canonical class; data tables that also carry a
project-specific class — an S-curve attached table, a C3 attached table, a per-discipline table,
a nested history table, a matrix or a compact numeric variant — MUST participate through the SAME
state classes and the SAME delegated binder. A dashboard MUST NOT implement a second,
panel-specific hover interaction for an individual table, except for the ONE normative
chart ↔ attached-table column sync defined in §4.2 rev 1.74 / 1.75, which is a general rule for
every qualifying attached table. The crosshair is a transient pointer state: it changes no data, column
widths, sort, filter, pagination, ARIA or chart state.

**State classes (normative).** These classes are added and removed by script and MUST NOT be
hard-coded in markup:

| Class | On | Meaning |
|---|---|---|
| `.row-hover` | the current `<tr>` | highlights the hovered data row |
| `.col-hover` | every `<th>` / `<td>` in the current logical column | highlights the hovered column, including the split header |
| `.cell-hover` | the hovered `<th>` / `<td>` | marks the intersection cell for stronger emphasis |

For chart-linked attached tables — currently C1 and C3 Bar cards — `.col-active` is a distinct,
chart-linked column state and MUST NOT be replaced by `.col-hover` (§4.2 rev 1.74 / 1.75). Where a
generic crosshair is applied to such a table, `.col-active` remains the column state owned by the
chart ↔ table sync; the generic crosshair MAY add `.row-hover` and `.cell-hover` only. C1 uses
`data-c1col`; C3 uses shared `data-col-id` on `.g-bar`, dimension headers and value cells.

**Requirements (normative).**

1. **Row highlighting.** While the pointer is over a data row, that entire `<tr>` MUST carry
   `.row-hover` and be visibly highlighted. The row track MUST use `--crosshair-track` as a
   translucent fill layered over the existing row colour. The layer MUST use `background-color`
   or a layered `linear-gradient`. It MUST NOT replace a zebra row with an opaque colour and MUST
   NOT use CSS `filter`, which creates a stacking context and can break sticky descendants.
   Hovering a nested table resolves to the nested row; it MUST NOT also highlight the enclosing
   parent row.
2. **Column highlighting.** While the pointer is over a header, body or footer cell, every cell
   in the corresponding logical column MUST be visibly highlighted, including the header
   fragment. The column track MUST use `--crosshair-track` as the same translucent layer as the
   row track, so the two tracks stay visually consistent. Generic tables carry `.col-hover`; C1
   and C3 satisfy the same clause through their existing / added `.col-active` chart ↔ table sync
   and MUST NOT be given a second, competing `.col-hover` column state. The logical column MUST be
   resolved once per pointer move and reused for the row and intersection state.

   **Header and sticky-axis highlighting.** An active `<th>` column header and a sticky row header
   MUST keep its existing `background-color`. It MUST receive a non-destructive
   `background-image: linear-gradient(var(--header-crosshair-overlay), var(--header-crosshair-overlay))`
   and an inset edge indicator in `var(--header-crosshair-accent)`. The overlay MUST be
   luminance-adapted for every theme so dark, navy and saturated header surfaces keep text
   contrast. The edge indicator applies to headers only. Active body `<td>` cells stay
   border-free under requirement 5.
3. **Intersection highlighting.** The hovered cell MUST also carry `.cell-hover`. It MUST use
   `--crosshair-intersection` as a stronger translucent background and an inset ring in
   `var(--crosshair-ring)`. The intersection MUST remain distinct from either track alone without
   an opaque fill. The row, column and intersection states MUST be consistent with one another.
4. **Split-header support.** Header and body cells MUST be paired by **rendered column position**
   or by an explicit shared column identifier such as `data-col` / `data-c1col` / `data-col-id`.
   Raw DOM index, `cellIndex` alone and `nth-child` selectors MUST NOT be used as the pairing
   contract, because grouped headers with `rowspan` give the two fragments different child
   indices (§7.2.15 / §8.2 assertion 12). `.ds-gut`, windowing spacer rows and empty-state cells
   are not data columns and MUST be ignored.
5. **Attached-table chart ↔ table compatibility.** The C1 S-curve attached table keeps
   `data-c1col`, `.col-active`, `.sc-hover-band`, the snap line and the `.chart-tip` chart ↔ table
   column sync defined in §4.2 rev 1.63. Each C3 Bar card keeps shared `data-col-id` and applies
   `.col-active` to its matching chart column and table column. A chart-driven `.col-active`
   change MUST continue to highlight the corresponding column from the chart side, and a
   table-side column hover MUST continue to highlight the same chart column. The hidden column
   band and the `.chart-snap` centre line are REQUIRED for both C1 and C3 Bar cards and MUST
   follow the §4.2 rev 1.75 visual contract. Active column cells MUST NOT carry a border,
   outline or inset ring; only `.cell-hover` MAY keep its ring. No generic binder may clear,
   overwrite or duplicate that state.
6. **Visual compatibility and input parity.** Highlights MUST be painted as a non-structural
   layer that preserves the existing column-rule pseudo-elements and `position:relative` on
   header/body cells (§7.2.2 / §7.2.15). They MUST NOT change `table-layout:fixed`, column widths,
   pinned-cell elevation, resize grips, scroll geometry or the split-header width pin. Translucent
   fills MUST use `background-color` or `linear-gradient` only. Highlights MUST NOT use CSS
   `filter`, `backdrop-filter`, cell opacity or any other property that creates a stacking
   context. All hover colours MUST come from `--crosshair-track`, `--crosshair-intersection`,
   `--crosshair-ring`, `--header-crosshair-overlay` and `--header-crosshair-accent` (§6). No rule
   MAY hard-code a hover colour. Pointer hover styling MUST be scoped to
   `@media (hover: hover) and (pointer: fine)`. Keyboard focus MUST produce the same row, column
   and intersection state through `:focus-visible` on a focusable cell or row, outside that media
   query. Touch-only views MAY use a transient tap state but MUST NOT persist it.
7. **Export and printing.** Hover state is transient. `.row-hover`, `.col-hover`, `.cell-hover`
   and chart-linked `.col-active` MUST be stripped from or ignored by PNG and Copy serialization,
   and MUST NOT appear in print output. Exporters MUST serialize the same table content without
   the transient classes; `@media print` MUST remove or neutralise the highlight. A screen-only
   class MUST NOT leak into a saved image, clipboard payload or PDF.
8. **C3 attached-table compatibility.** Each C3 Bar card attached table MUST carry
   `data-table-crosshair` and shared `data-col-id` values on every dimension header and value
   cell; every `.g-bar` MUST carry the matching `data-col-id`. It MUST use `.row-hover` and
   `.cell-hover` from the generic crosshair and the chart-linked `.col-active` state; it MUST NOT
   also receive a competing `.col-hover` column state. The C3 bar plot keeps its hover window,
   but that window MUST stay closed while the cursor is in the attached table; the card MUST
   carry `role="group"` so the chart host does not flatten the native table in the accessibility
   tree. Per §4.2 rev 1.75, the `.c3-grid` MUST carry ONE hidden column band element and ONE
   hidden `.chart-snap` centre line element. Both MUST be children of that grid, MUST follow its
   `--c3-gutter` / `--c3-cols` tracks and MUST move with the active `data-col-id` in BOTH hover
   directions. Active C3 column cells MUST NOT carry a border, outline or inset ring. PNG / Copy
   MUST strip transient classes from BOTH chart and table nodes and MUST hide the band and centre
   line before they read computed styles.

**Lifecycle (normative).** One delegated `pointermove` / `pointerleave` binder MUST own the state
for all participating tables and chart-linked column states so re-renders do not leave stale
classes. Moving to another cell or chart column MUST clear the previous row, column and
intersection classes before applying the new ones; leaving the table / chart card, blurring the
view or starting a print MUST clear every hover class. The highlight MUST NOT be persisted in
markup, exported data or saved state.

**Verification (normative).** §8.2 assertions 22 and 23 enforce this clause. A dashboard
conformance record MUST show the shared binder, the three state classes, split-header column
pairing, C1 `.col-active` preservation, C3 chart ↔ attached-table column sync, C3 native-table
participation, the C1 column band and centre line, the C3 band / centre line and border-free
active columns, unchanged column rules / `position:relative`, and export / print suppression
(§4.2 rev 1.75).

---

## 8. Conformance & Testing

A rule that cannot be checked is not a standard. Every normative clause in this spec is therefore
paired with an automated check. This section states **what must be checked, where the checks live,
and what a dashboard must be able to show** to claim conformance.

### 8.1 Two layers of checks

| Layer | Lives in | Checks |
|---|---|---|
| **Shared layout harness** | the shared `harness-layout` project — **generic checks that apply to any dashboard** | shell structure and geometry, chrome and table geometry: split-header invariants, control contrast, floating-panel ordering, search-panel layout, matrix header rules |
| **Per-dashboard suite** | the dashboard's own repository (e.g. `test/`), plus its harness check module | that dashboard's **behaviour**: its pipeline stages, its contract parsing, its derivations, its panel logic, and the dashboard-specific assertions this spec requires |

**The split is deliberate.** A check that is true of *every* dashboard belongs in the shared harness;
a check that is true of *one* dashboard belongs to that dashboard. A dashboard MUST NOT fork a generic
check into its own suite, and the shared harness MUST NOT encode one dashboard's behaviour.

### 8.2 Required conformance assertions (normative)

Each of the following MUST be asserted somewhere in the two layers above, and each cites the clause
it enforces. Where a check needs to know a dashboard's own choice (a class name, a dimension list, an
enforcement posture), that value is supplied **by the dashboard's check module or workplan** — never
hard-coded into the generic check.

| # | Assertion | Clause |
|---|---|---|
| 1 | Every dashboard loads project-local CSS and JS, implements the required shell tokens, and supports all five themes | §1, §3.1, §6 |
| 2 | Every text action follows the dimensions and behavior in this spec | §7.1 A3 |
| 3 | Every action is a real `<button>`; no `<td>`/`<div>` carries `role="button"` | §7.1 |
| 4 | Every control's label meets WCAG AA against its own effective background (≥ 4.5:1, or ≥ 3:1 for large/UI text), including pressed/toggle states | §7.1 |
| 5 | Every control has an accessible name | §7.1 |
| 6 | A filter trigger (`.tf-btn`) is used **only** by controls that narrow rows; a column-visibility control uses its own class and carries no filter badge or active-filter emphasis | §7.1 B1 / B7 |
| 7 | Every floating multi-select panel lays out master → note → divider → item list → footer, and the master re-syncs (tri-state where rows are locked) | §7.1 B |
| 8 | A panel-local filter changes only its own panel's tables; KPIs, charts, the matrix and other panels are unaffected; exports read the same filtered array | §7.2.7 pt 6, §7.1 B6 |
| 9 | No filter dimension is offered twice — a dimension exposed in the global filter area is not re-offered inside a panel | §7.2.7 pt 5 |
| 10 | Every bounded data table uses the split header; no `.tableScroll` contains a sticky `<thead>` | §7.2.15 |
| 11 | The split-header invariants hold: one container, relative containing block, width pin + gutter, one column grid, fit/lock-step, one implementation | §7.2.15 |
| 12 | Header/body cells of a split header are paired by **rendered position**, never by DOM index | §7.2.15 |
| 13 | The parse → derive → render separation holds (S1–S5), and the pipeline is testable per stage | §3.8, §3.8.5 |
| 14 | Source-contract parsing: source positions and allowed values are not hard-coded | §3.8.3 |
| 15 | The delivered HTML is standalone: it runs from `file://` with no web server, contains no `href` / `src` that points at a local file, and uses no `fetch` of local files or cross-file ES-module `import` | §3.9 |
| 16 | Every KPI card is 72 px high and at least 210 px wide, carries a 3 px top strip in a status token, contains exactly two children (`.v`, `.l`), and has no box shadow | §5 |
| 17 | Filter selection semantics hold: every dimension opens fully ticked except documented exclusions, `(blank)` is selectable, an empty tick set filters every row out, a tick keeps the panel open, and an outside click or `Escape` closes it | §7.1 |
| 18 | The warning area is pinned below the menu bar, above the filter strip and outside the scrolling body; scrolling the panels does not move it, and it spans the content width without covering a sidebar | §3.5 |
| 19 | Stacked top-level panels are separated by 14 px (container gap or panel margin, never both); borders never touch; hidden panels add no gap; the `Breakdown` page's own grid MUST use that 14 px gap and MUST NOT inherit a different value from `body[data-layout]` (§4.1 rev 1.76) | §4.7 |
| 20 | The search panel is one row: attached column picker (All columns plus each searchable column), flexible input, affixed submit; the picker re-applies the query and does not clear it | §7.1 B5 / A5 |
| 21 | An S-curve attached table uses one `.c1-grid` with explicit `--c1-gutter` / `--c1-cols` tracks and `column-gap:0`, one `<svg role="img">` whose host carries a `ResizeObserver`, one native `<table>` in one spanning grid item with `<caption>` / `<colgroup>` / `<thead>` / `<tbody>` / `scope`, static and rebuilt cells with the same structure, a bordered chart composition (axis / plot / table zones with shared right-angle corners and an unbordered alignment grid; rev 1.70 / 1.81), no third bordered wrapper, and PNG/Copy that include the table; the SVG draws one vertical `sc-yaxis-line` at the plot's left edge, grid column 1 carries at most eight dynamically generated Y ticks (§4.2 rev 1.64: max 7 intervals, min ~40 px spacing, nice-number steps, one `line.sc-grid` per label, all derived from the same `data-c1meta.yMax` / `yStep` / `yIntervals` payload) and a rotated unit caption; after a period change the Y-axis maximum MUST be recomputed from the selected period window with cumulative values unchanged (§4.2 rev 1.65), and chart / grid / labels / hover-refit metadata / PNG-Copy MUST share that one Y-axis scale; the C1 period control is ONE dual-handle month-snapped track with one tick per active reporting month and the `6M` / `12M` / `24M` / `YTD` / `All` preset chips (§4.2 rev 1.66: `step="1"`, `input` visual-only, `change` single repaint, `aria-valuetext` / `aria-pressed`, print hides the interactive controls), and those five chips are ONE joined `.seg` group of `.seg-btn` buttons with EXACTLY one `aria-pressed="true"` at a time, a stored preset name (default `All`), NO active chip after a manual handle `input` / `change`, and the tools below the panel title stay on ONE visual row at the 1280 px minimum desktop width with `flex-wrap:nowrap` on `.c1-ts` (§4.2 rev 1.67); every Sub `.seg-btn` follows the §7.5 B2.1 common standard — shared CSS custom-property tokens, `--navy` active fill, `--surface2` inactive hover, `--surface3` pressed, a disabled state, a 2 px `--blue` focus ring with `outline-offset:-2px` plus a high-contrast light ring on active buttons, `type="button"` and a dynamic `aria-pressed` on ALL seven generators, `role="group"` and an accessible name on every group, equal height within each group and centre alignment between groups, the `standard` 32 px / 12 px variant and the C1 `compact` exception at ≈ 25.94 px / 11 px / `line-height:1.45` / `padding:5px 8px` with `min-height:0` and no hover or focus rule of its own (§4.2 rev 1.69 / §7.5 B2.1); the in-SVG legend sits above the plot, the `<thead>` row is flush with the plot bottom (which is also the SVG bottom) with no separate SVG X labels, the whole curve fits the board with no horizontal scroll, and bar / dot / `data-points.cx` alignment holds after the period window changes; the SVG draws four tokenised `<linearGradient>` defs and `path.sc-area` fills plus one hidden `rect.sc-hover-band` behind all marks, every month `<th>` and value `<td>` carries `data-c1col`, hovering a month column in either direction activates the band / snap line / `.col-active` highlight, and the `.chart-tip` window opens only inside the SVG chart area and is `aria-hidden="true"` with empty text whenever hidden; `aria-describedby` points at `.chart-tip` only; C3 Bar cards use the same native attached-table model, the general chart ↔ attached-table column sync and the C1 band / centre line / border-free visual contract (§4.2 rev 1.73 / 1.74 / 1.75); on the `Breakdown` page each C3 legend MUST sit ABOVE `.c3-grid` in Bar view and above the donut `<svg>` in Pie view, MUST be rendered in-SVG, and the exported PNG / Copy MUST keep the legend at the top (§4.2 rev 1.78) | §4.2, §4.6 |
| 22 | Every tabular view uses the ONE shared table hover crosshair: the hovered row, logical column including its split header, and intersection cell are highlighted; split-header cells pair by rendered column position or an explicit column identifier, never raw `cellIndex`; C1 and C3 `.col-active` / chart sync is preserved by the general attached-table column sync rule (§4.2 rev 1.74 / 1.75); the hidden column band and the `.chart-snap` centre line move with the active column in both directions, and active chart or table column cells carry no border, outline or inset ring (§4.2 rev 1.75); C3 attached tables participate through `data-table-crosshair` / `data-col-id` and `role="group"` on the card; on the `Breakdown` page (§4.1 rev 1.76) both chart panels and the summary panel's table follow the same crosshair rule inside their own panels, and no panel reads or writes another panel's hover state; column rules and `position:relative` are unchanged; row and column tracks use the tokenised translucent `--crosshair-track`, the intersection uses `--crosshair-intersection` plus the inset `--crosshair-ring`, and active `<th>` headers and sticky row headers use `--header-crosshair-overlay` / `--header-crosshair-accent` as non-destructive overlays that keep theme header contrast, split-header geometry and sticky positioning; pointer hover styling is scoped to `@media (hover: hover) and (pointer: fine)` with `:focus-visible` keyboard parity; and transient hover classes, the band and the centre line are absent from PNG, Copy and print | §6, §7.2.16 |
| 23 | A chart that renders a native attached table whose columns share the chart's X positions uses ONE transient two-way chart ↔ attached-table column sync: hovering a chart column or a table column highlights the SAME logical column in both, inside the owning chart card only; C1 keeps `data-c1col` / `.sc-hover-band` / snap line / `.col-active`, and C3 Bar keeps shared `data-col-id` on `.g-bar`, dimension headers and value cells plus ONE `.col-active` state per `.c3-card`; each C3 card is independent (on the `Breakdown` page, §4.1 rev 1.76, the `Submissions` and `Approval Status` chart panels each own their state and sync scope), no competing `.col-hover` column state is applied, `.row-hover` / `.cell-hover` may still apply, the `.chart-tip` window stays closed while the cursor is in the attached table, and the state clears on pointer leave / blur / Escape / repaint / print and is absent from PNG / Copy / print (§4.2 rev 1.74); C1 and C3 Bar each draw ONE hidden column band and ONE hidden dashed `.chart-snap` centre line, both MUST move with the active column in BOTH directions, and no active chart or table column cell MAY carry a border, outline or inset ring (§4.2 rev 1.75); the band and centre line stay hidden on leave / blur / Escape / repaint / print and absent from PNG / Copy / print (§4.2 rev 1.75) | §4.2, §4.6, §7.2.16 |
| 24 | The sidebar lists `Breakdown` directly under `Overview` (§3.2 rev 1.76); the `Breakdown` page holds THREE fully independent panels — `Submissions`, `Approval Status` (charts, side by side, `Submissions` first) and `Breakdown Summary` (full width below) — each with its OWN `c3Month` / `c3Dim` / `c3View` state, so changing a control in one panel changes nothing in the others, and each chart switches between Bar and donut independently (§4.1 rev 1.76); the Overview page keeps KPI, C1 and C2 only; each C3 legend sits ABOVE its chart and is in-SVG (§4.2 rev 1.78); the summary panel owns Month, Break-down-by and the `⤓ Download` CSV control, its table uses the compact row tokens with no inner vertical scroll at 1280 px, and the orphan discipline (submittal rows not registered in MDL) is named `Others`, not `Unknown` (§4.1 rev 1.76); each chart panel shows ONE tool row — Month select, Break-down-by and Bar / Pie on the left, `⤓ PNG` + `⧉ Copy` on the right, no second head row — and the Month select carries no visible `Month` text (§4.2 rev 1.77) | §3.2, §4.1, §4.2 |
| 25 | Every gap in the three Breakdown panels is a named token from the §6 inventory and no rule hard-codes a gap value (§0, §4.2 rev 1.80); the tool row (part 3) sits inside its owning card — chart card 2 in both chart panels, summary table card 9 in the Breakdown Summary panel — with equal `--c3-tool-pad` on all four sides and the same padding in all three panels, and only the two chart cards use a scoped negative margin equal to `--c3-card-pad` that cancels the outer card padding while the card border and the chart / table inset stay (§4.2 rev 1.80); the bar-plot-to-attached-table gap equals the derived token `--c3-plot-table-gap` = `--c3-axis-label-h / 3` (6 px at the default 18 px label height), is minimized without the table overlapping the plot baseline or the `0` tick label, and still scales with the label height (§4.2 rev 1.80) | §0, §4.2, §6 |
| 26 | Every chart board on every dashboard uses the universal bordered composition: bordered axis, plot and attached-table zones, each `1px solid var(--border)` (§4.2 rev 1.81); the Pie / donut view carries the bordered plot zone though it renders no y-axis or attached-table zone (§4.1 rev 1.81); overlapping bordered zones — the y-axis zone and the plot zone — meet at right angles with `border-radius:0` shared corners, while gap-separated zones (the bar plot and the attached table) carry the general `border-radius:10px` (§4.2 rev 1.81); and every data table shows exactly ONE outer border `1px solid var(--border)` with `border-radius:10px`, from its `.ds-split` wrapper, its owning `.c-card` or the table element itself (§7.2 rev 1.81) | §4.1, §4.2, §7.2 |
| 27 | Where a dashboard offers a panel-column layout control, it is a labelled `<select data-setting="layout">` in the Settings panel, with the values `one`, `two` and `three` and the visible labels `One`, `Two` and `Three`; the chosen value is saved in `localStorage`, applied to `document.body.dataset.layout` on load and on every repaint, and the menu bar and content area hold no layout control (§3.1 rev 1.86) | §3.1, §3.3 |
| 28 | The KPI panel is first and outside the panel grid and stays full width at every panel-layout value; KPI cards use six columns at wide widths, three at 1100 px or less and two at 880 px or less; a KPI density control, where offered, uses those three states only and never five or four columns (§3.1 / §5 rev 1.87) | §3.1, §5 |
| 29 | Every on-screen table has one `⤓ CSV` control in its own tool row before any image action; the control is absent or hidden when the table has no rows or no table renders in the current view (§4 rev 1.88) | §4 |
| 30 | Every CSV export contains all columns and all rows that match the applied filters, with a UTF-8 BOM, and ignores pagination, viewport and column chooser state (§4 rev 1.88) | §4 |
| 31 | The top menu `Export` downloads one `.xlsx` workbook with one worksheet per table across all data pages, each page in its current view state; a bare boolean attribute is detected with `hasAttribute` (§4 rev 1.90) | §4 |
| 32 | Every download file name follows `PROJECT_purpose_YYYY-MM-DD.ext` with the current local date and `.csv` or `.xlsx` as the extension; `PROJECT` is the slugified Project Title from the MDL `Code` sheet with the Project Code fallback (§4 rev 1.89) | §4 |
| 33 | In every table tool row the filters (Month, per-table filter selects, lane and horizon segments) sit in the left group and the actions (`⤓ CSV`, `Columns`, image actions) sit in the right-aligned group (§4 rev 1.91) | §4 |
| 34 | A panel MAY show a subtitle row; when present, every count renders as a `.pchip` colour chip (blue submissions-in-window · violet documents-in-window · green cumulative-documents-till-window-end · neutral shown-records) describing the same globally filtered dataset, with its title inside the chip, temporal "in / for" vs "till" wording, height-equal to the severity chip, a single funnel glyph only when the time filter or an actually-narrowing global filter is active (a full-value selection is not a filter), `0` displayed for zero counts, and warning/severity colours never used (§4 rev 1.93) | §4 |
| 35 | A table renders the `.drill-cell` column only when at least one row in the current view is expandable; single-record views start at the primary data column and omit the detail rows, row shortcut and locked chooser item (§4.4 rev 1.94) | §4.4 |
| 36 | The Validation page renders `Validation Rules` and `Validation Issues` as two independent top-level panels with one `.pchip-row` each before its card; Panel 1 shows `Loaded rules` and `Fired rules`, Panel 2 shows `All issues`, `Shown issues` and the severity chips in that one row, with one `data-validation-count` hook on `Shown issues`; no meta note, no card title and no separate severity row are rendered; the code filter narrows only the Issues panel (§4.5 rev 1.95) | §4.5 |

### 8.3 Pipeline testability

§3.8.5 requires each data stage to be testable in isolation with the project-approved runner. A test
can then locate a failure in one stage instead of the whole page.

### 8.4 Enforcement posture and the conformance record

- A dashboard MUST record, **in its own workplan**, which generic checks it runs, at which tier, and
  whether each is **hard** (a failure blocks release) or **advisory** (reported, not blocking).
- A dashboard MUST record every **deviation** from this spec in its workplan, with the clause it
  deviates from, the reason, and — where the deviation is temporary — the target end state.
- A dashboard's workplan SHOULD cite, per spec clause, where the evidence lives (check name, test
  file, or screenshot), so conformance can be reviewed without re-deriving it.

### 8.5 Definition of done

A dashboard conforms when (a) all generic checks in §8.2 that apply to it pass or are recorded as
advisory-with-reason, (b) its own suite passes, and (c) its workplan carries the conformance record of
§8.4. A new dashboard adopts this spec **before** its first release, not after.

---

## 9. Adopting this spec for a new dashboard

1. Keep dashboard CSS and JavaScript in project-local assets. The workplan defines their paths; a `ui/` folder is optional. Define the tokens and shell behavior required by this spec in those assets; dashboards do not use `common/`.
2. Put the dashboard HTML entry page in the project root. A `data/` or `output/` folder is optional. Provide
   `serve.py` as required by `AGENTS.md` §18.12. Build the shell exactly as stated in §18.2. Use this document for dashboard panels
   (§4), metrics (§5), and shared behaviors (§3, §7).
3. Load `ui_help.json` for labels, help text, defaults, and output names. Confirm that every token used
   by this document exists in the project UI stylesheet for all five themes (§6).
4. Implement the data pipeline with importable stages and no HTML build step (§3.8). Use the source
   file contract that applies to the dashboard (§3.8.3), and test each stage (§8.3).
5. Decide the dashboard-specific status vocabulary, global filter dimensions, and file set. Record
   these choices in the dashboard workplan. The shell and navigation form are not choices.
6. Wire the shared layout harness and add the dashboard's own check module and suite (§8.1).
7. Complete the conformance record (§8.4) before first release (§8.5).

---

## Appendix A — UI Comparison & Standardisation Register (non-normative)

This appendix is the **non-normative** register behind the normative clauses above. The full source
is `archive/ui_comparison_and_standardisation_matrix.md`. Where this appendix and a normative section
differ, the normative section wins. The single-option principle applies: where C1 and C3 once used
different implementations, the spec above states ONE standard.

### A.1 Target technology allocation

| Technology | Responsibility | Policy |
|---|---|---|
| HTML5 | Shell, panels, cards, controls, semantic tables, tooltips, ARIA | Default |
| CSS3 | Tokens, typography, borders, radii, print | Default |
| CSS Grid | Page / panel grids, chart↔table tracks | Default |
| CSS Flexbox | Title bars, toolbars, control clusters | Default |
| SVG | Chart render, axes, gridlines, series, in-SVG legends, export | Default |
| JavaScript | `S0`–`S6` pipeline, `STATE`, `ResizeObserver`, delegated binders | Default |
| Canvas | High-volume render where SVG degrades | Conditional |
| DOM-to-image | HTML rasterisation where SVG serialisation fails | Conditional |
| Web Components | Reusable encapsulation | Optional |

### A.2 Standardisation items 1–30

| # | UI Element | Recommended standard (single option) |
|---|---|---|
| 1 | Outer panel border | `.panel`, `1px solid var(--border)`, `10px` radius, `--surface`, `padding:14px 14px 26px` (§4) |
| 2 | Inner chart card | One graph = panel edge only; several graphs or graph+controls = one inner `.c-card`/`.c3-card` (`1px solid var(--border)`, `10px` radius, `padding:12px`) |
| 3 | Panel heading | `<h2>` 13px/700 uppercase `var(--navy)`, Help `?` left of Collapse `−` |
| 4 | Chart legend | **One in-SVG `<g>` above the plot** for every panel (C1 and C3); no HTML `.c3-legend` element (§4.2 rev 1.78) |
| 5 | Y-axis | SVG `sc-yaxis-line` + dynamic nice-number ticks (`<= 7` intervals, `<= 8` labels, `~40px` spacing) from one `data-c1meta` (§4.2 rev 1.64) |
| 6 | Time scope | Card-owned period control in the right-aligned cluster; widget fixed by data (dual-handle track + presets for timeline, native select for discrete month) |
| 7 | Visible control label | Remove visible `Month` text on C3 selects; use `aria-label`; keep `<label>` where required |
| 8 | Grain selector | §7.5 B2.1 `.seg` (`role="group"`, `aria-pressed`) |
| 9 | Series / view controls | B1 `.tf-btn`, B2 `.seg`, B5 `.inter-sel` with panel-scoped ownership |
| 10 | Chart toolbar | One tool row per chart card (`flex-wrap:nowrap` at `1280px`); no second head row |
| 11 | Export controls | `.btn-secondary` (`min-height:32px`), PNG before Copy at far right |
| 12 | Toolbar left-group flex | `margin-right:auto` left-aligns scope/filter/view; export right |
| 13 | Attached table | One native semantic `<table>` (`<caption>`,`<colgroup>`,`<thead>`,`<tbody>`,`scope`) in chart board; C3 summary its own full-width panel |
| 14 | Chart↔table sync | One shared `data-col-id`/`data-c1col`, ONE hidden band (`0.08` opacity), ONE hidden `.chart-snap`, border-free `.col-active` |
| 15 | Chart hover | One delegated `bindChartHover()` binder on `data-points`/`data-geo`; native `<title>` retired |
| 16 | Button height | One `--btn-h:32px` text-button token; `26px` square icon-only |
| 17 | Table crosshair | Generic `.row-hover`+`.col-hover`+`.cell-hover`; `.col-active` reserved for chart sync; translucent `--crosshair-track` and `--crosshair-intersection`, inset `--crosshair-ring`, and non-destructive header overlay / accent tokens |
| 18 | Panel spacing | `--panel-gap:14px`; `16px` chart cards; `12px` validation cards |
| 19 | Typography | `--font-ui` stack; 13px body/h2/h3, 22px KPI, 12px controls, 11px tooltips/meta, `tabular-nums` |
| 20 | Colour system | Centralised semantic tokens, zero hard-coded hex, 5 themes; the five crosshair tokens have a value in every theme |
| 21 | Spacing system | 8 pt scale `4·8·12·16·24·32·48`; gutters `--c1-gutter`/`--c3-gutter:104px`, `--sidebar-w:160px` |
| 22 | Border and radius | Radii `10/8/6px`; single-border rule (`.c-card:has(.ds-split){border:0}`) |
| 23 | Hover / focus | `:focus-visible` 2px `var(--blue)`, `outline-offset:-2px`; WCAG AA |
| 24 | Responsive | `ResizeObserver` reflow, no h-scroll, `auto-fit`, flex-wrap below `1280px` |
| 25 | Tooltip | `.chart-tip`: `pointer-events:none`, 4-edge clamp, `aria-hidden`+empty when hidden |
| 26 | Keyboard / touch | `tabindex=0`, `aria-describedby`, Escape/blur, touch tap-to-show |
| 27 | PNG / Copy | Native SVG serialisation, no `<foreignObject>`, top legend kept, transient stripped |
| 28 | Print | `@media print` strips hover/bands/snap, hides sliders/chips, releases scroller |
| 29 | Control alignment | `align-items:center`, `gap:8px`, title-case, fixed order |
| 30 | UI validation | §8 two-layer suite; 24 normative assertions |

### A.3 Architecture & governance items 31–44

| # | Standard | Recommended implementation |
|---|---|---|
| 31 | Component naming | Normative class names (`.panel`,`.c-card`,`.ds-table`,`.btn-secondary`,`.seg`,`.inter-sel`,`.chart-tip`,`.chart-snap`,`.col-active`) |
| 32 | Design tokens | All tokens in `:root` across 5 themes, project-local CSS (no `/common/`) |
| 33 | Component ownership | Shell / Panel / Card own their chrome; C3 `Breakdown` = 3 independent `data-c3panel` panels |
| 34 | State management | Single `STATE`, `S0`–`S6`, write-only S5 render, persisted collapse & preset names |
| 35 | Loading | MDL welcome overlay (golden ratio), controls in drop zone, Code-sheet validation |
| 36 | Empty | `.empty` caption, `.ok` chip at 0, `Nothing to export` toast |
| 37 | Error | `#errBanner` `role=alert` below menu bar, above filter strip; row issues → Validation |
| 38 | Data formatting | `MMM YYYY`/`Qn YYYY`/`YYYY`, local-time, `d` 1 decimal, `0` not blank |
| 39 | Text overflow | `.ds-table` ellipsis, `.drill-cell` clip, full titles on Forward/Overdue |
| 40 | Browser compat | `1280px` min, `ResizeObserver`, standalone `file://`, no fetch/import |
| 41 | Performance | SVG `H=300` `ResizeObserver`, scroller `340px`, 200-row pagination, Canvas conditional |
| 42 | Component testing | Two-layer `harness-layout` Tiers 1–5 + unit/integration |
| 43 | Design exceptions | Mandatory Conformance Record in workplan (clause, reason, posture, end state) |
| 44 | Version control | Root and harness copies byte-identical; preserve revision rows; regenerate standalone build |

### A.4 Prioritised migration plan

| # | Element | C1 change | C3 change | Priority |
|---|---|---|---|---|
| 1 | Y-axis | Retain SVG | Migrate HTML axis to SVG | P1 |
| 2 | Chart/table sync | Retain | Adopt shared `data-col-id` + band/snap | P1 |
| 3 | Table crosshair | Retain | Adopt `.row-hover`/`.cell-hover` | P1 |
| 4 | Tooltip | Standardise `.chart-tip` | Standardise `.chart-tip` | P1 |
| 5 | Chart hover | Retain nearest-mode | Retain element-mode | P1 |
| 6 | Design tokens | `:root` tokens | `:root` tokens | P1 |
| 7 | Control styling | `32px` `--btn-h` | `32px` `--btn-h`, no `Month` label | P1 |
| 8 | Page structure | Keep single-panel C1 | Split into 3 panels | P1 |
| 9 | Toolbar layout | Single-row `.c1-ts` | Single-row per chart panel | P2 |
| 10 | Legend & export | Retain in-SVG top legend | **Retain in-SVG top legend (updated rev 1.78; was HTML `.c3-legend`)** | P2 |

### A.5 Specification integration map

| Section | Items | Scope |
|---|---|---|
| §0–§2 | 31, 32, 33, 43 | Vocabulary, project-local assets, ownership |
| §3 | 18, 24, 33, 34, 35, 37, 40 | Shell, pipeline, standalone |
| §4 | 1–15, 18, 22, 25, 27 | Panels, cards, charts, hover |
| §5 | 18, 19, 22, 24 | KPI panel |
| §6 | 19, 20, 21, 22, 32 | Project-local tokens |
| §7 | 6–11, 16, 17, 23, 26, 29, 36, 39 | Component library, tables |
| §8–§9 | 30, 41, 42, 43, 44 | Conformance, testing, adoption |
