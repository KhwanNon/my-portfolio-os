"use client";
import { FileGraphic } from "../../file-graphic";
import { Card, Wrapper, Row } from "./primitives";

// PropertiesUI — Props: { targetName, targetKind, icon?, absolutePath, sizeText, dateText, itemCount? }

interface PropertiesUIProps extends Record<string, unknown> {
  targetName?: string;
  targetType?: string;
  targetKind?: string;
  icon?: string;
  absolutePath?: string;
  sizeText?: string;
  dateText?: string;
  itemCount?: number;
}

export function PropertiesUI({
  targetName = "",
  targetKind = "",
  icon,
  absolutePath = "",
  sizeText = "",
  dateText = "",
  itemCount,
}: PropertiesUIProps) {
  return (
    <Wrapper>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: 40, height: 40, color: "var(--os-accent)" }}
        >
          <FileGraphic icon={icon} size={32} strokeWidth={1.4} />
        </div>
        <div>
          <div className="font-bold tracking-wide text-sm break-all">{targetName}</div>
          <div className="opacity-50 mt-0.5 text-[10px] tracking-widest uppercase">{targetKind}</div>
        </div>
      </div>

      <Card>
        <Row label="Path" value={absolutePath} />
        <Row label="Type" value={targetKind} />
        <Row label="Size" value={sizeText} />
        <Row label="Modified" value={dateText} />
        {typeof itemCount === "number" && (
          <Row label="Items" value={`${itemCount} entr${itemCount === 1 ? "y" : "ies"}`} />
        )}
        <Row label="Permissions" value="r-x  (read-only portfolio)" />
      </Card>
    </Wrapper>
  );
}

export function AboutOSUI() {
  return (
    <Wrapper>
      <div className="mb-3">
        <div className="font-bold text-sm tracking-wide">Portfolio OS</div>
        <div className="opacity-50 mt-0.5 text-[10px] tracking-widest uppercase">
          Version 2.4.0 · Build 2024.Alpha
        </div>
      </div>

      <Card>
        <Row label="Engine"    value="Next.js 16 · React 19" />
        <Row label="Shell"     value="sys-cmd v1.0" />
        <Row label="Stack"     value="TypeScript · Tailwind · Framer Motion" />
        <Row label="Architect" value="Khwanchai Nontawichit (Khwan)" />
        <Row label="License"   value="MIT — fork it, learn from it" />
      </Card>

      <Card>
        <p className="opacity-75 leading-relaxed text-[11px]">
          A portfolio rendered as a desktop operating system. Window manager,
          virtual filesystem, working terminal with path completion,
          right-click menus, toasts — all the OS pleasantries you&apos;d expect,
          minus the BSODs.
        </p>
      </Card>

      <Card>
        <div className="opacity-50 text-[10px] tracking-widest uppercase mb-2">
          Try it
        </div>
        <ul className="space-y-1 text-[11px] opacity-80">
          <li>▸ Right-click any icon for Open / Copy Path / Properties.</li>
          <li>▸ Drag a window&apos;s bottom-right corner to resize.</li>
          <li>▸ Double-click the title bar to maximise.</li>
          <li>▸ In the terminal, try <code>tree</code>, <code>find resume</code>, <code>cowsay hi</code>.</li>
        </ul>
      </Card>
    </Wrapper>
  );
}
