"use client";
// EducationUI — every school in one window, newest first, laid out like a
// game's record screen: a header that names the page and carries the quote,
// then one card per school with its picture in a scanner's brackets.
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { PixelGlyph } from "../../pixel-glyph";
import { useDesktopData } from "../../../_lib/use-desktop-data";
import { Globe } from "./sheet";

interface EducationEntry {
  type: string;
  institution: string;
  field: string;
  period: string;
  /** The school, drawn — shown beside the entry. */
  image?: string;
  description?: string;
  subjects?: string[];
  gpa?: string;
}

interface EducationUIProps {
  entries?: EducationEntry[];
}

export function EducationUI({ entries = [] }: EducationUIProps) {
  const S = useStrings();
  const { owner } = useDesktopData();

  return (
    <div
      className="custom-scrollbar @container h-full w-full overflow-y-auto"
      style={{ background: "#020a05", color: "var(--os-text)" }}
    >
      <div className="space-y-5 p-5 @2xl:p-6">
        {/* ── Header: the page's name, and the line that sums it up ─────── */}
        <header className="flex items-center gap-6 border-2 border-os-border-strong px-5 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <span className="hidden shrink-0 text-os-accent @md:block">
              <GraduationCap size={64} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <h1
                className="font-os-pixel text-[clamp(28px,6cqw,52px)] font-bold uppercase leading-none tracking-wide text-os-accent"
                style={{ textShadow: "3px 3px 0 #000" }}
              >
                {S.section.education}
              </h1>
              <p
                className="font-os-mono mt-2 text-[13px] uppercase tracking-[0.12em]"
                style={{ color: "var(--os-text-dim)" }}
              >
                {S.education.subtitle}
                <span aria-hidden className="boot-cursor">
                  _
                </span>
              </p>
            </div>
          </div>

          <blockquote
            className="font-os-mono hidden max-w-60 shrink-0 border-l-2 border-os-border-strong pl-5 text-[13px] uppercase leading-relaxed @3xl:block"
            style={{ color: "var(--os-text-dim)" }}
          >
            &ldquo;{owner.tagline}&rdquo;
          </blockquote>
          <Globe size={84} />
        </header>

        {/* ── One card per school ───────────────────────────────────────── */}
        {entries.map((entry) => (
          <article
            key={entry.type}
            className="flex flex-col gap-5 border-2 border-os-border-strong p-4 @2xl:flex-row @2xl:p-5"
          >
            {entry.image && <Picture src={entry.image} />}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <h2 className="font-os-pixel text-[22px] font-bold leading-tight text-os-accent">
                  {entry.type}
                </h2>
                <span
                  className="font-os-mono shrink-0 text-[14px] tabular-nums"
                  style={{ color: "var(--os-text-dim)" }}
                >
                  {entry.period}
                </span>
              </div>
              <p
                className="font-os-mono mt-1 text-[15px]"
                style={{ color: "var(--os-accent)", opacity: 0.8 }}
              >
                {entry.field}
              </p>
              <p
                className="font-os-mono mt-2 flex items-center gap-2 text-[13px]"
                style={{ color: "var(--os-text-dim)" }}
              >
                <span aria-hidden className="shrink-0 text-os-accent">
                  <PixelGlyph sprite="pin" />
                </span>
                {entry.institution}
              </p>
              {entry.gpa && (
                <p
                  className="font-os-mono mt-1 text-[13px]"
                  style={{ color: "var(--os-text-dim)" }}
                >
                  {S.education.gpa} {entry.gpa}
                </p>
              )}
              {entry.description && (
                <p className="font-os-mono mt-3 text-[14px] leading-relaxed">
                  {entry.description}
                </p>
              )}
              {entry.subjects && entry.subjects.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {entry.subjects.map((s) => (
                    <li
                      key={s}
                      className="font-os-mono border-2 border-os-border-strong px-3 py-1 text-[13px]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/** The school's picture, its corners bracketed like a scanner's target. */
function Picture({ src }: { src: string }) {
  const corner = "absolute h-4 w-4 border-os-accent";
  return (
    <div className="relative w-full max-w-80 shrink-0 self-start p-1.5 @2xl:w-56">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-os-border-strong">
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 224px, 90vw"
          className="pixelated object-cover"
        />
      </div>
      <span aria-hidden className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span aria-hidden className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span aria-hidden className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span aria-hidden className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}
