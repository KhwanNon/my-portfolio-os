"use client";
import { SectionTitle, Badge, Card, Wrapper } from "./primitives";

// EducationUI — Props: { type, institution, field, period, description?, subjects?, gpa? }

interface EducationUIProps extends Record<string, unknown> {
  type?: string;
  institution?: string;
  field?: string;
  period?: string;
  description?: string;
  subjects?: string[];
  gpa?: string;
}

export function EducationUI({
  type = "",
  institution = "",
  field = "",
  period = "",
  description,
  subjects = [],
  gpa,
}: EducationUIProps) {
  return (
    <Wrapper>
      <SectionTitle>Education</SectionTitle>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-bold tracking-wide text-sm">{type}</div>
            <div className="opacity-70 mt-0.5">{field}</div>
            <div className="opacity-50 mt-0.5">{institution}</div>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div>{period}</div>
            {gpa && <div className="opacity-50 mt-0.5">GPA: {gpa}</div>}
          </div>
        </div>
        {description && <p className="opacity-70 leading-relaxed mb-3">{description}</p>}
        {subjects.length > 0 && (
          <div className="flex flex-wrap mt-2">
            {subjects.map((s) => <Badge key={s} text={s} />)}
          </div>
        )}
      </Card>
    </Wrapper>
  );
}
