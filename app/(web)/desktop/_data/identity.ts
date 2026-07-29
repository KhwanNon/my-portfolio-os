/**
 * Who this portfolio belongs to. Every surface that states the name or the
 * role reads it from here, so there is one answer, in one place.
 */
export const OWNER = {
  name: "Khwanchai Nontawichit",
  alias: "Khwan",
  /** The one line the home screen leads with — craft first, not credentials. */
  tagline: "Mobile developer. I build and ship Flutter apps end to end.",
  role: "Mobile Developer · Full-Stack",
  experience: "4+ Years",
  stack: "Flutter · Dart",

  /**
   * Where the dock's clock is telling the time *from*. It reads Bangkok rather
   * than the visitor's own zone on purpose: a visitor already knows their hour,
   * and what they cannot tell is whether an email lands here at nine in the
   * morning or two in the night.
   */
  timeZone: "Asia/Bangkok",
} as const;
