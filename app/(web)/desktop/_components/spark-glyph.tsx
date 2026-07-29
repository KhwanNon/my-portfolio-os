/**
 * The shell's signature mark: a four-point star with concave, rounded sides.
 * The brand lockup, the craft card's chip, and the sparks over the mountain
 * motif are all this one drawing, so the whole shell reads as one hand.
 */
export function SparkGlyph({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <SparkPath x={12} y={12} size={22} />
    </svg>
  );
}

/** The mark itself, centred on (x, y) — for placing several in one artwork. */
export function SparkPath({
  x,
  y,
  size,
}: {
  x: number;
  y: number;
  size: number;
}) {
  const r = size / 2;
  // How far the side curves are pulled toward the centre: what makes the star
  // concave rather than a diamond.
  const pull = r * 0.55;
  return (
    <path
      transform={`translate(${x - r} ${y - r})`}
      d={
        `M${r} 0 C${r} ${pull} ${size - pull} ${r} ${size} ${r} ` +
        `C${size - pull} ${r} ${r} ${size - pull} ${r} ${size} ` +
        `C${r} ${size - pull} ${pull} ${r} 0 ${r} ` +
        `C${pull} ${r} ${r} ${pull} ${r} 0 Z`
      }
    />
  );
}
