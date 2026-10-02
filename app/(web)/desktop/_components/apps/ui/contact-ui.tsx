"use client";
// ContactUI — a sheet whose whole point is to be left: a heading that says so,
// the person on the left, and on the right one row per way to reach them.
//
// Every row is a link, because a window called Contact exists so that a visitor
// can leave it. An address a reader has to copy by eye is the failure case.
import { PixelGlyph, type PixelSprite } from "../../pixel-glyph";
import { Globe, Portrait, QuoteBox, SHEET_BOX } from "./sheet";

export interface ContactLink {
  /** Which sprite marks the row. */
  icon: PixelSprite;
  label: string;
  value: string;
  href: string;
}

interface ContactUIProps {
  photo?: string;
  /** The file name echoed over the heading, the way a terminal would. */
  file?: string;
  heading?: string;
  subheading?: string;
  /** The words stacked in the corner, beside the globe. */
  motto?: string[];
  intro?: string;
  quote?: string;
  links?: ContactLink[];
}

export function ContactUI({
  photo,
  file = "",
  heading = "",
  subheading = "",
  motto = [],
  intro,
  quote,
  links = [],
}: ContactUIProps) {
  return (
    <div
      className="custom-scrollbar @container h-full w-full overflow-y-auto"
      style={{ background: "#020a05", color: "var(--os-text)" }}
    >
      <div className="flex flex-col gap-5 p-5 @2xl:p-6">
        {/* ── Heading ─────────────────────────────────────────────────────── */}
        <header className={`${SHEET_BOX} flex items-center gap-6 px-5 py-4`}>
          <div className="min-w-0 flex-1">
            <p
              className="font-os-mono flex items-center gap-2 text-[12px]"
              style={{ color: "var(--os-text-dim)" }}
            >
              <span aria-hidden className="text-os-accent">
                &gt;&gt;
              </span>
              {file}
            </p>
            <h1
              className="font-os-pixel mt-2 text-[clamp(28px,6cqw,56px)] font-bold leading-none tracking-wide text-os-accent"
              style={{ textShadow: "3px 3px 0 #000" }}
            >
              {heading}
              <span aria-hidden className="boot-cursor">
                _
              </span>
            </h1>
            <p
              className="font-os-mono mt-3 text-[13px] uppercase tracking-[0.12em]"
              style={{ color: "var(--os-text-dim)" }}
            >
              {subheading}
            </p>
          </div>

          {motto.length > 0 && (
            <ul
              aria-hidden
              className="font-os-mono hidden shrink-0 text-[13px] uppercase leading-relaxed tracking-[0.12em] @3xl:block"
              style={{ color: "var(--os-text-faint)" }}
            >
              {motto.map((word) => (
                <li key={word}>{word}</li>
              ))}
            </ul>
          )}
          <Globe />
        </header>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 @2xl:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]">
          {/* ── Left: who you are writing to ─────────────────────────────── */}
          <div className={`${SHEET_BOX} flex flex-col gap-5 p-4`}>
            {photo && <Portrait src={photo} />}
            {intro && (
              <p
                className="font-os-mono pl-3 text-[13px] leading-relaxed"
                style={{ borderLeft: "2px solid var(--os-border-strong)" }}
              >
                {intro}
              </p>
            )}
            {quote && <QuoteBox quote={quote} className="mt-auto" />}
          </div>

          {/* ── Right: one row per way to reach them ─────────────────────── */}
          <ul className={`${SHEET_BOX} flex flex-col gap-3 p-4`}>
            {links.map((link) => (
              <li key={link.label}>
                <ContactRow link={link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * One way in: the sprite in its own tile, then the label over the value, then
 * the arrow that says it leaves the page. The whole row is the link, and it
 * lights as one when pointed at.
 */
function ContactRow({ link }: { link: ContactLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring group flex items-stretch gap-3"
    >
      <span
        className={`${SHEET_BOX} grid w-14 shrink-0 place-items-center bg-os-surface-1 text-os-accent group-hover:border-os-accent group-hover:bg-os-accent group-hover:text-os-on-accent @2xl:w-16`}
      >
        <PixelGlyph sprite={link.icon} scale={3} />
      </span>
      <span
        className={`${SHEET_BOX} flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5 group-hover:border-os-accent`}
      >
        <span className="min-w-0 flex-1">
          <span
            className="font-os-pixel flex items-center gap-2 text-[12px] uppercase tracking-[0.14em]"
            style={{ color: "var(--os-text-faint)" }}
          >
            <span aria-hidden>&gt;</span>
            {link.label}
          </span>
          <span className="font-os-mono mt-0.5 block text-[15px] [overflow-wrap:anywhere] group-hover:text-os-accent @md:truncate">
            {link.value}
          </span>
        </span>
        <span
          aria-hidden
          className="shrink-0"
          style={{ color: "var(--os-text-faint)" }}
        >
          <PixelGlyph sprite="external" scale={3} />
        </span>
      </span>
    </a>
  );
}
