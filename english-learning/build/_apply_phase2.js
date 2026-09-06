#!/usr/bin/env node
// Apply Phase 2 example injection: read a JSON map of {word:{ex,exzh,exEn}}
// and write into content/<pack>.json and pwa/content/<pack>.json for every
// pack whose words appear in the map. Preserves all other fields.
//
// Usage:
//   node build/_apply_phase2.js --map build/_p2_chunk1_examples.json
//
const fs   = require('fs');
const path = require('path');

const args = (() => {
  const out = {};
  const argv = process.argv.slice(2);
  for(let i=0;i<argv.length;i++){
    if(!argv[i].startsWith('--')) continue;
    const k = argv[i].slice(2);
    const n = argv[i+1];
    if(n === undefined || n.startsWith('--')){ out[k]=true; }
    else { out[k]=n; i++; }
  }
  return out;
})();

const MAP_PATH = typeof args.map==='string' ? args.map : null;
if(!MAP_PATH){
  console.error('Usage: node _apply_phase2.js --map <examples.json>');
  process.exit(1);
}

const examples = JSON.parse(fs.readFileSync(MAP_PATH,'utf8'));
const PACKS = ['freq-1k','freq-2k','freq-3k','freq-4k','general','nce2','nce3','nce4'];
const DIRS  = ['content','pwa/content'];

let totalTouched = 0;
const summary = [];

for(const dir of DIRS){
  for(const pid of PACKS){
    const p = path.join(dir, pid + '.json');
    if(!fs.existsSync(p)) continue;
    const j = JSON.parse(fs.readFileSync(p,'utf8'));
    if(!j || !Array.isArray(j.words)) continue;
    let touched = 0;
    for(const w of j.words){
      const k = String(w.word).toLowerCase();
      const ex = examples[k];
      if(!ex) continue;
      // Skip if word already has a non-empty, non-template example
      const alreadyGood = w.ex && w.ex.trim() && !/^(This|This|this)\s+\w+\s+helps explain the result\.$/.test(w.ex.trim());
      if(alreadyGood) continue;
      w.ex   = ex.ex   || w.ex   || '';
      w.exEn = ex.exEn || w.ex   || w.exEn || '';
      w.exzh = ex.exzh || w.exzh || '';
      touched++;
    }
    if(touched>0){
      fs.writeFileSync(p, JSON.stringify(j, null, 1), 'utf8');
      summary.push(dir+'/'+pid+': touched='+touched);
      totalTouched += touched;
    }
  }
}
console.log('Total words touched:', totalTouched);
summary.forEach(s=>console.log('  '+s));
