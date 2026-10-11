// Runtime regression test for the built MDL dashboard.
// Loads MDL-Dashboard.html, executes its <script type="module"> bundle under a jsdom
// + node-vm context, renders the real workbook, and asserts key DOM/Spec facts.
// Run from the MDL directory:  node test/test_render.mjs
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(ROOT, 'MDL-Dashboard.html');
const XLSX = path.join(ROOT, 'TWRP C3B2 - Master Document List.xlsx');

const html = fs.readFileSync(HTML, 'utf8');
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error('FAIL: no module script found in bundle'); process.exit(1); }
// Expose the internals the test needs (the bundle strips exports during build).
let code = scriptMatch[1] + '\nglobalThis.__rd=renderDashboard; globalThis.__rx=readXlsx; globalThis.__bm=buildModel; globalThis.__gf=getFilterDefs;';

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>',
  { url: 'http://localhost/', pretendToBeVisual: true });
const { window } = dom;
const ctx = {
  window, document: window.document, navigator: window.navigator, localStorage: window.localStorage,
  HTMLElement: window.HTMLElement, Image: window.Image, XMLSerializer: window.XMLSerializer,
  Blob: window.Blob, URL: window.URL, console,
  requestAnimationFrame: cb => setTimeout(() => cb(Date.now()), 0),
  cancelAnimationFrame: id => clearTimeout(id),
  setTimeout, clearTimeout, TextDecoder, Response: globalThis.Response,
  WritableStream: globalThis.WritableStream, ReadableStream: globalThis.ReadableStream,
};
ctx.DecompressionStream = class {
  constructor() { this._c = []; let ctrl = null;
    this.writable = new globalThis.WritableStream({ write: c => this._c.push(Buffer.from(c)), close: () => { try { ctrl.enqueue(zlib.inflateRawSync(Buffer.concat(this._c))); ctrl.close(); } catch (e) { ctrl.error(e); } } });
    this.readable = new globalThis.ReadableStream({ start: c => { ctrl = c; } });
  }
};
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(code, ctx, { filename: 'bundle.js' });

const buf = fs.readFileSync(XLSX);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const wb = await ctx.__rx(ab);
const model = ctx.__bm(wb, { workbookName: XLSX });

ctx.__rd(window.document.getElementById('app'), model);
await new Promise(r => setTimeout(r, 400));

const D = window.document;
const checks = [];
const ok = (name, cond, extra = '') => checks.push({ name, pass: !!cond, extra });

// --- S-curve regression guard (I-48) ---
const curve = D.getElementById('curvePanel');
ok('Issue Progress panel renders an SVG', curve && curve.innerHTML.includes('<svg'));
ok('Issue Progress panel has no error box', curve && !curve.innerHTML.includes('panel-error'));

// --- status bar ---
const status = D.getElementById('statusBar');
ok('status bar shows no render issues', status && !status.textContent.includes('Render issues'));

// --- 8 numbered panels ---
ok('all 8 panels numbered', D.querySelectorAll('.panel[data-panel]').length === 8,
   `count=${D.querySelectorAll('.panel[data-panel]').length}`);

// --- I-43: focus-visible + icon-btn square (spec §7.1) ---
ok('global :focus-visible rule present', html.includes(':focus-visible{outline'));
ok('icon-btn is 26px square', html.includes('width:26px;height:26px'));
ok('icon buttons use spec class .icon-btn', D.querySelectorAll('.icon-btn').length > 0, `count=${D.querySelectorAll('.icon-btn').length}`);
ok('no legacy .btn-mini in bundle', !html.includes('btn-mini'));

// --- I-44: scrollers use spec class .tableScroll (§4.3) ---
ok('scrollers use spec class .tableScroll', D.querySelectorAll('.tableScroll').length >= 3, `count=${D.querySelectorAll('.tableScroll').length}`);
ok('no legacy scroller classes in bundle', !html.includes('"ovt"') && !html.includes('detail-scroll') && !html.includes('tbl-scroll'));

