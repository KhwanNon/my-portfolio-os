"use client";
import Image from "next/image";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";

interface DesktopIconProps {
  fileNode: FileNode;
}

export const DesktopIcon = ({ fileNode }: DesktopIconProps) => {
  const { openFile } = useWindowManager();

  return (
    <div
      className="flex flex-col items-center justify-center group outline-none cursor-pointer m-4 transition-all duration-300"
      onClick={() => openFile(fileNode)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && openFile(fileNode)}
      title={fileNode.name}
    >
      {/* Icon container */}
      <div
        style={{ width: 50, height: 50 }}
        className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-110"
      >
        <Image
          src={fileNode.iconPath ?? "/assets/images/drive.png"}
          alt={fileNode.name}
          width={50}
          height={50}
          className="object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(82,211,214,0.8)]"
        />
        <div className="absolute inset-0 bg-os-accent/0 group-hover:bg-os-accent/10 rounded-lg transition-all duration-300 -z-10" />
      </div>

      {/* Label */}
      <div className="mt-2 h-4 flex items-center justify-center">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-os-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {fileNode.name}
        </span>
      </div>
    </div>
  );
};
