"use client";
import { useState } from "react";
import type { FileNode, FolderData } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { FileIcon } from "../file-icon";

interface StackEntry {
  name: string;
  data: FolderData;
}

export function FolderRenderer({ data }: { data: FolderData }) {
  const { openFile } = useWindowManager();

  // Stack of folders navigated into — first entry is always the root
  const [stack, setStack] = useState<StackEntry[]>([{ name: "root", data }]);

  const current = stack[stack.length - 1];

  const handleClick = (child: FileNode) => {
    if (child.type === "folder" && child.data?.kind === "folder") {
      // Navigate into folder — push to stack (same window)
      setStack((prev) => [...prev, { name: child.name, data: child.data as FolderData }]);
    } else if (child.type === "link" && child.data?.kind === "link") {
      // Links open externally
      window.open(child.data.url, "_blank", "noopener,noreferrer");
    } else {
      // All other file types open in a new window
      openFile(child);
    }
  };

  const navigateTo = (index: number) => {
    setStack((prev) => prev.slice(0, index + 1));
  };

  return (
    <div
      className="h-full w-full flex flex-col font-os-mono"
      style={{ background: "var(--os-surface)" }}
    >
      {/* Breadcrumb toolbar */}
      <div
        className="flex items-center gap-1 px-3 py-2 shrink-0 overflow-x-auto"
        style={{
          borderBottom: "1px solid rgba(82,211,214,0.15)",
          background: "var(--os-header)",
          minHeight: 36,
        }}
      >
        {/* Back button */}
        <button
          className="px-2 py-0.5 text-[10px] tracking-widest rounded-sm transition-opacity disabled:opacity-20 hover:opacity-100 opacity-60 cursor-pointer shrink-0"
          style={{ border: "1px solid rgba(82,211,214,0.25)", color: "var(--os-accent)" }}
          onClick={() => setStack((prev) => prev.slice(0, -1))}
          disabled={stack.length <= 1}
        >
          ◀
        </button>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-1 text-[10px] tracking-widest overflow-hidden">
          {stack.map((entry, i) => {
            const isLast = i === stack.length - 1;
            return (
              <span key={i} className="flex items-center gap-1 shrink-0">
                {i > 0 && (
                  <span className="opacity-30" style={{ color: "var(--os-accent)" }}>
                    /
                  </span>
                )}
                <button
                  className="uppercase transition-opacity hover:opacity-100 cursor-pointer"
                  style={{
                    color: "var(--os-accent)",
                    opacity: isLast ? 1 : 0.5,
                    fontWeight: isLast ? "bold" : "normal",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                  onClick={() => navigateTo(i)}
                >
                  {i === 0 ? "root" : entry.name}
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* File grid */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4">
        {current.data.children.length === 0 ? (
          <div
            className="flex items-center justify-center h-full text-xs tracking-widest opacity-30"
            style={{ color: "var(--os-accent)" }}
          >
            FOLDER_EMPTY
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, max-content)", gap: 8, justifyContent: "start" }}>
            {current.data.children.map((child) => (
              <FileIcon
                key={child.id}
                fileNode={child}
                onOpen={handleClick}
                variant="folder"
              />
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-3 py-1 shrink-0 text-[10px] tracking-widest opacity-40"
        style={{
          borderTop: "1px solid rgba(82,211,214,0.1)",
          color: "var(--os-accent)",
        }}
      >
        <span>{current.data.children.length} item{current.data.children.length !== 1 ? "s" : ""}</span>
        <span className="uppercase">{current.name === "root" ? "root" : current.name}</span>
      </div>
    </div>
  );
}
