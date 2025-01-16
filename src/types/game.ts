import { User } from "./user";

export type GameStatus = "waiting" | "active" | "completed";

export interface Game {
  id: number;
  status: GameStatus;
  fen: string;
  whitePlayerId: number | null;
  blackPlayerId: number | null;
  winner: number | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isPrivate: boolean;
  turn: "w" | "b";
  timeControl: number;
  increment: number;
  whiteTimeRemaining: number | null;
  blackTimeRemaining: number | null;
  lastMoveTime: Date | null;
  moves: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublishedGame extends Game {
  creator: User;
}

export interface Players {
  whitePlayer: User | null;
  blackPlayer: User | null;
}
