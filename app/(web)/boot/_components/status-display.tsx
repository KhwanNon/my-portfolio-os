// src/components/boot/status-display.tsx
import { FC } from "react";
import { motion } from "framer-motion";

interface StatusDisplayProps {
  stepText: string;
  percent: number;
  isSyncing: boolean;
}

export const StatusDisplay: FC<StatusDisplayProps> = ({
  stepText,
  percent,
  isSyncing,
}) => (
  <section className="flex-1 flex flex-col items-center justify-center relative z-0">
    <header className="absolute top-16 md:top-24 text-os-text-dim text-sm md:text-base tracking-[0.5em]">
      OS_BUILD_2026.01.31
    </header>

    <motion.p
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2.5 }}
      className="text-base md:text-xl tracking-[0.4em] mb-6 text-os-text-faint"
    >
      AUTH_REQ: ADMIN @ PORTFOLIO
    </motion.p>

    <motion.h1
      key={stepText}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="boot-glow text-3xl md:text-5xl font-normal tracking-[0.2em] text-os-text text-center px-4 leading-tight"
    >
      {`[ ${stepText} ]`}
      {isSyncing && (
        <span className="ml-4 inline-block min-w-15 text-os-accent">
          {percent}%
        </span>
      )}
      <span aria-hidden className="boot-cursor ml-1">
        _
      </span>
    </motion.h1>
  </section>
);
