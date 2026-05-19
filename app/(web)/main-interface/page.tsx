"use client";
import { AnimatePresence, motion } from "framer-motion";
import { MatrixRain } from "@/app/shared/components/matrix-rain";
import { Taskbar } from "./_components/taskbar";
import { SystemBar } from "./_components/system-bar";
import { FileIcon } from "./_components/file-icon";
import { DesktopSection } from "./_components/desktop-section";
import { WindowFrame } from "./_components/window/window-frame";
import { FileRenderer } from "./_components/file-renderer";
import { ContextMenu } from "./_components/context-menu";
import { ToastStack } from "./_components/toast-stack";
import { Spotlight } from "./_components/spotlight";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/app/modules/desktop/context/window-manager-context";
import { desktopFileSystem, desktopSections } from "./_data/file-system-data";
import { useIsSmallViewport } from "./_lib/use-viewport";
import type { FileNode } from "@/app/shared/types/file-system";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const TERMINAL_ID = "system-command";

const ABOUT_OS_NODE: FileNode = {
  id: "about-os",
  name: "About Portfolio OS",
  type: "ui",
  icon: "about",
  data: { kind: "ui", component: "AboutOSUI", props: {} },
};

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
  const isMobile = useIsSmallViewport();
  const fileMap = Object.fromEntries(desktopFileSystem.map((f) => [f.id, f]));

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
      {
        label: "About Portfolio OS",
        onSelect: () => openFile(ABOUT_OS_NODE),
      },
    ]);
  };

  return (
    <div className="h-dvh w-full flex flex-col overflow-hidden bg-os-bg text-os-accent font-os-mono">
      {/* Top menu / system bar — always above the desktop body */}
      <SystemBar />

      {/* Desktop body — positioning context for windows and ambient layers */}
      <div
        className="relative flex-1 overflow-hidden"
        onClick={() => {
          // Click on empty desktop → deselect any focused icon.
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
        {/* ── Ambient FX layers (back → front) ─────────────────────────── */}
        {/* Matrix rain is GPU-friendly but still a constant repaint loop.
            Skip it on phones to save battery and keep the layout calm. */}
        {!isMobile && (
          <MatrixRain opacity={0.18} density={0.7} speedMultiplier={0.7} />
        )}
        <div className="absolute inset-0 bg-ambient-grid opacity-[0.05] pointer-events-none" />
        {!isMobile && (
          <div
            className="absolute left-0 right-0 h-px animate-scan-y pointer-events-none"
            style={{
              top: 0,
              background:
                "linear-gradient(to right, transparent, color-mix(in srgb, var(--os-accent) 55%, transparent), transparent)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-scanlines opacity-25 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-vignette pointer-events-none z-10" />

        {/* ── Desktop icon sections ────────────────────────────────────── */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onContextMenu={handleDesktopContextMenu}
          className="absolute inset-0 z-20 flex flex-col overflow-y-auto custom-scrollbar pt-4"
        >
          {desktopSections.map((section) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="flex-1 flex flex-col min-h-0"
            >
              <DesktopSection title={section.title} variant={section.variant}>
                {section.ids.map((id) => {
                  const node = fileMap[id];
                  return node ? (
                    <FileIcon key={id} fileNode={node} variant="desktop" />
                  ) : null;
                })}
              </DesktopSection>
            </motion.div>
          ))}
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

      {/* Taskbar — always pinned at the bottom */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative z-40"
      >
        <Taskbar />
      </motion.div>
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
