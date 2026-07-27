"use client";
// The shell's navigation column: brand, every desktop shortcut as one row, and
// the craft card. Static from `lg` up; a slide-over drawer below it.
import { useEffect } from "react";
import { Home, Sparkles } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { desktopSections } from "../_data/file-system-data";
import { useFileMenu } from "../_lib/use-file-menu";
import { useIsSmallViewport } from "../_lib/use-viewport";
import { IconTile } from "./file-graphic";
import { MountainGlyph } from "./mountain-glyph";

// The home screen already states "Best, but simplest." — this card is where
// that claim gets unpacked, so it must not repeat the same words back.
const CRAFT_LINES = [
  "Thoughtful process.",
  "Research, then distill.",
  "Clean craft.",
  "Always the standard.",
];

interface SideRailProps {
  /** Drawer state — ignored at `lg` and above, where the rail is always shown. */
  open: boolean;
  onClose: () => void;
}

export function SideRail({ open, onClose }: SideRailProps) {
  const { minimizeAllWindows } = useWindowManager();

  // Below `lg` the rail is a drawer: closed means gone, not merely off-screen —
  // otherwise its controls stay in the tab order behind the page.
  const isDrawer = useIsSmallViewport(1024);
  const dismissed = isDrawer && !open;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Scrim — drawer only */}
      <div
        onClick={onClose}
        hidden={!open}
        className="fixed inset-0 z-400 bg-black/40 lg:hidden"
      />

      <aside
        inert={dismissed}
        aria-label="Navigation"
        className={`fixed inset-y-0 left-0 z-401 flex w-66 shrink-0 flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--os-surface-1)",
          borderRight: "1px solid var(--os-border)",
        }}
      >
        {/* Brand — same band height as the system bar, so the two rows align */}
        <div className="flex h-16 shrink-0 items-center gap-2 px-5">
          <Sparkles
            size={20}
            strokeWidth={2}
            style={{ color: "var(--os-accent)" }}
          />
          <span
            className="text-[15px] font-semibold tracking-tight"
            style={{ color: "var(--os-text)" }}
          >
            Portfolio OS
          </span>
        </div>

        {/* Navigation */}
        <nav className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2">
          <button
            onClick={() => {
              minimizeAllWindows();
              onClose();
            }}
            title="Show desktop"
            className="focus-ring flex w-full cursor-pointer items-center gap-3 rounded-full py-1.5 pl-1.5 pr-3 text-left transition-colors duration-200"
            style={{
              background: "var(--os-accent-container)",
              color: "var(--os-on-accent-container)",
            }}
          >
            {/* Chipped like the shortcuts below it, so every row aligns on one edge. */}
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
              style={{ background: "var(--os-surface-1)" }}
            >
              <Home size={16} strokeWidth={1.8} />
            </span>
            <span className="text-[13px] font-medium">Home</span>
          </button>

          {desktopSections.map((section) => (
            <div key={section.title} className="mt-5">
              <h2
                className="px-3 pb-1 text-[11px] font-medium tracking-wide"
                style={{ color: "var(--os-text-faint)" }}
              >
                {section.title}
              </h2>
              {section.nodes.map((node) => (
                <RailItem key={node.id} node={node} onNavigate={onClose} />
              ))}
            </div>
          ))}
        </nav>

        <CraftCard />
      </aside>
    </>
  );
}

/** One shortcut row. Single click opens — this is navigation, not a desktop icon. */
function RailItem({
  node,
  onNavigate,
}: {
  node: FileNode;
  onNavigate: () => void;
}) {
  const { openFile } = useWindowManager();
  const openMenu = useFileMenu();

  const open = () => {
    openFile(node);
    onNavigate();
  };

  return (
    <button
      onClick={open}
      onContextMenu={(e) => {
        e.preventDefault();
        openMenu(node, { x: e.clientX, y: e.clientY });
      }}
      title={node.name}
      className="focus-ring flex w-full cursor-pointer items-center gap-3 rounded-full py-1.5 pl-1.5 pr-3 text-left transition-colors duration-200 hover:bg-os-surface-3"
    >
      <IconTile icon={node.icon} size="sm" />
      <span
        className="truncate text-[13px]"
        style={{ color: "var(--os-text-dim)" }}
      >
        {node.name}
      </span>
    </button>
  );
}

/** The standard this whole OS is built to, stated in four lines. */
function CraftCard() {
  return (
    <div className="shrink-0 p-4">
      <div
        className="relative overflow-hidden rounded-xl p-4"
        style={{
          background: "var(--os-surface-3)",
          border: "1px solid var(--os-border)",
        }}
      >
        <MountainGlyph className="pointer-events-none absolute -bottom-2 -right-4 h-20 w-40" />
        <div className="relative flex items-start justify-between gap-2">
          <span
            className="text-[13px] font-semibold tracking-tight"
            style={{ color: "var(--os-text)" }}
          >
            khwan-craft
          </span>
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
            style={{
              background: "var(--os-surface-1)",
              color: "var(--os-accent)",
            }}
          >
            <Sparkles size={13} strokeWidth={2} />
          </span>
        </div>
        <ul
          className="relative mt-2 space-y-0.5 text-[12px] leading-snug"
          style={{ color: "var(--os-text-dim)" }}
        >
          {CRAFT_LINES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
