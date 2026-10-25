// The following function is a custom hook that returns adviser data based on the location state or string passed in.
// It uses another custom hook called "useRequest" to make an HTTP request to an API.
import { useState, useEffect } from "react";
import useRequest from "./useRequest";

const useAdviserData = (newStr, locationState) => {
  // Here we are initializing two state variables using hooks: "adviserData".
  const [adviserData, setAdviserData] = useState({});
  // We are also extracting "Request" and "HTTP_METHOD" from "useRequest".
  const { Request, HTTP_METHOD } = useRequest();
  // We define a mapping object that maps page IDs to corresponding URLs and adviser pages.

  const pageMappings = {
    // Each key-value pair represents a page ID and its corresponding URL and adviser page.
    "settings-1": {
      urlRequest: "setting",
      adviserPage: "general-setting-desktop",
    },
    "settings-2": {
      urlRequest: "setting",
      adviserPage: "account-setting-desktop",
    },
    "profile-1": {
      urlRequest: "profile",
      adviserPage: "owner-specifications-desktop",
    },
    "profile-2": {
      urlRequest: "profile",
      adviserPage: "owner-property-feature-desktop",
    },
    "login-": { urlRequest: "login", adviserPage: "login-desktop" },
    "signup-": { urlRequest: "register", adviserPage: "register-desktop" },
    "store-1": { urlRequest: "shop", adviserPage: "shop-tools-desktop" },
    "store-2": { urlRequest: "shop", adviserPage: "shop-currency-desktop" },
    "sanad-1": { urlRequest: "sanad", adviserPage: "vod-send-desktop" },
    "sanad-2": { urlRequest: "sanad", adviserPage: "vod-note-desktop" },
    "report-1": {
      urlRequest: "reports",
      adviserPage: "reports-report-desktop",
    },
    "verification-1": { urlRequest: "kyc", adviserPage: "kyc-man-desktop" },
    "verification-2": {
      urlRequest: "kyc",
      adviserPage: "kyc-attachment-desktop",
    },
    "verification-3": { urlRequest: "kyc", adviserPage: "kyc-bank-desktop" },
    "confirmation-": {
      urlRequest: "account-security",
      adviserPage: "account-security-code-desktop",
    },
    "dynasty-1": {
      urlRequest: "dynasty",
      adviserPage: "request-received-desktop",
    },
    "dynasty-2": {
      urlRequest: "dynasty",
      adviserPage: "submitted-request-desktop",
    },
    "dynasty-3": {
      urlRequest: "dynasty",
      adviserPage: "family-members-desktop",
    },
    "dynasty-4": {
      urlRequest: "dynasty",
      adviserPage: "establishment-desktop",
    },
    "notifications-": {
      urlRequest: "notification",
      adviserPage: "notifications-desktop",
    },
  };

  // We use the location state or string passed in to retrieve the corresponding URL and adviser page from "pageMappings".
  const { urlRequest, adviserPage } =
    pageMappings[locationState || newStr] || {};
  // In this effect hook, we make an HTTP POST request to retrieve the adviser data based on the retrieved URL and adviser page.
  useEffect(() => {
    if (!urlRequest || !adviserPage) return; // If either "urlRequest" or "adviserPage" is null, return.

    Request("video-tutorials", HTTP_METHOD.POST, {
      url: `tutorials/${urlRequest}/${adviserPage}`,
    }).then((response) => {
      setAdviserData(response.data.data); // Finally, we update the "adviserData" state variable with the retrieved data.
    });
  }, [urlRequest, adviserPage]);

  // This function returns the current adviser data.
  return adviserData;
};

export default useAdviserData;
