# WORKPLAN — EPC-Design-Management

污水厂 EPC 工程设计管理：研究与工具蓝图的工作跟踪。

> 本文件是**就地更新**的工作底稿，不放中间临时文件。
> 改动落地前先登记 ISS 条目 → 确认 → 实施 → 回写 §7 变更记录。

---

## §0 状态一览

| 项 | 状态 |
|---|---|
| 当前版本 | **v0.1**（2026-10-31） |
| 阶段 | 研究与蓝图完成 → 等待决定下一步走向（实现 / 深化某一域 / 转向落地试点） |
| 交付物 | 2 个成品 HTML + 2 份笔记 + 4 段报告源片段，全部验证通过 |
| 阻塞项 | **ISS-011** — 在线分享链接发布被服务端 `403` 拦截，待授权后重试；**不影响本地交付** |
| 下一件事 | 见 §5 待办 P1 |

---

## §1 范围与目标

**目标**：回答"污水厂 EPC 项目的工程与设计应该管什么、怎么管、用什么工具管"，并产出可直接落地的工具规格。

**已覆盖**：

- 为什么污水厂 EPC 特别难管（负荷定尺、专业级联耦合、生物启动不可压缩、构筑物+设备双重属性、改造项目翻倍）
- 12 个能力域 × 失效模式 × 量化代价 × 工具覆盖的瓶颈矩阵
- 现有工具全景（CDE / P6 / 工艺模拟 / 调试平台）与**七个空白**
- 12 个应用规格（问题定义、字段级数据模型、 MVP、成功指标）
- 共享数据模型、自建 vs 采购分界、18 个月路线图、9 项 KPI、6 个失败模式

**明确不做**（本次范围外）：

- 具体厂商选型与商务报价
- 任何代码级实现（12 个应用目前仍是规格，不是软件）
- 单一国别的强绑定标准解读

---

## §2 决策记录（Decision Log）

| # | 决策 | 理由 |
|---|---|---|
| D1 | 视角取 **EPC 承包商工程团队**，而非业主 | 工具的落脚点是保护毛利、控制接口、保证可交付性 |
| D2 | 交付形态取**单文件自包含 HTML**，非传统 Word/PPT | 可离线、可交互、可直接分享，无需环境 |
| D3 | 标准语境取**跨司法辖区通用**，不绑死国标 | 保持原则可执行，具体落地时再挂当地标准 |
| D4 | 设计基础（C1/DBM）定为**唯一不可补偿的根节点** | 假设错误会向后继承并放大，是全部返工的上游 |
| D5 | 挣值必须基于**阶段权重化的交付物状态**，不接受自评百分比 | 自评既不可结算、也不可预测 |
| D6 | 项目目录命名 **EPC-Design-Management**，素材**全部归档** | 便于后续迭代直接改源片段，不必从头重写 |
| D7 | 应用编号权威源为 `notes/app-blueprints.md` | 避免多份产物之间编号漂移（见 ISS-001） |

---

## §3 交付物清单

| 文件 | 类型 | 说明 | 验证 |
|---|---|---|---|
| `deliverables/EPC-Wastewater-Engineering-Management-Research.html` | 成品 | 深度研究报告，13 章 | 通过 |
| `deliverables/EPC-Engineering-Network-Chart.html` | 成品 | 要素关联网络图，19 节点 / 33 边，力导向可交互 | 通过 |
| `index.html` | 成品 | Hub 索引页，卡片式导航 | 通过 |
| `notes/capability-map.md` | 底稿 | 12 能力域矩阵 + 瓶颈排序 + 工具缺口 | — |
| `notes/app-blueprints.md` | 底稿 | 12 应用规格 + 字段级数据模型（**权威源**） | — |
| `notes/source/report-part{1..4}-*.html` | 源片段 | 研究报告的可编辑增量片段 | — |

---

## §4 应用蓝图追踪（A01–A12）

阶段定义：**规格完成** → MVP 设计 → 原型 → 试点 → 量产

| # | 应用 | 网络图节点 | 阶段 | 优先级 | 备注 |
|---|---|---|---|---|---|
| A01 | Design Basis Manager | `dbm` | 规格完成 | P1 | 根节点，建议首个试点 |
| A02 | Deliverable Register & IFA/IFC Gate | `mdr` | 规格完成 | P1 | 与 A03 强耦合 |
| A03 | Stage-weighted EVM Engine | `evm` + `sched` | 规格完成 | P1 | 依赖 A02 的阶段数据 |
| A04 | Interface Register | `intf` | 规格完成 | P1 | 延误主因，投入产出高 |
| A05 | Procurement–Engineering Link | `proc` + `mto` + `bom` | 规格完成 | P1 | 关键路径最大变量 |
| A06 | Vendor Document Tracker | `vdt` | 规格完成 | P2 | — |
| A07 | Change & RFI Intelligence | `chg` | 规格完成 | P2 | 依赖 A04/A08 的根因输入 |
| A08 | Cross-discipline QA & Clash Gate | `qa` | 规格完成 | P2 | v0.1 补齐到网络图 |
| A09 | Process Design Workbook | `pwb` | 规格完成 | P2 | — |
| A10 | Commissioning & Turnover | `comm` | 规格完成 | P2 | 含 MLSS/SVI 生物启动日志 |
| A11 | Asset Data Handover | `asset` | 规格完成 | P3 | COBie / CFIHOS |
| A12 | Lessons & Design Rules Library | `less` | 规格完成 | P3 | 闭环层，长期复利 |

---

## §5 待办与下一步

### P0 — 阻塞中

