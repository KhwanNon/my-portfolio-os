"use client";
import { SectionTitle, Badge, Card, Wrapper } from "./primitives";

// EducationUI — all education entries in one window, newest first.

interface EducationEntry {
  type: string;
  institution: string;
  field: string;
  period: string;
  description?: string;
  subjects?: string[];
  gpa?: string;
}

interface EducationUIProps {
  entries?: EducationEntry[];
}

export function EducationUI({ entries = [] }: EducationUIProps) {
  return (
    <Wrapper>
      <SectionTitle>Education</SectionTitle>
      {entries.map((entry) => (
        <Card key={entry.type}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-bold tracking-wide text-sm">{entry.type}</div>
              <div className="opacity-70 mt-0.5">{entry.field}</div>
              <div className="opacity-50 mt-0.5">{entry.institution}</div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div>{entry.period}</div>
              {entry.gpa && <div className="opacity-50 mt-0.5">GPA: {entry.gpa}</div>}
            </div>
          </div>
          {entry.description && (
            <p className="opacity-70 leading-relaxed mb-3">{entry.description}</p>
          )}
          {entry.subjects && entry.subjects.length > 0 && (
            <div className="flex flex-wrap mt-2">
              {entry.subjects.map((s) => <Badge key={s} text={s} />)}
            </div>
          )}
        </Card>
      ))}
    </Wrapper>
  );
}
