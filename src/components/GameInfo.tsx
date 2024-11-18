"use client";
import { FC } from "react";
import { GameState } from "@/types/game";

interface GameInfoProps {
  gameState: GameState;
  gameId: string;
}

export const GameInfo: FC<GameInfoProps> = ({ gameState, gameId }) => {
  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-xl font-bold mb-4'>Game Information</h2>
      <div className='space-y-2'>
        <p>Game ID: {gameId}</p>
        <p>Turn: {gameState.turn === "w" ? "White" : "Black"}</p>
        {gameState.isCheck && <p className='text-red-500'>Check!</p>}
        {gameState.isCheckmate && <p className='text-red-600'>Checkmate!</p>}
        {gameState.isDraw && <p className='text-yellow-600'>Draw!</p>}
        {gameState.isGameOver && <p className='text-blue-600'>Game Over</p>}
      </div>
    </div>
  );
};
