"use client";
// A project in a folder of projects, drawn as its cover: the picture is the
// whole tile, because the picture already says the name. One click opens it —
// these are things to look at, not files to select.
import Image from "next/image";
import type { FileNode } from "@/app/shared/types/file-system";
import { useFileInteraction } from "../_lib/use-file-interaction";
import { leadsToFeatured } from "../_lib/featured";
import { FeaturedStar } from "./featured-star";

interface CoverTileProps {
  node: FileNode;
  src: string;
  onOpen: (node: FileNode) => void;
}

export function CoverTile({ node, src, onOpen }: CoverTileProps) {
  const { interaction } = useFileInteraction(node, { onOpen });

  return (
    <div
      {...interaction}
      onClick={() => onOpen(node)}
      aria-label={node.name.replace(/\.ui$/, "")}
      className="focus-ring group relative aspect-square cursor-pointer select-none overflow-hidden rounded-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-(--glow-window)"
      style={{ border: "1px solid var(--os-border-strong)" }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 640px) 220px, 45vw"
        className="object-cover"
      />
      {leadsToFeatured(node) && (
        <span className="absolute right-2 top-2">
          <FeaturedStar size={14} decorative />
        </span>
      )}
    </div>
  );
}
