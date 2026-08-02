"use client";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { SectionTitle, Wrapper } from "./primitives";

// ContactUI — Props: { links: { label, value, href }[] }
//
// Every row is a link, because a window called Contact exists so that a visitor
// can leave it. An address a reader has to copy by eye is the failure case.

interface ContactLink { label: string; value: string; href: string }
interface ContactUIProps {
  links?: ContactLink[];
}

export function ContactUI({ links = [] }: ContactUIProps) {
  const S = useStrings();

  return (
    <Wrapper>
      <SectionTitle>{S.section.contact}</SectionTitle>
      <div className="space-y-2">
        {links.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-lg transition-opacity hover:opacity-100 opacity-80 group"
            style={{ border: "1px solid var(--os-border)", background: "var(--os-surface-3)" }}
          >
            <span className="opacity-60 w-20 shrink-0">{c.label}</span>
            <span className="group-hover:underline truncate">{c.value}</span>
          </a>
        ))}
      </div>
    </Wrapper>
  );
}
