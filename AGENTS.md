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

### 内容板块（按顺序）

1. **一句话技术总结**（可选）— 带来源链接的列表，每条一句话，建议 8-10 条
2. **技术文章**（必填）— 卡片式：标题带链接 + 4-5 句摘要点评，建议 5-8 篇
3. **工具推荐**（必填）— 卡片式：标题带链接 + 4-5 句摘要点评，建议 5-8 个
4. **版本发布**（必填）— 卡片式：标题带链接 + 4-5 句摘要点评，建议 4-6 个

### 卡片式格式

```markdown
### [标题](链接)

四到五句摘要点评。
```

### 一句话技术总结格式

```markdown
- [关键词](链接) 一句话描述。
```

### 标签

- 周刊文章**不使用** tags / 标签分类系统，不要为文章添加 tags 字段

## 其他规范

- 图片资源放在 `src/assets/` 或 `public/` 目录
- 使用中文撰写内容
