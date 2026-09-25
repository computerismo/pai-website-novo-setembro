# Codex implementation guide — Website 2.0 for local businesses

## Mission

Turn the existing dental website project into a repeatable product that the founder can configure and deploy for local businesses. Each business must receive its **own project and deployment**, with its own database, media storage, domain, environment variables, admin users, Google Analytics/Search Console connection, and email settings. Maintain a canonical codebase/template where practical, but do not build a shared multi-tenant SaaS for the first release.

The customer-facing offer should connect:

1. A responsive public website and clear contact calls to action.
2. A protected admin panel with a simple Kanban for incoming leads.
3. GA4 and Search Console reporting explained in plain language.
4. Practical SEO setup and recommendations for a non-expert owner.
5. Reliable email notifications for new leads through Resend.
6. A repeatable, documented way to provision each customer's separate project.

## Work boundaries

- Work from the checked-out repository, not this document alone. The review baseline is private repository `computerismo/pai-website-novo-setembro`, `main` at commit `e73be6e45804ca0d664acc8f1acc0d9332687a8a`. Verify the actual checkout and all findings before editing.
- Read all `AGENTS.md` instructions, inspect branch/SHA/working tree, and preserve user changes.
- Implement locally in small, reviewable phases on a feature branch. Do not push, merge, deploy, change production secrets/settings/DNS/data, send real email, or run scripts against a production database.
- Do not print environment values, passwords, hashes, tokens, Google credentials, lead content, or personal data. Never include real customer information in tests or sample config.
- Do not run admin bootstrap, content migration, or database-writing scripts until their effects and target database are confirmed; use local disposable test configuration only.
- Do not add tenant IDs, a shared customer database, cross-customer dashboards, self-serve billing, or a control plane for this first product version.
- Treat the existing dental website as the first vertical unless the owner says otherwise. Preserve its real content; do not invent information for any other business.
- If a decision cannot be made safely from the brief, document the options and stop only the dependent work. Record other assumptions and continue independent work.
- Make a local plan, work through the phases in order, run meaningful checks, and report exactly what changed and what remains unverified.

## Verified baseline and investigation leads

The repository was reviewed statically at the SHA above. Recheck the current checkout, since it may have changed.

- `dental-website/` is a Next.js App Router site with public pages, blog/CMS, admin screens, lead management, Prisma/PostgreSQL, and NextAuth. `backend/` is FastAPI for GA4, Search Console, and geocoding.
- `dental-website/prisma/schema.prisma` is a single-business schema. `Lead` is dental-shaped (including a required treatment field); user roles default to `admin`. Site/profile values and public content include hard-coded dental details.
- The FastAPI configuration is for a single Google Analytics property and Search Console property per process. The browser calls the analytics service directly, and the reviewed service routes have no authentication. Separate customer deployments must not share one customer's credentials/data.
- Admin page access is based on sign-in in middleware, not a complete role policy at each server boundary. Several lead actions and exports have missing or incomplete role checks. Some post APIs use session presence instead of the intended role.
- Uploads appeared publicly callable, without adequate size/content checks, and the public upload route can serve SVG. Blog post HTML is stored/rendered without a maintained allowlist sanitizer. Public post reads need to filter drafts and remove private author fields.
- The public lead form gathers contact details, treatment/message, attribution, IP, and user-agent information. The API accepts `acceptTerms: false`, logs personal values, and uses in-memory rate limiting. Review data minimization and consent behavior before using real customer leads.
- Bootstrap scripts appeared to contain hard-coded/default credentials or password-reset behavior. Authentication logs included a password hash on a failed login.
- There is already an admin SEO subsystem: overview, keyword/query, content/page, and sitemap-status screens. Do not rebuild it from scratch.
- Post SEO fields exist in the editor/database, but public article metadata ignores them. About/Contact pages appear to lack page-specific metadata. `robots.ts` advertises `/sitemap.xml`, but no sitemap generator or public sitemap file was present in the reviewed tree. Site configuration has placeholder/example fallback values.
- SEO date filters offer ranges the overview API rejects. The GSC date helper excludes recent days, but the UI does not clearly explain freshness. A missing GSC integration can appear as zero data, and the sitemap table can summarize warnings that it does not display. Search Analytics query results are top/reported rows, not a complete keyword inventory.
- `dental-website/package.json` has a placeholder test command that fails. The repository's GitHub Pages workflows expect a static `out` artifact, while the full Next.js app uses runtime auth, server actions, and Prisma. A production host for the Next.js app is not established by the reviewed repo.
- No Resend integration or email-delivery worker/outbox was present in the reviewed tree.

