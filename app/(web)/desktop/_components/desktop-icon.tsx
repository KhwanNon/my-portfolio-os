"use client";
// One launcher on the desktop: artwork, and the file's name under it. Select
// with a click, open with a double click — or a single tap on a touch screen,
// where there is no double click to make. Selection and hover are the only
// chrome it ever draws.
import type { FileNode } from "@/app/shared/types/file-system";
import { useFileInteraction } from "../_lib/use-file-interaction";
import { IconTile } from "./file-graphic";

interface DesktopIconProps {
  node: FileNode;
  /** The name the desktop knows the file by, where it differs from the drive's. */
  label: string;
}

export function DesktopIcon({ node, label }: DesktopIconProps) {
  const { selected, interaction } = useFileInteraction(node);

  return (
    <div
      {...interaction}
      title={label}
      className="focus-ring group flex h-fit w-[90px] cursor-default select-none flex-col items-center gap-1 px-1 py-2"
    >
      {/* A hop of one block on hover, the way a sprite reacts. */}
      <IconTile
        icon={node.icon}
        size="xl"
        className="pixelated os-glow group-hover:-translate-y-1"
      />
      {/* Selected, the label inverts, as a game marks the item under its cursor. */}
      <span
        className={`font-os-pixel line-clamp-2 break-words px-1 text-center text-[13px] leading-tight ${
          selected ? "" : "group-hover:bg-black/60"
        }`}
        style={{
          color: selected ? "var(--os-on-accent)" : "var(--os-text)",
          background: selected ? "var(--os-accent)" : undefined,
          textShadow: selected ? "none" : "2px 2px 0 #000",
        }}
      >
        {label}
      </span>
    </div>
  );
}
