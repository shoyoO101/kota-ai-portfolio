import { z } from "zod";
import { COPY } from "./site-copy.ts";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, COPY.contact.validation.name)
    .max(120, COPY.contact.validation.nameMax),
  email: z
    .string()
    .trim()
    .email(COPY.contact.validation.email)
    .max(200, COPY.contact.validation.emailMax),
  message: z
    .string()
    .trim()
    .min(1, COPY.contact.validation.message)
    .max(5000, COPY.contact.validation.messageMax),
});

export type ContactInput = z.infer<typeof contactSchema>;
