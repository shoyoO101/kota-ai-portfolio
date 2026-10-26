import { COPY } from "@/lib/site-copy";
import { Reveal } from "./Reveal";
import { ProcessTimeline } from "./ProcessTimeline";

export function Capabilities() {
  return (
    <section id="what-i-build" className="section-space capabilities-section" tabIndex={-1}>
      <div className="site-container">
        <Reveal>
          <div className="section-intro">
            <span className="section-eyebrow">{COPY.capabilities.eyebrow}</span>
            <h2>{COPY.capabilities.heading}</h2>
            <p>{COPY.capabilities.intro}</p>
          </div>
        </Reveal>
        <div className="capabilities-grid">
          {COPY.capabilities.items.map((item) => (
            <article className="capability-row" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <p className="capabilities-more">{COPY.capabilities.more}</p>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="section-space process-section" tabIndex={-1}>
      <div className="site-container process-layout">
        <Reveal className="process-introduction">
          <div className="section-intro">
            <h2>{COPY.process.heading}</h2>
            <p>{COPY.process.intro}</p>
            <p className="process-timing">{COPY.process.timing}</p>
          </div>
        </Reveal>
        <ProcessTimeline />
      </div>
    </section>
  );
}
