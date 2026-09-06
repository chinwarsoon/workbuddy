// P3-B: Cross-pack polysemy audit
//
// For every word that appears in 2+ packs, classify the relationship:
//   (a) sameDef       — def matches exactly across packs (likely a single shared meaning; possibly stale)
//   (b) differentDef  — def differs across packs (correctly per-pack contextualised)
//   (c) subset        — one pack's def is a substring of another (probably correct, one is broader)
//   (d) conflicting   — def strings disagree semantically without obvious subset relation
//
// For (c) and (d) we look for "suspicious" cases: where the def feels unrelated
// to the example sentence in the same entry.
//
// Output: build/_p3b_polysemy_report.json
// Also: a human-readable markdown summary at build/_p3b_summary.md

const fs   = require('fs');
const path = require('path');

const PACKS = ['freq-1k','freq-2k','freq-3k','freq-4k','general','nce2','nce3','nce4'];
const DATA_DIR = path.join(__dirname, '..', 'content');

function loadAll() {
  const out = {};
  for (const pid of PACKS) {
    const j = JSON.parse(fs.readFileSync(path.join(DATA_DIR, pid + '.json'), 'utf8'));
    out[pid] = j.words || [];
  }
  return out;
}

// Build lemma index: lemma -> [{ pack, def, defEn, pos, ex }]
function indexByLemma(packs) {
  const idx = {};
  for (const pid of Object.keys(packs)) {
    for (const w of packs[pid]) {
      if (!w || !w.word) continue;
      const k = String(w.word).toLowerCase();
      (idx[k] = idx[k] || []).push({ pack: pid, def: w.def, defEn: w.defEn, pos: w.pos, ex: w.ex });
    }
  }
  return idx;
}

function isSubsetDef(a, b) {
  if (!a || !b) return false;
  // A is a subset of B if every Chinese semicolon-separated chunk in A appears in B
  // (rough proxy: A's def string is contained in B's def string, or A's tokens are a subset)
  const aStr = String(a).replace(/[,;\s]/g, '');
  const bStr = String(b).replace(/[,;\s]/g, '');
  return aStr && bStr && bStr.includes(aStr) && aStr !== bStr;
}

function classify(idx) {
  const out = {
    singlePack:    [],
    multiPackSameDef:    [],
    multiPackDiffDef:    [],
    multiPackSubset:     [],
    multiPackSuspicious: [],
  };

  for (const lemma of Object.keys(idx).sort()) {
    const entries = idx[lemma];
    const packs = entries.map(e => e.pack);
    if (entries.length === 1) {
      out.singlePack.push({ lemma, packs, entries });
      continue;
    }

    // Compare defs
    const defs = entries.map(e => String(e.def || '').trim());
    const allSame = defs.every(d => d === defs[0]);
    if (allSame && defs[0] !== '') {
      out.multiPackSameDef.push({ lemma, packs, entries });
      continue;
    }

    // Check subset relationship
    const uniqDefs = [...new Set(defs)];
    let hasSubset = uniqDefs.length > 1 && uniqDefs.some((d, i) => uniqDefs.some((d2, j) => i !== j && isSubsetDef(d, d2)));
    if (hasSubset) {
      out.multiPackSubset.push({ lemma, packs, entries });
      continue;
    }

    // Different defs — mark as "differentDef" (often correct) but also flag "suspicious"
    // Suspicious = entry whose example doesn't fit the def, or def is suspiciously short/narrow
    const suspicious = [];
    for (const e of entries) {
      const reasons = [];

      // Example missing or empty
      if (!e.ex || !e.ex.trim()) reasons.push('example-empty');

      // Def very short (single char) when ex exists
      const def = String(e.def || '').trim();
      if (def.length <= 1 && e.ex) reasons.push('def-too-narrow');

      // Def refers to one POS but example uses a clearly different POS
      const ex = (e.ex || '').toLowerCase();
      if (def && ex) {
        if (/^n\./.test(def) && /\b(is|am|are|was|were|been)\s+\w+\b/.test(ex) && !/\b(the|a|an|my|this|that)\s+\w+\s+/.test(ex.split(/\s+/, 4).join(' '))) {
          // example reads like an adjective: "He is open" — but def claims it's a noun
        }
      }

      if (reasons.length) suspicious.push({ entry: e, reasons });
    }

    if (suspicious.length) {
      out.multiPackSuspicious.push({ lemma, packs, entries, suspicious });
    } else {
      out.multiPackDiffDef.push({ lemma, packs, entries });
    }
  }
  return out;
}

