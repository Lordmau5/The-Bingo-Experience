// Example code to convert the old format to the new one
import json from './games.json';
import new_game from './new_game.json';

import markdown_text from '@/js/testmarkdown.js';
import BingoGame from '@/js/lib/BingoGame.ts';
import BingoGoal from '@/js/lib/BingoGoal.ts';
import BingoCategory from '@/js/lib/BingoCategory.ts';
import BingoGoalList from '@/js/lib/BingoGoalList.ts';
import Parser from '@/js/lib/Parser.ts';

export const games: BingoGame[] = [];
// export const games: Map<string, BingoGame> = new Map;

async function run_new_format() {
	games.length = 0;
	games.push(Parser.from_json(JSON.stringify(new_game)));
}
run_new_format();

function run_old_format() {
	games.length = 0;

	for (const j_game of json) {
		const game = new BingoGame(
			j_game.game_name,
			j_game.game_name,
			'Short Description',
			markdown_text
		);

		for (const j_cat of j_game.categories) {
			const category = new BingoCategory(j_cat.category_name);
			game.addItem(category);

			for (const j_group of j_cat.groups) {
				const goal_list = new BingoGoalList(j_group.group_name);
				category.addGoalList(goal_list);

				for (const j_goal of j_group.options) {
					const goal = new BingoGoal(j_goal.title);
					goal_list.addGoal(goal);
					goal.addTag(j_goal.difficulty);
				}
			}
		}

		games.push(game);
		// games.set(game.name, game);

		// for (let i = 0; i < 3; i++)
		// 	games.set(`${ game.name }-${ i }`, game);
	}

	// console.log('games', games);

	// const game = games.get('Yakuza 0');
	// console.log(instanceToPlain(game));
	// console.log(JSON.stringify(instanceToPlain(game)));

	// const game = games.get('Yakuza 0');
	// const group = game?.getGroupByName('Adventure');
	// if (!group)
	// 	return;

	// const goals = game?.getGoalsByGroup(true, group);
	// console.log(goals);
}

// run_old_format();
