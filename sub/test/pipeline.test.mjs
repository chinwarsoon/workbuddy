// Revision 0.4 | 2026-11-02 | CodeBuddy (AI) | Owner instruction: no test may assert a number remembered from an earlier run. The five workbook row-total assertions now read the actual files (rawPlannedRows / rawSubmissionRows / rawOrphanCount) and compare the model against them; the `formulaComparisons` count became a behaviour assertion. Added W-CODE-MISSING tests.
// Revision 0.3 | 2026-11-02 | CodeBuddy (AI) | Added regression tests for I026 (no MDL V-01), I027 / I028 (V-34 + W-MDL-LOG-MISMATCH), I029 (formula cells recorded and reported) and I030 (an approval code in Submission Status raises V-07).
// Revision 0.2 | 2026-10-24 | CodeBuddy (AI) | Added workbook identification tests (Code sheet Dashboard Title) and title-bar metadata tests.
// Revision 0.1 | 2026-10-24 | Codex | Added Wave 3 pipeline and source-contract tests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { readXlsx } from '../engine/xlsx-reader.js';
import { buildModel, PipelineError, inspectWorkbook, workbookKind, normalizeDate } from '../engine/pipeline.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/pipeline_contract.json'), 'utf8'));
const mdlBytes = fs.readFileSync(path.join(ROOT, 'TWRP C3B2 - Master Document List.xlsx'));
const logBytes = fs.readFileSync(path.join(ROOT, 'TWRP C3B2 - Document Submittal Log.xlsx'));
const asArrayBuffer = buffer => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
const actualMdl = await readXlsx(asArrayBuffer(mdlBytes));
const actualLog = await readXlsx(asArrayBuffer(logBytes));

