// Revision 0.2 | 2026-10-31 | CodeBuddy (AI) | Sample page for the C4 Turnaround & Aging
// panel, rendered inside the real Option-B app shell (MDL two-row header + navy left
// nav sidebar, light theme default) so the design can be reviewed against the UI spec
// (workplan §3.1 / §3.3 / §4). Uses the real dashboard.css and the real derived data.
// Output: sub/sample-c4.html. The engine is NOT modified.
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { readXlsx } from '../engine/xlsx-reader.js';
import { buildModel } from '../engine/pipeline.js';
import { deriveView } from '../engine/render.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// --- real data -------------------------------------------------------------
const config = JSON.parse(read('config/pipeline_contract.json'));
const bytes = n => { const v = fs.readFileSync(path.join(ROOT, n)); return v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength); };
const model = buildModel(await readXlsx(bytes('TWRP C3B2 - Master Document List.xlsx')), await readXlsx(bytes('TWRP C3B2 - Document Submittal Log.xlsx')), { contract: config, today: '2026-10-24' });
const view = deriveView(model);
const asOf = model.meta.asOfDate;

const toMs = v => { if (v == null || v === '') return null; if (typeof v === 'number') return new Date(Date.UTC(1899, 11, 30) + v * 86400000).getTime(); const t = Date.parse(v); return Number.isNaN(t) ? null : t; };
const diff = (a, b) => { const da = toMs(a), db = toMs(b); return da != null && db != null ? Math.round((da - db) / 86400000) : null; };

const pts = view.active
  .filter(r => Number.isFinite(r.turnaroundDays) && Number.isFinite(r.delayDays))
  .map(r => ({
    doc: r.documentNo,
    x: r.turnaroundDays,
    y: r.delayDays,
    overdue: r.submissionStatus === 'SUR' && !r.actualReturnDate && r.targetReturnDate && (diff(asOf, r.targetReturnDate) || 0) > 0
  }));
const buckets = view.kpis.longDue; // { lt30, b30_60, b60_90, gt90, total }
const openSur = view.active.filter(r => r.submissionStatus === 'SUR' && !r.actualReturnDate).length;
const overdueCount = pts.filter(p => p.overdue).length;

// --- scatter SVG (inside the panel's .c-card graph board) -------------------
const W = 820, H = 440, L = 58, R = 18, T = 18, B = 46;
const plotW = W - L - R, plotH = H - T - B;
const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
const pad = (mn, mx) => { if (mn === mx) { const d = Math.abs(mn) || 1; return [mn - d * 0.1, mx + d * 0.1]; } const p = (mx - mn) * 0.05; return [mn - p, mx + p]; };
let [minX, maxX] = pad(Math.min(...xs), Math.max(...xs));
let [minY, maxY] = pad(Math.min(...ys), Math.max(...ys));
const sx = v => L + (v - minX) / (maxX - minX) * plotW;
const sy = v => T + (1 - (v - minY) / (maxY - minY)) * plotH;
const ticks = (mn, mx) => { const n = 5, step = (mx - mn) / n; return Array.from({ length: n + 1 }, (_, i) => mn + step * i); };

let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Turnaround versus review-delay scatter">`;
for (const t of ticks(minY, maxY)) {
  const yy = sy(t);
  svg += `<line x1="${L}" y1="${yy.toFixed(1)}" x2="${L + plotW}" y2="${yy.toFixed(1)}" stroke="var(--border)" stroke-width="1"/>`;
  svg += `<text x="${L - 6}" y="${(yy + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text3)">${Math.round(t)}</text>`;
}
for (const t of ticks(minX, maxX)) {
  const xx = sx(t);
  svg += `<line x1="${xx.toFixed(1)}" y1="${T}" x2="${xx.toFixed(1)}" y2="${T + plotH}" stroke="var(--border)" stroke-width="1"/>`;
  svg += `<text x="${xx.toFixed(1)}" y="${T + plotH + 14}" text-anchor="middle" font-size="10" fill="var(--text3)">${Math.round(t)}</text>`;
}
if (minY < 0 && maxY > 0) svg += `<line x1="${L}" y1="${sy(0).toFixed(1)}" x2="${L + plotW}" y2="${sy(0).toFixed(1)}" stroke="var(--text3)" stroke-width="1" stroke-dasharray="4 3"/>`;
svg += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + plotH}" stroke="var(--text2)" stroke-width="1.5"/>`;
svg += `<line x1="${L}" y1="${T + plotH}" x2="${L + plotW}" y2="${T + plotH}" stroke="var(--text2)" stroke-width="1.5"/>`;
svg += `<text x="${L + plotW / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="var(--text2)">Turnaround (days) — return minus submission</text>`;
svg += `<text x="14" y="${T + plotH / 2}" text-anchor="middle" font-size="11" fill="var(--text2)" transform="rotate(-90 14 ${T + plotH / 2})">Review delay (days) — late vs target</text>`;
for (const p of pts) {
  const fill = p.overdue ? 'var(--red)' : 'var(--blue)';
  svg += `<circle cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="3.4" fill="${fill}" fill-opacity="0.75"><title>${p.doc}: turnaround ${p.x.toFixed(1)} d, delay ${p.y.toFixed(1)} d${p.overdue ? ' (overdue, open)' : ''}</title></circle>`;
}
svg += `</svg>`;

