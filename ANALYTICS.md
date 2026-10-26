# Privacy-friendly analytics

Umami is configured in `src/lib/analytics-config.ts` with primary domain `pinehourai.com`. The existing public script URL (`https://cloud.umami.is/script.js`) and website ID (`c6bd0ec2-8eb9-48fc-9d83-0c790acd4bc6`) are unchanged. No new property, dependency, or environment secret is needed.

`Analytics.tsx` appends one async/defer script only for a production build on one of four exact hostnames: `pinehourai.com`, `www.pinehourai.com`, `trykotaai.com`, or `www.trykotaai.com`. The same comma-separated list is passed through `data-domains`. Development mode, localhost/loopback hosts, Vercel Preview domains, and unlisted subdomains do not load the tracker. The same gate applies to custom events.

`vite.config.ts` exposes only the public `VERCEL_ENV` deployment label to the analytics gate. A Vercel `preview` or `development` build cannot track even when served on an approved custom hostname. Check that Vercel's system environment variables are available at build time. Local production builds without that label still use the exact-hostname gate; the localhost preview remains excluded.

The `track(eventName, props?)` helper in `src/lib/analytics.ts` safely ignores an absent tracker, synchronous exceptions, and rejected tracking promises. It does not queue or persist events. Umami's automatic pageviews and SPA navigation tracking remain enabled; hash-only navigation is excluded.

## Event schema

| Event                    | Allowed properties                                                                       | Trigger                                                                                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `demo_chat_opened`       | `source`: `hero_cta`, `hero_tile`, `project_card`, `contact_form`, `launcher`, `/verify` | Floating panel transitions to open, including the mobile contact demo action, or the docked demo is shown on `/verify` after the tracker loads                                   |
| `demo_chip_clicked`      | `label`: one of the four predefined labels in the content file                           | Quick-reply button click                                                                                                                                                         |
| `demo_message_sent`      | None                                                                                     | A nonblank message is accepted by the shared request flow, including chip messages; concurrent sends are rejected before counting                                                |
| `lets_talk_clicked`      | `location`: `nav`, `hero`, `about`, `faq`, `panel`                                       | Corresponding visible CTA click; includes mobile navigation and both chat layouts. The retained `closing_band` handler is in an unmounted component and does not currently fire. |
| `reply_email_clicked`    | None                                                                                     | `/verify` reply button                                                                                                                                                           |
| `full_work_clicked`      | None                                                                                     | `/verify` full-work button                                                                                                                                                       |
| `contact_form_submitted` | None                                                                                     | Existing contact backend returns success; validation failures and delivery failures do not count                                                                                 |

Event properties are allowlisted at runtime as well as typed. No messages, contact names, email addresses, company details, chat session IDs, or visitor identifiers are passed to analytics. Chip labels are static UI copy, never user-entered text.

The before-send hook also removes explicit identifiers, fragments, arbitrary URL query parameters, and referrer paths/queries from tracker payloads. Standard campaign tags (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) are preserved. Keep campaign values non-personal. The integration does not use `identify`, cookies, or browser storage. The existing non-identifying chat-hint preference remains separate from analytics.

## Outreach redirects

Both host rules in `vercel.json` target `https://trykotaai.com/verify` without replacing the query string. Vercel forwards incoming query parameters automatically: <https://vercel.com/docs/routing/redirects>.

Read-only live header checks on 19 October 2026 confirmed that `?utm_campaign=analytics-redirect-check&utm_source=qa` survives both the apex-to-www redirect and the www-to-`/verify` redirect. No redirect configuration changes or deployment were needed.

## Verification

Run the normal build, TypeScript check, and `npm test`. The analytics unit tests cover production-domain gating, property allowlists, URL privacy, and redirect configuration.

`scripts/verify-analytics.mjs` runs browser checks against a local production build served under an intercepted production origin. It uses a local copy of the official tracker, intercepts all Umami requests, and mocks all chat/contact submissions. Set `PLAYWRIGHT_MODULE` to an existing Playwright module URL, `UMAMI_AUDIT_SCRIPT` to the local official script copy, and optionally `QA_BASE_URL` and `QA_OUTPUT_DIR`, then run `node --experimental-strip-types scripts/verify-analytics.mjs`. The script does not install tooling or submit test analytics records.

For a development server or a build created with `VERCEL_ENV=preview`, set `QA_EXPECT_ANALYTICS_DISABLED=1` to exercise all four approved custom hostnames and confirm that no script or events are emitted even when chat works. Use a fresh local server for each build so cached server modules do not affect the check.

Local preview intentionally shows no analytics activity. Once an approved deployment is live, inspect the Umami dashboard for real production activity and events. No code deployment has been performed as part of this change.
