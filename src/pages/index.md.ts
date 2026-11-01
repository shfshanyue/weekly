import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

const LATEST_COUNT = 8;

export async function GET(context: { site?: URL }) {
	const site = context.site?.href.replace(/\/$/, '') ?? 'https://weekly.shanyue.tech';
	const posts = (await getCollection('blog'))
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.slice(0, LATEST_COUNT);

	const latestLinks = posts
		.map((post) => {
			const date = post.data.pubDate.toISOString().slice(0, 10);
			return `- [${post.data.title}](${site}/${post.id}/)（${date}）`;
		})
		.join('\n');

	const body = `# ${SITE_TITLE}

${SITE_DESCRIPTION}

- 站点：${site}/
- RSS：${site}/rss.xml
- 关于：${site}/about/
- 本页 Markdown：请求 \`Accept: text/markdown\` 即可在同一 URL 获取

## 最新几期

${latestLinks}

## 说明

本站为「开发者 AI 周刊」（原「前端周刊」）静态站。浏览器默认拿到 HTML；Agent 可用 \`Accept: text/markdown\` 协商 Markdown。
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			Vary: 'Accept',
		},
	});
}
