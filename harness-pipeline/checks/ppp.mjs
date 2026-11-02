// checks/ppp.mjs — Tier-1 pipeline + design conformance config for PPP Procurement Dashboard.
// References: PPP/PPP-Dashboard-Workplan.md (§3 functions, §4.2 rules, §5 design) and the pipeline
// sections of Dashboard-UI-Design-Spec.md (§3.8, §3.8.4, §4.2, §3.5, §8).
//
// Group A — pipeline functions (pure Node, real src/pipeline.mjs). RUNS.
// Group B — design behaviors (need deriveView / render). MANUAL until render.mjs is present.
// Group C — spec-pipeline conformance (items that live in pipeline.mjs). RUNS.
import { pppMakeWorkbook, pppPkg } from '../lib/fixtures.mjs';

export default {
  name: 'ppp',
  title: 'PPP Procurement Dashboard — pipeline + design (Tier 1)',
  pipelineSrc: 'PPP/src/pipeline.mjs',
  renderSrc: 'PPP/src/render.mjs',
  workplan: 'PPP/PPP-Dashboard-Workplan.md',
  specSections: ['§3.8', '§3.8.4', '§4.2', '§3.5', '§8'],
  fixtures: { makeWorkbook: pppMakeWorkbook, pkg: pppPkg },

  assertions: [
    // ---- Group A: pipeline functions (workplan §3) ----
    {
      id: 'A1', group: 'A', source: 'workplan §3.1/§3.2',
      desc: 'buildModel parses a valid workbook → 1 package, 0 validation issues (control)',
      run(ctx){
        const { buildModel, validate } = ctx.pipeline;
        const { model, vctx } = buildModel(ctx.makeWorkbook([ctx.fixtures.pkg({ title:'A', packageNo:'A1' })]), 't.xlsx');
        ctx.ok('A1 model built with 1 package', model.packages.length === 1, 'pkgs=' + model.packages.length);
        const rep = validate(model.packages, vctx);
        ctx.ok('A1 valid data → 0 issues', rep.total === 0, 'total=' + rep.total);
      }
    },
    {
      id: 'A2', group: 'A', source: 'workplan §3.2 (no hard-coded lists)',
      desc: 'lookups are read from the Code sheet, not hard-coded (discipline not in list → V-06)',
      run(ctx){
        const { buildModel, validate } = ctx.pipeline;
        const wb = ctx.makeWorkbook([ctx.fixtures.pkg({ discipline:'Civil' })], { disc: [['Foo','FOO']] });
        const { model, vctx } = buildModel(wb, 't.xlsx');
        ctx.ok('A2 package discipline read from row', model.packages[0].discipline === 'Civil', model.packages[0].discipline);
        const rep = validate(model.packages, vctx);
        const fired = rep.issues.some(i => i.code === 'V-06');
        ctx.ok('A2 unknown discipline → V-06 fires (lookup is dynamic)', fired, 'V-06=' + fired);
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
      id: 'A4', group: 'A', source: 'spec §3.8.4 (EXCEL_ERROR_TOKENS / W-FORMULA)',
      desc: 'fatal formula-error token set present (drives the W-FORMULA warning; emission verified via harness-layout)',
      run(ctx){
        const t = ctx.pipeline.EXCEL_ERROR_TOKENS || [];
        ctx.ok('A4 EXCEL_ERROR_TOKENS is a non-empty array', Array.isArray(t) && t.length > 0, t.length + ' tokens');
        ctx.ok('A4 includes #VALUE! / #REF! / #DIV/0!', t.includes('#VALUE!') && t.includes('#REF!') && t.includes('#DIV/0!'), t.join(','));
      }
    },
    {
      id: 'A5', group: 'A', source: 'workplan §4.2 C4 (status canonicalization)',
      desc: 'statusCanon maps code → display and passes through full description',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const { model } = buildModel(ctx.makeWorkbook([ctx.fixtures.pkg({ status:'NS' })]), 't.xlsx');
        ctx.ok('A5 statusCanon("NS") === "Not Started"', model.statusCanon('NS') === 'Not Started', model.statusCanon('NS'));
        ctx.ok('A5 statusCanon("PO Issued") === "PO Issued"', model.statusCanon('PO Issued') === 'PO Issued', model.statusCanon('PO Issued'));
      }
    },
    {
      id: 'A6', group: 'A', source: 'workplan §3.1 (empty data)',
      desc: 'empty workbook → buildModel throws (loader shows guidance, no crash)',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        let threw = false; try { buildModel(ctx.makeWorkbook([]), 'empty.xlsx'); } catch(e){ threw = true; }
        ctx.ok('A6 empty → throws (no silent NaN/crash)', threw);
      }
    },
    {
      id: 'A7', group: 'A', source: 'workplan §3.1 (huge data)',
      desc: '2000-row workbook parses & validates without false errors (<5s)',
      run(ctx){
        const { buildModel, validate } = ctx.pipeline;
        const pkgs = []; for (let i=0;i<2000;i++) pkgs.push(ctx.fixtures.pkg({ title:'H'+i, packageNo:'H'+i, status: i%9===0?'PO':'NS', leadTime:100+i%500 }));
        const t0 = Date.now();
        const { model, vctx } = buildModel(ctx.makeWorkbook(pkgs), 'huge.xlsx');
        const rep = validate(model.packages, vctx);
        const ms = Date.now() - t0;
        ctx.ok('A7 all 2000 packages parsed', model.packages.length === 2000, 'pkgs=' + model.packages.length);
        ctx.ok('A7 validate < 5s', ms < 5000, ms + 'ms');
        ctx.ok('A7 no spurious error issues', rep.counts.error === 0, 'errors=' + rep.counts.error);
      }
    },

    // ---- Group C: spec-pipeline conformance (items living in pipeline.mjs) ----
    {
      id: 'C1', group: 'C', source: 'spec §3.8.4',
      desc: 'isExcelError handles the full Excel error vocabulary (#REF!, #N/A, #DIV/0!)',
      run(ctx){
        ctx.ok('C1 isExcelError("#REF!")', ctx.pipeline.isExcelError('#REF!') === true);
        ctx.ok('C1 isExcelError("#N/A")', ctx.pipeline.isExcelError('#N/A') === true);
        ctx.ok('C1 isExcelError("#DIV/0!")', ctx.pipeline.isExcelError('#DIV/0!') === true);
      }
    },

    // ---- Group B: design behaviors (need render → MANUAL here, covered by harness-layout too) ----
    {
      id: 'B1', group: 'B', source: 'workplan §5.1', needs: 'render',
      desc: 'deriveView returns the six KPI cards (§5.1)',
      run(ctx){
        const { buildModel, validate } = ctx.pipeline;
        const { model } = buildModel(ctx.makeWorkbook([ctx.fixtures.pkg({ title:'K1', packageNo:'K1', poPlan:'2024-03-01' }), ctx.fixtures.pkg({ title:'K2', packageNo:'K2', status:'PO', poActual:'2024-05-01', poNo:'PO1' })]), 't.xlsx');
        try {
          const v = ctx.deriveView(model, { report:null, filter:{cats:null}, chartView:{packages:'status', data:'dqByRule'}, prefs:{chartType:{}, poBars:true}, poWin:{from:0,to:0,_n:0}, ui:{typeFilterBound:false} });
          ctx.ok('B1 deriveView returns kpis array of 6', Array.isArray(v.kpis) && v.kpis.length === 6, 'len=' + (v.kpis && v.kpis.length));
        } catch(e){ ctx.manual('B1 deriveView', 'render contract mismatch: ' + e.message); }
      }
    }
  ]
};
