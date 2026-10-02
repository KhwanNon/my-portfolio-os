import type { Localize } from "@/app/shared/i18n/locale";

/** Who is talking: the owner, or the cat who keeps him company. */
export type Speaker = "khwan" | "cat";

export interface CompanionLine {
  speaker: Speaker;
  text: string;
}

/**
 * The welcome, as a two-hander: Khwan says hello, the cat chips in with how the
 * machine works. Each line is one thing a first visit needs, so a visitor who
 * reads to the end has been shown the whole shell without a manual.
 */
export function companionLines(L: Localize): CompanionLine[] {
  return [
    {
      speaker: "khwan",
      text: L(
        "Hey — welcome to my machine. I'm Khwan. Make yourself at home.",
        "สวัสดีครับ ยินดีต้อนรับสู่เครื่องของผม ผมชื่อขวัญ ตามสบายเลยนะ",
      ),
    },
    {
      speaker: "cat",
      text: L(
        "Mrrp. Double-click anything on the left to open it.",
        "เมี้ยว ดับเบิลคลิกอะไรก็ได้ทางซ้ายเพื่อเปิดดูนะ",
      ),
    },
    {
      speaker: "khwan",
      text: L(
        "Short on time? The ★ marks the projects worth opening first.",
        "มีเวลาไม่มาก? ดูโปรเจกต์ที่ติด ★ ก่อนเลย",
      ),
    },
    {
      speaker: "cat",
      text: L(
        "Press SEARCH, or Ctrl+K, to find anything on the drive. Meow.",
        "กด SEARCH หรือ Ctrl+K เพื่อค้นหาทุกอย่างในไดรฟ์ เมี้ยว",
      ),
    },
    {
      speaker: "khwan",
      text: L(
        "Want to talk? Contact.txt has every way to reach me. Have fun!",
        "อยากคุยกัน? เปิด Contact.txt ได้ทุกช่องทางเลย ขอให้สนุกนะ!",
      ),
    },
  ];
}

export const COMPANION_NAMES: Record<Speaker, (L: Localize) => string> = {
  khwan: (L) => L("KHWAN", "ขวัญ"),
  cat: (L) => L("NEKO", "เนโกะ"),
};
