"use client";

import { useState, useEffect, useMemo } from "react";
import { Chess, Square } from "chess.js";
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
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios-client";
import { useGameStore } from "@/stores/gameStore";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";
import CustomChessboard from "@/components/custom-chessboard";

export default function Game() {
  const params = useParams();
  const router = useRouter();
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
  const [whiteTime, setWhiteTime] = useState<number | null>(null);
  const [blackTime, setBlackTime] = useState<number | null>(null);
  const [moved, setMoved] = useState(false);
  const [showDrawOfferModal, setShowDrawOfferModal] = useState(false);
  const [isDrawOffered, setIsDrawOffered] = useState(false);

  useEffect(() => {
    if (players && user) {
      setIsPlayingBlack(players.blackPlayer?.id == user.id);
    }
  }, [players, user]);

  useEffect(() => {
    if (gameState) {
      setWhiteTime(gameState.whiteTimeRemaining);
      setBlackTime(gameState.blackTimeRemaining);
    }
  }, [gameState]);

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
          setWhiteTime(gameState.whiteTimeRemaining);
          setBlackTime(gameState.blackTimeRemaining);
          setMoved(gameState.moves.length > 0);
        });

        gameSocket.onGameOver(() => {
          setShowGameEndModal(true);
        });

        gameSocket.onTimeUpdate((data) => {});

        gameSocket.onDrawOffered((data) => {
          if (data.offeredBy !== user?.id) {
            setShowDrawOfferModal(true);
            setIsDrawOffered(true);
          }
        });

        gameSocket.onDrawDeclined((data) => {
          setIsDrawOffered(false);
          setShowDrawOfferModal(false);
          toast.error("Draw offer declined");
        });

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

  useEffect(() => {
    if (!gameState || gameState.status !== "active" || !moved) return;

    const interval = setInterval(() => {
      if (gameState.turn === "w") {
        setWhiteTime((prev) => {
          if (prev !== null) {
            const newTime = Math.max(0, prev - 1);
            if (newTime === 0) gameSocket.checkTime();
            return newTime;
          }
          return null;
        });
      } else {
        setBlackTime((prev) => {
          if (prev !== null) {
            const newTime = Math.max(0, prev - 1);
            if (newTime === 0) gameSocket.checkTime();
            return newTime;
          }
          return null;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.turn, gameState?.status, moved]);

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    // Check if the piece on sourceSquare belongs to the current player
    console.log(game.get(sourceSquare));
    const piece = game.get(sourceSquare);
    if (!piece || piece.color !== (isPlayingBlack ? "b" : "w")) {
      console.log("Not your piece");
      return false;
    }

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
      setIsDrawOffered(true);
      toast.success("Draw offered to opponent");
    } catch (error) {
      console.error("Error offering draw:", error);
      toast.error("Failed to offer draw");
    }
  };

  const handleDrawResponse = async (accept: boolean) => {
    try {
      await gameSocket.respondToDraw(accept);
      setShowDrawOfferModal(false);
      setIsDrawOffered(false);
      if (!accept) {
        toast.success("Draw offer declined");
      }
    } catch (error) {
      console.error("Error responding to draw:", error);
      toast.error("Failed to respond to draw offer");
    }
  };

  const formatTime = (ms: number | null) => {
    if (ms === null) return "--:--";
    const totalSeconds = Math.floor(ms);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoadingPlayers) {
    return <FullPageLoading />;
  }

  if (!players) {
    return <div>Players not found</div>;
  }

  return (
    <div className='container mx-auto p-4 max-w-5xl '>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 flex justify-center lg:block'>
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
                <div className='text-2xl font-mono'>{formatTime(isPlayingBlack ? whiteTime : blackTime)}</div>
              </div>

              {/* Chessboard */}
              <div className='md:aspect-square'>
                <CustomChessboard
                  position={game?.fen()}
                  onPieceDrop={onDrop}
                  boardOrientation={isPlayingBlack ? "black" : "white"}
                  boardWidth={600}
                  game={game}
                  userTurn={isPlayingBlack ? "b" : "w"}
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
                <div className='text-2xl font-mono'>{formatTime(isPlayingBlack ? blackTime : whiteTime)}</div>
              </div>

              {/* Game controls */}
              <div className='flex gap-2 mt-4 justify-end'>
                <Button
                  color='danger'
                  variant='flat'
                  onPress={handleResign}
                  isDisabled={!gameState || gameState.status !== "active"}
                >
                  Resign
                </Button>
                <Button
                  color='primary'
                  variant='flat'
                  onPress={handleDrawOffer}
                  isDisabled={!gameState || gameState.status !== "active"}
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
                {gameState?.moves.split(",").map((move, index) => (
                  <div key={index} className='py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800'>
                    {Math.floor(index / 2) + 1}. {index % 2 === 0 ? move : `... ${move}`}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Game End Modal */}
      <Modal isOpen={showGameEndModal} placement='center' onClose={() => setShowGameEndModal(true)} closeButton={null}>
        <ModalContent>
          <ModalHeader className='text-center'>Game Over</ModalHeader>
          <ModalBody>
            <div className='text-center'>
              <p className='text-xl font-semibold mb-2'>
                {gameState?.isDraw && "It's a Draw!"}
                {!gameState?.isDraw && gameState?.winner == user?.id && "You Won!"}
                {!gameState?.isDraw && gameState?.winner != user?.id && "You Lost!"}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color='primary'
              onPress={() => {
                router.push("/");
              }}
            >
              Back to Home
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Draw Offer Modal */}
      <Modal isOpen={showDrawOfferModal} onClose={() => setShowDrawOfferModal(false)}>
        <ModalContent>
          <ModalHeader className='text-center'>Draw Offer</ModalHeader>
          <ModalBody>
            <p className='text-center'>Your opponent has offered a draw. Do you accept?</p>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={() => handleDrawResponse(false)}>
              Decline
            </Button>
            <Button color='primary' onPress={() => handleDrawResponse(true)}>
              Accept
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
