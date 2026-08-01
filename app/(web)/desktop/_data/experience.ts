import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

// One company = one .ui file: role, highlights, tech stack, and link together.
//
// Company names and the tech stack stay as they are printed: a registered name
// is not a phrase to translate, and a Thai developer reads "Clean Architecture"
// as "Clean Architecture". What changes is everything a person wrote.
export function experienceFolder(L: Localize): FileNode {
  return {
    id: "experience",
    name: "Experience",
    type: "folder",
    icon: ICONS.folder,
    data: {
      kind: "folder",
      children: [
        uiNode(
          { id: "exp-zenith", name: "2025-Present — Zenith Comp.ui" },
          "ExperienceUI",
          {
            role: L(
              "Full-Stack Developer (Mobile-focused)",
              "Full-Stack Developer (เน้นงานฝั่งมือถือ)",
            ),
            company: L(
              "ZENITH COMP COMPANY LIMITED — Bangkok, Thailand",
              "บริษัท ซีนิธ คอมพ์ จำกัด — กรุงเทพมหานคร",
            ),
            period: L("09/2025 – Present", "09/2568 – ปัจจุบัน"),
            duration: L("10+ Months", "10+ เดือน"),
            description: L(
              "Full-stack role with end-to-end ownership of the mobile product — development, builds, delivery, and maintenance — plus backend, database design, web, and customer-facing work.",
              "ทำงานแบบ full-stack โดยรับผิดชอบโปรดักต์ฝั่งมือถือทั้งหมด ตั้งแต่พัฒนา ทำบิลด์ ส่งขึ้นสโตร์ ไปจนถึงดูแลต่อ ควบคู่กับงาน backend ออกแบบฐานข้อมูล งานเว็บ และงานที่ต้องคุยกับลูกค้าโดยตรง",
            ),
            highlights: L(
              [
                "Own the Flutter mobile app end-to-end: development, builds, store delivery, and ongoing maintenance",
                "Develop backend services in Go and design the SQL Server database schema",
                "Build web features with Vue and design UX/UI for selected features",
                "Adapted Open WebUI into the company's AI chat solution",
                "Write system analysis (SA) documents for delivered features",
                "Meet customers on-site to gather requirements and present solutions",
              ],
              [
                "ดูแลแอป Flutter ทั้งหมดด้วยตัวเอง ตั้งแต่พัฒนา ทำบิลด์ ส่งขึ้นสโตร์ จนถึงดูแลหลังส่งมอบ",
                "พัฒนา backend service ด้วย Go และออกแบบสคีมาฐานข้อมูลบน SQL Server",
                "พัฒนาฟีเจอร์ฝั่งเว็บด้วย Vue และออกแบบ UX/UI ให้บางฟีเจอร์",
                "ปรับ Open WebUI มาเป็นระบบแชต AI ของบริษัท",
                "เขียนเอกสารวิเคราะห์ระบบ (SA) ให้กับฟีเจอร์ที่ส่งมอบ",
                "เข้าพบลูกค้าที่หน้างานเพื่อเก็บ requirement และนำเสนอแนวทางแก้ปัญหา",
              ],
            ),
            stack: [
              "Flutter",
              "Dart",
              "Go",
              "Vue",
              "SQL Server",
              "Redis",
              "RabbitMQ",
              "Git",
            ],
          },
        ),
        uiNode(
          { id: "exp-learncloud", name: "2024-2025 — LearnCloud.ui" },
          "ExperienceUI",
          {
            role: L(
              "Mobile App Developer / Mobile Team Lead",
              "Mobile App Developer / หัวหน้าทีมมือถือ",
            ),
            company: L(
              "LEARNCLOUD CO., LTD. — Bangkok, Thailand",
              "บริษัท เลิร์นคลาวด์ จำกัด — กรุงเทพมหานคร",
            ),
            period: L("01/2024 – 09/2025", "01/2567 – 09/2568"),
            duration: L("1 Year 9 Months", "1 ปี 9 เดือน"),
            description: L(
              "Led Flutter development from scratch with Clean Architecture — from planning and UX/UI collaboration through store deployment and release management.",
              "นำทีมพัฒนาแอป Flutter ตั้งแต่เริ่มจากศูนย์ด้วย Clean Architecture ครอบคลุมตั้งแต่วางแผน ทำงานร่วมกับทีม UX/UI ไปจนถึงส่งขึ้นสโตร์และบริหารการปล่อยเวอร์ชัน",
            ),
            highlights: L(
              [
                "Led the development of Flutter applications from scratch, implementing Clean Architecture",
                "Collaborated with backend, AI, and design teams, contributing ideas and assisting in UX/UI design",
                "Participated in Scrum-based planning meetings to ensure smooth project execution",
                "Managed app deployment to both the App Store & Play Store",
                "Oversaw version control, release management, and test build distribution",
                "Served as Mobile Team Lead, assigning tasks and managing workflows using Jira",
              ],
              [
                "นำทีมพัฒนาแอป Flutter ตั้งแต่เริ่มจากศูนย์ โดยวางโครงด้วย Clean Architecture",
                "ทำงานร่วมกับทีม backend ทีม AI และทีมดีไซน์ เสนอไอเดียและช่วยออกแบบ UX/UI",
                "เข้าร่วมประชุมวางแผนแบบ Scrum เพื่อให้โปรเจกต์เดินหน้าได้ราบรื่น",
                "ดูแลการส่งแอปขึ้นทั้ง App Store และ Play Store",
                "ดูแลการควบคุมเวอร์ชัน การปล่อยรีลีส และการแจกบิลด์ให้ทีมทดสอบ",
                "รับหน้าที่หัวหน้าทีมมือถือ มอบหมายงานและบริหารเวิร์กโฟลว์ผ่าน Jira",
              ],
            ),
            stack: [
              "Flutter",
              "Dart",
              "Clean Architecture",
              "Git",
              "Jira",
              "App Store Connect",
              "Play Console",
            ],
          },
        ),
        uiNode(
          { id: "exp-myorder", name: "2023 — MyOrder.ui" },
          "ExperienceUI",
          {
            role: L("Mobile Developer", "Mobile Developer"),
            company: L(
              "MYORDER MARKETING CO., LTD. — Chon Buri, Thailand",
              "บริษัท มายออเดอร์ มาร์เก็ตติ้ง จำกัด — ชลบุรี",
            ),
            period: L("05/2023 – 10/2023", "05/2566 – 10/2566"),
            duration: L("6 Months", "6 เดือน"),
            description: L(
              "Developed and maintained cross-platform mobile applications with Flutter and React Native in a collaborative product team.",
              "พัฒนาและดูแลแอปมือถือแบบข้ามแพลตฟอร์มด้วย Flutter และ React Native ภายในทีมโปรดักต์ที่ทำงานร่วมกัน",
            ),
            highlights: L(
              [
                "Developed mobile applications using Flutter and React Native",
                "Worked with a team of developers to maintain and enhance applications",
                "Contributed to project planning, design discussions, and team meetings",
              ],
              [
                "พัฒนาแอปมือถือด้วย Flutter และ React Native",
                "ทำงานร่วมกับทีมนักพัฒนาในการดูแลและต่อยอดแอป",
                "มีส่วนร่วมในการวางแผนโปรเจกต์ ถกเรื่องดีไซน์ และประชุมทีม",
              ],
            ),
            stack: ["Flutter", "React Native", "TypeScript", "Dart", "Git"],
          },
        ),
        uiNode(
          { id: "exp-minerta", name: "2021-2023 — Minerta.ui" },
          "ExperienceUI",
          {
            role: L("Mobile Developer", "Mobile Developer"),
            company: L(
              "MINERTA TECHNOLOGY CO., LTD. — Bangkok, Thailand",
              "บริษัท ไมเนอร์ต้า เทคโนโลยี จำกัด — กรุงเทพมหานคร",
            ),
            period: L("09/2021 – 04/2023", "09/2564 – 04/2566"),
            duration: L("1 Year 8 Months", "1 ปี 8 เดือน"),
            description: L(
              "Built mobile and web applications while mentoring junior developers on best practices, code reviews, and maintainability.",
              "พัฒนาแอปมือถือและเว็บแอปพลิเคชัน พร้อมกับสอนงานน้อง ๆ ในทีมเรื่องแนวปฏิบัติที่ดี การรีวิวโค้ด และการเขียนโค้ดที่ดูแลต่อได้",
            ),
            highlights: L(
              [
                "Developed mobile and web applications",
                "Mentored junior developers, providing guidance on best practices, code reviews, and improving maintainability",
                "Worked in a collaborative team to maintain and enhance applications",
                "Assisted senior developers in coding, testing, and debugging mobile applications",
                "Participated in team meetings and contributed to project planning & design discussions",
              ],
              [
                "พัฒนาแอปมือถือและเว็บแอปพลิเคชัน",
                "สอนงานนักพัฒนารุ่นน้อง ให้คำแนะนำเรื่องแนวปฏิบัติที่ดี การรีวิวโค้ด และการทำให้โค้ดดูแลต่อได้ง่ายขึ้น",
                "ทำงานร่วมกับทีมในการดูแลและต่อยอดแอปที่มีอยู่",
                "ช่วยนักพัฒนาอาวุโสในการเขียนโค้ด ทดสอบ และไล่บั๊กแอปมือถือ",
                "เข้าร่วมประชุมทีมและมีส่วนร่วมในการวางแผนโปรเจกต์และถกเรื่องดีไซน์",
              ],
            ),
            stack: [
              "Flutter",
              "React Native",
              "Nuxt",
              "TypeScript",
              "Dart",
              "Git",
            ],
          },
        ),
      ],
    },
  };
}
