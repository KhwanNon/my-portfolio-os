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

/**
 * The two inkings of one drawing: the same picture, weighted for a light ground
 * and for a dark one. A single artwork cannot serve both — line art dark enough
 * to read on Daylight goes to a smudge on the dark scheme.
 */
interface ArtPair {
  light: string;
  dark: string;
}

/** Both files of a pair, named off one stem so the table names a picture once. */
const art = (name: string): ArtPair => ({
  light: `/assets/icon/${name}.png`,
  dark: `/assets/icon/${name}-dark.png`,
});

interface IconSpec {
  glyph: ProductGlyph;
  tone: string;
  finish: Finish;
  /**
   * Shipped app artwork, drawn instead of the glyph wherever this icon appears
   * — desktop, dock, folder cards and rows, search results, title bars,
   * Properties. An app is one picture everywhere it turns up; a second drawing
   * of the same app at small sizes would be a second identity for it, and the
   * one place recognition matters most is the inline row you are skimming.
   * Documents have no artwork and keep their glyph, which is what line art is
   * for.
   */
  image?: ArtPair;
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
  sysCmd:  { glyph: TerminalGlyph, tone: "var(--os-icon-ink)",    finish: "filled", image: art("command") },
  cdrive:  { glyph: DriveGlyph,    tone: "var(--os-icon-blue)",   finish: "chip",   image: art("c")       },
  prefs:   { glyph: SlidersGlyph,  tone: "var(--os-icon-purple)", finish: "chip",   image: art("setting") },
  recycle: { glyph: TrashGlyph,    tone: "var(--os-icon-yellow)", finish: "chip",   image: art("bin")     },
  contact: { glyph: MailGlyph,     tone: "var(--os-icon-green)",  finish: "chip",   image: art("contact") },

  // Documents. No artwork here on purpose: painted art is the mark of something
  // that launches, so a file drawn that way would claim to be an app. Red on the
  // PDF is the one hue a file keeps — it is the format's own signal, the way
  // every file manager already draws it.
  pdf:     { glyph: PdfGlyph,      tone: "var(--os-icon-red)",    finish: "plain"  },
  folder:  { glyph: FolderGlyph,   tone: NEUTRAL,                 finish: "plain"  },
  txt:     { glyph: DocumentGlyph, tone: NEUTRAL,                 finish: "plain"  },
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

/**
 * Both inkings of one artwork, drawn into the same box — CSS shows the one the
 * scheme asks for and hides the other (`.icon-art-*` in globals.css). Drawing
 * the pair rather than picking in JS is what keeps the right one on screen from
 * the first paint: the theme lives in `data-theme`, which no server render can
 * know, so a chosen picture would land light and then swap. It also means the
 * artwork follows whichever scope it is drawn inside — the terminal keeps the
 * dark palette on a light desktop, and its icons come along.
 */
function Artwork({
  image,
  size,
  px,
}: {
  image: ArtPair;
  /** A fixed box, for the bare graphic. Omit to let the art fill its tile. */
  size?: number;
  /** Rendered tile width, so the optimiser picks the file that size deserves. */
  px?: number;
}) {
  const shape = size
    ? { width: size, height: size }
    : { fill: true, sizes: `${px}px` };
  const fit = size ? "" : " object-contain";

  return (
    <>
      <Image src={image.light} alt="" {...shape} className={`icon-art-light${fit}`} />
      <Image src={image.dark}  alt="" {...shape} className={`icon-art-dark${fit}`}  />
    </>
  );
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
  const { glyph: Glyph, tone, image } = specOf(icon);

  // Artwork brings its own ground even here, where the glyph would be drawn
  // bare — so it is clipped to the same ~28%-of-the-box squircle the chips use.
  // Left square, art drawn edge to edge reads as a hard tile in a column of
  // line art.
  if (image) {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden ${className ?? ""}`}
        style={{ borderRadius: Math.round(size * 0.28) }}
      >
        <Artwork image={image} size={size} />
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
 * The four chip sizes the shell uses: a reading row, a folder card, a dock
 * slot, a desktop launcher. The dock stands a step above the card it used to
 * share — the dock is the one row read at a glance from across the screen, and
 * a card is read with the eye already on it. Radius is the step on the shape
 * scale nearest ~28% of the box — a squircle, the app-icon silhouette; any
 * rounder and a tile turns into a bubble, which is why the smallest chip rounds
 * down rather than up. Artwork takes ~55% of its chip at every size.
 */
const TILE = {
  sm: { box: "h-7 w-7 rounded-xs",   glyph: 15, px: 28 },
  md: { box: "h-9 w-9 rounded-sm",   glyph: 20, px: 36 },
  lg: { box: "h-11 w-11 rounded-md", glyph: 24, px: 44 },
  xl: { box: "h-14 w-14 rounded-md", glyph: 31, px: 56 },
} as const;

/** The neutral plate a document sits on — a container, not a signal. */
const PLATE = "var(--os-surface-3)";

interface IconTileProps {
  icon?: string;
  size?: keyof typeof TILE;
  className?: string;
}

/**
 * The chipped form: every surface that lists things side by side — desktop
 * tile, folder card, reading row, dock slot — shows the same box, so one icon
 * is recognisable everywhere it appears and every row lines up.
 */
export function IconTile({ icon, size = "md", className }: IconTileProps) {
  const { box, glyph, px } = TILE[size];
  const { tone, finish, image } = specOf(icon);
  const filled = finish === "filled";
  const plate = finish === "plain" ? PLATE : null;

  // Shipped artwork carries its own ground, so there is no chip to paint under
  // it — only the box, clipped to the same squircle so art drawn edge to edge
  // takes the silhouette every other tile already has.
  if (image) {
    return (
      <span
        className={`relative block shrink-0 overflow-hidden ${box} ${className ?? ""}`}
      >
        <Artwork image={image} px={px} />
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
