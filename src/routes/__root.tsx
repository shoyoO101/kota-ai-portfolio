import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: "Kota AI — custom autonomous workflows and AI systems built by an AI Systems Architect. Request a free video audit of your manual bottleneck." },
      { name: "author", content: "Kota AI" },
      { property: "og:title", content: "Kota AI — Autonomous AI Systems & Workflow Automation" },
      { property: "og:description", content: "Custom autonomous workflows and AI systems that run quietly in the background. Get a free video audit of your manual bottleneck." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kota AI — Autonomous AI Systems & Workflow Automation" },
      { name: "twitter:description", content: "Custom autonomous workflows and AI systems that run quietly in the background." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Load n8n chat widget styles
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    document.head.appendChild(cssLink);

    // Premium dark theme for the n8n chat widget. The widget is themed via
    // `--chat--*` CSS custom properties (see @n8n/chat docs). We pass the same
    // values through the `theme` option AND inject them as a scoped <style>
    // tag so they reliably take effect in the current runtime build.
    const themeVars: Record<string, string> = {
      "--chat--border-radius": "16px",
      "--chat--window--border-radius": "16px",
      "--chat--message--border-radius": "16px",
      "--chat--window--border": "1px solid #2a2a2a",
      // Body / footer — dark gray to match the site
      "--chat--body--background": "#1a1a1a",
      "--chat--footer--background": "#1a1a1a",
      "--chat--footer--color": "#9a9a9a",
      // Header — accent blue with white text
      "--chat--header--background": "#4f7df3",
      "--chat--header--color": "#ffffff",
      // Chat bubbles
      "--chat--message--bot--background": "#2a2a2a",
      "--chat--message--bot--color": "#f0f0f0",
      "--chat--message--user--background": "#4f7df3",
      "--chat--message--user--color": "#ffffff",
      // Input box — dark with accent focus border
      "--chat--input--background": "#1a1a1a",
      "--chat--input--text-color": "#f0f0f0",
      "--chat--input--container--background": "#1a1a1a",
      "--chat--input--container--border": "1px solid #2a2a2a",
      "--chat--input--container--border-radius": "16px",
      "--chat--input--send--button--background": "transparent",
      "--chat--input--send--button--color": "#4f7df3",
      "--chat--input--send--button--background-hover":
        "rgba(79, 125, 243, 0.12)",
      "--chat--input--send--button--color-hover": "#4f7df3",
      // Floating trigger button — accent blue, rounded
      "--chat--toggle--background": "#4f7df3",
      "--chat--toggle--hover--background": "#4f7df3",
      "--chat--toggle--active--background": "#4f7df3",
      "--chat--toggle--color": "#ffffff",
      "--chat--toggle--border-radius": "50%",
    };

    const themeCss =
      `.n8n-chat {\n` +
      Object.entries(themeVars)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join("\n") +
      `\n}\n` +
      `.n8n-chat .chat-inputs:focus-within { border-color: #4f7df3 !important; }\n` +
      `.n8n-chat .chat-inputs textarea::placeholder { color: #8a8a8a; }\n`;

    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-n8n-chat-theme", "kota");
    styleEl.textContent = themeCss;
    document.head.appendChild(styleEl);

    // Load n8n chat widget script and initialize
    let cancelled = false;
    import("https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js")
      .then(({ createChat }) => {
        if (cancelled || typeof createChat !== "function") return;
        createChat({
          webhookUrl:
            "https://n8n.trykotaai.com/webhook/1e8b39ac-ee67-43df-9733-408192ecfe2f/chat",
          initialMessages: [
            "👋 Hi there! I'm a live AI demo trained on Sewell.com's e-commerce catalog. Ask me about their shipping times, return policies, or product recommendations to see how this works!",
          ],
          i18n: {
            en: {
              title: "Kota AI | E-Commerce Demo",
              subtitle: "Ask me anything about products, shipping, or returns.",
              inputPlaceholder: "Type your question...",
            },
          },
          theme: themeVars,
        });
      })
      .catch((err) => {
        console.error("Failed to load n8n chat widget", err);
      });

    return () => {
      cancelled = true;
      styleEl.remove();
      cssLink.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
