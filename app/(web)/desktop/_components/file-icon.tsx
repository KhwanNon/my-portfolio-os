"use client";
// FileIcon — the one interactive representation of a file system node.
// Behaviour lives in useFileInteraction; this file is only the skins, one per
// surface: the file manager's grid card and its dense row. (The desktop's own
// launchers are `DesktopIcon`.)
import { MoreVertical } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import type { Strings } from "@/app/shared/i18n/strings";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useFileInteraction } from "../_lib/use-file-interaction";
import { leadsToFeatured } from "../_lib/featured";
import { IconTile } from "./file-graphic";
import { FeaturedStar } from "./featured-star";

/**
 * "card" = detailed tile in a folder window's grid, "row" = dense line in a
 * folder window's list.
 */
type Layout = "card" | "row";

interface FileIconProps {
  fileNode: FileNode;
  layout: Layout;
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

export const FileIcon = ({
  fileNode,
  layout,
  caption,
  onOpen,
}: FileIconProps) => {
  const { selected, interaction, openMenuAt } = useFileInteraction(fileNode, {
    onOpen,
  });
  const S = useStrings();
  // Stays put when the row is selected: a mark that vanishes the moment you
  // click the thing it marks is a mark you can't trust.
  const featured = leadsToFeatured(fileNode);

  if (layout === "row") {
    return (
      <div
        {...interaction}
        className={`focus-ring group flex cursor-pointer select-none items-center gap-3 rounded-md border border-transparent px-3 py-2 transition-colors duration-150 ${
          selected ? "bg-os-accent-container" : "hover:bg-os-accent/10"
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
          {summarize(fileNode, S)}
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
          {caption ?? summarize(fileNode, S)}
        </p>
      </div>

      {/* Same menu as right-click — the reachable version for touch. */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const box = e.currentTarget.getBoundingClientRect();
          openMenuAt({ x: box.right, y: box.bottom + 4 });
        }}
        title={S.menu.moreActions(fileNode.name)}
        aria-label={S.menu.moreActions(fileNode.name)}
        className="focus-ring grid h-7 w-7 shrink-0 cursor-pointer place-items-center self-start rounded-sm transition-colors duration-150 hover:bg-os-surface-1"
        style={{ color: "var(--os-text-faint)" }}
      >
        <MoreVertical size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
};
