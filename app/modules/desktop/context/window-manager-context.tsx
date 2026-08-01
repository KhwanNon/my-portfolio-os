"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useRef,
  useCallback,
} from "react";
import type { FileNode } from "@/app/shared/types/file-system";
import { workspaceBox } from "../lib/workspace";

export interface WindowInstance {
  id: string;
  fileNode: FileNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowManagerState {
  windows: WindowInstance[];
  nextZIndex: number;
}

type Action =
  | {
      type: "OPEN";
      fileNode: FileNode;
      position?: { x: number; y: number };
      size?: { width: number; height: number };
    }
  | { type: "CLOSE"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "MINIMIZE_ALL" }
  | { type: "RESTORE"; id: string }
  | { type: "MAXIMIZE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; width: number; height: number };

const DEFAULT_WINDOW_SIZES: Record<string, { width: number; height: number }> =
  {
    "system-command": { width: 640, height: 420 },
    preferences: { width: 580, height: 440 },
    "recycle-bin": { width: 520, height: 400 },
    "c-drive": { width: 680, height: 460 },
    "profile-txt": { width: 620, height: 440 },
  };

/** Breathing room between a window and the edge of the workspace. */
const MARGIN = 16;

const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

function getDefaultSize(fileNode: FileNode): { width: number; height: number } {
  const target = fileNode.id.startsWith("props-")
    ? { width: 420, height: 360 }
    : DEFAULT_WINDOW_SIZES[fileNode.id] ?? { width: 640, height: 460 };
  if (typeof window === "undefined") return target;
  // A window opens no larger than the box it opens into, dock band excluded.
  const box = workspaceBox();
  return {
    width: Math.min(target.width, Math.max(280, box.width - MARGIN * 2)),
    height: Math.min(target.height, Math.max(200, box.height - MARGIN * 2)),
  };
}

function getDefaultPosition(
  count: number,
  size: { width: number; height: number },
): { x: number; y: number } {
  if (typeof window === "undefined") return { x: 80, y: 60 };
  // Each new window steps down and right off the last, until the cascade would
  // push it past the workspace — then it stops at the far edge.
  const box = workspaceBox();
  const offset = (count % 8) * 28;
  return {
    x: clamp(80 + offset, box.width - size.width - MARGIN),
    y: clamp(60 + offset, box.height - size.height - MARGIN),
  };
}

function reducer(
  state: WindowManagerState,
  action: Action,
): WindowManagerState {
  switch (action.type) {
    case "OPEN": {
      const existing = state.windows.find(
        (w) => w.fileNode.id === action.fileNode.id,
      );
      if (existing) {
        return {
          ...state,
          nextZIndex: state.nextZIndex + 1,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? { ...w, isMinimized: false, zIndex: state.nextZIndex }
              : w,
          ),
        };
      }
      const id = `win-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const size = action.size ?? getDefaultSize(action.fileNode);
      const position =
        action.position ?? getDefaultPosition(state.windows.length, size);
      return {
        windows: [
          ...state.windows,
          {
            id,
            fileNode: action.fileNode,
            position,
            size,
            isMinimized: false,
            isMaximized: false,
            zIndex: state.nextZIndex,
          },
        ],
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case "CLOSE":
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
      };
    case "MINIMIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isMinimized: true } : w,
        ),
      };
    case "MINIMIZE_ALL":
      return {
        ...state,
        windows: state.windows.map((w) => ({ ...w, isMinimized: true })),
      };
    case "RESTORE":
      return {
        ...state,
        nextZIndex: state.nextZIndex + 1,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, isMinimized: false, zIndex: state.nextZIndex }
            : w,
        ),
      };
    case "MAXIMIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isMaximized: !w.isMaximized } : w,
        ),
      };
    case "FOCUS":
      return {
        ...state,
        nextZIndex: state.nextZIndex + 1,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: state.nextZIndex } : w,
        ),
      };
    case "MOVE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, position: { x: action.x, y: action.y } }
            : w,
        ),
      };
    case "RESIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, size: { width: action.width, height: action.height } }
            : w,
        ),
      };
    default:
      return state;
  }
}

// ─── Toast / context-menu / terminal-intent types ────────────────────────────

export type ToastKind = "info" | "success" | "error";

export interface Toast {
  id: number;
  text: string;
  kind: ToastKind;
}

export interface ContextMenuItem {
  /** Visible label. Ignored when `separator` is true. */
  label?: string;
  onSelect?: () => void;
  disabled?: boolean;
  /** When true, this entry renders as a divider only. */
  separator?: boolean;
}

export interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

export interface TerminalCdRequest {
  token: number;
  path: string[];
}

interface WindowManagerContextValue {
  windows: WindowInstance[];
  openFile: (fileNode: FileNode) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  /** Clear the desktop — every window drops to the taskbar. */
  minimizeAllWindows: () => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;

  toasts: Toast[];
  showToast: (text: string, kind?: ToastKind) => void;

  contextMenu: ContextMenuState | null;
  showContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
  hideContextMenu: () => void;

  terminalCdRequest: TerminalCdRequest | null;
  requestTerminalCd: (path: string[]) => void;
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(
  null,
);

export function WindowManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    windows: [],
    nextZIndex: 100,
  });

  // ── Toast state ──────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((text: string, kind: ToastKind = "info") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  // ── Context menu ─────────────────────────────────────────────────────────
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const showContextMenu = useCallback(
    (x: number, y: number, items: ContextMenuItem[]) =>
      setContextMenu({ x, y, items }),
    [],
  );
  const hideContextMenu = useCallback(() => setContextMenu(null), []);

  // ── Terminal cd intent ───────────────────────────────────────────────────
  const [terminalCdRequest, setTerminalCdRequest] =
    useState<TerminalCdRequest | null>(null);
  const cdTokenRef = useRef(0);

  const requestTerminalCd = useCallback((path: string[]) => {
    cdTokenRef.current += 1;
    setTerminalCdRequest({ token: cdTokenRef.current, path });
  }, []);

  // ── Window actions ───────────────────────────────────────────────────────
  const openFile = useCallback((fileNode: FileNode) => {
    if (fileNode.type === "link" && fileNode.data?.kind === "link") {
      window.open(fileNode.data.url, "_blank", "noopener,noreferrer");
      return;
    }
    dispatch({ type: "OPEN", fileNode });
  }, []);

  const closeWindow = useCallback(
    (id: string) => dispatch({ type: "CLOSE", id }),
    [],
  );
  const minimizeWindow = useCallback(
    (id: string) => dispatch({ type: "MINIMIZE", id }),
    [],
  );
  const minimizeAllWindows = useCallback(
    () => dispatch({ type: "MINIMIZE_ALL" }),
    [],
  );
  const restoreWindow = useCallback(
    (id: string) => dispatch({ type: "RESTORE", id }),
    [],
  );
  const maximizeWindow = useCallback(
    (id: string) => dispatch({ type: "MAXIMIZE", id }),
    [],
  );
  const focusWindow = useCallback(
    (id: string) => dispatch({ type: "FOCUS", id }),
    [],
  );
  const moveWindow = useCallback(
    (id: string, x: number, y: number) => dispatch({ type: "MOVE", id, x, y }),
    [],
  );
  const resizeWindow = useCallback(
    (id: string, width: number, height: number) =>
      dispatch({ type: "RESIZE", id, width, height }),
    [],
  );

  return (
    <WindowManagerContext.Provider
      value={{
        windows: state.windows,
        openFile,
        closeWindow,
        minimizeWindow,
        minimizeAllWindows,
        restoreWindow,
        maximizeWindow,
        focusWindow,
        moveWindow,
        resizeWindow,
        toasts,
        showToast,
        contextMenu,
        showContextMenu,
        hideContextMenu,
        terminalCdRequest,
        requestTerminalCd,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx)
    throw new Error(
      "useWindowManager must be used within WindowManagerProvider",
    );
  return ctx;
}
