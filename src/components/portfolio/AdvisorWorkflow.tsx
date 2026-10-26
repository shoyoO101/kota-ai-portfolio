import { Search, MessageSquare, Sparkles, ArrowDown } from "lucide-react";
import { COPY } from "@/lib/site-copy";
const icons = [MessageSquare, Search, Sparkles];

/** An explanatory diagram, never a simulated transcript or live activity feed. */
export function AdvisorWorkflow() {
  return (
    <figure className="advisor-workflow" aria-labelledby="advisor-workflow-title">
      <figcaption id="advisor-workflow-title">{COPY.work.advisorDiagram.title}</figcaption>
      <ol>
        {COPY.work.advisorDiagram.steps.map((step, index) => {
          const Icon = icons[index] ?? MessageSquare;
          return (
            <li key={step.title}>
              <span className="advisor-step-icon">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div>
                <h4>{step.title}</h4>
              </div>
              {index < icons.length - 1 && (
                <ArrowDown className="advisor-connector" size={14} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <div className="advisor-lead-note">
        <p>{COPY.work.advisorDiagram.leadBody}</p>
      </div>
    </figure>
  );
}
