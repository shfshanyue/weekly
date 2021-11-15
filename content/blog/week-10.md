---
title: "第 10 期: 使用 React 来构建流程图"
date: 2021-05-03T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅 Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA3MzU0MjIzMA==&action=getalbum&album_id=1761820812803620868&scene=21#wechat_redirect)

- ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9c7e74a8e804aef821311f51b3fdce7~tplv-k3u1fbpfcp-watermark.image)

Vite 里程碑

- npm 周下载量达**100K**
- GitHub star 数破**25K**
- 249 位代码贡献者
- Discord 上成员数超过**2.5K**

![100K 里程碑](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/343bfb498a1049e5b83b26e6fc9a806c~tplv-k3u1fbpfcp-watermark.image)

## 开发利器

### **一、 [npm 依赖可视化](https://npm.anvaka.com/)**

图解动画演示某一个 npm package 所有依赖，已开源 [anvaka/npmgraph](https://github.com/anvaka/npmgraph.an)，技术栈 `angular.js`、`browserify` 与 `gulp`

- [repo: anvaka/npmgraph.an](https://github.com/anvaka/npmgraph.an)

### **二、 [Code To Graph](https://crubier.github.io/code-to-graph/)**

undefined

## 文章推荐

### **一、 [深入剖析 JavaScript 编译器](https://ming1016.github.io/2021/02/21/deeply-analyse-quickjs/)**

QuickJS 是在 MIT 许可下发的一个轻量 js 引擎包含 js 的编译器和解释器，支持最新 TC39 的 ECMA-262 标准。

QuickJS 和其它 js 引擎的性能对比，可以参看 QuickJS 的 benchmark 对比结果页，从结果看，JerryScript 内存和体积小于 QuickJS，但各项性能均低于 QuickJS，Hermes 体积和内存大于 QuickJS，性能和 QuickJS 差不多，但 Hermes 对于 TC39 的标准支持并没 QuickJS 全。

## 开源与库

### **一、 [react flow: 使用 React 来构建流程图](https://reactflow.dev/)**

![](./assets/react-flow.png)

```js
import React from "react";
import ReactFlow from "react-flow-renderer";

const elements = [
  { id: "1", data: { label: "Node 1" }, position: { x: 250, y: 5 } },
  // you can also pass a React component as a label
  { id: "2", data: { label: <div>Node 2</div> }, position: { x: 100, y: 100 } },
  { id: "e1-2", source: "1", target: "2", animated: true },
];

const BasicFlow = () => <ReactFlow elements={elements} />;
```

- [npm: react-flow-renderer](https://npm.devtool.tech/react-flow-renderer)

## 版本发布

### **一、 Next 10.2 发布，Webpack 作者加入 Next 团队**

- [Next 10.2 Doc](https://nextjs.org/blog/next-10-2)
- [Next 10.2 Release](https://github.com/vercel/next.js/releases/tag/v10.2.0)

Next.js 在 04/28 发布了 10.2 版本，对于未手动配置过 webpack 的项目来说，默认开启 webpack5

- Faster Builds: Up to ~60% faster subsequent builds with caching.
- Faster Refresh: 100ms to 200ms faster refresh.
- Faster Startup: Up to ~24% faster next dev.
- Improved Accessibility: Route changes are now announced by screen readers.
- More Flexible Redirects and Rewrites: Match any header, cookie, or query string.
- Automatic Webfont Optimization: Improved performance by inlining font CSS.

另外，webpack 作者加入了 Next 团队

![](./assets/next10.2-webpack.png)
