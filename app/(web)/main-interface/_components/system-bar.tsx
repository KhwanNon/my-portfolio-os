"use client";
import { Menu, Moon, Search, Sun, type LucideIcon } from "lucide-react";
import { THEMES, useTheme, type ThemeId } from "@/app/shared/hooks/use-theme";

const THEME_ICON: Record<ThemeId, LucideIcon> = {
  daylight: Sun,
  dark: Moon,
};

/** Top app bar of the content column — search on the left, scheme on the right. */
export function SystemBar({
  navOpen,
  onMenuClick,
}: {
  navOpen: boolean;
  onMenuClick: () => void;
}) {
  const { theme, changeTheme } = useTheme();

  return (
    <header
      className="relative flex shrink-0 select-none items-center gap-2.5 px-4 sm:px-6"
      style={{
        height: "var(--os-bar-h)",
        background: "var(--os-surface-1)",
        borderBottom: "1px solid var(--os-border)",
        zIndex: 300,
      }}
    >
      <button
        onClick={onMenuClick}
        title="Open navigation"
        aria-label="Open navigation"
        aria-expanded={navOpen}
        aria-controls="shell-navigation"
        className="focus-ring grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-200 hover:bg-os-surface-3 lg:hidden"
        style={{ color: "var(--os-text-dim)" }}
      >
        <Menu size={18} strokeWidth={1.8} />
      </button>

      {/* Search — the bar's centre of gravity; opens Spotlight */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("spotlight:toggle"))}
        title="Search (⌘K)"
        className="focus-ring flex h-9 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-full bg-os-surface-3 pl-4 pr-2.5 transition-[background-color,box-shadow] duration-200 hover:bg-os-surface-1 hover:shadow-(--shadow-2) sm:max-w-176"
      >
        <Search
          size={17}
          strokeWidth={1.8}
          className="shrink-0"
          style={{ color: "var(--os-text-dim)" }}
        />
        <span
          className="flex-1 truncate text-left text-[13px]"
          style={{ color: "var(--os-text-dim)" }}
        >
          Search files, apps, and more…
        </span>
        <kbd
          className="hidden shrink-0 rounded-xs px-1.5 py-0.5 text-[11px] font-medium sm:inline"
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
        className="ml-auto flex shrink-0 items-center gap-0.5 rounded-full p-0.5"
        style={{ background: "var(--os-surface-3)" }}
      >
        {THEMES.map(({ id, label }) => {
          const Icon = THEME_ICON[id];
          return (
            <SchemeButton
              key={id}
              label={`${label} theme`}
              onClick={() => changeTheme(id)}
              pressed={theme === id}
            >
              <Icon size={16} strokeWidth={1.8} />
            </SchemeButton>
          );
        })}
      </div>
    </header>
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
