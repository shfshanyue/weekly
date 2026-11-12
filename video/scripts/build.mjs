// 从 episode.json + 口播时间戳 + 网页抓取，生成一期 HyperFrames 工程（index.html + compositions/*）。
// 用法：node scripts/build.mjs <期目录>
// 写到期目录，1920×1080。
// 依赖：先跑 tts.py（.work/narration.json）和 capture.mjs（assets/capture/*.json）。
// 生成物每次整体覆盖重写；要改画面，改 episode.json 或本文件，不要手改生成的 HTML。
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C, esc, FONT_CSS, CHROME_H, CHROME_CSS, chromeBar } from "./chrome.mjs";
import { r3, createSceneLoader, captionsFor as captionLines, chaptersOf, mmss } from "./lib/timeline.mjs";
import { writeVoiceover, subDoc, captionsDoc, indexHtml, scaffold, writeSrtAndTimeline } from "./lib/project.mjs";

const VIDEO_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// 图解（gate / slots / tree 等）按这套坐标画。
const DESIGN_W = 1720;
const DESIGN_H = 770;

const P = {
  w: 1920,
  h: 1080,
  stageLeft: 110,
  stageTop: 140,
  stageW: DESIGN_W,
  stageH: DESIGN_H,
  tagLeft: 110,
  tagTop: 50,
  tagSize: 26,
  marginLeft: 72,
  pageW: 1240,
  pageH: 770,
  capLeft: 0,
  capTop: 1080 - 128,
  capWidth: 1920,
  capSize: 42,
  capMax: 1600,
  capChars: 22,
};

const epArg = process.argv.slice(2).find((a) => !a.startsWith("-"));
const epDir = path.resolve(epArg || ".");
const W = P.w;
const H = P.h;
const FIRST_HEAD = 0.7;
const HEAD = 0.2;
const GAP = 0.32;
const TAIL = 0.35;
const STAGE_W = P.stageW;
const PAGE_W = P.pageW;
const PAGE_H = P.pageH;


const episode = JSON.parse(await fs.readFile(path.join(epDir, "episode.json"), "utf8"));
const narration = JSON.parse(await fs.readFile(path.join(epDir, ".work", "narration.json"), "utf8"));
const loadScene = createSceneLoader(epDir, narration, { firstHead: FIRST_HEAD, head: HEAD, gap: GAP, tail: TAIL });
const captionsFor = (scene, sceneStart) => captionLines(scene, sceneStart, P.capChars);

// ---------- scene templates ----------

// System CJK fonts have no downloadable file; local() faces satisfy the renderer's font
// check, and one face per weight keeps Chrome from synthesizing fake bold.
const CENTERED = new Set(["chips", "triad", "statement", "bars", "tree"]);

const SCENE_CSS = `
#root{position:absolute;inset:0;font-family:"PingFang SC",sans-serif;color:${C.ink}}
.tag{position:absolute;left:${P.tagLeft}px;top:${P.tagTop}px;font-size:${P.tagSize}px;letter-spacing:.06em;color:${C.red};font-weight:600;display:flex;gap:16px;align-items:center;max-width:${STAGE_W}px}
.tag i{display:block;width:40px;height:3px;background:${C.red}}
.stage{position:absolute;left:${P.stageLeft}px;top:${P.stageTop}px;width:${STAGE_W}px;height:${P.stageH}px}
.stage.center{display:flex;flex-direction:column;justify-content:center;padding-bottom:60px}
.stage.center>.h2,.stage.center>.xl{margin-top:0}
.serif{font-family:"Songti SC",serif;font-weight:700}
.eyebrow{font-size:34px;color:${C.red};font-weight:600;letter-spacing:.04em}
.h2{font-size:76px;line-height:1.2;margin:18px 0 0}
.xl{font-size:100px;line-height:1.28;margin:22px 0 0;max-width:1560px}
.mk{position:relative;display:inline-block}
.mk>i{position:relative;font-style:normal}
.mk>b{position:absolute;left:-10px;right:-10px;top:50%;bottom:-4%;background:${C.marker};transform-origin:left center;border-radius:6px;display:block}
.stamp{position:absolute;right:0;bottom:0;border:3px solid ${C.red};color:${C.red};background:${C.card};padding:18px 30px;font-size:38px;font-weight:600;border-radius:8px}
.card{background:${C.card};border:3px solid ${C.line};border-radius:12px}
`;

