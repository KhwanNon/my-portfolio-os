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
   * Shipped app artwork, drawn instead of the glyph wherever this icon appears
   * — desktop, dock, folder cards and rows, search results, title bars,
   * Properties. An app is one picture everywhere it turns up; a second drawing
   * of the same app at small sizes would be a second identity for it, and the
   * one place recognition matters most is the inline row you are skimming.
   * Types without artwork keep their glyph.
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
  sysCmd:  { glyph: TerminalGlyph, tone: "var(--os-icon-ink)",    finish: "filled", image: "/assets/icon/command.webp" },
  cdrive:  { glyph: DriveGlyph,    tone: "var(--os-icon-blue)",   finish: "chip",   image: "/assets/icon/c-drive.webp"},
  prefs:   { glyph: SlidersGlyph,  tone: "var(--os-icon-purple)", finish: "chip",   image: "/assets/icon/setting.webp" },
  recycle: { glyph: TrashGlyph,    tone: "var(--os-icon-yellow)", finish: "chip",   image: "/assets/icon/bin.webp"},
  contact: { glyph: MailGlyph,     tone: "var(--os-icon-green)",  finish: "chip",   image: "/assets/icon/contact.webp" },

  // Documents. Red on the PDF is the one hue a glyph keeps — the format's own
  // signal. Folder, text and PDF ship artwork; the rest keep their glyphs.
  pdf:     { glyph: PdfGlyph,      tone: "var(--os-icon-red)",    finish: "plain", image: "/assets/icon/pdf.webp" },
  folder:  { glyph: FolderGlyph,   tone: NEUTRAL,                 finish: "plain", image: "/assets/icon/folder.webp" },
  txt:     { glyph: DocumentGlyph, tone: NEUTRAL,                 finish: "plain", image: "/assets/icon/text.webp" },
  me:      { glyph: DocumentGlyph, tone: NEUTRAL,                 finish: "plain", image: "/assets/icon/me.webp" },
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

function Artwork({
  src,
  size,
  px,
}: {
  src: string;
  /** A fixed box, for the bare graphic. Omit to let the art fill its tile. */
  size?: number;
  /** Rendered tile width, so the optimiser picks the file that size deserves. */
  px?: number;
}) {
  const shape = size
    ? { width: size, height: size }
    : { fill: true, sizes: `${px}px` };

  return <Image src={src} alt="" {...shape} className={size ? "" : "object-contain"} />;
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

  // Artwork is transparent and carries its own glow, so it is drawn bare —
  // clipping it would cut the glow off.
  if (image) {
    return (
      <span className={`inline-flex shrink-0 ${className ?? ""}`}>
        <Artwork src={image} size={size} />
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

  // Shipped artwork is transparent and carries its own glow, so there is no
  // chip under it and no clip over it — only the box it is sized by.
  if (image) {
    return (
      <span className={`relative block shrink-0 ${box} ${className ?? ""}`}>
        <Artwork src={image} px={px} />
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
