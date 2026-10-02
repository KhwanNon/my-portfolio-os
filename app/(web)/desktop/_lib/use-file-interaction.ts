"use client";
import { useState } from "react";
import type { FileNode } from "@/app/shared/types/file-system";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { useFileMenu } from "./use-file-menu";
import { useIsSmallViewport } from "./use-viewport";

interface Options {
  /** Override what "open" does — folder windows navigate in place. */
  onOpen?: (node: FileNode) => void;
}

/**
 * Everything a node does when you interact with it — open, select, right-click,
 * keyboard — in one place, so each surface only has to decide how it looks.
 * Opening takes a double click everywhere, the way an OS behaves: one click
 * selects. On a touch screen there is no double click to make, so one tap opens.
 */
export function useFileInteraction(node: FileNode, { onOpen }: Options = {}) {
  const { openFile } = useWindowManager();
  const openMenu = useFileMenu();
  const [selected, setSelected] = useState(false);
  const touch = useIsSmallViewport(768);

  const open = onOpen ?? openFile;

  /** The right-click menu, opened from somewhere other than a right click. */
  const openMenuAt = (position: { x: number; y: number }) => {
    setSelected(true);
    openMenu(node, position, open);
  };

  const interaction = {
    role: "button" as const,
    tabIndex: 0,
    title: node.name,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      if (touch) open(node);
      else setSelected(true);
    },
    onDoubleClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      open(node);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(node);
      }
    },
    onBlur: () => setSelected(false),
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openMenuAt({ x: e.clientX, y: e.clientY });
    },
  };

  return { selected, interaction, openMenuAt };
}