const TYPE_CSS = {
  title: `.t-kicker{font-size:38px;color:${C.red};font-weight:600;letter-spacing:.08em;margin-top:120px}
.t-big{font-size:168px;line-height:1.15;margin:30px 0 0}
.t-rule{width:980px;height:5px;background:${C.ink};margin:44px 0 36px;transform-origin:left center}
.t-sub{font-size:52px;font-weight:600}
.t-date{position:absolute;left:0;bottom:0;font-family:"JetBrains Mono",monospace;font-size:28px;color:${C.muted};letter-spacing:.12em}
.ghost{position:absolute;right:-30px;top:-120px;font-size:700px;line-height:1;color:rgba(178,58,46,.13)}`,
  chips: `.chips{display:flex;flex-wrap:wrap;gap:30px;margin-top:80px;max-width:1600px}
.chip{font-size:50px;font-weight:600;padding:28px 44px;background:${C.card};border:3px solid ${C.ink};border-radius:12px}
.chip.first{border-color:${C.red};color:${C.red}}`,
  triad: `.cards{display:flex;gap:40px;margin-top:70px}
.tc{width:546px;height:500px;padding:48px 44px;box-sizing:border-box;display:flex;flex-direction:column;gap:22px}
.tc-name{font-family:"JetBrains Mono",monospace;font-size:30px;color:${C.red}}
.tc-title{font-size:72px}
.tc-desc{font-size:38px;color:${C.muted}}
.tc-sample{margin-top:auto;font-size:58px}`,
  page: `.win{position:absolute;left:0;top:0;width:${PAGE_W}px;height:${PAGE_H}px;background:#fff;border:1px solid rgba(0,0,0,.22);border-radius:12px;overflow:hidden;box-shadow:0 26px 60px rgba(43,38,34,.22),0 6px 16px rgba(43,38,34,.12)}
${CHROME_CSS}
.vp{position:absolute;left:0;top:${CHROME_H}px;width:${PAGE_W}px;height:${PAGE_H - CHROME_H}px;overflow:hidden;background:#fff}.pg{position:absolute;left:0;top:0;transform-origin:0 0}
.pg img{position:absolute;left:0;top:0;display:block}
.hl{position:absolute;display:block;background:${C.marker};mix-blend-mode:multiply;border-radius:3px;transform-origin:left center}
.notes{position:absolute;left:1300px;top:20px;width:420px;display:flex;flex-direction:column;gap:30px}
.note{border:3px solid ${C.red};color:${C.red};background:${C.card};padding:22px 26px;font-size:38px;line-height:1.35;font-weight:600;border-radius:8px}`,
  statement: `.items{display:flex;gap:30px;margin-top:70px;flex-wrap:wrap}
.item{font-size:44px;font-weight:600;padding:22px 32px;display:flex;align-items:center;gap:20px}
.item .n{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:${C.red};color:${C.card};font-size:32px}`,
  gate: `.gb{position:absolute;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;box-sizing:border-box;padding:0 24px}
.gb-in{left:0;top:300px;width:420px;height:150px;font-size:42px;font-weight:600}
.gb-gate{left:640px;top:240px;width:420px;height:270px;border:6px solid ${C.red};background:${C.card};border-radius:16px}
.gb-gate .g1{font-size:72px;color:${C.red}}
.gb-gate .g2{font-size:36px;color:${C.muted};margin-top:8px;letter-spacing:.3em}
.gb-pass{left:1240px;top:70px;width:480px;height:150px;font-size:34px;font-weight:600;padding:0 16px}
.gb-fail{left:1240px;top:530px;width:480px;height:150px;font-size:34px;font-weight:600;padding:0 16px;color:${C.red};border-color:${C.red}}
.gsvg{position:absolute;left:0;top:0;width:${DESIGN_W}px;height:${DESIGN_H}px;overflow:visible}
.gsvg path{fill:none;stroke:${C.ink};stroke-width:5;stroke-linecap:round}
.gsvg path.f{stroke:${C.red}}
.dot{position:absolute;left:0;top:0;width:30px;height:30px;border-radius:50%;background:${C.marker};border:4px solid ${C.ink}}
.gstat{position:absolute;left:0;top:560px}
.gstat .v{font-size:150px;color:${C.red};line-height:1}
.gstat .l{font-size:34px;color:${C.muted};margin-top:8px}`,
  bars: `.rows{display:flex;flex-direction:column;gap:30px;margin-top:56px}
.row{display:flex;align-items:center;gap:36px}
.lb{width:400px;font-size:42px;font-weight:600}
.track{position:relative;width:960px;height:72px;background:#ebe3d3;border-radius:10px;overflow:hidden}
.fill{position:absolute;left:0;top:0;height:100%;display:block;background:${C.muted};transform-origin:left center}
.fill.accent{background:${C.red}}
.val{font-size:72px;line-height:1;min-width:220px}
.rows.big{gap:56px;margin-top:80px}
.rows.big .lb{font-size:52px;width:460px}
.rows.big .track{width:760px;height:110px}
.rows.big .val{font-size:96px;white-space:nowrap}`,
  news: `.side{position:absolute;left:0;top:0;width:360px}
.nh{font-size:84px;line-height:1.2}
.cs{font-size:34px;color:${C.muted};margin-top:24px}
.list{position:absolute;left:430px;top:0;width:1290px;display:flex;flex-direction:column;gap:22px}
.ni{display:flex;gap:34px;align-items:flex-start;height:132px}
.nn{font-size:64px;color:${C.red};width:96px;line-height:1}
.nt{font-size:48px;font-weight:600;line-height:1.2}
.nd{font-size:32px;color:${C.muted};margin-top:10px}`,
  slots: `.gpu{position:absolute;left:0;top:200px;display:flex;align-items:center;gap:60px}
.cells{display:flex;gap:22px;padding:28px;border:4px solid ${C.ink};border-radius:16px;background:${C.card}}
.cell{position:relative;width:170px;height:170px;border:3px dashed #b9ad98;border-radius:10px;box-sizing:border-box;overflow:hidden}
.cell .lay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:600}
.cell .idle{color:#a0937f}
.lay.used{background:${C.ink};color:${C.card}}
.lay.draft{background:${C.marker};color:${C.ink}}
.lay.over{background:${C.red};color:${C.card}}
.extra{display:flex;gap:22px}
.extra .cell{border:3px solid ${C.red}}
.glabel{position:absolute;left:28px;top:150px;font-family:"JetBrains Mono",monospace;font-size:26px;color:${C.muted}}
.plabel{position:absolute;left:0;top:500px;font-size:50px;font-weight:600;width:1700px}`,
  tree: `.tw{margin-top:60px;font-family:"JetBrains Mono",monospace;font-size:46px;display:flex;flex-direction:column;gap:30px}
.tr{display:flex;align-items:center;gap:26px}
.tr .br{color:#a0937f}
.tr .tn{font-family:"PingFang SC",sans-serif;font-size:36px;color:${C.muted};margin-left:24px}
.tr .git{font-size:28px;color:${C.card};background:${C.red};padding:4px 14px;border-radius:6px}`,
  outro: `.counts{font-size:46px;color:${C.muted};margin-top:30px;font-weight:600}
.ourl{margin-top:70px;font-family:"JetBrains Mono",monospace;font-size:64px}
.hint{font-size:40px;margin-top:26px;color:${C.muted}}
.sign{position:absolute;left:0;bottom:0;font-size:56px;color:${C.red}}
.ghost{position:absolute;right:-30px;top:-120px;font-size:700px;line-height:1;color:rgba(178,58,46,.13)}`,
};

