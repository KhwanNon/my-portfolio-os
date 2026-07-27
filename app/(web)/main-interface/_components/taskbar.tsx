"use client";
// The dock: the bar across the foot of the shell, reading left to right as
// shell controls, then the apps, then what the machine has to say about itself.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Battery, LayoutGrid, Search, Wifi, WifiOff } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { applications } from "../_data/file-system-data";
import { useSystemStatus } from "../_lib/use-system-status";
import { IconTile } from "./file-graphic";

const DOCK_APPS = applications.map(({ node }) => node);

function useClock() {
  const [display, setDisplay] = useState({ date: "", time: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      // Composed rather than one `toLocaleDateString` call: the shell wants the
      // date first and the weekday after it, which no locale pattern gives.
      const monthDay = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const weekday = now.toLocaleDateString("en-US", { weekday: "short" });
      const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      const next = { date: `${monthDay}, ${weekday}`, time };
      // Only minutes are shown, so most ticks change nothing — bail rather than
      // re-render the dock once a second.
      setDisplay((current) =>
        current.date === next.date && current.time === next.time
          ? current
          : next,
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return display;
}

export const Taskbar = () => {
  const { windows, openFile, focusWindow, restoreWindow, minimizeAllWindows } =
    useWindowManager();

  // The dock always shows its apps, plus anything else currently open.
  const opened = windows
    .map((w) => w.fileNode)
    .filter((node) => !DOCK_APPS.some((app) => app.id === node.id));

  return (
    <motion.nav
      aria-label="Dock"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={{
        height: "var(--os-bar-h)",
        background: "var(--os-surface-1)",
        borderTop: "1px solid var(--os-border)",
        zIndex: 300,
      }}
      // The system bar's counterpart at the foot of the column: same height,
      // same surface, same edge treatment — a hairline instead of a shadow,
      // because it sits in the flow rather than floating over the workspace.
      className="relative flex shrink-0 items-center gap-5 px-4 sm:px-6"
    >
      {/* Shell controls */}
      <ShellButton label="Show desktop" onClick={minimizeAllWindows} accented>
        <LayoutGrid size={18} strokeWidth={1.9} />
      </ShellButton>
      <ShellButton
        label="Search (⌘K)"
        onClick={() => window.dispatchEvent(new CustomEvent("spotlight:toggle"))}
      >
        <Search size={18} strokeWidth={1.9} />
      </ShellButton>

      {/* The apps, and the only part that may grow past the bar: every window
          opened outside the dock adds a slot, so this strip is what scrolls. */}
      <div className="custom-scrollbar scroll-fade-x flex min-w-0 flex-1 items-center gap-5 overflow-x-auto py-2.5">
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

      {/* Readouts, not controls — the first thing to go when the bar is narrow. */}
      <div className="hidden shrink-0 items-center gap-5 sm:flex">
        <StatusTray />
        <Clock />
      </div>
    </motion.nav>
  );
};

/** Square control at the dock's left edge; the accented one is the launcher. */
function ShellButton({
  label,
  onClick,
  accented,
  children,
}: {
  label: string;
  onClick: () => void;
  accented?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      // Same radius as the app chips beside it — one dock row, one shape.
      className={`focus-ring grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-sm transition-colors duration-200 ${
        accented ? "bg-os-accent-container" : "hover:bg-os-surface-3"
      }`}
      style={{ color: accented ? "var(--os-accent)" : "var(--os-text-dim)" }}
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
  const state = !win ? "" : win.isMinimized ? ", minimised" : ", running";

  return (
    <button
      onClick={() => (win ? onFocus(win.id) : onLaunch())}
      title={node.name}
      aria-label={`${node.name}${state}`}
      className="focus-ring group relative grid shrink-0 cursor-pointer place-items-center transition-transform duration-200 hover:-translate-y-0.5"
    >
      <IconTile icon={node.icon} />
      <span
        className="absolute -bottom-1 h-1 rounded-full transition-all duration-200"
        style={{
          width: win ? 12 : 0,
          background: win?.isMinimized
            ? "var(--os-text-faint)"
            : "var(--os-accent)",
        }}
      />
    </button>
  );
}

/** Only what the browser will actually tell us about the machine. */
function StatusTray() {
  const { online, battery } = useSystemStatus();

  return (
    <div
      className="flex items-center gap-3"
      style={{ color: "var(--os-text-dim)" }}
    >
      <span title={online ? "Online" : "Offline"}>
        {online ? (
          <Wifi size={16} strokeWidth={1.8} />
        ) : (
          <WifiOff size={16} strokeWidth={1.8} />
        )}
      </span>
      {battery !== null && (
        <span className="flex items-center gap-1.5" title="Battery">
          <Battery size={16} strokeWidth={1.8} />
          <span className="text-[11px] tabular-nums">{battery}%</span>
        </span>
      )}
    </div>
  );
}

function Clock() {
  const { date, time } = useClock();

  return (
    <div className="shrink-0 text-right leading-tight">
      <div className="text-[11px]" style={{ color: "var(--os-text-dim)" }}>
        {date}
      </div>
      <div
        className="text-[13px] font-medium tabular-nums"
        style={{ color: "var(--os-text)" }}
      >
        {time}
      </div>
    </div>
  );
}
