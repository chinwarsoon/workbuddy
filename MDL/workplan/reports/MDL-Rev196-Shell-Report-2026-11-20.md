# MDL Rev 1.96 Shell Increment Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-20 | CodeBuddy | Report for the approved rev 1.96 shell increment. |

## 1. Scope

Work item T11.7 in `MDL/MDL-Dashboard-Workplan.md` §11.7.

Owner decisions:

- Follow the spec left sidebar.
- Remove Print / Save PDF.
- Hold Breakdown for MDL.
- Keep the spec XLSX export.
- Use an inlined writer and keep zero package dependencies.

Out of scope: two-panel Validation, pagination above 200 rows, chart hover windows, table crosshair hover states, and the full token inventory. These are open under I-121.

## 2. Changes

`MDL/src/render.mjs`:

- Added shell markers: `titlebar`, `menubar`, `left-sidebar`, `content`, `statusbar`, `warnings`, `filter-area`, and `body`.
- Added the MDL page sidebar: Overview, Progress, Overdue, Validation, and Documents.
- Added pinned Settings and Help controls.
- Added the active page label, sidebar toggle, and sidebar resizer.
- Added Theme and Layout selects in Settings. Theme and layout persist in `localStorage`.
- Added five theme token sets.
- Removed the Print / Save PDF menu button.
- Added the top-menu Export control and an inlined XLSX writer.
- Changed all download names to `PROJECT_purpose_YYYY-MM-DD.ext`.
- Assigned panel numbers in DOM order after every render.

`MDL/MDL-Dashboard.html` was rebuilt at 262,109 B.

## 3. Verification

| Item | Result |
|---|---|
| `node --check src/render.mjs` | PASS |
| `node build.mjs` | PASS |
| `node test/test_shell.mjs` | 20 passed / 0 failed |
| `node test/test_pipeline.mjs` | 96 passed / 7 failed, unchanged baseline |
| `node test/test_grid.mjs` | 42 passed / 1 failed, unchanged baseline |
| `node --max-old-space-size=8192 test/test_render.mjs` | Not completed. Pre-existing jsdom heap failure. |

The full render suite failed before the increment with the same heap error. The lightweight shell suite covers the new behavior without rendering the full workbook.

## 4. Issues and logs

- I-35: resolved. Left navigation is implemented and verified.
- I-121: raised for the remaining rev 1.96 gaps.
- `MDL/log/issue_log.md`: I-35, I-121.
- `MDL/log/update_log.md`: U001.
- `MDL/log/test_log.md`: TL001–TL003.

## 5. Rollback

Restore `src/render.mjs`, `MDL-Dashboard.html`, workplan, issue log, tests, and logs from Git history. No shared file was changed.

## 6. Lessons learned

- The full-workbook render suite cannot run in this environment. New work needs a lightweight harness that stubs only the heavy panel renderers.
- ZIP stored-file entries are enough for a valid minimal XLSX workbook without package dependencies.
- Workplan decision rows and backlog text must be updated with the new decision. Otherwise old deferrals contradict the delivered code.
