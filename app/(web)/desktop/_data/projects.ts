import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import type { UiComponentProps } from "../_components/apps/ui-registry";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

/**
 * One project = one .ui file: description, screenshots, stack, and link
 * together. `featured` is authored once here and read twice — by the window,
 * and by the folders above it, which inherit the mark.
 */
function makeProject(
  id: string,
  props: UiComponentProps<"ProjectUI">,
): FileNode {
  return uiNode(
    { id, name: `${props.name}.ui`, featured: props.featured },
    "ProjectUI",
    props,
  );
}

/**
 * The `count` screenshots of a project, which are named by convention:
 * `/assets/projects/<slug>/<slug>-01.<ext>` and up. Keeping the naming a rule
 * rather than a list means adding a shot is a number here and a file there.
 */
function shots(
  slug: string,
  count: number,
  ext: "png" | "jpg" = "png",
): string[] {
  return Array.from(
    { length: count },
    (_, i) =>
      `/assets/projects/${slug}/${slug}-${String(i + 1).padStart(2, "0")}.${ext}`,
  );
}

/**
 * What the desktop card says about the featured project, in the one line it
 * has. Kept here beside the project rather than in the component, because it is
 * copy about this work — the card only borrows it.
 */
export function featuredPitch(L: Localize): string {
  return L(
    "The largest thing I have built alone — an offline-first, security-hardened meeting platform for government.",
    "งานที่ใหญ่ที่สุดที่เคยทำคนเดียว — ระบบประชุมสำหรับหน่วยงานราชการ ที่ทำงานแบบ offline-first และเข้มงวดเรื่องความปลอดภัย",
  );
}

/** A shelf in the projects cabinet — folders here hold nothing but projects. */
function folder(id: string, name: string, children: FileNode[]): FileNode {
  return {
    id,
    name,
    type: "folder",
    icon: ICONS.folder,
    data: { kind: "folder", children },
  };
}

/**
 * Positioning: Flutter Craftsman / Shipper. Ordered by what a visitor gets from
 * reading one more entry, which is not the same as by date:
 *
 *   1. the featured project, then the four with the most of my own work in them
 *   2. everything else that has a public link — a store page is a claim someone
 *      can check, so a linked entry outranks an unlinked one of the same weight
 *   3. the rest, oldest habits last
 *
 * The list is authored in that order rather than sorted at runtime: there is no
 * field that encodes "how much of this is mine", and inventing one to recover an
 * order I already know would be a worse file than this comment.
 *
 * A project's `name` is also its filename, so it is the same word in both
 * languages — everything the project *says about itself* is what translates.
 */
