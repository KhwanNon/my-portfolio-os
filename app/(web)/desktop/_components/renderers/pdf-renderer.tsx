"use client";
// The PDF viewer: the file drawn by pdf.js onto our own canvas, inside our own
// chrome — a header naming the file, a toolbar, a strip of page thumbnails, and
// the pages themselves on tinted paper. The browser's built-in viewer could not
// be dressed to match the rest of the machine, and on a phone it drew nothing.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Maximize,
  Menu,
  Minus,
  Plus,
  Printer,
  RotateCw,
} from "lucide-react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import type { PdfFileData } from "@/app/shared/types/file-system";
import { useStrings } from "@/app/shared/hooks/use-locale";

const UNTITLED = "document.pdf";

const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
const SCALE_STEP = 0.1;
/** Room left around the page when it is fitted to the width of the view. */
const FIT_GUTTER = 48;

/** The frame every piece of chrome here is drawn with. */
const LINE = "border-2 border-os-border-strong";

/** pdf.js, loaded on first use and kept — it is large and only this window needs it. */
let pdfjs: Promise<typeof import("pdfjs-dist")> | null = null;
function loadPdfjs() {
  pdfjs ??= import("pdfjs-dist").then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    return lib;
  });
  return pdfjs;
}

/** The document at `url`, or the error that stopped it loading. */
function usePdf(url: string) {
  const [state, setState] = useState<{
    doc: PDFDocumentProxy | null;
    error: boolean;
  }>({ doc: null, error: false });

  useEffect(() => {
    let cancelled = false;
    // Held so leaving can stop the load — and the worker with it.
    let task: { destroy(): Promise<void> } | null = null;
    loadPdfjs()
      .then((lib) => {
        const loading = lib.getDocument({ url });
        task = loading;
        return loading.promise;
      })
      .then((loaded) => {
        if (!cancelled) setState({ doc: loaded, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ doc: null, error: true });
      });
    return () => {
      cancelled = true;
      task?.destroy();
    };
  }, [url]);

  return state;
}