// --- G1/G2/G3: app-bar title from worksheet + meta-left layout (rev spec §3.1) ---
const appHeader = D.querySelector('header.app');
const hdrH1 = appHeader && appHeader.querySelector('h1.ttl');
ok('app title sourced from worksheet Project Title', !!hdrH1 && hdrH1.textContent.trim() === (model.meta.projectTitle || ''), `title=${hdrH1 && hdrH1.textContent.trim()}`);
ok('no hard-coded full dashboard title in app header', !!appHeader && !appHeader.innerHTML.includes('— Master Document List Dashboard'));
ok('meta line sits in left brand block (.ttl-stack)', !!appHeader && !!appHeader.querySelector('.ttl-stack .meta'));
ok('action buttons grouped in right .actions', !!appHeader && appHeader.querySelectorAll('.actions button').length >= 3, `btns=${appHeader && appHeader.querySelectorAll('.actions button').length}`);
ok('dashboard title not hard-coded when absent', (!model.meta.dashboardTitle) ? !appHeader.querySelector('.sub') : !!appHeader.querySelector('.sub'));

// --- I-51: spec-compliant onboarding (§3.7) — dashed dropzone + .expect + Primary CTA ---
ok('welcome dropzone is dashed', html.includes('.welcome .drop{border:1.5px dashed'));
ok('welcome dropzone has drag-over highlight', html.includes('.welcome .drop.hover{border-color:var(--accent)'));
ok('welcome shows .expect callout', html.includes('class="expect"'));
ok('welcome CTA is standard Primary button', html.includes('class="btn btn-primary">Choose Workbook'));
ok('welcome headline is 25/700', html.includes('.welcome h1{margin:0 0 8px;font-size:25px;font-weight:700;letter-spacing:-.02em}'));
ok('welcome hero radius is 24 (spec)', html.includes('.welcome{max-width:480px;width:100%;margin:0;text-align:center;background:var(--card);border:1px solid var(--line);border-radius:24px'));
ok('no stale legacy .welcome override (560/80px)', !html.includes('.welcome{max-width:560px'));
ok('welcome sub-text is standardized', html.includes('Interactive dashboard. Load the workbook to validate data, explore status and details.'));
ok('welcome .expect body standardized', html.includes('<b>What this does</b> — Select your Code-sheet workbook (.xlsx)… Drop it below or click to browse.'));
ok('welcome has privacy claim', html.includes('Works fully offline — your data never leaves this browser'));
ok('welcome privacy shield is sized (PPP parity)', html.includes('.welcome .privacy svg{width:13px;height:13px;fill:var(--muted)}'));

// --- I-58: top-bar filters = two individual dropdowns (Discipline, Stage) ---
const pDisc = D.getElementById('tfPanel_disciplines'), pStg = D.getElementById('tfPanel_stages');
const cntDisc = D.getElementById('tfCnt_disciplines'), cntStg = D.getElementById('tfCnt_stages');
ok('two individual filter buttons in top bar', D.querySelectorAll('header.app .actions .tf-wrap').length === 2, `count=${D.querySelectorAll('header.app .actions .tf-wrap').length}`);
ok('Discipline + Stage triggers exist', !!D.getElementById('tfBtn_disciplines') && !!D.getElementById('tfBtn_stages'));
ok('no single combined Filters button', !html.includes('>Filters ▾<'));
ok('each trigger owns an anchored panel', !!pDisc && !!pStg);
ok('filter panels start closed', !!pDisc && pDisc.hidden && !!pStg && pStg.hidden);
ok('trigger badge shows All by default', !!cntDisc && cntDisc.textContent.trim() === 'All Discipline' && !!cntStg && cntStg.textContent.trim() === 'All Stage');
ok('master All checkbox + dismiss hint at top of each dropdown (no Clear button)',
   !!pDisc && !!pDisc.querySelector('.tf-all input') && !!pDisc.querySelector('.tf-divider') &&
   !!pStg && !!pStg.querySelector('.tf-all input') && !!pStg.querySelector('.tf-divider') &&
   html.includes('Changes apply when this list is closed.') && !html.includes('data-act="clear"'));