function workMobile(L: Localize): FileNode[] {
  return [
    // Delivered under NDA: no screenshots, no client name, no store link. What is
    // left is the architecture, which is the part worth reading anyway.
    makeProject("proj-gov-meeting", {
      name: "Government Meeting System",
      type: L("Mobile · Work", "มือถือ · งานบริษัท"),
      description: L(
        "A tablet application for running government meetings — agendas, participants, and the confidential documents that go with them. It is delivered under NDA, so this entry describes how it is built rather than what it looks like. Two constraints shaped every decision: meeting rooms where the network is unusable, and devices that cannot be assumed to be safe.",
        "แอปบนแท็บเล็ตสำหรับดำเนินการประชุมของหน่วยงานราชการ ครอบคลุมวาระการประชุม ผู้เข้าร่วม และเอกสารลับที่ใช้ในการประชุม เนื่องจากส่งมอบภายใต้ NDA รายการนี้จึงเล่าว่าระบบถูกสร้างขึ้นอย่างไร มากกว่าจะเล่าว่าหน้าตาเป็นแบบไหน มีข้อจำกัดสองข้อที่กำหนดทุกการตัดสินใจ คือห้องประชุมที่สัญญาณเน็ตใช้การไม่ได้ และเครื่องที่สมมติไม่ได้ว่าปลอดภัย",
      ),
      highlights: L(
        [
          "Offline-first by design — the encrypted local database is the source of truth, so a meeting runs start to finish with no connection and reconciles once there is one",
          "Two-way sync: an inbound pipeline pulls meetings, agendas and attachments under a download policy per file type, while an outbound outbox captures everything the user does",
          "The outbox is a durable queue with a processor per action — comments, document edits, read receipts — so a push that fails is retried rather than lost",
          "Live meeting state over a WebSocket channel, with background workers carrying sync on when the app is not in the foreground",
          "Document workflow on a commercial PDF SDK: open, annotate and save while offline, with the edits traveling home through the same outbox",
          "Hardened for material that matters — encrypted database key in secure storage, per-document encryption, device-integrity and jailbreak checks, and screen capture blocked at the platform layer",
          "Clean architecture per feature across fourteen feature modules, Bloc for state and GetIt for injection — sole author of the mobile codebase",
          "Also contributed to the Go backend — clean architecture, LDAP and national digital-ID sign-in, WebSocket and SQL Server — alongside the platform team",
        ],
        [
          "ออกแบบมาเป็น offline-first โดยให้ฐานข้อมูลบนเครื่องที่เข้ารหัสไว้เป็นแหล่งข้อมูลหลัก ประชุมจนจบได้โดยไม่ต้องมีเน็ต แล้วค่อยซิงก์กลับเมื่อเชื่อมต่อได้",
          "ซิงก์สองทาง ขาเข้าดึงข้อมูลการประชุม วาระ และไฟล์แนบตามนโยบายการดาวน์โหลดที่แยกตามชนิดไฟล์ ส่วนขาออกเก็บทุกอย่างที่ผู้ใช้ทำไว้ในกล่อง outbox",
          "outbox เป็นคิวที่ข้อมูลไม่หาย มี processor แยกตามชนิดการกระทำ ทั้งคอมเมนต์ การแก้ไขเอกสาร และสถานะการอ่าน สิ่งที่ส่งไม่สำเร็จจะถูกลองใหม่แทนที่จะหายไป",
          "สถานะการประชุมแบบเรียลไทม์ผ่าน WebSocket พร้อม background worker ที่ซิงก์ต่อให้แม้แอปไม่ได้เปิดอยู่หน้าจอ",
          "งานเอกสารทำบน PDF SDK เชิงพาณิชย์ เปิด เขียนโน้ต และบันทึกได้ขณะออฟไลน์ โดยการแก้ไขจะเดินทางกลับผ่าน outbox ตัวเดียวกัน",
          "เข้มงวดเรื่องความปลอดภัยให้สมกับข้อมูลที่ดูแล ทั้งเก็บกุญแจฐานข้อมูลไว้ใน secure storage เข้ารหัสแยกรายเอกสาร ตรวจความสมบูรณ์ของเครื่องและการเจลเบรก และบล็อกการแคปหน้าจอที่ระดับแพลตฟอร์ม",
          "วาง clean architecture แยกรายฟีเจอร์ทั้งหมดสิบสี่โมดูล ใช้ Bloc จัดการสเตตและ GetIt ทำ dependency injection โดยเป็นผู้เขียนโค้ดฝั่งมือถือคนเดียวทั้งระบบ",
          "มีส่วนร่วมกับ backend ฝั่ง Go ด้วย ทั้ง clean architecture การล็อกอินผ่าน LDAP และดิจิทัลไอดีของภาครัฐ WebSocket และ SQL Server โดยทำงานร่วมกับทีมแพลตฟอร์ม",
        ],
      ),
      stack: ["Flutter", "Dart", "Bloc", "Drift", "SQLite", "WebSocket", "Go"],
      status: L("In Production", "ใช้งานจริงแล้ว"),
      year: "2026",
      platform: L("iPad & Android Tablet", "iPad และแท็บเล็ต Android"),
      featured: true,
    }),
    makeProject("proj-mol-portal", {
      name: "MOL Portal",
      type: L("Mobile · Work", "มือถือ · งานบริษัท"),
      description: L(
        "The Ministry of Labour's citizen service app, where I own the labour-complaint module end to end. A worker in Thailand or posted overseas files a grievance from their phone, follows it to a verdict, and keeps a signed acknowledgment letter — work that used to mean a trip to a government office.",
        "แอปบริการประชาชนของกระทรวงแรงงาน ซึ่งผมดูแลโมดูลร้องทุกข์แรงงานทั้งหมดตั้งแต่ต้นจนจบ แรงงานทั้งในประเทศและที่ไปทำงานต่างประเทศสามารถยื่นเรื่องร้องทุกข์จากมือถือ ติดตามจนถึงผลการพิจารณา และเก็บหนังสือรับเรื่องที่ลงนามแล้วไว้ได้ จากเดิมที่ต้องเดินทางไปติดต่อที่หน่วยงานด้วยตัวเอง",
      ),
      highlights: L(
        [
          "Built both intake systems — domestic and overseas — on one shared four-step base, so a change to validation, attachments or review lands on both at once instead of twice",
          "The whole case lifecycle: draft, edit, submit, track, satisfaction rating, and searchable history with status filters and per-case chat",
          "Generates the official acknowledgment letter as a PDF on the device, downloadable straight from the case history",
          "Cascading province → district → subdistrict address pickers over the national dataset, plus attachments and a submit-confirm step",
          "Inherited a monolithic ApiGatewayService and split it into per-domain services, then rewired every caller and deleted the monolith",
          "Left it more maintainable than I found it: main.dart pulled apart into an app/core module, a shared complaint module, unit tests around the API layer, and a GitHub Actions workflow running analyze and test on every PR",
        ],
        [
          "สร้างระบบยื่นเรื่องทั้งในประเทศและต่างประเทศบนฐานเดียวกันแบบสี่ขั้นตอน การแก้เรื่องการตรวจสอบข้อมูล ไฟล์แนบ หรือหน้าตรวจทาน จึงมีผลกับทั้งสองระบบพร้อมกัน แทนที่จะต้องแก้สองรอบ",
          "ครอบคลุมวงจรของเรื่องร้องทุกข์ทั้งหมด ตั้งแต่ร่าง แก้ไข ยื่น ติดตาม ประเมินความพึงพอใจ ไปจนถึงประวัติที่ค้นหาได้ กรองตามสถานะ และแชตแยกรายเรื่อง",
          "สร้างหนังสือรับเรื่องอย่างเป็นทางการเป็นไฟล์ PDF บนเครื่อง ดาวน์โหลดได้จากหน้าประวัติโดยตรง",
          "ตัวเลือกที่อยู่แบบไล่ระดับ จังหวัด → อำเภอ → ตำบล จากชุดข้อมูลของประเทศ พร้อมไฟล์แนบและขั้นตอนยืนยันก่อนส่ง",
          "รับช่วง ApiGatewayService ที่เป็นก้อนใหญ่ก้อนเดียวมาแตกเป็นเซอร์วิสแยกตามโดเมน แล้วแก้จุดที่เรียกใช้ทั้งหมดก่อนลบตัวเดิมทิ้ง",
          "ส่งต่อโค้ดที่ดูแลง่ายกว่าตอนรับมา ทั้งแยก main.dart ออกเป็นโมดูล app/core ทำโมดูลร้องทุกข์ที่ใช้ร่วมกัน เขียน unit test ครอบชั้น API และวาง GitHub Actions ให้รัน analyze กับ test ทุก PR",
        ],
      ),
      stack: ["Flutter", "Dart", "GetX", "Dio", "GitHub Actions"],
      status: L("Live on Play Store", "อยู่บน Play Store แล้ว"),
      delivered: true,
      year: "2026",
      platform: L("iOS & Android", "iOS และ Android"),
      images: shots("mol", 11),
      links: [
        {
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=com.molportal.mol_portal",
        },
      ],
    }),
    makeProject("proj-ailearn", {
      name: "aiLearn",
      type: L("Mobile · Work", "มือถือ · งานบริษัท"),
      description: L(
        "A learning app with AI assistance built in, written in Flutter and released on the Play Store.",
        "แอปเรียนรู้ที่มี AI ช่วยสอน เขียนด้วย Flutter และปล่อยขึ้น Play Store แล้ว",
      ),
      highlights: L(
        [
          "One Flutter codebase covering iOS and Android",
          "Released to the Play Store and maintained after launch",
        ],
        [
          "ใช้โค้ด Flutter ชุดเดียวครอบคลุมทั้ง iOS และ Android",
          "ปล่อยขึ้น Play Store และดูแลต่อหลังเปิดใช้งาน",
        ],
      ),
      stack: ["Flutter", "Dart"],
      status: L("Live on Play Store", "อยู่บน Play Store แล้ว"),
      delivered: true,
      year: "2023",
      platform: L("iOS & Android", "iOS และ Android"),
      images: shots("ailearn", 4),
      links: [
        {
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=cloud.learncloud.ailearn",
        },
      ],
    }),
    makeProject("proj-myorder", {
      name: "My Order",
      type: L("Mobile · Work", "มือถือ · งานบริษัท"),
      description: L(
        "An ordering app for iOS and Android, written in React Native and TypeScript. Typed throughout, so the parts that changed most often could be changed safely.",
        "แอปสั่งซื้อสินค้าสำหรับ iOS และ Android เขียนด้วย React Native และ TypeScript กำหนดชนิดข้อมูลไว้ทั้งระบบ ส่วนที่ต้องแก้บ่อยที่สุดจึงแก้ได้โดยไม่พัง",
      ),
      highlights: L(
        [
          "React Native with TypeScript across one codebase for both platforms",
          "Built and extended as part of the product team, on an app already selling",
        ],
        [
          "ใช้ React Native คู่กับ TypeScript บนโค้ดชุดเดียวรองรับทั้งสองแพลตฟอร์ม",
          "พัฒนาและต่อยอดร่วมกับทีมโปรดักต์ บนแอปที่เปิดขายอยู่จริง",
        ],
      ),
      stack: ["React Native", "TypeScript"],
      status: L("Live on both stores", "อยู่บนทั้งสองสโตร์แล้ว"),
      delivered: true,
      year: "2023",
      platform: L("iOS & Android", "iOS และ Android"),
      images: shots("myorder", 4, "jpg"),
      links: [
        {
          label: "App Store",
          url: "https://apps.apple.com/app/myorder/id6550900392",
        },
        {
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=ai.myorder.app",
        },
      ],
    }),
    makeProject("proj-mypinmall", {
      name: "MyPinmall",
      type: L("Mobile · Work", "มือถือ · งานบริษัท"),
      description: L(
        "A group-buying marketplace shipped to both stores: pin a product, invite friends, and the price falls as the group fills. Built in Flutter with Riverpod. I worked across several areas of the app inside the product team rather than owning it end to end.",
        "มาร์เก็ตเพลสแบบซื้อรวมกลุ่มที่ปล่อยขึ้นทั้งสองสโตร์ ผู้ใช้ปักหมุดสินค้า ชวนเพื่อนเข้ามาร่วม แล้วราคาจะลดลงเมื่อกลุ่มเต็มขึ้นเรื่อย ๆ พัฒนาด้วย Flutter และ Riverpod ผมรับผิดชอบหลายส่วนของแอปในฐานะสมาชิกทีมโปรดักต์ ไม่ได้ดูแลทั้งระบบคนเดียว",
      ),
      highlights: L(
        [
          "Group-buy mechanics as the core of the product — tiered prices that drop as a group fills, a countdown on every campaign, and slots remaining shown on each tier",
          "Pin to Share: a product is pinned and shared to pull friends into the same buy, which is what makes the group price reachable",
          "A full storefront around it — categories, campaigns, product options, cart, favorites and order tracking",
          "Checkout covering how people actually pay in Thailand: QR through mobile banking, bank transfer, and cash on delivery",
          "Flutter with Riverpod for state, on a single codebase serving iOS and Android",
        ],
        [
          "กลไกซื้อรวมกลุ่มเป็นหัวใจของโปรดักต์ ทั้งราคาแบบขั้นบันไดที่ลดลงเมื่อกลุ่มเต็มขึ้น นับถอยหลังในทุกแคมเปญ และจำนวนที่ว่างเหลือในแต่ละขั้น",
          "ฟีเจอร์ Pin to Share ปักหมุดสินค้าแล้วแชร์เพื่อดึงเพื่อนเข้ามาซื้อรอบเดียวกัน ซึ่งเป็นสิ่งที่ทำให้ราคากลุ่มไปถึงได้จริง",
          "หน้าร้านครบวงจร ทั้งหมวดหมู่ แคมเปญ ตัวเลือกสินค้า ตะกร้า รายการโปรด และการติดตามคำสั่งซื้อ",
          "ระบบชำระเงินที่ครอบคลุมวิธีที่คนไทยจ่ายจริง ทั้ง QR ผ่านโมบายแบงก์กิ้ง โอนผ่านธนาคาร และเก็บเงินปลายทาง",
          "ใช้ Flutter คู่กับ Riverpod ในการจัดการสเตต บนโค้ดชุดเดียวที่รองรับทั้ง iOS และ Android",
        ],
      ),
      stack: ["Flutter", "Dart", "Riverpod"],
      status: L("Live on both stores", "อยู่บนทั้งสองสโตร์แล้ว"),
      delivered: true,
      year: "2023",
      platform: L("iOS & Android", "iOS และ Android"),
      images: shots("my-pinmall", 4),
      links: [
        {
          label: "App Store",
          url: "https://apps.apple.com/app/mypinmall/id6468960970",
        },
        {
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=com.mypinmall.myapp",
        },
      ],
    }),
    makeProject("proj-vn", {
      name: "VN",
      type: L("Mobile · Work", "มือถือ · งานบริษัท"),
      description: L(
        "An English-learning app, built in Flutter and released on both stores.",
        "แอปเรียนภาษาอังกฤษ พัฒนาด้วย Flutter และปล่อยขึ้นทั้งสองสโตร์",
      ),
      highlights: L(
        [
          "One Flutter codebase serving both Android and iOS",
          "Built and maintained inside the mobile team, on an app with users on it",
          "Released to the App Store and the Play Store",
        ],
        [
          "ใช้โค้ด Flutter ชุดเดียวรองรับทั้ง Android และ iOS",
          "พัฒนาและดูแลอยู่ในทีมมือถือ บนแอปที่มีผู้ใช้จริงอยู่แล้ว",
          "ปล่อยขึ้นทั้ง App Store และ Play Store",
        ],
      ),
      stack: ["Flutter", "Dart"],
      status: L("Live on both stores", "อยู่บนทั้งสองสโตร์แล้ว"),
      delivered: true,
      year: "2022",
      platform: L("iOS & Android", "iOS และ Android"),
      images: shots("vn", 4),
      links: [
        {
          label: "App Store",
          url: "https://apps.apple.com/app/vn-english-anywhere/id1630679292",
        },
        {
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=com.viknavara.vnenglish",
        },
      ],
    }),
    makeProject("proj-enfagrow", {
      name: "Enfagrow",
      type: L("Mobile · Work", "มือถือ · งานบริษัท"),
      description: L(
        "A consumer app for the Enfagrow brand, built in Flutter. Brand work, so the screens had to match the design down to the spacing.",
        "แอปสำหรับผู้บริโภคของแบรนด์ Enfagrow พัฒนาด้วย Flutter เป็นงานแบรนด์ หน้าจอจึงต้องตรงกับดีไซน์ถึงระดับระยะห่าง",
      ),
      highlights: L(
        [
          "One Flutter codebase serving both Android and iOS",
          "Built to the design team's specification, screen by screen",
        ],
        [
          "ใช้โค้ด Flutter ชุดเดียวรองรับทั้ง Android และ iOS",
          "ทำตามสเปกที่ทีมดีไซน์กำหนดทีละหน้าจอ",
        ],
      ),
      stack: ["Flutter", "Dart"],
      status: L("Completed", "เสร็จสิ้นแล้ว"),
      delivered: true,
      year: "2022",
      platform: L("iOS & Android", "iOS และ Android"),
      images: shots("enfagrow", 4),
    }),
    makeProject("proj-g2g", {
      name: "G2G",
      type: L("Mobile · Work", "มือถือ · งานบริษัท"),
      description: L(
        "A cross-platform app in React Native and TypeScript, delivered to both stores from a single codebase.",
        "แอปข้ามแพลตฟอร์มที่เขียนด้วย React Native และ TypeScript ส่งมอบขึ้นทั้งสองสโตร์จากโค้ดชุดเดียว",
      ),
      highlights: L(
        [
          "React Native with TypeScript, one codebase for iOS and Android",
          "Types carried through the app, so a refactor could be trusted",
        ],
        [
          "ใช้ React Native คู่กับ TypeScript โค้ดชุดเดียวสำหรับ iOS และ Android",
          "กำหนดชนิดข้อมูลไว้ตลอดทั้งแอป การรีแฟกเตอร์จึงทำได้อย่างมั่นใจ",
        ],
      ),
      stack: ["React Native", "TypeScript"],
      status: L("Completed", "เสร็จสิ้นแล้ว"),
      delivered: true,
      year: "2022",
      platform: L("iOS & Android", "iOS และ Android"),
      images: shots("g2g", 4),
    }),
    makeProject("proj-evp", {
      name: "EVP Network",
      type: L("Mobile · Work", "มือถือ · งานบริษัท"),
      description: L(
        "A network application in React Native and TypeScript, delivered as part of the mobile team.",
        "แอปเครือข่ายที่เขียนด้วย React Native และ TypeScript ส่งมอบในฐานะสมาชิกทีมมือถือ",
      ),
      highlights: L(
        [
          "React Native with TypeScript, one codebase for iOS and Android",
          "Built and kept running alongside the rest of the team",
        ],
        [
          "ใช้ React Native คู่กับ TypeScript โค้ดชุดเดียวสำหรับ iOS และ Android",
          "พัฒนาและดูแลให้ระบบเดินต่อได้ร่วมกับทีม",
        ],
      ),
      stack: ["React Native", "TypeScript"],
      status: L("Completed", "เสร็จสิ้นแล้ว"),
      delivered: true,
      year: "2022",
      platform: L("iOS & Android", "iOS และ Android"),
      images: shots("evp", 4, "jpg"),
    }),
  ];
}

