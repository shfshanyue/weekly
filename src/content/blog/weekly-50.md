---
title: "前端周刊 #50：TypeScript 7.0 RC、React Router v8、TanStack 类型性能与 Babel 8"
description: "本周焦点：TypeScript 7.0 RC（Go 原生编译器，VS Code 全量类型检查 77s→7.5s）；React Router v8 年度大版本「无聊升级」；TanStack Table v9 用 tsc 诊断将类型实例化削减 62–86%；Mark Erikson 的 SignalProvider/useSignalSelector 让 Redux 大规模场景脚本时间降 20–40%；Flow 与 TS 2026 分歧；Kindle 首页 Hermes 字节码逆向；numpy-ts 靠 WASM 内存所有权追平原生；Nub、zod-compiler、MDN MCP Server、eslint-plugin-unicorn 67；Babel 8 ESM-only、Playwright 1.61 Passkey/WebStorage、Node 六月安全更新。示例：`tsc --extendedDiagnostics`、`claude mcp add mdn`、`plugins: [zodCompiler()]`。"
pubDate: 2026-06-22
---

## 本周快讯

- [TypeScript 7.0 发布候选版](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/) 6 月 18 日 RC 落地：`npm install -D typescript@rc` 即可获得 Go 原生 `tsc`，微软基准显示 VS Code 仓库（150 万行）全量类型检查从 77.8s 降至 7.5s；类型语义与 TS 6.0 结构一致，但 Compiler API 预计推迟到 7.1，工具链作者需预留共存期。
- [React Compiler Rust 移植并入 Next.js canary](https://github.com/react/react/pull/36173) Rust 版 React Compiler 已合入 `react/react` 主仓，Next.js canary、Oxlint 1.70、swc 与 Rolldown 侧同步集成——为 Vite/Rolldown 生态的原生编译路径铺路，手动 `useMemo`/`useCallback` 的维护成本有望进一步下降。

## 技术文章

### [TanStack Table v9：用类型诊断把编辑器卡顿砍掉 62–86%](https://tanstack.com/blog/tanstack-table-v9-typescript-performance)

Kevin Van Cott 6 月 14 日深度文，Table v9 类型性能优化的教科书级案例。

用 `tsc --extendedDiagnostics` 量化，核心包实例化从 114 万压到 15.8 万，文档示例平均降 79%。

先量化 Instantiations，再谈「类型安全是否值得」。

```bash
tsc --noEmit --extendedDiagnostics
# 关注 Instantiations 行，而非仅凭 wall time 判断
```

### [React Router v8：刻意「无聊」的年度大版本](https://remix.run/blog/react-router-v8)

Remix 博客，6 月 17 日 React Router v8 是治理模型下首个按年度计划推出的 major。

Node 22.22+、React 19.2.7+、Vite 7+ 为硬性基线。`react-router-dom` 移除，middleware 默认开启。

停在 v6 的长寿项目是迁移到 v7/v8 的窗口期。

### [Signals 能否让 Redux 在规模下更快：SignalProvider 原型](https://github.com/reduxjs/react-redux/pull/2318)

Mark Erikson 6 月 9 日 draft PR，把 Redux 大规模 `useSelector` O(n) 通知推到可试用原型。

`SignalProvider` + `useSignalSelector` 为 drop-in 替代。benchmarks 脚本时间比 9.2.0 快 20–40%。

比「整体换 Zustand」更低风险的性能实验入口。

### [Flow 与 TypeScript 在 2026：语法收敛，哲学仍分叉](https://flow.org/en/docs/flow-vs-typescript/)

Meta Flow 维护者 George Zahariev 更新 Flow vs TypeScript 2026 对比文档。

语法与 TS 高度对齐，但默认更严，独有 `match`、一等 component/hook 语法与 Hooks 规则检查。

借 Flow 默认项反查自家 TS 配置与 ESLint 是否漏掉同类坑。

### [Kindle 首页的 Hermes 字节码逆向与打补丁实战](https://sighery.com/posts/patching-kindle-homepage/)

sighery.com 固件逆向文，Kindle 首页 KPP 跑 React Native + Hermes 字节码。

用 `hbctool disasm` 定位广告 carousel 渲染函数，改字符串/指令后再 asm 回写。

罕见的「JS 引擎产物层」课，与本期 React Compiler Rust 移植形成对照。

### [numpy-ts 如何追平原生 NumPy：问题不在 WASM，在谁持有字节](https://nico.codes/notes/numpyts-optimization/)

Nicolas Dupont 复盘 TypeScript 版 NumPy 从慢 15 倍追到 7,159 项基准平均 1.11× 原生。

瓶颈是 JS TypedArray ↔ WASM linear memory 来回拷贝，转折让 ndarray 数据住在 WASM 内存池。

做 WASM 加速的前端记住：算子快不够，数据得住在算子旁边。

## 工具推荐

### [Nub：Zod 作者出品的 Node 增强工具包](https://nubjs.com/blog/introducing-nub)

Colin McDonnell（Zod/tRPC）6 月发布 Nub，走「增强 Node 而非替换 Node」路线。

Rust CLI 用 oxc N-API 转译 TS/JSX，`nub run` 比 `pnpm run` 快约 24×，`--node` 可一键关闭增强。

不想迁 Bun 又厌倦 `tsx + nodemon + nvm` 碎片化的低摩擦试验品。

### [zod-compiler：构建期把 Zod Schema 编译为零开销验证器](https://github.com/gajus/zod-compiler)

Gajus Kuizinas 构建期插件，自动编译导出 Zod schema 为零开销验证器。

热路径验证快 2–75×，源码零改动，Vite/webpack/esbuild/Rolldown 均有入口。

API 边界、ORM 行校验等高频 `safeParse` 路径尤其合拍。

```ts
// vite.config.ts
import zodCompiler from 'zod-compiler/vite';

export default defineConfig({
  plugins: [zodCompiler()],
});
```

### [MDN MCP Server：把 Web 文档与兼容性数据接入 AI Agent](https://developer.mozilla.org/en-US/blog/introducing-mdn-mcp-server/)

Mozilla 6 月 15 日实验性 MCP 服务，让 Cursor、VS Code、Claude Code 搜索 MDN 与 BCD 兼容性。

直接缓解 LLM 训练截止导致的 API 幻觉，Claude Code 一行 `claude mcp add` 即可接入。

日常用 AI 写 CSS/新 Web API 的低成本、高回报上下文升级。

### [eslint-plugin-unicorn 67.0：200+ 条「挑战你」的 lint 规则](https://github.com/sindresorhus/eslint-plugin-unicorn/releases/tag/v67.0.0)

Sindre Sorhus 维护的 unicorn 规则集 v67 过去几周新增/更新近 100 条。

偏好 Temporal 而非 Date、URL 强制 HTTPS、限制嵌套调用深度等现代 JS 实践。

AI 生成代码常默认 `new Date()` 与 `http://`，适合作为「品味护栏」补盲。

## 版本发布

### [Babel 8.0：ESM-only、默认告别 ES5/CJS 编译](https://babeljs.io/blog/2026/06/16/8.0.0/)

Babel 官方博客，6 月 16 日 Babel 8.0 八年来首个带破坏性变更的 major。

纯 ESM、Node 22+，`preset-env` 默认跟随 Browserslist `defaults` 约 ES2023，polyfill 抽到独立插件。

仍跑 CJS 构建脚本或依赖 `@babel/register` 的项目应先读迁移指南再动 major。

### [Playwright 1.61：Passkey 虚拟认证器与 WebStorage API](https://playwright.dev/docs/release-notes#version-161)

Playwright 1.61 补齐 WebAuthn 虚拟认证器与 Web Storage async API 两类 E2E 痛点。

`browserContext.credentials` 注入 Passkey，`page.localStorage` 告别 `page.evaluate` polyfill。

Passkey 登录流与 JWT 存 localStorage 的 SPA 回归套件可显著简化。

```js
await context.credentials.create('example.com', { id, userHandle, privateKey, publicKey });
await context.credentials.install();
await page.localStorage.setItem('token', 'abc');
```

### [Node.js 26.3.1 / 24.17.0 / 22.23.0：六月安全更新](https://nodejs.org/en/blog/vulnerability/june-2026-security-releases)

Node.js 官方安全公告，6 月 18 日三条线同步补丁，共修复 12 个 CVE，最高 HIGH。

含 TLS 主机名 Unicode 绕过、WebCrypto 2GiB 整数溢出崩溃、HTTP/2 ORIGIN 帧内存耗尽等。

暴露 TLS 终止与文件加密接口的生产服务应尽快滚动重启。
