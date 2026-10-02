"use client";
// ProjectUI — one window per project, laid out like a game's codex entry: the
// project's mark, name and status across the top; tabs that jump between its
// parts; then the screenshots, what it is and what it does, what it is built
// with, the role it came out of, and the projects that came out with it.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Images,
  ListChecks,
  Cpu,
  User,
} from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { useDesktopData } from "../../../_lib/use-desktop-data";
import { findNodeById } from "../../../_lib/find-node";
import { leadsToFeatured } from "../../../_lib/featured";
import { FeaturedStar } from "../../featured-star";
import { PixelGlyph } from "../../pixel-glyph";
import { TechMark } from "./tech-icon";
import { ImageLightbox } from "./image-lightbox";

interface ProjectUIProps {
  /** This project's own id — how the Experience that produced it is found. */
  projectId?: string;
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
  /** The square tile that stands for this project in a folder of projects. */
  cover?: string;
  /** Public paths to screenshots, rendered as a horizontal strip. */
  images?: string[];
  /** Caveat shown under the screenshot strip — for demo shots that stand in
   * for a real product (e.g. delivered under NDA), so a viewer doesn't read
   * them as the actual, complete UI. */
  imagesNote?: string;
  /** Where the work can be seen. A shipped app is often on two stores. */
  links?: Array<{ label: string; url: string }>;
  /** Marks the project to read first — a star beside the name, here and in the
   * folder listing that led here. */
  featured?: boolean;
}

type ExperienceProps = {
  role?: string;
  company?: string;
  period?: string;
  description?: string;
  projects?: string[];
};

/** Every Experience file that names `projectId` among the projects it produced. */
function rolesFor(experience: FileNode | null, projectId: string): FileNode[] {
  if (!experience || experience.data?.kind !== "folder") return [];
  return experience.data.children.filter((n) => {
    if (n.data?.kind !== "ui") return false;
    const props = n.data.props as ExperienceProps | undefined;
    return props?.projects?.includes(projectId) ?? false;
  });
}

const BOX = "border-2 border-os-border-strong";

