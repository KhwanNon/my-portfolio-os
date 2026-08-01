import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";

/**
 * The four lines the rail's craft card shows. They live here rather than in the
 * component because they are the headings of the file below — card and file are
 * one statement, and splitting them across two modules is how they drift apart.
 */
export function craftLines(L: Localize): string[] {
  return L(
    [
      "Best, but simplest.",
      "Thoughtful process.",
      "Clean craft.",
      "Always the standard.",
    ],
    [
      "ดีที่สุด แต่เรียบง่ายที่สุด",
      "คิดให้รอบก่อนลงมือ",
      "งานฝีมือที่สะอาด",
      "ยึดมาตรฐานเดียวเสมอ",
    ],
  );
}

/**
 * What the craft card opens. It sits at the root of the drive beside Profile
 * and Resume rather than inside C-DRIVE: it is a statement about the work, not
 * one of the folders the work is filed under. Being in the tree is what lets
 * search, the terminal and Properties find it; the card on the desktop is the
 * only shortcut to it, and the rail deliberately carries none.
 */
export function craftFile(L: Localize): FileNode {
  return {
    id: "khwan-craft-md",
    name: "khwan-craft.md",
    type: "txt",
    icon: ICONS.txt,
    data: {
      kind: "txt",
      content: L(
        `> KHWAN-CRAFT.MD — THE STANDARD
> ─────────────────────────────────────────

# Best, but simplest.

  Two requirements, not one. A solution that is clever but
  hard to follow has met half the bar, and so has one that
  is simple but does the job badly. The work is finished
  when the best answer and the simplest answer have become
  the same answer.

# Thoughtful process.

  Break the problem into parts small enough to be obvious.
  Research several genuinely different approaches — not one
  approach and two variations of it. Take what is right from
  each, then distill until there is nothing left to remove.

# Clean craft.

  Code is read far more often than it is written. Names say
  what a thing is; structure says how the pieces relate; a
  comment earns its place by explaining why, never what.
  The project itself should read as the example.

# Always the standard.

  The same bar applies whether or not anyone is watching,
  whether or not the deadline is close, and whether the file
  is the core of the product or a script run once. Habit and
  speed do not outrank it.

──────────────────────────────────────────────────────
  This file is the standard Portfolio OS itself is built to.
──────────────────────────────────────────────────────

> END OF FILE`,
        `> KHWAN-CRAFT.MD — มาตรฐานการทำงาน
> ─────────────────────────────────────────

# ดีที่สุด แต่เรียบง่ายที่สุด

  เป็นสองเงื่อนไข ไม่ใช่เงื่อนไขเดียว วิธีที่ฉลาดแต่ตามอ่านยาก
  ผ่านแค่ครึ่งเดียว วิธีที่ง่ายแต่แก้ปัญหาได้ไม่ดีก็เช่นกัน
  งานจะถือว่าเสร็จก็ต่อเมื่อคำตอบที่ดีที่สุดกับคำตอบที่เรียบง่าย
  ที่สุดกลายเป็นคำตอบเดียวกัน

# คิดให้รอบก่อนลงมือ

  ซอยปัญหาให้เล็กจนแต่ละส่วนชัดเจนในตัวเอง หาแนวทางที่ต่างกัน
  จริง ๆ หลายแนว ไม่ใช่แนวเดียวแล้วแตกย่อยอีกสองแบบ หยิบส่วนที่
  ถูกต้องจากแต่ละแนวมารวมกัน แล้วตัดทอนจนไม่เหลืออะไรให้ตัดอีก

# งานฝีมือที่สะอาด

  โค้ดถูกอ่านบ่อยกว่าถูกเขียนมาก ชื่อบอกว่าสิ่งนั้นคืออะไร
  โครงสร้างบอกว่าแต่ละส่วนสัมพันธ์กันอย่างไร ส่วนคอมเมนต์จะมี
  ที่ยืนได้ก็ต่อเมื่ออธิบายว่า "ทำไม" ไม่ใช่ "ทำอะไร"
  ตัวโปรเจกต์เองควรอ่านได้เหมือนเป็นตัวอย่าง

# ยึดมาตรฐานเดียวเสมอ

  ใช้เกณฑ์เดียวกันไม่ว่าจะมีคนดูอยู่หรือไม่ ไม่ว่าเดดไลน์จะใกล้
  แค่ไหน และไม่ว่าไฟล์นั้นจะเป็นหัวใจของโปรดักต์หรือสคริปต์ที่
  รันครั้งเดียวทิ้ง ความเคยชินและความเร็วไม่มีสิทธิ์เหนือกว่า

──────────────────────────────────────────────────────
  ไฟล์นี้คือมาตรฐานที่ Portfolio OS เองถูกสร้างขึ้นตาม
──────────────────────────────────────────────────────

> จบไฟล์`,
      ),
    },
  };
}
