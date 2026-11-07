// Revision 1.13 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.67 / I122 — `c1.timeBar` gained `segmentedSelector`, `segmentedButtonSelector`, `controlSelector` and `oneRowWidth: 1280`. The Tier 5 checks now require ONE joined `.seg` group, EXACTLY one active chip, NO active chip after a manual handle change, and ONE visual control row at the 1280 px minimum desktop width. The block stays C1-only and opt-in; other dashboards keep their Tier 5 behaviour.
// Revision 1.12 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.66 / I121 — `c1.timeBar` carries the C1-only Tier 5 selectors for ONE dual-handle track: the track, body, chips group, month ticks, preset chips, `expectedPresets` and `periodStep: 1`. The block is config-gated, so other dashboards keep their Tier 5 behaviour. `periodFromSelector` / `periodToSelector` are unchanged because both native handles keep `data-c1period`.
// Revision 1.11 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.65 / I119 — added the C1 window-based Y-axis probe controls: `axisWindowProbeFraction` (starting guess), `axisPeakDropRatio`, `minAxisProbePoints`, `axisPeakTolerance` and `axisMinFill`. These are HARNESS QUALITY CRITERIA ONLY, not new UI requirements; the probe index is derived from the data, and an unsuitable dataset is skipped rather than failed.
// Revision 1.10 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.64 — `c1` gained `maxTickIntervals: 7`, `minTickSpacing: 40`, `maxTickLabels: 8` and `tickSpacingTolerance: 1` for the dynamic C1 Y tick standard. Config-driven so other dashboards keep their Tier 5 behaviour; the fixed five-tick expectation moved into harness.mjs rev 1.20.
// Revision 1.9 | 2026-11-06 | CodeBuddy (AI) | §4.2 rev 1.63 — `c1.interaction` holds the promoted Option B selectors (gradients, soft areas, month band, `data-c1col`, `.col-active`, chart-only window), and `hover.ariaHidden` turns on the §4.6 hidden-window ARIA assertions for this dashboard. The C1-only check is opt-in via config; other dashboards keep their current Tier 5 / Tier 6 behaviour.
// Revision 1.8 | 2026-11-06 | CodeBuddy (AI) | §4.2 rev 1.62 — `c1.legendAbovePlot` is now true:
// with an attached table the in-SVG legend sits ABOVE the plot so the plot bottom can touch the
// table `<thead>` with no intervening band. The selector is unchanged (still inside the SVG);
// only the expected vertical position and the adjacency measurement changed. Owner decision 1
// of 2026-11-06 is superseded for attached-table panels.
// Revision 1.7 | 2026-11-06 | CodeBuddy (AI) | Tier 5 `c1` gained the attached-table geometry
// selectors, the From / To period sliders and the alignment tolerances. The harness can now
// measure bars against month columns, grid tracks against colgroup columns, the in-SVG bottom
// legend, the Y-axis line and caption, table adjacency, and the no-scroll refit model
// (spec §4.2 rev 1.59 / §8.2 assertion 21; owner decisions 2026-11-06).
// Revision 1.6 | 2026-10-25 | CodeBuddy (AI) | Tier 5 `c3` gained the summary-table selectors, so it checks the table below the chart: presence, its eight columns, its Total footer row, and that it follows the Month selector.
// Revision 1.5 | 2026-10-25 | CodeBuddy (AI) | Added the Tier 5 `c3` block (workplan D36) so the
// harness checks the C3 Breakdown chart: two-series structure, component board, Month selector,
// Breakdown-by toggle, Bar / Pie toggle and the PNG / Copy controls.
// Revision 1.4 | 2026-10-24 | CodeBuddy (AI) | The filter round-trip now drives the multi-select
// .tf-btn trigger (spec §7.1 B1/B3). The old `select[data-filter="disciplines"]` selector was removed
// when the global filters became multi-select, so Tier 3 aborted with a 30 s timeout.
// Revision 1.3 | 2026-10-24 | Codex | Add the served page URL and two page layouts for live checks.
// checks/sub.mjs — harness config for the Document Submittal Dashboard (TWRP C3B2).
// Points at the project-root page and the current two-workbook input pair.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const subRoot = resolve(here, '../../sub');

