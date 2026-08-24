# index.html 布局设计评估报告

> 评估对象：`C:\Users\franklin.song\WorkBuddy\2026-08-12-16-57-22\index.html`（单文件 Project Action Tracker）
> 评估日期：2026-08-19 · 由 UI Designer 完成
> 结论：**架构骨架优秀，存在 2 个功能级缺陷 + 7 个一致性/体验问题 + 6 个可访问性与整洁度问题**，建议按文末 Sprint 顺序迭代。

---

## 一、整体评价

当前布局是一个**四栏应用外壳 + 底部状态栏**的桌面优先 Shell：

```
┌─────────┬──────────┬──────────────────────┬────────────┐
│ Activity│ Sidebar  │ Editor（唯一内容区）  │ Right panel│
│ bar 56px│ 260px    │ minmax(0,1fr) 自适应  │ 300px      │
├─────────┴──────────┴──────────────────────┴────────────┤
│ Status bar 30px（数据源 + 保存/加载）                    │
└──────────────────────────────────────────────────────────┘
```

- 三栏（Activity/Sidebar/Right）都可整体隐藏（`hide-*` 类 + `--aw/--sw/--rw:0px` 双保险），侧栏/右栏可调宽（180–360 / 220–380），全部由 `setup.json` 驱动并持久化 —— 这个可配置壳设计是**明显优点**。
- 内联编辑器 + 实时预览共用 `reportHtml()` 单一渲染源（预览 = Word 导出 = 报告），避免双份实现 —— 架构上正确。
- Apple 视觉 token 贯彻到位：`#0066CC / #F5F5F7 / #1D1D1F`、Inter、18px 模态圆角、22px 胶囊按钮、9px 树节点圆角、状态/优先级色由 schema 驱动 + `textOn()` 亮度自适应（亮底深字/深底白字）—— 对比度处理做得好。
- 空状态、Toast、面包屑、状态栏数据源指示灯（external/imported/embedded 分色）齐全。

---

## 二、问题清单（按优先级）

### P0 —— 功能缺陷（建议立即修）

| # | 位置 | 问题 | 证据 |
|---|------|------|------|
| 1 | 响应式 ≤900px | **侧栏/右栏抽屉没有任何打开入口**：`m-show-side` / `m-show-right` 的 CSS（254–255 行）已定义，但 JS 中从未出现这两个类名，也没有汉堡按钮、遮罩或关闭控件。窄屏下两侧栏直接 `display:none`，功能不可达 | L254–255 CSS；全文无 toggle 逻辑 |
| 2 | 右栏 | **`.rp-btn.primary` 无样式定义**：HTML 给 `Save Actions` 挂了 `primary` 类（L295），但 CSS 只定义了 `.btn.primary` / `.sb-btn.primary`，`.rp-btn.primary` 与普通按钮视觉完全一样，"主操作"层级丢失 | L200–201 无 `.rp-btn.primary` |

### P1 —— 一致性与体验

| # | 位置 | 问题 |
|---|------|------|
| 3 | 状态栏 | **品牌蓝冲突**：`.sb-btn.primary` / `.sb-dot.sb-imp` 用 iOS 蓝 `#0A84FF`（L28、L31），与主色 `#0066CC` 并存两套蓝，应统一为 `var(--accent)` |
| 4 | 右栏 | **职责冗余 + 无滚动**：7 个按钮（Import/Download/Save×2/Export/Setting/Help）与编辑器顶栏、状态栏功能重叠；`.rightpanel` 无 `overflow-y:auto`，矮屏会被 `overflow:hidden` 外壳裁切 |
| 5 | 内容区 | **只读详情视图与内联编辑器不一致**：Search 视角复用的 `actionDetailHtml()` 仍用旧样式 —— badges 与 "Details" 列表重复展示 Project/Discipline/Assigned 等字段，应改造成与内联编辑器同构 |
| 6 | 侧栏 | **Help 文案过时**：帮助说 hover 节点有 `+ / ✎ / 🗑` 三个控件，实际树只渲染 discipline 的 `+` 和 action 的 `✎`，无删除按钮，project 节点没有任何控件 |
| 7 | 状态栏 | **混合职责**：30px 高度里同时承载"数据源状态"与"保存/加载/Create"操作按钮，主操作层级不清，偏挤 |
| 8 | 内容区 | **表单模式不统一**：内联编辑器 label 在输入框左侧（`ae-clabel` 固定 84px，长标签如 "Created by" 很紧），新建弹窗 label 在输入框上方 —— 两种 Apple 模式混用，建议统一为弹窗模式（label 置顶） |
| 9 | 内容区 | **内容宽度不一致**：`.ae` 限 860px，但 Projects / Disciplines / Reports / Settings 视角内容无 `max-width`，宽屏下表格与列表被拉满，行宽失控 |

