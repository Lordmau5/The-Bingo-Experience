import SuccessResponse from '@/js/lib/SuccessResponse.js';
export default class BingoGoal {
    name: string;
    tags: string[];
    possible_spaces: number[];
    constructor(name: string);
    addTag(tag: string): SuccessResponse;
    removeTag(tag: string): SuccessResponse;
}
