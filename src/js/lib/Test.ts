import BingoGame from '@/js/lib/BingoGame.ts';
import BingoGoal from '@/js/lib/BingoGoal.ts';
import BingoGoalList from '@/js/lib/BingoGoalList.js';
import Parser from './Parser.js';
import BingoCategory from '@/js/lib/BingoCategory.js';

function test() {
	const game = new BingoGame(
		'yakuza-0',
		'Yakuza 0',
		'A silly Yakuza game, the prequel for the series',
		'Long description with markdown support'
	);

	const adventure = new BingoCategory('Adventure');
	game.addItem(adventure);

	const general_group = new BingoGoalList('General');
	game.addItem(general_group);

	const talk_to_people = new BingoGoalList('Talk to people');
	adventure.addGoalList(talk_to_people);

	const goal_easy = new BingoGoal('Talk to people 50 times');
	talk_to_people.addGoal(goal_easy);
	goal_easy.addTag('Easy');

	const goal_normal = new BingoGoal('Talk to people 150 times');
	talk_to_people.addGoal(goal_normal);
	goal_normal.addTag('Normal');

	const goal_hard = new BingoGoal('Talk to people 300 times');
	talk_to_people.addGoal(goal_hard);
	goal_hard.addTag('Hard');

	const goal_general = new BingoGoal('Get $500');
	general_group.addGoal(goal_general);
	goal_general.addTag('Easy');

	// adventure.addChild(goal_easy);
	// talk_to_people.addChild(goal_normal);
	// something_else.addChild(goal_hard);

	// something_else.addChild(talk_to_people);


	// console.log(game);
	// const plain = Parser.to_json(game);
	// console.log('plain', plain);
	// const plain = instanceToPlain(game);
	// const text = JSON.stringify(plain);
	// console.log(text);

	// const parsed = Parser.from_json(JSON.stringify(plain));
	// console.log('parsed', parsed);
}

test();
