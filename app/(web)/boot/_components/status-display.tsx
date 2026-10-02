// src/components/boot/status-display.tsx
import { FC } from "react";
import { motion } from "framer-motion";

interface StatusDisplayProps {
  stepText: string;
  percent: number;
  isSyncing: boolean;
}

/** How long the loading bar takes to fill — the length of the whole sequence. */
const BOOT_SECONDS = 3.3;
/** Blocks in the loading bar; it fills one whole block at a time. */
const SEGMENTS = 20;

/** Motion in whole frames, the way a sprite animates. */
const steps = (n: number) => (t: number) => Math.floor(t * n) / n;

export const StatusDisplay: FC<StatusDisplayProps> = ({
  stepText,
  percent,
  isSyncing,
}) => (
  <section className="relative z-0 flex flex-1 flex-col items-center justify-center px-4">
    <header className="font-os-pixel absolute top-16 text-sm tracking-[0.4em] text-os-text-dim md:top-24 md:text-base">
      OS_BUILD_2026.10
    </header>

    {/* Blinks on and off in whole frames, like a game's "press start". */}
    <motion.p
      animate={{ opacity: [1, 0.25, 1] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: steps(2) }}
      className="mb-8 text-center text-base tracking-[0.2em] text-os-text-faint md:text-2xl md:tracking-[0.35em]"
    >
      AUTH_REQ: ADMIN @ PORTFOLIO
    </motion.p>

    {/* The step, in a game's dialog box: a lit pixel frame and a hard shadow. */}
    <div
      className="pixel-box os-window max-w-full bg-black px-4 py-4 md:px-10 md:py-7"
      data-active="true"
    >
      <motion.h1
        key={stepText}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18, ease: steps(3) }}
        className="boot-glow font-os-pixel text-center text-lg font-bold leading-tight tracking-[0.06em] text-os-text sm:text-2xl md:text-5xl md:tracking-[0.12em]"
      >
        {`[ ${stepText} ]`}
        {isSyncing && (
          <span className="ml-2 inline-block min-w-15 text-os-accent md:ml-4">
            {percent}%
          </span>
        )}
        <span aria-hidden className="boot-cursor ml-1">
          _
        </span>
      </motion.h1>
    </div>

    <LoadingBar />
  </section>
);

/**
 * A game's loading bar: a framed track that fills a whole block at a time, with
 * its label over it. Timed against the sequence rather than reading it, because
 * the steps are uneven and a bar that stalls on one reads as a hang.
 */
const LoadingBar: FC = () => (
  <div className="mt-12 w-[min(440px,86vw)]">
    <motion.p
      animate={{ opacity: [1, 0.25, 1] }}
      transition={{ repeat: Infinity, duration: 0.9, ease: steps(2) }}
      className="font-os-pixel mb-3 text-center text-sm tracking-[0.3em] text-os-text-faint md:text-base"
    >
      NOW LOADING
    </motion.p>
    <div className="pixel-box bg-black p-1.5">
      <div className="relative h-4 md:h-5">
        {/* The empty track, then the same row lit and uncovered from the left
            a whole block at a time. */}
        <Blocks className="bg-[#0b2415]" />
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: BOOT_SECONDS, ease: steps(SEGMENTS) }}
        >
          <Blocks className="bg-os-accent" />
        </motion.div>
      </div>
    </div>
  </div>
);

/** One row of the bar's cells, with a dark seam between each. */
const Blocks: FC<{ className: string }> = ({ className }) => (
  <div className="absolute inset-0 flex gap-[3px]">
    {Array.from({ length: SEGMENTS }, (_, i) => (
      <span key={i} className={`h-full flex-1 ${className}`} />
    ))}
  </div>
);
