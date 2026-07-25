"use client";
import { useEffect, useState } from "react";

function useLiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** Slowly-varying fake stat so the readout feels alive without distracting. */
function useFakeStat(baseline: number, jitter: number) {
  const [val, setVal] = useState(baseline);
  useEffect(() => {
    const id = setInterval(() => {
      setVal(() => {
        const next = baseline + (Math.random() - 0.5) * jitter * 2;
        return Math.max(5, Math.min(95, next));
      });
    }, 1800);
    return () => clearInterval(id);
  }, [baseline, jitter]);
  return val;
}

export function SystemBar() {
  const now = useLiveClock();
  const cpu = useFakeStat(34, 10);
  const ram = useFakeStat(62, 8);
  const net = useFakeStat(48, 16);

  const time =
    now?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }) ?? "--:--:--";

  return (
    <div
      className="relative flex items-center justify-between gap-2 px-3 sm:px-4 shrink-0 select-none"
      style={{
        height: 26,
        background: "var(--os-surface-3)",
        borderBottom: "1px solid var(--os-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "var(--os-text-dim)",
        zIndex: 300,
      }}
    >
      {/* Left — brand + connection state */}
      <div className="flex items-center gap-3 text-[10px] tracking-wide font-bold min-w-0 font-os-mono">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse-glow shrink-0"
          style={{
            background: "var(--os-accent)",
            boxShadow: "0 0 6px var(--os-accent)",
          }}
        />
        <span className="opacity-90 truncate">PORTFOLIO_OS</span>
        <span className="opacity-30 hidden sm:inline">v2.4.0</span>
        <span className="opacity-30 hidden lg:inline">·</span>
        <span className="opacity-50 hidden lg:inline">SECURE_CONN</span>
      </div>

      {/* Center — clickable Spotlight affordance */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("spotlight:toggle"))}
        className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md transition-colors hover:opacity-100 opacity-70 cursor-pointer"
        style={{
          border: "1px solid var(--os-border)",
          background: "var(--os-surface-1)",
          color: "var(--os-text-dim)",
        }}
        title="Search (⌘K)"
      >
        <span className="text-[10px] opacity-60 font-os-mono">›_</span>
        <span className="text-[10px] tracking-wide opacity-70">
          Search files, apps…
        </span>
        <kbd
          className="text-[9px] opacity-70 tracking-wide px-1.5 py-0.5 rounded-sm ml-2 font-os-mono"
          style={{
            border: "1px solid var(--os-border-strong)",
            background: "var(--os-surface-2)",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Right — stats + clock. Progressively reveal stats on wider screens. */}
      <div className="flex items-center gap-3 sm:gap-4 text-[10px] tracking-wide shrink-0 font-os-mono">
        <div className="hidden xl:block"><Stat label="CPU" value={cpu} /></div>
        <div className="hidden xl:block"><Stat label="MEM" value={ram} /></div>
        <div className="hidden 2xl:block"><Stat label="NET" value={net} /></div>
        <span className="font-bold tabular-nums opacity-90">{time}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 opacity-80">
      <span className="opacity-60">{label}</span>
      <div
        className="relative w-12 h-1.5 rounded-xs overflow-hidden"
        style={{ background: "var(--os-surface-1)" }}
      >
        <div
          className="absolute inset-y-0 left-0 transition-[width] duration-700"
          style={{
            width: `${Math.round(value)}%`,
            background: "var(--os-accent)",
          }}
        />
      </div>
      <span className="opacity-50 tabular-nums w-7 text-right">
        {Math.round(value)}%
      </span>
    </div>
  );
}
