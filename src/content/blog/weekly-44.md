---
title: "前端周刊 #44：GitHub Diff 性能、MDN 与 Lit、Signals 推挽与 Ky 2.0"
description: "本期聚焦大规模 PR Diff 的 React 重构与虚拟化、MDN 用 Lit/Web Components 替换 CRA 封装、Railway 自 Next 迁往 Vite+TanStack Router、Signals 推挽算法与 Inngest「悬停 Promise」工作流；工具侧含 view-transitions-toolkit、ky 2、Crashcat 等；发布含 React 19.2.5、RN 0.85、Docusaurus 3.10、Mantine 9、Ink 7、Undici 8.0.2、pnpm 11 beta。示例：`await ky(url, { totalTimeout: 5000, retry: { limit: 2 } })` 与 `document.startViewTransition` 配合 `optimizeGroupAnimations`。"
pubDate: 2026-04-13
---

## 本周快讯

- [JetStream 3 基准](https://webkit.org/blog/17899/introducing-the-jetstream-3-benchmark-suite/) WebKit、Google 与 Mozilla 联合发布 JetStream 3，面向浏览器端 JS 与 WASM 性能对比，便于跟踪引擎与版本演进。
- [WebAIM Million 2026](https://webaim.org/projects/million/) 百万页面可访问性抽样报告更新，指出第三方框架依赖与 AI 辅助编码等因素与可访问性指标承压相关，团队可对照自查清单与人工测试。
- [「AI 现状」年度调查](https://survey.devographics.com/en-US/survey/state-of-ai/2026) Devographics 开启第二届 Web 开发中 AI 使用调查，适合从业者贡献样本、观察社区趋势。
- [npm 可信发布支持 CircleCI](https://github.blog/changelog/2026-04-06-npm-trusted-publishing-now-supports-circleci/) OIDC 发布链路再扩一类 CI，降低长期 token 泄露面，维护者可评估是否迁移到短时凭证。
- [Node 安全悬赏暂停](https://nodejs.org/en/blog/announcements/discontinuing-security-bug-bounties) Internet Bug Bounty 进入间歇期，Node 项目暂停对有效漏洞报告的现金奖励，报告渠道仍开放，企业依赖方需调整预期。
- [Chrome 应用店申诉流程](https://developer.chrome.com/docs/webstore/news/2026-01-appeals) 扩展被拒后的申诉与重审机制更新，上架与合规团队可对照新政策整理材料。
- [React 19.2.5 与 RSC](https://github.com/facebook/react/releases/tag/v19.2.5) 补丁线发布，包含针对 React Server Components 的循环防护等修复，使用 RSC 的栈应尽快对齐补丁版本。
- [React Native 0.85](https://reactnative.dev/blog/2026/04/07/react-native-0.85) 稳定版带来共享动画后端路线、DevTools 与 Metro TLS 等更新，Jest 预设迁至 `@react-native/jest-preset`，升级前请读 Breaking Changes。
- [QuickBEAM 运行时](https://github.com/elixir-volt/quickbeam) 面向 Erlang BEAM 的 JS 运行时，兼容部分 Node 核心 API，跨语言/工具链爱好者可关注实验进展。

## 技术文章

### [GitHub 如何把 PR Diff 做到可交互又省内存](https://github.blog/engineering/architecture-optimization/the-uphill-climb-of-making-diff-lines-performant/)

GitHub 工程博客复盘「Files changed」React 重构。

v2 压缩组件层级、顶层事件委托、按需评论子树与 TanStack Virtual，超大 PR 堆内存与 DOM 节点数量级下降。

适合维护「无限列表 + 高亮 + 批注」界面的团队对照分层策略。

### [MDN 新前端内幕：从 CRA 封装到 Lit 与「服务端组件」自研](https://developer.mozilla.org/en-US/blog/mdn-front-end-deep-dive/)

MDN 官方博客解释弃用 ejected CRA，转向 Lit Web Components 岛屿架构。

`<mdn-*>` 自定义元素配合 Declarative Shadow DOM 与动态 `import()`，自研 Lit 服务端组件在 Node 侧拼装 HTML。

文档站、课程平台可复用「静态 HTML + 岛屿架构」样本。

### [Railway 生产前端整体迁出 Next.js：两 PR、零停机](https://blog.railway.com/p/moving-railways-frontend-off-nextjs)

Victor Ramirez 记录 dashboard 与营销站从 Next Pages Router 迁到 Vite + TanStack Router + Nitro。

两篇 PR 去掉 `next/image` 等绑定并切换两百余路由，构建时间显著缩短，静态资源按哈希局部回源。

评估「客户端主导控制台」是否还要绑元框架时，此文是真实成本收益账本。

### [Signals 的推挽算法：从直觉到可运行原型](https://willybrauner.com/journal/signal-the-push-pull-based-algorithm)

Willy Brauner 用交互图示拆解 Signals 推挽模型。

源变更向下推送失效通知，`computed` 仅在再次读取时拉取重算，文中给出简化版 `signal`/`computed` 实现。

惯用 React 依赖数组的开发者可对照「自动追踪 vs 显式声明」的语义差异。

### [你取消不了 Promise，但有时可以让它永远挂起：Inngest 的控制流技巧](https://www.inngest.com/blog/hanging-promises-for-control-flow)

Inngest 团队解释如何用永不 resolve 的 Promise 实现可中断长工作流。

新步骤边界挂起当前函数，运行时持久化已完成步骤并在下次 invocation 重入，保留 `Promise.all` 等并发写法。

写编排引擎、Serverless 步骤函数或调试奇怪退出脚本时值得细读。

### [CSS subgrid：全宽与内嵌组件在 CMS 布局里少一层包裹](https://dbushell.com/2026/04/02/css-subgrid-is-super-good/)

David Bushell 用 `subgrid` 解决栅格容器里全宽横幅与内容对齐主栏的常见痛点。

子网格继承父轨道，组件可声明跨列而不必额外 wrapper 或负边距 hack。

CMS 驱动的落地页与通栏 Banner 组合可减少 DOM 深度与魔法数 margin。

## 工具推荐

### [view-transitions-toolkit：View Transitions 工具函数合集](https://www.bram.us/2026/04/02/view-transitions-toolkit/)

Bramus Van Damme 将多年实验沉淀为 npm 包，覆盖 View Transitions 常用样板。

提供特性探测、`activeViewTransition` shim、动画测量优化与按导航来源注入 `view-transition-type`。

已在产品里试点页面过渡、又不想重复写底层样板的前端可直接接入。

### [ky 2.0：基于 fetch 的极简 HTTP 客户端大版本](https://github.com/sindresorhus/ky/releases/tag/v2.0.0)

Sindre Sorhus 发布 ky 2.0，要求 Node 22+，统一钩子签名为单一 state 对象。

新增跨重试 `totalTimeout`、`HTTPError.data` 预解析响应体，`.json()` 对空体与 204 抛出解析错误。

浏览器与边缘函数里替代手写 `fetch` 封装时，迁移需按发布说明调整钩子。

### [Crashcat：面向游戏与创意页面的 JS 物理引擎](https://github.com/isaac-mason/crashcat)

Isaac Mason 开源 2D 物理库，站点提供刚体、关节与场景编辑等可交互 demo。

适合营销页、可交互文档或轻量游戏中做真实碰撞与堆叠。

复杂度与确定性需自行在目标帧率下压测。

### [Bearnie：面向 Astro 与 Tailwind 的可访问组件起点](https://bearnie.dev/)

Bearnie 提供遵循 WCAG 2.1 AA 的组件集，强调键盘、焦点与屏幕阅读器行为。

可 fork 成自有设计系统基底，适合已选 Astro 内容架构的团队。

仍需用真实辅助技术走查业务变体。

### [SSGOI：跨框架的页面过渡动画方案](https://github.com/meursyphus/ssgoi)

SSGOI 宣称在比原生 View Transitions 更广的浏览器组合上提供类原生应用转场。

支持 React/Next、Vue/Nuxt、Svelte、Angular 等路由集成。

渐进增强策略里可与 `@view-transition` 能力检测搭配，注意评估包体与路由钩子成本。

### [Boneyard：从真实 UI 自动生成骨架屏](https://boneyard.vercel.app/overview)

上传或截取界面后生成与布局对齐的骨架矩形列表，支持 React、Svelte、Vue 等。

减少手写 placeholder 与真实页面错位，适合列表与控制台类产品。

复杂动态数据仍要处理文案与空状态。

### [Dither Image：浏览器内复古像素抖动处理](https://ditherimage.online/)

在线工具为图片添加可配置抖动与调色板效果，带前后对比。

适合营销物料、独立游戏风 UI 或博客配图快速实验。

无需打开桌面图像软件。

## 版本发布

### [React 19.2.5](https://github.com/facebook/react/releases/tag/v19.2.5)

React 发布 19.2.5 补丁，强化 React Server Components 相关防护。

针对循环引用等场景修复，使用 RSC 的框架与模板应跟随上游建议升级。

升级后在预发跑一遍流式渲染与边界用例，关注第三方 RSC 适配器兼容性。

### [React Native 0.85](https://reactnative.dev/blog/2026/04/07/react-native-0.85)

RN 0.85 引入与 Software Mansion 合作的共享动画后端，Animated 与 Reanimated 共享演进路径。

DevTools 支持多 CDP 连接，Metro 支持 TLS 开发服务器，Jest 预设迁至 `@react-native/jest-preset`。

请用 Upgrade Helper 对照破坏性变更完成迁移。

### [Docusaurus 3.10（v3 收官，面向 v4）](https://docusaurus.io/blog/releases/3.10)

Docusaurus 3.10 为 3.x 最后一版，将 Docusaurus Faster 标为稳定并调整 `future.faster` 配置键。

补充 v4 未来开关，介绍 npm Trusted Publishing 与每日依赖扫描工作流。

文档站维护者应规划 MDX 语法与存储 key 迁移。

### [Mantine 9.0](https://mantine.dev/changelog/9-0-0/)

Mantine 9.0 大版本带来新日程包 `@mantine/schedule`、跑马灯组件与大量行为更新。

已有 Mantine 8 项目需按 changelog 分批处理破坏性变更并跑视觉回归。

日历与排程是核心页面时可优先评估新包与可访问性表现。

### [Ink 7.0](https://github.com/vadimdemedes/ink/releases/tag/v7.0.0/)

Ink 7.0 升级到 React 19，要求 Node 22+，引入新钩子与 `useEffectEvent` 优化。

面向 CLI、TUI 与 agent 工具链的终端 UI 库。

依赖 Ink 的项目应锁定 Node 与 React 类型版本后跑交互测试。

### [Undici 8.0.2](https://github.com/nodejs/undici/releases/tag/v8.0.2)

Undici 8.0.2 为 Node 内置 fetch 底层 HTTP 客户端主线继续演进。

包含 WebSocket 在 H2 CONNECT 不可用时的回退等修复。

依赖 Undici 直接 API 或调试边缘网络问题的同学可关注发行说明。

### [pnpm v11.0.0-beta.8](https://github.com/pnpm/pnpm/releases/tag/v11.0.0-beta.8)

pnpm 11 预览线持续迭代 lockfile 与工作区行为。

适合在隔离仓库中验证，生产环境请等待正式版与团队策略。

可与 `minimumReleaseAge`、trusted publishing 等供应链实践一起评估升级窗口。
