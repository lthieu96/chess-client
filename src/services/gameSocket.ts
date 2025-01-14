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

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/games`, {
      auth: { token },
      withCredentials: false,
      transports: ["websocket", "polling"],
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to game server");
    });

    this.socket.on("error", (error: string) => {
      console.error("Socket error:", error);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from game server");
    });
  }

  // Join a game
  public joinGame(gameId: string): Promise<Game> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket not initialized"));
        return;
      }

      this.gameId = gameId;
      this.socket.emit("joinGame", { gameId }, (response: { error?: string; data?: Game }) => {
        if (response.error) {
          reject(new Error(response.error));
        } else if (response.data) {
          console.log(response);
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
    this.socket?.disconnect();
    this.socket = null;
    this.gameId = null;
  }
}

export const gameSocket = GameSocket.getInstance();
