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
  Wifi,
  WifiOff,
} from "lucide-react";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { TIME_ZONE } from "../_data/identity";
import { useSystemStatus } from "../_lib/use-system-status";

/**
 * The readouts as one object, in one size and one colour — the clock is not
 * more important than the charge, and sizing it up said it was. Colour is spent
 * on trouble only: offline, or nearly flat and not charging.
 *
 * No surface of its own: it rides in the dock, which is already a surface, and
 * a chip drawn on a bar is a box inside a box. It knows nothing about where it
 * sits — the bar placing it owns that.
 *
 * `dim`, the tier under body copy. These readings are chrome and should not
 * compete with the workspace, but the hour and the charge are things a visitor
 * reads, and the two tiers below this one are for text you scan past — `subtle`
 * gives up AA outright and may not carry a number that has to be legible.
 */
export function SystemStatus() {
  return (
    <div
      className="flex shrink-0 items-center gap-3 text-[11px]"
      style={{ color: "var(--os-text-dim)" }}
    >
      <SystemTray />
      <Clock />
    </div>
  );
}

/** Network and charge — the two things the machine knows that you did not ask. */
function SystemTray() {
  const { online, battery } = useSystemStatus();
  const S = useStrings();
  const flat = battery !== null && battery.level <= 15 && !battery.charging;

  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <span
        title={online ? S.status.online : S.status.offline}
        style={online ? undefined : { color: "var(--os-error)" }}
      >
        {online ? (
          <Wifi size={14} strokeWidth={1.8} />
        ) : (
          <WifiOff size={14} strokeWidth={1.8} />
        )}
      </span>

      {battery && (
        <span
          className="flex items-center gap-1"
          title={S.status.battery(battery.level, battery.charging)}
          style={flat ? { color: "var(--os-error)" } : undefined}
        >
          <BatteryGlyph level={battery.level} charging={battery.charging} />
          <span className="tabular-nums">{battery.level}%</span>
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
  const props = { size: 14, strokeWidth: 1.8 } as const;
  if (charging) return <BatteryCharging {...props} />;
  if (level >= 90) return <BatteryFull {...props} />;
  if (level >= 40) return <BatteryMedium {...props} />;
  return <BatteryLow {...props} />;
}

/**
 * The last word: the hour over the date, stacked and set flush right so both
 * readings share one edge and the eye takes them in a single stop.
 *
 * Same size and colour for both lines — stacking already says which is the hour
 * you glanced down for, and spending type on top of that would say it twice.
 * The date used to be held back below `sm`, where the row could not hold it
 * without truncating; two lines cost width instead of taking it, so it stays on
 * at every size now.
 */
function Clock() {
  const { date, weekday, time } = useClock(useStrings().status.dateLocale);

  return (
    <div
      className="flex shrink-0 flex-col items-end leading-tight"
      // Weekday first: it is the one thing the two lines do not already say,
      // and "Jul 29, 2026, Sat" trails it off the end of a date that has just
      // finished reading itself out.
      title={weekday ? `${weekday}, ${date}` : undefined}
    >
      <span className="tabular-nums">{time}</span>
      <span>{date}</span>
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
