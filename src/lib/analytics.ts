import { ANALYTICS } from "./analytics-config.ts";
import { COPY } from "./site-copy.ts";

export type DemoSource =
  "hero_cta" | "hero_tile" | "project_card" | "contact_form" | "launcher" | "/verify";
type TalkLocation = "nav" | "hero" | "about" | "faq" | "panel" | "closing_band";
type CountEvent =
  "demo_message_sent" | "reply_email_clicked" | "full_work_clicked" | "contact_form_submitted";
type TrackArgs =
  | [eventName: CountEvent]
  | [eventName: "demo_chat_opened", props: { source: DemoSource }]
  | [eventName: "demo_chip_clicked", props: { label: string }]
  | [eventName: "lets_talk_clicked", props: { location: TalkLocation }];

const allowedProps: Record<string, { key: string; values: readonly string[] } | null> = {
  demo_chat_opened: {
    key: "source",
    values: ["hero_cta", "hero_tile", "project_card", "contact_form", "launcher", "/verify"],
  },
  demo_chip_clicked: {
    key: "label",
    values: COPY.chat.prompts.map((prompt) => prompt.label),
  },
  lets_talk_clicked: {
    key: "location",
    values: ["nav", "hero", "about", "faq", "panel", "closing_band"],
  },
  demo_message_sent: null,
  reply_email_clicked: null,
  full_work_clicked: null,
  contact_form_submitted: null,
};

export function analyticsEnabled(
  production: boolean,
  hostname: string,
  deploymentEnvironment: string | undefined = import.meta.env?.["VERCEL_ENV"],
) {
  return (
    production &&
    import.meta.env?.MODE !== "development" &&
    (!deploymentEnvironment || deploymentEnvironment === "production") &&
    ANALYTICS.domains.some((domain) => domain === hostname)
  );
}

/** Unknown events/values are rejected; extra fields (including form/chat data) are dropped. */
export function eventProperties(name: string, props?: Record<string, unknown>) {
  if (!Object.hasOwn(allowedProps, name)) return null;
  const rule = allowedProps[name];
  if (!rule) return {};
  const value = props?.[rule.key];
  return typeof value === "string" && rule.values.includes(value) ? { [rule.key]: value } : null;
}

function campaignUrl(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  try {
    const url = new URL(value, `https://${ANALYTICS.domain}`);
    const query = new URLSearchParams();
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      for (const item of url.searchParams.getAll(key)) query.append(key, item);
    }
    return `${url.pathname}${query.size ? `?${query}` : ""}`;
  } catch {
    return "";
  }
}

/** Also protect metadata attached automatically by Umami: no arbitrary queries,
 * fragments, referrer paths, or explicit visitor identifiers. Preserve campaign tags. */
export function beforeAnalyticsSend(type: string, payload: Record<string, unknown>) {
  if (type !== "event") return false;
  const { id: _id, data: _data, ...safe } = payload;
  if (payload["name"] !== undefined) {
    if (typeof payload["name"] !== "string") return false;
    const props = eventProperties(
      payload["name"],
      payload["data"] as Record<string, unknown> | undefined,
    );
    if (!props) return false;
    safe["data"] = props;
  }
  safe["url"] = campaignUrl(payload["url"]);
  try {
    safe["referrer"] = payload["referrer"]
      ? new URL(String(payload["referrer"]), `https://${ANALYTICS.domain}`).origin
      : "";
  } catch {
    safe["referrer"] = "";
  }
  return safe;
}

declare global {
  interface Window {
    umami?: { track: (name: string, props?: Record<string, string>) => unknown };
    kotaAnalyticsBeforeSend?: typeof beforeAnalyticsSend;
  }
}

/** Deliberately no queue or storage. A blocked/missing/failing tracker is harmless. */
export function track(...[eventName, props]: TrackArgs) {
  try {
    if (
      typeof window === "undefined" ||
      !analyticsEnabled(import.meta.env?.PROD === true, window.location.hostname)
    )
      return;
    const safe = eventProperties(eventName, props);
    if (!safe || typeof window.umami?.track !== "function") return;
    const result = Object.keys(safe).length
      ? window.umami.track(eventName, safe)
      : window.umami.track(eventName);
    void Promise.resolve(result).catch(() => {});
  } catch {
    // Tracking must never interfere with navigation, chat, or contact delivery.
  }
}
