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
### **${numbers[i]}、 [${lib.title}](${lib.link})**

${lib.description}

${lib.github ? `+ [repo: ${lib.github.replace('https://github.com/', '')}](${lib.github})` : ''}
${lib.package ? `+ [npm: ${lib.package}](https://npmjs.com/package/${lib.npm})` : ''}
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

function toMarkdown ({ title, date, tools, tips, news, libraries, articles, releases, thumbnail }) {
  return `---
title: "第 ${argv.week || 1} 期: ${title}"
date: ${new Date(date).toJSON()}
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等。每周一发布，欢迎订阅

${renderThumbnail(thumbnail)}

## 一句话

${
  [...tips, ...news].map(x => {
    return `+ ${x}`
  }).join('\n')
}

## 开源与库

${render(libraries)}

## 文章推荐

${render(articles)}

## 开发利器

${render(tools)}

## 版本发布

${render(releases)}
`
}

fs.writeFileSync(path.join(__dirname, `content/blog/week-${argv.week}.md`), toMarkdown(doc))
