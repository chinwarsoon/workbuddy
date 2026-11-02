# harness-pipeline — Tier 1: pipeline + design conformance harness

`harness-pipeline` is **Layer 1** of the `Dashboard-UI-Design-Spec.md §8` two-layer
check model:

| Tier | Layer | Harness | What it proves | Priority |
|------|-------|---------|----------------|----------|
| **Tier 1** | Pipeline + design | **`harness-pipeline`** | the pipeline runs per the sub-project **workplan** (consolidation, lookups, validation, isExcelError, status canon) and the pipeline sections of the UI spec | **highest** |
| **Tier 2** | UI / layout | `harness-layout` | CSS tokens, layout grid, DOM guardrails (scurveAxisMode, errBanner id, chart guardrails) | middle |
| **Tier 3** | Data quality | `PPP/test/regression-data.mjs` (V-01..V-26) | individual data-error rules fire correctly | **lowest** |

The ordering follows the refocus: *"the test should aim the pipeline and html page to
ensure it works per work plan first, test compliance with ui design spec, then test
data."* `harness-layout` already owns layout, so design-behavior assertions here that
need the DOM are marked **MANUAL** and left to that harness — we never re-invent layout.

---

## How Tier 1 is built for **all** sub-projects

One generic runner + one config file per sub-project. **Adding a sub-project = drop a
config file; the core never changes.**

```
harness-pipeline/
├─ harness.mjs            # generic runner (auto-discovers checks/*.mjs)
├─ run.mjs                # cross-subproject orchestrator (runs all + aggregates)
├─ lib/
│  ├─ pipeline-probe.mjs  # loads the REAL pipeline (+ optional render) via dynamic import
│  ├─ fixtures.mjs        # synthetic builders: pppMakeWorkbook / mdlMakeWorkbook /
│  │                      #   subMakeWorkbooks / alMakeState / elMakeStorage
│  └─ workplan-extract.mjs # parses workplan "## N.N" sections for cross-checks
├─ checks/
│  ├─ ppp.mjs             # config + assertions for PPP
│  ├─ mdl.mjs             # config + assertions for MDL
│  ├─ sub.mjs             # config + assertions for TWRP C3B2 Submittal Dashboard
│  ├─ actionlog.mjs       # config + assertions for action-log (SPA state)
│  └─ english.mjs         # config + assertions for english-learning (PWA storage)
├─ docs/                  # design standard + UI-spec compliance review (review-only)
├─ test_output/           # machine-readable results (gitignored)
│  └─ tier1.json
└─ package.json
```

### The config object (`checks/<name>.mjs`)

Each sub-project default-exports **one config object**. The runner reads it, loads the
real pipeline source, and runs the assertions. A config has four parts:

```js
export default {
  name: 'ppp',                                  // matches the file name
  title: 'PPP Procurement Dashboard — pipeline + design (Tier 1)',
  pipelineSrc: 'PPP/src/pipeline.mjs',          // RELATIVE to repo root
  renderSrc:   'PPP/src/render.mjs',            // optional; absence → design asserts go MANUAL
  workplan:    'PPP/PPP-Dashboard-Workplan.md',
  specSections: ['§3.8','§3.8.4','§4.2','§3.5','§8'],
  fixtures: { makeWorkbook: pppMakeWorkbook },  // maps raw model input → pipeline

  assertions: [
    { id:'A1', group:'A', source:'workplan §3.8', desc:'…', run(ctx){ … } },
    // ctx.ok(name, condition, detail?)     → PASS / FAIL
    // ctx.manual(name, why)               → MANUAL (needs render / covered by harness-layout)
  ]
};
```

The `ctx` handed to every `run()` carries: `pipeline` (real exports), `render`
(`deriveView` when present, else `null`), `root`, `workplanPath`, `specSections`,
`wpSections`, `makeWorkbook` (fixture adapter), and `ok()` / `manual()`.

### The three-state result protocol

| Mark | Meaning |
|------|---------|
| **PASS** | assertion condition held |
| **FAIL** | condition failed → exit code 1 (blocks the change) |
| **MANUAL** | needs a browser/render layer, or is already owned by `harness-layout`. Never fake-green. |

`needs:'render'` assertions auto-become MANUAL when `renderSrc` is absent, and
`needs:'pipeline'` become MANUAL when the pipeline can't load.

---

## Adding a sub-project (heterogeneous adapters)

Tier 1 is adapter-driven. Each sub-project supplies **two things**:
1. `pipelineSrc` — its real pipeline module (expo `buildModel`/`validate`/`isExcelError`…).
2. `fixtures.makeWorkbook` — a builder that converts **raw intent** (packages, docs,
   state) into the **exact input shape that pipeline expects**.

The assertion logic in the runner is identical; only the adapter differs.

