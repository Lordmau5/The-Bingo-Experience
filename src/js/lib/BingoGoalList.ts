import BingoGoal from '@/js/lib/BingoGoal.ts';
import {
	Type
} from 'class-transformer';

export default class BingoGoalList {
	name: string;

	description: string = '';

	@Type(() => BingoGoal)
		goals: BingoGoal[] = [];

	constructor(name: string) {
		this.name = name;
	}

	addGoal(goal: BingoGoal): void {
		if (!this.goals.includes(goal))
			this.goals.push(goal);
	}

	removeGoal(goal: BingoGoal): void {
		this.goals = this.goals.filter(g => g !== goal);
	}
}
