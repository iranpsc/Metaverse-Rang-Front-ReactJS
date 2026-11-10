// fallbackMessage این تابع عملیات کچ خطا را هم هندل میکند و نیازی به نوشتن کچ ارور نیست فقط اگر نیاز به پاس دادن متن دستی داشتید از
import axios from "axios";
import { getItem } from "../services/Utility/LocalStorage";
import { ToastError, getTranslation } from "../services/Utility";
import { UserContext } from "../services/reducers/UserContext";
import { useCallback, useContext, useMemo, useRef } from "react";

import { useLocation } from "react-router";
import { useAccountSecurity } from "../services/reducers/accountSecurityContext";
const isProduction = window.location.hostname === "world.metarang.com";
const PROD_BASE_URL = "https://api.metarang.com/api/";
const DEV_BASE_URL = "https://dev-api.metarang.com/api/";
export const BASE_URL = isProduction ? PROD_BASE_URL : DEV_BASE_URL;

export default function useRequest() {
  const accountSecurity = getItem("account_security")?.account_security;
  const [userInfo] = useContext(UserContext);
  const location = useLocation();
  const accountSecurityContext = useAccountSecurity();
  const setIsAccountSecurityOpen =
    accountSecurityContext?.setIsAccountSecurityOpen;
const lastErrorRef = useRef(null);
  const openAccountSecurity = useCallback(() => {
    if (location.pathname === "/confirmation" || !setIsAccountSecurityOpen)
      return;

    setIsAccountSecurityOpen(true);
  }, [location.pathname, setIsAccountSecurityOpen]);

  const HTTP_METHOD = useMemo(
    () => ({
      GET: "GET",
      POST: "POST",
      PUT: "PUT",
      DELETE: "DELETE",
      PATCH: "PATCH",
    }),
    [],
  );

  const checkSecurity = useCallback(() => {
    if (userInfo?.wallet_login) {
      return true;
    }

    if (!accountSecurity) {
      ToastError(getTranslation("1603"));
      openAccountSecurity();
      return false;
    }

    return true;
  }, [
    accountSecurity,
    openAccountSecurity,
    userInfo?.wallet_login,
  ]);

  const Request = useCallback(
    async (
      directory,
      method = "GET",
      formData = {},
      customHeader = {},
      { showError = true, fallbackMessage } = {},
    ) => {
      const user = getItem("user");
      const finalURL = BASE_URL + directory;
      const headers = {
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        ...customHeader,
      };
      if (!Number.isFinite(user?.expire) || user.expire <= Date.now()) {
        delete headers.Authorization;
      }

      try {
        return await axios.request({
          url: finalURL,
          method,
          headers,
          data: method !== HTTP_METHOD.GET ? formData : {},
        });
      }
      
    catch (error) {
  if (error.response?.status === 401 && headers.Authorization) {
    window.dispatchEvent(new Event("auth:unauthorized"));
  } else {
    let message = null;

    if (error.response?.status === 410) {
      message = getTranslation("1603");
      openAccountSecurity();
    } else if (showError) {
      message =
        error.response?.data?.message ||
        fallbackMessage ||
        getTranslation(1387);
    }

    if (message) {
      const errorKey = `${error.response?.status || "network"}-${message}`;

      if (lastErrorRef.current !== errorKey) {
        ToastError(message);
        lastErrorRef.current = errorKey;
      }
    }
  }

  throw error;
}
    },
    [HTTP_METHOD, openAccountSecurity],
  );
  return useMemo(
    () => ({ Request, HTTP_METHOD, checkSecurity }),
    [Request, HTTP_METHOD, checkSecurity],
  );
}
