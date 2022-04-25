---
title: 前端优秀文章推送大汇总
date: 2022-04-25T07:15:36.907Z
---

### **1、 [nodejs 18 发布，新特性一览](https://zhuanlan.zhihu.com/p/502951532)**

在 2022/04/19，node 18.0.0 发布，可见发布日志: https://github.com/nodejs/node/releases/tag/v18.0.0。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16d71ee20f844d4ea13e67eca45d4827~tplv-k3u1fbpfcp-watermark.image?)

从图中可以看出，node 12 目前已不在维护，你们现在的 node 版本号是多少？

Node.js 官方启动了 next-10 工作，并讨论出了未来重要的几件事：

- 现代化的 HTTP
- 友好的类型支持
- 对初学者更友好的渐进式文档
- 对 ECMAScript 规范的支持和及时跟进
- 可观测性，包括 logging/metrics/tracing，以及 APM 等
- 更好的多线程支持
- 支持打包为单文件的分发方式

在 node18 中对以下特性做了增强:

1. Fetch API
2. Test Runner
3. Build-time user-land snapshot
4. V8 引擎升级，内置的 V8 引擎升级到 10.1 版本
5. ESM 的支持，
6. 工具链和编译器的升级
   - Linux 版是在 RHEL8 上构建的，要求 glibc 2.28 以上版本。
   - macOS 要求 10.15 以上版本。
   - Windows 很多旧版本也不支持了。

### **2、 [开发人员口耳相传的 20 个提高生产力的技巧](https://medium.com/actiresults/20-productivity-tips-from-developers-to-developers-138f8ec6200c)**

Medium 上一篇关于提高程序员生产力的 20 个技巧。

1. Know Your Integrated Development Environment。学习 IDE。
2. Learn Command Line Interface。学习命令行工具。
3. Never Rush To Code。不要急着写代码，这将导致项目代码不停地删删改改。
4. Avoid The Golden Hammer。
5. Review Your Commits。在提交代码前，进行自测。
6. But Practice Focused Learning。围绕着工作所需内容进行学习。
7. Build Side Projects。多搞业余项目，搞业余项目是学习一项技术最快的方法。
8. Write Readable Code。写可读性高的代码。
9. Track Time。记录自己的时间。
10. Use Buffer Time。估时需要留有缓冲时间。
11. Build Soft Skills。构建软技能，比如沟通、团队合作、时间管理、解决问题、批判性思维、耐心和毅力。
12. Automate as Much as You Can。自动化你手头的事儿。
13. Consider The Far End Of The Productivity Curve。学习一些学习曲线陡峭但很有用的技能，比如 vim。
14. Invest In Tools of The Trade。投资办公工具，比如人体工学椅。
15. Beware of Developer Burnout。注意不要过于疲倦。
16. Practice Journaling。写日记。
17. Take Breaks。安排休息时间和放松。
18. Keep a Record of Your Daily Achievements。记录你每天的成就。
19. Don’t Be Afraid To Make Mistakes。不要害怕犯错。
20. Don’t Skip Documentation。认真读文档。

### **3、 [React 18 全览](https://juejin.cn/post/7087486984146878494)**

React 18 目前已经是 React 默认版本号，其核心内部原理 Concurrent Mode 成为并发模式，尽管底层有很大变化，但对于业务开发者而言，感知不是很大。

本篇文章通过丰富的示例，系统介绍 React 18 的改变，多过几遍，受益匪浅，目录如下。

