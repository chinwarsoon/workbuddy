# WORKPLAN — Procurement Package Plan Dashboard 升级

| 项 | 内容 |
|---|---|
| 目标文件 | `Procurement-Dashboard.html`（交互式单文件看板） |
| 数据源 | `TWRP C3B2 - Procurement Package Plan.xlsx`（同目录） |
| 版本 | v2 — Code 表契约 v2 已实施 |
| 日期 | 2026-09-15 |
| 状态 | **D1–D5 已批准 · B2–B5 已实施 · B6 已实施**（B1 归档待你执行） |

---

## §0c 本轮（Code 表契约 v2，2026-09-15 复核后实施）

**你的新约定（已按此实现）**
- Code 表**表头在第 1 行**；**A = 标题、B = 值、C = 数据类型**；C 之后将来可插列。
- 查表区按第 1 行的**标题文字**定位，共 4 个：
  `Discipline Description` / `Criticality` / `Package Status` / `Item Category`

**实测复核结果（sheet-agent 直读，非推测）**

| 项 | 实测 |
|---|---|
| Code!A1 / B1 | `Project Metadata` / `Details` |
| Code!A2:B8 | Project Title / Project Code / Client / Consultant / AsOf Date=**46280** / Header Row=**1** / List End Row=**122** |
| Code!A9:B39 | 31 项列映射：`S No.`→`Column-A` … `ROS Actual Date`→`Column-AE` |
| **Code!C** | **仍全部为空**（无值、无表头）→ 页面走内置回退，并给 V-16 |
| D1/E1 | `Discipline Code` / `Discipline Description`（19 项） |
| G1/H1 | `Criticality Code` / `Criticality`（**0–4**，5 项） |
| J1/K1 | `Status Code` / `Package Status`（NS…RI，9 项） |
| M1/N1 | `Category Code`（空） / `Item Category`（20 项） |
| PPP B 列（Discipline） | 存**描述文本**（如 `Design Management`） |
| PPP E 列（Item Category） | 存**描述文本**（如 `Design Consultancy Service`） |
| PPP I 列（Criticality） | **全空**（抽样 2–25 行无值） |
| PPP L 列（Package Status） | 存**描述文本**（`Not Start` / `Requisition in Progress` / `PO Issued, Prepare Vendor Data Submission` …） |

**本轮代码改动（`Procurement-Dashboard.html`）**

| # | 改动 |
|---|---|
| 1 | `LOOKUP_HEADERS` 扩展为「精确匹配优先、再前缀匹配」、大小写无关；新增 `colLetter()` 回显命中列字母 |
| 2 | `parseCodeSheet()` 返回 `{meta, metaTypes}` —— C 列的数据类型同时用于**元数据行**（AsOf / Header Row / List End Row）与映射行 |
| 3 | 新增 V-15 扩展：C 列类型与预期不符时告警（AsOf 应为 Date，Header/List End Row 应为 Number） |
| 4 | 新增 **V-18**：4 个查表块任意一个未在第 1 行找到 → Warning |
| 5 | 校验面板新增 **Code sheet map** 行：显示映射条数、C 列类型数、4 个查表块命中的**列字母 + 值条数**（便于你一眼确认检测正确） |
| 6 | 新增 `statusCanon()`：状态同时识别**短码（NS）与全描述（Not Start）**；KPI、Status 图表、延误判定全部改用它 |
| 7 | `statusItems()` 改为按 **Code!K 顺序**输出（即工作流顺序），不再写死 5 个状态 |
| 8 | `critItems()` 标签改为由 **Code!G/H 动态生成**（`0 — Not Applicable` …），未命中清单的值单独显示为「(not in Code list)」 |
| 9 | Criticality 卡片副标题与脚注改为动态（显示实际填充数） |

---

## §0b 实施状态（2026-09-15 更新）

| 批次 | 内容 | 状态 |
|---|---|---|
| B1 | 归档 `PPP_Dashboard.html` / `parse_excel.py` / `test_parser.js` 到 `arch/` | ⏳ **待你执行** —— 沙箱 Bash / PowerShell 连接中断，我无法移动文件。命令见 §10 |
| B2 | Code!C 数据类型驱动解析（不再依赖硬编码日期字段清单） | ✅ 已实施 |
| B3 | 校验引擎 + 非阻断校验面板 + 明细表 + CSV 导出 | ✅ 已实施 |
| B4 | 条形 / 饼图切换（`svgPie()`、Top-8 + Other、偏好记忆） | ✅ 已实施 |
| B5 | 欢迎页提示预期文件名、`accept` 收窄为 `.xlsx,.csv` | ✅ 已实施 |

