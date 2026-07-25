"use client";
import type { PdfFileData } from "@/app/shared/types/file-system";

export function PdfRenderer({ data }: { data: PdfFileData }) {
  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ background: "var(--os-surface)" }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0 text-xs"
        style={{
          background: "var(--os-header)",
          borderBottom: "1px solid var(--os-border)",
          color: "var(--os-text-dim)",
        }}
      >
        <span className="opacity-80 font-os-mono">{data.filename ?? "document.pdf"}</span>
        <a
          href={data.url}
          download={data.filename ?? "document.pdf"}
          className="px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 hover:opacity-100 opacity-80"
          style={{
            border: "1px solid var(--os-border-strong)",
            color: "var(--os-text)",
          }}
        >
          Download
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={data.url}
          className="w-full h-full border-0"
          title={data.filename ?? "PDF Viewer"}
        />
      </div>
    </div>
  );
}
