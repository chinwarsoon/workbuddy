# Pipeline Design Standard (Tier-1) — Dashboard Sub-projects

> **Status:** DRAFT for review. No pipeline code has been changed.
> **Owner:** `harness-pipeline` (the conformance test layer). May be promoted to a repo-level
> `docs/` spec later.
> **Scope:** Defines the *single* pipeline contract every dashboard sub-project must satisfy,
> so the Tier-1 harness (`harness-pipeline`) can test all of them with one runner.
> **Anchored to:** UI Design Spec §3.8 (pipeline build plan / valid-record gate), §3.8.4
> (isExcelError / W-FORMULA), §4.2 (chart guardrails), §3.5 (errBanner stable id), §8
> (conformance / testing).

---

## 1. Why a standard

Five dashboard sub-projects exist today, all with a pipeline module:

| Sub-project | Pipeline module | Input shape | Notes |
|---|---|---|---|
| **PPP** | `PPP/src/pipeline.mjs` (real) | `{ PPP, Code }` 2-sheet grid | `buildModel` + **separate** `validate` |
| **MDL** | `MDL/src/pipeline.mjs` (real) | `{ sheets:{name:{rows,maxRow}} }` | fused S2+S3 |
| **sub** | `sub/engine/pipeline.js` (real) | dual `{ mdlWb, logWb }` + `options.contract` | fused S2+S3, **external contract** |
| **action-log** | `action-log/src/pipeline.mjs` (scaffold) | JS state `{ actions[], lookups }` | fused S2+S3 |
| **english-learning** | `english-learning/src/pipeline.mjs` (scaffold) | localStorage `{ vocabulary[], progress{} }` | fused S2+S3 |

They share ~80% of intent but diverge on the 20% that the harness must rely on. This standard
locks that 20% so (a) the harness can assert the same contract everywhere, and (b) a new
dashboard drops in by writing one `checks/<name>.mjs` + one adapter, **no core change**.

---

## 2. The canonical 4-stage pipeline (maps to spec §3.8)

Every dashboard pipeline is a linear **S1 → S2 → S3 → S4** flow. The stage names come from the
MDL contract comments (S2 normalise, S3 validate, S4 deriveView) and align with spec §3.8's
"valid-record gate".

| Stage | Name | Responsibility | Side effects |
|---|---|---|---|
| **S1** | Load | Raw input → normalized `PipelineInput` via an **adapter** (grid / sheets / state / storage) | none |
| **S2** | Normalise | Resolve field→column maps, types, lookups, contract. Coerce cells (date/number/text). **Blank and Excel-error token are the SAME absent state** (§3.8.4) | none |
| **S3** | Validate | Per-record + structural rules → `issues[]`. Rule text + severity read from **data** (Code sheet or `options.contract`), never hard-coded | none |
| **S4** | Derive view | `deriveView(model, state)` → `View` (KPIs, grouped counts, chart series). Pure; **no DOM** | none |

**Rule of the standard:** S4 (`deriveView`) and the token list (`isExcelError` / `EXCEL_ERROR_TOKENS`)
MUST be importable from the **pipeline module** — not only from `render.*`. Today S4 lives in
`render.{mjs,js}` for PPP/MDL/sub, which makes KPI math untestable without a browser. The
harness currently marks those assertions `MANUAL` for exactly this reason.

---

## 3. Mandatory module exports

Every pipeline module MUST export:

| Export | Signature | Purpose | Current gap |
|---|---|---|---|
| `isExcelError` | `(v) → boolean` | Detect `#DIV/0!` etc. (§3.8.4) | ✅ all 5 |
| `EXCEL_ERROR_TOKENS` | `string[]` (or `Set`) | The token list, exported | ❌ only **PPP** exports it; MDL/sub/action-log/english keep it internal |
| `buildModel` | `(input, options?) → PipelineModel` | Fused S2 + S3 | ⚠️ PPP splits out `validate`; signature varies (see §5) |
| `statusCanon` | `(s) → string` | Canonicalize status code↔description | ❌ only **action-log** exports it; PPP keeps it an internal closure; MDL/sub absent |
| `deriveView` | `(model, state?) → View` | Pure KPI/chart derivation (S4) | ⚠️ only in `render.*` for PPP/MDL/sub; not in pipeline |
| `PipelineError` | `class extends Error` | Contract/source errors (optional but recommended) | ⚠️ only **sub** has it |
| model.`completenessGroup` | `Set<string>` on the returned model | Codes counting toward data-completeness % | ⚠️ only **MDL** sets it; others compute completeness ad-hoc |

`workbookKind` / `inspectWorkbook` (sub) are **optional** — only for multi-source pipelines.

---

## 4. Canonical `PipelineModel` (buildModel return)

Standardizes what `buildModel` returns, regardless of input shape:

```js
{
  meta: {                       // provenance
    generatedAt: string(ISO),
    asOfDate: string(YYYY-MM-DD),
    projectTitle: string|null,
    dashboardTitle: string|null,
    projectStartDate: string|null,
    sourceNames: string[]        // e.g. ['Master Document List','Submittal Log'] or ['index.html']
  },
  records: [ Record ],          // normalized domain rows (packages / docs / actions / words)
  lookups: {                    // DATA-DRIVEN — never hard-coded lists
    <name>: { items: [{code,label}], codes: Set<string> }
  },
  contract: {                   // discovered config OR supplied options.contract
    columnMap, fieldOrder, errorBlock, reviewRules, ...
  },
  issues: [ Issue ],            // S3 output: errors + warnings (per spec §4.5)
  warnings: [ Issue ],          // top-level structural (W-FORMULA etc.); may overlap issues
  completenessGroup: Set<string> // codes that count toward completeness %
}
```

