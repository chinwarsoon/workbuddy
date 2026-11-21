# MDL I-122 — Content Vertical Scroll Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.1 | 2026-11-20 | CodeBuddy | Corrected the Tier 2 failure note and added U003 results. |
| 1.0 | 2026-11-20 | CodeBuddy | Report for I-122: no vertical scrollbar when page content exceeded one screen. |

## 1. Issue

After the rev 1.96 shell increment, `#app` used `height:100vh` with `overflow:hidden`. The content
zone and content body had no scroll rule. A page with panels below the viewport clipped them, so the
user could not reach lower content.

I-122 is recorded in `MDL/mdl-issues.md` revision 1.44 and `MDL/log/issue_log.md`.

## 2. Spec requirement

Spec §3.1 requires a scrollable content area.

Spec §3.5 requires the warning area to stay above the filter strip and outside the scrolling body.
No spec change was needed. The defect was in MDL.

## 3. Changes

`MDL/src/render.mjs`:

- `.shell-main` now uses `flex:1 1 auto;min-height:0`.
- `[data-shell="content"]` now uses a min-height-zero flex column with hidden overflow.
- `[data-shell="body"]` now uses `overflow-y:auto`, `overflow-x:hidden`, and
  `overscroll-behavior:contain`.
- The warning and filter strips stay outside the scrolling body.

`harness-layout/harness.mjs`:

- Added `lintContentScroll()` to Tier 2.
- It visits every discovered `[data-page]` view.
- It adds a temporary 2000 px probe to `[data-shell="body"]`.
- It checks `overflow-y`, `scrollHeight`, `scrollTop` movement, strip placement, and content width.
- It removes the probe after each measurement.

`harness-layout/checks/mdl.mjs`:

- Added the `contentScroll` config and enabled the check for MDL.

`MDL/test/test_shell.mjs`:

- Added three assertions for the shell height, content flex column, and body scroll rule.

U003 then changed the shell geometry:

- `#app` uses a three-row grid: header, shell, status bar.
- `html` and `body` hide page scroll.
- The status bar and warning bar are in document flow.
- The fixed-bar `--banner-h` padding rule was removed.

`MDL/MDL-Dashboard.html` was rebuilt at 262,277 B for U002 and at 261,484 B for U003.

## 4. Verification

| Check | Result |
|---|---|
| `node --check src/render.mjs` | PASS |
| `node build.mjs` | PASS |
| `node test/test_shell.mjs` | 23 passed / 0 failed at U002; 28 passed / 0 failed after U003 |
| `node harness.mjs --dashboard mdl --tier 2` | 50 passed / 3 failed at U002; 53 passed / 0 failed after U003 |
| New harness scroll checks | 25 passed / 0 failed |
| U003 shell assertions | 5 passed / 0 failed |

The 25 new harness checks cover five pages: Overview, Progress, Overdue, Validation, and Documents.
Each page passes five checks. Three Tier 2 geometry checks also failed during U002 verification:

- `left sidebar and content end at the status bar`
- `HTML and body fill viewport with page scrolling disabled`
- `warning area stays inside content width`

I first recorded them as older failures. I did not verify a baseline. U003 fixed all three checks.
Tier 2 now has no failures.

## 5. Rollback

Restore the files listed in U002 and U003 from Git history. Rebuild `MDL-Dashboard.html` from the
restored source. No shared spec file changed.

## 6. Notes

The harness check is shared. Other dashboards can enable it by adding a `contentScroll` config. PPP
and Sub are unchanged because their configs do not enable the check.
