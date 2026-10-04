/**
 * Socket.IO client for MetaRGB websocket-gateway.
 * Compatible with Socket.IO v4 / Engine.IO 4
 */

import { io } from "socket.io-client";
import { getItem } from "./Utility/LocalStorage";

const DEFAULT_URL = "http://localhost:3002";

let socket = null;

function resolveSocketURL() {
  const hostname = window.location.hostname;

  // Development server
  if (
    hostname === "dev-reactjs.metarang.com" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return "https://dev-ws.metarang.com";
  }

  // Production
  if (hostname === "world.metarang.com") {
    return "https://ws.metarang.com";
  }

  // Fallback
  return DEFAULT_URL;
}

function resolveToken() {
  const user = getItem("user");
  return user?.token || "";
}

function currentSocketToken(current) {
  return (
    current?.io?.opts?.auth?.token ||
    current?.io?.opts?.query?.token ||
    ""
  );
}

export function connectSocket(token = resolveToken()) {
  if (!token) {
    disconnectSocket();
    return null;
  }

  const url = resolveSocketURL();

  if (socket) {
    if (currentSocketToken(socket) === token && socket.connected) {
      return socket;
    }

    disconnectSocket();
  }

  socket = io(url, {
    path: "/socket.io/",
    transports: ["websocket", "polling"],

    auth: {
      token,
    },

    query: {
      token,
    },

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,

    forceNew: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });
  socket.on("connect_error", () => {
  });

  socket.on("disconnect", () => {
  });

  socket.on("connected", () => {
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

export function onSocketEvent(event, handler) {
  const current = socket || connectSocket();

  if (!current) {
    return () => { };
  }

  current.on(event, handler);

  return () => {
    current.off(event, handler);
  };
}