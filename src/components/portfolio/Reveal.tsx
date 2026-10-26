import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Content is visible in SSR and when observers or JavaScript are unavailable. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  enabled = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || done.current) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const initial = element.getBoundingClientRect();
    // SSR is visible. Only prepare an entrance while genuinely below the screen.
    // Restored/hash positions and anything already presented stay settled.
    if (
      media.matches ||
      location.hash ||
      initial.top < innerHeight + 12 ||
      typeof IntersectionObserver !== "function"
    ) {
      done.current = true;
      return;
    }
    let observer: IntersectionObserver | null = null;
    let resize: ResizeObserver | null = null;
    let geometry = { top: initial.top + scrollY, height: initial.height };
    let timer: ReturnType<typeof setTimeout>;
    const settle = () => {
      done.current = true;
      element.dataset["revealState"] = "settled";
      clearTimeout(timer);
      observer?.disconnect();
      resize?.disconnect();
      window.removeEventListener("scroll", guard);
      for (const event of ["resize", "hashchange", "popstate", "pageshow"])
        window.removeEventListener(event, settle);
      document.removeEventListener("click", navigate, true);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("visibilitychange", settle);
      element.removeEventListener("focusin", settle);
      element.removeEventListener("animationend", end);
      media.removeEventListener("change", settle);
    };
    const enter = (top: number) => {
      if (element.dataset["revealState"] !== "pending") return;
      if (top < innerHeight * 0.9) return settle();
      element.dataset["revealState"] = "entering";
      observer?.disconnect();
      clearTimeout(timer);
      timer = setTimeout(settle, 400 + Math.min(delay, 80));
    };
    function guard() {
      const top = geometry.top - scrollY;
      if (top < innerHeight * 0.85 || top + geometry.height <= 0) settle();
      else if (top < innerHeight) enter(top);
    }
    function layoutChanged() {
      const rect = element!.getBoundingClientRect();
      const transform = getComputedStyle(element!).transform;
      const offset = transform === "none" ? 0 : new DOMMatrix(transform).m42;
      geometry = { top: rect.top + scrollY - offset, height: rect.height };
      guard();
    }
    function navigate(event: Event) {
      const target = event.target;
      if (target instanceof Element && target.closest("a,button,input,textarea,select")) settle();
    }
    function keyboard(event: KeyboardEvent) {
      if (["Home", "End", "PageUp", "PageDown"].includes(event.key)) settle();
    }
    function end(event: AnimationEvent) {
      if (event.target === element && event.animationName === "project-enter") settle();
    }
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) enter(entry.boundingClientRect.top);
        },
        { threshold: 0.01 },
      );
      timer = setTimeout(settle, 4000); // Never strand hidden content if enhancement stalls.
      element.dataset["revealState"] = "pending";
      observer.observe(element);
      window.addEventListener("scroll", guard, { passive: true });
      for (const event of ["resize", "hashchange", "popstate", "pageshow"])
        window.addEventListener(event, settle);
      document.addEventListener("click", navigate, true);
      document.addEventListener("keydown", keyboard);
      document.addEventListener("visibilitychange", settle);
      element.addEventListener("focusin", settle);
      element.addEventListener("animationend", end);
      media.addEventListener("change", settle);
      if (typeof ResizeObserver === "function") {
        resize = new ResizeObserver(layoutChanged);
        resize.observe(document.body);
      }
    } catch {
      settle();
    }
    return settle;
  }, [enabled, delay]);
  return (
    <div
      ref={ref}
      className={`${enabled ? "reveal-target " : ""}${className}`}
      style={{ "--reveal-delay": `${Math.min(delay, 80)}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