const clone = value => structuredClone(value);
const findColumn = (workbook, sheetName, label) => {
  const header = workbook.sheets[sheetName].rows[1] || {};
  const match = Object.entries(header).find(([, value]) => String(value).trim().toLowerCase() === label.toLowerCase());
  assert.ok(match, `Header ${label} exists in ${sheetName}`);
  return match[0];
};
const findMdlFieldColumn = label => {
  const fieldRow = actualMdl.sheets.Code.rows.find(item => String(item?.A || '').trim() === label);
  assert.ok(fieldRow, `MDL Code sheet maps ${label}`);
  const match = /^Column-([A-Z]+)$/i.exec(String(fieldRow.B || '').trim());
  assert.ok(match, `MDL Code sheet maps ${label} to a column`);
  return match[1].toUpperCase();
};
// The workbooks grow, so a test must not assert a number remembered from an earlier run. These
// helpers count the same things straight from the raw cells of the actual files, without the
// pipeline: a planned row is one that carries a Document No., a Document Title or an SNo. (D33),
// and a log record is one that carries an SNo. or a Document No. The assertions then compare the
// model against the file, so the tests stay correct as the data grows.
const EXCEL_ERROR_TEXT = /^#(VALUE|REF|DIV\/0|N\/A|NUM|NULL|NAME\?|SPILL|CALC|GETTING_DATA)/i;
const cellText = (row, column) => (row && column ? String(row[column] ?? '').trim() : '');
const blankCell = (row, column) => cellText(row, column) === '';
const usableCell = (row, column) => !blankCell(row, column) && !EXCEL_ERROR_TEXT.test(cellText(row, column));
const linkKeyOf = value => String(value ?? '').trim().toUpperCase();
const mdlColumn = label => {
  const fieldRow = actualMdl.sheets.Code.rows.find(item => String(item?.A || '').trim() === label);
  const match = fieldRow ? /^Column-([A-Z]+)$/i.exec(String(fieldRow.B || '').trim()) : null;
  return match ? match[1].toUpperCase() : null;
};
const mdlHeaderRow = () => {
  const row = actualMdl.sheets.Code.rows.find(item => String(item?.A || '').trim() === 'Header Row');
  return Math.max(1, Number(String(row?.B ?? '').trim()) || 1);
};
const rawPlannedRows = () => {
  const doc = mdlColumn('Document No.');
  const title = mdlColumn('Document Title');
  const sno = mdlColumn('SNo.');
  const rows = [];
  for (const sheetName of config.mdl.requiredSheets) {
    const sheet = actualMdl.sheets[sheetName];
    if (!sheet) continue;
    for (let r = mdlHeaderRow() + 1; r <= (sheet.maxRow || 0); r++) {
      const row = sheet.rows[r];
      if (!row) continue;
      const documentNo = usableCell(row, doc) ? cellText(row, doc) : null;
      if (!documentNo && !usableCell(row, title) && !(sno && usableCell(row, sno))) continue;
      rows.push({ documentNo });
    }
  }
  return rows;
};
const rawSubmissionRows = () => {
  const sheet = actualLog.sheets.SubmittalLog;
  const columns = {
    sno: findColumn(actualLog, 'SubmittalLog', 'SNo.'),
    doc: findColumn(actualLog, 'SubmittalLog', 'Document No.'),
    submitted: findColumn(actualLog, 'SubmittalLog', 'Submission Date'),
    target: findColumn(actualLog, 'SubmittalLog', 'Target Return Date'),
    returned: findColumn(actualLog, 'SubmittalLog', 'Actual Return Date')
  };
  const dateOf = (row, column) => (usableCell(row, column) ? normalizeDate(row[column]) : null);
  const rows = [];
  for (let r = 2; r <= (sheet.maxRow || 0); r++) {
    const row = sheet.rows[r];
    if (!row) continue;
    if (blankCell(row, columns.sno) && blankCell(row, columns.doc)) continue;
    rows.push({
      row: r,
      documentNo: usableCell(row, columns.doc) ? cellText(row, columns.doc) : null,
      submissionDate: dateOf(row, columns.submitted),
      targetReturnDate: dateOf(row, columns.target),
      actualReturnDate: dateOf(row, columns.returned)
    });
  }
  return rows;
};
// A submission is an orphan when no planned row carries its document number (D32: trimmed and
// upper-cased). A submission with no document number is an orphan too, so the blank key is included.
const plannedKeys = () => new Set(rawPlannedRows().filter(row => row.documentNo).map(row => linkKeyOf(row.documentNo)));
const rawOrphanCount = () => {
  const keys = plannedKeys();
  return rawSubmissionRows().filter(row => !keys.has(linkKeyOf(row.documentNo))).length;
};
const model = buildModel(actualMdl, actualLog, { contract: config, today: '2026-10-24' });

test('parses and validates the current workbooks with current row totals', () => {
  const planned = rawPlannedRows();
  const submitted = rawSubmissionRows();
  assert.equal(model.planned.length, planned.length, 'every planned row in the file is parsed');
  assert.equal(model.planned.filter(record => record.documentNo).length, planned.filter(row => row.documentNo).length);
  assert.equal(model.planned.filter(record => !record.documentNo).length, planned.filter(row => !row.documentNo).length);
  assert.equal(model.submissions.length, submitted.length, 'every log record in the file is parsed');
  assert.equal(model.submissions.filter(record => record.submissionDate).length, submitted.filter(row => row.submissionDate).length);
  assert.equal(model.submissions.filter(record => record.actualReturnDate).length, submitted.filter(row => row.actualReturnDate).length);
  assert.equal(model.submissions.filter(record => record.submissionDate && !record.actualReturnDate).length, submitted.filter(row => row.submissionDate && !row.actualReturnDate).length);
  assert.ok(model.contract.statusDomains.submission.includes('SUR'));
  assert.ok(model.contract.statusDomains.approval.includes('APP'));
  assert.equal(model.coverage.plannedCount, model.planned.length);
  assert.ok(model.issues.some(issue => issue.code === 'V-26' && issue.severity.toLowerCase() === 'error'));
  assert.ok(model.stages.length >= 6 && model.stages.every(stage => stage.status === 'complete'));
});

