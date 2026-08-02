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
  /**
   * The one line the home screen leads with — craft first, not credentials. It
   * says how the work is done rather than what the job is called, because the
   * title is in the résumé one click away and the standard is not written down
   * anywhere else a visitor would look. See `khwan-craft.md` for it in full.
   */
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
      "I keep at a thing until the best answer and the simplest one are the same answer.",
      "นักพัฒนาแอปมือถือ ทำซ้ำจนกว่าคำตอบที่ดีที่สุดกับคำตอบที่เรียบง่ายที่สุดจะเป็นอันเดียวกัน",
    ),
    role: L(
      "Mobile Developer · Full Stack Developer",
      "Mobile Developer · Full Stack Developer",
    ),
    experience: L("4+ Years", "4+ ปี"),
    stack: "Flutter · Dart",
  };
}
