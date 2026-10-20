// 共用的色板、字体声明和 Mac Chrome 窗口外框：build.mjs 的网页场景和 publish.mjs 的封面都用它。
export const C = {
  paper: "#f5efe3",
  card: "#fffdf8",
  ink: "#2b2622",
  muted: "#6f6355",
  line: "#d9cfbd",
  red: "#b23a2e",
  marker: "#ffd84d",
};

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const FONT_CSS = [
  ["PingFang SC", 400, "PingFangSC-Regular"],
  ["PingFang SC", 500, "PingFangSC-Medium"],
  ["PingFang SC", 600, "PingFangSC-Semibold"],
  ["PingFang SC", 700, "PingFangSC-Semibold"],
  ["Songti SC", 400, "STSongti-SC-Regular"],
  ["Songti SC", 700, "STSongti-SC-Bold"],
  ["Songti SC", 900, "STSongti-SC-Black"],
]
  .map(([family, weight, ps]) => `@font-face{font-family:"${family}";font-weight:${weight};src:local("${ps}")}`)
  .join("\n");
export const CHROME_TABS = 46;
export const CHROME_BAR = 48;
export const CHROME_H = CHROME_TABS + CHROME_BAR + 1;
export const ICON = {
  close: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="#5f6368" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  plus: `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 3.5v11M3.5 9h11" stroke="#3c4043" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  back: `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M19 12H6M11.5 6.5L6 12l5.5 5.5" fill="none" stroke="#3c4043" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fwd: `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 12h13M12.5 6.5L18 12l-5.5 5.5" fill="none" stroke="#bdc1c6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  reload: `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M18.5 12a6.5 6.5 0 1 1-1.9-4.6M18.5 5v4h-4" fill="none" stroke="#3c4043" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  tune: `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 6.5h8M15 6.5h2M3 13.5h2M9 13.5h8" stroke="#3c4043" stroke-width="1.7" stroke-linecap="round"/><circle cx="13" cy="6.5" r="2" fill="none" stroke="#3c4043" stroke-width="1.7"/><circle cx="7" cy="13.5" r="2" fill="none" stroke="#3c4043" stroke-width="1.7"/></svg>`,
  star: `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 4.5l2.3 4.7 5.2.8-3.8 3.6.9 5.2L12 16.4l-4.6 2.4.9-5.2-3.8-3.6 5.2-.8z" fill="none" stroke="#3c4043" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  more: `<svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.7" fill="#3c4043"/><circle cx="12" cy="12" r="1.7" fill="#3c4043"/><circle cx="12" cy="18" r="1.7" fill="#3c4043"/></svg>`,
};

// Mac Chrome (light theme) window chrome around a captured page, so viewers read it as
// "this is the real page" and the omnibox doubles as the source credit.
export function chromeBar(spec, cap, assetBase) {
  const u = new URL(spec.url);
  const host = u.host.replace(/^www\./, "");
  const rest = (u.pathname === "/" ? "" : u.pathname) + u.search;
  const fav = cap.favicon
    ? `<span class="fav"><img src="${assetBase}capture/${esc(cap.favicon)}" alt=""></span>`
    : `<span class="fav letter">${esc(host[0].toUpperCase())}</span>`;
  return `<div class="tabs"><div class="lights"><i class="r"></i><i class="y"></i><i class="g"></i></div>
<div class="tab">${fav}<span class="tt" data-layout-allow-overflow>${esc(cap.title || host)}</span>${ICON.close}</div><span class="plus">${ICON.plus}</span></div>
<div class="toolbar"><span class="btn">${ICON.back}</span><span class="btn">${ICON.fwd}</span><span class="btn">${ICON.reload}</span>
<div class="omni">${ICON.tune}<span class="u" data-layout-allow-overflow><span class="host">${esc(host)}</span><span class="path">${esc(rest)}</span></span></div>
<span class="btn">${ICON.star}</span><span class="avatar"><img src="${assetBase}avatar.jpg" alt=""></span><span class="btn">${ICON.more}</span></div>`;
}

// 窗口外框（标签栏 + 地址栏）的样式，不含窗口尺寸和页面视口。
export const CHROME_CSS = `.tabs{position:relative;height:${CHROME_TABS}px;background:#dfe3e8;display:flex;align-items:flex-end;padding:0 0 0 18px}
.lights{display:flex;gap:9px;align-self:center;margin-right:22px}
.lights i{display:block;width:13px;height:13px;border-radius:50%}
.lights .r{background:#ff5f57}.lights .y{background:#febc2e}.lights .g{background:#28c840}
.tab{position:relative;width:300px;height:38px;background:#fff;border-radius:10px 10px 0 0;display:flex;align-items:center;gap:10px;padding:0 12px 0 14px;font-size:17px;color:#1f1f1f}
.tab:before,.tab:after{content:"";position:absolute;bottom:0;width:10px;height:10px;background:radial-gradient(circle at var(--cx) 0,transparent 10px,#fff 10.5px)}
.tab:before{left:-10px;--cx:0}
.tab:after{right:-10px;--cx:10px}
.fav{width:18px;height:18px;flex:none;display:flex;align-items:center;justify-content:center;border-radius:4px;overflow:hidden}
.fav img{width:18px;height:18px;object-fit:contain;display:block}
.fav.letter{background:#5f6368;color:#fff;font-size:12px;font-weight:700}
.tt{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;-webkit-mask-image:linear-gradient(to right,#000 85%,transparent)}
.tab svg,.toolbar svg{display:block;flex:none}
.plus{margin:0 0 9px 18px;align-self:flex-end}
.toolbar{height:${CHROME_BAR}px;background:#fff;display:flex;align-items:center;gap:6px;padding:0 12px;border-bottom:1px solid #dadce0}
.btn{width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:50%}
.omni{flex:1;height:36px;margin:0 8px;background:#eef1f5;border-radius:18px;display:flex;align-items:center;gap:12px;padding:0 16px;font-size:18px;color:#1f1f1f;white-space:nowrap;overflow:hidden}
.omni .u{flex:1;min-width:0;overflow:hidden;white-space:nowrap;-webkit-mask-image:linear-gradient(to right,#000 88%,transparent)}
.omni .path{color:#5f6368}
.avatar{width:26px;height:26px;border-radius:50%;margin:0 4px;overflow:hidden;flex:none}
.avatar img{width:100%;height:100%;object-fit:cover;display:block}`;
