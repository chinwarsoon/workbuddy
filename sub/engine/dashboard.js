// Revision 2.3 | 2026-10-24 | CodeBuddy (AI) | D33: the Stage filter lists (blank) plus Deleted, Void and Superseded, and its badge is measured against the default ticked set.
// Revision 2.2 | 2026-10-24 | CodeBuddy (AI) | Option B shell (MDL two-row header + left nav sidebar). Engine contract unchanged; UI handlers rewired to menu bar + modals.
import { readXlsx } from './xlsx-reader.js';
import { buildModel, inspectWorkbook } from './pipeline.js';
import { deriveView, renderDashboard, EXCLUDED_STAGES } from './render.js';

const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const state = { page: 'Overview', theme: localStorage.getItem('sub-dashboard-theme') || 'light', search: '', searchCol: 'all', disciplines: new Set(), stages: new Set(), statuses: new Set(), approvals: new Set(), submitters: new Set(), showWarnings: localStorage.getItem('sub-dashboard-warnings') !== 'false', rememberNames: false, columnSets: {}, c1Grain: 'month', c1Bars: true, c1Series: new Set(['plan', 'forecast', 'actualFirst', 'actualResub']), c1Period: null, c3Month: 'ALL', c3Dim: 'discipline', c3View: 'bar', c2View: 'stacked', c2Nfs: true, collapsedPanels: [] };
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
  const min = 140, max = 460;
  const value = Math.max(min, Math.min(max, width));
  document.documentElement.style.setProperty('--sidebar-w', `${value}px`);
  localStorage.setItem('sub-dashboard-left-sidebar-width', String(value));
}
function updateTheme() { document.documentElement.dataset.theme = state.theme; localStorage.setItem('sub-dashboard-theme', state.theme); $('select[data-setting="theme"]') && ($('select[data-setting="theme"]').value = state.theme); }
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
  const plan = v('--color-plan'), forecast = v('--color-forecast'), actual = v('--color-actual'), border = v('--border'), text = v('--text'), text2 = v('--text2'), text3 = v('--text3'), danger = v('--danger'), slate = v('--slate');
  return `<style>.sc-bar-plan{fill:${plan}}.sc-bar-actual{fill:${actual}}.sc-bar-actualresub{fill:${actual};fill-opacity:.45}.sc-line-plan{stroke:${plan};stroke-width:2.5;fill:none;stroke-dasharray:6 3}.sc-line-forecast{stroke:${forecast};stroke-width:2.5;fill:none;stroke-dasharray:2 2}.sc-line-actual{stroke:${actual};stroke-width:2.5;fill:none}.sc-line-actualresub{stroke:${actual};stroke-width:2.5;fill:none;stroke-dasharray:3 3;opacity:.85}.sc-dot{stroke:none}.sc-dot-plan{fill:${plan}}.sc-dot-forecast{fill:${forecast}}.sc-dot-actual{fill:${actual}}.sc-dot-actualresub{fill:${actual}}.sc-grid{stroke:${border};stroke-width:1}.sc-axis{fill:${text2};font-size:10px}.sc-barval{fill:${text2};font-size:9px}.sc-leg-t{fill:${text}}.sc-ref-start{stroke:${danger};stroke-width:1.5;stroke-dasharray:5 3}.sc-ref-today{stroke:${slate};stroke-width:1.5;stroke-dasharray:2 2}.scurve-snap{stroke:${text3};stroke-width:1;stroke-dasharray:3 3}</style>`;
}
function serializeC1Svg() {
  const svg = document.querySelector('.scurve svg');
  if (!svg) return null;
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.insertAdjacentHTML('afterbegin', chartSvgStyle());
  return new XMLSerializer().serializeToString(clone);
}
function exportC1Png() {
  const svg = document.querySelector('.scurve svg');
  if (!svg) return;
  const str = serializeC1Svg();
  if (!str) return;
  const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const vb = svg.viewBox.baseVal;
    const canvas = document.createElement('canvas');
    canvas.width = vb.width * scale; canvas.height = vb.height * scale;
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
// Reconstruct a C3 Bar card (the HTML grid: bars + vertical axis labels + attached table + legend) as a
// self-contained native SVG (rects + text). Used for PNG/Copy because the Bar card has no <svg> of its own
// (the I057 redesign draws it with a CSS grid). Native SVG (no <foreignObject>) keeps canvas rasterization
// taint-free, so the existing PNG path works in every browser.
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
  body.querySelectorAll('.seg-bar').forEach(b => {
    const r = rb(b), fill = (getComputedStyle(b).backgroundColor || '#888').trim();
    out += `<rect x="${r.x.toFixed(1)}" y="${r.y.toFixed(1)}" width="${r.w.toFixed(1)}" height="${r.h.toFixed(1)}" fill="${fill}" rx="2"/>`;
  });
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
  body.querySelectorAll('.g-axis').forEach(e => placeText(e, true));
  body.querySelectorAll('.g-label, .g-val').forEach(e => placeText(e, false));
  body.querySelectorAll('.c3-leg').forEach(leg => {
    const sw = leg.querySelector('.c3-swatch'), sr = sw && sw.getBoundingClientRect();
    if (sr) out += `<rect x="${(sr.left - root.left - X).toFixed(1)}" y="${(sr.top - root.top - Y).toFixed(1)}" width="${sr.width.toFixed(1)}" height="${sr.height.toFixed(1)}" fill="${(getComputedStyle(sw).backgroundColor || '#888').trim()}" rx="2"/>`;
    const lr = rb(leg), cs = getComputedStyle(leg), lx = sr ? (sr.left - root.left - X + sr.width + 4) : lr.x;
    out += `<text x="${lx.toFixed(1)}" y="${(lr.y + lr.h / 2).toFixed(1)}" text-anchor="start" dominant-baseline="central" font-family="${(cs.fontFamily || 'sans-serif').replace(/"/g, "'")}" font-size="${parseFloat(cs.fontSize) || 11}" fill="${(cs.color || '#222').trim()}">${escSvg(leg.textContent.trim())}</text>`;
  });
  return out + '</svg>';
}
function serializeC3Svg(btn) {
  const scope = btn && btn.closest ? btn.closest('.c3-card') : null;
  const svg = (scope || document).querySelector('svg');
  if (svg) {
    const clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.insertAdjacentHTML('afterbegin', chartC3SvgStyle());
    return new XMLSerializer().serializeToString(clone);
  }
  // Bar view card (no <svg>): rebuild it as a self-contained SVG so PNG/Copy still work.
  return c3CardToSvg(btn);
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
// Download the shared C3 summary table (below the two cards) as CSV. Reads the rendered rows straight
// from the DOM so it stays decoupled from the render data helpers; the .ds-gut scrollbar spacer is skipped.
function exportC3TableCsv() {
  const wrap = document.querySelector('.c3-summary');
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
let filterDimensions = [];
function filtersMarkup() {
  // Stage lists every stored value plus the three excluded stages, so the filter shows the whole
  // Stage domain even when no row uses it. A blank Stage appears as "(blank)".
  const stageValues = [...new Set([...model.planned.map(row => row.stage ?? ''), ...EXCLUDED_STAGES])].sort();
  filterDimensions = [
    ['disciplines', 'Discipline', [...new Set([...model.planned.map(row => row.discipline).filter(Boolean), 'Unknown'])].sort()],
    ['stages', 'Stage', stageValues, new Set(stageValues.filter(value => !EXCLUDED_STAGES.has(value)))],
    ['statuses', 'Submission Status', [...new Set(model.submissions.map(row => row.submissionStatus).filter(Boolean))].sort()],
    ['approvals', 'Approval Status', [...new Set(model.submissions.map(row => row.approvalStatus).filter(Boolean))].sort()],
    ['submitters', 'Submitted By', [...new Set(model.submissions.map(row => row.fields['Submitted By']).filter(Boolean))].sort()]
  ];
  state.defaultStages = filterDimensions.find(([key]) => key === 'stages')[3];
  $('#global-filter-buttons').innerHTML = filterDimensions.map(([key, title, values]) => `<div class="tf-wrap"><button class="tf-btn" id="tfBtn_${key}" title="Applies to all panels — filters the whole dashboard" aria-expanded="false" aria-haspopup="true" aria-controls="tfPanel_${key}">${escapeHtml(title)}<span class="tf-cnt" id="tfCnt_${key}"></span></button><div class="tf-panel" id="tfPanel_${key}" role="group" aria-label="Filter every panel by ${escapeHtml(title.toLowerCase())}" hidden><label class="tf-all"><input type="checkbox" data-filter-all="${key}"> <b>All ${escapeHtml(title)}</b></label><div class="tf-hint">Tick one or more values to narrow every panel.</div><div class="tf-divider"></div><div class="tf-list">${values.map(value => `<label class="tf-item"><input type="checkbox" data-filter="${key}" value="${escapeHtml(value)}"><span>${escapeHtml(value === '' ? '(blank)' : value)}</span></label>`).join('')}</div></div></div>`).join('');
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
    // The master reflects an explicit "every value ticked", so unticking it does not snap back.
    if (master) master.checked = values.length > 0 && set.size >= values.length;
    for (const input of document.querySelectorAll(`input[data-filter="${key}"]`)) input.checked = set.size > 0 && set.has(input.value);
    const narrowed = set.size > 0 && (set.size !== defaults.size || [...set].some(value => !defaults.has(value)));
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
      if (total > 0 && Math.abs(avail - total) > 1) {
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
function paint() {
  if (!model) return;
  $('[data-page-content]').hidden = false;
  document.body.classList.add('loaded');
  const view = renderDashboard(document, model, { ...state, uiHelp });
  wireSplitHeaders(document);
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
  updateTheme();
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
    state.disciplines = new Set([...model.planned.map(row => row.discipline).filter(Boolean), 'Unknown']);
    state.stages = new Set(model.planned.map(row => row.stage ?? '').filter(value => !EXCLUDED_STAGES.has(value)));
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

document.addEventListener('click', async event => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.page) { state.page = target.dataset.page; paint(); }
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
  if (target.id === 'layout-button') { const layouts = ['one', 'two', 'three']; const index = (layouts.indexOf(document.body.dataset.layout) + 1) % layouts.length; document.body.dataset.layout = layouts[index]; target.title = `${index + 1} column layout`; }
  if (target.id === 'search-button') { $('#searchPanel').classList.toggle('open'); target.setAttribute('aria-expanded', String($('#searchPanel').classList.contains('open'))); }
  if (target.id.startsWith('ccBtn_')) { const panel = document.getElementById(target.getAttribute('aria-controls')); if (panel) panel.hidden = !panel.hidden; }
  if (target.classList?.contains('tf-btn')) {
    const panel = document.getElementById(target.getAttribute('aria-controls'));
    const open = !panel || panel.hidden;
    closeFilterPanels();
    if (panel && open) { panel.hidden = false; target.setAttribute('aria-expanded', 'true'); }
  } else if (!target.closest?.('.tf-panel')) { closeFilterPanels(); }
  if (target.id !== 'search-button' && !target.closest?.('#searchPanel')) {
    const searchPanel = document.getElementById('searchPanel');
    if (searchPanel?.classList.contains('open')) { searchPanel.classList.remove('open'); document.getElementById('search-button')?.setAttribute('aria-expanded', 'false'); }
  }
  if (target.id === 'warnBtn') { state.showWarnings = !state.showWarnings; localStorage.setItem('sub-dashboard-warnings', String(state.showWarnings)); showWarnings(); }
  if (target.id === 'fGo') { state.search = $('#fSearch').value; state.searchCol = $('#fCol').value; paint(); $('#searchPanel').classList.remove('open'); $('#search-button').setAttribute('aria-expanded', 'false'); }
  if (target.id === 'fReset') { state.search = ''; $('#fSearch').value = ''; paint(); }
  if (target.dataset.c1grain) { state.c1Grain = target.dataset.c1grain; closeFilterPanels(); paint(); }
  if (target.hasAttribute('data-c1bars')) { state.c1Bars = !state.c1Bars; paint(); }
  if (target.hasAttribute('data-c1png')) { exportC1Png(); }
  if (target.hasAttribute('data-c1copy')) { copyC1Svg(); }
  if (target.dataset.c3dim) { state.c3Dim = target.dataset.c3dim; paint(); }
  if (target.dataset.c3view) { state.c3View = target.dataset.c3view; paint(); }
  if (target.hasAttribute('data-c3png')) { exportC3Png(target); }
  if (target.hasAttribute('data-c3copy')) { copyC3Svg(target); }
  if (target.hasAttribute('data-c3export')) { exportC3TableCsv(); }
  if (target.dataset.c2view) { state.c2View = target.dataset.c2view; paint(); }
  if (target.hasAttribute('data-c2nfs')) { state.c2Nfs = state.c2Nfs === false ? true : false; paint(); }
  if (target.hasAttribute('data-c2png')) { exportC2Png(); }
  if (target.hasAttribute('data-c2copy')) { copyC2Svg(); }
  if (target.dataset.export) {
    const rows = model ? deriveView(model, state).active : [];
    const cols = ['Document No.', 'Document Title', 'Discipline', 'Submitted By', 'Submission Date', 'Submission Status', 'Approval Status', 'Review Period', 'Target Return Date', 'Actual Return Date', 'Review Turnaround Days', 'Review Delay Days', 'Resubmission Required'];
    const text = [cols, ...rows.map(row => [row.documentNo, row.fields['Document Title'], row.discipline, row.fields['Submitted By'], row.submissionDate, row.submissionStatus, row.approvalStatus, row.fields['Review Period'], row.targetReturnDate, row.actualReturnDate, row.turnaroundDays, row.delayDays, row.resubmissionRequired])].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); link.download = 'submittals.csv'; link.click(); URL.revokeObjectURL(link.href);
  }
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
    paint();
  }
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
    paint();
    return;
  }
  if (event.target.hasAttribute('data-c3month')) { state.c3Month = event.target.value; paint(); return; }
  if (setting === 'theme') { state.theme = event.target.value; paint(); }
  if (setting === 'showWarnings') { state.showWarnings = event.target.checked; showWarnings(); }
  if (setting === 'rememberNames') { state.rememberNames = event.target.checked; localStorage.setItem('sub-dashboard-remember-names', String(state.rememberNames)); }
  if (event.target.id === 'file-pair') {
    const chosen = [...event.target.files];
    event.target.value = '';
    await acceptSelection(chosen);
  }
});
document.addEventListener('input', event => { if (event.target.id === 'fSearch') state.search = event.target.value; });
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
const savedWidth = Number(localStorage.getItem('sub-dashboard-left-sidebar-width'));
if (savedWidth) updateSidebarWidth(savedWidth);
updateFiles();
