import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ChatPanel, INLINE_SESSION_KEY } from "../components/ChatPanel";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify — Kareem | Kota AI" },
      {
        name: "description",
        content:
          "Hi from Kareem — a solo developer building custom automation and AI solutions. Test the live RAG chatbot demo right here.",
      },
      {
        property: "og:title",
        content: "Verify — Kareem | Kota AI",
      },
      {
        property: "og:description",
        content:
          "Hi from Kareem — a solo developer building custom automation and AI solutions. Test the live RAG chatbot demo right here.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Verify — Kareem | Kota AI" },
      {
        name: "twitter:description",
        content:
          "Hi from Kareem — a solo developer building custom automation and AI solutions. Test the live RAG chatbot demo right here.",
      },
    ],
  }),
  component: VerifyPage,
});

const INTRO_PARAGRAPHS = [
  "Hi there! 👋",
  "If you received an email from kareem@hellokotaai.com, that's me — Kareem. I'm a solo developer building custom automation and AI solutions.",
  "My current focus is a RAG (Retrieval-Augmented Generation) chatbot that answers questions based on your own business data. You can test a demo of it right below.",
  "Beyond chatbots, I build automated workflows using n8n to save time on repetitive tasks and connect different tools together.",
  "If any of this sounds useful to you, just hit reply on my email — I'd love to hear what you're working on!",
];

function VerifyPage() {
  return (
    <div className="min-h-screen">
      <VerifyHeader />
      <main>
        <VerifyHero />
        <ChatDemoSection />
      </main>
      <VerifyFooter />
    </div>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl px-6 sm:px-8">{children}</div>;
}

function VerifyHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/70 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kota AI
          </Link>
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            Kota<span className="text-indigo-accent"> AI</span>
          </span>
        </div>
      </Container>
    </header>
  );
}

function VerifyHero() {
  return (
    <section className="border-b border-hairline py-16 sm:py-20">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-indigo-accent">
          A note from Kareem
        </p>
        <div className="mt-6 space-y-5 text-left">
          {INTRO_PARAGRAPHS.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                  : "text-base leading-relaxed text-muted-foreground sm:text-lg"
              }
            >
              {p}
            </p>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          👇 Test the live RAG chatbot demo below — or use the floating chat in
          the corner.
        </p>
      </Container>
    </section>
  );
}

function ChatDemoSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-indigo-accent">
            Live Demo
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Try the RAG chatbot
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Trained on Sewell.com's e-commerce catalog. Ask about shipping
            times, return policies, or product recommendations.
          </p>
        </div>
        <ChatPanel
          sessionKey={INLINE_SESSION_KEY}
          className="mx-auto h-[min(640px,70vh)] w-full max-w-[380px]"
        />
      </Container>
    </section>
  );
}

function VerifyFooter() {
  return (
    <footer className="border-t border-hairline py-8">
      <Container>
        <p className="text-center font-mono text-xs text-muted-foreground">
          Designed by Kareem © 2026. Built for precision.
        </p>
      </Container>
    </footer>
  );
}
