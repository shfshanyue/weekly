const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const minimist = require('minimist')
const prettier = require('prettier')

interface Item {
  link?: string
  title: string
  description: string
  github?: string
  package?: string
  translation?: string
}

interface Thumbnail {
  alt: string
  image: string
  description: string
}

interface WeeklyData {
  title: string
  description?: string
  date: string
  tools: Item[]
  tips: string[]
  news: string[]
  libraries: Item[]
  articles: Item[]
  releases?: Item[]
  thumbnail?: Thumbnail
  snippets?: Item[]
  week: number
}

// 将中文数字抽离为常量
const CHINESE_NUMBERS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'] as const

// 重构 render 函数，将渲染逻辑拆分
function renderItem({ link, title, description, github, package: pkg, translation }: Item): string {
  const titleSection = link ? `[${title}](${link})` : title
  const metaLinks = [
    github && `[repo: ${github.replace('https://github.com/', '')}](${github})`,
    pkg && `[npm: ${pkg}](https://npm.devtool.tech/${pkg})`,
    translation && `[跳转译文](${translation})`
  ].filter(Boolean)

  return [
    titleSection,
    description,
    ...metaLinks.map(link => `+ ${link}`)
  ].join('\n\n')
}

function render(list: Item[]): string {
  return list.map((item, i) => {
    return `
### ${CHINESE_NUMBERS[i]}、 ${renderItem(item)}
    `.trim()
  }).join('\n\n')
}

// 优化 renderWord 函数
function renderWord(tips: string[] = [], news: string[] = []): string {
  const words = [...tips, ...news]
  if (!words.length) return ''
  
  return words.map(word => `+ ${word}`).join('\n')
}

// 优化 renderThumbnail 函数
function renderThumbnail(thumbnail?: Thumbnail): string {
  if (!thumbnail) return ''
  
  const { alt, image, description } = thumbnail
  return `
## 封面

![${alt}](${image})

${description}
`.trim()
}

// 将模板字符串拆分为更小的部分
function renderHeader(data: WeeklyData): string {
  return `---
title: "${data.title}"
date: ${new Date(data.date).toJSON()}
release: ${data.week}
${data.description && `description: "${data.description}"`}
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

+ 订阅网站: <https://weekly.shanyue.tech>
+ 订阅Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
+ [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)`
}

function template(data: WeeklyData): string {
  const sections = [
    renderHeader(data),
    renderThumbnail(data.thumbnail),
    (data.tips.length || data.news.length) && '## 小技巧',
    renderWord(data.tips, data.news),
    '## 文章推荐',
    render(data.articles),
    '## 开源与库',
    render(data.libraries),
    '## 开发利器',
    render(data.tools),
    data.snippets && '## 代码片段',
    data.snippets && render(data.snippets),
    data.releases && '## 版本发布',
    data.releases && render(data.releases)
  ].filter(Boolean)

  return sections.join('\n\n')
}

// 优化错误处理
async function generateWeek(week: number = 1): Promise<void> {
  try {
    const filePath = `./docs/week-${week}.yaml`
    const outputPath = path.join(__dirname, `../content/blog/week-${week}.md`)
    
    const doc = yaml.load(fs.readFileSync(filePath, 'utf8')) as Omit<WeeklyData, 'week'>
    const content = await prettier.format(
      template({ ...doc, week }), 
      { parser: 'markdown' }
    )
    
    fs.writeFileSync(outputPath, content)
    console.log(`Successfully generated week ${week}`)
  } catch (error) {
    console.error(`Failed to generate week ${week}:`, error)
    process.exit(1)
  }
}

const argv = minimist(process.argv.slice(2))
generateWeek(argv.week)