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
- 🔁 **Spaced-repetition flashcards** (Review tab) — simplified SM-2 algorithm; one **global schedule per word** (not per pack), so a word learned in any pack keeps its schedule everywhere. Modes: 🔁 current-pack due queue, 🌐 **All Packs** cross-pack due queue, 📚 free browse (no scheduling), ✍️ quiz. The nav badge shows the global due count.
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
- **Share link:** https://889d525c87954023a62ef99476da83bd.app.workbuddy.link

> **You can use all three at once.** They are just different entry points to the same app. They do **not** conflict.

### ⚠️ Critical: the three options do NOT share progress
Each entry point has its **own independent `localStorage`** (storage is isolated per "origin"):
- `file://` (option ①/②) → one progress set
- `https://...app.workbuddy.link` (option ③) → a different progress set

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

**Status:** Phase 1–4 are **complete** and registered in both `content/manifest.json` and `pwa/content/manifest.json`. The hosted PWA's `sw.js` cache is bumped to `ed-v28` (includes `./content/freq-4k.json`). To preview, open `pwa/index.html` (or the hosted share link) and pick **高频词·第4阶 (COCA 学术拓展)** from **Me → Content Pack**.

> **Known minor inconsistency (non-blocking):** the `manifest.json` `name` fields say `(0–1000)` / `(1001–3000)` while each pack's internal `name` says `(NGSL 1–1000)` / `(NGSL 1001–2809)`. The displayed selector uses the manifest names; both describe the same content. Harmonize later if desired.

