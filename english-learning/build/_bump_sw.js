#!/usr/bin/env node
// Auto-bump the PWA service-worker cache name from a hash of the served content.
// Run BEFORE every deploy (and at the end of _build_p4.js) so devices never
// serve a stale cached pack. No manual version edits required.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIR = 'C:/Users/frank/WorkBuddy/workbuddy/english-learning';
const pwa = path.join(DIR, 'pwa');
const contentDir = path.join(pwa, 'content');

// Everything the service worker precaches / serves.
const parts = [];
const contentFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.json')).sort();
contentFiles.forEach(f => parts.push(fs.readFileSync(path.join(contentDir, f))));
// index.html is also precached; include it so UI edits propagate too.
parts.push(fs.readFileSync(path.join(pwa, 'index.html')));

const hash = crypto.createHash('sha256').update(Buffer.concat(parts)).digest('hex').slice(0, 8);
const newName = 'ed-' + hash;

const swPath = path.join(pwa, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
if (!/const CACHE = "[^"]+";/.test(sw)) {
  console.error('ERROR: CACHE constant not found in sw.js');
  process.exit(1);
}
const before = (sw.match(/const CACHE = "([^"]+)";/) || [])[1];
sw = sw.replace(/const CACHE = "[^"]+";/, `const CACHE = "${newName}";`);
fs.writeFileSync(swPath, sw);

console.log(`SW cache: ${before || '(none)'} -> ${newName}  (hashed ${contentFiles.length} packs + index.html)`);
