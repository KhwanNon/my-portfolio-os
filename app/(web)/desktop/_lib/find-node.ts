import type { FileNode } from "@/app/shared/types/file-system";

/**
 * The node with this id, anywhere under `root` — the way one part of the tree
 * points at another without knowing where it lives.
 *
 * Experience uses it to reach the projects a job produced: the entry names an
 * id, not a path, so moving a project between the Work and Personal shelves, or
 * renaming its file, leaves the link intact. `ProjectId` keeps the id itself
 * honest at compile time; this only has to find where it ended up.
 */
export function findNodeById(root: FileNode, id: string): FileNode | null {
  if (root.id === id) return root;
  if (root.data?.kind !== "folder") return null;
  for (const child of root.data.children) {
    const hit = findNodeById(child, id);
    if (hit) return hit;
  }
  return null;
}
