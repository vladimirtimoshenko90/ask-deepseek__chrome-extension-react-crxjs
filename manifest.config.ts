import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';

export default defineManifest({
	manifest_version: 3,
	name: pkg.name,
	version: pkg.version,
	icons: {
		48: 'public/logo.png',
	},
	action: {
		default_icon: {
			48: 'public/logo.png',
		},
	},
	omnibox: {
		keyword: 'ds',
	},
	permissions: ['storage', 'unlimitedStorage', 'contextMenus', 'tabs'],
	background: {
		service_worker: 'src/background/sw.ts',
		type: 'module',
	},
	content_scripts: [
		{
			js: ['src/content/main-deepseek.tsx'],
			css: ['src/content/main-deepseek.scss'],
			matches: ['https://chat.deepseek.com/*'],
		},
	],
});
