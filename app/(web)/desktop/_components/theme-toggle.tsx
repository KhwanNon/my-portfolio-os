"use client";
import { Moon, Sun, type LucideIcon } from "lucide-react";
import { THEMES, type Theme } from "@/app/shared/settings/settings";
import { useSetting } from "@/app/shared/settings/use-setting";
import { useStrings } from "@/app/shared/hooks/use-locale";

const THEME_ICON: Record<Theme, LucideIcon> = {
  daylight: Sun,
  dark: Moon,
};

/**
 * The colour scheme, as a track with one raised pill on it. Both schemes stay
 * on screen rather than one button that swaps its own face: a single icon has
 * to mean either "you are here" or "go there" and cannot say which, and this
 * shows the state and the choice in the same object.
 *
 * It carries its own surface and shadow because it floats on the desktop now
 * rather than riding in a bar — chrome that sits on the workspace has to be
 * legible over whatever the workspace happens to be. It knows nothing about
 * where it sits; the surface placing it owns that, the way the craft card is
 * placed.
 *
 * It shows the scheme in force, never the preference behind it: on "System" the
 * raised pill is whichever scheme the device is currently in, which is the true
 * answer to "you are here". Pressing either one names it outright — going back
 * to following the device is a decision, and decisions live in Preferences.
 */
export function ThemeToggle() {
  const { value: theme, set } = useSetting("theme");
  const S = useStrings();

  return (
    <div
      role="group"
      aria-label={S.theme.group}
      className="flex shrink-0 items-center gap-0.5 rounded-full p-0.5"
      style={{
        background: "var(--os-surface-1)",
        border: "1px solid var(--os-border)",
        boxShadow: "var(--shadow-1)",
      }}
    >
      {THEMES.map(({ id, label }) => {
        const Icon = THEME_ICON[id];
        return (
          <SchemeButton
            key={id}
            label={S.theme.option(label)}
            onClick={() => set(id)}
            pressed={theme === id}
          >
            <Icon size={16} strokeWidth={1.8} />
          </SchemeButton>
        );
      })}
    </div>
  );
}

/** One scheme in the toggle track — the chosen one rides above the other. */
function SchemeButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      className="focus-ring grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition-[background-color,color] duration-200"
      style={{
        background: pressed ? "var(--os-surface-3)" : "transparent",
        color: pressed ? "var(--os-accent)" : "var(--os-text-faint)",
      }}
    >
      {children}
    </button>
  );
}
