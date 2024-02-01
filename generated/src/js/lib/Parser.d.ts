import BingoGame from '@/js/lib/BingoGame.ts';
export default class Parser {
    static from_json(input: string): BingoGame;
    static to_json(game: BingoGame): Record<string, any>;
}
