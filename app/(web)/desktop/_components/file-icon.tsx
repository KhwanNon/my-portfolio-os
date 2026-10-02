"use client";
// FileIcon — a file system node as it sits in a folder window: a numbered card,
// like an entry in a game's command list, with the file's art on the left, its
// name and what it holds beside it, and the arrow that says it opens. Behaviour
// lives in useFileInteraction; this file is only the skin. (A shelf of projects
// draws covers instead — see `CoverTile` — and the desktop has `DesktopIcon`.)
import type { FileNode } from "@/app/shared/types/file-system";
import type { Strings } from "@/app/shared/i18n/strings";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useFileInteraction } from "../_lib/use-file-interaction";
import { leadsToFeatured } from "../_lib/featured";
import { describe } from "../_lib/describe";
import { IconTile } from "./file-graphic";
import { FeaturedStar } from "./featured-star";
import { PixelGlyph } from "./pixel-glyph";

interface FileIconProps {
  fileNode: FileNode;
  /** Its place in the folder, counted from 1 — printed in the corner. */
  index: number;
  /** Override the default open behaviour */
  onOpen?: (node: FileNode) => void;
}

/** What a node is, in a word or two: how much it holds, or its kind. */
function summarize(node: FileNode, S: Strings): string {
  if (node.data?.kind === "folder") {
    return S.fileKind.itemCount(node.data.children.length);
  }
  return S.fileKind.byType[node.type] ?? S.fileKind.fallback;
}

export const FileIcon = ({ fileNode, index, onOpen }: FileIconProps) => {
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
      className={`focus-ring group relative flex min-h-[124px] cursor-pointer select-none gap-3 border-2 p-3 hover:-translate-y-0.5 ${
        selected
          ? "border-os-accent bg-os-accent-container/50"
          : "border-os-border-strong bg-os-surface-1 hover:border-os-accent/70"
      }`}
    >
      <IconTile icon={fileNode.icon} size="lg" className="pixelated os-glow mt-0.5" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-2 pr-6">
          {featured && <FeaturedStar size={12} decorative />}
          <span className="font-os-pixel min-w-0 truncate text-[16px] leading-tight text-os-text group-hover:text-os-accent">
            {fileNode.name}
          </span>
        </div>
        <p
          className="font-os-mono mt-1.5 line-clamp-2 text-[12px] leading-snug"
          style={{ color: "var(--os-text-dim)" }}
        >
          {describe(fileNode, S)}
        </p>
        <span
          className="font-os-pixel mt-auto pt-2 text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "var(--os-text-faint)" }}
        >
          {summarize(fileNode, S)}
        </span>
      </div>

      <span
        className="absolute right-3 top-2.5 text-[16px] leading-none tabular-nums"
        style={{ fontFamily: "var(--font-vt323)", color: "var(--os-text-faint)" }}
      >
        {String(index).padStart(2, "0")}
      </span>
      <span
        aria-hidden
        className="absolute bottom-2.5 right-3 grid h-6 w-6 place-items-center border-2 border-os-border-strong text-os-text-dim group-hover:border-os-accent group-hover:text-os-accent"
      >
        <PixelGlyph sprite="external" scale={2} />
      </span>
    </div>
  );
};
