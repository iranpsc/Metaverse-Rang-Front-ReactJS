import { createContext, useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../../theme/theme";

export const ThemeContext = createContext();
export function ThemeProviderContext({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("app_theme", newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  const themeMode = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={themeMode}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}