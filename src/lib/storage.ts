// Local storage replacement for Firebase
import { generateBingoCard } from "./bingo";
import { CSSProperties } from "react";

// Types
export interface GameData {
  id: string;
  hostName: string;
  status: "lobby" | "playing" | "finished";
  createdAt: Date;
  calledPrompts?: string[];
  availablePrompts?: string[];
  winner?: string | null;
  bingoCallers?: string[];
}

export interface Player {
  id: string;
  name: string;
  isHost?: boolean;
  card?: string[];
}

export interface Note {
  id: string;
  type: "wish" | "worry";
  text: string;
  author: string;
  authorTitle: string;
  createdAt: Date;
  style?: CSSProperties;
}

export interface WishWorryBoard {
  id: string;
  notes: Note[];
}

// Storage keys
const GAMES_KEY = "bingo_games";
const PLAYERS_KEY = "bingo_players";
const BOARDS_KEY = "wish_worry_boards";

// Game storage functions
export const gameStorage = {
  // Get all games
  getGames: (): Record<string, GameData> => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem(GAMES_KEY);
    return stored ? JSON.parse(stored) : {};
  },

  // Get specific game
  getGame: (gameId: string): GameData | null => {
    const games = gameStorage.getGames();
    return games[gameId] || null;
  },

  // Save game
  saveGame: (gameData: GameData): void => {
    if (typeof window === "undefined") return;
    const games = gameStorage.getGames();
    games[gameData.id] = gameData;
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));

    // Trigger storage event for real-time updates
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: GAMES_KEY,
        newValue: JSON.stringify(games),
      })
    );
  },

  // Update game
  updateGame: (gameId: string, updates: Partial<GameData>): void => {
    const game = gameStorage.getGame(gameId);
    if (game) {
      const updatedGame = { ...game, ...updates };
      gameStorage.saveGame(updatedGame);
    }
  },

  // Subscribe to game changes
  subscribeToGame: (
    gameId: string,
    callback: (game: GameData | null) => void
  ): (() => void) => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === GAMES_KEY) {
        const game = gameStorage.getGame(gameId);
        callback(game);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen to custom events for same-window updates
    const handleCustomEvent = () => {
      const game = gameStorage.getGame(gameId);
      callback(game);
    };

    window.addEventListener("storage", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage", handleCustomEvent);
    };
  },
};

// Player storage functions
export const playerStorage = {
  // Get players for a game
  getPlayers: (gameId: string): Record<string, Player> => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem(`${PLAYERS_KEY}_${gameId}`);
    return stored ? JSON.parse(stored) : {};
  },

  // Get specific player
  getPlayer: (gameId: string, playerName: string): Player | null => {
    const players = playerStorage.getPlayers(gameId);
    return players[playerName] || null;
  },

  // Save player
  savePlayer: (gameId: string, player: Player): void => {
    if (typeof window === "undefined") return;
    const players = playerStorage.getPlayers(gameId);
    players[player.name] = player;
    const key = `${PLAYERS_KEY}_${gameId}`;
    localStorage.setItem(key, JSON.stringify(players));

    // Trigger storage event
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(players),
      })
    );
  },

  // Subscribe to player changes
  subscribeToPlayers: (
    gameId: string,
    callback: (players: Player[]) => void
  ): (() => void) => {
    const key = `${PLAYERS_KEY}_${gameId}`;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        const players = Object.values(playerStorage.getPlayers(gameId));
        callback(players);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  },
};

// Wish-Worry board storage functions
export const boardStorage = {
  // Get board
  getBoard: (boardId: string): WishWorryBoard => {
    if (typeof window === "undefined") return { id: boardId, notes: [] };
    const stored = localStorage.getItem(`${BOARDS_KEY}_${boardId}`);
    return stored ? JSON.parse(stored) : { id: boardId, notes: [] };
  },

  // Add note to board
  addNote: (boardId: string, note: Omit<Note, "id" | "createdAt">): Note => {
    const board = boardStorage.getBoard(boardId);
    const newNote: Note = {
      ...note,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
    };

    board.notes.push(newNote);
    boardStorage.saveBoard(board);
    return newNote;
  },

  // Save board
  saveBoard: (board: WishWorryBoard): void => {
    if (typeof window === "undefined") return;
    const key = `${BOARDS_KEY}_${board.id}`;
    localStorage.setItem(key, JSON.stringify(board));

    // Trigger storage event
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(board),
      })
    );
  },

  // Subscribe to board changes
  subscribeToBoard: (
    boardId: string,
    callback: (notes: Note[]) => void
  ): (() => void) => {
    const key = `${BOARDS_KEY}_${boardId}`;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        const board = boardStorage.getBoard(boardId);
        callback(board.notes);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  },
};

// Utility functions to generate IDs
export const generateGameId = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const generatePlayerId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
