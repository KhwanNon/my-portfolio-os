"use client";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { SectionTitle, Badge, Card, Wrapper } from "./primitives";
import { TechIcon } from "./tech-icon";

// SkillsUI — Props: { title, items: { name, note? }[], layout?: "list" | "badges" }
// `note` states verifiable context ("production daily · since 2021"), not a made-up score.

interface SkillItem { name: string; note?: string }
interface SkillsUIProps {
  title?: string;
  items?: SkillItem[];
  layout?: "list" | "badges";
}

export function SkillsUI({ title, items = [], layout = "list" }: SkillsUIProps) {
  const S = useStrings();

  return (
    <Wrapper>
      <SectionTitle>{title ?? S.section.skills}</SectionTitle>
      {layout === "list"
        ? items.map((s) => (
            <div
              key={s.name}
              className="flex items-baseline justify-between gap-4 py-1.5 border-b last:border-b-0"
              style={{ borderColor: "var(--os-border)" }}
            >
              <span className="inline-flex items-center gap-2 text-[12px]">
                <TechIcon name={s.name} />
                {s.name}
              </span>
              {s.note && (
                <span className="opacity-60 text-[11px] text-right">
                  {s.note}
                </span>
              )}
            </div>
          ))
        : (
            <div className="flex flex-wrap">
              {items.map((s) => (
                <Badge key={s.name} text={s.name} icon={<TechIcon name={s.name} />} />
              ))}
            </div>
          )
      }
    </Wrapper>
  );
}

// SoftSkillsUI — Props: { skills: { name, description? }[] }

interface SoftSkill { name: string; description?: string }
interface SoftSkillsUIProps {
  skills?: SoftSkill[];
}

export function SoftSkillsUI({ skills = [] }: SoftSkillsUIProps) {
  const S = useStrings();

  return (
    <Wrapper>
      <SectionTitle>{S.section.softSkills}</SectionTitle>
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
