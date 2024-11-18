"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChessGame } from "@/hooks/useChessGame";
import { Button, Input } from "@nextui-org/react";

export function HomeContent() {
  const router = useRouter();
  const [gameId, setGameId] = useState("");
  const { createGame, isCreating } = useChessGame();

  const handleCreateGame = async () => {
    createGame(undefined, {
      onSuccess: (game) => {
        router.push(`/game/${game.id}`);
      },
    });
  };

  const handleJoinGame = () => {
    if (gameId) {
      router.push(`/game/${gameId}`);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg space-y-6'>
        <h1 className='text-3xl font-bold text-center'>Chess Game</h1>

        <div className='space-y-4 w-[300px]'>
          <Button onClick={handleCreateGame} isLoading={isCreating} fullWidth color='primary'>
            {isCreating ? "Creating..." : "Create New Game"}
          </Button>

          <div className='space-y-2'>
            <Input type='text' value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder='Enter Game ID' />
            <Button onClick={handleJoinGame} isLoading={isCreating} fullWidth color='success'>
              {isCreating ? "Joining..." : "Join Game"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
