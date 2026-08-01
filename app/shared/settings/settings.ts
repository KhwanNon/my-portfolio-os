import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/app/shared/i18n/locale";

/**
 * Every preference the OS keeps, declared once: what it may be set to, where it
 * is remembered, what the machine says when asked, and how the answer lands on
 * the document.
 *
 * Two ideas run through the whole file and are worth separating up front:
 *
 *   - a **choice** is what the visitor picked. "System" is one of them — a real
 *     value, not the absence of one — so someone who has never opened
 *     Preferences and someone who deliberately chose to follow their device are
 *     the same case, and both track a scheme that turns at sundown.
 *   - a **value** is what that comes out as once the machine has been asked. It
 *     is what anything rendering from the setting wants, and the only one of the
 *     two the document ever carries.
 *
 * The document is where the value is in force: `<html>` holds the resolved value
 * of every preference that has a visible effect, which is what CSS matches on,
 * what the browser and assistive tech already consult, and what the pre-paint
 * script at the foot of this file writes before React exists. `localStorage`
 * holds only the choice.
 */

export type Theme = "daylight" | "dark";
export type Motion = "full" | "reduced";
export type Startup = "boot" | "instant";

/** The choice that names no value and defers to the machine instead. */
export const SYSTEM = "system";
type System = typeof SYSTEM;

/** What each preference may be set to. */
export type Choices = {
  theme: Theme | System;
  locale: Locale | System;
  motion: Motion | System;
  /** No system to defer to — no device has an opinion on how a portfolio opens. */
  startup: Startup;
};

export type PreferenceId = keyof Choices;

/** What a choice comes out as once "system" has been asked. */
export type Value<I extends PreferenceId> = Exclude<Choices[I], System>;

// ─── The declarations ────────────────────────────────────────────────────────

/** Both schemes, with a chip of each so a picker can show the choice itself. */
export const THEMES: { id: Theme; label: string; swatch: string }[] = [
  { id: "daylight", label: "Daylight", swatch: "#ffffff" },
  { id: "dark", label: "Cyber Blue", swatch: "#182035" },
];

export const MOTION_VALUES = ["full", "reduced"] as const;
export const STARTUP_VALUES = ["boot", "instant"] as const;

const PREFERS_DARK = "(prefers-color-scheme: dark)";
const PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Guarded so that asking what the machine says is safe anywhere, including a
 * server render — where the honest answer is "there is no machine to ask", and
 * the baseline stands.
 */
const isBrowser = typeof window !== "undefined";
const asks = (query: string) => isBrowser && window.matchMedia(query).matches;

interface Preference<I extends PreferenceId> {
  /** Where the choice is remembered, namespaced so keys never collide. */
  readonly key: string;
  /**
   * Every value this preference names, **baseline first** — the one in force
   * before anyone has chosen and while there is nothing to ask (a server
   * render, a browser with scripting off).
   */
  readonly values: readonly Value<I>[];
  /** What the machine says, for the preferences that can defer to it. */
  readonly system?: () => Value<I>;
  /** The media query whose changes that answer follows. */
  readonly watch?: string;
  /** The `<html>` attribute that carries the resolved value. */
  readonly attribute?: string;
}

const PREFERENCES: { [I in PreferenceId]: Preference<I> } = {
  theme: {
    key: "portfolio-os.theme",
    values: THEMES.map(({ id }) => id),
    system: () => (asks(PREFERS_DARK) ? "dark" : "daylight"),
    watch: PREFERS_DARK,
    attribute: "data-theme",
  },
  locale: {
    key: "portfolio-os.locale",
    values: LOCALES.map(({ id }) => id),
    // Only the language subtag is asked for: `th-TH` and `th` are one reader.
    system: () =>
      isBrowser && navigator.language.slice(0, 2) === "th" ? "th" : DEFAULT_LOCALE,
    attribute: "lang",
  },
  motion: {
    key: "portfolio-os.motion",
    values: MOTION_VALUES,
    system: () => (asks(PREFERS_REDUCED_MOTION) ? "reduced" : "full"),
    watch: PREFERS_REDUCED_MOTION,
    attribute: "data-motion",
  },
  startup: {
    key: "portfolio-os.startup",
    values: STARTUP_VALUES,
  },
};

// ─── Reading ─────────────────────────────────────────────────────────────────

/**
 * Choices made during this visit. Storage is where they are remembered across
 * visits, not where they are read back from: a browser that refuses to remember
 * — private mode, a full quota — still has to obey for as long as the page is
 * open, and the picker and the document must never disagree about what is set.
 */
const chosenThisVisit = new Map<PreferenceId, string>();

