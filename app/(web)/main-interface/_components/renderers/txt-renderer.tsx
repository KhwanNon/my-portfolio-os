"use client";
import type { TxtFileData } from "@/app/shared/types/file-system";

export function TxtRenderer({ data }: { data: TxtFileData }) {
  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-5"
      style={{ background: "var(--os-surface)" }}
    >
      <pre
        className="text-xs leading-relaxed whitespace-pre-wrap break-words font-os-mono"
        style={{ color: "var(--os-accent)" }}
      >
        {data.content}
      </pre>
    </div>
  );
}
