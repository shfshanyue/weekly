---
title: "快速创建漂亮的代码截图"
date: 2024-04-19T00:00:00.000Z
release: 36
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 小技巧

- 使用 Ctrl + S 可以保存当前工作的文件。
- 使用 Ctrl + Z 可以撤销上一步操作。
- 使用 Ctrl + Y 可以恢复刚刚撤销的操作。

## 文章推荐

### 一、 [使用 Performance APIs 提升你的 Node.js 应用速度](https://betterstack.com/community/guides/scaling-nodejs/performance-apis/)

文章介绍了 Node.js 性能 API，如何在应用中使用它们来检测和增强性能。

涉及 `perf_hooks` 中的 `High-resolution Time`、`Performance Timeline`、`User Timing` 和 `Resource Timing`。

演示了 `performance.now()` 用于获取高分辨率时间戳，`performance.mark()` 和 `performance.measure()` 用于定制性能标记和测量。

以及通过 `PerformanceObserver` 实时监测性能事件。

```javascript
// 使用 performance.mark() 和 performance.measure() 来测量代码执行时间
import { performance } from "node:perf_hooks";

// 标记开始
performance.mark("start");

// 示例任务
setTimeout(() => {
  // 标记结束
  performance.mark("end");
  // 计算持续时间
  performance.measure("My Special Task", "start", "end");
  const measure = performance.getEntriesByName("My Special Task")[0];
  console.log(`任务耗时：${measure.duration}`);
}, 1000);
```

以及如何使用 `PerformanceObserver` 监测性能事件。

```js
import { performance, PerformanceObserver } from "node:perf_hooks";
import { completeAfterRandomTime } from "./random.js";

const observer = new PerformanceObserver((list, observer) => {
  for (const entry of list.getEntries()) {
    if (entry.name === "measure_func_perf") {
      console.log(`Function execution time: ${entry.duration} milliseconds`);
      observer.disconnect();
    }
  }
});

observer.observe({ entryTypes: ["measure"] });

const markStart = performance.mark("mark_function_start");
await completeAfterRandomTime(2000);
const markEnd = performance.mark("mark_function_end");
performance.measure(
  "measure_func_perf",
  "mark_function_start",
  "mark_function_end",
);
```

## 开源与库

### 一、 [modern-errors: 现代化异常处理方案](https://github.com/ehmicky/modern-errors)

modern-errors 提供了创建自定义错误类、设置错误属性、封装和规范化错误的特性。

它能够将无效或未知错误规范化为标准错误实例，提高错误处理的稳定性和可预测性。

完全支持 TypeScript 类型校验，拥有 100% 的测试覆盖率，确保代码质量。集成的插件系统允许开发者扩展错误处理功能，如日志记录、创建 HTTP 错误响应等。

```javascript
import ModernError from "modern-errors";

// 创建自定义错误类
export const CustomError = ModernError.subclass("CustomError");

// 抛出自定义错误
throw new CustomError("Something went wrong", {
  props: { critical: true },
});

// 捕获错误并封装
try {
  // some operation
} catch (cause) {
  throw new CustomError("Failed to complete operation", { cause });
}

// 使用插件进行错误序列化
import modernErrorsSerialize from "modern-errors-serialize";
const SerializedError = CustomError.subclass("SerializedError", {
  plugins: [modernErrorsSerialize],
});

// 创建一个可以序列化的错误实例
const error = new SerializedError("Serialization test");
const errorString = JSON.stringify(error);
```

- [npm: modern-errors](https://npm.devtool.tech/modern-errors)

## 开发利器

### 一、 [gitroll：通过 AI 生成你的多维度专业技能评分](https://gitroll.io/)

GitRoll 可通过分析扫描你的 GitHub 仓库，生成你的多维度综合评分、专业技能信息、

GitRoll 旨在通过专有的 AI 技术为软件工程师创建数据驱动的编程作品集，突破传统的软件技能评估方式，避免了传统测试、偏见和不必要的知识。

该平台不仅帮助开发者展示其真实的软件开发能力，还为雇主提供了一个成本效益高的解决方案，用以发现全球技术市场上经过审查和验证的 IT 人才。

多维度综合评分

![](https://static.shanyue.tech/images/24-04-20/clipboard-6606.7b4b12.webp)

技能列表

![](https://static.shanyue.tech/images/24-04-20/clipboard-4441.baebaa.webp)

### 二、 [codesnap：在 vscode 快速创建漂亮的代码截图](https://github.com/kufii/CodeSnap)

CodeSnap 是 Visual Studio Code 的一个插件，能够帮助用户迅速保存或复制代码的截图。

使用起来非常简单，通过命令面板启动，选择代码，调整截图宽度，然后点击快门按钮进行保存。

除了基础功能，用户还可以配置背景颜色、阴影、容器内边距、边角圆滑度、显示线号等。

此外，支持真实行号显示、透明背景，可以选择只截窗口或带容器截图，以及将截图保存到文件或复制到剪贴板。

```json
// 示例：配置 CodeSnap 的部分参数
{
  "codesnap.backgroundColor": "#ffffff", // 设置截图的背景颜色
  "codesnap.containerPadding": "16px", // 设置容器内边距
  "codesnap.showLineNumbers": true, // 是否显示行号
  "codesnap.shutterAction": "save" // 设置截图动作为保存到文件
}
```
