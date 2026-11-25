# MDL I-136 — Issue Progress panel conformance workplan

## 1. Title and description

Bring the MDL Issue Progress panel into line with `Dashboard-UI-Design-Spec.md` §4.2, §4.6, §6 and §7.2.16. The approved review sample in `MDL/Arch/issue-progress-spec-review.html` is the visual reference. This workplan covers discovery, scope, risk and success criteria. It does not approve code changes. Code starts only after this document is approved.

## 2. Document control

| Field | Value |
|---|---|
| Document ID | WP-MDL-I136 |
| Revision | 0.2 |
| Date | 2026-11-22 |
| Author | CodeBuddy (AI) |
| Status | COMPLETE — implemented and verified 2026-11-22 |
| Issue | I-136 in `MDL/log/issue_log.md` |
| Severity | Medium |
| Related work | I-121 (remaining dashboard gaps) remains open |

### Version history

| Revision | Date | Author | Summary |
|---|---|---|---|
| 0.2 | 2026-11-22 | CodeBuddy (AI) | Workplan complete. P4 implemented the code. P5 fixed the shared-crosshair defect. P6 removed the invalid mode-element write. TL021 and the phase report record verification. |
| 0.1 | 2026-11-22 | CodeBuddy (AI) | Created after the sample review. No production code changed. |

## 3. Object

The object is the Issue Progress panel in the MDL dashboard. It is the combined S-curve and monthly-bar chart built by `renderCurvePanel()` and `combinedProgressSVG()` in `MDL/src/render.mjs`. The panel also owns its period control, Bars toggle, PNG and Copy actions, hover window and attached table.

## 4. Scope summary

| ID | Details | Category | Status | Related phase |
|---|---|---|---|---|
| I-136 | Issue Progress panel does not meet UI spec | UI conformance | OPEN | 11.21, new |

In scope:

- Dynamic Y ticks with a nice-number step and at most seven intervals.
- Legend rows wrapped inside the SVG.
- Dual-scale captions, axis colours and legend axis attribution.
- Bar value labels for every non-zero bar.
- Y maximum filtered by the Bars toggle.
- C1 dual-handle time bar with five presets and stored selection.
- Native attached table with caption, column groups, headers and row headers.
- Full zone borders, square shared corners and C1 header colours.
- Chart hover window, chart/table crosshair, hidden band and snap line.
- Export and print rules for transient hover state.

Out of scope:

- Other dashboard panels.
- Data pipeline changes.
- Shared spec changes.
- Migration of the Arch samples into production.

## 5. Index of content with links

- `MDL/log/issue_log.md` — issue I-136.
- `MDL/Arch/issue-progress-spec-review.html` — approved visual sample.
- `MDL/src/render.mjs` — current panel implementation.
- `MDL/build.mjs` — bundle builder.
- `MDL/MDL-Dashboard.html` — generated offline dashboard.
- `harness-layout/spec/Dashboard-UI-Design-Spec.md` — UI standard.
- `MDL/workplan/reports/` — phase reports.
- `MDL/log/update_log.md` and `MDL/log/test_log.md` — required revision and test records.

## 6. Dependencies and related tasks

- No code task starts before this workplan is approved.
- I-121 stays open. This workplan closes only the Issue Progress items inside its scope.
- The browser check uses the installed Playwright Chromium runtime. No project dependency changes are planned.
- The build writes `MDL/MDL-Dashboard.html`. That write needs explicit approval in the code proposal.

## 7. Evaluation and alignment with existing architecture

Current code keeps chart state in module variables such as `scurveWin`, `curveShowBars` and `curveLastScaleMode`. The sample uses one state object per card. The production change must keep one shared state model for the single live panel. It must not add a second data source.

The panel already has one chart card, one control cluster and one export path. The change should extend those structures. It should not create a separate renderer for the attached table. The chart and table must share one month array and one column state.

The sample proves the target CSS geometry in a real browser. Production must reuse the same geometry rules without importing the sample file.

## 8. Implementation phases

### Phase 1 — Chart geometry and axes

Timeline: after approval, first implementation step.

Milestones and deliverables:

- T11.21.1 dynamic Y ticks.
- T11.21.2 wrapped in-SVG legend.
- T11.21.3 dual-scale mitigation and bar labels.

What will be updated or created:

- `MDL/src/render.mjs`.
- `MDL/MDL-Dashboard.html` after the approved build.
- `MDL/log/update_log.md` and `MDL/workplan/reports/` after the work is done.

Risks and mitigation:

- Tick density can change the plot height. Keep the 300-unit plot height.
- Long legend labels can overflow. Use the fixed row rule from the sample.
- Active scale mode can flicker. Keep the existing hysteresis.

Potential future issues:

- A separate issue may be needed if another dashboard adopts the same tick helper.

Success criteria:

- Nice step from `{1, 2, 2.5, 5} × 10^k`.
- At most seven intervals.
- Every legend row stays inside the SVG.
- Every non-zero bar shows its value.
- `maxY` excludes bars when Bars is off.

References:

- `Dashboard-UI-Design-Spec.md` §4.2.
- `MDL/Arch/issue-progress-spec-review.html`.

