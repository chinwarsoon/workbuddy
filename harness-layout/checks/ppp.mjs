// checks/ppp.mjs — harness config for the PPP dashboard.
// Tier 3 is LIMITED: PPP pipeline is monolithic (I-76 — not yet extracted to src/).
// pipelinePath is null; harness.mjs falls back to file-drop simulation only.
// Once I-76 is resolved, set pipelinePath/xlsxReaderPath/renderPath and remove this note.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pppRoot = resolve(here, '../../PPP');

export default {
  // Paths
  htmlPath:        resolve(pppRoot, 'Procurement-Dashboard.html'),
  srcDir:          null,          // I-76: not yet modularised
  xlsxReaderPath:  null,          // I-76
  pipelinePath:    null,          // I-76: Tier 3 ground-truth import not available
  renderPath:      null,          // I-76
  defaultWorkbook: resolve(pppRoot, 'TWRP C3B2 - Procurement Package Plan.xlsx'),

  // Tier 3 — DOM selectors (used only when pipelinePath is set)
  kpiSelectors: {
    totalPlanned: '.kpi:nth-child(1) .v',
    submitted:    null,
    overdueFirst: null,
  },

  filterTriggerSelector: '.tf-btn',
  validationCountSelector: null,

  // Tier 4c — table chrome (compulsory)
  chrome: {
    titleSelector: '.panel-head h2, h2',  // PPP titles are not all wrapped in .panel-head
    scrollProbe:   240,                   // px scrolled to prove the header sticks
    tolerance:     2,                     // px
    controlContrast: 'advisory',          // readable control text (I-105); advisory until PPP re-verified
  },
};
