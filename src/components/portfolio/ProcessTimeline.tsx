import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { COPY } from "@/lib/site-copy";
import { ClockIcon } from "./ClockIcon";
import { Reveal } from "./Reveal";

export function ProcessTimeline() {
  const timeline = useRef<HTMLOListElement>(null);
  const progressLine = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = timeline.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const steps = [...element.querySelectorAll<HTMLElement>(".process-step")];
    let frame = 0,
      active = false,
      listening = false,
      dirty = true;
    let geometry = { top: 0, height: 1, offsets: [] as number[] };
    let lastProgress = -1;
    const measure = () => {
      // All geometry reads precede all style/attribute writes. Reuse these
      // document coordinates until relevant layout changes, not on every scroll.
      const rect = element.getBoundingClientRect();
      const offsets = steps.map((step) => step.getBoundingClientRect().top - rect.top);
      geometry = { top: rect.top + scrollY, height: rect.height, offsets };
      dirty = false;
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!media.matches && (dirty || typeof ResizeObserver !== "function")) measure();
      const threshold = scrollY + innerHeight * 0.72;
      const progress = media.matches
        ? 1
        : Math.max(0, Math.min(1, (threshold - geometry.top - 14) / (geometry.height * 0.75)));
      const next = Math.round(progress * 10000) / 10000;
      const reached = geometry.offsets.map((offset) => geometry.top + offset + 14 <= threshold);
      const mode = String(!media.matches);
      if (element.dataset["motion"] !== mode) element.dataset["motion"] = mode;
      if (progressLine.current && lastProgress !== next) {
        progressLine.current.style.transform = `scaleY(${next})`;
        lastProgress = next;
      }
      if (!media.matches)
        steps.forEach((step, index) => {
          if (reached[index] && step.dataset["reached"] !== "true")
            step.dataset["reached"] = "true";
        });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const connect = () => {
      const needed = active && !media.matches;
      if (needed === listening) return;
      listening = needed;
      if (needed) window.addEventListener("scroll", request, { passive: true });
      else {
        window.removeEventListener("scroll", request);
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const invalidate = () => {
      dirty = true;
      if (active && !media.matches) request();
    };
    const modeChanged = () => {
      dirty = true;
      connect();
      update();
    };
    update();
    let visibility: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      visibility = new IntersectionObserver(
        ([entry]) => {
          active = Boolean(entry?.isIntersecting);
          if (active) dirty = true;
          connect();
          // One endpoint update when leaving; no off-screen scroll loop.
          update();
        },
        { rootMargin: "160px 0px" },
      );
      visibility.observe(element);
    } else {
      active = true;
      connect();
    }
    const resize = typeof ResizeObserver === "function" ? new ResizeObserver(invalidate) : null;
    resize?.observe(element);
    resize?.observe(document.body);
    // Disclosures above the timeline can change its document position even if
    // simultaneous layout changes elsewhere leave the total body height intact.
    for (
      let sibling = element.closest("section")?.previousElementSibling;
      sibling;
      sibling = sibling.previousElementSibling
    )
      resize?.observe(sibling);
    window.addEventListener("resize", invalidate);
    media.addEventListener("change", modeChanged);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", invalidate);
      media.removeEventListener("change", modeChanged);
      visibility?.disconnect();
      resize?.disconnect();
      delete element.dataset["motion"];
    };
  }, []);
  return (
    <div className="process-timeline-shell">
      <span ref={progressLine} className="process-progress-line" aria-hidden="true" />
      <ol ref={timeline} className="process-timeline" aria-label={COPY.process.heading}>
        {COPY.process.steps.map((step, index) => (
          <li className="process-step" key={step.title}>
            <span className="process-marker">
              <span className="process-clock-turn">
                <ClockIcon hour={(index + 1) * 3} />
              </span>
            </span>
            <Reveal delay={index * 70} className="process-step-copy">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <ul>
                {step.checklist.map((item) => (
                  <li key={item}>
                    <Check size={15} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
