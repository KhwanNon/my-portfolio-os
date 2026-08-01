import type { FileNode } from "@/app/shared/types/file-system";
import { DEFAULT_LOCALE, localize, type Locale } from "@/app/shared/i18n/locale";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";
import { projectsFolder, featuredPitch } from "./projects";
import { skillsFolder } from "./skills";
import { experienceFolder } from "./experience";
import { educationFile } from "./education";
import { aboutFolder } from "./about";
import { recycleBin } from "./recycle-bin";
import { craftFile, craftLines } from "./craft";
import { contactApp } from "./contact";
import { owner, type Owner } from "./identity";

function profileTxt(L: Localize): FileNode {
  return {
    id: "profile-txt",
    name: "Profile.txt",
    type: "txt",
    icon: ICONS.txt,
    data: {
      kind: "txt",
      content: L(
        `> PROFILE.TXT — SYSTEM USER DATA
> ─────────────────────────────────────────

  Hello, my name is Khwan, a Mobile Developer with over
  4 years of experience in Flutter development — currently
  in a full-stack role owning the mobile product end-to-end.

  I have a strong background in leading development teams,
  structuring applications with Clean Architecture, and
  managing environments efficiently.

  I am passionate about mobile development and always eager
  to take on new challenges. Additionally, I can contribute
  to front-end development in various languages and frameworks,
  even those I haven't previously worked with, as I quickly
  adapt and learn due to shared concepts across technologies.

──────────────────────────────────────────────────────
  Developer   :  Khwanchai Nontawichit
  Alias       :  Khwan
  Role        :  Mobile Developer (Flutter) · Full-Stack
  Experience  :  4+ Years
  Location    :  Thailand
  Stack       :  Flutter · Dart · Go · Vue · React · TypeScript
──────────────────────────────────────────────────────

> END OF FILE`,
        `> PROFILE.TXT — ข้อมูลผู้ใช้ระบบ
> ─────────────────────────────────────────

  สวัสดีครับ ผมชื่อขวัญ เป็นนักพัฒนาแอปมือถือที่มีประสบการณ์
  ทำงานกับ Flutter มากกว่า 4 ปี ปัจจุบันทำงานในบทบาท full-stack
  ที่ดูแลโปรดักต์ฝั่งมือถือทั้งหมดตั้งแต่ต้นจนจบ

  ผมมีพื้นฐานที่แน่นในการนำทีมพัฒนา การวางโครงสร้างแอปด้วย
  Clean Architecture และการจัดการ environment อย่างมีระบบ

  ผมชอบงานพัฒนาแอปมือถือและพร้อมรับโจทย์ใหม่ ๆ เสมอ นอกจากนี้
  ยังช่วยงานฝั่ง front-end ได้ในหลายภาษาและหลายเฟรมเวิร์ก
  รวมถึงตัวที่ยังไม่เคยใช้มาก่อน เพราะแนวคิดเบื้องหลังเทคโนโลยี
  เหล่านี้มีร่วมกันอยู่มาก ทำให้ปรับตัวและเรียนรู้ได้เร็ว

──────────────────────────────────────────────────────
  ผู้พัฒนา     :  ขวัญชัย นนทวิชิต
  ชื่อเล่น      :  ขวัญ
  ตำแหน่ง      :  Mobile Developer (Flutter) · Full-Stack
  ประสบการณ์   :  4+ ปี
  ที่อยู่        :  ประเทศไทย
  สแตก        :  Flutter · Dart · Go · Vue · React · TypeScript
──────────────────────────────────────────────────────

> จบไฟล์`,
      ),
    },
  };
}

const resumePdf: FileNode = {
  id: "resume-pdf",
  name: "Resume.pdf",
  type: "pdf",
  icon: ICONS.pdf,
  data: {
    kind: "pdf",
    url: "/assets/resume.pdf",
    filename: "Khwanchai_Resume.pdf",
  },
};

const systemCommand: FileNode = {
  id: "system-command",
  name: "System Command",
  type: "program",
  icon: ICONS.sysCmd,
  data: { kind: "program", component: "SystemCommand" },
};

const preferences: FileNode = {
  id: "preferences",
  name: "Preferences",
  type: "program",
  icon: ICONS.prefs,
  data: { kind: "program", component: "Preferences" },
};

