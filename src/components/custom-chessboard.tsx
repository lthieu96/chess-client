import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { useEffect, useState } from "react";
import { getBoardSettings } from "@/services/boardSettings";

interface CustomChessboardProps {
  position: string;
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  boardOrientation: "white" | "black";
  boardWidth?: number;
  game: Chess;
  userTurn: "w" | "b";
}

const boardThemes = {
  classic: {
    light: "#f0d9b5",
    dark: "#b58863",
  },
  wood: {
    light: "#E8C99B",
    dark: "#957355",
  },
  blue: {
    light: "#DEE3E6",
    dark: "#788A9C",
  },
  green: {
    light: "#FFFFDD",
    dark: "#86A666",
  },
  dark: {
    light: "#7D8796",
    dark: "#3C4452",
  },
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
  const [boardSettings, setBoardSettings] = useState(getBoardSettings());

  useEffect(() => {
    const handleStorageChange = () => {
      setBoardSettings(getBoardSettings());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Function to check if a piece can be dragged
  const onPieceDragBegin = (piece: string, sourceSquare: Square) => {
    const pieceColor = piece[0];
    if (pieceColor === userTurn) {
      // Get possible moves for the piece
      const moves = game.moves({ square: sourceSquare, verbose: true });
      const newSquares: { [key: string]: { backgroundColor: string } } = {};

      // Highlight source square
      newSquares[sourceSquare] = { backgroundColor: "rgba(128, 128, 128, 0.4)" };

      // Highlight possible moves
      moves.forEach((move) => {
        newSquares[move.to] = { backgroundColor: "rgba(128, 128, 128, 0.6)" };
      });

      setMoveSquares(newSquares);
      return true;
    }
    return false;
  };

  const onPieceDragEnd = () => {
    setMoveSquares({});
  };

  const theme = boardThemes[boardSettings.theme as keyof typeof boardThemes] || boardThemes.classic;

  return (
    <Chessboard
      position={position}
      onPieceDrop={onPieceDrop}
      boardOrientation={boardOrientation}
      boardWidth={boardWidth}
      customDarkSquareStyle={{
        backgroundColor: theme.dark,
      }}
      customLightSquareStyle={{
        backgroundColor: theme.light,
      }}
      customSquareStyles={moveSquares}
      onPieceDragBegin={onPieceDragBegin}
      onPieceDragEnd={onPieceDragEnd}
      showBoardNotation={boardSettings.showCoordinates}
    />
  );
};

export default CustomChessboard;
