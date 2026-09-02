import type { FileNode } from "@/app/shared/types/file-system";
import { DEFAULT_LOCALE, localize, type Locale } from "@/app/shared/i18n/locale";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";
import { projectsFolder, featuredPitch } from "./projects";
import { skillsFolder } from "./skills";
import { experienceFolder } from "./experience";
import { educationFile } from "./education";
import { craftFile, craftLines } from "./craft";
import { contactApp } from "./contact";
import { owner, type Owner } from "./identity";

/**
 * The résumé's summary, in the first person and with room to breathe. With the
 * About folder gone this is the only file that introduces a person rather than
 * a body of work, so it says the same three things the PDF opens with — the
 * span, the specialism, and how far either side of mobile it reaches — and then
 * stops, because the windows behind it are the evidence.
 */
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

  My name is Khwan. I am a full-stack software engineer with
  five years of experience, specialising in mobile application
  development while contributing across backend and web
  platforms.

  I build cross-platform applications with Flutter, write
  backend services in Go, and deliver production software from
  architecture and implementation through to release.

  Mobile is where I do my best work, but I am not confined to
  it — I pick up unfamiliar stacks quickly, because most of
  what matters carries over between them.

──────────────────────────────────────────────────────
  Developer   :  Khwanchai Nontawichit
  Alias       :  Khwan
  Role        :  Mobile Developer · Full Stack Developer
  Experience  :  5 Years
  Location    :  Nonthaburi, Thailand
  Stack       :  Flutter · Dart · Go · TypeScript · SQL
──────────────────────────────────────────────────────

> END OF FILE`,
        `> PROFILE.TXT — ข้อมูลผู้ใช้ระบบ
> ─────────────────────────────────────────

  สวัสดีครับ ผมชื่อขวัญ เป็นวิศวกรซอฟต์แวร์แบบ full-stack
  ประสบการณ์ 5 ปี เชี่ยวชาญงานพัฒนาแอปมือถือ
  ควบคู่กับการทำงานฝั่ง backend และแพลตฟอร์มเว็บ

  ผมสร้างแอปข้ามแพลตฟอร์มด้วย Flutter เขียนเซอร์วิสฝั่งหลังบ้าน
  ด้วย Go และส่งมอบซอฟต์แวร์ที่ใช้งานจริง ตั้งแต่วางสถาปัตยกรรม
  ลงมือเขียน ไปจนถึงปล่อยขึ้นใช้งาน

  งานที่ผมทำได้ดีที่สุดคืองานมือถือ แต่ก็ไม่ได้จำกัดอยู่แค่นั้น
  ผมจับสแตกที่ไม่เคยใช้ได้เร็ว เพราะแก่นของมันส่วนใหญ่
  ใช้ร่วมกันได้อยู่แล้ว

──────────────────────────────────────────────────────
  ผู้พัฒนา     :  ขวัญชัย นนทวิชิต
  ชื่อเล่น      :  ขวัญ
  ตำแหน่ง      :  Mobile Developer · Full Stack Developer
  ประสบการณ์   :  5 ปี
  ที่อยู่        :  นนทบุรี ประเทศไทย
  สแตก        :  Flutter · Dart · Go · TypeScript · SQL
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

/**
 * Empty, and staying that way. It held two joke files once; a visitor who came
 * to read the work opened the bin and was handed a bit — the machine's furniture
 * asking for attention the work should have had.
 *
 * It keeps its dock slot rather than being removed, because a desktop with no
 * bin is a desktop with something missing, and an empty one is the honest state
 * of a machine whose owner has nothing to throw away.
 */
const recycleBin: FileNode = {
  id: "recycle-bin",
  name: "Recycle Bin",
  type: "folder",
  icon: ICONS.recycle,
  data: { kind: "folder", children: [] },
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
      children: [projects, skillsFolder(L), experience, educationFile(L)],
    },
  };

  const profile = profileTxt(L);
  const craft = craftFile(L);
  const contact = contactApp(L);

  return {
    fileSystem: [
      cDrive,
      recycleBin,
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
    dock: [cDrive, contact, systemCommand, preferences, recycleBin],

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