## Phase 0 — inspect and establish decisions

1. Read repository instructions, package scripts, Python dependency files, Prisma migrations, deployment config, and current CI.
2. Search all role-protected pages/actions/routes/exports, database query paths, uploads, rich HTML sinks, public post endpoints, lead intake, analytics clients/routes, and SEO screens. Build a brief inventory before editing.
3. Record the actual deployment target for the Next.js app. It must support a Next.js server and PostgreSQL access. Do not configure static export for the full app. If hosting is absent or unclear, prepare a short hosting decision note and do not deploy.
4. Record operational decisions that affect customer setup: first pilot vertical (default: current dental site), domain ownership, Google property ownership/authorization, admin roles, storage persistence, email sender-domain verification, backups/restore, and how data is exported/deleted if service ends.
5. Use a validated deployment configuration for customer-specific values. Never rely on placeholder identity, sample social handles, or another client's data as defaults.

**Acceptance:** report the current SHA and working-tree state, the actual commands and prerequisites, the app's runtime/deployment needs, and any decision that blocks only a specific phase.

## Phase 1 — security, privacy, and validation baseline

Complete this phase before email notifications or real customer data. Fix systemic patterns, not only the named examples.

### 1.1 Authorization

- Define and document a small role matrix. Suggested baseline: `admin` manages users, leads, exports, analytics and settings; `editor` manages permitted content/media only; `viewer` has only the read access explicitly approved by the owner; anonymous users can submit public forms but cannot read admin data.
- Add a shared server-side authorization helper if it fits the codebase. Use it inside every protected server action, API handler, data loader and export. Middleware may improve navigation, but is not the authorization boundary.
- Protect admin pages that read leads/analytics, lead status/note/assignment/delete actions, lead counts/history/CSV exports, post create/edit/publish/delete routes, upload routes, and analytics routes.
- Keep user-management APIs admin-only. Replace the schema's admin role default with least privilege using a migration/backfill plan; do not apply migrations to production.
- Return correct 401/403 responses without exposing whether a private record exists or leaking data in errors.

### 1.2 Analytics and backend access

- Protect every GA4, GSC, and geocoding endpoint with authenticated server-side access. Prefer an authenticated Next.js server route/proxy or a server-to-server credential that is not shipped to the browser.
- Restrict CORS to the relevant customer deployment as defense in depth; do not treat CORS as authentication.
- Bound dates, result counts, geocoding batch sizes, and request rates. Add external-call timeouts and generic client errors.
- Keep Google credentials and service URLs server-only. One client's Google data must stay within that customer's separate project/deployment.

### 1.3 Uploads, posts, and public data

- Require appropriate editor/admin access to upload; enforce file-size limits, allowlisted image formats, content/signature verification, and server-generated file names. Exclude SVG unless there is a deliberate safe sanitization/rasterization process.
- Verify the storage is persistent across redeployments before relying on local disk. Do not change storage provider without recording the chosen approach.
- Sanitize rich-text HTML with a maintained allowlist sanitizer before any HTML sink. Preserve required safe formatting; reject scripts, event handlers, unsafe URL schemes, and unsafe styles.
- Make public post-by-ID/list routes return only published content and only public fields. Do not return author emails. Protect drafts and CMS actions with the role policy.

### 1.4 Lead data and privacy

- Enforce the chosen consent behavior at the server boundary. If consent is required, reject false/missing consent and record the policy version/timestamp needed by the product's chosen process.
- Minimize form fields and retention. In particular, do not request clinical details in a marketing lead form unless the customer has an explicit, reviewed need. Dental treatment interests/free text can reveal health-related information; have the actual data notice, responsibilities, and retention reviewed by qualified counsel. Do not write legal claims or declare compliance in code.
- Remove lead email/IP/message and password/hash values from logs. Log safe event IDs and error categories only.
- Replace process-local rate limiting with a bounded mechanism that fits the deployment's proxy/process topology. Trust forwarded IP headers only from known infrastructure.
- Add field length and format validation, request-size limits, safe CSV quoting, and spreadsheet-formula injection protection for exports.

### 1.5 Credentials and bootstrap

- Remove hard-coded/default bootstrap passwords and any bootstrap behavior that overwrites an existing account password. Require explicit, strong, one-time operator-supplied provisioning with safe failure when absent.
- Separate account creation from content/database migration. Remove default admin creation from content migration paths.
- Remove password hashes and unnecessary identifiers from auth logs; avoid account-enumeration signals.
- Ignore real `.env` files and keep a tracked `.env.example` with placeholders only. Never print or copy secret values. Document rotation as a deployment-owner task if values were reused outside local development.

