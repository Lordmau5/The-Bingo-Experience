import BingoGoal from '@/js/lib/BingoGoal.ts';
import BingoGoalList from '@/js/lib/BingoGoalList';
import SuccessResponse from '@/js/lib/SuccessResponse.ts';
import {
	Type
} from 'class-transformer';

export default class BingoCategory {
	name: string;

	description: string = '';

	@Type(() => BingoGoalList)
		goal_lists: BingoGoalList[] = [];

	constructor(name: string) {
		this.name = name;
	}

	hasGoalList(subgroup: BingoGoalList): boolean {
		return this.goal_lists.includes(subgroup);
	}

	addGoalList(subgroup: BingoGoalList): SuccessResponse {
		if (this.hasGoalList(subgroup)) {
			return SuccessResponse.error('Group already exists in goal lists');
		}

		this.goal_lists.push(subgroup);

		return SuccessResponse.success();
	}

	removeGoalList(subgroup: BingoGoalList): SuccessResponse {
		this.goal_lists = this.goal_lists.filter(sg => sg !== subgroup);

		return SuccessResponse.success();
	}

	getAllGoals(): BingoGoal[] {
		const goals: BingoGoal[] = [];

		this.goal_lists.map(subgroup => {
			goals.push(...subgroup.goals);
		});

		return goals;
	}
}
