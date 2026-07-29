// localStorage keys — single source of truth so keys never drift between features.
export const STORAGE_KEYS = {
  /** Selected colour scheme; re-applied before paint so there is no theme flash. */
  theme: "portfolio-os.theme",
} as const;
