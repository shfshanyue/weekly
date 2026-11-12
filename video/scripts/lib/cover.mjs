// 封面公共件：页面骨架、推近到荧光笔的 Chrome 窗口、主封面四种画幅、4:3 矩阵封面、截图。
// publish.mjs 与 publish-read.mjs 共用。封面 HTML 写在 .work/ 里，素材从期目录的 assets/ 取。
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { C, esc, FONT_CSS, CHROME_H, CHROME_CSS, chromeBar } from "../chrome.mjs";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const r3 = (n) => Math.round(n * 1000) / 1000;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const A = "../assets/";

export const titleHtml = (lines, mark) =>
  lines.map((l) => (mark && l.includes(mark) ? esc(l).replace(esc(mark), `<span class="mk">${esc(mark)}</span>`) : esc(l))).join("<br>");

// 长图：周刊是一张 cap.image；单篇按高度切片，cap.images = [{file, y, h}]。
export function pageImages(cap, assetBase) {
  if (!cap.images) return `<img src="${assetBase}capture/${esc(cap.image)}" style="width:${cap.width}px;height:${cap.height}px" alt="">`;
  return cap.images.map((s) => `<img src="${assetBase}capture/${esc(s.file)}" style="top:${s.y}px;width:${cap.width}px;height:${s.h}px" alt="">`).join("");
}

// 封面上摆的「证据」：一个网页场景里的一处荧光笔，加一条红批注。
// 没指定时取场景里第一处可用的荧光笔，批注取这一拍或之后最近的一条。
export function createEvidence(epDir, episode, sceneType) {
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
  return async function evidence(pick = {}) {
    const scene = pick.scene ? episode.scenes.find((s) => s.id === pick.scene) : episode.scenes.find((s) => s.type === sceneType);
    if (!scene || scene.type !== sceneType) throw new Error(`封面要的网页场景不存在：${pick.scene || `（没有 ${sceneType} 场景）`}`);
    const cap = await capture(scene.props.page);
    const beats = scene.beats || [];
    const usable = (id) => id && cap.highlights[id]?.found && cap.highlights[id].rects?.length;
    const hl = pick.highlight || beats.find((b) => usable(b.highlight))?.highlight;
    if (!usable(hl)) throw new Error(`${scene.id}: 没有可用的荧光笔 ${hl || ""}`);
    const at = beats.findIndex((b) => b.highlight === hl);
    const note = pick.note ?? (at >= 0 ? beats.slice(at).find((b) => b.note)?.note : undefined) ?? "";
    return { scene, spec: episode.pages[scene.props.page], cap, rects: cap.highlights[hl].rects, note };
  };
}

// 任意尺寸的 Chrome 窗口，页面推近到荧光笔那句，句子停在视口 focus 高度处。
export function browser(ev, w, h, focus = 0.42) {
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
  return `${chromeBar(ev.spec, cap, A)}<div class="vp" style="width:${vw}px;height:${vh}px"><div class="pg" style="width:${cap.width}px;height:${cap.height}px;transform:translate(${r3(x)}px,${r3(y)}px) scale(${r3(z)})">${pageImages(cap, A)}${bars}</div></div>`;
}

export const kicker = (issue, extra) => `<div class="kicker"><i></i>开发者 AI 周刊 · #${esc(issue)}${extra ? ` · ${esc(extra)}` : ""}</div>`;
export const foot = `<div class="foot"><img src="${A}avatar.jpg" alt=""><span>山月</span><span class="dot"></span><span class="url">weekly.shanyue.tech</span></div>`;

export function doc(width, height, css, body) {
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

// 四张主封面共用一套文案和同一处原文证据，各自按画幅排，不互相裁切。
// copy: { lines, mark, sub }；fallbackTitle 在没写 lines 时用；kickerExtra 加在期号后。
export function mainCover(kind, ev, { copy, issue, fallbackTitle, kickerExtra }) {
  const k = kicker(issue, kickerExtra);
  const h1 = `<h1>${titleHtml(copy.lines || [fallbackTitle], copy.mark)}</h1>`;
  const sub = `<div class="sub">${esc(copy.sub || "")}</div>`;
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
<div class="wrap">${k}${h1}<div class="rule"></div>${sub}</div>${foot}`);
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
      `<div class="ghost">${esc(issue)}</div>
<div class="win" style="width:900px;height:560px">${browser(ev, 900, 560, 0.24)}</div>${note}
<div class="wrap">${k}${h1}<div class="rule"></div>${sub}</div>${foot}`);
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
      `<div class="ghost">${esc(issue)}</div>
<div class="wrap">${k}${h1}<div class="rule"></div>${sub}</div>
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
      `<div class="ghost">${esc(issue)}</div>
<div class="wrap">${k}${h1}<div class="rule"></div>${sub}</div>
<div class="win" style="width:920px;height:660px">${browser(ev, 920, 660, 0.36)}</div>${note}${foot}`);
  }
  throw new Error(`未知封面画幅：${kind}`);
}

// 矩阵封面按 4:3 原生排版：大标题 + 推近到荧光笔的原文窗口 + 红批注。
export function matrixCover(ev, copy, index, { issue, section, fallbackLine }) {
  const lines = copy.lines || [fallbackLine];
  const note = ev.note ? `<div class="note">${esc(ev.note)}</div>` : "";
  return doc(1440, 1080, `.margin{left:64px}
.ghost{right:40px;top:30px;font-size:200px;opacity:.14}
.wrap{position:absolute;left:110px;top:76px}
.kicker{font-size:34px}
h1{font-size:${lines.length > 1 ? 112 : 128}px;margin-top:22px}
.win{left:110px;top:${lines.length > 1 ? 470 : 360}px;transform:rotate(-1.2deg)}
.note{right:56px;top:${lines.length > 1 ? 424 : 316}px;font-size:42px;transform:rotate(2.5deg)}`,
    `<div class="ghost">${String(index + 1).padStart(2, "0")}</div>
<div class="wrap">${kicker(issue, section)}<h1>${titleHtml(lines, copy.mark)}</h1></div>
<div class="win" style="width:1240px;height:720px">${browser(ev, 1240, 720, 0.3)}</div>${note}`);
}

export async function openShooter(outDir, workDir) {
  const app = await chromium.launch({ executablePath: CHROME, headless: true });
  const shoot = async (html, width, height, name) => {
    const file = path.join(workDir, `${name}.html`);
    await fs.writeFile(file, html);
    const page = await app.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
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
  return { app, shoot, close: () => app.close() };
}
