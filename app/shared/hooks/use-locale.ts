"use client";
import { useCallback, useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/app/shared/constants/storage";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/app/shared/i18n/locale";
import { STRINGS, type Strings } from "@/app/shared/i18n/strings";

/**
 * The live language is whatever `<html lang>` says — the DOM is the single
 * source of truth, exactly as it is for the colour scheme. Every component that
 * reads it stays in step without a provider, and the attribute is the one the
 * browser and assistive tech were already going to consult.
 */
function readLocale(): Locale {
  const attr = document.documentElement.lang;
  return isLocale(attr) ? attr : DEFAULT_LOCALE;
}

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribe, readLocale, () => DEFAULT_LOCALE);

  const changeLocale = useCallback((next: Locale) => {
    document.documentElement.lang = next;
    localStorage.setItem(STORAGE_KEYS.locale, next);
    listeners.forEach((notify) => notify());
  }, []);

  return { locale, changeLocale };
}

/** The shell's own wording, in the language currently set. */
export function useStrings(): Strings {
  return STRINGS[useLocale().locale];
}
