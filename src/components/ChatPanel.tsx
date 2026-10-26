import { useEffect, useId, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import Markdown, { defaultUrlTransform, type Components } from "react-markdown";
import { ArrowRight, Send, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { sendChatMessage } from "@/lib/chat.functions";
import { CHAT_COPY, QUICK_PROMPTS } from "@/lib/chat-response";
import { useChatSession } from "@/lib/chat-session";
import { CHAT_STILL_WORKING_MS, runChatRequest } from "@/lib/chat-request";
import { useChatUI } from "@/hooks/use-chat-ui";
import { track } from "@/lib/analytics";
import { BrandMark } from "./portfolio/BrandMark";
import { ClockIcon } from "./portfolio/ClockIcon";

const markdownComponents: Components = {
  a: ({ href, children }) =>
    href ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <span>{children}</span>
    ),
};
// Raw HTML is skipped, URL schemes are filtered, and only these inert Markdown
// elements can render. No HTML parser, scripts, images or embedded content.
const markdownElements = [
  "p",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "a",
  "code",
  "pre",
  "blockquote",
  "br",
  "hr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

export function ChatPanel({
  variant = "inline",
  onClose,
  className = "",
  autoFocus = false,
}: {
  variant?: "inline" | "floating";
  onClose?: () => void;
  className?: string;
  autoFocus?: boolean;
}) {
  const sendChat = useServerFn(sendChatMessage);
  const { open, inlineInput } = useChatUI();
  const { messages, pending, pendingSince } = useChatSession();
  const [input, setInput] = useState("");
  const [stillWorking, setStillWorking] = useState(false);
  const localInput = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  const heading = useId();
  const inputRef = variant === "inline" ? inlineInput : localInput;
  const active = variant === "inline" || open;
  const lastMessage = messages.at(-1);

  useEffect(() => {
    const container = scrollRef.current;
    if (!active || !container) return;
    const target = Array.from(container.querySelectorAll<HTMLElement>("[data-message-id]")).at(-1);
    if (!target) return;
    // Move only the message scroller, never the page or the enclosing panel.
    const top =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      parseFloat(getComputedStyle(container).paddingTop);
    container.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }, [lastMessage?.id, active, autoFocus]);
  useEffect(() => {
    setStillWorking(false);
    if (pendingSince === null) return;
    const remaining = CHAT_STILL_WORKING_MS - (Date.now() - pendingSince);
    if (remaining <= 0) {
      setStillWorking(true);
      return;
    }
    const timer = setTimeout(() => setStillWorking(true), remaining);
    return () => clearTimeout(timer);
  }, [pendingSince]);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus, inputRef]);

  function send(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || composing.current || pending) return;
    setInput("");
    void runChatRequest(text, (data, signal) => sendChat({ data, signal }));
  }

  return (
    <section className={`chat-panel ${className}`} role="region" aria-label={CHAT_COPY.region}>
      <header className="chat-header">
        <BrandMark className="chat-header-mark" />
        <div>
          <h2 id={heading}>{CHAT_COPY.title}</h2>
          <p>{CHAT_COPY.source}</p>
        </div>
        {onClose && (
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label={CHAT_COPY.close}
          >
            <X size={19} />
          </button>
        )}
      </header>
      <div
        className="chat-conversation"
        ref={scrollRef}
        role="log"
        aria-label={CHAT_COPY.conversation}
        aria-live="off"
        tabIndex={0}
      >
        {messages.length === 0 && (
          <>
            <p className="chat-intro">{CHAT_COPY.intro}</p>
            <div className="chat-prompts">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  type="button"
                  key={prompt.label}
                  disabled={pending}
                  onClick={() => {
                    track("demo_chip_clicked", { label: prompt.label });
                    void send(prompt.message);
                  }}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </>
        )}
        {messages.map((message) => {
          const bubble = (
            <div
              className={`chat-message chat-message-${message.role}${message.error ? " chat-message-error" : ""}`}
              key={message.id}
              data-message-id={message.role === "user" ? message.id : undefined}
            >
              <span className="sr-only">
                {message.role === "user"
                  ? CHAT_COPY.you
                  : message.error
                    ? CHAT_COPY.status
                    : CHAT_COPY.advisor}
              </span>
              {message.role === "bot" ? (
                <Markdown
                  skipHtml
                  allowedElements={markdownElements}
                  urlTransform={defaultUrlTransform}
                  components={markdownComponents}
                >
                  {message.text}
                </Markdown>
              ) : (
                message.text
              )}
            </div>
          );
          return message.role === "bot" ? (
            <div className="chat-assistant-row" key={message.id} data-message-id={message.id}>
              <BrandMark className="chat-message-avatar" />
              {bubble}
            </div>
          ) : (
            bubble
          );
        })}
        {pending && (
          <div className="chat-assistant-row chat-pending-row">
            <BrandMark className="chat-message-avatar" />
            <div className="chat-message chat-pending">
              <ClockIcon ticking />
              {stillWorking && <span className="chat-still-working">{CHAT_COPY.stillWorking}</span>}
            </div>
          </div>
        )}
      </div>
      <div
        className="sr-only"
        role="status"
        aria-live={active ? "polite" : "off"}
        aria-atomic="true"
      >
        {pending ? CHAT_COPY.pending : lastMessage?.role === "bot" ? lastMessage.text : ""}
      </div>
      <form
        className="chat-composer"
        onSubmit={(event) => {
          event.preventDefault();
          if (!composing.current) void send();
        }}
      >
        <div className="chat-input-row">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={() => {
              composing.current = false;
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)
              )
                event.preventDefault();
            }}
            maxLength={5000}
            autoComplete="off"
            aria-label={CHAT_COPY.input}
            placeholder={CHAT_COPY.placeholder}
          />
          <button
            type="submit"
            className="chat-send"
            aria-label={CHAT_COPY.send}
            disabled={!input.trim() || pending}
          >
            <Send size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </form>
      <footer className="chat-footer">
        <p className="demo-disclaimer">{CHAT_COPY.disclaimer}</p>
        {variant === "inline" ? (
          <Link
            to="/"
            hash="contact"
            className="chat-conversion"
            onClick={() => track("lets_talk_clicked", { location: "panel" })}
          >
            {CHAT_COPY.conversion}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        ) : (
          <a
            href="#contact"
            className="chat-conversion"
            onClick={() => {
              track("lets_talk_clicked", { location: "panel" });
              onClose?.();
            }}
          >
            {CHAT_COPY.conversion}
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
      </footer>
    </section>
  );
}
