// Revision 2.17 | 2026-11-17 | CodeBuddy (AI) | §4 rev 1.90 / I146 — `exportAllTablesXlsx()` harvests every table across all data pages through `collectExportTables()`, rendering each page into a detached scratch element so the visible page and its registry snapshot stay untouched. The workbook now carries one worksheet per table dashboard-wide. Handler paths and the standardized name are unchanged.
// Revision 2.16 | 2026-11-17 | CodeBuddy (AI) | §4 rev 1.89 / I145 amendment — the hardcoded PROJECT_CODE = 'SUB' constant and the local file-name helpers are removed; CSV and XLSX downloads call `exportFileName(purpose, ext, model?.meta)` from render.js, so the name prefix comes from the MDL Code sheet Project Title with the Project Code fallback. Handler paths, registry and hide-empty logic are unchanged.
// Revision 2.15 | 2026-11-16 | CodeBuddy (AI) | §4.2 rev 1.83 / I139 — with the legend rows INSIDE the bordered donut svg (C1 model), the Pie export returns to ONE clone of the plot svg (the legend travels with it) and the rev 2.14 wrapper-stacking path is removed; the clone now carries explicit width / height from the rendered box so the fixed `--c3-pie-h` height is preserved. The Bar export path is unchanged and adapts to the new grid rows through the live zone rects. No data, state, ARIA or handler path changes.
// Revision 2.14 | 2026-11-16 | CodeBuddy (AI) | §4.2 rev 1.78 / rev 1.82 / I135 — `serializeC3Svg()` now selects the donut `svg.c3-svg` explicitly (the in-SVG legend `svg.c3-legend-svg` must never be mistaken for the plot) and, when a legend is present, exports ONE wrapper SVG that stacks the legend and the bordered donut, redrawing the plot-zone edge from the live `--border` token. `c3CardToSvg()` serializes the in-SVG legend items (swatch fill + label text from computed styles) and the rotated `.g-ycap` "Documents" caption, replacing the retired HTML `.c3-leg` path. No data, state, ARIA or handler path changes.
// Revision 2.13 | 2026-11-16 | CodeBuddy (AI) | §4.2 rev 1.81 / §7.2 rev 1.81 / I138 — `c3CardToSvg()` keeps the bordered chart composition in the Bar-card export: one stroked path for the y-axis zone (top-left / bottom-left 10 px, shared right edge square), one for the plot zone (right corners 10 px, shared left edge square) and one stroked, 10 px-rounded rect for the attached table's single outer border. Edges resolve from the live `--border` token, so all five themes export correctly. The Pie export keeps cloning the donut `<svg>` unchanged. No data, state, ARIA or handler path changes.
// Revision 2.12 | 2026-11-14 | CodeBuddy (AI) | I133 — `Breakdown` joins `NAV_PAGES`. `state.c3Panels` holds ONE `c3Month` / `c3Dim` / `c3View` set for each of the three independent panels, and `c3SetPanel()` writes only to the panel named by the control's `data-c3panel`. `exportC3TableCsv()` starts from the clicked button's own `.panel`. The global Discipline filter domain uses `Others`. C1, C2, C4 and the C3 PNG / Copy paths are unchanged.
// Revision 2.11 | 2026-11-14 | CodeBuddy (AI) | §4.2 rev 1.75 — `withC3ColumnMarksHidden()` wraps C3 PNG / Copy so the ONE column band and ONE centre line are hidden before `c3CardToSvg()` reads computed styles, then restored exactly. `clearC3ColumnSync()` hides both elements on blur, Escape, repaint and print. `c3CardToSvg()` never emits either element. C1 export is unchanged.
// Revision 2.10 | 2026-11-14 | CodeBuddy (AI) | §4.2 rev 1.74 / I131 — the general chart ↔ attached-table column sync now covers C3 Bar cards. `bindTableCrosshair()` treats `.c3-table` as chart-linked, so it adds `.row-hover` / `.cell-hover` but no competing `.col-hover`. `clearC3ColumnSync()` clears `.col-active` from bars and table cells on blur, Escape, repaint and print. C3 PNG / Copy strip the transient state from the whole card before they read computed styles. C1 export and the Pie view are unchanged.
// Revision 2.9 | 2026-11-13 | CodeBuddy (AI) | §4.2 rev 1.73 / I130 — C3 Bar PNG / Copy now rebuild the native attached table. `c3CardToSvg()` draws one SVG rule per `<tr>`, keeps `.g-axis` / `.g-label` / `.g-val` text on `<th>` / `<td>` cells, and strips transient §7.2.16 hover classes before it reads computed text styles. `tableCrosshairScope()` recognises `.c3-table`. The Pie view, `.c3-summary`, CSV export and pipeline data are unchanged.
// Revision 2.8 | 2026-11-13 | CodeBuddy (AI) | §7.2.16 / I129 — ONE delegated table hover crosshair binder. `data-table-crosshair` / `data-col-id` resolve the hovered row and logical column without raw cellIndex; split headers and bodies share one scope, C1 keeps its chart-linked `.col-active` state, and transient classes are cleared on pointer leave, blur, Escape, repaint and print. C1 PNG / Copy strip `.row-hover`, `.col-hover`, `.cell-hover` and `.col-active` before reading computed text styles. No data, ARIA, export payload, chart state or resize behaviour changes.
// Revision 2.7 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.67 / I122 — `state.c1Preset` now holds the ONE active preset name, defaults to `All`, and is set on a chip click. A handle `input` or `change` sets it to `null`, so a manual custom range leaves NO chip active. `c1SyncTimeBar()` reads that stored value instead of comparing `[from, to]` with each preset range, so clipped ranges can no longer light two chips. It also toggles the `.active` class that the joined `.seg` group uses. `state.c1Period`, `c1PresetRange()`, `paint()`, hover, PNG/Copy and the rev 1.65 shared Y axis are unchanged.
// Revision 2.6 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.66 / I121 — `c1SyncTimeBar()` keeps the single dual-handle track, its month ticks, period text, `aria-valuetext` and chip `aria-pressed` state in step while a handle moves. An `input` listener calls only that light visual sync; the existing `change` listener still performs the ONE full `paint()`. A new click branch resolves `data-c1preset` through `c1PresetRange()` and sets `state.c1Period`, so presets use the same repaint path as the handles. `c1Refit`, hover, PNG/Copy and the rev 1.65 window axis are unchanged.
// Revision 2.5 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.64 / I118 — `c1Refit()` regenerates the HTML Y ticks from the same `data-c1meta.yMax` / `yStep` / `yIntervals` payload used by `c1PlotSvg`, instead of the fixed `[4,3,2,1,0]` loop. Tick count, values and positions follow the dynamic nice-number rule; PNG / Copy keep serialising the rendered `.c1-ytick` spans.
// Revision 2.4 | 2026-11-06 | CodeBuddy (AI) | §4.2 rev 1.63 export fidelity. `chartSvgStyle()` now resolves the four `.sc-stop-*` gradient stops to literal token colours, so PNG / Copy keep the soft areas. `c1BoardToSvg()` removes the transient `.sc-hover-band` from the clone and reads table text with `.col-active` temporarily cleared, so no hover state is captured. `serializeC1Svg()`'s fallback strips the band and snap line too. `c1Refit()` rebuilds the band from the new W / N with every refit; the binder queries it fresh after `innerHTML` replacement.
// Revision 2.3 | 2026-10-24 | CodeBuddy (AI) | D33: the Stage filter lists (blank) plus Deleted, Void and Superseded, and its badge is measured against the default ticked set.
// Revision 2.2 | 2026-10-24 | CodeBuddy (AI) | Option B shell (MDL two-row header + left nav sidebar). Engine contract unchanged; UI handlers rewired to menu bar + modals.
import { readXlsx } from './xlsx-reader.js';
import { buildXlsx } from './xlsx-writer.js';
import { buildModel, inspectWorkbook } from './pipeline.js';
import { deriveView, renderDashboard, EXCLUDED_STAGES, getExportTables, getExportTable, collectExportTables, exportFileName, buildSubmittalsCsv, buildIssueCsv, c1PlotSvg, c1PresetRange } from './render.js';

const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const state = { page: 'Overview', theme: localStorage.getItem('sub-dashboard-theme') || 'light', layout: localStorage.getItem('sub-dashboard-layout') || 'one', search: '', searchCol: 'all', disciplines: new Set(), stages: new Set(), statuses: new Set(), approvals: new Set(), submitters: new Set(), showWarnings: localStorage.getItem('sub-dashboard-warnings') !== 'false', rememberNames: false, columnSets: {}, c1Grain: 'month', c1Bars: true, c1Series: new Set(['plan', 'forecast', 'actualFirst', 'actualResub']), c1Period: null, c1Preset: 'All', c3Month: 'ALL', c3Dim: 'discipline', c3View: 'bar', c3Panels: { submissions: { c3Month: 'ALL', c3Dim: 'discipline', c3View: 'bar' }, approval: { c3Month: 'ALL', c3Dim: 'discipline', c3View: 'bar' }, summary: { c3Month: 'ALL', c3Dim: 'discipline', c3View: 'bar' } }, c2View: 'stacked', c2Nfs: true, foView: 'lookahead', foLane: 'all', foHorizon: 4, c4View: 'scatter', subMonth: 'ALL', issueCode: 'ALL', issuePage: 1, collapsedPanels: [] };
// I133 — ONE C3 control changes only the state of its OWN Breakdown panel.
function c3SetPanel(panel, patch) {
  const key = ['submissions', 'approval', 'summary'].includes(panel) ? panel : 'submissions';
  state.c3Panels[key] = { ...(state.c3Panels[key] || {}), ...patch };
}
let contract;
let uiHelp;
let files = { mdl: null, log: null };
let fileInfo = { mdl: null, log: null };
let model = null;