/** Everything the shell reads off the drive, in one language. */
export interface DesktopData {
  /** The drive itself — what search, the terminal and Properties walk. */
  fileSystem: FileNode[];
  /** The dock's fixed slots. */
  dock: FileNode[];
  /** What the home screen offers under its search field. */
  homeShortcuts: FileNode[];
  /** The projects cabinet, for the card that asks it which one is featured. */
  projects: FileNode;
  craftFile: FileNode;
  craftLines: string[];
  featuredPitch: string;
  /**
   * Not part of the drive — a view the shell can open from anywhere (help
   * button, desktop menu).
   */
  aboutOsNode: FileNode;
  owner: Owner;
}

function build(locale: Locale): DesktopData {
  const L = localize(locale);

  // Named here rather than reached for through the tree later: the shortcuts
  // below and the featured card point at these very nodes, and a second call to
  // the same builder would produce a twin — equal by id, but a different object
  // for every `useMemo` and every identity check downstream.
  const projects = projectsFolder(L);
  const experience = experienceFolder(L);

  const cDrive: FileNode = {
    id: "c-drive",
    name: "C-DRIVE",
    type: "folder",
    icon: ICONS.cdrive,
    data: {
      kind: "folder",
      children: [
        projects,
        skillsFolder(L),
        experience,
        educationFile(L),
        aboutFolder(L),
      ],
    },
  };

  const profile = profileTxt(L);
  const craft = craftFile(L);
  const contact = contactApp(L);
  const bin = recycleBin(L);

  return {
    fileSystem: [
      cDrive,
      bin,
      profile,
      resumePdf,
      craft,
      systemCommand,
      preferences,
      contact,
    ],

    /*
     * The dock's fixed slots: what this machine *opens*. Documents stay out of
     * it. A dock is a place to launch from and a document is something you
     * read, and the desktop already puts both within one click.
     *
     * Read left to right it is two groups, not one list. First what the visit
     * is for — the work, and the way to answer it. Then the machine's own
     * tools, in the order a shell has always kept them: the terminal, the
     * settings, the bin. Contact sits second rather than last because a dock is
     * read from the left and the far end is where the bin goes.
     *
     * Anything opened from outside this list joins the row for as long as its
     * window lives; see `Taskbar`.
     */
    dock: [cDrive, contact, systemCommand, preferences, bin],

    /*
     * What the desktop offers under its search field: the documents first,
     * because the visit is short and they are the whole answer on their own,
     * then the two folders for the reader who has time. Each of these is
     * otherwise a click or two down inside C-DRIVE, and the desktop is the one
     * surface with the room to say so outright.
     *
     * khwan-craft is not here — it has its own card in the corner, and a second
     * way in would have been the same door twice.
     */
    homeShortcuts: [resumePdf, profile, projects, experience],

    projects,
    craftFile: craft,
    craftLines: craftLines(L),
    featuredPitch: featuredPitch(L),

    aboutOsNode: {
      id: "about-os",
      name: L("About Portfolio OS", "เกี่ยวกับ Portfolio OS"),
      type: "ui",
      icon: ICONS.about,
      data: { kind: "ui", component: "AboutOSUI", props: {} },
    },

    owner: owner(L),
  };
}

/**
 * The drive in a given language, built once and kept.
 *
 * A tree is rebuilt only the first time a language is asked for, and every
 * consumer of that language then holds the *same* nodes — which is what lets a
 * window opened before the switch and one opened after compare equal by id, and
 * what keeps `useMemo` dependencies honest across a re-render.
 *
 * Structure is identical in both languages: same ids, same names, same shape.
 * Only what a file *says* differs — so a path resolved, a search index built or
 * a terminal `cd` performed in one language is still valid in the other.
 */
const built = new Map<Locale, DesktopData>();

export function desktopData(locale: Locale = DEFAULT_LOCALE): DesktopData {
  const cached = built.get(locale);
  if (cached) return cached;
  const fresh = build(locale);
  built.set(locale, fresh);
  return fresh;
}

/*
 * There is no desktop list any more. The surface is bare on purpose: the dock
 * reaches every launcher and is on screen the whole time, and the home screen
 * offers the documents outright under its search field — so a third copy lying
 * on the wallpaper was one more place to keep in step and nowhere new to get to.
 */
