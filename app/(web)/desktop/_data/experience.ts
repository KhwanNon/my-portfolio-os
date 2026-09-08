import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";
import type { ProjectId } from "./projects";
import { uiNode } from "./ui-node";

// One company = one .ui file: role, highlights, tech stack, and link together.
//
// Company names and the tech stack stay as they are printed: a registered name
// is not a phrase to translate, and a Thai developer reads "Clean Architecture"
// as "Clean Architecture". What changes is everything a person wrote.
//
// The roles, the highlights and the stacks are the résumé's, said in this site's
// voice — a reader who has the PDF open in the next window should find the same
// four jobs making the same claims. Where the two could drift they don't: the
// résumé is the one that gets sent out, so it is the one that is followed.
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
          { id: "exp-zenith", name: "2025-2026 — Zenith Comp.ui" },
          "ExperienceUI",
          {
            role: L(
              "Mobile Developer / Full Stack Developer",
              "Mobile Developer / Full Stack Developer",
            ),
            company: L(
              "Zenith Comp Co., Ltd. — Bangkok, Thailand",
              "บริษัท ซีนิธ คอมพ์ จำกัด — กรุงเทพมหานคร",
            ),
            period: "09/2025 – 08/2026",
            duration: L("1 Year", "1 ปี"),
            description: L(
              "Full-stack role with end-to-end ownership of the mobile product, reaching into the Go backend, the database design, and the web platforms around it — through to delivery on the customer's own site.",
              "ทำงานแบบ full-stack รับผิดชอบโปรดักต์ฝั่งมือถือทั้งหมดด้วยตัวเอง ต่อเนื่องไปถึงงาน backend ด้วย Go การออกแบบฐานข้อมูล และแพลตฟอร์มฝั่งเว็บรอบ ๆ จนถึงการส่งมอบที่หน้างานของลูกค้า",
            ),
            highlights: L(
              [
                "Architected and built the Government Meeting System — an offline-first Flutter iPad app deployed across 50 devices, whose two-way sync engine and real-time WebSocket channel let a meeting run with no network and reconcile once one returns",
                "Designed the application's security architecture: AES-256-GCM encryption, secure key management, certificate pinning, device integrity checks, and fail-closed access controls",
                "Wrote the native Swift integrations behind encrypted PDF generation and dynamic watermarking",
                "Raised reliability and engineering quality across the app: content-hash change detection, automated foreground/background cleanup, mock-data tooling, GitHub Actions CI, iOS integration testing, coverage thresholds on the critical modules, and 11 Architecture Decision Records",
                "Extended the supporting Go backend with device synchronization, authentication flows, real-time communication, and system integrations",
                "Designed and implemented the SWU AI Platform administration system across database, backend and frontend — LDAP integration, a normalized RBAC architecture, dynamic permissions, user administration, and API key lifecycle",
                "Owned technical delivery across client projects, from requirement discovery and solution design to on-site presentations, troubleshooting, UAT support, and production rollout",
              ],
              [
                "ออกแบบและสร้างระบบการประชุมภาครัฐ แอป Flutter บน iPad แบบออฟไลน์เฟิร์สต์ ใช้งานจริงบนเครื่อง 50 เครื่อง มีเอนจินซิงก์สองทางและช่องทาง WebSocket แบบเรียลไทม์ ทำให้ประชุมเดินต่อได้แม้ไม่มีเน็ต แล้วค่อยปรับข้อมูลให้ตรงกันเมื่อกลับมาเชื่อมต่อ",
                "ออกแบบสถาปัตยกรรมความปลอดภัยของแอป ทั้งการเข้ารหัส AES-256-GCM การจัดการกุญแจ certificate pinning การตรวจสอบความสมบูรณ์ของเครื่อง และการควบคุมสิทธิ์แบบ fail-closed",
                "เขียนส่วนเชื่อมต่อเนทีฟด้วย Swift สำหรับสร้างไฟล์ PDF แบบเข้ารหัสและใส่ลายน้ำแบบไดนามิก",
                "ยกระดับความน่าเชื่อถือและคุณภาพเชิงวิศวกรรมของแอป ทั้งการตรวจจับความเปลี่ยนแปลงด้วย content hash การเคลียร์งานเบื้องหน้า/เบื้องหลังอัตโนมัติ เครื่องมือสร้างข้อมูลจำลอง CI บน GitHub Actions การทดสอบแบบ integration บน iOS เกณฑ์ coverage ของโมดูลสำคัญ และ Architecture Decision Record 11 ฉบับ",
                "ต่อยอด backend ฝั่ง Go ให้รองรับการซิงก์ข้อมูลของอุปกรณ์ การยืนยันตัวตน การสื่อสารแบบเรียลไทม์ และการเชื่อมต่อกับระบบอื่น",
                "ออกแบบและพัฒนาระบบผู้ดูแลของ SWU AI Platform ครบทั้งฐานข้อมูล หลังบ้าน และหน้าเว็บ ทั้งการเชื่อมต่อ LDAP โครงสร้าง RBAC ที่ normalize แล้ว การจัดการสิทธิ์แบบยืดหยุ่น การดูแลผู้ใช้ และวงจรชีวิตของ API key",
                "ดูแลการส่งมอบเชิงเทคนิคของหลายโปรเจกต์ ตั้งแต่เก็บ requirement ออกแบบแนวทาง นำเสนอที่หน้างาน แก้ปัญหา ดูแลช่วง UAT จนขึ้นใช้งานจริง",
              ],
            ),
            stack: [
              "Flutter",
              "Dart",
              "Go",
              "Swift",
              "Vue",
              "SvelteKit",
              "SQL Server",
              "PostgreSQL",
              "WebSocket",
              "GitHub Actions",
              "Git",
            ],
            projects: [
              "proj-gov-meeting",
              "proj-mol-portal",
              "proj-swu-ai",
            ] satisfies ProjectId[],
          },
        ),
        uiNode(
          { id: "exp-learncloud", name: "2024-2025 — LearnCloud.ui" },
          "ExperienceUI",
          {
            role: L(
              "Mobile Team Lead / Developer",
              "หัวหน้าทีมมือถือ / นักพัฒนา",
            ),
            company: L(
              "LearnCloud Co., Ltd. — Bangkok, Thailand",
              "บริษัท เลิร์นคลาวด์ จำกัด — กรุงเทพมหานคร",
            ),
            period: "01/2024 – 08/2025",
            duration: L("1 Year 8 Months", "1 ปี 8 เดือน"),
            description: L(
              "Led mobile development of aiLearn, an AI-powered exam preparation platform — the Flutter architecture underneath it, the real-time AI features on top, and every release that reached a store.",
              "นำการพัฒนาฝั่งมือถือของ aiLearn แพลตฟอร์มเตรียมสอบที่ขับเคลื่อนด้วย AI ทั้งโครงสร้าง Flutter ที่อยู่ข้างล่าง ฟีเจอร์ AI แบบเรียลไทม์ที่อยู่ข้างบน และทุกเวอร์ชันที่ส่งขึ้นสโตร์",
            ),
            highlights: L(
              [
                "Built aiLearn's core Flutter application from the ground up — complex exam flows, adaptive learning, and the performance visualization on top of them",
                "Built real-time AI learning features over SSE and WebSocket — generated explanations, performance analysis, and progress visualization",
                "Established the Flutter architecture from the ground up on Clean Architecture principles, so new features could land without the codebase fighting back",
                "Owned the mobile platform's capabilities: authentication, In-App Purchase, CI/CD workflows, and App Store / Google Play releases",
                "Translated product requirements into technical work for the team, alongside the product, design, AI, backend and DevOps teams",
                "Led a three-person junior mobile team while staying hands-on — planning the work, breaking down requirements, assigning and guiding implementation, and handling debugging and multi-environment deployments, run as Scrum sprints tracked in Jira",
              ],
              [
                "สร้างแอป Flutter หลักของ aiLearn ขึ้นใหม่ตั้งแต่ต้น ทั้งขั้นตอนการทำข้อสอบที่ซับซ้อน การเรียนรู้แบบปรับตามผู้เรียน และการแสดงผลการทำข้อสอบที่ต่อยอดจากตรงนั้น",
                "พัฒนาฟีเจอร์การเรียนด้วย AI แบบเรียลไทม์ผ่าน SSE และ WebSocket ทั้งคำอธิบายที่ AI สร้างให้ การวิเคราะห์ผลทำข้อสอบ และการแสดงความคืบหน้า",
                "วางโครงสร้าง Flutter ขึ้นใหม่ตั้งแต่ต้นด้วยหลัก Clean Architecture เพื่อให้เพิ่มฟีเจอร์ใหม่ได้โดยไม่ต้องฝืนกับโค้ดเดิม",
                "ดูแลความสามารถพื้นฐานของแอป ทั้งการยืนยันตัวตน การซื้อในแอป (In-App Purchase) เวิร์กโฟลว์ CI/CD และการปล่อยเวอร์ชันขึ้น App Store และ Google Play",
                "แปลความต้องการของโปรดักต์ออกมาเป็นงานเชิงเทคนิคให้ทีม โดยทำงานร่วมกับทีมโปรดักต์ ทีมดีไซน์ ทีม AI ทีม backend และทีม DevOps",
                "นำทีมมือถือระดับจูเนียร์ 3 คน โดยยังลงมือเขียนเองเป็นหลัก ทั้งวางแผนงาน แตกความต้องการออกเป็นงานย่อย มอบหมายและกำกับการลงมือทำ ดูแลการไล่บั๊กและการดีพลอยหลายสภาพแวดล้อม บริหารเป็นสปรินต์แบบ Scrum และติดตามผ่าน Jira",
              ],
            ),
            stack: [
              "Flutter",
              "Dart",
              "Clean Architecture",
              "WebSocket",
              "SSE",
              "GitHub Actions",
              "App Store Connect",
              "Play Console",
              "Jira",
            ],
            projects: ["proj-ailearn"] satisfies ProjectId[],
          },
        ),
        uiNode(
          { id: "exp-myorder", name: "2023 — MyOrder.ui" },
          "ExperienceUI",
          {
            role: L("Mobile Developer", "Mobile Developer"),
            company: L(
              "MyOrder Marketing Co., Ltd. — Chon Buri, Thailand",
              "บริษัท มายออเดอร์ มาร์เก็ตติ้ง จำกัด — ชลบุรี",
            ),
            period: "05/2023 – 12/2023",
            duration: L("8 Months", "8 เดือน"),
            description: L(
              "Built MyPinmall, a group-buying marketplace in Flutter, and shipped production features across the team's Flutter and React Native apps.",
              "สร้าง MyPinmall มาร์เก็ตเพลสแบบรวมกลุ่มซื้อด้วย Flutter และส่งฟีเจอร์ขึ้นใช้งานจริงทั้งในแอป Flutter และ React Native ของทีม",
            ),
            highlights: L(
              [
                "Built MyPinmall, a Flutter/Riverpod group-buying marketplace — tiered pricing, campaigns, group progress tracking, and social sharing",
                "Developed the shopping experience end to end: product catalog, cart, order tracking, and payment by QR, bank transfer, or cash on delivery",
                "Enhanced My Order, a React Native/TypeScript ordering application, and made it easier to keep — modular models, reusable components, UI separated from its logic, and custom hooks",
                "Delivered production features across both Flutter and React Native, from API design with the backend team through to App Store and Google Play releases",
              ],
              [
                "สร้าง MyPinmall มาร์เก็ตเพลสแบบรวมกลุ่มซื้อด้วย Flutter และ Riverpod ทั้งราคาแบบขั้นบันได แคมเปญ การติดตามความคืบหน้าของกลุ่ม และการแชร์ผ่านโซเชียล",
                "พัฒนาประสบการณ์การซื้อทั้งเส้นทาง ตั้งแต่หน้ารวมสินค้า ตะกร้า การติดตามคำสั่งซื้อ ไปจนถึงการชำระเงินด้วย QR โอนผ่านธนาคาร และเก็บเงินปลายทาง",
                "ต่อยอด My Order แอปสั่งสินค้าที่เขียนด้วย React Native และ TypeScript พร้อมทำให้ดูแลต่อได้ง่ายขึ้น ทั้งการแยกโมเดลเป็นส่วน ๆ คอมโพเนนต์ที่ใช้ซ้ำได้ การแยก UI ออกจากลอจิก และ custom hook",
                "ส่งฟีเจอร์ขึ้นใช้งานจริงทั้งฝั่ง Flutter และ React Native ตั้งแต่ออกแบบ API ร่วมกับทีม backend จนถึงปล่อยขึ้น App Store และ Google Play",
              ],
            ),
            stack: [
              "Flutter",
              "Dart",
              "Riverpod",
              "React Native",
              "TypeScript",
              "Git",
            ],
            projects: [
              "proj-mypinmall",
              "proj-myorder",
            ] satisfies ProjectId[],
          },
        ),
        uiNode(
          { id: "exp-minerta", name: "2021-2023 — Minerta.ui" },
          "ExperienceUI",
          {
            role: L("Mobile Developer", "Mobile Developer"),
            company: L(
              "Minerta Technology Co., Ltd. — Bangkok, Thailand",
              "บริษัท ไมเนอร์ต้า เทคโนโลยี จำกัด — กรุงเทพมหานคร",
            ),
            period: "09/2021 – 04/2023",
            duration: L("1 Year 8 Months", "1 ปี 8 เดือน"),
            description: L(
              "The first professional years: cross-platform apps in Flutter and React Native, web front ends in Nuxt — as the frontend and mobile side of a team whose backend was five people.",
              "ช่วงปีแรก ๆ ของการทำงาน พัฒนาแอปข้ามแพลตฟอร์มด้วย Flutter และ React Native ทำหน้าเว็บด้วย Nuxt ในฐานะกำลังหลักฝั่งหน้าบ้านและมือถือของทีมที่มี backend อยู่ห้าคน",
            ),
            highlights: L(
              [
                "Developed a real-time drone tracking platform with live GPS visualization, so an operator could follow an aircraft while it was still in the air",
                "Built cross-platform mobile applications in Flutter and React Native across several products, through to production releases on iOS and Android",
                "Developed responsive web features with Nuxt",
                "Served as the primary frontend/mobile developer alongside a five-person backend team, and supported the junior developers through the technical problems they got stuck on",
              ],
              [
                "พัฒนาแพลตฟอร์มติดตามโดรนแบบเรียลไทม์ พร้อมแสดงพิกัด GPS สด ให้ผู้ควบคุมตามตำแหน่งอากาศยานได้ตั้งแต่ตอนที่ยังบินอยู่",
                "พัฒนาแอปมือถือข้ามแพลตฟอร์มด้วย Flutter และ React Native ในหลายโปรดักต์ จนถึงปล่อยขึ้นใช้งานจริงทั้ง iOS และ Android",
                "พัฒนาฟีเจอร์ฝั่งเว็บแบบ responsive ด้วย Nuxt",
                "เป็นกำลังหลักฝั่งหน้าบ้านและมือถือ ทำงานคู่กับทีม backend ห้าคน และช่วยนักพัฒนารุ่นน้องแก้ปัญหาเชิงเทคนิคที่ติดอยู่",
              ],
            ),
            stack: [
              "Flutter",
              "Dart",
              "React Native",
              "TypeScript",
              "Nuxt",
              "Vue",
              "Git",
            ],
            projects: [
              "proj-vn",
              "proj-enfagrow",
              "proj-g2g",
              "proj-evp",
              "proj-the-blacklist",
            ] satisfies ProjectId[],
          },
        ),
      ],
    },
  };
}
