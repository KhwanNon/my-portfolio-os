import type { FileNode } from "@/app/shared/types/file-system";
import { walkPath, type Path } from "./path-resolver";

// ─── Deterministic mock metadata (so `ls -l` looks real) ─────────────────────

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function fakeDate(node: FileNode): string {
  const days = hash(node.id) % 365;
  const d = new Date(2024, 0, 1 + days);
  const mo = MONTHS[d.getMonth()];
  const day = String(d.getDate()).padStart(2, " ");
  return `${mo} ${day}  ${d.getFullYear()}`;
}

export function fakeSize(node: FileNode): number {
  if (node.type === "folder" && node.data?.kind === "folder") {
    return node.data.children.length * 4096;
  }
  if (node.type === "txt" && node.data?.kind === "txt") {
    return node.data.content.length;
  }
  if (node.type === "slide" && node.data?.kind === "slide") {
    return node.data.images.length * 256 * 1024;
  }
  if (node.type === "pdf") return 124 * 1024;
  if (node.type === "ui") return 2 * 1024;
  if (node.type === "link") return 256;
  if (node.type === "program") return 16 * 1024;
  return 1024;
}

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`.padStart(6);
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`.padStart(6);
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}M`.padStart(6);
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}G`.padStart(6);
}

export function permString(node: FileNode): string {
  return (node.type === "folder" ? "d" : "-") + "rwxr-xr-x";
}

// ─── tree ─────────────────────────────────────────────────────────────────────

export function buildTree(
  rootName: string,
  children: FileNode[],
  maxDepth: number = 3,
): string[] {
  const lines: string[] = [rootName];
  function recurse(items: FileNode[], prefix: string, depth: number) {
    if (depth >= maxDepth) return;
    const sorted = [
      ...items.filter((c) => c.type === "folder"),
      ...items.filter((c) => c.type !== "folder"),
    ];
    sorted.forEach((c, i) => {
      const last = i === sorted.length - 1;
      lines.push(`${prefix}${last ? "└── " : "├── "}${c.name}`);
      if (c.type === "folder" && c.data?.kind === "folder") {
        recurse(c.data.children, prefix + (last ? "    " : "│   "), depth + 1);
      }
    });
  }
  recurse(children, "", 0);
  return lines;
}

// ─── find ────────────────────────────────────────────────────────────────────

export function findByName(
  startPath: Path,
  startChildren: FileNode[],
  needle: string,
): string[] {
  const matches: string[] = [];
  const lower = needle.toLowerCase();
  const root = startPath.length === 0 ? "~" : `~/${startPath.join("/")}`;

  function recurse(items: FileNode[], prefix: string) {
    for (const c of items) {
      const full = `${prefix}/${c.name}`;
      if (c.name.toLowerCase().includes(lower)) matches.push(full);
      if (c.type === "folder" && c.data?.kind === "folder") {
        recurse(c.data.children, full);
      }
    }
  }
  recurse(startChildren, root);
  return matches;
}

// ─── cowsay ──────────────────────────────────────────────────────────────────

export function cowsay(text: string): string[] {
  const t = text.trim() || "Moo.";
  const border = "─".repeat(t.length + 2);
  return [
    ` ┌${border}┐`,
    ` │ ${t} │`,
    ` └${border}┘`,
    "         \\   ^__^",
    "          \\  (oo)\\_______",
    "             (__)\\       )\\/\\",
    "                 ||----w |",
    "                 ||     ||",
  ];
}

// ─── Manual pages ────────────────────────────────────────────────────────────