function setStatus(message) { $('#status-message').textContent = message; }
function updateFiles() {
  const ready = !!(files.mdl && files.log && contract);
  const welcomeLoad = document.getElementById('welcome-load');
  if (welcomeLoad) welcomeLoad.disabled = !ready;
  const pickState = document.getElementById('pick-state');
  if (pickState) {
    const describe = kind => {
      if (!files[kind]) return 'still needed';
      const info = fileInfo[kind];
      return info?.dashboardTitle ? `${info.dashboardTitle} — ${files[kind].name}` : files[kind].name;
    };
    pickState.textContent = (files.mdl || files.log)
      ? `MDL: ${describe('mdl')} · Log: ${describe('log')}`
      : 'No workbooks selected yet.';
    pickState.classList.toggle('ready', ready);
  }
}
function updateSidebarWidth(width) {
  // §3.2 — the floor is the width at which the widest menu title still fits (135 px), rounded up.
  const min = 190, max = 460;
  const value = Math.max(min, Math.min(max, width));
  document.documentElement.style.setProperty('--sidebar-w', `${value}px`);
  localStorage.setItem('sub-dashboard-left-sidebar-width', String(value));
}
function updateTheme() { document.documentElement.dataset.theme = state.theme; localStorage.setItem('sub-dashboard-theme', state.theme); $('select[data-setting="theme"]') && ($('select[data-setting="theme"]').value = state.theme); }
// I142 — the layout value lives in state and is mirrored to the body and the Settings select.
function updateLayout() {
  const value = ['one', 'two', 'three'].includes(state.layout) ? state.layout : 'one';
  state.layout = value;
  document.body.dataset.layout = value;
  localStorage.setItem('sub-dashboard-layout', value);
  document.querySelectorAll('select[data-setting="layout"]').forEach(select => { select.value = value; });
}
function showWarnings() {
  const area = $('[data-shell="warnings"]');
  const items = model?.warnings || [];
  area.hidden = items.length === 0;
  const ordered = [...items].sort((a, b) => ({ Fatal: 0, Error: 0, Warning: 1, Info: 2 }[a.severity] ?? 3) - ({ Fatal: 0, Error: 0, Warning: 1, Info: 2 }[b.severity] ?? 3));
  area.innerHTML = ordered.map(item => `<div class="sys-banner-item ${String(item.severity).toLowerCase()}"><b>${escapeHtml(item.code)}</b> ${escapeHtml(item.message)}</div>`).join('');
  $('#warnBtn').hidden = items.length === 0;
  $('#warning-count').textContent = String(items.length);
  area.classList.toggle('collapsed', state.showWarnings === false);
  $('#warnBtn').setAttribute('aria-pressed', String(state.showWarnings !== false));
}
function chartSvgStyle() {
  const cs = getComputedStyle(document.documentElement);
  const v = n => (cs.getPropertyValue(n) || '').trim();
  const plan = v('--color-plan'), forecast = v('--color-forecast'), actual = v('--color-actual'), resub = v('--color-actualresub') || actual;
  const border = v('--border'), text = v('--text'), text2 = v('--text2'), text3 = v('--text3'), danger = v('--danger'), slate = v('--slate');
  // §4.2 rev 1.63 — CSS variables do not resolve inside a serialized standalone SVG, so the four
  // gradient stops receive the resolved token colours here. The area paths keep pointer-events:none.
  return `<style>.sc-stop-plan{stop-color:${plan}}.sc-stop-forecast{stop-color:${forecast}}.sc-stop-actual{stop-color:${actual}}.sc-stop-resub{stop-color:${resub}}.sc-area{pointer-events:none;stroke:none}.sc-bar-plan{fill:${plan}}.sc-bar-forecast{fill:${forecast}}.sc-bar-actual{fill:${actual}}.sc-bar-actualresub{fill:${resub}}.sc-line-plan{stroke:${plan};stroke-width:2.5;fill:none;stroke-dasharray:6 3}.sc-line-forecast{stroke:${forecast};stroke-width:2.5;fill:none;stroke-dasharray:2 2}.sc-line-actual{stroke:${actual};stroke-width:2.5;fill:none}.sc-line-actualresub{stroke:${resub};stroke-width:2.5;fill:none;stroke-dasharray:3 3;opacity:.85}.sc-dot{stroke:none}.sc-dot-plan{fill:${plan}}.sc-dot-forecast{fill:${forecast}}.sc-dot-actual{fill:${actual}}.sc-dot-actualresub{fill:${resub}}.sc-grid{stroke:${border};stroke-width:1}.sc-yaxis-line{stroke:${border};stroke-width:1}.sc-axis{fill:${text2};font-size:10px}.sc-axis-title{font-weight:700}.sc-x{font-size:10px}.sc-barval{fill:${text2};font-size:9px}.sc-leg-t{fill:${text};font-size:11px}.sc-ref-start{stroke:${danger};stroke-width:1.5;stroke-dasharray:5 3}.sc-ref-today{stroke:${slate};stroke-width:1.5;stroke-dasharray:2 2}.sc-ref-lbl{font-size:9px;font-weight:700}.sc-ref-lbl-start{fill:${danger}}.sc-ref-lbl-today{fill:${slate}}.chart-snap{stroke:${text3};stroke-width:1;stroke-dasharray:3 3}</style>`;
}
// §7.2.16 / I129 — remove every transient table-hover class before an exporter reads live styles.
// §4.2 rev 1.74 / I131 — the scope may be a whole C3 card, so chart bars and table cells are
// stripped together and restored together.
const TABLE_HOVER_CLASSES = ['row-hover', 'col-hover', 'cell-hover', 'col-active'];
function withTransientTableHoverStripped(scope, fn) {
  const removed = new Map();
  for (const cls of TABLE_HOVER_CLASSES) {
    scope.querySelectorAll(`.${cls}`).forEach(el => {
      if (!removed.has(el)) removed.set(el, []);
      if (!removed.get(el).includes(cls)) removed.get(el).push(cls);
      el.classList.remove(cls);
    });
  }
  try { return fn(); }
  finally {
    for (const [el, classes] of removed) for (const cls of classes) el.classList.add(cls);
  }
}
// §4.2 rev 1.75 — ONE hidden column band and ONE hidden centre line are transient chart state.
// Hide both before an exporter reads live styles and restore their exact inline display values.
function withC3ColumnMarksHidden(scope, fn) {
  const marks = scope ? [...scope.querySelectorAll('.c3-grid .c3-col-band,.c3-grid .c3-col-snap')] : [];
  const saved = marks.map(el => el.style.display);
  marks.forEach(el => { el.style.display = 'none'; });
  try { return fn(); }
  finally { marks.forEach((el, i) => { el.style.display = saved[i]; }); }
}

