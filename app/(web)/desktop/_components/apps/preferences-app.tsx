"use client";
import { useState } from "react";
import { Info, Globe as GlobeIcon, Monitor, Power, RotateCcw } from "lucide-react";
import {
  MOTION_VALUES,
  STARTUP_VALUES,
  currentValue,
  resetPreferences,
  type PreferenceId,
} from "@/app/shared/settings/settings";
import { useSetting } from "@/app/shared/settings/use-setting";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { LOCALES } from "@/app/shared/i18n/locale";
import { STRINGS, type Strings } from "@/app/shared/i18n/strings";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { Globe } from "./ui/sheet";
import { PixelGlyph, type PixelSprite } from "../pixel-glyph";

/** The version page, plus one page per preference — the ids are the same ones. */
type Section = "os-version" | PreferenceId;

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
}: {
  label: string;
  detail?: string;
  active: boolean;
  activeLabel: string;
  onSelect: () => void;
}) {
  return (
    <button
      role="radio"
      aria-checked={active}
      className={`focus-ring flex w-full cursor-pointer items-center justify-between gap-3 border-2 px-4 py-3 text-left ${
        active
          ? "border-os-accent bg-os-accent-container/60"
          : "border-os-border hover:border-os-border-strong hover:bg-os-accent-container/30"
      }`}
      onClick={onSelect}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <div
            className="font-os-pixel text-[15px]"
            style={{ color: active ? "var(--os-accent)" : "var(--os-text)" }}
          >
            {label}
          </div>
          {detail && (
            <div
              className="font-os-mono mt-0.5 text-[12px]"
              style={{ color: "var(--os-text-faint)" }}
            >
              {detail}
            </div>
          )}
        </div>
      </div>
      {active && (
        <span className="font-os-pixel shrink-0 bg-os-accent px-2 py-0.5 text-[12px] text-os-on-accent">
          {activeLabel}
        </span>
      )}
    </button>
  );
}

/**
 * About this machine, laid out like a game's system screen: the name large, the
 * build under it, a globe in the corner, and two tables of specifications.
 */
