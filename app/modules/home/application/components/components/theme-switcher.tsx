"use client";

import { useTheme } from "../../hooks/use-theme";

export const ThemeSwitcher = () => {
  const { changeTheme } = useTheme();

  return (
    <div className="flex gap-4 p-4 bg-os-surface border border-os-accent/20">
      <button
        onClick={() => changeTheme("default")}
        className="px-3 py-1 bg-[#182035] text-[#52d3d6] border"
      >
        Cyber Blue Mode
      </button>
      <button
        onClick={() => changeTheme("matrix")}
        className="px-3 py-1 bg-[#020502] text-[#00ff41] border border-[#00ff41]"
      >
        Matrix Mode
      </button>
      <button
        onClick={() => changeTheme("light")}
        className="px-3 py-1 bg-white text-gray-800 border shadow-sm"
      >
        Light Mode
      </button>
    </div>
  );
};
