"use client";

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardBody, Avatar, Progress, Button } from "@nextui-org/react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, AlignLeft } from "lucide-react";

interface Player {
  name: string;
  elo: number;
  avatarUrl: string;
  timeLeft: number; // in seconds
}

interface Move {
  san: string;
  color: "w" | "b";
}

export default function Game() {
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"w" | "b">("w");

  // Mock player data - replace with real data
  const [players, setPlayers] = useState<{ white: Player; black: Player }>({
    white: {
      name: "Player 1",
      elo: 1500,
      avatarUrl: "https://i.pravatar.cc/150?u=player1",
      timeLeft: 300, // 5 minutes
    },
    black: {
      name: "Player 2",
      elo: 1600,
      avatarUrl: "https://i.pravatar.cc/150?u=player2",
      timeLeft: 300,
    },
  });

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayers((prev) => ({
        ...prev,
        [currentPlayer === "w" ? "white" : "black"]: {
          ...prev[currentPlayer === "w" ? "white" : "black"],
          timeLeft: Math.max(0, prev[currentPlayer === "w" ? "white" : "black"].timeLeft - 1),
        },
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer]);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to queen for simplicity
      });

      if (move) {
        setGame(new Chess(game.fen()));
        setCurrentPlayer(game.turn());
        setMoves((prev) => [
          ...prev,
          {
            san: move.san,
            color: move.color,
          },
        ]);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className='min-h-screen bg-content1 p-8 flex items-center justify-center'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left column - Chess board */}
        <div className='lg:col-span-2 flex items-center justify-center'>
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            boardWidth={Math.min(600, typeof window !== "undefined" ? window.innerWidth - 40 : 600)}
          />
        </div>

        {/* Center column - Players info and move history */}
        <div className='lg:col-span-1 space-y-4'>
          {/* Black player info */}
          <Card>
            <CardBody>
              <div className='flex items-center space-x-4 mb-4'>
                <Avatar src={players.black.avatarUrl} size='lg' />
                <div className='flex-grow'>
                  <h3 className='text-lg font-semibold'>{players.black.name}</h3>
                  <p className='text-small text-default-500'>ELO: {players.black.elo}</p>
                </div>
                <div className='text-right'>
                  <span className='font-mono text-lg'>{formatTime(players.black.timeLeft)}</span>
                </div>
              </div>
              <Progress value={(players.black.timeLeft / 300) * 100} color='primary' className='h-2' />
            </CardBody>
          </Card>

          {/* Move history */}
          <Card>
            <CardBody>
              <div className='flex justify-between items-center mb-2 px-2'>
                <Button isIconOnly variant='light' className='text-default-500'>
                  <ChevronsLeft size={20} />
                </Button>
                <Button isIconOnly variant='light' className='text-default-500'>
                  <ChevronLeft size={20} />
                </Button>
                <Button isIconOnly variant='light' className='text-default-500'>
                  <ChevronRight size={20} />
                </Button>
                <Button isIconOnly variant='light' className='text-default-500'>
                  <ChevronsRight size={20} />
                </Button>
                <Button isIconOnly variant='light' className='text-default-500'>
                  <AlignLeft size={20} />
                </Button>
              </div>
              <div className='h-[300px] overflow-y-auto space-y-0'>
                {moves.map((move, index) => {
                  const moveNumber = Math.floor(index / 2) + 1;
                  const isWhiteMove = move.color === "w";

                  if (isWhiteMove) {
                    return (
                      <div key={index} className='flex text-sm hover:bg-[#2a2a2a] cursor-pointer'>
                        <span className='w-8 px-2 text-gray-500'>{moveNumber}</span>
                        <span className='w-16 px-2'>{move.san}</span>
                        <span className='w-16 px-2'></span>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className='flex text-sm hover:bg-[#2a2a2a] cursor-pointer'>
                        <span className='w-8 px-2 text-gray-500'>{moveNumber}</span>
                        <span className='w-16 px-2'>{moves[index - 1]?.san || ""}</span>
                        <span className='w-16 px-2'>{move.san}</span>
                      </div>
                    );
                  }
                })}
                {moves.length % 2 === 1 && (
                  <div className='flex text-sm hover:bg-[#2a2a2a] cursor-pointer'>
                    <span className='w-8 px-2 text-gray-500'>{Math.floor(moves.length / 2) + 1}</span>
                    <span className='w-16 px-2'>{moves[moves.length - 1].san}</span>
                    <span className='w-16 px-2'></span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* White player info */}
          <Card>
            <CardBody>
              <div className='flex items-center space-x-4 mb-4'>
                <Avatar src={players.white.avatarUrl} size='lg' />
                <div className='flex-grow'>
                  <h3 className='text-lg font-semibold'>{players.white.name}</h3>
                  <p className='text-small text-default-500'>ELO: {players.white.elo}</p>
                </div>
                <div className='text-right'>
                  <span className='font-mono text-lg'>{formatTime(players.white.timeLeft)}</span>
                </div>
              </div>
              <Progress value={(players.white.timeLeft / 300) * 100} color='primary' className='h-2' />
            </CardBody>
          </Card>
        </div>

        {/* Right column - Chat or additional features */}
      </div>
    </div>
  );
}
