// localStorage keys — single source of truth so keys never drift between features.
export const STORAGE_KEYS = {
  /** Set once the visitor reaches the desktop; later visits to `/` skip the boot screen. */
  hasBooted: "portfolio-os.has-booted",
  /** Selected colour scheme; re-applied before paint so there is no theme flash. */
  theme: "portfolio-os.theme",
} as const;
