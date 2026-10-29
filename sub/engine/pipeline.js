// Revision 0.1 | 2026-10-24 | Codex | Added the Sub dashboard S2/S3 pipeline.
// Source fields and required columns are defined in config/pipeline_contract.json.

const ERROR_TOKENS = new Set([
  '#NULL!', '#DIV/0!', '#VALUE!', '#REF!', '#NAME?', '#N/A', '#NUM!',
  '#GETTING_DATA', '#SPILL!', '#CALC!'
]);

/** Check whether a cell contains an Excel formula-error token. @param {*} value @returns {boolean} */
export function isExcelError(value) {
  return typeof value === 'string' && ERROR_TOKENS.has(value.trim().toUpperCase());
}

export class PipelineError extends Error {
  /** Create a structural pipeline error with source details. @param {string} message @param {object} details @returns {PipelineError} */
  constructor(message, details = {}) {
    super(message);
    this.name = 'PipelineError';
    this.fatal = true;
    this.details = details;
  }
}

/** Run a pipeline stage and save its result or failure. @param {Array} stages @param {string} name @param {Function} action @returns {*} */
function runStage(stages, name, action) {
  try {
    const result = action();
    stages.push({ name, status: 'complete' });
    return result;
  } catch (error) {
    stages.push({ name, status: 'error', message: error.message });
    if (error instanceof PipelineError) {
      error.details = { ...error.details, stage: name };
      throw error;
    }
    throw new PipelineError(`${name} failed: ${error.message}`, { stage: name, cause: error.name });
  }
}

/** Normalize a label for case-insensitive header matching. @param {*} value @returns {string} */
const normalizeLabel = value => String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
/** Trim a text cell and preserve non-text values. @param {*} value @returns {*} */
const cleanText = value => typeof value === 'string' ? value.trim() : value;
/** Check whether a source cell has no value. @param {*} value @returns {boolean} */
const isBlank = value => value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
/** Convert a zero-based column index to an Excel column name. @param {number} index @returns {string} */
const columnName = index => {
  let n = index + 1, name = '';
  while (n > 0) { const rem = (n - 1) % 26; name = String.fromCharCode(65 + rem) + name; n = Math.floor((n - 1) / 26); }
  return name;
};
/** Convert an Excel column name to a zero-based index. @param {string} name @returns {number} */
const columnIndex = name => {
  let n = 0;
  for (const ch of String(name).toUpperCase()) n = n * 26 + ch.charCodeAt(0) - 64;
  return n - 1;
};

/** Check that a workbook reader result has a sheet map. @param {object} workbook @param {string} sourceName @returns {void} */
function assertWorkbook(workbook, sourceName) {
  if (!workbook || typeof workbook !== 'object' || !workbook.sheets) {
    throw new PipelineError(`${sourceName} is not a parsed workbook.`, { source: sourceName });
  }
}

/** Read a cell by its zero-based column index. @param {object} row @param {number} index @returns {*} */
function cellAt(row, index) {
  return row?.[columnName(index)];
}

/** Normalize one worksheet header row and retain duplicate labels. @param {object} sheet @param {number} rowNumber @param {string} sourceName @returns {Map} */
function readHeaderRow(sheet, rowNumber, sourceName) {
  const row = sheet?.rows?.[rowNumber];
  if (!row) throw new PipelineError(`${sourceName} has no header row ${rowNumber}.`, { source: sourceName, row: rowNumber });
  const headers = new Map();
  for (const [column, raw] of Object.entries(row)) {
    const label = normalizeLabel(raw);
    if (!label) continue;
    const index = columnIndex(column);
    const found = headers.get(label) || [];
    found.push({ label: String(raw).trim(), column, index });
    headers.set(label, found);
  }
  return headers;
}

/** Resolve one required or optional column label. @param {Map} headers @param {string} label @param {object} options @returns {object|null} */
function headerColumn(headers, label, { required = true, sourceName = 'workbook' } = {}) {
  const found = headers.get(normalizeLabel(label)) || [];
  if (found.length > 1) throw new PipelineError(`${sourceName} repeats the required header “${label}”.`, { source: sourceName, header: label, columns: found.map(x => x.column) });
  if (!found.length) {
    if (required) throw new PipelineError(`${sourceName} is missing the required header “${label}”.`, { source: sourceName, header: label });
    return null;
  }
  return found[0];
}

/** Find a table by its column labels. @param {object} sheet @param {string[]} candidates @param {string} sourceName @param {number} maxRows @returns {object} */
function findTableHeader(sheet, candidates, sourceName, maxRows = 10) {
  for (let rowNumber = 1; rowNumber <= Math.min(sheet.maxRow || 0, maxRows); rowNumber++) {
    const headers = readHeaderRow(sheet, rowNumber, sourceName);
    if (candidates.every(label => headers.has(normalizeLabel(label)))) return { rowNumber, headers };
  }
  throw new PipelineError(`${sourceName} does not contain the required table headers: ${candidates.join(', ')}.`, { source: sourceName, headers: candidates });
}

