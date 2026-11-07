// Revision 0.15 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.67 / I122 — preset chips now form ONE joined `.seg` group of `.seg-btn` buttons. The active state comes from the stored `st.c1Preset` value, NOT from comparing `[from, to]` with each preset's range; clipped preset ranges therefore cannot light two chips at once. `undefined` means the default `All` selection, `null` means a manual custom range with NO active chip, and any of the five preset names means exactly that ONE active chip. The group keeps `data-c1preset`, `aria-pressed`, `aria-label`, the client payloads and `c1PresetRange()` unchanged, so `state.c1Period`, windowed `pts`, the rev 1.65 shared Y axis and every export path keep their behaviour.
// Revision 0.14 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.66 / I121 — the C1 period control is now ONE dual-handle track. `c1Controls()` emits two overlaid native `<input type="range" step="1">` elements on one shared visual track, one tick per reporting month, five preset chips and a live period text. `c1PresetRange()` is exported for the client and the render suite: 6M / 12M / 24M anchor to the current `to` index, YTD runs from January of the as-of year through the as-of month, and All spans every month. The `data-c1period="from" / "to"` attributes, `state.c1Period`, the windowed `pts` payload, the rev 1.65 shared Y axis and every other control are unchanged.
// Revision 0.13 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.65 / I119 — the shared C1 Y-axis maximum now comes from the WINDOWED `pts` payload, filtered by enabled series and the Bars toggle, instead of the full c1.* arrays. Cumulative values stay ABSOLUTE (never rebased); only the scale adapts. `niceAxisTicks()`, the 300-unit plot height and all rev 1.64 limits are unchanged. Period, series, Bars and grain changes all repaint, so the axis is recalculated immediately with no animation or debounce; `data-c1meta` keeps the same keys, so `c1Refit`, hover, the table, PNG and Copy all follow the new scale. No separate bar scale is introduced.
// Revision 0.12 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.64 / I118 — replaced `niceAxisMax()` (four fixed quarter intervals) with `niceAxisTicks()`: max 7 intervals / 8 labels over the 300-unit plot, >= ~40 px major-tick spacing, nice-number steps `{1, 2, 2.5, 5} × 10^k` (step >= 1), and the SMALLEST step that fits. `yMax`, `yStep` and `yIntervals` now travel in the one `data-c1meta` payload and drive `c1PlotSvg`, the grid lines, the static HTML ticks, the client refit and PNG/Copy. The axis maximum follows the VISIBLE series. The plot height remains 300; only the scale changes. Real workbooks: M=5955 → step 1000 → yMax 6000 → 7 labels / 50 px / 99.25% fill.
// Revision 0.11 | 2026-11-06 | CodeBuddy (AI) | I117 — four owner-reported C1 fixes: the side unit caption reads "Documents"; the Y-axis maximum is rounded UP to a nice step (`niceAxisMax`), so the five ticks are round numbers; the rotated bar value starts above the bar top (`text-anchor="start"` + `dominant-baseline="central"`, 4 px gap) instead of straddling it; and each month centres its visible (non-zero) bars on the band centre, so months with fewer active series (future months have no actuals) no longer lean to one side. Series order and colour classes are unchanged.
// Revision 0.10 | 2026-11-06 | CodeBuddy (AI) | §4.2 rev 1.63 promotes the reviewed Option B attached-table interaction into the production build. `c1PlotSvg()` emits four tokenised `<linearGradient>` defs, `<path class="sc-area">` fills behind the marks and one hidden `.sc-hover-band` (`width = W / N`); `schedulePerformance()` puts `data-c1col` on every month `<th>` and value `<td>`. `bindChartHover()` gains an opt-in `attachedTable` flag passed ONLY by C1: it delegates pointermove to the board, drives the band + snap line + `.col-active` cells in both directions, and opens the floating window ONLY while the cursor is inside the SVG. §4.6: hiding now clears the window text AND sets `aria-hidden="true"`; showing removes the attribute. C2, C3, C4 and the KPI cards keep their original binding and gain the global ARIA fix.
// Revision 0.9 | 2026-11-06 | CodeBuddy (AI) | §4.2 rev 1.62 — `c1PlotSvg()` now reserves the wrapped legend rows ABOVE the plot (`yTop = legendH`, `yBot = yTop + plotH`, `H = yBot`) so the C1 plot bottom touches the attached table's `<thead>` with no intervening band. All Y coordinates (grid lines, Y-axis line, Start/Today lines and labels, bars, bar values, polylines, dots, `data-geo`, static Y ticks and `.chart-snap`) follow `yTop`/`yBot`; X geometry is unchanged. Owner decision 2026-11-06 supersedes decision 1 for attached-table panels; in-SVG placement keeps PNG/Copy fidelity.
// Revision 0.8 | 2026-11-03 | CodeBuddy (AI) | I103 — the C2 Delay chart moved from element mode to nearest-datum mode: element mode (data-tip on the r=3 dots) left the hover window reachable only on those dots, a dead zone everywhere else, which §4.6 forbids; the line/dot colour is tokenised (--color-c2delay) and the window follows §4.6 (swatch row + "Docs in mean" footer, c2DelayTipHtml exported). I104 — the Funnel view returned a `.c2-stack` with no `.chart-tip` at all (the I100 defect class), so it never bound; each funnel stage now carries a data-tip window (header, swatch row, "% of planned" footer). The C4 Age-buckets bars (barChart) gained data-tip rows with a "share of overdue" footer — the only barChart caller had no hover detail.
// Revision 0.7 | 2026-11-03 | CodeBuddy (AI) | I102 — the C1 hover window follows §4.6: body rows are `swatch · label · value` (`.ct-l` + tokenised `.chart-swatch.c1-*`), the forecast per-period count is shown (it was computed and drawn as a bar but never put into `data-points`), and the footer carries the owner's A+B summary — actual cumulative total, % of plan, ahead/behind gap. Chart-level facts ride on `data-c1meta` (fc = the MDL holds real forecast dates; vis = the visible series keys, so hidden series drop their rows). Without MDL forecast dates the row is labelled "Forecast (projected)" and the count is an em dash, never a misleading 0. `c1TipHtml` is exported for the render suite.
// Revision 0.6 | 2026-11-02 | CodeBuddy (AI) | I099 — the All-months Approval donut gained a "No Outcome" segment (grey, `.c3-no`), so a document that is neither open under review nor carrying an approval code is visible instead of vanishing; the two rings now total the same distinct-document count. `c3Metrics` returns `noOutcome` and `c3Totals` sums it. A single month is unchanged: it shows that month's activity, and a row with no approval is not an approval event.
// Revision 0.5 | 2026-11-02 | CodeBuddy (AI) | I046 — the C3 Breakdown drops the Total Plan column and metric row in the submitter view, because the Master Document List has no submitter column; a note under the table states the reason. I026 — the Validation meta line records that a blank MDL Document No. is reported by MDL (D33).
// Revision 0.4 | 2026-10-26 | CodeBuddy (AI) | T15.3 (Wave 4.2): split the C3 Breakdown into two side-by-side vertical-bar charts — left Submissions (First Submission, Resubmission, Under Review via D38), right Approval Status — replacing the single horizontal-bar / concentric-ring component. Under Review (D38) deducts First Submission and Resubmission in the as-of month.
// Revision 0.3 | 2026-10-25 | CodeBuddy (AI) | Added the C3 Breakdown panel (workplan D36). `deriveView` returns `c3`: one classified row per active submission (`isNew`, `seq`, `submissionStatus`, `actualReturnDate`), the month list, and `planCount(dimKey, dimVal, month)` which tallies Master Document List rows for Total Plan. `renderDashboard` draws two series per dimension value — Submissions (New + Resubmission) and Approval Status (the five codes) — as horizontal bars or two concentric rings inside a §4.2 component board, then renders the summary table in the shared `.ds-table` style with a Total footer row. `table()` gained an optional `footer` argument; callers that pass nothing are unchanged.
// Revision 0.2 | 2026-10-24 | CodeBuddy (AI) | D33: a blank Stage is counted as a planned document and a row without a Document No. is not. Exported EXCLUDED_STAGES for dashboard.js.
// Revision 0.1 | 2026-10-24 | Codex | Added S4 view derivation and dashboard rendering.

export const EXCLUDED_STAGES = new Set(['Deleted', 'Void', 'Superseded']);
// D36 — the C3 Breakdown approval palette. The order drives the stacked segments and the legend.
export const APPROVAL_CODES = ['APP', 'AWC', 'NAP', 'REJ', 'INF'];

/** Build the shared filtered set and all dashboard measures. @param {object} model @param {object} state @returns {object} */
// I073 — small ISO-date helpers for the Forward and Overdue page; Excel serials also become Dates.
function toDateValue(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return new Date(Date.UTC(1899, 11, 30) + value * 86400000);
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : new Date(t);
}
function daysBetween(a, b) {
  const da = toDateValue(a), db = toDateValue(b);
  if (!da || !db) return null;
  return Math.round((da - db) / 86400000);
}
function addDaysISO(value, n) {
  const d = toDateValue(value);
  if (!d) return null;
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

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
    // I106 — list every past month (project start → as-of) in the C3 month filter, even when the
    // month has zero submissions. The old list came only from submission rows, so empty months were
    // unselectable and their Total Plan was invisible. Mirrors C1's start→as-of span.
    const asOfYm = String(model.meta.asOfDate || '').slice(0, 7);
    const projYm = String(model.meta.projectStartDate || '').slice(0, 7);
    const subYms = rows.map(row => row.month).filter(Boolean);
    let startYm = asOfYm || projYm;
    for (const ym of subYms) if (ym < startYm) startYm = ym;
    if (projYm && projYm < startYm) startYm = projYm;
    const months = [];
    if (startYm) {
      let [y, m] = startYm.split('-').map(Number);
      const [ey, em] = asOfYm ? asOfYm.split('-').map(Number) : [y, m];
      while (y < ey || (y === ey && m <= em)) {
        months.push(`${y}-${String(m).padStart(2, '0')}`);
        if (m === 12) { y++; m = 1; } else m++;
      }
    }
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
  // ===== Analytical page — Bottleneck KPI strip (workplan §4.9, I079) =====
  // All five cards source from the active Submission Log against asOf. The Master
  // Document List is not used by these cards.
  const asOfDate = model.meta && model.meta.asOfDate;
  // Long-due (aging SUR): open SUR rows past each record's Target Return Date.
  // Days past target = asOf - targetReturnDate. Records without a target are excluded.
  const longDue = { lt30: 0, b30_60: 0, b60_90: 0, gt90: 0, total: 0 };
  for (const row of activeSubmissions) {
    if (row.submissionStatus !== 'SUR' || row.actualReturnDate) continue;
    if (!row.targetReturnDate) continue;
    const past = daysBetween(asOfDate, row.targetReturnDate); // asOf - targetReturnDate
    if (past == null || past < 0) continue; // future or unparseable target
    if (past < 30) longDue.lt30++;
    else if (past < 60) longDue.b30_60++;
    else if (past < 90) longDue.b60_90++;
    else longDue.gt90++;
    longDue.total++;
  }
  // Rework Rate = resubmitted records / total submission records (%).
  const reworkRate = activeSubmissions.length
    ? (activeSubmissions.filter(row => row.flagResubmission).length / activeSubmissions.length) * 100
    : 0;
  // Avg Review Cycle = mean(actualReturnDate - submissionDate) per record with both dates.
  const reviewCycles = activeSubmissions
    .filter(row => row.submissionDate && row.actualReturnDate)
    .map(row => daysBetween(row.actualReturnDate, row.submissionDate));
  const avgReviewCycle = reviewCycles.length
    ? reviewCycles.reduce((sum, value) => sum + value, 0) / reviewCycles.length
    : 0;
  // Avg Approval Cycle = mean(firstApprovalDate - firstSubmissionDate) per document.
  // firstSubmissionDate = earliest submissionDate per document (documentGroups sorted ascending).
  // firstApprovalDate = date of the first row carrying an approval code (APP/AWC/NAP/REJ/INF);
  //   uses actualReturnDate when present, else that row's submissionDate.
  const approvalCycles = [];
  for (const group of documentGroups) {
    const firstSubmission = group[0].submissionDate;
    const firstApproval = group.find(r => APPROVAL_CODES.includes(r.approvalStatus));
    if (!firstSubmission || !firstApproval) continue;
    const approvalDate = firstApproval.actualReturnDate || firstApproval.submissionDate;
    const diff = daysBetween(approvalDate, firstSubmission);
    if (diff != null) approvalCycles.push(diff);
  }
  const avgApprovalCycle = approvalCycles.length
    ? approvalCycles.reduce((sum, value) => sum + value, 0) / approvalCycles.length
    : 0;
  // C4 scatter points (turnaround x review-delay), one per submission that has both values.
  // Overdue flag = open SUR past its Target Return Date (same basis as the Long-due buckets).
  const c4Scatter = activeSubmissions
    .filter(r => Number.isFinite(r.turnaroundDays) && Number.isFinite(r.delayDays))
    .map(r => ({
      doc: r.documentNo,
      x: r.turnaroundDays,
      y: r.delayDays,
      overdue: r.submissionStatus === 'SUR' && !r.actualReturnDate && r.targetReturnDate && (daysBetween(asOfDate, r.targetReturnDate) || 0) > 0
    }));
  return {
    active: activeSubmissions,
    documents: documentGroups,
    activePlans,
    issues: issueRows,
    monthly,
    c2,
    c1,
    c3,
    c4Scatter,
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
      longDue,
      reworkRate,
      avgReviewCycle,
      avgApprovalCycle,
      issueCount: issueRows.length
    }
  };
}

