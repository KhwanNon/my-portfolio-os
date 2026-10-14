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

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let progressAnimation: ReturnType<typeof animate> | undefined;
    const pause = (duration: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, duration);
      });

    const runSequence = async () => {
      await pause(400);
      if (cancelled) return;
      setCurrentStep(1);

      await pause(400);
      if (cancelled) return;
      setCurrentStep(2);

      // Framer Motion shared animation logic
      progressAnimation = animate(0, 100, {
        duration: 1.2,
        onUpdate: (v) => {
          if (!cancelled) setPercent(Math.floor(v));
        },
      });
      await progressAnimation;
      if (cancelled) return;

      setCurrentStep(3);
      await pause(600);
      if (cancelled) return;
      setCurrentStep(4);
      await pause(500);
      if (cancelled) return;
      setCurrentStep(LAST_STEP);

      // Nothing to press any more, so this beat is the only thing standing
      // between the final step appearing and the desktop replacing it. Shorten
      // it and `WELCOME_ADMIN` is gone before it can be read.
      await pause(500);
      if (cancelled) return;
      setIsReady(true);
    };

    runSequence();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      progressAnimation?.stop();
    };
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
