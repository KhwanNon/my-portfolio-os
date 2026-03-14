"use client";
import { useEffect, useRef } from "react";
import type { WindowInstance } from "@/app/modules/desktop/context/window-manager-context";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";

interface WindowFrameProps {
  window: WindowInstance;
  children: React.ReactNode;
}

export function WindowFrame({ window: win, children }: WindowFrameProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow } =
    useWindowManager();

  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });
  const moveRef = useRef(moveWindow);
  moveRef.current = moveWindow;

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDragging) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      const newX = dragState.current.startPosX + dx;
      const newY = dragState.current.startPosY + dy;
      moveRef.current(win.id, Math.max(0, newX), Math.max(0, newY));
    };
    const onMouseUp = () => {
      dragState.current.isDragging = false;
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
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: win.position.x,
      startPosY: win.position.y,
    };
    focusWindow(win.id);
  };

  if (win.isMinimized) return null;

  const style = win.isMaximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100% - 50px)",
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
    <div
      className="absolute flex flex-col rounded-sm overflow-hidden shadow-2xl"
      style={{
        ...style,
        border: "1px solid rgba(82,211,214,0.3)",
        background: "var(--os-surface)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(82,211,214,0.15)",
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-3 select-none cursor-move flex-shrink-0"
        style={{
          height: 36,
          background: "var(--os-header)",
          borderBottom: "1px solid rgba(82,211,214,0.2)",
        }}
        onMouseDown={handleTitleBarMouseDown}
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
          {/* Maximize */}
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
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