- [ ] **ISS-011** 在线分享链接（Artifact 发布）失败。现象：`credential request failed (HTTP 403) · path not allowed`。
  - 已排除路径因素：子目录 / `/workspace` 根目录 / 会话沙箱目录 **三种位置均返回同一错误** → 判定为**服务端授权限制**，重试无用。
  - **解法**：待 WorkBuddy 空间 / 知识库侧授权（或联系管理员）后，由我重试发布。
  - **备选**：便携单文件评审包（把 README / WORKPLAN / 两份笔记内联为一个 HTML，便于手机离线翻阅）——用户暂不需要，先不做。
  - 阻塞范围：**仅在线分享**，本地 ZIP 与预览完全可用。

### P1 — 建议先做

- [ ] **ISS-012** 完成 Git 版本管理的远端搭建。**本地历史已就绪**（分支 `main`、提交 `24ea459`、标签 `v0.1`、18 个文件入库，已排除 `*.zip`）。**待你完成**：
  1. GitHub 新建**空私有仓库**（勿勾 README/license，否则首推冲突）
  2. 给沙箱写权限：**Deploy key**（推荐，仅对该仓库）或 **PAT**（`Contents: Read and write`）
  3. 绑定 remote 并首推（`git remote add origin … && git push -u origin main`）
  - 完成后：沙箱侧由我 `git pull` / 提交；本地侧用 `git-sync.ps1`（PowerShell）或 `git-sync.sh`（WSL）双向同步。
- [ ] **ISS-002** 确认 "Nero network chart" 的具体所指：是通用网络图（当前实现），还是指 Neo4j 图数据库 / 某个特定库？确认后再决定是否调整数据层。
- [ ] **ISS-006** 选定首个试点应用。建议 **A01 Design Basis Manager**（根因、体积小、见效快），或 **A02 Deliverable Register**（中心枢纽，但依赖主数据先铺好）。**待你定**。
- [ ] **ISS-007** 定义共享主数据字典，尤其是 **EquipmentTag 命名规则**——这是全部 12 个应用的地基，先定它可以避免后期大规模返工。

### P2 — 深化

- [ ] **ISS-003** 网络图目前缺 **C9 BIM/CDE** 维度（无 CDE/BIM 节点）。是否在图中补 `CDE / Common Data Environment` 节点？这将完整对齐 12 个能力域。
- [ ] **ISS-004** 将某一应用从"规格"推进到 **MVP 数据模型 + 原型界面**。需要选定技术栈（沿用你熟悉的单文件 HTML 路线？还是 Flask/Web app？）。
- [ ] **ISS-008** 网络图边缺少**语义标签**（目前只表达"驱动"，未区分 `feeds / gates / validates / rolls-up-to`）。是否需要给边加类型并可视化？

### P3 — 长期

- [ ] **ISS-009** 把 18 个月路线图拆成可按季度执行的任务包，并挂到具体责任人（当前路线图缺 RACI 落实到具体岗位）。
- [ ] **ISS-010** 沉淀 WWTP 特有的规则（生物启动约束、污泥线、除臭、AB/A²O/MBR 工艺差异）进 A12 规则库。

---

## §6 待确认问题（选择題）

| # | 问题 | 选项 |
|---|---|---|
| Q1 | 首个落地试点选哪个应用？ | A01 Design Basis Manager / A02 Deliverable Register / A05 Procurement Link |
| Q2 | 原型用什么形态？ | 单文件 HTML（你熟悉、零依赖）/ Flask + SQLite 本地 web app / Excel+Power Query 低代码 |
| Q3 | 网络图是否补 CDE/BIM 节点？ | 补（12 能力域全覆盖）/ 不补（保持聚焦 PEM 主链） |

---

## §7 变更与版本记录

### v0.1 — 2026-10-31 · 项目立项与首次归档

- 建立项目目录 `EPC-Design-Management/`，整合研究与网络图两份交付物。
- 归档全部素材：2 份笔记、4 段报告源片段、4 张验证截图。
- 新增 `index.html` Hub 索引页、`README.md`、`WORKPLAN.md`。
- 清理 `/workspace` 根目录的重复副本（已校验字节一致后移除）。

**修复**

- **ISS-001（已修复）** — 网络图中"研究映射"的应用编号相对 `app-blueprints.md` 出现漂移，且 **A08 缺失**：
  - `pwb` 误标 A10 → 应为 **A09**
  - `sched` 误标 A08 → 应为 **A03**（P6 是 EVM 的计划侧；A08 是 QA 闸门）
  - `comm` 误标 A11 → 应为 **A10**
  - `asset` 误标 A12 → 应为 **A11**
  - `less` 误标 A13 → 应为 **A12**
  - `mto` 误标 A03 → 应为 **A05**（MTO 是采购联动的量源）
  - 全部 13 处编号统一规范化为 `A0N` 格式
  - 新增节点 **`qa`（QA / Clash Gate）** 补齐 **A08**，并加边 `mdr→qa`、`qa→chg`
  - 结果：网络图节点 18 → **19**，边 31 → **33**，12 个应用**全部**在网络图中有对应节点
  - 验证：无 JS 报错、19 节点全在画布内、桌面/移动渲染正常

**遗留**

- ISS-002 / ISS-003 待确认后再动。
- **ISS-011** 在线分享链接待授权后重新发布（v0.1.1 待办）。发布时的既定方案：先逐个发布 6 个文件（两份 deliverable HTML + README + WORKPLAN + 两份笔记 md），收集链接，再生成链接指向这些地址的 Web 版 Hub 并单独发布——因为发布服务一次只能上传单个文件，直接用相对路径的 Hub 会导致卡片全部失效。
