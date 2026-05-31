"use client";
import { SectionTitle, Badge, Card, Wrapper } from "./primitives";

// ExperienceDescriptionUI — Props: { role, company, period, duration, description, highlights[] }

interface ExperienceDescriptionUIProps extends Record<string, unknown> {
  role?: string;
  company?: string;
  period?: string;
  duration?: string;
  description?: string;
  highlights?: string[];
}

export function ExperienceDescriptionUI({
  role = "",
  company = "",
  period = "",
  duration = "",
  description = "",
  highlights = [],
}: ExperienceDescriptionUIProps) {
  return (
    <Wrapper>
      <SectionTitle>Experience</SectionTitle>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-bold tracking-wide text-sm">{role}</div>
            <div className="opacity-60 mt-0.5">{company}</div>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div>{period}</div>
            <div className="opacity-50 mt-0.5">{duration}</div>
          </div>
        </div>
        {description && <p className="opacity-70 leading-relaxed mb-3">{description}</p>}
        {highlights.length > 0 && (
          <ul className="space-y-1">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="opacity-40 shrink-0">▸</span>
                <span className="opacity-80">{h}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Wrapper>
  );
}

// TechStackUI — Props: { title?, techs: string[] }

interface TechStackUIProps extends Record<string, unknown> {
  title?: string;
  techs?: string[];
}

export function TechStackUI({ title = "Tech Stack", techs = [] }: TechStackUIProps) {
  return (
    <Wrapper>
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-wrap">
        {techs.map((t) => <Badge key={t} text={t} />)}
      </div>
    </Wrapper>
  );
}
