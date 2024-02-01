
import SuccessResponse from '@/js/lib/SuccessResponse.js';
import {
	stringCompare
} from '@/js/lib/Util.ts';

export default class BingoGoal {
	name: string;

	description: string = '';

	tags: string[] = [];

	possible_spaces: number[] = [];

	constructor(name: string) {
		this.name = name;
	}

	addTag(tag: string): SuccessResponse {
		if (this.tags.some(
			existingTag => stringCompare(existingTag, tag)
		)) {
			return SuccessResponse.error('Tag already exists');
		}
		else {
			this.tags.push(tag);

			return SuccessResponse.success();
		}
	}

	removeTag(tag: string): SuccessResponse {
		if (!this.tags.some(
			existingTag => stringCompare(existingTag, tag)
		)) {
			return SuccessResponse.error('Tag doesn\'t exist');
		}
		else {
			this.tags = this.tags.filter(
				existingTag => !stringCompare(existingTag, tag)
			);

			return SuccessResponse.success();
		}
	}
}
