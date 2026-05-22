"use client";
import { useMemo, useState } from "react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { FileIcon } from "../file-icon";
import { desktopFileSystem } from "../../_data/file-system-data";
import {
  findPath,
  walkPath,
  getDisplayPath,
  canonicalizePath,
  type Path,
} from "../../_lib/path-resolver";

interface FolderRendererProps {
  fileNode: FileNode;
}

function childrenAt(path: Path): FileNode[] | null {
  const walked = walkPath(desktopFileSystem, path);
  if (!walked) return null;
  if (walked.kind === "root") return walked.children;
  if (walked.node.type === "folder" && walked.node.data?.kind === "folder") {
    return walked.node.data.children;
  }
  return null;
}

export function FolderRenderer({ fileNode }: FolderRendererProps) {
  const { openFile } = useWindowManager();

  // Resolve the folder's absolute path on mount; fall back to root if missing.
  const initialPath = useMemo<Path>(
    () => findPath(desktopFileSystem, fileNode.id) ?? [],
    [fileNode.id],
  );

  const [path, setPath] = useState<Path>(initialPath);
  const [back, setBack] = useState<Path[]>([]);

  const displayPath = getDisplayPath(desktopFileSystem, path);
  const children = childrenAt(path);

  const navigate = (next: Path) => {
    if (pathEquals(next, path)) return;
    setBack((b) => [...b, path]);
    setPath(canonicalizePath(desktopFileSystem, next));
  };

  const goBack = () => {
    if (back.length === 0) return;
    const prev = back[back.length - 1];
    setBack((b) => b.slice(0, -1));
    setPath(prev);
  };

  const navigateToCrumb = (idx: number) => {
    // idx -1 = root, 0..n-1 = path[idx]
    const target = idx < 0 ? [] : path.slice(0, idx + 1);
    if (pathEquals(target, path)) return;
    const canonical = canonicalizePath(desktopFileSystem, target);
    // Breadcrumbs always go up. Drop back-stack entries that sit inside the
    // subtree we're leaving — otherwise "back" would jump forward into the
    // deeper folder we just navigated up from.
    setBack((b) => b.filter((entry) => !isPathPrefix(canonical, entry)));
    setPath(canonical);
  };

  const handleChildClick = (child: FileNode) => {
    if (child.type === "folder" && child.data?.kind === "folder") {
      navigate([...path, child.name]);
    } else if (child.type === "link" && child.data?.kind === "link") {
      window.open(child.data.url, "_blank", "noopener,noreferrer");
    } else {
      openFile(child);
    }
  };

  const accent = "var(--os-accent)";

  return (
    <div
      className="h-full w-full flex flex-col font-os-mono"
      style={{ background: "var(--os-surface)" }}
    >
      {/* Toolbar — back button + clickable breadcrumbs */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{
          borderBottom: "1px solid rgba(82,211,214,0.15)",
          background: "var(--os-header)",
          minHeight: 40,
        }}
      >
        <button
          onClick={goBack}
          disabled={back.length === 0}
          title="Back"
          className="px-2 py-0.5 text-[10px] tracking-widest rounded-sm transition-opacity disabled:opacity-20 hover:opacity-100 opacity-60 cursor-pointer shrink-0"
          style={{
            border: "1px solid rgba(82,211,214,0.25)",
            color: accent,
            background: "transparent",
          }}
        >
          ◀
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 min-w-0 overflow-x-auto text-[11px] tracking-widest">
          <button
            onClick={() => navigateToCrumb(-1)}
            disabled={path.length === 0}
            className="uppercase hover:underline cursor-pointer shrink-0 disabled:no-underline disabled:cursor-default"
            style={{
              color: accent,
              opacity: path.length === 0 ? 1 : 0.55,
              fontWeight: path.length === 0 ? "bold" : "normal",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            ~
          </button>
          {path.map((seg, i) => {
            const isLast = i === path.length - 1;
            return (
              <span key={i} className="inline-flex items-center gap-1 shrink-0">
                <span className="opacity-30" style={{ color: accent }}>
                  /
                </span>
                <button
                  onClick={() => navigateToCrumb(i)}
                  disabled={isLast}
                  className="uppercase hover:underline cursor-pointer disabled:no-underline disabled:cursor-default truncate max-w-35"
                  style={{
                    color: accent,
                    opacity: isLast ? 1 : 0.55,
                    fontWeight: isLast ? "bold" : "normal",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  {seg}
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* File grid */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4">
        {children === null ? (
          <CenterMessage text="PATH_NOT_FOUND" />
        ) : children.length === 0 ? (
          <CenterMessage text="FOLDER_EMPTY" />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, max-content)",
              gap: 8,
              justifyContent: "start",
            }}
          >
            {children.map((child) => (
              <FileIcon
                key={child.id}
                fileNode={child}
                onOpen={handleChildClick}
                variant="folder"
              />
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-3 py-1 shrink-0 text-[10px] tracking-widest opacity-50"
        style={{
          borderTop: "1px solid rgba(82,211,214,0.1)",
          color: "var(--os-accent)",
        }}
      >
        <span>
          {children?.length ?? 0} item{children?.length === 1 ? "" : "s"}
        </span>
        <span className="uppercase truncate ml-4">{displayPath}</span>
      </div>
    </div>
  );
}

function CenterMessage({ text }: { text: string }) {
  return (
    <div
      className="flex items-center justify-center h-full text-xs tracking-widest opacity-30"
      style={{ color: "var(--os-accent)" }}
    >
      {text}
    </div>
  );
}

function pathEquals(a: Path, b: Path) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** True when `prefix` is an ancestor of (or equal to) `path`. */
function isPathPrefix(prefix: Path, path: Path) {
  if (path.length < prefix.length) return false;
  for (let i = 0; i < prefix.length; i++) if (prefix[i] !== path[i]) return false;
  return true;
}
