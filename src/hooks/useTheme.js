import { useContext } from "react";
import { ThemeContext } from "../services/reducers/ThemeContext";

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProviderContext");
  }
  return context;
}
