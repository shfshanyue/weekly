// 口播时间轴：把 tts.py 的逐字对齐变成场景时长、动画提示点和字幕。build.mjs 与 build-read.mjs 共用。
import fs from "node:fs/promises";
import path from "node:path";

export const r3 = (n) => Math.round(n * 1000) / 1000;
const PUNCT = "，。！？；：、,!?;:";

export function clauses(s) {
  const out = [];
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    if (PUNCT.includes(s[i]) || i === s.length - 1) {
      if (i + 1 > start) out.push({ start, end: i + 1 });
      start = i + 1;
    }
  }
  return out.length ? out : [{ start: 0, end: s.length }];
}

// Map a character index in the displayed text onto the spoken text (which may spell
// numbers out). Both keep the same punctuation, so clause k maps to clause k.
export function mapIndex(text, say, idx) {
  if (text === say) return idx;
  const tc = clauses(text);
  const sc = clauses(say);
  if (tc.length === sc.length) {
    const k = tc.findIndex((c) => idx >= c.start && idx < c.end);
    if (k >= 0) {
      const ratio = (idx - tc[k].start) / Math.max(1, tc[k].end - tc[k].start);
      return Math.min(sc[k].end - 1, sc[k].start + Math.round(ratio * (sc[k].end - sc[k].start)));
    }
  }
  return Math.min(say.length - 1, Math.round((idx / text.length) * say.length));
}

// gaps: firstHead（全片第一个场景前）、head（其余场景前）、gap（句间）、tail（场景尾）。
export function createSceneLoader(epDir, narration, gaps) {
  const narrById = Object.fromEntries(narration.scenes.map((s) => [s.id, s]));
  return async function loadScene(scene, index) {
    const nar = narrById[scene.id];
    if (!nar || nar.lines.length !== scene.lines.length) throw new Error(`${scene.id} 缺少口播，先跑 tts.py`);
    const head = index === 0 ? gaps.firstHead : gaps.head;
    const lines = [];
    let t = head;
    for (let i = 0; i < scene.lines.length; i++) {
      const line = scene.lines[i];
      const align = JSON.parse(await fs.readFile(path.join(epDir, nar.lines[i].align), "utf8"));
      const say = line.say || line.text;
      lines.push({ ...line, say, align, wav: nar.lines[i].wav, offset: t, duration: align.duration });
      t += align.duration + (i < scene.lines.length - 1 ? gaps.gap : 0);
    }
    const duration = r3(t + gaps.tail);
    const cue = (at, { end = false } = {}) => {
      for (const l of lines) {
        const i = l.text.indexOf(at);
        if (i < 0) continue;
        const si = mapIndex(l.text, l.say, end ? i + at.length - 1 : i);
        const arr = end ? l.align.end : l.align.start;
        return r3(l.offset + arr[Math.max(0, Math.min(arr.length - 1, si))]);
      }
      throw new Error(`${scene.id}: 口播里找不到提示词「${at}」`);
    };
    return { ...scene, lines, head, duration, cue };
  };
}

export function captionsFor(scene, sceneStart, capChars) {
  const cues = [];
  for (const l of scene.lines) {
    const tc = clauses(l.text);
    const groups = [];
    let cur = null;
    for (const c of tc) {
      const len = c.end - c.start;
      if (cur && cur.end - cur.start + len <= capChars && !"。！？".includes(l.text[cur.end - 1])) cur.end = c.end;
      else groups.push((cur = { ...c }));
    }
    const times = groups.map((g) => {
      const a = mapIndex(l.text, l.say, g.start);
      const b = mapIndex(l.text, l.say, g.end - 1);
      return [l.align.start[a] ?? 0, l.align.end[b] ?? l.duration];
    });
    groups.forEach((g, k) => {
      const text = l.text.slice(g.start, g.end).trim().replace(/[，。、；：,;:]$/u, "");
      const start = sceneStart + l.offset + times[k][0];
      const nextStart = k + 1 < groups.length ? sceneStart + l.offset + times[k + 1][0] : sceneStart + l.offset + l.duration + 0.15;
      cues.push({ start: r3(start), end: r3(Math.max(nextStart, start + 0.6)), text });
    });
  }
  return cues;
}

export function chaptersOf(scenes) {
  const chapters = [];
  for (const s of scenes) {
    const last = chapters[chapters.length - 1];
    if (last && last.name === s.chapter) last.end = r3(s.start + s.duration);
    else chapters.push({ name: s.chapter, start: s.start, end: r3(s.start + s.duration) });
  }
  return chapters;
}

export function srtTime(t) {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
}

export const mmss = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
