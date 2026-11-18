// 单篇精读：从 episode.json（format: "read"）+ 口播时间戳 + 整篇网页抓取，生成全屏 HyperFrames 工程。
// 用法：node scripts/build-read.mjs <单篇目录>
// 依赖：先跑 capture.mjs（assets/capture/<page>.json + 切片）和 tts.py（.work/narration.json）。
// 画面：全屏 Chrome 窗口，页面推近到正文栏；每个 beat 依次是滚动 → 聚光 → 手绘荧光笔 → 原句下方裂开写入译文。
// 另有数字大字卡（stat）、配图放大（figure）、红色批注（note）。生成物每次整体重写，要改画面改 episode.json 或本文件。
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C, esc, FONT_CSS, CHROME_H, CHROME_CSS, chromeBar } from "./chrome.mjs";
import { r3, createSceneLoader, captionsFor, chaptersOf, mmss } from "./lib/timeline.mjs";
import { writeVoiceover, captionsDoc, indexHtml, scaffold, writeSrtAndTimeline } from "./lib/project.mjs";
import { pageImages } from "./lib/cover.mjs";

const VIDEO_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = 1920;
const H = 1080;
const VW = W;
const VH = H - CHROME_H;
// 页面可用的竖直区间（视口坐标）：上面留给批注一点余地，下面让出字幕。
const SAFE_TOP = 40;
const SAFE_BOTTOM = 842;
const COL_MARGIN = 60;
const CAP = { top: H - 128, size: 42, max: 1600, chars: 22 };
const GAPS = { firstHead: 0.7, head: 0.2, gap: 0.32, tail: 0.35 };
const ZH = { size: 48, line: 1.55, padL: 28, padY: 2, rule: 3, mt: 6, mb: 24, fade: 0.6 };
const MAX_STATS = 2;
const MAX_FIGURES = 3;
const MAX_LAG = 1.0;
// 译文至少要停留估算阅读时长的这个比例，口播同时在讲，可以略短于完整阅读时长。
const READ_MIN = 0.65;

const epDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || ".");
const episode = JSON.parse(await fs.readFile(path.join(epDir, "episode.json"), "utf8"));
if (episode.format !== "read") throw new Error(`${epDir}/episode.json 不是单篇精读（format 应为 "read"）`);
const narration = JSON.parse(await fs.readFile(path.join(epDir, ".work", "narration.json"), "utf8"));
const loadScene = createSceneLoader(epDir, narration, GAPS);

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const warnings = [];

// ---------- 手绘荧光笔 ----------

