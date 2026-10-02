"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  bootSequenceWanted,
  hasBooted,
  markBooted,
} from "@/app/shared/state/boot-session";
import { useSetting } from "@/app/shared/settings/use-setting";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useDesktopData } from "./_lib/use-desktop-data";

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
  const { fileSystem, aboutOsNode } = useDesktopData();
  const S = useStrings();

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, [
      {
        label: S.menu.openTerminal,
        onSelect: () => {
          const term = fileSystem.find((n) => n.id === TERMINAL_ID);
          if (term) openFile(term);
        },
      },
      {
        label: S.menu.refresh,
        onSelect: () => showToast(S.toast.refreshed, "success"),
      },
      { separator: true },
      { label: S.menu.aboutOs, onSelect: () => openFile(aboutOsNode) },
    ]);
  };

  return (
    // One column: the workspace taking everything, and the taskbar closing it
    // off along the bottom. The shell's chrome is that one edge.
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
        {/* ── Wallpaper and screen texture (back → front) ────────────── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/assets/images/bg.webp)" }}
        />
        {/* A light shade under the icons and the taskbar so labels read against
            the brightest part of the city, then scanlines and grain. All three
            sit under the desktop, so nothing a window says is ever dimmed. */}
        <div aria-hidden className="os-wallpaper-shade pointer-events-none absolute inset-0" />
        <div aria-hidden className="os-scanlines pointer-events-none absolute inset-0" />
        <div aria-hidden className="os-grain pointer-events-none absolute inset-0" />

        {/* ── Desktop: the surface windows open from ───────────────────── */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onContextMenu={handleDesktopContextMenu}
          // No padding: the surface reaches every edge, and the icons keep their
          // own margin from it.
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
  const router = useRouter();
  // Reaching the desktop means coming through the boot screen — on a refresh or
  // a direct link the flag is back to false, so the machine starts up again
  // rather than the desktop simply being there. Unless the visitor has turned
  // the sequence off, in which case there is nothing to come through and the
  // desktop simply is there. Rendering nothing until that is settled keeps a
  // frame of desktop from flashing behind the redirect.
  const { value: startup } = useSetting("startup");
  const { value: motion } = useSetting("motion");
  const booted = hasBooted() || !bootSequenceWanted(startup, motion);

  useEffect(() => {
    if (!booted) {
      router.replace("/boot");
      return;
    }
    // Pinned for the rest of the visit: turning the sequence back on in
    // Preferences is a choice about the *next* arrival, and must not eject the
    // desktop it was made from.
    markBooted();
  }, [booted, router]);

  if (!booted) return null;

  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  );
}
