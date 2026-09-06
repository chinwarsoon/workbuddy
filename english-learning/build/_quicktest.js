const fs=require("fs");
const html=fs.readFileSync("pwa/index.html","utf8");
function extractFn(name){
  const re=new RegExp("function\\s+"+name+"\\s*\\([^)]*\\)\\s*\\{");
  const m=re.exec(html); if(!m) throw new Error("not found: "+name);
  let i=m.index+m[0].length-1; let depth=0;
  for(;i<html.length;i++){
    const c=html[i];
    if(c==="{") depth++; else if(c==="}"){ depth--; if(depth===0) break; }
  }
  return html.slice(m.index, i+1);
}
// strip "function NAME(...) {" prefix and trailing "}" so body is just the block
function extractBody(name){
  const re=new RegExp("function\\s+"+name+"\\s*\\([^)]*\\)\\s*\\{");
  const m=re.exec(html); if(!m) throw new Error("not found: "+name);
  let i=m.index+m[0].length-1; let depth=0;
  for(;i<html.length;i++){
    const c=html[i];
    if(c==="{") depth++; else if(c==="}"){ depth--; if(depth===0) break; }
  }
  // return just the block content
  return html.slice(m.index+m[0].length, i);
}
const todayStr=function(){return "2026-09-05";};
const state={flashcards:{abandon:{history:undefined}}};
const logHistoryBody = extractBody("logHistory");
console.log("--- body ---");
console.log(logHistoryBody);
const logHistory = new Function("key","q","mode","state","todayStr", logHistoryBody);
console.log("--- call ---");
logHistory("abandon", 3, "flash", state, todayStr);
console.log("history:", state.flashcards.abandon.history);
logHistory("abandon", 0, "flash", state, todayStr);
console.log("history:", JSON.stringify(state.flashcards.abandon.history));