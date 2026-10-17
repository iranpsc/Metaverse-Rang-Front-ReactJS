import { useNavigate } from "react-router";
import axios from "axios";
import { getItem } from "../../Utility/LocalStorage";
import { ToastError, getTranslation } from "../../Utility";
import { UserContext } from "../../reducers/UserContext";
import { useCallback, useContext, useMemo } from "react";

const isProduction = window.location.hostname === "world.metarang.com";
const PROD_BASE_URL = "https://api.metarang.com/api/";
const DEV_BASE_URL = "https://dev-api.metarang.com/api/";
export const BASE_URL = isProduction ? PROD_BASE_URL : DEV_BASE_URL;

export default function useRequest() {
  const navigate = useNavigate();
  const accountSecurity = getItem("account_security")?.account_security;
  const [userInfo] = useContext(UserContext);

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
      navigate("/confirmation", {
        state: {
          from: window.location.pathname,
        },
      });
      return false;
    }

    return true;
  }, [accountSecurity, navigate, userInfo?.wallet_login]);

  const Request = useCallback(
    (directory, method = "GET", formData = {}, customHeader = {}) => {
      const user = getItem("user");
      const finalURL = BASE_URL + directory;
      const headers = {
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        ...customHeader,
      };

      return axios
        .request({
          url: finalURL,
          method,
          headers,
          data: method !== HTTP_METHOD.GET ? formData : {},
        })
        .then((response) => response)
        .catch((error) => {
          if (error.response?.status === 410) {
            ToastError(getTranslation("1603"));
          }

          throw error;
        });
    },
    [HTTP_METHOD],
  );

  return useMemo(
    () => ({ Request, HTTP_METHOD, checkSecurity }),
    [Request, HTTP_METHOD, checkSecurity],
  );
}
