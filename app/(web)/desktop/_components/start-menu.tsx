"use client";
// START: the button at the left end of the taskbar and the menu it opens. The
// menu is also where search lives — there is one search, and ⌘K is only a quicker
// way to put the caret in it.
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useDesktopData } from "../_lib/use-desktop-data";
import { findFeatured } from "../_lib/featured";
import { useFileSearch, type SearchResult } from "../_lib/use-file-search";
import { FileGraphic } from "./file-graphic";
import { FeaturedStar } from "./featured-star";
import { SearchResults } from "./search-results";

/** Four tiles of a window logo: the OS mark, drawn once. */
function StartMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden
      fill="currentColor"
    >
      <rect x="1" y="1" width="6" height="6" />
      <rect x="9" y="1" width="6" height="6" />
      <rect x="1" y="9" width="6" height="6" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  );
}

const RESULTS_ID = "start-search-results";

export function StartMenu() {
  const { openFile } = useWindowManager();
  const { startApps, projects, featuredPitch } = useDesktopData();
  const S = useStrings();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const launch = useCallback(
    (node: FileNode) => {
      openFile(node);
      close();
    },
    [openFile, close],
  );

  const search = useFileSearch({
    onSubmit: (item: SearchResult) => launch(item.node),
    onEscape: close,
  });
  const { reset } = search;

  // Open fresh each time, with the caret already in the field.
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else reset();
  }, [open, reset]);

  // ⌘K / Ctrl+K from anywhere opens the menu on its search field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // A press anywhere outside the button and the menu puts it away.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open, close]);

  const featured = findFeatured(projects);
  const searching = search.query.trim() !== "";

  return (
    <div ref={rootRef} className="relative h-full">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="focus-ring font-os-mono flex h-full cursor-pointer items-center gap-2.5 px-4 text-[13px] font-semibold tracking-[0.12em] transition-colors duration-150 hover:bg-os-accent/10"
        style={{
          color: "var(--os-accent)",
          background: open ? "rgba(85,255,136,0.14)" : undefined,
          borderRight: "1px solid var(--os-border)",
        }}
      >
        <span className="os-glow">
          <StartMark />
        </span>
        <span className="max-sm:sr-only">{S.start.button}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={S.start.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute bottom-full left-0 flex max-h-[min(560px,calc(100dvh-var(--os-dock-h)-8px))] w-[min(380px,100vw)] flex-col overflow-hidden rounded-t-sm"
            style={{
              background: "rgba(2, 8, 5, 0.96)",
              border: "1px solid var(--os-border-strong)",
              borderBottom: "none",
              boxShadow: "var(--shadow-3), var(--glow-window)",
            }}
          >
            <div
              className="font-os-mono flex items-center justify-between px-4 py-2.5 text-[10px] tracking-[0.2em]"
              style={{
                color: "var(--os-text-faint)",
                borderBottom: "1px solid var(--os-border)",
              }}
            >
              <span style={{ color: "var(--os-accent)" }}>{S.start.title}</span>
              <span>{S.start.status}</span>
            </div>

            <div
              className="flex h-11 shrink-0 items-center gap-2.5 px-4"
              style={{ borderBottom: "1px solid var(--os-border)" }}
            >
              <Search
                size={15}
                strokeWidth={1.8}
                style={{ color: "var(--os-text-dim)" }}
              />
              <input
                ref={inputRef}
                value={search.query}
                onChange={(e) => search.setQuery(e.target.value)}
                onKeyDown={search.onKeyDown}
                placeholder={S.search.placeholder}
                spellCheck={false}
                autoComplete="off"
                aria-label={S.search.label}
                role="combobox"
                aria-expanded={searching}
                aria-controls={RESULTS_ID}
                aria-autocomplete="list"
                className="font-os-mono min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-os-text-subtle"
                style={{ color: "var(--os-text)" }}
              />
              <kbd
                className="font-os-mono hidden px-1.5 py-0.5 text-[10px] sm:block"
                style={{
                  border: "1px solid var(--os-border)",
                  color: "var(--os-text-faint)",
                }}
              >
                ⌘K
              </kbd>
            </div>

            {searching ? (
              <div
                className="flex min-h-0 flex-1 flex-col"
                style={{ maxHeight: 360 }}
              >
                <SearchResults
                  id={RESULTS_ID}
                  results={search.results}
                  selectedIdx={search.selectedIdx}
                  onSelect={(item) => launch(item.node)}
                  onHover={search.setSelectedIdx}
                />
              </div>
            ) : (
              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto py-1">
                {featured && (
                  <Section title={S.start.recommended}>
                    <MenuRow
                      node={featured}
                      label={featured.name.replace(/\.ui$/, "")}
                      note={featuredPitch}
                      star
                      onLaunch={launch}
                    />
                  </Section>
                )}
                <Section title={S.start.apps}>
                  {startApps.map((node) => (
                    <MenuRow key={node.id} node={node} onLaunch={launch} />
                  ))}
                </Section>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-2 py-1">
      <h2
        className="font-os-mono px-2 pb-1 pt-2 text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--os-text-subtle)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function MenuRow({
  node,
  label,
  note,
  star,
  onLaunch,
}: {
  node: FileNode;
  label?: string;
  note?: string;
  star?: boolean;
  onLaunch: (node: FileNode) => void;
}) {
  return (
    <button
      onClick={() => onLaunch(node)}
      className="focus-ring flex w-full cursor-pointer items-center gap-3 px-2 py-1.5 text-left transition-colors duration-100 hover:bg-os-accent/10"
    >
      <FileGraphic icon={node.icon} size={22} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          {star && <FeaturedStar size={11} decorative />}
          <span
            className="font-os-mono truncate text-[12px]"
            style={{ color: "var(--os-text)" }}
          >
            {label ?? node.name}
          </span>
        </span>
        {note && (
          <span
            className="mt-0.5 line-clamp-2 block text-[11px] leading-snug"
            style={{ color: "var(--os-text-dim)" }}
          >
            {note}
          </span>
        )}
      </span>
    </button>
  );
}
