---
title: 前端重大发版记录
---



### **1、 [esbuild v0.9.0](https://github.com/evanw/esbuild/releases/tag/v0.9.0)**

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




    

### **2、 [pixi.js v6.0.0](https://github.com/pixijs/pixi.js/releases/tag/v6.0.0)**

pixi.js 是一个使用 WebGL 渲染的轻量2D库，在 Github 已有 32.1K Star



    

### **3、 [Electron 12.0.0](https://www.electronjs.org/blog/electron-12-0)**

Electron 升级了相关依赖: Chromium 89, V8 8.9 以及 Node.js 14.16.



    

### **4、 [Deno 1.8 Release](https://deno.land/posts/v1.8)**

Deno 1.8 在 2021.03.02 发布，主要有以下更新:

+ WebGPU API 的实验性功能支持
+ 内置国际化 API 的启用
+ 改进覆盖率工具
+ import-map 支持: 标准的 ESM 的 import-map 支持 (同时 chrome89 也已支持 import-map)
+ 支持引入私有模块：使用 token 从私有服务器上引入远程模块




    

### **5、 [What's new in Flutter 2.0](https://medium.com/flutter/whats-new-in-flutter-2-0-fe8e95ecc65)**

![Fulter APP](./assets/flutter-app.gif)

Flutter 2.0 在 2021.03.04 发布，语法层面加入了 `Null Safety`。Flutter 的 web 支持已经从beta版过渡到稳定版，Desktop 在 beta 版。

> Flutter web and Null Safety move to stable, Flutter desktop moves to beta and so much more!




    

### **6、 [New in Chrome 89](https://developer.chrome.com/blog/new-in-chrome-89/)**

在 Chrome89 中已支持 `top level await` 和 `import-map`(esm)




    

### **7、 [Gatsby 3.0 Released](https://www.gatsbyjs.com/blog/gatsby-v3/)**

Gatsby 是一款致力于现代化 web 前端开发的 React 框架，也是构建博客的极佳选择。

Gatsby 3.0 在 2021.03.01 发布，拥有比之前快 80% 的开发速度及更高的网站性能。

Gatsby 3.0 升级了相关依赖，Webpack 5, Node 12, React 17 与 GraphQL 15。Node 12 马上过了维护期，同时建议读者也进行升级一下。

开发速度体验的提升得益于 webpck 5 的升级，而网站性能的提升得益于图片的优化。

Gatsby 3.0 使用 [gatsby-plugin-image](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/) 对图片进行优化堪称网站图片的最佳实践，类似于 `next/image`。

其中，`StaticImage` 致力于本地图片的优化，`GatsbyImage` 组件致力于远程图片的优化。




    

### **8、 [Typescript 4.2 正式发布](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/)**

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




    
