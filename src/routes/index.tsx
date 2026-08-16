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
  Code2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Kareem | AI Automation Engineer — Kota AI",
      },
      {
        name: "description",
        content:
          "Kareem builds autonomous workflows and custom AI infrastructure — vector-grounded RAG chatbots, n8n backend pipelines, and API integrations that eliminate manual work.",
      },
      { property: "og:title", content: "Kareem | AI Automation Engineer — Kota AI" },
      {
        property: "og:description",
        content:
          "Vector-grounded RAG chatbots, n8n backend pipelines, and API integrations that eliminate manual work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kareem | AI Automation Engineer — Kota AI" },
      {
        name: "twitter:description",
        content:
          "Vector-grounded RAG chatbots, n8n backend pipelines, and API integrations that eliminate manual work.",
      },
    ],
  }),
  component: Index,
});

const PROJECTS = [
  {
    title: "Enterprise RAG Chatbot Widget",
    subtitle: "Customer Support & Knowledge Retrieval",
    description:
      "Context-aware, zero-hallucination web widget trained directly on custom business knowledge bases using Qdrant vector search and n8n orchestration.",
    badges: ["Qdrant", "n8n", "OpenAI", "REST APIs"],
  },
  {
    title: "Lead Intake & CRM Pipeline",
    subtitle: "Revenue Operations & Webhooks",
    description:
      "Automated lead qualification, instant intent scoring, and routing pipeline connecting inbound webhooks to CRM systems.",
    badges: ["Webhooks", "n8n", "Python", "CRM Integrations"],
  },
  {
    title: "Multi-Platform Messaging Assistant",
    subtitle: "API Integration & Workflows",
    description:
      "Custom AI assistant integrated across WhatsApp Business API, Telegram, and internal email triggers for automated query resolution.",
    badges: ["WhatsApp Business API", "Telegram API", "Postman"],
  },
] as const;

const CAPABILITIES = [
  {
    icon: Workflow,
    title: "Workflow Engineering",
    description:
      "Complex backend pipelines connecting n8n, webhooks, and REST APIs into reliable, observable automation.",
  },
  {
    icon: Bot,
    title: "AI Agent Architecture",
    description:
      "Autonomous decision-making tools with tool-calling capabilities — agents that plan, call APIs, and act.",
  },
  {
    icon: MessageSquare,
    title: "Custom Web Widgets",
    description:
      "Embedded, lightweight chat interfaces customized for web and mobile so users talk to your system in place.",
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
        <Contact />
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
              Open for Projects
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
              href="#contact"
              className="inline-flex items-center rounded-md border border-hairline px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-indigo-accent/60 hover:bg-indigo-soft/10"
            >
              Get in Touch
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
            AI Systems Architect & Automation Engineer
          </div>

          {/* Headline */}
          <h1 className="mt-7 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Hi, I'm Kareem. I build autonomous workflows and custom AI infrastructure.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Specializing in vector-grounded RAG chatbots, n8n backend pipelines,
            and API integrations that eliminate manual work.
          </p>

          {/* Actions */}
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_oklch(0.66_0.13_268/0.4),0_8px_24px_-12px_oklch(0.66_0.13_268/0.6)] transition-all hover:shadow-[0_0_0_1px_oklch(0.66_0.13_268/0.6),0_12px_32px_-10px_oklch(0.66_0.13_268/0.7)]"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View Architecture
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
          title="Featured Systems & Architecture"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="group glass-card flex flex-col rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-accent/40"
            >
              <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
                {p.title}
              </h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-indigo-accent/80">
                {p.subtitle}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-hairline pt-4">
                {p.badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-md border border-hairline bg-surface px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
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
        <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
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

function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-24">
      <Container>
        <div className="glass-card grid gap-8 overflow-hidden rounded-xl p-8 md:grid-cols-2 md:p-10">
          {/* Left: copy */}
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-indigo-accent">
              Contact
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              Let's build something.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Have a process you want to automate or need a custom AI system?
              Reach out directly or leave a message below.
            </p>
            <a
              href="mailto:kareem@trykotaai.com"
              className="group mt-6 inline-flex items-center gap-2 self-start rounded-md border border-hairline bg-surface px-3.5 py-2 font-mono text-sm text-foreground transition-colors hover:border-indigo-accent/60 hover:bg-indigo-soft/10"
            >
              <span className="text-indigo-accent">@</span>
              kareem@trykotaai.com
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Right: form */}
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-hairline bg-surface p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-indigo-accent/40 bg-indigo-soft/10 text-indigo-accent">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Message sent
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks — I'll get back to you at the email you provided, usually
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
      <Field label="Message / Website URL" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell me about the process you want to automate, or drop a link to your product / docs..."
          className="w-full resize-none rounded-md border border-hairline bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-indigo-accent/60 focus:ring-2 focus:ring-ring"
        />
      </Field>
      <button
        type="submit"
        className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_oklch(0.66_0.13_268/0.4),0_8px_24px_-12px_oklch(0.66_0.13_268/0.6)] transition-all hover:shadow-[0_0_0_1px_oklch(0.66_0.13_268/0.6),0_12px_32px_-10px_oklch(0.66_0.13_268/0.7)]"
      >
        Send Message
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
            Designed by Kareem © 2026. Built for precision.
          </p>
        </div>
      </Container>
    </footer>
  );
}