test('keeps duplicate MDL rows separate and marks links as ambiguous', () => {
  const planned = rawPlannedRows();
  const tally = new Map();
  for (const row of planned) {
    if (!row.documentNo) continue;
    tally.set(row.documentNo, (tally.get(row.documentNo) || 0) + 1);
  }
  assert.equal(model.coverage.duplicateDocumentNumberCount, [...tally].filter(([, count]) => count > 1).length);
  assert.equal(model.coverage.ambiguousPlannedCount, planned.filter(row => row.documentNo && tally.get(row.documentNo) > 1).length);
  assert.ok(model.submissions.some(record => record.linkStatus === 'ambiguous' && record.linkedPlannedId === null));
  assert.ok(model.issues.filter(issue => issue.code === 'V-26').every(issue => issue.severity.toLowerCase() === 'error'));
});

test('allows several submissions for one unique planned document and identifies orphans', () => {
  const grouped = new Map();
  for (const record of model.submissions.filter(item => item.linkStatus === 'matched')) {
    const group = grouped.get(record.linkedPlannedId) || [];
    group.push(record);
    grouped.set(record.linkedPlannedId, group);
  }
  assert.ok([...grouped.values()].some(records => records.length > 1));
  assert.equal(model.coverage.orphanCount, rawOrphanCount());
  assert.equal(model.issues.filter(issue => issue.code === 'V-29').length, rawOrphanCount());
});

test('derives submission discipline from the MDL join, not the log section title (T15.1)', () => {
  const plannedById = new Map(model.planned.map(record => [record.id, record]));
  for (const record of model.submissions) {
    if (record.linkStatus === 'matched') {
      const plan = plannedById.get(record.linkedPlannedId);
      assert.ok(plan, `matched submission row ${record.row} links to a plan`);
      assert.equal(record.discipline, plan.discipline, `submission row ${record.row} discipline matches its MDL plan, not the log section`);
    } else if (record.linkStatus === 'orphan') {
      assert.equal(record.discipline, 'Unknown', `orphan submission row ${record.row} is Unknown`);
    }
  }
  assert.ok(model.submissions.some(record => record.linkStatus === 'matched' && record.discipline !== ''));
});

test('calculates open delay as zero through target date and keeps early-return delay negative', () => {
  assert.ok(model.submissions.some(record => !record.actualReturnDate && record.targetReturnDate >= model.meta.asOfDate && record.delayDays === 0));
  assert.ok(model.submissions.some(record => !record.actualReturnDate && record.targetReturnDate < model.meta.asOfDate && record.delayDays > 0));
  assert.ok(model.submissions.some(record => record.actualReturnDate && record.delayDays < 0));
  // The number of comparisons is data, and so is the number of rows where the recalculated value
  // differs from the cached one — the workbook grew without a recalculation (I029). What must hold
  // is that the model and the banner warning agree, and that the warning counts the differing rows.
  assert.ok(model.formulaComparisons.length > 0, 'returned rows carry a cached value to compare');
  const delayDifferences = model.formulaComparisons.filter(item => item.field === 'Review Delay Days' && item.difference !== 0).length;
  const compare = model.warnings.find(item => item.code === 'W-FORMULA-COMPARE');
  assert.equal(Boolean(compare), delayDifferences > 0, 'the warning appears only when a delay differs');
  if (compare) assert.equal(compare.count, delayDifferences, 'the warning counts the differing rows');
});

