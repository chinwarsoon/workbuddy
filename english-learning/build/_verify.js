/* Final quality check: every blue word must resolve to a full entry (def present),
   reading lengths, question shape, and no duplicate word keys. */
const fs = require("fs");
const path = require("path");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const LIST = fs.readFileSync(path.join(DIR, "_g10k.txt"), "utf8")
  .split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean);
const rankOf = w => { const i = LIST.indexOf(String(w).toLowerCase()); return i < 0 ? null : i + 1; };
function stems(w){
  const out=[w];
  if(/(ss|sh|ch|x|s)$/.test(w)) out.push(w.replace(/es$/,""));
  out.push(w.replace(/s$/,""), w.replace(/ies$/,"y"), w.replace(/ed$/,""), w.replace(/ing$/,""));
  return [...new Set(out.filter(Boolean))];
}
let fails = 0;
["freq-1k.json","freq-2k.json"].forEach(function (f) {
  const p = JSON.parse(fs.readFileSync(path.join(DIR, "content", f), "utf8"));
  const byWord = {};
  p.words.forEach(w => { byWord[w.word] = w; });
  const taught = p.words.filter(w => w.def).length;
  console.log("=== " + f + " (" + p.id + ") ===");
  console.log("words: " + p.words.length + " | taught: " + taught + " | readings: " + p.readings.length);
  let blueTotal = 0, bareBlue = [], lens = [], qs = 0;
  p.readings.forEach(function (r, i) {
    const blue = (r.text.match(/<b>([^<]+)<\/b>/g) || []).map(m => m.replace(/<\/?b>/g, "").trim().toLowerCase());
    const words = r.text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean);
    lens.push(words.length);
    qs += r.questions.length;
    blueTotal += blue.length;
    blue.forEach(function (b) {
      const hit = stems(b).map(s => byWord[s]).find(x => x && x.def);
      if (!hit) bareBlue.push(p.id + "-R" + (i + 1) + ":" + b);
    });
    /* every non-blue word should be readable: check it is a real English token */
    const plain = words.map(w => w.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "")).filter(Boolean);
    const junk = plain.filter(w => /[一-龥]/.test(w) || !/^[a-zA-Z'’-]+$/.test(w));
    if (junk.length) { console.log("  R" + (i + 1) + " odd tokens: " + junk.join(",")); fails++; }
  });
  console.log("reading lengths: " + lens.join(", ") + " (min " + Math.min(...lens) + ", max " + Math.max(...lens) + ")");
  console.log("blue words: " + blueTotal + " | questions: " + qs + " | vocab entries: " +
    p.readings.reduce((a, r) => a + r.vocab.length, 0));
  console.log("blue words WITHOUT a full entry: " + (bareBlue.length ? bareBlue.join(", ") : "none"));
  if (bareBlue.length) fails++;
  /* duplicate check */
  const dup = p.words.map(w => w.word).filter((w, i, a) => a.indexOf(w) !== i);
  console.log("duplicate word keys: " + (dup.length ? dup.join(",") : "none"));
  if (dup.length) fails++;
  console.log("");
});
console.log(fails === 0 ? "QUALITY CHECK PASSED" : "QUALITY CHECK FAILED (" + fails + ")");
process.exit(fails === 0 ? 0 : 1);
