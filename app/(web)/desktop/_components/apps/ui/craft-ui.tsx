"use client";
// CraftUI — the working standard, laid out as a character sheet beside Profile:
// the portrait and the five principles on the left; the document itself on the
// right, its sections drawn as a page rather than as a wall of text.
//
// The text stays one plain document in `_data/craft.ts`, written once per
// language. This file only reads its marks — `#` for a heading, `-` for a
// point, `1.` for a step, `[ ]` for a check — so editing the standard never
// means touching the layout.
import { PixelGlyph } from "../../pixel-glyph";
import { Globe, Portrait, QuoteBox, SHEET_BOX } from "./sheet";

interface CraftUIProps {
  photo?: string;
  heading?: string;
  file?: string;
  version?: string;
  /** The standard in five lines, for the box under the portrait. */
  principles?: string[];
  quote?: string;
  /** The document, in the plain marked-up text it is authored in. */
  content?: string;
}

type Block =
  | { kind: "heading"; text: string }
  | { kind: "para"; text: string }
  | { kind: "point"; text: string }
  | { kind: "step"; n: string; text: string }
  | { kind: "check"; text: string }
  | { kind: "rule" };

/**
 * The document's marks, read into blocks. A line that starts a mark opens a
 * block; an indented line under it carries the same block on; a blank line
 * closes it. The file's own banner (`>` lines) is dropped — the window has a
 * header of its own.
 */
function parse(content: string): Block[] {
  const blocks: Block[] = [];
  let open: Block | null = null;
  const close = () => {
    if (open) blocks.push(open);
    open = null;
  };

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (line.startsWith(">")) continue;
    if (/^─+$/.test(line)) {
      close();
      blocks.push({ kind: "rule" });
      continue;
    }
    if (!line) {
      close();
      continue;
    }

    let m: RegExpMatchArray | null;
    if ((m = line.match(/^#\s+(.*)$/))) {
      close();
      blocks.push({ kind: "heading", text: m[1] });
    } else if ((m = line.match(/^-\s+(.*)$/))) {
      close();
      open = { kind: "point", text: m[1] };
    } else if ((m = line.match(/^(\d+)\.\s+(.*)$/))) {
      close();
      open = { kind: "step", n: m[1], text: m[2] };
    } else if ((m = line.match(/^\[ \]\s+(.*)$/))) {
      close();
      open = { kind: "check", text: m[1] };
    } else if (open) {
      open.text += " " + line;
    } else {
      close();
      open = { kind: "para", text: line };
    }
  }
  close();
  // Rules that only bracketed the banner or the footer read as stray lines.
  return blocks.filter((b, i) => b.kind !== "rule" || (i > 0 && i < blocks.length - 1));
}

export function CraftUI({
  photo,
  heading = "",
  file = "",
  version,
  principles = [],
  quote,
  content = "",
}: CraftUIProps) {
  const blocks = parse(content);

  return (
    <div
      className="custom-scrollbar @container h-full w-full overflow-y-auto"
      style={{ background: "#020a05", color: "var(--os-text)" }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 p-5 @2xl:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] @2xl:p-6">
        {/* ── Left: portrait, the five principles, the quote ───────────── */}
        <div className="flex flex-col gap-5">
          {photo && <Portrait src={photo} />}

          {principles.length > 0 && (
            <section className={SHEET_BOX}>
              <header
                className="font-os-pixel flex items-center justify-between px-4 py-2 text-[15px] tracking-[0.12em]"
                style={{ borderBottom: "2px solid var(--os-border-strong)" }}
              >
                <span>{"// PRINCIPLES"}</span>
                <span aria-hidden className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 bg-current" />
                  ))}
                </span>
              </header>
              <ol className="px-4">
                {principles.map((p, i) => (
                  <li
                    key={p}
                    className="flex items-center gap-4 py-3"
                    style={i > 0 ? { borderTop: "1px solid var(--os-border)" } : undefined}
                  >
                    <span
                      className="w-6 shrink-0 text-[22px] leading-none tabular-nums text-os-accent"
                      style={{ fontFamily: "var(--font-vt323)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-os-mono text-[13px]">{p}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {quote && <QuoteBox quote={quote} />}
        </div>

        {/* ── Right: the document ──────────────────────────────────────── */}
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
                <span aria-hidden className="h-0.5 flex-1" style={{ background: "var(--os-border-strong)" }} />
              </p>
            </div>
            <Globe version={version} />
          </div>

          <div className="font-os-mono mt-6 space-y-3 text-[14px] leading-[1.75]">
            {blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockView({ block: b }: { block: Block }) {
  switch (b.kind) {
    case "heading":
      return (
        <h2 className="font-os-pixel flex items-center gap-2 border-b-2 border-dotted border-os-border-strong pb-2 pt-5 text-[18px] text-os-accent">
          <PixelGlyph sprite="start" />
          {b.text}
        </h2>
      );
    case "point":
      return (
        <p className="flex gap-3" style={{ color: "var(--os-text-dim)" }}>
          <span className="mt-1.5 shrink-0 text-os-accent">
            <PixelGlyph sprite="pointer" />
          </span>
          <span>{b.text}</span>
        </p>
      );
    case "step":
      return (
        <p className="flex gap-3" style={{ color: "var(--os-text-dim)" }}>
          <span
            className="w-6 shrink-0 text-[20px] leading-[1.4] text-os-accent"
            style={{ fontFamily: "var(--font-vt323)" }}
          >
            {b.n.padStart(2, "0")}
          </span>
          <span>{b.text}</span>
        </p>
      );
    case "check":
      return (
        <p className="flex gap-3" style={{ color: "var(--os-text-dim)" }}>
          <span aria-hidden className="mt-1 h-4 w-4 shrink-0 border-2 border-os-accent" />
          <span>{b.text}</span>
        </p>
      );
    case "rule":
      return <hr className="border-t-2 border-dotted border-os-border-strong" />;
    case "para":
      // A paragraph that is a quotation reads as one: set in the accent.
      return /^["“]/.test(b.text) ? (
        <p className="border-l-2 border-os-accent pl-4 italic text-os-accent">{b.text}</p>
      ) : (
        <p>{b.text}</p>
      );
  }
}
