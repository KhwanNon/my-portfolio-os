import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";
import { projectsFolder } from "./projects";
import { skillsFolder } from "./skills";
import { experienceFolder } from "./experience";
import { educationFile } from "./education";
import { aboutFolder } from "./about";
import { recycleBin } from "./recycle-bin";
import { khwanCraftFile } from "./craft";
import { contactApp } from "./contact";

export const cDrive: FileNode = {
  id: "c-drive",
  name: "C-DRIVE",
  type: "folder",
  icon: ICONS.cdrive,
  data: {
    kind: "folder",
    children: [
      projectsFolder,
      skillsFolder,
      experienceFolder,
      educationFile,
      aboutFolder,
    ],
  },
};

const profileTxt: FileNode = {
  id: "profile-txt",
  name: "Profile.txt",
  type: "txt",
  icon: ICONS.txt,
  data: {
    kind: "txt",
    content: `> PROFILE.TXT — SYSTEM USER DATA
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
  },
};

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

export const preferences: FileNode = {
  id: "preferences",
  name: "Preferences",
  type: "program",
  icon: ICONS.prefs,
  data: { kind: "program", component: "Preferences" },
};

/**
 * Not part of the drive — a view the shell can open from anywhere
 * (help button, desktop menu).
 */
export const aboutOsNode: FileNode = {
  id: "about-os",
  name: "About Portfolio OS",
  type: "ui",
  icon: ICONS.about,
  data: { kind: "ui", component: "AboutOSUI", props: {} },
};

export const desktopFileSystem: FileNode[] = [
  cDrive,
  recycleBin,
  profileTxt,
  resumePdf,
  khwanCraftFile,
  systemCommand,
  preferences,
  contactApp,
];

/**
 * What the desktop offers under its search field: the documents first, because
 * the visit is short and they are the whole answer on their own, then the two
 * folders for the reader who has time. Each of these is otherwise a click or
 * two down inside C-DRIVE, and the desktop is the one surface with the room to
 * say so outright.
 *
 * khwan-craft is not here — it has its own card in the corner, and a second way
 * in would have been the same door twice.
 */
export const homeShortcuts: FileNode[] = [
  resumePdf,
  profileTxt,
  projectsFolder,
  experienceFolder,
];

/**
 * The dock's fixed slots: what this machine *opens*. Documents stay out of it.
 * A dock is a place to launch from and a document is something you read, and
 * the desktop already puts both within one click.
 *
 * Read left to right it is two groups, not one list. First what the visit is
 * for — the work, and the way to answer it. Then the machine's own tools, in
 * the order a shell has always kept them: the terminal, the settings, the bin.
 * Contact sits second rather than last because a dock is read from the left and
 * the far end is where the bin goes.
 *
 * Anything opened from outside this list joins the row for as long as its
 * window lives; see `Taskbar`.
 */
export const dockItems: FileNode[] = [
  cDrive,
  contactApp,
  systemCommand,
  preferences,
  recycleBin,
];

/*
 * There is no desktop list any more. The surface is bare on purpose: the dock
 * reaches every launcher and is on screen the whole time, and the home screen
 * offers the documents outright under its search field — so a third copy lying
 * on the wallpaper was one more place to keep in step and nowhere new to get to.
 */

