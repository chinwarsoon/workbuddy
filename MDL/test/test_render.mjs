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
let code = scriptMatch[1] + '\nglobalThis.__rd=renderDashboard; globalThis.__rx=readXlsx; globalThis.__bm=buildModel; globalThis.__gf=getFilterDefs; globalThis.__cmp=dsCmp;';

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
ok('all 7 panels numbered', D.querySelectorAll('.panel[data-panel]').length === 7,
   `count=${D.querySelectorAll('.panel[data-panel]').length}`);

// --- I-43: focus-visible + icon-btn square (spec §7.1) ---
ok('global :focus-visible rule present', html.includes(':focus-visible{outline'));
ok('icon-btn is 26px square (min-height cannot be overridden by .btn)', /\.icon-btn\{[^}]*width:26px;height:26px;min-height:26px/.test(html));
ok('icon buttons use .icon-btn alone, never combined with .btn', D.querySelectorAll('.btn.icon-btn').length === 0, `combined=${D.querySelectorAll('.btn.icon-btn').length}`);
ok('modal close ✕ is A4 — no size/padding override that would break the square', !/help-modal \.box \.close\{[^}]*padding:/.test(html));
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
// --- I-78: three new approval-derived KPI cards present (gated via approvalCategory) ---
ok('Pending Review KPI card present', !isNaN(kpiVal('Pending Review')), `val=${kpiVal('Pending Review')}`);
ok('Not Submitted KPI card present', !isNaN(kpiVal('Not Submitted')), `val=${kpiVal('Not Submitted')}`);
ok('Record Error KPI card present', !isNaN(kpiVal('Record Error')), `val=${kpiVal('Record Error')}`);
// --- I-80: detail table renders the derived approval-category pills ---
const detailPanel = D.getElementById('detailPanel');
ok('detail table renders Not Submitted pill (p-nsub)', !!detailPanel && detailPanel.innerHTML.includes('p-nsub'), `hasDetail=${!!detailPanel}`);
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
const sevCells = [...D.querySelectorAll('span[class^="sev-"]')];
ok('severity chips use spec .sev-error/.sev-warning/.sev-info and a fixed-size SVG glyph', sevCells.length>0 && sevCells.every(c => /^sev-(error|warning|info)$/.test(c.className) && c.querySelector('svg.sev-svg[role="img"]')), `sev cells=${sevCells.length}`);
ok('no legacy .sev-err/.sev-warn in bundle', !/(sev-err(?!or)|sev-warn(?!ing)|sev-ERR)/.test(html));

// --- Validation panel §4.5 (spec rev 2026-10-14) ---
const vPanel = D.getElementById('validationPanel');
ok('validation panel present', !!vPanel);
if(vPanel){
  const chips = [...vPanel.querySelectorAll('.vchip')];
  ok('severity summary chips present (error/warning/info or ok)', chips.length >= 1, `chips=${chips.length}`);
  const det = vPanel.querySelector('.vdetails');
  ok('validation detail is a collapsed <details> by default', !!det && det.tagName === 'DETAILS' && !det.hasAttribute('open'));
  ok('code-sheet summary (.vnote/#vmap) + rule reference (.vrefcard/#vref) present', !!vPanel.querySelector('.vnote') && !!vPanel.querySelector('.vrefcard'));
  // I-92: headers are now sortable buttons (label + indicator), so read the label span
  const vth = [...vPanel.querySelectorAll('.vtableWrap thead th')].map(t => (t.querySelector('.sort-lbl') || t).textContent.trim());
  ok('per-issue table exposes Field & Value columns', vth.includes('Field') && vth.includes('Value'), vth.join('|'));
  const sevSpans = [...vPanel.querySelectorAll('.vtableWrap tbody td span[class^="sev-"]')];
  ok('per-issue severity cells carry a fixed-size SVG glyph (not emoji), no row cap', sevSpans.length > 0 && sevSpans.every(c => c.querySelector('svg.sev-svg[role="img"]')), `rows=${sevSpans.length}`);
  ok('every issue row rendered (no truncation)', vPanel.querySelectorAll('.vtableWrap tbody tr').length === sevSpans.length, `tr=${vPanel.querySelectorAll('.vtableWrap tbody tr').length}`);
  const hi = vPanel.innerHTML;
  ok('explanatory note sits ABOVE the validation-detail toggle', hi.indexOf('class="note"') > -1 && hi.indexOf('class="note"') < hi.indexOf('class="vdetails"'));
}

