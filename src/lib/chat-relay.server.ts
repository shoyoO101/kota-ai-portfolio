import "@tanstack/react-start/server-only";

type ChatInput = { message: string; chatInput: string; action: "sendMessage"; sessionId: string };

export async function relayChat(data: ChatInput) {
  const webhook =
    process.env["CHAT_WEBHOOK_URL"]?.trim() ||
    "https://n8n.pinehourai.com/webhook/86f50adb-9df5-45fe-8384-fe622c36154d/chat";
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: data.message,
        chatInput: data.chatInput,
        action: data.action,
        sessionId: data.sessionId,
      }),
      signal: AbortSignal.timeout(30000),
    });
    return { body: await response.text(), ok: response.ok, status: response.status };
  } catch {
    // Do not pass an upstream URL, stack trace or infrastructure error to visitors.
    return { body: "", ok: false, status: 502 };
  }
}