function markText(text, mark) {
  const i = mark ? text.indexOf(mark) : -1;
  if (i < 0) return esc(text);
  return `${esc(text.slice(0, i))}<span class="mk"><b></b><i>${esc(mark)}</i></span>${esc(text.slice(i + mark.length))}`;
}

const beat = (s, kind) => (s.beats || []).find((b) => b.do === kind);

// Each builder returns { html, js } where js runs with `tl`, `R` (scene root), `q(sel)`, `D` (duration) in scope.
const BUILD = {
  title(s) {
    const p = s.props;
    const tMark = beat(s, "mark") ? s.cue(beat(s, "mark").at) : 1.2;
    const tSub = beat(s, "sub") ? s.cue(beat(s, "sub").at) - 0.3 : 2;
    return {
      html: `<div class="ghost serif" data-layout-allow-overlap>${esc(episode.issue)}</div>
<div class="t-kicker">${esc(p.kicker)}</div>
<h1 class="serif t-big">${markText(p.title, p.mark)}</h1>
<div class="t-rule"></div>
<div class="t-sub later">${esc(p.sub)}</div>
<div class="t-date">${esc(p.date)}</div>`,
      js: `tl.fromTo(q(".t-rule"),{scaleX:0},{scaleX:1,duration:.9,ease:"power3.inOut"},.35);
tl.fromTo(q(".mk>b"),{scaleX:0},{scaleX:1,duration:.55,ease:"power2.out"},${tMark});
tl.fromTo(q(".t-sub"),{opacity:0,y:24},{opacity:1,y:0,duration:.5,ease:"power3.out"},${tSub});
tl.fromTo(q(".ghost"),{y:0},{y:-60,duration:D,ease:"none"},0);`,
    };
  },
  chips(s) {
    const p = s.props;
    return {
      html: `<div class="eyebrow">${esc(p.eyebrow)}</div><h2 class="serif h2">${esc(p.heading)}</h2>
<div class="chips">${p.chips.map((c) => `<div class="chip later${c.first ? " first" : ""}">${esc(c.label)}</div>`).join("")}</div>`,
      js: p.chips
        .map((c, i) => `tl.fromTo(q(".chip")[${i}],{opacity:0,y:34,scale:.9},{opacity:1,y:0,scale:1,duration:.45,ease:"back.out(1.6)"},${Math.max(0.3, s.cue(c.at) - 0.1)});`)
        .join("\n"),
    };
  },
  triad(s) {
    const p = s.props;
    const times = p.cards.map((c) => Math.max(0.4, s.cue(c.at) - 0.15));
    return {
      html: `<h2 class="serif h2">${esc(p.heading)}</h2>
<div class="cards">${p.cards
        .map((c) => `<div class="card tc later"><div class="tc-name">${esc(c.name)}</div><div class="serif tc-title">${esc(c.title)}</div><div class="tc-desc">${esc(c.desc)}</div><div class="serif tc-sample"><span class="mk"><b></b><i>${esc(c.sample)}</i></span></div></div>`)
        .join("")}</div>`,
      js: times
        .map(
          (t, i) => `tl.fromTo(q(".tc")[${i}],{opacity:0,y:40},{opacity:1,y:0,duration:.5,ease:"power3.out"},${t});
tl.fromTo(q(".tc")[${i}],{borderColor:"${C.line}"},{borderColor:"${C.red}",duration:.3},${t});
${i > 0 ? `tl.to(q(".tc")[${i - 1}],{borderColor:"${C.line}",duration:.3},${t});` : ""}
tl.fromTo(q(".tc .mk>b")[${i}],{scaleX:0},{scaleX:1,duration:.5,ease:"power2.out"},${r3(t + 0.6)});`,
        )
        .join("\n"),
    };
  },
  page(s) {
    const cap = s.capture;
    const VW = PAGE_W;
    const VH = PAGE_H - CHROME_H;
    const yBias = 0.42;
    const base = VW / cap.width;
    const notes = (s.beats || []).filter((b) => b.note);
    const bars = [];
    const moves = [];
    let lastEnd = 0.3;
    (s.beats || []).forEach((b) => {
      if (!b.highlight) return;
      const h = cap.highlights[b.highlight];
      if (!h || !h.found) throw new Error(`${s.id}: 抓取里没有高亮 ${b.highlight}`);
      const x0 = Math.min(...h.rects.map((r) => r.x));
      const x1 = Math.max(...h.rects.map((r) => r.x + r.w));
      const y0 = Math.min(...h.rects.map((r) => r.y));
      const y1 = Math.max(...h.rects.map((r) => r.y + r.h));
      const z = Math.max(base, Math.min(base * 1.5, (VW - 120) / (x1 - x0)));
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
      const x = clamp(VW / 2 - cx * z, VW - cap.width * z, 0);
      const y = clamp(VH * yBias - cy * z, Math.min(0, VH - cap.height * z), 0);
      const t = s.cue(b.at);
      const start = Math.max(lastEnd, t - 0.75);
      moves.push({ start: r3(start), x: r3(x), y: r3(y), z: r3(z), fx: r3(cx * z + x), fy: r3(cy * z + y) });
      lastEnd = start + 0.9;
      h.rects.forEach((rect, k) => {
        bars.push({ rect, t: r3(Math.max(t, start + 0.8) + k * 0.28), group: moves.length - 1 });
      });
    });
    const first = moves[0];
    const startAtTop = !first || first.start > 1.8;
    const js = [];
    js.push(`const pg=q(".pg")[0];`);
    js.push(
      startAtTop
        ? `tl.set(pg,{x:0,y:0,scale:${r3(base)}},0);tl.to(pg,{y:-40,duration:${r3(first ? first.start : s.duration)},ease:"sine.inOut"},0);`
        : `tl.set(pg,{x:${first.x},y:${first.y},scale:${first.z}},0);`,
    );
    moves.forEach((m, i) => {
      if (i > 0 || startAtTop) js.push(`tl.to(pg,{x:${m.x},y:${m.y},scale:${m.z},duration:.9,ease:"power3.inOut"},${m.start});`);
      const holdStart = r3(i > 0 || startAtTop ? m.start + 0.9 : 0);
      const holdEnd = r3(i + 1 < moves.length ? moves[i + 1].start : s.duration);
      if (holdEnd - holdStart > 0.5) {
        const k = 1.035;
        js.push(`tl.to(pg,{scale:${r3(m.z * k)},x:${r3(m.fx - (m.fx - m.x) * k)},y:${r3(m.fy - (m.fy - m.y) * k)},duration:${r3(holdEnd - holdStart)},ease:"sine.inOut"},${holdStart});`);
      }
    });
    bars.forEach((b, i) => {
      js.push(`tl.fromTo(q(".hl")[${i}],{scaleX:0},{scaleX:1,duration:.5,ease:"power2.out"},${b.t});`);
      const next = moves[b.group + 1];
      if (next) js.push(`tl.to(q(".hl")[${i}],{opacity:.35,duration:.4},${r3(next.start + 0.9)});`);
    });
    notes.forEach((n, i) => {
      const t = r3(Math.max(0.4, s.cue(n.at) + (n.highlight ? 0.5 : 0)));
      const from = "{opacity:0,x:70,rotation:-2}";
      const to = "{opacity:1,x:0,rotation:-2,duration:.5,ease:\"back.out(1.5)\"}";
      js.push(`tl.fromTo(q(".note")[${i}],${from},${to},${t});`);
      if (i > 0) js.push(`tl.to(q(".note")[${i - 1}],{opacity:0.5,duration:.3},${t});`);
    });
    const pad = 6;
    return {
      html: `<div class="win">${chromeBar(s.page, cap, s.assetBase)}
<div class="vp" data-layout-allow-overflow><div class="pg" data-layout-allow-overflow style="width:${cap.width}px;height:${cap.height}px"><img src="${s.assetBase}capture/${esc(cap.image)}" style="width:${cap.width}px;height:${cap.height}px" alt="">
${bars.map((b) => `<b class="hl" style="left:${b.rect.x - pad}px;top:${b.rect.y + b.rect.h * 0.08}px;width:${b.rect.w + pad * 2}px;height:${b.rect.h * 0.9}px"></b>`).join("")}
</div></div></div>
<div class="notes">${notes.map((n) => `<div class="note later">${esc(n.note)}</div>`).join("")}</div>`,
      js: js.join("\n"),
    };
  },
  statement(s) {
    const p = s.props;
    const m = beat(s, "mark");
    const tMark = m ? s.cue(m.at) : 1.0;
    const js = [`tl.fromTo(q(".xl .mk>b"),{scaleX:0},{scaleX:1,duration:.55,ease:"power2.out"},${tMark});`];
    (p.items || []).forEach((it, i) => {
      js.push(`tl.fromTo(q(".item")[${i}],{opacity:0,y:30},{opacity:1,y:0,duration:.45,ease:"back.out(1.5)"},${Math.max(0.5, s.cue(it.at) - 0.1)});`);
    });
    if (p.note) js.push(`tl.fromTo(q(".stamp"),{opacity:0,scale:1.15,rotation:-2},{opacity:1,scale:1,rotation:-2,duration:.45,ease:"back.out(1.7)"},${s.cue(p.note.at)});`);
    return {
      html: `<div class="eyebrow">${esc(p.eyebrow)}</div><h2 class="serif xl">${markText(p.text, p.mark)}</h2>
<div class="items">${(p.items || []).map((it, i) => `<div class="card item later"><span class="n">${i + 1}</span>${esc(it.text)}</div>`).join("")}</div>
${p.note ? `<div class="stamp later">${esc(p.note.text)}</div>` : ""}`,
      js: js.join("\n"),
    };
  },
  gate(s) {
    const p = s.props;
    const b = p.beats;
    const tg = s.cue(b.gate);
    const tp = s.cue(b.pass);
    const tf = s.cue(b.fail);
    const ts = s.cue(b.stat);
    return {
      html: `<svg class="gsvg" viewBox="0 0 ${DESIGN_W} ${DESIGN_H}"><path class="p1" pathLength="1" d="M420 375 L640 375"/><path class="p2" pathLength="1" d="M1060 330 C1150 330 1150 145 1240 145"/><path class="p3 f" pathLength="1" d="M1060 420 C1150 420 1150 605 1240 605"/></svg>
<div class="card gb gb-in">${esc(p.input)}</div>
<div class="gb gb-gate later"><div class="serif g1">${esc(p.gate)}</div><div class="g2">${esc(p.gateSub)}</div></div>
<div class="card gb gb-pass later">${esc(p.pass)}</div>
<div class="card gb gb-fail later">${esc(p.fail)}</div>
<div class="dot later"></div>
<div class="gstat later"><div class="serif v">${esc(p.stat)}</div><div class="l">${esc(p.statLabel)}</div></div>`,
      js: `tl.fromTo(q(".p1"),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.6,ease:"power2.inOut"},${r3(Math.max(0.4, tg - 0.6))});
tl.fromTo(q(".gb-gate"),{opacity:0,scale:.85},{opacity:1,scale:1,duration:.55,ease:"back.out(1.6)"},${tg});
tl.fromTo(q(".dot"),{opacity:0,x:405,y:360},{opacity:1,x:405,y:360,duration:.2},${r3(tg + 0.2)});
tl.to(q(".dot"),{x:610,y:360,duration:.8,ease:"power2.inOut"},${r3(tg + 0.4)});
tl.to(q(".dot"),{x:1225,y:130,duration:.8,ease:"power2.inOut"},${r3(tp)});
tl.fromTo(q(".p2"),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.6,ease:"power2.inOut"},${r3(Math.max(0.4, tp - 0.3))});
tl.fromTo(q(".gb-pass"),{opacity:0,x:40},{opacity:1,x:0,duration:.45,ease:"power3.out"},${r3(tp + 0.2)});
tl.fromTo(q(".p3"),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.6,ease:"power2.inOut"},${r3(Math.max(0.4, tf - 0.3))});
tl.fromTo(q(".gb-fail"),{opacity:0,x:40},{opacity:1,x:0,duration:.45,ease:"power3.out"},${r3(tf + 0.2)});
tl.to(q(".dot"),{x:610,y:360,duration:.01},${r3(tf - 0.31)});
tl.to(q(".dot"),{x:1225,y:590,backgroundColor:"${C.red}",duration:.8,ease:"power2.inOut"},${r3(tf - 0.3)});
tl.fromTo(q(".gstat"),{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:"back.out(1.5)"},${ts});
tl.fromTo(q(".gb-gate"),{boxShadow:"0 0 0 0 rgba(178,58,46,0)"},{boxShadow:"0 0 0 18px rgba(178,58,46,.14)",duration:1.2,ease:"sine.inOut",repeat:${Math.max(0, Math.floor((s.duration - tg - 1) / 2.4) * 2 - 1)},yoyo:true},${r3(tg + 0.6)});`,
    };
  },
  bars(s) {
    const p = s.props;
    const js = [];
    p.rows.forEach((row, i) => {
      const t = Math.max(0.5, s.cue(row.at) - 0.1);
      js.push(`tl.fromTo(q(".fill")[${i}],{scaleX:0},{scaleX:1,duration:.85,ease:"power3.out"},${t});`);
      js.push(`tl.fromTo(q(".val")[${i}],{opacity:0,x:-20},{opacity:1,x:0,duration:.4,ease:"power2.out"},${r3(t + 0.55)});`);
    });
    if (p.footnote) js.push(`tl.fromTo(q(".stamp"),{opacity:0,scale:1.15,rotation:-2},{opacity:1,scale:1,rotation:-2,duration:.45,ease:"back.out(1.7)"},${s.cue(p.footnote.at)});`);
    return {
      html: `<div class="eyebrow">${esc(p.eyebrow)}</div><h2 class="serif h2">${esc(p.heading)}</h2>
<div class="rows${p.rows.length <= 2 ? " big" : ""}">${p.rows.map((row) => `<div class="row"><div class="lb">${esc(row.label)}</div><div class="track"><b class="fill${row.accent ? " accent" : ""}" style="width:${row.pct}%"></b></div><div class="serif val later"${row.accent ? ` style="color:${C.red}"` : ""}>${esc(row.value)}</div></div>`).join("")}</div>
${p.footnote ? `<div class="stamp later">${esc(p.footnote.text)}</div>` : ""}`,
      js: js.join("\n"),
    };
  },
  news(s) {
    const p = s.props;
    const js = [];
    p.items.forEach((it, i) => {
      const t = Math.max(0.5, s.cue(it.at) - 0.15);
      js.push(`tl.fromTo(q(".ni")[${i}],{opacity:0,x:50},{opacity:1,x:0,duration:.45,ease:"power3.out"},${t});`);
      js.push(`tl.fromTo(q(".ni .mk>b")[${i}],{scaleX:0},{scaleX:1,duration:.5,ease:"power2.out"},${r3(t + 0.4)});`);
      if (i > 0) js.push(`tl.to(q(".ni")[${i - 1}],{opacity:.45,duration:.35},${t});`);
    });
    return {
      html: `<div class="side"><div class="serif nh">${esc(p.heading)}</div><div class="cs">${esc(p.caption || `挑 ${p.items.length} 条，完整版见周刊`)}</div></div>
<div class="list">${p.items.map((it, i) => `<div class="ni later"><div class="serif nn">${String(i + (p.startIndex || 1)).padStart(2, "0")}</div><div><div class="nt"><span class="mk"><b></b><i>${esc(it.title)}</i></span></div><div class="nd">${esc(it.detail)}</div></div></div>`).join("")}</div>`,
      js: js.join("\n"),
    };
  },
  slots(s) {
    const p = s.props;
    const n = p.slots;
    const maxLit = Math.max(...p.phases.map((ph) => ph.lit));
    const extra = Math.max(0, maxLit - n);
    const text = { used: "token", draft: "草稿", over: "满载" };
    const cell = (i) => `<div class="cell" data-layout-allow-overlap><div class="lay idle">闲置</div>${["used", "draft", "over"].map((k) => `<div class="lay ${k} l${i}-${k}">${text[k]}</div>`).join("")}</div>`;
    const js = [];
    js.push(`tl.set(q(".cell .lay:not(.idle)"),{opacity:0},0);`);
    p.phases.forEach((ph, k) => {
      const t = Math.max(0.6, s.cue(ph.at) - 0.2);
      for (let i = 0; i < n; i++) {
        for (const kind of ["used", "draft", "over"]) {
          const on = i < ph.lit && kind === ph.kind;
          js.push(`tl.to(q(".l${i}-${kind}"),{opacity:${on ? 1 : 0},duration:.3},${r3(t + (on ? i * 0.08 : 0))});`);
        }
      }
      if (extra) js.push(`tl.to(q(".extra .cell"),{opacity:${ph.lit > n ? 1 : 0},x:0,duration:.4,stagger:.1,ease:"back.out(1.6)"},${r3(t + 0.5)});`);
      js.push(`tl.fromTo(q(".plabel div")[${k}],{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:"power3.out"},${r3(t + 0.2)});`);
      if (k > 0) js.push(`tl.to(q(".plabel div")[${k - 1}],{opacity:0,duration:.25},${r3(t + 0.1)});`);
    });
    if (extra) js.unshift(`tl.set(q(".extra .cell"),{opacity:0,x:30},0);`);
    if (p.note) js.push(`tl.fromTo(q(".stamp"),{opacity:0,scale:1.15,rotation:-2},{opacity:1,scale:1,rotation:-2,duration:.45,ease:"back.out(1.7)"},${s.cue(p.note.at)});`);
    return {
      html: `<h2 class="serif h2">${esc(p.heading)}</h2>
<div class="gpu"><div class="cells">${Array.from({ length: n }, (_, i) => cell(i)).join("")}</div>${extra ? `<div class="extra">${Array.from({ length: extra }, () => `<div class="cell"><div class="lay over">排队</div></div>`).join("")}</div>` : ""}</div>
<div class="plabel">${p.phases.map((ph) => `<div class="later" style="position:absolute;left:0;top:0">${esc(ph.label)}</div>`).join("")}</div>
${p.note ? `<div class="stamp later">${esc(p.note.text)}</div>` : ""}`,
      js: js.join("\n"),
    };
  },
  tree(s) {
    const p = s.props;
    const js = [];
    p.rows.forEach((row, i) => {
      const t = Math.max(0.5, s.cue(row.at) - 0.1);
      js.push(`tl.fromTo(q(".tr.later")[${i}],{opacity:0,x:40},{opacity:1,x:0,duration:.45,ease:"power3.out"},${t});`);
      if (row.key) js.push(`tl.fromTo(q(".tr.later .mk>b")[0],{scaleX:0},{scaleX:1,duration:.5,ease:"power2.out"},${r3(t + 0.4)});`);
    });
    return {
      html: `<h2 class="serif h2">${esc(p.heading)}</h2>
<div class="tw"><div class="tr"><span class="fn">${esc(p.root)}</span><span class="git">git</span></div>
${p.rows.map((row, i) => `<div class="tr later"><span class="br">${i === p.rows.length - 1 ? "└─" : "├─"}</span><span class="fn">${row.key ? `<span class="mk"><b></b><i>${esc(row.name)}</i></span>` : esc(row.name)}</span><span class="tn">${esc(row.note)}</span></div>`).join("")}</div>`,
      js: js.join("\n"),
    };
  },
  outro(s) {
    const p = s.props;
    const tu = beat(s, "url") ? s.cue(beat(s, "url").at) : 2;
    const ts = beat(s, "sign") ? s.cue(beat(s, "sign").at) : s.duration - 2;
    return {
      html: `<div class="ghost serif" data-layout-allow-overlap>${esc(episode.issue)}</div>
<div class="eyebrow">开发者 AI 周刊 · #${esc(episode.issue)}</div><h2 class="serif xl">${esc(p.heading)}</h2>
<div class="counts">${esc(p.counts)}</div>
<div class="ourl later"><span class="mk"><b></b><i>${esc(p.url)}</i></span></div>
<div class="hint later">全部来源链接都在简介里</div>
<div class="sign serif later">${esc(p.sign)}</div>`,
      js: `tl.fromTo(q(".ourl"),{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:"power3.out"},${r3(tu - 0.2)});
tl.fromTo(q(".ourl .mk>b"),{scaleX:0},{scaleX:1,duration:.6,ease:"power2.out"},${r3(tu + 0.4)});
tl.fromTo(q(".hint"),{opacity:0},{opacity:1,duration:.5},${r3(tu + 0.9)});
tl.fromTo(q(".sign"),{opacity:0,x:-30},{opacity:1,x:0,duration:.5,ease:"power3.out"},${r3(ts)});
tl.fromTo(q(".ghost"),{y:0},{y:-60,duration:D,ease:"none"},0);`,
    };
  },
};

