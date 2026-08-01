"use client";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useDesktopData } from "../_lib/use-desktop-data";
import { MountainGlyph } from "./mountain-glyph";
import { SparkGlyph } from "./spark-glyph";

/**
 * The standard this whole OS is built to, stated in four lines — and the way
 * into the file that states it in full. The card is the summary, so the card
 * itself is the control; a separate "read more" would be a second thing to look
 * at for the same one thing.
 *
 * It knows what it opens but not where it sits: the surface placing it owns
 * that.
 */
export function CraftCard() {
  const { openFile } = useWindowManager();
  const { craftFile, craftLines } = useDesktopData();
  const S = useStrings();

  return (
    <button
      onClick={() => openFile(craftFile)}
      title={S.project.openFile(craftFile.name)}
      className="focus-ring group relative w-full cursor-pointer overflow-hidden rounded-lg p-3.5 text-left transition-colors duration-200 hover:bg-os-surface-3"
      style={{
        background: "var(--os-surface-1)",
        border: "1px solid var(--os-border)",
      }}
    >
      <MountainGlyph className="pointer-events-none absolute -bottom-1 -right-3 h-14 w-32" />
      <div className="relative flex items-start justify-between gap-2">
        <span
          className="text-[13px] font-semibold tracking-tight"
          style={{ color: "var(--os-text)" }}
        >
          khwan-craft
        </span>
        <span
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
          style={{
            background: "var(--os-surface-3)",
            color: "var(--os-accent)",
          }}
        >
          <SparkGlyph size={11} />
        </span>
      </div>
      <ul
        className="relative mt-2 space-y-0.5 text-[12px] leading-snug"
        style={{ color: "var(--os-text-dim)" }}
      >
        {craftLines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </button>
  );
}
