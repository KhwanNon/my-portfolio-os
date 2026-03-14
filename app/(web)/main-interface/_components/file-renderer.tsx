"use client";
import type { FileNode } from "@/app/shared/types/file-system";
import { TxtRenderer } from "./renderers/txt-renderer";
import { FolderRenderer } from "./renderers/folder-renderer";
import { PdfRenderer } from "./renderers/pdf-renderer";
import { SlideRenderer } from "./renderers/slide-renderer";
import { PreferencesApp } from "./apps/preferences-app";
import { SystemCommandApp } from "./apps/system-command-app";
import { UI_COMPONENT_REGISTRY } from "./apps/ui-registry";

interface FileRendererProps {
  fileNode: FileNode;
}

export function FileRenderer({ fileNode }: FileRendererProps) {
  const { type, data } = fileNode;

  // ── Program ───────────────────────────────────────────────────────────────
  if (type === "program" && data?.kind === "program") {
    switch (data.component) {
      case "Preferences":
        return <PreferencesApp />;
      case "SystemCommand":
        return <SystemCommandApp />;
      default:
        return <ErrorView message={`Unknown program: ${data.component}`} />;
    }
  }

  // ── UI Component ──────────────────────────────────────────────────────────
  if (type === "ui" && data?.kind === "ui") {
    const Component = UI_COMPONENT_REGISTRY[data.component];
    if (Component) return <Component {...(data.props ?? {})} />;
    return <ErrorView message={`Unknown UI component: ${data.component}`} />;
  }

  // ── Folder ────────────────────────────────────────────────────────────────
  if (type === "folder" && data?.kind === "folder") {
    return <FolderRenderer data={data} />;
  }

  // ── Text File ─────────────────────────────────────────────────────────────
  if (type === "txt" && data?.kind === "txt") {
    return <TxtRenderer data={data} />;
  }

  // ── PDF File ──────────────────────────────────────────────────────────────
  if (type === "pdf" && data?.kind === "pdf") {
    return <PdfRenderer data={data} />;
  }

  // ── Slide ─────────────────────────────────────────────────────────────────
  if (type === "slide" && data?.kind === "slide") {
    return <SlideRenderer data={data} />;
  }

  return <ErrorView message={`Cannot render file type: ${type}`} />;
}

function ErrorView({ message }: { message: string }) {
  return (
    <div
      className="h-full flex items-center justify-center p-6 font-os-mono text-xs text-center"
      style={{ color: "#ff6b6b", background: "var(--os-surface)" }}
    >
      <div>
        <div className="text-sm mb-2">[ ERROR ]</div>
        <div className="opacity-70">{message}</div>
      </div>
    </div>
  );
}
