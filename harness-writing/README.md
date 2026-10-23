# harness-writing

ASD-STE100 Issue 9 prose-compliance harness — universal, reusable for any future project.
Separated from `harness-layout`, which checks layout/visual only. Self-contained: copy this folder
anywhere; word lists resolve from the bundled `wordlists/` copy (override with `--words`/`--approved`).

## Quick start

```bash
cd harness-writing
node ste-lint.mjs                         # scan current directory (markdown + dashboard HTML visible text)
node ste-lint.mjs path/to/Dashboard.html  # lint one built dashboard's visible text
node ste-lint.mjs --mode hard             # fail on any finding
```

See **[SKILL.md](./SKILL.md)** for scope, word lists, and the rationale.
