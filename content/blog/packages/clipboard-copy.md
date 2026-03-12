# 复制内容到剪切板？试试这个无依赖几十行源码下载过百万的库吧！

在浏览器中，如何复制内容到剪贴板？

那就是使用 [clipboard-copy](https://npm.devtool.tech/clipboard-copy) 这个库，月下载量达百万，而大小仅仅只有 `508B`。

这是它的用法，一个 `copy()` 搞定！

``` js
const copy = require('clipboard-copy')

copy('hello, world')
```

这是它的图表信息，流行度、质量、维护性都属优秀级别。

![clipboard-copy](../assets/clipboard.png)

与最为流行周下载量达几万的 [clipboard](https://npm.devtool.tech/clipboard) 而言，`clipboard-copy` 的代码更加简洁、声明式使用更加易懂，即使是源码也非常简单，仅仅只有几十行，建议阅读。

## 源码

在以前，复制命令使用 `document.execCommand`，然而它已经成为一个废弃的 API。

![](../assets/execCommand-deprecated.png)

而目前最为推荐的方式是使用 `Clipboard API` 进行实现

``` js
navigator.clipboard.writeText(text)
```

`clipboard-copy` 的源码对二者都做了兼容

``` js
module.exports = clipboardCopy

function makeError () {
  return new DOMException('The request is not allowed', 'NotAllowedError')
}

async function copyClipboardApi (text) {
  // Use the Async Clipboard API when available. Requires a secure browsing
  // context (i.e. HTTPS)
  if (!navigator.clipboard) {
    throw makeError()
  }
  return navigator.clipboard.writeText(text)
}

async function copyExecCommand (text) {
  // Put the text to copy into a <span>
  const span = document.createElement('span')
  span.textContent = text

  // Preserve consecutive spaces and newlines
  span.style.whiteSpace = 'pre'
  span.style.webkitUserSelect = 'auto'
  span.style.userSelect = 'all'

  // Add the <span> to the page
  document.body.appendChild(span)

  // Make a selection object representing the range of text selected by the user
  const selection = window.getSelection()
  const range = window.document.createRange()
  selection.removeAllRanges()
  range.selectNode(span)
  selection.addRange(range)

  // Copy text to the clipboard
  let success = false
  try {
    success = window.document.execCommand('copy')
  } finally {
    // Cleanup
    selection.removeAllRanges()
    window.document.body.removeChild(span)
  }

  if (!success) throw makeError()
}

async function clipboardCopy (text) {
  try {
    await copyClipboardApi(text)
  } catch (err) {
    // ...Otherwise, use document.execCommand() fallback
    try {
      await copyExecCommand(text)
    } catch (err2) {
      throw (err2 || err || makeError())
    }
  }
}
```