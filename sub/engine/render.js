// Revision 0.4 | 2026-10-26 | CodeBuddy (AI) | T15.3 (Wave 4.2): split the C3 Breakdown into two side-by-side vertical-bar charts — left Submissions (First Submission, Resubmission, Under Review via D38), right Approval Status — replacing the single horizontal-bar / concentric-ring component. Under Review (D38) deducts First Submission and Resubmission in the as-of month.
// Revision 0.3 | 2026-10-25 | CodeBuddy (AI) | Added the C3 Breakdown panel (workplan D36). `deriveView` returns `c3`: one classified row per active submission (`isNew`, `seq`, `submissionStatus`, `actualReturnDate`), the month list, and `planCount(dimKey, dimVal, month)` which tallies Master Document List rows for Total Plan. `renderDashboard` draws two series per dimension value — Submissions (New + Resubmission) and Approval Status (the five codes) — as horizontal bars or two concentric rings inside a §4.2 component board, then renders the summary table in the shared `.ds-table` style with a Total footer row. `table()` gained an optional `footer` argument; callers that pass nothing are unchanged.
// Revision 0.2 | 2026-10-24 | CodeBuddy (AI) | D33: a blank Stage is counted as a planned document and a row without a Document No. is not. Exported EXCLUDED_STAGES for dashboard.js.
// Revision 0.1 | 2026-10-24 | Codex | Added S4 view derivation and dashboard rendering.

export const EXCLUDED_STAGES = new Set(['Deleted', 'Void', 'Superseded']);
// D36 — the C3 Breakdown approval palette. The order drives the stacked segments and the legend.
export const APPROVAL_CODES = ['APP', 'AWC', 'NAP', 'REJ', 'INF'];

