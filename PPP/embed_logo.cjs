const { readFileSync, writeFileSync } = require('fs');

const b64 = readFileSync('asset/logo.jpg').toString('base64');
const uri = 'data:image/jpeg;base64,' + b64;

const htmlPath = 'Procurement-Dashboard.html';
let html = readFileSync(htmlPath, 'utf8');

const re = /src="asset\/logo\.jpg"/g;
const before = (html.match(re) || []).length;
html = html.replace(re, 'src="' + uri + '"');
writeFileSync(htmlPath, html);

console.log('replaced occurrences:', before);
console.log('data uri length:', uri.length);
