// src/app/main/_components/taskbar.tsx
"use client";

export const Taskbar = () => (
  <footer
    style={{ height: "50px" }}
    className="relative flex items-start justify-between px-8 z-50 bg-os-surface backdrop-blur-md overflow-hidden"
  >
    <div className="flex items-center gap-2">
      <span className="text-xs font-black tracking-[0.4em] glow-text">
        Taskbar
      </span>
    </div>

    <div className="flex items-center gap-6 text-xs opacity-80 tracking-widest font-bold">
      <span className="uppercase">Sat 10 Jan</span>
      <span className="text-os-accent border-b border-os-accent/30 leading-none pb-0.5">
        18:45
      </span>
    </div>
  </footer>
);
