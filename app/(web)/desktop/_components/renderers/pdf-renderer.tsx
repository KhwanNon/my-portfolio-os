"use client";
import type { PdfFileData } from "@/app/shared/types/file-system";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useIsSmallViewport } from "../../_lib/use-viewport";
import { FileGraphic } from "../file-graphic";

const UNTITLED = "document.pdf";

/**
 * Read the file, or keep it. Both actions point at the same URL and are cut
 * from one cloth; only the padding changes, because the pair sits in a toolbar
 * on a desktop and under a thumb on a phone.
 */
function Actions({
  url,
  filename,
  pad,
}: {
  url: string;
  filename: string;
  pad: string;
}) {
  const S = useStrings();
  const action = `${pad} rounded-md font-medium opacity-80 transition-opacity duration-200 hover:opacity-100`;

  return (
    <div className="flex items-center gap-2 shrink-0">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={action}
        style={{ color: "var(--os-text)" }}
      >
        {S.pdf.open}
      </a>
      <a
        href={url}
        download={filename}
        className={action}
        style={{
          border: "1px solid var(--os-border-strong)",
          color: "var(--os-text)",
        }}
      >
        {S.pdf.download}
      </a>
    </div>
  );
}

export function PdfRenderer({ data }: { data: PdfFileData }) {
  const S = useStrings();
  const filename = data.filename ?? UNTITLED;

  /*
   * A phone browser will not draw a PDF inside a frame — iOS renders the first
   * page frozen and unreadable, Android usually renders nothing at all — so
   * rather than leave a visitor holding a blank window, the small viewport is
   * handed the file itself. Width stands in for the browser here: nothing on
   * the page can ask one whether it can render a PDF short of trying.
   */
  const handOff = useIsSmallViewport();

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ background: "var(--os-surface)" }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2 shrink-0 text-xs"
        style={{
          background: "var(--os-header)",
          borderBottom: "1px solid var(--os-border)",
          color: "var(--os-text-dim)",
        }}
      >
        <span className="truncate opacity-80 font-os-mono">{filename}</span>
        <Actions url={data.url} filename={filename} pad="px-3 py-1 text-[11px]" />
      </div>

      {handOff ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <FileGraphic icon="pdf" size={44} />
          <p
            className="font-os-mono text-sm font-medium"
            style={{ color: "var(--os-text)" }}
          >
            {filename}
          </p>
          <p
            className="max-w-xs text-xs leading-relaxed"
            style={{ color: "var(--os-text-dim)" }}
          >
            {S.pdf.handoff}
          </p>
          <Actions url={data.url} filename={filename} pad="px-4 py-2 text-xs" />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <iframe
            src={data.url}
            className="w-full h-full border-0"
            title={filename}
          />
        </div>
      )}
    </div>
  );
}
