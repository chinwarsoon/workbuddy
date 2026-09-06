// P3-B def fix: clean up 3 translation bugs in freq-2k.json
const fs = require('fs');
const path = require('path');

const fixMap = JSON.parse(fs.readFileSync(path.join(__dirname, '_p3b_def_fixes.json'), 'utf8'));
const targetFile = path.join(__dirname, '..', 'content', 'freq-2k.json');
const pack = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

let changed = 0;
for (const w of pack.words) {
  const fix = fixMap.find(f => f.word.toLowerCase() === w.word.toLowerCase());
  if (!fix) continue;
  const before = { def: w.def, defEn: w.defEn, pos: w.pos };
  w.def   = fix.def;
  w.defEn = fix.defEn;
  w.pos   = fix.pos;
  changed++;
  console.log('fixed [' + w.word + ']: ' + JSON.stringify(before) + ' -> ' + JSON.stringify(fix));
}

fs.writeFileSync(targetFile, JSON.stringify(pack, null, 2), 'utf8');
fs.copyFileSync(targetFile, path.join(__dirname, '..', 'pwa', 'content', 'freq-2k.json'));
console.log('Total def fixes:', changed);
console.log('Mirror synced.');