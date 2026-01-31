// src/app/boot/page.tsx
"use client";
import { MatrixRain } from "@/app/shared/components/matrix-rain";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useBootSequence } from "./_hooks/use-boot-sequence";
import { BootFooter } from "./_components/boot-footer";
import { LogViewer } from "./_components/log-viewer";
import { StatusDisplay } from "./_components/status-display";

export default function BootScreen() {
  const router = useRouter();
  const { logs, currentStep, percent, isReady, stepText } = useBootSequence();

  const handleInitialize = useCallback(() => {
    router.push("/main-interface");
  }, [router]);

  // Keyboard Event Listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isReady && e.key === "Enter") {
        handleInitialize();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isReady, handleInitialize]);

  return (
    <main className="fixed inset-0 z-50 flex flex-col bg-os-bg text-os-accent font-os-mono overflow-hidden uppercase">
      {/* Visual FX Layers */}
      <div className="absolute inset-0 pointer-events-none z-60 bg-scanlines opacity-20" />
      <MatrixRain opacity={0.15} speedMultiplier={0.8} />

      <LogViewer logs={logs} />

      <StatusDisplay
        stepText={stepText}
        percent={percent}
        isSyncing={currentStep === 2}
        isReady={isReady}
        onInitialize={handleInitialize}
      />

      <BootFooter isComplete={currentStep === 5} />
    </main>
  );
}
