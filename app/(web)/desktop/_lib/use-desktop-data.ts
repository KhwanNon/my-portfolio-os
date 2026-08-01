"use client";
import { useLocale } from "@/app/shared/hooks/use-locale";
import { desktopData, type DesktopData } from "../_data/file-system-data";

/**
 * The drive, in the language currently set. Every surface that reads portfolio
 * content goes through here, so a language change moves the whole shell at once
 * rather than one component at a time.
 *
 * Cheap to call: the tree for a language is built on the first ask and kept, so
 * this is a map lookup on every render after that.
 */
export function useDesktopData(): DesktopData {
  return desktopData(useLocale());
}
