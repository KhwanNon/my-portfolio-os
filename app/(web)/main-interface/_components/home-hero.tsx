import { OWNER } from "../_data/identity";
import { MountainGlyph } from "./mountain-glyph";

/** Who the portfolio belongs to, stated once, above the desktop. */
export function HomeHero() {
  return (
    <header className="relative shrink-0 pb-2 pt-6">
      {/* Pulled down through the column gap so the range stands on the
          card's top edge rather than floating above it. */}
      <MountainGlyph className="pointer-events-none absolute -bottom-4 right-0 hidden h-28 w-81.5 max-w-[62%] sm:block" />
      <h1
        className="relative text-[26px] font-semibold tracking-tight sm:text-[30px]"
        style={{ color: "var(--os-text)" }}
      >
        {OWNER.name}
      </h1>
      <p
        className="relative mt-1.5 text-[15px]"
        style={{ color: "var(--os-text-dim)" }}
      >
        {OWNER.tagline}
      </p>
    </header>
  );
}
