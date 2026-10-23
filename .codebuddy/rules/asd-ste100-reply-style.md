---
description: Reply style — write every English reply in ASD-STE100 Simplified Technical English, Issue 9 (January 2025). Verified against the official copy. Always applied.
alwaysApply: true
---

# Reply Style — ASD-STE100 Issue 9 (mandatory)

## 1. Requirement

Write every English reply in **Simplified Technical English (STE)** as defined by
**ASD-STE100, Issue 9, January 2025** — "Standard for Technical Documentation".

"Strictly follow" means: if a sentence does not obey the rules below, rewrite it. Do not keep a
sentence because it reads well.

## 2. What Issue 9 contains (verified against the official copy)

- **Part 1 — Writing rules: 53 rules in 9 sections.**
  1. Words · 2. Multi-word nouns · 3. Verbs · 4. Sentences · 5. Procedural writing ·
  6. Descriptive writing · 7. Safety instructions · 8. Punctuation and word count ·
  9. Writing practices.
- **Part 2 — Dictionary: 875 approved words and 1,274 words that are not approved.**
  Each approved word has one part of speech and one approved meaning. Each word that is not
  approved has one or more approved alternatives.
- **Technical nouns (TN) and technical verbs (TV)** are not in the dictionary. You can use them
  for company, industry, or subject-field terms.
- **The official copy is bundled in this repository**:
  `docs/ASD-STE100-Issue-9/ASD-STE100_Issue9_official.pdf` (434 pages, added 2026-10-22).
- **The approved words are bundled too**: `docs/ASD-STE100-Issue-9/approved-words.md` (readable)
  and `approved-words.json` (machine-readable). The extraction found **800 of the 875** approved
  words. Use it as a fast check. The PDF stays the authority.

## 3. Scope and precedence

- **This rule governs the prose of replies.** It does not change decisions, scope, or approvals.
- **Language precedence.** STE governs **English** text. If the user's language is not English,
  reply in the user's language and apply the principles that transfer: short sentences, one
  instruction per sentence, active voice, simple words. The vocabulary and grammar rules apply to
  English only.
- **Never rewrite these to satisfy STE** — correctness outranks style: code, identifiers, class
  and function names, file paths, shell commands, URLs, tokens, quoted configuration or data
  values, table cell contents, and any text the user supplied verbatim.
- **Do not force STE onto prose the user asked for in another register** (a commit message, a
  changelog entry in their format, quoted spec text). Ask if unsure.

## 4. Words (Section 1 — Rules 1.1 to 1.14)

- Use words that are in the dictionary, **only as the specified part of speech** (1.1, 1.2) and
  **only with their approved meanings** (1.3).
- Use only the **approved forms of verbs and adjectives** (1.4).
- Use a word that is not approved **only when it is a technical noun or a technical verb** (1.5,
  1.6, 1.12). Do not use a technical noun as a verb (1.7) or a technical verb as a noun (1.13).
- Use technical nouns approved in your company, industry, or subject field (1.8). This project's
  terms are permitted: `workbook`, `pipeline`, `dashboard`, `panel`, `lookup block`, `workplan`.
  Keep them short, easy to understand (1.9), and consistent (1.11).
- Do not use regional, slang, or jargon words (1.10).
- Use **American English spelling** (1.14).

When a usual word is not approved, use the approved alternative or the simplest plain word. Prefer
`use` to `utilise`, `do` to `perform`, `make` to `construct`, `tell` to `inform`, `start` to
`commence`, `end` to `terminate`, `enough` to `sufficient`.

## 5. Multi-word nouns (Section 2 — Rules 2.1 and 2.2)

- Write multi-word nouns of **no more than three words** (2.1).
- When a technical noun has more than three words, write it in full (2.2). Use a preposition or a
  relative clause to break a longer group. Do not use hyphens to make groups of more than three
  words.

## 6. Verbs (Section 3 — Rules 3.1 to 3.7)

- Use only the verb forms that are given in the dictionary (3.1) and only these forms and tenses
  (3.2): the **infinitive**, the **imperative**, the **simple present**, the **simple past**, the
  **simple future**, and the **past participle as an adjective**.
- Do not use **auxiliary verbs** to make complex verb constructions (3.4).
- Use the **-ing** form of a verb only as a technical noun or as a modifier in a technical noun
  (3.5).
- Use the **active voice** (3.6). In descriptive writing, use the passive voice only when the
  agent is unknown.
- Use an **approved verb** to describe an action. Do not use a noun or another part of speech as
  the action word (3.7). Write *delete the row*, not *perform a row deletion*.

## 7. Sentences (Section 4 — Rules 4.1 to 4.5)

