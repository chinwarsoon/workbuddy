# harness-layout — Issue Log

- Project: `harness-layout` (shared layout / visual evaluation harness; AGENTS.md §1.2)
- Canonical location: `harness-layout/log/issue_log.md` (AGENTS.md §26.12, §27)
- ID scheme: `Ixxx` — project-wide sequence, unique across the active log set (§26.12)
- Log format: canonical — 9-field record (§26.2), five ordered sections (§26.11)
- Created: 2026-10-31
- Owner: pending

## Legend

### Status codes (§26.3)

| Code | Marker | Meaning |
| `OPEN` | 🔴 | Not yet addressed; active in queue |
| `IN_PROGRESS` | ⏳ | Approved work is currently being implemented |
| `DEFERRED` | ⏸️ | Moved to a future phase with rationale |
| `DEFERRED_STUDY` | 🔷 | More investigation required before a decision |
| `DEFERRED_REVIEW` | 🔶 | Requires discussion or review before action |
| `WONT_IMPLEMENT` | ⛔ | Explicitly rejected or out of scope, with rationale |
| `OPEN_PARTIAL` | 🟠 | Partial progress exists; closure criteria remain |
| `APPROVED` | 🟢 | Tasks defined and approved; implementation not started |
| `RESOLVED` | ✅ | Fix implemented and verified; documentation alignment may remain |
| `ALIGNED` | 📐 | Resolved and required workplan / docs synchronized |

### Severity markers (§26.4)

| Marker | Severity | Meaning |
| 🔴 | Critical | Blocks phase completion |
| 🟠 | High | Significant impact; workaround needed |
| 🟡 | Medium | Moderate impact; can proceed |
| 🟢 | Low | Minor, cosmetic, or non-blocking |
| 🔷 | Deferred | Moved to future phase; not currently blocking |

## Status summary

| Code | Count |
| `OPEN` | 1 |
| `IN_PROGRESS` | 0 |
| `DEFERRED` | 0 |
| `DEFERRED_STUDY` | 0 |
| `DEFERRED_REVIEW` | 0 |
| `WONT_IMPLEMENT` | 0 |
| `OPEN_PARTIAL` | 0 |
| `APPROVED` | 0 |
| `RESOLVED` | 3 |
| `ALIGNED` | 0 |
| **Grand total** | **4** |

## Priority resolution sequence

| Priority | ID | Title | Severity | Status |
| 1 | I001 | Harness-layout bundled spec is not trimmed to layout-only scope | 🟡 Medium | `OPEN` |
| 2 | I002 | Harness does not validate the §4.6 hover floating window | 🟡 Medium | `RESOLVED` |
| 3 | I003 | Filter round-trip does not restore the discipline filter, causing a false status-bar failure | 🟡 Medium | `RESOLVED` |
| 4 | I004 | C1 S-curve reference-line selectors are not scoped to the C1 panel | 🟡 Medium | `RESOLVED` |

## Issues

