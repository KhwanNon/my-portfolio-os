import type { Locale } from "./locale";

/**
 * Everything the *shell* says — menus, buttons, headings, readouts. What the
 * portfolio itself says lives beside the file it belongs to, in `_data`, where
 * both languages are authored inline with the content they describe.
 *
 * The English object below is the shape: `Strings` is derived from it, so a key
 * added here is a compile error in Thai until it is translated, and a key that
 * only exists in Thai cannot exist at all.
 *
 * The terminal is not in here. A shell prompt, its commands and its errors are
 * English the way `ls` is English — see `_lib/terminal-content.ts`.
 */
const EN = {
  search: {
    placeholder: "Search files, folders, apps…",
    label: "Search",
    empty: "No results",
    hint: "↑ ↓ navigate · ⏎ open",
    count: (n: number) => `${n} result${n === 1 ? "" : "s"}`,
  },

  dock: {
    label: "Dock",
    minimized: ", minimized",
    running: ", running",
  },

  /** The dock's right-hand readouts, which are all tooltip-only. */
  status: {
    online: "Online",
    offline: "Offline",
    battery: (level: number, charging: boolean) =>
      `Battery ${level}%${charging ? ", charging" : ""}`,
    /** BCP-47 tag for the clock's own date and time formatting. */
    dateLocale: "en-US",
  },

  window: {
    minimize: "Minimize",
    maximize: "Maximize",
    restore: "Restore",
    close: "Close",
    resize: "Resize",
  },

  folder: {
    back: "Back",
    breadcrumb: "Breadcrumb",
    gridView: "Grid view",
    listView: "List view",
    notFound: "Path not found",
    empty: "This folder is empty",
  },

  menu: {
    open: "Open",
    openLink: "Open Link",
    openInTerminal: "Open in Terminal",
    copyPath: "Copy Path",
    properties: "Properties",
    openTerminal: "Open System Command",
    refresh: "Refresh",
    aboutOs: "About Portfolio OS",
    moreActions: (name: string) => `More actions for ${name}`,
  },

  toast: {
    copied: (path: string) => `Copied: ${path}`,
    copyFailed: "Copy failed",
    clipboardUnavailable: "Clipboard unavailable",
    refreshed: "Desktop refreshed ✓",
  },

  properties: {
    title: (name: string) => `Properties — ${name}`,
    path: "Path",
    type: "Type",
    size: "Size",
    modified: "Modified",
    items: "Items",
    permissions: "Permissions",
    permissionsValue: "r-x  (read-only portfolio)",
    itemCount: (n: number) => `${n} entr${n === 1 ? "y" : "ies"}`,
    kind: {
      folder: "Directory",
      txt: "Text Document",
      pdf: "PDF Document",
      ui: "UI View",
      slide: "Slideshow",
      link: "Web Link",
      program: "Program",
    } as Record<string, string>,
  },

  /** The one line a file icon carries under its name. */
  fileKind: {
    /** Keyed by `FileNode["type"]`; `fallback` covers a type not listed. */
    byType: {
      folder: "Folder",
      program: "App",
      txt: "Document",
      pdf: "PDF",
      slide: "Slides",
      link: "Link",
      ui: "View",
    } as Record<string, string>,
    fallback: "File",
    itemCount: (n: number) => `${n} item${n === 1 ? "" : "s"}`,
  },

  /** The heading each portfolio window leads with. */
  section: {
    about: "About Me",
    hobbies: "Hobbies & Interests",
    contact: "Contact",
    education: "Education",
    experience: "Experience",
    project: "Project",
    skills: "Skills",
    softSkills: "Soft Skills",
  },

  project: {
    platform: "Platform:",
    recommended: "Start here",
    /** The star's own label, for a reader who meets it without the word beside it. */
    featuredMark: "Featured — open this one first",
    openFile: (name: string) => `Open ${name}`,
    screenshotAlt: (name: string, n: number) => `${name} screenshot ${n}`,
    screenshotOpen: (name: string, n: number) =>
      `View ${name} screenshot ${n} full size`,
  },

  education: {
    gpa: "GPA:",
  },

  lightbox: {
    labelled: (name: string) => `${name} screenshots`,
    unlabelled: "Screenshot viewer",
    close: "Close viewer",
    previous: "Previous screenshot",
    next: "Next screenshot",
  },

  pdf: {
    download: "Download",
    open: "Open",
    handoff:
      "Phone browsers can't draw a PDF inside a window. Open it full screen, or keep a copy.",
  },

  slide: {
    previous: "◀ Prev",
    next: "Next ▶",
    empty: "No slides found",
  },

  theme: {
    group: "Color scheme",
    option: (label: string) => `${label} theme`,
  },

  prefs: {
    title: "Preferences",
    nav: {
      osVersion: "OS Version",
      theme: "Theme Mode",
      language: "Language",
      motion: "Motion",
      startup: "Startup",
    },
    active: "Active",
    /**
     * The choice that names no value and hands the question back to the device.
     * It says what the device answered, because "System" on its own tells a
     * reader what the setting is doing but never what they are looking at.
     */
    system: {
      label: "System",
      detail: (value: string) => `Follows this device — ${value}`,
    },
    motion: {
      full: {
        label: "Full motion",
        detail: "Windows spring open and the desktop settles in.",
      },
      reduced: {
        label: "Reduced motion",
        detail: "Nothing slides or springs. Everything else stays as it is.",
      },
    },
    startup: {
      boot: {
        label: "Boot sequence",
        detail: "Start the machine up every time you arrive.",
      },
      instant: {
        label: "Straight to desktop",
        detail: "Skip the start-up screen and go in.",
      },
    },
    reset: {
      action: "Reset to defaults",
      done: "Preferences reset ✓",
    },
    os: {
      copyright: "© 2026 Khwanchai Nontawichit. All rights reserved.",
      version: "Version 2.4.0 (Build 2026.01)",
      deviceHeading: "Device Specifications",
      device: [
        ["Device Name", "Portfolio Master Unit"],
        ["Developer", "Khwanchai (Khwan)"],
        ["Main Stack", "Flutter · React · Next.js"],
        ["Focus", "Fast apps, code that stays readable"],
      ] as [string, string][],
      systemHeading: "System Specifications",
      system: [
        ["Edition", "Portfolio Pro Edition"],
        ["Experience", "4+ years shipping production apps"],
        ["Install Date", "10/24/2024"],
        ["OS Build", "22631.3447"],
      ] as [string, string][],
      actions: ["Check for Updates", "View License", "Copy Specs"],
    },
  },

  aboutOs: {
    version: "Version 2.4.0 · Build 2026.01",
    rows: [
      ["Engine", "Next.js 16 · React 19"],
      ["Shell", "sys-cmd v1.0"],
      ["Stack", "TypeScript · Tailwind · Framer Motion"],
      ["Architect", "Khwanchai Nontawichit (Khwan)"],
      ["License", "MIT — fork it, learn from it"],
    ] as [string, string][],
    blurb:
      "A portfolio rendered as a desktop operating system. Window manager, virtual filesystem, working terminal with path completion, right-click menus, toasts — all the OS pleasantries you'd expect, minus the BSODs.",
    tryIt: "Try it",
    tips: [
      "Right-click any icon for Open / Copy Path / Properties.",
      "Drag a window's bottom-right corner to resize.",
      "Double-click the title bar to maximize.",
    ],
    /** Split around the command names, which stay as they are typed. */
    terminalTip: {
      lead: "In the terminal, try ",
      join: ", ",
      tail: ".",
    },
  },
};

