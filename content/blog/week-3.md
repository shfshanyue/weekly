---
title: "第 3 期: 各大公司 webpack5 实践"
date: 2021-03-15T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅 Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA3MzU0MjIzMA==&action=getalbum&album_id=1761820812803620868&scene=21#wechat_redirect)

## 封面

![祁连山国家公园青海片区拍摄到的荒漠猫](./assets/huangyuanmao.jpg)

祁连山国家公园青海片区拍摄到的荒漠猫

- `Flutter` 将成为未来构建 Ubuntu App 的默认选择。[原文:Ubuntu Makes Flutter ‘Default Choice’ for Future Desktop Apps](https://www.omgubuntu.co.uk/2021/03/ubuntu-building-apps-with-flutter-in-future)
- `flexbox` 布局时可使用 CSS 属性 `gap` 控制 item 间隙
- `npm outdated` 可查看当前项目中的过期 Package
- 2021 春运全国铁路、公路、水路、民航共发送旅客预计达到 8.7 亿人次，比 2019 年同期下降 70.9%，比 2020 年同期下降 40.8%。
- 北京市文旅局推出 12 条赏花游主题线路，有迎春、玉兰、桃花、梅花、杏花等，详见 [北京的春天去哪里看花？](https://news.163.com/21/0308/10/G4IDG92C00019K82.html)
- 微信 Mac 桌面版开始支持朋友圈

## 开发利器

### **一、 [bestofjs: 发现 Javascript 最好的框架与库](https://bestofjs.org/)**

这里有 JS 生态最流行的库，实时刷新并推荐，并且可每周订阅

- [repo: ritz078/transform](https://github.com/ritz078/transform)

### **二、 [Lorem Picsum: 随机一张指定尺寸图片 API](https://picsum.photos/)**

![](./assets/picsum.png)

`https://picsum.photos/200/200` 将随机从 Unsplash 取一张指定尺寸的图片

- [repo: DMarby/picsum-photos](https://github.com/DMarby/picsum-photos)

### **三、 [risingstars: 2020 年 Javascript 明星项目](https://risingstars.js.org/2020/zh)**

2021 年，JS 各个生态圈中最流行的框架及周边产物，如 React 生态圈、Vue 生态圈、GraphQL 生态圈、构建工具生态圈等

### **四、 [User Agents: 关于 UA 的一切](https://user-agents.net/)**

![User Agents](./assets/ua.png)

拥有大量 UA 的数据库及相关功能

- 可获取任意平台的 UA (Mac/Windows/Android)
- 可获取任意 Spider/Crawer 的 UA (Baidu/Google/Bing)
- 可随机生成 UA
- 可解析 UA

### **五、 [Browser Logos: 浏览器高清分辨率 Logo](https://github.com/alrra/browser-logos)**

![browser-logos](https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/browser-logos.gif)

这是 Github 的一个仓库，你可以直接引用地址，找到任意浏览器高清分辨率的 Logo。

如果引用 Github 地址比较慢的话，你可以试试 jsdelivr 的 [CDN](https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/chrome/chrome_64x64.png)

## 文章推荐

### **一、 [作者尤雨溪视频直播下一代前端构建工具 Vite 讲解 （中英双语字幕，B 站可看）](https://juejin.cn/post/6937176680251424775)**

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae725a4f58dc4b81884d842e62b9c42d~tplv-k3u1fbpfcp-watermark.image)

Vite 一个部分是基于 ESM 的利用 esbuild 的开发服务器，另一个部分是基于 Rollup 的配置化的打包器。视频中尤大将使用一个 Demo 进行演示，并讲解关于它的哲学思考。

视频已被热心小哥制作成双语字幕视频，并上传到了 B 站。

### **二、 [字节商业变现团队 webpack5 业务实践](https://juejin.cn/post/6924258563862822919)**

1. FilesystemCache: 更快的二次构建
1. Prepack: 更早的编译期计算，更小的体积
1. Asset Modules: 资源加载内置
1. Named ChunkID: 更强的永久缓存能力
1. 深度 TreeShaking 能力
1. 内置 Worker/WASM 构建能力
1. Node Polyfill 去除，如 crypto、querystring 等

总结下来更快的打包速度、更小的打包体积

### **三、 [腾讯企鹅辅导 webpack5 升级实践](https://mp.weixin.qq.com/s/P3foOrcu4StJDGdX9xavng)**

1. Module Federation: 多应用共享依赖打包，扔到 CDN 共享

与上边字节差不多，总结下来更快的打包速度、更小的打包体积。但是好在给出了数据

第一次打包

| webpack 版本 | 第一次 build 时间 | 第二次 build 时间 | 第三次 build 时间 |
| ------------ | ----------------- | ----------------- | ----------------- |
| v4           | 19.6s             | 6.8s              | 7.4s              |
| v5           | 14.8s             | 1.6s              | 1.5s              |

修改源码后，再次打包

| webpack 版本 | 第一次 build 时间 | 第二次 build 时间 | 第三次 build 时间 |
| ------------ | ----------------- | ----------------- | ----------------- |
| v4           | 10.5s             | 7.3s              | 6.8s              |
| v5           | 4.0s              | 1.5s              | 1.6s              |

打包大小对比

| webpack 版本 | build 产生的文件的大小 |
| ------------ | ---------------------- |
| v4           | 2.16M                  |
| v5           | 2.05M                  |

### **四、 [All in one：项目级 monorepo 策略最佳实践](https://juejin.cn/post/6924854598268108807)**

![](./assets/babel-mono.png)

目前 monorepo 已成为了 npm7、yarn 的标准功能，未来会有更多的 project/package 通过 monorepo 的方式维护，许多公共库如 babel、react 也通过 monorepo 维护。

通过 monorepo 可以更好地管理多 Pakcage 依赖，复用配置及公共的 devDep 等，现在快来学习吧。

### **五、 [一文详解 CSS in JS](https://mp.weixin.qq.com/s/v0IB2mZHrF0l2ks5pVsO1g)**

关于 CSS in JS 的历史

## 开源与库

### **一、 [bytemd: 字节出品 Markdown 编辑器](https://bytemd.netlify.app/)**

![bytemd 外观](./assets/bytemd.png)

字节出品的 Markdown 编辑器，由 Svelte 构建，同时支持 React/Vue 组件等，支持公式(math)、脚注(footnote)、流程图(mermaid)等复杂富文本内容。另外，掘金社区的编辑器也是基于此构建

bytemd 基于最流行的 Markdown 解析器 `remark`与 最受欢迎的便捷器 `codemirror`，基于流行库，拥有更强的扩展能力，你很容易扩展 Plugin，如微信脚注、多样主题等

- [npm: bytemd](https://npm.devtool.tech/bytemd)

### **二、 [nodegui: 使用前端开发跨端桌面应用](https://docs.nodegui.org/)**

![](./assets/nodegui.png)

使用前端技术基于 QT5 的桌面跨端解决方案，可以使用 React/Vue/Svelte 框架来开发跨端应用

- [repo: nodegui/nodegui](https://github.com/nodegui/nodegui)
- [npm: @nodegui/nodegui](https://npm.devtool.tech/@nodegui/nodegui)

### **三、 [docusaurus: facebook 出品文档化工具](https://v2.docusaurus.io/)**

![](./assets/docusaurus.png)

facebook 出品的文档化工具，在 Github 已经有两万颗星星，基于 React 可轻松扩展页面，定制能力较强。

- [repo: facebook/docusaurus](https://github.com/facebook/docusaurus)
- [npm: docusaurus](https://npm.devtool.tech/docusaurus)

### **四、 [tinyhttp: 一个用以替代 express 的轻量 web 框架](https://tinyhttp.v1rtl.site/)**

tinyhttp 创建于九个月前，还是一代很年轻的 http 框架，因为没有任何历史包袱，同时支持 TS，并打包成原生 ESM。它有诸多优点

1. 比 Express 快两倍
1. 支持 Express 的所有中间件
1. 没有历史包袱，支持 ESM 与 TS
1. 预定常见中间件，如 logger、router 等

tinyhttp 能不能替代 express，让我们拭目以待吧 (应该不能)

- [repo: talentlessguy/tinyhttp](https://github.com/talentlessguy/tinyhttp)
- [npm: tinyhttp](https://npm.devtool.tech/tinyhttp)

### **五、 [isbot: 判断请求是否一个机器人](https://isbot.js.org/)**

能够有效识别蜘蛛、爬虫等，但不能识别伪装 UA 恶意爬取数据的机器人

- [repo: omrilotan/isbot](https://github.com/omrilotan/isbot)
- [npm: isbot](https://npm.devtool.tech/isbot)

## 版本发布

### **一、 [esbuild v0.9.0](https://github.com/evanw/esbuild/releases/tag/v0.9.0)**

支持 package.json 中 exports 字段的支持

```json
{
  "name": "your-pkg",
  "exports": {
    "import": "./imported.mjs",
    "require": "./required.cjs"
  }
}
```
