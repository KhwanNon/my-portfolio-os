"use client";
// Shared visual building blocks for the portfolio UI components.

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div
        className="text-xs font-bold tracking-[0.3em] uppercase"
        style={{ color: "var(--os-accent)" }}
      >
        {children}
      </div>
      <div className="mt-1 h-px opacity-15" style={{ background: "var(--os-accent)" }} />
    </div>
  );
}

export function Badge({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] tracking-widest rounded-sm mr-1 mb-1"
      style={{
        border: "1px solid rgba(82,211,214,0.35)",
        color: "var(--os-accent)",
        background: "rgba(82,211,214,0.06)",
      }}
    >
      {icon}
      {text}
    </span>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4 rounded-sm"
      style={{
        border: "1px solid rgba(82,211,214,0.15)",
        background: "rgba(82,211,214,0.03)",
      }}
    >
      {children}
    </div>
  );
}

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-5 font-os-mono text-xs space-y-4"
      style={{ background: "var(--os-surface)", color: "var(--os-accent)" }}
    >
      {children}
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-baseline gap-3 py-1 border-b last:border-b-0"
      style={{ borderColor: "rgba(82,211,214,0.08)" }}
    >
      <span className="opacity-40 text-[10px] tracking-widest uppercase w-24 shrink-0">{label}</span>
      <span className="break-all">{value}</span>
    </div>
  );
}