// Rebuild the C1 board (curve + native attached table) as one self-contained native SVG.
// A nested <svg> holds the curve; the table cells become 1 px <line> rules and <text>. No
// <foreignObject>, so canvas rasterization stays taint-free and Copy receives the same SVG.
function c1BoardToSvg() {
  const board = document.querySelector('.scurve.sc-board');
  const grid = board && board.querySelector('.c1-grid');
  const svg = grid && grid.querySelector('svg.scurve-svg');
  const table = grid && grid.querySelector('table.c1-table');
  if (!board || !grid || !svg || !table) return null;
  const root = grid.getBoundingClientRect();
  const W = Math.max(1, Math.ceil(root.width)), H = Math.max(1, Math.ceil(root.height));
  const cs = getComputedStyle(document.documentElement);
  const v = n => (cs.getPropertyValue(n) || '').trim();
  const surface = v('--surface') || '#fff', border = v('--border') || '#d9e1e8', text = v('--text') || '#1f2a37';
  const escSvg = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const box = el => { const r = el.getBoundingClientRect(); return { x: r.left - root.left, y: r.top - root.top, w: r.width, h: r.height }; };
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="${surface}"/>`;
  out += chartSvgStyle();
  const sr = box(svg);
  const clone = svg.cloneNode(true);
  clone.removeAttribute('style');
  clone.setAttribute('x', sr.x.toFixed(1));
  clone.setAttribute('y', sr.y.toFixed(1));
  clone.setAttribute('width', Math.max(1, sr.w).toFixed(1));
  clone.setAttribute('height', Math.max(1, sr.h).toFixed(1));
  // §4.2 rev 1.63 — transient hover state must never reach the exported SVG.
  clone.querySelectorAll('.chart-snap, .sc-hover-band').forEach(el => el.remove());
  out += new XMLSerializer().serializeToString(clone);
  const placeText = (el, vertical, label) => {
    const r = box(el), st = getComputedStyle(el);
    const fill = (st.color || text).trim();
    const fs = parseFloat(st.fontSize) || 11;
    const fw = (st.fontWeight === 'bold' || +st.fontWeight >= 600) ? ' font-weight="600"' : '';
    const fam = (st.fontFamily || 'sans-serif').replace(/"/g, "'");
    const txt = String(label == null ? el.textContent : label).trim();
    if (!txt) return;
    if (vertical) {
      const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      out += `<text transform="rotate(-90 ${cx.toFixed(1)} ${cy.toFixed(1)})" x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="${fam}" font-size="${fs}"${fw} fill="${fill}">${escSvg(txt)}</text>`;
    } else {
      const ta = st.textAlign;
      const anchor = ta === 'center' ? 'middle' : (ta === 'right' || ta === 'end') ? 'end' : 'start';
      const tx = anchor === 'middle' ? r.x + r.w / 2 : anchor === 'end' ? r.x + r.w - 4 : r.x + 4;
      out += `<text x="${tx.toFixed(1)}" y="${(r.y + r.h / 2).toFixed(1)}" text-anchor="${anchor}" dominant-baseline="central" font-family="${fam}" font-size="${fs}"${fw} fill="${fill}">${escSvg(txt)}</text>`;
    }
  };
  table.querySelectorAll('tr').forEach(tr => {
    const r = box(tr);
    out += `<line x1="${r.x.toFixed(1)}" y1="${r.y.toFixed(1)}" x2="${(r.x + r.w).toFixed(1)}" y2="${r.y.toFixed(1)}" stroke="${border}" stroke-width="1"/>`;
  });
  // §4.2 keeps the semantic <caption> in the DOM but visually hides it. It is clipped to
  // 1 x 1 px, so skip it here: drawing it would leave a stray <text> outside the viewBox.
  // The unit caption reads bottom-to-top along the Y axis; the dynamic ticks stay horizontal.
  const yCap = grid.querySelector('.c1-yaxis .c1-ycap');
  if (yCap) placeText(yCap, true);
  grid.querySelectorAll('.c1-yaxis .c1-ytick').forEach(el => placeText(el, false));
  const many = table.classList.contains('c1-many');
  // §4.2 rev 1.63 / §7.2.16 — placeText() reads the live computed colour. Strip every transient
  // hover class, including C1 .col-active, so no hover state is baked into PNG / Copy text; restore
  // the exact same classes afterwards so the on-screen crosshair is unchanged.
  withTransientTableHoverStripped(table, () => {
    table.querySelectorAll('th, td').forEach(cell => {
      const span = cell.querySelector('span');
      placeText(span || cell, !!(many && span && cell.classList.contains('g-axis')), (span || cell).textContent);
    });
  });
  return out + '</svg>';
}
function serializeC1Svg() {
  const built = c1BoardToSvg();
  if (built) return built;
  const svg = document.querySelector('.scurve svg');
  if (!svg) return null;
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  // §4.2 rev 1.63 — the fallback path strips the same transient hover marks as c1BoardToSvg().
  clone.querySelectorAll('.chart-snap, .sc-hover-band').forEach(el => el.remove());
  clone.insertAdjacentHTML('afterbegin', chartSvgStyle());
  return new XMLSerializer().serializeToString(clone);
}
function exportC1Png() {
  const str = serializeC1Svg();
  if (!str) return;
  const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const w = img.naturalWidth || 800, h = img.naturalHeight || 400;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale; canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = (getComputedStyle(document.documentElement).getPropertyValue('--surface') || '').trim() || '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'schedule-performance.png'; a.click(); URL.revokeObjectURL(a.href); });
    URL.revokeObjectURL(url);
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}
function copyC1Svg() {
  const str = serializeC1Svg();
  if (!str) return;
  if (navigator.clipboard) navigator.clipboard.writeText(str);
}
function chartC3SvgStyle() {
  const cs = getComputedStyle(document.documentElement);
  const v = n => (cs.getPropertyValue(n) || '').trim();
  const cNew = v('--color-new'), cResub = v('--color-resub');
  const app = v('--color-app'), awc = v('--color-awc'), nap = v('--color-nap'), rej = v('--color-rej'), inf = v('--color-inf'), ur = v('--color-ur');
  const border = v('--border'), text = v('--text'), text2 = v('--text2');
  return `<style>.c3-new{fill:${cNew}}.c3-new-arc{stroke:${cNew}}.c3-resub{fill:${cResub}}.c3-resub-arc{stroke:${cResub}}.c3-app{fill:${app}}.c3-app-arc{stroke:${app}}.c3-awc{fill:${awc}}.c3-awc-arc{stroke:${awc}}.c3-nap{fill:${nap}}.c3-nap-arc{stroke:${nap}}.c3-rej{fill:${rej}}.c3-rej-arc{stroke:${rej}}.c3-inf{fill:${inf}}.c3-inf-arc{stroke:${inf}}.c3-ur{fill:${ur}}.c3-ur-arc{stroke:${ur}}.c3-track-bg{fill:${border};fill-opacity:.18}.c3-label{fill:${text};font-size:11px}.c3-cap{fill:${text2};font-size:9px}.c3-val{fill:${text};font-size:11px;font-weight:600}.c3-total{fill:${text}}.c3-sub{fill:${text2}}.c3-leg-t{fill:${text2};font-size:11px}</style>`;
}
// Reconstruct a C3 Bar card (bars + Y ticks + grid lines + native attached table + legend) as a
// self-contained native SVG (rects + rules + text). Used for PNG/Copy because the Bar card has no
// <svg> of its own (§4.2 rev 1.73 / I130 draws the plot with one CSS grid and the data rows with one
// native table). Native SVG (no <foreignObject>) keeps canvas rasterization taint-free, so the
// existing PNG path works in every browser.
function c3CardToSvg(btn) {
  const card = btn && btn.closest ? btn.closest('.c3-card') : null;
  const body = card && card.querySelector('.c3-card-body');
  if (!body) return null;
  const root = card.getBoundingClientRect();
  const r0 = body.getBoundingClientRect();
  const X = r0.left - root.left, Y = r0.top - root.top;
  const W = Math.max(1, Math.ceil(r0.width)), H = Math.max(1, Math.ceil(r0.height));
  const csCard = getComputedStyle(card);
  let surf = (csCard.backgroundColor || '').trim();
  if (!surf || surf === 'transparent' || surf === 'rgba(0, 0, 0, 0)') surf = (getComputedStyle(document.documentElement).getPropertyValue('--surface') || '').trim() || '#fff';
  const escSvg = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rb = el => { const r = el.getBoundingClientRect(); return { x: r.left - root.left - X, y: r.top - root.top - Y, w: r.width, h: r.height }; };
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="${surf}"/>`;
  // §4.2 rev 1.81 — keep the bordered composition in the export: y-axis and plot zone edges with
  // their shared right angles, and the attached table's single outer border.
  const zoneEdge = (getComputedStyle(document.documentElement).getPropertyValue('--border') || '#d0d5dd').trim();
  const zoneArc = (rad, ex, ey) => `A${rad} ${rad} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  const zonePath = (r, tl, tr, br, bl) => {
    const x = r.x, y = r.y, w = r.w, h = r.h;
    return `M${(x + tl).toFixed(1)} ${y.toFixed(1)}H${(x + w - tr).toFixed(1)}`
      + (tr ? zoneArc(tr, x + w, y + tr) : '')
      + `V${(y + h - br).toFixed(1)}`
      + (br ? zoneArc(br, x + w - br, y + h) : '')
      + `H${(x + bl).toFixed(1)}`
      + (bl ? zoneArc(bl, x, y + h - bl) : '')
      + `V${(y + tl).toFixed(1)}`
      + (tl ? zoneArc(tl, x + tl, y) : '') + 'Z';
  };
  const yZone = body.querySelector('.c3-yaxis-zone'), pZone = body.querySelector('.c3-plot-zone');
  if (yZone) out += `<path d="${zonePath(rb(yZone), 10, 0, 0, 10)}" fill="none" stroke="${zoneEdge}" stroke-width="1"/>`;
  if (pZone) out += `<path d="${zonePath(rb(pZone), 0, 10, 10, 0)}" fill="none" stroke="${zoneEdge}" stroke-width="1"/>`;
  const table = body.querySelector('table.c3-table');
  body.querySelectorAll('.seg-bar').forEach(b => {
    const r = rb(b), fill = (getComputedStyle(b).backgroundColor || '#888').trim();
    out += `<rect x="${r.x.toFixed(1)}" y="${r.y.toFixed(1)}" width="${r.w.toFixed(1)}" height="${r.h.toFixed(1)}" fill="${fill}" rx="2"/>`;
  });
  if (table) {
    const rule = (getComputedStyle(document.documentElement).getPropertyValue('--border') || '#d0d5dd').trim();
    table.querySelectorAll('tr').forEach(tr => {
      const r = rb(tr);
      out += `<line x1="${r.x.toFixed(1)}" y1="${r.y.toFixed(1)}" x2="${(r.x + r.w).toFixed(1)}" y2="${r.y.toFixed(1)}" stroke="${rule}" stroke-width="1"/>`;
    });
    // §7.2 rev 1.81 — the attached table's single outer border, 10 px rounded on all corners.
    const tb = rb(table);
    out += `<rect x="${tb.x.toFixed(1)}" y="${tb.y.toFixed(1)}" width="${tb.w.toFixed(1)}" height="${tb.h.toFixed(1)}" fill="none" stroke="${rule}" stroke-width="1" rx="10"/>`;
  }
  const placeText = (el, vertical) => {
    const r = rb(el), cs = getComputedStyle(el);
    const fill = (cs.color || '#222').trim();
    const fs = parseFloat(cs.fontSize) || 11;
    const fw = (cs.fontWeight === 'bold' || +cs.fontWeight >= 600) ? ' font-weight="600"' : '';
    const fam = (cs.fontFamily || 'sans-serif').replace(/"/g, "'");
    const txt = el.textContent.trim();
    if (!txt) return;
    if (vertical) {
      const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      out += `<text transform="rotate(-90 ${cx.toFixed(1)} ${cy.toFixed(1)})" x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="${fam}" font-size="${fs}"${fw} fill="${fill}">${escSvg(txt)}</text>`;
    } else {
      const ta = cs.textAlign;
      const anchor = ta === 'center' ? 'middle' : ta === 'right' ? 'end' : 'start';
      const tx = ta === 'center' ? (r.x + r.w / 2) : ta === 'right' ? (r.x + r.w - 2) : (r.x + 2);
      const ty = r.y + r.h / 2;
      out += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="central" font-family="${fam}" font-size="${fs}"${fw} fill="${fill}">${escSvg(txt)}</text>`;
    }
  };
  const addTableText = () => {
    body.querySelectorAll('.g-axis').forEach(e => placeText(e, true));
    body.querySelectorAll('.g-label, .g-val').forEach(e => placeText(e, false));
  };
  if (table) withTransientTableHoverStripped(table, addTableText);
  else addTableText();
  // §4.2 rev 1.78 / rev 1.82 — the in-SVG legend above the plot area is serialized with the plot.
  body.querySelectorAll('.c3-legend-svg .c3-legend-g > g').forEach(item => {
    const sw = item.querySelector('rect'), tx = item.querySelector('text');
    if (sw) {
      const r = rb(sw);
      out += `<rect x="${r.x.toFixed(1)}" y="${r.y.toFixed(1)}" width="${r.w.toFixed(1)}" height="${r.h.toFixed(1)}" fill="${(getComputedStyle(sw).fill || getComputedStyle(sw).backgroundColor || '#888').trim()}" rx="2"/>`;
    }
    if (tx) {
      const r = rb(tx), cs = getComputedStyle(tx);
      const fill = (cs.fill && cs.fill !== 'none' ? cs.fill : cs.color) || '#222';
      out += `<text x="${r.x.toFixed(1)}" y="${(r.y + r.h / 2).toFixed(1)}" text-anchor="start" dominant-baseline="central" font-family="${(cs.fontFamily || 'sans-serif').replace(/"/g, "'")}" font-size="${parseFloat(cs.fontSize) || 11}" fill="${fill.trim()}">${escSvg(tx.textContent.trim())}</text>`;
    }
  });
  // §4.2 rev 1.82 — the rotated y-axis unit caption travels with the Bar export.
  body.querySelectorAll('.g-ycap').forEach(e => placeText(e, true));
  return out + '</svg>';
}
function serializeC3Svg(btn) {
  const scope = btn && btn.closest ? btn.closest('.c3-card') : null;
  const svg = scope ? scope.querySelector('svg.c3-svg') : null;
  if (svg) {
    // §4.2 rev 1.83 / I139 — the legend rows live INSIDE the bordered donut svg (C1 model), so the
    // Pie export is ONE clone of the plot svg; the legend travels with it. Width / height come from
    // the rendered box so the fixed --c3-pie-h height is preserved in the exported file.
    const clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const r = svg.getBoundingClientRect();
    clone.setAttribute('width', Math.max(1, r.width).toFixed(0));
    clone.setAttribute('height', Math.max(1, r.height).toFixed(0));
    clone.removeAttribute('style');
    clone.insertAdjacentHTML('afterbegin', chartC3SvgStyle());
    return new XMLSerializer().serializeToString(clone);
  }
  // Bar view card (no plot <svg>): rebuild it as a self-contained SVG so PNG/Copy still work.
  // §4.2 rev 1.74 / 1.75 — strip the transient chart / table column state from BOTH nodes and
  // hide the band / centre line before c3CardToSvg() reads any computed style, then restore.
  return withC3ColumnMarksHidden(scope, () =>
    withTransientTableHoverStripped(scope || document, () => c3CardToSvg(btn)));
}
function exportC3Png(btn) {
  const str = serializeC3Svg(btn);
  if (!str) return;
  const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const w = img.naturalWidth || 800, h = img.naturalHeight || 400;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale; canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = (getComputedStyle(document.documentElement).getPropertyValue('--surface') || '').trim() || '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'breakdown.png'; a.click(); URL.revokeObjectURL(a.href); });
    URL.revokeObjectURL(url);
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}
function copyC3Svg(btn) {
  const str = serializeC3Svg(btn);
  if (!str) return;
  if (navigator.clipboard) navigator.clipboard.writeText(str);
}
// Serialize the C2 chart's SVG. The C2 bands use inline fills, so no style injection is required.
function serializeC2Svg() {
  const svg = document.querySelector('.c2-stack svg');
  if (!svg) return '';
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(clone);
}
function exportC2Png() {
  const str = serializeC2Svg();
  if (!str) return;
  const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const w = img.naturalWidth || 800, h = img.naturalHeight || 400;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale; canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = (getComputedStyle(document.documentElement).getPropertyValue('--surface') || '').trim() || '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'submission-flow.png'; a.click(); URL.revokeObjectURL(a.href); });
    URL.revokeObjectURL(url);
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}
function copyC2Svg() {
  const str = serializeC2Svg();
  if (str && navigator.clipboard) navigator.clipboard.writeText(str);
}
// I133 — Download the Breakdown Summary table as CSV. The lookup starts from the clicked button's
// OWN panel, so the summary stays independent. The .ds-gut scrollbar spacer is skipped.
function exportC3TableCsv(btn) {
  const wrap = btn?.closest('.panel')?.querySelector('.c3-summary') || document.querySelector('.c3-summary');
  if (!wrap) return;
  const rows = [...wrap.querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('th:not(.ds-gut),td:not(.ds-gut)')].map(c => {
    const t = (c.textContent || '').replace(/\s+/g, ' ').trim();
    return /[",\n\r]/.test(t) ? `"${t.replaceAll('"', '""')}"` : t;
  }).join(','));
  if (!rows.length) return;
  const csv = '﻿' + rows.join('\r\n'); // BOM so Excel opens UTF-8 correctly
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = 'breakdown-table.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

// Download a keyed .ds-table as CSV. Reads the rendered header (from the .vheadtab
// fragment) and body rows straight from the DOM, so it respects the current column
// selection set by the column chooser; the .ds-gut scrollbar spacer is skipped.
function exportKeyedTableCsv(key) {
  const headTable = document.querySelector(`table.vheadtab[data-table-key="${key}"]`);
  const bodyTable = document.querySelector(`table[data-table-key="${key}"]:not(.vheadtab)`);
  if (!headTable || !bodyTable) return;
  const headCells = [...headTable.querySelectorAll('thead th:not(.ds-gut)')];
  const bodyRows = [...bodyTable.querySelectorAll('tbody tr:not(.win-pad)')].map(tr => [...tr.querySelectorAll('td:not(.ds-gut)')]);
  const rows = [headCells, ...bodyRows].map(cells => cells.map(c => {
    const t = (c.textContent || '').replace(/\s+/g, ' ').trim();
    return /[",\n\r]/.test(t) ? `"${t.replaceAll('"', '""')}"` : t;
  }).join(','));
  if (!rows.length) return;
  const csv = '﻿' + rows.join('\r\n'); // BOM so Excel opens UTF-8 correctly
  downloadCsv(csv, `${key}-table.csv`);
}

// Shared CSV download helper (BOM so Excel opens UTF-8 correctly).
function downloadCsv(csv, name) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

// I145 amendment — file names come from render.js. The prefix is the slugified Project Title from
// the MDL Code sheet, falling back to the Project Code from the same sheet (model.meta).
function tableToCsv(table) {
  if (!table || !table.rows.length) return '';
  const q = v => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s; };
  return '\uFEFF' + [table.headers, ...table.rows].map(row => row.map(q).join(',')).join('\r\n');
}

function exportTableCsv(key) {
  const table = getExportTable(key);
  if (!table || !table.rows.length) return;
  downloadCsv(tableToCsv(table), exportFileName(table.title, 'csv', model?.meta));
  setStatus(`${table.title}: ${table.rows.length.toLocaleString()} rows exported`);
}

function exportAllTablesXlsx() {
  // I146 — harvest every table across all data pages. Each page renders into a detached scratch
  // element, so the visible page and its registry snapshot stay untouched.
  const scratch = document.createElement('div');
  scratch.setAttribute('data-page-content', '');
  const scratchDoc = { querySelector: selector => selector === '[data-page-content]' ? scratch : null };
  const tables = collectExportTables(scratchDoc, model, state).filter(t => t.rows.length);
  if (!tables.length) { setStatus('No tables to export'); return; }
  const bytes = buildXlsx(tables.map(t => ({ name: t.title, headers: t.headers, rows: t.rows })));
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  link.download = exportFileName('All-Tables', 'xlsx', model?.meta);
  link.click();
  URL.revokeObjectURL(link.href);
  setStatus(`${tables.length} tables exported to Excel`);
}

// I145 — hide a CSV button when its table has no rows or no table renders in the current view.
function syncExportButtons() {
  document.querySelectorAll('[data-export-csv]').forEach(btn => {
    const table = getExportTable(btn.getAttribute('data-export-csv'));
    btn.hidden = !table || !table.rows.length;
  });
}

let filterDimensions = [];
/** The five global filter dimensions, built from the loaded model. */
function buildFilterDimensions() {
  // Stage lists every stored value plus the three excluded stages, so the filter shows the whole
  // Stage domain even when no row uses it. A blank Stage appears as "Blank" (D43).
  const stageValues = [...new Set([...model.planned.map(row => row.stage ?? ''), ...EXCLUDED_STAGES])].sort();
  // A blank value is a value: it is listed so the full tick set covers every row. Dropping it would
  // silently hide the rows that carry no value in that column.
  const domain = values => [...new Set(values.map(value => String(value ?? '')))].sort();
  return [
    ['disciplines', 'Discipline', domain([...model.planned.map(row => row.discipline).filter(Boolean), 'Others'])],
    ['stages', 'Stage', stageValues, new Set(stageValues.filter(value => !EXCLUDED_STAGES.has(value)))],
    ['statuses', 'Submission Status', domain(model.submissions.map(row => row.submissionStatus))],
    ['approvals', 'Approval Status', domain(model.submissions.map(row => row.approvalStatus))],
    ['submitters', 'Submitted By', domain(model.submissions.map(row => row.fields['Submitted By']))]
  ];
}
/** Tick every option of every dimension except the three excluded stages. Runs on load, so the
 *  panel state and the dashboard data start in agreement. */
function applyDefaultFilters() {
  for (const [key, , values, defaults] of buildFilterDimensions()) state[key] = new Set(defaults instanceof Set ? defaults : values);
}
function filtersMarkup() {
  filterDimensions = buildFilterDimensions();
  state.defaultStages = filterDimensions.find(([key]) => key === 'stages')[3];
  $('#global-filter-buttons').innerHTML = filterDimensions.map(([key, title, values]) => `<div class="tf-wrap"><button class="tf-btn" id="tfBtn_${key}" title="Applies to all panels — filters the whole dashboard" aria-expanded="false" aria-haspopup="true" aria-controls="tfPanel_${key}">${escapeHtml(title)}<span class="tf-cnt" id="tfCnt_${key}"></span></button><div class="tf-panel" id="tfPanel_${key}" role="group" aria-label="Filter every panel by ${escapeHtml(title.toLowerCase())}" hidden><label class="tf-all"><input type="checkbox" data-filter-all="${key}"> <b>All ${escapeHtml(title)}</b></label><div class="tf-hint">Tick one or more values to narrow every panel.</div><div class="tf-divider"></div><div class="tf-list">${values.map(value => `<label class="tf-item"><input type="checkbox" data-filter="${key}" value="${escapeHtml(value)}"><span>${escapeHtml(value === '' ? 'Blank' : value)}</span></label>`).join('')}</div></div></div>`).join('');
  $('#global-filters').hidden = false;
  $('#search-button').hidden = false;
  $('#warnBtn').hidden = !(model.warnings.length);
  syncFilterControls();
}
function syncFilterControls() {
  for (const [key, , values, defaultValues] of filterDimensions) {
    const set = state[key] instanceof Set ? state[key] : new Set();
    // A dimension can start with a subset ticked (Stage omits the three excluded stages).
    // "Narrowed" therefore compares the ticked set with that default, not with the option count.
    const defaults = defaultValues instanceof Set ? defaultValues : new Set(values);
    const master = document.querySelector(`input[data-filter-all="${key}"]`);
    // Tri-state over the listed values: all ticked → checked, some ticked → indeterminate, none
    // ticked → unchecked. Load sets the tick set from the data, so the master is truthful at once.
    if (master) {
      const on = values.filter(value => set.has(value)).length;
      master.checked = values.length > 0 && on === values.length;
      master.indeterminate = on > 0 && on < values.length;
    }
    for (const input of document.querySelectorAll(`input[data-filter="${key}"]`)) input.checked = set.size > 0 && set.has(input.value);
    // An empty set is a real selection ("none ticked"), so the badge shows 0 instead of vanishing.
    const narrowed = set.size !== defaults.size || [...set].some(value => !defaults.has(value));
    const count = document.getElementById(`tfCnt_${key}`);
    if (count) count.textContent = narrowed ? String(set.size) : '';
    const button = document.getElementById(`tfBtn_${key}`);
    if (button) button.classList.toggle('is-filtered', narrowed);
  }
}
function closeFilterPanels() {
  for (const [key] of filterDimensions) {
    const panel = document.getElementById(`tfPanel_${key}`);
    const button = document.getElementById(`tfBtn_${key}`);
    if (panel) panel.hidden = true;
    if (button) button.setAttribute('aria-expanded', 'false');
  }
  const c1Panel = document.getElementById('tfPanel_c1series');
  const c1Btn = document.getElementById('tfBtn_c1series');
  if (c1Panel) c1Panel.hidden = true;
  if (c1Btn) c1Btn.setAttribute('aria-expanded', 'false');
}
/** §7.1 B7 — sync every chooser: pinned rows stay checked and disabled, the master is tri-state
 *  over the free rows, and the footer counts the hidden ones. */
function syncColumnControls() {
  for (const panel of document.querySelectorAll('.column-chooser')) {
    const items = [...panel.querySelectorAll('input[data-column-choice]')];
    for (const input of items.filter(input => input.disabled)) input.checked = true;
    const free = items.filter(input => !input.disabled);
    const on = free.filter(input => input.checked).length;
    const master = panel.querySelector('input[data-column-all]');
    if (master) {
      master.checked = free.length > 0 && on === free.length;
      master.indeterminate = on > 0 && on < free.length;
    }
    const count = panel.querySelector('[data-column-hidden]');
    if (count) count.textContent = `${free.length - on} hidden`;
  }
}
/** §7.1 — close every column chooser and clear its trigger state. */
function closeColumnChoosers() {
  state.openChooser = null;
  for (const panel of document.querySelectorAll('.column-chooser')) panel.hidden = true;
  for (const button of document.querySelectorAll('.cc-btn')) button.setAttribute('aria-expanded', 'false');
}
// §7.2.15 — split header. The <thead> is a fragment above the scroller, so the vertical scrollbar
// can never cover a header cell. One implementation serves every table: the fragment is pinned to
// the body table's rendered width plus the scrollbar width (--ds-sbw holds it), both tables share
// the same colgroup, and the two scroll in lock-step horizontally.
// §7.2.15 — registry of split-header width sync callbacks. The ResizeObserver below covers element
// resizes, but browser zoom (Control + mouse scroll) changes the screen scale and does not always
// re-fire ResizeObserver on every panel; the window and visualViewport resize events DO fire on zoom,
// so we re-run every sync on those too. This keeps the tables following the screen scale.
const splitSyncers = [];
let splitResizeBound = false;
function bindSplitResize() {
  if (splitResizeBound || typeof window === 'undefined') return;
  splitResizeBound = true;
  let raf = 0;
  const run = () => { raf = 0; for (const fn of splitSyncers) { try { fn(); } catch (e) {} } };
  const onResize = () => { if (!raf) raf = requestAnimationFrame(run); };
  window.addEventListener('resize', onResize, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onResize, { passive: true });
    window.visualViewport.addEventListener('scroll', onResize, { passive: true });
  }
}

