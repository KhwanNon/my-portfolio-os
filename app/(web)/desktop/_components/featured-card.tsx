"use client";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useDesktopData } from "../_lib/use-desktop-data";
import { findFeatured } from "../_lib/featured";
import { FeaturedStar } from "./featured-star";

/**
 * The one recommendation the desktop makes: open this project before the rest.
 *
 * It asks the file system which project is marked rather than naming one, so it
 * cannot end up pointing at a file that has been renamed, moved, or unmarked —
 * and if nothing is marked it draws nothing at all.
 *
 * The yellow border stops here and does not follow into the folder listing. A
 * card on an empty desktop has nothing to be confused with, so the frame simply
 * reads as emphasis; a framed row among twenty rows would read as a state those
 * rows can be in, and the star already says everything the frame would.
 *
 * Like the craft card it knows what it opens but not where it sits.
 */
export function FeaturedCard() {
  const { openFile } = useWindowManager();
  const { projects, featuredPitch } = useDesktopData();
  const S = useStrings();
  const project = findFeatured(projects);
  if (!project) return null;

  const title = project.name.replace(/\.ui$/, "");

  return (
    <button
      onClick={() => openFile(project)}
      title={S.project.openFile(project.name)}
      className="focus-ring w-full cursor-pointer rounded-lg p-3.5 text-left transition-colors duration-200 hover:bg-os-surface-3"
      style={{
        background: "var(--os-surface-1)",
        border: "1px solid var(--os-featured)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <FeaturedStar size={12} />
        {/* Neutral, not yellow: the star is the colour on this card, and a
            label painted to match it would make two marks out of one. */}
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--os-text-dim)" }}
        >
          {S.project.recommended}
        </span>
      </div>
      <p
        className="mt-1.5 text-[13px] font-semibold tracking-tight"
        style={{ color: "var(--os-text)" }}
      >
        {title}
      </p>
      <p
        className="mt-1 text-[12px] leading-snug"
        style={{ color: "var(--os-text-dim)" }}
      >
        {featuredPitch}
      </p>
    </button>
  );
}