/** Read a code-to-description table from the workbook Code sheet. @param {object} codeSheet @param {string} codeHeader @param {string} labelHeader @param {string} sourceName @returns {Map} */
function readCodeTable(codeSheet, codeHeader, labelHeader, sourceName) {
  const { rowNumber: headerRow, headers } = findTableHeader(codeSheet, [codeHeader, labelHeader], sourceName);
  const codeColumn = headerColumn(headers, codeHeader, { sourceName });
  const labelColumn = headerColumn(headers, labelHeader, { sourceName });
  const values = new Map();
  const end = codeSheet.maxRow || codeSheet.rows.length - 1;
  for (let rowNumber = headerRow + 1; rowNumber <= end; rowNumber++) {
    const row = codeSheet.rows[rowNumber];
    if (!row) continue;
    const code = cleanText(cellAt(row, codeColumn.index));
    const label = cleanText(cellAt(row, labelColumn.index));
    if (isBlank(code)) continue;
    values.set(String(code).trim(), String(label ?? '').trim());
  }
  return values;
}

/** Read validation messages, severity, and group from a Code sheet. @param {object} codeSheet @param {string} sourceName @returns {Map} */
function readErrorCatalog(codeSheet, sourceName) {
  const found = findTableHeader(codeSheet, ['Error Code', 'Rule', 'Severity'], sourceName);
  const codeColumn = headerColumn(found.headers, 'Error Code', { sourceName });
  const ruleColumn = headerColumn(found.headers, 'Rule', { sourceName });
  const severityColumn = headerColumn(found.headers, 'Severity', { sourceName });
  const group = headerColumn(found.headers, 'Group', { required: false, sourceName });
  const catalog = new Map();
  for (let rowNumber = found.rowNumber + 1; rowNumber <= (codeSheet.maxRow || 0); rowNumber++) {
    const row = codeSheet.rows[rowNumber];
    if (!row) continue;
    const code = cleanText(cellAt(row, codeColumn.index));
    if (isBlank(code)) continue;
    catalog.set(String(code).trim(), {
      code: String(code).trim(),
      rule: String(cleanText(cellAt(row, ruleColumn.index)) ?? '').trim(),
      severity: String(cleanText(cellAt(row, severityColumn.index)) ?? 'Warning').trim() || 'Warning',
      group: group ? String(cleanText(cellAt(row, group.index)) ?? '').trim() : ''
    });
  }
  return catalog;
}

/** Read the Code sheet project-metadata table into a field map and a metadata map.
 * @param {object} codeSheet @param {string} sourceName @returns {{fields: Map, metadata: Map}} */
function readMetadataTable(codeSheet, sourceName) {
  const metaHeaders = findTableHeader(codeSheet, ['Project Metadata Title', 'Project Metadata Values', 'Project Metadata Data Type'], sourceName);
  const titleColumn = headerColumn(metaHeaders.headers, 'Project Metadata Title', { sourceName });
  const valueColumn = headerColumn(metaHeaders.headers, 'Project Metadata Values', { sourceName });
  const typeColumn = headerColumn(metaHeaders.headers, 'Project Metadata Data Type', { sourceName });
  const fields = new Map();
  const metadata = new Map();
  for (let rowNumber = metaHeaders.rowNumber + 1; rowNumber <= (codeSheet.maxRow || 0); rowNumber++) {
    const row = codeSheet.rows[rowNumber];
    if (!row) continue;
    const name = cleanText(cellAt(row, titleColumn.index));
    const value = cleanText(cellAt(row, valueColumn.index));
    const type = cleanText(cellAt(row, typeColumn.index));
    if (isBlank(name)) continue;
    if (typeof value === 'string' && /^Column-[A-Z]+$/i.test(value.trim())) {
      fields.set(String(name).trim(), { column: columnIndex(value.trim().slice(7)), type: String(type ?? '').trim() });
    } else if (!isBlank(value)) {
      metadata.set(String(name).trim(), value);
    }
  }
  return { fields, metadata };
}

/** Identify a workbook from the Dashboard Title in its Code sheet. @param {string} dashboardTitle @param {object} config @returns {'mdl'|'log'|null} */
export function workbookKind(dashboardTitle, config) {
  const value = String(dashboardTitle ?? '').trim().toLowerCase();
  if (!value) return null;
  if (value === String(config?.mdl?.dashboardTitle ?? '').trim().toLowerCase()) return 'mdl';
  if (value === String(config?.submittalLog?.dashboardTitle ?? '').trim().toLowerCase()) return 'log';
  return null;
}

/** Inspect a workbook and report which source it is, without building a model.
 * @param {object} workbook @param {object} config @returns {{ok: boolean, kind?: string, dashboardTitle?: string, projectTitle?: string, reason?: string}} */
