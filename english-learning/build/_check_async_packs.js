/* Functional smoke test for the async pack loading + split SW caches.
   Loads the real index.html in jsdom (fetch polyfilled to the local server),
   waits for the background load, then asserts the app state through
   window.eval (top-level `let` bindings live in the global lexical scope).

   Requires: node build/_perf_server.js <port>   (running in background)
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

(async function () {
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

  // ---- phase 1: right after init, only the active pack should be loaded ----
  for (let i = 0; i < 200; i++) {
    await new Promise(r => setTimeout(r, 25));
    if (ev("typeof PACKS!=='undefined' && Object.keys(PACKS).length") > 0) break;
  }
  const early = ev("Object.keys(PACKS).length");
  console.log("phase 1 (immediately after first paint): PACKS=" + early + "  activePack=" + ev("state.activePack"));
  ok(early < 8, "first paint does NOT wait for all 8 packs (" + early + " loaded so far)");
  ok(ev("(WORDS||[]).length") > 0, "WORDS is populated from the active pack");
  ok(ev("(READINGS||[]).length") > 0, "READINGS is populated so the Reading tab renders");

  // ---- phase 2: after the background load ----
  for (let i = 0; i < 300; i++) {
    await new Promise(r => setTimeout(r, 25));
    if (ev("typeof packsLoaded!=='undefined' && packsLoaded") === true) break;
  }
  const all = ev("Object.keys(PACKS).length");
  console.log("phase 2 (after background load): PACKS=" + all + "  CROSS_DICT=" + ev("Object.keys(CROSS_DICT||{}).length"));
  ok(all === 8, "all 8 manifest packs eventually load (" + all + ")");
  ok(ev("Object.keys(CROSS_DICT||{}).length") > 1000, "CROSS_DICT is rebuilt after the background load");
  ok(ev("state.activePack") === "general", "active pack was not switched by the background load");
  ok(ev("(READINGS||[]).length") > 0, "READINGS still points at the active pack");

  // ---- UI actually rendered ----
  const d = w.document;
  ok(d.getElementById("readingArea").innerHTML.length > 50, "Reading panel has content");
  ok(d.getElementById("packSelect") && d.getElementById("packSelect").options.length >= 8, "pack dropdown lists every pack");
  ok(d.getElementById("dailyArea").innerHTML.length > 20, "Daily panel has content");
  ok(d.getElementById("streakN").textContent.length > 0, "header streak rendered");

  // ---- SW split caches ----
  const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  ok(/APP_CACHE = "ed-app-/.test(sw), "sw.js: app cache is separate");
  ok(/CONTENT_CACHE = "ed-content-/.test(sw), "sw.js: content cache is separate");
  ok(!/caches\.open\(CACHE\)/.test(sw), "sw.js: no single shared CACHE left");

  console.log("\n" + (fail ? "SOME CHECKS FAILED" : "ALL CHECKS PASSED") + "  (" + pass + " passed, " + fail + " failed)");
  dom.window.close();
  process.exit(fail ? 1 : 0);
})().catch(function (e) { console.error("ERR", e && e.stack); process.exit(1); });
