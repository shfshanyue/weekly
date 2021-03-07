const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const _ = require('lodash')

const docs = _.range(1, 3).map(n => yaml.load(fs.readFileSync(`./docs/week-${n}.yaml`), 'utf8'))

const tools = _.flatMap(docs, 'tools').reverse()
const articles = _.flatMap(docs, 'articles').reverse()
const packages = _.flatMap(docs, 'libraries').reverse()
const releases = _.flatMap(docs, 'releases').reverse()
const tips = _.flatMap(docs, 'tips').reverse()

const render = (articles) => {
  return articles.map((lib, i) => {
    return `
### **${i+1}、 [${lib.title}](${lib.link})**

${lib.description}

${lib.github ? `+ [repo: ${lib.github.replace('https://github.com/', '')}](${lib.github})` : ''}
${lib.package ? `+ [npm: ${lib.package}](https://npmjs.com/package/${lib.npm})` : ''}
    `
  }).join('\n')
}

const toolsMd = `---
title: 前端开发者武器库大全
---

${
  render(tools)
}
`

const articlesMd = `---
title: 前端优秀文章推送大汇总
---


${
  render(articles)
}
`

const packagesMd = `---
title: 前端有趣的库
---


${
  render(packages)
}
`

const releasesMd = `---
title: 前端重大发版记录
---


${
  render(releases)
}
`

const tipsMd = `---
title: 前端一句话消息
---


${
  tips.map(x => `+ ${x}`).join('\n')
}
`

fs.writeFileSync(path.join(__dirname, `content/blog/tool.md`), toolsMd)
fs.writeFileSync(path.join(__dirname, `content/blog/article.md`), articlesMd)
fs.writeFileSync(path.join(__dirname, `content/blog/package.md`), packagesMd)
fs.writeFileSync(path.join(__dirname, `content/blog/tip.md`), tipsMd)
fs.writeFileSync(path.join(__dirname, `content/blog/release.md`), releasesMd)
