/* Smoke test: "⏭️ skip" now actually removes a word from every drill surface. */
const fs=require("fs"), vm=require("vm");
const html=fs.readFileSync("pwa/index.html","utf8");
let ok=true;

/* 1. syntax */
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
scripts.forEach(function(s,i){
  try{ new vm.Script(s,{filename:"inline"+i}); console.log("syntax OK  script#"+i); }
  catch(e){ ok=false; console.log("SYNTAX FAIL script#"+i+": "+e.message); }
});

/* 2. wiring assertions */
function has(re,label){ const r=re.test(html); console.log((r?"OK   ":"MISS ")+label); if(!r) ok=false; }
has(/function isSkipped\(/,"isSkipped() defined");
has(/function skippedList\(/,"skippedList() defined");
has(/function notSkipped\(/,"notSkipped() predicate defined");
has(/due <= t && !state\.flashcards\[k\]\.skipped/,"dueCards() excludes skipped");
has(/due <= t && !state\.flashcards\[k\]\.skipped/,"dueCardsGlobal() excludes skipped");
has(/shuffle\(pool\.filter\(notSkipped\)/,"buildQueue freePractice excludes skipped");
has(/pool\.filter\(notSkipped\)\.map/,"buildQueue allflash excludes skipped");
has(/allWordsGlobal\(\)\.filter\(notSkipped\)/,"quiz (all packs) excludes skipped");
has(/const wordPool=WORDS\.filter\(notSkipped\)/,"quiz (this pack) excludes skipped");
has(/case "unskip":/,"restore action handled");
has(/id="skippedCard"/,"Me page skipped card markup");
has(/me_skipped:\{zh:"已跳过的词"/,"i18n: me_skipped");
has(/toast_unskip:\{zh:"已恢复复习"/,"i18n: toast_unskip");
/* stats must keep counting skipped words (no filter there) */
has(/function flashActive\(\)\{ const s=packWordSet\(\); return Object\.keys\(state\.flashcards\)\.filter\(function\(k\)\{ return s\[k\]; \}\)\.length; \}/,"flashActive() still counts skipped words");

has(/function skipToggleHTML\(/,"skipToggleHTML() defined");
has(/case "toggleSkip":/,"one-tap skip toggle handled");
(function(){
  const n=(html.match(/skipToggleHTML\(/g)||[]).length - 1; // minus the definition
  const good=n>=6;
  console.log((good?"OK   ":"MISS ")+"skip button present on all card surfaces ("+n+" render sites)");
  if(!good) ok=false;
})();
has(/skip_word:\{zh:"跳过这个词"/,"i18n: skip_word");
has(/toast_skip:\{zh:"已跳过，可在「我的」页恢复"/,"i18n: toast_skip");
has(/currentQueue=currentQueue\.filter\(function\(x\)\{ return wkey\(x\)!==k; \}\)/,"skipping drops the word from the running session");

/* 3. behavioural test of the queue filters */
function fnSrc(name){
  const i=html.indexOf("function "+name+"(");
  if(i<0) throw new Error("missing "+name);
  const s=html.indexOf("{", i);
  let depth=0, j=s;
  for(;j<html.length;j++){ if(html[j]==="{")depth++; else if(html[j]==="}"){depth--; if(!depth) break;} }
  return html.slice(i, j+1);
}
const ctx={
  state:{flashcards:{
    "apple":{due:"2000-01-01"},
    "banana":{due:"2000-01-01", skipped:true},
    "cherry":{due:"2099-01-01"}
  }},
  wkey:function(w){ return String(w).toLowerCase(); },
  todayStr:function(){ return "2026-09-26"; },
  packWordSet:function(){ return {apple:"apple", banana:"banana", cherry:"cherry"}; },
  Math, console
};
vm.createContext(ctx);
vm.runInContext([fnSrc("isSkipped"),fnSrc("notSkipped"),fnSrc("dueCards"),fnSrc("dueCardsGlobal")].join("\n"), ctx);

function eq(actual, expected, label){
  const a=JSON.stringify(actual), e=JSON.stringify(expected);
  const good=a===e;
  console.log((good?"OK   ":"FAIL ")+label+" -> "+a+(good?"":" (expected "+e+")"));
  if(!good) ok=false;
}
eq(ctx.dueCards().sort(), ["apple"], "due queue drops the skipped word");
eq(ctx.dueCardsGlobal().sort(), ["apple"], "all-pack due queue drops the skipped word");
eq(ctx.isSkipped("Banana"), true, "isSkipped() is case-insensitive");
eq(ctx.isSkipped("apple"), false, "isSkipped() false for a normal word");
eq(["apple","banana","cherry"].map(function(w){ return ctx.notSkipped({word:w}); }), [true,false,true], "notSkipped() predicate on a pool");

console.log(ok?"\nALL CHECKS PASSED":"\nSOME CHECKS FAILED");
process.exit(ok?0:1);
