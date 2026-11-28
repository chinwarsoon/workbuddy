// Revision 1.1 | 2026-11-26 | CodeBuddy (AI) | I-164 W3 — inline CommonWelcome, the welcome config, the shared CSS and the common-version meta.
// Revision 1.2 | 2026-11-28 | AWS Quick (AI) | I-166 / common C-08 — inline the new 'tokens' module too, so the six-theme
// chrome-token CSS (common/tokens/tokens.css) ships ahead of MDL's own CSS in the <style> order.
// build.mjs — packages the three ES modules into a single offline MDL-Dashboard.html.
// Strips `import`/`export` keywords and inlines everything into one <script type="module">.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { inlineCommon } from '../common/build/inline-common.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(dir, 'src');
const files = ['xlsx-reader.mjs', 'pipeline.mjs', 'render.mjs'];

// I-164 W3 — inline the shared welcome module and its version meta into the standalone HTML.
const common = inlineCommon({ modules: ['tokens', 'welcome'] });
const help = JSON.parse(fs.readFileSync(path.join(dir, 'config', 'ui_help.json'), 'utf8'));
const welcomeConfig = JSON.parse(JSON.stringify(help.welcome));
const logoPath = path.join(dir, 'asset', 'logo.jpg');
if (fs.existsSync(logoPath)) {
  const b64 = fs.readFileSync(logoPath).toString('base64');
  welcomeConfig.logo = { src: `data:image/jpeg;base64,${b64}`, alt: 'logo' };
}

let code = 'const WELCOME_CONFIG = ' + JSON.stringify(welcomeConfig) + ';\n';
code += common.js + '\n';
let projectCss = '';
for(const f of files){
  let text = fs.readFileSync(path.join(srcDir, f), 'utf8');
  // A stray backtick inside a template literal silently re-terminates it: the rest of
  // the file becomes executable garbage that may still PARSE (so the vm.Script check
  // below would pass) and only fails at runtime. The CSS constant is the one place
  // where prose comments are written next to a template delimiter, so guard it.
  const at = text.indexOf('const CSS = `');
  if(at >= 0){
    const start = at + 'const CSS = `'.length;
    const end = text.indexOf('`;', start);
    if(end < 0 || text.slice(start, end).includes('`')){
      console.error('BUILD FAILED — ' + f + ': the CSS template literal contains a stray backtick.');
      process.exit(1);
    }
    if (f === 'render.mjs') projectCss = text.slice(start, end);
  }
  // strip import lines and `export ` keywords
  text = text.split('\n').filter(l => !/^\s*import\s/.test(l)).map(l => l.replace(/export\s+/, '')).join('\n');
  code += '\n/* ===== ' + f + ' ===== */\n' + text + '\n';
}
code += '\nboot(document.getElementById("app"));\n';

// Fail the build if the assembled bundle does not PARSE. Concatenation plus the
// `export` stripping can silently produce a syntax error — e.g. a stray backtick in
// a CSS comment inside a template literal — and an unparsable bundle ships as a
// blank dashboard. Parse only; never execute.
try {
  new vm.Script(code, { filename: 'bundle.js' });
} catch (e) {
  console.error('BUILD FAILED — assembled bundle does not parse:\n' + e.stack);
  process.exit(1);
}

let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${common.meta}
<style>${common.css}</style>
<style>${projectCss}</style>
<title>TWRP C3B2 — Master Document List Dashboard</title>
</head>
<body>
<div id="app"></div>
<script type="module">
${code}
</script>
</body>
</html>
`;

const out = path.join(dir, 'MDL-Dashboard.html');

// Keep the dashboard header logo as a base64 data-URI (keeps the HTML single-file / offline).
if (fs.existsSync(logoPath)) {
  const b64 = fs.readFileSync(logoPath).toString('base64');
  html = html.replaceAll("'__LOGO_DATA__'", `'data:image/jpeg;base64,${b64}'`);
}
fs.writeFileSync(out, html, 'utf8');
console.log('Wrote', out, '(', html.length, 'bytes )');
