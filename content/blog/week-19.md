---
title: "2021 前端领域总结"
date: 2022-01-17T00:00:00.000Z
release: 19
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 文章推荐

### 一、 [2021 CSS 使用状况年度报告](https://2021.stateofcss.com/zh-Hans/about)

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-20/clipboard-7046.5730a3.webp)

关于 2021 年的 CSS 使用状况调查报告。

- [跳转译文](https://juejin.cn/post/7043577751344775176)

### 二、 [2021 Javascript 使用趋势](https://juejin.cn/post/7045150888171667492)

1. 平均(中位数)每个 PC 页面会加载 **463kb** 的 Javascript 资源
1. 平均(中位数)每个 PC 页面回加载 **21** 条 Javascript 资源请求
1. 平均(中位数)总加载的 JavaScript 资源中未使用的占到了 **36.2%**
1. 63.9% 的移动页面使用了具有已知安全漏洞的 JavaScript 库和框架

- [跳转译文](https://almanac.httparchive.org/en/2021/javascript)

### 三、 [2021 CSS 使用趋势](https://juejin.cn/post/7039547479997546533)

undefined

- [跳转译文](https://almanac.httparchive.org/en/2021/css

1. 平均(中位数)每个 PC 页面会加载 **71kb** 的 CSS 资源 1. 最常见的 class 为 `.active` 1. 最常见的 id 为 `#content`)

### 四、 [2021 年在 Web 领域有哪些关键进展？](https://mp.weixin.qq.com/s/frlfZ9iRNyAMMN_m1rS8Zw)

W3C 领域在 2021 的一些发展列举如下

1. 小程序
2. 音频 - Web Audio 1.0
3. Web 文本编辑 - 虚拟键盘API
4. 机器学习 - Web 神经网络 API
5. WebRTC - Encoded Transform
6. 浏览器自动化测试 - WebDriver API 2.0
7. 身份认证 - WebAuthn Level 3
8. Web支付 - Payment Request API
9. 分散式标识符 - DID 标准
10. Web字体 - 增量字体传输

## 开源与库

### 一、 [Tauri 新一代桌面开发方式](https://tauri.studio/)

Tauri 是一个使用 Web 技术构建桌面应用程序的解决方案，后续将会支持 Android/IOS。

与 Electron 相比，它是用 Rust 编写的，它并不依赖于 `Chromium`，也不依赖于 `Node` 与 `v8`。

- [repo: tauri-apps/tauri](https://github.com/tauri-apps/tauri)
- [npm: @tauri-apps/cli](https://npm.devtool.tech/@tauri-apps/cli)

### 二、 [zustand: 极易上手的 React 状态管理器](https://zustand-demo.pmnd.rs/)

超简单、超好用的 React 状态管理器。

1. 无需 Context Provider 包裹组件，使用简单方便
1. 主要使用 hooks 消费应用状态
1. 代码简洁，方便，即可几行即可管理全局状态

```js
import create from "zustand";

const useStore = create((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

function Controls() {
  const inc = useStore((state) => state.inc);
  return <button onClick={inc}>one up</button>;
}

function Counter() {
  const count = useStore((state) => state.count);
  return <h1>{count}</h1>;
}
```

- [repo: pmndrs/zustand](https://github.com/pmndrs/zustand)
- [npm: zustand](https://npm.devtool.tech/zustand)

### 三、 [更快的 SSG 静态网站生成器](https://astro.build/)

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-17/clipboard-5427.b76d17.webp)

超快的、体积超小的网站构建器。

- [repo: withastro/astro](https://github.com/withastro/astro)
- [npm: astro](https://npm.devtool.tech/astro)

## 开发利器

### 一、 [2021 年 Javascript 明星项目](https://risingstars.js.org/2021/zh)

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-17/clipboard-9401.5bcc50.webp)

关于 2021 年前端领域的明星项目。

它会从前端框架、构建工具、生态圈等维度了解其最受欢迎的项目。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-17/clipboard-0424.acd2a0.webp)

值得关注的几个项目有:

1. zx，谷歌出的一个命令行脚本工具
1. tauri，一个新的桌面开发方式
1. zustand，一个小巧的 React 状态管理库

### 二、 [HTTP Archive 年度报告](https://almanac.httparchive.org/zh-CN/2021/)

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2022-01-17/clipboard-7755.23a174.webp)

HTTP Archive 会周期性爬取头部网站，并分析其资源的信息，这是一个关于其资源、性能的统计图表的一个网站。
