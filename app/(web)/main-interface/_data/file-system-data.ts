import type { FileNode } from "@/app/shared/types/file-system";

// ─── Sub-files inside C-DRIVE ────────────────────────────────────────────────
const cDriveChildren: FileNode[] = [
  {
    id: "projects",
    name: "Projects",
    type: "ui",
    iconPath: "/assets/images/file-ui.png",
    data: { kind: "ui", component: "ProjectsViewer" },
  },
  {
    id: "skills",
    name: "Skills",
    type: "ui",
    iconPath: "/assets/images/file-ui.png",
    data: { kind: "ui", component: "SkillsViewer" },
  },
  {
    id: "experience",
    name: "Experience",
    type: "ui",
    iconPath: "/assets/images/file-ui.png",
    data: { kind: "ui", component: "ExperienceViewer" },
  },
  {
    id: "education",
    name: "Education",
    type: "ui",
    iconPath: "/assets/images/file-ui.png",
    data: { kind: "ui", component: "EducationViewer" },
  },
  {
    id: "about",
    name: "About",
    type: "ui",
    iconPath: "/assets/images/file-ui.png",
    data: { kind: "ui", component: "AboutViewer" },
  },
  {
    id: "download-cv",
    name: "Download.pdf",
    type: "pdf",
    iconPath: "/assets/images/file-pdf.png",
    data: {
      kind: "pdf",
      url: "/assets/resume.pdf",
      filename: "Khwanchai_Resume.pdf",
    },
  },
];

// ─── Recycle Bin contents ─────────────────────────────────────────────────────
const recycleBinChildren: FileNode[] = [
  {
    id: "deleted-dreams",
    name: "deleted-dreams.txt",
    type: "txt",
    iconPath: "/assets/images/file-txt.png",
    data: {
      kind: "txt",
      content: `> RECYCLE BIN — SYSTEM DUMP LOG
> ─────────────────────────────────────────

  File: deleted-dreams.txt
  Status: Permanently deleted (or is it?)
  Date: 10/24/2024 03:14:59

> Contents recovered by deep-scan:

  - That one side project I swore I'd finish "this weekend"
  - "Temporary" CSS hacks that became permanent architecture
  - 47 drafts of a README that never shipped
  - Every "just 5 more minutes" that became 3am
  - The perfectly working code I refactored into bugs
  - npm packages installed "just to try it"
  - Stack Overflow answers I never went back to upvote

> SYSTEM NOTE:
  The recycle bin is never truly empty.
  Neither is the ambition of a developer.

  [ RESTORE ] [ DELETE PERMANENTLY ] [ Contemplate Existence ]

──────────────────────────────────────────────────────
EOF`,
    },
  },
  {
    id: "old-bugs",
    name: "old-bugs.log",
    type: "txt",
    iconPath: "/assets/images/file-txt.png",
    data: {
      kind: "txt",
      content: `> BUG ARCHIVE — GRAVEYARD OF ISSUES
> ─────────────────────────────────────────

  [CLOSED] #0001 — "It works on my machine"
  Resolution: Shipped anyway. Became production.

  [CLOSED] #0042 — Undefined is not a function
  Resolution: Added || {} . Problem solved. Problem stayed solved.

  [CLOSED] #0099 — Why is this async?
  Resolution: It was always async. I just wasn't ready.

  [CLOSED] #0137 — CSS layout broken on Safari
  Resolution: Declared war on Safari. Settled for a -webkit- prefix.

  [CLOSED] #0201 — "Cannot read properties of null"
  Resolution: Added optional chaining everywhere.
               Added it in places that didn't need it too. Felt good.

  [CLOSED] #0404 — Feature not found
  Resolution: Feature was never specified. Invented it anyway.
              Users liked the invented version better.

──────────────────────────────────────────────────────
  Total bugs closed: ∞
  Total bugs remaining: also ∞
──────────────────────────────────────────────────────
EOF`,
    },
  },
];

// ─── Root desktop file system ─────────────────────────────────────────────────
export const desktopFileSystem: FileNode[] = [
  // ── Directories section ──────────────────────────────────────────────────
  {
    id: "c-drive",
    name: "C-DRIVE",
    type: "folder",
    iconPath: "/assets/images/c-drive.png",
    data: { kind: "folder", children: cDriveChildren },
  },
  {
    id: "recycle-bin",
    name: "Recycle Bin",
    type: "folder",
    iconPath: "/assets/images/recycle-bin.png",
    data: { kind: "folder", children: recycleBinChildren },
  },

  // ── Assets section ───────────────────────────────────────────────────────
  {
    id: "profile-txt",
    name: "Profile.txt",
    type: "txt",
    iconPath: "/assets/images/file-txt.png",
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
  },

  // ── Executables section ──────────────────────────────────────────────────
  {
    id: "system-command",
    name: "System Command",
    type: "program",
    iconPath: "/assets/images/system-command.png",
    data: { kind: "program", component: "SystemCommand" },
  },
  {
    id: "preferences",
    name: "Preferences",
    type: "program",
    iconPath: "/assets/images/preferences.png",
    data: { kind: "program", component: "Preferences" },
  },
];

// ─── Desktop sections layout ──────────────────────────────────────────────────
export const desktopSections = [
  {
    title: "Directories",
    variant: "default" as const,
    ids: ["c-drive", "recycle-bin"],
  },
  {
    title: "Assets",
    variant: "default" as const,
    ids: ["profile-txt"],
  },
  {
    title: "Executables",
    variant: "active" as const,
    ids: ["system-command", "preferences"],
  },
];
