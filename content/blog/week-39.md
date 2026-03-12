---
title: "Node.js 22 成为 LTS 版本,React 编译器进入 Beta 阶段"
date: 2024-10-31T00:00:00.000Z
release: 39
description: "本周重点关注 Node.js 和 React 生态系统的重大更新：Node.js 22 正式成为 LTS 版本，将持续维护至 2025 年底；React 编译器进入 Beta 阶段，通过自动记忆化优化性能；Next.js 15 发布，带来 Turbopack 稳定版和异步 API 重构。工具方面，Transformers.js v3 支持在 Node.js 运行 AI 模型，Chakra UI v3 完成重写。技术文章深入探讨了 Git 仓库优化、Node.js Streams 和 PostgreSQL 数据处理等话题。
"
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 小技巧

- 使用 VS Code 的 Remote Repositories 扩展可以直接从编辑器中打开 GitHub 仓库
- 在 Node.js 中设置默认时区可以通过 process.env.TZ 实现
- 使用 npm audit 可以检查项目依赖中的安全漏洞
- Chrome DevTools 支持使用 Command + P (Mac) 或 Ctrl + P (Windows) 快速打开文件
- 使用 UTF-8 编码可以解决大多数 PostgreSQL 字符编码问题

## 文章推荐

### 一、 [如何缩减 JavaScript Monorepo Git 仓库大小](https://www.jonathancreamer.com/how-we-shrunk-our-git-repo-size-by-94-percent/)

文章详细介绍了 Microsoft 团队如何将一个 178GB 的 JavaScript monorepo 仓库大小减少到 5GB。主要发现和解决了两个关键问题：

1. 单文件夹存储过多文件导致的 Git 树对象膨胀

   - 发现 Beachball change 文件累积至 40k 个造成性能问题
   - 实现了自动清理和合并 change 文件的流水线

2. Git 打包算法的局限性

   - 发现 Git 只对文件名后 16 个字符做比较导致压缩效率低
   - 使用新的基于路径的打包算法解决问题：

   ```bash
   # 使用新的打包命令
   git repack -adf --path-walk

   # 配置更好的推送压缩
   git config --global pack.usePathWalk true
   ```

