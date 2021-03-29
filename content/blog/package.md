---
title: 前端有趣的库
---



### **1、 [storybook: 构建更健壮的 React/Anular/Vue UI 组件](https://storybook.js.org/)**

![](./assets/storybook.gif)

storybook 可以更高效地组织 React/Angular/Vue 的 UI 组件


+ [repo: storybookjs/storybook/](https://github.com/storybookjs/storybook/)

    

### **2、 [npm-check-updates: 把 package.json 中的依赖升级到最新版本](https://github.com/raineorshine/npm-check-updates)**

![](./assets/ncu.png)

npm-check-updates，npm outdated 的升级版本，可以控制把 package.json 中的依赖升级到最新版本

``` bash
$ ncu
Checking package.json
[====================] 5/5 100%

express           4.12.x  →   4.13.x
multer            ^0.1.8  →   ^1.0.1
react-bootstrap  ^0.22.6  →  ^0.24.0
react-a11y        ^0.1.1  →   ^0.2.6
webpack          ~1.9.10  →  ~1.10.5

Run ncu -u to upgrade package.json
```

如果希望安全地升级，可以使用 `ncu doctor --doctor`，每升级一个依赖之前都必须成功通过测试用例


+ [repo: raineorshine/npm-check-updates](https://github.com/raineorshine/npm-check-updates)
+ [npm: npm-check-updates](https://npmjs.com/package/npm-check-updates)
    

### **3、 [commitlint: Git Commit 格式化工具](https://commitlint.js.org/)**

![](./assets/commitlint.svg)


+ [repo: conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint)
+ [npm: @commitlint/cli](https://npmjs.com/package/@commitlint/cli)
    

### **4、 [Prettier: 代码格式化工具](https://prettier.io/)**

支持多种编程语言，如 html、css、js、graphql、markdown 等并且可与编辑器 (vscode) 深度集成的代码格式化工具

![支持多种编程语言](./assets/prettier-lang.png)

![支持多种编辑器](./assets/prettier-editor.png)


+ [repo: prettier/prettier](https://github.com/prettier/prettier)
+ [npm: prettier](https://npmjs.com/package/prettier)
    

### **5、 [jsonld: JS 实现的 JSON-LD 处理器](https://json-ld.org/)**

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




    

### **6、 [ink: 使用 React 编写命令行工具](https://github.com/vadimdemedes/ink)**

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
    

### **7、 [anime: 轻量高性能 javascript 动画引擎](https://animejs.com/)**

![](./assets/anime.png)

可快速地通过编程制作动画，包括而不限于 SVG、CSS、Keyframes 等。在前几期前端开发者周刊中，也曾介绍过另外一个动画引擎: `GSAP`。


+ [repo: juliangarnier/anime](https://github.com/juliangarnier/anime)
+ [npm: animejs](https://npmjs.com/package/animejs)
    

### **8、 [tsdx: 零配置可快速开发 npm package 支持 typescript 的命令行工具](https://tsdx.io/)**

![](./assets/tsdx.gif)

零配置的可快速开发 Package 的命令行工具，开箱即用 Prettier、ESLint、Jest、Rollup、Publish 等繁琐配置化整为零，并可自动打包为 CJS、ESM、UMD 等多个格式而无需多余配置。

如果你开发 React 组件，还可选内置 Storybook 等，为开发新的 Package 造成了极大的便利。

tsdx 为你开发一个 package 提供了开箱即用的最佳实践。

``` bash
# 使用 tsdx 快速开发一个 package
$ npx tsdx create mylib
```


+ [repo: formium/tsdx](https://github.com/formium/tsdx)
+ [npm: tsdx](https://npmjs.com/package/tsdx)
    

### **9、 [isbot: 判断请求是否一个机器人](https://isbot.js.org/)**

能够有效识别蜘蛛、爬虫等，但不能识别伪装 UA 恶意爬取数据的机器人


+ [repo: omrilotan/isbot](https://github.com/omrilotan/isbot)
+ [npm: isbot](https://npmjs.com/package/isbot)
    

### **10、 [tinyhttp: 一个用以替代express的轻量web框架](https://tinyhttp.v1rtl.site/)**

tinyhttp 创建于九个月前，还是一代很年轻的 http 框架，因为没有任何历史包袱，同时支持 TS，并打包成原生 ESM。它有诸多优点

1. 比 Express 快两倍
1. 支持 Express 的所有中间件
1. 没有历史包袱，支持 ESM 与 TS
1. 预定常见中间件，如 logger、router 等

tinyhttp 能不能替代 express，让我们拭目以待吧 (应该不能)


+ [repo: talentlessguy/tinyhttp](https://github.com/talentlessguy/tinyhttp)
+ [npm: tinyhttp](https://npmjs.com/package/tinyhttp)
    

### **11、 [docusaurus: facebook 出品文档化工具](https://v2.docusaurus.io/)**

![](./assets/docusaurus.png)

facebook 出品的文档化工具，在 Github 已经有两万颗星星，基于 React 可轻松扩展页面，定制能力较强。


+ [repo: facebook/docusaurus](https://github.com/facebook/docusaurus)
+ [npm: docusaurus](https://npmjs.com/package/docusaurus)
    

### **12、 [nodegui: 使用前端开发跨端桌面应用](https://docs.nodegui.org/)**

![](./assets/nodegui.png)

使用前端技术基于 QT5 的桌面跨端解决方案，可以使用 React/Vue/Svelte 框架来开发跨端应用


+ [repo: nodegui/nodegui](https://github.com/nodegui/nodegui)
+ [npm: @nodegui/nodegui](https://npmjs.com/package/@nodegui/nodegui)
    

### **13、 [bytemd: 字节出品 Markdown 编辑器](https://bytemd.netlify.app/)**

![bytemd 外观](./assets/bytemd.png)

字节出品的 Markdown 编辑器，由 Svelte 构建，同时支持 React/Vue 组件等，支持公式(math)、脚注(footnote)、流程图(mermaid)等复杂富文本内容。另外，掘金社区的编辑器也是基于此构建

bytemd 基于最流行的 Markdown 解析器 `remark`与 最受欢迎的便捷器 `codemirror`，基于流行库，拥有更强的扩展能力，你很容易扩展 Plugin，如微信脚注、多样主题等



+ [npm: bytemd](https://npmjs.com/package/bytemd)
    

### **14、 [undici: 使用 Node 从零开发的 HTTP/1.1 客户端](https://github.com/nodejs/undici)**

``` js
import { request } from 'undici'

const {
  statusCode,
  headers,
  trailers,
  body
} = await request('http://localhost:3000/foo')

console.log('response received', statusCode)
console.log('headers', headers)
```

nodejs 官方发布，从头写一个 HTTP/1.1 客户端


+ [repo: nodejs/undici](https://github.com/nodejs/undici)
+ [npm: undici](https://npmjs.com/package/undici)
    

### **15、 [np: 更好更安全的 npm publish](https://github.com/sindresorhus/np)**

![](./assets/np.gif)

一个更安全的 npm publish，比如发包之前需要通过单元测试，支持2FA等。


+ [repo: sindresorhus/np](https://github.com/sindresorhus/np)
+ [npm: np](https://npmjs.com/package/np)
    

### **16、 [size-limit: 控制你的 Package/Bundle 大小](https://github.com/ai/size-limit)**

无论是开发一个前端应用还是发布一个 npm package，它的包大小是敏感且重要的，实为开发者一大利器。

使用 size-limit 可在 git hooks 或者 CI 中控制发布包的大小 (可配置 gzip 或者 brotli 压缩算法)，及浏览器中 JS 的下载及执行时间。

你既可以在 `git hooks` 中使用

![](./assets/size-limit-show.png)

也可以在 `CI` 中使用，如 `github actions`、`Gitlab CI`

![](./assets/size-limit-ci.png)


+ [repo: ai/size-limit](https://github.com/ai/size-limit)
+ [npm: size-limit](https://npmjs.com/package/size-limit)
    

### **17、 [pnpm: 更快、占用空间更小的包管理器](https://github.com/pnpm/pnpm)**

使用 npm、yarn 及 pnpm 下载 React 时的 Benchmark，可见 pnpm 比其它包管理工具要快两倍

![Benchmark](./assets/pnpm-react-app.svg)

从图中，也可以看出 npm v7 性能比 yarn 有更好的性能


+ [repo: pnpm/pnpm](https://github.com/pnpm/pnpm)
+ [npm: pnpm](https://npmjs.com/package/pnpm)
    

### **18、 [popperjs: 轻量可定制化的 Tooltip 工具库](https://popper.js.org/)**

仅仅只有 3KB 大小，无任何依赖的轻量级 tooltip 工具库，支持 TS，非常流行，每个月有 3500 万次下载。

+ [repo: popperjs/popper-core](https://github.com/popperjs/popper-core)
+ [npm: @popperjs/core](https://npmjs.com/package/@popperjs/core)
    

### **19、 [multiavatar: 自动生成多元化头像](https://multiavatar.com/)**

可根据名称自动生成多元化的头像

![](./assets/multiavatar.gif)


+ [repo: multiavatar/Multiavatar](https://github.com/multiavatar/Multiavatar)
+ [npm: @multiavatar/multiavatar](https://npmjs.com/package/@multiavatar/multiavatar)
    
