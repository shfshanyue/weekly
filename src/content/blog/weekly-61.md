---
title: "前端周刊 #61：Vite+ 1.0、Vinext 1.0 与 MSW 3.0"
description: "Vite+ 1.0、Vinext 1.0、MSW 3.0、claude.ai 提速 3 倍"
pubDate: 2026-10-05
---

## 本周快讯

- [迭代器三提案进入 Stage 4](https://github.com/tc39/agendas/blob/main/2026/09.md) TC39 东京会议上 Iterator chunking、join、includes 推进至 Stage 4，其中 `Iterator.prototype.includes()` 已随 [Chrome 154](https://developer.chrome.com/release-notes/154#javascript) 落地。
- [Cloudflare 推出 cf CLI](https://blog.cloudflare.com/cloudflare-cf-cli-launch/) 新 CLI 覆盖全部 Cloudflare API，默认 JSON 输出，面向 Agent 设计，Wrangler 此前仅覆盖约 280 个操作。
- [Angular 部分改用 Rust 编译](https://blog.angular.dev/an-update-on-angulars-typescript-7-powered-compiler-9619a35e2b0a) TypeScript 7 不再提供 `ts.Transformer`，Angular 基于 Oxc 打造新编译器 ngp，计划年内发布实验版。
- [VoidZero 加入 Cloudflare 四个月](https://blog.cloudflare.com/voidzero-update/) 发布 80+ 个版本、关闭 1200+ issue，Vitest 5 最高提速 50%，tsgolint 进入稳定版。
- [Bun AOT 编译预览](https://x.com/jarredsumner/status/2104739495895781679) Jarred Sumner 演示 AOT 编译 Claude Code：启动快 24%、内存少 48%，代价是二进制体积约翻倍。
- [Turnstile Spin](https://blog.cloudflare.com/turnstile-spin/) Cloudflare 让 Agent 端到端完成 Turnstile 前后端接入，也可修复错误安装或迁移旧 CAPTCHA。
- [Firefox 157 新外观](https://blog.mozilla.org/en/firefox/new-firefox-design-is-here/) Firefox 157 带来全新的界面设计。
- [Safari 技术预览版 253](https://webkit.org/blog/18357/release-notes-for-safari-technology-preview-253/) Web Inspector 支持网络节流，并修复大量 scroll-driven animations 与 `timeline-scope` 问题。
- [Polypane 31](https://polypane.app/blog/polypane-31-canvas-layout-elements-panel-improvements-and-chromium-155/) 开发者浏览器新增无限画布布局与 Elements 面板改进，内核升级至 Chromium 155。

## 技术文章

### [Anthropic 两周让 claude.ai 提速 3 倍](https://claude.dev/blog/how-we-made-claude-ai-faster/)

Anthropic 团队复盘 8 月的两周性能冲刺：在一个 Slack 频道里让 Claude 参与每个线程，找瓶颈、建 benchmark、提 PR 并盯部署。

p75 首次加载到「可输入」从 3.1s 降到 0.55s，合并 3000+ 变更且零回滚。典型发现包括：一个 `:root:has()` 选择器让每次 DOM 变更多花 24ms，遗留的 `location.reload()` 每天造成 50 万次隐性重载，em dash 让 V8 把字符串存成 UTF-16、迫使高亮正则走慢路径。

核心经验是「先能测量，才能爬坡」：用指令数、React commit 次数等确定性指标做 CI 棘轮，防止性能回退。

### [GitHub 全面告别 CSS-in-JS：发更多 CSS，反而更快](https://github.blog/engineering/architecture-optimization/improving-site-performance-by-shipping-more-css/)

Josh Black 与 Marie Lucca 讲述 Primer 设计系统与 github.com 从 `styled-components` 迁移到 CSS Modules 的三年历程，截至 2026 年 6 月已 100% 运行在 CSS Modules 上。

Primer 组件迁移后，服务端渲染耗时减少 55%，组件初始化耗时减少 25%。业务侧约 7760 个 `sx` prop 靠 codemod 和 feature flag 逐包迁移，最后 895 个借助 Copilot coding agent 三周清零。

对仍背着运行时 CSS-in-JS 的大型 React 应用，这是一份「设计系统先行 + 灰度 + 视觉回归」的迁移范本。

### [V8 中 null 原型对象的性能陷阱](https://adventures.nodeland.dev/archive/optimizing-objects-with-null-prototypes/)

Matteo Collina 发现：在 V8 里用 `{ __proto__: null }` 或 `Object.create(null)` 创建的对象一出生就处于 dictionary mode，且读取再多次也不会变回 fast mode。

改用「原型为 null 的 class 实例」或「普通字面量后再 `Object.setPrototypeOf(o, null)`」即可保持快速属性。Node 核心的 WebStreams 据此改造后，pipeTo 吞吐约翻倍，WritableStream 创建快 204%。

只需关注热路径上的 null 原型对象，一次性使用的描述符对象无需改动。

```js
// 慢：始终是 dictionary mode
const a = { __proto__: null, x: 1 };
// 快：保留 fast properties
const b = Object.setPrototypeOf({ x: 1 }, null);
```

### [前端架构大一统：导航、内容与即时反馈](https://dev.to/playfulprogramming/the-grand-unifying-architecture-of-frontend-bhk)

SolidJS 作者 Ryan Carniato 认为，HTMX、LiveView、Astro 岛屿、RSC、SPA 和同步引擎的差别，主要在于如何在客户端和服务端之间分配三项职责：导航、内容与交互反馈（affordances）。

写操作走导航与 action，服务端内容只做单向读取，乐观更新作为覆盖层叠在上面。文章借此展示 Solid 2.0 如何用异步 Signals 与 `"use server"` 覆盖从纯服务端到 SPA 的整个光谱。

适合在 RSC、HTMX、SPA 之间做技术选型时，借这套框架理清各方案的取舍。

### [Connection-Allowlist：限制页面只能连接指定服务器](https://developer.chrome.com/blog/connection-allowlist-announcement)

Chrome 152 引入 `Connection-Allowlist` 响应头，让浏览器拦截页面或 Worker 发往白名单以外目标的所有网络连接，弥补 CSP 只管「加载什么」、不管「连到哪」的空白。

规则使用 URLPattern 语法，默认阻止重定向与 WebRTC，并提供 `Connection-Allowlist-Report-Only` 观察模式。官方建议把不可信代码放进跨源或 sandbox iframe 后再单独施加该策略。

运行 AI 生成代码或第三方脚本的应用，可以用它作为防数据外泄的兜底。

```http
Connection-Allowlist: ("https://api.example.com/*" response-origin)
```

### [纯 CSS 检测元素重叠](https://ishadeed.com/article/css-detect-overlap/)

Ahmad Shadeed 想在装饰元素碰到内容区时自动隐藏它，最终只用 CSS 实现了「碰撞检测」。

做法是先用 anchor positioning 生成一个测量两者间距的元素，里面放固定宽度的伪元素；间距不足时该元素溢出，触发 `scroll-timeline`，再借 `timeline-scope` 把变量翻转传到外层，最后用 style container query 隐藏装饰元素。

依赖较新的浏览器特性，适合作为渐进增强，也是理解 scroll-driven animations 新用法的好例子。

### [Interop 2027 该优先修什么](https://olliewilliams.xyz/blog/interop-and-beyond/)

Ollie Williams 列出自己为 Interop 2027 投票的特性排序：Sanitizer API、`moveBefore()`、AVIF/JPEG XL 渐进渲染、`focusgroup`、CSS gap decorations、`grid-lanes`（Masonry）等。

他还提出一份尚未成熟的「pre-op」愿望清单，排在首位的是 `appearance: base` 与 CSS Forms 规范，也就是让原生表单控件终于可以完全自定义样式。

想了解明年浏览器兼容性重点的开发者，可以顺着文中链接去 developer-signals 仓库投票。

## 工具推荐

### [Size Limit 14：默认改用 Rolldown 的 JS 性能预算工具](https://github.com/ai/size-limit/releases/tag/14.0.0)

Evil Martians 的 Size Limit 会在每次提交时计算 JS 对用户的真实成本，超出预算就让 CI 失败，还可以估算下载与执行时间。

14.0 起 `@size-limit/preset-small-lib` 默认使用 Rolldown，同时精简依赖；14.1 新增 `--ignore-missing` 参数。配合 GitHub Action 可在 PR 中评论体积变化。

适合 npm 库作者和对 bundle 体积敏感的团队，防止依赖悄悄膨胀。

### [Transitions.dev：可复制的 UI 过渡动画合集](https://transitions.dev/)

Jakub Antalik 收集卡片缩放、数字弹入、菜单下拉、图标切换等常用 UI 过渡，每张卡片都能一键复制自包含的 CSS 片段。

片段自带 CSS 变量与 `prefers-reduced-motion` 降级，也可以用 `npx transitions-dev add` 安装，或通过 `npx skills add` 作为 Agent skill 使用。部分动画属于付费 Pro 计划。

想给产品加上精致微交互、又不想引入动画库时，可以直接从这里取用。

### [soundcn：用 shadcn 方式安装 UI 音效](https://www.soundcn.xyz/)

Kapish Dima 整理了 700 多个点击、通知、转场类短音效，可以通过 shadcn CLI 按需装进项目，例如 `npx shadcn add @soundcn/click-soft`。

每个音效是内联 base64 的 TypeScript 模块，搭配零依赖的 `useSound` Hook，基于 Web Audio API 播放，无需额外请求资源。

使用前请留意许可：大部分为 CC0，但魔兽世界音效集并非自由授权。

### [Custom Attributes Polyfill：给任意元素挂载可复用行为](https://www.keithcirkel.co.uk/custom-attributes-polyfill/)

Keith Cirkel 为 Custom Attributes 提案写了 polyfill，可以理解为「属性版的 Custom Elements」：继承 `Attr` 并注册带连字符的名称，匹配的属性会被原地升级。

它提供 `connectedCallback`、`attributeChangedCallback`、`connectedMoveCallback` 等生命周期，可以挂在 HTML、SVG 或其他自定义元素上，方法定义在属性节点上，不会和元素 API 冲突。

适合实现「持久化输入」「自动聚焦」这类跨组件复用的小行为。

### [Interface Cheat Sheet：图解界面细节清单](https://interfaces.dev/cheat-sheet)

Jakub Krehel 用可交互的正反示例，整理圆角、对齐、阴影、动画等界面细节建议。

例如嵌套元素的外圆角应等于内圆角加内边距，动画应从触发点展开，常用菜单只做关闭动画，过渡不要写 `transition: all`，按钮按下缩放 0.95–0.98。

适合作为设计评审或让 Agent 打磨 UI 时的检查清单。

### [docx 9.8：用 JavaScript 生成带原生图表的 Word 文档](https://github.com/dolanmiu/docx/releases/tag/9.8.0)

Dolan Miu 的 `docx` 发布有史以来最大的版本之一，新增原生 Word 图表、形状、水印和更多数学公式。

图表在 Word 中可直接「编辑数据」，覆盖柱状、折线、饼图、雷达、散点等类型。各功能分别从 `docx/charts`、`docx/shapes` 等独立入口导入，没用到的不会打进 bundle。

在 Node 或浏览器中生成报表、合同等 Word 文档的项目可以考虑升级。

## 版本发布

### [Vite+ 1.0：一个 `vp` 命令管完整工具链](https://voidzero.dev/posts/announcing-vite-plus-1-0)

VoidZero 发布 Vite+ 1.0，MIT 开源，周下载量接近 200 万。`vp` 统一管理 Node 版本、包管理器、开发服务器、lint/format、测试、构建与任务运行，所有配置都写在 `vite.config.ts` 里。

底层分别是 Vite 8 与 Rolldown、Oxlint 与 Oxfmt、Vitest、tsdown 和 Vite Task。自 Beta 以来新增 GitLab CI 支持、tsup 迁移、`vp hooks` 和 `vp env doctor` 等功能。

已有项目可以先运行 `vp migrate` 查看迁移计划，生产项目建议先读迁移指南。

```bash
curl -fsSL https://vite.plus | bash
vp migrate
```

### [Vinext 1.0：基于 Vite 运行 Next.js 应用](https://blog.cloudflare.com/vinext-nextjs-on-vite/)

Cloudflare 的 Vinext 从 2 月的 AI 实验成长为 1.0，同时支持 App Router 与 Pages Router，可以部署到 Workers、Netlify、AWS Lambda 等平台。

除 Cache Components 外，测试兼容性超过 99%，支持构建期预渲染、页面级 ISR 和 OpenTelemetry 追踪。新的 Cache Warming 把预渲染从构建机挪到 Cloudflare 网络上，在新版本切流前预热缓存。

想让 Next.js 应用摆脱平台绑定的团队，可以先用 `vinext check` 评估兼容性。

```bash
npx vinext check && npx vinext init
```

### [MSW 3.0：仅支持 ESM，新增 Vite 插件与 GraphQL 订阅](https://github.com/mswjs/msw/releases/tag/v3.0.0)

Mock Service Worker 3.0 改为仅支持 ESM，最低要求 Node 22 和 TypeScript 5.9，`graphql` 改从 `msw/graphql` 导入，`msw/native` 拆分为 `@msw/react-native`。

新功能包括拦截页面导航和表单提交、支持 GraphQL subscriptions、官方 Vite 插件，以及 `msw/utils` 按需导入。同时移除 `path-to-regexp` 等 5 个依赖，并且不再 patch `setTimeout` 来绕过 fake timers。

升级前请对照 Breaking Changes 检查 `onUnhandledRequest` 改名和 Cookie 行为变化。

### [EmDash 1.0：基于 Astro 的开源 CMS](https://emdashcms.com/blog/emdash-1-0)

Cloudflare 的 Matt Kane 宣布 EmDash 1.0 稳定版，定位是「今天重新设计的 WordPress」，MIT 开源，可以免费部署到 Cloudflare，也能运行在任何 Node.js 环境中。

每个站点都内置带 OAuth 权限控制的 MCP 服务器、API 和 CLI。插件运行在隔离沙箱里，需要显式授权；插件注册表基于 AT Protocol 去中心化构建。

想用 Astro 搭建内容站、又希望编辑和 Agent 都能直接管理内容的团队，值得一试。

```bash
npm create emdash@latest
```

### [Mermaid 12.0：默认改用 ELK 布局，新增 UML 用例图](https://github.com/mermaid-js/mermaid/releases/tag/mermaid%4012.0.0)

Mermaid 12 把 ELK 内置为默认布局引擎，并将默认主题和外观切换为 `redux-color` 与 `neo`，同时新增 UML 用例图。

这是一个破坏性版本：最低要求 ES2024、Safari 17.4+ 和 Node 22.12+，现有流程图、类图、状态图的布局和配色都会变化，`defaultRenderer` 选项也被移除。

文档站或 Markdown 渲染中嵌入了 Mermaid 的项目，如果想保持原有效果，可以显式配置旧默认值。

```js
mermaid.initialize({ layout: "dagre", theme: "default", look: "classic" });
```
