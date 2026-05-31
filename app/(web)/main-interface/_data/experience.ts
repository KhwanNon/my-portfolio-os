import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";

/** Build a company folder: role description UI + tech-stack UI + company link. */
function makeCompanyFolder(
  id: string,
  name: string,
  descProps: object,
  stackProps: object,
  link: string,
): FileNode {
  return {
    id,
    name,
    type: "folder",
    icon: ICONS.folder,
    data: {
      kind: "folder",
      children: [
        {
          id: `${id}-desc`,
          name: "description.ui",
          type: "ui",
          icon: ICONS.ui,
          data: {
            kind: "ui",
            component: "ExperienceDescriptionUI",
            props: descProps,
          },
        },
        {
          id: `${id}-stack`,
          name: "tech_stack.ui",
          type: "ui",
          icon: ICONS.ui,
          data: { kind: "ui", component: "TechStackUI", props: stackProps },
        },
        {
          id: `${id}-link`,
          name: "company.link",
          type: "link",
          icon: ICONS.link,
          data: { kind: "link", url: link },
        },
      ],
    },
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
        "exp-company-a",
        "2022-Present — Company A",
        {
          role: "Senior Flutter Developer",
          company: "Company A",
          period: "2022 – Present",
          duration: "3+ Years",
          description:
            "Lead developer responsible for architecture decisions, feature delivery, and team mentoring across multiple Flutter applications serving thousands of daily active users.",
          highlights: [
            "Architected Clean Architecture foundation adopted across all mobile products",
            "Led team of 4 developers — code reviews, sprint planning, and 1-on-1 mentoring",
            "Reduced app crash rate by 60% through structured error handling and monitoring",
            "Shipped 12 major releases with zero critical production incidents",
            "Introduced BLoC pattern, cutting state-related bug reports by 40%",
            "Integrated CI/CD with GitHub Actions + Fastlane for automated delivery",
          ],
        },
        {
          title: "Tech Stack — Company A",
          techs: [
            "Flutter",
            "Dart",
            "BLoC",
            "Clean Architecture",
            "Firebase",
            "REST API",
            "GitHub Actions",
            "Fastlane",
            "GetIt",
            "Dio",
            "Hive",
          ],
        },
        "https://company-a.com",
      ),
      makeCompanyFolder(
        "exp-company-b",
        "2021-2022 — Company B",
        {
          role: "Junior Flutter Developer",
          company: "Company B",
          period: "2021 – 2022",
          duration: "1 Year",
          description:
            "First professional role — contributed to feature development, API integrations, and bug fixing across two live mobile products.",
          highlights: [
            "Developed 8 new feature screens from Figma designs to production",
            "Integrated REST APIs with error handling and retry logic",
            "Participated in 2-week agile sprints with daily standups",
            "Wrote unit tests achieving 60% coverage on new features",
            "Improved app startup time by 30% through lazy initialization",
          ],
        },
        {
          title: "Tech Stack — Company B",
          techs: [
            "Flutter",
            "Dart",
            "Provider",
            "REST API",
            "Firebase",
            "Git",
            "Figma",
          ],
        },
        "https://company-b.com",
      ),
    ],
  },
};