test('rejects missing or repeated required Submittal Log headers', () => {
  const missing = clone(actualLog);
  delete missing.sheets.SubmittalLog.rows[1][findColumn(missing, 'SubmittalLog', 'Document No.')];
  assert.throws(() => buildModel(actualMdl, missing, { contract: config }), PipelineError);
  const repeated = clone(actualLog);
  repeated.sheets.SubmittalLog.rows[1].ZZ = 'Document No.';
  assert.throws(() => buildModel(actualMdl, repeated, { contract: config }), /repeats the required header/);
  const normalized = clone(actualLog);
  normalized.sheets.SubmittalLog.rows[1][findColumn(normalized, 'SubmittalLog', 'Document No.')] = '  DOCUMENT NO.  ';
  assert.doesNotThrow(() => buildModel(actualMdl, normalized, { contract: config, today: '2026-10-24' }));
});

test('normalizes an open record that is past its target date to positive overdue days', () => {
  const open = model.submissions.find(record => !record.actualReturnDate && record.delayDays > 0);
  assert.ok(open);
  assert.equal(open.delayDays, Math.max(Math.round((Date.parse(`${model.meta.asOfDate}T00:00:00Z`) - Date.parse(`${open.targetReturnDate}T00:00:00Z`)) / 86400000), 0));
});

test('flags orphan, timeline, and status conflicts from workbook rules', () => {
  assert.equal(model.issues.filter(issue => issue.code === 'V-29').length, rawOrphanCount());
  // V-30 fires once for a Target Return Date and once for an Actual Return Date that falls before
  // the Submission Date, so the expected count comes from the file, not from memory.
  const earlier = (date, base) => Boolean(date && base && date < base);
  const expectedTimeline = rawSubmissionRows().reduce((sum, row) => sum
    + (earlier(row.targetReturnDate, row.submissionDate) ? 1 : 0)
    + (earlier(row.actualReturnDate, row.submissionDate) ? 1 : 0), 0);
  assert.equal(model.issues.filter(issue => issue.code === 'V-30').length, expectedTimeline);
  const conflict = clone(actualLog);
  const submissionStatusColumn = findColumn(conflict, 'SubmittalLog', 'Submission Status');
  const approvalStatusColumn = findColumn(conflict, 'SubmittalLog', 'Approval Status');
  const record = model.submissions.find(item => item.linkStatus === 'matched');
  conflict.sheets.SubmittalLog.rows[record.row][submissionStatusColumn] = 'NFS';
  conflict.sheets.SubmittalLog.rows[record.row][approvalStatusColumn] = 'APP';
  const changed = buildModel(actualMdl, conflict, { contract: config, today: '2026-10-24' });
  assert.ok(changed.issues.some(issue => issue.code === 'V-31' && issue.row === record.row));
  const resubmission = clone(actualLog);
  const resubmissionColumn = findColumn(resubmission, 'SubmittalLog', 'Resubmission Required');
  const noResubmission = model.submissions.find(item => item.submissionStatus === 'NTS');
  resubmission.sheets.SubmittalLog.rows[noResubmission.row][resubmissionColumn] = 'YES';
  const changedResubmission = buildModel(actualMdl, resubmission, { contract: config, today: '2026-10-24' });
  assert.ok(changedResubmission.issues.some(issue => issue.code === 'V-31' && issue.row === noResubmission.row));
});

test('turns formula-error cells into absent values and adds a fatal field warning', () => {
  const changed = clone(actualLog);
  const delayColumn = findColumn(changed, 'SubmittalLog', 'Review Delay Days');
  const returned = model.submissions.find(item => item.actualReturnDate);
  changed.sheets.SubmittalLog.rows[returned.row][delayColumn] = '#DIV/0!';
  const result = buildModel(actualMdl, changed, { contract: config, today: '2026-10-24' });
  assert.ok(result.warnings.some(item => item.code === 'W-FORMULA' && item.field === 'Review Delay Days' && item.count === 1 && item.severity === 'Fatal'));
  assert.equal(Object.hasOwn(result.submissions.find(item => item.row === returned.row).fields, 'Review Delay Days'), false);
});

