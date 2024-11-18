"use client";
import { useParams } from "next/navigation";
import { useChessGame } from "@/hooks/useChessGame";
import { ChessBoard } from "@/components/ChessBoard";
import { GameInfo } from "@/components/GameInfo";

export function GameContent() {
  const params = useParams();
  const gameId = params.id as string;
  const { game, gameState, error, makeMove } = useChessGame(gameId);

  if (!game || !gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <ChessBoard fen={gameState.fen} onMove={makeMove} disabled={gameState.isGameOver} />
          </div>
          <div>
            <GameInfo gameState={gameState} gameId={game.id.toString()} />
            {error && <div className='mt-4 p-4 bg-red-100 text-red-700 rounded'>{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
