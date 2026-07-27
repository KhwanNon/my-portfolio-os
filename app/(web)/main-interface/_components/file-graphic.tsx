"use client";
import {
  DriveGlyph,
  TerminalGlyph,
  SlidersGlyph,
  TrashGlyph,
  FolderGlyph,
  DocumentGlyph,
  PdfGlyph,
  SlideGlyph,
  LayersGlyph,
  LinkGlyph,
  InfoGlyph,
  FileGlyph,
  type ProductGlyph,
} from "./product-icons";

/**
 * How an icon is presented, and the whole of the rule behind it: a coloured
 * chip means "this launches". The four apps this OS ships with earn one; a
 * document does not, so it stays a plain neutral mark with nothing behind it.
 * Colour everywhere is colour nowhere — it was the chips, not the hues, that
 * told the desktop apart.
 */
type Finish =
  /** App: outline artwork in its own hue, on a chip washed with that hue. */
  | "chip"
  /** App: filled chip in its own hue, artwork drawn through it in the surface colour. */
  | "filled"
  /** Document: the mark alone, no chip. */
  | "plain";

interface IconSpec {
  glyph: ProductGlyph;
  tone: string;
  finish: Finish;
}

const NEUTRAL = "var(--os-icon-neutral)";

/**
 * Everything about an icon, one row each. File system data references icons by
 * key (e.g. "folder", "cdrive"), so the whole set re-themes from this table.
 */
const REGISTRY: Record<string, IconSpec> = {
  // Apps. System Command is the one solid chip in the set — a terminal is a
  // surface you type into, and drawing it as ink makes it the anchor the other
  // three are read against; they keep the same footprint on a washed chip.
  sysCmd:  { glyph: TerminalGlyph, tone: "var(--os-icon-ink)",  finish: "filled" },
  cdrive:  { glyph: DriveGlyph,    tone: "var(--os-icon-blue)", finish: "chip"   },
  prefs:   { glyph: SlidersGlyph,  tone: "var(--os-icon-cyan)", finish: "chip"   },
  recycle: { glyph: TrashGlyph,    tone: "var(--os-icon-red)",  finish: "chip"   },

  // Documents. Red on the PDF is the one hue a file keeps — it is the format's
  // own signal, the way every file manager already draws it.
  pdf:     { glyph: PdfGlyph,      tone: "var(--os-icon-red)",  finish: "plain"  },
  folder:  { glyph: FolderGlyph,   tone: NEUTRAL,               finish: "plain"  },
  txt:     { glyph: DocumentGlyph, tone: NEUTRAL,               finish: "plain"  },
  slide:   { glyph: SlideGlyph,    tone: NEUTRAL,               finish: "plain"  },
  ui:      { glyph: LayersGlyph,   tone: NEUTRAL,               finish: "plain"  },
  link:    { glyph: LinkGlyph,     tone: NEUTRAL,               finish: "plain"  },
  about:   { glyph: InfoGlyph,     tone: NEUTRAL,               finish: "plain"  },
  file:    { glyph: FileGlyph,     tone: NEUTRAL,               finish: "plain"  },
};

export type IconKey = keyof typeof REGISTRY | string;

const FALLBACK: IconSpec = REGISTRY.file;

function specOf(icon?: string): IconSpec {
  return (icon ? REGISTRY[icon] : undefined) ?? FALLBACK;
}

export function iconTone(icon?: string): string {
  return specOf(icon).tone;
}

/** The hue thinned into the surface — the wash a chip is built out of. */
const wash = (tone: string, percent: number) =>
  `color-mix(in srgb, ${tone} ${percent}%, var(--os-surface-1))`;

/**
 * The chip an app sits on: its own hue, thinned to a wash and raked slightly
 * so the tile catches light down its face instead of reading as a flat swatch.
 * Kept faint on purpose — the drawing is what carries the colour, and a chip
 * strong enough to be a swatch turns a row of apps into a row of paint chips.
 */
export function iconSurface(icon?: string): string {
  const tone = iconTone(icon);
  return `linear-gradient(150deg, ${wash(tone, 14)}, ${wash(tone, 7)})`;
}

interface FileGraphicProps {
  icon?: string;
  size?: number;
  className?: string;
  /** Defaults to the icon's own tone; pass a colour to override it. */
  color?: string;
}

export function FileGraphic({
  icon,
  size = 24,
  className,
  color,
}: FileGraphicProps) {
  const { glyph: Glyph, tone } = specOf(icon);
  return (
    <span
      className={`inline-flex ${className ?? ""}`}
      style={{ color: color ?? tone }}
    >
      <Glyph size={size} />
    </span>
  );
}

/**
 * The three chip sizes the shell uses. Radius comes off the shape scale at
 * roughly 28% of the box — a squircle, the app-icon silhouette; any rounder and
 * a tile turns into a bubble. An app's artwork takes ~55% of its chip; a
 * document, having no chip to sit in, is drawn larger to hold the same weight.
 */
const TILE = {
  sm: { box: "h-8 w-8 rounded-sm",   app: 18, plain: 20 },
  md: { box: "h-11 w-11 rounded-md", app: 24, plain: 27 },
  lg: { box: "h-16 w-16 rounded-lg", app: 34, plain: 38 },
} as const;

interface IconTileProps {
  icon?: string;
  size?: keyof typeof TILE;
  className?: string;
}

/**
 * The app-icon form: every surface that launches something — desktop tile,
 * folder card, rail row, dock slot — shows the same chip, so one icon is
 * recognisable everywhere it appears. Documents keep the footprint, so rows
 * stay aligned, but drop the chip.
 */
export function IconTile({ icon, size = "md", className }: IconTileProps) {
  const { box, app, plain } = TILE[size];
  const { tone, finish } = specOf(icon);

  if (finish === "plain") {
    return (
      <span className={`grid shrink-0 place-items-center ${box} ${className ?? ""}`}>
        <FileGraphic icon={icon} size={plain} />
      </span>
    );
  }

  const filled = finish === "filled";
  return (
    <span
      className={`grid shrink-0 place-items-center ${box} ${className ?? ""}`}
      style={
        {
          background: filled ? tone : iconSurface(icon),
          // A washed chip has no mass to cast with; only the solid one lifts.
          boxShadow: filled
            ? `0 6px 14px -8px color-mix(in srgb, ${tone} 70%, transparent)`
            : "none",
          // Whatever masks inside the artwork has to be painted in the chip it
          // sits on, or it reads as a stray mark instead of a hole: the hue
          // itself on a filled chip, the wash beneath the glyph on a washed one.
          "--icon-cut": filled ? tone : wash(tone, 10),
        } as React.CSSProperties
      }
    >
      <FileGraphic
        icon={icon}
        size={app}
        color={filled ? "var(--os-surface-1)" : undefined}
      />
    </span>
  );
}
