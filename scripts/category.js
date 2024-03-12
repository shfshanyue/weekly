const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const _ = require('midash')
const { getMaxWeek } = require('./max-week')
const prettier = require('prettier')

async function getAssetData () {
  const maxWeek = await getMaxWeek()
  const docs = _.range(1, maxWeek + 1)
    .map(n => `./docs/week-${n}.yaml`)
    .filter(file => fs.existsSync(file))
    .map(file => yaml.load(fs.readFileSync(file), 'utf8'))
  const tools = docs.flatMap(x => x.tools || []).reverse()
  const articles = docs.flatMap(x => x.articles || []).reverse()
  const packages = docs.flatMap(x => x.libraries || []).reverse()
  const releases = docs.flatMap(x => x.releases || []).reverse()
  const tips = docs.flatMap(x => x.tips).reverse()
  return {
    tools,
    articles,
    packages,
    releases,
    tips
  }
}

function render (articles) {
  return articles.map((lib, i) => {
    if (!lib || !lib.title || !lib.link) {
      console.log('Error:', lib, articles)
      return ''
    }
    return `
### **${i+1}、 [${lib.title}](${lib.link})**

${lib.description || ''}

${lib.github ? `+ [repo: ${lib.github.replace('https://github.com/', '')}](${lib.github})` : ''}
${lib.package ? `+ [npm: ${lib.package}](https://npmjs.com/package/${lib.package})` : ''}
    `
  }).join('\n')
}

async function getAsset () {
  const { tools, articles, packages, releases, tips } = await getAssetData()
  const toolsMd = `---
title: 前端优秀开发者工具大集合
date: ${new Date().toJSON()}
---

${render(tools)}
`

  const articlesMd = `---
title: 前端优秀文章推送大汇总
date: ${new Date().toJSON()}
---


${render(articles)}
`

  const packagesMd = `---
title: 前端这些有趣的库
date: ${new Date().toJSON()}
---


${render(packages)}
`

  const releasesMd = `---
title: 前端重大发版记录
date: ${new Date().toJSON()}
---


${render(releases)}
`

  const tipsMd = `---
title: 前端一句话消息
date: ${new Date().toJSON()}
---


${tips.map(x => `+ ${x}`).join('\n')}
`

  const format = content => prettier.format(content, { parser: 'markdown' })
  fs.writeFileSync(path.join(__dirname, `../content/blog/tool.md`), await format(toolsMd))
  fs.writeFileSync(path.join(__dirname, `../content/blog/article.md`), await format(articlesMd))
  fs.writeFileSync(path.join(__dirname, `../content/blog/package.md`), await format(packagesMd))
  fs.writeFileSync(path.join(__dirname, `../content/blog/tip.md`), await format(tipsMd))
  fs.writeFileSync(path.join(__dirname, `../content/blog/release.md`), await format(releasesMd))
}

getAsset()