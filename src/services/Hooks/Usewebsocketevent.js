// src/hooks/useWebsocketEvent.js
import { useEffect, useRef } from "react";
import { onSocketEvent } from "../services/socket";

/**
 * Listen to a websocket event for the lifetime of a component.
 * The latest handler is always used, so no deps array is needed.
 *
 * @param {string} event
 * @param {(payload: any) => void} handler
 */
export function useWebsocketEvent(event, handler) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return onSocketEvent(event, (payload) => handlerRef.current(payload));
  }, [event]);
}
