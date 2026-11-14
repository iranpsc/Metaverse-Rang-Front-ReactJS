import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth.js";
import { getItem } from "../services/Utility/LocalStorage";
import { getTranslation, ToastError } from "../services/Utility/index.jsx";
const USER_KEY = "user";
const MAX_TIMEOUT = 2 ** 31 - 1;

const extractLoginParams = () => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  const expiresAt = url.searchParams.get("expires_at");

  url.searchParams.delete("token");
  url.searchParams.delete("expires_at");
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );

  if (!token || !expiresAt) return null;

  return { token, automatic_logout: expiresAt };
};

const loginParams = extractLoginParams();

const AuthMiddleware = ({ children }) => {
  const navigate = useNavigate();
  const {
    setUserWithToken,
    setUser,
    getUser,
    logout,
  } = useAuth();
  const initializationPromise = useRef(null);
  const expiring = useRef(false);
  const loginInProgress = useRef(Boolean(loginParams));

  useEffect(() => {
    let timer;
    let active = true;

    const expireSession = () => {
      if (!active || expiring.current) return;
      expiring.current = true;
      logout();
      navigate("/", { replace: true });
      ToastError(getTranslation(1948));
    };

    const scheduleExpiration = () => {
      window.clearTimeout(timer);
      if (!active || loginInProgress.current) return;
      const user = getItem(USER_KEY);

      if (!user?.token) return;
      if (!Number.isFinite(user.expire)) {
        expireSession();
        return;
      }

      const remaining = user.expire - Date.now();
      if (remaining <= 0) {
        expireSession();
        return;
      }

      expiring.current = false;
      timer = window.setTimeout(
        scheduleExpiration,
        Math.min(remaining, MAX_TIMEOUT),
      );
    };

    const handleStorage = (event) => {
      if (event.key !== USER_KEY) return;
      const user = getItem(USER_KEY);

      if (!user?.token) {
        window.clearTimeout(timer);
        if (getUser()?.id) logout();
        return;
      }

      scheduleExpiration();
      if (Number.isFinite(user.expire) && user.expire > Date.now()) {
        setUserWithToken().catch((error) => {
          console.error("Could not restore the updated session:", error);
        });
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") scheduleExpiration();
    };

    const handleUnauthorized = () => expireSession();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    document.addEventListener("visibilitychange", handleVisibility);
    scheduleExpiration();

    if (!initializationPromise.current) {
      const initializeSession = async () => {
        if (loginParams) {
          try {
            const sessionPromise = setUser(loginParams);
            loginInProgress.current = false;
            scheduleExpiration();
            await sessionPromise;
          } catch (error) {
            console.error("Could not initialize the login session:", error);
            logout();
          } finally {
            loginInProgress.current = false;
          }
          return;
        }

        try {
          await setUserWithToken();
        } catch (error) {
          console.error("Could not restore the login session:", error);
        }
      };

      initializationPromise.current = initializeSession();
    }

    initializationPromise.current
      .then(() => {
        scheduleExpiration();
      })
      .catch((error) => {
        console.error("Could not initialize the login session:", error);
      });

    return () => {
      active = false;
      window.clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [
    getUser,
    logout,
    navigate,
    setUser,
    setUserWithToken,
  ]);

  return children;
};

export default AuthMiddleware;