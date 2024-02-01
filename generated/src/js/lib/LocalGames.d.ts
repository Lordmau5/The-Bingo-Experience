import type BingoGame from '@/js/lib/BingoGame.ts';
export declare function getLocalGames(): Promise<Map<string, BingoGame>>;
export declare function getGameByID(id: string): Promise<BingoGame | undefined>;
export declare function saveGame(game: BingoGame): Promise<void>;
export declare function deleteGame(id: string): Promise<void>;
