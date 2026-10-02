"use client";
// ExperienceUI — one window per company, laid out like a game's mission log: a
// header naming the page, then the role in one framed card — the job and its
// dates, what it was, what was done, what it was done with, and the projects
// it produced.
import { Briefcase, Building2, CalendarDays, Clock } from "lucide-react";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import type { ProjectId } from "../../../_data/projects";
import { useDesktopData } from "../../../_lib/use-desktop-data";
import { findNodeById } from "../../../_lib/find-node";
import { leadsToFeatured } from "../../../_lib/featured";
import { FeaturedStar } from "../../featured-star";
import { PixelGlyph } from "../../pixel-glyph";
import { Globe } from "./sheet";
import { TechIcon } from "./tech-icon";

interface ExperienceUIProps {
  role?: string;
  company?: string;
  companyUrl?: string;
  period?: string;
  duration?: string;
  description?: string;
  highlights?: string[];
  stack?: string[];
  /**
   * The projects this job produced, by id. Ids rather than names or paths: the
   * compiler checks an id, and the lookup finds the project wherever it sits,
   * so neither renaming a project nor moving it breaks the link.
   */
  projects?: ProjectId[];
}

/** A dotted rule, one block high, between the card's parts. */
const DOTTED = "border-t-2 border-dotted border-os-border-strong";

export function ExperienceUI({
  role = "",
  company = "",
  companyUrl,
  period = "",
  duration = "",
  description = "",
  highlights = [],
  stack = [],
  projects = [],
}: ExperienceUIProps) {
  const S = useStrings();
  const { openFile } = useWindowManager();
  const { projects: projectsRoot, owner } = useDesktopData();

  // Resolved here rather than authored as nodes, so an id that no longer
  // matches a project drops out of the list instead of rendering a dead row.
  const linked = projects
    .map((id) => findNodeById(projectsRoot, id))
    .filter((n) => n !== null);

  return (
    <div
      className="custom-scrollbar @container h-full w-full overflow-y-auto"
      style={{ background: "#020a05", color: "var(--os-text)" }}
    >
      <div className="space-y-5 p-5 @2xl:p-6">
        {/* ── Header: the page's name, and the line that sums it up ─────── */}
        <header className="flex items-center gap-6 border-2 border-os-border-strong px-5 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Briefcase
              size={60}
              strokeWidth={2}
              className="hidden shrink-0 text-os-accent @md:block"
            />
            <div className="min-w-0">
              <h1
                className="font-os-pixel text-[clamp(28px,6cqw,52px)] font-bold uppercase leading-none tracking-wide text-os-accent"
                style={{ textShadow: "3px 3px 0 #000" }}
              >
                {S.section.experience}
              </h1>
              <p
                className="font-os-mono mt-2 text-[13px] uppercase tracking-[0.12em]"
                style={{ color: "var(--os-text-dim)" }}
              >
                {S.experience.subtitle}
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

        {/* ── The role ──────────────────────────────────────────────────── */}
        <article className="border-2 border-os-border-strong p-4 @2xl:p-5">
          <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-start @2xl:justify-between">
            <div className="min-w-0">
              <h2 className="font-os-pixel text-[22px] font-bold leading-tight text-os-accent @2xl:text-[26px]">
                {role}
              </h2>
              <p
                className="font-os-mono mt-1.5 flex items-center gap-2 text-[14px]"
                style={{ color: "var(--os-accent)", opacity: 0.85 }}
              >
                <Building2 size={16} strokeWidth={2} className="shrink-0" />
                {companyUrl ? (
                  <a
                    href={companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {company} ↗
                  </a>
                ) : (
                  company
                )}
              </p>
            </div>
            <dl
              className="font-os-mono shrink-0 space-y-1 text-[14px]"
              style={{ color: "var(--os-text-dim)" }}
            >
              <div className="flex items-center gap-2">
                <CalendarDays size={16} strokeWidth={2} className="text-os-accent" />
                <dd className="tabular-nums">{period}</dd>
              </div>
              {duration && (
                <div className="flex items-center gap-2">
                  <Clock size={16} strokeWidth={2} className="text-os-accent" />
                  <dd>{duration}</dd>
                </div>
              )}
            </dl>
          </div>

          {description && (
            <p className="font-os-mono mt-3 text-[14px] leading-relaxed">
              {description}
            </p>
          )}

          {highlights.length > 0 && (
            <section className={`mt-4 pt-4 ${DOTTED}`}>
              <Heading>{S.experience.highlights}</Heading>
              <ul className="mt-3 space-y-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 shrink-0 text-os-accent">
                      <PixelGlyph sprite="pointer" />
                    </span>
                    <span
                      className="font-os-mono text-[13px] leading-relaxed"
                      style={{ color: "var(--os-text-dim)" }}
                    >
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(stack.length > 0 || linked.length > 0) && (
            <div className={`mt-4 grid gap-5 pt-4 @3xl:grid-cols-[minmax(0,1fr)_320px] ${DOTTED}`}>
              {stack.length > 0 && (
                <section>
                  <Heading>{S.experience.technologies}</Heading>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {stack.map((t) => (
                      <li
                        key={t}
                        className="font-os-mono flex items-center gap-2 border-2 border-os-border-strong px-2.5 py-1 text-[13px]"
                      >
                        <TechIcon name={t} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {linked.length > 0 && (
                <section className="@3xl:border-l-2 @3xl:border-dotted @3xl:border-os-border-strong @3xl:pl-5">
                  <Heading>{S.experience.projects}</Heading>
                  {/* Scrolls on its own: a role can produce more projects than
                      the card has room to show at once. */}
                  <ul className="custom-scrollbar mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
                    {linked.map((node) => (
                      <li key={node.id}>
                        <button
                          onClick={() => openFile(node)}
                          title={S.project.openFile(node.name)}
                          className="focus-ring font-os-mono group flex w-full cursor-pointer items-center gap-3 border-2 border-os-border-strong px-3 py-2 text-left text-[13px] hover:border-os-accent hover:bg-os-accent-container/40"
                        >
                          <Briefcase size={16} strokeWidth={2} className="shrink-0 text-os-accent" />
                          <span className="min-w-0 flex-1 truncate group-hover:text-os-accent">
                            {node.name.replace(/\.ui$/, "")}
                          </span>
                          {leadsToFeatured(node) && <FeaturedStar size={11} decorative />}
                          <span aria-hidden className="text-os-text-dim group-hover:text-os-accent">
                            <PixelGlyph sprite="external" scale={2} />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

/** A part's heading inside the card: `// LIKE THIS`, in the accent. */
function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-os-pixel text-[13px] uppercase tracking-[0.16em] text-os-accent">
      {"// "}
      {children}
    </h3>
  );
}