| ID | Date | Phase | Severity | Title | Description | Status | Tasks | Resolution |
|----|------|-------|----------|-------|-------------|--------|-------|------------|
| I001 | 2026-10-31 | — | 🟡 Medium | Harness-layout bundled spec is not trimmed to layout-only scope | `harness-layout/spec/Dashboard-UI-Design-Spec.md` is a full ~144 KB copy of the design spec, not trimmed to layout-relevant material. The harness is defined as a layout / visual evaluation harness (`harness-layout/README.md:7`) whose tiers (1–4c) validate only shell geometry, zones, table render geometry and visual tokens — yet the bundled spec carries the source spec's data-definition, calculation and business-rule chapters that the harness never checks. This conflicts with the principle that harness-layout should validate layout-related details only; the non-layout content is benign today (ignored by layout tiers) but can mislead or accidentally drive a non-layout check if one is added. Decision context: in the recent review, the data-source / calculation table for the Analytical Bottleneck KPI strip (workplan §4.9) was deliberately kept OUT of this harness spec (verified: 0 hits for `daysPastTarget` / `firstApprovalDate` / `resubmitted ÷ total submissions`), and only layout / geometry notes (table-border model `:has(.ds-split)`, rounding, card contract — spec revisions 1.48 / 1.49) were synced in. Recommended fix: trim the bundled spec to layout-only — keep §4 layout rules (card contract, table geometry, column widths, rounding) and the harness tier / catalogue, and drop or relocate the data / content chapters. Should be done as a separate cleanup, not bundled with content edits. | `OPEN` | — | — |
| I002 | 2026-11-01 | — | 🟡 Medium | Harness does not validate the §4.6 hover floating window | The layout harness (tiers 1–4c plus the Tier 5 chart-structure checks) never exercised the §4.6 hover floating window. It asserts nothing about `.chart-tip`, `data-tip`, `role="tooltip"`, `cursor:crosshair`, the `.chart-snap` line, the 4-edge clamp, or the below-card KPI window, and C2 / C4 are absent from the harness config entirely. Consequently the C2 hover-window style defect (sub issue I092 — the series row detached the swatch from its label and the window lacked `role="tooltip"`) shipped undetected: the harness would not have caught it and it does not validate any of the T-D1–T-D5 hover-window work. Decision: add a dedicated **Tier 6 (§4.6 hover window)** check to `harness.mjs` (`lintHoverWindow` + dispatch) with a `hover` config block in `checks/sub.mjs`. Per chart board (C1–C4) and KPI card it asserts the host is focusable with `aria-describedby` pointing at a `role="tooltip"` window, carries the expected cursor affordance (`crosshair` for charts, `help` for KPI), nearest charts expose a `.chart-snap` line, and a hover/tap reveals the window which hides on pointer-leave; the C2 `.ct-l` swatch+label grouping is guarded where configured. Run with `node harness.mjs --dashboard sub --tier 6`. | `RESOLVED` | harness U002 | Added `lintHoverWindow` + Tier 6 dispatch in `harness.mjs`; added `hover` config to `checks/sub.mjs`; documented in README/SKILL. Tier 6 is a **general side-bar exploration**: it visits every `[data-page]` menu item and discovers every hover-window host via `[aria-describedby]` → `role="tooltip"` (C1 `.scurve`, C2 `.c2-stack`, C3 `.c3-card`, C4 `.c4-chart`, KPI `.kpi-card` on any page), then clicks in-page button switches (`.seg`, tabs, toggles) and re-scans. This replaced the earlier hard-coded Analytical/Overview navigation that skipped KPI. Closes the coverage gap that let sub issue I092 ship. |
| I003 | 2026-11-02 | — | 🟡 Medium | Filter round-trip does not restore the discipline filter, causing a false status-bar failure | The harness filter round-trip (the `filterTriggerSelector` branch in `harness.mjs`) deselects every discipline, selects one, asserts the narrowed count, and then never restores "all". Every later check therefore measured the FILTERED view, so the status-bar total check compared the filtered DOM total against the unfiltered ground truth (`gt.totalPlanned` = 7631) and reported `FAIL status bar shows total count`, although the dashboard rendered the total correctly. The companion `select` branch already restored the filter with `selectOption('')`; only this branch was missing it. Surfaced as sub issue **I094**. Decision: a check MUST restore the state it changes — the same rule the I-95 resize check already documents. | `RESOLVED` | — | Restored "all disciplines" after the round-trip: re-open the filter, check the `.tf-all` checkbox when it is unchecked, press Escape, and wait 250 ms. This matches the `select` branch. Verified: the sub run went from 216 passed / 6 failed to 222 passed / 0 failed. |
| I004 | 2026-11-02 | — | 🟡 Medium | C1 S-curve reference-line selectors are not scoped to the C1 panel | The C1 checks counted `.sc-ref-start` / `.sc-ref-today` across the whole page and asserted `count === 1`. The C2 charts (Submission Flow and Delay) also emit reference lines with the same classes, so the count was 2 and both checks failed (`FAIL C1 Start reference line present`, `FAIL C1 Today reference line present`) although C1 rendered both lines correctly. The reference-line labels passed, which made the failure look like a regression of sub issue I036. Not a product defect. Surfaced as sub issues **I097** and **I098**. | `RESOLVED` | — | Scoped the selectors to the C1 panel in `checks/sub.mjs`: `refStartSelector: '.scurve .sc-ref-start'` and `refTodaySelector: '.scurve .sc-ref-today'`. Verified: both C1 reference-line checks now pass (222 passed / 0 failed). |
