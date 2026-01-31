// src/components/boot/log-viewer.tsx
import { FC } from "react";

interface LogViewerProps {
  logs: string[];
}

export const LogViewer: FC<LogViewerProps> = ({ logs }) => (
  <aside className="absolute top-8 left-8 w-full max-w-md pointer-events-none z-10 hidden md:block">
    <div className="flex flex-col gap-1 opacity-60">
      <p className="mb-2 text-os-accent border-b border-os-accent/30 pb-1 w-fit text-[10px] tracking-widest">
        INTERNAL_SYSTEM_LOG_v1.0
      </p>
      {logs.map((log, i) => (
        <div
          key={`${log}-${i}`}
          className={`text-[9px] font-light tracking-tighter ${
            log.includes("[WAR]") ? "text-yellow-500" : ""
          }`}
        >
          {`> ${log}`}
        </div>
      ))}
    </div>
  </aside>
);
