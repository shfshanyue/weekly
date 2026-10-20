// 生成 B 站发布材料：out/bilibili.md（五条标题、分区、标签、简介），以及主封面四张 + 封面矩阵六张。
// 用法：node scripts/publish.mjs <期目录> [--copy]
// --copy 只重写 bilibili.md，不重做封面。先跑 build.mjs，它会写 .work/timeline.json 和 compositions/。
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { C, esc, FONT_CSS, CHROME_H, CHROME_CSS, chromeBar } from "./chrome.mjs";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const copyOnly = process.argv.includes("--copy");
const epDir = path.resolve(process.argv.slice(2).find((a) => a !== "--copy") || ".");
const chars = (s) => [...String(s)].length;
// 这三档简介上限都是 2000 字。生活、娱乐等 250 字分区不收这档节目。
const ZONES = ["科技 · 计算机技术", "科技 · 软件应用", "知识 · 科学科普"];
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

// titles 为五条候选。title 是用户选定的那一条原文；空着表示还没选。没有 titles 时沿用旧的单标题。
function titleCopy(bili, episode) {
  const titles = Array.isArray(bili.titles) ? bili.titles : null;
  if (!titles) {
    const title = bili.title || episode.title;
    if (!title) throw new Error("缺少 B 站标题");
    if (chars(title) > 80) throw new Error(`B 站标题超过 80 字：${title}`);
    return { titles: [title], chosen: title, legacy: true };
  }
  if (titles.length !== 5) throw new Error(`bilibili.titles 需要正好 5 条，现在是 ${titles.length}`);
  const seen = new Set();
  for (let i = 0; i < titles.length; i++) {
    const t = titles[i];
    if (typeof t !== "string" || !t.trim()) throw new Error(`第 ${i + 1} 条标题是空的`);
    if (t !== t.trim()) throw new Error(`第 ${i + 1} 条标题首尾有空格`);
    if (chars(t) > 80) throw new Error(`第 ${i + 1} 条标题 ${chars(t)} 字，超过 80：${t}`);
    if (seen.has(t)) throw new Error(`标题重复：${t}`);
    seen.add(t);
  }
  const chosen = typeof bili.title === "string" ? bili.title : "";
  if (chosen && !titles.includes(chosen)) throw new Error(`bilibili.title 不在五条候选里：${chosen}`);
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
  if (!ZONES.includes(bili.zone)) throw new Error(`分区必须是这三档之一：${ZONES.join("、")}。现在是「${bili.zone || "空"}」`);
  if (typeof bili.intro !== "string" || !bili.intro.trim()) throw new Error("缺少 bilibili.intro");
  return { titles, chosen, legacy: false };
}

const { titles, chosen, legacy } = titleCopy(bili, episode);
const chosenIndex = chosen ? titles.indexOf(chosen) : -1;
const titleStatus = legacy ? `单标题 ${chars(titles[0])} 字` : chosen ? `已选第 ${chosenIndex + 1} 条` : "五选一，尚未选定";
const titleSection = legacy
  ? titles[0]
  : chosen
    ? `已选第 ${chosenIndex + 1} 条。投稿时复制这一行：\n\n${chosen}\n\n候选：\n${titles.map((t, i) => `${i + 1}. ${t}（${chars(t)} 字）${i === chosenIndex ? " ← 已选" : ""}`).join("\n")}`
    : `尚未选定。回复 1–5 的编号；选定后把那一条原文写入 episode.json 的 bilibili.title，再跑 \`node scripts/publish.mjs episodes/weekly-${episode.issue} --copy\`。\n\n${titles.map((t, i) => `${i + 1}. ${t}（${chars(t)} 字）`).join("\n")}`;
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
const titleHtml = (lines, mark) =>
  lines.map((l) => (mark && l.includes(mark) ? esc(l).replace(esc(mark), `<span class="mk">${esc(mark)}</span>`) : esc(l))).join("<br>");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// 封面 HTML 写在 .work/ 里，素材从期目录的 assets/ 取。
const A = "../assets/";

const captures = {};
async function capture(pageId) {
  if (!captures[pageId]) {
    const capPath = path.join(epDir, "assets", "capture", `${pageId}.json`);
    captures[pageId] = JSON.parse(await fs.readFile(capPath, "utf8").catch(() => {
      throw new Error(`缺少网页抓取 ${pageId}，先跑 capture.mjs`);
    }));
  }
  return captures[pageId];
}

