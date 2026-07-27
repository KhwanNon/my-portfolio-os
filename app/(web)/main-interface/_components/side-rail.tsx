"use client";
// The shell's navigation column: brand, every desktop shortcut as one row, and
// the craft card. Static from `lg` up; a slide-over drawer below it.
import { useEffect, useRef } from "react";
import { LayoutGrid } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { desktopSections } from "../_data/file-system-data";
import { useFileMenu } from "../_lib/use-file-menu";
import { useIsSmallViewport } from "../_lib/use-viewport";
import { FileGraphic } from "./file-graphic";
import { MountainGlyph } from "./mountain-glyph";
import { SparkGlyph } from "./spark-glyph";

const CRAFT_LINES = [
  "Best, but simplest.",
  "Thoughtful process.",
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
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Opening the drawer moves focus into it; closing it hands focus back to
  // whatever opened it. Everything outside is inert while it is open, so this
  // is the whole of the trap.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.querySelector("button")?.focus();
    return () => opener?.focus();
  }, [open]);

  return (
    <>
      {/* Scrim — drawer only */}
      <div
        onClick={onClose}
        hidden={!open}
        className="fixed inset-0 z-400 bg-black/40 lg:hidden"
      />

      <aside
        ref={panel}
        id="shell-navigation"
        inert={dismissed}
        aria-label="Navigation"
        // The dock belongs to the content column, not to this one, so the rail
        // runs the full height and the two bars frame the workspace beside it.
        className={`fixed inset-y-0 left-0 z-401 flex w-64 shrink-0 flex-col transition-transform duration-300 lg:static lg:z-30 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--os-surface-1)",
          borderRight: "1px solid var(--os-border)",
        }}
      >
        {/* Brand — same band height as the system bar, so the two rows align */}
        <div
          className="flex shrink-0 items-center gap-2 px-5"
          style={{ height: "var(--os-bar-h)" }}
        >
          <SparkGlyph size={19} className="shrink-0 text-os-accent" />
          <span
            className="text-[15px] font-semibold tracking-tight"
            style={{ color: "var(--os-text)" }}
          >
            Portfolio OS
          </span>
        </div>

        {/* Navigation */}
        <nav className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-3 pt-3">
          <button
            onClick={() => {
              minimizeAllWindows();
              onClose();
            }}
            title="Show desktop"
            className="focus-ring flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-full pl-2.5 pr-3.5 text-left transition-colors duration-200"
            style={{
              background: "var(--os-accent-container)",
              color: "var(--os-on-accent-container)",
            }}
          >
            <LayoutGrid size={17} strokeWidth={1.8} className="shrink-0" />
            <span className="text-[13px] font-medium">Desktop</span>
          </button>

          {/* The first group sits closer to Desktop than the groups sit to each
              other — Desktop is a peer of the rows, not a section of its own. */}
          {desktopSections.map((section, index) => (
            <div key={section.title} className={index === 0 ? "mt-7" : "mt-9"}>
              <h2
                className="px-1 pb-1 text-[11px] font-medium tracking-wide"
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

/**
 * One shortcut row. Single click opens — this is navigation, not a desktop
 * icon. The glyph is drawn bare here: a rail is a list of destinations, and the
 * chip is the launcher's mark, reserved for the surfaces you launch from.
 */
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
      className="focus-ring flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-full pl-2.5 pr-3.5 text-left transition-colors duration-200 hover:bg-os-surface-3"
    >
      <FileGraphic icon={node.icon} size={17} className="shrink-0" />
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
    <div className="shrink-0 px-5 pb-2">
      <div
        className="relative overflow-hidden rounded-lg p-3.5"
        style={{
          background: "var(--os-surface-1)",
          border: "1px solid var(--os-border)",
        }}
      >
        <MountainGlyph className="pointer-events-none absolute -bottom-1 -right-3 h-14 w-32" />
        <div className="relative flex items-start justify-between gap-2">
          <span
            className="text-[13px] font-semibold tracking-tight"
            style={{ color: "var(--os-text)" }}
          >
            khwan-craft
          </span>
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
            style={{
              background: "var(--os-surface-3)",
              color: "var(--os-accent)",
            }}
          >
            <SparkGlyph size={11} />
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
