"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ContextMenuState } from "@/app/modules/desktop/context/window-manager-context";

interface ContextMenuProps {
  menu: ContextMenuState;
  onClose: () => void;
}

export function ContextMenu({ menu, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: menu.x, y: menu.y });

  // Clamp position to viewport once the menu is measured.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = Math.min(menu.x, vw - rect.width - 4);
    const y = Math.min(menu.y, vh - rect.height - 4);
    setPos({ x: Math.max(4, x), y: Math.max(4, y) });
  }, [menu.x, menu.y]);

  // Dismiss on outside click, Escape, scroll, blur.
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    window.addEventListener("blur", onClose);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("blur", onClose);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      onContextMenu={(e) => e.preventDefault()}
      className="fixed font-os-mono text-[11px] tracking-wider rounded-sm overflow-hidden select-none"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: 10000,
        minWidth: 180,
        background: "var(--os-surface)",
        border: "1px solid rgba(82,211,214,0.4)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
      }}
    >
      {menu.items.map((item, i) =>
        item.separator ? (
          <div
            key={i}
            style={{
              height: 1,
              margin: "4px 6px",
              background: "rgba(82,211,214,0.18)",
            }}
          />
        ) : (
          <button
            key={i}
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onSelect?.();
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 transition-colors hover:bg-[rgba(82,211,214,0.12)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{
              color: "var(--os-accent)",
              background: "transparent",
              border: "none",
            }}
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  );
}
