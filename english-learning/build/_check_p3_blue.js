/* Diagnostic: verify every blue word in p3_readings.js exists in the NAWL taught set (p3),
   and report current word counts + blue-list integrity BEFORE fixing. */
const fs = require("fs");
const path = require("path");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const p3 = require(path.join(DIR,"build","p3_words.js"));
const readings = require(path.join(DIR,"build","p3_readings.js"));

console.log("p3 taught entries:", Object.keys(p3).length);

readings.forEach((r,i)=>{
  const tag = "R"+(i+1)+" ("+r.titleEn+")";
  const inText = (r.text.match(/<b>([^<]+)<\/b>/g)||[]).map(m=>m.replace(/<\/?b>/g,"").trim().toLowerCase());
  const declared = r.blue.map(s=>s.toLowerCase());
  const mismatch = inText.filter(w=>!declared.includes(w)).concat(declared.filter(w=>!inText.includes(w)));
  const missingFromP3 = declared.filter(w=>!p3[w]);
  const plain = r.text.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean);
  console.log(tag+": words="+plain.length+" blue-in-text="+inText.length+" declared="+declared.length+
    (mismatch.length?" MISMATCH="+mismatch.join(","):"")+
    (missingFromP3.length?" NOT-IN-P3="+missingFromP3.join(","):""));
});
