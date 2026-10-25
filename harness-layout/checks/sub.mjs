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
  c1: {
    panelSelector: '.scurve',
    svgSelector: '.scurve svg',
    lineSelector: '.scurve svg polyline',
    barSelector: '.scurve svg > rect[class^="sc-bar-"]',
    boardSelector: '.sc-board',
    refStartSelector: '.sc-ref-start',
    refTodaySelector: '.sc-ref-today',
    refLabelSelector: '.sc-ref-lbl',
    asOfSelector: '.sc-asof',
    barsToggleSelector: '[data-c1bars]',
    seriesButtonSelector: '#tfBtn_c1series',
    seriesPanelSelector: '#tfPanel_c1series',
    seriesCheckboxSelector: '[data-c1series]',
    grainSelector: '[data-c1grain]',
    expectedSeries: 4,
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
};