### P2 —— 可访问性 / 健壮性 / 整洁度

| # | 问题 |
|---|------|
| 10 | 无 `:focus-visible` 样式；树节点/列表项是 `div + onclick`，无 `tabindex`/`role`，键盘无法导航；seg 按钮无 `aria-pressed`；switch 是 div 无 `role="switch"`/`aria-checked`；模态无 `role="dialog"`/`aria-modal`，无焦点陷阱，**Esc 不关闭任何模态** |
| 11 | 对比度：`--muted #8A8A8E` 在白底约 3.6:1，12px 小字（`.ae-clabel`/`.side-head`/`.rp-head` 等）不达 WCAG AA 4.5:1 |
| 12 | 死代码：`.b-pending/.b-prog/.b-comp` 等 badge 类已被 schema 内联样式取代（L101–108 可删）；`density` 字段在 schema/layout 中存储但全应用无任何 UI 使用 |
| 13 | 触控目标偏小：树内 `tbtn` 20px、`lm-mini` 26px、`ae-log-del` 无尺寸 —— 桌面向可接受，记录在案 |
| 14 | 移动端 `.ed-body` 左右 padding 恒为 32px 不收缩，680px 断点下内容区过窄；右栏按钮无滚动裁切（同 P1-4） |
| 15 | 树中 action 行同时渲染 priority 与 status 两个 `tcount`，长标签（如 "Not Started"）会挤压/截断 |

---

## 三、值得保留的优点（勿在迭代中破坏）

1. 四栏可配置外壳（隐藏 + 调宽 + setup.json 持久化）—— 骨架设计正确。
2. 内联编辑 + 实时预览单一渲染源（`reportHtml()` 三处共用）。
3. schema 驱动状态/优先级颜色 + `textOn()` 亮度自适应。
4. 编辑器顶栏（面包屑 + Save/New/Delete）独立于滚动区 —— 长文档编辑时操作常驻，设计正确。
5. 空状态文案、Toast、数据源指示灯、`.ae` 860px 内容限宽。

---

## 四、建议实施顺序（分 3 个 Sprint，每轮给完整 index.html）

**Sprint 1 — 布局骨架修复（P0 + 品牌）**
- [ ] P0-1：补 `m-show-side/m-show-right` 的触发逻辑（汉堡/抽屉按钮 + 半透明遮罩 + Esc/点遮罩关闭），≤900px 时右栏顶部也提供入口
- [ ] P0-2：补 `.rp-btn.primary` 样式（accent 底 + 白字，或直接并入主按钮体系）
- [ ] P1-3：`#0A84FF` → `var(--accent)` 统一品牌蓝
- [ ] P1-4：右栏精简按钮组（保留 Export/Save/Settings，其余并入编辑器顶栏）+ `overflow-y:auto`

**Sprint 2 — 内容区一致性（P1）**
- [ ] P1-5：Search 只读详情改为复用内联编辑器同构模板，去除重复字段
- [ ] P1-8：内联编辑器 meta 区统一为 label 置顶 + 2 列栅格（`.ae-cfield` 纵向堆叠）
- [ ] P1-9：各视角主内容统一 `max-width: 860px`
- [ ] P1-6：同步 Help 文案与树控件实际能力（或补上删除控件）
- [ ] P1-7：状态栏收敛为纯状态条，操作按钮移入编辑器顶栏/右栏