**Lookups MUST be data-driven.** Two allowed sources, never a hard-coded array:
1. **Discovered** from the input (PPP/MDL read the Code sheet).
2. **Supplied** via `options.contract` (sub reads `pipeline_contract.json`).

When a pipeline requires an external contract and it is absent → throw `PipelineError`
(sub already does this).

---

## 5. `buildModel` call-signature unification

| Sub-project | Current signature | Aligned to standard? |
|---|---|---|
| PPP | `buildModel(result, filename) → { model, vctx }` then **`validate(pkgs, ctx)`** separately | ❌ split |
| MDL | `buildModel(workbook, options) → {…records, issues, warnings…}` | ✅ |
| sub | `buildModel(mdlWb, logWb, options) → {…planned, submissions, issues…}` | ✅ (dual-source) |
| action-log | `buildModel(state) → {…records, issues…}` | ✅ |
| english | `buildModel(storage) → {…records, issues…}` | ✅ |

**Standard:** `buildModel(input, options?) → PipelineModel` with S2+S3 **fused**. PPP must fold
`validate` into `buildModel` (the `{ model, vctx }` split is the only outlier). Multi-source
pipelines (sub) keep extra positional sources but still return one `PipelineModel`.

---

## 6. Canonical `Issue` shape (S3 output)

Today the field names disagree. Standardize:

```js
{
  code: string,                       // e.g. 'V-07', 'W-FORMULA', 'A-DISC'
  severity: 'error'|'warning'|'info'|'fatal',  // normalized, case-insensitive
  message: string,                   // rule text (from data, not hard-coded)
  field: string|null,                // offending source column / field
  value: string|null,                // offending cell value
  sourceTab: string|null,            // tab/sheet/state source
  rownum: number|null,
  docNo: string|null,
  group: string|null,                // data-completeness group
  kind: 'system'|'data'|null         // system = structural, data = row-level
}
```

**Severity vocabulary** (normalized case-insensitively): `error`, `warning`, `info`, `fatal`.
- PPP currently emits `{ sev, msg, pkg, desc, kind }` → migrate to `{ severity, message, sourceTab, … }`.
- MDL/sub emit `{ severity, message, sourceTab, docNo, discipline, field, value }` → already aligned except they use `level:'warn'|'fatal'` on *warnings*; fold `level` into `severity`.

---

## 7. Empty / broken input behavior

| Case | Standard | Current divergence |
|---|---|---|
| Valid input, zero rows | return model with `records:[]`, `issues:[]` (no throw) | MDL/sub/action-log/english ✅; **PPP throws** "No packages…" ❌ |
| Structurally broken (missing required sheet / no contract) | throw `PipelineError` with a code | sub ✅; PPP throws generic `Error`; MDL unguarded |

---

## 8. Tier-1 conformance checklist (what `harness-pipeline` asserts)

Each `checks/<name>.mjs` asserts these against the real pipeline:

- [ ] `isExcelError('#DIV/0!') === true`, `isExcelError('MR') === false`
- [ ] `EXCEL_ERROR_TOKENS` is exported and includes the 10 standard tokens
- [ ] `buildModel` fuses S2+S3 and returns canonical `PipelineModel`
- [ ] valid input → `records.length > 0`, `issues` driven by data (not hard-coded)
- [ ] lookups are read from data/contract (assert `lookups.X.codes` equals a non-constant set)
- [ ] `statusCanon` (where status-bearing) canonicalizes codes↔descriptions
- [ ] empty valid input → 0 records, 0 issues (no throw)
- [ ] ≥2000 rows builds in <5s (perf gate, spec §3.8)
- [ ] `completenessGroup` present and consumed by `deriveView`
- [ ] `deriveView` importable from pipeline (pure) → KPIs computable without browser

(Manual items — chart guardrails `scurveAxisMode` / `rotate(-90)` / `errBanner` stable id — stay
in `harness-layout`, Tier 2, per the two-layer model §8.)

---

## 9. Open decisions for review (please confirm before any code change)

The standard above implies concrete migrations. I have **not** changed any pipeline code.

- **D1 — Fuse `validate` into `buildModel` (PPP).** Aligns PPP with MDL/sub/action-log/english.
  Reverses the `{ model, vctx }` split.
- **D2 — Move `deriveView` into the pipeline module (pure) for PPP/MDL/sub.** Enables the
  harness to test KPIs without a browser (currently MANUAL). `render.*` can still call it.
- **D3 — Normalize `Issue` shape** to `severity` / `message` / `sourceTab` (PPP migrates from
  `sev` / `msg` / `pkg`). Fold MDL/sub `level` into `severity`.
- **D4 — Export `statusCanon` + `EXCEL_ERROR_TOKENS` from every pipeline** (only PPP exports
  the tokens today; only action-log exports statusCanon).
- **D5 — Empty valid input → 0 records (not throw).** PPP must stop throwing on zero packages.
- **D6 — Contract sourcing.** Single-source dashboards discover lookups from input; multi-source
  (sub) requires `options.contract` and throws `PipelineError` if absent. Keep a shared
  `PipelineError` type across all.
- **D7 — Promote this standard** to a repo-level `docs/PIPELINE-DESIGN-STANDARD.md` (so the
  dashboard teams, not just the harness, own it).

---

## 10. Summary of what's already consistent (keep as-is)

- `isExcelError` logic and the 10-token set are effectively identical across all 5.
- "No hard-coded lookup lists" principle already honored by PPP/MDL/sub.
- S2 "blank == Excel-error == absent" already implemented in PPP/MDL.
- The 4-stage mental model (S1–S4) is already the de-facto shape; only the *export surface* and
  *field naming* need unification.
