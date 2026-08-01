"use client";
// Full-size screenshot viewer. The strip inside a project window can only ever
// show a thumbnail — a phone screenshot at 224px is proof the app exists, not
// something anyone can read — so the strip is the index and this is the view.
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useStrings } from "@/app/shared/hooks/use-locale";

/**
 * Above every window and both bars, and below the shell's own overlays — the
 * context menu and the toasts answer to the whole desktop, and this only
 * answers to the window that opened it.
 */
const LAYER = 8500;

interface ImageLightboxProps {
  images: string[];
  /** Which one to show, or `null` when closed — the caller owns the state. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /** Names the shot in the caption and the alt text, e.g. a project's name. */
  label?: string;
}

export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
  label = "",
}: ImageLightboxProps) {
  const S = useStrings();
  const open = index !== null;

  // Wraps at both ends: with a counter on screen there is no getting lost, and
  // a dead arrow key on the last shot reads as a broken viewer.
  const step = useCallback(
    (delta: number) => {
      if (index === null || images.length === 0) return;
      onIndexChange((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  // Bound to the document rather than the overlay: the click that opens this
  // leaves focus on the thumbnail behind it, so there is nothing here for a
  // key event to land on until the viewer is tabbed into.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") return step(1);
      if (e.key === "ArrowLeft") return step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  // The overlay is mounted into `body`, so it escapes the window's own stacking
  // context and its `overflow` — a viewer clipped to the pane it opened from
  // would be a thumbnail again.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={
            label ? S.lightbox.labelled(label) : S.lightbox.unlabelled
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 grid place-items-center p-4"
          style={{ zIndex: LAYER, background: "rgba(0, 0, 0, 0.82)" }}
        >
          {/* Anything that is not the picture closes the viewer, so the picture
              itself has to stop the click before it reaches the backdrop. */}
          <motion.div
            initial={{ scale: 0.97 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center gap-3"
          >
            {/* A fixed box with the shot contained inside it: these are phone
                screenshots and web captures in the same strip, and only a box
                that holds still keeps the arrows from moving between them. */}
            <div className="relative h-[78vh] w-[86vw] max-w-[1100px]">
              <Image
                src={images[index]}
                alt={`${label} screenshot ${index + 1} of ${images.length}`}
                fill
                sizes="86vw"
                className="object-contain"
                priority
              />
            </div>

            <div
              className="text-[11px] tabular-nums"
              style={{ color: "rgba(255, 255, 255, 0.65)" }}
            >
              {label && `${label} · `}
              {index + 1} / {images.length}
            </div>
          </motion.div>

          <OverlayButton label={S.lightbox.close} onClick={onClose} side="close">
            <X size={18} strokeWidth={1.8} />
          </OverlayButton>

          {/* One shot is a picture, not a set — the arrows would have nowhere
              to go, and a control that does nothing is worse than no control. */}
          {images.length > 1 && (
            <>
              <OverlayButton
                label={S.lightbox.previous}
                onClick={() => step(-1)}
                side="left"
              >
                <ChevronLeft size={22} strokeWidth={1.8} />
              </OverlayButton>
              <OverlayButton
                label={S.lightbox.next}
                onClick={() => step(1)}
                side="right"
              >
                <ChevronRight size={22} strokeWidth={1.8} />
              </OverlayButton>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

const SIDE = {
  left: "left-3 top-1/2 -translate-y-1/2",
  right: "right-3 top-1/2 -translate-y-1/2",
  close: "right-3 top-3",
} as const;

/**
 * The viewer's own chrome. It sits on the backdrop rather than on a themed
 * surface — the picture is the only thing lit in here — so it is the one place
 * in the shell that states white and black outright instead of reading tokens:
 * a `--os-surface` control would vanish against the Daylight screenshots it is
 * laid over.
 */
function OverlayButton({
  label,
  onClick,
  side,
  children,
}: {
  label: string;
  onClick: () => void;
  side: keyof typeof SIDE;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`focus-ring absolute grid h-10 w-10 cursor-pointer place-items-center rounded-full transition-colors ${SIDE[side]}`}
      style={{
        color: "rgba(255, 255, 255, 0.9)",
        background: "rgba(255, 255, 255, 0.12)",
      }}
    >
      {children}
    </button>
  );
}
