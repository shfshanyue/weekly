---
title: "React 19 中 use 和 useOptimistic 介绍，node.js 中 v8 更新，primevue 等"
date: 2024-03-08T00:00:00.000Z
release: 31
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 文章推荐

### 一、 [Node 中最近的 8 大 V8 更新](https://blog.appsignal.com/2024/02/28/top-8-recent-v8-in-node-updates.html)

近来，V8 进行了 8 大更新。

1. 新的 JavaScript 特性，包括：

```javascript
// toWellFormed() 字符串方法
const str = "Hello, World!";
let result = str.toWellFormed();

// ArrayBuffer 的可调整大小
const buffer = new ArrayBuffer(8, { maxByteLength: 16 });
buffer.resize(16);
```

2. 支持将垃圾收集的语言编译为 WebAssembly，即 WasmGC。这使得 Java、Kotlin、Dart、Python、C# 等语言可编译为 Wasm 在 web 上运行。
3. 引入了名为 Maglev 的全新优化编译器，处于 Sparkplug 非优化 JavaScript 编译器和 TurboFan 顶级优化编译器之间。
4. 同时还引入了名为 Turboshaft 的优化编译器 Turbofan 的新内部架构，这使得 Turbofan 更易于扩展新的优化和加快编译。
5. 提升了控制流的完整性，防止攻击者利用内存腐败漏洞执行任意代码。
6. 显著提高了 HTML 解析速度和 DOM 分配速度，对于优化 web 性能有重要推动作用。
7. 在 Wasm 中添加新特性，用于处理 Wasm 中的多内存，执行尾用调优化，释放下一级性能，为内存密集型应用程序完成了 memory64 的实现。
8. 内存管理的革新性改进，即静态根（static roots），优化了基本 JavaScript 对象在内存中的管理方式。

### 二、 [React 19 中的 `use` hook](https://react.dev/reference/react/use)

React 的 `use` Hook 允许从如 `Promise` 或 `context` 之类的资源中读取值。`use` 的具体使用如下：

```markdown
import { use } from 'react';
function Component({ promise }) {
const result = use(promise);
}
```

与其他 Hooks 不同，`use` 可以在循环和条件语句中调用。不仅如此，当和 `Promise` 一起使用时，`use` 能和 Suspense 以及错误边界进行整合。

如果传给 `use` 的 `Promise` 还在等待，调用 `use` 的组件会暂停；如果该组件被包裹在 Suspense 边界中，会显示回退；一旦 `Promise` 完成，原来的 Suspense 回退会被用 `use` 获取的数据渲染的组件替代。如果 `Promise` 被拒绝，就会显示最近的错误边界的回退。

`use` 的参数是你想从中读取值的数据源，可以是一个 `Promise` 或 `context`，返回从资源中读取的值。这个 Hook 必须在 Component 或 Hook 中调用。

### 三、 [React 19 中的 `useOptimistic` hook](https://react.dev/reference/react/useOptimistic)

`useOptimistic` 是 React 19 的一个新的 hook，它能够让你乐观地更新用户界面。它接受一些状态作为参数，并返回一个在异步操作进行时可能不同的状态副本。这个状态叫做“乐观”状态，因为它通常被用来立即向用户呈现执行操作的结果，尽管操作实际上需要时间完成。

```javascript
import { useOptimistic } from "react";
function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state with optimistic value
    },
  );
}
```

在该示例中，`updateFn(currentState, optimisticValue)` 是一个接收当前状态和乐观值作为参数的函数。这必须是一个纯函数，返回合并当前状态和乐观值之后的结果。

`useOptimistic` 允许在后台操作（如网络请求）完成之前就更新用户界面。例如，**在表单应用中，用户提交表单后，尽管实际的服务器响应可能需要等待，界面会立即用预期的结果进行更新，观感更快，响应性更高。**

```javascript
import { useOptimistic, useState, useRef } from "react";
...
const [optimisticMessages, addOptimisticMessage] = useOptimistic(messages, (state, newMessage) => [...state, { text:newMessage, sending:true }]);
...
```

在这个例子中，使用 `useOptimistic` 对消息进行更新。优化后的信息立即显示在列表中，并且在后台尝试真正地发送消息。一旦服务器确认收到了消息，"发送中..."标签就会被移除。

### 四、 [is-number 包为什么每周会下载 5900 万次？`](https://shubhamjain.co/2024/02/29/why-is-number-package-have-59m-downloads/)

文章探讨了 'is-number' 这个 npm 包怎样达到每周 5900 万的下载量。尽管这只是一个包含一行代码的 npm 包，下载量却非常大。

使用 npm 的简单统计方式会包含许多请求（包括自动构建服务器、镜像网站、用以分析的机器人的下载），这导致了很多开发者通过编写简单的包，放入他们自己的包，然后再利用这些包创造更多的包，使得他们的下载数量被人为地强化。

例如：

```
tailwindcss -> chokidar -> braces -> fill-range -> to-regex-range -> is-number
```

