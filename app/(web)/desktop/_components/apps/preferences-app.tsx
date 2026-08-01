"use client";
import { useState } from "react";
import { THEMES, useTheme } from "@/app/shared/hooks/use-theme";
import { useLocale, useStrings } from "@/app/shared/hooks/use-locale";
import { LOCALES } from "@/app/shared/i18n/locale";
import type { Strings } from "@/app/shared/i18n/strings";

type Section = "os-version" | "theme" | "language";

/**
 * One row of the settings list: a name on the left, a mark on the right when it
 * is the one in force. Drawn once here because the theme picker and the language
 * picker are the same object with a different list behind them, and two copies
 * is how the two of them start to look different.
 */
function OptionRow({
  label,
  active,
  activeLabel,
  onSelect,
  swatch,
}: {
  label: string;
  active: boolean;
  activeLabel: string;
  onSelect: () => void;
  /** A colour chip ahead of the name, for a list where colour *is* the choice. */
  swatch?: string;
}) {
  return (
    <button
      className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer"
      style={{
        background: active ? "var(--os-accent-container)" : "var(--os-surface-3)",
        border: active ? "1px solid transparent" : "1px solid var(--os-border)",
      }}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        {swatch && (
          <div
            className="w-4 h-4 rounded-full shrink-0"
            style={{
              background: swatch,
              border: "1px solid var(--os-border-strong)",
            }}
          />
        )}
        <span
          className="text-[13px]"
          style={{
            color: active
              ? "var(--os-on-accent-container)"
              : "var(--os-text)",
          }}
        >
          {label}
        </span>
      </div>
      {active && (
        <span
          className="text-[11px] font-medium"
          style={{ color: "var(--os-on-accent-container)" }}
        >
          {activeLabel}
        </span>
      )}
    </button>
  );
}

function OsVersionSection({ S }: { S: Strings }) {
  return (
    <div className="p-5 text-[13px] space-y-5 overflow-y-auto custom-scrollbar h-full">
      {/* Header */}
      <div
        className="pb-4"
        style={{ borderBottom: "1px solid var(--os-border)", color: "var(--os-text)" }}
      >
        <div className="font-bold text-sm">Portfolio OS</div>
        <div className="mt-1 opacity-80">{S.prefs.os.version}</div>
        <div className="mt-0.5 opacity-60">{S.prefs.os.copyright}</div>
      </div>

      {[
        [S.prefs.os.deviceHeading, S.prefs.os.device],
        [S.prefs.os.systemHeading, S.prefs.os.system],
      ].map(([heading, rows]) => (
        <div
          key={heading as string}
          className="space-y-1.5"
          style={{ color: "var(--os-text)" }}
        >
          <div className="opacity-70 font-medium mb-1">{heading as string}</div>
          {(rows as [string, string][]).map(([k, v]) => (
            <div key={k} className="flex gap-3">
              <span className="opacity-60 w-28 shrink-0">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Actions */}
      <div
        className="pt-4 flex gap-2 flex-wrap"
        style={{ borderTop: "1px solid var(--os-border)" }}
      >
        {S.prefs.os.actions.map((label) => (
          <button
            key={label}
            className="px-3 py-1.5 text-[11px] font-medium rounded-md transition-opacity hover:opacity-100 opacity-80 cursor-pointer"
            style={{
              border: "1px solid var(--os-border-strong)",
              color: "var(--os-text)",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThemeSection({ S }: { S: Strings }) {
  const { theme, changeTheme } = useTheme();

  return (
    <div className="p-5 space-y-2 overflow-y-auto custom-scrollbar h-full">
      {THEMES.map((t) => (
        <OptionRow
          key={t.id}
          label={t.label}
          swatch={t.swatch}
          active={theme === t.id}
          activeLabel={S.prefs.active}
          onSelect={() => changeTheme(t.id)}
        />
      ))}
    </div>
  );
}

/**
 * The language, which moves the whole shell the moment it is pressed — the
 * setting writes `<html lang>`, and every surface reads the language from
 * there.
 *
 * Each row names its language in itself, not in the language being read: a
 * reader who has landed in the wrong one has to be able to find their way out,
 * and "Thai" is no help to someone who only reads ไทย.
 */
function LanguageSection({ S }: { S: Strings }) {
  const { locale, changeLocale } = useLocale();

  return (
    <div className="p-5 space-y-2 overflow-y-auto custom-scrollbar h-full">
      {LOCALES.map((l) => (
        <OptionRow
          key={l.id}
          label={l.endonym}
          active={locale === l.id}
          activeLabel={S.prefs.active}
          onSelect={() => changeLocale(l.id)}
        />
      ))}
    </div>
  );
}

export function PreferencesApp() {
  const [active, setActive] = useState<Section>("os-version");
  const S = useStrings();

  const navItems: { id: Section; label: string }[] = [
    { id: "os-version", label: S.prefs.nav.osVersion },
    { id: "theme", label: S.prefs.nav.theme },
    { id: "language", label: S.prefs.nav.language },
  ];

  return (
    <div className="h-full flex" style={{ background: "var(--os-surface)" }}>
      {/* Sidebar Nav */}
      <div
        className="shrink-0 flex flex-col py-2"
        style={{
          width: 160,
          borderRight: "1px solid var(--os-border)",
          background: "var(--os-header)",
        }}
      >
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              className="mx-2 px-3 py-2.5 text-[13px] text-left rounded-md transition-all duration-200 cursor-pointer"
              style={{
                color: isActive ? "var(--os-on-accent-container)" : "var(--os-text-dim)",
                background: isActive ? "var(--os-accent-container)" : "transparent",
                fontWeight: isActive ? 500 : 400,
              }}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Content Panel */}
      <div className="flex-1 overflow-hidden">
        {active === "os-version" && <OsVersionSection S={S} />}
        {active === "theme" && <ThemeSection S={S} />}
        {active === "language" && <LanguageSection S={S} />}
      </div>
    </div>
  );
}