// 封面上摆的「证据」：一个网页场景里的一处荧光笔，加一条红批注。
// 没指定时取场景里第一处可用的荧光笔，批注取这一拍或之后最近的一条。
async function evidence(pick = {}) {
  const scene = pick.scene ? episode.scenes.find((s) => s.id === pick.scene) : episode.scenes.find((s) => s.type === "page");
  if (!scene || scene.type !== "page") throw new Error(`封面要的网页场景不存在：${pick.scene || "（本期没有 page 场景）"}`);
  const cap = await capture(scene.props.page);
  const beats = scene.beats || [];
  const usable = (id) => id && cap.highlights[id]?.found && cap.highlights[id].rects?.length;
  const hl = pick.highlight || beats.find((b) => usable(b.highlight))?.highlight;
  if (!usable(hl)) throw new Error(`${scene.id}: 没有可用的荧光笔 ${hl || ""}`);
  const at = beats.findIndex((b) => b.highlight === hl);
  const note = pick.note ?? (at >= 0 ? beats.slice(at).find((b) => b.note)?.note : undefined) ?? "";
  return { scene, spec: episode.pages[scene.props.page], cap, rects: cap.highlights[hl].rects, note };
}

// 任意尺寸的 Chrome 窗口，页面推近到荧光笔那句，句子停在视口 focus 高度处。
function browser(ev, w, h, focus = 0.42) {
  const { cap, rects } = ev;
  const vw = w;
  const vh = h - CHROME_H;
  const x0 = Math.min(...rects.map((r) => r.x));
  const x1 = Math.max(...rects.map((r) => r.x + r.w));
  const y0 = Math.min(...rects.map((r) => r.y));
  const y1 = Math.max(...rects.map((r) => r.y + r.h));
  const z = clamp((vw - 140) / (x1 - x0), vw / cap.width, cap.dpr || 1.5);
  const x = clamp(vw / 2 - ((x0 + x1) / 2) * z, vw - cap.width * z, 0);
  const y = clamp(vh * focus - ((y0 + y1) / 2) * z, Math.min(0, vh - cap.height * z), 0);
  const pad = 6;
  const bars = rects
    .map((r) => `<b class="hl" style="left:${r.x - pad}px;top:${r3(r.y + r.h * 0.08)}px;width:${r.w + pad * 2}px;height:${r3(r.h * 0.9)}px"></b>`)
    .join("");
  return `${chromeBar(ev.spec, cap, A)}<div class="vp" style="width:${vw}px;height:${vh}px"><div class="pg" style="width:${cap.width}px;height:${cap.height}px;transform:translate(${r3(x)}px,${r3(y)}px) scale(${r3(z)})"><img src="${A}capture/${esc(cap.image)}" style="width:${cap.width}px;height:${cap.height}px" alt="">${bars}</div></div>`;
}

const kicker = (extra) => `<div class="kicker"><i></i>开发者 AI 周刊 · #${esc(episode.issue)}${extra ? ` · ${esc(extra)}` : ""}</div>`;
const foot = `<div class="foot"><img src="${A}avatar.jpg" alt=""><span>山月</span><span class="dot"></span><span class="url">weekly.shanyue.tech</span></div>`;

