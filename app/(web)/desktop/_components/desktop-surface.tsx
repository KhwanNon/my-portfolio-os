"use client";
// The desktop proper: a column of launchers down the left edge and nothing
// else. It starts empty on purpose — the visitor has just switched a machine on,
// and what to open is theirs to choose. Windows float above this; it is what
// they come back to.
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useDesktopData } from "../_lib/use-desktop-data";
import { DesktopIcon } from "./desktop-icon";

export function DesktopSurface() {
  const { desktopIcons } = useDesktopData();
  const S = useStrings();

  return (
    <div className="desktop-surface">
      {/* Icons fill a column top to bottom, then start the next one — the way a
          desktop arranges itself. The row height is the icon's own, so a short
          screen wraps rather than clips. On a phone the same list is a plain
          grid, since there is no corner to hang a column from. */}
      <div
        role="group"
        aria-label={S.desktop.label}
        className="grid grid-cols-4 content-start gap-1 p-3 sm:auto-cols-[92px] sm:grid-flow-col sm:grid-cols-none sm:grid-rows-[repeat(auto-fill,minmax(98px,98px))] sm:p-2"
        style={{ height: "100%" }}
      >
        {desktopIcons.map(({ label, node }) => (
          <DesktopIcon key={node.id} node={node} label={label} />
        ))}
      </div>

      <SystemReadout />
    </div>
  );
}

/**
 * The one line of atmosphere: a prompt, a caret and a build number in the
 * corner. Quiet enough to be missed, and hidden on a phone where the corner is
 * a thumb's.
 */
function SystemReadout() {
  const S = useStrings();
  return (
    <div
      aria-hidden
      className="font-os-mono pointer-events-none absolute bottom-3 right-4 hidden select-none text-right text-[10px] leading-relaxed tracking-[0.18em] sm:block"
      style={{ color: "var(--os-text-faint)", opacity: 0.6 }}
    >
      <div>
        {S.start.title} · BUILD 2026.10
      </div>
      <div>
        {S.start.status}
        <span className="mx-2 opacity-50">/</span>
        <span style={{ color: "var(--os-accent)" }}>knt@portfolio:~$</span>
        <span className="os-caret ml-1 inline-block h-2.5 w-1.5 translate-y-px bg-current" />
      </div>
    </div>
  );
}
