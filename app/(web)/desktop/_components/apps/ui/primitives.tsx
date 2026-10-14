"use client";
// Shared visual building blocks for the portfolio UI components.

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{
        border: "1px solid var(--os-border)",
        background: "var(--os-surface-3)",
      }}
    >
      {children}
    </div>
  );
}

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-5 text-[13px] leading-relaxed space-y-4"
      style={{ background: "var(--os-surface)", color: "var(--os-text)" }}
    >
      {children}
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-baseline gap-3 py-1.5 border-b last:border-b-0"
      style={{ borderColor: "var(--os-border)" }}
    >
      <span className="opacity-60 text-[11px] w-24 shrink-0">{label}</span>
      <span className="break-all font-os-mono text-xs">{value}</span>
    </div>
  );
}
