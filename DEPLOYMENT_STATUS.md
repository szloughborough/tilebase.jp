# Deployment status — 2026-10-09

- GitHub: https://github.com/szloughborough/tilebase.jp (main).
- Cloudflare Pages: tilebase, selected Szloughborough account; https://tilebase.pages.dev.
- Legal name: Shenzhen Lafubao Trading Co,.Ltd.
- 42 HTML pages including 404; 11 Japanese articles, 159 catalog designs, 344 images.
- D1: tilebase-inquiries, binding DB; migration 0001_inquiries.sql applied remotely. inquiries and inquiry_limits tables verified; zero inquiry records at verification.
- Site remains preview: noindex, robots Disallow /, no actual visitor submissions.
- DNS lookup for tilebase.jp returned name does not exist on 2026-10-09. This is DNS evidence, not proof of registration availability.

Remaining production requirements: domain ownership and DNS, working sale@tilebase.jp mailbox, verified sender/email service, Turnstile, runtime secrets, notification retry schedule, privacy and data-retention decisions, asset rights, commercial terms and product-report applicability. Real mail receipt and search indexing are not verified. Do not set readiness flags automatically.

Current editable deployment checkout is in the temporary tilebase-sync-20261008 directory because the original H: files have Windows ACL write restrictions. GitHub contains the authoritative published source; clone it into a normal writable directory for long-term work. Current synchronization is manual, not an automatic GitHub-to-Pages build integration.
