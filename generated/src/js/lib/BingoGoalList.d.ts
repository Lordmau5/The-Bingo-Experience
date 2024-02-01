import BingoGoal from '@/js/lib/BingoGoal.ts';
export default class BingoGoalList {
    name: string;
    goals: BingoGoal[];
    constructor(name: string);
    addGoal(goal: BingoGoal): void;
    removeGoal(goal: BingoGoal): void;
}