| Sub-project | Pipeline input shape | Fixture adapter | Design-aspects owner | Status |
|-------------|----------------------|-----------------|----------------------|--------|
| **PPP** | `{ PPP, Code }` 2-D grid | `pppMakeWorkbook(pkgs, opts)` | `harness-layout --dashboard ppp` | ✅ RUN |
| **MDL** | `{ sheets:{name:{rows,maxRow}} }` | `mdlMakeWorkbook(opts)` | `harness-layout --dashboard mdl` | ✅ RUN |
| **sub** (TWRP C3B2) | two workbooks `{ mdl, log }` + external `contract` (join) | `subMakeWorkbooks(opts)` | `harness-layout --dashboard sub` | ✅ RUN |
| **action-log** | in-memory JS state (`actions[]`) | `alMakeState(actions)` | `harness-layout --dashboard actionlog` | ✅ RUN (reference `src/pipeline.mjs` scaffold) |
| **english-learning** | `localStorage` snapshot (PWA) | `elMakeStorage(opts)` | `harness-layout --dashboard english` | ✅ RUN (reference `src/pipeline.mjs` scaffold) |

> **`sub` is the most structurally different of the five**: its `buildModel(mdlWorkbook,
> logWorkbook, { contract })` joins a *Master Document List* with a *Submittal Log* and is
> driven by an external contract (`sub/config/pipeline_contract.json`) rather than reading
> lookups from a Code sheet. The adapter hence returns `{ mdl, log, contract }` and the
> assertions exercise `buildModel` / `isExcelError` / `workbookKind` / `inspectWorkbook`.

For **action-log** and **english-learning** the pipeline is not an XLSX importer — it is
application state. The adapter simply builds that state (JS array, or a serialized
`localStorage` blob) and the assertions call the real `src/pipeline.mjs` / state module
the same way. No new runner code required.

---

## Running

```bash
node run.mjs                      # cross-subproject orchestrator (runs all + aggregates)
node harness.mjs                  # run every discovered sub-project
node harness.mjs --subproject ppp # run one
node harness.mjs --subproject mdl
node harness.mjs --subproject actionlog
node harness.mjs --subproject english
node harness.mjs --subproject sub
node harness.mjs --root /path/to/repo   # override repo root
WORKBUDDY_ROOT=/path node harness.mjs   # same override via env
# or via npm scripts:
npm run run            # orchestrator
npm run test:all      # harness --all
npm run test:ppp / test:mdl / test:actionlog / test:english / test:sub
```

The per-subproject runner prints a block + `TIER 1 TOTAL` and writes `test_output/tier1.json`,
exiting `1` on any FAIL. The orchestrator (`run.mjs`) spawns `harness.mjs --all`, reads
`test_output/tier1.json`, prints one combined verdict table, and exits `1` if any sub-project FAILs
(MANUAL does **not** block the gate — it is reported with a reason, never silently passed).

### Current status

```
→ ppp:        17 pass, 0 fail, 1 manual   (RUN — real src/pipeline.mjs)
→ mdl:        17 pass, 0 fail, 3 manual   (RUN — real src/pipeline.mjs)
→ sub:        19 pass, 0 fail, 2 manual   (RUN — real sub/engine/pipeline.js)
→ actionlog:  14 pass, 0 fail, 3 manual   (RUN — reference src/pipeline.mjs scaffold)
→ english:    13 pass, 0 fail, 3 manual   (RUN — reference src/pipeline.mjs scaffold)
   TIER 1 TOTAL: 80 pass, 0 fail, 12 manual
```

All five sub-projects RUN. The only MANUAL items (12 total) are **design-behavior assertions**
(deriveView / scurveAxisMode / errBanner id) that need `render.mjs` and are owned by
`harness-layout` (Tier 2) — by design, the pipeline harness never re-tests layout.

> **Reference scaffolds:** `action-log/src/pipeline.mjs` and `english-learning/src/pipeline.mjs`
> are REFERENCE implementations of the Tier-1 contract so the harness can RUN today for these
> SPA / PWA sub-projects. They carry a `⚠️ REPLACE THIS` header — swap them for the real
> ActionTracker / PWA pipeline logic (the single-file SPA / offline PWA should import the same
> exports). The harness needs no change when you do.

---

## Integration with the AI test engineer

`harness-pipeline` is **Tier 1 — run first**. The `AGENTS.md` regression entry wires it
as the initial gate before any edit:

```bash
node ../harness-pipeline/harness.mjs --all   # Tier 1 (pipeline + design) across all sub-projects
node test/run-regression.mjs                 # Tier 3 (data V-01..V-26) for PPP
node ../harness-layout/harness.mjs --all     # Tier 2 (layout) — owned upstream
```

Verdict contract (reported back after every change):

| Mark | Verdict | Action |
|------|---------|--------|
| ✅ PASS | all Tier-1 automated checks green | safe to proceed to Tier 2/3 |
| ❌ FAIL | ≥1 pipeline/design check failed | fix the code, do not bypass |
| 👀 MANUAL | automated green, some need a human/render | reported with reason; never silently passed |
