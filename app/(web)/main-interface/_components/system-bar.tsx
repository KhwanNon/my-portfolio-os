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
        background: "color-mix(in srgb, var(--os-surface) 80%, transparent)",
        borderBottom: "1px solid rgba(82,211,214,0.18)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "var(--os-accent)",
        zIndex: 300,
      }}
    >
      {/* Left — brand + connection state */}
      <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] font-bold min-w-0">
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
        <span className="opacity-50 animate-flicker hidden lg:inline">
          SECURE_CONN
        </span>
      </div>

      {/* Center — clickable Spotlight affordance */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("spotlight:toggle"))}
        className="hidden md:flex items-center gap-2 px-3 py-1 rounded-sm transition-colors hover:opacity-100 opacity-70 cursor-pointer"
        style={{
          border: "1px solid rgba(82,211,214,0.2)",
          background: "rgba(82,211,214,0.04)",
          color: "var(--os-accent)",
        }}
        title="Search (⌘K)"
      >
        <span className="text-[10px] opacity-60">›_</span>
        <span className="text-[10px] tracking-[0.2em] opacity-70">
          Search files, apps…
        </span>
        <kbd
          className="text-[9px] opacity-70 tracking-widest px-1.5 py-0.5 rounded-sm ml-2"
          style={{
            border: "1px solid rgba(82,211,214,0.25)",
            background: "rgba(82,211,214,0.08)",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Right — stats + clock. Progressively reveal stats on wider screens. */}
      <div className="flex items-center gap-3 sm:gap-4 text-[10px] tracking-widest shrink-0">
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
        className="relative w-12 h-1.5 rounded-sm overflow-hidden"
        style={{ background: "rgba(82,211,214,0.1)" }}
      >
        <div
          className="absolute inset-y-0 left-0 transition-[width] duration-700"
          style={{
            width: `${Math.round(value)}%`,
            background:
              "linear-gradient(to right, color-mix(in srgb, var(--os-accent) 70%, transparent), var(--os-accent))",
            boxShadow: "0 0 6px color-mix(in srgb, var(--os-accent) 60%, transparent)",
          }}
        />
      </div>
      <span className="opacity-50 tabular-nums w-7 text-right">
        {Math.round(value)}%
      </span>
    </div>
  );
}
