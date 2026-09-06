const fs = require("fs");
const path = require("path");

function loadJS(f) {
  const src = fs.readFileSync(f, "utf8");
  // module.exports = { ... }; OR  const W = { ... };
  let body;
  const me = src.match(/module\.exports\s*=\s*(\{[\s\S]*?\n\});?/);
  const cw = src.match(/const\s+W\s*=\s*(\{[\s\S]*?\n\});?/);
  body = me ? me[1] : (cw ? cw[1] : null);
  if (!body) throw new Error("no object found in " + f);
  return new Function("return (" + body + ");")();
}

const files = ["p1_words_ngsl.js", "p1_words_a.js", "p1_words_b.js"];
const clean = {};
for (const f of files) {
  const o = loadJS(path.join(__dirname, f));
  for (const k in o) if (!clean[k]) clean[k] = o[k];
}
console.log("clean source words:", Object.keys(clean).length);

const p1 = JSON.parse(fs.readFileSync(path.join(__dirname, "../content/freq-1k.json"), "utf8"));
const words = p1.words;
console.log("freq-1k entries:", words.length);

const missing = words.filter(w => !w.def);
console.log("missing def:", missing.length);

let covered = 0, uncovered = [];
for (const w of missing) {
  if (clean[w.word]) covered++;
  else uncovered.push(w.word);
}
console.log("missing covered by clean source:", covered);
console.log("missing NOT in clean source:", uncovered.length);
console.log("sample uncovered:", uncovered.slice(0, 120).join(", "));

// sample a few clean-source records to confirm field order
const sample = uncovered.length ? null : null;
const demo = Object.keys(clean).slice(0, 3);
console.log("demo clean records:");
for (const k of demo) console.log("  ", k, JSON.stringify(clean[k]));
