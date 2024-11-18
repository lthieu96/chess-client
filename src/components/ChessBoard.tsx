"use client";
import { FC } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

interface ChessBoardProps {
  fen: string;
  onMove: (move: string) => void;
  disabled?: boolean;
}

export const ChessBoard: FC<ChessBoardProps> = ({ fen, onMove, disabled }) => {
  const chess = new Chess(fen);

  const makeMove = (sourceSquare: string, targetSquare: string) => {
    if (disabled) return false;

    try {
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move) {
        onMove(`${sourceSquare}${targetSquare}`);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <div className='w-full max-w-[600px] aspect-square'>
      <Chessboard position={fen} onPieceDrop={(from, to) => makeMove(from, to)} boardWidth={600} />
    </div>
  );
};
