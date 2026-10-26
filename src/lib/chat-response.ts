import { COPY } from "./site-copy.ts";

export const CHAT_COPY = COPY.chat;
export const QUICK_PROMPTS = COPY.chat.prompts;

export function extractReply(data: unknown, depth = 0): string | null {
  if (depth > 5) return null;
  if (typeof data === "string") return data.trim() || null;
  if (Array.isArray(data)) {
    for (const item of data) {
      const reply = extractReply(item, depth + 1);
      if (reply) return reply;
    }
  } else if (data && typeof data === "object") {
    const object = data as Record<string, unknown>;
    for (const key of ["output", "text", "message", "reply", "answer"]) {
      const value = object[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return null;
}

export function interpretChatResponse(response: { ok: boolean; status: number; body: string }) {
  if (response.status === 429) return { text: CHAT_COPY.rateLimit, error: true };
  if (!response.ok) return { text: CHAT_COPY.failure, error: true };
  let parsed: unknown = response.body;
  try {
    parsed = JSON.parse(response.body);
  } catch {
    /* n8n may return plain text */
  }
  // An HTML gateway/error page is not a usable assistant answer.
  const text = /^\s*(<!doctype|<html|<head|<body)/i.test(response.body)
    ? null
    : extractReply(parsed);
  return { text: text ?? CHAT_COPY.failure, error: !text };
}
