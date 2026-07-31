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
      className="fixed flex flex-col gap-2 text-[12px] pointer-events-none"
      style={{
        right: 16,
        // Nothing to clear at the foot of the shell any more — the same margin
        // it keeps from the right edge is the whole of it.
        bottom: 16,
        zIndex: 9000,
      }}
    >
      {toasts.map((t) => {
        const c = COLORS[t.kind];
        return (
          <div
            key={t.id}
            className="px-3 py-2 rounded-md animate-[fadeIn_0.18s_ease-out]"
            style={{
              color: c.fg,
              background: c.bg,
              border: `1px solid ${c.border}`,
              boxShadow: "var(--shadow-2)",
              backdropFilter: "blur(4px)",
              minWidth: 200,
              maxWidth: 360,
            }}
          >
            {t.text}
          </div>
        );
      })}
    </div>
  );
}
