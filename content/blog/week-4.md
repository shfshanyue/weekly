---
title: "第 4 期: 使用 React 编写命令行工具"
date: 2021-03-22T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

+ 订阅网站: <https://weekly.shanyue.tech>
+ 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)


## 封面

![三星堆遗址新出土黄金面具](./assets/mianju.png)

考古工作者在三星堆遗址新发现6座三星堆文化祭祀坑，目前已出土金面具残片、巨青铜面具、青铜神树、象牙等重要文物500余件，图示为出土半边黄金面具。



## 一句话

+ `copy($var)` 在浏览器控制台可以直接复制变量数据
+ chrome 以前每隔六周一个版本迭代，今后将会加快迭代节奏，每隔四周发布一个新版本
+ `npm audit fix` 会自动修复有风险的 package
+ 我国科学家在一块形成于大约9900万年前的琥珀中发现昆虫新物种，科学家们称之为大角蝽
+ 2021年全国竞走锦标赛暨东京奥运会选拔赛女子20公里竞走比赛中，内蒙古队选手杨家玉以1小时23分49秒的成绩获得冠军并打破世界纪录

## 开发利器


### **一、 [Explain Shell: 图示任一命令行每个参数的释义](https://explainshell.com/)**

![explainshell](./assets/explainshell.png)

可称之为学习及书写 shell 的最佳辅助神器，输入任一 linux 命令，都会一一指出每个参数的释义，PIPE 嵌套且复杂的命令也可解析。





    

### **二、 [SVG Wave Generator](https://www.softr.io/tools/svg-wave-generator)**

![SVG 波浪形随机生成器](./assets/svg-creator.png)

随机生成一个波浪SVG，可调整锯齿、波折程度等，并可保存为 SVG/PNG/JPG





    

### **三、 [cssffects: 多种超实用 CSS 动画](https://emilkowalski.github.io/css-effects-snippets/)**

![](./assets/csseffects.png)

收集多种 CSS 动画，大部分是各种 hover 效果、loading 动画等，纯 CSS 实现。收藏以备独立设计网站时的不时之需。


