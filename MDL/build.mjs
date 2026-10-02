// build.mjs — packages the three ES modules into a single offline MDL-Dashboard.html.
// Strips `import`/`export` keywords and inlines everything into one <script type="module">.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(dir, 'src');
const files = ['xlsx-reader.mjs', 'pipeline.mjs', 'render.mjs'];

let code = '';
for(const f of files){
  let text = fs.readFileSync(path.join(srcDir, f), 'utf8');
  // strip import lines and `export ` keywords
  text = text.split('\n').filter(l => !/^\s*import\s/.test(l)).map(l => l.replace(/export\s+/, '')).join('\n');
  code += '\n/* ===== ' + f + ' ===== */\n' + text + '\n';
}
code += '\nboot(document.getElementById("app"));\n';

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
