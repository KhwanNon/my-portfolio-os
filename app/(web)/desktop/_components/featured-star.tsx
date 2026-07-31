"use client";
import { Star } from "lucide-react";

/**
 * The whole of the mark on the project to open first, and on the folders that
 * lead to it — a star and nothing else. A frame around the row as well would
 * shout twice; the star is enough to find down a list, and it leaves the
 * listing's own borders to mean what they already mean.
 *
 * One tone, filled and stroked in the same yellow, so what you see is a solid
 * shape and not a star wearing an outline. A darker rim would buy contrast on
 * white and cost the colour its name — it reads as an orange edge, which is the
 * one thing this mark is not.
 */
export function FeaturedStar({ size = 13 }: { size?: number }) {
  return (
    <Star
      size={size}
      strokeWidth={1.5}
      fill="currentColor"
      role="img"
      aria-label="Open this first"
      className="shrink-0"
      style={{ color: "var(--os-featured)" }}
    />
  );
}
