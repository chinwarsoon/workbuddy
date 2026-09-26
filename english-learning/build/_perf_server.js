/* Tiny static server used only by _perf_load.js (jsdom boot benchmark). */
const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "pwa");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css" };
const PORT = Number(process.argv[2] || 8123);
http.createServer(function (req, res) {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/" || p === "/index.html") p = "/index.html";
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); res.end("nf"); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "text/plain" });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, "127.0.0.1", function () { console.log("serving " + ROOT + " on " + PORT); });
