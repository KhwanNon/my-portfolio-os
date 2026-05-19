"use client";
import type { Toast } from "@/app/modules/desktop/context/window-manager-context";

const COLORS: Record<Toast["kind"], { fg: string; bg: string; border: string }> = {
  info:    { fg: "var(--os-accent)", bg: "rgba(82,211,214,0.10)",  border: "rgba(82,211,214,0.45)" },
  success: { fg: "#3ddc84",          bg: "rgba(61,220,132,0.10)",  border: "rgba(61,220,132,0.45)" },
  error:   { fg: "#ff6b6b",          bg: "rgba(255,107,107,0.10)", border: "rgba(255,107,107,0.45)" },
};

export function ToastStack({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed flex flex-col gap-2 font-os-mono text-[11px] tracking-wider pointer-events-none"
      style={{ right: 16, bottom: 66, zIndex: 9000 }}
    >
      {toasts.map((t) => {
        const c = COLORS[t.kind];
        return (
          <div
            key={t.id}
            className="px-3 py-2 rounded-sm shadow-lg animate-[fadeIn_0.18s_ease-out]"
            style={{
              color: c.fg,
              background: c.bg,
              border: `1px solid ${c.border}`,
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
