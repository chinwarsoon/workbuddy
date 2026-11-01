# harness-layout — Update Log

- Project: `harness-layout` (shared layout / visual evaluation harness; AGENTS.md §1.2)
- Canonical location: `harness-layout/log/update_log.md` (AGENTS.md §27)
- ID scheme: `Uxxx` — one entry per file revision (§13, §27)
- Created: 2026-10-31
- Owner: pending

## Updates

| ID | Date | File | Change | Refs |
|----|------|------|--------|------|
| U001 | 2026-10-31 | `harness-layout/log/issue_log.md` | Created the canonical issue log (§26.2 / §26.11) and seeded issue I001 (harness bundled spec not trimmed to layout-only scope). This update log was created alongside it. | I001 |
| U002 | 2026-11-01 | `harness.mjs`, `checks/sub.mjs`, `README.md`, `SKILL.md` | Added Tier 6 (§4.6 hover floating window) check: `lintHoverWindow` + Tier 6 dispatch in `harness.mjs`, `hover` config block in `checks/sub.mjs`, documented in README/SKILL. Closes harness issue I002 and acts as a regression guard for sub issue I092. | I002 |
