const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2))

const doc = yaml.load(fs.readFileSync(`./docs/week-${argv.week || 1}.yaml`), 'utf8')

const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九']

const render = (articles) => {
  return articles.map((lib, i) => {
    return `
### **${numbers[i]}、 ${lib.link ? `[${lib.title}](${lib.link})` : lib.title}**

${lib.description}

${lib.github ? `+ [repo: ${lib.github.replace('https://github.com/', '')}](${lib.github})` : ''}
${lib.package ? `+ [npm: ${lib.package}](https://npm.devtool.tech/${lib.package})` : ''}
${lib.translation ? `+ [跳转译文](${lib.translation})` : ''}
    `
  }).join('\n')
}

const renderThumbnail = (thumbnail) => {
  if (!thumbnail) {
    return ''
  }
  return `
## 封面

![${thumbnail.alt}](${thumbnail.image})

${thumbnail.description}
`
}

function toMarkdown ({ title, date, tools, tips = [], news = [], libraries, articles, releases, thumbnail, snippets = [] }) {
  return `---
title: "第 ${argv.week || 1} 期: ${title}"
date: ${new Date(date).toJSON()}
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

+ 订阅网站: <https://weekly.shanyue.tech>
+ 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
+ [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA3MzU0MjIzMA==&action=getalbum&album_id=1761820812803620868&scene=21#wechat_redirect)

${renderThumbnail(thumbnail)}

## 一句话

${
  [...tips, ...news].map(x => {
    return `+ ${x}`
  }).join('\n')
}

## 开发利器

${render(tools)}

## 文章推荐

${render(articles)}

## 代码片段

${render(snippets)}

## 开源与库

${render(libraries)}

## 版本发布

${render(releases)}
`
}

fs.writeFileSync(path.join(__dirname, `content/blog/week-${argv.week}.md`), toMarkdown(doc))
