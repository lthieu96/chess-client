import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { useState } from "react";

interface CustomChessboardProps {
  position: string;
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  boardOrientation: "white" | "black";
  boardWidth?: number;
  game: Chess;
  userTurn: "w" | "b";
}

const customSquareStyles = {
  light: "#f0d9b5",
  dark: "#b58863",
};

const CustomChessboard = ({
  position,
  onPieceDrop,
  boardOrientation,
  boardWidth = 600,
  game,
  userTurn,
}: CustomChessboardProps) => {
  const [moveSquares, setMoveSquares] = useState<{ [key: string]: { backgroundColor: string } }>({});

  // Function to check if a piece can be dragged
  const onPieceDragBegin = (piece: string, sourceSquare: Square) => {
    const pieceColor = piece[0];
    if (pieceColor === userTurn) {
      // Get possible moves for the piece
      const moves = game.moves({ square: sourceSquare, verbose: true });
      const newSquares: { [key: string]: { backgroundColor: string } } = {};

      // Highlight source square
      newSquares[sourceSquare] = { backgroundColor: "rgba(255, 255, 0, 0.4)" };

      // Highlight possible moves
      moves.forEach((move) => {
        newSquares[move.to] = { backgroundColor: "rgba(0, 255, 0, 0.6)" };
      });

      setMoveSquares(newSquares);
      return true;
    }
    return false;
  };

  const onPieceDragEnd = () => {
    setMoveSquares({});
  };

  return (
    <Chessboard
      position={position}
      onPieceDrop={onPieceDrop}
      boardOrientation={boardOrientation}
      boardWidth={boardWidth}
      onPieceDragBegin={onPieceDragBegin}
      onPieceDragEnd={onPieceDragEnd}
      customBoardStyle={{
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      customDarkSquareStyle={{
        backgroundColor: customSquareStyles.dark,
      }}
      customLightSquareStyle={{
        backgroundColor: customSquareStyles.light,
      }}
      customSquareStyles={moveSquares}
    />
  );
};

export default CustomChessboard;
