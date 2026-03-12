// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://weekly.shanyue.tech',
	integrations: [mdx(), sitemap()],
	server: {
		host: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
	vite: {
		plugins: [tailwindcss()],
		server: {
			allowedHosts: true,
			cors: true,
			hmr: {
				clientPort: 443,
			},
		},
	},
});
