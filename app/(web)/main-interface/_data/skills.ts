import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";

const technicalFolder: FileNode = {
  id: "skills-technical",
  name: "Technical",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "skill-languages",
        name: "Languages.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "Programming Languages",
            layout: "bars",
            items: [
              { name: "Dart", level: 95 },
              { name: "TypeScript", level: 80 },
              { name: "JavaScript", level: 78 },
              { name: "Python", level: 55 },
              { name: "SQL", level: 65 },
            ],
          },
        },
      },
      {
        id: "skill-frameworks",
        name: "Frameworks.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "Frameworks & Libraries",
            layout: "bars",
            items: [
              { name: "Flutter", level: 95 },
              { name: "React", level: 82 },
              { name: "Next.js", level: 80 },
              { name: "Node.js", level: 65 },
              { name: "Tailwind", level: 88 },
            ],
          },
        },
      },
      {
        id: "skill-backend",
        name: "Backend_Service.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "Backend & Services",
            layout: "badges",
            items: [
              { name: "Firebase" },
              { name: "Firestore" },
              { name: "Firebase Auth" },
              { name: "Firebase FCM" },
              { name: "REST API" },
              { name: "Supabase" },
              { name: "GraphQL" },
            ],
          },
        },
      },
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
      {
        id: "skill-design",
        name: "Design_Tools.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "Design Tools",
            layout: "badges",
            items: [
              { name: "Figma" },
              { name: "Adobe XD" },
              { name: "Zeplin" },
              { name: "InVision" },
            ],
          },
        },
      },
      {
        id: "skill-devops",
        name: "DevOps_Tools.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "SkillsUI",
          props: {
            title: "DevOps & Tools",
            layout: "badges",
            items: [
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
        },
      },
    ],
  },
};

export const skillsFolder: FileNode = {
  id: "skills",
  name: "Skills",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      technicalFolder,
      {
        id: "skill-soft",
        name: "Soft_Skills.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "SoftSkillsUI",
          props: {
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
          },
        },
      },
    ],
  },
};
