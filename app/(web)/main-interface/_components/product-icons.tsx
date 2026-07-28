// Product-icon artwork — one outline set, drawn on a single 24px grid.
//
// One language, three moves: every shape is *drawn*, never filled — a constant
// 1.8 stroke in the icon's own hue, so a 16px title-bar mark and a 34px desktop
// tile read as the same object. Depth comes from a second plane of the same
// stroke dropped to 55%, never from a second colour. The only solids allowed are
// the marks too small to outline — a status dot, a slider knob — and a knob is
// filled in the surface colour so the track appears to pass behind it.
//
// System Command is the deliberate exception: it is the one icon that sits on a
// filled chip, so its artwork is the surface colour cutting through the ink.
import type { ReactNode } from "react";

export type ProductGlyph = (props: { size: number }) => ReactNode;

/**
 * The colour of whatever the artwork sits on — the page by default, or the chip
 * when `IconTile` overrides `--icon-cut`. Used where a shape has to mask what is
 * behind it (a slider knob on its track) rather than draw something new.
 */
const CUT = "var(--icon-cut, var(--os-surface-1))";

/** A second plane of the same stroke — a folder's back, a page's turned corner. */
const PLANE = 0.55;

/** The set's one stroke weight. Every glyph inherits it; nothing overrides it. */
const STROKE = 1.8;

function Art({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Disk stack: one unit racked above another, the live one carrying its light. */
export const DriveGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <rect x="3" y="4.4" width="18" height="6.6" rx="2.2" opacity={PLANE} />
    <rect x="3" y="13" width="18" height="6.6" rx="2.2" />
    <path d="M6.6 16.3h4" />
    <circle cx="17.2" cy="16.3" r="1.05" fill="currentColor" stroke="none" />
  </Art>
);

/** Prompt: chevron and cursor rule. Sits on a filled chip, so it is the cut. */
export const TerminalGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <path d="M5.6 8.4 9.2 12l-3.6 3.6" strokeWidth="2.2" />
    <path d="M12.6 16.1h5.9" strokeWidth="2.2" />
  </Art>
);

/** Three tracks, three knobs — each knob masking the track it rides. */
export const SlidersGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <path d="M3.4 6.5h17.2M3.4 12h17.2M3.4 17.5h17.2" />
    <circle cx="15.4" cy="6.5" r="2.5" fill={CUT} />
    <circle cx="8.4" cy="12" r="2.5" fill={CUT} />
    <circle cx="16.2" cy="17.5" r="2.5" fill={CUT} />
  </Art>
);

/** Envelope: the body, with the fold of the flap lying on the plane behind it. */
export const MailGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <rect x="2.8" y="5.4" width="18.4" height="13.2" rx="2.4" />
    <path d="M4.6 7.9 12 13.1l7.4-5.2" opacity={PLANE} />
  </Art>
);

/** Bin: a tapered body under its own lid, slotted down the face. */
export const TrashGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <path d="M3.8 6.4h16.4" />
    <path d="M6.5 8.6l.8 10.2A2.4 2.4 0 0 0 9.7 21h4.6a2.4 2.4 0 0 0 2.4-2.2l.8-10.2" />
    <path d="M9.5 6.2v-.8a1.4 1.4 0 0 1 1.4-1.4h2.2a1.4 1.4 0 0 1 1.4 1.4v.8" opacity={PLANE} />
    <path d="M10.4 11.8v5.4M13.6 11.8v5.4" opacity={PLANE} />
  </Art>
);

/** Folder: a front panel standing in front of its own back. */
export const FolderGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <path d="M3.2 8.3A2.4 2.4 0 0 1 5.6 5.9h3.3c.7 0 1.37.31 1.82.84l1.03 1.19h6.65a2.4 2.4 0 0 1 2.4 2.4v6.68a2.4 2.4 0 0 1-2.4 2.4H5.6a2.4 2.4 0 0 1-2.4-2.4Z" />
    <path d="M3.2 10.7h17.6" opacity={PLANE} />
  </Art>
);

/** Page silhouette with a turned corner — the base every document shares. */
function Page({ children }: { children?: ReactNode }) {
  return (
    <>
      <path d="M7.2 2.8h6l5.4 5.4v11a2.4 2.4 0 0 1-2.4 2.4H7.2a2.4 2.4 0 0 1-2.4-2.4V5.2a2.4 2.4 0 0 1 2.4-2.4Z" />
      <path d="M13.2 2.8v5.4h5.4" opacity={PLANE} />
      {children}
    </>
  );
}

/** Text document: the page, written on. */
export const DocumentGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <Page>
      <path d="M8 12.8h7.4M8 16.4h4.8" opacity={PLANE} />
    </Page>
  </Art>
);

/** PDF: the same page, carrying a format plate — as Drive draws it. */
export const PdfGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <Page>
      <rect x="7.2" y="12.9" width="9" height="5.6" rx="1.6" />
      <path d="M9.4 15.7h4.6" strokeWidth="1.2" opacity={PLANE} />
    </Page>
  </Art>
);

/** Deck: a frame with the slide seated inside it. */
export const SlideGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <rect x="3" y="4.6" width="18" height="14.8" rx="2.8" />
    <rect x="6.6" y="8.2" width="10.8" height="7.6" rx="1.6" opacity={PLANE} />
  </Art>
);

/** Stack: a top plate over the planes beneath it. */
export const LayersGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <path d="M12 2.9 20.8 7.2 12 11.5 3.2 7.2Z" />
    <path d="M3.2 11.6 12 15.9l8.8-4.3M3.2 15.5 12 19.8l8.8-4.3" opacity={PLANE} />
  </Art>
);

/** Outbound link: the arrow leaving its disc. */
export const LinkGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M9.4 14.6 15 9M10.6 9H15v4.4" />
  </Art>
);

/** Info: the mark, set in its disc. */
export const InfoGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12 11.4v5" />
    <circle cx="12" cy="7.9" r="1.05" fill="currentColor" stroke="none" />
  </Art>
);

/** Anything the registry has no drawing for. */
export const FileGlyph: ProductGlyph = ({ size }) => (
  <Art size={size}>
    <Page />
  </Art>
);
