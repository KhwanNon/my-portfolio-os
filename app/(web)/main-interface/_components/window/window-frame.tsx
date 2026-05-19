"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { WindowInstance } from "@/app/modules/desktop/context/window-manager-context";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { useIsSmallViewport } from "../../_lib/use-viewport";

interface WindowFrameProps {
  window: WindowInstance;
  children: React.ReactNode;
}

const MIN_WIDTH = 280;
const MIN_HEIGHT = 180;

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

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragState.current.isDragging) {
        const dx = e.clientX - dragState.current.startX;
        const dy = e.clientY - dragState.current.startY;
        const newX = dragState.current.startPosX + dx;
        const newY = dragState.current.startPosY + dy;
        moveRef.current(win.id, Math.max(0, newX), Math.max(0, newY));
      } else if (resizeState.current.isResizing) {
        const dx = e.clientX - resizeState.current.startX;
        const dy = e.clientY - resizeState.current.startY;
        const w = Math.max(MIN_WIDTH, resizeState.current.startW + dx);
        const h = Math.max(MIN_HEIGHT, resizeState.current.startH + dy);
        resizeRef.current(win.id, w, h);
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
      transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.6 }}
      className="absolute flex flex-col rounded-sm overflow-hidden shadow-2xl"
      style={{
        ...style,
        border: "1px solid rgba(82,211,214,0.3)",
        background: "var(--os-surface)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(82,211,214,0.15), 0 0 28px rgba(82,211,214,0.08)",
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
        className="flex items-center justify-between px-3 select-none shrink-0"
        style={{
          height: 36,
          background: "var(--os-header)",
          borderBottom: "1px solid rgba(82,211,214,0.2)",
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
        <span
          className="text-xs font-bold tracking-widest uppercase truncate"
          style={{ color: "var(--os-accent)" }}
        >
          {win.fileNode.name}
        </span>

        {/* Window Controls */}
        <div className="flex items-center gap-1 ml-2">
          {/* Minimize */}
          <button
            className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold transition-opacity hover:opacity-100 opacity-70 cursor-pointer"
            style={{
              background: "rgba(82,211,214,0.15)",
              border: "1px solid rgba(82,211,214,0.3)",
              color: "var(--os-accent)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            title="Minimize"
          >
            _
          </button>
          {/* Maximize — hidden on mobile (auto-maximised already) */}
          {!isMobile && (
            <button
              className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold transition-opacity hover:opacity-100 opacity-70 cursor-pointer"
              style={{
                background: "rgba(82,211,214,0.15)",
                border: "1px solid rgba(82,211,214,0.3)",
                color: "var(--os-accent)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(win.id);
              }}
              title={win.isMaximized ? "Restore" : "Maximize"}
            >
              {win.isMaximized ? "❐" : "□"}
            </button>
          )}
          {/* Close */}
          <button
            className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold transition-colors hover:opacity-100 opacity-70 cursor-pointer"
            style={{
              background: "rgba(255,80,80,0.2)",
              border: "1px solid rgba(255,80,80,0.4)",
              color: "#ff6b6b",
            }}
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            title="Close"
          >
            ×
          </button>
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
              "linear-gradient(135deg, transparent 0%, transparent 50%, rgba(82,211,214,0.45) 50%, rgba(82,211,214,0.45) 60%, transparent 60%, transparent 70%, rgba(82,211,214,0.45) 70%, rgba(82,211,214,0.45) 80%, transparent 80%)",
          }}
          title="Resize"
        />
      )}
    </motion.div>
  );
}