export function ProjectUI({
  projectId = "",
  name = "",
  type,
  description = "",
  highlights = [],
  stack = [],
  status = "",
  delivered = false,
  year = "",
  platform,
  cover,
  images = [],
  imagesNote,
  links = [],
  featured = false,
}: ProjectUIProps) {
  const S = useStrings();
  const { openFile } = useWindowManager();
  const { fileSystem, projects: projectsRoot } = useDesktopData();
  // Which shot the viewer is on, and `null` for "not open" — one piece of state
  // rather than a flag and an index that could disagree about what is showing.
  const [viewing, setViewing] = useState<number | null>(null);

  // The role this came out of, and the other projects that came out of it —
  // read off Experience, so the two can never disagree.
  const drive = fileSystem.find((n) => n.id === "c-drive") ?? null;
  const roles = rolesFor(drive && findNodeById(drive, "experience"), projectId);
  const related = roles
    .flatMap((r) => (r.data?.kind === "ui" ? ((r.data.props as ExperienceProps).projects ?? []) : []))
    .filter((id, i, all) => id !== projectId && all.indexOf(id) === i)
    .map((id) => findNodeById(projectsRoot, id))
    .filter((n) => n !== null);

  const tabs = [
    { id: "overview", label: S.project.tabs.overview, Icon: FileText, show: true },
    { id: "screenshots", label: S.project.tabs.screenshots, Icon: Images, show: images.length > 0 },
    { id: "features", label: S.project.tabs.features, Icon: ListChecks, show: highlights.length > 0 },
    { id: "stack", label: S.project.tabs.stack, Icon: Cpu, show: stack.length > 0 },
    { id: "role", label: S.project.tabs.role, Icon: User, show: roles.length > 0 },
  ].filter((t) => t.show);

  const { scrollRef, active, jump } = useSections(tabs.map((t) => t.id));

  return (
    <div
      ref={scrollRef}
      className="custom-scrollbar @container h-full w-full overflow-y-auto"
      style={{ background: "#020a05", color: "var(--os-text)" }}
    >
      <div className="space-y-4 p-4 @2xl:p-5">
        {/* ── Header: mark, name, status ───────────────────────────────── */}
        <header id="overview" className="flex flex-col gap-4 @3xl:flex-row">
          <div className="flex min-w-0 flex-1 gap-4">
            {cover && (
              <span className={`${BOX} relative hidden h-28 w-28 shrink-0 overflow-hidden @lg:block`}>
                <Image src={cover} alt="" fill sizes="112px" className="pixelated object-cover" />
              </span>
            )}
            <div className="min-w-0">
              <h1
                className="font-os-pixel flex items-center gap-3 text-[clamp(22px,4.4cqw,34px)] font-bold leading-tight text-os-accent"
                style={{ textShadow: "2px 2px 0 #000" }}
              >
                {name}
                {featured && <FeaturedStar size={20} />}
              </h1>
              {type && (
                <p className="font-os-mono mt-1 text-[14px]" style={{ color: "var(--os-accent)", opacity: 0.75 }}>
                  {type}
                </p>
              )}
              <p className="font-os-mono mt-2 line-clamp-2 text-[14px] leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <dl className={`${BOX} font-os-mono shrink-0 space-y-2 p-4 text-[13px] @3xl:w-72`}>
            <div className="flex items-center justify-between gap-3">
              <span
                className={`border-2 px-2 py-0.5 text-[12px] ${
                  delivered ? "border-os-accent text-os-accent" : "border-os-border-strong text-os-tertiary"
                }`}
              >
                {status}
              </span>
              <span style={{ color: "var(--os-text-dim)" }}>{year}</span>
            </div>
            {platform && (
              <div className="flex gap-3 border-t border-os-border pt-2">
                <dt className="shrink-0 text-os-accent">{S.project.platformLabel}</dt>
                <dd>{platform}</dd>
              </div>
            )}
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-os-border pt-2">
                {links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring flex items-center gap-1.5 border-2 border-os-border-strong px-2 py-1 text-[12px] hover:border-os-accent hover:bg-os-accent hover:text-os-on-accent"
                  >
                    {link.label}
                    <PixelGlyph sprite="external" scale={2} />
                  </a>
                ))}
              </div>
            )}
          </dl>
        </header>

        {/* ── Tabs: they jump to a part, and light as you scroll past it ──── */}
        <nav className={`${BOX} sticky top-0 z-10 flex overflow-x-auto bg-[#020a05]`}>
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => jump(id)}
              aria-current={active === id ? "true" : undefined}
              className={`focus-ring font-os-pixel flex shrink-0 cursor-pointer items-center gap-2 border-r-2 border-os-border-strong px-4 py-2.5 text-[14px] last:border-r-0 ${
                active === id
                  ? "bg-os-accent-container/70 text-os-accent"
                  : "text-os-text-dim hover:bg-os-accent-container/30 hover:text-os-text"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </button>
          ))}
        </nav>

        {images.length > 0 && (
          <section id="screenshots">
            <Strip images={images} name={name} onOpen={setViewing} />
            {imagesNote && (
              <p className="font-os-mono mt-2 text-[12px] italic" style={{ color: "var(--os-text-faint)" }}>
                {imagesNote}
              </p>
            )}
          </section>
        )}

        <div className="grid gap-4 @4xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* ── Left: what it is, and what it does ───────────────────────── */}
          <div className="min-w-0 space-y-4">
            <Section title={S.project.overview}>
              <p className="font-os-mono text-[14px] leading-relaxed">{description}</p>
            </Section>

            {highlights.length > 0 && (
              <Section id="features" title={S.project.features}>
                <ul className="space-y-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1 shrink-0 text-os-accent">
                        <PixelGlyph sprite="pointer" />
                      </span>
                      <span className="font-os-mono text-[13px] leading-relaxed" style={{ color: "var(--os-text-dim)" }}>
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {roles.length > 0 && (
              <Section id="role" title={S.project.myRole}>
                <div className="space-y-2">
                  {roles.map((r) => {
                    const p = (r.data?.kind === "ui" ? r.data.props : {}) as ExperienceProps;
                    return (
                      <button
                        key={r.id}
                        onClick={() => openFile(r)}
                        className={`${BOX} focus-ring group flex w-full cursor-pointer items-start gap-3 p-3 text-left hover:border-os-accent`}
                      >
                        <Building2 size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-os-accent" />
                        <span className="min-w-0 flex-1">
                          <span className="font-os-pixel block text-[16px] text-os-text group-hover:text-os-accent">
                            {p.role}
                          </span>
                          <span className="font-os-mono mt-0.5 block text-[12px]" style={{ color: "var(--os-text-dim)" }}>
                            {p.company} · {p.period}
                          </span>
                        </span>
                        <span className="text-os-text-dim group-hover:text-os-accent">
                          <PixelGlyph sprite="external" scale={2} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>
            )}
          </div>

          {/* ── Right: what it is built with, and what came with it ─────── */}
          <div className="space-y-4">
            {stack.length > 0 && (
              <Section id="stack" title={S.project.techStack} boxed>
                <ul className="grid grid-cols-3 gap-2 @4xl:grid-cols-3">
                  {stack.map((t) => (
                    <li
                      key={t}
                      className={`${BOX} flex flex-col items-center justify-center gap-2 px-1 py-3 text-center text-os-accent`}
                    >
                      <TechMark name={t} size={26} />
                      <span className="font-os-mono text-[11px] leading-tight text-os-text">{t}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {related.length > 0 && (
              <Section title={S.project.related} boxed>
                <ul className="custom-scrollbar max-h-56 space-y-2 overflow-y-auto pr-1">
                  {related.map((node) => (
                    <li key={node.id}>
                      <button
                        onClick={() => openFile(node)}
                        className={`${BOX} focus-ring font-os-mono group flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-[13px] hover:border-os-accent`}
                      >
                        <span className="min-w-0 flex-1 truncate group-hover:text-os-accent">
                          {node.name.replace(/\.ui$/, "")}
                        </span>
                        {leadsToFeatured(node) && <FeaturedStar size={11} decorative />}
                        <span className="text-os-text-dim group-hover:text-os-accent">
                          <PixelGlyph sprite="external" scale={2} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </div>
      </div>

      <ImageLightbox
        images={images}
        index={viewing}
        label={name}
        onClose={() => setViewing(null)}
        onIndexChange={setViewing}
      />
    </div>
  );
}

/**
 * Tabs over one scrolling page: a tab scrolls its part into view, and the tab
 * lit is whichever part the reader has scrolled to — so the two never disagree.
 */
function useSections(ids: string[]) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(ids[0]);
  // A jump scrolls the page; the tab it lit holds until the scroll settles,
  // rather than flickering through every part it passes on the way.
  const lockUntil = useRef(0);
  const key = ids.join("|");

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const onScroll = () => {
      if (Date.now() < lockUntil.current) return;
      const line = root.getBoundingClientRect().top + 80;
      // The part whose top is nearest above the line — by position, not by
      // order, since the side column's parts sit level with the main ones.
      let current = key.split("|")[0];
      let best = -Infinity;
      for (const id of key.split("|")) {
        const top = root.querySelector<HTMLElement>(`#${id}`)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line && top > best) {
          best = top;
          current = id;
        }
      }
      setActive(current);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, [key]);

  const jump = (id: string) => {
    const root = scrollRef.current;
    const el = root?.querySelector<HTMLElement>(`#${id}`);
    if (!root || !el) return;
    const top =
      id === key.split("|")[0]
        ? 0
        : el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 64;
    lockUntil.current = Date.now() + 800;
    root.scrollTo({ top, behavior: "smooth" });
    setActive(id);
  };

  return { scrollRef, active, jump };
}

