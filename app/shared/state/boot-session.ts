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