// I102 — the C1 hover-window body and footer, exported so the render suite can assert the §4.6
// layout without a browser. `p` is one data-points entry; `meta` is the chart-level `data-c1meta`
// payload (fc = the MDL holds real forecast dates, vis = the visible series keys).
export function c1TipHtml(p, meta = {}) {
  const vis = Array.isArray(meta.vis) && meta.vis.length ? meta.vis : ['plan', 'forecast', 'actualFirst', 'actualResub'];
  const e = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const row = (cls, label, value) => `<div class="chart-tip-row"><span class="ct-l"><span class="chart-swatch ${cls}"></span>${e(label)}</span><b>${value}</b></div>`;
  let out = `<b>${e(p.label)}</b>`;
  if (vis.includes('plan')) out += row('c1-plan', 'Plan', `${p.pNew} · Σ ${p.pCum}`);
  // Without MDL forecast dates the line is plan × 1.04, so the row is labelled "projected" and the
  // per-period count is an em dash, never a misleading 0.
  if (vis.includes('forecast')) out += row('c1-forecast', meta.fc ? 'Forecast' : 'Forecast (projected)', `${meta.fc ? p.fNew : '—'} · Σ ${p.fCum}`);
  if (vis.includes('actualFirst')) out += row('c1-actual', 'Actual First', `${p.aFNew} · Σ ${p.aFCum}`);
  if (vis.includes('actualResub')) out += row('c1-resub', 'Actual Resub', `${p.aRNew} · Σ ${p.aRCum}`);
  // Footer (owner decision, A+B): actual cumulative total on the left; % of plan and the gap on the
  // right. "ahead" = more submitted than planned, "behind" = fewer.
  const aTot = (p.aFCum || 0) + (p.aRCum || 0);
  const pCum = p.pCum || 0;
  const right = pCum > 0 ? `${Math.round(100 * aTot / pCum)}% of plan · ${Math.abs(aTot - pCum)} ${aTot >= pCum ? 'ahead' : 'behind'}` : '—';
  out += `<div class="chart-tip-foot"><span>Actual Σ ${aTot}</span><b>${right}</b></div>`;
  return out;
}

// ===== C1 attached table (spec §4.2 rev 1.59 / workplan T19.1 / issue I116) =====
// One curve renderer serves both the static HTML and the client ResizeObserver refit. Both read the
// same `data-points` payload, so the SVG X points and the native table columns cannot drift apart.
// The SVG spans grid columns 2..-1 and has NO internal left or right margin: xc(i) = (i+0.5)*W/N,
// where W is the width of that spanning cell. Column 1 holds the Y ticks and the metric labels.
const C1_LINE_DEFS = [
  ['plan', 'pCum', 'sc-line-plan', 'Cum. Plan', 'sc-dot-plan'],
  ['forecast', 'fCum', 'sc-line-forecast', 'Cum. Forecast', 'sc-dot-forecast'],
  ['actualFirst', 'aFCum', 'sc-line-actual', 'Cum. Actual First', 'sc-dot-actual'],
  ['actualResub', 'aRCum', 'sc-line-actualresub', 'Cum. Actual Resub', 'sc-dot-actual']
];
const C1_BAR_DEFS = [
  ['plan', 'pNew', 'sc-bar-plan', 'Plan'],
  ['forecast', 'fNew', 'sc-bar-forecast', 'Forecast'],
  ['actualFirst', 'aFNew', 'sc-bar-actual', 'Actual First'],
  ['actualResub', 'aRNew', 'sc-bar-actualresub', 'Actual Resub']
];
// §4.2 rev 1.64 / I118 — dynamic C1 Y ticks. Distances are SVG units; the plot is 300 tall.
// At most 7 intervals (>= ~40 units apart) and 8 labels. Steps come from the standard
// nice-number sequence {1, 2, 2.5, 5} × 10^k and are >= 1 for integer document counts.
// Pick the SMALLEST step with ceil(M / step) <= 7, then yMax = step × intervals, so the peak
// stays close to the top grid line. Examples: 5955 → 1000/6000/6 intervals; 6100 → 1000/7000/7;
// 8100 → 2000/10000/5. The returned ticks are the single source for every consumer.
export function niceAxisTicks(rawMax, plotH = 300, minSpacing = 40, maxIntervalsCap = 7) {
  const M = Math.max(1, Number(rawMax) || 1);
  const maxIntervals = Math.max(1, Math.min(maxIntervalsCap, Math.floor(plotH / minSpacing)));
  const pow = 10 ** Math.floor(Math.log10(M / maxIntervals));
  let step = M, intervals = 1;
  outer:
  for (let k = 0; k < 16; k++) {
    const base = pow * 10 ** k;
    for (const m of [1, 2, 2.5, 5]) {
      const s = Math.max(1, m * base);
      const n = Math.ceil(M / s - 1e-9);
      if (n >= 1 && n <= maxIntervals) { step = s; intervals = n; break outer; }
    }
  }
  const yMax = step * intervals;
  const ticks = Array.from({ length: intervals + 1 }, (_, i) => i * step);
  return { yMax, step, intervals, ticks };
}
// §4.2 rev 1.66 / I121 — C1 period presets. `keys` are ISO `YYYY-MM` reporting months in
// data order, `anchor` is the current `to` index and `asOf` is the snapshot date. Indices are
// whole months only, so the chart, the attached table and `data-points` always use the same N.
export const C1_PRESETS = ['6M', '12M', '24M', 'YTD', 'All'];
export function c1PresetRange(preset, keys, anchor, asOf) {
  const list = Array.isArray(keys) ? keys.map(String) : [];
  const n = list.length;
  if (!n) return null;
  const last = n - 1;
  const a = Math.max(0, Math.min(Number(anchor) || 0, last));
  const clamp = (f, t) => [Math.max(0, Math.min(f, last)), Math.max(0, Math.min(t, last))];
  const idxOfOrBefore = ym => {
    const hit = list.indexOf(ym);
    if (hit >= 0) return hit;
    let found = 0;
    for (let i = 0; i < n; i++) { if (list[i] <= ym) found = i; else break; }
    return found;
  };
  if (preset === '6M') return clamp(a - 5, a);
  if (preset === '12M') return clamp(a - 11, a);
  if (preset === '24M') return clamp(a - 23, a);
  if (preset === 'YTD') {
    const ym = String(asOf || '').slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(ym)) return clamp(0, a);
    const f = idxOfOrBefore(`${ym.slice(0, 4)}-01`);
    const t = idxOfOrBefore(ym);
    return clamp(Math.min(f, t), Math.max(f, t));
  }
  if (preset === 'All') return [0, last];
  return null;
}
/** Build the C1 S-curve inner SVG markup from one data-points payload.
 * @param {object[]} pts @param {object} meta @param {number} W @returns {object} */
export function c1PlotSvg(pts, meta = {}, W = 720) {
  const e = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const N = Math.max(1, pts.length);
  const width = Math.max(1, Number(W) || 720);
  const vis = Array.isArray(meta.vis) && meta.vis.length ? meta.vis : ['plan', 'forecast', 'actualFirst', 'actualResub'];
  const bars = meta.bars !== false;
  const lineDefs = C1_LINE_DEFS.filter(d => vis.includes(d[0]));
  const barDefs = bars ? C1_BAR_DEFS.filter(d => vis.includes(d[0])) : [];
  const yMax = Math.max(1, Number(meta.yMax) || 1);
  // §4.2 rev 1.64 — ticks come from the SAME metadata payload as every mark. The fallback keeps
  // older boards (meta without yStep) renderable with the legacy four intervals.
  const yStep = Number(meta.yStep) > 0 ? Number(meta.yStep) : yMax / 4;
  const yIntervals = Math.max(1, Math.min(7, Number(meta.yIntervals) > 0
    ? Math.round(Number(meta.yIntervals)) : Math.max(1, Math.round(yMax / yStep))));
  const bandW = width / N;
  const xc = i => (i + 0.5) * width / N;
  // §4.2 rev 1.62 — the C1 attached table needs the plot bottom flush with its <thead>, so the
  // legend bands sit ABOVE the plot. Wrap the legend into rows so no item can fall outside the
  // viewBox at a narrow panel width, then reserve exactly that many rows at the top.
  const step = 132, perRow = Math.max(1, Math.floor(width / step));
  const legendRows = Math.max(1, Math.ceil((barDefs.length + lineDefs.length) / perRow));
  const legendH = 24 + Math.max(0, legendRows - 1) * 18;
  const plotH = 300, yTop = legendH, yBot = yTop + plotH;
  const H = yBot;
  const yOf = v => yBot - (v / yMax) * plotH;
  const P = [];
  // §4.2 rev 1.63 — attached-table interaction. Gradient stops carry CSS classes so the
  // on-chart series tokens (never a hard-coded hex) drive the fills; chartSvgStyle() resolves
  // those tokens to literal colours for the standalone PNG/Copy SVG.
  // lineDefs carries the cumulative point keys (pCum / fCum / aFCum / aRCum), not the series keys.
  const gradOf = { pCum: 'plan', fCum: 'forecast', aFCum: 'actual', aRCum: 'resub' };
  P.push(`<defs>${lineDefs.map(([, key]) => {
    const id = gradOf[key] || 'plan';
    return `<linearGradient id="sc-grad-${id}" x1="0" y1="0" x2="0" y2="1"><stop class="sc-stop-${id}" offset="0%" stop-opacity=".20"></stop><stop class="sc-stop-${id}" offset="100%" stop-opacity="0"></stop></linearGradient>`;
  }).join('')}</defs>`);
  // Hidden until activation, behind every mark, pointer-transparent so it cannot steal hover.
  P.push(`<rect class="sc-hover-band" data-c1band="1" x="0" y="${yTop}" width="${bandW.toFixed(1)}" height="${plotH}" pointer-events="none" style="display:none"></rect>`);
  // Soft area fills: one per visible cumulative series, closed against the plot's X axis.
  const actualLastForArea = Number.isInteger(meta.actualLast) ? meta.actualLast : N - 1;
  lineDefs.forEach(([, key]) => {
    const id = gradOf[key] || 'plan';
    const last = (key === 'aFCum' || key === 'aRCum') ? actualLastForArea : N - 1;
    if (last < 0) return;
    const seg = pts.slice(0, Math.min(N, last + 1));
    const d = `M${xc(0).toFixed(1)},${yBot} ` + seg.map((p, i) => `L${xc(i).toFixed(1)},${yOf(Number(p[key]) || 0).toFixed(1)}`).join(' ')
      + ` L${xc(seg.length - 1).toFixed(1)},${yBot} Z`;
    P.push(`<path class="sc-area" d="${d}" fill="url(#sc-grad-${id})" pointer-events="none"></path>`);
  });
  // §4.2 — one vertical Y-axis line at the plot's left edge. It is a direct SVG child so
  // the Tier 5 geometry check can measure it, and a 1 px light rule so PNG/Copy keep it.
  P.push(`<line class="sc-yaxis-line" x1="0" y1="${yTop}" x2="0" y2="${yBot}"></line>`);
  // §4.2 rev 1.64 — exactly one grid line per Y label, at yOf(label). No fixed four-interval loop.
  for (let g = 0; g <= yIntervals; g++) {
    const v = Math.min(yMax, g * yStep), y = yOf(v).toFixed(1);
    P.push(`<line class="sc-grid" x1="0" y1="${y}" x2="${width}" y2="${y}"></line>`);
  }
  const refY = yTop + 14;
  [[meta.startIdx, 'sc-ref-start', 'sc-ref-lbl-start', meta.startLabel || 'Start'],
    [meta.todayIdx, 'sc-ref-today', 'sc-ref-lbl-today', meta.todayLabel || 'Today']].forEach(([idx, cls, lblCls, label]) => {
      if (idx == null || idx < 0 || idx >= N) return;
      const x = xc(idx).toFixed(1);
      P.push(`<line class="sc-ref ${cls}" x1="${x}" y1="${yTop}" x2="${x}" y2="${yBot}"></line>`);
      P.push(`<text class="sc-ref-lbl ${lblCls}" transform="translate(${(+x + 4).toFixed(1)},${refY}) rotate(90)">${e(label)}</text>`);
    });
  // §4.2 rev 1.59 — "Omit the as-of subtitle". Start and Today carry that information.
  if (barDefs.length) {
    // I117 — each month centres its VISIBLE (non-zero) bars on the band centre, so a month with
    // fewer active series (future months have no actuals) does not lean to one side. Series order
    // and colour classes are unchanged, so every bar keeps its series colour at any offset.
    pts.forEach((p, i) => {
      const shown = barDefs.filter(([, key]) => (Number(p[key]) || 0) > 0);
      if (!shown.length) return;
      const bwTotal = Math.min(bandW * 0.7, 18 * shown.length), bw = bwTotal / shown.length;
      shown.forEach(([, key, cls], k) => {
        const v = Number(p[key]) || 0;
        const x = xc(i) - bwTotal / 2 + k * bw;
        const h = (v / yMax) * plotH, y = yBot - h;
        const cx = (x + bw / 2).toFixed(1), cy = (y - 4).toFixed(1);
        P.push(`<rect class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1, bw - 2).toFixed(1)}" height="${h.toFixed(1)}" rx="2"></rect>`);
        // I117 — after rotate(-90) the text flows upward from the anchor, so text-anchor="start"
        // puts the whole value above the bar top (4 px gap) instead of straddling it;
        // dominant-baseline="central" keeps the glyph column centred on the bar.
        if (bandW > 26) P.push(`<text class="sc-barval" x="${cx}" y="${cy}" text-anchor="start" dominant-baseline="central" transform="rotate(-90 ${cx} ${cy})">${v}</text>`);
      });
    });
  }
  const actualLast = Number.isInteger(meta.actualLast) ? meta.actualLast : N - 1;
  lineDefs.forEach(([, key, cls, , dotCls]) => {
    const isActual = key === 'aFCum' || key === 'aRCum';
    const last = isActual ? actualLast : N - 1;
    if (last < 0) return;
    const seg = pts.slice(0, Math.min(N, last + 1));
    P.push(`<polyline class="${cls}" points="${seg.map((p, i) => `${xc(i).toFixed(1)},${yOf(Number(p[key]) || 0).toFixed(1)}`).join(' ')}"></polyline>`);
    seg.forEach((p, i) => { if (p[key] != null) P.push(`<circle class="sc-dot ${dotCls}" cx="${xc(i).toFixed(1)}" cy="${yOf(Number(p[key]) || 0).toFixed(1)}" r="3"></circle>`); });
  });
  const leg = []; let li = 0;
  const putLegend = (shape, label) => {
    const col = li % perRow, row = Math.floor(li / perRow); li++;
    leg.push(`<g transform="translate(${(col * step + 4).toFixed(1)},${(14 + row * 18).toFixed(1)})">${shape}<text class="sc-leg-t" x="22" y="2">${e(label)}</text></g>`);
  };
  barDefs.forEach(([, , cls, label]) => putLegend(`<rect class="${cls}" x="0" y="-8" width="12" height="12" rx="2"></rect>`, label));
  lineDefs.forEach(([, , cls, label]) => {
    const dash = cls === 'sc-line-plan' ? '6 3' : cls === 'sc-line-forecast' ? '2 2' : cls === 'sc-line-actualresub' ? '3 3' : '0';
    putLegend(`<line class="${cls}" x1="0" y1="-2" x2="18" y2="-2" stroke-dasharray="${dash}"></line>`, label);
  });
  P.push(`<g class="sc-legend">${leg.join('')}</g>`);
  return { inner: P.join(''), H, yTop, yBot, bandW, W: width, yMax, yStep, yIntervals };
}

