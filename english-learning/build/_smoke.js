/* App-level smoke test (black box, DOM only): boot the PWA with a mocked fetch
   that serves the real pack JSONs, open the Reading tab, and check blue words
   resolve to real definitions. */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const html = fs.readFileSync(path.join(DIR, "pwa", "index.html"), "utf8");
const CONTENT = path.join(DIR, "pwa", "content");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log("  PASS " + label + (extra ? " — " + extra : "")); }
  else { fail++; console.log("  FAIL " + label + (extra ? " — " + extra : "")); }
}

function boot(activePack) {
  const store = { englishDaily_v1: JSON.stringify({ activePack: activePack, learnedWords: [] }) };
  return new JSDOM(html, {
    runScripts: "dangerously", url: "https://app.local/", pretendToBeVisual: true,
    beforeParse(w) {
      Object.defineProperty(w, "localStorage", {
        value: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } }
      });
      w.speechSynthesis = { cancel() {}, speak() {} };
      w.SpeechSynthesisUtterance = function (t) { this.text = t; };
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
      w.fetch = function (url) {
        const name = String(url).split("/").pop();
        const file = path.join(CONTENT, name);
        if (!fs.existsSync(file)) return Promise.reject(new Error("404 " + name));
        return Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(fs.readFileSync(file, "utf8"))) });
      };
    }
  });
}

function run(packId, expectMinWords, next) {
  const dom = boot(packId);
  const w = dom.window;
  setTimeout(function () {
    console.log("=== pack " + packId + " ===");
    try {
      /* open the Reading tab */
      const tabBtn = w.document.querySelector('[data-act="tab"][data-target="reading"]');
      check("reading tab button exists", !!tabBtn);
      if (tabBtn) tabBtn.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
      const area = w.document.getElementById("readingArea");
      const txt = area ? area.innerHTML : "";
      const blues = (txt.match(/data-act="wordpopup"/g) || []).length;
      check("reading renders", txt.length > 200, txt.length + " chars");
      check("reading has " + expectMinWords + "+ words", area.textContent.trim().split(/\s+/).length >= expectMinWords,
        area.textContent.trim().split(/\s+/).length + " words");
      check("blue words are tappable", blues >= 5, blues + " tappable");
      /* click the first blue word -> popup must show a definition */
      const bw = area.querySelector('[data-act="wordpopup"]');
      if (bw) bw.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
      const modal = w.document.getElementById("wordModalBody");
      const def = modal ? modal.querySelector(".mdef") : null;
      check("blue word popup shows a definition", !!def && def.textContent.trim().length > 0,
        def ? def.textContent.trim() : "no .mdef");
      /* questions */
      const opts = area.querySelectorAll('[data-act="readingopt"]');
      check("3 questions x 3 options rendered", opts.length === 9, opts.length + " option buttons");
    } catch (e) { console.log("  ERROR " + e.message); fail++; }
    w.close();
    next();
  }, 700);
}

run("freq1k", 80, function () {
  run("freq2k", 140, function () {
    console.log("\n" + pass + " passed, " + fail + " failed");
    process.exit(fail === 0 ? 0 : 1);
  });
});