test('fails cleanly when a required MDL discipline sheet is missing', () => {
  const changed = clone(actualMdl);
  delete changed.sheets[config.mdl.requiredSheets[0]];
  assert.throws(() => buildModel(changed, actualLog, { contract: config }), error => error instanceof PipelineError && /missing required discipline sheet/.test(error.message) && error.details.stage === 'S2 Read MDL source contract');
});

test('applies Code-sheet validation rules to missing fields, placeholders, and future dates', () => {
  const changed = clone(actualLog);
  const target = model.submissions.find(item => item.linkStatus === 'matched');
  const row = changed.sheets.SubmittalLog.rows[target.row];
  row[findColumn(changed, 'SubmittalLog', 'Document No.')] = `xxxx-${target.documentNo}`;
  row[findColumn(changed, 'SubmittalLog', 'Prolog No.')] = undefined;
  row[findColumn(changed, 'SubmittalLog', 'Submission Date')] = '2026-10-25';
  row[findColumn(changed, 'SubmittalLog', 'Review Period')] = undefined;
  row[findColumn(changed, 'SubmittalLog', 'Submission Status')] = 'RTR';
  row[findColumn(changed, 'SubmittalLog', 'Approval Status')] = undefined;
  const result = buildModel(actualMdl, changed, { contract: config, today: '2026-10-24' });
  for (const code of ['V-15', 'V-16', 'V-18', 'V-23', 'V-25']) {
    assert.ok(result.issues.some(issue => issue.code === code && issue.row === target.row), `expected ${code} on row ${target.row}`);
  }
});

test('checks approval date requirements and missing approval status', () => {
  const approvalMissingDate = clone(actualLog);
  const approved = model.submissions.find(item => item.approvalStatus === 'APP' && item.actualReturnDate);
  approvalMissingDate.sheets.SubmittalLog.rows[approved.row][findColumn(approvalMissingDate, 'SubmittalLog', 'Actual Return Date')] = undefined;
  const missingDateModel = buildModel(actualMdl, approvalMissingDate, { contract: config, today: '2026-10-24' });
  assert.ok(missingDateModel.issues.some(issue => issue.code === 'V-11' && issue.row === approved.row));
  assert.ok(missingDateModel.issues.some(issue => issue.code === 'V-20' && issue.row === approved.row));

  const noApprovalStatus = clone(actualLog);
  const returned = model.submissions.find(item => item.actualReturnDate);
  noApprovalStatus.sheets.SubmittalLog.rows[returned.row][findColumn(noApprovalStatus, 'SubmittalLog', 'Approval Status')] = undefined;
  const missingStatusModel = buildModel(actualMdl, noApprovalStatus, { contract: config, today: '2026-10-24' });
  assert.ok(missingStatusModel.issues.some(issue => issue.code === 'V-21' && issue.row === returned.row));
});

test('applies MDL placeholder and required-field checks to planned rows', () => {
  const changed = clone(actualMdl);
  const target = model.planned.find(record => record.documentNo);
  const sourceRow = changed.sheets[target.sheet].rows[target.row];
  sourceRow[findMdlFieldColumn('Document No.')] = `xxxx-${target.documentNo}`;
  sourceRow[findMdlFieldColumn('Document Title')] = undefined;
  const result = buildModel(changed, actualLog, { contract: config, today: '2026-10-24' });
  assert.ok(result.issues.some(issue => issue.code === 'V-15' && issue.row === target.row && issue.sheet === target.sheet));
  assert.ok(result.issues.some(issue => issue.code === 'V-25' && issue.row === target.row && issue.sheet === target.sheet));
});

