import BingoGame from '@/js/lib/BingoGame.ts';
export declare const useRemoteGamesStore: import("pinia").StoreDefinition<"remoteGames", {
    games: BingoGame[];
}, {}, {
    fetchRemoteGames(): Promise<void>;
}>;
