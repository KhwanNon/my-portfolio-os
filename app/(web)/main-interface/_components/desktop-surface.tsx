"use client";
// The desktop: two cards — the tools you can launch, and a curated route
// through the portfolio. They are separate panels rather than two bands under
// one hairline, because they are answers to different questions: what can I
// run, and what should I read. Windows float above this; it is the surface
// they come back to.
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import { applications, cDrive, suggestedItems } from "../_data/file-system-data";
import { FileIcon } from "./file-icon";

export function DesktopSurface() {
  const { openFile } = useWindowManager();

  return (
    <>
      <Panel title="Applications">
        {/* The cards carry their own width, so there are no columns to define —
            they pack from the left and wrap when the panel runs out, which is
            what a launcher does. */}
        <div className="flex flex-wrap gap-5">
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
        action={{ label: "View All", onSelect: () => openFile(cDrive) }}
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
  action?: { label: string; onSelect: () => void };
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-xl p-3.5 sm:p-5"
      style={{
        background: "var(--os-surface-1)",
        border: "1px solid var(--os-border)",
        boxShadow: "var(--shadow-1)",
      }}
    >
      <div className="mb-4 flex min-h-7 items-center justify-between gap-3">
        <h2
          className="text-[14px] font-semibold tracking-tight"
          style={{ color: "var(--os-text)" }}
        >
          {title}
        </h2>
        {action && (
          <button
            onClick={action.onSelect}
            className="focus-ring flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1 text-[12px] font-medium leading-5 transition-colors duration-200 hover:bg-os-surface-3"
            style={{
              border: "1px solid var(--os-border)",
              color: "var(--os-text-dim)",
            }}
          >
            {action.label}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