export const MAN_PAGES: Record<string, string> = {
  cd:       "cd <path>\n  Change the current directory. Supports ~, /, .., ., relative and nested paths.",
  ls:       "ls [-l] [-a] [path]\n  List directory contents.\n    -l   Long listing (perm, size, date).\n    -a   Show all entries.",
  pwd:      "pwd\n  Print the absolute path of the current directory.",
  cat:      "cat <path>\n  Print the contents of a .txt file.",
  open:     "open <path>\n  Open any file in the GUI window manager.",
  tree:     "tree [path]\n  Print a directory tree (depth = 3 by default).",
  find:     "find <name> [path]\n  Recursively find entries whose name contains <name> (case-insensitive).",
  head:     "head [-n N] <path>\n  Print the first N lines of a .txt file (default 10).",
  tail:     "tail [-n N] <path>\n  Print the last N lines of a .txt file (default 10).",
  echo:     "echo <text>\n  Print text back to the terminal.",
  date:     "date\n  Print the current local date and time.",
  uptime:   "uptime\n  Show how long this terminal session has been alive.",
  history:  "history\n  Show recently executed commands.",
  which:    "which <command>\n  Show the (pretend) install location of a command.",
  file:     "file <path>\n  Identify the type of a file.",
  clear:    "clear\n  Clear the terminal output.",
  exit:     "exit\n  Close the terminal window.",
  help:     "help\n  Show a short summary of available commands.",
  man:      "man <command>\n  Show the manual page for a command.",
  whoami:   "whoami\n  Show the user profile.",
  neofetch: "neofetch\n  Show OS / system info.",
  cowsay:   "cowsay <text>\n  An obligatory ASCII cow says <text>.",
};

export const COMMAND_NAMES = Object.keys(MAN_PAGES);

// ─── Display labels ──────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  folder:  "DIR  ",
  txt:     "TXT  ",
  pdf:     "PDF  ",
  ui:      "UI   ",
  slide:   "SLIDE",
  link:    "LINK ",
  program: "EXE  ",
};

export function typeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type.toUpperCase().padEnd(5);
}

export const FILE_KIND_DESC: Record<string, string> = {
  folder:  "directory",
  txt:     "ASCII text",
  pdf:     "PDF document",
  ui:      "Portfolio UI component",
  slide:   "Image slideshow",
  link:    "URL shortcut",
  program: "Executable program",
};

// ─── Filesystem navigation ───────────────────────────────────────────────────

/** Children of the folder at `path`, or null if it isn't a folder. */
export function childrenAt(tree: FileNode[], path: Path): FileNode[] | null {
  const walked = walkPath(tree, path);
  if (!walked) return null;
  if (walked.kind === "root") return walked.children;
  if (walked.node.type === "folder" && walked.node.data?.kind === "folder") {
    return walked.node.data.children;
  }
  return null;
}

/** Filename for tab-completion: spaces hyphenated, trailing slash on folders. */
export function formatCompletionName(n: FileNode): string {
  const safe = n.name.replace(/\s+/g, "-");
  return n.type === "folder" ? `${safe}/` : safe;
}

// ─── Argument parsing ────────────────────────────────────────────────────────

export function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  let lcp = strs[0];
  for (const s of strs) {
    while (!s.toLowerCase().startsWith(lcp.toLowerCase())) {
      lcp = lcp.slice(0, -1);
      if (lcp === "") return "";
    }
  }
  return lcp;
}

/** Pull short single-letter flags out of args: "ls -la foo" → flags={l,a}, rest=["foo"]. */
export function splitFlags(args: string[]): { flags: Set<string>; rest: string[] } {
  const flags = new Set<string>();
  const rest: string[] = [];
  for (const a of args) {
    if (a.length > 1 && a.startsWith("-") && !a.startsWith("--") && !/^-\d/.test(a)) {
      for (const ch of a.slice(1)) flags.add(ch);
    } else {
      rest.push(a);
    }
  }
  return { flags, rest };
}

/** Extract `-n N` (or `-nN`) from args, with sane default. */
export function extractN(args: string[], defaultN = 10): { n: number; rest: string[] } {
  let n = defaultN;
  const rest: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-n" && i + 1 < args.length) {
      const parsed = parseInt(args[++i], 10);
      if (!isNaN(parsed) && parsed > 0) n = parsed;
    } else if (a.startsWith("-n") && a.length > 2) {
      const parsed = parseInt(a.slice(2), 10);
      if (!isNaN(parsed) && parsed > 0) n = parsed;
    } else {
      rest.push(a);
    }
  }
  return { n, rest };
}

export function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}
