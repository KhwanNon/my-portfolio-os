"use client";
// SEARCH: the button at the left end of the taskbar, and the prompt it opens in
// the middle of the screen — the way a chat assistant asks what you want. It is
// the shell's one search; ⌘K is only a quicker way to the same field.
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useDesktopData } from "../_lib/use-desktop-data";
import { findFeatured } from "../_lib/featured";
import { useFileSearch, type SearchResult } from "../_lib/use-file-search";
import { FileGraphic } from "./file-graphic";
import { FeaturedStar } from "./featured-star";
import { PixelGlyph } from "./pixel-glyph";
import { SearchResults } from "./search-results";

const RESULTS_ID = "launcher-search-results";

/** Motion in whole frames, the way a sprite animates. */
const STEPPED = (t: number) => Math.ceil(t * 3) / 3;

export function SearchLauncher() {
  const { openFile } = useWindowManager();
  const S = useStrings();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // ⌘K / Ctrl+K from anywhere opens the prompt.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const launch = useCallback(
    (node: FileNode) => {
      openFile(node);
      close();
    },
    [openFile, close],
  );

  return (
    <>
      {/* The one lit button on the bar, like a game's "press start". */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        data-pressed={open}
        className="focus-ring font-os-pixel pixel-btn flex h-full shrink-0 cursor-pointer items-center gap-2 px-3 text-[15px] font-bold tracking-[0.12em] hover:brightness-110 sm:px-4"
        style={{
          color: "var(--os-on-accent)",
          background: open ? "#1a9e4a" : "#22b956",
        }}
      >
        <PixelGlyph sprite="search" />
        <span className="max-sm:sr-only">{S.launcher.button}</span>
      </button>

      <AnimatePresence>
        {open && <Prompt onClose={close} onLaunch={launch} />}
      </AnimatePresence>
    </>
  );
}

/**
 * The prompt itself: a question, a field to answer it in, and a few things to
 * pick instead of typing — the suggestions a chat assistant offers under its
 * box. Typing swaps the suggestions for what matches.
 *
 * Mounted only while open, so every opening starts on an empty field.
 */
function Prompt({
  onClose,
  onLaunch,
}: {
  onClose: () => void;
  onLaunch: (node: FileNode) => void;
}) {
  const { startApps, projects, featuredPitch } = useDesktopData();
  const S = useStrings();
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useFileSearch({
    onSubmit: (item: SearchResult) => onLaunch(item.node),
    onEscape: onClose,
  });

  useEffect(() => inputRef.current?.focus(), []);

  // Esc closes it from anywhere inside, not only from the field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const featured = findFeatured(projects);
  const searching = search.query.trim() !== "";

  return (
    // Fixed over the whole screen, taskbar included: while the prompt is up it
    // is the only thing to answer. A press on the shade puts it away.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12, ease: STEPPED }}
      className="fixed inset-0 z-9500 flex items-start justify-center bg-black/70 px-4 pt-[14vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={S.search.label}
        initial={{ y: 16 }}
        animate={{ y: 0 }}
        exit={{ y: 16 }}
        transition={{ duration: 0.12, ease: STEPPED }}
        className="os-window pixel-box flex max-h-[72vh] w-full max-w-[640px] flex-col overflow-hidden p-6"
        data-active="true"
        style={{ background: "#020a05" }}
      >
        <p
          className="font-os-pixel text-center text-[22px] font-semibold"
          style={{ color: "var(--os-text)" }}
        >
          {S.launcher.heading}
        </p>

        {/* The field: one plain frame that lights when it has the caret. */}
        <div className="mt-5 flex h-12 shrink-0 items-center gap-3 border-2 border-os-border-strong bg-black px-4 focus-within:border-os-accent">
          <PixelGlyph sprite="search" color="var(--os-text-faint)" />
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
            className="font-os-pixel min-w-0 flex-1 bg-transparent text-[17px] caret-os-accent outline-none placeholder:text-os-text-subtle"
            style={{ color: "var(--os-text)" }}
          />
          <kbd
            className="font-os-pixel hidden text-[12px] sm:block"
            style={{ color: "var(--os-text-subtle)" }}
          >
            ESC
          </kbd>
        </div>

        {searching ? (
          <div className="-mx-6 -mb-6 mt-4 flex min-h-0 flex-1 flex-col">
            <SearchResults
              id={RESULTS_ID}
              results={search.results}
              selectedIdx={search.selectedIdx}
              onSelect={(item) => onLaunch(item.node)}
              onHover={search.setSelectedIdx}
            />
          </div>
        ) : (
          // Suggestions, as a chat assistant offers them under its box: one
          // row of things to press instead of typing. The recommended project
          // leads, marked with its star.
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {featured && (
              <Chip
                node={featured}
                label={featured.name.replace(/\.ui$/, "")}
                title={featuredPitch}
                star
                onLaunch={onLaunch}
              />
            )}
            {startApps.map((node) => (
              <Chip key={node.id} node={node} onLaunch={onLaunch} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/** One suggestion: a file's art and name, pressed to open it. */
function Chip({
  node,
  label,
  title,
  star,
  onLaunch,
}: {
  node: FileNode;
  label?: string;
  title?: string;
  star?: boolean;
  onLaunch: (node: FileNode) => void;
}) {
  return (
    <button
      onClick={() => onLaunch(node)}
      title={title}
      className="focus-ring font-os-pixel flex cursor-pointer items-center gap-2 border-2 border-os-border bg-os-surface-1 py-1 pl-1.5 pr-3 text-[14px] text-os-text-dim hover:border-os-accent hover:text-os-text"
    >
      <FileGraphic icon={node.icon} size={20} className="pixelated" />
      {star && <FeaturedStar size={11} decorative />}
      {label ?? node.name}
    </button>
  );
}
