import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

// Flat folder — every skill area is one click from the Skills window.
export const skillsFolder: FileNode = {
  id: "skills",
  name: "Skills",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      uiNode(
        { id: "skill-languages", name: "Languages.ui" },
        "SkillsUI",
        {
          title: "Programming Languages",
          layout: "list",
          items: [
            { name: "Dart", note: "production daily · since 2021" },
            { name: "Go", note: "production backend · current" },
            { name: "TypeScript", note: "production · since 2021" },
            { name: "JavaScript", note: "production · since 2021" },
            { name: "SQL", note: "production · schema design" },
            { name: "Python", note: "familiar" },
          ],
        },
      ),
      uiNode(
        { id: "skill-frameworks", name: "Frameworks.ui" },
        "SkillsUI",
        {
          title: "Frameworks & Libraries",
          layout: "list",
          items: [
            { name: "Flutter", note: "production daily · since 2021" },
            { name: "React Native", note: "production · 2021–2023" },
            { name: "Vue", note: "production · current" },
            { name: "React", note: "side projects · this site" },
            { name: "Next.js", note: "side projects · this site" },
            { name: "Tailwind", note: "daily on web work" },
            { name: "Node.js", note: "working knowledge" },
          ],
        },
      ),
      uiNode(
        { id: "skill-backend", name: "Backend_Services.ui" },
        "SkillsUI",
        {
          title: "Backend & Services",
          layout: "badges",
          items: [
            { name: "SQL Server" },
            { name: "Redis" },
            { name: "RabbitMQ" },
            { name: "Firebase" },
            { name: "Firestore" },
            { name: "Firebase Auth" },
            { name: "Firebase FCM" },
            { name: "REST API" },
            { name: "Supabase" },
            { name: "GraphQL" },
          ],
        },
      ),
      uiNode(
        { id: "skill-tools", name: "Tools.ui" },
        "SkillsUI",
        {
          title: "Design & DevOps Tools",
          layout: "badges",
          items: [
            { name: "Figma" },
            { name: "Adobe XD" },
            { name: "Zeplin" },
            { name: "InVision" },
            { name: "Git" },
            { name: "GitHub Actions" },
            { name: "Fastlane" },
            { name: "Docker" },
            { name: "Firebase App Distribution" },
            { name: "VS Code" },
            { name: "Android Studio" },
            { name: "Xcode" },
            { name: "Postman" },
          ],
        },
      ),
      uiNode({ id: "skill-soft", name: "Soft_Skills.ui" }, "SoftSkillsUI", {
        skills: [
          {
            name: "Leadership",
            description:
              "Led teams of 3–6 developers, ran daily standups, code reviews, and sprint planning.",
          },
          {
            name: "Problem Solving",
            description:
              "Methodical debugger and root-cause analyst — comfortable with both logic and architecture problems.",
          },
          {
            name: "Fast Learner",
            description:
              "Picked up React / Next.js independently while working full-time. Learn by doing, then by teaching.",
          },
          {
            name: "Communication",
            description:
              "Clear async writer. Can translate technical constraints into plain language for stakeholders.",
          },
          {
            name: "Ownership",
            description:
              "Ships features end-to-end — from requirements to deployment, monitoring, and post-release support.",
          },
          {
            name: "Adaptability",
            description:
              "Comfortable switching between tight deadlines and exploratory side projects without losing quality.",
          },
        ],
      }),
      {
        id: "skill-english",
        name: "English.txt",
        type: "txt",
        icon: ICONS.txt,
        data: {
          kind: "txt",
          content: `> ENGLISH_PROFICIENCY.TXT
> ─────────────────────────────────────────

  Level      :  Professional Working Proficiency
  Reading    :  ████████████  Advanced
  Writing    :  ████████████  Advanced
  Speaking   :  ██████████░░  Upper-Intermediate
  Listening  :  ████████████  Advanced

──────────────────────────────────────────────────────
  Can read and write technical documentation fluently.
  Comfortable with English-language code reviews,
  Slack communication, and async team collaboration.
──────────────────────────────────────────────────────

> EOF`,
        },
      },
    ],
  },
};
