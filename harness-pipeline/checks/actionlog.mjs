// checks/actionlog.mjs — Tier-1 pipeline + design config for action-log (ActionTracker SPA).
//
// action-log is a single-file index.html SPA: its "pipeline" is the client-side state
// module, not an XLSX importer. The harness loads it once it is extracted to
// action-log/src/pipeline.mjs. Until that module exists in the repo, every assertion that
// needs the real pipeline reports MANUAL (never fake-green); the structural (adapter-shape)
// assertions RUN so the heterogeneous adapter is proven to integrate cleanly.
//
// Import: import { buildModel, isExcelError, statusCanon, deriveView } from '../../action-log/src/pipeline.mjs'
import { alMakeState } from '../lib/fixtures.mjs';

export default {
  name: 'actionlog',
  title: 'action-log (ActionTracker) — pipeline + design (Tier 1)',
  pipelineSrc: 'action-log/src/pipeline.mjs',
  renderSrc: 'action-log/src/render.mjs',
  workplan: 'action-log/ActionTracker-Workplan.md',
  specSections: ['§3.8', '§3.8.4', '§4.2', '§3.5', '§8'],
  fixtures: { makeWorkbook: alMakeState },

  // ===========================================================================
  // TIER-1 CONTRACT — action-log/src/pipeline.mjs MUST export:
  //   buildModel(state)  → { records, lookups, issues, warnings, completeness? }
  //                         records[] items carry { id, title, discipline, status, ... }
  //                         lookups read from state.lookups (disciplines/statuses) — NO hard-coded lists
  //   isExcelError(v)    → bool (recognises #VALUE! / #REF! / #DIV/0! / #N/A …)
  //   statusCanon(s)     → canonical status string (e.g. "NS" → "Not Started")
  //   deriveView(model, view) → structured view; needs render → MANUAL here
  // Confirm this contract, then the A*/C*/B* assertions below flip from MANUAL to RUN.
  // ===========================================================================

  assertions: [
    // ---- Group S: structural (adapter shape) — RUNS now, proves the adapter ----
    {
      id: 'S1', group: 'S', source: 'fixture adapter',
      desc: 'alMakeState yields {actions, lookups, meta} the pipeline consumes',
      run(ctx){
        const s = ctx.makeWorkbook([
          { id:'A1', title:'Design review', discipline:'Civil', status:'Not Started' },
          { id:'A2', title:'Order pump', discipline:'Mechanical', status:'On Hold' },
        ]);
        ctx.ok('S1 actions array has 2 entries', Array.isArray(s.actions) && s.actions.length === 2, 'len=' + (s.actions||[]).length);
        ctx.ok('S1 carries lookups + meta', !!(s.lookups && s.meta), 'hasLookups=' + !!s.lookups);
        ctx.ok('S1 lookups.disciplines is data-driven (Civil first)', Array.isArray(s.lookups.disciplines) && s.lookups.disciplines[0] === 'Civil', (s.lookups.disciplines||[]).join(','));
      }
    },
    {
      id: 'S2', group: 'S', source: 'fixture adapter',
      desc: 'alMakeState preserves attachments[] model {name,src,type}',
      run(ctx){
        const s = ctx.makeWorkbook([
          { id:'A1', title:'Tender', discipline:'Civil', status:'Not Started',
            attachments:[{ name:'spec.pdf', src:'data:application/pdf;base64,xx', type:'pdf' }] },
        ]);
        const att = s.actions[0].attachments && s.actions[0].attachments[0];
        ctx.ok('S2 attachment carries name/src/type', !!(att && att.name && att.src && att.type), JSON.stringify(att||{}));
      }
    },

    // ---- Group A: pipeline functions (workplan §3.8 consolidated state) — MANUAL until module exists ----
    {
      id: 'A1', group: 'A', source: 'workplan §3.8 (consolidate actions)', needs: 'pipeline',
      desc: 'buildModel consolidates the action state into records',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook([
          { id:'A1', title:'Design review', discipline:'Civil', status:'Not Started' },
          { id:'A2', title:'Order pump', discipline:'Mechanical', status:'On Hold' },
        ]));
        ctx.ok('A1 records consolidated', m.records.length === 2, 'records=' + m.records.length);
        ctx.ok('A1 no spurious Error issues on valid data', m.issues.filter(i=>i.severity==='Error').length === 0, 'errs=' + m.issues.filter(i=>i.severity==='Error').length);
      }
    },
    {
      id: 'A2', group: 'A', source: 'workplan §3.8 (no hard-coded lists)', needs: 'pipeline',
      desc: 'lookups come from state, not a constant',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook([], { disciplines:['Foo','Bar'], statuses:['Open','Closed'] }));
        const codes = m.contract.lookups.disciplines;
        ctx.ok('A2 lookups include Foo from state', codes.has('Foo'), [...codes].join(','));
        ctx.ok('A2 lookups exclude unlisted value', !codes.has('Civil'), [...codes].join(','));
      }
    },
    {
      id: 'A3', group: 'A', source: 'spec §3.8.4 (isExcelError)', needs: 'pipeline',
      desc: 'isExcelError recognises spreadsheet formula-error tokens',
      run(ctx){
        ctx.ok('A3 isExcelError("#VALUE!")', ctx.pipeline.isExcelError('#VALUE!') === true);
        ctx.ok('A3 isExcelError("Civil")', ctx.pipeline.isExcelError('Civil') === false);
      }
    },
    {
      id: 'A4', group: 'A', source: 'workplan §3.8 (status canon)', needs: 'pipeline',
      desc: 'statusCanon maps short status to canonical label',
      run(ctx){
        ctx.ok('A4 statusCanon("NS") === "Not Started"', ctx.pipeline.statusCanon('NS') === 'Not Started');
      }
    },

    // ---- Group C: spec-pipeline conformance ----
    {
      id: 'C1', group: 'C', source: 'spec §3.8.4', needs: 'pipeline',
      desc: 'isExcelError handles the full Excel error vocabulary',
      run(ctx){
        ctx.ok('C1 isExcelError("#REF!")', ctx.pipeline.isExcelError('#REF!') === true);
        ctx.ok('C1 isExcelError("#N/A")', ctx.pipeline.isExcelError('#N/A') === true);
        ctx.ok('C1 isExcelError("#DIV/0!")', ctx.pipeline.isExcelError('#DIV/0!') === true);
      }
    },
    {
      id: 'C2', group: 'C', source: 'spec §4.2 (chart guardrail) — DOM', needs: 'render',
      desc: 'scurveAxisMode guardrail present in render (verified via harness-layout)',
      run(ctx){ ctx.manual('C2 scurveAxisMode', 'chart guardrail — Layer-2 design check (harness-layout)'); }
    },
    {
      id: 'C3', group: 'C', source: 'spec §3.5 (errBanner stable id) — DOM', needs: 'render',
      desc: 'errBanner carries stable id (verified via harness-layout)',
      run(ctx){ ctx.manual('C3 errBanner id', 'warning-area placement — Layer-2 design check (harness-layout)'); }
    },

    // ---- Group B: design behaviors (need render → MANUAL here) ----
    {
      id: 'B1', group: 'B', source: 'workplan §4 (design behaviors)', needs: 'render',
      desc: 'deriveView returns a structured view from the consolidated model',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook([{ id:'A1', title:'T', discipline:'Civil', status:'Not Started' }]));
        try { const v = ctx.deriveView(m, {}); ctx.ok('B1 deriveView returns an object', v && typeof v === 'object', typeof v); }
        catch (e){ ctx.manual('B1 deriveView', 'render contract mismatch: ' + e.message); }
      }
    }
  ]
};
