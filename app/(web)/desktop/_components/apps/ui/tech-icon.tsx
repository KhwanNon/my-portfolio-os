"use client";
import type { SimpleIcon } from "simple-icons";
import {
  siAndroid,
  siAndroidstudio,
  siAppstore,
  siCplusplus,
  siDart,
  siDocker,
  siFastapi,
  siFastlane,
  siFigma,
  siFirebase,
  siFlutter,
  siFramer,
  siGit,
  siGithub,
  siGithubactions,
  siGo,
  siGoogleplay,
  siGraphql,
  siJavascript,
  siJira,
  siKotlin,
  siNextdotjs,
  siNodedotjs,
  siNuxt,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siSqlalchemy,
  siSocketdotio,
  siSqlite,
  siSupabase,
  siSvelte,
  siSwift,
  siTailwindcss,
  siTypescript,
  siVuedotjs,
  siWebassembly,
  siXcode,
} from "simple-icons";

// TechIcon — single source of truth for technology logos across the portfolio.
// Monochrome brand SVGs tinted via currentColor so they follow the theme tokens.
// Unknown names render nothing: chips and bars degrade gracefully to text-only.

const TECH_ICONS: Record<string, SimpleIcon> = {
  // Languages
  dart: siDart,
  typescript: siTypescript,
  javascript: siJavascript,
  python: siPython,
  go: siGo,
  kotlin: siKotlin,
  swift: siSwift,
  "c/c++": siCplusplus,
  "c++": siCplusplus,

  // Frameworks & libraries
  flutter: siFlutter,
  react: siReact,
  "react native": siReact,
  "next.js": siNextdotjs,
  "node.js": siNodedotjs,
  tailwind: siTailwindcss,
  "tailwind css": siTailwindcss,
  nuxt: siNuxt,
  vue: siVuedotjs,
  "vue.js": siVuedotjs,
  "vue 3": siVuedotjs,
  "framer motion": siFramer,
  webassembly: siWebassembly,
  svelte: siSvelte,
  sveltekit: siSvelte,

  // Backend & services
  fastapi: siFastapi,
  firebase: siFirebase,
  postgresql: siPostgresql,
  sqlalchemy: siSqlalchemy,
  sqlite: siSqlite,
  firestore: siFirebase,
  "firebase firestore": siFirebase,
  "firebase auth": siFirebase,
  websocket: siSocketdotio,
  "firebase fcm": siFirebase,
  "firebase app distribution": siFirebase,
  supabase: siSupabase,
  graphql: siGraphql,

  // Tools & platforms
  git: siGit,
  github: siGithub,
  "github actions": siGithubactions,
  fastlane: siFastlane,
  docker: siDocker,
  postman: siPostman,
  figma: siFigma,
  jira: siJira,
  android: siAndroid,
  "android studio": siAndroidstudio,
  xcode: siXcode,
  "app store": siAppstore,
  "app store connect": siAppstore,
  "google play": siGoogleplay,
  "play console": siGoogleplay,
};

/** Whether `name` has a logo to draw — for surfaces that put something else in its place. */
export function hasTechIcon(name: string): boolean {
  return name.trim().toLowerCase() in TECH_ICONS;
}

export function TechIcon({
  name,
  size = 12,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const icon = TECH_ICONS[name.trim().toLowerCase()];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className ?? "opacity-80"}`}
    >
      <path d={icon.path} />
    </svg>
  );
}