1. Concurrent Mode: 在 CM 模式下，React 每执行一个 Fiber，都会看看有没有更高优先级的更新，如果有，则当前低优先级的的更新会被暂停，待高优先级任务执行完之后，再继续执行或重新执行。
2. startTransition: React 的状态更新可以分为两类，紧急更新与过渡更新，CM 只提供了可中断的能力，默认情况下，所有的更新都是紧急更新。startTransition 可以标记一个非紧急更新，让该状态触发的变更变成低优先级的。
3. 自动批处理 Automatic Batching: 在 React 18 之前，React 只会在事件回调中使用批处理，而在 Promise、setTimeout、原生事件等场景下，是不能使用批处理的，而在 React 18 中，所有的状态更新，都会自动使用批处理，不关心场景。
4. 流式 SSR: 传统的 SSR 模式是串行执行的，如果其中有一步比较慢，都会影响整体的渲染速度。而在 React 18 中，基于全新的 Suspense，支持了流式 SSR，也就是允许服务端一点一点的返回页面。
5. Server Component: 服务端组件，目前还在开发过程中，有以下优势，零客户端体积、组件拥有完整的服务端能力、组件支持实时更新。
6. OffScreen
7. 新 Hooks
   7.1. useDeferredValue: 和 startTransition 一样，都是标记了一次非紧急更新。
   7.2. useId: 支持同一个组件在客户端和服务端生成相同的唯一的 ID，避免 hydration 的不兼容。原理是每个 id 代表该组件在组件树中的层级结构。
   7.3. useSyncExternalStore: 能够让 React 组件在 Concurrent Mode 下安全地有效地读取外接数据源。
   7.4. useInsertionEffect: 这个 Hooks 只建议 css-in-js 库来使用。

其中，[antd 4.20.0](https://github.com/ant-design/ant-design/releases/tag/4.20.0) 版本对 React 18 也做了支持，主要是关于 Strict Mode 的改动。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/407605f60a0f4dae85c180e57ef41456~tplv-k3u1fbpfcp-watermark.image?)

### **4、 [在 TypeScript 中处理日期类型](https://blog.logrocket.com/handing-date-strings-typescript/)**

关于日期的格式化，如 `YYYYMMDD`，在 TypeScript 中类型一般标注为 `string`，然而这样不够安全，我们如何通过 TyepScript 标注日期格式化类型为安全有效的呢，你会如何实现呢？

此时可以通过 TypeScript 中的 `template literal` 完成这件事情。

```ts
type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
/**
 * Years
 */
type YYYY = `19${zeroToNine}${zeroToNine}` | `20${zeroToNine}${zeroToNine}`;
/**
 * Months
 */
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
/**
 * Days
 */
type DD = `${0}${oneToNine}` | `${1 | 2}${zeroToNine}` | `3${0 | 1}`;
/**
 * YYYYMMDD
 */
type RawDateString = `${YYYY}${MM}${DD}`;

const date: RawDateString = "19990223";

// 二月没有31号，但是这个 type 依然被识别为正确类型
const dateInvalid: RawDateString = "19990231";

// 错误类型，一个月不会有99天，这里也有报错！
const dateWrong: RawDateString = "19990299";
```

然而对于二月而言，02/31 在这里依然会被判定为有效的日期，你知道如何解决这个事情吗？

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-04-23/clipboard-7365.112e43.webp)