function rng(seedStr) {
  let h = 2166136261;
  for (const ch of seedStr) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

// 一行荧光笔：上下边缘不规则抖动、两端是不齐的圆头，整体有不到 1° 的倾斜。坐标是页面 CSS px。
function markerSvg(rect, seed, cls) {
  const R = rng(seed);
  const pad = 5 + R() * 4;
  const x0 = rect.x - pad;
  const w = rect.w + pad * 2;
  const top = rect.h * (0.1 + R() * 0.06);
  const bottom = rect.h * (0.9 + R() * 0.06);
  const h = rect.h;
  const amp = h * 0.045;
  const n = Math.max(6, Math.round(w / 38));
  const pts = (y0, k) => Array.from({ length: n + 1 }, (_, i) => [r3((w * i) / n), r3(y0 + (R() - 0.5) * 2 * amp * k)]);
  const topPts = pts(top, 1);
  const botPts = pts(bottom, 1).reverse();
  const capR = (bottom - top) / 2;
  const d = [
    `M${topPts[0][0] + capR * 0.4} ${topPts[0][1]}`,
    ...topPts.slice(1).map(([x, y]) => `L${x} ${y}`),
    `Q${r3(w + capR * (0.6 + R() * 0.5))} ${r3((top + bottom) / 2)} ${botPts[0][0]} ${botPts[0][1]}`,
    ...botPts.slice(1).map(([x, y]) => `L${x} ${y}`),
    `Q${r3(-capR * (0.5 + R() * 0.5))} ${r3((top + bottom) / 2)} ${topPts[0][0] + capR * 0.4} ${topPts[0][1]}`,
    "Z",
  ].join(" ");
  const rot = r3((R() - 0.5) * 1.4);
  return `<svg class="mk ${cls}" style="left:${r3(x0)}px;top:${rect.y}px;width:${r3(w)}px;height:${h}px;transform:rotate(${rot}deg)" viewBox="0 0 ${r3(w)} ${h}" preserveAspectRatio="none" data-layout-allow-overflow><path d="${d}"/></svg>`;
}

// ---------- 译文块尺寸估算（屏幕 px） ----------

function zhHeight(text, widthScreen) {
  const avail = widthScreen - ZH.padL - ZH.rule;
  let em = 0;
  for (const ch of text) em += /[\u0000-\u00ff]/.test(ch) ? 0.6 : 1;
  const lines = Math.max(1, Math.ceil((em * ZH.size * 1.04) / avail));
  return lines * ZH.size * ZH.line + ZH.padY * 2 + ZH.mt + ZH.mb;
}

// 译文至少停留的时长（从开始写入算）：约 0.5 秒 + 每词 0.3 秒，中文按 1.6 字一词估算。
function readHold(text) {
  const latin = (text.match(/[A-Za-z0-9][A-Za-z0-9.%'’-]*/g) || []).length;
  const cjk = (text.match(/[\u3400-\u9fff]/g) || []).length;
  return r3(0.5 + 0.3 * (latin + cjk / 1.6));
}

// ---------- 镜头 ----------

function baseZoom(cap) {
  return Math.min(cap.dpr, VW / (cap.column.w + COL_MARGIN * 2));
}

function camFor(cap, z, top, contentTop) {
  const x = r3(VW / 2 - (cap.column.x + cap.column.w / 2) * z);
  const y = r3(clamp(top - contentTop * z, Math.min(0, VH - cap.height * z), 0));
  return { x: clamp(x, VW - cap.width * z, 0), y, z: r3(z) };
}

// 每个 beat 的镜头和动画时间点。prev 是上一个场景结束时的镜头。
function planScene(s, cap, prev, carry) {
  const z0 = baseZoom(cap);
  const events = [];
  let cam = prev;
  let free = Math.max(0.15, carry?.remain || 0); // 最早可以开始下一个动作的时间
  let prevHold = carry ? carry.need : 0;
  const used = { stats: 0, figures: 0 };
  // 配图写了 until 时，镜头停到这个词说完。之前的划线不滚走。
  let pinUntil = 0;
  for (const b of s.beats || []) {
    const t = s.cue(b.at);
    if (b.highlight && pinUntil && t < pinUntil) {
      warnings.push(`${s.id}: 划线 ${b.highlight}（口播「${b.at}」）落在配图停留内，镜头留在图上，这处不划。把划线挪到 until 之后，或删掉`);
    } else if (b.highlight) {
      const h = cap.highlights[b.highlight];
      if (!h || !h.found) throw new Error(`${s.id}: 抓取里没有高亮 ${b.highlight}，先跑 capture.mjs`);
      const spec = s.page.highlights.find((x) => x.id === b.highlight);
      const zh = spec?.zh;
      if (!zh) throw new Error(`${s.id}: 高亮 ${b.highlight} 没有译文 zh`);
      const y0 = Math.min(...h.rects.map((r) => r.y));
      const ys = Math.max(...h.rects.map((r) => r.y + r.h)) + 4;
      const block = h.block || { x: cap.column.x, y: y0, w: cap.column.w, h: ys - y0 };
      const bx = Math.min(block.x, ...h.rects.map((r) => r.x));
      const bw = Math.max(block.x + block.w, ...h.rects.map((r) => r.x + r.w)) - bx;
      const zhW = r3(bw * z0);
      const gapScreen = zhHeight(zh, zhW);
      const total = (ys - y0) * z0 + gapScreen;
      const top = clamp((SAFE_TOP + SAFE_BOTTOM) / 2 - total / 2, SAFE_TOP + 60, SAFE_BOTTOM - total);
      const next = camFor(cap, z0, top, y0);
      // 上一处译文没读完时最多等 1 秒，再晚画面就跟不上口播了。
      const move = r3(Math.max(t - 0.95, pinUntil, Math.min(free, t - 0.95 + MAX_LAG)));
      const shown = move - (free - prevHold);
      if (prevHold && shown < prevHold * READ_MIN) warnings.push(`${s.id}: 上一处译文只停了 ${r3(shown)}s 就被 ${b.highlight}（口播「${b.at}」）收起，至少要 ${r3(prevHold * READ_MIN)}s；把这个 beat 挪后或上一个挪前`);
      const dist = Math.abs(next.y - cam.y) / Math.max(next.z, cam.z) + Math.abs(next.z - cam.z) * 2000;
      const moveDur = r3(clamp(0.8 + dist / 9000, 0.8, 1.4));
      const lit = r3(move + moveDur);
      const markAt = r3(Math.max(t, lit - 0.1));
      const markEnd = r3(markAt + h.rects.length * 0.26 + 0.45);
      // 荧光笔扫到一半就开始裂开，给译文多留阅读时间。
      const openAt = r3(Math.min(markEnd + 0.05, markAt + 0.2 + h.rects.length * 0.13));
      const typeDur = ZH.fade;
      const hold = readHold(zh);
      events.push({
        kind: "hl", id: b.highlight, rects: h.rects, zh, ys, bx, bw, zhW, gapScreen, z: next.z,
        spot: { x: bx - 10, y: Math.max(block.y, y0 - 8) - 6, w: bw + 20, h: ys - Math.max(block.y, y0 - 8) + 6 },
        cam: next, move, moveDur, lit, markAt, openAt, typeAt: r3(openAt + 0.2), typeDur, hold, cue: t,
      });
      cam = next;
      free = r3(openAt + 0.2 + Math.max(typeDur + 1.0, hold));
      prevHold = Math.max(typeDur + 1.0, hold);
    }
    if (b.figure) {
      if (++used.figures > MAX_FIGURES) throw new Error(`${s.id}: 配图放大每支最多 ${MAX_FIGURES} 次（单场景计）`);
      const f = cap.figures?.[b.figure];
      if (!f || !f.found) throw new Error(`${s.id}: 抓取里没有配图 ${b.figure}`);
      const r = f.rect;
      const z = Math.min(cap.dpr, (VW - 120) / r.w, (SAFE_BOTTOM - SAFE_TOP - 20) / r.h);
      const top = (SAFE_TOP + SAFE_BOTTOM) / 2 - (r.h * z) / 2;
      const x = r3(clamp(VW / 2 - (r.x + r.w / 2) * z, VW - cap.width * z, 0));
      const y = r3(clamp(top - r.y * z, Math.min(0, VH - cap.height * z), 0));
      const next = { x, y, z: r3(z) };
      if (pinUntil && t < pinUntil) warnings.push(`${s.id}: 配图 ${b.figure}（口播「${b.at}」）落在上一张图的停留内。上一张的 until 要早于这里`);
      let release = null;
      if (b.until) {
        release = s.cue(b.until, { end: true });
        if (!(release > t + 0.3)) throw new Error(`${s.id}: 配图 ${b.figure} 的 until「${b.until}」要比「${b.at}」至少晚 0.3 秒`);
      }
      const move = r3(Math.max(t - 0.6, pinUntil, Math.min(free, t - 0.6 + MAX_LAG)));
      const shown = move - (free - prevHold);
      if (prevHold && shown < prevHold * READ_MIN) warnings.push(`${s.id}: 上一处译文只停了 ${r3(shown)}s 就被配图 ${b.figure}（口播「${b.at}」）收起，至少要 ${r3(prevHold * READ_MIN)}s`);
      const dist = Math.abs(next.y - cam.y) / Math.max(next.z, cam.z) + Math.abs(next.z - cam.z) * 2000;
      const moveDur = r3(clamp(0.9 + dist / 9000, 0.9, 1.4));
      const lit = r3(move + moveDur);
      if (release != null && release < lit) throw new Error(`${s.id}: 配图 ${b.figure} 的 until「${b.until}」在推近完成之前，把 until 挪到更后面的一句`);
      events.push({ kind: "fig", id: b.figure, cam: next, move, moveDur, lit, spot: { x: r.x - 12, y: r.y - 12, w: r.w + 24, h: r.h + 24 } });
      cam = next;
      free = release != null ? release : r3(lit + 1.2);
      if (release != null) pinUntil = release;
      prevHold = release != null ? 0 : 1.2;
    }
    if (b.stat && pinUntil && t < pinUntil) {
      warnings.push(`${s.id}: 大字卡（口播「${b.at}」）落在配图停留内，会挡住这张图，这张不弹。挪到 until 之后`);
    } else if (b.stat) {
      if (++used.stats > MAX_STATS) throw new Error(`${s.id}: 数字大字卡每场景最多 ${MAX_STATS} 次`);
      const at = r3(Math.max(t, free - 1.0));
      const end = b.stat.until ? s.cue(b.stat.until, { end: true }) : at + 3.2;
      events.push({ kind: "stat", value: b.stat.value, label: b.stat.label, at, end: r3(Math.min(Math.max(end, at + 1.6), s.duration - 0.5)) });
    }
    if (b.note) events.push({ kind: "note", text: b.note, at: r3(Math.max(0.3, t + (b.highlight ? 0.6 : 0.1))) });
    if (b.outro) events.push({ kind: "outro", at: r3(t) });
  }
  const lastHl = events.filter((e) => e.kind === "hl").at(-1);
  if (s.isLast && lastHl && s.duration - 0.45 - lastHl.typeAt < lastHl.hold * 0.8)
    warnings.push(`${s.id}: 最后一处划线 ${lastHl.id} 的译文只停 ${r3(s.duration - 0.45 - lastHl.typeAt)}s（需要约 ${lastHl.hold}s），把 beat 挪到更早的口播`);
  return { events, endCam: cam };
}

// ---------- 场景 ----------

const SCENE_CSS = `
#root{position:absolute;inset:0;font-family:"PingFang SC",sans-serif;color:${C.ink};overflow:hidden;background:#fff}
.win{position:absolute;left:0;top:0;width:${W}px;height:${H}px;background:#fff;overflow:hidden}
${CHROME_CSS}
.vp{position:absolute;left:0;top:${CHROME_H}px;width:${VW}px;height:${VH}px;overflow:hidden}
.pg{position:absolute;left:0;top:0;transform-origin:0 0}
.org{position:absolute}
.lay{position:absolute;left:0;top:0}
.lay img{position:absolute;left:0;display:block}
.lay .sl{position:absolute;left:0;width:100%;background-size:100% 100%;background-repeat:no-repeat}
.mk{position:absolute;display:block;overflow:visible;transform-origin:left center;mix-blend-mode:multiply}
.mk path{fill:${C.marker};fill-opacity:.88}
.zh{position:absolute;overflow:hidden;height:0}
.zh .in{position:absolute;left:0;top:0;transform-origin:0 0}
.zh .box{margin:${ZH.mt}px 0 ${ZH.mb}px;border-left:${ZH.rule}px solid ${C.red};padding:${ZH.padY}px 0 ${ZH.padY}px ${ZH.padL}px;font-family:"Songti SC",serif;font-size:${ZH.size}px;line-height:${ZH.line};font-weight:400;color:${C.ink};opacity:0}
.zh .box.shown{opacity:1}
.spot{position:absolute;border-radius:10px;box-shadow:0 0 0 40000px rgba(28,24,20,.42);opacity:0;pointer-events:none}
.notes{position:absolute;right:64px;top:${CHROME_H + 26}px;width:720px;height:200px}
.note{position:absolute;right:0;top:0;max-width:720px;border:3px solid ${C.red};color:${C.red};background:${C.card};padding:18px 26px;font-size:40px;line-height:1.3;font-weight:600;border-radius:8px;box-shadow:0 14px 30px rgba(43,38,34,.2);opacity:0}
.stat{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0}
.stat .dim{position:absolute;inset:0;background:rgba(28,24,20,.62)}
.stat .card{position:relative;background:${C.card};border:3px solid ${C.line};border-radius:18px;padding:56px 90px 60px;text-align:center;box-shadow:0 40px 90px rgba(0,0,0,.35)}
.stat .v{font-family:"Songti SC",serif;font-weight:900;font-size:200px;line-height:1;color:${C.red};white-space:nowrap}
.stat .l{margin-top:26px;font-size:46px;font-weight:600;color:${C.ink}}
.outro{position:absolute;left:50%;top:${CHROME_H + 300}px;transform:translateX(-50%);background:${C.card};border:3px solid ${C.ink};border-radius:16px;padding:40px 70px;text-align:center;box-shadow:0 30px 70px rgba(0,0,0,.3);opacity:0;white-space:nowrap}
.outro .k{font-size:34px;color:${C.red};font-weight:600;letter-spacing:.06em}
.outro .u{margin-top:18px;font-family:"JetBrains Mono",monospace;font-size:54px;color:${C.ink}}
.outro .s{margin-top:16px;font-size:34px;color:${C.muted}}
`;

// carry：上一场景结尾还开着的那处划线（同一张页面），本场景开头保持裂开，到第一个动作再收起。
function sceneFile(s, plan, earlier, startCam, carry) {
  const cap = s.capture;
  const ev = plan.events;
  const hls = ev.filter((e) => e.kind === "hl");
  const zhBlock = (e, cls, shown) =>
    `<div class="zh ${cls}" style="left:${r3(e.bx)}px;top:${r3(e.ys)}px;width:${r3(e.bw)}px" data-layout-allow-overflow><div class="in" style="width:${e.zhW}px;transform:scale(${r3(1 / e.z)})"><div class="box${shown ? " shown" : ""}">${esc(e.zh)}</div></div></div>`;
  const figs = ev.filter((e) => e.kind === "fig");
  const marks = (layer) =>
    [
      ...earlier.filter((e) => e.id !== carry?.id).map((e) => e.rects.map((r, k) => markerSvg(r, `${e.id}-${k}`, `old`)).join("")),
      ...(carry ? [carry.rects.map((r, k) => markerSvg(r, `${carry.id}-${k}`, "hc")).join("")] : []),
      ...hls.map((e, i) => e.rects.map((r, k) => markerSvg(r, `${e.id}-${k}`, `h${i} l${i}-${k}`)).join("")),
    ].join("");
  const imgs = pageImages(cap, s.assetBase);
  // 下层用 CSS 背景，避免同一张切片在合成里出现两个 <img>（HyperFrames 会重复收集媒体）。
  const bgs = cap.images.map((sl) => `<div class="sl" style="top:${sl.y}px;height:${sl.h}px;background-image:url('${s.assetBase}capture/${esc(sl.file)}')"></div>`).join("");
  const zhs = (carry ? zhBlock(carry, "zc", true) : "") + hls.map((e, i) => zhBlock(e, `z${i}`, false)).join("");
  const notes = ev.filter((e) => e.kind === "note");
  const stats = ev.filter((e) => e.kind === "stat");
  const outro = ev.find((e) => e.kind === "outro");

  const moves = ev.filter((e) => e.kind === "hl" || e.kind === "fig").sort((a, b) => a.move - b.move);
  // GSAP 写 transform 时 scale 只留 4 位小数、translate 只留约 6 位有效数字。原点在页面左上角时，
  // 这点误差乘上上万 px 的页面坐标，停住推近时正文会逐帧来回跳 1 px 多。所以页面整体挪到以本场景
  // 镜头所到范围的中点为原点（.org），镜头换算成相对它的小坐标，误差就小到看不出。
  const centers = [startCam, ...moves.map((m) => m.cam)].map((c) => [(VW / 2 - c.x) / c.z, (VH / 2 - c.y) / c.z]);
  const mid = (k) => Math.round((Math.min(...centers.map((p) => p[k])) + Math.max(...centers.map((p) => p[k]))) / 2);
  const anchor = { x: mid(0), y: mid(1) };
  const camVars = (c) => `x:${r3(c.x + c.z * anchor.x)},y:${r3(c.y + c.z * anchor.y)},scale:${r3(c.z)}`;

  const js = [];
  js.push(`const pg=q(".pg")[0],bot=q(".bot")[0],spot=q(".spot")[0];`);
  js.push(`tl.set(pg,{${camVars(startCam)}},0);`);
  if (earlier.some((e) => e.id !== carry?.id)) js.push(`tl.set(q(".old"),{opacity:.32},0);`);
  if (hls.length) js.push(`tl.set(q(".mk:not(.old):not(.hc)"),{scaleX:0},0);`);
  // 译文块和聚光的 height 要和下层的 y 一样精确：GSAP 默认把 px 属性取整，放大约 3 倍后裂缝边缘会抖。
  if (carry) {
    const g = r3(carry.gapScreen / carry.z);
    js.push(`tl.set(bot,{clipPath:"inset(${r3(carry.ys)}px 0px 0px 0px)",y:${g}},0);tl.set(q(".zc"),{autoRound:false,height:${g}},0);`);
    js.push(`tl.set(spot,{autoRound:false,left:${r3(carry.spot.x)},top:${r3(carry.spot.y)},width:${r3(carry.spot.w)},height:${r3(carry.spot.h + g)},opacity:1},0);`);
  }
  let cam = startCam;
  let lastLit = 0;
  let openIdx = carry ? "c" : -1;
  const holdK = 1.022;
  const drift = (c, from, to) => {
    if (to - from <= 0.6) return;
    const fx = VW / 2;
    const fy = VH * 0.42;
    const end = { x: r3(fx - (fx - c.x) * holdK), y: r3(fy - (fy - c.y) * holdK), z: r3(c.z * holdK) };
    js.push(`tl.to(pg,{${camVars(end)},duration:${r3(to - from)},ease:"sine.inOut"},${r3(from)});`);
    return end;
  };
  // 开场：从页面顶部慢慢下移，直到第一个动作。
  const first = moves[0];
  let endCam = startCam;
  if (first && first.move > 0.8) drift(startCam, 0, first.move);
  moves.forEach((m, k) => {
    const close = r3(Math.max(lastLit, m.move - 0.05));
    // 收起上一处：缝合、撤聚光、旧荧光笔变淡。
    if (openIdx !== -1) {
      js.push(`tl.to(bot,{y:0,duration:.4,ease:"power2.inOut"},${r3(m.move)});tl.to(q(".z${openIdx}"),{autoRound:false,height:0,duration:.4,ease:"power2.inOut"},${r3(m.move)});`);
      js.push(`tl.to(q(".h${openIdx}"),{opacity:.32,duration:.4},${r3(m.move)});`);
      openIdx = -1;
    }
    js.push(`tl.to(spot,{opacity:0,duration:.3},${r3(m.move)});`);
    js.push(`tl.to(pg,{${camVars(m.cam)},duration:${m.moveDur},ease:"power3.inOut"},${r3(m.move + 0.05)});`);
    js.push(`tl.set(spot,{autoRound:false,left:${r3(m.spot.x)},top:${r3(m.spot.y)},width:${r3(m.spot.w)},height:${r3(m.spot.h)}},${r3(m.move + 0.32)});`);
    js.push(`tl.to(spot,{opacity:1,duration:.4,ease:"power1.out"},${r3(m.lit)});`);
    if (m.kind === "hl") {
      const i = hls.indexOf(m);
      js.push(`tl.set(bot,{clipPath:"inset(${r3(m.ys)}px 0px 0px 0px)"},${r3(m.move + 0.45)});`);
      m.rects.forEach((_, j) => js.push(`tl.to(q(".l${i}-${j}"),{scaleX:1,duration:.45,ease:"power2.out"},${r3(m.markAt + j * 0.26)});`));
      const gapPage = r3(m.gapScreen / m.z);
      js.push(`tl.to(bot,{y:${gapPage},duration:.55,ease:"power3.out"},${m.openAt});tl.to(q(".z${i}"),{autoRound:false,height:${gapPage},duration:.55,ease:"power3.out"},${m.openAt});`);
      js.push(`tl.to(spot,{autoRound:false,height:${r3(m.spot.h + gapPage)},duration:.55,ease:"power3.out"},${m.openAt});`);
      js.push(`tl.fromTo(q(".z${i} .box"),{opacity:0,y:14},{opacity:1,y:0,duration:${m.typeDur},ease:"power3.out"},${m.typeAt});`);
      openIdx = i;
    }
    const nextMove = k + 1 < moves.length ? moves[k + 1].move : s.duration - 0.45;
    endCam = drift(m.cam, m.lit + 0.2, nextMove) || m.cam;
    cam = m.cam;
    lastLit = m.lit;
  });
  // 场景尾：最后一个场景缝合、撤聚光（有结尾小卡时提前到小卡出现时）；其他场景把还开着的那处交给下一个场景，镜头也停在原处。
  const tailAt = r3(s.duration - 0.45);
  const closeAt = outro ? r3(Math.min(tailAt, outro.at)) : tailAt;
  s.carryOut = null;
  if (openIdx !== -1 && !s.isLast) {
    const e = openIdx === "c" ? carry : hls[openIdx];
    const need = e.need ?? r3(Math.max(e.typeDur + 1.0, e.hold));
    const remain = openIdx === "c" ? carry.remain - s.duration : e.typeAt + need - s.duration;
    s.carryOut = { ...e, need, remain: r3(remain) };
  }
  else {
    if (openIdx !== -1) {
      js.push(`tl.to(bot,{y:0,duration:.4,ease:"power2.inOut"},${closeAt});tl.to(q(".z${openIdx}"),{autoRound:false,height:0,duration:.4,ease:"power2.inOut"},${closeAt});`);
      js.push(`tl.to(q(".h${openIdx}"),{opacity:.32,duration:.4},${closeAt});`);
    }
    if (moves.length || carry) js.push(`tl.to(spot,{opacity:0,duration:.4},${closeAt});`);
  }
  notes.forEach((n, i) => {
    js.push(`tl.fromTo(q(".note")[${i}],{opacity:0,x:60,rotation:-2},{opacity:1,x:0,rotation:-2,duration:.5,ease:"back.out(1.5)"},${n.at});`);
    const end = i + 1 < notes.length ? notes[i + 1].at : outro && outro.at > n.at ? outro.at + 0.3 : tailAt;
    js.push(`tl.to(q(".note")[${i}],{opacity:0,x:30,duration:.3},${r3(Math.max(n.at + 0.6, end - 0.3))});`);
  });
  stats.forEach((st, i) => {
    js.push(`tl.fromTo(q(".stat")[${i}],{opacity:0},{opacity:1,duration:.35},${st.at});`);
    js.push(`tl.fromTo(q(".stat .card")[${i}],{scale:.82,y:30},{scale:1,y:0,duration:.55,ease:"back.out(1.6)"},${st.at});`);
    js.push(`tl.to(q(".stat")[${i}],{opacity:0,duration:.35},${r3(st.end - 0.35)});`);
  });
  if (outro) js.push(`tl.fromTo(q(".outro"),{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:"power3.out"},${outro.at});`);
  s.endCam = endCam;

  return `<!doctype html>
<html lang="zh">
<head><meta charset="UTF-8" /></head>
<body>
<template>
<style>${FONT_CSS}${SCENE_CSS}.pg,.org,.lay{width:${cap.width}px;height:${cap.height}px}.vp,.lay,.pg{background:${cap.bg || "#fff"}}.zh{background:${cap.bg || "#fff"}}</style>
<div id="root" data-composition-id="${s.id}" data-width="${W}" data-height="${H}" data-duration="${s.duration}">
<div class="win">${chromeBar(s.page, cap, s.assetBase)}
<div class="vp" data-layout-allow-overflow><div class="pg" data-layout-allow-overflow><div class="org" style="left:${-anchor.x}px;top:${-anchor.y}px" data-layout-allow-overflow>
<div class="lay top" data-layout-allow-overflow>${imgs}${marks("top")}</div>
${zhs}
<div class="lay bot" data-layout-allow-overflow style="clip-path:inset(${cap.height}px 0px 0px 0px)">${bgs}${marks("bot")}</div>
<div class="spot" data-layout-allow-overflow></div>
</div></div></div></div>
<div class="notes" data-layout-allow-overlap>${notes.map((n) => `<div class="note">${esc(n.text)}</div>`).join("")}</div>
${stats.map((st) => `<div class="stat" data-layout-allow-overlap><div class="dim"></div><div class="card"><div class="v">${esc(st.value)}</div><div class="l">${esc(st.label)}</div></div></div>`).join("")}
${outro ? `<div class="outro" data-layout-allow-overlap><div class="k">开发者 AI 周刊 · #${esc(episode.issue)} · 精读</div><div class="u">${esc(episode.web.replace(/^https?:\/\//, ""))}</div><div class="s">原文与周刊链接都在简介里</div></div>` : ""}
</div>
<script>
(function () {
const D = ${s.duration};
const R = document.querySelector('[data-composition-id="${s.id}"]');
const q = (sel) => R.querySelectorAll(sel);
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
${js.join("\n")}
window.__timelines["${s.id}"] = tl;
})();
</script>
</template>
</body>
</html>
`;
}

// ---------- 组装 ----------

async function main() {
  const scenes = [];
  let t = 0;
  const captures = {};
  for (let i = 0; i < episode.scenes.length; i++) {
    const raw = episode.scenes[i];
    if (raw.type !== "read") throw new Error(`${raw.id}: 单篇只支持 read 场景，现在是 ${raw.type}`);
    const s = await loadScene(raw, i);
    s.start = r3(t);
    s.assetBase = "../assets/";
    s.page = episode.pages[s.props.page];
    if (!s.page) throw new Error(`${s.id}: pages 里没有 ${s.props.page}`);
    if (!captures[s.props.page]) {
      const capPath = path.join(epDir, "assets", "capture", `${s.props.page}.json`);
      if (!existsSync(capPath)) throw new Error(`${s.id}: 缺少网页抓取 ${s.props.page}，先跑 capture.mjs`);
      captures[s.props.page] = JSON.parse(await fs.readFile(capPath, "utf8"));
      if (!captures[s.props.page].images) throw new Error(`${s.props.page}: 抓取不是单篇格式（没有切片），用 format: "read" 重跑 capture.mjs`);
    }
    s.capture = captures[s.props.page];
    s.isLast = i === episode.scenes.length - 1 || episode.scenes[i + 1].props?.page !== s.props.page;
    t += s.duration;
    scenes.push(s);
  }
  const total = r3(t);

  const compDir = path.join(epDir, "compositions");
  await fs.rm(compDir, { recursive: true, force: true });
  await fs.mkdir(compDir, { recursive: true });
  await fs.mkdir(path.join(epDir, "assets"), { recursive: true });
  await fs.copyFile(path.join(VIDEO_DIR, "assets", "avatar.jpg"), path.join(epDir, "assets", "avatar.jpg"));

  const earlier = [];
  let cam = null;
  let carry = null;
  let stats = 0;
  let figures = 0;
  let marks = 0;
  for (const s of scenes) {
    const cap = s.capture;
    // 第一个场景从页面顶部的全宽视图开始，之后接着上一场景的镜头。
    if (!cam) cam = { x: 0, y: 0, z: r3(VW / cap.width) };
    const plan = planScene(s, cap, cam, carry);
    await fs.writeFile(path.join(compDir, `${s.id}.html`), sceneFile(s, plan, earlier.filter((e) => e.page === s.props.page), cam, carry));
    cam = s.endCam;
    carry = s.carryOut;
    for (const e of plan.events) {
      if (e.kind === "hl") earlier.push({ ...e, page: s.props.page });
      if (e.kind === "stat") stats++;
      if (e.kind === "fig") figures++;
      if (e.kind === "hl") marks++;
    }
  }
  if (stats > MAX_STATS) throw new Error(`数字大字卡全片最多 ${MAX_STATS} 次，现在 ${stats} 次`);
  if (figures > MAX_FIGURES) throw new Error(`配图放大全片最多 ${MAX_FIGURES} 次，现在 ${figures} 次`);

  await writeVoiceover(epDir, scenes, total, GAPS);
  const caps = scenes.flatMap((s) => captionsFor(s, s.start, CAP.chars));
  const chapters = chaptersOf(scenes);
  const dims = { W, H, total };
  await fs.writeFile(
    path.join(compDir, "captions.html"),
    captionsDoc(
      dims,
      caps,
      `.cap{position:absolute;left:0;top:${CAP.top}px;width:${W}px;display:flex;justify-content:center}
.cap span{display:block;background:rgba(255,253,248,.95);border:2px solid ${C.line};border-radius:10px;padding:12px 28px;font-size:${CAP.size}px;font-weight:500;line-height:1.35;color:${C.ink};max-width:${CAP.max}px;text-align:center;box-shadow:0 8px 24px rgba(43,38,34,.18)}`,
    ),
  );
  await fs.writeFile(path.join(epDir, "index.html"), indexHtml(dims, { title: episode.title, scenes, frame: false, bg: "#fff" }));
  await scaffold(epDir);
  await writeSrtAndTimeline(epDir, caps, total, chapters, scenes);
  console.log(`[build-read] ${scenes.length} 个场景，${marks} 处划线，${figures} 次配图，${stats} 张大字卡，${caps.length} 条字幕，总长 ${total}s（${mmss(total)}）`);
  for (const c of chapters) console.log(`  ${mmss(c.start)} ${c.name}`);
  for (const w of warnings) console.warn(`[build-read] 警告：${w}`);
  if (total < 150 || total > 330) console.warn(`[build-read] 警告：总长 ${mmss(total)} 不在 2:30–5:30 之间`);
}

await main();
