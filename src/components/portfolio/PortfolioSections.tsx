import { ArrowRight, ArrowUpRight } from "lucide-react";
import { COPY, PROFILE_IMAGE } from "@/lib/site-copy";
import { track } from "@/lib/analytics";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Brand } from "./SiteHeader";
import { Reveal } from "./Reveal";
import { BrandMark } from "./BrandMark";

export function ProfileMark({ className = "" }: { className?: string }) {
  return PROFILE_IMAGE ? (
    <img
      className={`profile-image ${className}`}
      src={PROFILE_IMAGE.src}
      alt={PROFILE_IMAGE.alt}
      width={PROFILE_IMAGE.width}
      height={PROFILE_IMAGE.height}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <BrandMark className={`profile-monogram ${className}`} full />
  );
}
export function About() {
  return (
    <section id="about" className="section-space about-section" tabIndex={-1}>
      <div className="site-container">
        <Reveal className="about-grid">
          <div className="about-identity">
            <ProfileMark />
            <p>{COPY.about.note}</p>
          </div>
          <div className="about-copy">
            <span className="section-eyebrow">{COPY.about.eyebrow}</span>
            <h2>{COPY.about.heading}</h2>
            {COPY.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <a
              className="text-link"
              href="#contact"
              onClick={() => track("lets_talk_clicked", { location: "about" })}
            >
              {COPY.site.talk}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
function FAQAnswer({ answer }: { answer: string }) {
  const sourceName = COPY.work.bookingStats.source.split(",")[0] ?? COPY.work.bookingStats.source;
  const start = answer.indexOf(sourceName);
  if (start < 0) return answer;
  return (
    <>
      {answer.slice(0, start)}
      <a
        className="stat-source"
        href={COPY.work.bookingStats.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {sourceName}
      </a>
      {answer.slice(start + sourceName.length)}
    </>
  );
}

export function FAQs() {
  return (
    <section id="faq" className="section-space faq-section" tabIndex={-1}>
      <div className="site-container faq-grid">
        <Reveal>
          <h2>{COPY.faq.heading}</h2>
          <p className="section-description">{COPY.faq.intro}</p>
          <a
            className="text-link"
            href="#contact"
            onClick={() => track("lets_talk_clicked", { location: "faq" })}
          >
            {COPY.site.talk}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </Reveal>
        <Accordion type="single" collapsible className="faq-accordion">
          {COPY.faq.items.map(([question, answer], index) => (
            <AccordionItem value={`faq-${index}`} key={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>
                <FAQAnswer answer={answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
export function ClosingCTA() {
  return (
    <section className="closing-band">
      <div className="site-container closing-inner">
        <div>
          <h2>
            {COPY.closing.heading} <em>{COPY.closing.emphasis}</em> {COPY.closing.end}
          </h2>
          <p>{COPY.closing.body}</p>
        </div>
        <a
          href="#contact"
          className="button button-primary"
          onClick={() => track("lets_talk_clicked", { location: "closing_band" })}
        >
          {COPY.site.talk}
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Brand />
            <p>{COPY.footer.description}</p>
            {/* Future social links can live here without changing the footer grid. */}
          </div>
          <nav aria-label={COPY.footer.navLabel}>
            {COPY.nav.links.map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
            <a href="#contact">{COPY.footer.contact}</a>
          </nav>
          <div className="footer-contact">
            <a href={`mailto:${COPY.site.email}`}>
              {COPY.site.email}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{COPY.site.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
