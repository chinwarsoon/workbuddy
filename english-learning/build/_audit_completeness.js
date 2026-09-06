#!/usr/bin/env node
// Per-pack per-word completeness audit tool for content/*.json.
// Goal: ensure the SAME word appearing in DIFFERENT packs has COMPLETE
// explanations IN EACH pack (not only in the merged view).
//
// Usage:
//   node build/_audit_completeness.js                 # human report
//   node build/_audit_completeness.js --json          # machine report
//   node build/_audit_completeness.js --word aluminum # one word across packs
//   node build/_audit_completeness.js --pack freq-1k  # only one pack
//   node build/_audit_completeness.js --dir content   # scan another dir
//   node build/_audit_completeness.js --out build/_audit_report.json
//
// A word entry is considered "complete" in a pack when ALL of these are
// non-empty strings: def, defEn, ex, exzh, exEn.
//
// A word's example is considered "templated" (not a real teaching example)
// when its content matches a known placeholder pattern. These pass the
// non-empty check but carry no pedagogical value, so we flag them
// separately as the "fake-complete" gap that Option B Phase 2 must close.

const fs   = require('fs');
const path = require('path');

const args = (() => {
  const argv = process.argv.slice(2);
  const out = {};
  for(let i=0; i<argv.length; i++){
    if(!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const next = argv[i+1];
    if(next === undefined || next.startsWith('--')){
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
})();

const DIR        = typeof args.dir==='string'   ? args.dir   : 'content';
const FILT_WORD  = (typeof args.word==='string' && args.word.toLowerCase()) || null;
const FILT_PACK  = typeof args.pack==='string'  ? args.pack  : null;
const OUT        = typeof args.out==='string'   ? args.out   : null;
const JSON_OUT   = !!args.json;

const PACKS = ['freq-1k','freq-2k','freq-3k','freq-4k','general','nce2','nce3','nce4'];
const FIELDS = ['def','defEn','ex','exzh','exEn'];

function isEmpty(v){ return v===undefined || v===null || (typeof v==='string' && v.trim()===''); }

// Known placeholder/exemplar template patterns that pass the non-empty
// check but carry no teaching value. Extend with care — only patterns
// produced by an upstream tool, NOT low-quality real examples.
function isTemplateExample(w){
  const ex   = (w.ex   || '').trim();
  const exzh = (w.exzh || '').trim();
  const exEn = (w.exEn || '').trim();
  if(!ex && !exzh && !exEn) return false;     // it's an empty example, not a template
  const word = String(w.word || '');
  // raw generator placeholder: "This {word} helps explain the result." / "这个{word}有助于解释结果。"
  if(ex === 'This ' + word + ' helps explain the result.') return true;
  if(exEn === 'This ' + word + ' helps explain the result.') return true;
  if(exzh === '这个' + word + '有助于解释结果。') return true;
  // a few more variants the raw generator emitted
  if(ex === word + ' helps explain the result.') return true;
  if(exEn === word + ' helps explain the result.') return true;
  if(exzh === '这个' + word + '有助于解释结果') return true;
  // NAWL p4_words_raw.json templates
  if(ex === 'This is a  ' + word + ' example of the method.') return true;
  if(exEn === 'This is a  ' + word + ' example of the method.') return true;
  if(ex === 'We studied the ' + word + ' in detail.') return true;
  if(exEn === 'We studied the ' + word + ' in detail.') return true;
  if(ex === 'We collected the ' + word + ' from multiple sources.') return true;
  if(exEn === 'We collected the ' + word + ' from multiple sources.') return true;
  // Chinese-side NAWL templates
  if(exzh === '这是 ' + word + ' 在该方法中的一个 示例。') return true;
  if(exzh === '我们详细研究了' + word + '。') return true;
  if(exzh === '我们从多个来源收集了' + word + '。') return true;
  return false;
}

function load(dir){
  const out = {};
  for(const pid of PACKS){
    const p = path.join(dir, pid + '.json');
    if(!fs.existsSync(p)) continue;
    if(FILT_PACK && pid!==FILT_PACK) continue;
    try {
      const j = JSON.parse(fs.readFileSync(p,'utf8'));
      out[pid] = Array.isArray(j.words) ? j.words : [];
    } catch(e) {
      console.error('WARN: failed to parse', p, e.message);
    }
  }
  return out;
}

// word -> pack -> entry, normalized by lowercased word.
function index(packs){
  const idx = {};                       // key(w) -> { pack -> entry }
  for(const pid of Object.keys(packs)){
    for(const w of packs[pid]){
      if(!w || !w.word) continue;
      const k = String(w.word).toLowerCase();
      if(FILT_WORD && k!==FILT_WORD) continue;
      (idx[k] = idx[k] || {})[pid] = w;
    }
  }
  return idx;
}

function statusOf(w){
  const out = {};
  for(const f of FIELDS) out[f] = isEmpty(w[f]) ? 'EMPTY' : 'OK';
  return out;
}

function isComplete(s){ return FIELDS.every(f => s[f]==='OK'); }

function packTotals(packs){
  const t = {};
  for(const pid of Object.keys(packs)){
    const arr = packs[pid];
    const s = { def:0, defEn:0, ex:0, exzh:0, exEn:0, completeWords:0, templatedWords:0 };
    for(const w of arr){
      for(const f of FIELDS){ if(isEmpty(w[f])) s[f]++; }
      if(FIELDS.every(f => !isEmpty(w[f]))) s.completeWords++;
      if(isTemplateExample(w)) s.templatedWords++;
    }
    t[pid] = { total: arr.length, missing: s, complete: s.completeWords, templated: s.templatedWords };
  }
  return t;
}

// words that appear in 2+ packs with DIFFERENT completeness (the spec scenario).
function crossPackDiff(idx){
  const rows = [];
  for(const k of Object.keys(idx).sort()){
    const seen = idx[k];
    const pids = Object.keys(seen);
    if(pids.length < 2) continue;
    const flags = pids.map(p => FIELDS.map(f => isEmpty(seen[p][f]) ? f[0].toUpperCase() : '.').join(''));
    const uniq = new Set(flags);
    if(uniq.size === 1) continue;                  // same completeness everywhere
    rows.push({ word: k, packs: pids, flags });
  }
  return rows;
}

// words in pack X with empty ex/exzh/exEn
function perPackIncomplete(packs){
  const out = {};
  for(const pid of Object.keys(packs)){
    const list = [];
    for(const w of packs[pid]){
      const missing = FIELDS.filter(f => isEmpty(w[f]));
      if(missing.length === 0) continue;
      list.push({ word: w.word, missing });
    }
    out[pid] = list;
  }
  return out;
}

// words with all five fields non-empty BUT the example is a known template
// (i.e. "fake-complete" — looks fine, teaches nothing). Phase 2 target.
function perPackTemplated(packs){
  const out = {};
  for(const pid of Object.keys(packs)){
    const list = [];
    for(const w of packs[pid]){
      if(!isTemplateExample(w)) continue;
      list.push({ word: w.word, ex: w.ex, exzh: w.exzh, exEn: w.exEn });
    }
    out[pid] = list;
  }
  return out;
}

function renderHuman({ totals, cross, incomplete, templated, idx, allWords }){
  const lines = [];
  lines.push('=========================================================');
  lines.push('  Per-Pack Per-Word Completeness Audit (' + DIR + ')');
  lines.push('=========================================================');
  lines.push('');
  lines.push('Per-pack summary (count of words missing each field; !! = fake-complete template):');
  lines.push('');
  const cols = ['pack','total','complete','!!tpl','!def','!defEn','!ex','!exzh','!exEn'];
  const w = cols.map(c => Math.max(c.length, 6));
  for(const pid of Object.keys(totals)){
    const t = totals[pid];
    const row = [pid, t.total, t.complete, t.templated, t.missing.def, t.missing.defEn,
                 t.missing.ex, t.missing.exzh, t.missing.exEn];
    for(let i=0;i<cols.length;i++) w[i] = Math.max(w[i], String(row[i]).length);
  }
  lines.push(cols.map((c,i)=>c.padEnd(w[i])).join(' | '));
  lines.push(w.map(x=>'-'.repeat(x)).join('-+-'));
  for(const pid of Object.keys(totals)){
    const t = totals[pid];
    const row = [pid, t.total, t.complete, t.templated, t.missing.def, t.missing.defEn,
                 t.missing.ex, t.missing.exzh, t.missing.exEn];
    lines.push(row.map((r,i)=>String(r).padEnd(w[i])).join(' | '));
  }
  lines.push('');
  // cross-pack diff
  lines.push('Words appearing in 2+ packs with DIFFERENT completeness flag (D=def E=defEn X=ex Xz=exzh Xe=exEn; . = present):');
  lines.push('');
  if(cross.length === 0){
    lines.push('  (none — every shared word is equally complete across packs)');
  } else {
    lines.push('  ' + cross.length + ' word(s):');
    for(const r of cross.slice(0, 60)){
      lines.push('    ' + r.word.padEnd(14) + ' ' + r.packs.map((p,i)=>p+':'+r.flags[i]).join('  '));
    }
    if(cross.length > 60) lines.push('    ... and ' + (cross.length-60) + ' more');
  }
  lines.push('');
  // templated (fake-complete) — Phase 2 target
  lines.push('!! FAKE-COMPLETE words (all fields filled, but example is a known placeholder template):');
  lines.push('');
  let anyTpl = false;
  for(const pid of Object.keys(templated)){
    const list = templated[pid];
    if(!list.length) continue;
    anyTpl = true;
    lines.push('  [' + pid + '] ' + list.length + ' word(s) to fix in Phase 2:');
    for(const w of list.slice(0, 8)){
      lines.push('    - ' + w.word.padEnd(14) + ' ex="' + w.ex + '" / exzh="' + w.exzh + '"');
    }
    if(list.length > 8) lines.push('    ... and ' + (list.length-8) + ' more');
  }
  if(!anyTpl) lines.push('  (none)');
  lines.push('');
  // per-pack incomplete
  lines.push('Per-pack incomplete words (each word lists which fields are empty):');
  lines.push('');
  let any = false;
  for(const pid of Object.keys(incomplete)){
    const list = incomplete[pid];
    if(!list.length) continue;
    any = true;
    lines.push('  [' + pid + '] ' + list.length + ' word(s) need fix:');
    for(const w of list.slice(0, 12)){
      lines.push('    - ' + w.word.padEnd(14) + ' missing: ' + w.missing.join(','));
    }
    if(list.length > 12) lines.push('    ... and ' + (list.length-12) + ' more');
  }
  if(!any) lines.push('  (none — every pack has every field filled for every word)');
  lines.push('');
  // critical: words incomplete in EVERY pack they appear in
  const orphans = [];
  for(const k of Object.keys(idx)){
    const seen = idx[k];
    let bad = true, complete = false;
    for(const pid of Object.keys(seen)){
      const s = statusOf(seen[pid]);
      if(isComplete(s)) { complete = true; bad = false; break; }
    }
    if(!complete && bad) orphans.push(k);
  }
  lines.push('Critical — words incomplete in EVERY pack they appear in (Option B targets):');
  lines.push('  count: ' + orphans.length);
  if(orphans.length){
    lines.push('  examples: ' + orphans.slice(0,40).join(', '));
  }
  lines.push('');
  return lines.join('\n');
}

function main(){
  const packs = load(DIR);
  const idx   = index(packs);
  const totals      = packTotals(packs);
  const cross       = crossPackDiff(idx);
  const incomplete  = perPackIncomplete(packs);
  const templated   = perPackTemplated(packs);
  const allWords    = Object.keys(idx).sort();

  if(JSON_OUT){
    const report = {
      dir: DIR,
      packs: Object.keys(packs),
      totals, crossPackDiff: cross,
      perPackIncomplete: incomplete,
      perPackTemplated: {
        pid: Object.keys(templated).map(p => ({ pack: p, count: templated[p].length }))
          .reduce((a,r)=>{ a[r.pack]=r.count; return a; }, {}),
        words: templated
      },
      orphanCount: allWords.filter(k => {
        for(const pid of Object.keys(idx[k])) if(isComplete(statusOf(idx[k][pid]))) return false;
        return true;
      }).length,
    };
    const text = JSON.stringify(report, null, 2);
    if(OUT) { fs.writeFileSync(OUT, text, 'utf8'); console.log('wrote', OUT); }
    else    { console.log(text); }
    return;
  }

  const text = renderHuman({ totals, cross, incomplete, templated, idx, allWords });
  if(OUT) { fs.writeFileSync(OUT, text, 'utf8'); console.log('wrote', OUT); }
  else    { console.log(text); }
}

main();