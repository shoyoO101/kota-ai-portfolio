import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const chatInput = z.object({
  message: z.string().trim().min(1).max(5000),
  chatInput: z.string().trim().min(1).max(5000),
  action: z.literal("sendMessage"),
  sessionId: z.string().min(1).max(200),
});

/** Keep the n8n destination and HTTP transport exclusively in the server handler. */
export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => chatInput.parse(data))
  .handler(async ({ data }) => {
    const { relayChat } = await import("./chat-relay.server");
    return relayChat(data);
  });
