# Wave 4.1 — Discipline Correction (D37) Report

| Field | Value |
|---|---|
| Title | TWRP C3B2 Submittal Dashboard — Wave 4.1 Discipline Correction |
| Document ID | SUB-REPORT-W4.1-001 |
| Revision | 1.0 |
| Date | 2026-10-26 |
| Author | CodeBuddy (AI) |
| Status | ✅ COMPLETE |
| Related | Workplan §7 Wave 4.1; `issue_log.md` I047, I048; `update_log.md` U016; `test_log.md` TEST-017 |

## Index
- [Objective and scope](#objective-and-scope)
- [Methodology and environment](#methodology-and-environment)
- [Changes](#changes)
- [Test cases and results](#test-cases-and-results)
- [Success criteria](#success-criteria)
- [Files modified](#files-modified)
- [Recommendations](#recommendations)
- [Lessons learned](#lessons-learned)

## Objective and scope
Correct the Discipline dimension (workplan D37). A submission must take its discipline from the
Master Document List join on `Document No.`, never from an inline Excel section title. Unlinked
submissions (document numbers missing from the MDL) must keep a visible, counted `Unknown`
discipline and must be flagged. Covers tasks T15.1 (engine) and T15.2 (UI filter).

## Methodology and environment
- Engine: `node --test` over `test/pipeline.test.mjs` and `test/render.test.mjs` (Node test runner).
- Source workbooks: `TWRP C3B2 - Master Document List.xlsx` and `TWRP C3B2 - Document Submittal Log.xlsx`.
- `today` fixed at `2026-10-24` for deterministic delay math, matching the prior runs.

## Changes
- **T15.1 (`sub/engine/pipeline.js`)** — `parseSubmittals` no longer tracks a section discipline. A
  row with blank `S.No.` and `Document No.` whose `Prolog Subject` matches a discipline is skipped as
  layout. Each submission starts with an empty discipline, and the MDL join sets it from
  `matches[0].discipline` (matched and ambiguous) or `Unknown` (orphan, which also raises V-29).
- **T15.2 (`sub/engine/render.js`, `sub/engine/dashboard.js`)** — `Unknown` added to the Discipline
  filter list (`dashboard.js:145`), the default set (`dashboard.js:267`) and the `deriveView`
  fallback (`render.js:11`), so all 183 rows stay counted.

## Test cases and results
| Case | Scope | Result |
|---|---|---|
| TEST-017 | `node --test test/pipeline.test.mjs test/render.test.mjs` | PASS — 33/33 (12 pipeline + 21 render) |
| New T15.1 pipeline test | Each submission's discipline matches its MDL plan row (matched/ambiguous = `matches[0].discipline`; orphan = `Unknown` + V-29) | PASS |
| Render test "derives all overview measures from one shared active set" (previously failed) | `totalSubmissions` 133 and `active.length` 183 after `Unknown` stays counted | PASS |
| Render test "global filters accept several values at once" (previously failed) | Default set + explicit set both equal 183 once `Unknown` is included | PASS |

Detailed counts on the current workbooks: 183 submissions → 166 matched, 16 orphan (`Unknown`),
1 ambiguous; 94 rows were reclassified away from the wrong section-header discipline.

## Success criteria
- [x] Submission discipline derived from the MDL join on `Document No.` (not the log section title).
- [x] Orphan submissions get `Unknown` and raise V-29.
- [x] `Unknown` is a normal, counted filter value (not dropped by the default set).
- [x] Pipeline and render suites pass (33/33); C3 Discipline view matches the MDL join.
- [x] I047 and I048 resolved.

## Files modified
- `sub/engine/pipeline.js` (T15.1 discipline join)
- `sub/engine/render.js` (T15.2 `deriveView` `Unknown` fallback)
- `sub/engine/dashboard.js` (T15.2 filter list + default set)
- `sub/test/pipeline.test.mjs` (new T15.1 discipline test)
- `sub/workplan/Sub-Dashboard-Workplan.md` (revision 2.25; §7 tasks and Wave 4.1 COMPLETE)
- `sub/log/issue_log.md` (revision 0.43; I047, I048 RESOLVED)
- `sub/log/update_log.md` (revision 1.10; U016)
- `sub/log/test_log.md` (revision 1.3; TEST-017)

## Recommendations
- Re-derive the §3.3.2 discipline list from the MDL after this fix; the earlier counts came from the
  wrong section-header rule.
- Consider a harness Tier 5 C3 check that asserts the discipline split equals the MDL join.

## Lessons learned
- A filter default built only from plan rows silently drops unlinked submissions; any non-plan
  discipline value (here `Unknown`) must be added to the default set at the same time it is emitted.
