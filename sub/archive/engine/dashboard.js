// Revision 0.1 | 2026-10-24 | Codex | Added file loading and shell interaction.
import { readXlsx } from './xlsx-reader.js';
import { buildModel } from './pipeline.js';
import { deriveView, renderDashboard } from './render.js';

const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const state = { page: 'Overview', theme: localStorage.getItem('sub-dashboard-theme') || 'dark', search: '', disciplines: new Set(), stages: new Set(), statuses: new Set(), approvals: new Set(), submitters: new Set(), showWarnings: localStorage.getItem('sub-dashboard-warnings') !== 'false', rememberNames: false };
let contract;
let uiHelp;
let files = { mdl: null, log: null };
let model = null;

function setStatus(message) { $('#status-message').textContent = message; }
function updateFiles() {
  $('#mdl-file-name').textContent = files.mdl?.name || 'No MDL file selected';
  $('#log-file-name').textContent = files.log?.name || 'No Submittal Log selected';
  $('#load-button').disabled = !(files.mdl && files.log && contract);
}
function updateSidebarWidth(side, width) {
  const min = side === 'left-sidebar' ? 180 : 210;
  const max = side === 'left-sidebar' ? 460 : 440;
  const value = Math.max(min, Math.min(max, width));
  document.documentElement.style.setProperty(side === 'left-sidebar' ? '--sidebar-w' : '--right-sidebar-w', `${value}px`);
  localStorage.setItem(`sub-dashboard-${side}-width`, String(value));
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
function filtersMarkup() {
  const dimensions = [
    ['disciplines', 'Discipline', [...new Set(model.planned.map(row => row.discipline).filter(Boolean))].sort()],
    ['stages', 'Stage', [...new Set(model.planned.map(row => row.stage).filter(Boolean))].sort()],
    ['statuses', 'Submission Status', [...new Set(model.submissions.map(row => row.submissionStatus).filter(Boolean))].sort()],
    ['approvals', 'Approval Status', [...new Set(model.submissions.map(row => row.approvalStatus).filter(Boolean))].sort()],
    ['submitters', 'Submitted By', [...new Set(model.submissions.map(row => row.fields['Submitted By']).filter(Boolean))].sort()]
  ];
  state.defaultStages = new Set(model.planned.map(row => row.stage).filter(value => value && !['Deleted','Void','Superseded'].includes(value)));
  $('#global-filters').innerHTML = dimensions.map(([key, title, values]) => `<label class="filter-control">${escapeHtml(title)}<select data-filter="${key}"><option value="">All</option>${values.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}</select></label>`).join('');
  $('#global-filters').hidden = false;
  $('#search-button').hidden = false;
  $('#warnBtn').hidden = !(model.warnings.length);
}
function paint() {
  if (!model) return;
  $('[data-page-content]').hidden = false;
  $('.onboarding').hidden = true;
  const view = renderDashboard(document, model, { ...state, uiHelp });
  document.querySelectorAll('[data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === state.page));
  $('#content-title').textContent = state.page;
  $('#status-files').textContent = `MDL: ${files.mdl?.name || '—'} · Log: ${files.log?.name || '—'} · ${view.kpis.totalPlanned.toLocaleString()} planned rows`;
  showWarnings();
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem('sub-dashboard-theme', state.theme);
}
async function readAndBuild() {
  if (!files.mdl || !files.log) { setStatus('Select both workbooks.'); return; }
  $('#load-button').disabled = true;
  setStatus('Reading workbooks…');
  try {
    const [mdlBuffer, logBuffer] = await Promise.all([files.mdl.arrayBuffer(), files.log.arrayBuffer()]);
    const [mdlWorkbook, logWorkbook] = await Promise.all([readXlsx(mdlBuffer), readXlsx(logBuffer)]);
    model = buildModel(mdlWorkbook, logWorkbook, { contract, mdlWorkbookName: files.mdl.name, logWorkbookName: files.log.name });
    state.disciplines = new Set(model.planned.map(row => row.discipline).filter(Boolean));
    state.stages = new Set(model.planned.map(row => row.stage).filter(value => value && !['Deleted','Void','Superseded'].includes(value)));
    if (state.rememberNames) localStorage.setItem('sub-dashboard-file-names', JSON.stringify({ mdl: files.mdl.name, log: files.log.name }));
    filtersMarkup();
    paint();
    setStatus(uiHelp?.labels?.statusReady || 'Both workbooks loaded.');
  } catch (error) {
    model = null;
    $('[data-page-content]').hidden = false;
    $('.onboarding').hidden = true;
    $('[data-page-content]').innerHTML = `<section class="panel"><h2>Load failed</h2><p>${escapeHtml(error.message)}</p></section>`;
    setStatus('Load failed. Review the warning area.');
    const area = $('[data-shell="warnings"]');
    area.hidden = false;
    area.innerHTML = `<div class="sys-banner-item fatal"><b>W-LOAD</b> ${escapeHtml(error.message)}</div>`;
    $('#warnBtn').hidden = false;
    $('#warning-count').textContent = '1';
  } finally { updateFiles(); }
}

window._loadFiles = async (mdlFile, logFile) => { files = { mdl: mdlFile, log: logFile }; updateFiles(); await readAndBuild(); };
window._loadFile = async file => {
  if (/master document list/i.test(file.name)) files.mdl = file;
  else if (/submittal log/i.test(file.name)) files.log = file;
  updateFiles();
  if (files.mdl && files.log) await readAndBuild();
};

document.addEventListener('click', async event => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.page) { state.page = target.dataset.page; paint(); }
  if (target.dataset.shellToggle) document.body.classList.toggle(`closed-${target.dataset.shellToggle}`);
  if (target.classList.contains('sb-section-header')) target.closest('.sb-section').classList.toggle('closed');
  if (target.dataset.help) $('#context-body').textContent = uiHelp?.pages?.[target.dataset.help] || 'Select both workbooks to load dashboard data.';
  if (target.id === 'load-button') await readAndBuild();
  if (target.id === 'choose-files' || target.classList.contains('choose-workbooks')) $('#file-pair').click();
  if (target.id === 'theme-button') $('#theme-menu').hidden = !$('#theme-menu').hidden;
  if (target.dataset.themeChoice) { state.theme = target.dataset.themeChoice; $('#theme-menu').hidden = true; paint(); }
  if (target.id === 'layout-button') { const layouts = ['one','two','three']; const index = (layouts.indexOf(document.body.dataset.layout) + 1) % layouts.length; document.body.dataset.layout = layouts[index]; target.title = `${index + 1} column layout`; }
  if (target.id === 'search-button') { $('#searchPanel').classList.toggle('open'); target.setAttribute('aria-expanded', String($('#searchPanel').classList.contains('open'))); }
  if (target.id.startsWith('ccBtn_')) { const panel = document.getElementById(target.getAttribute('aria-controls')); if (panel) panel.hidden = !panel.hidden; }
  if (target.id === 'warnBtn') { state.showWarnings = !state.showWarnings; localStorage.setItem('sub-dashboard-warnings', String(state.showWarnings)); showWarnings(); }
  if (target.id === 'right-settings') { state.page = 'Settings'; paint(); }
  if (target.id === 'right-help') { state.page = 'Help'; paint(); }
  if (target.id === 'fGo') { state.search = $('#fSearch').value; state.searchCol = $('#fCol').value; paint(); $('#searchPanel').classList.remove('open'); $('#search-button').setAttribute('aria-expanded', 'false'); }
  if (target.id === 'fReset') { state.search = ''; $('#fSearch').value = ''; paint(); }
  if (target.dataset.export) {
    const rows = model ? deriveView(model, state).active : [];
    const cols = ['Document No.','Document Title','Discipline','Submitted By','Submission Date','Submission Status','Approval Status','Review Period','Target Return Date','Actual Return Date','Review Turnaround Days','Review Delay Days','Resubmission Required'];
    const text = [cols, ...rows.map(row => [row.documentNo,row.fields['Document Title'],row.discipline,row.fields['Submitted By'],row.submissionDate,row.submissionStatus,row.approvalStatus,row.fields['Review Period'],row.targetReturnDate,row.actualReturnDate,row.turnaroundDays,row.delayDays,row.resubmissionRequired])].map(row => row.map(value => `"${String(value ?? '').replaceAll('"','""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); link.download = 'submittals.csv'; link.click(); URL.revokeObjectURL(link.href);
  }
});
document.addEventListener('change', event => {
  const { filter, setting, themeChoice } = event.target.dataset;
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
  if (filter) { state[filter] = event.target.value ? new Set([event.target.value]) : new Set(filter === 'disciplines' ? model.planned.map(row => row.discipline).filter(Boolean) : filter === 'stages' ? state.defaultStages : []); paint(); }
  if (setting === 'theme') { state.theme = event.target.value; paint(); }
  if (setting === 'showWarnings') { state.showWarnings = event.target.checked; showWarnings(); }
  if (setting === 'rememberNames') { state.rememberNames = event.target.checked; localStorage.setItem('sub-dashboard-remember-names', String(state.rememberNames)); }
  if (event.target.id === 'file-pair') { const chosen = [...event.target.files]; files.mdl = chosen.find(file => /master document list/i.test(file.name)) || chosen[0]; files.log = chosen.find(file => /submittal log/i.test(file.name)) || chosen[1]; updateFiles(); }
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
  const move = pointer => updateSidebarWidth(side, startWidth + (side === 'left-sidebar' ? pointer.clientX - startX : startX - pointer.clientX));
  const end = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', end); };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', end, { once: true });
});
document.addEventListener('dragover', event => { if (event.target.closest('#file-panel')) event.preventDefault(); });
document.addEventListener('drop', event => { if (!event.target.closest('#file-panel')) return; event.preventDefault(); for (const file of event.dataTransfer.files) { if (/master document list/i.test(file.name)) files.mdl = file; if (/submittal log/i.test(file.name)) files.log = file; } updateFiles(); });

try {
  [contract, uiHelp] = await Promise.all(['./config/pipeline_contract.json','./config/ui_help.json'].map(url => fetch(url, { cache: 'no-store' }).then(response => { if (!response.ok) throw new Error(`Could not load ${url}.`); return response.json(); })));
  state.rememberNames = localStorage.getItem('sub-dashboard-remember-names') === 'true';
}
catch (error) { setStatus(error.message); }
document.documentElement.dataset.theme = state.theme;
for (const side of ['left-sidebar','right-sidebar']) {
  const value = Number(localStorage.getItem(`sub-dashboard-${side}-width`));
  if (value) updateSidebarWidth(side, value);
}
state.columnSets = {};
for (const key of ['detail','issue']) {
  try { const saved = JSON.parse(localStorage.getItem(`sub_dashboard_${key}_cols`) || 'null'); if (Array.isArray(saved)) state.columnSets[key] = saved; } catch {}
}
updateFiles();
