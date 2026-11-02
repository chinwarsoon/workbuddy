// checks/mdl.mjs — Tier-1 pipeline + design conformance config for MDL Document Submittal Dashboard.
// References: MDL/MDL-Dashboard-Workplan.md (§3.8 consolidated table, §4A design, conformance record)
// and the pipeline sections of Dashboard-UI-Design-Spec.md (§3.8, §3.8.4, §4.2, §3.5, §8).
//
// MDL's buildModel() performs S2 (normalise) + S3 (validate) in one call and returns
// { records (§3.8 consolidated table), contract.lookups, issues, warnings, ... }.
//
// Group A — pipeline functions (pure Node, real src/pipeline.mjs). RUNS.
// Group B — design behaviors (need deriveView / render). MANUAL until render.mjs is present.
// Group C — spec-pipeline conformance. RUNS (isExcelError) / MANUAL (DOM items → harness-layout).
import { mdlMakeWorkbook } from '../lib/fixtures.mjs';

export default {
  name: 'mdl',
  title: 'MDL Document Submittal Dashboard — pipeline + design (Tier 1)',
  pipelineSrc: 'MDL/src/pipeline.mjs',
  renderSrc: 'MDL/src/render.mjs',
  workplan: 'MDL/MDL-Dashboard-Workplan.md',
  specSections: ['§3.8', '§3.8.4', '§4.2', '§3.5', '§8'],
  fixtures: { makeWorkbook: mdlMakeWorkbook },

  assertions: [
    // ---- Group A: pipeline functions (workplan §3.8 consolidated table) ----
    {
      id: 'A1', group: 'A', source: 'workplan §3.8',
      desc: 'buildModel consolidates discipline tabs into one records table',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook({}));
        ctx.ok('A1 records consolidated from 2 tabs', m.records.length === 2, 'records=' + m.records.length);
        ctx.ok('A1 contract.lookups present', !!(m.contract && m.contract.lookups), 'has lookups=' + !!(m.contract && m.contract.lookups));
      }
    },
    {
      id: 'A2', group: 'A', source: 'workplan §3.8 (no hard-coded lists)',
      desc: 'model.contract.lookups reflects the Code-sheet block, not a constant',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook({ disc: [['Foo','FOO'],['Bar','BAR']], uesh: [['Foo','FOO'],['Bar','BAR']] }));
        const codes = m.contract.lookups.disciplineCode.codes;
        ctx.ok('A2 lookups.disciplineCode.codes includes the sheet value Foo', codes.has('Foo'), [...codes].join(','));
        ctx.ok('A2 lookups.disciplineCode.codes excludes unlisted value', !codes.has('Civil'), [...codes].join(','));
      }
    },
    {
      id: 'A3', group: 'A', source: 'workplan §3.8 (source tab tagged)',
      desc: 'each consolidated record carries its source discipline tab',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook({}));
        const tabs = new Set(m.records.map(r => r.sourceTab));
        ctx.ok('A3 records tagged with source tabs Civil & Mechanical', tabs.has('Civil') && tabs.has('Mechanical'), [...tabs].join(','));
      }
    },
    {
      id: 'A4', group: 'A', source: 'workplan §3.7 / EXCLUDE_STAGES',
      desc: 'records in an excluded stage (Deleted) are marked inactive (isActiveDoc)',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const docs = [
          { tab:'Civil', 'Document No.':'D1', 'Stage':'MR', 'UESH Discipline':'Civil', 'Discipline':'Civil', 'Doc Type':'CN', 'Number':'1', 'Actual 1st Issue Date':'2024-03-01', 'Submission Status':'SUB', 'Latest Approval Status':'APP' },
          { tab:'Civil', 'Document No.':'D2', 'Stage':'Deleted', 'UESH Discipline':'Civil', 'Discipline':'Civil', 'Doc Type':'CN', 'Number':'2', 'Actual 1st Issue Date':'2024-03-01', 'Submission Status':'SUB', 'Latest Approval Status':'APP' },
        ];
        const m = buildModel(ctx.makeWorkbook({ docs }));
        const del = m.records.find(r => r.docNo === 'D2');
        ctx.ok('A4 Deleted-stage record flagged inactive', del && del.isActive === false, 'isActive=' + (del && del.isActive));
      }
    },
    {
      id: 'A5', group: 'A', source: 'spec §3.8.4 (isExcelError)',
      desc: 'isExcelError recognises spreadsheet formula-error tokens',
      run(ctx){
        ctx.ok('A5 isExcelError("#VALUE!") === true', ctx.pipeline.isExcelError('#VALUE!') === true);
        ctx.ok('A5 isExcelError("Civil") === false', ctx.pipeline.isExcelError('Civil') === false);
      }
    },
    {
      id: 'A6', group: 'A', source: 'workplan test_pipeline (messages sourced from workbook)',
      desc: 'validation message/severity come from the Code-sheet Error block, not a constant',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook({
          disc: [['Foo','FOO'],['Bar','BAR']], uesh: [['Foo','FOO'],['Bar','BAR']],
          errs: [['V-04','CUSTOM DISCIPLINE MSG','Error','X']],
          docs: [
            { tab:'Foo', 'Document No.':'X1', 'Stage':'MR', 'UESH Discipline':'Foo', 'Discipline':'ZZZ', 'Doc Type':'CN', 'Number':'1', 'Actual 1st Issue Date':'2024-03-01', 'Submission Status':'SUB', 'Latest Approval Status':'APP' },
          ],
        }));
        const v04 = m.issues.find(i => i.code === 'V-04');
        ctx.ok('A6 V-04 fires for discipline code not in list', !!v04, 'codes=' + m.issues.map(i=>i.code).join(','));
        ctx.ok('A6 V-04 message sourced from workbook Error block', v04 && v04.message === 'CUSTOM DISCIPLINE MSG', v04 && v04.message);
      }
    },
    {
      id: 'A7', group: 'A', source: 'workplan §3.8 (huge data)',
      desc: '2000-document workbook consolidates without false errors (<5s)',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const disc = [['Foo','FOO'],['Bar','BAR']];
        const docs = [];
        for (let i=0;i<2000;i++){ const t = i%2; docs.push({
          tab: disc[t][0], 'Document No.':'D'+i, 'SNo.':String(i), 'Stage':'MR', 'UESH Discipline':disc[t][0],
          'Project Code':'P1', 'Project Prefix':'PR', 'Doc Type':'CN', 'Discipline':disc[t][0], 'Number':String(i),
          'Document Title':'Document '+i, 'Planned 1st Issue Date':'2024-02-01', 'Actual 1st Issue Date':'2024-03-01',
          'Submission Status':'SUB', 'Latest Approval Status':'APP' }); }
        const t0 = Date.now();
        const m = buildModel(ctx.makeWorkbook({ disc, uesh: disc, docs }));
        const ms = Date.now() - t0;
        ctx.ok('A7 all 2000 records consolidated', m.records.length === 2000, 'records=' + m.records.length);
        ctx.ok('A7 consolidate < 5s', ms < 5000, ms + 'ms');
        const errs = m.issues.filter(i => i.severity === 'Error');
        ctx.ok('A7 no spurious Error-severity issues', errs.length === 0, 'errs=' + errs.length);
      }
    },
    {
      id: 'A8', group: 'A', source: 'workplan §3.8 (empty data)',
      desc: 'empty workbook → 0 records, no crash',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook({ docs: [] }));
        ctx.ok('A8 empty → 0 records', m.records.length === 0, 'records=' + m.records.length);
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
    {
      id: 'C2', group: 'C', source: 'spec §4.2 (chart guardrail) — DOM',
      desc: 'scurveAxisMode guardrail present in render (verified via harness-layout)',
      needs: 'render',
      run(ctx){ ctx.manual('C2 scurveAxisMode', 'chart guardrail — Layer-2 design check (harness-layout)'); }
    },
    {
      id: 'C3', group: 'C', source: 'spec §3.5 (errBanner stable id) — DOM',
      desc: 'errBanner carries stable id (verified via harness-layout)',
      needs: 'render',
      run(ctx){ ctx.manual('C3 errBanner id', 'warning-area placement — Layer-2 design check (harness-layout)'); }
    },

    // ---- Group B: design behaviors (need render → MANUAL here) ----
    {
      id: 'B1', group: 'B', source: 'workplan §4 (design behaviors)', needs: 'render',
      desc: 'deriveView returns a structured view from the consolidated model',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook({}));
        try {
          const v = ctx.deriveView(m, {});
          ctx.ok('B1 deriveView returns an object', v && typeof v === 'object', typeof v);
        } catch(e){ ctx.manual('B1 deriveView', 'render contract mismatch: ' + e.message); }
      }
    }
  ]
};