export function inspectWorkbook(workbook, config) {
  const labels = config?.metadataLabels || {};
  const dashboardTitleLabel = labels.dashboardTitle || 'Dashboard Title';
  const projectTitleLabel = labels.projectTitle || 'Project Title';
  const codeSheetName = config?.mdl?.codeSheet || 'Code';
  const codeSheet = workbook?.sheets?.[codeSheetName];
  if (!codeSheet) return { ok: false, reason: `This file has no "${codeSheetName}" sheet, so it is not a project workbook.` };
  let metadata;
  try {
    ({ metadata } = readMetadataTable(codeSheet, `${codeSheetName} sheet`));
  } catch (error) {
    return { ok: false, reason: `The "${codeSheetName}" sheet has no project metadata table (${error.message}).` };
  }
  const dashboardTitle = String(cleanText(metadata.get(dashboardTitleLabel)) ?? '').trim();
  if (!dashboardTitle) return { ok: false, reason: `The "${codeSheetName}" sheet has no "${dashboardTitleLabel}".` };
  const kind = workbookKind(dashboardTitle, config);
  if (!kind) return { ok: false, reason: `This workbook is "${dashboardTitle}". Expected "${config?.mdl?.dashboardTitle}" or "${config?.submittalLog?.dashboardTitle}".` };
  return { ok: true, kind, dashboardTitle, projectTitle: String(cleanText(metadata.get(projectTitleLabel)) ?? '').trim() };
}

/** Read MDL field maps, domains, and rule definitions. @param {object} workbook @param {object} config @returns {object} */
function readMdlContract(workbook, config) {
  const sourceName = 'Master Document List Code sheet';
  const codeSheet = workbook.sheets[config.mdl.codeSheet];
  if (!codeSheet) throw new PipelineError(`${sourceName} is missing.`, { source: sourceName });
  const missingSheets = (config.mdl.requiredSheets || []).filter(name => !workbook.sheets[name]);
  if (missingSheets.length) throw new PipelineError(`Master Document List is missing required discipline sheet(s): ${missingSheets.join(', ')}.`, { source: 'Master Document List', sheets: missingSheets });
  const { fields, metadata } = readMetadataTable(codeSheet, sourceName);
  const missing = config.mdl.requiredFields.filter(field => !fields.has(field));
  if (missing.length) throw new PipelineError(`${sourceName} has no column map for: ${missing.join(', ')}.`, { source: sourceName, fields: missing });
  const disciplines = readCodeTable(codeSheet, 'UESH Discipline', 'UESH Discipline Description', sourceName);
  const statusDomains = {
    submission: readCodeTable(codeSheet, 'Submission Status Code', 'Submission Status', sourceName),
    approval: readCodeTable(codeSheet, 'Approval Code', 'Approval Status', sourceName)
  };
  const errors = readErrorCatalog(codeSheet, sourceName);
  return { codeSheet, fields, metadata, disciplines, statusDomains, errors };
}

/** Read Submittal Log columns, domains, and rule definitions. @param {object} workbook @param {object} config @returns {object} */
function readLogContract(workbook, config) {
  const sheet = workbook.sheets[config.submittalLog.sheet];
  const sourceName = `Submittal Log “${config.submittalLog.sheet}” sheet`;
  if (!sheet) throw new PipelineError(`${sourceName} is missing.`, { source: sourceName });
  const headers = readHeaderRow(sheet, 1, sourceName);
  const columns = new Map();
  for (const header of config.submittalLog.requiredHeaders) columns.set(header, headerColumn(headers, header, { sourceName }));
  const codeSheet = workbook.sheets[config.submittalLog.codeSheet];
  if (!codeSheet) throw new PipelineError('Submittal Log Code sheet is missing.', { source: 'Submittal Log Code sheet' });
  const { metadata } = readMetadataTable(codeSheet, 'Submittal Log Code sheet');
  const statusDomains = {
    submission: readCodeTable(codeSheet, 'Submission Status Code', 'Submission Status', 'Submittal Log Code sheet'),
    approval: readCodeTable(codeSheet, 'Approval Code', 'Approval Status', 'Submittal Log Code sheet')
  };
  const errors = readErrorCatalog(codeSheet, 'Submittal Log Code sheet');
  return { sheet, columns, metadata, statusDomains, errors, config: { ...config.submittalLog, placeholderTokens: config.placeholderTokens } };
}

