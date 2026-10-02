"use client";
// The taskbar: the shell's one piece of chrome, full width across the foot of
// the screen. START at the left, then one slot per open window, and what the
// machine has to say about itself at the right-hand end. Launchers live on the
// desktop, not here.
import { motion } from "framer-motion";
import type { FileNode } from "@/app/shared/types/file-system";
import {
  useWindowManager,
  type WindowInstance,
} from "@/app/modules/desktop/context/window-manager-context";
import { activeWindowId } from "@/app/modules/desktop/lib/active-window";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useFileMenu } from "../_lib/use-file-menu";
import { FileGraphic } from "./file-graphic";
import { StartMenu } from "./start-menu";
import { SystemStatus } from "./system-status";

export function Taskbar() {
  const { windows } = useWindowManager();
  const S = useStrings();
  const activeId = activeWindowId(windows);

  // One slot per open window, so a minimised one can always be got back to.
  const open = windows.map((w) => w.fileNode);

  return (
    <motion.nav
      aria-label={S.dock.label}
      initial={{ y: 48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
      // In the flow rather than floating over the workspace, so it takes a
      // hairline where a floating bar would take a shadow.
      className="relative z-300 flex shrink-0 items-stretch"
      style={{
        height: "var(--os-dock-h)",
        background: "rgba(1, 5, 3, 0.94)",
        borderTop: "1px solid var(--os-border-strong)",
      }}
    >
      <StartMenu />

      {/* The only part that may outgrow the bar: every window adds a
          slot, so this strip is what scrolls and the tray never moves. */}
      <div className="custom-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto">
        {open.map((node) => (
          <TaskSlot
            key={node.id}
            node={node}
            window={windows.find((w) => w.fileNode.id === node.id)}
            active={
              !!activeId &&
              windows.some(
                (w) => w.id === activeId && w.fileNode.id === node.id,
              )
            }
          />
        ))}
      </div>

      <SystemStatus />
    </motion.nav>
  );
}

/**
 * One slot. Click launches, or brings back what is already open — a bar that
 * opened a second window for something already running would be a bar you
 * cannot use to get back to anything.
 *
 * The line along the bottom is the whole of the window state: bright for the
 * window you are in, dim for one that is open behind it or minimised, absent
 * for one that is not running.
 */
function TaskSlot({
  node,
  window: win,
  active,
}: {
  node: FileNode;
  window?: WindowInstance;
  active: boolean;
}) {
  const { openFile, restoreWindow, focusWindow, minimizeWindow } =
    useWindowManager();
  const S = useStrings();
  const openMenu = useFileMenu();

  const state = !win
    ? ""
    : win.isMinimized
      ? S.dock.minimized
      : S.dock.running;

  return (
    <button
      onClick={() => {
        if (!win) return openFile(node);
        // Clicking the window you are already in tucks it away — the way a
        // taskbar toggles.
        if (active) return minimizeWindow(win.id);
        restoreWindow(win.id);
        focusWindow(win.id);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        openMenu(node, { x: e.clientX, y: e.clientY });
      }}
      title={node.name}
      aria-label={`${node.name}${state}`}
      className="focus-ring font-os-mono relative flex shrink-0 cursor-pointer items-center gap-2 px-3.5 text-[12px] transition-colors duration-150 hover:bg-os-accent/10 sm:min-w-[116px] sm:px-4"
      style={{
        color: win ? "var(--os-text)" : "var(--os-text-dim)",
        background: active ? "rgba(85,255,136,0.08)" : undefined,
      }}
    >
      <FileGraphic icon={node.icon} size={20} />
      <span className="max-w-[110px] truncate max-sm:hidden">{node.name}</span>
      <span
        className="absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-150"
        style={{
          opacity: win ? 1 : 0,
          background: active ? "var(--os-accent)" : "var(--os-text-subtle)",
          boxShadow: active ? "0 0 8px rgba(85,255,136,0.7)" : undefined,
        }}
      />
    </button>
  );
}
