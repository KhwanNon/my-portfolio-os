"use client";
import { SectionTitle, Badge, Card, Wrapper } from "./primitives";

// ProjectDescriptionUI — Props: { name, type?, description, highlights[], stack[], status, year, platform? }

interface ProjectDescriptionUIProps extends Record<string, unknown> {
  name?: string;
  type?: string;
  description?: string;
  highlights?: string[];
  stack?: string[];
  status?: string;
  year?: string;
  platform?: string;
}

export function ProjectDescriptionUI({
  name = "",
  type,
  description = "",
  highlights = [],
  stack = [],
  status = "",
  year = "",
  platform,
}: ProjectDescriptionUIProps) {
  return (
    <Wrapper>
      <SectionTitle>Project</SectionTitle>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-bold tracking-wide text-sm">{name}</div>
            {type && <div className="opacity-50 mt-0.5 text-[10px] tracking-widest uppercase">{type}</div>}
          </div>
          <div className="text-right shrink-0 ml-4 space-y-1">
            <div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-sm"
                style={{
                  color: status === "Completed" ? "var(--os-accent)" : "#e8a21a",
                  border: `1px solid ${status === "Completed" ? "rgba(82,211,214,0.3)" : "rgba(232,162,26,0.3)"}`,
                }}
              >
                {status}
              </span>
            </div>
            <div className="opacity-40 text-[10px]">{year}</div>
          </div>
        </div>

        <p className="opacity-70 leading-relaxed mb-3">{description}</p>

        {highlights.length > 0 && (
          <ul className="space-y-1 mb-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="opacity-40 shrink-0">▸</span>
                <span className="opacity-80">{h}</span>
              </li>
            ))}
          </ul>
        )}

        {platform && (
          <div className="mb-2 opacity-60 text-[10px] tracking-widest">
            PLATFORM: {platform}
          </div>
        )}

        <div className="flex flex-wrap">
          {stack.map((s) => <Badge key={s} text={s} />)}
        </div>
      </Card>
    </Wrapper>
  );
}
