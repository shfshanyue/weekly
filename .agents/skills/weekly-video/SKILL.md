---
name: weekly-video
version: 0.1.0
description: >-
  把一期「开发者 AI 周刊」做成约 8 分钟的 B 站横屏视频（克隆口播 + 原文网页荧光笔 + 动画图解）。当用户说「做第 N 期视频」「周刊视频」「B 站视频」「weekly video」时使用。
---

# 周刊视频 (weekly-video)

一期周刊 → `video/episodes/weekly-N/out/program.mp4`（1920×1080，约 8 分钟）+ SRT 字幕 + 封面 + B 站发布文案。用户只看成片，不审中间稿；稳定输出优先于花样。

设计文档：`docs/superpowers/specs/2026-10-19-bilibili-video-weekly-design.md`。视觉规范：`video/frame.md`（B 风格：纸面编辑感、黄色荧光笔、红色批注）。

## 目录

```
video/                      独立 npm 包，不进根目录 pnpm workspace
  scripts/capture.mjs       抓原文网页长图 + 重点句坐标
  scripts/tts.py            克隆语音逐句合成 + Whisper 字级对齐（带指纹缓存）
  scripts/build.mjs         episode.json → HyperFrames 工程（index.html + compositions/*）
  scripts/publish.mjs       B 站标题 / 简介 / 时间轴 / 链接 + 封面
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
- `speed: 1.2`：合成后用 Rubber Band R3 变速（Qwen3-TTS 不认 speed 参数）；1.5 会发糊。
- `temperature: 0.4`、`top_p: 0.85`：发音更稳。
- 后期在 build.mjs 里统一做：低切、轻降噪、去闷、提清晰度、去齿音、轻压缩，固定增益到 -16 LUFS 并限幅。tts.py 只负责逐句切首尾静音和淡入淡出。
- 改了 voice.json 任何参数，缓存指纹会变，下次 tts.py 全量重合成。

## 流程

1. **建工程**：`cd video/episodes && npx hyperframes init weekly-N`（blank），复制上一期的 `episode.json` 作模板。
2. **选题与口播稿**（写进 `episode.json`）：读 `src/content/blog/weekly-N.md`，按下方结构挑条目、写口播。
3. **抓网页**：`node scripts/capture.mjs episodes/weekly-N --dump` 导出正文到 `.work/pages/`，从中逐字复制要高亮的英文原句写进 `pages.<id>.highlights`；再不带 `--dump` 跑一次，必须全部 `found`。找不到的句子改短或换句。这一步同时记下标签页标题和网站图标，画面里的 Chrome 外框会用到；只想补标题和图标、不动长图时，用 `--meta`。
4. **口播**：`.venv/bin/python scripts/tts.py episodes/weekly-N`（约 30 分钟，后台跑）。只改一句时自动只重合成那一句；`--only <sceneId>`、`--force` 可用。日志末尾给出净时长。
5. **生成合成**：`node scripts/build.mjs episodes/weekly-N`，输出场景数、字幕数、总长和章节。
6. **检查**：在期目录里 `npx hyperframes lint`、`npx hyperframes check`；对每个场景中点截快照看版面（重叠、溢出、字太小、荧光笔是否压在原句上）。
7. **渲染**：`npx hyperframes render -o out/program.mp4`，用 ffprobe 核对时长与音轨。
8. **发布材料**：`node scripts/publish.mjs episodes/weekly-N` → `out/bilibili.md`、`out/cover.png`。

## 节目结构（约 8 分钟，约 2100 字口播）

| 段落 | 时长 | 内容 |
| --- | --- | --- |
| 开场 | 15 秒 | 期号 + 卷首命题一句话 |
| 卷首 | 约 2 分钟 | 场景 → 论点 → 数字 → 保留意见 → 判断；穿插 1–2 个原文页面 |
| 本周快讯 | 约 1 分钟 | 挑 4–5 条，一条一句 |
| 精选文章与工具 | 约 4.5 分钟 | 约 7 条；每条至少一个原文页面场景，数字类配图解（bars / slots / gate 等） |
| 结尾 | 20 秒 | 网站地址、简介有链接、署名 |

选条目：优先有可核对数字、有机制可画、原文页面可抓的条目；纯产品发布放快讯。

## episode.json 写法要点

- 每个场景：`id`、`chapter`（章节名，相同的连续场景合并）、`type`、`tag`、`props`、`lines`、`beats`。
- `lines[].text` 是字幕显示文本；数字、版本号、英文缩写念法不稳时加 `say`（如 `"GPT-6.1"` → `"GPT 六点一"`），**标点必须与 text 一致**，字幕时间靠逐分句映射。
- 动画时间点用口播里的原词定位：`beats[].at` / `props.*.at` 必须是该场景 `text` 中出现的子串，build 时找不到会直接报错。
- 场景类型：`title`、`chips`、`triad`、`page`（原文长图滚动 + 荧光笔 + 右侧批注）、`statement`、`gate`、`bars`、`news`、`slots`、`tree`、`outro`。新增类型在 `build.mjs` 的 `BUILD` / `TYPE_CSS` 里加。
- `page` 场景：`props.page` 指向 `pages` 的 id；`beats[].highlight` 指向该页 highlights 的 id；`beats[].note` 是红色批注。
- `news` 场景最多 5 条；快讯多于 5 条就拆成两个 `news` 场景，第二个用 `props.startIndex` 续编号，`props.caption` 写「本周 N 条，挑 M 条讲」。
- 不是 `page` 场景但讲了某篇原文时，在场景上加 `links: [{name, url}]`，publish 会把它放进简介。
- `bilibili`：`title`（≤80 字）、`intro`、`tags`、`zone`、`cover`（`lines` 分行、`mark` 荧光笔词、`sub` 副标题）。

## 口播写法

- 口语短句，一句一个信息；每句 ≤ 40 字，逗号多给停顿。
- 英文产品名照写，数字和单位写进 `say` 念成中文。
- 开头不寒暄，结尾固定「我是山月，我们下期见」。
- 目标总长 7:30–8:30；build 报出总长偏离时，增删条目而不是调语速。

## 已知坑

- Whisper 加 `initial_prompt` 偶尔整句对齐失败（ratio 0），tts.py 会自动去掉 prompt 重试。
- xvector 模式偶尔停不下来，一句话一直生成到 token 上限（每句四五分钟）。tts.py 按字数限制 `max_tokens`，并在每字超过 0.6 秒时换种子重试；日志出现「停不下来」属于正常重试。全量合成后看一眼净时长，口播约 2100 字应在 7–8 分钟。
- 网页抓取：cookie 弹窗与悬浮条会被隐藏；懒加载图片靠预滚动。改版的页面要重跑 `--dump` 核对原句。
- 系统中文字体（PingFang SC / Songti SC）靠 build.mjs 里按字重声明的 `local()` @font-face 通过 lint；不要删，否则渲染会退回默认字体或伪粗体。
- 有意叠放的元素（背景大号期号、GPU 格子的状态层、网页长图）带 `data-layout-allow-*` 标记，check 才不会误报。
- 首期实测：25 个场景、口播净时长约 7.6 分钟，整片 8:11；TTS 全量约 40 分钟（M4），改稿后只重合成改过的句子。
