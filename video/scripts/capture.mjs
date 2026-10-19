// 抓取原文网页长图，并记录重点句在页面上的坐标，供合成里模拟滚动和荧光笔使用。
// 用法：node scripts/capture.mjs <期目录> [--dump] [--only <pageId>]
//   --dump  只导出页面正文到 .work/pages/<id>.txt，用来挑选要高亮的原句
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const VIEWPORT = { width: 1280, height: 800 };
const DPR = 1.5;
const MAX_HEIGHT = 9000;
const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const args = process.argv.slice(2);
const episodeDir = path.resolve(args.find((a) => !a.startsWith("--")) || ".");
const dump = args.includes("--dump");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

const episode = JSON.parse(await fs.readFile(path.join(episodeDir, "episode.json"), "utf8"));
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

    // Lazy images below the fold only load once scrolled into view.
    await page.evaluate(async (max) => {
      for (let y = 0; y < Math.min(document.body.scrollHeight, max); y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    }, MAX_HEIGHT);
    await page.waitForTimeout(800);

    const highlights = {};
    for (const h of spec.highlights || []) {
      const rects = await page.evaluate(findTextRects, h.text);
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
    await fs.writeFile(
      path.join(outDir, `${id}.json`),
      JSON.stringify({ url: spec.url, title, width: VIEWPORT.width, height, dpr: DPR, image, highlights }, null, 2),
    );
    console.log(`[capture] ${id} ${VIEWPORT.width}x${height} 高亮 ${Object.values(highlights).filter((h) => h.found).length}/${(spec.highlights || []).length}`);
  } catch (err) {
    failures.push(`${id}: ${err.message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
}
await browser.close();

if (failures.length) {
  console.error("[capture] 以下页面需要处理（改原句，或在 episode.json 里改用截图/配图）：");
  for (const f of failures) console.error("  - " + f);
  process.exitCode = 1;
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
function findTextRects(needle) {
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
  if (at < 0) return [];
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
  return lines.map((l) => ({ x: Math.round(l.x), y: Math.round(l.y), w: Math.round(l.w), h: Math.round(l.h) }));
}
