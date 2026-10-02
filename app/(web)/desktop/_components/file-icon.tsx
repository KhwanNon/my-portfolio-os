"use client";
// FileIcon — a file system node as it sits in a folder window: a square card,
// like an item in a game's inventory, with the file's art large in the middle,
// its name under it, and one line on what it holds. Behaviour lives in
// useFileInteraction; this file is only the skin. (A shelf of projects draws
// covers instead — see `CoverTile` — and the desktop has `DesktopIcon`.)
import type { FileNode } from "@/app/shared/types/file-system";
import type { Strings } from "@/app/shared/i18n/strings";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useFileInteraction } from "../_lib/use-file-interaction";
import { leadsToFeatured } from "../_lib/featured";
import { IconTile } from "./file-graphic";
import { FeaturedStar } from "./featured-star";

interface FileIconProps {
  fileNode: FileNode;
  /** Replaces the line under the name, for surfaces that know something better to say. */
  caption?: string;
  /** Override the default open behaviour */
  onOpen?: (node: FileNode) => void;
}

/** What a node is worth saying in one line: how much it holds, or what it is. */
function summarize(node: FileNode, S: Strings): string {
  if (node.data?.kind === "folder") {
    return S.fileKind.itemCount(node.data.children.length);
  }
  return S.fileKind.byType[node.type] ?? S.fileKind.fallback;
}

export const FileIcon = ({ fileNode, caption, onOpen }: FileIconProps) => {
  const { selected, interaction } = useFileInteraction(fileNode, { onOpen });
  const S = useStrings();
  // Stays put when the card is pointed at: a mark that vanishes the moment you
  // reach for the thing it marks is a mark you can't trust.
  const featured = leadsToFeatured(fileNode);

  return (
    <div
      {...interaction}
      // Opened like any file — one click selects, two open — and selected, its
      // frame lights the way an active window's does.
      data-active={selected}
      className={`focus-ring pixel-box os-window group relative flex aspect-square cursor-pointer select-none flex-col items-center justify-center gap-3 p-3 text-center hover:-translate-y-1 ${
        selected ? "bg-os-accent-container/60" : "bg-os-surface-1 hover:bg-os-accent-container/50"
      }`}
    >
      {featured && (
        <span className="absolute right-2 top-2">
          <FeaturedStar size={14} decorative />
        </span>
      )}

      <IconTile icon={fileNode.icon} size="xl" className="pixelated os-glow" />

      <span className="flex w-full min-w-0 flex-col items-center">
        <span
          className="font-os-pixel line-clamp-2 w-full break-words text-[15px] leading-tight text-os-text group-hover:text-os-accent"
        >
          {fileNode.name}
        </span>
        <span
          className="font-os-pixel mt-1 text-[12px] uppercase tracking-[0.12em]"
          style={{ color: "var(--os-text-faint)" }}
        >
          {caption ?? summarize(fileNode, S)}
        </span>
      </span>
    </div>
  );
};
