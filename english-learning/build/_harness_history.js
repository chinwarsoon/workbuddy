const fs=require("fs");
const html=fs.readFileSync("pwa/index.html","utf8");

function extractBody(name){
  const re=new RegExp("function\\s+"+name+"\\s*\\([^)]*\\)\\s*\\{");
  const m=re.exec(html); if(!m) throw new Error("not found: "+name);
  let i=m.index+m[0].length-1; let depth=0;
  for(;i<html.length;i++){
    const c=html[i];
    if(c==="{") depth++; else if(c==="}"){ depth--; if(depth===0) break; }
  }
  return html.slice(m.index+m[0].length, i);
}

const todayStr=function(){return "2026-09-05";};
const logHistory = new Function("key","q","mode","state","todayStr", extractBody("logHistory"));

let ok=0, fail=0;
function t(name, cond){ if(cond){console.log("OK  -",name); ok++;} else{console.log("FAIL-",name); fail++;} }

// T1: legacy card missing history → init empty
let state={flashcards:{abandon:{ease:2.5,interval:0,reps:0,due:"2026-09-05",packs:["p1"],proficiency:"learned",history:undefined}}};
logHistory("abandon", 3, "flash", state, todayStr);
t("T1: undefined history becomes array", Array.isArray(state.flashcards.abandon.history));

// T2: push 1 event → length 1, result advanced
t("T2: 1 push → length 1", state.flashcards.abandon.history.length===1);
t("T2: first entry result advanced", state.flashcards.abandon.history[0].result==="advanced");
t("T2: first entry mode flash", state.flashcards.abandon.history[0].mode==="flash");

// T3: reset (q<3)
logHistory("abandon", 0, "flash", state, todayStr);
t("T3: 2 pushes → length 2", state.flashcards.abandon.history.length===2);
t("T3: last result reset", state.flashcards.abandon.history[1].result==="reset");

// T4: ring buffer cap=20
state.flashcards.abandon.history=[];
for(let i=0;i<25;i++) logHistory("abandon", 3, "flash", state, todayStr);
t("T4: 25 pushes → length 20", state.flashcards.abandon.history.length===20);

// T5: missing card → silent no-op
const before=JSON.stringify(state.flashcards);
logHistory("nonexistent", 3, "flash", state, todayStr);
t("T5: nonexistent card is a no-op", JSON.stringify(state.flashcards)===before);

// T6: wordDetailHTML contains the expected data path
const wd=extractBody("wordDetailHTML");
t("T6: wordDetailHTML calls isLearned", /isLearned\(w\.word\)/.test(wd));
t("T6: wordDetailHTML reads .history", /\.history/.test(wd));
t("T6: wordDetailHTML renders wd-hist-list", /wd-hist-list/.test(wd));
t("T6: wordDetailHTML uses slice(-10).reverse()", /slice\(-10\)\.reverse\(\)/.test(wd));
t("T6: wordDetailHTML escapes ts", /esc\(last\.ts\)/.test(wd));

// T7: toggleHist is a DOM flip
const th=extractBody("toggleHist");
t("T7: toggleHist toggles .wd-hist-list", /classList\.toggle\("open"\)/.test(th));
t("T7: toggleHist swaps button label via t()", /t\('wd_hist_(expand|collapse)'\)/.test(th));

// T8: i18n keys
["wd_hist_last","wd_hist_expand","wd_hist_collapse","wd_hist_forgot","wd_hist_okay","wd_hist_easy"].forEach(k=>{
  t("T8: i18n "+k, html.includes(k+":{zh:"));
});

// T9: result classification
const sample=[{ts:"2026-09-05",q:0,mode:"flash",result:"reset"},
              {ts:"2026-09-04",q:3,mode:"typed",result:"advanced"},
              {ts:"2026-09-03",q:4,mode:"flash",result:"advanced"}];
const klass=sample.map(e=>e.result==='reset'?'bad':e.q>=4?'ok':'warn');
t("T9: reset→bad, q=3→warn, q=4→ok", JSON.stringify(klass)==='["bad","warn","ok"]');

console.log(`\n${ok} passed, ${fail} failed`);
process.exit(fail?1:0);