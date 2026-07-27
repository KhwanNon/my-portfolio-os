"use client";
// The desktop: two cards — the tools you can launch, and a curated route
// through the portfolio. They are separate panels rather than two bands under
// one hairline, because they are answers to different questions: what can I
// run, and what should I read. Windows float above this; it is the surface
// they come back to.
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { applications, cDrive, suggestedItems } from "../_data/file-system-data";
import { FileIcon } from "./file-icon";

export function DesktopSurface() {
  const { openFile } = useWindowManager();

  return (
    <>
      <Panel title="System">
        <div className="desktop-grid">
          {applications.map(({ node, kind }) => (
            <FileIcon
              key={node.id}
              fileNode={node}
              layout="desktop"
              caption={kind}
            />
          ))}
        </div>
      </Panel>

      <Panel
        title="Suggested"
        action={{
          label: "View all",
          icon: ArrowRight,
          onSelect: () => openFile(cDrive),
        }}
      >
        {/* A list, not tiles: these are things to read, and a reading order is
            what a list expresses. The line under each name is why it is worth
            opening — the one thing a file manager can't tell you. */}
        <div className="flex flex-col">
          {suggestedItems.map(({ node, reason }) => (
            <FileIcon
              key={node.id}
              fileNode={node}
              layout="list"
              caption={reason}
            />
          ))}
        </div>
      </Panel>
    </>
  );
}

/** One titled card of the desktop. */
function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; icon: LucideIcon; onSelect: () => void };
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: "var(--os-surface-1)",
        border: "1px solid var(--os-border)",
        boxShadow: "var(--shadow-1)",
      }}
    >
      <div className="mb-4 flex min-h-9 items-center justify-between gap-3">
        <h2
          className="text-[15px] font-semibold tracking-tight"
          style={{ color: "var(--os-text)" }}
        >
          {title}
        </h2>
        {action && (
          <button
            onClick={action.onSelect}
            className="focus-ring flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-medium transition-colors duration-200 hover:bg-os-surface-3"
            style={{
              border: "1px solid var(--os-border)",
              color: "var(--os-text-dim)",
            }}
          >
            <action.icon size={13} strokeWidth={1.9} />
            {action.label}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
