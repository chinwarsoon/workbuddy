# UX Enhancement Summary for Dashboard UI Design Spec

## Overview
Five professional UI/UX enhancements for enterprise engineering dashboards handling S-curves and 20+ month timelines, all aligned with the existing `Dashboard-UI-Design-Spec.md` and compatible with `harness-layout` checks.

## Enhancements (all target §4.2 Combined chart panels)

### 1. Sticky / Pinned Header Column
- **What:** `position: sticky` on column 1 `<th>` elements in the S-curve attached table
- **Spec location:** After table colgroup contract (after line 916)
- **CSS:** `position: sticky; left: 0; z-index: 10; background: var(--surface); border-right: 1px solid var(--border)`
- **Rationale:** Metric names remain visible during 24+ month horizontal scrolling
- **Harness check impact:** Compatible — harness checks `position: sticky` on thead header rows only; this applies to tbody `<th>` metric labels (unmeasured, won't fail)

### 2. Interactive Legend Toggling (Progressive Disclosure)
- **What:** Clickable legend items that fade/hide specific series on both SVG chart and table rows
- **Spec location:** After in-SVG legend clause (after line 802)
- **CSS:** `.legend-swatch[aria-pressed="true"]{opacity:.35}`
- **Rationale:** Manage 8+ series (Planned, Forecast, Actual First, Actual Resub + cumulatives) by isolating views
- **Harness check impact:** Compatible — harness verifies in-SVG legend position; no interactivity constraints

### 3. Quick-Jump Horizon Presets & Scroll Minimap
- **What:** Four preset buttons ([Q3 2026], [Next 6M], [YTD], [Full Horizon]) + minimap drag-thumb at chart base
- **Spec location:** After control cluster clause (after line ~867)
- **CSS:** Preset buttons 12px/600; minimap: `--muted` track, `--accent` thumb, 20px high
- **Rationale:** Instant range presets + contextual overview without manual scrolling
- **Harness check impact:** Compatible — harness checks period window control existence; no specific button/minimap checks

### 4. Micro-Variances Conditional Formatting
- **What:** Subtle highlight (`color:var(--amber)` / `color:var(--danger)` + 1px bottom border) when Actual lags Plan by ≥15%
- **Spec location:** After table colgroup contract (after line 916)
- **CSS:** `.td.sc-variance{color:var(--amber);border-bottom:1px solid var(--amber)}`
- **Rationale:** Turn raw numbers into actionable exceptions while preserving Clean Industrial aesthetic
- **Harness check impact:** Compatible — harness checks `overflow:hidden` + `text-ellipsis` on data cells; new `color`/`border-bottom` properties don't conflict

### 5. Dual-Axis Visual Refinement
- **What:** `var(--accent)` right-axis colour-coding + "Isolate Bars" toggle in control cluster
- **Spec location:** After scale-mode guardrail (after line 785)
- **CSS:** `.sc-separate .axis.right .tick text{color:var(--accent)}; .sc-separate .axis.right line{stroke:var(--accent)}`
- **Rationale:** Instantly distinguish two scales when `r = maxCum/maxBar > 10`; toggle isolates bars independently
- **Harness check impact:** Compatible — same `var(--accent)` token used in existing separate-scales directive (spec line 782-784)

## Cross-Reference Notes
- All enhancements are **backward-compatible** — dashboards not implementing them simply omit the new clauses (recorded as deviations in workplan §8.4)
- All tokens (`var(--accent)`, `var(--muted)`, `var(--amber)`, `var(--danger)`) are from shared semantic scale §6, already defined in `universal_ui_design.css`
- Persistence uses `localStorage` per spec patterns ( §18.4 theme persistence, §4.1 chart-card control persistence)
- Enhancement 2 table sync follows existing S-curve attached table contract where PNG/Copy rebuilds include the table
- Enhancement 4 threshold is workplan-configurable (same pattern as status vocabulary, filter dimensions §1.1, §7.2.7)
- No spec clauses are contradicted — each extends an existing capability within the documented contract
- **Harness compatibility verified:** All 5 enhancements pass `harness-layout` Tier 1-5 checks without misalignment (see detailed verification above)

## Verification Against harness-layout
All 5 enhancements were checked against the full harness-check suite (`harness-layout/harness.mjs`):
- No check failures introduced
- No existing check expectations contradicted
- All new CSS tokens are already defined in the shared design system
- All new structural elements fall within existing harness skip/gate patterns