// 口播母带与 HyperFrames 工程组装：整条口播、captions/index.html、脚手架文件、SRT 与 timeline.json。
// build.mjs 与 build-read.mjs 共用；版面差异（字幕样式、背景层、底色）由调用方传入。
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { C, esc, FONT_CSS } from "../chrome.mjs";
import { r3, srtTime } from "./timeline.mjs";

// Voice cleanup before loudness: rumble cut, light hiss reduction, less boxiness, a bit of
// presence, tamed sibilance, then gentle compression so quiet line endings stay audible.
const VOICE_CHAIN = [
  "highpass=f=75",
  "afftdn=nf=-50:nr=8:tn=1",
  "equalizer=f=280:t=q:w=1.1:g=-2.5",
  "equalizer=f=3200:t=q:w=1.0:g=2",
  "deesser=i=0.35:m=0.5:f=0.5",
  "acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=2",
].join(",");

// Bilibili plays at roughly -16 LUFS. One fixed gain plus a peak limiter: loudnorm's dynamic
// mode rides the level line by line and makes the voice pump.
const TARGET_LUFS = -16;
function masterVoice(list, rate, rawOut, out) {
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", list, "-af", VOICE_CHAIN, "-ar", String(rate), "-ac", "1", "-c:a", "pcm_f32le", rawOut]);
  const probe = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", rawOut, "-af", "loudnorm=print_format=json", "-f", "null", "-"], { encoding: "utf8" });
  const json = probe.stderr.slice(probe.stderr.lastIndexOf("{"), probe.stderr.lastIndexOf("}") + 1);
  if (probe.status !== 0 || !json) throw new Error(`响度测量失败：${(probe.stderr || String(probe.error)).slice(-400)}`);
  const gain = (TARGET_LUFS - Number(JSON.parse(json).input_i)).toFixed(2);
  // limit=0.84 is about -1.5 dBFS.
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", rawOut, "-af", `volume=${gain}dB,alimiter=limit=0.84:attack=3:release=60:level=false`, "-ar", String(rate), "-ac", "1", "-c:a", "pcm_s16le", out]);
}

async function silence(seconds, rate, dir) {
  const ms = Math.round(seconds * 1000);
  const f = path.join(dir, `sil-${rate}-${ms}.wav`);
  if (!existsSync(f)) {
    execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", `anullsrc=r=${rate}:cl=mono`, "-t", String(ms / 1000), "-c:a", "pcm_s16le", f]);
  }
  return f;
}

// One continuous voiceover track so scene starts and audio can never drift apart.
export async function writeVoiceover(epDir, scenes, total, { gap, tail }) {
  const workDir = path.join(epDir, ".work");
  const voPath = path.join(epDir, "assets", "vo.wav");
  const rate = Number(execFileSync("ffprobe", ["-v", "error", "-select_streams", "a:0", "-show_entries", "stream=sample_rate", "-of", "default=nw=1:nk=1", path.join(epDir, scenes[0].lines[0].wav)]).toString().trim());
  const parts = [];
  for (const s of scenes) {
    parts.push(await silence(s.head, rate, workDir));
    s.lines.forEach((l, i) => {
      parts.push(path.join(epDir, l.wav));
      if (i < s.lines.length - 1) parts.push(null);
    });
    for (let k = 0; k < parts.length; k++) if (parts[k] === null) parts[k] = await silence(gap, rate, workDir);
    parts.push(await silence(tail, rate, workDir));
  }
  const list = path.join(workDir, "concat.txt");
  await fs.writeFile(list, parts.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join("\n"));
  await fs.mkdir(path.join(epDir, "assets"), { recursive: true });
  masterVoice(list, rate, path.join(workDir, "vo-raw.wav"), voPath);
  const voDur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", voPath]).toString().trim());
  if (Math.abs(voDur - total) > 0.25) throw new Error(`口播总长 ${voDur.toFixed(2)}s 与时间线 ${total}s 对不上`);
}

