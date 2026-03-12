---
title: "前端周刊 #1：TypeScript 4.2 正式发布"
description: "TypeScript 4.2 发布、前端优秀实践指南、pnpm 包管理器推荐、Github 首页性能优化等"
pubDate: 2021-03-01
---

## 技术文章

### [前端优秀实践不完全指南](https://juejin.cn/post/6932647134944886797)

本文其实应该叫做 **Web 用户体验设计提升指南**。本文罗列的经验大都是在实际开发过程中常会遇到的问题及大厂中变态的细节优化要求，非常有用，受益匪浅！包括图片加载失败处理、异常比例图片展示、系统默认字体优先加载、A11Y 体验优化等。

### [为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://juejin.cn/post/6932046455733485575)

它由 npm/yarn 衍生而来，但是比 npm/yarn 更快，安全性更高，也更好地支持 monorepo。

### [Github 新首页是如何变得更快的](https://github.blog/2021-01-29-making-githubs-new-homepage-fast-and-performant/)

看惯了教科书式的性能优化方案，来看看这些非教科书式的性能优化方案吧。Github 使用 IntersectionObserver 等技术大幅提升了首页性能表现。

## 工具推荐

### [multiavatar: 自动生成多元化头像](https://multiavatar.com/)

可根据名称自动生成多元化的头像，适合用于用户默认头像生成场景。

### [popperjs: 轻量可定制化的 Tooltip 工具库](https://popper.js.org/)

仅仅只有 3KB 大小，无任何依赖的轻量级 tooltip 工具库，支持 TS，非常流行，每个月有 3500 万次下载。

### [pnpm: 更快、占用空间更小的包管理器](https://github.com/pnpm/pnpm)

使用 npm、yarn 及 pnpm 下载 React 时的 Benchmark，pnpm 比其它包管理工具要快两倍。从数据中也可以看出 npm v7 性能比 yarn 有更好的表现。

## 版本发布

### [TypeScript 4.2 正式发布](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/)

TS 作为附有类型的 JS 超集，正式发布了 4.2 版本，其中包含了更加智能的别名等新特性。

```ts
export type BasicPrimitive = number | string | boolean;

// Return: BasicPrimitive | undefined
export function doStuff(value: BasicPrimitive) {
  if (Math.random() < 0.5) {
    return undefined;
  }

  return value;
}
```
