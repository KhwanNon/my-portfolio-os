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
  const { currentStep, percent, isReady, stepText, playing } = useBootSequence();

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
    // Fixed black-and-green palette, set by `boot-shell` (see app/globals.css) —
    // the machine powering on, before any theme applies.
    <main className="boot-shell fixed inset-0 z-50 flex flex-col bg-os-bg text-os-text-dim font-os-mono overflow-hidden uppercase">
      {/* Rain is the lowest layer; the clear patch and vignette sit over it but
          under the content, so the middle stays readable. Motion-only layers
          are gone the frame the sequence stops. */}
      {playing && <MatrixRain opacity={0.35} pixelScale={3} />}
      <div className="absolute inset-0 pointer-events-none -z-5 bg-boot-clear" />
      <div className="absolute inset-0 pointer-events-none -z-5 bg-boot-vignette" />
      {playing && (
        <>
          <div className="absolute inset-0 pointer-events-none z-60 bg-scanlines opacity-40" />
          <div className="absolute inset-0 pointer-events-none z-60 bg-boot-grain opacity-[0.06]" />
        </>
      )}
      <StatusDisplay
        stepText={stepText}
        percent={percent}
        isSyncing={currentStep === 2}
      />

      <BootFooter isComplete={currentStep === 5} />
    </main>
  );
}
