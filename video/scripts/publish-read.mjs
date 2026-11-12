// 单篇精读的 B 站发布材料：out/bilibili.md（标题、分区、标签、合集、定时、简介）+ 主封面四张 + 矩阵封面五张。
// 用法：node scripts/publish-read.mjs <单篇目录> [--copy]
// --copy 只重写 bilibili.md，不重做封面。先跑 build-read.mjs（要 .work/timeline.json）。
import fs from "node:fs/promises";
import path from "node:path";
import { createEvidence, mainCover, matrixCover, openShooter } from "./lib/cover.mjs";
import { mmss } from "./lib/timeline.mjs";

const copyOnly = process.argv.includes("--copy");
const epDir = path.resolve(process.argv.slice(2).find((a) => a !== "--copy") || ".");
const chars = (s) => [...String(s)].length;
const ZONES = ["人工智能", "科技数码", "知识"];
const COLLECTION = "开发者 AI 周刊 · 精读";
const MATRIX_COUNT = 5;
const episode = JSON.parse(await fs.readFile(path.join(epDir, "episode.json"), "utf8"));
if (episode.format !== "read") throw new Error(`${epDir}/episode.json 不是单篇精读（format 应为 "read"）`);
const timeline = JSON.parse(await fs.readFile(path.join(epDir, ".work", "timeline.json"), "utf8"));
const bili = episode.bilibili || {};
const outDir = path.join(epDir, "out");
const workDir = path.join(epDir, ".work");
await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(workDir, { recursive: true });

// 标题固定为「开发者 AI 周刊 #N 精读｜文章中文标题」。
const title = `开发者 AI 周刊 #${episode.issue} 精读｜${episode.title || ""}`;
if (!episode.title) throw new Error("缺少 episode.title（文章中文标题）");
if (chars(title) > 80) throw new Error(`B 站标题 ${chars(title)} 字，超过 80：${title}`);

const tags = bili.tags;
if (!Array.isArray(tags) || tags.length < 6 || tags.length > 10) throw new Error(`标签需要 6–10 个，现在是 ${Array.isArray(tags) ? tags.length : "空"}`);
const tagSeen = new Set();
for (const tag of tags) {
  if (typeof tag !== "string" || !tag) throw new Error("有一条空标签");
  if (chars(tag) > 20) throw new Error(`标签超过 20 字：${tag}`);
  if (/[\s,，、]/.test(tag)) throw new Error(`标签不要空格、逗号或顿号，拆成多条：${tag}`);
  if (tagSeen.has(tag)) throw new Error(`标签重复：${tag}`);
  tagSeen.add(tag);
}
for (const must of ["开发者AI周刊", "AI精读"]) if (!tags.includes(must)) throw new Error(`标签需包含「${must}」`);
const zone = bili.zone || "人工智能";
if (!ZONES.includes(zone)) throw new Error(`分区必须是其中之一：${ZONES.join("、")}。现在是「${zone}」`);
if (typeof bili.intro !== "string" || !bili.intro.trim()) throw new Error("缺少 bilibili.intro");

// 定时发布：北京时间 YYYY-MM-DD HH:mm，B 站要求在 2 小时到 15 天之内。
const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(bili.publishAt || "");
if (!m) throw new Error(`bilibili.publishAt 要写成「YYYY-MM-DD HH:mm」（北京时间），现在是「${bili.publishAt || "空"}」`);
const publishMs = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4] - 8, +m[5]);
const ahead = (publishMs - Date.now()) / 3600000;
if (ahead < 2 || ahead > 15 * 24) {
  throw new Error(`定时 ${bili.publishAt} 距现在 ${ahead.toFixed(1)} 小时，B 站只收 2 小时到 15 天之内；改 bilibili.publishAt`);
}