test('identifies each workbook from the Dashboard Title in its Code sheet', async () => {
  const mdlCode = await readXlsx(asArrayBuffer(mdlBytes), { only: [config.mdl.codeSheet] });
  const logCode = await readXlsx(asArrayBuffer(logBytes), { only: [config.submittalLog.codeSheet] });
  assert.deepEqual(Object.keys(mdlCode.sheets), [config.mdl.codeSheet]);
  const mdlInfo = inspectWorkbook(mdlCode, config);
  const logInfo = inspectWorkbook(logCode, config);
  assert.equal(mdlInfo.ok, true);
  assert.equal(mdlInfo.kind, 'mdl');
  assert.equal(mdlInfo.dashboardTitle, 'Master Document List');
  assert.equal(mdlInfo.projectTitle, 'TWRP C3B2');
  assert.equal(logInfo.ok, true);
  assert.equal(logInfo.kind, 'log');
  assert.equal(logInfo.dashboardTitle, 'Document Submittal Log');
  assert.equal(logInfo.projectTitle, 'TWRP C3B2');
});

test('rejects a file that is not a project workbook', () => {
  const noCodeSheet = inspectWorkbook({ sheets: {} }, config);
  assert.equal(noCodeSheet.ok, false);
  assert.match(noCodeSheet.reason, /no "Code" sheet/);
  const noMetadata = inspectWorkbook({ sheets: { Code: { rows: [], maxRow: 0 } } }, config);
  assert.equal(noMetadata.ok, false);
  const wrongType = inspectWorkbook({
    sheets: {
      Code: {
        rows: [undefined, { A: 'Project Metadata Title', B: 'Project Metadata Values', C: 'Project Metadata Data Type' }, { A: 'Dashboard Title', B: 'Some Other Report' }],
        maxRow: 2
      }
    }
  }, config);
  assert.equal(wrongType.ok, false);
  assert.match(wrongType.reason, /Some Other Report/);
});

test('matches the dashboard title case-insensitively', () => {
  assert.equal(workbookKind('master document list', config), 'mdl');
  assert.equal(workbookKind('DOCUMENT SUBMITTAL LOG', config), 'log');
  assert.equal(workbookKind('Anything Else', config), null);
  assert.equal(workbookKind('', config), null);
});

test('exposes the title-bar metadata on the model', () => {
  assert.equal(model.meta.projectTitle, 'TWRP C3B2');
  assert.equal(model.meta.dashboardTitle, 'Master Document List · Document Submittal Log');
  assert.equal(model.meta.projectStartDate, '2026-03-15');
  assert.equal(model.meta.asOfDate, '2026-10-24');
});

// I026 — a blank MDL Document No. belongs to MDL (decision D33). The sub dashboard keeps the
// Submittal Log V-01, because a log row without a document number is a sub defect.
test('I026 — the MDL no longer raises V-01 for a blank Document No.', () => {
  const mdlBlank = model.issues.filter(issue => issue.code === 'V-01' && issue.sheet !== 'SubmittalLog');
  assert.equal(mdlBlank.length, 0, 'no V-01 from a Master Document List sheet');
  // The count is data, not behaviour: the workbook grows, so assert that the rows survive instead
  // of asserting a number that went stale (86 → 98 after the 2026-10-26 workbook update).
  assert.ok(model.planned.filter(row => !row.documentNo).length > 0, 'rows with a blank Document No. are still parsed and counted');
});

