import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import { useChatUI } from "@/hooks/use-chat-ui";
import { COPY } from "@/lib/site-copy";
import { SHOW_FLOATING_LAUNCHER } from "@/lib/site-config";

const HINT_SEEN = "kota-demo-hint-seen";

/** Non-modal desktop panel; on small screens, a full-height sheet. */
export function ChatWidget() {
  const { open, setOpen, openChat, demoTrigger } = useChatUI();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [hint, setHint] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const hintSeen = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelMotion = useRef<Animation | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => {
      if (panel.current?.getAttribute("aria-hidden") === "false") return;
      const target = demoTrigger.current?.isConnected ? demoTrigger.current : launcher.current;
      target?.focus({ preventScroll: true });
    });
  }, [setOpen, demoTrigger]);

  useEffect(() => {
    setReady(true);
    const query = matchMedia("(max-width: 640px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useLayoutEffect(() => {
    const element = panel.current;
    if (!ready || !element || (!open && element.hidden)) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const closedTransform = reduce ? "none" : "translateY(8px) scale(0.98)";
    const style = getComputedStyle(element);
    const from = {
      opacity: element.hidden ? "0" : style.opacity,
      transform: element.hidden ? closedTransform : style.transform,
    };
    panelMotion.current?.cancel();
    if (open) {
      element.hidden = false;
      setVisible(true);
    }
    const animation = element.animate(
      [from, { opacity: open ? 1 : 0, transform: open || reduce ? "none" : closedTransform }],
      {
        duration: reduce ? (open ? 120 : 100) : open ? 220 : 160,
        easing: getComputedStyle(element).getPropertyValue("--ease-out").trim(),
        fill: "both",
      },
    );
    panelMotion.current = animation;
    animation.onfinish = () => {
      if (panelMotion.current !== animation) return;
      if (!open) {
        element.hidden = true;
        setVisible(false);
      }
      animation.cancel();
      panelMotion.current = null;
    };
  }, [open, ready]);
  useEffect(() => () => panelMotion.current?.cancel(), []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      setNearFooter(visible.size > 0);
    });
    document.querySelectorAll(".closing-band, .site-footer").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobile || !("IntersectionObserver" in window)) return;
    const contact = document.querySelector("#contact");
    if (!contact) return;
    // An in-flow mobile launcher keeps the form controls and reply note clear.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setContactVisible(entry?.isIntersecting ?? false);
      },
      { rootMargin: "80px 0px" },
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, [mobile]);

  useEffect(() => {
    if (!SHOW_FLOATING_LAUNCHER) return;
    const remember = () => {
      hintSeen.current = true;
      try {
        localStorage.setItem(HINT_SEEN, "1");
      } catch {
        /* Hint remains usable without storage. */
      }
    };
    if (open) {
      setHint(false);
      remember();
      return;
    }
    if (hintSeen.current) return;
    try {
      if (localStorage.getItem(HINT_SEEN)) return;
    } catch {
      /* Storage may be unavailable. */
    }
    const timer = setTimeout(() => {
      setHint(true);
      remember();
    }, 4000);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (mobile && event.key === "Tab") {
        const targets = Array.from(
          root.current?.querySelectorAll<HTMLElement>(
            "button:not(:disabled), input:not(:disabled), a[href]",
          ) ?? [],
        ).filter((el) => el.getClientRects().length && !el.closest("[hidden], [inert]"));
        const first = targets[0],
          last = targets.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, mobile, close]);

  useEffect(() => {
    if (!open || !mobile || !ready) return;
    // The portal sits outside the app. Prevent focus reaching covered page links.
    const siblings = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== root.current,
    );
    const previous = siblings.map((el) => [el, el.inert] as const);
    const overflow = document.body.style.overflow;
    previous.forEach(([el]) => {
      el.inert = true;
    });
    document.body.style.overflow = "hidden";
    return () => {
      previous.forEach(([el, inert]) => {
        el.inert = inert;
      });
      document.body.style.overflow = overflow;
    };
  }, [open, mobile, ready]);

  if (!ready) return null;
  return createPortal(
    <div ref={root} className="chat-widget-root" data-contact-visible={mobile && contactVisible}>
      <div
        ref={panel}
        id="demo-assistant-panel"
        className={`chat-floating ${open ? "chat-open" : "chat-close"}`}
        data-launcher={SHOW_FLOATING_LAUNCHER}
        hidden={!visible}
        inert={!open}
        aria-hidden={!open}
      >
        <ChatPanel variant="floating" onClose={close} autoFocus={open && visible} />
      </div>
      {SHOW_FLOATING_LAUNCHER && (
        <>
          {hint && !open && !nearFooter && (
            <div className="chat-hint">
              <button
                type="button"
                className="chat-hint-open"
                onClick={(event) => {
                  demoTrigger.current = event.currentTarget;
                  openChat("launcher");
                }}
              >
                {COPY.chat.hint}
              </button>
              <button
                type="button"
                className="chat-hint-dismiss"
                aria-label={COPY.chat.dismissHint}
                onClick={() => {
                  setHint(false);
                  launcher.current?.focus();
                }}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          )}
          <button
            ref={launcher}
            type="button"
            className={`chat-launcher${open ? " is-open" : ""}`}
            aria-label={open ? COPY.chat.closeLauncher : COPY.chat.open}
            aria-expanded={open}
            aria-controls="demo-assistant-panel"
            onClick={(event) => {
              if (open) close();
              else {
                demoTrigger.current = event.currentTarget;
                openChat("launcher");
              }
            }}
          >
            <MessageCircle
              className="launcher-chat-icon"
              size={24}
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <X className="launcher-close-icon" size={24} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
