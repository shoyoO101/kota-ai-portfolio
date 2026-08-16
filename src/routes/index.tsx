import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Workflow,
  MessageSquare,
  Database,
  Check,
  Zap,
  GitBranch,
  Cpu,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Kota AI — Autonomous AI Systems & Workflow Automation",
      },
    ],
  }),
  component: Index,
});

const PROJECTS = [
  {
    tag: "Support Automation",
    title: "Multi-Platform Customer Support Agent",
    description:
      "Autonomous web chat & messaging automation connected to internal knowledge bases. Resolves tier-1 tickets end-to-end and escalates the rest with full context.",
    bullets: ["Web + WhatsApp chat", "Knowledge-base grounded", "Human handoff ready"],
    accent: "from-indigo-soft/20",
  },
  {
    tag: "Revenue Pipeline",
    title: "Lead Intake & CRM Pipeline",
    description:
      "Automated lead qualification, instant scoring, and routing via custom webhooks. Every inbound lead enriched, ranked, and dropped into the right pipeline in seconds.",
    bullets: ["Instant scoring", "Webhook routing", "CRM sync"],
    accent: "from-indigo-soft/20",
  },
  {
    tag: "Knowledge Retrieval",
    title: "RAG & Vector Knowledge Systems",
    description:
      "Context-aware search tools built for instant data retrieval across documents. Custom chunking and retrieval over Qdrant for answers grounded in your own corpus.",
    bullets: ["Qdrant vector store", "Doc-grounded answers", "Sub-second search"],
    accent: "from-indigo-soft/20",
  },
] as const;

const CAPABILITIES = [
  {
    icon: Bot,
    title: "Custom AI Agents",
    description:
      "Autonomous decision-making and API execution. Agents that plan, call tools, and act — not just chat.",
  },
  {
    icon: Workflow,
    title: "Workflow Engineering",
    description:
      "n8n, webhooks, and complex backend pipelines wired together into reliable, observable automation.",
  },
  {
    icon: MessageSquare,
    title: "Embedded Chat Widgets",
    description:
      "Lightweight, zero-lag UI widgets dropped into your product so users talk to your system in place.",
  },
  {
    icon: Database,
    title: "Database & Vector Integrations",
    description:
      "Qdrant and custom knowledge bases wired for instant retrieval and grounded, accurate responses.",
  },
] as const;

const TECH_STACK = [
  "n8n",
  "Python",
  "OpenAI",
  "Anthropic",
  "Qdrant",
  "Webhooks",
  "Postman",
  "REST APIs",
  "WhatsApp Business API",
] as const;

const PIPELINE_STEPS = [
  { node: "Webhook Trigger", sub: "POST /lead", icon: Zap },
  { node: "LLM Parsing", sub: "extract intent", icon: Cpu },
  { node: "Vector DB Search", sub: "Qdrant top-k", icon: Database },
  { node: "Action", sub: "route + notify", icon: GitBranch },
] as const;

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Projects />
        <Capabilities />
        <TechStack />
        <AuditSection />
      </main>
      <Footer />
    </div>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">{children}</div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/70 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Brand + status */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
              Kota<span className="text-indigo-accent"> AI</span>
            </span>
            <span className="hidden items-center gap-1.5 rounded-full border border-hairline px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Open for Async Projects
            </span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#work"
              className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-block"
            >
              Work
            </a>
            <a
              href="#capabilities"
              className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-block"
            >
              Capabilities
            </a>
            <a
              href="#stack"
              className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-block"
            >
              Tech Stack
            </a>
            <a
              href="#audit"
              className="inline-flex items-center rounded-md border border-hairline px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-indigo-accent/60 hover:bg-indigo-soft/10"
            >
              Request Audit
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <Container>
        <div className="flex flex-col items-center pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-accent" />
            AI Systems Architect & Automation Specialist
          </div>

          {/* Headline */}
          <h1 className="mt-7 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            I build autonomous workflows and custom AI systems that run quietly in the background.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Send me your manual bottleneck, and I'll send back a custom video breakdown showing how to automate it.
          </p>

          {/* Actions */}
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href="#audit"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_oklch(0.66_0.13_268/0.4),0_8px_24px_-12px_oklch(0.66_0.13_268/0.6)] transition-all hover:shadow-[0_0_0_1px_oklch(0.66_0.13_268/0.6),0_12px_32px_-10px_oklch(0.66_0.13_268/0.7)]"
            >
              Request a Free Video Audit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              See Sample Workflows
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Pipeline mockup */}
          <PipelineMockup />
        </div>
      </Container>
    </section>
  );
}

