import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

// Flat folder — every skill area is one click from the Skills window.
//
// The skill names themselves are product names and stay put; the headings, the
// notes and the descriptions are what a person wrote, and those translate. A
// note states verifiable context, never a made-up score, in either language.
//
// Four windows, one for each of the résumé's groups, holding its entries in its
// order — a visitor with both open should not have to work out which is current.
// What the résumé has no room for, this adds: where each was used, and a line or
// two on what the thing actually is, for the reader who knows a name without
// knowing what it does. What the résumé leaves out is left out here too — the
// editors, the design tools and the rest of the desk are not skills, and a list
// long enough to include them is a list nobody finishes reading.
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
          items: [
            {
              name: "Dart",
              note: L("production daily · since 2021", "ใช้ทุกวัน · ตั้งแต่ 2021"),
              description: L(
                "The language Flutter is written in — typed, and compiled ahead of time for release builds.",
                "ภาษาที่ Flutter ใช้ กำหนดชนิดข้อมูลชัดเจน และคอมไพล์ล่วงหน้าตอนสร้างตัวจริง",
              ),
            },
            {
              name: "TypeScript",
              note: L("production · web platforms", "ใช้งานจริง · งานเว็บ"),
              description: L(
                "JavaScript with types — a wrong shape is caught while writing, not once the browser runs it.",
                "JavaScript ที่มีชนิดข้อมูล จับข้อมูลผิดรูปได้ตั้งแต่ตอนเขียน ไม่ต้องรอให้เบราว์เซอร์รัน",
              ),
            },
            {
              name: "Go",
              note: L("production backend · current", "ใช้ทำ backend · ปัจจุบัน"),
              description: L(
                "Compiled and built for concurrency — what the backend services here are written in.",
                "ภาษาคอมไพล์ที่ออกแบบมาให้ทำงานพร้อมกันหลายอย่าง ใช้เขียนเซอร์วิสฝั่งหลังบ้าน",
              ),
            },
            {
              name: "Python",
              note: L("familiar", "พอใช้งานได้"),
              description: L(
                "Scripting and data work, where a task is faster written than engineered.",
                "ใช้เขียนสคริปต์และงานข้อมูล สำหรับงานที่เขียนเสร็จเร็วกว่าลงมือทำเป็นระบบ",
              ),
            },
            {
              name: "Kotlin",
              note: L("native Android integration", "เชื่อมต่อฝั่ง Android"),
              description: L(
                "Android's own language — where a Flutter app has to reach the platform itself.",
                "ภาษาหลักของฝั่ง Android ใช้ตอนที่แอป Flutter ต้องลงไปคุยกับตัวระบบเอง",
              ),
            },
            {
              name: "SQL",
              note: L("production · schema design", "ใช้งานจริง · ออกแบบสคีมา"),
              description: L(
                "How a relational database is asked a question — and how its tables are shaped in the first place.",
                "ภาษาที่ใช้ถามข้อมูลจากฐานข้อมูลเชิงสัมพันธ์ และใช้ออกแบบตารางตั้งแต่แรก",
              ),
            },
            {
              name: "C/C++",
              note: L("llama.cpp via Dart FFI", "llama.cpp ผ่าน Dart FFI"),
              description: L(
                "Native code with no runtime in between — how llama.cpp runs on the device in Langridge.",
                "โค้ดเนทีฟที่ไม่มีรันไทม์มาคั่น เป็นวิธีที่ Langridge รัน llama.cpp บนเครื่องผู้ใช้",
              ),
            },
          ],
        }),
        uiNode({ id: "skill-mobile", name: "Mobile.ui" }, "SkillsUI", {
          title: L("Mobile Development", "การพัฒนาแอปมือถือ"),
          items: [
            {
              name: "Flutter",
              note: L("production daily · since 2021", "ใช้ทุกวัน · ตั้งแต่ 2021"),
              description: L(
                "One Dart codebase that draws its own interface on iOS, Android, web and desktop.",
                "เขียน Dart ชุดเดียว แล้ววาดหน้าจอเองทั้งบน iOS, Android, เว็บ และเดสก์ท็อป",
              ),
            },
            {
              name: "React Native",
              note: L("production · 2021–2023", "ใช้งานจริง · 2021–2023"),
              description: L(
                "React written for mobile, rendered through each platform's own native views.",
                "เขียนแอปมือถือด้วย React แล้วเรนเดอร์ผ่านคอมโพเนนต์เนทีฟของแต่ละแพลตฟอร์ม",
              ),
            },
            {
              name: "Clean Architecture",
              note: L("aiLearn · from the ground up", "aiLearn · วางตั้งแต่ต้น"),
              description: L(
                "Layers that depend inward, so the rules of the business survive a change of UI or database.",
                "แบ่งเลเยอร์ให้พึ่งพาเข้าข้างใน กติกาของธุรกิจจึงอยู่รอดแม้เปลี่ยน UI หรือฐานข้อมูล",
              ),
            },
            {
              name: "Mobile Architecture",
              note: L("set the standard for the team", "วางมาตรฐานให้ทั้งทีม"),
              description: L(
                "State, navigation and module boundaries decided once, so a team can add features without collisions.",
                "ตัดสินใจเรื่อง state การนำทาง และขอบเขตของโมดูลไว้ครั้งเดียว ทีมจึงเพิ่มฟีเจอร์ได้โดยไม่ชนกัน",
              ),
            },
            {
              name: "Offline-first Systems",
              note: L("two-way sync · meeting system", "ซิงก์สองทาง · ระบบการประชุม"),
              description: L(
                "The device works from its own database first; the server is reconciled with once it is reachable again.",
                "ให้เครื่องทำงานจากฐานข้อมูลของตัวเองก่อน แล้วค่อยปรับให้ตรงกับเซิร์ฟเวอร์เมื่อกลับมาเชื่อมต่อได้",
              ),
            },
            {
              name: "Performance Optimization",
              note: L("on-device LLM · isolates", "รัน LLM บนเครื่อง · isolates"),
              description: L(
                "Finding what makes a frame arrive late, and moving the heavy work off the thread that draws.",
                "หาสาเหตุที่ทำให้เฟรมมาช้า แล้วย้ายงานหนักออกจากเธรดที่ทำหน้าที่วาดหน้าจอ",
              ),
            },
            {
              name: "Native Integration",
              note: L("Swift · Kotlin · platform channels", "Swift · Kotlin · platform channel"),
              description: L(
                "A channel down to Swift or Kotlin for the things a cross-platform framework has no answer for.",
                "เปิดช่องลงไปเขียน Swift หรือ Kotlin สำหรับงานที่เฟรมเวิร์กข้ามแพลตฟอร์มทำให้ไม่ได้",
              ),
            },
          ],
        }),
        uiNode({ id: "skill-backend", name: "Backend & Web.ui" }, "SkillsUI", {
          title: L("Backend & Web", "Backend และเว็บ"),
          items: [
            {
              name: "Go",
              note: L("Echo · GORM · production", "Echo · GORM · ใช้งานจริง"),
              description: L(
                "Echo routes the HTTP side and GORM speaks to the database — the shape every service here takes.",
                "ใช้ Echo จัดการฝั่ง HTTP และ GORM คุยกับฐานข้อมูล เป็นรูปแบบที่เซอร์วิสทุกตัวใช้",
              ),
            },
            {
              name: "Next.js",
              note: L("this site", "เว็บนี้"),
              description: L(
                "React with routing and server rendering already decided. This site is one.",
                "React ที่มีระบบ routing และการเรนเดอร์ฝั่งเซิร์ฟเวอร์มาให้พร้อม เว็บนี้ก็สร้างด้วยตัวนี้",
              ),
            },
            {
              name: "SvelteKit",
              note: L("side projects", "โปรเจกต์ส่วนตัว"),
              description: L(
                "Compiles components away at build time, so very little framework is shipped to the browser.",
                "คอมไพล์คอมโพเนนต์ทิ้งตั้งแต่ตอน build เบราว์เซอร์จึงแทบไม่ต้องโหลดตัวเฟรมเวิร์กเลย",
              ),
            },
            {
              name: "Vue 3",
              note: L("production · web work", "ใช้งานจริง · งานเว็บ"),
              description: L(
                "The Composition API — reactive state kept next to the markup that reads it.",
                "ใช้ Composition API เก็บ state แบบ reactive ไว้ข้าง ๆ ส่วนที่เรียกใช้จริง",
              ),
            },
            {
              name: "REST API Design",
              note: L("Go services · client apps", "ฝั่ง Go และฝั่งแอป"),
              description: L(
                "Resources, methods and status codes chosen so a client can guess the next call and be right.",
                "เลือก resource, method และ status code ให้ฝั่งผู้ใช้เดาการเรียกครั้งถัดไปได้ถูก",
              ),
            },
            {
              name: "WebSocket",
              note: L("real-time AI · aiLearn", "AI แบบเรียลไทม์ · aiLearn"),
              description: L(
                "One connection held open with both ends free to speak — what live features are built on.",
                "เปิดการเชื่อมต่อค้างไว้เส้นเดียว คุยได้ทั้งสองฝั่ง เป็นพื้นฐานของฟีเจอร์แบบเรียลไทม์",
              ),
            },
            {
              name: "Server-Sent Events (SSE)",
              note: L("streamed AI explanations", "สตรีมคำอธิบายจาก AI"),
              description: L(
                "A one-way stream from server to browser — how an AI answer arrives a word at a time.",
                "สตรีมทางเดียวจากเซิร์ฟเวอร์มาที่เบราว์เซอร์ เป็นวิธีที่คำตอบจาก AI ทยอยมาทีละคำ",
              ),
            },
          ],
        }),
        uiNode({ id: "skill-data", name: "Data & Infrastructure.ui" }, "SkillsUI", {
          title: L("Data & Infrastructure", "ข้อมูลและโครงสร้างพื้นฐาน"),
          items: [
            {
              name: "SQLite",
              note: L("offline-first apps", "แอปแบบออฟไลน์เฟิร์สต์"),
              description: L(
                "A whole relational database living in a single file on the device.",
                "ฐานข้อมูลเชิงสัมพันธ์ทั้งก้อน อยู่ในไฟล์เดียวบนเครื่องผู้ใช้",
              ),
            },
            {
              name: "Drift",
              note: L("Flutter · local data layer", "Flutter · เลเยอร์ข้อมูลในเครื่อง"),
              description: L(
                "SQLite for Dart with the queries type-checked at compile time rather than at the user's expense.",
                "ใช้ SQLite ใน Dart โดยตรวจคำสั่งค้นข้อมูลตั้งแต่ตอนคอมไพล์ ไม่ใช่ไปพังตอนผู้ใช้กด",
              ),
            },
            {
              name: "PostgreSQL",
              note: L("production · SWU AI Platform", "ใช้งานจริง · SWU AI Platform"),
              description: L(
                "The open-source relational database the services default to.",
                "ฐานข้อมูลเชิงสัมพันธ์แบบโอเพนซอร์ส เป็นตัวเลือกตั้งต้นของเซอร์วิสที่เขียน",
              ),
            },
            {
              name: "SQL Server",
              note: L("production · meeting system", "ใช้งานจริง · ระบบการประชุม"),
              description: L(
                "Microsoft's relational database — where an enterprise client's data already lives.",
                "ฐานข้อมูลเชิงสัมพันธ์ของ Microsoft เป็นที่ที่ข้อมูลขององค์กรลูกค้าอยู่ก่อนแล้ว",
              ),
            },
            {
              name: "Firebase Firestore",
              note: L("production apps", "ใช้ในแอปจริง"),
              description: L(
                "A hosted document database that syncs down to the client and keeps working offline.",
                "ฐานข้อมูลแบบเอกสารบนคลาวด์ ซิงก์ลงมาที่เครื่องและยังทำงานต่อได้ตอนออฟไลน์",
              ),
            },
            {
              name: "Docker",
              note: L("service packaging", "แพ็กเซอร์วิส"),
              description: L(
                "A service and everything it depends on in one image, which runs the same everywhere.",
                "แพ็กเซอร์วิสกับทุกอย่างที่มันต้องใช้ไว้ในอิมเมจเดียว เอาไปรันที่ไหนก็ได้ผลเหมือนกัน",
              ),
            },
            {
              name: "GitHub Actions",
              note: L("CI · app releases", "CI · ปล่อยเวอร์ชันแอป"),
              description: L(
                "Build, test and release triggered by a push, with no machine left to babysit.",
                "สั่ง build ทดสอบ และปล่อยเวอร์ชันอัตโนมัติตั้งแต่ตอน push โดยไม่ต้องมีคนคอยเฝ้าเครื่อง",
              ),
            },
            {
              name: "CI/CD",
              note: L("App Store · Google Play", "App Store · Google Play"),
              description: L(
                "Every commit built and tested, so a release is a pipeline run rather than an afternoon.",
                "ทุกคอมมิตถูก build และทดสอบ การปล่อยเวอร์ชันจึงเป็นแค่การรันไปป์ไลน์ ไม่ใช่งานทั้งบ่าย",
              ),
            },
          ],
        }),
      ],
    },
  };
}
