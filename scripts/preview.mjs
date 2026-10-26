import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { serve } from "srvx/node";
import { serveStatic } from "srvx/static";

// The existing Lovable/Nitro build emits a fetch handler in .output, whereas
// Vite's built-in TanStack preview expects dist/server/server.js. Adapt the
// built handler locally without changing the build preset or deployment.
const entry = new URL("../.output/server/index.mjs", import.meta.url);
try {
  await access(entry);
} catch {
  console.error("Build the website first with npm run build.");
  process.exit(1);
}
const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const port = Number(portIndex >= 0 ? args[portIndex + 1] : 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("Provide a valid --port between 1 and 65535.");
  process.exit(1);
}
const { default: handler } = await import(entry.href);
const context = {
  waitUntil: (promise) => promise.catch(console.error),
  passThroughOnException() {},
};
serve({
  hostname: "127.0.0.1",
  port,
  middleware: [serveStatic({ dir: fileURLToPath(new URL("../.output/public/", import.meta.url)) })],
  // Nitro adds Cloudflare request properties, so give it a standard mutable
  // Request rather than srvx's adapter with read-only ip/runtime getters.
  fetch: (request) => handler.fetch(new Request(request._request || request), {}, context),
});