ok('no search box inside dropdown', !html.includes('tf-search'));
ok('no explanation text inside dropdown', !!pDisc && !pDisc.innerHTML.includes('filters-help'));
ok('no bottom filtered-note in dropdown', !html.includes('● filtered —'));
ok('no Clear-all button in the bar', !!appHeader && !appHeader.innerHTML.includes('Clear all'));
const stgBoxes = pStg ? [...pStg.querySelectorAll('input[type=checkbox]')] : [];
const EXCL = ['Deleted','Void','Superseded'];
const exclBoxes = stgBoxes.filter(b => EXCL.includes(b.value));
const cntBoxes  = stgBoxes.filter(b => !EXCL.includes(b.value));
ok('excluded stages are still offered in the Stage filter', exclBoxes.length > 0, `excluded options=${exclBoxes.map(b=>b.value).join(',')}`);
ok('excluded stages load DESELECTED (not counted)', exclBoxes.every(b => !b.checked), `state=${exclBoxes.map(b=>b.value+':'+(b.checked?'on':'off')).join(',')}`);
ok('counted stages load selected', cntBoxes.length > 0 && cntBoxes.every(b => b.checked));
// The three never-counted stages must be offered even when the workbook has NO such rows yet.
const noExclModel = { ...model, records: model.records.filter(r => !EXCL.includes(r.stage)) };
const stgDefNo = (ctx.__gf(noExclModel) || []).find(d => d.key === 'stages');
ok('excluded stages still offered when no row uses them', !!stgDefNo && EXCL.every(s => stgDefNo.items.includes(s)), `items=${stgDefNo && stgDefNo.items.join(',')}`);
ok('those are flagged never-counted too', !!stgDefNo && EXCL.every(s => stgDefNo.noCount.includes(s)));
ok('never-counted rows carry a visible "not counted" hint', !!pStg && (pStg.innerHTML.match(/class="nc"/g) || []).length === exclBoxes.length, `hints=${(pStg && pStg.innerHTML.match(/class="nc"/g) || []).length}`);
ok('include-excluded toggle removed', !D.getElementById('fInc') && !html.includes('includeExcluded'));
ok('authority/approval filters removed', !html.includes("key:'authority'") && !html.includes('state.approval'));

// --- I-58 semantics via the live DOM: AND-combined, empty = zero rows ---
const kpiVal = label => {
  const card = [...D.querySelectorAll('.kpi')].find(el => {
    const l = el.querySelector('.l');
    return l && l.textContent.trim() === label;
  });
  return card ? Number(card.querySelector('.v').textContent.trim()) : NaN;
};
const before = kpiVal('Total Planned');
const tfDisc = D.getElementById('tfBtn_disciplines'), tfStg = D.getElementById('tfBtn_stages');
// Filter changes are committed only when the dropdown is closed (spec §7.5): open, act, then close.
const openDrop = tf => { if(tf.getAttribute('aria-expanded') !== 'true') tf.click(); };
const closeDrop = tf => { if(tf.getAttribute('aria-expanded') === 'true') tf.click(); };
// Empty the Discipline selection by unchecking the master "All Discipline" checkbox (deferred).
openDrop(tfDisc);                                // open Discipline dropdown
let mDisc = pDisc.querySelector('#tfAll_disciplines');
if (mDisc && mDisc.checked) mDisc.click();       // uncheck master → empty selection (deferred)
closeDrop(tfDisc);                               // close → commit re-render
const afterClear = kpiVal('Total Planned');
const badgeAfterClear = (D.getElementById('tfCnt_disciplines') || {}).textContent.trim();
openDrop(tfDisc);                                // open again
mDisc = pDisc.querySelector('#tfAll_disciplines');
if (mDisc) mDisc.click();                        // check master → restore all (deferred)
closeDrop(tfDisc);                               // close → commit re-render
const afterAll = kpiVal('Total Planned');
ok('Total Planned starts at full active set', before > 0, `before=${before}`);
ok('Empty selection (master unchecked) → zero documents', afterClear === 0, `afterClear=${afterClear}`);
ok('badge shows None selected after Clear', badgeAfterClear === 'None selected', `badge=${badgeAfterClear}`);
ok('All restores the full set (single combined pass)', afterAll === before, `afterAll=${afterAll}`);
// Excluded stages are opt-in: ticking one deliberately pulls those rows into the dashboard.
const exclBox = exclBoxes[0];
const basePlanned = kpiVal('Total Planned');
openDrop(tfStg);                                 // open Stage dropdown
if (exclBox) exclBox.click();                    // tick excluded stage (deferred)
closeDrop(tfStg);                                // close → commit re-render
const tickedPlanned = kpiVal('Total Planned');
const badgeTicked = cntStg && cntStg.textContent.trim();
openDrop(tfStg);                                 // open again
if (exclBox) exclBox.click();                    // untick (deferred)
closeDrop(tfStg);                                // close → commit re-render
const untickedPlanned = kpiVal('Total Planned');
ok('ticking an excluded stage adds its documents', !exclBox || tickedPlanned > basePlanned, `base=${basePlanned} ticked=${tickedPlanned}`);
ok('Stage badge switches to "N of M selected" once an excluded stage is ticked', !exclBox || /^\d+ of \d+ selected$/.test(badgeTicked || ''), `badge=${badgeTicked}`);
ok('unticking it restores the baseline count', !exclBox || untickedPlanned === basePlanned, `restored=${untickedPlanned} base=${basePlanned}`);
ok('welcome has copyright', html.includes('© ${year} UESH'));
ok('welcome has no app bar (hero only)', !html.includes('<div class="meta">Welcome — choose a workbook to begin</div>'));

