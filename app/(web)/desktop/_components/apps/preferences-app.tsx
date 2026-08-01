"use client";
import { useState } from "react";
import {
  MOTION_VALUES,
  STARTUP_VALUES,
  THEMES,
  currentValue,
  resetPreferences,
  type Choices,
  type PreferenceId,
} from "@/app/shared/settings/settings";
import { useSetting } from "@/app/shared/settings/use-setting";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { LOCALES } from "@/app/shared/i18n/locale";
import { STRINGS, type Strings } from "@/app/shared/i18n/strings";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";

/** The version page, plus one page per preference — the ids are the same ones. */
type Section = "os-version" | PreferenceId;

interface Option<C extends string> {
  value: C;
  label: string;
  /** A second line under the name, where the name alone doesn't say enough. */
  detail?: string;
  /** A colour chip ahead of the name, for a list where colour *is* the choice. */
  swatch?: string;
}

/**
 * One row of a settings list: a name on the left, a mark on the right when it is
 * the one in force. Drawn once here because all four pickers are the same object
 * with a different list behind them, and four copies is how the four of them
 * start to look different.
 */
function OptionRow({
  label,
  detail,
  active,
  activeLabel,
  onSelect,
  swatch,
}: {
  label: string;
  detail?: string;
  active: boolean;
  activeLabel: string;
  onSelect: () => void;
  swatch?: string;
}) {
  const tone = active ? "var(--os-on-accent-container)" : "var(--os-text)";

  return (
    <button
      role="radio"
      aria-checked={active}
      className="focus-ring w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer"
      style={{
        background: active ? "var(--os-accent-container)" : "var(--os-surface-3)",
        border: active ? "1px solid transparent" : "1px solid var(--os-border)",
      }}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 min-w-0">
        {swatch && (
          <div
            className="w-4 h-4 rounded-full shrink-0"
            style={{
              background: swatch,
              border: "1px solid var(--os-border-strong)",
            }}
          />
        )}
        <div className="min-w-0">
          <div className="text-[13px]" style={{ color: tone }}>
            {label}
          </div>
          {detail && (
            <div
              className="text-[11px] mt-0.5 opacity-70"
              style={{ color: active ? tone : "var(--os-text-faint)" }}
            >
              {detail}
            </div>
          )}
        </div>
      </div>
      {active && (
        <span
          className="text-[11px] font-medium shrink-0"
          style={{ color: "var(--os-on-accent-container)" }}
        >
          {activeLabel}
        </span>
      )}
    </button>
  );
}

/**
 * A preference as a list of the choices it can take, exactly one of them
 * ticked. What is ticked is the *choice*, not the value behind it — "System"
 * stays ticked while the device swings from light to dark, because following the
 * device is what was chosen and nothing about that has changed.
 */
function OptionList<I extends PreferenceId>({
  id,
  label,
  options,
}: {
  id: I;
  label: string;
  options: Option<Choices[I]>[];
}) {
  const { choice, set } = useSetting(id);
  const S = useStrings();

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="p-5 space-y-2 overflow-y-auto custom-scrollbar h-full"
    >
      {options.map((option) => (
        <OptionRow
          key={option.value}
          label={option.label}
          detail={option.detail}
          swatch={option.swatch}
          active={choice === option.value}
          activeLabel={S.prefs.active}
          onSelect={() => set(option.value)}
        />
      ))}
    </div>
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

function ThemeSection() {
  const S = useStrings();
  const { value } = useSetting("theme");
  const inForce = THEMES.find(({ id }) => id === value) ?? THEMES[0];

  return (
    <OptionList
      id="theme"
      label={S.prefs.nav.theme}
      options={[
        {
          value: "system",
          label: S.prefs.system.label,
          detail: S.prefs.system.detail(inForce.label),
          swatch: inForce.swatch,
        },
        ...THEMES.map(({ id, label, swatch }) => ({ value: id, label, swatch })),
      ]}
    />
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
function LanguageSection() {
  const S = useStrings();
  const { value } = useSetting("locale");
  const inForce = LOCALES.find(({ id }) => id === value) ?? LOCALES[0];

  return (
    <OptionList
      id="locale"
      label={S.prefs.nav.language}
      options={[
        {
          value: "system",
          label: S.prefs.system.label,
          detail: S.prefs.system.detail(inForce.endonym),
        },
        ...LOCALES.map(({ id, endonym }) => ({ value: id, label: endonym })),
      ]}
    />
  );
}

function MotionSection() {
  const S = useStrings();
  const { value } = useSetting("motion");

  return (
    <OptionList
      id="motion"
      label={S.prefs.nav.motion}
      options={[
        {
          value: "system",
          label: S.prefs.system.label,
          detail: S.prefs.system.detail(S.prefs.motion[value].label),
        },
        ...MOTION_VALUES.map((id) => ({ value: id, ...S.prefs.motion[id] })),
      ]}
    />
  );
}

function StartupSection() {
  const S = useStrings();

  return (
    <OptionList
      id="startup"
      label={S.prefs.nav.startup}
      options={STARTUP_VALUES.map((id) => ({ value: id, ...S.prefs.startup[id] }))}
    />
  );
}

export function PreferencesApp() {
  const [active, setActive] = useState<Section>("os-version");
  const { showToast } = useWindowManager();
  const S = useStrings();

  const navItems: { id: Section; label: string }[] = [
    { id: "os-version", label: S.prefs.nav.osVersion },
    { id: "theme", label: S.prefs.nav.theme },
    { id: "locale", label: S.prefs.nav.language },
    { id: "motion", label: S.prefs.nav.motion },
    { id: "startup", label: S.prefs.nav.startup },
  ];

  const reset = () => {
    resetPreferences();
    // Announced in whatever language the reset just landed on, not the one it
    // cleared — `S` above is the render's, and the render is now behind.
    showToast(STRINGS[currentValue("locale")].prefs.reset.done, "success");
  };

  return (
    <div className="h-full flex" style={{ background: "var(--os-surface)" }}>
      {/* Sidebar Nav */}
      <nav
        aria-label={S.prefs.title}
        className="shrink-0 flex flex-col py-2"
        style={{
          width: 168,
          borderRight: "1px solid var(--os-border)",
          background: "var(--os-header)",
        }}
      >
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              aria-current={isActive ? "page" : undefined}
              className="focus-ring mx-2 px-3 py-2.5 text-[13px] text-left rounded-md transition-all duration-200 cursor-pointer"
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

        {/* The way back, kept at the foot of the list rather than inside any one
            page: it undoes all of them, and belongs to none of them. */}
        <div className="mt-auto mx-2 pt-2" style={{ borderTop: "1px solid var(--os-border)" }}>
          <button
            className="focus-ring w-full px-3 py-2 text-[11px] text-left rounded-md transition-opacity duration-200 opacity-70 hover:opacity-100 cursor-pointer"
            style={{ color: "var(--os-text-dim)" }}
            onClick={reset}
          >
            {S.prefs.reset.action}
          </button>
        </div>
      </nav>

      {/* Content Panel */}
      <div className="flex-1 overflow-hidden">
        {active === "os-version" && <OsVersionSection S={S} />}
        {active === "theme" && <ThemeSection />}
        {active === "locale" && <LanguageSection />}
        {active === "motion" && <MotionSection />}
        {active === "startup" && <StartupSection />}
      </div>
    </div>
  );
}
