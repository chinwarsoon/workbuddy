/* Regression tests for the two P0 fixes (ed-v37):
   A. registerSW() must register even when `load` already fired.
   B. CROSS_DICT must be rebuilt relative to the pack on screen, so switching
      packs no longer leaves the active pack's own words flagged as "prior".

   Requires: node build/_perf_server.js 8123   (running in background)
*/
const fs = require("fs");
const path = require("path");
const http = require("http");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..", "pwa");
const PORT = Number(process.env.PERF_PORT || 8123);
let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log("  ok   " + msg); } else { fail++; console.log("  FAIL " + msg); } }

function nodeFetch(url) {
  return new Promise(function (resolve, reject) {
    http.get(url, function (res) {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error("HTTP " + res.statusCode)); }
      let b = ""; res.setEncoding("utf8");
      res.on("data", c => b += c);
      res.on("end", () => resolve(b));
    }).on("error", reject);
  });
}

/* CROSS_DICT is a single global key space, so packs legitimately share words:
   a word of the active pack can still be present because ANOTHER pack carries
   it. The only sound signal is a pack's EXCLUSIVE words — those appear in no
   other pack, so they must vanish from the dictionary the moment that pack
   becomes the active one. */
const HELPERS =
  "window.__uniq=function(pid){var others={};Object.keys(PACKS).forEach(function(k){if(k===pid)return;" +
  "(PACKS[k].words||[]).forEach(function(w){if(w&&w.word)others[String(w.word).toLowerCase()]=1;});});" +
  "var out=[];(PACKS[pid].words||[]).forEach(function(w){if(w&&w.word){var k=String(w.word).toLowerCase();" +
  "if(!others[k])out.push(k);}});return out;};" +
  "window.__cnt=function(pid){var n=0;window.__uniq(pid).forEach(function(k){if(CROSS_DICT[k])n++;});return n;};'ok'";

(async function () {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");

  // ---------- A. static assertions on registerSW ----------
  ok(/document\.readyState === "complete"/.test(html),
     "A1 registerSW checks document.readyState before waiting for load");
  ok(/addEventListener\("load", doRegister, \{once:true\}\)/.test(html),
     "A2 load listener is one-shot and delegates to doRegister");
  ok(/var doRegister = function\(\)\{[\s\S]{0,200}navigator\.serviceWorker\.register\("sw\.js"\)/.test(html),
     "A3 registration call lives in doRegister, not only inside the load handler");
  ok(/APP_CACHE = "ed-app-v37"/.test(sw), "A4 sw.js bumped to ed-app-v37");
  ok(/CONTENT_CACHE = "ed-content-v1"/.test(sw), "A5 content cache untouched (no 2.2 MB re-download)");

  const dom = await JSDOM.fromFile(path.join(ROOT, "index.html"), {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    url: "http://127.0.0.1:" + PORT + "/",
    beforeParse: function (w) {
      w.fetch = function (u) {
        const abs = /^https?:/.test(u) ? u : "http://127.0.0.1:" + PORT + "/" + String(u).replace(/^\.?\//, "");
        return nodeFetch(abs).then(function (body) {
          return { ok: true, status: 200, json: () => Promise.resolve(JSON.parse(body)), text: () => Promise.resolve(body) };
        });
      };
    }
  });
  const w = dom.window;
  const ev = function (expr) { try { return w.eval(expr); } catch (e) { return "ERR:" + e.message; } };

  for (let i = 0; i < 300; i++) {
    await new Promise(r => setTimeout(r, 25));
    if (ev("typeof packsLoaded!=='undefined' && packsLoaded") === true) break;
  }

  // ---------- B. behavioural: CROSS_DICT follows the active pack ----------
  ev(HELPERS);
  const uniqGeneral = ev("__uniq('general').length");
  const uniqNce2 = ev("__uniq('nce2').length");
  ok(uniqGeneral > 10 && uniqNce2 > 10,
     "B1 both packs have enough exclusive words to be a real signal (general=" + uniqGeneral + " nce2=" + uniqNce2 + ")");

  const active0 = ev("state.activePack");
  ok(active0 === "general", "B2 baseline active pack is general");

  const generalInDictBefore = ev("__cnt('general')");
  const nce2InDictBefore = ev("__cnt('nce2')");
  ok(generalInDictBefore === 0,
     "B3 active pack's exclusive words are excluded from CROSS_DICT (" + generalInDictBefore + ")");
  ok(nce2InDictBefore === uniqNce2,
     "B4 inactive pack's exclusive words are all in CROSS_DICT (" + nce2InDictBefore + "/" + uniqNce2 + ")");

  // switch packs exactly the way the dropdown does
  ev("applyPack(PACKS['nce2'])");
  const active1 = ev("state.activePack");
  const nce2InDictAfter = ev("__cnt('nce2')");
  const generalInDictAfter = ev("__cnt('general')");

  ok(active1 === "nce2", "B5 applyPack switched the active pack to nce2");
  ok(nce2InDictAfter === 0,
     "B6 after switch, the new active pack's exclusive words left CROSS_DICT (" + nce2InDictAfter + ")");
  ok(nce2InDictBefore === uniqNce2 && nce2InDictAfter === 0,
     "B7 the switch really rebuilt the dictionary (before=" + nce2InDictBefore + " after=" + nce2InDictAfter + ")");
  ok(generalInDictAfter === uniqGeneral,
     "B8 the previously active pack's exclusive words moved in (" + generalInDictAfter + "/" + uniqGeneral + ")");

  // still functional after the switch
  ok(ev("(WORDS||[]).length") > 0, "B8 WORDS repopulated for the new pack");
  ok(ev("(READINGS||[]).length") > 0, "B9 READINGS repopulated for the new pack");

  console.log("\n" + (fail ? "SOME CHECKS FAILED" : "ALL CHECKS PASSED") + "  (" + pass + " passed, " + fail + " failed)");
  dom.window.close();
  process.exit(fail ? 1 : 0);
})().catch(function (e) { console.error("ERR", e && e.stack); process.exit(1); });