**实施中新增的设计决策（已落地）**
- 查表区改为**按第 1 行的表头文字定位**（Discipline / Criticality / Status / Item Category），不再写死列字母 —— 这样以后在 C 之后插入列不会破坏解析（对应你的 D3 备注）。
- Criticality 改为 **0–4** 五档（0 = Not Applicable），修正了原代码只画 1–4 的问题（ISS-05）。
- Engineer 在计数前做归一化（`/` 前后空格统一），被合并的写法会写进校验面板 V-12（ISS-08）。
- 新增规则 **V-17**：Item Category 是否落在 Code 表清单内。
- Lead Time 卡片切饼图时**只画分桶**（≤90 / 91–180 / 181–270 / >270），不画「已估算 / 未估算」，避免重复计数。

**待你确认（重要）**
我在本会话读取 `TWRP C3B2 - Procurement Package Plan.xlsx` 时，**Code!C 列仍为空**。页面已做双向兼容：C 有值就按 C 的类型走；C 为空则回退内置日期字段清单，并在校验面板给出 **V-16** 提示。请确认你保存的就是这个路径下的文件。

---

## §0 更正说明

上一轮我把两个文件认反了，在此更正：

- `Procurement-Dashboard.html` = **交互式引擎**（含欢迎页、文件选择、内置 XLSX 解析器、SVG 图表）。✅ 与你的描述一致。
- `PPP_Dashboard.html` = **静态快照**（数据写死在 `const DATA`，无解析器、无文件选择）。是早期产物，名字有误导性。

后续以 `Procurement-Dashboard.html` 为唯一交互版。

---

## §1 需求（2026-09-15 提出）

| ID | 需求 |
|---|---|
| **R1** | `Procurement-Dashboard.html` 是交互式单文件网页，读取**同目录**的 Excel 文件生成各类图表 |
| **R2** | PPP 的数据列头定义在 **Code 工作表 A、B 列**；**C 列提供数据类型**（供校验用）；A/B/C 各有自己的表头 |
| **R3** | 欢迎页让用户选择并载入 Excel 文件 |
| **R4** | 生成图表**之前**先校验 PPP 工作表数据 |
| **R5** | 允许用户切换**饼图 / 条形图** |

---

## §2 现状核查（实测，非推测）

### 2.1 文件

| 文件 | 角色 | 处置建议 |
|---|---|---|
| `Procurement-Dashboard.html` | 交互引擎 | 保留，持续迭代 |
| `PPP_Dashboard.html` | 静态快照（历史产物） | 归档至 `arch/` |
| `TWRP C3B2 - Procurement Package Plan.xlsx` | 数据源 | 保留 |
| `parse_excel.py` / `test_parser.js` | 早期离线探查脚本 | 归档 |

### 2.2 Code 工作表（`sheet_id 000003`）实测结构

列 A / B 现状：

| 行 | A（键） | B（值） |
|---|---|---|
| 1 | `Project Metadata` | `Details` ← 表头 |
| 2–8 | Project Title / Project Code / Client / Consultant / AsOf Date / **Header Row** / **List End Row** | TWRP C3B2 / C3B2 / PUB / Jacobs / 46280 / **1** / **122** |
| 9–39 | 字段名（S No. … ROS Actual Date，共 31 项） | `Column-A` … `Column-AE` |

**C 列目前完全空白、无表头** —— R2 要求的「数据类型」列尚不存在。

### 2.3 Code 工作表中的查表区（校验要用）

| 列 | 内容 | 取值 |
|---|---|---|
| E | Discipline Description | 19 项（Architecture … General (non-specific)） |
| G / H | Criticality Code / **Criticality** | **0–4**（0 = Not Applicable，1 = 厂内 QC，2 = TPI，3 = Witness，4 = FAT Record） |
| J / K | Status Code / **Package Status** | NS / MR / VI / PO / VDA / FAB / FAT / DEL / RI ↔ Not Start … Receive Inspection Done |
| M / N | Category Code（**目前空**） / **Item Category** | 20 项（Building Service Work Package … Pressure Vessel） |