/** Build the shared filtered set and all dashboard measures. @param {object} model @param {object} state @returns {object} */
export function deriveView(model, state = {}) {
  const disciplines = state.disciplines instanceof Set ? state.disciplines : new Set([...model.planned.map(row => row.discipline).filter(Boolean), 'Unknown']);
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
    const stageMatch = plans.length === 0 || plans.some(plan => stages.has(plan.stage));
    // A blank value is a value: the filter lists it as "Blank", so both sides are normalised the
    // same way and the initial full tick set covers every row (D43).
    const statusValue = String(row.submissionStatus ?? '');
    const approvalValue = String(row.approvalStatus ?? '');
    // An empty tick set means "nothing selected", so it filters everything out. `null` (state without
    // a set) still means "no filter". This keeps the panel and the data in agreement.
    return disciplines.has(row.discipline)
      && stageMatch
      && (!statuses || statuses.has(statusValue))
      && (!approvals || approvals.has(approvalValue))
      && (!submitters || submitters.has(submitter))
      && (!query || haystack.includes(query));
  });
  // A submission filter narrows only when a set leaves out a value that the data contains. An absent
  // set is "no filter". An empty set leaves everything out, so it narrows. Reading the sets as
  // "always active" would drop every planned row that has no linked submission (7513 → 116 plans).
  const valueOf = value => String(value ?? '');
  const leavesOut = (set, values) => Boolean(set) && values.some(value => !set.has(valueOf(value)));
  const hasSubmissionFilter = leavesOut(statuses, model.submissions.map(row => row.submissionStatus))
    || leavesOut(approvals, model.submissions.map(row => row.approvalStatus))
    || leavesOut(submitters, model.submissions.map(row => row.fields['Submitted By']));
  const activePlans = model.planned.filter(row => {
    // A row without a Document No. is a V-01 defect, not a planned document. MDL does not count
    // it, so it is not counted here either.
    if (!row.documentNo) return false;
    const linked = row.submissions;
    const passesSubmissionFilters = hasSubmissionFilter ? linked.some(item => activeSubmissions.includes(item)) : true;
    const searchValue = state.searchCol === 'document' ? row.documentNo : state.searchCol === 'title' ? row.title : state.searchCol === 'submitter' ? linked.map(item => item.fields['Submitted By']).join(' ') : [row.documentNo, row.title, row.discipline, row.stage, linked.map(item => item.fields['Submitted By']).join(' ')].join(' ');
    const haystack = String(searchValue || '').toLowerCase();
    return disciplines.has(row.discipline) && stages.has(row.stage ?? '') && passesSubmissionFilters && (!query || haystack.includes(query));
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
  // ===== C2 Submission Flow & Delay (workplan D6 / D9 / D40) =====
  // Counting rule: band height = count of SUBMISSION RECORDS (rows) in that month, grouped by status.
  // Per month only — not cumulative, not distinct Document No. (distinct-doc counting is the KPI cards'
  // job, D32/D34). NFS is the only MDL-sourced band: it counts planned documents not yet submitted,
  // attributed to their Planned 1st Issue Date month. It is computed from the plan, NOT read from the
  // log's cached NFS array-formula column (issue I029).
  const c2ByMonth = new Map();
  for (const item of monthly) {
    const status = { ...item.status };
    delete status.NFS; // NFS is the planned-sourced band below, never the log's cached code
    c2ByMonth.set(item.month.slice(0, 7), { status, delay: item.delay, nfs: 0 });
  }
  let nfsUnscheduled = 0;
  for (const plan of activePlans) {
    if (plan.isSubmitted) continue;
    const d = plan.fields && plan.fields['Planned 1st Issue Date'];
    const ym = (typeof d === 'string' && /^\d{4}-\d{2}/.test(d)) ? d.slice(0, 7) : '';
    if (ym) { const e = c2ByMonth.get(ym) || { status: {}, delay: [], nfs: 0 }; e.nfs += 1; c2ByMonth.set(ym, e); }
    else nfsUnscheduled += 1;
  }
  const c2Months = [...c2ByMonth.keys()].sort();
  const c2 = {
    months: c2Months,
    data: c2Months.map(ym => c2ByMonth.get(ym)),
    nfsUnscheduled,
    // C2 Funnel (owner rules, 2026-10-28, reference sub/ref funnel sample):
    //  - Planned Deliverables: MDL planned rows (D11 — each row is one planned document, repeated
    //    numbers stay separate, dated or not). Row-level, consistent with C3 Total Plan.
    //  - Submitted for Review: distinct Document No. that have >=1 submission row (D34).
    //  - Under Review: latest submission SUR and no Actual Return Date (D34 guard kept).
    //  - AWC / Approved: split by the document's FIRST approval (earliest row that carries an approval
    //    code). AWC = first code is AWC; Approved = first code is APP. Disjoint, and distinct from KPI 4
    //    (any-row APP/AWC). Uses the C3 All-months first-approval rule.
    //  - byDisc: the same five measures split by Discipline, for the funnel's per-discipline table.
    funnel: (() => {
      const planned = activePlans.length;
      const submitted = documentGroups.length;
      const inReview = underReview;
      const firstApprovalCode = g => { const f = g.find(r => APPROVAL_CODES.includes(r.approvalStatus)); return f ? f.approvalStatus : null; };
      const approved = documentGroups.filter(g => firstApprovalCode(g) === 'APP').length;
      const awc = documentGroups.filter(g => firstApprovalCode(g) === 'AWC').length;
      const discMap = new Map();
      const bump = (k, fld) => { const e = discMap.get(k) || { planned: 0, submitted: 0, inReview: 0, awc: 0, approved: 0 }; e[fld]++; discMap.set(k, e); };
      for (const p of activePlans) bump(p.discipline || 'Unknown', 'planned');
      for (const g of documentGroups) {
        const d = g[0].discipline || 'Unknown';
        bump(d, 'submitted');
        const latest = g[g.length - 1];
        if (latest.submissionStatus === 'SUR' && !latest.actualReturnDate) bump(d, 'inReview');
        const st = firstApprovalCode(g);
        if (st === 'AWC') bump(d, 'awc');
        else if (st === 'APP') bump(d, 'approved');
      }
      const byDisc = [...discMap.entries()]
        .map(([k, v]) => ({ discipline: k, ...v }))
        .sort((a, b) => a.discipline === 'Unknown' ? 1 : b.discipline === 'Unknown' ? -1 : a.discipline.localeCompare(b.discipline));
      return { planned, submitted, inReview, awc, approved, byDisc };
    })()
  };
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
    // Planned 1st Issue Date is blank; those are unscheduled (like C2 NFS) and are excluded from the
    // All-months Total Plan. The All-months Total Plan is the cumulative planned 1st issue up to the
    // as-of month (view.c1.asOf) — business rule, I061.
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
      if (month !== 'ALL') return byMonth.get(month) || 0;   // a specific month counts only its own planned 1st issue
      const c3AsOf = String((model.meta && model.meta.asOfDate) || '').slice(0, 7);  // as-of month from model meta (matches view.c1.asOf)
      if (!c3AsOf) return 0;                                  // no as-of boundary → no bounded plan
      let total = 0;
      for (const [ym, value] of byMonth) if (ym && ym <= c3AsOf) total += value;  // up to as-of; exclude blank-month plans
      return total;
    };
    return { months, rows, planCount };
  })();
  return {
    active: activeSubmissions,
    documents: documentGroups,
    activePlans,
    issues: issueRows,
    monthly,
    c2,
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
  // §7.1 B7 — column-visibility chooser, one implementation for every table. The contents follow the
  // normative floating-panel order (master → note → divider → item list → footer). The first two
  // pinned identity columns are listed, checked and disabled, because they can never be hidden
  // (§7.1 master scope). `open` comes from state so a tick does not close the panel.
  const columnChooser = (key, headers, chosen, open) => {
    const pinned = index => index < 2;
    const items = headers.map((label, index) => {
      const locked = pinned(index);
      const on = locked || chosen.has(index);
      return `<label class="cc-item${locked ? ' cc-locked' : ''}"><input type="checkbox" data-column-choice="${key}" data-column-index="${index}"${on ? ' checked' : ''}${locked ? ' disabled' : ''}> <span>${esc(label || 'Row')}</span></label>`;
    }).join('');
    const hidden = headers.filter((_, index) => !pinned(index) && !chosen.has(index)).length;
    return `<div class="column-chooser" id="ccPanel_${key}" role="group" aria-label="Show or hide columns"${open ? '' : ' hidden'}>`
      + `<label class="cc-all"><input type="checkbox" data-column-all="${key}"> <b>All columns</b></label>`
      + '<div class="cc-hint">Ticked columns show. A change applies at once.</div>'
      + '<div class="cc-divider"></div>'
      + `<div class="cc-list">${items}</div>`
      + `<div class="cc-foot"><button type="button" class="cc-reset" data-column-reset="${key}">Reset to defaults</button><span class="cc-count" data-column-hidden="${key}">${hidden} hidden</span></div>`
      + '</div>';
  };
  const table = (headers, rows, key = null, footer = null, opts = {}) => {
    const widths = opts && opts.widths ? opts.widths : null;
    const title = opts && opts.title ? opts.title : null;
    const firstWidth = widths && widths[0] != null ? widths[0] : 150;
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
    const colgroup = indexes.map((index, pos) => { const w = widths && widths[index] != null ? widths[index] : (key && pos === 0 ? 150 : null); return `<col${key ? ` data-col="${index}"` : ''}${w != null ? ` style="width:${w}px"` : ''}>`; }).join('');
    const heads = indexes.map(index => `<th scope="col"${cellAttrs(index)}><span class="th-wrap"><span class="lb">${esc(headers[index])}</span></span>${key ? `<span class="ds-resize" data-col="${index}" role="separator" aria-label="Resize ${esc(headers[index])}"></span>` : ''}</th>`).join('');
    const body = rows.length ? `${windowed ? '<tr class="win-pad"><td colspan="' + indexes.length + '" style="height:0px;padding:0"></td></tr>' : ''}${rows.slice(0, shown).map(renderRow).join('')}${windowed ? '<tr class="win-pad"><td colspan="' + indexes.length + '" style="height:' + Math.max(0, rows.length - shown) * 40 + 'px;padding:0"></td></tr>' : ''}` : `<tr><td class="empty" colspan="${indexes.length}">No rows match the current selection.</td></tr>`;
    const chooserOpen = state.openChooser === key;
    const controls = key ? `<div class="table-tools"><span id="${countId}">${windowed ? `Showing ${shown.toLocaleString()} of ${rows.length.toLocaleString()} rows` : `${rows.length.toLocaleString()} rows`}</span><button class="csv-btn btn-secondary" data-export-table="${key}">⤓ CSV</button><button class="cc-btn btn-secondary" id="ccBtn_${key}" aria-controls="ccPanel_${key}" aria-haspopup="true" aria-expanded="${chooserOpen}">Columns</button>${columnChooser(key, headers, chosen, chooserOpen)}</div>` : '';
    const foot = footer ? `<tfoot><tr>${indexes.map(index => `<td${cellAttrs(index)}>${esc(footer[index])}</td>`).join('')}</tr></tfoot>` : '';
    // §7.2.15 — the header fragment carries one extra trailing column for the scrollbar (.ds-gut), so
    // the navy band runs the full card width and the body's scrollbar starts below it.
    // The fragment carries the same table key as its body, because the resize grips live here and
    // persist their widths under that key (§7.2.6 / D40).
    const headFrag = `<div class="vheadwrap"><table class="ds-table vheadtab"${key ? ` data-table-key="${key}"` : ''}><colgroup>${colgroup}<col class="ds-gut"></colgroup><thead><tr>${heads}<th class="ds-gut" scope="col" aria-hidden="true"></th></tr></thead></table></div>`;
    const titleRow = title ? `<div class="table-head"><h3 class="tt">${title}</h3>${controls}</div>` : controls;
    return `${titleRow}<div class="ds-split splitcard" style="--pin-first-col:${firstWidth}px">${headFrag}<div class="tableScroll"><table class="ds-table"${key ? ` data-table-key="${key}" data-column-count="${headers.length}"` : ''}${windowed ? ' data-windowed="true"' : ''}><colgroup>${colgroup}</colgroup><tbody>${body}</tbody>${foot}</table></div></div>`;
  };
  // §4 — `data-panel` is assigned after insertion, in document order, and only to top-level panels;
  // nested sub-panels inherit their parent's number and show no badge of their own.
  const activePanel = (name, content, full = false) => {
    const collapsed = Array.isArray(state.collapsedPanels) && state.collapsedPanels.includes(name);
    const label = collapsed ? 'Expand' : 'Collapse';
    // §4 — Help is the first child of the cluster and the collapse toggle is rightmost. The border
    // wraps only the content (charts / tables / filters / buttons) inside `.panel-body`; the header
    // (title + Help + toggle) sits OUTSIDE the border, per the C2 owner review (2026-10-28).
    return `<section class="panel${full ? ' full' : ''}${collapsed ? ' collapsed' : ''}"><header class="panel-head"><h2>${esc(name)}</h2><div class="panel-actions"><button class="icon-btn help-open" data-help="${esc(name)}" aria-label="Help for ${esc(name)}" title="Help">?</button><button class="icon-btn panel-toggle" data-panel-toggle="${esc(name)}" aria-expanded="${collapsed ? 'false' : 'true'}" aria-label="${label} ${esc(name)}" title="${label}">${collapsed ? '+' : '−'}</button></div></header><div class="panel-body">${content}</div></section>`;
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
  // ===== C3 Breakdown (workplan D36, revised by D38 / Wave 4.2) =====
  // Two series per dimension value, never one stacked bar. T15.3 splits the panel into two side-by-side
  // vertical-bar charts: left = Submissions (First Submission + Resubmission; a specific month also adds
  // Under Review); right = Approval Status (the five codes; All months also adds SUR). Under Review (D38)
  // deducts First Submission and Resubmission in the as-of month, so a new submission that is also under
  // review is not double-counted. A specific month is row-level (ignores history); All months is per
  // Document No. (Option A: First Submission = documents with no resubmission, Resubmission = documents
  // with >=1 resubmission; Approval Status uses the first approval; SUR = open docs shown in the Approval
  // ring). Rows with a blank Document No. are excluded everywhere.
  const C3_FILL = { APP: 'c3-app', AWC: 'c3-awc', NAP: 'c3-nap', REJ: 'c3-rej', INF: 'c3-inf' };
  const c3HasApproval = row => APPROVAL_CODES.includes(row.approvalStatus);
  const clipText = (value, max) => { const text = String(value ?? ''); return text.length > max ? `${text.slice(0, max - 1)}…` : text; };
  const c3RowsFor = month => month === 'ALL' ? view.c3.rows : view.c3.rows.filter(row => row.month === month);
  // Full dimension universes (2026-10-27 study): the breakdown shows every MDL discipline and every
  // known submitter even when a month has zero of them (Q1, Q3). Categories no longer depend on the
  // selected month — a month with no submissions for a discipline still lists that discipline (empty bar).
  const c3DisciplineUniverse = [...new Set(model.planned.map(r => r.discipline).filter(Boolean)), 'Unknown']
    .sort((a, b) => String(a).localeCompare(String(b)));
  const c3SubmitterUniverse = [...new Set(model.submissions.map(r => String(r.fields['Submitted By'] || 'Unknown').trim()).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b)));
  const c3ValuesFor = (dimKey, month) => dimKey === 'submitter' ? [...c3SubmitterUniverse] : [...c3DisciplineUniverse];
  const c3Metrics = (dimKey, dimVal, month) => {
    const all = month === 'ALL';
    const recs = c3RowsFor(month).filter(row => row[dimKey] === dimVal && row.doc);
    const byDoc = new Map();
    for (const row of recs) { const group = byDoc.get(row.doc) || []; group.push(row); byDoc.set(row.doc, group); }
    let newCount = 0, resubCount = 0;
    const appr = { APP: 0, AWC: 0, NAP: 0, REJ: 0, INF: 0, SUR: 0 };
    if (all) {
      // All months: per Document No. (Option A) — each document counted once.
      for (const group of byDoc.values()) {
        const sorted = [...group].sort((a, b) => a.seq - b.seq);
        const hasResub = sorted.length > 1;
        if (hasResub) resubCount++; else newCount++;
        const latest = sorted[sorted.length - 1];
        if (c3IsReview(latest)) appr.SUR++;
        else { const first = sorted.find(c3HasApproval); if (first && appr[first.approvalStatus] !== undefined) appr[first.approvalStatus]++; }
      }
    } else {
      // A specific month: row-level activity (R2) — ignores history.
      for (const row of recs) {
        if (row.isNew) newCount++; else resubCount++;
        if (c3HasApproval(row) && appr[row.approvalStatus] !== undefined) appr[row.approvalStatus]++;
      }
    }
    return { dimVal, submitted: recs.length, newCount, resubCount, appr };
  };
  const c3Totals = metrics => {
    const totals = { New: 0, Resubmission: 0, APP: 0, AWC: 0, NAP: 0, REJ: 0, INF: 0, SUR: 0 };
    for (const item of metrics) {
      totals.New += item.newCount;
      totals.Resubmission += item.resubCount;
      for (const code of ['APP', 'AWC', 'NAP', 'REJ', 'INF', 'SUR']) totals[code] += (item.appr[code] || 0);
    }
    return totals;
  };
  const c3Legend = (metrics, month, y1, y2, all, ur, total) => {
    const totals = c3Totals(metrics);
    // Percentages are a share of one whole only when every month is selected; a single month shows counts.
    const pct = value => (month === 'ALL' && total ? ` (${Math.round(value / total * 100)}%)` : '');
    const swatch = (x, y, item) => `<g transform="translate(${x},${y})"><rect class="${item.cls}" x="0" y="-8" width="12" height="12" rx="2"></rect><text class="c3-leg-t" x="16" y="2">${esc(item.label)} ${item.value}${pct(item.value)}</text></g>`;
    let out = `<text class="c3-cap" x="8" y="${y1}">Submissions</text><text class="c3-cap" x="8" y="${y2}">Approval Status</text>`;
    let x = 104;
    const subItems = all
      ? [{ cls: 'c3-new', label: 'First Submission', value: totals.New }, { cls: 'c3-resub', label: 'Resubmission', value: totals.Resubmission }]
      : [{ cls: 'c3-new', label: 'First Submission', value: totals.New }, { cls: 'c3-resub', label: 'Resubmission', value: totals.Resubmission }, { cls: 'c3-ur', label: 'Under Review', value: ur }];
    for (const item of subItems) { out += swatch(x, y1, item); x += 170; }
    x = 104;
    const apprItems = all
      ? [...APPROVAL_CODES, 'SUR'].map(code => ({ cls: code === 'SUR' ? 'c3-ur' : C3_FILL[code], label: code, value: totals[code] }))
      : APPROVAL_CODES.map(code => ({ cls: C3_FILL[code], label: code, value: totals[code] }));
    for (const item of apprItems) { out += swatch(x, y2, item); x += 120; }
    return out;
  };
  // Wave 4.2 (Option 2) — the C3 Breakdown splits into two bordered cards (Submissions, Approval
  // Status). A shared panel control cluster (Month + Break-down-by, hidden in Pie view) sits above the
  // cards and drives both; Break-down-by is hidden in Pie view. Each card draws a STACKED bar chart inside
  // one aligned CSS grid (bars + vertical axis labels + an attached data table, 2026-10-27 study) so every
  // column lines up; the full MDL discipline / submitter list is shown even when a month is zero. The Pie
  // view renders the same two cards (Submissions, Approval Status), each its own donut — the old
  // consolidated two-ring card is gone.
  const c3MonthOptions = (c3, st) => {
    const month = st.c3Month || 'ALL';
    return [`<option value="ALL"${month === 'ALL' ? ' selected' : ''}>All months</option>`]
      .concat(c3.months.map(value => `<option value="${esc(value)}"${month === value ? ' selected' : ''}>${esc(fmtMonth(value))}</option>`)).join('');
  };
  const c3DimSeg = st => {
    const dim = st.c3Dim === 'submitter' ? 'submitter' : 'discipline';
    const seg = key => `<button class="seg-btn${dim === key ? ' active' : ''}" data-c3dim="${key}">${key === 'discipline' ? 'Discipline' : 'Submitter'}</button>`;
    return `<div class="seg" role="group" aria-label="Break down by">${seg('discipline')}${seg('submitter')}</div>`;
  };
  const c3ViewSeg = st => {
    const mode = st.c3View === 'pie' ? 'pie' : 'bar';
    const seg = key => `<button class="seg-btn${mode === key ? ' active' : ''}" data-c3view="${key}">${key === 'bar' ? 'Bar' : 'Pie'}</button>`;
    return `<div class="seg" role="group" aria-label="Chart view">${seg('bar')}${seg('pie')}</div>`;
  };
  // Per-card actions only (PNG / Copy). The Month and Break-down-by controls are shared at the panel
  // level (c3PanelControls) so they are not duplicated per card — the old per-card controls looked
  // independent but actually wrote the same global state (2026-10-27 study).
  const c3CardActions = () => `<div class="c3-card-ctrls"><button class="btn-secondary" data-c3png>⤓ PNG</button><button class="btn-secondary" data-c3copy>⧉ Copy</button></div>`;
  // Shared panel control cluster: Month select + Break-down-by (hidden in Pie view) on the left, the
  // Bar/Pie view toggle on the right. One set drives both cards.
  const c3PanelControls = (c3, st) => {
    const month = `<label class="c3-month-wrap">Month <select data-c3month aria-label="C3 month">${c3MonthOptions(c3, st)}</select></label>`;
    const dim = st.c3View === 'pie' ? '' : c3DimSeg(st);
    return `<div class="c3-controls"><div class="controls-left">${month}${dim}</div><div class="controls-right">${c3ViewSeg(st)}</div></div>`;
  };
  // One aligned CSS grid per card (2026-10-27 study): column 1 = metric labels, columns 2..N+1 =
  // dimensions; row 1 = bars, row 2 = vertical axis labels, rows 3+ = the attached data table. This keeps
  // every bar, label and value in the same column (Q2, Q7). Each card shows its own rows (Q5): Submissions
  // = Total Plan / First Submission / Resubmission / Under Review; Approval = the codes.
  const C3_BAR_H = 150;
  const c3StackedCard = (c3, st, kind) => {
    const month = st.c3Month || 'ALL';
    const all = month === 'ALL';
    const dimKey = st.c3Dim === 'submitter' ? 'submitter' : 'discipline';
    const values = c3ValuesFor(dimKey, month);
    if (!values.length) return `<div class="chart c3-card"><p class="empty">No submissions match the current selection.</p></div>`;
    const asOfM = String(view.c1.asOf || '').slice(0, 7);
    const title = kind === 'submissions' ? 'Submissions' : 'Approval Status';
    const barSeries = kind === 'submissions'
      ? (all ? [{ key: 'new', cls: 'c3-new' }, { key: 'resub', cls: 'c3-resub' }]
             : [{ key: 'new', cls: 'c3-new' }, { key: 'resub', cls: 'c3-resub' }, { key: 'ur', cls: 'c3-ur' }])
      : (all ? [...APPROVAL_CODES, 'SUR'].map(code => ({ key: code, cls: code === 'SUR' ? 'c3-ur' : C3_FILL[code] }))
             : APPROVAL_CODES.map(code => ({ key: code, cls: C3_FILL[code] })));
    const recs = values.map(val => {
      const m = c3Metrics(dimKey, val, month);
      const ur = all ? 0 : c3UnderReviewD38(dimKey, val, month, asOfM);
      const getBar = key => key === 'ur' ? ur : (kind === 'submissions' ? (key === 'new' ? m.newCount : m.resubCount) : (m.appr[key] || 0));
      return { val, m, ur, plan: c3.planCount(dimKey, val, month), getBar };
    });
    const N = recs.length;
    const maxVal = Math.max(1, ...recs.map(r => barSeries.reduce((s, sr) => s + Math.max(0, r.getBar(sr.key)), 0)));
    const niceMax = niceCeil(maxVal); // C1/C2-style nice axis max so the top grid line is a round number (I060)
    const rows = kind === 'submissions'
      ? [['Total Plan', r => r.plan], ['First Submission', r => r.m.newCount], ['Resubmission', r => r.m.resubCount], ['Under Review', r => all ? r.m.appr.SUR : r.ur]]
      : (all ? ['APP', 'AWC', 'NAP', 'REJ', 'INF', 'SUR'] : ['APP', 'AWC', 'NAP', 'REJ', 'INF'])
          .map(code => [code, r => code === 'SUR' ? r.m.appr.SUR : (r.m.appr[code] || 0)]);
    let g = '';
    // y-axis: 5 horizontal grid lines + tick numbers, matching the C1 S-curve and C2 stacked-area panels (I060).
    // Grid lines span the bar area (cols 2..N+1, row 1); numbers sit right-aligned in the metric-label column
    // (col 1) so they are flush with the bars and aligned with the table below. Bars are scaled to niceMax.
    g += `<div class="c3-gridlines" style="grid-column:2 / -1;grid-row:1"></div>`;
    let ticks = '';
    for (let t = 0; t <= 4; t++) { const tv = Math.round(niceMax * (4 - t) / 4); ticks += `<span class="g-ytick" style="top:${(t * 25)}%">${tv}</span>`; }
    g += `<div class="g-yaxis" style="grid-column:1;grid-row:1">${ticks}</div>`;
    recs.forEach((r, i) => {
      let segs = '';
      barSeries.slice().reverse().forEach(sr => {
        const v = r.getBar(sr.key);
        if (v > 0) segs += `<div class="seg-bar ${sr.cls}" style="height:${((v / niceMax) * C3_BAR_H).toFixed(1)}px" title="${esc(r.val)} · ${esc(sr.key === 'ur' ? 'Under Review' : sr.key)}: ${v}"></div>`;
      });
      g += `<div class="g-bar" style="grid-column:${i + 2};grid-row:1">${segs}</div>`;
      g += `<div class="g-axis" style="grid-column:${i + 2};grid-row:2" title="${esc(r.val)}">${esc(clipText(r.val, 22))}</div>`;
    });
    rows.forEach(([label, fn], j) => {
      g += `<div class="g-label" style="grid-column:1;grid-row:${j + 3}">${esc(label)}</div>`;
      recs.forEach((r, i) => { g += `<div class="g-val" style="grid-column:${i + 2};grid-row:${j + 3}">${fn(r)}</div>`; });
    });
    const legend = `<div class="c3-legend">${barSeries.map(s => `<span class="c3-leg"><span class="c3-swatch ${s.cls}"></span>${esc(s.key === 'ur' ? 'Under Review' : s.key)}</span>`).join('')}</div>`;
    return `<div class="chart c3-card">
      <div class="c3-card-head"><h3 class="c3-card-title">${title}</h3>${c3CardActions()}</div>
      <div class="c3-card-body"><div class="c3-grid" style="grid-template-columns:104px repeat(${N},minmax(0,1fr))">${g}</div>${legend}</div>
    </div>`;
  };
  const c3PieCard = (c3, st, kind) => {
    const month = st.c3Month || 'ALL';
    const all = month === 'ALL';
    const dimKey = 'discipline'; // each pie is a full-set split (T15.4 / I050); Break-down-by is hidden in Pie view
    const values = c3ValuesFor(dimKey, month);
    if (!values.length) return `<div class="chart c3-card"><p class="empty">No submissions match the current selection.</p></div>`;
    const asOfM = String(view.c1.asOf || '').slice(0, 7);
    const metrics = values.map(value => ({ m: c3Metrics(dimKey, value, month), ur: all ? 0 : c3UnderReviewD38(dimKey, value, month, asOfM) }));
    const totals = c3Totals(metrics.map(x => x.m));
    const urTotal = metrics.reduce((s, x) => s + x.ur, 0);
    const segs = kind === 'submissions'
      ? (all
          ? [{ cls: 'c3-new', label: 'First Submission', value: totals.New }, { cls: 'c3-resub', label: 'Resubmission', value: totals.Resubmission }]
          : [{ cls: 'c3-new', label: 'First Submission', value: totals.New }, { cls: 'c3-resub', label: 'Resubmission', value: totals.Resubmission }, { cls: 'c3-ur', label: 'Under Review', value: urTotal }])
      : (all
          ? [...APPROVAL_CODES, 'SUR'].map(code => ({ cls: code === 'SUR' ? 'c3-ur' : C3_FILL[code], label: code, value: totals[code] }))
          : APPROVAL_CODES.map(code => ({ cls: C3_FILL[code], label: code, value: totals[code] })));
    const title = kind === 'submissions' ? 'Submissions' : 'Approval Status';
    const total = segs.reduce((s, x) => s + x.value, 0);
    if (!total) return `<div class="chart c3-card"><p class="empty">No submissions match the current selection.</p></div>`;
    const svg = c3SingleDonut(segs, title, all ? 'DOCUMENTS' : 'SUBMITTED', total);
    const leg = `<div class="c3-legend">${segs.filter(s => s.value).map(s => `<span class="c3-leg"><span class="c3-swatch ${s.cls}"></span>${esc(s.label)}</span>`).join('')}</div>`;
    return `<div class="chart c3-card">
      <div class="c3-card-head"><h3 class="c3-card-title">${title}</h3>${c3CardActions()}</div>
      ${svg}${leg}
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
  // Stacked-bar rendering for the two C3 cards (c3StackedCard) uses one aligned CSS grid per card
  // (bars + axis labels + attached table, 2026-10-27 study). The Pie view uses c3PieCard(kind) +
  // c3SingleDonut. The former grouped-bar helper (c3VBar / c3BarSVG), the SVG c3StackedBar, and the
  // consolidated two-ring c3PieSVG were removed in the Wave 4.2 split / 2026-10-27 study.
  // One donut ring for a single C3 pie card (Submissions or Approval Status). The former consolidated
  // two-ring c3PieSVG is removed: each card now shows its own donut (2026-10-27 study).
  const c3SingleDonut = (segs, title, sub, total) => {
    const W = 320, H = 300, cx = 160, cy = 150, r = 96, sw = 30;
    const denom = Math.max(1, total);
    const P = [`<svg class="c3-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%" role="img" aria-label="${esc(title)}">`];
    P.push(`<circle class="c3-track-bg" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke-width="${sw}"></circle>`);
    let frac = 0;
    for (const seg of segs) {
      if (!seg.value) continue;
      const f0 = frac, f1 = frac + seg.value / denom; frac = f1;
      const a0 = -Math.PI / 2 + f0 * 2 * Math.PI, a1 = -Math.PI / 2 + f1 * 2 * Math.PI;
      const x0 = (cx + r * Math.cos(a0)).toFixed(2), y0 = (cy + r * Math.sin(a0)).toFixed(2);
      const x1 = (cx + r * Math.cos(a1)).toFixed(2), y1 = (cy + r * Math.sin(a1)).toFixed(2);
      const large = f1 - f0 > 0.5 ? 1 : 0;
      P.push(`<path class="${seg.cls}-arc" d="M${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}" fill="none" stroke-width="${sw}"><title>${esc(seg.label)}: ${seg.value}</title></path>`);
    }
    P.push(`<text class="c3-total" x="${cx}" y="${cy}" text-anchor="middle" font-size="22" font-weight="700">${total}</text>`);
    P.push(`<text class="c3-sub" x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="9">${esc(sub)}</text>`);
    P.push('</svg>');
    return P.join('');
  };
  // §4.2 — the Bar view splits into two bordered cards (c3StackedCard); the Pie view renders the same
  // two cards (c3PieCard by kind) as donuts (the former single two-ring card is removed). The former
  // single-board wrapper (c3Component) was removed in the Wave 4.2 split.
  // Total Under Review follows D34: a row is open when it is SUR with no Actual Return Date. A
  // specific month reads every row of that month; All months reads each document's latest row,
  // because a resubmission supersedes the row before it.
  const c3IsReview = row => row.submissionStatus === 'SUR' && !row.actualReturnDate;
  const c3UnderReview = (dimKey, dimVal, month) => {
    const recs = c3RowsFor(month).filter(row => row[dimKey] === dimVal);
    if (month !== 'ALL') return recs.filter(c3IsReview).length;
    const byDoc = new Map(); let count = 0;
    for (const row of recs) {
      // A blank Document No. is not a document, so it is excluded from the open-review count.
      if (!row.doc) continue;
      const group = byDoc.get(row.doc) || []; group.push(row); byDoc.set(row.doc, group);
    }
    for (const group of byDoc.values()) {
      const latest = [...group].sort((a, b) => a.seq - b.seq).pop();
      if (c3IsReview(latest)) count++;
    }
    return count;
  };
  // D38 (Wave 4.2) — Under Review starts from every SUR row up to and INCLUDING the as-of month
  // (the backlog up to as-of, not only before it), then deducts First Submission and Resubmission rows
  // that fall in the as-of ("this") month, so a new submission that is also a SUR row is attributed to
  // First Submission / Resubmission, not to Under Review. Row-level, not document-level.
  const c3UnderReviewD38 = (dimKey, dimVal, month, asOfM) => {
    const scope = month === 'ALL' ? asOfM : month;
    if (!scope) return c3UnderReview(dimKey, dimVal, month);
    const recs = view.c3.rows.filter(row => row[dimKey] === dimVal && row.month <= scope && row.doc);
    const base = recs.filter(row => row.submissionStatus === 'SUR').length;
    const dedFirst = recs.filter(row => row.isNew && row.month === scope).length;
    const dedResub = recs.filter(row => !row.isNew && row.month === scope).length;
    return Math.max(0, base - dedFirst - dedResub);
  };
  // §7.2 — the shared .ds-table, one row per dimension value plus a Total footer row.
  const C3_TABLE_HEADERS = ['Total Plan', 'New Submissions', 'Resubmissions', 'Total Submitted', 'Total Approved', 'Total AWC', 'Total Under Review'];
  const c3Table = (c3, st) => {
    const month = st.c3Month || 'ALL';
    const dimKey = st.c3Dim === 'submitter' ? 'submitter' : 'discipline';
    const values = c3ValuesFor(dimKey, month);
    if (!values.length) return '<div class="c3-summary"><p class="empty">No rows match the current selection.</p></div>';
    const asOfM = String(view.c1.asOf || '').slice(0, 7);
    const rows = values.map(value => {
      const m = c3Metrics(dimKey, value, month);
      const ur = month === 'ALL' ? m.appr.SUR : c3UnderReviewD38(dimKey, value, month, asOfM);
      const tot = month === 'ALL' ? m.newCount + m.resubCount : m.submitted;
      return [value, c3.planCount(dimKey, value, month), m.newCount, m.resubCount, tot, m.appr.APP, m.appr.AWC, ur];
    });
    const footer = ['Total'];
    for (let col = 1; col <= C3_TABLE_HEADERS.length; col++) footer.push(rows.reduce((sum, row) => sum + row[col], 0));
    const headers = [dimKey === 'submitter' ? 'Submitter' : 'Discipline', ...C3_TABLE_HEADERS];
    return `<div class="c3-summary"><div class="c3-summary-head"><h3 class="c3-summary-title">Breakdown Summary</h3><button class="btn-secondary" data-c3export title="Download the breakdown table as CSV">⤓ Download</button></div>${table(headers, rows, null, footer)}</div>`;
  };
  // §4.2 — the chart carries the shape and the table the exact numbers. T15.5 stacks them: the
  // table sits below the chart cards at full panel width. Wave 4.2 (Option 2) splits the panel into two
  // bordered cards (Submissions, Approval Status); a shared panel control cluster (Month + Break-down-by,
  // hidden in Pie view) drives both; the Pie view renders the same two cards as donuts (no consolidated
  // two-ring card). The Break-down-by toggle drives the Bar view (the pie is a full-set split).
  const breakdown = (c3, st) => {
    const cards = st.c3View === 'pie'
      ? `<div class="c3-cards">${c3PieCard(c3, st, 'submissions')}${c3PieCard(c3, st, 'approval')}</div>`
      : `<div class="c3-cards">${c3StackedCard(c3, st, 'submissions')}${c3StackedCard(c3, st, 'approval')}</div>`;
    return `${c3PanelControls(c3, st)}<div class="c3-body">${cards}${c3Table(c3, st)}</div>`;
  };
  // ===== C2 Submission Flow & Delay (workplan D6 / D9 / D40) =====
  // Three views: Stacked (time-river area) · Delay (monthly avg Review Delay Days) · Funnel (stage drop-off).
  // Stacked is the chosen design (owner review 2026-10-27): a stacked area over time, one band per
  // status, row-level per-month counts, planned-sourced NFS, non-cumulative. Variant 1 of the review
  // sample sub/ref/C2-TimeFlow-Sample.html.
  const C2_STATUS_ORDER = ['SUR', 'RTR', 'NTS'];
  const C2_PALETTE = { SUR: '#3f7cff', RTR: '#ff8c42', NTS: '#9c6ade', NFS: '#b0bec5' };
  const c2Color = code => C2_PALETTE[code] || '#90a4ae';
  const c2StatusKeys = c2 => {
    const set = new Set();
    for (const d of c2.data) for (const k of Object.keys(d.status || {})) if (k !== 'NFS') set.add(k);
    return [...C2_STATUS_ORDER.filter(c => set.has(c)), ...[...set].filter(c => !C2_STATUS_ORDER.includes(c)).sort()];
  };
  const c2Val = (d, code) => code === 'NFS' ? (d.nfs || 0) : (d.status ? (d.status[code] || 0) : 0);
  const c2Controls = (st) => {
    const view = st.c2View || 'stacked';
    const includeNfs = st.c2Nfs !== false;
    const seg = v => `<button class="seg-btn${view === v ? ' active' : ''}" data-c2view="${v}">${v === 'stacked' ? 'Stacked' : v === 'delay' ? 'Delay' : 'Funnel'}</button>`;
    return `<div class="c2-controls"><div class="controls-left"><div class="seg" role="group" aria-label="C2 view">${seg('stacked')}${seg('delay')}${seg('funnel')}</div><button class="btn-secondary${includeNfs ? ' on' : ''}" data-c2nfs aria-pressed="${includeNfs}">Include NFS</button></div><div class="controls-right"><button class="btn-secondary" data-c2png>⤓ PNG</button><button class="btn-secondary" data-c2copy>⧉ Copy</button></div></div>`;
  };
  const c2StackedSVG = (c2, st) => {
    const includeNfs = st.c2Nfs !== false;
    const months = c2.months, nb = months.length;
    if (!nb) return '<p class="empty">No dated submissions or planned first-issue dates.</p>';
    const series = includeNfs ? c2StatusKeys(c2).concat(['NFS']) : c2StatusKeys(c2);
    const colW = 46, mL = 44, mR = 16, mT = 14, plotH = 240, legendH = 40, xLabelH = nb > 13 ? 48 : 22;
    const yMax = Math.max(1, ...c2.data.map(d => series.reduce((s, c) => s + c2Val(d, c), 0)));
    const W = Math.max(nb * colW, 360, mL + series.length * 130 + 20), H = mT + plotH + xLabelH + legendH;
    const plotW = W - mL - mR, bandW = plotW / nb;
    const xCenter = i => nb === 1 ? mL + plotW / 2 : mL + bandW * (i + 0.5);
    const yOf = v => mT + plotH - (v / yMax) * plotH;
    const P = [`<svg class="c2-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%" role="img" aria-label="Submission flow stacked area">`];
    for (let g = 0; g <= 4; g++) { const v = yMax * g / 4, y = yOf(v); P.push(`<line class="sc-grid" x1="${mL}" y1="${y}" x2="${W - mR}" y2="${y}"></line><text class="sc-axis" x="${mL - 6}" y="${y + 3}" text-anchor="end">${Math.round(v)}</text>`); }
    series.slice().reverse().forEach(code => {
      const topPts = [], botPts = [];
      c2.data.forEach((d, i) => { let lower = 0; for (const c of series) { if (c === code) break; lower += c2Val(c2.data[i], c); } const upper = lower + c2Val(d, code); botPts.push([xCenter(i), yOf(lower)]); topPts.push([xCenter(i), yOf(upper)]); });
      const pts = topPts.concat(botPts.reverse());
      P.push(`<path fill="${c2Color(code)}" fill-opacity="0.9" stroke="#fff" stroke-width="1" d="M${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L')}Z"></path>`);
    });
    const inclined = nb > 13;
    months.forEach((ym, i) => { const x = xCenter(i).toFixed(1), lbl = fmtMonth(ym); P.push(inclined ? `<text class="sc-axis" x="${x}" y="${mT + plotH + 8}" text-anchor="end" transform="rotate(-40 ${x} ${mT + plotH + 8})">${esc(lbl)}</text>` : `<text class="sc-axis" x="${x}" y="${mT + plotH + 14}" text-anchor="middle">${esc(lbl)}</text>`); });
    const refX = ym => { const ix = months.indexOf(ym); return ix < 0 ? null : xCenter(ix); };
    const sx = refX(String(view.c1 ? view.c1.projectStart : '').slice(0, 7));
    if (sx != null) P.push(`<line class="sc-ref sc-ref-start" x1="${sx.toFixed(1)}" y1="${mT}" x2="${sx.toFixed(1)}" y2="${mT + plotH}"></line>`);
    const tx = refX(String(view.c1 ? view.c1.asOf : '').slice(0, 7));
    if (tx != null) P.push(`<line class="sc-ref sc-ref-today" x1="${tx.toFixed(1)}" y1="${mT}" x2="${tx.toFixed(1)}" y2="${mT + plotH}"></line>`);
    let lx = mL; const ly = H - legendH + 14, step = 130;
    series.forEach(code => { P.push(`<g transform="translate(${lx},${ly})"><rect x="0" y="-8" width="12" height="12" rx="2" fill="${c2Color(code)}"></rect><text class="c2-leg-t" x="16" y="2">${esc(code)}</text></g>`); lx += step; });
    P.push(`<line class="scurve-snap" x1="0" y1="${mT}" x2="0" y2="${mT + plotH}" style="display:none"></line></svg>`);
    const pts = c2.data.map((d, i) => ({ cx: +xCenter(i).toFixed(1), label: fmtMonth(months[i]), series: series.map(code => ({ code, value: c2Val(d, code) })), total: series.reduce((s, c) => s + c2Val(d, c), 0), nfsUnscheduled: c2.nfsUnscheduled }));
    const dp = JSON.stringify(pts).replace(/'/g, '&#39;'), dg = JSON.stringify({ W, mT, mH: mT + plotH }).replace(/'/g, '&#39;');
    const note = c2.nfsUnscheduled ? `<p class="note">${c2.nfsUnscheduled} planned documents have no planned first-issue date and are not placed on the time axis.</p>` : '';
    return `<div class="c2-stack" data-c2points='${dp}' data-c2geo='${dg}'>${P.join('')}<div class="c2-tip" hidden></div></div>${note}`;
  };
  const c2DelaySVG = (c2, st) => {
    const months = c2.months, nb = months.length;
    if (!nb) return '<p class="empty">No dated records.</p>';
    const vals = c2.data.map(d => { const a = d.delay || []; return a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0; });
    const yMax = Math.max(1, ...vals) * 1.1;
    const colW = 46, mL = 44, mR = 16, mT = 14, plotH = 240, xLabelH = nb > 13 ? 48 : 22, legH = 26;
    const W = Math.max(nb * colW, 360, mL + 200), H = mT + plotH + xLabelH + legH;
    const plotW = W - mL - mR, bandW = plotW / nb;
    const xCenter = i => nb === 1 ? mL + plotW / 2 : mL + bandW * (i + 0.5);
    const yOf = v => mT + plotH - (v / yMax) * plotH;
    const P = [`<svg class="c2-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%" role="img" aria-label="Average review delay">`];
    for (let g = 0; g <= 4; g++) { const v = yMax * g / 4, y = yOf(v); P.push(`<line class="sc-grid" x1="${mL}" y1="${y}" x2="${W - mR}" y2="${y}"></line><text class="sc-axis" x="${mL - 6}" y="${y + 3}" text-anchor="end">${Math.round(v)}</text>`); }
    const pts = months.map((ym, i) => [xCenter(i), yOf(vals[i])]);
    if (pts.length > 1) P.push(`<polyline fill="none" stroke="#ff8c42" stroke-width="2" points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}"></polyline>`);
    pts.forEach((p, i) => P.push(`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#ff8c42"><title>${esc(fmtMonth(months[i]))}: ${vals[i].toFixed(1)} d</title></circle>`));
    const inclined = nb > 13;
    months.forEach((ym, i) => { const x = xCenter(i).toFixed(1), lbl = fmtMonth(ym); P.push(inclined ? `<text class="sc-axis" x="${x}" y="${mT + plotH + 8}" text-anchor="end" transform="rotate(-40 ${x} ${mT + plotH + 8})">${esc(lbl)}</text>` : `<text class="sc-axis" x="${x}" y="${mT + plotH + 14}" text-anchor="middle">${esc(lbl)}</text>`); });
    const refX = ym => { const ix = months.indexOf(ym); return ix < 0 ? null : xCenter(ix); };
    const sx = refX(String(view.c1 ? view.c1.projectStart : '').slice(0, 7));
    if (sx != null) P.push(`<line class="sc-ref sc-ref-start" x1="${sx.toFixed(1)}" y1="${mT}" x2="${sx.toFixed(1)}" y2="${mT + plotH}"></line>`);
    const tx = refX(String(view.c1 ? view.c1.asOf : '').slice(0, 7));
    if (tx != null) P.push(`<line class="sc-ref sc-ref-today" x1="${tx.toFixed(1)}" y1="${mT}" x2="${tx.toFixed(1)}" y2="${mT + plotH}"></line>`);
    P.push(`<text class="c2-leg-t" x="${mL}" y="${H - 8}">Avg Review Delay (days) · not-returned &amp; not-due = 0</text></svg>`);
    return `<div class="c2-stack">${P.join('')}</div>`;
  };
  const c2Funnel = (c2) => {
    const f = c2.funnel;
    const STAGES = [
      { key: 'planned',     label: 'Planned Deliverables', color: '#3f7cff' },
      { key: 'submitted',   label: 'Submitted for Review', color: '#ff8c42' },
      { key: 'inReview',    label: 'Under Review',         color: '#9c6ade' },
      { key: 'awc',         label: 'AWC',                  color: '#00897b' },
      { key: 'approved',    label: 'Approved',             color: '#90a4ae' }
    ];
    // Layout (owner feedback 2026-10-28): a left label gutter (stage name + value, right-aligned)
    // beside the funnel body, so long stage names never clip against a narrow band, and Approved is
    // a solid square block at the base instead of a sliver-wide 3D cube.
    const W = 350, VBH = STAGES.length * 100, segH = VBH / STAGES.length;
    const gut = 134, cx = 240, maxW = 196;
    const maxVal = Math.max(1, ...STAGES.map(s => f[s.key]));
    // sqrt compression: a large ratio (e.g. planned 1000 vs submitted 100) must not force the small
    // stage into a razor-thin band. The widest stage uses at most maxW; a 14px floor keeps it visible.
    const widthOf = v => Math.max(14, (Math.sqrt(v) / Math.sqrt(maxVal)) * maxW);
    const SQ = 92; // Approved square side
    let p = `<svg class="c2-funnel-svg" width="${W}" viewBox="0 0 ${W} ${VBH}" preserveAspectRatio="none" role="img" aria-label="Submission funnel">`;
    STAGES.forEach((s, i) => {
      const yTop = i * segH, yBot = (i + 1) * segH, v = f[s.key];
      if (i < STAGES.length - 1) {
        const topW = widthOf(v), botW = widthOf(f[STAGES[i + 1].key]);
        p += `<path d="M${cx - topW / 2},${yTop} L${cx + topW / 2},${yTop} L${cx + botW / 2},${yBot} L${cx - botW / 2},${yBot} Z" fill="${s.color}" fill-opacity="0.92" stroke="#fff" stroke-width="1.5"></path>`;
      } else {
        p += `<rect x="${cx - SQ / 2}" y="${yBot - SQ - 4}" width="${SQ}" height="${SQ}" rx="4" fill="${s.color}" stroke="#fff" stroke-width="1.5"></rect>`;
      }
      const mid = i < STAGES.length - 1 ? (yTop + yBot) / 2 : yBot - 4 - SQ / 2;
      p += `<text class="c2-funnel-lab" x="${gut - 4}" y="${mid - 3}" text-anchor="end">${esc(s.label)}</text>`;
      p += `<text class="c2-funnel-val" x="${gut - 4}" y="${mid + 13}" text-anchor="end">${v}</text>`;
    });
    p += '</svg>';
    const rows = f.byDisc.map(r => `<tr><td>${esc(r.discipline)}</td><td>${r.planned}</td><td>${r.submitted}</td><td>${r.inReview}</td><td>${r.awc}</td><td>${r.approved}</td></tr>`).join('');
    const table = `<table class="c2-ftab"><thead><tr><th>Discipline</th><th>Planned Deliverables</th><th>Submitted for Review</th><th>Under Review</th><th>AWC</th><th>Approved</th></tr></thead><tbody>${rows}<tr class="tot"><td>Total</td><td>${f.planned}</td><td>${f.submitted}</td><td>${f.inReview}</td><td>${f.awc}</td><td>${f.approved}</td></tr></tbody></table>`;
    return `<div class="c2-stack"><div class="c2-funnel-row"><div class="c2-ftab-wrap">${table}</div><div class="c2-funnel-wrap">${p}</div></div></div>`;
  };
  const submissionFlow = (c2, st) => {
    const view = st.c2View || 'stacked';
    const body = view === 'delay' ? c2DelaySVG(c2, st) : view === 'funnel' ? c2Funnel(c2) : c2StackedSVG(c2, st);
    return `<div class="c-card">${c2Controls(st)}${body}</div>`;
  };
  const overview = (state) => {
    const k = view.kpis;
    const statusData = Object.entries(view.active.reduce((map, row) => { map[row.submissionStatus || 'Blank'] = (map[row.submissionStatus || 'Blank'] || 0) + 1; return map; }, {})).map(([status, count]) => ({ status, count }));
    return `${activePanel('KPI OVERVIEW', `<div class="kpi-grid">${card('Documents Logged', k.totalSubmissions)}<article class="kpi-card"><div class="v">${k.submitted} / <span data-kpi="totalPlanned">${k.totalPlanned}</span></div><div class="l">Documents Submitted / In Plan</div></article>${card('Under Review (SUR)', k.underReview, 'amb')}${card('Approved (APP + AWC)', k.approved, 'ok')}${card('On-Time Return Rate', `${(k.onTimeRate * 100).toFixed(1)}%`, k.onTimeRate >= 1 ? 'ok' : 'amb')}${card('Average Review Delay', `${k.averageDelay.toFixed(1)} days`, k.averageDelay > 0 ? 'warn' : 'ok')}</div>`)}
      <div class="panel-grid">${activePanel('C1 Schedule Performance', schedulePerformance(view.c1, state), true)}${activePanel('C2 Submission Flow & Delay', submissionFlow(view.c2, state), true)}${activePanel('C3 Breakdown', breakdown(view.c3, state))}</div>`;
  };
  // D41 — Submittals panel: one row per document (grouped by Document No.), with a toggleable,
  // consolidated submission history. Current status columns stay in the main row; the full per-submission
  // detail (incl. Prolog / Transmittal No.) expands on toggle. Title reads from the MDL planned row,
  // falling back to the submission's prolog subject when MDL has none.
  const submissions = () => {
    const docs = view.documents || [];
    const plannedById = new Map(model.planned.map(p => [p.id, p]));
    const planOf = row => plannedById.get(row.linkedPlannedId);
    const titleFor = group => { const plan = planOf(group[0]); return plan?.title || group[0].fields['Document Title'] || '—'; };
    const discFor = group => { const plan = planOf(group[0]); return plan?.discipline || group[0].discipline || 'Unknown'; };
    const headers = ['', 'Document No.', 'Document Title', 'Discipline', 'Submissions', 'Current Submission Status', 'Current Approval Status'];
    // Column-visibility control (spec §7.1 B7): own .cc-btn class, floating .column-chooser, no filter badge.
    const chosen = Array.isArray(state.columnSets?.subdoc) ? new Set(state.columnSets.subdoc) : new Set(headers.map((_, i) => i));
    const indexes = headers.map((_, i) => i).filter(i => chosen.has(i));
    const numeric = new Set([4]);
    const cellAttrs = i => { const c = []; if (numeric.has(i)) c.push('num'); if (i < 2) c.push('ds-pinned'); if (i === 0) c.push('drill-cell'); return `${i ? ` data-col="${i}"` : ''}${c.length ? ` class="${c.join(' ')}"` : ''}`; };
    const cellHtml = (group, i) => {
      const latest = group[group.length - 1];
      switch (i) {
        case 0: return `<button class="drill-btn" aria-expanded="false" aria-controls="subd-${esc(group[0].documentNo || '')}" aria-label="Toggle submission history for ${esc(group[0].documentNo || '')}"><span class="drill-chev">▸</span></button>`;
        case 1: return esc(group[0].documentNo || '');
        case 2: return esc(titleFor(group));
        case 3: return esc(discFor(group));
        case 4: return String(group.length);
        case 5: return esc(latest.submissionStatus || '—');
        case 6: return esc(latest.approvalStatus || '—');
        default: return '';
      }
    };
    const bodyRows = docs.map(group => {
      const docNo = group[0].documentNo || '';
      const cells = indexes.map(i => `<td${cellAttrs(i)}>${cellHtml(group, i)}</td>`).join('');
      const inner = group.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.fields['Prolog No.'] || '—')}</td><td>${esc(r.submissionDate || '—')}</td><td>${esc(r.actualReturnDate || '—')}</td><td>${esc(r.submissionStatus || '—')}</td><td>${esc(r.approvalStatus || '—')}</td></tr>`).join('');
      const innerTable = `<table class="ds-table hist-table"><tbody><tr class="hist-head"><th>#</th><th>Prolog / Transmittal No.</th><th>Submission Date</th><th>Return Date</th><th>Submission Status</th><th>Approval Status</th></tr>${inner}</tbody></table>`;
      const detail = `<tr class="sub" id="subd-${esc(docNo)}" data-doc="${esc(docNo)}" hidden><td colspan="${indexes.length}"><div class="sub-inner">${innerTable}</div></td></tr>`;
      return `<tr class="expandable" data-doc="${esc(docNo)}" tabindex="0">${cells}</tr>${detail}`;
    }).join('');
    const colgroup = indexes.map((i, pos) => `<col${i ? ` data-col="${i}"` : ''}${i === 0 ? ' style="width:32px"' : ''}>`).join('');
    const heads = indexes.map(i => `<th scope="col"${cellAttrs(i)}><span class="th-wrap"><span class="lb">${esc(headers[i])}</span></span>${i ? `<span class="ds-resize" data-col="${i}" role="separator" aria-label="Resize ${esc(headers[i])}"></span>` : ''}</th>`).join('');
    const headFrag = `<div class="vheadwrap"><table class="ds-table vheadtab" data-table-key="subdoc" data-column-count="${headers.length}"><colgroup>${colgroup}<col class="ds-gut"></colgroup><thead><tr>${heads}<th class="ds-gut" scope="col" aria-hidden="true"></th></tr></thead></table></div>`;
    const chooserOpen = state.openChooser === 'subdoc';
    const chooser = columnChooser('subdoc', headers, chosen, chooserOpen);
    const controls = `<div class="table-tools"><span class="summary">${docs.length} documents</span><button class="csv-btn btn-secondary" data-export="submittals">⤓ CSV</button><button class="cc-btn btn-secondary" id="ccBtn_subdoc" aria-controls="ccPanel_subdoc" aria-haspopup="true" aria-expanded="${chooserOpen}">Columns</button>${chooser}</div>`;
    const body = docs.length ? `<tbody>${bodyRows}</tbody>` : `<tbody><tr><td class="empty" colspan="${indexes.length}">No documents match the current selection.</td></tr></tbody>`;
    const tableHtml = `${controls}<div class="ds-split splitcard">${headFrag}<div class="tableScroll"><table class="ds-table" data-table-key="subdoc" data-column-count="${headers.length}">${colgroup}${body}</table></div></div>`;
    return activePanel('Submittals', tableHtml, true);
  };
  const validation = () => {
    const counts = new Map();
    for (const issue of view.issues) counts.set(issue.code, (counts.get(issue.code) || 0) + 1);
    const rules = [...counts].map(([code, count]) => { const item = model.contract.errorRules.find(rule => rule.code === code) || {}; return [item.severity || 'Warning', code, item.group || 'Business rule', item.rule || 'Description is not in the workbook Code sheet.', count]; });
    const issueRows = view.issues.map(issue => [issue.severity, issue.code, issue.documentNo, issue.field, issue.value, issue.message, issue.sheet, issue.row]);
    const err = view.issues.filter(x => String(x.severity).toLowerCase() === 'error').length;
    const warn = view.issues.filter(x => String(x.severity).toLowerCase() === 'warning').length;
    const info = view.issues.filter(x => String(x.severity).toLowerCase() === 'info').length;
    const meta = `${model.contract.mdlFields.length.toLocaleString()} MDL fields · ${model.contract.logHeaders.length.toLocaleString()} log headers · ${model.contract.errorRules.length} rules loaded · rule text from workbook Code sheet`;
    return activePanel('Validation', `
      <div class="v-summary">
        <span class="v-count" data-validation-count>${issueRows.length.toLocaleString()} issues</span>
        <div class="summary-chips">
          <span class="vchip e">Error ${err}</span>
          <span class="vchip w">Warning ${warn}</span>
          <span class="vchip i">Info ${info}</span>
        </div>
        <span class="v-meta">${meta}</span>
      </div>
      <div class="c-card v-section">
        ${table(['Severity', 'Code', 'Group', 'Description', 'Count'], rules, null, null, { widths: [110, 90, 130, 420, 70], title: 'Rules' })}
      </div>
      <div class="c-card v-section">
        ${table(['Severity', 'Rule', 'Doc No.', 'Field', 'Value', 'Message', 'Source Tab', 'Row'], issueRows, 'issue', null, { widths: [90, 90, 120, 110, 130, 360, 100, 70], title: 'Issues' })}
      </div>
    `, true);
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
  // C2 — hover snap line + floating window (Stacked view only; matches the C1 pattern)
  const c2Root = typeof root.querySelector === 'function' ? root.querySelector('.c2-stack') : null;
  if (c2Root) {
    const c2Svg = c2Root.querySelector('svg');
    const tip = c2Root.querySelector('.c2-tip');
    const snap = c2Svg && c2Svg.querySelector('.scurve-snap');
    const pts = c2Svg ? JSON.parse((c2Root.getAttribute('data-c2points') || '[]').replace(/&#39;/g, "'")) : [];
    const geo = c2Svg ? JSON.parse((c2Root.getAttribute('data-c2geo') || '{}').replace(/&#39;/g, "'")) : {};
    if (c2Svg && snap && pts.length && geo.W) {
      c2Svg.addEventListener('mousemove', e => {
        const rect = c2Svg.getBoundingClientRect(); if (!rect.width) return;
        const ux = (e.clientX - rect.left) / rect.width * geo.W;
        let best = 0, bd = Infinity;
        pts.forEach((p, i) => { const d = Math.abs(p.cx - ux); if (d < bd) { bd = d; best = i; } });
        const p = pts[best]; if (!p) return;
        snap.setAttribute('x1', p.cx); snap.setAttribute('x2', p.cx); snap.style.display = '';
        if (tip) {
          tip.hidden = false;
          tip.innerHTML = `<b>${esc(p.label)}</b>` + p.series.map(s => `<div class="c2-tip-row"><span class="c2-swatch" style="background:${c2Color(s.code)}"></span>${esc(s.code)} <b>${s.value}</b></div>`).join('') + `<div class="c2-tip-row">Total <b>${p.total}</b></div>`;
          const hr = c2Root.getBoundingClientRect();
          let tx = e.clientX - hr.left + 14, ty = e.clientY - hr.top + 14;
          if (tx + 200 > hr.width) tx = e.clientX - hr.left - 200;
          tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
        }
      });
      c2Svg.addEventListener('mouseleave', () => { if (snap) snap.style.display = 'none'; if (tip) tip.hidden = true; });
    }
  }
  // C2 — align the funnel's top to the first discipline row and its bottom (the cube) to the last
  // discipline row, so the funnel spans exactly the per-discipline table body (header + Total excluded).
  const fr = typeof root.querySelector === 'function' ? root.querySelector('.c2-funnel-row') : null;
  if (fr) {
    const tbl = fr.querySelector('.c2-ftab');
    const tb = tbl && tbl.querySelector('tbody');
    const dRows = tb ? [...tb.querySelectorAll('tr')].filter(r => !r.classList.contains('tot')) : [];
    if (dRows.length) {
      const tRect = tbl.getBoundingClientRect();
      const firstTop = dRows[0].getBoundingClientRect().top - tRect.top;
      const lastBottom = dRows[dRows.length - 1].getBoundingClientRect().bottom - tRect.top;
      const wrap = fr.querySelector('.c2-funnel-wrap');
      const svg = fr.querySelector('.c2-funnel-svg');
      const h = Math.max(140, lastBottom - firstTop);
      if (wrap) { wrap.style.marginTop = firstTop + 'px'; wrap.style.height = h + 'px'; }
      if (svg) { svg.style.height = h + 'px'; svg.removeAttribute('height'); }
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
