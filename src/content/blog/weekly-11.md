---
title: "前端周刊 #11：StackBlitz 发布新特性，可在浏览器中运行 Node 环境"
description: "StackBlitz 发布新特性，可在浏览器中运行 Node 环境"
pubDate: 2021-05-22
---

## 技术文章

### 一、 [Introducing WebContainers: Run Node.js natively in your browser](https://blog.stackblitz.com/posts/introducing-webcontainers/)

Stackblitz 发布了一款新产品: Web Container.

它借助于 WebAssembly 与新的 [capabilities APIs](https://web.dev/fugu-status/) 把虚拟的 Node 环境运行在了浏览器端。

## 工具推荐

### 一、 [clipboard-copy: 声明式复制到剪切板的轻量库](https://github.com/feross/clipboard-copy)

```js
const copy = require("clipboard-copy");

copy("hello, world");
```

在浏览器中，如何复制内容到剪贴板？

那就是使用 [clipboard-copy](https://npm.devtool.tech/clipboard-copy) 这个库，月下载量达百万，而大小仅仅只有 `508B`。

![clipboard-copy](/blog/weekly-11/clipboard.png)

与最为流行周下载量达几万的 [clipboard](https://npm.devtool.tech/clipboard) 而言，`clipboard-copy` 的代码更加简洁、声明式使用更加易懂，即使是源码也非常简单，仅仅只有几十行，建议阅读。

### 二、 [web-vitals: 核心性能指标监控](https://web.dev/vitals/#core-web-vitals)

核心性能指标监控


### 三、 [simple-keyboard: 一个关于虚拟键盘的组件](https://virtual-keyboard.js.org/)

![虚拟键盘](/blog/weekly-11/simple-keyboard.png)

你们的产品经理有没有要求你们写一个虚拟键盘，simple-keyboard 是一个使用纯JS实现无任何依赖的虚拟键盘组件，它支持以下功能

1. 支持 Vue、React、Svetle、Angular 等UI框架
2. 支持 CDN 脚本引入。
3. 支持多种主题配置


## 工具推荐

### 一、 [Lighthouse Metrics](https://lighthouse-metrics.com/)

基于 Lighthouse 的全球性的性能测试

### 二、 [devhints](https://devhints.io/)

CheatSheets 大全


### 三、 [HTML5 Text Editor](https://github.com/GoogleChromeLabs/text-editor)

基于 `File System Access API` 的文本编辑器


## 版本发布

