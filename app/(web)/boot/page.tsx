// src/app/boot/page.tsx
"use client";
import { MatrixRain } from "@/app/shared/components/matrix-rain";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { markBooted } from "@/app/shared/state/boot-session";
import { useBootSequence } from "./_hooks/use-boot-sequence";
import { BootFooter } from "./_components/boot-footer";
import { StatusDisplay } from "./_components/status-display";

export default function BootScreen() {
  const router = useRouter();
  const { currentStep, percent, isReady, stepText } = useBootSequence();

  // The sequence runs itself and hands over when it is done. Nothing to press
  // and nothing to skip: a boot that asks for input isn't booting, it's a door.
  // `replace`, not `push`: with the sequence replaying on every load, leaving it
  // in history would mean Back lands on a boot screen that immediately boots
  // forward again — a door that closes itself.
  useEffect(() => {
    if (!isReady) return;
    markBooted();
    router.replace("/desktop");
  }, [isReady, router]);

  return (
    // The palette is the desktop's, inherited — the sequence boots in whichever
    // theme is set. `boot-shell` adds only the rain's own ramp on top of it (see
    // app/globals.css).
    <main className="boot-shell fixed inset-0 z-50 flex flex-col bg-os-bg text-os-text-dim font-os-mono overflow-hidden uppercase">
      {/* ── Ambient FX layers (back → front) ───────────────────────────────
            The desktop's own stack, reused: the three blooms it is lit by, then
            the paper veiling them. Negative depths keep the whole stack under
            the boot content but over `main`'s background. The rain falls on top
            of the veil, not under it — veiled, it would read as smudged paper
            rather than as characters. */}
      <div className="absolute inset-0 -z-30 bg-ambient-aura pointer-events-none" />
      <div className="absolute inset-0 -z-20 bg-desktop-veil pointer-events-none" />
      <MatrixRain opacity={0.09} />

      <div className="absolute inset-0 pointer-events-none z-60 bg-scanlines opacity-20" />

      <StatusDisplay
        stepText={stepText}
        percent={percent}
        isSyncing={currentStep === 2}
      />

      <BootFooter isComplete={currentStep === 5} />
    </main>
  );
}
