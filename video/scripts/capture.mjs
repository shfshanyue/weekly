// 抓取原文网页长图，并记录重点句在页面上的坐标，供合成里模拟滚动和荧光笔使用。
// 用法：node scripts/capture.mjs <期目录> [--dump] [--meta] [--only <pageId>]
//   --dump  只导出页面正文到 .work/pages/<id>.txt，用来挑选要高亮的原句
//   --meta  只更新标签页标题和网站图标，不重截长图（高亮坐标保持不变）
// 单篇精读（episode.json 里 format: "read"）：按 capture.dpr（默认 3）抓整篇，长图按高度切片
// （images: [{file, y, h}]），另记正文栏、每处高亮所在段落和 figures 配图的位置。周刊行为不变。
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const VIEWPORT = { width: 1280, height: 800 };
const MAX_HEIGHT = 9000;
// 浏览器单张图片的边长上限约 16k，切片留足余量。
const SLICE_DEVICE_PX = 8192;
const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const args = process.argv.slice(2);
const episodeDir = path.resolve(args.find((a) => !a.startsWith("--")) || ".");
const dump = args.includes("--dump");
const metaOnly = args.includes("--meta");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

const episode = JSON.parse(await fs.readFile(path.join(episodeDir, "episode.json"), "utf8"));
const read = episode.format === "read";
const DPR = read ? episode.capture?.dpr || 3 : 1.5;
const pages = Object.entries(episode.pages || {}).filter(([id]) => !only || id === only);
const outDir = path.join(episodeDir, "assets", "capture");
const dumpDir = path.join(episodeDir, ".work", "pages");
await fs.mkdir(dump ? dumpDir : outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const failures = [];

for (const [id, spec] of pages) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
    locale: "en-US",
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  try {
    try {
      await page.goto(spec.url, { waitUntil: "networkidle", timeout: 45000 });
    } catch {
      await page.goto(spec.url, { waitUntil: "load", timeout: 45000 });
    }
    await page.waitForTimeout(1500);
    await dismissOverlays(page);

    if (dump) {
      const textContent = await page.evaluate(() => document.body.innerText);
      await fs.writeFile(path.join(dumpDir, `${id}.txt`), textContent.slice(0, 40000));
      console.log(`[dump] ${id} → ${textContent.length} chars`);
      continue;
    }

    if (metaOnly) {
      const jsonPath = path.join(outDir, `${id}.json`);
      const existing = JSON.parse(await fs.readFile(jsonPath, "utf8"));
      existing.title = await page.title();
      existing.favicon = await saveFavicon(page, id, outDir);
      await fs.writeFile(jsonPath, JSON.stringify(existing, null, 2));
      console.log(`[meta] ${id} 「${existing.title}」 图标 ${existing.favicon || "无"}`);
      continue;
    }

    // Lazy images below the fold only load once scrolled into view.
    await page.evaluate(async (max) => {
      for (let y = 0; y < Math.min(document.body.scrollHeight, max); y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    }, read ? 1e6 : MAX_HEIGHT);
    await page.waitForTimeout(800);

    if (read) {
      await captureRead(page, id, spec);
      continue;
    }

    const highlights = {};
    for (const h of spec.highlights || []) {
      const rects = (await page.evaluate(findText, { needle: h.text })).rects;
      highlights[h.id] = { text: h.text, found: rects.length > 0, rects };
      if (!rects.length) failures.push(`${id}: 找不到高亮原句「${h.text}」`);
    }

    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const lowest = Math.max(0, ...Object.values(highlights).flatMap((h) => h.rects.map((r) => r.y + r.h)));
    const height = Math.min(docHeight, MAX_HEIGHT, Math.max(lowest + 900, VIEWPORT.height * 2));
    const image = `${id}.jpg`;
    await page.screenshot({
      path: path.join(outDir, image),
      type: "jpeg",
      quality: 85,
      fullPage: true,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height },
    });
    const title = await page.title();
    const favicon = await saveFavicon(page, id, outDir);
    await fs.writeFile(
      path.join(outDir, `${id}.json`),
      JSON.stringify({ url: spec.url, title, favicon, width: VIEWPORT.width, height, dpr: DPR, image, highlights }, null, 2),
    );
    console.log(`[capture] ${id} ${VIEWPORT.width}x${height} 高亮 ${Object.values(highlights).filter((h) => h.found).length}/${(spec.highlights || []).length}`);
  } catch (err) {
    failures.push(`${id}: ${err.message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
}
await browser.close();

// 单篇：整篇抓到正文结束，按高度切片；记录正文栏、段落和配图坐标，供全屏推近、聚光和配图放大。
async function captureRead(page, id, spec) {
  // 3 倍清晰度下配图取的是 3840 宽的大图，滚动预加载时常常还没下完或没解码，截出来是空白框。
  await page.evaluate(() => document.querySelectorAll("img").forEach((img) => (img.loading = "eager")));
  await waitImages(page, 0, 1e7);
  const highlights = {};
  for (const h of spec.highlights || []) {
    const { rects, block } = await page.evaluate(findText, { needle: h.text, block: true });
    highlights[h.id] = { text: h.text, zh: h.zh, found: rects.length > 0, rects, block };
    if (!rects.length) failures.push(`${id}: 找不到高亮原句「${h.text}」`);
  }
  const figures = {};
  for (const f of spec.figures || []) {
    const rect = await page.evaluate(findFigure, f.match);
    figures[f.id] = { match: f.match, found: !!rect, rect };
    if (!rect) failures.push(`${id}: 找不到配图「${f.match}」`);
  }
  const { column, bottom } = await page.evaluate(articleColumn);
  const bg = await page.evaluate(pageBackground);
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const lowest = Math.max(
    bottom,
    ...Object.values(highlights).flatMap((h) => h.rects.map((r) => r.y + r.h)),
    ...Object.values(figures).filter((f) => f.rect).map((f) => f.rect.y + f.rect.h),
  );
  const height = Math.min(docHeight, Math.max(lowest + 600, VIEWPORT.height * 2));
  const sliceH = Math.floor(SLICE_DEVICE_PX / DPR);
  const images = [];
  for (let y = 0, k = 0; y < height; y += sliceH, k++) {
    const h = Math.min(sliceH, height - y);
    const file = `${id}-${k}.jpg`;
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await waitImages(page, y, y + h);
    await page.screenshot({ path: path.join(outDir, file), type: "jpeg", quality: 88, fullPage: true, clip: { x: 0, y, width: VIEWPORT.width, height: h } });
    images.push({ file, y, h });
  }
  const title = await page.title();
  const favicon = await saveFavicon(page, id, outDir);
  await fs.writeFile(
    path.join(outDir, `${id}.json`),
    JSON.stringify({ url: spec.url, title, favicon, width: VIEWPORT.width, height, dpr: DPR, bg, images, column, highlights, figures }, null, 2),
  );
  const nf = Object.values(figures).filter((f) => f.found).length;
  console.log(`[capture] ${id} ${VIEWPORT.width}x${height} @${DPR}x ${images.length} 片 正文栏 x=${column.x} w=${column.w} 高亮 ${Object.values(highlights).filter((h) => h.found).length}/${(spec.highlights || []).length} 配图 ${nf}/${(spec.figures || []).length}`);
}

// 等 [top, bottom) 范围内（页面坐标）的图片下载并解码完，单张最多等 20 秒。
async function waitImages(page, top, bottom) {
  const pending = await page.evaluate(
    async ({ top, bottom }) => {
      const imgs = [...document.images].filter((img) => {
        const r = img.getBoundingClientRect();
        const y = r.top + window.scrollY;
        return r.width > 0 && y < bottom && y + r.height > top;
      });
      const one = (img) =>
        Promise.race([
          (img.complete ? Promise.resolve() : new Promise((res) => img.addEventListener("load", res, { once: true }) || img.addEventListener("error", res, { once: true }))).then(() => img.decode().catch(() => {})),
          new Promise((res) => setTimeout(res, 20000)),
        ]);
      await Promise.all(imgs.map(one));
      return imgs.filter((img) => !img.complete || !img.naturalWidth).map((img) => (img.currentSrc || img.src).slice(0, 120));
    },
    { top, bottom },
  );
  await page.waitForTimeout(250);
  for (const src of pending) console.warn(`[capture] 图片没加载出来：${src}`);
}

if (failures.length) {
  console.error("[capture] 以下页面需要处理（改原句，或在 episode.json 里改用截图/配图）：");
  for (const f of failures) console.error("  - " + f);
  process.exitCode = 1;
}

async function saveFavicon(page, id, outDir) {
  const href = await page.evaluate(() => {
    const links = [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')];
    const score = (l) => {
      const type = l.getAttribute("type") || "";
      const size = parseInt((l.getAttribute("sizes") || "").split("x")[0], 10) || 16;
      return (type.includes("svg") || /\.svg(\?|$)/.test(l.href) ? 1000 : 0) + Math.min(size, 192);
    };
    links.sort((a, b) => score(b) - score(a));
    return links[0]?.href || new URL("/favicon.ico", location.href).href;
  });
  try {
    const res = await page.request.get(href, { timeout: 15000 });
    if (!res.ok()) return null;
    const type = res.headers()["content-type"] || "";
    const ext = type.includes("svg") ? "svg" : type.includes("png") ? "png" : type.includes("jpeg") ? "jpg" : type.includes("webp") ? "webp" : "ico";
    const file = `${id}.favicon.${ext}`;
    await fs.writeFile(path.join(outDir, file), await res.body());
    return file;
  } catch {
    return null;
  }
}
async function dismissOverlays(page) {
  const accept = /^(accept|accept all|agree|i agree|got it|ok|allow all|同意|接受|我知道了)$/i;
  for (const button of await page.locator("button, a[role=button]").all()) {
    const label = ((await button.innerText().catch(() => "")) || "").trim();
    if (accept.test(label) && (await button.isVisible().catch(() => false))) {
      await button.click({ timeout: 1000 }).catch(() => {});
    }
  }
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const s = getComputedStyle(el);
      if (s.position !== "fixed" && s.position !== "sticky") continue;
      const r = el.getBoundingClientRect();
      // Top bars stay (they read as the site's header); floating banners and dialogs go.
      if (r.top > 120 || r.height > window.innerHeight * 0.5 || el.getAttribute("role") === "dialog") {
        el.style.setProperty("display", "none", "important");
      } else if (s.position === "fixed" || s.position === "sticky") {
        el.style.setProperty("position", "absolute", "important");
      }
    }
  });
}

// Runs in the page. Whitespace is collapsed on both sides so a sentence copied
// from innerText still matches when the DOM splits it across inline elements.
// block: also return the rect of the paragraph-level element that holds the sentence.
function findText({ needle, block: wantBlock }) {
  const norm = (s) => s.replace(/\s+/g, " ");
  const target = norm(needle).trim();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const map = [];
  let hay = "";
  let prevSpace = true;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;
    if (parent.closest("[style*='display: none']")) continue;
    const t = node.nodeValue;
    for (let i = 0; i < t.length; i++) {
      const ch = /\s/.test(t[i]) ? " " : t[i];
      if (ch === " " && prevSpace) continue;
      prevSpace = ch === " ";
      hay += ch;
      map.push([node, i]);
    }
  }
  const at = hay.indexOf(target);
  if (at < 0) return { rects: [], block: null };
  const [startNode, startOff] = map[at];
  const [endNode, endOff] = map[at + target.length - 1];
  const range = document.createRange();
  range.setStart(startNode, startOff);
  range.setEnd(endNode, endOff + 1);
  const lines = [];
  for (const r of range.getClientRects()) {
    if (r.width < 2 || r.height < 2) continue;
    const y = r.top + window.scrollY;
    const line = lines.find((l) => Math.abs(l.y - y) < r.height * 0.5);
    if (line) {
      const right = Math.max(line.x + line.w, r.right + window.scrollX);
      line.x = Math.min(line.x, r.left + window.scrollX);
      line.w = right - line.x;
      line.h = Math.max(line.h, r.height);
    } else {
      lines.push({ x: r.left + window.scrollX, y, w: r.width, h: r.height });
    }
  }
  const rects = lines.map((l) => ({ x: Math.round(l.x), y: Math.round(l.y), w: Math.round(l.w), h: Math.round(l.h) }));
  let block = null;
  if (wantBlock) {
    const el = startNode.parentElement.closest("p,li,blockquote,h1,h2,h3,h4,h5,h6,figcaption,pre,td,dd") || startNode.parentElement;
    const r = el.getBoundingClientRect();
    block = { x: Math.round(r.left + window.scrollX), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  }
  return { rects, block };
}

// Runs in the page. The text column is where most long paragraphs start and end.
function articleColumn() {
  const ps = [...document.querySelectorAll("p, li")].filter((p) => {
    const r = p.getBoundingClientRect();
    return r.width > 300 && r.height > 0 && p.innerText.trim().length > 80 && getComputedStyle(p).display !== "none";
  });
  if (!ps.length) return { column: { x: 0, w: document.documentElement.clientWidth }, bottom: document.documentElement.scrollHeight };
  const mode = (vals) => {
    const count = new Map();
    for (const v of vals) count.set(v, (count.get(v) || 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
  };
  const rects = ps.map((p) => p.getBoundingClientRect());
  const x = mode(rects.map((r) => Math.round(r.left + window.scrollX)));
  const right = mode(rects.map((r) => Math.round(r.right + window.scrollX)));
  const inCol = rects.filter((r) => Math.abs(r.left + window.scrollX - x) < 4);
  const bottom = Math.max(...inCol.map((r) => r.bottom + window.scrollY));
  return { column: { x, w: right - x }, bottom: Math.round(bottom) };
}

// Runs in the page. The first opaque background behind the article text, so gaps opened
// in the page (translations) match it.
function pageBackground() {
  const p = [...document.querySelectorAll("p")].find((el) => el.innerText.trim().length > 80);
  for (let el = p || document.body; el; el = el.parentElement) {
    const c = getComputedStyle(el).backgroundColor;
    if (c && c !== "transparent" && !/rgba\(.*,\s*0\)$/.test(c)) return c;
  }
  return "#fff";
}

// Runs in the page. Finds the largest visible image whose src/srcset/alt contains `match`.
function findFigure(match) {
  const imgs = [...document.querySelectorAll("img, picture img, svg")].filter((img) => {
    const hay = [img.currentSrc, img.getAttribute?.("src"), img.getAttribute?.("srcset"), img.getAttribute?.("alt"), img.getAttribute?.("aria-label")].filter(Boolean).join(" ");
    return hay.includes(match);
  });
  let best = null;
  for (const img of imgs) {
    const r = img.getBoundingClientRect();
    if (r.width < 40 || r.height < 40) continue;
    if (!best || r.width * r.height > best.w * best.h) {
      best = { x: Math.round(r.left + window.scrollX), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) };
    }
  }
  return best;
}
