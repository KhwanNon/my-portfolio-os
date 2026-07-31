"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, Home, LayoutGrid, List } from "lucide-react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { FileIcon } from "../file-icon";
import { desktopFileSystem } from "../../_data/file-system-data";
import {
  findPath,
  walkPath,
  canonicalizePath,
  type Path,
} from "../../_lib/path-resolver";

interface FolderRendererProps {
  fileNode: FileNode;
}

type ViewMode = "grid" | "list";

/** What a folder window shows for a given path, or null where nothing lives. */
function childrenAt(path: Path): FileNode[] | null {
  const walked = walkPath(desktopFileSystem, path);
  if (!walked) return null;
  if (walked.kind === "root") return walked.children;

  const { node } = walked;
  return node.type === "folder" && node.data?.kind === "folder"
    ? node.data.children
    : null;
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
  // List by default: a folder here holds a handful of named things to read, not
  // artwork to browse, and the dense rows put the whole shelf on screen at once.
  const [view, setView] = useState<ViewMode>("list");

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

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{ background: "var(--os-surface)" }}
    >
      {/* One row: where you were, where you are, and how you'd like to see it.
          The window's own title bar already names the folder, so the path is
          the only label the contents need — and it sits where the reader is
          already looking after pressing Back. */}
      <header
        className="flex shrink-0 items-center gap-2 px-4 py-3"
        style={{
          background: "var(--os-header)",
          borderBottom: "1px solid var(--os-border)",
        }}
      >
        <IconButton label="Back" onClick={goBack} disabled={back.length === 0}>
          <ArrowLeft size={17} strokeWidth={1.8} />
        </IconButton>

        <nav
          aria-label="Breadcrumb"
          className="custom-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-[13px]"
        >
          <Crumb active={path.length === 0} onClick={() => navigateToCrumb(-1)}>
            <Home size={13} strokeWidth={1.9} />
            <span>~</span>
          </Crumb>
          {path.map((seg, i) => (
            <span key={i} className="flex shrink-0 items-center gap-1">
              <span style={{ color: "var(--os-text-faint)" }}>/</span>
              <Crumb
                active={i === path.length - 1}
                onClick={() => navigateToCrumb(i)}
              >
                <span className="max-w-40 truncate">{seg}</span>
              </Crumb>
            </span>
          ))}
        </nav>

        <div
          className="flex shrink-0 items-center gap-0.5 rounded-full p-1"
          style={{ background: "var(--os-surface-3)" }}
        >
          <ViewButton
            label="Grid view"
            active={view === "grid"}
            onClick={() => setView("grid")}
          >
            <LayoutGrid size={15} strokeWidth={1.8} />
          </ViewButton>
          <ViewButton
            label="List view"
            active={view === "list"}
            onClick={() => setView("list")}
          >
            <List size={15} strokeWidth={1.8} />
          </ViewButton>
        </div>
      </header>

      {/* Contents */}
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-5">
        {children === null ? (
          <CenterMessage text="Path not found" />
        ) : children.length === 0 ? (
          <CenterMessage text="This folder is empty" />
        ) : view === "grid" ? (
          <div className="file-grid">
            {children.map((child) => (
              <FileIcon
                key={child.id}
                fileNode={child}
                layout="card"
                onOpen={handleChildClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {children.map((child) => (
              <FileIcon
                key={child.id}
                fileNode={child}
                layout="row"
                onOpen={handleChildClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="focus-ring grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-200 hover:bg-os-surface-3 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
      style={{ color: "var(--os-text-dim)" }}
    >
      {children}
    </button>
  );
}

function ViewButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className="focus-ring grid h-7 w-7 cursor-pointer place-items-center rounded-full transition-colors duration-200"
      style={{
        background: active ? "var(--os-surface-1)" : "transparent",
        boxShadow: active ? "var(--shadow-1)" : "none",
        color: active ? "var(--os-accent)" : "var(--os-text-faint)",
      }}
    >
      {children}
    </button>
  );
}

function Crumb({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={active}
      className="focus-ring flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors duration-150 hover:bg-os-surface-3 disabled:cursor-default disabled:hover:bg-transparent"
      style={{
        color: active ? "var(--os-accent)" : "var(--os-text-dim)",
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
    </button>
  );
}

function CenterMessage({ text }: { text: string }) {
  return (
    <div
      className="flex h-full items-center justify-center text-[13px]"
      style={{ color: "var(--os-text-faint)" }}
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