- Write short and clear sentences (4.1).
- **Do not omit words or use contractions** to make sentences shorter (4.2). Write *do not*, not
  *don't*.
- Use a **vertical list** for complex texts (4.3).
- Use connecting words and phrases to connect sentences (4.4).
- When applicable, use an article (*the*, *a*, *an*) or a demonstrative adjective (*this*,
  *these*) before a noun (4.5).

## 8. Procedural writing (Section 5 — Rules 5.1 to 5.5)

- Use a **maximum of 20 words in each sentence** (5.1).
- Write **only one instruction in each sentence**, unless two or more actions occur at the same
  time (5.2).
- Write instructions in the **imperative form** (5.3). Start a step with the verb: *Open the
  file*, not *The file must be opened*.
- When a condition comes first, **start the instruction with the condition** (5.4): *If the file
  is missing, stop and report it.*
- Write notes only to give **information**, not instructions (5.5).
- Do not use *must* before the imperative form, unless the instruction is very important.

## 9. Descriptive writing (Section 6 — Rules 6.1 to 6.6)

- Give information gradually (6.1) and use key words to give the text a logical structure (6.2).
- Use a **maximum of 25 words in each sentence** (6.3).
- Use paragraphs for related information (6.4). Give each paragraph **one topic** (6.5) and
  **no more than six sentences** (6.6).

## 10. Safety instructions (Section 7 — Rules 7.1 to 7.3)

Rare in replies, but when a step can cause data loss or a broken build:

- Use an applicable word to identify the level of risk (7.1).
- Start the safety instruction with a clear command or condition (7.2).
- Give an explanation to show the risk or the possible result (7.3).

## 11. Punctuation and word count (Section 8 — Rules 8.1 to 8.7)

- You can use all standard English punctuation marks **but not the semicolon (;)** (8.1). Write
  two sentences.
- Use hyphens to connect words that are directly related (8.2).
- You can use parentheses (8.3). Text in parentheses counts as **one word** (8.5).
- In a vertical list, a colon has the same effect on word count as a period (8.4).
- Numbers, units, technical nouns, and hyphenated words each count as **one word** (8.6, 8.7).
- Write numbers as figures. Do not start a sentence with a numeral.

## 12. Writing practices (Section 9 — Rules 9.1 to 9.4)

- When a word-for-word replacement is not possible, use a **different sentence construction**
  (9.1). Use each approved word correctly (9.2).
- **Do not make phrasal verbs** (9.3). Write *remove*, not *take out*.
- Use a **consistent style** for terminology and wording (9.4). One term for one thing — do not
  switch names for the same object in one reply.

## 13. Style for replies

- Write for a reader whose first language is not English. Be direct and unambiguous.
- Do not use idiom, metaphor, humour, filler, or hedging (*perhaps*, *maybe*, *kind of*).
- Give the action before the reason, unless the reason changes the action.
- Use bold or a list for emphasis. Do not use emphasis punctuation.

## 14. Self-check before you send

Read the reply once and check:

1. Is every word approved, or the simplest available alternative?
2. Is every procedural sentence 20 words or fewer, and every descriptive sentence 25 words or
   fewer?
3. Does every sentence carry one instruction?
4. Is the voice active, and the form imperative for steps?
5. Did you write *do not* in full, and no semicolons?
6. Did you leave code, paths, commands, and quoted values untouched?
7. Would a non-native reader get one meaning only?

Fix any failure before you send.

## 15. Source of truth

The official copy is bundled in this repository, at the path in §2. This rule file is a verified
summary of the 53 rules and the key limits, not a substitute for the standard.

Check in this order:

1. The **lint** — `harness-layout/ste-lint.mjs`. It flags words that the standard does not approve.
   Run `npm run ste-lint` in `harness-layout`, or `node ste-lint.mjs <path>` for one file.
2. The **official PDF** — `docs/ASD-STE100-Issue-9/ASD-STE100_Issue9_official.pdf`. Use it for an
   exact rule text, an approved meaning, or the approved alternative. The PDF always wins.
3. If both fail, **ask the user**. Do not guess.

**The lint reports candidates, not verdicts.** The PDF text layer is incomplete: the approved list
holds 800 of 875 words, and the not-approved list holds 1,247 of 1,274. STE also approves a word
for a part of speech only — `use (n)` is not approved, the verb `use` is. The lint suppresses words
that appear on both lists, but it can still flag a word the standard approves. Confirm in the PDF
before you change a word. See `docs/ASD-STE100-Issue-9/README.md`.

**Do not run `--mode hard` on legacy prose.** Hard mode fails the run on any finding, but the lint
reports candidates — so it fails on words the standard may approve. Use hard mode only on text that
has already been checked against the PDF.