### 1.6 Tests for the safety boundary

Add meaningful tests for unauthenticated, viewer, editor, and admin requests to pages, actions and APIs; lead export access; public/draft post visibility; stored-XSS payloads; uploads (size, type/signature mismatch, SVG, path-like names); consent; request bounds; and safe logging. Tests must use local/disposable fixtures.

**Acceptance:** direct requests cannot bypass role checks; public callers cannot read admin/lead/analytics data or upload media; unsafe HTML and files are rejected/sanitized; drafts are private; lead submission never logs personal data; tests prove both allowed and denied behavior.

## Phase 2 — build, CI, and per-customer deployment foundation

1. Replace placeholder test/lint/type-check scripts with real deterministic commands. Add Python tests that assert expected behavior instead of only printing integration results.
2. Configure CI to install from lockfiles, generate Prisma client where appropriate, run lint/typecheck/tests/backend tests, and run a production build without contacting production databases or external analytics.
3. Make the Next.js application compatible with the selected server-capable host. The Pages `out` workflow is incompatible with the app's runtime features; do not force `output: 'export'` on the complete application.
4. Avoid removing/changing workflows until the target deployment contract is documented. Keep all deployments out of this Codex task.
5. Produce a per-customer setup/runbook: create project/deployment, provision isolated database and persistent media storage, set unique secrets/config, configure domain/SSL, create first admin safely, connect that customer's GA4/GSC property, configure Resend, verify backups/restores, and run a public-site/admin/lead smoke test.
6. Ensure a fresh second project can be configured from the same maintained codebase without copying another client's database, credentials, lead data, domain or email recipient.

**Acceptance:** real CI passes; production build requires no production secrets or live services; deployment assumptions are documented; there is a repeatable, isolated per-customer setup with no code edits for ordinary business identity/content changes.

## Phase 3 — make the site reusable without over-generalizing

- Extract business profile, theme/brand, contact details, hours, public URL, social links, CTA text, and SEO profile from hard-coded dental constants into a validated per-deployment configuration or appropriately editable content model.
- Keep vertical-specific pages and field definitions separate from shared layout/admin/lead workflow. For the first release, retain the dental pilot and make lead-form fields configurable enough to support the next chosen local-business vertical without hard-coded `treatment` logic throughout the application.
- Ensure validation supports only intended field types/limits; do not add arbitrary user-supplied HTML, executable code, or unbounded schema config.
- Add a setup checklist for required public business facts. Fail clearly in production if canonical URL or essential business identity remains an example/placeholder.
- Remove inconsistent duplicate contact values only where this can be done without changing approved public copy.
- Keep each project's users and lead data inside its own database. No tenant ID is required for this deployment model.

**Acceptance:** changing a business profile/domain/form configuration does not require editing application components; dental behavior remains covered by regression tests; a second deployment has no inherited first-customer details or secrets.

## Phase 4 — repair the current SEO implementation

Build on the existing SEO admin. Do not replace it.

### 4.1 Technical SEO fixes

- Make saved `seoTitle` and `seoDescription` render on published article pages in `<title>`, description, Open Graph and Twitter metadata. Use title/excerpt as fallbacks. Test custom and fallback cases.
- Add unique, accurate page metadata for key static routes such as About and Contact, and check all public service pages.
- Generate `/sitemap.xml` from the configured canonical origin and indexable public routes plus published posts. Exclude drafts, admin, API, preview and noindex routes. Verify valid XML and canonical host. Make `robots.ts` reference the real sitemap.
- Set canonical URL/metadata from the per-deployment profile. Do not index admin, draft, API, login, or preview routes.
- Correct GSC date filters so every visible range is accepted by the API, or remove unsupported options. Show the real data-through date/cache freshness and do not describe delayed data as current.
- Distinguish integration states: not connected, permission/configuration error, no data, and data available. Do not convert a missing property/configuration into a healthy zero report.
- Show sitemap warnings in the detail table as well as the summary.
- Label Search Console keyword/page tables as “top reported results” or equivalent, not a complete list.

### 4.2 Beginner SEO guidance inside the admin

