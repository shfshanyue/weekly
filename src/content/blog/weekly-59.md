---
title: "前端周刊 #59：React 19.3、Vitest 5.0 与 Tailwind 加入 Shopify"
description: "React 19.3、Vitest 5.0、Tailwind 加入 Shopify、Shopify 回归原生"
pubDate: 2026-09-21
---

## 本周快讯

- [Tailwind 加入 Shopify](https://tailwindcss.com/blog/tailwind-is-joining-shopify) 开源仍 MIT，团队继续维护；Tailwind Plus / ui.sh 对新用户关闭注册。
- [Chrome 两周发版](https://developer.chrome.com/blog/chrome-two-week-start) 自 Chrome 153 起 Stable 改为两周一轮，Firefox / Edge / Brave 跟进。
- [`node:bench` 合入 main](https://www.jasnell.me/posts/a-node-bench-module) Node 实验性内置基准模块，API 对齐 `node:test`，CLI 为 `node --bench`。
- [Workers Node 模块注册表](https://blog.cloudflare.com/workers-module-registry-nodejs/) Cloudflare 可选 `new_module_registry`，带来 `import.meta` 与 `require(esm)` 对齐。

## 技术文章

### [Shopify 结束 React Native 六年押注，全面回归 Swift 与 Kotlin](https://shopify.engineering/back-to-native)

Mustafa Ali 宣布 Shopify 移动端战略转向原生。2020 年选 RN 是为了「功能只写一次」；如今 coding agents 把双端实现与对等维护成本压到可接受范围。

Shop App 在 AI 辅助下 12 周完成原生重写并上架。开源侧：Skia 继续赞助至 2026 年底后由 William Candillon 接手；FlashList 寻长期 steward；Restyle 将归档。

对仍重仓 RN 的团队，这是「Agent 改变跨端经济学」的一手案例，而非简单否定框架本身。

### [Turbopack 如何给 JS 做 Chunk：8 个包可能比 355 个更重](https://nextjs.org/blog/turbopack-chunking)

Next.js 团队从 Network 面板讲起，解释 bundler 在「更少请求」与「更少重复下载」之间的权衡。用 nextjs.org 实测三种策略：不合并、默认合并、组内全合并。

默认配置把请求从 96 砍到 38，总下载略减；极端合并虽只要 15 次请求，总代码反而多约 10%。Next.js 16.3 新增运行时按缓存择优加载、可按分析配置 `priorityRoutes` / `clusters`。

做大型 App Router 应用时，值得对照自己的导航路径再调 chunk 策略，而不是盲目追求「文件越少越好」。

### [React Compiler 全面 Rust 化：编译步骤从 14.3s 降到 0.81s](https://blog.master.dev/react-now-rusted-all-the-way-out/)

Outlyne 团队把 1000+ 文件的 React Router 项目切到 oxc 版 React Compiler。编译器部分约 **17.6×** 加速，整次构建约 **2.4×**（22.1s → 9.3s）。

Rust 编译器已覆盖 Babel 1.0 仍会 bailout 的若干模式（如 try/catch 条件、计算属性键）。`@vitejs/plugin-react` 在 Vite 8+ 可用 `{ compiler: true }` 原生接入。

与 Oxlint 共用同一套 `oxc-transform-react`，可避免「lint 过了但生产未编译」的覆盖缺口。

```js
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ compiler: true })],
});
```

### [Safari 如何修好顶层 await：重写模块加载器](https://webkit.org/blog/18227/fixing-top-level-await-in-safari/)

Kai Tamkun 介绍 Safari 27 / WebKit 对 top-level `await` 的完整规范对齐。旧加载器基于已废弃的 WHATWG Loader 提案，多年无法根治「accessed before initialization」。

团队删除自托管 JS builtin，按 ECMAScript 规范用 C++ 重写模块状态机，并用 Bun 提供的用例与跨引擎 fuzzer 验证。动态多次 `import` 同一带 TLA 的模块时，完成顺序与导出初始化现已正确。

跨浏览器依赖顶层 await 的应用，可在 Safari TP 251 或 Safari 27 beta 上回归验证。

### [`await fetch()` 究竟在等什么：只等 headers，不等 body](https://blog.gaborkoos.com/posts/2026-09-08-Half-Past-Fetch/)

Gábor Koós 拆开 Fetch 规范：`await fetch(url)` 在收到最终响应头后就 resolve，body 仍可能在路上。因此常见写法是「等两次」——先 headers，再 `response.json()`。

未读 body 在 HTTP/1.1 下会拖垮连接复用；`clone()`、Abort 与「以为覆盖整次请求」的 timeout 也都踩在这个间隙上。文章附带浏览器与 Node 差异实验。

写上传下载、流式接口或严格超时策略时，建议把 body 消费纳入同一生命周期，而不是只盯着第一个 `await`。

```js
const response = await fetch(url); // headers
const body = await response.json(); // body
```

## 工具推荐

### [Rslib 1.0：Rspack 团队的 JS 库 / CLI 统一构建工具](https://rslib.rs/blog/v1-0)

Rslib 基于 Rsbuild，面向工具库、组件库、CLI 与 Agent 应用。1.0 冻结公共 API，支持 ESM/CJS/UMD、Module Federation，以及 bundle / bundleless 双模式。

相对 0.7，万组件基准未缓存构建约快 24%，带缓存约快 57%。可接 TypeScript 7 / Isolated Declarations 加速 `.d.ts`，并实验性输出 Node SEA 可执行文件。

从 tsup / tsc 迁库或要与 Rspack 应用共享插件时，适合作为单一构建管线。

```bash
npx create-rslib@latest
```

### [Vidact：把 React 组件编译成直接 DOM 操作](https://www.vidact.dev/)

Vidact（Beta）用 Rust 编译器把 React 风格函数组件与 hooks 编成直接 DOM 更新。组件挂载时跑一次，状态变更只跑对应 updater，包里不带 React / VDOM / reconciler。

分析层复用 React Compiler 基础设施，但有独立 IR 与代码生成。不支持的 React 模式会在构建期失败，而不是悄悄回退。

适合对包体积极度敏感、且能接受「React 子集」约束的交互界面；生产示例如 grep.codemod.com。

### [Dropzone.js 6：拖拽上传库结束五年 beta](https://www.dropzone.dev/)

经典拖拽上传库在短短两天内连发 6.0 / 6.1 / 6.2。零依赖、更小包体，并修复可能导致文件损坏的分片上传问题。

仍覆盖预览、进度、队列、无 JS fallback 与多语言。对仍停在 5.x beta 的站点，是一次值得评估的主版本跳升。

### [Drawably：手绘风格 UI 控件，每次挂载都是新素描](https://www.drawably.dev/)

Drawably 提供按钮、输入、开关等手绘风控件。描边在加载时用种子随机生成，悬停可重绘；约 7KB JS gzip + 3KB CSS，零依赖。

提供 React 绑定与原生 DOM API。适合落地页、演示站或不想用插画素材库的轻量品牌页。

```js
import { DrawablyButton } from "drawably/react";

<DrawablyButton state="loading">提交</DrawablyButton>
```

## 版本发布

### [React 19.3：View Transitions 与 Fragment Refs 正式稳定](https://react.dev/blog/2026/09/09/react-19-3)

9 月 9 日 React 19.3 登陆 npm。`<ViewTransition>` 可对 Transition / Suspense / `useDeferredValue` 触发的更新做进入、离开、更新与共享动画。Fragment Refs 无需额外 DOM 包装即可管一组节点的焦点、事件与测量。

其他亮点：`use(browser())` 让组件跳过 SSR 并显示最近 Suspense fallback；Trusted Types 支持避免 `innerHTML` 强制转字符串；独立 Transition 不再互相阻塞。

已在实验 API 上验证过的团队可按发布博文与 changelog 正式升级。

```js
import { ViewTransition, startTransition } from "react";

startTransition(() => setShow(true));
{show && (
  <ViewTransition>
    <Panel />
  </ViewTransition>
)}
```

### [Vitest 5.0：重度依赖场景最高约 53% 加速](https://vitest.dev/blog/vitest-5)

9 月初 Vitest 5 发布，要求 Vite ≥ 6.4 与 Node ≥ 22.12。官方 benchmarks 覆盖多 pool / 环境；`deps-heavy` 在 `vmThreads` 下从 1.59s 降到 0.74s（约 −53%）。

新能力包括 Browser Mode 的 Trace View、`vitest doctor` 配置建议、`vi.when` 按参数条件 mock，以及默认开启 `clearMocks`。报告统一写入 `.vitest/`。

升级前请对照 Migration Guide；收益最大的是 vm pool、Browser Mode 与大型隔离套件。

```bash
npm install -D vitest@5
npx vitest doctor
```

### [Jotai 3.0：ESM-only 的迁移向大版本](https://newsletter.daishikato.com/p/jotai-v3-is-mostly-a-migration-release)

Daishi Kato 将 v3 定位为清理遗留兼容的迁移版，同时带一处行为调整。最低要求抬到 React 18 与 TypeScript 5.5，包体改为 ESM-only。

为去掉 v2 里常引发多余渲染的那行逻辑，新增 `useAtomValueRaw` / `useAtomValueRawSync` 等变体。`atomFamily` 迁至 `jotai-family`，`loadable` 由 `unwrap` 替代。

习惯原子状态的项目应按官方迁移指南升级；若仍需 React 17，请暂留 v2。

### [React DevTools 8.0：Suspense 默认开启，Timeline 交给浏览器](https://github.com/react/react/blob/main/packages/react-devtools/CHANGELOG.md#800)

DevTools 8.0 默认打开 Suspense 面板，移除内置 Timeline profiler，改由浏览器 Performance 面板承接性能分析。

另有实验包通过 `chrome-devtools-mcp` 把 React DevTools 暴露给 coding agents。日常调试可直接更新扩展；做 Agent 驱动排查时可跟进 MCP 实验包。
