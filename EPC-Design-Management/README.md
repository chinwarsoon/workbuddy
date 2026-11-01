# EPC-Design-Management

污水厂（WWTP/STP）EPC 项目的**工程与设计管理**研究与工具蓝本项目。

主线：**从"一个主观的分包商跟踪表"，走向"一条可审计的工程数字主线"**——把设计基础 → 交付物状态 → 接口承诺 → 供应商资料 → 变更因果 → 资产移交串成闭环。

> 视角：EPC / 设计-建造（D&B）总承包商的工程与设计管理团队。
> 目标资产：市政或工业污水处理厂，约 2 万–50 万 m³/d，含生化（A²O/MBBR/SBR/MBR）、深度处理、污泥处理、除臭、电气与自控。
> 标准语境：跨司法辖区通用（ISO 19650、FIDIC 银皮书/黄皮书、ASME/EN/IEC、当地排放许可），不绑定单一国别。

---

## 快速开始

| 我想… | 打开 |
|---|---|
| 看完整研究结论 | [`deliverables/EPC-Wastewater-Engineering-Management-Research.html`](deliverables/EPC-Wastewater-Engineering-Management-Research.html) |
| 看要素如何关联（可交互） | [`deliverables/EPC-Engineering-Network-Chart.html`](deliverables/EPC-Engineering-Network-Chart.html) |
| 浏览全部（推荐入口，卡片式） | [`index.html`](index.html) |
| 了解当前进度与待办 | [`WORKPLAN.md`](WORKPLAN.md) |

所有 HTML 均为**单文件自包含、无外部依赖、可离线打开**。`index.html` 是 Hub 索引页。

> `.md` 文件用浏览器打开会显示为纯文本，建议用编辑器（VS Code / Obsidian 等）打开。

---

## 目录结构

```
EPC-Design-Management/
├── index.html                       # Hub 索引页（卡片式导航入口）
├── README.md                        # 本文件：项目说明与导航
├── WORKPLAN.md                      # 工作跟踪：决策记录 / 待办 / 变更日志
├── .gitignore                       # 排除 *.zip 等可重建产物
├── git-sync.sh                      # 同步助手（WSL / Git Bash）
├── git-sync.ps1                     # 同步助手（PowerShell，零安装）
│
├── deliverables/                    # ★ 最终交付物
│   ├── EPC-Wastewater-Engineering-Management-Research.html   深度研究报告（13 章）
│   └── EPC-Engineering-Network-Chart.html                    要素关联网络图（19 节点 / 33 边）
│
├── notes/                           # 研究底稿（Markdown，可编辑）
│   ├── capability-map.md            12 个能力域 + 瓶颈排序 + 工具缺口分析
│   ├── app-blueprints.md            12 个应用规格（含字段级数据模型）
│   └── source/                      # 研究报告的源片段（便于增量修改，不必重写整篇）
│       ├── report-part1-foundation.html      执行摘要 / 为何污水厂难管
│       ├── report-part2-lifecycle.html       全链路 / 12 个失败点 / 工具全景
│       ├── report-part3-blueprints.html      应用组合 / 12 个应用规格
│       └── report-part4-roadmap.html         数据模型 / 自建vs采购 / 路线图 / KPI / 风险
│
└── assets/verification/             # 渲染验证截图
    ├── research-capability-matrix.png        研究报告 · 能力地图矩阵
    ├── network-chart-desktop.png             网络图 · 桌面
    ├── network-chart-selected-mdr.png        网络图 · 选中 MDR 详情
    └── network-chart-mobile.png              网络图 · 移动端
```

---

## 三句话核心结论

1. **失效集中在边界，不在专业** — 多数 EPC 延误源自两个专业各自做对、却基于不同假设；真正的缺口是接口没有被*显式登记、按时关闭、留证验证*。
2. **数字失去因果就失去用途** — 工程进度若来自自评百分比，既不能用于收款也不能用于预测；必须把「交付物状态 → 工时 → 挣值 → 商务」串成可审计链。
3. **上游一个假设，下游全部返工** — 进水表征与设计基础是唯一不可补偿的根节点；它错了，工艺模拟、设备选型、性能保证全部继承同一个错误并向后放大。

## 瓶颈排序（影响 × 可修复性）

| 序 | 能力域 | 为什么 |
|---|---|---|
| 1 | C1 设计基础 | 上游根因，错了全错 |
| 2 | C4 接口 | 延误主因 |
| 3 | C2 + C3 交付物 / 挣值 | 让前两项*可被看见、可被度量* |
| 4 | C5 + C6 采购 / 供应商资料 | 关键路径最大变量 |
| 5 | C8 + C9 跨专业校审 / 模型协调 | 返工主因 |
| 6 | C7 变更归责 | 争议与利润保护 |
| 7 | C10 + C11 调试 / 资产移交 | 现金回收与尾款 |
| 8 | C12 知识复用 | 长期护城河 |

> 详见 [`notes/capability-map.md`](notes/capability-map.md)。

## 12 个应用蓝图（A01–A12）