function remembered(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** The choice in force before anyone has made one. */
export function initialChoice<I extends PreferenceId>(id: I): Choices[I] {
  const preference = PREFERENCES[id];
  return (preference.system ? SYSTEM : preference.values[0]) as Choices[I];
}

/** The value in force while there is no machine to ask — see `values` above. */
export function baselineValue<I extends PreferenceId>(id: I): Value<I> {
  return PREFERENCES[id].values[0];
}

/** What the visitor picked, "system" included. */
export function currentChoice<I extends PreferenceId>(id: I): Choices[I] {
  const preference = PREFERENCES[id];
  const stored = chosenThisVisit.get(id) ?? remembered(preference.key);
  if (stored === SYSTEM && preference.system) return SYSTEM as Choices[I];
  return (preference.values as readonly string[]).includes(stored ?? "")
    ? (stored as Choices[I])
    : initialChoice(id);
}

/** What is actually in force — the choice, with "system" asked. */
export function currentValue<I extends PreferenceId>(id: I): Value<I> {
  const preference = PREFERENCES[id];
  const choice = currentChoice(id);
  return choice === SYSTEM && preference.system
    ? preference.system()
    : (choice as Value<I>);
}

// ─── Writing ─────────────────────────────────────────────────────────────────

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function apply<I extends PreferenceId>(id: I) {
  const { attribute } = PREFERENCES[id];
  if (attribute) document.documentElement.setAttribute(attribute, currentValue(id));
}

function applyAll() {
  (Object.keys(PREFERENCES) as PreferenceId[]).forEach((id) => apply(id));
}

export function choose<I extends PreferenceId>(id: I, choice: Choices[I]) {
  chosenThisVisit.set(id, choice);
  try {
    localStorage.setItem(PREFERENCES[id].key, choice);
  } catch {
    // Nothing to recover: the choice is in force for this visit either way, and
    // a browser that won't remember it is a browser that won't be asked to.
  }
  apply(id);
  notify();
}

/** Back to the machine's answer for everything, and to nothing remembered. */
export function resetPreferences() {
  chosenThisVisit.clear();
  Object.values(PREFERENCES).forEach((preference) => {
    try {
      localStorage.removeItem(preference.key);
    } catch {
      // As above — there is nothing left to forget.
    }
  });
  applyAll();
  notify();
}

// ─── Watching the machine ────────────────────────────────────────────────────

const WATCHED = Object.values(PREFERENCES)
  .map(({ watch }) => watch)
  .filter((query): query is string => query !== undefined);

let unwatch: (() => void)[] = [];

/**
 * The machine's own settings can change while the page is open — a scheme that
 * turns at sundown, an accessibility switch thrown mid-visit — and anything
 * following it has to move with it. Attached only while something is listening,
 * so a page that has stopped asking leaves nothing behind.
 */
export function subscribe(onChange: () => void): () => void {
  if (listeners.size === 0) {
    unwatch = WATCHED.map((query) => {
      const media = window.matchMedia(query);
      const followed = () => {
        applyAll();
        notify();
      };
      media.addEventListener("change", followed);
      return () => media.removeEventListener("change", followed);
    });
  }
  listeners.add(onChange);

  return () => {
    listeners.delete(onChange);
    if (listeners.size > 0) return;
    unwatch.forEach((stop) => stop());
    unwatch = [];
  };
}

// ─── Before the first paint ──────────────────────────────────────────────────

const literal = JSON.stringify;

/**
 * Applies every preference that shows, before anything is painted — so a
 * returning visitor never sees a flash of the wrong scheme, a beat of the wrong
 * language, or the first frame of an animation they asked not to see.
 *
 * It runs in global scope with no bundle around it, so it restates the rules
 * above in plain JavaScript rather than importing them. Keys and value lists are
 * interpolated from the declarations — those are what would drift silently — and
 * the attribute names are written out, the same way the CSS that matches them
 * is. Change a rule here and above together.
 *
 * A stored choice that isn't one of the named values falls to `null`, which is
 * exactly what "system" does: the two collapse into the same branch, as they do
 * in `currentValue`.
 */
export const SETTINGS_BOOTSTRAP = `try{
var root=document.documentElement;
var chosen=function(key,values){var v=localStorage.getItem(key);return values.indexOf(v)<0?null:v};
var asks=function(query){return matchMedia(query).matches};
root.setAttribute("data-theme",chosen(${literal(PREFERENCES.theme.key)},${literal(PREFERENCES.theme.values)})||(asks(${literal(PREFERS_DARK)})?"dark":"daylight"));
root.setAttribute("lang",chosen(${literal(PREFERENCES.locale.key)},${literal(PREFERENCES.locale.values)})||(navigator.language.slice(0,2)==="th"?"th":${literal(DEFAULT_LOCALE)}));
root.setAttribute("data-motion",chosen(${literal(PREFERENCES.motion.key)},${literal(PREFERENCES.motion.values)})||(asks(${literal(PREFERS_REDUCED_MOTION)})?"reduced":"full"));
}catch(e){}`;