+ [repo: emilkowalski/css-effects-snippets](https://github.com/emilkowalski/css-effects-snippets)


    

### **四、 [Chrome Platform Status: Chrome 发布版本新特性大览](https://www.chromestatus.com/features/schedule)**

![](./assets/chromestatus.png)

列举每一个 Chrome 的新特性大全，目前的稳定版本及下一个版本的发布日期等。





    

## 文章推荐


### **一、 [为什么你应该使用 Picture 来代替 Img 标签](https://blog.bitsrc.io/why-you-should-use-picture-tag-instead-of-img-tag-b9841e86bf8b)**

![](./assets/picture.jpg)

picture 标签拥有更好的分辨率切换与媒体查询，当小屏幕使用更小的图片益于性能优化，高分屏使用 2x 图片益于美术设计。

并且可支持书写多种图片格式，对最新的图片格式 avif/webp 提供回退方案，因此可采用最佳图片格式。此处与构建工具一同使用为最佳实践。

``` html
<picture>
  <source srcset="test.avif" type="image/avif">
  <source srcset="test.webp" type="image/webp">
  <img src="test.png" alt="test image">
</picture>
```




+ [跳转译文](https://juejin.cn/post/6923840549170446343)
    

### **二、 [webpack核心模块tapable用法解析](https://segmentfault.com/a/1190000039418800)**

Plugin 是 webpack 的核心功能之一，而它依赖于 tabpable 这个库，它为 Plugin 的实现提供了事件处理和流程控制多种多样的钩子。

它的核心原理是高级版的发布订阅模式，使用 `tap` 注册事件，使用 `call` 触发事件。

``` js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");
```





    

### **三、 [Flutter Web在美团外卖的实践](https://tech.meituan.com/2021/03/18/flutterweb-in-meituanwaimai.html)**

![](./assets/meituan-flutter.png)

Flutter 对 Web 的支持已经进入了 Stable 阶段，美团落地了 Flutter Web 并总结了相关经验。但是在 Web 端使用 Flutter 现阶段仍有许多不足，比如脆弱的 Web 生态及构建

+ Flutter 无法对文件进行 Hash 化，因此很难利用 Long Term Cache
+ Flutter 对打包文件很难进行拆包
+ Flutter 对资源上传 CDN 比较困难
+ Flutter Web 自身实现了一套页面滚动机制，页面滚动性能较差。

来这篇文章看看美团是怎么解决这些问题的吧，下图是美团的技术架构

![](./assets/meituan-flutter-arch.png)





    

### **四、 [v8 Heapsnapshot 文件解析](https://segmentfault.com/a/1190000039650874)**

![](./assets/heapdump.png)

结合 v8 源码看 heapsnashot 文件的数据结构，了解它非常有利于我们调试 Node 中的内存问题





    

## 代码片段


### **一、 如何给数组去重？**

`array-union` 虽是一个只有一行代码的库，但每个月有一亿次下载量，代码如下

``` js
const arrayUnion = (...arguments_) => [...new Set(arguments_.flat())];

arrayUnion(['🐱', '🦄'], ['🐻', '🦄'], ['🐶', '🌈', '🌈']);
//=> ['🐱', '🦄', '🐻', '🐶', '🌈']
```





    

### **二、 Array.prototype.flat: 数组扁平化**

``` js
const l = [1, 2, [3, 4]]

l.flat()
//=> [1, 2, 3, 4]
```





    

## 开源与库


### **一、 [tsdx: 零配置可快速开发 npm package 支持 typescript 的命令行工具](https://github.com/formium/tsdx)**

![](./assets/tsdx.gif)

零配置的可快速开发 Package 的命令行工具，开箱即用 Prettier、ESLint、Jest、Rollup、Publish 等繁琐配置化整为零，并可自动打包为 CJS、ESM、UMD 等多个格式而无需多余配置。

如果你开发 React 组件，还可选内置 Storybook 等，为开发新的 Package 造成了极大的便利。


+ [repo: https://tsdx.io/](https://tsdx.io/)
+ [npm: tsdx](https://npmjs.com/package/tsdx)

    

### **二、 [anime: 轻量高性能 javascript 动画引擎](https://animejs.com/)**

![](./assets/anime.png)

可快速地通过编程制作动画，包括而不限于 SVG、CSS、Keyframes 等。在前几期前端开发者周刊中，也曾介绍过另外一个动画引擎: `GSAP`。


+ [repo: juliangarnier/anime](https://github.com/juliangarnier/anime)
+ [npm: animejs](https://npmjs.com/package/animejs)

    

### **三、 [ink: 使用 React 编写命令行工具](https://github.com/vadimdemedes/ink)**

![](./assets/ink.svg)

``` jsx
import React, { useState, useEffect } from "react"
import { render, Text } from "ink"

const Counter = () => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((previousCounter) => previousCounter + 1)
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <Text color="green">{counter} tests passed</Text>
}

render(<Counter />)
```


+ [repo: vadimdemedes/ink](https://github.com/vadimdemedes/ink)
+ [npm: ink](https://npmjs.com/package/ink)

    

### **四、 [jsonld: JS 实现的 JSON-LD 处理器](https://json-ld.org/)**

JSON-LD 是带有 Link Data 的 JSON 数据格式，常见的 mongo 就是以 jsonld 组织数据。

``` js
{
  "@context": "https://json-ld.org/contexts/person.jsonld",
  "@id": "http://dbpedia.org/resource/John_Lennon",
  "name": "John Lennon",
  "born": "1940-10-09",
  "spouse": "http://dbpedia.org/resource/Cynthia_Lennon"
}
```





    

## 版本发布


### **一、 [v8 9.0 Release](https://v8.dev/blog/v8-release-90)**

v8 9.0 在三月十七号发布





    
