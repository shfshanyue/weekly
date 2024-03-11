# 参与周刊

``` bash
# 新建一个新的周刊，比如第 100 期
$ vim docs/week-100.yaml

# 将第 100 期周刊生成 markdown 内容
$ node scripts/week.js --week 100

# 或者将 1-100 期周刊生成 markdown 内容
$ seq 1 100 | xargs -I {} node scripts/week.js --week {}

# 进行开发模式，查看效果
$ npm run dev
```

## 周刊字段

字段如下所示，其中 `thumbnail`，`news`，`releases`，`snippets` 字段为空时不会生成。其中 `releases` 已考虑废弃。

``` yaml
date: 2021-04-12
title: "使用 Emmet 提高 Web 开发效率"
thumbnail:
  image: URL
  alt: 盘州暴鱼
  description: |
    贵州盘州发现2.44亿年前一种大型肉食性基干新鳍鱼类的化石，命名为盘州暴鱼
tips:
  - "在 VSCode 中，通过快捷键 <Ctrl + K + Z> 可快速进入禅模式 (View: Toggle Zen Mode)"
news:
  - 市场监管总局依法对阿里巴巴的“二选一”垄断行为作出行政处罚，处以其2019年中国境内销售额4557.12亿元4%的罚款，计182.28亿元
  - 贵州盘州发现2.44亿年前一种大型肉食性基干新鳍鱼类的化石，命名为盘州暴鱼
  - 截至2021年3月末，我国外汇储备规模为31700亿美元，较2月末下降350亿美元，降幅为1.09%
articles:
  - title: 纯 Javascript 代码片段大全
    link: https://www.smashingmagazine.com/2021/04/vanilla-javascript-code-snippets/
    description: |
      <description>
libraries:
  - title: charts.css
    package: charts.css
    link:  https://chartscss.org/
    github: https://github.com/ChartsCSS/charts.css
    description: |
      <description>
tools:
  - title: "Emmet: Web 开发者的利器"
    link: https://emmet.io/
    github: https://github.com/emmetio/emmet
    description: |
      <description>
releases:
  - title: "Tailwind CSS v2.1"
    link: https://blog.tailwindcss.com/tailwindcss-2-1
    date: 2021-04-06
    description: |
      <description>
snippets:
  - title: 使用可选链操作符替代 lodash.get
    description: |
      ``` js
      const object = { a: [{ b: { c: 3 } }] }
      const result = object?.a?.[0]?.b?.c ?? 1
      console.log(result)
      //=> 3
      ```
```