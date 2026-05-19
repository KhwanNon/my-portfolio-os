"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { desktopFileSystem } from "../_data/file-system-data";
import type { FileNode } from "@/app/shared/types/file-system";

interface Entry {
  node: FileNode;
  pathParts: string[];
}

interface Result {
  node: FileNode;
  category: "folder" | "app" | "file";
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

function categorise(node: FileNode): Result["category"] {
  if (node.type === "folder") return "folder";
  if (node.type === "program") return "app";
  return "file";
}

function iconFor(r: Result) {
  if (r.category === "folder") return "📁";
  if (r.category === "app") return "⚡";
  if (r.node.type === "link") return "🔗";
  if (r.node.type === "pdf") return "📑";
  if (r.node.type === "slide") return "🖼";
  return "📄";
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
        .map((node) => ({
          node,
          category: categorise(node),
          absolutePath: `~/${node.name}`,
        }));
    }
    const matches: Result[] = [];
    for (const { node, pathParts } of allEntries) {
      if (node.name.toLowerCase().includes(q)) {
        matches.push({
          node,
          category: categorise(node),
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
          className="fixed inset-0 flex items-start justify-center pt-16 sm:pt-32 font-os-mono"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
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
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="w-full max-w-xl mx-4 rounded-sm overflow-hidden"
            style={{
              background: "var(--os-surface)",
              border: "1px solid rgba(82,211,214,0.4)",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(82,211,214,0.18), 0 0 60px rgba(82,211,214,0.08)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Search input row */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(82,211,214,0.18)" }}
            >
              <span
                className="text-xs opacity-60 tracking-widest"
                style={{ color: "var(--os-accent)" }}
              >
                ›_
              </span>
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
                className="flex-1 bg-transparent outline-none text-sm tracking-wider"
                style={{ color: "var(--os-accent)" }}
              />
              <kbd
                className="text-[9px] opacity-40 tracking-widest px-1.5 py-0.5 rounded-sm"
                style={{
                  color: "var(--os-accent)",
                  border: "1px solid rgba(82,211,214,0.25)",
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
                  className="py-12 text-center text-xs opacity-40 tracking-widest"
                  style={{ color: "var(--os-accent)" }}
                >
                  NO_RESULTS
                </div>
              ) : (
                results.map((r, i) => {
                  const active = i === selectedIdx;
                  return (
                    <button
                      key={r.node.id + ":" + i}
                      data-idx={i}
                      onClick={() => submit(r)}
                      onMouseEnter={() => setSelectedIdx(i)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer"
                      style={{
                        background: active
                          ? "rgba(82,211,214,0.13)"
                          : "transparent",
                        color: "var(--os-accent)",
                        borderLeft: `2px solid ${active ? "var(--os-accent)" : "transparent"}`,
                      }}
                    >
                      <span className="text-base w-5 text-center opacity-80">
                        {iconFor(r)}
                      </span>
                      <span className="flex-1 truncate text-sm">
                        {r.node.name}
                      </span>
                      <span className="hidden sm:inline text-[9px] opacity-40 tracking-widest uppercase">
                        {r.category}
                      </span>
                      <span
                        className="hidden md:inline text-[10px] opacity-35 truncate"
                        style={{ maxWidth: 260 }}
                      >
                        {r.absolutePath}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div
              className="flex items-center justify-between px-4 py-2 text-[10px] opacity-55 tracking-widest"
              style={{
                borderTop: "1px solid rgba(82,211,214,0.12)",
                color: "var(--os-accent)",
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
