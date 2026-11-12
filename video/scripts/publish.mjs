// 生成 B 站发布材料：out/bilibili.md（标题、分区、标签、简介），以及主封面四张 + 封面矩阵六张。
// 用法：node scripts/publish.mjs <期目录> [--copy]
// --copy 只重写 bilibili.md，不重做封面。先跑 build.mjs，它会写 .work/timeline.json 和 compositions/。
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { C } from "./chrome.mjs";
import { createEvidence, mainCover as coverPage, matrixCover as matrixPage, openShooter } from "./lib/cover.mjs";

const copyOnly = process.argv.includes("--copy");
const epDir = path.resolve(process.argv.slice(2).find((a) => a !== "--copy") || ".");
const chars = (s) => [...String(s)].length;
// B 站分区已改为一级（2026-11），默认「人工智能」；旧期的二级分区写法仍能重跑。
const ZONES = ["人工智能", "科技数码", "知识", "科技 · 计算机技术", "科技 · 软件应用", "知识 · 科学科普"];
const episode = JSON.parse(await fs.readFile(path.join(epDir, "episode.json"), "utf8"));
const timeline = JSON.parse(await fs.readFile(path.join(epDir, ".work", "timeline.json"), "utf8"));
const bili = episode.bilibili || {};
const outDir = path.join(epDir, "out");
const workDir = path.join(epDir, ".work");
await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(workDir, { recursive: true });

const mmss = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
const r3 = (n) => Math.round(n * 1000) / 1000;

const links = [];
const seen = new Set();
const add = (name, url) => {
  if (!url || seen.has(url)) return;
  seen.add(url);
  links.push({ name, url });
};
for (const s of episode.scenes) {
  for (const l of s.links || []) add(l.name, l.url);
  for (const ref of s.sources || []) add(episode.pages[ref]?.name || ref, episode.pages[ref]?.url);
  if (s.type === "page") add(episode.pages[s.props.page].name, episode.pages[s.props.page].url);
  if (s.type === "news") for (const it of s.props.items) add(it.title, it.url);
}

// B 站标题固定为「开发者 AI 周刊 #N｜博客副标题」：取 episode.title 第一个「: 」之后的原文。
// bilibili.titles / bilibili.title 是旧期的五选一字段，忽略。
function titleCopy(bili, episode) {
  const full = String(episode.title || "");
  const at = full.indexOf(": ");
  if (at < 0) throw new Error(`episode.title 里没有「: 」，取不到副标题：${full || "空"}`);
  const subtitle = full.slice(at + 2).trim();
  if (!subtitle) throw new Error(`episode.title 的副标题是空的：${full}`);
  const title = `开发者 AI 周刊 #${episode.issue}｜${subtitle}`;
  if (chars(title) > 80) throw new Error(`B 站标题 ${chars(title)} 字，超过 80：${title}`);
  if (!Array.isArray(bili.tags)) return title; // 旧期没有完整投稿文案，只出标题
  const tags = bili.tags;
  if (!Array.isArray(tags) || tags.length < 6 || tags.length > 12) {
    throw new Error(`标签需要 6–12 个，现在是 ${Array.isArray(tags) ? tags.length : "空"}`);
  }
  const tagSeen = new Set();
  for (const tag of tags) {
    if (typeof tag !== "string" || !tag) throw new Error("有一条空标签");
    if (chars(tag) > 20) throw new Error(`标签超过 20 字：${tag}`);
    if (/[\s,，、]/.test(tag)) throw new Error(`标签不要空格或顿号，拆成多条：${tag}`);
    if (tagSeen.has(tag)) throw new Error(`标签重复：${tag}`);
    tagSeen.add(tag);
  }
  if (!tags.includes("开发者AI周刊")) throw new Error("标签需包含「开发者AI周刊」");
  if (!ZONES.includes(bili.zone)) throw new Error(`分区必须是其中之一：${ZONES.join("、")}。现在是「${bili.zone || "空"}」`);
  if (typeof bili.intro !== "string" || !bili.intro.trim()) throw new Error("缺少 bilibili.intro");
  return title;
}

const title = titleCopy(bili, episode);
const titleStatus = `${title}（${chars(title)} 字）`;
const titleSection = title;
const desc = [
  bili.intro || episode.title,
  "",
  "时间轴",
  ...timeline.chapters.map((c) => `${mmss(c.start)} ${c.name}`),
  "",
  "本期提到的原文",
  ...links.map((l) => `· ${l.name} ${l.url}`),
  "",
  `完整版（全部快讯、文章与工具）：${episode.web}`,
  "口播为作者本人声音克隆（AI 合成）。",
].join("\n");
if ([...desc].length > 2000) throw new Error(`简介 ${[...desc].length} 字，超过 B 站 2000 字上限`);

const cover = bili.cover || {};
const evidence = createEvidence(epDir, episode, "page");
const mainCover = (kind, ev) => coverPage(kind, ev, { copy: cover, issue: episode.issue, fallbackTitle: episode.title });
function matrixCover(ev, copy, index) {
  const section = (ev.scene.tag || "").split(" · ")[0];
  const fallbackLine = (ev.scene.tag || "").split(" · ").slice(1).join(" · ") || ev.spec.name;
  return matrixPage(ev, copy, index, { issue: episode.issue, section, fallbackLine });
}

