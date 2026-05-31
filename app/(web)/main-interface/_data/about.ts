import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";

const connectivityFolder: FileNode = {
  id: "about-connectivity",
  name: "Connectivity",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "about-resume-pdf",
        name: "resume.pdf",
        type: "pdf",
        icon: ICONS.pdf,
        data: {
          kind: "pdf",
          url: "/assets/resume.pdf",
          filename: "Khwanchai_Resume.pdf",
        },
      },
      {
        id: "about-contact",
        name: "contact.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "ContactUI",
          props: {
            links: [
              {
                label: "Email",
                value: "your.email@example.com",
                href: "mailto:your.email@example.com",
              },
              {
                label: "GitHub",
                value: "github.com/your-username",
                href: "https://github.com/your-username",
              },
              {
                label: "LinkedIn",
                value: "linkedin.com/in/your-profile",
                href: "https://linkedin.com/in/your-profile",
              },
              {
                label: "Line",
                value: "@your-line-id",
                href: "https://line.me/ti/p/~your-line-id",
              },
            ],
          },
        },
      },
      {
        id: "about-line-link",
        name: "line.link",
        type: "link",
        icon: ICONS.link,
        data: { kind: "link", url: "https://line.me/ti/p/~your-line-id" },
      },
      {
        id: "about-git-link",
        name: "git.link",
        type: "link",
        icon: ICONS.link,
        data: { kind: "link", url: "https://github.com/your-username" },
      },
    ],
  },
};

export const aboutFolder: FileNode = {
  id: "about",
  name: "About",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "about-me",
        name: "me.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "PersonalBioUI",
          props: {
            bio: "Hello! I'm Khwanchai Nontawichit (Khwan) — a 26-year-old Mobile Developer from Thailand with 3+ years of professional Flutter experience. I specialize in Clean Architecture and love building apps that are fast, maintainable, and a joy to use. I lead teams, mentor juniors, and care deeply about code quality and shipping reliable products.",
            facts: [
              { label: "Name", value: "Khwanchai Nontawichit" },
              { label: "Alias", value: "Khwan" },
              { label: "Age", value: "26" },
              { label: "Location", value: "Thailand" },
              { label: "Role", value: "Mobile Developer" },
              { label: "Experience", value: "3+ Years" },
              { label: "Main Stack", value: "Flutter · Dart" },
              { label: "Status", value: "Open to Opportunities" },
            ],
          },
        },
      },
      {
        id: "about-hobbies",
        name: "hobbies.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "HobbiesUI",
          props: {
            items: [
              {
                name: "Coding",
                emoji: "💻",
                description:
                  "Side projects, exploring new frameworks, contributing to open source.",
              },
              {
                name: "Gaming",
                emoji: "🎮",
                description:
                  "Strategy and RPG games. Appreciates good UX even in games.",
              },
              {
                name: "Coffee",
                emoji: "☕",
                description:
                  "Serious about coffee. Prefers coding with a good pour-over.",
              },
              {
                name: "Reading",
                emoji: "📖",
                description:
                  "Tech blogs, architecture books, and the occasional manga.",
              },
              {
                name: "Music",
                emoji: "🎵",
                description:
                  "Lo-fi and jazz while coding. Silence for debugging.",
              },
              {
                name: "Traveling",
                emoji: "✈️",
                description: "Exploring new cities and cultures when offline.",
              },
            ],
          },
        },
      },
      {
        id: "about-setup",
        name: "setup.txt",
        type: "txt",
        icon: ICONS.txt,
        data: {
          kind: "txt",
          content: `> WORKSTATION_SETUP.TXT
> ─────────────────────────────────────────

  HARDWARE
  ──────────────────────────────────────────────────────
  Machine    :  MacBook Pro / Windows PC (dual setup)
  Display    :  27" Monitor + Laptop screen
  Input      :  Mechanical keyboard · Mouse
  Audio      :  Headphones for focus sessions

  EDITOR & TOOLS
  ──────────────────────────────────────────────────────
  Editor     :  VS Code + Android Studio
  Theme      :  One Dark Pro / Cyberpunk
  Font       :  JetBrains Mono
  Terminal   :  Zsh + Oh My Zsh
  Browser    :  Chrome (dev) + Arc

  DAILY WORKFLOW
  ──────────────────────────────────────────────────────
  Version Control  :  Git + GitHub
  Tasks            :  Notion / Linear
  Design Handoff   :  Figma
  Communication    :  Slack + Line

> EOF`,
        },
      },
      connectivityFolder,
    ],
  },
};
