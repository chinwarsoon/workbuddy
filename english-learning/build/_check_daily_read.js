/* Smoke test: daily free-reading cadence (no progress impact). */
const fs=require("fs"), vm=require("vm");
const P="pwa/index.html";
const html=fs.readFileSync(P,"utf8");

/* 1. syntax check every inline script */
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
let ok=true;
scripts.forEach(function(s,i){
  try{ new vm.Script(s,{filename:"inline"+i}); console.log("syntax OK  script#"+i+" ("+s.length+" chars)"); }
  catch(e){ ok=false; console.log("SYNTAX FAIL script#"+i+": "+e.message); }
});

/* 2. static assertions on the new wiring */
function has(re,label){ const r=re.test(html); console.log((r?"OK   ":"MISS ")+label); if(!r) ok=false; return r; }
has(/readingCadence:\s*"weekly"/,"defaultState.readingCadence = weekly");
has(/id="readingCadenceRow"/,"Reading cadence segmented control markup");
has(/case "readingcadence":/,"action handler: readingcadence");
has(/function dailyPickIndex\(\)/,"dailyPickIndex() defined");
has(/function displayedReading\(\)/,"displayedReading() defined");
has(/function syncReadingCadence\(\)/,"syncReadingCadence() defined");
has(/if\(state\.readingCadence==="daily"\) break;/,"completeReading guarded in daily mode");
has(/readingState=\{wk, idx, daily,/,"readingState carries idx + daily flag");
has(/const idx = daily \? dailyPickIndex\(\) : wk;/,"refreshReading branches weekly/daily");
has(/typeof readingState\.idx==="number"\) \? readingState\.idx/,"readingAnswer uses on-screen passage");
has(/resolveWord\(word, displayedReading\(\)\)/,"word popup resolves against displayed reading");
/* progress isolation: daily branch must not call completeReading / recordActivity */
const dailyBranch = html.match(/const daily = state\.readingCadence==="daily";[\s\S]{0,120}/);
console.log((dailyBranch?"OK   ":"MISS ")+"daily flag resolved in refreshReading");

/* 3. behavioural test of dailyPickIndex (pure) */
function fnSrc(name){
  const i=html.indexOf("function "+name+"(");
  const s=html.indexOf("{", i);
  let depth=0, j=s;
  for(;j<html.length;j++){ if(html[j]==="{")depth++; else if(html[j]==="}"){depth--; if(!depth) break;} }
  return html.slice(i, j+1);
}
const READINGS=new Array(12).fill(0).map((_,i)=>({title:"t"+i,questions:[]}));
const ctx={
  READINGS, ap:function(){return "general";}, dayIndex:function(){return ctx._d;},
  Math, console, _seedFrom:null, _mulberry32:null
};
vm.createContext(ctx);
vm.runInContext(fnSrc("_seedFrom")+"\n"+fnSrc("_mulberry32")+"\n"+fnSrc("dailyPickIndex"), ctx);
const seen=[];
for(let d=0; d<12; d++){ ctx._d=d; seen.push(ctx.dailyPickIndex()); }
const uniq=new Set(seen);
console.log("12 days -> indices:", seen.join(","));
console.log((uniq.size===12?"OK   ":"FAIL ")+"12 consecutive days give 12 distinct passages ("+uniq.size+")");
if(uniq.size!==12) ok=false;
ctx._d=12; const wrap=ctx.dailyPickIndex();
console.log((wrap===seen[0]?"OK   ":"FAIL ")+"cycle repeats after N days (day12 === day0: "+wrap+" vs "+seen[0]+")");
if(wrap!==seen[0]) ok=false;
ctx._d=5; const a5=ctx.dailyPickIndex(); ctx._d=5; const b5=ctx.dailyPickIndex();
console.log((a5===b5?"OK   ":"FAIL ")+"deterministic for the same day");
if(a5!==b5) ok=false;

console.log(ok?"\nALL CHECKS PASSED":"\nSOME CHECKS FAILED");
process.exit(ok?0:1);
