"use client";
import { useMemo, useState } from "react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { FileIcon } from "../file-icon";
import { desktopFileSystem } from "../../_data/file-system-data";
import {
  findPath,
  walkPath,
  resolvePath,
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
  const [forward, setForward] = useState<Path[]>([]);

  const [editing, setEditing] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [addressInvalid, setAddressInvalid] = useState(false);

  const displayPath = getDisplayPath(desktopFileSystem, path);
  const children = childrenAt(path);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const navigate = (next: Path) => {
    if (pathEquals(next, path)) return;
    setBack((b) => [...b, path]);
    setForward([]);
    setPath(canonicalizePath(desktopFileSystem, next));
  };

  const goBack = () => {
    if (back.length === 0) return;
    const prev = back[back.length - 1];
    setBack((b) => b.slice(0, -1));
    setForward((f) => [...f, path]);
    setPath(prev);
  };

  const goForward = () => {
    if (forward.length === 0) return;
    const next = forward[forward.length - 1];
    setForward((f) => f.slice(0, -1));
    setBack((b) => [...b, path]);
    setPath(next);
  };

  const goUp = () => {
    if (path.length === 0) return;
    navigate(path.slice(0, -1));
  };

  const navigateToCrumb = (idx: number) => {
    // idx -1 = root, 0..n-1 = path[idx]
    navigate(idx < 0 ? [] : path.slice(0, idx + 1));
  };

  // ── Address bar ────────────────────────────────────────────────────────────

  const beginEdit = () => {
    setAddressInput(displayPath);
    setAddressInvalid(false);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setAddressInvalid(false);
  };

  const submitAddress = () => {
    const target = resolvePath([], addressInput);
    const walked = walkPath(desktopFileSystem, target);
    const isFolder =
      walked?.kind === "root" ||
      (walked?.kind === "node" &&
        walked.node.type === "folder" &&
        walked.node.data?.kind === "folder");
    if (!isFolder) {
      setAddressInvalid(true);
      return;
    }
    navigate(target);
    setEditing(false);
    setAddressInvalid(false);
  };

  // ── Child click ────────────────────────────────────────────────────────────

  const handleChildClick = (child: FileNode) => {
    if (child.type === "folder" && child.data?.kind === "folder") {
      navigate([...path, child.name]);
    } else if (child.type === "link" && child.data?.kind === "link") {
      window.open(child.data.url, "_blank", "noopener,noreferrer");
    } else {
      openFile(child);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const accent = "var(--os-accent)";

  return (
    <div
      className="h-full w-full flex flex-col font-os-mono"
      style={{ background: "var(--os-surface)" }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-1.5 px-2 py-2 shrink-0"
        style={{
          borderBottom: "1px solid rgba(82,211,214,0.15)",
          background: "var(--os-header)",
          minHeight: 40,
        }}
      >
        <NavButton onClick={goBack} disabled={back.length === 0} label="◀" title="Back" />
        <NavButton onClick={goForward} disabled={forward.length === 0} label="▶" title="Forward" />
        <NavButton onClick={goUp} disabled={path.length === 0} label="▲" title="Up" />

        {/* Address bar */}
        <div
          className="flex-1 min-w-0 ml-1 px-2 py-1 rounded-sm"
          style={{
            border: `1px solid ${addressInvalid ? "rgba(255,107,107,0.6)" : "rgba(82,211,214,0.25)"}`,
            background: "rgba(0,0,0,0.25)",
          }}
        >
          {editing ? (
            <input
              autoFocus
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                if (addressInvalid) setAddressInvalid(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitAddress();
                else if (e.key === "Escape") cancelEdit();
              }}
              onBlur={cancelEdit}
              spellCheck={false}
              autoComplete="off"
              className="w-full bg-transparent outline-none text-[11px] tracking-wider"
              style={{ color: accent }}
            />
          ) : (
            <div
              onClick={beginEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") beginEdit();
              }}
              role="textbox"
              tabIndex={0}
              className="w-full text-left text-[11px] tracking-wider truncate cursor-text outline-none"
              style={{ color: accent }}
              title="Click to edit path"
            >
              {renderBreadcrumb(path, navigateToCrumb)}
            </div>
          )}
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
          color: accent,
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

// ─── Subcomponents ────────────────────────────────────────────────────────────

function NavButton({
  onClick,
  disabled,
  label,
  title,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="px-2 py-0.5 text-[10px] tracking-widest rounded-sm transition-opacity disabled:opacity-20 hover:opacity-100 opacity-60 cursor-pointer shrink-0"
      style={{
        border: "1px solid rgba(82,211,214,0.25)",
        color: "var(--os-accent)",
        background: "transparent",
      }}
    >
      {label}
    </button>
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

function renderBreadcrumb(path: Path, onClick: (idx: number) => void) {
  // Visible as buttons inside the address bar's idle state.
  const accent = "var(--os-accent)";
  return (
    <span className="inline-flex items-center gap-1">
      <span
        onClick={(e) => {
          e.stopPropagation();
          onClick(-1);
        }}
        className="uppercase hover:underline cursor-pointer"
        style={{ color: accent, opacity: path.length === 0 ? 1 : 0.6 }}
      >
        ~
      </span>
      {path.map((seg, i) => {
        const isLast = i === path.length - 1;
        return (
          <span key={i} className="inline-flex items-center gap-1">
            <span className="opacity-30" style={{ color: accent }}>
              /
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClick(i);
              }}
              className="uppercase hover:underline cursor-pointer"
              style={{
                color: accent,
                opacity: isLast ? 1 : 0.6,
                fontWeight: isLast ? "bold" : "normal",
              }}
            >
              {seg}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function pathEquals(a: Path, b: Path) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
