# Chrome 90 新功能一览: Web Component 也支持服务器渲染了！

Chrome 90 在四月十三号发布，我们快来看看它出了什么新特性吧！

## 剪切板支持读取文件

剪切板支持读取可读文件。浏览器支持通过拖拽的方式读取文件，但是现在它还可以通过复制粘贴的方式读取文件，对于文件交互的 Web APP 而言可以拥有更好的用户体验，比如图片压缩、文档上传之类。
  
``` js
async function onPaste(e) {
  let file = e.clipboardData.files[0];
  let contents = await file.text(); 
}
```

## Overflow: clip

`overflow: clip` CSS 属性的支持，表现与 `overflow: hidden` 相似，但它不会创建新的格式化上下文 (Formatting Context)。与 `overflow-clip-margin` 一同使用，可扩展裁剪边界

![](../assets/overflow-clip.png)

你可以在这里例子中查看[clip在线Demo](https://petele-css-is-awesome.glitch.me/)

## Declarative Shadow DOM

`Declarative Shadow DOM`，增强了对 Web Component 的服务器渲染支持。

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