#!/usr/bin/env node
'use strict';
// Backfill missing fields in content/*.json using raw source maps.
// Each pack can map to one or more raw sources; only EMPTY fields are filled
// (non-empty fields are preserved as-is to avoid overwriting curated content).
//
// Config (edit SOURCES below):
//   freq-3k -> build/p4_words_raw.json   (NAWL academic words missing in p3 raw)
//   freq-4k -> build/p4_words_raw.json   (already complete, no-op)
//
// Raw entry format: [ipa, pos, zh, enDef, enEx, zhEx, enEx, emoji]
//
// Usage:
//   node build/_backfill_content.js [--dry-run] [--out build/_backfill_report.json]

const fs   = require('fs');
const path = require('path');

function parseArgs(argv){
  const out = {};
  for(let i=0; i<argv.length; i++){
    if(!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const next = argv[i+1];
    if(next === undefined || next.startsWith('--')){ out[key] = true; }
    else { out[key] = next; i++; }
  }
  return out;
}

const args    = parseArgs(process.argv.slice(2));
const DRY     = !!args['dry-run'];
const OUT     = typeof args.out === 'string' ? args.out : null;
const DIR     = typeof args.dir === 'string' ? args.dir : 'content';

const SOURCES = {
  'freq-3k': ['build/p4_words_raw.json'],
  'freq-4k': ['build/p4_words_raw.json'],
};
const PACKS  = Object.keys(SOURCES);
const FIELDS = ['ipa','pos','def','defEn','ex','exzh','exEn','emoji'];

function isEmpty(v){ return v===undefined || v===null || (typeof v==='string' && v.trim()===''); }

function loadRaw(rel){
  let p = rel;
  if(!fs.existsSync(p)) p = path.join('..', rel);
  if(!fs.existsSync(p)) throw new Error('source not found: ' + rel);
  return JSON.parse(fs.readFileSync(p,'utf8'));
}

function rawLookup(raw, word){
  if(!word) return null;
  if(raw[word]) return raw[word];
  const lower = String(word).toLowerCase();
  if(raw[lower]) return raw[lower];
  for(const k of Object.keys(raw)){
    if(k.toLowerCase() === lower) return raw[k];
  }
  return null;
}

function applyEntry(w, entry){
  if(!Array.isArray(entry) || entry.length < 8) return null;
  const [ipa, pos, def, defEn, ex, exzh, exEn, emoji] = entry;
  const before = {};
  for(const f of FIELDS) before[f] = isEmpty(w[f]);
  if(isEmpty(w.ipa)   && !isEmpty(ipa))   w.ipa   = ipa;
  if(isEmpty(w.pos)   && !isEmpty(pos))   w.pos   = pos;
  if(isEmpty(w.def)   && !isEmpty(def))   w.def   = def;
  if(isEmpty(w.defEn) && !isEmpty(defEn)) w.defEn = defEn;
  if(isEmpty(w.ex)    && !isEmpty(ex))    w.ex    = ex;
  if(isEmpty(w.exzh)  && !isEmpty(exzh))  w.exzh  = exzh;
  if(isEmpty(w.exEn)  && !isEmpty(exEn))  w.exEn  = exEn;
  if(isEmpty(w.emoji) && !isEmpty(emoji)) w.emoji = emoji;
  const filled = [];
  for(const f of FIELDS){ if(before[f] && !isEmpty(w[f])) filled.push(f); }
  return filled.length ? filled : null;
}

function processPack(packId, sources){
  const p = path.join(DIR, packId + '.json');
  if(!fs.existsSync(p)) return { packId, skipped: 'no file' };
  const data = JSON.parse(fs.readFileSync(p,'utf8'));
  if(!Array.isArray(data.words)) return { packId, skipped: 'no words array' };

  const report = { packId, totalWords: data.words.length, fixedWords: 0, fixedFields: {}, notFound: [], notInRaw: [] };
  const rawMap = sources.map(rel => ({ rel, raw: loadRaw(rel) }));

  for(const w of data.words){
    let filled = null;
    for(const src of rawMap){
      const entry = rawLookup(src.raw, w.word);
      if(entry){ filled = applyEntry(w, entry); break; }
    }
    if(!filled){
      if(FIELDS.some(f => isEmpty(w[f]))){
        report.notFound.push(w.word);
      } else {
        report.notInRaw.push(w.word);
      }
      continue;
    }
    if(filled.length){
      report.fixedWords++;
      for(const f of filled){
        report.fixedFields[f] = (report.fixedFields[f] || 0) + 1;
      }
    }
  }

  if(!DRY && report.fixedWords > 0){
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  }
  return report;
}

function main(){
  const all = [];
  for(const pid of PACKS){
    all.push(processPack(pid, SOURCES[pid]));
  }
  const text = JSON.stringify(all, null, 2);
  if(OUT){ fs.writeFileSync(OUT, text, 'utf8'); console.error('wrote', OUT); }
  for(const r of all){
    console.error(`[${r.packId}] words=${r.totalWords} fixed=${r.fixedWords||0} notFound=${(r.notFound||[]).length} notInRaw=${(r.notInRaw||[]).length}${DRY ? ' (DRY-RUN)' : ''}`);
  }
}

main();