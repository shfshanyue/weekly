---
title: "第 14 期: 现代 web 开发困局"
date: 2021-11-05T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅 Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA3MzU0MjIzMA==&action=getalbum&album_id=1761820812803620868&scene=21#wechat_redirect)

## 开发利器

### **一、 [微图床](https://devtool.tech/gallery)**

undefined

### **二、 [hasty](https://hasty.dev/)**

undefined

## 文章推荐

### **一、 [现代 web 开发困局](https://juejin.cn/post/7025868886914400293)**

undefined

### **二、 [coa 和 依赖锁定](https://mp.weixin.qq.com/s?src=11&timestamp=1636378040&ver=3424&signature=yQmx-VEh991eTxqSOugoPwP5FQlqAe0zhiTyxYxxP9WSO8MjKW5-3lIgAv-tpu-5JJUWVboL7HtAMmPnWa49Zs8I6pnxajE1WwUB2kgHpMtRQL0bSrj8*splg7lVFYb0&new=1)**

undefined

## 开源与库

### **一、 [npkill: 找出占用你磁盘体积最大的 node_module 并删掉](https://github.com/voidcosmos/npkill)**

![npkill 可列出所有 node_modules 体积](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-02/clipboard-6608.83d5b3.webp)

在 Javascript 的世界中，`node_modules` 的体积巨大，占用磁盘巨大，甚至导致笔记本空间不足，无法正常使用。

`npkill` 可帮你找出笔记本所有 `node_modules` 目录并计算出总体积，也可对 `node_modules` 按照其体积降序排列。

`npkill` 支持对列出的列表通过 `j`/`k` 进行上下移动，通过空格键删除其目录。

当然，你可以使用 `pnpm`/`yarn3` 来减小 `node_modules` 的占用体积。