const DIAGRAMS = new Set(["triad", "gate", "bars", "slots", "tree"]);
const MATRIX_COUNT = 6;

// bilibili.matrix 写了就按它的顺序和文案；没写就取前六个网页场景，不够用图解场景补。
function matrixPicks() {
  const copies = bili.matrix || [];
  if (copies.length) {
    return copies.slice(0, MATRIX_COUNT).map((c) => {
      const scene = episode.scenes.find((s) => s.id === c.scene);
      if (!scene) throw new Error(`bilibili.matrix 里的场景不存在：${c.scene}`);
      return { scene, copy: c };
    });
  }
  const picked = episode.scenes.filter((s) => s.type === "page").slice(0, MATRIX_COUNT);
  for (const s of episode.scenes) {
    if (picked.length >= MATRIX_COUNT) break;
    if (DIAGRAMS.has(s.type)) picked.push(s);
  }
  return picked.map((scene) => ({ scene, copy: {} }));
}

// 图解场景没有原文窗口，把整幅场景缩进 4:3。
function diagramStill(compositionHtml) {
  const inner = compositionHtml.split("<template>")[1].split("<script>")[0];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:1440px;height:1080px;overflow:hidden;background:${C.paper}}
.fit{position:absolute;left:0;top:135px;width:1920px;height:1080px;transform:scale(.75);transform-origin:0 0}
.paper{position:absolute;inset:0;background:${C.paper}}
.lines{position:absolute;left:0;top:0;width:1920px;height:1080px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 62px,rgba(111,99,85,.13) 62px,rgba(111,99,85,.13) 64px)}
.margin{position:absolute;left:72px;top:0;width:3px;height:1080px;background:rgba(178,58,46,.4)}
</style></head><body><div class="fit"><div class="paper"></div><div class="lines"></div><div class="margin"></div>${inner}</div></body></html>`;
}

const picks = matrixPicks();
const matrixLines = picks.map(({ scene, copy }, i) => `- out/cover-matrix-${i + 1}.png（1440×1080）${copy.lines ? ` — ${copy.lines.join("")}` : scene.tag ? ` — ${scene.tag}` : ""}`);

const md = `# B 站发布材料 · #${episode.issue}

- 视频：out/program.mp4（${mmss(timeline.total)}）
- 字幕：已烧进成片；out/captions.srt 只作内部留档，不上传 B 站（否则叠两层）
- 主封面 16:9：out/cover.png（1920×1080）
- 主封面 4:3：out/cover-4x3.png（1440×1080，B 站封面编辑器不单独收 4:3，投稿时不用）
- 主封面 3:4：out/cover-3x4.png（1080×1440）
- 主封面 9:16：out/cover-9x16.png（1080×1920）
- 封面矩阵 4:3（B 站最多 5 张，传 1–5）：
${matrixLines.map((l) => `  ${l}`).join("\n")}
- 标题：${titleStatus}
- 分区：${bili.zone || "人工智能"}
- 标签：${(bili.tags || []).join("、") || "（未写）"}

## 标题

${titleSection}

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

  const shooter = await openShooter(outDir, workDir);
  const browserApp = shooter.app;
  const shoot = shooter.shoot;
  try {
    const lead = await evidence(cover);
    await shoot(mainCover("16:9", lead), 1920, 1080, "cover");
    await shoot(mainCover("4:3", lead), 1440, 1080, "cover-4x3");
    await shoot(mainCover("3:4", lead), 1080, 1440, "cover-3x4");
    await shoot(mainCover("9:16", lead), 1080, 1920, "cover-9x16");

    for (let i = 0; i < picks.length; i++) {
      const { scene, copy } = picks[i];
      if (scene.type === "page") {
        const ev = await evidence({ ...copy, scene: scene.id });
        await shoot(matrixCover(ev, copy, i), 1440, 1080, `cover-matrix-${i + 1}`);
        continue;
      }
      const compositionHtml = await fs.readFile(path.join(epDir, "compositions", `${scene.id}.html`), "utf8").catch(() => {
        throw new Error(`${scene.id}: 缺少 compositions/${scene.id}.html，先跑 build.mjs`);
      });
      const file = path.join(workDir, `cover-matrix-${i + 1}.html`);
      await fs.writeFile(file, diagramStill(compositionHtml));
      const page = await browserApp.newPage({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1 });
      await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
      await page.evaluate(() => {
        for (const el of document.querySelectorAll(".later, .hl, .mk > b")) el.style.opacity = "1";
        for (const el of document.querySelectorAll(".hl, .mk > b")) el.style.transform = "scaleX(1)";
      });
      await page.screenshot({ path: path.join(outDir, `cover-matrix-${i + 1}.png`) });
      await page.close();
    }
  } finally {
    await shooter.close();
  }
}

const titleLog = `标题「${title}」（${chars(title)} 字）`;
const coverLog = copyOnly ? "（未重做封面）" : `，主封面 4 张, 矩阵 ${picks.length} 张（${picks.map(({ scene }) => scene.id).join("、")}）`;
console.log(`[publish] ${titleLog}，简介 ${chars(desc)} 字，${links.length} 条链接 → out/bilibili.md${coverLog}`);