// --- age buckets HTML (dashboard .bar-chart, inside the .c-card board) ------
const bk = [['<30 d', buckets.lt30], ['30–60 d', buckets.b30_60], ['60–90 d', buckets.b60_90], ['>90 d', buckets.gt90]];
const bMax = Math.max(1, ...bk.map(b => b[1]));
const bucketsHtml = `<div class="bar-chart">${bk.map(([label, v]) => `<div class="bar-row"><span>${label}</span><div class="bar-track"><i style="width:${(v / bMax * 100).toFixed(1)}%"></i></div><b>${v}</b></div>`).join('')}</div><p class="note">Open SUR (submitted, not yet returned) split by days past each record's Target Return Date. Total open SUR = ${openSur}; of those, ${buckets.total} are past target (overdue).</p>`;

// --- assemble page inside the real Option-B shell ---------------------------
const css = read('engine/dashboard.css');
const page = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>C4 Turnaround &amp; Aging — Sample (UI-spec review)</title>
<style>${css}</style>
<style>
  .legend{display:flex;gap:16px;font-size:11px;color:var(--text2);margin:8px 2px 0}
  .legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;vertical-align:middle}
  .note{font-size:11px;color:var(--text3);margin:10px 2px 0}
  .sample-meta{font-size:11px;color:var(--text3);margin:0 0 10px}
  .c-card .legend, .c-card .note{padding:0 2px}
</style>
</head>
<body class="loaded">
  <div class="app">
    <header class="app-bar">
      <div class="app-top">
        <div class="brand">
          <div class="ttl-stack">
            <h1 class="ttl">Document Submittal Dashboard</h1>
            <div class="meta">SUB · C4 panel sample (review)</div>
          </div>
        </div>
        <div class="page-title" id="page-title">Analytical</div>
      </div>
      <div class="app-menu">
        <button class="btn" data-shell-toggle="left-sidebar" title="Toggle navigation panel" aria-label="Toggle navigation panel">&#9776;</button>
        <div class="actions">
          <button class="btn btn-primary" disabled>Load Workbook</button>
          <button class="btn" disabled>Export</button>
        </div>
        <button class="btn" title="Change layout" aria-label="Change layout">&#9638;</button>
      </div>
    </header>
    <main class="shell-row">
      <aside class="left-sidebar">
        <nav class="sb-menu page-links">
          <button class="page-link" data-page="Overview">Overview</button>
          <button class="page-link" data-page="Submittals">Submittals</button>
          <button class="page-link" data-page="Validation">Validation</button>
          <button class="page-link" data-page="Forward and Overdue">Forward and Overdue</button>
          <button class="page-link active" data-page="Analytical">Analytical</button>
        </nav>
        <nav class="sb-bottom">
          <button class="page-link" id="settings-button">Settings</button>
          <button class="page-link" id="help-button">Help</button>
        </nav>
      </aside>
      <section class="content">
        <div class="filter-area"></div>
        <div class="content-body">
          <div data-page-content>
            <section class="panel" data-panel="C4">
              <header class="panel-head">
                <h2>C4 Turnaround &amp; Aging</h2>
                <div class="panel-actions">
                  <div class="seg">
                    <button class="seg-btn active" data-c4view="scatter">Scatter</button>
                    <button class="seg-btn" data-c4view="buckets">Age buckets</button>
                  </div>
                  <button class="icon-btn help-open" data-help="C4 Turnaround &amp; Aging" aria-label="Help for C4 Turnaround &amp; Aging" title="Help">?</button>
                  <button class="icon-btn panel-toggle" data-panel-toggle="C4 Turnaround &amp; Aging" aria-expanded="true" aria-label="Collapse C4 Turnaround &amp; Aging" title="Collapse">&minus;</button>
                </div>
              </header>
              <div class="panel-body">
                <p class="sample-meta">Sample for UI-spec review — real data (as of ${asOf}). ${pts.length} submissions plotted; ${overdueCount} points are open &amp; past target (red).</p>
                <div class="c-card">
                  <div id="c4-scatter">${svg}
                    <div class="legend"><span><i style="background:var(--blue)"></i>Returned / on-time submission</span><span><i style="background:var(--red)"></i>Open &amp; past target (overdue)</span></div>
                  </div>
                  <div id="c4-buckets" hidden>${bucketsHtml}</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  </div>
<script>
  const btns = document.querySelectorAll('[data-c4view]');
  const views = { scatter: document.getElementById('c4-scatter'), buckets: document.getElementById('c4-buckets') };
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.toggle('active', x === b));
    Object.entries(views).forEach(([k, el]) => { el.hidden = k !== b.dataset.c4view; });
  }));
  document.querySelector('[data-panel-toggle]').addEventListener('click', e => {
    const panel = e.currentTarget.closest('.panel');
    const collapsed = panel.classList.toggle('collapsed');
    e.currentTarget.textContent = collapsed ? '+' : '−';
    e.currentTarget.setAttribute('aria-expanded', String(!collapsed));
  });
</script>
</body>
</html>`;

const TARGET = path.join(ROOT, 'sample-c4.html');
fs.writeFileSync(TARGET, page);
console.log(`Sample C4 page written: ${TARGET} (${page.length.toLocaleString()} bytes)`);
console.log(`scatter points: ${pts.length} (overdue/open-past-target: ${overdueCount}); age buckets: <30=${buckets.lt30} 30-60=${buckets.b30_60} 60-90=${buckets.b60_90} >90=${buckets.gt90}; open SUR total=${openSur}`);
