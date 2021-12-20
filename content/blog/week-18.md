---
title: "第 18 期: Create React APP 5.0 终于发布了"
date: 2021-12-20T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅 Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 文章推荐

### **一、 [New in Node.js: node: protocol imports](https://2ality.com/2021/12/node-protocol-imports.html)**

Protocol Import 采用 node: 作为前缀，使得可以更安全更可读地访问内建模块。

```bash
import fs from 'fs/promises'
```

```bash
import fs from 'node:fs/promises'
```

它避免了内建模块与 node_modules 中 Package 冲突的安全性问题。

在 node 14.18.0 后可在 ESM 与 CJS 格式中使用。

### **二、 [100 行代码实现 React 核心调度功能](https://mp.weixin.qq.com/s/uuxHlanqyN2HneYOz7DMVw)**

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-20/clipboard-0939.b3ac5e.webp)

React 有一套基于 Fiber 架构的调度系统。这套调度系统的基本功能包括：

1. 更新有不同优先级
1. 一次更新可能涉及多个组件的 render，这些 render 可能分配到多个宏任务中执行（即时间切片
1. 高优先级更新会打断进行中的低优先级更新

### **三、 [2021 CSS 使用状况报告](https://2021.stateofcss.com/zh-Hans/about)**

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-20/clipboard-7046.5730a3.webp)

关于 2021 年的 CSS 使用状况的调查。

- [跳转译文](https://mp.weixin.qq.com/s?src=11&timestamp=1639969439&ver=3507&signature=eF2ODRO6S53ygZhnytXGHJufSF0ioVwQm7pndob6Jx8CyCPKqJQZEsxeG*ZsrJFX**8OO2fjPjajdGCRRL3B-4aRddezjdc8g*4VohXEyHHHOW*krRdPg9BvUwse3u6x&new=1)

### **四、 [为什么 Vue 和 vite 源码抛弃了 yarn，迁移 pnpm？](https://mp.weixin.qq.com/s/Hzqy-XX51TiFz5vx4ZPR2Q)**

esbuild 在 v0.13 之后使用了 optionalDependencies 来安装某些不同平台的依赖(相关 pr 可以参考: https://github.com/evanw/esbuild/pull/1621）。

但 yarn 1/2 并不会根据对应的 optional 规则去下载对应平台的包而是会去**选择下载所有的包**。

vite 目前会在一些场景下使用到 esbuild 这个库：例如目前开发阶段 vite 会使用 esbuild 进行依赖预打包，来将第三方依赖转成 ESM 格式的 bundle 产物。

因此每次在开发 vite 时使用 yarn 安装依赖的过程中，都会去安装 esbuild 以及相关的包。

而 pnpm 可以仅下载当前平台所需的包。

## 开源与库

### **一、 [neutralinojs: 轻量的跨平台桌面应用开发框架](https://github.com/neutralinojs/neutralinojs)**

它可以提供轻量的较小体积的跨平台桌面应用开发。

- [npm: @neutralinojs/neu](https://npm.devtool.tech/@neutralinojs/neu)

### **二、 [Create React App 终于支持 webpack5 了](https://github.com/facebook/create-react-app/releases/tag/v5.0.0)**

在 Create-React-App 5.0 中，终于发布了对 webpack5 的支持 (webpack5 已经出来一年了！)

- webpack 5 (#11201)
- Jest 27 (#11338)
- ESLint 8 (#11375)
- PostCSS 8 (#11121)
- Fast Refresh improvements and bug fixes (#11105)
- Support for Tailwind (#11717)
- Improved package manager detection (#11322)
- Unpinned all dependencies for better compatibility with other tools (#11474)
- Dropped support for Node 10 and 12

- [npm: create-react-app](https://npm.devtool.tech/create-react-app)

### **三、 [zx: 在 nodejs 中调用 shell 更好的工具](https://github.com/google/zx)**

写脚本的最佳方式，强烈推荐!

```js
#!/usr/bin/env zx

await $`cat package.json | grep name`;

let branch = await $`git branch --show-current`;
await $`dep deploy --branch=${branch}`;

await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`]);

let name = "foo bar";
await $`mkdir /tmp/${name}`;
```

- [npm: zx](https://npm.devtool.tech/zx)

## 开发利器

### **一、 [Unsplash](https://unsplash.com/)**

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-20/clipboard-6411.d28622.webp)

免费的无版权图片网址，并提供开发者文档允许开发者调用 API。甚至提供了各个编程语言的 SDK 进行调用。

```js
import { createApi } from "unsplash-js";
import nodeFetch from "node-fetch";

unsplash.photos.getRandom({
  collectionIds: ["abc123"],
  topicIds: ["def456"],
  featured: true,
  query: "cat",
  count: 1,
});
```

### **二、 [Pexels](https://www.pexels.com/zh-cn/)**

与 Unsplash 一样，同样提供 SDK 进行调用。

文档地址: <https://www.pexels.com/zh-cn/api/documentation/>

### **三、 [Undraw](https://undraw.co/illustrations)**

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-20/clipboard-4870.038d73.webp)

提供免费的 SVG 矢量图素材。