// I103 — the C2 Delay hover-window body and footer, exported so the render suite can assert the
// §4.6 layout without a browser. `p` is one data-points entry: label = month, delay = the average
// review delay in days (one decimal), n = the documents averaged that month.
export function c2DelayTipHtml(p) {
  const e = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  return `<b>${e(p.label)}</b>`
    + `<div class="chart-tip-row"><span class="ct-l"><span class="chart-swatch c2-delay"></span>Avg review delay</span><b>${Number(p.delay || 0).toFixed(1)} d</b></div>`
    + `<div class="chart-tip-foot"><span>Docs in mean</span><b>${p.n || 0}</b></div>`;
}

// I112 — module-level store of the last rendered Issues table (full FILTERED set) so buildIssueCsv()
// can export every filtered row even though the table only materialises the current 200-row page.
let lastIssueExport = null;
/** Render dashboard content from one derived view. @param {Document} doc @param {object} model @param {object} state @returns {object} */
export function renderDashboard(doc, model, state = {}) {
  const view = deriveView(model, state);
  const root = doc.querySelector('[data-page-content]');
  if (!root) return view;
  const page = state.page || 'Overview';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  // §5 — a card is exactly two lines: value and label. The status class colours the 3 px top strip.
  const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const KPI_META = {
    'Documents Logged': { purpose: 'Every submission record loaded from the workbooks.', source: 'MDL + Submission log', calc: 'Row count of active submissions.' },
    'Documents Submitted / In Plan': { purpose: 'Submitted count against the planned count.', source: 'MDL planned + submission log', calc: 'Submitted ÷ planned.' },
    'Under Review (SUR)': { purpose: 'Open submissions still under review (SUR, no actual return date).', source: 'Submission log', calc: 'Rows where status = SUR and Actual Return Date is blank.' },
    'Approved (APP + AWC)': { purpose: 'Documents approved (APP or AWC).', source: 'Submission log', calc: 'Count of APP + AWC rows.' },
    'On-Time Return Rate': { purpose: 'Share of submissions returned on or before target.', source: 'Submission log', calc: 'On-time returns ÷ total returns.' },
    'Average Review Delay': { purpose: 'Mean delay between target and actual return.', source: 'Submission log', calc: 'Average (Actual Return − Target Return) in days.' },
    'Long-due SUR <30d': { purpose: 'Open SUR overdue by less than 30 days.', source: 'Submission log', calc: 'SUR open, 0–30 days past target.' },
    'Long-due SUR 30-60d': { purpose: 'Open SUR overdue by 30–60 days.', source: 'Submission log', calc: 'SUR open, 30–60 days past target.' },
    'Long-due SUR 60-90d': { purpose: 'Open SUR overdue by 60–90 days.', source: 'Submission log', calc: 'SUR open, 60–90 days past target.' },
    'Long-due SUR >90d': { purpose: 'Open SUR overdue by more than 90 days.', source: 'Submission log', calc: 'SUR open, >90 days past target.' },
    'Rework Rate': { purpose: 'Share of submissions requiring resubmission.', source: 'Submission log', calc: 'Resubmissions ÷ submissions.' },
    'Avg Review Cycle': { purpose: 'Mean end-to-end review cycle time.', source: 'Submission log', calc: 'Average (approval − submission) in days.' },
    'Avg Approval Cycle': { purpose: 'Mean time from submission to approval.', source: 'Submission log', calc: 'Average (approval − submission) in days.' }
  };
  const kpiTipHtml = label => {
    const m = KPI_META[label];
    if (!m) return `<b>${esc(label)}</b>`;
    return `<b>${esc(label)}</b>`
      + (m.purpose ? `<div class="chart-tip-row">${esc(m.purpose)}</div>` : '')
      + `<div class="chart-tip-row"><span class="chart-tip-k">Source</span>${esc(m.source || '—')}</div>`
      + `<div class="chart-tip-foot">${esc(m.calc || '')}</div>`;
  };
  // The window element must exist inside the card: `bindChartHover` returns early when a root has no
  // `.chart-tip`, so a KPI card carrying only `data-tip` showed the cursor and nothing else.
  const card = (label, value, status = '') => `<article class="kpi-card${status ? ` ${status}` : ''}" data-tip="${attr(kpiTipHtml(label))}"><div class="v">${esc(value)}</div><div class="l">${esc(label)}</div><div class="chart-tip" role="tooltip"></div></article>`;
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
    const pageSize = opts && opts.pageSize ? opts.pageSize : 0;
    const page = opts && opts.page ? opts.page : 1;
    const totalPages = pageSize ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
    const chosen = key && Array.isArray(state.columnSets?.[key]) ? new Set(state.columnSets[key]) : new Set(headers.map((_, index) => index));
    const indexes = headers.map((_, index) => index).filter(index => chosen.has(index));
    // I112 — pagination takes precedence over windowing for large tables (spec §4.3): a paginated
    // table materialises only the current page, so it must not also window.
    const windowed = Boolean(key && !pageSize && rows.length > 500);
    if (key) tableRows.set(key, { headers, rows, indexes, windowed });
    const countId = key === 'detail' ? 'dCnt' : key === 'issue' ? 'vCnt' : '';
    const pageRows = pageSize ? rows.slice((page - 1) * pageSize, page * pageSize) : rows;
    const shown = windowed ? Math.min(120, rows.length) : pageRows.length;
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
    const body = rows.length
      ? (windowed
          ? `<tr class="win-pad"><td colspan="${indexes.length}" style="height:0px;padding:0"></td></tr>${rows.slice(0, shown).map(renderRow).join('')}<tr class="win-pad"><td colspan="${indexes.length}" style="height:${Math.max(0, rows.length - shown) * 40}px;padding:0"></td></tr>`
          : pageRows.map(renderRow).join(''))
      : `<tr><td class="empty" colspan="${indexes.length}">No rows match the current selection.</td></tr>`;
    const chooserOpen = state.openChooser === key;
    const countLabel = pageSize
      ? `Page ${page} / ${totalPages}`
      : (windowed ? `Showing ${shown.toLocaleString()} of ${rows.length.toLocaleString()} rows` : `${rows.length.toLocaleString()} rows`);
    const foot = footer ? `<tfoot><tr>${indexes.map(index => `<td${cellAttrs(index)}>${esc(footer[index])}</td>`).join('')}</tr></tfoot>` : '';
    // §7.2.15 — the header fragment carries one extra trailing column for the scrollbar (.ds-gut), so
    // the navy band runs the full card width and the body's scrollbar starts below it.
    // The fragment carries the same table key as its body, because the resize grips live here and
    // persist their widths under that key (§7.2.6 / D40).
    const headFrag = `<div class="vheadwrap"><table class="ds-table vheadtab"${key ? ` data-table-key="${key}"` : ''}><colgroup>${colgroup}<col class="ds-gut"></colgroup><thead><tr>${heads}<th class="ds-gut" scope="col" aria-hidden="true"></th></tr></thead></table></div>`;
    // I112 (sample design) — the page controls sit at the TOP, grouped left; the filter + CSV + Columns
    // sit right. A paginated table never renders the separate bottom pager.
    let pagerControls;
    if (pageSize && totalPages > 1) {
      pagerControls = `<button class="pg-btn" data-pg="prev"${page <= 1 ? ' disabled' : ''}>‹ Prev</button><label class="pg-jump">Page <select class="v-page" data-pagejump="${key}">${[...Array(totalPages)].map((_, i) => `<option value="${i + 1}"${i + 1 === page ? ' selected' : ''}>${i + 1}</option>`).join('')}</select> / ${totalPages}</label><button class="pg-btn" data-pg="next"${page >= totalPages ? ' disabled' : ''}>Next ›</button><span class="pg-total" id="${countId}">${rows.length.toLocaleString()} rows</span>`;
    } else {
      pagerControls = `<span class="pg-total" id="${countId}">${countLabel}</span>`;
    }
    const controls = key ? `<div class="table-tools"><div class="pg-left">${pagerControls}</div><div class="pg-right">${opts.filter ? opts.filter : ''}<button class="csv-btn btn-secondary" data-export-table="${key}">⤓ CSV</button><button class="cc-btn btn-secondary" id="ccBtn_${key}" aria-controls="ccPanel_${key}" aria-haspopup="true" aria-expanded="${chooserOpen}">Columns</button>${columnChooser(key, headers, chosen, chooserOpen)}</div></div>` : '';
    // I112 — title on its own line; the tool cluster sits below it (right-aligned groups via CSS).
    const subtitle = opts && opts.subtitle ? `<p class="note tt-note">${opts.subtitle}</p>` : '';
    const stackCls = (title && (subtitle || opts.filter)) ? ' table-head--stack' : '';
    const titleRow = title ? `<div class="table-head${stackCls}"><h3 class="tt">${esc(title)}</h3>${subtitle}${controls}</div>` : controls;
    return `${titleRow}<div class="ds-split splitcard" style="--pin-first-col:${firstWidth}px">${headFrag}<div class="tableScroll"><table class="ds-table"${key ? ` data-table-key="${key}" data-column-count="${headers.length}"` : ''}${windowed ? ' data-windowed="true"' : ''}><colgroup>${colgroup}</colgroup><tbody>${body}</tbody>${foot}</table></div></div>`;
  };
  // §4 — `data-panel` is assigned after insertion, in document order, and only to top-level panels;
  // nested sub-panels inherit their parent's number and show no badge of their own.
  const activePanel = (name, content, full = false, leadingControls = '') => {
    const collapsed = Array.isArray(state.collapsedPanels) && state.collapsedPanels.includes(name);
    const label = collapsed ? 'Expand' : 'Collapse';
    // §4 — Help is the first child of the cluster and the collapse toggle is rightmost; a panel may
    // inject leading controls (e.g. a view toggle) to the LEFT of Help. The border wraps only the
    // content inside `.panel-body`; the header (title + controls + Help + toggle) sits OUTSIDE the
    // border, per the C2 owner review (2026-10-28).
    return `<section class="panel${full ? ' full' : ''}${collapsed ? ' collapsed' : ''}"><header class="panel-head"><h2>${esc(name)}</h2><div class="panel-actions">${leadingControls}<button class="icon-btn help-open" data-help="${esc(name)}" aria-label="Help for ${esc(name)}" title="Help">?</button><button class="icon-btn panel-toggle" data-panel-toggle="${esc(name)}" aria-expanded="${collapsed ? 'false' : 'true'}" aria-label="${label} ${esc(name)}" title="${label}">${collapsed ? '+' : '−'}</button></div></header><div class="panel-body">${content}</div></section>`;
  };
  const barChart = (data, labelKey, valueKey, tip) => {
    const max = Math.max(1, ...data.map(item => Number(item[valueKey]) || 0));
    return `<div class="bar-chart" role="img" aria-label="${esc(labelKey)} chart">${data.slice(-12).map(item => `<div class="bar-row"${tip ? ` data-tip="${attr(tip(item))}"` : ''}><span>${esc(item[labelKey])}</span><div class="bar-track"><i style="width:${Math.max(2, (Number(item[valueKey]) || 0) / max * 100)}%"></i></div><b>${esc(item[valueKey])}</b></div>`).join('') || '<p class="empty">No dated records.</p>'}</div>`;
  };
  // C4 — SVG scatter: x = turnaround days, y = review-delay days, one point per submission.
  // Overdue points (open SUR past target) render red, the rest blue.
  const c4ScatterSvg = points => {
    const W = 820, H = 440, L = 58, R = 18, T = 18, B = 46;
    const plotW = W - L - R, plotH = H - T - B;
    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    const pad = (mn, mx) => { if (mn === mx) { const d = Math.abs(mn) || 1; return [mn - d * 0.1, mx + d * 0.1]; } const p = (mx - mn) * 0.05; return [mn - p, mx + p]; };
    let [minX, maxX] = pad(Math.min(...xs), Math.max(...xs));
    let [minY, maxY] = pad(Math.min(...ys), Math.max(...ys));
    const sx = v => L + (v - minX) / (maxX - minX) * plotW;
    const sy = v => T + (1 - (v - minY) / (maxY - minY)) * plotH;
    const ticks = (mn, mx) => { const n = 5, step = (mx - mn) / n; return Array.from({ length: n + 1 }, (_, i) => mn + step * i); };
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Turnaround versus review-delay scatter">`;
    for (const t of ticks(minY, maxY)) {
      const yy = sy(t);
      s += `<line x1="${L}" y1="${yy.toFixed(1)}" x2="${L + plotW}" y2="${yy.toFixed(1)}" stroke="var(--border)" stroke-width="1"/>`;
      s += `<text x="${L - 6}" y="${(yy + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text3)">${Math.round(t)}</text>`;
    }
    for (const t of ticks(minX, maxX)) {
      const xx = sx(t);
      s += `<line x1="${xx.toFixed(1)}" y1="${T}" x2="${xx.toFixed(1)}" y2="${T + plotH}" stroke="var(--border)" stroke-width="1"/>`;
      s += `<text x="${xx.toFixed(1)}" y="${T + plotH + 14}" text-anchor="middle" font-size="10" fill="var(--text3)">${Math.round(t)}</text>`;
    }
    if (minY < 0 && maxY > 0) s += `<line x1="${L}" y1="${sy(0).toFixed(1)}" x2="${L + plotW}" y2="${sy(0).toFixed(1)}" stroke="var(--text3)" stroke-width="1" stroke-dasharray="4 3"/>`;
    s += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + plotH}" stroke="var(--text2)" stroke-width="1.5"/>`;
    s += `<line x1="${L}" y1="${T + plotH}" x2="${L + plotW}" y2="${T + plotH}" stroke="var(--text2)" stroke-width="1.5"/>`;
    s += `<text x="${L + plotW / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="var(--text2)">Turnaround (days) — return minus submission</text>`;
    s += `<text x="14" y="${T + plotH / 2}" text-anchor="middle" font-size="11" fill="var(--text2)" transform="rotate(-90 14 ${T + plotH / 2})">Review delay (days) — late vs target</text>`;
    for (const p of points) {
      const fill = p.overdue ? 'var(--red)' : 'var(--blue)';
      s += `<circle cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="3.4" fill="${fill}" fill-opacity="0.75" data-tip="${attr(`<b>${esc(p.doc)}</b><br>turnaround ${p.x.toFixed(1)} d, delay ${p.y.toFixed(1)} d${p.overdue ? ' (overdue, open)' : ''}`)}"></circle>`;
    }
    return s + '</svg>';
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
    // §4.2 rev 1.66 / I121 — one dual-handle track. `step="1"` makes fractional month indices
    // unreachable, so the handles, the month ticks and the attached table columns stay aligned.
    // Both inputs keep `data-c1period`, so `state.c1Period` and the rev 1.65 window axis are unchanged.
    const from = Math.max(0, Math.min(period[0], n - 1));
    const to = Math.max(from, Math.min(period[1], n - 1));
    const denom = Math.max(1, n - 1);
    const posPct = i => `calc(var(--c1-thumb) / 2 + (100% - var(--c1-thumb)) * ${(i / denom).toFixed(6)})`;
    const ticks = c1.months.map((ym, i) => {
      const isYear = String(ym).slice(5, 7) === '01';
      const cls = `c1-ts-tick${isYear ? ' is-year' : ''}${i >= from && i <= to ? ' is-active' : ''}${i === from || i === to ? ' is-near' : ''}`;
      return `<span class="${cls}" data-c1month="${i}" style="left:${posPct(i)}">${isYear ? `<span class="c1-ts-year">${String(ym).slice(0, 4)}</span>` : ''}</span>`;
    }).join('');
    // §4.2 rev 1.67 / I122 — the selection is stored state, not a derived range match.
    // `undefined` keeps the default `All` selection. `null` is a manual custom range with no active chip.
    const preset = st.c1Preset === undefined ? 'All' : st.c1Preset;
    const chips = C1_PRESETS.map(p => {
      const on = preset === p;
      return `<button type="button" class="seg-btn${on ? ' active' : ''}" data-c1preset="${p}" aria-pressed="${on}">${p}</button>`;
    }).join('');
    const timeBar = `<div class="c1-ts" id="c1TimeBar" role="group" aria-label="Period" data-c1months="${esc(JSON.stringify(c1.months))}" data-c1asof="${esc(String(c1.asOf || ''))}">
          <span class="c1-period-label">Period</span>
          <div class="c1-ts-body">
            <div class="c1-ts-track" id="c1TsTrack">
              <div class="c1-ts-fill" id="c1TsFill" style="left:${posPct(from)};width:calc((100% - var(--c1-thumb)) * ${((to - from) / denom).toFixed(6)})"></div>
              <div class="c1-ts-ticks" id="c1TsTicks">${ticks}</div>
              <input type="range" class="c1-ts-input c1-ts-input-from" min="0" max="${n - 1}" step="1" value="${from}" data-c1period="from" aria-label="Period start" aria-valuetext="${fmtMonth(c1.months[from])}">
              <input type="range" class="c1-ts-input c1-ts-input-to" min="0" max="${n - 1}" step="1" value="${to}" data-c1period="to" aria-label="Period end" aria-valuetext="${fmtMonth(c1.months[to])}">
            </div>
          </div>
          <span class="c1-period-text" id="c1PeriodText">${fmtMonth(c1.months[from])} – ${fmtMonth(c1.months[to])}</span>
          <div class="seg c1-ts-chips" role="group" aria-label="Period presets">${chips}</div>
        </div>`;
    return `<div class="c1-controls">
      <div class="controls-left">${timeBar}</div>
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
    const vis = [...series];
    // Nominal width for the static HTML. The client ResizeObserver replaces it with the measured
    // width of .c1-plot, so one SVG unit becomes one CSS pixel and no text is scaled down.
    const gutter = 104, colW = 46;
    const W = Math.max(nb * colW, 360);
    // I102 — `fNew` reaches the hover window. One payload drives the curve, the table and the refit.
    const pts = buckets.map((b, i) => ({ cx: +((i + 0.5) * W / nb).toFixed(1), label: b.label, pNew: b.pNew, fNew: b.fNew, aFNew: b.aFNew, aRNew: b.aRNew, pCum: b.pCum, fCum: b.fCum, aFCum: b.aFCum, aRCum: b.aRCum }));
    // §4.2 rev 1.65 / I119 — the shared Y-axis maximum is computed from the WINDOWED points, the
    // enabled series and the Bars toggle. Cumulative values stay ABSOLUTE (never rebased): `pts`
    // carries c1.*Cum[lastIdx], so only the scale adapts. Quarter / year grain is handled because
    // buckets already hold the summed monthly bars. Every repaint (period, series, Bars, grain)
    // rebuilds this payload, so the axis is recalculated immediately, with no animation or debounce.
    const valueKeys = [];
    if (vis.includes('plan')) valueKeys.push('pCum', ...(bars ? ['pNew'] : []));
    if (vis.includes('forecast')) valueKeys.push('fCum', ...(bars ? ['fNew'] : []));
    if (vis.includes('actualFirst')) valueKeys.push('aFCum', ...(bars ? ['aFNew'] : []));
    if (vis.includes('actualResub')) valueKeys.push('aRCum', ...(bars ? ['aRNew'] : []));
    const windowMax = pts.reduce((m, p) => Math.max(m, ...valueKeys.map(k => Number(p[k]) || 0)), 1);
    const axis = niceAxisTicks(windowMax);
    const { yMax, step: yStep, intervals: yIntervals } = axis;
    // Map a calendar month to its bucket index. This works for month, quarter and year grain.
    const bucketOfMonth = ym => {
      const ix = c1.months.indexOf(String(ym || '').slice(0, 7));
      if (ix < from || ix > to) return -1;
      const key = bucketKey(c1.months[ix], grain);
      return buckets.findIndex(b => b.key === key);
    };
    const startIdx = bucketOfMonth(c1.projectStart);
    const todayIdx = bucketOfMonth(c1.asOf);
    const actualLast = asOfIdx < 0 || asOfIdx < from ? -1 : (todayIdx >= 0 ? todayIdx : nb - 1);
    const meta = {
      fc: c1.hasMdlForecast, vis, bars, grain, yMax, yStep, yIntervals, gutter,
      startIdx: startIdx < 0 ? null : startIdx, todayIdx: todayIdx < 0 ? null : todayIdx,
      startLabel: startIdx >= 0 ? `Start · ${fmtMonth(String(c1.projectStart).slice(0, 7))}` : 'Start',
      todayLabel: todayIdx >= 0 ? `Today · ${fmtMonth(asOfM)}` : 'Today',
      actualLast
    };
    const plot = c1PlotSvg(pts, meta, W);
    // The whole curve stays visible: viewBox + width:100% + height:auto scale it into the card.
    const svg = `<svg class="scurve-svg" viewBox="0 0 ${plot.W} ${plot.H}" width="${plot.W}" height="${plot.H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Schedule performance S-curve">${plot.inner}<line class="chart-snap" x1="0" y1="${plot.yTop}" x2="0" y2="${plot.yBot}" style="display:none"></line></svg>`;
    // Column 1 of row 1 holds the Y caption and the Y ticks. §4.2 rev 1.64 — the label count,
    // values and positions come from the same metadata that drew the SVG grid lines. Percentages
    // keep them on those lines at every rendered height, with or without the client refit.
    const yTicks = Array.from({ length: plot.yIntervals + 1 }, (_, k) => plot.yIntervals - k).map(g => {
      const value = g * plot.yStep;
      const y = plot.yBot - (value / plot.yMax) * (plot.yBot - plot.yTop);
      return `<span class="c1-ytick" style="top:${(y / plot.H * 100).toFixed(3)}%">${Math.round(value)}</span>`;
    }).join('');
    const yaxis = `<div class="c1-yaxis" aria-hidden="true"><span class="c1-ycap">Documents</span>${yTicks}</div>`;
    // Option B — one native table in one spanning grid item. No ARIA table roles, no display:contents.
    // Rows come from the point keys of the visible series, never from a fixed row set.
    const rowDefs = [
      ...C1_BAR_DEFS.filter(d => vis.includes(d[0])).map(([, key, , label]) => ({ key, label, get: p => p[key] })),
      ...C1_LINE_DEFS.filter(d => vis.includes(d[0])).map(([, key, , label]) => ({ key, label, get: p => p[key] })),
      { key: 'sum', label: 'Actual Σ', get: p => (p.aFCum || 0) + (p.aRCum || 0) },
      { key: 'gap', label: 'Gap vs Plan', neg: true, get: p => (p.aFCum || 0) + (p.aRCum || 0) - (p.pCum || 0) }
    ];
    // §4.2 rev 1.63 — data-c1col is the C1-only two-way hover hook. It is deliberately NOT
    // data-col, which the .ds-table column choosers and resize grips already use.
    const body = rowDefs.map(r => `<tr><th class="g-label" scope="row">${esc(r.label)}</th>${pts.map((p, i) => {
      const value = Number(r.get(p)) || 0;
      return `<td class="g-val${r.neg && value < 0 ? ' neg' : ''}" data-c1col="${i}">${value}</td>`;
    }).join('')}</tr>`).join('');
    const monthHeads = pts.map((p, i) => `<th class="g-axis" scope="col" data-c1col="${i}"><span>${esc(p.label)}</span></th>`).join('');
    // colgroup track 1 = --c1-gutter; the N bare cols split the rest equally, which is bandW = W/N.
    // That is the same X boundary the SVG uses, at every width, with or without scripts.
    const colgroup = `<colgroup><col class="c1-gut" style="width:var(--c1-gutter)">${'<col>'.repeat(nb)}</colgroup>`;
    const many = nb > 13 ? ' c1-many' : ' c1-few';
    const table = `<table class="c1-table${many}"><caption>Schedule performance by reporting month</caption>${colgroup}<thead><tr><th class="g-corner" scope="col">Reporting Month</th>${monthHeads}</tr></thead><tbody>${body}</tbody></table>`;
    const dp = JSON.stringify(pts).replace(/'/g, '&#39;');
    const dg = JSON.stringify({ W: plot.W, yTop: plot.yTop, yBot: plot.yBot }).replace(/'/g, '&#39;');
    const dm = JSON.stringify(meta).replace(/'/g, '&#39;');
    // role="group" keeps the native table in the accessibility tree. bindChartHover writes
    // role="img" only when the host has no role, which would flatten every child of this board.
    return `<div class="scurve sc-board" role="group" aria-label="Schedule performance" data-points='${dp}' data-geo='${dg}' data-c1meta='${dm}' data-c1w="${plot.W}">${c1Controls(c1, st)}<div class="c1-grid" style="--c1-gutter:${gutter}px;--c1-cols:${nb};grid-template-columns:${gutter}px repeat(${nb},minmax(0,1fr))">${yaxis}<div class="c1-plot">${svg}</div>${table}</div><div class="chart-tip"></div></div>`;
  };
  const schedulePerformance = (c1, st) => scurveSVG(c1, st);
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
    let newCount = 0, resubCount = 0, noOutcome = 0;
    const appr = { APP: 0, AWC: 0, NAP: 0, REJ: 0, INF: 0, SUR: 0 };
    if (all) {
      // All months: per Document No. (Option A) — each document counted once.
      for (const group of byDoc.values()) {
        const sorted = [...group].sort((a, b) => a.seq - b.seq);
        const hasResub = sorted.length > 1;
        if (hasResub) resubCount++; else newCount++;
        const latest = sorted[sorted.length - 1];
        if (c3IsReview(latest)) appr.SUR++;
        // I099 — a document that is neither open under review nor carrying an approval code has no
        // recorded outcome. It used to fall out of the donut silently, so the two rings disagreed.
        // It now gets its own segment, and the pipeline raises V-35 for the same condition.
        else { const first = sorted.find(c3HasApproval); if (first && appr[first.approvalStatus] !== undefined) appr[first.approvalStatus]++; else noOutcome++; }
      }
    } else {
      // A specific month: row-level activity (R2) — ignores history.
      for (const row of recs) {
        if (row.isNew) newCount++; else resubCount++;
        if (c3HasApproval(row) && appr[row.approvalStatus] !== undefined) appr[row.approvalStatus]++;
      }
    }
    return { dimVal, submitted: recs.length, newCount, resubCount, noOutcome, appr };
  };
  const c3Totals = metrics => {
    const totals = { New: 0, Resubmission: 0, NoOutcome: 0, APP: 0, AWC: 0, NAP: 0, REJ: 0, INF: 0, SUR: 0 };
    for (const item of metrics) {
      totals.New += item.newCount;
      totals.Resubmission += item.resubCount;
      totals.NoOutcome += item.noOutcome || 0;
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
    // I046 — Total Plan is a discipline-only metric (see C3_PLAN_NOTE).
    const rows = kind === 'submissions'
      ? (dimKey === 'submitter'
          ? [['First Submission', r => r.m.newCount], ['Resubmission', r => r.m.resubCount], ['Under Review', r => all ? r.m.appr.SUR : r.ur]]
          : [['Total Plan', r => r.plan], ['First Submission', r => r.m.newCount], ['Resubmission', r => r.m.resubCount], ['Under Review', r => all ? r.m.appr.SUR : r.ur]])
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
      const colTotal = barSeries.reduce((s, sr) => s + Math.max(0, r.getBar(sr.key)), 0);
      // I106 — §4.6 hover window: header = the column (discipline/submitter), one swatch·label·value row
      // per series (on-chart series token), footer = the column total. Mirrors C1/C2.
      const colTip = `<b>${esc(r.val)}</b>` + barSeries.map(sr => `<div class="chart-tip-row"><span class="ct-l"><span class="chart-swatch c3-swatch ${sr.cls}"></span>${esc(sr.key === 'ur' ? 'Under Review' : sr.key)}</span><b>${r.getBar(sr.key)}</b></div>`).join('') + `<div class="chart-tip-foot">Total <b>${colTotal}</b></div>`;
      let segs = '';
      barSeries.slice().reverse().forEach(sr => {
        const v = r.getBar(sr.key);
        if (v > 0) segs += `<div class="seg-bar ${sr.cls}" style="height:${((v / niceMax) * C3_BAR_H).toFixed(1)}px" data-tip="${attr(colTip)}"></div>`;
      });
      g += `<div class="g-bar" style="grid-column:${i + 2};grid-row:1" data-tip="${attr(colTip)}">${segs}</div>`;
      g += `<div class="g-axis" style="grid-column:${i + 2};grid-row:2">${esc(clipText(r.val, 22))}</div>`;
    });
    rows.forEach(([label, fn], j) => {
      g += `<div class="g-label" style="grid-column:1;grid-row:${j + 3}">${esc(label)}</div>`;
      recs.forEach((r, i) => { g += `<div class="g-val" style="grid-column:${i + 2};grid-row:${j + 3}">${fn(r)}</div>`; });
    });
    const legend = `<div class="c3-legend">${barSeries.map(s => `<span class="c3-leg"><span class="c3-swatch ${s.cls}"></span>${esc(s.key === 'ur' ? 'Under Review' : s.key)}</span>`).join('')}</div>`;
    return `<div class="chart c3-card">
      <div class="c3-card-head"><h3 class="c3-card-title">${title}</h3>${c3CardActions()}</div>
      <div class="c3-card-body"><div class="c3-grid" style="grid-template-columns:104px repeat(${N},minmax(0,1fr))">${g}</div>${legend}</div>
      <div class="chart-tip"></div>
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
      // I099 — All months shows the state of every document, so a document with no recorded outcome
      // gets a segment; otherwise it vanishes and the two rings disagree. A single month shows the
      // activity of that month only, so a row with no approval is not an approval event and stays out.
      : (all
          ? [...APPROVAL_CODES, 'SUR'].map(code => ({ cls: code === 'SUR' ? 'c3-ur' : C3_FILL[code], label: code, value: totals[code] }))
              .concat([{ cls: 'c3-no', label: 'No Outcome', value: totals.NoOutcome }])
          : APPROVAL_CODES.map(code => ({ cls: C3_FILL[code], label: code, value: totals[code] })));
    const title = kind === 'submissions' ? 'Submissions' : 'Approval Status';
    const total = segs.reduce((s, x) => s + x.value, 0);
    if (!total) return `<div class="chart c3-card"><p class="empty">No submissions match the current selection.</p></div>`;
    const svg = c3SingleDonut(segs, title, all ? 'DOCUMENTS' : 'SUBMITTED', total);
    const leg = `<div class="c3-legend">${segs.filter(s => s.value).map(s => `<span class="c3-leg"><span class="c3-swatch ${s.cls}"></span>${esc(s.label)}</span>`).join('')}</div>`;
    return `<div class="chart c3-card">
      <div class="c3-card-head"><h3 class="c3-card-title">${title}</h3>${c3CardActions()}</div>
      ${svg}${leg}
      <div class="chart-tip"></div>
    </div>`;
  };
  const c3Segments = (x, y, width, height, segs, max) => {
    let out = `<rect class="c3-track-bg" x="${x}" y="${y}" width="${width}" height="${height}" rx="2"></rect>`;
    let cx = x;
    for (const seg of segs) {
      if (!seg.value) continue;
      const segW = Math.max(1, seg.value / max * width);
      out += `<rect class="${seg.cls}" x="${cx.toFixed(1)}" y="${y}" width="${segW.toFixed(1)}" height="${height}" rx="2" data-tip="${attr(`<b>${esc(seg.label)}</b><div class="chart-tip-row"><span class="ct-l"><span class="chart-swatch c3-swatch ${seg.cls}"></span>${esc(seg.label)}</span><b>${seg.value}</b></div>`)}"></rect>`;
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
    // I106 — §4.6 donut hover: every arc shows the full swatch·label·value breakdown plus a total
    // footer, mirroring the bar cards. Uses the on-chart series token for each swatch.
    const c3TipRows = segs.filter(s => s.value).map(s => `<div class="chart-tip-row"><span class="ct-l"><span class="chart-swatch c3-swatch ${s.cls}"></span>${esc(s.label)}</span><b>${s.value}</b></div>`).join('');
    const fullTip = `<b>${esc(title)}</b>${c3TipRows}<div class="chart-tip-foot">Total <b>${total}</b></div>`;
    let frac = 0;
    for (const seg of segs) {
      if (!seg.value) continue;
      const f0 = frac, f1 = frac + seg.value / denom; frac = f1;
      const a0 = -Math.PI / 2 + f0 * 2 * Math.PI, a1 = -Math.PI / 2 + f1 * 2 * Math.PI;
      const x0 = (cx + r * Math.cos(a0)).toFixed(2), y0 = (cy + r * Math.sin(a0)).toFixed(2);
      const x1 = (cx + r * Math.cos(a1)).toFixed(2), y1 = (cy + r * Math.sin(a1)).toFixed(2);
      const large = f1 - f0 > 0.5 ? 1 : 0;
      P.push(`<path class="${seg.cls}-arc" d="M${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}" fill="none" stroke-width="${sw}" data-tip="${attr(fullTip)}"></path>`);
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
  // I046 — the Master Document List carries no submitter column, so a plan row can reach a submitter
  // only through the submissions linked to it. In the submitter view Total Plan therefore counts
  // linked rows only and reads low, so the column is dropped there instead of showing a number that
  // cannot grow. It stays in the discipline view, where every plan row has a discipline.
  const C3_PLAN_NOTE = 'Total Plan is not shown for the submitter view: the Master Document List has no submitter column, so a plan row can be counted only through the submissions linked to it.';
  const c3Table = (c3, st) => {
    const month = st.c3Month || 'ALL';
    const dimKey = st.c3Dim === 'submitter' ? 'submitter' : 'discipline';
    const showPlan = dimKey !== 'submitter';
    const values = c3ValuesFor(dimKey, month);
    if (!values.length) return '<div class="c3-summary"><p class="empty">No rows match the current selection.</p></div>';
    const asOfM = String(view.c1.asOf || '').slice(0, 7);
    const rows = values.map(value => {
      const m = c3Metrics(dimKey, value, month);
      const ur = month === 'ALL' ? m.appr.SUR : c3UnderReviewD38(dimKey, value, month, asOfM);
      const tot = month === 'ALL' ? m.newCount + m.resubCount : m.submitted;
      const counts = [m.newCount, m.resubCount, tot, m.appr.APP, m.appr.AWC, ur];
      return showPlan ? [value, c3.planCount(dimKey, value, month), ...counts] : [value, ...counts];
    });
    const footer = ['Total'];
    const headers = [dimKey === 'submitter' ? 'Submitter' : 'Discipline', ...(showPlan ? C3_TABLE_HEADERS : C3_TABLE_HEADERS.slice(1))];
    for (let col = 1; col <= headers.length - 1; col++) footer.push(rows.reduce((sum, row) => sum + row[col], 0));
    const note = showPlan ? '' : `<p class="note">${esc(C3_PLAN_NOTE)}</p>`;
    return `<div class="c3-summary"><div class="c-card"><div class="c3-summary-head"><h3 class="c3-summary-title">Breakdown Summary</h3><button class="btn-secondary" data-c3export title="Download the breakdown table as CSV">⤓ Download</button></div>${table(headers, rows, null, footer)}${note}</div></div>`;
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
    // I105 — label the Start and Today reference lines (mirrors the C1 S-curve), so the unlabelled
    // verticals become identifiable. The CSS classes reuse the line colours (--danger / --slate).
    const startM = fmtMonth(String(view.c1 ? view.c1.projectStart : '').slice(0, 7));
    const asOfM = fmtMonth(String(view.c1 ? view.c1.asOf : '').slice(0, 7));
    const sx = refX(String(view.c1 ? view.c1.projectStart : '').slice(0, 7));
    if (sx != null) { P.push(`<line class="sc-ref sc-ref-start" x1="${sx.toFixed(1)}" y1="${mT}" x2="${sx.toFixed(1)}" y2="${mT + plotH}"></line>`); P.push(`<text class="sc-ref-lbl sc-ref-lbl-start" transform="translate(${(sx + 4).toFixed(1)},${mT + 14}) rotate(90)">Start · ${startM}</text>`); }
    const tx = refX(String(view.c1 ? view.c1.asOf : '').slice(0, 7));
    if (tx != null) { P.push(`<line class="sc-ref sc-ref-today" x1="${tx.toFixed(1)}" y1="${mT}" x2="${tx.toFixed(1)}" y2="${mT + plotH}"></line>`); P.push(`<text class="sc-ref-lbl sc-ref-lbl-today" transform="translate(${(tx + 4).toFixed(1)},${mT + 14}) rotate(90)">Today · ${asOfM}</text>`); }
    let lx = mL; const ly = H - legendH + 14, step = 130;
    series.forEach(code => { P.push(`<g transform="translate(${lx},${ly})"><rect x="0" y="-8" width="12" height="12" rx="2" fill="${c2Color(code)}"></rect><text class="c2-leg-t" x="16" y="2">${esc(code)}</text></g>`); lx += step; });
    P.push(`<line class="chart-snap" x1="0" y1="${mT}" x2="0" y2="${mT + plotH}" style="display:none"></line></svg>`);
    const pts = c2.data.map((d, i) => ({ cx: +xCenter(i).toFixed(1), label: fmtMonth(months[i]), series: series.map(code => ({ code, value: c2Val(d, code) })), total: series.reduce((s, c) => s + c2Val(d, c), 0), nfsUnscheduled: c2.nfsUnscheduled }));
    const dp = JSON.stringify(pts).replace(/'/g, '&#39;'), dg = JSON.stringify({ W, mT, mH: mT + plotH }).replace(/'/g, '&#39;');
    const note = c2.nfsUnscheduled ? `<p class="note">${c2.nfsUnscheduled} planned documents have no planned first-issue date and are not placed on the time axis.</p>` : '';
    return `<div class="c2-stack" data-c2points='${dp}' data-c2geo='${dg}'>${P.join('')}<div class="chart-tip"></div></div>${note}`;
  };
  const c2DelaySVG = (c2, st) => {
    const months = c2.months, nb = months.length;
    if (!nb) return '<p class="empty">No dated records.</p>';
    const vals = c2.data.map(d => { const a = d.delay || []; return a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0; });
    const counts = c2.data.map(d => (d.delay || []).length);
    const yMax = Math.max(1, ...vals) * 1.1;
    const colW = 46, mL = 44, mR = 16, mT = 14, plotH = 240, xLabelH = nb > 13 ? 48 : 22, legH = 26;
    const W = Math.max(nb * colW, 360, mL + 200), H = mT + plotH + xLabelH + legH;
    const plotW = W - mL - mR, bandW = plotW / nb;
    const xCenter = i => nb === 1 ? mL + plotW / 2 : mL + bandW * (i + 0.5);
    const yOf = v => mT + plotH - (v / yMax) * plotH;
    const P = [`<svg class="c2-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%" role="img" aria-label="Average review delay">`];
    for (let g = 0; g <= 4; g++) { const v = yMax * g / 4, y = yOf(v); P.push(`<line class="sc-grid" x1="${mL}" y1="${y}" x2="${W - mR}" y2="${y}"></line><text class="sc-axis" x="${mL - 6}" y="${y + 3}" text-anchor="end">${Math.round(v)}</text>`); }
    const pts = months.map((ym, i) => [xCenter(i), yOf(vals[i])]);
    // I103 — tokenised series colour (§4.6: the window swatch must use the on-chart series token).
    if (pts.length > 1) P.push(`<polyline class="c2-delay-line" points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}"></polyline>`);
    pts.forEach(p => P.push(`<circle class="c2-delay-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3"></circle>`));
    const inclined = nb > 13;
    months.forEach((ym, i) => { const x = xCenter(i).toFixed(1), lbl = fmtMonth(ym); P.push(inclined ? `<text class="sc-axis" x="${x}" y="${mT + plotH + 8}" text-anchor="end" transform="rotate(-40 ${x} ${mT + plotH + 8})">${esc(lbl)}</text>` : `<text class="sc-axis" x="${x}" y="${mT + plotH + 14}" text-anchor="middle">${esc(lbl)}</text>`); });
    const refX = ym => { const ix = months.indexOf(ym); return ix < 0 ? null : xCenter(ix); };
    // I105 — label the Start and Today reference lines (mirrors the C1 S-curve), so the unlabelled
    // verticals become identifiable. The CSS classes reuse the line colours (--danger / --slate).
    const startM = fmtMonth(String(view.c1 ? view.c1.projectStart : '').slice(0, 7));
    const asOfM = fmtMonth(String(view.c1 ? view.c1.asOf : '').slice(0, 7));
    const sx = refX(String(view.c1 ? view.c1.projectStart : '').slice(0, 7));
    if (sx != null) { P.push(`<line class="sc-ref sc-ref-start" x1="${sx.toFixed(1)}" y1="${mT}" x2="${sx.toFixed(1)}" y2="${mT + plotH}"></line>`); P.push(`<text class="sc-ref-lbl sc-ref-lbl-start" transform="translate(${(sx + 4).toFixed(1)},${mT + 14}) rotate(90)">Start · ${startM}</text>`); }
    const tx = refX(String(view.c1 ? view.c1.asOf : '').slice(0, 7));
    if (tx != null) { P.push(`<line class="sc-ref sc-ref-today" x1="${tx.toFixed(1)}" y1="${mT}" x2="${tx.toFixed(1)}" y2="${mT + plotH}"></line>`); P.push(`<text class="sc-ref-lbl sc-ref-lbl-today" transform="translate(${(tx + 4).toFixed(1)},${mT + 14}) rotate(90)">Today · ${asOfM}</text>`); }
    P.push(`<text class="c2-leg-t" x="${mL}" y="${H - 8}">Avg Review Delay (days) · not-returned &amp; not-due = 0</text>`);
    P.push(`<line class="chart-snap" x1="0" y1="${mT}" x2="0" y2="${mT + plotH}" style="display:none"></line></svg>`);
    // I103 — nearest-datum payload: element mode (data-tip on the dots) left the window reachable
    // only on the 3 px dots, a dead zone everywhere else. Each point carries the month, the average
    // delay (days, one decimal) and the document count in that mean.
    const dp = JSON.stringify(months.map((ym, i) => ({ cx: +xCenter(i).toFixed(1), label: fmtMonth(ym), delay: +vals[i].toFixed(1), n: counts[i] }))).replace(/'/g, '&#39;');
    const dg = JSON.stringify({ W, mT, mB: mT + plotH }).replace(/'/g, '&#39;');
    return `<div class="c2-stack" data-points='${dp}' data-geo='${dg}'>${P.join('')}<div class="chart-tip"></div></div>`;
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
      // I104 — per-stage hover window: the funnel board never bound, because its `.c2-stack`
      // carried no `.chart-tip`. Header = stage, body row = swatch · count, footer = share of
      // planned. The swatch hex follows the on-chart stage fill (tokenisation tracked with the
      // C2 stacked series, I092).
      const tipHtml = `<b>${esc(s.label)}</b><div class="chart-tip-row"><span class="ct-l"><span class="chart-swatch" style="background:${s.color}"></span>Documents</span><b>${v}</b></div><div class="chart-tip-foot"><span>Share of planned</span><b>${f.planned ? Math.round(100 * v / f.planned) : 0}%</b></div>`;
      if (i < STAGES.length - 1) {
        const topW = widthOf(v), botW = widthOf(f[STAGES[i + 1].key]);
        p += `<path d="M${cx - topW / 2},${yTop} L${cx + topW / 2},${yTop} L${cx + botW / 2},${yBot} L${cx - botW / 2},${yBot} Z" fill="${s.color}" fill-opacity="0.92" stroke="#fff" stroke-width="1.5" data-tip="${attr(tipHtml)}"></path>`;
      } else {
        p += `<rect x="${cx - SQ / 2}" y="${yBot - SQ - 4}" width="${SQ}" height="${SQ}" rx="4" fill="${s.color}" stroke="#fff" stroke-width="1.5" data-tip="${attr(tipHtml)}"></rect>`;
      }
      const mid = i < STAGES.length - 1 ? (yTop + yBot) / 2 : yBot - 4 - SQ / 2;
      p += `<text class="c2-funnel-lab" x="${gut - 4}" y="${mid - 3}" text-anchor="end">${esc(s.label)}</text>`;
      p += `<text class="c2-funnel-val" x="${gut - 4}" y="${mid + 13}" text-anchor="end">${v}</text>`;
    });
    p += '</svg>';
    const rows = f.byDisc.map(r => `<tr><td>${esc(r.discipline)}</td><td>${r.planned}</td><td>${r.submitted}</td><td>${r.inReview}</td><td>${r.awc}</td><td>${r.approved}</td></tr>`).join('');
    const table = `<table class="c2-ftab"><thead><tr><th>Discipline</th><th>Planned Deliverables</th><th>Submitted for Review</th><th>Under Review</th><th>AWC</th><th>Approved</th></tr></thead><tbody>${rows}<tr class="tot"><td>Total</td><td>${f.planned}</td><td>${f.submitted}</td><td>${f.inReview}</td><td>${f.awc}</td><td>${f.approved}</td></tr></tbody></table>`;
    return `<div class="c2-stack"><div class="c2-funnel-row"><div class="c2-ftab-wrap">${table}</div><div class="c2-funnel-wrap">${p}</div></div><div class="chart-tip"></div></div>`;
  };
  const submissionFlow = (c2, st) => {
    const view = st.c2View || 'stacked';
    const body = view === 'delay' ? c2DelaySVG(c2, st) : view === 'funnel' ? c2Funnel(c2) : c2StackedSVG(c2, st);
    return `<div class="c-card">${c2Controls(st)}${body}</div>`;
  };
  const overview = (state) => {
    const k = view.kpis;
    const statusData = Object.entries(view.active.reduce((map, row) => { map[row.submissionStatus || 'Blank'] = (map[row.submissionStatus || 'Blank'] || 0) + 1; return map; }, {})).map(([status, count]) => ({ status, count }));
    return `${activePanel('KPI OVERVIEW', `<div class="kpi-grid">${card('Documents Logged', k.totalSubmissions)}<article class="kpi-card" data-tip="${attr(kpiTipHtml('Documents Submitted / In Plan'))}"><div class="v">${k.submitted} / <span data-kpi="totalPlanned">${k.totalPlanned}</span></div><div class="l">Documents Submitted / In Plan</div><div class="chart-tip" role="tooltip"></div></article>${card('Under Review (SUR)', k.underReview, 'amb')}${card('Approved (APP + AWC)', k.approved, 'ok')}${card('On-Time Return Rate', `${(k.onTimeRate * 100).toFixed(1)}%`, k.onTimeRate >= 1 ? 'ok' : 'amb')}${card('Average Review Delay', `${k.averageDelay.toFixed(1)} days`, k.averageDelay > 0 ? 'warn' : 'ok')}</div>`)}
      <div class="panel-grid">${activePanel('C1 Schedule Performance', schedulePerformance(view.c1, state), true)}${activePanel('C2 Submission Flow & Delay', submissionFlow(view.c2, state), true)}${activePanel('C3 Breakdown', breakdown(view.c3, state))}</div>`;
  };
  // D41 — Submittals panel: one row per document (grouped by Document No.), with a toggleable,
  // consolidated submission history. Current status columns stay in the main row; the full per-submission
  // detail (incl. Prolog / Transmittal No.) expands on toggle. Title reads from the MDL planned row,
  // falling back to the submission's prolog subject when MDL has none.
  const submissions = () => {
    const allDocs = view.documents || [];
    const plannedById = new Map(model.planned.map(p => [p.id, p]));
    const planOf = row => plannedById.get(row.linkedPlannedId);
    const titleFor = group => { const plan = planOf(group[0]); return plan?.title || group[0].fields['Document Title'] || '—'; };
    const discFor = group => { const plan = planOf(group[0]); return plan?.discipline || group[0].discipline || 'Unknown'; };
    // I107/I111 — month filter spans project start → as-of (like C3 I106), so the as-of month is
    // selectable even with no submissions yet; it then keeps only documents with a submission in the
    // selected month (default "ALL" = every month). The expanded history is limited to that month.
    const monthOf = r => String(r.submissionDate || '').slice(0, 7);
    const subMonth = state.subMonth || 'ALL';
    const asOfYm = String(model.meta.asOfDate || '').slice(0, 7);
    const projYmSpan = String(model.meta.projectStartDate || '').slice(0, 7);
    const dataYms = allDocs.flatMap(g => g.map(monthOf).filter(Boolean));
    let startYm = asOfYm || projYmSpan;
    for (const ym of dataYms) if (ym < startYm) startYm = ym;
    if (projYmSpan && projYmSpan < startYm) startYm = projYmSpan;
    const months = [];
    if (startYm) {
      let [y, m] = startYm.split('-').map(Number);
      const [ey, em] = asOfYm ? asOfYm.split('-').map(Number) : [y, m];
      while (y < ey || (y === ey && m <= em)) {
        months.push(`${y}-${String(m).padStart(2, '0')}`);
        if (m === 12) { y++; m = 1; } else m++;
      }
    }
    const docs = subMonth === 'ALL' ? allDocs : allDocs.filter(g => g.some(r => monthOf(r) === subMonth));
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
    // I107 — when a month is selected, the expanded history shows only that month's submission(s), ordered by date.
    const histFor = group => (subMonth === 'ALL' ? group : group.filter(r => monthOf(r) === subMonth))
      .slice().sort((a, b) => (a.submissionDate || '').localeCompare(b.submissionDate || ''));
    const bodyRows = docs.map(group => {
      const docNo = group[0].documentNo || '';
      const cells = indexes.map(i => `<td${cellAttrs(i)}>${cellHtml(group, i)}</td>`).join('');
      const hist = histFor(group);
      const inner = hist.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.fields['Prolog No.'] || '—')}</td><td>${esc(r.submissionDate || '—')}</td><td>${esc(r.actualReturnDate || '—')}</td><td>${esc(r.submissionStatus || '—')}</td><td>${esc(r.approvalStatus || '—')}</td></tr>`).join('');
      const innerTable = `<table class="ds-table hist-table"><tbody><tr class="hist-head"><th>#</th><th>Prolog / Transmittal No.</th><th>Submission Date</th><th>Return Date</th><th>Submission Status</th><th>Approval Status</th></tr>${inner}</tbody></table>`;
      const detail = `<tr class="sub" id="subd-${esc(docNo)}" data-doc="${esc(docNo)}" hidden><td colspan="${indexes.length}"><div class="sub-inner">${innerTable}</div></td></tr>`;
      return `<tr class="expandable" data-doc="${esc(docNo)}" tabindex="0">${cells}</tr>${detail}`;
    }).join('');
    const colgroup = indexes.map((i, pos) => `<col${i ? ` data-col="${i}"` : ''}${i === 0 ? ' style="width:32px"' : ''}>`).join('');
    const heads = indexes.map(i => `<th scope="col"${cellAttrs(i)}><span class="th-wrap"><span class="lb">${esc(headers[i])}</span></span>${i ? `<span class="ds-resize" data-col="${i}" role="separator" aria-label="Resize ${esc(headers[i])}"></span>` : ''}</th>`).join('');
    const headFrag = `<div class="vheadwrap"><table class="ds-table vheadtab" data-table-key="subdoc" data-column-count="${headers.length}"><colgroup>${colgroup}<col class="ds-gut"></colgroup><thead><tr>${heads}<th class="ds-gut" scope="col" aria-hidden="true"></th></tr></thead></table></div>`;
    const chooserOpen = state.openChooser === 'subdoc';
    const chooser = columnChooser('subdoc', headers, chosen, chooserOpen);
    // I107 — cumulative "total as-of month" summary: submissions from project start through the selected month.
    const projYm = String(model.meta.projectStartDate || '').slice(0, 7);
    const allSubs = allDocs.flatMap(g => g);
    const cum = subMonth === 'ALL'
      ? allSubs.length
      : allSubs.filter(r => { const ym = monthOf(r); return (!projYm || ym >= projYm) && ym <= subMonth; }).length;
    const monthSel = `<label class="sub-month-lbl">Month</label><select class="sub-month" data-submonth>${['ALL', ...months].map(m => `<option value="${esc(m)}"${m === subMonth ? ' selected' : ''}>${m === 'ALL' ? 'All months' : esc(fmtMonth(m))}</option>`).join('')}</select>`;
    const cumLabel = `Total as-of ${subMonth === 'ALL' ? 'all months' : esc(fmtMonth(subMonth))}: ${cum}`;
    // I108 — panel summary on its own line, above the control row (spec §4: subtitle optional).
    const summary = `<div class="panel-summary"><span class="summary">${docs.length} documents</span><span class="summary">${cumLabel}</span></div>`;
    const controls = `<div class="table-tools">${monthSel}<button class="csv-btn btn-secondary" data-export="submittals">⤓ CSV</button><button class="cc-btn btn-secondary" id="ccBtn_subdoc" aria-controls="ccPanel_subdoc" aria-haspopup="true" aria-expanded="${chooserOpen}">Columns</button>${chooser}</div>`;
    const body = docs.length ? `<tbody>${bodyRows}</tbody>` : `<tbody><tr><td class="empty" colspan="${indexes.length}">No documents match the current selection.</td></tr></tbody>`;
    const tableHtml = `<div class="c-card">${controls}<div class="ds-split splitcard">${headFrag}<div class="tableScroll"><table class="ds-table" data-table-key="subdoc" data-column-count="${headers.length}">${colgroup}${body}</table></div></div></div>`;
    // I109 — subtitle sits in the panel body before the .c-card, aligned to the content edge (matches Forward/Overdue .note).
    return activePanel('Submittals', `${summary}${tableHtml}`, true);
  };
  const validation = () => {
    const counts = new Map();
    for (const issue of view.issues) counts.set(issue.code, (counts.get(issue.code) || 0) + 1);
    const rules = [...counts].map(([code, count]) => { const item = model.contract.errorRules.find(rule => rule.code === code) || {}; return [item.severity || 'Warning', code, item.group || 'Business rule', item.rule || 'Description is not in the workbook Code sheet.', count]; });
    const issueRows = view.issues.map(issue => [issue.severity, issue.code, issue.documentNo, issue.field, issue.value, issue.message, issue.sheet, issue.row]);
    const err = view.issues.filter(x => String(x.severity).toLowerCase() === 'error').length;
    const warn = view.issues.filter(x => String(x.severity).toLowerCase() === 'warning').length;
    const info = view.issues.filter(x => String(x.severity).toLowerCase() === 'info').length;
    // I026 — a blank MDL Document No. is reported by MDL (decision D33), so the sub Validation page
    // no longer raises V-01 for it. The line keeps the reason visible on the page.
    const meta = `${model.contract.mdlFields.length.toLocaleString()} MDL fields · ${model.contract.logHeaders.length.toLocaleString()} log headers · ${model.contract.errorRules.length} rules loaded · rule text from workbook Code sheet · a blank MDL Document No. is reported by MDL (D33), not here`;
    // I112 — panel-local error-code filter (§7.2.7 pt 6 / §7.1 B6): narrows only the Issues table, never the Rules table.
    const code = state.issueCode || 'ALL';
    const codes = [...new Set(view.issues.map(i => i.code))].sort();
    const codeSel = `<select class="v-code" data-vcode aria-label="Filter by error code">${['ALL', ...codes].map(c => `<option value="${esc(c)}"${c === code ? ' selected' : ''}>${c === 'ALL' ? 'All codes' : esc(c)}</option>`).join('')}</select>`;
    const filteredIssueRows = code === 'ALL' ? issueRows : issueRows.filter(r => r[1] === code);
    const issueHeaders = ['Severity', 'Rule', 'Doc No.', 'Field', 'Value', 'Message', 'Source Tab', 'Row'];
    const page = state.issuePage || 1;
    // I112 — retain the full filtered set so CSV export covers every filtered row, not just the visible page.
    lastIssueExport = { headers: issueHeaders, rows: filteredIssueRows, columns: Array.isArray(state.columnSets?.issue) ? state.columnSets.issue : null };
    // I112 (sample design) — the meta note is PANEL level, directly under the Validation page title,
    // above the .v-summary row (§4 subtitle standard). It is no longer the Issues table subtitle.
    return activePanel('Validation', `
      <p class="note">${meta}</p>
      <div class="v-summary">
        <span class="v-count" data-validation-count>${filteredIssueRows.length.toLocaleString()} issues</span>
        <div class="summary-chips">
          <span class="vchip e">Error ${err}</span>
          <span class="vchip w">Warning ${warn}</span>
          <span class="vchip i">Info ${info}</span>
        </div>
      </div>
      <div class="c-card v-section">
        ${table(['Severity', 'Code', 'Group', 'Description', 'Count'], rules, null, null, { widths: [110, 90, 130, 420, 70], title: 'Rules' })}
      </div>
      <div class="c-card v-section">
        ${table(issueHeaders, filteredIssueRows, 'issue', null, { widths: [90, 90, 120, 110, 130, 360, 100, 70], title: 'Issues', filter: codeSel, pageSize: 200, page })}
      </div>
    `, true);
  };
  const forwardAndOverdue = (state) => {
    const asOf = model.meta.asOfDate;
    const horizon = Number(state.foHorizon) || 4;
    const lane = state.foLane || 'all';
    const viewKey = state.foView || 'lookahead';
    const RESUBMIT_LEAD = 14;
    const byDoc = new Map();
    for (const s of view.active) {
      if (!s.documentNo) continue;
      const arr = byDoc.get(s.documentNo) || [];
      arr.push(s);
      byDoc.set(s.documentNo, arr);
    }
    const planByDoc = new Map(view.activePlans.map(p => [p.documentNo, p]));
    const classify = (docNo) => {
      const subs = (byDoc.get(docNo) || []).slice().sort((a, b) => String(a.submissionDate || '').localeCompare(String(b.submissionDate || '')));
      if (!subs.length) return { category: 'first', latest: null };
      const latest = subs[subs.length - 1];
      const st = latest.submissionStatus || '';
      if (st === 'SUR') return { category: 'return', latest };
      if (st === 'RTR' || st === 'NTS') return { category: 'resubmit', latest };
      return { category: 'closed', latest };
    };
    const rows = [];
    for (const p of view.activePlans) {
      if (!p.documentNo || p.isSubmitted) continue;
      const basis = p.fields['Planned 1st Issue Date'] || p.fields['Forecast 1st Issue Date'] || null;
      rows.push({ docNo: p.documentNo, title: p.title || p.fields['Document Title'] || '—', discipline: p.discipline || 'Unknown', stage: p.stage || '—', category: 'first', status: 'NFS', basis, plan: p });
    }
    for (const [docNo, subs] of byDoc) {
      const { category, latest } = classify(docNo);
      if (category === 'closed' || category === 'first') continue;
      const plan = planByDoc.get(docNo);
      const base = category === 'resubmit' ? (latest.actualReturnDate || latest.targetReturnDate) : latest.targetReturnDate;
      const basis = category === 'resubmit' && base ? addDaysISO(base, RESUBMIT_LEAD) : base;
      rows.push({ docNo, title: (latest.fields && latest.fields['Document Title']) || (plan && plan.title) || '—', discipline: latest.discipline || (plan && plan.discipline) || 'Unknown', stage: (plan && plan.stage) || '—', category, status: latest.submissionStatus || '', basis, plan });
    }
    const dated = rows.map(r => ({ ...r, delta: r.basis ? daysBetween(r.basis, asOf) : null })).filter(r => r.delta !== null);
    const laneMatch = r => lane === 'all' || (lane === 'first' && r.category === 'first') || (lane === 'resubmit' && r.category === 'resubmit') || (lane === 'return' && r.category === 'return');
    const lower = 7, upper = horizon * 7;
    const look = dated.filter(r => r.delta >= lower && r.delta <= upper && laneMatch(r)).sort((a, b) => a.delta - b.delta);
    const over = dated.filter(r => r.delta < 0 && laneMatch(r)).sort((a, b) => a.delta - b.delta);
    const cov = dated.filter(r => r.category === 'first').sort((a, b) => String(a.basis).localeCompare(String(b.basis)));
    const pillClass = s => s === 'NFS' ? 'nfs' : s === 'SUR' ? 'sur' : (s === 'RTR' || s === 'NTS') ? 'rtr' : '';
    const actionLabel = { first: 'First submit', resubmit: 'Resubmit', return: 'Return' };
    const pill = s => `<span class="fo-pill ${pillClass(s)}">${esc(s)}</span>`;
    const foTable = (headers, data, key, widths = null) => {
      const indexes = headers.map((_, i) => i);
      const numeric = new Set(indexes.filter(i => { const vals = data.map(r => String(r[i] ?? '').replace(/<[^>]*>/g, '').trim()).filter(Boolean); return vals.length && vals.every(v => /^-?[\d,]+(?:\.\d+)?$/.test(v)); }));
      const attrs = i => { const c = []; if (numeric.has(i)) c.push('num'); if (i === 0) c.push('ds-pinned'); return (i ? ` data-col="${i}"` : '') + (c.length ? ` class="${c.join(' ')}"` : ''); };
      const tr = r => `<tr>${indexes.map(i => `<td${attrs(i)}>${r[i]}</td>`).join('')}</tr>`;
      const colgroup = indexes.map((i, pos) => `<col${i ? ` data-col="${i}"` : ''}${widths && widths[i] != null ? ` style="width:${widths[i]}px"` : (i === 0 ? ' style="width:150px"' : '')}>`).join('');
      const heads = indexes.map(i => `<th scope="col"${attrs(i)}><span class="th-wrap"><span class="lb">${esc(headers[i])}</span></span>${i ? `<span class="ds-resize" data-col="${i}" role="separator" aria-label="Resize ${esc(headers[i])}"></span>` : ''}</th>`).join('');
      const body = data.length ? `<tbody>${data.map(tr).join('')}</tbody>` : `<tbody><tr><td class="empty" colspan="${indexes.length}">No rows match the current selection.</td></tr></tbody>`;
      const frag = `<div class="vheadwrap"><table class="ds-table vheadtab" data-table-key="${key}"><colgroup>${colgroup}<col class="ds-gut"></colgroup><thead><tr>${heads}<th class="ds-gut" scope="col" aria-hidden="true"></th></tr></thead></table></div>`;
      tableRows.set(key, { headers, rows: data, indexes, windowed: false });
      return `<div class="ds-split splitcard" style="--pin-first-col:150px">${frag}<div class="tableScroll"><table class="ds-table" data-table-key="${key}" data-column-count="${headers.length}"><colgroup>${colgroup}</colgroup>${body}</table></div></div>`;
    };
    const seg = (cur, items, attr) => `<div class="seg">${items.map(([v, l]) => `<button class="seg-btn${cur === v ? ' active' : ''}" data-${attr}="${v}">${l}</button>`).join('')}</div>`;
    const viewSeg = seg(viewKey, [['lookahead', 'Look-Ahead'], ['overdue', 'Overdue'], ['coverage', 'Coverage']], 'fo-view');
    const laneSeg = seg(lane, [['all', 'All'], ['first', 'First submit'], ['resubmit', 'Resubmit'], ['return', 'Return']], 'fo-lane');
    const horizonSeg = seg(String(horizon), [['1', '1 wk'], ['2', '2 wks'], ['3', '3 wks'], ['4', '4 wks']], 'fo-horizon');
    const csvBtn = key => `<button class="csv-btn btn-secondary" data-export-table="${key}">⤓ CSV</button>`;
    let summary, tableHtml, right;
    if (viewKey === 'lookahead') {
      const headers = ['Document No.', 'Title', 'Discipline', 'Stage', 'Action', 'Status', 'Basis Date', 'In (days)'];
      const widths = [150, 300, 90, 70, 110, 70, 120, 90];
      const data = look.map(r => [r.docNo, r.title, r.discipline, r.stage, actionLabel[r.category], pill(r.status), r.basis, r.delta]);
      summary = `Next ${horizon} week${horizon > 1 ? 's' : ''} (+7 to +${upper} days): ${look.length} document${look.length === 1 ? '' : 's'} due. Overdue is in the Overdue view.`;
      tableHtml = foTable(headers, data, 'fo-lookahead', widths);
      right = `${horizonSeg}${laneSeg}${csvBtn('fo-lookahead')}`;
    } else if (viewKey === 'overdue') {
      const f = over.filter(r => r.category === 'first').length, r2 = over.filter(r => r.category === 'resubmit').length, u = over.filter(r => r.category === 'return').length;
      const headers = ['Document No.', 'Title', 'Discipline', 'Stage', 'Action', 'Status', 'Basis Date', 'Overdue (days)'];
      const widths = [150, 300, 90, 70, 110, 70, 120, 100];
      const data = over.map(r => [r.docNo, r.title, r.discipline, r.stage, actionLabel[r.category], pill(r.status), r.basis, r.delta]);
      summary = `Backward-looking: ${over.length} overdue — ${f} to first submit · ${r2} to resubmit · ${u} to return.` + (lane !== 'all' ? ` Showing ${over.length}.` : '');
      tableHtml = foTable(headers, data, 'fo-overdue', widths);
      right = `${laneSeg}${csvBtn('fo-overdue')}`;
    } else {
      const headers = ['Document No.', 'Title', 'Discipline', 'Stage', 'Planned 1st Issue Date', 'Forecast 1st Issue Date'];
      const widths = [150, 300, 90, 70, 150, 150];
      const data = cov.map(r => [r.docNo, r.title, r.discipline, r.stage, (r.plan && r.plan.fields['Planned 1st Issue Date']) || '—', (r.plan && r.plan.fields['Forecast 1st Issue Date']) || '—']);
      summary = `Coverage: ${cov.length} planned rows not yet submitted (NFS).`;
      tableHtml = foTable(headers, data, 'fo-coverage', widths);
      right = csvBtn('fo-coverage');
    }
    const controls = `<div class="fo-controls">${viewSeg}<div class="table-tools fo-right">${right}</div></div>`;
    return activePanel('Forward and Overdue', `<p class="note">${summary}</p><div class="c-card">${controls}${tableHtml}</div>`);
  };
  // Long-due (aging SUR) — split into four age-bucket cards (workplan §4.9, I079).
  const analytics = () => {
    // C4 — Scatter (turnaround x delay) <-> Age buckets (open SUR by days past target).
    const c4ViewSeg = st => {
      const mode = st.c4View === 'buckets' ? 'buckets' : 'scatter';
      const seg = key => `<button class="seg-btn${mode === key ? ' active' : ''}" data-c4view="${key}">${key === 'scatter' ? 'Scatter' : 'Age buckets'}</button>`;
      return `<div class="seg" role="group" aria-label="C4 view">${seg('scatter')}${seg('buckets')}</div>`;
    };
    const ld = view.kpis.longDue;
    const openSur = view.active.filter(r => r.submissionStatus === 'SUR' && !r.actualReturnDate).length;
    const bk = [['<30 d', ld.lt30], ['30–60 d', ld.b30_60], ['60–90 d', ld.b60_90], ['>90 d', ld.gt90]];
    // I103 follow-up — the buckets bars carried no hover detail at all (the fixed Tier 6 switch
    // sweep surfaced it as an advisory). Each row gets a §4.6 window: header = bucket, body row =
    // swatch · count, footer = share of overdue.
    const overdue = ld.total || 0;
    const c4BucketsHtml = barChart(bk.map(([label, value]) => ({ label, value, pct: overdue ? Math.round(100 * value / overdue) : 0 })), 'label', 'value',
      item => `<b>${esc(item.label)}</b><div class="chart-tip-row"><span class="ct-l"><span class="chart-swatch c4-bucket"></span>Open SUR past target</span><b>${item.value}</b></div><div class="chart-tip-foot"><span>Share of overdue</span><b>${item.pct}%</b></div>`)
      + `<p class="note">Open SUR (submitted, not yet returned) split by days past each record's Target Return Date. Total open SUR = ${openSur}; of those, ${ld.total} are past target (overdue).</p>`;
    const c4ScatterHtml = c4ScatterSvg(view.c4Scatter)
      + '<div class="legend"><span><i style="background:var(--blue)"></i>Returned / on-time submission</span><span><i style="background:var(--red)"></i>Open &amp; past target (overdue)</span></div>';
    const c4Content = `<div class="c-card c4-chart">${state.c4View === 'buckets' ? c4BucketsHtml : c4ScatterHtml}<div class="chart-tip"></div></div>`;
    const c4 = activePanel('C4 Turnaround & Aging', c4Content, false, c4ViewSeg(state));
    return `${activePanel('Bottleneck KPIs', `<div class="kpi-grid">${card('Long-due SUR <30d', view.kpis.longDue.lt30)}${card('Long-due SUR 30–60d', view.kpis.longDue.b30_60)}${card('Long-due SUR 60–90d', view.kpis.longDue.b60_90)}${card('Long-due SUR >90d', view.kpis.longDue.gt90)}${card('Rework Rate', `${view.kpis.reworkRate.toFixed(1)}%`)}${card('Avg Review Cycle', `${view.kpis.avgReviewCycle.toFixed(1)} days`)}${card('Avg Approval Cycle', `${view.kpis.avgApprovalCycle.toFixed(1)} days`)}${card('Avg Review Delay', `${view.kpis.averageDelay.toFixed(1)} days`, view.kpis.averageDelay > 0 ? 'warn' : 'ok')}</div>`)}<div class="panel-grid">${c4}</div>`;
  };
  const help = (state) => { const copy = state.uiHelp?.pages || {}; const glossary = state.uiHelp?.statusGlossary || {}; return activePanel('Help', `<p>${esc(copy.Help || 'Load both workbooks and use the shared filters.')}</p><p>${esc(state.uiHelp?.filePanel?.instructions || '')}</p><p>Source files: ${esc(model.meta.mdlWorkbookName)} and ${esc(model.meta.logWorkbookName)}.</p><h3>Status glossary</h3>${Object.entries(glossary).flatMap(([group, items]) => Object.entries(items).map(([code, label]) => `<p><b>${esc(group)} · ${esc(code)}</b> — ${esc(label)}</p>`)).join('')}`); };
  const settings = (state) => activePanel('Settings', `<label>Theme <select data-setting="theme">${['dark','light','sky','ocean','presentation'].map(theme => `<option value="${theme}"${(state.theme || 'dark') === theme ? ' selected' : ''}>${theme}</option>`).join('')}</select></label><label><input type="checkbox" data-setting="showWarnings"${state.showWarnings === false ? '' : ' checked'}> Show warnings</label><label><input type="checkbox" data-setting="rememberNames"${state.rememberNames ? ' checked' : ''}> Remember workbook names</label>`);
  const views = { Overview: overview, Submittals: submissions, Validation: validation, 'Forward and Overdue': forwardAndOverdue, Analytical: analytics, Help: help, Settings: settings };
  root.innerHTML = (views[page] || overview)(state);
  // §4.6 — shared delegated hover binder (one function for every chart board + KPI card)
  // Modes: nearest (C1/C2 line/area, data-driven) or element (C3/C4/KPI, reads [data-tip] from the
  // hovered element — robust for donuts, scatter and HTML bars). Auto-detects: if data-points/geo are
  // present it uses nearest, otherwise element. Adds a touch tap-to-show variant, focus/keyboard parity,
  // an opacity-only transition, and a below-card placement for KPI cards.
  const _chartTipBindings = [];
  if (!window.__chartTipOutside) {
    window.__chartTipOutside = true;
    document.addEventListener('pointerdown', e => {
      for (const b of _chartTipBindings) {
        if (!document.contains(b.root)) continue;
        if (!b.root.contains(e.target) && !b.tip.contains(e.target)) b.hide();
      }
    }, true);
  }
  const bindChartHover = (root, opts = {}) => {
    if (!root || typeof root.querySelector !== 'function') return;
    const { pointsAttr = 'data-points', geoAttr = 'data-geo', render, placement = 'cursor', snap = true, focusable = true, live = false, attachedTable = false } = opts;
    const svg = root.querySelector('svg');
    const tip = root.querySelector('.chart-tip');
    if (!tip) return;
    // §4.6 rev 1.63 — the window starts hidden and aria-hidden. Every board keeps its persistent
    // aria-describedby link; only the hidden state and the text change.
    tip.setAttribute('aria-hidden', 'true');
    let pts = [], geo = {}, nearest = false;
    // `live` charts (C1) re-read their payload on each move. The C1 ResizeObserver rewrites
    // data-points.cx and data-geo.W when the panel width changes, so the snap line must follow.
    const readPayload = () => {
      try { pts = JSON.parse((root.getAttribute(pointsAttr) || '[]').replace(/&#39;/g, "'")); } catch (_) {}
      try { geo = JSON.parse((root.getAttribute(geoAttr) || '{}').replace(/&#39;/g, "'")); } catch (_) {}
      nearest = !!(pts.length && geo.W);
    };
    readPayload();
    const snapEl = snap && svg ? svg.querySelector('.chart-snap') : null;
    if (focusable) {
      if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '0');
      root.setAttribute('role', root.getAttribute('role') || 'img');
      const tipId = (root.id ? root.id + '-tip' : 'chtip-' + Math.random().toString(36).slice(2));
      tip.id = tipId;
      tip.setAttribute('role', 'tooltip');
      root.setAttribute('aria-describedby', tipId);
    }
    let active = -1, activeEl = null;
    const place = e => {
      const br = root.getBoundingClientRect();
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      if (placement === 'below') {
        let tx = (br.width - tw) / 2; tx = Math.max(4, Math.min(tx, br.width - tw - 4));
        tip.style.left = tx + 'px'; tip.style.top = (root.offsetHeight + 6) + 'px';
        return;
      }
      const px = e ? e.clientX - br.left : br.width / 2;
      const py = e ? e.clientY - br.top : br.height / 2;
      let tx = px + 14, ty = py + 14;
      if (tx + tw > br.width) tx = px - tw - 14;
      if (tx < 0) tx = 4;
      if (ty + th > br.height) ty = py - th - 14;
      if (ty < 0) ty = 4;
      tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
    };
    // §4.6 rev 1.63 — an element directly referenced by aria-describedby can still be exposed by
    // assistive tech despite aria-hidden, so hiding MUST clear the text too, not just the class.
    const hideTip = () => {
      if (tip.classList.contains('show') || tip.textContent !== '' || !tip.hasAttribute('aria-hidden')) {
        tip.classList.remove('show'); tip.textContent = ''; tip.setAttribute('aria-hidden', 'true');
      }
    };
    const showTipWindow = html => { tip.innerHTML = html; tip.removeAttribute('aria-hidden'); tip.classList.add('show'); };
    // §4.2 rev 1.63 — C1-only two-way month-column sync. Query the band fresh on each activation:
    // c1Refit() replaces svg.innerHTML, so a cached node would go stale after a width change.
    const columnBand = () => svg ? svg.querySelector('.sc-hover-band') : null;
    const setColumn = i => {
      const band = columnBand();
      if (band) {
        const bw = (Number(geo.W) || (svg ? svg.viewBox.baseVal.width : 0)) / Math.max(1, pts.length);
        band.setAttribute('x', (i * bw).toFixed(1));
        band.setAttribute('width', bw.toFixed(1));
        band.style.display = '';
      }
      root.querySelectorAll('.c1-table [data-c1col].col-active').forEach(el => el.classList.remove('col-active'));
      root.querySelectorAll(`.c1-table [data-c1col="${i}"]`).forEach(el => el.classList.add('col-active'));
    };
    const clearColumn = () => {
      const band = columnBand(); if (band) band.style.display = 'none';
      root.querySelectorAll('.c1-table [data-c1col].col-active').forEach(el => el.classList.remove('col-active'));
    };
    const show = html => { if (html == null) return hide(); showTipWindow(html); };
    const hide = () => { hideTip(); active = -1; activeEl = null; if (snapEl) snapEl.style.display = 'none'; if (attachedTable) clearColumn(); };
    const onMove = e => {
      // C1 controls now live inside the board. A click on them must not open the datum window.
      if (e.target && e.target.closest && e.target.closest('.c1-controls')) { hide(); return; }
      if (attachedTable && svg) {
        const inSvg = e.target === svg || (e.target && svg.contains && svg.contains(e.target));
        const cell = !inSvg && e.target && e.target.closest ? e.target.closest('[data-c1col]') : null;
        // §4.2 rev 1.63 — table hover keeps the snap line, band and column highlight but the
        // floating window stays closed so it never covers the numbers it describes.
        const tableHover = !inSvg && !!cell;
        if (!inSvg && !tableHover) { hide(); return; }
        if (live) readPayload();
        if (!nearest || !svg.getBoundingClientRect().width) return;
        let best = 0;
        if (tableHover) best = Number(cell.getAttribute('data-c1col')) || 0;
        else {
          const rect = svg.getBoundingClientRect();
          const ux = (e.clientX - rect.left) / rect.width * geo.W;
          let bd = Infinity;
          pts.forEach((p, i) => { const d = Math.abs(p.cx - ux); if (d < bd) { bd = d; best = i; } });
        }
        const p = pts[best]; if (!p) return;
        if (snapEl) { snapEl.setAttribute('x1', p.cx); snapEl.setAttribute('x2', p.cx); snapEl.style.display = ''; }
        setColumn(best);
        if (tableHover) { hideTip(); active = -1; return; }
        if (best === active) { place(e); return; }
        active = best; show(render(p)); place(e);
        return;
      }
      // All other boards: unchanged element / nearest-datum behaviour plus the ARIA fix.
      if (live) readPayload();
      if (nearest) {
        const rect = svg.getBoundingClientRect(); if (!rect.width) return;
        const ux = (e.clientX - rect.left) / rect.width * geo.W;
        let best = 0, bd = Infinity;
        pts.forEach((p, i) => { const d = Math.abs(p.cx - ux); if (d < bd) { bd = d; best = i; } });
        const p = pts[best]; if (!p) return;
        if (snapEl) { snapEl.setAttribute('x1', p.cx); snapEl.setAttribute('x2', p.cx); snapEl.style.display = ''; }
        if (best === active) { place(e); return; }
        active = best; show(render(p)); place(e);
      } else {
        const el = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
        if (el) { if (el === activeEl) { place(e); return; } activeEl = el; show(el.getAttribute('data-tip')); place(e); }
        else { hide(); }
      }
    };
    // C1 delegates pointermove to the root so table cells are covered; other boards keep the SVG.
    const target = attachedTable ? root : (svg || root);
    target.addEventListener('pointermove', onMove);
    root.addEventListener('pointerdown', onMove);
    root.addEventListener('pointerleave', hide);
    root.addEventListener('blur', hide);
    root.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
    if (focusable) root.addEventListener('focus', () => {
      if (nearest) { const r = root.getBoundingClientRect(); onMove({ clientX: r.left + root.offsetWidth / 2, clientY: r.top + root.offsetHeight / 2, target: svg || root }); }
      else {
        // A KPI card carries `data-tip` on the root itself, not on a descendant, so the focus path
        // must fall back to the root or keyboard focus would open nothing.
        const el = root.querySelector('[data-tip]') || (root.hasAttribute('data-tip') ? root : null);
        activeEl = el; show(el ? el.getAttribute('data-tip') : null); place();
      }
    });
    for (let i = _chartTipBindings.length - 1; i >= 0; i--) if (!document.contains(_chartTipBindings[i].root)) _chartTipBindings.splice(i, 1);
    _chartTipBindings.push({ root, tip, hide });
  };
  // C1 — hover snap line + floating window (nearest-datum mode). I102: the body is the §4.6
  // swatch · label · value rows and the footer carries the owner's A+B summary; the chart-level
  // facts (real vs projected forecast, visible series) ride on data-c1meta.
  const scRoot = typeof root.querySelector === 'function' ? root.querySelector('.scurve') : null;
  if (scRoot) {
    let c1meta = {};
    try { c1meta = JSON.parse((scRoot.getAttribute('data-c1meta') || '{}').replace(/&#39;/g, "'")); } catch (_) {}
    // §4.2 rev 1.63 — attachedTable is opt-in and passed ONLY here. C2, C3, C4 and the KPI cards
    // keep the shared binder's original behaviour and the global §4.6 ARIA fix.
    bindChartHover(scRoot, { pointsAttr: 'data-points', geoAttr: 'data-geo', live: true, attachedTable: true, render: p => c1TipHtml(p, c1meta) });
  }
  // C2 — hover floating window. The Stacked view is nearest-datum over its own payload; the Delay
  // view (I103) is nearest-datum over data-points — element mode had left its window reachable only
  // on the 3 px dots, a dead zone everywhere else. The Funnel view is element mode (per-stage
  // data-tip, I104).
  const c2Root = typeof root.querySelector === 'function' ? root.querySelector('.c2-stack') : null;
  if (c2Root && c2Root.hasAttribute('data-points')) bindChartHover(c2Root, { render: c2DelayTipHtml });
  else if (c2Root) bindChartHover(c2Root, {
    pointsAttr: 'data-c2points', geoAttr: 'data-c2geo',
    render: p => `<b>${esc(p.label)}</b>` + p.series.map(s => `<div class="chart-tip-row"><span class="ct-l"><span class="chart-swatch" style="background:${c2Color(s.code)}"></span>${esc(s.code)}</span><b>${s.value}</b></div>`).join('') + `<div class="chart-tip-foot">Total <b>${p.total}</b></div>`
  });
  // C3 — hover floating window (element mode; per-segment data-tip)
  if (typeof root.querySelectorAll === 'function') root.querySelectorAll('.c3-card').forEach(c => bindChartHover(c, { snap: false }));
  // C4 — hover floating window (element mode; per-point data-tip on the scatter)
  const c4Root = typeof root.querySelector === 'function' ? root.querySelector('.c4-chart') : null;
  if (c4Root) bindChartHover(c4Root, { snap: false });
  // KPI cards — below-card floating window (Purpose / Data source / Calculation)
  if (typeof root.querySelectorAll === 'function') root.querySelectorAll('.kpi-card').forEach(c => bindChartHover(c, { placement: 'below', snap: false }));
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

/**
 * I107 — Build the Submittals CSV with dynamic per-submission column groups.
 * Base columns stay; then N groups of five columns (one per submission, ordered by
 * Submission Date), where N is the highest submission count among the exported documents.
 * When `subMonth` is set, only documents with a submission in that month are exported and
 * the history is limited to that month's submission(s).
 * @param {object} model @param {object} view @param {string} [subMonth='ALL']
 * @returns {{cols: string[], rows: string[][]}}
 */
export function buildSubmittalsCsv(model, view, subMonth = 'ALL') {
  const plannedById = new Map((model?.planned || []).map(p => [p.id, p]));
  const planOf = row => plannedById.get(row.linkedPlannedId);
  const titleFor = group => { const plan = planOf(group[0]); return plan?.title || group[0].fields['Document Title'] || ''; };
  const discFor = group => { const plan = planOf(group[0]); return plan?.discipline || group[0].discipline || 'Unknown'; };
  const monthOf = r => String(r.submissionDate || '').slice(0, 7);
  const docs = view.documents || [];
  const inMonth = g => subMonth === 'ALL' ? g : g.filter(r => monthOf(r) === subMonth);
  const sorted = g => [...inMonth(g)].sort((a, b) => (a.submissionDate || '').localeCompare(b.submissionDate || ''));
  const filtered = subMonth === 'ALL' ? docs : docs.filter(g => g.some(r => monthOf(r) === subMonth));
  const maxSubs = filtered.reduce((m, g) => Math.max(m, sorted(g).length), 0);
  const base = ['Document No.', 'Document Title', 'Discipline', 'Submissions', 'Current Submission Status', 'Current Approval Status'];
  const groupCols = [];
  for (let n = 1; n <= maxSubs; n++)
    groupCols.push(`Sub ${n} Prolog / Transmittal No.`, `Sub ${n} Submission Date`, `Sub ${n} Return Date`, `Sub ${n} Submission Status`, `Sub ${n} Approval Status`);
  const cols = [...base, ...groupCols];
  const rows = filtered.map(group => {
    const subs = sorted(group);
    const latest = subs[subs.length - 1];
    const cells = [group[0].documentNo || '', titleFor(group), discFor(group), String(subs.length), latest?.submissionStatus || '', latest?.approvalStatus || ''];
    for (let n = 0; n < maxSubs; n++) {
      const r = subs[n];
      if (r) cells.push(r.fields['Prolog No.'] || '', r.submissionDate || '', r.actualReturnDate || '', r.submissionStatus || '', r.approvalStatus || '');
      else cells.push('', '', '', '', '');
    }
    return cells;
  });
  return { cols, rows };
}

// I112 — CSV export for the Validation Issues table. Returns the full FILTERED set (respecting the
// error-code filter and the column chooser), not just the visible 200-row page, so an export always
// covers every row the operator filtered to.
export function buildIssueCsv() {
  if (!lastIssueExport) return '';
  const { headers, rows, columns } = lastIssueExport;
  const chosen = Array.isArray(columns) ? new Set(columns) : new Set(headers.map((_, i) => i));
  const indexes = headers.map((_, i) => i).filter(i => chosen.has(i));
  const q = v => { v = String(v ?? ''); return /[",\n\r]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v; };
  return '﻿' + [indexes.map(i => q(headers[i])), ...rows.map(r => indexes.map(i => q(r[i])))].map(r => r.join(',')).join('\r\n');
}
