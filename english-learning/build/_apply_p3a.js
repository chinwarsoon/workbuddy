// P3-A: Expand narrow-def high-frequency words in freq-1k.json
// Fix: 3 translation bugs + 5 narrow-def words → expand def + defEn + pos
// Keep ex/exzh/exEn as-is (already teaches primary meaning).

const fs   = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'content', 'freq-1k.json');
const fixMapFile = path.join(__dirname, '_p3a_fixes.json');
const logFile    = path.join(__dirname, '_p3a_apply.json');

const fixMap = JSON.parse(fs.readFileSync(fixMapFile, 'utf8'));
const pack   = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

const log = [];
let changed = 0;

for (const w of pack.words) {
  const k = w.word.toLowerCase();
  if (!(k in fixMap)) continue;

  const fix = fixMap[k];
  const before = { word: w.word, def: w.def, defEn: w.defEn, pos: w.pos };
  const after  = { word: w.word, def: fix.def, defEn: fix.defEn, pos: fix.pos };

  w.def   = fix.def;
  w.defEn = fix.defEn;
  w.pos   = fix.pos;
  changed++;

  log.push({ word: w.word, before, after });
}

fs.writeFileSync(targetFile, JSON.stringify(pack, null, 2), 'utf8');
fs.writeFileSync(logFile, JSON.stringify({ targetFile, changed, log }, null, 2), 'utf8');

// Mirror to pwa/content/
const mirror = path.join(__dirname, '..', 'pwa', 'content', 'freq-1k.json');
fs.copyFileSync(targetFile, mirror);

console.log('P3-A applied:', changed, 'word(s) updated in freq-1k.json');
console.log('Mirror synced to pwa/content/freq-1k.json');
console.log('Log:', logFile);