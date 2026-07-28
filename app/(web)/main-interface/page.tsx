"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Taskbar } from "./_components/taskbar";
import { DesktopSurface } from "./_components/desktop-surface";
import { WindowFrame } from "./_components/window/window-frame";
import { FileRenderer } from "./_components/file-renderer";
import { ContextMenu } from "./_components/context-menu";
import { ToastStack } from "./_components/toast-stack";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/app/modules/desktop/context/window-manager-context";
import { aboutOsNode, desktopFileSystem } from "./_data/file-system-data";

const TERMINAL_ID = "system-command";

function Desktop() {
  const {
    windows,
    contextMenu,
    showContextMenu,
    hideContextMenu,
    toasts,
    showToast,
    openFile,
  } = useWindowManager();

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, [
      {
        label: "Open System Command",
        onSelect: () => {
          const term = desktopFileSystem.find((n) => n.id === TERMINAL_ID);
          if (term) openFile(term);
        },
      },
      {
        label: "Refresh",
        onSelect: () => showToast("Desktop refreshed ✓", "success"),
      },
      { separator: true },
      { label: "About Portfolio OS", onSelect: () => openFile(aboutOsNode) },
    ]);
  };

  return (
    // One column: the workspace taking everything, and the dock closing it off
    // along the bottom. The shell's chrome is that one edge — what a top bar
    // and a side rail each used to hold now lives either in the dock or on the
    // desktop itself.
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-os-bg text-os-text">
      {/* The workspace: everything above the dock, and all of it. Positioning
          context for windows and ambient layers, and the box the window manager
          measures itself against. */}
      <div
        data-workspace
        className="relative min-w-0 flex-1 overflow-hidden"
        onClick={() => {
          // Click on empty workspace → deselect any focused icon.
          // Skip inputs / textareas / contenteditable so we don't steal
          // focus from things like the terminal prompt.
          const active = document.activeElement as HTMLElement | null;
          if (!active) return;
          if (
            active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.isContentEditable
          ) {
            return;
          }
          active.blur();
        }}
      >
        {/* ── Ambient FX layers (back → front) ───────────────────────── */}
        {/* The colour the desktop is lit by. It sits under the surface rather
              than inside it, so how much of it reads is the surface's business
              — see `--os-desktop-veil`. Unlike the two below, it shows on every
              theme. */}
        <div className="absolute inset-0 bg-ambient-aura pointer-events-none" />
        <div className="absolute inset-0 bg-ambient-grid opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-0 bg-vignette pointer-events-none z-10" />

        {/* ── Desktop: the surface windows open from ───────────────────── */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onContextMenu={handleDesktopContextMenu}
          // No padding: the surface reaches every edge, and the one thing on it
          // keeps its own margin from the corner.
          className="custom-scrollbar absolute inset-0 z-20 overflow-auto"
        >
          <DesktopSurface />
        </motion.main>

        {/* ── Windows ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {windows.map((win) => (
            <WindowFrame key={win.id} window={win}>
              <FileRenderer fileNode={win.fileNode} />
            </WindowFrame>
          ))}
        </AnimatePresence>

        {/* ── Overlays ─────────────────────────────────────────────────── */}
        <ToastStack toasts={toasts} />
        {contextMenu && (
          <ContextMenu menu={contextMenu} onClose={hideContextMenu} />
        )}
      </div>

      <Taskbar />
    </div>
  );
}

export default function MainInterfaceScreen() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  );
}
