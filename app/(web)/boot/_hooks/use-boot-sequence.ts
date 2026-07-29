// src/hooks/use-boot-sequence.ts
import { useState, useEffect } from "react";
import { animate } from "framer-motion";
import { BOOT_STEPS } from "../_constants/boot-config";

export function useBootSequence() {
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const runSequence = async () => {
      await new Promise((r) => setTimeout(r, 400));
      setCurrentStep(1);

      await new Promise((r) => setTimeout(r, 400));
      setCurrentStep(2);

      // Framer Motion shared animation logic
      await animate(0, 100, {
        duration: 1.2,
        onUpdate: (v) => setPercent(Math.floor(v)),
      });

      setCurrentStep(3);
      await new Promise((r) => setTimeout(r, 600));
      setCurrentStep(4);
      await new Promise((r) => setTimeout(r, 500));
      setCurrentStep(5);

      // Nothing to press any more, so this beat is the only thing standing
      // between the final step appearing and the desktop replacing it. Shorten
      // it and `OVERRIDE_SUCCESSFUL` is gone before it can be read.
      await new Promise((r) => setTimeout(r, 500));
      setIsReady(true);
    };

    runSequence();
  }, []);

  return {
    currentStep,
    percent,
    isReady,
    stepText: BOOT_STEPS[currentStep],
  };
}
