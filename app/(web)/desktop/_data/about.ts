import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";
import { owner } from "./identity";

// Flat folder — the bio first, personality files after. Contact was here and is
// now its own dock slot; see `_data/contact.ts` for why it left.
export function aboutFolder(L: Localize): FileNode {
  const OWNER = owner(L);

  return {
    id: "about",
    name: "About",
    type: "folder",
    icon: ICONS.folder,
    data: {
      kind: "folder",
      children: [
        uiNode({ id: "about-me", name: "me.ui" }, "PersonalBioUI", {
          bio: L(
            "I'm Khwanchai Nontawichit — Khwan — a mobile developer from Thailand with 4+ years of professional Flutter work behind me. I'm in a full-stack role now: the mobile product is mine end to end, and I also write Go services, design the database, and take on web work. I build on Clean Architecture, I've led a mobile team and mentored the juniors on it, and I would rather ship something that holds up than something that only demos well.",
            "สวัสดีครับ ผมขวัญชัย นนทวิชิต ชื่อเล่นขวัญ เป็นนักพัฒนาแอปมือถือจากประเทศไทย ทำงานกับ Flutter แบบมืออาชีพมา 4 ปีกว่า ตอนนี้อยู่ในบทบาท full-stack ดูแลโปรดักต์ฝั่งมือถือทั้งหมดด้วยตัวเอง ควบคู่กับเขียนเซอร์วิสด้วย Go ออกแบบฐานข้อมูล และรับงานฝั่งเว็บ ผมวางโครงสร้างงานด้วย Clean Architecture เคยนำทีมมือถือและสอนงานน้องในทีม และเลือกส่งงานที่อยู่ได้จริงมากกว่างานที่ดูดีแค่ตอนเดโม",
          ),
          facts: [
            { label: L("Name", "ชื่อ"), value: OWNER.name },
            { label: L("Alias", "ชื่อเล่น"), value: OWNER.alias },
            {
              label: L("Location", "ที่อยู่"),
              value: L("Bangkok, Thailand", "กรุงเทพมหานคร ประเทศไทย"),
            },
            { label: L("Role", "ตำแหน่ง"), value: OWNER.role },
            { label: L("Experience", "ประสบการณ์"), value: OWNER.experience },
            { label: L("Main Stack", "สแตกหลัก"), value: OWNER.stack },
            {
              label: L("Languages", "ภาษา"),
              value: L("Thai · English", "ไทย · อังกฤษ"),
            },
            {
              label: L("Status", "สถานะ"),
              value: L("Open to Opportunities", "เปิดรับโอกาสใหม่"),
            },
          ],
        }),
        uiNode({ id: "about-hobbies", name: "hobbies.ui" }, "HobbiesUI", {
          items: [
            {
              name: L("Coding", "เขียนโค้ด"),
              emoji: "💻",
              description: L(
                "Side projects, new frameworks, the odd open-source contribution.",
                "ทำโปรเจกต์ส่วนตัว ลองเฟรมเวิร์กใหม่ ๆ และแวะช่วยงานโอเพนซอร์สบ้าง",
              ),
            },
            {
              name: L("Gaming", "เล่นเกม"),
              emoji: "🎮",
              description: L(
                "Strategy and RPGs. Still reading the UX while I play.",
                "ชอบเกมวางแผนกับ RPG และยังอดดู UX ระหว่างเล่นไม่ได้",
              ),
            },
            {
              name: L("Coffee", "กาแฟ"),
              emoji: "☕",
              description: L(
                "Serious about it. A pour-over on the desk most mornings.",
                "จริงจังกับกาแฟ เกือบทุกเช้าจะมีดริปวางอยู่บนโต๊ะ",
              ),
            },
            {
              name: L("Reading", "อ่านหนังสือ"),
              emoji: "📖",
              description: L(
                "Tech blogs, architecture books, and the occasional manga.",
                "บล็อกสายเทค หนังสือสถาปัตยกรรมซอฟต์แวร์ และมังงะเป็นครั้งคราว",
              ),
            },
            {
              name: L("Music", "ดนตรี"),
              emoji: "🎵",
              description: L(
                "Lo-fi and jazz while coding. Silence for debugging.",
                "ฟัง lo-fi กับแจ๊สตอนเขียนโค้ด แต่ต้องเงียบสนิทตอนไล่บั๊ก",
              ),
            },
            {
              name: L("Traveling", "เดินทาง"),
              emoji: "✈️",
              description: L(
                "New cities and cultures, on the days I'm away from a screen.",
                "ออกไปดูเมืองใหม่ ๆ ในวันที่ไม่ได้อยู่หน้าจอ",
              ),
            },
          ],
        }),
        {
          id: "about-setup",
          name: "setup.txt",
          type: "txt",
          icon: ICONS.txt,
          data: {
            kind: "txt",
            content: L(
              `> WORKSTATION_SETUP.TXT
> ─────────────────────────────────────────

  HARDWARE
  ──────────────────────────────────────────────────────
  Machine    :  MacBook Pro / Windows PC (dual setup)
  Display    :  27" Monitor + Laptop screen
  Input      :  Mechanical keyboard · Mouse
  Audio      :  Headphones, when the room needs to go quiet

  EDITOR & TOOLS
  ──────────────────────────────────────────────────────
  Editor     :  VS Code + Android Studio
  Theme      :  One Dark Pro / Cyberpunk
  Font       :  JetBrains Mono
  Terminal   :  Zsh + Oh My Zsh
  Browser    :  Chrome (dev) + Arc

  DAILY WORKFLOW
  ──────────────────────────────────────────────────────
  Version Control  :  Git + GitHub
  Tasks            :  Notion / Linear
  Design Handoff   :  Figma
  Communication    :  Slack + Line

> EOF`,
              `> WORKSTATION_SETUP.TXT
> ─────────────────────────────────────────

  ฮาร์ดแวร์
  ──────────────────────────────────────────────────────
  เครื่อง     :  MacBook Pro / Windows PC (ใช้คู่กัน)
  จอภาพ      :  จอ 27 นิ้ว + จอโน้ตบุ๊ก
  อินพุต     :  คีย์บอร์ดแมคคานิคอล · เมาส์
  เสียง      :  หูฟัง สำหรับตอนที่ต้องการความเงียบ

  เอดิเตอร์และเครื่องมือ
  ──────────────────────────────────────────────────────
  เอดิเตอร์   :  VS Code + Android Studio
  ธีม        :  One Dark Pro / Cyberpunk
  ฟอนต์      :  JetBrains Mono
  เทอร์มินัล  :  Zsh + Oh My Zsh
  เบราว์เซอร์ :  Chrome (สำหรับ dev) + Arc

  การทำงานประจำวัน
  ──────────────────────────────────────────────────────
  ควบคุมเวอร์ชัน  :  Git + GitHub
  จัดการงาน      :  Notion / Linear
  รับงานดีไซน์    :  Figma
  สื่อสารในทีม    :  Slack + Line

> จบไฟล์`,
            ),
          },
        },
      ],
    },
  };
}
