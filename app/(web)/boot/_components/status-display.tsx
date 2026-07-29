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
    <header className="absolute top-24 text-os-text-subtle text-[10px] tracking-[0.5em]">
      OS_BUILD_2026.01.31
    </header>

    <motion.p
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2.5 }}
      className="text-xs md:text-sm tracking-[0.4em] mb-6 text-os-text-faint"
    >
      AUTH_REQ: CREATIVE_PROTOCOL_v11
    </motion.p>

    <motion.h1
      key={stepText}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-xl md:text-3xl font-black tracking-[0.2em] text-os-text text-center px-4 leading-tight"
    >
      {`[ ${stepText} ]`}
      {isSyncing && (
        <span className="ml-4 inline-block min-w-15 text-os-accent">
          {percent}%
        </span>
      )}
    </motion.h1>
  </section>
);
