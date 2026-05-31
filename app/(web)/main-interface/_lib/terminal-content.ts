// Static terminal text: the line model plus the canned screens (boot, help, info).

export interface HistoryLine {
  type: "system" | "input" | "output" | "error" | "success";
  text: string;
}

export const BOOT_LINES: HistoryLine[] = [
  { type: "system",  text: "> Initializing System_Command..." },
  { type: "system",  text: "> Loading C-DRIVE modules... [OK]" },
  { type: "system",  text: "> Establishing admin @ portfolio session... [SUCCESS]" },
  { type: "output",  text: "" },
  { type: "output",  text: "  Welcome to Portfolio OS Terminal." },
  { type: "output",  text: "  Type 'help' for commands. Try 'man <cmd>' for details." },
  { type: "output",  text: "" },
];

export const HELP_TEXT = `
  COMMANDS — run 'man <cmd>' for details
  ────────────────────────────────────────────────
  Filesystem   ls   cd   pwd   cat   open   tree   find   file
  Text         head tail cat   echo
  System       whoami  neofetch  date  uptime  history
  Reference    help    man <cmd>      which <cmd>
  Misc         clear   exit    cowsay
  ────────────────────────────────────────────────

  PATH SYNTAX
  ────────────────────────────────────────────────
    ~                 root (home)
    /                 root
    .                 current directory
    ..                parent directory
    foo/bar           relative, nested
    ~/c-drive/skills  absolute, nested
  ────────────────────────────────────────────────

  EXAMPLES
  ────────────────────────────────────────────────
    cd c-drive/projects/mobile
    ls -l ~/c-drive/about
    tree ~/c-drive/skills
    find resume
    cat ~/profile.txt
    open ~/c-drive/about/me.ui
  ────────────────────────────────────────────────
`;

export const WHOAMI_TEXT = `
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

export const NEOFETCH_TEXT = `
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
