import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";
import { Brand } from "@/components/portfolio/SiteHeader";
import { ProfileMark } from "@/components/portfolio/PortfolioSections";
import { COPY } from "@/lib/site-copy";
import { pageMeta } from "@/lib/site-content";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: pageMeta(COPY.meta.verifyTitle, COPY.meta.verifyDescription) }),
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        {COPY.site.skip}
      </a>
      <header className="verify-header site-container">
        <Brand />
      </header>
      <main id="main" className="site-container verify-layout">
        <div className="verify-copy">
          <h1>
            {COPY.verify.heading} <em>{COPY.verify.emphasis}</em>
          </h1>
          <div className="verify-identity">
            <ProfileMark />
            <div>
              <h2>{COPY.verify.name}</h2>
              <p>{COPY.verify.identity}</p>
              <a href={`mailto:${COPY.site.email}`}>
                {COPY.site.email}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
          <p className="verify-note">{COPY.verify.note}</p>
          <section className="verify-outreach" aria-labelledby="verify-outreach-heading">
            <h2 id="verify-outreach-heading">{COPY.verify.outreach.heading}</h2>
            <p>{COPY.verify.outreach.description}</p>
            <ul>
              {COPY.verify.outreach.addresses.map((address) => (
                <li key={address}>
                  <a href={`mailto:${address}`}>{address}</a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="verify-demo" aria-label={COPY.verify.chatLabel}>
          <span className="project-kind live-label verify-demo-label">
            <span aria-hidden="true" />
            {COPY.verify.badge}
          </span>
          <ChatPanel variant="inline" className="inline-chat" />
        </div>
        <div className="verify-followup">
          <div className="verify-actions">
            <a
              className="button button-primary"
              href={`mailto:${COPY.site.email}?subject=${encodeURIComponent(COPY.verify.replySubject)}`}
              onClick={() => track("reply_email_clicked")}
            >
              {COPY.verify.reply}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <Link
              to="/"
              className="text-link verify-work"
              onClick={() => track("full_work_clicked")}
            >
              {COPY.verify.work}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="verify-points">
            {COPY.verify.points.map((point) => (
              <li key={point}>
                <Check size={16} strokeWidth={1.8} aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer className="verify-footer site-container">
        <p>
          {COPY.site.copyright} {COPY.verify.footer}
        </p>
      </footer>
    </>
  );
}
