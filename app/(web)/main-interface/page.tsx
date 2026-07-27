"use client";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Taskbar } from "./_components/taskbar";
import { SystemBar } from "./_components/system-bar";
import { SideRail } from "./_components/side-rail";
import { HomeHero } from "./_components/home-hero";
import { DesktopSurface } from "./_components/desktop-surface";
import { WindowFrame } from "./_components/window/window-frame";
import { FileRenderer } from "./_components/file-renderer";
import { ContextMenu } from "./_components/context-menu";
import { ToastStack } from "./_components/toast-stack";
import { Spotlight } from "./_components/spotlight";
import { useIsSmallViewport } from "./_lib/use-viewport";
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

  const [railOpen, setRailOpen] = useState(false);
  const closeRail = useCallback(() => setRailOpen(false), []);

  // While the drawer is open, everything outside it is inert — that is what
  // keeps Tab inside the drawer, without hand-rolling a focus trap.
  const drawerBlocking = useIsSmallViewport(1024) && railOpen;

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
    // The rail owns the full height; both bars belong to the content column.
    <div className="flex h-dvh w-full overflow-hidden bg-os-bg text-os-text">
      <SideRail open={railOpen} onClose={closeRail} />

      {/* Content column — system bar, workspace, and the dock floating over it */}
      <div inert={drawerBlocking} className="flex min-w-0 flex-1 flex-col">
        <SystemBar navOpen={railOpen} onMenuClick={() => setRailOpen(true)} />

        {/* Workspace — positioning context for windows and ambient layers, and
            the box the window manager measures itself against. */}
        <div
          data-workspace
          className="relative flex-1 overflow-hidden"
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
          <div className="absolute inset-0 bg-ambient-grid opacity-[0.05] pointer-events-none" />
          <div className="absolute inset-0 bg-vignette pointer-events-none z-10" />

          {/* ── Desktop: the greeting and the surface windows open from ─── */}
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onContextMenu={handleDesktopContextMenu}
            className="custom-scrollbar absolute inset-0 z-20 overflow-y-auto px-4 pb-6 pt-8 sm:px-8"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-4">
              <HomeHero />
              <DesktopSurface />
            </div>
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
          <Spotlight />
        </div>

        {/* The column's closing band, mirroring the system bar that opens it. */}
        <Taskbar />
      </div>
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
