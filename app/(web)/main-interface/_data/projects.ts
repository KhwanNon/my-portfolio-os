import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";

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
        {
          id: `${prefix}-desc`,
          name: "description.ui",
          type: "ui",
          icon: ICONS.ui,
          data: {
            kind: "ui",
            component: "ProjectDescriptionUI",
            props: {
              name: opts.name,
              type: opts.type,
              description: opts.description,
              highlights: opts.highlights,
              stack: opts.stack,
              status: opts.status,
              year: opts.year,
              platform: opts.platform,
            },
          },
        },
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

const mobileWorkFolder: FileNode = {
  id: "mobile-work",
  name: "Work",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
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
    ],
  },
};

const mobilePersonalFolder: FileNode = {
  id: "mobile-personal",
  name: "Personal",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
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
        stack: [
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
          "React",
        ],
        status: "In Development",
        year: "2024",
        platform: "Web",
        githubUrl: "https://github.com/your-username/portfolio-os",
      }),
    ],
  },
};

const mobileFolder: FileNode = {
  id: "mobile",
  name: "Mobile",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [mobileWorkFolder, mobilePersonalFolder],
  },
};

const webFolder: FileNode = {
  id: "web-projects",
  name: "Web",
  type: "folder",
  icon: ICONS.folder,
  data: { kind: "folder", children: [] },
};

const openSourceFolder: FileNode = {
  id: "open-source",
  name: "Open Source",
  type: "folder",
  icon: ICONS.folder,
  data: { kind: "folder", children: [] },
};

export const projectsFolder: FileNode = {
  id: "projects",
  name: "Projects",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [mobileFolder, webFolder, openSourceFolder],
  },
};
