"use client";
// What the machine has to say about itself, at the foot of the screen on the
// right. Its own file rather than the dock's, though the dock is what places
// it: the dock's business is the row of things you open, and these readings
// are not that.
import { useEffect, useState } from "react";
import {
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Volume2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { TIME_ZONE } from "../_data/identity";
import { useSystemStatus } from "../_lib/use-system-status";

/**
 * One row, read left to right: the tray icons in the accent, then the hour and
 * the date, each set off by a thin rule. No surface of its own — it rides on
 * the taskbar, which is already one. Colour other than the accent is spent on
 * trouble only: offline, or nearly flat and not charging.
 */
export function SystemStatus() {
  return (
    <div
      className="font-os-pixel flex shrink-0 items-center gap-3 px-3 text-[14px] sm:gap-4 sm:px-4"
      style={{ color: "var(--os-text)" }}
    >
      <SystemTray />
      <Clock />
    </div>
  );
}

/** The thin upright rule between the readings. */
function Divider({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`h-4 w-px shrink-0 ${className}`}
      style={{ background: "var(--os-border-strong)" }}
    />
  );
}

/**
 * Network, sound and charge. Network and charge are live readings; the speaker
 * is the tray's furniture — this machine plays nothing, so it has no state to
 * show and no control behind it.
 */
function SystemTray() {
  const { online, battery } = useSystemStatus();
  const S = useStrings();
  const flat = battery !== null && battery.level <= 15 && !battery.charging;

  return (
    <div
      className="flex shrink-0 items-center gap-3"
      style={{ color: "var(--os-accent)" }}
    >
      <span
        title={online ? S.status.online : S.status.offline}
        style={online ? undefined : { color: "var(--os-error)" }}
      >
        {online ? (
          <Wifi size={16} strokeWidth={2.2} />
        ) : (
          <WifiOff size={16} strokeWidth={2.2} />
        )}
      </span>

      <span aria-hidden className="max-sm:hidden">
        <Volume2 size={16} strokeWidth={2.2} />
      </span>

      {battery && (
        <span
          title={S.status.battery(battery.level, battery.charging)}
          aria-label={S.status.battery(battery.level, battery.charging)}
          style={flat ? { color: "var(--os-error)" } : undefined}
        >
          <BatteryGlyph level={battery.level} charging={battery.charging} />
        </span>
      )}
    </div>
  );
}

/**
 * Which drawing tells the truth about the charge. The icon carries the level
 * and the number states it. It runs a shade larger than the type beside it: an
 * 11px icon next to 11px text reads as the smaller of the two, and matching
 * them optically is what matching them means.
 */
function BatteryGlyph({
  level,
  charging,
}: {
  level: number;
  charging: boolean;
}) {
  const props = { size: 18, strokeWidth: 2.2 } as const;
  if (charging) return <BatteryCharging {...props} />;
  if (level >= 90) return <BatteryFull {...props} />;
  if (level >= 40) return <BatteryMedium {...props} />;
  return <BatteryLow {...props} />;
}

/**
 * The last word: the hour, then the date, on one line with a rule between
 * them and before them. On a phone the row has no room for the date, so it
 * keeps the hour and leaves the date to the tooltip.
 */
function Clock() {
  const { date, weekday, time } = useClock(useStrings().status.dateLocale);

  return (
    <div
      className="flex shrink-0 items-center gap-3 whitespace-nowrap sm:gap-4"
      // Weekday first: it is the one thing the row does not already say.
      title={weekday ? `${weekday}, ${date}` : undefined}
    >
      <Divider />
      <span className="tabular-nums">{time}</span>
      <Divider className="max-sm:hidden" />
      <span className="max-sm:hidden">{date}</span>
    </div>
  );
}

/**
 * The owner's wall clock, in 12 hours with the half of the day named, and the
 * date carrying its year. The shell reads as a machine, but the person reading
 * it does not — and a visitor asking what time it is where this was built wants
 * the answer in the words they keep time in.
 *
 * Ticks every second but only re-renders on a change it can show, which is the
 * minute — the alternative is re-rendering sixty times an hour for nothing.
 *
 * It reads Bangkok, not the visitor's own zone; see `TIME_ZONE`. Renders empty
 * on the server and fills in on the first tick: the time is by definition
 * different by the time the page is read, so there is nothing to hydrate and no
 * mismatch to warn about.
 *
 * The words — the month, the half of the day, the weekday — come out in the
 * language the shell is set to, because they are words. The place they are
 * measured from does not move with it.
 */
function useClock(dateLocale: string) {
  const [display, setDisplay] = useState({ date: "", weekday: "", time: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const zone = { timeZone: TIME_ZONE } as const;
      // Kept apart rather than formatted as one string: the row shows the date
      // and holds the weekday back for the tooltip, and only the caller knows
      // which of them it has room for.
      const next = {
        date: now.toLocaleDateString(dateLocale, {
          ...zone,
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        weekday: now.toLocaleDateString(dateLocale, { ...zone, weekday: "short" }),
        // `numeric` rather than `2-digit`: a 12-hour clock that says "02:30 PM"
        // is a 24-hour clock wearing a suffix. Nothing shifts as the hour drops
        // a digit — the date line under it is the wider of the two and is what
        // sets the block's width.
        time: now.toLocaleTimeString(dateLocale, {
          ...zone,
          hour12: true,
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setDisplay((current) =>
        current.date === next.date &&
        current.weekday === next.weekday &&
        current.time === next.time
          ? current
          : next,
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [dateLocale]);

  return display;
}
