"use client";
import { useEffect, useState } from "react";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";

function useClock() {
  const [display, setDisplay] = useState({ date: "", time: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setDisplay({ date, time });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return display;
}

export const Taskbar = () => {
  const { windows } = useWindowManager();
  const { date, time } = useClock();

  return (
    <footer
      style={{
        height: 50,
        borderTop: "1px solid var(--os-border)",
        background: "var(--os-surface)",
      }}
      className="relative flex items-center justify-between px-4 z-50 backdrop-blur-md shrink-0"
    >
      {/* Left: Start label + open window indicators (display-only) */}
      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
        <span
          className="text-xs font-bold tracking-wide shrink-0 hidden sm:inline"
          style={{ color: "var(--os-text-dim)" }}
        >
          Taskbar
        </span>

        {/* Open window tabs — purely informational, not clickable */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {windows.map((win) => (
            <div
              key={win.id}
              className="flex items-center gap-2 px-3 h-8 rounded-md text-[11px] tracking-wide shrink-0 select-none max-w-30 sm:max-w-45"
              style={{
                background: win.isMinimized
                  ? "transparent"
                  : "var(--os-accent-container)",
                border: win.isMinimized
                  ? "1px solid var(--os-border)"
                  : "1px solid transparent",
                color: win.isMinimized
                  ? "var(--os-text-dim)"
                  : "var(--os-on-accent-container)",
                opacity: win.isMinimized ? 0.6 : 1,
              }}
              title={win.fileNode.name}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: win.isMinimized
                    ? "var(--os-text-faint)"
                    : "var(--os-accent)",
                }}
              />
              <span className="truncate">{win.fileNode.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Clock */}
      <div
        className="flex items-center gap-3 sm:gap-4 text-xs font-medium tracking-wide shrink-0 ml-2 sm:ml-4"
        style={{ color: "var(--os-text-dim)" }}
      >
        <span className="opacity-80 hidden sm:inline">{date}</span>
        <span
          style={{ borderBottom: "1px solid var(--os-border-strong)", color: "var(--os-text)" }}
          className="leading-none pb-0.5 font-os-mono"
        >
          {time}
        </span>
      </div>
    </footer>
  );
};
