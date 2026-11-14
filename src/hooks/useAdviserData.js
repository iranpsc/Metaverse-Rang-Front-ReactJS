import { useCallback, useEffect, useRef, useState } from "react";
import useRequest from "./useRequest";

const MOBILE_QUERY = "(max-width: 1000px)";

const ADVISER_ROUTES = {
  "/settings/public": {
    urlRequest: "setting",
    adviserPage: "general-setting-desktop",
  },
  "/settings/account": {
    urlRequest: "setting",
    adviserPage: "account-setting-desktop",
  },
  "/profile/total": {
    urlRequest: "profile",
    adviserPage: "owner-specifications-desktop",
  },
  "/profile/property/houses": {
    urlRequest: "profile",
    adviserPage: "owner-property-feature-desktop",
  },
  "/profile/property/following": {
    urlRequest: "profile",
    adviserPage: "owner-property-feature-desktop",
  },
  "/profile/property/followers": {
    urlRequest: "profile",
    adviserPage: "owner-property-feature-desktop",
  },
  "/documents/write": {
    urlRequest: "sanad",
    adviserPage: "vod-send-desktop",
  },
  "/documents/notes": {
    urlRequest: "sanad",
    adviserPage: "vod-note-desktop",
  },
  "/report/send": {
    urlRequest: "reports",
    adviserPage: "reports-report-desktop",
  },
  "/verification/identity": {
    urlRequest: "kyc",
    adviserPage: "kyc-man-desktop",
  },
  "/verification/bank": {
    urlRequest: "kyc",
    adviserPage: "kyc-bank-desktop",
  },
  "/confirmation": {
    urlRequest: "account-security",
    adviserPage: "account-security-code-desktop",
    mobileAdviserPage: "account-security-code-mobile",
  },
  "/profile/dynasty/recieved": {
    urlRequest: "dynasty",
    adviserPage: "request-received-desktop",
  },
  "/profile/dynasty/send": {
    urlRequest: "dynasty",
    adviserPage: "submitted-request-desktop",
  },
  "/profile/dynasty/members": {
    urlRequest: "dynasty",
    adviserPage: "family-members-desktop",
  },
  "/profile/dynasty/establish": {
    urlRequest: "dynasty",
    adviserPage: "establishment-desktop",
  },
  "/notifications": {
    urlRequest: "notification",
    adviserPage: "notifications-desktop",
  },
  "/store/tools": {
    urlRequest: "shop",
    adviserPage: "shop-tools-desktop",
  },
  "/store/currency": {
    urlRequest: "shop",
    adviserPage: "shop-currency-desktop",
  },
  "/search/citizen": {
    urlRequest: "search",
    adviserPage: "citizen-desktop",
  },
};

const resolveAdviserRoute = (pathname = "", isMobile = false) => {
  const pathSegments = pathname.split("?")[0].split("/").filter(Boolean);
  const normalizedPath = `/${pathSegments.join("/")}`;
  const exactRoute = ADVISER_ROUTES[normalizedPath];
  if (exactRoute) {
    if (exactRoute.mobileAdviserPage) {
      return {
        ...exactRoute,
        adviserPage: isMobile
          ? exactRoute.mobileAdviserPage
          : exactRoute.adviserPage,
      };
    }
    return exactRoute;
  }

  if (normalizedPath.startsWith("/profile/property/")) {
    return ADVISER_ROUTES["/profile/property/houses"];
  }

  if (normalizedPath.startsWith("/store/tools/")) {
    return ADVISER_ROUTES["/store/tools"];
  }

  if (normalizedPath.startsWith("/store/currency/")) {
    return ADVISER_ROUTES["/store/currency"];
  }

  if (normalizedPath.startsWith("/feature/")) {
    return {
      urlRequest: "feature",
      adviserPage: "feature-offer-citizen-desktop",
    };
  }

  return null;
};

const useAdviserData = (pathname) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );
  const route = resolveAdviserRoute(pathname, isMobile);
  const requestKey = route ? `${route.urlRequest}/${route.adviserPage}` : null;
  const pendingRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event) => setIsMobile(event.matches);

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return useCallback(() => {
    if (!requestKey) return Promise.resolve(null);
    if (pendingRef.current?.key === requestKey)
      return pendingRef.current.promise;

    const promise = Request("video-tutorials", HTTP_METHOD.POST, {
      url: `tutorials/${requestKey}`,
    })
      .then(({ data }) => data.data) // آرایه‌ی ویدیوها: [{ id, title, video_url, image_url, ... }]
      .finally(() => {
        if (pendingRef.current?.promise === promise) pendingRef.current = null;
      });

    pendingRef.current = { key: requestKey, promise };
    return promise;
  }, [Request, HTTP_METHOD, requestKey]);
};

export default useAdviserData;
