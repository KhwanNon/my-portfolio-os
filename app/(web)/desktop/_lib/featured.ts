import type { FileNode } from "@/app/shared/types/file-system";

/**
 * Whether this node is the one to open first, or the way to it.
 *
 * A folder inherits the mark from anything it holds, so the frame appears on
 * Projects, then Work, then Mobile, then the file — a trail rather than a prize
 * that only shows up once the visitor has already found it. Marking is one flag
 * on one file; the folders above it can never fall out of sync because nothing
 * up there is set by hand.
 */
export function leadsToFeatured(node: FileNode): boolean {
  return findFeatured(node) !== null;
}

/**
 * The marked node itself, wherever it sits. The desktop card opens whatever
 * this returns rather than naming a file, so moving the mark to another project
 * moves the recommendation with it and nothing has to be edited twice.
 */
export function findFeatured(node: FileNode): FileNode | null {
  if (node.featured) return node;
  if (node.data?.kind !== "folder") return null;
  for (const child of node.data.children) {
    const hit = findFeatured(child);
    if (hit) return hit;
  }
  return null;
}
