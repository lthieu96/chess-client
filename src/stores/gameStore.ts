import { create } from "zustand";
import { Game } from "@/types/game";

interface GameState {
  gameState: Game | null;
  setGameState: (gameState: Game) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameState: null,
  setGameState: (gameState) => set({ gameState }),
  reset: () => set({ gameState: null }),
}));
