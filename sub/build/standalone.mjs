// Revision 0.1 | 2026-10-24 | CodeBuddy (AI) | Builds the standalone dashboard HTML.
// The dashboard must run from file:// with no web server, so it cannot use ES-module
// `import` or `fetch` — both are blocked on the file: origin. This script inlines the
// stylesheet, the two config files, and the whole engine into ONE self-contained HTML,
// mirroring MDL (a single HTML with one inline <script type="module">).
// Run it after editing anything under engine/ or config/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = path.join(ROOT, 'TWRP C3B2 - Document Submittal Dashboard.html');
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');

const stripModuleSyntax = source => source
  .split('\n')
  .filter(line => !/^\s*import\s[^;]*from\s*['"][^'"]*['"];?\s*$/.test(line))
  .filter(line => !/^\s*import\s*['"][^'"]*['"];?\s*$/.test(line))
  .filter(line => !/^\s*export\s*\{[^}]*\}\s*;?\s*$/.test(line))
  .join('\n')
  .replace(/^(\s*)export\s+/gm, '$1');

const escapeClosingScript = text => text.replace(/<\/script/gi, '<\\/script');

const css = read('engine/dashboard.css');
const contract = read('config/pipeline_contract.json');
const uiHelp = read('config/ui_help.json');
const bundle = ['engine/xlsx-reader.js', 'engine/pipeline.js', 'engine/render.js', 'engine/dashboard.js']
  .map(file => `/* ===== ${file} ===== */\n${stripModuleSyntax(read(file)).trim()}`)
  .join('\n\n');

const BEGIN = '<!-- STANDALONE:BEGIN -->';
const END = '<!-- STANDALONE:END -->';
const block = [
  `  ${BEGIN}`,
  '  <style>',
  css.trim(),
  '  </style>',
  '  <script type="application/json" id="pipeline-contract">',
  contract.trim(),
  '  </script>',
  '  <script type="application/json" id="ui-help">',
  uiHelp.trim(),
  '  </script>',
  '  <script type="module">',
  escapeClosingScript(bundle),
  '  </script>',
  `  ${END}`
].join('\n');

let html = fs.readFileSync(TARGET, 'utf8');
if (html.includes(BEGIN) && html.includes(END)) {
  const before = html.slice(0, html.indexOf(BEGIN));
  const after = html.slice(html.indexOf(END) + END.length);
  html = before + block + after;
} else {
  const external = '  <link rel="stylesheet" href="./engine/dashboard.css">\n  <script type="module" src="./engine/dashboard.js"></script>';
  if (!html.includes(external)) throw new Error('Could not find the external CSS/JS references to replace.');
  html = html.replace(external, block);
}
// Inline the logo as a data URI (MDL does the same), so the HTML is one portable file.
const logoData = `src="data:image/jpeg;base64,${fs.readFileSync(path.join(ROOT, 'asset/logo.jpg')).toString('base64')}"`;
html = html.includes('src="./asset/logo.jpg"')
  ? html.split('src="./asset/logo.jpg"').join(logoData)
  : html.replace(/src="data:image\/jpeg;base64,[^"]*"/g, logoData);

fs.writeFileSync(TARGET, html);
console.log(`Standalone HTML rebuilt: ${TARGET} (${html.length.toLocaleString()} bytes)`);