// --- I-44: drill accordion a11y + row counts ---
const expand = [...D.querySelectorAll('.expand')];
ok('matrix drill cells exist', expand.length > 0, `count=${expand.length}`);
ok('drill cells expose aria-expanded', expand.length > 0 && expand.every(e => e.getAttribute('aria-expanded') === 'false'));
ok('drill cells are keyboard-operable', expand.length > 0 && expand.every(e => e.tagName === 'BUTTON' && e.type === 'button'), `tags=${[...new Set(expand.map(e=>e.tagName))].join(',')}`);
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

// --- I-75: a formula-error column surfaces as a FATAL item in the top errBanner ---
model.warnings.push({ level:'fatal', code:'W-FORMULA', tab:'Latest Approval Status', message:'test recover instruction' });
ctx.__rd(window.document.getElementById('app'), model);
await new Promise(r => setTimeout(r, 300));
const errBanner = D.getElementById('errBanner');
ok('W-FORMULA fatal warning shows in the top errBanner', !!errBanner && errBanner.innerHTML.includes('W-FORMULA'), (errBanner||{}).innerHTML ? errBanner.innerHTML.slice(0,120) : 'no banner');

// --- I-76: dismissible warning bar (spec §3.5) ---
window.localStorage.removeItem('mdl_hideWarnings');
const warnBtn = D.getElementById('warnBtn');
const barEl = D.getElementById('errBanner');
const nNotices = barEl.querySelectorAll('.sys-banner-item').length;
ok('warn toggle button present and visible (≥1 warning)', !!warnBtn && warnBtn.hidden === false, (warnBtn||{}).hidden);
ok('warn badge shows notice count', !!warnBtn && warnBtn.querySelector('.badge').textContent === String(nNotices), warnBtn && warnBtn.querySelector('.badge').textContent);
ok('warning bar visible by default', !!barEl && barEl.hidden === false);
warnBtn.click();
ok('toggle collapses bar + aria-pressed=true', warnBtn.getAttribute('aria-pressed') === 'true' && barEl.hidden === true);
ok('badge still shows count when collapsed', warnBtn.querySelector('.badge').textContent === String(nNotices));
warnBtn.click();
ok('toggle re-expands bar + aria-pressed=false', warnBtn.getAttribute('aria-pressed') === 'false' && barEl.hidden === false);
ok('collapse preference persisted', window.localStorage.getItem('mdl_hideWarnings') === 'false');

// --- I-83: chart panel owns its board + exactly one border per chart card (spec §4.1 rev 2026-10-13) ---
const cpEl = D.getElementById('chartsPanel');
const cGrid = cpEl && cpEl.querySelector('.charts');
ok('chart panel has its own board (not panel-flat)', !!cpEl && !cpEl.classList.contains('panel-flat'), cpEl && cpEl.className);
ok('chart cards are the grid\'s direct children', !!cGrid && cGrid.children.length === 2 && [...cGrid.children].every(c => c.classList.contains('chart')), cGrid && `children=${cGrid.children.length}`);
ok('no nested chart card (exactly one border per chart)', !!cGrid && cGrid.querySelectorAll('.chart .chart').length === 0, cGrid && `nested=${cGrid.querySelectorAll('.chart .chart').length}`);

// --- I-84: card heading names the view, not the selection (spec §4.1 rev 2026-10-13) ---
const cardTitles = cGrid ? [...cGrid.children].map(c => ((c.querySelector(':scope > h3') || {}).textContent || '').trim()) : [];
ok('chart card titles are the stable group names', cardTitles.length === 2 && cardTitles[0] === 'Documents' && cardTitles[1] === 'Issues', cardTitles.join(' | '));
const firstCard = cGrid && cGrid.children[0];
const dd = firstCard && firstCard.querySelector('select');
if (dd && dd.options.length > 1) {
  dd.selectedIndex = 1;
  if (typeof dd.onchange === 'function') dd.onchange();
  const headAfter = ((firstCard.querySelector(':scope > h3') || {}).textContent || '').trim();
  const picked = dd.options[dd.selectedIndex].textContent.trim();
  ok('card heading does not track the selected breakdown', headAfter.startsWith('Documents') && !headAfter.includes(picked), `heading="${headAfter}" picked="${picked}"`);
}

