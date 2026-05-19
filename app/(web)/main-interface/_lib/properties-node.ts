import type { FileNode } from "@/app/shared/types/file-system";
import { findPath } from "./path-resolver";
import { fakeDate, fakeSize, humanSize } from "./terminal-utils";
import { desktopFileSystem } from "../_data/file-system-data";

const KIND_LABELS: Record<string, string> = {
  folder:  "Directory",
  txt:     "Text Document",
  pdf:     "PDF Document",
  ui:      "UI View",
  slide:   "Slideshow",
  link:    "Web Link",
  program: "Program",
};

/**
 * Build a synthetic FileNode that renders the Properties panel for `target`.
 * The same target id always produces the same props node id, so reopening
 * the panel focuses the existing window instead of stacking duplicates.
 */
export function makePropertiesNode(target: FileNode): FileNode {
  const path = findPath(desktopFileSystem, target.id) ?? [];
  const absolutePath = path.length === 0 ? "~" : `~/${path.join("/")}`;

  const itemCount =
    target.type === "folder" && target.data?.kind === "folder"
      ? target.data.children.length
      : undefined;

  return {
    id: `props-${target.id}`,
    name: `Properties — ${target.name}`,
    type: "ui",
    iconPath: target.iconPath,
    data: {
      kind: "ui",
      component: "PropertiesUI",
      props: {
        targetName: target.name,
        targetType: target.type,
        targetKind: KIND_LABELS[target.type] ?? target.type,
        iconPath: target.iconPath,
        absolutePath,
        sizeText: humanSize(fakeSize(target)),
        dateText: fakeDate(target),
        itemCount,
      },
    },
  };
}

/** Absolute display path for a node (`~`-rooted), or null if not in the tree. */
export function absolutePathOf(target: FileNode): string | null {
  const path = findPath(desktopFileSystem, target.id);
  if (path === null) return null;
  return path.length === 0 ? "~" : `~/${path.join("/")}`;
}

/** Absolute path as a string[]. Empty array = root. */
export function pathSegmentsOf(target: FileNode): string[] {
  return findPath(desktopFileSystem, target.id) ?? [];
}
