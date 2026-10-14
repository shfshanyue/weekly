# 开发者 AI 周刊 (fe-weekly)

## 项目概述

这是「开发者 AI 周刊」（原「前端周刊」，#1–#61 沿用旧名）网站，定位为写给开发者的 AI 周刊：主线关注 AI 工具、模型与 Agent 如何落地到真实开发（AI 编程、Agent 工程化、AI SDK、与开发者相关的模型发布）。不设版本发布 / 前端专栏板块；纯前端内容不收录，除非与 AI 挂钩。每周发布一期，基于 Astro 7 构建，使用 Markdown/MDX 编写内容。

## 技术栈

- **框架**: Astro 7
- **内容格式**: Markdown / MDX
- **包管理器**: pnpm
- **Node 版本**: >= 22.12.0
- **集成**: @astrojs/mdx, @astrojs/sitemap, @astrojs/rss

## 项目结构

- `src/content/blog/` — 周刊文章（Markdown/MDX），每篇文章需包含 frontmatter：`title`, `description`, `pubDate`, 可选 `updatedDate`, `heroImage`
- `src/pages/` — 页面路由（Astro 组件）
- `src/components/` — 可复用组件
- `src/layouts/` — 页面布局
- `src/styles/` — 全局样式
- `src/consts.ts` — 站点级常量（标题、描述等）
- `src/content.config.ts` — 内容集合的 schema 定义

## 周刊内容规范

### 文件命名

- 文件名格式：`weekly-N.md`（N 为期号），存放于 `src/content/blog/`
- frontmatter 必须包含 `title`、`description`、`pubDate`，可选 `updatedDate`、`heroImage`

### 标题格式

- `开发者 AI 周刊 #N：标题关键词`，例如：`开发者 AI 周刊 #62：Claude Code 插件、AI SDK 6 与 Vite 8`
- 历史期（#1–#61）保留原标题「前端周刊 #N：…」，不要改动，旧期原地保留、只做坏链等必要修复
- 编号延续旧刊不重置：改名后第一期为 #62，之后依次 +1，链接格式仍为 `/weekly-N/`
- 冒号后至少包含 **1 个可搜索的英文产品/版本名**（如 `AI SDK 6`、`Claude Code`、`TypeScript 7`），优先从「工具推荐」或「本周快讯」中选取；`description` 与 `title` 共享同一组关键词

### 内容板块（按顺序）

1. **本周快讯**（可选）— 独立的一周 AI / 开发要闻列表（非下文的总结），带来源链接，每条一句话，建议 8-10 条（模型 / SDK 发版可写进这里）
2. **技术文章**（必填）— 以 AI 落地开发为主（AI 编程、Agent、AI SDK 实践），卡片式，建议 5-8 篇
3. **工具推荐**（必填）— AI 开发工具、Agent 框架、MCP、SDK 等，卡片式，建议 5-8 个（重要发版并入本栏，不单开「版本发布」）

已取消：版本发布、前端专栏、本周我验证了。与 AI 挂钩的前端内容并入技术文章或工具推荐。

### 选题不做

- 不追融资 / 估值八卦；不写安全对齐或政策长文（除非直接改变可用 API / 产品行为）；不报无关具身机器人（除非有 API / SDK）
- 不与日更媒体拼全量快讯；强调筛选与工程点评
- **不收录与 AI 无关的纯前端 / 构建 / CSS 动态**

### 卡片式格式

每张内容卡片 2–3 个短段落；**最后一段必须是落地句**，前缀用 `落地建议：`（默认）或 `谁该关心：`。信息层次参考 The Batch brief，压缩为中文短卡片（详见 `.agents/skills/dev-ai-weekly/SKILL.md` §4.5–4.6）：

- 第一段：发生了什么
- 中间段：机制 **或** 可核对数字（价格、评测、门禁/数据保留）；研究向先一句 Key insight
- 末段：落地建议点明适用阶段或约束；成本优先写每任务/每小时
- 禁止「标题翻译 + 空泛推荐」；不模仿长卷首信或 20 分钟篇幅

```markdown
### [中文标题](链接)

第一段：来源与主题。

第二段：机制或可核对数字。

落地建议：具体到谁、在什么场景/阶段、可先试哪一步、有何约束。
```

### 本周快讯格式

```markdown
## 本周快讯

- [关键词](链接) 一句话描述。
```

### 标签

- 周刊文章**不使用** tags / 标签分类系统，不要为文章添加 tags 字段

## 其他规范

- 图片资源放在 `src/assets/` 或 `public/` 目录
- 使用中文撰写内容

## 流量分析

- 站点 URL: https://weekly.shanyue.tech
- GSC site_url: sc-domain:shanyue.tech
- GA4: 未接入（低投入策略，仅用 GSC）

## 维护策略

### 定位

个人品牌名片 + 策展练习。成功标准：按期发布、链接可用、RSS 正常。

明确不做（产品侧）：GA4、SEO 大改、HN/Reddit 推广、每期长文原创、短期付费墙。

明确不做（选题侧）：见上文「选题不做」。

### 每周流程（约 1–2 小时）

1. 按 `.agents/skills/dev-ai-weekly/SKILL.md` 抓取：AI 主源（TLDR AI、Latent AINews、AI 开发者日报、厂商/AI SDK/Cursor changelog、阮一峰当周 AI）；前端周刊源仅在条目与 AI 挂钩时选用
2. 预筛约 15 条给人确认 → 生成 `src/content/blog/weekly-N.md`（每条含「落地建议」）→ 人工扫标题与链接
3. `pnpm build` → Vercel 部署
4. 发一条 X；有余力再发「本期 5 条精选」到微信等中文渠道（链回完整 Web 版）

### 每月检查（约 30 分钟）

- GSC 查看 `开发者 AI 周刊` / `AI 周刊` 品牌词排名（新品牌词从零积累），同时观察旧词 `前端周刊` / `前端技术周刊` 的衰减
- 确认最新一期可访问、RSS 有更新

### 降级信号

出现以下情况再考虑季更或归档：连续 8 周未发；或内容已完全重复主站/X，无独立价值。