F、I、L、O 为空白分隔列。

> 定位方式：以上 4 块**全部按第 1 行标题文字查找**（`Discipline Description` / `Criticality` / `Package Status` / `Item Category`），不再依赖列字母 —— 你在 C 之后插列不会破坏解析。

### 2.4 PPP 工作表（`sheet_id 000002`）实测

- 表头在第 1 行，31 列（A…AE）；`Header Row=1`、`List End Row=122` → 数据行 2–122 = **121 个包**。
- 列组：A–M 基础信息，N–P 责任人，Q–S MR，T–V PO，W–Y VD，Z–AB FAT，AC–AE ROS（每组 Plan / Forecast / Actual）。
- **计划日期已修复**：行 2–6 实测 Q=46235、T=46295、W=46355、Z=46355、AC=46385（真实 Excel 序列号）。此前审计发现的占位整数 60/90/120 已不复见于抽样行 —— 但校验仍必须保留该防线（见 V-02）。
- **Actual 日期仍全空**（S 列抽样无值）—— 与历史审计一致（0/121）。
- **Criticality（I 列）仍全空**（抽样无值）。
- K 列（Estimate Lead Time）已有值（行 2/3 = 30）。

---

## §3 需你决策的事项（D1–D5）

> 这 5 项决定实施方向，请逐条确认或改写。

### D1 — 文件整合与归档
建议：保留 `Procurement-Dashboard.html` 为唯一交互版；把 `PPP_Dashboard.html`、`parse_excel.py`、`test_parser.js` 移入 `arch/`（不删除）。
**问：同意归档吗？还是希望保留双份？**

### D2 — 「读取同目录 Excel」在浏览器里做不到自动读取
浏览器安全模型禁止网页在无人操作的情况下读取本地文件（`file://` 下 `fetch`/`XHR` 被 CORS 拦截）。三个可选方案：

| 方案 | 做法 | 代价 |
|---|---|---|
| **A（推荐）** | 保留欢迎页拖拽/选择；在欢迎页明确显示预期文件名 `TWRP C3B2 - Procurement Package Plan.xlsx`，并记住上次选择（File System Access API，仅 Chromium 内核） | 仍需点一次 |
| B | 附带一个零安装启动脚本（沿用 `run_action_log.ps1` 思路）起本地静态服务，页面即可自动拉取同目录文件 | 不再是「纯双击打开」 |
| C | 把数据以 JSON 内嵌进 HTML | 失去「读活文件」能力，每次改 Excel 要重生成 |

**问：选 A、B 还是 C？**（默认按 A 实施）

### D3 — Code 表 A/B/C 的结构
问题：A1/B1 现在是 `Project Metadata`/`Details`，描述的是**元数据块**（行 2–8），而 A/B 实际还承载了**列映射表**（行 9–39）。直接加 C1 会让表头语义更混乱。

| 方案 | 做法 |
|---|---|
| **A（推荐，改动最小）** | A1=`Field Name`、B1=`Column Reference`、C1=`Data Type`；元数据块留在 A2:B8（C 留空）。解析规则：**仅当 B 以 `Column-` 开头、且 A 命中 `CODE_SHEET_KEYS` 时才作为列映射**；其余 A/B 对当元数据。映射行 9–39 的 C 列填 `Date` / `Text` / `Number` |
| B（更清晰，改动大） | 把 Project Metadata 整块搬到空白区（如 M1:N8），A:C 纯粹做映射表（表头第 1 行，映射行 2–32） |

**问：A 还是 B？**（默认按 A）

### D4 — 校验是「阻断」还是「提示」
建议 **非阻断**：载入后先跑校验 → 顶部显示校验面板（错误/警告计数 + 明细）→ 图表照常生成，受影响图表卡片上打琥珀色角标。
**问：同意非阻断吗？还是要求有 Error 时禁止出图？**

### D5 — 饼图适用范围与小类合并
建议：
- 允许切换的卡片：Package Status、Discipline、Engineer Workload、Criticality、Lead Time 分桶。
- **不提供**切换（保持条形）：PO Plan vs Actual（时间序列）、Stage Plan Coverage（计划 vs 实际两组）。
- 分类数 > 8 时，饼图自动合并为「Top 8 + Other」。
- 选择记忆在 `localStorage`，下次打开沿用。

