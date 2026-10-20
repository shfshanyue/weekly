// 生成 B 站发布材料：out/bilibili.md，以及主封面三张 + 封面矩阵六张。
// 用法：node scripts/publish.mjs <期目录>（先跑 build.mjs，它会写 .work/timeline.json 和 compositions/）
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const epDir = path.resolve(process.argv[2] || ".");
const episode = JSON.parse(await fs.readFile(path.join(epDir, "episode.json"), "utf8"));
const timeline = JSON.parse(await fs.readFile(path.join(epDir, ".work", "timeline.json"), "utf8"));
const bili = episode.bilibili || {};
const outDir = path.join(epDir, "out");
const workDir = path.join(epDir, ".work");
await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(workDir, { recursive: true });

const mmss = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

const title = bili.title || episode.title;
if ([...title].length > 80) throw new Error(`B 站标题超过 80 字：${title}`);
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
const titleHtml = (cover.lines || [episode.title])
  .map((l) => (cover.mark && l.includes(cover.mark) ? esc(l).replace(esc(cover.mark), `<span class="mk">${esc(cover.mark)}</span>`) : esc(l)))
  .join("<br>");

// 16:9 版式保持原样。4:3 只把字号和行宽收进更窄的画布。9:16 整块放在竖画布中段，上下留空。
function typeCover(kind) {
  const common = `*{margin:0;padding:0;box-sizing:border-box}
.lines{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,transparent 0,transparent 62px,rgba(111,99,85,.13) 62px,rgba(111,99,85,.13) 64px)}
.mk{position:relative;display:inline-block;z-index:0}
.mk:before{content:"";position:absolute;left:-14px;right:-14px;top:52%;bottom:-2%;background:#ffd84d;z-index:-1;border-radius:8px}
.kicker{font-weight:700;color:#b23a2e;letter-spacing:.06em}
h1{font-family:"Songti SC",serif;font-weight:900;line-height:1.12}
.sub{font-weight:700}`;
  if (kind === "16:9") {
    return `<!doctype html><html><head><meta charset="utf-8"><style>
${common}
html,body{width:1920px;height:1080px;overflow:hidden;background:#f5efe3;font-family:"PingFang SC",sans-serif;color:#2b2622}
.margin{position:absolute;left:72px;top:0;width:3px;height:1080px;background:rgba(178,58,46,.4)}
.ghost{position:absolute;right:-20px;top:-150px;font-family:"Songti SC",serif;font-weight:700;font-size:820px;line-height:1;color:#b23a2e;opacity:.13}
.wrap{position:absolute;left:130px;top:120px;width:1680px}
.kicker{font-size:54px}
h1{font-size:220px;margin-top:40px}
.rule{width:1100px;height:7px;background:#2b2622;margin:50px 0 40px}
.sub{font-size:68px}
</style></head><body><div class="lines"></div><div class="margin"></div><div class="ghost">${esc(episode.issue)}</div>
<div class="wrap"><div class="kicker">开发者 AI 周刊 · #${esc(episode.issue)}</div>
<h1>${titleHtml}</h1>
<div class="rule"></div><div class="sub">${esc(cover.sub || "")}</div></div></body></html>`;
  }
  if (kind === "4:3") {
    return `<!doctype html><html><head><meta charset="utf-8"><style>
${common}
html,body{width:1440px;height:1080px;overflow:hidden;background:#f5efe3;font-family:"PingFang SC",sans-serif;color:#2b2622}
.margin{position:absolute;left:64px;top:0;width:3px;height:1080px;background:rgba(178,58,46,.4)}
.ghost{position:absolute;right:-40px;top:-80px;font-family:"Songti SC",serif;font-weight:700;font-size:640px;line-height:1;color:#b23a2e;opacity:.13}
.wrap{position:absolute;left:108px;top:150px;width:1220px}
.kicker{font-size:42px}
h1{font-size:168px;margin-top:36px}
.rule{width:820px;height:7px;background:#2b2622;margin:42px 0 32px}
.sub{font-size:46px}
</style></head><body><div class="lines"></div><div class="margin"></div><div class="ghost">${esc(episode.issue)}</div>
<div class="wrap"><div class="kicker">开发者 AI 周刊 · #${esc(episode.issue)}</div>
<h1>${titleHtml}</h1>
<div class="rule"></div><div class="sub">${esc(cover.sub || "")}</div></div></body></html>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${common}
html,body{width:1080px;height:1920px;overflow:hidden;background:#f5efe3;font-family:"PingFang SC",sans-serif;color:#2b2622}
body{display:flex;align-items:center;justify-content:center}
.margin{position:absolute;left:56px;top:0;width:3px;height:1920px;background:rgba(178,58,46,.4)}
.ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-54%);font-family:"Songti SC",serif;font-weight:700;font-size:720px;line-height:1;color:#b23a2e;opacity:.13}
.wrap{position:relative;width:900px;z-index:1}
.kicker{font-size:36px}
h1{font-size:120px;margin-top:28px}
.rule{width:620px;height:7px;background:#2b2622;margin:36px 0 28px}
.sub{font-size:40px}
</style></head><body><div class="lines"></div><div class="margin"></div><div class="ghost">${esc(episode.issue)}</div>
<div class="wrap"><div class="kicker">开发者 AI 周刊 · #${esc(episode.issue)}</div>
<h1>${titleHtml}</h1>
<div class="rule"></div><div class="sub">${esc(cover.sub || "")}</div></div></body></html>`;
}

const DIAGRAMS = new Set(["triad", "gate", "bars", "slots", "tree"]);
const MATRIX_COUNT = 6;
// 浏览器窗口在 1920×1080 画面里的位置，与 build.mjs 的 stage / .win / .notes 一致。
const STAGE_X = 110;
const WIN_W = 1240;
const NOTES_X = STAGE_X + 1300;
const NOTES_W = 420;
const CROP = { x: 0, y: 0, width: 1440, height: 1080 };
const VW = 1240;
const VH = 770 - (46 + 48 + 1);

function matrixPicks(scenes) {
  const pages = scenes.filter((s) => s.type === "page");
  const picked = pages.slice(0, MATRIX_COUNT);
  if (picked.length < MATRIX_COUNT) {
    for (const s of scenes) {
      if (picked.length >= MATRIX_COUNT) break;
      if (DIAGRAMS.has(s.type)) picked.push(s);
    }
  }
  return picked;
}

// 与 build.mjs page() 里第一处高亮停下的位移一致：黄条扫完、慢推近开始之前。
function highlightPose(cap, rects) {
  const base = VW / cap.width;
  const x0 = Math.min(...rects.map((r) => r.x));
  const x1 = Math.max(...rects.map((r) => r.x + r.w));
  const y0 = Math.min(...rects.map((r) => r.y));
  const y1 = Math.max(...rects.map((r) => r.y + r.h));
  const z = Math.max(base, Math.min(base * 1.5, (VW - 120) / (x1 - x0)));
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const x = clamp(VW / 2 - cx * z, VW - cap.width * z, 0);
  const y = clamp(VH * 0.42 - cy * z, Math.min(0, VH - cap.height * z), 0);
  return { x: r3(x), y: r3(y), z: r3(z) };
}

function firstHighlight(scene, cap) {
  const beats = scene.beats || [];
  const hi = beats.findIndex((b) => b.highlight && cap.highlights[b.highlight]?.found && cap.highlights[b.highlight].rects?.length);
  if (hi < 0) throw new Error(`${scene.id}: 没有可用的荧光笔，不能做矩阵封面`);
  let from = 0;
  for (const b of beats.slice(0, hi)) {
    const h = b.highlight && cap.highlights[b.highlight];
    if (h?.found) from += h.rects.length;
  }
  const rects = cap.highlights[beats[hi].highlight].rects;
  const noteFits = NOTES_X >= CROP.x && NOTES_X + NOTES_W <= CROP.x + CROP.width;
  const noteIndex = noteFits && beats[hi].note ? beats.slice(0, hi + 1).filter((b) => b.note).length - 1 : -1;
  return { pose: highlightPose(cap, rects), hlFrom: from, hlTo: from + rects.length, noteIndex };
}

function stillDocument(compositionHtml, fit) {
  const inner = compositionHtml.split("<template>")[1].split("<script>")[0];
  const paper = `<div class="paper"></div><div class="lines"></div><div class="margin"></div>`;
  const frameCss = `.paper{position:absolute;inset:0;background:#f5efe3}
.lines{position:absolute;left:0;top:0;width:1920px;height:1080px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 62px,rgba(111,99,85,.13) 62px,rgba(111,99,85,.13) 64px)}
.margin{position:absolute;left:72px;top:0;width:3px;height:1080px;background:rgba(178,58,46,.4)}`;
  if (fit) {
    return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:1440px;height:1080px;overflow:hidden;background:#f5efe3}
.fit{position:absolute;left:0;top:135px;width:1920px;height:1080px;transform:scale(.75);transform-origin:0 0}
${frameCss}
</style></head><body><div class="fit">${paper}${inner}</div></body></html>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#f5efe3}
${frameCss}
</style></head><body>${paper}${inner}</body></html>`;
}

const picks = matrixPicks(episode.scenes);
const matrixLines = picks.map((s, i) => `- out/cover-matrix-${i + 1}.png（1440×1080）${s.tag ? ` — ${s.tag}` : ""}`);

const md = `# B 站发布材料 · #${episode.issue}

- 视频：out/program.mp4（${mmss(timeline.total)}）
- 字幕：out/captions.srt（上传时选「导入字幕」）
- 主封面 16:9：out/cover.png（1920×1080）
- 主封面 4:3：out/cover-4x3.png（1440×1080）
- 抖音封面 9:16：out/cover-9x16.png（1080×1920）
- 封面矩阵 4:3：
${matrixLines.map((l) => `  ${l}`).join("\n")}
- 分区：${bili.zone || "知识 · 科学科普 / 科技 · 计算机技术"}
- 标签：${(bili.tags || []).join("、")}

## 标题

${title}

## 简介

\`\`\`
${desc}
\`\`\`
`;
await fs.writeFile(path.join(outDir, "bilibili.md"), md);

for (const name of await fs.readdir(outDir)) {
  if (/^cover-matrix-\d+\.png$/.test(name)) await fs.unlink(path.join(outDir, name));
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
try {
  const shoot = async (html, width, height, file, clip) => {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "load" });
    await page.screenshot({ path: file, clip });
    await page.close();
  };
  await fs.writeFile(path.join(workDir, "cover.html"), typeCover("16:9"));
  await fs.writeFile(path.join(workDir, "cover-4x3.html"), typeCover("4:3"));
  await fs.writeFile(path.join(workDir, "cover-9x16.html"), typeCover("9:16"));
  await shoot(typeCover("16:9"), 1920, 1080, path.join(outDir, "cover.png"));
  await shoot(typeCover("4:3"), 1440, 1080, path.join(outDir, "cover-4x3.png"));
  await shoot(typeCover("9:16"), 1080, 1920, path.join(outDir, "cover-9x16.png"));

  for (let i = 0; i < picks.length; i++) {
    const scene = picks[i];
    const compPath = path.join(epDir, "compositions", `${scene.id}.html`);
    const compositionHtml = await fs.readFile(compPath, "utf8").catch(() => {
      throw new Error(`${scene.id}: 缺少 compositions/${scene.id}.html，先跑 build.mjs`);
    });
    const isPage = scene.type === "page";
    let pose = null;
    if (isPage) {
      const capPath = path.join(epDir, "assets", "capture", `${scene.props.page}.json`);
      const cap = JSON.parse(await fs.readFile(capPath, "utf8").catch(() => {
        throw new Error(`${scene.id}: 缺少网页抓取 ${scene.props.page}，先跑 capture.mjs`);
      }));
      pose = firstHighlight(scene, cap);
    }
    const stillPath = path.join(workDir, `matrix-${i + 1}.html`);
    await fs.writeFile(stillPath, stillDocument(compositionHtml, !isPage));
    const page = await browser.newPage({
      viewport: isPage ? { width: 1920, height: 1080 } : { width: 1440, height: 1080 },
      deviceScaleFactor: 1,
    });
    await page.goto(pathToFileURL(stillPath).href, { waitUntil: "load" });
    await page.evaluate(async (state) => {
      await Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
      if (!state) {
        for (const el of document.querySelectorAll(".later, .hl, .mk > b")) el.style.opacity = "1";
        for (const el of document.querySelectorAll(".hl, .mk > b")) el.style.transform = "scaleX(1)";
        return;
      }
      const pg = document.querySelector(".pg");
      if (pg) pg.style.transform = `translate(${state.pose.x}px, ${state.pose.y}px) scale(${state.pose.z})`;
      [...document.querySelectorAll(".hl")].forEach((el, n) => {
        el.style.transform = n >= state.hlFrom && n < state.hlTo ? "scaleX(1)" : "scaleX(0)";
      });
      [...document.querySelectorAll(".note")].forEach((el, n) => {
        el.style.visibility = n === state.noteIndex ? "visible" : "hidden";
      });
    }, pose);
    const file = path.join(outDir, `cover-matrix-${i + 1}.png`);
    await page.screenshot({ path: file, clip: isPage ? CROP : undefined });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`[publish] 标题 ${[...title].length} 字，简介 ${[...desc].length} 字，${links.length} 条链接 → out/bilibili.md, 主封面 3 张, 矩阵 ${picks.length} 张（${picks.map((s) => s.id).join("、")}）`);
