/**
 * Socket.IO client for the MetaRGB websocket-gateway.
 * Socket.IO v4 / Engine.IO 4 (socket.io-client@4.x).
 *
 * - Works BEFORE login (public rooms: feature-status, user-status)
 * - Upgrades to authenticated after login (adds private room user:{id})
 * - Event handlers registered via onSocketEvent survive reconnects and
 *   token changes (public -> authenticated -> public)
 */
import { io } from "socket.io-client";
import { getItem } from "./Utility/LocalStorage";

const DEFAULT_URL = "http://localhost:3002";

let socket = null;

const handlers = new Map();

function resolveSocketURL() {
  const envUrl =
    import.meta.env?.VITE_WEBSOCKET_URL || import.meta.env?.VITE_SOCKET_URL;
  if (envUrl) return envUrl;

  const hostname = window.location.hostname;

  if (
    hostname === "dev-reactjs.metarang.com" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return "https://dev-ws.metarang.com";
  }

  if (hostname === "world.metarang.com") {
    return "https://ws.metarang.com";
  }

  return DEFAULT_URL;
}

function resolveToken() {
  const user = getItem("user");
  return user?.token || "";
}

function currentSocketToken(current) {
  return (
    current?.io?.opts?.auth?.token || current?.io?.opts?.query?.token || ""
  );
}

function attachHandlers(sock) {
  handlers.forEach((set, event) => {
    set.forEach((handler) => sock.on(event, handler));
  });
}

/**
 * Connect (or reuse) the shared socket.
 * token = "" -> public mode. token = "<sanctum>" -> authenticated mode.
 * Without arguments, uses the token stored in localStorage (if any).
 */
export function connectSocket(token = resolveToken()) {
  const nextToken = token || "";

  if (socket && currentSocketToken(socket) === nextToken) {
    return socket;
  }

  if (socket) {
    disconnectSocket();
  }

  const options = {
    path: "/socket.io/",
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    forceNew: true,
  };

  if (nextToken) {
    options.auth = { token: nextToken };
    options.query = { token: nextToken };
  }

  const sock = io(resolveSocketURL(), options);
  socket = sock;

  sock.on("connect", () => {
    console.log("[socket] connected");
  });

  sock.on("connect_error", (err) => {
    if (nextToken && /unauthorized/i.test(err?.message || "")) {
      connectSocket("");
    }
  });

  attachHandlers(sock);

  return sock;
}

/** Reconnect without auth (public channels only). Use on logout. */
export function connectPublicSocket() {
  return connectSocket("");
}

export function getSocket() {
  return socket;
}

/** Tear down the connection. Registered handlers are kept for the next connect. */
export function disconnectSocket() {
  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

/**
 * Register a listener. Returns an unsubscribe function for useEffect cleanup.
 * Does NOT open a connection by itself: App / useAuth own the connection.
 * If a socket already exists the handler is attached immediately; otherwise
 * it is attached as soon as connectSocket creates one.
 */
export function onSocketEvent(event, handler) {
  if (!handlers.has(event)) handlers.set(event, new Set());
  handlers.get(event).add(handler);

  socket?.on(event, handler);

  return () => {
    handlers.get(event)?.delete(handler);
    socket?.off(event, handler);
  };
}