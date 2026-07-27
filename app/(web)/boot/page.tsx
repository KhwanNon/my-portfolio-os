// src/app/boot/page.tsx
"use client";
import { MatrixRain } from "@/app/shared/components/matrix-rain";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/app/shared/constants/storage";
import { useBootSequence } from "./_hooks/use-boot-sequence";
import { BootFooter } from "./_components/boot-footer";
import { LogViewer } from "./_components/log-viewer";
import { StatusDisplay } from "./_components/status-display";

export default function BootScreen() {
  const router = useRouter();
  const { logs, currentStep, percent, isReady, stepText } = useBootSequence();

  const handleInitialize = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.hasBooted, "1");
    router.push("/main-interface");
  }, [router]);

  // Any key or click enters the desktop — mid-sequence it acts as a skip.
  useEffect(() => {
    window.addEventListener("keydown", handleInitialize);
    window.addEventListener("pointerdown", handleInitialize);
    return () => {
      window.removeEventListener("keydown", handleInitialize);
      window.removeEventListener("pointerdown", handleInitialize);
    };
  }, [handleInitialize]);

  return (
    // The boot sequence is a CRT moment — it stays dark whatever the desktop theme is.
    <main
      data-theme="dark"
      className="fixed inset-0 z-50 flex flex-col bg-os-bg text-os-accent font-os-mono overflow-hidden uppercase"
    >
      {/* Visual FX Layers */}
      <div className="absolute inset-0 pointer-events-none z-60 bg-scanlines opacity-20" />
      <MatrixRain opacity={0.4} />

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
