# P1 重构计划：导航六标签 + Review 去 Mode 化 + 卡片级 ReviewType 控制

> 基于用户确认的四个决策点制定。不直接改代码，仅产出方案供评审。

---

## 1. 底部导航：5 → 6 标签

| 现状 (5) | 目标 (6) | 备注 |
|---|---|---|
| 计划 | 计划 | 不变 |
| 每日 | 每日 | 不变 |
| 阅读 | 阅读 | 不变 |
| 复习 | 复习 | 去掉 mode 行，仅保留 Scope 段控 |
| 我的 | 练习 **← 新增** | 承载原 Review 的三个 free 模式 |
| — | 我的 | 右移一位 |

**i18n 新增键**：`tab_practice` (zh: "练习", en: "Practice")

**图标建议**：
- 练习：`🏋️` 或 `🎯` 或 `🏃`（需确认）
- 现有五个图标不变

---

## 2. Practice Tab（新标签页）

把现有 Review 的三个 **free 模式** 整体迁移至此，Review 仅剩 SRS 驱动的到期复习。

| 区块 | 来源 | 交互 |
|---|---|---|
| **全部单词** (All Flash) | 原 `mode=allflash` | 单包/全部包 两级筛选（沿用现有 subbar）；免打分、不入档 |
| **听写/跟读** (Listen & Learn) | 原 `listenMode` | 保持现有听写/跟读流程；可选 scope（本包/全部包） |
| **词汇测验** (Quiz) | 原 `mode=quiz` | 5 题/轮；可选 scope（本包/全部包） |

**页面结构**：
```
Practice 面板
├── 顶部段控：[全部单词] [听写/跟读] [词汇测验]  —— 三选一
├── Scope 行（仅全部单词/测验显示）：[本包] [全部包]
└── 内容区：对应模式的渲染器
```

**状态变量迁移**：
- `reviewMode === 'allflash'` → `practiceMode === 'allflash'`
- `reviewMode === 'quiz'` → `practiceMode === 'quiz'`
- `listenMode` 相关变量不动，只改渲染入口

---

## 3. Review Tab：去 Mode 行，按 reviewType 自动分发

### 3.1 UI 结构变化

```
Review 面板（新）
├── 顶部卡片：标题 + review_intro（含 dueN）
├── Scope 段控：[本包] [全部包]  ← 仅此一行控制
├── 进度条（queueTotal / 当前位置）
└── 卡片区：按该词 reviewType 自动渲染步骤
```

**移除**：原 `#reviewSeg` 五按钮 mode 行（🔁/✏️/📖/📚/✍️）

**保留**：`state.reviewScope` 持久化、`dueCards()` / `dueCardsGlobal()` 队列构建逻辑

### 3.2 卡片渲染逻辑（复用 P0 state machine）

| reviewType | 步骤序列 | 说明 |
|---|---|---|
| `flash_only` | `[flash]` | 成熟卡/用户显式设置 |
| `flash_context` | `[flash, context]` | 新词默认、大多数名词/形容词 |
| `productive_context` | `[productive, context]` | 动词、低 ease、forgotten |
| `context_only` | `[context]` | 高频功能词、短语 |
| `skip` | 不入队 | 用户显式跳过 |

> 这就是 P0 已实现的 `stepsFor()` 逻辑，**不需要改动**，只需去掉 mode 行让它自然生效。

---

## 4. 卡片级 ReviewType/Skip 编辑入口

### 4.1 Daily 卡片：仅设置入口

**位置**：每张 Daily 卡片右上角 `⋯` (更多) 或 `⚙️` 图标

**点击后**：弹出底部 Sheet / Popover
```
┌─────────────────────┐
│  复习方式设置：serene  │
├─────────────────────┤
│  ○ 卡片 (Flash)       │  ← flash_only / flash_context
│  ○ 拼写 (Spell)       │  ← productive_context
│  ○ 语境 (Context)     │  ← context_only
│  ○ 跳过 (Skip)        │  ← skip
├─────────────────────┤
│  [取消]    [保存]      │
└─────────────────────┘
```

