// useDynastySidebarItems.js
// آیتم‌های سایدبار سلسله؛ عنوان اولین آیتم با dynastyStatus (از localStorage و event) عوض می‌شود

import { useEffect, useMemo, useState } from "react";

const DYNASTY_ITEMS = [
  { to: "members", title: "112" },
  { to: "send", title: "113" },
  { to: "recieved", title: "114" },
];

export const useDynastySidebarItems = () => {
  const [status, setStatus] = useState(() =>
    localStorage.getItem("dynastyStatus"),
  );

  useEffect(() => {
    const handler = (event) => setStatus(event.detail);

    window.addEventListener("dynastyStatusUpdated", handler);
    return () => window.removeEventListener("dynastyStatusUpdated", handler);
  }, []);

  return useMemo(
    () => [
      {
        to: "establish",
        title: status === "has" ? "819" : "807",
        activeSegments: ["estate"],
      },
      ...DYNASTY_ITEMS,
    ],
    [status],
  );
};