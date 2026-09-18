import { createServerFn } from "@tanstack/react-start";

const CHAT_WEBHOOK_URL =
  "https://n8n.trykotaai.com/webhook/1e8b39ac-ee67-43df-9733-408192ecfe2f/chat";

type ChatInput = {
  message: string;
  chatInput: string;
  action: string;
  sessionId: string;
};

/**
 * Server-side relay for the n8n Chat Trigger. The webhook only allows the
 * trykotaai.com origin, so browsers block direct calls from other hosts.
 * Endpoint, method and payload are forwarded unchanged.
 */
export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((data: ChatInput) => data)
  .handler(async ({ data }) => {
    const res = await fetch(CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: data.message,
        chatInput: data.chatInput,
        action: data.action,
        sessionId: data.sessionId,
      }),
    });
    return { body: await res.text(), ok: res.ok };
  });
