import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as Sentry from "@sentry/react";
const pathname = window.location.pathname;

if (pathname === "/payment/verify") {
  sessionStorage.setItem("payment_returned", "true");
}
Sentry.init({
  dsn: "https://ea9adb4ff192f7933a75aeae2d1c4ee6@sentry.irpsc.com/10",
  sendDefaultPii: true,
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