目前，这道题已经被添加到了 [type-challenges](https://github.com/type-challenges/type-challenges/blob/main/questions/09155-hard-validdate/README.md)。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5ce47dbaeb1432585b63169a34b05de~tplv-k3u1fbpfcp-watermark.image?)

### **5、 [防御性设计和开发](https://mp.weixin.qq.com/s/G4pME9xFHdWnFckgytnofQ)**

本文从代码(Javscript、CSS)及 UI 两个纬度列举了前端所需要进行的防御点，并列出一些检查工具与一份相关的前端 Code Review 清单。

如关于白屏的防御:

1. 白屏监控
2. 资源加载失败重试
3. Service Worker 的资源 fallback 机制
4. 模块都包装了 error boundary
5. 兼容性探测和提示
6. 白屏提示信息

### **6、 [Web 端短视频编辑器的设计与实现 - 像做 PPT 一样做视频](https://mp.weixin.qq.com/s/WngZd7BR6PgZRoI5guA4ow)**

![音视频的处理和渲染](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3399ab4fb5374a12b08772587da69a08~tplv-k3u1fbpfcp-watermark.image?)

目前，浏览器已经拥有了关于音视频处理的诸多能力，如:

1. WebGL
2. WebCodecs
3. FFmpeg、WebAssembly

因此在 Web 端的音视频编辑器是可以实现的，在未来，编辑器会有更多机会和优化空间，可以真正实现像做 PPT 一样做视频。

### **7、 [在 nodejs 中原生使用 Fetch API](https://fusebit.io/blog/node-fetch)**

undici 是一个新的性能更强，延时更小，吞吐更高的 node http client，目前最新版 nodejs (17.5.0) 将 undici 作为它的依赖(可见源码 deps 目录)，并借助于它可在 nodejs 中直接使用 Fetch API

### **8、 [2021 年在 Web 领域有哪些关键进展？](https://mp.weixin.qq.com/s/frlfZ9iRNyAMMN_m1rS8Zw)**

W3C 领域在 2021 的一些发展列举如下

1. 小程序
2. 音频 - Web Audio 1.0
3. Web 文本编辑 - 虚拟键盘 API
4. 机器学习 - Web 神经网络 API
5. WebRTC - Encoded Transform
6. 浏览器自动化测试 - WebDriver API 2.0
7. 身份认证 - WebAuthn Level 3
8. Web 支付 - Payment Request API
9. 分散式标识符 - DID 标准
10. Web 字体 - 增量字体传输

### **9、 [2021 CSS 使用趋势](https://juejin.cn/post/7039547479997546533)**

### **10、 [2021 Javascript 使用趋势](https://juejin.cn/post/7045150888171667492)**

1. 平均(中位数)每个 PC 页面会加载 **463kb** 的 Javascript 资源
1. 平均(中位数)每个 PC 页面回加载 **21** 条 Javascript 资源请求
1. 平均(中位数)总加载的 JavaScript 资源中未使用的占到了 **36.2%**
1. 63.9% 的移动页面使用了具有已知安全漏洞的 JavaScript 库和框架

### **11、 [2021 CSS 使用状况年度报告](https://2021.stateofcss.com/zh-Hans/about)**

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-20/clipboard-7046.5730a3.webp)

关于 2021 年的 CSS 使用状况调查报告。

### **12、 [为什么 Vue 和 vite 源码抛弃了 yarn，迁移 pnpm？](https://mp.weixin.qq.com/s/Hzqy-XX51TiFz5vx4ZPR2Q)**

