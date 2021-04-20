---
title: "第 8 期: 通过玩游戏的方式学习技术"
date: 2021-04-19T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

+ 订阅网站: <https://weekly.shanyue.tech>
+ 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
+ [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA3MzU0MjIzMA==&action=getalbum&album_id=1761820812803620868&scene=21#wechat_redirect)


## 封面

![CI Workflow](./assets/ci.png)

一种完善的 CI 工作流。包括质量检查、性能测试、单元测试、容器安全、Preview 等等等流程



## 一句话

+ Chrome 90 发布，新增 `eclarative Shadow DOM` 与 `overflow: clip`等特性
+ 国家统计局发布数据，初步核算，一季度国内生产总值同比上涨18.3%

## 开发利器


### **一、 [Learning Git Branch: 学习 Git 最好的游戏及教程](https://learngitbranching.js.org/)**

![](./assets/learngit.png)

这个就是那个超强的动画游戏趣味俱佳的 Git 闯关游戏！无论对于新人而言，还是老人来讲，都能从中受益，更能理解 Git 的核心，是山月认为的最好的关于学习 Git 的教程。

**当你每敲入一个 Git 命令，都会以动画的形式在右侧区域展现出来，更为难得的是它以闯关的模式一步步从 git commit 由浅入深引导着你来学习**

在游戏中，你可以随时通过命令 `levels` 来选择关卡，爆赞！


+ [repo: pcottle/learnGitBranching](https://github.com/pcottle/learnGitBranching)


    

### **二、 [Githug: 命令行式 Git 闯关游戏](https://github.com/Gazler/githug)**

![](./assets/githug.png)

同 `learngitbranch` 类似，但它是一个命令行式游戏，并使用 ruby 编写，同样很有趣味，快来练练手吧。


+ [repo: Gazler/githug](https://github.com/Gazler/githug)


    

### **三、 [Flexbox Froggy: 游戏中学习 Flex](https://flexboxfroggy.com/)**

![](./assets/flexboxfrog.png)

青蛙回家的游戏，使用 flex 布局把青蛙放置在与它对应颜色的草地上，游戏中会提示你使用正确的 CSS 属性及释义，难度中等。通过玩游戏的方式愉快学习 flexbox，可以大幅提升学习效率


+ [repo: thomaspark/flexboxfroggy/](https://github.com/thomaspark/flexboxfroggy/)


    

### **四、 [Grid Garden: 游戏中学习 Grid](https://cssgridgarden.com/)**

![](./assets/gridgarden.png)

公园浇花的游戏，与青蛙回家一样有意思，使用 grid 布局把水浇在在与出现花的方格土地上，游戏中会提示你使用正确的 CSS 属性及释义，难度中等。通过玩游戏的方式愉快学习 grid 布局，可以大幅提升学习效率

如果我来做一个 flex 与 grid 布局的游戏，那我应该设计一个什么样的场景呢


+ [repo: thomaspark/gridgarden/](https://github.com/thomaspark/gridgarden/)


    

### **五、 [CSS Dinner: 游戏中学习 CSS3 选择器](https://flukeout.github.io/)**

![](./assets/cssdinner.png)

这是一个有关 CSS 高级选择器的游戏，相信你通关成功后会对 CSS 选择器融会贯通吧。





    

### **六、 [Vim 大冒险](https://vim-adventures.com/)**

![](./assets/vimadventure.png)

Vim 大冒险，一个 Web 游戏，通过闯关的模式学习 Vim，你可以学到 Vim 的基本操作后在这里不停闯关，练习 Vim 的熟练度。山月已经跑到最后一关，免费关的最后一关。后续关卡就要进行收费，如果是付费用户，可以...共享给我





    

### **七、 [CSS Grid Generator](https://cssgrid-generator.netlify.app/)**

![](./assets/cssgridgenerator.png)

在网格中进行拖拽选择区域，一键生成 Grid 的 CSS 与 HTML 代码，简单方便，快来试一试吧。





    

## 文章推荐


### **一、 [Say Hello To CSS Container Queries](https://ishadeed.com/article/say-hello-to-css-container-queries/)**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3ebbddddc1447f3ae96382c9018b2ef~tplv-k3u1fbpfcp-zoom-1.image)

容器查询(Container Query) 是即将到来的一项 CSS 特性，Container Query 比 Media Query 更强大的 Query。目前需要体验需在谷歌浏览器中打开地址 `chrome://flags` 查找到 `container query` 手动开启

Container Query 与 Grid Layout 真是天作之合，可以完成以前难以完成或者及其复杂的布局





    

## 代码片段


### **一、 str.repeat: 重复字符串**

``` js
'abc'.repeat(10)
//=> 
```





    

## 开源与库


### **一、 use-debounce: A debounce hook for react**

防抖可以笨办法防止多次重复计算造成的性能消耗，在 React 中可以使用 `use-debounce` 对函数及值进行防抖

**对值进行防抖**

``` js
const [text, setText] = useState('Hello');
const [value] = useDebounce(text, 1000);
```

**对函数进行防抖**

``` js
const [value, setValue] = useState(defaultValue);

const debounced = useDebouncedCallback(
  (value) => {
    setValue(value);
  },
  1000
);
```


+ [repo: xnimorz/use-debounce](https://github.com/xnimorz/use-debounce)
+ [npm: use-debounce](https://npm.devtool.tech/use-debounce)

    

### **二、 [markmap: 使用 Markdown 制作思维导图](https://markmap.js.org/)**

![](./assets/markmap.png)

Markmap 利用 Markdown 中的 h1、h2、h3 轻松方便制作思维导图，同时支持 Markdown 的语法，如链接、粗体、斜体之类。你可以在这里 [markmap repl](https://markmap.js.org/repl) 在线尝试

![](./assets/markmap-vscode.png)

它也可在 VSCode 中集成使用。


+ [repo: dundalek/markmap](https://github.com/dundalek/markmap)
+ [npm: markmap](https://npm.devtool.tech/markmap)

    

### **三、 [react-pdf: 使用 React 创建 PDF 文件](https://react-pdf.org/)**

![](./assets/reactpdf.png)

使用 React 直接书写 PDF 文档，但是样式需要使用它自己的写法，不支持 CSS，优势在于支持手动下载并且文档预览与下载后效果一致。


+ [repo: diegomura/react-pdf](https://github.com/diegomura/react-pdf)
+ [npm: react-pdf](https://npm.devtool.tech/react-pdf)

    

## 版本发布


### **一、 [Chrome 90 发布](https://developer.chrome.com/blog/new-in-chrome-90/)**

+ `overflow: clip` CSS 属性的支持，表现与 `overflow: hidden` 相似，但它不会创建新的格式化上下文 (Formatting Context)。与 `overflow-clip-margin` 一同使用，可扩展裁剪边界

  ![](./assets/overflow-clip.png)

  你可以在这里例子中查看[clip在线Demo](https://petele-css-is-awesome.glitch.me/)

+ `Declarative Shadow DOM`，增强了对 Web Component 的服务器渲染支持。

  `Shadow DOM` 是 Web Components 标准的一部分，但在此之前你只能通过客户端Javascript的方式来创建它。

  ``` js
  const host = document.getElementById('host');
  const shadowRoot = host.attachShadow({mode: 'open'});
  shadowRoot.innerHTML = '<h1>Hello Shadow DOM</h1>';
  ```

  但是 `Declarative Shadow DOM` 是一个带有 `shadowroot` 属性的 `template` 元素。可直接把它输出为一个字符串

  ``` html
  <host-element>
    <template shadowroot="open">
      <slot></slot>
    </template>
    <h2>Light content</h2>
  </host-element>
  ```

  生成了以下字符串

  ``` html
  <host-element>
    #shadow-root (open)
    <slot>
      ↳
      <h2>Light content</h2>
    </slot>
  </host-element>
  ```

  为了加强对 `template` 的支持，又新引入了一个 API: `el.getInnerHTML()`，与 `innerHTML` 相似，但是它可以控制是否包含 `shadowRoot`

  ``` js
  const html = element.getInnerHTML({includeShadowRoots: true});
  `<host-element>
    <template shadowroot="open"><slot></slot></template>
    <h2>Light content</h2>
  </host-element>`;
  ```

+ 剪切板支持读取可读文件。浏览器支持通过拖拽的方式读取文件，但是现在它还可以通过复制粘贴的方式读取文件，对于文件交互的 Web APP 而言可以拥有更好的用户体验，比如图片压缩、文档上传之类。
  
  ``` js
  async function onPaste(e) {
    let file = e.clipboardData.files[0];
    let contents = await file.text(); 
  }
  ```





    