**保存动作**：
- 写入 `state.flashcards[wkey(word)].reviewType = 选中的值`
- 调用 `saveState()`，`renderMe()` 刷新导航 badge
- **不触发即时复习**，用户下次进 Review 时生效

### 4.2 Review 卡片：即时生效的设置入口

**位置**：复习卡片顶部页眉右侧，或卡片底部按钮行加入 `⚙️` 按钮

**交互差异**：
- 用户在 Review 中改了某词的 reviewType，**当前卡片的剩余步骤立即按新类型重新分发**
- 例：正在做 `flash_context` 的第 1 步 flash，用户改为 `context_only` → 评分/翻面后直接进单步 context，不再走原来的第 2 步

**实现**：
- 复用同一个设置 Sheet 组件
- 保存后调用 `resetCardStepFor(currentWord)` 触发 `renderReview()` 重新解析 `cardSteps`

---

## 5. 状态变量清理 / 迁移表

| 旧变量 | 去向 |
|---|---|
| `reviewMode` (5值) | 仅 Review 内部用；`allflash/quiz/listen` 迁移到 `practiceMode` |
| `freePractice` | 迁移到 Practice 模块内部，或复用 `practiceMode === 'allflash'` 隐式表示 |
| `allSub` | 随 `allflash` 迁移到 Practice |
| `quizData/quizIdx/quizScore` | 迁移到 Practice 模块 |
| `listenMode/相关变量` | 不动，只改渲染入口 |

**新增**：
- `practiceMode` ∈ `{'allflash','listen','quiz'}`
- `practiceScope` ∈ `{'pack','all'}`（仅 allflash/quiz 用）

---

## 6. 文件改动清单（预估）

| 文件 | 改动类型 |
|---|---|
| `pwa/index.html` | 核心改动：HTML 结构、底部导航、Review/Practice 面板渲染分离、设置 Sheet 组件、状态变量迁移 |
| `pwa/sw.js` | 版本 bump |
| `english-learning-tool.html` | mirror cp |
| `WORKPLAN.md` | §13 新增 6-tab 重构记录；§17 live hash 更新 |
| `.workbuddy/memory/YYYY-MM-DD.md` | 追加日志 |

---

## 7. 需要确认的细节（评审时再定，不阻塞方案）

1. **Practice tab 图标**：`🏋️` / `🎯` / `🏃` / 其它？
2. **Daily/Review 卡片的设置图标**：`⋯` (more-horizontal) / `⚙️` / `🔧` / 长按唤出？
3. **Skip 词的视觉反馈**：Daily 列表里 skip 的词是否置灰/加删除线/显示 🚫 徽章？
4. **Review 卡片设置按钮位置**：顶部页眉右侧 vs 底部按钮行右侧 vs 卡片右上角悬浮？
5. **Scope 段控样式**：沿用现有 `#reviewScopeRow` 样式，还是做成与 Practice 顶部段控统一的新组件？

---

## 8. 实施顺序建议（最小风险）

1. **Step 1**：底部导航 + Practice 空壳页（只渲染 "Coming soon"），验证 6-tab 布局不破坏现有 5 tab
2. **Step 2**：把 allflash/listen/quiz 完整迁移到 Practice，Review 删 mode 行、只留 Scope
3. **Step 3**：Review 卡片渲染验证（P0 state machine 已就绪，应直接工作）
4. **Step 4**：Daily 卡片设置入口 + Review 卡片设置入口（共用 Sheet 组件）
5. **Step 5**：SW bump + mirror + 部署验证

---

## 9. 回滚策略

- 所有改动在 `pwa/index.html` 单文件内，**git 可随时回滚**
- 新变量 `practiceMode` 等与旧变量正交，不会污染旧状态
- 若上线后发现严重问题，切回旧版 index.html 即可（localStorage 结构兼容）

---

**下一步**：用户确认方案无遗漏后，我按 Step 1~5 顺序实施。请评审上述方案，特别关注第 7 节"需确认细节"。