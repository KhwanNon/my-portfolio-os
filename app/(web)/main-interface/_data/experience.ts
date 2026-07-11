import type { FileNode } from "@/app/shared/types/file-system";
import type { UiComponentProps } from "../_components/apps/ui-registry";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

/** Build a company folder: role description UI + tech-stack UI + optional company link. */
function makeCompanyFolder(
  id: string,
  name: string,
  descProps: UiComponentProps<"ExperienceDescriptionUI">,
  stackProps: UiComponentProps<"TechStackUI">,
  link?: string,
): FileNode {
  const children: FileNode[] = [
    uiNode(
      { id: `${id}-desc`, name: "description.ui" },
      "ExperienceDescriptionUI",
      descProps,
    ),
    uiNode(
      { id: `${id}-stack`, name: "tech_stack.ui" },
      "TechStackUI",
      stackProps,
    ),
  ];

  if (link) {
    children.push({
      id: `${id}-link`,
      name: "company.link",
      type: "link",
      icon: ICONS.link,
      data: { kind: "link", url: link },
    });
  }

  return {
    id,
    name,
    type: "folder",
    icon: ICONS.folder,
    data: { kind: "folder", children },
  };
}

export const experienceFolder: FileNode = {
  id: "experience",
  name: "Experience",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      makeCompanyFolder(
        "exp-learncloud",
        "2024-Present — LearnCloud",
        {
          role: "Mobile App Developer / Mobile Team Lead",
          company: "LEARNCLOUD CO., LTD. — Bangkok, Thailand",
          period: "01/2024 – Present",
          duration: "2.5+ Years",
          description:
            "Leading Flutter development from scratch with Clean Architecture — from planning and UX/UI collaboration through store deployment and release management.",
          highlights: [
            "Led the development of Flutter applications from scratch, implementing Clean Architecture",
            "Collaborated with backend, AI, and design teams, contributing ideas and assisting in UX/UI design",
            "Participated in Scrum-based planning meetings to ensure smooth project execution",
            "Managed app deployment to both the App Store & Play Store",
            "Oversaw version control, release management, and test build distribution",
            "Served as Mobile Team Lead, assigning tasks and managing workflows using Jira",
          ],
        },
        {
          title: "Tech Stack — LearnCloud",
          techs: [
            "Flutter",
            "Dart",
            "Clean Architecture",
            "Git",
            "Jira",
            "App Store Connect",
            "Play Console",
          ],
        },
      ),
      makeCompanyFolder(
        "exp-myorder",
        "2023 — MyOrder",
        {
          role: "Mobile Developer",
          company: "MYORDER MARKETING CO., LTD. — Chon Buri, Thailand",
          period: "05/2023 – 10/2023",
          duration: "6 Months",
          description:
            "Developed and maintained cross-platform mobile applications with Flutter and React Native in a collaborative product team.",
          highlights: [
            "Developed mobile applications using Flutter and React Native",
            "Worked with a team of developers to maintain and enhance applications",
            "Contributed to project planning, design discussions, and team meetings",
          ],
        },
        {
          title: "Tech Stack — MyOrder",
          techs: ["Flutter", "React Native", "TypeScript", "Dart", "Git"],
        },
      ),
      makeCompanyFolder(
        "exp-minerta",
        "2021-2023 — Minerta",
        {
          role: "Mobile Developer",
          company: "MINERTA TECHNOLOGY CO., LTD. — Bangkok, Thailand",
          period: "09/2021 – 04/2023",
          duration: "1 Year 8 Months",
          description:
            "Built mobile and web applications while mentoring junior developers on best practices, code reviews, and maintainability.",
          highlights: [
            "Developed mobile and web applications",
            "Mentored junior developers, providing guidance on best practices, code reviews, and improving maintainability",
            "Worked in a collaborative team to maintain and enhance applications",
            "Assisted senior developers in coding, testing, and debugging mobile applications",
            "Participated in team meetings and contributed to project planning & design discussions",
          ],
        },
        {
          title: "Tech Stack — Minerta",
          techs: ["Flutter", "React Native", "Nuxt", "TypeScript", "Dart", "Git"],
        },
      ),
    ],
  },
};
