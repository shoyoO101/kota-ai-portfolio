import { createFileRoute, Link } from "@tanstack/react-router";
import { HermesEyebrow, HermesPageShell, HermesSection } from "../components/HermesPageShell";
import { COPY } from "@/lib/site-copy";

export const Route = createFileRoute("/hermes-privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Hermes outreach" },
      {
        name: "description",
        content:
          "Privacy policy for Hermes outreach, a private personal automation agent that uses Google OAuth to access the operator's Gmail account.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Privacy Policy — Hermes outreach" },
      {
        property: "og:description",
        content:
          "How Hermes outreach accesses, stores, and processes Google account data for a single operator-owned Gmail account.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HermesPrivacyPage,
});

function HermesPrivacyPage() {
  return (
    <HermesPageShell>
      <HermesEyebrow>Privacy policy</HermesEyebrow>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Hermes outreach
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 17 October 2026</p>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
        This policy describes how Hermes outreach (“the application”) handles information when it is
        connected to a Google account. The application is operated by Kareem ({COPY.site.brand}) as{" "}
        <strong className="font-medium text-foreground">
          personal tooling for a single operator-owned Gmail account
        </strong>
        . It is not offered as a public multi-user service.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Related overview:{" "}
        <Link
          to="/hermes-outreach"
          className="font-medium text-indigo-accent underline-offset-4 hover:underline"
        >
          Hermes outreach application information
        </Link>
        .
      </p>

      <HermesSection title="1. Who this policy covers">
        <p>
          The Google user who authorizes the application is the operator of the connected mailbox
          (currently the developer). People who receive outreach email are not application users and
          do not sign in with Google.
        </p>
      </HermesSection>

      <HermesSection title="2. Information accessed through Google">
        <p>
          When authorized, the application can use Google OAuth to access the connected Gmail
          account in order to:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Read messages, including to detect replies and related mailbox activity</li>
          <li>Create, read, and update drafts</li>
          <li>Send approved outreach emails from that account</li>
        </ul>
        <p>
          The OAuth consent screen currently also requests access related to Google Drive, Calendar,
          Contacts, Sheets, and Docs. Those additional Google APIs are not all actively used by the
          outreach workflow. Gmail read, send, and modify access is what the current outreach
          workflow relies on.
        </p>
        <p>
          Outreach leads and statuses are kept in Google Sheets. That spreadsheet is accessed
          through a{" "}
          <strong className="font-medium text-foreground">separate Google service account</strong>,
          not through the Gmail OAuth grant described above. Sheet contents typically include
          contact details, outreach status, and related operational notes entered for this workflow.
        </p>
      </HermesSection>

      <HermesSection title="3. Why this information is used">
        <p>
          Google account and spreadsheet data are used only to operate this personal outreach
          workflow, including:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Preparing and sending outreach from the connected mailbox</li>
          <li>Detecting replies so follow-up can stop or change</li>
          <li>Managing drafts before anything is sent</li>
          <li>Tracking leads and statuses in Sheets</li>
          <li>Keeping operational logs so the operator can debug and review runs</li>
        </ul>
        <p>
          The application is not used to sell personal data or to provide a third-party email
          marketing platform.
        </p>
      </HermesSection>

      <HermesSection title="4. Where information is stored">
        <p>Depending on the step in the workflow, information may be stored in:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Gmail (messages, drafts, and sent mail in the connected account)</li>
          <li>Google Sheets (lead records and statuses)</li>
          <li>
            A private virtual private server (VPS) operated by Kareem, including operational logs
            and backups
          </li>
        </ul>
        <p>
          Message content that already lives in Gmail remains in that Google account. Copies or
          excerpts may also exist in logs or backups on the VPS when a run records them for
          operations.
        </p>
      </HermesSection>

      <HermesSection title="5. Third-party processing">
        <p>
          Supporting services are used for specific jobs in the workflow. This policy does not claim
          that every provider receives full Gmail message content. Typical purposes are:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-foreground">OpenRouter</strong> — used to generate
            draft outreach copy with AI models. Prompts and generated text for those drafts may be
            sent to OpenRouter; that is not the same as forwarding the entire mailbox.
          </li>
          <li>
            <strong className="font-medium text-foreground">Emailable</strong> — used to verify
            email addresses, which generally means submitting the address (and related verification
            metadata), not a full Gmail thread.
          </li>
          <li>
            <strong className="font-medium text-foreground">Enrichment providers</strong> — used to
            look up or complete lead information such as a name, company, or role associated with an
            address. They are not described here as receiving complete Gmail contents.
          </li>
          <li>
            <strong className="font-medium text-foreground">InboxWarm</strong> — used for inbox
            warming / deliverability operations for the sending mailbox. Its exact data access
            depends on how that service is connected; this policy does not treat it as a dump of all
            Gmail mail.
          </li>
          <li>
            <strong className="font-medium text-foreground">Telegram</strong> — used for operational
            notifications to the operator (for example run status or alerts). Notifications are not
            described here as a full forward of every Gmail message.
          </li>
        </ul>
        <p>
          Those providers process data under their own terms and infrastructure. Google also
          processes Gmail and Sheets data as the account and API provider.
        </p>
      </HermesSection>

      <HermesSection title="6. Retention">
        <p>
          There is no confirmed automatic deletion schedule for all stored records. Data may remain
          in Gmail, Google Sheets, VPS logs, and backups until the operator deletes it or until the
          relevant system overwrites or removes it in the ordinary course of operations.
        </p>
        <p>
          Revoking Google access (see below) stops new OAuth access; it does not by itself erase
          copies that already exist in Sheets, logs, or backups.
        </p>
      </HermesSection>

      <HermesSection title="7. Security">
        <p>
          The application runs as private personal infrastructure. OAuth tokens and related
          credentials are kept with the operator’s systems and are not published on this website.
          This policy does not claim a specific certification, encryption standard, or independent
          audit.
        </p>
      </HermesSection>

      <HermesSection title="8. User controls">
        <p>Because this is operator-owned tooling, the practical controls are:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Disconnect the application in the Google Account permissions page (Google Account →
            Security → Third-party access) to revoke OAuth access
          </li>
          <li>
            Remove or edit data in the connected Gmail account and in the outreach Google Sheet
          </li>
          <li>
            Contact the operator (below) to ask what is stored in operational logs or backups and to
            request deletion of copies the operator controls
          </li>
        </ul>
        <p>
          Recipients of outreach mail can use ordinary email controls (reply, unsubscribe
          instructions if present in a given message, or contacting the sender). They are not Google
          OAuth users of this application.
        </p>
      </HermesSection>

      <HermesSection title="9. Children">
        <p>The application is not directed at children and is not intended for anyone under 13.</p>
      </HermesSection>

      <HermesSection title="10. Changes">
        <p>
          This page may be updated when the workflow, Google scopes, storage, or supporting services
          change. The “Last updated” date at the top will change when the text is revised.
        </p>
      </HermesSection>

      <HermesSection title="11. Contact">
        <p>
          Privacy questions:{" "}
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
