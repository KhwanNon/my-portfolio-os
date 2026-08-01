"use client";
import { Star } from "lucide-react";
import { useStrings } from "@/app/shared/hooks/use-locale";

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
 *
 * It says what it means out loud, in the language being read — a shape carries
 * nothing to a reader who cannot see it. `decorative` is for the one place that
 * writes the same thing beside it, where a label would say it twice.
 */
export function FeaturedStar({
  size = 13,
  decorative = false,
}: {
  size?: number;
  decorative?: boolean;
}) {
  const S = useStrings();

  return (
    <Star
      size={size}
      strokeWidth={1.5}
      fill="currentColor"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : S.project.featuredMark}
      className="shrink-0"
      style={{ color: "var(--os-featured)" }}
    />
  );
}
