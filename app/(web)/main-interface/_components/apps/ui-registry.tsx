"use client";

// ─── Shared sub-components ─────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "var(--os-accent)" }}>
        {title}
      </div>
      <div className="mt-1 opacity-20 text-[10px]" style={{ color: "var(--os-accent)" }}>
        ──────────────────────────────────────────────────────
      </div>
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

function ProgressBar({ label, value }: { label: string; value: number }) {
  const filled = Math.round(value / 10);
  const empty = 10 - filled;
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="w-28 text-[11px] opacity-70 flex-shrink-0" style={{ color: "var(--os-accent)" }}>
        {label}
      </span>
      <span className="text-[11px] tracking-wider" style={{ color: "var(--os-accent)" }}>
        {"█".repeat(filled)}
        <span className="opacity-20">{"░".repeat(empty)}</span>
      </span>
      <span className="text-[10px] opacity-50" style={{ color: "var(--os-accent)" }}>
        {value}%
      </span>
    </div>
  );
}

// ─── Skills Viewer ────────────────────────────────────────────────────────────
export function SkillsViewer() {
  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-5 font-os-mono text-xs"
      style={{ background: "var(--os-surface)" }}
    >
      <SectionHeader title="Technical Skills" />

      <div className="space-y-5">
        <div>
          <div className="text-[10px] tracking-widest mb-2 opacity-50" style={{ color: "var(--os-accent)" }}>
            MOBILE
          </div>
          <ProgressBar label="Flutter" value={95} />
          <ProgressBar label="Dart" value={95} />
        </div>

        <div>
          <div className="text-[10px] tracking-widest mb-2 opacity-50" style={{ color: "var(--os-accent)" }}>
            FRONTEND
          </div>
          <ProgressBar label="React" value={80} />
          <ProgressBar label="Next.js" value={80} />
          <ProgressBar label="TypeScript" value={78} />
          <ProgressBar label="Tailwind CSS" value={85} />
        </div>

        <div>
          <div className="text-[10px] tracking-widest mb-2 opacity-50" style={{ color: "var(--os-accent)" }}>
            ARCHITECTURE & PATTERNS
          </div>
          <ProgressBar label="Clean Arch" value={90} />
          <ProgressBar label="BLoC" value={88} />
          <ProgressBar label="MVVM" value={85} />
        </div>

        <div>
          <div className="text-[10px] tracking-widest mb-2 opacity-50" style={{ color: "var(--os-accent)" }}>
            TOOLS & DEVOPS
          </div>
          <ProgressBar label="Git" value={88} />
          <ProgressBar label="Firebase" value={80} />
          <ProgressBar label="REST API" value={85} />
          <ProgressBar label="Docker" value={60} />
        </div>

        <div>
          <div className="text-[10px] tracking-widest mb-3 opacity-50" style={{ color: "var(--os-accent)" }}>
            TECHNOLOGIES
          </div>
          <div className="flex flex-wrap">
            {[
              "Flutter","Dart","React","Next.js","TypeScript","Node.js",
              "Firebase","REST API","Git","Clean Architecture","BLoC",
              "MVVM","Tailwind CSS","Docker","Figma",
            ].map((t) => (
              <Badge key={t} text={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Experience Viewer ────────────────────────────────────────────────────────
export function ExperienceViewer() {
  const jobs = [
    {
      title: "Senior Flutter Developer",
      company: "Current Company",
      period: "2022 – Present",
      duration: "3+ Years",
      highlights: [
        "Lead developer for multiple Flutter projects",
        "Implemented Clean Architecture across all apps",
        "Managed and mentored development team",
        "Optimized CI/CD pipelines and release processes",
        "Delivered high-performance, production-grade apps",
      ],
      stack: ["Flutter", "Dart", "Clean Architecture", "BLoC", "Firebase"],
    },
    {
      title: "Junior Flutter Developer",
      company: "Startup",
      period: "2021 – 2022",
      duration: "1 Year",
      highlights: [
        "Developed new features from design to deployment",
        "REST API integration and state management",
        "Participated in agile sprints",
        "Fixed bugs and improved app performance",
      ],
      stack: ["Flutter", "Dart", "REST API", "Git"],
    },
  ];

  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-5 font-os-mono text-xs"
      style={{ background: "var(--os-surface)" }}
    >
      <SectionHeader title="Work Experience" />

      <div className="space-y-6">
        {jobs.map((job, i) => (
          <div
            key={i}
            className="p-4 rounded-sm"
            style={{
              border: "1px solid rgba(82,211,214,0.15)",
              background: "rgba(82,211,214,0.03)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold tracking-wide" style={{ color: "var(--os-accent)" }}>
                  {job.title}
                </div>
                <div className="opacity-60 mt-0.5" style={{ color: "var(--os-accent)" }}>
                  {job.company}
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div style={{ color: "var(--os-accent)" }}>{job.period}</div>
                <div className="opacity-50 mt-0.5" style={{ color: "var(--os-accent)" }}>
                  {job.duration}
                </div>
              </div>
            </div>

            {/* Highlights */}
            <ul className="space-y-1 mb-3">
              {job.highlights.map((h, j) => (
                <li key={j} className="flex gap-2">
                  <span className="opacity-40" style={{ color: "var(--os-accent)" }}>▸</span>
                  <span className="opacity-80" style={{ color: "var(--os-accent)" }}>{h}</span>
                </li>
              ))}
            </ul>

            {/* Stack */}
            <div className="flex flex-wrap">
              {job.stack.map((s) => (
                <Badge key={s} text={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Education Viewer ─────────────────────────────────────────────────────────
export function EducationViewer() {
  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-5 font-os-mono text-xs"
      style={{ background: "var(--os-surface)" }}
    >
      <SectionHeader title="Education" />

      <div className="space-y-4">
        <div
          className="p-4 rounded-sm"
          style={{
            border: "1px solid rgba(82,211,214,0.15)",
            background: "rgba(82,211,214,0.03)",
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-bold tracking-wide" style={{ color: "var(--os-accent)" }}>
                Bachelor of Science
              </div>
              <div className="opacity-60 mt-0.5" style={{ color: "var(--os-accent)" }}>
                Computer Science / Information Technology
              </div>
              <div className="opacity-50 mt-0.5" style={{ color: "var(--os-accent)" }}>
                University Name, Thailand
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4" style={{ color: "var(--os-accent)" }}>
              <div>2018 – 2022</div>
              <div className="opacity-50 mt-0.5">4 Years</div>
            </div>
          </div>
          <div className="flex flex-wrap mt-2">
            {["Algorithms", "Data Structures", "OOP", "Database Systems", "Software Engineering"].map(
              (s) => <Badge key={s} text={s} />
            )}
          </div>
        </div>

        <div
          className="p-4 rounded-sm"
          style={{
            border: "1px solid rgba(82,211,214,0.15)",
            background: "rgba(82,211,214,0.03)",
          }}
        >
          <div className="font-bold tracking-wide mb-1" style={{ color: "var(--os-accent)" }}>
            Self-Study & Continuous Learning
          </div>
          <div className="opacity-60 mb-3" style={{ color: "var(--os-accent)" }}>
            Online Courses & Personal Projects
          </div>
          <div className="flex flex-wrap">
            {[
              "Flutter Advanced","Clean Architecture","BLoC Pattern",
              "React / Next.js","TypeScript","System Design",
            ].map((s) => <Badge key={s} text={s} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── About Viewer ─────────────────────────────────────────────────────────────
export function AboutViewer() {
  const contacts = [
    { label: "Email", value: "your.email@example.com", link: "mailto:your.email@example.com" },
    { label: "GitHub", value: "github.com/your-username", link: "https://github.com" },
    { label: "LinkedIn", value: "linkedin.com/in/your-profile", link: "https://linkedin.com" },
  ];

  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-5 font-os-mono text-xs"
      style={{ background: "var(--os-surface)" }}
    >
      <SectionHeader title="About Me" />

      {/* Bio */}
      <div
        className="p-4 rounded-sm mb-4 leading-relaxed"
        style={{
          border: "1px solid rgba(82,211,214,0.15)",
          background: "rgba(82,211,214,0.03)",
          color: "var(--os-accent)",
        }}
      >
        <p className="mb-3">
          Hello! I&apos;m <strong>Khwanchai Nontawichit</strong> (Khwan), a
          26-year-old Mobile Developer with over 3 years of experience
          specializing in Flutter development.
        </p>
        <p className="mb-3 opacity-80">
          I have a strong background in leading development teams, structuring
          applications with Clean Architecture, and managing environments
          efficiently. I am passionate about mobile development and always eager
          to tackle new challenges.
        </p>
        <p className="opacity-80">
          I can also contribute to front-end development across various
          languages and frameworks — I adapt quickly due to shared concepts
          across technologies.
        </p>
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          ["Role", "Mobile Developer (Flutter)"],
          ["Experience", "3+ Years"],
          ["Location", "Thailand"],
          ["Status", "Open to Opportunities"],
          ["Main Stack", "Flutter · Dart"],
          ["Secondary", "React · Next.js · TS"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="p-3 rounded-sm"
            style={{
              border: "1px solid rgba(82,211,214,0.12)",
              background: "rgba(82,211,214,0.03)",
            }}
          >
            <div className="opacity-50 text-[10px] tracking-widest mb-1" style={{ color: "var(--os-accent)" }}>
              {k}
            </div>
            <div style={{ color: "var(--os-accent)" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Contacts */}
      <div className="space-y-2">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2 rounded-sm transition-all duration-200 hover:opacity-100 opacity-70 group"
            style={{
              border: "1px solid rgba(82,211,214,0.2)",
              background: "rgba(82,211,214,0.04)",
            }}
          >
            <span className="opacity-50 w-20" style={{ color: "var(--os-accent)" }}>
              {c.label}
            </span>
            <span
              className="group-hover:underline"
              style={{ color: "var(--os-accent)" }}
            >
              {c.value}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Projects Viewer ──────────────────────────────────────────────────────────
export function ProjectsViewer() {
  const projects = [
    {
      name: "Portfolio OS",
      description:
        "This very interface — a portfolio website styled as a full desktop OS with windows, file system, terminal, and theme switching.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      status: "In Development",
      year: "2024",
    },
    {
      name: "Flutter Clean Architecture Boilerplate",
      description:
        "Production-ready Flutter boilerplate with Clean Architecture, BLoC state management, dependency injection, and full test coverage.",
      stack: ["Flutter", "Dart", "BLoC", "Clean Architecture", "GetIt"],
      status: "Completed",
      year: "2023",
    },
    {
      name: "E-Commerce Mobile App",
      description:
        "Full-featured shopping app with product catalog, cart, checkout flow, user authentication, and payment integration.",
      stack: ["Flutter", "Dart", "Firebase", "Clean Architecture", "BLoC"],
      status: "Completed",
      year: "2023",
    },
    {
      name: "Team Task Manager",
      description:
        "Collaborative task management app with real-time updates, team roles, project boards, and notification system.",
      stack: ["Flutter", "Dart", "REST API", "Firebase", "MVVM"],
      status: "Completed",
      year: "2022",
    },
  ];

  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar p-5 font-os-mono text-xs"
      style={{ background: "var(--os-surface)" }}
    >
      <SectionHeader title="Projects" />

      <div className="space-y-4">
        {projects.map((p, i) => (
          <div
            key={i}
            className="p-4 rounded-sm"
            style={{
              border: "1px solid rgba(82,211,214,0.15)",
              background: "rgba(82,211,214,0.03)",
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className="font-bold tracking-wide"
                style={{ color: "var(--os-accent)" }}
              >
                {p.name}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-sm"
                  style={{
                    color: p.status === "Completed" ? "#52d3d6" : "#e8a21a",
                    border: `1px solid ${
                      p.status === "Completed"
                        ? "rgba(82,211,214,0.3)"
                        : "rgba(232,162,26,0.3)"
                    }`,
                  }}
                >
                  {p.status}
                </span>
                <span
                  className="text-[10px] opacity-40"
                  style={{ color: "var(--os-accent)" }}
                >
                  {p.year}
                </span>
              </div>
            </div>
            <p
              className="opacity-70 leading-relaxed mb-3"
              style={{ color: "var(--os-accent)" }}
            >
              {p.description}
            </p>
            <div className="flex flex-wrap">
              {p.stack.map((s) => (
                <Badge key={s} text={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Registry map ─────────────────────────────────────────────────────────────
export const UI_COMPONENT_REGISTRY: Record<
  string,
  React.ComponentType<object>
> = {
  SkillsViewer,
  ExperienceViewer,
  EducationViewer,
  AboutViewer,
  ProjectsViewer,
};