/** The shape every locale must fill, taken from the English above. */
export type Strings = typeof EN;

const TH: Strings = {
  search: {
    placeholder: "ค้นหาไฟล์ โฟลเดอร์ และแอป…",
    label: "ค้นหา",
    empty: "ไม่พบผลลัพธ์",
    hint: "↑ ↓ เลื่อน · ⏎ เปิด",
    count: (n) => `${n} รายการ`,
  },

  dock: {
    label: "ด็อก",
    minimized: " (ย่อไว้)",
    running: " (เปิดอยู่)",
  },

  status: {
    online: "ออนไลน์",
    offline: "ออฟไลน์",
    battery: (level, charging) =>
      `แบตเตอรี่ ${level}%${charging ? " กำลังชาร์จ" : ""}`,
    dateLocale: "th-TH",
  },

  window: {
    minimize: "ย่อหน้าต่าง",
    maximize: "ขยายเต็มจอ",
    restore: "คืนขนาดเดิม",
    close: "ปิด",
    resize: "ปรับขนาด",
  },

  folder: {
    back: "ย้อนกลับ",
    breadcrumb: "เส้นทางโฟลเดอร์",
    gridView: "มุมมองตาราง",
    listView: "มุมมองรายการ",
    notFound: "ไม่พบเส้นทางนี้",
    empty: "โฟลเดอร์นี้ว่างเปล่า",
  },

  menu: {
    open: "เปิด",
    openLink: "เปิดลิงก์",
    openInTerminal: "เปิดใน Terminal",
    copyPath: "คัดลอกพาธ",
    properties: "คุณสมบัติ",
    openTerminal: "เปิด System Command",
    refresh: "รีเฟรช",
    aboutOs: "เกี่ยวกับ Portfolio OS",
    moreActions: (name) => `ตัวเลือกเพิ่มเติมของ ${name}`,
  },

  toast: {
    copied: (path) => `คัดลอกแล้ว: ${path}`,
    copyFailed: "คัดลอกไม่สำเร็จ",
    clipboardUnavailable: "ใช้คลิปบอร์ดไม่ได้",
    refreshed: "รีเฟรชเดสก์ท็อปแล้ว ✓",
  },

  properties: {
    title: (name) => `คุณสมบัติ — ${name}`,
    path: "พาธ",
    type: "ชนิด",
    size: "ขนาด",
    modified: "แก้ไขล่าสุด",
    items: "จำนวน",
    permissions: "สิทธิ์",
    permissionsValue: "r-x  (พอร์ตโฟลิโอ อ่านได้อย่างเดียว)",
    itemCount: (n) => `${n} รายการ`,
    kind: {
      folder: "โฟลเดอร์",
      txt: "เอกสารข้อความ",
      pdf: "เอกสาร PDF",
      ui: "หน้าจอ UI",
      slide: "สไลด์",
      link: "ลิงก์เว็บ",
      program: "โปรแกรม",
    },
  },

  fileKind: {
    byType: {
      folder: "โฟลเดอร์",
      program: "แอป",
      txt: "เอกสาร",
      pdf: "PDF",
      slide: "สไลด์",
      link: "ลิงก์",
      ui: "หน้าจอ",
    },
    fallback: "ไฟล์",
    itemCount: (n) => `${n} รายการ`,
  },

  section: {
    about: "เกี่ยวกับฉัน",
    hobbies: "งานอดิเรกและความสนใจ",
    contact: "ติดต่อ",
    education: "การศึกษา",
    experience: "ประสบการณ์ทำงาน",
    project: "โปรเจกต์",
    skills: "ทักษะ",
    softSkills: "ทักษะเชิงพฤติกรรม",
  },

  project: {
    platform: "แพลตฟอร์ม:",
    recommended: "เริ่มอ่านที่นี่",
    featuredMark: "โปรเจกต์แนะนำ — เปิดอันนี้ก่อน",
    openFile: (name) => `เปิด ${name}`,
    screenshotAlt: (name, n) => `ภาพหน้าจอ ${name} ที่ ${n}`,
    screenshotOpen: (name, n) => `ดูภาพหน้าจอ ${name} ที่ ${n} แบบเต็ม`,
  },

  education: {
    gpa: "เกรดเฉลี่ย:",
  },

  lightbox: {
    labelled: (name) => `ภาพหน้าจอของ ${name}`,
    unlabelled: "ตัวดูภาพหน้าจอ",
    close: "ปิดตัวดูภาพ",
    previous: "ภาพก่อนหน้า",
    next: "ภาพถัดไป",
  },

  pdf: {
    download: "ดาวน์โหลด",
    open: "เปิด",
    handoff:
      "เบราว์เซอร์บนมือถือแสดงไฟล์ PDF ในหน้าต่างนี้ไม่ได้ เปิดแบบเต็มจอ หรือดาวน์โหลดเก็บไว้",
  },

  slide: {
    previous: "◀ ก่อนหน้า",
    next: "ถัดไป ▶",
    empty: "ไม่พบสไลด์",
  },

  theme: {
    group: "โทนสี",
    option: (label) => `ธีม ${label}`,
  },

  prefs: {
    title: "การตั้งค่า",
    nav: {
      osVersion: "เวอร์ชันระบบ",
      theme: "ธีม",
      language: "ภาษา",
      motion: "การเคลื่อนไหว",
      startup: "การเริ่มระบบ",
    },
    active: "ใช้อยู่",
    system: {
      label: "ตามระบบ",
      detail: (value) => `ตามการตั้งค่าของเครื่อง — ${value}`,
    },
    motion: {
      full: {
        label: "เคลื่อนไหวเต็มรูปแบบ",
        detail: "หน้าต่างเด้งเปิด เดสก์ท็อปค่อย ๆ เข้าที่",
      },
      reduced: {
        label: "ลดการเคลื่อนไหว",
        detail: "ไม่มีการเลื่อนหรือเด้ง ส่วนอื่นยังอยู่ครบเหมือนเดิม",
      },
    },
    startup: {
      boot: {
        label: "เล่นหน้าจอเริ่มระบบ",
        detail: "เริ่มระบบใหม่ทุกครั้งที่เข้ามา",
      },
      instant: {
        label: "เข้าเดสก์ท็อปทันที",
        detail: "ข้ามหน้าจอเริ่มระบบไปเลย",
      },
    },
    reset: {
      action: "คืนค่าเริ่มต้น",
      done: "คืนค่าการตั้งค่าแล้ว ✓",
    },
    os: {
      copyright: "© 2026 ขวัญชัย นนทวิชิต สงวนลิขสิทธิ์",
      version: "เวอร์ชัน 2.4.0 (บิลด์ 2026.01)",
      deviceHeading: "ข้อมูลจำเพาะของเครื่อง",
      device: [
        ["ชื่อเครื่อง", "Portfolio Master Unit"],
        ["ผู้พัฒนา", "ขวัญชัย (ขวัญ)"],
        ["สแตกหลัก", "Flutter · React · Next.js"],
        ["จุดเด่น", "แอปที่เร็ว และโค้ดที่ยังอ่านรู้เรื่อง"],
      ],
      systemHeading: "ข้อมูลจำเพาะของระบบ",
      system: [
        ["รุ่น", "Portfolio Pro Edition"],
        ["ประสบการณ์", "ส่งแอปขึ้นใช้งานจริงมา 4+ ปี"],
        ["วันที่ติดตั้ง", "24/10/2024"],
        ["บิลด์ระบบ", "22631.3447"],
      ],
      actions: ["ตรวจหาอัปเดต", "ดูสัญญาอนุญาต", "คัดลอกข้อมูลจำเพาะ"],
    },
  },

  aboutOs: {
    version: "เวอร์ชัน 2.4.0 · บิลด์ 2026.01",
    rows: [
      ["เอนจิน", "Next.js 16 · React 19"],
      ["เชลล์", "sys-cmd v1.0"],
      ["สแตก", "TypeScript · Tailwind · Framer Motion"],
      ["ผู้ออกแบบ", "ขวัญชัย นนทวิชิต (ขวัญ)"],
      ["สัญญาอนุญาต", "MIT — ฟอร์กไปใช้และเรียนรู้ได้เลย"],
    ],
    blurb:
      "พอร์ตโฟลิโอที่ทำออกมาเป็นระบบปฏิบัติการเดสก์ท็อป มีตัวจัดการหน้าต่าง ระบบไฟล์เสมือน เทอร์มินัลที่เติมพาธให้อัตโนมัติ เมนูคลิกขวา และการแจ้งเตือน — ครบทุกอย่างที่ OS ควรมี ยกเว้นจอฟ้า",
    tryIt: "ลองเล่นดู",
    tips: [
      "คลิกขวาที่ไอคอนใดก็ได้ เพื่อเปิด / คัดลอกพาธ / ดูคุณสมบัติ",
      "ลากมุมขวาล่างของหน้าต่างเพื่อปรับขนาด",
      "ดับเบิลคลิกแถบชื่อหน้าต่างเพื่อขยายเต็มจอ",
    ],
    terminalTip: {
      lead: "ในเทอร์มินัล ลองพิมพ์ ",
      join: ", ",
      tail: " ดู",
    },
  },
};

export const STRINGS: Record<Locale, Strings> = { en: EN, th: TH };
