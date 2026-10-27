import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/portfolio/SiteHeader";
import { HeroPreview } from "@/components/portfolio/HeroPreview";
import { DemoLink } from "@/components/portfolio/DemoLink";
import { Projects } from "@/components/portfolio/Projects";
import { Capabilities, Process } from "@/components/portfolio/Capabilities";
import { About, FAQs, Footer } from "@/components/portfolio/PortfolioSections";
import { Contact } from "@/components/portfolio/Contact";
import { COPY } from "@/lib/site-copy";
import { pageMeta } from "@/lib/site-content";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta(COPY.meta.homeTitle, COPY.meta.homeDescription),
    links: [{ rel: "canonical", href: "https://pinehourai.com/" }],
  }),
  component: Index,
});
function Index() {
  return (
    <>
      <a className="skip-link" href="#main">
        {COPY.site.skip}
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Projects />
        <Capabilities />
        <Process />
        <About />
        <FAQs />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
function Hero() {
  return (
    <section className="hero">
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span aria-hidden="true" />
            {COPY.hero.eyebrow}
          </p>
          <h1>
            <span>{COPY.hero.heading}</span> <span>{COPY.hero.middle}</span>{" "}
            <em>{COPY.hero.emphasis}</em>
          </h1>
          <p className="hero-description">{COPY.hero.body}</p>
          <div className="hero-actions">
            <a
              href="#contact"
              className="button button-primary"
              onClick={() => track("lets_talk_clicked", { location: "hero" })}
            >
              {COPY.site.talk}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <DemoLink className="button button-outline" source="hero_cta">
              {COPY.hero.secondary}
            </DemoLink>
          </div>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}
