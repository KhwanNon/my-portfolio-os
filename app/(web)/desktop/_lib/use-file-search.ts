"use client";
// The one search this shell has. Two places show it — the field on the desktop
// and the ⌘K panel — and both ask this hook, so a result found in one is the
// same result, found the same way, in the other.
import { useCallback, useMemo, useState } from "react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useDesktopData } from "./use-desktop-data";

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

interface Index {
  entries: Entry[];
  /**
   * With nothing typed, the field is a launcher rather than a search: the
   * top-level programs, which is what someone opening a search on a desktop is
   * most often reaching for.
   */
  suggestions: SearchResult[];
}

/**
 * One index per drive, built the first time that drive is searched.
 *
 * Keyed on the tree itself rather than on the language: `desktopData` hands out
 * the same array for a given language every time, so the entry survives as long
 * as the drive it describes does, and a language nobody visits is never walked.
 */
const indexes = new WeakMap<FileNode[], Index>();

function indexOf(root: FileNode[]): Index {
  const cached = indexes.get(root);
  if (cached) return cached;

  const fresh: Index = {
    entries: collectAll(root),
    suggestions: root
      .filter((n) => n.type === "program")
      .map((node) => ({ node, absolutePath: `~/${node.name}` })),
  };
  indexes.set(root, fresh);
  return fresh;
}

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
  const { fileSystem } = useDesktopData();

  const results = useMemo<SearchResult[]>(() => {
    const { entries, suggestions } = indexOf(fileSystem);
    const q = query.trim().toLowerCase();
    if (!q) return suggestions;

    const matches: SearchResult[] = [];
    for (const { node, pathParts } of entries) {
      if (node.name.toLowerCase().includes(q)) {
        matches.push({ node, absolutePath: `~/${pathParts.join("/")}` });
        if (matches.length >= MAX_RESULTS) break;
      }
    }
    return matches;
  }, [query, fileSystem]);

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
