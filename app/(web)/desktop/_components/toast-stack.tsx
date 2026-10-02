"use client";
import type { Toast } from "@/app/modules/desktop/context/window-manager-context";

const COLORS: Record<Toast["kind"], { fg: string; bg: string; border: string }> = {
  info: {
    fg: "var(--os-on-accent-container)",
    bg: "var(--os-accent-container)",
    border: "color-mix(in srgb, var(--os-accent) 45%, transparent)",
  },
  success: {
    fg: "var(--os-success)",
    bg: "color-mix(in srgb, var(--os-success) 12%, transparent)",
    border: "color-mix(in srgb, var(--os-success) 40%, transparent)",
  },
  error: {
    fg: "var(--os-error)",
    bg: "color-mix(in srgb, var(--os-error) 12%, transparent)",
    border: "color-mix(in srgb, var(--os-error) 40%, transparent)",
  },
};

export function ToastStack({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="font-os-pixel pointer-events-none fixed flex flex-col gap-3 text-[14px]"
      style={{
        right: 20,
        // Clear of the taskbar, by the same margin it keeps from the right.
        bottom: "calc(var(--os-dock-h) + 20px)",
        zIndex: 9000,
      }}
    >
      {toasts.map((t) => {
        const c = COLORS[t.kind];
        return (
          <div
            key={t.id}
            className="pixel-box px-3 py-2"
            style={
              {
                "--pb-color": c.border,
                color: c.fg,
                background: "#020a05",
                minWidth: 200,
                maxWidth: 360,
              } as React.CSSProperties
            }
          >
            {t.text}
          </div>
        );
      })}
    </div>
  );
}
