// localStorage keys — single source of truth so keys never drift between features.
export const STORAGE_KEYS = {
  /** Selected colour scheme; re-applied before paint so there is no theme flash. */
  theme: "portfolio-os.theme",
  /** Selected language; re-applied before paint, same as the theme above. */
  locale: "portfolio-os.locale",
} as const;
