---
name: weekly-read
version: 0.1.0
description: >-
  从一期「开发者 AI 周刊」的技术文章里挑五篇，每篇做一支 3–5 分钟的 B 站单篇精读视频（全屏原文网页 + 手绘荧光笔 + 原句下方展开中文译文 + 克隆口播），一次做完、用定时发布排成每天一支。当用户说「做第 N 期精读」「单篇视频」「精读视频」时使用。
---

# 单篇精读视频 (weekly-read)

一期周刊 → 五支 `video/reads/<N>-<slug>/out/program.mp4`（1920×1080，每支 3–5 分钟）+ 每支四张主封面、五张矩阵封面 + B 站投稿文案（含定时发布时间）。周刊视频做完后再做；五支一次做完、一次上传完，用 B 站「定时发布」排成每天一支。

设计文档：`docs/superpowers/specs/2026-11-12-weekly-read-video-design.md`。视觉规范：`video/frame.md`「单篇精读」一节。环境、声音参数、多音字、B 站上传的基本步骤都和 `weekly-video` 相同，本文只写不同的地方。

## 目录

```
video/
  scripts/capture.mjs        抓取；episode.json 是 format: "read" 时整篇抓、3 倍清晰度、按高度切片
  scripts/tts.py             同周刊，只读 scenes[].lines
  scripts/build-read.mjs     单篇生成器（全屏网页、聚光、手绘荧光笔、裂开译文、大字卡、配图放大）
  scripts/publish-read.mjs   单篇标题 / 标签 / 定时 / 简介 + 主封面四张 + 矩阵五张
  scripts/lib/               build / build-read / publish / publish-read 共用（口播时间、声音后期、工程组装、封面）
  reads/<N>-<slug>/          一支一个 HyperFrames 工程，如 reads/66-memory/
    episode.json             唯一手写、唯一提交的文件
```

`.gitignore` 忽略 `video/reads/*/` 下除 `episode.json` 外的一切。改了 `scripts/lib/` 后，对一期周刊重跑 `build.mjs` / `publish.mjs`，确认周刊输出不变。

## 流程

1. **选文**：读 `src/content/blog/weekly-N.md` 的「技术文章」（不选工具推荐），挑五篇。条件：原文够讲 3 分钟以上（约 1500 英文词以上）；有可核对的数字或能讲清的机制；网页能抓（`--dump` 能导出正文）。列出五篇、每篇一句理由和发布顺序（day 1–5），**等山月确认后**再写口播。新版式或新一批的第一支先做样片，山月看过再做其余四支。
2. **建工程**：`video/reads/<N>-<slug>/episode.json`，复制上一支作模板。顶层：`format: "read"`、`issue`、`slug`、`day`、`title`（文章中文标题，取周刊卡片标题）、`web`（周刊网址 `https://weekly.shanyue.tech/weekly-N/`）、`capture: {dpr: 3}`、`pages`（一个）。
3. **抓取**：`node scripts/capture.mjs reads/<N>-<slug> --dump` 导出正文到 `.work/pages/`，逐字复制要划线的原句写进 `pages.<id>.highlights`（每支约 12–20 句，每句带 `zh` 译文）；要放大的原文配图写进 `pages.<id>.figures: [{id, match}]`，`match` 取图片 `src` 或 `alt` 里一段唯一的字符串（`--dump` 的正文里能看到图片地址）。再不带 `--dump` 跑一次，高亮和配图必须全部 `found`。日志给出长图尺寸、切片数和正文栏。
4. **口播**（写进 `scenes`）：见下方「口播」。写完扫多音字（同周刊，`voice.json` 的 `polyphones` 或 `say`），再跑 `.venv/bin/python scripts/tts.py reads/<N>-<slug>`（一支约 60 句，M4 约 10–15 分钟，后台跑；五支可以依次排队）。
5. **生成**：`node scripts/build-read.mjs reads/<N>-<slug>`，输出划线数、配图数、大字卡数、总长和章节。总长不在 2:30–5:30 会打印警告：太短补一段原文，太长删次要小节，不要调语速。另一类警告是「上一处译文只停了 Xs」：两个 beat 离得太近，译文还没读完就被收起。处理办法依次是：把后一个 beat 的 `at` 挪到同句更靠后的词或下一句；缩短高亮原句和译文；实在不行删掉一个 beat。
6. **检查**：工程目录里 `npx hyperframes lint`、`npx hyperframes check`（`font_face_local_only` 警告是已知的，可忽略）。用 `npx hyperframes snapshot --at <秒,...>` 在每个 beat 划线后约 2 秒截图（`timeline.json` 有场景起点，`compositions/<场景>.html` 里能看到每个 beat 的时间），看：译文块有没有压住原文、裂缝是不是正好在划线那句最后一行下面、切片拼接处有没有缝、批注有没有挡住正亮着的句子、字幕有没有压住译文。再逐个 beat 对口播：口播里的数字和事实，必须出现在念这句时正亮着的那句原文里（规则同周刊）。
7. **渲染**：`npx hyperframes render -o out/program.mp4`，ffprobe 核对时长与音轨。
8. **发布材料**：写好 `bilibili`（见下方），跑 `node scripts/publish-read.mjs reads/<N>-<slug>` → `out/bilibili.md` + 封面。只改文案用 `--copy`。

