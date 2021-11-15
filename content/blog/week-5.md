---
title: "第 5 期: 如何高效组织 npm script"
date: 2021-03-29T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅 Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA3MzU0MjIzMA==&action=getalbum&album_id=1761820812803620868&scene=21#wechat_redirect)

## 封面

![苏伊士运河造堵塞](./assets/changci.jpg)

大型货轮长赐号搁浅堵塞苏伊士运河，目前救援仍在继续

- 在最新版的 github，Readme 已支持 TOC 快速目录
- svg-term 可以很方便的对你在终端的操作命令进行录制并保存为很小体积的 SVG 动画
- `code .` 可以使用 VS Code 快速打开当前目录
- 统计显示，2020 年在美国各级学校注册的国际学生人数与上年相比下降了 18%
- 新西兰国家水事和大气研究所日前发布的一份研究显示，在新西兰周边海域采样的鱼类内脏中有微塑料，甚至肌肉组织中也发现了微塑料成分
- 新一期贷款市场报价利率（LPR）出炉，我国 1 年期和 5 年期以上 LPR 均未调整，1 年期 LPR 仍为 3.85%，5 年期以上 LPR 为 4.65%
- 国防部新闻发言人表示，055 型驱逐舰拉萨舰，舷号为 102，顺利完成建造和海试工作，已于 3 月 2 日正式加入中国海军序列
- 截至 3 月 24 日，今年我国快递业务量已突破 200 亿件，日均业务量超过 2.4 亿件，日均服务用户接近 5 亿人次
- 苏伊士运河货船搁浅，每天损失四亿美元。埃及有关部门表示，对在苏伊士运河中搁浅货船的救援仍在继续，运河暂停航行，不排除救援可能需要几周时间

## 开发利器

### **一、 [Prettier Playground: 任意语言代码格式化](https://prettier.io/playground/)**

![](./assets/prettier.png)

Prettier 是一款优秀的代码格式化工具

![支持多种编程语言](./assets/prettier-lang.png)

![支持多种编辑器](./assets/prettier-editor.png)

### **二、 [asciinema: 终端动作录制软件](https://asciinema.org/)**

使用 python 编写的一款可记录终端操作命令动画的工具软件，可在线播放。借助第三方工具可以转化为 gif 动画或者 svg 动画。

使用以下两行命令可快速开始录制终端。

```bash
$ brew install asciinema

$ asciinema rec
```

- [repo: asciinema/asciinema](https://github.com/asciinema/asciinema)

### **三、 [svg-term-cli: 把终端操作录制为 SVG 动画](https://github.com/marionebl/svg-term-cli)**

![](./assets/commitlint.svg)

基于 asciinema 的一款软件，使用 javascript 编写。可把终端动作录制为 svg 动画

```bash
$ cat demo.cast | svg-term > demo.svg
```

- [repo: marionebl/svg-term-cli](https://github.com/marionebl/svg-term-cli)
- [npm: svg-term-cli](https://npm.devtool.tech/svg-term-cli)

## 文章推荐

### **一、 [仅使用 CSS 就可以提高页面渲染速度的 4 个技巧](https://blog.bitsrc.io/improve-page-rendering-speed-using-only-css-a61667a16b2)**

![](./assets/content-visibility.gif)

本篇文章提到了四个关于提高页面性能的 CSS 技巧

1. content-visibility
1. will-change
1. 带有媒体查询的 link
1. @import

- [跳转译文](https://blog.zhangbing.site/2020/12/28/improve-page-rendering-speed-using-only-css/)

### **二、 [如何高效组织 npm script](https://shanyue.tech/node/npm-scripts.html)**

一个项目的 npm script 是前端工程化的一个缩影，从这篇文章可以给我们如何更好地组织 npm script 启发一个新的思考，涉及到以下方面

1. start/dev
1. build
1. test
1. format
1. lint
1. audit
1. outdated
1. size
1. deploy

## 开源与库

### **一、 [Prettier: 代码格式化工具](https://prettier.io/)**

支持多种编程语言，如 html、css、js、graphql、markdown 等并且可与编辑器 (vscode) 深度集成的代码格式化工具

![支持多种编程语言](./assets/prettier-lang.png)

![支持多种编辑器](./assets/prettier-editor.png)

- [repo: prettier/prettier](https://github.com/prettier/prettier)
- [npm: prettier](https://npm.devtool.tech/prettier)

### **二、 [commitlint: Git Commit 格式化工具](https://commitlint.js.org/)**

![](./assets/commitlint.svg)

- [repo: conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint)
- [npm: @commitlint/cli](https://npm.devtool.tech/@commitlint/cli)

### **三、 [npm-check-updates: 把 package.json 中的依赖升级到最新版本](https://github.com/raineorshine/npm-check-updates)**

![](./assets/ncu.png)

npm-check-updates，npm outdated 的升级版本，可以控制把 package.json 中的依赖升级到最新版本

```bash
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

- [repo: raineorshine/npm-check-updates](https://github.com/raineorshine/npm-check-updates)
- [npm: npm-check-updates](https://npm.devtool.tech/npm-check-updates)

### **四、 [storybook: 构建更健壮的 React/Anular/Vue UI 组件](https://storybook.js.org/)**

![](./assets/storybook.gif)

storybook 可以更高效地组织 React/Angular/Vue 的 UI 组件

- [repo: storybookjs/storybook/](https://github.com/storybookjs/storybook/)

## 代码片段

### **一、 Array.prototype.flatMap: 以下结果输出多少？**

输入输出结果是多少？

```js
[1, 2, [3], 4].flatMap((x) => x + 1);
```

输出，你做对了吗？

```js
[1, 2, [3], 4].flatMap((x) => x + 1);
//=> [2, 3, '31', 5]
```

而 `flatMap` 实际上是先 `map` 再 `flat`，实现如下

```js
Array.prototype.flatMap = function (mapper) {
  return this.map(mapper).flat();
};
```

### **二、 把数组置空**

```js
const l = [1, 2, 3, 4, 5];

// 很方便把数组置为空数组
l.length = 0;
```

## 版本发布

### **一、 [webpack v5.28.0](https://github.com/webpack/webpack/releases/tag/v5.28.0)**

webpack v5.28.0 在 2021.03.24 发布，改进功能及修复 Bug 如下。

(webpack 在 Release 中对改进功能及修复 bug 并不指明 Issue)

1. add module.generator.asset.publicPath to configure a different publicPath for assets
1. fixes a watch mode caching problem which was introduced in 5.26.0 when using the unsafe cache
1. improve serialization performance

### **二、 [nodejs 15.12.0](https://github.com/nodejs/node/releases/tag/v15.12.0)**

- crypto:
  - add optional callback to crypto.sign and crypto.verify (Filip Skokan)
  - support JWK objects in create\*Key (Filip Skokan)
- deps:
  - switch openssl to quictls/openssl (James M Snell)
  - update to cjs-module-lexer@1.1.0 (Guy Bedford)
- fs:
  - improve fsPromises writeFile performance (Nitzan Uziely)
  - improve fsPromises readFile performance (Nitzan Uziely)
- lib:
  - implement AbortSignal.abort() (James M Snell)
- node-api:
  define version 8 (Gabriel Schulhof)
- worker:
  add setEnvironmentData/getEnvironmentData (James M Snell)
