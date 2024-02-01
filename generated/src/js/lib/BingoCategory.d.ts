import BingoGoal from '@/js/lib/BingoGoal.ts';
import BingoGoalList from '@/js/lib/BingoGoalList';
import SuccessResponse from '@/js/lib/SuccessResponse.ts';
export default class BingoCategory {
    name: string;
    goal_lists: BingoGoalList[];
    constructor(name: string);
    hasGoalList(subgroup: BingoGoalList): boolean;
    addGoalList(subgroup: BingoGoalList): SuccessResponse;
    removeGoalList(subgroup: BingoGoalList): SuccessResponse;
    getAllGoals(): BingoGoal[];
}
