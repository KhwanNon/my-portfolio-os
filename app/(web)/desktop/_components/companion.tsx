"use client";
// The welcome party: Khwan and his cat, in an RPG dialogue box at the foot of
// the desktop. They take turns, a line at a time, typed out the way a game
// talks; a click finishes the line or moves to the next, and the box can be
// put away for the rest of the visit.
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { localize } from "@/app/shared/i18n/locale";
import { useLocale } from "@/app/shared/hooks/use-locale";
import { useSetting } from "@/app/shared/settings/use-setting";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { companionLines, COMPANION_NAMES, type Speaker } from "../_data/companion";
import { useDesktopData } from "../_lib/use-desktop-data";
import { PixelGlyph } from "./pixel-glyph";

const PORTRAIT: Record<Speaker, string> = {
  khwan: "/assets/logo.webp",
  cat: "/assets/images/cat.webp",
};

/** Remembered for the visit only: a new visit is a new hello. */
const DISMISSED_KEY = "portfolio-os.companion-dismissed";
/** Characters per tick of the typewriter, and the tick. */
const TYPE_MS = 28;

function wasDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

/** Motion in whole frames, the way a sprite animates. */
const STEPPED = (t: number) => Math.ceil(t * 3) / 3;

export function Companion() {
  const locale = useLocale();
  const L = localize(locale);
  const lines = companionLines(L);
  const { value: motionPref } = useSetting("motion");
  const instant = motionPref === "reduced";
  const { openFile } = useWindowManager();
  const { fileSystem } = useDesktopData();

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);

  // Arrives a beat after the desktop does, unless already sent away this visit.
  useEffect(() => {
    if (wasDismissed()) return;
    const id = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  const line = lines[index];
  const full = line.text.length;
  const typed = instant ? full : Math.min(shown, full);
  const done = typed >= full;

  // The typewriter: a character at a time, until the line is out.
  useEffect(() => {
    if (!open || instant || shown >= full) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), TYPE_MS);
    return () => window.clearTimeout(id);
  }, [open, instant, shown, full]);

  const advance = () => {
    if (!done) return setShown(full);
    setIndex((i) => (i + 1) % lines.length);
    setShown(0);
  };

  const dismiss = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // A private window keeps no memory; the box simply returns next load.
    }
  };

  // The portrait is a door: Khwan opens his profile, the cat opens the drive.
  const openSpeaker = () => {
    const id = line.speaker === "khwan" ? "profile" : "c-drive";
    const node = fileSystem.find((n) => n.id === id);
    if (node) openFile(node);
  };

  const last = index === lines.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="dialog"
          aria-label={COMPANION_NAMES[line.speaker](L)}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.18, ease: STEPPED }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          className="pixel-box os-window absolute bottom-4 right-4 z-30 w-[min(520px,calc(100%-2rem))] bg-[#020a05] max-sm:left-4 max-sm:right-4 max-sm:w-auto"
          data-active="true"
        >
          {/* Name tab, like a game's speaker plate. */}
          <div className="font-os-pixel absolute -top-[19px] left-3 bg-os-accent px-2.5 py-0.5 text-[13px] font-bold tracking-[0.14em] text-os-on-accent">
            {COMPANION_NAMES[line.speaker](L)}
          </div>

          <button
            onClick={dismiss}
            aria-label={L("Dismiss", "ปิด")}
            title={L("Dismiss", "ปิด")}
            className="focus-ring pixel-btn absolute right-2 top-2 grid h-[22px] w-[24px] cursor-pointer place-items-center bg-os-surface-3 text-os-text hover:bg-os-error hover:text-white"
          >
            <PixelGlyph sprite="close" />
          </button>

          <div className="flex gap-4 p-4 pt-5">
            <button
              onClick={openSpeaker}
              title={line.speaker === "khwan" ? "Profile.ui" : "C-DRIVE"}
              className="focus-ring group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden border-2 border-os-border-strong bg-black hover:border-os-accent sm:h-24 sm:w-24"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={line.speaker}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.12, ease: STEPPED }}
                  className="absolute inset-0"
                >
                  <Image
                    src={PORTRAIT[line.speaker]}
                    alt=""
                    fill
                    sizes="96px"
                    className="pixelated object-cover group-hover:scale-105"
                  />
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              onClick={advance}
              className="focus-ring flex min-h-20 min-w-0 flex-1 cursor-pointer flex-col pr-6 text-left sm:min-h-24"
            >
              <p className="font-os-mono text-[14px] leading-relaxed">
                {line.text.slice(0, typed)}
                {/* The rest, held invisible, so the box is its final size from
                    the first letter and nothing below it jumps. */}
                <span aria-hidden className="invisible">
                  {line.text.slice(typed)}
                </span>
              </p>
              <span className="mt-auto flex items-center justify-end gap-2 pt-2">
                <span className="flex gap-1">
                  {lines.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 ${i === index ? "bg-os-accent" : "bg-os-border-strong"}`}
                    />
                  ))}
                </span>
                {done && (
                  <span className="font-os-pixel flex items-center gap-1 text-[12px] text-os-accent">
                    {last ? L("AGAIN", "อีกครั้ง") : L("NEXT", "ต่อไป")}
                    <span className="pixel-nudge rotate-90">
                      <PixelGlyph sprite="pointer" />
                    </span>
                  </span>
                )}
              </span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
