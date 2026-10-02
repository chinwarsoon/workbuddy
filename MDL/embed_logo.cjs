/* Inlines the logo as a base64 data URI so MDL-Dashboard.html is a genuine
   single file that can be emailed or copied anywhere. Run once after changing
   the logo:  node embed_logo.cjs
   Uses only Node built-ins — no npm install.                          */
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const dir = __dirname;
const htmlPath = path.join(dir, 'MDL-Dashboard.html');
const logoPath = path.join(dir, 'asset', 'logo.jpg');

const b64 = readFileSync(logoPath).toString('base64');
const uri = 'data:image/jpeg;base64,' + b64;

let html = readFileSync(htmlPath, 'utf8');
const re = /src="asset\/logo\.jpg"/g;
const before = (html.match(re) || []).length;
if (before === 0) {
  console.log('No src="asset/logo.jpg" left to inline — already done?');
  process.exit(0);
}
html = html.replace(re, 'src="' + uri + '"');
writeFileSync(htmlPath, html, 'utf8');
console.log('inlined occurrences:', before);
console.log('data uri length:', uri.length);