const page = Object.values(episode.pages)[0];
const desc = [
  bili.intro.trim(),
  "",
  "时间轴",
  ...timeline.chapters.map((c) => `${mmss(c.start)} ${c.name}`),
  "",
  `原文：${page.name} ${page.url}`,
  `本期周刊（全部文章与工具）：${episode.web}`,
  "口播为作者本人声音克隆（AI 合成）。",
].join("\n");
if (chars(desc) > 2000) throw new Error(`简介 ${chars(desc)} 字，超过 B 站 2000 字上限`);

// 矩阵：bilibili.matrix 写了就用（最多 5 张）；没写取前五处来自不同场景的划线。
function matrixPicks() {
  const copies = bili.matrix || [];
  if (copies.length) {
    return copies.slice(0, MATRIX_COUNT).map((c) => {
      if (!episode.scenes.some((s) => s.id === c.scene)) throw new Error(`bilibili.matrix 里的场景不存在：${c.scene}`);
      return c;
    });
  }
  const picks = [];
  for (const s of episode.scenes) {
    const b = (s.beats || []).find((x) => x.highlight);
    if (b) picks.push({ scene: s.id, highlight: b.highlight, lines: [s.chapter] });
    if (picks.length >= MATRIX_COUNT) break;
  }
  return picks;
}
const picks = matrixPicks();

const md = `# B 站发布材料 · #${episode.issue} 精读第 ${episode.day || "?"} 支

- 视频：out/program.mp4（${mmss(timeline.total)}）
- 字幕：已烧进成片；out/captions.srt 只作内部留档，不上传 B 站
- 主封面 16:9：out/cover.png（1920×1080）
- 主封面 4:3：out/cover-4x3.png（1440×1080，投稿时不用）
- 主封面 3:4：out/cover-3x4.png（1080×1440）
- 主封面 9:16：out/cover-9x16.png（1080×1920）
- 封面矩阵 4:3（传 1–5）：
${picks.map((p, i) => `  - out/cover-matrix-${i + 1}.png（1440×1080）— ${(p.lines || []).join("")}`).join("\n")}
- 标题：${title}（${chars(title)} 字）
- 分区：${zone}
- 标签：${tags.join("、")}
- 合集：${COLLECTION}
- 定时发布：${bili.publishAt}（北京时间）

## 标题

${title}

## 简介

\`\`\`
${desc}
\`\`\`
`;
await fs.writeFile(path.join(outDir, "bilibili.md"), md);

if (!copyOnly) {
  for (const name of await fs.readdir(outDir)) {
    if (/^cover-matrix-\d+\.png$/.test(name)) await fs.unlink(path.join(outDir, name));
  }
  const evidence = createEvidence(epDir, episode, "read");
  const shooter = await openShooter(outDir, workDir);
  try {
    const cover = bili.cover || {};
    const lead = await evidence(cover);
    const opts = { copy: cover, issue: episode.issue, fallbackTitle: episode.title, kickerExtra: "精读" };
    await shooter.shoot(mainCover("16:9", lead, opts), 1920, 1080, "cover");
    await shooter.shoot(mainCover("4:3", lead, opts), 1440, 1080, "cover-4x3");
    await shooter.shoot(mainCover("3:4", lead, opts), 1080, 1440, "cover-3x4");
    await shooter.shoot(mainCover("9:16", lead, opts), 1080, 1920, "cover-9x16");
    for (let i = 0; i < picks.length; i++) {
      const ev = await evidence(picks[i]);
      await shooter.shoot(matrixCover(ev, picks[i], i, { issue: episode.issue, section: "精读", fallbackLine: episode.title }), 1440, 1080, `cover-matrix-${i + 1}`);
    }
  } finally {
    await shooter.close();
  }
}

console.log(`[publish-read] 标题「${title}」（${chars(title)} 字），定时 ${bili.publishAt}，简介 ${chars(desc)} 字 → out/bilibili.md${copyOnly ? "（未重做封面）" : `，主封面 4 张，矩阵 ${picks.length} 张`}`);
