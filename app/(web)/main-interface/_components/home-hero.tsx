"use client";
import { useSyncExternalStore } from "react";
import { OWNER } from "../_data/identity";
import { MountainGlyph } from "./mountain-glyph";

/** Which greeting the hour calls for. Ordered latest-first, so the first hit wins. */
const GREETINGS: { from: number; text: string }[] = [
  { from: 18, text: "Good evening" },
  { from: 12, text: "Good afternoon" },
  { from: 0, text: "Good morning" },
];

function greetingFor(hour: number): string {
  return GREETINGS.find(({ from }) => hour >= from)!.text;
}

/** The clock is read once, on the client — there is nothing to subscribe to. */
const noSubscribe = () => () => {};
const localGreeting = () => greetingFor(new Date().getHours());
const serverGreeting = () => greetingFor(0);

/**
 * The home screen's opening line: the OS greeting its owner, and what this
 * machine is for. The visitor's hour is unknowable on the server, so the markup
 * renders with the earliest greeting and settles during hydration — which is
 * what `useSyncExternalStore`'s server snapshot is for.
 */
export function HomeHero() {
  const greeting = useSyncExternalStore(
    noSubscribe,
    localGreeting,
    serverGreeting,
  );

  return (
    <header className="relative shrink-0 pb-4">
      {/* Pulled down through the column gap so the range stands on the card's
          top edge rather than floating above it. Only from `lg`: narrower than
          that, the band has no room to clear the greeting. */}
      <MountainGlyph className="pointer-events-none absolute -bottom-4 right-0 hidden h-20 w-80 lg:block" />
      <h1
        className="relative text-[20px] font-semibold leading-tight tracking-tight sm:text-[24px]"
        style={{ color: "var(--os-text)" }}
      >
        {greeting}, {OWNER.alias}
      </h1>
      <p
        className="relative mt-0.5 text-[13px]"
        style={{ color: "var(--os-text-dim)" }}
      >
        {OWNER.tagline}
      </p>
    </header>
  );
}
