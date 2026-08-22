import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const webhookUrl = process.env["N8N_CONTACT_WEBHOOK_URL"];
    if (!webhookUrl) {
      throw new Error("Contact webhook is not configured.");
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        to: "kareem@hellokotaai.com",
        source: "trykotaai.com/contact",
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error(`Webhook responded with ${res.status}`);
    }

    return { ok: true as const };
  });
