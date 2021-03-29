---
title: 前端重大发版记录
---



### **1、 [nodejs 15.12.0](https://github.com/nodejs/node/releases/tag/v15.12.0)**

+ crypto:
  + add optional callback to crypto.sign and crypto.verify (Filip Skokan)
  + support JWK objects in create*Key (Filip Skokan)
+ deps:
  + switch openssl to quictls/openssl (James M Snell)
  + update to cjs-module-lexer@1.1.0 (Guy Bedford)
+ fs:
  + improve fsPromises writeFile performance (Nitzan Uziely)
  + improve fsPromises readFile performance (Nitzan Uziely)
+ lib:
  + implement AbortSignal.abort() (James M Snell)
+ node-api:
  define version 8 (Gabriel Schulhof)
+ worker:
  add setEnvironmentData/getEnvironmentData (James M Snell)




    

### **2、 [webpack v5.28.0](https://github.com/webpack/webpack/releases/tag/v5.28.0)**

webpack v5.28.0 在 2021.03.24 发布，改进功能及修复 Bug 如下。

(webpack 在 Release 中对改进功能及修复 bug 并不指明 Issue)

1. add module.generator.asset.publicPath to configure a different publicPath for assets
1. fixes a watch mode caching problem which was introduced in 5.26.0 when using the unsafe cache
1. improve serialization performance




    

### **3、 [v8 9.0 Release](https://v8.dev/blog/v8-release-90)**

v8 9.0 在三月十七号发布




    

### **4、 [esbuild v0.9.0](https://github.com/evanw/esbuild/releases/tag/v0.9.0)**

支持 package.json 中 exports 字段的支持

``` json
{
  "name": "your-pkg",
  "exports": {
    "import": "./imported.mjs",
    "require": "./required.cjs"
  }
}
```




    

### **5、 [pixi.js v6.0.0](https://github.com/pixijs/pixi.js/releases/tag/v6.0.0)**

pixi.js 是一个使用 WebGL 渲染的轻量2D库，在 Github 已有 32.1K Star



    

### **6、 [Electron 12.0.0](https://www.electronjs.org/blog/electron-12-0)**

Electron 升级了相关依赖: Chromium 89, V8 8.9 以及 Node.js 14.16.



    

### **7、 [Deno 1.8 Release](https://deno.land/posts/v1.8)**

Deno 1.8 在 2021.03.02 发布，主要有以下更新:

+ WebGPU API 的实验性功能支持
+ 内置国际化 API 的启用
+ 改进覆盖率工具
+ import-map 支持: 标准的 ESM 的 import-map 支持 (同时 chrome89 也已支持 import-map)
+ 支持引入私有模块：使用 token 从私有服务器上引入远程模块




    

### **8、 [What's new in Flutter 2.0](https://medium.com/flutter/whats-new-in-flutter-2-0-fe8e95ecc65)**

![Fulter APP](./assets/flutter-app.gif)

Flutter 2.0 在 2021.03.04 发布，语法层面加入了 `Null Safety`。Flutter 的 web 支持已经从beta版过渡到稳定版，Desktop 在 beta 版。

> Flutter web and Null Safety move to stable, Flutter desktop moves to beta and so much more!




    

### **9、 [New in Chrome 89](https://developer.chrome.com/blog/new-in-chrome-89/)**

在 Chrome89 中已支持 `Top Level Await`，可在模块顶部直接直接使用 await，而无需置于 async 函数中

在 Chrome89 中开始支持 `import-map`(esm)

``` js
<script type="importmap">
{
  "imports": {
    "moment": "/node_modules/moment/src/moment.js",
    "lodash": "/node_modules/lodash-es/lodash.js"
  }
}
</script>
```

另外，在 Chrome89 中启用了三个与物联网的相关特性：WebHID, WebNFC, 与 Web Serial 




    

### **10、 [Gatsby 3.0 Released](https://www.gatsbyjs.com/blog/gatsby-v3/)**

Gatsby 是一款致力于现代化 web 前端开发的 React 框架，也是构建博客的极佳选择。

Gatsby 3.0 在 2021.03.01 发布，拥有比之前快 80% 的开发速度及更高的网站性能。

Gatsby 3.0 升级了相关依赖，Webpack 5, Node 12, React 17 与 GraphQL 15。Node 12 马上过了维护期，同时建议读者也进行升级一下。

开发速度体验的提升得益于 webpck 5 的升级，而网站性能的提升得益于图片的优化。

Gatsby 3.0 使用 [gatsby-plugin-image](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/) 对图片进行优化堪称网站图片的最佳实践，类似于 `next/image`。

其中，`StaticImage` 致力于固定URL图片的优化，`GatsbyImage` 组件致力于非固定URL图片的优化。




    

### **11、 [Typescript 4.2 正式发布](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/)**

TS 作为附有类型的 JS 超集，在周三(02.23)正式发布了 4.2 版本，其中包含了更加智能的别名等新特性，可在链接中打开，并在 Typescript Playground 中提供 DEMO 演示

``` ts
export type BasicPrimitive = number | string | boolean;

// Return: BasicPrimitive | undefined
export function doStuff(value: BasicPrimitive) {
  if (Math.random() < 0.5) {
    return undefined;
  }

  return value;
}
```




    