function main() {
  const packs = loadAll();
  const idx = indexByLemma(packs);
  const cls = classify(idx);

  const totalLemmas = Object.keys(idx).length;

  // Stats
  const stats = {
    totalLemmas,
    singlePack:            cls.singlePack.length,
    multiPackTotal:        totalLemmas - cls.singlePack.length,
    multiPackSameDef:      cls.multiPackSameDef.length,
    multiPackSubset:       cls.multiPackSubset.length,
    multiPackDiffDef:      cls.multiPackDiffDef.length,
    multiPackSuspicious:   cls.multiPackSuspicious.length,
  };

  // Most-shared lemmas (top frequency of appearance across packs)
  const topShared = Object.entries(idx)
    .filter(([_, arr]) => arr.length >= 2)
    .map(([lemma, arr]) => ({ lemma, packCount: arr.length, packs: arr.map(e => e.pack).sort() }))
    .sort((a, b) => b.packCount - a.packCount)
    .slice(0, 50);

  // Sample of multiPackSuspicious for human review
  const suspiciousSample = cls.multiPackSuspicious
    .slice(0, 30)
    .map(({ lemma, entries, suspicious }) => ({ lemma, entries, suspicious }));

  // Build a markdown summary
  const md = [];
  md.push('# P3-B Cross-Pack Polysemy Audit\n');
  md.push('Generated: ' + new Date().toISOString().slice(0, 10) + '\n');
  md.push('## Stats\n');
  md.push('| Metric | Count |');
  md.push('|---|---:|');
  md.push('| Total unique lemmas | ' + stats.totalLemmas + ' |');
  md.push('| Single-pack lemmas | ' + stats.singlePack + ' |');
  md.push('| Multi-pack lemmas | ' + stats.multiPackTotal + ' |');
  md.push('| Same def across packs | ' + stats.multiPackSameDef + ' |');
  md.push('| Subset def across packs | ' + stats.multiPackSubset + ' |');
  md.push('| Different def (likely contextual) | ' + stats.multiPackDiffDef + ' |');
  md.push('| **Suspicious (def-vs-ex / def-too-narrow)** | **' + stats.multiPackSuspicious + '** |');
  md.push('\n## Top 20 most-shared lemmas (appear in ≥2 packs)\n');
  md.push('| lemma | packCount | packs |');
  md.push('|---|---:|---|');
  topShared.slice(0, 20).forEach(o => {
    md.push('| ' + o.lemma + ' | ' + o.packCount + ' | ' + o.packs.join(', ') + ' |');
  });
  md.push('\n## Suspicious (top 30) — def too narrow OR ex-empty\n');
  suspiciousSample.forEach(({ lemma, entries, suspicious }) => {
    md.push('### ' + lemma + '\n');
    entries.forEach(e => {
      md.push('- [' + e.pack + '] def=' + JSON.stringify(e.def) + ' | defEn=' + (e.defEn || '').slice(0, 60) + ' | ex="' + (e.ex || '').slice(0, 50) + '"\n');
    });
    if (suspicious.length) {
      md.push('  → reasons: ' + suspicious.map(s => s.entry.pack + '(' + s.reasons.join(',') + ')').join('; ') + '\n');
    }
  });

  fs.writeFileSync(path.join(__dirname, '_p3b_polysemy_report.json'),
    JSON.stringify({ stats, topShared, fullClass: cls }, null, 2), 'utf8');
  fs.writeFileSync(path.join(__dirname, '_p3b_summary.md'),
    md.join(''), 'utf8');

  console.log('P3-B stats:', stats);
  console.log('Wrote: build/_p3b_polysemy_report.json, build/_p3b_summary.md');
}

main();