Add practical checks and actions to existing SEO screens. Use plain Brazilian Portuguese for customer-facing guidance. Do not rely on an unexplained one-number “SEO score.” Each finding should show the exact page/setup area, what the system observed, why it matters, a specific next step/link, last-check time, and a status (`OK`, `Precisa de atenção`, `Não verificado`, or `Não se aplica`). Distinguish automated evidence from something the owner marks complete.

MVP check groups:

1. **Page metadata:** missing/duplicate/unclear titles; missing descriptions; a clear primary page heading and sensible heading order; missing canonical; accidental noindex; useful social preview. Avoid rigid title/description character pass/fail rules. Explain that Google may change/truncate titles and can generate snippets from page content rather than the meta description.
2. **Indexing basics:** valid sitemap, robots points to it, public pages are not accidentally blocked/noindex, private/draft pages are excluded, canonical host matches the deployed site.
3. **Content basics:** useful alt text for meaningful images, crawlable internal links, clear services and service area/location, consistent name/contact information. Do not encourage keyword stuffing or repeated near-duplicate pages.
4. **Local business profile:** request verified name, business type, address/service area, phone, hours and public URL. Generate LocalBusiness JSON-LD only from these verified fields and visible page content. Show validation results; never invent reviews, ratings, locations, hours, services or awards.
5. **Search Console insights:** show clicks, impressions, CTR and average position with exact date window and a comparison. Use transparent thresholds and minimum sample sizes before suggesting pages/queries to investigate (for example, impressions with relatively low CTR or meaningful click declines). If there is not enough data, say so. Link a recommendation to the actual page/setting.
6. **Learning links:** include short explanations and links to official Google Search Central guidance near each relevant check.

Never promise indexing, rankings, leads, snippets, or rich results. A sitemap can help discovery but does not guarantee indexing. Valid structured data can make pages eligible for some search features but does not guarantee display. Do not bulk-generate thin location/service pages or auto-publish AI content. Any future writing assistant must use owner-provided facts, produce drafts for human review, and avoid fabricated claims.

**Acceptance:** GSC date filters and states are correct; sitemap and page metadata tests pass; SEO findings are reproducible, dated, understandable and linked to an action; low-volume or unavailable data is labeled; no UI copy makes ranking/indexing guarantees.

## Phase 5 — add Resend notifications safely

Add email after lead authorization/privacy and per-deployment recipient configuration work.

- Persist each lead before attempting delivery. The lead API must return success when the database saved the lead even if Resend is temporarily unavailable.
- Use a durable outbox/job record or equivalent retryable flow with idempotency. Record safe delivery state, retry count, provider message ID and a non-sensitive error category.
- Keep API key, sender, reply-to and notification recipient server-side and unique to each customer deployment.
- Send a concise notification with a protected admin link; do not include unnecessary message/treatment details in email. Keep customer auto-replies out of MVP unless their content and consent behavior are explicitly defined.
- Surface pending/failed/delivered status in the admin and retry safely without duplicate messages.
- Use a mock/test provider in CI. Document sender-domain verification and operator test steps. Do not change DNS or send real emails from Codex.

**Acceptance:** a saved lead remains saved on provider failure; retried events do not duplicate notifications; state is visible and diagnosable without PII in logs; tests require no real Resend credential; settings do not cross projects.

## Phase 6 — operational readiness and pilot measurement

- Prepare an owner guide for the lead Kanban, email notifications, GA4/Search Console data freshness, and SEO recommendations.
- Verify backup/restore, export, and deletion procedures for each deployment before real customer data is onboarded.
- Track a small set of useful measures without inventing targets before pilot baselines exist: time from onboarding to site launch, successful lead persistence, time to first lead response, admin usage, analytics connection/data freshness, high-priority SEO checks resolved, and email delivery/retry status.
- Explain what the product can measure and what it cannot prove. Do not attribute an individual lead to a particular organic query unless the data actually supports that attribution.
- Use pilot feedback before building self-service onboarding, billing, extra integrations, AI SEO content generation, or a central customer control panel.

## Required completion report

For each phase, report the actual changes and changed files, commands run and their pass/fail results, tests added, decisions/assumptions, migrations not applied to production, and operator steps left for the owner. State what was verified and what remains unknown. Do not claim the site is secure, compliant, SEO-optimized, indexed, or production-ready solely because code tests pass.

## Official references for SEO behavior

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Title links](https://developers.google.com/search/docs/appearance/title-link)
- [Snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Sitemap creation and submission](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Search Console Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query) — results are not guaranteed to contain every row.
- [Google spam policies, including scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies)
- [Brazilian LGPD text](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) — have the actual data notice and responsibilities reviewed by qualified counsel.
