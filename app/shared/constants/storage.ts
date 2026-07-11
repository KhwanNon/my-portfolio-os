// localStorage keys — single source of truth so keys never drift between features.
export const STORAGE_KEYS = {
  /** Set once the visitor reaches the desktop; later visits to `/` skip the boot screen. */
  hasBooted: "portfolio-os.has-booted",
} as const;
