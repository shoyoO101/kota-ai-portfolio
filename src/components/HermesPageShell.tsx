import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function HermesPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-hairline bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6 sm:px-8">
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            Hermes<span className="text-indigo-accent"> outreach</span>
          </span>
          <span className="font-mono text-xs text-muted-foreground">Kota AI</span>
        </div>
      </header>
      <main>
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 sm:py-20">{children}</div>
      </main>
      <footer className="border-t border-hairline py-8">
        <div className="mx-auto w-full max-w-3xl px-6 sm:px-8">
          <p className="text-center font-mono text-xs text-muted-foreground">
            Personal tooling operated by{" "}
            <Link to="/" className="text-foreground/80 underline-offset-4 hover:underline">
              Kota AI
            </Link>
            . Not listed in the main site navigation.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function HermesEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-indigo-accent">{children}</p>
  );
}

export function HermesSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
