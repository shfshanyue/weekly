---
title: "周刊重启，React 19, Node.js 2023 总结，SQL 注入攻击防御，数据库 max_connections 配置" 
date: 2024-03-01T00:00:00.000Z
release: 30
---

## 文章推荐

1. [React Compiler 理论和响应性](https://www.recompiled.dev/blog/ssa/) - React 团队一直在研究 React 编译器，"静态单一分配(SSA)"是编译器理论中的一个重要概念，React 编译器借鉴了这个概念，实现了更高效的值追踪和缓存。对于 React 组件中的状态和属性，通过适当的缓存、追踪，能够有效提升组件渲染性能。
2. [React 团队分享他们的工作进展](https://react.dev/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024) - React 更新了 Lab 中进行中的研究与开发计划的最新情况，重点包括 React Compiler、Actions、和即将发布的 React 19 的主要特性。React Compiler 现已在 Instagram 生产环境中运行。Actions 成为一个功能更广泛的集合，票亮可以支持客户端和服务器端的数据处理。
1. [使用 Server Actions 探索 Next.js 表单](https://www.robinwieruch.de/next-forms/) - 作者深入研究了使用 Next.js 14 中的表单，包括 Next 的 App Router、React Server Components (RSC) 和 Server Actions。这个全面的教程涵盖了 React/Next 的原生方面，如 `useFormStatus`、`useFormState` 和 `revalidatePath`。
4. [Node.js 在 2023 年的总结](https://blog.rafaelgss.dev/nodejs-2023-year-in-review) - 文章提供了项目在2023年的主要改变和讨论，以及过去十年的提交统计数据。2023年，Node.js的主仓库收到了2641个提交。值得关注的是，即使如此成熟的项目，Node.js在过去的年份中仍在显著发展，这可能得益于Grace Hopper’s Day等各种活动的推动。此外，Node.js 在 2023 年进行了102次发布，并且值得注意的是，14、16和19版现已到达生命周期终点，而18版处于维护模式。
1. [防御 Node.js 中的 SQL 注入攻击](https://snyk.io/blog/preventing-sql-injection-attacks-node-js/) - 了解为什么和在哪里 SQL 注入攻击构成威胁，以及一些初始的方法来保护您的 Node 应用程序免受这些攻击。
1. [如何使用 TypeScript 在 2024 年开发 Node 服务器应用](https://javascriptweekly.com/link/151722/web) - 教程介绍了如何使用 TypeScript 设置现代的 Node 项目，包括热重载和加载环境变量。
1. [When Less is More: Database Connection Scaling](https://richyen.com/postgres/2021/09/03/less-is-more-max-connections.html) — 一个 Postgres 服务器可以处理的连接越多越好，对吗？并不总是如此。如果 `max_connections` 设置为一个不切实际的数字，即使这些连接没有被使用，也会产生负面影响。

## 开发利器

1. [Math.random() 分布可视化](https://alterebro.com/random-distribution/)。
1. [Puppeteer 22.2](https://pptr.dev/) - 使用 Node.js 控制 Chrome 浏览器，现在支持 Chrome 122 版本。
1. [Functional UI Kit: 一个统一 Figma 和 React UI 组件库](https://functional-ui-kit.com/) - 这是一个试图弥合设计和代码之间鸿沟的伟大尝试，由 Figma 的 Community Creators Fund 资助。

## 开源与库

1. [React-Uploady 1.8：文件上传组件和 Hooks](https://react-uploady.org/) - 简单但可定制。您将获得文件上传按钮、预览、拖放上传区域等功能。
1. [react-resizable-panels 2.0.11](https://react-resizable-panels.vercel.app/) - 可调整大小的面板组/布局的组件。
1. [TanStack Table 8.13](https://github.com/TanStack/table) - 用于构建表格和数据网格的 Headless UI。
1. [React Big Calendar 1.11](https://github.com/jquense/react-big-calendar) - 类似于 GCal/Outlook 的日历组件。
1. [Systeminformation：用于 Node 的系统信息库](https://github.com/sebhildebrandt/systeminformation) - 如果您想查询您的 Node 程序运行的环境信息，这个库适合您，它可以获取有关音频设备、蓝牙设备、打印机、USB、CPU、架构、WiFi 等的信息。
1. [PGlite: Postgres in WebAssembly](https://github.com/electric-sql/pglite) — 人们之前已经将 Postgres 引入到 WebAssembly 环境中，但通常需要在其中添加一个 Linux VM 层。PGlite 将一个 WASM 构建的 Postgres 打包成一个 TypeScript 库，可以在浏览器、Node.js 或 Bun 中运行，而且只有 3.7MB 的压缩大小！
1. [Apache ECharts 5.5: 强大的可视化库](https://echarts.apache.org/handbook/en/basics/release-note/5-5-0/) - ECharts是一个强大且简单易用的可视化库，它具备很高的灵活性和简洁性。你可以通过它做很多事情，而不会让代码变得复杂。v5.5 增强了对 ESM 的支持，添加了服务器端渲染支持，并且允许创建不完整的饼图。
