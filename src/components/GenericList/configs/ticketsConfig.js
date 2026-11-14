// کانفیگ لیست تیکت‌ها (VodRow) برای GenericList؛ شامل فیلتر وضعیت، سرچ و ستون‌های تیکت

import VodRow from "../../../pages/Documents/Tabs/DocsList/VodRow";
import { skeleton } from "./helpers";

const STATUS_OPTIONS = [
  { key: "confirmed", title: "1343" },
  { key: "pending", title: "1373" },
  { key: "failed", title: "1345" },
  { key: "read", title: "1346" },
];

export const ticketsConfig = {
  RowComponent: VodRow,
  getRowProps: (row, index, variant) => ({ variant }),
  // تشخیص خودکار وقتی type پاس داده نشده
  detect: (row) => row && "code" in row && "sender" in row,
  // مقدار(های) عددی status برای هر فیلتر؛ می‌تونه عدد یا آرایه باشه
  statusValues: { pending: 0, confirmed: 1, read: 4, failed: 5 },
  // فیلد متنی که سرچ روی اون انجام میشه
  searchKey: "title",
  columns: (variant) => [
    { title: "1339", skeleton: skeleton("60px") },
    { title: "1319", skeleton: skeleton("200px") },
    {
      title: variant === "sent" ? "1448" : "1340",
      skeleton: skeleton("200px"),
    },
    {
      title: "1341",
      filter: { stateKey: "status", options: STATUS_OPTIONS },
      skeleton: skeleton("80px"),
    },
    { title: "64", nowrap: true, skeleton: skeleton("120px") },
    { title: "1342", skeleton: skeleton("40px", "40px", "8px") },
  ],
};