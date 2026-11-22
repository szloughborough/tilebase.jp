# Deployment status — 2026-11-22

The release enables actual inquiry reception on https://tilebase.jp. GitHub main is the source; Cloudflare Pages publication is manual via Wrangler.

## Verified

- Official domain HTTPS and Cloudflare custom-domain status active.
- Consent-based GA4 on the official host; preview-host analytics excluded. GA4 automatic form interactions disabled so draft or validation actions are not treated as accepted leads.
- A protected real Turnstile form submission returned an inquiry reference, persisted to D1, and generated a notification. Resend reported delivered to the authorized operator mailbox. Private test evidence is intentionally not in this repository.
- D1 saves before acknowledging success; notification failure does not discard the inquiry. Source origin, exact Turnstile hostname/action/success, payload size, rate limits and duplicate submission IDs are checked.
- Form records are retained for 30 days. Existing hourly retention Worker schedule was verified. Notification emails contain a reference only; customer data stays in D1.
- Temporary verification page, access gate and temporary credential are removed after acceptance.

## Operational limits

- A provider delivered receipt proves acceptance by the recipient mail server, not that the operator read the message or that it avoided the spam folder.
- The synthetic verification inquiry is not a customer lead. It is marked TEST and follows normal 30-day retention.
- No CRM interface is included. Review inquiries through the authenticated Cloudflare D1 console; follow up before expiry.
- The protected retry endpoint exists, but no automatic notification retry scheduler is configured. Check D1 for pending/failed notices when operating the site; mail-service outages do not remove saved inquiries.
- Product-specific performance reports, final quotes, shipping dates and commercial terms remain subject to SKU-specific verification and agreement.

## Releasing

Use the supported Node runtime, install dependencies, then `npm run build:production`. Supply the public Turnstile site key through the ignored production environment file or the build environment. Runtime secrets remain in Cloudflare. Run tests, Astro check, static audit and launch check before `wrangler pages deploy dist --project-name tilebase --branch main`. Do not reset readiness flags merely to make a failing deployment pass; record new evidence.
