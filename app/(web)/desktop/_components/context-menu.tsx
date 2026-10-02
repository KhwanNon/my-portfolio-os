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

  // Clamp position once the menu is measured, so a menu opened near an edge
  // flips back inside it rather than off the screen.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(menu.x, window.innerWidth - rect.width - 4);
    const y = Math.min(menu.y, window.innerHeight - rect.height - 4);
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
      className="pixel-box font-os-pixel fixed select-none overflow-hidden py-1 text-[14px]"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: 10000,
        minWidth: 190,
        background: "#020a05",
      }}
    >
      {menu.items.map((item, i) =>
        item.separator ? (
          <div
            key={i}
            style={{
              height: 0,
              margin: "4px 6px",
              borderTop: "2px dashed #1e5a36",
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
            // The item under the pointer inverts, the way a game menu marks it.
            className="w-full cursor-pointer border-none bg-transparent px-3 py-1 text-left text-os-text hover:bg-os-accent hover:text-[#021a0c] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-os-text"
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  );
}
