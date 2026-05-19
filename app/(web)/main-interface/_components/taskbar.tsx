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
        borderTop: "1px solid rgba(82,211,214,0.2)",
        background: "var(--os-surface)",
      }}
      className="relative flex items-center justify-between px-4 z-50 backdrop-blur-md shrink-0"
    >
      {/* Left: Start label + open window indicators (display-only) */}
      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
        <span
          className="text-xs font-black tracking-[0.4em] shrink-0 hidden sm:inline"
          style={{ color: "var(--os-accent)" }}
        >
          Taskbar
        </span>

        {/* Open window tabs — purely informational, not clickable */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {windows.map((win) => (
            <div
              key={win.id}
              className="flex items-center gap-2 px-3 h-8 rounded-sm text-[10px] tracking-widest shrink-0 select-none max-w-30 sm:max-w-45"
              style={{
                background: win.isMinimized
                  ? "rgba(82,211,214,0.06)"
                  : "rgba(82,211,214,0.15)",
                border: win.isMinimized
                  ? "1px solid rgba(82,211,214,0.15)"
                  : "1px solid rgba(82,211,214,0.35)",
                color: "var(--os-accent)",
                opacity: win.isMinimized ? 0.55 : 1,
              }}
              title={win.fileNode.name}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: win.isMinimized
                    ? "rgba(82,211,214,0.3)"
                    : "var(--os-accent)",
                  boxShadow: win.isMinimized
                    ? "none"
                    : "0 0 6px rgba(82,211,214,0.6)",
                }}
              />
              <span className="truncate uppercase">{win.fileNode.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Clock */}
      <div
        className="flex items-center gap-3 sm:gap-4 text-xs font-bold tracking-widest shrink-0 ml-2 sm:ml-4"
        style={{ color: "var(--os-accent)" }}
      >
        <span className="uppercase opacity-80 hidden sm:inline">{date}</span>
        <span
          style={{ borderBottom: "1px solid rgba(82,211,214,0.3)" }}
          className="leading-none pb-0.5"
        >
          {time}
        </span>
      </div>
    </footer>
  );
};
