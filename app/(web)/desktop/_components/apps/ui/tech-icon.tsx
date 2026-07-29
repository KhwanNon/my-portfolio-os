"use client";
import type { SimpleIcon } from "simple-icons";
import {
  siAndroidstudio,
  siAppstore,
  siDart,
  siDocker,
  siFastlane,
  siFigma,
  siFirebase,
  siFlutter,
  siFramer,
  siGit,
  siGithub,
  siGithubactions,
  siGoogleplay,
  siGraphql,
  siJavascript,
  siJira,
  siNextdotjs,
  siNodedotjs,
  siNuxt,
  siPostman,
  siPython,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVuedotjs,
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
  "framer motion": siFramer,

  // Backend & services
  firebase: siFirebase,
  firestore: siFirebase,
  "firebase auth": siFirebase,
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
  "android studio": siAndroidstudio,
  xcode: siXcode,
  "app store": siAppstore,
  "app store connect": siAppstore,
  "google play": siGoogleplay,
  "play console": siGoogleplay,
};

export function TechIcon({ name, size = 12 }: { name: string; size?: number }) {
  const icon = TECH_ICONS[name.trim().toLowerCase()];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0 opacity-80"
    >
      <path d={icon.path} />
    </svg>
  );
}
