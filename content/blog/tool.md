---
title: 山月收集的前端开发者工具大集合
date: 2021-06-18T09:02:49.041Z
---


### **1、 [Web Developer 浏览器插件](https://chrispederick.com/work/web-developer/)**

![](./assets/webdev.png)

一款服务于 Web 开发者的浏览器插件，可以针对该网站做更深入的操作，如

1. 禁止 Javascript
1. 禁止 CSS
1. 显示页面所有图片
1. ...




    

### **2、 [Emmet: Web 开发者的利器](https://emmet.io/)**

![](./assets/svgviewer.png)

高效的前端开发利器，可在 Vue/React 中快速书写修改 HTML/CSS，并支持多种编辑器，如流行的 VSCode。

它最大的功能就是把 `CSS 样式的缩写` 转化为 HTML，如输入 `#page>(#header>ul#nav>li*4>a)+(#content>h1{Hello world}+p)+#footer`，并按下 Tab 键，自动生成以下 HTML

``` html
<div id="page">
  <div id="header">
    <ul id="nav">
      <li><a href=""></a></li>
      <li><a href=""></a></li>
      <li><a href=""></a></li>
      <li><a href=""></a></li>
    </ul>
  </div>
  <div id="content">
    <h1>Hello world</h1>
    <p></p>
  </div>
  <div id="footer"></div>
</div>
```

以上扩展缩写的功能被称为 `Expand Abbreviation`。除此之外，它还有更多细致的功能，这些功能在 Emmet 中被称为 `Action`

1. 去除最外层标签
1. 包裹选中的标签
1. ...


+ [repo: emmetio/emmet](https://github.com/emmetio/emmet)
+ [npm: emmet](https://npmjs.com/package/emmet)
    

### **3、 [URL-encoder for SVG](https://yoksel.github.io/url-encoder/)**

![](./assets/svg-encode.png)

把 SVG 转化为 DataURI，并嵌入到 CSS 样式中




    

### **4、 [Svg Viewer](https://www.svgviewer.dev/)**

![](./assets/svgviewer.png)

可视化 SVG，并支持压缩图片、转化为 React/RN 组件、转化为 png 格式的图片等




    

### **5、 [svg-term-cli: 把终端操作录制为 SVG 动画](https://github.com/marionebl/svg-term-cli)**

![](./assets/commitlint.svg)

基于 asciinema 的一款软件，使用 javascript 编写。可把终端动作录制为 svg 动画

``` bash
$ cat demo.cast | svg-term > demo.svg
```


+ [repo: marionebl/svg-term-cli](https://github.com/marionebl/svg-term-cli)
+ [npm: svg-term-cli](https://npmjs.com/package/svg-term-cli)
    

### **6、 [asciinema: 终端动作录制软件](https://asciinema.org/)**

使用 python 编写的一款可记录终端操作命令动画的工具软件，可在线播放。借助第三方工具可以转化为 gif 动画或者 svg 动画。

使用以下两行命令可快速开始录制终端。

``` bash
$ brew install asciinema

$ asciinema rec
```


+ [repo: asciinema/asciinema](https://github.com/asciinema/asciinema)

    

### **7、 [Prettier Playground: 任意语言代码格式化](https://prettier.io/playground/)**

![](./assets/prettier.png)

Prettier 是一款优秀的代码格式化工具

![支持多种编程语言](./assets/prettier-lang.png)

![支持多种编辑器](./assets/prettier-editor.png)




    

### **8、 [Chrome Platform Status: Chrome 发布版本新特性大览](https://www.chromestatus.com/features/schedule)**

![](./assets/chromestatus.png)

列举每一个 Chrome 的新特性大全，目前的稳定版本及下一个版本的发布日期等。




    

### **9、 [cssffects: 多种超实用 CSS 动画](https://emilkowalski.github.io/css-effects-snippets/)**

![](./assets/csseffects.png)

收集多种 CSS 动画，大部分是各种 hover 效果、loading 动画等，纯 CSS 实现。收藏以备独立设计网站时的不时之需。


+ [repo: emilkowalski/css-effects-snippets](https://github.com/emilkowalski/css-effects-snippets)

    

### **10、 [SVG Wave Generator](https://www.softr.io/tools/svg-wave-generator)**

![SVG 波浪形随机生成器](./assets/svg-creator.png)

随机生成一个波浪SVG，可调整锯齿、波折程度等，并可保存为 SVG/PNG/JPG




    

### **11、 [Explain Shell: 图示任一命令行每个参数的释义](https://explainshell.com/)**

![explainshell](./assets/explainshell.png)

可称之为学习及书写 shell 的最佳辅助神器，输入任一 linux 命令，都会一一指出每个参数的释义，PIPE 嵌套且复杂的命令也可解析。




    

### **12、 [Browser Logos: 浏览器高清分辨率 Logo](https://github.com/alrra/browser-logos)**

![browser-logos](https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/browser-logos.gif)

这是 Github 的一个仓库，你可以直接引用地址，找到任意浏览器高清分辨率的Logo。

如果引用 Github 地址比较慢的话，你可以试试 jsdelivr 的 [CDN](https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/chrome/chrome_64x64.png)




    

### **13、 [User Agents: 关于 UA 的一切](https://user-agents.net/)**

![User Agents](./assets/ua.png)

拥有大量 UA 的数据库及相关功能

+ 可获取任意平台的 UA (Mac/Windows/Android)
+ 可获取任意 Spider/Crawer 的 UA (Baidu/Google/Bing)
+ 可随机生成 UA
+ 可解析 UA




    

### **14、 [risingstars: 2020年 Javascript 明星项目](https://risingstars.js.org/2020/zh)**

2021 年，JS 各个生态圈中最流行的框架及周边产物，如 React 生态圈、Vue 生态圈、GraphQL 生态圈、构建工具生态圈等




    

### **15、 [Lorem Picsum: 随机一张指定尺寸图片 API](https://picsum.photos/)**

![](./assets/picsum.png)

`https://picsum.photos/200/200` 将随机从 Unsplash 取一张指定尺寸的图片


+ [repo: DMarby/picsum-photos](https://github.com/DMarby/picsum-photos)

    

### **16、 [bestofjs: 发现 Javascript 最好的框架与库](https://bestofjs.org/)**

这里有 JS 生态最流行的库，实时刷新并推荐，并且可每周订阅


+ [repo: ritz078/transform](https://github.com/ritz078/transform)

    

### **17、 [TableConvert: 关于表格及任意格式的双向转换](https://tableconvert.com/)**

![TableConvert](./assets/tableconvert.png)

支持 Excel、URL、HTML、Markdown、CSV、JSON、LaTeX、SQL、MediaWiki等任意格式的相互转换




    

### **18、 [transform: 编程语言任意格式转化](https://transform.tools/)**

![JSON 转化为 MYSQL](./assets/transform.png)

支持各种代码转化的工具，SVG、JSON、TS、GraphQL、CSS、SQL，只要你能想到的这里都有。

**光 JSON 就可以转化为十几种代码格式，如把 JSON 转化成 Flow、Go、GraphQL、Typescript、Kotlin、MySQL、YAML等**

本项目开源，你可以通过代码学习到它是如何进行格式转换的


+ [repo: ritz078/transform](https://github.com/ritz078/transform)

    
