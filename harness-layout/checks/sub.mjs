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
    headerFragmentSelector: null,
    multiRow: false,
    layout: false,
    splitHeader: false,
    controlContrast: true,
    minGridTables: 1,
    colMinWidth: 60,
    scrollProbe: 240,
    tolerance: 2,
  },
};
