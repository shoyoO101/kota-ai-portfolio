import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatPanel, FLOATING_SESSION_KEY } from "./ChatPanel";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
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

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {mounted && (
        <div
          aria-hidden={!open}
          className={
            open
              ? "animate-[chat-in_280ms_ease-out] opacity-100 translate-y-0 scale-100"
              : "pointer-events-none translate-y-2 scale-95 opacity-0 transition-all duration-200 ease-out"
          }
          style={{ transformOrigin: "bottom right" }}
        >
          <ChatPanel
            sessionKey={FLOATING_SESSION_KEY}
            onClose={() => toggle(false)}
            autoFocus={open}
            className="h-[min(640px,calc(100vh-7.5rem))] w-[min(380px,calc(100vw-2.5rem))]"
          />
        </div>
      )}

      {!mounted && (
        <button
          type="button"
          onClick={() => toggle(true)}
          aria-label="Open chat"
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105"
          style={{ background: "#4f7df3" }}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
