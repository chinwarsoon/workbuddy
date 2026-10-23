# SKILL: harness-writing

**Location**: `harness-writing/` (this folder; self-contained — copy it to any project)
**Purpose**: ASD-STE100 Issue 9 prose-compliance harness — universal, reusable for any future project.
**Authority**: the official ASD-STE100 Issue 9 PDF, bundled as `wordlists/ASD-STE100_Issue9_official.pdf` (the standard is the authority; not loaded at runtime)

---

## Why a separate harness

`harness-layout` (spec §3.8.5) checks **layout / visual** conformance: CSS tokens, z-index stack,
table geometry, panel chrome, errBanner/status-bar behaviour — spec §3 to §7. It is deliberately
unconcerned with words.

ASD-STE100 Issue 9 is a **writing** standard. It belongs in its own harness so the two concerns stay
separate and either can be tightened without touching the other.

---

## What this harness checks

`ste-lint.mjs` scans text for words that ASD-STE100 Issue 9 does **not** approve. It flags the
*not-approved* list (reliable: 1247 of 1274 words in the standard), not missing approved words, and
suppresses words that are approved for some part of speech.

Two text sources, both on by default:

| Source | How | Notes |
|--------|-----|-------|
| Markdown docs | `*.md` walked from the target | front matter, fenced/inline code, links, URLs and table rows are exempt (AGENTS.md §5 Rule 19e) |
| Dashboard visible text | `*.html` from the target | `<script>`/`<style>`/`<svg>`/comments/tags/attributes stripped; only **rendered** text is checked — KPI labels, panel/section titles, button labels, validation + status-bar strings |

## Word lists

| File | Role |
|------|------|
| `wordlists/not-approved-words.json` (bundled) | words the standard does not approve |
| `wordlists/approved-words.json` (bundled) | approved words, used to suppress part-of-speech conflicts |
| `harness-writing/ste-allow.json` | project technical nouns/verbs (ASD-STE100 rule 1.8) — add terms here, not to the standard lists |

## How to run

```bash
cd harness-writing
node ste-lint.mjs                              # scan the current directory (markdown + dashboard HTML), advisory
node ste-lint.mjs ./AGENTS.md                  # one file or directory
node ste-lint.mjs --path ./docs --path ./src   # limit scope
node ste-lint.mjs path/to/Dashboard.html       # a built dashboard's visible text only
node ste-lint.mjs --mode hard                  # fail (exit 1) on any finding
node ste-lint.mjs --top 40 --lines             # also list file:line per finding
```

Exit code 0 = no failures; advisory findings do **not** fail the run. `--mode hard` returns 1 if any
finding exists.

## Output is advisory by design

The ASD-STE100 PDF text layer is incomplete (approved list 800/875; not-approved 1247/1274) and the
standard approves a word **for a part of speech only**. Findings are candidates, not verdicts — confirm
in the official PDF before changing a word. The build gate therefore **reports** (WARN) rather than fails;
`--mode hard` is available for strict doc-only runs.

## Portability (reuse anywhere)

The harness is **self-contained**: copy the `harness-writing/` folder to any project — the bundled
`wordlists/` holds the standard lists and the authority PDF, so no external paths are needed. Override
either list with `--words` / `--approved` to use your own. The official PDF is the authority reference
only and is not loaded at runtime.

## Relationship to harness-layout

| Harness | Concern | Spec anchor |
|---------|---------|-------------|
| `harness-layout` | layout / visual | Dashboard UI Design Spec §3–§7, §3.8.5 |
| `harness-writing` | prose / STE | ASD-STE100 Issue 9 (authority = official PDF) |

Both must pass before a release.

## Spec cross-reference

The Dashboard UI Design Spec has **no dedicated writing-style clause**; the writing requirement is the
ASD-STE100 Issue 9 standard itself (cited in the sub-dashboard workplan header) plus the word lists bundled in
`wordlists/`. When the real dashboard is built, §8.2 of that workplan requires this harness
to pass on all user-facing copy.
