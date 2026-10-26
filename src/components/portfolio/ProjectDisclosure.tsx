import * as Collapsible from "@radix-ui/react-collapsible";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

/** Keep Radix's trigger/content relationship, but retarget from the live height.
 * Height is intentionally local: text must reflow, so scaling isn't equivalent. */
export function ProjectDisclosure({
  open,
  children,
  className = "flow-expand",
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const motion = useRef<Animation | null>(null);
  const fade = useRef<Animation | null>(null);
  const targetHeight = useRef(-1);
  useLayoutEffect(() => {
    const element = outer.current,
      content = inner.current;
    if (!element || !content) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const from = element.getBoundingClientRect().height;
      element.hidden = false;
      const target = open ? content.scrollHeight : 0;
      if (motion.current?.playState === "running" && targetHeight.current === target) return;
      const opacity = getComputedStyle(content).opacity;
      motion.current?.cancel();
      fade.current?.cancel();
      targetHeight.current = target;
      if (media.matches || !element.animate || Math.abs(from - target) < 1) {
        element.style.height = open ? "auto" : "0px";
        content.style.opacity = open ? "1" : "0";
        element.hidden = !open;
        return;
      }
      const easing = getComputedStyle(element).getPropertyValue("--ease-out").trim();
      element.style.height = `${from}px`;
      content.style.opacity = open ? "1" : "0";
      const animation = element.animate([{ height: `${from}px` }, { height: `${target}px` }], {
        duration: 220,
        easing,
        fill: "both",
      });
      motion.current = animation;
      fade.current = content.animate([{ opacity }, { opacity: open ? 1 : 0 }], {
        duration: open ? 140 : 100,
        easing,
        fill: "both",
      });
      animation.onfinish = () => {
        if (motion.current !== animation) return;
        element.style.height = open ? "auto" : "0px";
        element.hidden = !open;
        animation.cancel();
        fade.current?.cancel();
        motion.current = null;
      };
    };
    update();
    const resize =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (open && motion.current?.playState === "running") update();
          });
    resize?.observe(content);
    media.addEventListener("change", update);
    return () => {
      resize?.disconnect();
      media.removeEventListener("change", update);
    };
  }, [open]);
  useEffect(
    () => () => {
      motion.current?.cancel();
      fade.current?.cancel();
    },
    [],
  );
  return (
    <Collapsible.Content
      forceMount
      ref={outer}
      className={className}
      style={{ height: 0, overflow: "hidden" }}
      inert={!open}
      aria-hidden={!open}
    >
      <div ref={inner} className="disclosure-inner">
        {children}
      </div>
    </Collapsible.Content>
  );
}
