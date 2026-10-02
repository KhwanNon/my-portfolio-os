"use client";
// The pieces the "character sheet" windows share — Profile and Contact both lay
// a person out the same way: a framed portrait, a globe in the corner, and the
// one line that sums it all up boxed with the cat.
import Image from "next/image";
import { PixelGlyph } from "../../pixel-glyph";

/** The frame around anything boxed on a sheet: a hairline in the accent. */
export const SHEET_BOX = "border-2 border-os-border-strong";

/** The portrait in a frame with its corners bracketed, like a scanner's target. */
export function Portrait({ src }: { src: string }) {
  const corner = "absolute h-4 w-4 border-os-accent";
  return (
    <div className={`${SHEET_BOX} relative p-1.5`}>
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 320px, 90vw"
          className="pixelated object-cover"
          priority
        />
      </div>
      <span aria-hidden className={`${corner} -left-0.5 -top-0.5 border-l-4 border-t-4`} />
      <span aria-hidden className={`${corner} -right-0.5 -top-0.5 border-r-4 border-t-4`} />
      <span aria-hidden className={`${corner} -bottom-0.5 -left-0.5 border-b-4 border-l-4`} />
      <span aria-hidden className={`${corner} -bottom-0.5 -right-0.5 border-b-4 border-r-4`} />
    </div>
  );
}

/**
 * A wireframe globe, and the build under it if there is one — a corner
 * ornament. `bracketed` sets it in a scanner's corner marks.
 */
export function Globe({
  version,
  bracketed = false,
}: {
  version?: string;
  bracketed?: boolean;
}) {
  const corner = "absolute h-3 w-3 border-os-accent/70";
  return (
    <div aria-hidden className="hidden shrink-0 flex-col items-end @lg:flex">
      <div className={bracketed ? "relative p-3" : undefined}>
        {bracketed && (
          <>
            <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
            <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
            <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
            <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
          </>
        )}
      <svg
        width="92"
        height="92"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-os-accent/60"
      >
        <circle cx="50" cy="50" r="46" />
        <ellipse cx="50" cy="50" rx="18" ry="46" />
        <ellipse cx="50" cy="50" rx="34" ry="46" />
        <line x1="50" y1="4" x2="50" y2="96" />
        <line x1="4" y1="50" x2="96" y2="50" />
        <path d="M10 30 Q50 22 90 30" />
        <path d="M10 70 Q50 78 90 70" />
      </svg>
      </div>
      {version && (
        <span
          className="font-os-mono mt-1 text-[11px]"
          style={{ color: "var(--os-text-faint)" }}
        >
          {version}
        </span>
      )}
    </div>
  );
}

/** The line that sums it up, boxed, with the cat sitting beside it. */
export function QuoteBox({
  quote,
  className = "",
}: {
  quote: string;
  className?: string;
}) {
  return (
    <figure
      className={`${SHEET_BOX} flex items-center justify-between gap-4 px-5 py-4 ${className}`}
    >
      <blockquote className="font-os-mono text-[14px] leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <span aria-hidden className="shrink-0 text-os-accent">
        <PixelGlyph sprite="cat" scale={4} />
      </span>
    </figure>
  );
}
