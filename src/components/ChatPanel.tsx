import { useEffect, useRef, useState } from "react";
import Markdown, { type Components } from "react-markdown";
import { Send, X } from "lucide-react";
import {
  getSessionId,
  newId,
  setMessages,
  useChatMessages,
} from "../lib/chat-session";

export const CHAT_WEBHOOK_URL =
  "https://n8n.trykotaai.com/webhook/1e8b39ac-ee67-43df-9733-408192ecfe2f/chat";

export const FLOATING_SESSION_KEY = "kota-ai-chat-session-id";
export const INLINE_SESSION_KEY = "kota-ai-chat-session-id-inline";

const QUICK_REPLIES: { label: string; message: string }[] = [
  {
    label: "Help me find a product",
    message: "Help me find a product — what type of product do you have?",
  },
  {
    label: "Shipping & Returns",
    message: "What are your shipping options and return policy?",
  },
  {
    label: "Check a product's price",
    message: "I'd like to check a product's price.",
  },
  {
    label: "Help me choose a product",
    message:
      "Help me choose the right product for my setup — what do you need to know?",
  },
];


const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-[#4f7df3] underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  ),
};

function BotMessage({ text }: { text: string }) {
  return (
    <div className="text-inherit [overflow-wrap:anywhere]">
      <Markdown components={markdownComponents}>{text}</Markdown>
    </div>
  );
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
  const messages = useChatMessages(sessionKey);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const showPills = messages.length === 0 && !sending;

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
    const sessionId = getSessionId(sessionKey);
    setInput("");
    setMessages(sessionKey, (prev) => [
      ...prev,
      { id: newId(), role: "user", text },
    ]);
    setSending(true);
    try {
      const res = await fetch(CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chatInput: text,
          action: "sendMessage",
          sessionId,
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
            <X
              size={18}
              strokeWidth={1.75}
              className="text-current"
              aria-hidden
            />
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
        <p className="mt-1 text-center text-xs leading-relaxed text-white/40">
          Try live pricing on: HDMI Cable, Banana Plugs, IR Repeater, Lightning
          Cable, or Speaker Wire
        </p>
      </header>

      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-5 py-3"
      >
        {showPills &&
          QUICK_REPLIES.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void send(prompt)}
              className="w-fit max-w-full rounded-full px-5 py-3 text-left text-sm leading-snug text-white/90 outline-none transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(79,125,243,0.32)] focus:outline-none focus-visible:shadow-[0_8px_24px_rgba(79,125,243,0.32)]"
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
                ? "max-w-[85%] self-end px-3.5 py-2.5 text-sm leading-relaxed text-white"
                : "max-w-[90%] self-start px-3.5 py-2.5 text-sm leading-relaxed"
            }
            style={
              m.role === "user"
                ? { background: "#4f7df3", borderRadius: 24, color: "#fff" }
                : { background: "#1a1a1a", borderRadius: 24, color: "#f0f0f0" }
            }
          >
            {m.role === "bot" ? <BotMessage text={m.text} /> : m.text}
          </div>
        ))}

        {sending && (
          <div
            className="max-w-[85%] self-start px-3.5 py-2.5"
            style={{ background: "#1a1a1a", borderRadius: 24 }}
            aria-label="Assistant is typing"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs leading-none text-white/50">Typing...</span>
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
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="shrink-0 px-4 pb-4 pt-3"
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
            <Send
              size={18}
              strokeWidth={1.75}
              className="text-current"
              aria-hidden
            />
          </button>
        </div>
      </form>
    </div>
  );
}
