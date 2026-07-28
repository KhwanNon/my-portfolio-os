"use client";
import { useEffect, useState } from "react";

/** What the shell can honestly report about the machine it is running on. */
export interface SystemStatus {
  online: boolean;
  /**
   * Charge and whether it is climbing, or `null` where the browser won't say —
   * the Battery Status API ships in Chrome and Edge and nowhere else, so the
   * readout has to be able to not exist.
   */
  battery: { level: number; charging: boolean } | null;
}

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
}

/** The Battery Status API is optional, so it isn't in the DOM lib's `Navigator`. */
type BatteryCapableNavigator = Navigator & {
  getBattery?: () => Promise<BatteryManager>;
};

export function useSystemStatus(): SystemStatus {
  const [online, setOnline] = useState(true);
  const [battery, setBattery] = useState<SystemStatus["battery"]>(null);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    const getBattery = (navigator as BatteryCapableNavigator).getBattery;
    if (!getBattery) return;

    let cell: BatteryManager | null = null;
    let disposed = false;
    const sync = () =>
      cell &&
      setBattery({
        level: Math.round(cell.level * 100),
        charging: cell.charging,
      });

    getBattery.call(navigator).then((found) => {
      if (disposed) return;
      cell = found;
      sync();
      found.addEventListener("levelchange", sync);
      found.addEventListener("chargingchange", sync);
    });

    return () => {
      disposed = true;
      cell?.removeEventListener("levelchange", sync);
      cell?.removeEventListener("chargingchange", sync);
    };
  }, []);

  return { online, battery };
}
