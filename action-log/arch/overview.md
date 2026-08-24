# Folder Review & Picture-Link Review Plan — ActionTracker

## 1. Current state (verified by reading the files)
- **Flat layout**: `index.html`, `styles.css`, `core.js`, `editor.js`, `render.js`, `report.js`, `io.js`, `settings.js`, `bootstrap.js` all sit in the same folder, plus data `action.json`/`setup.json`.
- **Action description list = the dated detail log** (`detailLog[]`). Each row is currently only `{ date, text }` — a plain `<textarea>`. No `paste` handler, no clipboard, no upload, no image field.
- **Save/serialize** (`io.js:230` `serializeData`) only maps `date`+`text`; `applyDataset` (`io.js:153`) defaults `detailLog` with no image support. Preview (`render.js:189` `reportHtml`) and the live preview both render `esc(r.text)` as text only.
- **Data loading**: `fetch('action.json')` on http(s); file picker on `file://`. Saves use the File System Access API (`showSaveFilePicker` / `showDirectoryPicker`) when available, download otherwise.

**Conclusion**: the detail log *can* mention a picture filename as text today, but it cannot display or open it. It is **not** suitable as a review surface until the linked picture can be shown.

## 2. Proposed folder structure
```
index.html              ← entry, stays at root
css/
  styles.css
js/
  core.js  editor.js  render.js  report.js  io.js  settings.js  bootstrap.js
assets/
  pictures/            ← dedicated pictures subfolder (.gitkeep)
action.json  setup.json   ← kept at root for zero-risk data loading
```
Rationale: only `index.html`'s `<link>`/`<script>` paths change; `action.json`/`setup.json` stay at root so `resolveDataUrl()` and the FS-Access `startIn` logic keep working untouched. (Alternative: move data into `data/` — needs a small `resolveDataUrl` edit; available if you prefer it.)

## 3. Picture-link feature design (FINAL approach, 2026-08-21)
**Data model**: `detailLog[i].images = [{ name, src }]`. `src` is exactly one of:
- `assets/pictures/<name>` — file already on disk (rules 1 & 3 generate this);
- `data:<mime>;base64,...` — embedded in JSON (rule 2 generates this).
Render/lightbox/export decide inline vs path by testing `src.startsWith('data:')`.

**Storage triangle (user-specified, FINALIZED 2026-08-21):**
1. **Manual pre-place + link (rule 1):** user copies the image into `assets/pictures/` with their file manager, then types the relative link `assets/pictures/<name>` in the row. App stores the link only — NO validation. If the URL is invalid / file missing, the image simply does not render and an error message is shown (broken-image state + inline notice). No pre-save probing.
2. **File from another location → ALWAYS embed (rule 2):** when the user picks a file NOT in `assets/pictures/` (desktop / downloads / other drive), the app reads bytes and embeds as `data:` URL in the JSON — always, no exception. No disk write. This guarantees no picture is ever lost. Cost: JSON size. (No manual save-as option.)
3. **Chromium auto-copy (rule 3):** on Chromium, the `📎` picker downloads/copies the picked file into `assets/pictures/` via FS-Access `dataDirHandle`, then stores the NEW relative URL (`assets/pictures/<name>`). Non-Chromium skips this and falls to rule 2 (embed).

**UI for the two entry points (proposed):**
- `🔗 Link existing` — text field to type `assets/pictures/<name>` (rule 1; file already placed).
- `📎 Attach` — file picker; Chromium auto-copies to folder + link (rule 3), other browsers embed (rule 2).

**Display**: row shows a thumbnail chip (name + small preview). Click opens a **review lightbox** (full image, filename, download/close). Live preview (`reportHtml`/`syncPreview`) and Word/Excel export render `<img>` too.
**Persist**: `serializeData` includes `images`; `applyDataset` defaults `images:[]`.

**Resolved micro-decisions (2026-08-21):** (a) rule 1 = trust-only link, invalid/missing → broken-image + error message, no probe; (b) rule 2 = always embed (no loss of pictures), no manual save-as; (c) rule 3 = auto-download into asset folder on pick, use new URL; filename collision → `name_1`, `name_2`.

## 6. Implementation status (2026-08-21)
- **Code changed (still flat on disk; subfolder move is a manual step, see §7):**
  - `index.html`: stylesheet → `css/styles.css`; 7 scripts → `js/*.js`; added `#imgReviewModal` lightbox.
  - `io.js`: `writePictureToAssets(file)` (Chromium: writes into `assets/pictures/` via existing `dataDirHandle`, collision-safe `_1/_2`); `applyDataset` defaults `detailLog[*].images=[]`. `serializeData` already preserves `images` (via `...rest`).
  - `render.js`: `logRowHtml` adds image chip area + `📎 Attach` / `🔗 Link` controls; `bindLogRow` wires file picker → rule 3 (Chromium download) or rule 2 (`data:` embed) and link input (rule 1); `renderChips` shows chip with broken-image fallback + remove; `openImgReview`/`closeImgReview` lightbox (broken/error state for invalid links); `reportHtml` + live preview render `<a class="ae-rep-img">`; both serialize spots include `images`.
  - `report.js`: `detailLogRows` embeds `data:` images in Word export, shows link text for relative paths.
  - `styles.css`: `.ae-img-*`, `.ae-rep-img`, `.img-review-*` styles.
- **Verification**: agent Bash sandbox returned "Connection lost" each run; `node --check` not executed. Manual review done. User must run the checks in §7 locally.

## 7. Manual steps for the user (PowerShell, in the project folder)
A ready-made script `restructure.bat` (in the project root) does all of this: create subfolders, move the 7 JS + styles.css, then `node --check` every module. Run it by double-clicking or:
```
.\restructure.bat
```
Manual equivalent (PowerShell, in the project folder):
```
mkdir css, js, assets\pictures
move styles.css css\
move core.js js\; move editor.js js\; move report.js js\; move io.js js\; move render.js js\; move settings.js js\; move bootstrap.js js\
# action.json / setup.json stay at root
```
Then run: `node --check io.js ; node --check render.js ; node --check report.js ; node --check core.js` (the .bat does this from inside `js/`).

## 4. Suitability evaluation for "review purposes"
| Described detail | Today | After change |
|---|---|---|
| Description list holds dated entries | ✅ good for chronological review | ✅ unchanged |
| Reference a picture in an entry | ⚠️ link is dead text, no display | ✅ structured `images[]` with relative links |
| Display the linked picture | ❌ impossible | ✅ thumbnails + full-screen review lightbox |
| Inspect/review workflow | ❌ text-only | ✅ click-to-review matches design/construction review (e.g. TWRP submittals) |
| Portability for sharing | ✅ single JSON | ⚠️ needs `assets/pictures/` to travel with JSON; export Word/PDF embeds images for distribution |
| Cross-device / file:// | ✅ JSON only | ⚠️ file-link needs the folder beside `index.html`; data-URL fallback covers other browsers |

**Verdict**: text-only is unsuitable for visual review. With a dedicated `pictures/` subfolder + link references + a review lightbox, the description list becomes a proper review surface. Main caveat to manage: the pictures folder must travel with the JSON (working copy), while exports (Word/PDF/Excel) embed the images for distribution.

## 5. Decisions needed before I implement
1. Data files: keep at root (recommended, zero risk) or move to `data/`?
2. Picture storage: file-link (FS Access) + `data:` URL fallback (recommended) — OK?
3. Approve generating the restructured `index.html` + `js/`/`css/`/`assets/pictures/` and deleting the old flat duplicates?
