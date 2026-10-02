"use client";
// The file explorer, laid out like a command console: a bar with the way back,
// where you are and a search; places down the left; the folder's contents as
// numbered cards.
import { useMemo, useState } from "react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { FileIcon } from "../file-icon";
import { CoverTile } from "../cover-tile";
import { FileGraphic } from "../file-graphic";
import { PixelGlyph } from "../pixel-glyph";
import { Globe } from "../apps/ui/sheet";
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

/** The drive every place on the left lives in. */
const DRIVE_ID = "c-drive";

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
  const [query, setQuery] = useState("");

  const drive = fileSystem.find((n) => n.id === DRIVE_ID) ?? null;
  const all = childrenAt(fileSystem, path);

  // Search narrows what this folder shows, by name, as you type.
  const q = query.trim().toLowerCase();
  const children =
    all && q ? all.filter((c) => c.name.toLowerCase().includes(q)) : all;

  // A shelf of projects is browsed by its covers; any other folder is a list of
  // cards. Decided by what the folder holds, so there is nothing to toggle.
  const covers =
    children && children.length > 0 ? children.map(coverOf) : null;
  const isShelf = covers !== null && covers.every((c) => c !== null);

  const move = (next: Path) => {
    setPath(next);
    setQuery("");
  };

  const navigate = (next: Path) => {
    if (pathEquals(next, path)) return;
    setBack((b) => [...b, path]);
    move(canonicalizePath(fileSystem, next));
  };

  const goBack = () => {
    if (back.length === 0) return;
    const prev = back[back.length - 1];
    setBack((b) => b.slice(0, -1));
    move(prev);
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
    move(canonical);
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
      style={{ background: "#020a05", color: "var(--os-text)" }}
    >
      {/* ── Bar: back, where you are, and a search of this folder ────────── */}
      <header
        className="flex shrink-0 items-center gap-2 px-3 py-2"
        style={{ borderBottom: "2px solid var(--os-border-strong)" }}
      >
        <IconButton
          label={S.folder.back}
          onClick={goBack}
          disabled={back.length === 0}
        >
          <PixelGlyph sprite="back" />
        </IconButton>

        <nav
          aria-label={S.folder.breadcrumb}
          className="font-os-pixel custom-scrollbar flex h-9 min-w-0 flex-1 items-center gap-1 overflow-x-auto border-2 border-os-border-strong px-2 text-[14px]"
        >
          <Crumb active={path.length === 0} onClick={() => navigateToCrumb(-1)}>
            <PixelGlyph sprite="home" />
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

        <label className="hidden h-9 w-64 shrink-0 items-center gap-2 border-2 border-os-border-strong px-2.5 focus-within:border-os-accent @xl:flex">
          <PixelGlyph sprite="search" color="var(--os-text-faint)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder={S.folder.search}
            aria-label={S.folder.search}
            spellCheck={false}
            className="font-os-mono min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-os-text-subtle"
          />
        </label>
      </header>

      <div className="flex min-h-0 flex-1">
        {drive && (
          <Sidebar
            drive={drive}
            path={path}
            onNavigate={(next) => {
              if (pathEquals(next, path)) return;
              setBack((b) => [...b, path]);
              move(next);
            }}
          />
        )}

        {/* ── Main column ─────────────────────────────────────────────── */}
        <div className="custom-scrollbar min-w-0 flex-1 space-y-4 overflow-y-auto p-4">
          <Panel title={S.folder.contents} icon={<PixelGlyph sprite="start" />}>
            {children === null ? (
              <CenterMessage text={S.folder.notFound} />
            ) : children.length === 0 ? (
              <CenterMessage text={q ? S.folder.noMatch : S.folder.empty} />
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
              <div className="command-grid">
                {children.map((child, i) => (
                  <FileIcon
                    key={child.id}
                    index={i + 1}
                    fileNode={child}
                    onOpen={handleChildClick}
                  />
                ))}
              </div>
            )}

          </Panel>
        </div>
      </div>
    </div>
  );
}

/**
 * Places down the left: the drive, then each folder at its top — the shelves a
 * visitor jumps between — and under them a word on how this window works.
 * Shown only when the window is wide enough to spare the column.
 */
