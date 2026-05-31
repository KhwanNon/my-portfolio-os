"use client";
// Maps the `component` string on a UI FileNode to its React component.
// Each portfolio UI lives in ./ui, grouped by the resume domain it serves.
import { SkillsUI, SoftSkillsUI } from "./ui/skills-ui";
import { ExperienceDescriptionUI, TechStackUI } from "./ui/experience-ui";
import { EducationUI } from "./ui/education-ui";
import { PersonalBioUI, HobbiesUI, ContactUI } from "./ui/about-ui";
import { ProjectDescriptionUI } from "./ui/project-ui";
import { PropertiesUI, AboutOSUI } from "./ui/system-ui";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UI_COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
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