**Sprint 3 — 无障碍与清理（P2）**
- [ ] `:focus-visible` 全组件补齐；树/列表加 `tabindex` 与箭头键导航；seg/switch 加 ARIA；模态加 dialog 语义 + 焦点陷阱 + Esc 关闭
- [ ] `--muted` 提亮至 ≥4.5:1（如 `#75757A`）或对 12px 小字单独加深
- [ ] 删除 `.b-*` 死类与未用 `density`；`.ed-body` 移动端 padding 收缩

---

## 五、下一步

确认本清单（可全选、可勾选子集、可调整顺序）后，我按 Sprint 顺序产出一份**可直接覆盖的完整 index.html**，继续沿用现有 token 与 schema，不改动数据模型。

---

## 六、已实施（2026-08-19 · 用户确认方案 B + 激进收编 + 持久化）

**Sprint 1 已落地到 index.html（结构校验通过，shell 不可用未跑语法机检）：**

1. **顶栏组件 `.topbar`（48px）**：`.app` 网格改为 `var(--th) 1fr 30px`，各面板显式 `grid-row:2`；左段 AT logo + 数据文件名/计数/未保存标记（`#tbMeta`），中段面包屑（`renderTopbarCrumb` 复用各视角 breadcrumb，Actions 内联编辑实时联动），右段 Save Actions / Save Settings / Export + `⋯` 溢出菜单（Import / Create / Folder / Dark / Layout / Settings / Help）+ ≤900px 的 `☰` 抽屉开关。
2. **激进收编**：右栏精简为 Import… / Export（primary）/ Layout… / Hide ▸（`rpCollapse`）+ overflow-y:auto；状态栏纯化为状态展示（数据源 dot + 文件名 + 文件夹 + legacy 标记 + 计数），操作按钮全部移除并迁入顶栏/⋯；`sb-dot.sb-imp` 品牌蓝统一为 `var(--accent)`（P1-3）。
3. **P0-1 抽屉修复**：`tbDrawer` 触发 `m-show-side` + `tbScrim` 遮罩（top:var(--th)，z55 < 抽屉 z56），Esc/点遮罩关闭，顶栏始终可见。
4. **P0-2 修复**：`.rp-btn.primary` / `.rp-btn.dirty` / `.rp-btn[disabled]` 样式补齐；`.tb-btn` 同款 dirty 琥珀描边。
5. **持久化**：`appearance.topbar`（默认 true）→ `state.layout.topbar`，applySetup/applyLayout/serializeSetup/seedSetup 全覆盖；Layout 弹窗与 Settings→Layout 各加 Top bar 开关（`swTop`/`stTop`）。
6. **快捷键**：⌘/Ctrl+S 存数据、+Shift+S 存设置、+E 导出、+, 设置；Esc 关抽屉。
7. **帮助文案**：seedSetup + BUILTIN_HELP_MD 的 data/keys 文章与静态 Help 模态更新为新入口。

**遗留（未做，需另行确认）**：`.sb-btn` 死 CSS 未删；P1-5 只读详情视图统一、P1-6 Help 树控件文案、P1-8 表单模式统一、P1-9 内容限宽、P2 无障碍项，均待 Sprint 2/3。

**追加调整（2026-08-19，用户要求）**：Save Actions / Save Settings / Export 从顶栏移回 **Quick Actions 右栏**（Save Actions 为主按钮、Export 降为普通按钮、顺序 Save→Save Settings→Export→Import→Layout→Hide ▸）；顶栏只留品牌 + 面包屑 + `⋯` + `☰`，`⋯` 菜单内镜像了 Save×2 / Export（加 `.tb-sep` 分隔线），保证右栏隐藏或窄屏时动作仍可达；`updateSaveButtons` 改为同时同步右栏与 `⋯` 两处按钮的 disabled/dirty 状态；帮助文案（data 文章）同步更新。`.tb-btn` 样式现为死 CSS。

