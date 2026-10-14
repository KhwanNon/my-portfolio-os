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
 * The original brand portrait, framed to match the desktop.
 */
export function BrandLogo({
  size = 64,
  priority = false,
  alt = "Portfolio OS",
}: BrandLogoProps) {
  return (
    <span
      className="inline-flex shrink-0 overflow-hidden border-2 border-os-border-strong bg-os-surface-1"
    >
      <Image
        src="/assets/logo-valley.webp"
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className="pixelated"
      />
    </span>
  );
}
