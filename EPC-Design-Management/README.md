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

架构：**本沙箱 ←→ GitHub 私有仓库 ←→ 你的本地磁盘**（GitHub 作为三方汇聚的中枢）

```
   ┌─────────────────┐        push / pull        ┌──────────────┐
   │ WorkBuddy 沙箱  │  ←─────────────────────→  │              │
   │ /workspace/…    │                           │    GitHub    │
   └─────────────────┘                           │  私有仓库     │
                                                 │              │
   ┌─────────────────┐        push / pull        │              │
   │ 本地 Windows /  │  ←─────────────────────→  │              │
   │ WSL             │                           └──────────────┘
   └─────────────────┘
```

**已完成** — 本地版本历史已建立：

| 项 | 值 |
|---|---|
| 分支 | `main` |
| 首个提交 | `24ea459` · v0.1 初始项目归档 |
| 标签 | `v0.1` |
| 入库文件 | 18 |
| 排除项 | `*.zip`（可由目录重建）、`.DS_Store`、编辑器临时文件 |

**待你完成** — 需要 GitHub 凭证（沙箱侧目前 `gh` 未登录、无 SSH key，故无法自行推送）：

1. 在 GitHub 新建一个**空的私有仓库**（**不要**勾选 README / .gitignore / license，否则首推会冲突），例如 `EPC-Design-Management`
2. 给沙箱写入权限：**Deploy key**（推荐，仅对该仓库生效）或 **PAT**（fine-grained，`Contents: Read and write`）
3. 在本仓库绑定远端后推送（命令见 § Canonical Commands 或聊天记录）

**日常同步** — 用同步助手，一条命令完成「提交 → 拉取 → 推送」：

```
# Windows PowerShell（零安装，推荐）
.\git-sync.ps1 -Message "v0.2 细化 A05 采购联动"

# WSL / Git Bash
./git-sync.sh "v0.2 细化 A05 采购联动"
```

不带参数运行则只拉取并查看状态。拉取统一用 `--rebase --autostash`，避免多余的 merge 提交并自动暂存未提交改动；冲突时会停下来交给你手动 `git status` → 解决 → `git rebase --continue`。

> **重要**：我在沙箱里重新生成任何交付物之前，你跑一次同步；我动笔之前也会先 `git pull`，避免双向覆盖。

---

## 迭代约定

沿用你既有的习惯：**先方案后代码** + **版本/ISS 编号追踪**。

- 每次改动先在 `WORKPLAN.md` §5 待办中登记 ISS 条目 → 确认 → 实施 → 回写 §7 变更记录。
- 所有**文本、标题、标签**的修改需显式批准后才落地。
- 优先**归档**而非删除：改动一份交付物时写入新文件，不覆盖原成果。
- 改动「应用编号 / 数据模型」时，`notes/app-blueprints.md` 是唯一权威源，网络图与研究报告的映射须同步核对（历史上出现过编号漂移，见 ISS-001）。
