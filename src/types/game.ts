export interface Game {
  id: number;
  status: string;
  fen: string;
  whitePlayerId?: string;
  blackPlayerId?: string;
}

export interface GameState {
  fen: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  turn: "w" | "b";
}
