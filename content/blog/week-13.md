---
title: "第 13 期: Next.js 12 发布，使用 Rust 写的编译器替换 Babel"
date: 2021-10-30T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

+ 订阅网站: <https://weekly.shanyue.tech>
+ 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
+ [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA3MzU0MjIzMA==&action=getalbum&album_id=1761820812803620868&scene=21#wechat_redirect)



## 一句话

+ Next.js 12 发布
+ 字节跳动 modernjs.dev 发布

## 开发利器


### **一、 [tailwind play: 实时编辑测试并学习 TailwindCSS 的编辑器](https://play.tailwindcss.com/)**

![tailwindcss play](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210619/image.3cx7ho85e9w0.png)

在 TailWind Play 中，你可以编辑 tailwindcss 代码，并实时查看效果。在其中，你可以编辑 tailwindcss 配置，同时，你还可以把代码生成唯一地址进行分享。

TailWind Play 使得学习 tailwindcss 的成本变得很低，如果你久闻 tailwindcss 大名却还没有使用过它，可以在上边试一试





    

### **二、 [微图: 纯前端压缩你的图片资源](https://devtool.tech/tiny-image)**

![tiny-image](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/tiny-image.2zcfl0afv0q0.png)

不限图片大小，不限图片数量，并可转化我 webp/avif 的图片压缩工具。





    

### **三、 [AVPress: 纯网页端压缩你的视频资源](https://avpress.zaps.dev/)**

![AVPRESS](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/20210619/avpress.1gq0akmtzwzk.png)

使用 WASM 在纯前端，而非依赖后端接口去压缩视频资源。





    

## 文章推荐


### **一、 [谈谈我这些年对前端框架的理解](https://mp.weixin.qq.com/s/mZ7KuFjyCWNCAq7HnXg96A)**

技术从出现到完善到连带的周边生态的完善是一个轮回，从最开始服务端渲染，到了后来的客户端渲染，然后出现了逻辑层的组件方案，最后又要基于组件方案重新实现服务端渲染。

其实物理层的东西一直都没变，只是逻辑层不断的一层添加又一层，目的都是为了提高生产效率，降低开发成本，保证质量，这也是技术发展的趋势。"





    

### **二、 [Javascript 是如何在 v8 中执行的](https://juejin.cn/post/6844903990073753613)**

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec43aed2172~tplv-t2oaga2asx-watermark.awebp)

字节码是机器码的抽象。如果字节码的设计与物理 CPU 的计算模型相同，那么将字节码编译成机器代码就会更加容易。这就是为什么解释器通常是寄存器或堆栈机器。Ignition 是一个带有累加器的寄存器。





    

### **三、 [现代化 Web 关于 HTTP 缓存新的标准](https://httptoolkit.tech/blog/status-targeted-caching-headers/)**

![cache-status](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/cache-status.54usyd12g4w0.png)

现代化 Web 关于 HTTP 缓存新的标准，两个响应头

1. Cache-Status
2. [Target]-Cache-Control

可以更容易地配置源服务器到客户端中间各级中间代理服务器的缓存控制





    

## 代码片段



## 开源与库


### **一、 [React Hot Toast: 有可能是 React 中最好用的提示框组件](https://react-hot-toast.com/)**

![React 中的提示框](https://cdn.jsdelivr.net/gh/timolins/react-hot-toast@main/assets/header.svg)

是山月认为比较好用的提示框组件，拥有以下特点。体积小、支持 hooks

+ 🔥 Hot by default
+ 🔩 Easily Customizable
+ ⏳ Promise API - Automatic loader from a promise
+ 🕊 Lightweight - less than 5kb including styles
+ ✅ Accessible
+ 🤯 Headless Hooks - Create your own with useToaster() 

对于其中支持 Promise 的特性，在实际使用过程中十分好用

``` js 
const fetchUser = getUser(10086)
toast.promise(fetchUser,
  {
    success: '该用户信息获取成功',
    error: '该用户信息获取失败',
    loading: '正在获取该用户信息'
  },
  {
    style: {
      minwidth: '250px',
    },
    success: {
      duration: 5000,
      icon: '🔥',
    },
  }
)
```



+ [npm: react-hot-toast](https://npm.devtool.tech/react-hot-toast)

    

### **二、 React Tracking: React 如何设计一个打点并优秀的 API**

`React-Tracking` 是 React 中一个关于打点的库，目前在 Github 拥有1K+颗星星。

第一步: 在 React 根组件中，使 `React-Tracking` 位于最顶层，进行全局统一配置，可在这一步与专业打点服务进行对接，如谷歌统计、百度统计、神策统计等。如果你们的打点服务是自研的，也完全可以使用它。

在 `React-Tracking` 中，使用 `dispatch` 函数与专业打点服务进行对接。

``` js
const TrackedApp = track(
  // 全局打点数据
  { app: "my-app" },

  // 全局配置
  {
    // dataLayper 为谷歌统计的 API，可在此处与专业打点服务进行对接。
    dispatch: data => {
      console.log(data);
      (window.dataLayer = window.dataLayer || []).push(data);
    }
  }
)(App);

const rootElement = document.getElementById("root");
ReactDOM.render(<TrackedApp />, rootElement);
```

第二部：在 React 函数式组件中，使用 `useTracking` 进行打点统计

``` js
import { useTracking } from 'react-tracking';

const FooPage = () => {
  const { Track, trackEvent } = useTracking({ page: 'FooPage' });

  return (
    <Track>
      <div
        onClick={() => {
          trackEvent({ action: 'click' });
        }}
      />
    </Track>
  );
}
```

有兴趣的同学，可点击该链接进行尝试。[React-Tracking Example](https://codesandbox.io/s/reacttracking-example-qk30j4x1zj?file=/src/index.js)





    

### **三、 [html2canvas: 如何把 HTML 转化为图片](https://html2canvas.hertzen.com/)**

![html2canvas](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/image.74taknc07r00.png)

海报、截屏、水印，这些常见的业务需求都离不开一个库，那就是 `html2canvas`。把 DOM 转化为 Canvas，仅仅需要一个 API。

``` js
const canvas = await html2canvas(document.querySelector("#capture"))
```

[那你知道 DOM 转为图片的原理是什么吗？](https://github.com/shfshanyue/Daily-Question/issues/437)

大概是基于以下链条

1. DOM -> foreignObject -> SVG -> Canvas -> JPEG/PNG

如果要实现相同的功能，还可以使用以前介绍过的另外一个库。

+ [dom-to-image](https://github.com/tsayen/dom-to-image): Generates an image from a DOM node using HTML5 canvas





    

## 版本发布


### **一、 [Next.js 12 发布](https://nextjs.org/blog/next-12)**

+ Rust Compiler: ~3x faster Fast Refresh and ~5x faster builds
+ Middleware (beta): Enabling full flexibility in Next.js with code over configuration
+ React 18 Support: Native Next.js APIs are now supported, as well as Suspense
+ <Image /> AVIF Support: Opt-in for 20% smaller images
+ Bot-aware ISR Fallback: Optimized SEO for web crawlers
+ Native ES Modules Support: Aligning with the standardized module system
+ URL Imports (alpha): Import packages from any URL, no installs required
+ React Server Components (alpha): Try it today, including SSR streaming





    
