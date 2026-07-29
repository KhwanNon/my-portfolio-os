import Image from "next/image";

interface BrandLogoProps {
  size?: number;
  /** Set for marks above the fold — the boot screen and the home hero. */
  priority?: boolean;
  /** Pass "" where a visible "Portfolio OS" already sits beside the mark. */
  alt?: string;
}

/**
 * The shipped logo — the same tile the browser tab shows, so every place the OS
 * names itself shows the thing you launched rather than a second version of it.
 *
 * Clipped rather than drawn square: the artwork's corners are page-white, and
 * the ~28% squircle every icon tile in this shell takes cuts them off, which is
 * what keeps the tile a tile on the dark theme instead of a white card.
 */
export function BrandLogo({
  size = 64,
  priority = false,
  alt = "Portfolio OS",
}: BrandLogoProps) {
  return (
    <span
      className="inline-flex shrink-0 overflow-hidden"
      style={{ borderRadius: Math.round(size * 0.28) }}
    >
      <Image
        src="/assets/logo.png"
        alt={alt}
        width={size}
        height={size}
        priority={priority}
      />
    </span>
  );
}
