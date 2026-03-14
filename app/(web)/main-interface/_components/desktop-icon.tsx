"use client";
import { useState } from "react";
import Image from "next/image";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";

interface DesktopIconProps {
  fileNode: FileNode;
  /** Override the default open behaviour (used inside FolderRenderer) */
  onOpen?: (node: FileNode) => void;
  /** Icon size in px — defaults to 50 for desktop, 48 for folder view */
  size?: number;
}

export const DesktopIcon = ({ fileNode, onOpen, size = 50 }: DesktopIconProps) => {
  const { openFile } = useWindowManager();
  const [selected, setSelected] = useState(false);

  const open = onOpen ?? openFile;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(true);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    open(fileNode);
  };

  return (
    <div
      className="flex flex-col items-center justify-center group outline-none cursor-pointer transition-all duration-300"
      style={{ margin: size === 48 ? 4 : 16 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && open(fileNode)}
      onBlur={() => setSelected(false)}
      title={fileNode.name}
    >
      {/* Icon container */}
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-110"
      >
        <Image
          src={fileNode.iconPath ?? "/assets/images/drive.png"}
          alt={fileNode.name}
          width={size}
          height={size}
          className="object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(82,211,214,0.8)]"
          style={{ opacity: selected ? 0.7 : 1 }}
        />
        {/* Selection highlight */}
        {selected && (
          <div
            className="absolute inset-0 rounded-lg"
            style={{ background: "rgba(82,211,214,0.2)", border: "1px solid rgba(82,211,214,0.4)" }}
          />
        )}
        <div className="absolute inset-0 bg-os-accent/0 group-hover:bg-os-accent/10 rounded-lg transition-all duration-300 -z-10" />
      </div>

      {/* Label */}
      <div className="mt-2 flex items-center justify-center px-1" style={{ maxWidth: size + 16 }}>
        <span
          className="text-[10px] font-bold tracking-[0.15em] uppercase text-os-accent text-center leading-tight wrap-break-word"
          style={{
            background: selected ? "rgba(82,211,214,0.25)" : "transparent",
            padding: "1px 4px",
            borderRadius: 2,
          }}
        >
          {fileNode.name}
        </span>
      </div>
    </div>
  );
};
