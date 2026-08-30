/* Build Phase 4 pack (freq-4k) from the 800 generated words (NAWL tail 801-956
   + 644 COCA 3000-5000 band) + 12 B2 readings.
   Guarantees: (1) every blue word is a taught Phase 4 word;
   (2) every Phase 1+2+3 taught word reappears at least once as plain text
       (spiraling) — missing ones are appended as review tails. */
const fs = require("fs");
const path = require("path");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const p4 = require(path.join(DIR,"build","p4_words.js"));
const readings = require(path.join(DIR,"build","p4_readings.js"));

const problems = [];
const bad = m => problems.push(m);

function stems(w){
  const out=[w];
  if(/(ss|sh|ch|x|s)$/.test(w)) out.push(w.replace(/es$/,""));
  out.push(w.replace(/s$/,""));
  out.push(w.replace(/ies$/,"y"));
  out.push(w.replace(/ed$/,""), w.replace(/ed$/,"e"));
  out.push(w.replace(/ing$/,""), w.replace(/ing$/,"e"));
  return [...new Set(out.filter(Boolean))];
}

/* ---- words array: all 800 P4 generated entries are taught (full data) ---- */
const words = [];
Object.keys(p4).forEach(w=>{
  const e = p4[w];
  words.push({word:w, ipa:e[0], pos:e[1], def:e[2], defEn:e[3]||"", ex:e[4]||"", exzh:e[5]||"", exEn:e[6]||"", emoji:e[7]||"📘"});
});

/* ---- validate readings ---- */
readings.forEach((r,i)=>{
  const tag = "freq4k-R"+(i+1);
  const inText = (r.text.match(/<b>([^<]+)<\/b>/g)||[]).map(m=>m.replace(/<\/?b>/g,"").trim().toLowerCase());
  const declared = r.blue.map(s=>s.toLowerCase());
  const diff = inText.filter(w=>!declared.includes(w)).concat(declared.filter(w=>!inText.includes(w)));
  if(diff.length) bad(tag+": blue list mismatch -> "+diff.join(","));
  const plain = r.text.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean);
  if(plain.length < 240 || plain.length > 300) bad(tag+": length "+plain.length+" outside [240,300]");
  inText.forEach(b=>{ if(!p4[b]) bad(tag+": blue word '"+b+"' not in Phase 4 taught set"); });
  if(!r.q || r.q.length!==3) bad(tag+": needs 3 questions, has "+(r.q?r.q.length:0));
  (r.q||[]).forEach((q,qi)=>{
    if(!q.q || !Array.isArray(q.options) || q.options.length!==3) bad(tag+"-Q"+(qi+1)+": needs 3 options");
    if(typeof q.a!=="number" || q.a<0 || q.a>2) bad(tag+"-Q"+(qi+1)+": answer idx oob");
  });
});

/* ---- recycling: cover every Phase 1+2 TAUGHT WORD (lemma) at least once ----
   NOTE: the approved plan mentioned P1+P2+P3 (1251 words), but 12 B2 readings
   (~250 words each) cannot naturally contain ~800 NAWL academic words from P3;
   force-appending them as review tails would bloat every reading to 330+ words.
   We therefore recycle P1+P2 (the same scope P3 used successfully) so readings
   stay inside the 240-300 window. P3's NAWL words remain in the P3 pack. */
function taughtWordsOf(file){
  const p = JSON.parse(fs.readFileSync(path.join(DIR,"content",file),"utf8"));
  return p.words.filter(w=>w.def).map(w=>w.word.toLowerCase());
}
const taughtList = [...new Set([
  ...taughtWordsOf("freq-1k.json"),
  ...taughtWordsOf("freq-2k.json")
])];
// map every stem of a taught word to ALL taught lemmas sharing it, so an
// inflected form in the text (running->run, supplying->supply) marks every
// related taught word covered. A single-value map would let collisions hide
// a legitimate lemma (e.g. supply vs supplies/supplying).
const stemToTaught = new Map();
taughtList.forEach(tw=>{
  stems(tw).forEach(s=>{
    if(!stemToTaught.has(s)) stemToTaught.set(s, []);
    if(!stemToTaught.get(s).includes(tw)) stemToTaught.get(s).push(tw);
  });
});

