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

Kevin Van Cott 这篇 6 月 14 日的深度文，是「类型很重库」性能优化的教科书级案例。Table v9 把 v8 的单一巨型 `Table` 泛型拆成模块化 `tableFeatures()` + `TFeatures` 推断，能力更强，但 alpha 阶段 `@tanstack/table-core` 的类型实例化从 v8 的 7.8 万飙到 114 万——编辑器悬停、改 column def 都能感到拖慢。团队没有靠猜，而是用 `tsc --extendedDiagnostics` 和 `--generateTrace` 做确定性度量，发现匿名条件类型块在每次检查里重复展开是主因；重构为具名 feature map + 共享 helper 后，beta.12 把核心包实例化压到 15.8 万（约为 alpha 的 14%），文档示例平均降 79%。代价是 v9 类型成本约为 v8 的 2.0×，但换来按表推断的 feature API、per-table fn registry 与插件合并。对正在评估 v9 或自研泛型库的团队，此文的价值在于：**先量化 Instantiations，再谈「类型安全是否值得」**。

```bash
tsc --noEmit --extendedDiagnostics
# 关注 Instantiations 行，而非仅凭 wall time 判断
```

### [React Router v8：刻意「无聊」的年度大版本](https://remix.run/blog/react-router-v8)

6 月 17 日发布的 v8，是 React Router 新治理模型下第一个按年度计划推出的 major。Brooks Lybrand 的基调很直白：若你在 v7 已启用全部 `future.v8_*` flag，升级面应该很「无聊」。硬性基线抬到 Node 22.22+、React 19.2.7+、Vite 7+；`react-router-dom` 正式移除，统一从 `react-router` / `react-router/dom` 导入；middleware 默认开启，`splitRouteModules` 升为顶层配置且默认 `true`。v6 与 Remix v2 宣告 EOL，v7 继续收安全补丁。对仍停在 v6 的长寿项目，这是把「框架模式 + 数据加载」迁到 v7/v8 的窗口期；对 TanStack Start 等新框架选型者，此文也澄清了 React Router 仍走「三种模式并存、Server Components 可选」的路线，而非全面倒向 RSC。

### [Signals 能否让 Redux 在规模下更快：SignalProvider 原型](https://github.com/reduxjs/react-redux/pull/2318)

