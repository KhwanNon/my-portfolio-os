import type { WindowInstance } from "../context/window-manager-context";

/**
 * The window the user is working in: the visible one stacked highest. The
 * window manager keeps no separate "focused" field — z-order already says it —
 * so the frame and the taskbar both ask this rather than each deciding.
 */
export function activeWindowId(windows: WindowInstance[]): string | null {
  let top: WindowInstance | null = null;
  for (const w of windows) {
    if (!w.isMinimized && (!top || w.zIndex > top.zIndex)) top = w;
  }
  return top?.id ?? null;
}
