// کانفیگ لیست درخواست‌های ارسالی/دریافتی سلسله (RequestRow) برای GenericList

import RequestRow from "../../../pages/Profile/Tabs/dynasty/components/RequestRow";
import { skeleton } from "./helpers";

export const requestsConfig = {
  RowComponent: RequestRow,
  minHeight: "400px",
  // type ردیف همان variant است (sent یا received)
  getRowProps: (row, index, variant) => ({ type: variant }),
  // سربرگ ستون اول بر اساس variant عوض می‌شود
  columns: (variant) => [
    {
      title: variant === "sent" ? "1448" : "1447",
      skeleton: skeleton("100px"),
    },
    { title: "850", skeleton: skeleton("120px") },
    {
      title: "145",
      skeleton: skeleton("80px"),
      filter: {
        stateKey: "member",
        options: [
          { key: "child", title: "129" },
          { key: "wife", title: "825" },
          { key: "sister", title: "127" },
          { key: "brother", title: "128" },
          { key: "father", title: "125" },
          { key: "mother", title: "126" },
        ],
      },
    },
    {
      title: "146",
      skeleton: skeleton("80px"),
      filter: {
        stateKey: "status",
        options: [
          { key: "confirmed", title: "854" },
          { key: "pending", title: "852" },
          { key: "failed", title: "853" },
        ],
      },
    },
    { title: "851", skeleton: skeleton("100px") },
    { title: "147", skeleton: skeleton("40px", "40px", "8px") },
  ],
};