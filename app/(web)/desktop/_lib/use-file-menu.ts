"use client";
import { useCallback } from "react";
import type { FileNode } from "@/app/shared/types/file-system";
import {
  useWindowManager,
  type ContextMenuItem,
} from "@/app/modules/desktop/context/window-manager-context";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useDesktopData } from "./use-desktop-data";
import {
  makePropertiesNode,
  absolutePathOf,
  pathSegmentsOf,
} from "./properties-node";

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
  const { fileSystem } = useDesktopData();
  const S = useStrings();

  return useCallback(
    (
      node: FileNode,
      at: { x: number; y: number },
      open: (node: FileNode) => void = openFile,
    ) => {
      const absPath = absolutePathOf(node, fileSystem);
      const segments = pathSegmentsOf(node, fileSystem);
      const isFolder = node.type === "folder";

      const items: ContextMenuItem[] = [
        {
          label: node.type === "link" ? S.menu.openLink : S.menu.open,
          onSelect: () => open(node),
        },
        {
          label: S.menu.openInTerminal,
          disabled: absPath === null,
          onSelect: () => {
            const terminal = fileSystem.find((n) => n.id === TERMINAL_ID);
            if (!terminal || absPath === null) return;
            // For folders cd into them; for files cd into their parent.
            requestTerminalCd(isFolder ? segments : segments.slice(0, -1));
            openFile(terminal);
          },
        },
        {
          label: S.menu.copyPath,
          disabled: absPath === null,
          onSelect: () => {
            if (absPath === null) return;
            if (!navigator.clipboard?.writeText) {
              showToast(S.toast.clipboardUnavailable, "error");
              return;
            }
            navigator.clipboard.writeText(absPath).then(
              () => showToast(S.toast.copied(absPath), "success"),
              () => showToast(S.toast.copyFailed, "error"),
            );
          },
        },
        { separator: true },
        {
          label: S.menu.properties,
          onSelect: () => openFile(makePropertiesNode(node, fileSystem, S)),
        },
      ];

      showContextMenu(at.x, at.y, items);
    },
    [openFile, showContextMenu, showToast, requestTerminalCd, fileSystem, S],
  );
}
