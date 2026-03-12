# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** 前端周刊 (Frontend Weekly)
**Generated:** 2026-03-13
**Category:** 技术周刊 / 编辑出版类
**Style:** Swiss Modernism 2.0 — Editorial

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | 用途 |
|------|-----|--------------|------|
| Ink | `#0a0a0b` | `--ink` | 主标题、强调文字 |
| Ink Secondary | `#3f3f46` | `--ink-secondary` | 正文内容 |
| Ink Muted | `#71717a` | `--ink-muted` | 辅助文字、日期、描述 |
| Accent | `#e11d48` | `--accent` | CTA、链接、标记 |
| Accent Hover | `#be123c` | `--accent-hover` | 链接 hover 状态 |
| Accent Soft | `#fff1f2` | `--accent-soft` | Active 导航背景、Badge |
| Surface | `#fafaf9` | `--surface` | 页面背景 |
| Surface Card | `#ffffff` | `--surface-card` | 卡片背景 |
| Border | `#e4e4e7` | `--border` | 卡片边框、分隔线 |
| Border Light | `#f4f4f5` | `--border-light` | Hover 背景、代码块 |

**设计理念:** 编辑级深色墨水 + 玫红强调色，纸张质感背景

### Typography

| 角色 | 字体 | 权重 | 用途 |
|------|------|------|------|
| **标题** | `Noto Serif SC` → `Songti SC` → `SimSun` → serif | 700 | h1-h6、Logo 文字、Footer 品牌 |
| **正文** | `Inter` → `-apple-system` → system-ui → sans-serif | 300-700 | 正文、导航、按钮、UI 元素 |
| **代码** | `JetBrains Mono` → `Fira Code` → `SF Mono` → monospace | 400 | 代码块、行内代码 |

**Mood:** 杂志感、编辑出版、精致、中文衬线标题 + 西文无衬线正文

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Serif+SC:wght@400;500;600;700&display=swap');
```

### Type Scale (Modular 1.25)

| Token | Value | 用途 |
|-------|-------|------|
| `--text-xs` | `0.75rem` (12px) | Badge、版权、极小标签 |
| `--text-sm` | `0.875rem` (14px) | 辅助文字、导航链接、日期 |
| `--text-base` | `1rem` (16px) | 正文 |
| `--text-lg` | `1.125rem` (18px) | h4、描述文字 |
| `--text-xl` | `1.25rem` (20px) | h3 |
| `--text-2xl` | `1.5rem` (24px) | h2 |
| `--text-3xl` | `1.875rem` (30px) | 移动端 h1 |
| `--text-4xl` | `2.25rem` (36px) | 桌面端 h1 |

### Spacing

| Token | Value | 用途 |
|-------|-------|------|
| `--space-xs` | `0.25rem` (4px) | 紧凑间距 |
| `--space-sm` | `0.5rem` (8px) | 图标间距、inline 间隔 |
| `--space-md` | `1rem` (16px) | 标准内边距 |
| `--space-lg` | `1.5rem` (24px) | 卡片内边距、区域间距 |
| `--space-xl` | `2rem` (32px) | 大间距 |
| `--space-2xl` | `3rem` (48px) | 区块间距 |
| `--space-3xl` | `4rem` (64px) | Hero 区域、页面顶部 |

### Radius

| Token | Value | 用途 |
|-------|-------|------|
| `--radius-sm` | `6px` | 按钮、导航项、小元素 |
| `--radius-md` | `10px` | 卡片、代码块、图片 |
| `--radius-lg` | `16px` | 大卡片、Featured 区域 |

### Shadow Depths

| Token | Value | 用途 |
|-------|-------|------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | 默认卡片 |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.06)` | Hover 卡片 |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.08)` | Featured 卡片、Hero 图片 |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)` | 文章内容卡片 |

### Transition

```css
--ease: cubic-bezier(0.4, 0, 0.2, 1);
/* 标准时长: 200ms */
/* hover/focus: 200ms */
/* 卡片 transform: 300ms */
```

---

## Component Specs

### Header (Sticky)

```
高度: 56px
背景: rgba(250, 250, 249, 0.85) + backdrop-filter: blur(12px) saturate(180%)
底部: 1px solid var(--border)
内容宽度: max-width 800px 居中
结构: Logo(左) — Nav(中) — Social(右)
```

