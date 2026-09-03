# 前端周刊 (fe-weekly)

## 项目概述

这是一个前端技术周刊网站，每周发布一期，基于 Astro 6 构建，使用 Markdown/MDX 编写内容。

## 技术栈

- **框架**: Astro 6
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

- `前端周刊 #N：标题关键词`，例如：`前端周刊 #42：Vite 7 发布与 React 新特性`
- 冒号后至少包含 **1 个可搜索的英文产品/版本名**（如 `TypeScript 7`、`Vite 8`、`Node 26`），优先从「版本发布」或「本周快讯」中选取；`description` 与 `title` 共享同一组关键词

### 内容板块（按顺序）

1. **本周快讯**（可选）— 独立的一周技术要闻列表（非下文的总结），带来源链接，每条一句话，建议 8-10 条
2. **技术文章**（必填）— 卡片式：标题带链接 + 4-5 句摘要点评，建议 5-8 篇
3. **工具推荐**（必填）— 卡片式：标题带链接 + 4-5 句摘要点评，建议 5-8 个
4. **版本发布**（必填）— 卡片式：标题带链接 + 4-5 句摘要点评，建议 4-6 个

### 卡片式格式

```markdown
### [标题](链接)

四到五句摘要点评。
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

明确不做：GA4、SEO 大改、HN/Reddit 推广、每期长文原创。

### 每周流程（约 1–2 小时）

1. 用 `.agents/skills/fe-weekly-creator/SKILL.md` 抓 4 个核心源（JS Weekly、Frontend Focus、Node Weekly、React Status）
2. AI 生成 `src/content/blog/weekly-N.md`，人工扫标题与链接
3. `pnpm build` → Vercel 部署
4. 发一条 X（RSS 自动更新）

### 每月检查（约 30 分钟）

- GSC 查看 `前端周刊` / `前端技术周刊` 品牌词排名
- 确认最新一期可访问、RSS 有更新

### 降级信号

出现以下情况再考虑季更或归档：连续 8 周未发；或内容已完全重复主站/X，无独立价值。
