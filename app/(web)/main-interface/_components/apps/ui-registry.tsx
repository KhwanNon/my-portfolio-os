"use client";
// Maps the `component` string on a UI FileNode to its React component.
// Each portfolio UI lives in ./ui, grouped by the resume domain it serves.
import { SkillsUI, SoftSkillsUI } from "./ui/skills-ui";
import { ExperienceDescriptionUI, TechStackUI } from "./ui/experience-ui";
import { EducationUI } from "./ui/education-ui";
import { PersonalBioUI, HobbiesUI, ContactUI } from "./ui/about-ui";
import { ProjectDescriptionUI } from "./ui/project-ui";
import { PropertiesUI, AboutOSUI } from "./ui/system-ui";

// Single source of truth: component name → component. Both the runtime renderer
// and the compile-time authoring types below are derived from this one object.
const REGISTRY = {
  SkillsUI,
  SoftSkillsUI,
  ExperienceDescriptionUI,
  TechStackUI,
  EducationUI,
  PersonalBioUI,
  HobbiesUI,
  ContactUI,
  ProjectDescriptionUI,
  PropertiesUI,
  AboutOSUI,
};

// Widened view for the renderer, which dispatches on a runtime `component` string.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UI_COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = REGISTRY;

/** Every valid `component` name — e.g. `"SkillsUI"`. */
export type UiComponentName = keyof typeof REGISTRY;

/** The exact props a given UI component expects, derived from the component itself. */
export type UiComponentProps<K extends UiComponentName> = React.ComponentProps<
  (typeof REGISTRY)[K]
>;
