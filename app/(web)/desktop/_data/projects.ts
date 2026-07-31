import type { FileNode } from "@/app/shared/types/file-system";
import type { UiComponentProps } from "../_components/apps/ui-registry";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

/** One project = one .ui file: description, screenshots, stack, and link together. */
function makeProject(
  id: string,
  props: UiComponentProps<"ProjectUI">,
): FileNode {
  return uiNode({ id, name: `${props.name}.ui` }, "ProjectUI", props);
}

/**
 * The `count` screenshots of a project, which are named by convention:
 * `/assets/projects/<slug>/<slug>-01.<ext>` and up. Keeping the naming a rule
 * rather than a list means adding a shot is a number here and a file there.
 */
function shots(
  slug: string,
  count: number,
  ext: "png" | "jpg" = "png",
): string[] {
  return Array.from(
    { length: count },
    (_, i) =>
      `/assets/projects/${slug}/${slug}-${String(i + 1).padStart(2, "0")}.${ext}`,
  );
}

/** A shelf in the projects cabinet — folders here hold nothing but projects. */
function folder(id: string, name: string, children: FileNode[]): FileNode {
  return {
    id,
    name,
    type: "folder",
    icon: ICONS.folder,
    data: { kind: "folder", children },
  };
}

// Positioning: Flutter Craftsman / Shipper — Flutter production work leads,
// React Native follows, web closes each shelf.
const workMobile: FileNode[] = [
  makeProject("proj-mol-portal", {
    name: "MOL Portal",
    type: "Mobile · Work",
    description:
      "The Ministry of Labour's citizen service app, where I own the labour-complaint module end to end. A worker in Thailand or posted overseas files a grievance from their phone, follows it to a verdict, and keeps a signed acknowledgment letter — work that used to mean a trip to a government office.",
    highlights: [
      "Built both intake systems — domestic and overseas — on one shared four-step base, so a change to validation, attachments or review lands on both at once instead of twice",
      "The whole case lifecycle: draft, edit, submit, track, satisfaction rating, and searchable history with status filters and per-case chat",
      "Generates the official acknowledgment letter as a PDF on the device, downloadable straight from the case history",
      "Cascading province → district → subdistrict address pickers over the national dataset, plus attachments and a submit-confirm step",
      "Inherited a monolithic ApiGatewayService and split it into per-domain services, then rewired every caller and deleted the monolith",
      "Left it more maintainable than I found it: main.dart pulled apart into an app/core module, a shared complaint module, unit tests around the API layer, and a GitHub Actions workflow running analyze and test on every PR",
    ],
    stack: ["Flutter", "Dart", "GetX", "Dio", "GitHub Actions"],
    status: "In Production",
    year: "2026",
    platform: "iOS & Android",
    images: shots("mol", 11),
  }),
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
    images: shots("vn", 4),
    link: {
      label: "Play Store",
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
    images: shots("enfagrow", 4),
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
    images: shots("ailearn", 4),
    link: {
      label: "Play Store",
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
    images: shots("myorder", 4, "jpg"),
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
    images: shots("g2g", 4),
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
    images: shots("evp", 4, "jpg"),
  }),
];

const workWeb: FileNode[] = [
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
    images: shots("the-blacklist", 4, "jpg"),
  }),
];

