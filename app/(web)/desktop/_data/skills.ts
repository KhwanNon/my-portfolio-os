import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

// Flat folder — every skill area is one click from the Skills window.
//
// The skill names themselves are product names and stay put; the headings and
// the notes beside them are what a person wrote, and those translate. A note
// states verifiable context, never a made-up score, in either language.
export function skillsFolder(L: Localize): FileNode {
  return {
    id: "skills",
    name: "Skills",
    type: "folder",
    icon: ICONS.folder,
    data: {
      kind: "folder",
      children: [
        uiNode({ id: "skill-languages", name: "Languages.ui" }, "SkillsUI", {
          title: L("Programming Languages", "ภาษาโปรแกรม"),
          layout: "list",
          items: [
            {
              name: "Dart",
              note: L("production daily · since 2021", "ใช้ทุกวัน · ตั้งแต่ 2564"),
            },
            {
              name: "Go",
              note: L("production backend · current", "ใช้ทำ backend · ปัจจุบัน"),
            },
            {
              name: "TypeScript",
              note: L("production · since 2021", "ใช้งานจริง · ตั้งแต่ 2564"),
            },
            {
              name: "JavaScript",
              note: L("production · since 2021", "ใช้งานจริง · ตั้งแต่ 2564"),
            },
            {
              name: "SQL",
              note: L("production · schema design", "ใช้งานจริง · ออกแบบสคีมา"),
            },
            { name: "Python", note: L("familiar", "พอใช้งานได้") },
          ],
        }),
        uiNode({ id: "skill-frameworks", name: "Frameworks.ui" }, "SkillsUI", {
          title: L("Frameworks & Libraries", "เฟรมเวิร์กและไลบรารี"),
          layout: "list",
          items: [
            {
              name: "Flutter",
              note: L("production daily · since 2021", "ใช้ทุกวัน · ตั้งแต่ 2564"),
            },
            {
              name: "React Native",
              note: L("production · 2021–2023", "ใช้งานจริง · 2564–2566"),
            },
            {
              name: "Vue",
              note: L("production · current", "ใช้งานจริง · ปัจจุบัน"),
            },
            {
              name: "React",
              note: L("side projects · this site", "โปรเจกต์ส่วนตัว · เว็บนี้"),
            },
            {
              name: "Next.js",
              note: L("side projects · this site", "โปรเจกต์ส่วนตัว · เว็บนี้"),
            },
            {
              name: "Tailwind",
              note: L("daily on web work", "ใช้ประจำในงานเว็บ"),
            },
            { name: "Node.js", note: L("working knowledge", "ใช้งานได้") },
          ],
        }),
        uiNode({ id: "skill-backend", name: "Backend_Services.ui" }, "SkillsUI", {
          title: L("Backend & Services", "Backend และบริการต่าง ๆ"),
          layout: "badges",
          items: [
            { name: "SQL Server" },
            { name: "Redis" },
            { name: "RabbitMQ" },
            { name: "Firebase" },
            { name: "Firestore" },
            { name: "Firebase Auth" },
            { name: "Firebase FCM" },
            { name: "REST API" },
            { name: "Supabase" },
            { name: "GraphQL" },
          ],
        }),
        uiNode({ id: "skill-tools", name: "Tools.ui" }, "SkillsUI", {
          title: L("Design & DevOps Tools", "เครื่องมือดีไซน์และ DevOps"),
          layout: "badges",
          items: [
            { name: "Figma" },
            { name: "Adobe XD" },
            { name: "Zeplin" },
            { name: "InVision" },
            { name: "Git" },
            { name: "GitHub Actions" },
            { name: "Fastlane" },
            { name: "Docker" },
            { name: "Firebase App Distribution" },
            { name: "VS Code" },
            { name: "Android Studio" },
            { name: "Xcode" },
            { name: "Postman" },
          ],
        }),
        uiNode({ id: "skill-soft", name: "Soft_Skills.ui" }, "SoftSkillsUI", {
          skills: [
            {
              name: L("Leadership", "ความเป็นผู้นำ"),
              description: L(
                "Led teams of 3–6 developers, ran daily standups, code reviews, and sprint planning.",
                "เคยนำทีมนักพัฒนา 3–6 คน ดูแล daily standup การรีวิวโค้ด และการวางแผนสปรินต์",
              ),
            },
            {
              name: L("Problem Solving", "การแก้ปัญหา"),
              description: L(
                "Methodical debugger and root-cause analyst — comfortable with both logic and architecture problems.",
                "ไล่บั๊กอย่างเป็นระบบและหาสาเหตุที่แท้จริง ถนัดทั้งปัญหาเชิงตรรกะและปัญหาเชิงสถาปัตยกรรม",
              ),
            },
            {
              name: L("Fast Learner", "เรียนรู้เร็ว"),
              description: L(
                "Picked up React / Next.js independently while working full-time. Learn by doing, then by teaching.",
                "เรียน React / Next.js ด้วยตัวเองระหว่างทำงานประจำ เรียนรู้จากการลงมือทำ แล้วต่อยอดด้วยการสอนคนอื่น",
              ),
            },
            {
              name: L("Communication", "การสื่อสาร"),
              description: L(
                "Clear async writer. Can translate technical constraints into plain language for stakeholders.",
                "เขียนสื่อสารแบบ async ได้ชัดเจน แปลงข้อจำกัดทางเทคนิคให้เป็นภาษาที่ผู้เกี่ยวข้องเข้าใจได้",
              ),
            },
            {
              name: L("Ownership", "ความรับผิดชอบต่องาน"),
              description: L(
                "Ships features end-to-end — from requirements to deployment, monitoring, and post-release support.",
                "ดูแลฟีเจอร์ตั้งแต่ต้นจนจบ ตั้งแต่เก็บ requirement ไปจนถึงการดีพลอย ติดตามผล และซัพพอร์ตหลังปล่อยจริง",
              ),
            },
            {
              name: L("Adaptability", "การปรับตัว"),
              description: L(
                "Comfortable switching between tight deadlines and exploratory side projects without losing quality.",
                "สลับระหว่างงานที่เดดไลน์กระชั้นกับโปรเจกต์ทดลองส่วนตัวได้โดยคุณภาพงานไม่ตก",
              ),
            },
          ],
        }),
        {
          id: "skill-english",
          name: "English.txt",
          type: "txt",
          icon: ICONS.txt,
          data: {
            kind: "txt",
            content: L(
              `> ENGLISH_PROFICIENCY.TXT
> ─────────────────────────────────────────

  Level      :  Professional Working Proficiency
  Reading    :  ████████████  Advanced
  Writing    :  ████████████  Advanced
  Speaking   :  ██████████░░  Upper-Intermediate
  Listening  :  ████████████  Advanced

──────────────────────────────────────────────────────
  Can read and write technical documentation fluently.
  Comfortable with English-language code reviews,
  Slack communication, and async team collaboration.
──────────────────────────────────────────────────────

> EOF`,
              `> ENGLISH_PROFICIENCY.TXT
> ─────────────────────────────────────────

  ระดับ    :  ใช้ทำงานได้ในระดับมืออาชีพ
  การอ่าน  :  ████████████  ดีมาก
  การเขียน :  ████████████  ดีมาก
  การพูด   :  ██████████░░  ค่อนข้างดี
  การฟัง   :  ████████████  ดีมาก

──────────────────────────────────────────────────────
  อ่านและเขียนเอกสารทางเทคนิคได้คล่อง
  รีวิวโค้ดเป็นภาษาอังกฤษ คุยงานผ่าน Slack
  และทำงานร่วมกับทีมแบบ async ได้สบาย
──────────────────────────────────────────────────────

> จบไฟล์`,
            ),
          },
        },
      ],
    },
  };
}
