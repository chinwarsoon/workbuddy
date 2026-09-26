/* Boot-phase profiler.
   1. Generates pwa/_perf_probe.html = index.html + fine-grained timing marks.
   2. Loads it in jsdom (with a fetch polyfill, since jsdom has no window.fetch)
      against the local static server and prints the phase breakdown.

   Requires: node build/_perf_server.js <port>   (running in background)
   Usage:    NODE_PATH=<workspace>/node_modules node build/_perf_probe.js
*/
const fs = require("fs");
const path = require("path");
const http = require("http");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..", "pwa");
const PORT = Number(process.env.PERF_PORT || 8123);
const SRC = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* ---------- 1. build the instrumented copy ---------- */
let h = SRC.replace(/\r\n/g, "\n");   // index.html is CRLF; probe works in LF
function must(cond, msg) { if (!cond) { console.error("PROBE SETUP FAILED: " + msg); process.exit(1); } }

// global mark helper, available before the app script runs
h = h.replace("<script>", "<script>window.__P=[];window.__M=function(n){window.__P.push([n,Math.round(performance.now())]);};window.__T={};window.__ACC=function(k,ms){window.__T[k]=(window.__T[k]||0)+ms;};\n", 1);
must(h.indexOf("window.__P=[]") > 0, "inject mark helper");

// manifest
const manLine = 'const manifest = await fetchJSON("content/manifest.json");';
must(h.indexOf(manLine) > 0, "locate manifest fetch");
h = h.replace(manLine, 'const _m0=performance.now(); const manifest = await fetchJSON("content/manifest.json"); window.__ACC("fetchJSON:manifest",performance.now()-_m0); window.__M("manifest");');

// the ONE pack fetched before first paint
const actLine = 'PACKS[meta.id] = normalizePack(await fetchJSON("content/" + meta.file));';
must(h.indexOf(actLine) > 0, "locate active-pack fetch");
h = h.replace(actLine,
  'PACKS[meta.id] = normalizePack(await fetchJSON("content/" + meta.file)); window.__M("active pack");');
h = h.replace("      if(meta && meta.file){", "      const _a1=performance.now();\n      if(meta && meta.file){");
h = h.replace('catch(e){ /* keep the built-in pack */ }',
  'catch(e){ /* keep the built-in pack */ } window.__ACC("fetch+normalize:activePack", performance.now()-_a1);');

// background load completion
h = h.replace("  packsLoaded = true;", "  packsLoaded = true; window.__M('ALL packs loaded');");

// sanitizeRichText total
h = h.replace("function sanitizeRichText(html){",
  "function sanitizeRichText(html){ const _s=performance.now(); try{ return _sanitizeRichTextInner(html); } finally { window.__ACC('sanitizeRichText', performance.now()-_s); } }\nfunction _sanitizeRichTextInner(html){");
must(h.indexOf("_sanitizeRichTextInner") > 0, "wrap sanitizeRichText");

// CROSS_DICT build
h = h.replace(/^function rebuildCrossDict\(chosen\)\{$/m, "function rebuildCrossDict(chosen){ const _c0=performance.now(); try{ return _rcdInner(chosen); } finally { window.__ACC('crossDict',performance.now()-_c0);} }\nfunction _rcdInner(chosen){");
h = h.replace("      Object.keys(PACKS).forEach(function(pid){\n        if(pid===chosen) return;",
  "      Object.keys(PACKS).forEach(function(pid){\n        if(pid===chosen) return;");

// applyPack
h = h.replace("  applyPack(active);\n}", "  const _a0=performance.now(); applyPack(active); window.__ACC('applyPack',performance.now()-_a0); window.__M('applyPack done');\n}");

// init(): rewrite the whole body, marking each step
const initAnchor = "async function init(){\n  // Load content packs (async on hosted PWA; instant built-in on local file://)\n  await loadContent();";
must(h.indexOf(initAnchor) > 0, "locate init()");
const initBody = [
  "async function init(){",
  "  const _l0=performance.now(); await loadContent(); window.__ACC('loadContent',performance.now()-_l0); window.__M('loadContent done');",
  "  applyI18n();",
  "  document.getElementById(\"streakN\").textContent=progLabel();",
  "  ['renderPlan','refreshDaily','refreshReading','renderReview','renderMe','bindImport','bindPackImport','checkReminder','setupA11y'].forEach(function(n){",
  "    const _i=performance.now();",
  "    try{ window[n](); }catch(e){ console.error('step '+n+' threw: '+e.message); }",
  "    window.__ACC(n, performance.now()-_i); window.__M(n);",
  "  });",
  "  ensurePwaMeta();",
  "}"];
const oldInit = h.slice(h.indexOf("async function init(){"), h.indexOf("init();\n"));
must(oldInit.length > 100 && oldInit.indexOf("registerSW()") > 0, "slice init() body");
h = h.replace(oldInit, initBody.join("\n") + "\n");

const OUT = path.join(ROOT, "_perf_probe.html");
fs.writeFileSync(OUT, h);

/* ---------- 2. run it ---------- */
function nodeFetch(url) {
  return new Promise(function (resolve, reject) {
    http.get(url, function (res) {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error("HTTP " + res.statusCode)); }
      let b = "";
      res.setEncoding("utf8");
      res.on("data", function (c) { b += c; });
      res.on("end", function () { resolve(b); });
    }).on("error", reject);
  });
}

(async function () {
  const t0 = Date.now();
  const dom = await JSDOM.fromFile(OUT, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    url: "http://127.0.0.1:" + PORT + "/",
    beforeParse: function (w) {
      w.fetch = function (u) {
        const abs = /^https?:/.test(u) ? u : "http://127.0.0.1:" + PORT + "/" + String(u).replace(/^\.?\//, "");
        return nodeFetch(abs).then(function (body) {
          return {
            ok: true, status: 200,
            json: function () { return Promise.resolve(JSON.parse(body)); },
            text: function () { return Promise.resolve(body); }
          };
        });
      };
    }
  });
  // wait for init to settle
  const w = dom.window;
  for (let i = 0; i < 300; i++) {
    await new Promise(function (r) { setTimeout(r, 50); });
    const area = w.document.getElementById("readingArea");
    if (area && area.innerHTML && area.innerHTML.length > 50) break;
  }
  await new Promise(function (r) { setTimeout(r, 800); });
  const marks = w.__P || [];
  const acc = w.__T || {};
  console.log("=== boot phase breakdown (jsdom, local server) ===");
  console.log("wall clock: " + (Date.now() - t0) + " ms;  window.performance.now: " + Math.round(w.performance.now()) + " ms");
  console.log("--- accumulated (self time) ---");
  Object.keys(acc).sort(function (a, b) { return acc[b] - acc[a]; }).forEach(function (k) {
    console.log(String(Math.round(acc[k])).padStart(8) + " ms  " + k);
  });
  console.log("--- marks ---");
  let prev = 0;
  marks.forEach(function (m) {
    console.log(String(m[1]).padStart(8) + " ms  (+" + String(m[1] - prev).padStart(6) + ")  " + m[0]);
    prev = m[1];
  });
  dom.window.close();
  fs.unlinkSync(OUT);
  process.exit(0);
})().catch(function (e) { console.error("ERR", e && e.stack); process.exit(1); });