const personalMobile: FileNode[] = [
  makeProject("proj-langridge", {
    name: "Langridge",
    type: "Mobile · Personal",
    description:
      "A voice interpreter that runs entirely on the phone. One person speaks and the other hears it in their own language — speech recognition, translation by a quantised LLM running through llama.cpp, and speech synthesis all happen on the device, so a conversation works with no network and nothing spoken ever leaves the handset.",
    highlights: [
      "Fully on-device pipeline — speech → translation → speech — with no backend of any kind; once a model is downloaded the app never needs the network again",
      "llama.cpp bound through dart:ffi and driven from a dedicated isolate, warmed with a one-token pass after load so the first translation doesn't pay the shader-compile cost",
      "Two-stage prompting — understand (repair the transcript, tag the intent) then translate — trading ~2× latency for markedly steadier output from 0.5–2B models",
      "Model catalog with in-app download: a 400 MB default that loads on every iPhone since the 8, and Gemma 3 / Qwen 3 / Llama 3.2 options for devices with headroom",
      "Face-to-face two-panel surface — a mic per speaker, live waveform, typewriter reveal, edge pulse and haptics — across 75 languages mapped to BCP-47 for the platform speech engines",
      "Clean architecture per feature, with SQLite history, a model health watchdog that restarts a crashed isolate, and a Thai/English UI",
    ],
    stack: ["Flutter", "Dart", "llama.cpp", "dart:ffi", "SQLite"],
    status: "In Development",
    year: "2026",
    platform: "iOS · On-device AI",
    images: shots("langridge", 6),
  }),
  makeProject("proj-pdf-drawing", {
    name: "PDF Drawing",
    type: "Mobile · Personal",
    description:
      "A study of how PDF annotation actually works, built from scratch instead of bought as an SDK. Each page is rendered to an image and a CustomPainter sits on top of it, so the pen, highlighter, shapes and eraser are all drawn and hit-tested by hand.",
    highlights: [
      "Annotations are a typed model (pen / shape / text) keyed by page — a stroke stays an object that can be recoloured or removed, not pixels burned into the page",
      "The eraser works by geometry rather than by painting over: point-to-segment distance for strokes, and edge or radius tests for rectangles, circles and triangles",
      "Pages render at 2× device pixels, and the drawing layer turns pointer-transparent under the select tool so the document still scrolls normally",
      "Floating, draggable tool rail — pen, highlighter, shape, text, eraser — with a grouped colour palette and a stroke size per tool",
      "Reads from asset, file or network; the demo streams a real PDF straight off the web",
      "Kept deliberately small (~1,800 lines, annotations in memory only) — the point was to find where an annotation engine gets hard, not to ship one",
    ],
    stack: ["Flutter", "Dart", "pdfx", "CustomPainter"],
    status: "Prototype",
    year: "2026",
    platform: "iOS & Android · Tablet-first",
    images: shots("pdf-drawing", 3),
  }),
];

const personalWeb: FileNode[] = [
  makeProject("proj-c-docs", {
    name: "C-DOCS",
    type: "Web · Personal",
    description:
      "A Markdown workspace that lives entirely in the browser. Documents are kept in a SQLite database inside the browser's own file system and encrypted at rest with a key only the author holds — so there is no account to create, no server to trust with the content, and the workspace keeps working offline.",
    highlights: [
      "Local-first by design: SQLite compiled to WebAssembly, running on OPFS in a Web Worker — the device is the source of truth, not a server",
      "Encrypted at rest with AES-GCM; the key is generated on-device and downloaded as a file, and a wrong key simply fails to decrypt — there is no password to check",
      "Clean architecture (domain → application → infrastructure) lets the identical use cases run on OPFS in the browser and better-sqlite3 on the server",
      "Full Markdown editing: GFM, KaTeX math, Mermaid diagrams, syntax highlighting, live split preview, autosave and undo history",
      "Workspace essentials — folders, favourites, recents, trash with restore, ⌘K search, templates, and whole-workspace export/import",
      "Durability taken seriously: single-writer tab lock, persistent-storage requests, and backup nudges against silent OPFS eviction",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "SQLite",
      "WebAssembly",
      "Tailwind CSS",
    ],
    status: "Live",
    year: "2026",
    platform: "Web · Installable PWA",
    images: shots("c-docs", 6),
    link: { label: "Live Demo", url: "https://c-docs-web.vercel.app" },
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
      "Dual-theme support (Daylight, Cyber Blue)",
      "Framer Motion animations throughout",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React"],
    status: "In Development",
    year: "2026",
    platform: "Web",
    link: { label: "GitHub", url: "https://github.com/KhwanNon" },
  }),
];

/**
 * Two shelves, each split the same way. Work comes first because that is what
 * the visit is for, and Mobile leads Web inside both because that is the trade
 * this portfolio claims. Personal is deliberately thin for now — it is a place
 * held open, not a second body of work.
 */
export const projectsFolder: FileNode = folder("projects", "Projects", [
  folder("projects-work", "Work", [
    folder("projects-work-mobile", "Mobile", workMobile),
    folder("projects-work-web", "Web", workWeb),
  ]),
  folder("projects-personal", "Personal", [
    folder("projects-personal-mobile", "Mobile", personalMobile),
    folder("projects-personal-web", "Web", personalWeb),
  ]),
]);
