"use client";
import { useState } from "react";
import Image from "next/image";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { SectionTitle, Badge, Card, Wrapper } from "./primitives";
import { TechIcon } from "./tech-icon";
import { ImageLightbox } from "./image-lightbox";
import { FeaturedStar } from "../../featured-star";

// ProjectUI — one window per project: description, screenshots, stack, and links.

interface ProjectUIProps {
  name?: string;
  type?: string;
  description?: string;
  highlights?: string[];
  stack?: string[];
  status?: string;
  /**
   * Whether `status` describes work that is out in the world, which is what
   * paints the status pill in the accent. Authored as a flag rather than read
   * off the words of `status`, because those words are copy: they are written
   * once per language, and a test against them would quietly go grey in Thai.
   */
  delivered?: boolean;
  year?: string;
  platform?: string;
  /** Public paths to screenshots, rendered as a horizontal strip. */
  images?: string[];
  /** Where the work can be seen. A shipped app is often on two stores. */
  links?: Array<{ label: string; url: string }>;
  /** Marks the project to read first — a star beside the name, here and in the
   * folder listing that led here. */
  featured?: boolean;
}

export function ProjectUI({
  name = "",
  type,
  description = "",
  highlights = [],
  stack = [],
  status = "",
  delivered = false,
  year = "",
  platform,
  images = [],
  links = [],
  featured = false,
}: ProjectUIProps) {
  const S = useStrings();
  // Which shot the viewer is on, and `null` for "not open" — one piece of state
  // rather than a flag and an index that could disagree about what is showing.
  const [viewing, setViewing] = useState<number | null>(null);

  return (
    <Wrapper>
      <SectionTitle>{S.section.project}</SectionTitle>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              {featured && <FeaturedStar />}
              <div className="font-bold text-sm">{name}</div>
            </div>
            {type && (
              <div className="opacity-60 mt-0.5 text-[11px]">{type}</div>
            )}
          </div>
          <div className="text-right shrink-0 ml-4 space-y-1">
            <div>
              <span
                className="text-[11px] px-2 py-0.5 rounded-md font-medium"
                style={{
                  color: delivered
                    ? "var(--os-on-accent-container)"
                    : "var(--os-tertiary)",
                  background: delivered
                    ? "var(--os-accent-container)"
                    : "color-mix(in srgb, var(--os-tertiary) 15%, transparent)",
                }}
              >
                {status}
              </span>
            </div>
            <div className="opacity-50 text-[10px]">{year}</div>
          </div>
        </div>

        <p className="opacity-80 leading-relaxed mb-3">{description}</p>

        {/* The strip is the index, not the view: each shot is a button into the
            full-size viewer, because 224px of a phone screen shows that a
            screen exists and nothing about what is on it. */}
        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setViewing(i)}
                aria-label={S.project.screenshotOpen(name, i + 1)}
                className="focus-ring shrink-0 cursor-zoom-in rounded-lg transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Image
                  src={src}
                  alt={S.project.screenshotAlt(name, i + 1)}
                  width={0}
                  height={0}
                  sizes="400px"
                  className="h-56 w-auto rounded-lg"
                  style={{ border: "1px solid var(--os-border)" }}
                />
              </button>
            ))}
          </div>
        )}

        {highlights.length > 0 && (
          <ul className="space-y-1 mb-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="opacity-50 shrink-0">▸</span>
                <span className="opacity-90">{h}</span>
              </li>
            ))}
          </ul>
        )}

        {platform && (
          <div className="mb-2 opacity-70 text-[11px]">
            {S.project.platform} {platform}
          </div>
        )}

        <div className="flex flex-wrap">
          {stack.map((s) => (
            <Badge key={s} text={s} icon={<TechIcon name={s} />} />
          ))}
        </div>

        {links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md transition-opacity opacity-90 hover:opacity-100"
                style={{
                  color: "var(--os-on-accent-container)",
                  background: "var(--os-accent-container)",
                }}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </Card>

      <ImageLightbox
        images={images}
        index={viewing}
        label={name}
        onClose={() => setViewing(null)}
        onIndexChange={setViewing}
      />
    </Wrapper>
  );
}