export function PdfRenderer({ data }: { data: PdfFileData }) {
  const S = useStrings();
  const filename = data.filename ?? UNTITLED;
  const { doc, error } = usePdf(data.url);

  const [pages, setPages] = useState<PDFPageProxy[]>([]);
  const [current, setCurrent] = useState(1);
  const [rotation, setRotation] = useState(0);
  /** `null` while the page is fitted to the width of the view. */
  const [zoom, setZoom] = useState<number | null>(null);
  const [fitScale, setFitScale] = useState(1);
  const [thumbsOpen, setThumbsOpen] = useState(true);

  const viewRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scale = zoom ?? fitScale;

  // Every page, fetched once the document is here.
  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    Promise.all(
      Array.from({ length: doc.numPages }, (_, i) => doc.getPage(i + 1)),
    ).then((loaded) => {
      if (!cancelled) setPages(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [doc]);

  // Fit-to-width follows the view as the window is resized or rotated.
  useEffect(() => {
    const view = viewRef.current;
    const first = pages[0];
    if (!view || !first) return;
    const measure = () => {
      const natural = first.getViewport({ scale: 1, rotation }).width;
      const room = view.clientWidth - FIT_GUTTER;
      setFitScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, room / natural)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(view);
    return () => observer.disconnect();
  }, [pages, rotation]);

  // The page counter follows the scroll: whichever page fills most of the view.
  useEffect(() => {
    const view = viewRef.current;
    if (!view || pages.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setCurrent(Number((best.target as HTMLElement).dataset.page));
      },
      { root: view, threshold: [0.25, 0.5, 0.75] },
    );
    pageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [pages, scale, rotation]);

  const goTo = useCallback(
    (n: number) => {
      const target = Math.min(Math.max(n, 1), pages.length);
      pageRefs.current[target - 1]?.scrollIntoView({ block: "start" });
      setCurrent(target);
    },
    [pages.length],
  );

  const zoomBy = (delta: number) =>
    setZoom(
      Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, Math.round((scale + delta) * 10) / 10),
      ),
    );

  // Printing goes through the browser, which prints the file itself rather
  // than our drawing of it — from a frame kept off screen for the purpose.
  const print = () => {
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0";
    frame.src = data.url;
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 60_000);
    };
    document.body.appendChild(frame);
  };

  return (
    <div
      className="@container flex h-full w-full flex-col"
      style={{ background: "#020a05", color: "var(--os-text)" }}
    >
      {/* ── Header: the file, and the two ways to take it away. On a narrow
          window the two buttons keep their icons and drop their words. ── */}
      <header className={`${LINE} m-3 mb-0 flex items-center gap-3 px-4 py-2.5`}>
        <span className="font-os-mono min-w-0 flex-1 truncate text-[15px] text-os-accent">
          {filename}
        </span>
        <a
          href={data.url}
          target="_blank"
          rel="noreferrer"
          className={`${LINE} focus-ring font-os-pixel flex items-center gap-2 px-3 py-1.5 text-[14px] hover:border-os-accent hover:bg-os-accent hover:text-os-on-accent`}
        >
          <ExternalLink size={16} strokeWidth={2.5} />
          <span className="@max-md:sr-only">{S.pdf.open}</span>
        </a>
        <a
          href={data.url}
          download={filename}
          className={`${LINE} focus-ring font-os-pixel flex items-center gap-2 px-3 py-1.5 text-[14px] hover:border-os-accent hover:bg-os-accent hover:text-os-on-accent`}
        >
          <Download size={16} strokeWidth={2.5} />
          <span className="@max-md:sr-only">{S.pdf.download}</span>
        </a>
      </header>

      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      <div
        className="custom-scrollbar flex shrink-0 items-center gap-1 overflow-x-auto px-3 py-2"
        style={{ borderBottom: "2px solid var(--os-border-strong)" }}
      >
        <Tool
          label={S.pdf.thumbnails}
          onClick={() => setThumbsOpen((v) => !v)}
          pressed={thumbsOpen}
          className="@max-xl:hidden"
        >
          <Menu size={18} strokeWidth={2.5} />
        </Tool>
        <Divider className="@max-xl:hidden" />

        <Tool label={S.pdf.previous} onClick={() => goTo(current - 1)} disabled={current <= 1}>
          <ChevronLeft size={18} strokeWidth={2.5} />
        </Tool>
        <span className="font-os-mono flex items-center gap-2 whitespace-nowrap px-1 text-[13px]">
          <span className={`${LINE} min-w-8 px-2 py-0.5 text-center`}>{current}</span>
          <span style={{ color: "var(--os-text-dim)" }}>/ {pages.length || "–"}</span>
        </span>
        <Tool
          label={S.pdf.next}
          onClick={() => goTo(current + 1)}
          disabled={current >= pages.length}
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </Tool>
        <Divider />

        <Tool label={S.pdf.zoomOut} onClick={() => zoomBy(-SCALE_STEP)} disabled={scale <= MIN_SCALE}>
          <Minus size={18} strokeWidth={2.5} />
        </Tool>
        <span className={`${LINE} font-os-mono min-w-16 px-2 py-0.5 text-center text-[13px]`}>
          {Math.round(scale * 100)}%
        </span>
        <Tool label={S.pdf.zoomIn} onClick={() => zoomBy(SCALE_STEP)} disabled={scale >= MAX_SCALE}>
          <Plus size={18} strokeWidth={2.5} />
        </Tool>
        <Divider />

        <Tool label={S.pdf.fit} onClick={() => setZoom(null)} pressed={zoom === null}>
          <Maximize size={18} strokeWidth={2.5} />
        </Tool>
        <Tool label={S.pdf.rotate} onClick={() => setRotation((r) => (r + 90) % 360)}>
          <RotateCw size={18} strokeWidth={2.5} />
        </Tool>

        <span className="flex-1" />
        <Tool label={S.pdf.print} onClick={print}>
          <Printer size={18} strokeWidth={2.5} />
        </Tool>
      </div>

      {/* ── Thumbnails and pages ──────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1">
        {thumbsOpen && pages.length > 0 && (
          <aside
            aria-label={S.pdf.thumbnails}
            className="custom-scrollbar hidden w-44 shrink-0 flex-col items-center gap-5 overflow-y-auto py-5 @xl:flex"
            style={{ borderRight: "2px solid var(--os-border-strong)" }}
          >
            {pages.map((page, i) => (
              <button
                key={i}
                onClick={() => goTo(i + 1)}
                aria-label={`${S.pdf.page} ${i + 1}`}
                aria-current={current === i + 1 ? "page" : undefined}
                className="focus-ring group flex cursor-pointer flex-col items-center gap-2"
              >
                <Bracketed lit={current === i + 1}>
                  <PageCanvas page={page} scale={0.18} rotation={rotation} />
                </Bracketed>
                <span
                  className="font-os-pixel text-[15px]"
                  style={{
                    color: current === i + 1 ? "var(--os-accent)" : "var(--os-text-faint)",
                  }}
                >
                  {i + 1}
                </span>
              </button>
            ))}
          </aside>
        )}

        <div
          ref={viewRef}
          className="custom-scrollbar flex min-w-0 flex-1 flex-col items-center gap-6 overflow-auto px-6 py-6"
        >
          {error ? (
            <Message text={S.pdf.error} />
          ) : pages.length === 0 ? (
            <Message text={S.pdf.loading} />
          ) : (
            pages.map((page, i) => (
              <div
                key={i}
                ref={(el) => {
                  pageRefs.current[i] = el;
                }}
                data-page={i + 1}
                className="relative shrink-0 border-2 border-os-border-strong shadow-(--shadow-3)"
              >
                <PageCanvas page={page} scale={scale} rotation={rotation} links />
                {/* The paper's tint: white turns mint, ink stays ink. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-multiply"
                  style={{ background: "#dcf5e3" }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * One page drawn at `scale`, sharp on a dense screen. With `links`, the PDF's
 * own links are laid over it as real anchors, so an address in the résumé is
 * still something to click rather than something to copy by eye.
 */
function PageCanvas({
  page,
  scale,
  rotation,
  links = false,
}: {
  page: PDFPageProxy;
  scale: number;
  rotation: number;
  links?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [anchors, setAnchors] = useState<
    { url: string; left: number; top: number; width: number; height: number }[]
  >([]);
  const viewport = page.getViewport({ scale, rotation });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const view = page.getViewport({ scale: scale * ratio, rotation });
    canvas.width = Math.floor(view.width);
    canvas.height = Math.floor(view.height);
    const task = page.render({ canvas, viewport: view });
    task.promise.catch(() => {
      // A newer render replaced this one — nothing to do.
    });
    return () => task.cancel();
  }, [page, scale, rotation]);

  useEffect(() => {
    if (!links) return;
    let cancelled = false;
    const view = page.getViewport({ scale, rotation });
    page.getAnnotations().then((annotations) => {
      if (cancelled) return;
      setAnchors(
        annotations
          .filter((a) => a.subtype === "Link" && typeof a.url === "string")
          .map((a) => {
            const [x1, y1] = view.convertToViewportPoint(a.rect[0], a.rect[1]);
            const [x2, y2] = view.convertToViewportPoint(a.rect[2], a.rect[3]);
            return {
              url: a.url as string,
              left: Math.min(x1, x2),
              top: Math.min(y1, y2),
              width: Math.abs(x2 - x1),
              height: Math.abs(y2 - y1),
            };
          }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [page, scale, rotation, links]);

  return (
    <div className="relative" style={{ width: viewport.width, height: viewport.height }}>
      <canvas
        ref={canvasRef}
        className="block bg-white"
        style={{ width: viewport.width, height: viewport.height }}
      />
      {anchors.map((a, i) => (
        <a
          key={i}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          title={a.url}
          className="absolute z-10 hover:bg-os-accent/20"
          style={{ left: a.left, top: a.top, width: a.width, height: a.height }}
        />
      ))}
    </div>
  );
}

/** A toolbar control: a square button that lights when pointed at or pressed. */
function Tool({
  label,
  onClick,
  disabled,
  pressed,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`focus-ring grid h-9 w-9 shrink-0 cursor-pointer place-items-center hover:bg-os-accent-container disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent ${
        pressed ? "bg-os-accent-container text-os-accent" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`mx-2 h-6 w-0.5 shrink-0 ${className}`}
      style={{ background: "var(--os-border-strong)" }}
    />
  );
}

/** The current thumbnail's frame: corners bracketed, the way a scanner targets. */
function Bracketed({ lit, children }: { lit: boolean; children: React.ReactNode }) {
  const corner = `absolute h-3 w-3 ${lit ? "border-os-accent" : "border-transparent group-hover:border-os-border-strong"}`;
  return (
    <span className="relative block p-2">
      <span className={`block border-2 ${lit ? "border-os-accent" : "border-os-border"}`}>
        {children}
      </span>
      <span aria-hidden className={`${corner} left-0 top-0 border-l-[3px] border-t-[3px]`} />
      <span aria-hidden className={`${corner} right-0 top-0 border-r-[3px] border-t-[3px]`} />
      <span aria-hidden className={`${corner} bottom-0 left-0 border-b-[3px] border-l-[3px]`} />
      <span aria-hidden className={`${corner} bottom-0 right-0 border-b-[3px] border-r-[3px]`} />
    </span>
  );
}

function Message({ text }: { text: string }) {
  return (
    <p
      className="font-os-pixel m-auto text-[15px]"
      style={{ color: "var(--os-text-faint)" }}
    >
      {text}
    </p>
  );
}
