import type BingoGame from '@/js/lib/BingoGame.ts';
import Parser from '@/js/lib/Parser.ts';
import {
	get, set
} from 'idb-keyval';

// export async function getLocalGames(): Promise<Map<string, BingoGame>> {
// 	let games_array: BingoGame[] | undefined = await get('games');
// 	if (!Array.isArray(games_array)) {
// 		await set('games', games_array = new Array);
// 	}

// 	const games = new Map<string, BingoGame>();
// 	games_array.forEach(game => {
// 		game.is_local = true;

// 		games.set(game.id, game);
// 	});

// 	return games;
// }

// export async function getGameByID(id: string): Promise<BingoGame | undefined> {
// 	const games = await getLocalGames();

// 	return games.get(id);
// }

// async function saveGames(games: Map<string, BingoGame>) {
// 	await set('games', Array.from(games.values()).map(game => Parser.to_json(game)));
// }

// export async function saveGame(game: BingoGame) {
// 	// For testing this is important so we don't mess with the original BingoGame instance
// 	const clone = Parser.from_json(JSON.stringify(Parser.to_json(game)));

// 	const games = await getLocalGames();
// 	games.set(game.id, clone);
// 	await saveGames(games);
// }

// export async function deleteGame(id: string) {
// 	const games = await getLocalGames();
// 	games.delete(id);
// 	await saveGames(games);
// }