| # | 应用 | 解决的痛点 |
|---|---|---|
| A01 | Design Basis Manager | 假设未被登记，假设错了全链返工 |
| A02 | Deliverable Register & IFA/IFC Gate | MDR 只是清单，无状态语义、不可审计 |
| A03 | Stage-weighted EVM Engine | 工时≠进度，预算/实耗/挣值三张表不互连 |
| A04 | Interface Register | 接口在施工期才被发现 |
| A05 | Procurement–Engineering Link | 长周期项下单时设计成熟度不够 |
| A06 | Vendor Document Tracker | 供应商评审 2–4 周，退回再 +3–6 周 |
| A07 | Change & RFI Intelligence | 无因果结构，事后无法证明归责 |
| A08 | Cross-discipline QA & Clash Gate | 冲突只存在于专业之间，逐专业审查看不到 |
| A09 | Process Design Workbook | 工艺计算孤立，无法追溯到选型与 P&ID |
| A10 | Commissioning & Turnover | 生物启动按生物钟走，不按工期走 |
| A11 | Asset Data Handover | 数据在移交时重建，错漏、耗时数年 |
| A12 | Lessons & Design Rules Library | 同类错误跨项目重复 |

> 字段级数据模型见 [`notes/app-blueprints.md`](notes/app-blueprints.md)。
> 组合关系：**A01 是根** → A02/A03 让状态可见 → A04 管边界 → A05/A06 管外部输入 → A07 管因果 → A08 管质量闸门 → A09 管工艺正确性 → A10/A11 管交付 → **A12 闭环**。
> 共享主数据（地基）：Project、WBS、Discipline、EquipmentTag、DocumentId、Person/Role。

---

## 验收状态

| 交付物 | 验证项 | 结果 |
|---|---|---|
| 研究报告 HTML | JS 报错 / 横向溢出 / 桌面+移动渲染 | 通过 |
| 网络图 HTML | JS 报错 / 横向溢出 / 节点越界 / 桌面+移动渲染 | 通过（19 节点全在画布内） |
| 两者 | 离线自包含（无外部依赖） | 通过 |

---

## 版本管理（Git 工作流）

架构：**你的本地磁盘 ←→ GitHub `chinwarsoon/workbuddy` ←→（沙箱按需同步）**。本项目以**子目录 `EPC-Design-Management/`** 形式存在于 `workbuddy` 仓库（与 `action-log/`、`PPP/` 等并列），**不是独立仓库**。

```
   你的本地磁盘  ←── push / pull ──→  GitHub: chinwarsoon/workbuddy
   (workbuddy/EPC-Design-Management/)        │  main 分支
                                            │  子目录: EPC-Design-Management/
   WorkBuddy 沙箱  ←── 同上（仅助手用于同步）──┘
```

**已完成**：

| 项 | 值 |
|---|---|
| 仓库 | `github.com/chinwarsoon/workbuddy`（子目录 `EPC-Design-Management/`） |
| 分支 | `main` |
| 落库提交 | `c8f2f39` · `feat(EPC-Design-Management): add wastewater EPC …` |
| 文件数 | 18（与 `action-log/`、`PPP/` 等并列） |
| 历史 | 以 `git subtree` 并入 `workbuddy`，原始 v0.1 提交保留 |
| 排除项 | `*.zip`、`.DS_Store`、编辑器临时文件 |

**单一真源**：2026-11-01 已删除沙箱内独立的 `/workspace/EPC-Design-Management` 副本。此后**唯一真源 = `workbuddy` 仓库内的 `EPC-Design-Management/` 子目录**（已在 GitHub）。改动只在该副本上进行，避免两份漂移。

**日常同步** — 两种方式任选：

```
# 方式 A（推荐，只同步本子项目）：在 EPC-Design-Management/ 目录内运行
.\git-sync.ps1 -Message "v0.2 细化 A05 采购联动"   # Windows PowerShell
./git-sync.sh "v0.2 细化 A05 采购联动"             # WSL / Git Bash
# 不带参数 = 仅拉取并查看状态；自动只 add 本子目录，
# 提交信息带 scope：feat(EPC-Design-Management): <msg>；pull 用 --rebase --autostash

# 方式 B（同步整个 workbuddy 仓库）：在 workbuddy 根目录运行
git-sync.bat                                       # 沿用仓库既有 review-first 菜单
```

> **重要**：改任何文件前先 `git pull`（或跑一次同步助手）拿最新；助手重新生成交付物前也会先拉取，避免双向覆盖。

---

## 迭代约定

沿用你既有的习惯：**先方案后代码** + **版本/ISS 编号追踪**。

- 每次改动先在 `WORKPLAN.md` §5 待办中登记 ISS 条目 → 确认 → 实施 → 回写 §7 变更记录。
- 所有**文本、标题、标签**的修改需显式批准后才落地。
- 优先**归档**而非删除：改动一份交付物时写入新文件，不覆盖原成果。
- 改动「应用编号 / 数据模型」时，`notes/app-blueprints.md` 是唯一权威源，网络图与研究报告的映射须同步核对（历史上出现过编号漂移，见 ISS-001）。
