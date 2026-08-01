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
            "Hello! I'm Khwanchai Nontawichit (Khwan) — a Mobile Developer from Thailand with 4+ years of professional Flutter experience, currently in a full-stack role where I own the mobile product end-to-end and also work across Go backends, database design, and web. I specialize in Clean Architecture and love building apps that are fast, maintainable, and a joy to use. I lead teams, mentor juniors, and care deeply about code quality and shipping reliable products.",
            "สวัสดีครับ ผมขวัญชัย นนทวิชิต (ขวัญ) เป็นนักพัฒนาแอปมือถือจากประเทศไทย มีประสบการณ์ทำงานกับ Flutter แบบมืออาชีพมากกว่า 4 ปี ปัจจุบันทำงานในบทบาท full-stack ที่ดูแลโปรดักต์ฝั่งมือถือทั้งหมดตั้งแต่ต้นจนจบ พร้อมกับทำ backend ด้วย Go ออกแบบฐานข้อมูล และงานเว็บ ผมถนัด Clean Architecture และชอบสร้างแอปที่ทำงานเร็ว ดูแลต่อได้ง่าย และใช้แล้วรู้สึกดี เคยนำทีม สอนงานน้อง ๆ และให้ความสำคัญกับคุณภาพโค้ดและการส่งมอบงานที่เชื่อถือได้",
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
                "Side projects, exploring new frameworks, contributing to open source.",
                "ทำโปรเจกต์ส่วนตัว ลองเฟรมเวิร์กใหม่ ๆ และร่วมพัฒนาโอเพนซอร์ส",
              ),
            },
            {
              name: L("Gaming", "เล่นเกม"),
              emoji: "🎮",
              description: L(
                "Strategy and RPG games. Appreciates good UX even in games.",
                "ชอบเกมวางแผนและ RPG และมองหา UX ที่ดีแม้กระทั่งในเกม",
              ),
            },
            {
              name: L("Coffee", "กาแฟ"),
              emoji: "☕",
              description: L(
                "Serious about coffee. Prefers coding with a good pour-over.",
                "จริงจังกับกาแฟ ชอบเขียนโค้ดคู่กับดริปสักแก้ว",
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
                "Exploring new cities and cultures when offline.",
                "ออกไปดูเมืองใหม่และวัฒนธรรมใหม่ในวันที่ไม่ได้อยู่หน้าจอ",
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
  Audio      :  Headphones for focus sessions

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
  เสียง      :  หูฟังสำหรับช่วงที่ต้องโฟกัส

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
