---
title: "使用 AI 练习英文对话"
date: 2024-03-22T00:00:00.000Z
release: 34
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 小技巧

- Linux: 使用| 管道符号可以将一个程序的输出作为另一个程序的输入，如 `ps aux | grep python`，这可以帮助你在大量输出中查找特定的信息。
- Linux: tail -f 命令可以用来监控文件的变化，特别适合监控日志文件。
- Git: 使用 git diff 可以查看尚未提交的修改，而 `git diff --staged` 可以查看已经暂存但尚未提交的修改。
- Git: 使用 `git stash` 可以临时保存当前的修改，让工作目录变得"干净"，以便切换到其他分支进行工作。执行 git stash pop 可以恢复之前的修改。
- Python: 使用 list comprehension（列表推导式）可以简洁高效地创建列表。如 squares = [x**2 for x in range(10)]。
- Python: 使用 with 语句可以确保即使在文件处理过程中出现异常，文件也能被正确关闭，如 `with open("output.txt", "w") as f:`。
- Docker: 使用 `docker ps -a` 可以查看所有的容器，包括已经停止的。
- Docker: 使用 `docker images` 可以查看本地存储的所有 Docker 镜像。
- Kubernetes: 使用 `kubectl get pods` 可以列出所有的 Pod。
- Kubernetes: 使用 `kubectl apply -f <filename>` 可以根据描述文件创建资源。

## 文章推荐

### 一、 [Promise 执行可视化](https://www.lydiahallie.com/blog/promise-execution)

![](https://static.shanyue.tech/images/24-03-30/clipboard-8903.07b099.webp)

Lydia Hallie 的文章使用可视化的形式解释了 JavaScript 中 Promise 的工作原理，通过新建 Promise 对象和处理异步任务，可以更容易地理解和使用。

作者讲解 JavaScript 中 Promise 的执行机制，如何创建 Promise 并通过 `then` 和 `catch` 处理异步任务。

详述 Promise 的内部结构，包括状态(`[[PromiseState]]`)和结果(`[[PromiseResult]]`)。

构造 Promise 时会创建回调函数，在异步任务完成时调用 `resolve` 或 `reject`。

```javascript
new Promise((resolve) => {
  setTimeout(() => resolve("Done!"), 100);
}).then((result) => console.log(result));
```

通过示例代码，展示了 Promise 如何处理异步操作，以及如何通过 `resolve` 和 `reject` 控制 Promise 的状态转移，使代码更易维护与阅读。

### 二、 [v8 中的 Iterator helpers](https://v8.dev/features/iterator-helpers)

V8 引擎推出迭代器助手方法，可直接在任何迭代器对象上调用。

新增方法包括 `map`（映射）、`filter`（过滤）、`take`（限量提取）、`drop`（跳过指定数量）、`flatMap`（平铺映射）、`reduce`（累加器）、`toArray`（转换为数组）、`forEach`（遍历执行）、`some`（某些元素匹配）、`every`（所有元素匹配）、`find`（寻找元素）以及 `Iterator.from`（从对象创建迭代器）功能。

这些方法为 JavaScript 开发者处理集合数据提供了更为丰富和简洁的工具。

```javascript
// 使用 `map` 将博客文章标题映射为大写形式
const postTitles = document.querySelectorAll(".post-title");
for (const title of postTitles.values().map((title) => title.toUpperCase())) {
  console.log(title);
}
// 使用 `filter` 过滤出包含关键字 "V8" 的博客文章
for (const post of postTitles
  .values()
  .filter((title) => title.includes("V8"))) {
  console.log(post);
}
```

这些功能的详细介绍和示例代码能够帮助开发者理解和运用这些新的迭代器方法，从而提升代码质量和开发效率。

## 开源与库

### 一、 [next intl: Internationalization for Next.js that gets out of your way.](https://next-intl-docs.vercel.app/)

next-intl 提供一套集成的 API 用于 Next.js 项目的国际化。

特点包括 ICU 消息语法、类型安全、基于钩子的 API，并支持自定义路径的国际化路由。

针对日期、时间和数字的格式化，不必担心服务器/客户端时间差异。其设计被 Next.js 社区广泛信任和采用。

```javascript
import { useTranslations } from "next-intl";

export default function UserProfile({ user }) {
  const t = useTranslations("UserProfile");

  return (
    <section>
      <h1>{t("title", { firstName: user.firstName })}</h1>
      <p>{t("membership", { memberSince: user.memberSince })}</p>
      <p>{t("followers", { count: user.numFollowers })}</p>
    </section>
  );
}
```

通过这些工具和示例，开发者能够快速并且安全地构建支持多语言的应用程序。

- [npm: next-intl](https://npm.devtool.tech/next-intl)

## 开发利器

### 一、 [Hume AI：使用 AI 练习英文对话](https://demo.hume.ai/)

![](https://static.shanyue.tech/images/24-03-30/clipboard-0590.5c313d.webp)

无需登录，你即可与 AI 练习口语。
