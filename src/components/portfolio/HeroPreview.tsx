import { ArrowRight, AudioLines, CalendarCheck2, MessageSquare, Workflow } from "lucide-react";
import { COPY, PORTFOLIO_PROJECTS } from "@/lib/site-copy";
import { useChatUI } from "@/hooks/use-chat-ui";

const icons = [MessageSquare, CalendarCheck2, AudioLines];
export function HeroPreview() {
  const { openChat, demoTrigger } = useChatUI();
  return (
    <div className="hero-preview" role="group" aria-label={COPY.hero.previewTitle}>
      <div className="preview-chrome">
        <span className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{COPY.site.brand}</span>
        <Workflow size={17} aria-hidden="true" />
      </div>
      <div className="preview-body">
        <div className="preview-heading">
          <span>{COPY.hero.previewLabel}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </div>
        <div className="preview-project-grid">
          {PORTFOLIO_PROJECTS.map((project, index) => {
            const Icon = icons[index] ?? MessageSquare;
            const content = (
              <>
                <div className="preview-card-top">
                  <span className="preview-icon">
                    <Icon size={index === 0 ? 25 : 21} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  {index === 0 && <span className="preview-badge">{project.label}</span>}
                </div>
                <h3>{project.title}</h3>
                <p>{COPY.work.previewNotes[index]}</p>
                <span className="preview-card-arrow" aria-hidden="true">
                  <ArrowRight size={18} />
                </span>
              </>
            );
            const className = `preview-project preview-project-${project.id}`;
            return index === 0 ? (
              <button
                type="button"
                key={project.id}
                className={className}
                aria-label={COPY.work.demo}
                onClick={(event) => {
                  demoTrigger.current = event.currentTarget;
                  openChat("hero_tile");
                }}
              >
                {content}
              </button>
            ) : (
              <a key={project.id} className={className} href={`#project-${project.id}`}>
                {content}
              </a>
            );
          })}
        </div>
        <div className="preview-bottom">
          <span className="preview-bottom-line" aria-hidden="true" />
          <p>{COPY.hero.previewFooter}</p>
        </div>
      </div>
    </div>
  );
}
