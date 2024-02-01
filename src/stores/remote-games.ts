import BingoGame from '@/js/lib/BingoGame.ts';
import {
	defineStore
} from 'pinia';

export const useRemoteGamesStore = defineStore('remoteGames', () => {
	const games: Ref<BingoGame[]> = ref([]);

	async function fetchGames() {
		// TODO: Fetch games from server
	}

	return {
		games,

		fetchGames
	};
});
