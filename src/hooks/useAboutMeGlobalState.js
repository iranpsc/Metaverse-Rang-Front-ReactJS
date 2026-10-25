import { useContext } from "react";
import { AboutStateContext } from "../pages/Settings/Tabs/aboutme-tab/aboutGlobalStateProvider";

export const useGlobalState = () => useContext(AboutStateContext);
