import {
  currentValue,
  type Motion,
  type Startup,
} from "@/app/shared/settings/settings";

/*
 * Whether the boot sequence has already run in this page load.
 *
 * Deliberately a module-level value and not storage of any kind. The rule is
 * "every refresh boots", and a refresh is exactly what resets module state —
 * `localStorage` would remember across visits and `sessionStorage` across
 * refreshes, so both outlive the thing being tracked. Client-side navigation
 * keeps it, which is the whole point: the flag says "you came through the boot
 * screen just now", not "you have seen it before".
 */
let booted = false;

/** Called by the boot screen as it hands over to the desktop. */
export const markBooted = () => {
  booted = true;
};

export const hasBooted = () => booted;

/**
 * Whether an arrival gets the sequence at all. Two ways to say no, and both are
 * settled before the machine starts rather than during it — a boot that asks for
 * input isn't booting, it's a door:
 *
 *   - Startup is set to go straight to the desktop.
 *   - Motion is reduced. The sequence is three and a half seconds of pure
 *     movement with nothing in it to read, which is precisely what that setting
 *     is about.
 *
 * Takes the two values rather than reading them, so the same rule serves a
 * render and an effect: a render has to read preferences through the store's
 * React binding, or the server's answer and the browser's disagree across
 * hydration, and an effect can simply ask.
 */
export function bootSequenceWanted(startup: Startup, motion: Motion): boolean {
  return startup === "boot" && motion !== "reduced";
}

/** The same question, asked from an effect. */
export function wantsBootSequence(): boolean {
  return bootSequenceWanted(currentValue("startup"), currentValue("motion"));
}
