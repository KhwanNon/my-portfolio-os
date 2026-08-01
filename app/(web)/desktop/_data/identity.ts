import type { Localize } from "@/app/shared/i18n/locale";

/**
 * Where the dock's clock is telling the time *from*. It reads Bangkok rather
 * than the visitor's own zone on purpose: a visitor already knows their hour,
 * and what they cannot tell is whether an email lands here at nine in the
 * morning or two in the night.
 *
 * Outside `owner()` because a time zone is a fact about the machine, not
 * something either language has its own answer to.
 */
export const TIME_ZONE = "Asia/Bangkok";

export interface Owner {
  name: string;
  alias: string;
  /** The one line the home screen leads with — craft first, not credentials. */
  tagline: string;
  role: string;
  experience: string;
  stack: string;
}

/**
 * Who this portfolio belongs to. Every surface that states the name or the
 * role reads it from here, so there is one answer, in one place — one per
 * language, and a Thai reader is met by a Thai name rather than a transcription
 * of one.
 */
export function owner(L: Localize): Owner {
  return {
    name: L("Khwanchai Nontawichit", "ขวัญชัย นนทวิชิต"),
    alias: L("Khwan", "ขวัญ"),
    tagline: L(
      "Mobile developer. I build and ship Flutter apps end to end.",
      "นักพัฒนาแอปมือถือ ดูแลแอป Flutter ตั้งแต่เขียนจนขึ้นสโตร์",
    ),
    role: L("Mobile Developer · Full-Stack", "Mobile Developer · Full-Stack"),
    experience: L("4+ Years", "4+ ปี"),
    stack: "Flutter · Dart",
  };
}
