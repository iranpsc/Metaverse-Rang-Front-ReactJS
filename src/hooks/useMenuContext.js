import { useContext } from "react";
import { MenuContext } from "../services/reducers/MenuContext";

export const useMenuContext = () => useContext(MenuContext);
