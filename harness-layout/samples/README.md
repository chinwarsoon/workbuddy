# Shell sample — study and review

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-30 | opencode (AI) | First shell study sample for review: measurements, spec-to-`AGENTS.md` conflicts, and scope deviations. |

A standalone page that renders the shell required by the repository root
`Dashboard-UI-Design-Spec.md` (§3.1–§3.3, §3.5, §3.6). It exists for **review only**: no project
dashboard has adopted it yet.

- `dashboard-shell-sample.html` — the sample. Self-contained: inline CSS, inline module script,
  no external asset, no build step. Runs from `file://`.
- `shell-light.png`, `shell-dark.png`, `shell-dark-settings.png`, `shell-light-1280.png`,
  `shell-search.png` — review screenshots at 1440 × 900 and 1280 × 800.

## 1. What the sample shows

| Area | Sample content |
|---|---|
| Title bar | Logo chip, project title, meta line (project start · as-of date), active page label at the right |
| Menu bar | Sidebar toggle, `Load Workbook` (primary), `Export`; right group: Discipline and Status filter triggers, `Search`, `Warnings` (count), layout toggle |
| Left sidebar | Three page links, then `Settings` and `Help` pinned to the bottom, drag handle at the right edge |
| Content | Warning area (`V-26` warning + `INFO` line), then the body: KPI panel at full width and two panels below |
| Status bar | Loaded-workbook summary at the left, version string at the right |
| Themes | `light` (default), `dark`, `sky`, `ocean`, `presentation`; chosen in the Settings dialog |
| Interaction | Page switch, sidebar collapse and resize (180–480 px), filter popovers, search popover, warnings hide/show, layout 1/2/3 cycle, Settings and Help dialogs |

## 2. Measurements (1440 × 900, light theme)

| Element | Measured | Spec / note |
|---|---|---|
| Title bar height | 77.7 px | Three rows: title, meta, active page label |
| Menu bar height | 49 px | One row; includes the 1 px bottom border |
| Menu-bar controls | 32 px high | `Load Workbook` 12 px / 600, blue |
| Active page label | 16 px / 600, plain text | Right-aligned in the title bar |
| Left sidebar width | 190 px | Spec says 160 px — see §3, finding 1 |
| Status bar height | 30 px | Navy, full width |
| KPI card | 72 px high, 5 columns at 1440 | 6 cards → 5 + 1 |
| KPI card at 1280 | 4 columns | 6 cards → 4 + 2 |
| Content toolbar | None | Content is filter area → body |
| Horizontal overflow | None | At 1440 and 1280 |
| Sidebar collapse | 190 → 0 px | Toggle button and drag handle both work |
| Sidebar resize | 190 → 310 px | Clamped 180–480 px |

## 3. Findings

1. **Sidebar width.** The spec derives 160 px from the label "Forward Plan". That label is 80.4 px
   wide, not 91 px, so 160 px is too narrow for the real label "Forward and Overdue" (134.2 px of
   text). With icon, gaps, and padding the minimum usable width is about 179 px. The sample uses
   190 px and clamps the drag minimum at 180 px. **Decision needed:** raise the spec width, or
   shorten the label.
2. **Sidebar wrap.** At 160 px the label wraps to two lines, which pushes the menu down and changes
   the shell rhythm. The sample therefore does not reproduce the spec value.

## 4. Conflicts between the spec and `AGENTS.md` §18

The root spec is newer than `AGENTS.md` revision 1.15. These points disagree and need one decision
each:

| # | Topic | Spec | `AGENTS.md` |
|---|---|---|---|
| 1 | Settings / Help | Left sidebar, pinned bottom (§3.2) | Menu-bar buttons with modals (§18.2) |
| 2 | File loading | `Load Workbook` in the menu bar (§3.2) | File-loading panel in the left sidebar (§18.7) |
| 3 | Content toolbar | No toolbar; filter area then body (§3.3) | Toolbar strip inside the content area (§18.2) |
| 4 | Layout toggle | Right end of the menu bar (§3.2) | Title bar (§18.8) |
| 5 | Theme picker | Not listed in the menu bar (§3.2) | Menu-bar dropdown (§18.4) |
| 6 | Panel title weight | 700 (§4) | 600 (§6 type scale) |

The sample follows the spec on items 1–5, except that the theme picker is a `select` inside the
Settings dialog so that all five themes can be reviewed. Item 6 uses 700, per §4.

## 5. Scope deviations (deliberate)

- No welcome overlay (§3.7). The sample opens with data loaded, because the shell is the subject.
- No pipeline progress area (§3.8) and no split-header table (§7.2.15). Both belong to a real
  dashboard, not to the shell.
- The filters and the search field are static. They update the status bar and the count text, but
  they do not recompute the sample content.
- Workbook names, package rows, and KPI values are illustrative. They are not PPP data.

## 6. Checks

```bash
cd harness-layout
node harness.mjs --dashboard _shellreview --tier 1
node harness.mjs --dashboard _shellreview --tier 2
```

The leading `_` keeps this config out of the default `node harness.mjs` run.

| Run | Result |
|---|---|
| Tier 1 | 8 passed, 0 failed, 1 skipped (no pipeline config) |
| Tier 2 | 23 passed, 0 failed |

## 7. Review asks

1. Fix the sidebar width in the spec (finding 1): 190 px, or a shorter label.
2. Resolve the six conflicts in §4, then update `AGENTS.md` §18 or the spec, so one source wins.
3. Approve the sample as the visual baseline before any project dashboard adopts the shell.
