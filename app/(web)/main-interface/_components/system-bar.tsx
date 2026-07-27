"use client";
import { Menu, Moon, Search, Sun, Terminal, type LucideIcon } from "lucide-react";
import { THEMES, useTheme, type ThemeId } from "@/app/shared/hooks/use-theme";

const THEME_ICON: Record<ThemeId, LucideIcon> = {
  daylight: Sun,
  dark: Moon,
  matrix: Terminal,
};

/** Top app bar of the content column — search on the left, scheme on the right. */
export function SystemBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, changeTheme } = useTheme();

  return (
    <header
      className="relative flex h-16 shrink-0 select-none items-center gap-2 px-3 sm:px-5"
      style={{
        background: "var(--os-surface-1)",
        borderBottom: "1px solid var(--os-border)",
        zIndex: 300,
      }}
    >
      <button
        onClick={onMenuClick}
        title="Open navigation"
        aria-label="Open navigation"
        className="focus-ring grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-200 hover:bg-os-surface-3 lg:hidden"
        style={{ color: "var(--os-text-dim)" }}
      >
        <Menu size={18} strokeWidth={1.8} />
      </button>

      {/* Search — the bar's centre of gravity; opens Spotlight */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("spotlight:toggle"))}
        title="Search (⌘K)"
        className="focus-ring flex h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-full bg-os-surface-3 px-4 transition-[background-color,box-shadow] duration-200 hover:bg-os-surface-1 hover:shadow-(--shadow-2) sm:max-w-3xl"
      >
        <Search
          size={18}
          strokeWidth={1.8}
          style={{ color: "var(--os-text-dim)" }}
        />
        <span
          className="flex-1 truncate text-left text-[13px]"
          style={{ color: "var(--os-text-dim)" }}
        >
          Search files, apps, and more…
        </span>
        <kbd
          className="hidden rounded-md px-1.5 py-0.5 text-[11px] font-medium sm:inline"
          style={{
            background: "var(--os-surface-1)",
            border: "1px solid var(--os-border)",
            color: "var(--os-text-faint)",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Colour scheme */}
      <div
        className="ml-auto flex shrink-0 items-center gap-0.5 rounded-full p-1"
        style={{ background: "var(--os-surface-3)" }}
      >
        {THEMES.map(({ id, label }) => {
          const Icon = THEME_ICON[id];
          const isActive = theme === id;
          return (
            <SchemeButton
              key={id}
              label={`${label} theme`}
              onClick={() => changeTheme(id)}
              pressed={isActive}
            >
              <Icon size={16} strokeWidth={1.8} />
            </SchemeButton>
          );
        })}
      </div>
    </header>
  );
}

/** One scheme in the toggle track — the chosen one rides above the others. */
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
      className="focus-ring grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition-[background-color,box-shadow] duration-200"
      style={{
        background: pressed ? "var(--os-surface-1)" : "transparent",
        boxShadow: pressed ? "var(--shadow-1)" : "none",
        color: pressed ? "var(--os-accent)" : "var(--os-text-faint)",
      }}
    >
      {children}
    </button>
  );
}
