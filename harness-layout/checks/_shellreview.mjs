// checks/_shellreview.mjs — harness config for the shell review sample (samples/).
// Revision 1.0 | 2026-10-30 | CodeBuddy (AI) | Added to run Tier 1 and Tier 2 against the
// dashboard shell sample. The leading underscore keeps it out of the default `node harness.mjs`
// run (the registry skips `_` files); run it explicitly:
//   node harness.mjs --dashboard _shellreview --tier 1
//   node harness.mjs --dashboard _shellreview --tier 2
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export default {
  htmlPath: resolve(here, '../samples/dashboard-shell-sample.html'),
  srcDir: null,
  xlsxReaderPath: null,
  pipelinePath: null,
  renderPath: null,
  defaultWorkbook: null,
  filterTriggerSelector: '.tf-btn',
};
