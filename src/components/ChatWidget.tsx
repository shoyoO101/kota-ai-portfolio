import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
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
      window.setTimeout(() => setClosing(false), 240);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {mounted && (
        <div
          aria-hidden={!open}
          className={
            open
              ? "animate-[chat-in_320ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
              : "pointer-events-none animate-[chat-out_240ms_ease_forwards]"
          }
          style={{ transformOrigin: "bottom right" }}
        >
          <ChatPanel
            sessionKey={FLOATING_SESSION_KEY}
            onClose={() => toggle(false)}
            autoFocus={open}
            className="h-[min(630px,calc(100vh-7.5rem))] w-[min(380px,calc(100vw-2.5rem))]"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => toggle(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105"
        style={{ background: "#4f7df3" }}
      >
        {open ? (
          <X size={24} strokeWidth={1.75} className="text-current" aria-hidden />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
