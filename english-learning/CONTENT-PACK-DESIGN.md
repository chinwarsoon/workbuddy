# Content-Pack Design Review — separate JSON per goal

> Status: **PROPOSAL FOR REVIEW ONLY.** No files were changed. Nothing was implemented yet.

## 1. What you asked for
- Each **learning goal** (travel / work / exam / hobby / culture, or any new one) should store its content in a **separate JSON file**.
- When a **new JSON file is added**, the app should **load it automatically**.
- All three modules — **Daily words, Reading, Review** — should then draw their content from the loaded file(s).

## 2. Current state (what is hardcoded today)
Right now all content lives inside the single HTML as JavaScript constants:
- `WORDS` — 40 words (the Daily + Review source)
- `READINGS` — 6 graded texts (the Reading source)
- `AREA_TASKS` — the weekly-plan task bank
- `AREA_LABEL` — the goal/area labels

The app reads these directly. To support per-goal JSON we must (a) move content out into JSON, and (b) make the render functions read from a merged content pool instead.

## 3. Core concept: "Content Pack"
A **content pack** = one JSON file describing one goal. Structure:

```json
{
  "id": "travel",
  "name": { "zh": "旅行交流", "en": "Travel & Conversation" },
  "words": [
    { "word":"serene", "ipa":"/sɪˈriːn/", "pos":"adj.",
      "def":"宁静的", "defEn":"calm/peaceful",
      "ex":"The lake was serene at dawn.", "exEn":"...", "exzh":"黎明时湖面宁静。",
      "emoji":"🌅" }
  ],
  "readings": [
    { "title":"晨光", "titleEn":"Morning Light", "level":"A1",
      "text":"...", "vocab":[{"w":"rise","d":"升起","dEn":"go up"}],
      "questions":[{"q":"...","options":["..."],"a":1}] }
  ],
  "areaTasks": { "vocab":["学 2 个新词","复习生词卡"], "reading":["读一篇短文"], ... }
}
```

The app merges all loaded packs into one **content pool** that the three modules read from.

## 4. Auto-load — the key technical reality
Your three usage modes behave differently, so "auto-load a new file" means different things per mode:

| Mode | Can it auto-load new JSON? | How |
|------|---------------------------|-----|
| ③ Hosted PWA (`https://`) | ✅ Yes | A `content/manifest.json` lists every pack file. App `fetch()`es the manifest, then each file. **Adding a file = drop it in `content/` + add its name to `manifest.json`.** Next open loads it. (Static hosts have no folder listing, so a manifest is required.) |
| ① / ② Local `file://` (opened from Files app / Add-to-Home) | ⚠️ No true auto-detect | Browsers block `fetch()` of local files. So on local mode: (1) a **built-in default pack stays embedded** so the app always works with zero setup; (2) a new pack is loaded once via an **"Import Content Pack"** button (reuses the existing backup-import file picker). Progress/imported packs are saved in `localStorage`. |

**Honest limitation:** On local `file://` there is no way for the app to "notice" a new file on its own — iOS won't let a webpage watch the filesystem. True automatic pickup only works on the hosted PWA. On local mode it's a one-tap import. This is a browser security rule, not a code choice.

## 5. Goal selection in the UI
- The Plan Builder gets a **"Goal / Content Pack"** selector listing every loaded pack (Built-in + imported + hosted) plus an **"All packs (combine)"** option.
- Selecting a pack sets `state.activePack`. The plan's current `goal` field becomes a reference to a pack id.
- Daily / Reading / Review then read from that pack (or the merged pool if "All").

## 6. How the three modules recompute
- **Daily words** — cycle deterministically through the active pack's word list by day index: day `d` → `words[d*2]`, `words[d*2+1]`. Each pack can have a different number of words; day count adapts.
- **Reading** — week index → `readings[week % readings.length]` from the active pack.
- **Review** — flashcards already track each learned word; each card stores its `packId`, so the review queue pulls from the active pack (or all if "All"). Switching packs keeps per-pack review cleanly separated.

## 7. Clean separation: content vs progress
- **Content (what to learn)** → JSON files (per goal). Swappable anytime.
- **Progress (what you learned)** → stays in `localStorage` key `englishDaily_v1` (learned words, flashcards, bookmarks, streak, notes, readings done).
- Progress references a word by `(packId, word)`. You can swap/replace a content file without losing your streak or learned-word history. If a word disappears from a pack, its review card degrades gracefully (shows the word, no definition).

## 8. Proposed implementation steps (after your approval)
1. Define a `content/manifest.json` + sample packs (`travel.json`, `work.json`, `exam.json`, `hobby.json`, `culture.json`) for the PWA bundle.
2. Keep the current WORDS/READINGS/AREA_TASKS as a **built-in fallback pack** embedded in the HTML (so local mode still works with no setup).
3. Add `loadContentPacks()`: on `https` fetch manifest + files; on `file://` use built-in + imported-from-localStorage.
4. Add **"Import Content Pack"** button + store imported packs in `localStorage`.
5. Add the goal/pack selector to the Plan Builder; persist `state.activePack`.
6. Refactor `todaysWords()`, `refreshReading()`, `renderReview()` / `buildQuiz()` to read from `activeContent()`.
7. Update `WORKPLAN.md` with a "How to author a content pack" guide.
8. Re-deploy PWA (link unchanged); local single file stays self-contained with built-in pack + import button.

## 9. Decisions I need from you
- **Default behavior:** Should "All packs (combine)" be the default, or should the app default to the built-in pack until the user picks one?
- **Local-mode expectation:** Are you OK with local `file://` using a one-tap import (instead of true auto-detect)? Or will you mainly use the hosted PWA, where auto-load works fully?
- **Pack naming:** Do you want me to pre-generate the 5 sample goal packs (travel/work/exam/hobby/culture) by splitting the current 40 words + 6 readings, or keep the current set as one "General" pack and let you author your own?
- **File location:** For the hosted PWA, packs live in a `content/` folder next to `index.html`. Confirm that's fine.

## 10. Risks / limitations
- Local `file://` cannot auto-detect new files (browser security) — mitigated by import button.
- Static hosts need the manifest updated when adding a file (no directory scan).
- Corrupt/missing JSON is skipped with a friendly message; app keeps running.
- Bilingual fields (`def`/`defEn`, `ex`/`exEn`, `title`/`titleEn`) must be present in each pack for the EN/中文 toggle to stay complete.
