"use client";
// Shared visual building blocks for the portfolio UI components.

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div
        className="font-os-pixel text-[15px] font-bold tracking-[0.16em] uppercase"
        style={{ color: "var(--os-accent)", textShadow: "2px 2px 0 #000" }}
      >
        {children}
      </div>
      {/* A dotted rule, one block high: a game's divider, not a hairline. */}
      <div
        className="mt-1.5 h-[3px]"
        style={{
          background:
            "repeating-linear-gradient(to right, var(--os-border-strong) 0 3px, transparent 3px 6px)",
        }}
      />
    </div>
  );
}

export function Badge({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <span
      className="pixel-btn font-os-pixel mr-1 mb-1 inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px]"
      style={{
        color: "var(--os-on-accent-container)",
        background: "var(--os-accent-container)",
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
