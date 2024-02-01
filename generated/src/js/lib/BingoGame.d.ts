import BingoCategory from '@/js/lib/BingoCategory.ts';
import BingoGoal from '@/js/lib/BingoGoal.ts';
import BingoGoalList from '@/js/lib/BingoGoalList.ts';
import SuccessResponse from '@/js/lib/SuccessResponse.ts';
type BingoCategoryOrGoalList = BingoCategory | BingoGoalList;
export default class BingoGame {
    id: string;
    name: string;
    short_description: string;
    description: string;
    items: BingoCategoryOrGoalList[];
    generator: 'simple' | 'srl_v5' | 'srl_v8';
    is_local: boolean;
    constructor(id: string, name: string, short_description: string, description: string);
    addItem(group: BingoCategoryOrGoalList): SuccessResponse;
    removeItem(group: BingoCategoryOrGoalList): SuccessResponse;
    removeItemByName(name: string): SuccessResponse;
    getGoalsByTags(...tags: string[]): BingoGoal[];
}
export {};
