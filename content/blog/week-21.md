---
title: "第 21 期: React 18, node18 发布，一个关于图片的美化器"
date: 2022-04-25T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅 Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 文章推荐

### **一、 [在 TypeScript 中处理日期类型](https://blog.logrocket.com/handing-date-strings-typescript/)**

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

### **二、 [React 18 全览](https://juejin.cn/post/7087486984146878494)**

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

### **三、 [开发人员口耳相传的 20 个提高生产力的技巧](https://medium.com/actiresults/20-productivity-tips-from-developers-to-developers-138f8ec6200c)**

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

### **四、 [nodejs 18 发布，新特性一览](https://zhuanlan.zhihu.com/p/502951532)**

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

## 开源与库

### **一、 [fakerjs，可模拟任意的假数据](https://fakerjs.dev/)**

faker.js 在 Github 原有的仓库已经被删除，这是对它的 Fork，通过 `@faker-js/faker` 安装。

```js
mport { faker } from '@faker-js/faker';

const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
```

- [repo: faker-js/faker](https://github.com/faker-js/faker)
- [npm: @faker-js/faker](https://npm.devtool.tech/@faker-js/faker)

## 开发利器

### **一、 [https://devtool.tech/image-share](图片美化器)**

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58dcd9a0210a45f5ad0fc352277aaad9~tplv-k3u1fbpfcp-zoom-1.image)

可通过对一张图片或者截图配置标题、作者、边距、背景等，对图片进行美化并导出。