这些优化已被提交到 Git for Windows (PR #5171)，并将合并到上游。对于任何包含大量长文件名(如 CHANGELOG.md)的大型 monorepo 来说，这些优化都很有价值。

### 二、 [Node.js 中的管道和消失的字节问题](https://sxlijin.github.io/2024-10-09-node-stdout-disappearing-bytes)

文章深入探讨了 Node.js 中使用管道时的数据丢失问题。主要发现在 POSIX 系统上，process.stdout 在写入管道时的行为与写入文件或终端时不同：

1. 管道容量限制

   - Linux 系统上管道默认容量为 65,536 字节(16 页)
   - 超出容量的数据可能会丢失

2. 同步/异步写入差异

```javascript
// 在退出前数据可能未完全写入管道
process.stdout.write("@".repeat(128 * 1024));
process.exit(0);

// 写入文件正常，但通过管道只能得到 65536 字节
// 写入文件: 131072 字节
// 通过管道: 65536 字节
```

解决方案是监听 drain 事件，等待管道可写后再继续写入数据。这个问题在处理大量数据输出时特别需要注意，比如日志记录或 JSON 数据传输场景。

### 三、 [构建 Node.js Streams 的心智模型](https://blog.insiderattack.net/building-a-mental-model-of-node-js-streams-87c5364fb747)

深入解析 Node.js Streams 的工作原理，帮助开发者建立正确的心智模型。包括：

1. 核心概念：

   - 基于事件驱动架构
   - 内部缓冲机制
   - 背压(Backpressure)控制
   - 管道链接(Piping)能力

2. 主要应用场景：

```javascript
// 处理大文件示例
import { createReadStream } from "fs";

const stream = createReadStream("large-file.txt", {
  highWaterMark: 1024, // 设置缓冲区大小
});

stream.on("data", (chunk) => {
  // 分块处理数据
});
```

3. 使用建议：
   - 适用于实时数据处理
   - 适合网络交互场景
   - 处理大型数据集
   - 数据转换流程

文章强调，当数据已完全在内存中时不建议使用 Streams，避免增加不必要的复杂性。

### 四、 [PostgreSQL 中创建日期分组的四种方法](https://www.crunchydata.com/blog/4-ways-to-create-date-bins-in-postgres-interval-date_trunc-extract-and-to_char)

文章详细介绍了在 PostgreSQL 中进行日期分组的四种方法及其最佳使用场景：

1. INTERVAL - 适用于连续时间分组

```sql
-- 使用 INTERVAL 进行时间范围分组
SELECT
  CASE
    WHEN order_date >= NOW() - '30 days'::interval THEN '近30天'
    WHEN order_date >= NOW() - '60 days'::interval THEN '30-60天'
    ELSE '60-90天'
  END AS date_range,
  COUNT(*) AS total_orders
FROM orders
WHERE order_date >= NOW() - '90 days'::interval
GROUP BY date_range;
```

2. date_trunc - 最简单的预定义时间分组方式

```sql
-- 按月分组统计订单
SELECT
  date_trunc('month', order_date) AS month,
  COUNT(*) AS total_orders,
  SUM(total_amount) AS monthly_total
FROM orders
GROUP BY 1
ORDER BY month;
```

3. extract - 提取特定时间维度

```sql
-- 按每周的具体小时统计
SELECT
  extract('dow' from order_date) AS day_of_week,
  extract('hour' from order_date) AS hour,
  COUNT(*) AS total_orders
FROM orders
GROUP BY 1, 2;
```

4. to_char - 灵活的格式化输出

```sql
-- 自定义季度格式输出
SELECT
  to_char(order_date, '"Q"Q-YYYY') AS formatted_quarter,
  SUM(total_amount) AS total_amount
FROM orders
GROUP BY 1;
```

文章强调每种方法都有其适用场景：INTERVAL 适合连续时间段分析，date_trunc 最适合标准时间单位分组，extract 适合提取特定时间维度，而 to_char 则在需要自定义输出格式时最为有用。

### 五、 [使用 CTID 进行数据清理分页](https://www.shayon.dev/post/2024/303/using-ctid-based-pagination-for-data-cleanups-in-postgresql/)

文章介绍了如何利用 PostgreSQL 的 CTID 字段进行高效的数据清理：

- CTID 是每行数据的物理位置标识
- 结合物理页面和行位置信息
- 可用于预测性能的数据分块处理

## 开源与库

### 一、 [Chakra UI v3: 全新重写的 React 组件库](https://chakra-ui.com/)

Chakra UI v3 是一个完全重写的版本,提供了一套全面的、可访问的、可复用的 React 组件。新版本采用现代标准重写,提供了更好的性能和开发体验。

```jsx
import { Button, ButtonGroup } from "@chakra-ui/react";

function Example() {
  return (
    <ButtonGroup variant="outline" spacing="6">
      <Button colorScheme="blue">Save</Button>
      <Button>Cancel</Button>
    </ButtonGroup>
  );
}
```

- [repo: chakra-ui/chakra-ui](https://github.com/chakra-ui/chakra-ui)

### 二、 [Recharts 2.13: 基于 React 和 D3 的图表库](https://recharts.org)

Recharts 是一个基于 React 和 D3 构建的声明式图表库,支持原生 SVG。提供了线形图、柱状图、散点图、饼图等多种图表类型。

```jsx
import { LineChart, Line, XAxis, YAxis } from "recharts";

const data = [
  { name: "Page A", uv: 400 },
  { name: "Page B", uv: 300 },
];

function Example() {
  return (
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <XAxis dataKey="name" />
      <YAxis />
    </LineChart>
  );
}
```

- [repo: recharts/recharts](https://github.com/recharts/recharts)

## 开发利器

### 一、 [Transformers.js v3: 在 Node.js 运行 AI 模型](https://huggingface.co/docs/transformers.js)

Transformers.js 是 Hugging Face transformers Python 库的 JavaScript 移植版本，让开发者能在 Node.js、Deno 和 Bun 环境中运行机器学习模型。v3 版本新增了 WebGPU 支持，提供了 1200+ 个预训练模型。

主要特性：

- 支持文本分类、问答、文本生成等任务
- 内置模型量化和优化
- 支持 WebGPU 加速
- 提供离线使用能力

```javascript
import { pipeline } from "@xenova/transformers";

// 创建文本分类管道
const classifier = await pipeline("sentiment-analysis");

// 运行推理
const result = await classifier("I love transformers!");
// [{ label: 'POSITIVE', score: 0.9999998807907104 }]
```

- [repo: xenova/transformers.js](https://github.com/xenova/transformers.js)

### 二、 [Tinybench 3.0: 轻量级基准测试库](https://github.com/tinylibs/tinybench)

Tinybench 是一个小巧简单的基准测试库,利用可用的精确计时功能(如 process.hrtime 或 performance.now)。你可以对任何函数进行基准测试,指定运行时间或次数,并获得各种统计数据。

```javascript
import { Bench } from "tinybench";

const bench = new Bench();

bench
  .add("Array.from", () => {
    Array.from(new Array(1000).keys());
  })
  .add("Spread", () => {
    [...new Array(1000).keys()];
  });

await bench.run();
console.table(bench.table());
```

- [repo: tinylibs/tinybench](https://github.com/tinylibs/tinybench)

### 三、 [Dependency Cruiser 16.5: 依赖关系可视化工具](https://github.com/sverweij/dependency-cruiser)

Dependency Cruiser 是一个强大的依赖关系可视化工具,可以帮助你理解项目中的依赖关系。它支持生成依赖图,并提供了多个流行项目的实例图表展示。

```bash
# 安装
npm install --save-dev dependency-cruiser

# 生成依赖图
npx depcruise --include-only "^src" --output-type dot src | dot -T svg > dependencygraph.svg
```

- [repo: sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser)

### 四、 [Wireit: 智能化 npm/Yarn 脚本工具](https://github.com/google/wireit)

Wireit 扩展了 npm run 的功能,为脚本添加了结果缓存、并行化执行和文件变更监听等特性。同时提供了 VS Code 扩展来帮助编写增强型脚本。

```json
{
  "scripts": {
    "build": "wireit"
  },
  "wireit": {
    "build": {
      "command": "tsc",
      "files": ["src/**/*.ts"],
      "output": ["dist/**"]
    }
  }
}
```

- [repo: google/wireit](https://github.com/google/wireit)

### 五、 [pgdoc.link：PostgreSQL 文档搜索新方式](https://pgdoc.link)

pgdoc.link 是一个新的 PostgreSQL 文档搜索工具，它能够智能处理文档查询的歧义性：

- 如果搜索结果唯一，直接跳转到对应文档
- 如果存在多个匹配，会显示帮助页面解决歧义
- 支持模糊搜索和关键词匹配

## 版本发布

### 一、 [Node.js v22.11.0 成为 LTS 版本](https://nodejs.org/en/blog/release/v22.11.0)

Node.js v22.11.0 正式成为 LTS (Long Term Support) 版本,代号为 'Jod'。

这意味着 Node.js 22 从前沿的 'Current' 版本转变为可靠的长期支持版本。该版本将持续维护到 2025 年底。

### 二、 [React 编译器进入 Beta 阶段](https://react.dev/blog/2024/10/21/react-compiler-beta-release)

React 团队宣布 React 编译器进入 Beta 阶段，这是一个通过构建时自动记忆化(memoization)来优化 React 应用性能的工具。主要更新包括：

1. 现已支持 React 17+ 版本，通过可选的 react-compiler-runtime 包提供支持
2. 开放 React Compiler 工作组成员资格，为社区逐步采用编译器做准备
3. Meta 内部已在 Facebook、Instagram、Quest Store 等多个主要应用中部署使用

使用方式：

```bash
# 安装编译器和 ESLint 插件
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
```

根据 Meta 的数据分析，以前的手动 memoization 方式会导致 PR 开发时间增加 31-46%，而编译器可以自动处理所有代码的记忆化。

Meta 内部使用显示即使在经过高度优化的应用中也能带来显著的性能提升。

团队强烈建议开发者现在就开始使用 ESLint 插件，为后续完整采用编译器做准备。

### 三、 [Next.js 15 正式发布](https://nextjs.org/blog/next-15)

Next.js 15 正式发布，带来了多项重大更新：

1. 新增 @next/codemod CLI 工具，可自动升级依赖并应用代码迁移
2. 异步请求 API 重构，headers/cookies/params 等 API 变为异步调用
3. 默认使用 React 19 RC 版本，Pages Router 保持对 React 18 的兼容
4. Turbopack 开发服务器稳定版发布，提供更快的开发体验：
   - 本地服务器启动速度提升 76.7%
   - 代码更新热更新速度提升 96.3%
   - 初始路由编译速度提升 45.8%
5. 其他改进：
   - 新增静态路由指示器
   - 支持 next.config.ts
   - 新增 Form 组件增强表单功能
   - 改进了服务端组件的热更新性能

使用示例：

```bash
# 使用新的升级 CLI
npx @next/codemod@canary upgrade latest
```
