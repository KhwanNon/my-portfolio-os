"use client";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { TechMark } from "./tech-icon";

// SkillsUI — Props: { title, items: { name, note?, description?, tags? }[] }
//
// One shape for every skill window, because the four of them are read one after
// another and a change of form between them would read as a change of meaning.
// A row is a game's item slot: the thing's mark in a tile, what it is and what
// it does, then the areas it belongs to and where it has been used.
//
// `note` states verifiable context ("production daily · since 2021"), never a
// made-up score.

interface SkillItem {
  name: string;
  note?: string;
  description?: string;
  /** The areas a skill belongs to, a word or two each. */
  tags?: string[];
}
interface SkillsUIProps {
  title?: string;
  items?: SkillItem[];
}

export function SkillsUI({ title, items = [] }: SkillsUIProps) {
  const S = useStrings();

  return (
    <div
      className="custom-scrollbar @container h-full w-full overflow-y-auto"
      style={{ background: "#020a05", color: "var(--os-text)" }}
    >
      <div className="space-y-3 p-5">
        <h1
          className="font-os-pixel pb-1 text-[22px] font-bold uppercase tracking-wide text-os-accent"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          {title ?? S.section.skills}
        </h1>

        {items.map((s) => (
          <article
            key={s.name}
            className="group flex items-center gap-4 border-2 border-os-border-strong p-3 hover:border-os-accent"
          >
            {/* The mark: the language's own logo where it has one. */}
            <span className="grid h-16 w-16 shrink-0 place-items-center border-2 border-os-border-strong bg-os-surface-1 text-os-accent group-hover:border-os-accent">
              <TechMark name={s.name} size={34} />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-3 @2xl:flex-row @2xl:items-center">
              <div className="min-w-0 flex-1">
                <h2 className="font-os-pixel text-[19px] font-bold leading-tight text-os-accent">
                  {s.name}
                </h2>
                {s.description && (
                  <p
                    className="font-os-mono mt-1 text-[13px] leading-relaxed"
                    style={{ color: "var(--os-text-dim)" }}
                  >
                    {s.description}
                  </p>
                )}
              </div>

              {(s.tags?.length || s.note) && (
                <div className="shrink-0 @2xl:w-72">
                  {s.tags && s.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <li
                          key={t}
                          className="font-os-mono border-2 border-os-border-strong px-2 py-0.5 text-[12px] text-os-accent"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.note && (
                    <p className="font-os-mono mt-2 text-[12px]" style={{ color: "var(--os-text-dim)" }}>
                      {s.note}
                    </p>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