function OsVersionSection({ S }: { S: Strings }) {
  return (
    <div className="custom-scrollbar @container h-full overflow-y-auto px-6 py-6 @xl:px-8">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h2
            className="font-os-pixel text-[clamp(28px,7cqw,48px)] font-bold leading-none text-os-accent"
            style={{ textShadow: "3px 3px 0 #000" }}
          >
            Portfolio OS
          </h2>
          <p className="font-os-mono mt-4 text-[15px]">{S.prefs.os.version}</p>
          <p
            className="font-os-mono mt-2 text-[12px]"
            style={{ color: "var(--os-text-dim)" }}
          >
            {S.prefs.os.copyright}
          </p>
        </div>
        <Globe bracketed />
      </div>

      {[
        [S.prefs.os.deviceHeading, S.prefs.os.device],
        [S.prefs.os.systemHeading, S.prefs.os.system],
      ].map(([heading, rows]) => (
        <section
          key={heading as string}
          className="mt-6 pt-6"
          style={{ borderTop: "2px solid var(--os-border-strong)" }}
        >
          <h3 className="font-os-pixel mb-4 text-[18px] font-semibold text-os-accent">
            {heading as string}
          </h3>
          <dl className="font-os-mono grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-6 gap-y-3 text-[14px]">
            {(rows as [string, string][]).map(([k, v]) => (
              <div key={k} className="contents">
                <dt style={{ color: "var(--os-text-faint)" }}>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>
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
function LanguageSection() {
  const S = useStrings();
  const { value, choice, set } = useSetting("locale");
  const inForce = LOCALES.find(({ id }) => id === value) ?? LOCALES[0];

  return (
    <div className="custom-scrollbar @container h-full overflow-y-auto p-6">
      <SectionHeader
        Icon={GlobeIcon}
        title={S.prefs.nav.language}
        intro={S.prefs.languageIntro}
      />

      <div role="radiogroup" aria-label={S.prefs.nav.language} className="space-y-4">
        {LOCALES.map(({ id, endonym }) => (
          <SettingCard
            key={id}
            label={endonym}
            detail={LANGUAGE_CARDS[id].detail}
            sprite={LANGUAGE_CARDS[id].sprite}
            active={choice === id}
            activeLabel={S.prefs.active}
            onSelect={() => set(id)}
          />
        ))}

        {/* Following the device stays a choice, below the two pictures rather
            than among them: it is not a language of its own. */}
        <OptionRow
          label={S.prefs.system.label}
          detail={S.prefs.system.detail(inForce.endonym)}
          active={choice === "system"}
          activeLabel={S.prefs.active}
          onSelect={() => set("system")}
        />
      </div>
    </div>
  );
}

/**
 * What each language card shows. The line under the name is written in that
 * language, not the one being read — the same reason the name is: a reader who
 * has landed in the wrong one has to be able to find their way out.
 */
const LANGUAGE_CARDS: Record<(typeof LOCALES)[number]["id"], { sprite: PixelSprite; detail: string }> = {
  en: { sprite: "langEn", detail: "System language will be English." },
  th: { sprite: "langTh", detail: "ระบบจะใช้ภาษาไทย" },
};

/**
 * A page's opening: the same icon its sidebar row carries, the page's name, and
 * one line on what it decides.
 */
function SectionHeader({
  Icon,
  title,
  intro,
}: {
  Icon: typeof Info;
  title: string;
  intro: string;
}) {
  return (
    <header className="mb-5 flex items-center gap-4">
      <Icon size={44} strokeWidth={1.6} className="shrink-0 text-os-accent" />
      <div>
        <h2 className="font-os-pixel text-[24px] font-bold leading-none">{title}</h2>
        <p
          className="font-os-mono mt-2 text-[13px]"
          style={{ color: "var(--os-text-dim)" }}
        >
          {intro}
        </p>
      </div>
    </header>
  );
}

/**
 * One choice as a card: a sprite of what it means, then its name and a line.
 * The one in force is lit and badged; the rest show an empty radio.
 */
function SettingCard({
  label,
  detail,
  sprite,
  active,
  activeLabel,
  onSelect,
}: {
  label: string;
  detail: string;
  sprite: PixelSprite;
  active: boolean;
  activeLabel: string;
  onSelect: () => void;
}) {
  return (
    <button
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={`focus-ring group flex w-full cursor-pointer items-stretch overflow-hidden border-[3px] text-left ${
        active ? "border-os-accent" : "border-os-border-strong hover:border-os-accent/70"
      }`}
    >
      <span
        className={`grid w-16 shrink-0 place-items-center border-r-[3px] bg-black py-3 @lg:w-20 ${
          active
            ? "border-os-accent text-os-accent"
            : "border-os-border-strong text-os-text-subtle group-hover:text-os-text-faint"
        }`}
      >
        <PixelGlyph sprite={sprite} scale={2} />
      </span>
      <span className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3">
        <span className="min-w-0 flex-1">
          <span
            className="font-os-pixel block text-[18px] font-bold @lg:text-[20px]"
            style={{ color: active ? "var(--os-text)" : "var(--os-text-dim)" }}
          >
            {label}
          </span>
          <span
            className="font-os-mono mt-1 block text-[12px]"
            style={{ color: "var(--os-text-dim)" }}
          >
            {detail}
          </span>
        </span>
        {active ? (
          <span className="font-os-pixel shrink-0 bg-os-accent px-3 py-1 text-[14px] font-semibold text-os-on-accent">
            {activeLabel}
          </span>
        ) : (
          <span
            aria-hidden
            className="mt-1 h-6 w-6 shrink-0 rounded-full border-2 border-os-border-strong group-hover:border-os-accent"
          />
        )}
      </span>
    </button>
  );
}

/** What each motion choice draws: a ball in flight, or one at rest. */
const MOTION_SPRITES: Record<(typeof MOTION_VALUES)[number], PixelSprite> = {
  full: "motionFull",
  reduced: "motionReduced",
};

function MotionSection() {
  const S = useStrings();
  const { value, choice, set } = useSetting("motion");

  return (
    <div className="custom-scrollbar @container h-full overflow-y-auto p-6">
      <SectionHeader
        Icon={Monitor}
        title={S.prefs.nav.motion}
        intro={S.prefs.motionIntro}
      />
      <div role="radiogroup" aria-label={S.prefs.nav.motion} className="space-y-4">
        {MOTION_VALUES.map((id) => (
          <SettingCard
            key={id}
            label={S.prefs.motion[id].label}
            detail={S.prefs.motion[id].detail}
            sprite={MOTION_SPRITES[id]}
            active={choice === id}
            activeLabel={S.prefs.active}
            onSelect={() => set(id)}
          />
        ))}
        <OptionRow
          label={S.prefs.system.label}
          detail={S.prefs.system.detail(S.prefs.motion[value].label)}
          active={choice === "system"}
          activeLabel={S.prefs.active}
          onSelect={() => set("system")}
        />
      </div>
    </div>
  );
}

/** What each start-up choice draws: a screen counting up, or a bolt straight in. */
const STARTUP_SPRITES: Record<(typeof STARTUP_VALUES)[number], PixelSprite> = {
  boot: "bootSequence",
  instant: "bootInstant",
};

function StartupSection() {
  const S = useStrings();
  const { choice, set } = useSetting("startup");

  return (
    <div className="custom-scrollbar @container h-full overflow-y-auto p-6">
      <SectionHeader
        Icon={Power}
        title={S.prefs.nav.startup}
        intro={S.prefs.startupIntro}
      />
      <div role="radiogroup" aria-label={S.prefs.nav.startup} className="space-y-4">
        {STARTUP_VALUES.map((id) => (
          <SettingCard
            key={id}
            label={S.prefs.startup[id].label}
            detail={S.prefs.startup[id].detail}
            sprite={STARTUP_SPRITES[id]}
            active={choice === id}
            activeLabel={S.prefs.active}
            onSelect={() => set(id)}
          />
        ))}
      </div>
    </div>
  );
}

export function PreferencesApp() {
  const [active, setActive] = useState<Section>("os-version");
  const { showToast } = useWindowManager();
  const S = useStrings();

  const navItems: { id: Section; label: string; Icon: typeof Info }[] = [
    { id: "os-version", label: S.prefs.nav.osVersion, Icon: Info },
    { id: "locale", label: S.prefs.nav.language, Icon: GlobeIcon },
    { id: "motion", label: S.prefs.nav.motion, Icon: Monitor },
    { id: "startup", label: S.prefs.nav.startup, Icon: Power },
  ];

  const reset = () => {
    resetPreferences();
    // Announced in whatever language the reset just landed on, not the one it
    // cleared — `S` above is the render's, and the render is now behind.
    showToast(STRINGS[currentValue("locale")].prefs.reset.done, "success");
  };

  return (
    <div className="flex h-full" style={{ background: "#020a05", color: "var(--os-text)" }}>
      {/* Sidebar: one row per page, the open one boxed in the accent. */}
      <nav
        aria-label={S.prefs.title}
        className="flex w-14 shrink-0 flex-col gap-1 py-3 sm:w-52"
        style={{ borderRight: "2px solid var(--os-border-strong)" }}
      >
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              title={label}
              className={`focus-ring font-os-pixel mx-2 flex cursor-pointer items-center gap-3 border-2 px-2.5 py-2.5 text-left text-[15px] sm:px-3 ${
                isActive
                  ? "border-os-accent bg-os-accent-container/50 text-os-text"
                  : "border-transparent text-os-text-dim hover:bg-os-accent-container/30 hover:text-os-text"
              }`}
              onClick={() => setActive(id)}
            >
              <Icon size={20} strokeWidth={2.2} className="shrink-0 text-os-accent" />
              <span className="max-sm:sr-only">{label}</span>
            </button>
          );
        })}

        {/* The way back, kept at the foot of the list rather than inside any one
            page: it undoes all of them, and belongs to none of them. */}
        <div
          className="mx-2 mt-auto pt-2"
          style={{ borderTop: "2px solid var(--os-border-strong)" }}
        >
          <button
            aria-label={S.prefs.reset.action}
            title={S.prefs.reset.action}
            className="focus-ring font-os-pixel flex w-full cursor-pointer items-center gap-3 px-2.5 py-2.5 text-left text-[14px] text-os-text-dim hover:text-os-text sm:px-3"
            onClick={reset}
          >
            <RotateCcw size={18} strokeWidth={2.2} className="shrink-0 text-os-accent" />
            <span className="max-sm:sr-only">{S.prefs.reset.action}</span>
          </button>
        </div>
      </nav>

      {/* Content Panel */}
      <div className="flex-1 overflow-hidden">
        {active === "os-version" && <OsVersionSection S={S} />}
        {active === "locale" && <LanguageSection />}
        {active === "motion" && <MotionSection />}
        {active === "startup" && <StartupSection />}
      </div>
    </div>
  );
}
