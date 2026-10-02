import type { FileNode } from "@/app/shared/types/file-system";
import type { Strings } from "@/app/shared/i18n/strings";

/**
 * One line on what a node holds, for the card that stands for it: a folder
 * names what is inside, a view gives its own title, anything else its kind.
 */
export function describe(node: FileNode, S: Strings): string {
  if (node.data?.kind === "folder") {
    const names = node.data.children.map((c) => c.name.replace(/\.ui$/, ""));
    if (names.length === 0) return S.folder.empty;
    return names.slice(0, 3).join(" · ") + (names.length > 3 ? " …" : "");
  }
  if (node.data?.kind === "ui") {
    const title = (node.data.props as { title?: unknown } | undefined)?.title;
    if (typeof title === "string") return title;
  }
  return S.fileKind.byType[node.type] ?? S.fileKind.fallback;
}
