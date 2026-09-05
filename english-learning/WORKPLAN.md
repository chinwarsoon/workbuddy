# EnglishDaily · English Learning Tool — Workplan & User Guide

> A standalone, offline, single-file English learning web app optimized for iPhone Safari.
> This document records **what the tool is, how it works, where data lives, and the three ways you can use it** — locally or hosted.

---

## 1. What this is

`english-learning-tool.html` is a **self-contained HTML file**: no server, no internet at runtime, no app store, no external dependencies. All HTML, CSS, and JavaScript live inside one file. It runs as a small single-page app (SPA) with a bottom tab bar (Plan / Daily / Reading / Review / Me).

It is designed for **iPhone Safari** but also works in any modern browser (desktop, Android).

---

## 2. Features (all built-in)

### Core modules
1. **Learning Plan Builder** (Plan tab)
   - Pick a goal (Travel / Work / Exam / Hobby), daily study minutes, and focus areas.
   - Auto-generates a **7-day visualized weekly plan** from a built-in task bank. Editable.
2. **Daily Words** (Daily tab)
   - **2 new words per day** (built-in bank of 40 words ≈ 20 days).
   - 🔊 **Pronunciation** via the browser's built-in speech engine (Web Speech / `SpeechSynthesis`) — no audio files needed.
   - Each word shows: IPA phonetic, part of speech, Chinese meaning, example sentence + translation, and an emoji illustration.
   - "I learned it" button records progress.
3. **Weekly Reading** (Reading tab)
   - 6 short graded texts (A1–A2) with vocabulary highlighted in **blue** — these are the reading's "key words".
   - **Tap any blue word** (or the 🔊 / 📝 buttons in the "本篇重点词 / Key words" card) to open a popup with its meaning + a 🔊 pronunciation button.
   - The current reading's blue/key words are **prioritized as the daily learning words**: they appear first in the Daily tab, and a "Key words" card tells you to learn all of them.
   - A multiple-choice comprehension quiz (auto-scored) follows each text; completion is recorded.
4. **Progress Tracker** (Me tab)
   - Stats: words learned, consecutive-day streak, readings finished.
   - **7-day activity bar chart** drawn as inline SVG.
   - 7 achievement milestones.
5. **Mobile optimization**
   - iOS-style bottom tab bar, safe-area insets (`viewport-fit=cover` + `env(safe-area-inset-*)`), `100dvh` to handle Safari's address-bar resize, ≥44px tap targets, zoom disabled.

