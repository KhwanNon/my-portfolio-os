import type { FileNode } from "@/app/shared/types/file-system";

/** The tile that stands for a node in a folder, where its data names one. */
export function coverOf(node: FileNode): string | null {
  if (node.data?.kind !== "ui") return null;
  const cover = (node.data.props as { cover?: unknown } | undefined)?.cover;
  return typeof cover === "string" ? cover : null;
}