Mark Erikson 6 月 9 日提交的 draft PR，把 Redux 社区争论多年的「大规模 `useSelector` O(n) 通知」推到了可试用的原型阶段。新增 `SignalProvider` 与 `useSignalSelector` 作为 `Provider`/`useSelector` 的 drop-in 替代：selector 读到的 state 被 proxy 包装，记录访问路径并转为 signal；dispatch 后 diff 新旧 state，仅对变更路径 `signal.set()`，从而跳过大量无关组件的 selector 重跑。权衡很明确——挂载成本更高、每次 dispatch 要做根 state 调和、bundle 预计多 5–10KB minified——但在修订后的 [react-redux-benchmarks](https://github.com/reduxjs/react-redux-benchmarks) 里，**总 scripting 时间比 9.2.0 快 20–40%**。Erikson 强调这是工程驱动、人工 review 的 AI 协作 POC，尚未在生产应用验证。对仍有数千 `connect`/`useSelector` 的老牌 Redux 应用，这是比「整体换 Zustand」更低风险的性能实验入口。

### [Flow 与 TypeScript 在 2026：语法收敛，哲学仍分叉](https://flow.org/en/docs/flow-vs-typescript/)

Meta Flow 维护者 George Zahariev 与官方文档同步更新的对比，适合「多年没看 Flow」的 TS 开发者刷新认知。2026 年的 Flow 语法已与 TS 高度对齐，但默认更严：`strict` 下 TS 仍能通过的模式（多余属性、不精确对象扩展等）在 Flow 会直接报错；独有武器包括穷尽检查的 `match`、一等 `component`/`hook`/`renders` 语法，以及在类型检查器内强制执行 React Hooks 规则。文档用 20+ 组 side-by-side 示例说明「同样能过 tsc，运行时谁更安全」。对前端团队的意义不是立刻迁移，而是借 Flow 的默认项反查自家 TS 配置与 ESLint 是否漏掉了同类坑——尤其在大型 React 代码库与 AI 生成代码激增的当下。

### [Kindle 首页的 Hermes 字节码逆向与打补丁实战](https://sighery.com/posts/patching-kindle-homepage/)

固件 5.14.2 起，Kindle 首页应用 KPP（Kindle Plus Plus）跑在 React Native + Hermes 上，逻辑位于 `/app/KPPMainApp/js/KPPMainApp.js.hbc`——不再是可读 JS bundle，而是版本绑定的字节码（文中所测为 HBC v84，与当前 Hermes v99 不兼容，需回退编译器版本）。作者演示用 `hbctool disasm` 拆包、在 HASM 里定位「Discover Books」等广告 carousel 的渲染函数、改字符串/指令后再 `asm` 回写。这与移动端 RN 逆向、供应链安全话题同构：**AOT 字节码缩短启动，也提高了定制 UI 的门槛**。对前端工程师，这是一堂罕见的「JS 引擎产物层」课，与本期 React Compiler Rust 移植形成有趣对照——编译产物越来越像原生二进制，调试与补丁技能的价值随之上升。

### [numpy-ts 如何追平原生 NumPy：问题不在 WASM，在谁持有字节](https://nico.codes/notes/numpyts-optimization/)

Nicolas Dupont 复盘了 TypeScript 版 NumPy 实现从「慢 15 倍」到 7,159 项基准平均 1.11× 原生 NumPy 的路径。功能对齐后，纯 TS 循环即使用 V8 JIT 也打不过 OpenBLAS/SIMD；引入 Zig 编译的 WASM 微内核后差距缩到约 2×，但瓶颈仍是 **JS `TypedArray` ↔ WASM linear memory 的来回拷贝**——链式 `sin().add(square())` 每一步都付 copy tax。转折点是让 ndarray 数据直接分配在 WASM 内存池，JS 只持元数据包装，内核用指针零拷贝调用；配套 segregated free list 分配器与 `using`/FinalizationRegistry 管理生命周期。对做 WASM 加速、图表计算或边缘 AI 推理的前端，此文的核心教训可一句话概括：**算子快不够，数据得住在算子旁边**。

## 工具推荐

### [Nub：Zod 作者出品的 Node 增强工具包](https://nubjs.com/blog/introducing-nub)

Colin McDonnell（Zod / tRPC）6 月发布的 Nub，走「增强 Node 而非替换 Node」路线：单个 Rust CLI 用 oxc N-API 在内存中转译 TS/JSX/装饰器，再交给项目 pin 的 stock `node` 执行——无 Nub runtime、无 lock-in。`nub run` 号称比 `pnpm run` 快约 24×，`nubx` 比 `npx` 快约 19×；内置 pnpm 兼容安装器、`.env` 自动加载、按 `.nvmrc`/`engines` 拉取 Node。`--node` 可一键关闭全部增强做差分调试。对不想迁 Bun、又厌倦 `tsx + nodemon + nvm + pnpm` 碎片化的团队，这是低摩擦的 Bun-like DX 试验品。

### [zod-compiler：构建期把 Zod Schema 编译为零开销验证器](https://github.com/gajus/zod-compiler)

Gajus Kuizinas 的构建期插件，自动扫描并编译导出的 Zod schema，声称热路径验证快 2–75×，且**源码零改动**——不必 `import` 编译器或包一层 `compile()`。Vite/webpack/esbuild/Rolldown/rspack/Bun 均有入口；生成的是普通布尔表达式 + 惰性错误收集，无 `new Function`，CSP 友好。与 slonik 的 `sql.type(schema)` 等内联匿名 schema 场景尤其合拍：匿名 schema 也会被哈希追踪并编译。适合 API 边界、ORM 行校验等高频 `safeParse` 路径。

```ts
// vite.config.ts
import zodCompiler from 'zod-compiler/vite';

export default defineConfig({
  plugins: [zodCompiler()],
});
```

### [MDN MCP Server：把 Web 文档与兼容性数据接入 AI Agent](https://developer.mozilla.org/en-US/blog/introducing-mdn-mcp-server/)

Mozilla 6 月 15 日发布的实验性 MCP 服务（`https://mcp.mdn.mozilla.net/`），让 Cursor、VS Code、Claude Code 等客户端能搜索 MDN、拉取完整文档 Markdown、查询 BCD 浏览器兼容性——直接缓解 LLM 训练截止导致的 API 幻觉。Cursor 配置只需在 `mcpServers` 里加 `url` 字段；Claude Code 一行 `claude mcp add --transport http mdn https://mcp.mdn.mozilla.net/`。实验阶段会记录查询日志，可用 `X-Moz-1st-Party-Data-Opt-Out: 1` 退出分析。对日常用 AI 写 CSS/新 Web API 的前端，这是低成本、高回报的上下文升级。

### [eslint-plugin-unicorn 67.0：200+ 条「挑战你」的 lint 规则](https://github.com/sindresorhus/eslint-plugin-unicorn/releases/tag/v67.0.0)

Sindre Sorhus 维护的 unicorn 规则集过去几周新增/更新近 100 条，v67 继续收紧现代 JS 最佳实践：偏好 `Temporal` 而非 `Date`、URL 强制 HTTPS、限制嵌套调用深度、改进注释规范等。与 Biome/Oxlint 并行时，unicorn 适合作为「品味护栏」补盲——尤其 AI 生成代码常默认 `new Date()` 与 `http://` 占位符。升级前建议用 `--print-config` 或 flat config 增量启用，避免一次性 200 条爆炸。

## 版本发布

### [Babel 8.0：ESM-only、默认告别 ES5/CJS 编译](https://babeljs.io/blog/2026/06/16/8.0.0/)

6 月 16 日正式版，八年来首个带破坏性变更的 major——**没有新功能，只有现代化**。核心包改为纯 ESM，要求 Node 22/24/26+；`@babel/preset-env` 默认跟随 Browserslist 的 `defaults`（约 ES2023），不再默默编译到 ES5，输出默认 ESM 而非 CJS；`loose`/`spec` 从 preset-env 移除，推荐迁移到细粒度 `assumptions`；polyfill 注入抽到 `babel-plugin-polyfill-corejs3`。所有 `@babel/*` 内置 TypeScript 类型。Babel 7 继续维护至 2027 年 6 月（仅安全修复）。对仍跑 CJS 构建脚本、或依赖 `@babel/register` 的项目，应先读 [Upgrade to Babel 8](https://babeljs.io/docs/v8-migration) 再动 major。

### [Playwright 1.61：Passkey 虚拟认证器与 WebStorage API](https://playwright.dev/docs/release-notes#version-161)

测试框架 1.61 补齐两类常见 E2E 痛点：**WebAuthn**，通过 `browserContext.credentials` 注入 credentialId/privateKey/publicKey，无需实体安全密钥即可跑 `navigator.credentials.get()` 流程，还可 setup 测试注册后 `credentials.get()` 复用到后续用例；**Web Storage**，`page.localStorage` / `page.sessionStorage` 提供与浏览器一致的 async API，告别 `page.evaluate(() => localStorage.setItem(...))` 的脆弱 polyfill。Passkey 登录流、JWT 存 localStorage 的 SPA 回归套件可显著简化。

```js
await context.credentials.create('example.com', { id, userHandle, privateKey, publicKey });
await context.credentials.install();
await page.localStorage.setItem('token', 'abc');
```

### [Node.js 26.3.1 / 24.17.0 / 22.23.0：六月安全更新](https://nodejs.org/en/blog/vulnerability/june-2026-security-releases)

6 月 18 日三条线同步发补丁，共修复 12 个 CVE，最高严重级别 HIGH。重点关注：**CVE-2026-48618** TLS 主机名规范化缺陷，Unicode 点分符可能绕过通配符证书校验；**CVE-2026-48933** WebCrypto `subtle.encrypt` 在输入为 2GiB 整数倍时整数溢出导致进程崩溃。另含 HTTP/2 ORIGIN 帧内存耗尽、DNS 嵌入 NUL、实验性 Permission Model 绕过等。依赖同步升级 OpenSSL 3.5.7、nghttp2 1.69.0、llhttp 9.4.2，Undici 按线分别为 8.5.0 / 7.28.0 / 6.27.0。生产环境应尽快滚动重启，尤其暴露 TLS 终止与文件加密接口的服务。
