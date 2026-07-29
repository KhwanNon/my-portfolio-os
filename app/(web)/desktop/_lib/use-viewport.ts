"use client";
import { useEffect, useState } from "react";

/**
 * Track whether the viewport is below `breakpoint` pixels wide.
 * Defaults to 640px (Tailwind `sm`).
 *
 * SSR-safe: starts as `false` and updates after mount.
 */
export function useIsSmallViewport(breakpoint = 640): boolean {
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const update = () => setSmall(window.innerWidth < breakpoint);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return small;
}
