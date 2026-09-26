/* Smoke test: flash card is the DEFAULT review method. */
const fs=require("fs"), vm=require("vm");
const html=fs.readFileSync("pwa/index.html","utf8");
let ok=true;

const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
scripts.forEach(function(s,i){
  try{ new vm.Script(s,{filename:"inline"+i}); console.log("syntax OK  script#"+i); }
  catch(e){ ok=false; console.log("SYNTAX FAIL script#"+i+": "+e.message); }
});

function has(re,label){ const r=re.test(html); console.log((r?"OK   ":"MISS ")+label); if(!r) ok=false; }
has(/const DEFAULT_REVIEW_TYPE = "flash_only";/,"DEFAULT_REVIEW_TYPE = flash_only");
has(/c\.reviewType = DEFAULT_REVIEW_TYPE;/,"migrateState backfills the default (not auto)");
has(/let rt = \(card && card\.reviewType\) \|\| DEFAULT_REVIEW_TYPE;/,"stepsFor falls back to the default");
has(/if\(rt==="auto"\) rt = getReviewType\(word, card\);/,"explicit auto keeps the adaptive behaviour");
has(/const currentRT = card\.reviewType \|\| DEFAULT_REVIEW_TYPE;/,"card settings sheet pre-selects the default");
has(/c\.reviewType=nowSkip\?"skip":DEFAULT_REVIEW_TYPE;/,"un-skipping restores the default");
has(/function getInitialReviewType\(word\)\{\s*\n\s*return DEFAULT_REVIEW_TYPE;/,"new cards get the default");

/* behavioural */
function fnSrc(name){
  const i=html.indexOf("function "+name+"(");
  if(i<0) throw new Error("missing "+name);
  const s=html.indexOf("{", i);
  let depth=0, j=s;
  for(;j<html.length;j++){ if(html[j]==="{")depth++; else if(html[j]==="}"){depth--; if(!depth) break;} }
  return html.slice(i, j+1);
}
const ctx={
  DEFAULT_REVIEW_TYPE:"flash_only",
  findWordGlobal:function(w){ return {word:w, pos:"n."}; },
  Math, console
};
vm.createContext(ctx);
vm.runInContext([fnSrc("getInitialReviewType"),fnSrc("getReviewType"),fnSrc("stepsFor")].join("\n"), ctx);

function eq(a,e,label){
  const A=JSON.stringify(a), E=JSON.stringify(e), good=A===E;
  console.log((good?"OK   ":"FAIL ")+label+" -> "+A+(good?"":" (expected "+E+")"));
  if(!good) ok=false;
}
eq(ctx.stepsFor("apple", undefined, "flash"), [{kind:"flash"}], "no card record -> flash card");
eq(ctx.stepsFor("apple", {}, "flash"), [{kind:"flash"}], "card without reviewType -> flash card");
eq(ctx.stepsFor("apple", {reviewType:"flash_only"}, "flash"), [{kind:"flash"}], "explicit flash_only -> flash card");
eq(ctx.stepsFor("apple", {reviewType:"context_only"}, "flash"), [{kind:"context"}], "explicit context_only still honoured");
eq(ctx.stepsFor("apple", {reviewType:"skip"}, "flash"), [{kind:"flash"}], "skipped card -> single flash step");
eq(ctx.stepsFor("apple", {reviewType:"auto", reps:0}, "flash"), [{kind:"productive"},{kind:"context"}], "explicit auto -> adaptive (new card = productive+context)");
eq(ctx.getInitialReviewType("apple"), "flash_only", "getInitialReviewType returns flash_only");

console.log(ok?"\nALL CHECKS PASSED":"\nSOME CHECKS FAILED");
process.exit(ok?0:1);
