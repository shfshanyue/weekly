// 生成 B 站发布材料：out/bilibili.md（标题、简介、时间轴、来源链接、标签）和 out/cover.png。
// 用法：node scripts/publish.mjs <期目录>（先跑 build.mjs，它会写 .work/timeline.json）
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const epDir = path.resolve(process.argv[2] || ".");
const episode = JSON.parse(await fs.readFile(path.join(epDir, "episode.json"), "utf8"));
const timeline = JSON.parse(await fs.readFile(path.join(epDir, ".work", "timeline.json"), "utf8"));
const bili = episode.bilibili || {};
const outDir = path.join(epDir, "out");
await fs.mkdir(outDir, { recursive: true });

const mmss = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

const md = `# B 站发布材料 · #${episode.issue}

- 视频：out/program.mp4（${mmss(timeline.total)}）
- 字幕：out/captions.srt（上传时选「导入字幕」）
- 封面：out/cover.png（1920×1080）
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

const cover = bili.cover || {};
const coverHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:#f5efe3;font-family:"PingFang SC",sans-serif;color:#2b2622}
.lines{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,transparent 0,transparent 62px,rgba(111,99,85,.13) 62px,rgba(111,99,85,.13) 64px)}
.margin{position:absolute;left:72px;top:0;width:3px;height:1080px;background:rgba(178,58,46,.4)}
.ghost{position:absolute;right:-20px;top:-150px;font-family:"Songti SC",serif;font-weight:700;font-size:820px;line-height:1;color:#b23a2e;opacity:.13}
.wrap{position:absolute;left:130px;top:120px;width:1680px}
.kicker{font-size:54px;font-weight:700;color:#b23a2e;letter-spacing:.06em}
h1{font-family:"Songti SC",serif;font-weight:900;font-size:220px;line-height:1.12;margin-top:40px}
.mk{position:relative;display:inline-block;z-index:0}
.mk:before{content:"";position:absolute;left:-14px;right:-14px;top:52%;bottom:-2%;background:#ffd84d;z-index:-1;border-radius:8px}
.rule{width:1100px;height:7px;background:#2b2622;margin:50px 0 40px}
.sub{font-size:68px;font-weight:700}
</style></head><body><div class="lines"></div><div class="margin"></div><div class="ghost">${esc(episode.issue)}</div>
<div class="wrap"><div class="kicker">开发者 AI 周刊 · #${esc(episode.issue)}</div>
<h1>${(cover.lines || [episode.title]).map((l) => (cover.mark && l.includes(cover.mark) ? esc(l).replace(esc(cover.mark), `<span class="mk">${esc(cover.mark)}</span>`) : esc(l))).join("<br>")}</h1>
<div class="rule"></div><div class="sub">${esc(cover.sub || "")}</div></div></body></html>`;
await fs.writeFile(path.join(epDir, ".work", "cover.html"), coverHtml);
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.setContent(coverHtml, { waitUntil: "load" });
await page.screenshot({ path: path.join(outDir, "cover.png") });
await browser.close();
console.log(`[publish] 标题 ${[...title].length} 字，简介 ${[...desc].length} 字，${links.length} 条链接 → out/bilibili.md, out/cover.png`);
