// Robust extractor: pulls the four data constants (WORDS, READINGS,
// AREA_TASKS, AREA_LABEL) out of the HTML's <script> DATA block by running
// that block in a sandbox — no fragile eval/string parsing.
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const htmlPath = path.join(__dirname, "english-learning-tool.html");
const outDir = path.join(__dirname, "content");

const html = fs.readFileSync(htmlPath, "utf8");
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error("No <script> found"); process.exit(1); }
const script = m[1];

const start = script.indexOf("const WORDS");
const end = script.indexOf("/* ===================== I18N");
if (start < 0 || end < 0) { console.error("DATA block not found"); process.exit(1); }

// Run only the DATA block (pure constants, no DOM refs) plus a capture shim.
const dataBlock = script.slice(start, end) +
  "\nvar __OUT={WORDS:WORDS,READINGS:READINGS,AREA_TASKS:AREA_TASKS,AREA_LABEL:AREA_LABEL};";

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataBlock, sandbox);
const { WORDS, READINGS, AREA_TASKS, AREA_LABEL } = sandbox.__OUT;

const pack = {
  id: "general",
  name: "通用英语",
  nameEn: "General English",
  desc: "默认内容包：40 个每日单词 + 6 篇分级阅读 + 计划任务库",
  descEn: "Default pack: 40 daily words + 6 graded readings + plan task bank",
  words: WORDS,
  readings: READINGS,
  areaTasks: AREA_TASKS,
  areaLabel: AREA_LABEL
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "general.json"), JSON.stringify(pack, null, 2));
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify({
  version: 1,
  defaultPack: "general",
  packs: [{ id: "general", file: "general.json", name: "通用英语", nameEn: "General English" }]
}, null, 2));

console.log("OK words=" + WORDS.length + " readings=" + READINGS.length +
            " areas=" + Object.keys(AREA_TASKS).length);