function doc(width, height, css, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONT_CSS}
*{margin:0;padding:0}
html,body{width:${width}px;height:${height}px;overflow:hidden;background:${C.paper};font-family:"PingFang SC",sans-serif;color:${C.ink}}
.lines{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,transparent 0,transparent 62px,rgba(111,99,85,.13) 62px,rgba(111,99,85,.13) 64px)}
.margin{position:absolute;top:0;bottom:0;width:3px;background:rgba(178,58,46,.4)}
.ghost{position:absolute;font-family:"Songti SC",serif;font-weight:700;line-height:1;color:${C.red};opacity:.12;white-space:nowrap}
.kicker{display:flex;align-items:center;gap:.45em;font-weight:600;color:${C.red};letter-spacing:.06em;white-space:nowrap}
.kicker i{display:block;width:1.4em;height:.1em;background:${C.red}}
h1{font-family:"Songti SC",serif;font-weight:900;line-height:1.14;white-space:nowrap}
.mk{position:relative;display:inline-block;z-index:0}
.mk:before{content:"";position:absolute;left:-.07em;right:-.07em;top:52%;bottom:-2%;background:${C.marker};z-index:-1;border-radius:.04em}
.rule{height:6px;background:${C.ink}}
.sub{font-weight:600;white-space:nowrap}
.win{position:absolute;background:#fff;border:1px solid rgba(0,0,0,.22);border-radius:14px;overflow:hidden;box-shadow:0 44px 90px rgba(43,38,34,.26),0 12px 28px rgba(43,38,34,.14)}
${CHROME_CSS}
.vp{position:absolute;left:0;top:${CHROME_H}px;overflow:hidden;background:#fff}
.pg{position:absolute;left:0;top:0;transform-origin:0 0}
.pg img{position:absolute;left:0;top:0;display:block}
.hl{position:absolute;display:block;background:${C.marker};mix-blend-mode:multiply;border-radius:3px}
.note{position:absolute;border:4px solid ${C.red};color:${C.red};background:${C.card};padding:.42em .75em;font-weight:600;line-height:1.3;border-radius:10px;white-space:nowrap;box-shadow:0 14px 30px rgba(43,38,34,.18)}
.foot{position:absolute;display:flex;align-items:center;gap:.6em;color:${C.muted};font-weight:600;white-space:nowrap}
.foot img{width:1.9em;height:1.9em;border-radius:50%;object-fit:cover;border:3px solid ${C.card};box-shadow:0 0 0 2px ${C.line}}
.foot span:nth-of-type(1){color:${C.ink}}
.foot .dot{width:.3em;height:.3em;border-radius:50%;background:${C.line}}
.foot .url{font-family:"JetBrains Mono",monospace;font-weight:500}
${css}
</style></head><body><div class="lines"></div><div class="margin"></div>
${body}
</body></html>`;
}

// 四张主封面共用 bilibili.cover 的文案和同一处原文证据，各自按画幅排，不互相裁切。
function mainCover(kind, ev) {
  const h1 = `<h1>${titleHtml(cover.lines || [episode.title], cover.mark)}</h1>`;
  const sub = `<div class="sub">${esc(cover.sub || "")}</div>`;
  const note = ev.note ? `<div class="note">${esc(ev.note)}</div>` : "";
  if (kind === "16:9") {
    return doc(1920, 1080, `.margin{left:72px}
.wrap{position:absolute;left:130px;top:150px}
.kicker{font-size:44px}
h1{font-size:176px;margin-top:40px}
.rule{width:780px;margin:52px 0 36px}
.sub{font-size:46px}
.foot{left:130px;bottom:86px;font-size:32px}
.win{left:1050px;top:200px;transform:rotate(2.2deg)}
.note{left:968px;top:792px;font-size:46px;transform:rotate(-3deg)}`,
      `<div class="win" style="width:820px;height:640px">${browser(ev, 820, 640, 0.4)}</div>${note}
<div class="wrap">${kicker()}${h1}<div class="rule"></div>${sub}</div>${foot}`);
  }
  if (kind === "4:3") {
    return doc(1440, 1080, `.margin{left:64px}
.ghost{right:-30px;top:-110px;font-size:560px}
.wrap{position:absolute;left:110px;top:96px}
.kicker{font-size:38px}
h1{font-size:164px;margin-top:30px}
.rule{width:600px;margin:40px 0 28px}
.sub{font-size:40px}
.foot{left:110px;bottom:70px;font-size:28px}
.win{left:660px;top:716px;transform:rotate(-2.4deg)}
.note{left:110px;top:760px;font-size:40px;transform:rotate(-3deg)}`,
      `<div class="ghost">${esc(episode.issue)}</div>
<div class="win" style="width:900px;height:560px">${browser(ev, 900, 560, 0.24)}</div>${note}
<div class="wrap">${kicker()}${h1}<div class="rule"></div>${sub}</div>${foot}`);
  }
  if (kind === "3:4") {
    return doc(1080, 1440, `.margin{left:56px}
.ghost{right:-36px;top:-70px;font-size:480px}
.wrap{position:absolute;left:88px;top:80px}
.kicker{font-size:34px}
h1{font-size:132px;margin-top:22px}
.rule{width:520px;margin:30px 0 22px}
.sub{font-size:32px}
.win{left:64px;top:680px;transform:rotate(-2deg)}
.note{right:48px;top:618px;font-size:38px;transform:rotate(3deg)}
.foot{left:88px;bottom:44px;font-size:28px}`,
      `<div class="ghost">${esc(episode.issue)}</div>
<div class="wrap">${kicker()}${h1}<div class="rule"></div>${sub}</div>
<div class="win" style="width:960px;height:580px">${browser(ev, 960, 580, 0.4)}</div>${note}${foot}`);
  }
  if (kind === "9:16") {
    return doc(1080, 1920, `.margin{left:56px}
.ghost{right:-40px;top:20px;font-size:620px}
.wrap{position:absolute;left:100px;top:300px}
.kicker{font-size:40px}
h1{font-size:156px;margin-top:36px}
.rule{width:620px;margin:48px 0 34px}
.sub{font-size:40px}
.win{left:80px;top:1060px;transform:rotate(-2deg)}
.note{right:70px;top:1000px;font-size:44px;transform:rotate(3deg)}
.foot{left:100px;bottom:110px;font-size:32px}`,
      `<div class="ghost">${esc(episode.issue)}</div>
<div class="wrap">${kicker()}${h1}<div class="rule"></div>${sub}</div>
<div class="win" style="width:920px;height:660px">${browser(ev, 920, 660, 0.36)}</div>${note}${foot}`);
  }
  throw new Error(`未知封面画幅：${kind}`);
}

// 矩阵封面按 4:3 原生排版：大标题 + 推近到荧光笔的原文窗口 + 红批注。
function matrixCover(ev, copy, index) {
  const section = (ev.scene.tag || "").split(" · ")[0];
  const lines = copy.lines || [(ev.scene.tag || "").split(" · ").slice(1).join(" · ") || ev.spec.name];
  const note = ev.note ? `<div class="note">${esc(ev.note)}</div>` : "";
  return doc(1440, 1080, `.margin{left:64px}
.ghost{right:40px;top:30px;font-size:200px;opacity:.14}
.wrap{position:absolute;left:110px;top:76px}
.kicker{font-size:34px}
h1{font-size:${lines.length > 1 ? 112 : 128}px;margin-top:22px}
.win{left:110px;top:${lines.length > 1 ? 470 : 360}px;transform:rotate(-1.2deg)}
.note{right:56px;top:${lines.length > 1 ? 424 : 316}px;font-size:42px;transform:rotate(2.5deg)}`,
    `<div class="ghost">${String(index + 1).padStart(2, "0")}</div>
<div class="wrap">${kicker(section)}<h1>${titleHtml(lines, copy.mark)}</h1></div>
<div class="win" style="width:1240px;height:720px">${browser(ev, 1240, 720, 0.3)}</div>${note}`);
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
- 字幕：out/captions.srt（上传时选「导入字幕」）
- 主封面 16:9：out/cover.png（1920×1080）
- 主封面 4:3：out/cover-4x3.png（1440×1080）
- 主封面 3:4：out/cover-3x4.png（1080×1440）
- 主封面 9:16：out/cover-9x16.png（1080×1920）
- 封面矩阵 4:3：
${matrixLines.map((l) => `  ${l}`).join("\n")}
- 标题：${titleStatus}
- 分区：${bili.zone || "知识 · 科学科普 / 科技 · 计算机技术"}
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

  const browserApp = await chromium.launch({ executablePath: CHROME, headless: true });
  try {
    const shoot = async (html, width, height, name) => {
      const file = path.join(workDir, `${name}.html`);
      await fs.writeFile(file, html);
      const page = await browserApp.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
      await page.evaluate(async () => {
        await Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
        await document.fonts.ready;
      });
      const broken = await page.evaluate(() => [...document.images].filter((img) => !img.naturalWidth).map((img) => img.getAttribute("src")));
      if (broken.length) throw new Error(`${name}: 图片没加载出来 ${broken.join(", ")}`);
      await page.screenshot({ path: path.join(outDir, `${name}.png`) });
      await page.close();
    };

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
    await browserApp.close();
  }
}

const titleLog = legacy ? `标题 ${chars(titles[0])} 字` : chosen ? `标题已选第 ${chosenIndex + 1} 条（${chars(chosen)} 字）` : "标题 5 条，尚未选定";
const coverLog = copyOnly ? "（未重做封面）" : `，主封面 4 张, 矩阵 ${picks.length} 张（${picks.map(({ scene }) => scene.id).join("、")}）`;
console.log(`[publish] ${titleLog}，简介 ${chars(desc)} 字，${links.length} 条链接 → out/bilibili.md${coverLog}`);
