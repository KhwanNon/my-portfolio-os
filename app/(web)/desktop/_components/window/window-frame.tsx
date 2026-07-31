"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Copy, Minus, Square, X } from "lucide-react";
import type { WindowInstance } from "@/app/modules/desktop/context/window-manager-context";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { workspaceBox } from "@/app/modules/desktop/lib/workspace";
import { useIsSmallViewport } from "../../_lib/use-viewport";
import { FileGraphic } from "../file-graphic";
import { SPRING_EXPRESSIVE } from "@/app/shared/constants/motion";

interface WindowFrameProps {
  window: WindowInstance;
  children: React.ReactNode;
}

const MIN_WIDTH = 280;
const MIN_HEIGHT = 180;

/**
 * Programs that bring their own colour scheme, by the component they render.
 * A window normally wears whatever the desktop is wearing; the terminal is the
 * exception, and it is the *frame* that carries the scope rather than the app
 * inside it — a black screen under a white title bar is two objects, not one
 * window. Anything not listed here inherits the desktop's scheme, which is the
 * right answer for every other app.
 */
const WINDOW_SCHEME: Record<string, string> = {
  SystemCommand: "console",
};

const schemeOf = (win: WindowInstance) =>
  win.fileNode.data?.kind === "program"
    ? WINDOW_SCHEME[win.fileNode.data.component]
    : undefined;

/**
 * Keep `value` inside the workspace. When the box is too small to satisfy both
 * ends, `min` wins — a window stays usable rather than collapsing to fit.
 */
const clamp = (value: number, max: number, min = 0) =>
  Math.max(min, Math.min(value, max));

/** Ghost round control in the title bar; `danger` tints the close action red. */
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
      className={`focus-ring grid h-8 w-8 cursor-pointer place-items-center rounded-full text-os-text-dim transition-colors duration-150 ${
        danger
          ? "hover:bg-os-error/12 hover:text-os-error"
          : "hover:bg-os-surface-3"
      }`}
    >
      {children}
    </button>
  );
}

export function WindowFrame({ window: win, children }: WindowFrameProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
  } = useWindowManager();

  // Small viewport → treat every window as maximised. Drag/resize disabled.
  const isMobile = useIsSmallViewport();
  const effectivelyMaximized = win.isMaximized || isMobile;

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
      initial={{ opacity: 0, scale: 0.92, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 6 }}
      transition={SPRING_EXPRESSIVE}
      data-theme={schemeOf(win)}
      className="absolute flex flex-col overflow-hidden rounded-lg"
      style={{
        ...style,
        border: "1px solid var(--os-border)",
        background: "var(--os-surface)",
        boxShadow: "var(--shadow-3)",
      }}
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
        className="flex shrink-0 select-none items-center justify-between gap-2 pl-4 pr-2"
        style={{
          height: 44,
          background: "var(--os-header)",
          borderBottom: "1px solid var(--os-border)",
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
          <FileGraphic icon={win.fileNode.icon} size={16} />
          <span
            className="truncate text-[13px] font-medium"
            style={{ color: "var(--os-text)" }}
          >
            {win.fileNode.name}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex shrink-0 items-center gap-0.5">
          <TitleButton
            label="Minimize"
            onClick={() => minimizeWindow(win.id)}
          >
            <Minus size={15} strokeWidth={2} />
          </TitleButton>
          {/* Maximize — hidden on mobile (auto-maximised already) */}
          {!isMobile && (
            <TitleButton
              label={win.isMaximized ? "Restore" : "Maximize"}
              onClick={() => maximizeWindow(win.id)}
            >
              {win.isMaximized ? (
                <Copy size={13} strokeWidth={2} />
              ) : (
                <Square size={12} strokeWidth={2.2} />
              )}
            </TitleButton>
          )}
          <TitleButton label="Close" danger onClick={() => closeWindow(win.id)}>
            <X size={16} strokeWidth={2} />
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
            background:
              "linear-gradient(135deg, transparent 0%, transparent 50%, var(--os-border) 50%, var(--os-border) 60%, transparent 60%, transparent 70%, var(--os-border) 70%, var(--os-border) 80%, transparent 80%)",
          }}
          title="Resize"
        />
      )}
    </motion.div>
  );
}
