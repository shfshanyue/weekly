---
title: "在 nodejs 中原生使用 Fetch API"
date: 2022-03-11T00:00:00.000Z
release: 20
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 文章推荐

### 一、 [在 nodejs 中原生使用 Fetch API](https://fusebit.io/blog/node-fetch)

undici 是一个新的性能更强，延时更小，吞吐更高的 node http client，目前最新版 nodejs (17.5.0) 将 undici 作为它的依赖(可见源码 deps 目录)，并借助于它可在 nodejs 中直接使用 Fetch API

### 二、 [Web端短视频编辑器的设计与实现 - 像做PPT一样做视频](https://mp.weixin.qq.com/s/WngZd7BR6PgZRoI5guA4ow)

![音视频的处理和渲染](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3399ab4fb5374a12b08772587da69a08~tplv-k3u1fbpfcp-watermark.image?)

目前，浏览器已经拥有了关于音视频处理的诸多能力，如:

1. WebGL
2. WebCodecs
3. FFmpeg、WebAssembly

因此在Web端的音视频编辑器是可以实现的，在未来，编辑器会有更多机会和优化空间，可以真正实现像做PPT一样做视频。

### 三、 [防御性设计和开发](https://mp.weixin.qq.com/s/G4pME9xFHdWnFckgytnofQ)

本文从代码(Javscript、CSS)及 UI 两个纬度列举了前端所需要进行的防御点，并列出一些检查工具与一份相关的前端 Code Review 清单。

如关于白屏的防御:

1. 白屏监控
2. 资源加载失败重试
3. Service Worker的资源fallback机制
4. 模块都包装了error boundary
5. 兼容性探测和提示
6. 白屏提示信息

## 开源与库

### 一、 [SWR，用于数据请求的 React Hooks 库](https://swr.vercel.app/zh-CN)

“SWR” 这个名字来自于 stale-while-revalidate：一种由 HTTP RFC 5861 推广的 HTTP 缓存失效策略。

这种策略首先从缓存中返回数据（过期的），同时发送 fetch 请求（重新验证），最后得到最新数据。

- [repo: vercel/swr](https://github.com/vercel/swr)
- [npm: swc](https://npm.devtool.tech/swc)

## 开发利器

### 一、 [2021 Javascript 使用状况年度报告](https://2021.stateofjs.com/en-US/libraries)

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-02-20/clipboard-7808.543531.webp)

2021 Javascript 框架、构建工具、移动开发等工具 SABC 推荐图。

### 二、 [Apifox, 团队 API 管理利器](https://www.apifox.cn/?utm_source=shanyue-blog)

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-02-28/clipboard-9369.948f4d.webp)

API 文档、API 调试、API Mock、API 自动化测试。目前拥有桌面版与 WEB 版，对于团队管理 API 及其友好。
