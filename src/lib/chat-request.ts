import { CHAT_COPY, interpretChatResponse } from "./chat-response.ts";
import { track } from "./analytics.ts";
import {
  CHAT_SESSION_KEY,
  beginChatMessage,
  finishChatMessage,
  getSessionId,
} from "./chat-session.ts";

export const CHAT_TIMEOUT_MS = 30_000;
export const CHAT_STILL_WORKING_MS = 6_000;
type ChatRequest = { message: string; chatInput: string; action: "sendMessage"; sessionId: string };
type ChatResponse = { ok: boolean; status: number; body: string };

/** Own the deadline outside any mounted panel. Only the winning result can finish
 * a request; a late upstream reply cannot overwrite a timeout or a newer send. */
export async function runChatRequest(
  raw: string,
  transport: (data: ChatRequest, signal: AbortSignal) => Promise<ChatResponse>,
  key = CHAT_SESSION_KEY,
) {
  const message = raw.trim();
  if (!message || !beginChatMessage(message, key)) return false;
  track("demo_message_sent");
  const controller = new AbortController();
  const deadlineAt = Date.now() + CHAT_TIMEOUT_MS;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error("Chat request timed out"));
        controller.abort();
      }, CHAT_TIMEOUT_MS);
    });
    const request = Promise.resolve().then(() =>
      transport(
        { message, chatInput: message, action: "sendMessage", sessionId: getSessionId(key) },
        controller.signal,
      ),
    );
    const response = await Promise.race([request, deadline]);
    // Background tabs can throttle timers; elapsed time still governs success.
    if (Date.now() >= deadlineAt) {
      controller.abort();
      throw new Error("Chat reply arrived after its deadline");
    }
    const reply = interpretChatResponse(response);
    finishChatMessage(reply.text, reply.error, key);
  } catch {
    finishChatMessage(CHAT_COPY.failure, true, key);
  } finally {
    clearTimeout(timer);
  }
  return true;
}
