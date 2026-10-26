import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { COPY } from "@/lib/site-copy";
import { track } from "@/lib/analytics";
import { BrandMark } from "./BrandMark";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label={COPY.system.brandHome}>
      <BrandMark className="brand-mark" />
      <span className="brand-wordmark">
        <span>{COPY.site.wordmark}</span> <span>{COPY.site.wordmarkSuffix}</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const destination = useRef<string | null>(null);
  useEffect(() => {
    if (!sentinel.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting));
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div ref={sentinel} className="header-sentinel" aria-hidden="true" />
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="site-container header-inner">
          <Brand />
          <nav aria-label={COPY.nav.label} className="desktop-nav">
            {COPY.nav.links.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="button button-primary header-contact"
            onClick={() => track("lets_talk_clicked", { location: "nav" })}
          >
            {COPY.site.talk}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="menu-toggle" aria-label={COPY.nav.open}>
                <Menu size={22} aria-hidden="true" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="menu-overlay" />
              <Dialog.Content
                className="mobile-menu"
                onCloseAutoFocus={(event) => {
                  if (destination.current) {
                    event.preventDefault();
                    const id = destination.current;
                    destination.current = null;
                    requestAnimationFrame(() =>
                      document.querySelector<HTMLElement>(id)?.focus({ preventScroll: true }),
                    );
                  }
                }}
              >
                <div className="mobile-menu-title">
                  <Dialog.Title>{COPY.site.brand}</Dialog.Title>
                  <Dialog.Close asChild>
                    <button type="button" className="icon-button" aria-label={COPY.nav.close}>
                      <X size={22} />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">{COPY.nav.description}</Dialog.Description>
                <nav aria-label={COPY.nav.mobileLabel}>
                  {[...COPY.nav.links, [COPY.site.talk, "#contact"]].map(([label, href]) => (
                    <Dialog.Close key={href} asChild>
                      <a
                        href={href}
                        onClick={() => {
                          destination.current = href ?? null;
                          if (href === "#contact") track("lets_talk_clicked", { location: "nav" });
                        }}
                      >
                        {label}
                        <ArrowRight size={17} aria-hidden="true" />
                      </a>
                    </Dialog.Close>
                  ))}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
