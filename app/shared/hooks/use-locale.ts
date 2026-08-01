"use client";
import { useSetting } from "@/app/shared/settings/use-setting";
import type { Locale } from "@/app/shared/i18n/locale";
import { STRINGS, type Strings } from "@/app/shared/i18n/strings";

/**
 * The language in force — the `locale` preference with "system" already asked.
 * Content authored in both languages picks its side from this; the shell picks
 * its wording from `useStrings` below.
 */
export function useLocale(): Locale {
  return useSetting("locale").value;
}

/** The shell's own wording, in the language currently set. */
export function useStrings(): Strings {
  return STRINGS[useLocale()];
}