/** Convert an Excel date serial to a local-date string without a time zone shift. @param {number} value @returns {string|null} */
function excelSerialToISO(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const date = new Date(Math.round((value - 25569) * 86400000));
  if (Number.isNaN(date.valueOf())) return null;
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

/** Normalize an Excel date value to YYYY-MM-DD. @param {*} value @returns {string|null} */
function normalizeDate(value) {
  if (typeof value === 'number') return excelSerialToISO(value);
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, '0')}-${String(value.getUTCDate()).padStart(2, '0')}`;
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!text) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.valueOf())) return null;
  return `${parsed.getUTCFullYear()}-${String(parsed.getUTCMonth() + 1).padStart(2, '0')}-${String(parsed.getUTCDate()).padStart(2, '0')}`;
}

/** Return the calendar-day difference between two ISO dates. @param {string} left @param {string} right @returns {number|null} */
function dateDifferenceDays(left, right) {
  if (!left || !right) return null;
  const parse = value => {
    const [year, month, day] = value.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((parse(left) - parse(right)) / 86400000);
}

/** Return today's local calendar date. @returns {string} */
function todayLocalISO() {
  const now = new Date();
  const pad = value => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Normalize a cell and count formula errors by source field. @param {*} raw @param {string} type @param {Map} counts @param {string} sourceName @param {string} field @returns {*} */
function normalizeValue(raw, type, counts, sourceName, field) {
  if (isBlank(raw)) return undefined;
  if (isExcelError(raw)) {
    const key = `${sourceName}:${field}`;
    counts.set(key, { source: sourceName, field, count: (counts.get(key)?.count || 0) + 1 });
    return undefined;
  }
  if (/^date$/i.test(type || '')) return normalizeDate(raw) ?? undefined;
  if (/^boolean$/i.test(type || '')) {
    if (raw === true || /^yes$|^true$/i.test(String(raw).trim())) return 'YES';
    if (raw === false || /^no$|^false$/i.test(String(raw).trim())) return 'NO';
  }
  return typeof raw === 'string' ? raw.trim() : raw;
}

/** Build a row-level issue using the workbook's rule text and severity. @param {string} code @param {object} record @param {Map} catalog @param {object} details @returns {object} */
function codeIssue(code, record, catalog, details = {}) {
  const definition = catalog.get(code) || {};
  return {
    code,
    severity: definition.severity || 'Warning',
    group: definition.group || '',
    message: definition.rule || `Validation rule ${code}.`,
    source: details.source || record?.source || null,
    sheet: details.sheet || record?.sheet || null,
    row: details.row ?? record?.row ?? null,
    documentNo: details.documentNo ?? record?.documentNo ?? null,
    field: details.field || null,
    value: details.value ?? null
  };
}

/** Normalize MDL planned rows and identify blank or duplicate document numbers. @param {object} workbook @param {object} mdlContract @param {Map} formulaErrors @param {string} sourceName @returns {object} */
function parseMdl(workbook, mdlContract, formulaErrors, config, sourceName = 'Master Document List') {
  const records = [];
  const issues = [];
  const requiredFields = mdlContract.fields;
  const knownDisciplines = new Set(mdlContract.disciplines.keys());
  const sheetNames = new Set(Object.keys(workbook.sheets));
  for (const discipline of knownDisciplines) {
    if (!sheetNames.has(discipline)) continue;
    const sheet = workbook.sheets[discipline];
    const headerRow = Math.max(1, Number(mdlContract.metadata.get('Header Row')) || 1);
    for (let rowNumber = headerRow + 1; rowNumber <= (sheet.maxRow || 0); rowNumber++) {
      const row = sheet.rows[rowNumber];
      if (!row) continue;
      const rawFields = {};
      let hasMappedContent = false;
      for (const [field, mapping] of requiredFields) {
        const raw = cellAt(row, mapping.column);
        if (!isBlank(raw)) hasMappedContent = true;
        const normalized = normalizeValue(raw, mapping.type, formulaErrors, sourceName, field);
        if (normalized !== undefined) rawFields[field] = normalized;
      }
      const documentNo = rawFields['Document No.'];
      const title = rawFields['Document Title'];
      if (!hasMappedContent || (isBlank(documentNo) && isBlank(title) && isBlank(rawFields['SNo.']))) continue;
      const record = {
        id: `mdl:${discipline}:${rowNumber}`,
        source: sourceName,
        sheet: discipline,
        row: rowNumber,
        documentNo: isBlank(documentNo) ? null : String(documentNo).trim(),
        discipline,
        stage: rawFields.Stage ?? '',
        title: title ?? '',
        fields: { ...rawFields }
      };
      records.push(record);
      if (isBlank(documentNo)) issues.push(codeIssue('V-01', record, mdlContract.errors, { field: 'Document No.', value: '(blank)' }));
      if (record.documentNo && config.placeholderTokens.some(token => record.documentNo.toLowerCase().includes(token.toLowerCase()))) {
        issues.push(codeIssue('V-15', record, mdlContract.errors, { field: 'Document No.', value: record.documentNo }));
      }
      const missingRequiredFields = config.mdl.requiredRecordFields.filter(field => isBlank(rawFields[field]));
      if (record.documentNo && missingRequiredFields.length) {
        issues.push(codeIssue('V-25', record, mdlContract.errors, { field: 'Required Fields', value: missingRequiredFields.join(', ') }));
      }
      // V-33 — a registered document must carry a first-issue plan date. A blank date is a data
      // quality error, not an "unscheduled" state: the row still counts in MDL totals, but no
      // date-axis series can plot it (workplan D43, §3.3.1, §3.3.2).
      if (record.documentNo && isBlank(rawFields['Planned 1st Issue Date'])) {
        issues.push(codeIssue('V-33', record, mdlContract.errors, { field: 'Planned 1st Issue Date', value: '(blank)' }));
      }
    }
  }
  const counts = new Map();
  for (const record of records) {
    if (!record.documentNo) continue;
    counts.set(record.documentNo, (counts.get(record.documentNo) || 0) + 1);
  }
  for (const record of records) {
    if (record.documentNo && counts.get(record.documentNo) > 1) {
      issues.push(codeIssue('V-26', record, mdlContract.errors, { field: 'Document No.', value: record.documentNo }));
    }
  }
  return { records, issues, counts };
}

/** Normalize and validate each Submittal Log row. @param {object} logContract @param {object} mdlContract @param {Map} formulaErrors @param {string} asOfDate @param {string} sourceName @returns {object} */
function parseSubmittals(logContract, mdlContract, formulaErrors, asOfDate, sourceName = 'Document Submittal Log') {
  const { sheet, columns } = logContract;
  const records = [];
  const issues = [];
  const mapped = new Map();
  for (const [field, column] of columns) mapped.set(field, column.index);
  const end = sheet.maxRow || 1;
  const knownDisciplines = new Set(mdlContract.disciplines.keys());
  const rawDomain = new Map([...logContract.statusDomains.submission, ...mdlContract.statusDomains.submission]);
  const notSubmitted = new Set([...rawDomain].filter(([, label]) => /\b(?:not|no)\b.*\b(?:submitted|submission)\b/i.test(label)).map(([code]) => code));
  const allowedResubmissionStatuses = new Set([
    ...[...logContract.statusDomains.submission].filter(([, label]) => /pending\s+resubmission|returned.*resubmission|resubmission\s+required/i.test(label)).map(([code]) => code),
    ...[...logContract.statusDomains.approval].filter(([, label]) => /reject/i.test(label)).map(([code]) => code)
  ]);
  const returnRequiredStatuses = new Set([...logContract.statusDomains.submission]
    .filter(([, label]) => /pending.*resubmission|returned.*resubmission/i.test(label))
    .map(([code]) => code));
  const requiresApprovalDateStatuses = new Set([...logContract.statusDomains.approval]
    .filter(([, label]) => /approved without comments/i.test(label))
    .map(([code]) => code));
  const requiresReturnDateStatuses = new Set([...logContract.statusDomains.approval]
    .filter(([, label]) => /approved|reject/i.test(label) && !/information/i.test(label))
    .map(([code]) => code));
  for (let rowNumber = 2; rowNumber <= end; rowNumber++) {
    const row = sheet.rows[rowNumber];
    if (!row) continue;
    const snoRaw = cellAt(row, mapped.get('SNo.'));
    const docRaw = cellAt(row, mapped.get('Document No.'));
    const subject = String(cellAt(row, mapped.get('Prolog Subject')) ?? '').trim();
    if (isBlank(snoRaw) && isBlank(docRaw) && knownDisciplines.has(subject)) {
      continue;
    }
    const hasRowIdentity = !isBlank(snoRaw) || !isBlank(docRaw);
    if (!hasRowIdentity) continue;
    const fields = {};
    const formulaErrorFields = new Set();
    for (const [field, column] of mapped) {
      const raw = cellAt(row, column);
      const type = /date/i.test(field) ? 'Date' : '';
      const normalized = normalizeValue(raw, type, formulaErrors, sourceName, field);
      if (normalized !== undefined) fields[field] = normalized;
      else if (isExcelError(raw)) formulaErrorFields.add(field);
    }
    const docValue = fields['Document No.'];
    const record = {
      id: `submission:${rowNumber}`,
      source: sourceName,
      sheet: 'SubmittalLog',
      row: rowNumber,
      documentNo: isBlank(docValue) ? null : String(docValue).trim(),
      discipline: '',
      fields,
      formulaErrorFields,
      submissionDate: fields['Submission Date'] || null,
      targetReturnDate: fields['Target Return Date'] || null,
      actualReturnDate: fields['Actual Return Date'] || null,
      submissionStatus: isBlank(fields['Submission Status']) ? '' : String(fields['Submission Status']).trim(),
      approvalStatus: isBlank(fields['Approval Status']) ? '' : String(fields['Approval Status']).trim(),
      resubmissionRequired: isBlank(fields['Resubmission Required']) ? '' : String(fields['Resubmission Required']).trim().toUpperCase(),
      linkStatus: 'unmatched',
      linkedPlannedId: null
    };
    records.push(record);
    if (isBlank(record.documentNo)) issues.push(codeIssue('V-01', record, logContract.errors, { source: sourceName, field: 'Document No.', value: '(blank)' }));
    if (!isBlank(record.submissionStatus) && !logContract.statusDomains.submission.has(record.submissionStatus)) {
      issues.push(codeIssue('V-07', record, logContract.errors, { field: 'Submission Status', value: record.submissionStatus }));
    }
    if (!isBlank(record.approvalStatus) && !logContract.statusDomains.approval.has(record.approvalStatus)) {
      issues.push(codeIssue('V-08', record, logContract.errors, { field: 'Approval Status', value: record.approvalStatus }));
    }
    if (record.documentNo && logContract.config.placeholderTokens?.some(token => record.documentNo.toLowerCase().includes(token.toLowerCase()))) {
      issues.push(codeIssue('V-15', record, logContract.errors, { field: 'Document No.', value: record.documentNo }));
    }
    if (returnRequiredStatuses.has(record.submissionStatus) && (!record.approvalStatus || logContract.config.voidApprovalValues.includes(record.approvalStatus))) {
      issues.push(codeIssue('V-16', record, logContract.errors, { field: 'Submission Status / Approval Status', value: `${record.submissionStatus} / ${record.approvalStatus || '(blank)'}` }));
    }
    if (record.submissionDate && (!fields['Prolog No.'] || !record.submissionStatus)) {
      issues.push(codeIssue('V-18', record, logContract.errors, { field: 'Prolog No. / Submission Status', value: `${fields['Prolog No.'] || '(blank)'} / ${record.submissionStatus || '(blank)'}` }));
    }
    if (requiresApprovalDateStatuses.has(record.approvalStatus) && !record.actualReturnDate) {
      issues.push(codeIssue('V-11', record, logContract.errors, { field: 'Actual Return Date', value: '(blank)' }));
    }
    if (requiresReturnDateStatuses.has(record.approvalStatus) && (!record.submissionDate || !record.actualReturnDate)) {
      issues.push(codeIssue('V-20', record, logContract.errors, { field: 'Submission Date / Actual Return Date', value: `${record.submissionDate || '(blank)'} / ${record.actualReturnDate || '(blank)'}` }));
    }
    if (record.actualReturnDate && !record.approvalStatus) {
      issues.push(codeIssue('V-21', record, logContract.errors, { field: 'Approval Status', value: '(blank)' }));
    }
    if (record.submissionStatus === 'SUR' && record.actualReturnDate) {
      issues.push(codeIssue('V-32', record, logContract.errors, { field: 'Submission Status / Actual Return Date', value: `${record.submissionStatus} / ${record.actualReturnDate}` }));
    }
    const futureDate = [record.submissionDate, record.actualReturnDate].find(value => value && dateDifferenceDays(value, asOfDate) > 0);
    if (futureDate) issues.push(codeIssue('V-23', record, logContract.errors, { field: 'Submission / Actual Return Date', value: futureDate }));
    const missingRequiredFields = logContract.config.requiredRecordFields.filter(field => isBlank(fields[field]));
    if (missingRequiredFields.length) issues.push(codeIssue('V-25', record, logContract.errors, { field: 'Required Fields', value: missingRequiredFields.join(', ') }));
    if (record.submissionDate && record.targetReturnDate && dateDifferenceDays(record.targetReturnDate, record.submissionDate) < 0) {
      issues.push(codeIssue('V-30', record, logContract.errors, { field: 'Target Return Date', value: record.targetReturnDate }));
    }
    if (record.submissionDate && record.actualReturnDate && dateDifferenceDays(record.actualReturnDate, record.submissionDate) < 0) {
      issues.push(codeIssue('V-30', record, logContract.errors, { field: 'Actual Return Date', value: record.actualReturnDate }));
    }
    const approvalOnNotSubmitted = record.submissionStatus && notSubmitted.has(record.submissionStatus) && record.approvalStatus;
    const invalidResubmission = record.resubmissionRequired === 'YES' && !allowedResubmissionStatuses.has(record.submissionStatus);
    if (approvalOnNotSubmitted || invalidResubmission) {
      issues.push(codeIssue('V-31', record, logContract.errors, { field: 'Submission Status / Approval Status / Resubmission Required', value: [record.submissionStatus, record.approvalStatus, record.resubmissionRequired].join(' / ') }));
    }
  }
  return { records, issues, notSubmitted };
}

/** Recalculate turnaround, delay, month, and row flags. @param {object} record @param {string} asOfDate @param {Set} approvedCodes @param {Array} formulaComparisons @returns {object} */
function calculateSubmission(record, asOfDate, approvedCodes, formulaComparisons) {
  const submittedDate = record.submissionDate;
  const actualReturn = record.actualReturnDate;
  const targetReturn = record.targetReturnDate;
  const cachedTurnaround = record.fields['Review Turnaround Days'];
  const cachedDelay = record.fields['Review Delay Days'];
  const reviewPeriod = Number(record.fields['Review Period']);
  const turnaroundDays = submittedDate
    ? dateDifferenceDays(actualReturn || asOfDate, submittedDate)
    : null;
  let delayDays = null;
  if (actualReturn && targetReturn) delayDays = dateDifferenceDays(actualReturn, targetReturn);
  else if (!actualReturn && targetReturn) delayDays = Math.max(dateDifferenceDays(asOfDate, targetReturn), 0);
  if (actualReturn && Number.isFinite(Number(cachedTurnaround)) && turnaroundDays !== null) {
    formulaComparisons.push({ row: record.row, field: 'Review Turnaround Days', calculated: turnaroundDays, cached: Number(cachedTurnaround), difference: turnaroundDays - Number(cachedTurnaround) });
  }
  if (actualReturn && Number.isFinite(Number(cachedDelay)) && delayDays !== null) {
    formulaComparisons.push({ row: record.row, field: 'Review Delay Days', calculated: delayDays, cached: Number(cachedDelay), difference: delayDays - Number(cachedDelay), reviewPeriod: Number.isFinite(reviewPeriod) ? reviewPeriod : null });
  }
  const month = submittedDate ? `${submittedDate.slice(0, 7)}-01` : null;
  const fields = { ...record.fields };
  if (turnaroundDays !== null && !record.formulaErrorFields.has('Review Turnaround Days')) fields['Review Turnaround Days'] = turnaroundDays;
  if (delayDays !== null && !record.formulaErrorFields.has('Review Delay Days')) fields['Review Delay Days'] = delayDays;
  return {
    ...record,
    fields,
    turnaroundDays,
    delayDays,
    month,
    flagApproved: approvedCodes.has(record.approvalStatus) ? 1 : 0,
    flagOnTime: delayDays !== null && delayDays <= 0 ? 1 : 0,
    flagDelayed: delayDays !== null && delayDays > 0 ? 1 : 0,
    flagResubmission: record.resubmissionRequired === 'YES' ? 1 : 0
  };
}

/** Normalize both workbooks, validate their contracts, join records, and calculate row fields. @param {object} mdlWorkbook @param {object} logWorkbook @param {object} options @returns {object} */
export function buildModel(mdlWorkbook, logWorkbook, options = {}) {
  const config = options.contract;
  if (!config?.mdl?.requiredFields || !config?.mdl?.requiredRecordFields || !config?.submittalLog?.requiredHeaders || !config?.submittalLog?.requiredRecordFields || !Array.isArray(config.placeholderTokens)) {
    throw new PipelineError('Pipeline contract configuration is missing or invalid.', { source: 'pipeline_contract.json' });
  }
  const stages = [];
  runStage(stages, 'S1 Check parsed workbooks', () => {
    assertWorkbook(mdlWorkbook, 'Master Document List');
    assertWorkbook(logWorkbook, 'Document Submittal Log');
  });
  const formulaErrors = new Map();
  const mdlContract = runStage(stages, 'S2 Read MDL source contract', () => readMdlContract(mdlWorkbook, config));
  const logContract = runStage(stages, 'S2 Read Submittal Log source contract', () => readLogContract(logWorkbook, config));
  const modelAsOfDate = options.today || todayLocalISO();
  const planned = runStage(stages, 'S2 Normalize MDL records', () => parseMdl(mdlWorkbook, mdlContract, formulaErrors, config));
  const submissions = runStage(stages, 'S2/S3 Normalize and validate submission records', () => parseSubmittals(logContract, mdlContract, formulaErrors, modelAsOfDate));
  const allErrors = new Map([...mdlContract.errors, ...logContract.errors]);
  const issues = [...planned.issues, ...submissions.issues];
  const approvedCodes = new Set([...logContract.statusDomains.approval].filter(([, label]) => /^approved\b/i.test(label) && !/not\s+approved/i.test(label)).map(([code]) => code));
  const formulaComparisons = [];
  const calculated = runStage(stages, 'S3 Calculate row-level fields', () => submissions.records.map(record => calculateSubmission(record, modelAsOfDate, approvedCodes, formulaComparisons)));
  // D32 — the join compares trimmed, upper-cased document numbers. A case variant of a real document
  // number must match its plan row, not become a false V-29 orphan.
  const linkKey = value => String(value ?? '').trim().toUpperCase();
  const plannedByDocument = new Map();
  for (const record of planned.records) {
    if (!record.documentNo) continue;
    const key = linkKey(record.documentNo);
    const matches = plannedByDocument.get(key) || [];
    matches.push(record);
    plannedByDocument.set(key, matches);
  }
  const joinedSubmissions = runStage(stages, 'S3 Link submissions to planned rows', () => calculated.map(record => {
    const matches = record.documentNo ? plannedByDocument.get(linkKey(record.documentNo)) || [] : [];
    if (!matches.length) {
      record.linkStatus = 'orphan';
      record.discipline = 'Unknown';
      issues.push(codeIssue('V-29', record, allErrors, { source: record.source, field: 'Document No.', value: record.documentNo }));
    } else if (matches.length > 1) {
      record.linkStatus = 'ambiguous';
      record.discipline = matches[0].discipline;
    } else {
      record.linkStatus = 'matched';
      record.linkedPlannedId = matches[0].id;
      record.discipline = matches[0].discipline;
    }
    return record;
  }));
  const submissionsByPlan = new Map();
  for (const record of joinedSubmissions) {
    if (record.linkStatus !== 'matched') continue;
    const existing = submissionsByPlan.get(record.linkedPlannedId) || [];
    existing.push(record);
    submissionsByPlan.set(record.linkedPlannedId, existing);
  }
  const submittedCodes = new Set([...logContract.statusDomains.submission.keys()].filter(code => !submissions.notSubmitted.has(code)));
  const plannedRows = planned.records.map(record => {
    const linked = submissionsByPlan.get(record.id) || [];
    const isSubmitted = linked.some(item => Boolean(item.submissionDate) || submittedCodes.has(item.submissionStatus));
    return { ...record, submissions: linked, isSubmitted };
  });
  const warnings = [...formulaErrors.values()].map(({ source, field, count }) => ({
    severity: 'Fatal', code: 'W-FORMULA', source, field, count,
    message: `${field} contains ${count} spreadsheet formula-error cell${count === 1 ? '' : 's'}. The value was treated as absent.`
  }));
  const returnedComparisons = formulaComparisons.filter(item => item.field === 'Review Delay Days');
  const formulaDifferences = returnedComparisons.filter(item => item.difference !== 0);
  if (formulaDifferences.length) warnings.push({
    severity: 'Warning', code: 'W-FORMULA-COMPARE', source: 'Document Submittal Log', field: 'Review Delay Days',
    count: formulaDifferences.length,
    message: `${formulaDifferences.length} returned row(s) differ from the cached workbook delay value. The dashboard keeps negative delay for early returns and recalculates open rows from the target date.`
  });
  const duplicatePlannedIds = [...planned.counts].filter(([, count]) => count > 1).length;
  const metaLabels = config.metadataLabels || {};
  const dashboardTitleLabel = metaLabels.dashboardTitle || 'Dashboard Title';
  const projectTitleLabel = metaLabels.projectTitle || 'Project Title';
  const projectStartLabel = metaLabels.projectStart || 'Project Start Date';
  const sourceTitles = [...new Set([
    String(cleanText(mdlContract.metadata.get(dashboardTitleLabel)) ?? '').trim(),
    String(cleanText(logContract.metadata.get(dashboardTitleLabel)) ?? '').trim()
  ].filter(Boolean))];
  return {
    meta: {
      asOfDate: modelAsOfDate,
      generatedAt: new Date().toISOString(),
      mdlWorkbookName: options.mdlWorkbookName || '',
      logWorkbookName: options.logWorkbookName || '',
      projectTitle: String(cleanText(mdlContract.metadata.get(projectTitleLabel)) ?? '').trim(),
      dashboardTitle: sourceTitles.join(' · '),
      mdlDashboardTitle: String(cleanText(mdlContract.metadata.get(dashboardTitleLabel)) ?? '').trim(),
      logDashboardTitle: String(cleanText(logContract.metadata.get(dashboardTitleLabel)) ?? '').trim(),
      projectStartDate: normalizeDate(mdlContract.metadata.get(projectStartLabel)) || ''
    },
    stages,
    contract: {
      mdlFields: [...mdlContract.fields.keys()],
      logHeaders: [...logContract.columns.keys()],
      statusDomains: {
        submission: [...logContract.statusDomains.submission.keys()],
        approval: [...logContract.statusDomains.approval.keys()]
      },
      errorRules: [...allErrors.values()]
    },
    planned: plannedRows,
    submissions: joinedSubmissions,
    issues,
    warnings,
    formulaComparisons,
    coverage: {
      plannedCount: plannedRows.length,
      submittedCount: plannedRows.filter(record => record.isSubmitted).length,
      ambiguousPlannedCount: plannedRows.filter(record => record.documentNo && (planned.counts.get(record.documentNo) || 0) > 1).length,
      duplicateDocumentNumberCount: duplicatePlannedIds,
      submissionCount: joinedSubmissions.length,
      orphanCount: joinedSubmissions.filter(record => record.linkStatus === 'orphan').length,
      ambiguousSubmissionCount: joinedSubmissions.filter(record => record.linkStatus === 'ambiguous').length
    }
  };
}

export { dateDifferenceDays, excelSerialToISO, normalizeDate };
