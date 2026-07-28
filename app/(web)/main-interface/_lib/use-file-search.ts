"use client";
// The one search this shell has. Two places show it — the field on the desktop
// and the ⌘K panel — and both ask this hook, so a result found in one is the
// same result, found the same way, in the other.
import { useCallback, useMemo, useState } from "react";
import { desktopFileSystem } from "../_data/file-system-data";
import type { FileNode } from "@/app/shared/types/file-system";

/** A hit, carrying the path it was found at so the row can show where it lives. */
export interface SearchResult {
  node: FileNode;
  absolutePath: string;
}

/** How many hits we bother to collect: past this, refine the query. */
const MAX_RESULTS = 30;

interface Entry {
  node: FileNode;
  pathParts: string[];
}

/** Flatten the full filesystem into one searchable list. */
function collectAll(root: FileNode[]): Entry[] {
  const out: Entry[] = [];
  const recurse = (items: FileNode[], trail: string[]) => {
    for (const node of items) {
      out.push({ node, pathParts: [...trail, node.name] });
      if (node.type === "folder" && node.data?.kind === "folder") {
        recurse(node.data.children, [...trail, node.name]);
      }
    }
  };
  recurse(root, []);
  return out;
}

/** Every node in the tree, computed once for the life of the module. */
const ALL_ENTRIES = collectAll(desktopFileSystem);

/**
 * With nothing typed, the field is a launcher rather than a search: the
 * top-level programs, which is what someone opening a search on a desktop is
 * most often reaching for.
 */
const SUGGESTIONS: SearchResult[] = desktopFileSystem
  .filter((n) => n.type === "program")
  .map((node) => ({ node, absolutePath: `~/${node.name}` }));

interface Options {
  /** Chosen with ⏎ or a click. */
  onSubmit: (result: SearchResult) => void;
  /** Esc while the field has focus. */
  onEscape?: () => void;
}

/**
 * Query state, matching, and the arrow/enter behaviour that a list under a
 * field is expected to have. The caller owns *where* the results are drawn;
 * everything about *what* they are lives here.
 */
export function useFileSearch({ onSubmit, onEscape }: Options) {
  const [query, setQueryState] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUGGESTIONS;

    const matches: SearchResult[] = [];
    for (const { node, pathParts } of ALL_ENTRIES) {
      if (node.name.toLowerCase().includes(q)) {
        matches.push({ node, absolutePath: `~/${pathParts.join("/")}` });
        if (matches.length >= MAX_RESULTS) break;
      }
    }
    return matches;
  }, [query]);

  /** Typing always returns the highlight to the top of the new list. */
  const setQuery = useCallback((next: string) => {
    setQueryState(next);
    setSelectedIdx(0);
  }, []);

  const reset = useCallback(() => {
    setQueryState("");
    setSelectedIdx(0);
  }, []);

  const move = useCallback(
    (delta: number) => {
      const last = Math.max(results.length - 1, 0);
      setSelectedIdx((i) => Math.min(Math.max(i + delta, 0), last));
    },
    [results.length],
  );

  /** Attach to the input: ↑ ↓ walk the list, ⏎ opens, Esc backs out. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Enter") {
        const item = results[selectedIdx];
        if (item) {
          e.preventDefault();
          onSubmit(item);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
      }
    },
    [move, results, selectedIdx, onSubmit, onEscape],
  );

  return { query, setQuery, results, selectedIdx, setSelectedIdx, onKeyDown, reset };
}
