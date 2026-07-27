import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";
import { projectsFolder } from "./projects";
import { skillsFolder } from "./skills";
import { experienceFolder } from "./experience";
import { educationFile } from "./education";
import { aboutFolder } from "./about";
import { recycleBin } from "./recycle-bin";

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
  systemCommand,
  preferences,
];

/** How the side rail groups those shortcuts. */
export const desktopSections: { title: string; nodes: FileNode[] }[] = [
  { title: "Directories", nodes: [cDrive, recycleBin] },
  { title: "Assets", nodes: [profileTxt, resumePdf] },
  { title: "Executables", nodes: [systemCommand, preferences] },
];

/**
 * The tools this OS ships with — everything you *use* rather than read: the
 * drive, the terminal, the bin, the settings. `kind` captions the tile.
 */
export const applications: { node: FileNode; kind: string }[] = [
  { node: cDrive, kind: "Files" },
  { node: systemCommand, kind: "Terminal" },
  { node: preferences, kind: "Settings" },
  { node: recycleBin, kind: "Trash" },
];

/**
 * The guided tour: what a first-time visitor should open, in order, and why.
 * Hand-curated — this is a recommendation, not a recently-used log.
 */
export const suggestedItems: { node: FileNode; reason: string }[] = [
  { node: resumePdf, reason: "Start here" },
  { node: projectsFolder, reason: "What I've shipped" },
  { node: skillsFolder, reason: "What I build with" },
  { node: experienceFolder, reason: "Where I've worked" },
  { node: profileTxt, reason: "Who I am" },
];
