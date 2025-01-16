import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";

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
  // Function to check if a piece can be dragged
  const onPieceDragBegin = (piece: string, sourceSquare: Square) => {
    const pieceColor = piece[0];
    return pieceColor === userTurn;
  };

  return (
    <Chessboard
      position={position}
      onPieceDrop={onPieceDrop}
      boardOrientation={boardOrientation}
      boardWidth={boardWidth}
      onPieceDragBegin={onPieceDragBegin}
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
    />
  );
};

export default CustomChessboard;
