// checks/sub.mjs — harness config for the Document Submittal Dashboard (TWRP C3B2).
// Points at the static review sample (sub/Arch/Document-Submittal-Dashboard-Sample.html).
// The sample is a mockup that predates the built pipeline, so many Tier 1 token / panel
// checks are expected to fail until the dashboard is built (Wave 2). The layout-critical
// z-index stack and the sidebar / app-bar geometry are already implemented and verified.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const subRoot = resolve(here, '../../sub');

export default {
  // Paths
  htmlPath: resolve(subRoot, 'Arch/Document-Submittal-Dashboard-Sample.html'),

  // Not modularised yet — static sample. Wave 2 will add src/ modules.
  srcDir: null,
  xlsxReaderPath: null,
  pipelinePath: null,
  renderPath: null,
  defaultWorkbook: null,

  // Tier 3 — not wired yet
  kpiSelectors: null,
  filterTriggerSelector: '.tf-btn',
  validationCountSelector: null,

  // Tier 4 — sample is its own static file
  samplePath: resolve(subRoot, 'Arch/Document-Submittal-Dashboard-Sample.html'),
  geometry: {
    tableSelector: 'table.ds-table',
    expectedRowH: 40,
    expectedHeadH: 40,
    sampleRowLimit: 12,
    tolerance: 0.5,
  },

  // Tier 4c — table chrome (compulsory). Configured for the sample's DOM; enforced once built.
  chrome: {
    titleSelector: '.panel h3',
    headerFragmentSelector: null,
    multiRow: false,
    layout: false,
    splitHeader: false,
    controlContrast: true,
    colMinWidth: 60,
    scrollProbe: 240,
    tolerance: 2,
  },
};
