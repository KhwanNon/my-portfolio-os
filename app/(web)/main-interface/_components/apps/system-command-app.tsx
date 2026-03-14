"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { desktopFileSystem } from "../../_data/file-system-data";
import type { FileNode } from "@/app/shared/types/file-system";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HistoryLine {
  type: "system" | "input" | "output" | "error" | "success";
  text: string;
}

interface CwdEntry {
  name: string;
  children: FileNode[];
}

// ─── Boot sequence ────────────────────────────────────────────────────────────

const BOOT_LINES: HistoryLine[] = [
  { type: "system",  text: "> Initializing System_Command..." },
  { type: "system",  text: "> Loading C-DRIVE modules... [OK]" },
  { type: "system",  text: "> Establishing admin @ portfolio session... [SUCCESS]" },
  { type: "output",  text: "" },
  { type: "output",  text: "  Welcome to Portfolio OS Terminal." },
  { type: "output",  text: "  Type 'help' for available commands." },
  { type: "output",  text: "" },
];

// ─── Help text ────────────────────────────────────────────────────────────────

const HELP_TEXT = `
  COMMANDS
  ────────────────────────────────────────────────
  help              Show this message
  pwd               Print working directory
  ls                List files in current folder
  ls <folder>       List files in a specific folder
  cd <folder>       Navigate into a folder
  cd ..             Go up one level
  cat <file>        Read a .txt file
  open <file>       Open any file in the GUI
  whoami            Show user profile
  neofetch          System information
  clear             Clear the terminal
  exit              Close this terminal
  ────────────────────────────────────────────────
`;

// ─── Static info ──────────────────────────────────────────────────────────────

const WHOAMI_TEXT = `
  ┌─────────────────────────────────────────────┐
  │  USER PROFILE                               │
  ├─────────────────────────────────────────────┤
  │  Name        :  Khwanchai Nontawichit       │
  │  Alias       :  Khwan                       │
  │  Role        :  Mobile Developer (Flutter)  │
  │  Experience  :  3+ Years                    │
  │  Location    :  Thailand                    │
  │  Status      :  Open to Opportunities       │
  └─────────────────────────────────────────────┘
`;

const NEOFETCH_TEXT = `
                         admin@portfolio
  ██████████           ─────────────────────────────
  ██████████           OS      :  Portfolio OS 2.4.0
  ██████████           Build   :  2024.Alpha
  ██████████           Shell   :  sys-cmd v1.0
  ██████████           Stack   :  Flutter · React · Next.js
                       Lang    :  Dart · TypeScript
  ████    ████         Arch    :  Clean Architecture
  ████    ████         Memory  :  3+ years of experience
  ████    ████         Uptime  :  Available now
`;

// ─── File system helpers ──────────────────────────────────────────────────────

