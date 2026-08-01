// src/hooks/use-boot-sequence.ts
import { useState, useEffect } from "react";
import { animate } from "framer-motion";
import { useSetting } from "@/app/shared/settings/use-setting";
import { BOOT_STEPS } from "../_constants/boot-config";

const LAST_STEP = BOOT_STEPS.length - 1;

/**
 * The start-up sequence, and whether it plays at all.
 *
 * Reduced motion stops it: the sequence is three and a half seconds of pure
 * movement with nothing in it to read, which is precisely what that setting is
 * about. The routes into /boot ask the same question before sending anyone here
 * (see `wantsBootSequence`); this answers it for whoever arrived by link, which
 * is the only way to reach the sequence having asked for less of it.
 *
 * A sequence that isn't playing reads as one already finished, worked out from
 * the preference rather than written into state — so the first frame is right
 * without a render having to correct it.
 */
export function useBootSequence() {
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const { value: motion } = useSetting("motion");
  const playing = motion !== "reduced";

  useEffect(() => {
    if (!playing) return;

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
      setCurrentStep(LAST_STEP);

      // Nothing to press any more, so this beat is the only thing standing
      // between the final step appearing and the desktop replacing it. Shorten
      // it and `WELCOME_ADMIN` is gone before it can be read.
      await new Promise((r) => setTimeout(r, 500));
      setIsReady(true);
    };

    runSequence();
  }, [playing]);

  const step = playing ? currentStep : LAST_STEP;

  return {
    currentStep: step,
    percent: playing ? percent : 100,
    isReady: isReady || !playing,
    stepText: BOOT_STEPS[step],
    playing,
  };
}
