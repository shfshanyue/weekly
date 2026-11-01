import { SITE_TITLE } from '../consts';

export async function GET(context: { site?: URL }) {
	const site = context.site?.href.replace(/\/$/, '') ?? 'https://weekly.shanyue.tech';

	const body = `# 404 页面未找到

你访问的路径在本站不存在，或内容已迁移到其他 URL。请从下列入口继续浏览「${SITE_TITLE}」。

- [首页](${site}/)
- [站点地图 sitemap-index.xml](${site}/sitemap-index.xml)
- [Agent 说明 llms.txt](${site}/llms.txt)
`;

	return new Response(body, {
		status: 404,
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			Vary: 'Accept',
		},
	});
}
