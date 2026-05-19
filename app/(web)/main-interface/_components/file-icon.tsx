"use client";
// FileIcon — shared icon component for desktop and folder views
import { useState } from "react";
import type { FileNode } from "@/app/shared/types/file-system";
import {
  useWindowManager,
  type ContextMenuItem,
} from "@/app/modules/desktop/context/window-manager-context";
import { desktopFileSystem } from "../_data/file-system-data";
import {
  makePropertiesNode,
  absolutePathOf,
  pathSegmentsOf,
} from "../_lib/properties-node";
import { FileGraphic } from "./file-graphic";

interface FileIconProps {
  fileNode: FileNode;
  /** "desktop" = large (72px), "folder" = medium (56px) */
  variant?: "desktop" | "folder";
  /** Override the default open behaviour */
  onOpen?: (node: FileNode) => void;
}

const VARIANT_SIZE: Record<"desktop" | "folder", number> = {
  desktop: 72,
  folder: 56,
};

const TERMINAL_ID = "system-command";

export const FileIcon = ({
  fileNode,
  variant = "desktop",
  onOpen,
}: FileIconProps) => {
  const {
    openFile,
    showContextMenu,
    showToast,
    requestTerminalCd,
  } = useWindowManager();
  const [selected, setSelected] = useState(false);

  const open = onOpen ?? openFile;
  const size = VARIANT_SIZE[variant];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(true);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    open(fileNode);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(true);

    const absPath = absolutePathOf(fileNode);
    const segments = pathSegmentsOf(fileNode);
    const isFolder = fileNode.type === "folder";

    const items: ContextMenuItem[] = [
      {
        label: fileNode.type === "link" ? "Open Link" : "Open",
        onSelect: () => open(fileNode),
      },
      {
        label: "Open in Terminal",
        disabled: absPath === null,
        onSelect: () => {
          const terminalNode = desktopFileSystem.find(
            (n) => n.id === TERMINAL_ID,
          );
          if (!terminalNode || absPath === null) return;
          // For folders cd into them; for files cd into their parent.
          const targetPath = isFolder ? segments : segments.slice(0, -1);
          requestTerminalCd(targetPath);
          openFile(terminalNode);
        },
      },
      {
        label: "Copy Path",
        disabled: absPath === null,
        onSelect: () => {
          if (absPath === null) return;
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(absPath).then(
              () => showToast(`Copied: ${absPath}`, "success"),
              () => showToast("Copy failed", "error"),
            );
          } else {
            showToast("Clipboard unavailable", "error");
          }
        },
      },
      { separator: true },
      {
        label: "Properties",
        onSelect: () => openFile(makePropertiesNode(fileNode)),
      },
    ];

    showContextMenu(e.clientX, e.clientY, items);
  };

  return (
    <div
      className="flex flex-col items-center justify-center group outline-none cursor-pointer transition-all duration-300"
      style={{ margin: variant === "folder" ? 4 : 16 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && open(fileNode)}
      onBlur={() => setSelected(false)}
    >
      {/* Icon */}
      <div
        style={{
          width: size,
          height: size,
          color: "var(--os-accent)",
          opacity: selected ? 0.75 : 1,
        }}
        className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(82,211,214,0.85)]"
      >
        <FileGraphic
          icon={fileNode.icon}
          size={Math.round(size * 0.7)}
          strokeWidth={1.4}
        />
        {selected && (
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "rgba(82,211,214,0.2)",
              border: "1px solid rgba(82,211,214,0.4)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-os-accent/0 group-hover:bg-os-accent/10 rounded-lg transition-all duration-300 -z-10" />
      </div>

      {/* Label */}
      <div
        className="mt-2 flex items-center justify-center px-1"
        style={{ width: variant === "desktop" ? size + 64 : size + 32 }}
      >
        <span
          className="text-[10px] font-bold tracking-[0.15em] uppercase text-os-accent text-center leading-tight"
          style={{
            background: selected ? "rgba(82,211,214,0.25)" : "transparent",
            padding: "1px 4px",
            borderRadius: 2,
            maxWidth: "100%",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
          }}
          title={fileNode.name}
        >
          {fileNode.name}
        </span>
      </div>
    </div>
  );
};
