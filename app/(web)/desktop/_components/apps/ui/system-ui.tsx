"use client";
import { BrandLogo } from "@/app/shared/components/brand-logo";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { FileGraphic } from "../../file-graphic";
import { Card, Wrapper, Row } from "./primitives";

// PropertiesUI — Props: { targetName, targetKind, icon?, absolutePath, sizeText, dateText, itemCount? }

interface PropertiesUIProps {
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
  const S = useStrings();

  return (
    <Wrapper>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: 40, height: 40, color: "var(--os-text)" }}
        >
          <FileGraphic icon={icon} size={32} />
        </div>
        <div>
          <div className="font-bold text-sm break-all">{targetName}</div>
          <div className="opacity-60 mt-0.5 text-[11px]">{targetKind}</div>
        </div>
      </div>

      <Card>
        <Row label={S.properties.path} value={absolutePath} />
        <Row label={S.properties.type} value={targetKind} />
        <Row label={S.properties.size} value={sizeText} />
        <Row label={S.properties.modified} value={dateText} />
        {typeof itemCount === "number" && (
          <Row
            label={S.properties.items}
            value={S.properties.itemCount(itemCount)}
          />
        )}
        <Row
          label={S.properties.permissions}
          value={S.properties.permissionsValue}
        />
      </Card>
    </Wrapper>
  );
}

export function AboutOSUI() {
  const S = useStrings();

  return (
    <Wrapper>
      {/* The one place the OS names itself, so it wears its own logo here the
          same way the tab and the desktop do. Clipped to the shell's ~28%
          squircle — the artwork's corners are page-white. */}
      <div className="flex items-center gap-3 mb-3">
        <BrandLogo size={44} alt="" />
        <div>
          <div className="font-bold text-sm">Portfolio OS</div>
          <div className="opacity-60 mt-0.5 text-[11px] font-os-mono">
            {S.aboutOs.version}
          </div>
        </div>
      </div>

      <Card>
        {S.aboutOs.rows.map(([label, value]) => (
          <Row key={label} label={label} value={value} />
        ))}
      </Card>

      <Card>
        <p className="opacity-75 leading-relaxed text-[11px]">
          {S.aboutOs.blurb}
        </p>
      </Card>

      <Card>
        <div className="opacity-60 text-[11px] font-medium mb-2">
          {S.aboutOs.tryIt}
        </div>
        <ul className="space-y-1 text-[11px] opacity-80">
          {S.aboutOs.tips.map((tip) => (
            <li key={tip}>▸ {tip}</li>
          ))}
          {/* Its own line rather than one more entry in `tips`: the command
              names are typed exactly as written and stay in `code`, so the
              sentence around them is the only part that translates. */}
          <li>
            ▸ {S.aboutOs.terminalTip.lead}
            <code>tree</code>
            {S.aboutOs.terminalTip.join}
            <code>find resume</code>
            {S.aboutOs.terminalTip.join}
            <code>cowsay hi</code>
            {S.aboutOs.terminalTip.tail}
          </li>
        </ul>
      </Card>
    </Wrapper>
  );
}
