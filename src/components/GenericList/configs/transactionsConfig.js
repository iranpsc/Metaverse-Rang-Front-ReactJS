// کانفیگ لیست تراکنش‌ها (TransactionRow) برای GenericList؛ فیلتر و صفحه‌بندی سمت سرور

import TransactionRow from "../../../pages/Profile/Tabs/transactions-tab/TransactionRow";
import { COLOR_CONFIG } from "../../../services/constants/colorConfig";
import { skeleton } from "./helpers";

const gif = (key) => COLOR_CONFIG[key].gif;

export const transactionsConfig = {
  RowComponent: TransactionRow,
  // فیلتر و صفحه‌بندی سمت سرور انجام می‌شود، پس فیلتر و slice محلی غیرفعال است
  serverSide: true,
  getRowProps: (row, index) => ({
    paymentReturned:
      sessionStorage.getItem("payment_returned") === "true" && index === 0,
  }),
  columns: [
    { title: "63", skeleton: skeleton() },
    { title: "64", width: "235px", skeleton: skeleton("150px") },
    {
      title: "65",
      skeleton: skeleton("80px"),
      filter: {
        stateKey: "status",
        options: [
          { key: "success", title: "741", variant: "success" },
          { key: "pending", title: "743", variant: "pending" },
          { key: "failed", title: "742", variant: "failed" },
        ],
      },
    },
    {
      title: "746",
      width: "140px",
      skeleton: skeleton("80px"),
      filter: {
        stateKey: "title",
        options: [
          { key: "property_buy", title: "739" },
          { key: "property_dealing", title: "740" },
        ],
      },
    },
    {
      title: "750",
      width: "165px",
      skeleton: skeleton("80px"),
      filter: {
        stateKey: "subject",
        options: [
          { key: "blue", title: "753", icon: gif("blue") },
          { key: "red", title: "754", icon: gif("red") },
          { key: "yellow", title: "755", icon: gif("yellow") },
          { key: "rial", title: "756", icon: gif("irr") },
          { key: "psc", title: "757", icon: gif("psc") },
        ],
      },
    },
    { title: "66", skeleton: skeleton() },
    { title: "67", skeleton: skeleton("40px", "40px", "8px") },
  ],
};