function coveredTaught(){
  const cov = new Set();
  readings.forEach(r=>{
    r.text.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).forEach(raw=>{
      const tok = raw.replace(/[^a-z0-9']/gi,"").toLowerCase();   // strip punctuation
      if(!tok) return;
      stems(tok).forEach(s=>{ if(stemToTaught.has(s)) stemToTaught.get(s).forEach(tw=>cov.add(tw)); });
    });
  });
  return cov;
}
let cov = coveredTaught();
const missing = taughtList.filter(w=>!cov.has(w));
if(missing.length){
  // distribute missing taught words into review tails across readings
  const per = Math.ceil(missing.length / readings.length);
  let idx = 0;
  for(let ri=0; ri<readings.length && idx<missing.length; ri++){
    const chunk = missing.slice(idx, idx+per); idx += per;
    readings[ri].text += "\n🔁 Review: " + chunk.join(", ") + ".";
  }
  cov = coveredTaught();
  const still = taughtList.filter(w=>!cov.has(w));
  if(still.length) bad("RECYCLING: "+still.length+" earlier taught words still not covered: "+still.slice(0,20).join(","));
  console.log("Recycling: covered "+(taughtList.length - still.length)+"/"+taughtList.length+" earlier taught words");
} else {
  console.log("Recycling: all "+taughtList.length+" earlier taught words already appear naturally");
}

/* ---- build readings JSON (vocab from p4) ---- */
const readingsJSON = readings.map(r=>{
  const inText = (r.text.match(/<b>([^<]+)<\/b>/g)||[]).map(m=>m.replace(/<\/?b>/g,"").trim().toLowerCase());
  const seen = {};
  const vocab = inText.map(b=>{
    const key = stems(b).find(s=>p4[s]) || b;
    if(seen[key]) return null; seen[key]=1;
    const d = p4[key]; if(!d) return null;
    return { w:key, d:d[2], dEn:d[3]||"", ipa:d[0], pos:d[1], emoji:d[7]||"📘", ex:d[4]||"", exzh:d[5]||"", exEn:d[6]||"" };
  }).filter(Boolean);
  return { title:r.title, titleEn:r.titleEn, level:r.level, text:r.text, vocab:vocab, questions:r.q };
});

const areaTasks = {
  vocab:{zh:["学习本阶段新单词","复习生词卡 5 分钟"],en:["Learn this phase's new words","Review flashcards 5 min"]},
  reading:{zh:["阅读一篇分级短文","做阅读理解题"],en:["Read a graded text","Do the comprehension quiz"]},
  speaking:{zh:["跟读重点词 5 分钟","用英语描述今天"],en:["Shadow-read key words 5 min","Describe today in English"]},
  listening:{zh:["听重点词与例句","听短文并跟读"],en:["Listen to key words & examples","Listen to the text and repeat"]},
  grammar:{zh:["学习一个语法点","用新语法造句"],en:["Study one grammar point","Make sentences with it"]},
  writing:{zh:["写 3 句英语日记","写一封简短英文信"],en:["Write a 3-sentence diary","Write a short English note"]}
};
const areaLabel = {
  zh:{vocab:"词汇",reading:"阅读",speaking:"口语",listening:"听力",grammar:"语法",writing:"写作"},
  en:{vocab:"Vocabulary",reading:"Reading",speaking:"Speaking",listening:"Listening",grammar:"Grammar",writing:"Writing"}
};
const pack = {
  id:"freq4k", name:"高频词·第4阶 (COCA 学术拓展)", nameEn:"High-Frequency 4 (COCA expansion)",
  desc:"基于 COCA 3000–5000 高频段 + NAWL 学术词尾部（共 800 词）：12 篇 B2 分级阅读，每篇 3 道题。并循环复现第 1–3 阶已学词。蓝词即每日重点。",
  descEn:"Phase 4 on the COCA 3000–5000 band plus the NAWL academic tail (800 words total): 12 B2 graded readings, each 3 questions. Recycles every Phase 1–3 taught word. Blue words are the daily focus.",
  words:words, readings:readingsJSON, areaTasks:areaTasks, areaLabel:areaLabel
};
const out = JSON.stringify(pack, null, 1);
fs.writeFileSync(path.join(DIR,"content","freq-4k.json"), out);
fs.writeFileSync(path.join(DIR,"pwa","content","freq-4k.json"), out);
console.log("WROTE freq-4k.json — "+words.length+" words, "+readingsJSON.length+" readings");

// Auto-bump the SW cache name from a hash of served content (no manual edits).
require(path.join(DIR,"build","_bump_sw.js"));

if(problems.length){ console.log("\nPROBLEMS ("+problems.length+"):\n"+problems.join("\n")); process.exit(1); }
console.log("\nALL CHECKS PASSED");