function workWeb(L: Localize): FileNode[] {
  return [
    makeProject("proj-swu-ai", {
      name: "SWU AI",
      type: L("Web · Work", "เว็บ · งานบริษัท"),
      description: L(
        "A private AI assistant for Srinakharinwirot University, signed into with a university account. My part was the administration side: the platform shipped with two fixed roles, and the university needed many — so I designed and built a role and permission system across the front end, the API and the database, where an administrator defines a role and decides exactly what it can see.",
        "ผู้ช่วย AI ส่วนตัวของมหาวิทยาลัยศรีนครินทรวิโรฒ ที่เข้าใช้งานด้วยบัญชีของมหาวิทยาลัย ส่วนที่ผมรับผิดชอบคือฝั่งผู้ดูแลระบบ เดิมแพลตฟอร์มมาพร้อมบทบาทตายตัวเพียงสองแบบ แต่มหาวิทยาลัยต้องการหลายบทบาท ผมจึงออกแบบและสร้างระบบบทบาทและสิทธิ์ใหม่ทั้งฝั่งหน้าเว็บ API และฐานข้อมูล ให้ผู้ดูแลสร้างบทบาทเองได้และกำหนดได้ว่าบทบาทนั้นเห็นอะไรบ้าง",
      ),
      highlights: L(
        [
          "Designed permissions as data rather than code — a features catalogue joined to roles with a uniqueness constraint per pair — so adding a role is rows in a table, not a release",
          "Replaced the fixed admin/user split with named roles created from the UI: added a role reference to the user table by migration and rewired every role check in the codebase onto it",
          "One flag lookup per session drives the whole admin surface — nav entries hide, the panel refuses entry when the role has no admin access, and a user lands on the first tab their role can actually open",
          "Built sub-admin delegation on top of it, so a group can be administered by someone who is not a full administrator",
          "Also owned the auth work around it: LDAP/university sign-in, a global fetch interceptor and token watcher so an expired session is caught anywhere instead of failing one request at a time",
          "Front, back and schema were all mine — Svelte admin screens, FastAPI routers for roles, features and their mapping, and the migrations underneath",
        ],
        [
          "ออกแบบสิทธิ์ให้เป็นข้อมูลแทนที่จะเป็นโค้ด โดยทำแคตตาล็อกฟีเจอร์เชื่อมกับบทบาทและใส่ข้อจำกัดไม่ให้ซ้ำในแต่ละคู่ การเพิ่มบทบาทใหม่จึงเป็นแค่การเพิ่มแถวในตาราง ไม่ต้องปล่อยเวอร์ชันใหม่",
          "เปลี่ยนจากการแบ่งแค่ admin กับ user มาเป็นบทบาทที่ตั้งชื่อเองได้จากหน้าเว็บ โดยเพิ่มการอ้างอิงบทบาทเข้าไปในตารางผู้ใช้ผ่าน migration แล้วแก้จุดตรวจสอบบทบาททั้งโค้ดเบสให้มาใช้ตัวใหม่",
          "ใช้การอ่านค่าธงเพียงครั้งเดียวต่อเซสชันขับเคลื่อนหน้าผู้ดูแลทั้งหมด เมนูที่ไม่มีสิทธิ์จะถูกซ่อน แผงผู้ดูแลจะปฏิเสธการเข้าถึงถ้าบทบาทนั้นไม่มีสิทธิ์ และผู้ใช้จะถูกพาไปยังแท็บแรกที่บทบาทของตัวเองเปิดได้จริง",
          "ต่อยอดเป็นการมอบสิทธิ์ผู้ดูแลย่อย เพื่อให้กลุ่มหนึ่งถูกดูแลโดยคนที่ไม่ได้เป็นผู้ดูแลระบบเต็มรูปแบบได้",
          "ดูแลงานยืนยันตัวตนรอบ ๆ ด้วย ทั้งการล็อกอินผ่าน LDAP ของมหาวิทยาลัย ตัวดักจับ fetch ระดับทั้งระบบ และตัวเฝ้าดูโทเคน เพื่อให้เซสชันที่หมดอายุถูกจับได้ทุกจุด แทนที่จะพังทีละคำขอ",
          "ทั้งหน้าบ้าน หลังบ้าน และสคีมาเป็นงานของผมทั้งหมด ทั้งหน้าจอผู้ดูแลด้วย Svelte, FastAPI router สำหรับบทบาท ฟีเจอร์ และการจับคู่ทั้งสองอย่าง รวมถึง migration ที่อยู่ข้างใต้",
        ],
      ),
      stack: [
        "SvelteKit",
        "TypeScript",
        "Python",
        "FastAPI",
        "PostgreSQL",
        "SQLAlchemy",
      ],
      status: L("In Production", "ใช้งานจริงแล้ว"),
      year: "2025",
      platform: L("Web", "เว็บ"),
      images: shots("swu-ai", 4),
    }),
    makeProject("proj-the-blacklist", {
      name: "The Blacklist",
      type: L("Web · Work", "เว็บ · งานบริษัท"),
      description: L(
        "A Nuxt web application, built to stay quick as the number of screens grew and to work down to a phone.",
        "เว็บแอปพลิเคชันที่ทำด้วย Nuxt ออกแบบให้ยังทำงานเร็วแม้จำนวนหน้าจะเพิ่มขึ้น และใช้งานได้ลงไปถึงหน้าจอมือถือ",
      ),
      highlights: L(
        [
          "Nuxt for routing and rendering, with the page structure kept flat enough to follow",
          "Laid out for phone through desktop from the same components",
        ],
        [
          "ใช้ Nuxt ทั้งการจัดเส้นทางและการเรนเดอร์ โดยคุมโครงสร้างหน้าไม่ให้ซับซ้อนเกินกว่าจะตามอ่านได้",
          "วางเลย์เอาต์ให้ครอบคลุมตั้งแต่มือถือถึงเดสก์ท็อปด้วยคอมโพเนนต์ชุดเดียวกัน",
        ],
      ),
      stack: ["Nuxt", "Vue"],
      status: L("Completed", "เสร็จสิ้นแล้ว"),
      delivered: true,
      year: "2022",
      platform: L("Web", "เว็บ"),
      images: shots("the-blacklist", 4, "jpg"),
    }),
  ];
}

