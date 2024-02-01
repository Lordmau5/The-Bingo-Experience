import BingoGame from '@/js/lib/BingoGame.ts';
import {
	defineStore
} from 'pinia';
import {
	get, set
} from 'idb-keyval';
import Parser from '@/js/lib/Parser.ts';

/*
* TODO: Is an array for games really better?
* Wouldn't a map make more sense since we have direct ID => Game access?
*/
export const useLocalGamesStore = defineStore('localGames', () => {
	const games: Ref<BingoGame[]> = ref([]);

	async function fetchGames() {
		console.info('--- Fetching games ...');

		let games_array: JSON[] | undefined = await get('games');
		if (!Array.isArray(games_array)) {
			await set('games', games_array = new Array);
		}

		games.value.length = 0;

		games.value = games_array.map(game => {
			const bingo_game = Parser.from_json_raw(game);

			bingo_game.is_local = true;

			return bingo_game;
		});

		// games_array.forEach(game => {
		// 	game = Parser.from_json(JSON.stringify(game));

		// 	game.is_local = true;

		// 	games.value.set(game.id, game);
		// });

		console.info('--- Finished fetching games!');

		console.info('');
	}

	async function saveGames() {
		console.info('--- Saving games ...');

		await set('games', Array.from(games.value.values()).map(
			game => Parser.to_json(game)
		));

		console.info('--- Finished saving games!');
		console.info('');
	}

	function hasGame(id: string): boolean {
		return games.value.some(game => game.id === id);
	}

	async function addGame(game: BingoGame) {
		if (hasGame(game.id)) {
			console.error(`Failed to clone game with ID ${ game.id } because it already exists`);

			return;
		}

		console.info(`--- Adding game with ID '${ game.id }' ...`);

		const cloned_game = Parser.from_json(JSON.stringify(Parser.to_json(game)));

		cloned_game.is_local = true;

		games.value.push(cloned_game);

		await saveGames();
	}

	async function updateGame(old_game: BingoGame, game: BingoGame) {
		if (!hasGame(old_game.id)) {
			console.error(`Failed to update game with ID ${ old_game.id } because it doesn't exist`);

			return;
		}

		console.info(`--- Updating game with ID '${ old_game.id }' ...`);

		const index = games.value.findIndex(g => g.id === old_game.id);

		games.value[index] = game;

		await saveGames();
	}

	async function deleteGame(id: string) {
		if (hasGame(id)) {
			console.error(`Failed to delete game with ID ${ id } because it doesn't exist`);

			return;
		}

		console.info(`--- Deleting game with ID '${ id }' ...`);

		games.value = games.value.filter(game => game.id !== id);

		await saveGames();
	}

	return {
		games,

		fetchGames,
		saveGames,

		hasGame,
		addGame,
		updateGame,
		deleteGame
	};
}, {
	debounce: {
		fetchGames: 0,
		saveGames: 500
	}
});
