"use client";
import { SectionTitle, Badge, Bar, Card, Wrapper } from "./primitives";

// SkillsUI — Props: { title, items: { name, level? }[], layout?: "bars" | "badges" }

interface SkillItem { name: string; level?: number }
interface SkillsUIProps extends Record<string, unknown> {
  title?: string;
  items?: SkillItem[];
  layout?: "bars" | "badges";
}

export function SkillsUI({ title = "Skills", items = [], layout = "bars" }: SkillsUIProps) {
  return (
    <Wrapper>
      <SectionTitle>{title}</SectionTitle>
      {layout === "bars"
        ? items.map((s) => <Bar key={s.name} label={s.name} value={s.level ?? 80} />)
        : <div className="flex flex-wrap">{items.map((s) => <Badge key={s.name} text={s.name} />)}</div>
      }
    </Wrapper>
  );
}

// SoftSkillsUI — Props: { skills: { name, description? }[] }

interface SoftSkill { name: string; description?: string }
interface SoftSkillsUIProps extends Record<string, unknown> {
  skills?: SoftSkill[];
}

export function SoftSkillsUI({ skills = [] }: SoftSkillsUIProps) {
  return (
    <Wrapper>
      <SectionTitle>Soft Skills</SectionTitle>
      <div className="space-y-2">
        {skills.map((s) => (
          <Card key={s.name}>
            <div className="font-bold mb-1">{s.name}</div>
            {s.description && <div className="opacity-60 leading-relaxed">{s.description}</div>}
          </Card>
        ))}
      </div>
    </Wrapper>
  );
}
