import type { FileNode } from "@/app/shared/types/file-system";

// A path is a list of folder segments from root. Root itself is the empty array.
export type Path = string[];

export type WalkResult =
  | { kind: "root"; children: FileNode[] }
  | { kind: "node"; node: FileNode; parentChildren: FileNode[] };

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-");
}

function matches(child: FileNode, segment: string): boolean {
  return (
    child.name.toLowerCase() === segment.toLowerCase() ||
    normalize(child.name) === normalize(segment)
  );
}

function collapse(base: Path, segments: string[]): Path {
  const out = [...base];
  for (const seg of segments) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") {
      out.pop();
      continue;
    }
    out.push(seg);
  }
  return out;
}

/**
 * Resolve a textual path against the current working directory.
 * Handles ~, /, .., ., trailing slashes, and nested segments.
 * Empty result = root.
 */
export function resolvePath(cwd: Path, input: string): Path {
  const trimmed = input.trim();
  if (trimmed === "" || trimmed === "~" || trimmed === "/") return [];

  if (trimmed.startsWith("~/") || trimmed.startsWith("/")) {
    const rest = trimmed.startsWith("~/") ? trimmed.slice(2) : trimmed.slice(1);
    return collapse([], rest.split("/"));
  }
  return collapse([...cwd], trimmed.split("/"));
}

/**
 * Walk a path in the tree. Returns null if a segment doesn't resolve
 * or if traversal goes through a non-folder.
 */
export function walkPath(root: FileNode[], path: Path): WalkResult | null {
  if (path.length === 0) return { kind: "root", children: root };

  let currentChildren = root;
  for (let i = 0; i < path.length; i++) {
    const seg = path[i];
    const found = currentChildren.find((c) => matches(c, seg));
    if (!found) return null;

    if (i === path.length - 1) {
      return { kind: "node", node: found, parentChildren: currentChildren };
    }
    if (found.type !== "folder" || found.data?.kind !== "folder") return null;
    currentChildren = found.data.children;
  }
  return null;
}

/**
 * Replace each segment in `path` with the canonical (case-preserved) node name.
 * Stops at the first unresolved or non-folder segment, keeping the rest as typed.
 */
export function canonicalizePath(root: FileNode[], path: Path): Path {
  const out: string[] = [];
  let children = root;
  for (const seg of path) {
    const found = children.find((c) => matches(c, seg));
    if (!found) {
      out.push(seg);
      return out;
    }
    out.push(found.name);
    if (found.type === "folder" && found.data?.kind === "folder") {
      children = found.data.children;
    } else {
      return out;
    }
  }
  return out;
}

/** Human-readable path string. Root → "~", otherwise "~/segment/segment". */
export function getDisplayPath(root: FileNode[], path: Path): string {
  if (path.length === 0) return "~";
  return "~/" + canonicalizePath(root, path).join("/");
}

export interface CompletionContext {
  /** Children of the directory the user is completing inside. */
  directoryChildren: FileNode[];
  /** The partial segment being completed (may be empty). */
  partial: string;
  /** Input prefix that comes before the partial. */
  prefixBeforePartial: string;
}

/**
 * Split the input into (dir prefix, partial) for tab completion.
 * Returns null if the dir prefix doesn't resolve to a folder.
 */
export function getCompletionContext(
  root: FileNode[],
  cwd: Path,
  input: string,
): CompletionContext | null {
  // The token being completed is everything after the last whitespace.
  const wsMatch = input.match(/\s(\S*)$/);
  const lastToken = wsMatch ? wsMatch[1] : input;

  const slashIdx = lastToken.lastIndexOf("/");
  const dirPart = slashIdx === -1 ? "" : lastToken.slice(0, slashIdx + 1);
  const partial = slashIdx === -1 ? lastToken : lastToken.slice(slashIdx + 1);

  const dirPath = dirPart === "" ? cwd : resolvePath(cwd, dirPart);
  const walked = walkPath(root, dirPath);
  if (!walked) return null;

  let children: FileNode[];
  if (walked.kind === "root") {
    children = walked.children;
  } else if (
    walked.node.type === "folder" &&
    walked.node.data?.kind === "folder"
  ) {
    children = walked.node.data.children;
  } else {
    return null;
  }

  return {
    directoryChildren: children,
    partial,
    prefixBeforePartial: input.slice(0, input.length - partial.length),
  };
}

/**
 * Filter children by a partial segment. Case-insensitive, space/dash-equivalent.
 */
export function matchPartial(
  children: FileNode[],
  partial: string,
): FileNode[] {
  const p = partial.toLowerCase();
  const pNorm = normalize(partial);
  return children.filter((c) => {
    const name = c.name.toLowerCase();
    return name.startsWith(p) || normalize(c.name).startsWith(pNorm);
  });
}

/**
 * Find the absolute path (in canonical names) of the first node matching `nodeId`.
 * Returns null if not found. Folder ids are globally unique in the data model.
 */
export function findPath(root: FileNode[], nodeId: string): Path | null {
  function walk(children: FileNode[], trail: Path): Path | null {
    for (const c of children) {
      if (c.id === nodeId) return [...trail, c.name];
      if (c.type === "folder" && c.data?.kind === "folder") {
        const hit = walk(c.data.children, [...trail, c.name]);
        if (hit) return hit;
      }
    }
    return null;
  }
  return walk(root, []);
}
