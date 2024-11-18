"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initializeSocket = () => {
  socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080");
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};
