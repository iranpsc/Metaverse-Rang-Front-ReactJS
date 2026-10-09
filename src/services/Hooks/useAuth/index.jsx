import { useContext, useCallback } from "react";

import {
  AddUserAction,
  DeleteUserAction,
} from "../../actions/UserContextAction";

import { UserContext } from "../../reducers/UserContext";

import {
  WalletContext,
  WalletContextTypes,
} from "../../reducers/WalletContext";

import {
  getItem,
  removeItem,
  setItem,
} from "../../Utility/LocalStorage";

import useRequest from "../useRequest";
import {
  connectSocket,
  connectPublicSocket,
} from "../../socket";

export default function useAuth() {
  const [userState, setUserState] = useContext(UserContext);
  const [, setWallet] = useContext(WalletContext);

  const { Request, HTTP_METHOD } = useRequest();

  const logout = useCallback(() => {
    removeItem("user");

    // قطع نکن؛ به حالت public برگرد تا فیچرهای نقشه کار کنند
    connectPublicSocket();

    setUserState(DeleteUserAction());

    setWallet({
      type: WalletContextTypes.DELETE_WALLET,
    });
  }, [setUserState, setWallet]);
  const getStoredUser = useCallback(() => {
    const user = getItem("user");

    if (!user) return null;

    if (!user.token || user.expire <= Date.now()) {
      logout();
      return null;
    }

    return user;
  }, [logout]);

  const isLoggedIn = useCallback(() => {
    return !!getStoredUser();
  }, [getStoredUser]);

  const setUser = useCallback(
    async (response) => {
      const expire =
        Date.now() +
        Number(response.automatic_logout) * 60 * 1000;

      setItem("user", {
        token: response.token,
        expire,
      });

      connectSocket(response.token);

      try {
        const headers = {
          Authorization: `Bearer ${response.token}`,
        };

        const [walletResponse, profileResponse] =
          await Promise.all([
            Request(
              "user/wallet",
              HTTP_METHOD.GET,
              {},
              headers
            ),
            Request(
              "auth/me",
              HTTP_METHOD.POST,
              {},
              headers
            ),
          ]);

        setWallet({
          type: WalletContextTypes.ADD_WALLET,
          payload: walletResponse.data.data,
        });

        setUserState(
          AddUserAction(profileResponse.data.data)
        );
      } catch {
        logout();
      }
    },
    [
      Request,
      HTTP_METHOD,
      logout,
      setUserState,
      setWallet,
    ]
  );

  const setUserWithToken = useCallback(async () => {
    const user = getStoredUser();

    if (!user) return;

    connectSocket(user.token);

    try {
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      const [profileResponse, walletResponse] =
        await Promise.all([
          Request(
            "auth/me",
            HTTP_METHOD.POST,
            {},
            headers
          ),
          Request(
            "user/wallet",
            HTTP_METHOD.GET,
            {},
            headers
          ),
        ]);

      setUserState(
        AddUserAction(profileResponse.data.data)
      );

      setWallet({
        type: WalletContextTypes.ADD_WALLET,
        payload: walletResponse.data.data,
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        logout();
      }
    }
  }, [
    Request,
    HTTP_METHOD,
    getStoredUser,
    logout,
    setUserState,
    setWallet,
  ]);

  const getUser = useCallback(
    () => userState,
    [userState]
  );

  return {
    setUser,
    setUserWithToken,
    isLoggedIn,
    getUser,
    logout,
  };
}