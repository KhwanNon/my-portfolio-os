import type { FileNode } from "@/app/shared/types/file-system";
import type { Strings } from "@/app/shared/i18n/strings";
import { findPath } from "./path-resolver";
import { fakeDate, fakeSize, humanSize } from "./terminal-utils";

/**
 * Build a synthetic FileNode that renders the Properties panel for `target`.
 * The same target id always produces the same props node id, so reopening
 * the panel focuses the existing window instead of stacking duplicates.
 *
 * The tree is passed in rather than imported: it is the *localized* drive the
 * caller is already looking at, and this file has no business deciding which
 * language that is.
 */
export function makePropertiesNode(
  target: FileNode,
  tree: FileNode[],
  S: Strings,
): FileNode {
  const path = findPath(tree, target.id) ?? [];
  const absolutePath = path.length === 0 ? "~" : `~/${path.join("/")}`;

  const itemCount =
    target.type === "folder" && target.data?.kind === "folder"
      ? target.data.children.length
      : undefined;

  return {
    id: `props-${target.id}`,
    name: S.properties.title(target.name),
    type: "ui",
    icon: target.icon,
    data: {
      kind: "ui",
      component: "PropertiesUI",
      props: {
        targetName: target.name,
        targetType: target.type,
        targetKind: S.properties.kind[target.type] ?? target.type,
        icon: target.icon,
        absolutePath,
        sizeText: humanSize(fakeSize(target)),
        dateText: fakeDate(target),
        itemCount,
      },
    },
  };
}

/**
 * Absolute display path for a node (`~`-rooted), or null if not in the tree.
 *
 * A path never changes with the language — names here are filenames, not copy —
 * so any language's tree gives the same answer.
 */
export function absolutePathOf(
  target: FileNode,
  tree: FileNode[],
): string | null {
  const path = findPath(tree, target.id);
  if (path === null) return null;
  return path.length === 0 ? "~" : `~/${path.join("/")}`;
}

/** Absolute path as a string[]. Empty array = root. */
export function pathSegmentsOf(target: FileNode, tree: FileNode[]): string[] {
  return findPath(tree, target.id) ?? [];
}
