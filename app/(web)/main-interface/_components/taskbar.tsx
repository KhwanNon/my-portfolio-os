"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { applications, preferences } from "../_data/file-system-data";
import { FileGraphic, IconTile, iconSurface } from "./file-graphic";

/** Settings sits with the shell controls, so the dock stays the apps you open. */
const DOCK_APPS = applications
  .map(({ node }) => node)
  .filter((node) => node.id !== preferences.id);

function useClock() {
  const [display, setDisplay] = useState({ date: "", time: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        weekday: "short",
      });
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
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
  const { windows, openFile, focusWindow, restoreWindow } = useWindowManager();
  const { date, time } = useClock();

  // The dock always shows its apps, plus anything else currently open.
  const opened = windows
    .map((w) => w.fileNode)
    .filter((node) => !DOCK_APPS.some((app) => app.id === node.id));

  return (
    <footer
      style={{
        borderTop: "1px solid var(--os-border)",
        background: "var(--os-surface-1)",
      }}
      className="relative z-50 flex h-16 w-full shrink-0 items-center gap-3 px-3 sm:px-4"
    >
      {/* Shell controls */}
      <div className="flex shrink-0 items-center gap-1">
        <ShellButton
          label={preferences.name}
          onClick={() => openFile(preferences)}
          tint={iconSurface(preferences.icon)}
        >
          <FileGraphic icon={preferences.icon} size={18} />
        </ShellButton>
        <ShellButton
          label="Search (⌘K)"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("spotlight:toggle"))
          }
        >
          <Search size={18} strokeWidth={1.9} />
        </ShellButton>
      </div>

      {/* Dock */}
      <div className="custom-scrollbar flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto">
        {[...DOCK_APPS, ...opened].map((node) => (
          <DockItem
            key={node.id}
            node={node}
            window={windows.find((w) => w.fileNode.id === node.id)}
            onLaunch={() => openFile(node)}
            onFocus={(id) => {
              restoreWindow(id);
              focusWindow(id);
            }}
          />
        ))}
      </div>

      {/* Clock */}
      <div className="shrink-0 text-right leading-tight">
        <div className="text-[11px]" style={{ color: "var(--os-text-dim)" }}>
          {date}
        </div>
        <div
          className="text-[14px] font-medium tabular-nums"
          style={{ color: "var(--os-text)" }}
        >
          {time}
        </div>
      </div>
    </footer>
  );
};

/** Round control at the dock's left edge; `tint` gives it a launcher's chip. */
function ShellButton({
  label,
  onClick,
  tint,
  children,
}: {
  label: string;
  onClick: () => void;
  tint?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="focus-ring grid h-10 w-10 cursor-pointer place-items-center rounded-xl transition-colors duration-200 hover:bg-os-surface-3"
      style={{ background: tint ?? "transparent", color: "var(--os-text-dim)" }}
    >
      {children}
    </button>
  );
}

/** One dock slot. The dot underneath means a window for it exists. */
function DockItem({
  node,
  window: win,
  onLaunch,
  onFocus,
}: {
  node: FileNode;
  window?: { id: string; isMinimized: boolean };
  onLaunch: () => void;
  onFocus: (id: string) => void;
}) {
  const running = win !== undefined;

  return (
    <button
      onClick={() => (win ? onFocus(win.id) : onLaunch())}
      title={node.name}
      aria-label={node.name}
      className="focus-ring group relative grid shrink-0 cursor-pointer place-items-center transition-transform duration-200 hover:-translate-y-0.5"
    >
      <IconTile icon={node.icon} />
      <span
        className="absolute -bottom-1 h-1 rounded-full transition-all duration-200"
        style={{
          width: running ? 14 : 0,
          background: win?.isMinimized
            ? "var(--os-text-faint)"
            : "var(--os-accent)",
        }}
      />
    </button>
  );
}
