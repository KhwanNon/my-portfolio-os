"use client";
// The dock: the shell's one piece of chrome, across the foot of the screen and
// holding one row of artwork in the middle — what the machine can open and what
// it has open — with what it has to say about itself at the right-hand end.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { FileNode } from "@/app/shared/types/file-system";
import {
  useWindowManager,
  type WindowInstance,
} from "@/app/modules/desktop/context/window-manager-context";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useDesktopData } from "../_lib/use-desktop-data";
import { useFileMenu } from "../_lib/use-file-menu";
import { IconTile } from "./file-graphic";
import { SystemStatus } from "./system-status";

export function Taskbar() {
  const { windows } = useWindowManager();
  const { dock } = useDesktopData();
  const S = useStrings();

  // The fixed slots, plus anything open that has no slot of its own — a window
  // with nowhere in the dock to go is a window you cannot get back to once it
  // is minimised.
  const guests = windows
    .map((w) => w.fileNode)
    .filter((node) => !dock.some((item) => item.id === node.id));

  return (
    <motion.nav
      aria-label={S.dock.label}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.45, ease: "easeOut" }}
      // In the flow rather than floating over the workspace, so it takes a
      // hairline where a floating bar would take a shadow.
      className="relative z-300 flex shrink-0 items-center gap-3 px-3 sm:px-4"
      style={{
        height: "var(--os-dock-h)",
        background: "var(--os-surface-1)",
        borderTop: "1px solid var(--os-border)",
      }}
    >
      {/* Empty, and load-bearing: it takes the same share of the leftover width
          as the readouts opposite, which is what puts the row of slots in the
          middle of the screen rather than wherever the readouts leave off. */}
      <div className="flex-1" />

      {/* The only part that may outgrow the bar: every guest window adds a
          slot, so this strip is what scrolls and the readouts never move. */}
      <div className="custom-scrollbar flex min-w-0 items-center gap-2.5 overflow-x-auto">
        {[...dock, ...guests].map((node) => (
          <DockSlot
            key={node.id}
            node={node}
            window={windows.find((w) => w.fileNode.id === node.id)}
          />
        ))}
      </div>

      <div className="flex flex-1 items-center justify-end">
        <SystemStatus />
      </div>
    </motion.nav>
  );
}

/**
 * One slot. Click launches, or brings back what is already open — a dock that
 * opened a second window for something already running would be a dock you
 * cannot use to get back to anything.
 *
 * The dot underneath is the whole of the window state: present means a window
 * exists, and it goes quiet when that window is minimised.
 *
 * The name rides above the slot on hover. Artwork alone is a guess until you
 * have learned the row, and the browser's own `title` took a second to appear,
 * arrived in the system font, and was the one piece of this shell drawn by
 * something other than the shell.
 */
function DockSlot({
  node,
  window: win,
}: {
  node: FileNode;
  window?: WindowInstance;
}) {
  const { openFile, restoreWindow, focusWindow } = useWindowManager();
  const S = useStrings();
  const openMenu = useFileMenu();
  const slot = useRef<HTMLButtonElement>(null);

  // Where to put the label, and `null` for "don't" — measured on the way in
  // rather than held, because the strip scrolls and a slot that has moved would
  // otherwise be labelled where it used to be.
  //
  // Held as a distance up from the foot of the screen, not down from the top:
  // the label sits *above* the slot, so its bottom edge is the edge that has to
  // land somewhere exact, and anchoring the bottom is what lets it do that
  // without first knowing how tall the label turned out to be.
  const [anchor, setAnchor] = useState<{ x: number; bottom: number } | null>(
    null,
  );
  const show = () => {
    const box = slot.current?.getBoundingClientRect();
    if (!box) return;
    setAnchor({
      x: box.left + box.width / 2,
      // A step clear of the slot's top edge, so the label is not landed on by
      // the slot's own rise on hover.
      bottom: window.innerHeight - box.top + 8,
    });
  };
  const hide = () => setAnchor(null);

  const state = !win
    ? ""
    : win.isMinimized
      ? S.dock.minimized
      : S.dock.running;

  return (
    <button
      ref={slot}
      onClick={() => {
        if (!win) return openFile(node);
        restoreWindow(win.id);
        focusWindow(win.id);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        openMenu(node, { x: e.clientX, y: e.clientY });
      }}
      onMouseEnter={show}
      onMouseLeave={hide}
      // Shown to the keyboard too: tabbing the dock is the case where you can
      // least afford to guess what the artwork is.
      onFocus={show}
      onBlur={hide}
      aria-label={`${node.name}${state}`}
      className="focus-ring group relative grid shrink-0 cursor-pointer place-items-center rounded-sm p-0.5 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <IconTile icon={node.icon} size="lg" />
      <span
        className="absolute bottom-0 h-1 rounded-full transition-all duration-200"
        style={{
          width: win ? 12 : 0,
          background: win?.isMinimized
            ? "var(--os-text-faint)"
            : "var(--os-accent)",
        }}
      />
      <DockLabel text={node.name} anchor={anchor} />
    </button>
  );
}

/**
 * The hovered slot's name, floating clear of the dock.
 *
 * Mounted into `body` rather than into the slot: the row of slots is the one
 * part of the bar that scrolls, and anything drawn above a child of it is
 * clipped at the strip's edge. So the label is placed in viewport coordinates
 * over the top of the whole shell instead — above the windows and both bars,
 * below the menus and the toasts, which are things the desktop is *saying* and
 * outrank a label naming what is under the cursor.
 */
function DockLabel({
  text,
  anchor,
}: {
  text: string;
  anchor: { x: number; bottom: number } | null;
}) {
  // The bar server-renders, and there is no `document` to portal into there.
  // Nothing is lost by waiting: the label only ever appears from a hover or a
  // focus, neither of which can happen before the page is interactive.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {anchor && (
        <motion.span
          // Not `role="tooltip"`: the slot already names itself to a screen
          // reader through `aria-label`, and announcing it a second time is
          // repetition, not help. This is for the eye only.
          aria-hidden="true"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
          className="pointer-events-none fixed whitespace-nowrap rounded-md px-2 py-1 text-[11px]"
          style={{
            // Pinned by its bottom edge, a step above the slot, and pulled back
            // half its own width to centre on it. The half-width shift is `x`
            // rather than a CSS `transform`, because Motion composes `x` with
            // the `y` it is animating above — written as `transform` here, the
            // animation would overwrite it and drop the label onto the corner
            // of the icon.
            left: anchor.x,
            bottom: anchor.bottom,
            x: "-50%",
            zIndex: 8800,
            color: "var(--os-text)",
            background: "var(--os-surface-3)",
            border: "1px solid var(--os-border)",
            boxShadow: "var(--shadow-2)",
          }}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>,
    document.body,
  );
}
