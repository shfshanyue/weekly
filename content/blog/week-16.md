---
title: "第 16 期: 加速你的 Javascript 运算性能"
date: 2021-11-21T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅 Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 开发利器

### **一、 [MetaTags，生成网页的 Meta 信息](https://metatags.io/)**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a8501fdd38d4214804d45bcc53fddc4~tplv-k3u1fbpfcp-watermark.image?)

生成网页的 Meta 信息，并可实时预览 Google 搜索、Twitter、Facebook 上你网站被索引/分享的样子

### **二、 [cccreate，偏 CSS 的设计类工具合集](https://cccreate.co/)**

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70f8f0b6586c4321a2f26ada1ff6c6cf~tplv-k3u1fbpfcp-watermark.image?)

有关色彩搭配、布局、排版、图标、动画等设计类小工具的集合

### **三、 [BundleScanner，找出一个网站上所使用的的 npm 库与对应的版本号。](https://bundlescanner.com/。)**

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbdd975c10f343269b54a94266565045~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c589377a94d244cf929260c04ae8332d~tplv-k3u1fbpfcp-watermark.image?)

输入一个网址，即可分析出该网站的所有 npm 依赖及其版本号，及其每一个 JS 资源的技术栈。

它的原理是对所有流行的 npm 库建立倒排索引(elasticsearch 那种)，再对目标网址资源根据特定提取出来的关键 token 进行匹配。

相对 Wappalyzer 而言，它提取出来的 npm 库更多更精确。现在就差一个浏览器插件了。

## 文章推荐

### **一、 [元宇宙下的前端现状](https://juejin.cn/post/7001419484376350727)**

什么是元宇宙: 我们在虚拟世界中与一个全新的身份一一对应，并且不会间断地“生活下去”，很容易就能让人联想到《头号玩家》这部电影。

本文还介绍了 WebXR、WebAR 的优缺点及市场化的解决方案等。其中还提到关于渲染的性能方案，对于传统前端也有很大启发。

1. 把纯计算的代码移到 WebGL 的 shader 或 Web Worker 里

- WebGL 调用 GPU 加速，shader 可以用于加速只和渲染（重绘）有关的代码，无关渲染的代码放入 shader 中反而会造成重复计算
- Web Worker，适用于事先计算或实时性要求不高的代码，如布局算法

2. WebAssembly
3. gpu.js，将简单的 JavaScript 函数转换为着色器语言并编译它们，以便它们在您的 GPU 上运行。如果 GPU 不可用，函数仍将在常规 JavaScript 中运行。
4. 用滤波算法（比如卡尔曼滤波）将卡顿降到更小，让用户从视觉感受上似乎更流畅

### **二、 [Rust 是 JavaScript 基础设施的未来](https://mp.weixin.qq.com/s/LSIi2P6FKnJ0GTodaTUGKw)**

Rust 是 Javascript 基础设施的未来，它是一种更加**内存安全**的语言，由 Mozilla 创建。

通过以下两种方式，Rust 可直接被 Javascript 以模块的方式直接调用。而不用像 ESBuild 那样通过子进程(fork/exec)的方式被 Javascript 调用。

1. NAPI，`napi-rs` 可将 Rust 编译为 Node.js 的 add-on，提供一个二进制文件直接给 Node.js 使用。(使用 C++ 写的话，需要 `node-gyp` 编译较为麻烦)
1. WebAssembly，可将 Rust 编译为 `wasm` 供浏览器和 Node.js 使用，尽管性能没有原生好，但是比 JS 还是要强不少

Rust 和 SWC(基于 Rust 用以 Javascript 的基础设施工具) 目前正逐步替代压缩（Terser）、编译（Babel）、格式化（Prettier）、打包（webpack）、linting（ESLint）等多种前端基础设施场景。并可以获得可扩展性（Extensibility）和性能 (Performance) 的巨大提升。

## 开源与库

### **一、 [gpu.js: 加速你的 Javascript 运算性能](https://github.com/gpujs/gpu.js)**

借助于 WebGL，在 GPU 下进行 Javascript 计算，提升性能。

```js
const { GPU } = require("gpu.js");
const gpu = new GPU();
const multiplyMatrix = gpu
  .createKernel(function (a, b) {
    let sum = 0;
    for (let i = 0; i < 512; i++) {
      sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
  })
  .setOutput([512, 512]);

const c = multiplyMatrix(a, b);
```

- [repo: gpujs/gpu.js](https://github.com/gpujs/gpu.js)
- [npm: gpu.js](https://npm.devtool.tech/gpu.js)

### **二、 [react-location: 另外一个 React 路由库](https://react-location.tanstack.com/)**

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9e7957272ea4a718045b3e647502e0b~tplv-k3u1fbpfcp-watermark.image?)

```js
import { ReactLocation, Router } from "react-location";

const reactLocation = new ReactLocation();

return (
  <Router
    location={reactLocation}
    routes={[
      {
        path: "/",
        element: "Home on the range!",
      },
    ]}
  />
);
```

另外一个 React 路由的库，你是不已经忍受不了 React Router 经常升级了？

- [repo: tannerlinsley/react-location](https://github.com/tannerlinsley/react-location)
- [npm: react-location](https://npm.devtool.tech/react-location)
