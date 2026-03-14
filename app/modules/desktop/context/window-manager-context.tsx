"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import type { FileNode } from "@/app/shared/types/file-system";

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
  | { type: "RESTORE"; id: string }
  | { type: "MAXIMIZE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; width: number; height: number };

const DEFAULT_WINDOW_SIZES: Record<string, { width: number; height: number }> =
  {
    "system-command": { width: 640, height: 420 },
    preferences: { width: 540, height: 400 },
    "recycle-bin": { width: 520, height: 400 },
    "c-drive": { width: 680, height: 460 },
    "profile-txt": { width: 620, height: 440 },
  };

function getDefaultSize(fileNode: FileNode): { width: number; height: number } {
  return DEFAULT_WINDOW_SIZES[fileNode.id] ?? { width: 640, height: 460 };
}

function getDefaultPosition(count: number): { x: number; y: number } {
  const offset = (count % 8) * 28;
  return { x: 80 + offset, y: 60 + offset };
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
      const id = `win-${Date.now()}`;
      const position =
        action.position ?? getDefaultPosition(state.windows.length);
      const size = action.size ?? getDefaultSize(action.fileNode);
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

interface WindowManagerContextValue {
  windows: WindowInstance[];
  openFile: (fileNode: FileNode) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
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

  return (
    <WindowManagerContext.Provider
      value={{
        windows: state.windows,
        openFile,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        maximizeWindow,
        focusWindow,
        moveWindow,
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
