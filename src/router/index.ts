import {
	createRouter, createWebHistory
} from 'vue-router';
// import HomeView from '../views/HomeView.vue'
import MainPage from '@/views/MainPage.vue';
import EditorPage from '@/views/EditorPage.vue';
import GeneratorPage from '@/views/GeneratorPage.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: MainPage
		},
		{
			path: '/editor',
			name: 'editor',
			component: EditorPage
		},
		{
			path: '/generator',
			name: 'generator',
			component: GeneratorPage
		}
		// {
		//   path: '/about',
		//   name: 'about',
		//   // route level code-splitting
		//   // this generates a separate chunk (About.[hash].js) for this route
		//   // which is lazy-loaded when the route is visited.
		//   component: () => import('../views/AboutView.vue')
		// }
	]
});

export default router;
