import { useEffect } from "react";
import useAuth from "../hooks/useAuth.js";
import useRequest from "../hooks/useRequest.js";

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const { Request, HTTP_METHOD } = useRequest();

  useEffect(() => {
    const redirectToAuth = async () => {
      try {
        const response = await Request(
          `auth/redirect?redirect_to=${window.location.origin}`,
          HTTP_METHOD.GET
        );

        const url = response?.data?.url;

        if (url) {
          window.location.replace(url);
        } else {
          console.error("No redirect URL found");
        }
      } catch (error) {
        console.error("Auth redirect failed:", error);
      }
    };

    if (!isLoggedIn()) {
      redirectToAuth();
    }
  }, []);

  if (!isLoggedIn()) {
    return null;
  }

  return children;
}