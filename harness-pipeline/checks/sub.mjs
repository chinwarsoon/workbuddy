// checks/sub.mjs — Tier-1 pipeline + design conformance config for the
// TWRP C3B2 Document Submittal Dashboard (the "sub" sub-project).
//
// References: sub/workplan/Sub-Dashboard-Workplan.md and the pipeline sections of
// Dashboard-UI-Design-Spec.md (§3.8 two-source model, §3.8.4 isExcelError, §4.2 chart
// guardrails, §3.5 errBanner id, §8 two-layer check model).
//
// sub's pipeline is a TWO-SOURCE JOIN: buildModel(mdlWorkbook, logWorkbook, { contract })
// where the external `contract` (sub/config/pipeline_contract.json) drives validation.
// The fixture (subMakeWorkbooks) returns { mdl, log, contract } and the assertions below
// exercise buildModel / isExcelError / workbookKind / inspectWorkbook.
//
// Group A — pipeline functions (pure Node, real sub/engine/pipeline.js). RUNS.
// Group B — design behaviors (need render → MANUAL, owned by harness-layout Tier 2).
// Group C — spec-pipeline conformance (isExcelError vocabulary). RUNS.
import { subMakeWorkbooks } from '../lib/fixtures.mjs';

export default {
  name: 'sub',
  title: 'TWRP C3B2 Submittal Dashboard — pipeline + design (Tier 1)',
  pipelineSrc: 'sub/engine/pipeline.js',
  renderSrc: 'sub/engine/render.js',
  workplan: 'sub/workplan/Sub-Dashboard-Workplan.md',
  specSections: ['§3.8', '§3.8.4', '§4.2', '§3.5', '§8'],
  fixtures: { makeWorkbook: subMakeWorkbooks },

  assertions: [
    // ---- Group A: pipeline functions (workplan §3 — two-source join) ----
    {
      id: 'A1', group: 'A', source: 'workplan §3 (Master Document List + Submittal Log join)',
      desc: 'buildModel consolidates 2 discipline tabs and joins 1 log row → 2 planned, 1 submission, 0 Error issues',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const { mdl, log, contract } = ctx.makeWorkbook();
        const m = buildModel(mdl, log, { contract, today: '2024-12-31' });
        ctx.ok('A1 planned consolidated from 2 discipline tabs', m.planned.length === 2, 'planned=' + m.planned.length);
        ctx.ok('A1 submission joined to planned', m.submissions.length === 1, 'subs=' + m.submissions.length);
        ctx.ok('A1 valid data → 0 Error-severity issues', m.issues.filter(i => i.severity === 'Error').length === 0, 'errors=' + m.issues.filter(i => i.severity === 'Error').length);
      }
    },
    {
      id: 'A2', group: 'A', source: 'workplan §3 (no hard-coded lists)',
      desc: 'model.contract is sourced from the Code sheet, not a constant',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const { mdl, log, contract } = ctx.makeWorkbook();
        const m = buildModel(mdl, log, { contract, today: '2024-12-31' });
        ctx.ok('A2 submission statuses read from Code sheet (SUB present)', m.contract.statusDomains.submission.includes('SUB'), m.contract.statusDomains.submission.join(','));
        ctx.ok('A2 mdlFields sourced from Code sheet (Document No. present)', m.contract.mdlFields.includes('Document No.'), m.contract.mdlFields.join(','));
      }
    },
    {
      id: 'A3', group: 'A', source: 'spec §3.8.4 (isExcelError)',
      desc: 'isExcelError recognises spreadsheet formula-error tokens',
      run(ctx){
        ctx.ok('A3 isExcelError("#VALUE!") === true', ctx.pipeline.isExcelError('#VALUE!') === true);
        ctx.ok('A3 isExcelError("Civil") === false', ctx.pipeline.isExcelError('Civil') === false);
      }
    },
    {
      id: 'A4', group: 'A', source: 'workplan §3 (two-source identification)',
      desc: 'workbookKind identifies each source workbook by its Code-sheet Dashboard Title',
      run(ctx){
        const { mdl, log, contract } = ctx.makeWorkbook();
        ctx.ok('A4 workbookKind("Master Document List") === "mdl"', ctx.pipeline.workbookKind('Master Document List', contract) === 'mdl');
        ctx.ok('A4 workbookKind("Document Submittal Log") === "log"', ctx.pipeline.workbookKind('Document Submittal Log', contract) === 'log');
      }
    },
    {
      id: 'A5', group: 'A', source: 'workplan §3 (loader inspection gate)',
      desc: 'inspectWorkbook reports ok/kind for a valid workbook and rejects one without a Code sheet',
      run(ctx){
        const { mdl, log, contract } = ctx.makeWorkbook();
        const good = ctx.pipeline.inspectWorkbook(mdl, contract);
        ctx.ok('A5 valid MDL workbook inspects ok with kind "mdl"', good.ok === true && good.kind === 'mdl', JSON.stringify(good));
        const bad = ctx.pipeline.inspectWorkbook({ sheets: { Sheet1: { rows: [], maxRow: 0 } } }, contract);
        ctx.ok('A5 workbook without a Code sheet → ok false', bad.ok === false, JSON.stringify(bad));
      }
    },
    {
      id: 'A6', group: 'A', source: 'workplan §3.1 (contract guard)',
      desc: 'buildModel throws when the pipeline contract is missing',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const { mdl, log } = ctx.makeWorkbook();
        let threw = false;
        try { buildModel(mdl, log, { today: '2024-12-31' }); } catch (e) { threw = true; }
        ctx.ok('A6 missing contract → throws (no silent NaN/crash)', threw);
      }
    },
    {
      id: 'A7', group: 'A', source: 'workplan §3 (huge data)',
      desc: '2000-document workbook consolidates and joins without false errors (<5s)',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const { mdl, log, contract } = ctx.makeWorkbook({ big: 2000 });
        const t0 = Date.now();
        const m = buildModel(mdl, log, { contract, today: '2024-12-31' });
        const ms = Date.now() - t0;
        ctx.ok('A7 all 2000 planned records consolidated', m.planned.length === 2000, 'planned=' + m.planned.length);
        ctx.ok('A7 consolidate < 5s', ms < 5000, ms + 'ms');
        ctx.ok('A7 no spurious Error-severity issues', m.issues.filter(i => i.severity === 'Error').length === 0, 'errors=' + m.issues.filter(i => i.severity === 'Error').length);
      }
    },
    {
      id: 'A8', group: 'A', source: 'workplan §3.1 (empty data)',
      desc: 'empty workbook (all discipline tabs blank) → 0 planned records, no crash',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const { mdl, log, contract } = ctx.makeWorkbook({ empty: true });
        const m = buildModel(mdl, log, { contract, today: '2024-12-31' });
        ctx.ok('A8 empty → 0 planned records', m.planned.length === 0, 'planned=' + m.planned.length);
      }
    },

    // ---- Group C: spec-pipeline conformance ----
    {
      id: 'C1', group: 'C', source: 'spec §3.8.4',
      desc: 'isExcelError handles the full Excel error vocabulary',
      run(ctx){
        ctx.ok('C1 isExcelError("#REF!")', ctx.pipeline.isExcelError('#REF!') === true);
        ctx.ok('C1 isExcelError("#N/A")', ctx.pipeline.isExcelError('#N/A') === true);
        ctx.ok('C1 isExcelError("#DIV/0!")', ctx.pipeline.isExcelError('#DIV/0!') === true);
      }
    },

    // ---- Group B: design behaviors (need render → MANUAL here, covered by harness-layout) ----
    {
      id: 'B1', group: 'B', source: 'spec §4.2 (chart guardrails: scurveAxisMode / rotate(-90) / cumulative no-rebase) — DOM',
      needs: 'render',
      desc: 'chart guardrails present in render (verified via harness-layout)',
      run(ctx){ ctx.manual('B1 scurveAxisMode / chart guardrails', 'chart guardrail — Layer-2 design check (harness-layout)'); }
    },
    {
      id: 'B2', group: 'B', source: 'spec §3.5 (errBanner stable id) — DOM',
      needs: 'render',
      desc: 'errBanner carries stable id (verified via harness-layout)',
      run(ctx){ ctx.manual('B2 errBanner id', 'warning-area placement — Layer-2 design check (harness-layout)'); }
    }
  ]
};
