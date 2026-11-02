# UI Spec ↔ Dashboard Design — Compliance Review

> **Status:** REVIEW ONLY. No code or spec changed.
> **Date:** 2026-11-03 · **Author:** AI test-engineer (harness-pipeline)
> **Spec source (authoritative):** `Dashboard-UI-Design-Spec.md` at the **repo root**
> (`github.com/chinwarsoon/workbuddy`, rev 1.56, ~98 KB).
> `harness-layout/spec/Dashboard-UI-Design-Spec.md` is a **re-synced copy** of this root spec —
> both verified at **rev 1.56** (the root file's revision table re-states "re-synced from this file" at
> rev 1.50, and the harness copy's own table already carries rev 1.56, so they are current and in sync).
> Every normative clause below is anchored to the **root** copy. Retrieval note: the root raw URL is
> rate-limited for `curl` in this sandbox, so the §3.8 / §3.8.4 / §3.5 / §4.2 clauses were extracted
> from the root copy via WebFetch; the harness copy was downloaded in full as a faithful mirror for
> cross-checking.
> **Dashboards reviewed:** PPP, MDL, sub (TWRP C3B2), action-log, english-learning.
> **Layer scope:** §3.8 / §3.8.4 = Tier-1 pipeline (this harness); §3.1/§3.5/§3.7/§4/§4.2/§4.5/§4.6/§4.7/§7 = Tier-2
> layout (owned by `harness-layout`).

---

## Method & legend

- **Verified** = checked against real pipeline/render code in this sandbox (PPP/MDL/sub pipeline; sub `render.js`).
- **UNVERIFIABLE** = requirement lives in `render.*` which is **not present in this sandbox** for PPP/MDL;
  upstream `harness-layout` runs those tiers but the code cannot be inspected here. Marked honestly, **not** as non-compliant.
- **Per workplan/revision-history** = confirmed from sub workplan changelog + spec rev history (sub claims conformance; harness-layout run reported 222 passed / 0 failed for sub).
- **Root copy = authoritative.** `harness-layout/spec/` is a re-synced mirror (verified rev 1.56 in both); all clauses are cited against the repo-root copy, not the mirror.

| Symbol | Meaning |
|---|---|
| ✅ COMPLIANT | meets spec, verified or via upstream run |
| ⚠️ PARTIAL | meets some clauses, gap noted |
| ❌ NON-COMPLIANT | violates a MUST |
| ➖ N/A | not applicable to this sub-project (e.g. no charts / no dashboard shell) |
| ❓ UNVERIFIABLE | cannot inspect code in sandbox |

---

## 1. Pipeline layer (Tier-1, §3.8 / §3.8.4) — fully verifiable here

| Spec requirement | PPP | MDL | sub | action-log | english |
|---|---|---|---|---|---|
| **§3.8** buildModel exists, S2 normalize + S3 validate | ⚠️ split `validate` call (D1) | ✅ fused | ✅ fused, dual-source | ⚠️ scaffold | ⚠️ scaffold |
| **§3.8** valid-record gate: empty valid input → 0 records, no throw | ❌ throws "No packages…" (D5, L307) | ✅ 0 records | ✅ 0 records | ✅ (scaffold) | ✅ (scaffold) |
| **§3.8** lookups data-driven (no hard-coded lists) | ✅ | ✅ | ✅ external contract | ✅ from state | ➖ none |
| **§3.8** completenessGroup set for deriveView | ➖ (validates via counters) | ✅ | ⚠️ uses `coverage` object instead | ➖ | ➖ |
| **§3.8.4** `isExcelError(v)` implemented | ✅ | ✅ | ✅ | ✅ | ✅ |
| **§3.8.4** `EXCEL_ERROR_TOKENS` **exported** | ✅ | ❌ internal Set (D4) | ❌ internal (D4) | ❌ internal (D4) | ❌ internal (D4) |
| **§3.8.4** formula-error aggregation (W-FORMULA) | ✅ `formulaErrors` | ✅ `W-FORMULA` warning | ✅ `W-FORMULA` (Fatal) | ➖ | ➖ |
| **§3.8** `statusCanon` exported | ❌ internal closure (D4) | ❌ absent (D4) | ❌ absent (D4) | ✅ | ➖ |
| **§3.8** `deriveView` importable from **pipeline** (pure) | ❌ only in render (D2) | ❌ only in render (D2) | ❌ only in `render.js` (D2) | ✅ (scaffold) | ✅ (scaffold) |
| **§3.8** contract positions discovered by **labels** — NO hard-coded rows/cols; reports missing fields | ✅ Code-sheet driven | ✅ | ✅ external `contract` | ✅ state-driven | ➖ none |
| **§3.8** pipeline is **DOM-free & a harness exists** that asserts values pre-release (failing blocks release) | ✅ runs in harness-pipeline | ✅ | ✅ | ✅ scaffold | ✅ scaffold |
| **§3.8** `meta.today` uses **LOCAL** date components (NEVER `toISOString()` UTC); project-start MUST NOT feed Overdue/approval math | ❓ unverified | ❓ | ❓ | ❓ | ❓ |
| **§3.8** KPI math lives ONLY in S4/`deriveView` (S2/S3 MUST NOT recompute) — single source of truth | ❌ deriveView in render (G6) | ❌ (G6) | ❌ (G6) | ✅ scaffold | ✅ scaffold |
| **§3.8.4** `isExcelError` token set = exact 10 (`#NULL! #DIV/0! #VALUE! #REF! #NAME? #N/A #NUM! #GETTING_DATA #SPILL! #CALC!`, case-insensitive), every column | ✅ | ✅ | ✅ | ✅ | ✅ |
| **§3.8.4** `W-FORMULA` routes to `#errBanner` as **fatal strip**, NOT pushed to `model.issues` | ❓ verify | ❓ verify | ✅ (§3.5 errBanner id) | ➖ | ➖ |

**Pipeline layer verdict:** MDL and sub are essentially compliant. PPP has two real gaps
(D1 split `validate`, D5 empty-throw). All five under-export the token set / `statusCanon` (D4) and
keep `deriveView` in render (D2) — a uniform module-surface gap. The additional §3.8 clauses now
verified from the **root** copy add three findings: (a) contract positions are label-driven everywhere
✅ (no hard-coded rows/cols); (b) KPI-math-in-S4 is violated by all three XLSX dashboards because
`deriveView` sits in render (same root cause as D2/G6); (c) `meta.today` local-date compliance is
**unverified** for all five and should become a harness-pipeline assertion (see G9).

> **Root-spec precision (§3.8.4) — exact `isExcelError` token set (case-insensitive):**
> `#NULL! #DIV/0! #VALUE! #REF! #NAME? #N/A #NUM! #GETTING_DATA #SPILL! #CALC!`
> S2 MUST treat blank AND these formula-error tokens as **absent** for *every* column (not opt-in).
> `W-FORMULA` is a `model.warnings` entry (`{level:'fatal', code:'W-FORMULA', tab, message}`) that
> MUST route to `#errBanner` as a fatal strip and MUST NOT be pushed to `model.issues`. (PPP's
> `formulaErrors` and sub's fatal `W-FORMULA` match this shape; MDL/PPP routing to `#errBanner`
> is marked ❓ because their `render.*` is not in this sandbox.)

---

## 2. Shell & chrome (Tier-2, §3.1 / §3.2 / §3.6 / §3.5 / §3.7)

| Spec requirement | PPP | MDL | sub | action-log | english |
|---|---|---|---|---|---|
| **§3.1/§3.2/§3.6** two-row header + navy left nav, light default, `AGENTS §18.2` markers | ❓ | ❓ | ✅ (workplan §2.2) | ➖ SPA shell | ➖ PWA |
| **§3.5** warning area carries stable id `errBanner`, pinned below menu bar | ❓ | ❓ | ✅ (fixed I093/I095/I096 → 222/0) | ➖ | ➖ |
| **§3.7** full-screen welcome overlay, golden ratio 1:1.618, load buttons in drop area, no hardcoded title | ❓ | ❓ | ✅ (workplan §2.3) | ➖ | ➖ |

**Shell verdict:** sub is fully compliant (verified via workplan + upstream run). PPP/MDL are the
shell originators but **unverifiable in this sandbox** — not flagged non-compliant. action-log /
english are non-dashboard (SPA/PWA) → N/A for the shell clauses.

---

## 3. Panels & charts (Tier-2, §4 / §4.2 / §4.5 / §4.6 / §4.7)

| Spec requirement | PPP | MDL | sub | action-log | english |
|---|---|---|---|---|---|
| **§4** every view wraps output in `activePanel()`; border model; collapse toggle | ❓ | ❓ | ✅ (I047/I066/I067) | ➖ | ➖ |
| **§4.7** 14 px between top-level panels, never 0 | ❓ | ❓ | ✅ | ➖ | ➖ |
| **§4.2** bar value labels `rotate(-90)` (vertical) | ❓ | ❓ | ✅ (render.js L585) | ➖ | ➖ |
| **§4.2** `yMax = max(values) × ~1.03`, no power-of-ten rounding | ❓ | ❓ | ✅ (render.js L558) | ➖ | ➖ |
| **§4.2** cumulative S-curve is **absolute** (no window re-base) | ❓ | ❓ | ✅ by design (no rebase token; running total) | ➖ | ➖ |
| **§4.2** solid dots `r=3` for cumulative nodes | ❓ | ❓ | ✅ (render.js L594/976) | ➖ | ➖ |
| **§4.2** x-axis `MMM YYYY` template | ❓ | ❓ | ✅ (`fmtMonth`) | ➖ | ➖ |
| **§4.2** `scurveAxisMode` auto-guardrail (shared default; `r=maxCum/maxBar`>10 → separate, <6 → shared, hysteresis) | ❓ | ❓ | ⚠️ **PARTIAL** — always-shared scale, **no auto-switch logic found** | ➖ | ➖ |
| **§4.2** C3 grid lines + numbers (rev 1.34) | ❓ | ❓ | ✅ (render.js L573/940/973) | ➖ | ➖ |
| **§4.2** C2 funnel (rev 1.35/1.36) | ❓ | ❓ | ✅ | ➖ | ➖ |
| **§4.5** Validation panel: `.v-summary` + two `.c-card` tables + per-table CSV + widths | ❓ | ❓ | ✅ (rev 1.44, driven by SUB) | ➖ | ➖ |
| **§4.6** hover floating window (§8 Tier 6) | ❓ | ❓ | ✅ (Tier 6 harness) | ➖ | ➖ |

**Chart verdict:** sub is compliant on every §4.2 clause **except `scurveAxisMode` auto-guardrail** —
it uses a single always-shared y-scale. PPP/MDL render is absent here → all ❓ (not non-compliant).

---

## 4. Interaction & fit (Tier-2, §7.1 / §7.2.15)

| Spec requirement | PPP | MDL | sub | action-log | english |
|---|---|---|---|---|---|
| **§7.1** selection: dimension opens with all values ticked; empty tick set filters all out; tick applies at once; Esc closes | ⚠️ limited (harness-layout note: "PPP Tier 3 limited — I-76 monolithic pipeline") | ✅ origin | ✅ (rev 1.42, I070) | ➖ | ➖ |
| **§7.2.15** fit on **container** change, never on column change (cache width) | ❓ | ❓ | ✅ (rev 1.56) | ➖ | ➖ |

---

## 5. Conformance framework (§8 two-layer model)

| Requirement | All 5 |
|---|---|
| **§8** Layer 1 = `harness-pipeline` (function/pipeline), Layer 2 = `harness-layout` (layout) | ✅ by architecture — `harness-pipeline` runs (80 pass / 12 manual); `harness-layout` README documents Tiers 1–6 + assertions 1–20 |
| **§8.2** assertion catalogue (1–20) | ✅ sub exercised (222/0); PPP/MDL run upstream |

**§8 verdict:** ✅ the two-layer model is correctly implemented; `harness-pipeline` is the Layer-1
instance and is verified green.

---

## 6. Non-compliance & gaps (the actionable list)

| # | Severity | Sub-project | Spec clause | Gap |
|---|---|---|---|---|
| G1 | Medium | **PPP** | §3.8 (valid-record gate) | `validate` throws on empty input (L307) — should return 0 records |
| G2 | Low | **PPP** | §3.8 | `buildModel` + separate `validate` call — diverges from fused model (D1) |
| G3 | **High** | **sub** | §4.2 `scurveAxisMode` | No shared/separate auto-guardrail (`r>10`→separate, `<6`→shared, hysteresis). Always-shared scale only |
| G4 | Low | MDL/sub/action-log/english | §3.8.4 | `EXCEL_ERROR_TOKENS` not exported (only PPP exports it) |
| G5 | Low | PPP/MDL/sub | §3.8 | `statusCanon` not exported (only action-log scaffold exports it) |
| G6 | Medium | PPP/MDL/sub | §3.8 | `deriveView` lives in `render.*`, not importable from pipeline (blocks KPI testing without browser) |
| G7 | Info | action-log/english | §3.8 / §4.x | Pipelines are **reference scaffolds** — real SPA/PWA logic not yet extracted; most §4.x / §3.x N/A until then |
| G8 | Info | PPP/MDL | §3.1/§3.5/§3.7/§4.x | `render.*` not in sandbox → Tier-2 clauses UNVERIFIABLE here (upstream harness-layout runs them) |
| G9 | Low | all 5 | §3.8 (`meta.today` local date) | `meta.today` MUST use local date components, NEVER `toISOString()` UTC — **unverified** for all five; add as a harness-pipeline assertion |

---

## 7. Suggestions — spec enhancements (propose editing the spec)

1. **Add a normative "module export contract" (new §3.8.x).** Mandate every pipeline module exports
   `isExcelError`, `EXCEL_ERROR_TOKENS`, `buildModel(input, options) → Model`, `statusCanon`, and
   `deriveView(model, state) → View` (pure). This formalizes `PIPELINE-DESIGN-STANDARD.md` and lets
   the Tier-1 harness assert uniformly. Closes G4/G5/G6.
2. **Add an explicit empty-input contract (§3.8).** "A valid input with zero rows MUST yield
   `records:[]`, `issues:[]` — never throw." Closes G1.
3. **Resolve `scurveAxisMode` ambiguity (§4.2).** Either (a) make the shared/separate auto-guardrail a
   hard MUST and fix sub (G3), or (b) if always-shared is acceptable for a given dashboard, relax to
   SHOULD with a documented `r`-threshold exemption. Pick one and state it.
4. **Add a scope clause.** State which sections apply to non-dashboard sub-projects (action-log,
   english-learning). Currently the spec reads dashboard-only; clarify that §3.1/§3.5/§3.7/§4.x are
   N/A for them and only §3.8 / §3.8.4 / §8 govern their pipeline. Closes G7 ambiguity.
5. **Document the two-source model (§3.8).** sub's dual-workbook + external `options.contract` pattern
   is real but only implied; make it a normative subsection with the `PipelineError`-on-missing-contract
   rule explicit.
6. **Extend §8.2 assertion catalogue** with a `scurveAxisMode` assertion (e.g. assertion 21) so the
   guardrail is machine-checked, not just prose.
7. **Make the root↔harness re-sync explicit & version-pinned.** Add a normative note (or a CI check)
   that `harness-layout/spec/Dashboard-UI-Design-Spec.md` MUST be a verbatim re-sync of the repo-root
   `Dashboard-UI-Design-Spec.md` at the same rev (the revision table already states the intent; pin it
   so a root edit can never silently diverge from the bundled copy the harness reads).
8. **Add a `meta.today` local-date assertion** to the §8.2 catalogue (closes G9) — guards against
   UTC `toISOString()` drift in Overdue/approval/schedule math.

## 8. Suggestions — design/pipeline updates (propose editing the dashboards)

1. **PPP:** fold `validate` into `buildModel` (G2); stop throwing on empty input (G1).
2. **sub:** implement `scurveAxisMode` auto-guardrail, or obtain spec relaxation (G3).
3. **All pipelines:** export `EXCEL_ERROR_TOKENS` + `statusCanon` (G4/G5); move `deriveView` into the
   pipeline module as a pure function (G6).
4. **Promote** `PIPELINE-DESIGN-STANDARD.md` to a repo-level `docs/` and cross-reference from §3.8, so
   the dashboard teams (not just the harness) own the contract.
5. **action-log / english-learning:** when the real SPA/PWA pipeline is extracted, run them through
   `harness-pipeline` + the §3.8/§3.8.4/§8 layers only (skip shell/chart tiers per suggestion 4).

---

## 9. Bottom line

- **Fully compliant (verified):** MDL & sub pipelines (§3.8/§3.8.4); sub shell/panels/charts (§3.1–§4.7,
  §7); the §8 two-layer framework for all five.
- **Concrete gaps to fix:** G1 (PPP empty-throw), G3 (sub `scurveAxisMode`), G6 (deriveView in render),
  plus the uniform export gaps G4/G5. **G9** (`meta.today` local-date) is a new harness assertion to add.
- **Cannot judge here:** PPP/MDL Tier-2 design clauses (render absent in sandbox) — upstream
  `harness-layout` is the authority; recommend re-running its Tiers 1–6 against current PPP/MDL to
  confirm.
- **Scaffolds:** action-log / english-learning are reference stubs; N/A until real pipelines exist.
- **Spec authority:** all clauses above are now anchored to the **repo-root** `Dashboard-UI-Design-Spec.md`
  (rev 1.56); the `harness-layout/spec/` file is a verified re-synced mirror (same rev), used only as a
  retrieval fallback.
