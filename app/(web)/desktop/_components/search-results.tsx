"use client";
// The body of a search: the rows, and the line under them that says how to
// work the rows. Drawn once here so the panel under the desktop field and the
// ⌘K panel are the same object seen in two places.
import { useEffect, useRef } from "react";
import type { SearchResult } from "../_lib/use-file-search";
import { FileGraphic } from "./file-graphic";

interface Props {
  results: SearchResult[];
  selectedIdx: number;
  onSelect: (result: SearchResult) => void;
  onHover: (index: number) => void;
  /** Set when a combobox field needs to name this list with aria-controls. */
  id?: string;
}

/**
 * Fills whatever height its parent allows — the panel owns how tall it may be,
 * since only the panel knows how much room is left on the surface it sits on.
 * Render inside a bounded `flex flex-col` box.
 */
export function SearchResults({
  results,
  selectedIdx,
  onSelect,
  onHover,
  id,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  // Arrow keys move a highlight that may be past the fold; the list follows it.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLButtonElement>(`[data-idx="${selectedIdx}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx, results]);

  return (
    <>
      <div
        ref={listRef}
        id={id}
        role="listbox"
        // overscroll-contain: reaching the end of the list must not hand the
        // scroll on to the desktop underneath it.
        className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {results.length === 0 ? (
          <div
            className="py-10 text-center text-[13px]"
            style={{ color: "var(--os-text-faint)" }}
          >
            No results
          </div>
        ) : (
          <div className="p-2">
            {results.map((r, i) => {
              const active = i === selectedIdx;
              return (
                <button
                  key={`${r.node.id}:${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={active}
                  // Mouse *down* rather than click: the field loses focus the
                  // moment the pointer goes down, and the panel closes with it.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(r);
                  }}
                  onMouseEnter={() => onHover(i)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150"
                  style={{
                    background: active
                      ? "var(--os-accent-container)"
                      : "transparent",
                    color: active
                      ? "var(--os-on-accent-container)"
                      : "var(--os-text)",
                  }}
                >
                  <FileGraphic
                    icon={r.node.icon}
                    size={17}
                    className="shrink-0"
                  />
                  <span className="flex-1 truncate text-[13px]">
                    {r.node.name}
                  </span>
                  <span
                    className="hidden truncate text-[11px] md:inline"
                    style={{
                      maxWidth: 240,
                      color: active ? "inherit" : "var(--os-text-faint)",
                    }}
                  >
                    {r.absolutePath}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="flex shrink-0 items-center justify-between px-4 py-2.5 text-[11px]"
        style={{
          borderTop: "1px solid var(--os-border)",
          color: "var(--os-text-faint)",
        }}
      >
        <span>↑ ↓ navigate · ⏎ open</span>
        <span>
          {results.length} result{results.length === 1 ? "" : "s"}
        </span>
      </div>
    </>
  );
}
