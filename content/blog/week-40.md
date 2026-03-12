---
title: "重庆武隆天生三桥，Docusaurus 3.6 性能优化手段等"
date: 2024-11-07T00:00:00.000Z
release: 40
description: "本周技术动态：React 编译器进入 Beta，带来自动记忆化优化；Docusaurus 3.6 通过 Rust 工具链提升构建性能；Faker.js 9.2 扩展假数据生成能力；Sonner 1.7 优化 Toast 组件体验。技术文章涵盖代码安全、Shopify 全球销售可视化实现、JavaScript 空值合并运算符等话题。开发技巧包括性能监控、时间测量、数据库优化等实用内容。重点关注性能优化、开发效率和安全性议题。
"
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 封面

![天生三桥，重庆武隆岩溶国家地质公园](https://static.shanyue.tech/images/24-11-08/clipboard-9276.0f70f8.webp)

中国武隆喀斯特“天生三桥”是大自然历经数百年雕琢而成的地质奇观。这些石灰岩桥耸立在幽深的峡谷中，以三条龙的名字命名：天龙、青龙和黑龙。天龙桥高771英尺，桥墩上有一个迷宫般的洞穴。青龙桥高922英尺，在太阳出来的时候可以欣赏到壮丽的景色。黑龙桥是三座桥中最宽的一座，长633英尺，高732英尺。游客可以游览武隆喀斯特国家地质公园，参观芙蓉洞等景点。芙蓉洞高9337英尺，洞内有巨大的石灰岩钟乳石，这些钟乳石是悬挂在洞顶的矿物。站在这些壮观的天生桥下，你不禁会对时间和自然的巨大力量而肃然起敬。

## 小技巧

- 使用 Chrome DevTools 的 Performance Insights 面板可以监控本地和真实用户的 Core Web Vitals 性能指标
- 在 Node.js 中使用 process.hrtime.bigint() 可以获得纳秒级的精确时间测量
- PostgreSQL 的 EXPLAIN ANALYZE 命令可以帮助优化慢查询
- Docker 多阶段构建可以显著减小最终镜像大小
- 使用 Edge Functions 可以降低 API 调用的延迟

## 文章推荐

### 一、 [为什么代码安全很重要 - 即使在加固环境中](https://www.sonarsource.com/blog/why-code-security-matters-even-in-hardened-environments/)

文章探讨了在强化环境中代码安全的重要性,展示了如何将 Node.js 应用中的文件写入漏洞转化为远程代码执行漏洞。关键技术要点:

1. 即使在文件系统只读的情况下,攻击者也可以通过 procfs 文件系统访问进程的文件描述符:

```javascript
// 示例:通过 procfs 写入管道
const pid = process.pid;
fs.writeFileSync(`/proc/${pid}/fd/5`, data);
```

2. Node.js 使用 libuv 库处理异步事件,该库使用匿名管道进行事件通信。攻击者可以构造特定数据结构:

```c
typedef struct {
  uv_signal_t* handle;  // 指向信号处理结构
  int signum;          // 信号编号
} uv__signal_msg_t;
```

3. 通过精心构造的数据写入管道,可以触发任意代码执行:

- 构造假的 uv_signal_s 数据结构
- 设置 signal_cb 函数指针
- 写入匹配的 signum 值

文章强调基础代码安全的重要性,基础设施加固只能作为额外的防御层,无法替代源代码级别的安全性。开发者应该从源头修复漏洞,实施清晰的代码实践。

### 二、 [Shopify 如何构建其 2023 黑色星期五全球销售可视化](https://shopify.engineering/how-we-built-shopifys-bfcm-2023-globe)

Shopify 分享了他们如何构建 2023 年黑色星期五全球销售可视化项目的技术细节。主要通过 Three.js 和 React Three Fiber 实现，重点优化了性能和视觉效果：

1. 使用实例化渲染优化弧线动画：

```javascript
// 使用 instancing 渲染数千条弧线
const arcs = new InstancedMesh(arcGeometry, arcMaterial, maxArcsCount);

// 在着色器中计算弧线位置
const vertexShader = `
  attribute vec3 p0, p1, p2, p3;
  attribute float startTime;
  
  void main() {
    float t = (uTime - startTime) / duration;
    vec3 pos = cubicBezier(p0, p1, p2, p3, t);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
```

2. 使用 Hermite 样条实现循环弧线：

```javascript
// 定义关键帧动画
const keyframes = [
  { time: 0, value: 0, slope: 1 },
  { time: 1, value: 1, slope: 0 },
  { time: 2, value: 0, slope: -1 },
];
```

主要技术亮点：

- 通过 GPU 实例化渲染支持同时显示数万条订单轨迹
- 使用 psrdnoise 实现无缝的地球材质效果
- 优化着色器代码以提升移动端性能
- 实现了包括城市点、烟花、飞机等多个视觉元素

### 三、 [深入理解 JavaScript 空值合并赋值运算符](https://www.trevorlasn.com/blog/javascript-nullish-coalescing-assignment-operator)

文章详细介绍了 JavaScript 中空值合并赋值运算符 ??= 的使用方法和最佳实践。关键内容包括：

1. 基本语法和工作原理：

```javascript
// 仅当左侧操作数为 null 或 undefined 时才赋值
let user = null;
user ??= { name: "John" }; // user = { name: 'John' }

let name = "Alice";
name ??= "Anonymous"; // name 保持为 'Alice'
```

2. 与其他运算符的对比：

```javascript
// 与 ||= 的区别
let count = 0;
count ||= 10; // count 变为 10，因为 0 是假值
count ??= 10; // count 保持为 0，因为 0 不是 null/undefined

// 链式使用
const settings = {};
settings.database ??= {};
settings.database.host ??= "localhost";
```

3. 实际应用场景：

```javascript
// 配置对象的默认值
function initConfig(config) {
  config.timeout ??= 3000;
  config.retries ??= 3;
  config.baseURL ??= "https://api.example.com";
  return config;
}
```

文章强调了该运算符在处理可选配置、默认值设置等场景下的优势，以及与传统的空值检查方法相比的简洁性。同时也提醒开发者注意与逻辑或赋值运算符（||=）的区别，避免在处理假值时产生意外行为。

## 开源与库

### 一、 [Docusaurus 3.6: 文档站点生成器](https://docusaurus.io)

Docusaurus 3.6 版本通过引入 Docusaurus Faster 项目显著提升了构建性能。主要更新包括：

1. 使用 Rust 工具链优化构建：

```javascript
// docusaurus.config.js
module.exports = {
  future: {
    experimental_faster: {
      swcJsLoader: true, // 使用 SWC 替代 Babel
      swcJsMinimizer: true, // 使用 SWC 替代 Terser
      lightningCssMinimizer: true, // 使用 Lightning CSS 替代 cssnano
      rspackBundler: true, // 使用 Rspack 替代 webpack
    },
  },
};
```

性能提升显著：

- React Native 网站构建速度提升 3.04 倍
- Babel 网站构建速度提升 3.27 倍
- Lexical 网站构建速度提升 2 倍
- HTML 输出体积减少约 5%
- 显著降低内存消耗

技术栈升级：

- Lightning CSS：用 Rust 编写的高性能 CSS 工具，比传统的 cssnano 快 100 倍
- SWC：替代 Babel 的 Rust 实现的 JavaScript/TypeScript 编译器
- Rspack：兼容 webpack 的 Rust 实现构建工具

其他更新：

- 新增 Rsdoctor 插件用于分析构建性能
- 支持 Mermaid 10/11 版本
- 支持通过 frontMatter.title_meta 自定义 SEO 标题

* [repo: facebook/docusaurus](https://github.com/facebook/docusaurus)

### 二、 [Yauzl: Node.js 的 ZIP 解压库](https://github.com/thejoshwolfe/yauzl)

Yauzl 是一个简单、安全的异步 ZIP 解压库：

```javascript
const yauzl = require("yauzl");

yauzl.open("example.zip", { lazyEntries: true }, (err, zipfile) => {
  if (err) throw err;
  zipfile.on("entry", (entry) => {
    if (/\/$/.test(entry.fileName)) {
      // 目录项
      zipfile.readEntry();
    } else {
      // 文件项
      zipfile.openReadStream(entry, (err, readStream) => {
        if (err) throw err;
        readStream.pipe(process.stdout);
        readStream.on("end", () => {
          zipfile.readEntry();
        });
      });
    }
  });
  zipfile.readEntry();
});
```

- [repo: thejoshwolfe/yauzl](https://github.com/thejoshwolfe/yauzl)

## 开发利器

### 一、 [Faker 9.2: 生成海量假数据](https://fakerjs.dev)

Faker.js 9.2 版本新增了宠物名称和罗马数字生成功能，提供了基于 DevTools console 的交互式演示：

```javascript
import { faker } from "@faker-js/faker";

// 生成用户数据
const user = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  pet: faker.animal.pet(),
  birthDate: faker.date.birthdate(),
};

// 批量生成数据
const users = faker.helpers.multiple(() => ({ ...user }), { count: 10 });
```

- [repo: faker-js/faker](https://github.com/faker-js/faker)

### 二、 [Sonner 1.7: React Toast 通知组件](https://sonner.emilkowal.ski)

Sonner 是一个优雅的 React Toast 通知组件，v1.7 版本改进了动画效果和浏览器兼容性：

```javascript
import { Toaster, toast } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <button onClick={() => toast.success("操作成功!")}>显示通知</button>
    </>
  );
}
```

- [repo: emilkowalski/sonner](https://github.com/emilkowalski/sonner)
