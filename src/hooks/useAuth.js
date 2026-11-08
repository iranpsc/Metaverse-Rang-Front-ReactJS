// هوک احراز هویت؛ در هر کامپوننتی که به ورود/خروج، خواندن کاربر یا بارگذاری نشست (پروفایل + کیف پول) نیاز دارد استفاده می‌شود.
import { useCallback, useContext } from "react";
import {
  AddUserAction,
  DeleteUserAction,
} from "../services/actions/UserContextAction";
import { UserContext } from "../services/reducers/UserContext";
import {
  WalletContext,
  WalletContextTypes,
} from "../services/reducers/WalletContext";
import { getItem, removeItem, setItem } from "../services/Utility/LocalStorage";
import useRequest from "./useRequest";
import { connectSocket, connectPublicSocket } from "../services/socket";

const USER_KEY = "user";
let centralRedirectPromise = null;

export default function useAuth() {
  const [userState, setUserState] = useContext(UserContext);
  const [, setWallet] = useContext(WalletContext);
  const { Request, HTTP_METHOD } = useRequest();

  const logout = useCallback(() => {
    removeItem(USER_KEY);
    // قطع نکن؛ به حالت public برگرد تا فیچرهای نقشه کار کنند
    connectPublicSocket();
    setUserState(DeleteUserAction());
    setWallet({ type: WalletContextTypes.DELETE_WALLET });
  }, [setUserState, setWallet]);

  // خواندن خالص و بدون عوارض جانبی؛ پس صدا زدنش در رندر امن است
  const getStoredUser = useCallback(() => {
    const user = getItem(USER_KEY);
    return (
      typeof user?.token === "string" &&
      user.token.length > 0 &&
      Number.isFinite(user.expire) &&
      user.expire > Date.now()
    )
      ? user
      : null;
  }, []);

  const isLoggedIn = useCallback(() => !!getStoredUser(), [getStoredUser]);

  // پروفایل و کیف پول را با توکن ذخیره‌شده می‌گیرد و در context می‌گذارد
  const loadSession = useCallback(
    async ({ token }) => {
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [profile, wallet] = await Promise.all([
          Request("auth/me", HTTP_METHOD.POST, {}, headers),
          Request("user/wallet", HTTP_METHOD.GET, {}, headers),
        ]);

        // اگر وسط درخواست خروج زده شده یا توکن عوض شده، نشست قدیمی را برنگردان
        const storedUser = getItem(USER_KEY);
        if (storedUser?.token !== token) return;
        if (
          !Number.isFinite(storedUser.expire) ||
          storedUser.expire <= Date.now()
        ) {
          logout();
          return;
        }

        connectSocket(token);
        setUserState(AddUserAction(profile.data.data));
        setWallet({
          type: WalletContextTypes.ADD_WALLET,
          payload: wallet.data.data,
        });
      } catch (error) {
        if (error?.response?.status === 401) logout();
        throw error;
      }
    },
    [Request, HTTP_METHOD, logout, setUserState, setWallet],
  );

  // ورود با توکن تازه؛ automatic_logout بر حسب دقیقه است
  const setUser = useCallback(
    async ({ token, automatic_logout }) => {
      if (typeof token !== "string" || token.trim().length === 0) {
        throw new Error("Authentication token is missing");
      }

      const expiryValue = String(automatic_logout ?? "").trim();
      if (!expiryValue) {
        throw new Error("Authentication expiration is missing");
      }

      const numericExpiry = Number(expiryValue);
      let expire;

      if (Number.isFinite(numericExpiry) && numericExpiry >= 0) {
        if (numericExpiry === 0) {
          expire = Date.now() + 60 * 1000;
        } else if (numericExpiry > 1e12) {
          expire = numericExpiry;
        } else if (numericExpiry > 1e9) {
          expire = numericExpiry * 1000;
        } else {
          expire = Date.now() + numericExpiry * 60 * 1000;
        }
      } else {
        expire = Date.parse(expiryValue);
      }

      if (!Number.isSafeInteger(expire)) {
        throw new Error("Invalid authentication expiration");
      }
      if (expire <= Date.now()) {
        throw new Error("Authentication token has expired");
      }

      setItem(USER_KEY, { token, expire });
      await loadSession({ token });
    },
    [loadSession],
  );

  // بازیابی نشست از توکن ذخیره‌شده (موقع بالا آمدن اپ)
  const setUserWithToken = useCallback(async () => {
    const user = getStoredUser();

    if (user) await loadSession(user);
    else if (getItem(USER_KEY)) logout(); // توکن منقضی یا خراب
  }, [getStoredUser, loadSession, logout]);

  const getUser = useCallback(() => userState, [userState]);

  const redirectToCentral = useCallback(async () => {
    if (!centralRedirectPromise) {
      centralRedirectPromise = (async () => {
        const redirectTo = encodeURIComponent(window.location.origin);
        const response = await Request(
          `auth/redirect?redirect_to=${redirectTo}`,
          HTTP_METHOD.GET,
          {},
          {},
          { showError: false },
        );
        const url = response?.data?.url;

        if (typeof url !== "string" || url.length === 0) {
          throw new Error("Authentication redirect URL is missing");
        }

        window.location.href = url;
      })();
    }

    try {
      await centralRedirectPromise;
    } finally {
      centralRedirectPromise = null;
    }
  }, [Request, HTTP_METHOD]);

  return {
    setUser,
    setUserWithToken,
    isLoggedIn,
    getUser,
    logout,
    redirectToCentral,
  };
}
