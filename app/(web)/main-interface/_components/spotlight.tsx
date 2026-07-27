"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { desktopFileSystem } from "../_data/file-system-data";
import type { FileNode } from "@/app/shared/types/file-system";
import { SPRING_EXPRESSIVE } from "@/app/shared/constants/motion";
import { FileGraphic } from "./file-graphic";

interface Entry {
  node: FileNode;
  pathParts: string[];
}

interface Result {
  node: FileNode;
  absolutePath: string;
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

export function Spotlight() {
  const { openFile } = useWindowManager();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allEntries = useMemo(() => collectAll(desktopFileSystem), []);

  const results: Result[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Empty query: show top-level programs as quick launchers.
      return desktopFileSystem
        .filter((n) => n.type === "program")
        .map((node) => ({ node, absolutePath: `~/${node.name}` }));
    }
    const matches: Result[] = [];
    for (const { node, pathParts } of allEntries) {
      if (node.name.toLowerCase().includes(q)) {
        matches.push({
          node,
          absolutePath:
            pathParts.length === 0 ? "~" : `~/${pathParts.join("/")}`,
        });
      }
      if (matches.length >= 30) break;
    }
    return matches;
  }, [query, allEntries]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIdx(0);
  }, []);

  const submit = useCallback(
    (item: Result) => {
      openFile(item.node);
      close();
    },
    [openFile, close],
  );

  // ── Global keyboard + custom event ─────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Toggle (or open) with Cmd/Ctrl+K
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = results[selectedIdx];
        if (item) submit(item);
      }
    };
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener("keydown", onKey);
    window.addEventListener("spotlight:toggle", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("spotlight:toggle", onToggle);
    };
  }, [open, results, selectedIdx, submit, close]);

  // Focus the input the moment we open
  useEffect(() => {
    if (open) {
      // requestAnimationFrame so motion has mounted the element
      const t = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(t);
    }
  }, [open]);

  // Keep the selected item in view
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-idx="${selectedIdx}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="spotlight-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 flex items-start justify-center pt-16 sm:pt-28"
          style={{
            background: "rgba(32,33,36,0.32)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            zIndex: 9500,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            key="spotlight-panel"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={SPRING_EXPRESSIVE}
            className="mx-4 w-full max-w-xl overflow-hidden rounded-xl"
            style={{
              background: "var(--os-surface-1)",
              border: "1px solid var(--os-border)",
              boxShadow: "var(--shadow-3)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Search input row */}
            <div
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: "1px solid var(--os-border)" }}
            >
              <Search
                size={18}
                strokeWidth={1.8}
                style={{ color: "var(--os-text-dim)" }}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIdx(0);
                }}
                placeholder="Search files, folders, apps…"
                spellCheck={false}
                autoComplete="off"
                className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-os-text-faint"
                style={{ color: "var(--os-text)" }}
              />
              <kbd
                className="rounded-md px-1.5 py-0.5 text-[11px] font-medium"
                style={{
                  color: "var(--os-text-faint)",
                  border: "1px solid var(--os-border)",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-96 overflow-y-auto custom-scrollbar"
            >
              {results.length === 0 ? (
                <div
                  className="py-12 text-center text-[13px]"
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
                        key={r.node.id + ":" + i}
                        data-idx={i}
                        onClick={() => submit(r)}
                        onMouseEnter={() => setSelectedIdx(i)}
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
                            color: active
                              ? "inherit"
                              : "var(--os-text-faint)",
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

            {/* Footer hints */}
            <div
              className="flex items-center justify-between px-4 py-2.5 text-[11px]"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
