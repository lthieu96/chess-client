import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Game } from "@/types/game";

interface GameState {
  gameState: Game | null;
  setGameState: (gameState: Game) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>()(
  devtools(
    (set) => ({
      gameState: null,
      setGameState: (gameState) => set({ gameState }),
      reset: () => set({ gameState: null }),
    }),
    { name: "Game Store" }
  )
);
