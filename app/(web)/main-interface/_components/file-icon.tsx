"use client";
// FileIcon — the one interactive representation of a file system node.
// Behaviour lives in useFileInteraction; this file is only the skins, one per
// surface: the desktop's launcher tile and reading list, the file manager's
// grid card and its dense row.
import { MoreVertical } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useFileInteraction } from "../_lib/use-file-interaction";
import { FileGraphic, IconTile } from "./file-graphic";

/**
 * "desktop" = launcher tile on the desktop, "list" = full-width entry in the
 * desktop's reading list, "card" = detailed tile in a folder window's grid,
 * "row" = dense line in a folder window's list.
 */
type Layout = "desktop" | "list" | "card" | "row";

interface FileIconProps {
  fileNode: FileNode;
  layout: Layout;
  /**
   * Replaces the line under the name, for surfaces that know something better
   * to say than the default — "Terminal", "Start here".
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

  // Desktop: a launcher, not a listing. Big glyph, name, what it is — and
  // nothing else, so it reads nothing like a file manager entry. It carries its
  // own width rather than stretching to its column: an app icon is a portrait
  // card, and one stretched wide reads as a row. The width is the one that
  // holds the longest app name — "System Command" — on a single line; the
  // clamp below is the safety net, not the intended reading.
  if (layout === "desktop") {
    return (
      <div
        {...interaction}
        className={`focus-ring group flex w-36 cursor-pointer select-none flex-col items-center gap-4 rounded-lg border px-3 py-10 transition-[background-color,box-shadow] duration-200 hover:shadow-(--shadow-2) ${
          selected
            ? "border-transparent bg-os-accent-container"
            : "border-os-border bg-os-surface-1"
        }`}
      >
        {/* Tinted in the icon's own tone, so a row of tiles reads at a glance. */}
        <IconTile
          icon={fileNode.icon}
          size="lg"
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />
        <span className="flex flex-col items-center gap-0.5">
          <span
            className="line-clamp-2 text-center text-[13px] font-semibold leading-tight tracking-tight"
            style={{ color: "var(--os-text)" }}
          >
            {fileNode.name}
          </span>
          {caption && (
            <span
              className="text-center text-[11px]"
              style={{ color: "var(--os-text-faint)" }}
            >
              {caption}
            </span>
          )}
        </span>
      </div>
    );
  }

  // The desktop's reading list: one entry per line, hairline-separated, so the
  // eye runs down names instead of hunting across a grid. What it is sits far
  // right, the way every file listing keeps its metadata column.
  if (layout === "list") {
    return (
      <div
        {...interaction}
        className={`focus-ring group flex cursor-pointer select-none items-center gap-2.5 border-t border-os-border px-1.5 py-2.5 transition-colors duration-150 first:border-t-0 ${
          selected ? "bg-os-accent-container" : "hover:bg-os-surface-3"
        }`}
      >
        <IconTile icon={fileNode.icon} size="sm" />

        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[13px] font-semibold tracking-tight"
            style={{ color: "var(--os-text)" }}
          >
            {fileNode.name}
          </p>
          {caption && (
            <p
              className="mt-0.5 truncate text-[11px]"
              style={{ color: "var(--os-text-faint)" }}
            >
              {caption}
            </p>
          )}
        </div>

        <span
          className="shrink-0 text-[11px]"
          style={{ color: "var(--os-text-faint)" }}
        >
          {summarize(fileNode)}
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
        <FileGraphic icon={fileNode.icon} size={18} className="shrink-0" />
        <span
          className="flex-1 truncate text-[13px]"
          style={{ color: "var(--os-text)" }}
        >
          {fileNode.name}
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
        <p
          className="truncate text-[13px] font-semibold tracking-tight"
          style={{ color: "var(--os-text)" }}
        >
          {fileNode.name}
        </p>
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
