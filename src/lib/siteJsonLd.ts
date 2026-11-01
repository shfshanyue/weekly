import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

/** 站点联系邮箱（about 页无 mailto 时的约定地址） */
export const SITE_CONTACT_EMAIL = 'xianger94@gmail.com';

const DEFAULT_SITE_ORIGIN = 'https://weekly.shanyue.tech';

function siteOrigin(site: URL | string | undefined): string {
	if (site instanceof URL) return site.origin;
	if (typeof site === 'string' && site.length > 0) {
		return new URL(site).origin;
	}
	return DEFAULT_SITE_ORIGIN;
}

/** 首页 JSON-LD @graph：WebSite + Organization + Person（单 script，避免与简单 WebSite 重复） */
export function buildHomePageJsonLd(site: URL | string | undefined) {
	const origin = siteOrigin(site);
	const siteUrl = `${origin}/`;
	const orgId = `${origin}/#organization`;
	const websiteId = `${origin}/#website`;
	const personId = `${origin}/#person`;
	const logoUrl = `${origin}/logo.svg`;

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': websiteId,
				name: SITE_TITLE,
				description: SITE_DESCRIPTION,
				url: siteUrl,
				inLanguage: 'zh-CN',
				publisher: { '@id': orgId },
			},
			{
				'@type': 'Organization',
				'@id': orgId,
				name: SITE_TITLE,
				description: SITE_DESCRIPTION,
				url: siteUrl,
				logo: {
					'@type': 'ImageObject',
					url: logoUrl,
				},
				founder: { '@id': personId },
				contactPoint: {
					'@type': 'ContactPoint',
					contactType: 'customer support',
					email: SITE_CONTACT_EMAIL,
					availableLanguage: ['zh-CN', 'Chinese'],
				},
				address: {
					'@type': 'PostalAddress',
					addressCountry: 'CN',
				},
			},
			{
				'@type': 'Person',
				'@id': personId,
				name: '山月',
				url: 'https://x.com/shfshanyue',
				sameAs: ['https://x.com/shfshanyue', 'https://github.com/shfshanyue/weekly'],
			},
		],
	};
}

/** 非首页的通用 WebSite 片段 */
export function buildWebSiteJsonLd(
	site: URL | string | undefined,
	description: string,
) {
	const origin = siteOrigin(site);
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_TITLE,
		url: origin,
		description,
		inLanguage: 'zh-CN',
	};
}