**追加调整 2（2026-08-19，用户要求）**：移除右栏 **Hide ▸**（`rpCollapse`）按钮及其绑定（收起右栏改由 Settings→Layout 开关 / Layout 弹窗承担）；Save Actions / Save Settings **取消琥珀 dirty 高亮**，仅保留「无变更时禁用」行为（disabled 时 45% 透明度）；删除 `.rp-btn.dirty` / `.tb-btn.dirty` 规则，`updateSaveButtons` 只切换 disabled。grep 确认无 `rpCollapse`/`dirty`/`Hide ▸` 残留。

**追加调整 3（2026-08-19，用户要求）**：① 导入数据后 Save Actions **初始为禁用** —— 两条导入路径（`fileInput.onchange` 与 `importViaPicker`）由 `markDataDirty()` 改为 `state.dataDirty = !!state.migrated`（刚载入视为干净；仅旧版 schema 迁移需要保存时保持启用）。② 右栏 Quick Actions **补回 Help 按钮**（`rpHelp`，绑定原已存在），顺序：Save Actions(主) / Save Settings / Export / Import… / Layout… / Help；帮助文案同步。

---

## 七、待办状态盘点（2026-08-19 · 逐项核实）

**已完成**：P0-1 抽屉入口、P0-2 rp-btn.primary、P1-3 品牌蓝、P1-4 右栏滚动+精简、P1-7 状态栏纯化、顶栏方案 B + topbar 持久化 + 快捷键 + 帮助文案、Quick Actions 微调（Save/Export 移回、去 Hide、去 dirty 高亮、导入后 Save 禁用、Help 入右栏）。

**待办（Sprint 2）**：
- [x] P1-6 静态 Help 模态（L454）仍写「hover 有 +/✎/🗑」，实际树无删除控件、project 无控件 → 改文案（内置 help 文章已准确）✅ 2026-08-19：改为「discipline 行 `+` / action 行 `✎`；删除仅在 Settings」
- [x] P1-9 仅 `.ae` 限 860px，其余视角内容无 max-width ✅ 2026-08-19：新增 `#edBody > *{max-width:860px}`
- [x] P1-5 Search 只读详情 `actionDetailHtml()`（L909）与内联编辑器不一致、badges 与 Details 字段重复 → 建议复用 `reportHtml()` 模板 ✅ 2026-08-19：改用 `reportHtml()` + 历史 + Edit/Delete，删除 `detailLogTableHtml()`
- [ ] P1-8 内联编辑器 label 左侧 84px vs 弹窗 label 置顶，表单模式不统一 ✅ 2026-08-19（批次 B）：meta 区改为 label 置顶 + 固定 2 列栅格（`.ae-crow{1fr 1fr}`、`.ae-cfield` 纵向堆叠、`.ae-clabel` 去固定宽度），Status/Priority 全宽行，移动端 680px 仍折叠为单列

**待办（Sprint 3）—— ✅ 全部完成 2026-08-19（批次 C）**：
- [x] 模态 Esc 关闭 + role=dialog/aria-modal + 焦点陷阱：`openModalBox/closeModalBox` 焦点管理，全局 Esc 关最上层模态（内联编辑 Esc 分支加 stopPropagation 防误关），Tab 焦点圈闭；6 个模态全部补 dialog 语义与 aria-labelledby/label
- [x] 树/列表键盘导航：`.tnode`/`.sitem` 加 tabindex="0"，Enter/Space 激活（sideBody keydown）
- [x] seg/switch ARIA：`renderSeg/renderPrioritySeg` 加 aria-pressed 随选中同步；`setSwitch` 注入 role="switch"/aria-checked/tabindex，Enter/Space 切换
- [x] focus-visible 全套：全局 `:focus-visible` accent 描边（活动栏/暗色 rail 用白描边），`.ae-log` 单元格保持内嵌下划线不叠加
- [x] `--muted #8A8A8E → #6E6E73`（白底 ≈4.8:1，达 WCAG AA）
- [x] 死代码清理：删除 `.b-*` 7 个 badge 类、`.badges`、`.sb-btn`（含 primary）、`.tb-btn` 全套规则与 `density` 字段（seedSetup/state/applySetup/serializeSetup/setup.json 同步移除）

**建议批次**：A = P1-6→P1-9→P1-5（低风险）；B = P1-8（中风险）；C = Sprint 3 全部（中风险）。