// 一条贯穿全片的子合成（背景层、字幕层）。
export function subDoc({ W, H, total }, id, css, body, js) {
  return `<!doctype html>
<html lang="zh">
<head><meta charset="UTF-8" /></head>
<body>
<template>
<style>${FONT_CSS}${css}</style>
<div id="${id}-root" data-composition-id="${id}" data-width="${W}" data-height="${H}" data-duration="${total}">
${body}
</div>
<script>
(function () {
window.__timelines = window.__timelines || {};
const R = document.querySelector('[data-composition-id="${id}"]');
const tl = gsap.timeline({ paused: true });
${js}
window.__timelines["${id}"] = tl;
})();
</script>
</template>
</body>
</html>
`;
}

// capCss 是 .cap 容器与 .cap span 的样式，由调用方按版面给。
export function captionsDoc(dims, caps, capCss) {
  return subDoc(
    dims,
    "captions",
    `[data-composition-id="captions"]{position:absolute;inset:0;font-family:"PingFang SC",sans-serif}
${capCss}`,
    caps.map((c, i) => `<div class="cap clip" id="cap-${i}" data-start="${c.start}" data-duration="${r3(c.end - c.start)}" data-track-index="0"><span>${esc(c.text)}</span></div>`).join("\n"),
    "",
  );
}

// frame: 有背景层时传 true（compositions/frame.html 需已写好）。bg 是 html/body 底色。
export function indexHtml({ W, H, total }, { title, scenes, frame = true, bg = C.paper }) {
  return `<!doctype html>
<html lang="zh">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<title>${esc(title)}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
${FONT_CSS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${bg}}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"PingFang SC",sans-serif;color:${C.ink}}
.layer{position:absolute;inset:0}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="${W}" data-height="${H}" data-duration="${total}">
${frame ? `<div class="layer clip" id="host-frame" data-composition-id="frame" data-composition-src="compositions/frame.html" data-start="0" data-duration="${total}" data-track-index="0" data-width="${W}" data-height="${H}"></div>\n` : ""}${scenes.map((s) => `<div class="layer clip" id="host-${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.start}" data-duration="${s.duration}" data-track-index="1" data-width="${W}" data-height="${H}"></div>`).join("\n")}
<div class="layer clip" id="host-captions" data-track-kind="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${total}" data-track-index="2" data-width="${W}" data-height="${H}"></div>
<audio id="vo" src="assets/vo.wav" data-start="0" data-duration="${total}" data-track-index="3" data-volume="1"></audio>
</div>
<script>
window.__timelines = window.__timelines || {};
window.__timelines["main"] = gsap.timeline({ paused: true });
</script>
</body>
</html>
`;
}

// HyperFrames 工程文件只在本地生成（仓库只提交 episode.json）；缺了就补，已有的不动。
export async function scaffold(epDir) {
  const files = {
    "hyperframes.json": {
      $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
      registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
      paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
      media: { autoProxy: true },
    },
    "meta.json": { id: path.basename(epDir), name: path.basename(epDir), createdAt: new Date().toISOString() },
    "package.json": {
      name: path.basename(epDir),
      private: true,
      type: "module",
      scripts: { dev: "npx --yes hyperframes preview", check: "npx --yes hyperframes check", render: "npx --yes hyperframes render" },
    },
  };
  for (const [file, json] of Object.entries(files)) {
    const p = path.join(epDir, file);
    if (!existsSync(p)) await fs.writeFile(p, JSON.stringify(json, null, 2) + "\n");
  }
}

export async function writeSrtAndTimeline(epDir, caps, total, chapters, scenes) {
  const srt = caps.map((c, i) => `${i + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`).join("\n");
  const timeline = { total, chapters, scenes: scenes.map((s) => ({ id: s.id, type: s.type, chapter: s.chapter, tag: s.tag, start: s.start, duration: s.duration })) };
  const outDir = path.join(epDir, "out");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "captions.srt"), srt);
  await fs.writeFile(path.join(epDir, ".work", "timeline.json"), JSON.stringify(timeline, null, 2));
}
