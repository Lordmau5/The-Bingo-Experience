import BingoGame from '@/js/lib/BingoGame.ts';
import {
	plainToInstance, instanceToPlain
} from 'class-transformer';

export default class Parser {
	static from_json_raw(input: JSON): BingoGame {
		const game = plainToInstance(BingoGame, input);

		return game;
	}

	static from_json(input: string): BingoGame {
		const json: JSON = JSON.parse(input);
		const game = plainToInstance(BingoGame, json);

		return game;
	}

	static to_json(game: BingoGame): JSON {
		const json = instanceToPlain(game);

		return json as JSON;
	}

	static getCopy(game: BingoGame): BingoGame {
		const json: JSON = this.to_json(game);
		const copy = this.from_json_raw(json);

		return copy;
	}
}