function sceneFile(s) {
  const { html, js } = BUILD[s.type](s);
  const css = SCENE_CSS + (TYPE_CSS[s.type] || "");
  return `<!doctype html>
<html lang="zh">
<head><meta charset="UTF-8" /></head>
<body>
<template>
<style>${FONT_CSS}${css}</style>
<div id="root" data-composition-id="${s.id}" data-width="${W}" data-height="${H}" data-duration="${s.duration}">
<div class="tag"><i></i>${esc(s.tag)}</div>
<div class="stage${CENTERED.has(s.type) ? " center" : ""}">
${html}
</div>
</div>
<script>
(function () {
const D = ${s.duration};
const R = document.querySelector('[data-composition-id="${s.id}"]');
const q = (sel) => R.querySelectorAll(sel);
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
tl.fromTo(q(".tag"), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" }, 0.05);
tl.fromTo(q(".stage > :not(.later)"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }, 0.1);
${js}
tl.to(q(".stage, .tag"), { opacity: 0, duration: 0.35, ease: "power1.in" }, ${r3(s.duration - 0.38)});
window.__timelines["${s.id}"] = tl;
})();
</script>
</template>
</body>
</html>
`;
}

// ---------- assembly ----------

async function main() {
  const scenes = [];
  let t = 0;
  for (let i = 0; i < episode.scenes.length; i++) {
    const s = await loadScene(episode.scenes[i], i);
    s.start = r3(t);
    s.assetBase = "../assets/";
    if (s.type === "page") {
      s.page = episode.pages[s.props.page];
      const capPath = path.join(epDir, "assets", "capture", `${s.props.page}.json`);
      if (!existsSync(capPath)) throw new Error(`${s.id}: 缺少网页抓取 ${s.props.page}，先跑 capture.mjs`);
      s.capture = JSON.parse(await fs.readFile(capPath, "utf8"));
    }
    t += s.duration;
    scenes.push(s);
  }
  const total = r3(t);

  const root = epDir;
  const compDir = path.join(root, "compositions");
  await fs.mkdir(compDir, { recursive: true });
  await fs.mkdir(path.join(epDir, "assets"), { recursive: true });
  await fs.copyFile(path.join(VIDEO_DIR, "assets", "avatar.jpg"), path.join(epDir, "assets", "avatar.jpg"));
  for (const s of scenes) await fs.writeFile(path.join(compDir, `${s.id}.html`), sceneFile(s));

  await writeVoiceover(epDir, scenes, total, { gap: GAP, tail: TAIL });

  const caps = scenes.flatMap((s) => captionsFor(s, s.start));
  const chapters = chaptersOf(scenes);
  const names = chapters.map((c) => c.name);
  const dims = { W, H, total };

  await fs.writeFile(
    path.join(compDir, "frame.html"),
    subDoc(
      dims,
      "frame",
      `[data-composition-id="frame"]{position:absolute;inset:0;overflow:hidden;font-family:"PingFang SC",sans-serif}
.paper{position:absolute;inset:0;background:${C.paper}}
.lines{position:absolute;left:0;top:0;width:${W}px;height:${H + 640}px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 62px,rgba(111,99,85,.13) 62px,rgba(111,99,85,.13) 64px)}
.margin{position:absolute;left:${P.marginLeft}px;top:0;width:3px;height:${H}px;background:rgba(178,58,46,.4)}
.chap{position:absolute;right:90px;top:46px;display:flex;gap:28px;font-size:24px;color:${C.muted};letter-spacing:.04em}
.chap span{padding-bottom:6px;border-bottom:3px solid transparent}
.chap span.on{color:${C.ink};font-weight:600;border-bottom-color:${C.red}}`,
      `<div class="paper"></div><div class="lines" data-layout-allow-overflow></div><div class="margin"></div>
${chapters.map((c, i) => `<div class="chap clip" id="chap-${i}" data-start="${c.start}" data-duration="${r3(c.end - c.start)}" data-track-index="1">${names.map((n, k) => `<span${k === i ? ' class="on"' : ""}>${esc(n)}</span>`).join("")}</div>`).join("\n")}`,
      `tl.fromTo(R.querySelector(".lines"), { y: 0 }, { y: -640, duration: ${total}, ease: "none" }, 0);`,
    ),
  );
  await fs.writeFile(
    path.join(compDir, "captions.html"),
    captionsDoc(
      dims,
      caps,
      `.cap{position:absolute;left:${P.capLeft}px;top:${P.capTop}px;width:${P.capWidth}px;display:flex;justify-content:center}
.cap span{display:block;background:${C.card};border:2px solid ${C.line};border-radius:10px;padding:12px 28px;font-size:${P.capSize}px;font-weight:500;line-height:1.35;color:${C.ink};max-width:${P.capMax}px;text-align:center}`,
    ),
  );
  await fs.writeFile(path.join(root, "index.html"), indexHtml(dims, { title: episode.title, scenes }));
  await fs.copyFile(path.join(VIDEO_DIR, "frame.md"), path.join(epDir, "frame.md"));
  await scaffold(epDir);
  await writeSrtAndTimeline(epDir, caps, total, chapters, scenes);
  console.log(`[build] ${scenes.length} 个场景，${caps.length} 条字幕，总长 ${total}s（${mmss(total)}）`);
  for (const c of chapters) console.log(`  ${mmss(c.start)} ${c.name}`);
}

await main();
