"use client";
import {
  Folder,
  HardDrive,
  Trash2,
  FileText,
  FileType2,
  Layers,
  Images,
  Link2,
  Terminal,
  SlidersHorizontal,
  Info,
  File,
  type LucideIcon,
} from "lucide-react";

/**
 * Registry of icon-key → Lucide component.
 * File system data references icons by key (e.g. "folder", "cdrive") rather
 * than image paths, so the icon set can be re-themed in one place.
 */
const REGISTRY: Record<string, LucideIcon> = {
  folder:    Folder,
  cdrive:    HardDrive,
  recycle:   Trash2,
  txt:       FileText,
  pdf:       FileType2,
  ui:        Layers,
  slide:     Images,
  link:      Link2,
  sysCmd:    Terminal,
  prefs:     SlidersHorizontal,
  about:     Info,
  file:      File,
};

export type IconKey = keyof typeof REGISTRY | string;

interface FileGraphicProps {
  icon?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function FileGraphic({
  icon,
  size = 48,
  strokeWidth = 1.5,
  className,
}: FileGraphicProps) {
  const Comp: LucideIcon = (icon ? REGISTRY[icon] : undefined) ?? File;
  return <Comp size={size} strokeWidth={strokeWidth} className={className} />;
}
