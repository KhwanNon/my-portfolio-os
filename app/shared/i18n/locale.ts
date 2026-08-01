/**
 * The two languages this portfolio is written in, and the one helper every
 * piece of localized content is authored with.
 *
 * File and folder names are deliberately *not* localized — they are paths, and
 * `cd Projects` has to keep working in the terminal whichever language the
 * reader is in. What changes is what a file *says*, never what it is called.
 */
export type Locale = "en" | "th";

/** English is the baseline, so it carries no `lang` attribute of its own. */
export const DEFAULT_LOCALE: Locale = "en";

/**
 * `label` names the language in the language being read; `endonym` names it in
 * itself. The picker shows both, so "Thai" and "ไทย" are one row rather than a
 * list that reads differently depending on where you already are.
 */
export const LOCALES: { id: Locale; label: string; endonym: string }[] = [
  { id: "en", label: "English", endonym: "English" },
  { id: "th", label: "Thai", endonym: "ไทย" },
];

/**
 * Picks between two authored versions of the same thing. Generic on purpose:
 * a heading is a string, a list of highlights is an array, and prose reads far
 * better written out once per language than assembled item by item.
 */
export type Localize = <T>(en: T, th: T) => T;

export const localize =
  (locale: Locale): Localize =>
  (en, th) =>
    locale === "th" ? th : en;
