import { useContext } from "react";
import { ReportStateContext } from "../pages/Report/reports/GlobalReportStateProvider";

export const useReportsGlobalState = () => useContext(ReportStateContext);
