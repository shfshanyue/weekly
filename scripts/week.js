const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const minimist = require('minimist')
const prettier = require('prettier')

function render (list) {
  const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
  return list.map(({ link, title, description, github, package, translation }, i) => {
    return `
### ${numbers[i]}、 ${link ? `[${title}](${link})` : title}

${description}

${github ? `+ [repo: ${github.replace('https://github.com/', '')}](${github})` : ''}
${package ? `+ [npm: ${package}](https://npm.devtool.tech/${package})` : ''}
${translation ? `+ [跳转译文](${translation})` : ''}
    `
  }).join('\n')
}

function renderThumbnail (thumbnail) {
  if (!thumbnail) {
    return ''
  }
  return `
## 封面

![${thumbnail.alt}](${thumbnail.image})

${thumbnail.description}
`
}

function renderWord (tips = [], news = []) {
  const words = [...tips, ...news]
  if (!words.length) {
    return ''
  }
  return words.map(x => {
    return `+ ${x}`
  }).join('\n')
}

function template({ title, date, tools, tips, news, libraries, articles, releases, thumbnail, snippets, week }) {
  return `---
title: "${title}"
date: ${new Date(date).toJSON()}
release: ${week}
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

+ 订阅网站: <https://weekly.shanyue.tech>
+ 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
+ [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

${renderThumbnail(thumbnail)}

${renderWord(tips, news)}

## 文章推荐

${render(articles)}

## 开源与库

${render(libraries)}

## 开发利器

${render(tools)}


${snippets ? '## 代码片段' : ''}

${render(snippets || [])}


${releases ? '## 版本发布' : ''}

${render(releases || [])}
`
}

async function generateWeek (week = 1) {
  const doc = yaml.load(fs.readFileSync(`./docs/week-${week}.yaml`), 'utf8')
  const content = await prettier.format(template({ ...doc, week }), {
    parser: 'markdown'
  })
  fs.writeFileSync(path.join(__dirname, `../content/blog/week-${week}.md`), content)
}

const argv = minimist(process.argv.slice(2))
generateWeek(argv.week)