function wireSplitHeaders(root) {
  splitSyncers.length = 0;
  bindSplitResize();
  for (const card of root.querySelectorAll('.ds-split')) {
    const headTable = card.querySelector('.vheadtab');
    const port = card.querySelector('.vheadwrap');
    const scroll = card.querySelector('.tableScroll');
    const bodyTable = scroll && scroll.querySelector('table.ds-table');
    if (!headTable || !port || !scroll || !bodyTable) continue;
    const headCols = [...headTable.querySelectorAll('colgroup col')].filter(col => !col.classList.contains('ds-gut'));
    const bodyCols = [...bodyTable.querySelectorAll('colgroup col')];
    // Container width as of the last sync. The fit pass below must run when the CONTAINER changed,
    // never when the COLUMNS did: a column drag changes the column sum, and re-fitting on that path
    // scales the width the operator just dragged straight back down, so the resize does not stick.
    let lastAvail = null;
    const syncWidth = () => {
      // Both tables are pinned to the same explicit pixel width, so the frozen header stays aligned
      // with its body column (see §7.2.15). Pinning must not freeze the table at its first-render
      // size: on a container resize, scale the cached column widths to the new width so the table
      // follows the screen. Manual drags keep their ratio; the gutter tracks the scrollbar only.
      const bar = Math.max(0, scroll.offsetWidth - scroll.clientWidth);
      card.style.setProperty('--ds-sbw', `${bar}px`);
      const row = [...bodyTable.querySelectorAll('tbody tr')].find(tr => tr.children.length === bodyCols.length);
      let total = 0;
      headCols.forEach((col, index) => {
        // The first pass takes the body's rendered widths; later passes reuse them, so a repaint or a
        // theme switch does not re-flow the grid.
        let width = parseFloat(col.style.width);
        if (!(width > 0)) {
          const cell = row && row.children[index];
          width = cell ? cell.getBoundingClientRect().width : 0;
        }
        if (!(width > 0)) return;
        col.style.width = `${width}px`;
        if (bodyCols[index]) bodyCols[index].style.width = `${width}px`;
        total += width;
      });
      const avail = scroll.clientWidth - bar;
      // Re-flow on container resize: scale the cached column widths to the new width so the table
      // follows the screen scale / window width instead of keeping its first-render pixel width.
      // Gate on the CONTAINER width, never on the column sum. `null` on the first pass means "fit
      // once on load"; after that only a real container change re-fits, so a manual drag survives.
      // §7.2.15 invariant 5 fits the SHIPPED DEFAULTS, not a width the user chose.
      const containerChanged = lastAvail === null || Math.abs(avail - lastAvail) > 1;
      lastAvail = avail;
      if (total > 0 && containerChanged && Math.abs(avail - total) > 1) {
        const scale = avail / total;
        headCols.forEach((col, index) => {
          const w = parseFloat(col.style.width);
          if (!(w > 0) || !bodyCols[index]) return;
          const nw = Math.max(40, w * scale).toFixed(1);
          col.style.width = `${nw}px`;
          bodyCols[index].style.width = `${nw}px`;
          // Column 0 is pinned; keep the 2nd pinned column's left offset in sync with its new width.
          if (index === 0) {
            headTable.style.setProperty('--pin-first-col', `${nw}px`);
            bodyTable.style.setProperty('--pin-first-col', `${nw}px`);
          }
        });
        total = avail;
      }
      const width = total || avail;
      headTable.style.width = `${width + bar}px`;
      bodyTable.style.width = `${width}px`;
      const gutter = headTable.querySelector('colgroup col.ds-gut');
      if (gutter) gutter.style.width = `${bar}px`;
    };
    const syncScroll = () => { if (port.scrollLeft !== scroll.scrollLeft) port.scrollLeft = scroll.scrollLeft; };
    syncWidth();
    syncScroll();
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(syncWidth);
      observer.observe(scroll);
      observer.observe(bodyTable);
    }
    scroll.addEventListener('scroll', syncScroll, { passive: true });
    splitSyncers.push(syncWidth);
  }
}
// §7.2.16 / I129 — ONE delegated pointer binder owns the table hover crosshair for every tab.
// Stable `data-col-id` values pair split headers / bodies and avoid raw cellIndex; the chart-linked
// `.col-active` column state of C1 and C3 Bar is deliberately left to bindChartHover().
let tableCrosshairBound = false;
let tableCrosshair = { cell: null, scope: null, row: null, cells: [] };
function clearTableCrosshair() {
  const state = tableCrosshair;
  if (!state.cell && !state.row && state.cells.length === 0) return;
  for (const el of state.cells) el.classList.remove('col-hover');
  if (state.row) state.row.classList.remove('row-hover');
  if (state.cell) state.cell.classList.remove('cell-hover');
  tableCrosshair = { cell: null, scope: null, row: null, cells: [] };
}
// §4.2 rev 1.74 / 1.75 / I131 — the C3 chart ↔ attached-table column state is transient. Print,
// repaint, blur and Escape clear it from BOTH the bar plot and the attached table, in both cards.
// §4.2 rev 1.75 also hides the C1-style column band and centre line with the same lifecycle.
function clearC3ColumnSync() {
  document.querySelectorAll('.c3-card .c3-grid .g-bar.col-active,.c3-card .c3-table [data-col-id].col-active')
    .forEach(el => el.classList.remove('col-active'));
  document.querySelectorAll('.c3-card .c3-grid .c3-col-band,.c3-card .c3-grid .c3-col-snap')
    .forEach(el => { el.style.display = 'none'; });
}
function tableCrosshairScope(table) {
  if (table.classList.contains('hist-table') || table.classList.contains('c1-table') || table.classList.contains('c2-ftab') || table.classList.contains('c3-table')) return table;
  return table.closest('.ds-split') || table;
}
function tableCrosshairTables(scope, table) {
  if (scope.classList && scope.classList.contains('ds-split')) {
    return [...scope.querySelectorAll('table[data-table-crosshair]')]
      .filter(t => t.classList.contains('vheadtab') || (t.classList.contains('ds-table') && !t.classList.contains('hist-table')));
  }
  return [scope === table ? table : table];
}
function bindTableCrosshair(root) {
  if (tableCrosshairBound || !root || typeof root.addEventListener !== 'function') return;
  tableCrosshairBound = true;
  const onMove = e => {
    if (e.target && e.target.closest && e.target.closest('.ds-resize')) { clearTableCrosshair(); return; }
    const cell = e.target && e.target.closest ? e.target.closest('td,th') : null;
    const table = cell && cell.closest ? cell.closest('table[data-table-crosshair]') : null;
    if (!cell || !table) { clearTableCrosshair(); return; }
    const row = cell.parentElement;
    if (!row || cell.classList.contains('ds-gut') || cell.classList.contains('empty') ||
        row.classList.contains('win-pad') || row.classList.contains('sub')) { clearTableCrosshair(); return; }
    const scope = tableCrosshairScope(table);
    if (tableCrosshair.cell === cell && tableCrosshair.scope === scope) return;
    clearTableCrosshair();
    const id = cell.getAttribute('data-col-id');
    // §4.2 rev 1.74 / I131 — C1 and C3 Bar own their column state through .col-active. The
    // generic binder may add .row-hover / .cell-hover but no competing .col-hover.
    const chartLinked = table.classList.contains('c1-table') || table.classList.contains('c3-table');
    const cells = [];
    if (id != null && !chartLinked) {
      for (const t of tableCrosshairTables(scope, table)) {
        t.querySelectorAll(`[data-col-id="${String(id).replace(/"/g, '\\"')}"]`).forEach(el => {
          // A body <td> can contain a nested history table. Only cells owned by THIS table
          // fragment belong to the logical column; nested tables keep their own crosshair scope.
          if (el.closest('table[data-table-crosshair]') !== t) return;
          el.classList.add('col-hover'); cells.push(el);
        });
      }
    }
    const isHeader = !!row.closest('thead') || row.classList.contains('hist-head');
    if (!isHeader) row.classList.add('row-hover');
    cell.classList.add('cell-hover');
    tableCrosshair = { cell, scope, row: isHeader ? null : row, cells };
  };
  const onOut = e => {
    const from = e.target && e.target.closest ? e.target.closest('table[data-table-crosshair]') : null;
    if (!from) return;
    const to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('table[data-table-crosshair]') : null;
    if (to === from || (to && tableCrosshairScope(to) === tableCrosshairScope(from))) return;
    clearTableCrosshair();
  };
  root.addEventListener('pointermove', onMove, { passive: true });
  root.addEventListener('pointerout', onOut, { passive: true });
  root.addEventListener('pointerleave', clearTableCrosshair, { passive: true });
  const clearAll = () => { clearTableCrosshair(); clearC3ColumnSync(); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearAll(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') clearAll(); });
  window.addEventListener('blur', clearAll);
  window.addEventListener('beforeprint', clearTableCrosshair);
  window.addEventListener('beforeprint', clearC3ColumnSync);
}

// ===== C1 attached table: re-render the curve at the measured panel width (spec §3.4.1) =====
// The static HTML already shows the whole curve through its viewBox. This pass replaces nominal W
// with the measured width of .c1-plot, so one SVG unit is one CSS pixel and no text is scaled down.
// The curve still fits completely in the card. data-geo.W and every data-points[].cx are rewritten
// in the same pass, so the nearest-datum hover snap line stays on its month column.
let c1Observer = null;
let c1ResizeBound = false;
let c1Raf = 0;
function c1Refit(scope) {
  const root = scope || document;
  const board = root.querySelector && root.querySelector('.scurve.sc-board');
  if (!board) return;
  const grid = board.querySelector('.c1-grid');
  const plot = grid && grid.querySelector('.c1-plot');
  const svg = plot && plot.querySelector('svg.scurve-svg');
  if (!grid || !plot || !svg) return;
  let pts = [], meta = {};
  try { pts = JSON.parse((board.getAttribute('data-points') || '[]').replace(/&#39;/g, "'")); } catch (_) {}
  try { meta = JSON.parse((board.getAttribute('data-c1meta') || '{}').replace(/&#39;/g, "'")); } catch (_) {}
  if (!pts.length) return;
  const W = Math.round(plot.getBoundingClientRect().width);
  if (!(W > 0)) return;
  if (Math.abs(W - Number(board.getAttribute('data-c1w') || 0)) < 2) return;
  const built = c1PlotSvg(pts, meta, W);
  // Keep the very same .chart-snap node: bindChartHover holds a reference to it.
  const snap = svg.querySelector('.chart-snap');
  svg.setAttribute('viewBox', `0 0 ${built.W} ${built.H}`);
  // CSS height:auto derives the intrinsic ratio from the width/height attributes, not the
  // viewBox. Keep all three in sync: a stale pair makes xMidYMid meet letterbox the plot,
  // so every bar, dot and data-points.cx drifts away from its month column.
  svg.setAttribute('width', String(built.W));
  svg.setAttribute('height', String(built.H));
  // §4.2 rev 1.63 — built.inner carries a fresh .sc-hover-band at W / N. The binder queries it
  // fresh; drop the stale column classes because the rebuilt band starts hidden.
  svg.innerHTML = built.inner;
  grid.querySelectorAll('.c1-table [data-c1col].col-active').forEach(el => el.classList.remove('col-active'));
  if (snap) {
    // §4.2 rev 1.62 — yTop now depends on the wrapped legend row count, so the reused
    // .chart-snap node's Y span must be refreshed too. bindChartHover only updates x1/x2.
    snap.setAttribute('y1', String(built.yTop));
    snap.setAttribute('y2', String(built.yBot));
    svg.appendChild(snap);
  }
  const next = pts.map((p, i) => ({ ...p, cx: +((i + 0.5) * built.W / pts.length).toFixed(1) }));
  board.setAttribute('data-points', JSON.stringify(next).replace(/'/g, '&#39;'));
  board.setAttribute('data-geo', JSON.stringify({ W: built.W, yTop: built.yTop, yBot: built.yBot }).replace(/'/g, '&#39;'));
  board.setAttribute('data-c1w', String(built.W));
  grid.style.setProperty('--c1-cols', String(pts.length));
  grid.style.setProperty('--c1-gutter', `${Number(meta.gutter) || 104}px`);
  const colgroup = grid.querySelector('.c1-table colgroup');
  if (colgroup) colgroup.innerHTML = `<col class="c1-gut" style="width:var(--c1-gutter)">${'<col>'.repeat(pts.length)}`;
  // §4.2 rev 1.64 — the legend can wrap to a different number of rows at a new width, which
  // changes the viewBox height. Regenerate the HTML Y ticks from the SAME data-c1meta payload as
  // the SVG: one label per grid line, values = g × yStep, positions derived from yMax.
  const yMax = Number(meta.yMax) || 1;
  const yStep = Number(meta.yStep) > 0 ? Number(meta.yStep) : yMax / 4;
  const yIntervals = Math.max(1, Math.min(7, Number(meta.yIntervals) > 0
    ? Math.round(Number(meta.yIntervals)) : Math.max(1, Math.round(yMax / yStep))));
  const axis = grid.querySelector('.c1-yaxis');
  if (axis) {
    axis.querySelectorAll('.c1-ytick').forEach(el => el.remove());
    for (let g = yIntervals; g >= 0; g--) {
      const value = g * yStep;
      const span = document.createElement('span');
      span.className = 'c1-ytick';
      const y = built.yBot - (value / yMax) * (built.yBot - built.yTop);
      span.style.top = `${(y / built.H * 100).toFixed(3)}%`;
      span.textContent = String(Math.round(value));
      axis.appendChild(span);
    }
  }
}
function wireC1Grid(root) {
  if (c1Observer) { c1Observer.disconnect(); c1Observer = null; }
  const scope = root || document;
  const plot = scope.querySelector && scope.querySelector('.c1-plot');
  c1Refit(scope);
  if (plot && typeof ResizeObserver === 'function') {
    c1Observer = new ResizeObserver(() => {
      if (c1Raf) return;
      c1Raf = requestAnimationFrame(() => { c1Raf = 0; c1Refit(document); });
    });
    c1Observer.observe(plot);
  }
  if (!c1ResizeBound && typeof window !== 'undefined') {
    c1ResizeBound = true;
    const onResize = () => c1Refit(document);
    window.addEventListener('resize', onResize, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', onResize, { passive: true });
  }
}
// §4.2 rev 1.66 / I121 — a visual-only sync for the single dual-handle period track.
// It never rebuilds the chart. The `change` listener performs the one full repaint.
function c1SyncTimeBar() {
  const bar = document.querySelector('#c1TimeBar');
  if (!bar) return;
  let months = [];
  try { months = JSON.parse(bar.dataset.c1months || '[]'); } catch { return; }
  const n = months.length;
  if (!n) return;
  const fromEl = bar.querySelector('input[data-c1period="from"]');
  const toEl = bar.querySelector('input[data-c1period="to"]');
  const fill = bar.querySelector('.c1-ts-fill');
  const text = bar.querySelector('.c1-period-text');
  if (!fromEl || !toEl || !fill || !text) return;
  const last = n - 1, denom = Math.max(1, last);
  const posPct = i => `calc(var(--c1-thumb) / 2 + (100% - var(--c1-thumb)) * ${(i / denom).toFixed(6)})`;
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const label = ym => {
    const [y, m] = String(ym || '').split('-').map(Number);
    return `${names[m - 1] || ''} ${y || ''}`.trim() || String(ym || '');
  };
  let f = Math.max(0, Math.min(Number(fromEl.value) || 0, last));
  let t = Math.max(0, Math.min(Number(toEl.value) || 0, last));
  if (f > t) { if (document.activeElement === fromEl) t = f; else f = t; }
  fromEl.value = String(f);
  toEl.value = String(t);
  fromEl.setAttribute('aria-valuetext', label(months[f]));
  toEl.setAttribute('aria-valuetext', label(months[t]));
  // Lift the `from` thumb above the `to` thumb when the two handles are close.
  fromEl.style.zIndex = (t - f <= 1) ? '5' : '';
  fill.style.left = posPct(f);
  fill.style.width = `calc((100% - var(--c1-thumb)) * ${((t - f) / denom).toFixed(6)})`;
  bar.querySelectorAll('.c1-ts-tick[data-c1month]').forEach(el => {
    const i = Number(el.dataset.c1month);
    el.classList.toggle('is-active', i >= f && i <= t);
    el.classList.toggle('is-near', i === f || i === t);
  });
  text.textContent = `${label(months[f])} – ${label(months[t])}`;
  // §4.2 rev 1.67 — ONE stored selection, never a derived range match.
  bar.querySelectorAll('[data-c1preset]').forEach(chip => {
    const on = chip.dataset.c1preset === state.c1Preset;
    chip.setAttribute('aria-pressed', String(on));
    chip.classList.toggle('active', on);
  });
}
function paint() {
  if (!model) return;
  clearTableCrosshair();
  clearC3ColumnSync();
  $('[data-page-content]').hidden = false;
  const scrollEl = document.querySelector('.content-body');
  const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
  document.body.classList.add('loaded');
  const view = renderDashboard(document, model, { ...state, uiHelp });
  if (scrollEl) scrollEl.scrollTop = scrollTop;
  wireSplitHeaders(document);
  wireC1Grid(document);
  c1SyncTimeBar();
  document.querySelectorAll('[data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === state.page));
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = state.page;
  const ttl = document.querySelector('.ttl');
  if (ttl) ttl.textContent = model.meta.projectTitle || model.meta.mdlWorkbookName || 'Dashboard';
  const ttlSub = document.getElementById('ttl-sub');
  if (ttlSub) { ttlSub.textContent = model.meta.dashboardTitle || ''; ttlSub.hidden = !model.meta.dashboardTitle; }
  const ttlMeta = document.querySelector('.ttl-stack .meta');
  if (ttlMeta) ttlMeta.textContent = `Project start ${model.meta.projectStartDate || '—'} · as of ${model.meta.asOfDate || '—'}`;
  $('#status-files').textContent = `MDL: ${files.mdl?.name || '—'} · Log: ${files.log?.name || '—'} · ${view.kpis.totalPlanned.toLocaleString()} planned rows`;
  showWarnings();
  syncColumnControls();
  syncExportButtons();
  updateTheme();
  updateLayout();
}
async function readAndBuild() {
  if (!files.mdl || !files.log) { setStatus('Select both workbooks.'); return; }
  for (const id of ['welcome-load', 'load-button-menu']) { const button = document.getElementById(id); if (button) button.disabled = true; }
  setStatus('Reading workbooks…');
  const welcomeErr = document.getElementById('welcomeErr');
  if (welcomeErr) welcomeErr.hidden = true;
  try {
    const [mdlBuffer, logBuffer] = await Promise.all([files.mdl.arrayBuffer(), files.log.arrayBuffer()]);
    const [mdlWorkbook, logWorkbook] = await Promise.all([readXlsx(mdlBuffer), readXlsx(logBuffer)]);
    model = buildModel(mdlWorkbook, logWorkbook, { contract, mdlWorkbookName: files.mdl.name, logWorkbookName: files.log.name });
    // Every dimension starts with its full tick set, so the filter panels and the dashboard data
    // agree on the first paint (Stage keeps its three excluded values unticked).
    applyDefaultFilters();
    if (state.rememberNames) localStorage.setItem('sub-dashboard-file-names', JSON.stringify({ mdl: files.mdl.name, log: files.log.name }));
    filtersMarkup();
    paint();
    setStatus(uiHelp?.labels?.statusReady || 'Both workbooks loaded.');
  } catch (error) {
    model = null;
    document.body.classList.remove('loaded');
    $('[data-page-content]').innerHTML = '';
    setStatus('Load failed. Review the message on the welcome screen.');
    const err = document.getElementById('welcomeErr');
    err.hidden = false;
    err.textContent = error.message;
  } finally { updateFiles(); }
}

async function inspectFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = await readXlsx(buffer, { only: [contract.mdl.codeSheet, contract.submittalLog.codeSheet] });
  return inspectWorkbook(workbook, contract);
}
function rejectSelection(reason) {
  setStatus(reason);
  const err = document.getElementById('welcomeErr');
  if (err) { err.hidden = false; err.textContent = reason; }
}
async function acceptSelection(picked) {
  if (!picked.length) return;
  const err = document.getElementById('welcomeErr');
  if (err) { err.hidden = true; err.textContent = ''; }
  const pickState = document.getElementById('pick-state');
  if (pickState) pickState.textContent = 'Checking workbooks…';
  const inspected = [];
  for (const file of picked) {
    try {
      inspected.push({ file, ...(await inspectFile(file)) });
    } catch (error) {
      inspected.push({ file, ok: false, reason: `"${file.name}" could not be read as an Excel workbook. ${error.message}` });
    }
  }
  const failed = inspected.find(item => !item.ok);
  if (failed) { rejectSelection(failed.reason); updateFiles(); return; }
  if (inspected.length > 1 && new Set(inspected.map(item => item.kind)).size === 1) {
    rejectSelection(`Both files are "${inspected[0].dashboardTitle}". Choose one ${contract.mdl.dashboardTitle} and one ${contract.submittalLog.dashboardTitle}.`);
    updateFiles();
    return;
  }
  const nextFiles = { mdl: files.mdl, log: files.log };
  const nextInfo = { mdl: fileInfo.mdl, log: fileInfo.log };
  for (const item of inspected) {
    nextFiles[item.kind] = item.file;
    nextInfo[item.kind] = { dashboardTitle: item.dashboardTitle, projectTitle: item.projectTitle };
  }
  const mdlProject = nextInfo.mdl?.projectTitle;
  const logProject = nextInfo.log?.projectTitle;
  if (mdlProject && logProject && mdlProject !== logProject) {
    rejectSelection(`Project mismatch: "${mdlProject}" and "${logProject}". Both workbooks must belong to the same project.`);
    updateFiles();
    return;
  }
  files.mdl = nextFiles.mdl;
  files.log = nextFiles.log;
  fileInfo.mdl = nextInfo.mdl;
  fileInfo.log = nextInfo.log;
  updateFiles();
}

window._loadFiles = async (mdlFile, logFile) => { files = { mdl: mdlFile, log: logFile }; fileInfo = { mdl: null, log: null }; updateFiles(); await readAndBuild(); };
window._loadFile = async file => {
  if (/master document list/i.test(file.name)) files.mdl = file;
  else if (/submittal log/i.test(file.name)) files.log = file;
  updateFiles();
  if (files.mdl && files.log) await readAndBuild();
};

function openModal(id) { const modal = document.getElementById(id); if (modal) modal.hidden = false; }
function closeModal(id) { const modal = document.getElementById(id); if (modal) modal.hidden = true; }
function helpHtml() {
  const copy = uiHelp?.pages || {};
  const glossary = uiHelp?.statusGlossary || {};
  let html = `<p>${escapeHtml(copy.Help || 'Load both workbooks and use the shared filters.')}</p>`;
  html += `<p>${escapeHtml(uiHelp?.filePanel?.instructions || '')}</p>`;
  if (model) html += `<p>Source files: ${escapeHtml(model.meta.mdlWorkbookName)} and ${escapeHtml(model.meta.logWorkbookName)}.</p>`;
  const entries = Object.entries(glossary).flatMap(([group, items]) => Object.entries(items).map(([code, label]) => `<p><b>${escapeHtml(group)} · ${escapeHtml(code)}</b> — ${escapeHtml(label)}</p>`)).join('');
  if (entries) html += `<h3>Status glossary</h3>${entries}`;
  return html;
}

// §4.4 — standardized drill-down (I068): the .drill-btn is the control (aria-expanded +
// aria-controls); the .expandable row is a pointer shortcut; only one .sub detail is open (accordion).
function toggleDrill(row, btn) {
  if (!row) return;
  const detail = row.nextElementSibling;
  if (!detail || !detail.classList.contains('sub')) return;
  const willOpen = detail.hidden;
  const table = row.closest('table');
  table?.querySelectorAll('tr.sub').forEach(other => {
    if (other === detail || other.hidden) return;
    other.hidden = true;
    const control = other.previousElementSibling?.querySelector('.drill-btn');
    if (control) control.setAttribute('aria-expanded', 'false');
  });
  detail.hidden = !willOpen;
  const control = btn || row.querySelector('.drill-btn');
  if (control) control.setAttribute('aria-expanded', String(willOpen));
}
document.addEventListener('keydown', event => {
  // §7.1 — Escape closes any open floating panel.
  if (event.key === 'Escape') {
    closeFilterPanels();
    closeColumnChoosers();
    const searchPanel = document.getElementById('searchPanel');
    if (searchPanel?.classList.contains('open')) { searchPanel.classList.remove('open'); document.getElementById('search-button')?.setAttribute('aria-expanded', 'false'); }
    return;
  }
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const row = event.target.closest?.('tr.expandable');
  if (!row || event.target.closest?.('.drill-btn')) return;
  event.preventDefault();
  toggleDrill(row, row.querySelector('.drill-btn'));
});
// §7.1 — a click outside a floating panel closes it. This runs before the button handler below and
// covers every target, not only buttons, so a click on plain text or a table cell also closes it.
document.addEventListener('click', event => {
  const target = event.target;
  if (!target.closest?.('.tf-panel') && !target.closest?.('.tf-btn') && !target.closest?.('.search-panel') && !target.closest?.('#search-button')) closeFilterPanels();
  if (state.openChooser && !target.closest?.('.column-chooser') && !target.closest?.('.cc-btn')) closeColumnChoosers();
});
// I133 — `Breakdown` sits directly below `Overview` in the sidebar and in this whitelist.
const NAV_PAGES = new Set(['Overview', 'Breakdown', 'Submittals', 'Validation', 'Forward and Overdue', 'Analytical', 'Help', 'Settings']);
document.addEventListener('click', async event => {
  const target = event.target.closest('button, tr.expandable');
  if (!target) return;
  if (target.dataset.page && NAV_PAGES.has(target.dataset.page)) { state.page = target.dataset.page; paint(); }
  if (target.dataset.shellToggle) document.body.classList.toggle(`closed-${target.dataset.shellToggle}`);
  if (target.id === 'settings-button') openModal('settings-modal');
  if (target.id === 'help-button') { $('#help-body').innerHTML = helpHtml(); openModal('help-modal'); }
  if (target.dataset.close) closeModal(target.dataset.close);
  if (target.id === 'load-button-menu') { if (files.mdl && files.log) await readAndBuild(); else $('#file-pair').click(); }
  if (target.id === 'welcome-load') await readAndBuild();
  if (target.classList.contains('choose-workbooks')) $('#file-pair').click();
  // §4.1 — the collapse toggle belongs to the panel; its state is kept in `state` so a re-render
  // restores it rather than snapping the panel back open.
  if (target.dataset.panelToggle) {
    const name = target.dataset.panelToggle;
    const index = state.collapsedPanels.indexOf(name);
    if (index >= 0) state.collapsedPanels.splice(index, 1); else state.collapsedPanels.push(name);
    paint();
  }
  if (target.id === 'search-button') { $('#searchPanel').classList.toggle('open'); target.setAttribute('aria-expanded', String($('#searchPanel').classList.contains('open'))); }
  if (target.classList?.contains('cc-btn')) {
    const key = target.id.replace('ccBtn_', '');
    const open = state.openChooser !== key;
    state.openChooser = open ? key : null;
    const panel = document.getElementById(target.getAttribute('aria-controls'));
    if (panel) panel.hidden = !open;
    target.setAttribute('aria-expanded', String(open));
    syncColumnControls();
  }
  if (target.dataset.columnReset) {
    const key = target.dataset.columnReset;
    state.columnSets = { ...state.columnSets, [key]: null };
    localStorage.removeItem(`sub_dashboard_${key}_cols`);
    state.openChooser = key;
    paint();
    return;
  }
  // §4.4 — standardized drill-down (I068): button is the control, row is a pointer shortcut.
  if (target.classList?.contains('drill-btn')) {
    toggleDrill(target.closest('tr.expandable'), target);
  } else if (target.classList?.contains('expandable')) {
    toggleDrill(target, target.querySelector('.drill-btn'));
  }
  if (target.classList?.contains('tf-btn')) {
    const panel = document.getElementById(target.getAttribute('aria-controls'));
    const open = !panel || panel.hidden;
    closeFilterPanels();
    if (panel && open) { panel.hidden = false; target.setAttribute('aria-expanded', 'true'); }
  } else if (!target.closest?.('.tf-panel')) { closeFilterPanels(); }
  // §7.1 — the listener above already closed an outside-click chooser; this keeps button clicks in step.
  if (state.openChooser && !target.classList?.contains('cc-btn') && !target.closest?.('.column-chooser')) closeColumnChoosers();
  if (target.id !== 'search-button' && !target.closest?.('#searchPanel')) {
    const searchPanel = document.getElementById('searchPanel');
    if (searchPanel?.classList.contains('open')) { searchPanel.classList.remove('open'); document.getElementById('search-button')?.setAttribute('aria-expanded', 'false'); }
  }
  if (target.id === 'warnBtn') { state.showWarnings = !state.showWarnings; localStorage.setItem('sub-dashboard-warnings', String(state.showWarnings)); showWarnings(); }
  if (target.id === 'fGo') { state.search = $('#fSearch').value; state.searchCol = $('#fCol').value; paint(); $('#searchPanel').classList.remove('open'); $('#search-button').setAttribute('aria-expanded', 'false'); }
  if (target.id === 'fReset') { state.search = ''; $('#fSearch').value = ''; paint(); }
  if (target.dataset.c1grain) { state.c1Grain = target.dataset.c1grain; closeFilterPanels(); paint(); }
  if (target.hasAttribute('data-c1bars')) { state.c1Bars = !state.c1Bars; paint(); }
  if (target.dataset.c1preset) {
    const bar = document.querySelector('#c1TimeBar');
    if (bar) {
      let months = [];
      try { months = JSON.parse(bar.dataset.c1months || '[]'); } catch { months = []; }
      const toEl = bar.querySelector('input[data-c1period="to"]');
      const anchor = toEl ? Number(toEl.value) : Math.max(0, months.length - 1);
      const range = c1PresetRange(target.dataset.c1preset, months, anchor, bar.dataset.c1asof);
      if (range) { state.c1Period = range; state.c1Preset = target.dataset.c1preset; paint(); }
    }
  }
  if (target.hasAttribute('data-c1png')) { exportC1Png(); }
  if (target.hasAttribute('data-c1copy')) { copyC1Svg(); }
  if (target.dataset.c3dim) { c3SetPanel(target.dataset.c3panel, { c3Dim: target.dataset.c3dim }); paint(); }
  if (target.dataset.c3view) { c3SetPanel(target.dataset.c3panel, { c3View: target.dataset.c3view }); paint(); }
  if (target.hasAttribute('data-c3png')) { exportC3Png(target); }
  if (target.hasAttribute('data-c3copy')) { copyC3Svg(target); }
  if (target.classList?.contains('pg-btn')) {
    const p = target.dataset.pg;
    if (p === 'prev') state.issuePage = Math.max(1, (state.issuePage || 1) - 1);
    else if (p === 'next') state.issuePage = (state.issuePage || 1) + 1;
    paint();
  }
  if (target.dataset.c2view) { state.c2View = target.dataset.c2view; paint(); }
  if (target.hasAttribute('data-c2nfs')) { state.c2Nfs = state.c2Nfs === false ? true : false; paint(); }
  if (target.hasAttribute('data-c2png')) { exportC2Png(); }
  if (target.hasAttribute('data-c2copy')) { copyC2Svg(); }
  if (target.dataset.foView) { state.foView = target.dataset.foView; paint(); }
  if (target.dataset.foLane) { state.foLane = target.dataset.foLane; paint(); }
  if (target.dataset.foHorizon) { state.foHorizon = target.dataset.foHorizon; paint(); }
  if (target.dataset.c4view) { state.c4View = target.dataset.c4view; paint(); }
  // I145 — the top menu button writes one workbook with one worksheet per table.
  if (target.hasAttribute('data-export')) exportAllTablesXlsx();
  const csvKey = target.getAttribute('data-export-csv');
  if (csvKey) exportTableCsv(csvKey);
});
document.addEventListener('click', event => { if (event.target.classList?.contains('modal')) closeModal(event.target.id); });
function openC1SeriesPopup() {
  const panel = document.getElementById('tfPanel_c1series');
  const btn = document.getElementById('tfBtn_c1series');
  if (panel) panel.hidden = false;
  if (btn) btn.setAttribute('aria-expanded', 'true');
}
document.addEventListener('change', async event => {
  const { filter, setting } = event.target.dataset;
  if (event.target.dataset.columnChoice) {
    const key = event.target.dataset.columnChoice;
    const table = document.querySelector(`[data-table-key="${key}"]`);
    const max = Number(table?.dataset.columnCount) || table?.querySelectorAll('thead th[data-col]').length || 0;
    const selected = new Set(state.columnSets?.[key] || Array.from({ length: max }, (_, index) => index));
    const index = Number(event.target.dataset.columnIndex);
    if (event.target.checked) selected.add(index); else selected.delete(index);
    state.columnSets = { ...state.columnSets, [key]: [...selected].sort((a, b) => a - b) };
    localStorage.setItem(`sub_dashboard_${key}_cols`, JSON.stringify(state.columnSets[key]));
    state.openChooser = key; // §7.1 — a tick must not close the panel
    paint();
    return;
  }
  if (event.target.dataset.columnAll) {
    const key = event.target.dataset.columnAll;
    const table = document.querySelector(`[data-table-key="${key}"]`);
    const max = Number(table?.dataset.columnCount) || 0;
    const all = Array.from({ length: max }, (_, index) => index);
    // §7.1 master scope: the pinned identity columns stay on, so "off" keeps them in the set.
    state.columnSets = { ...state.columnSets, [key]: event.target.checked ? all : all.filter(index => index < 2) };
    localStorage.setItem(`sub_dashboard_${key}_cols`, JSON.stringify(state.columnSets[key]));
    state.openChooser = key;
    paint();
    return;
  }
  if (event.target.hasAttribute('data-vcode')) { state.issueCode = event.target.value; state.issuePage = 1; paint(); return; }
  if (event.target.dataset.pagejump) { state.issuePage = Number(event.target.value) || 1; paint(); return; }
  const filterAll = event.target.dataset.filterAll;
  if (filterAll) {
    const dimension = filterDimensions.find(([key]) => key === filterAll);
    if (dimension) { state[filterAll] = event.target.checked ? new Set(dimension[2]) : new Set(); syncFilterControls(); paint(); }
    return;
  }
  if (filter) {
    const dimension = filterDimensions.find(([key]) => key === filter);
    if (!dimension) return;
    const set = state[filter] instanceof Set ? new Set(state[filter]) : new Set();
    if (event.target.checked) set.add(event.target.value); else set.delete(event.target.value);
    state[filter] = set;
    syncFilterControls();
    paint();
  }
  if (event.target.hasAttribute('data-c1series-all')) {
    const all = ['plan', 'forecast', 'actualFirst', 'actualResub'];
    state.c1Series = event.target.checked ? new Set(all) : new Set();
    paint();
    openC1SeriesPopup();
    return;
  }
  if (event.target.dataset.c1series) {
    const all = ['plan', 'forecast', 'actualFirst', 'actualResub'];
    const set = state.c1Series instanceof Set ? new Set(state.c1Series) : new Set(all);
    if (event.target.checked) set.add(event.target.dataset.c1series); else set.delete(event.target.dataset.c1series);
    state.c1Series = set;
    paint();
    openC1SeriesPopup();
    return;
  }
  if (event.target.dataset.c1period) {
    const fromEl = document.querySelector('input[data-c1period="from"]');
    const toEl = document.querySelector('input[data-c1period="to"]');
    if (!fromEl || !toEl) return;
    let f = Number(fromEl.value), t = Number(toEl.value);
    if (f > t) { if (event.target.dataset.c1period === 'from') { t = f; toEl.value = String(t); } else { f = t; fromEl.value = String(f); } }
    state.c1Period = [f, t];
    // §4.2 rev 1.67 — a handle change is a custom range, so no preset stays active.
    state.c1Preset = null;
    paint();
    return;
  }
  if (event.target.hasAttribute('data-c3month')) { c3SetPanel(event.target.dataset.c3panel, { c3Month: event.target.value }); paint(); return; }
  if (event.target.hasAttribute('data-submonth')) { state.subMonth = event.target.value; paint(); return; }
  if (setting === 'theme') { state.theme = event.target.value; paint(); }
  if (setting === 'layout') { state.layout = event.target.value; updateLayout(); }
  if (setting === 'showWarnings') { state.showWarnings = event.target.checked; showWarnings(); }
  if (setting === 'rememberNames') { state.rememberNames = event.target.checked; localStorage.setItem('sub-dashboard-remember-names', String(state.rememberNames)); }
  if (event.target.id === 'file-pair') {
    const chosen = [...event.target.files];
    event.target.value = '';
    await acceptSelection(chosen);
  }
});
document.addEventListener('input', event => {
  if (event.target.id === 'fSearch') state.search = event.target.value;
  // §4.2 rev 1.66 — drag updates only the track visuals. `change` performs the full repaint.
  // §4.2 rev 1.67 — a manual drag clears the preset at once, so no chip claims a custom range.
  if (event.target.dataset.c1period) { state.c1Preset = null; c1SyncTimeBar(); }
});
document.addEventListener('change', event => { if (event.target.id === 'fCol') state.searchCol = event.target.value; });
document.addEventListener('pointerdown', event => {
  const grip = event.target.closest('.ds-resize');
  if (grip) {
    event.preventDefault();
    const table = grip.closest('table');
    // §7.2.15 — the grips sit in the header fragment, so a drag has to write the same column in the
    // paired body table or the two halves drift apart.
    const pair = table.classList.contains('vheadtab') ? table.closest('.splitcard') : null;
    const bodyTable = pair ? pair.querySelector('.tableScroll table.ds-table') : null;
    const colIndex = Number(grip.dataset.col);
    const col = table.querySelector(`col[data-col="${colIndex}"]`);
    const bodyCol = bodyTable ? bodyTable.querySelector(`col[data-col="${colIndex}"]`) : null;
    const startX = event.clientX;
    const startWidth = col.getBoundingClientRect().width;
    const widths = JSON.parse(localStorage.getItem(`sub_dashboard_${table.dataset.tableKey}_widths`) || '{}');
    const saveWidths = () => localStorage.setItem(`sub_dashboard_${table.dataset.tableKey}_widths`, JSON.stringify(widths));
    // Fixed layout hands any slack between the column sum and the table width back to the columns, so
    // the table width has to follow the columns; otherwise the rendered width drifts away from the
    // width the operator dragged, and a drag by +d then −d does not land where it started.
    const relayout = () => {
      for (const item of [table, bodyTable]) {
        if (!item) continue;
        const total = [...item.querySelectorAll('colgroup col')]
          .reduce((sum, cell) => sum + (parseFloat(cell.style.width) || 0), 0);
        if (total > 0) item.style.width = `${total}px`;
      }
    };
    const move = pointer => {
      const width = Math.max(60, startWidth + pointer.clientX - startX);
      col.style.width = `${width}px`;
      if (bodyCol) bodyCol.style.width = `${width}px`;
      if (colIndex === 0) {
        table.style.setProperty('--pin-first-col', `${width}px`);
        if (bodyTable) bodyTable.style.setProperty('--pin-first-col', `${width}px`);
      }
      relayout();
      widths[colIndex] = width;
      saveWidths();
    };
    const end = () => { document.removeEventListener('pointermove', move); saveWidths(); };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end, { once: true });
    return;
  }
  const handle = event.target.closest('[data-shell-resize]');
  if (!handle) return;
  event.preventDefault();
  const side = handle.dataset.shellResize;
  const startX = event.clientX;
  const pane = document.querySelector(`[data-shell="${side}"]`);
  const startWidth = pane.getBoundingClientRect().width;
  const move = pointer => updateSidebarWidth(startWidth + (side === 'left-sidebar' ? pointer.clientX - startX : startX - pointer.clientX));
  const end = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', end); };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', end, { once: true });
});
document.addEventListener('dragover', event => { if (event.target.closest('#welcome-screen') || event.target.closest('.app-menu')) event.preventDefault(); });
document.addEventListener('drop', async event => { if (!event.target.closest('#welcome-screen') && !event.target.closest('.app-menu')) return; event.preventDefault(); await acceptSelection([...event.dataTransfer.files]); });

try {
  contract = JSON.parse(document.getElementById('pipeline-contract').textContent);
  uiHelp = JSON.parse(document.getElementById('ui-help').textContent);
  state.rememberNames = localStorage.getItem('sub-dashboard-remember-names') === 'true';
}
catch (error) {
  setStatus(error.message);
  const welcomeErr = document.getElementById('welcomeErr');
  if (welcomeErr) { welcomeErr.hidden = false; welcomeErr.textContent = `Startup failed: ${error.message}`; }
}
document.documentElement.dataset.theme = state.theme;
updateLayout();
const savedWidth = Number(localStorage.getItem('sub-dashboard-left-sidebar-width'));
if (savedWidth) updateSidebarWidth(savedWidth);
updateFiles();
bindTableCrosshair(document);
