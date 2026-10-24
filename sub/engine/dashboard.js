// Revision 2.3 | 2026-10-24 | CodeBuddy (AI) | D33: the Stage filter lists (blank) plus Deleted, Void and Superseded, and its badge is measured against the default ticked set.
// Revision 2.2 | 2026-10-24 | CodeBuddy (AI) | Option B shell (MDL two-row header + left nav sidebar). Engine contract unchanged; UI handlers rewired to menu bar + modals.
import { readXlsx } from './xlsx-reader.js';
import { buildModel, inspectWorkbook } from './pipeline.js';
import { deriveView, renderDashboard, EXCLUDED_STAGES } from './render.js';

const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const state = { page: 'Overview', theme: localStorage.getItem('sub-dashboard-theme') || 'light', search: '', searchCol: 'all', disciplines: new Set(), stages: new Set(), statuses: new Set(), approvals: new Set(), submitters: new Set(), showWarnings: localStorage.getItem('sub-dashboard-warnings') !== 'false', rememberNames: false, columnSets: {}, collapsedPanels: [] };
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
let filterDimensions = [];
function filtersMarkup() {
  // Stage lists every stored value plus the three excluded stages, so the filter shows the whole
  // Stage domain even when no row uses it. A blank Stage appears as "(blank)".
  const stageValues = [...new Set([...model.planned.map(row => row.stage ?? ''), ...EXCLUDED_STAGES])].sort();
  filterDimensions = [
    ['disciplines', 'Discipline', [...new Set(model.planned.map(row => row.discipline).filter(Boolean))].sort()],
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
}
function paint() {
  if (!model) return;
  $('[data-page-content]').hidden = false;
  document.body.classList.add('loaded');
  const view = renderDashboard(document, model, { ...state, uiHelp });
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
    state.disciplines = new Set(model.planned.map(row => row.discipline).filter(Boolean));
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
  if (target.dataset.export) {
    const rows = model ? deriveView(model, state).active : [];
    const cols = ['Document No.', 'Document Title', 'Discipline', 'Submitted By', 'Submission Date', 'Submission Status', 'Approval Status', 'Review Period', 'Target Return Date', 'Actual Return Date', 'Review Turnaround Days', 'Review Delay Days', 'Resubmission Required'];
    const text = [cols, ...rows.map(row => [row.documentNo, row.fields['Document Title'], row.discipline, row.fields['Submitted By'], row.submissionDate, row.submissionStatus, row.approvalStatus, row.fields['Review Period'], row.targetReturnDate, row.actualReturnDate, row.turnaroundDays, row.delayDays, row.resubmissionRequired])].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); link.download = 'submittals.csv'; link.click(); URL.revokeObjectURL(link.href);
  }
});
document.addEventListener('click', event => { if (event.target.classList?.contains('modal')) closeModal(event.target.id); });
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
    const colIndex = Number(grip.dataset.col);
    const col = table.querySelector(`col[data-col="${colIndex}"]`);
    const startX = event.clientX;
    const startWidth = col.getBoundingClientRect().width;
    const widths = JSON.parse(localStorage.getItem(`sub_dashboard_${table.dataset.tableKey}_widths`) || '{}');
    const saveWidths = () => localStorage.setItem(`sub_dashboard_${table.dataset.tableKey}_widths`, JSON.stringify(widths));
    const move = pointer => { const width = Math.max(60, startWidth + pointer.clientX - startX); col.style.width = `${width}px`; if (colIndex === 0) table.style.setProperty('--pin-first-col', `${width}px`); widths[colIndex] = width; saveWidths(); };
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
