import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";

const WEBHOOK_URL =
  "https://n8n.trykotaai.com/webhook/1e8b39ac-ee67-43df-9733-408192ecfe2f/chat";

const WELCOME =
  "👋 Hi there! I'm a live AI demo trained on Sewell.com's e-commerce catalog. Ask me about their shipping times, return policies, or product recommendations to see how this works!";

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

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
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
  }, [messages, open]);

  // Keep the panel mounted during the closing transition so the exit
  // animation can play out before unmounting.
  const mounted = open || closing;

  function toggle(next: boolean) {
    if (next) {
      setOpen(true);
      setClosing(false);
    } else {
      setClosing(true);
      setOpen(false);
      window.setTimeout(() => setClosing(false), 230);
    }
  }

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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {mounted && (
        <div
          aria-hidden={!open}
          className={
            "flex h-[min(600px,calc(100vh-8rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden border border-hairline shadow-2xl transition-all duration-200 ease-out " +
            (open
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-95 opacity-0")
          }
          style={{ background: "#1a1a1a", borderRadius: 16, transformOrigin: "bottom right" }}
        >
          {/* Header */}
          <div
            className="relative shrink-0 px-6 pb-6 pt-5 text-center"
            style={{ background: "#4f7df3" }}
          >
            <button
              type="button"
              onClick={() => toggle(false)}
              aria-label="Close chat"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <X className="h-4 w-4" />
            </button>
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
      )}

      <button
        type="button"
        onClick={() => toggle(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105"
        style={{ background: "#4f7df3" }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