### Phase 2 — C1 time bar and attached table

Timeline: after Phase 1 validation.

Milestones and deliverables:

- T11.21.4 dual-handle time bar and five presets.
- T11.21.5 native attached table with spacer column.
- T11.21.6 zone borders and header colours.

What will be updated or created:

- `MDL/src/render.mjs`.
- `MDL/MDL-Dashboard.html` after the approved build.
- Phase report under `MDL/workplan/reports/`.

Risks and mitigation:

- The current panel has no attached table. Add it inside the existing chart board.
- The table must share the chart's month columns. Use one column index.
- Presets must not create a Reset control. Use the five named presets only.

Potential future issues:

- Table windowing is not in scope.

Success criteria:

- One dual-handle track with month ticks.
- Presets `6M`, `12M`, `24M`, `YTD` and `All`.
- One saved preset selection.
- Native `<table>` with caption, column groups, headers and row headers.
- Shared axis, plot and table borders with square shared corners.

References:

- `Dashboard-UI-Design-Spec.md` §4.2 rev 1.66 and rev 1.81.
- `MDL/Arch/issue-progress-spec-review.html`.

### Phase 3 — Hover, crosshair, export and print

Timeline: after Phase 2 validation.

Milestones and deliverables:

- T11.21.7 chart hover window and delegated binder.
- T11.21.8 chart/table column sync, hidden band and snap line.
- T11.21.9 export and print neutralisation.

What will be updated or created:

- `MDL/src/render.mjs`.
- `MDL/MDL-Dashboard.html` after the approved build.
- `MDL/log/test_log.md` after validation.

Risks and mitigation:

- The band and snap line must use computed display, not inline empty values.
- The tooltip must stay closed while the cursor is in the table.
- PNG and Copy must strip transient state.

Potential future issues:

- I-121 may be closed later if its remaining items are covered by this work.

Success criteria:

- One `.chart-tip` per chart board with four-edge clamping.
- Touch tap-to-show and keyboard focus parity.
- Active column shown in both chart and table.
- Band and snap line visible only when active.
- Print and export contain no hover state.

References:

- `Dashboard-UI-Design-Spec.md` §4.2 rev 1.75 and §4.6.
- `Dashboard-UI-Design-Spec.md` §7.2.16.

### Phase 4 — Validation and closure

Timeline: after Phase 3 implementation.

Milestones and deliverables:

- T11.21.10 build and browser validation.
- T11.21.11 issue closure and log updates.

What will be updated or created:

- `MDL/MDL-Dashboard.html`.
- `MDL/log/issue_log.md`.
- `MDL/log/update_log.md`.
- `MDL/log/test_log.md`.
- One phase report under `MDL/workplan/reports/`.

Risks and mitigation:

- Existing harness failures are baseline issues. Compare against the baseline before attributing a failure to I-136.
- The full-workbook render can hit a jsdom heap limit. Use the synthetic harness plus Chromium for the live panel.

Potential future issues:

- A follow-up issue may be needed for other panels if the same fixes are required there.

Success criteria:

- Chromium checks at 1366 × 768 and 1920 × 1080.
- No new console errors.
- Harness results compared with baseline.
- Issue I-136 moved to RESOLVED with task and update references.
- Workplan status changed to COMPLETE.

References:

- `MDL/test/`.
- `harness-layout/`.
- `MDL/Arch/issue-progress-spec-review.html`.

## 9. Approval gate

No source file may be changed until this workplan is approved. The next proposal will name the exact code edits and the build command. Approval of this workplan does not approve the code change by itself.

## 10. Completion record

| Field | Value |
|---|---|
| Status | COMPLETE |
| Approval | P4 approved 2026-11-22 by chinwarsoon. P5 approved 2026-11-22 by chinwarsoon. P6 approved 2026-11-22 by chinwarsoon. |
| Phase 1 | COMPLETE — T11.21.1 to T11.21.3. Dynamic nice ticks, wrapped in-SVG legend, fixed right reserve, dual-scale styling, bar labels and corrected Y-max filter. |
| Phase 2 | COMPLETE — T11.21.4 to T11.21.6. C1 dual-handle time bar, five presets, saved preset selection, native attached table and shared borders. |
| Phase 3 | COMPLETE — T11.21.7 to T11.21.9. Hover window, chart and table crosshair sync, hidden band and snap line, export and print neutralisation. |
| Phase 4 | COMPLETE — T11.21.10 and T11.21.11. Build and validation passed. Issue closure and logs updated. |
| Validation | TL021. Syntax and lint PASS. Build 296,804 B. Pipeline 96 passed / 7 failed. Full harness 201 passed / 10 failed / 2 advisory / 22 skipped. Tier 5 36 passed / 0 failed. Chromium at 1366 × 768 and 1920 × 1080 has no console errors. |
| Report | `MDL/workplan/reports/MDL-I136-Issue-Progress-Report-2026-11-22.md` |
| Closure | I-136 set to RESOLVED in `MDL/log/issue_log.md` revision 1.61 and `MDL/log/issue_log.md` revision 1.17. |
