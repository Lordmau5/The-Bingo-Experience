import {
	createApp
} from 'vue';
import {
	createPinia
} from 'pinia';
import DebouncePlugin from '@/plugins/debounce.ts';

import '@/assets/main.css';

import {
	Quasar
} from 'quasar';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

import 'reflect-metadata';

import App from './App.vue';
import router from './router';

const app = createApp(App);

const pinia = createPinia();
pinia.use(DebouncePlugin);

app.use(Quasar, {
	config: {
		dark: true
	}
});
// app.use(createPinia());
app.use(pinia);
app.use(router);

app.mount('#app');
