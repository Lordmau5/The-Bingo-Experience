import {
	fileURLToPath, URL
} from 'node:url';

import {
	defineConfig
} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import Components from 'unplugin-vue-components/vite';

import {
	quasar, transformAssetUrls
} from '@quasar/vite-plugin';

import AutoImport from 'unplugin-auto-import/vite';
import VueRouter from 'unplugin-vue-router/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		VueRouter(),
		Components({
			dts: true,
			dirs: [
				'src/components',
				'src/composables'
			]
		}),
		AutoImport({
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue$/,
				/\.vue\?vue/ // .vue
			],
			imports: [
				// presets
				'vue',
				'vue-router'
			],
			dts: true,
			eslintrc: {
				enabled: true
			},
			vueTemplate: true
		}),

		vue({
			template: {
				transformAssetUrls
			}
		}),
		vueJsx(),
		quasar({
			sassVariables: 'src/assets/quasar-variables.sass'
		})
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
});