**问：同意这套范围与 N=8 吗？**

---

## §4 设计变更（按需求拆解）

### 4.1 R1 — 文件定位（依赖 D1、D2）
1. `Procurement-Dashboard.html` 定为唯一交付物。
2. 欢迎页显示预期文件名与「放到同一文件夹」提示。
3. 文件选择 `accept` 收窄为 `.xlsx,.csv`（去掉 `.xls` —— 旧二进制格式解析器不支持，见 ISS-09）。
4. 记忆上次文件句柄（Chromium 可用时）。

### 4.2 R2 — 动态类型映射（核心改动）
1. **删除 JS 里硬编码的 `DATE_FIELDS` 数组**（现写死 15 个日期字段）。
2. 新增 `parseCodeTypes()`：读取 Code!C，构建 `fieldType = { poPlan:'Date', quantity:'Number', title:'Text', … }`。
3. `buildFieldToCol()` 扩展为 `buildFieldMap()`，一次产出 `{ col, type }`。
4. 行构建循环按 `type` 分派：`Date → toDate()`、`Number → Number()`、`Text → String()`。
5. 元数据读取不变（Header Row / List End Row / AsOf Date / Project Title / …）。
6. Code!C 缺失或类型值不认识时：回退到旧的硬编码 `DATE_FIELDS`，并在校验面板提示「Code 表缺少 Data Type 列」。

### 4.3 R3 — 欢迎页
- 现状已满足（drop zone + browse + 隐私说明）。
- 增量：预期文件名提示、上次文件记忆、明确的错误横幅（现有）、载入进度反馈（大文件解析时）。

### 4.4 R4 — 校验引擎（全新模块）
流程：`解析 → 校验 → 校验面板 → 图表`。

**面板设计**
- 全宽卡片，位于 KPI 之上。
- 顶部：严重度计数徽章（Error / Warning / Info）+ 一句话结论。
- 中部：按规则聚合的清单（规则 ID、命中条数、示例）。
- 底部：明细表（最多 50 行：Package No. / 字段 / 当前值 / 说明），超出部分提示「导出完整报告」。
- 操作：`导出校验报告 (CSV)`、`继续生成图表`（非阻断时自动继续）。

**规则清单见 §5。**

### 4.5 R5 — 图表类型切换
1. 新增 `svgPie()`：环形/饼图 + 图例（分类名、数值、百分比），`localStorage` 记忆选择。
2. 每张适用卡片头部加分段控件 `条形 | 饼图`（沿用 Apple 风格分段控件样式）。
3. 实现 Top-N + Other 合并（N=8）。
4. 关键性全空时，饼图退化为 100%「Not Specified」—— 此时卡片下方显示提示「填入 Criticality 后此图才有意义」（与校验 V-05 联动）。
5. 复制/下载 PNG 对饼图同样生效（现有 `chartToPng` 直接复用）。

---

## §5 校验规则清单

| ID | 对象 | 规则 | 严重度 |
|---|---|---|---|
| V-01 | Package Title | 为空 → 该行不作包处理，跳过 | Info |
| V-02 | 所有 `type=Date` 字段 | 数字 ≤ 40000（如 60/90/120 占位）→ 非真日期 | **Error** |
| V-03 | 所有 `type=Date` 字段 | 文本无法解析为日期 | **Error** |
| V-04 | `type=Number` 字段（Quantity / Lead Time） | 非数字 | **Error** |
| V-05 | Criticality | 非空且 ∉ Code!G（0–4）→ Error；**为空 → Warning**（现状 121/121 空） | Error / Warning |
| V-06 | Discipline | ∉ Code!E 列表 | Warning |
| V-07 | Package Status | ∉ Code!K 描述列表（同时接受 Code!J 代码） | **Error** |
| V-08 | 阶段顺序 | 计划日期 MR ≤ PO ≤ VD ≤ FAT ≤ ROS 被违反 | Warning |
| V-09 | Actual 日期 | 有 Actual 但对应 Plan 为空 | Warning |
| V-10 | Actual 日期 | 晚于 AsOf Date（未来日期） | Warning |
| V-11 | Package No. | 重复 | Warning |
| V-12 | Engineer | 同一人写法不一致（`/` 前后空格差异）→ 提示并归一化后计数 | Warning |
| V-13 | 行范围 | `List End Row` 之外仍有数据行 | Warning |
| V-14 | Lead Time | 缺失率 > 50% → 覆盖率提示 | Warning |
| V-15 | Code 元数据 | `Header Row` / `List End Row` / `AsOf Date` 缺失或非法 | **Error**（无法继续） |
| V-16 | Code 类型列 | C 列（Data Type）缺失或与字段名不匹配 | Warning（回退硬编码） |
| **V-18** | Code 查表块 | 第 1 行找不到 `Discipline Description` / `Criticality` / `Package Status` / `Item Category` 任一块 | Warning（该项无法校验） |

