---
name: weekly-video
version: 0.3.4
description: >-
  把一期「开发者 AI 周刊」做成 B 站横屏视频（克隆口播 + 原文网页荧光笔 + 动画图解）。当用户说「做第 N 期视频」「周刊视频」「B 站视频」「weekly video」时使用。
---

# 周刊视频 (weekly-video)

一期周刊 → `video/episodes/weekly-N/out/program.mp4`（1920×1080）+ SRT 字幕 + 主封面四张（16:9、4:3、3:4、9:16）+ 封面矩阵六张 + B 站发布文案。用户只看成片，并从五条投稿标题里选一条；不审口播稿和分镜。稳定输出优先于花样。

设计文档：`docs/superpowers/specs/2026-10-19-bilibili-video-weekly-design.md`。视觉规范：`video/frame.md`（B 风格：纸面编辑感、黄色荧光笔、红色批注）。

## 目录

```
video/                      独立 npm 包，不进根目录 pnpm workspace
  scripts/capture.mjs       抓原文网页长图 + 重点句坐标
  scripts/tts.py            克隆语音逐句合成 + Whisper 字级对齐（带指纹缓存）
  scripts/build.mjs         episode.json → HyperFrames 工程（index.html + compositions/*）
  scripts/publish.mjs       B 站五条标题 / 分区 / 标签 / 简介 / 时间轴 / 链接 + 主封面四张 + 矩阵六张
  scripts/chrome.mjs        色板、字体声明、Chrome 窗口外框（build 与 publish 共用）
  voice.json                声音克隆参数（参考音在 video/ref/）
  frame.md                  视觉规范
  episodes/weekly-N/        每期一个 HyperFrames 工程
    episode.json            唯一手写的数据：口播稿、分镜、网页与高亮原句
```

生成物（`index.html`、`compositions/`、`assets/vo.wav`、`out/`）每次整体重写。要改画面，改 `episode.json` 或 `build.mjs`，不要在 Studio 里手改。

## 环境（一次性）

```bash
cd video && npm install                       # playwright-core，用系统 Chrome
uv venv .venv --python 3.12 && uv pip install -p .venv -r requirements-tts.txt
```

需要 ffmpeg、Rubber Band（`brew install rubberband`，用来变速；缺了会退回音质更差的 atempo）、Apple Silicon（mlx-audio / mlx-whisper）。

## 声音（voice.json）

- `clone_mode: "xvector"`：只从参考音提取音色，发音和语调交给模型，普通话标准；`"icl"` 会连口音、节奏一起模仿，更像本人但不标准。当前用 xvector。
- `ref_audio` 用降噪后的参考音，克隆会把底噪一起学走。换参考音时先清理：`ffmpeg -i for-clone.wav -af "highpass=f=70,afftdn=nf=-42:nr=15:tn=1" for-clone.clean.wav`。
- `speed: 1.3`：合成后用 Rubber Band R3 变速（Qwen3-TTS 不认 speed 参数）；1.5 会发糊。
- `temperature: 0.4`、`top_p: 0.85`：发音更稳。
- 后期在 build.mjs 里统一做：低切、轻降噪、去闷、提清晰度、去齿音、轻压缩，固定增益到 -16 LUFS 并限幅。tts.py 只负责逐句切首尾静音和淡入淡出。
- 改了 voice.json 任何参数，缓存指纹会变，下次 tts.py 全量重合成。

## 流程

1. **建工程**：`cd video/episodes && npx hyperframes init weekly-N`（blank），复制上一期的 `episode.json` 作模板。开场口播不要沿用「大家好，我是山月」。
2. **选题与口播稿**（写进 `episode.json`）：读 `src/content/blog/weekly-N.md`，按下方结构挑条目、写口播。
3. **抓网页**：`node scripts/capture.mjs episodes/weekly-N --dump` 导出正文到 `.work/pages/`，从中逐字复制要高亮的英文原句写进 `pages.<id>.highlights`；再不带 `--dump` 跑一次，必须全部 `found`。找不到的句子改短或换句。这一步同时记下标签页标题和网站图标，画面里的 Chrome 外框会用到；只想补标题和图标、不动长图时，用 `--meta`。
4. **口播**：`.venv/bin/python scripts/tts.py episodes/weekly-N`（约 30 分钟，后台跑）。只改一句时自动只重合成那一句；`--only <sceneId>`、`--force` 可用。日志末尾给出净时长。
5. **生成合成**：`node scripts/build.mjs episodes/weekly-N`，输出场景数、字幕数、总长和章节。
6. **检查**：在期目录里 `npx hyperframes lint`、`npx hyperframes check`；对每个场景中点截快照看版面（重叠、溢出、字太小、荧光笔是否压在原句上）。
7. **渲染**：`npx hyperframes render -o out/program.mp4`，用 ffprobe 核对时长与音轨。
8. **发布材料**：先按下方「投稿文案」写好 `bilibili`，再跑 `node scripts/publish.mjs episodes/weekly-N` → `out/bilibili.md` 和下面这组封面。须先跑过 `build.mjs`（矩阵图读 `compositions/` 和网页抓取）。交片时在回复里列出五条标题、分区、标签和简介，请用户选标题编号。用户选定后，把那一条原文写入 `bilibili.title`，再跑 `node scripts/publish.mjs episodes/weekly-N --copy`（只重写文案，不重做封面）。