esbuild 在 v0.13 之后使用了 optionalDependencies 来安装某些不同平台的依赖(相关 pr 可以参考: [install using "optionalDependencies"](https://github.com/evanw/esbuild/pull/1621) ）。

但 yarn 1/2 并不会根据对应的 optional 规则去下载对应平台的包而是会去**选择下载所有的包**。(目前 npm/yarn 已修复该问题)

vite 目前会在一些场景下使用到 esbuild 这个库：例如目前开发阶段 vite 会使用 esbuild 进行依赖预打包，来将第三方依赖转成 ESM 格式的 bundle 产物。

因此每次在开发 vite 时使用 yarn 安装依赖的过程中，都会去安装 esbuild 以及相关的包。(目前 npm/yarn 已修复该问题)

而 pnpm 可以仅下载当前平台所需的包。除此之外，pnpm 还可大幅度减小安装体积等优势。

### **13、 [100 行代码实现 React 核心调度功能](https://mp.weixin.qq.com/s/uuxHlanqyN2HneYOz7DMVw)**

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-20/clipboard-0939.b3ac5e.webp)

React 有一套基于 Fiber 架构的调度系统。这套调度系统的基本功能包括：

1. 更新有不同优先级
1. 一次更新可能涉及多个组件的 render，这些 render 可能分配到多个宏任务中执行（即时间切片
1. 高优先级更新会打断进行中的低优先级更新

### **14、 [New in Node.js: node: protocol imports](https://2ality.com/2021/12/node-protocol-imports.html)**

Protocol Import 采用 node: 作为前缀，使得可以更安全更可读地访问内建模块。

```bash
import fs from 'fs/promises'
```

```bash
import fs from 'node:fs/promises'
```

它避免了内建模块与 node_modules 中 Package 冲突的安全性问题。

在 node 14.18.0 后可在 ESM 与 CJS 格式中使用。

### **15、 [The Gap — 开发和设计之间的鸿沟](https://zhuanlan.zhihu.com/p/442435914)**

![](https://pic3.zhimg.com/80/v2-cc0c7c45a0f87508375c24729a79c226_1440w.jpg)

不管设计师和开发者从属与不同的团队，还是在相同的多功能团队中协作，其实都是一样的。

每个学科都拥有自己的一套语言，因此，不同学科的叙事方式也会有所不同。

我们需要通过一种共同的结构化方法 来对齐我们的想法、思考和目标。通常，在这方面单靠自己很难。

### **16、 [Rust 是 JavaScript 基础设施的未来](https://mp.weixin.qq.com/s/LSIi2P6FKnJ0GTodaTUGKw)**

Rust 是 Javascript 基础设施的未来，它是一种更加**内存安全**的语言，由 Mozilla 创建。

通过以下两种方式，Rust 可直接被 Javascript 以模块的方式直接调用。而不用像 ESBuild 那样通过子进程(fork/exec)的方式被 Javascript 调用。

1. NAPI，`napi-rs` 可将 Rust 编译为 Node.js 的 add-on，提供一个二进制文件直接给 Node.js 使用。(使用 C++ 写的话，需要 `node-gyp` 编译较为麻烦)
1. WebAssembly，可将 Rust 编译为 `wasm` 供浏览器和 Node.js 使用，尽管性能没有原生好，但是比 JS 还是要强不少

Rust 和 SWC(基于 Rust 用以 Javascript 的基础设施工具) 目前正逐步替代压缩（Terser）、编译（Babel）、格式化（Prettier）、打包（webpack）、linting（ESLint）等多种前端基础设施场景。并可以获得可扩展性（Extensibility）和性能 (Performance) 的巨大提升。

### **17、 [元宇宙下的前端现状](https://juejin.cn/post/7001419484376350727)**

什么是元宇宙: 我们在虚拟世界中与一个全新的身份一一对应，并且不会间断地“生活下去”，很容易就能让人联想到《头号玩家》这部电影。

本文还介绍了 WebXR、WebAR 的优缺点及市场化的解决方案等。其中还提到关于渲染的性能方案，对于传统前端也有很大启发。

1. 把纯计算的代码移到 WebGL 的 shader 或 Web Worker 里

- WebGL 调用 GPU 加速，shader 可以用于加速只和渲染（重绘）有关的代码，无关渲染的代码放入 shader 中反而会造成重复计算
- Web Worker，适用于事先计算或实时性要求不高的代码，如布局算法

2. WebAssembly
3. gpu.js，将简单的 JavaScript 函数转换为着色器语言并编译它们，以便它们在您的 GPU 上运行。如果 GPU 不可用，函数仍将在常规 JavaScript 中运行。
4. 用滤波算法（比如卡尔曼滤波）将卡顿降到更小，让用户从视觉感受上似乎更流畅

### **18、 [Chrome 新功能：支持录制、重放和测试用户操作！](https://mp.weixin.qq.com/s/MkaNfzYJMSFCiAABQuIjuA)**

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d7a2018aab64e12b222e2e8679750fb~tplv-k3u1fbpfcp-watermark.image?)

Chrome 在最新的版本（Chrome 97）里面新增了一个非常好用的功能，可以帮助我们录制、回放、测试用户操作。

### **19、 [Webpack 性能系列四：分包优化](https://mp.weixin.qq.com/s/LrASIdA19iwIwng29G5HpA)**

SplitChunksPlugin 进行分包的三要素:

1. minChunks: 一个模块是否最少被 minChunks 个 chunk 所引用
1. maxInitialRequests/maxAsyncRequests: 最多只能有 maxInitialRequests/maxAsyncRequests 个 chunk 需要同时加载 (如一个 Chunk 依赖 VendorChunk 才可正常工作，此时同时加载 chunk 数为 2)
1. minSize/maxSize: chunk 的体积必须介于 (minSize, maxSize) 之间

最佳实践还是应该看看 Next.js 的配置: [源码](https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack-config.ts#L735)

1. Webpack 运行时
1. React Framework 运行时，包括 React/React-DOM 及其它们所有的依赖
1. 大型库，体积特别大的库
1. 公共库，至少被 4 个 Chunk 所引用的公共模块

### **20、 [node_modules 困境](https://juejin.cn/post/6914508615969669127)**

洋洋洒洒将近一万字，提出了 node_modules 的发展现状及其若干问题，每次读后都受益匪浅。

### **21、 [coa 和 依赖锁定](https://mp.weixin.qq.com/s?src=11&timestamp=1636378040&ver=3424&signature=yQmx-VEh991eTxqSOugoPwP5FQlqAe0zhiTyxYxxP9WSO8MjKW5-3lIgAv-tpu-5JJUWVboL7HtAMmPnWa49Zs8I6pnxajE1WwUB2kgHpMtRQL0bSrj8*splg7lVFYb0&new=1)**

### **22、 [现代 web 开发困局](https://juejin.cn/post/7025868886914400293)**

### **23、 [现代化 Web 关于 HTTP 缓存新的标准](https://httptoolkit.tech/blog/status-targeted-caching-headers/)**

![cache-status](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/cache-status.54usyd12g4w0.png)

现代化 Web 关于 HTTP 缓存新的标准，两个响应头

1. Cache-Status
2. [Target]-Cache-Control

可以更容易地配置源服务器到客户端中间各级中间代理服务器的缓存控制

### **24、 [Javascript 是如何在 v8 中执行的](https://juejin.cn/post/6844903990073753613)**

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec43aed2172~tplv-t2oaga2asx-watermark.awebp)

字节码是机器码的抽象。如果字节码的设计与物理 CPU 的计算模型相同，那么将字节码编译成机器代码就会更加容易。这就是为什么解释器通常是寄存器或堆栈机器。Ignition 是一个带有累加器的寄存器。

### **25、 [谈谈我这些年对前端框架的理解](https://mp.weixin.qq.com/s/mZ7KuFjyCWNCAq7HnXg96A)**

技术从出现到完善到连带的周边生态的完善是一个轮回，从最开始服务端渲染，到了后来的客户端渲染，然后出现了逻辑层的组件方案，最后又要基于组件方案重新实现服务端渲染。

其实物理层的东西一直都没变，只是逻辑层不断的一层添加又一层，目的都是为了提高生产效率，降低开发成本，保证质量，这也是技术发展的趋势。"

### **26、 [Natively Format JavaScript Dates and Times](https://elijahmanor.com/blog/format-js-dates-and-times)**

![格式化](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210604/image.2t992g3c80g0.png)

借助于 Date.prototype.toLocaleDateString() 可以做一些格式化的事情，他有以下参数

- weekday - "narrow", "short", "long"
- year - "numeric", "2-digit"
- month - "numeric", "2-digit", "narrow", "short", "long"
- day - "numeric", "2-digit"

### **27、 [Introducing WebContainers: Run Node.js natively in your browser](https://blog.stackblitz.com/posts/introducing-webcontainers/)**

Stackblitz 发布了一款新产品: Web Container.

它借助于 WebAssembly 与新的 [capabilities APIs](https://web.dev/fugu-status/) 把虚拟的 Node 环境运行在了浏览器端。

### **28、 [深入剖析 JavaScript 编译器](https://ming1016.github.io/2021/02/21/deeply-analyse-quickjs/)**

QuickJS 是在 MIT 许可下发的一个轻量 js 引擎包含 js 的编译器和解释器，支持最新 TC39 的 ECMA-262 标准。

QuickJS 和其它 js 引擎的性能对比，可以参看 QuickJS 的 benchmark 对比结果页，从结果看，JerryScript 内存和体积小于 QuickJS，但各项性能均低于 QuickJS，Hermes 体积和内存大于 QuickJS，性能和 QuickJS 差不多，但 Hermes 对于 TC39 的标准支持并没 QuickJS 全。

### **29、 [React Express](https://www.react.express/)**

学习 React 的专业小书，重实践，对每一小节，都有在线实时代码可以调试并学习。

### **30、 [Say Hello To CSS Container Queries](https://ishadeed.com/article/say-hello-to-css-container-queries/)**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3ebbddddc1447f3ae96382c9018b2ef~tplv-k3u1fbpfcp-zoom-1.image)

容器查询(Container Query) 是即将到来的一项 CSS 特性，Container Query 比 Media Query 更强大的 Query。目前需要体验需在谷歌浏览器中打开地址 `chrome://flags` 查找到 `container query` 手动开启

Container Query 与 Grid Layout 真是天作之合，可以完成以前难以完成或者及其复杂的布局

### **31、 [Dark mode in 5 minutes, with inverted lightness variables](https://lea.verou.me/2021/03/inverted-lightness-variables/)**

本文使用 HSL 函数与 CSS 变量自动生成网站暗黑模式

```css
:root {
  --primary-hs: 250 30%;
}

h1 {
  color: hsl(var(--primary-hs) 30%);
}

article {
  background: hsl(var(--primary-hs) 90%);
}

article h2 {
  background: hsl(var(--primary-hs) 40%);
  color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --primary-hs: 320 30%;
  }
}
```

[HSL](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl_colors) 函数如同 RGB 函数一样，可作为 `color` 的属性值，他接受三个参数：色相(Hue)、饱和度(Saturation)和亮度(Lightness)

- H (hue) 色相，单位是角度， 其中 red=0deg(=360deg), green=120deg, blue=240deg
- S (Saturation) 饱和度，单位是百分比，为 0 时代表全灰
- L (Lightness) 亮度，单位是百分比，100% 是白色，0% 是黑色

### **32、 [纯 Javascript 代码片段大全](https://www.smashingmagazine.com/2021/04/vanilla-javascript-code-snippets/)**

![](./assets/date.jpg)

这篇文章总结了几个收集关于 vanilla javascript 代码片段的网站，非常好用，包含以下几个网站

1. [30 Seconds Of Code](https://www.30secondsofcode.org/)
1. [How to manage HTML DOM with vanilla JavaScript only?](https://htmldom.dev/)
1. [Cheat sheet for moving from jQuery to vanilla JavaScript](https://tobiasahlin.com/blog/move-from-jquery-to-vanilla-javascript/)
1. [microjs](http://microjs.com/#)
1. [Single line of code](https://1loc.dev/)

### **33、 [图片加载异常兜底方案](https://juejin.cn/post/6945040754255331336)**

当图片加载失败后，我们可以使用 DataURI 作为一个友好的兜底方案。但是仍有许多复杂的情况，可以看这篇文章了解一下。

### **34、 [如何高效组织 npm script](https://shanyue.tech/node/npm-scripts.html)**

一个项目的 npm script 是前端工程化的一个缩影，从这篇文章可以给我们如何更好地组织 npm script 启发一个新的思考，涉及到以下方面

1. start/dev
1. build
1. test
1. format
1. lint
1. audit
1. outdated
1. size
1. deploy

### **35、 [仅使用 CSS 就可以提高页面渲染速度的 4 个技巧](https://blog.bitsrc.io/improve-page-rendering-speed-using-only-css-a61667a16b2)**

![](./assets/content-visibility.gif)

本篇文章提到了四个关于提高页面性能的 CSS 技巧

1. content-visibility
1. will-change
1. 带有媒体查询的 link
1. @import

### **36、 [v8 Heapsnapshot 文件解析](https://segmentfault.com/a/1190000039650874)**

![](./assets/heapdump.png)

结合 v8 源码看 heapsnashot 文件的数据结构，了解它非常有利于我们调试 Node 中的内存问题

### **37、 [Flutter Web 在美团外卖的实践](https://tech.meituan.com/2021/03/18/flutterweb-in-meituanwaimai.html)**

![](./assets/meituan-flutter.png)

Flutter 对 Web 的支持已经进入了 Stable 阶段，美团落地了 Flutter Web 并总结了相关经验。但是在 Web 端使用 Flutter 现阶段仍有许多不足，比如脆弱的 Web 生态及构建

- Flutter 无法对文件进行 Hash 化，因此很难利用 Long Term Cache
- Flutter 对打包文件很难进行拆包
- Flutter 对资源上传 CDN 比较困难
- Flutter Web 自身实现了一套页面滚动机制，页面滚动性能较差。

来这篇文章看看美团是怎么解决这些问题的吧，下图是美团的技术架构

![](./assets/meituan-flutter-arch.png)

### **38、 [webpack 核心模块 tapable 用法解析](https://segmentfault.com/a/1190000039418800)**

Plugin 是 webpack 的核心功能之一，而它依赖于 tabpable 这个库，它为 Plugin 的实现提供了事件处理和流程控制多种多样的钩子。

它的核心原理是高级版的发布订阅模式，使用 `tap` 注册事件，使用 `call` 触发事件。

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require("tapable");
```

### **39、 [为什么你应该使用 Picture 来代替 Img 标签](https://blog.bitsrc.io/why-you-should-use-picture-tag-instead-of-img-tag-b9841e86bf8b)**

![](./assets/picture.jpg)

picture 标签拥有更好的分辨率切换与媒体查询，当小屏幕使用更小的图片益于性能优化，高分屏使用 2x 图片益于美术设计。

并且可支持书写多种图片格式，对最新的图片格式 avif/webp 提供回退方案，因此可采用最佳图片格式。此处与构建工具一同使用为最佳实践。

```html
<picture>
  <source srcset="test.avif" type="image/avif" />
  <source srcset="test.webp" type="image/webp" />
  <img src="test.png" alt="test image" />
</picture>
```

### **40、 [一文详解 CSS in JS](https://mp.weixin.qq.com/s/v0IB2mZHrF0l2ks5pVsO1g)**

关于 CSS in JS 的历史

### **41、 [All in one：项目级 monorepo 策略最佳实践](https://juejin.cn/post/6924854598268108807)**

![](./assets/babel-mono.png)

目前 monorepo 已成为了 npm7、yarn 的标准功能，未来会有更多的 project/package 通过 monorepo 的方式维护，许多公共库如 babel、react 也通过 monorepo 维护。

通过 monorepo 可以更好地管理多 Pakcage 依赖，复用配置及公共的 devDep 等，现在快来学习吧。

### **42、 [腾讯企鹅辅导 webpack5 升级实践](https://mp.weixin.qq.com/s/P3foOrcu4StJDGdX9xavng)**

1. Module Federation: 多应用共享依赖打包，扔到 CDN 共享

与上边字节差不多，总结下来更快的打包速度、更小的打包体积。但是好在给出了数据

第一次打包

| webpack 版本 | 第一次 build 时间 | 第二次 build 时间 | 第三次 build 时间 |
| ------------ | ----------------- | ----------------- | ----------------- |
| v4           | 19.6s             | 6.8s              | 7.4s              |
| v5           | 14.8s             | 1.6s              | 1.5s              |

修改源码后，再次打包

| webpack 版本 | 第一次 build 时间 | 第二次 build 时间 | 第三次 build 时间 |
| ------------ | ----------------- | ----------------- | ----------------- |
| v4           | 10.5s             | 7.3s              | 6.8s              |
| v5           | 4.0s              | 1.5s              | 1.6s              |

打包大小对比

| webpack 版本 | build 产生的文件的大小 |
| ------------ | ---------------------- |
| v4           | 2.16M                  |
| v5           | 2.05M                  |

### **43、 [字节商业变现团队 webpack5 业务实践](https://juejin.cn/post/6924258563862822919)**

1. FilesystemCache: 更快的二次构建
1. Prepack: 更早的编译期计算，更小的体积
1. Asset Modules: 资源加载内置
1. Named ChunkID: 更强的永久缓存能力
1. 深度 TreeShaking 能力
1. 内置 Worker/WASM 构建能力
1. Node Polyfill 去除，如 crypto、querystring 等

总结下来更快的打包速度、更小的打包体积

### **44、 [作者尤雨溪视频直播下一代前端构建工具 Vite 讲解 （中英双语字幕，B 站可看）](https://juejin.cn/post/6937176680251424775)**

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae725a4f58dc4b81884d842e62b9c42d~tplv-k3u1fbpfcp-watermark.image)

Vite 一个部分是基于 ESM 的利用 esbuild 的开发服务器，另一个部分是基于 Rollup 的配置化的打包器。视频中尤大将使用一个 Demo 进行演示，并讲解关于它的哲学思考。

视频已被热心小哥制作成双语字幕视频，并上传到了 B 站。

### **45、 [十分钟教你用 svg 做出精美的动画！](https://juejin.cn/post/6930412294149472269)**

![](./assets/gsap.gif)

如何快速制作出精美的 SVG 动画？

第一步：找一个 SVG

第二步：分解 SVG 的 Path

第二步：使用 GSAP 库编程把 SVG 动起来

### **46、 [像大佬一样使用 Google 搜索](https://dev.to/denicmarko/google-like-a-pro-5cf6)**

`-` 减号排除关键字

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be345d239a07458c852dad96ab53355a~tplv-k3u1fbpfcp-zoom-1.image)

`""` 双引号精确搜索

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04149ac687714dd388ebef55427ee0ef~tplv-k3u1fbpfcp-zoom-1.image)

### **47、 [深入 ESM 图解](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)**

当前，在浏览器中通过 `<script type="module">` 已原生支持 ESM，你可以在 `vite` 或者 `snowpack` 中尝试一下

本文用图解的方式深入讲解了 ESM 的工作原理。

在平常工作中，使用 `import/export` 开发模块，此时会以入口节点为根节点呈现出一张依赖关系图:

![](./assets/esm-module-record.png)

浏览器会解析文件，根据 `import/export` 语句构成模块记录(`Module Record`)

![](./assets/esm-module-record-2.png)

一个 ESM 执行需要经过构建(Constructor)、实例化(Instantiation)和运行(Evaluation)三步

![](./assets/esm.png)

### **48、 [Github 新首页是如何变得更快的](https://github.blog/2021-01-29-making-githubs-new-homepage-fast-and-performant/)**

看惯了教科书式的性能优化方案，来看看这些非教科书式的性能优化方案吧

使用 IntersectionObserver 优化前后的性能对比

![Compare](./assets/github-compare.png)

### **49、 [为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://juejin.cn/post/6932046455733485575)**

它由 npm/yarn 衍生而来，但是比 npm/yarn 更快，安全性更高，也更好地支持 monorepo。

### **50、 [前端优秀实践不完全指南](https://juejin.cn/post/6932647134944886797)**

本文其实应该叫做 **Web 用户体验设计提升指南**。本文罗列的经验大都是在实际开发过程中常会遇到的问题及大厂中变态的细节优化要求，我已经来来回回翻了不下三遍，非常有用，受益匪浅！

1. 图片加载失败后如何处理？
1. 本应 1x1 展示的图片，设计给了 1x100 如何展示？
1. 如何让网站优先加载系统默认字体？
1. 如何做更好的 A11Y 体验优化?

![色彩度对比](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f86c3e1740e047df9848c93a9d02f868~tplv-k3u1fbpfcp-zoom-1.image)