五支都走完 2–8 后再统一上传。

## episode.json 要点

- 场景只有 `read` 一种，`props.page` 指向 `pages` 的 id。一篇文章按原文小节拆成 7–10 个场景，共用一张长图，镜头在场景之间接着走。`chapter` 是小节名，进 B 站简介时间轴。
- `beats[]`：`at`（该场景口播里的原词，找不到 build 报错）+ 下面任意一项：
  - `highlight`：划线。页面滚到这句、聚光、荧光笔、原句下方裂开写入 `zh`。下一个划线或配图开始时缝合。
  - `figure`：配图放大，推近到这张图铺满字幕上方。全片最多 3 次。
  - `stat: {value, label, until?}`：数字大字卡，停约 2.6 秒或到 `until` 那个原词。数字必须出现在当时亮着的那句原文里。全片最多 2 次。
  - `note`：红色批注，写山月的判断（不写翻译），约 12 字以内。
  - `outro: true`：结尾小卡（周刊期号 + 网址），放在最后一个场景念「原文和周刊链接」的地方。
- 高亮原句尽量是一整句或一个完整分句：太短（几个词）裂开的缝显得突兀，太长（超过三行）译文块会很高。
- `bilibili`：
  - `zone`：默认 `人工智能`。
  - `publishAt`：`YYYY-MM-DD HH:mm`，北京时间。默认第一支是上传日次日 12:00，之后每支加一天；`publish-read.mjs` 检查它在「现在 + 2 小时」到「现在 + 15 天」之内。隔天才上传时记得整体顺延。
  - `tags`：6–10 个，必须含 `开发者AI周刊`、`AI精读`，其余用文章里的专有名词。
  - `intro`：两三句，说清这篇讲什么、最关键的数字或结论。时间轴、原文链接、周刊链接由脚本拼上。
  - `cover`：`lines`、`mark`、`sub`，可选 `scene`、`highlight`、`note`（同周刊）。kicker 自动是「开发者 AI 周刊 · #N · 精读」。
  - `matrix`：正好五项，每项 `scene`、`highlight`、`lines`、`mark`、`note`，用五处不同的划线。
- 投稿标题由脚本生成：`开发者 AI 周刊 #N 精读｜<title>`，≤ 80 字。

## 口播

- 每支约 50–70 句、每句 ≤ 40 字，按原文顺序带读。口播是转述和解释，**不念译文**；译文在画面上，口播讲「这句话为什么重要、意味着什么」。
- 第一句「这里是开发者 AI 周刊第 N 期精读。」接一句这篇讲什么、为什么值得看。不说「大家好」。
- 最后一个场景：先讲局限（原文自己承认的），再给落地判断，然后「原文和周刊链接都在简介里。」，最后一句第 1–4 支「我是山月，我们明天见。」，第 5 支「我是山月，我们下期周刊见。」
- 去 AI 味按 `dev-ai-weekly` §4.7.1；英文产品名照写，数字念法不稳时加 `say`（标点与 `text` 一致）。
- 不加原文没有的事实或数字；数字讲错算失败。

## 译文（`zh`）

- 忠实原文，不增不减；术语和产品名保留英文（必要时括号注中文）。
- 原句是半句时，译文也是半句，不补主语。
- 一句译文最好不超过两行（约 60 字）；原句太长就把高亮缩短到关键分句。

## B 站上传（ego-browser）

步骤同 `weekly-video`「B 站上传」，另外：

1. 一个 task space 传完五支（如「B站投稿 #N 精读」），按 day 1–5 的顺序。
2. 主封面传 `out/cover.png`，矩阵传 `cover-matrix-1` 到 `cover-matrix-5`。
3. 合集：选「开发者 AI 周刊 · 精读」，不存在就在第一支创建。
4. 打开「定时发布」，填 `out/bilibili.md` 里的定时时间（北京时间）。
5. 每支停在填好的页面，`handOff()`；山月明确说让你点时才点「投稿」，每支只点一次，再到稿件管理核对状态是「待发布」和定时时间。

## 已知坑

- 抓取用 3 倍清晰度，长文切成多张 ≤ 8192 设备像素的切片；生成器把上半层用 `<img>`、下半层用 CSS 背景拼，避免同一张图出现两个 `<img>` 被 HyperFrames 重复收集。
- 做无声干跑（不等 TTS 先看版面）时，假口播不能是纯静音：响度归一会算出 NaN。用粉噪之类的占位音。
- 抓取会把图片改成立即加载并等解码完再截图；3 倍清晰度下配图是 3000–4000 px 宽的大图，不等会截出空白框。日志出现「图片没加载出来」时重跑。
- 样片 #66 memory：9 个场景、59 句、35 处划线、3 次配图、1 张大字卡，4:52，渲染约 3 分钟（M4）。
