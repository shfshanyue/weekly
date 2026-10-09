/** Helpers for weekly issue UI (homepage briefs, magazine TOC, issue numbers). */

export type BriefItem = {
	title: string;
	href: string;
};

export type TocSection = {
	id: string;
	text: string;
};

/** Extract numeric issue from content id like `weekly-61`. */
export function getIssueNumber(id: string): number | null {
	const m = id.match(/(?:^|\/)weekly-(\d+)$/);
	return m ? Number(m[1]) : null;
}

/** Strip "前端周刊 #N：" prefix for magazine display titles. */
export function displayTitle(title: string): string {
	const stripped = title.replace(/^前端周刊\s*#?\d+\s*[：:]\s*/, '').trim();
	return stripped || title;
}

/** 1–99 → 中文数字（杂志标题页用）；更大数字回退阿拉伯数字。 */
export function toChineseNumeral(n: number): string {
	if (!Number.isFinite(n) || n < 0) return String(n);
	if (n === 0) return '零';
	const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
	if (n < 10) return digits[n];
	if (n === 10) return '十';
	if (n < 20) return `十${digits[n % 10]}`;
	if (n < 100) {
		const tens = Math.floor(n / 10);
		const ones = n % 10;
		return `${digits[tens]}十${ones ? digits[ones] : ''}`;
	}
	return String(n);
}

/** Slice markdown body under a given `##` heading until the next `##`. */
function sectionUnderHeading(body: string, heading: string): string | null {
	const lines = body.split('\n');
	let start = -1;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim() === `## ${heading}`) {
			start = i + 1;
			break;
		}
	}
	if (start < 0) return null;
	const out: string[] = [];
	for (let i = start; i < lines.length; i++) {
		if (/^##\s/.test(lines[i])) break;
		out.push(lines[i]);
	}
	return out.join('\n');
}

/**
 * Parse top N items under `## 本周快讯`.
 * Graceful empty array on parse failure.
 */
export function parseBriefItems(body: string | undefined, limit = 3): BriefItem[] {
	if (!body) return [];
	const section = sectionUnderHeading(body, '本周快讯');
	if (!section) return [];

	const items: BriefItem[] = [];
	for (const raw of section.split('\n')) {
		const line = raw.trim();
		if (!line.startsWith('- ')) continue;

		const linked = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)/);
		if (linked) {
			items.push({ title: linked[1].trim(), href: linked[2].trim() });
		} else {
			const text = line
				.slice(2)
				.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
				.replace(/[`*_]/g, '')
				.trim();
			if (!text) continue;
			items.push({ title: text.slice(0, 80), href: '#本周快讯' });
		}
		if (items.length >= limit) break;
	}
	return items;
}

/** Collect `##` headings for TOC; ids match Astro's default Chinese heading ids. */
export function parseTocSections(body: string | undefined): TocSection[] {
	if (!body) return [];
	const sections: TocSection[] = [];
	for (const line of body.split('\n')) {
		const m = line.match(/^## (.+)$/);
		if (!m) continue;
		const text = m[1].trim();
		if (!text) continue;
		sections.push({ id: text, text });
	}
	return sections;
}
