// Revision 0.2 | 2026-10-24 | CodeBuddy (AI) | D33: a blank Stage is counted as a planned document and a row without a Document No. is not. Exported EXCLUDED_STAGES for dashboard.js.
// Revision 0.1 | 2026-10-24 | Codex | Added S4 view derivation and dashboard rendering.

export const EXCLUDED_STAGES = new Set(['Deleted', 'Void', 'Superseded']);

/** Build the shared filtered set and all dashboard measures. @param {object} model @param {object} state @returns {object} */
export function deriveView(model, state = {}) {
  const disciplines = state.disciplines instanceof Set ? state.disciplines : new Set(model.planned.map(row => row.discipline).filter(Boolean));
  // A blank Stage is missing data, not an excluded stage. It stays in the default set so those
  // planned rows are counted, the same way MDL counts them (and flags them with V-02).
  const stages = state.stages instanceof Set ? state.stages : new Set(model.planned.map(row => row.stage ?? '').filter(value => !EXCLUDED_STAGES.has(value)));
  const statuses = state.statuses instanceof Set ? state.statuses : null;
  const approvals = state.approvals instanceof Set ? state.approvals : null;
  const submitters = state.submitters instanceof Set ? state.submitters : null;
  const query = String(state.search || '').trim().toLowerCase();
  const plansByDocument = new Map();
  for (const plan of model.planned) {
    const rows = plansByDocument.get(plan.documentNo) || [];
    if (plan.documentNo) rows.push(plan);
    plansByDocument.set(plan.documentNo, rows);
  }
  const activeSubmissions = model.submissions.filter(row => {
    const fields = row.fields;
    const submitter = String(fields['Submitted By'] || '');
    const searchValue = state.searchCol === 'document' ? row.documentNo : state.searchCol === 'title' ? fields['Document Title'] : state.searchCol === 'submitter' ? submitter : [row.documentNo, fields['Document Title'], row.discipline, submitter].join(' ');
    const haystack = String(searchValue || '').toLowerCase();
    const plans = row.linkedPlannedId ? [model.planned.find(plan => plan.id === row.linkedPlannedId)].filter(Boolean) : plansByDocument.get(row.documentNo) || [];
    const stageMatch = !stages.size || plans.length === 0 || plans.some(plan => stages.has(plan.stage));
    return (!disciplines.size || disciplines.has(row.discipline))
      && stageMatch
      && (!statuses || !statuses.size || statuses.has(row.submissionStatus))
      && (!approvals || !approvals.size || approvals.has(row.approvalStatus))
      && (!submitters || !submitters.size || submitters.has(submitter))
      && (!query || haystack.includes(query));
  });
  const activePlans = model.planned.filter(row => {
    // A row without a Document No. is a V-01 defect, not a planned document. MDL does not count
    // it, so it is not counted here either.
    if (!row.documentNo) return false;
    const linked = row.submissions;
    const hasSubmissionFilter = Boolean(statuses?.size || approvals?.size || submitters?.size);
    const passesSubmissionFilters = hasSubmissionFilter ? linked.some(item => activeSubmissions.includes(item)) : true;
    const searchValue = state.searchCol === 'document' ? row.documentNo : state.searchCol === 'title' ? row.title : state.searchCol === 'submitter' ? linked.map(item => item.fields['Submitted By']).join(' ') : [row.documentNo, row.title, row.discipline, row.stage, linked.map(item => item.fields['Submitted By']).join(' ')].join(' ');
    const haystack = String(searchValue || '').toLowerCase();
    return (!disciplines.size || disciplines.has(row.discipline)) && (!stages.size || stages.has(row.stage ?? '')) && passesSubmissionFilters && (!query || haystack.includes(query));
  });
  const submittedPlans = activePlans.filter(row => row.isSubmitted);
  const approved = activeSubmissions.filter(row => row.flagApproved).length;
  const dated = activeSubmissions.filter(row => row.delayDays !== null);
  const onTime = dated.filter(row => row.flagOnTime).length;
  const delays = dated.map(row => row.delayDays);
  const delayMean = delays.length ? delays.reduce((sum, value) => sum + value, 0) / delays.length : 0;
  const issueRows = model.issues.filter(issue => !issue.discipline || disciplines.has(issue.discipline));
  const byMonth = new Map();
  for (const row of activeSubmissions) {
    if (!row.month) continue;
    const item = byMonth.get(row.month) || { month: row.month, total: 0, status: {}, delay: [] };
    item.total += 1;
    item.status[row.submissionStatus] = (item.status[row.submissionStatus] || 0) + 1;
    if (row.delayDays !== null) item.delay.push(row.delayDays);
    byMonth.set(row.month, item);
  }
  const monthly = [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month));
  return {
    active: activeSubmissions,
    activePlans,
    issues: issueRows,
    monthly,
    kpis: {
      totalPlanned: activePlans.length,
      // D32 — a repeated Document No. is the same document, so the card counts distinct documents.
      totalSubmissions: new Set(activeSubmissions.map(row => String(row.documentNo || '').trim().toUpperCase())).size,
      submitted: submittedPlans.length,
      underReview: activeSubmissions.filter(row => row.submissionStatus === 'SUR').length,
      approved,
      onTimeRate: dated.length ? onTime / dated.length : 0,
      averageDelay: delayMean,
      overdue: activeSubmissions.filter(row => !row.actualReturnDate && row.delayDays > 0).length,
      issueCount: issueRows.length
    }
  };
}

