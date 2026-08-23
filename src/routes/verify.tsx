import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowLeft } from "lucide-react";

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

const WEBHOOK_URL =
  "https://n8n.trykotaai.com/webhook/222cd0d5-649c-4e81-bbb4-8361831dab51";

const WELCOME =
  "👋 Hi there! I'm a live AI demo trained on Sewell.com's e-commerce catalog. Ask me about their shipping times, return policies, or product recommendations to see how this works!";

const INTRO_PARAGRAPHS = [
  "Hi there! 👋",
  "If you received an email from kareem@hellokotaai.com, that's me — Kareem. I'm a solo developer building custom automation and AI solutions.",
  "My current focus is a RAG (Retrieval-Augmented Generation) chatbot that answers questions based on your own business data. You can test a demo of it right below.",
  "Beyond chatbots, I build automated workflows using n8n to save time on repetitive tasks and connect different tools together.",
  "If any of this sounds useful to you, just hit reply on my email — I'd love to hear what you're working on!",
];

type ChatMessage = { id: string; role: "bot" | "user"; text: string };

function newId() {
  return Math.random().toString(36).slice(2);
}

function extractReply(data: unknown): string {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["output", "text", "message", "reply", "answer"]) {
      const val = obj[key];
      if (typeof val === "string" && val.trim()) return val;
    }
  }
  return "Sorry — I couldn't generate a response just now. Please try again.";
}

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
          👇 Test the live RAG chatbot demo below.
        </p>
      </Container>
    </section>
  );
}

function ChatDemoSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-indigo-accent">
            Live Demo
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Try the RAG chatbot
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Trained on Sewell.com's e-commerce catalog. Ask about shipping
            times, return policies, or product recommendations.
          </p>
        </div>
        <EmbeddedChat />
      </Container>
    </section>
  );
}

function EmbeddedChat() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "bot", text: WELCOME },
  ]);
  const sessionId = useRef(newId() + newId());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { id: newId(), role: "user", text }]);
    setSending(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chatInput: text,
          action: "sendMessage",
          sessionId: sessionId.current,
        }),
      });
      const raw = await res.text();
      let parsed: unknown = raw;
      try {
        parsed = JSON.parse(raw);
      } catch {
        /* plain text response */
      }
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "bot", text: extractReply(parsed) },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "bot",
          text: "Connection error — please try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="flex h-[min(560px,60vh)] w-full flex-col overflow-hidden border border-hairline shadow-2xl"
      style={{ background: "#1a1a1a", borderRadius: 16 }}
    >
      {/* Header */}
      <div
        className="relative shrink-0 px-6 pb-6 pt-5"
        style={{ background: "#4f7df3" }}
      >
        <p className="pr-10 text-left text-base font-semibold text-white">
          Kota AI | E-Commerce Demo
        </p>
        <p className="mt-1 pr-10 text-left text-xs text-white/80">
          Ask me anything about products, shipping, or returns.
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "max-w-[85%] self-end px-4 py-2.5 text-sm leading-relaxed text-white"
                : "max-w-[90%] self-start px-4 py-2.5 text-sm leading-relaxed"
            }
            style={
              m.role === "user"
                ? { background: "#4f7df3", borderRadius: 16, color: "#fff" }
                : { background: "#2a2a2a", borderRadius: 16, color: "#f0f0f0" }
            }
          >
            {m.text}
          </div>
        ))}
        {sending && (
          <div
            className="max-w-[60%] self-start px-4 py-3"
            style={{ background: "#2a2a2a", borderRadius: 16 }}
          >
            <span className="flex gap-1">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{ background: "#4f7df3", animationDelay: `${d}ms` }}
                />
              ))}
            </span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="shrink-0 border-t border-hairline p-3"
        style={{ background: "#1a1a1a" }}
      >
        <div
          className="flex items-end gap-2 border border-hairline px-3 py-2 focus-within:border-[#4f7df3]"
          style={{ background: "#1a1a1a", borderRadius: 16 }}
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Type your question..."
            className="max-h-28 flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
            style={{ background: "#4f7df3" }}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
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
