"use client";
import { useState } from "react";
import Image from "next/image";
import type { SlideFileData } from "@/app/shared/types/file-system";

export function SlideRenderer({ data }: { data: SlideFileData }) {
  const [current, setCurrent] = useState(0);
  const total = data.images.length;

  if (total === 0) {
    return (
      <div
        className="h-full flex items-center justify-center text-xs tracking-widest opacity-40"
        style={{ color: "var(--os-accent)" }}
      >
        NO_SLIDES_FOUND
      </div>
    );
  }

  const slide = data.images[current];

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "var(--os-surface)" }}
    >
      {/* Image area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
        <Image
          src={slide.src}
          alt={slide.caption ?? `Slide ${current + 1}`}
          fill
          className="object-contain"
        />
      </div>

      {/* Caption & Controls */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0 text-xs"
        style={{
          background: "var(--os-header)",
          borderTop: "1px solid rgba(82,211,214,0.2)",
          color: "var(--os-accent)",
        }}
      >
        <button
          className="px-3 py-1 rounded-sm tracking-widest font-bold uppercase transition-opacity hover:opacity-100 opacity-60 disabled:opacity-20 cursor-pointer"
          style={{ border: "1px solid rgba(82,211,214,0.3)" }}
          onClick={() => setCurrent((p) => Math.max(0, p - 1))}
          disabled={current === 0}
        >
          ◀ PREV
        </button>

        <div className="text-center">
          {slide.caption && (
            <div className="opacity-70 mb-1">{slide.caption}</div>
          )}
          <div className="opacity-40 tracking-widest">
            {current + 1} / {total}
          </div>
        </div>

        <button
          className="px-3 py-1 rounded-sm tracking-widest font-bold uppercase transition-opacity hover:opacity-100 opacity-60 disabled:opacity-20 cursor-pointer"
          style={{ border: "1px solid rgba(82,211,214,0.3)" }}
          onClick={() => setCurrent((p) => Math.min(total - 1, p + 1))}
          disabled={current === total - 1}
        >
          NEXT ▶
        </button>
      </div>
    </div>
  );
}
