"use client";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { SectionTitle, Card, Wrapper } from "./primitives";

// SkillsUI — Props: { title, items: { name, note?, description? }[] }
//
// One shape for every skill window, because the four of them are read one after
// another and a change of form between them would read as a change of meaning.
// A row says three things and stops: what it is, where it has been used, and
// what it does — the last in two lines at most, for a reader who knows the name
// but not the thing.
//
// `note` states verifiable context ("production daily · since 2021"), never a
// made-up score. No logos: a brand mark says nothing a name doesn't, and a list
// of them turns a skill sheet into a sponsor wall.

interface SkillItem { name: string; note?: string; description?: string }
interface SkillsUIProps {
  title?: string;
  items?: SkillItem[];
}

export function SkillsUI({ title, items = [] }: SkillsUIProps) {
  const S = useStrings();

  return (
    <Wrapper>
      <SectionTitle>{title ?? S.section.skills}</SectionTitle>
      <div className="space-y-2">
        {items.map((s) => (
          <Card key={s.name}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-bold">{s.name}</span>
              {s.note && (
                <span className="shrink-0 opacity-60 text-[11px] text-right">
                  {s.note}
                </span>
              )}
            </div>
            {s.description && (
              <p className="mt-1 text-[12px] opacity-60 leading-relaxed">
                {s.description}
              </p>
            )}
          </Card>
        ))}
      </div>
    </Wrapper>
  );
}
