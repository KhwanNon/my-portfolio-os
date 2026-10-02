"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { FileGraphic } from "../file-graphic";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { FileIcon } from "../file-icon";
import { CoverTile } from "../cover-tile";
import { coverOf } from "../../_lib/cover";
import { useDesktopData } from "../../_lib/use-desktop-data";
import {
  findPath,
  walkPath,
  canonicalizePath,
  type Path,
} from "../../_lib/path-resolver";

interface FolderRendererProps {
  fileNode: FileNode;
}

/** What a folder window shows for a given path, or null where nothing lives. */
function childrenAt(tree: FileNode[], path: Path): FileNode[] | null {
  const walked = walkPath(tree, path);
  if (!walked) return null;
  if (walked.kind === "root") return walked.children;

  const { node } = walked;
  return node.type === "folder" && node.data?.kind === "folder"
    ? node.data.children
    : null;
}

/** A shortcut down the left edge: where it goes, and what to call it. */
interface Place {
  node: FileNode | null;
  label: string;
  path: Path;
}

/**
 * The places worth jumping to: home, then every folder on the drive's top level
 * and the folders one level inside the drive — which is where the work lives.
 * Derived from the tree, so a folder added to the drive turns up here on its own.
 */
function placesOf(tree: FileNode[], home: string): Place[] {
  const places: Place[] = [{ node: null, label: home, path: [] }];
  const folders = (nodes: FileNode[]) =>
    nodes.filter(
      (n): n is FileNode & { data: { kind: "folder"; children: FileNode[] } } =>
        n.type === "folder" && n.data?.kind === "folder",
    );
  for (const top of folders(tree)) {
    places.push({ node: top, label: top.name, path: [top.name] });
    // The drive is the one folder whose children are places in their own right.
    if (top.icon === "cdrive") {
      for (const inner of folders(top.data.children)) {
        places.push({
          node: inner,
          label: inner.name,
          path: [top.name, inner.name],
        });
      }
    }
  }
  return places;
}

export function FolderRenderer({ fileNode }: FolderRendererProps) {
  const { openFile } = useWindowManager();
  const { fileSystem } = useDesktopData();
  const S = useStrings();

  // Resolve the folder's absolute path on mount; fall back to root if missing.
  const initialPath = useMemo<Path>(
    () => findPath(fileSystem, fileNode.id) ?? [],
    [fileSystem, fileNode.id],
  );

  const [path, setPath] = useState<Path>(initialPath);
  const [back, setBack] = useState<Path[]>([]);

  const children = childrenAt(fileSystem, path);
  // A shelf of projects is browsed by its covers; any other folder is a list of
  // names. Decided by what the folder holds, so there is nothing to toggle.
  const covers =
    children && children.length > 0
      ? children.map(coverOf)
      : null;
  const isShelf = covers !== null && covers.every((c) => c !== null);
  const places = useMemo(
    () => placesOf(fileSystem, S.folder.home),
    [fileSystem, S.folder.home],
  );

  const navigate = (next: Path) => {
    if (pathEquals(next, path)) return;
    setBack((b) => [...b, path]);
    setPath(canonicalizePath(fileSystem, next));
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
    const canonical = canonicalizePath(fileSystem, target);
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
      className="@container flex h-full w-full flex-col"
      style={{ background: "transparent" }}
    >
      {/* One row: where you were, where you are, and how you'd like to see it.
          The window's own title bar already names the folder, so the path is
          the only label the contents need — and it sits where the reader is
          already looking after pressing Back. */}
      <header
        className="flex shrink-0 items-center gap-2 px-4 py-3"
        style={{
          background: "var(--os-surface-1)",
          borderBottom: "1px solid var(--os-border)",
        }}
      >
        <IconButton
          label={S.folder.back}
          onClick={goBack}
          disabled={back.length === 0}
        >
          <ArrowLeft size={17} strokeWidth={1.8} />
        </IconButton>

        <nav
          aria-label={S.folder.breadcrumb}
          className="font-os-mono custom-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-[12px]"
        >
          <Crumb active={path.length === 0} onClick={() => navigateToCrumb(-1)}>
            <Home size={13} strokeWidth={1.9} />
            <span className="font-os-mono">~</span>
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

      </header>

      <div className="flex min-h-0 flex-1">
      {/* Places: shown once the window is wide enough to spare the room. */}
      <aside
        aria-label={S.folder.places}
        className="custom-scrollbar hidden w-44 shrink-0 overflow-y-auto py-3 @xl:block"
        style={{
          background: "var(--os-surface-1)",
          borderRight: "1px solid var(--os-border)",
        }}
      >
        <h2
          className="font-os-mono px-4 pb-2 text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "var(--os-text-subtle)" }}
        >
          {S.folder.places}
        </h2>
        {places.map((place) => {
          const here = pathEquals(place.path, path);
          return (
            <button
              key={place.path.join("/") || "~"}
              onClick={() => navigate(place.path)}
              aria-current={here ? "page" : undefined}
              className="focus-ring font-os-mono flex w-full cursor-pointer items-center gap-2.5 px-4 py-1.5 text-left text-[12px] transition-colors duration-150 hover:bg-os-accent/10"
              style={{
                color: here ? "var(--os-accent)" : "var(--os-text-dim)",
                background: here ? "rgba(85,255,136,0.08)" : undefined,
                borderLeft: `2px solid ${here ? "var(--os-accent)" : "transparent"}`,
              }}
            >
              {place.node ? (
                <FileGraphic icon={place.node.icon} size={16} />
              ) : (
                <Home size={15} strokeWidth={1.8} />
              )}
              <span className="truncate">{place.label}</span>
            </button>
          );
        })}
      </aside>

      {/* Contents */}
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
        {children === null ? (
          <CenterMessage text={S.folder.notFound} />
        ) : children.length === 0 ? (
          <CenterMessage text={S.folder.empty} />
        ) : isShelf ? (
          <div className="cover-grid">
            {children.map((child, i) => (
              <CoverTile
                key={child.id}
                node={child}
                src={covers![i]!}
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
      className="focus-ring grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-sm transition-colors duration-200 hover:bg-os-accent/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
      style={{ color: "var(--os-text-dim)" }}
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
      className="focus-ring flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors duration-150 hover:bg-os-accent/10 disabled:cursor-default disabled:hover:bg-transparent"
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
