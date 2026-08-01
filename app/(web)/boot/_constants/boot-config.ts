/**
 * What the start-up screen counts through, in order. Six steps, because the
 * sequence is timed against this list — see `use-boot-sequence`.
 *
 * Each one names something this machine genuinely does on the way up. The
 * screen is a pastiche and is meant to be, but a step that describes nothing —
 * a handshake with no hardware, an override with nothing to override — is the
 * point where the pastiche stops being a machine and starts being a costume.
 */
export const BOOT_STEPS = [
  "BOOTING_SYSTEM_CORE",
  "MOUNTING_C-DRIVE",
  "LOADING_PORTFOLIO_DATA",
  "STARTING_WINDOW_MANAGER",
  "SESSION_ESTABLISHED",
  "WELCOME_ADMIN",
];