function personalMobile(L: Localize): FileNode[] {
  return [
    makeProject("proj-langridge", {
      name: "Langridge",
      type: L("Mobile · Personal", "มือถือ · โปรเจกต์ส่วนตัว"),
      description: L(
        "A voice interpreter that runs entirely on the phone. One person speaks and the other hears it in their own language — speech recognition, translation by a quantized LLM running through llama.cpp, and speech synthesis all happen on the device, so a conversation works with no network and nothing spoken ever leaves the handset.",
        "ล่ามแปลเสียงที่ทำงานบนเครื่องทั้งหมด ฝ่ายหนึ่งพูด อีกฝ่ายได้ยินเป็นภาษาของตัวเอง ทั้งการรู้จำเสียง การแปลด้วย LLM ที่ผ่านการ quantise แล้วรันผ่าน llama.cpp และการสังเคราะห์เสียง เกิดขึ้นบนเครื่องทั้งหมด บทสนทนาจึงทำงานได้โดยไม่ต้องมีเน็ต และไม่มีสิ่งที่พูดออกไปหลุดออกจากเครื่องเลย",
      ),
      highlights: L(
        [
          "Fully on-device pipeline — speech → translation → speech — with no backend of any kind; once a model is downloaded the app never needs the network again",
          "llama.cpp bound through dart:ffi and driven from a dedicated isolate, warmed with a one-token pass after load so the first translation doesn't pay the shader-compile cost",
          "Two-stage prompting — understand (repair the transcript, tag the intent) then translate — trading ~2× latency for markedly steadier output from 0.5–2B models",
          "Model catalog with in-app download: a 400 MB default that loads on every iPhone since the 8, and Gemma 3 / Qwen 3 / Llama 3.2 options for devices with headroom",
          "Face-to-face two-panel surface — a mic per speaker, live waveform, typewriter reveal, edge pulse and haptics — across 75 languages mapped to BCP-47 for the platform speech engines",
          "Clean architecture per feature, with SQLite history, a model health watchdog that restarts a crashed isolate, and a Thai/English UI",
        ],
        [
          "ไปป์ไลน์ทำงานบนเครื่องทั้งหมด ตั้งแต่เสียง → แปล → เสียง โดยไม่มี backend ใด ๆ เมื่อดาวน์โหลดโมเดลแล้ว แอปไม่ต้องใช้เน็ตอีกเลย",
          "เชื่อม llama.cpp ผ่าน dart:ffi และสั่งงานจาก isolate เฉพาะ พร้อมอุ่นเครื่องด้วยการรันหนึ่งโทเคนหลังโหลดเสร็จ เพื่อไม่ให้การแปลครั้งแรกต้องเสียเวลาไปกับการคอมไพล์เชเดอร์",
          "ใช้ prompt สองขั้น คือขั้นทำความเข้าใจ (ซ่อมข้อความที่ถอดมา และระบุเจตนา) แล้วจึงแปล ยอมแลกเวลาราวสองเท่ากับผลลัพธ์ที่นิ่งขึ้นชัดเจนบนโมเดลขนาด 0.5–2B",
          "มีแคตตาล็อกโมเดลที่ดาวน์โหลดได้ในแอป โดยค่าเริ่มต้นขนาด 400 MB ที่โหลดได้บน iPhone ตั้งแต่รุ่น 8 ขึ้นไป และมีตัวเลือก Gemma 3 / Qwen 3 / Llama 3.2 สำหรับเครื่องที่แรงพอ",
          "หน้าจอแบบสองฝั่งหันเข้าหากัน มีไมค์แยกของแต่ละคน คลื่นเสียงแบบเรียลไทม์ ข้อความที่ค่อย ๆ ปรากฏแบบพิมพ์ดีด แสงเต้นที่ขอบจอ และการสั่น รองรับ 75 ภาษาที่จับคู่กับ BCP-47 เพื่อส่งต่อให้เอนจินเสียงของแพลตฟอร์ม",
          "วาง clean architecture แยกรายฟีเจอร์ เก็บประวัติด้วย SQLite มีตัวเฝ้าดูสุขภาพโมเดลที่รีสตาร์ต isolate เมื่อแครช และ UI รองรับทั้งไทยและอังกฤษ",
        ],
      ),
      stack: ["Flutter", "Dart", "llama.cpp", "dart:ffi", "SQLite"],
      status: L("In Development", "กำลังพัฒนา"),
      year: "2026",
      platform: L("iOS · On-device AI", "iOS · AI ที่รันบนเครื่อง"),
      images: shots("langridge", 6),
    }),
    makeProject("proj-pdf-drawing", {
      name: "PDF Drawing",
      type: L("Mobile · Personal", "มือถือ · โปรเจกต์ส่วนตัว"),
      description: L(
        "A study of how PDF annotation actually works, built from scratch instead of bought as an SDK. Each page is rendered to an image and a CustomPainter sits on top of it, so the pen, highlighter, shapes and eraser are all drawn and hit-tested by hand.",
        "งานศึกษาว่าการเขียนโน้ตบน PDF ทำงานอย่างไรจริง ๆ โดยสร้างขึ้นเองทั้งหมดแทนที่จะซื้อ SDK มาใช้ แต่ละหน้าจะถูกเรนเดอร์เป็นภาพแล้ววาง CustomPainter ทับไว้ด้านบน ปากกา ปากกาเน้นข้อความ รูปทรง และยางลบ จึงถูกวาดและตรวจจับการแตะเองทั้งหมด",
      ),
      highlights: L(
        [
          "Annotations are a typed model (pen / shape / text) keyed by page — a stroke stays an object that can be recolored or removed, not pixels burned into the page",
          "The eraser works by geometry rather than by painting over: point-to-segment distance for strokes, and edge or radius tests for rectangles, circles and triangles",
          "Pages render at 2× device pixels, and the drawing layer turns pointer-transparent under the select tool so the document still scrolls normally",
          "Floating, draggable tool rail — pen, highlighter, shape, text, eraser — with a grouped color palette and a stroke size per tool",
          "Reads from asset, file or network; the demo streams a real PDF straight off the web",
          "Kept deliberately small (~1,800 lines, annotations in memory only) — the point was to find where an annotation engine gets hard, not to ship one",
        ],
        [
          "โน้ตทุกชิ้นเป็นโมเดลที่มีชนิดชัดเจน (ปากกา / รูปทรง / ข้อความ) แยกตามหน้า เส้นที่วาดยังคงเป็นออบเจ็กต์ที่เปลี่ยนสีหรือลบได้ ไม่ใช่พิกเซลที่ถูกเผาลงไปในหน้ากระดาษ",
          "ยางลบทำงานด้วยเรขาคณิตแทนการระบายทับ ใช้ระยะจากจุดถึงส่วนของเส้นสำหรับลายเส้น และตรวจที่ขอบหรือรัศมีสำหรับสี่เหลี่ยม วงกลม และสามเหลี่ยม",
          "เรนเดอร์หน้ากระดาษที่ความละเอียด 2 เท่าของพิกเซลเครื่อง และเลเยอร์วาดจะปล่อยให้การแตะทะลุผ่านเมื่อใช้เครื่องมือเลือก เอกสารจึงยังเลื่อนได้ตามปกติ",
          "แถบเครื่องมือแบบลอยที่ลากย้ายได้ ทั้งปากกา ปากกาเน้นข้อความ รูปทรง ข้อความ และยางลบ พร้อมจานสีที่จัดกลุ่มไว้และขนาดเส้นแยกตามเครื่องมือ",
          "อ่านไฟล์ได้ทั้งจาก asset ไฟล์ในเครื่อง และเครือข่าย โดยตัวเดโมสตรีม PDF จริงมาจากเว็บโดยตรง",
          "ตั้งใจให้เล็ก (ราว 1,800 บรรทัด และเก็บโน้ตไว้ในหน่วยความจำเท่านั้น) เพราะเป้าหมายคือหาว่าเอนจินเขียนโน้ตเริ่มยากตรงไหน ไม่ใช่เพื่อปล่อยเป็นโปรดักต์",
        ],
      ),
      stack: ["Flutter", "Dart", "pdfx", "CustomPainter"],
      status: L("Prototype", "ต้นแบบ"),
      year: "2026",
      platform: L("iOS & Android · Tablet-first", "iOS และ Android · เน้นแท็บเล็ต"),
      images: shots("pdf-drawing", 3),
    }),
  ];
}

