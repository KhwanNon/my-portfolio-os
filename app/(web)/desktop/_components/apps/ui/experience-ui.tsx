"use client";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { SectionTitle, Badge, Card, Wrapper } from "./primitives";
import { TechIcon } from "./tech-icon";

// ExperienceUI — one window per company: role, highlights, tech stack, and link.

interface ExperienceUIProps {
  role?: string;
  company?: string;
  companyUrl?: string;
  period?: string;
  duration?: string;
  description?: string;
  highlights?: string[];
  stack?: string[];
}

export function ExperienceUI({
  role = "",
  company = "",
  companyUrl,
  period = "",
  duration = "",
  description = "",
  highlights = [],
  stack = [],
}: ExperienceUIProps) {
  const S = useStrings();

  return (
    <Wrapper>
      <SectionTitle>{S.section.experience}</SectionTitle>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-bold tracking-wide text-sm">{role}</div>
            {companyUrl ? (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 mt-0.5 inline-block hover:opacity-100 hover:underline transition-opacity"
              >
                {company} ↗
              </a>
            ) : (
              <div className="opacity-60 mt-0.5">{company}</div>
            )}
          </div>
          <div className="text-right shrink-0 ml-4">
            <div>{period}</div>
            <div className="opacity-50 mt-0.5">{duration}</div>
          </div>
        </div>
        {description && <p className="opacity-70 leading-relaxed mb-3">{description}</p>}
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
        <div className="flex flex-wrap">
          {stack.map((t) => <Badge key={t} text={t} icon={<TechIcon name={t} />} />)}
        </div>
      </Card>
    </Wrapper>
  );
}
