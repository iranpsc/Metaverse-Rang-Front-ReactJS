// کانفیگ لیست گزارش خطاها (ReportRow) برای GenericList؛ فیلتر نوع خطا و ستون‌های گزارش

import ReportRow from "../../../pages/Report/reports/ReportsListTab/ReportRow";
import { skeleton } from "./helpers";

export const reportsConfig = {
  RowComponent: ReportRow,
  minHeight: "300px",
  columns: [
    { title: "1383", nowrap: true, width: "0%", skeleton: skeleton("40px") },
    { title: "19", width: "40%", skeleton: skeleton("200px") },
    {
      title: "746",
      nowrap: true,
      width: "12%",
      align: "center",
      skeleton: skeleton("100px"),
      filter: {
        stateKey: "member",
        options: [
          { key: "displayError", title: "1385" },
          { key: "spellingError", title: "15" },
          { key: "codingError", title: "16" },
          { key: "FPSError", title: "17" },
          { key: "disrespect", title: "18" },
        ],
      },
    },
    { title: "64", nowrap: true, width: "16%", skeleton: skeleton("120px") },
    {
      title: "1380",
      nowrap: true,
      width: "10%",
      skeleton: skeleton("40px", "40px", "6px"),
    },
  ],
};