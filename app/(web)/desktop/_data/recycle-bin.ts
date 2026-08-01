import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";

/**
 * The two files in here are jokes, and a joke is the one kind of copy that
 * cannot be translated line for line — so the Thai is written to land in Thai
 * rather than to match the English word for word. Same setup, same punchline,
 * different sentences.
 */
export function recycleBin(L: Localize): FileNode {
  return {
    id: "recycle-bin",
    name: "Recycle Bin",
    type: "folder",
    icon: ICONS.recycle,
    data: {
      kind: "folder",
      children: [
        {
          id: "deleted-dreams",
          name: "deleted-dreams.txt",
          type: "txt",
          icon: ICONS.txt,
          data: {
            kind: "txt",
            content: L(
              `> RECYCLE BIN — SYSTEM DUMP LOG
> ─────────────────────────────────────────

  File: deleted-dreams.txt
  Status: Permanently deleted (or is it?)
  Date: 10/24/2024 03:14:59

> Contents recovered by deep-scan:

  - That one side project I swore I'd finish "this weekend"
  - "Temporary" CSS hacks that became permanent architecture
  - 47 drafts of a README that never shipped
  - Every "just 5 more minutes" that became 3am
  - The perfectly working code I refactored into bugs
  - npm packages installed "just to try it"
  - Stack Overflow answers I never went back to upvote

> SYSTEM NOTE:
  The recycle bin is never truly empty.
  Neither is the ambition of a developer.

  [ RESTORE ] [ DELETE PERMANENTLY ] [ Contemplate Existence ]

──────────────────────────────────────────────────────
EOF`,
              `> ถังขยะ — บันทึกไฟล์ที่ถูกทิ้ง
> ─────────────────────────────────────────

  ไฟล์: deleted-dreams.txt
  สถานะ: ลบถาวรแล้ว (หรือเปล่านะ?)
  วันที่: 24/10/2024 03:14:59

> เนื้อหาที่กู้คืนได้จากการสแกนเชิงลึก:

  - โปรเจกต์ส่วนตัวที่สาบานว่า "เสาร์อาทิตย์นี้เสร็จแน่"
  - CSS ที่แก้ไว้ "ชั่วคราว" แล้วกลายเป็นโครงสร้างถาวร
  - README ฉบับร่าง 47 เวอร์ชัน ที่ไม่เคยได้ปล่อยสักเวอร์ชัน
  - ทุกครั้งที่บอกว่า "อีก 5 นาที" แล้วจบที่ตีสาม
  - โค้ดที่ทำงานได้ดีอยู่แล้ว แต่รีแฟกเตอร์จนพัง
  - แพ็กเกจ npm ที่ลงไว้ "ลองเฉย ๆ"
  - คำตอบใน Stack Overflow ที่ตั้งใจจะกลับไปโหวตให้ แต่ไม่เคยกลับไป

> หมายเหตุจากระบบ:
  ถังขยะไม่เคยว่างเปล่าจริง ๆ
  เหมือนกับความทะเยอทะยานของนักพัฒนา

  [ กู้คืน ] [ ลบถาวร ] [ นั่งทบทวนชีวิต ]

──────────────────────────────────────────────────────
จบไฟล์`,
            ),
          },
        },
        {
          id: "old-bugs",
          name: "old-bugs.log",
          type: "txt",
          icon: ICONS.txt,
          data: {
            kind: "txt",
            content: L(
              `> BUG ARCHIVE — GRAVEYARD OF ISSUES
> ─────────────────────────────────────────

  [CLOSED] #0001 — "It works on my machine"
  Resolution: Shipped anyway. Became production.

  [CLOSED] #0042 — Undefined is not a function
  Resolution: Added || {} . Problem solved. Problem stayed solved.

  [CLOSED] #0099 — Why is this async?
  Resolution: It was always async. I just wasn't ready.

  [CLOSED] #0137 — CSS layout broken on Safari
  Resolution: Declared war on Safari. Settled for a -webkit- prefix.

  [CLOSED] #0201 — "Cannot read properties of null"
  Resolution: Added optional chaining everywhere.
               Added it in places that didn't need it too. Felt good.

  [CLOSED] #0404 — Feature not found
  Resolution: Feature was never specified. Invented it anyway.
              Users liked the invented version better.

──────────────────────────────────────────────────────
  Total bugs closed: ∞
  Total bugs remaining: also ∞
──────────────────────────────────────────────────────
EOF`,
              `> คลังบั๊กเก่า — สุสานของ issue
> ─────────────────────────────────────────

  [ปิดแล้ว] #0001 — "เครื่องผมรันได้นะ"
  วิธีแก้: ปล่อยขึ้นไปเลย แล้วมันก็กลายเป็น production

  [ปิดแล้ว] #0042 — Undefined is not a function
  วิธีแก้: เติม || {} ไป จบ และจบมาจนถึงทุกวันนี้

  [ปิดแล้ว] #0099 — ทำไมตรงนี้ต้อง async ด้วย
  วิธีแก้: มันเป็น async มาตลอด แค่ผมยังไม่พร้อมจะยอมรับ

  [ปิดแล้ว] #0137 — เลย์เอาต์ CSS พังบน Safari
  วิธีแก้: ประกาศสงครามกับ Safari สุดท้ายจบที่ prefix -webkit-

  [ปิดแล้ว] #0201 — "Cannot read properties of null"
  วิธีแก้: ใส่ optional chaining ทุกที่
           รวมถึงที่ที่ไม่ต้องใส่ก็ใส่ แต่ใส่แล้วสบายใจ

  [ปิดแล้ว] #0404 — ไม่พบฟีเจอร์นี้
  วิธีแก้: ไม่เคยมีใครระบุฟีเจอร์นี้ไว้ ก็เลยคิดขึ้นมาเอง
          ปรากฏว่าผู้ใช้ชอบเวอร์ชันที่คิดเองมากกว่า

──────────────────────────────────────────────────────
  บั๊กที่ปิดไปแล้ว: ∞
  บั๊กที่ยังเหลือ: ∞ เท่ากัน
──────────────────────────────────────────────────────
จบไฟล์`,
            ),
          },
        },
      ],
    },
  };
}