### Navigation Link

```
状态      | 颜色             | 背景
---------|-----------------|------------------
默认      | --ink-muted      | transparent
Hover    | --ink            | --border-light
Active   | --accent         | --accent-soft (font-weight: 600)
```

### Article Card (首页)

```
背景: --surface-card
边框: 1px solid --border
圆角: --radius-md
阴影: --shadow-sm
Hover: shadow-md + border transparent + translateY(-1px)
图片: aspect-ratio 16/9, object-fit cover
内边距: --space-md --space-lg
```

### Featured Card (首页最新一期)

```
背景: --surface-card
边框: 1px solid --border
圆角: --radius-lg
阴影: --shadow-sm
Hover: shadow-lg + border transparent + translateY(-2px)
图片: aspect-ratio 2/1, object-fit cover
标签: "最新一期" 红色小字 uppercase letter-spacing 0.06em
```

### Content Card (文章页 h3 + p)

```
背景: --surface-card
边框: 1px solid --border
圆角: --radius-md
内边距: --space-md --space-lg
阴影: --shadow-card
字号: --text-sm
行高: 1.75
颜色: --ink-secondary
```

### Section Title (文章页 h2)

```
字体: Noto Serif SC
字号: --text-2xl
下方: 2px solid --border 底边框
上方间距: --space-3xl
下方间距: --space-lg
```

### Hero Badge (首页)

```
背景: --accent-soft
文字: --accent
字号: --text-xs
字重: 600
圆角: 100px (pill)
内边距: 4px 14px
letter-spacing: 0.04em
装饰: 左侧 6px 红色圆点
```

### Article Header (文章页)

```
对齐: 居中
标题: --text-4xl (移动端 --text-3xl)
描述: --text-lg, --ink-muted, max-width 580px
分隔线: 48px × 3px 红色条, 居中, 圆角 2px
Meta: --text-sm, --ink-muted, font-weight 500
```

### Footer

```
上方: 1px solid --border
内容宽度: max-width 800px
结构: Brand+描述(左) — Social icons(右)
底部: 版权文字 --text-xs --ink-muted
```

---

## Layout

```
内容最大宽度: 800px (max-width)
居中方式: margin: 0 auto
页面间距: --space-2xl --space-lg (桌面) / --space-lg --space-md (移动)
断点:
  - Mobile: ≤ 768px
  - Desktop: > 768px
```

---

## Style Guidelines

**Style:** Swiss Modernism 2.0 — Editorial

**核心特征:**
- 数学化间距与网格系统
- 强排版层级（衬线标题 + 无衬线正文）
- 最小化装饰，内容为王
- 高对比度文字，纸张质感背景
- 红色强调色点缀

**适用于:** 技术周刊、编辑出版物、杂志、文档站

---

## Anti-Patterns (禁止使用)

- ❌ **Emoji 作图标** — 使用 SVG 图标 (Heroicons/Lucide)
- ❌ **缺少 cursor:pointer** — 所有可点击元素必须有 cursor:pointer
- ❌ **Layout-shifting hover** — 避免导致布局偏移的 scale 变换
- ❌ **低对比度文字** — 最低 4.5:1 对比度
- ❌ **无过渡动画** — 始终使用 transition (200-300ms)
- ❌ **不可见的 focus 状态** — focus 状态必须可见
- ❌ **Poor typography** — 注意中文排版间距与行高
- ❌ **Slow loading** — 图片懒加载、字体 display:swap

---

## Pre-Delivery Checklist

- [ ] 无 emoji 作为图标（使用 SVG）
- [ ] 图标来自一致的图标集
- [ ] 所有可点击元素有 `cursor-pointer`
- [ ] Hover 状态使用平滑过渡 (200-300ms)
- [ ] 文字对比度 ≥ 4.5:1
- [ ] Focus 状态可见（键盘导航）
- [ ] 尊重 `prefers-reduced-motion`
- [ ] 响应式: 375px / 768px / 1024px / 1440px
- [ ] 固定导航栏不遮挡内容
- [ ] 移动端无水平滚动
- [ ] 中文字体 fallback 链完整
- [ ] `::selection` 使用 accent 色