/** The screenshots as a strip, with arrows to page through it. */
function Strip({
  images,
  name,
  onOpen,
}: {
  images: string[];
  name: string;
  onOpen: (i: number) => void;
}) {
  const S = useStrings();
  const rail = useRef<HTMLDivElement>(null);
  const page = (dir: 1 | -1) =>
    rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="relative flex items-center gap-2">
      <Arrow label={S.lightbox.previous} onClick={() => page(-1)}>
        <ChevronLeft size={20} strokeWidth={2.5} />
      </Arrow>
      <div ref={rail} className="custom-scrollbar flex min-w-0 flex-1 gap-3 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => onOpen(i)}
            aria-label={S.project.screenshotOpen(name, i + 1)}
            className="focus-ring shrink-0 cursor-zoom-in border-2 border-os-border-strong p-1 hover:border-os-accent"
          >
            <Image
              src={src}
              alt={S.project.screenshotAlt(name, i + 1)}
              width={0}
              height={0}
              sizes="400px"
              className="h-60 w-auto"
            />
          </button>
        ))}
      </div>
      <Arrow label={S.lightbox.next} onClick={() => page(1)}>
        <ChevronRight size={20} strokeWidth={2.5} />
      </Arrow>
    </div>
  );
}

function Arrow({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="focus-ring grid h-12 w-8 shrink-0 cursor-pointer place-items-center border-2 border-os-border-strong text-os-accent hover:border-os-accent hover:bg-os-accent-container/40"
    >
      {children}
    </button>
  );
}

/** A part of the page: a pixel heading over a dotted rule, optionally boxed. */
function Section({
  id,
  title,
  boxed = false,
  children,
}: {
  id?: string;
  title: string;
  boxed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={boxed ? `${BOX} p-3` : undefined}>
      <h2 className="font-os-pixel mb-3 flex items-center gap-2 border-b-2 border-dotted border-os-border-strong pb-2 text-[16px] text-os-accent">
        <PixelGlyph sprite="start" />
        {title}
      </h2>
      {children}
    </section>
  );
}
