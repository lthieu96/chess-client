"use client";

import { Game } from "@/types/game";
import { io, Socket } from "socket.io-client";

export class GameSocket {
  private socket: Socket | null = null;
  private gameId: string | null = null;
  private static instance: GameSocket | null = null;

  private constructor() {}

  static getInstance(): GameSocket {
    if (!GameSocket.instance) {
      GameSocket.instance = new GameSocket();
    }
    return GameSocket.instance;
  }

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        console.log("Socket already connected, reusing connection");
        resolve();
        return;
      }

      console.log("Creating new socket connection...");
      this.socket = io(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/games`, {
        auth: { token },
        withCredentials: false,
        transports: ["websocket", "polling"],
        reconnection: true,
      });

      this.socket.on("connect", () => {
        console.log("Connected to game server, socket id:", this.socket?.id);
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        reject(error);
      });

      this.setupListeners();
    });
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on("error", (error: string) => {
      console.error("Socket error:", error);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from game server, reason:", reason);
    });
  }

  // Join a game
  public joinGame(gameId: string): Promise<Game> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket not initialized"));
        return;
      }

      if (!this.socket.connected) {
        console.error("Socket connection status:", {
          socket: !!this.socket,
          connected: this.socket?.connected,
          id: this.socket?.id,
        });
        reject(new Error("Socket not connected"));
        return;
      }

      console.log("Emitting joinGame event with gameId:", gameId);
      this.gameId = gameId;

      this.socket.emit("joinGame", { gameId: parseInt(gameId, 10) }, (response: { error?: string; data?: Game }) => {
        console.log("Received joinGame response:", response);

        if (response.error) {
          reject(new Error(response.error));
        } else if (response.data) {
          resolve(response.data);
        } else {
          reject(new Error("Invalid response from server"));
        }
      });
    });
  }

  // Make a move
  public makeMove(move: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error("Socket not initialized or game not joined"));
        return;
      }

      this.socket.emit("move", { gameId: this.gameId, move }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
    });
  }

  // Resign game
  public resignGame(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error("Socket not initialized or game not joined"));
        return;
      }

      this.socket.emit("resign", { gameId: this.gameId }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
    });
  }

  // Offer draw
  public offerDraw(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error("Socket not initialized or game not joined"));
        return;
      }

      this.socket.emit("offerDraw", { gameId: this.gameId }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
    });
  }

  // Check time
  public checkTime(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error("Socket not initialized or game not joined"));
        return;
      }

      this.socket.emit("checkTime", { gameId: this.gameId }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
    });
  }

  // Respond to draw offer
  public respondToDraw(accept: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error("Socket not initialized or game not joined"));
        return;
      }

      this.socket.emit("respondToDraw", { gameId: this.gameId, accept }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
    });
  }

  // Send chat message
  public sendChatMessage(message: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error("Socket not initialized or game not joined"));
        return;
      }

      this.socket.emit("chatMessage", { gameId: this.gameId, message }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
    });
  }

  // Initialize game connection
  public async initGame(gameId: string): Promise<Game> {
    try {
      if (!this.socket?.connected) {
        throw new Error("Socket not connected. Please connect first.");
      }

      console.log("Joining game...");
      const game = await this.joinGame(gameId);
      return game;
    } catch (error) {
      console.error("Failed to initialize game:", error);
      throw error;
    }
  }

  // Add event listeners
  public onGameState(callback: (gameState: any) => void) {
    this.socket?.on("gameState", callback);
  }

  public onGameOver(callback: (data: any) => void) {
    this.socket?.on("gameOver", callback);
  }

  public onDrawOffered(callback: (data: any) => void) {
    this.socket?.on("drawOffered", callback);
  }

  public onDrawDeclined(callback: (data: any) => void) {
    this.socket?.on("drawDeclined", callback);
  }

  public onChatMessage(callback: (data: any) => void) {
    this.socket?.on("chatMessage", callback);
  }

  public onTimeUpdate(callback: (data: any) => void) {
    this.socket?.on("timeUpdate", callback);
  }

  // Cleanup
  public disconnect() {
    if (this.socket?.connected) {
      this.socket.close();
    }
    this.socket = null;
    this.gameId = null;
  }
}

export const gameSocket = GameSocket.getInstance();
