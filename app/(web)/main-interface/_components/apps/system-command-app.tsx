"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { desktopFileSystem } from "../../_data/file-system-data";
import {
  resolvePath,
  walkPath,
  canonicalizePath,
  getDisplayPath,
  getCompletionContext,
  matchPartial,
  type Path,
} from "../../_lib/path-resolver";
import {
  buildTree,
  findByName,
  fakeDate,
  fakeSize,
  humanSize,
  permString,
  cowsay,
  typeLabel,
  childrenAt,
  formatCompletionName,
  longestCommonPrefix,
  splitFlags,
  extractN,
  formatUptime,
  FILE_KIND_DESC,
  MAN_PAGES,
  COMMAND_NAMES,
} from "../../_lib/terminal-utils";
import {
  type HistoryLine,
  BOOT_LINES,
  HELP_TEXT,
  WHOAMI_TEXT,
  NEOFETCH_TEXT,
} from "../../_lib/terminal-content";

// ─── Component ────────────────────────────────────────────────────────────────

export function SystemCommandApp() {
  const { openFile, closeWindow, terminalCdRequest } = useWindowManager();

  const [cwd, setCwd] = useState<Path>([]);
  const [history, setHistory] = useState<HistoryLine[]>(BOOT_LINES);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const displayPath = getDisplayPath(desktopFileSystem, cwd);
  const prompt = `admin@portfolio:${displayPath} %`;

  // ── Output helpers ─────────────────────────────────────────────────────────

  const push = useCallback((lines: HistoryLine[]) => {
    setHistory((prev) => [...prev, ...lines]);
  }, []);
  const out = useCallback(
    (text: string) => push([{ type: "output", text }]),
    [push],
  );
  const err = useCallback(
    (text: string) => push([{ type: "error", text: `  error: ${text}` }]),
    [push],
  );
  const ok = useCallback(
    (text: string) => push([{ type: "success", text: `  ${text}` }]),
    [push],
  );
  const outBlock = useCallback(
    (text: string) =>
      push(
        text.split("\n").map((t) => ({ type: "output" as const, text: t })),
      ),
    [push],
  );

  // Sync cwd with external cd intent (from the "Open in Terminal" context menu action).
  // Token-guarded so only fresh requests trigger a state update.
  const lastCdTokenRef = useRef(0);
  useEffect(() => {
    if (!terminalCdRequest) return;
    if (terminalCdRequest.token === lastCdTokenRef.current) return;
    lastCdTokenRef.current = terminalCdRequest.token;

    const target = terminalCdRequest.path;
    const walked = walkPath(desktopFileSystem, target);
    if (!walked) return;
    if (
      walked.kind === "node" &&
      (walked.node.type !== "folder" || walked.node.data?.kind !== "folder")
    ) {
      return;
    }
    const canonical = canonicalizePath(desktopFileSystem, target);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCwd(canonical);
    const label =
      canonical.length === 0 ? "~" : `~/${canonical.join("/")}`;
    push([{ type: "system", text: `> cd ${label}` }]);
  }, [terminalCdRequest, push]);

  // ── Filesystem commands ────────────────────────────────────────────────────

  const cmdPwd = useCallback(() => {
    out(`  ${displayPath}`);
    out("");
  }, [displayPath, out]);

  const cmdLs = useCallback(
    (args: string[]) => {
      const { flags, rest } = splitFlags(args);
      const arg = rest[0] ?? "";
      const targetPath = arg ? resolvePath(cwd, arg) : cwd;
      const children = childrenAt(desktopFileSystem, targetPath);

      if (children === null) {
        const walked = walkPath(desktopFileSystem, targetPath);
        if (walked?.kind === "node" && walked.node.type !== "folder") {
          err(`not a directory: ${arg}`);
        } else {
          err(`no such file or directory: ${arg}`);
        }
        return;
      }

      const label = getDisplayPath(desktopFileSystem, targetPath);
      out("");
      out(`  ${label}`);
      out("  ─────────────────────────────────────────");

      if (children.length === 0) {
        out("  (empty)");
      } else {
        const sorted = [
          ...children.filter((c) => c.type === "folder"),
          ...children.filter((c) => c.type !== "folder"),
        ];

        if (flags.has("l")) {
          out(`  total ${sorted.length}`);
          for (const c of sorted) {
            out(
              `  ${permString(c)}  ${humanSize(fakeSize(c))}  ${fakeDate(c)}  ${c.name}`,
            );
          }
        } else {
          for (const c of sorted) {
            const icon = c.type === "folder" ? "📁" : "📄";
            out(`  ${icon}  [${typeLabel(c.type)}]  ${c.name}`);
          }
        }
      }
      out("");
    },
    [cwd, out, err],
  );

  const cmdCd = useCallback(
    (args: string[]) => {
      const arg = args[0] ?? "";
      const target = resolvePath(cwd, arg);
      const walked = walkPath(desktopFileSystem, target);
      if (!walked) {
        err(`no such directory: ${arg || "(empty)"}`);
        return;
      }
      if (
        walked.kind === "node" &&
        (walked.node.type !== "folder" || walked.node.data?.kind !== "folder")
      ) {
        err(`not a directory: ${arg}`);
        return;
      }
      setCwd(canonicalizePath(desktopFileSystem, target));
    },
    [cwd, err],
  );

  const cmdCat = useCallback(
    (args: string[]) => {
      const arg = args[0];
      if (!arg) { err("usage: cat <path>"); return; }
      const target = resolvePath(cwd, arg);
      const walked = walkPath(desktopFileSystem, target);
      if (!walked || walked.kind === "root") {
        err(`no such file: ${arg}`);
        return;
      }
      if (walked.node.type !== "txt" || walked.node.data?.kind !== "txt") {
        err(`cannot cat file of type '${walked.node.type}'. Use 'open' instead.`);
        return;
      }
      out("");
      for (const line of walked.node.data.content.split("\n")) out(`  ${line}`);
      out("");
    },
    [cwd, out, err],
  );

  const cmdOpen = useCallback(
    (args: string[]) => {
      const arg = args[0];
      if (!arg) { err("usage: open <path>"); return; }
      const target = resolvePath(cwd, arg);
      const walked = walkPath(desktopFileSystem, target);
      if (!walked || walked.kind === "root") {
        err(`no such file: ${arg}`);
        return;
      }
      openFile(walked.node);
      ok(`Opening "${walked.node.name}"...`);
      out("");
    },
    [cwd, openFile, ok, err, out],
  );

  const cmdTree = useCallback(
    (args: string[]) => {
      const arg = args[0] ?? "";
      const targetPath = arg ? resolvePath(cwd, arg) : cwd;
      const children = childrenAt(desktopFileSystem, targetPath);
      if (children === null) {
        err(`no such directory: ${arg}`);
        return;
      }
      const label = getDisplayPath(desktopFileSystem, targetPath);
      out("");
      for (const line of buildTree(label, children, 3)) out(`  ${line}`);
      out("");
    },
    [cwd, out, err],
  );

  const cmdFind = useCallback(
    (args: string[]) => {
      const needle = args[0];
      if (!needle) { err("usage: find <name> [path]"); return; }
      const startArg = args[1] ?? "";
      const startPath = startArg ? resolvePath(cwd, startArg) : cwd;
      const children = childrenAt(desktopFileSystem, startPath);
      if (children === null) {
        err(`no such directory: ${startArg}`);
        return;
      }
      const canonical = canonicalizePath(desktopFileSystem, startPath);
      const matches = findByName(canonical, children, needle);
      out("");
      if (matches.length === 0) {
        out(`  no matches for "${needle}"`);
      } else {
        for (const m of matches) out(`  ${m}`);
      }
      out("");
    },
    [cwd, out, err],
  );

  const cmdFile = useCallback(
    (args: string[]) => {
      const arg = args[0];
      if (!arg) { err("usage: file <path>"); return; }
      const target = resolvePath(cwd, arg);
      const walked = walkPath(desktopFileSystem, target);
      if (!walked) { err(`no such file: ${arg}`); return; }

      if (walked.kind === "root") {
        out(`  ${arg}: directory (root)`);
      } else {
        const desc = FILE_KIND_DESC[walked.node.type] ?? walked.node.type;
        out(`  ${arg}: ${desc}`);
      }
      out("");
    },
    [cwd, out, err],
  );

  const cmdHead = useCallback(
    (args: string[]) => {
      const { n, rest } = extractN(args, 10);
      const arg = rest[0];
      if (!arg) { err("usage: head [-n N] <path>"); return; }
      const target = resolvePath(cwd, arg);
      const walked = walkPath(desktopFileSystem, target);
      if (!walked || walked.kind === "root") { err(`no such file: ${arg}`); return; }
      if (walked.node.type !== "txt" || walked.node.data?.kind !== "txt") {
        err(`not a text file: ${arg}`);
        return;
      }
      const lines = walked.node.data.content.split("\n").slice(0, n);
      out("");
      for (const line of lines) out(`  ${line}`);
      out("");
    },
    [cwd, out, err],
  );

  const cmdTail = useCallback(
    (args: string[]) => {
      const { n, rest } = extractN(args, 10);
      const arg = rest[0];
      if (!arg) { err("usage: tail [-n N] <path>"); return; }
      const target = resolvePath(cwd, arg);
      const walked = walkPath(desktopFileSystem, target);
      if (!walked || walked.kind === "root") { err(`no such file: ${arg}`); return; }
      if (walked.node.type !== "txt" || walked.node.data?.kind !== "txt") {
        err(`not a text file: ${arg}`);
        return;
      }
      const all = walked.node.data.content.split("\n");
      const lines = all.slice(Math.max(0, all.length - n));
      out("");
      for (const line of lines) out(`  ${line}`);
      out("");
    },
    [cwd, out, err],
  );

  // ── System / utility commands ──────────────────────────────────────────────

  const cmdEcho = useCallback(
    (args: string[]) => {
      out(`  ${args.join(" ")}`);
      out("");
    },
    [out],
  );

  const cmdDate = useCallback(() => {
    out(`  ${new Date().toString()}`);
    out("");
  }, [out]);

  const cmdUptime = useCallback(() => {
    out(`  terminal up ${formatUptime(Date.now() - startTime)}`);
    out("");
  }, [out, startTime]);

  const cmdHistoryCmd = useCallback(() => {
    out("");
    if (cmdHistory.length === 0) {
      out("  (no commands yet)");
    } else {
      // cmdHistory[0] is the most recent; reverse so oldest prints first.
      const ordered = [...cmdHistory].reverse();
      ordered.forEach((h, i) => {
        const n = String(i + 1).padStart(3, " ");
        out(`  ${n}  ${h}`);
      });
    }
    out("");
  }, [cmdHistory, out]);

  const cmdMan = useCallback(
    (args: string[]) => {
      const arg = args[0];
      if (!arg) { err("usage: man <command>"); return; }
      const page = MAN_PAGES[arg.toLowerCase()];
      if (!page) { err(`no manual entry for ${arg}`); return; }
      out("");
      out(`  ${arg.toUpperCase()}(1)`);
      out("  ─────────────────────────────────────────");
      for (const line of page.split("\n")) out(`  ${line}`);
      out("");
    },
    [out, err],
  );

  const cmdWhich = useCallback(
    (args: string[]) => {
      const arg = args[0];
      if (!arg) { err("usage: which <command>"); return; }
      if (COMMAND_NAMES.includes(arg.toLowerCase())) {
        out(`  /usr/local/bin/${arg.toLowerCase()}`);
        out("");
      } else {
        err(`${arg} not found`);
      }
    },
    [out, err],
  );

  const cmdCowsay = useCallback(
    (args: string[]) => {
      out("");
      for (const line of cowsay(args.join(" "))) out(`  ${line}`);
      out("");
    },
    [out],
  );

  // ── Command dispatcher ─────────────────────────────────────────────────────

  const handleCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      push([{ type: "input", text: `${prompt} ${raw}` }]);
      if (!trimmed) return;

      setCmdHistory((prev) => [trimmed, ...prev].slice(0, 100));
      setHistoryIdx(-1);

      // ── Whole-line Easter eggs ──
      if (trimmed === "make me a sandwich") {
        err("What? Make it yourself.");
        return;
      }
      if (trimmed === "sudo make me a sandwich") {
        ok("Okay.");
        return;
      }
      if (/^sudo\s+rm\s+-rf\s+\/?\s*$/.test(trimmed)) {
        err("Nope. This portfolio is staying right where it is.");
        return;
      }

      const tokens = trimmed.split(/\s+/);
      const [cmd, ...args] = tokens;
      const cmdLower = cmd.toLowerCase();

      switch (cmdLower) {
        case "help":     outBlock(HELP_TEXT); break;
        case "pwd":      cmdPwd(); break;
        case "ls":       cmdLs(args); break;
        case "cd":       cmdCd(args); break;
        case "cat":      cmdCat(args); break;
        case "open":     cmdOpen(args); break;
        case "tree":     cmdTree(args); break;
        case "find":     cmdFind(args); break;
        case "file":     cmdFile(args); break;
        case "head":     cmdHead(args); break;
        case "tail":     cmdTail(args); break;
        case "echo":     cmdEcho(args); break;
        case "date":     cmdDate(); break;
        case "uptime":   cmdUptime(); break;
        case "history":  cmdHistoryCmd(); break;
        case "man":      cmdMan(args); break;
        case "which":    cmdWhich(args); break;
        case "cowsay":   cmdCowsay(args); break;
        case "whoami":   outBlock(WHOAMI_TEXT); break;
        case "neofetch": outBlock(NEOFETCH_TEXT); break;
        case "clear":    setHistory(BOOT_LINES); break;
        case "exit":     closeWindow("system-command"); break;

        // ── Refusals / hints ──
        case "sudo":
          err("permission denied: this is a read-only portfolio. (nice try.)");
          break;
        case "rm":
        case "mv":
        case "cp":
        case "mkdir":
        case "touch":
          err(`${cmdLower}: refusing to mutate a portfolio filesystem.`);
          break;
        case "vim":
        case "vi":
        case "nano":
        case "emacs":
          out(`  ${cmdLower}: try 'open <file>' to view files in the GUI.`);
          out("");
          break;
        case "ssh":
        case "telnet":
        case "curl":
        case "wget":
          err(`${cmdLower}: no network here — this OS lives in your browser.`);
          break;

        default:
          err(`command not found: ${cmd}. Type 'help' or 'man <cmd>'.`);
      }
    },
    [
      prompt, push, outBlock,
      cmdPwd, cmdLs, cmdCd, cmdCat, cmdOpen, cmdTree, cmdFind, cmdFile,
      cmdHead, cmdTail, cmdEcho, cmdDate, cmdUptime, cmdHistoryCmd, cmdMan,
      cmdWhich, cmdCowsay,
      closeWindow, err, ok, out,
    ],
  );

  // ── Keyboard handler ───────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
      return;
    }
    if (e.key !== "Tab") return;

    e.preventDefault();

    // Complete command name when still on the first token.
    if (!/\s/.test(input)) {
      if (input.length === 0) return;
      const partial = input.toLowerCase();
      const matches = COMMAND_NAMES.filter((c) => c.startsWith(partial));
      if (matches.length === 0) return;
      if (matches.length === 1) {
        setInput(matches[0] + " ");
        return;
      }
      const lcp = longestCommonPrefix(matches);
      if (lcp.length > partial.length) {
        setInput(lcp);
      } else {
        out("");
        push(matches.map((m) => ({ type: "output" as const, text: `  ${m}` })));
        out("");
      }
      return;
    }

    // Otherwise, path completion against the current directory.
    const ctx = getCompletionContext(desktopFileSystem, cwd, input);
    if (!ctx) return;

    const matches = matchPartial(ctx.directoryChildren, ctx.partial);
    if (matches.length === 0) return;

    if (matches.length === 1) {
      setInput(ctx.prefixBeforePartial + formatCompletionName(matches[0]));
      return;
    }

    const names = matches.map(formatCompletionName);
    const lcp = longestCommonPrefix(names);
    if (lcp.length > ctx.partial.length) {
      setInput(ctx.prefixBeforePartial + lcp);
    } else {
      out("");
      push(
        matches.map((m) => ({
          type: "output" as const,
          text: `  ${m.type === "folder" ? "📁" : "📄"}  ${m.name}`,
        })),
      );
      out("");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="h-full flex flex-col font-os-mono text-xs"
      style={{ background: "#0d1117" }}
      onMouseDown={(e) => {
        if (e.target !== inputRef.current) {
          e.preventDefault();
        }
        inputRef.current?.focus();
      }}
    >
      {/* Output area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-0.5">
        {history.map((line, i) => (
          <div
            key={i}
            style={{
              color:
                line.type === "error"   ? "#ff6b6b"
              : line.type === "success" ? "#3ddc84"
              : line.type === "input"   ? "#ffffff"
              : line.type === "system"  ? "rgba(82,211,214,0.65)"
              : "var(--os-accent)",
            }}
          >
            {line.text || " "}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        className="flex items-center px-4 py-3 shrink-0 gap-2"
        style={{ borderTop: "1px solid rgba(82,211,214,0.15)", background: "#0d1117" }}
      >
        <span className="opacity-70 shrink-0 whitespace-nowrap" style={{ color: "var(--os-accent)" }}>
          {prompt}
        </span>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent outline-none text-xs font-os-mono caret-current"
          style={{ color: "#ffffff" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
