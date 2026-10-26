import { createFileRoute, Link } from "@tanstack/react-router";
import { HermesEyebrow, HermesPageShell, HermesSection } from "../components/HermesPageShell";
import { COPY } from "@/lib/site-copy";

export const Route = createFileRoute("/hermes-outreach")({
  head: () => ({
    meta: [
      { title: "Hermes outreach — Application information" },
      {
        name: "description",
        content:
          "Hermes outreach is a private automation agent used by Kareem to manage personal cold-email outreach with Google OAuth access to a single Gmail account.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Hermes outreach — Application information" },
      {
        property: "og:description",
        content: "Private personal outreach automation. Not a public multi-user service.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HermesOutreachPage,
});

function HermesOutreachPage() {
  return (
    <HermesPageShell>
      <HermesEyebrow>Application information</HermesEyebrow>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Hermes outreach
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
        Hermes outreach is a private automation agent I operate for my own cold-email outreach. It
        is not a public product, marketplace app, or multi-user service. Google OAuth is used so the
        agent can work with{" "}
        <strong className="font-medium text-foreground">my own Gmail account</strong>.
      </p>

      <HermesSection title="What the application does">
        <p>
          The workflow helps me run outbound email from a single operator-owned mailbox. In practice
          that means:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Reading mailbox activity to see whether someone has replied</li>
          <li>Creating and updating draft outreach emails for review</li>
          <li>Sending outreach emails after they have been approved</li>
          <li>
            Keeping lead records and outreach status in Google Sheets, accessed through a separate
            Google service account rather than through the OAuth login used for Gmail
          </li>
        </ul>
      </HermesSection>

      <HermesSection title="Who it is for">
        <p>
          The application is currently limited to my own account. Recipients of outreach email are
          not asked to sign in, and there is no self-service signup for other Google users.
        </p>
      </HermesSection>

      <HermesSection title="Google access">
        <p>
          Google OAuth is requested so Hermes can read messages, manage drafts, and send mail from
          the connected Gmail account. The OAuth consent screen may also list Google Drive,
          Calendar, Contacts, Sheets, and Docs. Those additional permissions are not all used by the
          current outreach workflow.
        </p>
        <p>
          Lead tracking in Sheets uses a service account configured for that spreadsheet, which is
          separate from the Gmail OAuth grant.
        </p>
      </HermesSection>

      <HermesSection title="Privacy">
        <p>
          How mailbox, spreadsheet, and operational data are used, stored, and shared with
          supporting services is described in the privacy policy.
        </p>
        <p>
          <Link
            to="/hermes-privacy"
            className="font-medium text-indigo-accent underline-offset-4 hover:underline"
          >
            Read the Hermes outreach privacy policy
          </Link>
        </p>
      </HermesSection>

      <HermesSection title="Contact">
        <p>
          Questions about this application:{" "}
          <a
            href={`mailto:${COPY.site.email}`}
            className="font-medium text-indigo-accent underline-offset-4 hover:underline"
          >
            {COPY.site.email}
          </a>
        </p>
      </HermesSection>
    </HermesPageShell>
  );
}
