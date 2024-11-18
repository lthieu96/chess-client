"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { GameState } from "@/types/game";
import { gameApi } from "@/lib/api";

export const useChessGame = (gameId?: string) => {
  const queryClient = useQueryClient();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string>("");

  const { data: game } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => gameApi.get(gameId!),
    enabled: !!gameId,
  });

  const createGameMutation = useMutation({
    mutationFn: gameApi.create,
    onSuccess: (newGame) => {
      queryClient.setQueryData(["game", newGame.id], newGame);
    },
  });

  useEffect(() => {
    const socket = getSocket();

    socket.on("gameState", (state: GameState) => {
      setGameState(state);
    });

    socket.on("error", (errorMessage: string) => {
      setError(errorMessage);
    });

    if (gameId) {
      socket.emit("joinGame", gameId);
    }

    return () => {
      socket.off("gameState");
      socket.off("error");
    };
  }, [gameId]);

  const makeMove = useCallback(
    (move: string) => {
      if (!gameId) return;
      const socket = getSocket();
      socket.emit("move", { gameId, move });
    },
    [gameId]
  );

  return {
    game,
    gameState,
    error,
    createGame: createGameMutation.mutate,
    isCreating: createGameMutation.isPending,
    makeMove,
  };
};
