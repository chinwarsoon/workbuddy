/* Fix the single uppercase headword "FALSE" -> "false" in freq-2k.json.
   Safe because the app keys everything by lowercase (wkey / packWordSet /
   allWordsGlobal all call .toLowerCase()), so no progress migration needed.
   Edits both content/ and pwa/content/ mirrors, then validates JSON. */
const fs = require("fs");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const targets = ["content/freq-2k.json", "pwa/content/freq-2k.json"];

let changed = 0;
for (const rel of targets) {
  const p = DIR + "/" + rel;
  const raw = fs.readFileSync(p, "utf8");
  if (!raw.includes('"word":"FALSE"')) {
    console.log("SKIP (no FALSE headword): " + rel);
    continue;
  }
  const next = raw.replace(/"word":"FALSE"/g, '"word":"false"');
  // validate
  const obj = JSON.parse(next);
  const stillUpper = obj.words.filter(w => w.word !== w.word.toLowerCase()).length;
  console.log(rel + " -> words:" + obj.words.length + " | remaining non-lowercase headwords:" + stillUpper);
  fs.writeFileSync(p, next, "utf8");
  changed++;
}
console.log("files changed:", changed);

// sync check between the two mirrors
const a = fs.readFileSync(DIR + "/content/freq-2k.json", "utf8");
const b = fs.readFileSync(DIR + "/pwa/content/freq-2k.json", "utf8");
console.log("mirrors identical:", a === b);
const entry = JSON.parse(a).words.find(w => w.word === "false" && w.ipa === "/fɒ:ls/");
console.log("fixed entry:", JSON.stringify(entry));