export default {
  // Paths
  htmlPath: resolve(subRoot, 'TWRP C3B2 - Document Submittal Dashboard.html'),
  pageUrl: 'http://127.0.0.1:8765/TWRP%20C3B2%20-%20Document%20Submittal%20Dashboard.html',

  srcDir: resolve(subRoot, 'engine'),
  xlsxReaderPath: resolve(subRoot, 'engine/xlsx-reader.js'),
  pipelinePath: resolve(subRoot, 'engine/pipeline.js'),
  renderPath: resolve(subRoot, 'engine/render.js'),
  defaultWorkbook: resolve(subRoot, 'TWRP C3B2 - Master Document List.xlsx'),
  companionWorkbook: resolve(subRoot, 'TWRP C3B2 - Document Submittal Log.xlsx'),
  contractPath: resolve(subRoot, 'config/pipeline_contract.json'),

  // Tier 3 — paired workbook ground truth and live filter check.
  kpiSelectors: { totalPlanned: '[data-kpi="totalPlanned"]' },
  // Global filters are multi-select .tf-btn triggers (spec §7.1 B1/B3), not native selects.
  filterTriggerSelector: '.tf-btn',
  filterRoundTrip: null,
  validationCountSelector: '[data-validation-count]',
  validationPage: 'Validation',
  storagePrefix: 'sub_dashboard_',
  layoutPages: ['Submittals', 'Validation'],

  // Tier 4 — no static sample table exists; test the live tables instead.
  samplePath: null,
  geometry: {
    tableSelector: 'table.ds-table',
    expectedRowH: 40,
    expectedHeadH: 40,
    sampleRowLimit: 12,
    tolerance: 0.5,
  },

  // Tier 4c — table chrome (compulsory). Configured for the sample's DOM; enforced once built.
  chrome: {
    titleSelector: '.panel-head h2',
    headerFragmentSelector: '.vheadtab',
    multiRow: false,
    layout: false,
    splitHeader: true,
    controlContrast: true,
    minGridTables: 1,
    colMinWidth: 60,
    scrollProbe: 240,
    tolerance: 2,
  },

  // Tier 5 — C1 Schedule Performance S-Curve (workplan D35) live checks.
  // C1 postdates the original harness; these selectors let Tier 5 verify the
  // combined chart structure, the Bars toggle and the series multi-filter popup.
  // The geometry keys encode spec §4.2 rev 1.60 (Y axis contract and Fallback /
  // reflow / no-scroll model, extending rev 1.59) / §8.2 assertion 21 and the owner
  // decisions of 2026-11-06 (decision 1 superseded for attached-table panels):
  // the legend stays in-SVG but moves ABOVE the plot, the as-of subtitle is omitted,
  // and the curve fits the card with no horizontal scroll.
  c1: {
    panelSelector: '.scurve',
    svgSelector: '.scurve svg',
    lineSelector: '.scurve svg polyline',
    barSelector: '.scurve svg > rect[class^="sc-bar-"]',
    boardSelector: '.sc-board',
    refStartSelector: '.scurve .sc-ref-start',
    refTodaySelector: '.scurve .sc-ref-today',
    refLabelSelector: '.sc-ref-lbl',
    asOfSelector: '.sc-asof',
    barsToggleSelector: '[data-c1bars]',
    seriesButtonSelector: '#tfBtn_c1series',
    seriesPanelSelector: '#tfPanel_c1series',
    seriesCheckboxSelector: '[data-c1series]',
    grainSelector: '[data-c1grain]',
    expectedSeries: 4,

    // ── Tier 5 C1 attached-table geometry (spec §4.2 rev 1.62, §8.2 assertion 21) ──
    legendAbovePlot: true,
    gridSelector: '.c1-grid',
    plotSelector: '.c1-plot',
    yAxisSelector: '.c1-yaxis',
    yCaptionSelector: '.c1-ycap',
    yTickSelector: '.c1-ytick',
    axisLineSelector: '.scurve svg > line.sc-yaxis-line',
    legendSelector: '.scurve svg > g.sc-legend',
    htmlLegendSelector: '.c1-legend',
    gridLineSelector: '.scurve svg > line.sc-grid',
    dotSelector: '.scurve svg > circle.sc-dot',
    svgXLabelSelector: '.scurve svg text.sc-x',
    tableSelector: 'table.c1-table',
    monthHeadSelector: 'table.c1-table thead th.g-axis',
    cornerHeadSelector: 'table.c1-table thead th.g-corner',
    colSelector: 'table.c1-table colgroup col',
    periodFromSelector: 'input[data-c1period="from"]',
    periodToSelector: 'input[data-c1period="to"]',
    alignTolerance: 2,
    adjacencyTolerance: 2,

    // ── Tier 5 C1 dynamic Y tick standard (spec §4.2 rev 1.64, §8.2 assertion 21) ──
    // Seven intervals over the 300-unit plot give 42.86 px spacing, so the ~40 px minimum
    // and the eight-label cap are the same constraint. Tick values and grid lines must agree
    // with the one data-c1meta payload; no fixed five-tick expectation remains.
    maxTickIntervals: 7,
    minTickSpacing: 40,
    maxTickLabels: 8,
    tickSpacingTolerance: 1,

    // ── Tier 5 C1 window-based Y-axis probe (spec §4.2 rev 1.65, §8.2 assertion 21) ──
    // HARNESS-ONLY quality criteria. They are NOT normative UI requirements: the spec fixes the
    // nice-number rule, the 300-unit plot and the interval / spacing caps, but does not mandate a
    // fill ratio. The probe scans the windowed data for a prefix with a materially lower peak; a
    // short dataset, a non-month grain or no usable prefix produces a SKIP, never a FAIL.
    axisWindowProbeFraction: 0.33,
    axisPeakDropRatio: 0.9,
    minAxisProbePoints: 3,
    axisPeakTolerance: 1,
    axisMinFill: 0.75,

    // ── Tier 5 C1 dual-handle period time bar (spec §4.2 rev 1.66, §8.2 assertion 21) ──
    // C1-only and opt-in. `periodStep: 1` is the hard month snap; a fractional value is a FAIL.
    timeBar: {
      barSelector: '#c1TimeBar',
      trackSelector: '.c1-ts-track',
      bodySelector: '.c1-ts-body',
      chipsSelector: '.c1-ts-chips',
      tickSelector: '.c1-ts-tick[data-c1month]',
      chipSelector: '[data-c1preset]',
      periodTextSelector: '#c1PeriodText',
      controlSelector: '.c1-controls',
      segmentedSelector: '.c1-ts-chips.seg',
      segmentedButtonSelector: '.c1-ts-chips .seg-btn',
      expectedPresets: ['6M', '12M', '24M', 'YTD', 'All'],
      periodStep: 1,
      // §4.2 rev 1.67 — ONE visual row at 1280 px and above; §3.4.1 allows wrapping below it.
      oneRowWidth: 1280,
    },

    // ── Tier 5 C1 attached-table interaction (spec §4.2 rev 1.63, §8.2 assertion 21) ──
    // C1-only. The harness measures the live two-way hover model after the geometry pass.
    interaction: {
      areaSelector: '.scurve svg > path.sc-area',
      gradientSelector: '.scurve svg > defs > linearGradient',
      stopSelector: '.scurve svg > defs > linearGradient > stop',
      bandSelector: '.scurve svg > rect.sc-hover-band',
      snapSelector: '.scurve svg > line.chart-snap',
      monthHeadSelector: 'table.c1-table thead th.g-axis[data-c1col]',
      valueCellSelector: 'table.c1-table tbody td.g-val[data-c1col]',
      activeSelector: 'table.c1-table [data-c1col].col-active',
      expectedGradients: 4,
      expectedAreas: 4,
      widthTolerance: 2,
    },
  },

  // Tier 5 — C3 Breakdown (workplan D36) live checks.
  // C3 splits a dimension into two series per value: Submissions (New + Resubmission) and
  // Approval Status (APP/AWC/NAP/REJ/INF). These selectors let Tier 5 verify the two-series
  // structure and every control: Month, Breakdown-by, View, PNG and Copy.
  c3: {
    boardSelector: '.c3-board',
    svgSelector: '.c3-board svg',
    monthSelector: 'select[data-c3month]',
    disciplineSelector: '[data-c3dim="discipline"]',
    submitterSelector: '[data-c3dim="submitter"]',
    barSelector: '[data-c3view="bar"]',
    pieSelector: '[data-c3view="pie"]',
    pngSelector: '[data-c3png]',
    copySelector: '[data-c3copy]',
    newSegmentSelector: '.c3-board rect.c3-new',
    resubSegmentSelector: '.c3-board rect.c3-resub',
    newArcSelector: '.c3-board path.c3-new-arc',
    appArcSelector: '.c3-board path.c3-app-arc',
    approvalSegmentSelector: '.c3-board rect[class^="c3-app"], .c3-board rect[class^="c3-awc"], .c3-board rect[class^="c3-nap"], .c3-board rect[class^="c3-rej"], .c3-board rect[class^="c3-inf"]',
    percentTextSelector: '.c3-board text:has-text("%")',
    summaryTableSelector: '.c3-summary .tableScroll table.ds-table',
    summaryFooterSelector: '.c3-summary .tableScroll table.ds-table tfoot',
    summaryHeadSelector: '.c3-summary .vheadtab thead th:not(.ds-gut)',
  },

  // Tier 6 — §4.6 hover floating window (spec §4.6). Verifies the standardized window across the
  // chart boards (C1–C4) and KPI cards: focusable host + aria-describedby → role="tooltip" window, the
  // cursor affordance, nearest charts expose .chart-snap, hover/tap reveals the window, and the C2
  // series-row swatch+label group (.ct-l) is preserved (I092 regression guard).
  // `snap` = the chart is expected to expose a .chart-snap line; `ctL` = guard the .ct-l grouping.
  hover: {
    // §4.6 rev 1.63 — assert the hidden window is aria-hidden AND empty of text.
    ariaHidden: true,
    boards: [
      { name: 'C1 S-curve', selector: '.scurve', snap: true, cursor: 'crosshair', ctL: true, nearest: true },
      { name: 'C2 Submission Flow', selector: '.c2-stack', snap: true, cursor: 'crosshair', ctL: true, nearest: true, elementViews: ['Funnel'] },
      { name: 'C3 Breakdown', selector: '.c3-card', snap: false, cursor: 'crosshair', ctL: true },
      { name: 'C4 Turnaround', selector: '.c4-chart', snap: false, cursor: 'crosshair' },
    ],
    kpi: { name: 'KPI card', selector: '.kpi-card', snap: false, cursor: 'help' },
  },
};
