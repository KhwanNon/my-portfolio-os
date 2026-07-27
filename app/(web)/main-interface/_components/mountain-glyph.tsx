/**
 * The shell's one decorative motif — soft-crowned peaks with a few sparks, in
 * tints of the live accent. The baseline sits exactly on the viewBox floor, so
 * whatever it is anchored to, the range stands on that edge.
 */
export function MountainGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 110"
      preserveAspectRatio="xMaxYMax meet"
      fill="currentColor"
      aria-hidden
      className={className}
      style={{ color: "var(--os-accent)" }}
    >
      <Peak opacity={0.1} base={[0, 118]} apex={54} top={50} />
      <Peak opacity={0.18} base={[70, 250]} apex={158} top={16} />
      <Peak opacity={0.12} base={[212, 320]} apex={272} top={34} />
      <g opacity="0.45">
        <Spark x={24} y={30} size={11} />
        <Spark x={72} y={58} size={7} />
      </g>
    </svg>
  );
}

const FLOOR = 110;
/** How far below the summit the slopes start curving into the crown. */
const CROWN = 12;

/** One peak: straight flanks rising off the floor into a rounded summit. */
function Peak({
  base: [left, right],
  apex,
  top,
  opacity,
}: {
  base: [number, number];
  apex: number;
  top: number;
  opacity: number;
}) {
  const shoulder = CROWN * 0.72;
  return (
    <path
      opacity={opacity}
      d={
        `M${left} ${FLOOR} ` +
        `L${apex - shoulder} ${top + CROWN} ` +
        `Q${apex} ${top} ${apex + shoulder} ${top + CROWN} ` +
        `L${right} ${FLOOR} Z`
      }
    />
  );
}

/** A four-point star with concave, rounded sides. */
function Spark({ x, y, size }: { x: number; y: number; size: number }) {
  const r = size / 2;
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
