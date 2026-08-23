---
title: "前端周刊 #57：Bun 1.4、Lovable 迁 TanStack 与 WebMCP"
description: "Bun 1.4 Rust 重写、Lovable TanStack Start 迁移、TanStack Form v2、WebMCP Hook"
pubDate: 2026-08-31
---

## 本周快讯

- [Bun 1.4](https://bun.com/blog/bun-v1.4) 8 月 20 日正式发布，运行时从 Zig 全面切换为 Rust，Node 核心模块测试通过率最高达 97%。
- [Shai-Hulud 蠕虫](https://jfrog.com/blog/shai-hulud-npm-supply-chain-attack-new-compromised-packages-detected/) 借伪造 keyv 6.0 发布再次感染 400+ npm 包，安装脚本仍是主要传播路径。
- [Next.js 团队 Reddit AMA](https://www.reddit.com/r/nextjs/comments/1mw8q8x/nextjs_team_ama/) 8 月 18 日举行，Dan Abramov 与 Pete Hunt 参与答疑框架方向。
- [Google Antigravity](https://blog.google/products/google-cloud/gemini-enterprise-antigravity/) Agent 工作区进入 Gemini Enterprise，并发布 VS Code、JetBrains 与 Zed 扩展。
- [OpenRouter 加入 Stripe](https://openrouter.ai/blog/openrouter-joins-stripe) 多模型路由平台被收购，日常运营保持独立。
- [pnpm 12 RC](https://pnpm.io/blog/pnpm-12-rc) Rust 重写版进入候选发布，与 pnpm 11 仅三处行为差异。

## 技术文章

### [Bun 1.4 正式发布：Rust 重写、Node 兼容跃升与内置图像/浏览器 API](https://bun.com/blog/bun-v1.4)

8 月 20 日 Bun 1.4 登陆 npm，这是 Zig 版之后的第一个稳定 Rust 版运行时。Claude Code 等场景已提前数月使用 Rust 分支。

新增 1,517 项 Node.js 测试用例，`node:http`、`node:fs` 等核心模块通过率约 97%。空闲 CPU 降约 5 倍、内存降 35%、Linux 启动快 50%，并内置 `Bun.Image`、`Bun.WebView`、`bun audit fix` 与并行测试。

对 Node 替代方案观望的团队，这是可立即评估兼容性与包管理收益的版本节点。

```bash
curl -fsSL https://bun.sh/install | bash
bun --version  # 1.4.x
```

### [Lovable.dev 从 Next.js 迁到 TanStack Start：月活 4200 万的产品自举实战](https://lovable.dev/blog/how-we-migrated-lovable-dev-away-from-nextjs)

Lovable 将官网从 Vercel 上的 Next.js 迁到自研 TanStack Start + Cloudflare `workerd`，与 6000 万+ 用户应用共用同一套托管路径。

团队用六个月并行运行双框架，通过代理 Worker 与特性开关按用户旅程灰度切流。框架专属代码降至约 3%，90–95% 为框架无关共享逻辑，lovable.dev 专属服务代码不足 200 行。

对 AI 建站与边缘托管团队，这是「自家产品跑自家栈」的大规模 dogfooding 样本。

### [TanStack Form v2 Alpha：验证从事件回调变为可组合流水线](https://tanstack.com/blog/announcing-tanstack-form-v2-alpha)

TanStack 在 v1 反馈基础上从零重写 Form 核心，8 月 6 日开放 Alpha。v2 聚焦更快运行时、更安全的类型与更少摩擦的 API。

最大变化是验证模型：不再为每个事件绑单一处理器，而是让每条规则声明自己的触发时机与条件，形成可组合的验证流水线。SSR 与 schema 导向表单也一并简化。

Alpha 目前仅覆盖 React 适配器。已在 v1 踩过验证时序坑的团队，值得用迁移指南做一次对照评估。

### [自己掌控 RSC 管线：TanStack Start 把 Flight 流当普通数据处理](https://tanstack.com/blog/who-owns-the-tree)

TanStack Start 贡献者 Manuel Schiller 认为 RSC 是协议原语，不是应用架构。服务端输出本质是 React Flight 字节流，客户端可用 TanStack Query 缓存与组合。

Composite Components 让服务端返回的 Flight 片段通过 slot 嵌入客户端树，缓存边界由应用自己决定，而非框架内置的 opaque cache。RSC 输出可进 Redis、HTTP 缓存或 Query 的 `staleTime`。

若你不想为 RSC 反转整棵组件树，这是与 Next.js 心智模型不同的第三条路。

### [Shopify 如何把移动端 E2E 稳定性从 50% 提到 98%](https://shopify.engineering/mobile-e2e-testing)

Shopify 移动端 E2E 曾因 Appium + Test ID 的随意等待与视图层级断言而极不稳定，最终被迫移出 PR 阻断流水线。

团队在 Appium 之上封装严格 builder API：每步必须断言，逃生口统一加 `UNSAFE_` 前缀；并用计算机视觉按用户所见定位元素，而非爬视图树。推广数周后双平台稳定性达 98%，剩余失败多为网络或模拟器启动问题。

React Native 测试套件若长期 flaky，问题往往在 API 设计而非「E2E 天生不可靠」。

### [HTML Over WebSockets：近乎零 JS 的实时 SPA 架构](https://en.andros.dev/blog/ef4968f5/html-over-websockets-real-time-spas-with-barely-any-javascript/)

Andros Fenollosa 梳理超媒体家族中的 WebSocket 变体：服务端直接推送已渲染 HTML，客户端只负责插入 DOM，渲染逻辑留在后端单一语言栈。

与 JSON + 前端框架相比，双向通道让聊天、协作面板和实时仪表盘无需维护 API 契约。需要纯服务端推送时选 SSE，请求-响应足够时用 htmx + HTTP。

对想降低前端复杂度、又需要真正双向实时的团队，这是 Phoenix LiveView 思路在通用 Web 栈中的对照阅读。

### [网站 99% 流量是机器人：150 万页站的 Cloudflare 防护一年复盘](https://patronview.com/news/99-percent-of-my-website-traffic-is-bots/)

PatronView 创始人 Nick Gray 统计：一周 128 万页服务端交付，Plausible 仅记录 5,977 次人类浏览，约 214 次机器人加载换 1 次真人访问。

Claude-SearchBot 爬取与导流比约 35,000:1，Amazon Amzn-SearchBot 日请求约 11.7 万却零导流。他用「爬取/导流比」制定防火墙策略，封禁 Anthropic 后日请求从 6 万降至约 25。

独立站与内容站运营者应把爬虫成本纳入基础设施预算，而不只盯 Analytics 面板。

## 工具推荐

### [GTKX 1.0：用 React 构建原生 Linux 桌面应用（GTK4，无 WebView）](https://gtkx.dev/)

GTKX 让你用 JSX 声明 UI，底层渲染真实 GTK4 与 Adwaita 控件，运行在普通 Node 进程里，支持 npm 包与 Fast Refresh。

1.1 新增 `gtkx deploy`，一条命令产出 Flatpak、`.deb`、`.rpm` 与 AppImage。不是 Electron 套壳，而是面向 Linux 桌面的 React 框架。

做跨平台工具但想给 Linux 用户提供原生体验的开发者，可把它与 Tauri/Electron 路线并列评估。

```bash
npm create gtkx@latest my-app
cd my-app && npm run dev
```

### [Fig：类 React 模型的 TypeScript UI 运行时](https://github.com/bgub/fig)

Fig 是 pre-1.0 的 TypeScript UI 运行时，实现 Fiber、lanes、流式 SSR 与选择性 hydration，并内置 data resource 与 payload 组件协议。

`@bgub/fig-tanstack-start` 适配器已可用：TanStack 管构建、路由与 server function，Fig 管渲染、数据存储与 Fast Refresh。API 尚不稳定，不是 React 库的直接替代品。

对 metaframework 作者或想实验「React 之外渲染核心」的团队，这是值得跟踪的底层基础设施。

### [kbar 1.0：React 应用的 Cmd+K 命令面板](https://kbar.vercel.app/)

kbar 历经五年 Beta 后正式发布，为 React 18/19 提供页面内命令搜索与快捷键入口，官网可直接试用。

它把命令注册、模糊搜索与键盘导航封装成轻量组件，适合后台、文档站与开发者工具的快速导航层。

若你的产品已有复杂菜单却缺少统一命令入口，kbar 是成熟且零设计负担的选择。

### [use-webmcp-tool：把 WebMCP 工具注册绑到 React 组件生命周期](https://github.com/GoogleChromeLabs/use-webmcp-tool)

Sarah Drasner（Google Chrome Labs）发布的 Hook，封装 WebMCP 草案中的 `document.modelContext.registerTool` 命令式 API。

组件挂载时注册工具、卸载时自动注销，Agent 可见的工具集与当前屏幕保持同步。Hook 还规范化执行结果并暴露 `supported`、`registered` 与 `error` 状态。

做浏览器内 AI Copilot、希望页面函数可被 Agent 直接调用而非 DOM 抓取时，这是目前最顺手的 React 集成层。

```tsx
const { supported, registered } = useWebMCP({
  name: "add_to_cart",
  description: "将商品加入购物车",
  execute: async (args) => cart.add(args.sku),
});
```

### [Slack Code：在 Slack 频道内与 Agent 协作写代码](https://slack.com/code)

Slack Code 在频道中引入专用 code channel，集成 GitHub、Anthropic 与 Vercel 等伙伴工具，让规划、编码与审查留在协作上下文里。

工程师可在 Slack 内查看 diff 与 live preview，非技术成员也能参与需求澄清与验收。目标是减少「切到 IDE 标签页才能跟进进度」的协作摩擦。

若团队已深度使用 Slack 且正在引入编码 Agent，这是比自建 webhook 桥更完整的协作面。

## 版本发布

### [Biome 2.5.8：`useReactCompiler` 规则做 Compiler 上线前 dry-run](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.5.8)

Biome 2.5.8 新增 `useReactCompiler` lint 规则，以 lint 模式运行 React Compiler，报告哪些组件与 Hook 无法安全编译。

这相当于启用 Compiler 前的静态预检，避免一上来就打开 `reactCompiler` 配置却大面积构建失败。适合渐进式采用 React Compiler 的存量项目。

```json
{
  "linter": {
    "rules": {
      "nursery": { "useReactCompiler": "warn" }
    }
  }
}
```

### [Next.js 16.3.1：修复 prefetch 循环与 cache 过早丢弃](https://github.com/vercel/next.js/releases/tag/v16.3.1)

16.3.1 是 16.3 稳定版后的维护更新，修复 tag 重验证后 cache 条目被过早清除、重复 prefetch 循环，以及 `headers()` 返回陈旧请求视图等问题。

若你已跟进 16.3 的 Instant Navigation 与 TypeScript CLI 实验特性，建议尽快升级以避免边缘缓存与预取行为异常。

### [React Hook Form 7.85.0：支持 React 19.2 `<Activity>` 原语](https://github.com/react-hook-form/react-hook-form/releases/tag/v7.85.0)

7.85.0 跟进 React 19.2 的 `<Activity>` 组件，让表单在 Activity 边界内正确保持与恢复状态。

对采用 React 19.2 新原语做页面级「后台保活」的应用，这是表单层必要的兼容性更新。

### [ioredis 6.0：四年首个大版本，支持 RESP3 与 Redis 8.10](https://github.com/redis/ioredis)

ioredis 6.0 是四年来首个 major release，新增 RESP3 协议支持与 Redis 8.10 新特性适配。

Node 服务端依赖 Redis 的项目应查阅迁移说明，评估连接池、集群与 TLS 配置是否需要调整。