/** Render dashboard content from one derived view. @param {Document} doc @param {object} model @param {object} state @returns {object} */
export function renderDashboard(doc, model, state = {}) {
  const view = deriveView(model, state);
  const root = doc.querySelector('[data-page-content]');
  if (!root) return view;
  const page = state.page || 'Overview';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  // §5 — a card is exactly two lines: value and label. The status class colours the 3 px top strip.
  const card = (label, value, status = '') => `<article class="kpi-card${status ? ` ${status}` : ''}"><div class="v">${esc(value)}</div><div class="l">${esc(label)}</div></article>`;
  const tableRows = new Map();
  const table = (headers, rows, key = null) => {
    const chosen = key && Array.isArray(state.columnSets?.[key]) ? new Set(state.columnSets[key]) : new Set(headers.map((_, index) => index));
    const indexes = headers.map((_, index) => index).filter(index => chosen.has(index));
    const windowed = Boolean(key && rows.length > 500);
    if (key) tableRows.set(key, { headers, rows, indexes, windowed });
    const countId = key === 'detail' ? 'dCnt' : key === 'issue' ? 'vCnt' : '';
    const shown = windowed ? Math.min(120, rows.length) : rows.length;
    const renderRow = row => `<tr>${indexes.map(index => `<td${key ? ` data-col="${index}"${index < 2 ? ' class="ds-pinned"' : ''}` : ''}>${esc(row[index])}</td>`).join('')}</tr>`;
    const colgroup = indexes.map((index, pos) => `<col${key ? ` data-col="${index}"${pos === 0 ? ' style="width:150px"' : ''}` : ''}>`).join('');
    const heads = indexes.map((index, pos) => `<th${key ? ` data-col="${index}"${pos < 2 ? ' class="ds-pinned"' : ''}` : ''}>${esc(headers[index])}${key ? `<span class="ds-resize" data-col="${index}" role="separator" aria-label="Resize ${esc(headers[index])}"></span>` : ''}</th>`).join('');
    const body = rows.length ? `${windowed ? '<tr class="win-pad"><td colspan="' + indexes.length + '" style="height:0px;padding:0"></td></tr>' : ''}${rows.slice(0, shown).map(renderRow).join('')}${windowed ? '<tr class="win-pad"><td colspan="' + indexes.length + '" style="height:' + Math.max(0, rows.length - shown) * 40 + 'px;padding:0"></td></tr>' : ''}` : `<tr><td class="empty" colspan="${indexes.length}">No rows match the current selection.</td></tr>`;
    const controls = key ? `<div class="table-tools"><span id="${countId}">${windowed ? `${shown} of ${rows.length}` : `${rows.length} of ${rows.length}`}</span><button class="btn-secondary" id="ccBtn_${key}" aria-controls="ccPanel_${key}">Columns</button><div class="column-chooser" id="ccPanel_${key}" hidden>${headers.map((label, index) => index < 2 ? '' : `<label class="cc-row"><input type="checkbox" data-column-choice="${key}" data-column-index="${index}"${chosen.has(index) ? ' checked' : ''}> ${esc(label)}</label>`).join('')}</div></div>` : '';
    return `${controls}<div class="table-scroll tableScroll"><table class="ds-table"${key ? ` data-table-key="${key}" data-column-count="${headers.length}"` : ''}${windowed ? ' data-windowed="true"' : ''}><colgroup>${colgroup}</colgroup><thead><tr>${heads}</tr></thead><tbody>${body}</tbody></table></div>`;
  };
  // §4 — `data-panel` is assigned after insertion, in document order, and only to top-level panels;
  // nested sub-panels inherit their parent's number and show no badge of their own.
  const activePanel = (name, content, full = false) => {
    const collapsed = Array.isArray(state.collapsedPanels) && state.collapsedPanels.includes(name);
    const label = collapsed ? 'Expand' : 'Collapse';
    // §4 — Help is the first child of the cluster and the collapse toggle is rightmost.
    return `<section class="panel${full ? ' full' : ''}${collapsed ? ' collapsed' : ''}"><header class="panel-head"><h2>${esc(name)}</h2><div class="panel-actions"><button class="icon-btn help-open" data-help="${esc(name)}" aria-label="Help for ${esc(name)}" title="Help">?</button><button class="icon-btn panel-toggle" data-panel-toggle="${esc(name)}" aria-expanded="${collapsed ? 'false' : 'true'}" aria-label="${label} ${esc(name)}" title="${label}">${collapsed ? '+' : '−'}</button></div></header>${content}</section>`;
  };
  const barChart = (data, labelKey, valueKey) => {
    const max = Math.max(1, ...data.map(item => Number(item[valueKey]) || 0));
    return `<div class="bar-chart" role="img" aria-label="${esc(labelKey)} chart">${data.slice(-12).map(item => `<div class="bar-row"><span>${esc(item[labelKey])}</span><div class="bar-track"><i style="width:${Math.max(2, (Number(item[valueKey]) || 0) / max * 100)}%"></i></div><b>${esc(item[valueKey])}</b></div>`).join('') || '<p class="empty">No dated records.</p>'}</div>`;
  };
  const overview = () => {
    const k = view.kpis;
    const statusData = Object.entries(view.active.reduce((map, row) => { map[row.submissionStatus || 'Blank'] = (map[row.submissionStatus || 'Blank'] || 0) + 1; return map; }, {})).map(([status, count]) => ({ status, count }));
    const disciplinesData = Object.entries(view.active.reduce((map, row) => { map[row.discipline || 'Unknown'] = (map[row.discipline || 'Unknown'] || 0) + 1; return map; }, {})).map(([discipline, count]) => ({ discipline, count })).sort((a, b) => b.count - a.count).slice(0, 12);
    return `${activePanel('KPI OVERVIEW', `<div class="kpi-grid">${card('Documents Logged', k.totalSubmissions)}<article class="kpi-card"><div class="v">${k.submitted} / <span data-kpi="totalPlanned">${k.totalPlanned}</span></div><div class="l">Documents Submitted / In Plan</div></article>${card('Under Review (SUR)', k.underReview, 'amb')}${card('Approved (APP + AWC)', k.approved, 'ok')}${card('On-Time Return Rate', `${(k.onTimeRate * 100).toFixed(1)}%`, k.onTimeRate >= 1 ? 'ok' : 'amb')}${card('Average Review Delay', `${k.averageDelay.toFixed(1)} days`, k.averageDelay > 0 ? 'warn' : 'ok')}</div>`)}
      <div class="panel-grid">${activePanel('C1 Schedule Performance', barChart(view.monthly.map(row => ({ month: row.month.slice(0, 7), planned: view.activePlans.filter(plan => (plan.fields['Planned 1st Issue Date'] || '').slice?.(0, 7) === row.month.slice(0, 7)).length + row.total })), 'month', 'planned'), true)}${activePanel('C2 Submission Flow & Delay', barChart(view.monthly.map(row => ({ month: row.month.slice(0, 7), total: row.total })), 'month', 'total'))}${activePanel('C3 Breakdown', barChart(disciplinesData, 'discipline', 'count'))}</div>`;
  };
  const submissions = () => {
    const rows = view.active.map(row => [row.documentNo, row.fields['Document Title'], row.discipline, row.fields['Submitted By'], row.submissionDate, row.submissionStatus, row.approvalStatus, row.fields['Review Period'], row.targetReturnDate, row.actualReturnDate, row.turnaroundDays, row.delayDays, row.resubmissionRequired]);
    return activePanel('Submittals', `<div class="table-tools"><span>${rows.length} submission records</span><button class="btn-secondary" data-export="submittals">⤓ CSV</button></div>${table(['Document No.', 'Title', 'Discipline', 'Submitted By', 'Submission Date', 'Submission Status', 'Approval Status', 'Review Period', 'Target Return', 'Actual Return', 'Turnaround', 'Delay', 'Resubmission Required'], rows, 'detail')}`, true);
  };
  const validation = () => {
    const counts = new Map();
    for (const issue of view.issues) counts.set(issue.code, (counts.get(issue.code) || 0) + 1);
    const rules = [...counts].map(([code, count]) => { const item = model.contract.errorRules.find(rule => rule.code === code) || {}; return [item.severity || 'Warning', code, item.group || 'Business rule', item.rule || 'Description is not in the workbook Code sheet.', count]; });
    const issueRows = view.issues.map(issue => [issue.severity, issue.code, issue.documentNo, issue.field, issue.value, issue.message, issue.sheet, issue.row]);
    return activePanel('Validation', `<p class="note" data-validation-count>${issueRows.length} issues. Rule text comes from the workbook Code sheet.</p><div class="summary-chips"><span class="vchip e">Error ${view.issues.filter(x => String(x.severity).toLowerCase() === 'error').length}</span><span class="vchip w">Warning ${view.issues.filter(x => String(x.severity).toLowerCase() === 'warning').length}</span><span class="vchip i">Info ${view.issues.filter(x => String(x.severity).toLowerCase() === 'info').length}</span></div><details><summary>Code map and issue details</summary><div class="note">${model.contract.mdlFields.length} MDL fields and ${model.contract.logHeaders.length} log headers loaded. ${model.contract.errorRules.length} validation rules loaded.</div><h3>Rules</h3>${table(['Severity', 'Code', 'Group', 'Description', 'Count'], rules)}<h3>Issues</h3>${table(['Severity', 'Rule', 'Doc No.', 'Field', 'Value', 'Message', 'Source Tab', 'Row'], issueRows, 'issue')}</details>`, true);
  };
  const coverage = () => {
    const plans = view.activePlans.filter(row => !row.isSubmitted);
    return activePanel('Forward Plan · Coverage', `<p class="note">${view.kpis.submitted} submitted of ${view.kpis.totalPlanned} planned rows.</p>${table(['Document No.', 'Title', 'Discipline', 'Stage', 'Planned 1st Issue Date', 'Forecast 1st Issue Date'], plans.map(row => [row.documentNo, row.title, row.discipline, row.stage, row.fields['Planned 1st Issue Date'], row.fields['Forecast 1st Issue Date']]))}`, true);
  };
  const analytics = () => `${activePanel('Bottleneck KPIs', `<div class="kpi-grid">${card('Overdue Open', view.kpis.overdue)}${card('Open SUR', view.active.filter(row => row.submissionStatus === 'SUR' && !row.actualReturnDate).length)}${card('Rework', view.active.filter(row => row.flagResubmission).length)}${card('Average Delay', `${view.kpis.averageDelay.toFixed(1)} days`)}${card('Due in 4 Weeks', model.planned.filter(row => row.fields['Planned 1st Issue Date'] >= model.meta.asOfDate).length)}</div>`)}<div class="panel-grid">${activePanel('C4 Turnaround & Aging', barChart(view.active.filter(row => row.delayDays > 0).map(row => ({ documentNo: row.documentNo, delay: row.delayDays })).sort((a, b) => b.delay - a.delay).slice(0, 20), 'documentNo', 'delay'))}${activePanel('C5 Forward Plan', coverage())}</div>`;
  const help = () => { const copy = state.uiHelp?.pages || {}; const glossary = state.uiHelp?.statusGlossary || {}; return activePanel('Help', `<p>${esc(copy.Help || 'Load both workbooks and use the shared filters.')}</p><p>${esc(state.uiHelp?.filePanel?.instructions || '')}</p><p>Source files: ${esc(model.meta.mdlWorkbookName)} and ${esc(model.meta.logWorkbookName)}.</p><h3>Status glossary</h3>${Object.entries(glossary).flatMap(([group, items]) => Object.entries(items).map(([code, label]) => `<p><b>${esc(group)} · ${esc(code)}</b> — ${esc(label)}</p>`)).join('')}`); };
  const settings = () => activePanel('Settings', `<label>Theme <select data-setting="theme">${['dark','light','sky','ocean','presentation'].map(theme => `<option value="${theme}"${(state.theme || 'dark') === theme ? ' selected' : ''}>${theme}</option>`).join('')}</select></label><label><input type="checkbox" data-setting="showWarnings"${state.showWarnings === false ? '' : ' checked'}> Show warnings</label><label><input type="checkbox" data-setting="rememberNames"${state.rememberNames ? ' checked' : ''}> Remember workbook names</label>`);
  const views = { Overview: overview, Submittals: submissions, Validation: validation, 'Forward Plan': coverage, Analytical: analytics, Help: help, Settings: settings };
  root.innerHTML = (views[page] || overview)();
  // §4 — the number must follow DOCUMENT order, so it is assigned after insertion. Call order is not
  // reliable: a page can build a panel's HTML before the point where it is placed.
  if (typeof root.querySelectorAll === 'function') {
    const panels = [...root.querySelectorAll('.panel')];
    panels.filter(node => !node.parentElement.closest('.panel'))
      .forEach((node, index) => { node.dataset.panel = String(index + 1); });
    panels.filter(node => node.parentElement.closest('.panel'))
      .forEach(node => { delete node.dataset.panel; });
  }
  for (const tableNode of typeof root.querySelectorAll === 'function' ? root.querySelectorAll('[data-windowed="true"]') : []) {
    const scroll = tableNode.closest('.tableScroll');
    const tbody = tableNode.querySelector('tbody');
    const tableData = tableRows.get(tableNode.dataset.tableKey);
    if (!scroll || !tbody || !tableData) continue;
    scroll.addEventListener('scroll', () => {
      const first = Math.max(0, Math.floor(scroll.scrollTop / 40) - 3);
      const last = Math.min(tableData.rows.length, first + 120);
      const rowHtml = tableData.rows.slice(first, last).map(row => `<tr>${tableData.indexes.map(index => `<td data-col="${index}"${index < 2 ? ' class="ds-pinned"' : ''}>${esc(row[index])}</td>`).join('')}</tr>`).join('');
      tbody.innerHTML = `<tr class="win-pad"><td colspan="${tableData.indexes.length}" style="height:${first * 40}px;padding:0"></td></tr>${rowHtml}<tr class="win-pad"><td colspan="${tableData.indexes.length}" style="height:${Math.max(0, tableData.rows.length - last) * 40}px;padding:0"></td></tr>`;
      const count = root.querySelector('#vCnt, #dCnt');
      if (count) count.textContent = `${last - first} of ${tableData.rows.length}`;
    }, { passive: true });
  }
  return view;
}
