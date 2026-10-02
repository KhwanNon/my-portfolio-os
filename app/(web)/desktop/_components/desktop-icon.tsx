"use client";
// One launcher on the desktop: artwork, and the file's name under it. Select
// with a click, open with a double click — or a single tap on a touch screen,
// where there is no double click to make. Selection and hover are the only
// chrome it ever draws.
import type { FileNode } from "@/app/shared/types/file-system";
import { useIsSmallViewport } from "../_lib/use-viewport";
import { useFileInteraction } from "../_lib/use-file-interaction";
import { IconTile } from "./file-graphic";

interface DesktopIconProps {
  node: FileNode;
  /** The name the desktop knows the file by, where it differs from the drive's. */
  label: string;
}

export function DesktopIcon({ node, label }: DesktopIconProps) {
  const { selected, interaction } = useFileInteraction(node);
  const touch = useIsSmallViewport(768);

  return (
    <div
      {...interaction}
      title={label}
      onClick={(e) => (touch ? interaction.onDoubleClick(e) : interaction.onClick(e))}
      className={`focus-ring group flex h-fit w-[84px] cursor-default select-none flex-col items-center gap-1 border px-1 py-2 transition-colors duration-150 ${
        selected
          ? "border-os-border-strong bg-os-accent/15"
          : "border-transparent hover:bg-os-accent/10"
      }`}
    >
      <IconTile
        icon={node.icon}
        size="xl"
        className="transition-[filter] duration-200 group-hover:[filter:drop-shadow(0_0_8px_rgba(57,232,117,0.55))]"
      />
      <span
        className="font-os-mono line-clamp-2 break-all text-center text-[11px] leading-tight"
        style={{
          color: "var(--os-text)",
          textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.9)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