## 封面

每张封面按自己的画幅单独排版，不从 16:9 画面裁切。版式统一：纸面 + 宋体大标题（`mark` 词上荧光笔）+ 一扇略微倾斜的原文 Chrome 窗口（页面推近到那句荧光笔）+ 一条红批注。网页窗口和页面推近由 `scripts/chrome.mjs`（与 build.mjs 共用外框）和 `publish.mjs` 的 `browser()` 生成。

四张主封面共用 `bilibili.cover` 的一套文案和同一处原文：

- `out/cover.png`：1920×1080，16:9。左边期号、标题、副标题和署名，右边原文窗口，红批注压在窗口左下角。
- `out/cover-4x3.png`：1440×1080，4:3，给 B 站。标题占上半，原文窗口从右下角出血，批注和署名在左下。
- `out/cover-3x4.png`：1080×1440，3:4。标题在上，原文窗口在下半，批注压在窗口右上角，署名在底。
- `out/cover-9x16.png`：1080×1920，9:16。标题在上，原文窗口在下半，批注压在窗口右上角，署名在底。
- 原文默认取第一个 `page` 场景的第一处荧光笔；`cover.scene`、`cover.highlight`、`cover.note` 可指定场景、荧光笔 id 和批注文字。

`out/cover-matrix-1.png` … `out/cover-matrix-6.png`：1440×1080，4:3 原生排版。上方是期号 + 栏目（取场景 `tag` 的「·」前半）和一到两行大标题，下方是推近到荧光笔的原文窗口，红批注压在窗口右上角，右上角淡色序号。

- 写了 `bilibili.matrix` 就按它的顺序出图，每项：`scene`（page 场景 id）、`lines`（标题分行，每行约 11 字以内）、`mark`、可选 `highlight`、可选 `note`。批注别和标题说同一件事，写一句标题之外的数字或提醒，并保持短（约 12 字），否则会压到第二行标题。
- 没写时取前六个 `page` 场景：标题用 `tag` 的「·」后半，荧光笔取第一处，批注取这一拍或之后最近的一条；网页场景不足六个时，用 `triad`、`gate`、`bars`、`slots`、`tree` 按出现顺序补，把整幅场景缩进 4:3。开场、快讯、结尾不补。

`out/bilibili.md` 列出以上路径。

## 节目结构（不卡分钟数，按条目数控制）

| 段落 | 时长 | 内容 |
| --- | --- | --- |
| 开场 | 简短 | 期号 + 卷首命题一句话。第一句直接报期号，不说「大家好，我是山月」 |
| 卷首 | 不限 | 场景 → 论点 → 数字 → 保留意见 → 判断；穿插 1–2 个原文页面 |
| 本周快讯 | 不限 | 固定挑 5 条，一条一句，只用一个 `news` 场景（一屏） |
| 精选文章与工具 | 不限 | 固定 8 条；每条至少一个原文页面场景，数字类配图解（bars / slots / gate 等） |
| 结尾 | 简短 | 网站地址、简介有链接、署名 |

选条目：优先有可核对数字、有机制可画、原文页面可抓的条目；纯产品发布放快讯。

## episode.json 写法要点

