// throwaway: count the planned-row variants behind the "total planned" definitions (review only)
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const sub = 'C:/Users/qinghua.song/DSAI/workbuddy/sub/';
const { readXlsx } = await import(pathToFileURL(`${sub}engine/xlsx-reader.js`).href);
const { buildModel } = await import(pathToFileURL(`${sub}engine/pipeline.js`).href);

const readWb = async file => {
  const buf = readFileSync(file);
  return readXlsx(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const wb = await readWb(`${sub}TWRP C3B2 - Master Document List.xlsx`);
const log = await readWb(`${sub}TWRP C3B2 - Document Submittal Log.xlsx`);
const contract = JSON.parse(readFileSync(`${sub}config/pipeline_contract.json`, 'utf8'));
const model = buildModel(wb, log, {
  contract,
  workbookName: 'MDL.xlsx',
  mdlWorkbookName: 'MDL.xlsx',
  logWorkbookName: 'LOG.xlsx',
});

const EXCLUDED = new Set(['Deleted', 'Void', 'Superseded']);
const asOf = String(model.meta?.asOfDate || '');
const asOfYm = asOf.slice(0, 7);
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value);
const planDate = row => row.fields['Planned 1st Issue Date'];
const forecastDate = row => row.fields['Forecast 1st Issue Date'];

const rows = model.planned;
const withDoc = rows.filter(row => row.documentNo);
const activeStage = row => !EXCLUDED.has(row.stage ?? '');
const base = withDoc.filter(activeStage);
const dated = base.filter(row => validDate(planDate(row)));
const datedAsOf = dated.filter(row => String(planDate(row)).slice(0, 7) <= asOfYm);
const nonBlankStage = base.filter(row => String(row.stage ?? '') !== '');
const nonBlankStageDated = nonBlankStage.filter(row => validDate(planDate(row)));

const months = [...new Set(dated.map(row => String(planDate(row)).slice(0, 7)))].sort();
const afterAsOf = months.filter(month => month > asOfYm);

const tally = list => list.reduce((map, row) => {
  const key = String(row.stage ?? '(blank)');
  map[key] = (map[key] || 0) + 1;
  return map;
}, {});

const issueTally = (model.issues || []).reduce((map, issue) => {
  map[issue.code] = (map[issue.code] || 0) + 1;
  return map;
}, {});

console.log(JSON.stringify({
  submissions: (model.submissions || []).length,
  distinctDocuments: new Set((model.submissions || []).map(row => String(row.documentNo || '').trim().toUpperCase())).size,
  issueTally,
  asOf,
  asOfYm,
  workbookRows: rows.length,
  withDocumentNo: withDoc.length,
  quoteNotExcludedStage: base.length,
  blankStageRows: base.length - nonBlankStage.length,
  nonBlankStageWithDoc: nonBlankStage.length,
  datedAllMonths: dated.length,
  datedUpToAsOf: datedAsOf.length,
  afterAsOfRows: dated.length - datedAsOf.length,
  harnessGroundTruth_7_513: nonBlankStage.length,
  harnessGroundTruth_dated: nonBlankStageDated.length,
  firstMonth: months[0],
  lastMonth: months[months.length - 1],
  monthsAfterAsOf: afterAsOf.length,
  blankPlanDate: base.length - dated.length,
  blankStageDated: base.filter(row => String(row.stage ?? '') === '' && validDate(planDate(row))).length,
  blankStageUndated: base.filter(row => String(row.stage ?? '') === '' && !validDate(planDate(row))).length,
  blankStageDatedUpToAsOf: datedAsOf.filter(row => String(row.stage ?? '') === '').length,
  blankPlanDateSample: base.filter(row => !validDate(planDate(row))).slice(0, 5).map(row => ({
    documentNo: row.documentNo,
    stage: row.stage ?? '(blank)',
    discipline: row.discipline,
    planned: planDate(row) ?? null,
    forecast: forecastDate(row) ?? null,
  })),
  stageTallyBlankRows: Object.entries(tally(base.filter(row => String(row.stage ?? '') === ''))).slice(0, 6),
  stageTallyAll: Object.fromEntries(Object.entries(tally(base)).sort((a, b) => b[1] - a[1]).slice(0, 8)),
}, null, 1));
