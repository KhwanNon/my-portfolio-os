import { useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState("default");

  const changeTheme = (themeName: "default" | "matrix" | "light") => {
    setTheme(themeName);
    const root = window.document.documentElement; // เข้าถึงแท็ก <html>

    if (themeName === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", themeName);
    }
  };

  return { theme, changeTheme };
};
