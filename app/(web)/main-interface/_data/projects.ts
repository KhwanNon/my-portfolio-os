import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

/** Build a project folder: screenshots slide + description UI + optional store/repo link. */
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
    /** Public paths to screenshots; omit when the project has none. */
    images?: string[];
    link?: { name: string; url: string };
  },
): FileNode {
  const children: FileNode[] = [];

  if (opts.images?.length) {
    children.push({
      id: `${prefix}-images`,
      name: "images.slide",
      type: "slide",
      icon: ICONS.slide,
      data: {
        kind: "slide",
        title: `${opts.name} — Screenshots`,
        images: opts.images.map((src, i) => ({
          src,
          caption: `Screenshot ${i + 1}`,
        })),
      },
    });
  }

  children.push(
    uiNode({ id: `${prefix}-desc`, name: "description.ui" }, "ProjectDescriptionUI", {
      name: opts.name,
      type: opts.type,
      description: opts.description,
      highlights: opts.highlights,
      stack: opts.stack,
      status: opts.status,
      year: opts.year,
      platform: opts.platform,
    }),
  );

  if (opts.link) {
    children.push({
      id: `${prefix}-link`,
      name: opts.link.name,
      type: "link",
      icon: ICONS.link,
      data: { kind: "link", url: opts.link.url },
    });
  }

  return {
    id: `${prefix}-folder`,
    name: opts.name,
    type: "folder",
    icon: ICONS.folder,
    data: { kind: "folder", children },
  };
}

/** Screenshot paths for a project living under /public/assets/projects/<slug>/. */
function shots(slug: string, files: string[]): string[] {
  return files.map((file) => `/assets/projects/${slug}/${file}`);
}

// Positioning: Flutter Craftsman / Shipper — Flutter production work leads,
// React Native and web work follow, personal work closes the list.
const projectFolders: FileNode[] = [
  makeProject("proj-vn", {
    name: "VN",
    type: "Mobile · Work",
    description:
      "Cross-platform mobile application built with Flutter and shipped to production on the Play Store.",
    highlights: [
      "Single Flutter codebase serving both Android and iOS",
      "Built and maintained as part of a production mobile team",
      "Live on the Play Store",
    ],
    stack: ["Flutter", "Dart"],
    status: "Live on Play Store",
    year: "2022",
    platform: "iOS & Android",
    images: shots("vn", ["vn1.png", "vn2.png", "vn3.png", "vn4.png"]),
    link: {
      name: "playstore.link",
      url: "https://play.google.com/store/apps/details?id=com.viknavara.vn",
    },
  }),
  makeProject("proj-enfagrow", {
    name: "Enfagrow",
    type: "Mobile · Work",
    description:
      "Cross-platform mobile application for the Enfagrow brand, built with Flutter with a focus on a smooth, visually polished user experience.",
    highlights: [
      "Single Flutter codebase serving both Android and iOS",
      "Brand-facing UI built to design-team specification",
    ],
    stack: ["Flutter", "Dart"],
    status: "Completed",
    year: "2022",
    platform: "iOS & Android",
    images: shots("enfagrow", ["EF1.png", "EF2.png", "EF3.png", "EF4.png"]),
  }),
  makeProject("proj-ailearn", {
    name: "aiLearn",
    type: "Mobile · Work",
    description:
      "AI-assisted learning mobile application, built with Flutter and shipped to production on the Play Store.",
    highlights: [
      "Cross-platform learning experience on a single codebase",
      "Live on the Play Store",
    ],
    stack: ["Flutter", "Dart"],
    status: "Live on Play Store",
    year: "2023",
    platform: "iOS & Android",
    images: shots("ailearn", ["ai1.png", "ai2.png", "ai3.png", "ai4.png"]),
    link: {
      name: "playstore.link",
      url: "https://play.google.com/store/apps/details?id=ai.myorder&hl=th&gl=US",
    },
  }),
  makeProject("proj-myorder", {
    name: "My Order",
    type: "Mobile · Work",
    description:
      "Cross-platform ordering application built with React Native and TypeScript, with a strong emphasis on code quality, scalability, and maintainability.",
    highlights: [
      "React Native + TypeScript for typed, maintainable cross-platform code",
      "Built and enhanced within a collaborative product team",
    ],
    stack: ["React Native", "TypeScript"],
    status: "Completed",
    year: "2023",
    platform: "iOS & Android",
    images: shots("myorder", ["MO1.jpg", "MO2.jpg", "MO3.jpg", "MO4.jpg"]),
  }),
  makeProject("proj-g2g", {
    name: "G2G",
    type: "Mobile · Work",
    description:
      "Cross-platform mobile application built with React Native and TypeScript, focused on code quality and long-term maintainability.",
    highlights: [
      "React Native + TypeScript cross-platform delivery",
      "Static typing for safer refactors and clearer structure",
    ],
    stack: ["React Native", "TypeScript"],
    status: "Completed",
    year: "2022",
    platform: "iOS & Android",
    images: shots("g2g", ["G2G1.png", "G2G2.png", "G2G3.png", "G2G4.png"]),
  }),
  makeProject("proj-evp", {
    name: "EVP Network",
    type: "Mobile · Work",
    description:
      "Cross-platform network application built with React Native and TypeScript, delivered as part of a production mobile team.",
    highlights: [
      "React Native + TypeScript cross-platform delivery",
      "Built and maintained collaboratively in production",
    ],
    stack: ["React Native", "TypeScript"],
    status: "Completed",
    year: "2022",
    platform: "iOS & Android",
    images: shots("evp", ["EVP1.jpg", "EVP2.jpg", "EVP3.jpg", "EVP4.jpg"]),
  }),
  makeProject("proj-the-blacklist", {
    name: "The Blacklist",
    type: "Web · Work",
    description:
      "Dynamic, performant web application built with Nuxt, focused on scalability and a modern, responsive user experience.",
    highlights: [
      "Nuxt framework for a streamlined, feature-rich web app",
      "Responsive UI with a focus on user experience",
    ],
    stack: ["Nuxt", "Vue"],
    status: "Completed",
    year: "2022",
    platform: "Web",
    images: shots("the-blacklist", ["bl1.jpg", "bl2.jpg", "bl3.jpg", "bl4.jpg"]),
  }),
  makeProject("proj-portfolio-os", {
    name: "Portfolio OS",
    type: "Web · Personal",
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
    year: "2026",
    platform: "Web",
    link: { name: "github.link", url: "https://github.com/KhwanNon" },
  }),
];

export const projectsFolder: FileNode = {
  id: "projects",
  name: "Projects",
  type: "folder",
  icon: ICONS.folder,
  data: { kind: "folder", children: projectFolders },
};