- 每个场景：`id`、`chapter`（章节名，相同的连续场景合并）、`type`、`tag`、`props`、`lines`、`beats`。
- `lines[].text` 是字幕显示文本；数字、版本号、英文缩写念法不稳时加 `say`（如 `"GPT-6.1"` → `"GPT 六点一"`），**标点必须与 text 一致**，字幕时间靠逐分句映射。
- 动画时间点用口播里的原词定位：`beats[].at` / `props.*.at` 必须是该场景 `text` 中出现的子串，build 时找不到会直接报错。
- 场景类型：`title`、`chips`、`triad`、`page`（原文长图滚动 + 荧光笔 + 右侧批注）、`statement`、`gate`、`bars`、`news`、`slots`、`tree`、`outro`。新增类型在 `build.mjs` 的 `BUILD` / `TYPE_CSS` 里加。
- `page` 场景：`props.page` 指向 `pages` 的 id；`beats[].highlight` 指向该页 highlights 的 id；`beats[].note` 是红色批注。
- 快讯只挑 5 条，放在一个 `news` 场景里，不拆成两页；不要选新发布的模型（新权重、新快档、新开放权重等），改选安全事故、平台能力、标准捐献、工作流变化；`props.caption` 写「本周 N 条，挑 5 条讲」。
- 不是 `page` 场景但讲了某篇原文时，在场景上加 `links: [{name, url}]`，publish 会把它放进简介。
- `bilibili.cover`（`lines` 分行、`mark` 荧光笔词、`sub` 副标题，可选 `scene` / `highlight` / `note` 指定封面上的原文）、`matrix`（六张矩阵封面的标题与原文，见「封面」）。`cover` 这套文案同时用于 16:9、4:3、3:4 和 9:16 四张主封面，和投稿标题是两套字，不要互相抄。

## 投稿文案

写在 `episode.json` 的 `bilibili` 里，由 `publish.mjs` 校验并写进 `out/bilibili.md`。标题不烧进成片。用户选定前不要填 `title`。

- `titles`：正好 5 条，每条 ≤80 字，互不重复，都带「开发者 AI 周刊 #N」。五条换角度，不要换标点：卷首命题放前面、本期一个可核对数字、一个具体问题、一个产品或机制钩子、`开发者 AI 周刊 #N｜` 放最前。片里没讲的不写。
- `title`：用户选中的那一条原文。选定前留空或不写这个字段。
- `zone`：三选一。开发者向默认 `科技 · 计算机技术`；卷首是给更多人看的方法论时用 `知识 · 科学科普`；整期以工具教程为主时用 `科技 · 软件应用`。这三档简介上限都是 2000 字。
- `tags`：6–10 个，每个 ≤20 字，不能有空格、逗号或顿号。必须包含 `开发者AI周刊`，其余用本期专有名词（产品、机制），不堆同义词。
- `intro`：两三句，卷首判断 + 快讯一句 + 精选点名。不要写时间轴和链接，脚本会拼在后面。整段简介（含时间轴和链接）超过 2000 字时删链接名，不删链接。

## 口播写法

- 口语短句，一句一个信息；每句 ≤ 40 字，逗号多给停顿。
- 英文产品名照写，数字和单位写进 `say` 念成中文。
- 开头不寒暄，也不自报家门。第一句直接是期号，例如「这里是开发者 AI 周刊第 N 期。」然后接卷首命题。不要写「大家好，我是山月」。
- 结尾固定「我是山月，我们下期见」。署名只留在结尾。
- 不设目标总长，条目数固定（快讯 5 + 精选 8），时长随内容走；不要为凑时长增删条目或调语速。

## 已知坑

- Whisper 加 `initial_prompt` 偶尔整句对齐失败（ratio 0），tts.py 会自动去掉 prompt 重试。
- xvector 模式偶尔停不下来，一句话一直生成到 token 上限（每句四五分钟）。tts.py 按字数限制 `max_tokens`，并在每字超过 0.6 秒时换种子重试；日志出现「停不下来」属于正常重试。全量合成后看一眼净时长，确认没有异常长的句子。
- 网页抓取：cookie 弹窗与悬浮条会被隐藏；懒加载图片靠预滚动。改版的页面要重跑 `--dump` 核对原句。
- 系统中文字体（PingFang SC / Songti SC）靠 build.mjs 里按字重声明的 `local()` @font-face 通过 lint；不要删，否则渲染会退回默认字体或伪粗体。
- 有意叠放的元素（背景大号期号、GPU 格子的状态层、网页长图）带 `data-layout-allow-*` 标记，check 才不会误报。
- 首期实测：25 个场景、口播净时长约 7.6 分钟，整片 8:11；TTS 全量约 40 分钟（M4），改稿后只重合成改过的句子。
