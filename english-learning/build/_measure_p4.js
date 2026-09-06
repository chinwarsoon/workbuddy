const fs = require("fs");
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
function taught(file){
  const p = JSON.parse(fs.readFileSync(DIR+"/content/"+file,"utf8"));
  return p.words.filter(w=>w.def).map(w=>w.word.toLowerCase());
}
const p1 = taught("freq-1k.json");
const p2 = taught("freq-2k.json");
const taughtList = [...new Set([...p1, ...p2])];
const p4 = JSON.parse(fs.readFileSync(DIR+"/content/freq-4k.json","utf8"));
const readings = p4.readings;
const hasTail = readings.some(r => /🔁 Review:/.test(r.text));
const stemToTaught = new Map();
taughtList.forEach(tw=>{
  stems(tw).forEach(s=>{
    if(!stemToTaught.has(s)) stemToTaught.set(s, []);
    if(!stemToTaught.get(s).includes(tw)) stemToTaught.get(s).push(tw);
  });
});
let cov = new Set();
readings.forEach(r=>{
  r.text.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).forEach(raw=>{
    const tok = raw.replace(/[^a-z0-9']/gi,"").toLowerCase();
    if(!tok) return;
    stems(tok).forEach(s=>{ if(stemToTaught.has(s)) stemToTaught.get(s).forEach(tw=>cov.add(tw)); });
  });
});
console.log("P1 taught:", p1.length, "| P2 taught:", p2.length, "| union:", taughtList.length);
console.log("P4 readings:", readings.length, "| has 🔁 Review tail:", hasTail);
console.log("NATURAL coverage of P1+P2 taught: " + cov.size + "/" + taughtList.length + " = " + (100*cov.size/taughtList.length).toFixed(1) + "%");
