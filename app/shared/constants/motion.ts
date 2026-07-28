/** Shared spring used by every floating surface (windows, search panel) so they move in sync. */
export const SPRING_EXPRESSIVE = {
  type: "spring",
  stiffness: 380,
  damping: 28,
  mass: 0.6,
} as const;
