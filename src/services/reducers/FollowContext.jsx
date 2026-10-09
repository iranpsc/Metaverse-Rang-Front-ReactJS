import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {  onSocketEvent } from "../socket"; 
export const FollowContext = createContext({
  onlineMap: {},
  isOnline: () => false,
  mergeOnline: () => {},
});

export default function FollowProvider({ children }) {
  const [onlineMap, setOnlineMap] = useState({});

  useEffect(() => {

    const unsubscribe = onSocketEvent("user-status-changed", (payload) => {

      const eventData = payload?.data ?? payload;
      if (eventData?.user_id == null) return;

      setOnlineMap((prev) => ({
        ...prev,
        [String(eventData.user_id)]: !!eventData.online,
      }));
    });

    return unsubscribe;
  }, []);

  const isOnline = useCallback(
    (userId) => onlineMap[String(userId)] ?? false,
    [onlineMap],
  );

  const mergeOnline = useCallback((map) => {
    setOnlineMap((prev) => ({ ...map, ...prev }));
  }, []);

  const value = useMemo(
    () => ({ onlineMap, isOnline, mergeOnline }),
    [onlineMap, isOnline, mergeOnline],
  );

  return (
    <FollowContext.Provider value={value}>{children}</FollowContext.Provider>
  );
}

export const useFollow = () => useContext(FollowContext);
