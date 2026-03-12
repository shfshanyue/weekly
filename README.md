# 前端周刊 (fe-weekly)

每周更新的前端技术周刊，基于 [Astro](https://astro.build) 构建。

## 技术栈

- [Astro 6](https://astro.build) — 静态站点框架
- Markdown / MDX — 内容编写
- RSS / Sitemap — 自动生成

## 项目结构

```text
├── public/              # 静态资源
├── src/
│   ├── assets/          # 图片等资源
│   ├── components/      # 可复用组件
│   ├── content/blog/    # 周刊文章 (Markdown/MDX)
│   ├── layouts/         # 页面布局
│   ├── pages/           # 路由页面
│   └── styles/          # 全局样式
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 快速开始

```bash
pnpm install       # 安装依赖
pnpm dev           # 启动开发服务器 (localhost:4321)
pnpm build         # 构建生产版本
pnpm preview       # 本地预览构建产物
```

## 发布新一期周刊

在 `src/content/blog/` 下新建 `weekly-N.md` 文件，参考模板：

```markdown
---
title: '前端周刊 #N：标题关键词'
description: '本期摘要'
pubDate: 'Mar 12 2026'
---

## 一句话技术总结

- [Vue 3.6](https://example.com) 引入了 Vapor Mode，可大幅减少虚拟 DOM 开销。

## 技术文章

### [文章标题](https://example.com)

三到四句摘要点评。

## 工具推荐

### [工具名称](https://example.com)

三到四句摘要点评。

## 版本发布

### [项目名 vX.Y.Z](https://example.com)

三到四句摘要点评。
```

> **注意**：一句话技术总结为可选板块，其余三个板块必填。

## License

MIT
