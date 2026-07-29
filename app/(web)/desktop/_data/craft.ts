import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";

/**
 * The four lines the rail's craft card shows. They live here rather than in the
 * component because they are the headings of the file below — card and file are
 * one statement, and splitting them across two modules is how they drift apart.
 */
export const CRAFT_LINES = [
  "Best, but simplest.",
  "Thoughtful process.",
  "Clean craft.",
  "Always the standard.",
];

/**
 * What the craft card opens. It sits at the root of the drive beside Profile
 * and Resume rather than inside C-DRIVE: it is a statement about the work, not
 * one of the folders the work is filed under. Being in the tree is what lets
 * search, the terminal and Properties find it; the card on the desktop is the
 * only shortcut to it, and the rail deliberately carries none.
 */
export const khwanCraftFile: FileNode = {
  id: "khwan-craft-md",
  name: "khwan-craft.md",
  type: "txt",
  icon: ICONS.txt,
  data: {
    kind: "txt",
    content: `> KHWAN-CRAFT.MD — THE STANDARD
> ─────────────────────────────────────────

# Best, but simplest.

  Two requirements, not one. A solution that is clever but
  hard to follow has met half the bar, and so has one that
  is simple but does the job badly. The work is finished
  when the best answer and the simplest answer have become
  the same answer.

# Thoughtful process.

  Break the problem into parts small enough to be obvious.
  Research several genuinely different approaches — not one
  approach and two variations of it. Take what is right from
  each, then distill until there is nothing left to remove.

# Clean craft.

  Code is read far more often than it is written. Names say
  what a thing is; structure says how the pieces relate; a
  comment earns its place by explaining why, never what.
  The project itself should read as the example.

# Always the standard.

  The same bar applies whether or not anyone is watching,
  whether or not the deadline is close, and whether the file
  is the core of the product or a script run once. Habit and
  speed do not outrank it.

──────────────────────────────────────────────────────
  This file is the standard Portfolio OS itself is built to.
──────────────────────────────────────────────────────

> END OF FILE`,
  },
};
