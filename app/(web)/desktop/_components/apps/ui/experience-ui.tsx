"use client";
import { useStrings } from "@/app/shared/hooks/use-locale";
import { useWindowManager } from "@/app/modules/desktop/context/window-manager-context";
import type { ProjectId } from "../../../_data/projects";
import { useDesktopData } from "../../../_lib/use-desktop-data";
import { findNodeById } from "../../../_lib/find-node";
import { SectionTitle, Badge, Card, Wrapper } from "./primitives";
import { TechIcon } from "./tech-icon";

// ExperienceUI — one window per company: role, highlights, tech stack, the
// projects the job produced, and link.

interface ExperienceUIProps {
  role?: string;
  company?: string;
  companyUrl?: string;
  period?: string;
  duration?: string;
  description?: string;
  highlights?: string[];
  stack?: string[];
  /**
   * The projects this job produced, by id. Ids rather than names or paths: the
   * compiler checks an id, and the lookup finds the project wherever it sits,
   * so neither renaming a project nor moving it breaks the link.
   */
  projects?: ProjectId[];
}

export function ExperienceUI({
  role = "",
  company = "",
  companyUrl,
  period = "",
  duration = "",
  description = "",
  highlights = [],
  stack = [],
  projects = [],
}: ExperienceUIProps) {
  const S = useStrings();
  const { openFile } = useWindowManager();
  const { projects: projectsRoot } = useDesktopData();

  // Resolved here rather than authored as nodes, so an id that no longer
  // matches a project drops out of the row instead of rendering a dead chip.
  const linked = projects
    .map((id) => findNodeById(projectsRoot, id))
    .filter((n) => n !== null);

  return (
    <Wrapper>
      <SectionTitle>{S.section.experience}</SectionTitle>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-bold tracking-wide text-sm">{role}</div>
            {companyUrl ? (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 mt-0.5 inline-block hover:opacity-100 hover:underline transition-opacity"
              >
                {company} ↗
              </a>
            ) : (
              <div className="opacity-60 mt-0.5">{company}</div>
            )}
          </div>
          <div className="text-right shrink-0 ml-4">
            <div>{period}</div>
            <div className="opacity-50 mt-0.5">{duration}</div>
          </div>
        </div>
        {description && <p className="opacity-70 leading-relaxed mb-3">{description}</p>}
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
        <div className="flex flex-wrap">
          {stack.map((t) => <Badge key={t} text={t} icon={<TechIcon name={t} />} />)}
        </div>
        {linked.length > 0 && (
          <div
            className="mt-4 pt-3 border-t"
            style={{ borderColor: "var(--os-border)" }}
          >
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2"
              style={{ color: "var(--os-text-dim)" }}
            >
              {S.experience.projects}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {linked.map((node) => (
                <button
                  key={node.id}
                  onClick={() => openFile(node)}
                  title={S.project.openFile(node.name)}
                  className="focus-ring inline-flex items-center gap-1.5 cursor-pointer rounded-md px-2.5 py-1 text-[11px] transition-colors duration-200 hover:bg-os-surface-3"
                  style={{
                    color: "var(--os-text)",
                    background: "var(--os-surface-1)",
                    border: "1px solid var(--os-border)",
                  }}
                >
                  {node.name.replace(/\.ui$/, "")}
                  <span aria-hidden style={{ color: "var(--os-text-dim)" }}>
                    ↗
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </Wrapper>
  );
}