function Sidebar({
  drive,
  path,
  onNavigate,
}: {
  drive: FileNode;
  path: Path;
  onNavigate: (path: Path) => void;
}) {
  const S = useStrings();
  const { owner } = useDesktopData();
  const folders =
    drive.data?.kind === "folder"
      ? drive.data.children.filter((c) => c.data?.kind === "folder")
      : [];
  const places = [
    { node: drive, label: S.folder.all, path: [drive.name] },
    ...folders.map((f) => ({
      node: f,
      label: f.name,
      path: [drive.name, f.name],
    })),
  ];

  return (
    <aside
      className="custom-scrollbar hidden w-60 shrink-0 flex-col overflow-y-auto p-3 @3xl:flex"
      style={{ borderRight: "2px solid var(--os-border-strong)" }}
    >
      <nav aria-label={S.folder.places} className="space-y-1">
        {places.map((place, i) => {
          // The drive row is lit only on the drive itself; a folder row is lit
          // anywhere inside it.
          const active =
            i === 0
              ? pathEquals(path, place.path)
              : isPathPrefix(place.path, path);
          return (
            <button
              key={place.node.id}
              onClick={() => onNavigate(place.path)}
              aria-current={active ? "page" : undefined}
              className={`focus-ring font-os-pixel flex w-full cursor-pointer items-center gap-3 border-2 px-2.5 py-2 text-left text-[15px] ${
                active
                  ? "border-os-accent bg-os-accent-container/50 text-os-text"
                  : "border-transparent text-os-text-dim hover:bg-os-accent-container/30 hover:text-os-text"
              }`}
            >
              <FileGraphic
                icon={place.node.icon}
                size={24}
                className="pixelated"
              />
              <span className="truncate">{place.label}</span>
            </button>
          );
        })}
      </nav>

      <div
        className="mt-4 pt-4"
        style={{ borderTop: "2px solid var(--os-border-strong)" }}
      >
        <h3 className="font-os-pixel flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-os-accent">
          <PixelGlyph sprite="clock" />
          {S.folder.quickInfo}
        </h3>
        <p
          className="font-os-mono mt-2 text-[12px] leading-relaxed"
          style={{ color: "var(--os-text-dim)" }}
        >
          {S.folder.quickInfoText}
        </p>
      </div>

      <div className="mt-auto border-2 border-dashed border-os-border-strong pt-3">
        <div className="flex justify-center">
          <Globe size={110} />
        </div>
        <p
          className="font-os-mono border-t-2 border-dashed border-os-border-strong px-3 py-3 text-[12px] leading-relaxed"
          style={{ color: "var(--os-text-dim)" }}
        >
          &ldquo;{owner.tagline}&rdquo;
        </p>
      </div>
    </aside>
  );
}

/** A boxed section of the window, with its own title bar. */
function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-os-border-strong">
      <h2
        className="font-os-pixel flex items-center gap-2.5 px-3 py-2 text-[15px] text-os-text"
        style={{ borderBottom: "2px solid var(--os-border-strong)" }}
      >
        <span className="text-os-accent">{icon}</span>
        {title}
      </h2>
      <div className="p-3">{children}</div>
    </section>
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
      className="focus-ring grid h-9 w-9 shrink-0 cursor-pointer place-items-center border-2 border-os-border-strong hover:border-os-accent hover:text-os-accent disabled:cursor-default disabled:opacity-30 disabled:hover:border-os-border-strong disabled:hover:text-inherit"
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
      className="focus-ring flex shrink-0 cursor-pointer items-center gap-1 px-1 hover:bg-os-accent-container disabled:cursor-default disabled:hover:bg-transparent"
      style={{ color: active ? "var(--os-accent)" : "var(--os-text-dim)" }}
    >
      {children}
    </button>
  );
}

function CenterMessage({ text }: { text: string }) {
  return (
    <div
      className="font-os-pixel flex min-h-24 items-center justify-center text-[15px]"
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
  for (let i = 0; i < prefix.length; i++)
    if (prefix[i] !== path[i]) return false;
  return true;
}
