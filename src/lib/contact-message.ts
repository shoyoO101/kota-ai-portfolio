import { COPY } from "./site-copy.ts";
import { contactSchema } from "./contact-schema.ts";

/** Keep the existing name/email/message backend contract. Extra form fields
 * become readable message details instead of changing the n8n payload. */
export function prepareContactSubmission(values: Record<string, unknown>) {
  const message = String(values["message"] ?? "").trim();
  const company = String(values["company"] ?? "").trim();
  const requestedType = String(values["projectType"] ?? "");
  const projectType =
    COPY.contact.types.find((type) => type === requestedType) ?? COPY.contact.types.at(-1)!;
  const details = [
    company ? `${COPY.contact.metadataLabels.company}: ${company}` : "",
    `${COPY.contact.metadataLabels.projectType}: ${projectType}`,
  ].filter(Boolean);
  return contactSchema.safeParse({
    name: values["name"],
    email: values["email"],
    message: message ? [message, ...details].join("\n\n") : "",
  });
}
