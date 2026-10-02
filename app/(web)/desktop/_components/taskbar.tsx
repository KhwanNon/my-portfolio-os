"use client";
// The taskbar: the shell's one piece of chrome, full width across the foot of
// the screen. SEARCH at the left, then one slot per open window, and what the
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
import { SearchLauncher } from "./search-launcher";
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
      transition={{ delay: 0.2, duration: 0.3, ease: (t: number) => Math.ceil(t * 4) / 4 }}
      // A game's HUD strip: solid, with a thick lit edge along the top.
      className="relative z-300 flex shrink-0 items-stretch gap-1 px-1 py-1"
      style={{
        height: "var(--os-dock-h)",
        background: "#020a05",
        borderTop: "3px solid var(--os-accent)",
        boxShadow: "inset 0 3px 0 0 #0f3a22",
      }}
    >
      <SearchLauncher />

      {/* The only part that may outgrow the bar: every window adds a
          slot, so this strip is what scrolls and the tray never moves. */}
      <div className="custom-scrollbar flex min-w-0 flex-1 items-stretch gap-1 overflow-x-auto">
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
 * Drawn as a game button: raised while its window sits behind another or is
 * minimised, pressed in and lit while it is the window you are in.
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
      data-pressed={active}
      className="focus-ring font-os-pixel pixel-btn relative flex shrink-0 cursor-pointer items-center gap-2 px-2.5 text-[14px] hover:bg-os-accent-container sm:min-w-[132px] sm:px-3"
      style={{
        color: active ? "var(--os-accent)" : "var(--os-text-dim)",
        background: active ? "#0b2e18" : "var(--os-surface-3)",
      }}
    >
      <FileGraphic icon={node.icon} size={22} className="pixelated" />
      <span className="max-w-[110px] truncate max-sm:hidden">{node.name}</span>
    </button>
  );
}
