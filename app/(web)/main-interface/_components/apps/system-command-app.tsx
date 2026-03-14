"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { desktopFileSystem } from "../../_data/file-system-data";

interface HistoryLine {
  type: "system" | "input" | "output" | "error";
  text: string;
}

const BOOT_LINES: HistoryLine[] = [
  { type: "system", text: "> Initializing System_Command..." },
  { type: "system", text: "> Loading C-DRIVE modules... [OK]" },
  {
    type: "system",
    text: "> Establishing admin @ portfolio session... [SUCCESS]",
  },
  { type: "output", text: "" },
  {
    type: "output",
    text: "Welcome to the Core Interface. Type 'help' for available commands.",
  },
  { type: "output", text: "" },
];

const HELP_TEXT = `
  AVAILABLE COMMANDS
  ──────────────────────────────────────────
  help          Show this help message
  ls            List desktop files
  whoami        Show current user info
  skills        Display technical skills
  projects      Show project list
  experience    Show work experience
  contact       Show contact information
  clear         Clear the terminal
  exit          Close this terminal
  ──────────────────────────────────────────
`;

const WHOAMI_TEXT = `
  USER PROFILE
  ──────────────────────────────────────────
  Name        :  Khwanchai Nontawichit
  Alias       :  Khwan
  Role        :  Mobile Developer (Flutter)
  Experience  :  3+ Years
  Location    :  Thailand
  Status      :  Available for opportunities
  ──────────────────────────────────────────
`;

const SKILLS_TEXT = `
  TECHNICAL SKILLS
  ──────────────────────────────────────────
  Mobile      :  Flutter ████████████ 95%
                 Dart     ████████████ 95%
  Frontend    :  React    █████████░░░ 80%
                 Next.js  █████████░░░ 80%
                 TypeScript ████████░░ 75%
  Architecture:  Clean Arch   ██████████ 90%
                 BLoC / MVVM  ██████████ 90%
  Tools       :  Git     ██████████░░ 85%
                 Docker  ███████░░░░░ 65%
  ──────────────────────────────────────────
`;

const PROJECTS_TEXT = `
  PROJECTS
  ──────────────────────────────────────────
  [1] Portfolio OS (this very interface)
      Stack: Next.js · TypeScript · Tailwind
      Status: In Development

  [2] Flutter Clean Architecture Boilerplate
      Stack: Flutter · Dart · BLoC
      Status: Completed

  [3] E-Commerce Mobile App
      Stack: Flutter · Firebase · Clean Arch
      Status: Completed

  [4] Team Task Manager
      Stack: Flutter · Dart · REST API
      Status: Completed
  ──────────────────────────────────────────
  > Open C-DRIVE for full project details
`;

const EXPERIENCE_TEXT = `
  WORK EXPERIENCE
  ──────────────────────────────────────────
  [1] Mobile Developer — Current Company
      Period   :  2022 – Present
      Duration :  3+ Years
      Role     :  Lead Flutter Developer
      Focus    :  Clean Architecture, Team Lead,
                  CI/CD, Performance Optimization

  [2] Junior Flutter Developer — Startup
      Period   :  2021 – 2022
      Duration :  1 Year
      Focus    :  Feature Development, API Integration
  ──────────────────────────────────────────
`;

const CONTACT_TEXT = `
  CONTACT INFORMATION
  ──────────────────────────────────────────
  Email    :  [your.email@example.com]
  GitHub   :  github.com/[your-username]
  LinkedIn :  linkedin.com/in/[your-profile]
  Location :  Thailand
  ──────────────────────────────────────────
  > Use 'ls' to explore the file system
`;

export function SystemCommandApp() {
  const [history, setHistory] = useState<HistoryLine[]>(BOOT_LINES);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { closeWindow } = useWindowManager();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const pushLines = useCallback((lines: HistoryLine[]) => {
    setHistory((prev) => [...prev, ...lines]);
  }, []);

  const handleCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      pushLines([{ type: "input", text: `(main) admin @ portfolio ~ % ${raw}` }]);

      if (!cmd) return;

      setCmdHistory((prev) => [raw, ...prev].slice(0, 50));
      setHistoryIdx(-1);

      switch (cmd) {
        case "help":
          pushLines(
            HELP_TEXT.split("\n").map((t) => ({ type: "output", text: t }))
          );
          break;
        case "ls":
          pushLines([
            { type: "output", text: "" },
            { type: "output", text: "  Desktop File System:" },
            { type: "output", text: "  ──────────────────────────────" },
            ...desktopFileSystem.map((f) => ({
              type: "output" as const,
              text: `  [${f.type.toUpperCase().padEnd(7)}]  ${f.name}`,
            })),
            { type: "output", text: "" },
          ]);
          break;
        case "whoami":
          pushLines(
            WHOAMI_TEXT.split("\n").map((t) => ({ type: "output", text: t }))
          );
          break;
        case "skills":
          pushLines(
            SKILLS_TEXT.split("\n").map((t) => ({ type: "output", text: t }))
          );
          break;
        case "projects":
          pushLines(
            PROJECTS_TEXT.split("\n").map((t) => ({
              type: "output",
              text: t,
            }))
          );
          break;
        case "experience":
          pushLines(
            EXPERIENCE_TEXT.split("\n").map((t) => ({
              type: "output",
              text: t,
            }))
          );
          break;
        case "contact":
          pushLines(
            CONTACT_TEXT.split("\n").map((t) => ({
              type: "output",
              text: t,
            }))
          );
          break;
        case "clear":
          setHistory(BOOT_LINES);
          break;
        case "exit":
          closeWindow("system-command");
          break;
        default:
          pushLines([
            {
              type: "error",
              text: `  command not found: ${cmd}. Type 'help' for available commands.`,
            },
          ]);
      }
    },
    [pushLines, closeWindow]
  );

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
    }
  };

  return (
    <div
      className="h-full flex flex-col font-os-mono text-xs"
      style={{ background: "#0d1117" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-0.5">
        {history.map((line, i) => (
          <div
            key={i}
            style={{
              color:
                line.type === "error"
                  ? "#ff6b6b"
                  : line.type === "input"
                  ? "#ffffff"
                  : line.type === "system"
                  ? "rgba(82,211,214,0.7)"
                  : "var(--os-accent)",
              opacity: line.type === "output" && !line.text ? 1 : undefined,
            }}
          >
            {line.text || "\u00A0"}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        className="flex items-center px-4 py-3 flex-shrink-0"
        style={{
          borderTop: "1px solid rgba(82,211,214,0.15)",
          background: "#0d1117",
        }}
      >
        <span className="mr-2 opacity-70" style={{ color: "var(--os-accent)" }}>
          (main) admin @ portfolio ~ %
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
