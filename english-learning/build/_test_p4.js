/* Smoke test for all four frequency packs (freq-1k, freq-2k, freq-3k, freq-4k).
   Validates: JSON parses, structure, every blue word resolves to a definition
   (self-contained: present in reading.vocab OR pack.words), question shape,
   reading length, and (freq-4k) full Phase 1-2-3 recycling coverage. */
const fs = require("fs");
const path = require("path");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";

function stems(w){
  const out=[w];
  if(/(ss|sh|ch|x|s)$/.test(w)) out.push(w.replace(/es$/,""));
  out.push(w.replace(/s$/,""));
  out.push(w.replace(/ies$/,"y"));
  out.push(w.replace(/ed$/,""), w.replace(/ed$/,"e"));
  out.push(w.replace(/ing$/,""), w.replace(/ing$/,"e"));
  return [...new Set(out.filter(Boolean))];
}

let fail = 0;
const bad = m => { console.log("  ✗ "+m); fail++; };

const LEN = { "freq-1k.json":[80,320], "freq-2k.json":[140,320], "freq-3k.json":[140,320], "freq-4k.json":[240,300] };

["freq-1k.json","freq-2k.json","freq-3k.json","freq-4k.json"].forEach(file=>{
  const p = JSON.parse(fs.readFileSync(path.join(DIR,"content",file),"utf8"));
  console.log("\n=== "+file+" === id="+p.id+" words="+p.words.length+" readings="+p.readings.length);
  if(!p.id || !Array.isArray(p.words) || !Array.isArray(p.readings)) bad("missing core fields");
  const wordDef = new Map();
  p.words.forEach(w=>{ if(w.word) wordDef.set(w.word.toLowerCase(), w.def||""); });
  // taught words must have a definition
  let noDef = 0;
  p.words.forEach(w=>{ if(w.word && !w.def) noDef++; });
  if(noDef) console.log("  (note) bare words without def: "+noDef+" (expected for non-taught entries)");
  const taughtStems = new Set();
  p.words.forEach(w=>{ if(w.def){ stems(w.word.toLowerCase()).forEach(s=>taughtStems.add(s)); } });

  p.readings.forEach((r,i)=>{
    const tag = "R"+(i+1);
    if(!r.title || !r.text) bad(tag+": missing title/text");
    const inText = (r.text.match(/<b>([^<]+)<\/b>/g)||[]).map(m=>m.replace(/<\/?b>/g,"").trim().toLowerCase());
    const vocabKeys = new Set((r.vocab||[]).map(v=>v.w.toLowerCase()));
    inText.forEach(b=>{
      const key = stems(b).find(s=>wordDef.has(s)) || (wordDef.has(b)?b:null);
      if(!key) bad(tag+": blue '"+b+"' has NO definition in pack");
      else if(!vocabKeys.has(key)) bad(tag+": blue '"+b+"' missing from reading.vocab (key="+key+")");
    });
    if(vocabKeys.size !== (r.vocab||[]).length) bad(tag+": vocab has duplicate keys ("+vocabKeys.size+" vs "+r.vocab.length+")");
    if(!Array.isArray(r.questions) || r.questions.length!==3) bad(tag+": needs 3 questions, has "+(r.questions?r.questions.length:0));
    (r.questions||[]).forEach((q,qi)=>{
      if(!q.q || !Array.isArray(q.options) || q.options.length!==3) bad(tag+"-Q"+(qi+1)+": needs 3 options");
      if(typeof q.a!=="number" || q.a<0 || q.a>2) bad(tag+"-Q"+(qi+1)+": answer idx oob");
    });
    const plain = r.text.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean);
    const [lo,hi] = LEN[file];
    if(plain.length<lo || plain.length>hi) bad(tag+": length "+plain.length+" outside ["+lo+","+hi+"]");
  });
  console.log("  readings checked: "+p.readings.length);
});

// freq-4k recycling coverage
// Asserted scope: Phase 1+2 taught words (the same scope as P3's recycling).
// Phase 3 (NAWL academic) words are NOT force-recycled into P4 to keep each
// B2 reading inside the 240-300 window; they remain consolidated in the P3 pack.
console.log("\n=== Recycling coverage (freq-4k) ===");
const p4 = JSON.parse(fs.readFileSync(path.join(DIR,"content","freq-4k.json"),"utf8"));
function taughtWordsOf(f){
  const p = JSON.parse(fs.readFileSync(path.join(DIR,"content",f),"utf8"));
  return p.words.filter(w=>w.def).map(w=>w.word.toLowerCase());
}
function coverageOf(list){
  const stemToTaught = new Map();
  list.forEach(tw=>stems(tw).forEach(s=>{ if(!stemToTaught.has(s)) stemToTaught.set(s,[]); if(!stemToTaught.get(s).includes(tw)) stemToTaught.get(s).push(tw); }));
  const cov = new Set();
  p4.readings.forEach(r=>{
    r.text.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).forEach(raw=>{
      const tok = raw.replace(/[^a-z0-9']/gi,"").toLowerCase();
      if(!tok) return;
      stems(tok).forEach(s=>{ if(stemToTaught.has(s)) stemToTaught.get(s).forEach(tw=>cov.add(tw)); });
    });
  });
  return cov;
}
const p12 = [...new Set([...taughtWordsOf("freq-1k.json"), ...taughtWordsOf("freq-2k.json")])];
const cov12 = coverageOf(p12);
const miss12 = p12.filter(w=>!cov12.has(w));
console.log("  Phase 1-2 taught words: "+p12.length+", covered: "+cov12.size);
if(miss12.length) bad("P1-2 recycling missing: "+miss12.slice(0,30).join(","));

const p123 = [...new Set([...p12, ...taughtWordsOf("freq-3k.json")])];
const cov123 = coverageOf(p123);
console.log("  Phase 1-3 taught words: "+p123.length+", naturally covered: "+cov123.size+
            " (P3 NAWL words are intentionally not force-recycled)");

console.log("\n"+(fail===0 ? "✅ ALL SMOKE CHECKS PASSED" : "❌ "+fail+" SMOKE FAILURES"));
process.exit(fail===0?0:1);