---

## §6 问题清单（ISS）

| ID | 区域 | 问题描述 | 严重度 | 状态 | 建议修法 |
|---|---|---|---|---|---|
| ISS-01 | 文件 | 两个看板文件并存且命名倒置：`PPP_Dashboard.html` 实为静态快照，`Procurement-Dashboard.html` 才是交互引擎，极易误改 | 中 | Open | 静态版归档 `arch/`，只保留一个交互版 |
| ISS-02 | Code 表 | C 列（Data Type）不存在，HTML 目前把 15 个日期字段硬编码在 `DATE_FIELDS` | 高 | Open | 增补 Code!C + 表头；JS 改为动态读取（§4.2） |
| ISS-03 | Code 表 | A1/B1 表头语义只覆盖元数据块，列映射块（行 9–39）无表头，加 C1 后更混乱 | 中 | Open | 按 D3 选定方案统一 |
| ISS-04 | 平台 | 浏览器无法自动读取同目录文件（安全限制），R1 需明确交互方式 | 高 | Open | 按 D2 选定方案 |
| ISS-05 | 数据/逻辑 | Criticality 码域不一致：Code!G 为 **0–4**（0=Not Applicable），而 `svgCriticality()` 只渲染 **1–4** 并把空值单列 | 中 | Open | 渲染 0–4 五档 + Not Specified；校验按 V-05 |
| ISS-06 | 数据 | Package Status：PPP 存**描述文本**（如 "Requisition in Progress"），Code!J 存**短码**（NS/MR/…）；两者需映射 | 中 | Open | 校验以 Code!K 描述列表为准，同时兼容 J 列短码 |
| ISS-07 | 数据 | PPP 存在尾随空行（约 199 行）而 `List End Row=122` | 低 | Open | 按 V-13 提示；解析仍以 Package Title 非空为准 |
| ISS-08 | 数据 | Engineer 命名不一致（"Dilip/Siva" vs "Dilip / Siva"）导致按人统计虚高 | 中 | Open | V-12 归一化（去空格后再比对） |
| ISS-09 | 解析器 | 文件选择器接受 `.xls`，但旧二进制格式无法解析 | 低 | Open | `accept` 收窄为 `.xlsx,.csv` |
| ISS-10 | 环境 | 本沙箱 Bash / PowerShell 均连接中断，无法跑 node/python 做端到端验证 | 中 | Open | 验证改由你在本地执行；我给出验收清单（§8） |
| ISS-11 | 设计 | 饼图在分类过多（Discipline 19、Engineer 多值）时不可读 | 中 | Open | Top-8 + Other 合并（D5） |
| ISS-12 | 设计 | Criticality 全空 → 饼图/条形均只有「Not Specified」一根，易被误读为「故障」 | 低 | Open | 图表下方加数据缺失说明，与 V-05 联动 |
| ISS-13 | Code 表 | 2026-09-15 再次复核：**Code!C 仍为空**。用户称已更新，可能是另存到别的路径或未保存 | 高 | Open | 请确认保存到 `C:\Users\qinghua.song\DSAI\workbuddy\PPP\TWRP C3B2 - Procurement Package Plan.xlsx`；页面已双向兼容 |
| ISS-14 | Code 表 | `Category Code`（M 列）20 项**全部为空**，只有描述列 N 有值 | 低 | Open | 若 PPP 将来存短码，需先补 M 列；当前 PPP 存的是描述文本，暂不影响 |

