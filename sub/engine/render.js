// Revision 0.3 | 2026-10-25 | CodeBuddy (AI) | Added the C3 Breakdown panel (workplan D36). `deriveView` returns `c3`: one classified row per active submission (`isNew`, `seq`, `submissionStatus`, `actualReturnDate`), the month list, and `planCount(dimKey, dimVal, month)` which tallies Master Document List rows for Total Plan. `renderDashboard` draws two series per dimension value — Submissions (New + Resubmission) and Approval Status (the five codes) — as horizontal bars or two concentric rings inside a §4.2 component board, then renders the summary table in the shared `.ds-table` style with a Total footer row. `table()` gained an optional `footer` argument; callers that pass nothing are unchanged.
// Revision 0.2 | 2026-10-24 | CodeBuddy (AI) | D33: a blank Stage is counted as a planned document and a row without a Document No. is not. Exported EXCLUDED_STAGES for dashboard.js.
// Revision 0.1 | 2026-10-24 | Codex | Added S4 view derivation and dashboard rendering.

export const EXCLUDED_STAGES = new Set(['Deleted', 'Void', 'Superseded']);
// D36 — the C3 Breakdown approval palette. The order drives the stacked segments and the legend.
export const APPROVAL_CODES = ['APP', 'AWC', 'NAP', 'REJ', 'INF'];

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
  // D34 — the Submittal Log is a submission history; one Document No. can appear in several rows
  // (revisions). Under Review and Approved count documents, not rows. Group the filtered submissions
  // by Document No., order each group by Submission Date, and apply one representative rule per document.
  const submissionsByDoc = new Map();
  for (const row of activeSubmissions) {
    const key = String(row.documentNo || '').trim().toUpperCase();
    if (!key) continue; // a blank Document No. is a V-01 defect, not a counted document
    const group = submissionsByDoc.get(key) || [];
    group.push(row);
    submissionsByDoc.set(key, group);
  }
  const documentGroups = [...submissionsByDoc.values()].map(group => [...group].sort((a, b) => (a.submissionDate || '9999-12-31').localeCompare(b.submissionDate || '9999-12-31')));
  const underReview = documentGroups.filter(rows => {
    const latest = rows[rows.length - 1];
    return latest.submissionStatus === 'SUR' && !latest.actualReturnDate;
  }).length;
  const approved = documentGroups.filter(rows => rows.some(row => row.flagApproved)).length;
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
  // ===== C1 Schedule Performance (S-Curve) — workplan D35 =====
  const c1 = (() => {
    const validDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v);
    const ym = v => v.slice(0, 7);
    const plannedDates = activePlans.map(p => p.fields['Planned 1st Issue Date']).filter(validDate);
    const subDates = activeSubmissions.map(s => s.submissionDate).filter(validDate);
    const asOfYm = (model.meta && model.meta.asOfDate || '').slice(0, 7);
    const all = [...plannedDates, ...subDates].filter(Boolean);
    if (!all.length) return { months: [], empty: true };
    let start = all.reduce((a, b) => a < b ? a : b);
    let end = all.reduce((a, b) => a > b ? a : b);
    if (asOfYm && asOfYm > end) end = asOfYm;
    let [ey, em] = end.split('-').map(Number);
    end = em === 12 ? `${ey + 1}-01` : `${ey}-${String(em + 1).padStart(2, '0')}`;
    const months = [];
    let [cy, cm] = start.split('-').map(Number);
    while (`${cy}-${String(cm).padStart(2, '0')}` <= end) { months.push(`${cy}-${String(cm).padStart(2, '0')}`); if (cm === 12) { cm = 1; cy++; } else cm++; }
    const idx = new Map(months.map((m, i) => [m, i]));
    const pNew = new Array(months.length).fill(0);
    const aFNew = new Array(months.length).fill(0);
    const aRNew = new Array(months.length).fill(0);
    const fNew = new Array(months.length).fill(0);
    for (const p of activePlans) { const d = p.fields['Planned 1st Issue Date']; if (validDate(d) && idx.has(ym(d))) pNew[idx.get(ym(d))]++; }
    for (const p of activePlans) { const d = p.fields['Forecast 1st Issue Date']; if (validDate(d) && idx.has(ym(d))) fNew[idx.get(ym(d))]++; }
    const byDoc = new Map(); const blankRows = [];
    for (const s of activeSubmissions) {
      if (!validDate(s.submissionDate)) continue;
      const key = String(s.documentNo || '').trim().toUpperCase();
      if (!key) { blankRows.push(s); continue; }
      const g = byDoc.get(key) || []; g.push(s); byDoc.set(key, g);
    }
    for (const g of byDoc.values()) {
      const sorted = [...g].sort((a, b) => (a.submissionDate || '9').localeCompare(b.submissionDate || '9'));
      const fi = idx.get(ym(sorted[0].submissionDate)); if (fi != null) aFNew[fi]++;
      for (let i = 1; i < sorted.length; i++) { const ri = idx.get(ym(sorted[i].submissionDate)); if (ri != null) aRNew[ri]++; }
    }
    for (const s of blankRows) { const ri = idx.get(ym(s.submissionDate)); if (ri != null) aRNew[ri]++; }
    const cum = arr => arr.reduce((acc, v, i) => { acc.push((acc[i - 1] || 0) + v); return acc; }, []);
    const pCum = cum(pNew); const aFCum = cum(aFNew); const aRCum = cum(aRNew);
    const hasMdlForecast = activePlans.some(p => validDate(p.fields['Forecast 1st Issue Date']));
    const fCum = hasMdlForecast
      ? cum(activePlans.reduce((acc, p) => { const d = p.fields['Forecast 1st Issue Date']; if (validDate(d) && idx.has(ym(d))) acc[idx.get(ym(d))]++; return acc; }, new Array(months.length).fill(0)))
      : pCum.map(v => +(v * 1.04).toFixed(2));
    return { months, pNew, aFNew, aRNew, fNew, pCum, aFCum, aRCum, fCum, hasMdlForecast, empty: false,
      projectStart: (model.meta && model.meta.projectStartDate) || start, asOf: (model.meta && model.meta.asOfDate) || end };
  })();
  // ===== C3 Breakdown (workplan D36) =====
  // New = each Document No.'s first submission by Submission Date — a document can have only one
  // first submission. Resubmission = every later row for that document, counted per record and
  // ignoring Document No., because a document can be submitted twice in one month. A blank
  // Document No. cannot be attributed to a document, so such rows are always Resubmissions (D35).
  const c3 = (() => {
    const byKey = new Map(); const blanks = [];
    for (const row of activeSubmissions) {
      const key = String(row.documentNo || '').trim().toUpperCase();
      if (!key) { blanks.push(row); continue; }
      const group = byKey.get(key) || []; group.push(row); byKey.set(key, group);
    }
    const rows = [];
    const push = (row, doc, seq) => rows.push({
      doc, seq, isNew: seq === 0,
      discipline: row.discipline || 'Unknown',
      submitter: String(row.fields['Submitted By'] || 'Unknown'),
      month: String(row.month || row.submissionDate || '').slice(0, 7),
      approvalStatus: row.approvalStatus,
      // Under Review needs both: SUR marks the row, a blank Actual Return Date keeps it open (D34).
      submissionStatus: row.submissionStatus,
      actualReturnDate: row.actualReturnDate
    });
    for (const group of byKey.values()) {
      const sorted = [...group].sort((a, b) => (a.submissionDate || '9999-12-31').localeCompare(b.submissionDate || '9999-12-31'));
      sorted.forEach((row, index) => push(row, String(row.documentNo).trim().toUpperCase(), index));
    }
    for (const row of blanks) push(row, '', -1);
    const months = [...new Set(rows.map(row => row.month).filter(Boolean))].sort();
    // Total Plan reads the Master Document List. It carries no submitter column, so a plan row can
    // reach a submitter only through the submission rows linked to it; unlinked rows cannot be
    // attributed and do not appear in the Submitter view. An empty month key holds the rows whose
    // Planned 1st Issue Date is blank, which All months still counts.
    const validPlanDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value);
    const planTally = new Map();
    const bump = (dimKey, dimVal, planMonth) => {
      const byValue = planTally.get(dimKey) || new Map();
      const byMonth = byValue.get(dimVal) || new Map();
      byMonth.set(planMonth, (byMonth.get(planMonth) || 0) + 1);
      byValue.set(dimVal, byMonth);
      planTally.set(dimKey, byValue);
    };
    for (const plan of activePlans) {
      const date = plan.fields['Planned 1st Issue Date'];
      const planMonth = validPlanDate(date) ? date.slice(0, 7) : '';
      bump('discipline', plan.discipline || 'Unknown', planMonth);
      const linked = new Set((plan.submissions || []).map(item => String(item.fields['Submitted By'] || 'Unknown')));
      for (const submitter of linked) bump('submitter', submitter, planMonth);
    }
    const planCount = (dimKey, dimVal, month) => {
      const byMonth = planTally.get(dimKey)?.get(dimVal);
      if (!byMonth) return 0;
      if (month !== 'ALL') return byMonth.get(month) || 0;
      // All months spans every planned month plus the rows whose Planned 1st Issue Date is blank.
      let total = 0;
      for (const value of byMonth.values()) total += value;
      return total;
    };
    return { months, rows, planCount };
  })();
  return {
    active: activeSubmissions,
    activePlans,
    issues: issueRows,
    monthly,
    c1,
    c3,
    kpis: {
      totalPlanned: activePlans.length,
      // D32 — a repeated Document No. is the same document, so the card counts distinct documents.
      totalSubmissions: new Set(activeSubmissions.map(row => String(row.documentNo || '').trim().toUpperCase())).size,
      submitted: submittedPlans.length,
      underReview,
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
  const table = (headers, rows, key = null, footer = null) => {
    const chosen = key && Array.isArray(state.columnSets?.[key]) ? new Set(state.columnSets[key]) : new Set(headers.map((_, index) => index));
    const indexes = headers.map((_, index) => index).filter(index => chosen.has(index));
    const windowed = Boolean(key && rows.length > 500);
    if (key) tableRows.set(key, { headers, rows, indexes, windowed });
    const countId = key === 'detail' ? 'dCnt' : key === 'issue' ? 'vCnt' : '';
    const shown = windowed ? Math.min(120, rows.length) : rows.length;
    // A column is numeric when every non-empty value in it is a number, so the right alignment
    // follows the data instead of a hand-kept list of column names.
    const numeric = new Set(indexes.filter(index => {
      const values = rows.map(row => String(row[index] ?? '').trim()).filter(Boolean);
      return values.length > 0 && values.every(value => /^-?[\d,]+(?:\.\d+)?$/.test(value));
    }));
    const cellAttrs = index => {
      const classes = [];
      if (numeric.has(index)) classes.push('num');
      if (key && index < 2) classes.push('ds-pinned');
      return `${key ? ` data-col="${index}"` : ''}${classes.length ? ` class="${classes.join(' ')}"` : ''}`;
    };
    const renderRow = row => `<tr>${indexes.map(index => `<td${cellAttrs(index)}>${esc(row[index])}</td>`).join('')}</tr>`;
    const colgroup = indexes.map((index, pos) => `<col${key ? ` data-col="${index}"${pos === 0 ? ' style="width:150px"' : ''}` : ''}>`).join('');
    const heads = indexes.map(index => `<th scope="col"${cellAttrs(index)}><span class="th-wrap"><span class="lb">${esc(headers[index])}</span></span>${key ? `<span class="ds-resize" data-col="${index}" role="separator" aria-label="Resize ${esc(headers[index])}"></span>` : ''}</th>`).join('');
    const body = rows.length ? `${windowed ? '<tr class="win-pad"><td colspan="' + indexes.length + '" style="height:0px;padding:0"></td></tr>' : ''}${rows.slice(0, shown).map(renderRow).join('')}${windowed ? '<tr class="win-pad"><td colspan="' + indexes.length + '" style="height:' + Math.max(0, rows.length - shown) * 40 + 'px;padding:0"></td></tr>' : ''}` : `<tr><td class="empty" colspan="${indexes.length}">No rows match the current selection.</td></tr>`;
    const controls = key ? `<div class="table-tools"><span id="${countId}">${windowed ? `${shown} of ${rows.length}` : `${rows.length} of ${rows.length}`}</span><button class="btn-secondary" id="ccBtn_${key}" aria-controls="ccPanel_${key}">Columns</button><div class="column-chooser" id="ccPanel_${key}" hidden>${headers.map((label, index) => index < 2 ? '' : `<label class="cc-row"><input type="checkbox" data-column-choice="${key}" data-column-index="${index}"${chosen.has(index) ? ' checked' : ''}> ${esc(label)}</label>`).join('')}</div></div>` : '';
    const foot = footer ? `<tfoot><tr>${indexes.map(index => `<td${cellAttrs(index)}>${esc(footer[index])}</td>`).join('')}</tr></tfoot>` : '';
    // §7.2.15 — the header fragment carries one extra trailing column for the scrollbar (.ds-gut), so
    // the navy band runs the full card width and the body's scrollbar starts below it.
    // The fragment carries the same table key as its body, because the resize grips live here and
    // persist their widths under that key (§7.2.6 / D40).
    const headFrag = `<div class="vheadwrap"><table class="ds-table vheadtab"${key ? ` data-table-key="${key}"` : ''}><colgroup>${colgroup}<col class="ds-gut"></colgroup><thead><tr>${heads}<th class="ds-gut" scope="col" aria-hidden="true"></th></tr></thead></table></div>`;
    return `${controls}<div class="ds-split splitcard">${headFrag}<div class="tableScroll"><table class="ds-table"${key ? ` data-table-key="${key}" data-column-count="${headers.length}"` : ''}${windowed ? ' data-windowed="true"' : ''}><colgroup>${colgroup}</colgroup><tbody>${body}</tbody>${foot}</table></div></div>`;
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
  // ===== C1 Schedule Performance S-Curve (workplan D35) =====
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const niceCeil = value => { if (!(value > 0)) return 5; const p = Math.pow(10, Math.floor(Math.log10(value))); const f = value / p; const m = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10; return m * p; };
  const fmtMonth = ym => { const [y, m] = ym.split('-').map(Number); return `${MONTH_NAMES[m - 1]} ${y}`; };
  const bucketKey = (ym, g) => { if (g === 'month') return ym; if (g === 'quarter') { const [y, m] = ym.split('-').map(Number); return `${y}-Q${Math.floor((m - 1) / 3) + 1}`; } return ym.slice(0, 4); };
  const bucketLabel = (ym, g) => { if (g === 'month') return fmtMonth(ym); if (g === 'quarter') { const [y, m] = ym.split('-').map(Number); return `Q${Math.floor((m - 1) / 3) + 1} ${y}`; } return ym.slice(0, 4); };
  const c1Controls = (c1, st) => {
    if (c1.empty) return '';
    const grain = st.c1Grain || 'month';
    const bars = st.c1Bars !== false;
    const series = st.c1Series instanceof Set ? st.c1Series : new Set(['plan', 'forecast', 'actualFirst', 'actualResub']);
    const all = ['plan', 'forecast', 'actualFirst', 'actualResub'];
    const period = st.c1Period instanceof Array && st.c1Period.length === 2 ? st.c1Period : [0, c1.months.length - 1];
    const n = c1.months.length;
    const seg = g => `<button class="seg-btn${grain === g ? ' active' : ''}" data-c1grain="${g}">${g === 'month' ? 'Month' : g === 'quarter' ? 'Quarter' : 'Year'}</button>`;
    const sItems = all.map(v => `<label class="tf-item"><input type="checkbox" data-c1series="${v}"${series.has(v) ? ' checked' : ''}><span>${v === 'plan' ? 'Plan' : v === 'forecast' ? 'Forecast' : v === 'actualFirst' ? 'Actual First' : 'Actual Resub'}</span></label>`).join('');
    const masterChecked = series.size >= all.length ? ' checked' : '';
    const cnt = (series.size > 0 && series.size < all.length) ? String(series.size) : '';
    return `<div class="c1-controls">
      <div class="controls-left">
        <span class="c1-period-label">Period</span>
        <label class="c1-range-wrap">From <input type="range" class="c1-range" min="0" max="${n - 1}" value="${period[0]}" data-c1period="from" aria-label="Period start"></label>
        <label class="c1-range-wrap">To <input type="range" class="c1-range" min="0" max="${n - 1}" value="${period[1]}" data-c1period="to" aria-label="Period end"></label>
        <span class="c1-period-text" id="c1PeriodText">${fmtMonth(c1.months[period[0]])} – ${fmtMonth(c1.months[period[1]])}</span>
      </div>
      <div class="controls-right">
        <div class="seg" role="group" aria-label="Time grain">${seg('month')}${seg('quarter')}${seg('year')}</div>
        <button class="btn-secondary${bars ? ' on' : ''}" data-c1bars aria-pressed="${bars}">Bars</button>
        <div class="tf-wrap"><button class="tf-btn" id="tfBtn_c1series" aria-expanded="false" aria-haspopup="true" aria-controls="tfPanel_c1series">Series<span class="tf-cnt" id="tfCnt_c1series">${cnt}</span></button><div class="tf-panel" id="tfPanel_c1series" role="group" aria-label="Filter C1 series" hidden><label class="tf-all"><input type="checkbox" data-c1series-all${masterChecked}> <b>All Series</b></label><div class="tf-hint">Show or hide each series (bar + line together).</div><div class="tf-divider"></div><div class="tf-list">${sItems}</div></div></div>
        <button class="btn-secondary" data-c1png>⤓ PNG</button>
        <button class="btn-secondary" data-c1copy>⧉ Copy</button>
      </div>
    </div>`;
  };
  const scurveSVG = (c1, st) => {
    if (c1.empty) return '<p class="empty">No dated plan or submission records.</p>';
    const grain = st.c1Grain || 'month';
    const bars = st.c1Bars !== false;
    const series = st.c1Series instanceof Set ? st.c1Series : new Set(['plan', 'forecast', 'actualFirst', 'actualResub']);
    const n = c1.months.length;
    const from = Math.max(0, Math.min(st.c1Period && st.c1Period[0] != null ? st.c1Period[0] : 0, n - 1));
    const to = Math.max(from, Math.min(st.c1Period && st.c1Period[1] != null ? st.c1Period[1] : n - 1, n - 1));
    const win = c1.months.slice(from, to + 1);
    const buckets = []; let cur = null;
    win.forEach((ym, i) => { const key = bucketKey(ym, grain); if (!cur || cur.key !== key) { cur = { key, label: bucketLabel(ym, grain), pNew: 0, aFNew: 0, aRNew: 0, fNew: 0, lastIdx: from + i }; buckets.push(cur); } cur.pNew += c1.pNew[from + i]; cur.aFNew += c1.aFNew[from + i]; cur.aRNew += c1.aRNew[from + i]; cur.fNew += c1.fNew[from + i]; });
    buckets.forEach(b => { b.pCum = c1.pCum[b.lastIdx]; b.aFCum = c1.aFCum[b.lastIdx]; b.aRCum = c1.aRCum[b.lastIdx]; b.fCum = c1.fCum[b.lastIdx]; });
    const nb = buckets.length;
    const asOfM = String(c1.asOf).slice(0, 7);
    const asOfIdx = c1.months.indexOf(asOfM);
    const asOfWin = asOfIdx < 0 ? -1 : (asOfIdx < from ? -1 : (asOfIdx > to ? to : asOfIdx - from));
    const yMax = Math.max(1, ...c1.pCum, ...c1.fCum, ...c1.aFCum, ...c1.aRCum) * 1.03;
    const mL = 52, mR = 16, mT = 14, plotH = 300, colW = 46;
    const lineDefs = [['plan', 'pCum', 'sc-line-plan', 'Cum. Plan', 'sc-dot-plan'], ['forecast', 'fCum', 'sc-line-forecast', 'Cum. Forecast', 'sc-dot-forecast'], ['actualFirst', 'aFCum', 'sc-line-actual', 'Cum. Actual First', 'sc-dot-actual'], ['actualResub', 'aRCum', 'sc-line-actualresub', 'Cum. Actual Resub', 'sc-dot-actual']].filter(d => series.has(d[0]));
    const barDefs = [['plan', 'pNew', 'sc-bar-plan'], ['forecast', 'fNew', 'sc-bar-forecast'], ['actualFirst', 'aFNew', 'sc-bar-actual'], ['actualResub', 'aRNew', 'sc-bar-actualresub']].filter(d => series.has(d[0]));
    const legendCount = (bars ? barDefs.length : 0) + lineDefs.length;
    const step = 132;
    const W = Math.max(nb * colW, 360, mL + legendCount * step + 20);
    const xLabelH = nb > 13 ? 48 : 22; const legendH = 56;
    const H = mT + plotH + xLabelH + legendH;
    const plotW = W - mL - mR; const bandW = plotW / nb;
    const xCenter = i => nb === 1 ? mL + plotW / 2 : mL + bandW * (i + 0.5);
    const yOf = v => mT + plotH - (v / yMax) * plotH;
    const yTop = mT, yBot = mT + plotH;
    const P = [];
    P.push(`<svg class="scurve-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%" role="img" aria-label="Schedule performance S-curve">`);
    for (let g = 0; g <= 4; g++) { const v = yMax * g / 4; const y = yOf(v); P.push(`<line class="sc-grid" x1="${mL}" y1="${y}" x2="${W - mR}" y2="${y}"></line>`); P.push(`<text class="sc-axis" x="${mL - 6}" y="${y + 3}" text-anchor="end">${Math.round(v)}</text>`); }
    P.push(`<text class="sc-axis sc-axis-title" x="${mL - 6}" y="${yTop - 4}" text-anchor="end">Docs</text>`);
    const refX = ym => { const ix = c1.months.indexOf(String(ym).slice(0, 7)); if (ix < from || ix > to) return null; return xCenter(ix - from); };
    const sx = refX(c1.projectStart); if (sx != null) P.push(`<line class="sc-ref sc-ref-start" x1="${sx.toFixed(1)}" y1="${yTop}" x2="${sx.toFixed(1)}" y2="${yBot}"></line>`);
    const tx = refX(c1.asOf); if (tx != null) P.push(`<line class="sc-ref sc-ref-today" x1="${tx.toFixed(1)}" y1="${yTop}" x2="${tx.toFixed(1)}" y2="${yBot}"></line>`);
    const refLabelY = yTop + 14;
    if (sx != null) P.push(`<text class="sc-ref-lbl sc-ref-lbl-start" transform="translate(${(sx + 4).toFixed(1)},${refLabelY}) rotate(90)">Start · ${fmtMonth(String(c1.projectStart).slice(0, 7))}</text>`);
    if (tx != null) P.push(`<text class="sc-ref-lbl sc-ref-lbl-today" transform="translate(${(tx + 4).toFixed(1)},${refLabelY}) rotate(90)">Today · ${fmtMonth(asOfM)}</text>`);
    P.push(`<text class="sc-asof" x="${(W - mR).toFixed(1)}" y="${(yTop - 3).toFixed(1)}" text-anchor="end">As of ${c1.asOf}</text>`);
    if (bars && barDefs.length) {
      const bwTotal = Math.min(bandW * 0.7, 18 * barDefs.length); const bw = bwTotal / barDefs.length;
      const startX = i => xCenter(i) - bwTotal / 2;
      buckets.forEach((b, i) => barDefs.forEach(([, key, cls], j) => { const v = b[key]; if (!v) return; const x = startX(i) + j * bw; const h = (v / yMax) * plotH; const y = yBot - h; const cx = (x + bw / 2).toFixed(1); P.push(`<rect class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1, bw - 2).toFixed(1)}" height="${h.toFixed(1)}" rx="2"></rect>`); if (bandW > 26) P.push(`<text class="sc-barval" x="${cx}" y="${(y - 3).toFixed(1)}" text-anchor="middle" transform="rotate(-90 ${cx} ${(y - 3).toFixed(1)})">${v}</text>`); }));
    }
    lineDefs.forEach(([, key, cls, , dotCls]) => {
      const isActual = key === 'aFCum' || key === 'aRCum';
      const last = isActual ? asOfWin : nb - 1;
      if (last < 0) return;
      const seg = buckets.slice(0, last + 1);
      const pts = seg.map((b, i) => `${xCenter(i).toFixed(1)},${yOf(b[key]).toFixed(1)}`).join(' ');
      P.push(`<polyline class="${cls}" points="${pts}"></polyline>`);
      seg.forEach((b, i) => { if (b[key] != null) P.push(`<circle class="sc-dot ${dotCls}" cx="${xCenter(i).toFixed(1)}" cy="${yOf(b[key]).toFixed(1)}" r="3"></circle>`); });
    });
    const inclined = nb > 13;
    buckets.forEach((b, i) => { const x = xCenter(i).toFixed(1); if (inclined) P.push(`<text class="sc-axis sc-x" x="${x}" y="${yBot + 8}" text-anchor="end" transform="rotate(-40 ${x} ${yBot + 8})">${b.label}</text>`); else P.push(`<text class="sc-axis sc-x" x="${x}" y="${yBot + 14}" text-anchor="middle">${b.label}</text>`); });
    const ly = yBot + xLabelH + 18; let lx = mL; const leg = [];
    if (bars) barDefs.forEach(([, , cls]) => { const lbl = cls === 'sc-bar-plan' ? 'Planned' : cls === 'sc-bar-forecast' ? 'Forecast' : cls === 'sc-bar-actual' ? 'Actual First' : 'Actual Resub'; leg.push(`<g transform="translate(${lx},${ly})"><rect class="${cls}" x="0" y="-8" width="12" height="12" rx="2"></rect><text class="sc-leg-t" x="16" y="2">${lbl}</text></g>`); lx += step; });
    lineDefs.forEach(([, , cls, lbl]) => { const dash = cls === 'sc-line-plan' ? '6 3' : cls === 'sc-line-forecast' ? '2 2' : cls === 'sc-line-actualresub' ? '3 3' : '0'; leg.push(`<g transform="translate(${lx},${ly})"><line class="${cls}" x1="0" y1="-2" x2="18" y2="-2" stroke-dasharray="${dash}"></line><text class="sc-leg-t" x="24" y="2">${lbl}</text></g>`); lx += step; });
    P.push(`<g class="sc-legend">${leg.join('')}</g>`);
    P.push(`<line class="scurve-snap" x1="0" y1="${yTop}" x2="0" y2="${yBot}" style="display:none"></line>`);
    P.push('</svg>');
    const pts = buckets.map((b, i) => ({ cx: +xCenter(i).toFixed(1), label: b.label, pNew: b.pNew, aFNew: b.aFNew, aRNew: b.aRNew, pCum: b.pCum, aFCum: b.aFCum, aRCum: b.aRCum, fCum: b.fCum }));
    const dp = JSON.stringify(pts).replace(/'/g, '&#39;'); const dg = JSON.stringify({ W, yTop, yBot }).replace(/'/g, '&#39;');
    return `<div class="scurve sc-board" data-points='${dp}' data-geo='${dg}'>${P.join('')}<div class="scurve-tip" hidden></div></div>`;
  };
  const schedulePerformance = (c1, st) => `${c1Controls(c1, st)}${scurveSVG(c1, st)}`;
  // ===== C3 Breakdown (workplan D36) =====
  // Two series per dimension value, never one stacked bar: Submissions splits into New +
  // Resubmission and Approval Status splits into the five codes, because the two come from
  // different log columns and can overlap. A specific month counts rows; All months counts New
  // per Document No., Resubmission per record, and each document's first approval once.
  const C3_FILL = { APP: 'c3-app', AWC: 'c3-awc', NAP: 'c3-nap', REJ: 'c3-rej', INF: 'c3-inf' };
  const c3HasApproval = row => APPROVAL_CODES.includes(row.approvalStatus);
  const clipText = (value, max) => { const text = String(value ?? ''); return text.length > max ? `${text.slice(0, max - 1)}…` : text; };
  const c3RowsFor = month => month === 'ALL' ? view.c3.rows : view.c3.rows.filter(row => row.month === month);
  const c3ValuesFor = (dimKey, month) => {
    const counts = new Map();
    for (const row of c3RowsFor(month)) counts.set(row[dimKey], (counts.get(row[dimKey]) || 0) + 1);
    return [...counts.keys()].sort((a, b) => (counts.get(b) - counts.get(a)) || String(a).localeCompare(String(b)));
  };
  const c3Metrics = (dimKey, dimVal, month) => {
    const recs = c3RowsFor(month).filter(row => row[dimKey] === dimVal);
    let newCount = 0, resubCount = 0;
    const appr = { APP: 0, AWC: 0, NAP: 0, REJ: 0, INF: 0 };
    if (month === 'ALL') {
      // All months is per Document No.: one New per document and one approval per document (its
      // first approval); every later row counts per record, so a document resubmitted twice counts two.
      const byDoc = new Map();
      for (const row of recs) {
        // A blank Document No. cannot be attributed to a document, so it is never a first submission.
        if (!row.doc) { resubCount++; if (c3HasApproval(row)) appr[row.approvalStatus]++; continue; }
        const group = byDoc.get(row.doc) || []; group.push(row); byDoc.set(row.doc, group);
      }
      newCount = byDoc.size;
      for (const group of byDoc.values()) {
        resubCount += group.length - 1;
        const first = [...group].sort((a, b) => a.seq - b.seq).find(c3HasApproval);
        if (first) appr[first.approvalStatus]++;
      }
    } else {
      // A specific month is row-level: every row in that month counts by its own status. A document
      // approved in an earlier month and approved again here counts an approval in both months.
      for (const row of recs) {
        if (row.isNew) newCount++; else resubCount++;
        if (c3HasApproval(row)) appr[row.approvalStatus]++;
      }
    }
    return { dimVal, submitted: recs.length, newCount, resubCount, appr };
  };
  const c3Totals = metrics => {
    const totals = { New: 0, Resubmission: 0, APP: 0, AWC: 0, NAP: 0, REJ: 0, INF: 0 };
    for (const item of metrics) { totals.New += item.newCount; totals.Resubmission += item.resubCount; for (const code of APPROVAL_CODES) totals[code] += item.appr[code]; }
    return totals;
  };
  const c3Legend = (metrics, month, y1, y2) => {
    const totals = c3Totals(metrics);
    const total = totals.New + totals.Resubmission;
    // Percentages are a share of one whole only when every month is selected; a single month shows counts.
    const pct = value => (month === 'ALL' && total ? ` (${Math.round(value / total * 100)}%)` : '');
    const swatch = (x, y, item) => `<g transform="translate(${x},${y})"><rect class="${item.cls}" x="0" y="-8" width="12" height="12" rx="2"></rect><text class="c3-leg-t" x="16" y="2">${esc(item.label)} ${item.value}${pct(item.value)}</text></g>`;
    let out = `<text class="c3-cap" x="8" y="${y1}">Submissions</text><text class="c3-cap" x="8" y="${y2}">Approval Status</text>`;
    let x = 104;
    for (const item of [{ cls: 'c3-new', label: 'New', value: totals.New }, { cls: 'c3-resub', label: 'Resubmission', value: totals.Resubmission }]) { out += swatch(x, y1, item); x += 160; }
    x = 104;
    for (const code of APPROVAL_CODES) { out += swatch(x, y2, { cls: C3_FILL[code], label: code, value: totals[code] }); x += 120; }
    return out;
  };
  const c3Controls = (c3, st) => {
    const month = st.c3Month || 'ALL';
    const dim = st.c3Dim === 'submitter' ? 'submitter' : 'discipline';
    const mode = st.c3View === 'pie' ? 'pie' : 'bar';
    const options = [`<option value="ALL"${month === 'ALL' ? ' selected' : ''}>All months</option>`]
      .concat(c3.months.map(value => `<option value="${esc(value)}"${month === value ? ' selected' : ''}>${esc(fmtMonth(value))}</option>`)).join('');
    const segDim = key => `<button class="seg-btn${dim === key ? ' active' : ''}" data-c3dim="${key}">${key === 'discipline' ? 'Discipline' : 'Submitter'}</button>`;
    const segView = key => `<button class="seg-btn${mode === key ? ' active' : ''}" data-c3view="${key}">${key === 'bar' ? 'Bar' : 'Pie'}</button>`;
    return `<div class="c3-controls">
      <div class="controls-left"><label class="c3-month-wrap">Month <select data-c3month aria-label="C3 month">${options}</select></label></div>
      <div class="controls-right">
        <div class="seg" role="group" aria-label="Break down by">${segDim('discipline')}${segDim('submitter')}</div>
        <div class="seg" role="group" aria-label="Chart view">${segView('bar')}${segView('pie')}</div>
        <button class="btn-secondary" data-c3png>⤓ PNG</button>
        <button class="btn-secondary" data-c3copy>⧉ Copy</button>
      </div>
    </div>`;
  };
  const c3Segments = (x, y, width, height, segs, max) => {
    let out = `<rect class="c3-track-bg" x="${x}" y="${y}" width="${width}" height="${height}" rx="2"></rect>`;
    let cx = x;
    for (const seg of segs) {
      if (!seg.value) continue;
      const segW = Math.max(1, seg.value / max * width);
      out += `<rect class="${seg.cls}" x="${cx.toFixed(1)}" y="${y}" width="${segW.toFixed(1)}" height="${height}" rx="2"><title>${esc(seg.label)}: ${seg.value}</title></rect>`;
      cx += segW;
    }
    return out;
  };
  const c3BarSVG = st => {
    const month = st.c3Month || 'ALL';
    const dimKey = st.c3Dim === 'submitter' ? 'submitter' : 'discipline';
    const dimLabel = dimKey === 'submitter' ? 'Submitter' : 'Discipline';
    const values = c3ValuesFor(dimKey, month);
    if (!values.length) return '<p class="empty">No submissions match the current selection.</p>';
    const metrics = values.map(value => c3Metrics(dimKey, value, month));
    const maxBar = Math.max(1, ...metrics.map(item => item.newCount + item.resubCount));
    const W = 720, labelW = 116, capW = 70, valW = 52, top = 10, rowH = 36, barH = 12, gap = 4, legendH = 46;
    const plotX = labelW + capW, plotW = W - plotX - valW;
    const H = top + metrics.length * rowH + legendH;
    const P = [`<svg class="c3-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%" role="img" aria-label="${esc(dimLabel)} submissions and approval status">`];
    metrics.forEach((item, index) => {
      const y = top + index * rowH;
      P.push(`<text class="c3-label" x="${labelW - 8}" y="${y + 20}" text-anchor="end">${esc(clipText(item.dimVal, 18))}<title>${esc(item.dimVal)}</title></text>`);
      P.push(`<text class="c3-cap" x="${plotX - 8}" y="${y + 10}" text-anchor="end">Submissions</text>`);
      P.push(`<text class="c3-cap" x="${plotX - 8}" y="${y + 26}" text-anchor="end">Approval</text>`);
      P.push(c3Segments(plotX, y, plotW, barH, [{ cls: 'c3-new', label: 'New', value: item.newCount }, { cls: 'c3-resub', label: 'Resubmission', value: item.resubCount }], maxBar));
      P.push(c3Segments(plotX, y + barH + gap, plotW, barH, APPROVAL_CODES.map(code => ({ cls: C3_FILL[code], label: code, value: item.appr[code] })), maxBar));
      P.push(`<text class="c3-val" x="${W - 8}" y="${y + 20}" text-anchor="end">${item.submitted}</text>`);
    });
    const legendY = H - legendH + 22;
    P.push(c3Legend(metrics, month, legendY, legendY + 18));
    P.push('</svg>');
    return P.join('');
  };
  const c3PieSVG = st => {
    const month = st.c3Month || 'ALL';
    const dimKey = st.c3Dim === 'submitter' ? 'submitter' : 'discipline';
    const values = c3ValuesFor(dimKey, month);
    if (!values.length) return '<p class="empty">No submissions match the current selection.</p>';
    const metrics = values.map(value => c3Metrics(dimKey, value, month));
    const totals = c3Totals(metrics);
    const total = totals.New + totals.Resubmission;
    if (!total) return '<p class="empty">No submissions match the current selection.</p>';
    const W = 720, H = 320, cx = 150, cy = 150;
    const ring = (r, sw, segs) => {
      let frac = 0; let out = '';
      for (const seg of segs) {
        if (!seg.value) continue;
        const f0 = frac, f1 = frac + seg.value / total; frac = f1;
        const a0 = -Math.PI / 2 + f0 * 2 * Math.PI, a1 = -Math.PI / 2 + f1 * 2 * Math.PI;
        const x0 = (cx + r * Math.cos(a0)).toFixed(2), y0 = (cy + r * Math.sin(a0)).toFixed(2);
        const x1 = (cx + r * Math.cos(a1)).toFixed(2), y1 = (cy + r * Math.sin(a1)).toFixed(2);
        const large = f1 - f0 > 0.5 ? 1 : 0;
        out += `<path class="${seg.cls}-arc" d="M${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}" fill="none" stroke-width="${sw}"><title>${esc(seg.label)}: ${seg.value}</title></path>`;
      }
      return out;
    };
    const outer = ring(96, 26, [{ cls: 'c3-new', label: 'New', value: totals.New }, { cls: 'c3-resub', label: 'Resubmission', value: totals.Resubmission }]);
    const inner = ring(56, 26, APPROVAL_CODES.map(code => ({ cls: C3_FILL[code], label: code, value: totals[code] })));
    const P = [`<svg class="c3-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%" role="img" aria-label="Submissions and approval status">`];
    P.push(outer);
    P.push(inner);
    P.push(`<text class="c3-total" x="${cx}" y="${cy}" text-anchor="middle" font-size="22" font-weight="700">${total}</text>`);
    P.push(`<text class="c3-sub" x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="9">SUBMITTED</text>`);
    P.push(`<text class="c3-sub" x="${cx}" y="${cy + 30}" text-anchor="middle" font-size="9">New ${totals.New} · Resub ${totals.Resubmission}</text>`);
    P.push(c3Legend(metrics, month, 286, 304));
    P.push('</svg>');
    return P.join('');
  };
  // §4.2 — one board around the whole chart component; the panel keeps the card border.
  const c3Component = (c3, st) => `<div class="c3-board">${st.c3View === 'pie' ? c3PieSVG(st) : c3BarSVG(st)}</div>`;
  // Total Under Review follows D34: a row is open when it is SUR with no Actual Return Date. A
  // specific month reads every row of that month; All months reads each document's latest row,
  // because a resubmission supersedes the row before it.
  const c3IsReview = row => row.submissionStatus === 'SUR' && !row.actualReturnDate;
  const c3UnderReview = (dimKey, dimVal, month) => {
    const recs = c3RowsFor(month).filter(row => row[dimKey] === dimVal);
    if (month !== 'ALL') return recs.filter(c3IsReview).length;
    const byDoc = new Map(); let count = 0;
    for (const row of recs) {
      // A blank Document No. is not a document, so each such row stands alone.
      if (!row.doc) { if (c3IsReview(row)) count++; continue; }
      const group = byDoc.get(row.doc) || []; group.push(row); byDoc.set(row.doc, group);
    }
    for (const group of byDoc.values()) {
      const latest = [...group].sort((a, b) => a.seq - b.seq).pop();
      if (c3IsReview(latest)) count++;
    }
    return count;
  };
  // §7.2 — the shared .ds-table, one row per dimension value plus a Total footer row.
  const C3_TABLE_HEADERS = ['Total Plan', 'New Submissions', 'Resubmissions', 'Total Submitted', 'Total Approved', 'Total AWC', 'Total Under Review'];
  const c3Table = (c3, st) => {
    const month = st.c3Month || 'ALL';
    const dimKey = st.c3Dim === 'submitter' ? 'submitter' : 'discipline';
    const values = c3ValuesFor(dimKey, month);
    if (!values.length) return '<div class="c3-summary"><p class="empty">No rows match the current selection.</p></div>';
    const rows = values.map(value => {
      const m = c3Metrics(dimKey, value, month);
      return [value, c3.planCount(dimKey, value, month), m.newCount, m.resubCount, m.submitted, m.appr.APP, m.appr.AWC, c3UnderReview(dimKey, value, month)];
    });
    const footer = ['Total'];
    for (let col = 1; col <= C3_TABLE_HEADERS.length; col++) footer.push(rows.reduce((sum, row) => sum + row[col], 0));
    const headers = [dimKey === 'submitter' ? 'Submitter' : 'Discipline', ...C3_TABLE_HEADERS];
    return `<div class="c3-summary">${table(headers, rows, null, footer)}</div>`;
  };
  // §4.2 — the chart carries the shape and the table the exact numbers, so they sit side by side
  // and share one view; stacking them hid the table below the fold.
  const breakdown = (c3, st) => `${c3Controls(c3, st)}<div class="c3-body">${c3Component(c3, st)}${c3Table(c3, st)}</div>`;
  const overview = (state) => {
    const k = view.kpis;
    const statusData = Object.entries(view.active.reduce((map, row) => { map[row.submissionStatus || 'Blank'] = (map[row.submissionStatus || 'Blank'] || 0) + 1; return map; }, {})).map(([status, count]) => ({ status, count }));
    return `${activePanel('KPI OVERVIEW', `<div class="kpi-grid">${card('Documents Logged', k.totalSubmissions)}<article class="kpi-card"><div class="v">${k.submitted} / <span data-kpi="totalPlanned">${k.totalPlanned}</span></div><div class="l">Documents Submitted / In Plan</div></article>${card('Under Review (SUR)', k.underReview, 'amb')}${card('Approved (APP + AWC)', k.approved, 'ok')}${card('On-Time Return Rate', `${(k.onTimeRate * 100).toFixed(1)}%`, k.onTimeRate >= 1 ? 'ok' : 'amb')}${card('Average Review Delay', `${k.averageDelay.toFixed(1)} days`, k.averageDelay > 0 ? 'warn' : 'ok')}</div>`)}
      <div class="panel-grid">${activePanel('C1 Schedule Performance', schedulePerformance(view.c1, state), true)}${activePanel('C2 Submission Flow & Delay', barChart(view.monthly.map(row => ({ month: row.month.slice(0, 7), total: row.total })), 'month', 'total'))}${activePanel('C3 Breakdown', breakdown(view.c3, state))}</div>`;
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
  const help = (state) => { const copy = state.uiHelp?.pages || {}; const glossary = state.uiHelp?.statusGlossary || {}; return activePanel('Help', `<p>${esc(copy.Help || 'Load both workbooks and use the shared filters.')}</p><p>${esc(state.uiHelp?.filePanel?.instructions || '')}</p><p>Source files: ${esc(model.meta.mdlWorkbookName)} and ${esc(model.meta.logWorkbookName)}.</p><h3>Status glossary</h3>${Object.entries(glossary).flatMap(([group, items]) => Object.entries(items).map(([code, label]) => `<p><b>${esc(group)} · ${esc(code)}</b> — ${esc(label)}</p>`)).join('')}`); };
  const settings = (state) => activePanel('Settings', `<label>Theme <select data-setting="theme">${['dark','light','sky','ocean','presentation'].map(theme => `<option value="${theme}"${(state.theme || 'dark') === theme ? ' selected' : ''}>${theme}</option>`).join('')}</select></label><label><input type="checkbox" data-setting="showWarnings"${state.showWarnings === false ? '' : ' checked'}> Show warnings</label><label><input type="checkbox" data-setting="rememberNames"${state.rememberNames ? ' checked' : ''}> Remember workbook names</label>`);
  const views = { Overview: overview, Submittals: submissions, Validation: validation, 'Forward Plan': coverage, Analytical: analytics, Help: help, Settings: settings };
  root.innerHTML = (views[page] || overview)(state);
  // C1 — hover snap line + floating window
  const scRoot = typeof root.querySelector === 'function' ? root.querySelector('.scurve') : null;
  if (scRoot) {
    const scSvg = scRoot.querySelector('svg');
    const tip = scRoot.querySelector('.scurve-tip');
    const snap = scSvg && scSvg.querySelector('.scurve-snap');
    const pts = scSvg ? JSON.parse((scRoot.getAttribute('data-points') || '[]').replace(/&#39;/g, "'")) : [];
    const geo = scSvg ? JSON.parse(scRoot.getAttribute('data-geo') || '{}') : {};
    if (scSvg && snap && pts.length && geo.W) {
      scSvg.addEventListener('mousemove', e => {
        const rect = scSvg.getBoundingClientRect(); if (!rect.width) return;
        const ux = (e.clientX - rect.left) / rect.width * geo.W;
        let best = 0, bd = Infinity;
        pts.forEach((p, i) => { const d = Math.abs(p.cx - ux); if (d < bd) { bd = d; best = i; } });
        const p = pts[best]; if (!p) return;
        snap.setAttribute('x1', p.cx); snap.setAttribute('x2', p.cx); snap.style.display = '';
        if (tip) {
          tip.hidden = false;
          tip.innerHTML = `<b>${p.label}</b><br>Plan ${p.pNew} · Σ ${p.pCum}<br>Forecast Σ ${p.fCum}<br>Actual First ${p.aFNew} · Σ ${p.aFCum}<br>Actual Resub ${p.aRNew} · Σ ${p.aRCum}`;
          const hr = scRoot.getBoundingClientRect();
          let tx = e.clientX - hr.left + 14, ty = e.clientY - hr.top + 14;
          if (tx + 210 > hr.width) tx = e.clientX - hr.left - 210;
          tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
        }
      });
      scSvg.addEventListener('mouseleave', () => { if (snap) snap.style.display = 'none'; if (tip) tip.hidden = true; });
    }
  }
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
