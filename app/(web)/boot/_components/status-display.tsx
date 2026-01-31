// src/components/boot/status-display.tsx
import { FC } from "react";
import { motion } from "framer-motion";

interface StatusDisplayProps {
  stepText: string;
  percent: number;
  isSyncing: boolean;
  isReady: boolean;
  onInitialize: () => void;
}

export const StatusDisplay: FC<StatusDisplayProps> = ({
  stepText,
  percent,
  isSyncing,
  isReady,
  onInitialize,
}) => (
  <section className="flex-1 flex flex-col items-center justify-center relative z-0">
    <header className="absolute top-24 opacity-30 text-[10px] tracking-[0.5em]">
      OS_BUILD_2026.01.31
    </header>

    <motion.p
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ repeat: Infinity, duration: 2.5 }}
      className="text-xs md:text-sm tracking-[0.4em] mb-6 text-os-accent/80"
    >
      AUTH_REQ: CREATIVE_PROTOCOL_v11
    </motion.p>

    <motion.h1
      key={stepText}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-xl md:text-3xl font-black tracking-[0.2em] glow-text text-center px-4 leading-tight"
    >
      {`[ ${stepText} ]`}
      {isSyncing && (
        <span className="ml-4 inline-block min-w-15 text-os-accent">
          {percent}%
        </span>
      )}
    </motion.h1>

    {isReady && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-20 flex flex-col items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 0px #52D3D6",
              "0 0 20px #52D3D6",
              "0 0 0px #52D3D6",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={onInitialize}
          className="bg-os-accent/10 border border-os-accent/30 text-os-accent px-8 py-3 cursor-pointer tracking-[0.4em] text-sm md:text-lg font-bold hover:bg-os-accent hover:text-os-bg transition-all duration-300 outline-none"
        >
          INITIALIZE_SESSION
        </motion.button>
        <span className="text-[10px] opacity-40 tracking-[0.2em] animate-pulse">
          INPUT_REQUIRED: [ENTER_KEY]
        </span>
      </motion.div>
    )}
  </section>
);
