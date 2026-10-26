import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { submitContact } from "@/lib/contact.functions";
import type { ContactInput } from "@/lib/contact-schema";
import { prepareContactSubmission } from "@/lib/contact-message";
import { COPY } from "@/lib/site-copy";
import { track } from "@/lib/analytics";
import { DemoLink } from "./DemoLink";

export function Contact() {
  return (
    <section id="contact" className="section-space contact-section" tabIndex={-1}>
      <div className="site-container contact-grid">
        <div className="contact-copy">
          <span className="section-eyebrow">{COPY.contact.eyebrow}</span>
          <h2 id="contact-heading" tabIndex={-1}>
            {COPY.contact.heading}
          </h2>
          <p>{COPY.contact.body}</p>
          <div className="contact-direct">
            <span>{COPY.contact.emailLabel}</span>
            <a href={`mailto:${COPY.site.email}`}>
              {COPY.site.email}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <p className="contact-reply">{COPY.contact.reply}</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
function ContactForm() {
  const send = useServerFn(submitContact);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const pending = useRef(false);
  if (submitted)
    return (
      <div className="contact-success" role="status">
        <span className="success-icon">
          <Check size={27} aria-hidden="true" />
        </span>
        <h3>{COPY.contact.successHeading}</h3>
        <p>{COPY.contact.success}</p>
        <DemoLink className="button button-outline contact-demo-mobile" source="contact_form" />
      </div>
    );
  return (
    <form
      className="contact-form"
      noValidate
      aria-busy={sending}
      onSubmit={async (event) => {
        event.preventDefault();
        if (pending.current) return;
        const form = event.currentTarget;
        const parsed = prepareContactSubmission(Object.fromEntries(new FormData(form)));
        setError(null);
        if (!parsed.success) {
          const next: Partial<Record<keyof ContactInput, string>> = {};
          for (const issue of parsed.error.issues) {
            const field = issue.path[0] as keyof ContactInput;
            next[field] ??= issue.message;
          }
          setErrors(next);
          (form.elements.namedItem(Object.keys(next)[0] ?? "name") as HTMLElement | null)?.focus();
          return;
        }
        setErrors({});
        pending.current = true;
        setSending(true);
        try {
          const result = await send({ data: parsed.data });
          if (!result.ok) throw new Error("Contact delivery failed");
          track("contact_form_submitted");
          setSubmitted(true);
        } catch {
          setError(COPY.contact.error);
        } finally {
          pending.current = false;
          setSending(false);
        }
      }}
    >
      <div className="contact-fields">
        {(
          [
            ["name", COPY.contact.name, COPY.contact.namePlaceholder, 120],
            ["email", COPY.contact.email, COPY.contact.emailPlaceholder, 200],
          ] as const
        ).map(([name, label, placeholder, limit]) => (
          <div className="form-field" key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              name={name}
              type={name === "email" ? "email" : "text"}
              autoComplete={name}
              placeholder={placeholder}
              maxLength={limit}
              required
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
              disabled={sending}
            />
            {errors[name] && (
              <p className="field-error" id={`${name}-error`}>
                {errors[name]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="contact-fields">
        <div className="form-field">
          <label htmlFor="company">
            {COPY.contact.company} <span className="optional-label">({COPY.contact.optional})</span>
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            maxLength={160}
            placeholder={COPY.contact.companyPlaceholder}
            disabled={sending}
          />
        </div>
        <div className="form-field">
          <label htmlFor="projectType">{COPY.contact.projectType}</label>
          <div className="select-wrap">
            <select
              id="projectType"
              name="projectType"
              defaultValue={COPY.contact.types.at(-1)}
              disabled={sending}
            >
              {COPY.contact.types.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="message">{COPY.contact.message}</label>
        <textarea
          id="message"
          name="message"
          placeholder={COPY.contact.messagePlaceholder}
          rows={5}
          maxLength={5000}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          disabled={sending}
        />
        {errors.message && (
          <p id="message-error" className="field-error">
            {errors.message}
          </p>
        )}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="button button-primary" disabled={sending}>
        {sending ? COPY.contact.sending : COPY.contact.send}
        <ArrowRight size={17} aria-hidden="true" />
      </button>
      <p className="form-helper">{COPY.contact.helper}</p>
      <DemoLink className="button button-outline contact-demo-mobile" source="contact_form" />
    </form>
  );
}
