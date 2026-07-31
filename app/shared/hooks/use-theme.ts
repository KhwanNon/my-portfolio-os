"use client";
import { useCallback, useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/app/shared/constants/storage";

export type ThemeId = "daylight" | "dark";

/** Daylight is the baseline scheme, so it carries no `data-theme` attribute. */
export const DEFAULT_THEME: ThemeId = "daylight";

export const THEMES: { id: ThemeId; label: string; swatch: string }[] = [
  { id: "daylight", label: "Daylight", swatch: "#ffffff" },
  { id: "dark", label: "Cyber Blue", swatch: "#182035" },
];

/**
 * The live theme is whatever `<html data-theme>` says — the DOM is the single
 * source of truth, shared by every component that reads it (top bar toggle and
 * Preferences stay in sync without a provider).
 */
function readTheme(): ThemeId {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? attr : DEFAULT_THEME;
}

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);

  const changeTheme = useCallback((next: ThemeId) => {
    const root = document.documentElement;
    if (next === DEFAULT_THEME) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", next);
    }
    localStorage.setItem(STORAGE_KEYS.theme, next);
    listeners.forEach((notify) => notify());
  }, []);

  return { theme, changeTheme };
}
