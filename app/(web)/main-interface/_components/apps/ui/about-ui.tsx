"use client";
import { SectionTitle, Card, Wrapper } from "./primitives";

// PersonalBioUI — Props: { bio, facts?: { label, value }[] }

interface Fact { label: string; value: string }
interface PersonalBioUIProps {
  bio?: string;
  facts?: Fact[];
}

export function PersonalBioUI({ bio = "", facts = [] }: PersonalBioUIProps) {
  return (
    <Wrapper>
      <SectionTitle>About Me</SectionTitle>
      {bio && (
        <Card>
          <p className="leading-relaxed opacity-85">{bio}</p>
        </Card>
      )}
      {facts.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {facts.map(({ label, value }) => (
            <div
              key={label}
              className="p-3 rounded-lg"
              style={{ border: "1px solid var(--os-border)", background: "var(--os-surface-3)" }}
            >
              <div className="opacity-60 text-[11px] mb-1">{label}</div>
              <div>{value}</div>
            </div>
          ))}
        </div>
      )}
    </Wrapper>
  );
}

// HobbiesUI — Props: { items: { name, emoji?, description? }[] }

interface HobbyItem { name: string; emoji?: string; description?: string }
interface HobbiesUIProps {
  items?: HobbyItem[];
}

export function HobbiesUI({ items = [] }: HobbiesUIProps) {
  return (
    <Wrapper>
      <SectionTitle>Hobbies &amp; Interests</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <Card key={item.name}>
            <div className="flex items-center gap-2 mb-1">
              {item.emoji && <span className="text-base">{item.emoji}</span>}
              <span className="font-bold">{item.name}</span>
            </div>
            {item.description && (
              <p className="opacity-60 leading-relaxed">{item.description}</p>
            )}
          </Card>
        ))}
      </div>
    </Wrapper>
  );
}

// ContactUI — Props: { links: { label, value, href }[] }

interface ContactLink { label: string; value: string; href: string }
interface ContactUIProps {
  links?: ContactLink[];
}

export function ContactUI({ links = [] }: ContactUIProps) {
  return (
    <Wrapper>
      <SectionTitle>Contact</SectionTitle>
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
