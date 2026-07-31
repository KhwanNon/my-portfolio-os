"use client";
// The desktop proper: the home column centred in the space, and the craft card
// holding the corner. Nothing is laid out in a grid — the rail carries every
// shortcut and is never off screen, so the surface is a place to arrive at
// rather than a place to store things. Windows float above this; it is what
// they come back to.
import { CraftCard } from "./craft-card";
import { HomeHero } from "./home-hero";
import { ThemeToggle } from "./theme-toggle";

export function DesktopSurface() {
  return (
    <div className="desktop-surface flex min-h-full flex-col">
      {/* Top right: the one setting the shell exposes, in the corner a machine
          keeps its settings in. Opposite the craft card on the diagonal, so the
          two things pinned to the surface hold corners rather than a side. */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      {/* The column takes the whole surface and centres in it. The extra room
          underneath on small screens is the craft card's: the card is pinned to
          a corner that, on a phone, is directly below the column. */}
      <div className="flex flex-1 items-center justify-center px-6 pb-44 pt-16 sm:pb-20">
        <HomeHero />
      </div>

      {/* Bottom right: the corner the eye lands on last — right for a statement
          you read once, not a thing you reach for. It counterweights the centred
          column rather than sitting in it. Capped against the surface so it
          never eats a narrow desktop whole. */}
      <div className="absolute bottom-4 right-4 w-64 max-w-[calc(100%-2rem)]">
        <CraftCard />
      </div>
    </div>
  );
}
