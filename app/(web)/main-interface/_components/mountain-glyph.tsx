import { SparkPath } from "./spark-glyph";

/**
 * The shell's one decorative motif — soft-crowned peaks with a few sparks, in
 * tints of the live accent. The baseline sits exactly on the viewBox floor, so
 * whatever it is anchored to, the range stands on that edge.
 */
export function MountainGlyph({ className }: { className?: string }) {
  return (
    <svg
      // A wide, shallow range: the motif is a band across the top of a card,
      // so the viewBox is proportioned like that band rather than like a
      // portrait scene — otherwise fitting its width makes it tower.
      viewBox="0 0 420 110"
      preserveAspectRatio="xMaxYMax meet"
      fill="currentColor"
      aria-hidden
      className={className}
      style={{ color: "var(--os-accent)" }}
    >
      <Peak opacity={0.07} base={[0, 155]} apex={71} top={50} />
      <Peak opacity={0.13} base={[92, 328]} apex={207} top={16} />
      <Peak opacity={0.09} base={[278, 420]} apex={357} top={34} />
      <g opacity="0.3">
        <SparkPath x={32} y={30} size={11} />
        <SparkPath x={94} y={58} size={7} />
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
