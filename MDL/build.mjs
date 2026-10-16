// build.mjs — packages the three ES modules into a single offline MDL-Dashboard.html.
// Strips `import`/`export` keywords and inlines everything into one <script type="module">.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(dir, 'src');
const files = ['xlsx-reader.mjs', 'pipeline.mjs', 'render.mjs'];

let code = '';
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

// embed the project logo as a base64 data-URI (keeps the HTML single-file / offline)
const logoPath = path.join(dir, 'asset', 'logo.jpg');
if(fs.existsSync(logoPath)){
  const b64 = fs.readFileSync(logoPath).toString('base64');
  html = html.replaceAll("'__LOGO_DATA__'", `'data:image/jpeg;base64,${b64}'`);
}
fs.writeFileSync(out, html, 'utf8');
console.log('Wrote', out, '(', html.length, 'bytes )');
