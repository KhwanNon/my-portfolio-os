"use client";

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div
        className="text-xs font-bold tracking-[0.3em] uppercase"
        style={{ color: "var(--os-accent)" }}
      >
        {children}
      </div>
      <div className="mt-1 h-px opacity-15" style={{ background: "var(--os-accent)" }} />
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-[10px] tracking-widest rounded-sm mr-1 mb-1"
      style={{
        border: "1px solid rgba(82,211,214,0.35)",
        color: "var(--os-accent)",
        background: "rgba(82,211,214,0.06)",
      }}
    >
      {text}
    </span>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const filled = Math.round(value / 10);
  return (
    <div className="flex items-center gap-3 mb-2">
      <span
        className="w-32 text-[11px] opacity-70 shrink-0"
        style={{ color: "var(--os-accent)" }}
      >
        {label}
      </span>
      <span className="text-[11px] tracking-wider" style={{ color: "var(--os-accent)" }}>
        {"█".repeat(filled)}
        <span className="opacity-20">{"░".repeat(10 - filled)}</span>
      </span>
      <span className="text-[10px] opacity-40 shrink-0" style={{ color: "var(--os-accent)" }}>
        {value}%
      </span>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4 rounded-sm"
      style={{
        border: "1px solid rgba(82,211,214,0.15)",
        background: "rgba(82,211,214,0.03)",
      }}
    >
      {children}
    </div>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-5 font-os-mono text-xs space-y-4"
      style={{ background: "var(--os-surface)", color: "var(--os-accent)" }}
    >
      {children}
    </div>
  );
}

// ─── SkillsUI ─────────────────────────────────────────────────────────────────
// Props: { title, items: { name, level? }[], layout?: "bars" | "badges" }

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

// ─── SoftSkillsUI ─────────────────────────────────────────────────────────────
// Props: { skills: { name, description? }[] }

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

// ─── ExperienceDescriptionUI ──────────────────────────────────────────────────
// Props: { role, company, period, duration, description, highlights[] }

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

// ─── TechStackUI ─────────────────────────────────────────────────────────────
// Props: { title?, techs: string[] }

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

// ─── EducationUI ─────────────────────────────────────────────────────────────
// Props: { type, institution, field, period, description?, subjects? }

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

// ─── PersonalBioUI ────────────────────────────────────────────────────────────
// Props: { bio, facts?: { label, value }[] }

interface Fact { label: string; value: string }
interface PersonalBioUIProps extends Record<string, unknown> {
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
              className="p-3 rounded-sm"
              style={{ border: "1px solid rgba(82,211,214,0.12)", background: "rgba(82,211,214,0.03)" }}
            >
              <div className="opacity-40 text-[10px] tracking-widest mb-1">{label}</div>
              <div>{value}</div>
            </div>
          ))}
        </div>
      )}
    </Wrapper>
  );
}

// ─── HobbiesUI ───────────────────────────────────────────────────────────────
// Props: { items: { name, emoji?, description? }[] }

interface HobbyItem { name: string; emoji?: string; description?: string }
interface HobbiesUIProps extends Record<string, unknown> {
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

// ─── ContactUI ───────────────────────────────────────────────────────────────
// Props: { links: { label, value, href }[] }

interface ContactLink { label: string; value: string; href: string }
interface ContactUIProps extends Record<string, unknown> {
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
            className="flex items-center justify-between px-4 py-3 rounded-sm transition-opacity hover:opacity-100 opacity-70 group"
            style={{ border: "1px solid rgba(82,211,214,0.2)", background: "rgba(82,211,214,0.04)" }}
          >
            <span className="opacity-50 w-20 shrink-0">{c.label}</span>
            <span className="group-hover:underline truncate">{c.value}</span>
          </a>
        ))}
      </div>
    </Wrapper>
  );
}

// ─── ProjectDescriptionUI ─────────────────────────────────────────────────────
// Props: { name, type?, description, highlights[], stack[], status, year, platform? }

interface ProjectDescriptionUIProps extends Record<string, unknown> {
  name?: string;
  type?: string;
  description?: string;
  highlights?: string[];
  stack?: string[];
  status?: string;
  year?: string;
  platform?: string;
}

export function ProjectDescriptionUI({
  name = "",
  type,
  description = "",
  highlights = [],
  stack = [],
  status = "",
  year = "",
  platform,
}: ProjectDescriptionUIProps) {
  return (
    <Wrapper>
      <SectionTitle>Project</SectionTitle>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-bold tracking-wide text-sm">{name}</div>
            {type && <div className="opacity-50 mt-0.5 text-[10px] tracking-widest uppercase">{type}</div>}
          </div>
          <div className="text-right shrink-0 ml-4 space-y-1">
            <div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-sm"
                style={{
                  color: status === "Completed" ? "var(--os-accent)" : "#e8a21a",
                  border: `1px solid ${status === "Completed" ? "rgba(82,211,214,0.3)" : "rgba(232,162,26,0.3)"}`,
                }}
              >
                {status}
              </span>
            </div>
            <div className="opacity-40 text-[10px]">{year}</div>
          </div>
        </div>

        <p className="opacity-70 leading-relaxed mb-3">{description}</p>

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

        {platform && (
          <div className="mb-2 opacity-60 text-[10px] tracking-widest">
            PLATFORM: {platform}
          </div>
        )}

        <div className="flex flex-wrap">
          {stack.map((s) => <Badge key={s} text={s} />)}
        </div>
      </Card>
    </Wrapper>
  );
}

// ─── Registry ─────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UI_COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  SkillsUI,
  SoftSkillsUI,
  ExperienceDescriptionUI,
  TechStackUI,
  EducationUI,
  PersonalBioUI,
  HobbiesUI,
  ContactUI,
  ProjectDescriptionUI,
};
