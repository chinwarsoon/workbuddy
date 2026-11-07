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
| U003 | 2026-11-06 | `harness.mjs`, `checks/sub.mjs`, `SKILL.md`, `log/issue_log.md` | UI spec §4.2 rev 1.63: `checks/sub.mjs` rev 1.9 gained the config-gated `lintC1Interaction` block (10 Tier 5 interaction checks) and `harness.mjs` rev 1.18 gained the §4.6 hidden-window ARIA assertions. `harness.mjs` rev 1.19 then fixed the I-96 windowing check at its source: Sub I-112 replaced windowing with pagination on large tables, but the probe used `#vCnt` (16,393 rows) as its trigger and fell back to a header fragment with no `<tbody>`, so it reported 0 drawn rows and 0 spacers. Tier 4b now requires a real windowed table with `tr.win-pad` rows and skips with an explicit reason. The 4 assertions are unchanged. Verified: Sub full harness 2082 passed / 0 failed / 0 advisory / 29 skipped; MDL Tier 4 I-96 4/4 PASS; PPP Tier 4 78 passed / 0 failed. | I005 |
