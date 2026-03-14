"use client";
import Image from "next/image";
import type { FolderData } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";

export function FolderRenderer({ data }: { data: FolderData }) {
  const { openFile } = useWindowManager();

  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-4"
      style={{ background: "var(--os-surface)" }}
    >
      {data.children.length === 0 ? (
        <div
          className="flex items-center justify-center h-full text-xs tracking-widest opacity-40"
          style={{ color: "var(--os-accent)" }}
        >
          FOLDER_EMPTY
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {data.children.map((child) => (
            <button
              key={child.id}
              className="flex flex-col items-center gap-2 p-3 rounded group cursor-pointer transition-all duration-200 outline-none"
              style={{ width: 96, background: "transparent" }}
              onDoubleClick={() => openFile(child)}
              onClick={() => openFile(child)}
              title={child.name}
            >
              <div
                className="relative w-12 h-12 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{
                  filter:
                    "drop-shadow(0 0 0px rgba(82,211,214,0)) group-hover:drop-shadow(0 0 8px rgba(82,211,214,0.7))",
                }}
              >
                <Image
                  src={child.iconPath ?? "/assets/images/drive.png"}
                  alt={child.name}
                  width={48}
                  height={48}
                  className="object-contain group-hover:drop-shadow-[0_0_8px_rgba(82,211,214,0.7)] transition-all duration-200"
                />
              </div>
              <span
                className="text-[10px] text-center leading-tight tracking-wide break-words w-full"
                style={{ color: "var(--os-accent)" }}
              >
                {child.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
