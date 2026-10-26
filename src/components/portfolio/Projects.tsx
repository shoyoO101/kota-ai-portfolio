import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  CalendarCheck2,
  ChevronDown,
  ClipboardList,
  Database,
  FileText,
  Mail,
  MessageSquare,
  Mic,
  Plus,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { COPY, PORTFOLIO_PROJECTS, type PortfolioProject } from "@/lib/site-copy";
import { DemoLink } from "./DemoLink";
import { Reveal } from "./Reveal";
import { ProjectDisclosure } from "./ProjectDisclosure";
import { AdvisorWorkflow } from "./AdvisorWorkflow";
const icons = {
  chat: MessageSquare,
  calendar: CalendarCheck2,
  assistant: Bot,
  mic: Mic,
  shield: ShieldCheck,
  database: Database,
  sheet: FileText,
  form: ClipboardList,
  mail: Mail,
  integration: Workflow,
};
function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = icons[project.icon];
  const featured = project.id === "advisor";
  return (
    <Reveal enabled delay={index * 40} className={featured ? "featured-project" : ""}>
      <Collapsible.Root asChild open={open} onOpenChange={setOpen}>
        <article
          id={`project-${project.id}`}
          tabIndex={-1}
          className={`project-card${featured ? " project-card-featured" : " project-card-supporting"}`}
        >
          <div className="project-card-content">
            <div className={featured ? "advisor-overview" : undefined}>
              <div className="project-summary">
                <div className="project-card-heading">
                  <span className="project-icon">
                    <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className={`project-kind${featured ? " live-label" : ""}`}>
                    {featured && <span aria-hidden="true" />}
                    {project.label}
                  </span>
                </div>
                <h3>{project.title}</h3>
                <p className="project-description">
                  <strong>{project.emphasis}</strong>
                  <span className="project-description-body">{project.description}</span>
                </p>
                {featured && <DemoLink className="button button-primary project-demo-mobile" />}
                {featured && (
                  <p className="project-integration-note">{COPY.work.advisorIntegrationNote}</p>
                )}
                <ul className="tool-tags" aria-label={COPY.work.toolsLabel}>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              {featured && <AdvisorWorkflow />}
            </div>
          </div>
          <div className="project-controls">
            <Collapsible.Trigger className="flow-toggle">
              {COPY.work.flow}
              <ChevronDown size={17} aria-hidden="true" />
            </Collapsible.Trigger>
            {featured && <DemoLink className="button button-primary project-demo-desktop" />}
          </div>
          <ProjectDisclosure open={open}>
            <ol className="flow-timeline" aria-label={COPY.work.flowLabel}>
              {project.flow.map((step) => {
                const StepIcon = icons[step.icon];
                return (
                  <li key={step.title}>
                    <span className="flow-icon">
                      <StepIcon size={18} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <div>
                      <h4>{step.title}</h4>
                      <p>{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            {project.id === "booking" && <BookingContext />}
          </ProjectDisclosure>
        </article>
      </Collapsible.Root>
    </Reveal>
  );
}
function BookingContext() {
  return (
    <section className="booking-context" aria-labelledby="booking-context-title">
      <h4 id="booking-context-title">{COPY.work.bookingDetailsLabel}</h4>
      <div className="project-stat-block">
        <p>{COPY.work.bookingStats.gap}</p>
        <a
          className="stat-source"
          href={COPY.work.bookingStats.sourceUrl ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          {COPY.work.bookingStats.source}
        </a>
        <p className="stat-label">{COPY.work.bookingStats.buildLabel}</p>
        <p>{COPY.work.bookingStats.build}</p>
        <p>{COPY.work.optionalSms}</p>
      </div>
    </section>
  );
}
export function Projects() {
  return (
    <section id="work" className="section-space work-section" tabIndex={-1}>
      <div className="site-container">
        <Reveal>
          <div className="section-intro">
            <h2>{COPY.work.heading}</h2>
            <p>{COPY.work.intro}</p>
          </div>
        </Reveal>
        <div className="project-grid">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          <Reveal className="custom-project-wrap">
            <article className="custom-project">
              <span className="custom-project-icon" aria-hidden="true">
                <Plus size={24} strokeWidth={1.4} />
              </span>
              <div>
                <h3>{COPY.work.customHeading}</h3>
                <p>{COPY.work.customBody}</p>
              </div>
              <a href="#contact" className="text-link">
                {COPY.work.customCta}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
