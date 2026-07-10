import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

/** Build a project folder: screenshots slide + description UI + repo link. */
function makeProject(
  prefix: string,
  opts: {
    name: string;
    type: string;
    description: string;
    highlights: string[];
    stack: string[];
    status: string;
    year: string;
    platform?: string;
    githubUrl: string;
  },
): FileNode {
  return {
    id: `${prefix}-folder`,
    name: opts.name,
    type: "folder",
    icon: ICONS.folder,
    data: {
      kind: "folder",
      children: [
        {
          id: `${prefix}-images`,
          name: "images.slide",
          type: "slide",
          icon: ICONS.slide,
          data: {
            kind: "slide",
            title: `${opts.name} — Screenshots`,
            images: [
              {
                src: `/assets/projects/${prefix}/screen1.png`,
                caption: "Screen 1",
              },
              {
                src: `/assets/projects/${prefix}/screen2.png`,
                caption: "Screen 2",
              },
            ],
          },
        },
        uiNode(
          { id: `${prefix}-desc`, name: "description.ui" },
          "ProjectDescriptionUI",
          {
            name: opts.name,
            type: opts.type,
            description: opts.description,
            highlights: opts.highlights,
            stack: opts.stack,
            status: opts.status,
            year: opts.year,
            platform: opts.platform,
          },
        ),
        {
          id: `${prefix}-link`,
          name: "project.link",
          type: "link",
          icon: ICONS.link,
          data: { kind: "link", url: opts.githubUrl },
        },
      ],
    },
  };
}

// Positioning: Flutter Craftsman / Shipper — projects lead the portfolio, so
// they sit flat and prominent (production work first, personal after). No empty
// platform folders: a folder earns its place only when it holds real work.
const projectFolders: FileNode[] = [
  makeProject("proj-ecommerce", {
    name: "E-Commerce App",
    type: "Mobile · Work",
    description:
      "Production-grade shopping application with full cart, checkout, and payment flow. Built with Clean Architecture and BLoC state management.",
    highlights: [
      "Clean Architecture with 3-layer separation (data, domain, presentation)",
      "BLoC pattern for predictable state management",
      "Firebase Auth + Firestore integration",
      "In-app payment gateway integration",
      "Unit & widget test coverage > 80%",
    ],
    stack: ["Flutter", "Dart", "BLoC", "Firebase", "Clean Architecture"],
    status: "Completed",
    year: "2023",
    platform: "iOS & Android",
    githubUrl: "https://github.com/your-username/ecommerce-app",
  }),
  makeProject("proj-task-manager", {
    name: "Team Task Manager",
    type: "Mobile · Work",
    description:
      "Collaborative task management tool with real-time sync, project boards, member roles, and push notifications.",
    highlights: [
      "Real-time Firestore listeners for live task updates",
      "Role-based access control (Admin / Member / Viewer)",
      "Push notifications via Firebase Cloud Messaging",
      "Offline-first with local cache strategy",
      "CI/CD pipeline with Fastlane",
    ],
    stack: ["Flutter", "Dart", "Firebase", "FCM", "Fastlane", "MVVM"],
    status: "Completed",
    year: "2022",
    platform: "iOS & Android",
    githubUrl: "https://github.com/your-username/task-manager",
  }),
  makeProject("proj-portfolio-os", {
    name: "Portfolio OS",
    type: "Mobile · Personal",
    description:
      "This portfolio itself — a Next.js web app styled as a desktop operating system with a window manager, file system, terminal, and theme switching.",
    highlights: [
      "Custom window manager with drag, minimize, maximize, z-index",
      "Virtual typed file system (folder, txt, ui, pdf, slide, link)",
      "Working terminal with command parsing",
      "Multi-theme support (Cyber Blue, Matrix, Light)",
      "Framer Motion animations throughout",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React"],
    status: "In Development",
    year: "2024",
    platform: "Web",
    githubUrl: "https://github.com/your-username/portfolio-os",
  }),
];

export const projectsFolder: FileNode = {
  id: "projects",
  name: "Projects",
  type: "folder",
  icon: ICONS.folder,
  data: { kind: "folder", children: projectFolders },
};
