// P3-B: Replace Phase 2 leftover templates with real examples
// Usage: node build/_apply_p3b.js --map build/_p3b_cN_ex.json

const fs   = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
let MAP_PATH = null;
let PACK = null;

for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--map')  MAP_PATH = argv[++i];
  if (argv[i] === '--pack') PACK = argv[++i];
}

if (!MAP_PATH) { console.error('Usage: node _apply_p3b.js --map <file> [--pack packId]'); process.exit(1); }

const exMap = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));

// Determine target pack(s): use --pack if given, else guess from word list's pack tags
let targetPacks = [];
if (PACK) {
  targetPacks = [PACK];
} else {
  // exMap is a list of { word, ex, exzh, exEn }; look up pack by reading content files
  const PACKS = ['freq-1k','freq-2k','freq-3k','freq-4k','general','nce2','nce3','nce4'];
  targetPacks = PACKS;
}

const CHANGED = [];
const NOT_FOUND = [];
const SKIPPED_PACK_MISMATCH = [];

for (const tp of targetPacks) {
  const filePath = path.join(__dirname, '..', 'content', tp + '.json');
  if (!fs.existsSync(filePath)) continue;
  const pack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;
  for (const w of pack.words) {
    const k = w.word.toLowerCase();
    const fix = exMap.find(m => m.word.toLowerCase() === k);
    if (!fix) continue;

    const before = { ex: w.ex, exzh: w.exzh, exEn: w.exEn };
    let changedThis = false;
    if (fix.ex   && (!w.ex   || isTemplate(w.ex)))   { w.ex   = fix.ex;   changedThis = true; }
    if (fix.exzh && (!w.exzh || isTemplate(w.exzh))) { w.exzh = fix.exzh; changedThis = true; }
    if (fix.exEn && (!w.exEn || isTemplate(w.exEn))) { w.exEn = fix.exEn; changedThis = true; }

    if (changedThis) {
      CHANGED.push({ pack: tp, word: w.word, before, after: { ex: w.ex, exzh: w.exzh, exEn: w.exEn } });
      changed++;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(pack, null, 2), 'utf8');
  // Mirror
  const mirror = path.join(__dirname, '..', 'pwa', 'content', tp + '.json');
  if (fs.existsSync(mirror)) fs.copyFileSync(filePath, mirror);
  console.log('P3-B [' + tp + ']: ' + changed + ' word(s) updated');
}

// Helpers
function isTemplate(s) {
  if (!s) return false;
  const t = String(s).trim();
  if (!t) return false;
  // Quick heuristic: matches Phase 2 NAWL raw templates
  return /^This is a  \w+ example of the method\.$/.test(t) ||
         /^We studied the \w+ in detail\.$/.test(t) ||
         /^We collected the \w+ from multiple sources\.$/.test(t) ||
         /^This \w+ helps explain the result\.$/.test(t) ||
         /^这个\w+有助于解释结果[。]?$/.test(t) ||
         /^我们详细研究了\w+[。]?$/.test(t) ||
         /^我们从多个来源收集了\w+[。]?$/.test(t);
}

console.log('Total P3-B changes:', CHANGED.length);