### Bonus modules
- 🔁 **Spaced-repetition flashcards** (Review tab) — simplified SM-2 algorithm; one **global schedule per word** (not per pack), so a word learned in any pack keeps its schedule everywhere. Modes: 🔁 current-pack due queue, 🌐 **All Packs** cross-pack due queue, ✏️ **Spell It** productive recall (definition → type the word; correct = "Okay" step, wrong = reset), 📖 **Context** review (a real reading sentence with the word blanked → type it; falls back to the word's example, then to the definition prompt), 📚 free browse (no scheduling), ✍️ quiz. Typed modes share the global due queue and the same per-word schedule; grading ignores case and trailing punctuation. The nav badge shows the global due count. *(A redesign of the Review layout — a scope switch「本包/全部包」+ a 5-mode row — plus a P0 fix for the broken typed input is planned: see §13.)*
- ✍️ **Vocabulary quiz** — meaning → choose the word; auto-scored; history saved.
- ⭐ **Bookmarks** — star difficult words from Daily/Review into a separate list.
- 🔥 **Streak + reminder** — toggle on/off + set time; uses the Notification API with an in-app fallback.
- 📝 **Notes** — free-text notes, auto-saved.
- ⬇️⬆️ **Backup Export / Import** — export all progress to a `.json` file (saved to the Files app) and import it back.
- 🌐 **Language toggle (EN / 中文)** — a 🌐 button in the top header switches the entire UI **and** the word/reading content between English and Chinese. The choice is saved in `localStorage`. On English mode, word definitions and example translations show in English; on Chinese mode they show in Chinese (the learner's aid).

---

## 3. Where the data comes from

There are **two kinds of data**:

### A. Built-in content (hard-coded inside the HTML file)
You can edit these directly in the file:
- `WORDS` — array of 40 English words (spelling, IPA, part of speech, Chinese meaning, example + translation, emoji).
- `READINGS` — 6 graded texts with vocab highlights and quiz questions.
- `AREA_TASKS` — the task bank used by the Plan Builder.

> Think of the file as **the textbook + the app**. Editing these arrays changes the material for everyone who opens that file.

### B. Your personal progress (created as you use it)
Words learned, streak, bookmarks, notes, flashcard schedules, quiz scores, reading completions, your plan, reminder settings, and a daily activity log. This is produced by *you* and saved automatically.

---

## 4. How local data is stored

All personal progress is saved in the browser via **`localStorage`** (a tiny built-in key-value store).

- **Storage key:** `englishDaily_v1`
- **Saved content** (the whole `state` object as JSON):
  - `learnedWords` — words marked learned + date
  - `flashcards` — spaced-repetition schedule per word
  - `bookmarks` — starred difficult words
  - `readingsDone` — completed weekly readings
  - `streak` — consecutive-day count + last-active date
  - `plan` — your generated learning plan
  - `notes` — free-text notes
  - `reminder` — on/off + time
  - `activity` — daily log for the 7-day chart
  - `quizResults` — past quiz scores

Every meaningful action calls `saveState()` → `localStorage.setItem(...)`. On open, `loadState()` reads it back, so progress persists across sessions and reloads.

### Important caveats about localStorage
- It is **per-browser, per-device**. Data stays on *that* iPhone in *that* Safari. It does **not** sync to other devices or the cloud.
- Clearing Safari website data, or using **Private Mode**, can wipe progress.
- If you send the file to another phone, only the *content* (words/readings) travels — your *progress* does **not**, because progress lives in the device's storage, not in the file.

---

## 5. The three ways to use it (and how each works)

All three open the **same app code**; they differ only in *where* the file is opened, which changes storage stability and offline behavior.

| # | Option | How to open | Offline | Storage location | 404 risk |
|---|--------|-------------|---------|------------------|----------|
| ① | **Local file** (`file://`) | Open `english-learning-tool.html` from the Files app / data cable in Safari | ✅ | `file://` origin (less durable on iOS) | None (all refs inline now) |
| ② | **Local file → Add to Home Screen** | From option ①, tap Share → Add to Home Screen | ✅ | Separate web-clip sandbox (more durable) | None |
| ③ | **Hosted PWA** (`https://`) | Open the share link in Safari → Add to Home Screen | ✅ (Service Worker cache) | `https` origin (most durable) | None |

### Option ① — Local file (direct)
- Transfer the `.html` to your iPhone (see Section 7), then open it from the Files app / a data cable in Safari.
- Fully offline. Progress saved in the `file://` origin. iOS manages `file://` storage loosely, so a system update or "Clear History and Website Data" *may* wipe it.
- The file now references **no external files** (manifest/icon are inlined as data URIs and the service worker is registered only over http/https), so it produces **no 404 errors**.

### Option ② — Local file added to Home Screen
- While viewing option ① in Safari, tap **Share → Add to Home Screen**.
- Opens full-screen like a real app (no browser toolbar) thanks to `apple-mobile-web-app-capable`.
- Gets its **own storage sandbox**, which is more durable than plain Safari `file://` — survives restarts and most updates.
- Best "no-server" experience.

### Option ③ — Hosted PWA (recommended primary)
- Open the share link in Safari, then **Share → Add to Home Screen** to install it as a PWA.
- A **Service Worker** (`sw.js`) caches the page on first load, so it keeps working **offline** even after the host is unreachable.
- `https` storage is the most stable of the three.
- **Share link:** https://889d525c87954023a62ef99476da83bd.app.workbuddy.link/
  - This is the **current deployed link** — it serves the latest build (service worker cache `ed-c493f6c4`: full Phase-2 example rewrite §12.1 (all 1879 hand-authored), global-SRS refactor, Spell It + Context modes, status colors, and the B1–B6 accessibility fixes: pinch-zoom, contrast, keyboard/ARIA, dialog focus-trap, reduced-motion, XSS hardening). Re-deploys reuse the same link. After a deploy, close and reopen the app once so Safari picks up the new service worker.

> **You can use all three at once.** They are just different entry points to the same app. They do **not** conflict.

### ⚠️ Critical: the three options do NOT share progress
Each entry point has its **own independent `localStorage`** (storage is isolated per "origin"):
- `file://` (option ①/②) → one progress set
- the hosted PWA origin (option ③, `https://889d525c87954023a62ef99476da83bd.app.workbuddy.link/`) → a different progress set

So words you learn in the PWA will **not** automatically appear in the local file, and vice versa.

**How to keep them in sync:** use the **Export / Import backup** buttons (in the Me tab):
1. In one entry point, tap **⬇️ Export backup** → a `englishDaily-backup-<date>.json` is saved to the Files app.
2. In another entry point, tap **⬆️ Import backup** → progress is restored.

**Recommended setup:** make the **hosted PWA (③)** your daily driver; keep the **local `.html` (①/②)** as a backup; and tap **Export backup** weekly (or before clearing data / changing devices) so nothing is ever truly lost.

---

## 6. How it behaves on iPhone

- **Fully offline** after first open. Pronunciation uses Safari's built-in `SpeechSynthesis` (the same voice as Apple's "Speak Selection"), so no audio downloads.
- **Add to Home Screen** → app-like full-screen, no toolbar.
- **Safe-area + 100dvh** → nothing hides behind the notch / home indicator; layout stays correct as Safari's address bar shrinks/grows.
- **Reminders:** if enabled and notification permission is granted, Safari shows a local notification **when the app is opened** at your set time. (iOS web notifications cannot fire while the page is fully closed, so treat it as an open-time nudge.)
- **Day / Week logic:** "Day 1" = your first launch date (`startDate`), computed from the device clock. The reading rotates one new text per week automatically.

---

## 7. How to transfer the file to iPhone (from Windows)

> AirDrop only works Mac ↔ iPhone. From Windows, use one of these:

1. **Cloud drive (easiest):** upload `english-learning-tool.html` to OneDrive / Google Drive / Dropbox / 百度网盘 → open it in the iPhone app → open in Safari → Add to Home Screen.
2. **iCloud for Windows:** put the file in iCloud Drive → iPhone Files app → open in Safari.
3. **Email / WeChat File Helper:** send as attachment to yourself → download → open in Safari.
4. **USB + iTunes/Finder:** connect iPhone, use File Sharing to copy into an app (e.g. Files/VLC) → open in Safari.
5. **Hosted PWA (already done):** just open the share link in Safari — no transfer needed.

---

## 8. PWA internals (for the curious / advanced)

- **Manifest + icon are inlined** as base64 **data URIs** inside the HTML (no separate `manifest.webmanifest` / `icon.svg` files). `ensurePwaMeta()` injects them **only when the protocol is `http(s)`**; on `file://` it is skipped, so the local file stays 404-free and truly standalone.
- **`sw.js` must remain a separate file.** Browsers require a service worker to be a real, same-origin `.js` file — it cannot be inlined as a data URI or blob. `sw.js` is what gives the **hosted** version offline caching. The local file does not need it.
- **Deployment:** CloudStudio static site. The `pwa/` folder holds `index.html` (an identical copy of the app, with inlined manifest/icon) + `sw.js`. The local `english-learning-tool.html` is the file you use on your phone.

### File layout
```
english-learning/
├── english-learning-tool.html   ← main single-file app (use this on iPhone)
├── WORKPLAN.md                  ← this document
└── pwa/
    ├── index.html               ← identical copy, prepared for hosting
    └── sw.js                    ← service worker (hosted offline caching only)
```

---

## 9. Recommended daily workflow

1. **First time:** open the PWA share link in Safari → **Add to Home Screen**. (Or open the local file → Add to Home Screen.)
2. Build your **plan**, then study **Daily Words** (tap 🔊 to hear, mark "learned").
3. Do the **Weekly Reading** and review with **Flashcards / Quiz**.
4. Star hard words with **Bookmarks**; jot thoughts in **Notes**.
5. Occasionally tap **⬇️ Export backup** and keep the `.json` in the Files app as insurance.
6. To move progress between devices/options, **Import** that backup.

---

## 10. Things to remember

- The **file = textbook + app**; your phone's `localStorage` = your personal notebook inside that app.
- Moving the file moves the textbook, **not** the notebook.
- The three options each keep their **own notebook** — bridge them with **Export / Import**.
- Clearing Safari data or using Private Mode can erase progress — **export backups** regularly.
- The hosted PWA link is a convenience copy; your **local `.html` is the root source of truth**. If the host ever goes down, the local file is unaffected.

---

## 11. Content Packs — per-goal JSON

All learning **content** (words, readings, plan task bank) is organized into **content packs**: one JSON file per learning goal. This lets you swap the *textbook* without touching your *progress*.

### How content is loaded
- **Hosted PWA (`https`)** — on open the app `fetch()`es `content/manifest.json`, then fetches every pack file it lists. **To add a new pack: drop a JSON file into `content/` AND add its entry to `content/manifest.json`.** The next open auto-loads it — no code change.
- **Local file (`file://`)** — browsers block `fetch()` of local files, so the app ships with a **built-in "General English" pack embedded** (works with zero setup). To use your own pack, open **Me → 📦 Content Pack → 📂 Import pack** and pick a JSON file. The imported pack is saved in `localStorage`, so it reloads automatically next time. *(True auto-detect of new files is impossible on `file://` — it is a browser security rule, not a choice.)*
- A **pack selector** in **Me → Content Pack** switches the active goal at any time; **Daily / Reading / Review all follow the selected pack**.

### Per-goal progress stays separate — except flashcards, which are global
Learned words / bookmarks / completed readings are referenced per pack: `(packId, word)` and `(packId, week)`. Switching packs shows only that pack's progress; nothing is ever overwritten or lost.

**Flashcards are the exception (by design):** memory of a word is not pack-specific, so each card is keyed by the **word itself** (`flashcards["word"] = {ease, interval, reps, due, packs:[...]}`), with a `packs` tag recording where it was learned. Consequences:
- A word already learned in **any** pack counts as learned everywhere (`isLearned` is global) — Daily/Reading never re-teach it.
- On entering a pack, words of that pack that you already learned elsewhere are **captured** into the review pool with their existing schedule (`captureLearnedInPack`).
- The 🌐 **All Packs** review mode shows one mixed due queue across every pack; the nav badge counts global due.
- The ✏️ **Spell It** and 📖 **Context** typed modes also draw from the global due queue and advance the **same** per-word schedule (typed correct = "Okay", typed wrong = "Forgot"), so every mode reinforces one memory trace per word.
- Old `pack::word` card keys are migrated once (idempotently) on load and on backup import — merging duplicates with the soonest due date, the least advanced schedule, and the union of pack tags.

### Current file layout
```
english-learning/
├── english-learning-tool.html   ← main single-file app (use on iPhone)
├── WORKPLAN.md
├── content/                    ← content packs (consumed by the hosted PWA)
│   ├── manifest.json           ← lists every pack to auto-load
│   ├── general.json            ← sample pack: 40 words + 6 readings + task bank
│   ├── nce2.json               ← sample pack: New Concept *Style* Book 2 (97 words + 12 stories)
│   ├── nce3.json               ← sample pack: Book 3 style (79 words + 10 essays)
│   ├── nce4.json               ← sample pack: Book 4 style (65 words + 8 argument essays)
│   ├── freq1k.json             ← Phase 1: NGSL 1–1000 (1056 words + 12 readings)
│   ├── freq2k.json             ← Phase 2: NGSL 1001–2809 (1879 words + 12 readings)
│   ├── freq3k.json             ← Phase 3: NAWL academic (956 words + 12 readings)
│   └── freq4k.json             ← Phase 4: COCA expansion (800 words + 12 readings)
└── pwa/
    ├── index.html              ← identical copy, prepared for hosting
    ├── sw.js                   ← service worker (offline caching, includes content/)
    └── content/                ← same manifest.json + freq1k–4k for hosting
```

### How to author a new pack
Create a JSON file, e.g. `travel.json`:
```json
{
  "id": "travel",
  "name": "旅行交流",
  "nameEn": "Travel & Conversation",
  "desc": "旅行场景单词与阅读",
  "descEn": "Travel-scene words and readings",
  "words": [
    {"word":"airport","ipa":"/ˈeəpɔːt/","pos":"n.","def":"机场","defEn":"airport",
     "ex":"At the airport.","exzh":"在机场。","exEn":"At the airport.","emoji":"✈️"}
  ],
  "readings": [
    {"title":"在机场","titleEn":"At the Airport","level":"A1",
     "text":"...","vocab":[{"w":"gate","d":"登机口","dEn":"boarding gate"}],
     "questions":[{"q":"...","options":["..."],"a":0}]}
  ],
  "areaTasks": {"vocab":{"zh":["学 2 个新词"],"en":["Learn 2 words"]}, "reading":{...}, ...},
  "areaLabel": {"zh":{"vocab":"词汇", ...}, "en":{"vocab":"Vocabulary", ...}}
}
```
- Provide **both** sides of every bilingual field — `def`/`defEn`, `ex`/`exEn`, `title`/`titleEn`, `d`/`dEn` — so the 🌐 EN/中文 toggle stays complete.
- **Optional `pic` field** — a word may carry `pic` (an image URL, or — for true offline use — an inline `data:` URI). When present it is shown **instead of `emoji`** in the Daily card, the Reading popup, and the review cards; when absent, `emoji` is the fallback. Keep images tiny/inlined so the file stays offline. Concrete nouns benefit most (e.g. a photo/icon of the object); abstract words can stay emoji-only. Example: `"pic":"data:image/svg+xml;utf8,<svg ...>...</svg>"`.
- **Hosted PWA:** copy the file into `content/`, add `{"id":"travel","file":"travel.json","name":"旅行交流","nameEn":"Travel & Conversation"}` to `content/manifest.json`, then re-deploy.
- **Local use:** just import the file with the in-app **Import pack** button.
- Pack fields are optional; a pack with no `readings` (or no `areaLabel`) simply shows a friendly placeholder instead of crashing.

### Sample packs: New Concept *Style* Books 2–4
- **`nce2.json`** — Book-2 style: 97 intermediate words + **12 original** ~100–150-word humorous anecdotes (simple past, punchline endings) + plan task bank (shadow-reading, retell, dictation-style listening).
- **`nce3.json`** — Book-3 style: 79 upper-intermediate words + **10 original** ~180–220-word narrative essays (build-up + pointed ending) + task bank incl. the classic summary-writing drill.
- **`nce4.json`** — Book-4 style: 65 advanced words + **8 original** ~200–260-word argumentative essays (claim–support–counterpoint–conclusion) + task bank with argument mapping & opinion writing.
- ⚠️ **Copyright note:** the *original* NCE lesson texts are owned by Longman / 外研社, so these packs contain **only newly written texts in the same style** — safe to share, deploy, and study. If you own the books, you may replace `readings[].text` with your own copies for **private, non-redistributed** study; do not publish the actual copyrighted texts.

### High-Frequency phased curriculum (Phase 1–4) — the main graded word list
This is the **primary graded vocabulary path**, built in four phases. Each phase is a separate pack; together they cover ~4,691 words across 48 graded readings (A2 → B2). The pack names shown in the selector are `高频词·第1–4阶`.

- **`freq1k.json` — Phase 1 (NGSL 1–1000, A2):** 1056 words + 12 readings. The foundation layer.
- **`freq2k.json` — Phase 2 (NGSL 1001–2809, B1):** 1879 words + 12 readings.
- **`freq3k.json` — Phase 3 (NAWL academic, B2):** 956 words (the New Academic Word List) + 12 readings.
- **`freq4k.json` — Phase 4 (COCA expansion, B2) — COMPLETE:** 800 words = NAWL tail (ranks 801–956, 156 words) + COCA 3000–5000 academic band (644 words). 12 B2 readings (240–300 words each). Every blue key-word resolves to a full definition. Build scripts: `build/_gen_p4_words.py` (word list), `build/p4_readings.js` (readings), `build/_build_p4.js` (pack builder + validator), `build/_test_p4.js` (smoke test).

**Recycling principle:** each later phase's readings reuse earlier-taught words as plain text for spiral review. The app's `CROSS_DICT` mechanism auto-detects any prior-phase word inside a later reading and renders it as a tappable blue popup (meaning + 🔊 pronunciation) — so vocabulary compounds instead of being forgotten. Phase 4 readings recycle the **Phase 1 + 2** taught set at 100% coverage (452/452 words); Phase 3's NAWL words stay consolidated in the Phase 3 pack.

**Status:** Phase 1–4 are **complete** and registered in both `content/manifest.json` and `pwa/content/manifest.json`. The hosted PWA's `sw.js` cache is auto-bumped from content hash (`build/_prep_deploy.js`); current live hash: `ed-c493f6c4` (served at `https://889d525c87954023a62ef99476da83bd.app.workbuddy.link/`). To preview, open `pwa/index.html` (or the hosted share link) and pick **高频词·第4阶 (COCA 学术拓展)** from **Me → Content Pack**.

## 12. Open items — future enhancements (pending decision, not started)

Reviewed 2026-08-30. Nothing here is pending implementation work; each item waits for an explicit go-ahead. New UI text/labels for any of these require approval before coding (per project convention).

> The **Review tab redesign** (scope switch + mode row, typed-input fix) is no longer an open question — it is an approved action plan tracked in **§13**.

1. **Phase 2 Chinese example-sentence quality.** — **DONE 2026-09-05: all 1879 words hand-authored; nothing left open.**
   - *Original defect:* all 1879 `freq-2k` examples came from only **14 EN / 11 ZH templates**, **100% (1879/1879)** of `exzh` pasted the **raw English word into the Chinese sentence** (e.g. `这个weather有助于解释结果。`), and POS was ignored (`We need to tired a clear answer.`).
   - *What shipped:* new pipeline **`build/_gen_p2_examples.js`** + hand-authored **`build/_p2_curated/*.json`**.
     - **Gloss cleanup** — strips inline ECDICT POS markers (`村庄 a. 乡村的` → `村庄`), later senses, duplicated halves (`在...下方在...下方` → `在...下方`).
     - **POS correction** — only second-guesses the pack on v./adj./adv.; a `-的` gloss on a `v.` entry is re-classified `adj.` (fixes `busy/slow/secure`).
     - **Frame libraries** — 16 frames per POS. Frames are deliberately **"topic/comment"** shaped (`We cannot ignore the {w}.` / `我们先谈谈{g}。`) because semantically-specific frames produce absurdities (`You can see the grandmother most clearly in this photo.`). Adjective frames avoid the indefinite article (`a illegal example`); verb frames take no object so they serve transitive *and* intransitive verbs.
     - **Curated overrides** — hand-written EN+ZH pairs in `build/_p2_curated/`, batch files sort-merge so later batches only add coverage:
       `001.json` (200) + `002.json` (200) + `003.json` (21 conjunctive adverbs) — shipped `ed-2f278ce8`;
       `004.json` (words 400–599) + `005.json` (600–799) + `006.json` (800–999) + `007.json` (1000–1199) + `008.json` (1200–1399) + `009.json` (1400–1599) + `010.json` (1600–1878, 279 entries) — shipped `ed-c493f6c4`.
       Total **1879 / 1879 words curated — 0 framework-generated**. Conjunctive adverbs (`否则/然而/因此`) needed hand authoring because no frame fits them (`他否则回答了这个问题。`).
     - *Result:* `latin-in-ZH = 0` (was 1879), `validation problems = 0`, unique EN sentences 14 → **1877**, unique ZH 11 → **1873** (the few remaining duplicates are intentional near-identical natural sentences). Both `content/` and `pwa/content/` synced; live at `ed-c493f6c4`; verified by downloading the deployed `freq-2k.json` and spot-checking `suggestion / blow / faithfully / snap / thirst / stair / shore / cast / FALSE`.
   - **Known data defect (not fixed):** entry #1175 headword is the uppercase string `FALSE` instead of `false`. It is curable in the authoring layer (its example reads correctly: *The report was false.*), but renaming the headword was deliberately skipped because headwords are the key for the user's stored `learnedWords`/`flashcards` progress — renaming would orphan that progress. Fix only alongside a progress-migration step.
   - **Design note (why per-word authoring and not automation):** the 16-frames-per-POS library produces grammatical, non-absurd sentences but stays bland and occasionally stiff (`她对海岸有很鲜明的看法。`, `We decided to assure after all.` where *assure* wants an object). Corpus extraction was evaluated and **rejected**: all 84 readings across every pack cover only **30.6% (575/1879)** of Phase-2 words, and some hits are `🔁 Review:` index lines rather than sentences.
2. **Extend reading recycling to Phase 3.** Phase 4 readings currently recycle P1+P2 only (decision B1, 452/452 covered). Extending recycling to include the Phase 3 NAWL set would compound academic vocabulary too — but previously conflicted with the 240–300-word reading-length cap; would need re-balancing the reading texts.
3. **Per-word review push reminders.** Not feasible as-is: an offline-first PWA cannot fire background notifications per due word. Current behavior is the in-app due queue + global nav badge, plus the generic fixed-time daily reminder (only fires while the app is open). Options if wanted later: Background Sync API (limited iOS support) or a native-wrapper approach — both change the deployment model and need separate evaluation against the offline/no-data-loss requirements.

---

## 13. Review Tab Redesign — Action Plan (approved 2026-08-30)

Status: **implemented 2026-08-30** in `pwa/index.html` (§13.4 items 1–13 all landed; JS syntax-checked via node, core logic smoke-tested — queue building per scope/mode, near-miss grading, interval preview, free-practice queues). Synced to `english-learning-tool.html`.

### 13.5 Follow-up fixes (2026-08-30, same session)
After device testing the user reported: (1) mode row overflowed the panel width; (2) spell card under 本包 broke on "立即练习"; (3) explanation blank under 本包. Root causes & fixes:
- **mode-row overflow** → `#reviewSeg` is now a segmented control (`flex:1` buttons, no horizontal scroll) that always fits the panel; `rev_all` label shortened to 全部/All so 5 buttons fit on narrow screens; sub-filter bar renamed to `.subbar`.
- **blank explanation / broken spell card** → 861 of 4972 content words (e.g. `the`, `be`, `and`, `of`, `to`, `a` in freq packs) have NO `def`/`defEn` fields, so under 本包 the meaning rendered empty. Added `explainWord(w)` which falls back to the example sentence (`exzh`/`ex`) when no definition exists; applied in flash/productive/context/result/word cards. Verified via node harness: a def-less "the" now shows "猫坐在垫子上。".

### 13.1 Goal
Replace the current single 6-mode row (`🔁 复习卡片 / 🌐 跨包复习 / ✏️ 主动拼写 / 📖 语境复习 / 📚 全部单词 / ✍️ 词汇测验`) with **two orthogonal controls**:

- **Scope switch** — `[ 本包 ]` / `[ 全部包 ]` → which packs supply the queue.
- **Mode row** — `🔁 卡片` / `✏️ 拼写` / `📖 语境` / `📚 全部单词` / `✍️ 测验` → how to practice.

Key clarification (confirmed with user): **「全部单词」 is a mode** (free browse that ignores due dates), not a scope — that is why the scope switch only needs two options.

### 13.2 Behavior matrix (source of truth)

| Mode \ Scope | 本包 | 全部包 |
|---|---|---|
| 🔁 卡片 | due ∩ 本包词 — `dueCards()` | due 不限包 — `dueCardsGlobal()` |
| ✏️ 拼写 | due ∩ 本包词 | due 不限包 |
| 📖 语境 | due ∩ 本包词 | due 不限包 |
| 📚 全部单词 | 本包全部词 · 自由浏览 · 不入档 | ⚠️ pending decision §13.5.1 |
| ✍️ 测验 | 本包已学词 · 5 题 | 全部包已学词 · 5 题 |

Rules:
1. 卡片 / 拼写 / 语境 share **one global per-word SRS schedule** (unchanged; typed correct = "Okay", typed wrong = "Forgot").
2. Switching scope or mode **rebuilds the queue** (reuse the existing pattern in the `reviewmode` click branch).
3. 全部单词 never touches the schedule (existing `rateFree` semantics preserved).

### 13.3 P0 defects (block everything else)
1. **Typed input is collapsed to ≈31px and unusable** — `typedInputHTML()` puts `input.flex:1` beside a `.btn` (which has the global `width:100%`) in a flex row. Flex-basis math gives the input ~0 width (floored at padding+border ≈31px) and the 检查 button ~the whole row. Both ✏️ Spell It and 📖 Context are effectively dead. Fix: dedicated `.type-row` styles — `input{flex:1 1 auto; min-width:0}`, `button{flex:0 0 auto}`; stack vertically on ≤320px screens.
2. **6-mode seg bar cannot fit one line on iPhone** — at `flex:1` in ≈358px each button gets ~58px while a label needs ~85px, so every label wraps and rows misalign. Fix: scope row = 2-pill switch; mode row = horizontally scrollable (`overflow-x:auto` + `scroll-snap`, `flex:0 0 auto` + `white-space:nowrap`).

### 13.4 Implementation checklist (greenlit by §13.5 decisions)
1. Markup: replace `#tab-review`'s `.seg` with scope switch + mode row; add `role="tablist"` / `aria-selected`.
2. State: add `reviewScope:"pack"` to `defaultState()`; persist in localStorage (decision §13.5.2).
3. Refactor `renderReview()`'s if/else chain into `buildQueue(scope,mode)` + `renderCard(mode,word)`; collapse the five queue vars into one `currentQueue` + a `{scope,mode}` key.
4. Queue sources: 本包 → `dueCards()`, 全部包 → `dueCardsGlobal()`. Note: ✏️/📖 queues are **currently hard-coded to the global queue** (`productiveQueue`/`contextQueue` always `dueCardsGlobal()`) and must become scope-aware.
5. Quiz: add a scope parameter — 全部包 must sample learned words from **all packs** (currently `buildQuiz()` only reads `WORDS`, the active pack's word list).
6. Empty states: add a **「立即练习（不入档）」 fallback** (today the typed modes are unreachable whenever nothing is due) plus a「切到全部单词」shortcut.
7. Unified card skeleton: progress bar + mode title on top; **sticky bottom action bar** with rating buttons visible on the card **front** (drop the mandatory flip-to-rate step); session-summary screen when the queue empties (count, time, next due).
8. Typed-mode UX: length hint `_ _ _ _ _ (5)`; first-letter hint; **「看答案（记为忘了）」** escape hatch; three-tier grading — correct / near-miss (edit distance ≤1 → retry without resetting the card) / wrong → reset; `enterkeyhint="go"`; `blur()` the keyboard on submit.
9. Context mode: build a `word → sentence[]` index once per pack load (exclude `🔁 Review:` tails — they read like word lists, not sentences); when no sentence exists show an **explicit fallback notice** instead of silently degrading to the definition prompt.
10. Rating buttons: semantic colors (red / amber / green) + **next-interval preview** on the label (e.g. `忘了 1天` / `一般 3天` / `轻松 6天`); 5-second undo toast after rating.
11. Listen player (`listenCardHTML`) is currently only appended in 📚 全部单词 — make it available in all card-like modes so the feature doesn't seem to disappear.
12. Accessibility & ergonomics: flip surface as a real `<button>` (or `role="button"` + Enter/Space), `aria-live="polite"` on the card area, `aria-label` on the typed input, ≥44px touch targets.
13. **Sync the local single-file copy:** `english-learning-tool.html` is 2 commits behind `pwa/index.html` (missing Spell It / Context, global SRS, CROSS_DICT). After this redesign lands, copy `pwa/index.html` back over the local file (it is self-contained and degrades gracefully on `file://`).

### 13.5 Decisions (all resolved 2026-08-30 → implementation approved)
1. **「全部包 + 全部单词」 = option C** — default to **已学词 across all packs** (label `📚 已学单词 · N`), with a **secondary in-mode toggle** that flips to "全部 N 词" (all words, free browse). Implemented as a sub-switch inside the mode card when scope=全部包.
2. **Persist `reviewScope`** in `localStorage` (alongside `activePack`); the *mode* stays session-only (resets to 🔁 卡片 on open, as today).
3. **UI labels approved as suggested:** scope pills `本包` / `全部包`; mode row `🔁 卡片` · `✏️ 拼写` · `📖 语境` · `📚 全部单词` · `✍️ 测验`; dynamic `📚 已学单词 · N` when scope=全部包; empty-state buttons `立即练习（不入档）` / `切到全部单词`; rating buttons `忘了 1天` / `一般 3天` / `轻松 6天`; English side: `This pack` / `All packs`, `Cards` / `Spell` / `Context` / `All words` / `Quiz`, `Learn now (no schedule)` / `Browse all words`.

---

## 14. Word-Card Detail Consistency Audit (2026-08-30 → A1–A6 done 2026-08-31)

**Goal:** standardize how "word detail" (meaning + example + speaker + action buttons) renders across the Daily panel card, the Reading-panel popup, and the Review-panel cards. Daily's `wordCardHTML` is the agreed reference pattern.

**Status (2026-08-31):** **A1–A6 all implemented & synced** to `pwa/index.html` and `english-learning-tool.html`. A shared `wordDetailHTML(w)` partial renders word+IPA + 🔊 word + pos badge + meaning (`explainWord`, language-aware) + example + 🔊 sentence, reused by Daily, Reading popup, Flash back, and Typed result. Flash front gained a pre-flip 🔊 word. Spell It / Context prompt `pos` now uses the same `.wd-pos` badge. Emoji illustration is unified via the `wordDetailHTML` head (Daily's separate big `.illus` removed to avoid duplication). Verified: EN mode shows `defEn`/`-` (never Chinese); speakers present in all detail views; `pos` badge consistent everywhere.

### 14.1 Consolidated word-card matrix (post A1–A6)
| # | Card location | Container/style | word+ipa | 🔊 word | pos | def source | example + 🔊 sentence | action buttons below |
|---|---|---|:--:|:--:|:--:|---|---|---|
| 1 | Daily | `.wordcard`(.body+.acts) | ✓ | ✓ | badge | `explainWord` | ✓ + ✓🔊 | 🔖 bookmark + ✅ learn |
| 2 | Reading popup | `.modal`(head:detail+✕)+`.macts` | ✓ | ✓ | badge | `explainWord` | ✓ + ✓🔊 | ✅ learn (no bookmark) |
| 3 | Flash front | `.flash .front` | ✓ | ✓ (A4) | — | hidden (tap flip) | — | whole card flip; sticky rating bar below |
| 4 | Flash back | `.flash .back` | ✓ | ✓ | badge | `explainWord` | ✓ + ✓🔊 | rating bar 忘了/一般/轻松 (sticky) |
| 5 | Typed result | `.flash`+`.btn-row` | ✓ | ✓ | badge | `explainWord` | ✓ + ✓🔊 | ▶ next (`typedNext`) |
| 6 | Spell It (productive) | `.flash`(answer hidden) | hidden | ❌ (by design) | badge (A5) | `explainWord` | ❌ (no example) | check + 💡 first-letter + 👁 reveal |
| 7 | Context | `.flash`(masked sentence) | hidden | ❌ (by design) | badge (A5) | `explainWord`(fallback) | masked sentence as prompt (no 🔊) | check + 💡 + 👁 (same) |
| 8 | Quiz | `.flash`(meaning)+`.opt` | hidden | ❌ | — | `q.def` | ❌ | option buttons (`quizopt`) |

> Cards ① Daily, ② popup, ④ Flash back, ⑤ Typed result all share `wordDetailHTML(w)` → fully consistent fields & speakers. Card ③ Flash front adds a pre-flip 🔊 word. Cards ⑥⑦⑧ intentionally hide the answer (productive/context/quiz), so no word speaker by design.

### 14.2 Residual notes (non-blocking, for awareness)
1. **Bookmark entry** exists on Daily (①), the Reading popup (②, added in A7), and the Reading key-words chip; review cards ④⑤⑥⑦ still have no bookmark button. (Conscious scope choice — flagged for possible later addition.)
2. **Action-bar styling (partially unified, A8)**: ④ Flash back and ⑤ Typed result now share the **same frosted sticky-bottom action bar** (`.revacts`) — ④ houses the 3-color rating (忘了/一般/轻松), ⑤ houses a full-width "下一个" primary button; both aligned in radius (12px) and footprint. ⑥⑦ Spell It / Context use `type-row`+`typtoolbar` (💡/👁) which are **pre-answer input controls**, functionally distinct from post-answer action bars, so intentionally not merged into the same bar. ② popup uses `iconbtn` bookmark+learn (also a distinct post-answer style). Remaining cosmetic variance is by function, not accident.
3. **Spell It / Context prompt** show no example sentence by design (the definition / masked reading sentence *is* the prompt); speakers appear on the reveal/result card via `wordDetailHTML`.

### 14.3 Action history
- **A1 — speak-the-word on Daily** ✅ (via `wordDetailHTML` head).
- **A2 — shared `wordDetailHTML(w)`** ✅ (Daily, popup, Flash back, Typed result).
- **A3 — Reading popup uses `explainWord`** ✅ (popup body via `wordDetailHTML`).
- **A4 — speak-the-word on remaining review cards** ✅ Flash front pre-flip 🔊 added; reveal/result already covered by `wordDetailHTML`.
- **A5 — unify `pos` badge** ✅ Spell It & Context prompt now use `.wd-pos` badge (was inline muted text).
- **A6 — illustration consistency (+ `pic` field)** ✅ A word may carry a `pic` (image URL or `data:` URI) shown **in preference to `emoji`** wherever an illustration appears; `emoji` is the offline fallback. Centralized in `wordPicHTML(w)` used by the Daily `.illus`, the shared `wordDetailHTML` head (popup / Flash back / Typed result), and the Spell It `.big`. Daily keeps its big `.illus` and passes `hideEmoji` so the shared head emoji is suppressed (no duplicate). No current pack word sets `pic` yet, so behavior is unchanged (emoji shown); any pack author can now add `pic`.
- **A7 — Reading popup word-card 6-line layout + bookmark (2026-08-31)** ✅ `wordDetailHTML` restructured to a strict line order: ① word (+illustration) ② pronunciation + 🔊 speak-word ③ word class ④ explanation ⑤ sample sentence + 🔊 speak-sentence (+translation). The popup now shows this layout and its action bar gained a **bookmark** button beside "I learned it" (state refreshes in place). Daily / Flash back / Typed result share the same 6-line order automatically (emoji suppressed only on Daily, which keeps its hero `.illus`). Emoji placement decision: **on line ① (the word line)** as the mnemonic anchor tying spelling+sound to the image, kept compact so it never crowds pronunciation/pos/def/sentence.
- **A8 — unify review-card action bars (2026-08-31)** ✅ Flash back (④) and Typed result (⑤) now share the **same frosted sticky-bottom `.revacts` bar**: ④ = 3-color rating (忘了/一般/轻松), ⑤ = full-width "下一个" primary button; radius unified to 12px and footprints matched. ⑥⑦ Spell It / Context keep `type-row`+`typtoolbar` (💡/👁) as *pre-answer* input controls (functionally distinct, intentionally not merged); popup keeps `iconbtn` bookmark+learn. Residual variance is by function, not oversight.

> All word-card consistency actions (A1–A6) complete and synced. No further code changes pending in this audit.

## 15. Learning Status Schema Design (2026-08-31)

**Goal:** define a schema-driven model for a word's learning status, where **each status has a defined color** and any word shown in the UI is colored by its current status (Review card, Key Words chips, article bold words, flashcards).

### 15.1 Status model (3 orthogonal axes)
- **proficiency** (stored enum): `new → learning → learned`, plus `forgotten` (a learned word that lapsed).
- **lastOutcome** (transient event, not a long-term state): `remembered` / `forgotten`.
- **schedule** (derived, not stored): `due` (learned & `nextDue<=today`) / `scheduled` (learned & `nextDue>today`).
- `remembered` is *evidence that maintains* `learned`; it is never a persistent color — it falls back to `learned` (green) with a brief highlight.

### 15.2 Canonical statuses & colors
| Status key | Meaning (zh) | Color | CSS var |
|---|---|---|---|
| `new` | 未学 / 没学过 | `#3b82f6` blue | `--st-new` |
| `learning` | 初学 / 学习中 | `#3b82f6` blue | `--st-learning` |
| `learned` | 已掌握 | `#0a7d5a` green | `--st-learned` |
| `scheduled` | 未来复习（已掌握且未到期）| `#4fb286` light green | `--st-scheduled` |
| `due` | 待复习（已掌握且已到期）| `#b97a00` amber | `--st-due` |
| `forgotten` | 遗忘 / 掉落 | `#c23b1e` red | `--st-forgotten` |
| `remembered` | 刚记住（瞬时）| 沿用 `learned` 绿 + 短暂高亮 | — |

Colors intentionally reuse the existing palette where possible (`learned`=--accent2, `forgotten`=rate-forget red, `due`=rate-ok amber) so the scheme feels native. **Update (2026-08-31):** `new` is now the **same blue as `learning`** (`#3b82f6`) instead of gray — "not yet learned" words in the Reading/Review panels read as blue, clearly distinct from learned (green).

### 15.3 Progress JSON Schema (draft 2020-12)
```json
{
  "$defs": {
    "LearningStatus": { "type":"string", "enum":["new","learning","learned","forgotten"] },
    "LastOutcome": { "type":["string","null"], "enum":["remembered","forgotten",null] },
    "ReviewEvent": {
      "type":"object",
      "required":["at","rating"],
      "properties":{
        "at":{"type":"string","format":"date-time"},
        "rating":{"type":"integer","minimum":0,"maximum":5},
        "outcome":{"$ref":"#/$defs/LastOutcome"}
      },
      "additionalProperties":false
    }
  },
  "type":"object",
  "required":["word","proficiency"],
  "properties":{
    "word":{"type":"string"},
    "proficiency":{"$ref":"#/$defs/LearningStatus"},
    "nextDue":{"type":["string","null"],"format":"date"},
    "lastOutcome":{"$ref":"#/$defs/LastOutcome"},
    "lastReviewed":{"type":["string","null"],"format":"date-time"},
    "intervalDays":{"type":"integer","minimum":0},
    "ease":{"type":"number","minimum":1.3},
    "history":{"type":"array","items":{"$ref":"#/$defs/ReviewEvent"}}
  },
  "additionalProperties":false,
  "allOf":[
    {"if":{"properties":{"proficiency":{"const":"learned"}}},"then":{"required":["nextDue"]}},
    {"if":{"properties":{"proficiency":{"const":"new"}}},"then":{"properties":{"history":{"maxItems":0},"nextDue":{"type":"null"}}}}
  ]
}
```
Content schema (word object) stays as-is: `word, ipa, pos, def, defEn, ex, exzh, exEn, emoji` (+ optional `pic`, `level`, `tags:["review"]`). **Status is never stored in content** — it lives only in the learner's progress file.

### 15.4 Status→color is a presentation layer (keyed by the enum)
The color map is **not** in the data JSON; it is a theme keyed by the same status values, so adding a status = one enum value + one color, nothing else drifts.
```css
:root{
  --st-new:#3b82f6; --st-learning:#3b82f6; --st-learned:#0a7d5a;
  --st-scheduled:#4fb286; --st-due:#b97a00; --st-forgotten:#c23b1e;
}
```
A resolver decides the *displayed* status, then reads the color:
```js
function statusOf(word){
  const c = state.flashcards[wkey(word)];
  if(!c) return isLearning(word) ? "learning" : "new";      // not yet in deck
  if(c.proficiency === "forgotten") return "forgotten";
  if(c.proficiency === "learned")
    return (c.nextDue && c.nextDue <= today()) ? "due" : "scheduled";
  return c.proficiency;                                       // learning
}
function statusColor(word){ return `var(--st-${statusOf(word)})`; }
```

### 15.5 Display rule
Any word rendered with a known status carries `color: var(--st-<status>)`:
- Review card `.revword` → `style="color:${statusColor(w)}"` (replaces the current always-purple `.revword` at 194).
- Key Words `.kb` → same resolver.
- Article `<b>` bold words → same resolver (today every bold word is uniformly `--accent` purple; with this model, unlearned bold words become blue, learned green, etc.).
- Flashcards / rating bar can show a `due` amber dot to pull overdue words forward.

### 15.6 Implementation status (updated 2026-08-31)
**Partially implemented** (color-by-status live; full data-model consolidation deferred by choice):

- ✅ **Status colors are live.** `:root` carries `--st-*` vars (15.4); `statusOf()`/`statusColor()` resolve the displayed status from the progress model and return the theme color.
- ✅ **Words colored by status.** Review card `.revword` (1599–1601), Key Words `.kb` (1603), and reading article `<b>` (1634–1639) now render with `color: statusColor(...)`. Unlearned vocab → **blue** (since 2026-08-31; was gray); learned → green; due → amber; forgotten → red.
- ✅ **`forgotten` is now explicit.** `rateCard(q<3)` sets `c.proficiency="forgotten"` (was only resetting interval, indistinguishable from fresh). Rating `q>=3` restores `"learned"`. Free practice (`rateFree`) correctly does NOT touch status.
- ✅ **`proficiency` field added** to flashcards on creation (`learnWord` 998, `captureLearnedInPack` 1027) and maintained by `rateCard`. Legacy flashcards without `proficiency` fall back to `learned` via `learnedAny`, so old saved progress needs no migration.

**Deferred (intentional, low-risk):**
- `learnedWords` (binary list) was **kept** alongside flashcards rather than fully consolidated — it is still used for counts/cross-pack; `statusOf` reads both. Full consolidation remains a future option.
- `lastOutcome` / `history` event log and `ease` utilization (dead field) not added yet.
- Content side: Review list still an inline `"🔁 Review: ..."` string in `r.text` (parsed by regex in `refreshReading`), not yet structured `tags:["review"]`.

Net: the visible goal — *each status has a color, and displayed words reflect it* — is achieved. Remaining items are non-blocking refinements.

---

## 16. Reading & Review UI Polish Session (2026-08-31)

Status: **all implemented & synced** to `pwa/index.html` and `english-learning-tool.html` (MD5-identical).

### 16.1 Reading panel — `🔁 Review:` tail → separate clickable card
- The trailing `🔁 Review: ...` note in `r.text` (parsed at render time in `refreshReading`, regex `(?:🔁\s*)?Review\s*[:：][\s\S]*$`) used to sit **on the same last line** as the article text. It is now split into its own block:
  - Article body → `.reading-text`; tail → a `🔁 Review` **`.card`** rendered **immediately below the article, before the Key Words card** (same placement/flow as Key Words).
  - Each tail word renders as a clickable `.revword` chip inside the shared `.keys` wrap layout, opening the **word popup** (`data-act="wordpopup"`) and colored by `statusColor`.
  - `.revword` was aligned with Key Words chips: `font-weight:700` + `font-size:14px` (was 800 + inherited 16px — visually heavier than Key Words).
- Articles without a tail are unaffected.

### 16.2 Unlearned words are now blue
- `--st-new` changed `#9aa3b2` gray → `#3b82f6` blue (same hue as `--st-learning`), so everything "not yet learned" reads as blue — Review words, Key Words chips, and reading `<b>` words. Learned stays green, due amber, forgotten red. §15 updated to match.

### 16.3 Review panel polish
- **Flashcard front — IPA + 🔊 on one row:** the 🔊 button was a sibling *after* the `display:block` `.ipa` span, stacking word / IPA / 🔊 on three rows. The button now lives **inside** `.ipa` (`/IPA/ 🔊`), with compact styling `.flash .front .ipa .iconbtn` (inline-flex, small padding).
- **Flash back & typed result — left-aligned detail:** `.flash` centers content; the flipped card's `wordDetailHTML` output now forces `text-align:left` (`.flash .back` + `.flash .wd-head/.wd-pron/.wd-def/.wd-ex`), matching the Daily word card.
- **Section divider before the Listen & Learn card:** new `.revdiv` (`——— label ———` style) renders above the listen card with the listen title as the section label, clearly separating the review card from the 🎧 Listen & Learn card.
- **Duplicate headphone removed:** `listen_title` already carries 🎧; the card's extra `🎧 ` prefix was dropped (the card `h3` was replaced by the `.revdiv` label), so only one headphone shows.
- **Tap the listen card's current word → pause + popup:** the word now carries `data-act="listenWord"` (+ `.lk` dotted-underline style) in both `updateListenNow` and `listenCardHTML`; the click handler calls `listenStop()` then `openWordPopup(resolveWord(word, currentReading()), word)` — the same popup as the Reading panel. Clicking the word pauses playback and explains it in place.

---

## 17. Web UI Compliance & iPhone Accessibility Plan (approved & implemented 2026-08-31)

Status: **implemented + deployed.** All six batches (B1–B6) are coded in `english-learning/pwa/index.html`, mirrored to `english-learning-tool.html`, the service-worker cache is bumped to **`ed-bc9c5375`**, and the hosted link `https://889d525c87954023a62ef99476da83bd.app.workbuddy.link/` now serves that build (verified 2026-09-01). Close & reopen the app once on the phone to pick up the new SW. *(Superseded 2026-09-05 by the §12.1 content deploy — live hash is now `ed-c493f6c4`; the B1–B6 code itself is unchanged and still live.)*

**Scope of every batch:** edits land in `english-learning/pwa/index.html` (the hosted source), then get mirrored to `english-learning/english-learning-tool.html`, then redeploy (→ new `ed-xxxx` hash). Line numbers are approximate (from the audit pass) and given as `selector / feature` for durable reference.

**Standards referenced:** WCAG 2.1 AA (SC 1.4.4, 1.4.10, 1.4.3, 2.1.1, 2.1.2, 2.4.7, 2.3.3, 4.1.2, 4.1.3), Apple HIG (iOS 17/18): ≥44pt tap targets, safe-area insets, `prefers-reduced-motion`, `apple-mobile-web-app-*` meta.

### 17.1 Batch 1 — Critical + iPhone-blocking (recommended first; low risk, high payoff)
| # | Target | Current | Proposed change | Standard |
|---|---|---|---|---|
| 1.1 | `<meta name="viewport">` (line 5) | `..., maximum-scale=1, user-scalable=no, viewport-fit=cover` | **Remove** `maximum-scale=1, user-scalable=no`; keep `viewport-fit=cover` | WCAG 1.4.4 / 1.4.10; Apple review |
| 1.2 | `input,select,textarea` font-size (CSS ~:130) | inherits 15px on `.typeInput` etc. | set these controls to `font-size:16px` (body stays 16px; only inputs bumped) | Prevents iOS Safari focus zoom (Apple HIG) |

### 17.2 Batch 2 — Color contrast (WCAG 1.4.3, AA = 4.5:1)
| # | Target | Current | Proposed change |
|---|---|---|---|
| 2.1 | `--muted:#8a8da3` (`:17`, used by `.muted`/`.tabbar`/`.stat .l`/`.note`) | ~3.3:1 on white | darken to `#6b6f86` (~5:1) |
| 2.2 | warn badge: white text on `--warn:#ff8a5c` (`:20`/`:88`) | ~2.3:1 | use dark text `#7a3b00` on the orange, or deepen bg |
| 2.3 | `.rate-ok` `#b97a00` on `#fff7e6` (`:285`) | ~3.4:1 | `#8a5a00` (~5:1). (`.rate-easy`/`.rate-forget` already pass — leave them.) |

### 17.3 Batch 3 — Accessible names & keyboard reachability (WCAG 2.1.1, 4.1.2)
| # | Target | Issue | Proposed change |
|---|---|---|---|
| 3.1 | Reminder switch `<input>` (`:451-454`), time `type=time` (`:456`), speed `range` (`:432`), notes `textarea` (`:444`) | no `for/id` or `aria-label` → SR reads no name | add `aria-label` (or visible `<label for>`) to each; `range` gets `aria-label` "语音语速" |
| 3.2 | Clickable `div`/span: quiz `.opt` (`:200`/`:1650`/`:2092`), `.revword` (`:197`/`:1627`), reading blue `<b>` (`:1661-1666`) | no `role`/`tabindex` → keyboard users cannot activate | add `role="button" tabindex="0"` + Enter/Space handling in the existing keydown listener (mirror the already-correct `.flash` card at `:1855`/`:2554`) |

### 17.4 Batch 4 — Dialog / toast / tablist semantics (WCAG 4.1.2, 4.1.3, ARIA patterns)
| # | Target | Issue | Proposed change |
|---|---|---|---|
| 4.1 | `.modal-mask` (`:340-341`/`:1296`/`:2596`) | no `role="dialog"`/`aria-modal`, no Esc, no focus trap, no initial focus | add `role="dialog" aria-modal="true"`; Esc closes; trap focus; focus close-btn on open; restore focus to trigger on close |
| 4.2 | `.toast` (`:311-316`/`:2445`) | status text invisible to SR | add `role="status" aria-live="polite"` |
| 4.3 | Tab bar `role="tablist"/tab` (`:393-403`) | missing `tabpanel` + arrow-key nav | add `role="tabpanel" aria-labelledby` to each panel; implement ←/→ arrow navigation (ARIA Tabs pattern) |

### 17.5 Batch 5 — Motion & focus visibility (Apple HIG, WCAG 2.3.3, 2.4.7)
| # | Target | Issue | Proposed change |
|---|---|---|---|
| 5.1 | animations/transforms (`:93-95`, `:active`) | not downgraded when user enables "减弱动态效果" | add `@media (prefers-reduced-motion: reduce){ *{animation:none!important;transition:none!important} }` |
| 5.2 | global focus | keyboard users have no focus ring | add `:focus-visible{ outline:2px solid var(--accent); outline-offset:2px }` |

### 17.6 Batch 6 — Suggestions (lower priority; some optional)
| # | Target | Proposed change | Note |
|---|---|---|---|
| 6.1 | Touch targets < 44pt: `langbtn` 36px (`:62`), `.iconbtn.small` ~32px (`:123`), `.rate-btn` ~37px (`:281`), `.keychip` ~26–30px (`:334-336`) | enlarge to ≥44×44 where feasible | Apple HIG |
| 6.2 | `.toast` bottom:90px (`:312`), `.modal` (`:342`) | add `env(safe-area-inset-bottom)` padding | avoid iPhone home-indicator overlap |
| 6.3 | `<head>` (`:6-7`) | add `<meta name="apple-mobile-web-app-title" content="EnglishDaily">` | nicer Home-Screen label |
| 6.4 | dynamic manifest injection (`:2650-2658`) | add a static `<link rel="manifest">` in `<head>` in addition (Safari reads manifest at Add-to-Home time) | robustness |
| 6.5 | **Security:** `wordDetailHTML`/`explainWord` build `innerHTML` from `w.word/w.def/w.ex` (`:1532-1546`/`:1627`) | escape/sanitize pack-provided strings (esp. imported/JSON packs) before `innerHTML` | prevents stored-XSS via crafted pack JSON |
| 6.6 | landmarks: `<main>` (no `aria-label`), `<section>`s (no `aria-labelledby`) | add `aria-label` to `<main>`, `aria-labelledby` to sections tied to their `<h2>` | WCAG 1.3.1 |
| 6.7 | maintainability: many inline `style="..."` in templates | extract to classes where repeated | non-functional cleanup; optional |

### 17.7 Recommended approval order
1. **Batch 1** first (unblocks zoom + kills iOS focus-zoom — directly improves the iPhone experience).
2. **Batches 2 + 5** (contrast + motion/focus — pure CSS, zero behavior risk).
3. **Batches 3 + 4** (a11y wiring — needs JS + keyboard testing).
4. **Batch 6** (polish + the XSS hardening in 6.5).

Each approved batch → implement → mirror local file → redeploy → report the new `ed-xxxx` hash. The live link (`app.workbuddy.link`) is unchanged; users just close & reopen the app once after a deploy.

> Note: Batch 6.5 (XSS) is a **security** item, not merely cosmetic — recommend including it even if the rest of Batch 6 is deferred.

