import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  analyticsEnabled,
  beforeAnalyticsSend,
  eventProperties,
  track,
} from "../src/lib/analytics.ts";
import { COPY } from "../src/lib/site-copy.ts";
import { ANALYTICS } from "../src/lib/analytics-config.ts";

test("analytics preserves the existing property and supports only the four migration hosts", () => {
  assert.equal(ANALYTICS.domain, "pinehourai.com");
  assert.equal(ANALYTICS.scriptUrl, "https://cloud.umami.is/script.js");
  assert.equal(ANALYTICS.websiteId, "c6bd0ec2-8eb9-48fc-9d83-0c790acd4bc6");
  for (const host of [
    "pinehourai.com",
    "www.pinehourai.com",
    "trykotaai.com",
    "www.trykotaai.com",
  ]) {
    assert.equal(analyticsEnabled(true, host), true);
    assert.equal(analyticsEnabled(true, host, "production"), true);
    assert.equal(analyticsEnabled(false, host), false);
  }
  for (const host of [
    "localhost",
    "127.0.0.1",
    "::1",
    "preview.vercel.app",
    "pinehourai-git-portfolio-redesign.vercel.app",
    "hellokotaai.com",
    "n8n.pinehourai.com",
    "staging.pinehourai.com",
    "pinehourai.com.evil.example",
    "evilpinehourai.com",
    "www.www.trykotaai.com",
  ]) {
    assert.equal(analyticsEnabled(true, host), false);
  }
  assert.doesNotThrow(() => track("demo_message_sent")); // SSR / no browser.
});

test("Preview, development and other nonproduction deployments cannot track even on approved hosts", () => {
  for (const host of ANALYTICS.domains) {
    for (const environment of ["preview", "development", "staging"]) {
      assert.equal(analyticsEnabled(true, host, environment), false);
    }
  }
});

test("only approved event properties survive; counts never include visitor input", () => {
  const privateFields = {
    name: "Private name",
    email: "private@example.com",
    message: "Private text",
    sessionId: "private-id",
  };
  assert.deepEqual(eventProperties("demo_message_sent", privateFields), {});
  assert.deepEqual(eventProperties("contact_form_submitted", privateFields), {});
  assert.deepEqual(eventProperties("demo_chat_opened", { source: "hero_tile", ...privateFields }), {
    source: "hero_tile",
  });
  assert.deepEqual(eventProperties("demo_chat_opened", { source: "hero_cta", ...privateFields }), {
    source: "hero_cta",
  });
  assert.deepEqual(eventProperties("lets_talk_clicked", { location: "panel", ...privateFields }), {
    location: "panel",
  });
  for (const prompt of COPY.chat.prompts) {
    assert.deepEqual(
      eventProperties("demo_chip_clicked", { label: prompt.label, ...privateFields }),
      { label: prompt.label },
    );
  }
  assert.equal(eventProperties("demo_chip_clicked", { label: "Private typed text" }), null);
  assert.equal(eventProperties("lets_talk_clicked", { location: "private@example.com" }), null);
  assert.equal(eventProperties("unknown", privateFields), null);
  assert.equal(eventProperties("__proto__"), null);
});

test("pageview and event metadata preserve campaigns while removing private URL details and identifiers", () => {
  const payload = {
    website: "public-id",
    url: "https://pinehourai.com/verify?utm_campaign=store%20demo&utm_source=email&email=private%40example.com&message=secret#private",
    referrer: "https://example.com/private?name=someone",
    id: "must-not-send",
    data: { email: "private@example.com" },
  };
  assert.deepEqual(beforeAnalyticsSend("event", payload), {
    website: "public-id",
    url: "/verify?utm_source=email&utm_campaign=store+demo",
    referrer: "https://example.com",
  });
  assert.deepEqual(beforeAnalyticsSend("event", { ...payload, name: "demo_message_sent" }), {
    website: "public-id",
    url: "/verify?utm_source=email&utm_campaign=store+demo",
    referrer: "https://example.com",
    name: "demo_message_sent",
    data: {},
  });
  assert.equal(beforeAnalyticsSend("identify", payload), false);
  assert.equal(
    beforeAnalyticsSend("event", { ...payload, name: "arbitrary-private-event" }),
    false,
  );
  assert.equal(
    beforeAnalyticsSend("event", { name: "demo_chat_opened", data: { source: "secret" } }),
    false,
  );
});

test("both outreach host redirects leave the query string for Vercel to pass through", () => {
  // Vercel forwards incoming query parameters unless destination replaces them:
  // https://vercel.com/docs/routing/redirects#query-parameters
  const { redirects } = JSON.parse(
    readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  for (const host of ["hellokotaai.com", "www.hellokotaai.com"]) {
    const rule = redirects.find((entry: { has: { type: string; value: string }[] }) =>
      entry.has.some((condition) => condition.type === "host" && condition.value === host),
    );
    assert.ok(rule);
    assert.equal(rule.source, "/(.*)");
    assert.equal(rule.destination, "https://trykotaai.com/verify");
    assert.equal(new URL(rule.destination).search, "");
  }
});