function PipelineMockup() {
  return (
    <div className="mt-16 w-full max-w-4xl">
      <div className="glass-card overflow-hidden rounded-xl shadow-[0_24px_60px_-30px_oklch(0_0_0/0.9)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            pipeline.automation.live
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            running
          </span>
        </div>

        {/* Pipeline nodes */}
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-4 sm:gap-2">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.node} className="contents">
                <div className="group/node relative rounded-lg border border-hairline bg-surface-elevated p-3 text-left transition-colors hover:border-indigo-accent/40">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-hairline bg-background text-indigo-accent">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs font-semibold text-foreground">
                    {step.node}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {step.sub}
                  </p>
                </div>
                {/* connector arrow on desktop */}
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="hidden items-center justify-center sm:flex">
                    {/* spacer handled by gap */}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Log line */}
        <div className="border-t border-hairline px-5 py-3 font-mono text-[11px] text-muted-foreground">
          <span className="text-emerald-400/90">$</span> trigger received → parsed in 240ms →{" "}
          <span className="text-indigo-accent">3 docs retrieved</span> → routed to CRM ✓
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div id={id} className="mb-10 scroll-mt-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-indigo-accent">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function Projects() {
  return (
    <section className="border-b border-hairline py-20 sm:py-24">
      <Container>
        <SectionHeader
          id="work"
          eyebrow="Featured Work"
          title="Automation that ships and stays running"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="group glass-card flex flex-col rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-accent/40"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-indigo-accent/80">
                {p.tag}
              </span>
              <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-foreground">
                {p.title}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-hairline pt-4">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Check className="h-3.5 w-3.5 text-indigo-accent/80" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="border-b border-hairline py-20 sm:py-24">
      <Container>
        <SectionHeader
          id="capabilities"
          eyebrow="Core Capabilities"
          title="What I build, end to end"
        />
        <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2">
          {CAPABILITIES.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="group bg-card p-6 transition-colors hover:bg-surface-elevated"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-background text-indigo-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {c.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function TechStack() {
  return (
    <section className="border-b border-hairline py-20 sm:py-24">
      <Container>
        <SectionHeader id="stack" eyebrow="Tech Stack" title="Tools wired into the work" />
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-wrap gap-2.5">
            {TECH_STACK.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-lg border border-hairline bg-surface px-3 py-1.5 font-mono text-sm text-muted-foreground transition-colors hover:border-indigo-accent/50 hover:text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function AuditSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="glass-card grid gap-8 overflow-hidden rounded-xl p-8 md:grid-cols-2 md:p-10">
          {/* Left: copy */}
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-indigo-accent">
              Async Request
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              Get a free 5-minute Loom audit of your process.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Describe the repetitive work holding your business back. I'll
              record a personalized video walking through the exact automation
              architecture to fix it.
            </p>
            <ul className="mt-6 space-y-2">
              {["No sales call", "Reply within 48h", "Yours to keep"].map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-indigo-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <AuditForm />
        </div>
      </Container>
    </section>
  );
}

function AuditForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-hairline bg-surface p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-indigo-accent/40 bg-indigo-soft/10 text-indigo-accent">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Request received
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks — I'll record your audit and send the link to your inbox
          within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Kareem"
            className="h-10 w-full rounded-md border border-hairline bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-indigo-accent/60 focus:ring-2 focus:ring-ring"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="h-10 w-full rounded-md border border-hairline bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-indigo-accent/60 focus:ring-2 focus:ring-ring"
          />
        </Field>
      </div>
      <Field label="What manual task do you want to eliminate?" htmlFor="task">
        <textarea
          id="task"
          name="task"
          required
          rows={4}
          placeholder="e.g. We copy lead details from email into our CRM and tag them manually, ~40 times a day..."
          className="w-full resize-none rounded-md border border-hairline bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-indigo-accent/60 focus:ring-2 focus:ring-ring"
        />
      </Field>
      <button
        type="submit"
        className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_oklch(0.66_0.13_268/0.4),0_8px_24px_-12px_oklch(0.66_0.13_268/0.6)] transition-all hover:shadow-[0_0_0_1px_oklch(0.66_0.13_268/0.6),0_12px_32px_-10px_oklch(0.66_0.13_268/0.7)]"
      >
        Get My Video Audit
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            Kota<span className="text-indigo-accent"> AI</span>
          </span>
          <p className="text-xs text-muted-foreground">
            Designed by Kota AI © 2026. Built for precision.
          </p>
        </div>
      </Container>
    </footer>
  );
}
