"use client";

import { useState, useEffect, useMemo } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { gameSocket } from "@/services/gameSocket";
import { useQuery } from "@tanstack/react-query";
import { type Game, Players } from "@/types/game";
import FullPageLoading from "@/app/_components/fullpage-loading";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios-client";
import { useGameStore } from "@/stores/gameStore";
import { useAuth } from "@/providers/AuthProvider";

export default function Game() {
  const params = useParams();
  const game = useMemo(() => new Chess(), []);
  const { gameState, setGameState } = useGameStore();
  const { user } = useAuth();
  const {
    data: players,
    isLoading: isLoadingPlayers,
    refetch: refetchPlayers,
  } = useQuery({
    queryKey: ["game", params.id],
    queryFn: () => axiosInstance.get<Players>(`/games/${params.id}/players`).then((res) => res.data),
    enabled: !!params.id,
  });

  const [isPlayingBlack, setIsPlayingBlack] = useState(false);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [gameResult, setGameResult] = useState<string>("");

  useEffect(() => {
    if (players && user) {
      setIsPlayingBlack(players.blackPlayer?.id == user.id);
    }
  }, [players, user]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // Connect socket first
    gameSocket
      .connect(token)
      .then(() => {
        console.log("Socket connected, setting up game events...");

        // Setup event listeners
        gameSocket.onGameState((gameState) => {
          console.log("Received game state:", gameState);
          refetchPlayers();
          if (gameState.fen !== game.fen()) game.load(gameState.fen);
          setGameState(gameState);
        });

        gameSocket.onGameOver((data) => {
          setGameResult(data.result);
          setShowGameEndModal(true);
        });

        gameSocket.onTimeUpdate((data) => {});

        gameSocket.onDrawOffered(() => {});

        // Then initialize game
        if (params.id) {
          gameSocket.initGame(params.id as string).catch((error) => {
            console.error("Failed to initialize game:", error);
          });
        }
      })
      .catch((error) => {
        console.error("Failed to connect socket:", error);
      });

    return () => {
      gameSocket.disconnect();
    };
  }, [params.id, setGameState, game, refetchPlayers]);

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    gameSocket.makeMove(move.san);
    return true;
  };

  const handleResign = async () => {
    try {
      await gameSocket.resignGame();
    } catch (error) {
      console.error("Error resigning game:", error);
    }
  };

  const handleDrawOffer = async () => {
    try {
      await gameSocket.offerDraw();
    } catch (error) {
      console.error("Error offering draw:", error);
    }
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoadingPlayers) {
    return <FullPageLoading />;
  }

  if (!players) {
    return <div>Players not found</div>;
  }

  console.log("Current game state:", game.fen());

  return (
    <div className='container mx-auto p-4 max-w-5xl'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2'>
          <Card>
            <CardBody>
              {/* Top player info */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Avatar
                    name={
                      isPlayingBlack ? players.whitePlayer?.username : players.blackPlayer?.username || "Waiting..."
                    }
                  />
                  <span>
                    {isPlayingBlack
                      ? players.whitePlayer?.username
                      : players.blackPlayer?.username || "Waiting for player..."}
                  </span>
                </div>
                <div className='text-2xl font-mono'>
                  {formatTime(isPlayingBlack ? gameState?.whiteTimeRemaining : gameState?.blackTimeRemaining)}
                </div>
              </div>

              {/* Chessboard */}
              <div className='aspect-square'>
                <Chessboard
                  position={game?.fen()}
                  onPieceDrop={onDrop}
                  boardOrientation={isPlayingBlack ? "black" : "white"}
                />
              </div>

              {/* Bottom player info */}
              <div className='flex items-center justify-between mt-4'>
                <div className='flex items-center gap-2'>
                  <Avatar
                    name={
                      isPlayingBlack ? players.blackPlayer?.username : players.whitePlayer?.username || "Waiting..."
                    }
                  />
                  <span>
                    {isPlayingBlack
                      ? players.blackPlayer?.username
                      : players.whitePlayer?.username || "Waiting for player..."}
                  </span>
                </div>
                <div className='text-2xl font-mono'>
                  {formatTime(isPlayingBlack ? gameState?.blackTimeRemaining : gameState?.whiteTimeRemaining)}
                </div>
              </div>

              {/* Game controls */}
              <div className='flex gap-2 mt-4 justify-end'>
                <Button
                  color='danger'
                  variant='flat'
                  onPress={handleResign}
                  disabled={!gameState || gameState.status !== "playing"}
                >
                  Resign
                </Button>
                <Button
                  color='primary'
                  variant='flat'
                  onPress={handleDrawOffer}
                  disabled={!gameState || gameState.status !== "playing"}
                >
                  Offer Draw
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Move history and game info */}
        <div>
          <Card>
            <CardBody>
              <h3 className='text-lg font-semibold mb-2'>Move History</h3>
              <div className='h-[400px] overflow-y-auto'>
                {/* {moveHistory.map((move, index) => (
                  <div key={index} className='py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800'>
                    {Math.floor(index / 2) + 1}. {index % 2 === 0 ? move : `... ${move}`}
                  </div>
                ))} */}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Game End Modal */}
      <Modal isOpen={showGameEndModal} onClose={() => setShowGameEndModal(false)}>
        <ModalContent>
          <ModalHeader>Game Over</ModalHeader>
          <ModalBody>
            <p>{gameResult}</p>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onPress={() => setShowGameEndModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
