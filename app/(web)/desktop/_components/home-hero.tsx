"use client";
// The desktop's opening statement: who the machine belongs to, one sentence on
// what he does, the way into everything, and the three places worth going
// first. Centred as one column so the surface reads as a home screen rather
// than as a wallpaper with things left on it.
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { BrandLogo } from "@/app/shared/components/brand-logo";
import { SPRING_EXPRESSIVE } from "@/app/shared/constants/motion";
import { homeShortcuts } from "../_data/file-system-data";
import { OWNER } from "../_data/identity";
import { useFileSearch, type SearchResult } from "../_lib/use-file-search";
import { FileGraphic } from "./file-graphic";
import { SearchResults } from "./search-results";

/** What the field asks for — the one search this shell has. */
const SEARCH_PLACEHOLDER = "Search files, folders, apps…";

/**
 * Weight tapers down the column — mark, name, sentence — and then the field
 * and the shortcuts put a base under it, so the block sits on something
 * instead of trailing off. Colour is spent once, on the mark: every line here
 * is text, and text takes its rank from size and tone in this shell, never
 * from the accent.
 */
export function HomeHero() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
      <BrandLogo size={64} priority />

      <h1
        className="mt-5 text-[clamp(28px,5vw,42px)] font-semibold leading-[1.12] tracking-tight"
        style={{ color: "var(--os-text)" }}
      >
        {OWNER.name}
      </h1>

      <p
        className="mt-3 text-balance text-[15px] leading-relaxed"
        style={{ color: "var(--os-text-dim)" }}
      >
        {OWNER.tagline}
      </p>

      <SearchField />

      {/* Loose from the field rather than tight to it: they are somewhere else
          to go, not options belonging to the search. */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {homeShortcuts.map((node) => (
          <ShortcutChip key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

/** What the field points assistive tech at while the panel is open. */
const RESULTS_ID = "home-search-results";

/** Air kept between the panel and the edge it stops short of. */
const PANEL_MARGIN = 16;
/** Below this the panel is too short to be a list; let it overhang instead. */
const PANEL_MIN = 180;
/** Tall enough to be a list, short enough not to become the whole desktop. */
const PANEL_MAX = 384;

/**
 * How tall the results may grow: the room actually left between the bottom of
 * the field and the bottom of the workspace. A viewport-percentage cap can't
 * know where the field sits, and the desktop scrolls — so guessing high is what
 * pushed the surface past the dock and exposed the wallpaper underneath it.
 */
function usePanelHeight(anchor: React.RefObject<HTMLElement | null>, open: boolean) {
  const [maxHeight, setMaxHeight] = useState(PANEL_MAX);

  useLayoutEffect(() => {
    if (!open) return;

    const measure = () => {
      const el = anchor.current;
      if (!el) return;
      // The workspace is the box windows and the desktop live in — everything
      // above the dock. Falling back to the viewport keeps this honest if the
      // surface is ever rendered outside one.
      const floor =
        el.closest("[data-workspace]")?.getBoundingClientRect().bottom ??
        window.innerHeight;
      const room = floor - el.getBoundingClientRect().bottom - PANEL_MARGIN;
      setMaxHeight(Math.min(PANEL_MAX, Math.max(room, PANEL_MIN)));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [anchor, open]);

  return maxHeight;
}

/**
 * The search itself — there is no second one behind a shortcut. Focus it and
 * the results drop under it, the way a field with something to say is expected
 * to behave; ⌘K only puts the caret here, so the keyboard and the pointer
 * arrive at the same field rather than at two searches that have to be kept
 * telling the same story.
 */
function SearchField() {
  const { openFile } = useWindowManager();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const maxHeight = usePanelHeight(anchorRef, open);

  const submit = useCallback(
    (item: SearchResult) => {
      openFile(item.node);
      setOpen(false);
      inputRef.current?.blur();
    },
    [openFile],
  );

  // Esc backs out of the results but leaves the query: the field is part of the
  // desktop, so closing it should not feel like leaving a page.
  const dismiss = useCallback(() => {
    setOpen(false);
    inputRef.current?.blur();
  }, []);

  const search = useFileSearch({ onSubmit: submit, onEscape: dismiss });

  // ⌘K from anywhere on the desktop: put the caret in the field and select what
  // is already there, so the shortcut starts a fresh query without wiping one
  // the user may still want.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const el = inputRef.current;
        if (!el) return;
        el.scrollIntoView({ block: "nearest" });
        el.focus();
        el.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    // The panel is measured from this box, and lifted over the desktop's other
    // corner so nothing on the surface can cut into it.
    <div ref={anchorRef} className="relative z-50 mt-8 w-full">
      <div
        className="flex h-14 w-full items-center gap-3 rounded-full pl-5 pr-4 transition-shadow duration-200"
        style={{
          background: "var(--os-surface-2)",
          border: "1px solid var(--os-border)",
          boxShadow: open ? "var(--shadow-3)" : "var(--shadow-2)",
        }}
      >
        <Search
          size={19}
          strokeWidth={1.8}
          className="shrink-0"
          style={{ color: "var(--os-text-dim)" }}
        />
        <input
          ref={inputRef}
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          onKeyDown={search.onKeyDown}
          onFocus={() => setOpen(true)}
          // A row keeps focus on the field while it is pressed, so a blur here
          // only ever means the pointer went somewhere else entirely.
          onBlur={() => setOpen(false)}
          placeholder={SEARCH_PLACEHOLDER}
          spellCheck={false}
          autoComplete="off"
          aria-label="Search"
          role="combobox"
          aria-expanded={open}
          aria-controls={RESULTS_ID}
          aria-autocomplete="list"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-os-text-faint"
          style={{ color: "var(--os-text)" }}
        />
        <kbd
          className="hidden shrink-0 rounded-xs px-1.5 py-0.5 text-[11px] font-medium sm:block"
          style={{
            border: "1px solid var(--os-border)",
            color: "var(--os-text-faint)",
          }}
        >
          ⌘K
        </kbd>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={SPRING_EXPRESSIVE}
            className="absolute left-0 right-0 top-full mt-2 flex flex-col overflow-hidden rounded-xl text-left"
            style={{
              maxHeight,
              transformOrigin: "top center",
              background: "var(--os-surface-1)",
              border: "1px solid var(--os-border)",
              boxShadow: "var(--shadow-3)",
            }}
          >
            <SearchResults
              id={RESULTS_ID}
              results={search.results}
              selectedIdx={search.selectedIdx}
              onSelect={submit}
              onHover={search.setSelectedIdx}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** One shortcut, drawn with the artwork the file carries everywhere else. */
function ShortcutChip({ node }: { node: FileNode }) {
  const { openFile } = useWindowManager();

  return (
    <button
      onClick={() => openFile(node)}
      className="focus-ring flex h-9 cursor-pointer items-center gap-2 rounded-full pl-2.5 pr-3.5 text-[13px] transition-colors duration-200 hover:bg-os-surface-3"
      style={{
        background: "var(--os-surface-2)",
        border: "1px solid var(--os-border)",
        color: "var(--os-text-dim)",
      }}
    >
      <FileGraphic icon={node.icon} size={17} className="shrink-0" />
      {node.name}
    </button>
  );
}
