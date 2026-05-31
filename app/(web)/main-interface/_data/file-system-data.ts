import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";
import { projectsFolder } from "./projects";
import { skillsFolder } from "./skills";
import { experienceFolder } from "./experience";
import { educationFolder } from "./education";
import { aboutFolder } from "./about";
import { downloadFolder } from "./download";
import { recycleBin } from "./recycle-bin";

const cDrive: FileNode = {
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
      educationFolder,
      aboutFolder,
      downloadFolder,
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

  Hello, my name is Khwan, a 26-year-old Mobile Developer
  with over 3 years of experience in Flutter development.

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
  Role        :  Mobile Developer (Flutter)
  Experience  :  3+ Years
  Location    :  Thailand
  Stack       :  Flutter · Dart · React · Next.js · TypeScript
──────────────────────────────────────────────────────

> END OF FILE`,
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

export const desktopFileSystem: FileNode[] = [
  cDrive,
  recycleBin,
  profileTxt,
  systemCommand,
  preferences,
];

// Desktop sections layout — `ids` reference nodes in desktopFileSystem above.
export const desktopSections = [
  {
    title: "Directories",
    variant: "default" as const,
    ids: ["c-drive", "recycle-bin"],
  },
  { title: "Assets", variant: "default" as const, ids: ["profile-txt"] },
  {
    title: "Executables",
    variant: "active" as const,
    ids: ["system-command", "preferences"],
  },
];
