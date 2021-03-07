---
title: 前端优秀文章推送大汇总
---


### **1、 [十分钟教你用svg做出精美的动画！](https://juejin.cn/post/6930412294149472269)**
![](./assets/gsap.gif)
如何快速制作出精美的 SVG 动画？
第一步：找一个 SVG
第二步：分解 SVG 的 Path
第二步：使用 GSAP 库编程把 SVG 动起来

### **2、 [像大佬一样使用 Google 搜索](https://dev.to/denicmarko/google-like-a-pro-5cf6)**
`-` 减号排除关键字
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be345d239a07458c852dad96ab53355a~tplv-k3u1fbpfcp-zoom-1.image)
`""` 双引号精确搜索
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04149ac687714dd388ebef55427ee0ef~tplv-k3u1fbpfcp-zoom-1.image)

### **3、 [深入 ESM 图解](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)**
当前，在浏览器中通过 `<script type="module">` 已原生支持 ESM，你可以在 `vite` 或者 `snowpack` 中尝试一下
本文用图解的方式深入讲解了 ESM 的工作原理。
在平常工作中，使用 `import/export` 开发模块，此时会以入口节点为根节点呈现出一张依赖关系图:
![](./assets/esm-module-record.png)
浏览器会解析文件，根据 `import/export` 语句构成模块记录(`Module Record`)
![](./assets/esm-module-record-2.png)
一个 ESM 执行需要经过构建(Constructor)、实例化(Instantiation)和运行(Evaluation)三步
![](./assets/esm.png)

### **4、 [Github 新首页是如何变得更快的](https://github.blog/2021-01-29-making-githubs-new-homepage-fast-and-performant/)**
看惯了教科书式的性能优化方案，来看看这些非教科书式的性能优化方案吧
使用 IntersectionObserver 优化前后的性能对比
![Compare](./assets/github-compare.png)

### **5、 [为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://juejin.cn/post/6932046455733485575)**
它由 npm/yarn 衍生而来，但是比 npm/yarn 更快，安全性更高，也更好地支持 monorepo。

### **6、 [前端优秀实践不完全指南](https://juejin.cn/post/6932647134944886797)**
本文其实应该叫做 **Web 用户体验设计提升指南**。本文罗列的经验大都是在实际开发过程中常会遇到的问题及大厂中变态的细节优化要求，我已经来来回回翻了不下三遍，非常有用，受益匪浅！
1. 图片加载失败后如何处理？
1. 本应 1x1 展示的图片，设计给了 1x100 如何展示？
1. 如何让网站优先加载系统默认字体？
1. 如何做更好的 A11Y 体验优化?
![色彩度对比](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f86c3e1740e047df9848c93a9d02f868~tplv-k3u1fbpfcp-zoom-1.image)

