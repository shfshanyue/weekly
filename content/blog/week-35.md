---
title: "使用 AI 来生成 Commit Message"
date: 2024-04-12T00:00:00.000Z
release: 35
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 小技巧

- Go：Go语言支持并发编程，goroutine 和 channel 是 Go 语言并发的核心。
- Rust：Rust严格的所有权规则使得我们无须手动做内存管理，同时编译器还会避免出现数据竞争等并发问题。
- Rust：match语句是Rust的重要特性，它可以匹配各种模式，包括结构体、元组、枚举等，使得复杂的逻辑表达更简洁。
- JavaScript：理解异步编程和Promise、async/await是Javascript开发中的重要一环。
- CSS：CSS Flexbox和Grid提供了更加现代和强大的布局方式。
- 使用 Ctrl + T 可以快速打开新的浏览器标签页。
- 使用 Ctrl + Shift + T 可以重新打开最近关闭的标签页。
- 使用 Ctrl + F 可以在当前页面内进行搜索。

## 文章推荐

### 一、 [DevTools Tips & Tricks](https://frontendmasters.com/blog/devtools-tips-tricks/)

![](https://static.shanyue.tech/images/24-04-12/clipboard-7240.681f82.webp)

文章介绍了使用开发者工具的技巧，以提升前端开发的效率。包括：

- 在 Chromium 浏览器检查悬停弹出元素
- 使用 logpoints 替代 `console.log` 调试代码
- 在 Chromium 中模拟可折叠设备
- 自动完成样式输入
- 切换颜色格式
- 在 DevTools 中捕捉高分辨率屏幕截图
- 查看和复制页面上发生更改的样式
- 利用实时表达式简化经常使用的 JavaScript 表达式输入过程
- 调试导致水平滚动条的溢出元素

还提供了相关资源链接，比如 DevTools Tips 和 Dev Tips，供读者进一步学习。

## 开源与库

### 一、 [pragmatic-drag-and-drop: 一个灵活的拖放库](https://github.com/atlassian/pragmatic-drag-and-drop)

![](https://static.shanyue.tech/images/24-04-12/clipboard-3884.ae2dd0.webp)

该项目是 Atlassian 开发的低级别拖放工具链，它允许使用浏览器内建的拖放功能，并支持任何视图层。此工具链已应用于 Trello、Jira 和 Confluence 等大型产品。

Pragmatic drag and drop 提供了一系列可重用的包，以便开发人员创建定制的拖放体验，包括：

- **核心功能包**：无视觉语言或便捷性依赖，灵活创建拖放体验。
- **视觉输出**：提供快速构建一致性用户体验的可选视觉输出。
- **辅助技术控制**：提供工具链用于辅助技术用户的友好拖放体验。

```js
import React, { useEffect, useRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

function DropTarget() {
  const ref = (useRef < HTMLDivElement) | (null > null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      throw new Error("ref not set correctly");
    }

    return dropTargetForElements({
      element: el,
    });
  }, []);

  return <div ref={ref}>Drop elements on me!</div>;
}
```

- [npm: next-intl](https://npm.devtool.tech/next-intl)

## 开发利器

### 一、 [aicommits：AI 自动生成 Git 提交信息的 CLI 工具](https://github.com/Nutlope/aicommits)

AI Commits 是一个命令行界面（CLI）工具，使用 OpenAI 的 GPT 模型生成适用于 Git 提交的信息。使用方法如下：

1. 安装 aicommits：通过 npm 安装此工具。
2. 设置 API 密钥：获取并设置 OpenAI 平台的 API 密钥。
3. 配置和使用：通过 `aicommits config set` 命令进行配置，可设定包括本地化、提交信息类型等选项。使用时，运行 `aicommits` 生成提交信息。

该工具还支持生成遵循 Conventional Commits 规范的提交信息，并可以集成到 Git 钩子，以自动产生和编辑提交信息。

代码示例：

```bash
# 安装 aicommits
npm install -g aicommits

# 设置 OpenAI API 密钥
aicommits config set OPENAI_KEY=<your token>

# 生成提交信息
aicommits

# 生成 Conventional Commits 规范的提交信息
aicommits --type conventional # or -t conventional
```

### 二、 [plandex：在终端中构建复杂任务的 AI 编程引擎](https://github.com/plandex-ai/plandex)

Plandex 利用 AI 助力编写代码，支持终端中高效管理任务。需设置 `OPENAI_API_KEY` 环境变量，提供快速安装脚本和源代码编译指令。

作为命令行工具，Plandex 通过拆分大型任务、管理上下文和版本控制助力软件开发。

```bash
# 快速安装 Plandex
curl -sL https://plandex.ai/install.sh | bash
```

使用前需配置环境变量并运行 `plandex new` 来创建新计划。以下是我通过它重构页面组件 `app.tsx` 的截图。

![](https://static.shanyue.tech/images/24-04-12/clipboard-4726.98a172.webp)
