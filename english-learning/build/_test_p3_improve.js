const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const pwa = fs.readFileSync(path.join(DIR,"pwa","index.html"),"utf8");

// minimal DOM
const dom = new JSDOM(pwa, { runScripts:"outside-only", pretendToBeVisual:true, url:"http://localhost/" });
const { window } = dom;
global.window = window; global.document = window.document;
// stubs
window.speechSynthesis = { speak(){}, cancel(){} };
// jsdom has no working relative fetch -> serve files from pwa/ on disk
window.fetch = async (u)=>{
  const p = path.join(DIR,"pwa", String(u).replace(/^\.?\//,""));
  const txt = fs.readFileSync(p,"utf8");
  return { ok:true, json: async ()=> JSON.parse(txt), text: async ()=> txt };
};

// extract script + run to grab functions.
const scriptText = pwa.match(/<script>([\s\S]*)<\/script>/)[1];
const code = scriptText + "\n;window.__api={loadContent,normalizePack,getCross:()=>CROSS_DICT,highlightPriorWords,resolveWord,readingBlueWords,getManifest:()=>PACK_META,getPacks:()=>PACKS};";
window.eval(code);

(async ()=>{
  const api = window.__api;
  try { await api.loadContent(); } catch(e){ console.log("loadContent threw:", e.message); }
  const packs = api.getPacks();
  console.log("PACK_META:", JSON.stringify(api.getManifest()));
  const meta = api.getManifest();
  console.log("packs loaded:", Object.keys(packs).join(", "));
  const p3 = packs["freq3k"];
  if(!p3){ console.log("FAIL: freq3k not loaded"); process.exit(1); }
  // top-200 richer examples check
  const take = fs.readFileSync(path.join(DIR,"build","nawl.txt"),"utf8").split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,800);
  const top = take.slice(0,200);
  let templ=0;
  top.forEach(w=>{ const e=p3.words.find(x=>x.word===w); if(e && /We use |plays a key role|studied the .* in detail/.test(e.ex||"")) templ++; });
  console.log("top200 template-ish examples:", templ, "(want 0)");
  // cross-dict populated (active is freq3k -> prior = p1+p2 words)
  const cross = api.getCross();
  const p1p2 = [];
  ["freq1k","freq2k"].forEach(id=>{ (packs[id].words||[]).forEach(w=>{ if(w.def) p1p2.push(w.word.toLowerCase()); }); });
  let inCross=0; p1p2.forEach(w=>{ if(cross[w]) inCross++; });
  console.log("prior (P1/P2) words in CROSS_DICT:", inCross, "/", p1p2.length);
  // highlight test: feed a reading text containing a P1 word 'home'
  const container = window.document.createElement("div");
  container.className="reading-text";
  container.textContent = "When we go home after school, the family shares a meal. This method works well.";
  api.highlightPriorWords(container);
  const prior = container.querySelectorAll("b.prior");
  console.log("prior <b> wrapped in sample text:", prior.length, "(want >=1 for 'home'/'family' if taught)");
  // resolveWord fallback
  const rw = api.resolveWord("home", p3.readings[0]);
  console.log("resolveWord('home') via cross:", rw ? (rw.word+" / "+rw.def) : "NULL");
  const ok = templ===0 && inCross>400 && prior.length>=1 && rw && rw.def;
  console.log(ok ? "\n✅ P3 IMPROVE TESTS PASSED" : "\n❌ SOME CHECKS FAILED");
  process.exit(ok?0:1);
})().catch(e=>{ console.error(e); process.exit(1); });
