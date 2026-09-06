const fs=require("fs");
const html=fs.readFileSync("pwa/index.html","utf8");
const opens=(html.match(/\{/g)||[]).length;
const closes=(html.match(/\}/g)||[]).length;
console.log("braces open/close:", opens, closes, "(diff", opens-closes, ")");
const checks={
  "logHistory def": /function logHistory\(/,
  "toggleHist def": /function toggleHist\(/,
  "rateFlash logHistory": /rateCard\(word, parseInt\(q\)\);\s*logHistory\(key/,
  "gradeUndo logHistory": /rateCard\(w\.word, q\);\s*logHistory\(key, q, "typed"\)/,
  "revealAnswer logHistory": /rateCard\(w\.word,0\);\s*logHistory\(wkey/,
  "learnWord history": /proficiency:"learned", history:\[\]/,
  "capture history": /proficiency:"learned", history:\[\]\}; changed=true/,
  "CSS wd-hist": /\.wd-hist\{margin-top:14px/,
  "CSS wd-hist-row ok": /\.wd-hist-row \.r\.ok\{color:var\(--st-scheduled\)/,
  "i18n wd_hist_last": /wd_hist_last:\{zh:"上次：",en:"Last: "\}/,
  "wordDetailHTML hist render": /if\(w\.word && isLearned\(w\.word\)\)/,
  "wd_hist_expand": /wd_hist_expand:\{zh:"展开 ▾",en:"Show ▾"\}/,
  "wd_hist_forgot": /wd_hist_forgot:\{zh:"忘了"/,
};
let allOk=true;
for(const k in checks){
  const ok=checks[k].test(html);
  console.log((ok?"OK  ":"MISS"),"-",k);
  if(!ok) allOk=false;
}
console.log("\nALL_OK:", allOk);