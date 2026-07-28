"use client";
import Image from "next/image";
import {
  DriveGlyph,
  TerminalGlyph,
  SlidersGlyph,
  MailGlyph,
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
 * How an icon is presented, and the whole of the rule behind it: a *coloured*
 * chip means "this launches". The four apps this OS ships with earn one; a
 * document gets the same footprint on a plain neutral plate, so a list stays
 * aligned without borrowing the launcher's signal. Colour everywhere is colour
 * nowhere — it was the hues, not the plates, that told the desktop apart.
 */
type Finish =
  /** App: outline artwork in its own hue, on a chip washed with that hue. */
  | "chip"
  /** App: filled chip in its own hue, artwork drawn through it in the surface colour. */
  | "filled"
  /** Document: the mark on a neutral plate that carries no meaning of its own. */
  | "plain";

interface IconSpec {
  glyph: ProductGlyph;
  tone: string;
  finish: Finish;
  /**
   * Shipped app artwork, drawn instead of the glyph on surfaces that ask for it
   * (`IconTile artwork`). Anywhere a thing is presented as something to open —
   * the desktop, the dock, a folder's cards and rows — it wears its artwork, so
   * one app is the same picture wherever it turns up. Below tile size the art
   * turns to mush, so inline marks (search rows, chips) keep the drawn glyph,
   * which is what line art is for.
   */
  image?: string;
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
  sysCmd:  { glyph: TerminalGlyph, tone: "var(--os-icon-ink)",    finish: "filled", image: "/assets/icon/command.png" },
  cdrive:  { glyph: DriveGlyph,    tone: "var(--os-icon-blue)",   finish: "chip",   image: "/assets/icon/c.png"       },
  prefs:   { glyph: SlidersGlyph,  tone: "var(--os-icon-purple)", finish: "chip",   image: "/assets/icon/setting.png" },
  recycle: { glyph: TrashGlyph,    tone: "var(--os-icon-yellow)", finish: "chip",   image: "/assets/icon/bin.png"     },
  contact: { glyph: MailGlyph,     tone: "var(--os-icon-green)",  finish: "chip",   image: "/assets/icon/contact.png" },

  // Documents. Red on the PDF is the one hue a file keeps — it is the format's
  // own signal, the way every file manager already draws it. The two formats
  // that ship artwork use it on the launcher surfaces and fall back to these
  // glyph-and-plate rows everywhere the artwork would be too small to read.
  pdf:     { glyph: PdfGlyph,      tone: "var(--os-icon-red)",    finish: "plain",  image: "/assets/icon/pdf.png" },
  folder:  { glyph: FolderGlyph,   tone: NEUTRAL,                 finish: "plain"  },
  txt:     { glyph: DocumentGlyph, tone: NEUTRAL,                 finish: "plain",  image: "/assets/icon/txt.png" },
  slide:   { glyph: SlideGlyph,    tone: NEUTRAL,                 finish: "plain"  },
  ui:      { glyph: LayersGlyph,   tone: NEUTRAL,                 finish: "plain"  },
  link:    { glyph: LinkGlyph,     tone: NEUTRAL,                 finish: "plain"  },
  about:   { glyph: InfoGlyph,     tone: NEUTRAL,                 finish: "plain"  },
  file:    { glyph: FileGlyph,     tone: NEUTRAL,                 finish: "plain"  },
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
  return `linear-gradient(150deg, ${wash(tone, 9)}, ${wash(tone, 4)})`;
}

interface FileGraphicProps {
  icon?: string;
  size?: number;
  className?: string;
  /** Defaults to the icon's own tone; pass a colour to override it. */
  color?: string;
  /** Draw the shipped artwork where an icon has it, in place of the glyph. */
  artwork?: boolean;
}

export function FileGraphic({
  icon,
  size = 24,
  className,
  color,
  artwork,
}: FileGraphicProps) {
  const { glyph: Glyph, tone, image } = specOf(icon);

  // Artwork brings its own ground even here, where the glyph would be drawn
  // bare — so it is clipped to the same ~28%-of-the-box squircle the chips use.
  // Left square, art drawn edge to edge reads as a hard tile in a column of
  // line art.
  if (artwork && image) {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden ${className ?? ""}`}
        style={{ borderRadius: Math.round(size * 0.28) }}
      >
        <Image src={image} alt="" width={size} height={size} />
      </span>
    );
  }

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
 * The three chip sizes the shell uses: a reading row, a dock slot or folder
 * card, a desktop launcher. Radius is the step on the shape scale nearest ~28%
 * of the box — a squircle, the app-icon silhouette; any rounder and a tile
 * turns into a bubble, which is why the smallest chip rounds down rather than
 * up. Artwork takes ~55% of its chip at every size.
 */
const TILE = {
  sm: { box: "h-7 w-7 rounded-xs",   glyph: 15, px: 28 },
  md: { box: "h-9 w-9 rounded-sm",   glyph: 20, px: 36 },
  lg: { box: "h-14 w-14 rounded-md", glyph: 31, px: 56 },
} as const;

/** The neutral plate a document sits on — a container, not a signal. */
const PLATE = "var(--os-surface-3)";

interface IconTileProps {
  icon?: string;
  size?: keyof typeof TILE;
  className?: string;
  /**
   * Draw the shipped artwork where an icon has it. The art is the whole icon —
   * it brings its own ground — so it replaces the chip rather than sitting on
   * one; anything without artwork falls back to its drawn chip unchanged.
   */
  artwork?: boolean;
}

/**
 * The chipped form: every surface that lists things side by side — desktop
 * tile, folder card, reading row, dock slot — shows the same box, so one icon
 * is recognisable everywhere it appears and every row lines up.
 */
export function IconTile({
  icon,
  size = "md",
  className,
  artwork,
}: IconTileProps) {
  const { box, glyph, px } = TILE[size];
  const { tone, finish, image } = specOf(icon);
  const filled = finish === "filled";
  const plate = finish === "plain" ? PLATE : null;

  // Shipped artwork carries its own ground, so there is no chip to paint under
  // it — only the box, clipped to the same squircle so art drawn edge to edge
  // takes the silhouette every other tile already has.
  if (artwork && image) {
    return (
      <span
        className={`relative block shrink-0 overflow-hidden ${box} ${className ?? ""}`}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes={`${px}px`}
          className="object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={`grid shrink-0 place-items-center ${box} ${className ?? ""}`}
      style={
        {
          background: plate ?? (filled ? tone : iconSurface(icon)),
          // A washed or neutral chip has no mass to cast with; only the solid
          // one lifts.
          boxShadow: filled
            ? `0 6px 14px -8px color-mix(in srgb, ${tone} 70%, transparent)`
            : "none",
          // Whatever masks inside the artwork has to be painted in the chip it
          // sits on, or it reads as a stray mark instead of a hole: the hue
          // itself on a filled chip, the wash beneath the glyph on a washed one.
          "--icon-cut": plate ?? (filled ? tone : wash(tone, 6)),
        } as React.CSSProperties
      }
    >
      <FileGraphic
        icon={icon}
        size={glyph}
        color={filled ? "var(--os-surface-1)" : undefined}
      />
    </span>
  );
}