// I027 / I028 — the MDL marks a document as submitted when its Actual 1st Issue Date is present.
// When the Submittal Log holds no row for that document, the two files disagree: V-34 per row and
// one aggregated W-MDL-LOG-MISMATCH warning for the banner.
test('I027 — issued in the master list with no log row raises V-34 and a mismatch warning', t => {
  let column;
  try {
    column = findMdlFieldColumn('Actual 1st Issue Date');
  } catch {
    t.skip('the MDL Code sheet does not map "Actual 1st Issue Date", so V-34 stays silent by design');
    return;
  }
  const logged = new Set(model.submissions.map(row => String(row.documentNo || '').trim().toUpperCase()));
  const target = model.planned.find(row => row.documentNo && !logged.has(row.documentNo.trim().toUpperCase()) && !row.fields['Actual 1st Issue Date']);
  assert.ok(target, 'a planned document with no log row exists');
  const changed = clone(actualMdl);
  const sheet = changed.sheets[target.sheet];
  if (!sheet.rows[target.row]) sheet.rows[target.row] = {};
  sheet.rows[target.row][column] = '2026-01-15';
  const result = buildModel(changed, actualLog, { contract: config, today: '2026-10-24' });
  assert.ok(result.issues.some(issue => issue.code === 'V-34' && issue.documentNo === target.documentNo && issue.row === target.row), 'V-34 names the document, the sheet and the row');
  assert.ok(result.warnings.some(item => item.code === 'W-MDL-LOG-MISMATCH' && item.count >= 1), 'one aggregated warning reaches the banner');
  // A document that IS in the log must not raise V-34.
  const linked = model.submissions.find(row => row.documentNo);
  assert.equal(result.issues.some(issue => issue.code === 'V-34' && issue.documentNo === linked.documentNo), false, 'a logged document is not a mismatch');
});

// I029 — a formula cell is read from the workbook cache. The reader records the reference, the
// Validation list marks the value, and one warning per source and field reports the count.
test('I029 — formula cells are recorded and reported as cached values', () => {
  assert.ok(actualLog.sheets.SubmittalLog.formulaRefs instanceof Set, 'each sheet exposes its formula references');
  const anyCached = [...model.planned, ...model.submissions].some(record => record.cachedFields);
  const cachedWarnings = model.warnings.filter(item => item.code === 'W-CACHED-VALUE');
  assert.equal(cachedWarnings.length > 0, anyCached, 'a cached-value warning appears only when the workbook carries formula cells');
  for (const item of cachedWarnings) {
    assert.ok(item.source && item.field && item.count > 0, 'the warning names the source, the field and the count');
  }
});

// Owner instruction (2026-11-02): the Code sheet belongs to the owner, so the dashboard must report
// every code it raises that the sheet does not define. W-CODE-MISSING is that report.
test('W-CODE-MISSING — a validation code with no Code-sheet row is reported to the owner', () => {
  const codeColumnOf = workbook => {
    const header = workbook.sheets.Code.rows[1] || {};
    const match = Object.entries(header).find(([, value]) => String(value).trim() === 'Error Code');
    assert.ok(match, 'the Code sheet carries an "Error Code" header');
    return match[0];
  };
  const renameCode = (workbook, from, to) => {
    const column = codeColumnOf(workbook);
    const sheet = workbook.sheets.Code;
    for (let r = 2; r <= (sheet.maxRow || 0); r++) {
      if (String(sheet.rows[r]?.[column] ?? '').trim() === from) { sheet.rows[r][column] = to; return true; }
    }
    return false;
  };
  // Baseline: with the current workbooks, every code the dashboard raises is defined.
  const used = [...new Set(model.issues.map(issue => issue.code))].sort();
  const notDefined = used.filter(code => !model.contract.errorRules.some(rule => rule.code === code));
  const missing = model.warnings.find(item => item.code === 'W-CODE-MISSING');
  assert.equal(Boolean(missing), notDefined.length > 0, 'the warning appears only when a code has no row');
  if (missing) for (const code of notDefined) assert.match(missing.message, new RegExp(code), `${code} is named in the warning`);

  // Mutation: take a code that IS used out of both Code sheets and confirm the owner is told to add
  // it back. Both workbooks carry an error block (Master Document List columns AI–AL, Submittal Log
  // columns K–N), and the dashboard merges them, so a code is undefined only when neither has it.
  const mdlChanged = clone(actualMdl);
  const logChanged = clone(actualLog);
  assert.ok(renameCode(mdlChanged, 'V-29', 'V-99') && renameCode(logChanged, 'V-29', 'V-99'), 'V-29 has a row in both Code sheets');
  const result = buildModel(mdlChanged, logChanged, { contract: config, today: '2026-10-24' });
  const reported = result.warnings.find(item => item.code === 'W-CODE-MISSING');
  assert.ok(reported, 'a code with no row raises W-CODE-MISSING');
  assert.match(reported.message, /V-29/, 'the warning names the code to add');
});

