"use client";
// ProfileUI — the person behind the machine, laid out like a game's character
// sheet: the portrait and the stat block on the left, the story on the right,
// and the one line that sums it up boxed at the foot.
import Image from "next/image";
import { PixelGlyph, type PixelSprite } from "../../pixel-glyph";

export interface ProfileInfoRow {
  /** Which sprite marks the row. */
  icon: PixelSprite;
  label: string;
  /** One line each. */
  lines: string[];
}

interface ProfileUIProps {
  photo?: string;
  heading?: string;
  /** The file name under the heading, as a terminal would echo it. */
  file?: string;
  version?: string;
  paragraphs?: string[];
  infoTitle?: string;
  info?: ProfileInfoRow[];
  quote?: string;
}

/** The frame around anything boxed on this sheet: a hairline in the accent. */
const BOX = "border-2 border-os-border-strong";

export function ProfileUI({
  photo,
  heading = "",
  file = "",
  version,
  paragraphs = [],
  infoTitle = "",
  info = [],
  quote,
}: ProfileUIProps) {
  return (
    <div
      className="custom-scrollbar @container h-full w-full overflow-y-auto"
      style={{ background: "#020a05", color: "var(--os-text)" }}
    >
      <div className="grid gap-6 p-5 @2xl:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] @2xl:p-6">
        {/* ── Left: portrait, then the stat block ───────────────────────── */}
        <div className="flex flex-col gap-5">
          {photo && <Portrait src={photo} />}

          <section className={BOX}>
            <header
              className="font-os-pixel flex items-center justify-between px-4 py-2 text-[15px] tracking-[0.12em]"
              style={{ borderBottom: "2px solid var(--os-border-strong)" }}
            >
              <span>{`// ${infoTitle}`}</span>
              <span aria-hidden className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 bg-current" />
                ))}
              </span>
            </header>
            <dl className="px-4">
              {info.map((row, i) => (
                <div
                  key={row.label}
                  className="flex gap-4 py-3"
                  style={
                    i > 0
                      ? { borderTop: "1px solid var(--os-border)" }
                      : undefined
                  }
                >
                  <span className="mt-0.5 w-6 shrink-0 text-os-accent">
                    <PixelGlyph sprite={row.icon} scale={3} />
                  </span>
                  <div className="min-w-0">
                    <dt
                      className="font-os-pixel text-[13px]"
                      style={{ color: "var(--os-text-faint)" }}
                    >
                      {row.label}
                    </dt>
                    {row.lines.map((line) => (
                      <dd
                        key={line}
                        className="font-os-mono text-[13px] leading-relaxed"
                      >
                        {line}
                      </dd>
                    ))}
                  </div>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* ── Right: the heading, the story, the line that sums it up ───── */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <h1
                className="font-os-pixel flex items-center gap-3 text-[clamp(24px,4.2cqw,40px)] font-bold leading-none tracking-wide text-os-accent"
                style={{ textShadow: "3px 3px 0 #000" }}
              >
                <span aria-hidden className="text-os-accent/80">
                  &gt;
                </span>
                {heading}
              </h1>
              <p
                className="font-os-mono mt-3 flex items-center gap-2 text-[14px]"
                style={{ color: "var(--os-text-dim)" }}
              >
                <span aria-hidden>&gt;</span>
                {file}
                <span
                  aria-hidden
                  className="h-0.5 flex-1"
                  style={{ background: "var(--os-border-strong)" }}
                />
              </p>
            </div>
            <Globe version={version} />
          </div>

          <div className="font-os-mono mt-6 space-y-4 text-[14px] leading-[1.75]">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {quote && (
            <figure
              className={`${BOX} mt-6 flex items-center justify-between gap-4 px-5 py-4`}
            >
              <blockquote className="font-os-mono text-[15px]">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <span aria-hidden className="shrink-0 text-os-accent">
                <PixelGlyph sprite="cat" scale={4} />
              </span>
            </figure>
          )}
        </div>
      </div>
    </div>
  );
}

/** The portrait in a frame with its corners bracketed, like a scanner's target. */
function Portrait({ src }: { src: string }) {
  const corner = "absolute h-4 w-4 border-os-accent";
  return (
    <div className={`${BOX} relative p-1.5`}>
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 320px, 90vw"
          className="pixelated object-cover"
          priority
        />
      </div>
      <span aria-hidden className={`${corner} -left-0.5 -top-0.5 border-l-4 border-t-4`} />
      <span aria-hidden className={`${corner} -right-0.5 -top-0.5 border-r-4 border-t-4`} />
      <span aria-hidden className={`${corner} -bottom-0.5 -left-0.5 border-b-4 border-l-4`} />
      <span aria-hidden className={`${corner} -bottom-0.5 -right-0.5 border-b-4 border-r-4`} />
    </div>
  );
}

/** A wireframe globe and the build under it — the sheet's corner ornament. */
function Globe({ version }: { version?: string }) {
  return (
    <div aria-hidden className="hidden shrink-0 flex-col items-end @lg:flex">
      <svg
        width="92"
        height="92"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-os-accent/60"
      >
        <circle cx="50" cy="50" r="46" />
        <ellipse cx="50" cy="50" rx="18" ry="46" />
        <ellipse cx="50" cy="50" rx="34" ry="46" />
        <line x1="50" y1="4" x2="50" y2="96" />
        <line x1="4" y1="50" x2="96" y2="50" />
        <path d="M10 30 Q50 22 90 30" />
        <path d="M10 70 Q50 78 90 70" />
      </svg>
      {version && (
        <span
          className="font-os-mono mt-1 text-[11px]"
          style={{ color: "var(--os-text-faint)" }}
        >
          {version}
        </span>
      )}
    </div>
  );
}