// --- .ds-table adoption (§7.2) ---
const tables = [...D.querySelectorAll('table')];
ok('every on-screen table uses .ds-table', tables.length > 0 && tables.every(t => t.classList.contains('ds-table')), `tables=${tables.length}`);
ok('.ds-table base rule present', html.includes('.ds-table{'));
ok('.ds-table navy sticky header', html.includes('.ds-table thead th{background:var(--navy)'));
ok('.ds-table single bottom rule', html.includes('.ds-table th,.ds-table td{border-bottom'));
const sevCells = [...D.querySelectorAll('td[class^="sev-"]')];
ok('severity chips use spec .sev-error/.sev-warning/.sev-info', sevCells.every(c => /^sev-(error|warning|info)$/.test(c.className)), `sev cells=${sevCells.length}`);
ok('no legacy .sev-err/.sev-warn in bundle', !/(sev-err(?!or)|sev-warn(?!ing)|sev-ERR)/.test(html));

// --- I-44: drill accordion a11y + row counts ---
const expand = [...D.querySelectorAll('.expand')];
ok('matrix drill cells exist', expand.length > 0, `count=${expand.length}`);
ok('drill cells expose aria-expanded', expand.length > 0 && expand.every(e => e.getAttribute('aria-expanded') === 'false'));
ok('drill cells are keyboard-operable', expand.length > 0 && expand.every(e => e.getAttribute('tabindex') === '0' && e.getAttribute('role') === 'button'));
// accordion behaviour: clicking one opens it and collapses others
if (expand.length) {
  expand[0].click();
  const openAfter = [...D.querySelectorAll('.expand')].filter(e => e.getAttribute('aria-expanded') === 'true');
  ok('clicking a drill opens exactly one row', openAfter.length === 1, `open=${openAfter.length}`);
  ok('opened drill has aria-expanded=true', expand[0].getAttribute('aria-expanded') === 'true');
}
ok('clipped-list row-count chips present', D.querySelectorAll('.cnt').length >= 3, `count=${D.querySelectorAll('.cnt').length}`);

// --- I-45: project-prefixed exports + help-modal a11y ---
ok('no legacy MDL_Overdue.csv literal', !html.includes("'MDL_Overdue.csv'"));
ok('no legacy MDL_issue_list.csv literal', !html.includes("'MDL_issue_list.csv'"));
ok('no legacy MDL_document_list.csv literal', !html.includes("'MDL_document_list.csv'"));
ok('export helper xp() used', html.includes("xp('Overdue')") && html.includes("xp('Issue_Progress')"));
const helpBtn = D.querySelector('.help');
ok('help trigger present', !!helpBtn);
if (helpBtn) helpBtn.click();
const box = D.querySelector('.help-modal .box');
ok('help modal labelled by title', box && box.getAttribute('aria-labelledby') === 'helpTitle');
const closeBtn = D.querySelector('.help-modal .close');
ok('help close has aria-label', closeBtn && closeBtn.getAttribute('aria-label') === 'Close help');

let pass = 0;
for (const c of checks) { console.log((c.pass ? 'PASS' : 'FAIL') + ' - ' + c.name + (c.extra ? '  [' + c.extra + ']' : '')); if (c.pass) pass++; }
console.log(`\n${pass}/${checks.length} checks passed`);
process.exit(pass === checks.length ? 0 : 1);
