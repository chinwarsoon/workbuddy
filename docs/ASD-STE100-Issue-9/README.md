# ASD-STE100 Issue 9 — official copy and word lists

Source of truth for the reply-style rule in `AGENTS.md` §5 Rule 19 and in
`.codebuddy/rules/asd-ste100-reply-style.md`.

## Contents

| File | Purpose |
|---|---|
| `ASD-STE100_Issue9_official.pdf` | Official copy. **ASD-STE100, Issue 9, 2025-01-15**, 434 pages. **This file is the authority.** |
| `approved-words.md` / `.json` | 800 approved words. Reference only. |
| `not-approved-words.md` / `.json` | 1,247 words that are not approved. Used by the lint. |

## What Issue 9 contains

- Part 1 — Writing rules: **53 rules in 9 sections** (Words · Multi-word nouns · Verbs · Sentences ·
  Procedural writing · Descriptive writing · Safety instructions · Punctuation and word count ·
  Writing practices).
- Part 2 — Dictionary: **875 approved words** and **1,274 words that are not approved**. Each
  approved word has one part of speech and one approved meaning.
- Technical nouns (TN) and technical verbs (TV) are not in the dictionary. You can use them for
  company, industry, or subject-field terms.

## Limit of the extracted lists — read this before you trust them

The PDF text layer is **incomplete**. I extracted the text with `pypdf` and then with `PyMuPDF`
(better extractor, same result). Proof of the gap:

- The strings `(det)`, `(num)` and `(int)` never appear in the extracted text, so determiners,
  numerals and interjections are not tagged.
- The words `EVERY`, `PER`, `MAY`, `ANY` and `NEVER` do not appear anywhere in the extracted
  dictionary text. They must be in the standard. The extractor cannot see them.
- Coverage: approved **800 of 875** (91.4%); not approved **1,247 of 1,274** (97.9%).

**Two consequences:**

1. **Approval is per word and per part of speech.** `use (n)` is not approved; the verb `use` is.
   A flat word list cannot show this. `harness-layout/ste-lint.mjs` therefore reports only words
   that are not approved **and** never appear on the approved list. That suppresses most
   part-of-speech conflicts.
2. **Findings are candidates, not verdicts.** Because the approved list is incomplete, the lint can
   still flag a word that the standard approves. Confirm in the PDF before you change a word.

For a true release gate you need the official machine-readable list or an STE checker. The ASD
publishes tools for this. The bundled lists are a fast pointer, not a gate.

## How the lists were made

Added 2026-10-22.

1. Extract the text from the PDF with PyMuPDF (pypdf gave the same result).
2. Match an entry as a word followed by a part-of-speech tag: `(n)`, `(v)`, `(adj)`, `(adv)`,
   `(prep)`, `(conj)`, `(pron)`.
3. In the dictionary, **approved words are UPPERCASE** and **words that are not approved are
   lowercase**. Sort on that rule.

I did not extract the approved alternatives for non-approved words. The dictionary is multi-column,
so the alternative column does not map reliably to its entry. Look the alternative up in the PDF.

## Maintenance

- Do not edit the PDF.
- If you replace the PDF with a new issue, rebuild both lists and update the counts in
  `AGENTS.md` §5 Rule 19 and in the rule file.
- To quiet a false positive, add the word to `harness-layout/ste-allow.json`. Write the reason in a
  comment. The allow-list holds technical nouns and technical verbs, which the standard permits
  (rule 1.8).