// Owner instruction (2026-11-02, I099): a submission with no recorded outcome is a data-quality
// defect and must be raised. V-35 fires once per document, on the row the donut reads.
test('V-35 — a submission with no recorded outcome is raised', () => {
  const outcomeCodes = new Set([...model.contract.statusDomains.approval].map(entry => (Array.isArray(entry) ? entry[0] : entry)));
  const byDoc = new Map();
  for (const record of model.submissions) {
    const key = String(record.documentNo || '').trim().toUpperCase();
    if (!key) continue;
    const group = byDoc.get(key) || [];
    group.push(record);
    byDoc.set(key, group);
  }
  // Mirror the rule from the file: latest row by Submission Date, then not open under review, then no
  // approval code anywhere in the document.
  const expected = [];
  for (const group of byDoc.values()) {
    const sorted = [...group].sort((a, b) => (a.submissionDate || '9999-12-31').localeCompare(b.submissionDate || '9999-12-31') || a.row - b.row);
    const latest = sorted[sorted.length - 1];
    if (latest.submissionStatus === 'SUR' && !latest.actualReturnDate) continue;
    if (sorted.some(record => outcomeCodes.has(record.approvalStatus))) continue;
    expected.push(latest.row);
  }
  const raised = model.issues.filter(issue => issue.code === 'V-35').map(issue => issue.row);
  assert.deepEqual([...raised].sort((a, b) => a - b), [...expected].sort((a, b) => a - b), 'one V-35 per document with no outcome');
  for (const issue of model.issues.filter(item => item.code === 'V-35')) {
    assert.equal(issue.field, 'Approval Status', 'the issue names the empty column');
    assert.ok(issue.sheet && issue.row, 'the issue names the sheet and the row');
  }
  // Mutation: clear the Approval Status of a document that has one and only one row.
  const solo = [...byDoc.values()].find(group => group.length === 1 && outcomeCodes.has(group[0].approvalStatus));
  assert.ok(solo, 'a one-row document with an approval status exists');
  const changed = clone(actualLog);
  changed.sheets.SubmittalLog.rows[solo[0].row][findColumn(changed, 'SubmittalLog', 'Approval Status')] = '';
  const result = buildModel(actualMdl, changed, { contract: config, today: '2026-10-24' });
  assert.ok(result.issues.some(issue => issue.code === 'V-35' && issue.row === solo[0].row), 'clearing the outcome raises V-35 on that row');
});

// I030 — the Submittal Log Code sheet defines the submission-status codes. An approval code typed
// into Submission Status is not in that domain, so V-07 flags it.
test('I030 — an approval code in Submission Status is flagged (V-07)', () => {
  const changed = clone(actualLog);
  const statusColumn = findColumn(changed, 'SubmittalLog', 'Submission Status');
  const target = model.submissions.find(record => record.row && record.submissionStatus);
  assert.ok(target, 'a submission row with a status exists');
  changed.sheets.SubmittalLog.rows[target.row][statusColumn] = 'APP';
  const result = buildModel(actualMdl, changed, { contract: config, today: '2026-10-24' });
  assert.ok(result.issues.some(issue => issue.code === 'V-07' && issue.row === target.row && String(issue.value).includes('APP')), 'V-07 names the offending value');
});

test('links a document number that differs only by case to its planned row', () => {
  const planKeys = new Set(model.planned.map(row => String(row.documentNo || '').trim().toUpperCase()).filter(Boolean));
  const falseOrphans = model.submissions.filter(row => row.linkStatus === 'orphan' && planKeys.has(String(row.documentNo || '').trim().toUpperCase()));
  assert.deepEqual(falseOrphans.map(row => row.documentNo), []);
});
