"use client";
// FileIcon — the one interactive representation of a file system node.
// Behaviour lives in useFileInteraction; this file is only the skins, one per
// surface: the desktop's launcher tile and reading list, the file manager's
// grid card and its dense row.
import { MoreVertical } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useFileInteraction } from "../_lib/use-file-interaction";
import { leadsToFeatured } from "../_lib/featured";
import { IconTile } from "./file-graphic";
import { FeaturedStar } from "./featured-star";

/**
 * "desktop" = icon lying on the desktop, "card" = detailed tile in a folder
 * window's grid, "row" = dense line in a folder window's list.
 */
type Layout = "desktop" | "card" | "row";

interface FileIconProps {
  fileNode: FileNode;
  layout: Layout;
  /**
   * Replaces the line under the name, for surfaces that know something better
   * to say than the default. The desktop draws no such line at all.
   */
  caption?: string;
  /** Override the default open behaviour */
  onOpen?: (node: FileNode) => void;
}

const KIND_LABEL: Record<string, string> = {
  folder: "Folder",
  program: "App",
  txt: "Document",
  pdf: "PDF",
  slide: "Slides",
  link: "Link",
  ui: "View",
};

/** What a node is worth saying in one line: how much it holds, or what it is. */
function summarize(node: FileNode): string {
  if (node.data?.kind === "folder") {
    const count = node.data.children.length;
    return `${count} item${count === 1 ? "" : "s"}`;
  }
  return KIND_LABEL[node.type] ?? "File";
}

export const FileIcon = ({
  fileNode,
  layout,
  caption,
  onOpen,
}: FileIconProps) => {
  const { selected, interaction, openMenuAt } = useFileInteraction(fileNode, {
    onOpen,
  });
  // Stays put when the row is selected: a mark that vanishes the moment you
  // click the thing it marks is a mark you can't trust.
  const featured = leadsToFeatured(fileNode);

  // A desktop icon: artwork, name under it, and nothing else — no card, no
  // caption, no metadata. The cell fills its grid track rather than carrying
  // its own width, so a column of icons lines up on one axis the way a desktop
  // arranges itself. Selection and hover are the only chrome it ever draws.
  if (layout === "desktop") {
    return (
      <div
        {...interaction}
        title={fileNode.name}
        // The desktop is white, so the hover has to *tint* rather than lift —
        // surface-1 here would be the background painted onto itself.
        className={`focus-ring group flex h-fit cursor-pointer select-none flex-col items-center gap-1.5 rounded-md px-1 py-2 transition-colors duration-150 ${
          selected ? "bg-os-accent-container" : "hover:bg-os-surface-3"
        }`}
      >
        {/* Shipped artwork at its largest; anything without it falls back to
            its tinted chip. */}
        <IconTile
          icon={fileNode.icon}
          size="xl"
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />
        <span
          className="line-clamp-2 text-center text-[12px] font-medium leading-tight tracking-tight"
          style={{ color: "var(--os-text)" }}
        >
          {fileNode.name}
        </span>
      </div>
    );
  }

  if (layout === "row") {
    return (
      <div
        {...interaction}
        className={`focus-ring group flex cursor-pointer select-none items-center gap-3 rounded-md border border-transparent px-3 py-2 transition-colors duration-150 ${
          selected ? "bg-os-accent-container" : "hover:bg-os-surface-3"
        }`}
      >
        <IconTile icon={fileNode.icon} size="sm" />
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          {featured && <FeaturedStar size={12} />}
          <span
            className="truncate text-[13px]"
            style={{ color: "var(--os-text)" }}
          >
            {fileNode.name}
          </span>
        </span>
        <span
          className="shrink-0 text-[11px]"
          style={{ color: "var(--os-text-faint)" }}
        >
          {summarize(fileNode)}
        </span>
      </div>
    );
  }

  return (
    <div
      {...interaction}
      className={`focus-ring group flex cursor-pointer select-none items-center gap-3 rounded-xl border p-3 transition-[background-color,box-shadow] duration-200 hover:shadow-(--shadow-1) ${
        selected
          ? "border-transparent bg-os-accent-container"
          : "border-os-border bg-os-surface-1 hover:bg-os-surface-3"
      }`}
    >
      <IconTile
        icon={fileNode.icon}
        className="transition-transform duration-200 group-hover:scale-105"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {featured && <FeaturedStar size={12} />}
          <p
            className="min-w-0 truncate text-[13px] font-semibold tracking-tight"
            style={{ color: "var(--os-text)" }}
          >
            {fileNode.name}
          </p>
        </div>
        <p
          className="mt-0.5 truncate text-[11px]"
          style={{ color: "var(--os-text-faint)" }}
        >
          {caption ?? summarize(fileNode)}
        </p>
      </div>

      {/* Same menu as right-click — the reachable version for touch. */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const box = e.currentTarget.getBoundingClientRect();
          openMenuAt({ x: box.right, y: box.bottom + 4 });
        }}
        title={`More actions for ${fileNode.name}`}
        aria-label={`More actions for ${fileNode.name}`}
        className="focus-ring grid h-7 w-7 shrink-0 cursor-pointer place-items-center self-start rounded-full transition-colors duration-150 hover:bg-os-surface-1"
        style={{ color: "var(--os-text-faint)" }}
      >
        <MoreVertical size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
};
