import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";

export const recycleBin: FileNode = {
  id: "recycle-bin",
  name: "Recycle Bin",
  type: "folder",
  icon: ICONS.recycle,
  data: {
    kind: "folder",
    children: [
      {
        id: "deleted-dreams",
        name: "deleted-dreams.txt",
        type: "txt",
        icon: ICONS.txt,
        data: {
          kind: "txt",
          content: `> RECYCLE BIN — SYSTEM DUMP LOG
> ─────────────────────────────────────────

  File: deleted-dreams.txt
  Status: Permanently deleted (or is it?)
  Date: 10/24/2024 03:14:59

> Contents recovered by deep-scan:

  - That one side project I swore I'd finish "this weekend"
  - "Temporary" CSS hacks that became permanent architecture
  - 47 drafts of a README that never shipped
  - Every "just 5 more minutes" that became 3am
  - The perfectly working code I refactored into bugs
  - npm packages installed "just to try it"
  - Stack Overflow answers I never went back to upvote

> SYSTEM NOTE:
  The recycle bin is never truly empty.
  Neither is the ambition of a developer.

  [ RESTORE ] [ DELETE PERMANENTLY ] [ Contemplate Existence ]

──────────────────────────────────────────────────────
EOF`,
        },
      },
      {
        id: "old-bugs",
        name: "old-bugs.log",
        type: "txt",
        icon: ICONS.txt,
        data: {
          kind: "txt",
          content: `> BUG ARCHIVE — GRAVEYARD OF ISSUES
> ─────────────────────────────────────────

  [CLOSED] #0001 — "It works on my machine"
  Resolution: Shipped anyway. Became production.

  [CLOSED] #0042 — Undefined is not a function
  Resolution: Added || {} . Problem solved. Problem stayed solved.

  [CLOSED] #0099 — Why is this async?
  Resolution: It was always async. I just wasn't ready.

  [CLOSED] #0137 — CSS layout broken on Safari
  Resolution: Declared war on Safari. Settled for a -webkit- prefix.

  [CLOSED] #0201 — "Cannot read properties of null"
  Resolution: Added optional chaining everywhere.
               Added it in places that didn't need it too. Felt good.

  [CLOSED] #0404 — Feature not found
  Resolution: Feature was never specified. Invented it anyway.
              Users liked the invented version better.

──────────────────────────────────────────────────────
  Total bugs closed: ∞
  Total bugs remaining: also ∞
──────────────────────────────────────────────────────
EOF`,
        },
      },
    ],
  },
};