这种依赖地狱的情况应该引起注意，作者提出了几种解决方式：

1. npm 应该区分直接和间接下载；
2. 着手替换引起这种混乱的包，用那些内联依赖的包来代替。
3. 就像 Bundlephobia 一样，应该有一个网站可以列出当你安装某一个 npm 包时，最终会下载多少包。希望它能鼓励社区寻找间接依赖较少的包。

这种过度依赖可能会带来潜在成本，JS 社区应当正视并解决这个问题。

## 开源与库

### 一、 [primevue，Vue.js 的下一代 UI 组件套件](https://github.com/primefaces/primevue)

PrimeVue 是一款专为 Vue.js 设计的 UI 组件套件，配有80多个 UI 组件，包括定制主题或使用 CSS 库（如 TailwindCSS）实现设计系统的功能。

这个集成的 UI 套件能为你的 web 应用增添丰富的视觉效果和交互功能。同时，它的开放源码社区鼓励用户间的交流和合作，还能在项目的路线图中有发言权。

另外，PrimeVue 支持 Web 内容可访问性指南 (WCAG 2.0) ，提供优质的企业级支持服务，并提供一流的 Typescript 支持，这使得它在满足各种 UI 需求时，始终保持代码的高效和稳定。

此外，通过400多个预设计的 UI 模块，你可以快速复制粘贴，以极短的时间内构建出卓越的应用程序。

- [repo: primefaces/primevue](https://github.com/primefaces/primevue)
- [npm: primevue](https://npm.devtool.tech/primevue)

### 二、 [tailwind-merge，有效地合并 Tailwind CSS 类，避免样式冲突](https://github.com/dcastil/tailwind-merge)

tailwind-merge 旨在效率地合并 Tailwind CSS 类，尤其是在涉及到可能产生样式冲突的情况下。示例如下：

```javascript
import { twMerge } from "tailwind-merge";
let result = twMerge("px-2 py-1 bg-red hover:bg-dark-red", "p-3 bg-[#B91C1C]");

// 输出 'hover:bg-dark-red p-3 bg-[#B91C1C]'
console.log(result);
```

- [repo: dcastil/tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [npm: tailwind-merge](https://npm.devtool.tech/tailwind-merge)

### 三、 [blocknote，一个基于 Prosemirror 和 Tiptap 之上的 Notion 式的块状可扩展文本编辑器](https://www.blocknotejs.org/)

BlockNote 是一个开源的块状 React 富文本编辑器。

它能为你的应用程序添加一个现代的文本编辑体验。如果你想自己创建 UI 组件（菜单），或者不想使用 React，你可以使用 @blocknote/core。

BlockNote具有许多特性和组件，使得在你的应用中嵌入高质量的块状编辑器变得容易。它提供了动画，有用的占位符，拖放块，嵌套/缩进，以及斜线菜单，格式菜单，实时协同等功能。

你可以简单地引入 BlockNote，使用以下 React 代码样例：

```js
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

function App() {
  const editor = useCreateBlockNote();

  return <BlockNoteView editor={editor} />;
}
```

- [repo: TypeCellOS/BlockNote](https://github.com/TypeCellOS/BlockNote)
- [npm: @blocknote/react](https://npm.devtool.tech/@blocknote/react)

### 四、 [yoctocolors，互联网上最小且最快的命令行着色器包](https://github.com/sindresorhus/yoctocolors)

yoctocolors 是一个命令行着色器，它声称自己是互联网上最小且最快的命令行着色器包。

优点是大小小、速度快、无依赖、维护积极。

在使用上，它支持基本的颜色检测，可以通过设置 `FORCE_COLOR` 环境变量为 1 来强制启用颜色，也可以设置 `NO_COLOR` 或 `NODE_DISABLE_COLORS` 为任意值来关闭颜色效果。

示例如下：

```javascript
import * as colors from "yoctocolors";
console.log(colors.red("Yo!"));
```

它提供了一系列的样式修饰符以及颜色选择。

样式修饰符包括重置当前样式、加粗文本、降低文本透明度、让文本斜体、在文本上方下方画水平线、反转背景和前景颜色、隐藏打印文本以及在文本中心画一条水平线等。

颜色选择包括黑色、红色、绿色、黄色、蓝色、品红、青色、白色、中性灰、亮红色、亮绿色、亮黄色、亮蓝色、亮品红、亮青色、亮白色等。

用户可根据自己的需要自由选择，并结合颜色使用，如：

```javascript
console.log(colors.blue(colors.bold("Hello, world!")));
```

- [repo: sindresorhus/yoctocolors](https://github.com/sindresorhus/yoctocolors)
- [npm: yoctocolors](https://npm.devtool.tech/yoctocolors)

## 开发利器

### 一、 [一纸简历](https://cv.devtool.tech/)

一纸简历是一个在线创建简历的平台，它支持 Markdown 语法，使得语法简单和学习成本极低。而且此平台还有由 AI 智能生成简历的功能。
