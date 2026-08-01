"use client";
import { useCallback, useSyncExternalStore } from "react";
import {
  baselineValue,
  choose,
  currentChoice,
  currentValue,
  initialChoice,
  subscribe,
  type Choices,
  type PreferenceId,
} from "./settings";

/**
 * One preference, bound to React.
 *
 * `choice` is what the visitor picked — what a picker ticks, "system" included.
 * `value` is what that comes out as, and is what anything rendering from the
 * setting should read.
 *
 * No provider: the store is a module, so every reader of the same preference is
 * looking at the same two functions and stays in step without one. Before
 * hydration both fall back to the baseline, which is all a server render can
 * honestly know — the document already carries the real value, written by the
 * pre-paint script, so nothing on screen is wrong in the meantime.
 */
export function useSetting<I extends PreferenceId>(id: I) {
  const choice = useSyncExternalStore(
    subscribe,
    () => currentChoice(id),
    () => initialChoice(id),
  );
  const value = useSyncExternalStore(
    subscribe,
    () => currentValue(id),
    () => baselineValue(id),
  );
  const set = useCallback((next: Choices[I]) => choose(id, next), [id]);

  return { choice, value, set };
}
