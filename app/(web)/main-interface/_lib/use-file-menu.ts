"use client";
import { useCallback } from "react";
import type { FileNode } from "@/app/shared/types/file-system";
import {
  useWindowManager,
  type ContextMenuItem,
} from "@/app/modules/desktop/context/window-manager-context";
import { desktopFileSystem } from "../_data/file-system-data";
import { makePropertiesNode, absolutePathOf, pathSegmentsOf } from "./properties-node";

const TERMINAL_ID = "system-command";

/**
 * The one menu a file system node offers, wherever it appears — rail rows,
 * cards, list rows, overflow buttons. Returns an opener you point at a screen
 * position; pass `open` to override what "Open" does (folder windows navigate
 * in place instead of spawning a window).
 */
export function useFileMenu() {
  const { openFile, showContextMenu, showToast, requestTerminalCd } =
    useWindowManager();

  return useCallback(
    (
      node: FileNode,
      at: { x: number; y: number },
      open: (node: FileNode) => void = openFile,
    ) => {
      const absPath = absolutePathOf(node);
      const segments = pathSegmentsOf(node);
      const isFolder = node.type === "folder";

      const items: ContextMenuItem[] = [
        {
          label: node.type === "link" ? "Open Link" : "Open",
          onSelect: () => open(node),
        },
        {
          label: "Open in Terminal",
          disabled: absPath === null,
          onSelect: () => {
            const terminal = desktopFileSystem.find((n) => n.id === TERMINAL_ID);
            if (!terminal || absPath === null) return;
            // For folders cd into them; for files cd into their parent.
            requestTerminalCd(isFolder ? segments : segments.slice(0, -1));
            openFile(terminal);
          },
        },
        {
          label: "Copy Path",
          disabled: absPath === null,
          onSelect: () => {
            if (absPath === null) return;
            if (!navigator.clipboard?.writeText) {
              showToast("Clipboard unavailable", "error");
              return;
            }
            navigator.clipboard.writeText(absPath).then(
              () => showToast(`Copied: ${absPath}`, "success"),
              () => showToast("Copy failed", "error"),
            );
          },
        },
        { separator: true },
        {
          label: "Properties",
          onSelect: () => openFile(makePropertiesNode(node)),
        },
      ];

      showContextMenu(at.x, at.y, items);
    },
    [openFile, showContextMenu, showToast, requestTerminalCd],
  );
}
