// src/hooks/use-boot-sequence.ts
import { useState, useEffect, useCallback } from "react";
import { animate } from "framer-motion";
import { BOOT_STEPS, INITIAL_LOGS } from "../_constants/boot-config";

export function useBootSequence() {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Memoized log update logic
  const pushLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, msg].slice(-12));
  }, []);

  useEffect(() => {
    let isFinal = false;

    // 1. Background Log Noise
    const logInterval = setInterval(() => {
      if (isFinal) return;
      const randomLog =
        INITIAL_LOGS[Math.floor(Math.random() * INITIAL_LOGS.length)];
      pushLog(randomLog);
    }, 400);

    // 2. Main Boot Sequence
    const runSequence = async () => {
      await new Promise((r) => setTimeout(r, 800));
      setCurrentStep(1);

      await new Promise((r) => setTimeout(r, 800));
      setCurrentStep(2);

      // Framer Motion shared animation logic
      await animate(0, 100, {
        duration: 1.5,
        onUpdate: (v) => setPercent(Math.floor(v)),
      });

      setCurrentStep(3);
      await new Promise((r) => setTimeout(r, 1200));
      setCurrentStep(4);
      await new Promise((r) => setTimeout(r, 800));
      setCurrentStep(5);

      isFinal = true;
      clearInterval(logInterval);

      // Final System Dump
      const finalDump = ["[SYS] BOOT COMPLETE", "WELCOME, OPERATOR."];
      for (const msg of finalDump) {
        await new Promise((r) => setTimeout(r, 100));
        pushLog(msg);
      }
      setIsReady(true);
    };

    runSequence();
    return () => clearInterval(logInterval);
  }, [pushLog]);

  return {
    logs,
    currentStep,
    percent,
    isReady,
    stepText: BOOT_STEPS[currentStep],
  };
}