**已关闭（历史问题，仅备案）**：重复 `id="status"` 导致图表空白；`(d||'').toLowerCase` 崩溃；SVG `height:auto` 塌陷；`rowsTmp.push({row})` 未定义。

---

## §7 实施批次（进度见 §0b）

| 批次 | 内容 | 依赖 |
|---|---|---|
| **B1** | 文件整合：归档 `PPP_Dashboard.html` / `parse_excel.py` / `test_parser.js` 到 `arch/` | D1 |
| **B2** | Code 表结构 + 动态类型映射（删 `DATE_FIELDS`，读 Code!C），`accept` 收窄 | D3 |
| **B3** | 校验引擎 + 校验面板 + CSV 导出（§5 全部规则） | D4、B2 |
| **B4** | 图表类型切换：`svgPie()` + 分段控件 + Top-8 合并 + 偏好记忆 | D5 |
| **B5** | 欢迎页增强（预期文件名、上次文件记忆）+ 全量回归（§8） | D2 |

建议顺序：**B1 → B2 → B3 → B4 → B5**。B2 是 B3 的前置（校验依赖类型信息）。

---

## §8 验收清单

1. 打开 `Procurement-Dashboard.html` → 出现欢迎页，显示预期文件名。
2. 拖入 `TWRP C3B2 - Procurement Package Plan.xlsx` → 解析成功，无红色错误横幅。
3. 顶部出现**校验面板**，Error/Warning/Info 计数与 §5 预期一致（例如 Criticality 空 121 条 → Warning）。
4. 故意把某个 PO Plan 改成 `120` → 重新载入 → 该值被 V-02 标为 Error 并出现在明细表。
5. 6 张 KPI 卡数值与 Code 表 `Header Row=1 / List End Row=122` 范围一致（总包数 121）。
6. Package Status 卡片切换「饼图」→ 正常渲染、图例带百分比；刷新后仍保持饼图。
7. Discipline 切饼图 → 显示 Top 8 + Other。
8. PO Plan vs Actual 与 Stage Coverage 卡片**不出现**切换控件（保持条形）。
9. 复制图像 / 下载 PNG 在条形与饼图下均可用。
10. 任意图表出错时，只有该卡片显示红字，页面其余部分正常。
11. 校验面板的 **Code sheet map** 行显示：`31 field mapping(s)`、`Data Type (C): empty — using built-in fallback`、
    `Discipline Description: col E · 19 values`、`Criticality: col H · 5 values`、`Package Status: col K · 9 values`、`Item Category: col N · 20 values`。
    —— 只要这行正确，就说明查表块定位无误；显示 `not found` 说明第 1 行标题文字不一致。
12. 把 Code!C 的第 25 行（MR Plan Date）填 `Date`、第 7 行（Header Row）填 `Number` 后重新载入：
    Code sheet map 应变为 `Data Type (C): N value(s)`，且不再出现 V-16。

---

## §9 未决 / 范围外

- 是否在 Code 表补充 **Forecast** 列的业务规则（Forecast 与 Plan 偏差超阈值是否告警）—— 未纳入本轮。
- 校验报告是否需要在 Excel 内也能看到（回写 Dashboard 表）—— 未纳入。
- 多项目批量载入 / 对比 —— 未纳入。

---

## §10 B1 归档 —— 需要你执行的命令

沙箱的 Bash / PowerShell 均连接中断，我无法移动文件。请在 **PowerShell** 里执行：

```powershell
$d = "C:\Users\qinghua.song\DSAI\workbuddy\PPP\arch"
New-Item -ItemType Directory -Force -Path $d | Out-Null
Move-Item -LiteralPath "C:\Users\qinghua.song\DSAI\workbuddy\PPP\PPP_Dashboard.html" -Destination $d -Force
Move-Item -LiteralPath "C:\Users\qinghua.song\DSAI\workbuddy\PPP\parse_excel.py"      -Destination $d -Force
Move-Item -LiteralPath "C:\Users\qinghua.song\DSAI\workbuddy\PPP\test_parser.js"      -Destination $d -Force
Get-ChildItem $d | Select-Object -ExpandProperty Name
```

执行后目录里只剩：`Procurement-Dashboard.html`、`WORKPLAN.md`、`TWRP C3B2 - Procurement Package Plan.xlsx`、`arch\`。

---

**本文件为主工作plan，后续就地更新，不另建临时 md。**