function findChild(children: FileNode[], name: string): FileNode | undefined {
  return children.find(
    (c) => c.name.toLowerCase() === name.toLowerCase() ||
           c.name.toLowerCase().replace(/\s+/g, "-") === name.toLowerCase()
  );
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    folder:  "DIR  ",
    txt:     "TXT  ",
    pdf:     "PDF  ",
    ui:      "UI   ",
    slide:   "SLIDE",
    link:    "LINK ",
    program: "EXE  ",
  };
  return map[type] ?? type.toUpperCase().padEnd(5);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SystemCommandApp() {
  const { openFile, closeWindow } = useWindowManager();

  const ROOT: CwdEntry = { name: "~", children: desktopFileSystem };
  const [cwdStack, setCwdStack] = useState<CwdEntry[]>([ROOT]);
  const [history, setHistory] = useState<HistoryLine[]>(BOOT_LINES);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────

  const currentDir = cwdStack[cwdStack.length - 1];

  const pwd = useCallback(() => {
    return cwdStack.map((e) => e.name).join("/").replace("~/", "~/");
  }, [cwdStack]);

  const prompt = `admin@portfolio:${pwd()} %`;

  // ── Output helpers ─────────────────────────────────────────────────────────

  const push = useCallback((lines: HistoryLine[]) => {
    setHistory((prev) => [...prev, ...lines]);
  }, []);

  const out = useCallback(
    (text: string) => push([{ type: "output", text }]),
    [push]
  );

  const err = useCallback(
    (text: string) => push([{ type: "error", text: `  error: ${text}` }]),
    [push]
  );

  const ok = useCallback(
    (text: string) => push([{ type: "success", text: `  ${text}` }]),
    [push]
  );

  // ── Commands ───────────────────────────────────────────────────────────────

  const cmdPwd = useCallback(() => {
    out(`  ${pwd()}`);
    out("");
  }, [pwd, out]);

  const cmdLs = useCallback(
    (arg: string) => {
      let children = currentDir.children;
      let label = pwd();

      if (arg) {
        const target = findChild(currentDir.children, arg);
        if (!target) { err(`no such file or directory: ${arg}`); return; }
        if (target.type !== "folder" || target.data?.kind !== "folder") {
          err(`not a directory: ${arg}`); return;
        }
        children = target.data.children;
        label = `${pwd()}/${arg}`;
      }

      out("");
      out(`  ${label}`);
      out("  ─────────────────────────────────────────");

      if (children.length === 0) {
        out("  (empty)");
      } else {
        // Folders first, then files
        const sorted = [
          ...children.filter((c) => c.type === "folder"),
          ...children.filter((c) => c.type !== "folder"),
        ];
        for (const child of sorted) {
          const icon = child.type === "folder" ? "📁" : "📄";
          out(`  ${icon}  [${typeLabel(child.type)}]  ${child.name}`);
        }
      }
      out("");
    },
    [currentDir, pwd, out, err]
  );

  const cmdCd = useCallback(
    (arg: string) => {
      if (!arg || arg === "~") {
        setCwdStack([ROOT]);
        return;
      }
      if (arg === "..") {
        if (cwdStack.length > 1) setCwdStack((prev) => prev.slice(0, -1));
        else err("already at root");
        return;
      }

      const target = findChild(currentDir.children, arg);
      if (!target) { err(`no such directory: ${arg}`); return; }
      if (target.type !== "folder" || target.data?.kind !== "folder") {
        err(`not a directory: ${arg}`); return;
      }

      setCwdStack((prev) => [
        ...prev,
        { name: target.name, children: target.data!.kind === "folder" ? (target.data as { kind: "folder"; children: FileNode[] }).children : [] },
      ]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDir, cwdStack, err]
  );

  const cmdCat = useCallback(
    (arg: string) => {
      if (!arg) { err("usage: cat <filename>"); return; }
      const target = findChild(currentDir.children, arg);
      if (!target) { err(`no such file: ${arg}`); return; }
      if (target.type !== "txt" || target.data?.kind !== "txt") {
        err(`cannot cat file of type '${target.type}'. Use 'open' instead.`); return;
      }
      out("");
      for (const line of target.data.content.split("\n")) {
        out(`  ${line}`);
      }
      out("");
    },
    [currentDir, out, err]
  );

  const cmdOpen = useCallback(
    (arg: string) => {
      if (!arg) { err("usage: open <filename>"); return; }
      const target = findChild(currentDir.children, arg);
      if (!target) { err(`no such file: ${arg}`); return; }
      openFile(target);
      ok(`Opening "${target.name}"...`);
      out("");
    },
    [currentDir, openFile, ok, err, out]
  );

  // ── Command dispatcher ─────────────────────────────────────────────────────

  const handleCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      push([{ type: "input", text: `${prompt} ${raw}` }]);

      if (!trimmed) return;

      setCmdHistory((prev) => [trimmed, ...prev].slice(0, 100));
      setHistoryIdx(-1);

      const [cmd, ...args] = trimmed.split(/\s+/);
      const arg = args.join(" ");

      switch (cmd.toLowerCase()) {
        case "help":
          push(HELP_TEXT.split("\n").map((t) => ({ type: "output" as const, text: t })));
          break;

        case "pwd":
          cmdPwd();
          break;

        case "ls":
          cmdLs(arg);
          break;

        case "cd":
          cmdCd(arg);
          break;

        case "cat":
          cmdCat(arg);
          break;

        case "open":
          cmdOpen(arg);
          break;

        case "whoami":
          push(WHOAMI_TEXT.split("\n").map((t) => ({ type: "output" as const, text: t })));
          break;

        case "neofetch":
          push(NEOFETCH_TEXT.split("\n").map((t) => ({ type: "output" as const, text: t })));
          break;

        case "clear":
          setHistory(BOOT_LINES);
          break;

        case "exit":
          closeWindow("system-command");
          break;

        default:
          err(`command not found: ${cmd}. Type 'help' for available commands.`);
      }
    },
    [prompt, push, cmdPwd, cmdLs, cmdCd, cmdCat, cmdOpen, closeWindow, err]
  );

  // ── Keyboard handler ───────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Tab completion
      const partial = input.split(/\s/).pop() ?? "";
      if (!partial) return;
      const matches = currentDir.children.filter((c) =>
        c.name.toLowerCase().startsWith(partial.toLowerCase())
      );
      if (matches.length === 1) {
        setInput(input.slice(0, input.lastIndexOf(partial)) + matches[0].name);
      } else if (matches.length > 1) {
        out("");
        push(matches.map((m) => ({ type: "output" as const, text: `  ${m.name}` })));
        out("");
      }
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="h-full flex flex-col font-os-mono text-xs"
      style={{ background: "#0d1117" }}
      onMouseDown={(e) => {
        // Prevent blur when clicking anywhere inside the terminal except the input itself
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
            {line.text || "\u00A0"}
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