function personalWeb(L: Localize): FileNode[] {
  return [
    makeProject("proj-c-docs", {
      name: "C-DOCS",
      type: L("Web · Personal", "เว็บ · โปรเจกต์ส่วนตัว"),
      description: L(
        "A Markdown workspace that lives entirely in the browser. Documents are kept in a SQLite database inside the browser's own file system and encrypted at rest with a key only the author holds — so there is no account to create, no server to trust with the content, and the workspace keeps working offline.",
        "พื้นที่ทำงานแบบ Markdown ที่อยู่ในเบราว์เซอร์ทั้งหมด เอกสารถูกเก็บในฐานข้อมูล SQLite ภายในระบบไฟล์ของเบราว์เซอร์เอง และเข้ารหัสไว้ด้วยกุญแจที่มีเพียงผู้เขียนถือ จึงไม่ต้องสมัครบัญชี ไม่ต้องฝากเนื้อหาไว้กับเซิร์ฟเวอร์ใคร และยังทำงานต่อได้แม้ออฟไลน์",
      ),
      highlights: L(
        [
          "Local-first by design: SQLite compiled to WebAssembly, running on OPFS in a Web Worker — the device is the source of truth, not a server",
          "Encrypted at rest with AES-GCM; the key is generated on-device and downloaded as a file, and a wrong key simply fails to decrypt — there is no password to check",
          "Clean architecture (domain → application → infrastructure) lets the identical use cases run on OPFS in the browser and better-sqlite3 on the server",
          "Full Markdown editing: GFM, KaTeX math, Mermaid diagrams, syntax highlighting, live split preview, autosave and undo history",
          "Workspace essentials — folders, favorites, recents, trash with restore, ⌘K search, templates, and whole-workspace export/import",
          "Durability taken seriously: single-writer tab lock, persistent-storage requests, and backup nudges against silent OPFS eviction",
        ],
        [
          "ออกแบบมาเป็น local-first โดยคอมไพล์ SQLite เป็น WebAssembly แล้วรันบน OPFS ใน Web Worker ให้เครื่องของผู้ใช้เป็นแหล่งข้อมูลหลัก ไม่ใช่เซิร์ฟเวอร์",
          "เข้ารหัสข้อมูลที่เก็บไว้ด้วย AES-GCM กุญแจถูกสร้างบนเครื่องและดาวน์โหลดออกมาเป็นไฟล์ ถ้ากุญแจผิดก็แค่ถอดรหัสไม่ได้ ไม่มีรหัสผ่านให้ต้องตรวจสอบ",
          "วาง clean architecture (domain → application → infrastructure) ทำให้ use case ชุดเดียวกันรันได้ทั้งบน OPFS ในเบราว์เซอร์และบน better-sqlite3 ฝั่งเซิร์ฟเวอร์",
          "แก้ไข Markdown ได้เต็มรูปแบบ ทั้ง GFM สมการ KaTeX ไดอะแกรม Mermaid การไฮไลต์โค้ด พรีวิวแบบแบ่งจอเรียลไทม์ บันทึกอัตโนมัติ และประวัติการย้อนกลับ",
          "มีของจำเป็นครบสำหรับพื้นที่ทำงาน ทั้งโฟลเดอร์ รายการโปรด เปิดล่าสุด ถังขยะที่กู้คืนได้ ค้นหาด้วย ⌘K เทมเพลต และการนำเข้า/ส่งออกทั้งเวิร์กสเปซ",
          "ให้ความสำคัญกับความคงทนของข้อมูล ทั้งล็อกให้เขียนได้ทีละแท็บ ขอสิทธิ์พื้นที่เก็บถาวร และเตือนให้สำรองข้อมูลกันกรณี OPFS ถูกลบเงียบ ๆ",
        ],
      ),
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "SQLite",
        "WebAssembly",
        "Tailwind CSS",
      ],
      status: L("Live", "เปิดใช้งานแล้ว"),
      delivered: true,
      year: "2026",
      platform: L("Web · Installable PWA", "เว็บ · ติดตั้งเป็น PWA ได้"),
      images: shots("c-docs", 6),
      links: [
        {
          label: L("Live Demo", "ลองใช้งาน"),
          url: "https://c-docs-web.vercel.app",
        },
      ],
    }),
    makeProject("proj-dataq", {
      name: "DataQ AI",
      type: L("Web · Personal", "เว็บ · โปรเจกต์ส่วนตัว"),
      description: L(
        "An idea taken as far as a website: a data-quality service for teams training AI models, offering two products — RefAI to refine messy, unstructured data into clean datasets, and SynAI to generate realistic synthetic data. The marketing site is drafted; the products behind it are not built.",
        "ไอเดียที่ผลักไปได้ไกลถึงขั้นเป็นเว็บไซต์ เป็นบริการด้านคุณภาพข้อมูลสำหรับทีมที่เทรนโมเดล AI ประกอบด้วยสองผลิตภัณฑ์ คือ RefAI ที่ขัดข้อมูลดิบไร้โครงสร้างให้กลายเป็นชุดข้อมูลที่สะอาด และ SynAI ที่สร้างข้อมูลสังเคราะห์ให้เหมือนจริง ตอนนี้เว็บไซต์ร่างเสร็จแล้ว แต่ตัวผลิตภัณฑ์ที่อยู่เบื้องหลังยังไม่ได้สร้าง",
      ),
      highlights: L(
        [
          "Worked the product out by writing its site first — positioning, the two-product split, solution pages, security posture and pricing, before a line of the service existed",
          "Landing, solution, store, security, about, blog and contact are drafted; the product pages themselves are still stubs, which is exactly how far the thinking got",
          "Priced as a credit model — free tier, monthly and annual plans, and top-up packs — to test whether the economics hold before building anything",
          "Next.js App Router with shadcn/ui on Radix primitives, Tailwind and Framer Motion, over a canvas particle-globe hero",
          "Kept here as a record of a direction considered rather than a product shipped",
        ],
        [
          "คิดโปรดักต์ออกมาด้วยการเขียนเว็บไซต์ก่อน ทั้งการวางตำแหน่ง การแบ่งเป็นสองผลิตภัณฑ์ หน้าโซลูชัน แนวทางด้านความปลอดภัย และราคา ทั้งที่ยังไม่มีโค้ดของตัวบริการสักบรรทัด",
          "หน้าแลนดิ้ง โซลูชัน สโตร์ ความปลอดภัย เกี่ยวกับเรา บล็อก และติดต่อ ร่างไว้แล้ว ส่วนหน้าผลิตภัณฑ์ยังเป็นโครงเปล่า ซึ่งก็คือระยะที่ความคิดเดินไปถึงจริง ๆ",
          "ออกแบบราคาเป็นระบบเครดิต มีทั้งแพ็กฟรี รายเดือน รายปี และแพ็กเติมเพิ่ม เพื่อทดสอบว่าตัวเลขทางธุรกิจไปรอดไหมก่อนจะลงมือสร้าง",
          "ใช้ Next.js App Router ร่วมกับ shadcn/ui ที่วางบน Radix primitives, Tailwind และ Framer Motion บนหน้าแรกที่มีลูกโลกอนุภาคเรนเดอร์บน canvas",
          "เก็บไว้ตรงนี้ในฐานะบันทึกของทิศทางที่เคยคิด ไม่ใช่โปรดักต์ที่ปล่อยออกไปแล้ว",
        ],
      ),
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      status: L("Concept", "แนวคิด"),
      year: "2025",
      platform: L("Web", "เว็บ"),
      images: shots("dataq", 7),
    }),
    makeProject("proj-portfolio-os", {
      name: "Portfolio OS",
      type: L("Web · Personal", "เว็บ · โปรเจกต์ส่วนตัว"),
      description: L(
        "This portfolio — a Next.js app built as a desktop operating system, with a window manager, a virtual file system, a working terminal, and everything it says written in both English and Thai.",
        "ตัวพอร์ตโฟลิโอนี้เอง เป็นแอป Next.js ที่สร้างเป็นระบบปฏิบัติการเดสก์ท็อป มีทั้งตัวจัดการหน้าต่าง ระบบไฟล์เสมือน เทอร์มินัลที่ใช้งานได้จริง และทุกข้อความเขียนไว้ทั้งภาษาไทยและอังกฤษ",
      ),
      highlights: L(
        [
          "Window manager written from scratch — drag, minimize, maximize, stacking order",
          "A typed virtual file system (folder, txt, ui, pdf, slide, link) that search, the terminal and Properties all read from",
          "A terminal that parses its own commands, with path completion and man pages",
          "Two color schemes, plus motion, language and start-up as real preferences the OS remembers",
          "Both languages authored beside the content they describe, so a missing translation is a compile error",
        ],
        [
          "ตัวจัดการหน้าต่างที่เขียนเองทั้งหมด ลากได้ ย่อได้ ขยายได้ พร้อมจัดลำดับชั้นหน้าต่าง",
          "ระบบไฟล์เสมือนที่มีชนิดข้อมูลชัดเจน (โฟลเดอร์ txt ui pdf สไลด์ ลิงก์) โดยการค้นหา เทอร์มินัล และหน้าคุณสมบัติ อ่านจากต้นทางเดียวกัน",
          "เทอร์มินัลที่แยกวิเคราะห์คำสั่งเอง เติมพาธให้อัตโนมัติ และมีหน้า man ของแต่ละคำสั่ง",
          "มีสองโทนสี และมีทั้งการเคลื่อนไหว ภาษา กับการเริ่มระบบ เป็นการตั้งค่าจริงที่ระบบจำไว้ให้",
          "เขียนทั้งสองภาษาไว้ข้างเนื้อหาที่มันอธิบาย ถ้าแปลไม่ครบจะคอมไพล์ไม่ผ่าน",
        ],
      ),
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React"],
      status: L("In Development", "กำลังพัฒนา"),
      year: "2026",
      platform: L("Web", "เว็บ"),
      links: [{ label: "GitHub", url: "https://github.com/KhwanNon" }],
    }),
  ];
}

/**
 * Two shelves, each split the same way. Work comes first because that is what
 * the visit is for, and Mobile leads Web inside both because that is the trade
 * this portfolio claims. Personal is deliberately thin for now — it is a place
 * held open, not a second body of work.
 */
export function projectsFolder(L: Localize): FileNode {
  return folder("projects", "Projects", [
    folder("projects-work", "Work", [
      folder("projects-work-mobile", "Mobile", workMobile(L)),
      folder("projects-work-web", "Web", workWeb(L)),
    ]),
    folder("projects-personal", "Personal", [
      folder("projects-personal-mobile", "Mobile", personalMobile(L)),
      folder("projects-personal-web", "Web", personalWeb(L)),
    ]),
  ]);
}
