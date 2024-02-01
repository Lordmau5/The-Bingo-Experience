
import BingoCategory from '@/js/lib/BingoCategory.ts';
import BingoGoal from '@/js/lib/BingoGoal.ts';
import BingoGoalList from '@/js/lib/BingoGoalList.ts';
import SuccessResponse from '@/js/lib/SuccessResponse.ts';
import {
	stringCompare
} from '@/js/lib/Util.ts';
import {
	Transform, plainToInstance, type TransformFnParams, Exclude
} from 'class-transformer';

export type BingoCategoryOrGoalList = BingoCategory | BingoGoalList;

export default class BingoGame {
	id: string;

	name: string;

	short_description: string;

	description: string;

	// Funny conversion to allow for both BingoCategory and BingoGoalList
	@Transform((params: TransformFnParams) => {
		return params.value.map((value: any) => {
			if (value?.goal_lists) {
				return plainToInstance(BingoCategory, value);
			}
			else if (value?.goals) {
				return plainToInstance(BingoGoalList, value);
			}
		});
	})
		items: BingoCategoryOrGoalList[] = [];

	generator: 'simple' | 'srl_v5' | 'srl_v8' = 'simple';

	@Exclude()
		is_local: boolean = false;

	constructor(
		id: string,
		name: string,
		short_description: string,
		description: string
	) {
		this.id = id;
		this.name = name;
		this.short_description = short_description;
		this.description = description;
	}

	get reserved_names(): string[] {
		const names: string[] = [];

		this.items.map(group => {
			const goal_lists = group instanceof BingoGoalList ? [ group ] : group.goal_lists;

			goal_lists.map(subgroup => {
				subgroup.goals.map(goal => {
					if (goal.name) {
						names.push(goal.name);
					}
				});

				names.push(subgroup.name);
			});

			names.push(group.name);
		});

		return names;
	}

	addItem(group: BingoCategoryOrGoalList): SuccessResponse {
		const existingGroup = this.items.find(g => g === group);
		if (existingGroup) {
			return SuccessResponse.error('This group already exists');
		}
		else {
			this.items.push(group);

			return SuccessResponse.success();
		}
	}

	removeItem(group: BingoCategoryOrGoalList): SuccessResponse {
		if (group instanceof BingoGoalList) {
			if (group.goals.length) {
				return SuccessResponse.error('Cannot remove a group that has goals');
			}
		}
		else if (group instanceof BingoCategory) {
			if (group.goal_lists.length) {
				return SuccessResponse.error('Cannot remove a group that has goal lists');
			}
		}

		const filteredGroups = this.items.filter(g => g !== group);
		if (filteredGroups.length === this.items.length) {
			return SuccessResponse.error('Group not found');
		}
		else {
			this.items = filteredGroups;

			return SuccessResponse.success();
		}
	}

	removeItemByName(name: string): SuccessResponse {
		const group = this.items.find(
			g => stringCompare(g.name, name)
		);
		if (!group) {
			return SuccessResponse.error('Category not found');
		}

		return this.removeItem(group);
	}

	getAllTags(): string[] {
		const tags: string[] = [];

		this.items.map(group => {
			const goal_lists = group instanceof BingoGoalList ? [ group ] : group.goal_lists;

			goal_lists.map(subgroup => {
				subgroup.goals.map(goal => {
					goal.tags.map(tag => {
						if (!tags.includes(tag)) {
							tags.push(tag);
						}
					});
				});
			});
		});

		return tags;
	}

	getGoalsByTags(...tags: string[]): BingoGoal[] {
		const goals: BingoGoal[] = [];

		this.items.map(group => {
			const goal_lists = group instanceof BingoGoalList ? [ group ] : group.goal_lists;

			goal_lists.map(subgroup => {
				subgroup.goals.map(goal => {
					if (goal.tags.some(
						tag => tags.some(
							inputTag => stringCompare(tag, inputTag)
						)
					)) {
						goals.push(goal);
					}
				});
			});
		});

		return goals;
	}
}
