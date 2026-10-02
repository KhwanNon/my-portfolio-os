"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { activeWindowId } from "@/app/modules/desktop/lib/active-window";
import type { WindowInstance } from "@/app/modules/desktop/context/window-manager-context";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { workspaceBox } from "@/app/modules/desktop/lib/workspace";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useIsSmallViewport } from "../../_lib/use-viewport";
import { FileGraphic } from "../file-graphic";
import { PixelGlyph } from "../pixel-glyph";

interface WindowFrameProps {
  window: WindowInstance;
  children: React.ReactNode;
}

const MIN_WIDTH = 280;
const MIN_HEIGHT = 180;

/**
 * Keep `value` inside the workspace. When the box is too small to satisfy both
 * ends, `min` wins — a window stays usable rather than collapsing to fit.
 */
const clamp = (value: number, max: number, min = 0) =>
  Math.max(min, Math.min(value, max));

/** Motion in whole frames, the way a sprite animates: four steps, no tween. */
const STEPPED = (t: number) => Math.ceil(t * 4) / 4;

/** A bevelled block in the title bar; `danger` lights the close action red. */
function TitleButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`focus-ring pixel-btn grid h-[22px] w-[24px] cursor-pointer place-items-center bg-os-surface-3 text-os-text ${
        danger ? "hover:bg-os-error hover:text-white" : "hover:bg-os-accent-container"
      }`}
    >
      {children}
    </button>
  );
}

export function WindowFrame({ window: win, children }: WindowFrameProps) {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
  } = useWindowManager();
  const S = useStrings();

  // Small viewport → treat every window as maximised. Drag/resize disabled.
  const isMobile = useIsSmallViewport();
  const effectivelyMaximized = win.isMaximized || isMobile;
  // Only the window you are working in is lit; the rest sit back.
  const isActive = activeWindowId(windows) === win.id;

  const contentRef = useRef<HTMLDivElement>(null);

  // ── Drag state ─────────────────────────────────────────────────────────────
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });

  const moveRef = useRef(moveWindow);
  useEffect(() => {
    moveRef.current = moveWindow;
  });

  // ── Resize state ───────────────────────────────────────────────────────────
  const resizeState = useRef({
    isResizing: false,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  const resizeRef = useRef(resizeWindow);
  useEffect(() => {
    resizeRef.current = resizeWindow;
  });

  // The listeners below are bound once per window, so its live geometry has to
  // reach them the same way its actions do.
  const winRef = useRef(win);
  useEffect(() => {
    winRef.current = win;
  });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Both gestures are bounded by the same box, so a window can never be
      // pushed or stretched under the dock.
      const box = workspaceBox();
      const { size, position } = winRef.current;

      if (dragState.current.isDragging) {
        const dx = e.clientX - dragState.current.startX;
        const dy = e.clientY - dragState.current.startY;
        const x = dragState.current.startPosX + dx;
        const y = dragState.current.startPosY + dy;
        moveRef.current(
          win.id,
          clamp(x, box.width - size.width),
          clamp(y, box.height - size.height),
        );
      } else if (resizeState.current.isResizing) {
        const dx = e.clientX - resizeState.current.startX;
        const dy = e.clientY - resizeState.current.startY;
        const w = resizeState.current.startW + dx;
        const h = resizeState.current.startH + dy;
        resizeRef.current(
          win.id,
          clamp(w, box.width - position.x, MIN_WIDTH),
          clamp(h, box.height - position.y, MIN_HEIGHT),
        );
      }
    };
    const onMouseUp = () => {
      dragState.current.isDragging = false;
      resizeState.current.isResizing = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [win.id]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (effectivelyMaximized) return;
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: win.position.x,
      startPosY: win.position.y,
    };
    document.body.style.userSelect = "none";
    focusWindow(win.id);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (effectivelyMaximized) return;
    resizeState.current = {
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      startW: win.size.width,
      startH: win.size.height,
    };
    document.body.style.userSelect = "none";
    document.body.style.cursor = "nwse-resize";
    focusWindow(win.id);
  };

  if (win.isMinimized) return null;

  const style = effectivelyMaximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: win.zIndex,
      }
    : {
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      };

  return (
    <motion.div
      layout={false}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.16, ease: STEPPED }}
      className="os-window pixel-box absolute flex flex-col overflow-hidden"
      data-active={isActive}
      style={{ ...style, background: "#020a05" }}
      onMouseDown={() => {
        focusWindow(win.id);
        setTimeout(() => {
          if (
            !document.activeElement ||
            document.activeElement === document.body
          ) {
            const input =
              contentRef.current?.querySelector<HTMLInputElement>("input");
            input?.focus();
          }
        }, 0);
      }}
    >
      {/* Title Bar */}
      <div
        // Lit like a game's dialog header when this is the window in use;
        // banked down to the surface when it is not.
        className="flex shrink-0 select-none items-center justify-between gap-2 pl-2 pr-1.5"
        style={{
          height: 32,
          background: isActive ? "var(--os-accent)" : "var(--os-surface-3)",
          borderBottom: `3px solid ${isActive ? "#1e8a4a" : "#0f3a22"}`,
          cursor: effectivelyMaximized ? "default" : "move",
        }}
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          if (isMobile) return;
          maximizeWindow(win.id);
        }}
      >
        {/* Title */}
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="grid h-[22px] w-[22px] shrink-0 place-items-center"
            style={{ background: isActive ? "var(--os-on-accent)" : "transparent" }}
          >
            <FileGraphic icon={win.fileNode.icon} size={18} className="pixelated" />
          </span>
          <span
            className="font-os-pixel truncate text-[14px] font-semibold tracking-wide"
            style={{
              color: isActive ? "var(--os-on-accent)" : "var(--os-text-faint)",
            }}
          >
            {win.fileNode.name}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex shrink-0 items-center gap-1">
          <TitleButton
            label={S.window.minimize}
            onClick={() => minimizeWindow(win.id)}
          >
            <PixelGlyph sprite="minimize" />
          </TitleButton>
          {/* Maximize — hidden on mobile (auto-maximised already) */}
          {!isMobile && (
            <TitleButton
              label={win.isMaximized ? S.window.restore : S.window.maximize}
              onClick={() => maximizeWindow(win.id)}
            >
              <PixelGlyph sprite={win.isMaximized ? "restore" : "maximize"} />
            </TitleButton>
          )}
          <TitleButton
            label={S.window.close}
            danger
            onClick={() => closeWindow(win.id)}
          >
            <PixelGlyph sprite="close" />
          </TitleButton>
        </div>
      </div>

      {/* Content Area */}
      <div ref={contentRef} className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Resize handle (bottom-right). Hidden when maximised or on mobile. */}
      {!effectivelyMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute select-none"
          style={{
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            cursor: "nwse-resize",
            // A stepped grip, three blocks on the diagonal.
            background:
              "linear-gradient(var(--os-border-strong),var(--os-border-strong)) 12px 4px/4px 4px no-repeat, linear-gradient(var(--os-border-strong),var(--os-border-strong)) 8px 8px/4px 4px no-repeat, linear-gradient(var(--os-border-strong),var(--os-border-strong)) 12px 8px/4px 4px no-repeat, linear-gradient(var(--os-border-strong),var(--os-border-strong)) 4px 12px/4px 4px no-repeat, linear-gradient(var(--os-border-strong),var(--os-border-strong)) 8px 12px/4px 4px no-repeat, linear-gradient(var(--os-border-strong),var(--os-border-strong)) 12px 12px/4px 4px no-repeat",
          }}
          title={S.window.resize}
        />
      )}
    </motion.div>
  );
}
