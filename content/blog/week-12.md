---
title: "第 12 期: Next.js 11 发布，图片性能优化加强"
date: 2021-06-18T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅 Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA3MzU0MjIzMA==&action=getalbum&album_id=1761820812803620868&scene=21#wechat_redirect)

- npm prepare 可在 npm install 之后做一些准备工作
- 在浏览器控制台网络面板中，使用 <status-code: 400> 可快速找到相关响应状态码的请求
- Next.js 11 发布

## 开发利器

### **一、 [Learn CSS](https://web.dev/learn/css/)**

![css-inheritance](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210604/css-inheritance.783ue8vlm1c0.png)

谷歌官方出品的 CSS 核心技能构建，浅显易懂，易于上手。

每一章节都伴随有可编辑的 DEMO 可供学习，并提供题目测试你的学习成果。

### **二、 [The CanIUse Embed](https://caniuse.bitsofco.de/)**

![](https://res.cloudinary.com/ireaderinokun/image/upload/v1623761215505/caniuse-embed/all/once-event-listener.webp)

把 CanIUse 通过 Frame/Image 格式嵌入到博客中的一个工具。

## 文章推荐

### **一、 [Natively Format JavaScript Dates and Times](https://elijahmanor.com/blog/format-js-dates-and-times)**

![格式化](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210604/image.2t992g3c80g0.png)

借助于 Date.prototype.toLocaleDateString() 可以做一些格式化的事情，他有以下参数

- weekday - "narrow", "short", "long"
- year - "numeric", "2-digit"
- month - "numeric", "2-digit", "narrow", "short", "long"
- day - "numeric", "2-digit"

## 开源与库

### **一、 [create-node-cli: 创建 Node 命令行工具的命令行工具](https://nodecli.com/)**

`create-node-cli` 基于 `meow`、`chalk` 等可交互式地创建一个命令行工具模板。

```bash
# Recommended.
$ npx create-node-cli

# Usage
# Run the CLI using
$ npx create-node-cli

CLI name?
CLI command?
CLI description?
CLI version?
CLI license?
CLI author name?
CLI author email?
```

- [npm: create-node-cli](https://npm.devtool.tech/create-node-cli)

## 版本发布

### **一、 [Next.js 11 发布](https://nextjs.org/blog/next-11#nextjs-live-preview-release)**

![nextjs11 发布](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210604/nextjs11.ddst9qs8rn4.png)

Next.js 11 发布，默认支持 webpack5，针对 Script、Image 上做了进一步加载性能优化。并且发布了新产品 Next.js Live，可在浏览器中运行 Next.js。
