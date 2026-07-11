import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

// Flat folder — bio and contact first, personality files after.
export const aboutFolder: FileNode = {
  id: "about",
  name: "About",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      uiNode({ id: "about-me", name: "me.ui" }, "PersonalBioUI", {
        bio: "Hello! I'm Khwanchai Nontawichit (Khwan) — a Mobile Developer from Thailand with 4+ years of professional Flutter experience, currently in a full-stack role where I own the mobile product end-to-end and also work across Go backends, database design, and web. I specialize in Clean Architecture and love building apps that are fast, maintainable, and a joy to use. I lead teams, mentor juniors, and care deeply about code quality and shipping reliable products.",
        facts: [
          { label: "Name", value: "Khwanchai Nontawichit" },
          { label: "Alias", value: "Khwan" },
          { label: "Location", value: "Bangkok, Thailand" },
          { label: "Role", value: "Mobile Developer · Full-Stack" },
          { label: "Experience", value: "4+ Years" },
          { label: "Main Stack", value: "Flutter · Dart" },
          { label: "Languages", value: "Thai · English" },
          { label: "Status", value: "Open to Opportunities" },
        ],
      }),
      uiNode({ id: "about-contact", name: "contact.ui" }, "ContactUI", {
        links: [
          {
            label: "Email",
            value: "khwan.nontawichit@gmail.com",
            href: "mailto:khwan.nontawichit@gmail.com",
          },
          {
            label: "GitHub",
            value: "github.com/KhwanNon",
            href: "https://github.com/KhwanNon",
          },
          {
            label: "Location",
            value: "Bangkok, Thailand",
            href: "https://maps.google.com/?q=Bangkok,Thailand",
          },
        ],
      }),
      uiNode({ id: "about-hobbies", name: "hobbies.ui" }, "HobbiesUI", {
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
            description: "Lo-fi and jazz while coding. Silence for debugging.",
          },
          {
            name: "Traveling",
            emoji: "✈️",
            description: "Exploring new cities and cultures when offline.",
          },
        ],
      }),
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
    ],
  },
};