// --- I-85: S-curve panel structure, notes & absolute cumulative (spec §4.2 / §7.9 rev 2026-10-13) ---
const cv = D.getElementById('curvePanel');
const cvBody = cv && cv.querySelector('.curve-body');
ok('S-curve plot is wrapped in one chart card board inside the panel', !!cvBody && cvBody.querySelectorAll('.chart').length === 1 && cvBody.children[0].classList.contains('chart'), cvBody && cvBody.children[0] && cvBody.children[0].className);
const cvCard = cvBody && cvBody.querySelector('.chart');
ok('period window sits on the card board, not the panel area', !!cvCard && !!cvCard.querySelector('.sc-win') && !cv.querySelector('.panel-head .sc-win'));
ok('period window is not in the panel head', !!cv && !cv.querySelector('.panel-head .sc-win'));
ok('curve card has no sub-title h3', !!cvBody && cvBody.querySelectorAll('h3').length === 0, cvBody && `h3=${cvBody.querySelectorAll('h3').length}`);
const cvNote = cvBody && cvBody.querySelector('.curve-note');
ok('curve note follows PPP wording', !!cvNote && /Project start:/.test(cvNote.textContent) && /red dashed line = project start/.test(cvNote.textContent) && /grey line = today/.test(cvNote.textContent), cvNote && cvNote.textContent.slice(0, 90));
ok('no window-relative explain text (absolute cumulative)', !!cvBody && !/cumulative within period/.test(cvBody.textContent) && !/Reporting period/.test(cvBody.textContent));
const cvSvg = cvBody && cvBody.querySelector('.curve-host svg');
const cvHtml = (cvSvg && cvSvg.outerHTML) || '';
const cvMsg = (cvBody && (cvBody.querySelector('.msg') || {}).textContent) || '';
const monthsInWin = +((cvMsg.match(/\((\d+)\//) || [0, 0])[1]);
const xLabels = (cvHtml.match(/>[A-Z][a-z]{2} \d{4}<\/text>/g) || []).length;   // I-88: "Mar 2026", was the raw "26-03" slice
ok('every month is labelled on the x axis', monthsInWin > 0 && xLabels === monthsInWin, `months=${monthsInWin} labels=${xLabels}`);
ok('chart width scales with the month count', !!cvSvg && +cvSvg.getAttribute('width') >= Math.max(440, monthsInWin * 64), `w=${cvSvg && cvSvg.getAttribute('width')} months=${monthsInWin}`);

// --- I-86: S-curve appearance parity with PPP (spec §4.2 / §7.4) ---
ok('cumulative lines use PPP dash patterns (6,3 / 2,2)', /stroke-dasharray="6,3"/.test(cvHtml) && /stroke-dasharray="2,2"/.test(cvHtml));
ok('cumulative lines 2.5 weight + round caps', /stroke-width="2.5"/.test(cvHtml) && /stroke-linecap="round"/.test(cvHtml));
ok('point markers r=3 present', /<circle[^>]*\sr="3"/.test(cvHtml));
ok('bar values printed (12 px)', /font-size="12"/.test(cvHtml));
ok('Start marker red dashed 5,3', /#C62828/.test(cvHtml) && /stroke-dasharray="5,3"/.test(cvHtml));
const todayDrawn = /Today<\/text>/.test(cvHtml);
ok('Today marker grey dashed when in range, never navy', !todayDrawn || (/#B8C2CC/.test(cvHtml) && !/#0F2D52/.test(cvHtml)), `todayDrawn=${todayDrawn}`);
ok('5 y gridlines', (cvHtml.match(/stroke="#EAEFF5"/g) || []).length === 5, `n=${(cvHtml.match(/stroke="#EAEFF5"/g) || []).length}`);
ok('axis / label text at 13 px', /font-size="13"/.test(cvHtml));
ok('no HTML legend; in-SVG legend names the Cum. series', !!cvBody && cvBody.querySelectorAll('.legend').length === 0 && /Cum\. Plan/.test(cvHtml) && /Cum\. Forecast/.test(cvHtml) && /Cum\. Actual/.test(cvHtml));

// --- I-86(i) + I-87: Bars toggle + scale-mode guardrail ---
const cvBars = cvBody && cvBody.querySelector('.ctl-bars');
ok('Bars toggle present with aria-pressed', !!cvBars && cvBars.hasAttribute('aria-pressed'), cvBars && cvBars.getAttribute('aria-pressed'));
const barRects = () => (((cvBody.querySelector('.curve-host svg') || {}).outerHTML) || '').match(/<rect[^>]*><title>/g) || [];
if (cvBars && typeof cvBars.onclick === 'function') {
  const before = barRects().length;
  cvBars.onclick();
  const after = barRects().length;
  ok('Bars toggle hides the monthly bars', before > 0 && after === 0, `before=${before} after=${after}`);
  // I-88: dual is detected by the right-axis caption `per mo`, not by text-anchor="start" any more
  // (the rotated bar values now also use text-anchor="start").
  ok('bars hidden forces the shared scale (no right axis, no dual note)', !/right-hand scale/.test(cvBody.textContent) && !/>per mo<\/text>/.test(((cvBody.querySelector('.curve-host svg') || {}).outerHTML) || ''));
  cvBars.onclick();
  ok('Bars toggle restores the monthly bars', barRects().length === before, `n=${barRects().length}`);
}
const cluster = cvCard && cvCard.querySelector('.chart-actions');
ok('controls form one right-aligned cluster on the card board', !!cluster && cluster.parentElement === cvCard);
const clusterKids = cluster ? [...cluster.children].map(c => c.className) : [];
ok('cluster order = period window -> Bars -> PNG -> Copy', JSON.stringify(clusterKids) === JSON.stringify(['toolbar sc-win','ctl-bars btn btn-secondary','dl btn btn-secondary','cp btn btn-secondary']), clusterKids.join(' | '));
const clusterBtns = [...((cluster && cluster.querySelectorAll('button')) || [])];
ok('cluster has no Reset button (removed 2026-10-13)', clusterBtns.length > 0 && !clusterBtns.some(b => /^\s*Reset\s*$/.test(b.textContent)), clusterBtns.map(b => b.textContent.trim()).join(' | '));
ok('every cluster button uses the standard .btn class', clusterBtns.length > 0 && clusterBtns.every(b => b.classList.contains('btn')), clusterBtns.map(b => b.className).join(' | '));
const styleText = (D.querySelector('style') || {}).textContent || '';
ok('CSS contract: .chart-actions right-aligns to the card', /\.chart-actions\{[^}]*justify-content:\s*flex-end/.test(styleText));
ok('CSS contract: .sc-win .msg is muted 12px', /\.sc-win \.msg\{[^}]*font-size:\s*12px[^}]*color:\s*var\(--muted\)/.test(styleText));
ok('CSS contract: .sc-win .msg pushed right', /\.sc-win \.msg\{[^}]*margin-left:\s*auto/.test(styleText));
const icPanel = D.getElementById('chartsPanel');
const icCards = icPanel ? [...icPanel.querySelectorAll('.chart')] : [];
ok('Interactive Chart cards keep controls inside the card and right-aligned (general rule §4.1)', icCards.length === 2 && icCards.every(c => !!c.querySelector('.head-actions.chart-actions')));
const isDual = />per mo<\/text>/.test(((cvBody.querySelector('.curve-host svg') || {}).outerHTML) || '');
ok('scale mode consistent: dual note iff right axis drawn', isDual === /right-hand scale/.test(cvBody.textContent), `dual=${isDual}`);
const cvHtml3 = ((cvBody.querySelector('.curve-host svg') || {}).outerHTML) || '';
const tickNums = [...cvHtml3.matchAll(/text-anchor="end"[^>]*font-size="13" fill="#6b7785">(\d+)<\/text>/g)].map(m => +m[1]);
const barNums = [...cvHtml3.matchAll(/font-size="12" fill="#2b3440">(\d+)<\/text>/g)].map(m => +m[1]);
const axisMax = Math.max(0, ...tickNums), barMax = Math.max(0, ...barNums);
const ratio = barMax > 0 ? axisMax / barMax : 0;
ok('guardrail: separate scales engage only when r = maxCum/maxBar > 10', isDual === (ratio > 10), `r=${ratio.toFixed(2)} dual=${isDual}`);

// --- I-92: L2 sorting (spec §7.2.6) ---
const lbl = t => (t.querySelector('.sort-lbl') || t).textContent.trim();
const sortBtns = [...D.querySelectorAll('.ds-table thead .sort-btn')];
ok('sortable headers are keyboard-reachable <button type="button"> inside a <th>',
   sortBtns.length > 0 && sortBtns.every(b => b.tagName === 'BUTTON' && b.type === 'button' && !!b.closest('th')),
   `buttons=${sortBtns.length}`);
const sortableTh = [...D.querySelectorAll('.ds-table thead th[aria-sort]')];
ok('every sortable header carries aria-sort, and only sortable ones do',
   sortableTh.length === sortBtns.length && sortableTh.length > 0, `th=${sortableTh.length} btns=${sortBtns.length}`);
ok('aria-sort uses only the three spec states',
   sortableTh.every(t => ['none', 'ascending', 'descending'].includes(t.getAttribute('aria-sort'))),
   [...new Set(sortableTh.map(t => t.getAttribute('aria-sort')))].join(','));
// comparator contract
const cmp = ctx.__cmp;
ok('comparator: empty sorts LAST in both directions', cmp('', 'abc', 'text') > 0 && cmp('abc', '', 'text') < 0);
ok('comparator: the em-dash blank placeholder counts as empty (RC-6)', cmp('—', 'BIM', 'text') > 0);
ok('comparator: numbers compare numerically, not lexically', cmp('9', '10', 'num') < 0 && cmp(10, 9, 'num') > 0);
ok('comparator: dates compare chronologically', cmp('2024-01-02', '2024-01-10', 'date') < 0);
ok('comparator: enums use business order, unknown values last',
   cmp('AWC', 'APP', 'enum', ['APP', 'AWC', 'REJ', 'NAP']) > 0 && cmp('ZZZ', 'APP', 'enum', ['APP', 'AWC', 'REJ', 'NAP']) > 0);
// overdue: default Delay (days) descending
const ovDelayTh = sortableTh.find(t => lbl(t) === 'Delay (days)');
ok('Overdue list defaults to Delay (days) descending', !!ovDelayTh && ovDelayTh.getAttribute('aria-sort') === 'descending',
   ovDelayTh ? ovDelayTh.getAttribute('aria-sort') : 'not found');
const ovTbl = ovDelayTh && ovDelayTh.closest('table');
const delays = ovTbl ? [...ovTbl.querySelectorAll('tbody tr')].slice(0, 6).map(r => +r.children[12].textContent.trim()) : [];
ok('Overdue rows are genuinely in descending delay order', delays.length > 0 && delays.every((v, i) => i === 0 || delays[i - 1] >= v), delays.join(','));
// matrix: sorting removed (2026-10-19, MDL I-110) — headers are static labels, no sort affordance
const mxTbl = D.querySelector('#matrixBody');   // I-110 split-header: the body table (#matrixBody) holds tbody+tfoot; #matrixHead is headers only
const matrixSortBtns = mxTbl ? [...mxTbl.querySelectorAll('thead .sort-btn')] : [];
ok('Matrix has no sortable headers (sorting removed)', matrixSortBtns.length === 0, `btns=${matrixSortBtns.length}`);
const matrixSortableTh = mxTbl ? [...mxTbl.querySelectorAll('thead th[aria-sort]')] : [];
ok('Matrix headers carry no aria-sort', matrixSortableTh.length === 0, `th=${matrixSortableTh.length}`);
ok('Matrix Discipline header is a static label (no sort button)', mxTbl && !mxTbl.querySelector('thead .sort-btn[data-col="discipline"]'));
ok('Matrix TOTAL row stays pinned last', mxTbl && mxTbl.querySelector('tfoot tr td').textContent.trim() === 'TOTAL');
// issue list: severity sorts by tier
const issTbl = D.querySelector('.vtableWrap table');
const sevBtn = issTbl && issTbl.querySelector('thead .sort-btn[data-col="severity"]');
ok('Issue-list Severity is sortable', !!sevBtn);
if (sevBtn) {
  sevBtn.click();
  const firstSev = [...issTbl.querySelectorAll('tbody tr')].slice(0, 3).map(r => r.querySelector('span[class^="sev-"]').className);
  ok('ascending Severity puts Error first (tier order, not alphabetical)', firstSev.every(c => c === 'sev-error'), firstSev.join(','));
}
// detail: Source Tab is not sorted, Active is
const dtTbl = [...D.querySelectorAll('.ds-table')].pop();
const dtTh = [...dtTbl.querySelectorAll('thead th')];
ok('Detail: Source Tab is not sortable, Active is',
   dtTh.length > 2 && !dtTh[0].querySelector('.sort-btn') && !!dtTh[1].querySelector('.sort-btn'),
   `cols=${dtTh.length}`);

// --- In-panel column filters (I-93) were removed from EVERY panel (Overdue, Validation Issues,
// Document Detail) in the 2026-10-20 cleanup — only the global Discipline/Stage chips (top bar)
// and the Overdue Type dropdown remain as scope/filter controls. So there must be NO in-panel
// filter buttons (tf-btn / cfPanel) anywhere.
ok('no in-panel filter buttons (tf-btn / cfPanel) remain on any panel',
   !D.querySelector('#cfBtn_issue') && !D.querySelector('#cfPanel_issue') &&
   !D.querySelector('#cfBtn_detail') && !D.querySelector('#cfPanel_detail') &&
   !D.querySelector('#cfBtn_overdue_delay') && !D.querySelector('#cfBtn_overdue_sourceTab') && !D.querySelector('#cfBtn_overdue_planned'),
   'issue/detail/overdue filter buttons absent');
// Overdue panel keeps only the Overdue Type dropdown (no per-column filter buttons)
ok('Overdue panel exposes no per-column filter buttons (Delay / Source Tab / Planned removed)',
   !D.querySelector('#cfBtn_overdue_delay') && !D.querySelector('#cfBtn_overdue_sourceTab') && !D.querySelector('#cfBtn_overdue_planned'),
   `delay=${!!D.querySelector('#cfBtn_overdue_delay')} sourceTab=${!!D.querySelector('#cfBtn_overdue_sourceTab')} planned=${!!D.querySelector('#cfBtn_overdue_planned')}`);
const ovT3 = D.querySelector('#ovBody').closest('table');
const ovTypeSel = D.querySelector('#ovType');
const ovBeforeAll = ovT3.querySelectorAll('tbody tr').length;
const ovTypeOpts = [...ovTypeSel.options].map(o => o.value).filter(Boolean);
if (ovTypeOpts.length) {
  ovTypeSel.value = ovTypeOpts[0]; ovTypeSel.dispatchEvent(new window.Event('change'));
  const after = ovT3.querySelectorAll('tbody tr').length;
  const typeColIdx = [...ovT3.querySelectorAll('thead th')].findIndex(th => th.textContent.includes('Overdue Type'));
  const mismatch = typeColIdx >= 0 && [...ovT3.querySelectorAll('tbody tr')].some(tr => {
    const cell = tr.children[typeColIdx]; return cell && cell.textContent.trim() !== ovTypeOpts[0];
  });
  // the dataset may be single-type (so the count need not shrink); what matters is that the dropdown
  // filters to exactly the selected type.
  ok('Overdue Type dropdown filters to the selected type', !mismatch && after > 0, `${ovBeforeAll} -> ${after}, type=${ovTypeOpts[0]}, mismatches=${mismatch}`);
  ok('the Overdue count updates with the selection', /docs/.test(D.querySelector('#ovCnt').textContent), D.querySelector('#ovCnt').textContent.trim());
  ovTypeSel.value = ''; ovTypeSel.dispatchEvent(new window.Event('change'));
  ok('clearing Overdue Type restores the full list', ovT3.querySelectorAll('tbody tr').length === ovBeforeAll, `${ovT3.querySelectorAll('tbody tr').length} vs ${ovBeforeAll}`);
}

// --- I-114 (a): Overdue Type labels are WORKBOOK DATA (Code!AN -> Code!AO), not hard-coded. ---
ok('Overdue Type options come from the Code sheet block (no hard-coded "1st-submission")',
   ovTypeOpts.length === 3 && !ovTypeOpts.includes('1st-submission'), ovTypeOpts.join(' | '));
ok('Overdue Type labels use the canonical §4A.6 wording',
   ovTypeOpts.includes('Overdue — Submission') && ovTypeOpts.includes('Overdue — Resubmission') && ovTypeOpts.includes('Overdue — Client Review'),
   ovTypeOpts.join(' | '));

// --- I-114 (b): the column-visibility chooser is a LAYOUT control with its own class (§7.10 B7),
// so no data panel may carry the filter-trigger look (.tf-btn) any more. ---
const panelTfBtn = D.querySelectorAll('#overduePanel .tf-btn, #validationPanel .tf-btn, #detailPanel .tf-btn');
ok('no panel head uses the filter-trigger look (.tf-btn) — chooser has its own class',
   panelTfBtn.length === 0, `found=${panelTfBtn.length}`);
const ccBtn = D.querySelector('#ccBtn_overdue');
ok('column chooser uses .cc-btn / .cc-wrap (own class, no filter badge)',
   !!ccBtn && ccBtn.classList.contains('cc-btn') && !ccBtn.classList.contains('tf-btn') &&
   !!D.querySelector('#overduePanel .cc-wrap') && !ccBtn.querySelector('.tf-cnt'),
   ccBtn ? `classes=${ccBtn.className}` : 'chooser button missing');
ok('column chooser panel uses .cc-panel, no longer .tf-panel / .cf-panel',
   !!D.querySelector('#overduePanel .cc-panel') && !D.querySelector('#overduePanel .cf-panel'),
   'chooser panel class ok');

// --- I-115 checks live in test_grid.mjs (they only need the grid kit, not the
//     full-workbook render, so they stay runnable on memory-constrained hosts). ---

// --- I-114 (c): panel-local rule-code filter (shared spec §7.10 B6 + §7.2.7 pt 6). ---
const vRule = D.querySelector('#vRule');
ok('Validation Issues panel offers a Rule select inside the panel', !!vRule && !!vRule.closest('#validationPanel .head-actions'),
   vRule ? 'rule select in head-actions' : '#vRule missing');
if (vRule) {
  const vBodyWrap = D.querySelector('#vBody') && D.querySelector('#vBody').closest('table');
  const ruleOpts = [...vRule.options].map(o => o.value).filter(Boolean);
  ok('Rule options are the codes that actually fired, with counts',
     ruleOpts.length > 0 && /^V-\d+/.test(ruleOpts[0]), ruleOpts.slice(0, 4).join(' | '));
  const beforeRows = vBodyWrap ? vBodyWrap.querySelectorAll('#vBody tr').length : 0;
  const beforeTxt = D.querySelector('#vCnt') ? D.querySelector('#vCnt').textContent.trim() : '';
  vRule.value = ruleOpts[0]; vRule.dispatchEvent(new window.Event('change'));
  const afterRows = vBodyWrap ? vBodyWrap.querySelectorAll('#vBody tr').length : 0;
  const afterTxt = D.querySelector('#vCnt') ? D.querySelector('#vCnt').textContent.trim() : '';
  // every remaining row must carry that exact rule code
  const codeColIdx = vBodyWrap ? [...vBodyWrap.querySelectorAll('thead th')].findIndex(th => th.textContent.trim() === 'Rule') : -1;
  const bad = codeColIdx >= 0 && [...vBodyWrap.querySelectorAll('#vBody tr')]
    .some(tr => tr.children[codeColIdx] && tr.children[codeColIdx].textContent.trim() !== ruleOpts[0]);
  ok('rule filter narrows the issue table to that code only', afterRows > 0 && !bad,
     `${beforeRows} -> ${afterRows}, code=${ruleOpts[0]}`);
  ok('issue count switches to "N of M issues"', /of \d+ issues/.test(afterTxt), `${beforeTxt} -> ${afterTxt}`);
  // locality: a panel-local filter must NOT touch the severity summary chips or any other panel
  ok('severity summary chips still describe the whole run (unchanged)',
     !!(D.querySelector('#vChips') && D.querySelector('#vChips').textContent.length > 0) &&
     /Error|Warning|Info/.test(D.querySelector('#vChips').textContent),
     D.querySelector('#vChips').textContent.trim());
  ok('rule filter leaves the Detail table untouched',
     D.querySelector('#detailPanel #dCnt') && /docs/.test(D.querySelector('#detailPanel #dCnt').textContent),
     D.querySelector('#detailPanel #dCnt') ? D.querySelector('#detailPanel #dCnt').textContent.trim() : 'n/a');
  vRule.value = ''; vRule.dispatchEvent(new window.Event('change'));
  ok('clearing the rule filter restores every issue', vBodyWrap.querySelectorAll('#vBody tr').length === beforeRows,
     `${vBodyWrap.querySelectorAll('#vBody tr').length} vs ${beforeRows}`);
}

let pass = 0;
for (const c of checks) { console.log((c.pass ? 'PASS' : 'FAIL') + ' - ' + c.name + (c.extra ? '  [' + c.extra + ']' : '')); if (c.pass) pass++; }
console.log(`\n${pass}/${checks.length} checks passed`);
process.exit(pass === checks.length ? 0 : 1);
