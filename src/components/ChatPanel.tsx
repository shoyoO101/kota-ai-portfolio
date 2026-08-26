import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";

export const CHAT_WEBHOOK_URL =
  "https://n8n.trykotaai.com/webhook/1e8b39ac-ee67-43df-9733-408192ecfe2f/chat";

export const FLOATING_SESSION_KEY = "kota-ai-chat-session-id";
export const INLINE_SESSION_KEY = "kota-ai-chat-session-id-inline";

const QUICK_REPLIES = [
  "What is your warranty policy?",
  "What is your return policy?",
  "Do you ship internationally?",
  "Can you recommend a product for me?",
];

type ChatMessage = { id: string; role: "bot" | "user"; text: string };

function newId() {
  return crypto.randomUUID();
}

function getOrCreateSessionId(storageKey: string) {
  try {
    const existing = localStorage.getItem(storageKey);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(storageKey, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function extractReply(data: unknown): string {
  if (typeof data === "string" && data.trim()) return data;
  if (Array.isArray(data) && data.length > 0) return extractReply(data[0]);
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["output", "text", "message", "reply", "answer"]) {
      const val = obj[key];
      if (typeof val === "string" && val.trim()) return val;
    }
  }
  return "Sorry — I couldn't generate a response just now. Please try again.";
}

export function ChatPanel({
  sessionKey,
  onClose,
  className = "",
  autoFocus = false,
}: {
  sessionKey: string;
  onClose?: () => void;
  className?: string;
  autoFocus?: boolean;
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const sessionId = useRef("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const showPills = messages.length === 0 && !sending;

  useEffect(() => {
    sessionId.current = getOrCreateSessionId(sessionKey);
  }, [sessionKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  async function send(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || sending) return;
    if (!sessionId.current) sessionId.current = getOrCreateSessionId(sessionKey);
    setInput("");
    setMessages((prev) => [...prev, { id: newId(), role: "user", text }]);
    setSending(true);
    try {
      const res = await fetch(CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chatInput: text,
          action: "sendMessage",
          sessionId: sessionId.current,
        }),
      });
      const rawBody = await res.text();
      let parsed: unknown = rawBody;
      try {
        parsed = JSON.parse(rawBody);
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
      className={`flex flex-col overflow-hidden shadow-2xl ${className}`}
      style={{
        background: "#0a0a0a",
        borderRadius: 24,
        border: "1px solid #2a2a2a",
      }}
    >
      <header className="relative shrink-0 px-6 pb-4 pt-5">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800/60 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
        <div
          className={
            "flex items-center justify-center gap-2 pt-8 " +
            (onClose ? "pr-10" : "")
          }
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: "#4f7df3", boxShadow: "0 0 0 4px #4f7df333" }}
            aria-hidden
          />
          <h2 className="text-center text-[17px] font-semibold leading-snug text-white">
            Kota AI | E-Commerce Demo
          </h2>
        </div>
        <p className="mt-2 text-center text-xs leading-relaxed text-white/50">
          Ask about products, shipping, or returns.
        </p>
      </header>

      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-2"
      >
        {showPills &&
          QUICK_REPLIES.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void send(prompt)}
              className="w-fit max-w-full rounded-full px-5 py-3 text-left text-sm leading-snug text-white/90 transition-colors hover:bg-[#2a2a2a]"
              style={{ background: "#1a1a1a" }}
            >
              {prompt}
            </button>
          ))}

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
                ? { background: "#4f7df3", borderRadius: 24, color: "#fff" }
                : { background: "#1a1a1a", borderRadius: 24, color: "#f0f0f0" }
            }
          >
            {m.text}
          </div>
        ))}

        {sending && (
          <div
            className="max-w-[60%] self-start px-4 py-3"
            style={{ background: "#1a1a1a", borderRadius: 24 }}
            aria-label="Assistant is typing"
          >
            <span className="flex gap-1">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{
                    background: "#4f7df3",
                    animationDelay: `${d}ms`,
                  }}
                />
              ))}
            </span>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="shrink-0 px-4 pb-4 pt-2"
      >
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2"
          style={{ background: "#1a1a1a" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send us a message"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
            style={{ background: "#4f7df3" }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
