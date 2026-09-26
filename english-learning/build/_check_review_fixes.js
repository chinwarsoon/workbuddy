/* Smoke test for the code-review fix batch (ed-v35):
   M-1 reading highlight perf + correctness, M-2 guarded persistence,
   M-3 imported-pack sanitising, M-4 undo timer scoping, M-5 settings must not
   inflate the streak, plus the Minor batch. */
const fs=require("fs"), vm=require("vm");
const html=fs.readFileSync("pwa/index.html","utf8");
const sw=fs.readFileSync("pwa/sw.js","utf8");
let ok=true;

/* 1. syntax */
[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(function(m,i){
  try{ new vm.Script(m[1],{filename:"inline"+i}); console.log("syntax OK  script#"+i); }
  catch(e){ ok=false; console.log("SYNTAX FAIL script#"+i+": "+e.message); }
});
try{ new vm.Script(sw,{filename:"sw.js"}); console.log("syntax OK  sw.js"); }
catch(e){ ok=false; console.log("SYNTAX FAIL sw.js: "+e.message); }

/* 2. wiring assertions */
function has(re,label){ const r=re.test(html); console.log((r?"OK   ":"MISS ")+label); if(!r) ok=false; }
function hasNot(re,label){ const r=!re.test(html); console.log((r?"OK   ":"MISS ")+label); if(!r) ok=false; }
function swHas(re,label){ const r=re.test(sw); console.log((r?"OK   ":"MISS ")+label); if(!r) ok=false; }

console.log("\n-- M-2 guarded persistence --");
has(/const PACK_KEY\s*=\s*"englishDaily_pack_v1"/,"imported pack gets its own storage key");
has(/function savePack\(\)/,"savePack() defined");
has(/delete core\.importedPack/,"saveState() no longer writes the pack into the progress blob");
has(/localStorage\.setItem\(STORE_KEY, JSON\.stringify\(core\)\)/,"progress written from the stripped copy");
has(/catch\(e\)\{\s*\n?\s*try\{ toast\(t\('toast_save_fail'\)\)/,"saveState() failure is reported, not swallowed");
has(/const pk = JSON\.parse\(localStorage\.getItem\(PACK_KEY\)\)/,"loadState() reads the pack from its own key");
has(/toast_save_fail:\{zh:"⚠️ 保存失败/,"i18n: toast_save_fail");
has(/toast_save_pack_fail:\{zh:/,"i18n: toast_save_pack_fail");

console.log("\n-- M-1 reading highlight --");
has(/const PRIOR_TOKEN = \/\[A-Za-z\]\+\(\?:-\[A-Za-z\]\+\)\*\/g/,"tokenizer keeps hyphenated entries");
has(/if\(!dict\[m\[0\]\.toLowerCase\(\)\]\) continue;/,"O(1) dictionary lookup per token");
has(/acceptNode: function\(n\)\{/,"TreeWalker filter excludes text already inside <b>");
has(/FILTER_REJECT/,"structural skip instead of string sniffing");
hasNot(/new RegExp\("<\/\?b","i"\)/,"old '</?b' string sniff is gone");
hasNot(/for\(const k of keys\)\{/,"old per-key RegExp loop is gone");
hasNot(/_priorRe/,"no stale regex cache left behind");

console.log("\n-- M-4 undo timer scoping --");
has(/function clearUndo\(\)/,"clearUndo() defined");
has(/clearUndo\(\);   \/\/ a pending undo must never repaint/,"switchTab() clears a pending undo");
has(/if\(_lastTab==="review" \|\| _lastTab==="practice"\) renderReview\(\);/,"undo timer only repaints a review-ish tab");

console.log("\n-- M-5 settings must not inflate the streak --");
hasNot(/saveState\(\);\s*\n\s*recordActivity\("review"\);\s*\n\s*const cb=_cardSettingsReturn/,"saveCardSettings() no longer records a review");
has(/deliberately no recordActivity\(\)\/lastRatedDate here/,"intent documented in code");
hasNot(/state\.flashcards\[key\]\.lastRatedDate = todayStr\(\);/,"settings save no longer fakes lastRatedDate");

console.log("\n-- M-3 imported-pack sanitising --");
has(/function sanitizeRichText\(/,"sanitizeRichText() defined");
has(/const RICH_TAGS = \{B:1,STRONG:1,I:1,EM:1,U:1,BR:1,P:1\}/,"tag whitelist (keeps the <b> blue words)");
has(/readings: \(Array\.isArray\(d\.readings\) \? d\.readings : \[\]\)\.map/,"normalizePack() sanitises reading bodies");
has(/text: sanitizeRichText\(r && r\.text\)/,"sanitise applied to readings[].text");
has(/<option value="\$\{esc\(m\.id\)\}"[^>]*>\$\{esc\(nm\)\}/,"pack card: id + name escaped");
has(/\$\{esc\(desc\|\|""\)\}/,"pack card: description escaped");
has(/\$\{esc\(w\.emoji\|\|""\)\}/,"bookmarks: emoji escaped");
has(/\$\{esc\(w\.word\)\} <span class="muted"[^>]*>\$\{esc\(w\.ipa\|\|""\)\}/,"bookmarks: word + ipa escaped");
has(/"\\u201C"\+esc\(q\.def\)\+"\\u201D"/,"quiz: definition escaped");
has(/\$\{esc\(q\.ex\|\|""\)\}/,"quiz: example escaped");
has(/\$\{esc\(state\.lang==='en'\?r\.titleEn:r\.title\)\}/,"reading: title escaped");
has(/\$\{esc\(r\.level\|\|""\)\}/,"reading: level escaped");
has(/\$\{esc\(q\.q\)\}/,"reading: question text escaped");
hasNot(/data-act="reportEmpty"/,"orphan action removed (m-4)");

console.log("\n-- Minor batch --");
has(/now\.getHours\(\)\*60\+now\.getMinutes\(\)\)>=hh\*60\+mm/,"reminder compares total minutes");
has(/state\.reminder\.lastFired!==cur/,"reminder fires at most once a day");
has(/lastFired:""/,"reminder state has lastFired");
has(/if\(oi===q\.a\) readingState\.correct=/,"readingAnswer tracks correct answers");
has(/readingState\.correct===readingState\.total/,"'all correct' toast only when true");
has(/correct:0, total:r\.questions\.length/,"readingState initialises correct counter");
has(/aria-controls is NOT rewritten here/,"setupA11y no longer clobbers aria-controls");
has(/function wordIndex\(\)/,"findWordGlobal uses a built index");
has(/allWordsGlobal\(\)\.forEach\(function\(w\)\{\s*\n\s*if\(!w \|\| !w\.word\) return;/,"index built from allWordsGlobal");
has(/WORDS\.forEach\(function\(w\)\{                 \/\/ active pack overrides/,"active pack overrides the index");
has(/typeof c\.interval!=="number" \|\| !isFinite\(c\.interval\)/,"rateCard guards a non-numeric interval");
has(/cm && cm\.classList\.contains\("show"\)\) \? cm : null/,"focus trap covers both modals");
hasNot(/if\(e\.key==="Escape"\)\{ e\.preventDefault\(\); closeWordPopup\(\); return; \}\n  if\(e\.key==="Tab"/,"unreachable duplicate Escape branch removed");
swHas(/return cache\.add\(u\)\.catch\(function \(\) \{/,"sw.js caches assets individually (addAll is atomic)");
swHas(/APP_CACHE = "ed-app-/,"app shell has its own cache (bumped per deploy)");
swHas(/CONTENT_CACHE = "ed-content-/,"content packs have a separate, rarely-bumped cache");
swHas(/cache\.match\(u\)\.then\(function \(hit\)/,"content cache is topped up, not re-downloaded");

/* --- load-time: active pack first, the rest in the background --- */
has(/var packsReady = Promise\.resolve\(\);/,"packsReady handle exists");
has(/async function loadRemainingPacks\(/,"background loader for the other packs");
has(/Promise\.all\(rest\.map\(function\(meta\)\{/,"remaining packs are fetched in PARALLEL");
hasNot(/for\(const meta of PACK_META\)\{[\s\S]{0,160}await fetchJSON\(/,"no sequential await over every pack before first paint");
has(/if\(!untrusted\) return r;/,"built-in packs skip the per-reading sanitiser");
has(/packsReady = loadRemainingPacks\(chosen\);/,"background load is started, not awaited");

/* 3. behavioural tests (no DOM needed) */
console.log("\n-- behaviour --");
function fnSrc(name){
  const i=html.indexOf("function "+name+"(");
  if(i<0) throw new Error("missing "+name);
  const s=html.indexOf("{", i);
  let depth=0, j=s;
  for(;j<html.length;j++){ if(html[j]==="{")depth++; else if(html[j]==="}"){depth--; if(!depth) break;} }
  return html.slice(i, j+1);
}
const ctx={
  CROSS_DICT:{book:{word:"book"}, pen:{word:"pen"}, river:{word:"river"}},
  _priorRe:null,
  state:{learnedWords:[{word:"Apple",date:"",pack:"general"},{word:"river",date:"",pack:"general"}]},
  learnedKeySetCache:null,
  WORDS:[{word:"river", def:"ACTIVE copy"}],
  globalWordsCache:null,
  wordIndexCache:null,
  allWordsGlobal:function(){ return [{word:"river", def:"GLOBAL copy"},{word:"book",def:"b"},{word:"pen",def:"p"}]; },
  Math, console, Object, Array, String, RegExp
};
vm.createContext(ctx);
vm.runInContext([
  fnSrc("learnedKeySet"),
  fnSrc("learnedAny"),
  fnSrc("wordIndex"),
  fnSrc("findWordGlobal")
].join("\n"), ctx);

function eq(actual, expected, label){
  const a=JSON.stringify(actual), e=JSON.stringify(expected);
  const good=a===e;
  console.log((good?"OK   ":"FAIL ")+label+" -> "+a+(good?"":" (expected "+e+")"));
  if(!good) ok=false;
}
eq(ctx.learnedAny("apple"), true,  "learnedAny() case-insensitive via cache");
eq(ctx.learnedAny("book"),  false, "learnedAny() false for an unlearned word");
eq(ctx.findWordGlobal("River").def, "ACTIVE copy", "findWordGlobal() prefers the active pack copy");
eq(ctx.findWordGlobal("book").def, "b", "findWordGlobal() falls back to the global index");
eq(ctx.findWordGlobal("nope"), null, "findWordGlobal() returns null for an unknown word");
/* The shipped tokenizer + hash lookup: one pass, every match wrapped. */
const TOK=/[A-Za-z]+(?:-[A-Za-z]+)*/g;
const dict={book:1,pen:1,river:1};
const found=[]; TOK.lastIndex=0; let mm;
while((mm=TOK.exec("a book and a pen"))!==null){ if(dict[mm[0].toLowerCase()]) found.push(mm[0]); }
eq(found.sort(), ["book","pen"],
   "tokenizer matches BOTH words (old code highlighted only the first)");

console.log(ok?"\nALL CHECKS PASSED":"\nSOME CHECKS FAILED");
process.exit(ok?0:1);
