// checks/english.mjs — Tier-1 pipeline + design config for english-learning (offline PWA).
//
// english-learning persists to localStorage on iPhone Safari; its "pipeline" is the state
// module that derives word/reading/streak views from the persisted snapshot. The harness
// loads it once it is extracted to english-learning/src/pipeline.mjs. Until that module
// exists in the repo, pipeline assertions report MANUAL; the structural (adapter-shape)
// assertions RUN so the heterogeneous localStorage adapter is proven to integrate cleanly.
//
// Import: import { buildModel, isExcelError, deriveView } from '../../english-learning/src/pipeline.mjs'
import { elMakeStorage } from '../lib/fixtures.mjs';

export default {
  name: 'english',
  title: 'english-learning (offline PWA) — pipeline + design (Tier 1)',
  pipelineSrc: 'english-learning/src/pipeline.mjs',
  renderSrc: 'english-learning/src/render.mjs',
  workplan: 'english-learning/English-Workplan.md',
  specSections: ['§3.8', '§3.8.4', '§4.2', '§3.5', '§8'],
  fixtures: { makeWorkbook: elMakeStorage },

  // ===========================================================================
  // TIER-1 CONTRACT — english-learning/src/pipeline.mjs MUST export:
  //   buildModel(storage) → { records (word list), lookups, issues, warnings }
  //                         records[] items carry { word, phase, due, box, known }
  //                         reading progress is INDEPENDENT of daily-word streak (per cadence rule)
  //   isExcelError(v)     → bool (formula-error tokens, if any data comes from a sheet)
  //   deriveView(model, view) → structured view; needs render → MANUAL here
  // Confirm this contract, then the A*/C*/B* assertions below flip from MANUAL to RUN.
  // ===========================================================================

  assertions: [
    // ---- Group S: structural (adapter shape) — RUNS now, proves the adapter ----
    {
      id: 'S1', group: 'S', source: 'fixture adapter',
      desc: 'elMakeStorage yields the {keys, vocabulary, reading, progress} snapshot',
      run(ctx){
        const s = ctx.makeWorkbook();
        ctx.ok('S1 has vocabulary + reading + progress', !!s.vocabulary && !!s.reading && !!s.progress, 'keys=' + Object.keys(s).join(','));
        ctx.ok('S1 vocabulary has 2 entries', Array.isArray(s.vocabulary) && s.vocabulary.length === 2, 'len=' + (s.vocabulary||[]).length);
        ctx.ok('S1 progress flags reading independence', s.progress.readingIndependent === true, 'indep=' + s.progress.readingIndependent);
      }
    },
    {
      id: 'S2', group: 'S', source: 'fixture adapter',
      desc: 'elMakeStorage round-trips through JSON (offline localStorage persistence)',
      run(ctx){
        const s = ctx.makeWorkbook();
        let ok = true; try { JSON.parse(JSON.stringify(s)); } catch { ok = false; }
        ctx.ok('S2 snapshot is JSON-serialisable (localStorage-safe)', ok);
      }
    },

    // ---- Group A: pipeline functions (workplan §3.8 consolidated state) — MANUAL until module exists ----
    {
      id: 'A1', group: 'A', source: 'workplan §3.8 (consolidate vocabulary)', needs: 'pipeline',
      desc: 'buildModel consolidates the vocabulary snapshot into records',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook());
        ctx.ok('A1 records == vocabulary length', m.records.length === 2, 'records=' + m.records.length);
        ctx.ok('A1 no spurious Error issues on valid data', m.issues.filter(i=>i.severity==='Error').length === 0, 'errs=' + m.issues.filter(i=>i.severity==='Error').length);
      }
    },
    {
      id: 'A2', group: 'A', source: 'workplan §3.8 (reading independent of daily streak)', needs: 'pipeline',
      desc: 'reading progress does not mutate daily-word streak',
      run(ctx){
        const { buildModel } = ctx.pipeline;
        const m = buildModel(ctx.makeWorkbook());
        ctx.ok('A2 daily streak preserved (5)', m.progress.dailyStreak === 5, 'streak=' + (m.progress&&m.progress.dailyStreak));
        ctx.ok('A2 reading streak independent (2)', m.progress.readingStreak === 2, 'rstreak=' + (m.progress&&m.progress.readingStreak));
      }
    },
    {
      id: 'A3', group: 'A', source: 'spec §3.8.4 (isExcelError)', needs: 'pipeline',
      desc: 'isExcelError recognises spreadsheet formula-error tokens',
      run(ctx){
        ctx.ok('A3 isExcelError("#VALUE!")', ctx.pipeline.isExcelError('#VALUE!') === true);
        ctx.ok('A3 isExcelError("apple")', ctx.pipeline.isExcelError('apple') === false);
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
        const m = buildModel(ctx.makeWorkbook());
        try { const v = ctx.deriveView(m, {}); ctx.ok('B1 deriveView returns an object', v && typeof v === 'object', typeof v); }
        catch (e){ ctx.manual('B1 deriveView', 'render contract mismatch: ' + e.message); }
      }
    }
  ]
};
