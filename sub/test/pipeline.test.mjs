// Revision 0.2 | 2026-10-24 | CodeBuddy (AI) | Added workbook identification tests (Code sheet Dashboard Title) and title-bar metadata tests.
// Revision 0.1 | 2026-10-24 | Codex | Added Wave 3 pipeline and source-contract tests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { readXlsx } from '../engine/xlsx-reader.js';
import { buildModel, PipelineError, inspectWorkbook, workbookKind } from '../engine/pipeline.js';

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
const model = buildModel(actualMdl, actualLog, { contract: config, today: '2026-10-24' });

test('parses and validates the current workbooks with current row totals', () => {
  assert.equal(model.planned.length, 7717);
  assert.equal(model.planned.filter(record => record.documentNo).length, 7631);
  assert.equal(model.planned.filter(record => !record.documentNo).length, 86);
  assert.equal(model.submissions.length, 183);
  assert.equal(model.submissions.filter(record => record.submissionDate).length, 183);
  assert.equal(model.submissions.filter(record => record.actualReturnDate).length, 129);
  assert.equal(model.submissions.filter(record => record.submissionDate && !record.actualReturnDate).length, 54);
  assert.ok(model.contract.statusDomains.submission.includes('SUR'));
  assert.ok(model.contract.statusDomains.approval.includes('APP'));
  assert.equal(model.coverage.plannedCount, model.planned.length);
  assert.ok(model.issues.some(issue => issue.code === 'V-26' && issue.severity.toLowerCase() === 'error'));
  assert.ok(model.stages.length >= 6 && model.stages.every(stage => stage.status === 'complete'));
});

test('keeps duplicate MDL rows separate and marks links as ambiguous', () => {
  assert.equal(model.coverage.duplicateDocumentNumberCount, 232);
  assert.equal(model.coverage.ambiguousPlannedCount, 7353);
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
  assert.equal(model.coverage.orphanCount, 16);
  assert.equal(model.issues.filter(issue => issue.code === 'V-29').length, 16);
});

test('calculates open delay as zero through target date and keeps early-return delay negative', () => {
  assert.ok(model.submissions.some(record => !record.actualReturnDate && record.targetReturnDate >= model.meta.asOfDate && record.delayDays === 0));
  assert.ok(model.submissions.some(record => !record.actualReturnDate && record.targetReturnDate < model.meta.asOfDate && record.delayDays > 0));
  assert.ok(model.submissions.some(record => record.actualReturnDate && record.delayDays < 0));
  assert.equal(model.formulaComparisons.length, 258);
  assert.equal(model.formulaComparisons.filter(item => item.difference !== 0).length, 0);
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
  assert.equal(model.issues.filter(issue => issue.code === 'V-29').length, 16);
  assert.equal(model.issues.filter(issue => issue.code === 'V-30').length, 1);
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

test('links a document number that differs only by case to its planned row', () => {
  const planKeys = new Set(model.planned.map(row => String(row.documentNo || '').trim().toUpperCase()).filter(Boolean));
  const falseOrphans = model.submissions.filter(row => row.linkStatus === 'orphan' && planKeys.has(String(row.documentNo || '').trim().toUpperCase()));
  assert.deepEqual(falseOrphans.map(row => row.documentNo), []);
});
